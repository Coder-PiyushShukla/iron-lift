import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Dumbbell, MapPin, ScanLine, Trophy, ArrowRight, Activity, Brain, Flame, Zap, Target, CalendarCheck, ChevronRight 
} from "lucide-react"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // --- 1. LANDING PAGE (Not Logged In) ---
  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white selection:bg-red-500/30">
        
        {/* HERO SECTION */}
        <div className="relative pt-32 pb-40 overflow-hidden">
          {/* Dynamic Background Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

          <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 mb-8 backdrop-blur-sm animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              v2.0 Now Live
            </div>

            <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9]">
              BUILD YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-[length:200%_auto] animate-gradient">
                DREAM BODY
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-12">
              The only fitness app that combines <span className="text-white font-bold">Generative AI</span>, 
              <span className="text-white font-bold"> Computer Vision</span>, and <span className="text-white font-bold">Real-time Data</span> 
              to engineer your perfect physique.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24">
              <Link href="/api/auth/signin">
                <Button className="h-16 px-12 text-xl bg-red-600 hover:bg-red-500 text-white rounded-full font-bold shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] hover:scale-105 transition-all duration-300 border-t border-white/20">
                  Start Your Transformation <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="h-16 px-12 text-xl border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 rounded-full text-white backdrop-blur-sm transition-all">
                  How it Works
                </Button>
              </Link>
            </div>

            {/* BENTO GRID FEATURES */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
              {/* Feature 1 */}
              <div className="glass-card p-8 rounded-[2rem] hover:bg-white/5 transition-colors group">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                  <Brain size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-3">AI Architect</h3>
                <p className="text-zinc-400 leading-relaxed">Our AI analyzes your body type and goals to generate hyper-personalized workout splits and meal plans.</p>
              </div>

              {/* Feature 2 */}
              <div className="glass-card p-8 rounded-[2rem] hover:bg-white/5 transition-colors group">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-6 text-red-400 group-hover:scale-110 transition-transform">
                  <ScanLine size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Iron Vision</h3>
                <p className="text-zinc-400 leading-relaxed">Point your camera at any meal. Our Computer Vision instantly calculates calories and macros.</p>
              </div>

              {/* Feature 3 */}
              <div className="glass-card p-8 rounded-[2rem] hover:bg-white/5 transition-colors group">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform">
                  <MapPin size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-3">Global Gym Map</h3>
                <p className="text-zinc-400 leading-relaxed">Traveling? Find the highest-rated gyms near you instantly with our real-time map integration.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- 2. DASHBOARD (Logged In) ---
  
  // Fetch Data
  const user = await db.user.findUnique({
    where: { email: session.user?.email! },
    select: {
      name: true,
      currentStreak: true,
      maxStreak: true,
      customWorkout: true, 
    }
  })

  const firstName = user?.name?.split(" ")[0] || "Athlete"
  const currentStreak = user?.currentStreak || 0
  const maxStreak = user?.maxStreak || 0

  // Today's logic
  const daysMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const todayIndex = new Date().getDay()
  const todayName = daysMap[todayIndex]
  const workoutPlan = user?.customWorkout as any || {}
  const todaysExercises = workoutPlan[todayName] || []

  return (
    <div className="min-h-screen p-6 md:p-12 pb-32">
       
       <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter mb-3">
              HELLO, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 uppercase">{firstName}</span>
            </h1>
            <p className="text-zinc-400 text-xl font-light">Your protocol is ready. Let's get to work.</p>
          </div>

          <div className="glass-card px-6 py-4 rounded-full flex items-center gap-5">
              <div className="bg-red-600/20 p-3 rounded-full text-red-500 animate-pulse">
                  <Flame fill="currentColor" size={24} />
              </div>
              <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Current / Best</p>
                  <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-black text-white">{currentStreak}</p>
                      <span className="text-zinc-500 text-sm font-bold">/ {maxStreak} Days</span>
                  </div>
              </div>
          </div>
        </header>

        {/* TODAY'S WORKOUT SECTION */}
        <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-600 w-1 h-8 rounded-full"></div>
                <h2 className="text-3xl font-bold text-white">Today's Protocol: <span className="text-zinc-500">{todayName}</span></h2>
            </div>
            
            {todaysExercises.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {todaysExercises.map((ex: any, i: number) => (
                        <div key={i} className="glass-card p-6 rounded-2xl flex items-center justify-between group hover:border-red-500/30 transition-colors">
                            <div>
                                <h4 className="font-bold text-lg mb-1 text-white group-hover:text-red-400 transition-colors">{ex.name}</h4>
                                <p className="text-zinc-400 text-sm font-mono">{ex.sets} Sets × {ex.reps} Reps</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-red-600 group-hover:text-white transition-all">
                                <Dumbbell size={18} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card border-dashed border-zinc-700 p-10 text-center rounded-3xl">
                    <p className="text-zinc-500 text-lg mb-6">Rest day or no workout planned.</p>
                    <Link href="/planner">
                        <Button className="bg-white text-black hover:bg-zinc-200 font-bold rounded-full">
                           Open Planner
                        </Button>
                    </Link>
                </div>
            )}
        </div>

        {/* QUICK ACTIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link href="/planner" className="group">
            <div className="glass-card h-full p-8 rounded-[2rem] hover:bg-zinc-900/60 transition-all hover:scale-[1.02] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity group-hover:rotate-12 transform duration-500">
                <Activity size={140} />
              </div>
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                <Activity size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Edit Plan</h3>
              <p className="text-zinc-400 mb-8 text-sm leading-relaxed">Modify your weekly split, add exercises, or update your diet.</p>
              <div className="flex items-center text-blue-400 font-bold text-sm uppercase tracking-wide group-hover:gap-3 transition-all">
                Go to Planner <ArrowRight size={16} className="ml-2" />
              </div>
            </div>
          </Link>

          <Link href="/gyms" className="group">
            <div className="glass-card h-full p-8 rounded-[2rem] hover:bg-zinc-900/60 transition-all hover:scale-[1.02] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity group-hover:rotate-12 transform duration-500">
                <MapPin size={140} />
              </div>
              <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Find Gyms</h3>
              <p className="text-zinc-400 mb-8 text-sm leading-relaxed">Locate the best rated gyms nearby with live OpenStreetMap data.</p>
              <div className="flex items-center text-green-400 font-bold text-sm uppercase tracking-wide group-hover:gap-3 transition-all">
                Explore Map <ArrowRight size={16} className="ml-2" />
              </div>
            </div>
          </Link>

          <Link href="/scanner" className="group">
            <div className="glass-card h-full p-8 rounded-[2rem] hover:bg-zinc-900/60 transition-all hover:scale-[1.02] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity group-hover:rotate-12 transform duration-500">
                <ScanLine size={140} />
              </div>
              <div className="w-12 h-12 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center mb-6">
                <ScanLine size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Iron Vision</h3>
              <p className="text-zinc-400 mb-8 text-sm leading-relaxed">Scan your food instantly to get macros and calorie counts using AI.</p>
              <div className="flex items-center text-red-400 font-bold text-sm uppercase tracking-wide group-hover:gap-3 transition-all">
                Launch Scanner <ArrowRight size={16} className="ml-2" />
              </div>
            </div>
          </Link>

        </div>
       </div>
    </div>
  )
}