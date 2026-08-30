# Contributing to Outreach

Thanks for considering contributing. This guide covers how the project is
worked on day to day — branching, commits, and how pull requests get
reviewed.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Branching](#branching)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Code Review with Qodo](#code-review-with-qodo)
- [Code Style](#code-style)
- [Reporting Bugs](#reporting-bugs)

## Code of Conduct

Be respectful and constructive. Assume good intent, disagree on substance
rather than people, and keep discussion focused on the code.

## Getting Started

1. Fork the repository and clone your fork.
2. Follow the [Getting Started](./README.md#getting-started) section of the
   README to get the app and a local TrueForge server running.
3. Create a branch for your change (see [Branching](#branching)).

## Branching

Branch off `main` using this naming pattern:

| Type | Prefix | Example |
| --- | --- | --- |
| New feature | `feature/` | `feature/resume-attachments` |
| Bug fix | `fix/` | `fix/node-engine-requirement` |
| Documentation | `docs/` | `docs/update-readme` |
| Refactor | `refactor/` | `refactor/activity-log-steps` |

## Commit Messages

Keep commits small and scoped to one change. Use a short, imperative
summary line:

```
fix: declare Node 22+ engine requirement for TrueForge packages
feat: add human-readable activity log steps
docs: add architecture diagram to README
```

## Pull Requests

1. Push your branch and open a PR against `main`.
2. Give it a title that says what changed, and a description covering the
   **what** and the **why**.
3. Keep the scope small enough to review in one sitting — one concern per
   PR.
4. Link any related issue.
5. Wait for the Qodo review (see below) before requesting a human merge.

## Code Review with Qodo

Every substantive pull request in this repository runs through
[Qodo](https://qodo.ai) automatically once opened. Direct pushes to `main`
are not reviewed and should be avoided.

- **Every valid High-severity finding must be fixed** before merge.
- If a High finding is a false positive, intentional, or deferred, **say so
  in the Qodo thread** with a short reason rather than silently ignoring it.
- Medium and Low findings are a judgment call — use your discretion.
- After pushing a fix, **re-run the review** so the PR shows what was
  resolved.
- If Qodo doesn't start automatically on a new PR, comment `/agentic_review`
  to trigger it manually.

A human still owns the final merge decision — Qodo supports the review, it
doesn't replace it.

## Code Style

- TypeScript throughout; avoid `any` where a real type is easy to write.
- Tailwind CSS for styling — prefer utility classes over inline `style`
  objects for anything reusable.
- Keep components focused; extract a piece into its own file once it's
  doing more than one clear thing.
- Never surface raw provider/API errors directly in the UI — translate them
  into a plain-language message first.

## Reporting Bugs

Open an issue with:

- What you expected to happen
- What actually happened
- Steps to reproduce
- Relevant logs (browser console and/or terminal), with any API keys or
  personal data redacted