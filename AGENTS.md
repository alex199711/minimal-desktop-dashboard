# AGENTS.md

## Purpose

`minimal-desktop-dashboard` is an original L1 desktop product in the EZ GitHub system. It is an Electron + React desktop dashboard focused on local Windows interaction, note editing, time interaction and flexible desktop layout.

This file is the default operating contract for ChatGPT, Codex and other coding agents working in this repository.

## Project boundaries

- Keep this repository focused on the desktop dashboard product itself.
- Account-level GitHub governance belongs in the canonical registry / profile repositories once Phase 2 migration is complete.
- Do not fold unrelated EZ Sales, Hardware Agent or upstream project code directly into this repository.
- Reusable capabilities that become independently useful should be extracted into an L2 component / skill / adapter rather than duplicated here.

## Important paths

- `src/` — React application source.
- `electron/` — Electron main-process / desktop integration source.
- `public/` — static assets.
- `.ez/repo.yaml` — machine-readable repository identity and capability contract.
- `.ez/repository-registry.yaml` — temporary account-level registry host during GitHub system migration.
- `docs/github-system/` — temporary human-readable GitHub governance documentation.

## Setup and development

```bash
npm install
npm run dev
```

## Required verification

Before proposing a PR that changes code, run the checks relevant to the change. The default verification set is:

```bash
npm run check
npm run lint
npm run build
```

For Windows / Electron behavior, also perform human verification when the change affects shortcuts, tray behavior, system integration, packaging or window behavior.

Packaging commands:

```bash
npm run pack
npm run dist
```

Do not treat a successful web/Vite build as sufficient proof that Electron-specific behavior works.

## Development workflow

Use the repository governance baseline:

```text
Issue
→ short-lived branch
→ Pull Request
→ automated checks + required human verification
→ Squash Merge into main
→ SemVer Release for stable user-facing milestones
```

Recommended branch prefixes:

- `feat/`
- `fix/`
- `refactor/`
- `docs/`
- `chore/`

Keep `main` runnable. Prefer small PRs with one clear purpose.

## Agent safety / approval boundaries

Do not automatically perform the following without explicit user approval:

- merge a PR into `main`;
- publish a GitHub Release or version tag;
- archive, rename or delete a repository;
- make destructive migrations of user data or local configuration;
- commit secrets, tokens, credentials or machine-specific private data;
- replace upstream attribution or present third-party work as original work.

If a change affects the project identity, capabilities, ownership, stability or release policy, update `.ez/repo.yaml` in the same PR.

## Open-source and upstream policy

This repository is marked `ownership: original`.

When using third-party open source:

1. keep upstream attribution and license obligations explicit;
2. prefer dependencies, adapters or clean integration layers over copying large upstream codebases;
3. if a reusable EZ-specific integration emerges, extract it into an L2 adapter/component repository;
4. do not convert an upstream fork into an apparent original project by removing its history or attribution.

## Done definition

A change is done when:

- the Issue acceptance criteria are satisfied;
- relevant code/docs are updated;
- `npm run check` passes;
- `npm run lint` passes for code changes unless a documented existing issue blocks it;
- `npm run build` passes;
- Electron/Windows behavior is manually verified when relevant;
- no secrets or generated junk files are introduced;
- README / `.ez/repo.yaml` / AGENTS.md remain consistent with the actual project;
- the PR explains the change and verification performed.

## Release state

The current package version is `0.0.0`; no stable release is declared in `.ez/repo.yaml` yet. Do not describe the project as stable until a release milestone explicitly promotes it.
