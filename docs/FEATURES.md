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
  Sections render from CMS; order/visibility from DB. The homepage is composed from
  `homepage_sections` (admin: `/admin/homepage`); empty/unknown sections are skipped — never shown blank.
  Announcement banner reads from `site_settings.announcement`.
- **Information hierarchy**: 1. Hero (name + one line) → 2. Featured collection → 3. Signature fragrance
  → 4. Notes/ingredients → 5. Craft/story → 6. Gallery/philosophy → 7. Social proof → 8. CTA/store.
- **Visual hierarchy**: Full-bleed cinematic low-key imagery; oversized display type; hairline rules; one champagne accent moment.
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
- **Status**: ✅ Implemented (Sprint 6 + Sprint 11 shell).

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
- **Status**: ✅ Implemented (Sprint 11). Gallery + thumbnails, notes pyramid, related products, breadcrumb.

## F3 — Collection Page (`/collections/[slug]`)

- **Purpose**: Present a family of fragrances with its own narrative.
- **User goal**: Browse a curated group; pick a fragrance.
- **Content**: cover · story · product list (cards with image, name, note hint) · CTA.
- **Interaction**: staggered card reveal (L2), hover preview (desktop, L2), tap to product.
- **States**: Empty = "Collection coming soon" (placeholder-marked, never blank). Error = `not-found()`.
- **CTA**: to featured product of the collection.
- **SEO**: CollectionPage + Breadcrumb schema.
- **Status**: ✅ Implemented (Sprint 11). `/collections` index (featured first) + detail with story and product grid.

## F4 — Journal (`/journal`, `/journal/[slug]`)

- **Purpose**: Editorial storytelling — the brand's voice in long form.
- **User goal**: Read, be moved, learn craft details.
- **Content**: index (featured + chronological list, categories/tags) · article (title, meta, cover, body markdown, related).
- **Interaction**: index hover on cards (L2); article prose with reveal on headings (L2, subtle); share link (L1).
- **States**: Empty = curated "Journal is quiet for now" placeholder; Error = `not-found()`.
- **Accessibility**: markdown rendered to semantic HTML; proper heading order; no heading skip.
- **SEO**: Article schema (author, datePublished from `published_at`), OG image from cover.
- **Status**: ✅ Implemented (Sprint 11). Index (category/date/tags) + article with prev/next.

## F5 — Gallery (`/gallery`)

- **Purpose**: Visual proof of craft and atmosphere.
- **User goal**: Immerse; feel the brand world.
- **Content**: editorial masonry/horizontal composition with captions.
- **Interaction**: drag/horizontal scroll (L2), cursor preview (desktop), lightbox (L2, swipe on touch).
- **Accessibility**: all items keyboard-focusable; lightbox focus trap; captions + alt.
- **States**: Empty = placeholder intro card; Error = section error; Loading = skeleton tiles.
- **CTA**: "Visit the atelier" → `/contact` or `/stores`.
- **Status**: ✅ Implemented (Sprint 11). Masonry grid with captions + empty state.

## F6 — Contact (`/contact`)

- **Purpose**: Real human connection point; the only public form.
- **User goal**: Ask, visit, or partner.
- **Content**: editorial intro · form (name, email, subject, message) · contact details (email/phone from settings) · stores teaser.
- **Interaction**: form focus/hover states (L1); success state with confirmation message.
- **Accessibility**: labels + `aria-describedby` hints; error summary with focus management; success announcement via `aria-live`.
- **States**: Loading = button pending; Success = inline confirmation + clear form; Error = field errors; Empty = n/a.
- **Security**: honeypot + rate limit (5/hour/IP); zod validation; no PII leaks in logs.
- **CTA**: submit.
- **Status**: ✅ Implemented (Sprint 11). `submitContactMessage` server action with honeypot + in-memory rate limit; success/error states.

## F7 — Ingredients (`/ingredients`)

