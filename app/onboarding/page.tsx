"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dumbbell, Target, Ruler, Weight, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    goal: "",
    experience: ""
  })
  const router = useRouter()
  const totalSteps = 3

  const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps))
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1))

  const handleFinish = async () => {
    // Here you would call your server action
    console.log("Saving Data:", formData)
    // Simulate delay
    await new Promise(r => setTimeout(r, 1000))
    router.push("/dashboard") // Redirect to main app
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-red-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-2xl z-10">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between text-sm font-medium text-gray-400 mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
          </div>
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-red-600"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-100">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: BASIC STATS */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2 mb-8">
                  <h1 className="text-4xl font-bold tracking-tight">Let's calibrate your profile</h1>
                  <p className="text-gray-400 text-lg">We need your stats to calculate your personalized plan.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Age</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        className="bg-zinc-900/50 border-zinc-800 h-14 text-lg pl-4 focus:ring-red-600 focus:border-red-600"
                        placeholder="25"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Weight (kg)</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                        className="bg-zinc-900/50 border-zinc-800 h-14 text-lg pl-4 focus:ring-red-600 focus:border-red-600"
                        placeholder="75"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Height (cm)</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        value={formData.height}
                        onChange={(e) => setFormData({...formData, height: e.target.value})}
                        className="bg-zinc-900/50 border-zinc-800 h-14 text-lg pl-4 focus:ring-red-600 focus:border-red-600"
                        placeholder="180"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: GOAL SELECTION */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2 mb-8">
                  <h1 className="text-4xl font-bold tracking-tight">What is your primary goal?</h1>
                  <p className="text-gray-400 text-lg">This helps the AI design your workout intensity.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "muscle", label: "Build Muscle", desc: "Hypertrophy focus", icon: Dumbbell },
                    { id: "strength", label: "Get Stronger", desc: "Low reps, heavy weight", icon: Target },
                    { id: "fatloss", label: "Lose Fat", desc: "High intensity cardio", icon: Weight },
                  ].map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setFormData({...formData, goal: item.id})}
                      className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center text-center gap-4 hover:bg-zinc-800
                        ${formData.goal === item.id ? "border-red-600 bg-red-600/10" : "border-zinc-800 bg-zinc-900/50"}`}
                    >
                      <div className={`p-3 rounded-full ${formData.goal === item.id ? "bg-red-600 text-white" : "bg-zinc-800 text-gray-400"}`}>
                        <item.icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{item.label}</h3>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: EXPERIENCE LEVEL */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2 mb-8">
                  <h1 className="text-4xl font-bold tracking-tight">Experience Level</h1>
                  <p className="text-gray-400 text-lg">Be honest. We won't judge.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "beginner", label: "Beginner", desc: "I've never lifted or just started." },
                    { id: "intermediate", label: "Intermediate", desc: "I've been training for 1-2 years consistently." },
                    { id: "advanced", label: "Advanced", desc: "I'm a beast. I know what I'm doing." },
                  ].map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setFormData({...formData, experience: item.id})}
                      className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center justify-between hover:bg-zinc-800
                        ${formData.experience === item.id ? "border-red-600 bg-red-600/10" : "border-zinc-800 bg-zinc-900/50"}`}
                    >
                      <div>
                        <h3 className="font-bold text-lg">{item.label}</h3>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                      {formData.experience === item.id && (
                        <div className="bg-red-600 rounded-full p-1">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12 pt-6 border-t border-zinc-800">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            disabled={step === 1}
            className="text-gray-400 hover:text-white hover:bg-zinc-800"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          {step < totalSteps ? (
            <Button 
              onClick={handleNext}
              className="bg-white text-black hover:bg-gray-200 px-8 font-bold"
            >
              Next Step <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleFinish}
              className="bg-red-600 hover:bg-red-700 text-white px-8 font-bold shadow-[0_0_20px_rgba(220,38,38,0.5)]"
            >
              Finish Setup
            </Button>
          )}
        </div>

      </div>
    </div>
  )
}