"use client"

import { useState } from "react"
import { resetPasswordAction } from "../actions/reset"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    await resetPasswordAction(formData)

    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <div className="flex h-screen w-full items-center justify-center relative overflow-hidden bg-black">
      
       
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-red-600/10 rounded-full blur-[120px]" />

      <Card className="w-100 z-10 bg-zinc-900/50 backdrop-blur-xl border-zinc-800 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-zinc-800 p-3 rounded-full w-fit mb-4">
            {isSubmitted ? (
               <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
               <Mail className="h-6 w-6 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {isSubmitted ? "Check your inbox" : "Forgot Password?"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {isSubmitted 
              ? "We have sent a password reset link to your email." 
              : "No worries, we'll send you reset instructions."}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="bg-black/50 border-zinc-800 text-white focus:ring-red-500 focus:border-red-500" 
                  required 
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                {isLoading ? "Sending Link..." : "Reset Password"}
              </Button>
            </form>
          ) : (
            <div className="text-center">
               <Button 
                 variant="outline"
                 className="w-full border-zinc-700 text-white hover:bg-zinc-800 hover:text-white"
                 onClick={() => setIsSubmitted(false)}
               >
                 Try another email
               </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center border-t border-zinc-800/50 pt-6 mt-2">
          <Link 
            href="/" 
            className="flex items-center text-sm text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}