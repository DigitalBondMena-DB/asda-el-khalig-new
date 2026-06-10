#!/usr/bin/env bash
# scripts/perf-audit.sh
# تشغيل: chmod +x scripts/perf-audit.sh && ./scripts/perf-audit.sh

set -e
PROJECT_ROOT=$(pwd)
BROWSER_DIST="$PROJECT_ROOT/dist/asda-alkhaleej/browser"
REPORT_DIR="$PROJECT_ROOT/.perf-reports"
mkdir -p "$REPORT_DIR"

echo "🔍 Angular Performance Audit — asda-alkhaleej"
echo "============================================="

# ── 1. Bundle Analysis ──────────────────────────────────────────
echo ""
echo "📦 [1/5] Bundle Size Analysis..."
if ! command -v npx &>/dev/null; then
  echo "  ✗ npx غير موجود"
else
  # Build مع stats
  npx ng build --stats-json --output-path dist/asda-alkhaleej 2>/dev/null || true

  if [ -f "dist/asda-alkhaleej/browser/stats.json" ]; then
    npx webpack-bundle-analyzer dist/asda-alkhaleej/browser/stats.json \
      --mode static \
      --report "$REPORT_DIR/bundle-report.html" \
      --no-open 2>/dev/null && \
    echo "  ✓ Bundle report: $REPORT_DIR/bundle-report.html"
  else
    echo "  ⚠ stats.json مش موجود — تأكد إن angular.json فيه statsJson: true"
  fi
fi

# ── 2. Image Optimization ───────────────────────────────────────
echo ""
echo "🖼  [2/5] Image Optimization (PNG/JPEG → WebP)..."
if ! command -v sharp &>/dev/null && ! node -e "require('sharp')" 2>/dev/null; then
  echo "  ⏳ تثبيت sharp..."
  npm install sharp --save-dev --silent --legacy-peer-deps
fi

node - << 'SHARP_SCRIPT'
const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const ASSETS = path.join(process.cwd(), 'src/assets');
const EXTS   = ['.jpg', '.jpeg', '.png'];
let converted = 0, saved = 0;

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) { walk(full); return; }
    const ext = path.extname(f).toLowerCase();
    if (!EXTS.includes(ext)) return;

    const out   = full.replace(ext, '.webp');
    const orig  = fs.statSync(full).size;
    sharp(full)
      .webp({ quality: 82 })
      .toFile(out)
      .then(info => {
        converted++;
        saved += orig - info.size;
        console.log(`  ✓ ${path.relative(process.cwd(), out)} — saved ${((orig - info.size)/1024).toFixed(1)} KB`);
      })
      .catch(e => console.error(`  ✗ ${f}: ${e.message}`));
  });
}

walk(ASSETS);
setTimeout(() => {
  console.log(`\n  ✅ ${converted} images converted — ~${(saved/1024).toFixed(0)} KB saved`);
}, 3000);
SHARP_SCRIPT

# ── 3. Lighthouse CI ────────────────────────────────────────────
echo ""
echo "🏠 [3/5] Lighthouse Audit (محتاج server شغال)..."
if ! command -v lhci &>/dev/null; then
  echo "  ⏳ تثبيت @lhci/cli..."
  npm install -g @lhci/cli --silent 2>/dev/null || \
  npx @lhci/cli --version &>/dev/null || true
fi

if command -v lhci &>/dev/null; then
  lhci collect \
    --url=http://localhost:4000 \
    --numberOfRuns=1 \
    --settings.output=html \
    --settings.outputPath="$REPORT_DIR/lighthouse.html" \
    2>/dev/null && \
  echo "  ✓ Lighthouse report: $REPORT_DIR/lighthouse.html" || \
  echo "  ⚠ شغّل الـ SSR server الأول: npm run serve:ssr"
else
  npx lighthouse http://localhost:4000 \
    --output=html \
    --output-path="$REPORT_DIR/lighthouse.html" \
    --chrome-flags="--headless --no-sandbox" \
    --only-categories=performance 2>/dev/null && \
  echo "  ✓ Lighthouse: $REPORT_DIR/lighthouse.html" || \
  echo "  ⚠ شغّل الـ server الأول"
fi

# ── 4. Source Map Explorer ──────────────────────────────────────
echo ""
echo "🗺  [4/5] Source Map Explorer..."
if [ -d "$BROWSER_DIST" ]; then
  JS_FILES=$(find "$BROWSER_DIST" -name "*.js" ! -name "*.map" | head -5 | tr '\n' ' ')
  if [ -n "$JS_FILES" ]; then
    npx source-map-explorer $JS_FILES \
      --html "$REPORT_DIR/sourcemap.html" 2>/dev/null && \
    echo "  ✓ Sourcemap: $REPORT_DIR/sourcemap.html" || \
    echo "  ⚠ Build the project first: ng build"
  else
    echo "  ⚠ No JS files found in dist. Run ng build first."
  fi
else
  echo "  ⚠ dist/ مش موجود — شغّل ng build الأول"
fi

# ── 5. Unused CSS ───────────────────────────────────────────────
echo ""
echo "🧹 [5/5] Unused CSS Check..."
npx purgecss \
  --css "src/**/*.css" "src/**/*.scss" \
  --content "src/**/*.html" "src/**/*.ts" \
  --output "$REPORT_DIR/purged-css/" 2>/dev/null && \
echo "  ✓ Purged CSS: $REPORT_DIR/purged-css/" || \
echo "  ⚠ PurgeCSS check skipped"

# ── Summary ─────────────────────────────────────────────────────
echo ""
echo "============================================="
echo "✅ Audit complete! Reports في: $REPORT_DIR/"
echo ""
echo "الخطوات الجاية:"
echo "  1. افتح $REPORT_DIR/bundle-report.html تشوف أكبر dependency"
echo "  2. افتح $REPORT_DIR/lighthouse.html تشوف الـ Core Web Vitals"
echo "  3. الصور الـ .webp الجديدة في src/assets/ — استخدمهم في الـ templates"
echo ""