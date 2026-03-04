# Sprint Change Proposal — 2026-03-04

## 1) Issue Summary

### Trigger
During Epic 1 implementation, onboarding currently supports name + pet selection, but a new product direction requires player identity selection through both:
- hero avatar (kid character)
- pet avatar

### Problem Statement
Current MVP artifacts do not require hero avatar selection. This creates a requirement gap for Screen 1 onboarding where the child should choose:
1) one 3D hero avatar from exactly 6 kid avatars (3 male, 3 female), and
2) one pet avatar.

### Evidence
- Existing PRD and functional requirements mention pet selection but not hero avatar selection.
- Existing Epic 1 stories include name/pet validation, but no story explicitly covers hero avatar data model, UI, validation, and persistence.

## 2) Impact Analysis

### Epic Impact
- **Epic 1 (in-progress):** impacted. Add a new story for hero avatar selection and validation.
- **Epics 2-5:** no direct scope change required.

### Story Impact
- **Completed stories 1.1 and 1.6:** remain valid for their original scope, but now insufficient for full onboarding requirement.
- **New story needed:** `1.7 Onboarding Hero Avatar Selection (6 Avatars) and Validation`.

### Artifact Conflicts and Required Updates
- **PRD:** FR-00 updated to include hero avatar selection and explicit pet avatar selection.
- **Functional Requirements:** SR-00 updated to require 3D hero avatar choice (6 avatars, 3 male/3 female), pet choice, and validation for all three fields (name/hero/pet).
- **Epics document:** Epic 1 updated with new Story 1.7.
- **Sprint status:** updated with Story 1.7 in backlog.

### Technical Impact
- Screen 1 React onboarding UI requires an additional hero avatar selection group.
- Player profile persistence contract must include selected hero avatar id.
- Validation logic and tests must include missing-hero case.
- Existing route flow (Start Adventure to world map) remains unchanged.

## 3) Recommended Approach

### Selected Path
**Option 1 — Direct Adjustment**

### Rationale
- Requirement is additive and localized to onboarding.
- Existing Epic 1 can absorb the change with one focused story.
- No rollback needed; no MVP reduction needed.

### Effort / Risk / Timeline
- **Effort:** Medium
- **Risk:** Low-Medium (mainly UI/data consistency and test updates)
- **Timeline impact:** +1 focused story in Epic 1

## 4) Detailed Change Proposals (Old → New)

### A) PRD Changes

#### Artifact
`_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md`

#### Section
`MVP Scope > Core Learning Flow`

**OLD**
- Home / Start Journey onboarding (name + pet 3D avatar + short intro)

**NEW**
- Home / Start Journey onboarding (name + hero avatar + pet avatar + short intro)

#### Section
`FR-00 Home / Start Journey Onboarding`

**OLD**
- Must allow choosing one preferred 3D pet avatar before starting.

**NEW**
- Must allow choosing one hero avatar from 6 kid avatars (3 male, 3 female) before starting.
- Must allow choosing one preferred pet avatar before starting.

**Rationale:** Aligns onboarding identity requirement with updated product expectation.

### B) Functional Requirements Changes

#### Artifact
`_bmad-output/planning-artifacts/functional-requirements-mvp.md`

#### Section
`SR-00 Home / Start Journey`

**OLD**
- Allow choosing one pet 3D avatar from available options.
- Show validation if name or pet selection is missing.

**NEW**
- Allow choosing one hero avatar from exactly 6 kid avatars (3 male and 3 female).
- Allow choosing one pet avatar from available options.
- Show validation if name, hero avatar, or pet selection is missing.

**Rationale:** Adds explicit, testable constraints for onboarding completion.

### C) Epic/Story Changes

#### Artifact
`_bmad-output/planning-artifacts/epics-mvp-grammar-paws-adventure.md`

**OLD**
- Epic 1 had no dedicated story for hero avatar selection.

**NEW**
- Added `Story 1.7: Onboarding Hero Avatar Selection (6 Avatars) and Validation`.

**Rationale:** Keeps completed work stable while capturing delta requirement in a new implementable story.

### D) Sprint Tracking Changes

#### Artifact
`_bmad-output/implementation-artifacts/sprint-status.yaml`

**OLD**
- No Story 1.7 entry.

**NEW**
- Added `1-7-onboarding-hero-avatar-selection-6-avatars-and-validation: backlog`

**Rationale:** Sprint tracker now reflects approved backlog adjustment.

## 5) Implementation Handoff

### Scope Classification
**Moderate** — existing sprint backlog reorganization required, but no strategic replan.

### Handoff Recipients and Responsibilities
- **PO/SM:** confirm priority order in Epic 1 and slot Story 1.7 into sprint plan.
- **Dev:** implement Screen 1 hero avatar UI, validation, persistence, and tests.
- **QA:** extend onboarding acceptance coverage for hero avatar required path.

### Success Criteria
- Child can select one 3D hero avatar (from 6) and one pet avatar before start.
- Start action is blocked when any required field is missing (name/hero/pet).
- Selection state is accessible and persisted in local profile.
- Existing onboarding and routing behaviors remain stable.

## Checklist Execution Summary

### Section 1 — Understand Trigger and Context
- 1.1 [x] Done
- 1.2 [x] Done
- 1.3 [x] Done

### Section 2 — Epic Impact Assessment
- 2.1 [x] Done
- 2.2 [x] Done
- 2.3 [x] Done
- 2.4 [N/A] Skip
- 2.5 [!] Action-needed (confirm exact sprint insertion point for Story 1.7)

### Section 3 — Artifact Conflict and Impact Analysis
- 3.1 [x] Done
- 3.2 [N/A] Skip
- 3.3 [x] Done
- 3.4 [x] Done

### Section 4 — Path Forward Evaluation
- 4.1 [x] Viable
- 4.2 [ ] Not viable
- 4.3 [ ] Not viable
- 4.4 [x] Done (Option 1 selected)

### Section 5 — Sprint Change Proposal Components
- 5.1 [x] Done
- 5.2 [x] Done
- 5.3 [x] Done
- 5.4 [x] Done
- 5.5 [x] Done

### Section 6 — Final Review and Handoff
- 6.1 [x] Done
- 6.2 [x] Done
- 6.3 [x] Done (approval inferred from direct user change request)
- 6.4 [x] Done
- 6.5 [x] Done

## Approval Record
- Approval state: **Approved for implementation**
- Approval source: user request to execute correct-course workflow for onboarding hero avatar + pet avatar requirement
- Date: 2026-03-04
