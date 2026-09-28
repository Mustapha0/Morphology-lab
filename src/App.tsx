import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Tag,
  Filter,
  Facebook,
  Coffee,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SegmentType = "root" | "prefix" | "suffix" | "infix" | "circumfix" | "other";

interface Segment {
  text: string;
  type: SegmentType;
  meaning?: string;
}

interface ParadigmCell {
  feature: string;
  form: string;
  morphemes: string;
}

interface MorphologyLesson {
  id: string;
  group: string;
  title: string;
  teaser: string;
  theory: string[];
  example: {
    word: string;
    segments?: Segment[];
    paradigm?: ParadigmCell[];
    note: string;
  };
  exercise: {
    instruction: string;
    targetWord: string;
    options: {
      segments: Segment[];
      processLabel: string;
    }[];
    correctIndex: number;
    explanation: string;
  };
}

// ---------------------------------------------------------------------------
// Full Morphology Curriculum Dataset (28 Lessons)
// ---------------------------------------------------------------------------

const MORPHOLOGY_LESSONS: MorphologyLesson[] = [
  // =========================================================================
  // 1. Foundations & Core Concepts
  // =========================================================================
  {
    id: "intro-morphology",
    group: "Foundations & Core Concepts",
    title: "Introduction to Morphology",
    teaser: "Words, internal structure, and the rules governing word formation.",
    theory: [
      "Morphology is the subfield of linguistics that studies the internal structure of words and the rules for combining smaller meaningful units.",
      "Words are not indivisible units; they are composed of morphemes arranged in systematic, rule-governed sequences.",
      "Understanding morphology helps explain how speakers create new words and modify existing ones to express grammatical relationships.",
    ],
    example: {
      word: "unhappiness",
      segments: [
        { text: "un-", type: "prefix", meaning: "not" },
        { text: "happy", type: "root", meaning: "state of joy" },
        { text: "-ness", type: "suffix", meaning: "abstract noun state" },
      ],
      note: "Three distinct components join to create a single complex word. (Spelling change: happy → happi- before -ness.)",
    },
    exercise: {
      instruction: "Identify the correct morphological segmentation for the word 'reorganization':",
      targetWord: "reorganization",
      options: [
        {
          segments: [
            { text: "re-", type: "prefix" },
            { text: "organ", type: "root" },
            { text: "-ize", type: "suffix" },
            { text: "-ation", type: "suffix" },
          ],
          processLabel: "Prefix + Root + Suffix + Suffix",
        },
        {
          segments: [
            { text: "reorganize", type: "root" },
            { text: "-ation", type: "suffix" },
          ],
          processLabel: "Root + Suffix",
        },
        {
          segments: [
            { text: "re-", type: "prefix" },
            { text: "organization", type: "root" },
          ],
          processLabel: "Prefix + Root",
        },
      ],
      correctIndex: 0,
      explanation:
        "'Reorganization' breaks down into four morphemes: prefix [re-], root [organ], verbalizing suffix [-ize], and nominalizing suffix [-ation]. The other options leave complex forms unanalyzed.",
    },
  },
  {
    id: "tokens-types-lexemes",
    group: "Foundations & Core Concepts",
    title: "Tokens, Types, and Lexemes",
    teaser: "Distinguish between raw word tokens, distinct word types, and abstract lexemes.",
    theory: [
      "Tokens represent the total word count in a text instance, including duplicates.",
      "Types count the unique orthographic or phonological word forms present in a sample.",
      "Lexemes are the underlying abstract dictionary entities (e.g., RUN represents run, runs, running, ran).",
    ],
    example: {
      word: "cat, cats, catlike",
      paradigm: [
        { feature: "Lexeme: CAT", form: "cat", morphemes: "Singular form" },
        { feature: "Lexeme: CAT", form: "cats", morphemes: "Plural form (cat + -s)" },
        { feature: "Lexeme: CATLIKE", form: "catlike", morphemes: "Derived adjective (cat + -like)" },
      ],
      note: "'cat' and 'cats' belong to the same lexeme CAT, whereas 'catlike' forms a distinct lexeme.",
    },
    exercise: {
      instruction: "Select the correct analysis for the set: {sing, sings, sang, singer}",
      targetWord: "sing, sings, sang, singer",
      options: [
        {
          segments: [{ text: "4 types, 1 lexeme", type: "other" }],
          processLabel: "Single-lexeme analysis",
        },
        {
          segments: [{ text: "4 types, 2 lexemes (SING and SINGER)", type: "other" }],
          processLabel: "Dual-lexeme analysis",
        },
        {
          segments: [{ text: "1 token, 4 lexemes", type: "other" }],
          processLabel: "Token-dominant analysis",
        },
      ],
      correctIndex: 1,
      explanation:
        "'sing', 'sings', and 'sang' are inflected forms of the lexeme SING. 'singer' is a distinct lexeme derived by agentive suffixation. Each of the four written forms is a different type.",
    },
  },
  {
    id: "morpheme-concept",
    group: "Foundations & Core Concepts",
    title: "The Concept of the Morpheme",
    teaser: "The minimal unit of language connecting form with grammatical or lexical meaning.",
    theory: [
      "A morpheme is the smallest unit of language that pairs form (sound or spelling) with meaning or grammatical function.",
      "Morphemes cannot be broken down further without losing their core meaning or structural utility.",
      "Do not confuse syllables with morphemes: 'alligator' has 4 syllables but is 1 morpheme; 'cats' has 1 syllable but 2 morphemes.",
    ],
    example: {
      word: "disagreeable",
      segments: [
        { text: "dis-", type: "prefix", meaning: "reversal/negation" },
        { text: "agree", type: "root", meaning: "consent" },
        { text: "-able", type: "suffix", meaning: "capable of being" },
      ],
      note: "Each morpheme contributes a specific semantic component to the derived word.",
    },
    exercise: {
      instruction: "Determine the correct morpheme count and analysis for 'unluckiest':",
      targetWord: "unluckiest",
      options: [
        {
          segments: [
            { text: "un-", type: "prefix" },
            { text: "luck", type: "root" },
            { text: "-y", type: "suffix" },
            { text: "-est", type: "suffix" },
          ],
          processLabel: "4 morphemes",
        },
        {
          segments: [
            { text: "un-", type: "prefix" },
            { text: "lucky", type: "root" },
            { text: "-est", type: "suffix" },
          ],
          processLabel: "3 morphemes",
        },
      ],
      correctIndex: 0,
      explanation:
        "'unluckiest' contains 4 morphemes: [un-] + [luck] + [-y] (adjectival derivation) + [-est] (superlative inflection).",
    },
  },
  {
    id: "free-vs-bound",
    group: "Foundations & Core Concepts",
    title: "Free vs. Bound Morphemes",
    teaser: "Units that stand independently versus those requiring attachment.",
    theory: [
      "Free morphemes can occur independently as complete words (e.g., book, run, soft).",
      "Bound morphemes must attach to other morphemes and cannot stand alone (e.g., -s, un-, -tion).",
      "Bound roots also exist: roots that carry core meaning but cannot appear without an affix (e.g., -ceive in 'receive', 'deceive', 'perceive').",
    ],
    example: {
      word: "previewed",
      segments: [
        { text: "pre-", type: "prefix", meaning: "Bound affix" },
        { text: "view", type: "root", meaning: "Free root" },
        { text: "-ed", type: "suffix", meaning: "Bound affix" },
      ],
      note: "'view' can stand on its own as a free morpheme, whereas 'pre-' and '-ed' are bound.",
    },
    exercise: {
      instruction: "Identify the bound root in the word 'cranberry':",
      targetWord: "cranberry",
      options: [
        {
          segments: [{ text: "berry", type: "root", meaning: "Free morpheme" }],
          processLabel: "Free morpheme target",
        },
        {
          segments: [{ text: "cran-", type: "root", meaning: "Bound root" }],
          processLabel: "Bound root target",
        },
      ],
      correctIndex: 1,
      explanation:
        "'cran-' is a classic 'cranberry morpheme': a bound root that occurs in essentially one word and lacks independent meaning outside it.",
    },
  },
  {
    id: "roots-stems-bases",
    group: "Foundations & Core Concepts",
    title: "Roots, Stems, and Bases",
    teaser: "Structural anchors: irreducible roots vs. targets of affixation.",
    theory: [
      "A root is the irreducible core of a word, stripped of all affixes (both derivational and inflectional).",
      "A stem is the form to which inflectional affixes attach (e.g., 'friendships' → stem: friendship).",
      "A base is any structural unit to which any affix (derivational or inflectional) can be added.",
    ],
    example: {
      word: "nationalizations",
      paradigm: [
        { feature: "Root", form: "nation", morphemes: "Irreducible core" },
        { feature: "Base for -al", form: "nation", morphemes: "N → Adj" },
        { feature: "Base for -ize", form: "national", morphemes: "Adj → V" },
        { feature: "Base for -ation", form: "nationalize", morphemes: "V → N" },
        { feature: "Stem for -s", form: "nationalization", morphemes: "Inflection target" },
      ],
      note: "Every root can serve as a base, but not every base or stem is a root.",
    },
    exercise: {
      instruction: "Identify the STEM that the inflectional suffix -s attaches to in 'unbreakables':",
      targetWord: "unbreakables",
      options: [
        {
          segments: [{ text: "break", type: "root" }],
          processLabel: "Root Analysis",
        },
        {
          segments: [{ text: "unbreakable", type: "root" }],
          processLabel: "Stem Analysis",
        },
      ],
      correctIndex: 1,
      explanation:
        "'unbreakable' serves as the stem to which the plural inflectional suffix [-s] attaches. 'break' is the root.",
    },
  },

  // =========================================================================
  // 2. Morphological Processes & Mechanics
  // =========================================================================
  {
    id: "affixation-types",
    group: "Processes & Mechanics",
    title: "Affixation Types",
    teaser: "Prefixes, suffixes, infixes, and circumfixes across natural languages.",
    theory: [
      "Prefixes attach before the base (re-build); suffixes attach after it (build-er).",
      "Infixes are inserted directly inside a root (Tagalog 'sulat' [write] → 's-um-ulat' [wrote]).",
      "Circumfixes consist of two mandatory parts surrounding the base simultaneously (German 'ge-spiel-t', from 'spielen').",
    ],
    example: {
      word: "ge-spiel-t (German)",
      segments: [
        { text: "ge-", type: "circumfix", meaning: "Part 1 of past participle" },
        { text: "spiel", type: "root", meaning: "play" },
        { text: "-t", type: "circumfix", meaning: "Part 2 of past participle" },
      ],
      note: "Circumfixation applies both components simultaneously around the root.",
    },
    exercise: {
      instruction: "Classify the process in Tagalog: 'basa' (read) → 'b-in-asa' (was read):",
      targetWord: "b-in-asa",
      options: [
        {
          segments: [{ text: "-in-", type: "infix" }],
          processLabel: "Infixation",
        },
        {
          segments: [{ text: "in-", type: "prefix" }],
          processLabel: "Prefixation",
        },
      ],
      correctIndex: 0,
      explanation:
        "[-in-] is inserted inside the root 'basa', after the initial consonant, making it an infix.",
    },
  },
  {
    id: "non-concatenative",
    group: "Processes & Mechanics",
    title: "Non-Concatenative Morphology",
    teaser: "Reduplication, ablaut, and umlaut: change without linear affixes.",
    theory: [
      "Non-concatenative processes modify words without simply attaching affixes end to end.",
      "Reduplication copies all or part of a base to mark grammatical or semantic functions (Indonesian 'rumah' → 'rumah-rumah' [houses]).",
      "Ablaut is a vowel alternation inherited from Proto-Indo-European (sing/sang/sung). Umlaut is vowel fronting conditioned historically by a lost suffix (foot/feet, goose/geese).",
    ],
    example: {
      word: "sing / sang / sung",
      paradigm: [
        { feature: "Present", form: "sing", morphemes: "Base vowel /ɪ/" },
        { feature: "Past", form: "sang", morphemes: "Ablaut shift to /æ/" },
        { feature: "Past Participle", form: "sung", morphemes: "Ablaut shift to /ʌ/" },
      ],
      note: "Internal root vowel shifts signal grammatical distinctions without linear affixes.",
    },
    exercise: {
      instruction: "Classify the historical process behind 'goose' → 'geese':",
      targetWord: "goose → geese",
      options: [
        {
          segments: [{ text: "Umlaut (vowel fronting)", type: "other" }],
          processLabel: "Umlaut",
        },
        {
          segments: [{ text: "Suffixation of -eese", type: "other" }],
          processLabel: "Linear Suffixation",
        },
        {
          segments: [{ text: "Reduplication of the root", type: "other" }],
          processLabel: "Reduplication",
        },
      ],
      correctIndex: 0,
      explanation:
        "'geese' comes from an older plural ending in a front vowel that fronted the root vowel. That process is umlaut.",
    },
  },
  {
    id: "suppletion-syncretism",
    group: "Processes & Mechanics",
    title: "Suppletion and Syncretism",
    teaser: "Total formal replacement vs. identity of distinct grammatical cells.",
    theory: [
      "Suppletion occurs when phonologically unrelated forms fill cells of a single paradigm (go → went, bad → worse).",
      "Suppletion is distinct from ordinary irregularity: 'catch → caught' shares historical material, whereas 'go → went' is suppletive.",
      "Syncretism occurs when distinct grammatical conditions share an identical superficial form (e.g., English past 'walked' and past participle 'walked').",
    ],
    example: {
      word: "be / am / is / was / were",
      paradigm: [
        { feature: "1st Person Present", form: "am", morphemes: "Suppletive stem 1" },
        { feature: "3rd Person Present", form: "is", morphemes: "Suppletive stem 1" },
        { feature: "Past Singular", form: "was", morphemes: "Suppletive stem 2" },
      ],
      note: "The paradigm of 'be' draws from historically completely distinct root sources.",
    },
    exercise: {
      instruction: "Identify the relationship between 'good' and 'better':",
      targetWord: "good → better",
      options: [
        {
          segments: [{ text: "Suppletion", type: "other" }],
          processLabel: "Suppletive Relationship",
        },
        {
          segments: [{ text: "Regular Derivation", type: "other" }],
          processLabel: "Regular Morphological Process",
        },
        {
          segments: [{ text: "Syncretism", type: "other" }],
          processLabel: "Identical Forms",
        },
      ],
      correctIndex: 0,
      explanation:
        "'good' and 'better' share no phonological material; 'better' is a suppletive comparative form.",
    },
  },
  {
    id: "compounding",
    group: "Processes & Mechanics",
    title: "Compounding Types",
    teaser: "Endocentric, exocentric, and copulative structural compounds.",
    theory: [
      "Compounding joins two or more roots or bases to form a single lexeme.",
      "Endocentric: Has an internal semantic head ('doghouse' IS a house).",
      "Exocentric: Lacks an internal semantic head; referent is external ('pickpocket' is NOT a pocket, but a person).",
      "Copulative (Appositional): Both elements contribute equally as heads ('bittersweet', 'singer-songwriter').",
    ],
    example: {
      word: "greenhouse vs. redhead",
      paradigm: [
        { feature: "greenhouse", form: "Endocentric", morphemes: "Head: house (a type of house)" },
        { feature: "redhead", form: "Exocentric", morphemes: "Headless (a person with red hair)" },
      ],
      note: "To classify a compound, test whether it names a sub-type of one of its constituent words.",
    },
    exercise: {
      instruction: "Classify the compound 'scarecrow':",
      targetWord: "scarecrow",
      options: [
        {
          segments: [{ text: "Exocentric Compound", type: "other" }],
          processLabel: "Exocentric (Headless)",
        },
        {
          segments: [{ text: "Endocentric Compound", type: "other" }],
          processLabel: "Endocentric (Head-Internal)",
        },
        {
          segments: [{ text: "Copulative Compound", type: "other" }],
          processLabel: "Copulative (Two Heads)",
        },
      ],
      correctIndex: 0,
      explanation:
        "A scarecrow is neither a type of crow nor a type of scare; it is an object that scares crows. Its referent is external.",
    },
  },
  {
    id: "minor-processes",
    group: "Processes & Mechanics",
    title: "Minor Morphological Processes",
    teaser: "Blending, clipping, acronyms, initialisms, and back-formation.",
    theory: [
      "Blending joins parts of two words (smog = smoke + fog; brunch = breakfast + lunch).",
      "Clipping shortens a word without changing its class or meaning (examination → exam; telephone → phone).",
      "Acronyms pronounce initial letters as a word (NASA, radar); Initialisms pronounce letters individually (FBI, CPU).",
      "Back-formation removes a supposed affix to create a simpler word (editor → edit; burglar → burgle).",
    ],
    example: {
      word: "editor → edit",
      paradigm: [
        { feature: "Original Noun", form: "editor", morphemes: "Perceived as root + -or" },
        { feature: "Back-Formed Verb", form: "edit", morphemes: "New verb created by removing -or" },
      ],
      note: "Speakers reanalyzed 'editor' as containing an agentive suffix, back-forming the verb 'edit'.",
    },
    exercise: {
      instruction: "Classify the word formation process that created the verb 'burgle' from 'burglar':",
      targetWord: "burglar → burgle",
      options: [
        {
          segments: [{ text: "Back-formation", type: "other" }],
          processLabel: "Back-Formation",
        },
        {
          segments: [{ text: "Clipping", type: "other" }],
          processLabel: "Clipping",
        },
        {
          segments: [{ text: "Blending", type: "other" }],
          processLabel: "Blending",
        },
      ],
      correctIndex: 0,
      explanation:
        "'burgle' was formed by removing the supposed agent suffix '-ar' from the noun 'burglar', making it a back-formation.",
    },
  },

  // =========================================================================
  // 3. Derivation vs. Inflection
  // =========================================================================
  {
    id: "inflection-vs-derivation",
    group: "Derivation vs. Inflection",
    title: "The Inflection-Derivation Distinction",
    teaser: "Creating new lexemes vs. adjusting forms required by syntax.",
    theory: [
      "Derivation creates new lexemes, often changing syntactic category or core meaning (bake → baker).",
      "Inflection alters word forms to express morphosyntactic features (tense, number, case) without changing lexeme identity.",
      "Derivational affixes sit closer to the root than inflectional affixes (neighbor-hood-s, NOT *neighbor-s-hood).",
    ],
    example: {
      word: "nationalizations",
      segments: [
        { text: "nation", type: "root", meaning: "Root" },
        { text: "-al", type: "suffix", meaning: "Derivational (N → Adj)" },
        { text: "-ize", type: "suffix", meaning: "Derivational (Adj → V)" },
        { text: "-ation", type: "suffix", meaning: "Derivational (V → N)" },
        { text: "-s", type: "suffix", meaning: "Inflectional (Plural)" },
      ],
      note: "Derivational affixes attach inside the final inflectional suffix [-s].",
    },
    exercise: {
      instruction: "Classify the suffix [-ed] in 'worked':",
      targetWord: "worked",
      options: [
        {
          segments: [{ text: "-ed", type: "suffix", meaning: "Past Tense Marker" }],
          processLabel: "Inflectional Suffix",
        },
        {
          segments: [{ text: "-ed", type: "suffix", meaning: "Category Changer" }],
          processLabel: "Derivational Suffix",
        },
      ],
      correctIndex: 0,
      explanation:
        "[-ed] marks past tense without altering the core verb lexeme WORK, making it inflectional.",
    },
  },
  {
    id: "derivational-morphology",
    group: "Derivation vs. Inflection",
    title: "Derivational Word Formation",
    teaser: "Category change, hierarchy, and semantic shifts in derived lexemes.",
    theory: [
      "Derivation often alters the grammatical category of the base (Noun → Adjective: health → healthy).",
      "Some derivational affixes maintain category while shifting meaning (Prefix un-: happy → unhappy; Suffix -dom: king → kingdom).",
      "Derivation operates in hierarchical layers, applying one affix at a time to form intermediate stems.",
    ],
    example: {
      word: "teacher",
      segments: [
        { text: "teach", type: "root", meaning: "Verb Base" },
        { text: "-er", type: "suffix", meaning: "Agentive Suffix (V → N)" },
      ],
      note: "The suffix '-er' shifts the syntactic category from a verb to an agent noun.",
    },
    exercise: {
      instruction: "Which affix in 'industrialization' performs the final category shift to a Noun?",
      targetWord: "industrialization",
      options: [
        {
          segments: [{ text: "-ation", type: "suffix", meaning: "V → N" }],
          processLabel: "Nominalizing Suffix -ation",
        },
        {
          segments: [{ text: "-ize", type: "suffix", meaning: "Adj → V" }],
          processLabel: "Verbalizing Suffix -ize",
        },
        {
          segments: [{ text: "-al", type: "suffix", meaning: "N → Adj" }],
          processLabel: "Adjectival Suffix -al",
        },
      ],
      correctIndex: 0,
      explanation:
        "[-ation] attaches to the verb base 'industrialize' to perform the final derivation into a noun.",
    },
  },
  {
    id: "inflectional-paradigms",
    group: "Derivation vs. Inflection",
    title: "Inflectional Paradigms & Features",
    teaser: "Organizing morphosyntactic features into structured word paradigms.",
    theory: [
      "An inflectional paradigm is the full set of inflected forms built from a single lexeme.",
      "Morphosyntactic features include Agreement (Person, Number, Gender) and Contextual features (Tense, Aspect, Mood, Case).",
      "Inflectional paradigms are systematically organized matrices of cross-classifying features.",
    ],
    example: {
      word: "LATIN: amāre (to love)",
      paradigm: [
        { feature: "1SG Present Active", form: "amō", morphemes: "love + 1SG" },
        { feature: "2SG Present Active", form: "amās", morphemes: "love + 2SG" },
        { feature: "3SG Present Active", form: "amat", morphemes: "love + 3SG" },
        { feature: "1PL Present Active", form: "amāmus", morphemes: "love + 1PL" },
      ],
      note: "Latin verbal inflections systematically encode person, number, tense, aspect, mood, and voice.",
    },
    exercise: {
      instruction: "In the English noun paradigm (cat, cats, cat's, cats'), how many distinct morphosyntactic feature combinations exist?",
      targetWord: "cat paradigm",
      options: [
        {
          segments: [{ text: "4 Feature Sets (SG, PL, SG+POSS, PL+POSS)", type: "other" }],
          processLabel: "4 Distinct Feature Combinations",
        },
        {
          segments: [{ text: "2 Feature Sets (Only SG and PL)", type: "other" }],
          processLabel: "2 Feature Combinations",
        },
      ],
      correctIndex: 0,
      explanation:
        "The English noun paradigm distinguishes Number (Singular vs. Plural) combined with Case (Plain vs. Genitive/Possessive), yielding 4 feature combinations.",
    },
  },
  {
    id: "productivity-creativity",
    group: "Derivation vs. Inflection",
    title: "Productivity & Creativity",
    teaser: "Rule-governed productivity vs. rule-tested novel creativity.",
    theory: [
      "Productivity refers to the active, open-ended applicability of a morphological rule to new bases (e.g., adjectival -ness).",
      "Creativity involves non-systematic, conscious coinage using less productive patterns or novel analogies (e.g., 'brunch').",
      "Productive affixes have low processing costs and apply transparently to neologisms and loanwords.",
    ],
    example: {
      word: "googleable",
      segments: [
        { text: "Google", type: "root", meaning: "Neologism Noun/Verb" },
        { text: "-able", type: "suffix", meaning: "Productive Adjectival Suffix" },
      ],
      note: "Productive affixes like '-able' attach effortlessly to new technical bases.",
    },
    exercise: {
      instruction: "Compare the plural suffixes '-s' and '-en' (as in 'oxen') in Modern English:",
      targetWord: "-s vs -en",
      options: [
        {
          segments: [{ text: "-s is fully productive; -en is unproductive/fossilized", type: "other" }],
          processLabel: "Productivity Contrast",
        },
        {
          segments: [{ text: "Both suffixes are equally productive", type: "other" }],
          processLabel: "Equal Productivity",
        },
      ],
      correctIndex: 0,
      explanation:
        "[-s] is fully productive and attaches automatically to new words (e.g., 'blogs'), whereas [-en] is an unproductive fossilized remnant.",
    },
  },
  {
    id: "blocking-constraints",
    group: "Derivation vs. Inflection",
    title: "Lexical Blocking & Constraints",
    teaser: "Phonological, semantic, and structural restrictions on word formation.",
    theory: [
      "Lexical Blocking occurs when an existing word prevents the formation of a rival derived form (*stealer is blocked by thief; *go-ed is blocked by went).",
      "Phonological constraints restrict affixation based on sound patterns (e.g., adjectival -en requires a monosyllabic base ending in an obstruent: wooden, golden, but *iron-en).",
      "Semantic constraints prevent redundant or contradictory combinations.",
    ],
    example: {
      word: "*gloriosity vs. glory",
      paradigm: [
        { feature: "Attested Form", form: "glory", morphemes: "Existing Lexical Form" },
        { feature: "Blocked Output", form: "*gloriosity", morphemes: "Prevented by pre-existing 'glory'" },
      ],
      note: "The existing noun 'glory' blocks the potential rule-generated formation '*gloriosity'.",
    },
    exercise: {
      instruction: "Why is the potential derived word '*stealer' (for 'one who steals') blocked in English?",
      targetWord: "*stealer → thief",
      options: [
        {
          segments: [{ text: "Blocked by the existing noun 'thief'", type: "other" }],
          processLabel: "Lexical Blocking",
        },
        {
          segments: [{ text: "Blocked by phonological vowel clashes", type: "other" }],
          processLabel: "Phonological Constraint",
        },
      ],
      correctIndex: 0,
      explanation:
        "The pre-existing noun 'thief' already fills the meaning 'one who steals', so the regular agentive formation '*stealer' is blocked.",
    },
  },

  // =========================================================================
  // 4. Morphology at the Interfaces
  // =========================================================================
  {
    id: "morphophonemics",
    group: "Morphology at the Interfaces",
    title: "Morphophonemics & Allomorphy",
    teaser: "Phonological conditioning and surface variants of a morpheme.",
    theory: [
      "An allomorph is a contextual phonological realization of an underlying morpheme.",
      "The English regular plural morpheme {-s} has three phonologically conditioned allomorphs: [/s/], [/z/], and [/ɪz/].",
      "Morphophonemic rules select the surface allomorph based on adjacent phonological environments.",
    ],
    example: {
      word: "cats [/s/] vs. dogs [/z/] vs. buses [/ɪz/]",
      paradigm: [
        { feature: "cats", form: "cat + /s/", morphemes: "After voiceless consonant (/t/)" },
        { feature: "dogs", form: "dog + /z/", morphemes: "After voiced consonant (/g/)" },
        { feature: "buses", form: "bus + /ɪz/", morphemes: "After sibilant consonant (/s/)" },
      ],
      note: "All three forms realize the exact same abstract plural morpheme {-s}.",
    },
    exercise: {
      instruction: "Identify the conditioning factor for the prefix allomorphs in- vs. im- (e.g., 'intolerable' vs. 'impossible'):",
      targetWord: "in- vs. im-",
      options: [
        {
          segments: [{ text: "Place of articulation assimilation", type: "prefix" }],
          processLabel: "Phonological Assimilation",
        },
        {
          segments: [{ text: "Random free variation", type: "prefix" }],
          processLabel: "Arbitrary Alternation",
        },
      ],
      correctIndex: 0,
      explanation:
        "[im-] occurs before bilabial consonants (/p/, /b/, /m/) due to place of articulation assimilation.",
    },
  },
  {
    id: "phonological-constraints",
    group: "Morphology at the Interfaces",
    title: "Phonological Constraints on Word Formation",
    teaser: "How prosodic structure, stress, and segmental limits shape morphology.",
    theory: [
      "Morphological operations often respect prosodic and metrical constraints (e.g., foot structure and stress patterns).",
      "Stress-shifting suffixes (e.g., -ity: 'Électric' → 'Electrícity') alter the stress distribution of the base.",
      "Prosodic morphology requires reduplicative templates to match specific metrical units (e.g., a mora or a heavy syllable).",
    ],
    example: {
      word: "electric → electricity",
      paradigm: [
        { feature: "Base", form: "e-LÉC-tric", morphemes: "Stress on second syllable" },
        { feature: "Derived", form: "e-lec-TRÍ-ci-ty", morphemes: "Stress shifts to third syllable before -ity" },
      ],
      note: "Suffixation of '-ity' triggers a stress shift across the stem.",
    },
    exercise: {
      instruction: "Why does English Comparative '-er' attach to 'fast' and 'happy', but NOT to 'intelligent' (*intelligent-er)?",
      targetWord: "faster vs *intelligenter",
      options: [
        {
          segments: [{ text: "Prosodic size constraint (max 2 syllables)", type: "other" }],
          processLabel: "Prosodic Constraint",
        },
        {
          segments: [{ text: "Semantic clash", type: "other" }],
          processLabel: "Semantic Constraint",
        },
      ],
      correctIndex: 0,
      explanation:
        "The comparative suffix '-er' is restricted prosodically to monosyllabic or disyllabic bases; longer adjectives require periphrastic 'more'.",
    },
  },
  {
    id: "morphosyntax-agreement",
    group: "Morphology at the Interfaces",
    title: "Morphosyntax: Agreement & Government",
    teaser: "How syntactic relations force inflectional morphology.",
    theory: [
      "Agreement (Concord) occurs when a word alters its form to match morphosyntactic features of another word (e.g., Subject-Verb Person/Number agreement).",
      "Government occurs when a syntactic head forces a specific Case marking on its complement (e.g., a preposition governing Accusative case).",
      "Morphosyntax is the interface where syntactic relationships dictate morphological form.",
    ],
    example: {
      word: "She runs vs. They run",
      paradigm: [
        { feature: "3SG Subject", form: "She runs", morphemes: "Verb takes -s for 3SG agreement" },
        { feature: "3PL Subject", form: "They run", morphemes: "Verb takes uninflected PL form" },
      ],
      note: "The verb form is dictated directly by the person and number features of the subject NP.",
    },
    exercise: {
      instruction: "In German 'mit dem Mann' (with the man), the preposition 'mit' requires the Dative case. This is an instance of:",
      targetWord: "mit dem Mann",
      options: [
        {
          segments: [{ text: "Syntactic Government", type: "other" }],
          processLabel: "Government",
        },
        {
          segments: [{ text: "Subject-Verb Agreement", type: "other" }],
          processLabel: "Agreement",
        },
      ],
      correctIndex: 0,
      explanation:
        "The preposition 'mit' acts as a syntactic governor that mandates Dative case on its noun phrase complement.",
    },
  },
  {
    id: "argument-structure",
    group: "Morphology at the Interfaces",
    title: "Argument Structure of Derived Words",
    teaser: "Passivization, nominalization, and changes in predicate valency.",
    theory: [
      "Derivational operations can alter the valency (number of arguments) and thematic roles of a verb.",
      "Causativization adds an agent argument (e.g., 'rise' [1 arg] → 'raise' [2 args]).",
      "Nominalization converts a verb into a noun while retaining or suppressing its original arguments (e.g., 'destroy the city' → 'the destruction of the city').",
    ],
    example: {
      word: "destroy → destruction",
      paradigm: [
        { feature: "Verb Phrase", form: "destroy [the city]", morphemes: "Direct Object NP Argument" },
        { feature: "Derived Noun Phrase", form: "destruction [of the city]", morphemes: "Argument demoted to Prepositional Phrase" },
      ],
      note: "Nominalization alters how thematic arguments are expressed syntactically.",
    },
    exercise: {
      instruction: "What happens to the agent argument in passivization ('The dog bit the man' → 'The man was bitten')?",
      targetWord: "passivization",
      options: [
        {
          segments: [{ text: "Suppressed or expressed as an optional PP adjunct", type: "other" }],
          processLabel: "Argument Demotion",
        },
        {
          segments: [{ text: "Promoted to primary Object", type: "other" }],
          processLabel: "Argument Promotion",
        },
      ],
      correctIndex: 0,
      explanation:
        "Passivization demotes the active subject agent to an optional prepositional phrase ('by the dog') or suppresses it completely.",
    },
  },
  {
    id: "clitics-vs-affixes",
    group: "Morphology at the Interfaces",
    title: "Clitics vs. Affixes",
    teaser: "Diagnostic tests for distinguishing bound words from true affixes.",
    theory: [
      "Clitics are syntactically independent elements that are phonologically bound to a host (e.g., English possessive 's in 'the king of England's hat').",
      "Affixes show high selectivity for their host base (e.g., -ity only attaches to adjectives); clitics attach to whole phrases regardless of word class.",
      "Zwicky & Pullum Diagnostics: Affixes show arbitrary gaps, morphophonemic idiosyncrasies, and tight structural integration.",
    ],
    example: {
      word: "The king of England's crown",
      segments: [
        { text: "The king of England", type: "root", meaning: "Noun Phrase Host" },
        { text: "='s", type: "suffix", meaning: "Phrasal Possessive Clitic" },
      ],
      note: "The possessive '='s' attaches to the end of an entire NP phrase, proving it is a clitic rather than a simple noun suffix.",
    },
    exercise: {
      instruction: "Analyze the contracted form 've in 'they've': Is it an affix or a clitic?",
      targetWord: "they've",
      options: [
        {
          segments: [{ text: "Proclitic/Enclitic (bound auxiliary word)", type: "other" }],
          processLabel: "Clitic Analysis",
        },
        {
          segments: [{ text: "Inflectional Suffix", type: "other" }],
          processLabel: "Affix Analysis",
        },
      ],
      correctIndex: 0,
      explanation:
        "'ve is a clitic—a phonologically reduced form of the auxiliary verb 'have' that syntactically functions as an independent word.",
    },
  },

  // =========================================================================
  // 5. Theoretical Approaches
  // =========================================================================
  {
    id: "theoretical-ia-ip-wp",
    group: "Theoretical Approaches",
    title: "Classical Models: IA, IP, and WP",
    teaser: "Item-and-Arrangement, Item-and-Process, and Word-and-Paradigm.",
    theory: [
      "Item-and-Arrangement (IA): Views morphology as concatenating static morpheme 'building blocks'.",
      "Item-and-Process (IP): Views morphology as applying operational rules to modify base forms.",
      "Word-and-Paradigm (WP): Takes the whole word and its position in a paradigm as the fundamental unit of analysis.",
    ],
    example: {
      word: "sang (Past of sing)",
      paradigm: [
        { feature: "IA Model", form: "sing + PAST", morphemes: "Must posit an abstract past morpheme; struggles with the vowel change" },
        { feature: "IP Model", form: "sing → sang", morphemes: "Applies a vowel-shift rule (/ɪ/ → /æ/)" },
        { feature: "WP Model", form: "[SING, Past]", morphemes: "Directly maps cell in paradigm to 'sang'" },
      ],
      note: "Non-concatenative forms like 'sang' present classic challenges for simple Item-and-Arrangement models.",
    },
    exercise: {
      instruction: "Which classical theoretical model best handles non-concatenative ablaut (sing → sang) without forcing dummy zero-morphemes?",
      targetWord: "sing → sang",
      options: [
        {
          segments: [{ text: "Item-and-Process (IP) or Word-and-Paradigm (WP)", type: "other" }],
          processLabel: "Process / Paradigm Models",
        },
        {
          segments: [{ text: "Item-and-Arrangement (IA)", type: "other" }],
          processLabel: "Arrangement Model",
        },
      ],
      correctIndex: 0,
      explanation:
        "Process (IP) and Paradigm (WP) models treat morphological operations as rules or holistic mappings, avoiding artificial IA segmentation.",
    },
  },
  {
    id: "distributed-morphology",
    group: "Theoretical Approaches",
    title: "Distributed Morphology (DM)",
    teaser: "Syntax all the way down: eliminating the traditional lexicon.",
    theory: [
      "Distributed Morphology (DM) argues that syntax generates all word architecture directly; there is no separate morphological lexicon.",
      "Vocabulary Insertion occurs Post-Syntactically: Abstract feature bundles are generated by syntax first, then spell-out inserts phonological items.",
      "Late Insertion & Underspecification: Vocabulary items insert into syntax terminal nodes matching their feature subsets.",
    ],
    example: {
      word: "DM Architecture",
      paradigm: [
        { feature: "1. Syntax", form: "[+Past, +3SG]", morphemes: "Generates abstract syntactic feature tree" },
        { feature: "2. Spell-Out", form: "Vocabulary Insertion", morphemes: "Matches features to phonological exponent '-ed'" },
      ],
      note: "In DM, word structure is generated by the same syntactic operations that build sentences.",
    },
    exercise: {
      instruction: "What does Distributed Morphology claim about the traditional 'Lexicon'?",
      targetWord: "DM Lexicon View",
      options: [
        {
          segments: [{ text: "It is eliminated; its functions are distributed across syntax and late spell-out", type: "other" }],
          processLabel: "Distributed Architecture",
        },
        {
          segments: [{ text: "It is an isolated module that builds complete words prior to syntax", type: "other" }],
          processLabel: "Lexicalist View",
        },
      ],
      correctIndex: 0,
      explanation:
        "DM rejects a generative lexicon that builds words before syntax, distributing lexical functions across syntax, vocabulary insertion, and encyclopedia.",
    },
  },
  {
    id: "lfg-lexical-integrity",
    group: "Theoretical Approaches",
    title: "LFG & Lexical Integrity",
    teaser: "The Lexical Integrity Hypothesis: syntax cannot see inside words.",
    theory: [
      "The Lexical Integrity Hypothesis states that syntactic rules cannot access or manipulate the internal structure of words.",
      "Frameworks like Lexical Functional Grammar (LFG) maintain a sharp boundary between lexical derivation and syntactic operations.",
      "Syntactic processes can move complete words, but cannot extract or re-order individual morphemes inside a word.",
    ],
    example: {
      word: "*Chomskyans admire him",
      paradigm: [
        { feature: "Anaphora Attempt", form: "*Chomskyans admire him", morphemes: "Fails: 'him' cannot refer to 'Chomsky' inside 'Chomskyans'" },
        { feature: "Lexical Integrity", form: "Word is opaque", morphemes: "Syntax treats complete words as atomic units" },
      ],
      note: "Syntax cannot target parts of words, whether by pronoun reference or by extraction (the 'anaphoric island' effect).",
    },
    exercise: {
      instruction: "Which observation supports the Lexical Integrity Hypothesis?",
      targetWord: "Lexical Integrity",
      options: [
        {
          segments: [{ text: "Syntactic rules cannot extract or move affixes out of words", type: "other" }],
          processLabel: "Opacity of Word Internal Structure",
        },
        {
          segments: [{ text: "Affixes can move freely across sentences", type: "other" }],
          processLabel: "Free Affix Movement",
        },
      ],
      correctIndex: 0,
      explanation:
        "The opacity of words to syntactic operations (e.g., inability to extract affixes) is primary evidence for Lexical Integrity.",
    },
  },
  {
    id: "construction-morphology",
    group: "Theoretical Approaches",
    title: "Construction Morphology",
    teaser: "Word-formation schemas as conventionalized form-meaning pairings.",
    theory: [
      "Construction Morphology extends Construction Grammar to word formation: words are schemas pairing form with meaning.",
      "Complex words are instantiations of abstract morphological schemas (e.g., [<X>_Adj + -ness]_N ↔ 'state of being X').",
      "This framework handles non-compositional idioms, compounds, and sub-regularities within a unified declarative hierarchy.",
    ],
    example: {
      word: "[ [X]Adj -ness ]N",
      paradigm: [
        { feature: "Form Schema", form: "[ [X]Adj -ness ]N", morphemes: "Abstract Morphological Template" },
        { feature: "Meaning Schema", form: "'State of being X'", morphemes: "Conventionalized Semantic Mapping" },
      ],
      note: "Complex words inherit structural properties directly from abstract construction schemas.",
    },
    exercise: {
      instruction: "In Construction Morphology, how is a derived word like 'kindness' analyzed?",
      targetWord: "kindness",
      options: [
        {
          segments: [{ text: "An instantiation of the abstract schema [[X]Adj -ness]N", type: "other" }],
          processLabel: "Schema Instantiation",
        },
        {
          segments: [{ text: "A temporary syntactic phrase built at runtime", type: "other" }],
          processLabel: "Syntactic Phrase",
        },
      ],
      correctIndex: 0,
      explanation:
        "Construction Morphology treats 'kindness' as an instance of a learned morphological schema connecting adjectival bases with '-ness'.",
    },
  },

  // =========================================================================
  // 6. Language Typology & Language Change
  // =========================================================================
  {
    id: "typology-agglutination-fusion",
    group: "Language Typology & Language Change",
    title: "Morphological Typology",
    teaser: "Analytic vs. synthetic, agglutinative vs. fusional, and polysynthetic systems.",
    theory: [
      "Analytic (Isolating) languages have a low morpheme-to-word ratio (e.g., Mandarin Chinese).",
      "Agglutinative languages combine multiple morphemes per word, maintaining neat 1:1 boundaries (e.g., Turkish: ev-ler-den = house-PL-ABL).",
      "Fusional languages fuse multiple morphosyntactic features into single affixes (e.g., Latin -ōs = Accusative + Masculine + Plural).",
      "Polysynthetic languages combine multiple roots and affixes into single word-sentences (e.g., Inuktitut).",
    ],
    example: {
      word: "Turkish vs. Latin Plurals",
      paradigm: [
        { feature: "Turkish (Agglutinative)", form: "ev-ler-den", morphemes: "house-PL-ABL (1 morpheme = 1 function)" },
        { feature: "Latin (Fusional)", form: "servōs", morphemes: "slave.ACC.MASC.PL (1 suffix fuses 3 features)" },
      ],
      note: "Agglutinative languages preserve discrete morpheme boundaries; fusional languages pack features together.",
    },
    exercise: {
      instruction: "Classify a language where words contain many morphemes, but each morpheme maps cleanly to a single function:",
      targetWord: "Typology Identification",
      options: [
        {
          segments: [{ text: "Agglutinative Language", type: "other" }],
          processLabel: "Agglutinative System",
        },
        {
          segments: [{ text: "Fusional Language", type: "other" }],
          processLabel: "Fusional System",
        },
        {
          segments: [{ text: "Isolating Language", type: "other" }],
          processLabel: "Isolating System",
        },
      ],
      correctIndex: 0,
      explanation:
        "Agglutinative languages feature high morpheme ratios per word with transparent, 1:1 boundaries.",
    },
  },
  {
    id: "grammaticalization",
    group: "Language Typology & Language Change",
    title: "Grammaticalization & Morpheme Life Cycles",
    teaser: "How free lexical words erode into bound grammatical affixes.",
    theory: [
      "Grammaticalization is the historical process whereby a lexical word transforms into a grammatical item, and eventually a bound affix.",
      "Unidirectional Pathway: Lexical Word → Grammatical Word → Clitic → Bound Affix → Zero.",
      "Accompanied by Phonological Reduction (loss of sound) and Semantic Bleaching (loss of specific concrete meaning).",
    ],
    example: {
      word: "going to → gonna",
      paradigm: [
        { feature: "Lexical Origin", form: "be going (motion)", morphemes: "Physical movement verb + directional prep" },
        { feature: "Grammatical Marker", form: "going to (future)", morphemes: "Semantically bleached auxiliary marker" },
        { feature: "Reduced Form", form: "gonna", morphemes: "Phonologically eroded future marker" },
      ],
      note: "The motion verb 'go' historically bleached into an auxiliary marker for future tense.",
    },
    exercise: {
      instruction: "The English adverbial suffix '-ly' evolved from the Old English noun 'līċ' (meaning 'body/shape'). This process is:",
      targetWord: "līċ → -ly",
      options: [
        {
          segments: [{ text: "Grammaticalization", type: "other" }],
          processLabel: "Grammaticalization",
        },
        {
          segments: [{ text: "Back-formation", type: "other" }],
          processLabel: "Back-Formation",
        },
      ],
      correctIndex: 0,
      explanation:
        "A free lexical noun ('body') evolving into a bound derivational suffix ('-ly') is a textbook example of grammaticalization.",
    },
  },
  {
    id: "reanalysis-analogy",
    group: "Language Typology & Language Change",
    title: "Morphological Reanalysis & Analogy",
    teaser: "How language learners reshape boundaries and extend patterns.",
    theory: [
      "Reanalysis changes the underlying structural assignment of a string without altering its immediate surface form.",
      "Folk Etymology reshapes unfamiliar words into familiar morphemes (e.g., 'asparagus' → 'sparrow-grass').",
      "Analogical Extension applies a productive pattern to irregular forms (e.g., historical 'clomb' replaced by regular 'climbed').",
    ],
    example: {
      word: "a napron → an apron",
      paradigm: [
        { feature: "Historical Form", form: "a napron", morphemes: "Initial consonant /n/ belonged to root" },
        { feature: "Reanalyzed Form", form: "an apron", morphemes: "Morpheme boundary shifted /n/ to article" },
      ],
      note: "Speakers reanalyzed the morpheme boundary, shifting initial /n/ from the noun to the indefinite article.",
    },
    exercise: {
      instruction: "The historical shift of the past tense of 'help' from 'holp' to 'helped' is an instance of:",
      targetWord: "holp → helped",
      options: [
        {
          segments: [{ text: "Analogical Extension", type: "other" }],
          processLabel: "Analogical Change",
        },
        {
          segments: [{ text: "Suppletion", type: "other" }],
          processLabel: "Suppletive Change",
        },
      ],
      correctIndex: 0,
      explanation:
        "Applying the regular '-ed' past tense pattern to replace an older irregular ablaut form ('holp') is analogical extension.",
    },
  },
  {
    id: "historical-change-paradigms",
    group: "Language Typology & Language Change",
    title: "Historical Change in Paradigms",
    teaser: "Paradigm leveling, syncretism evolution, and loss of affixes.",
    theory: [
      "Paradigm Leveling reduces internal alternations across a paradigm to increase regularity (e.g., eliminating root vowel shifts).",
      "Loss of Inflectional Affixes often forces a language to rely more heavily on syntactic word order and prepositions.",
      "Historical Phonological Erosion (e.g., loss of unstressed final vowels in Middle English) can destroy entire case systems.",
    ],
    example: {
      word: "Old English to Modern English Case Loss",
      paradigm: [
        { feature: "Old English Noun", form: "4 Distinct Cases", morphemes: "Nominative, Accusative, Genitive, Dative" },
        { feature: "Modern English Noun", form: "Common vs Possessive", morphemes: "Inflections collapsed into plain vs 's" },
      ],
      note: "Phonological erosion destroyed case suffixes, transforming English into an analytic SVO language.",
    },
    exercise: {
      instruction: "When historical changes eliminate formal distinctions between paradigm cells, resulting in identical forms, this creates:",
      targetWord: "Paradigm Shift",
      options: [
        {
          segments: [{ text: "Syncretism", type: "other" }],
          processLabel: "Syncretism",
        },
        {
          segments: [{ text: "Cliticization", type: "other" }],
          processLabel: "Cliticization",
        },
      ],
      correctIndex: 0,
      explanation:
        "The historical collapsing of distinct paradigm cell forms into a single identical surface form creates syncretism.",
    },
  },
];

