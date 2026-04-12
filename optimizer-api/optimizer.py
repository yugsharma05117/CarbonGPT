"""
CarbonGPT Prompt Optimizer – FastAPI Edition
=============================================
A comprehensive prompt optimizer that removes filler phrases,
hedging language, politeness markers, and off-topic asides
while preserving the core meaning of the prompt.

This module mirrors the logic from the Flask-based optimizer
(carbongpt-backend/python-optimizer/optimizer.py) and is used
by the FastAPI service in main.py.
"""

import re
from typing import List, Tuple


# ─── Comprehensive phrase patterns to remove ────────────────────────

PHRASE_PATTERNS = [
    # Politeness markers
    r"\bplease\b",
    r"\bpls\b",
    r"\bplease do\b",
    r"\bkindly\b",
    r"\bkindly do\b",
    r"\bthanks\b",
    r"\bthank you\b",
    r"\bthank you very much\b",
    r"\bthank you so much\b",
    r"\bthank you kindly\b",
    r"\bthanks a lot\b",
    r"\bthanks a bunch\b",
    r"\bthanks a million\b",
    r"\bthanks so much\b",
    r"\bthank you for your time\b",
    r"\bthank you for your patience\b",
    r"\bthank you for your consideration\b",
    r"\bthank you for your help\b",
    r"\bthank you for everything\b",
    r"\bmuch obliged\b",
    r"\bi appreciate it\b",
    r"\bi appreciate your help\b",
    r"\bi'm grateful\b",
    r"\bwarm regards\b",
    r"\bkind regards\b",
    r"\bbest regards\b",
    r"\bregards\b",
    r"\brespectfully\b",
    r"\bwith all due respect\b",
    r"\bwould you kindly\b",
    r"\bcould you kindly\b",
    r"\bexcuse me\b",
    r"\bpardon me\b",
    r"\bsorry\b",
    r"\bi'm sorry\b",
    r"\bmy apologies\b",
    r"\bi apologize\b",
    r"\bif you don't mind\b",
    r"\bno offense\b",
    r"\bno disrespect\b",
    r"\bwith permission\b",
    r"\bwith your permission\b",
    r"\bfor your convenience\b",
    r"\bfor your information\b",
    r"\bfyi\b",
    r"\bat your service\b",
    r"\bat your disposal\b",
    r"\bmy pleasure\b",

    # Question softeners
    r"\bcould you\b",
    r"\bwould you\b",
    r"\bwould you mind\b",
    r"\bcan you\b",
    r"\bcan you please\b",
    r"\bcould you please\b",
    r"\bwould you please\b",
    r"\bwould you be so kind\b",
    r"\bcould you be so kind\b",
    r"\bi was wondering if\b",
    r"\bi was wondering whether\b",
    r"\bwould you be willing to\b",
    r"\bwould you mind if\b",
    r"\bcould you possibly\b",
    r"\bwould you possibly\b",
    r"\bif you would\b",
    r"\bif possible\b",
    r"\bif you can\b",
    r"\bif you could\b",
    r"\bif it's not too much trouble\b",
    r"\bif you have time\b",
    r"\bif you have a moment\b",
    r"\bwhen you get a chance\b",
    r"\bat your convenience\b",
    r"\bat your earliest convenience\b",
    r"\bwhenever you can\b",
    r"\bdo you think you could\b",
    r"\bwould it be possible\b",
    r"\bwould it be possible to\b",
    r"\bis it possible\b",
    r"\bis it possible to\b",
    r"\bby any chance\b",
    r"\bmay i ask\b",
    r"\bcan i ask\b",
    r"\bi would be grateful if\b",
    r"\bi would appreciate it if\b",
    r"\bi would greatly appreciate it if\b",

    # Hedging and uncertainty
    r"\bmaybe\b",
    r"\bperhaps\b",
    r"\bpossibly\b",
    r"\bprobably\b",
    r"\bseems\b",
    r"\bseems to\b",
    r"\bappears\b",
    r"\bappears to\b",
    r"\bi think\b",
    r"\bi believe\b",
    r"\bi suspect\b",
    r"\bi suppose\b",
    r"\bi guess\b",
    r"\bin my opinion\b",
    r"\bin my view\b",
    r"\bin my humble opinion\b",
    r"\bif you ask me\b",
    r"\bfrom my perspective\b",
    r"\bas far as i know\b",
    r"\bas far as i can tell\b",
    r"\bto my knowledge\b",
    r"\bif i recall correctly\b",
    r"\bif i'm not mistaken\b",
    r"\bcorrect me if i'm wrong\b",
    r"\bi could be wrong\b",
    r"\bi'm not sure\b",
    r"\bi'm uncertain\b",
    r"\bseems like\b",
    r"\blooks like\b",
    r"\bsounds like\b",
    r"\bfeels like\b",
    r"\bfor whatever reason\b",
    r"\bfor some reason\b",
    r"\ballegedly\b",
    r"\breportedly\b",
    r"\bsort of\b",
    r"\bkind of\b",
    r"\bpartly\b",
    r"\bpartially\b",
    r"\bto some extent\b",
    r"\bto a degree\b",
    r"\bmore or less\b",
    r"\bso to speak\b",
    r"\bin a manner of speaking\b",
    r"\bif you will\b",
    r"\bas it were\b",
    r"\bapparently\b",
    r"\bsomewhat\b",
    r"\brather\b",
    r"\broughly\b",
    r"\bapproximately\b",

    # Discourse markers
    r"\byou know\b",
    r"\blike\b",
    r"\banyway\b",
    r"\banyhow\b",
    r"\bby the way\b",
    r"\bat any rate\b",
    r"\bon second thought\b",
    r"\bwell\b",
    r"\bso\b",
    r"\blook\b",
    r"\blisten\b",
    r"\bright\b",
    r"\bokay\b",
    r"\byou see\b",
    r"\bi mean\b",
    r"\bas i was saying\b",
    r"\bin any case\b",
    r"\bfurthermore\b",
    r"\bmoreover\b",
    r"\bbesides\b",
    r"\bhowever\b",
    r"\bnevertheless\b",
    r"\btherefore\b",
    r"\bthus\b",
    r"\bhence\b",
    r"\baccordingly\b",
    r"\badmittedly\b",
    r"\bas a matter of fact\b",
    r"\bbelieve it or not\b",
    r"\bcome to think of it\b",
    r"\bnow that i think about it\b",
    r"\bthat reminds me\b",
    r"\bas it turns out\b",
    r"\bit turns out\b",
    r"\bincidentally\b",
    r"\bthe thing is\b",
    r"\bthe point is\b",
    r"\bhere's the thing\b",
    r"\bfor the record\b",
    r"\bi'm not gonna lie\b",
    r"\bfrankly\b",
    r"\bto be frank\b",
    r"\bto be honest\b",
    r"\bif i'm being honest\b",
    r"\bin effect\b",
    r"\beffectively\b",
    r"\bin essence\b",
    r"\bin short\b",
    r"\bin brief\b",
    r"\bin a nutshell\b",

    # Obvious fillers
    r"\bjust\b",
    r"\bquickly\b",
    r"\bmerely\b",
    r"\bonly\b",
    r"\bpurely\b",
    r"\bdirectly\b",
    r"\bactually\b",
    r"\bbasically\b",
    r"\bliterally\b",
    r"\bhonestly\b",
    r"\bseriously\b",
    r"\bcompletely\b",
    r"\bentirely\b",
    r"\btotally\b",
    r"\babsolutely\b",
    r"\bdefinitely\b",
    r"\bundoubtedly\b",
    r"\bfor sure\b",
    r"\bfor certain\b",
]

