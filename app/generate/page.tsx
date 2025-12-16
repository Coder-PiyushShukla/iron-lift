"use client"

import { useState } from "react"
import { generateEverything } from "../actions/generate-plan"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Sparkles, Calendar } from "lucide-react"
import { motion } from "framer-motion"

export default function GeneratePage() {
  const [plan, setPlan] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    const result = await generateEverything()
    
    if (result.error) {
        alert("Error: " + result.error)
    } else {
        // We need to fetch the updated user data to see the plan
        // For this demo, we can just reload or ideally return the plan from the action
        // Assuming generateEverything returns { success: true } currently, 
        // you might want to update it to return the plan, or redirect to dashboard:
        window.location.href = "/dashboard"
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-125 h-125 bg-red-600/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto z-10 relative">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-5xl font-bold flex items-center justify-center gap-3">
            AI <span className="text-red-600">Trainer</span> <Sparkles className="text-yellow-400" />
          </h1>
          <p className="text-gray-400 text-lg">
            Generate a personalized workout plan instantly using Google Gemini AI.
          </p>
          
          <Button 
            onClick={handleGenerate} 
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all hover:scale-105"
          >
            {loading ? (
              <> <Loader2 className="animate-spin mr-2" /> Building Plan... </>
            ) : (
              "Generate My Plan"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}