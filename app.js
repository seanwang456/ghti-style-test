const { CHAPTERS, QUESTIONS, TYPES, buildShareHighlights, computeResult, getFirstMissingQuestion } = window.GHTI;

const STORAGE_KEY = "ghti-v1-state";
const app = document.querySelector("#app");
const query = new URLSearchParams(window.location.search);
const isSharePreview = query.get("preview") === "share";
const SHARE_CARD_WIDTH = 1080;
const SHARE_CARD_HEIGHT = 1920;
const SHARE_SITE_URL = "https://ghti.com";
const SHARE_DISPLAY_URL = "ghti.com";
const SHARE_QR_IMAGE = "assets/share/qr-ghti-com.png";
const SHARE_URL_PILL = { x: 108, y: 1742, width: 430, height: 52, radius: 26 };
const SHARE_QR_FRAME = { x: 774, y: 1628, size: 166, radius: 9 };
const SHARE_QR_IMAGE_BOX = { x: 790, y: 1644, size: 134 };
const SHARE_SERIF = '"Songti SC", "STSong", "Noto Serif CJK SC", "Times New Roman", serif';
const SHARE_SANS = '"PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif';
const AXIS_HINTS = {
  sf: "结构清晰 还是 流动柔软",
  ar: "主动存在 还是 内敛低调",
  dc: "显性张力 还是 温和克制",
  pi: "流程标准 还是 当下直觉",
};

const state = loadState();

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored && stored.answers) {
      return {
        screen: stored.screen || "start",
        chapter: stored.chapter || 0,
        answers: stored.answers || {},
      };
    }
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
  return { screen: "start", chapter: 0, answers: {} };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function answeredCount(start = 1, end = 60) {
  let count = 0;
  for (let id = start; id <= end; id += 1) {
    if (state.answers[id]) count += 1;
  }
  return count;
}

function chapterQuestions(chapterIndex) {
  const [start, end] = CHAPTERS[chapterIndex].range;
  return QUESTIONS.filter((question) => question.id >= start && question.id <= end);
}

function isChapterComplete(chapterIndex) {
  const [start, end] = CHAPTERS[chapterIndex].range;
  return answeredCount(start, end) === end - start + 1;
}

function render() {
  if (isSharePreview) {
    renderSharePreview();
    return;
  }
  if (state.screen === "quiz") renderQuiz();
  else if (state.screen === "result") renderResult();
  else renderStart();
}

function renderHeader(status = "BEGIN") {
  return `
    <header class="topbar">
      <div class="brand">GHTI · <span>风格原型</span></div>
      <div class="status">${status}</div>
    </header>
  `;
}

function renderOrbit(variant = "") {
  return `
    <div class="orbit-system ${variant}" aria-hidden="true">
      <div class="orbit-ring ring-one"><span></span></div>
      <div class="orbit-ring ring-two"><span></span></div>
      <div class="orbit-core"></div>
      <i class="dust d1"></i>
      <i class="dust d2"></i>
      <i class="dust d3"></i>
    </div>
  `;
}

function renderStart() {
  const hasSaved = answeredCount() > 0;
  app.innerHTML = `
    ${renderHeader("BEGIN")}
    <main class="start-screen page-pad">
      ${renderOrbit("start-orbit")}
      <section class="intro">
        <p class="kicker"><span></span> GAHA HUMAN TYPE INDICATOR</p>
        <h1>找到属于你的<br /><em>穿衣风格</em></h1>
        <p class="lead">
          GHTI 用 60 道结构化问题，把你的穿衣偏好、被看见方式、风格张力与决策习惯，
          翻译成一个独属于你的 4 字母原型，以及对应的衣橱公式。
        </p>
      </section>
      <section class="metrics" aria-label="测试信息">
        <div><strong>60</strong><span>道题</span></div>
        <div><strong>4</strong><span>维度</span></div>
        <div><strong>16</strong><span>原型</span></div>
        <div><strong>~8</strong><span>分钟</span></div>
      </section>
      <button class="primary-btn start-btn" data-action="start">
        ${hasSaved ? "继续测量" : "开始测量"}
        <span class="arrow">→</span>
      </button>
    </main>
  `;
}

