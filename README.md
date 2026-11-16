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
│   │   ├── purpose-mountains.webp
│   │   └── life-lake.webp
│   └── scripts/
│       ├── site.js
│       ├── framework-reader.js
│       └── references.js
└── content/
    ├── framework-index.json
    ├── references.json
    └── essays/
```

## Where to edit

- **Home page:** edit the six cards in `index.html`. The title is the link to the Framework; the summary below is plain text.
- **Homepage photographs:** replace the corresponding WebP file in `assets/images/`. Keep the same filename and dimensions/aspect ratio to preserve the layout.
- **Other page text:** edit `explorations.html`, `modern-life.html`, or `about.html`.
- **Framework essay wording:** edit the corresponding JSON file in `content/essays/`.
- **Add a Framework essay:** create a JSON file in `content/essays/`, then add its ID to the `order` array and its metadata to `entries` in `content/framework-index.json`.
- **Essay titles and contents order:** edit `content/framework-index.json`.
- **Bibliography:** edit `content/references.json`.
- **Visual design and fonts:** edit `assets/styles/site.css`.
- **Shared navigation and footer behavior:** edit `assets/scripts/site.js`.
- **Framework reader and citation display:** edit `assets/scripts/framework-reader.js`.
- **Bibliography rendering:** edit `assets/scripts/references.js`.

When editing `assets/styles/site.css`, increment the version in the stylesheet links on all six HTML pages so browsers fetch the new styles.

## Publish your edits

1. Edit only the relevant page, script, stylesheet or JSON file.
2. Check JSON syntax and confirm any new essay path is present in `content/framework-index.json`.
3. Commit and push to `main`. Cloudflare Pages should deploy automatically.

Cloudflare Pages configuration: leave the build command blank and use the repository root as the build output directory.
