"use server"

import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { Resend } from "resend"


const resend = new Resend(process.env.RESEND_API_KEY)

export async function signupUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password || !name) {
    return { error: "All fields are required" }
  }

  try {
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { error: "User already exists with this email" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    return { success: true }

  } catch (error) {
    console.error(error)
    return { error: "Something went wrong" }
  }
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Please provide email and password" }
  }

  try {
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user || !user.password) {
      return { error: "Invalid credentials" }
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return { error: "Invalid credentials" }
    }

    return { success: true, userId: user.id }

  } catch (error) {
    return { error: "Something went wrong" }
  }
}

export async function updatePassword(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirm = formData.get("confirm") as string

  if (!email || !password || !confirm) {
    return { error: "Missing fields" }
  }

  if (password !== confirm) {
    return { error: "Passwords do not match" }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    await db.user.update({
      where: { email },
      data: { password: hashedPassword }
    })

    return { success: true }
  } catch (error) {
    return { error: "Failed to update password" }
  }
}


export async function sendPasswordResetEmail(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) return { error: "Email is required" }

  const user = await db.user.findUnique({ where: { email } })
  if (!user) return { error: "User not found" }

   
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
  const resetLink = `${baseUrl}/reset-password?email=${email}`

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev", // Keep this for Free Mode
      to: email,
      subject: "Reset your IronLift Password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    })
    return { success: true }
  } catch (e) {
    console.error(e)
    return { error: "Failed to send email" }
  }
}