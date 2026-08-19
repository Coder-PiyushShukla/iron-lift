"use client"

import { useState, useTransition, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { PlayCircle, TrendingUp, History, CheckCircle2, Trophy, Loader2 } from "lucide-react"
import { logExerciseProgress } from "@/app/actions/progress"

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

    const recentLog = exerciseLogs.find((log) => log.exerciseName === ex.name)

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
            const res = await logExerciseProgress(ex.name, parseFloat(weight), parseInt(reps))
            if (res.success) {
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
            {/* Dynamic Animated Gradient Background - specific to the card to give it depth */}
            <div
                className="absolute inset-0 z-0 bg-gradient-to-br from-red-600/20 via-black/80 to-zinc-900/40 border border-white/5 rounded-3xl backdrop-blur-md"
                style={{ transform: "translateZ(-50px)" }}
            ></div>

            {/* Glossy Overlay for 3D realism */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent z-10 pointer-events-none rounded-t-3xl"></div>

            <div className="relative z-20" style={{ transform: "translateZ(30px)" }}>
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-black italic tracking-tighter text-white/90 drop-shadow-md">{ex.name}</h3>
                        <span className="text-sm font-bold text-red-500 uppercase tracking-widest mt-1 block drop-shadow-sm">
                            {ex.sets} Sets × {ex.reps}
                        </span>
                    </div>
                    <a
                        href={`https://www.youtube.com/results?search_query=${ex.videoQuery}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-white/5 border border-white/10 hover:bg-red-600 rounded-full transition-all text-white/70 hover:text-white"
                        style={{ transform: "translateZ(40px)" }}
                        title="Watch Tutorial"
                    >
                        <PlayCircle size={20} />
                    </a>
                </div>

                {/* Info Box */}
                <div className="bg-black/40 border border-white/10 p-4 rounded-2xl backdrop-blur-lg mb-6 shadow-inner" style={{ transform: "translateZ(20px)" }}>
                    {recentLog ? (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/20 rounded-xl">
                                <History className="text-green-400" size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Previous Session</p>
                                <p className="text-lg font-mono text-white font-black truncate">{recentLog.weight}kg × {recentLog.reps} reps</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-xl">
                                <Trophy className="text-zinc-400" size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">No Data</p>
                                <p className="text-sm text-zinc-500 font-medium">Log this exercise below!</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Form Floating Over the Card */}
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
                            ? 'bg-green-500 hover:bg-green-600 text-black'
                            : error
                                ? 'bg-red-800 text-white'
                                : 'bg-white hover:bg-zinc-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] disabled:shadow-none disabled:bg-zinc-800 disabled:text-zinc-500'
                        }`}
                >
                    {isPending ? (
                        <><Loader2 className="animate-spin" size={16} /> SAVING...</>
                    ) : success ? (
                        <><CheckCircle2 size={16} /> LIFT LOGGED</>
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
    const workoutPlan = user.workoutPlan || []
    const [selectedDay, setSelectedDay] = useState(0)

    return (
        <div className="min-h-screen bg-black overflow-hidden relative pb-24">
            {/* Background Decorative Blur */}
            <div className="absolute top-0 left-1/4 w-3/4 h-96 bg-red-600/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">

                {/* Page Premium Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 font-bold text-xs uppercase tracking-widest mb-6">
                        <TrendingUp size={14} /> Analytics & Progress
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-4">
                        TRACK YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">LIFTS</span>
                    </h1>
                    <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-medium">
                        Progressive overload is the most important factor in muscle growth. Select your training day and instantly log your weights to guarantee your progression.
                    </p>
                </motion.div>

                {/* Horizontal Animated Day Selector */}
                <div className="flex justify-center flex-wrap gap-4 mb-16">
                    {workoutPlan.map((day: any, i: number) => {
                        const isSelected = selectedDay === i
                        return (
                            <motion.button
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                onClick={() => setSelectedDay(i)}
                                className={`px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm transition-all duration-500 ${isSelected
                                        ? "bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] border border-red-500"
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
                        key={selectedDay} // Forces re-animation when changing days
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.15 }
                            }
                        }}
                    >
                        {workoutPlan[selectedDay]?.exercises.map((ex: any, idx: number) => (
                            <motion.div key={idx} variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}>
                                <Card3D ex={ex} exerciseLogs={exerciseLogs} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

            </div>
        </div>
    )
}
