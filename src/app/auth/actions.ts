'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const selectedRole = formData.get('role') as string

    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return redirect('/login?error=Invalid email or password')
    }

    const actualRole = data.user.user_metadata?.role || 'customer'

    if (selectedRole && actualRole !== selectedRole) {
        await supabase.auth.signOut()
        return redirect(`/login?error=Invalid account type. Please login as ${actualRole}.`)
    }

    revalidatePath('/', 'layout')
    redirect(`/dashboard/${actualRole}`)
}

export async function register(formData: FormData) {
    const supabase = createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string

    const full_name = formData.get('full_name') as string
    const phone = formData.get('phone') as string
    const age = formData.get('age') as string
    const location = formData.get('location') as string

    // Worker specifics
    const profession = formData.get('profession') as string
    const experience_years = formData.get('experience_years') as string
    const aadhar_number = formData.get('aadhar_number') as string
    const blood_group = formData.get('blood_group') as string
    const certificates_file = formData.get('certificates') as File | null
    const profile_picture = formData.get('profile_picture') as File | null

    if (!role) {
        return redirect('/register?error=Please select a role')
    }

    // Step 1: Sign up the user first (no session yet, so no file uploads here)
    const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                role,
                full_name,
                phone,
                age,
                location,
                profession,
                experience_years,
                aadhar_number,
                blood_group,
            }
        }
    })

    if (signUpError) {
        return redirect(`/register?error=${signUpError.message}`)
    }

    // Step 2: Sign in to get an authenticated session for Storage uploads
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
        // Account created but login failed — redirect to login page
        return redirect(`/login?error=Account created! Please log in.`)
    }

    // Step 3: Upload files now that we have an authenticated session
    let profile_picture_url = null
    let certificates_url = null

    const uploadFile = async (file: File, prefix: string) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

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
        if (profile_picture && profile_picture.size > 0) {
            profile_picture_url = await uploadFile(profile_picture, 'avatar')
        }
        if (certificates_file && certificates_file.size > 0) {
            certificates_url = await uploadFile(certificates_file, 'cert')
        }
    } catch (uploadError: unknown) {
        const message = uploadError instanceof Error ? uploadError.message : 'Unknown error'
        // Non-fatal: account is created, just redirect without file URLs
        console.error('File upload error (non-fatal):', message)
    }

    // Step 4: Update user metadata with file URLs if any were uploaded
    if (profile_picture_url || certificates_url) {
        await supabase.auth.updateUser({
            data: {
                profile_picture_url,
                certificates: certificates_url,
            }
        })
    }

    revalidatePath('/', 'layout')
    redirect(`/dashboard/${role}`)
}

export async function signout() {
    const supabase = createClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    redirect('/login')
}
