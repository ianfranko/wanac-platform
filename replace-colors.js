// replace-colors.js

const fs = require("fs");
const path = require("path");

const targetExtensions = [".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".html"];
const colorMap = {
  "#ffffff": "light",      // white
  "#dad9d9": "grayish",    // light gray
  "#ff5e1a": "accent",     // orange
  "#002147": "primary",    // navy
};

function replaceColorsInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let replaced = false;

  for (const [hex, name] of Object.entries(colorMap)) {
    const regex = new RegExp(hex, "gi");
    if (regex.test(content)) {
      content = content.replace(regex, `theme('${name}')`);
      replaced = true;
    }
  }

  if (replaced) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Updated colors in: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (targetExtensions.includes(path.extname(fullPath))) {
      replaceColorsInFile(fullPath);
    }
  }
}

// Start from the "src" and "components" folders
walkDir(path.join(__dirname, "src"));
walkDir(path.join(__dirname, "components"));
