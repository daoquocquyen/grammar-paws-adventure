# Story 1.6: React Reusable UI Components and Screen 1 Refactor

Status: ready-for-dev

## Story

As a developer,
I want Screen 1 React UI split into reusable components,
so that future screens can share consistent UI and reduce duplicated code.

## Acceptance Criteria

1. Extract reusable React components from `app/page.js` without changing existing user-visible behavior.
2. Create at minimum reusable components for: header block, pet option card, validation message, and primary CTA button.
3. Keep Story 1.1 onboarding behavior intact: name required, pet required, ARIA feedback, and valid-path route navigation.
4. Keep existing visual design/tokens intact (no redesign, no new UI features).
5. `npm run build` passes after refactor.

## Tasks / Subtasks

- [ ] Create reusable component structure for Screen 1
  - [ ] Add `src/components/` (or equivalent) for shared UI elements
  - [ ] Implement `Header` component used by Screen 1
  - [ ] Implement `PetOptionCard` component used in pet selection grid
  - [ ] Implement `ValidationMessage` component for inline feedback
  - [ ] Implement `PrimaryButton` component for main CTA
- [ ] Refactor Screen 1 page to use new components
  - [ ] Replace duplicated JSX blocks with component usage
  - [ ] Preserve current state/validation/navigation behavior
- [ ] Keep migration boundaries explicit
  - [ ] Do not implement new product features in this story
  - [ ] Do not alter Story 1.2+ behavior scope
- [ ] Validate refactor
  - [ ] Run `npm run build`
  - [ ] Verify onboarding manual flow remains unchanged

## Dev Notes

### Context
- This is a technical refactor story to improve maintainability during Next.js migration.
- It should not change product behavior established by Story 1.1.

### Current Source
- Primary file to refactor: `app/page.js`.
- Supporting runtime files: `app/layout.js`, `app/globals.css`, Tailwind config.

### Guardrails
- Preserve UX exactly as-is for Screen 1.
- Keep styling aligned with current Tailwind tokens and class patterns.
- Prefer small, focused components with clear props.

### Testing
- No automated test harness yet; required checks:
  - `npm run build` passes
  - Name/pet validation still blocks invalid start
  - Successful path still routes to `/screen2-world-map-topic-selection`

## Dev Agent Record

### Agent Model Used
GPT-5.3-Codex

### Debug Log References

### Completion Notes List

### File List
- _bmad-output/implementation-artifacts/1-6-react-reusable-ui-components-and-screen1-refactor.md

### Change Log
- 2026-03-02: Story created for componentization refactor after Next.js migration bootstrap.
