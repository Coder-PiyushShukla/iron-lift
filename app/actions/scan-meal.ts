"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import sharp from "sharp"

const apiKey = process.env.GEMINI_API_KEY

export async function analyzeMeal(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { error: "Unauthorized" }

  if (!apiKey) return { error: "API Key Missing" }

  const genAI = new GoogleGenerativeAI(apiKey)
  const file = formData.get("image") as File
  if (!file) return { error: "No image provided" }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const originalBuffer = Buffer.from(arrayBuffer)
    
    const resizedBuffer = await sharp(originalBuffer)
      .resize(1024, 1024, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer()
      
    const base64Image = resizedBuffer.toString("base64")
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const prompt = `Analyze this food image. Return JSON: { "name": "Food Name", "calories": 0, "macros": { "protein": 0, "carbs": 0, "fats": 0 }, "analysis": "1 sentence." }`

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
    ])

    const response = await result.response
    let text = response.text()
    
    text = text.replace(/```json/g, "").replace(/```/g, "").trim()
    
    let data;
    try {
        data = JSON.parse(text)
    } catch (parseError) {
        return { error: "AI response was not valid JSON. Try again." }
    }

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
    return { error: `AI Error: ${error.message}` }
  }
}