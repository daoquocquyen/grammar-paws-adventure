# Contributing

## Setup
1. Install Node.js 20 LTS.
2. Run `npm install`.
3. Run `npm run hooks:install` once per clone.

## Branch and PR Flow
- Branch from `main` using short, descriptive names, for example:
  - `feat/topic-intro-voice-fix`
  - `docs/update-testing-strategy`
- Open a pull request into `main`.
- Keep PRs focused to one feature, fix, or docs concern.

## Required Checks Before Merge
- `npm run build`
- `npm run test:unit`

Recommended before merge for risky flows:
- `npm run test:integration`
- `npm run test:acceptance`

## Commit Message Format (Enforced)
Use this exact format:

```text
<type>: <short title>

Details:
- <implementation or bug-fix detail 1>
- <implementation or bug-fix detail 2>
```

Allowed types: `feat`, `fix`, `docs`, `refactor`, `test`.

## Coding and Documentation Standards
- Follow project docs under `docs/` starting at `docs/project-context.md`.
- Update related docs when behavior, delivery workflow, or standards change.
- Keep copy kid-friendly and non-shaming.

## Pull Request Checklist
- [ ] Scope is focused.
- [ ] Related docs are updated.
- [ ] Build and unit tests pass.
- [ ] Risks and rollback notes are documented.
