---
name: cleanup
description: Polish the codebase so its folders, file names, TypeScript, React components and CSS match industry-standard organization, architecture and style without changing how the site looks or behaves. Use when the user runs /cleanup, optionally with a scope such as a folder, file, or area ("css", "components", "src/features/about").
---

# /cleanup — codebase polish pass

Bring the code up to the standard a senior frontend engineer would expect when opening this repo for the first time: easy to navigate, consistently named, each file doing one clear job, and no leftovers. The site must look and behave **exactly** the same afterwards. This is a refactor, never a redesign.

`$ARGUMENTS` narrows the scope (a path, or an area like `css`, `components`, `types`, `structure`). With no arguments, cover the whole of `src/`, `scripts/` and root config files.

## Ground rules

1. **Behavior-preserving.** No visual, copy, timing, routing or data changes. If a fix would change output, list it as a suggestion instead of applying it.
2. **Read before judging.** Understand how a file is used (grep for imports, class names, asset keys, JSON block types) before renaming, moving, merging or deleting it.
3. **Match the repo before inventing.** Where this codebase already has a sensible convention, make everything follow it. Only introduce a new convention when the existing one is inconsistent or clearly substandard, and then apply it everywhere in scope.
4. **No partial migrations.** A rename or move updates every import, class usage, CSS selector, JSON reference and script path in the same pass.
5. **Don't touch content.** Case study JSON copy, data values, and assets stay as they are, except to fix references broken by a rename.
6. **Ask when it's a judgment call.** Use AskUserQuestion when a fix has more than one defensible answer and the choice is the user's: e.g. a folder restructure, deleting something that looks unused but may be intentional, or a naming scheme change across many files.

## Project conventions (enforce these)

- **Comments are for organization only.** Allowed: short section labels that group code (`/* Hero */`, `// Handlers`). Not allowed: comments that explain decisions, reasoning, history, workarounds or what the next line does. Delete explanatory comments; if code needs one to be understood, rename or restructure it so it doesn't. JSDoc that only restates types also goes.
- **Theming:** case study palettes (`.palette-<slug>`) may only set accent-type variables (`--accent`, hero gradient, brand logo vars). Background, text, surfaces, borders and footer come from the global theme in `src/styles/tokens.css`.
- **Breakpoints:** media queries use the site breakpoints (`max-width: 1189px`, `max-width: 767px`). JS media queries import the shared constants from `src/lib/media.ts` instead of repeating query strings.
- **Spacing and type:** use the tokens in `tokens.css` (`--space-*`, `--text-*`, `--leading-*`, `--ease-*`). A raw value is acceptable only when no token fits; if the same raw value repeats or encodes a relationship, give it a named custom property.
- **Eyebrow/label text** is written in normal case in source; capitals come from CSS.
- **JSX formatting:** elements with more than one attribute put one attribute per line, matching the existing files.

## Phase 1 — Audit (read-only)

For a whole-repo run, fan the audit out to parallel subagents (e.g. structure & naming / TypeScript & components / CSS), each returning findings with `file:line`, the problem, and the proposed fix. For a narrow scope, audit directly. Cover at least:

### Structure and naming
- Folder layout is predictable: shared UI vs. layout vs. feature-specific code vs. route-level pages vs. hooks vs. utilities vs. types vs. data vs. styles. Each file lives where someone would look for it first; no near-duplicate folders, no single-file folders without reason, no grab-bag folders.
- File names follow one convention per kind: PascalCase for component files (`CaseStudyCard.tsx`), `useX` camelCase for hooks, camelCase for utilities/data modules, kebab-case for CSS, assets and content files.
- Each stylesheet maps clearly to what it styles (a page, a component, a layout region); styles live in the file that matches their owner.
- Stray files (`.DS_Store`, unused assets, unused exports, leftover template files and configs, stale README content) are reported, and removed once confirmed.

### TypeScript
- Strict, explicit types at module boundaries; no `any`, no unnecessary type assertions, no non-null assertions that can be avoided.
- Shared types live in `src/types/`; types used by one module stay in it.
- No dead code, unused parameters or unreachable branches; no temporary hacks such as `void x` to silence unused variables.
- Constants named for what they mean; magic numbers pulled into named constants.
- Consistent import ordering and style (external, then internal, then styles/assets); `import type` for type-only imports.
- Functions do one thing; long functions with distinct phases are split.

### React components
- **Should be a component:** repeated JSX patterns, large blocks with their own state or effects, or markup that has a clear name of its own.
- **Should not be a component:** wrappers that only pass props through, one-off fragments that read better inline, or "components" that are really utilities or data.
- Reusable stateful logic lives in hooks (`useX.ts`), not inside large component files. Very large files (roughly 400+ lines, or several unrelated exports) are split by responsibility.
- Rules of hooks, effect cleanup, stable keys (no index keys on reorderable lists), no derived state copied into `useState`, memoization only where it matters.
- Accessibility basics: semantic elements, alt text, labels on icon buttons, `aria-hidden` on decorative elements, keyboard reachability for anything clickable, a correct heading order.

### CSS
- Consistent naming: one prefix per page or component (`.study-*`, `.about-*`, `.home-*`, `.case-card-*`), modifiers as `.is-*` or `.has-*` state classes, no IDs or tag selectors used for styling components.
- Organization within each file: custom properties first, then base rules in document order, then modifiers, then media queries grouped at the end in descending breakpoint order.
- Tokens instead of raw colors, spacing and durations; no hard-coded theme colors outside `tokens.css` and the palette rules.
- No dead selectors (grep the class across `src/`), no duplicated rule blocks, no rules overridden later in the same file, no `!important` except deliberate global overrides, no specificity hacks.
- Low specificity: prefer a single class over chained or nested selectors.
- Logical properties and modern layout (grid/flex/gap) used consistently.

## Phase 2 — Plan and confirm

Present the findings grouped by area and ordered by impact, separated into:

1. **Safe fixes** — mechanical, behavior-preserving (dead code, comment cleanup, token swaps, naming within a file, import order).
2. **Structural changes** — file or folder moves, renames across files, component splits or merges, new shared modules.
3. **Suggestions only** — anything that would change output or needs a product decision.

Apply safe fixes without asking. Get the user's approval for structural changes (AskUserQuestion, multiSelect, one option per change or group). Never apply suggestions without being asked.

## Phase 3 — Apply

- Work area by area. For broad changes, split independent areas across parallel subagents with disjoint file ownership so edits don't collide.
- Use `git mv` for moves and renames so history follows the file.
- After each area, grep for every old name or path to confirm nothing still references it.

## Phase 4 — Verify

1. `npx tsc --noEmit --noUnusedLocals --noUnusedParameters` passes.
2. `npx vite build` passes.
3. If the dev server is running, spot-check the home page, a case study, About and Art in the browser for unchanged layout, theme switching and animations. Note any difference and fix it before finishing.

## Report

Finish with a short summary: what changed by area, files moved or renamed (old → new), anything deleted, the verification results, and the suggestions left for the user to decide.
