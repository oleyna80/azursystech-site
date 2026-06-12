#!/usr/bin/env node
/**
 * Pre-verification context gatherer.
 * Collects everything verifier needs before running checks.
 * Usage: node gather-context.mjs [--json] [--tier lite|standard|full]
 *
 * Outputs (JSON or human-readable):
 *   - git: branch, commit SHA, changed files (staged + unstaged)
 *   - project: package.json name, Next.js config presence
 *   - routes: discovered Next.js App Router routes
 *   - build: tsc/lint status if tier >= standard
 *   - secrets: secret-scan.sh staged output if tier >= full
 */

import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { globSync } from 'node:fs';

const cwd = process.cwd();
const args = process.argv.slice(2);
const jsonOut = args.includes('--json');
const tier = args.includes('--tier') ? args[args.indexOf('--tier') + 1] || 'standard' : 'standard';

function sh(cmd, opts = {}) {
  try {
    return { ok: true, stdout: execSync(cmd, { cwd, encoding: 'utf-8', timeout: 30000, ...opts }).trim() };
  } catch (e) {
    return { ok: false, stdout: e.stdout?.trim() || '', stderr: e.stderr?.trim() || '', code: e.status };
  }
}

// --- Git ---
const gitBranch = sh('git branch --show-current');
const gitSha = sh('git rev-parse HEAD');
const gitChanged = sh('git diff --name-only HEAD');
const gitStaged = sh('git diff --name-only --staged');
const gitUntracked = sh('git ls-files --others --exclude-standard');

const changedFiles = [
  ...(gitChanged.ok ? gitChanged.stdout.split('\n').filter(Boolean) : []),
  ...(gitStaged.ok ? gitStaged.stdout.split('\n').filter(Boolean) : []),
  ...(gitUntracked.ok ? gitUntracked.stdout.split('\n').filter(Boolean) : []),
];

// --- Project ---
const pkg = existsSync(join(cwd, 'package.json'))
  ? JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf-8'))
  : null;
const webPkg = existsSync(join(cwd, 'web', 'package.json'))
  ? JSON.parse(readFileSync(join(cwd, 'web', 'package.json'), 'utf-8'))
  : null;

const hasNextConfig = existsSync(join(cwd, 'web', 'next.config.ts')) || existsSync(join(cwd, 'web', 'next.config.mjs'));

// --- Routes (Next.js App Router) ---
let routes = [];
if (hasNextConfig) {
  const pageFiles = globSync('web/src/app/**/page.tsx', { cwd, absolute: true });
  const apiFiles = globSync('web/src/app/api/**/route.ts', { cwd, absolute: true });

  routes = [
    ...pageFiles.map(f => {
      const rel = relative(join(cwd, 'web/src/app'), f);
      const dir = rel.replace(/\/page\.tsx$/, '');
      return { type: 'page', route: '/' + (dir === 'page.tsx' ? '' : dir), file: relative(cwd, f) };
    }),
    ...apiFiles.map(f => {
      const rel = relative(join(cwd, 'web/src/app/api'), f);
      const dir = rel.replace(/\/route\.ts$/, '');
      return { type: 'api', route: '/api/' + (dir === 'route.ts' ? '' : dir), file: relative(cwd, f) };
    }),
  ];
}

// --- Changed routes (routes whose files appear in changedFiles) ---
const changedRoutes = routes.filter(r => changedFiles.some(f => r.file.includes(f) || f.includes(r.file)));

// --- Build checks (tier >= standard) ---
let typeCheck = null, lintCheck = null, buildCheck = null;

if (tier === 'standard' || tier === 'full') {
  if (webPkg?.scripts?.['check:types']) {
    typeCheck = sh('npm run check:types', { cwd: join(cwd, 'web') });
  }
  if (webPkg?.scripts?.lint) {
    lintCheck = sh('npm run lint', { cwd: join(cwd, 'web') });
  }
}

// --- Secret scan (tier >= full) ---
let secretScan = null;
if (tier === 'full') {
  const scanScript = join(cwd, 'scripts', 'secret-scan.sh');
  if (existsSync(scanScript)) {
    secretScan = sh(`bash ${scanScript} staged`);
  }
}

// --- Test status ---
let testResult = null;
if (webPkg?.scripts?.test) {
  testResult = sh('npx vitest run --reporter=json 2>/dev/null || npx vitest run 2>/dev/null', { cwd: join(cwd, 'web') });
}

// --- Output ---
const context = {
  git: {
    branch: gitBranch.ok ? gitBranch.stdout : 'unknown',
    sha: gitSha.ok ? gitSha.stdout.substring(0, 8) : 'unknown',
  },
  changedFiles,
  project: {
    name: pkg?.name || webPkg?.name || 'unknown',
    nextConfig: hasNextConfig,
    webScripts: webPkg?.scripts ? Object.keys(webPkg.scripts) : [],
  },
  routes: {
    total: routes.length,
    pageRoutes: routes.filter(r => r.type === 'page').length,
    apiRoutes: routes.filter(r => r.type === 'api').length,
    changed: changedRoutes,
  },
  checks: {
    tier,
    typeCheck: typeCheck ? { pass: typeCheck.ok, output: typeCheck.stdout?.slice(-200) } : null,
    lintCheck: lintCheck ? { pass: lintCheck.ok, output: lintCheck.stdout?.slice(-200) } : null,
    secretScan: secretScan ? { pass: secretScan.ok, output: secretScan.stdout?.slice(-500) } : null,
    testResult: testResult ? { pass: testResult.ok, output: testResult.stdout?.slice(-300) } : null,
  },
};

if (jsonOut) {
  console.log(JSON.stringify(context, null, 2));
} else {
  console.log(`## Verifier Context — ${tier.toUpperCase()} tier\n`);

  console.log('### Git');
  console.log(`  Branch: ${context.git.branch}`);
  console.log(`  Commit: ${context.git.sha}`);
  console.log(`  Changed files: ${context.changedFiles.length}`);
  for (const f of context.changedFiles.slice(0, 15)) {
    console.log(`    ${f}`);
  }
  if (context.changedFiles.length > 15) console.log(`    ... and ${context.changedFiles.length - 15} more`);

  console.log('\n### Routes');
  console.log(`  Total: ${context.routes.total} (${context.routes.pageRoutes} pages, ${context.routes.apiRoutes} API)`);
  if (context.routes.changed.length > 0) {
    console.log(`  Changed routes:`);
    for (const r of context.routes.changed) {
      console.log(`    [${r.type.toUpperCase()}] ${r.route} → ${r.file}`);
    }
  }

  if (context.checks.typeCheck) {
    console.log(`\n### TypeScript: ${context.checks.typeCheck.pass ? '✅ PASS' : '❌ FAIL'}`);
    if (!context.checks.typeCheck.pass) console.log(context.checks.typeCheck.output);
  }
  if (context.checks.lintCheck) {
    console.log(`\n### Lint: ${context.checks.lintCheck.pass ? '✅ PASS' : '❌ FAIL'}`);
    if (!context.checks.lintCheck.pass) console.log(context.checks.lintCheck.output);
  }
  if (context.checks.testResult) {
    console.log(`\n### Tests: ${context.checks.testResult.pass ? '✅ PASS' : '❌ FAIL'}`);
    if (!context.checks.testResult.pass) console.log(context.checks.testResult.output);
  }

  console.log(`\n### Ready for: verifier --tier ${tier}`);
}

process.exit(0);
