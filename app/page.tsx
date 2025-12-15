"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { Dumbbell } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGoogleLogin = () => {
    setIsLoading(true)
    signIn("google", { callbackUrl: "/onboarding" })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      alert("Invalid Email or Password")
      setIsLoading(false)
    } else {
      router.push("/onboarding")
    }
  }

  return (
    <div className="w-full h-screen grid lg:grid-cols-2">
      
      {/* LEFT SIDE: Visuals */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-12 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')" }} 
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-90" />

        <div className="relative z-10 flex items-center gap-2">
           <div className="bg-red-600 p-2 rounded-lg">
             <Dumbbell className="h-6 w-6 text-white" />
           </div>
           <span className="text-xl font-bold text-white tracking-tight">IronLift</span>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
          <blockquote className="text-2xl font-medium text-white leading-relaxed">
            "The only bad workout is the one that didn't happen. IronLift helps you track every rep, every set, and every gain."
          </blockquote>
          <p className="text-gray-400 text-sm">— The IronLift Manifesto</p>
        </div>
      </div>

      {/* RIGHT SIDE: The Form */}
      <div className="flex items-center justify-center bg-black p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-sm space-y-6"
        >
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="text-gray-400">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input 
                id="email" 
                name="email" 
                placeholder="name@example.com" 
                className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-red-500 focus:ring-red-500 transition-all" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                {/* NEW FORGOT PASSWORD LINK */}
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-red-500 hover:text-red-400 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput 
                id="password" 
                name="password" 
                label="" // Empty label because we added a custom one above
                placeholder="••••••••" 
                className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-red-500 focus:ring-red-500 transition-all"
                required 
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200"
            >
              {isLoading ? "Signing in..." : "Sign In with Email"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-2 text-zinc-500">Or continue with</span></div>
          </div>

          <Button 
            variant="outline" 
            type="button" 
            onClick={handleGoogleLogin} 
            className="w-full h-11 border-zinc-800 bg-zinc-900/30 text-white hover:bg-zinc-800 hover:text-white transition-all"
          >
             <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
            Google
          </Button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account? <Link href="/signup" className="font-semibold text-red-500 hover:text-red-400 hover:underline">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}