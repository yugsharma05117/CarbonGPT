import re
from typing import List, Set, Tuple

# Comprehensive phrase patterns to remove (complete v1 patterns)
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
    r"\bthank you so very much\b",
    r"\bthank you ever so much\b",
    r"\bmuch obliged\b",
    r"\bi appreciate it\b",
    r"\bi appreciate your help\b",
    r"\bwe appreciate it\b",
    r"\bwe appreciate your help\b",
    r"\bi'm grateful\b",
    r"\bwe're grateful\b",
    r"\bsincere thanks\b",
    r"\bwith thanks\b",
    r"\bwith my thanks\b",
    r"\bwith sincere thanks\b",
    r"\bwarm thanks\b",
    r"\bwarm regards\b",
    r"\bkind regards\b",
    r"\bkindest regards\b",
    r"\bbest regards\b",
    r"\best regards\b",
    r"\bregards\b",
    r"\bkind regards\b",
    r"\brespectfully\b",
    r"\brespectfully yours\b",
    r"\bwith respect\b",
    r"\bwith all due respect\b",
    r"\bif i may be so bold\b",
    r"\bif you would be so kind\b",
    r"\bif you would be so gracious\b",
    r"\bif you would be willing\b",
    r"\bif you would be able\b",
    r"\bif you would oblige\b",
    r"\bwould you kindly\b",
    r"\bwould you so kindly\b",
    r"\bwould you be so gracious\b",
    r"\bwould you be so good\b",
    r"\bwould you be so good as to\b",
    r"\bcould you be so good as to\b",
    r"\bcould you kindly\b",
    r"\bcould you so kindly\b",
    r"\bi must say\b",
    r"\bif i might say\b",
    r"\bif i might be so bold\b",
    r"\bif i may say so\b",
    r"\bif i may be so bold as to say\b",
    r"\bwith permission\b",
    r"\bwith your permission\b",
    r"\bwith your consent\b",
    r"\bwith your leave\b",
    r"\bif you'll permit me\b",
    r"\bif you don't mind\b",
    r"\bif you would not mind\b",
    r"\bno offense\b",
    r"\bno offense intended\b",
    r"\bno disrespect\b",
    r"\bno disrespect intended\b",
    r"\bwith all due respect\b",
    r"\bno harm meant\b",
    r"\bno harm intended\b",
    r"\bi mean no harm\b",
    r"\bi intend no harm\b",
    r"\bexcuse me\b",
    r"\bscuse me\b",
    r"\bpardon me\b",
    r"\bsorry\b",
    r"\bvery sorry\b",
    r"\bi'm sorry\b",
    r"\bi'm deeply sorry\b",
    r"\bmy apologies\b",
    r"\bmy sincere apologies\b",
    r"\bmy deepest apologies\b",
    r"\bi apologize\b",
    r"\bi sincerely apologize\b",
    r"\bwe apologize\b",
    r"\bwe sincerely apologize\b",
    r"\bsincere apologies\b",
    r"\bif i've offended\b",
    r"\bif i've offended you\b",
    r"\bif i've upset you\b",
    r"\bi regret\b",
    r"\bi deeply regret\b",
    r"\bi do regret\b",
    r"\bsir\b",
    r"\bmadam\b",
    r"\bsir or madam\b",
    r"\byour honor\b",
    r"\byour majesty\b",
    r"\byour grace\b",
    r"\byour excellency\b",
    r"\byour lordship\b",
    r"\byour ladyship\b",
    r"\bwould you honor me\b",
    r"\bwould you honor us\b",
    r"\byou honor me\b",
    r"\byou honor us\b",
    r"\bwith pleasure\b",
    r"\bwith the greatest pleasure\b",
    r"\bwith all my pleasure\b",
    r"\bwith delight\b",
    r"\bwith great delight\b",
    r"\bwith all due courtesy\b",
    r"\bwith courtesy\b",
    r"\bcourteously\b",
    r"\bcivilly\b",
    r"\bpolitely\b",
    r"\brespectfully submitted\b",
    r"\bmost respectfully\b",
    r"\bhumbly\b",
    r"\bhumbly yours\b",
    r"\byour humble servant\b",
    r"\bhumbly submitted\b",
    r"\bif you so wish\b",
    r"\bif you so choose\b",
    r"\bif you so desire\b",
    r"\bat your pleasure\b",
    r"\bfor your convenience\b",
    r"\bfor your benefit\b",
    r"\bfor your information\b",
    r"\bfyi\b",
    r"\bfyia\b",
    r"\bfyii\b",
    r"\bat your service\b",
    r"\bat your disposal\b",
    r"\ba pleasure\b",
    r"\bmy pleasure\b",
    r"\bour pleasure\b",
    r"\bmy honor\b",
    r"\bour honor\b",
    r"\byour humble servant\b",
    
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
    r"\bwould you mind terribly\b",
    r"\bi was wondering if\b",
    r"\bi was thinking if\b",
    r"\bi was wondering whether\b",
    r"\bi was thinking whether\b",
    r"\bwould you be willing to\b",
    r"\bwould you mind if\b",
    r"\bwould you mind if i\b",
    r"\bcould you possibly\b",
    r"\bwould you possibly\b",
    r"\bif you don't mind\b",
    r"\bif you don't mind me\b",
    r"\bif you would\b",
    r"\bif you would be so kind\b",
    r"\bif you would be willing\b",
    r"\bif possible\b",
    r"\bif you can\b",
    r"\bif you could\b",
    r"\bif you're able\b",
    r"\bif you're available\b",
    r"\bif it's not too much trouble\b",
    r"\bif it's not too much bother\b",
    r"\bif it's convenient\b",
    r"\bif it's convenient for you\b",
    r"\bif you have time\b",
    r"\bif you have a moment\b",
    r"\bif you have a spare moment\b",
    r"\bif you have a few minutes\b",
    r"\bwhen you get a chance\b",
    r"\bwhen you have a moment\b",
    r"\bwhen you have a minute\b",
    r"\bwhen it's convenient\b",
    r"\bat your convenience\b",
    r"\bat your earliest convenience\b",
    r"\bat your leisure\b",
    r"\bwhenever you can\b",
    r"\bwhenever you have time\b",
    r"\bwhenever it's convenient\b",
    r"\bacross your time\b",
    r"\bdo you think you could\b",
    r"\bdo you think you might\b",
    r"\bdo you think you'd be willing\b",
    r"\bwould it be possible\b",
    r"\bwould it be possible for you\b",
    r"\bwould it be possible for you to\b",
    r"\bwould it be possible to\b",
    r"\bis it possible\b",
    r"\bis it possible for you\b",
    r"\bis it possible to\b",
    r"\bwould there be any chance\b",
    r"\bwould there be any possibility\b",
    r"\bwould there be any way\b",
    r"\bcould there be any chance\b",
    r"\bcould there be any possibility\b",
    r"\bwould you have any chance\b",
    r"\bwould you have any way\b",
    r"\bdo you happen to\b",
    r"\bcould you happen to\b",
    r"\bmight you be able to\b",
    r"\bmight you possibly\b",
    r"\bcould you possibly\b",
    r"\bwould you potentially\b",
    r"\bcould you potentially\b",
    r"\bwould you perhaps\b",
    r"\bcould you perhaps\b",
    r"\bby any chance\b",
    r"\bby any chance could you\b",
    r"\bby any chance would you\b",
    r"\bmay i ask\b",
    r"\bwould you mind if i ask\b",
    r"\bcan i ask\b",
    r"\bcan i ask you\b",
    r"\bcan i ask you something\b",
    r"\bmight i ask\b",
    r"\bwould you mind me asking\b",
    r"\bwould you object to\b",
    r"\bwould you have any objection to\b",
    r"\bwould you consider\b",
    r"\bwould you be open to\b",
    r"\bwould you be willing\b",
    r"\bwould you entertain\b",
    r"\bwould you entertain the idea\b",
    r"\bwould you entertain the possibility\b",
    r"\bwould you give it a thought\b",
    r"\bwould you think about\b",
    r"\bwould you consider the possibility\b",
    r"\bwould you consider the idea\b",
    r"\bwould you give me a hand\b",
    r"\bwould you give me a hand with\b",
    r"\bcould you give me a hand\b",
    r"\bcould you give me a hand with\b",
    r"\bwould you mind giving me a hand\b",
    r"\bwould you mind helping\b",
    r"\bcould you help\b",
    r"\bwould you help\b",
    r"\bwould you be so good as to\b",
    r"\bcould you be so good as to\b",
    r"\bi would be grateful if\b",
    r"\bi would be most grateful if\b",
    r"\bi would appreciate it if\b",
    r"\bi would greatly appreciate it if\b",
    r"\bi would be thankful if\b",
    r"\bwe would be very grateful if\b",
    r"\bwe would appreciate it if\b",
    r"\bif only you could\b",
    r"\bif only you would\b",
    r"\bwould it be alright\b",
    r"\bwould it be alright with you\b",
    r"\bwould it be alright if\b",
    r"\bis it alright\b",
    r"\bis it alright if\b",
    r"\bcould it be\b",
    r"\bcould it be that\b",
    r"\bcould it be that you\b",
    r"\bwould it be conceivable\b",
    r"\bwould it be conceivable for\b",
    r"\bwould it be conceivable that\b",
    
    # Hedging and uncertainty
    r"\bmaybe\b",
    r"\bperhaps\b",
    r"\bpossibly\b",
    r"\bprobably\b",
    r"\blikely\b",
    r"\bunlikely\b",
    r"\bseems\b",
    r"\bseems to\b",
    r"\bappears\b",
    r"\bappears to\b",
    r"\bi think\b",
    r"\bi believe\b",
    r"\bi believe that\b",
    r"\bi suspect\b",
    r"\bi suspect that\b",
    r"\bi suppose\b",
    r"\bi suppose that\b",
    r"\bi guess\b",
    r"\bi imagined\b",
    r"\bi figured\b",
    r"\bi reckoned\b",
    r"\bme thinks\b",
    r"\bme thought\b",
    r"\bin my opinion\b",
    r"\bin my view\b",
    r"\bin my humble opinion\b",
    r"\bmy opinion is\b",
    r"\bmy view is\b",
    r"\bi'm of the opinion\b",
    r"\bi'm of the view\b",
    r"\bif you ask me\b",
    r"\bfrom my perspective\b",
    r"\bfrom my viewpoint\b",
    r"\bfrom where i sit\b",
    r"\bfrom what i gather\b",
    r"\bfrom what i understand\b",
    r"\bfrom what i can tell\b",
    r"\bas far as i know\b",
    r"\bas far as i'm aware\b",
    r"\bas far as i can tell\b",
    r"\bto my knowledge\b",
    r"\bto the best of my knowledge\b",
    r"\bif i recall correctly\b",
    r"\bif my memory serves\b",
    r"\bif memory serves me\b",
    r"\bas far as i remember\b",
    r"\bif i'm not mistaken\b",
    r"\bif i'm not wrong\b",
    r"\bcorrect me if i'm wrong\b",
    r"\bi could be wrong\b",
    r"\bi could be mistaken\b",
    r"\bi could be off\b",
    r"\bmaybe i'm wrong\b",
    r"\bmaybe i'm mistaken\b",
    r"\bmaybe i'm off base\b",
    r"\bperhaps i'm wrong\b",
    r"\bi'm not sure\b",
    r"\bi'm uncertain\b",
    r"\bi'm not certain\b",
    r"\bi'm doubtful\b",
    r"\bi'm skeptical\b",
    r"\bi have my doubts\b",
    r"\bi'm not entirely convinced\b",
    r"\bi'm not fully convinced\b",
    r"\bquestionable\b",
    r"\bemerges\b",
    r"\bseems like\b",
    r"\blooks like\b",
    r"\bsounds like\b",
    r"\bfeels like\b",
    r"\bact as if\b",
    r"\bfor whatever reason\b",
    r"\bfor some reason\b",
    r"\bfor reasons unknown\b",
    r"\bfor no particular reason\b",
    r"\ballegedly\b",
    r"\breportedly\b",
    r"\bpurportedly\b",
    r"\bso called\b",
    r"\bso-called\b",
    r"\bpretended\b",
    r"\bfaked\b",
    r"\bspeaking\b",
    r"\bspeaking of\b",
    r"\bin a sense\b",
    r"\bsort of\b",
    r"\bkind of\b",
    r"\bsemi\b",
    r"\bpartly\b",
    r"\bpartially\b",
    r"\bto some extent\b",
    r"\bto a degree\b",
    r"\bto a certain extent\b",
    r"\bto a certain degree\b",
    r"\bmore or less\b",
    r"\bso to speak\b",
    r"\bso to say\b",
    r"\bin a manner of speaking\b",
    r"\bif you like\b",
    r"\bif you will\b",
    r"\bif you prefer\b",
    r"\bas it were\b",
    r"\bas it happens\b",
    r"\bas it may be\b",
    r"\b supposedly\b",
    r"\bapparently\b",
    r"\bto all appearances\b",
    r"\bby all appearances\b",
    r"\bby all accounts\b",
    r"\bby all indications\b",
    r"\bat first glance\b",
    r"\bat first blush\b",
    r"\bat least\b",
    r"\bat most\b",
    r"\broughly\b",
    r"\bapproximately\b",
    r"\baround\b",
    r"\babout\b",
    r"\bsomewhat\b",
    r"\brather\b",
    r"\binstead\b",
    r"\binstead of\b",
    r"\bplausible\b",
    r"\bconceivable\b",
    r"\bimaginary\b",
    r"\bfantasy\b",
    r"\bunlikely\b",
    r"\bimprobable\b",
    r"\bundecided\b",
    r"\bundetermined\b",
    r"\bundecisive\b",
    r"\bhesitant\b",
    r"\breasonable\b",
    r"\bintelligibly\b",
    
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
    r"\bk\b",
    r"\byou see\b",
    r"\bi mean\b",
    r"\bas i was saying\b",
    r"\bas i said\b",
    r"\bback to\b",
    r"\bback to business\b",
    r"\bspeaking of which\b",
    r"\bgetting back to\b",
    r"\bin any case\b",
    r"\bfurthermore\b",
    r"\bmoreover\b",
    r"\bboth sides\b",
    r"\bbesides\b",
    r"\bhowever\b",
    r"\bnevertheless\b",
    r"\bstill\b",
    r"\bthen again\b",
    r"\bon the other hand\b",
    r"\bconversely\b",
    r"\bconsequently\b",
    r"\btherefore\b",
    r"\bthus\b",
    r"\bhence\b",
    r"\baccordingly\b",
    r"\bgranted\b",
    r"\badmittedly\b",
    r"\bas a matter of fact\b",
    r"\bbelieve it or not\b",
    r"\bcome to think of it\b",
    r"\bnow that i think about it\b",
    r"\bfunny you should mention\b",
    r"\bthat reminds me\b",
    r"\balong the same lines\b",
    r"\balong similar lines\b",
    r"\bas it turns out\b",
    r"\bit turns out\b",
    r"\bincidentally\b",
    r"\bby the by\b",
    r"\bthe other day\b",
    r"\byou know what\b",
    r"\bi'll tell you what\b",
    r"\blet me tell you\b",
    r"\bwhat i mean is\b",
    r"\bwhat i'm getting at\b",
    r"\bwhat i'm trying to say\b",
    r"\bwhat i'm saying is\b",
    r"\bthe thing is\b",
    r"\bthe thing about it\b",
    r"\bthe problem is\b",
    r"\bthe issue is\b",
    r"\bthe point is\b",
    r"\bwhat happened was\b",
    r"\bhere's the thing\b",
    r"\bhere's what i think\b",
    r"\bacross the board\b",
    r"\bfor the record\b",
    r"\bon record\b",
    r"\bi'm not gonna lie\b",
    r"\bi'm being real\b",
    r"\bi'm being honest\b",
    r"\breal talk\b",
    r"\bfor real\b",
    r"\bno cap\b",
    r"\bno lie\b",
    r"\bno joke\b",
    r"\bit's not a joke\b",
    r"\bspeaking frankly\b",
    r"\bfrankly speaking\b",
    r"\bfrankly\b",
    r"\bto be frank\b",
    r"\bif we're being honest\b",
    r"\bif i'm being honest\b",
    r"\bif we're being real\b",
    r"\bcall it what you want\b",
    r"\bcall it what it is\b",
    r"\byou might say\b",
    r"\bone could say\b",
    r"\bso to speak\b",
    r"\bif you will\b",
    r"\bper se\b",
    r"\bin effect\b",
    r"\beffectively\b",
    r"\bin essence\b",
    r"\bin short\b",
    r"\bin brief\b",
    r"\bin a nutshell\b",
    r"\bin a word\b",
    r"\bin essence\b",
    r"\bfrom what i gather\b",
    r"\bfrom what i understand\b",
    r"\bfrom what i can tell\b",
    r"\bas far as i can tell\b",
    r"\bthe way i see it\b",
    r"\bthe way i figure it\b",
    r"\bonce more\b",
    r"\byet once more\b",
    r"\bquite a bit\b",
    r"\ba lot\b",
    r"\ba fair amount\b",
    r"\bquite a lot\b",
    r"\bincredibly\b",
    r"\bawesome\b",
    r"\bamazing\b",
    r"\bterribly\b",
    r"\bawfully\b",
    r"\bvastly\b",
    r"\bintelligently\b",
    r"\bwisely\b",
    r"\bfoolishly\b",
    r"\bstupidly\b",
    r"\bsadly\b",
    r"\bunfortunately\b",
    r"\bfunnily\b",
    r"\binterestingly\b",
    r"\bfascinating\b",
    r"\bcuriously\b",
    r"\bremarkably\b",
    r"\bstrikingly\b",
    r"\bcompletely\b",
    r"\bentirely\b",
    r"\btotally\b",
    r"\bwholly\b",
    r"\bung completely\b",
    r"\bunquestionably\b",
    r"\bundoubtedly\b",
    r"\bindubitably\b",
    r"\bincontrovertibly\b",
    r"\bperiod\b",
    r"\bend of story\b",
    r"\bodds are\b",
    r"\bliterally every\b",
    r"\bquite frankly\b",
    r"\btruthfully\b",
    r"\bwithout doubt\b",
    r"\bwithout a doubt\b",
    r"\bfor sure\b",
    r"\bfor certain\b",
    
    # Obvious filler phrases
    r"\bfor some reason\b",
    r"\bfor whatever reason\b",
    r"\bfor no particular reason\b",
    r"\bat least\b",
    r"\bat most\b",
    r"\broughly\b",
    r"\baround\b",
    r"\bapproximately\b",
    r"\bsomewhat\b",
    r"\bfrankly\b",
    r"\bto be honest\b",
    r"\bif i'm honest\b",
    r"\bif we're being honest\b",
    r"\bnow that i think about it\b",
    r"\bcome to think of it\b",
    r"\bcall me crazy\b",
    r"\bi don't know\b",
    r"\bhow shall i put it\b",
    r"\bjust\b",
    r"\bquickly\b",
    r"\bmerely\b",
    r"\bonly\b",
    r"\bpure\b",
    r"\bpurely\b",
    r"\bdirect\b",
    r"\bdirectly\b",
]

