import { Briefcase, MapPin, Star, IndianRupee, CheckCircle2, History, Banknote, User, Pencil, Phone } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { applyForJob, updateProfile } from '@/app/dashboard/actions'
import Link from 'next/link'

function parseDescription(desc: string) {
    try {
        return JSON.parse(desc)
    } catch {
        return { text: desc, is_urgent: false, job_type: 'General' }
    }
}

export default async function WorkerDashboard({
    searchParams,
}: {
    searchParams: { tab?: string }
}) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const currentTab = searchParams.tab || 'current'

    // Fetch the worker's profile to get their profession and details
    const { data: profile } = await supabase
        .from('profiles')
        .select('profession, experience_years, full_name, phone, location, is_active, blood_group, profile_picture_url, certificates')
        .eq('id', user.id)
        .single()

    const workerProfession = profile?.profession || ''

    // Shared Tab Queries

    // --- TAB: CURRENT (Available & Accepted Jobs) ---
    let openJobs: any[] = []
    let applications: any[] = []
    let appliedJobIds = new Set<string>()
    let applicationStatusMap = new Map<string, string>()

    if (currentTab === 'current') {
        const { data: fetchJobs } = await supabase
            .from('jobs')
            .select('*')
            .eq('status', 'open')
            .eq('required_profession', workerProfession)
            .order('created_at', { ascending: false })

        openJobs = fetchJobs || []

        const { data: fetchApps } = await supabase
            .from('job_applications')
            .select(`
                job_id, 
                status,
                jobs!inner(*)
            `)
            .eq('worker_id', user.id)

        applications = fetchApps || []

        // Include jobs the worker has been accepted for in the "Current" view
        const acceptedJobs = applications.filter(app => app.status === 'accepted').map(app => app.jobs)
        openJobs = [...acceptedJobs, ...openJobs]

        appliedJobIds = new Set(applications.map(app => app.job_id))
        applicationStatusMap = new Map(applications.map(app => [app.job_id, app.status]))
    }

    // --- TAB: HISTORY & INCOME ---
    let completedApplications: any[] = []
    let totalIncome = 0

    if (currentTab === 'history' || currentTab === 'income') {
        const { data: fetchHistory } = await supabase
            .from('job_applications')
            .select(`
                id,
                status,
                jobs!inner (
                    id,
                    title,
                    description,
                    location,
                    budget,
                    status,
                    profiles ( full_name )
                )
            `)
            .eq('worker_id', user.id)
            .eq('status', 'accepted')
            .eq('jobs.status', 'completed')

        completedApplications = fetchHistory || []

        if (currentTab === 'income') {
            totalIncome = completedApplications.reduce((sum, app) => sum + (app.jobs.budget || 0), 0)
        }
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 text-slate-200">
            {/* Sidebar */}
            <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
                <div className="mb-6 px-4">
                    <h2 className="text-xl font-bold text-white mb-1">Navigation</h2>
                    <p className="text-xs text-slate-500">Manage your work</p>
                </div>

                <Link href="/dashboard/worker?tab=current" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${currentTab === 'current' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <Briefcase className="w-5 h-5" /> Current Jobs
                </Link>
                <Link href="/dashboard/worker?tab=history" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${currentTab === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <History className="w-5 h-5" /> Job History
                </Link>
                <Link href="/dashboard/worker?tab=income" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${currentTab === 'income' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <Banknote className="w-5 h-5" /> Total Income
                </Link>
                <Link href="/dashboard/worker?tab=profile" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${currentTab === 'profile' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <User className="w-5 h-5" /> Edit Profile
                </Link>

                {/* Status Toggle */}
                <div className="mt-auto pt-8 px-4">
                    <div className="bg-[#1C1F26] p-4 rounded-xl border border-white/5 text-center">
                        <span className="text-xs font-semibold text-slate-500 block mb-2">Availability Status</span>
                        <span className={`block text-sm font-bold px-4 py-2 rounded-lg ${profile?.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                            {profile?.is_active ? 'Online & Available' : 'Offline'}
                        </span>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 bg-[#1C1F26]/50 border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl min-h-[600px]">

                {/* --- CURRENT JOBS TAB --- */}
                {currentTab === 'current' && (
                    <>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Available & Active Jobs</h1>
                            <p className="text-slate-400">
                                Showing jobs for: <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">{workerProfession || 'Your Profession'}</span>
                            </p>
                        </div>



                        {openJobs.length === 0 ? (
                            <div className="bg-[#1C1F26] border border-white/5 p-12 rounded-3xl text-center max-w-2xl mx-auto shadow-2xl mt-12">
                                <div className="w-16 h-16 bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Briefcase className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1">No jobs available right now</h3>
                                <p className="text-slate-400 mb-4">There are currently no open jobs requesting a {workerProfession}. Please check back later.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {openJobs.map((job) => {
                                    const details = parseDescription(job.description)
                                    const hasApplied = appliedJobIds.has(job.id)
                                    const appStatus = applicationStatusMap.get(job.id)

                                    return (
                                        /* Premium Dark Theme Card */
                                        <div key={job.id} className="bg-[#1C1F26] border border-white/5 p-6 rounded-2xl relative shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">

                                            <div className="flex justify-between items-start mb-6">
                                                {/* Icon Box */}
                                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner group-hover:scale-110 transition-transform">
                                                    <Briefcase className="h-6 w-6 text-indigo-400" />
                                                </div>

                                                {/* Badges */}
                                                <div className="flex flex-col items-end gap-2">
                                                    {/* Star Rating Equivalent for urgency */}
                                                    <div className="flex flex-col items-end gap-2 text-right">
                                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md shadow-inner flex items-center gap-1 ${details.is_urgent ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-yellow-400/10 text-yellow-500 border border-yellow-400/20'
                                                            }`}>
                                                            <Star className="h-3.5 w-3.5 fill-current" />
                                                            {details.is_urgent ? 'URGENT' : 'NEW'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Job Title */}
                                            <h3 className="text-xl font-bold text-white mb-2 leading-tight">{job.title}</h3>
                                            <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">{details.text}</p>

                                            {/* Location */}
                                            <p className="text-sm text-slate-400 mb-5 flex items-center gap-1.5 font-medium">
                                                <MapPin className="h-4 w-4 text-slate-500" /> {job.location}
                                            </p>

                                            {/* Tags mapping to User's Job Type visual reference */}
                                            <div className="flex flex-wrap gap-2 text-xs font-semibold mb-6">
                                                <span className="bg-white/5 border border-white/10 text-slate-300 px-3 py-1.5 rounded-lg">
                                                    {details.job_type}
                                                </span>

                                                {job.budget && (
                                                    <span className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1.5 rounded-lg flex items-center shadow-inner">
                                                        <IndianRupee className="h-3 w-3 mr-0.5" /> {job.budget}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Call To Action Buttons */}
                                            <div className="mt-auto pt-4 border-t border-white/5">
                                                {hasApplied ? (
                                                    appStatus === 'accepted' ? (
                                                        <div className="w-full text-center py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-sm font-bold text-indigo-400 flex items-center justify-center gap-2">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Job Assigned to You
                                                        </div>
                                                    ) : (
                                                        <div className="w-full text-center py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-slate-400 flex items-center justify-center gap-2">
                                                            <CheckCircle2 className="w-4 h-4 text-slate-500" />
                                                            Waiting for Customer Approval
                                                        </div>
                                                    )
                                                ) : (
                                                    <form action={applyForJob}>
                                                        <input type="hidden" name="job_id" value={job.id} />
                                                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg hover:shadow-indigo-500/25">
                                                            Apply for Job
                                                        </button>
                                                    </form>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* --- HISTORY TAB --- */}
                {currentTab === 'history' && (
                    <>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Job History</h1>
                            <p className="text-slate-400">Past jobs you have successfully completed.</p>
                        </div>

                        {completedApplications.length === 0 ? (
                            <div className="bg-[#1C1F26] border border-white/5 p-12 rounded-3xl text-center shadow-xl">
                                <History className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-white mb-1">No completed jobs yet</h3>
                                <p className="text-slate-400">Jobs you finish will appear here.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {completedApplications.map(app => {
                                    const job = app.jobs
                                    const details = parseDescription(job.description)
                                    return (
                                        <div key={job.id} className="bg-[#1C1F26] border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6 shadow-xl">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                                                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{details.text}</p>
                                                <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
                                                    <span className="flex items-center gap-1"><User className="w-4 h-4" /> {job.profiles.full_name}</span>
                                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-start md:items-end justify-center shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                                                <div className="text-sm text-slate-400 mb-1">Earned</div>
                                                <div className="text-2xl font-bold text-green-400 flex items-center">
                                                    <IndianRupee className="w-5 h-5 mr-1" />{job.budget || 0}
                                                </div>
                                                <div className="mt-2 text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded">COMPLETED</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* --- TOTAL INCOME TAB --- */}
                {currentTab === 'income' && (
                    <>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Total Income</h1>
                            <p className="text-slate-400">Summary of your earnings on KamgarConnect.</p>
                        </div>

                        <div className="bg-gradient-to-br from-[#1C1F26] to-[#0F1115] border border-white/10 p-10 rounded-3xl shadow-2xl relative overflow-hidden max-w-2xl mx-auto">
                            <div className="absolute -top-24 -right-24 text-green-500/5 rotate-12 pointer-events-none">
                                <IndianRupee className="w-96 h-96" />
                            </div>

                            <div className="relative z-10 text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 text-green-400 rounded-2xl mb-6 border border-green-500/20 shadow-inner">
                                    <Banknote className="w-10 h-10" />
                                </div>
                                <h2 className="text-slate-400 font-semibold mb-2">Lifetime Earnings</h2>
                                <div className="text-6xl font-black text-white flex items-center justify-center tracking-tight">
                                    <IndianRupee className="w-12 h-12 text-green-400 mr-2" />{totalIncome.toLocaleString('en-IN')}
                                </div>
                                <p className="text-sm font-medium text-slate-500 mt-6">
                                    From {completedApplications.length} completed job{completedApplications.length === 1 ? '' : 's'}
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {/* --- EDIT PROFILE TAB --- */}
                {currentTab === 'profile' && (
                    <div className="max-w-xl">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
                            <p className="text-slate-400">Update your contact details and location.</p>
                        </div>

                        <form action={updateProfile} className="space-y-4 bg-[#1C1F26] border border-white/5 p-6 rounded-3xl shadow-xl">
                            <div>
                                <label className="block text-sm font-semibold text-slate-400 mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                    <input
                                        name="full_name"
                                        type="text"
                                        defaultValue={profile?.full_name || ''}
                                        required
                                        className="w-full bg-[#0F1115] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-400 mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                    <input
                                        name="phone"
                                        type="tel"
                                        defaultValue={profile?.phone || ''}
                                        required
                                        className="w-full bg-[#0F1115] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-1">Profession</label>
                                    <select
                                        name="profession"
                                        defaultValue={profile?.profession || ''}
                                        required
                                        className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium appearance-none"
                                    >
                                        <option value="Electrician">Electrician</option>
                                        <option value="Plumber">Plumber</option>
                                        <option value="Carpenter">Carpenter</option>
                                        <option value="Painter">Painter</option>
                                        <option value="Mason">Mason / Construction</option>
                                        <option value="Cleaner">Maid / Cleaner</option>
                                        <option value="Driver">Driver</option>
                                        <option value="Technician">Appliance Technician</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-1">Experience (Years)</label>
                                    <input
                                        name="experience_years"
                                        type="number"
                                        defaultValue={profile?.experience_years || 0}
                                        required
                                        className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-400 mb-1">Location / Area</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                    <input
                                        name="location"
                                        type="text"
                                        defaultValue={profile?.location || ''}
                                        required
                                        className="w-full bg-[#0F1115] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-400 mb-1">Blood Group</label>
                                <select
                                    name="blood_group"
                                    defaultValue={profile?.blood_group || ''}
                                    className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium appearance-none"
                                >
                                    <option value="">Select Blood Group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-1">Profile Picture</label>
                                    <input
                                        name="profile_picture"
                                        type="file"
                                        accept="image/*"
                                        className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 transition-all"
                                    />
                                    {profile?.profile_picture_url && (
                                        <p className="text-xs text-green-400 mt-1">Current picture exists</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-1">Certificates (PDF/Image)</label>
                                    <input
                                        name="certificates"
                                        type="file"
                                        accept="image/*,application/pdf"
                                        className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 transition-all"
                                    />
                                    {profile?.certificates && (
                                        <p className="text-xs text-green-400 mt-1">Current certificates uploaded</p>
                                    )}
                                </div>
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2"
                                >
                                    <Pencil className="w-4 h-4" /> Save Profile Details
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    )
}
