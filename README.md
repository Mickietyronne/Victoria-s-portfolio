# Victoria — Portfolio

Static site: HTML5, CSS3 and vanilla JavaScript (ES5+). No framework, no build step, no dependencies.
Fonts: Inter Tight (headings and body) and JetBrains Mono (labels) via Google Fonts.

```
index.html      Home (work, playground, process, about, testimonials, contact)
cici.html       Case study — Cici
quickpay.html   Case study — QuickPay
pipchat.html    Case study — Pipchat
peopleflow.html Case study — PeopleFlow
site.css        Shared rules (focus states, filter tabs)
site.js         All interactions (filter, playground, player, composer, personas)
assets/         Images (.webp)
vercel.json     Clean URLs (/cici, /quickpay) + image caching
```

## Run locally
Open `index.html` in a browser, or run `npx serve .` for a local server.

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project**, import the repo.
3. Framework preset: **Other**. Leave build command and output directory empty.
4. Deploy.

Or from the terminal: `npm i -g vercel` then `vercel` inside this folder.

## Before going live
- Search for `[` — every bracketed placeholder (surname, metrics, roles, quotes, song, links) needs real content.
- Her email (adenekanayo2002@gmail.com) is set in `index.html` and at the top of `site.js`.
- `resume.pdf` is her CV; replace the file to update it. Replace `#linkedin` with her real LinkedIn URL.
- Swap the images in `assets/` for full-resolution exports (keep the same file names).
