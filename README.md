# Grammar Paws Adventure

Grammar Paws Adventure is a Next.js web MVP that helps children practice English grammar through short game sessions, topic progression, and pet rewards.

## Project Status
- Active migration: legacy Stitch HTML screens and Next.js App Router routes coexist.
- Live React routes: `/`, `/world-map`, `/topic-intro`, `/challenge`.
- Data persistence: browser localStorage (local-first MVP).

## Core Features (MVP)
- Child onboarding with name + pet selection.
- Returning learner restore (profile + progress context).
- Topic intro before challenge start.
- Challenge flow with explanation feedback after each answer.
- XP gate progression (`>= 80%`) and sequential unlock rules.
- Voice narration with browser capability fallback.

## Tech Stack
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Vitest + Testing Library
- Playwright

## Quick Start
1. Install Node.js 20 LTS.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install git hooks (required for commit message validation):
   ```bash
   npm run hooks:install
   ```
4. Start local dev server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`.

## Development Commands
- Build: `npm run build`
- Unit: `npm run test:unit`
- Integration: `npm run test:integration`
- Acceptance/E2E: `npm run test:acceptance`
- Full local validation: `npm run test:all`

## CI/CD Model
- GitHub Actions CI (required on PR): build + unit tests.
- Extended quality workflow (manual/nightly/main): integration + acceptance tests.
- Security workflow: dependency review + CodeQL + npm audit.
- CD: Vercel native Git integration (preview on PR, production on `main`).

## Guides
- Installation guide: [docs/installation-guide.md](docs/installation-guide.md)
- Development guide: [docs/development-guide.md](docs/development-guide.md)
- GitHub setup/runbook: [docs/github-setup.md](docs/github-setup.md)

## Contributing and Governance
- Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)
- Security policy: [SECURITY.md](SECURITY.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Changelog: [CHANGELOG.md](CHANGELOG.md)
- License: [MIT](LICENSE)

## Project Docs Context
Architecture, delivery, testing, and standards docs are under `docs/`.
Start from [docs/project-context.md](docs/project-context.md).
