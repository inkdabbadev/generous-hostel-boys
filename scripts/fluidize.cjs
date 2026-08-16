const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const IGNORE = new Set(['node_modules', '_fluidize_tooling', 'scripts', '.next', '.git', 'public']);

function walk(dir, acc) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(css|tsx|ts)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

// Placeholder marker: NUL char (never present in source). Built at runtime so this
// script file stays pure ASCII and is safe to copy/paste.
const PH = String.fromCharCode(0);
function mask(text, regexes) {
  const store = [];
  let s = text;
  for (const re of regexes) {
    s = s.replace(re, (m) => { store.push(m); return PH + (store.length - 1) + PH; });
  }
  return { s, store };
}
function unmask(s, store) {
  return s.replace(new RegExp(PH + '(\\d+)' + PH, 'g'), (_, i) => store[+i]);
}

// Contexts whose px must NOT be rewritten.
const PROTECT = [
  /@media[^{]*\{/g,                              // media-query preludes
  /@supports[^{]*\{/g,
  /@container[^{]*\{/g,
  /\((?:max|min)-(?:width|height)\s*:[^)]*\)/g,   // media conditions: <img sizes>, matchMedia, etc.
  /url\([^)]*\)/g,                                // url(...)
  /\[[^\]]*\]:/g,                                 // Tailwind arbitrary variants (max-[640px]:) & TS index signatures
];

const PX = /(-?\d*\.?\d+)px\b/g;
function convert(text) {
  const { s, store } = mask(text, PROTECT);
  let count = 0;
  const out = s.replace(PX, (m, num) => {
    if (parseFloat(num) === 0) return m;          // leave 0px untouched
    count++;
    return 'calc(' + num + '*var(--u))';
  });
  return { text: unmask(out, store), count };
}

const HEADER_MARK = '/* fluidize:root */';
function injectRoot(css) {
  if (css.includes(HEADER_MARK)) return css;
  const header = HEADER_MARK + '\n@layer base {\n  :root { --u: calc(100vw / 1920); }\n  html { font-size: calc(100vw / 120); }\n}\n';
  const anchor = '@import "tailwindcss";';
  if (css.includes(anchor)) return css.replace(anchor, anchor + '\n' + header);
  return header + css;
}

const files = walk(ROOT, []);
let total = 0;
const report = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const { text, count } = convert(src);
  let out = text;
  if (f.endsWith('globals.css')) out = injectRoot(out);
  if (out !== src) {
    fs.writeFileSync(f, out);
    total += count;
    report.push(String(count).padStart(5) + '  ' + path.relative(ROOT, f));
  }
}
report.sort((a, b) => parseInt(b) - parseInt(a));
console.log(report.join('\n'));
console.log('\nTOTAL px->calc conversions: ' + total + ' across ' + report.length + ' files');
