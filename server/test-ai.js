import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const testGeminiDirect = async () => {
  const key = process.env.GOOGLE_API_KEY;
  console.log("Using Key:", key ? key.substring(0, 10) + "..." : "MISSING");
  
  if (!key) {
    console.log("FAIL: No API Key");
    return;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
    const response = await axios.post(url, {
      contents: [{ parts: [{ text: "Say hello" }] }]
    }, { timeout: 10000 });
    
    console.log("SUCCESS:", JSON.stringify(response.data));
  } catch (err) {
    if (err.response) {
      console.error("FAIL status:", err.response.status, "body:", JSON.stringify(err.response.data));
    } else {
      console.error("FAIL:", err.message);
    }
  }
};

testGeminiDirect();
