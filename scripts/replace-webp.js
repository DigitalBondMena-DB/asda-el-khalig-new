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

const files = walkSync('./src').filter(f => /\.(html|ts|scss|css)$/.test(f));
let changedFiles = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Replace .png, .jpg, .jpeg with .webp for assets, but ignore favicon_io directory
  let newContent = content.replace(/(assets\/(?!favicon_io\/)[^\s'"\)]+?)\.(png|jpe?g)/gi, '$1.webp');
  
  if (content !== newContent) {
    fs.writeFileSync(f, newContent, 'utf8');
    changedFiles++;
    console.log(`Updated ${f}`);
  }
});

console.log(`\n✅ Updated ${changedFiles} files to use .webp extensions!`);
