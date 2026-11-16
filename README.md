# Beautiful Souls

A lightweight static website deployed by Cloudflare Pages from the repository root. It uses plain HTML, CSS, JavaScript and JSON; there is no build step or framework.

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
│   ├── styles/site.css
│   ├── images/
│   │   ├── creator-sunrise.webp
│   │   ├── oneness-tree.webp
│   │   ├── human-family.webp
│   │   ├── freedom-hiker.webp
│   │   ├── hardship-mountains.webp
│   │   └── meaning-lake.webp
│   └── scripts/
│       ├── site.js
│       ├── framework-reader.js
│       └── references.js
└── content/
    ├── framework-index.json
    ├── references.json
    └── essays/
        ├── part1.json
        ├── p1-1.json … p1-4.json
        ├── part2.json
        └── p2-1.json … p2-7.json
```

## Where to edit

- **Home page:** edit the six cards in `index.html`. The heading is the hyperlink; the description below it is plain text. Each card has a local image under `assets/images/` and an image `alt` description. Replace the corresponding WebP file to change a photo.
- **Other page text:** edit `explorations.html`, `modern-life.html`, or `about.html`.
- **Framework essay wording:** edit the corresponding JSON file in `content/essays/`. Each file has an `id` and a `paragraphs` array.
- **Add a Framework essay:** create a JSON file in `content/essays/`, then add its ID to the `order` array and its metadata to `entries` in `content/framework-index.json`. Set its `source` to the path, such as `content/essays/p1-5.json`. Use the matching Part name in the `part` field.
- **Essay titles and contents order:** edit `content/framework-index.json`. The order in its `order` array controls the navigation sequence.
- **Bibliography:** edit `content/references.json`. Keep reference numbers unique and aligned with citations such as `[12]` in essay text.
- **Visual design and fonts:** edit `assets/styles/site.css`.
- **Shared navigation and footer behavior:** edit `assets/scripts/site.js`.
- **Framework reader and citation display:** edit `assets/scripts/framework-reader.js`.
- **Bibliography rendering:** edit `assets/scripts/references.js`.

The six homepage photographs are stored locally in `assets/images/` as WebP files. The homepage uses a soft gradient overlay so the text fades naturally into each image.

## Publish your edits

1. Edit only the relevant page, script, stylesheet or JSON file.
2. Check JSON syntax and confirm any new essay path is present in `content/framework-index.json`.
3. Commit and push to `main`. Cloudflare Pages should deploy automatically.

Cloudflare Pages configuration: leave the build command blank and use the repository root as the build output directory.