function renderQuiz() {
  const chapter = CHAPTERS[state.chapter];
  const questions = chapterQuestions(state.chapter);
  const overallAnswered = answeredCount();
  app.innerHTML = `
    ${renderHeader(`${chapter.index} / 04 · ${overallAnswered}/60`)}
    <main class="quiz-screen">
      <section class="chapter-hero page-pad">
        <p class="kicker line-only">CHAPTER ${chapter.index} · 01 OF 04</p>
        <h1>${chapter.name}<span>。</span></h1>
        <h2>${chapter.roman} · ${chapter.subtitle}</h2>
        <p>${chapter.pos} / ${chapter.neg} · ${AXIS_HINTS[chapter.id]}</p>
        ${renderOrbit()}
      </section>
      <section class="question-list">
        ${questions.map(renderQuestion).join("")}
      </section>
    </main>
    ${renderBottomNav()}
  `;
}

function renderQuestion(question) {
  return `
    <article class="question" data-question="${question.id}">
      <h3><span>${String(question.id).padStart(2, "0")}</span>${question.title}</h3>
      <div class="options">
        ${question.options
          .map((option) => {
            const selected = state.answers[question.id] === option.key;
            return `
              <button class="option ${selected ? "selected" : ""}" data-q="${question.id}" data-key="${option.key}">
                <span>${option.key}</span>
                <b>${option.text}</b>
              </button>
            `;
          })
          .join("")}
      </div>
    </article>
  `;
}

function renderBottomNav() {
  const chapterComplete = isChapterComplete(state.chapter);
  return `
    <footer class="bottom-nav">
      <div class="bottom-meta">
        <span>本章进度</span>
        <b>${answeredCount(CHAPTERS[state.chapter].range[0], CHAPTERS[state.chapter].range[1])} / 15 已作答</b>
      </div>
      <div class="mini-progress">
        ${CHAPTERS.map((chapter, index) => {
          const done = answeredCount(chapter.range[0], chapter.range[1]);
          return `
            <button class="${index === state.chapter ? "active" : ""}" data-action="jump" data-chapter="${index}" aria-label="${chapter.pos}/${chapter.neg} 进度">
              <i><b style="width:${(done / 15) * 100}%"></b></i>
            </button>
          `;
        }).join("")}
      </div>
      <div class="nav-actions">
        <button class="ghost-btn" data-action="prev" ${state.chapter === 0 ? "disabled" : ""}>上一章</button>
        <button class="primary-btn ${chapterComplete ? "" : "needs-completion"}" data-action="next">
          ${state.chapter === 3 ? "查看结果" : "下一章"}
          <span class="arrow">→</span>
        </button>
      </div>
    </footer>
  `;
}

function updateQuestionSelection(questionId) {
  const group = app.querySelector(`[data-question="${questionId}"]`);
  if (!group) return;
  group.querySelectorAll(".option").forEach((option) => {
    option.classList.toggle("selected", option.dataset.key === state.answers[questionId]);
  });
}

function updateProgressOnly() {
  const oldFooter = document.querySelector(".bottom-nav");
  if (oldFooter) oldFooter.outerHTML = renderBottomNav();
  const chapter = CHAPTERS[state.chapter];
  const status = app.querySelector(".status");
  if (status) status.textContent = `${chapter.index} / 04 · ${answeredCount()}/60`;
}

function remindFirstMissingQuestion() {
  const [start, end] = CHAPTERS[state.chapter].range;
  const missingId = getFirstMissingQuestion(state.answers, start, end);
  if (!missingId) return false;

  const question = document.querySelector(`[data-question="${missingId}"]`);
  if (question) {
    question.scrollIntoView({ behavior: "smooth", block: "center" });
    question.classList.remove("needs-answer");
    window.setTimeout(() => question.classList.add("needs-answer"), 80);
    window.setTimeout(() => question.classList.remove("needs-answer"), 1800);
  }
  showToast(`第 ${String(missingId).padStart(2, "0")} 题还没有选择`);
  return true;
}

