"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dumbbell, Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // 🕒 SIMULATION: We pretend to call the API
    // In a real app, you would call your backend here to send the email.
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 2000)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white relative overflow-hidden px-4">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] right-[-10%] w-150 h-150 bg-red-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-125 h-125 bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="bg-red-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
                    <Dumbbell className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-black tracking-tighter">IRON<span className="text-red-600">LIFT</span></span>
            </Link>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            
            {/* SUCCESS STATE */}
            {isSubmitted ? (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                        <CheckCircle2 size={32} />
                    </div>
                    <h2 className="text-2xl font-bold">Check your inbox</h2>
                    <p className="text-zinc-400">
                        We have sent a password reset link to <span className="text-white font-bold">{email}</span>.
                    </p>
                    <Button 
                        asChild
                        className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold mt-4"
                    >
                        <Link href="/api/auth/signin">Return to Login</Link>
                    </Button>
                </motion.div>
            ) : (
                /* FORM STATE */
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                        <p className="text-zinc-400 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                            <Input 
                                placeholder="name@example.com" 
                                type="email"
                                className="pl-10 bg-black/50 border-zinc-700 focus:border-red-600 focus:ring-red-600/20 transition-all h-12 text-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                    </Button>
                </form>
            )}
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
            <Link href="/api/auth/signin" className="inline-flex items-center text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                <ArrowLeft size={16} className="mr-2" /> Back to Sign In
            </Link>
        </div>

      </motion.div>
    </div>
  )
}