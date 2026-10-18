# Nebula

Waitlist site for **Nebula**, a non-custodial DeFi staking platform for crypto investors, launching soon.

A single static page: plain HTML, CSS and JavaScript, with no build step and no dependencies beyond Google Fonts.

![Nebula feature art](assets/img-01-2.jpg)

## What's on the page

1. **Navigation**: sticky top bar that collapses to a menu sheet on mobile
2. **Hero**: "Coming soon" badge, inline waitlist form and a live "people ahead of you" counter; signing up swaps the form for a referral link
3. **Orbital scene**: canvas-drawn 3D sphere that rotates on scroll and reveals one stat per orbiting point; falls back to a video on low-power devices
4. **Features**: four glow cards with a lime border glow that follows the cursor
5. **Proof**: three beta numbers that count up when they come into view
6. **Final CTA**: repeat waitlist form with live sign-up count and avatars
7. **Footer**: copyright, privacy link, one social link

## Design system

Everything follows the Nebula design system in [`CLAUDE.md`](CLAUDE.md):

| | |
|---|---|
| **Palette** | Ink & Volt (dark only): `#0B0B0C` background, `#161618` surface, `#F4F4F2` text, `#8A8A86` muted, `#C6FF3D` accent |
| **Accent rule** | Lime only on the primary button, focus rings and one highlighted word per section |
| **Type** | Archivo Black (uppercase display), Inter (body), JetBrains Mono (numbers and labels) |
| **Layout** | Centred stack, 1120px max width, 4px spacing scale, 96–128px between sections |
| **Motion** | Magnetic buttons (6px max), cursor-tracking card glow, count-up numbers; all reduced to fades under `prefers-reduced-motion` |

## Project structure

```
index.html        Page markup and copy
styles.css        Design tokens and all styles
script.js         Menu, waitlist, magnetic buttons, card glow, count-ups, orbital scene
assets/
  img-01-1…4.jpg  Feature card renders (1200×896)
  vid-01.mp4      Ambient background loop (hero + final CTA)
  vid-02.mp4      Orbital scene fallback video
  vid-0*-poster.jpg  Video poster frames
CLAUDE.md         Brief, design system and media prompts
```

## Run locally

Any static file server works:

```bash
python -m http.server 5173
```

Then open http://localhost:5173.

## Before launch

- **Connect the waitlist.** Sign-ups and the live count are simulated in the browser (`localStorage`). Replace `submitSignup()` in `script.js` with a call to your waitlist API, and feed the live count from it too.
- **Replace placeholder copy.** The beta numbers ($4.2M staked, 1,180 wallets, 99.97% uptime), the six named networks and the waitlist fee discount are placeholders.
- **Fill in the footer links.** The privacy and social links currently point to `#privacy` and `#x`.

## Deployment

Hosted on GitHub Pages from the `main` branch root. Push to `main` to redeploy.
