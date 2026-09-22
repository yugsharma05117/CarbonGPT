/**
 * CarbonGPT Prompt Optimizer (Enhanced JS)
 * ==========================================
 * Strips greetings, AI-directed filler, request prefixes, hedging,
 * redundant qualifiers, and discourse markers from prompts.
 *
 * Runs entirely inside Node.js. No Flask or FastAPI needed.
 */

// ─── Step 1: Strip leading greetings & AI-directed openers ─────────────────
// These regex patterns match full opening sentences / clauses that add zero
// informational value. Applied first so later passes work on cleaner text.

const OPENER_PATTERNS = [
  // Greetings to AI
  /^(hello|hi|hey|howdy|greetings|good\s+(morning|afternoon|evening|day))[\s,!.]*(\bai\b|\bassistant\b|\bchatgpt\b|\bgpt\b|\bclaude\b|\bgemini\b)?[\s,!.]*/i,

  // "Hello AI, I want to ..." — strip the greeting clause
  /^(hello|hi|hey)\s+(ai|assistant|there|bot|chatgpt|gpt)[\s,!.]*/i,

  // Self-introductory noise at start
  /^(i am|i'm)\s+(here\s+)?(asking|wondering|writing|reaching out|contacting you)\s+(because|to|for|about)?\s*/i,
];

// ─── Step 2: Strip full request-prefix clauses ──────────────────────────────
// Matches the entire "I want to know about X" wrapper, leaving just X.
// Ordered longest → shortest to avoid partial matches.

const REQUEST_PREFIX_PATTERNS = [
  // "i want to know all the details about" → ""
  /\bi\s+want\s+to\s+know\s+all\s+the\s+details\s+about\b/gi,
  /\bi\s+want\s+to\s+know\s+all\s+about\b/gi,
  /\bi\s+want\s+to\s+know\s+everything\s+about\b/gi,
  /\bi\s+want\s+to\s+know\s+more\s+about\b/gi,
  /\bi\s+want\s+to\s+know\s+about\b/gi,
  /\bi\s+want\s+to\s+know\b/gi,
  /\bi\s+want\s+to\s+learn\s+all\s+about\b/gi,
  /\bi\s+want\s+to\s+learn\s+more\s+about\b/gi,
  /\bi\s+want\s+to\s+learn\s+about\b/gi,
  /\bi\s+want\s+to\s+learn\b/gi,
  /\bi\s+want\s+to\s+understand\s+about\b/gi,
  /\bi\s+want\s+to\s+understand\b/gi,
  /\bi\s+would\s+like\s+to\s+know\s+about\b/gi,
  /\bi\s+would\s+like\s+to\s+know\b/gi,
  /\bi\s+would\s+like\s+to\s+learn\s+about\b/gi,
  /\bi\s+would\s+like\s+to\s+learn\b/gi,
  /\bi\s+need\s+to\s+know\s+about\b/gi,
  /\bi\s+need\s+to\s+know\b/gi,
  /\bi\s+need\s+information\s+about\b/gi,
  /\bi\s+need\s+information\s+on\b/gi,
  /\bi\s+need\s+details\s+about\b/gi,
  /\bi\s+am\s+looking\s+for\s+information\s+about\b/gi,
  /\bi'm\s+looking\s+for\s+information\s+about\b/gi,
  /\bi\s+am\s+curious\s+about\b/gi,
  /\bi'm\s+curious\s+about\b/gi,
  /\bi\s+am\s+interested\s+in\s+learning\s+about\b/gi,
  /\bi'm\s+interested\s+in\s+learning\s+about\b/gi,
  /\bi\s+am\s+interested\s+in\b/gi,
  /\bi'm\s+interested\s+in\b/gi,
  /\bcan\s+you\s+tell\s+me\s+all\s+about\b/gi,
  /\bcan\s+you\s+tell\s+me\s+about\b/gi,
  /\bcan\s+you\s+tell\s+me\b/gi,
  /\bcan\s+you\s+explain\s+about\b/gi,
  /\bcan\s+you\s+explain\b/gi,
  /\bcan\s+you\s+give\s+me\s+information\s+about\b/gi,
  /\bcan\s+you\s+describe\b/gi,
  /\bcould\s+you\s+tell\s+me\s+all\s+about\b/gi,
  /\bcould\s+you\s+tell\s+me\s+about\b/gi,
  /\bcould\s+you\s+tell\s+me\b/gi,
  /\bcould\s+you\s+explain\b/gi,
  /\bcould\s+you\s+provide\s+information\s+about\b/gi,
  /\bwould\s+you\s+tell\s+me\s+about\b/gi,
  /\bwould\s+you\s+explain\b/gi,
  /\bplease\s+tell\s+me\s+all\s+about\b/gi,
  /\bplease\s+tell\s+me\s+about\b/gi,
  /\bplease\s+tell\s+me\b/gi,
  /\btell\s+me\s+all\s+about\b/gi,
  /\btell\s+me\s+about\b/gi,
  /\btell\s+me\b/gi,
  /\bplease\s+explain\s+about\b/gi,
  /\bplease\s+explain\b/gi,
  /\bexplain\s+to\s+me\s+about\b/gi,
  /\bexplain\s+to\s+me\b/gi,
  /\bgive\s+me\s+all\s+the\s+details\s+about\b/gi,
  /\bgive\s+me\s+details\s+about\b/gi,
  /\bgive\s+me\s+information\s+about\b/gi,
  /\bgive\s+me\s+information\s+on\b/gi,
  /\bgive\s+me\s+a\s+brief\s+overview\s+of\b/gi,
  /\bgive\s+me\s+an\s+overview\s+of\b/gi,
  /\bgive\s+me\s+a\s+summary\s+of\b/gi,
  /\bprovide\s+me\s+with\s+information\s+about\b/gi,
  /\bprovide\s+information\s+about\b/gi,
  /\bprovide\s+details\s+about\b/gi,
  /\bprovide\s+an\s+overview\s+of\b/gi,
  /\bshare\s+information\s+about\b/gi,
  /\bshare\s+details\s+about\b/gi,
  /\bi\s+have\s+a\s+question\s+about\b/gi,
  /\bmy\s+question\s+is\s+about\b/gi,
  /\bmy\s+question\s+is\b/gi,
  /\bi\s+was\s+wondering\s+about\b/gi,
  /\bi\s+was\s+wondering\b/gi,
  /\bi\s+wanted\s+to\s+ask\s+about\b/gi,
  /\bi\s+wanted\s+to\s+ask\b/gi,
];

// ─── Step 3: Strip redundant trailing / mid-sentence filler ────────────────
// These appear anywhere in the sentence and add zero info.

const INLINE_FILLER_PATTERNS = [
  // Leftover dangling pronouns after prefix removal (e.g. "and him", "and it")
  /\band\s+(him|her|them|it|this|that|us)\b/gi,
  /\bor\s+(him|her|them|it|this|that)\b/gi,

  // Redundant self-references & circular references
  /\band\s+i\s+want\s+to\s+know\s+about\s+(him|her|them|it|this|that)\b/gi,
  /\band\s+i\s+want\s+to\s+know\s+(him|her|them|it|this|that)\b/gi,
  /\band\s+i\s+want\s+to\s+know\s+more\s+about\s+(him|her|them|it|this|that)\b/gi,
  /\band\s+i\s+want\s+to\s+learn\s+about\s+(him|her|them|it|this|that)\b/gi,
  /\band\s+tell\s+me\s+about\s+(him|her|them|it|this|that)\b/gi,
  /\bi\s+want\s+to\s+know\s+about\s+(him|her|them|it|this|that)\b/gi,
  /\bi\s+want\s+to\s+know\s+(him|her|them|it|this|that)\b/gi,
  /\bi\s+want\s+to\s+learn\s+about\s+(him|her|them|it|this|that)\b/gi,

  // "whose name is X" → redundant when X is already the subject
  /\bwhose\s+name\s+is\b/gi,

  // "who was a X in his/her/their time" type vague descriptors
  /\bwho\s+was\s+a\s+[\w\s]+\s+in\s+(his|her|their|its)\s+time\b/gi,

  // Brevity/detail qualifiers
  /\bin\s+brief\b/gi,
  /\bin\s+short\b/gi,
  /\bin\s+detail\b/gi,
  /\bin\s+details\b/gi,
  /\bin\s+depth\b/gi,
  /\bin\s+a\s+nutshell\b/gi,
  /\bin\s+a\s+few\s+words\b/gi,
  /\bin\s+simple\s+words\b/gi,
  /\bin\s+simple\s+terms\b/gi,
  /\bin\s+layman.?s?\s+terms\b/gi,
  /\bbriefly\b/gi,
  /\bquickly\b/gi,
  /\bsimply\b/gi,

  // "a historic leader" type vague descriptors when they follow a proper name
  /\b(a|an)\s+(famous|great|historic|well[\s-]known|notable|popular|renowned|legendary)\s+(leader|person|figure|individual|personality)\b/gi,

  // Common filler phrases
  /\bplease\b/gi,
  /\bkindly\b/gi,
  /\bthanks?\b/gi,
  /\bthank\s+you\b/gi,
  /\bjust\b/gi,
  /\bbasically\b/gi,
  /\bactually\b/gi,
  /\bliterally\b/gi,
  /\bi\s+think\b/gi,
  /\bi\s+believe\b/gi,
  /\bi\s+guess\b/gi,
  /\bi\s+mean\b/gi,
  /\byou\s+know\b/gi,
  /\bkind\s+of\b/gi,
  /\bsort\s+of\b/gi,
  /\blike\b/gi,
  /\bmaybe\b/gi,
  /\bperhaps\b/gi,
  /\bpossibly\b/gi,
  /\bprobably\b/gi,
  /\bso\s+yeah\b/gi,
  /\bokay\b/gi,
  /\banyway\b/gi,
  /\banyhow\b/gi,
  /\bby\s+the\s+way\b/gi,
];

// ─── Step 4: Vague characteristic pattern detection ─────────────────────────

const VAGUE_PATTERNS = [
  /\b(?:after a while|in a bit|the other day)\b/gi,
  /\b(?:a bunch|a ton|loads of|tons of|quite a few)\b/gi,
  /\b(?:and stuff|and things|or whatever|or something|or anything|and whatnot)\b/gi,
  /\b(?:i guess you could say|let me think|hmm)\b/gi,
  /\b(?:moving on|to make a long story short|bottom line)\b/gi,
  /\b(?:no kidding|get this)\b/gi,
];

// ─── Utility functions ──────────────────────────────────────────────────────

function normalizeText(text) {
  return text
    .replace(/\s{2,}/g, " ")
    .replace(/^\s+|\s+$/g, "")
    .replace(/\s+([,;:!?.])/g, "$1") // remove space before punctuation
    .replace(/^[,;:\-–—]+\s*/, "")    // remove leading punctuation
    .trim();
}

function removeOffTopicAsides(text) {
  const ASIDE_KEYWORDS = [
    "ignore", "forget", "skip", "don't mind", "disregard",
    "not sure if", "not that", "not important", "random",
    "by the way", "tangent", "aside", "never mind"
  ];
  const asides = [...text.matchAll(/\([^)]*\)/g)].map(m => m[0]);
  const removed = [];
  for (const aside of asides) {
    const lower = aside.toLowerCase();
    if (ASIDE_KEYWORDS.some(kw => lower.includes(kw))) {
      removed.push(aside);
      text = text.replace(aside, "");
    }
  }
  return { text: normalizeText(text), removed };
}

