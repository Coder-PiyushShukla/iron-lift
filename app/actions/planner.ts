"use server"

import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

// Helper to normalize date to midnight for accurate comparison
const normalizeDate = (date: Date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

// 1. Fetch Data on Load
export async function getPlannerData() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      customWorkout: true,
      customDiet: true,
      currentStreak: true,
      maxStreak: true,
      lastCheckIn: true,
      checkInHistory: true, // Fetch history for the graph
    }
  })

  if (!user) return null

  // --- STREAK RESET LOGIC ON LOAD ---
  // If they visit the page and the last check-in wasn't today OR yesterday,
  // it means they skipped a day. Visually show 0 streak.
  const today = normalizeDate(new Date())
  const yesterday = normalizeDate(new Date())
  yesterday.setDate(yesterday.getDate() - 1)
  
  const lastCheckIn = user.lastCheckIn ? normalizeDate(user.lastCheckIn) : null
  
  let displayStreak = user.currentStreak

  // If never checked in OR last checkin was before yesterday, reset visual streak to 0
  if (!lastCheckIn || lastCheckIn.getTime() < yesterday.getTime()) {
    displayStreak = 0
  }
  // ----------------------------------

  return {
    ...user,
    currentStreak: displayStreak // Return the calculated display streak
  }
}

// 2. Save Plan (Unchanged)
export async function savePlan(workoutSchedule: any, dietSchedule: any) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { error: "Not logged in" }

  await db.user.update({
    where: { email: session.user.email },
    data: {
      customWorkout: workoutSchedule,
      customDiet: dietSchedule
    }
  })
  
  revalidatePath("/planner")
  return { success: true }
}

// 3. Complete Day (Streak Logic & History Saving)
export async function completeDay() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { error: "Not logged in" }

  const user = await db.user.findUnique({ where: { email: session.user.email } })
  if (!user) return { error: "User not found" }

  const today = normalizeDate(new Date())
  const yesterday = normalizeDate(new Date())
  yesterday.setDate(yesterday.getDate() - 1)

  const lastCheckIn = user.lastCheckIn ? normalizeDate(user.lastCheckIn) : null

  // A. Check if already done today
  if (lastCheckIn && lastCheckIn.getTime() === today.getTime()) {
    return { error: "You already completed your goals today!" }
  }

  // B. Calculate Streak based on REAL db value, not display value
  let newCurrentStreak = 1 

  if (lastCheckIn && lastCheckIn.getTime() === yesterday.getTime()) {
     // If last check-in was exactly yesterday, increment.
     newCurrentStreak = (user.currentStreak || 0) + 1
  }
  // Otherwise (if lastCheckIn was older than yesterday), newCurrentStreak remains 1 (Reset happened).

  // C. Calculate Max Streak
  const currentMax = user.maxStreak || 0
  const newMaxStreak = Math.max(currentMax, newCurrentStreak)
  const now = new Date()

  await db.user.update({
    where: { email: session.user.email },
    data: {
      currentStreak: newCurrentStreak,
      maxStreak: newMaxStreak,
      lastCheckIn: now,
      // 👇 PUSH current date into history array
      checkInHistory: {
        push: now
      }
    }
  })

  revalidatePath("/planner")
  return { success: true, newStreak: newCurrentStreak, maxStreak: newMaxStreak }
}