# Structural words to preserve (these should almost never be removed)
PROTECTED_WORDS = {
    "not", "no", "never", "nor", "or", "and", "but", "because", "since",
    "although", "though", "while", "if", "when", "where", "why", "how",
    "who", "what", "which", "whoever", "whatever", "whichever",
    "they", "them", "their", "you", "your", "we", "us", "our", "i", "me", "my",
    "he", "him", "his", "she", "her", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "should", "could", "can",
    "may", "might", "must", "shall", "all", "only", "just", "both", "each", "either",
    "any", "every", "as", "than", "then", "from", "to", "in", "on", "at", "by", "of",
    "with", "without", "about", "into", "through", "during", "before", "after", "above",
    "below", "up", "down", "that", "which", "this", "these", "those", "the", "a", "an",
}


def normalize_text(text: str) -> str:
    """Normalize whitespace and clean up text."""
    text = text.strip()
    text = re.sub(r"\s+", " ", text)
    return text


def detect_vague_phrases(text: str) -> List[str]:
    """
    Detect common vague/filler phrases NOT in the explicit list.
    This catches unknown fillers by pattern characteristics.
    """
    vague_patterns = [
        # Vague temporal references
        r"\b(?:after a while|in a bit|earlier|later|soon|the other day)\b",
        
        # Vague quantity/degree references  
        r"\b(?:a bunch|a ton|loads of|tons of|quite a few|numerous)\b",
        
        # Conversational filler phrases
        r"\b(?:and stuff|and things|or whatever|or something|or anything|and whatnot|or whatnot)\b",
        r"\b(?:i guess you could say|how should i say|let me think|hmm|honestly)\b",
        
        # Self-deprecating/uncertain qualifiers
        r"\b(?:i'm no expert|i'm not sure but|correct me if wrong|not an expert but)\b",
        
        # Rambling continuations
        r"\b(?:moving on|to make long story short|bottom line|in conclusion)\b",
        
        # Emphasized nothing
        r"\b(?:seriously|no kidding|you know what|get this)\b",
        
        # Vague intensifiers in context
        r"\b(?:randomly|randomly selected|totally|completely by chance)\b",
    ]
    
    found_phrases = []
    for pattern in vague_patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            found_phrases.append(match.group())
    
    return list(set(found_phrases))  # Remove duplicates