function removeRedundantQualifiers(text) {
  text = text.replace(/\b(very|really|so|quite|rather|extremely)\s+\1+\b/gi, "$1");
  text = text.replace(/\?{2,}/g, "?");
  text = text.replace(/!{2,}/g, "!");
  text = text.replace(/\.{2,}/g, ".");
  text = text.replace(/\(\s*\)/g, "");
  text = text.replace(/\[\s*\]/g, "");
  text = text.replace(/,\s*,/g, ",");
  text = text.replace(/^\s*,/, "");
  return normalizeText(text);
}

function smartDeduplicate(text) {
  let words = text.split(/\s+/);
  if (words.length === 0) return text;

  // Collapse adjacent duplicate single words
  const result = [words[0]];
  for (let i = 1; i < words.length; i++) {
    if (words[i].toLowerCase() !== words[i - 1].toLowerCase()) {
      result.push(words[i]);
    }
  }
  words = result;

  // Collapse repeated adjacent 2-3 word phrases
  for (const phraseLen of [3, 2]) {
    let i = 0;
    while (i + 2 * phraseLen <= words.length) {
      const a = words.slice(i, i + phraseLen).map(w => w.toLowerCase()).join(" ");
      const b = words.slice(i + phraseLen, i + 2 * phraseLen).map(w => w.toLowerCase()).join(" ");
      if (a === b) {
        words.splice(i + phraseLen, phraseLen);
      } else {
        i++;
      }
    }
  }

  return words.join(" ");
}

