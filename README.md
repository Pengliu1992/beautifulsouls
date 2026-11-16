# Beautiful Souls

A lightweight static website deployed by Cloudflare Pages. The site uses plain HTML, CSS, JavaScript, and JSON. There is no framework, package manager, or build step.

## Repository layout

```text
/
├── index.html
├── framework.html
├── explorations.html
├── modern-life.html
├── about.html
├── references.html
├── README.md
├── assets/
│   ├── images/
│   │   └── framework/
│   │       ├── part1.webp
│   │       ├── p1-1.webp … p1-4.webp
│   │       ├── part2.webp
│   │       └── p2-1.webp … p2-7.webp
│   ├── scripts/
│   │   ├── site.js
│   │   ├── homepage.js
│   │   ├── framework-reader.js
│   │   └── references.js
│   └── styles/
│       └── site.css
├── content/
│   ├── framework-index.json
│   ├── references.json
│   └── essays/
│       ├── part1.json
│       ├── p1-1.json … p1-4.json
│       ├── part2.json
│       └── p2-1.json … p2-7.json
└── tools/
    └── validate-content.mjs
```

## The main content rule

**`content/framework-index.json` is the single source of truth for the Framework contents and homepage cards.**

It controls:
- Reading order.
- Essay titles, part names, and table-of-contents labels.
- The essay JSON file loaded by the reader.
- Homepage card summaries.
- Homepage image paths and accessible image descriptions.

The homepage and Framework contents are generated from this index. You do not need to edit the card markup in `index.html` or the homepage script when adding a card.

## Add a Framework topic and homepage card

1. **Choose a unique ID.** Existing IDs use `part1`, `p1-1`, `part2`, and so on. Use a stable ID such as `p1-5` for the next section in Part I.
2. **Create its essay file** at `content/essays/<id>.json`. Keep the existing format:
   ```json
   {
     "id": "p1-5",
     "paragraphs": [
       "First paragraph...",
       "Second paragraph..."
     ]
   }
   ```
3. **Add one entry** to the `entries` object in `content/framework-index.json`. Include the reader fields and homepage fields:
   ```json
   "p1-5": {
     "id": "p1-5",
     "title": "Your essay title",
     "part": "Part I",
     "label": "1.5",
     "source": "content/essays/p1-5.json",
     "summary": "A concise description of the theme. Keep it to one or two sentences.",
     "image": "assets/images/framework/p1-5.webp",
     "imageAlt": "A concise description of the image"
   }
   ```
4. **Add the image** at the path in the `image` field. Use a wide WebP image consistent with the existing card images.
5. **Add the ID to the `order` array** at the position where the essay should appear.

That is all: the homepage card, its title link, and the Framework contents entry will use the new index data automatically. Part overviews are handled the same way as subsection entries; use `"label": "Part opening"` for an overview.

## Other content updates

- **Essay wording:** edit the matching file in `content/essays/`. Keep its `id` unchanged and edit the `paragraphs` array.
- **Essay title, order, card summary, or image:** edit `content/framework-index.json`.
- **Bibliography:** edit `content/references.json`. Keep reference numbers unique and aligned with citations such as `[12]` in essay paragraphs.
- **Explorations, Modern Life, or About copy:** edit the matching root HTML page.
- **New static page:** add a root-level HTML file and add its navigation link to the existing page headers.
- **Visual design and responsive layout:** edit `assets/styles/site.css`.
- **Shared navigation and footer behavior:** edit `assets/scripts/site.js`.
- **Homepage card rendering:** edit `assets/scripts/homepage.js` only when the rendering behavior itself needs to change.
- **Framework reader:** edit `assets/scripts/framework-reader.js`.
- **Bibliography display and citation scrolling:** edit `assets/scripts/references.js`.

## Validate before publishing

Run this from the repository root:

```sh
node tools/validate-content.mjs
```

The validator checks that every ordered Framework entry has a matching essay, homepage summary, image, and image description. It also checks reference-number uniqueness and verifies that every in-text citation points to an existing bibliography entry. It requires only Node.js and does not affect Cloudflare deployment.

## Publish

Commit and push changes to `main`. Cloudflare Pages should deploy automatically.

Cloudflare Pages configuration:
- Build command: leave blank.
- Build output directory: repository root.
