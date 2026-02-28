'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { rateWorker } from '@/app/dashboard/actions'

interface StarRatingProps {
    jobId: string
    workerId: string
}

export default function StarRating({ jobId, workerId }: StarRatingProps) {
    const [hovered, setHovered] = useState(0)
    const [selected, setSelected] = useState(0)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!selected) return
        setSubmitting(true)
        const formData = new FormData()
        formData.append('job_id', jobId)
        formData.append('worker_id', workerId)
        formData.append('rating', String(selected))
        await rateWorker(formData)
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm py-2">
                <Star className="w-4 h-4 fill-current" />
                Thanks for rating! ⭐ {selected}/5
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <p className="text-xs text-slate-400 font-semibold">Rate this worker:</p>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setSelected(star)}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        className="transition-transform hover:scale-110"
                    >
                        <Star
                            className={`w-8 h-8 transition-colors ${star <= (hovered || selected)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-slate-600'
                                }`}
                        />
                    </button>
                ))}
            </div>
            {selected > 0 && (
                <p className="text-xs text-slate-400">
                    {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][selected]}
                </p>
            )}
            <button
                type="submit"
                disabled={!selected || submitting}
                className="w-full mt-1 bg-yellow-500 hover:bg-yellow-400 disabled:bg-slate-700 disabled:text-slate-500 text-black font-bold py-2.5 rounded-xl text-sm transition-all"
            >
                {submitting ? 'Submitting...' : '⭐ Submit Rating'}
            </button>
        </form>
    )
}
