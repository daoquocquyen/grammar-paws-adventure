import { getChallengeQuestionCount } from "./challengeQuestionCount";

const RECENT_TOPIC_ATTEMPT_COOLDOWN = 2;
const QUESTIONS_PER_ASPECT = 6;

const toSafeString = (value) => (typeof value === "string" ? value.trim() : "");
const toDisplayLabel = (value) =>
    toSafeString(value)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());

const QUESTION_BLUEPRINTS = {
    "verbs::ing-ending": {
        prompt: "Verbs: pick the -ing form.",
        hint: "Words happening right now usually end with -ing.",
        correctFeedback: "Correct. That verb uses the -ing ending.",
        incorrectFeedback: "Try the verb ending with -ing.",
        sentenceFrames: [
            { before: "Right now, Mia is", after: "in class." },
            { before: "The puppy is", after: "around the yard." },
            { before: "They are", after: "a new song." },
        ],
        correctPool: ["reading", "running", "singing", "jumping", "drawing", "playing"],
        distractorPool: ["read", "run", "song", "jump", "draw", "play"],
    },
    "verbs::auxiliary": {
        prompt: "Verbs: choose am/is/are.",
        hint: "Match the helper verb with the subject.",
        correctFeedback: "Great. The helper verb matches the subject.",
        incorrectFeedback: "Use the helper verb that agrees with the subject.",
        sentenceFrames: [
            { before: "I", after: "learning grammar now." },
            { before: "She", after: "writing a short story." },
            { before: "They", after: "playing outside." },
            { before: "He", after: "drawing a map." },
            { before: "We", after: "reading together." },
            { before: "You", after: "doing great today." },
        ],
        correctPool: ["am", "is", "are", "is", "are", "are"],
        distractorPool: ["is", "am", "is", "are", "am", "is"],
    },
    "verbs::time-marker": {
        prompt: "Verbs: pick a right-now time marker.",
        hint: "Present continuous often uses now markers.",
        correctFeedback: "Nice. That marker fits actions happening now.",
        incorrectFeedback: "Pick a marker that means the action is happening now.",
        sentenceFrames: [
            { before: "The class is practicing grammar", after: "." },
            { before: "The cat is sleeping", after: "." },
            { before: "We are learning together", after: "." },
        ],
        correctPool: ["now", "right now", "currently", "at the moment", "this minute", "today"],
        distractorPool: ["yesterday", "last week", "last year", "tomorrow", "soon", "never"],
    },

    "nouns::common": {
        prompt: "Nouns: choose the common noun.",
        hint: "Common nouns name general people, places, animals, or things.",
        correctFeedback: "Correct. That is a common noun.",
        incorrectFeedback: "Choose the naming word, not a describing/action word.",
        sentenceFrames: [
            { before: "The", after: "is barking near the gate." },
            { before: "My", after: "helps me with homework." },
            { before: "The", after: "is full of books." },
        ],
        correctPool: ["dog", "teacher", "library", "farmer", "pencil", "river"],
        distractorPool: ["quickly", "blue", "run", "happy", "softly", "because"],
    },
    "nouns::proper": {
        prompt: "Nouns: choose the proper noun.",
        hint: "Proper nouns are specific names and begin with capitals.",
        correctFeedback: "Correct. That is a proper noun.",
        incorrectFeedback: "Pick the specific name with a capital letter.",
        sentenceFrames: [
            { before: "We visited", after: "during our school trip." },
            { before: "My friend", after: "won the spelling game." },
            { before: "We read a story by", after: "." },
        ],
        correctPool: ["Ha Noi", "Mia", "Da Nang", "An", "Vietnam", "Liam"],
        distractorPool: ["city", "girl", "beach", "friend", "country", "boy"],
    },
    "nouns::plurality": {
        prompt: "Nouns: choose the plural noun.",
        hint: "Plural nouns name more than one thing.",
        correctFeedback: "Great. That noun is plural.",
        incorrectFeedback: "Pick the noun that means more than one.",
        sentenceFrames: [
            { before: "Two", after: "are on the table." },
            { before: "Many", after: "fly in the sky." },
            { before: "The kids packed three", after: "for class." },
        ],
        correctPool: ["apples", "birds", "books", "pencils", "cats", "boxes"],
        distractorPool: ["apple", "bird", "book", "pencil", "cat", "box"],
    },

    "pronouns::subject": {
        prompt: "Pronouns: choose the subject pronoun.",
        hint: "Subject pronouns do the action.",
        correctFeedback: "Correct. That pronoun is used as a subject.",
        incorrectFeedback: "Pick the pronoun used as the doer of the action.",
        sentenceFrames: [
            { before: "", after: "plays the piano every evening." },
            { before: "", after: "run to school together." },
            { before: "", after: "am ready for the quiz." },
        ],
        correctPool: ["She", "They", "I", "We", "He", "You"],
        distractorPool: ["Her", "Them", "Me", "Us", "Him", "Your"],
    },
    "pronouns::object": {
        prompt: "Pronouns: choose the object pronoun.",
        hint: "Object pronouns receive the action.",
        correctFeedback: "Correct. That is an object pronoun.",
        incorrectFeedback: "Use the pronoun that receives the action.",
        sentenceFrames: [
            { before: "I saw", after: "at the library." },
            { before: "The teacher helped", after: "after class." },
            { before: "Can you call", after: "later?" },
        ],
        correctPool: ["him", "us", "me", "her", "them", "you"],
        distractorPool: ["he", "we", "I", "she", "they", "your"],
    },
    "pronouns::possessive": {
        prompt: "Pronouns: choose the possessive pronoun.",
        hint: "Possessive pronouns show ownership.",
        correctFeedback: "Great. That pronoun shows ownership.",
        incorrectFeedback: "Pick the pronoun that shows who owns it.",
        sentenceFrames: [
            { before: "That blue backpack is", after: "." },
            { before: "This notebook is", after: ", not hers." },
            { before: "The winning project is", after: "." },
        ],
        correctPool: ["mine", "yours", "ours", "his", "hers", "theirs"],
        distractorPool: ["me", "you", "us", "him", "her", "them"],
    },

    "adjectives::size": {
        prompt: "Adjectives: choose the size adjective.",
        hint: "Size adjectives describe how big or small something is.",
        correctFeedback: "Correct. That word describes size.",
        incorrectFeedback: "Pick the word that tells size.",
        sentenceFrames: [
            { before: "The", after: "kitten slept in the basket." },
            { before: "We carried a", after: "box." },
            { before: "He drew a", after: "circle." },
        ],
        correctPool: ["tiny", "large", "small", "huge", "short", "long"],
        distractorPool: ["red", "quickly", "run", "yesterday", "and", "book"],
    },
    "adjectives::color": {
        prompt: "Adjectives: choose the color adjective.",
        hint: "Color adjectives tell color.",
        correctFeedback: "Correct. That is a color adjective.",
        incorrectFeedback: "Pick the word that names a color.",
        sentenceFrames: [
            { before: "I found a", after: "ball under the chair." },
            { before: "She wore a", after: "dress today." },
            { before: "The bird has", after: "wings." },
        ],
        correctPool: ["red", "blue", "green", "yellow", "purple", "brown"],
        distractorPool: ["tiny", "quickly", "cat", "because", "run", "tomorrow"],
    },
    "adjectives::order": {
        prompt: "Adjectives: choose the correct adjective order.",
        hint: "In English, size usually comes before color.",
        correctFeedback: "Nice. The adjective order is correct.",
        incorrectFeedback: "Try placing size before color.",
        sentenceFrames: [
            { before: "She has a", after: "bag." },
            { before: "We saw a", after: "kite." },
            { before: "He bought a", after: "car." },
        ],
        correctPool: ["small blue", "big red", "tiny green", "long black", "short white", "huge brown"],
        distractorPool: ["blue small", "red big", "green tiny", "black long", "white short", "brown huge"],
    },

    "adverbs::how": {
        prompt: "Adverbs: choose the adverb of how.",
        hint: "Adverbs of how describe the manner of an action.",
        correctFeedback: "Correct. That adverb tells how.",
        incorrectFeedback: "Pick the word that describes how the action happens.",
        sentenceFrames: [
            { before: "He runs", after: "during practice." },
            { before: "She spoke", after: "to the class." },
            { before: "They worked", after: "on the project." },
        ],
        correctPool: ["quickly", "quietly", "carefully", "happily", "slowly", "boldly"],
        distractorPool: ["tomorrow", "outside", "teacher", "red", "because", "and"],
    },
    "adverbs::when": {
        prompt: "Adverbs: choose the adverb of when.",
        hint: "Adverbs of when tell time.",
        correctFeedback: "Correct. That adverb tells when.",
        incorrectFeedback: "Pick the word that tells when the action happens.",
        sentenceFrames: [
            { before: "We will practice", after: "." },
            { before: "I finished my homework", after: "." },
            { before: "They are visiting us", after: "." },
        ],
        correctPool: ["tomorrow", "today", "yesterday", "later", "tonight", "soon"],
        distractorPool: ["quickly", "outside", "teacher", "blue", "and", "book"],
    },
    "adverbs::where": {
        prompt: "Adverbs: choose the adverb of where.",
        hint: "Adverbs of where tell location.",
        correctFeedback: "Great. That adverb tells where.",
        incorrectFeedback: "Pick the word that tells where the action happens.",
        sentenceFrames: [
            { before: "The dog waits", after: "." },
            { before: "Please stand", after: "for the photo." },
            { before: "The kids looked", after: "for the key." },
        ],
        correctPool: ["outside", "inside", "upstairs", "nearby", "here", "away"],
        distractorPool: ["quickly", "tomorrow", "teacher", "red", "because", "and"],
    },

    "prepositions::place": {
        prompt: "Prepositions: choose the place preposition.",
        hint: "Place prepositions show location.",
        correctFeedback: "Correct. That preposition shows place.",
        incorrectFeedback: "Pick the preposition that shows location.",
        sentenceFrames: [
            { before: "The book is", after: "the table." },
            { before: "The cat is hiding", after: "the chair." },
            { before: "The shoes are", after: "the bed." },
        ],
        correctPool: ["on", "under", "behind", "between", "next to", "in front of"],
        distractorPool: ["at", "during", "because", "quickly", "and", "tomorrow"],
    },
    "prepositions::time": {
        prompt: "Prepositions: choose the time preposition.",
        hint: "Time prepositions show when something happens.",
        correctFeedback: "Correct. That preposition fits time.",
        incorrectFeedback: "Pick the preposition used with time.",
        sentenceFrames: [
            { before: "Class starts", after: "nine o'clock." },
            { before: "We have music", after: "Monday." },
            { before: "My birthday is", after: "July." },
        ],
        correctPool: ["at", "on", "in", "before", "after", "during"],
        distractorPool: ["under", "behind", "quickly", "teacher", "because", "or"],
    },
    "prepositions::direction": {
        prompt: "Prepositions: choose the direction preposition.",
        hint: "Direction prepositions show movement.",
        correctFeedback: "Great. That preposition shows direction.",
        incorrectFeedback: "Pick the preposition that shows movement direction.",
        sentenceFrames: [
            { before: "We walked", after: "the room." },
            { before: "The bird flew", after: "the tree." },
            { before: "They ran", after: "the bridge." },
        ],
        correctPool: ["into", "toward", "across", "through", "onto", "out of"],
        distractorPool: ["at", "on", "quickly", "teacher", "because", "red"],
    },

    "conjunctions::and-but": {
        prompt: "Conjunctions: choose and or but.",
        hint: "'And' adds ideas. 'But' shows contrast.",
        correctFeedback: "Correct. The conjunction fits the sentence meaning.",
        incorrectFeedback: "Try the conjunction that matches add-vs-contrast.",
        sentenceFrames: [
            { before: "I like milk", after: "juice." },
            { before: "She is tired", after: "she keeps practicing." },
            { before: "We brought pens", after: "notebooks." },
            { before: "He is small", after: "strong." },
            { before: "The class sang", after: "danced." },
            { before: "It was rainy", after: "we played indoors." },
        ],
        correctPool: ["and", "but", "and", "but", "and", "but"],
        distractorPool: ["but", "and", "but", "and", "but", "and"],
    },
    "conjunctions::because": {
        prompt: "Conjunctions: choose 'because'.",
        hint: "Use 'because' to give a reason.",
        correctFeedback: "Correct. 'Because' introduces a reason.",
        incorrectFeedback: "Use the conjunction that explains a reason.",
        sentenceFrames: [
            { before: "She smiled", after: "she won." },
            { before: "I wore a coat", after: "it was cold." },
            { before: "We stayed inside", after: "it was raining." },
            { before: "He studied hard", after: "he had a test." },
            { before: "They were happy", after: "school ended early." },
            { before: "I brought water", after: "it was hot." },
        ],
        correctPool: ["because", "because", "because", "because", "because", "because"],
        distractorPool: ["and", "or", "but", "and", "or", "but"],
    },
    "conjunctions::or": {
        prompt: "Conjunctions: choose 'or'.",
        hint: "Use 'or' to show a choice.",
        correctFeedback: "Correct. 'Or' offers a choice.",
        incorrectFeedback: "Pick the conjunction used for choices.",
        sentenceFrames: [
            { before: "Would you like tea", after: "juice?" },
            { before: "Take the bus", after: "walk home." },
            { before: "We can read now", after: "later." },
            { before: "Use a pen", after: "a pencil." },
            { before: "Do you want apples", after: "oranges?" },
            { before: "Call me today", after: "tomorrow." },
        ],
        correctPool: ["or", "or", "or", "or", "or", "or"],
        distractorPool: ["and", "but", "because", "and", "but", "because"],
    },

    "articles::a": {
        prompt: "Articles: choose 'a'.",
        hint: "Use 'a' before singular words with a consonant sound.",
        correctFeedback: "Correct. 'A' fits this noun.",
        incorrectFeedback: "Use the article for a singular consonant sound noun.",
        sentenceFrames: [
            { before: "I saw", after: "cat near the gate." },
            { before: "She has", after: "ball." },
            { before: "He bought", after: "book." },
            { before: "We found", after: "toy." },
            { before: "They drew", after: "house." },
            { before: "I need", after: "pen." },
        ],
        correctPool: ["a", "a", "a", "a", "a", "a"],
        distractorPool: ["an", "the", "an", "the", "an", "the"],
    },
    "articles::an": {
        prompt: "Articles: choose 'an'.",
        hint: "Use 'an' before singular words with a vowel sound.",
        correctFeedback: "Correct. 'An' fits this noun.",
        incorrectFeedback: "Use the article for a singular vowel sound noun.",
        sentenceFrames: [
            { before: "She ate", after: "apple." },
            { before: "I saw", after: "owl at night." },
            { before: "He carried", after: "umbrella." },
            { before: "We heard", after: "echo." },
            { before: "They drew", after: "octopus." },
            { before: "I need", after: "eraser." },
        ],
        correctPool: ["an", "an", "an", "an", "an", "an"],
        distractorPool: ["a", "the", "a", "the", "a", "the"],
    },
    "articles::the": {
        prompt: "Articles: choose 'the'.",
        hint: "Use 'the' for a specific noun.",
        correctFeedback: "Correct. 'The' points to a specific thing.",
        incorrectFeedback: "Use the article for a specific noun.",
        sentenceFrames: [
            { before: "Please close", after: "door." },
            { before: "We visited", after: "library near our school." },
            { before: "Look at", after: "moon tonight." },
            { before: "She cleaned", after: "desk by the window." },
            { before: "I met", after: "teacher from grade four." },
            { before: "They watered", after: "plants in the corner." },
        ],
        correctPool: ["the", "the", "the", "the", "the", "the"],
        distractorPool: ["a", "an", "a", "an", "a", "an"],
    },

    "tenses::past": {
        prompt: "Tenses: choose the past tense verb.",
        hint: "Past tense talks about completed actions.",
        correctFeedback: "Correct. That verb is in past tense.",
        incorrectFeedback: "Pick the verb form used for past time.",
        sentenceFrames: [
            { before: "Yesterday, we", after: "at the park." },
            { before: "Last night, she", after: "a story." },
            { before: "An hour ago, they", after: "dinner." },
        ],
        correctPool: ["played", "read", "cooked", "visited", "watched", "walked"],
        distractorPool: ["play", "reads", "cook", "visit", "watch", "walk"],
    },
    "tenses::present": {
        prompt: "Tenses: choose the present tense verb.",
        hint: "Present tense talks about now or regular habits.",
        correctFeedback: "Correct. That verb is in present tense.",
        incorrectFeedback: "Pick the verb form used for present time.",
        sentenceFrames: [
            { before: "Every day, I", after: "English." },
            { before: "She", after: "to school by bike." },
            { before: "They", after: "breakfast at home." },
        ],
        correctPool: ["study", "walks", "eat", "read", "play", "watch"],
        distractorPool: ["studied", "walked", "ate", "will read", "played", "watched"],
    },
    "tenses::future": {
        prompt: "Tenses: choose the future tense verb phrase.",
        hint: "Future tense often uses 'will + verb'.",
        correctFeedback: "Correct. That phrase is future tense.",
        incorrectFeedback: "Pick the form that shows future action.",
        sentenceFrames: [
            { before: "Tomorrow, we", after: "a game." },
            { before: "Next week, she", after: "her grandma." },
            { before: "Tonight, they", after: "a movie." },
        ],
        correctPool: ["will play", "will visit", "will watch", "will cook", "will read", "will travel"],
        distractorPool: ["played", "visits", "watch", "cooked", "reads", "traveled"],
    },

    "punctuation::period": {
        prompt: "Punctuation: choose the period.",
        hint: "Use a period to end a statement.",
        correctFeedback: "Correct. A statement ends with a period.",
        incorrectFeedback: "Pick the mark used to end a statement.",
        sentenceFrames: [
            { before: "I like reading", after: "" },
            { before: "The dog is sleeping", after: "" },
            { before: "We finished our homework", after: "" },
            { before: "She plays the piano", after: "" },
            { before: "They cleaned the classroom", after: "" },
            { before: "He rides his bike", after: "" },
        ],
        correctPool: [".", ".", ".", ".", ".", "."],
        distractorPool: ["?", ",", "!", "?", ",", "!"],
    },
    "punctuation::question-mark": {
        prompt: "Punctuation: choose the question mark.",
        hint: "Questions end with a question mark.",
        correctFeedback: "Correct. Questions end with '?'.",
        incorrectFeedback: "Pick the punctuation mark for a question.",
        sentenceFrames: [
            { before: "Are you ready", after: "" },
            { before: "Where is my bag", after: "" },
            { before: "Can we start now", after: "" },
            { before: "Did she call you", after: "" },
            { before: "What time is lunch", after: "" },
            { before: "Do they like math", after: "" },
        ],
        correctPool: ["?", "?", "?", "?", "?", "?"],
        distractorPool: [".", ",", "!", ".", ",", "!"],
    },
    "punctuation::comma": {
        prompt: "Punctuation: choose the comma.",
        hint: "Use commas to separate items in a list.",
        correctFeedback: "Correct. A comma separates list items.",
        incorrectFeedback: "Pick the punctuation mark used in lists.",
        sentenceFrames: [
            { before: "We packed books", after: "pens and snacks." },
            { before: "I bought apples", after: "oranges and bananas." },
            { before: "She likes red", after: "blue and green." },
            { before: "Bring paper", after: "glue and scissors." },
            { before: "He saw cats", after: "dogs and birds." },
            { before: "They need milk", after: "bread and eggs." },
        ],
        correctPool: [",", ",", ",", ",", ",", ","],
        distractorPool: [".", "?", "!", ".", "?", "!"],
    },

    "sentence-structure::subject-verb": {
        prompt: "Sentence Structure: choose the correct subject-verb order.",
        hint: "Simple sentences usually start with subject then verb.",
        correctFeedback: "Correct. That sentence has proper subject-verb order.",
        incorrectFeedback: "Pick the sentence where subject comes before verb.",
        sentenceFrames: [
            { before: "Choose the correct sentence", after: ":" },
            { before: "Pick the sentence with correct order", after: ":" },
            { before: "Find the correct subject + verb sentence", after: ":" },
        ],
        correctPool: ["Birds sing.", "The cat sleeps.", "We learn.", "She dances.", "They play.", "My brother reads."],
        distractorPool: ["Sing birds.", "Sleeps the cat.", "Learn we.", "Dances she.", "Play they.", "Reads my brother."],
    },
    "sentence-structure::complete-thought": {
        prompt: "Sentence Structure: choose the complete thought.",
        hint: "A complete sentence needs a full idea.",
        correctFeedback: "Correct. That is a complete thought.",
        incorrectFeedback: "Pick the option that forms a full sentence.",
        sentenceFrames: [
            { before: "Choose the complete sentence", after: ":" },
            { before: "Pick the full thought", after: ":" },
            { before: "Find the sentence that is complete", after: ":" },
        ],
        correctPool: [
            "The baby laughed loudly.",
            "Our class finished early.",
            "The dog ran home.",
            "I cleaned my desk.",
            "They opened the door.",
            "She solved the puzzle.",
        ],
        distractorPool: ["Because it was late.", "After lunch.", "Running quickly.", "In the classroom.", "Very happy.", "On the table."],
    },
    "sentence-structure::word-order": {
        prompt: "Sentence Structure: choose the correct word order.",
        hint: "Use natural English order: subject, verb, object.",
        correctFeedback: "Correct. The words are in the right order.",
        incorrectFeedback: "Pick the option with natural word order.",
        sentenceFrames: [
            { before: "Choose the sentence with correct word order", after: ":" },
            { before: "Pick the best ordered sentence", after: ":" },
            { before: "Find the correct sequence of words", after: ":" },
        ],
        correctPool: [
            "My friend reads books.",
            "The boy kicked the ball.",
            "We watched a movie.",
            "She opened the window.",
            "They painted the wall.",
            "I wrote a letter.",
        ],
        distractorPool: [
            "Books reads my friend.",
            "Kicked the ball the boy.",
            "A movie watched we.",
            "Opened window the she.",
            "Painted the wall they.",
            "A letter wrote I.",
        ],
    },
};

