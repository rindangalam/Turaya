# FEATURES — Turaya Feature Specifications

> Every major page defines: Purpose, User Goal, Content, Information Hierarchy, Visual
> Hierarchy, Interaction Hierarchy, Motion Hierarchy, Responsive Behavior, Accessibility,
> Loading/Error/Empty states, CTA. Public pages: experience-first. Admin: clarity-first.

---

## Format

Full specifications for flagship surfaces; compact rows for supporting pages.
All copy is placeholder-marked until real content exists (`CONTENT_GUIDELINES.md`).

---

# PUBLIC SITE

## F1 — Homepage (`/`)

- **Purpose**: The brand's strongest editorial statement; sets the sensory tone of the whole site.
- **User goal**: Feel the brand; discover fragrances; find one to explore; trust the craft.
- **Content** (composition driven by `homepage_sections`, code owns structure):
  hero · brand intro · story · featured collection · signature fragrance · notes preview ·
  ingredients · craftsmanship · editorial gallery · philosophy · testimonials · store teaser · CTA · footer.
  Sections render from CMS; order/visibility from DB. Empty/disabled sections are skipped — never shown blank.
- **Information hierarchy**: 1. Hero (name + one line) → 2. Featured collection → 3. Signature fragrance
  → 4. Notes/ingredients → 5. Craft/story → 6. Gallery/philosophy → 7. Social proof → 8. CTA/store.
- **Visual hierarchy**: Full-bleed cinematic imagery; oversized display type; hairline rules; one bronze accent moment.
- **Interaction hierarchy**: Hero reveal (L3) → nav (L1–2) → scroll storytelling (L3, ≤ 3 scenes)
  → product reveals (L2) → gallery (L2) → CTA (L1).
- **Motion**: Per `MOTION_SYSTEM.md` budget order 1–7; no animated paragraph spam.
- **Responsive**: Editorial columns collapse to single column; hero type fluid (`display-xl` clamp);
  scroll scenes simplify to stacked sections on mobile; drag interactions → touch swipe.
- **Accessibility**: Skip link; semantic sections (`<section aria-labelledby>`); alt text on every image;
  reduced-motion instant content.
- **States**: Loading = skeletons per section; Error = section-level fallback (retry via revalidation);
  Empty = section hidden (CMS-driven) and homepage still complete; CTA = "Explore the collection" → `/collections`.
- **SEO**: unique metadata; Organization + Product JSON-LD for signature fragrance.

## F2 — Product Page (`/products/[slug]`)

- **Purpose**: The deepest fragrance experience — not a spec sheet.
- **User goal**: Understand the scent, its story, notes, and craft; decide to experience it.
- **Content**: hero imagery gallery · name/tagline · story · fragrance pyramid (top/heart/base) ·
  ingredients · collection context · related products · CTA.
- **Information hierarchy**: 1. Product identity → 2. Story → 3. Notes pyramid → 4. Ingredients → 5. Context/related.
- **Interaction**: gallery with thumbnails + lightbox (L2); notes pyramid interaction (hover/tap reveal
  ingredient info, L2); related product cards (L2); magnetic CTA (L1).
- **Responsive**: gallery stacks; pyramid becomes vertical accordion; lightbox supports swipe.
- **Accessibility**: pyramid is operable via keyboard (buttons + aria-expanded); lightbox focus-trapped; alt text.
- **States**: Loading = skeleton; Error = `not-found()` for unpublished/archived; Empty = "related" hidden when none.
- **CTA**: "Discover the collection" (→ collection) + "Contact us" (→ `/contact`).
- **SEO**: Product schema (name, description, image, sku = slug, offers omitted when no price); canonical.

## F3 — Collection Page (`/collections/[slug]`)

- **Purpose**: Present a family of fragrances with its own narrative.
- **User goal**: Browse a curated group; pick a fragrance.
- **Content**: cover · story · product list (cards with image, name, note hint) · CTA.
- **Interaction**: staggered card reveal (L2), hover preview (desktop, L2), tap to product.
- **States**: Empty = "Collection coming soon" (placeholder-marked, never blank). Error = `not-found()`.
- **CTA**: to featured product of the collection.
- **SEO**: CollectionPage + Breadcrumb schema.

## F4 — Journal (`/journal`, `/journal/[slug]`)

- **Purpose**: Editorial storytelling — the brand's voice in long form.
- **User goal**: Read, be moved, learn craft details.
- **Content**: index (featured + chronological list, categories/tags) · article (title, meta, cover, body markdown, related).
- **Interaction**: index hover on cards (L2); article prose with reveal on headings (L2, subtle); share link (L1).
- **States**: Empty = curated "Journal is quiet for now" placeholder; Error = `not-found()`.
- **Accessibility**: markdown rendered to semantic HTML; proper heading order; no heading skip.
- **SEO**: Article schema (author, datePublished from `published_at`), OG image from cover.

## F5 — Gallery (`/gallery`)

