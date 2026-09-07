const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../app/src');

function getAllFiles(dir, extensions = ['.jsx', '.js', '.css', '.html']) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, extensions));
    } else if (extensions.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

const files = getAllFiles(srcDir);
console.log(`Found ${files.length} source files to audit.`);

const findings = {
  hardcodedWidths: [],
  fixedGrids: [],
  overflowRisks: [],
  clippingEllipsis: [],
  badAbsolutePositioning: [],
  inappropriateGapsMargins: [],
  excessiveWrapping: []
};

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const relPath = path.relative(path.resolve(__dirname, '..'), file).replace(/\\/g, '/');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    // Ignore comment-only lines
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;

    // 1. HARDCODED WIDTHS
    // 1a. Arbitrary tailwind width/min-width/max-width px
    const pxWidthMatches = [...trimmed.matchAll(/(?<![\w-])(w|min-w|max-w)-\[(\d+)px\]/g)];
    for (const match of pxWidthMatches) {
      const prop = match[1];
      const px = parseInt(match[2], 10);
      if ((prop === 'w' || prop === 'min-w') && px >= 240) {
        findings.hardcodedWidths.push({
          file: relPath,
          line: lineNum,
          type: 'tailwind-arbitrary-px',
          value: match[0],
          px,
          snippet: trimmed,
          recommendation: prop === 'w' ? `w-full max-w-[${px}px] or clamp()` : `min-w-0 or w-full with sm:${match[0]}`
        });
      }
    }

    // 1b. Inline style widths e.g. width: '320px', style={{ width: 400 }}
    const inlineWidthMatch = trimmed.match(/style=\{.*width:\s*['"]?(\d+)px?['"]?.*\}/);
    if (inlineWidthMatch) {
      const px = parseInt(inlineWidthMatch[1], 10);
      if (px >= 240) {
        findings.hardcodedWidths.push({
          file: relPath,
          line: lineNum,
          type: 'inline-style-width',
          value: `width: ${px}px`,
          px,
          snippet: trimmed,
          recommendation: `Use responsive className (w-full max-w-... or minmax)`
        });
      }
    }

    // 1c. Fixed tailwind widths (w-64, w-72, w-80, w-96) on containers without mobile responsiveness
    const fixedTailwindWidths = trimmed.match(/(?<![:\w-])(w-(?:64|72|80|96))\b/);
    if (fixedTailwindWidths && !trimmed.includes('w-full') && !trimmed.includes('max-w-')) {
      findings.hardcodedWidths.push({
        file: relPath,
        line: lineNum,
        type: 'fixed-tailwind-width',
        value: fixedTailwindWidths[1],
        snippet: trimmed,
        recommendation: `Use 'w-full sm:${fixedTailwindWidths[1]}' or flex-1 min-w-0`
      });
    }

    // 2. FIXED COLUMN GRIDS
    if (trimmed.includes('grid') && trimmed.includes('grid-cols-')) {
      const clsMatch = trimmed.match(/className=[\"'\`]{1}([^\"'\`]+)[\"'\`]{1}/);
      if (clsMatch) {
        const classNames = clsMatch[1].split(/\s+/);
        const baseGridCols = classNames.find(c => /^grid-cols-([2-9]|1[0-2])$/.test(c));
        const hasMobileCol1 = classNames.includes('grid-cols-1');
        if (baseGridCols && !hasMobileCol1) {
          findings.fixedGrids.push({
            file: relPath,
            line: lineNum,
            value: baseGridCols,
            allClasses: clsMatch[1],
            snippet: trimmed,
            recommendation: `Change '${baseGridCols}' to 'grid-cols-1 sm:${baseGridCols}' (or md:${baseGridCols})`
          });
        }
      }
    }

    // 3. HORIZONTAL OVERFLOW RISKS
    if (trimmed.includes('<table') && !trimmed.includes('overflow-x-auto')) {
      findings.overflowRisks.push({
        file: relPath,
        line: lineNum,
        type: 'table-overflow',
        snippet: trimmed,
        recommendation: `Wrap table in <div className="overflow-x-auto"> or provide mobile card view (hidden md:table / md:hidden)`
      });
    }

    const minWLarge = trimmed.match(/(?<![:\w-])min-w-\[(\d+)px\]/);
    if (minWLarge) {
      const px = parseInt(minWLarge[1], 10);
      if (px > 320) {
        findings.overflowRisks.push({
          file: relPath,
          line: lineNum,
          type: 'large-min-width',
          value: minWLarge[0],
          px,
          snippet: trimmed,
          recommendation: `Replace ${minWLarge[0]} with responsive min-w-0 sm:${minWLarge[0]} or minmax()`
        });
      }
    }

    if ((trimmed.includes('<pre') || trimmed.includes('<code')) && !trimmed.includes('overflow') && !trimmed.includes('break-')) {
      findings.overflowRisks.push({
        file: relPath,
        line: lineNum,
        type: 'code-pre-overflow',
        snippet: trimmed,
        recommendation: `Add 'overflow-x-auto break-all' or 'whitespace-pre-wrap'`
      });
    }

    const negativeMx = trimmed.match(/(?<![:\w-])-mx-([4-9]|1[0-6])\b/);
    if (negativeMx) {
      findings.overflowRisks.push({
        file: relPath,
        line: lineNum,
        type: 'negative-horizontal-margin',
        value: negativeMx[0],
        snippet: trimmed,
        recommendation: `Ensure parent has overflow-hidden or remove negative margin on mobile (mx-0 sm:${negativeMx[0]})`
      });
    }

    // 4. CLIPPING & ELLIPSIS ISSUES
    if (trimmed.includes('truncate') && trimmed.includes('flex-1') && !trimmed.includes('min-w-0')) {
      findings.clippingEllipsis.push({
        file: relPath,
        line: lineNum,
        type: 'truncate-missing-min-w-0',
        snippet: trimmed,
        recommendation: `Add 'min-w-0' to flex child with 'truncate' so text truncates cleanly without expanding parent`
      });
    }

    if (trimmed.includes('truncate') && (trimmed.includes('hash') || trimmed.includes('ticket') || trimmed.includes('code') || trimmed.includes('address') || trimmed.includes('sha256'))) {
      findings.clippingEllipsis.push({
        file: relPath,
        line: lineNum,
        type: 'truncate-on-vital-data',
        snippet: trimmed,
        recommendation: `Use 'break-all' or 'break-words' or tooltip/copy button instead of silent truncation`
      });
    }

    const fixedHeightOverflow = trimmed.match(/(?<![:\w-])h-\[(\d+)px\]\s+overflow-hidden/);
    if (fixedHeightOverflow) {
      findings.clippingEllipsis.push({
        file: relPath,
        line: lineNum,
        type: 'fixed-height-overflow-hidden',
        value: fixedHeightOverflow[0],
        snippet: trimmed,
        recommendation: `Use 'line-clamp-N' or 'min-h-[${fixedHeightOverflow[1]}px]' instead of hard-clipping text`
      });
    }

    // 5. BAD ABSOLUTE POSITIONING
    if (trimmed.includes('absolute') && (trimmed.includes('right-') || trimmed.includes('left-') || trimmed.includes('top-'))) {
      const fixedAbs = trimmed.match(/absolute.*(right-\[\d+px\]|left-\[\d+px\]|w-\[\d+px\])/);
      if (fixedAbs) {
        findings.badAbsolutePositioning.push({
          file: relPath,
          line: lineNum,
          value: fixedAbs[1],
          snippet: trimmed,
          recommendation: `Use relative flex alignment or responsive inset classes (e.g. sm:${fixedAbs[1]})`
        });
      }
    }

    // 6. INAPPROPRIATE GAPS AND MARGINS
    const largeGapMatch = trimmed.match(/(?<![:\w-])gap-(8|10|12|16)\b/);
    if (largeGapMatch && !trimmed.includes('sm:gap-') && !trimmed.includes('md:gap-') && !trimmed.includes('lg:gap-')) {
      findings.inappropriateGapsMargins.push({
        file: relPath,
        line: lineNum,
        type: 'large-unresponsive-gap',
        value: largeGapMatch[0],
        snippet: trimmed,
        recommendation: `Replace ${largeGapMatch[0]} with responsive gap, e.g. 'gap-3 sm:gap-4 md:${largeGapMatch[0]}'`
      });
    }

    const largePaddingMatch = trimmed.match(/(?<![:\w-])(p-(?:8|10|12)|px-(?:8|10|12))\b/);
    if (largePaddingMatch && !trimmed.includes('sm:p-') && !trimmed.includes('sm:px-') && !trimmed.includes('md:p-') && !trimmed.includes('md:px-')) {
      findings.inappropriateGapsMargins.push({
        file: relPath,
        line: lineNum,
        type: 'excessive-mobile-padding',
        value: largePaddingMatch[0],
        snippet: trimmed,
        recommendation: `Replace ${largePaddingMatch[0]} with 'p-4 sm:${largePaddingMatch[0]}' to preserve mobile canvas width`
      });
    }

    // 7. EXCESSIVE TEXT WRAPPING & UNWRAPPED BADGES / BUTTONS
    if ((trimmed.includes('<button') || trimmed.includes('<Button') || trimmed.includes('rounded-full px-') || trimmed.includes('inline-flex items-center')) &&
        !trimmed.includes('whitespace-nowrap') && !trimmed.includes('shrink-0') &&
        (trimmed.includes('px-2.5') || trimmed.includes('px-3') || trimmed.includes('text-xs') || trimmed.includes('text-sm'))) {
      if (trimmed.includes('bg-') && (trimmed.includes('rounded-full') || trimmed.includes('rounded-md') || trimmed.includes('rounded '))) {
        findings.excessiveWrapping.push({
          file: relPath,
          line: lineNum,
          type: 'badge-chip-missing-nowrap',
          snippet: trimmed,
          recommendation: `Add 'whitespace-nowrap shrink-0' to prevent multi-line badge breakage on 320px`
        });
      }
    }
  });
}

console.log('=== AUDIT SUMMARY ===');
console.log('Hardcoded Widths (>=240px):', findings.hardcodedWidths.length);
console.log('Fixed Grids (no mobile responsiveness):', findings.fixedGrids.length);
console.log('Horizontal Overflow Risks:', findings.overflowRisks.length);
console.log('Clipping & Ellipsis Issues:', findings.clippingEllipsis.length);
console.log('Bad Absolute Positioning:', findings.badAbsolutePositioning.length);
console.log('Inappropriate Gaps & Margins:', findings.inappropriateGapsMargins.length);
console.log('Excessive Wrapping (Badges/Chips):', findings.excessiveWrapping.length);

fs.writeFileSync(
  path.resolve(__dirname, 'responsive-audit-results.json'),
  JSON.stringify(findings, null, 2)
);
console.log('Results written to scripts/responsive-audit-results.json');