const shuffleWithRandom = (items, randomFn = Math.random) => {
    const clonedItems = [...items];
    for (let index = clonedItems.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(randomFn() * (index + 1));
        [clonedItems[index], clonedItems[swapIndex]] = [clonedItems[swapIndex], clonedItems[index]];
    }
    return clonedItems;
};

const buildAspectGroups = (questions, randomFn) => {
    const groupedQuestions = new Map();

    questions.forEach((question) => {
        const aspectId = toSafeString(question?.aspectId);
        const questionId = toSafeString(question?.id);

        if (!aspectId || !questionId) {
            return;
        }

        if (!groupedQuestions.has(aspectId)) {
            groupedQuestions.set(aspectId, []);
        }

        groupedQuestions.get(aspectId).push({ ...question, id: questionId, aspectId });
    });

    return Array.from(groupedQuestions.entries()).map(([aspectId, groupQuestions]) => ({
        aspectId,
        questions: shuffleWithRandom(groupQuestions, randomFn),
    }));
};

const pickRoundRobinByAspect = (questions, pickCount, randomFn) => {
    const aspectGroups = buildAspectGroups(questions, randomFn);
    const selectedQuestions = [];
    const selectedQuestionIds = new Set();

    if (aspectGroups.length === 0 || pickCount <= 0) {
        return selectedQuestions;
    }

    while (selectedQuestions.length < pickCount) {
        const availableGroups = aspectGroups.filter((group) => group.questions.length > 0);

        if (availableGroups.length === 0) {
            break;
        }

        const visitOrder = shuffleWithRandom(availableGroups, randomFn);

        visitOrder.forEach((group) => {
            if (selectedQuestions.length >= pickCount || group.questions.length === 0) {
                return;
            }

            const nextQuestion = group.questions.shift();
            if (!selectedQuestionIds.has(nextQuestion.id)) {
                selectedQuestionIds.add(nextQuestion.id);
                selectedQuestions.push(nextQuestion);
            }
        });
    }

    return selectedQuestions;
};