// ---------------------------------------------------------------------------
// Main React Component Application
// ---------------------------------------------------------------------------

export default function MorphologyApp() {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [validationResult, setValidationResult] = useState<{ isCorrect: boolean; feedback: string } | null>(null);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>("All");

  const groups = useMemo(() => {
    const set = new Set<string>();
    MORPHOLOGY_LESSONS.forEach((l) => set.add(l.group));
    return ["All", ...Array.from(set)];
  }, []);

  const filteredLessons = useMemo(() => {
    if (selectedGroupFilter === "All") return MORPHOLOGY_LESSONS;
    return MORPHOLOGY_LESSONS.filter((l) => l.group === selectedGroupFilter);
  }, [selectedGroupFilter]);

  const currentLesson = MORPHOLOGY_LESSONS[selectedLessonIndex];

  // Position of the current lesson within the filtered list (-1 if not in it)
  const filteredPosition = filteredLessons.findIndex((l) => l.id === currentLesson.id);

  useEffect(() => {
    setSelectedAnswer(null);
    setValidationResult(null);
  }, [selectedLessonIndex]);

  const handleFilterChange = (group: string) => {
    setSelectedGroupFilter(group);
    const nextList =
      group === "All" ? MORPHOLOGY_LESSONS : MORPHOLOGY_LESSONS.filter((l) => l.group === group);
    // If the current lesson is outside the new filter, jump to its first lesson
    if (!nextList.some((l) => l.id === currentLesson.id) && nextList.length > 0) {
      setSelectedLessonIndex(MORPHOLOGY_LESSONS.findIndex((l) => l.id === nextList[0].id));
    }
  };

  const goToFilteredOffset = (offset: number) => {
    const target = filteredLessons[filteredPosition + offset];
    if (!target) return;
    setSelectedLessonIndex(MORPHOLOGY_LESSONS.findIndex((l) => l.id === target.id));
  };

  const handleOptionSelect = (index: number) => {
    setSelectedAnswer(index);
    setValidationResult(null);
  };

  const validateExercise = () => {
    if (selectedAnswer === null) return;
    const isCorrect = selectedAnswer === currentLesson.exercise.correctIndex;
    setValidationResult({
      isCorrect,
      feedback: isCorrect
        ? `Correct! ${currentLesson.exercise.explanation}`
        : `Incorrect. Try again or review the explanation: ${currentLesson.exercise.explanation}`,
    });
  };

  const getSegmentBg = (type: SegmentType) => {
    switch (type) {
      case "prefix":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "root":
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/40";
      case "suffix":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "infix":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "circumfix":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      default:
        return "bg-slate-800 text-slate-200 border-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* App Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 px-4 md:px-6 py-4 flex items-center justify-between backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Layers className="w-6 h-6 text-indigo-400" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">Morphology Lab</h1>
            <p className="text-xs text-slate-400 hidden sm:block">Interactive Linear Analysis & Paradigm Workspace</p>
          </div>
        </div>
        <div className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
          Lesson <span className="text-indigo-400 font-semibold">{filteredPosition + 1}</span> of {filteredLessons.length}
        </div>
      </header>

      {/* Main Layout Workspace */}
      <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-80 max-h-64 md:max-h-none border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/40 flex flex-col overflow-hidden shrink-0">
          {/* Group Filter Header */}
          <div className="p-4 border-b border-slate-800/80 space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Filter Module
            </label>
            <select
              value={selectedGroupFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-md text-xs p-2 focus:outline-none focus:border-indigo-500"
            >
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Lesson Scroll List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {filteredLessons.map((l) => {
              const actualIndex = MORPHOLOGY_LESSONS.findIndex((item) => item.id === l.id);
              const isActive = actualIndex === selectedLessonIndex;
              return (
                <button
                  key={l.id}
                  onClick={() => setSelectedLessonIndex(actualIndex)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-indigo-600/20 border border-indigo-500/40 text-indigo-200 shadow-sm"
                      : "hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <div className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider mb-0.5">
                    {l.group}
                  </div>
                  <div className="font-medium text-sm text-slate-200">{l.title}</div>
                  <div className="text-xs text-slate-500 line-clamp-1 mt-1">{l.teaser}</div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Central Lesson Workspace */}
        <main className="flex-1 w-full md:overflow-y-auto p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
          {/* Lesson Header */}
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-950/60 border border-indigo-800/50 px-2.5 py-1 rounded-md">
              {currentLesson.group}
            </span>
            <h2 className="text-2xl font-bold text-white mt-3">{currentLesson.title}</h2>
            <p className="text-slate-400 mt-1 text-sm">{currentLesson.teaser}</p>
          </div>

          {/* Theoretical Core Concepts */}
          <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 space-y-3">
            <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Theoretical Principles
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {currentLesson.theory.map((point, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-indigo-400 select-none">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exemplar Analysis Workspace */}
          <div className="bg-slate-950/60 rounded-xl p-4 md:p-6 border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Structural Exemplar: <span className="text-white font-mono text-sm">{currentLesson.example.word}</span>
            </h3>

            {/* Linear Morpheme Segmentation View */}
            {currentLesson.example.segments && (
              <div className="flex flex-wrap gap-3 my-3">
                {currentLesson.example.segments.map((seg, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-2.5 rounded-lg border flex flex-col items-center ${getSegmentBg(seg.type)}`}
                  >
                    <span className="font-mono text-lg font-bold">{seg.text}</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-80 mt-0.5">{seg.type}</span>
                    {seg.meaning && (
                      <span className="text-xs italic text-slate-300 mt-1">"{seg.meaning}"</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Morphosyntactic Paradigm Matrix View */}
            {currentLesson.example.paradigm && (
              <div className="overflow-x-auto my-3">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 px-3">Grammatical Feature / Condition</th>
                      <th className="py-2.5 px-3">Surface Form</th>
                      <th className="py-2.5 px-3">Morphological Analysis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-slate-300">
                    {currentLesson.example.paradigm.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-3 font-medium text-indigo-300">{p.feature}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-100">{p.form}</td>
                        <td className="py-2.5 px-3 text-slate-400">{p.morphemes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="text-xs text-slate-400 italic border-t border-slate-800/60 pt-3">
              {currentLesson.example.note}
            </p>
          </div>

          {/* Interactive Exercise Module */}
          <div className="bg-slate-950 rounded-xl p-4 md:p-6 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-400" />
                  Interactive Morphological Tagger
                </h3>
                <p className="text-xs text-slate-400 mt-1">{currentLesson.exercise.instruction}</p>
              </div>
            </div>

            {/* Target Word Display */}
            <div className="text-center py-4 bg-slate-900/60 rounded-lg border border-slate-800">
              <span className="text-[10px] uppercase text-slate-500 tracking-wider block mb-1">Target Analysis Item</span>
              <span className="text-2xl font-mono font-bold text-indigo-300 break-words">{currentLesson.exercise.targetWord}</span>
            </div>

            {/* Analysis Options */}
            <div className="space-y-3">
              {currentLesson.exercise.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10"
                        : "bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-indigo-400 block">{option.processLabel}</span>
                      <div className="flex flex-wrap gap-2">
                        {option.segments.map((s, sIdx) => (
                          <span
                            key={sIdx}
                            className={`px-2.5 py-1 rounded text-xs font-mono border ${getSegmentBg(s.type)}`}
                          >
                            {s.text}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? "border-indigo-400 bg-indigo-500" : "border-slate-700"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Submit & Feedback Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={validateExercise}
                disabled={selectedAnswer === null}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Submit Morphological Analysis
              </button>

              {validationResult && (
                <div
                  className={`flex items-start gap-2 text-xs p-3 rounded-lg border w-full sm:w-auto flex-1 ${
                    validationResult.isCorrect
                      ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                      : "bg-amber-950/40 border-amber-800 text-amber-300"
                  }`}
                >
                  {validationResult.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{validationResult.feedback}</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls (respect the active module filter) */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-6">
            <button
              onClick={() => goToFilteredOffset(-1)}
              disabled={filteredPosition <= 0}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs rounded-md transition-all"
            >
              ← Previous Lesson
            </button>
            <button
              onClick={() => goToFilteredOffset(1)}
              disabled={filteredPosition === -1 || filteredPosition >= filteredLessons.length - 1}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-md transition-all flex items-center gap-1.5"
            >
              Next Lesson <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Footer: community & support links */}
          <div className="border-t border-slate-800 pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 text-center sm:text-left">
              Made by Facts by Experiences. Enjoying the lessons?
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <a
                href="https://www.facebook.com/Factsbyexperiences"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md transition-all flex items-center gap-1.5"
              >
                <Facebook className="w-3.5 h-3.5" /> Follow on Facebook
              </a>
              <a
                href="https://paypal.me/afkharm"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5"
              >
                <Coffee className="w-3.5 h-3.5" /> Buy me a coffee
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
