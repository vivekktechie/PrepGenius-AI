import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const listModels = async () => {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    console.log("No API key");
    return;
  }

  const genAI = new GoogleGenerativeAI(key);
  const models = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-pro",
    "gemini-1.5-pro-latest",
    "gemini-pro",
    "gemini-2.5-flash"
  ];
  
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent("Hello");
      console.log(`SUCCESS: Model '${m}' WORKS! Response: ${result.response.text().substring(0, 30)}`);
    } catch (e) {
      console.log(`FAIL: Model '${m}' - ${e.message}`);
    }
  }
};

listModels();