// ─── Main Optimizer ─────────────────────────────────────────────────────────

/**
 * Optimize a prompt by stripping all non-informational content.
 *
 * Pipeline:
 *   1. Strip opening greetings/AI-directed openers
 *   2. Strip full request-prefix clauses ("I want to know about")
 *   3. Strip inline filler patterns (redundant refs, brevity qualifiers, etc.)
 *   4. Strip vague detected patterns
 *   5. Remove redundant qualifiers & deduplicate
 *   6. Final normalize
 */
function optimizePromptFull(prompt, aggressive = false, removeAsides = true) {
  prompt = normalizeText(prompt);

  // 1. Remove off-topic parenthetical asides
  if (removeAsides) {
    const { text } = removeOffTopicAsides(prompt);
    prompt = text;
  }

  // 2. Strip opening greeting/AI-directed opener
  for (const pattern of OPENER_PATTERNS) {
    prompt = prompt.replace(pattern, "");
  }
  prompt = normalizeText(prompt);

  // 3. Strip request-prefix clauses (longest first)
  for (const pattern of REQUEST_PREFIX_PATTERNS) {
    prompt = prompt.replace(pattern, " ");
  }
  prompt = normalizeText(prompt);

  // 4. Strip inline fillers
  for (const pattern of INLINE_FILLER_PATTERNS) {
    prompt = prompt.replace(pattern, " ");
  }
  prompt = normalizeText(prompt);

  // 5. Strip vague detected patterns
  for (const pattern of VAGUE_PATTERNS) {
    pattern.lastIndex = 0;
    prompt = prompt.replace(pattern, " ");
  }
  prompt = normalizeText(prompt);

  // 6. Remove redundant qualifiers
  prompt = removeRedundantQualifiers(prompt);

  // 7. Smart deduplication
  prompt = smartDeduplicate(prompt);

  // 8. Final cleanup — strip leading/trailing junk
  prompt = normalizeText(prompt);

  // Safety: if we over-stripped to empty/trivial, return original
  if (!prompt || prompt.length < 3) return normalizeText(arguments[0]);

  return prompt;
}

