# AGENTS.md

## Purpose
This file defines repo-specific operating rules for AI coding agents working in `grammar-paws-adventure`.

## Mandatory First Step (No Exceptions)
Before any analysis, code edit, or commit action:
1. Read [`docs/project-context.md`](docs/project-context.md) first.
2. Follow its recommended read order.
3. Open only the minimum linked docs needed for the current task.

If a request says `docs/project-contexts.md`, treat it as `docs/project-context.md`.

## Task Preflight Protocol
For every new user task, execute this preflight:
1. Load `docs/project-context.md`.
2. Load only relevant linked docs (for example: coding standards, delivery workflow, feature map, testing strategy).
3. State context load status in the first working update using this format:
   - `Context loaded: docs/project-context.md (+ <doc1>, <doc2>)`
4. Extract and apply repo rules before making changes.

## Non-Negotiable Rule Sources
When conflicts or ambiguity appear, prioritize:
1. `docs/project-context.md` (entrypoint and links)
2. `docs/coding-standards.md`
3. `docs/delivery-workflow.md`
4. Task-specific docs referenced by the files above

## Change and Commit Gate
Before finalizing any task:
1. Confirm behavior changes are reflected in related docs from the context hub.
2. Confirm tests/checks required by the loaded docs are run or explicitly deferred by user request.
3. Confirm commit message and workflow rules from loaded docs are followed.

## Memory-Safety Principle
Do not rely on conversation memory for project rules. Re-read `docs/project-context.md` at the start of each task and whenever scope changes.
