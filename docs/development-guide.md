# Development Guide

## Branching Model
- Default model: trunk-based development on protected `main`.
- Work on short-lived branches and merge through pull requests.

## Local Workflow
1. `npm install`
2. `npm run hooks:install`
3. Create branch
4. Implement changes
5. Run checks:
   - `npm run build`
   - `npm run test:unit`
6. Open pull request

## Extended Validation (Recommended)
- `npm run test:integration`
- `npm run test:acceptance`

## Commit Message Rule
Commit messages are validated by `.githooks/commit-msg`.

Required format:
```text
<type>: <short title>

Details:
- <detail 1>
- <detail 2>
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`

## Documentation Rule
When behavior or workflow changes, update relevant docs under `docs/`:
- `docs/delivery-workflow.md`
- `docs/testing-strategy.md`
- `docs/security-baseline.md`
- `docs/definition-of-done.md`
