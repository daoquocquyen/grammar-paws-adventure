# Security Baseline

## Scope
Frontend/browser security baseline for the current static MVP codebase.

## Threat Surface (Current)
- User-provided strings (player name) persisted in localStorage.
- Dynamic DOM updates in topic intro screen.
- External third-party resources loaded from CDNs.
- Browser API usage (`speechSynthesis`).
- Client-side navigation and local state as primary control plane.

## Mandatory Checklist: Input/Output Safety
- [ ] Validate player name length and allowed characters before storing.
- [ ] Do not render untrusted strings with raw `innerHTML`.
- [ ] Keep all parse operations wrapped in `try/catch`.
- [ ] Provide non-crashing fallback state on malformed local data.

## Mandatory Checklist: Browser Storage
- [ ] Store only non-sensitive gameplay/profile data in localStorage.
- [ ] Never store API tokens, credentials, or secrets in localStorage.
- [ ] Version keys (`*_v1`) and migrate safely when schema changes.
- [ ] Handle missing/corrupted keys without app breakage.
- [ ] Keep persisted child profile minimal (display name + game state only, no sensitive identifiers).
- [ ] Provide clear local reset path for caregiver/learner to clear device-stored profile data.

## Mandatory Checklist: Dependencies and External Assets
- [ ] Review every external script/font/image domain before adding.
- [ ] Prefer pinned dependency versions and commit lockfile updates with dependency changes.
- [ ] Add integrity/CSP strategy when production bundling is introduced (TBD).
- [ ] Minimize third-party domains to reduce supply-chain risk.

## Mandatory Checklist: Navigation and Client Logic
- [ ] Verify all intra-app routes resolve to real files.
- [ ] Block dead-end states in pass/fail/retry flows.
- [ ] Keep rule enforcement deterministic and testable (not only visual).
- [ ] Ensure browser API failure (voice unsupported) does not block progress.

## Secrets Handling Policy
- No secrets are allowed in frontend HTML/JS files.
- If backend/API is introduced later:
  - use server-side secret storage only,
  - provide public config via safe runtime vars,
  - keep secret scanning in CI (GitHub security workflow + secret scanning).

## Dependency Hygiene Policy
- Current status:
  - npm manifest and lockfile are present.
  - Dependabot is configured for npm and GitHub Actions.
  - Dependency review is enforced on pull requests via GitHub Actions.
- Interim control:
  - track all CDN endpoints in architecture docs,
  - review external changes during each release,
  - avoid unreviewed script additions.

## Current Gaps to Close Next
- CSP policy: TBD.
- Subresource Integrity for CDN scripts: TBD.
- Security test automation: TBD.

## Source References
- `src/ui/stitch/screen1-home-start-journey.html`
- `src/ui/stitch/screen2-world-map-topic-selection.html`
- `src/ui/stitch/screen3-grammar-topic-intro.html`
- `src/ui/stitch/screen4-game-challenge.html`
