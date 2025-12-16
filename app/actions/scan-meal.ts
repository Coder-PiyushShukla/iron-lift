"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import sharp from "sharp"

// ✅ SECURE: We read from the environment variable now.
const apiKey = process.env.GEMINI_API_KEY

export async function analyzeMeal(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { error: "Unauthorized" }

  // 🛑 Safety Check: If the server can't find the key, stop immediately.
  if (!apiKey) {
    console.error("❌ MISSING API KEY: Make sure GEMINI_API_KEY is in your .env file")
    return { error: "Server Error: AI Service Not Configured" }
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const file = formData.get("image") as File
  if (!file) return { error: "No image provided" }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const originalBuffer = Buffer.from(arrayBuffer)

    // Convert to standard JPEG
    const resizedBuffer = await sharp(originalBuffer)
      .resize(1024, 1024, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer()

    const base64Image = resizedBuffer.toString("base64")
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `
      Analyze this food image. Identify the meal name and estimate nutritional content.
      Return ONLY valid JSON. No markdown. No text.
      Format:
      {
        "name": "Food Name",
        "calories": 0,
        "macros": { "protein": 0, "carbs": 0, "fats": 0 },
        "analysis": "Short 1-sentence analysis of how healthy this is."
      }
    `

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg", 
        },
      },
    ])

    const response = await result.response
    const text = response.text()
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim()
    const data = JSON.parse(cleanText)

    const user = await db.user.findUnique({ where: { email: session.user.email } })
    
    if (user) {
      await db.mealLog.create({
        data: {
          userId: user.id,
          name: data.name,
          calories: data.calories,
          protein: data.macros.protein,
          carbs: data.macros.carbs,
          fats: data.macros.fats
        }
      })
    }

    return { success: true, data }

  } catch (error: any) {
    console.error("Meal Scan Error:", error.message)
    return { error: `AI Error: ${error.message}` }
  }
}