import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY || "";
const ai = geminiApiKey
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Fallback high-res studio images in case API is unavailable or quota is exceeded
const FALLBACK_STUDIO_IMAGES: Record<string, string> = {
  rose: "./assets/images/bouquet_romantic_roses_1790272159677.jpg",
  peony: "./assets/images/bouquet_luxury_peonies_1790272191599.jpg",
  lily: "./assets/images/bouquet_modern_lilies_1790272204642.jpg",
  hydrangea: "./assets/images/bouquet_newborn_baby.jpg",
  ranunculus: "./assets/images/bouquet_festival_special.jpg",
  eucalyptus: "./assets/images/bouquet_seasonal_wildflowers_1790272175129.jpg",
  default: "./assets/images/bouquet_surprise_gift.jpg",
};

/**
 * Endpoint to generate a photorealistic preview of a custom flower arrangement
 */
app.post("/api/generate-bouquet-preview", async (req, res) => {
  try {
    const { stemsSummary, flowersList, wrap, ribbon, style, totalStems } = req.body;

    const wrapName = wrap?.name || "Rustic Kraft Paper";
    const ribbonName = ribbon?.name || "Champagne Satin";
    const styleName = style || "Classic Dome";
    const flowerDetails = stemsSummary || "Artisanal hand-tied seasonal flowers";

    // Detailed prompt crafted for botanical realism
    const prompt = `A breathtaking photorealistic professional florist studio photograph of a bespoke luxury hand-tied flower bouquet.
Composition: ${flowerDetails}, total ${totalStems || "multiple"} fresh natural stems.
Arrangement silhouette style: ${styleName}.
Wrapping: Artfully wrapped in premium ${wrapName} with crisp tailored folds.
Ribbon: Fastened with a luxurious trailing ${ribbonName} ribbon and delicate bow.
Lighting & Setting: Soft diffused morning atelier sunlight, warm Parisian florist workshop background, shallow depth of field, 8k resolution, crisp floral textures, dewdrops on petals, vibrant natural botanical colors, hyper-realistic, no artificial plastic look.`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: "3:4",
            },
          },
        });

        const candidates = response.candidates;
        if (candidates && candidates.length > 0 && candidates[0].content?.parts) {
          for (const part of candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              const mime = part.inlineData.mimeType || "image/png";
              const imageUrl = `data:${mime};base64,${part.inlineData.data}`;
              return res.json({
                success: true,
                imageUrl,
                isAiGenerated: true,
                prompt,
              });
            }
          }
        }
      } catch (geminiError: any) {
        console.warn("Gemini image generation warning, falling back to curated atelier render:", geminiError?.message || geminiError);
      }
    }

    // Determine the most prominent flower in the user's recipe
    let dominantFlowerId = "default";
    if (Array.isArray(flowersList) && flowersList.length > 0) {
      const sorted = [...flowersList].sort((a, b) => (b.count || 0) - (a.count || 0));
      const topName = sorted[0]?.name?.toLowerCase() || "";
      if (topName.includes("rose")) dominantFlowerId = "rose";
      else if (topName.includes("peony")) dominantFlowerId = "peony";
      else if (topName.includes("lily")) dominantFlowerId = "lily";
      else if (topName.includes("hydrangea")) dominantFlowerId = "hydrangea";
      else if (topName.includes("ranunculus")) dominantFlowerId = "ranunculus";
      else if (topName.includes("eucalyptus")) dominantFlowerId = "eucalyptus";
    }

    const fallbackImage = FALLBACK_STUDIO_IMAGES[dominantFlowerId] || FALLBACK_STUDIO_IMAGES.default;

    return res.json({
      success: true,
      imageUrl: fallbackImage,
      isAiGenerated: false,
      message: "Studio atelier realistic composition ready",
    });
  } catch (error: any) {
    console.error("Error in generate-bouquet-preview endpoint:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to generate bouquet preview",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Boutique server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
