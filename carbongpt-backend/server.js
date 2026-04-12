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
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));

// 🔹 Test route
app.get("/", (req, res) => {
  res.send("CarbonGPT backend is running 🚀");
});

// 🔹 Optimizer status endpoint
app.get("/optimizer-status", async (req, res) => {
  const flaskAvailable = await isPythonOptimizerAvailable();
  const fastapiAvailable = await isFastAPIOptimizerAvailable();

  res.json({
    flaskOptimizer: flaskAvailable ? "online" : "offline",
    fastapiOptimizer: fastapiAvailable ? "online" : "offline",
    fallback: "js-basic",
    message: flaskAvailable
      ? "🐍 Flask optimizer is active (port 5001)"
      : fastapiAvailable
        ? "⚡ FastAPI optimizer is active (port 8000)"
        : "⚠️ Using basic JS optimizer (start a Python service for advanced features)"
  });
});

// 🔹 Main API route  
app.post("/prompt", async (req, res) => {
  console.log("API HIT");

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
    
    console.log(`📊 Optimizer: ${optimizerSource} | ${tokensBefore} → ${tokensAfter} tokens (${optimizerStats?.reductionPercent || 0}% word reduction)`);

    // ✅ Decide model
    const modelType = routeModel(tokensAfter); // "SLM" or "LLM"

    // ✅ Final prompt
    const finalPrompt = optimizedPrompt + " Give a concise answer in maximum 50 words. Do not exceed the limit.";

    // ✅ Call correct model
    let modelResponse = { text: "No response", outputTokens: 0 };
    let modelUsed = "";

    if (modelType === "SLM") {
      console.log("Using SLM (Groq)");
      modelResponse = await generateResponse(finalPrompt);
      modelUsed = "Groq (SLM)";
    } else {
      console.log("Using LLM (OpenRouter)");
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
  
  // Check if Flask optimizer is available on startup
  const flaskAvailable = await isPythonOptimizerAvailable();
  if (flaskAvailable) {
    console.log("🐍 Flask optimizer microservice: ✅ ONLINE (port 5001)");
  } else {
    console.log("⚠️  Flask optimizer microservice: ❌ OFFLINE");
  }

  // Check if FastAPI optimizer is available on startup
  const fastapiAvailable = await isFastAPIOptimizerAvailable();
  if (fastapiAvailable) {
    console.log("⚡ FastAPI optimizer microservice: ✅ ONLINE (port 8000)");
  } else {
    console.log("⚠️  FastAPI optimizer microservice: ❌ OFFLINE");
  }

  if (!flaskAvailable && !fastapiAvailable) {
    console.log("   → Using basic JS fallback optimizer");
    console.log("   → To enable advanced optimization, run one of:");
    console.log("     Flask:   cd python-optimizer && pip install -r requirements.txt && python app.py");
    console.log("     FastAPI: cd ../optimizer-api && pip install -r requirements.txt && uvicorn main:app --port 8000");
  }
  console.log("");
});
