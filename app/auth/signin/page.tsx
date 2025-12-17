"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dumbbell, Mail, Lock, Loader2 } from "lucide-react"

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
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] right-[-20%] w-150 h-150 bg-red-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-20%] w-150 h-150 bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-red-600 to-red-800 shadow-[0_0_40px_rgba(220,38,38,0.5)] mb-6">
                <Dumbbell className="text-white w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">Welcome Back</h1>
            <p className="text-zinc-400">Sign in to access your AI Dashboard</p>
        </div>

        <Card className="bg-zinc-900/50 border-zinc-800 p-8 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input 
                  placeholder="name@example.com" 
                  className="pl-10 bg-black/50 border-zinc-700 focus:border-red-600 transition-colors h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
               <label className="text-sm font-medium text-zinc-300 ml-1">Password</label>
               <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input 
                  placeholder="••••••••" 
                  type="password"
                  className="pl-10 bg-black/50 border-zinc-700 focus:border-red-600 transition-colors h-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
               </div>
            </div>

            <Button 
                type="submit" 
                className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold text-base mt-2"
                disabled={loading}
            >
                {loading ? <Loader2 className="animate-spin" /> : "Sign In with Email"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span></div>
          </div>

          <Button 
            onClick={handleGoogleSignIn}
            variant="outline" 
            className="w-full h-12 border-zinc-700 bg-black/50 hover:bg-zinc-900 hover:text-white hover:border-zinc-500 transition-all font-bold flex items-center gap-2"
          >
             {/* Google Logo */}
            <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </Button>
        </Card>
      </motion.div>
    </div>
  )
}