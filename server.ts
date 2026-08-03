import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiInstance: GoogleGenAI | null = null;
function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Tutor endpoint
  app.post("/api/ai/tutor", async (req, res) => {
    try {
      const { prompt, context } = req.body;
      if (!prompt) {
        res.status(400).json({ error: "Prompt is required" });
        return;
      }

      const ai = getAI();
      const systemInstruction = `You are Professor Modulo, an expert, enthusiastic cryptography tutor specializing in Classical Cryptography, Modular Arithmetic, and the Affine Cipher.
Your goal is to guide students step-by-step through understanding encryption, modular inverses, Euclidean algorithm, frequency analysis, and cryptanalysis.
Provide clear, mathematically sound, engaging, and easy-to-read markdown responses with bullet points, math equations, and step-by-step breakdowns.
Context provided: ${JSON.stringify(context || {})}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text || "No response generated." });
    } catch (error: any) {
      console.error("AI Tutor API Error:", error);
      res.status(500).json({
        error: error.message || "Failed to contact Gemini AI Cryptography Tutor",
      });
    }
  });

  // Vite middleware for development vs production static serve
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