function renderResult() {
  const result = computeResult(state.answers);
  const axisRows = result.axis.map(renderAxisRow).join("");
  const imageUrl = encodeURI(result.type.shareImage);
  const resultHighlights = buildShareHighlights(result.typeCode);
  app.innerHTML = `
    ${renderHeader("COMPLETE")}
    <main class="result-screen page-pad">
      <section class="result-hero" aria-label="你的 GHTI 风格原型">
        <p class="result-hero-kicker"><span></span> YOUR GHTI ARCHETYPE</p>
        <div class="result-code-backdrop" aria-hidden="true">${result.typeCode}</div>
        <i class="result-light-spot spot-one" aria-hidden="true"></i>
        <i class="result-light-spot spot-two" aria-hidden="true"></i>
        <i class="result-light-spot spot-three" aria-hidden="true"></i>
        <i class="result-light-spot spot-four" aria-hidden="true"></i>
        <div class="result-person-stage" aria-hidden="true">
          <img class="result-person" src="${imageUrl}" alt="" width="640" height="1280" loading="eager" decoding="async" fetchpriority="high" />
        </div>
        <div class="result-lower-glow" aria-hidden="true"></div>
        <div class="result-identity-panel">
          <p class="result-code-line">${result.typeCode.split("").join(" · ")}</p>
          <h1>${result.type.name}</h1>
          <h2>${result.type.english}</h2>
          <h3>${result.type.tagline}</h3>
          <div class="celebrity-reference">
            <span>参考明星</span>
            <b>${result.type.refs}</b>
          </div>
          <div class="result-style-highlights" aria-label="风格维度摘要">
            ${resultHighlights
              .map(
                (item) => `
                  <div>
                    <b>${item.zh}</b>
                    <span>${item.en}</span>
                  </div>
                `
              )
              .join("")}
          </div>
          <p class="result-copy">${result.story}</p>
        </div>
      </section>
      <section class="chips">
        ${result.chips.map((chip) => `<span>${chip}</span>`).join("")}
      </section>
      <section class="tag-grid">
        <div><span>核心需求</span><b>${result.needTag}</b></div>
        <div><span>决策风格</span><b>${result.decisionTag}</b></div>
      </section>
      <section class="axis-report">
        ${axisRows}
      </section>
      <section class="report-block">
        <h4>穿搭策略 · STRATEGY</h4>
        <ol>
          ${result.strategies.map((item) => `<li>${item}</li>`).join("")}
        </ol>
      </section>
      <section class="report-block">
        <h4>常见踩雷 · PITFALLS</h4>
        <ul>
          ${result.pitfalls.map((item) => `<li>${item}</li>`).join("")}
          ${result.qualityPassed ? "" : "<li>注意力检查题未按要求选择，建议重新测量以获得更稳定结果。</li>"}
        </ul>
      </section>
      <section class="report-block next-block">
        <h4>下一步 · NEXT</h4>
        <p>你可以把这个结果当作穿搭方向参考：先抓住最适合你的轮廓、氛围和决策方式，再根据当天场合与心情微调。</p>
      </section>
      <button class="primary-btn" data-action="download-result-share">保存分享卡片 <span class="arrow">↓</span></button>
      <button class="ghost-wide" data-action="reset">重新测量</button>
      <button class="ghost-wide" data-action="copy">复制原型代码</button>
    </main>
  `;
}

function renderAxisRow(axis) {
  return `
    <div class="axis-row">
      <div class="axis-labels">
        <span>${axis.posName} <em>${axis.positivePercent}%</em></span>
        <span><em>${axis.negativePercent}%</em> ${axis.negName}</span>
      </div>
      <div class="axis-bar"><b style="width:${axis.positivePercent}%"></b><i style="left:${axis.positivePercent}%"></i></div>
    </div>
  `;
}

function safeTypeCode(value) {
  const code = String(value || "SRCP").trim().toUpperCase();
  return TYPES[code] ? code : "SRCP";
}

function answersForTypeCode(typeCode) {
  const letterToAnswer = { S: "A", F: "D", A: "A", R: "D", D: "A", C: "D", P: "A", I: "D" };
  const answers = {};
  typeCode.split("").forEach((letter, index) => {
    const start = index * 15 + 1;
    const end = start + 14;
    for (let id = start; id <= end; id += 1) answers[id] = letterToAnswer[letter];
  });
  answers[30] = "B";
  return answers;
}

