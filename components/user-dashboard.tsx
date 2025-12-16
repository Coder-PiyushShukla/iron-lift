"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { markWorkoutComplete } from "..//app//actions/user-data"
import { Flame, PlayCircle, Trophy, BookOpen } from "lucide-react"

export default function UserDashboard({ user }: { user: any }) {
  const [streak, setStreak] = useState(user?.streak || 0)

  const handleComplete = async () => {
    const res = await markWorkoutComplete()
    if (res.newStreak) {
      setStreak(res.newStreak)
      alert("Workout Logged! Streak +1 🔥")
    }
  }

  const diet = user.dietPlan
  const workout = user.workoutPlan

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
        <div className="bg-red-600/20 text-red-500 px-4 py-2 rounded-full flex items-center gap-2 border border-red-600/50">
          <Flame /> {streak} Day Streak
        </div>
      </div>

      <Tabs defaultValue="workout" className="w-full">
        <TabsList className="bg-zinc-900 border-zinc-800">
          <TabsTrigger value="workout">Workout Plan</TabsTrigger>
          <TabsTrigger value="diet">Diet Plan</TabsTrigger>
          <TabsTrigger value="learn">Learn</TabsTrigger>
        </TabsList>

        {/* WORKOUT TAB */}
        <TabsContent value="workout" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workout.map((day: any, i: number) => (
              <Card key={i} className="bg-zinc-900 border-zinc-800 p-6">
                <h3 className="text-xl font-bold mb-4 text-red-500">{day.day}</h3>
                <div className="space-y-4">
                  {day.exercises.map((ex: any, j: number) => (
                    <div key={j} className="border-b border-zinc-800 pb-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{ex.name}</span>
                        <a 
                          href={`https://www.youtube.com/results?search_query=${ex.videoQuery}`} 
                          target="_blank" 
                          className="text-red-400 hover:text-white"
                        >
                          <PlayCircle size={18} />
                        </a>
                      </div>
                      <p className="text-xs text-gray-500">{ex.sets} sets x {ex.reps}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <Button onClick={handleComplete} className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold">
            <Trophy className="mr-2" /> Mark Today's Workout Complete
          </Button>
        </TabsContent>

        {/* DIET TAB */}
        <TabsContent value="diet" className="mt-6">
          <Card className="bg-zinc-900 border-zinc-800 p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white">{diet.calories} <span className="text-lg text-gray-500">kcal</span></h2>
              <div className="flex justify-center gap-6 mt-4 text-sm text-gray-400">
                <span>Protein: {diet.macros.protein}</span>
                <span>Carbs: {diet.macros.carbs}</span>
                <span>Fats: {diet.macros.fats}</span>
              </div>
            </div>
            <div className="space-y-4">
              {diet.meals.map((meal: any, i: number) => (
                <div key={i} className="flex justify-between items-center bg-black/40 p-4 rounded-xl">
                  <div>
                    <h4 className="font-bold text-red-500">{meal.name}</h4>
                    <p className="text-gray-300">{meal.food}</p>
                  </div>
                  <span className="font-mono text-zinc-500">{meal.calories} kcal</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* LEARN TAB */}
        <TabsContent value="learn" className="mt-6">
           <div className="p-10 text-center bg-zinc-900 rounded-xl border border-zinc-800">
             <BookOpen className="w-12 h-12 mx-auto text-red-500 mb-4" />
             <h3 className="text-2xl font-bold">Iron Knowledge Hub</h3>
             <p className="text-gray-400">Master the terminology to master your body.</p>
             <Button className="mt-4" onClick={() => window.location.href='/learn'}>Go to Library</Button>
           </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}