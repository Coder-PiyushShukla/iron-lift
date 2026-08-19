import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import ProgressClient from "./progress-client"

export default async function ProgressPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        redirect("/")
    }

    const user = await db.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) {
        redirect("/")
    }

    // If user has no plan, send them to generate one
    if (!user?.workoutPlan) {
        redirect("/generate")
    }

    const exerciseLogs = await db.exerciseLog.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
    })

    return (
        <ProgressClient
            user={user}
            exerciseLogs={exerciseLogs}
        />
    )
}