# Structural words to never remove
PROTECTED_WORDS = {
    "not", "no", "never", "nor", "or", "and", "but", "because", "since",
    "although", "though", "while", "if", "when", "where", "why", "how",
    "who", "what", "which", "whoever", "whatever", "whichever",
    "they", "them", "their", "you", "your", "we", "us", "our", "i", "me", "my",
    "he", "him", "his", "she", "her", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "should", "could", "can",
    "may", "might", "must", "shall", "all", "both", "each", "either",
    "any", "every", "as", "than", "then", "from", "to", "in", "on", "at", "by", "of",
    "with", "without", "about", "into", "through", "during", "before", "after", "above",
    "below", "up", "down", "that", "which", "this", "these", "those", "the", "a", "an",
}


# ─── Utility functions ──────────────────────────────────────────────

def normalize_text(text: str) -> str:
    """Normalize whitespace and clean up text."""
    text = text.strip()
    text = re.sub(r"\s+", " ", text)
    return text


def detect_vague_phrases(text: str) -> List[str]:
    """
    Detect common vague/filler phrases NOT in the explicit list.
    Catches unknown fillers by pattern characteristics.
    """
    vague_patterns = [
        r"\b(?:after a while|in a bit|earlier|later|soon|the other day)\b",
        r"\b(?:a bunch|a ton|loads of|tons of|quite a few|numerous)\b",
        r"\b(?:and stuff|and things|or whatever|or something|or anything|and whatnot|or whatnot)\b",
        r"\b(?:i guess you could say|how should i say|let me think|hmm|honestly)\b",
        r"\b(?:i'm no expert|i'm not sure but|correct me if wrong|not an expert but)\b",
        r"\b(?:moving on|to make long story short|bottom line|in conclusion)\b",
        r"\b(?:seriously|no kidding|you know what|get this)\b",
        r"\b(?:randomly|totally|completely by chance)\b",
    ]

    found_phrases = []
    for pattern in vague_patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            found_phrases.append(match.group())

    return list(set(found_phrases))


