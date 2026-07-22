# AGENTS.md

Guidance for working on this repository: [bazan.dev](https://bazan.dev), Ion Bazan's personal
site and printable resume. Read this before making changes.

## What this project is

A Hugo static site with two purposes: a minimal personal landing page (`/`) and a printable
résumé (`/resume`) driven entirely by YAML data. It deploys to Vercel on every push to `main`.

The project's explicit design goal (see [README.md](README.md)) is to stay **small and
lightweight**: no blocking JavaScript, no cookies, no client-side framework, minimal custom CSS.
Every change should be weighed against that goal — prefer a framework utility class or a config
tweak over new custom code.

## Stack

- **[Hugo](https://gohugo.io/)** (extended) — static site generator.
- **[Bulma](https://bulma.io/)** — CSS framework, used as SCSS (`@use`), themed via CSS custom
  properties (`--bulma-*`).
- **Dart Sass** via Hugo's built-in `toCSS` pipeline (`layouts/partials/head.html`).
- **PostCSS + PurgeCSS** (production builds only) — strips unused CSS.
- **FontAwesome** (free) for icons.
- No client-side JS beyond `window.print()` and a Google Analytics snippet.

## Repository layout

```
content/          Page front matter (mostly empty — the resume page is a stub file)
data/resume/      The actual resume content, as YAML (skills, experience, projects, education…)
layouts/          Hugo templates: baseof.html, partials/, and a "classic" partial variant
assets/scss/      Bulma import + all custom SCSS
config/_default/  Hugo site config + menu
static/           Static passthrough files
postcss.config.js PurgeCSS setup for production builds
build.sh          Vercel build script (installs a pinned Dart Sass, then `hugo --gc --minify`)
```

**To edit resume content** (jobs, skills, projects, education, certificates), edit the YAML files
under `data/resume/` — never hardcode content into templates.

## Two resume layouts — keep them in mind

`content/resume/index.md` sets `layout: "resume-classic"`, so **`resume-classic.html` and
`layouts/partials/classic/*` are what's actually live**. `resume.html` and the non-`classic/`
partials (`header.html`, `experience.html`, `projects.html`, `sidebar/*`) are a second,
currently-unused layout kept in parity for possible future use — nothing references it by
default. If you change shared behavior (spacing, theming, print rules), **update both** unless
told otherwise. To preview the unused variant, temporarily set `layout: "resume"` in
`content/resume/index.md` and revert afterward — don't leave it switched.

## Styling conventions

- **Reach for Bulma's existing classes first.** Grid: `.columns`/`.column.is-N`. Text:
  `.has-text-*`, `.is-size-N`. Spacing: `.m*-N`/`.p*-N` (note: `ml-`/`mr-`, not Bootstrap's
  `ms-`/`me-`). Components: `.tag`, `.button`, `.section-heading` (custom, see below).
- Only add custom CSS in `assets/scss/main.scss` when Bulma genuinely has no equivalent (e.g.
  `.shadow`, `.border`, `.min-vh-100`, `.d-print-*`, a couple of responsive spacing helpers Bulma
  doesn't ship). When you do, **comment why Bulma doesn't cover it** — the existing custom rules
  all explain their reason for existing; keep that pattern.
- Prefer Bulma's CSS custom properties (`var(--bulma-primary)`, `var(--bulma-text)`,
  `var(--bulma-border)`, …) over hardcoded colors, so dark mode and future theme tweaks keep
  working without touching every rule.
- SCSS partials use `@use`, not `@import` (deprecated in Dart Sass, and this repo has already
  been cleaned up — don't reintroduce `@import`).
- Bulma's own SCSS still triggers a `[if-function]` deprecation warning internally, which is
  silenced via `silenceDeprecations` in `head.html` — that's expected and not something to "fix"
  by touching `node_modules`.

## Dark mode & the resume "paper" trick

The site follows the visitor's OS theme (`prefers-color-scheme`) via Bulma's automatic dark mode.
The résumé is a deliberate exception: `<article id="resume">` is pinned to
`data-theme="light"` in both resume layouts, plus a matching `background-color`/`color` override
in `main.scss`, so it always renders as a white printable "sheet of paper" regardless of the
page's theme. Don't remove that pinning without understanding why it's there — Bulma only sets
body-level `color` on `<body>`, so unclassed text inside a `data-theme` scope needs the color
re-applied explicitly, or it silently inherits the wrong theme's grey.

## Print / résumé page budget

The résumé is meant to print to **2 A4 pages**. The print stylesheet
(`assets/scss/print/print.scss`, `_spacing.scss`) is self-contained and mirrors Bulma's spacing
scale locally (Bootstrap's `$spacers`/`$grid-breakpoints`/`make-col` are gone — don't reference
them). Section, role, and skill spacing inside `#resume` is intentionally compact (see the
`#resume` block in `main.scss`) with a specific hierarchy: gap *between sections* > gap *between
roles* > gap *within a role*. If you touch spacing there, re-check the page count (see
Verification) — it's easy to silently push it to 3 pages.

## Local development

```bash
npm install
hugo server
```
Serves at `http://localhost:1313/`. Note: the dev server sometimes serves stale compiled CSS
after an SCSS-only edit — if changes don't show up, remove the `resources/` cache directory and
restart.

## Verification

There's no test suite. Verify changes by:

1. **Build clean, both modes** — dev builds don't run PurgeCSS, production builds do, and
   they can differ:
   ```bash
   hugo --gc --minify
   HUGO_ENVIRONMENT=production hugo --gc --minify
   ```
2. **Visual check** — home (`/`), résumé (`/resume`), and 404, at both mobile and desktop widths,
   in both light and dark OS color-scheme emulation.
3. **Print check** — the résumé must fit 2 pages. This can be checked headlessly:
   ```bash
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
     --headless --disable-gpu --no-pdf-header-footer \
     --print-to-pdf=/tmp/resume.pdf http://localhost:1313/resume/
   python3 -c "import re; print(re.findall(rb'/Count\s+(\d+)', open('/tmp/resume.pdf','rb').read()))"
   ```
4. Grep the production CSS for anything you expect to have survived/been removed by PurgeCSS if
   you touched theming, print, or attribute-based selectors.

## Git conventions

- Work on a feature branch; don't commit straight to `main` unless asked.
- Commit messages: short, imperative, no AI attribution/co-author lines (this project's owner
  explicitly does not want them).
- Don't push or open PRs unless explicitly asked to.
