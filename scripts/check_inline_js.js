#!/usr/bin/env node

// Usage: node scripts/check_inline_js.js [repository_directory]
// Self-test: node scripts/check_inline_js.js --self-test

"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

function inlineScripts(html) {
  const scripts = [];
  const pattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(pattern)) {
    const attributes = match[1];
    if (/\bsrc\s*=/i.test(attributes)) continue;
    const type = attributes.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1] || "";
    if (type && !/^(?:text\/javascript|application\/javascript)$/i.test(type)) continue;
    scripts.push(match[2]);
  }
  return scripts;
}

function checkDirectory(repoDir) {
  if (!fs.existsSync(repoDir) || !fs.statSync(repoDir).isDirectory()) {
    throw new Error(`repository directory not found: ${repoDir}`);
  }
  const files = fs.readdirSync(repoDir).filter(name => name.endsWith(".html")).sort();
  const failures = [];
  let checked = 0;
  for (const file of files) {
    const html = fs.readFileSync(path.join(repoDir, file), "utf8");
    inlineScripts(html).forEach((source, index) => {
      try {
        Function(source);
        checked += 1;
      } catch (error) {
        failures.push(`${file}: inline script ${index + 1}: ${error.message}`);
      }
    });
  }
  return { checked, fileCount: files.length, failures };
}

function selfTest() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "inline-js-check-"));
  try {
    fs.writeFileSync(path.join(tempDir, "valid.html"), "<script>const value = 1;</script>");
    const valid = checkDirectory(tempDir);
    fs.writeFileSync(path.join(tempDir, "invalid.html"), "<script>const = ;</script>");
    const invalid = checkDirectory(tempDir);
    if (valid.failures.length || invalid.failures.length !== 1) {
      throw new Error("self-test assertions failed");
    }
    process.stdout.write("ok: self-test passed\n");
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function main() {
  if (process.argv[2] === "--self-test") {
    selfTest();
    return;
  }
  const repoDir = path.resolve(process.argv[2] || path.join(__dirname, ".."));
  const result = checkDirectory(repoDir);
  if (result.failures.length) {
    process.stderr.write(`${result.failures.join("\n")}\n`);
    process.exitCode = 1;
    return;
  }
  process.stdout.write(`ok: ${result.checked} inline scripts across ${result.fileCount} HTML files\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`error: ${error.message}\n`);
  process.exitCode = 2;
}
