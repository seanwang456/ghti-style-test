const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
const stylesSource = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");

assert.match(appSource, /data-action="download-result-share"/);
assert.match(appSource, /保存分享卡片/);
assert.match(appSource, /function downloadResultShareCard/);
assert.match(appSource, /class="result-hero"/);
assert.match(appSource, /result\.type\.portraitImage/);
assert.match(appSource, /class="result-code-backdrop"/);
assert.match(appSource, /class="result-style-highlights"/);
assert.match(appSource, /SHARE_URL_PILL/);
assert.match(appSource, /function drawCelebrityPill/);
assert.match(appSource, /measureText\(celebrityText\)/);
assert.match(appSource, /function isMobileSaveContext/);
assert.match(appSource, /function showShareSaveSheet/);
assert.match(appSource, /navigator\.canShare/);
assert.match(appSource, /navigator\.share/);
assert.match(appSource, /share-save-sheet/);
assert.match(appSource, /showShareSaveSheet\(blob, typeCode, file\)/);
assert.match(appSource, /share-native-share/);
assert.doesNotMatch(appSource, /<section class="image-card"/);
assert.doesNotMatch(appSource, /drawWrappedText\(ctx,\s*result\.story/);

const resultPersonBlock = stylesSource.match(/\.result-person\s*\{[\s\S]*?\n\}/)?.[0] || "";
const mobileResultStageBlock = stylesSource.match(/@media \(max-width: 460px\)[\s\S]*?\.result-person-stage\s*\{[\s\S]*?\n  \}/)?.[0] || "";
assert.match(stylesSource, /\.result-person[\s\S]*?max-height:\s*100%/);
assert.doesNotMatch(resultPersonBlock, /\n\s*height:\s*100%;/);
assert.match(mobileResultStageBlock, /top:\s*76px/);
assert.match(stylesSource, /\.share-save-sheet/);
assert.match(stylesSource, /\.share-save-image/);
assert.match(stylesSource, /\.primary-wide/);

console.log("app static tests passed");
