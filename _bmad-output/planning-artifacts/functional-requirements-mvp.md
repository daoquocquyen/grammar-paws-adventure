# Functional Requirements — Grammar Paws Adventure MVP

## 1) Domain Model Requirements

### Entity: GrammarTopic
- Fields: id, title, difficulty_level, ordered_aspects[]
- Constraint: ordered_aspects length >= 2 for MVP topics

### Entity: GrammarAspect
- Fields: id, topic_id, rule_text, use_case_example
- Constraint: each aspect must have at least one example

### Entity: Question
- Fields: id, topic_id, aspect_id, prompt, options[], correct_option, explanation_correct, explanation_wrong
- Constraint: explanation fields required

### Entity: QuestionAttempt
- Fields: id, topic_id, question_id, selected_option, is_correct, shown_at

### Entity: TopicAttempt
- Fields: id, topic_id, question_count, correct_count, score_percent, passed, started_at, ended_at

### Entity: PlayerProgress
- Fields: completed_topics[], mastery_by_topic, evolution_points, unlocked_accessories[]

### Entity: VoiceSettings
- Fields: muted, selected_voice(optional), rate(default), pitch(default)

## 2) Screen-Level Functional Requirements

### SR-00 Home / Start Journey
- Must be the first screen for a new/local player profile.
- Capture player name input.
- Allow choosing one 3D hero avatar from exactly 6 kid avatars (3 male and 3 female).
- Allow choosing one pet avatar from available options.
- Display a short game introduction (2-3 short lines).
- Primary CTA starts journey and routes to World Map / Topic Selection.
- Show validation if name, hero avatar, or pet selection is missing.

### SR-01 World Map / Topic Selection
- Show available topics with progress state.
- Entering a topic must always route to Topic Intro first.

### SR-02 Grammar Topic Intro
- Display topic title and short objective.
- Render all common aspects for topic.
- Render one use case example per aspect.
- Include controls: Start Challenge, Replay Voice, Mute/Unmute.
- Pet voice reads intro summary and each aspect block sequentially.

### SR-03 Challenge Screen
- Determine question_count from aspect_count formula.
- Formula: question_count = clamp(aspect_count * 3, 6, 15).
- Select diverse questions across aspects.
- Exclude recent questions from last N topic attempts (default N=2) where possible.
- For each submitted answer, immediately show correctness + kid-friendly explanation.
- Include Replay Voice for current question.

### SR-04 Results + Feedback
- Compute score_percent = correct_count / question_count * 100.
- Pass if score_percent >= 80.
- If pass: show celebrate state + Continue to Reward.
- If fail: show supportive retry state + personalized “focus aspects” list.

### SR-05 Reward Selection
- On pass, offer exactly 3 accessory options.
- Player selects 1; save to unlocked_accessories.

### SR-06 Pet Home / Customization
- Equip/unequip unlocked accessories.
- Reflect selected accessory instantly on pet view.

### SR-07 Evolution Milestone
- Trigger when completion milestones reached (default: every 2 completed topics).
- Show celebration screen and updated evolution stage.

### SR-08 Progress Dashboard
- Show topic completion, pass attempts, recent scores, and evolution progress.
- Include simple summary text readable by kids and caregivers.

## 3) Question Bank and Variation Requirements
- Minimum per aspect: 12 questions in bank for MVP.
- Minimum topic bank size = aspect_count * 12.
- Challenge generator should maximize aspect coverage before repeating same aspect.
- Must produce different question sets on consecutive retries unless pool exhausted.

## 4) Feedback Copy Requirements
- Explanation style: short, warm, funny, and constructive.
- Max 2 sentences per explanation.
- Wrong-answer explanation includes: why wrong + quick hint.
- Correct-answer explanation includes: why right + confidence boost.
- Prohibited copy: shame, blame, negative labels.

## 5) Voice Narration Requirements
- Narration targets: topic intro content and question prompt.
- Controls: Mute/Unmute global toggle, Replay current narration.
- If browser speech synthesis unavailable, hide replay and show text fallback note.
- Narration must never block gameplay progression.

## 6) Acceptance Criteria

### AC-01 Intro Coverage
- Given a topic with aspects, when user starts topic, then intro screen appears first.
- And each aspect and example is visible before challenge start.

### AC-02 Question Count
- Given topic with 4 aspects, question_count resolves to 12.
- Given topic with 1 aspect, question_count resolves to min cap 6.
- Given topic with 8 aspects, question_count resolves to max cap 15.

### AC-03 Pass Threshold
- Given 10 questions and 8 correct, passed=true.
- Given 10 questions and 7 correct, passed=false and retry shown.

### AC-04 Explanation on Every Answer
- Given any answer submission, explanation panel always appears.
- Explanation uses tone rules and includes rule-specific reasoning.

### AC-05 Question Variety
- Given repeated topic attempts, question set differs from previous attempt unless pool exhausted.

### AC-06 Voice Controls
- Given voice enabled, intro and question narration play.
- Given mute enabled, no narration plays.
- Given replay tapped, current intro segment/question replays.
- Given no voice support, user can still complete flow without errors.

## 7) Out of Scope for MVP
- Dynamic AI-generated questions
- Teacher dashboard and classroom reports
- Cloud profile sync
