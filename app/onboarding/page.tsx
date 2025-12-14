"use client"

import { generateWorkoutAction } from "../actions/workout"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ArrowLeft, Check, Dumbbell, Activity, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface UserData {
  age: string;
  gender: string;
  weight: string;
  height: string;
  level: "beginner" | "intermediate" | "advanced";
  days: string;
  diet: "veg" | "non-veg" | "vegan";
}

export default function Onboarding() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState<UserData>({
    age: "", gender: "", weight: "", height: "",
    level: "beginner", days: "3", diet: "non-veg"
  })

  const updateData = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const result = await generateWorkoutAction(formData)

      if (result.success) {
        localStorage.setItem("ironLiftPlan", JSON.stringify(result.plan))
        router.push("/dashboard")
      } else {
        alert("AI is sleepy. Try again.")
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 1000 : -1000, opacity: 0 }),
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
      
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-50" />
      <div className="absolute -left-20 top-40 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px]" />
      <div className="absolute -right-20 bottom-40 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md mb-8 flex justify-between items-center z-10">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-300 
              ${step >= item ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]" : "bg-black/50 border-gray-700 text-gray-500"}`}>
              {step > item ? <Check className="w-5 h-5" /> : item}
            </div>
            <span className="text-xs text-gray-400 font-mono">STEP 0{item}</span>
          </div>
        ))}
        <div className="absolute top-12.5 w-75 h-0.5 bg-gray-800 -z-10" />
      </div>

      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden min-h-125 flex flex-col">
        <CardContent className="flex-1 p-6 relative">
          <AnimatePresence mode="wait" custom={step}>
            
            {step === 1 && (
              <motion.div
                key="step1"
                variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                    <Activity className="text-primary" /> Physical Stats
                  </h2>
                  <p className="text-gray-400 text-sm">Let's calibrate the AI for your body type.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Age</Label>
                    <Input type="number" placeholder="24" className="bg-white/5 border-white/10 text-white" 
                      value={formData.age} onChange={(e) => updateData("age", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Gender</Label>
                    <Select onValueChange={(val) => updateData("gender", val)}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Weight (kg)</Label>
                    <Input type="number" placeholder="70" className="bg-white/5 border-white/10 text-white"
                      value={formData.weight} onChange={(e) => updateData("weight", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Height (cm)</Label>
                    <Input type="number" placeholder="175" className="bg-white/5 border-white/10 text-white"
                      value={formData.height} onChange={(e) => updateData("height", e.target.value)} />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                    <Dumbbell className="text-primary" /> Training Logic
                  </h2>
                  <p className="text-gray-400 text-sm">We'll design the splits based on this.</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-300">Experience Level</Label>
                  <RadioGroup defaultValue="beginner" onValueChange={(val: any) => updateData("level", val)}>
                    <div className="flex items-center space-x-2 border border-white/10 p-3 rounded-lg hover:bg-white/5 transition cursor-pointer">
                      <RadioGroupItem value="beginner" id="r1" className="border-primary text-primary" />
                      <Label htmlFor="r1" className="cursor-pointer flex-1">
                        <span className="text-white font-bold block">Beginner</span>
                        <span className="text-xs text-gray-500">0 - 6 Months (Foundational)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border border-white/10 p-3 rounded-lg hover:bg-white/5 transition cursor-pointer">
                      <RadioGroupItem value="intermediate" id="r2" className="border-primary text-primary" />
                      <Label htmlFor="r2" className="cursor-pointer flex-1">
                        <span className="text-white font-bold block">Intermediate</span>
                        <span className="text-xs text-gray-500">6 Months - 2 Years (Hypertrophy)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border border-white/10 p-3 rounded-lg hover:bg-white/5 transition cursor-pointer">
                      <RadioGroupItem value="advanced" id="r3" className="border-primary text-primary" />
                      <Label htmlFor="r3" className="cursor-pointer flex-1">
                        <span className="text-white font-bold block">Advanced</span>
                        <span className="text-xs text-gray-500">2 Years+ (Performance)</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Days available per week</Label>
                  <Select onValueChange={(val) => updateData("days", val)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select days (3-7)" />
                    </SelectTrigger>
                    <SelectContent>
                      {[3, 4, 5, 6, 7].map(d => (
                        <SelectItem key={d} value={d.toString()}>{d} Days</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                    <Utensils className="text-primary" /> Fuel Source
                  </h2>
                  <p className="text-gray-400 text-sm">Calculating macros (1.2g Protein/kg)...</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {['veg', 'non-veg', 'vegan'].map((type) => (
                      <div key={type} 
                        onClick={() => updateData("diet", type as any)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex items-center justify-between
                        ${formData.diet === type 
                          ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(220,38,38,0.2)]" 
                          : "border-white/10 hover:bg-white/5"}`}
                      >
                        <span className="text-white font-bold capitalize">{type}</span>
                        {formData.diet === type && <Check className="text-primary w-5 h-5" />}
                      </div>
                  ))}
                </div>
                
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-200">
                  ⚠️ Note: Based on your weight of {formData.weight || "0"}kg, we will calculate a {parseInt(formData.weight) > 75 ? "Fat Loss" : "Bulking"} protocol.
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </CardContent>

        <div className="p-6 pt-0 flex justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setStep(prev => prev - 1)}
            disabled={step === 1}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          {step < 3 ? (
            <Button 
              onClick={() => setStep(prev => prev + 1)}
              className="bg-white text-black hover:bg-gray-200 font-bold"
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-primary hover:bg-red-700 text-white font-bold shadow-[0_0_20px_rgba(220,38,38,0.5)]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating...
                </div>
              ) : (
                "Generate Protocol"
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}