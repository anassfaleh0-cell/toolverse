"use client";

import { useState, useRef, type ReactNode } from "react";
import { Button, Alert, Card } from "@/components/ui";
import { Icon } from "@/components/shared/icon";

const synonyms: Record<string, string[]> = {
  "good": ["excellent", "superb", "outstanding", "quality", "fine"],
  "bad": ["poor", "inferior", "substandard", "unsatisfactory", "deficient"],
  "big": ["large", "substantial", "considerable", "significant", "massive"],
  "small": ["tiny", "compact", "diminutive", "minor", "petite"],
  "fast": ["quick", "rapid", "swift", "speedy", "brisk"],
  "slow": ["gradual", "leisurely", "unhurried", "sluggish", "plodding"],
  "new": ["fresh", "novel", "modern", "recent", "contemporary"],
  "old": ["ancient", "vintage", "antique", "aged", "elderly"],
  "important": ["crucial", "vital", "essential", "critical", "paramount"],
  "happy": ["delighted", "pleased", "content", "joyful", "elated"],
  "sad": ["unhappy", "melancholy", "sorrowful", "downcast", "gloomy"],
  "hard": ["difficult", "challenging", "demanding", "tough", "arduous"],
  "easy": ["simple", "straightforward", "effortless", "basic", "painless"],
  "help": ["assist", "aid", "support", "facilitate", "guide"],
  "use": ["utilize", "employ", "leverage", "apply", "harness"],
  "make": ["create", "produce", "craft", "generate", "assemble"],
  "change": ["modify", "adjust", "alter", "transform", "reshape"],
  "think": ["believe", "consider", "deem", "reckon", "presume"],
  "show": ["demonstrate", "illustrate", "display", "indicate", "reveal"],
  "need": ["require", "necessitate", "demand", "call for"],
  "get": ["obtain", "acquire", "secure", "attain", "procure"],
  "give": ["provide", "offer", "supply", "furnish", "deliver"],
  "start": ["begin", "commence", "initiate", "launch", "embark on"],
  "end": ["conclude", "finish", "terminate", "complete", "cease"],
  "first": ["primary", "initial", "foremost", "premier"],
  "last": ["final", "ultimate", "concluding", "closing"],
  "many": ["numerous", "countless", "abundant", "plentiful", "copious"],
  "some": ["several", "certain", "various", "assorted"],
  "very": ["extremely", "exceptionally", "remarkably", "immensely", "intensely"],
  "really": ["truly", "genuinely", "honestly", "sincerely"],
  "always": ["constantly", "consistently", "perpetually", "incessantly"],
  "never": ["rarely", "seldom", "hardly ever", "infrequently"],
  "great": ["wonderful", "magnificent", "splendid", "terrific", "marvelous"],
  "terrible": ["awful", "horrible", "dreadful", "appalling", "atrocious"],
  "beautiful": ["gorgeous", "stunning", "breathtaking", "lovely", "exquisite"],
  "ugly": ["unsightly", "hideous", "unattractive", "grotesque", "repulsive"],
  "strong": ["powerful", "robust", "sturdy", "formidable", "resilient"],
  "weak": ["fragile", "feeble", "frail", "delicate", "vulnerable"],
  "interesting": ["fascinating", "compelling", "engaging", "captivating", "intriguing"],
  "boring": ["tedious", "mundane", "dreary", "monotonous", "dull"],
  "smart": ["intelligent", "brilliant", "clever", "sharp", "astute"],
  "stupid": ["foolish", "ridiculous", "absurd", "senseless", "preposterous"],
  "rich": ["wealthy", "affluent", "prosperous", "well-off", "opulent"],
  "poor": ["needy", "impoverished", "destitute", "deprived", "penniless"],
  "funny": ["humorous", "amusing", "entertaining", "comical", "witty"],
  "strange": ["peculiar", "unusual", "odd", "bizarre", "uncanny"],
  "true": ["accurate", "correct", "precise", "genuine", "authentic"],
  "false": ["fake", "bogus", "fraudulent", "deceptive", "spurious"],
  "sure": ["certain", "confident", "positive", "assured", "convinced"],
  "maybe": ["perhaps", "possibly", "potentially", "conceivably"],
  "often": ["frequently", "regularly", "commonly", "routinely", "habitually"],
  "rarely": ["seldom", "infrequently", "occasionally", "sporadically"],
  "soon": ["shortly", "presently", "momentarily", "before long"],
  "late": ["tardy", "belated", "overdue", "delayed", "behind schedule"],
  "early": ["premature", "untimely", "advance", "ahead of time"],
  "right": ["correct", "proper", "appropriate", "suitable", "fitting"],
  "wrong": ["incorrect", "invalid", "erroneous", "mistaken", "flawed"],
  "clear": ["obvious", "apparent", "evident", "transparent", "unambiguous"],
  "vague": ["ambiguous", "unclear", "obscure", "nebulous", "indistinct"],
  "try": ["attempt", "endeavor", "strive", "undertake", "essay"],
  "keep": ["retain", "preserve", "maintain", "sustain", "uphold"],
  "take": ["grasp", "seize", "capture", "extract", "withdraw"],
  "put": ["place", "position", "set", "deposit", "arrange"],
  "look": ["observe", "examine", "survey", "scrutinize", "inspect"],
  "find": ["discover", "locate", "unearth", "detect", "ferret out"],
  "tell": ["inform", "notify", "advise", "apprise", "brief"],
  "ask": ["inquire", "question", "query", "solicit", "interrogate"],
  "know": ["comprehend", "understand", "grasp", "fathom", "discern"],
  "like": ["appreciate", "admire", "cherish", "relish", "savor"],
  "love": ["adore", "treasure", "idolize", "cherish", "worship"],
  "hate": ["detest", "loathe", "abhor", "despise", "revile"],
  "want": ["desire", "crave", "wish", "covet", "yearn for"],
  "work": ["labor", "toil", "operate", "function", "perform"],
  "play": ["engage", "frolic", "recreate", "amuse oneself"],
  "move": ["shift", "relocate", "transfer", "transport", "displace"],
  "stop": ["halt", "cease", "discontinue", "desist", "refrain"],
  "wait": ["linger", "delay", "hesitate", "pause", "bide"],
  "answer": ["respond", "reply", "retort", "rejoin", "counter"],
  "call": ["summon", "contact", "ring", "telephone", "page"],
  "come": ["arrive", "approach", "appear", "materialize", "emerge"],
  "go": ["proceed", "depart", "travel", "venture", "head"],
  "run": ["sprint", "dash", "hasten", "scamper", "bolt"],
  "walk": ["stroll", "saunter", "march", "stride", "amble"],
  "talk": ["speak", "converse", "discuss", "communicate", "chat"],
  "eat": ["consume", "devour", "ingest", "partake", "dine on"],
  "drink": ["sip", "gulp", "quaff", "imbibe", "swallow"],
  "build": ["construct", "erect", "assemble", "fabricate", "forge"],
  "destroy": ["demolish", "annihilate", "raze", "devastate", "wreck"],
  "open": ["unlock", "unseal", "unlatch", "crack", "breach"],
  "close": ["shut", "seal", "fasten", "secure", "lock"],
  "difficult": ["challenging", "demanding", "laborious", "strenuous", "formidable"],
  "simple": ["basic", "elementary", "uncomplicated", "rudimentary", "plain"],
  "special": ["unique", "distinctive", "remarkable", "notable", "exceptional"],
  "normal": ["ordinary", "standard", "typical", "conventional", "routine"],
  "possible": ["feasible", "viable", "attainable", "achievable", "practicable"],
  "probable": ["likely", "plausible", "credible", "reasonable", "anticipated"],
  "necessary": ["essential", "indispensable", "requisite", "mandatory", "compulsory"],
  "sudden": ["abrupt", "unexpected", "precipitous", "hasty", "swift"],
  "brave": ["courageous", "fearless", "valiant", "gallant", "heroic"],
  "calm": ["serene", "tranquil", "peaceful", "composed", "placid"],
  "honest": ["truthful", "sincere", "frank", "candid", "forthright"],
  "lazy": ["indolent", "sluggish", "idle", "inactive", "listless"],
  "nervous": ["anxious", "uneasy", "apprehensive", "restless", "jittery"],
  "proud": ["vain", "arrogant", "conceited", "haughty", "smug"],
  "shy": ["timid", "bashful", "reserved", "reticent", "withdrawn"],
  "angry": ["furious", "irate", "enraged", "indignant", "incensed"],
  "tired": ["exhausted", "weary", "fatigued", "drained", "spent"],
  "hungry": ["famished", "ravenous", "starving", "peckish", "voracious"],
  "thirsty": ["parched", "dehydrated", "dry", "arid"],
  "cold": ["chilly", "frigid", "frosty", "icy", "glacial"],
  "hot": ["scorching", "sweltering", "blazing", "torrid", "sizzling"],
};

