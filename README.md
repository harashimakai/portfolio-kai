# Kai Harashima — Design Portfolio

Personal design portfolio built with React, TypeScript and Vite.

## Scripts

| Command          | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| `npm run dev`    | Start the Vite dev server                                      |
| `npm run build`  | Type-check and build for production                            |
| `npm run preview`| Serve the production build locally                             |
| `npm run images` | Regenerate optimized images in `src/assets/optimized/`         |

## Structure

```
src/
  components/   shared UI and layout (navbar, footer, cursor, lightbox)
  features/     feature modules (home, about, art, case-study)
  pages/        route-level pages (case-studies/ holds each study)
  hooks/        shared React hooks
  lib/          utilities (animations, media queries, email)
  data/         site data and the case study registry
  styles/       tokens, base styles, layout, components and pages
```

## Case studies

Each case study is its own page in `src/pages/case-studies/`, built from the
blocks exported by `src/features/case-study`:

```tsx
<CaseStudy slug="cuapts" title="CUApts" subtitle="…" meta={[…]}>
  <Section label="Overview">
    <Statement>Find your next place, <Accent>in your own words</Accent>.</Statement>
    <Body>…</Body>
    <Bullets title="What they have in common:" items={["…", "…"]} />
  </Section>
</CaseStudy>
```

Spacing between blocks, the section nav and section ids are automatic.
Register a new study in `src/data/caseStudies.ts` and give it an accent with a
`.palette-<slug>` rule in `src/styles/pages/case-study.css`. `/template` shows
every available block.
