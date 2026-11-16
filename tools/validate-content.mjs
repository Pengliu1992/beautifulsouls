import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function fail(message) {
  errors.push(message);
}

function readJson(relativePath) {
  const absolutePath = path.resolve(root, relativePath);
  if (!absolutePath.startsWith(root + path.sep) || !fs.existsSync(absolutePath)) {
    fail('Missing file: ' + relativePath);
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    fail('Invalid JSON in ' + relativePath + ': ' + error.message);
    return null;
  }
}

function existsInsideRepository(relativePath) {
  const absolutePath = path.resolve(root, relativePath);
  return absolutePath.startsWith(root + path.sep) && fs.existsSync(absolutePath);
}

const index = readJson('content/framework-index.json');
const references = readJson('content/references.json');

let readingCount = 0;
let imageCount = 0;
const citationNumbers = new Set();

if (index) {
  if (!Array.isArray(index.order) || !index.entries || typeof index.entries !== 'object') {
    fail('framework-index.json must contain an order array and entries object.');
  } else {
    const orderedIds = new Set(index.order);

    if (orderedIds.size !== index.order.length) {
      fail('The framework-index order array contains duplicate IDs.');
    }

    for (const id of index.order) {
      const entry = index.entries[id];
      if (!entry) {
        fail('No entry exists for ordered ID: ' + id);
        continue;
      }

      readingCount += 1;

      if (entry.id !== id) fail('Entry ID does not match its key: ' + id);
      if (!entry.title || !entry.part || !entry.label) fail('Missing reader metadata: ' + id);
      if (!entry.source) fail('Missing essay source: ' + id);
      if (!entry.summary) fail('Missing homepage summary: ' + id);
      if (!entry.image || !entry.imageAlt) fail('Missing homepage image or alt text: ' + id);

      if (entry.source) {
        const essay = readJson(entry.source);
        if (essay) {
          if (essay.id !== id) fail('Essay ID does not match its index entry: ' + id);
          if (!Array.isArray(essay.paragraphs) || essay.paragraphs.length === 0) {
            fail('Essay has no paragraphs: ' + id);
          } else {
            for (const paragraph of essay.paragraphs) {
              const matches = String(paragraph).matchAll(/\[(\d+(?:,\s*\d+)*)\]/g);
              for (const match of matches) {
                for (const number of match[1].split(/,\s*/)) citationNumbers.add(Number(number));
              }
            }
          }
        }
      }

      if (entry.image) {
        if (!entry.image.startsWith('assets/images/')) {
          fail('Homepage image must be stored under assets/images/: ' + id);
        } else if (!existsInsideRepository(entry.image)) {
          fail('Missing homepage image: ' + entry.image);
        } else {
          imageCount += 1;
        }
      }
    }

    for (const id of Object.keys(index.entries)) {
      if (!orderedIds.has(id)) fail('Entry is not included in the order array: ' + id);
    }
  }
}

let referenceCount = 0;
const referenceNumbers = new Set();

if (Array.isArray(references)) {
  referenceCount = references.length;
  for (const reference of references) {
    if (!Number.isInteger(reference.number)) {
      fail('A bibliography entry has an invalid reference number.');
      continue;
    }
    if (referenceNumbers.has(reference.number)) {
      fail('Duplicate bibliography number: ' + reference.number);
    }
    referenceNumbers.add(reference.number);
    if (!reference.text) fail('Bibliography entry has no text: ' + reference.number);
  }

  for (const number of citationNumbers) {
    if (!referenceNumbers.has(number)) fail('Citation [' + number + '] has no bibliography entry.');
  }
} else if (references !== null) {
  fail('references.json must contain an array.');
}

if (errors.length) {
  console.error('Content validation failed:');
  for (const error of errors) console.error(' - ' + error);
  process.exitCode = 1;
} else {
  console.log(
    'Content validated: ' + readingCount + ' readings, ' + imageCount
    + ' homepage images, ' + referenceCount + ' bibliography entries, and all citations.'
  );
}
