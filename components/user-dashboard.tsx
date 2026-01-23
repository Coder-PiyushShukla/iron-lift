"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlayCircle, BookOpen } from "lucide-react"

export default function UserDashboard({ user }: { user: any }) {
  const diet = user.dietPlan
  const workout = user.workoutPlan

  return (
    <div className="min-h-screen p-6 md:p-12">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black italic tracking-tighter">
          Welcome back, <span className="text-red-500">{user.name}</span>
        </h1>
      </div>

      <Tabs defaultValue="workout" className="w-full">
        {/* Modern Glass Tabs */}
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-full h-14 w-full md:w-auto">
          <TabsTrigger value="workout" className="rounded-full h-12 px-8 text-zinc-400 data-[state=active]:bg-red-600 data-[state=active]:text-white font-bold transition-all">Workout</TabsTrigger>
          <TabsTrigger value="diet" className="rounded-full h-12 px-8 text-zinc-400 data-[state=active]:bg-red-600 data-[state=active]:text-white font-bold transition-all">Diet</TabsTrigger>
          <TabsTrigger value="learn" className="rounded-full h-12 px-8 text-zinc-400 data-[state=active]:bg-red-600 data-[state=active]:text-white font-bold transition-all">Learn</TabsTrigger>
        </TabsList>

        {/* WORKOUT TAB */}
        <TabsContent value="workout" className="space-y-6 mt-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workout.map((day: any, i: number) => (
              <div key={i} className="glass-card p-6 rounded-3xl hover:bg-white/5 transition-colors">
                <h3 className="text-xl font-bold mb-6 text-red-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  {day.day}
                </h3>
                <div className="space-y-4">
                  {day.exercises.map((ex: any, j: number) => (
                    <div key={j} className="border-b border-white/5 pb-3 last:border-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-zinc-200">{ex.name}</span>
                        <a 
                          href={`https://www.youtube.com/results?search_query=${ex.videoQuery}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-zinc-500 hover:text-red-500 transition-colors"
                        >
                          <PlayCircle size={18} />
                        </a>
                      </div>
                      <p className="text-xs text-zinc-500 font-mono bg-black/30 inline-block px-2 py-1 rounded-md">
                        {ex.sets} sets × {ex.reps}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* DIET TAB */}
        <TabsContent value="diet" className="mt-8">
          <div className="glass-card p-8 rounded-3xl max-w-4xl">
            <div className="text-center mb-10 pb-8 border-b border-white/10">
              <h2 className="text-5xl font-black text-white mb-2">{diet.calories}</h2>
              <p className="text-zinc-500 uppercase tracking-widest text-sm font-bold">Daily Target Calories</p>
              
              <div className="flex justify-center gap-4 mt-6">
                <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-xl text-sm font-bold border border-blue-500/20">Protein: {diet.macros.protein}</div>
                <div className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-xl text-sm font-bold border border-yellow-500/20">Carbs: {diet.macros.carbs}</div>
                <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded-xl text-sm font-bold border border-red-500/20">Fats: {diet.macros.fats}</div>
              </div>
            </div>
            <div className="space-y-4">
              {diet.meals.map((meal: any, i: number) => (
                <div key={i} className="flex justify-between items-center bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-red-500/30 transition-colors">
                  <div>
                    <h4 className="font-bold text-red-500 mb-1">{meal.name}</h4>
                    <p className="text-zinc-300 text-sm">{meal.food}</p>
                  </div>
                  <span className="font-mono text-white font-bold bg-zinc-800 px-3 py-1 rounded-lg text-sm">{meal.calories} kcal</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* LEARN TAB */}
        <TabsContent value="learn" className="mt-8">
           <div className="p-16 text-center glass-card rounded-3xl">
             <BookOpen className="w-16 h-16 mx-auto text-red-500 mb-6" />
             <h3 className="text-3xl font-bold mb-2">Iron Knowledge Hub</h3>
             <p className="text-zinc-400 mb-8 max-w-md mx-auto">Master the terminology to master your body. Access our library of fitness science.</p>
             <Button className="h-12 px-8 rounded-full bg-white text-black hover:bg-zinc-200 font-bold" onClick={() => window.location.href='/learn'}>
               Enter Library
             </Button>
           </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}