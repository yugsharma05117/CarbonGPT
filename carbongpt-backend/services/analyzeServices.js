const { encode } = require("gpt-tokenizer");

const { optimizePromptAsync, callPythonAnalyzer, optimizePrompt } = require('../utils/optimizer');

/**
 * Analyze a prompt (async version - uses Python optimizer when available).
 * Falls back to JS optimizer if Python service is offline.
 */
async function analyzePromptAsync(prompt) {
    const tokens = encode(prompt).length;

    const energy = +(tokens * 0.0003).toFixed(6);
    const carbon = +(energy * 0.4).toFixed(6);

    // Try Python analyzer first for detailed analysis
    const pyAnalysis = await callPythonAnalyzer(prompt);

    let optimizedPrompt;
    let optimizerSource;
    let vaguePhrasesDetected = [];
    let offTopicAsides = [];

    if (pyAnalysis) {
        // Use Python analysis results
        optimizedPrompt = pyAnalysis.optimized;
        optimizerSource = "python";
        vaguePhrasesDetected = pyAnalysis.unknown_vague_phrases_detected || [];
        offTopicAsides = pyAnalysis.off_topic_asides || [];
    } else {
        // Fallback to JS optimizer
        optimizedPrompt = optimizePrompt(prompt);
        optimizerSource = "js-fallback";
    }

    let model = "";
    if (tokens <= 30) {
        model = "SLM";
    } else if (tokens <= 100) {
        model = "Medium Model";
    } else {
        model = "LLM";
    }

    const optimizedTokens = optimizedPrompt.trim().split(/\s+/).length;
    const optimizedEnergy = +((optimizedTokens) * 0.0003).toFixed(6);

    return {
        prompt: prompt,
        optimizedPrompt: optimizedPrompt,
        original: {
            tokens: tokens,
            energy: energy,
            carbon: carbon
        },
        optimized: {
            tokens: optimizedTokens,
            energy: optimizedEnergy,
        },
        savings: {
            tokensSaved: tokens - optimizedTokens,
            energySaved: +(energy - optimizedEnergy).toFixed(6),
            reductionPercent: +(((tokens - optimizedTokens) / tokens) * 100).toFixed(2)
        },
        model: {
            original: model,
        },
        // 🆕 Advanced optimization info
        optimizerSource,
        vaguePhrasesDetected,
        offTopicAsides,
    };
}

/**
 * Synchronous analyze (uses JS fallback only - for backward compatibility).
 */
function analyzePrompt(prompt) {
    const tokens = encode(prompt).length;

    const energy = +(tokens * 0.0003).toFixed(6);
    const carbon = +(energy * 0.4).toFixed(6);

    const optimizedPrompt = optimizePrompt(prompt);
    let model = "";
    if (tokens <= 30) {
        model = "SLM";
    }
    else if (tokens <= 100) {
        model = "Medium Model";
    }
    else {
        model = "LLM";
    }

    return {
        prompt: prompt,
        optimizedPrompt: optimizedPrompt,
        original: {
            tokens: tokens,
            energy: energy,
            carbon: carbon

        },
        optimized: {
            tokens: optimizedPrompt.trim().split(/\s+/).length,
            energy: +((optimizedPrompt.trim().split(/\s+/).length) * 0.0003).toFixed(6),
        },

        savings: {
            tokensSaved: tokens - (optimizedPrompt.trim().split(/\s+/).length),
            energySaved: +(energy - ((optimizedPrompt.trim().split(/\s+/).length) * 0.0003)).toFixed(6),
            reductionPercent: +(((tokens - (optimizedPrompt.trim().split(/\s+/).length)) / tokens) * 100).toFixed(2)
        },
        model: {
            original: model,

        }

    };
}
module.exports = { analyzePrompt, analyzePromptAsync };