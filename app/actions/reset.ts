"use server"

import { db } from "@/lib/db"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get("email") as string

  
  const user = await db.user.findUnique({
    where: { email }
  })

   
  if (!user) {
    return { success: true }
  }

   
  const resetLink = `${process.env.NEXTAUTH_URL}/auth/new-password?email=${email}`

  try {
     
    await resend.emails.send({
      from: "onboarding@resend.dev",  
      to: email,                      
      subject: "Reset your IronLift Password",
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h1>🔒 Password Reset</h1>
          <p>Someone (hopefully you) requested a password reset for your IronLift account.</p>
          <p>Click the button below to reset it:</p>
          <a href="${resetLink}" style="background-color: #DC2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Reset Password
          </a>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">If you didn't request this, just ignore this email.</p>
        </div>
      `
    })

    console.log(`✅ Email sent to ${email}`)
    return { success: true }

  } catch (error) {
    console.error("❌ Email failed:", error)
    return { error: "Failed to send email. Try again later." }
  }
}