const formalOverrides: Record<string, string[]> = {
  "use": ["utilize", "employ", "leverage"],
  "help": ["assist", "be of assistance", "facilitate"],
  "get": ["obtain", "procure", "acquire"],
  "start": ["commence", "initiate", "embark upon"],
  "end": ["conclude", "terminate", "cease"],
  "show": ["demonstrate", "exhibit", "manifest"],
  "tell": ["inform", "notify", "apprise"],
  "ask": ["inquire", "request", "solicit"],
  "try": ["endeavor", "attempt", "seek to"],
  "buy": ["purchase", "acquire", "procure"],
  "enough": ["sufficient", "adequate", "ample"],
  "about": ["approximately", "concerning", "regarding"],
  "way": ["method", "approach", "manner"],
  "job": ["position", "occupation", "capacity"],
  "group": ["collective", "cohort", "assemblage"],
  "part": ["component", "constituent", "segment"],
  "thing": ["matter", "element", "entity"],
  "people": ["individuals", "persons", "parties"],
  "now": ["presently", "at this time", "currently"],
  "then": ["subsequently", "thereupon", "afterward"],
  "so": ["therefore", "accordingly", "consequently"],
  "but": ["however", "nevertheless", "nonetheless"],
  "also": ["furthermore", "additionally", "moreover"],
  "too": ["excessively", "overly", "unduly"],
  "a lot": ["substantially", "considerably", "significantly"],
};