function renderSharePreview() {
  const typeCode = safeTypeCode(query.get("code"));
  const result = computeResult(answersForTypeCode(typeCode));
  app.innerHTML = `
    <main class="share-preview-screen">
      <div class="share-preview-toolbar">
        <a href="./index.html">返回测试</a>
        <span>${result.typeCode} · 1080 × 1920</span>
        <button data-action="download-share">保存预览图</button>
      </div>
      <canvas id="share-card-canvas" class="share-card-canvas" width="${SHARE_CARD_WIDTH}" height="${SHARE_CARD_HEIGHT}" aria-label="${result.typeCode} ${result.type.name} 分享卡预览"></canvas>
    </main>
  `;
  drawShareCard(app.querySelector("#share-card-canvas"), result).catch(() => {
    showToast("分享卡预览生成失败");
  });
}

function loadCanvasImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawTrackedText(ctx, text, y, fontSize, tracking, fillStyle) {
  ctx.font = `${fontSize}px ${SHARE_SERIF}`;
  ctx.fillStyle = fillStyle;
  ctx.textBaseline = "alphabetic";
  const chars = Array.from(text);
  const width = chars.reduce((sum, char) => sum + ctx.measureText(char).width, 0) + tracking * (chars.length - 1);
  let x = (SHARE_CARD_WIDTH - width) / 2;
  chars.forEach((char) => {
    ctx.fillText(char, x, y);
    x += ctx.measureText(char).width + tracking;
  });
}

function fitText(ctx, text, maxSize, minSize, maxWidth, family = SHARE_SERIF, style = "") {
  let size = maxSize;
  do {
    ctx.font = `${style}${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 2;
  } while (size >= minSize);
  return minSize;
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const chars = Array.from(text);
  const lines = [];
  let line = "";
  chars.forEach((char) => {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = char;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((item, index) => {
    let output = item;
    if (index === maxLines - 1 && lines.length > maxLines) output = `${item.replace(/[，。；、]$/, "")}…`;
    ctx.fillText(output, x, y + index * lineHeight);
  });
}

function drawShareBackground(ctx) {
  ctx.fillStyle = "#08070c";
  ctx.fillRect(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);

  const topGlow = ctx.createRadialGradient(540, 320, 80, 540, 320, 760);
  topGlow.addColorStop(0, "rgba(39, 45, 70, 0.52)");
  topGlow.addColorStop(0.46, "rgba(14, 17, 28, 0.54)");
  topGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);

  const lowerPink = ctx.createRadialGradient(535, 1370, 80, 535, 1370, 640);
  lowerPink.addColorStop(0, "rgba(255, 111, 175, 0.18)");
  lowerPink.addColorStop(0.34, "rgba(214, 112, 146, 0.11)");
  lowerPink.addColorStop(1, "rgba(255, 111, 175, 0)");
  ctx.fillStyle = lowerPink;
  ctx.fillRect(0, 980, SHARE_CARD_WIDTH, 610);

  const grain = ctx.createLinearGradient(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);
  grain.addColorStop(0, "rgba(255, 244, 248, 0.025)");
  grain.addColorStop(0.5, "rgba(255, 244, 248, 0)");
  grain.addColorStop(1, "rgba(255, 111, 175, 0.035)");
  ctx.fillStyle = grain;
  ctx.fillRect(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT);

  ctx.strokeStyle = "rgba(246, 134, 161, 0.92)";
  ctx.lineWidth = 2;
  roundedRect(ctx, 32, 32, SHARE_CARD_WIDTH - 64, SHARE_CARD_HEIGHT - 64, 44);
  ctx.stroke();
}

function drawStars(ctx) {
  const spots = [
    [184, 588, 10, 0.18],
    [246, 692, 22, 0.34],
    [154, 812, 13, 0.2],
    [319, 780, 8, 0.14],
    [205, 1004, 18, 0.24],
    [812, 632, 15, 0.28],
    [928, 774, 9, 0.16],
    [777, 922, 7, 0.12],
    [860, 1048, 12, 0.18],
  ];
  spots.forEach(([x, y, radius, opacity]) => {
    const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
    glow.addColorStop(0, `rgba(255, 190, 212, ${opacity})`);
    glow.addColorStop(0.32, `rgba(255, 120, 174, ${opacity * 0.52})`);
    glow.addColorStop(1, "rgba(255, 120, 174, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(255, 216, 229, ${Math.min(opacity + 0.24, 0.58)})`;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1.6, radius * 0.12), 0, Math.PI * 2);
    ctx.fill();
  });
}

