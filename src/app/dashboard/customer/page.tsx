import { Briefcase, MapPin, Plus, Zap, AlertCircle, CheckCircle2, UserCircle, Star, Pencil, Phone, User, PartyPopper } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { postJob, acceptWorker, updateProfile, markJobDone } from '@/app/dashboard/actions'
import dynamic from 'next/dynamic'
import StarRating from './StarRating'

const WorkerMap = dynamic(() => import('./WorkerMap'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full rounded-2xl bg-[#0F1115] animate-pulse flex items-center justify-center text-slate-500 border border-white/5">Loading map...</div>
})

function parseDescription(desc: string) {
    try {
        return JSON.parse(desc)
    } catch {
        return { text: desc, is_urgent: false, job_type: 'General' }
    }
}

export default async function CustomerDashboard() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

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
          rating_count
        )
      )
    `)
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false })

    // Fetch nearby workers
    const { data: workers } = await supabase
        .from('profiles')
        .select('id, full_name, profession, location, rating_sum, rating_count')
        .eq('role', 'worker')
        .limit(30)

    // Fetch this customer's own profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone, location')
        .eq('id', user?.id)
        .single()

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto text-slate-200">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Customer Dashboard</h1>
                    <p className="text-slate-400">Post new jobs and approve workers who apply.</p>
                </div>

                {/* Edit Profile Button */}
                <details className="relative group">
                    <summary className="cursor-pointer list-none flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all">
                        <Pencil className="w-4 h-4" />
                        Edit Profile
                    </summary>
                    <div className="absolute right-0 mt-2 w-80 bg-[#1C1F26] border border-white/10 rounded-2xl shadow-2xl p-5 z-50">
                        <h3 className="text-white font-bold mb-4 text-base">Edit Your Profile</h3>
                        <form action={updateProfile} className="space-y-3">
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <input
                                    name="full_name"
                                    type="text"
                                    defaultValue={profile?.full_name || ''}
                                    placeholder="Full Name"
                                    className="w-full bg-[#0F1115] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white text-sm placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <input
                                    name="phone"
                                    type="tel"
                                    defaultValue={profile?.phone || ''}
                                    placeholder="Phone Number"
                                    className="w-full bg-[#0F1115] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white text-sm placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                <input
                                    name="location"
                                    type="text"
                                    defaultValue={profile?.location || ''}
                                    placeholder="City / Location"
                                    className="w-full bg-[#0F1115] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white text-sm placeholder-slate-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                </details>
            </div>

            {/* Nearby Workers Map Section */}
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">Nearby Workers</h2>
                <div className="bg-[#1C1F26] border border-white/5 rounded-3xl p-4 shadow-xl z-0">
                    <WorkerMap workers={workers || []} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Post a Job Form (Left Column) */}
                <div className="lg:col-span-1">
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
                </div>

                {/* Job History & Applications (Right Column) */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-white mb-2">My Posted Jobs</h2>

                    {jobs?.length === 0 ? (
                        <div className="bg-[#1C1F26] border border-white/5 p-12 rounded-3xl text-center shadow-xl">
                            <div className="w-16 h-16 bg-[#0F1115] border border-white/5 text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">No jobs posted yet</h3>
                            <p className="text-slate-400">Fill out the form to post your first job!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {jobs?.map((job) => {
                                const details = parseDescription(job.description)

                                // applications typed properly since supabase join shapes the data
                                const applications: { id: string, status: string, worker_id: string, profiles: { full_name: string, phone: string, profession: string, location: string, experience_years: number, rating_sum: number, rating_count: number } }[] = job.job_applications || []
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
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <UserCircle className="w-8 h-8 text-slate-500" />
                                                                <div>
                                                                    <p className="text-white font-bold text-sm">{assignedWorkerApp.profiles.full_name}</p>
                                                                    <p className="text-xs text-slate-400">{assignedWorkerApp.profiles.profession}</p>
                                                                </div>
                                                            </div>
                                                            {(job as any).is_rated ? (
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
                                                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                                                                <UserCircle className="w-6 h-6 text-indigo-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-bold text-base leading-tight">{assignedWorkerApp.profiles.full_name}</p>
                                                                <p className="text-indigo-400 text-xs font-semibold">{assignedWorkerApp.profiles.profession}</p>
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
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <UserCircle className="w-8 h-8 text-slate-600" />
                                                                <div>
                                                                    <p className="text-sm font-bold text-white">{app.profiles.full_name}</p>
                                                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                                                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                                                        {app.profiles.rating_count > 0
                                                                            ? (app.profiles.rating_sum / app.profiles.rating_count).toFixed(1)
                                                                            : 'Unrated Worker'}
                                                                    </p>
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
            </div>
        </div>
    )
}
