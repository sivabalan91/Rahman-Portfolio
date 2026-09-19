import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(DIR, 'data');
const FILE = path.join(DATA_DIR, 'submissions.json');

/** Read all stored submissions (returns [] if none yet). */
export function readAll() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return [];
  }
}

/** Append one submission to the JSON store. */
export function append(submission) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const all = readAll();
  all.push(submission);
  fs.writeFileSync(FILE, JSON.stringify(all, null, 2), 'utf8');
  return submission;
}