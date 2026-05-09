const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");

assert.match(appSource, /data-action="download-result-share"/);
assert.match(appSource, /保存分享卡片/);
assert.match(appSource, /function downloadResultShareCard/);

console.log("app static tests passed");
