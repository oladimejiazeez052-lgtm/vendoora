import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client to avoid startup crashes if key is initially absent
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please configure it in the Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API Endpoints

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
});

// 2. AI Listing Architect Suggestions
app.post("/api/architect/suggest", async (req: express.Request, res: express.Response) => {
  try {
    const { title, description, category, condition, originalPrice } = req.body;

    const ai = getGeminiClient();

    const prompt = `
      Please analyze this product listing and generate optimized, professional details for our peer-to-peer marketplace "Vendoora".
      
      Raw details provided:
      - Raw Title: ${title || "N/A"}
      - Raw Description: ${description || "N/A"}
      - User Suggested Category: ${category || "General"}
      - Item Condition: ${condition || "Good"}
      - User Suggested Price: ${originalPrice ? `${originalPrice}` : "Not specified"}
      
      Tasks:
      1. Generate a high-performing, search-optimized, and catchy listing title that accurately represents the item.
      2. Write a highly engaging, professional, structured product description (including lists, highlights, key bullet features, and specifications) that addresses buyer confidence.
      3. Recommend a data-driven listing price in USD, taking active marketplace trends and condition into account. Compare with original price if specified.
      4. Provide 4 to 6 relevant marketing tags/keywords to increase visibility.
      5. Suggest the single best categorical fitting for this item.
      6. Provide a text-based "Trust & Fraud Risk Analysis" rating (Low, Medium, or High) along with a quick reason verifying if the listing looks authentic or suspicious.
      7. Assess the item description and check if it violates generic listing guidelines (weapons, drugs, adult items, fake accounts, toxic content) providing a helpful and discrete moderation analysis text.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "title",
            "description",
            "suggestedPrice",
            "priceReasoning",
            "tags",
            "category",
            "trustRiskRating",
            "trustAnalytics",
            "moderationApproved",
            "moderationReasoning"
          ],
          properties: {
            title: {
              type: Type.STRING,
              description: "Optimized, keyword-rich listing title",
            },
            description: {
              type: Type.STRING,
              description: "Engaging and comprehensive markdown-formatted listing description. Use bullets.",
            },
            suggestedPrice: {
              type: Type.INTEGER,
              description: "Suggested selling price in USD",
            },
            priceReasoning: {
              type: Type.STRING,
              description: "Reasoning and strategy for the recommended price.",
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 4 to 6 tags or keywords to index the product.",
            },
            category: {
              type: Type.STRING,
              description: "Best categorized list name",
            },
            trustRiskRating: {
              type: Type.STRING,
              description: "Trust risk level: 'Low', 'Medium', or 'High'",
            },
            trustAnalytics: {
              type: Type.STRING,
              description: "Analytical explanation of authenticity guidelines checked (images, terms used).",
            },
            moderationApproved: {
              type: Type.BOOLEAN,
              description: "True if complies with professional trade guidelines; false otherwise.",
            },
            moderationReasoning: {
              type: Type.STRING,
              description: "Helpful reason for approval or rejection detailing standard checks.",
            }
          },
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response received from Gemini API");
    }

    const dataResult = JSON.parse(resultText);
    res.json(dataResult);
  } catch (error: any) {
    console.error("AI Architect error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate AI listing specifications",
      hasApiKey: !!process.env.GEMINI_API_KEY,
    });
  }
});

// 3. AI Negotiation & Automated Smart Chat Companion
app.post("/api/negotiate", async (req: express.Request, res: express.Response) => {
  try {
    const {
      buyerOffer,
      sellerMinPrice,
      currentPrice,
      itemTitle,
      conversationRole, // 'advisor' (tells the seller what to do) or 'buyer_bot' / 'seller_bot' (roleplays the other person)
      chatHistory,
    } = req.body;

    const ai = getGeminiClient();

    const formattedHistory = (chatHistory || [])
      .map((m: any) => `${m.sender === "buyer" ? "Buyer" : m.sender === "seller" ? "Seller" : "Advisor"}: ${m.text}`)
      .join("\n");

    const prompt = `
      You are the backend negotiation agent for Vendoora, a smart peer-to-peer trading marketplace.
      We are facilitating a healthy negotiation for the item: "${itemTitle || "Universal Item"}".
      - Listed Value (Asking Price): $${currentPrice || "N/A"}
      - Seller's Confidential Minimum Accepted Price: $${sellerMinPrice || "N/A"}
      - Last Proposed Price/Offer: $${buyerOffer || "N/A"}
      
      Negotiation Task Role Requested: "${conversationRole || "advisor"}"
      - If Role is "advisor": You must analyze the negotiations from the seller's perspective. Give them strategic advice on whether to ACCEPT, COUNTER, or DECLINE, and draft the perfect message.
      - If Role is "buyer_bot": You are acting as the prospective buyer. Check if the price fits your desires and write back to the seller, proposing logical counters.
      - If Role is "seller_bot": You are acting as the seller. Try to maximize value but be warm and willing to counter.

      History of this chat negotiation so far:
      ${formattedHistory || "No messages yet."}

      Evaluate current price point strategies, generate appropriate thresholds, and keep it safe, professional, realistic, and productive.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "evaluation",
            "suggestedCounterPrice",
            "strategicAdvice",
            "replyMessage",
            "trustScoreDiff"
          ],
          properties: {
            evaluation: {
              type: Type.STRING,
              description: "The strategic action: either 'accept', 'counter', or 'decline'",
            },
            suggestedCounterPrice: {
              type: Type.NUMBER,
              description: "Fair counter-proposal price in USD (null if accepted or declined)",
            },
            strategicAdvice: {
              type: Type.STRING,
              description: "Strategic advice for negotiation (tactics, price limits, urgency factors)",
            },
            replyMessage: {
              type: Type.STRING,
              description: "The highly realistic chat response matching the specified 'conversationRole' to keep the interaction human, polite, yet transactional.",
            },
            trustScoreDiff: {
              type: Type.NUMBER,
              description: "A calculated mock trust score modifier based on the politeness/aggressiveness of the offer (-5 to +5).",
            },
          },
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response received from Gemini API in negotiation endpoint");
    }

    const dataResult = JSON.parse(resultText);
    res.json(dataResult);
  } catch (error: any) {
    console.error("AI Negotiation error:", error);
    res.status(500).json({
      error: error.message || "Failed to facilitate negotiation analytics",
      hasApiKey: !!process.env.GEMINI_API_KEY,
    });
  }
});

// Configure Vite or Static Files
async function startApp() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vendoora server running on http://localhost:${PORT}`);
  });
}

startApp().catch((err) => {
  console.error("Failed to start Vendoora full-stack system:", err);
});
