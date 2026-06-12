#!/usr/bin/env node
/**
 * Brand token extractor for AzurSysTech.
 * Reads CSS custom properties from globals.css, outputs structured JSON.
 * Usage: node extract-tokens.mjs [--json] [--css path/to/globals.css]
 *
 * Extracts:
 *   - @theme inline { --color-* } tokens
 *   - Font family declarations
 *   - Any CSS custom property on :root
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const cwd = process.cwd();
const args = process.argv.slice(2);
const jsonOut = args.includes('--json');

const cssIdx = args.indexOf('--css');
const cssPath = cssIdx >= 0 ? args[cssIdx + 1] : join(cwd, 'web/src/app/globals.css');

if (!existsSync(cssPath)) {
  console.error(`CSS file not found: ${cssPath}`);
  process.exit(2);
}

const css = readFileSync(cssPath, 'utf-8');

// --- Extract @theme inline block ---
const themeBlock = css.match(/@theme\s+inline\s*\{([^}]+)\}/s);
const colorTokens = {};

if (themeBlock) {
  const lines = themeBlock[1].split('\n');
  for (const line of lines) {
    const m = line.match(/--([\w-]+)\s*:\s*(.+?);/);
    if (m) {
      const name = m[1].trim();
      const value = m[2].trim().replace(/\/\*.*\*\//, '').trim();
      colorTokens[name] = value;
    }
  }
}

// --- Extract :root custom properties ---
const rootBlock = css.match(/:root\s*\{([^}]*)\}/s);
const rootVars = {};

if (rootBlock) {
  const lines = rootBlock[1].split(';');
  for (const line of lines) {
    const m = line.match(/--([\w-]+)\s*:\s*(.+)/);
    if (m) {
      const name = m[1].trim();
      const value = m[2].trim().replace(/\/\*.*\*\//, '').trim();
      if (!colorTokens[name]) rootVars[name] = value;
    }
  }
}

// --- Extract font imports ---
const fontImports = [];
const fontRe = /import\s+\{([^}]+)\}\s+from\s+['"]next\/font\/google['"]/g;
let fm;
while ((fm = fontRe.exec(css)) !== null) {
  fontImports.push(fm[1].split(',').map(s => s.trim()));
}

// --- Extract font-family declarations ---
const fontFamilyRe = /--font-([\w-]+)\s*:\s*(.+?);/g;
const fontFamilies = {};
let ffm;
while ((ffm = fontFamilyRe.exec(css)) !== null) {
  fontFamilies[ffm[1].trim()] = ffm[2].trim();
}

// --- Build output ---
const result = {
  source: cssPath,
  themeTokens: {
    count: Object.keys(colorTokens).length,
    tokens: colorTokens,
  },
  fonts: {
    imports: fontImports.flat(),
    families: fontFamilies,
  },
  rootVariables: rootVars,
  // Group tokens by role
  roles: {
    background: Object.entries(colorTokens).filter(([k]) => k.includes('base') || k.includes('surface')).map(([k]) => k),
    ink: Object.entries(colorTokens).filter(([k]) => k.includes('graphite') || k.includes('ink') || k.includes('text')).map(([k]) => k),
    accent: Object.entries(colorTokens).filter(([k]) => k.includes('accent')).map(([k]) => k),
    border: Object.entries(colorTokens).filter(([k]) => k.includes('border')).map(([k]) => k),
    other: Object.entries(colorTokens).filter(([k]) => !['base', 'surface', 'graphite', 'ink', 'text', 'accent', 'border'].some(t => k.includes(t))).map(([k]) => k),
  },
};

if (jsonOut) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`## Brand Tokens — ${cssPath}\n`);

  console.log('### Color Palette');
  const maxLen = Math.max(...Object.keys(colorTokens).map(k => k.length));
  for (const [name, value] of Object.entries(colorTokens)) {
    const bar = value.match(/^#[0-9a-fA-F]{6}$/) ? `  \x1b[48;2;${hexToAnsi(value)}m    \x1b[0m` : '';
    console.log(`  --${name.padEnd(maxLen)}  ${value}${bar}`);
  }

  console.log('\n### Font Families');
  for (const [name, value] of Object.entries(fontFamilies)) {
    console.log(`  --font-${name}: ${value}`);
  }

  if (fontImports.flat().length > 0) {
    console.log('\n### Google Font Imports');
    console.log(`  ${fontImports.flat().join(', ')}`);
  }

  console.log('\n### Token Roles');
  for (const [role, tokens] of Object.entries(result.roles)) {
    if (tokens.length > 0) console.log(`  ${role}: ${tokens.join(', ')}`);
  }
}

function hexToAnsi(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r};${g};${b}`;
}

process.exit(0);
