"use server"

import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function logExerciseProgress(exerciseName: string, weight: number, reps: number) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      throw new Error("Unauthorized")
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      throw new Error("User not found")
    }

    await db.exerciseLog.create({
      data: {
        userId: user.id,
        exerciseName,
        weight,
        reps,
      }
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error: any) {
    console.error("Error logging exercise:", error)
    return { success: false, error: error.message || "Failed to log exercise" }
  }
}
