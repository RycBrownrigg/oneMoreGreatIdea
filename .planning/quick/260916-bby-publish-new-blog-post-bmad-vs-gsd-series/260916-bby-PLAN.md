---
phase: 260916-bby-publish-new-blog-post-bmad-vs-gsd-series
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - themes/lumio/src/assets/images/blog/bmad-gsd-series-4.svg
  - themes/lumio/src/content/blog/english/post-14.md
autonomous: true
requirements:
  - QUICK-260916-BBY
estimate:
  tokens: 25000
  raw_tokens: 25000
  tasks: 3
  confidence: low        # no calibration samples on record; factor 1.0 applied

must_haves:
  truths:
    - "A reader at /blog/bmad-vs-gsd-enterprise-tradeoffs-when-to-use-which/ sees the Series 4 post rendered with its header image."
    - "The post appears in the blog listing at /blog/ and in sitemap-0.xml."
    - "`npm run build` completes with exit code 0 — no UnknownContentCollectionError, no Zod schema failure."
    - "The post's section headings render as styled H2s, matching post-13's visual rhythm."
  artifacts:
    - themes/lumio/src/assets/images/blog/bmad-gsd-series-4.svg
    - themes/lumio/src/content/blog/english/post-14.md
  key_links:
    - "post-14.md `image: \"/images/blog/bmad-gsd-series-4.svg\"` resolves through Astro's `/src/assets/images/**` glob to the physical SVG — a path/filename mismatch is a silent build-time image failure."
    - "post-14.md `customSlug` determines the dist route directory name; the blog listing and sitemap both key off it."
    - "File extension MUST be `.md` — `.mdx` triggers UnknownContentCollectionError in this Astro 6 deferred-render setup."
---

<objective>
Publish "The Enterprise Tradeoffs, and When to Use Which" as Part 4 of the BMad vs GSD series: post-14.md plus its header SVG, following the exact two-file pattern established by the Series 3 commit (`a03ab62`).

Purpose: Keep the weekly series cadence intact and ship the decision-framework installment that Parts 1–3 build toward.
Output: `themes/lumio/src/assets/images/blog/bmad-gsd-series-4.svg` and `themes/lumio/src/content/blog/english/post-14.md`, verified by a clean production build.
</objective>

<execution_context>
@~/.claude/gsd-core/workflows/execute-plan.md
</execution_context>

<context>
@themes/lumio/src/content/blog/english/post-13.md
@themes/lumio/src/content/blog/english/post-11.md
</context>

<planner_findings>
Facts established during planning — do NOT re-derive these:

1. **The source SVG needs no restyling.** The quick-task brief called it "unstyled/untouched", but a byte-level comparison against `bmad-gsd-series-3.svg` shows it already matches the established visual language exactly: same `1200x630` viewBox, same `bgGrad`/`footerBar` gradient defs and stops, same `#0A0E27`→`#131B3A` background, same footer dot rows at y=560/580, same AskRyc bar-chart logo block at `translate(70, 540)`, same divider rect, same kicker line ("BMad Method Vs GSD Core · PART 4 OF 5"), same 44px/800-weight title lines. It is a **straight copy**, not a redesign.

2. **readTime is "5 min read", not "4 min read".** The brief guessed 4. Calibrated against siblings: post-12 = 848 words → "5 min read"; post-13 = 916 words → "5 min read"; post-11 = 889 words → "6 min read". The source body is 834 words, which sits just under post-12. "5 min read" is the consistent value.

3. **Series cross-link maintenance is explicitly OUT of scope.** post-11 contains a "The Series" index where Part 2 is a link but Parts 3/4/5 are plain bold. Part 3 was never linked when post-13 shipped — `git show --stat a03ab62` confirms that commit touched exactly two files (the SVG and the post). This plan reproduces that exact two-file scope. Linking Parts 3 and 4 in post-11's series index is a real, separate consistency gap; raise it as a follow-up quick task rather than folding it in here.

4. **Heading casing stays sentence case.** post-13 (the stated pattern) uses sentence case (`## Where BMad wins [.text-h4]`); post-11/12 use title case. The source's headings are already sentence case, so they carry over verbatim — no re-casing.

