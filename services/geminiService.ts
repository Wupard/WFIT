import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
// Initialize with API Key directly
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const generateDietPlan = async (
  age: number,
  gender: string,
  weight: number,
  height: number,
  goal: string,
  activityLevel: string
): Promise<string> => {
  if (!genAI) return "AI service is not configured. Please set up an API key.";
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Act as a professional nutritionist and personal trainer. Create a daily diet plan summary for a user with the following stats:
      - Age: ${age}
      - Gender: ${gender}
      - Weight: ${weight}kg
      - Height: ${height}cm
      - Goal: ${goal}
      - Activity Level: ${activityLevel}

      Provide a calculated TDEE (Total Daily Energy Expenditure) estimation first.
      Then, provide a sample meal plan (Breakfast, Lunch, Dinner, Snacks) with approximate macro splits (Protein, Carbs, Fats).
      Start directly with the plan details. Do not include any introductory or concluding text.
      Format the output in clean Markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text || "Failed to generate diet plan.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't generate a plan right now. Please check your connection or API key.";
  }
};

export const analyzePosture = async (base64Image: string): Promise<string> => {
  if (!genAI) return "AI service is not configured. Please set up an API key.";
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Remove data:image/jpeg;base64, prefix if present for the API part
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: "image/jpeg",
      },
    };

    const prompt = `Analyze this image for posture assessment. 
    1. Identify any visible posture misalignments (e.g., forward head, rounded shoulders, pelvic tilt).
    2. Suggest 3 specific corrective exercises or stretches.
    3. Keep the advice professional, safe, and concise. 
    If the image is not a person or unclear, politely ask for a better photo.
    Format in Markdown.`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text() || "Could not analyze image.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "Error analyzing posture. Please try again.";
  }
};

export const chatWithAI = async (message: string, context?: string): Promise<string> => {
  if (!genAI) return "AI service is not configured. Please set up an API key.";
  try {
    const systemInstruction = "You are WFIT Smart Assistant, a highly knowledgeable and encouraging fitness coach. Detect the language of the user's message. If it is Turkish, reply in Turkish. If English, reply in English. Keep answers concise, practical, and motivating. If the user asks about medical advice, strictly advise them to see a doctor.";

    // System instructions are supported in newer models/SDK versions via systemInstruction config
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction
    });

    const prompt = context
      ? `Context: ${context}\n\nUser Question: ${message}`
      : message;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "I'm having trouble thinking right now.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Connection error. Please try again.";
  }
};

export const analyzeFoodImage = async (base64Image: string): Promise<{ name: string, calories: number, protein: number, carbs: number, fat: number } | null> => {
  if (!genAI) return null;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const imagePart = {
      inlineData: {
        data: cleanBase64,
        mimeType: "image/jpeg",
      },
    };

    const prompt = `Analyze this food image. Estimate the calories and macronutrients (Protein, Carbs, Fat) for the entire portion shown.
    Return ONLY a valid JSON object with no markdown formatting or additional text.
    Format: { "name": "Food Name", "calories": number, "protein": number, "carbs": number, "fat": number }`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text() || "{}";

    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Food Analysis Error:", error);
    return null;
  }
};
