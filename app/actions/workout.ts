"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface UserData {
  age: string;
  gender: string;
  weight: string;
  height: string;
  level: string;
  days: string;
  diet: string;
}

export async function generateWorkoutAction(formData: UserData) {
  
  // 1. Calculate Goals
  const weightNum = parseFloat(formData.weight);
  const isFatLoss = weightNum > 75;
  const goal = isFatLoss ? "Fat Loss" : "Muscle Build";
  
  // 2. Construct the Real AI Prompt
  const prompt = `
    Act as an elite fitness coach. Create a JSON plan for a user:
    - Gender: ${formData.gender}
    - Weight: ${formData.weight}kg (Goal: ${goal})
    - Diet Preference: ${formData.diet} (Strictly enforce this)
    - Experience: ${formData.level}
    - Schedule: ${formData.days} days per week.

    CRITICAL INSTRUCTIONS:
    1. Return ONLY valid JSON. No markdown.
    2. JSON Structure:
    {
      "schedule": [
        { 
          "day": "Monday", 
          "muscleGroup": "Chest", 
          "exercises": [{ "name": "Bench Press", "sets": 3, "reps": "10", "youtubeSearch": "Bench Press Form" }] 
        }
      ],
      "nutrition": {
        "calories": 2500,
        "macros": { "protein": "150g", "carbs": "300g", "fats": "80g" },
        "meals": [
            { "name": "Lunch", "items": ["Chicken", "Rice"] }
        ],
        "tips": ["Tip 1"]
      }
    }
  `

  try {
    // TRY REAL AI FIRST
    if (process.env.GEMINI_API_KEY) {
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
      const plan = JSON.parse(text);
      console.log("✅ REAL AI Plan Generated");
      return { success: true, plan };
    } 
    
    // IF NO KEY, USE SMART MOCK
    throw new Error("No API Key");

  } catch (error) {
    console.warn("⚠️ API Failed/Missing. Generating SMART Mock Plan based on inputs.");
    // CALL THE SMART FALLBACK FUNCTION
    const smartPlan = generateSmartFallback(formData);
    return { success: true, plan: smartPlan };
  }
}

// ==========================================
// 🧠 THE SMART FALLBACK ENGINE (Logic-Based)
// ==========================================
function generateSmartFallback(data: UserData) {
  const daysCount = parseInt(data.days);
  const isVeg = data.diet.toLowerCase() === "veg";
  const isVegan = data.diet.toLowerCase() === "vegan";
  const isFemale = data.gender.toLowerCase() === "female";
  const weight = parseInt(data.weight);
  
  // 1. DYNAMIC NUTRITION LOGIC
  let proteinSource = "Chicken Breast";
  let carbSource = "Rice";
  
  if (isVeg) {
    proteinSource = "Paneer & Whey";
    carbSource = "Roti & Dal";
  } else if (isVegan) {
    proteinSource = "Tofu & Lentils";
    carbSource = "Quinoa";
  }

  // Calories Logic
  const calories = weight > 75 ? 2200 : 2800; // Cut vs Bulk logic
  const protein = Math.round(weight * (isFemale ? 1.6 : 2.0)); // Women need slightly less protein multiplier usually

  // 2. DYNAMIC WORKOUT LOGIC
  // We define a pool of 6 days, but we only return the number of days the user asked for.
  const fullWeek = [
    {
      day: "Monday",
      muscleGroup: isFemale ? "Glutes & Legs (Focus)" : "Push (Chest/Triceps)",
      exercises: isFemale 
        ? [
            { name: "Hip Thrusts", sets: 3, reps: "10-12", youtubeSearch: "Hip Thrust Form" },
            { name: "Goblet Squats", sets: 3, reps: "12-15", youtubeSearch: "Goblet Squat Form" },
            { name: "Bulgarian Split Squats", sets: 3, reps: "10", youtubeSearch: "Bulgarian Split Squat Form" }
          ]
        : [
            { name: "Bench Press", sets: 3, reps: "8-10", youtubeSearch: "Bench Press Form" },
            { name: "Incline Dumbbell Press", sets: 3, reps: "10-12", youtubeSearch: "Incline Dumbbell Press Form" },
            { name: "Tricep Pushdowns", sets: 3, reps: "12-15", youtubeSearch: "Tricep Pushdown Form" }
          ]
    },
    {
      day: "Tuesday",
      muscleGroup: "Pull (Back/Biceps)",
      exercises: [
        { name: "Lat Pulldown", sets: 3, reps: "10-12", youtubeSearch: "Lat Pulldown Form" },
        { name: "Seated Row", sets: 3, reps: "10-12", youtubeSearch: "Seated Row Form" },
        { name: "Face Pulls", sets: 3, reps: "15", youtubeSearch: "Face Pull Form" }
      ]
    },
    {
      day: "Wednesday",
      muscleGroup: isFemale ? "Upper Body Tone & Core" : "Legs (Quads/Hamstrings)",
      exercises: [
        { name: "Squats", sets: 3, reps: "8-10", youtubeSearch: "Squat Form" },
        { name: "Leg Press", sets: 3, reps: "12", youtubeSearch: "Leg Press Form" },
        { name: "Plank", sets: 3, reps: "60s", youtubeSearch: "Plank Form" }
      ]
    },
    {
      day: "Thursday",
      muscleGroup: "Cardio & Abs",
      exercises: [
         { name: "HIIT Treadmill", sets: 1, reps: "20 mins", youtubeSearch: "HIIT Cardio" },
         { name: "Hanging Leg Raises", sets: 3, reps: "15", youtubeSearch: "Hanging Leg Raise Form" }
      ]
    },
    {
      day: "Friday",
      muscleGroup: "Full Body Intensity",
      exercises: [
        { name: "Deadlifts", sets: 3, reps: "5-8", youtubeSearch: "Deadlift Form" },
        { name: "Shoulder Press", sets: 3, reps: "10", youtubeSearch: "Overhead Press Form" }
      ]
    },
    {
      day: "Saturday",
      muscleGroup: "Active Recovery / Yoga",
      exercises: [
        { name: "Full Body Stretch", sets: 1, reps: "30 mins", youtubeSearch: "Full Body Yoga" }
      ]
    }
  ];

  // CUT THE ARRAY based on user selection (3, 4, 5, or 6 days)
  const userSchedule = fullWeek.slice(0, daysCount);

  return {
    schedule: userSchedule,
    nutrition: {
      calories: calories,
      macros: { 
        protein: `${protein}g`, 
        carbs: weight > 75 ? "150g" : "300g", // Less carbs if heavy (Fat loss)
        fats: "60g" 
      },
      meals: [
        { name: "Breakfast", items: ["Oats", "1 Fruit", isVeg ? "Milk" : "Eggs"] },
        { name: "Lunch", items: [carbSource, proteinSource, "Green Salad"] },
        { name: "Dinner", items: ["Soup", "Salad", isVeg ? "Paneer" : "Grilled Fish"] }
      ],
      tips: [
        `Drink 3-4L water for ${weight > 75 ? "fat loss" : "muscle gain"}`,
        `Focus on progressive overload as a ${data.level}`
      ]
    }
  };
}