- **Purpose**: Show ingredient provenance and philosophy.
- **User goal**: Learn what goes in, feel craft.
- **Content**: intro · ingredient index (name, origin, description) · sourcing story.
- **Interaction**: ingredient cards hover/tap reveal (L2); gentle marquee of names (L1, decorative only on desktop, pauses on reduced-motion).
- **States**: Empty = placeholder note; Error = fallback; Loading = skeleton.
- **SEO**: content indexable; no fake claims — factual text or placeholder.
- **Status**: ✅ Implemented (Sprint 11).

## F8 — About / Philosophy / Stores / FAQ / Privacy / Terms

| Page | Purpose | Content | CTA / Notes |
|---|---|---|---|
| `/about` | Humanize the brand | story, team (placeholder), atelier | → `/philosophy`, `/gallery` |
| `/philosophy` | Principles as prose | craft values, sourcing ethics, restraint | → `/ingredients` |
| `/stores` | Find a boutique | location cards from CMS (address, hours) | → `/contact` |
| `/faq` | Answer objections | accordion from CMS | → `/contact` |
| `/privacy`, `/terms` | Legal clarity | static legal pages (real text supplied by owner — placeholder-marked until then) | — |

All: semantic content, headings, no raw DB access; Loading = minimal; Error = `error.tsx`; Empty = n/a (static).
- **Status**: ✅ Implemented (Sprint 11). Stores + FAQ render from CMS; about/philosophy/privacy/terms are editorial copy (placeholder-marked until owner text supplied).

## F9 — Navigation & Footer

- **Navigation**: transparent over hero → solid on scroll (hairline border, blur on light).
  Desktop links: overline style; hover underline reveal (L1). Mobile: full-screen overlay,
  staggered link entrance (L2), focus management + ESC close, `aria-expanded`.
- **Footer**: noir-950; brand line, nav columns, social (from settings), legal links. No newsletter (not justified).
- **Status**: ✅ Implemented (Sprint 11). Sticky translucent nav (announcement-aware), mobile overlay menu with staggered entrance + ESC close, footer from `site_settings`.

---

# ADMIN

## A1 — Admin Shell (`/admin`)

- **Purpose**: Fast, calm operational workspace.
- **Navigation**: left sidebar (collapsible) — sections filtered by role (`RBAC.md` §3); topbar with user menu + logout.
- **Dashboard**: overview cards (published/drafts per content type, real counts only);
  quick links to drafts; recent activity panel (audit-derived, admin+ only — editors see
  the latest inbox messages instead).
- **States**: Loading = skeletons; Error = inline retry; Empty = "Nothing yet — create your first …" with action link.
- **Accessibility**: nav landmark; skip link; focus visible; no motion beyond 150ms.
- **Animation**: subtle (L1 only) per DESIGN_SYSTEM §10.

## A2 — Product CMS (`/admin/products`)

- **Purpose**: Manage the catalog lifecycle.
- **Features** (Sprint 7, implemented):
  - List with search (name/slug/tagline), status filter tabs (draft/published/archived),
    sort (updated, name, price), thumbnail, price, featured marker, status badge.
  - Create/edit form: identity (name, slug, size, tagline), relations (category,
    collection), price, status, featured toggle, editorial copy (description, story),
    SEO fields (title, description).
  - Image manager: upload to `products` bucket (JPEG/PNG/WebP, ≤5 MB, ≤5 per submit),
    edit alt/caption, remove (deletes storage object + row). New images get
    `sort_order` appended after existing ones.
  - Archive (soft delete `deleted_at`) with two-step confirm; draft/publish/archive
    via the status field.
- **Validation**: zod; image rules per `SUPABASE.md` §4; slug uniqueness enforced via
  unique-violation mapping (`23505`) → field error.
- **States**: list loading/empty/error; form field errors; action toasts (success/error).
- **Audit**: `products` trigger writes audit rows for insert/update/delete (SUPABASE.md §5).

## A3 — Collections / Categories / Ingredients CMS

- **Collections (`/admin/collections`)**: list ordered by `sort_order` with move up/down;
  create/edit form (name, slug, status, featured, cover image path, description, story,
  SEO); featured toggle; two-step archive confirm.
- **Categories (`/admin/categories`)**: list ordered by `sort_order` with move up/down;
  create/edit form (name, slug, status, description); two-step archive confirm.