const buildQuestionFromBlueprint = ({ topicKey, aspectId, questionOrdinal, blueprint }) => {
    const safeOrdinal = Math.max(1, Number.isFinite(questionOrdinal) ? Math.floor(questionOrdinal) : 1);
    const poolIndex = (safeOrdinal - 1) % Math.max(1, blueprint.correctPool.length);
    const frameIndex = (safeOrdinal - 1) % Math.max(1, blueprint.sentenceFrames.length);

    const correctAnswer = toSafeString(blueprint.correctPool[poolIndex]) || "answer";
    const distractorPool = Array.isArray(blueprint.distractorPool) ? blueprint.distractorPool : [];

    let distractor =
        toSafeString(
            distractorPool[(safeOrdinal - 1 + toSafeString(aspectId).length) % Math.max(1, distractorPool.length)]
        ) || "option";
    if (distractor.toLowerCase() === correctAnswer.toLowerCase()) {
        const alternative = distractorPool.find(
            (candidate) => toSafeString(candidate).toLowerCase() !== correctAnswer.toLowerCase()
        );
        distractor = toSafeString(alternative) || `not ${correctAnswer}`;
    }

    const sentenceFrame = blueprint.sentenceFrames[frameIndex] ?? { before: "Choose the best answer", after: ":" };
    const answerOptions = safeOrdinal % 2 === 0 ? [distractor, correctAnswer] : [correctAnswer, distractor];
    const ruleExplanation =
        toSafeString(blueprint.ruleExplanation) ||
        toSafeString(blueprint.hint) ||
        "it matches the grammar rule for this sentence.";

    return {
        id: `${topicKey}::${aspectId}::q${safeOrdinal}`,
        topicKey,
        aspectId,
        prompt: blueprint.prompt,
        sentencePrefix: sentenceFrame.before,
        sentenceSuffix: sentenceFrame.after,
        options: answerOptions,
        correctAnswer,
        hint: blueprint.hint,
        correctFeedback: blueprint.correctFeedback,
        incorrectFeedback: blueprint.incorrectFeedback,
        whyCorrect: `"${correctAnswer}" is correct because ${ruleExplanation}`,
        whyWrong: `The correct answer is "${correctAnswer}" because ${ruleExplanation}`,
    };
};

