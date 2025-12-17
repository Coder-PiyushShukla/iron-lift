"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Code2, Database, Brain, Globe, Server, ArrowRight, Zap, Target } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Parallax effects for images
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const yMission = useTransform(scrollYProgress, [0.2, 0.8], ["-20%", "20%"])

  const techStack = [
    { name: "Next.js 14 (App Router)", icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { name: "Google Gemini AI", icon: Brain, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { name: "MongoDB & Prisma", icon: Database, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
    { name: "Tailwind CSS & Shadcn", icon: Code2, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { name: "NextAuth.js Security", icon: Server, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  ]

  return (
    <div ref={containerRef} className="min-h-[300vh] bg-black text-white relative overflow-hidden">
      
      {/* ---------------- SECTION 1: THE HERO (CINEMATIC INTRO) ---------------- */}
      <section className="h-screen relative flex items-center justify-center overflow-hidden">
        {/* Parallax Background Image */}
        <motion.div style={{ y: yHero }} className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/80 to-black z-10" />
            {/* Replace src with your own high-quality gym image if you want */}
            <Image 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                alt="Futuristic Gym"
                fill
                className="object-cover opacity-50"
                priority
            />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-20 text-center space-y-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Badge variant="outline" className="text-red-500 border-red-600 bg-red-600/10 px-6 py-2 text-lg mb-6 backdrop-blur-md animate-pulse">
              The Future of Fitness is Here
            </Badge>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none uppercase italic text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-500"
          >
            Iron <span className="text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]">Lift</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-2xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Where biological data meets artificial intelligence. Stop guessing. Start evolving.
          </motion.p>
          
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
             <p className="text-sm text-zinc-500 uppercase tracking-widest mb-2">Scroll to explore</p>
             <ArrowRight className="rotate-90 text-red-500" />
           </motion.div>
        </div>
      </section>


      {/* ---------------- SECTION 2: THE MISSION (SCROLL REVEAL) ---------------- */}
      <section className="min-h-screen relative z-10 py-32 px-6 md:px-24 flex items-center bg-zinc-950/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            
            {/* Text Content - Slides right */}
            <motion.div 
               initial={{ opacity: 0, x: -100 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 1 }}
               viewport={{ once: true, margin: "-200px" }}
               className="space-y-8 order-2 lg:order-1"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-red-600/20 p-4 rounded-2xl text-red-500"><Target size={40} /></div>
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter">The Mission</h2>
                </div>
                <p className="text-xl text-zinc-400 leading-relaxed">
                    Traditional fitness is broken. Generic PDF plans don't work because they aren't built for 
                    <span className="text-white font-bold"> YOUR body</span>.
                </p>
                <p className="text-xl text-zinc-400 leading-relaxed">
                    Iron Lift was built to democratize elite-level coaching. We use advanced AI to analyze your unique BMR, goals, and schedule to craft the perfect regimen instantly.
                </p>
                <div className="flex gap-4 pt-4">
                    <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-6 py-4 rounded-full">
                        <Zap className="text-yellow-500" /> <span className="font-bold">Instant Plans</span>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-6 py-4 rounded-full">
                        <Brain className="text-purple-500" /> <span className="font-bold">AI Powered</span>
                    </div>
                </div>
            </motion.div>

            {/* Image Content - Parallax & Slides left */}
            <div className="relative h-150 w-full rounded-[3rem] overflow-hidden border-4 border-zinc-800/50 shadow-2xl order-1 lg:order-2">
                <div className="absolute inset-0 bg-red-600/20 mix-blend-overlay z-10" />
                <motion.div style={{ y: yMission }} className="absolute inset-0 h-[120%] w-full -top-[10%]">
                  <Image 
                      src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
                      alt="AI Brain & Fitness"
                      fill
                      className="object-cover"
                  />
                </motion.div>
            </div>
        </div>
      </section>


      {/* ---------------- SECTION 3: THE ENGINE (DYNAMIC CARDS) ---------------- */}
      <section className="min-h-screen relative z-10 py-32 px-6 bg-black">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-20">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-24 space-y-4"
            >
                 <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter flex items-center justify-center gap-4">
                    <Code2 className="text-red-600" size={60} /> Under The Hood
                </h2>
                <p className="text-xl text-zinc-400">Built with the bleeding edge of web technology.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {techStack.map((tech, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.15, type: "spring" }}
                    viewport={{ once: true, margin: "-100px" }}
                    whileHover={{ y: -10, scale: 1.02 }}
                >
                    <Card className={`h-full bg-zinc-900/50 backdrop-blur-md border-2 ${tech.border} p-8 relative overflow-hidden group`}>
                        {/* Glowing Background gradient on hover */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-linear-to-br from-transparent to-${tech.color.split('-')[1]}-600`} />
                        
                        <div className={`${tech.bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${tech.color} shadow-lg relative z-10 group-hover:scale-110 transition-transform`}>
                            <tech.icon size={32} />
                        </div>
                        <h3 className="font-black text-2xl mb-2 relative z-10">{tech.name}</h3>
                        <p className="text-zinc-400 relative z-10 font-medium">High-performance, scalable, and secure architecture ready for production.</p>
                    </Card>
                </motion.div>
                ))}
                 {/* "You Next" Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="md:col-span-2 lg:col-span-1"
                >
                    <Card className="h-full bg-linear-to-br from-red-900/50 to-black border-2 border-red-600/50 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group cursor-pointer">
                         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                         <h3 className="font-black text-3xl mb-4 relative z-10">Ready to Build?</h3>
                         <p className="text-zinc-300 mb-6 relative z-10">Hire the developer behind this project.</p>
                         <div className="flex gap-4 relative z-10">
                            <Button size="icon" variant="outline" className="rounded-full border-zinc-700 hover:bg-white hover:text-black hover:border-white transition-all"><Github /></Button>
                            <Button size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700 hover:scale-110 transition-all"><Linkedin /></Button>
                         </div>
                    </Card>
                </motion.div>
            </div>
        </div>
      </section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="h-[50vh] relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
             <Image 
                src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop"
                alt="Outro"
                fill
                className="object-cover opacity-20 grayscale"
            />
             <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent" />
          </div>
          <div className="relative z-10 text-center">
             <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-8">Stop Scrolling.<br /><span className="text-red-600">Start Lifting.</span></h2>
             <Button className="bg-red-600 hover:bg-red-700 text-white h-16 px-10 text-xl rounded-full font-bold shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:scale-105 transition-transform">
                Create My Plan Now <ArrowRight className="ml-2" />
             </Button>
          </div>
      </section>

    </div>
  )
}