const simplifyMap: Record<string, string[]> = {
  "utilize": ["use"],
  "utilizing": ["using"],
  "utilized": ["used"],
  "demonstrate": ["show"],
  "demonstrates": ["shows"],
  "demonstrated": ["showed"],
  "necessitate": ["need"],
  "necessitates": ["needs"],
  "constitute": ["form", "make up"],
  "constitutes": ["forms"],
  "terminate": ["end"],
  "terminated": ["ended"],
  "terminating": ["ending"],
  "initiate": ["start"],
  "initiated": ["started"],
  "initiating": ["starting"],
  "commence": ["start", "begin"],
  "commenced": ["started"],
  "endeavor": ["try"],
  "endeavored": ["tried"],
  "facilitate": ["help"],
  "facilitates": ["helps"],
  "facilitated": ["helped"],
  "implement": ["carry out", "do"],
  "implementation": ["use", "setup"],
  "subsequently": ["then", "later"],
  "consequently": ["so"],
  "additionally": ["also", "plus"],
  "furthermore": ["also"],
  "nevertheless": ["but", "still"],
  "notwithstanding": ["despite", "even so"],
  "approximately": ["about", "around"],
  "sufficient": ["enough"],
  "insufficient": ["not enough"],
  "acquire": ["get"],
  "acquired": ["got"],
  "procure": ["get"],
  "procured": ["got"],
  "assistance": ["help"],
  "assist": ["help"],
  "assisted": ["helped"],
  "obtain": ["get"],
  "obtained": ["got"],
  "purchase": ["buy"],
  "purchased": ["bought"],
  "reside": ["live"],
  "residence": ["home"],
  "residential": ["home"],
  "numerous": ["many", "a lot of"],
  "abundant": ["plenty of", "a lot of"],
  "extremely": ["very"],
  "exceptionally": ["very"],
  "extraordinarily": ["very"],
  "remarkably": ["very"],
  "scorching": ["very hot"],
  "frigid": ["very cold"],
  "adore": ["love"],
  "desire": ["want"],
  "crave": ["want badly"],
  "inquire": ["ask"],
  "observe": ["see", "watch"],
  "examine": ["check", "look at"],
  "demolish": ["destroy", "knock down"],
  "construct": ["build"],
  "substantial": ["large", "big"],
  "significant": ["big", "important"],
  "magnificent": ["great", "wonderful"],
  "courageous": ["brave"],
  "treacherous": ["dangerous"],
  "virtuous": ["good", "moral"],
  "eloquent": ["well-spoken"],
  "impecunious": ["poor", "broke"],
  "ameliorate": ["improve", "make better"],
  "perpetuate": ["continue", "keep going"],
  "ubiquitous": ["everywhere", "common"],
  "plethora": ["lot", "many"],
  "ephemeral": ["short-lived", "brief"],
  "recalcitrant": ["stubborn"],
  "pragmatic": ["practical"],
  "tenacious": ["determined"],
  "meticulous": ["careful"],
  "fastidious": ["picky", "fussy"],
  "gregarious": ["sociable", "outgoing"],
  "laconic": ["brief", "short"],
  "prolific": ["productive"],
  "resilient": ["strong", "tough"],
  "prudent": ["wise", "careful"],
  "astute": ["sharp", "smart"],
  "diligent": ["hardworking"],
  "precarious": ["unstable", "risky"],
  "profound": ["deep", "deeply"],
  "stringent": ["strict"],
  "ambiguous": ["unclear"],
  "comprehensive": ["complete", "full"],
  "contemplate": ["think about", "consider"],
  "enumerate": ["list", "count"],
  "extrapolate": ["guess", "estimate"],
  "hypothesize": ["guess", "suggest"],
  "identify": ["find", "point out"],
  "illustrate": ["show", "explain"],
  "incorporate": ["include"],
  "indicate": ["show", "point to"],
  "interpret": ["explain", "understand"],
  "modify": ["change"],
  "monitor": ["track", "watch"],
  "substitute": ["replace"],
  "verify": ["check"],
  "compensate": ["pay", "make up for"],
  "accumulate": ["build up", "gather"],
  "allocate": ["assign", "give out"],
  "appraise": ["value", "judge"],
  "articulate": ["express", "say clearly"],
  "scrutinize": ["examine closely", "check"],
  "collaborate": ["work together"],
  "consolidate": ["combine", "merge"],
  "customize": ["personalize", "tailor"],
  "delegate": ["assign", "hand off"],
  "differentiate": ["tell apart", "distinguish"],
  "disseminate": ["spread", "share"],
  "diversify": ["vary", "mix"],
  "elaborate": ["detail", "explain more"],
  "evaluate": ["assess", "judge", "weigh"],
};

