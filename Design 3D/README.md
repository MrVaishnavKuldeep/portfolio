# Hero — "Intro Around Avatar" handoff

Production code for the direction you picked. Three things to drop into your Next.js repo.

## 1. Asset
Copy `public/assets/wave-strip.png` → your repo's `public/assets/wave-strip.png`

(It's an 8-frame transparent sprite of the green-keyed wave — 1600×429, one cell = 200×429.)

## 2. Component
Replace `components/Hero.tsx` with `Hero.tsx` from this folder.
- Uses your existing `@/components/ui/button` and `/api/data/profile`.
- Pulls `name` + `title` from the profile API (with sensible fallbacks).
- Skill chips live in the `SKILLS` array; floating-label positions are in `POS`.

## 3. Styles
Paste the contents of `hero-animations.css` at the **end of `app/globals.css`**.
(Keyframes can't live in a CSS module here; they need to be global.)

## Notes
- **Layout:** desktop/tablet (≥ lg) shows the floating "orbit"; below lg it falls back to a clean stacked layout (avatar + name + wrapped chips) so it stays usable on phones.
- **Motion:** the wave is pure CSS (`steps(8)`), the labels fade + bob in. All disabled under `prefers-reduced-motion`.
- **Tweaking the wave speed:** change `1.15s` in `.kv-wave-strip`.
- **Tweaking label positions:** edit the `left`/`top` percentages in the `POS` map.

## Want a transparent video instead of the sprite?
The sprite is the most robust (plays everywhere, any background). If you'd rather use a real transparent video, export the clip as **WebM / VP9 with alpha** from your generator, drop it at `public/assets/wave.webm`, and swap `<Avatar/>`'s `<img>` for:

```tsx
<video src="/assets/wave.webm" autoPlay muted loop playsInline
       className="block h-full w-auto max-w-none" />
```
(MP4/H.264 cannot store transparency, which is why the sprite is the default.)
