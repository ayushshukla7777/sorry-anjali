# sorry-anjali

A one-page apology, built for Anjali. Not a template — a small hand-made corner of
the internet with her photo in it, a letter that types itself out, three buttons that
refuse to be pressed, and a very satisfying 100%.

## What's on the page

1. **Hero** — "Hello, my *most beautiful* girlfriend", her photo in an arched frame,
   warm aurora wash and drifting gold dust
2. **A scrolling strip** — meri sonna ji, i'm sorry, i love you
3. **The letter** — the apology, written out word by word
4. **The question** — three buttons. Two of them run away from the cursor and refuse to
   be pressed; the third one drifts slowly and is the only one that means it
5. **Poppers + the yay menu** — clicking `forgive 100%` fires confetti (paper + heart
   shapes), then opens a small menu
6. **Why I love you** — two counter-scrolling rows of reasons, padlocked until she forgives me

The forgiveness state is remembered in `localStorage`, so a refresh keeps the site
unlocked.

## Stack

- **Vite + React 19**
- **Tailwind CSS v4** (`@tailwindcss/vite`, design tokens in `src/index.css`)
- **Motion** (`motion/react`) for the component animation + dialog transitions
- **canvas-confetti** for the poppers

### Animation components (vendored source, MIT)

Copied from the libraries' shadcn registries into `src/components/ui/`, then lightly
adapted (palette, plus a `staggerDelay` / `textClassName` prop so the long letter does
not take 15 seconds to appear):

| Component | From | Used for |
| --- | --- | --- |
| `sparkles-text.tsx` | Magic UI | the sparkles around "most beautiful" |
| `shimmer-button.tsx` | Magic UI | the `forgive 100%` button |
| `marquee.tsx` | Magic UI | the strip and the "why I love you" rows |
| `animated-shiny-text.tsx` | Magic UI | the "waiting for forgiveness…" status pill |
| `blur-fade.tsx` | Magic UI | every section reveal |
| `particles.tsx` | Magic UI | drifting gold dust behind the whole page |
| `confetti.tsx` | Magic UI | the poppers canvas |
| `aurora-background.tsx` | Aceternity UI | the warm aurora behind the hero |
| `text-generate-effect.tsx` | Aceternity UI | the letter writing itself out |
| `meteors.tsx` | Aceternity UI | faint streaks inside the button arena |

`src/components/ForgiveArena.jsx` (the dodge physics) and `src/components/YayDialog.jsx`
are written for this page.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
npm run preview
```

## Deploy

Static site on Render: build `npm ci && npm run build`, publish `dist`. The blueprint in
`render.yaml` matches the live service.

## Note

Her photo (`public/anjali.webp`) ships with the site, so it is public wherever this repo
is public.
