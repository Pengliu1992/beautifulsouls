# Beautiful Souls — website source

A static editorial website for Beautiful Souls, built with HTML, CSS and vanilla JavaScript and deployed with Cloudflare Pages from the \`main\` branch.

## Main navigation
- Home
- The Framework
- Explorations
- Modern Life
- About

## Home
The Home page contains six image-led highlights in a two-column, three-row grid. Each card has a short title, a concise statement, an image and a link to the most relevant Framework reading.

## The Framework
The Framework is a documentation-style reader. Its left contents panel has independently collapsible Part I and Part II sections; the right panel displays the selected Part opening or essay. In-text citations link to their numbered entries in the full references page. The reader has no previous/next controls.

The site preserves the two Part openings and all 11 numbered essays from the supplied manuscript. Part III is not displayed.

## Files
- \`index.html\`, \`framework.html\`, \`explorations.html\`, \`modern-life.html\`, \`about.html\` — site sections
- \`essay.html\` — compatibility redirect to the Framework reader for older essay links
- \`essays-index.json\` and \`essays/\` — reader index and essay text
- \`essays.js\` — collapsible navigation and reader behavior
- \`references.html\`, \`references.json\`, \`references.js\` — bibliography and citation anchors
- \`styles.css\`, \`script.js\` — shared design and behavior

## Deploy
Cloudflare Pages is configured for a plain static site: no build command; repository root as the build output directory. Commits to \`main\` trigger automatic deployments.