def remove_redundant_qualifiers(text: str) -> str:
    """Remove redundant qualifiers and clean up formatting."""
    # Repeated qualifiers
    text = re.sub(r"\b(very|really|so|quite|rather|extremely)\s+\1+\b", r"\1", text, flags=re.IGNORECASE)

    # Multiple punctuation collapsed
    text = re.sub(r"\?{2,}", "?", text)
    text = re.sub(r"!{2,}", "!", text)
    text = re.sub(r"\.{2,}", ".", text)
    text = re.sub(r"…{2,}", "…", text)

    # Empty parentheses/brackets
    text = re.sub(r"\(\s*\)", "", text)
    text = re.sub(r"\[\s*\]", "", text)

    # Stray commas
    text = re.sub(r"^\s*,", "", text)
    text = re.sub(r",\s*,", ",", text)

    # Double spaces
    text = re.sub(r"\s{2,}", " ", text)
    return text


def remove_off_topic_asides(text: str, remove_asides: bool = True) -> Tuple[str, List[str]]:
    """
    Identify and optionally remove off-topic parenthetical content.
    Returns (cleaned_text, list_of_removed_asides).
    """
    aside_keywords = [
        "ignore", "forget", "skip", "don't mind", "disregard",
        "not sure if", "not that", "not important", "random",
        "by the way", "tangent", "aside", "never mind"
    ]

    asides = re.findall(r"\([^)]*\)", text)
    removed_asides = []

    for aside in asides:
        if any(keyword in aside.lower() for keyword in aside_keywords):
            removed_asides.append(aside)
            text = text.replace(aside, "", 1)

    return normalize_text(text), removed_asides


def remove_phrase_patterns(text: str) -> str:
    """Remove filler phrases while preserving structure."""
    for pattern in PHRASE_PATTERNS:
        text = re.sub(pattern, " ", text, flags=re.IGNORECASE)
    return normalize_text(text)


def smart_deduplicate(text: str, max_repeats: int = 1) -> str:
    """Remove repeated adjacent words and phrases."""
    words = text.split()
    if not words:
        return text

    result: List[str] = []
    repeat_count = 0
    last_word = words[0]
    result.append(last_word)

    for word in words[1:]:
        if word.lower() == last_word.lower():
            repeat_count += 1
            if repeat_count < max_repeats:
                result.append(word)
        else:
            last_word = word
            repeat_count = 0
            result.append(word)

    words = result

    # Collapse repeated adjacent phrases (length 2–3)
    for phrase_len in (3, 2):
        i = 0
        while i + 2 * phrase_len <= len(words):
            if [w.lower() for w in words[i:i + phrase_len]] == [w.lower() for w in words[i + phrase_len:i + 2 * phrase_len]]:
                del words[i + phrase_len:i + 2 * phrase_len]
            else:
                i += 1

    return " ".join(words)


# ─── Main optimization functions ────────────────────────────────────

def optimize_prompt(prompt: str, aggressive: bool = False, remove_asides: bool = True) -> str:
    """
    Optimize a prompt by removing fillers while preserving meaning.

    Args:
        prompt: The prompt text to optimize
        aggressive: If True, also remove light stopwords (experimental)
        remove_asides: If True, remove off-topic parenthetical asides

    Returns:
        Optimized prompt string
    """
    prompt = normalize_text(prompt)

    # Step 1: Remove off-topic asides
    prompt, _ = remove_off_topic_asides(prompt, remove_asides=remove_asides)

    # Step 2: Remove explicitly listed filler phrases
    prompt = remove_phrase_patterns(prompt)

    # Step 3: Remove vague/unknown filler phrases detected by pattern
    for vague_phrase in detect_vague_phrases(prompt):
        prompt = re.sub(re.escape(vague_phrase), " ", prompt, flags=re.IGNORECASE)

    # Step 4: Remove redundant qualifiers and clean up formatting
    prompt = remove_redundant_qualifiers(prompt)

    # Step 5: Smart deduplication
    prompt = smart_deduplicate(prompt, max_repeats=1)

    # Final cleanup
    prompt = normalize_text(prompt)
    return prompt


def batch_optimize(prompts: List[str], aggressive: bool = False, remove_asides: bool = True) -> List[str]:
    """Optimize multiple prompts."""
    return [optimize_prompt(p, aggressive=aggressive, remove_asides=remove_asides) for p in prompts]


def analyze_prompt(prompt: str, remove_asides: bool = True, aggressive: bool = False) -> dict:
    """
    Analyze prompt and return detailed statistics including unknown phrases detected.
    """
    original_words = len(prompt.split())

    # Detect unknown vague phrases BEFORE removal
    vague_phrases = detect_vague_phrases(prompt)

    # Detect off-topic asides BEFORE removal
    _, removed_asides = remove_off_topic_asides(prompt, remove_asides=False)

    # Optimize
    optimized = optimize_prompt(prompt, remove_asides=remove_asides, aggressive=aggressive)
    optimized_words = len(optimized.split())
    reduction = ((original_words - optimized_words) / original_words * 100) if original_words > 0 else 0

    return {
        "original_word_count": original_words,
        "optimized_word_count": optimized_words,
        "reduction_percentage": round(reduction, 2),
        "original": prompt,
        "optimized": optimized,
        "unknown_vague_phrases_detected": vague_phrases,
        "off_topic_asides": removed_asides,
    }