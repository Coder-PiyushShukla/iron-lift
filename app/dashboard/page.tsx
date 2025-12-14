"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Flame, PlayCircle, Calendar as CalendarIcon, BookOpen } from "lucide-react" //  
import { DietCard } from "..//..//components/dietcard"
import { VideoModal } from "@/components/VideoModal"
import Link from "next/link"  

export default function Dashboard() {
  const [plan, setPlan] = useState<any>(null)
  const [activeDay, setActiveDay] = useState("Monday")

  useEffect(() => {
    const savedPlan = localStorage.getItem("ironLiftPlan")
    if (savedPlan) {
      setPlan(JSON.parse(savedPlan))
    }
  }, [])

  if (!plan) return <div className="p-10 text-white">Loading your gains...</div>

  const todaysWorkout = plan.schedule.find((p: any) => p.day === activeDay)

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      
       
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-gray-400">Welcome back, Athlete.</p>
        </div>
        
        <Link href="/learn">
          <button className="flex items-center gap-2 bg-white/5 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition border border-white/10">
            <BookOpen className="w-4 h-4 text-primary" /> 
            <span className="font-bold">Iron Knowledge</span>
          </button>
        </Link>
      </div>

       
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/40 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Current Streak</CardTitle>
            <Flame className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0 Days</div>
            <p className="text-xs text-gray-500">Start today to ignite the fire!</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Program Goal</CardTitle>
            <CalendarIcon className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Hypertrophy</div>
            <p className="text-xs text-gray-500">Based on your AI Analysis</p>
          </CardContent>
        </Card>
      </div>

       
      <div className="flex gap-2 overflow-x-auto pb-2">
        {plan.schedule.map((dayPlan: any) => (
          <button
            key={dayPlan.day}
            onClick={() => setActiveDay(dayPlan.day)}
            className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap
              ${activeDay === dayPlan.day 
                ? "bg-primary text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]" 
                : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
          >
            {dayPlan.day}
          </button>
        ))}
      </div>

       
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
           {todaysWorkout?.muscleGroup || "Rest Day"}
        </h2>

        {todaysWorkout?.exercises.map((exercise: any, index: number) => (
          <div key={index} className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all p-4">
            <div className="flex justify-between items-center z-10 relative">
              
              
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center text-primary">
                    <span className="font-bold text-lg">{index + 1}</span>
                 </div>
                 <div>
                    <h3 className="font-bold text-white text-lg">{exercise.name}</h3>
                    <p className="text-sm text-gray-400">{exercise.sets} Sets × {exercise.reps} Reps</p>
                 </div>
              </div>

               
              <div className="flex items-center gap-3">
                 <VideoModal 
                    exerciseName={exercise.name} 
                    searchQuery={exercise.youtubeSearch || `${exercise.name} form`} 
                 />

                 <button className="h-10 w-10 rounded-full border-2 border-white/20 flex items-center justify-center hover:bg-green-500 hover:border-green-500 transition-all group-active:scale-95">
                    <CheckCircle2 className="w-6 h-6 text-white/20 group-hover:text-white" />
                 </button>
              </div>

            </div>
          </div>
        ))}
      </div>
      
       
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4">Nutrition & Fuel</h2>
        <DietCard nutrition={plan.nutrition} />
      </div>

    </div>
  )
}