export const getRecentQuestionIds = (topicAttempts, cooldownAttemptCount = RECENT_TOPIC_ATTEMPT_COOLDOWN) => {
    if (!Array.isArray(topicAttempts) || topicAttempts.length === 0) {
        return new Set();
    }

    const safeCooldown = Math.max(0, Number.isFinite(cooldownAttemptCount) ? Math.floor(cooldownAttemptCount) : 0);
    if (safeCooldown === 0) {
        return new Set();
    }

    const recentAttempts = topicAttempts.slice(-safeCooldown);
    const recentQuestionIds = new Set();

    recentAttempts.forEach((attempt) => {
        if (!Array.isArray(attempt?.questionIds)) {
            return;
        }

        attempt.questionIds.forEach((questionId) => {
            const safeQuestionId = toSafeString(questionId);
            if (safeQuestionId) {
                recentQuestionIds.add(safeQuestionId);
            }
        });
    });

    return recentQuestionIds;
};

export const selectChallengeQuestions = ({
    questions,
    aspectCount,
    topicAttempts,
    cooldownAttemptCount = RECENT_TOPIC_ATTEMPT_COOLDOWN,
    randomFn = Math.random,
}) => {
    const safeQuestions = Array.isArray(questions) ? questions : [];
    const questionCount = getChallengeQuestionCount(aspectCount);
    const recentQuestionIds = getRecentQuestionIds(topicAttempts, cooldownAttemptCount);

    const preferredQuestions = safeQuestions.filter((question) => !recentQuestionIds.has(toSafeString(question?.id)));
    const selectedQuestions = pickRoundRobinByAspect(preferredQuestions, questionCount, randomFn);

    if (selectedQuestions.length < questionCount) {
        const alreadySelectedIds = new Set(selectedQuestions.map((question) => question.id));
        const fallbackQuestions = safeQuestions.filter((question) => !alreadySelectedIds.has(toSafeString(question?.id)));
        const fallbackSelections = pickRoundRobinByAspect(
            fallbackQuestions,
            questionCount - selectedQuestions.length,
            randomFn
        );
        selectedQuestions.push(...fallbackSelections);
    }

    return {
        questionCount,
        selectedQuestions,
        selectedQuestionIds: selectedQuestions.map((question) => question.id),
        recentQuestionIds,
    };
};

