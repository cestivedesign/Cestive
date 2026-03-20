# Cestive - Project Instructions

## Design Skills

This project follows high-end design principles. Before writing any frontend code, read and apply the rules from these skill files:

- `skills/taste-skill.md` — Core design engineering: typography, color, layout, motion, anti-generic patterns
- `skills/soft-skill.md` — Premium visual design: agency-level aesthetics, haptic depth, motion choreography
- `skills/redesign-skill.md` — Design audit checklist for upgrading existing UI to premium quality
- `skills/output-skill.md` — Full output enforcement: no placeholders, no shortcuts, complete code only
- `skills/minimalist-skill.md` — Clean editorial minimalism: warm monochrome, typographic contrast, flat bento grids

## Project Stack

- Vanilla HTML / CSS / JavaScript (no frameworks, no Tailwind, no npm)
- Adapt React/Tailwind-specific skill rules to vanilla CSS equivalents
- Use CSS custom properties, modern CSS features (grid, clamp, dvh, etc.)

## Key Adaptation Rules

Since this is a vanilla project, translate framework-specific rules as follows:
- Tailwind classes → equivalent CSS custom properties and classes in `styles.css`
- React/Framer Motion → vanilla JS with IntersectionObserver, CSS animations, Web Animations API
- `min-h-[100dvh]` → `min-height: 100dvh`
- CSS Grid over flexbox math
- Hardware-accelerated animations only (transform, opacity)
- No `window.addEventListener('scroll')` — use IntersectionObserver for reveals
