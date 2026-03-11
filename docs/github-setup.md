# GitHub Setup Runbook

## Repository Defaults
- Default branch: `main`
- Visibility: public
- Squash merge: enabled
- Rebase merge: optional
- Auto-delete head branches: enabled

## Branch Protection for `main`
Enable branch protection and configure:
- Require pull request before merging
- Require approvals: 0 (solo-maintainer default)
- Dismiss stale approvals on new commits: enabled
- Require status checks before merging: enabled
- Required checks:
  - `build-and-unit`
  - `dependency-review`
- Require conversation resolution before merging: enabled
- Require linear history: enabled
- Restrict force pushes: enabled

## Vercel Integration
Use Vercel native Git integration:
1. Import GitHub repository in Vercel.
2. Framework preset: Next.js.
3. Production branch: `main`.
4. Preview deployments: enabled for pull requests.
5. Add required environment variables in Vercel if introduced later.

## GitHub Actions Workflows
- `ci.yml`: build + unit checks for PRs and `main`.
- `extended-quality.yml`: integration + acceptance on schedule/manual/`main`.
- `security.yml`: dependency review, CodeQL, npm audit.

## Dependabot
- Weekly updates for npm and GitHub Actions.
- Keep PR limit low for maintainability on free tier.

## Labels (Suggested Baseline)
Create labels:
- `type:feature`
- `type:bug`
- `type:docs`
- `type:test`
- `priority:high`
- `priority:medium`
- `priority:low`

## Release Notes Process
- Update `CHANGELOG.md` under `[Unreleased]` during development.
- On release, create a Git tag from `main` and move unreleased entries to a new version section.
- Publish GitHub release notes from changelog entries.