const creativeExtra: Record<string, string[]> = {
  "walk": ["saunter", "meander", "traipse", "amble", "wander"],
  "talk": ["chatter", "gab", "prattle", "converse", "yak"],
  "look": ["gaze", "peer", "glance", "ogle", "sneak a peek"],
  "eat": ["devour", "gobble", "wolf down", "savor"],
  "good": ["splendid", "first-rate", "tip-top", "sublime", "stellar"],
  "big": ["colossal", "gargantuan", "enormous", "immense", "mammoth"],
  "small": ["wee", "bitty", "microscopic", "diminutive", "petite"],
  "bad": ["lousy", "crummy", "abysmal", "dreadful", "execrable"],
  "run": ["scoot", "dart", "scamper", "hightail", "book it"],
  "happy": ["ecstatic", "thrilled", "overjoyed", "blissful", "on cloud nine"],
  "sad": ["crestfallen", "despondent", "woebegone", "heartbroken", "grief-stricken"],
  "fast": ["lightning", "blistering", "breakneck", "whirlwind"],
  "new": ["spanking", "brand-new", "state-of-the-art", "cutting-edge"],
  "old": ["decrepit", "timeworn", "antiquated", "long in the tooth"],
};

const adverbs = [
  "consequently", "meanwhile", "however", "therefore", "furthermore",
  "moreover", "nevertheless", "nonetheless", "additionally", "besides",
  "thus", "hence", "accordingly", "notably", "importantly",
];