async function drawShareCard(canvas, result) {
  const ctx = canvas.getContext("2d");
  const [person, qr] = await Promise.all([
    loadCanvasImage(encodeURI(result.type.shareImage)),
    loadCanvasImage(SHARE_QR_IMAGE),
  ]);

  drawShareBackground(ctx);
  ctx.fillStyle = "#fff6f8";
  ctx.font = `39px ${SHARE_SANS}`;
  ctx.fillText("GHTI · 风格原型", 78, 116);

  drawTrackedText(ctx, result.typeCode, 456, 360, 46, "rgba(214, 127, 151, 0.82)");
  drawStars(ctx);

  const personHeight = 1320;
  const personWidth = (person.width / person.height) * personHeight;
  ctx.drawImage(person, (SHARE_CARD_WIDTH - personWidth) / 2 + 12, 290, personWidth, personHeight);

  const lowerFade = ctx.createLinearGradient(0, 930, 0, 1550);
  lowerFade.addColorStop(0, "rgba(8, 7, 12, 0)");
  lowerFade.addColorStop(0.58, "rgba(8, 7, 12, 0.18)");
  lowerFade.addColorStop(1, "rgba(8, 7, 12, 0.82)");
  ctx.fillStyle = lowerFade;
  ctx.fillRect(0, 930, SHARE_CARD_WIDTH, 640);

  const titleSize = fitText(ctx, result.type.name, 96, 70, 690);
  ctx.fillStyle = "#fff6f4";
  ctx.font = `${titleSize}px ${SHARE_SERIF}`;
  ctx.fillText(result.type.name, 92, 1230);

  ctx.fillStyle = "#ee95b0";
  ctx.font = `italic 58px ${SHARE_SERIF}`;
  ctx.fillText(result.type.english, 98, 1297);

  roundedRect(ctx, 92, 1345, 414, 68, 34);
  ctx.strokeStyle = "rgba(246, 134, 161, 0.78)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "rgba(236, 143, 167, 0.86)";
  ctx.font = `29px ${SHARE_SERIF}`;
  ctx.fillText("参考明星", 124, 1389);
  ctx.fillStyle = "#fff6f4";
  ctx.font = `36px ${SHARE_SERIF}`;
  ctx.fillText(result.type.refs.replace("、", " · "), 277, 1389);

  const highlights = buildShareHighlights(result.typeCode);
  ctx.strokeStyle = "rgba(246, 134, 161, 0.32)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(742, 1200);
  ctx.lineTo(742, 1415);
  ctx.stroke();
  [1204, 1284, 1364].forEach((y) => {
    ctx.fillStyle = "#f2a2b7";
    ctx.beginPath();
    ctx.arc(742, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  highlights.forEach((item, index) => {
    const y = 1213 + index * 82;
    ctx.fillStyle = "#fff6f4";
    ctx.font = `30px ${SHARE_SERIF}`;
    ctx.fillText(item.zh, 782, y);
    ctx.fillStyle = "rgba(255, 244, 248, 0.68)";
    ctx.font = `23px ${SHARE_SERIF}`;
    ctx.fillText(item.en, 782, y + 33);
  });

  ctx.fillStyle = "#fff6f4";
  ctx.font = `34px ${SHARE_SERIF}`;
  drawWrappedText(ctx, result.story, 92, 1508, 900, 48, 2);

  roundedRect(ctx, 66, 1604, 948, 210, 30);
  const panelGradient = ctx.createLinearGradient(66, 1604, 1014, 1814);
  panelGradient.addColorStop(0, "#fff9f5");
  panelGradient.addColorStop(1, "#f4e6df");
  ctx.fillStyle = panelGradient;
  ctx.fill();

  ctx.fillStyle = "#5a1b27";
  ctx.font = `38px ${SHARE_SERIF}`;
  ctx.fillText("扫码测试你的 GHTI 风格原型", 105, 1673);
  ctx.font = `27px ${SHARE_SERIF}`;
  ctx.fillText("60 道题 · 4 维度 · 16 种穿衣人格", 105, 1722);

  roundedRect(ctx, SHARE_URL_PILL.x, SHARE_URL_PILL.y, SHARE_URL_PILL.width, SHARE_URL_PILL.height, SHARE_URL_PILL.radius);
  ctx.fillStyle = "#eda0b9";
  ctx.fill();
  ctx.fillStyle = "#5a1b27";
  ctx.font = `30px ${SHARE_SERIF}`;
  ctx.textAlign = "center";
  ctx.fillText(SHARE_DISPLAY_URL, SHARE_URL_PILL.x + SHARE_URL_PILL.width / 2, SHARE_URL_PILL.y + 36);
  ctx.textAlign = "start";

  roundedRect(ctx, SHARE_QR_FRAME.x, SHARE_QR_FRAME.y, SHARE_QR_FRAME.size, SHARE_QR_FRAME.size, SHARE_QR_FRAME.radius);
  ctx.strokeStyle = "rgba(90, 27, 39, 0.62)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.drawImage(qr, SHARE_QR_IMAGE_BOX.x, SHARE_QR_IMAGE_BOX.y, SHARE_QR_IMAGE_BOX.size, SHARE_QR_IMAGE_BOX.size);

  ctx.strokeStyle = "rgba(246, 134, 161, 0.72)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(92, 1870);
  ctx.lineTo(418, 1870);
  ctx.moveTo(662, 1870);
  ctx.lineTo(988, 1870);
  ctx.stroke();
  ctx.fillStyle = "#e898ad";
  ctx.font = `31px ${SHARE_SERIF}`;
  ctx.fillText("·  SCAN ME  ·", 442, 1880);
}

function downloadShareCard() {
  const canvas = document.querySelector("#share-card-canvas");
  if (!canvas) return;
  const typeCode = safeTypeCode(query.get("code"));
  downloadCanvas(canvas, typeCode);
}

function downloadCanvas(canvas, typeCode) {
  canvas.toBlob((blob) => {
    if (!blob) {
      showToast("导出失败");
      return;
    }
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.download = `GHTI-${typeCode}-share-card.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
}

async function downloadResultShareCard(action) {
  if (action) action.disabled = true;
  showToast("正在生成分享卡片");
  try {
    const result = computeResult(state.answers);
    const canvas = document.createElement("canvas");
    canvas.width = SHARE_CARD_WIDTH;
    canvas.height = SHARE_CARD_HEIGHT;
    await drawShareCard(canvas, result);
    downloadCanvas(canvas, result.typeCode);
    showToast("分享卡片已生成");
  } catch (error) {
    showToast("分享卡片生成失败");
  } finally {
    if (action) action.disabled = false;
  }
}

function copyResult() {
  const result = computeResult(state.answers);
  const text = `GHTI ${result.typeCode} · ${result.type.name}\n${result.type.english}\n${result.type.tagline}\n核心需求：${result.needTag}\n决策风格：${result.decisionTag}`;
  navigator.clipboard?.writeText(text);
  showToast("已复制");
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 2600);
}

document.addEventListener("click", (event) => {
  const option = event.target.closest(".option");
  const action = event.target.closest("[data-action]");

  if (option) {
    state.answers[option.dataset.q] = option.dataset.key;
    saveState();
    updateQuestionSelection(option.dataset.q);
    updateProgressOnly();
    return;
  }

  if (!action) return;
  const name = action.dataset.action;

  if (name === "start") {
    state.screen = "quiz";
    state.chapter = Math.min(state.chapter, 3);
    saveState();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (name === "next") {
    if (remindFirstMissingQuestion()) return;

    if (state.chapter === 3) {
      state.screen = "result";
    } else {
      state.chapter += 1;
    }
    saveState();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (name === "prev" && !action.disabled) {
    state.chapter = Math.max(0, state.chapter - 1);
    saveState();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (name === "jump") {
    state.chapter = Number(action.dataset.chapter);
    state.screen = "quiz";
    saveState();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (name === "reset") {
    localStorage.removeItem(STORAGE_KEY);
    state.screen = "start";
    state.chapter = 0;
    state.answers = {};
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (name === "copy") copyResult();
  if (name === "download-share") downloadShareCard();
  if (name === "download-result-share") downloadResultShareCard(action);
});

render();