- **Purpose**: Visual proof of craft and atmosphere.
- **User goal**: Immerse; feel the brand world.
- **Content**: editorial masonry/horizontal composition with captions.
- **Interaction**: drag/horizontal scroll (L2), cursor preview (desktop), lightbox (L2, swipe on touch).
- **Accessibility**: all items keyboard-focusable; lightbox focus trap; captions + alt.
- **States**: Empty = placeholder intro card; Error = section error; Loading = skeleton tiles.
- **CTA**: "Visit the atelier" → `/contact` or `/stores`.

## F6 — Contact (`/contact`)

- **Purpose**: Real human connection point; the only public form.
- **User goal**: Ask, visit, or partner.
- **Content**: editorial intro · form (name, email, subject, message) · contact details (email/phone from settings) · stores teaser.
- **Interaction**: form focus/hover states (L1); success state with confirmation message.
- **Accessibility**: labels + `aria-describedby` hints; error summary with focus management; success announcement via `aria-live`.
- **States**: Loading = button pending; Success = inline confirmation + clear form; Error = field errors; Empty = n/a.
- **Security**: honeypot + rate limit (5/hour/IP); zod validation; no PII leaks in logs.
- **CTA**: submit.

## F7 — Ingredients (`/ingredients`)

- **Purpose**: Show ingredient provenance and philosophy.
- **User goal**: Learn what goes in, feel craft.
- **Content**: intro · ingredient index (name, origin, description) · sourcing story.
- **Interaction**: ingredient cards hover/tap reveal (L2); gentle marquee of names (L1, decorative only on desktop, pauses on reduced-motion).
- **States**: Empty = placeholder note; Error = fallback; Loading = skeleton.
- **SEO**: content indexable; no fake claims — factual text or placeholder.

## F8 — About / Philosophy / Stores / FAQ / Privacy / Terms

| Page | Purpose | Content | CTA / Notes |
|---|---|---|---|
| `/about` | Humanize the brand | story, team (placeholder), atelier | → `/philosophy`, `/gallery` |
| `/philosophy` | Principles as prose | craft values, sourcing ethics, restraint | → `/ingredients` |
| `/stores` | Find a boutique | location cards from CMS (address, hours) | → `/contact` |
| `/faq` | Answer objections | accordion from CMS | → `/contact` |
| `/privacy`, `/terms` | Legal clarity | static legal pages (real text supplied by owner — placeholder-marked until then) | — |

All: semantic content, headings, no raw DB access; Loading = minimal; Error = `error.tsx`; Empty = n/a (static).

## F9 — Navigation & Footer

- **Navigation**: transparent over hero → solid on scroll (hairline border, blur on light).
  Desktop links: overline style; hover underline reveal (L1). Mobile: full-screen overlay,
  staggered link entrance (L2), focus management + ESC close, `aria-expanded`.
- **Footer**: ink-950; brand line, nav columns, social (from settings), legal links. No newsletter (not justified).

---

# ADMIN

## A1 — Admin Shell (`/admin`)

- **Purpose**: Fast, calm operational workspace.
- **Navigation**: left sidebar (collapsible) — sections filtered by role (`RBAC.md` §3); topbar with user menu + logout.
- **Dashboard**: overview cards (published/drafts per content type), recent activity (audit-derived),
  quick links to drafts. No fake statistics — real counts only.
- **States**: Loading = skeletons; Error = inline retry; Empty = "Nothing yet — create your first …" with action link.
- **Accessibility**: nav landmark; skip link; focus visible; no motion beyond 150ms.
- **Animation**: subtle (L1 only) per DESIGN_SYSTEM §10.

## A2 — Product CMS (`/admin/products`)

- **Purpose**: Manage the catalog lifecycle.
- **Features**: list (search/filter by status, category, collection; sort by name/date/price) ·
  create/edit form (identity, copy, category, collection, size, price, status, SEO fields) ·
  image manager (upload/drag-order/alt/caption/delete) · notes mapping (top/heart/base) ·
  publish/unpublish/archive actions with confirm dialogs.
- **Validation**: zod; image rules per `SUPABASE.md` §4; slug auto-generation editable.
- **States**: list loading/empty/error; form field errors; action toasts (success/error).
- **Audit**: all lifecycle transitions (SUPABASE.md §5).

## A3 — Collections / Categories / Ingredients CMS

- Ordering via drag or up/down with sort_order persisted; featured toggles; relations
  (collection_products, product_ingredients) managed in dedicated editors with search-pick.

## A4 — Gallery / Journal CMS

- Gallery: grid management, reorder, categorize, alt/caption edit, delete.
- Journal: post editor (title, slug, excerpt, markdown body with preview, cover upload,
  category, tags, publish date, SEO). Draft/publish state machine.

## A5 — Messages (`/admin/messages`)

- Inbox list (status filter: new/read/replied/archived); detail view; status transitions;
  reply hint (mailto with prefilled subject). No message auto-delete.

## A6 — SEO / Settings / Users (admin+)

- **SEO**: per-resource metadata editor (title, description, og image, canonical, robots).
- **Settings**: brand, contact, social, address, hours; single-row `site_settings`; audit on update.
- **Users**: list, role change (super_admin only, audited); invite flow (email link).

---

## Cross-Feature Rules

- No page is fully client-rendered; data fetches server-side.
- Every list/form defines loading, empty, error, success, validation.
- Placeholder content is marked in UI too (admin badges for placeholder fields).