def remove_redundant_qualifiers(text: str) -> str:
    """Remove redundant qualifiers and clean up formatting."""
    # Pattern: repeated qualifiers
    text = re.sub(r"\b(very|really|so|quite|rather|extremely)\s+\1+\b", r"\1", text, flags=re.IGNORECASE)
    
    # Pattern: multiple question marks/exclamation marks collapsed
    text = re.sub(r"\?{2,}", "?", text)
    text = re.sub(r"!{2,}", "!", text)
    
    # Pattern: multiple dots/ellipsis collapsed
    text = re.sub(r"\.{2,}", ".", text)
    text = re.sub(r"…{2,}", "…", text)
    
    # Pattern: empty or nearly-empty parentheses/brackets
    text = re.sub(r"\(\s*\)", "", text)
    text = re.sub(r"\[\s*\]", "", text)
    
    # Clean up stray commas
    text = re.sub(r"^\s*,", "", text)  # comma at start
    text = re.sub(r",\s*,", ",", text)  # double commas
    
    # Clean up weird spacing patterns
    text = re.sub(r"\s{2,}", " ", text)
    return text


def identify_parenthetical_asides(text: str) -> List[str]:
    """
    Extract text in parentheses/brackets - often these are off-topic asides
    and can be optionally removed or flagged.
    Returns list of aside fragments found.
    """
    asides = re.findall(r"\([^)]*\)", text)
    return asides


