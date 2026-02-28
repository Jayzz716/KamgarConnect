import { Briefcase, MapPin, Star, IndianRupee, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { applyForJob } from '@/app/dashboard/actions'

function parseDescription(desc: string) {
    try {
        return JSON.parse(desc)
    } catch {
        return { text: desc, is_urgent: false, job_type: 'General' }
    }
}

export default async function WorkerDashboard() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch the worker's profile to get their profession
    const { data: profile } = await supabase
        .from('profiles')
        .select('profession, full_name, is_active')
        .eq('id', user?.id)
        .single()

    const workerProfession = profile?.profession || ''

    // Fetch OPEN jobs that specifically match this worker's profession
    const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .eq('required_profession', workerProfession)
        .order('created_at', { ascending: false })

    // Fetch applications made by this worker to see which ones they already accepted/applied to
    const { data: applications } = await supabase
        .from('job_applications')
        .select('job_id, status')
        .eq('worker_id', user?.id)

    const appliedJobIds = new Set(applications?.map(app => app.job_id))

    // Mapping of application statuses
    const applicationStatusMap = new Map(applications?.map(app => [app.job_id, app.status]))

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Available Jobs</h1>
                    <p className="text-slate-400">
                        Showing open jobs exclusively for: <span className="font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">{workerProfession || 'Your Profession'}</span>
                    </p>
                </div>

                {/* Toggle Status (Visual for now, planned func) */}
                <div className="flex items-center gap-3 bg-[#1C1F26] p-2 rounded-xl border border-white/5">
                    <span className="text-sm font-semibold text-slate-400 px-2">Status:</span>
                    <span className={`text-sm font-bold px-4 py-1.5 rounded-lg ${profile?.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-slate-800 text-slate-500'}`}>
                        {profile?.is_active ? 'Working (Online)' : 'Resting (Offline)'}
                    </span>
                </div>
            </div>

            {jobs?.length === 0 ? (
                <div className="bg-[#1C1F26] border border-white/5 p-12 rounded-3xl text-center max-w-2xl mx-auto shadow-2xl">
                    <div className="w-16 h-16 bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">No jobs available right now</h3>
                    <p className="text-slate-400 mb-4">There are currently no open jobs requesting a {workerProfession}. Please check back later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {jobs?.map((job) => {
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
                                        <div className="w-full text-center py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-slate-400 flex items-center justify-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                                            {appStatus === 'accepted' ? 'Job Assigned to You' : 'Waiting for Customer Approval'}
                                        </div>
                                    ) : (
                                        <form action={applyForJob}>
                                            <input type="hidden" name="job_id" value={job.id} />
                                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg hover:shadow-indigo-500/25">
                                                Accept Job
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
