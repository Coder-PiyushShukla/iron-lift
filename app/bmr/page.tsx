 "use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calculator, Activity, Flame, ChevronRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

// Import the Server Action and Router
import { saveBMRData } from "../actions/user-data"
import { useRouter } from "next/navigation"

export default function BMRPage() {
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "male"
  })
  const [bmr, setBmr] = useState<number | null>(null)
  const router = useRouter()

  const calculateBMR = async (e: React.FormEvent) => {
    e.preventDefault()
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height)
    const age = parseFloat(formData.age)

    if (!weight || !height || !age) return

    // Mifflin-St Jeor Equation
    let result = 0
    if (formData.gender === "male") {
      result = (10 * weight) + (6.25 * height) - (5 * age) + 5
    } else {
      result = (10 * weight) + (6.25 * height) - (5 * age) - 161
    }
    
    const calculatedBmr = Math.round(result)
    setBmr(calculatedBmr)

    // SAVE TO DATABASE AUTOMATICALLY
    // This calls the Server Action we created
    await saveBMRData({
      age,
      weight,
      height,
      gender: formData.gender,
      bmr: calculatedBmr
    })
  }

  const reset = () => {
    setBmr(null)
    setFormData({ age: "", weight: "", height: "", gender: "male" })
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden flex items-center justify-center">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-red-600/20 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT SIDE: The Form */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 flex items-center gap-3">
              <Calculator className="text-red-600 h-10 w-10" /> 
              BMR <span className="text-zinc-500">Calculator</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Calculate your Basal Metabolic Rate—the number of calories your body needs to survive at rest.
            </p>
          </div>

          <Card className="bg-zinc-900/50 border-zinc-800 p-8 backdrop-blur-md">
            <form onSubmit={calculateBMR} className="space-y-6">
              
              {/* Gender Selection */}
              <div className="grid grid-cols-2 gap-4">
                {["male", "female"].map((g) => (
                  <div 
                    key={g}
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`cursor-pointer text-center p-4 rounded-xl border-2 transition-all font-bold capitalize
                      ${formData.gender === g 
                        ? "border-red-600 bg-red-600/20 text-white" 
                        : "border-zinc-800 bg-black/40 text-gray-500 hover:border-zinc-600"}`}
                  >
                    {g}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Age</Label>
                    <Input 
                      type="number" 
                      placeholder="25" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="bg-black/50 border-zinc-700 h-12 text-lg focus:border-red-600" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Weight (kg)</Label>
                    <Input 
                      type="number" 
                      placeholder="70" 
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="bg-black/50 border-zinc-700 h-12 text-lg focus:border-red-600" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Height (cm)</Label>
                  <Input 
                    type="number" 
                    placeholder="175" 
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="bg-black/50 border-zinc-700 h-12 text-lg focus:border-red-600" 
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold bg-red-600 hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
              >
                Calculate BMR <ChevronRight className="ml-2" />
              </Button>
            </form>
          </Card>
        </div>

        {/* RIGHT SIDE: The Results */}
        <div className="relative min-h-100 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!bmr ? (
              // Empty State
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="text-center space-y-4 opacity-50"
              >
                <Activity className="w-24 h-24 mx-auto text-zinc-800" />
                <p className="text-zinc-600 text-xl">Enter your details to see the magic.</p>
              </motion.div>
            ) : (
              // Result State
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full space-y-6"
              >
                {/* Main BMR Card */}
                <div className="bg-linear-to-br from-red-600 to-red-900 p-8 rounded-3xl shadow-2xl text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
                  
                  <p className="text-red-100 font-medium mb-2">Your Basal Metabolic Rate</p>
                  <h2 className="text-6xl font-black text-white mb-2">{bmr}</h2>
                  <p className="text-red-200 text-sm uppercase tracking-widest">Calories / Day</p>
                </div>

                {/* Daily Needs Breakdown */}
                <div className="space-y-3">
                  <p className="text-gray-400 font-medium pl-1">Daily Needs based on Activity:</p>
                  {[
                    { label: "Sedentary (Office Job)", mult: 1.2 },
                    { label: "Light Exercise (1-2 days)", mult: 1.375 },
                    { label: "Moderate Exercise (3-5 days)", mult: 1.55 },
                    { label: "Heavy Exercise (6-7 days)", mult: 1.725 },
                  ].map((item, i) => (
                    <motion.div 
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex justify-between items-center p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700"
                    >
                      <div className="flex items-center gap-3">
                        <Flame className={`w-5 h-5 ${i > 1 ? "text-red-500" : "text-blue-500"}`} />
                        <span className="text-gray-300">{item.label}</span>
                      </div>
                      <span className="font-bold text-white text-lg">
                        {Math.round(bmr * item.mult)} <span className="text-xs text-zinc-500 font-normal">kcal</span>
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                {/* NAVIGATION BUTTON TO NEXT STEP */}
                <Button 
                  onClick={() => router.push("/onboarding")}
                  className="w-full h-14 bg-white text-black hover:bg-gray-200 font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  Next: Customize Plan <ChevronRight className="ml-2" />
                </Button>

                <Button variant="ghost" onClick={reset} className="w-full text-zinc-500 hover:text-white">
                  <RotateCcw className="w-4 h-4 mr-2" /> Recalculate
                </Button>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}