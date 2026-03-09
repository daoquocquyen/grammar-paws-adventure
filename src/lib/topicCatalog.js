const toSafeTopicKey = (value) => (typeof value === "string" ? value.trim() : "");

export const DEFAULT_TOPIC_KEY = "verbs";

export const TOPIC_CATALOG = {
    verbs: {
        title: "Verb To Be + Present Simple",
        summary: "Use am/is/are and simple present to build clear everyday sentences.",
        petQuote: "Let's match helper verbs and simple action verbs like a grammar team!",
        aspects: [
            { id: "auxiliary", rule: "To Be (Am, Is, Are)", example: "She is my best friend.", highlightWords: ["is"] },
            { id: "present-simple", rule: "Present Simple", example: "He plays football after school.", highlightWords: ["plays"] },
        ],
    },
    nouns: {
        title: "Nouns",
        summary: "Learn the names of people, places, animals, and things.",
        petQuote: "Let's find naming words together!",
        aspects: [
            { id: "common", rule: "Common Nouns", example: "The dog runs fast.", highlightWords: ["dog"] },
            { id: "proper", rule: "Proper Nouns", example: "Mia visits Ha Noi.", highlightWords: ["Mia", "Ha Noi"] },
            { id: "plurality", rule: "Singular and Plural", example: "One apple, two apples.", highlightWords: ["apple", "apples"] },
        ],
    },
    pronouns: {
        title: "Pronouns",
        summary: "Use short helper words instead of repeating nouns.",
        petQuote: "Let's practice shortcut words for people and things!",
        aspects: [
            { id: "subject", rule: "Subject Pronouns", example: "She likes music.", highlightWords: ["She"] },
            { id: "object", rule: "Object Pronouns", example: "I saw him at school.", highlightWords: ["him"] },
        ],
    },
    adjectives: {
        title: "Adjectives",
        summary: "Describe nouns with words that add color and detail.",
        petQuote: "Describing words make every sentence brighter!",
        aspects: [
            { id: "size", rule: "Describing Size", example: "The tiny kitten slept.", highlightWords: ["tiny"] },
            { id: "color", rule: "Describing Color", example: "I found a red ball.", highlightWords: ["red"] },
        ],
    },
    adverbs: {
        title: "Adverbs",
        summary: "Tell how, when, or where an action happens.",
        petQuote: "Zoom quickly, learn happily!",
        aspects: [
            { id: "how", rule: "How", example: "He runs quickly.", highlightWords: ["quickly"] },
            { id: "when", rule: "When", example: "We will practice tomorrow.", highlightWords: ["tomorrow"] },
            { id: "where", rule: "Where", example: "The dog waits outside.", highlightWords: ["outside"] },
        ],
    },
    prepositions: {
        title: "Prepositions of Place",
        summary: "Show where people and things are using place words.",
        petQuote: "Let's map where things are: in, on, under, and more!",
        aspects: [
            { id: "place", rule: "Place", example: "The book is on the table.", highlightWords: ["on"] },
            { id: "position", rule: "Position", example: "The cat is between two boxes.", highlightWords: ["between"] },
            { id: "relation", rule: "Relative Place", example: "The lamp is in front of the sofa.", highlightWords: ["in front of"] },
        ],
    },
    conjunctions: {
        title: "Conjunctions",
        summary: "Join words and ideas into smoother sentences.",
        petQuote: "Connect ideas like puzzle pieces!",
        aspects: [
            { id: "and-but", rule: "And / But", example: "I like tea and juice.", highlightWords: ["and"] },
            { id: "because", rule: "Because", example: "She smiled because she won.", highlightWords: ["because"] },
            { id: "or", rule: "Or", example: "Do you want rice or noodles?", highlightWords: ["or"] },
        ],
    },
    articles: {
        title: "Articles",
        summary: "Use a, an, and the with confidence.",
        petQuote: "Tiny words, big difference!",
        aspects: [
            { id: "a", rule: "A", example: "I saw a cat.", highlightWords: ["a"] },
            { id: "an", rule: "An", example: "She ate an apple.", highlightWords: ["an"] },
            { id: "the", rule: "The", example: "The moon is bright.", highlightWords: ["The"] },
        ],
    },
    tenses: {
        title: "Present Continuous vs Simple Present",
        summary: "Compare actions happening now with actions that happen regularly.",
        petQuote: "Now-actions and everyday-actions each have their own verb pattern!",
        aspects: [
            {
                id: "present-continuous",
                rule: "Present Continuous (Now)",
                example: "They are playing now.",
                highlightWords: ["are", "playing", "now"],
            },
            {
                id: "simple-present",
                rule: "Simple Present (Habit)",
                example: "They play after school every day.",
                highlightWords: ["play", "every day"],
            },
        ],
    },
    punctuation: {
        title: "Punctuation",
        summary: "Use marks to make writing clear and expressive.",
        petQuote: "Commas pause, periods stop, and questions ask!",
        aspects: [
            { id: "period", rule: "Period", example: "I love reading.", highlightWords: ["."] },
            { id: "question-mark", rule: "Question Mark", example: "Are you ready?", highlightWords: ["?"] },
            { id: "comma", rule: "Comma", example: "We packed books, pens, and snacks.", highlightWords: [","] },
        ],
    },
    "sentence-structure": {
        title: "Sentence Structure",
        summary: "Build complete sentences with clear word order.",
        petQuote: "Strong sentences are built one block at a time!",
        aspects: [
            { id: "subject-verb", rule: "Subject + Verb", example: "Birds sing.", highlightWords: ["Birds", "sing"] },
            { id: "complete-thought", rule: "Complete Thought", example: "The baby laughed loudly.", highlightWords: ["baby", "laughed"] },
            { id: "word-order", rule: "Word Order", example: "My friend reads books.", highlightWords: ["friend", "reads", "books"] },
        ],
    },
};

export const TOPIC_KEYS = Object.keys(TOPIC_CATALOG);

export const hasTopic = (topicKey) => Boolean(TOPIC_CATALOG[toSafeTopicKey(topicKey)]);

export const getTopicByKey = (topicKey) => TOPIC_CATALOG[toSafeTopicKey(topicKey)] ?? null;

export const getTopicAspectIds = (topicKey) => {
    const topic = getTopicByKey(topicKey) ?? getTopicByKey(DEFAULT_TOPIC_KEY);
    if (!topic || !Array.isArray(topic.aspects)) {
        return [];
    }

    return topic.aspects.map((aspect, index) => {
        if (typeof aspect?.id === "string" && aspect.id.trim()) {
            return aspect.id.trim();
        }

        const normalizedRule =
            typeof aspect?.rule === "string"
                ? aspect.rule.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
                : "";

        return normalizedRule || `aspect-${index + 1}`;
    });
};