const beVerbs = new Set(["am", "is", "are", "was", "were", "been", "being", "be"]);

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getWordReplacement(
  word: string,
  mode: string,
  rng: number,
): string | null {
  const clean = word.replace(/^[^a-zA-Z]*|[^a-zA-Z]*$/g, "").toLowerCase();
  if (clean.length < 2) return null;

  let candidates: string[] | undefined;

  if (mode === "simplify") {
    candidates = simplifyMap[clean];
    if (candidates) {
      const syn = pickRandom(candidates);
      return preserveCase(word, clean, syn);
    }
  }

  if (mode === "formal") {
    candidates = formalOverrides[clean];
    if (!candidates) candidates = synonyms[clean];
  } else if (mode === "creative") {
    candidates = creativeExtra[clean];
    if (!candidates) candidates = synonyms[clean];
  } else {
    candidates = synonyms[clean];
  }

  if (!candidates || candidates.length === 0) return null;
  const syn = pickRandom(candidates);
  return preserveCase(word, clean, syn);
}

function preserveCase(original: string, lower: string, replacement: string): string {
  if (original === lower) return replacement;
  if (original === capitalize(lower)) return capitalize(replacement);
  if (original === lower.toUpperCase()) return replacement.toUpperCase();
  return replacement;
}

function getReadability(text: string): number {
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (words.length === 0 || sentences.length === 0) return 0;

  const totalSyllables = words.reduce((sum, w) => {
    const syllables = w.replace(/[aeiouy]{2,}/g, "x").replace(/[^aeiouy]/g, "").length || 1;
    return sum + syllables;
  }, 0);

  const avgWordLen = words.reduce((s, w) => s + w.length, 0) / words.length;
  const avgSentenceLen = words.length / sentences.length;
  const avgSyllables = totalSyllables / words.length;

  let score = 206.835 - 1.015 * avgSentenceLen - 84.6 * avgSyllables;
  score = Math.max(0, Math.min(100, score));
  return Math.round(score);
}

function getReadabilityLabel(score: number): string {
  if (score >= 90) return "Very Easy";
  if (score >= 70) return "Easy";
  if (score >= 50) return "Fairly Easy";
  if (score >= 40) return "Standard";
  if (score >= 30) return "Fairly Difficult";
  if (score >= 10) return "Difficult";
  return "Very Difficult";
}

function splitLongSentence(sentence: string, maxWords = 25): string[] {
  const words = sentence.split(/\s+/);
  if (words.length <= maxWords) return [sentence];

  const clauses = sentence.split(/\b(and|or|but|so|yet|because|however|therefore|consequently|meanwhile|furthermore|moreover|additionally)\b/i);
  if (clauses.length >= 4) {
    const mid = Math.ceil(clauses.length / 2);
    const first = clauses.slice(0, mid).join("");
    const second = clauses.slice(mid).join("");
    if (first.split(/\s+/).length >= 5 && second.split(/\s+/).length >= 5) {
      return [first.trim(), second.trim()];
    }
  }

  const mid = Math.ceil(words.length / 2);
  const first = words.slice(0, mid).join(" ");
  const second = words.slice(mid).join(" ");
  return [first.trim(), second.trim()];
}

function moveAdverb(sentence: string): string {
  const advPattern = new RegExp(
    `\\b(${adverbs.join("|")})\\b`,
    "i",
  );
  const match = sentence.match(advPattern);
  if (!match) return sentence;

  const adv = match[1];
  const idx = sentence.toLowerCase().indexOf(adv.toLowerCase());
  if (idx < 3) return sentence;

  const before = sentence.slice(0, idx).trim();
  const after = sentence.slice(idx + adv.length).trim();
  if (before.length < 3 || after.length < 3) return sentence;

  return `${capitalize(adv)}, ${before} ${after}`;
}

