"use client"

import { useState, useEffect } from "react"
import { savePlan, completeDay, getPlannerData } from "../actions/planner"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, CheckCircle2, Flame, Save, Dumbbell, Utensils, Calendar } from "lucide-react"
import { useSession } from "next-auth/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Exercise = { id: string; name: string; sets: string; reps: string }
type Meal = { id: string; name: string; calories: string }
type WeeklyPlan<T> = { [key: string]: T[] }

const emptyPlan = {
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
}

// --- NEW COMPONENT: Workout Heatmap ---
function WorkoutHeatmap({ history }: { history: Date[] }) {
    const daysToShow = 30
    const today = new Date()
    today.setHours(0,0,0,0)
    
    const datesArray = Array.from({ length: daysToShow }, (_, i) => {
      const d = new Date(today)
      d.setDate(d.getDate() - (daysToShow - 1 - i))
      return d
    })
  
    // Convert history to string set for comparison
    const historySet = new Set(history.map(d => new Date(d).toDateString()))
  
    return (
      <div className="flex flex-col items-end">
          <div className="flex gap-1 mb-2">
            {datesArray.map((date, i) => {
              const dateStr = date.toDateString()
              const isCompleted = historySet.has(dateStr)
              const isToday = dateStr === today.toDateString()
              
              return (
                <TooltipProvider key={i}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <motion.div 
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className={`w-3 h-3 md:w-4 md:h-4 rounded-sm ${
                            isCompleted 
                              ? "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" 
                              : "bg-zinc-800"
                          } ${isToday ? "ring-2 ring-white" : ""}`}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 border-zinc-800 font-bold text-white">
                      <p>{date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                      <p className={isCompleted ? "text-red-500" : "text-zinc-500"}>{isCompleted ? "Completed 🔥" : "Skipped"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Last {daysToShow} Days Activity</p>
      </div>
    )
  }

export default function PlannerPage() {
  const { data: session } = useSession()
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [checkInHistory, setCheckInHistory] = useState<Date[]>([])
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const [selectedDay, setSelectedDay] = useState("Monday")

  const [workoutPlan, setWorkoutPlan] = useState<WeeklyPlan<Exercise>>(emptyPlan)
  const [dietPlan, setDietPlan] = useState<WeeklyPlan<Meal>>(emptyPlan)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    async function loadData() {
        if(session?.user) {
            const savedWorkoutDraft = localStorage.getItem("ironlift-workout-draft")
            const savedDietDraft = localStorage.getItem("ironlift-diet-draft")

            const dbData = await getPlannerData()
            
            if (dbData) {
                setStreak(dbData.currentStreak)
                setMaxStreak(dbData.maxStreak)
                // SAFE PARSING OF DATES
                if (Array.isArray(dbData.checkInHistory)) {
                    setCheckInHistory(dbData.checkInHistory.map((d: any) => new Date(d)))
                }
            }

            if (savedWorkoutDraft && savedDietDraft) {
                setWorkoutPlan(JSON.parse(savedWorkoutDraft))
                setDietPlan(JSON.parse(savedDietDraft))
            } else if (dbData) {
                if(dbData.customWorkout) setWorkoutPlan(dbData.customWorkout as WeeklyPlan<Exercise>)
                if(dbData.customDiet) setDietPlan(dbData.customDiet as WeeklyPlan<Meal>)
            }
            setIsLoaded(true)
        }
    }
    loadData()
  }, [session])

  useEffect(() => {
    if (isLoaded) {
        localStorage.setItem("ironlift-workout-draft", JSON.stringify(workoutPlan))
        localStorage.setItem("ironlift-diet-draft", JSON.stringify(dietPlan))
    }
  }, [workoutPlan, dietPlan, isLoaded])

  const currentExercises = workoutPlan[selectedDay] || []
  const currentMeals = dietPlan[selectedDay] || []

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addExercise = () => {
    const newEx = { id: generateId(), name: "", sets: "", reps: "" }
    setWorkoutPlan({ ...workoutPlan, [selectedDay]: [...currentExercises, newEx] })
  }

  const updateExercise = (index: number, field: keyof Exercise, value: string) => {
    const updatedList = [...currentExercises]
    updatedList[index] = { ...updatedList[index], [field]: value }
    setWorkoutPlan({ ...workoutPlan, [selectedDay]: updatedList })
  }

  const removeExercise = (index: number) => {
    const updatedList = currentExercises.filter((_, i) => i !== index)
    setWorkoutPlan({ ...workoutPlan, [selectedDay]: updatedList })
  }

  const addMeal = () => {
    const newMeal = { id: generateId(), name: "", calories: "" }
    setDietPlan({ ...dietPlan, [selectedDay]: [...currentMeals, newMeal] })
  }

  const updateMeal = (index: number, field: keyof Meal, value: string) => {
    const updatedList = [...currentMeals]
    updatedList[index] = { ...updatedList[index], [field]: value }
    setDietPlan({ ...dietPlan, [selectedDay]: updatedList })
  }

  const removeMeal = (index: number) => {
    const updatedList = currentMeals.filter((_, i) => i !== index)
    setDietPlan({ ...dietPlan, [selectedDay]: updatedList })
  }

  const handleSave = async () => {
    await savePlan(workoutPlan, dietPlan)
    alert("✅ Weekly Schedule Saved & Synced!")
  }

  const handleComplete = async () => {
    const res = await completeDay()
    if (res.error) {
      alert(res.error)
    } else {
      setStreak(res.newStreak || 1)
      setMaxStreak(res.maxStreak || 1)
      setCheckInHistory([...checkInHistory, new Date()])
      alert(`🔥 Day Completed! Streak: ${res.newStreak}`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-12 pb-48">
      
      <div className="max-w-5xl mx-auto mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            Architect <span className="text-red-600">Mode</span>
          </h1>
          <p className="text-zinc-400">Design your weekly protocol & track consistency.</p>
        </div>
        
        <div className="flex flex-col items-end gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-center gap-4">
                <div className="bg-red-600/20 p-3 rounded-full text-red-500 animate-pulse">
                    <Flame fill="currentColor" />
                </div>
                <div>
                    <p className="text-xs text-zinc-400 uppercase font-bold">Current / Best</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-black">{streak}</p>
                        <span className="text-zinc-500 text-sm font-bold">/ {maxStreak} Days</span>
                    </div>
                </div>
            </div>

            <WorkoutHeatmap history={checkInHistory} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {days.map((day) => (
                <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                        selectedDay === day 
                        ? "bg-white text-black scale-105 shadow-lg" 
                        : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800"
                    }`}
                >
                    {day}
                </button>
            ))}
        </div>

        <div className="space-y-8">
            <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-red-600" />
                <h2 className="text-2xl font-bold">Editing: <span className="text-red-500">{selectedDay}</span></h2>
            </div>

            <Tabs defaultValue="workout" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-zinc-900 mb-8 h-12">
                    <TabsTrigger value="workout" className="data-[state=active]:bg-red-600 data-[state=active]:text-white font-bold">Workout</TabsTrigger>
                    <TabsTrigger value="diet" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-bold">Nutrition</TabsTrigger>
                </TabsList>

                <TabsContent value="workout" className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {currentExercises.length === 0 && (
                            <div className="text-center py-10 text-zinc-500 italic">No exercises planned for {selectedDay}.</div>
                        )}
                        {currentExercises.map((ex, i) => (
                            <motion.div 
                                key={ex.id || i}
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <Card className="bg-zinc-900/50 border-zinc-800 p-4 flex flex-col md:flex-row gap-4 items-center">
                                    <div className="hidden md:block bg-zinc-800 p-3 rounded-lg"><Dumbbell size={20} /></div>
                                    <Input 
                                        placeholder="Exercise Name" 
                                        className="bg-transparent border-0 border-b border-zinc-700 rounded-none focus-visible:ring-0 focus-visible:border-red-500 text-lg font-bold"
                                        value={ex.name}
                                        onChange={(e) => updateExercise(i, "name", e.target.value)}
                                    />
                                   <div className="flex gap-2 w-full md:w-auto">
                                        <Input placeholder="Sets" className="bg-transparent border-zinc-700 text-center" value={ex.sets} onChange={(e) => updateExercise(i, "sets", e.target.value)} />
                                        <Input placeholder="Reps" className="bg-transparent border-zinc-700 text-center" value={ex.reps} onChange={(e) => updateExercise(i, "reps", e.target.value)} />
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeExercise(i)} className="hover:text-red-500 shrink-0"><Trash2 size={18} /></Button>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    <Button onClick={addExercise} variant="outline" className="w-full border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-white h-14 mt-4">
                        <Plus className="mr-2" /> Add Exercise to {selectedDay}
                    </Button>
                    <div className="h-32"></div>
                </TabsContent>

                <TabsContent value="diet" className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {currentMeals.length === 0 && (
                            <div className="text-center py-10 text-zinc-500 italic">No meals planned for {selectedDay}.</div>
                        )}
                        {currentMeals.map((meal, i) => (
                            <motion.div key={meal.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}>
                                <Card className="bg-zinc-900/50 border-zinc-800 p-4 flex gap-4 items-center">
                                    <div className="bg-zinc-800 p-3 rounded-lg"><Utensils size={20} /></div>
                                    <Input placeholder="Meal Name" className="bg-transparent border-0 border-b border-zinc-700 rounded-none focus-visible:ring-0 focus-visible:border-blue-500 text-lg font-bold" value={meal.name} onChange={(e) => updateMeal(i, "name", e.target.value)} />
                                    <Input placeholder="Cal" className="w-24 bg-transparent border-zinc-700 text-center" value={meal.calories} onChange={(e) => updateMeal(i, "calories", e.target.value)} />
                                    <Button variant="ghost" size="icon" onClick={() => removeMeal(i)} className="hover:text-red-500"><Trash2 size={18} /></Button>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    <Button onClick={addMeal} variant="outline" className="w-full border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-white h-14 mt-4">
                        <Plus className="mr-2" /> Add Meal to {selectedDay}
                    </Button>
                    <div className="h-32"></div>
                </TabsContent>
            </Tabs>
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl border-t border-zinc-800 p-4 md:p-6 flex gap-4 justify-center z-50">
             <Button onClick={handleSave} className="bg-zinc-800 hover:bg-zinc-700 text-white h-12 md:h-14 px-8 rounded-full font-bold text-lg">
                <Save className="mr-2" /> Save Week
            </Button>
             <Button onClick={handleComplete} className="bg-red-600 hover:bg-red-700 text-white h-12 md:h-14 px-10 rounded-full font-black text-lg shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:scale-105 transition-transform">
                <CheckCircle2 className="mr-2" /> Finish {selectedDay}
            </Button>
        </div>

      </div>
    </div>
  )
}