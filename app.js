const { CHAPTERS, QUESTIONS, computeResult, getFirstMissingQuestion } = window.GHTI;

const STORAGE_KEY = "ghti-v1-state";
const app = document.querySelector("#app");
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
  const imageUrl = encodeURI(result.type.image);
  app.innerHTML = `
    ${renderHeader("COMPLETE")}
    <main class="result-screen page-pad">
      <p class="kicker"><span></span> YOUR GHTI ARCHETYPE</p>
      <section class="image-card" aria-label="原型视觉卡">
        <div class="image-chip">⊙ ${result.typeCode} · IMAGE</div>
        <img class="type-portrait" src="${imageUrl}" alt="${result.typeCode} ${result.type.name} 风格图" loading="lazy" decoding="async" />
      </section>
      <section class="result-title">
        <p>${result.typeCode.split("").join(" · ")}</p>
        <h1>${result.type.name}</h1>
        <h2>${result.type.english}</h2>
        <h3>${result.type.tagline}</h3>
        <div class="celebrity-reference">
          <span>参考明星</span>
          <b>${result.type.refs}</b>
        </div>
        <p class="result-copy">${result.story}</p>
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
      <button class="primary-btn" data-action="reset">重新测量 <span class="arrow">→</span></button>
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
});

render();
