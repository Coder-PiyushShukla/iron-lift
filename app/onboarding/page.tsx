"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { savePreferences } from "../actions/user-data"
import { useRouter } from "next/navigation"
import { Dumbbell, Flame, Scale, Check, Calendar, Utensils } from "lucide-react"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({
    goal: "",       // fatloss, bulking, recomp
    days: "",       // 4, 5, 6
    diet: ""        // veg, non-veg, vegan
  })
  const router = useRouter()

  const handleFinish = async () => {
    setIsLoading(true)
    await savePreferences({
      goal: data.goal,
      trainingDays: parseInt(data.days),
      dietType: data.diet
    })
    router.push("/generate") // Go to AI Generator
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-3xl z-10">
        {/* Progress Bar */}
        <div className="mb-8">
           <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-red-600"
               animate={{ width: `${(step / 3) * 100}%` }}
             />
           </div>
           <p className="text-right text-xs text-gray-500 mt-2">Step {step} of 3</p>
        </div>

        <AnimatePresence mode="wait">
          
          {/* STEP 1: GOAL */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h1 className="text-4xl font-bold text-center">Choose your mission</h1>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { id: "fatloss", label: "Fat Loss", icon: Flame, desc: "Deficit Calories" },
                  { id: "bulking", label: "Bulking", icon: Dumbbell, desc: "Surplus Calories" },
                  { id: "recomp", label: "Body Recomp", icon: Scale, desc: "Maintain & Sculpt" },
                ].map((item) => (
                  <div key={item.id} onClick={() => setData({...data, goal: item.id})}
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-4
                    ${data.goal === item.id ? "border-red-600 bg-red-600/10" : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"}`}>
                    <item.icon className={data.goal === item.id ? "text-red-500" : "text-gray-400"} size={32} />
                    <div><h3 className="font-bold text-lg">{item.label}</h3><p className="text-sm text-gray-500">{item.desc}</p></div>
                  </div>
                ))}
              </div>
              <Button onClick={() => setStep(2)} disabled={!data.goal} className="w-full bg-white text-black hover:bg-gray-200 font-bold h-12">Next Step</Button>
            </motion.div>
          )}

          {/* STEP 2: DAYS */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h1 className="text-4xl font-bold text-center">Training Frequency</h1>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { id: "4", label: "4 Days", desc: "Push / Pull / Legs / Full" },
                  { id: "5", label: "5 Days", desc: "Upper / Lower Split" },
                  { id: "6", label: "6 Days", desc: "PPL x 2 (Intense)" },
                ].map((item) => (
                  <div key={item.id} onClick={() => setData({...data, days: item.id})}
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-4
                    ${data.days === item.id ? "border-red-600 bg-red-600/10" : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"}`}>
                    <Calendar className={data.days === item.id ? "text-red-500" : "text-gray-400"} size={32} />
                    <div><h3 className="font-bold text-lg">{item.label}</h3><p className="text-sm text-gray-500">{item.desc}</p></div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="w-1/3">Back</Button>
                <Button onClick={() => setStep(3)} disabled={!data.days} className="w-2/3 bg-white text-black hover:bg-gray-200 font-bold h-12">Next Step</Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: DIET */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h1 className="text-4xl font-bold text-center">Fuel Preference</h1>
              <div className="grid md:grid-cols-3 gap-4">
                {["Veg", "Non-Veg", "Vegan"].map((item) => (
                  <div key={item} onClick={() => setData({...data, diet: item})}
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-4
                    ${data.diet === item ? "border-red-600 bg-red-600/10" : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800"}`}>
                    <Utensils className={data.diet === item ? "text-red-500" : "text-gray-400"} size={32} />
                    <h3 className="font-bold text-lg">{item}</h3>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <Button variant="ghost" onClick={() => setStep(2)} className="w-1/3">Back</Button>
                <Button onClick={handleFinish} disabled={!data.diet || isLoading} className="w-2/3 bg-red-600 hover:bg-red-700 text-white font-bold h-12">
                  {isLoading ? "Saving..." : "Generate My Plan"}
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}