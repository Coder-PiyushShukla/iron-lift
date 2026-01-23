"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Dumbbell, 
  MapPin, 
  ScanLine, 
  Calculator, 
  Flame, 
  LayoutDashboard, 
  ArrowRight, 
  Target, 
  Zap 
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Parallax effects
  const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const yMission = useTransform(scrollYProgress, [0.2, 0.8], ["-20%", "20%"])

  const features = [
    { 
      name: "Command Center", 
      icon: LayoutDashboard, 
      desc: "Your centralized dashboard. View today's workout, track nutrition, and monitor progress in real-time.",
      color: "text-blue-500", 
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
       
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
    },
    { 
      name: "Smart Gym Finder", 
      icon: MapPin, 
      desc: "Never miss a session. Locate top-rated gyms nearby with live OpenStreetMap data and navigation.",
      color: "text-green-500", 
      bg: "bg-green-500/10",
      border: "border-green-500/20",
       
      image: "https://images.unsplash.com/photo-1570829460005-c840387bb1ca?q=80&w=2070&auto=format&fit=crop"
    },
    { 
      name: "Iron Vision Scanner", 
      icon: ScanLine, 
      desc: "Stop guessing calories. Snap a photo of your meal and let AI analyze macros and ingredients instantly.",
      color: "text-purple-500", 
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
       
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop"
    },
    { 
      name: "BMR Intelligence", 
      icon: Calculator, 
      desc: "Scientific precision. We calculate your Basal Metabolic Rate to craft a diet plan that actually works.",
      color: "text-yellow-500", 
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
       
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
    },
    { 
      name: "Streak System", 
      icon: Flame, 
      desc: "Gamified consistency. Build your fire day by day. Don't let the flame die out.",
      color: "text-red-500", 
      bg: "bg-red-500/10",
      border: "border-red-500/20",
       
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
    },
  ]

  return (
    <div ref={containerRef} className="min-h-[300vh] bg-black text-white relative overflow-hidden">
      
       
      <section className="h-screen relative flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: yHero }} className="absolute inset-0 z-0">
             
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/80 to-black z-10" />
            <Image 
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                alt="Futuristic Gym"
                fill
                className="object-cover opacity-60"
                priority
                unoptimized  
            />
        </motion.div>

        <div className="relative z-20 text-center space-y-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Badge variant="outline" className="text-red-500 border-red-600 bg-red-600/10 px-6 py-2 text-lg mb-6 backdrop-blur-md animate-pulse">
              Next-Gen Training Ecology
            </Badge>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
             
            className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none uppercase italic text-transparent bg-clip-text bg-linear-to-b from-white to-zinc-500"
          >
            Total <span className="text-red-600 drop-shadow-[0_0_50px_rgba(220,38,38,0.8)]">Control</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-2xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-light"
          >
            This isn't just a workout log. It's a complete operating system for your biology.
          </motion.p>
        </div>
      </section>

       
      <section className="min-h-screen relative z-10 py-32 px-6 md:px-24 flex items-center bg-zinc-950/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            
            <motion.div 
               initial={{ opacity: 0, x: -100 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 1 }}
               viewport={{ once: true, margin: "-200px" }}
               className="space-y-8 order-2 lg:order-1"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-red-600/20 p-4 rounded-2xl text-red-500"><Target size={40} /></div>
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter">Why We Exist</h2>
                </div>
                <p className="text-xl text-zinc-400 leading-relaxed">
                    Most fitness apps are glorified spreadsheets. They tell you 
                    <span className="text-white font-bold italic"> what </span> 
                    you did, but not 
                    <span className="text-white font-bold italic"> what to do next</span>.
                </p>
                <p className="text-xl text-zinc-400 leading-relaxed">
                   Iron Lift closes the loop. We combine location data, visual recognition, and metabolic science to remove friction from your fitness journey. You just show up. We handle the rest.
                </p>
            </motion.div>

            <div className="relative h-150 w-full rounded-[3rem] overflow-hidden border-4 border-zinc-800/50 shadow-2xl order-1 lg:order-2">
                <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay z-10" />
                <motion.div style={{ y: yMission }} className="absolute inset-0 h-[120%] w-full -top-[10%]">
                  <Image 
                      src="https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=2085&auto=format&fit=crop"
                      alt="Athlete Focus"
                      fill
                      className="object-cover"
                      unoptimized  
                  />
                </motion.div>
            </div>
        </div>
      </section>

       
      <section className="min-h-screen relative z-10 py-32 px-6 bg-black">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-20">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-24 space-y-4"
            >
                 <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter flex items-center justify-center gap-4">
                    <Zap className="text-red-600" size={60} /> Your Arsenal
                </h2>
                <p className="text-xl text-zinc-400">Everything you need to build the ultimate physique.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.15, type: "spring" }}
                    viewport={{ once: true, margin: "-100px" }}
                    whileHover={{ y: -10, scale: 1.02 }}
                >
                     
                    <Card className={`h-100 bg-zinc-900 border-zinc-800 p-0 relative overflow-hidden group flex flex-col justify-end`}>
                         
                        <div className="absolute inset-0 z-0">
                           <Image 
                                src={feature.image} 
                                alt={feature.name} 
                                fill 
                                className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700" 
                                unoptimized  
                           />
                           <div className="absolute inset-0 bg-linear-to-t from-black via-black/80 to-transparent" />
                        </div>
                        
                         
                        <div className="relative z-10 p-8">
                            <div className={`${feature.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${feature.color} backdrop-blur-md border ${feature.border}`}>
                                <feature.icon size={28} />
                            </div>
                            <h3 className="font-black text-2xl mb-2 text-white">{feature.name}</h3>
                            <p className="text-zinc-300 text-sm leading-relaxed">{feature.desc}</p>
                        </div>
                    </Card>
                </motion.div>
                ))}

                 
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    viewport={{ once: true }}
                    className="md:col-span-2 lg:col-span-1"
                >
                    <Link href="/dashboard">
                      <Card className="h-100 bg-linear-to-br from-red-600 to-red-900 border-0 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group cursor-pointer shadow-[0_0_50px_rgba(220,38,38,0.4)] hover:shadow-[0_0_80px_rgba(220,38,38,0.6)] transition-all">
                          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                          <Dumbbell className="text-white w-20 h-20 mb-6 group-hover:rotate-12 transition-transform" />
                          <h3 className="font-black text-4xl mb-4 text-white uppercase italic">Start Training</h3>
                          <div className="bg-white text-red-600 px-6 py-2 rounded-full font-bold flex items-center gap-2 group-hover:scale-105 transition-transform">
                              Deploy System <ArrowRight size={18} />
                          </div>
                      </Card>
                    </Link>
                </motion.div>
            </div>
        </div>
      </section>

       
      <section className="h-[50vh] relative flex items-center justify-center overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
             <Image 
                src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop"
                alt="Outro"
                fill
                className="object-cover opacity-30 grayscale"
                unoptimized 
            />
             <div className="absolute inset-0 bg-linear-to-t from-black via-black/90 to-transparent" />
          </div>
          <div className="relative z-10 text-center px-4">
             <h2 className="text-5xl md:text-8xl font-black uppercase italic mb-8 tracking-tighter">
                Evolve <span className="text-transparent bg-clip-text bg-lineatr-to-r from-red-500 to-orange-600">Today</span>
             </h2>
             <Link href="/api/auth/signin">
                <Button className="bg-white text-black hover:bg-zinc-200 h-16 px-12 text-xl rounded-full font-black hover:scale-105 transition-transform">
                    Join The Elite
                </Button>
             </Link>
          </div>
      </section>

    </div>
  )
}