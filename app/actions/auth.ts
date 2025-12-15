"use server"

import { db } from "..//..//lib/db"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

 
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

    console.log("✅ User Created:", email)
 
    return { success: true }

  } catch (error) {
    console.error("Signup Error:", error)
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

    if (!user) {
      return { error: "Invalid credentials" }
    }

     const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return { error: "Invalid credentials" }
    }

    console.log("✅ Login Successful for:", email)
    return { success: true, userId: user.id }

  } catch (error) {
    return { error: "Something went wrong" }
  }
}