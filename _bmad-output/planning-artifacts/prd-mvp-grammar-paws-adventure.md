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
1. Home / Start Journey onboarding (name + 3D hero avatar + pet avatar + short intro)
2. Topic selection
3. Grammar Topic Intro screen
4. Challenge questions
5. Per-question explanation feedback
6. Results + pass/fail logic
7. Reward selection (if passed)
8. Pet customization and milestone evolution

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
### FR-00 Home / Start Journey Onboarding
- First screen must be child-friendly and simple.
- Must include player name input.
- Must allow choosing one 3D hero avatar from 6 kid avatars (3 male, 3 female) before starting.
- Must allow choosing one preferred pet avatar before starting.
- Must include a short game introduction.
- Must provide Start Adventure action that routes to topic selection.

### FR-01 Grammar Topic Intro Screen
- Must appear before challenge starts for every topic attempt.
- Must list common aspects/rules for the topic.
- Must provide at least one use-case example per aspect.
- Pet voice reads intro content.

### FR-02 Challenge Generation
- Number of questions depends on topic aspect count.
- Default formula: questions = clamp(aspect_count * 3, min 6, max 15).
- Question selection must vary across replays using anti-repeat logic.

### FR-03 Answer Evaluation + Explanation
- After each answer, show whether answer is correct.
- Show short child-friendly explanation for correct and incorrect choices.
- Keep tone encouraging and playful.

### FR-04 Pass/Fail Rule
- Passing score is >=80% correct.
- On fail, provide supportive retry and targeted hints.

### FR-05 Voice Narration
- Pet voice reads topic intro and each question.
- Provide mute/unmute and replay controls.
- Must gracefully degrade if speech is unavailable/blocked.

### FR-06 Rewards and Progression
- Pass grants reward selection (1 of 3 accessories).
- Track topic completion and mastery progress.
- Every 2 completed topics can trigger evolution milestone.

### FR-07 Progress Dashboard
- Show completed topics, attempts, mastery trend, and streak summary.
- Parent-friendly summary view in simple language.

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