function flipVoice(sentence: string): string {
  const activePattern = /^(.+?)\s+(verb\w*|attack\w*|write\w*|make\w*|create\w*|build\w*|take\w*|give\w*|send\w*|show\w*|tell\w*|ask\w*|help\w*|call\w*|find\w*|use\w*|follow\w*|hold\w*|keep\w*|set\w*|put\w*|bring\w*|buy\w*|pay\w*|produce\w*|perform\w*|develop\w*|support\w*|include\w*|provide\w*|offer\w*|require\w*)\s+(.+)$/i;
  const passiveMatch = sentence.match(/^(.+?)\s+(?:was|were|is|are|been|being)\s+(\w+ed|\w+en|\w+t)\s+by\s+(.+)$/i);

  if (passiveMatch) {
    const subject = passiveMatch[3].trim();
    const verb = passiveMatch[2].trim();
    const obj = passiveMatch[1].trim();
    const aux = sentence.match(/\b(was|were|is|are)\b/i)?.[1]?.toLowerCase() || "was";
    const tenses: Record<string, string> = {
      "is": tensesMap(verb, "s"),
      "are": tensesMap(verb, ""),
      "was": tensesMap(verb, "ed"),
      "were": tensesMap(verb, "ed"),
    };
    const newVerb = tenses[aux] || verb;
    const active = `${subject} ${newVerb} ${obj}`;
    if (active.split(/\s+/).length > 4) return active;
    return sentence;
  }

  const simpleActive = sentence.match(/^(.+?)\s+(.+?)\s+(.+)$/);
  if (!simpleActive) return sentence;

  const subject = simpleActive[1];
  const verb = simpleActive[2];
  const obj = simpleActive[3];

  const allBe = Array.from(beVerbs).join("|");
  if (new RegExp(`\\b(${allBe})\\b`, "i").test(subject + " " + verb)) return sentence;
  if (new RegExp(`\\b(${allBe})\\b`, "i").test(verb)) return sentence;
  if (obj.split(/\s+/).length < 3) return sentence;

  const be = subject.match(/\b(he|she|it|the)\b/i) ? "is" : "are";
  const past = verb.replace(/e$/, "").replace(/[^aeiou]{2,}$/, (m) => m + "e").replace(/([^aeiou])$/, "$1e") + "d";
  const passive = `${obj} ${be} ${past} by ${subject}`;
  if (passive.split(/\s+/).length < 5) return sentence;
  return passive;
}

function tensesMap(verb: string, suffix: string): string {
  if (suffix === "ed") {
    if (verb.endsWith("e")) return verb + "d";
    if (/[^aeiou][aeiou][^aeiou]$/i.test(verb) && !verb.endsWith("w") && !verb.endsWith("x")) return verb + verb.slice(-1) + "ed";
    return verb + "ed";
  }
  if (suffix === "s") {
    if (verb.endsWith("s") || verb.endsWith("sh") || verb.endsWith("ch") || verb.endsWith("x") || verb.endsWith("o")) return verb + "es";
    if (verb.endsWith("y") && !/[aeiou]/.test(verb[verb.length - 2])) return verb.slice(0, -1) + "ies";
    return verb + "s";
  }
  return verb;
}

function changeSentence_voice(sentence: string): string {
  if (Math.random() > 0.4) return sentence;
  return flipVoice(sentence);
}

function paraphraseText(text: string, mode: string, intensity: number): { result: string; changes: number; changedWords: Set<number> } {
  const sentences = text.match(/[^.!?\n]+[.!?]*/g)?.map(s => s.trim()).filter(Boolean) || [text];
  const replacementRate = 0.15 + (intensity - 1) * 0.1125;
  let totalChanges = 0;
  const changedWordIndices = new Set<number>();
  let globalWordIdx = 0;

  const processed = sentences.flatMap(sentence => {
    let current = sentence;

    if (mode === "simplify") {
      const split = splitLongSentence(current);
      if (split.length > 1) {
        return split.map(s => ({ text: s, offset: 0 }));
      }
    }

    if (mode === "creative" && Math.random() > 0.6) {
      current = moveAdverb(current);
    }
    if ((mode === "formal" || mode === "creative") && Math.random() > 0.7) {
      current = flipVoice(current);
    }

    const splitSentences = mode === "simplify" ? splitLongSentence(current) : [current];
    return splitSentences.map(s => ({ text: s, offset: 0 }));
  });

  const final = processed.map(({ text }) => {
    const words = text.split(/(\s+)/);
    const replaced = words.map(w => {
      const isWord = /[a-zA-Z]/.test(w);
      if (!isWord) return w;

      globalWordIdx++;
      if (Math.random() > replacementRate) return w;

      const replacement = getWordReplacement(w, mode, Math.random());
      if (replacement && replacement !== w.replace(/^[^a-zA-Z]*|[^a-zA-Z]*$/g, "").toLowerCase()) {
        totalChanges++;
        changedWordIndices.add(globalWordIdx);
        const prefix = w.match(/^[^a-zA-Z]*/)?.[0] || "";
        const suffix = w.match(/[^a-zA-Z]*$/)?.[0] || "";
        return prefix + replacement + suffix;
      }
      return w;
    }).join("");

    return replaced;
  }).join(" ");

  return { result: final, changes: totalChanges, changedWords: changedWordIndices };
}

