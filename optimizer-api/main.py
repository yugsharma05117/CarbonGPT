"""
CarbonGPT Optimizer – FastAPI Microservice
===========================================
FastAPI API that exposes the advanced prompt optimizer.
Runs on port 8000 and can be called by the Node.js backend.

Endpoints:
  POST /optimize       - Optimize a prompt (returns optimized text)
  POST /analyze        - Full analysis with detailed stats
  POST /batch-optimize - Optimize multiple prompts at once
  GET  /health         - Health check
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from optimizer import optimize_prompt, analyze_prompt, batch_optimize
import time

app = FastAPI(
    title="CarbonGPT Optimizer API",
    description="Advanced prompt optimizer microservice for CarbonGPT",
    version="1.0.0"
)

# CORS middleware so the Node.js backend can call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Request/Response Models ────────────────────────────────────────

class PromptRequest(BaseModel):
    prompt: str
    aggressive: Optional[bool] = False
    remove_asides: Optional[bool] = True
    # Legacy field alias
    text: Optional[str] = None


class BatchRequest(BaseModel):
    prompts: List[str]
    aggressive: Optional[bool] = False
    remove_asides: Optional[bool] = True


# ─── Endpoints ──────────────────────────────────────────────────────

@app.get("/")
def home():
    return {"message": "CarbonGPT Optimizer API running ✅"}


@app.get("/health")
def health():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "CarbonGPT FastAPI Optimizer",
        "version": "1.0.0"
    }


@app.post("/optimize")
def optimize(req: PromptRequest):
    """
    Optimize a single prompt.
    Returns the optimized text with word count stats.
    """
    # Support both 'prompt' and legacy 'text' field
    prompt_text = req.prompt or req.text
    if not prompt_text:
        return {"success": False, "error": "Prompt is required"}

    start_time = time.time()

    try:
        optimized = optimize_prompt(
            prompt_text,
            aggressive=req.aggressive,
            remove_asides=req.remove_asides
        )

        original_words = len(prompt_text.split())
        optimized_words = len(optimized.split())
        reduction = ((original_words - optimized_words) / original_words * 100) if original_words > 0 else 0
        processing_time = round((time.time() - start_time) * 1000, 2)

        return {
            "success": True,
            "original": prompt_text,
            "optimized": optimized,
            "original_word_count": original_words,
            "optimized_word_count": optimized_words,
            "reduction_percentage": round(reduction, 2),
            "processing_time_ms": processing_time
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


@app.post("/analyze")
def analyze(req: PromptRequest):
    """
    Full analysis of a prompt with detailed stats.
    Returns vague phrases detected, off-topic asides, and optimization results.
    """
    prompt_text = req.prompt or req.text
    if not prompt_text:
        return {"success": False, "error": "Prompt is required"}

    start_time = time.time()

    try:
        result = analyze_prompt(
            prompt_text,
            remove_asides=req.remove_asides,
            aggressive=req.aggressive
        )
        processing_time = round((time.time() - start_time) * 1000, 2)

        return {
            "success": True,
            "data": result,
            "processing_time_ms": processing_time
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


@app.post("/batch-optimize")
def batch(req: BatchRequest):
    """
    Optimize multiple prompts at once.
    """
    if not req.prompts:
        return {"success": False, "error": "Prompts array is required"}

    start_time = time.time()

    try:
        optimized_list = batch_optimize(
            req.prompts,
            aggressive=req.aggressive,
            remove_asides=req.remove_asides
        )

        results = []
        for orig, opt in zip(req.prompts, optimized_list):
            orig_words = len(orig.split())
            opt_words = len(opt.split())
            reduction = ((orig_words - opt_words) / orig_words * 100) if orig_words > 0 else 0
            results.append({
                "original": orig,
                "optimized": opt,
                "original_word_count": orig_words,
                "optimized_word_count": opt_words,
                "reduction_percentage": round(reduction, 2)
            })

        processing_time = round((time.time() - start_time) * 1000, 2)

        return {
            "success": True,
            "results": results,
            "total_prompts": len(results),
            "processing_time_ms": processing_time
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


if __name__ == "__main__":
    import uvicorn
    print("=" * 50)
    print("[*] CarbonGPT FastAPI Optimizer Microservice")
    print("=" * 50)
    print("Endpoints:")
    print("  POST /optimize        - Optimize a prompt")
    print("  POST /analyze         - Full analysis")
    print("  POST /batch-optimize  - Batch optimization")
    print("  GET  /health          - Health check")
    print("=" * 50)
    uvicorn.run(app, host="0.0.0.0", port=8000)