def remove_phrase_patterns(text: str) -> str:
    """Remove filler phrases while preserving structure."""
    for pattern in PHRASE_PATTERNS:
        text = re.sub(pattern, " ", text, flags=re.IGNORECASE)
    return normalize_text(text)


def remove_light_stopwords(text: str) -> str:
    """Remove light stopwords but protect essential words."""
    words = text.split()
    cleaned = []
    for word in words:
        # Keep all words - don't aggressively remove
        if word.lower() not in PROTECTED_WORDS:
            cleaned.append(word)
        else:
            cleaned.append(word)  # Keep protected words
    return " ".join(cleaned)


def smart_deduplicate(text: str, max_repeats: int = 1) -> str:
    """Remove repeated adjacent words and phrases."""
    words = text.split()
    if not words:
        return text

    # Collapse repeated adjacent single words
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

    # Collapse repeated adjacent phrases of length 2-3
    for phrase_len in (3, 2):
        i = 0
        while i + 2 * phrase_len <= len(words):
            if [w.lower() for w in words[i : i + phrase_len]] == [w.lower() for w in words[i + phrase_len : i + 2 * phrase_len]]:
                del words[i + phrase_len : i + 2 * phrase_len]
            else:
                i += 1

    return " ".join(words)


def extract_core_request(text: str) -> str:
    """Extract the core request by identifying Q&A markers and context keywords."""
    # Look for explicit request markers
    markers = [
        r"(?:can you|could you|would you|please|explain|how\s+(?:do|can)|what\s+is|tell me)\b",
        r"(?:question|ask|want to know|wondering|curious)\b"
    ]
    
    # Find positions of these markers
    positions = []
    for marker in markers:
        for match in re.finditer(marker, text, re.IGNORECASE):
            positions.append(match.start())
    
    if positions:
        # Start extraction from first marker
        start = min(positions)
        return text[start:]
    return text