export function ParaphrasingTool() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("Standard");
  const [intensity, setIntensity] = useState(3);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [changes, setChanges] = useState(0);
  const [changedWords, setChangedWords] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const [originalChangedWords, setOriginalChangedWords] = useState<Set<number>>(new Set());

  async function handleParaphrase() {
    const trimmed = input.trim();
    if (trimmed.length < 10) {
      setError("Please enter at least 10 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { result, changes: ch, changedWords: cw } = paraphraseText(
        trimmed,
        mode.toLowerCase(),
        intensity,
      );
      setOutput(result);
      setChanges(ch);
      setChangedWords(cw);
      setCopied(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during paraphrasing.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "paraphrased.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setInput("");
    setOutput("");
    setError("");
    setChanges(0);
    setChangedWords(new Set());
    setOriginalChangedWords(new Set());
    setCopied(false);
  }

  const inputWordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const outputWordCount = output.trim() ? output.trim().split(/\s+/).length : 0;
  const inputReadability = input.trim() ? getReadability(input.trim()) : 0;
  const outputReadability = output.trim() ? getReadability(output.trim()) : 0;

  function highlightDiff(text: string): ReactNode[] {
    const words = text.split(/(\s+)/);
    return words.map((w, i) => {
      if (changedWords.has(i)) {
        return (
          <span key={i} className="bg-green-100 dark:bg-green-900/30 rounded px-0.5">
            {w}
          </span>
        );
      }
      return <span key={i}>{w}</span>;
    });
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Text to Paraphrase
          </label>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(""); }}
            placeholder="Paste or type your text here (minimum 10 characters)..."
            rows={6}
            className="w-full rounded-lg border bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:ring-blue-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400"
            >
              <option value="Standard">Standard</option>
              <option value="Formal">Formal</option>
              <option value="Creative">Creative</option>
              <option value="Simplify">Simplify</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Intensity: {intensity}
            </label>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full accent-nuvora-600"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-0.5">
              <span>Mild</span>
              <span>Aggressive</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleParaphrase} disabled={loading || input.trim().length < 10} variant="primary" size="md">
            {loading ? "Paraphrasing..." : "Paraphrase"}
          </Button>
          <Button onClick={handleReset} disabled={!input && !output} variant="ghost" size="md">
            Clear
          </Button>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" className="opacity-75" />
            </svg>
            Analyzing and paraphrasing your text...
          </div>
        )}

        {error && <Alert variant="error">{error}</Alert>}
      </div>

      {output && (
        <div ref={resultRef} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card variant="default" className="p-5">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4 text-zinc-400"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                Original
              </h3>
              <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {input}
              </div>
            </Card>

            <Card variant="default" className="p-5">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4 text-blue-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Paraphrased
              </h3>
              <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {highlightDiff(output)}
              </div>
            </Card>
          </div>

          <Card variant="default" className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{inputWordCount}</div>
                <div className="text-xs text-zinc-500">Original Words</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{outputWordCount}</div>
                <div className="text-xs text-zinc-500">Paraphrased Words</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{changes}</div>
                <div className="text-xs text-zinc-500">Changes Made</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{outputReadability}</div>
                <div className="text-xs text-zinc-500">Readability Score</div>
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="text-xs text-zinc-400">
                Original readability: {inputReadability} ({getReadabilityLabel(inputReadability)}) &rarr;
                Paraphrased: {outputReadability} ({getReadabilityLabel(outputReadability)})
              </span>
            </div>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCopy} variant="secondary" size="md">
              {copied ? (
                <span className="flex items-center gap-1.5">
                  <Icon name="Check" className="size-4" />
                  Copied!
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Icon name="Copy" className="size-4" />
                  Copy to Clipboard
                </span>
              )}
            </Button>
            <Button onClick={handleDownload} variant="secondary" size="md">
              <span className="flex items-center gap-1.5">
                <Icon name="Download" className="size-4" />
                Download
              </span>
            </Button>
            <Button onClick={handleParaphrase} variant="primary" size="md">
              <span className="flex items-center gap-1.5">
                <Icon name="RefreshCw" className="size-4" />
                Regenerate
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
