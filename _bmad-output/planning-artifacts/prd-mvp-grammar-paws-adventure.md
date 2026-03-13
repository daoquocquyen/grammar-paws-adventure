# PRD — Grammar Paws Adventure (MVP)

## 1) Product Summary
Grammar Paws Adventure is a kid-first web game for an 11-year-old non-native English learner. The product teaches grammar through short playful quests, clear explanations, and pet progression rewards.

## 2) Goals
- Make grammar feel like play in 2–5 minute sessions.
- Improve topic mastery through repeated, varied practice.
- Keep motivation healthy: encouraging feedback, no punishment loops.
- Deliver a lightweight MVP that can expand later.

## 3) Non-Goals (MVP)
- Multiplayer/social gameplay
- Cloud sync and multi-device account linking
- Multiple pet species
- Advanced voice customization

## 4) Target User
- Primary: child learner (age 11, non-native English)
- Secondary: caregiver/guardian (optional progress visibility)

## 5) User Experience Principles
- One clear task per screen
- Friendly, funny, encouraging language
- Fast recovery after mistakes
- Visible progress and meaningful rewards
- Accessibility-first readability and touch targets

## 6) MVP Scope
### Core Learning Flow
1. Home / Player Select (existing learners with name + hero + pet avatar + New User CTA)
2. Onboarding / Start Journey (name + 3D hero avatar + pet avatar + short intro)
3. Topic selection
4. Grammar Topic Intro screen
5. Challenge questions
6. Per-question explanation feedback
7. Results + pass/fail logic
8. Reward selection (if passed)
9. Pet customization and milestone evolution

### Core Topics (first 8)
1. Nouns (common/proper)
2. Articles (a/an/the)
3. Pronouns (subject/object basics)
4. Verb “to be” + present simple
5. Adjectives
6. Prepositions of place
7. Present continuous vs simple present (intro)
8. Basic punctuation

## 7) Functional Requirements (High-Level)
### FR-00 Home / Player Select + Onboarding
- First screen must be child-friendly and simple.
- First screen must show existing learner cards using stored profile data (name, hero avatar, pet avatar).
- First screen must include a `New User` action that routes to onboarding.
- Selecting an existing learner card must set active learner context and route directly to topic selection.
- Onboarding must include player name input.
- Onboarding must allow choosing one 3D hero avatar from 8 kid avatars (4 male, 4 female) before starting.
- Onboarding must allow choosing one preferred pet avatar before starting.
- Onboarding must include a short game introduction.
- Onboarding must provide `Start Adventure` action that creates/updates learner profile and routes to topic selection.

### FR-01 Grammar Topic Intro Screen
- Must appear before challenge starts for every topic attempt.
- Must list common aspects/rules for the topic.
- Must provide at least one use-case example per aspect.
- Pet voice reads intro content.

### FR-02 Challenge Generation
- Number of questions depends on topic aspect count.
- Default formula: questions = clamp(aspect_count * 3, min 6, max 15).
- Question selection must vary across replays using anti-repeat logic.
- Answer options must be capped at 4 for MVP.
- Drag interactions must use single-word drag only.

### FR-03 Answer Evaluation + Explanation
- Challenge must use 2 independent attempts plus 1 assisted resolution stage.
- Attempt 1: all options available; if incorrect, enter guided retry.
- Attempt 2 (guided retry): previously selected incorrect option is disabled; hero gives concept guidance without revealing answer.
- Assisted stage: hero gives step-by-step explanation, reveals correct answer with reasoning, and waits for learner acknowledgment.
- Before answer submission, hero gives hint-oriented guidance (word-function question style) and must not reveal the answer.
- After answer submission, hero gives explanation-style feedback including why the selected answer fits or not.
- Feedback language must stay encouraging and playful and must avoid punitive labels (e.g., no "Wrong" labels or red failure counters).
- Hero explanation should appear after a short delay (400-600ms) following answer interaction.

### FR-04 Pass/Fail Rule
- Passing score is >=80% correct.
- Retry model must be finite (no unlimited retries): 2 attempts + assisted resolution.
- "Continue" action appears after first-try correct, second-try correct, or assisted acknowledgment.

### FR-05 Voice Narration
- Pet voice reads topic intro and each question.
- Provide mute/unmute and replay controls.
- Must gracefully degrade if speech is unavailable/blocked.

### FR-06 Rewards and Progression
- Pass grants reward selection (1 of 3 accessories).
- Track topic completion and mastery progress.
- Every 2 completed topics can trigger evolution milestone.
- Base XP per question: first-try correct = 10, second-try correct = 6, assisted resolution = 3, skip = 0.
- Streak bonus: 3 first-try correct = +5 XP; 5 first-try correct = +10 XP.
- End-of-level bonuses:
  - 70%+ first-try accuracy = +20 XP.
  - Corrected 3+ mistakes = +10 XP persistence bonus.
- XP messaging must remain supportive and short.

### FR-07 Progress Dashboard
- Show completed topics, attempts, mastery trend, and streak summary.
- Parent-friendly summary view in simple language.
- Challenge performance indicators should show learning quality:
  - ⭐ first-try correct
  - ☆ second-try correct
  - ✓ assisted learning

## 8) Success Metrics
- Topic completion rate/week
- Pass rate at first attempt vs after retry
- Average session duration (target 2–5 min)
- Question-bank variety score (low repeat ratio)
- Voice feature usage rate (play/replay/mute)
- Child frustration indicators (drop-off after wrong answer)

## 9) Risks and Mitigations
- Repetitive questions reduce engagement -> enforce recent-question cooldown.
- Cognitive overload on intro screen -> concise aspects and examples.
- Audio permission issues -> fallback to text-first with optional manual replay.
- Harsh feedback tone -> centralized kid-friendly copy library.

## 10) Release Criteria (MVP)
- All must-have screens functional end-to-end.
- 8 grammar topics configured with aspects and question bank.
- Pass/fail and reward flow stable.
- Voice narration and fallback behavior verified.
- Child playtest passes clarity and enjoyment checks.
