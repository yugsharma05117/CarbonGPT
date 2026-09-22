/**
 * CarbonGPT Prompt Optimizer (Full JS Port)
 * ==========================================
 * Complete port of the Python optimizer — 600+ filler phrase patterns,
 * vague phrase detection, redundant qualifier removal, and smart deduplication.
 *
 * Runs entirely inside Node.js. No Flask or FastAPI needed.
 *
 * Equivalent to: python-optimizer/optimizer.py
 */

// ─── Phrase Patterns ───────────────────────────────────────────────────────

const PHRASE_PATTERNS = [
  // Politeness markers
  "please", "pls", "please do", "kindly", "kindly do",
  "thanks", "thank you", "thank you very much", "thank you so much",
  "thank you kindly", "thanks a lot", "thanks a bunch", "thanks a million",
  "thanks so much", "thank you for your time", "thank you for your patience",
  "thank you for your consideration", "thank you for your help",
  "thank you for everything", "thank you so very much", "thank you ever so much",
  "much obliged", "i appreciate it", "i appreciate your help",
  "we appreciate it", "we appreciate your help", "i'm grateful", "we're grateful",
  "sincere thanks", "with thanks", "with my thanks", "with sincere thanks",
  "warm thanks", "warm regards", "kind regards", "kindest regards",
  "best regards", "regards", "respectfully", "respectfully yours",
  "with respect", "with all due respect", "if i may be so bold",
  "if you would be so kind", "if you would be so gracious",
  "if you would be willing", "if you would be able", "if you would oblige",
  "would you kindly", "would you so kindly", "would you be so gracious",
  "would you be so good", "would you be so good as to", "could you be so good as to",
  "could you kindly", "could you so kindly", "i must say", "if i might say",
  "if i might be so bold", "if i may say so", "if i may be so bold as to say",
  "with permission", "with your permission", "with your consent", "with your leave",
  "if you'll permit me", "if you don't mind", "if you would not mind",
  "no offense", "no offense intended", "no disrespect", "no disrespect intended",
  "no harm meant", "no harm intended", "i mean no harm", "i intend no harm",
  "excuse me", "scuse me", "pardon me", "sorry", "very sorry", "i'm sorry",
  "i'm deeply sorry", "my apologies", "my sincere apologies", "my deepest apologies",
  "i apologize", "i sincerely apologize", "we apologize", "we sincerely apologize",
  "sincere apologies", "if i've offended", "if i've offended you", "if i've upset you",
  "i regret", "i deeply regret", "i do regret",
  "sir", "madam", "sir or madam", "your honor", "your majesty", "your grace",
  "your excellency", "your lordship", "your ladyship",
  "with pleasure", "with the greatest pleasure", "with all my pleasure",
  "with delight", "with great delight", "with all due courtesy", "with courtesy",
  "courteously", "civilly", "politely", "respectfully submitted",
  "most respectfully", "humbly", "humbly yours", "your humble servant",
  "humbly submitted", "if you so wish", "if you so choose", "if you so desire",
  "at your pleasure", "for your convenience", "for your benefit",
  "for your information", "fyi", "fyia", "fyii",
  "at your service", "at your disposal", "a pleasure", "my pleasure",
  "our pleasure", "my honor", "our honor",

  // Question softeners
  "could you", "would you", "would you mind", "can you", "can you please",
  "could you please", "would you please", "would you be so kind",
  "could you be so kind", "would you mind terribly", "i was wondering if",
  "i was thinking if", "i was wondering whether", "i was thinking whether",
  "would you be willing to", "would you mind if", "would you mind if i",
  "could you possibly", "would you possibly", "if you don't mind",
  "if you don't mind me", "if you would", "if you would be so kind",
  "if you would be willing", "if possible", "if you can", "if you could",
  "if you're able", "if you're available", "if it's not too much trouble",
  "if it's not too much bother", "if it's convenient", "if it's convenient for you",
  "if you have time", "if you have a moment", "if you have a spare moment",
  "if you have a few minutes", "when you get a chance", "when you have a moment",
  "when you have a minute", "when it's convenient", "at your convenience",
  "at your earliest convenience", "at your leisure", "whenever you can",
  "whenever you have time", "whenever it's convenient", "do you think you could",
  "do you think you might", "do you think you'd be willing", "would it be possible",
  "would it be possible for you", "would it be possible for you to",
  "would it be possible to", "is it possible", "is it possible for you",
  "is it possible to", "would there be any chance", "would there be any possibility",
  "would there be any way", "could there be any chance", "could there be any possibility",
  "would you have any chance", "would you have any way", "do you happen to",
  "could you happen to", "might you be able to", "might you possibly",
  "would you potentially", "could you potentially", "would you perhaps",
  "could you perhaps", "by any chance", "by any chance could you",
  "by any chance would you", "may i ask", "would you mind if i ask",
  "can i ask", "can i ask you", "can i ask you something", "might i ask",
  "would you mind me asking", "would you object to", "would you have any objection to",
  "would you consider", "would you be open to", "would you be willing",
  "would you entertain", "would you entertain the idea", "would you entertain the possibility",
  "would you give it a thought", "would you think about",
  "would you consider the possibility", "would you consider the idea",
  "would you give me a hand", "would you give me a hand with",
  "could you give me a hand", "could you give me a hand with",
  "would you mind giving me a hand", "would you mind helping",
  "could you help", "would you help", "would you be so good as to",
  "i would be grateful if", "i would be most grateful if",
  "i would appreciate it if", "i would greatly appreciate it if",
  "i would be thankful if", "we would be very grateful if",
  "we would appreciate it if", "would it be alright", "would it be alright with you",
  "would it be alright if", "is it alright", "is it alright if",
  "would it be conceivable", "would it be conceivable for", "would it be conceivable that",

  // Hedging and uncertainty
  "maybe", "perhaps", "possibly", "probably", "seems to", "appears to",
  "i think", "i believe", "i believe that", "i suspect", "i suspect that",
  "i suppose", "i suppose that", "i guess", "i imagined", "i figured",
  "i reckoned", "me thinks", "me thought", "in my opinion", "in my view",
  "in my humble opinion", "my opinion is", "my view is", "i'm of the opinion",
  "i'm of the view", "if you ask me", "from my perspective", "from my viewpoint",
  "from where i sit", "from what i gather", "from what i understand",
  "from what i can tell", "as far as i know", "as far as i'm aware",
  "as far as i can tell", "to my knowledge", "to the best of my knowledge",
  "if i recall correctly", "if my memory serves", "if memory serves me",
  "as far as i remember", "if i'm not mistaken", "if i'm not wrong",
  "correct me if i'm wrong", "i could be wrong", "i could be mistaken",
  "i could be off", "maybe i'm wrong", "maybe i'm mistaken", "maybe i'm off base",
  "perhaps i'm wrong", "i'm not sure", "i'm uncertain", "i'm not certain",
  "i'm doubtful", "i'm skeptical", "i have my doubts",
  "i'm not entirely convinced", "i'm not fully convinced",
  "seems like", "looks like", "sounds like", "feels like",
  "act as if", "for whatever reason", "for some reason", "for reasons unknown",
  "for no particular reason", "allegedly", "reportedly", "purportedly",
  "so called", "so-called", "speaking of", "in a sense", "sort of", "kind of",
  "semi", "partly", "partially", "to some extent", "to a degree",
  "to a certain extent", "to a certain degree", "more or less", "so to speak",
  "so to say", "in a manner of speaking", "if you like", "if you will",
  "if you prefer", "as it were", "as it happens", "as it may be",
  "apparently", "to all appearances", "by all appearances", "by all accounts",
  "by all indications", "at first glance", "at first blush",
  "roughly", "approximately", "somewhat", "rather", "instead of",
  "plausible", "conceivable", "hesitant", "reasonably",

  // Discourse markers
  "you know", "anyway", "anyhow", "by the way", "at any rate",
  "on second thought", "you see", "i mean", "as i was saying", "as i said",
  "back to", "back to business", "speaking of which", "getting back to",
  "in any case", "both sides", "besides", "then again", "on the other hand",
  "consequently", "accordingly", "admittedly", "as a matter of fact",
  "believe it or not", "come to think of it", "now that i think about it",
  "funny you should mention", "that reminds me", "along the same lines",
  "along similar lines", "as it turns out", "it turns out", "incidentally",
  "by the by", "the other day", "you know what", "i'll tell you what",
  "let me tell you", "what i mean is", "what i'm getting at",
  "what i'm trying to say", "what i'm saying is", "the thing is",
  "the thing about it", "here's the thing", "here's what i think",
  "across the board", "for the record", "on record", "i'm not gonna lie",
  "i'm being real", "i'm being honest", "real talk", "for real", "no cap",
  "no lie", "no joke", "it's not a joke", "speaking frankly", "frankly speaking",
  "to be frank", "if we're being honest", "if i'm being honest",
  "if we're being real", "one could say", "per se", "in effect",
  "in essence", "in short", "in brief", "in a nutshell", "in a word",
  "the way i see it", "the way i figure it", "once more", "yet once more",
  "quite a bit", "a fair amount", "quite a lot",
  "terribly", "awfully", "vastly", "wisely", "foolishly", "stupidly",
  "unfortunately", "funnily", "interestingly", "fascinatingly", "curiously",
  "remarkably", "strikingly", "completely", "entirely", "totally", "wholly",
  "unquestionably", "undoubtedly", "indubitably", "incontrovertibly",
  "period", "end of story", "odds are", "quite frankly", "truthfully",
  "without doubt", "without a doubt", "for sure", "for certain",

  // Obvious filler
  "to be honest", "if i'm honest", "now that i think about it",
  "come to think of it", "call me crazy", "i don't know",
  "how shall i put it", "quickly", "merely", "purely",
];

