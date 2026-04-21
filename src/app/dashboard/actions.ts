'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function postJob(formData: FormData) {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // --- FIX: Check if profile exists, if not create a fallback profile ---
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

    if (!profile) {
        // Create a fallback profile so the foreign key constraint passes
        const { error: profileError } = await supabase.from('profiles').insert({
            id: user.id,
            role: 'customer',
            full_name: user.user_metadata?.full_name || 'Customer User',
            phone: user.user_metadata?.phone || '',
            location: user.user_metadata?.location || ''
        })
        if (profileError) {
            console.error('Error creating fallback profile:', profileError)
            throw new Error('Could not create user profile.')
        }
    }
    // ----------------------------------------------------------------------

    const title = formData.get('title') as string
    const location = formData.get('location') as string
    const budget = formData.get('budget') ? Number(formData.get('budget')) : null
    const required_profession = formData.get('required_profession') as string

    // Extended details packed into description JSON
    const descriptionText = formData.get('description') as string
    const is_urgent = formData.get('is_urgent') === 'on'
    const job_type = formData.get('job_type') as string

    const packedDescription = JSON.stringify({
        text: descriptionText,
        is_urgent,
        job_type
    })

    const { error } = await supabase
        .from('jobs')
        .insert({
            customer_id: user.id,
            title,
            description: packedDescription,
            required_profession,
            location,
            budget,
            status: 'open'
        })

    if (error) {
        console.error('Error posting job:', error)
        throw new Error('Failed to post job: ' + error.message)
    }

    revalidatePath('/dashboard/customer')
}

export async function applyForJob(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const job_id = formData.get('job_id') as string

    const { error } = await supabase.from('job_applications').insert({
        job_id,
        worker_id: user.id,
        status: 'pending'
    })

    if (error) {
        if (error.code === '23505') return // Already applied (unique constraint)
        throw new Error('Failed to apply for job')
    }

    revalidatePath('/dashboard/worker')
}

export async function acceptWorker(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const job_id = formData.get('job_id') as string
    const worker_id = formData.get('worker_id') as string

    // 1. Update the job to assign the worker and set status to in_progress
    const { error: jobError } = await supabase
        .from('jobs')
        .update({
            assigned_worker_id: worker_id,
            status: 'in_progress'
        })
        .eq('id', job_id)
        .eq('customer_id', user.id) // Ensure only the owner can do this

    if (jobError) throw new Error('Failed to assign worker')

    // 2. Update the specific application to accepted
    await supabase
        .from('job_applications')
        .update({ status: 'accepted' })
        .eq('job_id', job_id)
        .eq('worker_id', worker_id)

    // 3. Update all other applications for this job to rejected
    await supabase
        .from('job_applications')
        .update({ status: 'rejected' })
        .eq('job_id', job_id)
        .neq('worker_id', worker_id)

    revalidatePath('/dashboard/customer')
}

export async function updateProfile(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const full_name = formData.get('full_name') as string
    const phone = formData.get('phone') as string
    const location = formData.get('location') as string
    const blood_group = formData.get('blood_group') as string

    const profession = formData.get('profession') as string
    const experience_years = formData.get('experience_years') ? Number(formData.get('experience_years')) : null

    // File uploads
    const profile_picture = formData.get('profile_picture') as File | null
    const certificates_file = formData.get('certificates') as File | null

    let profile_picture_url = null
    let certificates_url = null

    // Helper function for uploading to Supabase Storage
    const uploadFile = async (file: File | null, prefix: string) => {
        if (!file || file.size === 0) return null
        const fileExt = file.name.split('.').pop()
        const fileName = `${prefix}-${user.id}-${Date.now()}.${fileExt}`

        const { error } = await supabase.storage
            .from('avatars')
            .upload(fileName, file)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName)

        return publicUrl
    }

    try {
        profile_picture_url = await uploadFile(profile_picture, 'avatar')
        certificates_url = await uploadFile(certificates_file, 'cert')
    } catch (err: any) {
        console.error('File upload error:', err)
        throw new Error('Failed to upload files: ' + err.message)
    }

    const updateData: any = {
        full_name,
        phone,
        location,
        blood_group,
        profession,
        experience_years,
        updated_at: new Date().toISOString()
    }

    if (profile_picture_url) updateData.profile_picture_url = profile_picture_url
    if (certificates_url) updateData.certificates = certificates_url

    const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

    if (error) throw new Error('Failed to update profile: ' + error.message)

    revalidatePath('/dashboard/customer')
    revalidatePath('/dashboard/worker')
}

export async function markJobDone(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const job_id = formData.get('job_id') as string

    // 1. Fetch the job to get assigned_worker_id and budget BEFORE updating
    const { data: jobData, error: fetchError } = await supabase
        .from('jobs')
        .select('assigned_worker_id, budget')
        .eq('id', job_id)
        .eq('customer_id', user.id)
        .single()

    if (fetchError || !jobData) throw new Error('Job not found or access denied')

    // 2. Mark the job as completed
    const { error } = await supabase
        .from('jobs')
        .update({ status: 'completed' })
        .eq('id', job_id)
        .eq('customer_id', user.id)

    if (error) throw new Error('Failed to mark job as done: ' + error.message)

    // 3. Update the worker's monthly_revenue if there's a budget and an assigned worker
    if (jobData.assigned_worker_id && jobData.budget) {
        const { data: workerProfile } = await supabase
            .from('profiles')
            .select('monthly_revenue')
            .eq('id', jobData.assigned_worker_id)
            .single()

        const currentRevenue = workerProfile?.monthly_revenue || 0
        await supabase
            .from('profiles')
            .update({ monthly_revenue: currentRevenue + jobData.budget })
            .eq('id', jobData.assigned_worker_id)
    }

    // 4. Revalidate both dashboards so:
    //    - Worker's history tab auto-updates
    //    - Worker sees the completed job immediately
    revalidatePath('/dashboard/customer')
    revalidatePath('/dashboard/worker')
}

export async function rateWorker(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const worker_id = formData.get('worker_id') as string
    const rating = parseInt(formData.get('rating') as string)
    const job_id = formData.get('job_id') as string

    if (isNaN(rating) || rating < 1 || rating > 5) {
        throw new Error('Invalid rating value')
    }

    // Increment the worker's rating sum and count atomically using RPC
    // Since we can't do atomic increment easily, we fetch then update
    const { data: profile } = await supabase
        .from('profiles')
        .select('rating_sum, rating_count')
        .eq('id', worker_id)
        .single()

    if (!profile) throw new Error('Worker not found')

    const { error: ratingError } = await supabase
        .from('profiles')
        .update({
            rating_sum: (profile.rating_sum || 0) + rating,
            rating_count: (profile.rating_count || 0) + 1
        })
        .eq('id', worker_id)

    if (ratingError) throw new Error('Failed to submit rating: ' + ratingError.message)

    // Mark this specific job application as rated by setting a flag on the job
    await supabase
        .from('jobs')
        .update({ is_rated: true })
        .eq('id', job_id)
        .eq('customer_id', user.id)

    revalidatePath('/dashboard/customer')
}
