# Epics and Stories — Grammar Paws Adventure MVP

## Epic 1: Foundation Onboarding and Returning Session
Goal: Child can start quickly, and returning learners continue without repeating onboarding.

### Story 1.1: Onboarding Name and Pet Selection Validation
As a child learner,
I want to enter my name and pick a pet,
so that I can start my learning journey with my own companion.

### Story 1.2: Persist Player Profile After Start Journey
As the system,
I want to save player name and selected pet in versioned local storage,
so that the learner does not lose identity on refresh.

### Story 1.3: Persist and Restore Progress and Accessories for Returning Learner
As a returning child learner,
I want my progress and pet accessories restored automatically,
so that I can continue next day without redoing onboarding.

### Story 1.4: Topic Selection Routes to Topic Intro First
As a learner,
I want every topic start to open intro first,
so that I always see rules and examples before challenge.

### Story 1.5: Topic Intro Rendering and Voice Controls
As a learner,
I want intro content with replay and mute support,
so that I can understand the topic in a friendly way.

### Story 1.7: Onboarding 3D Hero Avatar Selection (6 Avatars) and Validation
As a child learner,
I want to choose my 3D hero avatar from 6 kid avatars (3 male and 3 female) and also choose my pet avatar,
so that my learning journey feels personal from the first screen.

## Epic 2: Challenge Engine and Explanations
Goal: Core challenge loop works with deterministic rules and immediate learning feedback.

### Story 2.1: Challenge Question Count Formula
As the system,
I want challenge question count to use clamp(aspect_count * 3, 6, 15),
so that each challenge has age-appropriate length.

### Story 2.2: Diverse Question Selection with Cooldown
As a learner,
I want varied questions across attempts,
so that retries feel fresh and useful.

### Story 2.3: Immediate Correctness and Explanation Feedback
As a learner,
I want explanation after every answer,
so that I understand why choices are right or wrong.

### Story 2.4: Challenge Voice Replay and Safe Fallback
As a learner,
I want replay voice where available and non-blocking text fallback where unavailable,
so that gameplay always continues.

## Epic 3: Results Pass Rule and Retry Loop
Goal: Clear progress outcome with supportive fail/retry and pass continuation.

### Story 3.1: Score Calculation and Pass Threshold
As the system,
I want pass/fail computed at >= 80%,
so that progression is consistent and fair.

### Story 3.2: Fail Path Supportive Retry Experience
As a learner,
I want encouraging retry guidance when I fail,
so that I can improve without frustration.

### Story 3.3: Pass Path Continue to Reward
As a learner,
I want successful completion to continue to reward selection,
so that effort feels meaningful.

## Epic 4: Rewards and Pet Customization
Goal: Rewards are earned and visibly applied to the learner's pet.

### Story 4.1: Reward Selection One of Three Options
As a learner,
I want to choose one reward from three options,
so that passing a topic gives a clear prize moment.

### Story 4.2: Persist Accessory Unlock and Equip State
As a learner,
I want unlocked and equipped accessories saved and restored,
so that my pet look remains consistent across sessions.

## Epic 5: Evolution and Dashboard
Goal: Long-term motivation through milestones and transparent progress.

### Story 5.1: Milestone Evolution Trigger and Celebration
As a learner,
I want evolution milestones to trigger at configured thresholds,
so that progress feels exciting.

### Story 5.2: Progress Dashboard for Learner and Caregiver
As learner/caregiver,
I want clear progress summaries,
so that learning advancement is easy to understand.
