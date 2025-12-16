"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Camera, Zap, CheckCircle2, Loader2, ScanLine } from "lucide-react"
import { analyzeMeal } from "../actions/scan-meal"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function MealScannerPage() {
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setImage(url)
      setResult(null)
      // Auto start scanning
      handleScan(file)
    }
  }

  const handleScan = async (file: File) => {
    setLoading(true)
    const formData = new FormData()
    formData.append("image", file)

    const res = await analyzeMeal(formData)
    
    if (res.success) {
      setResult(res.data)
    } else {
      alert("Scan failed. Try again.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 relative overflow-hidden flex flex-col items-center">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-96 bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="z-10 w-full max-w-md space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-16 h-16 bg-red-600 rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)]"
          >
            <ScanLine size={32} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Iron <span className="text-red-600">Vision</span>
          </h1>
          <p className="text-zinc-500">AI-Powered Nutritional Scanner</p>
        </div>

        {/* SCANNER AREA */}
        <Card className="relative bg-zinc-900/50 border-zinc-800 h-96 rounded-3xl overflow-hidden flex items-center justify-center border-dashed border-2 hover:border-red-600/50 transition-colors group">
          
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" // Opens camera on mobile
            className="absolute inset-0 opacity-0 cursor-pointer z-50"
            onChange={handleFileChange}
            ref={fileInputRef}
          />

          {!image ? (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Camera size={32} className="text-zinc-400" />
              </div>
              <p className="text-zinc-400 font-medium">Tap to Snap or Upload</p>
            </div>
          ) : (
            <div className="relative w-full h-full">
              <img src={image} alt="Scan" className="w-full h-full object-cover" />
              
              {/* SCANNING LASER ANIMATION */}
              {loading && (
                <motion.div 
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)] z-20"
                />
              )}
              
              {/* Scanning Overlay */}
              {loading && (
                <div className="absolute inset-0 bg-red-900/20 grid grid-cols-6 grid-rows-6">
                   {[...Array(36)].map((_, i) => (
                     <div key={i} className="border-[0.5px] border-red-500/10" />
                   ))}
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="bg-black/70 backdrop-blur-md px-6 py-2 rounded-full border border-red-500/30 flex items-center gap-2">
                       <Loader2 className="animate-spin text-red-500" size={18} />
                       <span className="text-red-500 font-mono text-sm">ANALYZING...</span>
                     </div>
                   </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* RESULTS AREA */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap size={100} />
                </div>

                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-white mb-1">{result.name}</h2>
                  <p className="text-zinc-400 text-sm mb-6">{result.analysis}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/40 p-4 rounded-xl border border-zinc-800">
                      <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Calories</p>
                      <p className="text-3xl font-black text-white">{result.calories}</p>
                    </div>
                    <div className="space-y-2">
                      <MacroBar label="Protein" value={result.macros.protein} total={200} color="bg-red-500" />
                      <MacroBar label="Carbs" value={result.macros.carbs} total={300} color="bg-blue-500" />
                      <MacroBar label="Fats" value={result.macros.fats} total={100} color="bg-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => {
                  setImage(null)
                  setResult(null)
                }}
                className="w-full bg-white text-black hover:bg-zinc-200 h-14 rounded-xl text-lg font-bold"
              >
                Scan Next Meal
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

// Helper Component for Macros
function MacroBar({ label, value, total, color }: any) {
  const percentage = Math.min((value / total) * 100, 100)
  return (
    <div className="bg-black/40 p-2 rounded-lg border border-zinc-800">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-zinc-400">{label}</span>
        <span className="text-white font-bold">{value}g</span>
      </div>
      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full ${color}`} 
        />
      </div>
    </div>
  )
}