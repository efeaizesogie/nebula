# Nebula — Project Instructions

Nebula is a futuristic DeFi staking platform for crypto investors, launching soon. The site is a single-page waitlist site.

**Every design, mockup, component and line of UI code in this project must follow the Nebula Design System below.** Do not substitute colours, fonts or sections. Where something is not specified, choose the simplest option that fits. If a needed token or component doesn't exist, propose it (e.g. via `/design:design-system extend`) before using it.

---

## 1. Brief
- **Idea:** A futuristic DeFi staking platform called Nebula for crypto investors, launching soon
- **What it is:** DeFi staking platform
- **Industry:** Crypto and SaaS
- **Mood:** Futuristic
- **Primary goal:** Waitlist sign-ups
- **Primary button label:** "Join the waitlist"
- **Audience:** Investors

---

## 2. Nebula Design System

### 2.1 Colour — "Ink & Volt" (dark theme)
| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#0B0B0C` | Page background |
| `--color-surface` | `#161618` | Cards, sheets, inputs |
| `--color-text` | `#F4F4F2` | Primary text |
| `--color-muted` | `#8A8A86` | Secondary text, captions |
| `--color-accent` | `#C6FF3D` | Volt lime — restricted (see rule) |

**Rules**
- Dark theme throughout. No light mode.
- The lime accent is used **only** for: the primary button, focus rings, and **one highlighted word per section**. Everything else stays in greys.
- No extra gradients, glows or shadows unless a section explicitly calls for one (Glow Cards, Orbital Scene atmosphere).
- Never hardcode colours in components — reference the tokens.

### 2.2 Typography — "Grotesk Shout"
| Role | Font | Weight |
|---|---|---|
| Display | Archivo Black | 400 |
| Body | Inter | 400 / 500 / 600 |
| Mono | JetBrains Mono | 400 / 500 |

All free on Google Fonts.

**Rules**
- Headlines: UPPERCASE, letter-spacing `-0.03em`, line-height `0.9`.
- Never more than two headline lines on mobile.
- Uppercase display, sentence-case body.
- Body text 16–18px.
- Mono for numbers, stats, wallet addresses, counters and small labels/badges.

### 2.3 Logo — Dynamic Identity
- A constant core (the wordmark) plus a variable element (a frame, grid or pattern) that changes colour or shape per page, event or campaign — using only the palette.
- Until the final logo exists: a text wordmark **"Nebula"** in Archivo Black.

### 2.4 Layout — Centred Stack
- Max content width **1120px**, centred.
- Centred headings.
- **96–128px** vertical gap between sections.
- One idea per section.

### 2.5 Spacing & sizing
- 4px base spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Buttons at least **44px** tall (touch target).
- Mobile first at 375px, then 768px and 1280px breakpoints. No horizontal scroll.

### 2.6 Iconography & imagery
- One icon set only, same stroke width throughout. No emoji as icons.
- Imagery style: **Abstract 3D renders** sharing one material and lighting setup (glass + matte, deep charcoal, single lime highlight, hard rim light from one side with faint acid-green spill). Used as feature-card art.

### 2.7 Motion — "Magnetic Glow"
- Primary buttons are magnetic: shift up to **6px** toward the cursor.
- Cards get a border glow (accent colour, radial) that follows the cursor position.
- Numbers count up when they enter the viewport.
- **Respect `prefers-reduced-motion` everywhere:** replace movement with simple fades and pause all video.

### 2.8 Background treatment — Ambient Abstract Loop
- Behind the **hero and final CTA only**: a muted abstract video loop at 30–40% opacity with a dark overlay.
- Text contrast must stay WCAG AA.
- Lazy-load the video; use a static poster below 768px.

---

## 3. Page structure (in this order)
1. **Navigation** — Sticky top bar: "Nebula" logo left, 3–4 anchor links, primary button "Join the waitlist" right. Collapses to a menu sheet on mobile.
2. **Hero — Waitlist Teaser** — One-screen hero: small "Coming soon" badge, a 4–7 word headline, inline email + button form, and a live "N people ahead of you" counter. Successful sign-up swaps the form for a referral link.
3. **3D moment — Orbital Scene** — Scroll-driven 3D sphere with a thin atmosphere glow and 2–3 orbiting points of interest; scrolling rotates it and each point reveals a short stat. Fall back to the rendered video (VID-02) on low-power devices.
4. **Features — Glow Cards** — 3–6 feature cards on a dark surface, each with an icon, short title and one sentence. A radial accent glow tracks the cursor along each card's border.
5. **Proof** — Real-sounding proof for this exact business: 2–3 short testimonials with name and role, or 3 key numbers. No fake logos of real companies.
6. **Call to action — Waitlist with Live Count** — Repeat the waitlist form with a live count of sign-ups and 3–5 small avatars; confirm with an inline success state, no page reload.
7. **Footer — Minimal One-liner** — Single line: copyright, privacy link, one social link.

---

## 4. Media assets
Generate with an image/video model using the same seed or style reference across a set so they match. Colour reference for all: `#0B0B0C`, `#C6FF3D`.

**VID-01 — Section background video (hero + final CTA)** · 16:9 · 10–12s seamless loop
> Abstract slow-moving ambient loop evoking defi staking platform: flowing light, soft particles and gentle liquid forms, deep charcoal black with a single electric lime highlight, hard rim light from one side with a faint acid-green spill, futuristic, very slow motion, no text, no recognisable objects, seamless loop. Colour reference: #0B0B0C, #C6FF3D.

**VID-02 — 3D section fallback video** · 1:1 · 12s seamless loop
> Slow 360-degree rotation of a stylised planet or sphere themed around defi staking platform, thin glowing atmosphere, small orbiting lights, deep charcoal black with a single electric lime highlight, hard rim light from one side with a faint acid-green spill, deep black background, futuristic, no text, seamless loop. Colour reference: #0B0B0C, #C6FF3D.

**IMG-01 — Feature card illustrations** · 4:3 · set of 4
> Abstract 3D render representing defi staking platform: smooth geometric shapes, glass and matte materials, deep charcoal black with a single electric lime highlight, hard rim light from one side with a faint acid-green spill, minimal composition with negative space, futuristic, no text, no UI. Colour reference: #0B0B0C, #C6FF3D.

---

## 5. Quality guardrails
- Write real, specific copy about DeFi staking. No lorem ipsum.
- **Banned words:** "unlock", "elevate", "seamless", "revolutionise", "cutting-edge", "game-changer", "supercharge". (The word "seamless" may appear only inside the media generation prompts above.)
- Use only the palette and fonts above.
- Text contrast meets WCAG AA. Every image has alt text; every icon button has an accessible label.
- Mobile first at 375px → 768px → 1280px. No horizontal scroll.
- One icon set, consistent stroke width. No emoji icons.
- Lazy-load media below the fold; every video has a poster image.