/**
 * Full prompt analysis with stats.
 */
function analyzePromptFull(prompt, removeAsides = true, aggressive = false) {
  const originalWords = prompt.split(/\s+/).filter(w => w).length;
  const { removed: removedAsides } = removeOffTopicAsides(prompt);

  const optimized = optimizePromptFull(prompt, aggressive, removeAsides);
  const optimizedWords = optimized.split(/\s+/).filter(w => w).length;
  const reduction = originalWords > 0 ? ((originalWords - optimizedWords) / originalWords * 100) : 0;

  return {
    original_word_count: originalWords,
    optimized_word_count: optimizedWords,
    reduction_percentage: Math.round(reduction * 100) / 100,
    original: prompt,
    optimized,
    unknown_vague_phrases_detected: [],
    off_topic_asides: removedAsides,
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

function optimizePrompt(text) {
  return optimizePromptFull(text);
}

async function optimizePromptAsync(text, aggressive = false) {
  const start = Date.now();
  const optimized = optimizePromptFull(text, aggressive);
  const originalWords = text.split(/\s+/).filter(w => w).length;
  const optimizedWords = optimized.split(/\s+/).filter(w => w).length;
  const reduction = originalWords > 0 ? ((originalWords - optimizedWords) / originalWords * 100) : 0;

  return {
    optimized,
    stats: {
      originalWords,
      optimizedWords,
      reductionPercent: Math.round(reduction * 100) / 100,
      processingTimeMs: Date.now() - start,
    },
    source: "js-advanced",
  };
}

async function callPythonAnalyzer(text) {
  return analyzePromptFull(text);
}

async function isPythonOptimizerAvailable() { return false; }
async function isFastAPIOptimizerAvailable() { return false; }
async function callPythonOptimizer() { return null; }
async function callFastAPIOptimizer() { return null; }
function jsFallbackOptimize(text) { return optimizePromptFull(text); }

module.exports = {
  optimizePrompt,
  optimizePromptAsync,
  callPythonOptimizer,
  callFastAPIOptimizer,
  callPythonAnalyzer,
  isPythonOptimizerAvailable,
  isFastAPIOptimizerAvailable,
  jsFallbackOptimize,
};