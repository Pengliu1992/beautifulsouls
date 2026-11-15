# Beautiful Souls — website source

A static editorial website for Beautiful Souls. It is built with HTML, CSS and vanilla JavaScript and deployed with Cloudflare Pages from the `main` branch.

## Main navigation
- Home
- The Framework
- Explorations
- Modern Life
- About

## The Framework
The site presents Part I and Part II from the current manuscript, including a separate Part opening for each and the original numbered essays. The reading sequence includes previous/next navigation, a table of contents, and links to the manuscript bibliography. Essay wording and reference data are extracted from the supplied manuscript PDF.

Part III, *A Meaningful Life in the Modern World*, appears only under Modern Life. It is marked as developing because the supplied manuscript names the part but does not contain developed essay sections for it.

## Files
- `index.html`, `framework.html`, `explorations.html`, `modern-life.html`, `about.html` — site sections
- `essay.html` — electronic-book reader template
- `essays-index.json` — reading order and navigation metadata
- `essays/` — one JSON file for each Part opening or essay, making individual updates straightforward
- `essays.js` — reader navigation and rendering
- `references.html`, `references.json`, `references.js` — bibliography and citation anchors
- `styles.css`, `script.js` — shared visual design and site behavior

## Deploy
Cloudflare Pages is configured for a plain static site: no build command; repository root as the build output directory. Commits to `main` trigger automatic deployments.
