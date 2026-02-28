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

    const { error } = await supabase
        .from('profiles')
        .update({ full_name, phone, location })
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

    const { error } = await supabase
        .from('jobs')
        .update({ status: 'completed' })
        .eq('id', job_id)
        .eq('customer_id', user.id) // Only the customer who posted the job can mark it done

    if (error) throw new Error('Failed to mark job as done: ' + error.message)

    revalidatePath('/dashboard/customer')
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
