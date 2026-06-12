#!/usr/bin/env node
/**
 * AI-slop detector for taste-skill.
 * Scans project TSX/CSS files for common AI-generated patterns.
 * Usage: node detect.mjs [--json] [paths...]
 *   paths: files/dirs to scan (default: cwd, skips node_modules/.next)
 *   --json: output JSON for machine parsing
 */

import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execSync } from 'node:child_process';

const cwd = process.cwd();
const args = process.argv.slice(2);
const jsonOut = args.includes('--json');
const targets = args.filter(a => a !== '--json');

// --- Config ---
const SCAN_GLOBS = ['**/*.{tsx,jsx,css,html,md,mdx}'];
const SKIP_DIRS = ['node_modules', '.next', '.git', 'dist', 'build', '.claude'];

const PATTERNS = {
  emDash: {
    label: 'Em-dash usage (—)',
    regex: /—/g,
    severity: 'HIGH',
    help: 'Replace with regular hyphen (-) or restructure sentence.',
    section: '9.G',
  },
  enDash: {
    label: 'En-dash usage (–)',
    regex: /–/g,
    severity: 'MEDIUM',
    help: 'Replace with regular hyphen (-).',
    section: '9.G',
  },
  gradientText: {
    label: 'Gradient text (background-clip: text)',
    regex: /background-clip\s*:\s*text/gi,
    severity: 'MEDIUM',
    help: 'Use solid color. Emphasis via weight or size.',
    section: '9.A',
  },
  aiPurpleGradient: {
    label: 'AI-purple/blue gradient',
    regex: /(?:#[78][0-9a-f]{5}|#[9a-f][0-9a-f]{5}).*gradient|gradient.*(?:#[78][0-9a-f]{5}|#[9a-f][0-9a-f]{5})/gi,
    severity: 'MEDIUM',
    help: 'Use palette-matched branded gradients or skip.',
    section: '4.2',
  },
  interDefault: {
    label: 'Inter as default font (no Geist/Outfit/Cabinet override)',
    regex: /fontFamily\s*:\s*['"]Inter['"]|['"]Inter['"]\s*,/gi,
    severity: 'LOW',
    help: 'Prefer Geist, Outfit, Cabinet Grotesk, or Satoshi.',
    section: '4.1',
  },
  frauncesOrInstrument: {
    label: 'Banned serif (Fraunces/Instrument_Serif)',
    regex: /Fraunces|Instrument_Serif/gi,
    severity: 'HIGH',
    help: 'Use PP Editorial New, GT Sectra, or other approved serif from Section 4.1.',
    section: '4.1',
  },
  threeEqualCards: {
    label: '3-column equal card grid',
    regex: /grid-cols-[13]\b.*(?:card|Card)/g,
    severity: 'LOW',
    help: 'Use 2-column zig-zag, asymmetric grid, or horizontal-scroll. Not 3 equal columns.',
    section: '9.C',
  },
  pureBlack: {
    label: 'Pure black (#000000 or #000)',
    regex: /#000(?:000)?\b/gi,
    severity: 'LOW',
    help: 'Use off-black (zinc-950, graphite, near-black warm gray).',
    section: '9.A',
  },
  pureWhite: {
    label: 'Pure white (#ffffff or #fff)',
    regex: /#(?:fff|FFF|ffffff|FFFFFF)\b/gi,
    severity: 'LOW',
    help: 'Use off-white. Only pure white for text on dark bg is acceptable.',
    section: '4.2',
  },
  genericNames: {
    label: 'Generic brand/person names',
    regex: /\b(?:Acme|Nexus|SmartFlow|Cloudly|NovaCore|Quantumly|Flowbit|Jane Doe|John Doe|Sarah Chan|Jack Su)\b/gi,
    severity: 'LOW',
    help: 'Use creative, realistic, locale-appropriate names.',
    section: '9.D',
  },
  fillerVerbs: {
    label: 'Marketing buzzwords',
    regex: /\b(?:elevate|seamless|unleash|next-gen|revolutionize|game-changer|cutting-edge|world-class|enterprise-grade)\b/gi,
    severity: 'LOW',
    help: 'Use concrete verbs that describe what the product literally does.',
    section: '9.D',
  },
  eyebrowOveruse: {
    label: 'Eyebrow pattern (uppercase + tracking)',
    regex: /uppercase\s+tracking|tracking-\[.*\].*uppercase/gi,
    severity: 'LOW',
    help: 'Max 1 eyebrow per 3 sections. Count mechanically.',
    section: '4.7',
  },
  cardNesting: {
    label: 'Nested cards pattern',
    regex: /<Card[^>]*>[\s\S]*?<Card/gi,
    severity: 'HIGH',
    help: 'Nested cards are always wrong. Flatten layout.',
    section: '4.4',
  },
  scrollCues: {
    label: 'Scroll cues in copy',
    regex: /Scroll(?:\s+to\s+explore|↓|down)/gi,
    severity: 'LOW',
    help: 'Users know what scroll is. Remove the cue.',
    section: '9.F',
  },
  hScreen: {
    label: 'h-screen (viewport instability)',
    regex: /\bh-screen\b/gi,
    severity: 'MEDIUM',
    help: 'Use min-h-[100dvh] to prevent iOS Safari layout jumping.',
    section: '3.E',
  },
};

// --- Scan ---
function scanFile(filePath) {
  let content;
  try { content = readFileSync(filePath, 'utf-8'); }
  catch { return []; }

  const hits = [];
  for (const [key, p] of Object.entries(PATTERNS)) {
    const matches = [...content.matchAll(p.regex)];
    if (matches.length === 0) continue;

    const lines = content.substring(0, matches[0].index).split('\n');
    const lineNum = lines.length;

    hits.push({
      pattern: key,
      label: p.label,
      severity: p.severity,
      file: relative(cwd, filePath),
      line: lineNum,
      count: matches.length,
      help: p.help,
      section: p.section,
    });
  }
  return hits;
}

function scanTargets(paths) {
  const files = [];
  for (const p of paths) {
    for (const glob of SCAN_GLOBS) {
      try {
        const found = globSync(join(p, glob), { ignore: SKIP_DIRS.map(d => `**/${d}/**`), absolute: true });
        files.push(...found);
      } catch {}
    }
  }
  return [...new Set(files)].sort();
}

// --- Main ---
const scanPaths = targets.length > 0 ? targets : [cwd];
const files = scanTargets(scanPaths);

if (files.length === 0) {
  console.log(jsonOut ? '[]' : 'No scannable files found.');
  process.exit(0);
}

const allHits = files.flatMap(scanFile);

// Dedup by pattern+file (keep first occurrence for line number)
const seen = new Set();
const deduped = [];
for (const h of allHits) {
  const k = `${h.pattern}:${h.file}`;
  if (seen.has(k)) continue;
  seen.add(k);
  deduped.push(h);
}

if (jsonOut) {
  console.log(JSON.stringify(deduped, null, 2));
} else {
  if (deduped.length === 0) {
    console.log('✅ No AI-slop patterns detected.');
    process.exit(0);
  }

  const bySeverity = { HIGH: [], MEDIUM: [], LOW: [] };
  for (const h of deduped) bySeverity[h.severity].push(h);

  console.log(`🔍 AI-Slop Detection — ${deduped.length} finding(s) in ${files.length} file(s)\n`);

  for (const sev of ['HIGH', 'MEDIUM', 'LOW']) {
    const items = bySeverity[sev];
    if (items.length === 0) continue;
    const icon = sev === 'HIGH' ? '🔴' : sev === 'MEDIUM' ? '🟡' : '⚪';
    console.log(`${icon} ${sev} (${items.length}):`);
    for (const h of items) {
      console.log(`   ${h.label}`);
      console.log(`   → ${h.file}:${h.line} (${h.count} occurrence(s))`);
      console.log(`   → Fix: ${h.help} [§${h.section}]`);
      console.log();
    }
  }
}

process.exit(deduped.length > 0 ? 1 : 0);
