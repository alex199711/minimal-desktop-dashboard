# Alex GitHub Open-Source System

> Status: Phase 1 classification complete. This document describes the repository system; it does not authorize destructive repository changes.

## Why this exists

This GitHub account is being organized as a long-term engineering system rather than a flat collection of repositories.

The system has three audiences:

1. **People** — understand what is original, what is reusable, what is experimental, and what comes from upstream open source.
2. **Maintainers** — develop through a stable Issue → Branch → PR → Verify → Merge → Release workflow.
3. **Agents** — let ChatGPT/Codex locate the right repository by capability, ownership, maturity and entrypoint instead of guessing from repository names.

The machine-readable source of truth for this phase is [`/.ez/repository-registry.yaml`](../../.ez/repository-registry.yaml).

## Layer model

| Layer | Meaning | Typical contents |
|---|---|---|
| L0 | Profile / Index | Human and Agent entrypoints, repository registry |
| L1 | Products / Platforms | Original products and long-lived platforms |
| L2 | Components / Skills / Adapters | Reusable owned capabilities extracted from products or built around upstream tools |
| L3 | Labs / Learning | Experiments, prototypes and learning repositories |
| L4 | Upstream / Reference | Third-party open-source forks and reference projects |
| L5 | Archive | Historical repositories no longer actively maintained |

## Phase 1 result

Current inventory: **24 repositories**.

- **3 original repositories**
  - `ez-maker-hardware-agent-platform` — L1 Platform
  - `minimal-desktop-dashboard` — L1 Product
  - `STM32practice` — L3 Lab
- **21 upstream forks** — L4
- **0 L2 repositories yet** — reusable EZ-specific adapters/components will be created only after a real integration need exists.
- **0 L5 repositories yet** — Phase 1 performs no archival action.

This distinction is intentional: using an open-source project does not make it an original EZ project. Upstream identity remains explicit.

## Core development direction

### Promote as original maintained projects

- `ez-maker-hardware-agent-platform`
- `minimal-desktop-dashboard`

These should progressively receive the full project contract:

```text
README.md
AGENTS.md
CONTRIBUTING.md
CHANGELOG.md
LICENSE
.ez/repo.yaml
.github/ISSUE_TEMPLATE/
.github/pull_request_template.md
```

They should also use CI, semantic versioning and GitHub Releases.

### Keep as learning / laboratory

- `STM32practice`

Labs may be incomplete and unstable, but must say so clearly. A lab can later graduate into L2 or L1.

### High-value upstream projects that may need an owned adapter

These stay upstream-first. EZ-specific behavior should be implemented outside the fork:

- `artemis` — Android automation / mobile QA
- `exo` — local/distributed AI inference
- `diagram-design` — diagram and information-design skill
- `genoffice` — document/office automation
- `openscreen` — recording and product-demo workflow
- `PageIndex` — reasoning-based document retrieval
- `prompt-optimizer` — prompt optimization / MCP
- `taste-skill` — frontend design quality / browser QA
- `video-shotcraft` — Agent-native video production

Promotion path:

```text
Upstream reference (L4)
        ↓ concrete integration need
Owned adapter / skill / connector (L2)
        ↓ proven reusable value
Product / platform capability (L1)
```

This avoids maintaining large private variations of upstream projects while still letting EZ build on the open-source ecosystem.

### Upstream-first / index-only references

These are useful references but currently do not justify a local derivative layer:

- `LinkSwift`
- `agent-browser`
- `everything`
- `ai-agent-book`
- `awesome-remote-job`
- `awesome-selfhosted`
- `Filee`
- `filmcraft`
- `up`
- `vercel-skills`
- `VLX-Seek`

Where possible, future workflows should reference or consume the upstream project directly instead of creating unnecessary fork maintenance.

### Archive candidate, no action yet

- `streambert`

It is not part of the current EZ core direction. No archive/delete action is performed in Phase 1.

## License rule

License is part of project identity, not an afterthought.

Examples from the current registry:

- MIT / Apache-2.0 projects are generally integration-friendly, subject to their notice/attribution requirements.
- `prompt-optimizer` is recorded as `AGPL-3.0-only`; network-deployed or closed-source integration requires explicit compliance review.
- `awesome-selfhosted` is `CC-BY-SA-3.0`.
- repositories with `unknown` / `NOASSERTION` must be manually checked before content or code is reused.

The registry is informational and is not legal advice.

## Agent lookup contract

The long-term lookup path is:

```text
capability
  → layer
  → ownership
  → status / stability
  → repository
  → entrypoint
  → version / release
```

Examples:

- Need Android Agent QA → locate `mobile-qa` → upstream `google/artemis` → use an EZ adapter when one exists.
- Need document reasoning → locate `document-retrieval` → `PageIndex` → prefer the future EZ document adapter.
- Need an original hardware workflow → locate `hardware-agent` → L1 `ez-maker-hardware-agent-platform`.

## Development workflow

For original EZ repositories and owned L2 components:

```text
Issue
  ↓
short-lived branch
  ↓
Pull Request
  ↓
checks + tests + human verification where required
  ↓
Squash merge to main
  ↓
SemVer Release when a stable user-facing milestone is reached
```

Upstream forks do not automatically inherit this release policy; their purpose is reference, tracking, contribution or integration testing unless explicitly promoted to an owned derivative.

## Next phase

Phase 2 will create proper account-level entrypoints instead of leaving governance inside `minimal-desktop-dashboard`:

1. GitHub Profile README — human-facing landing page.
2. Canonical Repository Registry — machine-readable source independent of a single product repository.
3. Navigation by Products / Components / Labs / Upstream / Archive.
4. A standard `.ez/repo.yaml` contract for maintained projects.
5. A stable Agent entrypoint so future ChatGPT/Codex sessions can locate capabilities consistently.

Until Phase 2 is complete, this repository is only the temporary governance host.
