# Google Stitch Prompt Pack — Grammar Paws Adventure MVP

Use these prompts directly in Google Stitch. Keep visual style consistent across all screens.

## Global Style Prompt (paste once before generating screens)
Design a kid-friendly web app UI for an 11-year-old non-native English learner. Product name: Grammar Paws Adventure.

Style goals:
- Warm, playful, cozy fantasy vibe
- Clear readability and simple layout
- Large tap targets and minimal text per section
- Encouraging tone, no negative language
- One primary action per screen

Design constraints:
- Responsive for tablet-first and mobile-friendly
- Include visible states: default, loading, empty, and error where relevant
- Keep component structure reusable across screens (header, card, progress bar, CTA buttons)
- Support accessibility basics (high contrast text, clear hierarchy, icon + text labels)

Required shared UI elements:
- Persistent top bar: player name, pet avatar, mute/unmute voice icon
- Progress indicator for topic/challenge flow
- Friendly helper text area for kid-friendly guidance

---

## Screen 1 — Home / Start Journey (Kid Onboarding)
Create a simple home onboarding screen for the child to start playing immediately.

Must include:
- App title and short value statement
- Short game introduction (2-3 lines, kid-friendly)
- Name input for player
- 3D pet avatar chooser (at least 3 pet options with rotate/preview affordance)
- Selected pet preview card
- Primary CTA: "Start Adventure"
- Secondary CTA: "Random Pet"

Navigation requirement:
- When child taps "Start Adventure", route directly to World Map / Topic Selection.


States:
- Validation error for missing name or no pet selected
- Loading state on continue

Tone:
- Exciting, playful, and very simple for kids to understand

---

## Screen 2 — World Map / Topic Selection
Create a world map style topic selection screen.

Must include:
- 8 grammar topic cards with lock/completed/in-progress states
- Topic metadata per card: title, difficulty, progress percent
- Visual path map or simple grid with progression feel
- Primary CTA on selected card: "Start Topic"
- Secondary CTA: "View Progress"

States:
- Empty state when no topic started
- Locked-topic tooltip state

Tone:
- Adventure and exploration feeling, clear next step

---

## Screen 3 — Grammar Topic Intro (aspects + use cases)
Create a pre-challenge intro screen shown every time a topic starts.

Must include:
- Topic title and "What you’ll learn" summary
- List of common aspects/rules for this topic
- For each aspect, show one use-case example sentence
- Voice controls: mute/unmute and replay narration
- Primary CTA: "Start Challenge"
- Secondary CTA: "Back to Map"

States:
- Loading topic content
- Error state if topic data unavailable

Tone:
- Teacher-pet guide voice, short and fun explanations

---

## Screen 4 — Challenge Screen
Create a challenge screen for answering grammar questions.

Must include:
- Question prompt card
- Answer options (tap friendly)
- Per-question progress indicator
- Voice replay control for current question
- Immediate feedback panel after answer:
  - Correct/incorrect result
  - Short kid-friendly explanation (funny/warm)
- Primary CTA after feedback: "Next Question"

Rules to reflect in UI copy/structure:
- Number of questions depends on topic aspects
- Child must score >=80% to pass

States:
- Loading next question
- Disabled submit until option selected
- Error state for question load failure

Tone:
- Encouraging and playful, never shaming

---

## Screen 5 — Results + Feedback
Create an end-of-challenge results screen.

Must include:
- Score summary (correct/total and percent)
- Pass/fail badge using >=80% threshold
- If pass: celebration message + CTA "Claim Reward"
- If fail: supportive retry message + CTA "Try Again"
- Secondary CTA: "Back to Map"
- Focus-aspects card (what to practice if failed)

States:
- Pass state
- Fail state

Tone:
- Positive and confidence-building in both outcomes

---

## Screen 6 — Reward Selection (Accessories)
Create a reward claim screen shown only on pass.

Must include:
- 3 accessory choices (card layout)
- Preview on pet when selecting each option
- Primary CTA: "Claim This Reward"
- Secondary CTA: "Decide Later"

States:
- Claimed success state
- Already-claimed state

Tone:
- Exciting, celebratory, choice-driven

---

## Screen 7 — Pet Home / Customization
Create a pet home screen for equipment and customization.

Must include:
- Main pet display with equipped accessories
- Accessory inventory grid
- Equip/unequip interaction
- Evolution progress meter
- Primary CTA: "Continue Adventure"
- Secondary CTA: "Go to Dashboard"

States:
- Empty inventory state
- New item highlight state

Tone:
- Cozy, playful, ownership and creativity

---

## Screen 8 — Evolution Milestone Celebration
Create a milestone celebration screen when evolution unlocks.

Must include:
- Before/after pet evolution visual
- Milestone summary (e.g., completed 2 topics)
- Unlock highlights
- Primary CTA: "See My Pet"
- Secondary CTA: "Next Topic"

States:
- Standard milestone
- Major milestone variation

Tone:
- Magical and proud, brief but memorable

---

## Screen 9 — Progress Dashboard
Create a child + parent-friendly progress dashboard.

Must include:
- Topic completion overview
- Recent scores and pass rate
- Current evolution stage and points to next milestone
- Weekly summary card in simple language
- Primary CTA: "Pick Next Topic"

States:
- No-history empty state
- Loading charts/cards state

Tone:
- Informative but friendly, simple wording

---

## Optional Master Prompt (generate all at once)
Design the full MVP UI for Grammar Paws Adventure with these screens in one coherent design system:
1) Home/Start Journey (kid onboarding)
2) World Map/TopicSelection
3) Grammar Topic Intro
4) Challenge Screen
5) Results+Feedback
6) Reward Selection
7) Pet Home/Customization
8) Evolution Milestone Celebration
9) Progress Dashboard

Hard requirements to reflect in UI:
- First screen lets kid enter name, choose a 3D pet avatar, read a short game intro, then start journey
- Topic Intro always appears before Challenge
- Intro shows topic aspects + one use-case example each
- Challenge feedback includes kid-friendly explanation for right and wrong answers
- Pass threshold is >=80%
- Voice controls (mute/replay) on intro and challenge
- Replays of same topic should feel varied (UI should support non-repetitive question flow)

Use consistent component primitives and maintain kid-friendly accessibility throughout.
