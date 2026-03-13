# Implementation Plan — Feature-by-Feature and Screen-by-Screen

## Approach
Build vertical slices that are independently testable and demoable. Each slice includes UI + logic + local data handling.

## Slice 1: Foundation + Topic Intro (Screen-first)
### Screens
- Home / Player Select
- Onboarding / Start Journey
- World Map / Topic Selection
- Grammar Topic Intro

### Features
- Existing player card list (name + hero + pet avatar) on home
- New User routing from home to onboarding
- Local player profile creation (name)
- Hero and pet avatar selection on onboarding
- Short game introduction on onboarding
- Topic metadata loading (aspects + examples)
- Intro screen with pet voice and controls

### Done Criteria
- Child can select an existing profile on home and continue directly to world map.
- Child can tap New User, enter name, choose hero/pet avatar, and start journey from onboarding.
- Selecting a topic always opens intro first.
- Intro displays all aspects with examples.
- Narration replay/mute works or degrades safely.

## Slice 2: Challenge Engine + Explanations
### Screens
- Challenge Screen

### Features
- Aspect-based question count formula
- Question randomization + cooldown anti-repeat
- Real-time answer evaluation
- Kid-friendly right/wrong explanations
- Question narration replay

### Done Criteria
- Question count follows clamp formula.
- Explanations shown after every answer.
- Consecutive attempts produce varied sets.

## Slice 3: Results, Pass Rule, Retry Loop
### Screens
- Results + Feedback

### Features
- Score calculation and >=80% pass gating
- Fail path with supportive retry and focus aspects
- Pass path continuation trigger

### Done Criteria
- 80% threshold behavior correct for edge cases.
- Retry flow keeps encouragement tone and no dead-ends.

## Slice 4: Rewards + Pet Customization
### Screens
- Reward Selection
- Pet Home / Customization

### Features
- Offer 3 accessory choices on pass
- Persist unlock/equip state locally
- Update pet visuals

### Done Criteria
- Reward claim updates inventory instantly.
- Equipped accessory survives refresh.

## Slice 5: Evolution + Dashboard
### Screens
- Evolution Milestone Celebration
- Progress Dashboard

### Features
- Evolution trigger every 2 completed topics
- Progress summaries for learner and parent

### Done Criteria
- Milestone triggers once per threshold crossing.
- Dashboard shows attempts, pass rate, topic status.

## Suggested Build Order Inside Each Slice
1. Static screen shell
2. Data contracts and local storage model
3. Interaction logic
4. Voice support and fallback
5. Acceptance tests for slice

## Suggested Ticket Breakdown Template
- UI task
- State/data task
- Rules logic task
- Content/copy task
- QA acceptance task

## QA Gate per Slice
- Functional acceptance checks pass
- No blocker UX confusion in child walkthrough
- No crash when speech synthesis unavailable
- Mobile touch targets and readability validated
