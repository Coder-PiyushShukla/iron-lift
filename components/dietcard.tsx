"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, Zap, Droplet } from "lucide-react"

export function DietCard({ nutrition }: { nutrition: any }) {
  if (!nutrition) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      
       
      <Card className="bg-black/40 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="text-yellow-500" /> Daily Targets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center text-center">
             <div>
                <p className="text-2xl font-bold text-white">{nutrition.calories}</p>
                <p className="text-xs text-gray-500">Calories</p>
             </div>
             <div className="h-8 w-px bg-white/10"></div>
             <div>
                <p className="text-xl font-bold text-blue-400">{nutrition.macros.protein}</p>
                <p className="text-xs text-gray-500">Protein</p>
             </div>
             <div>
                <p className="text-xl font-bold text-green-400">{nutrition.macros.carbs}</p>
                <p className="text-xs text-gray-500">Carbs</p>
             </div>
             <div>
                <p className="text-xl font-bold text-red-400">{nutrition.macros.fats}</p>
                <p className="text-xs text-gray-500">Fats</p>
             </div>
          </div>
        </CardContent>
      </Card>

      
      <Card className="bg-black/40 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Utensils className="text-primary" /> Meal Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {nutrition.meals.map((meal: any, idx: number) => (
            <div key={idx} className="flex gap-3 text-sm">
               <span className="font-bold text-primary min-w-20">{meal.name}:</span>
               <span className="text-gray-300">{meal.items.join(", ")}</span>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  )
}