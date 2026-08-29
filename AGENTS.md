# AGENTS.md

Guidance for working on this repository: [bazan.dev](https://bazan.dev), Ion Bazan's personal
site and printable resume. Read this before making changes.

## What this project is

A Hugo static site with two purposes: a minimal personal landing page (`/`) and a printable
résumé (`/resume`) driven entirely by YAML data. It deploys to Vercel on every push to `main`.

The project's explicit design goal (see [README.md](README.md)) is to stay **small and
lightweight**: no client-side framework, no bundler, minimal custom CSS, and no more JavaScript
than a feature genuinely requires. Two deliberate exceptions exist today — the Google Analytics
snippet (which does set cookies) and the handful of inline lines behind the theme toggle. Neither
is a licence to add more. Every change should be weighed against that goal — prefer a framework
utility class or a config tweak over new custom code.

## Stack

- **[Hugo](https://gohugo.io/)** (extended) — static site generator.
- **[Bulma](https://bulma.io/)** — CSS framework, used as SCSS (`@use`), themed via CSS custom
  properties (`--bulma-*`).
- **Dart Sass** via Hugo's built-in `toCSS` pipeline (`layouts/partials/head.html`).
- **PostCSS + PurgeCSS** (production builds only) — strips unused CSS.
- **FontAwesome** (free) for icons.
- No client-side JS beyond `window.print()`, a Google Analytics snippet, and the theme
  toggle (an inline script in `head.html` plus `partials/scripts.html`). Keep it that way —
  there is no bundler, and nothing here should need one.

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

Every file under `data/` has a matching JSON Schema in `schemas/`, wired up via a
`# yaml-language-server: $schema=...` line at the top of the file (works in VSCode with the
`redhat.vscode-yaml` extension, and in recent JetBrains IDEs automatically). `.vscode/` is
deliberately **not** tracked here — the owner ignores it globally — so that `$schema` line is the
only wiring that ships: every new data file needs one, and don't rely on editor settings to
supply it. If you add or rename a field in a data file, **update the matching schema in `schemas/`
in the same change** — a schema that lies about the shape of the data is worse than no schema.
`data/resume/projects/*.yaml` and `data/resume/open_source/*.yaml` intentionally share one schema
(`project-item.schema.json`), since both are rendered through the same partial. Note that
Hugo merges `data/resume.yaml` and the `data/resume/` directory into the same
`hugo.Data.resume` map, so a key defined in both places collides and the directory file wins
silently. Languages used to be duplicated this way and now live only in
`data/resume/languages.yaml` — keep one home per key.

## Structured data

`layouts/partials/structured-data.html` emits a `schema.org/Person` JSON-LD block (included from
`head.html`, so it's on every page) built from `hugo.Data.resume` — no hardcoded content. If you
add/rename a field it reads (`contact.*`, `education`, `skills`, `experience`, `languages`), keep
this partial in sync the same way you'd keep a `schemas/*.json` file in sync. Note the
`jsonify | safeJS` at the end: Go's `html/template` doesn't recognize `application/ld+json` as a
non-JS script type, so without `safeJS` the whole JSON blob gets double-escaped as an untrusted JS
string — don't drop it. `worksFor` is derived from whichever `experience/*.yaml` entry has
`end: ~` (the current role).

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
  doesn't ship).
- Prefer Bulma's CSS custom properties (`var(--bulma-primary)`, `var(--bulma-text)`,
  `var(--bulma-border)`, …) over hardcoded colors, so dark mode and future theme tweaks keep
  working without touching every rule.
- SCSS partials use `@use`, not `@import` (deprecated in Dart Sass, and this repo has already
  been cleaned up — don't reintroduce `@import`).
- Bulma's own SCSS still triggers a `[if-function]` deprecation warning internally, which is
  silenced via `silenceDeprecations` in `head.html` — that's expected and not something to "fix"
  by touching `node_modules`.

## Comments

**Don't add comments.** Default to none. Names, structure and small functions should carry the
intent, and the reasoning behind this project's decisions belongs in this file, where it stays
findable, rather than scattered across the source.

Write one only when the code is genuinely tricky — a non-obvious workaround, or something a
reader would otherwise "tidy up" and break — and then keep it to a line or two. A comment that
restates what the next line does, explains a change to a reviewer, or justifies why an approach
is correct is noise; delete it. If an explanation needs a paragraph, it belongs in AGENTS.md.

## Dark mode & the resume "paper" trick

The site follows the visitor's OS theme (`prefers-color-scheme`) via Bulma's automatic dark mode,
and a toggle lets the visitor override that. Three pieces:

- **`partials/head.html`** — an inline, synchronous script reads `localStorage.theme` and sets
  `data-theme` (the override) plus `data-theme-choice` (`system`/`light`/`dark`) on `<html>`
  *before first paint*. It must stay inline and blocking; deferring it reintroduces a flash of
  the wrong theme.
- **`partials/theme-toggle.html` + `partials/scripts.html`** — the button (rendered site-wide
  from the otherwise-empty `footer.html`) and the click handler that cycles
  System → Light → Dark. Choosing "system" clears both the attribute and the stored value.
- **`main.scss`** — `data-theme-choice` doubles as a "JS ran" flag: the button is `display: none`
  until it appears, so visitors without JS never see a dead control. All three icons are in the
  markup and CSS shows the active one — PurgeCSS only keeps classes it can see, so swapping icon
  classes from JS would strip them in production. `data-theme-choice` is registered in
  `postcss.config.js`'s `dynamicAttributes` for the same reason `data-theme` is.

The résumé is a deliberate exception: `<article id="resume">` is pinned to
`data-theme="light"` in both resume layouts, plus a matching `background-color`/`color` override
in `main.scss`, so it always renders as a white printable "sheet of paper" regardless of the
page's theme. Don't remove that pinning without understanding why it's there — Bulma only sets
body-level `color` on `<body>`, so unclassed text inside a `data-theme` scope needs the color
re-applied explicitly, or it silently inherits the wrong theme's grey.

**The same trap has a second, sneakier form.** Bulma registers some *derived* custom properties
only on `:root` — `--bulma-strong-color: var(--bulma-text-strong)`,
`--bulma-hr-background-color`, `--bulma-label-color`, `--bulma-skeleton-background`. The
indirection is resolved once in the root's theme, so the *resolved* value inherits into the
light-pinned résumé even though `data-theme="light"` correctly flips the base variable. The
symptom is `<strong>` (and `<hr>`) keeping dark-mode colours on a white page. `main.scss`
re-derives those four inside `#resume`; if a future Bulma version adds more, re-derive them the
same way. To find them, snapshot every `--bulma-*` on `#resume` with the root set to `light`,
then again with it set to `dark`, and diff — anything that differs is leaking.
(`--bulma-body-color`/`--bulma-body-background-color` leak too but only style `<html>`/`<body>`,
which can't match inside the article, so they're intentionally left alone.)

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
   they can differ. Note that bare `hugo` **already defaults to the production environment**
   (only `hugo server` defaults to development), so you must ask for development explicitly —
   otherwise you build the same thing twice and learn nothing:
   ```bash
   hugo -e development --gc --minify   # unpurged (~816 KB CSS)
   hugo --gc --minify                  # production, PurgeCSS runs (~222 KB CSS)
   ```
   A production CSS anywhere near the development size means PurgeCSS silently did nothing.
2. **Visual check** — home (`/`), résumé (`/resume`), and 404, at both mobile and desktop widths,
   in both light and dark OS color-scheme emulation. If you touched theming, also cycle the
   toggle through all three states and reload, to confirm the choice persists and the résumé
   still renders identically in either theme.
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
