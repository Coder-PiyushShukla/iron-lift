"use client"

import { useState, useTransition, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { PlayCircle, TrendingUp, History, CheckCircle2, Trophy, Loader2, Sparkles, Bot, UserCog } from "lucide-react"
import { logExerciseProgress } from "@/app/actions/progress"
import confetti from "canvas-confetti"

// ==========================================
// 3D Tilt Card Component
// ==========================================
function Card3D({ ex, exerciseLogs }: { ex: any; exerciseLogs: any[] }) {
    const cardRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Smoothing springs for a fluid 3D effect
    const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 })
    const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 })

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"])

    const historicalLogs = exerciseLogs
        .filter((log) => log.exerciseName === ex.name)
        .slice(0, 4)

    const [weight, setWeight] = useState("")
    const [reps, setReps] = useState("")
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5
        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    const handleLog = () => {
        if (!weight || !reps) return
        setError("")
        startTransition(async () => {
            const parsedWeight = parseFloat(weight)
            const res = await logExerciseProgress(ex.name, parsedWeight, parseInt(reps))
            if (res.success) {

                // Progressive Overload Celebration Check!
                const lastSession = historicalLogs[0]
                if (lastSession && parsedWeight > lastSession.weight) {
                    confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#dc2626', '#ffffff', '#ef4444', '#b91c1c'],
                        zIndex: 1000
                    });
                }

                setSuccess(true)
                setTimeout(() => {
                    setSuccess(false)
                    setWeight("")
                    setReps("")
                }, 3000)
            } else {
                setError(res.error || "Failed to save")
            }
        })
    }

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl overflow-hidden cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.05, zIndex: 10, boxShadow: "0px 20px 40px rgba(0,0,0,0.5)" }}
        >
            {/* Background */}
            <div
                className="absolute inset-0 z-0 bg-gradient-to-br from-red-600/20 via-black/80 to-zinc-900/40 border border-white/5 rounded-3xl backdrop-blur-md"
                style={{ transform: "translateZ(-50px)" }}
            ></div>

            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent z-10 pointer-events-none rounded-t-3xl"></div>

            <div className="relative z-20" style={{ transform: "translateZ(30px)" }}>
                {/* Header */}
                <div className="flex justify-between items-start mb-6 w-full">
                    <div className="pr-2">
                        <h3 className="text-2xl font-black italic tracking-tight text-white/90 drop-shadow-md leading-tight break-words">{ex.name}</h3>
                        <span className="text-sm font-bold text-red-500 uppercase tracking-widest mt-1 block drop-shadow-sm">
                            {ex.sets} Sets × {ex.reps}
                        </span>
                    </div>
                    <a
                        href={`https://www.youtube.com/results?search_query=${ex.videoQuery}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-white/5 border border-white/10 hover:bg-red-600 rounded-full transition-all text-white/70 hover:text-white shrink-0"
                        style={{ transform: "translateZ(40px)" }}
                        title="Watch Tutorial"
                    >
                        <PlayCircle size={20} />
                    </a>
                </div>

                {/* Info Box / 4-Session History */}
                <div className="bg-black/40 border border-white/10 p-4 rounded-2xl backdrop-blur-lg mb-6 shadow-inner min-h-[140px]" style={{ transform: "translateZ(20px)" }}>
                    <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2">
                            <History className="text-zinc-400" size={14} />
                            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">History (Last 4)</span>
                        </div>
                        {historicalLogs.length > 0 && historicalLogs[0] && (
                            <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase bg-white/5 px-2 py-0.5 rounded-full">
                                Max: {historicalLogs[0].weight}kg
                                <Sparkles size={10} className="text-yellow-500" />
                            </div>
                        )}
                    </div>
                    {historicalLogs.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {historicalLogs.map((hlog, i) => (
                                <div key={i} className={`flex justify-between items-center text-sm ${i === 0 ? 'text-white' : 'text-zinc-500 opacity-80'}`}>
                                    <span className="font-medium text-xs">
                                        {new Date(hlog.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className="font-mono font-bold tracking-tight text-right w-24 truncate">{hlog.weight}kg × {hlog.reps}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-20 text-center text-zinc-500 opacity-70">
                            <Trophy size={18} className="mb-2 text-zinc-600" />
                            <div className="text-xs font-bold uppercase tracking-widest">No Data Yet</div>
                        </div>
                    )}
                </div>

                {/* Input Form */}
                <div className="grid grid-cols-2 gap-3 mb-4" style={{ transform: "translateZ(50px)" }}>
                    <input
                        type="number"
                        placeholder="Weight (kg)"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono shadow-inner"
                    />
                    <input
                        type="number"
                        placeholder="Reps"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono shadow-inner"
                    />
                </div>

                <button
                    onClick={handleLog}
                    disabled={isPending || success || !weight || !reps}
                    style={{ transform: "translateZ(60px)" }}
                    className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all duration-300 shadow-xl overflow-hidden relative flex items-center justify-center gap-2 ${success
                        ? 'bg-green-500 hover:bg-green-600 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                        : error
                            ? 'bg-red-800 text-white'
                            : 'bg-white hover:bg-zinc-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] disabled:shadow-none disabled:bg-zinc-800 disabled:text-zinc-500'
                        }`}
                >
                    {isPending ? (
                        <><Loader2 className="animate-spin" size={16} /> SAVING...</>
                    ) : success ? (
                        <><CheckCircle2 size={16} /> LOGGED</>
                    ) : error ? (
                        error
                    ) : (
                        "LOG WORKOUT"
                    )}
                </button>

            </div>
        </motion.div>
    )
}

