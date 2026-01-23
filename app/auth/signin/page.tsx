"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dumbbell, Mail, Lock, Loader2, ArrowRight, Star, BadgeCheck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function SignInPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleGoogleSignIn = async () => {
    setLoading(true)
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      alert("Invalid credentials. Try again.")
      setLoading(false)
    } else {
      router.push("/dashboard")
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
                <h1 className="text-4xl font-black tracking-tight mb-2">Welcome Back.</h1>
                <p className="text-zinc-400">Enter your credentials to access your command center.</p>
            </div>

            {/* Form */}
            <div className="space-y-6">
                
                {/* Google Button */}
                <Button 
                    onClick={handleGoogleSignIn}
                    variant="outline" 
                    className="w-full h-14 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition-all font-bold text-lg flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Sign in with Google
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-4 text-zinc-500">Or continue with email</span></div>
                </div>

                <form onSubmit={handleCredentialsSignIn} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                            <Input 
                                placeholder="name@example.com" 
                                className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-red-600 focus:ring-red-600/20 transition-all h-12 text-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-zinc-300">Password</label>
                            <Link href="/auth/forgot-password" className="text-xs text-red-500 hover:text-red-400 font-bold">Forgot password?</Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                            <Input 
                                placeholder="••••••••" 
                                type="password"
                                className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-red-600 focus:ring-red-600/20 transition-all h-12 text-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] transition-all"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Log In"} <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </form>

                <p className="text-center text-zinc-500 text-sm">
                   Don't have an account? <Link href="/auth/signup" className="text-white font-bold hover:text-red-500 transition-colors underline decoration-zinc-700 underline-offset-4">Sign Up for Free</Link>
                </p>
            </div>
         </motion.div>
      </div>

      {/* ---------------- RIGHT SIDE: THE VISUAL ---------------- */}
      <div className="hidden lg:block w-1/2 relative">
         <Image 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
            alt="Gym Motivation"
            fill
            className="object-cover"
         />
         {/* Overlays */}
         <div className="absolute inset-0 bg-red-900/20 mix-blend-multiply" />
         <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40" />
         
         {/* Floating Quote Card */}
         <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-20 left-12 right-12"
         >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Dumbbell size={100} className="text-white" />
                </div>
                
                <div className="flex gap-1 mb-4 text-yellow-500">
                    {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" size={20} />)}
                </div>
                
                <p className="text-2xl font-medium text-white mb-6 italic leading-relaxed tracking-wide">
                    "The only bad workout is the one that didn't happen. Iron Lift keeps me consistent every single day."
                </p>
                
                <div className="flex items-center gap-3">
                    <BadgeCheck className="text-blue-500 w-6 h-6" />
                    <span className="text-zinc-300 font-bold tracking-wider uppercase text-sm">Verified Athlete</span>
                </div>
            </div>
         </motion.div>
      </div>

    </div>
  )
}
