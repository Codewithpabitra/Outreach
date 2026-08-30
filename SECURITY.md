# Security Policy

## Supported Versions

This project was built for the TrueForge Agent Harness Hackathon and is
under active development. Security fixes are applied to the `main` branch
only.

| Version | Supported |
| --- | --- |
| `main` (latest) | ✅ |
| Older commits / tags | ❌ |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please **do not**
open a public GitHub issue.

Instead, report it privately by:

- Opening a [GitHub Security Advisory](https://github.com/Codewithpabitra/Outreach/security/advisories/new)
  on this repository, or
- Reaching out directly via [LinkedIn](https://www.linkedin.com/in/pabitra-maity-72ba04323)
  or [X (Twitter)](https://x.com/CodeX_Pabitra)

Please include:

- A description of the vulnerability and its potential impact
- Steps to reproduce it
- Any relevant logs, with API keys, tokens, or personal data redacted

You can expect an initial response within a few days. Once confirmed, a fix
will be prioritized and a public disclosure made after a patch is available.

## Handling of Secrets and Credentials

- No API keys, OAuth tokens, or credentials are committed to this
  repository. All secrets are supplied via environment variables (see the
  README's [Environment Variables](./README.md#environment-variables)
  section).
- The Gmail integration uses OAuth via Composio's MCP connector — this
  project never stores or has direct access to the user's Gmail password or
  a long-lived credential outside that OAuth flow.
- The TrueForge server used in local development runs in standalone mode
  with authentication disabled, as intended **only for local use**. It is
  never exposed beyond `localhost`.
- If you fork or self-host this project, do not commit your own `.env`
  file or expose your TrueForge server instance beyond your local machine
  or a properly authenticated deployment.

## Scope

This is a hackathon project, not a production system handling sensitive
data at scale. That said, real user data (Gmail account access) is
involved, and it is treated with the same care as a production integration:
least-privilege OAuth scopes, no credential storage, and an explicit human
approval step before any action is taken on the user's behalf.