// ==========================================
// Main Client Page Component
// ==========================================
export default function ProgressClient({ user, exerciseLogs }: { user: any; exerciseLogs: any[] }) {
    const aiPlan = user.workoutPlan || []
    const customPlanRaw = user.customWorkout || {}

    // Normalize Custom Plan from { Monday: [], Tuesday: [] } -> [{ day: 'Monday', exercises: [] }] if needed
    let customPlan: any[] = []
    if (Array.isArray(customPlanRaw)) {
        customPlan = customPlanRaw
    } else {
        customPlan = Object.keys(customPlanRaw)
            .filter((day) => customPlanRaw[day] && customPlanRaw[day].length > 0)
            .map((day) => ({
                day,
                exercises: customPlanRaw[day]
            }))
    }

    // State for toggling between AI vs Custom plan
    const [activePlanType, setActivePlanType] = useState<"ai" | "custom">(
        customPlan.length > 0 ? "custom" : aiPlan.length > 0 ? "ai" : "custom"
    )

    const currentPlan = activePlanType === "ai" ? aiPlan : customPlan
    const [selectedDay, setSelectedDay] = useState(0)

    return (
        <div className="min-h-screen bg-black overflow-hidden relative pb-24">
            <div className="absolute top-0 left-1/4 w-3/4 h-96 bg-red-600/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 font-bold text-xs uppercase tracking-widest mb-6">
                        <TrendingUp size={14} /> Analytics & Progress
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-4">
                        TRACK YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">LIFTS</span>
                    </h1>
                    <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-medium">
                        Overload to grow. Beat your last session to trigger a victory celebration!
                    </p>
                </motion.div>

                {/* Plan Source Toggle */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex justify-center mb-10"
                >
                    <div className="bg-white/5 border border-white/10 p-1 rounded-full flex gap-1 shadow-2xl relative">
                        <button
                            onClick={() => { setActivePlanType("ai"); setSelectedDay(0); }}
                            className={`relative flex items-center justify-center gap-2 h-12 w-40 rounded-full px-6 font-bold text-sm transition-colors z-10 ${activePlanType === "ai" ? "text-white" : "text-zinc-500 hover:text-white"
                                }`}
                        >
                            <Bot size={16} /> AI Plan
                        </button>
                        <button
                            onClick={() => { setActivePlanType("custom"); setSelectedDay(0); }}
                            className={`relative flex items-center justify-center gap-2 h-12 w-40 rounded-full px-6 font-bold text-sm transition-colors z-10 ${activePlanType === "custom" ? "text-white" : "text-zinc-500 hover:text-white"
                                }`}
                        >
                            <UserCog size={16} /> Custom Plan
                        </button>

                        {/* Sliding background highlight */}
                        <div
                            className={`absolute top-1 left-1 bottom-1 w-40 bg-zinc-800 rounded-full border border-zinc-700 transition-transform duration-300 ease-out z-0`}
                            style={{ transform: activePlanType === "ai" ? "translateX(0)" : "translateX(calc(100% + 4px))" }}
                        />
                    </div>
                </motion.div>

                {/* Horizontal Day Selector */}
                {currentPlan.length > 0 ? (
                    <>
                        <div className="flex justify-center flex-wrap gap-4 mb-16">
                            {currentPlan.map((day: any, i: number) => {
                                const isSelected = selectedDay === i
                                return (
                                    <motion.button
                                        key={`${activePlanType}-${i}`} // Forces re-render for new plan
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05, duration: 0.4 }}
                                        onClick={() => setSelectedDay(i)}
                                        className={`px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm transition-all duration-300 ${isSelected
                                            ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500"
                                            : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                                            }`}
                                    >
                                        {day.day}
                                    </motion.button>
                                )
                            })}
                        </div>

                        {/* Cards Grid */}
                        <div className="perspective-1000">
                            <motion.div
                                key={`${activePlanType}-${selectedDay}`} // Forces re-animation when changing days/plan
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.1 }
                                    }
                                }}
                            >
                                {currentPlan[selectedDay]?.exercises?.map((ex: any, idx: number) => (
                                    <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
                                        <Card3D ex={ex} exerciseLogs={exerciseLogs} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 px-4 mt-8 bg-zinc-900/50 border border-white/5 rounded-3xl">
                        <Trophy size={48} className="mx-auto text-zinc-700 mb-6" />
                        <h3 className="text-2xl font-black text-white italic mb-2">NO {activePlanType.toUpperCase()} PLAN FOUND</h3>
                        <p className="text-zinc-500">Go to your Planner to generate or create one.</p>
                    </div>
                )}

            </div>
        </div>
    )
}
