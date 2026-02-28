'use client'

import { login } from '@/app/auth/actions'
import Link from 'next/link'
import { ArrowRight, Mail, Lock, Home, User, Briefcase } from 'lucide-react'
import { MouseTrail } from '@/components/MouseTrail'
import { useState } from 'react'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { error?: string }
}) {
    const [role, setRole] = useState<'customer' | 'worker'>('customer')

    return (
        <div className="flex min-h-screen items-center justify-center p-4 relative overflow-hidden bg-slate-50">
            <MouseTrail />
            {/* Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Home Button */}
            <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-slate-200 shadow-sm transition-all hover:shadow-md z-20">
                <Home className="w-4 h-4" /> Home
            </Link>

            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-3xl z-10 border border-slate-200 shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-slate-500 text-sm">Sign in to KamgarConnect</p>
                </div>

                <form className="space-y-6">
                    {searchParams?.error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl text-center font-medium">
                            {searchParams.error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <label className="relative cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="customer"
                                    className="peer sr-only"
                                    checked={role === 'customer'}
                                    onChange={() => setRole('customer')}
                                    required
                                />
                                <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-100 bg-white peer-checked:bg-blue-50 peer-checked:border-blue-500 hover:bg-slate-50 transition-all">
                                    <User className={`h-8 w-8 mb-2 ${role === 'customer' ? 'text-blue-600' : 'text-slate-400'}`} />
                                    <span className={`text-sm font-bold ${role === 'customer' ? 'text-blue-700' : 'text-slate-600'}`}>Customer</span>
                                </div>
                            </label>
                            <label className="relative cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="worker"
                                    className="peer sr-only"
                                    checked={role === 'worker'}
                                    onChange={() => setRole('worker')}
                                    required
                                />
                                <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-100 bg-white peer-checked:bg-indigo-50 peer-checked:border-indigo-500 hover:bg-slate-50 transition-all">
                                    <Briefcase className={`h-8 w-8 mb-2 ${role === 'worker' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                    <span className={`text-sm font-bold ${role === 'worker' ? 'text-indigo-700' : 'text-slate-600'}`}>Worker</span>
                                </div>
                            </label>
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <button
                        formAction={login}
                        className={`w-full group text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg ${role === 'customer'
                            ? 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'
                            : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5'
                            }`}
                    >
                        Sign In
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 text-center text-sm font-medium text-slate-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-blue-600 hover:text-blue-700 transition-colors">
                        Create one
                    </Link>
                </div>
            </div>
        </div>
    )
}
