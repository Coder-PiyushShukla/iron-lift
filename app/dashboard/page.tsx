import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import UserDashboard from "@/components/user-dashboard"

export default async function DashboardPage() {
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
    orderBy: { date: 'desc' }
  })

  return <UserDashboard user={user} exerciseLogs={exerciseLogs} />
}