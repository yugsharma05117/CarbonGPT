require("dotenv").config();
const express = require("express");
const cors = require("cors");

// 🔹 Utils
const { countTokens } = require("./utils/tokenizer");
const { optimizePromptAsync, isPythonOptimizerAvailable, isFastAPIOptimizerAvailable, callPythonAnalyzer } = require("./utils/optimizer");
const { estimateEnergy } = require("./utils/energy");
const { routeModel } = require("./utils/router");

// 🔹 AI Services
const { generateResponse } = require("./services/aiService"); // Groq
const { callOpenRouter } = require("./services/openRouterService"); // OpenRouter

const app = express();

// 🔹 Middleware
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://carbon-gpt.vercel.app",
    ];
    // Allow requests with no origin (e.g. curl, Postman) or matching origins
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// 🔹 Test route
app.get("/", (req, res) => {
  res.send("CarbonGPT backend is running 🚀");
});

// 🔹 Optimizer status endpoint
app.get("/optimizer-status", async (req, res) => {
  res.json({
    optimizer: "js-advanced",
    status: "online",
    message: "✅ Using advanced JS optimizer (full 600+ pattern engine — no Python needed)"
  });
});

// 🔹 Main API route  
app.post("/prompt", async (req, res) => {

  try {
    const { prompt } = req.body;

    // ✅ Validate input
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // ✅ Token count (before)
    const tokensBefore = countTokens(prompt);

    // ✅ Optimize prompt using Python microservice (with JS fallback)
    const optimizationResult = await optimizePromptAsync(prompt);
    const optimizedPrompt = optimizationResult.optimized;
    const optimizerSource = optimizationResult.source;
    const optimizerStats = optimizationResult.stats;
    
    const tokensAfter = countTokens(optimizedPrompt);

    // ✅ Decide model
    const modelType = routeModel(tokensAfter); // "SLM" or "LLM"

    // ✅ Final prompt
    const finalPrompt = optimizedPrompt + " Give a concise answer in maximum 50 words. Do not exceed the limit.";

    // ✅ Call correct model
    let modelResponse = { text: "No response", outputTokens: 0 };
    let modelUsed = "";

    if (modelType === "SLM") {
      modelResponse = await generateResponse(finalPrompt);
      modelUsed = "Groq (SLM)";
    } else {
      modelResponse = await callOpenRouter(finalPrompt);
      modelUsed = "OpenRouter (LLM)";
    }

    // ✅ Safety fallback
    if (!modelResponse) {
      modelResponse = { text: "AI failed", outputTokens: 0 };
    }

    // ✅ Energy calculation
    const estimatedOutput = modelResponse.outputTokens || 100;

    const energyBefore = estimateEnergy(tokensBefore, estimatedOutput, "LLM");
    const energyAfter = estimateEnergy(tokensAfter, estimatedOutput, modelType);

    const energySaved = energyBefore - energyAfter;

    // ✅ Final response
    return res.json({
      originalPrompt: prompt,
      optimizedPrompt,
      tokensBefore,
      tokensAfter,
      tokensSaved: tokensBefore - tokensAfter,
      outputTokens: modelResponse.outputTokens,
      energyBefore,
      energyAfter,
      energySaved,
      suggestedModel: modelType,
      modelUsed,
      aiResponse: modelResponse.text,
      // 🆕 New fields from Python optimizer
      optimizerSource,
      optimizerStats
    });

  } catch (error) {
    console.error("Server Error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Something went wrong"
    });
  }
});

// 🔹 API Routes
const analyzeRoutes = require('./routes/analyzeRoutes');
app.use('/api/analyze', analyzeRoutes);

// 🔹 Start server
const PORT = 5000;

app.listen(PORT, async () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log("✅ Advanced JS optimizer active (600+ filler patterns — no Python services needed)");
  console.log("");
});
