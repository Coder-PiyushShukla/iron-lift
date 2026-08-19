"use client"

import { useState, useTransition } from "react"
import { PlayCircle, PlusCircle, CheckCircle2, History, XCircle } from "lucide-react"
import { logExerciseProgress } from "@/app/actions/progress"

export default function ExerciseRow({ ex, exerciseLogs }: { ex: any; exerciseLogs: any[] }) {
    const [isLogging, setIsLogging] = useState(false)
    const [weight, setWeight] = useState("")
    const [reps, setReps] = useState("")
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    // Find the most recent log for this exact exercise
    const recentLog = exerciseLogs.find((log) => log.exerciseName === ex.name)

    const handleLog = () => {
        if (!weight || !reps) return
        setError("")
        startTransition(async () => {
            const res = await logExerciseProgress(ex.name, parseFloat(weight), parseInt(reps))
            if (res.success) {
                setSuccess(true)
                setTimeout(() => {
                    setIsLogging(false)
                    setSuccess(false)
                    setWeight("")
                    setReps("")
                }, 2000)
            } else {
                setError(res.error || "Failed to save")
            }
        })
    }

    return (
        <div className="border-b border-white/5 pb-4 mb-4 last:border-0 transition-all">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="font-bold text-zinc-200 block">{ex.name}</span>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs text-zinc-400 font-mono bg-black/40 px-2 py-1 rounded-md border border-white/5">
                            {ex.sets} sets × {ex.reps}
                        </span>
                        {recentLog && (
                            <span className="text-xs text-green-400 font-mono bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20 flex items-center gap-1 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                <History size={12} /> Last: {recentLog.weight}kg × {recentLog.reps}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 shrink-0 ml-4">
                    <button
                        onClick={() => {
                            setIsLogging(!isLogging)
                            setError("")
                            setSuccess(false)
                        }}
                        className={`transition-colors p-2 rounded-full cursor-pointer ${isLogging ? 'bg-red-500/20 text-red-500' : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'}`}
                        title="Log Progress"
                    >
                        {isLogging ? <XCircle size={16} /> : <PlusCircle size={16} />}
                    </button>
                    <a
                        href={`https://www.youtube.com/results?search_query=${ex.videoQuery}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full flex items-center justify-center"
                    >
                        <PlayCircle size={16} />
                    </a>
                </div>
            </div>

            {/* Expandable Logging UI */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isLogging ? 'max-h-24 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                <div className="bg-black/40 p-3 rounded-xl border border-white/10 flex gap-2 items-center shadow-inner">
                    <input
                        type="number"
                        placeholder="Weight (kg)"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg text-sm px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 appearance-none transition-colors"
                    />
                    <input
                        type="number"
                        placeholder="Reps"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg text-sm px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 appearance-none transition-colors"
                    />
                    <button
                        onClick={handleLog}
                        disabled={isPending || success || !weight || !reps}
                        className="shrink-0 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? "..." : success ? <><CheckCircle2 size={14} /> Saved</> : "Log It"}
                    </button>
                </div>
                {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
            </div>
        </div>
    )
}
