"use client"

import { useState } from "react"
import { signupUser } from "../../actions/auth"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dumbbell, Mail, Lock, User, Loader2, ArrowRight, Sparkles, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function SignupPage() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const result = await signupUser(formData)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      // Success! Redirect to login
      router.push("/api/auth/signin") 
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-black text-white overflow-hidden">
      
      {/* ---------------- LEFT SIDE: THE FORM ---------------- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative z-10">
         {/* Mobile Background Ambience */}
         <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] -z-10" />
         <div className="absolute bottom-0 left-0 w-125 h-125 bg-red-600/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

         <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md space-y-8"
         >
            {/* Header */}
            <div className="text-center lg:text-left">
                <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                    <div className="bg-red-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
                        <Dumbbell className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter">IRON<span className="text-red-600">LIFT</span></span>
                </Link>
                <h1 className="text-4xl font-black tracking-tight mb-2">Build Your Legacy.</h1>
                <p className="text-zinc-400">Join the platform that adapts to your biology.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name Field */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Full Name</label>
                    <div className="relative group">
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                        <Input 
                            name="name"
                            placeholder="John Doe" 
                            className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-red-600 focus:ring-red-600/20 transition-all h-12 text-white"
                            required
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                        <Input 
                            name="email"
                            type="email"
                            placeholder="beast@gym.com" 
                            className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-red-600 focus:ring-red-600/20 transition-all h-12 text-white"
                            required
                        />
                    </div>
                </div>
                
                {/* Password Field */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                        <Input 
                            name="password"
                            placeholder="••••••••" 
                            type="password"
                            className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-red-600 focus:ring-red-600/20 transition-all h-12 text-white"
                            required
                        />
                    </div>
                    <p className="text-xs text-zinc-500">Must be at least 8 characters long.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg text-red-500 text-sm font-bold text-center">
                        {error}
                    </div>
                )}

                <Button 
                    type="submit" 
                    className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all mt-4"
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : "Create Account"} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <p className="text-center text-zinc-500 text-sm mt-6">
                   Already have an account? <Link href="/api/auth/signin" className="text-white font-bold hover:text-red-500 transition-colors underline decoration-zinc-700 underline-offset-4">Log In</Link>
                </p>
            </form>
         </motion.div>
      </div>

      {/* ---------------- RIGHT SIDE: THE VISUAL ---------------- */}
      <div className="hidden lg:block w-1/2 relative">
         <Image 
            src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop"
            alt="Gym Motivation"
            fill
            className="object-cover"
         />
         {/* Overlays */}
         <div className="absolute inset-0 bg-red-900/40 mix-blend-multiply" />
         <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/60" />
         
         {/* Floating Quote Card */}
         <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-20 left-12 right-12"
         >
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles size={100} className="text-white" />
                </div>
                
                <p className="text-2xl font-medium text-white mb-6 italic leading-relaxed tracking-wide">
                    "Strength does not come from physical capacity. It comes from an indomitable will. Start your journey now."
                </p>
                
                {/* ✅ REAL DATA: Highlighting the Tech Stack instead of fake users */}
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                         <Zap className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-white font-bold block">Powered by Gemini AI</span>
                        <span className="text-zinc-400 text-xs uppercase tracking-wider">Next-Gen Intelligence</span>
                    </div>
                </div>

            </div>
         </motion.div>
      </div>

    </div>
  )
}