export const createTopicQuestionBank = (topicKey, aspectIds = []) => {
    const safeTopicKey = toSafeString(topicKey) || "topic";
    const uniqueAspectIds = Array.from(
        new Set(
            (Array.isArray(aspectIds) ? aspectIds : [])
                .map((aspectId) => toSafeString(aspectId))
                .filter(Boolean)
        )
    );

    return uniqueAspectIds.flatMap((aspectId) =>
        Array.from({ length: QUESTIONS_PER_ASPECT }, (_, index) => {
            const questionOrdinal = index + 1;
            const blueprintKey = `${safeTopicKey}::${aspectId}`;
            const defaultLabel = `${toDisplayLabel(safeTopicKey)} - ${toDisplayLabel(aspectId)}`;
            const blueprint = QUESTION_BLUEPRINTS[blueprintKey] ?? {
                prompt: `${defaultLabel}: choose the best answer.`,
                hint: `Focus on ${toDisplayLabel(aspectId)}.`,
                correctFeedback: `Great work on ${toDisplayLabel(aspectId)}.`,
                incorrectFeedback: `Try again and focus on ${toDisplayLabel(aspectId)}.`,
                sentenceFrames: [
                    { before: "Choose the best answer for this rule", after: ":" },
                ],
                correctPool: [toDisplayLabel(aspectId), `${toDisplayLabel(aspectId)} word`],
                distractorPool: ["run", "blue", "because", "quickly", "on", "book"],
            };

            return buildQuestionFromBlueprint({
                topicKey: safeTopicKey,
                aspectId,
                questionOrdinal,
                blueprint,
            });
        })
    );
};

export { QUESTIONS_PER_ASPECT, RECENT_TOPIC_ATTEMPT_COOLDOWN };
