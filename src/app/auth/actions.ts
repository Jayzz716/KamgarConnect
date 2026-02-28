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

    if (!role) {
        return redirect('/register?error=Please select a role')
    }

    const { error } = await supabase.auth.signUp({
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
                aadhar_number
            }
        }
    })

    if (error) {
        return redirect(`/register?error=${error.message}`)
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
