"use server"

import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "..//..//lib/auth"
import { redirect } from "next/navigation"

export async function saveOnboardingData(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return { error: "You must be logged in." }
  }

  const age = parseInt(formData.get("age") as string)
  const weight = parseInt(formData.get("weight") as string)
  const height = parseInt(formData.get("height") as string)
  const goal = formData.get("goal") as string
  const experience = formData.get("experience") as string

  if (!age || !weight || !height || !goal || !experience) {
    return { error: "Please fill out all fields." }
  }

  try {
     
    await db.user.update({
      where: { email: session.user.email },
      data: {
        
      }
    })

   
    console.log("✅ Onboarding Data:", { age, weight, height, goal, experience })

    return { success: true }
  } catch (error) {
    console.error("Onboarding Error:", error)
    return { error: "Failed to save profile." }
  }
}