5. **Inline bold lead-ins in bullets are acceptable.** post-12/13 have zero inline bold, but post-11 uses inline bold in body text. The source's `- **Cost shape.** ...` bullets are the post's scanning structure; keep them.
</planner_findings>

<tasks>

<task type="tracer">
  <name>Task 1: Install the Series 4 header image</name>
  <files>themes/lumio/src/assets/images/blog/bmad-gsd-series-4.svg</files>
  <precondition>`/Users/ryc/projects/lumio2/.planning/quick/260916-bby-publish-new-blog-post-bmad-vs-gsd-series/source-image.svg` exists and is readable (3294 bytes at plan time).</precondition>
  <action>
Copy the source SVG verbatim to `themes/lumio/src/assets/images/blog/bmad-gsd-series-4.svg`. This is a byte-for-byte copy — do NOT restyle, reformat, re-indent, or run Prettier on it (see planner_findings #1: it already matches the series visual language).

Destination is `src/assets/images/blog/`, NOT `public/`. Astro's asset pipeline resolves the frontmatter path `/images/blog/bmad-gsd-series-4.svg` through the `/src/assets/images/**/*.{jpeg,jpg,png,svg,gif}` glob in `src/lib/utils/bgOptimizedImage.ts`; there is no `public/images/blog/` directory in this project.

Use a shell copy rather than Read-then-Write, so no whitespace or encoding drift can be introduced.
  </action>
  <verify>
    <automated>cmp -s /Users/ryc/projects/lumio2/.planning/quick/260916-bby-publish-new-blog-post-bmad-vs-gsd-series/source-image.svg /Users/ryc/projects/lumio2/themes/lumio/src/assets/images/blog/bmad-gsd-series-4.svg && grep -q 'PART 4 OF 5' /Users/ryc/projects/lumio2/themes/lumio/src/assets/images/blog/bmad-gsd-series-4.svg && grep -q 'viewBox="0 0 1200 630"' /Users/ryc/projects/lumio2/themes/lumio/src/assets/images/blog/bmad-gsd-series-4.svg && ! grep -qEi 'script|on[a-z]+=|foreignObject|!ENTITY' /Users/ryc/projects/lumio2/themes/lumio/src/assets/images/blog/bmad-gsd-series-4.svg && echo PASS</automated>
  </verify>
  <done>The SVG exists at the assets path, is byte-identical to the source, carries the Part 4 kicker and the 1200x630 series canvas, and contains no active content (script tags, event-handler attributes, foreignObject, or entity declarations).</done>
</task>

<task type="auto">
  <name>Task 2: Author post-14.md</name>
  <files>themes/lumio/src/content/blog/english/post-14.md</files>
  <precondition>`/Users/ryc/projects/lumio2/.planning/quick/260916-bby-publish-new-blog-post-bmad-vs-gsd-series/source-post.md` exists and holds the 834-word raw body with no frontmatter.</precondition>
  <action>
Create `themes/lumio/src/content/blog/english/post-14.md`. The extension MUST be `.md` — `.mdx` triggers `UnknownContentCollectionError` in this Astro 6 deferred-render setup.

Write this frontmatter block exactly, then the transformed body:

title: The Enterprise Tradeoffs, and When to Use Which
description: Framework comparisons stay abstract until they meet a budget line and a real team. Here's what BMad Method and GSD Core each actually cost an enterprise, when to reach for which, and the combination most organizations should run.
image: /images/blog/bmad-gsd-series-4.svg
customSlug: bmad-vs-gsd-enterprise-tradeoffs-when-to-use-which
author: Ryc Brownrigg
categories: a single-item YAML list containing AI
date: 2026-09-16T12:00:00Z
readTime: 5 min read
comments: 0
draft: false

Match post-13.md's exact key order, quoting style (double-quoted string values; unquoted date and integer), and the `categories:` block-sequence form with the value on its own indented `- ` line. The `date` value is unquoted and ends in `Z`, matching the series convention.

Slug rationale (lock this value, do not re-derive): siblings compress the title by dropping filler words — post-13's "Where Each One Wins, and Where It Breaks" became `bmad-vs-gsd-where-each-wins-and-breaks`. Applying the same compression here drops the leading article and the conjunction.

Body transformation — five changes to the raw source, nothing else:

1. Convert each of the five standalone bold heading lines into an H2 carrying the series heading shortcode, preserving the author's sentence-case wording verbatim. The five source lines to convert are the ones reading "What each one actually costs you", "BMad's real pros and cons", "GSD's real pros and cons", "So which one, when", and "The combination most enterprises should actually run". Each becomes `## ` + that same wording + a trailing space + the bracketed `.text-h4` class token used throughout post-11/12/13. After this step no line may both begin and end with a double-asterisk delimiter.

2. Keep the bullet lead-in emphasis inside the first section's four bullets ("Cost shape.", "Audit and traceability.", "Talent model.", "Change-management load.") exactly as the source has it. That emphasis is the scanning structure of the section.

3. In the opening sentence, turn the phrase "last post" into a Markdown link pointing at the Part 3 route `/blog/bmad-vs-gsd-where-each-wins-and-breaks/` (trailing slash included). Precedent: post-12 links its own "last post" reference back to post-11 the same way. The sentence's wording is otherwise unchanged.

4. Leave the closing "next post" reference as plain text — Part 5 is unpublished, so there is no route to link to.

5. Add no H1 — the title comes from frontmatter, matching post-13. End the file with a single trailing newline.

Do not edit, reword, reorder, or trim the prose. This is the author's published voice; the only body edits are the five structural ones above.
  </action>
  <verify>
    <automated>P=/Users/ryc/projects/lumio2/themes/lumio/src/content/blog/english/post-14.md; test -f "$P" && ! test -e "${P%.md}.mdx" && [ "$(grep -c '^## .*\[\.text-h4\]$' "$P")" = "5" ] && [ "$(grep -c '^\*\*.*\*\*$' "$P")" = "0" ] && grep -q '^image: "/images/blog/bmad-gsd-series-4.svg"$' "$P" && grep -q '^customSlug: "bmad-vs-gsd-enterprise-tradeoffs-when-to-use-which"$' "$P" && grep -q '^readTime: "5 min read"$' "$P" && grep -q '^date: 2026-09-16T12:00:00Z$' "$P" && grep -q '^draft: false$' "$P" && grep -q '(/blog/bmad-vs-gsd-where-each-wins-and-breaks/)' "$P" && [ "$(grep -c '^# ' "$P")" = "0" ] && echo PASS</automated>
  </verify>
  <done>post-14.md exists as `.md` with all eleven frontmatter keys in post-13's order and values, exactly five `[.text-h4]` H2s, zero leftover standalone bold-heading lines, zero H1s, and a working internal link to the Part 3 route.</done>
</task>

<task type="auto">
  <name>Task 3: Build, verify rendered output, and commit</name>
  <files>themes/lumio/src/content/blog/english/post-14.md, themes/lumio/src/assets/images/blog/bmad-gsd-series-4.svg</files>
  <action>
Run the production build from `themes/lumio/`. It chains `toml:watch` (regenerates `.astro/config.generated.json`, required before Astro runs), `astro build`, then `remove-draft-from-sitemap`. Expect it to take several minutes — sharp processes every image in `src/assets/images/`; allow up to 10 minutes before treating it as hung.

Then confirm the post actually rendered, using the Series 3 output as the reference shape. The built page lands at `dist/blog/{customSlug}/index.html`, and the header image appears as hashed `_astro/bmad-gsd-series-4.*.svg` variants (post-13's page carries 7 such references across its srcset variants — a nonzero count is the signal, not the exact number). The post must also surface in `dist/blog/index.html` and in `dist/sitemap-0.xml`, both of which contain post-13's slug today.

If the build fails with a content-collection or Zod error, the cause is almost certainly a frontmatter key/type mismatch against post-13 — diff the two frontmatter blocks before changing anything else.

Commit only the two content files, mirroring the Series 3 commit's scope and message shape (`content: add BMad vs GSD Series 3 blog post`). Do not stage `dist/`, and do not stage the `.planning/quick/` source artifacts as part of this commit.
  </action>
  <verify>
    <automated>npm --prefix /Users/ryc/projects/lumio2/themes/lumio run build && D=/Users/ryc/projects/lumio2/themes/lumio/dist && test -f "$D/blog/bmad-vs-gsd-enterprise-tradeoffs-when-to-use-which/index.html" && [ "$(grep -c '_astro/bmad-gsd-series-4\.' "$D/blog/bmad-vs-gsd-enterprise-tradeoffs-when-to-use-which/index.html")" -gt 0 ] && grep -q 'bmad-vs-gsd-enterprise-tradeoffs-when-to-use-which' "$D/blog/index.html" && grep -q 'bmad-vs-gsd-enterprise-tradeoffs-when-to-use-which' "$D/sitemap-0.xml" && echo PASS</automated>
    <human-check>Open the rendered page and confirm the header image displays (not a broken-image placeholder), the five section headings share post-13's heading weight and spacing, and the bulleted lead-ins read cleanly.</human-check>
  </verify>
  <done>`npm run build` exits 0; the post route, blog-listing entry, and sitemap URL all exist in `dist/`; the page references the hashed Series 4 SVG; and a single commit contains exactly `post-14.md` and `bmad-gsd-series-4.svg`.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Quick-task staging dir → repo content tree | `source-image.svg` / `source-post.md` are unreviewed staging artifacts crossing into tracked, published site content. |
| Build output → public web | `dist/` is rsynced to the VPS and served as static files to anonymous visitors; anything shipped here is public and executable in a visitor's browser. |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-260916-01 | Tampering / Elevation of Privilege | `src/assets/images/blog/bmad-gsd-series-4.svg` | medium | mitigate | SVG can carry `<script>`, `on*` event handlers, `foreignObject`, or XXE entity declarations that execute if the file is ever inlined rather than served via `<img>`. Task 1's `<verify>` negative-greps for all four constructs; the source scanned clean at plan time. |
| T-260916-02 | Tampering | `src/content/blog/english/post-14.md` | low | accept | Astro's Markdown pipeline escapes raw HTML by default in this config, and the body is first-party authored prose. No sanitizer change is in scope. |
| T-260916-03 | Information Disclosure | frontmatter `draft` flag | low | mitigate | `draft: false` is deliberate and asserted in Task 2's verify — this post is intended to be public and indexed. `remove-draft-from-sitemap` would strip it otherwise, which would be a silent publish failure rather than a leak. |

No package-manager installs occur in this task, so no `T-260916-SC` supply-chain entry and no package-legitimacy checkpoint is required.
</threat_model>

<verification>
1. `npm --prefix themes/lumio run build` exits 0 — no `UnknownContentCollectionError`, no Zod schema failure.
2. `dist/blog/bmad-vs-gsd-enterprise-tradeoffs-when-to-use-which/index.html` exists and references hashed `_astro/bmad-gsd-series-4.*.svg` assets.
3. The new slug appears in both `dist/blog/index.html` and `dist/sitemap-0.xml`.
4. `git show --stat HEAD` lists exactly two files: `post-14.md` and `bmad-gsd-series-4.svg`.
5. The post file extension is `.md`; no `.mdx` file was created anywhere in this task.
</verification>

<success_criteria>
- Series 4 is published at `/blog/bmad-vs-gsd-enterprise-tradeoffs-when-to-use-which/` with its header image rendering.
- Frontmatter is structurally identical to post-13's (same keys, same order, same types), with Series 4 values and `readTime: "5 min read"`.
- The five section headings use the `[.text-h4]` shortcode convention shared by post-11/12/13.
- The production build is green and the post is discoverable via the blog listing and sitemap.
- One commit, two files, matching the Series 3 commit shape.
</success_criteria>

<output>
Create `.planning/quick/260916-bby-publish-new-blog-post-bmad-vs-gsd-series/260916-bby-SUMMARY.md` when done.

Note for the summary: record the deferred follow-up — post-11.md's "The Series" index still renders Parts 3, 4, and 5 as plain bold text rather than links, even though Parts 3 and 4 are now published. That is a separate quick task, deliberately excluded here to match the Series 3 commit scope.
</output>