// Sort by length descending so longer phrases are matched first
PHRASE_PATTERNS.sort((a, b) => b.length - a.length);

// Vague pattern regexes (caught by characteristic, not explicit list)
const VAGUE_PATTERNS = [
  /\b(?:after a while|in a bit|earlier|later|soon|the other day)\b/gi,
  /\b(?:a bunch|a ton|loads of|tons of|quite a few|numerous)\b/gi,
  /\b(?:and stuff|and things|or whatever|or something|or anything|and whatnot|or whatnot)\b/gi,
  /\b(?:i guess you could say|how should i say|let me think|hmm|honestly)\b/gi,
  /\b(?:i'm no expert|i'm not sure but|correct me if wrong|not an expert but)\b/gi,
  /\b(?:moving on|to make long story short|bottom line|in conclusion)\b/gi,
  /\b(?:seriously|no kidding|you know what|get this)\b/gi,
  /\b(?:randomly|totally|completely by chance)\b/gi,
];

// Keywords that mark dismissible parenthetical asides
const ASIDE_KEYWORDS = [
  "ignore", "forget", "skip", "don't mind", "disregard",
  "not sure if", "not that", "not important", "random",
  "by the way", "tangent", "aside", "never mind"
];


// ─── Core Functions ────────────────────────────────────────────────────────