- **Ingredients (`/admin/ingredients`)**: list ordered by `sort_order` with move up/down;
  create/edit form (name, slug, status, origin, image path, description, story);
  two-step archive confirm.
- Shared: content statuses (`draft`/`published`/`archived`), reorder helper, delete-confirm
  and form-field components; soft delete via `deleted_at`; slug uniqueness via `23505`
  mapping.
- **Relations**:
  - `product_ingredients` (fragrance pyramid): product form has a Notes card with
    top/heart/base stages; add/remove/reorder ingredients per stage; saved as full
    replacement with per-stage `position`.
  - `collection_products`: collection form has a Products card; add/remove/reorder
    products; saved as full replacement with `sort_order`.

## A4 — Gallery / Journal CMS

- **Gallery (`/admin/gallery`)** (Sprint 9, implemented):
  - Grid of thumbnail tiles (thumbnail, `#sort_order`, category + status badges) ordered by
    `sort_order` with move up/down.
  - Create/edit form: image upload (JPEG/PNG/WebP/AVIF, ≤8 MB) to the `gallery` bucket at a
    date-partitioned path (`gallery/<yyyy>/<mm>/<uuid>.<ext>`), alt text (required), optional
    caption, free-text category with datalist suggestions from existing categories, status.
  - Edit can replace the image (uploads new object, updates row path, removes old object).
  - Delete is a hard delete: storage object + row removed in the same action (table has no
    `deleted_at`).
  - List filters: status tabs (draft/published/archived) + category select.
- **Journal** (`/admin/journal`) (Sprint 10, implemented):
  - List with search (title/slug/excerpt), status filter tabs (draft/published/archived),
    category filter, cover thumbnail (or file icon), category, tag badges, status badge,
    updated time; ordered by `updated_at` desc.
  - Create/edit form: cover upload (JPEG/PNG/WebP/AVIF, ≤8 MB) to the `journal` bucket at a
    date-partitioned path (`journal/<yyyy>/<mm>/<uuid>.<ext>`), title, slug, category select
    + inline "new category" (auto-slugged, unique via `23505`), status, excerpt, body
    (required), tags (pick existing + create new, saved as full replacement of `post_tags`),
    SEO title/description.
  - `published_at` is set on first publish transition (create with status `published`, or
    update draft→published); a previously-published post keeps its date.
  - `author_id` is set from the current session user (`profiles.id`) on create.
  - Archive is a soft delete (`deleted_at`); archived posts are excluded from list queries.

## A5 — Messages (`/admin/messages`)

- Inbox list (status filter: new/read/replied/archived); detail view; status transitions;
  reply hint (mailto with prefilled subject). No message auto-delete.

## A6.5 — Homepage CMS (`/admin/homepage`)

- **Purpose**: Compose the public homepage from `homepage_sections`.
- **Features**: list ordered by `sort_order`; create/edit form (name, slug, headline,
  subheadline, body, image path, button label/URL, visibility); move up/down to reorder;
  visibility toggle; two-step delete confirm.
- **Rendering contract**: the public homepage renders known `slug` renderers (currently
  `hero`, `about`) and skips unknown slugs — **UI code owns layout**, the DB owns content,
  order and visibility.
- **Validation**: zod; slug `[a-z0-9-]`; button URL must be an internal path or full URL.

## A6 — SEO / Settings / Users (admin+)

- **SEO**: per-page metadata editor (`seo_metadata.page`: title, description, OG image,
  canonical, robots).
- **Settings**: brand identity (site_name, tagline, logo_path, announcement), contact details
  (email, phone, address), social links (Instagram, TikTok, WhatsApp); single-row
  `site_settings`; audit on update.
- **Users**: list, role change (super_admin only, audited); invite flow (email link).
  Currently a guarded stub (admin+ route).

---

## Cross-Feature Rules

- No page is fully client-rendered; data fetches server-side.
- Every list/form defines loading, empty, error, success, validation.
- Placeholder content is marked in UI too (admin badges for placeholder fields).
