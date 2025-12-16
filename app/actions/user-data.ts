"use server"

import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "..//..//lib/auth"

 
export async function saveBMRData(data: { age: number, weight: number, height: number, gender: string, bmr: number }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { error: "Not logged in" }

  await db.user.update({
    where: { email: session.user.email },
    data: { ...data }
  })
  return { success: true }
}

 
export async function savePreferences(data: { goal: string, trainingDays: number, dietType: string }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { error: "Not logged in" }

  await db.user.update({
    where: { email: session.user.email },
    data: { ...data }
  })
  return { success: true }
}

 
export async function markWorkoutComplete() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { error: "Not logged in" }

  const user = await db.user.findUnique({ where: { email: session.user.email } })
  if (!user) return { error: "User not found" }

  const today = new Date()
  const last = user.lastWorkout ? new Date(user.lastWorkout) : null
  
   
  if (last && last.getDate() === today.getDate() && last.getMonth() === today.getMonth()) {
    return { message: "Already logged today!" }
  }

  
  await db.user.update({
    where: { email: session.user.email },
    data: {
      streak: { increment: 1 },
      lastWorkout: today
    }
  })
  return { success: true, newStreak: user.streak + 1 }
}