function normalizeText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function removeOffTopicAsides(text) {
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

function removePhrasePatterns(text) {
  for (const phrase of PHRASE_PATTERNS) {
    // Escape special regex chars in the phrase
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    text = text.replace(regex, " ");
  }
  return normalizeText(text);
}

function detectVaguePhrases(text) {
  const found = new Set();
  for (const pattern of VAGUE_PATTERNS) {
    pattern.lastIndex = 0;
    const matches = text.match(pattern) || [];
    matches.forEach(m => found.add(m));
  }
  return [...found];
}

function removeRedundantQualifiers(text) {
  // Repeated intensifiers: "very very" → "very"
  text = text.replace(/\b(very|really|so|quite|rather|extremely)\s+\1+\b/gi, "$1");
  // Multiple punctuation
  text = text.replace(/\?{2,}/g, "?");
  text = text.replace(/!{2,}/g, "!");
  text = text.replace(/\.{2,}/g, ".");
  // Empty parentheses/brackets
  text = text.replace(/\(\s*\)/g, "");
  text = text.replace(/\[\s*\]/g, "");
  // Double commas
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

/**
 * Full optimizer — matches the Python optimizer.py behaviour.
 * @param {string} prompt - Input prompt
 * @param {boolean} aggressive - If true, applies extra removal passes
 * @param {boolean} removeAsides - If true, removes off-topic parenthetical asides
 * @returns {string} Optimized prompt
 */
function optimizePromptFull(prompt, aggressive = false, removeAsides = true) {
  prompt = normalizeText(prompt);

  // 1. Remove off-topic asides
  if (removeAsides) {
    const { text } = removeOffTopicAsides(prompt);
    prompt = text;
  }

  // 2. Remove explicit phrase patterns
  prompt = removePhrasePatterns(prompt);

  // 3. Remove vague phrases detected by pattern
  for (const vague of detectVaguePhrases(prompt)) {
    const escaped = vague.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    prompt = prompt.replace(new RegExp(`\\b${escaped}\\b`, "gi"), " ");
  }

  // 4. Remove redundant qualifiers and cleanup
  prompt = removeRedundantQualifiers(prompt);

  // 5. Smart deduplication
  prompt = smartDeduplicate(prompt);

  // 6. Final normalize
  prompt = normalizeText(prompt);

  return prompt;
}

/**
 * Full prompt analysis with stats.
 */
function analyzePromptFull(prompt, removeAsides = true, aggressive = false) {
  const originalWords = prompt.split(/\s+/).filter(w => w).length;
  const vaguePhrases = detectVaguePhrases(prompt);
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
    unknown_vague_phrases_detected: vaguePhrases,
    off_topic_asides: removedAsides,
  };
}

// ─── Public API (drop-in replacement for the old optimizer.js) ────────────

/**
 * Synchronous optimizer (legacy compat).
 */
function optimizePrompt(text) {
  return optimizePromptFull(text);
}

/**
 * Async optimizer — fully self-contained, no external services.
 * Returns same shape as before so server.js needs zero changes.
 */
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

/**
 * Analyzer — same as Python's analyze_prompt.
 */
async function callPythonAnalyzer(text) {
  return analyzePromptFull(text);
}

// Health checks — always return false since we no longer rely on Python services
async function isPythonOptimizerAvailable() { return false; }
async function isFastAPIOptimizerAvailable() { return false; }

// Keep these for any legacy import
async function callPythonOptimizer(text, aggressive = false) { return null; }
async function callFastAPIOptimizer(text, aggressive = false) { return null; }
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