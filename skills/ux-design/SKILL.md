# SKILL — UX Design

## Purpose
Design interactions and information architecture before implementation (interaction-first).

## When to Use
Designing new pages/sections/flows; deciding if an interaction belongs at all.

## When NOT to Use
Token-level styling (`design-system`), animation implementation (`gsap`/`motion`).

## Rules
1. Every page defines: purpose, user goal, content, info/visual/interaction/motion hierarchy, responsive behavior, a11y, states, CTA (`FEATURES.md` format).
2. Interaction Quality Rule: improves usability / communicates information / strengthens brand / creates emotional impact / improves navigation — at least one, else drop it.
3. Hierarchy before decoration: clear hierarchy is the design.
4. States for every interactive element where applicable (default/hover/focus/active/disabled/loading/error/success).
5. Never depend on hover for essential functionality; mobile parity.
6. No fake statistics, no template sections (hero/3-col grids) without purpose.

## Workflow
1. Define purpose/goal/CTA for the surface.
2. Design content + hierarchy (what matters first?).
3. Choose interactions that serve content; document states.
4. Review against NO AI SLOP questions (`AGENT.md` §6).

## Examples
- Product page: identity → story → notes pyramid → ingredients → context. Notes pyramid earns its place (communicates the scent).
- Homepage: hero reveals brand name + one line only; every extra element must justify itself.

## Common Mistakes
Adding sections to fill space; interaction without purpose; decorative animation; unclear hierarchy.

## Validation Checklist
- [ ] Purpose/goal/CTA defined
- [ ] Hierarchy clear; states defined
- [ ] Interaction Quality Rule passed
- [ ] No template-fill sections

## Related Documentation
`docs/FEATURES.md`, `docs/DESIGN_SYSTEM.md`, `docs/UX.md` (via FEATURES), `AGENT.md` §6
