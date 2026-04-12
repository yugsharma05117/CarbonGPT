"""
CarbonGPT Python Optimizer Microservice
========================================
Flask API that exposes the advanced prompt optimizer.
Runs on port 5001 and is called by the Node.js backend.

Endpoints:
  POST /optimize       - Optimize a prompt (returns optimized text)
  POST /analyze        - Full analysis with stats
  POST /batch-optimize - Optimize multiple prompts at once
  GET  /health         - Health check
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from optimizer import optimize_prompt, analyze_prompt, batch_optimize
import time

app = Flask(__name__)
CORS(app)


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "ok",
        "service": "CarbonGPT Python Optimizer",
        "version": "1.0.0"
    })


@app.route("/optimize", methods=["POST"])
def optimize():
    """
    Optimize a single prompt.
    
    Request body:
        {
            "prompt": "your prompt here",
            "aggressive": false,       (optional, default false)
            "remove_asides": true       (optional, default true)
        }
    
    Response:
        {
            "success": true,
            "original": "...",
            "optimized": "...",
            "original_word_count": 25,
            "optimized_word_count": 12,
            "reduction_percentage": 52.0,
            "processing_time_ms": 3.2
        }
    """
    data = request.get_json()
    
    if not data or not data.get("prompt"):
        return jsonify({"success": False, "error": "Prompt is required"}), 400
    
    prompt = data["prompt"]
    aggressive = data.get("aggressive", False)
    remove_asides = data.get("remove_asides", True)
    
    start_time = time.time()
    
    try:
        optimized = optimize_prompt(prompt, aggressive=aggressive, remove_asides=remove_asides)
        
        original_words = len(prompt.split())
        optimized_words = len(optimized.split())
        reduction = ((original_words - optimized_words) / original_words * 100) if original_words > 0 else 0
        
        processing_time = round((time.time() - start_time) * 1000, 2)
        
        return jsonify({
            "success": True,
            "original": prompt,
            "optimized": optimized,
            "original_word_count": original_words,
            "optimized_word_count": optimized_words,
            "reduction_percentage": round(reduction, 2),
            "processing_time_ms": processing_time
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Full analysis of a prompt with detailed stats.
    
    Request body:
        {
            "prompt": "your prompt here",
            "aggressive": false,       (optional)
            "remove_asides": true       (optional)
        }
    
    Response:
        {
            "success": true,
            "data": {
                "original_word_count": 25,
                "optimized_word_count": 12,
                "reduction_percentage": 52.0,
                "original": "...",
                "optimized": "...",
                "unknown_vague_phrases_detected": [...],
                "off_topic_asides": [...]
            },
            "processing_time_ms": 4.1
        }
    """
    data = request.get_json()
    
    if not data or not data.get("prompt"):
        return jsonify({"success": False, "error": "Prompt is required"}), 400
    
    prompt = data["prompt"]
    aggressive = data.get("aggressive", False)
    remove_asides = data.get("remove_asides", True)
    
    start_time = time.time()
    
    try:
        result = analyze_prompt(prompt, remove_asides=remove_asides, aggressive=aggressive)
        processing_time = round((time.time() - start_time) * 1000, 2)
        
        return jsonify({
            "success": True,
            "data": result,
            "processing_time_ms": processing_time
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/batch-optimize", methods=["POST"])
def batch():
    """
    Optimize multiple prompts at once.
    
    Request body:
        {
            "prompts": ["prompt1", "prompt2", ...],
            "aggressive": false,
            "remove_asides": true
        }
    
    Response:
        {
            "success": true,
            "results": [
                { "original": "...", "optimized": "...", "reduction_percentage": 40.0 },
                ...
            ],
            "processing_time_ms": 12.5
        }
    """
    data = request.get_json()
    
    if not data or not data.get("prompts"):
        return jsonify({"success": False, "error": "Prompts array is required"}), 400
    
    prompts = data["prompts"]
    aggressive = data.get("aggressive", False)
    remove_asides = data.get("remove_asides", True)
    
    if not isinstance(prompts, list):
        return jsonify({"success": False, "error": "Prompts must be an array"}), 400
    
    start_time = time.time()
    
    try:
        optimized_list = batch_optimize(prompts, aggressive=aggressive, remove_asides=remove_asides)
        
        results = []
        for orig, opt in zip(prompts, optimized_list):
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
        
        return jsonify({
            "success": True,
            "results": results,
            "total_prompts": len(results),
            "processing_time_ms": processing_time
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    print("=" * 50)
    print("[*] CarbonGPT Python Optimizer Microservice")
    print("=" * 50)
    print("Endpoints:")
    print("  POST /optimize        - Optimize a prompt")
    print("  POST /analyze         - Full analysis")
    print("  POST /batch-optimize  - Batch optimization")
    print("  GET  /health          - Health check")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5001, debug=False)
