"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const apiKey = process.env.GEMINI_API_KEY || ""
const genAI = new GoogleGenerativeAI(apiKey)

export async function generateEverything() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { error: "Not authorized." }

  const user = await db.user.findUnique({ where: { email: session.user.email } })
  if (!user) return { error: "User not found." }

  let activityMultiplier = 1.2
  if (user.trainingDays === 4) activityMultiplier = 1.55
  else if (user.trainingDays === 5) activityMultiplier = 1.65
  else if (user.trainingDays === 6) activityMultiplier = 1.725

  const maintenanceCalories = Math.round((user.bmr || 2000) * activityMultiplier)
  
  let targetCalories = maintenanceCalories
  if (user.goal === "fatloss") targetCalories -= 500
  else if (user.goal === "bulking") targetCalories += 400

  let splitGuide = "Standard Split"
  if (user.trainingDays === 4) splitGuide = "Upper, Lower, Rest, Upper, Lower"
  else if (user.trainingDays === 6) splitGuide = "Push, Pull, Legs, Push, Pull, Legs"
  else splitGuide = "Push, Pull, Legs, Upper, Lower" 

  const isVeg = user.dietType?.toLowerCase().includes("veg")
  
  const dietExample = isVeg 
    ? `[
        { "name": "Breakfast", "food": "Paneer Paratha & Curd", "calories": 500 },
        { "name": "Lunch", "food": "Dal Makhani & Rice", "calories": 700 },
        { "name": "Dinner", "food": "Tofu Stir Fry", "calories": 600 }
      ]`
    : `[
        { "name": "Breakfast", "food": "Oats & Eggs", "calories": 500 },
        { "name": "Lunch", "food": "Chicken & Rice", "calories": 700 },
        { "name": "Dinner", "food": "Fish & Veggies", "calories": 600 }
      ]`

  const strictInstruction = isVeg 
    ? "STRICTLY VEGETARIAN. NO MEAT. NO EGGS. NO FISH. Use Paneer, Soya, Lentils, Tofu, Chickpeas."
    : "High protein diet including lean meats and healthy fats."

  const prompt = `
    Act as an elite fitness trainer. Create a JSON ONLY fitness plan.
    
    USER PROFILE:
    - Weight: ${user.weight || 70}kg
    - Goal: ${user.goal || "General"}
    - Diet Type: ${user.dietType || "Any"} (${strictInstruction})
    - Target Calories: ${targetCalories} kcal
    - Schedule: ${user.trainingDays || 5} Days Per Week (${splitGuide})
    
    TASK:
    1. Create a 1-day sample diet plan.
    2. Create a FULL ${user.trainingDays}-DAY workout split.
    
    IMPORTANT: Return ONLY valid JSON. No markdown.
    
    Structure:
    {
      "diet": {
        "calories": ${targetCalories},
        "macros": { "protein": "150g", "carbs": "200g", "fats": "60g" },
        "meals": ${dietExample}
      },
      "workout": [
        {
          "day": "Day 1 - Push Focus",
          "exercises": [
            { "name": "Bench Press", "sets": "3", "reps": "12", "videoQuery": "Bench Press form" }
          ]
        },
        {
          "day": "Day 2 - Pull Focus",
          "exercises": [
             { "name": "Pull Ups", "sets": "3", "reps": "10", "videoQuery": "Pull Ups form" }
          ]
        }
        // ... continue for all ${user.trainingDays} days
      ]
    }
  `

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    const firstBrace = text.indexOf("{")
    const lastBrace = text.lastIndexOf("}")
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1)
    }

    const plan = JSON.parse(text)

    await db.user.update({
      where: { email: session.user.email },
      data: {
        workoutPlan: plan.workout,
        dietPlan: plan.diet
      }
    })

    return { success: true }

  } catch (e: any) {
    return { error: `AI Failed: ${e.message}` }
  }
}