import { Briefcase, MapPin, Plus, Zap, AlertCircle, CheckCircle2, UserCircle, Star, Pencil, Phone, User, PartyPopper, Activity, Award } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { postJob, acceptWorker, updateProfile, markJobDone } from '@/app/dashboard/actions'

import StarRating from './StarRating'
import Link from 'next/link'


function parseDescription(desc: string) {
    try {
        return JSON.parse(desc)
    } catch {
        return { text: desc, is_urgent: false, job_type: 'General' }
    }
}

export default async function CustomerDashboard({
    searchParams,
}: {
    searchParams: { tab?: string }
}) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const currentTab = searchParams.tab || 'post'

    // Fetch real jobs posted by this customer, including applications and the worker's profile
    const { data: jobs } = await supabase
        .from('jobs')
        .select(`
      *,
      job_applications (
        id,
        status,
        worker_id,
        profiles (
          full_name,
          phone,
          profession,
          location,
          experience_years,
          rating_sum,
          rating_count,
          blood_group,
          profile_picture_url,
          certificates
        )
      )
    `)
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false })



    // Fetch this customer's own profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone, location, blood_group, profile_picture_url')
        .eq('id', user.id)
        .single()

    // Separate jobs by history versus active
    const activeJobs = jobs?.filter(job => job.status !== 'completed') || []
    const completedJobs = jobs?.filter(job => job.status === 'completed') || []

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 text-slate-200">
            {/* Sidebar */}
            <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
                <div className="mb-6 px-4">
                    <h2 className="text-xl font-bold text-white mb-1">Navigation</h2>
                    <p className="text-xs text-slate-500">Manage your jobs</p>
                </div>

                <Link href="/dashboard/customer?tab=post" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${currentTab === 'post' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <Plus className="w-5 h-5" /> Post & Manage
                </Link>
                <Link href="/dashboard/customer?tab=history" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${currentTab === 'history' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <Briefcase className="w-5 h-5" /> Job History
                </Link>
                <Link href="/dashboard/customer?tab=profile" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold ${currentTab === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <User className="w-5 h-5" /> Edit Profile
                </Link>

                {/* Stats Widget */}
                <div className="mt-auto pt-8 px-4">
                    <div className="bg-[#1C1F26] p-4 rounded-xl border border-white/5 text-center flex justify-between items-center">
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-blue-400">{activeJobs.length}</span>
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Active</span>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-green-400">{completedJobs.length}</span>
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Done</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 bg-[#1C1F26]/50 border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl min-h-[600px]">

                {/* --- POST & MANAGE TAB --- */}
                {currentTab === 'post' && (
                    <>
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Post a New Job</h1>
                            <p className="text-slate-400">Fill out the details below to find the right worker for your task.</p>
                        </div>
                        <div className="bg-[#1C1F26] border text-left border-white/5 shadow-2xl rounded-3xl p-6 sticky top-24 relative overflow-hidden">
                            {/* Subtle glow effect */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Plus className="h-5 w-5 text-blue-400" /> Post a New Job
                            </h2>

                            <form action={postJob} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-1">Job Title</label>
                                    <input
                                        name="title"
                                        type="text"
                                        required
                                        placeholder="e.g. Need AC Installation"
                                        className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-1">Required Profession</label>
                                    <select
                                        name="required_profession"
                                        required
                                        className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium appearance-none"
                                    >
                                        <option value="">Select Profession</option>
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

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-400 mb-1">Job Type</label>
                                        <select
                                            name="job_type"
                                            required
                                            className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium appearance-none"
                                        >
                                            <option value="Repair">Repair</option>
                                            <option value="Installation">Installation</option>
                                            <option value="Maintenance">Maintenance</option>
                                            <option value="Consultation">Consultation</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-400 mb-1">Budget (₹)</label>
                                        <input
                                            name="budget"
                                            type="number"
                                            placeholder="e.g. 1500"
                                            className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-1">Location</label>
                                    <input
                                        name="location"
                                        type="text"
                                        required
                                        placeholder="Exact Location/Area"
                                        className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-1">Description Details</label>
                                    <textarea
                                        name="description"
                                        required
                                        placeholder="Describe what needs to be done..."
                                        className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium min-h-[100px]"
                                    />
                                </div>

                                <div className="flex items-center gap-2 px-1 pb-2">
                                    <input type="checkbox" name="is_urgent" id="is_urgent" className="w-4 h-4 rounded bg-[#0F1115] border-white/20 text-blue-500 focus:ring-blue-500/50" />
                                    <label htmlFor="is_urgent" className="text-sm font-semibold text-red-400 flex items-center gap-1 cursor-pointer">
                                        <AlertCircle className="w-4 h-4" /> Mark as Urgent
                                    </label>
                                </div>

                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]">
                                    Post Job
                                </button>
                            </form>
                        </div>
                        <div className="space-y-6 mt-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Active Jobs & Applications</h2>

                            {activeJobs.length === 0 ? (
                                <div className="bg-[#1C1F26] border border-white/5 p-12 rounded-3xl text-center shadow-xl">
                                    <div className="w-16 h-16 bg-[#0F1115] border border-white/5 text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Briefcase className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">No active jobs</h3>
                                    <p className="text-slate-400">Fill out the form above to post your first job!</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {activeJobs.map((job) => {
                                        const details = parseDescription(job.description)

                                        // applications typed properly since supabase join shapes the data
                                        const applications: { id: string, status: string, worker_id: string, profiles: { full_name: string, phone: string, profession: string, location: string, experience_years: number, rating_sum: number, rating_count: number, blood_group: string | null, profile_picture_url: string | null, certificates: string | null } }[] = job.job_applications || []
                                        const pendingApplicants = applications.filter(a => a.status === 'pending')
                                        const assignedWorkerApp = applications.find(a => a.status === 'accepted')

                                        return (
                                            <div key={job.id} className="bg-[#1C1F26] border border-white/5 p-6 md:p-8 rounded-3xl shadow-xl hover:-translate-y-0.5 transition-transform flex flex-col md:flex-row gap-8 relative overflow-hidden group">

                                                {/* Status Badge */}
                                                <div className={`absolute top-6 right-6 text-xs font-bold px-3 py-1 rounded-full shadow-inner ${job.status === 'open' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                    job.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                        'bg-slate-800 text-slate-400 border border-slate-700'
                                                    }`}>
                                                    {job.status.replace('_', ' ').toUpperCase()}
                                                </div>

                                                {/* Job Details Section */}
                                                <div className="flex-1">
                                                    <div className="text-xs font-bold text-blue-400 mb-2 bg-blue-500/10 border border-blue-500/20 inline-block px-2.5 py-1 rounded-md shadow-inner">
                                                        {job.required_profession}
                                                    </div>
                                                    <h3 className="text-2xl font-bold text-white leading-tight mb-2 pr-20">{job.title}</h3>

                                                    <p className="text-slate-400 text-sm mb-6 leading-relaxed bg-[#0F1115] p-3 rounded-xl border border-white/5">{details.text}</p>

                                                    <div className="flex items-center gap-4 text-sm text-slate-400 font-medium mb-4">
                                                        <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md"><MapPin className="w-4 h-4 text-slate-500" /> {job.location}</span>
                                                        {job.budget && <span className="flex items-center gap-1 font-bold text-white bg-white/5 px-2 py-1 rounded-md">₹{job.budget}</span>}
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                                                        <span className="bg-white/5 text-slate-300 border border-white/10 px-3 py-1.5 rounded-lg">{details.job_type}</span>
                                                        {details.is_urgent && (
                                                            <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-inner">
                                                                <Zap className="w-3 h-3" /> Urgent
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Applications Section */}
                                                <div className="w-full md:w-72 flex flex-col pt-6 md:pt-0 md:border-l border-white/5 md:pl-8">
                                                    <h4 className="text-sm font-bold text-slate-300 mb-4 tracking-wide uppercase">Worker Status</h4>

                                                    {/* Worker Status */}
                                                    {job.status === 'completed' ? (
                                                        /* === COMPLETED: Show rating form if not rated === */
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2 text-green-400 font-bold text-sm mb-3">
                                                                <PartyPopper className="w-4 h-4" />
                                                                Job Completed!
                                                            </div>
                                                            {assignedWorkerApp && (
                                                                <div className="bg-[#0F1115] border border-white/5 p-3 rounded-xl">
                                                                    <div className="flex items-center gap-3 mb-3">
                                                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                                                                            {assignedWorkerApp.profiles.profile_picture_url ? (
                                                                                <img src={assignedWorkerApp.profiles.profile_picture_url} className="w-full h-full object-cover" alt="Profile" />
                                                                            ) : (
                                                                                <UserCircle className="w-6 h-6 text-slate-500" />
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-white font-bold text-sm">{assignedWorkerApp.profiles.full_name}</p>
                                                                            <p className="text-xs text-slate-400">{assignedWorkerApp.profiles.profession} • {assignedWorkerApp.profiles.experience_years} yrs exp</p>
                                                                        </div>
                                                                    </div>
                                                                    {(job as { is_rated?: boolean }).is_rated ? (
                                                                        <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                                                                            <Star className="w-4 h-4 fill-current" /> Already Rated!
                                                                        </div>
                                                                    ) : (
                                                                        <StarRating jobId={job.id} workerId={assignedWorkerApp.worker_id} />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : job.assigned_worker_id && assignedWorkerApp ? (
                                                        /* === IN PROGRESS: Full Worker Profile + Mark as Done === */
                                                        <div className="space-y-3">
                                                            <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-xl">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                                    <span className="text-sm font-bold text-green-400">Worker Assigned</span>
                                                                </div>
                                                                {/* Worker Profile Card */}
                                                                <div className="flex items-center gap-3 mb-3">
                                                                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 overflow-hidden">
                                                                        {assignedWorkerApp.profiles.profile_picture_url ? (
                                                                            <img src={assignedWorkerApp.profiles.profile_picture_url} className="w-full h-full object-cover" alt="Profile" />
                                                                        ) : (
                                                                            <UserCircle className="w-6 h-6 text-indigo-400" />
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-white font-bold text-base leading-tight">{assignedWorkerApp.profiles.full_name}</p>
                                                                        <p className="text-indigo-400 text-xs font-semibold">{assignedWorkerApp.profiles.profession} • {assignedWorkerApp.profiles.experience_years} yrs exp</p>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1.5 text-xs mb-3">
                                                                    <div className="flex items-center gap-2 text-slate-400">
                                                                        <Phone className="w-3 h-3 shrink-0" />
                                                                        <span className="font-mono bg-[#0F1115] px-2 py-0.5 rounded text-slate-300">{assignedWorkerApp.profiles.phone || 'N/A'}</span>
                                                                    </div>
                                                                    {assignedWorkerApp.profiles.location && (
                                                                        <div className="flex items-center gap-2 text-slate-400">
                                                                            <MapPin className="w-3 h-3 shrink-0" />
                                                                            <span>{assignedWorkerApp.profiles.location}</span>
                                                                        </div>
                                                                    )}
                                                                    {assignedWorkerApp.profiles.blood_group && (
                                                                        <div className="flex items-center gap-2 text-slate-400">
                                                                            <Activity className="w-3 h-3 shrink-0" />
                                                                            <span>Blood Group: <span className="text-slate-300 font-semibold">{assignedWorkerApp.profiles.blood_group}</span></span>
                                                                        </div>
                                                                    )}
                                                                    {assignedWorkerApp.profiles.certificates && (
                                                                        <div className="flex items-start gap-2 text-slate-400">
                                                                            <Award className="w-3 h-3 shrink-0 mt-0.5" />
                                                                            <span>Certs: <a href={assignedWorkerApp.profiles.certificates} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">View Certificate</a></span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex items-center gap-2 text-slate-400">
                                                                        <Star className="w-3 h-3 text-yellow-500 fill-current shrink-0" />
                                                                        <span>
                                                                            {assignedWorkerApp.profiles.rating_count > 0
                                                                                ? `${(assignedWorkerApp.profiles.rating_sum / assignedWorkerApp.profiles.rating_count).toFixed(1)} / 5 (${assignedWorkerApp.profiles.rating_count} reviews)`
                                                                                : 'No ratings yet'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                {/* Mark as Done Button */}
                                                                <form action={markJobDone}>
                                                                    <input type="hidden" name="job_id" value={job.id} />
                                                                    <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/25">
                                                                        <CheckCircle2 className="w-4 h-4" /> Mark as Done
                                                                    </button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    ) : pendingApplicants.length > 0 ? (
                                                        <div className="space-y-3">
                                                            <p className="text-xs text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded inline-block mb-1">{pendingApplicants.length} Worker(s) Applied!</p>
                                                            {pendingApplicants.map(app => (
                                                                <div key={app.id} className="bg-[#0F1115] border border-white/5 p-3 rounded-xl shadow-sm">
                                                                    <div className="flex flex-col gap-3 mb-3">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                                                                                {app.profiles.profile_picture_url ? (
                                                                                    <img src={app.profiles.profile_picture_url} className="w-full h-full object-cover" alt="Profile" />
                                                                                ) : (
                                                                                    <UserCircle className="w-6 h-6 text-slate-500" />
                                                                                )}
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-sm font-bold text-white leading-tight">{app.profiles.full_name}</p>
                                                                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                                                    {app.profiles.rating_count > 0
                                                                                        ? (app.profiles.rating_sum / app.profiles.rating_count).toFixed(1)
                                                                                        : 'Unrated'}
                                                                                    <span className="text-slate-600 px-1">•</span>
                                                                                    {app.profiles.experience_years} yrs exp
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-xs text-slate-400 space-y-1 bg-[#1C1F26] p-2 rounded-lg border border-white/5">
                                                                            {app.profiles.blood_group && <p><span className="text-slate-500 font-semibold">Blood:</span> <span className="text-slate-300">{app.profiles.blood_group}</span></p>}
                                                                            {app.profiles.certificates && <p><span className="text-slate-500 font-semibold">Certs:</span> <a href={app.profiles.certificates} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">View</a></p>}
                                                                            {!app.profiles.blood_group && !app.profiles.certificates && <p className="text-slate-500 italic">No extra details provided.</p>}
                                                                        </div>
                                                                    </div>
                                                                    <form action={acceptWorker}>
                                                                        <input type="hidden" name="job_id" value={job.id} />
                                                                        <input type="hidden" name="worker_id" value={app.worker_id} />
                                                                        <button type="submit" className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                                                                            Accept {app.profiles.full_name}
                                                                        </button>
                                                                    </form>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="bg-[#0F1115] border border-white/5 p-4 rounded-xl text-center">
                                                            <p className="text-slate-500 text-sm font-medium">Waiting for workers to apply...</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}
                {/* --- JOB HISTORY TAB --- */}
                {
                    currentTab === 'history' && (
                        <>
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-white mb-2">Job History</h1>
                                <p className="text-slate-400">View records of your completed jobs and the workers you hired.</p>
                            </div>

                            {completedJobs.length === 0 ? (
                                <div className="bg-[#1C1F26] border border-white/5 p-12 rounded-3xl text-center shadow-xl">
                                    <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-white mb-1">No completed jobs</h3>
                                    <p className="text-slate-400">Jobs you mark as done will appear here.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {completedJobs.map((job) => {
                                        const details = parseDescription(job.description)
                                        // Make sure we type applications properly
                                        const applications: { id: string, status: string, worker_id: string, profiles: { full_name: string, phone: string, profession: string, location: string, experience_years: number, rating_sum: number, rating_count: number, blood_group: string | null, profile_picture_url: string | null, certificates: string | null } }[] = job.job_applications || []
                                        const assignedWorkerApp = applications.find(a => a.status === 'accepted')

                                        return (
                                            <div key={job.id} className="bg-[#1C1F26] border border-white/5 p-6 md:p-8 rounded-3xl flex flex-col xl:flex-row shadow-xl gap-8">
                                                {/* Left details */}
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-2xl font-bold text-white">{job.title}</h3>
                                                        <div className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
                                                            COMPLETED
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 font-medium mb-4">
                                                        <span>{job.required_profession}</span>
                                                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-slate-500" /> {job.location}</span>
                                                        {job.budget && (
                                                            <>
                                                                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                                                <span className="font-bold text-white">₹{job.budget}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <p className="text-slate-400 text-sm mb-4 bg-[#0F1115] p-4 rounded-xl border border-white/5">
                                                        {details.text}
                                                    </p>
                                                </div>

                                                {/* Right details - Worker profile */}
                                                {assignedWorkerApp && (
                                                    <div className="w-full xl:w-80 border-t xl:border-t-0 xl:border-l border-white/5 pt-6 xl:pt-0 xl:pl-8 flex flex-col justify-center">
                                                        <h4 className="text-xs font-bold text-slate-500 mb-4 tracking-wider uppercase">Worker Hired</h4>
                                                        <div className="bg-[#0F1115] border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                                                                {assignedWorkerApp.profiles.profile_picture_url ? (
                                                                    <img src={assignedWorkerApp.profiles.profile_picture_url} className="w-full h-full object-cover" alt="Profile" />
                                                                ) : (
                                                                    <UserCircle className="w-6 h-6 text-slate-500" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-white font-bold text-sm truncate">{assignedWorkerApp.profiles.full_name}</p>
                                                                <p className="text-xs text-slate-500 mb-2">{assignedWorkerApp.profiles.phone || 'No phone'}</p>

                                                                {(job as { is_rated?: boolean }).is_rated ? (
                                                                    <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold bg-yellow-400/10 px-2 py-1 rounded w-fit">
                                                                        <Star className="w-3 h-3 fill-current" /> Reviewed
                                                                    </div>
                                                                ) : (
                                                                    <StarRating jobId={job.id} workerId={assignedWorkerApp.worker_id} />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </>
                    )
                }
                {/* --- EDIT PROFILE TAB --- */}
                {
                    currentTab === 'profile' && (
                        <div className="max-w-xl">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                                <p className="text-slate-400">Update your contact information so workers can reach you.</p>
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
                                            className="w-full bg-[#0F1115] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
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
                                            className="w-full bg-[#0F1115] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
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
                                            className="w-full bg-[#0F1115] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-1">Blood Group</label>
                                    <select
                                        name="blood_group"
                                        defaultValue={profile?.blood_group || ''}
                                        className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium appearance-none"
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
                                <div>
                                    <label className="block text-sm font-semibold text-slate-400 mb-1">Profile Picture</label>
                                    <input
                                        name="profile_picture"
                                        type="file"
                                        accept="image/*"
                                        className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition-all"
                                    />
                                    {profile?.profile_picture_url && (
                                        <p className="text-xs text-green-400 mt-1">Current picture exists</p>
                                    )}
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
                                    >
                                        <Pencil className="w-4 h-4" /> Save Profile Details
                                    </button>
                                </div>
                            </form>
                        </div>
                    )
                }
            </main>
        </div>
    )
}
