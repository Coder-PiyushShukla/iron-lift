"use server"

import { db } from "@/lib/db"

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get("email") as string

   
  await new Promise((resolve) => setTimeout(resolve, 1500))

  
  const user = await db.user.findUnique({
    where: { email }
  })

  if (!user) {
     
    return { success: true }
  }

   
  console.log(`✅ Mock Email Sent to: ${email}`)
  
  return { success: true }
}