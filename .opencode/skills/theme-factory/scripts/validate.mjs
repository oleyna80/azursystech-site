#!/usr/bin/env node
/**
 * DemoTheme contract validator.
 * Usage: node validate.mjs [--json] < theme.json
 *        node validate.mjs [--json] theme.json
 *        node validate.mjs --stdin  (reads from stdin)
 *
 * Validates DemoTheme against showcase/lib/types.ts contract:
 *   - All 10 required fields present
 *   - Colors are valid hex
 *   - WCAG AA contrast: primaryFg on primary, primary on bg
 *   - Approved heading fonts: Source Serif 4, Playfair Display, Lora
 *   - Body font must be Geist Sans
 *   - Enum values match allowed sets
 */

import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const jsonOut = args.includes('--json');

// --- WCAG contrast calculation ---
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
}

function relativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// --- Validators ---
const HEX_RE = /^#[0-9a-fA-F]{6}$/;

const APPROVED_HEADING_FONTS = ['Source Serif 4', 'Playfair Display', 'Lora'];
const APPROVED_BODY_FONT = 'Geist Sans';

const ENUMS = {
  radius: ['none', 'sm', 'md', 'lg', 'full'],
  sectionSpacing: ['compact', 'normal', 'spacious'],
  buttonStyle: ['solid', 'outline', 'ghost'],
  cardStyle: ['flat', 'elevated', 'bordered'],
  imageStyle: ['natural', 'rounded', 'grayscale', 'duotone'],
};

const REQUIRED_FIELDS = [
  'primary', 'primaryFg', 'accent', 'bg', 'surface', 'border',
  'font', 'radius', 'sectionSpacing', 'buttonStyle', 'cardStyle', 'imageStyle',
];

const COLOR_FIELDS = ['primary', 'primaryFg', 'accent', 'bg', 'surface', 'border'];

function validateTheme(theme, name) {
  const errors = [];
  const warnings = [];

  // Required fields
  for (const field of REQUIRED_FIELDS) {
    if (field === 'font') {
      if (!theme.font) { errors.push(`Missing required field: font`); continue; }
      if (!theme.font.heading) errors.push('Missing required field: font.heading');
      if (!theme.font.body) errors.push('Missing required field: font.body');
      continue;
    }
    if (!theme[field] && theme[field] !== '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Color validation
  for (const field of COLOR_FIELDS) {
    const val = theme[field];
    if (!val) continue;
    if (!HEX_RE.test(val)) {
      errors.push(`${field}: "${val}" is not a valid hex color (#RRGGBB)`);
    }
  }

  // WCAG contrast
  if (theme.primary && theme.primaryFg) {
    const ratio = contrastRatio(theme.primary, theme.primaryFg);
    if (ratio < 4.5) {
      errors.push(`WCAG AA FAIL: primaryFg (${theme.primaryFg}) on primary (${theme.primary}) — ratio ${ratio.toFixed(2)}:1 (need ≥ 4.5:1)`);
    } else if (ratio < 7) {
      warnings.push(`WCAG AA only: primaryFg on primary — ratio ${ratio.toFixed(2)}:1 (AAA requires ≥ 7:1)`);
    }
  }
  if (theme.primary && theme.bg) {
    const ratio = contrastRatio(theme.primary, theme.bg);
    if (theme.radius !== 'none' && ratio < 3) {
      warnings.push(`primary (${theme.primary}) on bg (${theme.bg}) — low contrast ${ratio.toFixed(2)}:1 for non-flat theme`);
    }
  }

  // Font validation
  if (theme.font?.heading && !APPROVED_HEADING_FONTS.includes(theme.font.heading)) {
    errors.push(`font.heading: "${theme.font.heading}" not in approved set: ${APPROVED_HEADING_FONTS.join(', ')}`);
  }
  if (theme.font?.body && theme.font.body !== APPROVED_BODY_FONT) {
    errors.push(`font.body: "${theme.font.body}" — must be "${APPROVED_BODY_FONT}"`);
  }

  // Enum validation
  for (const [field, allowed] of Object.entries(ENUMS)) {
    if (theme[field] && !allowed.includes(theme[field])) {
      errors.push(`${field}: "${theme[field]}" not in allowed values: ${allowed.join(', ')}`);
    }
  }

  // bg should not be pure white
  if (theme.bg && theme.bg.toUpperCase() === '#FFFFFF') {
    warnings.push('bg is pure white #FFFFFF — use off-white unless niche demands sterile/clinical');
  }

  // border should not be #ccc
  if (theme.border && theme.border.toUpperCase() === '#CCCCCC') {
    warnings.push('border is #CCCCCC — use a muted variant of bg');
  }

  return { name: name || 'unnamed', errors, warnings, valid: errors.length === 0 };
}

// --- Main ---
function main() {
  let input;
  const fileArg = args.find(a => !a.startsWith('--'));

  if (fileArg) {
    try { input = readFileSync(fileArg, 'utf-8'); }
    catch (e) { console.error(`Cannot read ${fileArg}: ${e.message}`); process.exit(2); }
  } else {
    // Read from stdin
    input = readFileSync(0, 'utf-8');
  }

  let theme;
  try { theme = JSON.parse(input); }
  catch (e) { console.error(`Invalid JSON: ${e.message}`); process.exit(2); }

  const themes = Array.isArray(theme) ? theme : [theme];
  const results = themes.map(t => validateTheme(t, t._name));

  if (jsonOut) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    for (const r of results) {
      const label = r.name !== 'unnamed' ? `"${r.name}"` : 'theme';
      if (r.valid && r.warnings.length === 0) {
        console.log(`✅ ${label}: PASS`);
        continue;
      }

      if (r.valid && r.warnings.length > 0) {
        console.log(`⚠️  ${label}: PASS with ${r.warnings.length} warning(s)`);
        for (const w of r.warnings) console.log(`   ⚠ ${w}`);
        continue;
      }

      console.log(`❌ ${label}: ${r.errors.length} error(s), ${r.warnings.length} warning(s)`);
      for (const e of r.errors) console.log(`   ❌ ${e}`);
      for (const w of r.warnings) console.log(`   ⚠ ${w}`);
    }
  }

  const allValid = results.every(r => r.valid);
  process.exit(allValid ? 0 : 1);
}

main();
