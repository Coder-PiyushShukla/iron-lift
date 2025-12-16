"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// 🔴 KEEP YOUR WORKING KEY HERE
const HARDCODED_KEY = "AIzaSyCRBA6q7xwEgRn9prpjB-DcxOT_uMx4ukQ" 

const genAI = new GoogleGenerativeAI(HARDCODED_KEY)

export async function generateEverything() {
  console.log("🚀 Starting Generation...")

  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { error: "Not authorized." }

  const user = await db.user.findUnique({ where: { email: session.user.email } })
  if (!user) return { error: "User not found." }

  // 1. Calculate TDEE (Maintenance Calories) based on Activity Level
  // This is much more accurate than just using BMR
  let activityMultiplier = 1.2 // Default Sedentary
  
  if (user.trainingDays === 4) activityMultiplier = 1.55  // Moderate
  else if (user.trainingDays === 5) activityMultiplier = 1.65 // High Active
  else if (user.trainingDays === 6) activityMultiplier = 1.725 // Very Active

  const maintenanceCalories = Math.round((user.bmr || 2000) * activityMultiplier)

  // 2. Adjust for Goal (Surplus or Deficit)
  let targetCalories = maintenanceCalories
  if (user.goal === "fatloss") targetCalories -= 500  // Standard deficit
  else if (user.goal === "bulking") targetCalories += 400 // Lean bulk surplus
  
  // 3. Define Split Guide
  let splitGuide = "Standard Split"
  if (user.trainingDays === 4) splitGuide = "Mon: Push, Tue: Pull, Wed: Legs, Thu: Rest, Fri: Full Body, Sat/Sun: Rest"
  else if (user.trainingDays === 6) splitGuide = "Push/Pull/Legs x2 (6 Day Split)"

  const prompt = `
    Act as an elite fitness trainer. Create a JSON ONLY fitness plan.
    User Stats: ${user.weight || 70}kg, ${user.height || 170}cm
    Goal: ${user.goal || "General"}
    Diet Preference: ${user.dietType || "Any"}
    
    CALCULATIONS:
    - BMR: ${user.bmr}
    - Activity Level: ${user.trainingDays} days/week (Multiplier: ${activityMultiplier})
    - Maintenance Calories: ${maintenanceCalories} kcal
    - TARGET DAILY CALORIES: ${targetCalories} kcal
    
    Schedule: ${user.trainingDays || 5} days/week (${splitGuide})

    Return strictly valid JSON. No markdown formatting. No intro text.
    Structure:
    {
      "diet": {
        "calories": ${targetCalories},
        "macros": { "protein": "150g", "carbs": "200g", "fats": "60g" },
        "meals": [
          { "name": "Breakfast", "food": "Oats & Eggs", "calories": 500 },
          { "name": "Lunch", "food": "Chicken & Rice", "calories": 700 },
          { "name": "Dinner", "food": "Fish & Veggies", "calories": 600 }
        ]
      },
      "workout": [
        {
          "day": "Day 1 - Push",
          "exercises": [
            { "name": "Bench Press", "sets": "3", "reps": "12", "videoQuery": "Bench Press form" }
          ]
        }
      ]
    }
  `

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    // Clean JSON
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

    console.log("🎉 Success! Plan Saved.")
    return { success: true }

  } catch (e: any) {
    console.error("❌ AI ERROR DETAILS:", e)
    return { error: `AI Failed: ${e.message}` }
  }
}