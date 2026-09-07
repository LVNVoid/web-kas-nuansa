<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# kas-app

## Commands
- **Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Typecheck**: `npx tsc --noEmit`
- **Test**: `npm test`
- **Quality Check**: `npm run lint; if ($?) { npx tsc --noEmit; if ($?) { npm test } }`

## Architecture & Stack
- **Framework**: Next.js 16 (App Router) & React 19
- **Database & ORM**: PostgreSQL (Serverless via Neon) & Prisma ORM (`prisma/schema.prisma`)
- **Testing**: Jest (`jest.config.ts`, `npm test`)
- **Paths**: `@/*` points to `src/*`
- **Styling**: Tailwind CSS v4 configured via `@theme inline` in `src/app/globals.css`. Do not add a `tailwind.config.js`.
- **Design System**: Follow design tokens and styling guidelines defined in `DESIGN.md`.

## Obsidian Knowledge Base & Session Protocol
- **Vault Path**: `C:\Users\Elvien\Obsidian\LVN`
- **Project Folder**: `01 - Projects\Kas-App\`
- **Session Initialization**:
  1. Run `git -C "C:\Users\Elvien\Obsidian\LVN" pull` to sync latest notes.
  2. Read relevant context from `01 - Projects\Kas-App\Kas-App Overview.md` and active logs.
- **Session Finalization (Mandatory on substantive work / bug fix / feature)**:
  1. **Session Log**: Create `01 - Projects\Kas-App\Logs\Fullstack\YYYY-MM-DD - <Session Title>.md` and link it inside `01 - Projects\Kas-App\Logs\Logs Index.md`.
  2. **Bug Fixes**: Document in `03 - Knowledge Base\` using `05 - Templates\Template - Debugging.md` and link in `03 - Knowledge Base\Debugging Log.md`.
  3. **Feature Specs**: Document in `01 - Projects\Kas-App\` using `05 - Templates\Template - Feature Spec.md`.
  4. **Vault Git Sync**: Stage, commit, and push updates in vault via `git -C "C:\Users\Elvien\Obsidian\LVN" add .`, `git -C "C:\Users\Elvien\Obsidian\LVN" commit -m "docs(vault): <summary>"`, and `git -C "C:\Users\Elvien\Obsidian\LVN" push`.
