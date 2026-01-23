"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { updatePassword } from "..//../actions/auth"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dumbbell, Lock, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"

function NewPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email")
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    if (email) formData.append("email", email)

    const res = await updatePassword(formData)

    if (res.error) {
      setError(res.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => router.push("/api/auth/signin"), 2000)
    }
  }

  if (!email) {
    return (
      <div className="text-center text-red-500 font-bold">
        Invalid Request. No email found.
      </div>
    )
  }

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="bg-red-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
                    <Dumbbell className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-black tracking-tighter">IRON<span className="text-red-600">LIFT</span></span>
            </Link>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            
            {success ? (
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                        <CheckCircle2 size={32} />
                    </div>
                    <h2 className="text-2xl font-bold">Password Updated</h2>
                    <p className="text-zinc-400">Redirecting to login...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-2">Set New Password</h1>
                        <p className="text-zinc-400 text-sm">Create a strong password for {email}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">New Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                            <Input 
                                name="password"
                                placeholder="••••••••" 
                                type="password"
                                className="pl-10 bg-black/50 border-zinc-700 focus:border-red-600 focus:ring-red-600/20 transition-all h-12 text-white"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Confirm Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                            <Input 
                                name="confirm"
                                placeholder="••••••••" 
                                type="password"
                                className="pl-10 bg-black/50 border-zinc-700 focus:border-red-600 focus:ring-red-600/20 transition-all h-12 text-white"
                                required
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}

                    <Button 
                        type="submit" 
                        className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Update Password"}
                    </Button>
                </form>
            )}
        </div>
      </motion.div>
  )
}

export default function NewPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white relative overflow-hidden px-4">
      <div className="absolute top-[-20%] right-[-10%] w-150  h-150 bg-red-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-125 h-125 bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <NewPasswordForm />
      </Suspense>
    </div>
  )
}