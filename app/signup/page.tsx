"use client"

import { useState } from "react"
import { signupUser } from "../actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PasswordInput } from "@/components/ui/password-input" // Importing your new Eye button component
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dumbbell } from "lucide-react"

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
      alert("Account created! Please login.")
      router.push("/")
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center relative overflow-hidden bg-background">
       {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />
      
      <Card className="w-100 z-10 bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit mb-2">
            <Dumbbell className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Join IronLift</CardTitle>
          <CardDescription className="text-gray-400">Start your transformation today.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" className="bg-white/5 border-white/10 text-white" required />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input id="email" name="email" type="email" placeholder="beast@gym.com" className="bg-white/5 border-white/10 text-white" required />
            </div>

            {/* Password Field (With Eye Button) */}
            <PasswordInput id="password" name="password" label="Password" placeholder="••••••••" required />

            {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-red-700 font-bold mt-4">
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-gray-500">
            Already have an account? <Link href="/" className="text-primary hover:underline">Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}