def remove_off_topic_asides(text: str, remove_asides: bool = True) -> Tuple[str, List[str]]:
    """
    Identify and optionally remove off-topic parenthetical content.
    Returns (cleaned_text, list_of_removed_asides).
    """
    # Keywords that indicate dismissible asides
    aside_keywords = [
        "ignore", "forget", "skip", "don't mind", "disregard",
        "not sure if", "not that", "not important", "random", 
        "by the way", "tangent", "aside", "never mind"
    ]
    
    asides = re.findall(r"\([^)]*\)", text)
    removed_asides = []
    
    for aside in asides:
        # Check if aside contains dismissal keywords
        if any(keyword in aside.lower() for keyword in aside_keywords):
            removed_asides.append(aside)
            # Remove the aside (always remove if it matches)
            text = text.replace(aside, "", 1)  # Remove first occurrence
    
    return normalize_text(text), removed_asides


def optimize_prompt(prompt: str, aggressive: bool = False, remove_asides: bool = True) -> str:
    """
    Optimize a prompt by removing fillers while preserving meaning.
    
    Args:
        prompt: The prompt text to optimize
        aggressive: If True, also remove light stopwords (experimental)
        remove_asides: If True, remove off-topic parenthetical asides (default: True)
    
    Returns:
        Optimized prompt
    """
    prompt = normalize_text(prompt)
    
    # Remove off-topic asides first (before other processing)
    prompt, _ = remove_off_topic_asides(prompt, remove_asides=remove_asides)
    
    # Remove explicitly listed phrases
    prompt = remove_phrase_patterns(prompt)
    
    # Remove vague/unknown filler phrases detected by pattern
    for vague_phrase in detect_vague_phrases(prompt):
        prompt = re.sub(re.escape(vague_phrase), " ", prompt, flags=re.IGNORECASE)
    
    # Remove redundant qualifiers and clean up formatting
    prompt = remove_redundant_qualifiers(prompt)
    
    if aggressive:
        prompt = remove_light_stopwords(prompt)
    
    prompt = smart_deduplicate(prompt, max_repeats=1)
    
    # Final cleanup pass
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
