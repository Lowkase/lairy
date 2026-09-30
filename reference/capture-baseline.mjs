#!/usr/bin/env node
// Captures a baseline screenshot of every Foundation, Component and Pattern page in
// `archive/v1/Workspace Shell.dc.html`, in both themes, at 1440px width, full page.
//
// Serves the prototype over HTTP (it needs a real origin, not file://, and loads React,
// ReactDOM and Babel from unpkg.com at runtime — see archive/v1/support.js), drives it with
// Playwright by clicking through the real nav exactly as an operator would, and writes
// PNGs to reference/screenshots/<section>/<entry>--<theme>.png.
//
// Needs network access and is run manually — see reference/README.md. Not part of CI.

import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const prototypeDir = path.join(repoRoot, 'archive', 'v1');
const prototypeFile = path.join(prototypeDir, 'Workspace Shell.dc.html');
const screenshotsDir = path.join(__dirname, 'screenshots');

const PORT = 4173;
const VIEWPORT_WIDTH = 1440;
const BASE_VIEWPORT_HEIGHT = 900;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

const SECTIONS = [
  { dockLabel: 'Foundations', folder: 'foundations' },
  { dockLabel: 'Components', folder: 'components' },
  { dockLabel: 'Patterns', folder: 'patterns' },
];

const THEMES = ['dark', 'light'];

function slugify(label) {
  return label
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function startServer() {
  const server = http.createServer((req, res) => {
    const reqPath = req.url === '/' ? null : decodeURIComponent(req.url.split('?')[0]);
    const filePath = reqPath ? path.join(prototypeDir, reqPath) : prototypeFile;
    if (!filePath.startsWith(prototypeDir)) {
      res.writeHead(403);
      res.end();
      return;
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(PORT, () => resolve(server));
  });
}

async function waitForAppReady(page) {
  await page.waitForSelector('.dock-btn', { timeout: 60000 });
}

async function clickDockItem(page, label) {
  await page.locator('.dock-btn', { hasText: label }).click();
}

async function switchTheme(page, theme) {
  await page.locator('.avatar-btn').click();
  await page.locator('.seg-btn', { hasText: theme.toUpperCase() }).click();
  // The menu doesn't auto-close on theme select — close it so it isn't in frame.
  await page.locator('.avatar-btn').click();
}

async function waitForPageTitle(page, label) {
  await page.waitForFunction(
    (expected) => document.querySelector('h3')?.textContent?.trim() === expected,
    label,
    { timeout: 15000 },
  );
  // Entrance animations (fadeIn etc., see archive/v1/NOTES.md) settle within ~600ms.
  await page.waitForTimeout(900);
}

// The app is a fixed-viewport SPA: everything below the header scrolls inside one
// internal container (ref="scrollRef"), not the document. A plain fullPage screenshot
// would only capture the current viewport, so resize the viewport to the content's
// real height first.
async function resizeToContent(page) {
  const contentHeight = await page.evaluate(() => {
    // The "workspace" scroll layer (Foundations/Components/Patterns render here, above
    // the launcher's own scroll container) — matched on the two style fragments the
    // runtime always keeps together, since z-index:20 alone also matches small popovers.
    const el = document.querySelector('div[style*="overflow: auto"][style*="z-index: 20"]');
    return el ? el.scrollHeight : 0;
  });
  const height = Math.max(BASE_VIEWPORT_HEIGHT, contentHeight + 52 /* header */ + 24 /* buffer */);
  await page.setViewportSize({ width: VIEWPORT_WIDTH, height });
  await page.waitForTimeout(150);
}

async function captureSection(page, section, theme) {
  await page.setViewportSize({ width: VIEWPORT_WIDTH, height: BASE_VIEWPORT_HEIGHT });
  await clickDockItem(page, section.dockLabel);
  await page.waitForSelector('.subnav-row[data-on]', { timeout: 15000 });

  const labels = (await page.locator('.subnav-row[data-on]').allTextContents()).map((l) => l.trim());
  const outDir = path.join(screenshotsDir, section.folder);
  fs.mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    await page.locator('.subnav-row[data-on]').nth(i).click();
    await waitForPageTitle(page, label);
    await resizeToContent(page);

    const file = path.join(outDir, `${slugify(label)}--${theme}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`  ${section.folder}/${path.basename(file)}`);

    await page.setViewportSize({ width: VIEWPORT_WIDTH, height: BASE_VIEWPORT_HEIGHT });
  }
}

async function main() {
  console.log(`Serving ${prototypeDir} on http://localhost:${PORT}`);
  const server = await startServer();

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport: { width: VIEWPORT_WIDTH, height: BASE_VIEWPORT_HEIGHT },
    });
    const page = await context.newPage();
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' });
    await waitForAppReady(page);

    for (const theme of THEMES) {
      console.log(`\nTheme: ${theme}`);
      if (theme !== 'dark') await switchTheme(page, theme);
      for (const section of SECTIONS) {
        console.log(` Section: ${section.dockLabel}`);
        await captureSection(page, section, theme);
      }
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  console.log(`\nDone. Screenshots written to ${screenshotsDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
