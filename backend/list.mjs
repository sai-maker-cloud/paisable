import 'dotenv/config'; // If you're using a .env file
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "YOUR_ACTUAL_API_KEY_HERE"; // Replace or use .env

if (!API_KEY || API_KEY === "YOUR_ACTUAL_API_KEY_HERE") {
  console.error("API key is missing or placeholder.");
  process.exit(1);
}

try {
  console.log("Initializing GoogleGenerativeAI...");
  const genAI = new GoogleGenerativeAI(API_KEY);
  console.log("GoogleGenerativeAI instance created. Type:", typeof genAI);
  console.log("Attempting to access listModels()...");

  // Check if listModels exists before calling
  if (typeof genAI.listModels === 'function') {
    console.log("listModels is a function! Calling it...");
    const { models } = await genAI.listModels();
    console.log("Successfully retrieved models!");
    console.log("First 3 models (if any):");
    models.slice(0, 3).forEach(m => console.log(`- ${m.name}`));
  } else {
    console.error("ERROR: genAI.listModels is NOT a function, it is:", typeof genAI.listModels, genAI.listModels);
    // Log the entire genAI object for inspection
    console.error("Full genAI object:", genAI);
  }

} catch (error) {
  console.error("An error occurred during direct test:", error);
}