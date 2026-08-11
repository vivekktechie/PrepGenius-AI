import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const testKey = async () => {
  const key = process.env.GOOGLE_API_KEY;
  console.log("Testing Key:", key ? key.substring(0, 10) + "..." : "MISSING");
  
  if (!key) return;

  try {
    const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    console.log("SUCCESS! Models available:");
    console.log(response.data.models.map(m => m.name));
  } catch (err) {
    if (err.response) {
      console.log(`ERROR ${err.response.status}:`, JSON.stringify(err.response.data));
    } else {
      console.log("ERROR:", err.message);
    }
  }
};

testKey();
