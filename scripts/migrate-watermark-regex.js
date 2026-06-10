const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      filelist = walkSync(fullPath, filelist);
    } else {
      filelist.push(fullPath);
    }
  });
  return filelist;
}

const files = walkSync('./src').filter(f => f.endsWith('.html'));
let changedFiles = 0;

const watermarkTag = '\n  <img src="/assets/images/logo_light.webp" class="watermark-img" loading="lazy" decoding="async" role="presentation" alt="" />';

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Find opening tags that contain Logo_Water_Mark in their class attribute
  // We use regex to match the opening tag, then append the img right after it.
  // Note: we don't append if the img is already there (idempotency check)
  let newContent = content.replace(/(<[a-zA-Z0-9-]+[^>]*class=(?:'|")[^'"]*Logo_Water_Mark[^'"]*(?:'|")[^>]*>)/gi, (match) => {
    return match + watermarkTag;
  });
  
  if (content !== newContent) {
    // Basic idempotency check just in case we run it twice
    if (!content.includes('class="watermark-img"')) {
      fs.writeFileSync(f, newContent, 'utf8');
      changedFiles++;
      console.log(`Updated ${f}`);
    }
  }
});

console.log(`\n✅ Injected watermark img tag into ${changedFiles} files!`);
