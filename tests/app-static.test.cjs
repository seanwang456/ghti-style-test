const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");

assert.match(appSource, /data-action="download-result-share"/);
assert.match(appSource, /保存分享卡片/);
assert.match(appSource, /function downloadResultShareCard/);
assert.match(appSource, /class="result-hero"/);
assert.match(appSource, /result\.type\.shareImage/);
assert.match(appSource, /class="result-code-backdrop"/);
assert.match(appSource, /class="result-style-highlights"/);
assert.match(appSource, /SHARE_URL_PILL/);
assert.match(appSource, /function drawCelebrityPill/);
assert.match(appSource, /measureText\(celebrityText\)/);
assert.doesNotMatch(appSource, /<section class="image-card"/);
assert.doesNotMatch(appSource, /drawWrappedText\(ctx,\s*result\.story/);

console.log("app static tests passed");
