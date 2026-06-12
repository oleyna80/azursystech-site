#!/usr/bin/env node
/**
 * Pre-review context gatherer.
 * Collects everything reviewer needs before starting a review.
 * Usage: node gather-diff.mjs [--json] [--dimension code|docs|security|architecture|copy|drift]
 *
 * Outputs:
 *   - git: branch, commit, changed files with diff stats
 *   - files: categorized by type (tsx, ts, css, config, docs, md)
 *   - routes: affected Next.js routes
 *   - ssot: memory_bank/ and docs/ drift indicators
 */

import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { globSync } from 'node:fs';

const cwd = process.cwd();
const args = process.argv.slice(2);
const jsonOut = args.includes('--json');
const dimIdx = args.indexOf('--dimension');
const dimension = dimIdx >= 0 ? args[dimIdx + 1] : 'code';

function sh(cmd, opts = {}) {
  try {
    return { ok: true, stdout: execSync(cmd, { cwd, encoding: 'utf-8', timeout: 15000, ...opts }).trim() };
  } catch (e) {
    return { ok: false, stdout: e.stdout?.trim() || '', stderr: e.stderr?.trim() || '', code: e.status };
  }
}

// --- Git ---
const gitBranch = sh('git branch --show-current');
const gitSha = sh('git rev-parse HEAD');
const gitChangedFiles = sh('git diff --name-only HEAD');
const gitStagedFiles = sh('git diff --name-only --staged');
const gitUntracked = sh('git ls-files --others --exclude-standard');
const gitDiffStat = sh('git diff --stat HEAD');

const changedFiles = [
  ...(gitChangedFiles.ok ? gitChangedFiles.stdout.split('\n').filter(Boolean) : []),
  ...(gitStagedFiles.ok ? gitStagedFiles.stdout.split('\n').filter(Boolean) : []),
  ...(gitUntracked.ok ? gitUntracked.stdout.split('\n').filter(Boolean) : []),
];

// --- File categorization ---
const CATEGORIES = {
  component: f => /\.tsx$/.test(f) && f.includes('/components/'),
  page: f => /\.tsx$/.test(f) && (f.includes('/app/') || f.includes('/pages/')),
  api: f => /\.ts$/.test(f) && f.includes('/api/'),
  lib: f => /\.ts$/.test(f) && (f.includes('/lib/') || f.includes('/utils/')),
  config: f => /\.(json|mjs|js|yml|yaml|toml)$/.test(f) && !f.includes('node_modules'),
  css: f => /\.css$/.test(f),
  docs: f => /\.md$/.test(f) && (f.includes('docs/') || f.includes('memory_bank/')),
  agent: f => /\.md$/.test(f) && (f.includes('.agent/') || f.includes('.claude/')),
  docker: f => /docker|Dockerfile|compose/.test(f),
  script: f => /\.sh$/.test(f) || (f.includes('scripts/') && /\.(ts|js|mjs)$/.test(f)),
  other: () => true,
};

const filesByCategory = {};
for (const cat of Object.keys(CATEGORIES)) filesByCategory[cat] = [];

for (const f of changedFiles) {
  for (const [cat, fn] of Object.entries(CATEGORIES)) {
    if (fn(f)) { filesByCategory[cat].push(f); break; }
  }
}

// --- Affected routes ---
const routes = [];
const pagePaths = globSync('web/src/app/**/page.tsx', { cwd, absolute: true });
const apiPaths = globSync('web/src/app/api/**/route.ts', { cwd, absolute: true });

for (const p of pagePaths) {
  const rel = relative(cwd, p);
  const routePath = '/' + relative(join(cwd, 'web/src/app'), p).replace(/\/page\.tsx$/, '').replace(/^\/$/, '');
  if (changedFiles.some(f => rel.includes(f.replace(/^web\//, '')) || f.includes(rel.replace(/^web\//, '')))) {
    routes.push({ type: 'page', route: routePath || '/', file: rel });
  }
}
for (const p of apiPaths) {
  const rel = relative(cwd, p);
  const apiRoute = '/api/' + relative(join(cwd, 'web/src/app/api'), p).replace(/\/route\.ts$/, '');
  if (changedFiles.some(f => rel.includes(f.replace(/^web\//, '')) || f.includes(rel.replace(/^web\//, '')))) {
    routes.push({ type: 'api', route: apiRoute, file: rel });
  }
}

// --- SSOT drift indicators ---
const memoryBankFiles = existsSync(join(cwd, 'memory_bank'))
  ? globSync('memory_bank/*.md', { cwd }).map(f => relative(cwd, join(cwd, f)))
  : [];
const docSpecFiles = existsSync(join(cwd, 'docs/specs'))
  ? globSync('docs/specs/**/*.md', { cwd }).map(f => relative(cwd, join(cwd, f)))
  : [];

// --- Build ---
const context = {
  git: {
    branch: gitBranch.ok ? gitBranch.stdout : 'unknown',
    sha: gitSha.ok ? gitSha.stdout.substring(0, 8) : 'unknown',
    changedCount: changedFiles.length,
    diffStat: gitDiffStat.ok ? gitDiffStat.stdout : '',
  },
  files: {
    all: changedFiles,
    byCategory: Object.fromEntries(Object.entries(filesByCategory).filter(([, v]) => v.length > 0)),
  },
  routes,
  ssot: {
    memoryBank: memoryBankFiles,
    docSpecs: docSpecFiles,
    memoryBankChanged: memoryBankFiles.filter(f => changedFiles.includes(f)),
    docSpecsChanged: docSpecFiles.filter(f => changedFiles.includes(f)),
  },
  dimension,
};

if (jsonOut) {
  console.log(JSON.stringify(context, null, 2));
} else {
  console.log(`## Reviewer Context — ${dimension.toUpperCase()} dimension\n`);

  console.log('### Git');
  console.log(`  Branch: ${context.git.branch}  Commit: ${context.git.sha}`);
  console.log(`  Changed: ${context.git.changedCount} files\n`);

  const cats = Object.entries(context.files.byCategory);
  if (cats.length > 0) {
    console.log('### Files by category');
    for (const [cat, files] of cats) {
      console.log(`  ${cat} (${files.length}):`);
      for (const f of files.slice(0, 8)) console.log(`    ${f}`);
      if (files.length > 8) console.log(`    ... and ${files.length - 8} more`);
    }
  }

  if (context.routes.length > 0) {
    console.log('\n### Affected routes');
    for (const r of context.routes) {
      console.log(`  [${r.type.toUpperCase()}] ${r.route} → ${r.file}`);
    }
  }

  if (context.ssot.memoryBankChanged.length > 0 || context.ssot.docSpecsChanged.length > 0) {
    console.log('\n### SSOT drift indicators');
    if (context.ssot.memoryBankChanged.length > 0) {
      console.log('  memory_bank changed:', context.ssot.memoryBankChanged.join(', '));
    }
    if (context.ssot.docSpecsChanged.length > 0) {
      console.log('  docs/specs changed:', context.ssot.docSpecsChanged.join(', '));
    }
  }

  if (context.git.diffStat) {
    console.log(`\n### Diff stat\n${context.git.diffStat}`);
  }

  console.log(`\n### Ready for: reviewer --dimension ${dimension}`);
}

process.exit(0);
