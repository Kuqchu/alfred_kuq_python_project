// ============================================================
// Kuq — PPRA Test Scoring Engine + UI Controller
// ============================================================

// ----------------------------
// FUNCTION 1: loadQuestions
// ----------------------------
function loadQuestions() {
  try {
    return QUESTIONS.filter(q => {
      if (!q.value_weights || Object.keys(q.value_weights).length === 0) {
        console.warn(`Question ${q.question_id} missing weights — skipped.`);
        return false;
      }
      return true;
    });
  } catch (e) {
    console.error("Failed to load questions:", e);
    return [];
  }
}

// ----------------------------
// FUNCTION 2: validateAnswers
// ----------------------------
function validateAnswers(answers) {
  const errors = [];
  const cleaned = [];
  const seen = new Set();

  if (!answers || answers.length === 0) {
    return { valid: false, cleaned_answers: [], errors: ["No answers provided."] };
  }

  for (const ans of answers) {
    if (seen.has(ans.question_id)) {
      const idx = cleaned.findIndex(a => a.question_id === ans.question_id);
      if (idx !== -1) cleaned.splice(idx, 1);
      errors.push(`Q${ans.question_id}: duplicate — kept most recent answer.`);
    }
    seen.add(ans.question_id);

    let position = ans.position;
    if (typeof position !== "number" || isNaN(position)) {
      errors.push(`Q${ans.question_id}: non-numeric position converted to 0.5.`);
      position = 0.5;
    }
    if (position < 0) { errors.push(`Q${ans.question_id}: position clamped to 0.`); position = 0; }
    if (position > 1) { errors.push(`Q${ans.question_id}: position clamped to 1.`); position = 1; }

    cleaned.push({ question_id: ans.question_id, position });
  }

  return { valid: true, cleaned_answers: cleaned, errors };
}

// ----------------------------
// FUNCTION 3: calculateScores
// ----------------------------
function calculateScores(answers) {
  const questions = loadQuestions();
  const questionMap = {};
  for (const q of questions) { questionMap[q.question_id] = q; }

  const rawScores = {};
  const counts = {};

  for (const ans of answers) {
    const q = questionMap[ans.question_id];
    if (!q) { console.warn(`Question ${ans.question_id} not found — skipped.`); continue; }
    const position = ans.position !== undefined ? ans.position : 0.5;
    for (const [value, weight] of Object.entries(q.value_weights)) {
      rawScores[value] = (rawScores[value] || 0) + (position * weight);
      counts[value] = (counts[value] || 0) + 1;
    }
  }

  const normalized = {};
  for (const value of Object.keys(VALUE_LAYERS)) {
    if (!counts[value] || counts[value] === 0) { normalized[value] = null; continue; }
    let maxPossible = 0;
    for (const ans of answers) {
      const q = questionMap[ans.question_id];
      if (q && q.value_weights[value] !== undefined) maxPossible += Math.max(0, q.value_weights[value]);
    }
    if (maxPossible === 0) { normalized[value] = null; continue; }
    const score = (rawScores[value] / maxPossible) * 100;
    normalized[value] = Math.max(0, Math.min(100, Math.round(score)));
  }
  return normalized;
}

// ----------------------------
// FUNCTION 4: getLayerScores
// ----------------------------
function getLayerScores(scores) {
  const result = {};
  for (let layer = 1; layer <= 4; layer++) {
    const layerValues = {};
    let highest = null;
    let highestScore = -1;
    for (const [value, layerNum] of Object.entries(VALUE_LAYERS)) {
      if (layerNum === layer) {
        layerValues[value] = scores[value];
        if (scores[value] !== null && scores[value] > highestScore) {
          highestScore = scores[value];
          highest = value;
        }
      }
    }
    const severity = highestScore === -1 ? "N/A" : highestScore <= 33 ? "Low" : highestScore <= 66 ? "Moderate" : "High";
    result[`layer_${layer}`] = {
      name: LAYERS[layer].name,
      heading: LAYERS[layer].heading,
      subtext: LAYERS[layer].subtext,
      values: layerValues,
      highest: highest,
      highest_score: highestScore === -1 ? null : highestScore,
      severity: severity
    };
  }
  return result;
}

// ----------------------------
// FUNCTION 5: getResultDescription
// ----------------------------
function getResultDescription(valueName, score) {
  const label = VALUE_LABELS[valueName] || valueName;
  if (score === null || score === undefined) return { label, description: "Insufficient data to assess this value.", severity: "N/A" };
  const descriptions = RESULT_DESCRIPTIONS[valueName];
  if (!descriptions) return { label, description: "Unable to determine.", severity: "N/A" };
  const severity = score <= 33 ? "Low" : score <= 66 ? "Moderate" : "High";
  return { label, description: descriptions[severity] || descriptions["Moderate"], severity };
}

// ----------------------------
// FUNCTION 6: generateOverall
// ----------------------------
function generateOverall(layerScores) {
  const validLayers = Object.values(layerScores).filter(l => l.highest !== null);
  if (validLayers.length < 2) {
    return { profile_name: "Partial Profile", conclusion: "We didn't get enough data to give you a complete picture. Consider retaking the test and answering all questions.", feedback: "Understanding your conflict patterns requires enough data across all four dimensions. Try again when you're ready." };
  }

  const highValues = {};
  for (const [key, layer] of Object.entries(layerScores)) {
    for (const [value, score] of Object.entries(layer.values)) {
      if (score !== null && score > 50) highValues[value] = true;
    }
  }

  if (highValues["attachment_anxiety"] && highValues["attachment_avoidance"]) return CONTRADICTION_PROFILE;

  for (const profile of NAMED_PROFILES) {
    if (profile.trigger.required_high.every(v => highValues[v])) {
      return { profile_name: profile.name, conclusion: profile.conclusion, feedback: profile.feedback };
    }
  }
  return BALANCED_PROFILE;
}

// ============================================================
// RENDER HELPERS — build layer content HTML
// ============================================================

function buildLayerContentHTML(layer, desc, index) {
  if (layer.highest === null) {
    return `<h2>${layer.heading}</h2><p class="insufficient-data">Insufficient data for this section.</p>`;
  }
  return `
    <h2>${layer.heading}</h2>
    <h3>Your Core Pattern: ${desc.label} (${desc.severity})</h3>
    <p>${desc.description}</p>
  `;
}

function buildOverallHTML(overall) {
  return `
    <h2>Bringing It All Together: ${overall.profile_name}</h2>
    <h3>The Big Picture</h3>
    <p>${overall.conclusion}</p>
    <h3>Your Next Step</h3>
    <p>${overall.feedback}</p>
  `;
}

function buildDisclaimerHTML() {
  return `<p><strong>A quick note on safety:</strong> Kuq is a tool for understanding, not a substitute for professional help. If you ever feel physically or emotionally unsafe in your relationship, please reach out to the <a href="https://www.thehotline.org/" target="_blank">National Domestic Violence Hotline (1-800-799-7233)</a> or <a href="https://www.crisistextline.org/" target="_blank">Crisis Text Line (text HOME to 741741)</a>. You deserve to be safe.</p>`;
}

function buildConsentHTML() {
  return `
    <p><strong>Help us improve Kuq</strong></p>
    <p>Can we use your anonymous answers to help make this tool better? No personal information is stored — just your responses and results. You can decline and still see your insights.</p>
    <div class="consent-buttons">
      <button class="btn-primary btn-small" onclick="submitResponse('yes')">Yes, use my data</button>
      <button class="btn-secondary btn-small" onclick="submitResponse('no')">No thanks</button>
    </div>
    <p id="consent-message" class="consent-message" style="display:none;"></p>
  `;
}

// ============================================================
// FUNCTION 7: renderResults — dispatches to layout per theme
// ============================================================

function renderResults(results) {
  const container = document.getElementById("results-content");
  container.innerHTML = "";

  const theme = (typeof currentTheme !== "undefined") ? currentTheme : "original";

  // Common intro
  const intro = document.createElement("div");
  intro.className = "results-intro";
  intro.innerHTML = `
    <h1>Your Relationship Insights</h1>
    <p>Thank you for your honesty. Relationships are complicated, and conflicts rarely happen for the reasons we think they do. Based on your answers, here is a breakdown of the invisible patterns driving your arguments, and a clear path forward.</p>
  `;
  container.appendChild(intro);

  // All themes use dashboard layout
  renderDashboardLayout(container, results);

  // Overall profile (shared by all layouts)
  const overall = results.overall;
  const overallSection = document.createElement("div");
  overallSection.className = "results-overall anim-overall";
  overallSection.innerHTML = buildOverallHTML(overall);
  container.appendChild(overallSection);

  // Disclaimer
  const disclaimer = document.createElement("div");
  disclaimer.className = "results-disclaimer";
  disclaimer.innerHTML = buildDisclaimerHTML();
  container.appendChild(disclaimer);

  // Consent
  const consent = document.createElement("div");
  consent.className = "consent-prompt";
  consent.id = "consent-prompt";
  consent.innerHTML = buildConsentHTML();
  container.appendChild(consent);
}

// ============================================================
// LAYOUT 1: DASHBOARD (Original)
// ============================================================

function renderDashboardLayout(container, results) {
  // Summary strip
  const strip = document.createElement("div");
  strip.className = "results-summary-strip";
  for (let i = 1; i <= 4; i++) {
    const layer = results.layerScores[`layer_${i}`];
    const desc = getResultDescription(layer.highest, layer.highest_score);
    const severityClass = desc.severity.toLowerCase();
    const block = document.createElement("div");
    block.className = "summary-stat";
    block.innerHTML = `
      <span class="summary-label">${layer.heading.replace(/^Part \d+: /, '')}</span>
      <span class="severity-badge severity-${severityClass}">${desc.severity}</span>
      <span class="summary-pattern">${desc.label}</span>
    `;
    strip.appendChild(block);
  }
  container.appendChild(strip);

  // Detail cards
  for (let i = 1; i <= 4; i++) {
    const layer = results.layerScores[`layer_${i}`];
    const desc = getResultDescription(layer.highest, layer.highest_score);
    const section = document.createElement("div");
    section.className = "results-layer anim-card";
    section.innerHTML = buildLayerContentHTML(layer, desc, i);
    container.appendChild(section);
  }
}

// ============================================================
// LAYOUT 2: TIMELINE (Chill)
// ============================================================

function renderTimelineLayout(container, results) {
  const timeline = document.createElement("div");
  timeline.className = "results-timeline";

  for (let i = 1; i <= 4; i++) {
    const layer = results.layerScores[`layer_${i}`];
    const desc = getResultDescription(layer.highest, layer.highest_score);
    const node = document.createElement("div");
    node.className = "timeline-node-wrapper anim-card";
    node.innerHTML = `
      <div class="timeline-node">${i}</div>
      <div class="timeline-card">
        ${buildLayerContentHTML(layer, desc, i)}
      </div>
    `;
    timeline.appendChild(node);
  }

  container.appendChild(timeline);
}

// ============================================================
// LAYOUT 4: TABS (Aespa)
// ============================================================

function renderTabsLayout(container, results) {
  // Tab bar
  const tabBar = document.createElement("div");
  tabBar.className = "results-tabs";

  const shortNames = ["Connection", "Tension", "Heat", "Aftermath"];
  for (let i = 0; i < 4; i++) {
    const layer = results.layerScores[`layer_${i + 1}`];
    const desc = getResultDescription(layer.highest, layer.highest_score);
    const tab = document.createElement("button");
    tab.className = `results-tab ${i === 0 ? 'active' : ''}`;
    tab.dataset.tab = i;
    tab.innerHTML = `
      <span class="tab-name">${shortNames[i]}</span>
      <span class="severity-dot severity-${desc.severity.toLowerCase()}"></span>
    `;
    tab.addEventListener("click", () => switchTab(i));
    tabBar.appendChild(tab);
  }
  container.appendChild(tabBar);

  // Tab panels
  const panelsContainer = document.createElement("div");
  panelsContainer.className = "results-tab-panels";
  for (let i = 0; i < 4; i++) {
    const layer = results.layerScores[`layer_${i + 1}`];
    const desc = getResultDescription(layer.highest, layer.highest_score);
    const panel = document.createElement("div");
    panel.className = `results-tab-panel ${i === 0 ? 'active' : ''}`;
    panel.id = `tab-panel-${i}`;
    panel.innerHTML = buildLayerContentHTML(layer, desc, i);
    panelsContainer.appendChild(panel);
  }
  container.appendChild(panelsContainer);
}

function switchTab(index) {
  document.querySelectorAll(".results-tab").forEach((t, i) => t.classList.toggle("active", i === index));
  document.querySelectorAll(".results-tab-panel").forEach((p, i) => p.classList.toggle("active", i === index));
}

// ============================================================
// LAYOUT 5: MAGAZINE (Invincible)
// ============================================================

function renderMagazineLayout(container, results) {
  for (let i = 1; i <= 4; i++) {
    const layer = results.layerScores[`layer_${i}`];
    const desc = getResultDescription(layer.highest, layer.highest_score);
    const section = document.createElement("div");
    section.className = `results-layer magazine-layer magazine-layer-${i} anim-card`;
    section.innerHTML = `
      <div class="magazine-number">${String(i).padStart(2, '0')}</div>
      <div class="magazine-content">
        ${buildLayerContentHTML(layer, desc, i)}
      </div>
    `;
    container.appendChild(section);
  }
}

// ============================================================
// UI CONTROLLER
// ============================================================

let userAnswers = {};
let totalQuestions = 0;
let latestResults = null;

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  window.scrollTo(0, 0);
}

function buildQuestionPage() {
  const questions = loadQuestions();
  totalQuestions = questions.length;
  const container = document.getElementById("questions-container");
  container.innerHTML = "";

  let currentLayer = 0;
  for (const q of questions) {
    if (q.layer !== currentLayer) {
      currentLayer = q.layer;
      const layerInfo = LAYERS[q.layer];
      const header = document.createElement("div");
      header.className = "layer-header";
      header.innerHTML = `<h2>${layerInfo.heading}</h2><p>${layerInfo.subtext}</p>`;
      container.appendChild(header);
    }

    const qDiv = document.createElement("div");
    qDiv.className = "question";
    qDiv.id = `question-${q.question_id}`;

    const label = document.createElement("p");
    label.className = "question-text";
    label.textContent = q.text;
    qDiv.appendChild(label);

    const scale = document.createElement("div");
    scale.className = "scale";
    const leftLabel = document.createElement("span");
    leftLabel.className = "scale-label";
    leftLabel.textContent = q.spectrum.left;
    scale.appendChild(leftLabel);

    for (const pos of [0, 0.25, 0.5, 0.75, 1.0]) {
      const bubble = document.createElement("button");
      bubble.type = "button";
      bubble.className = "bubble";
      bubble.dataset.position = pos;
      bubble.dataset.questionId = q.question_id;
      bubble.addEventListener("click", handleBubbleClick);
      scale.appendChild(bubble);
    }

    const rightLabel = document.createElement("span");
    rightLabel.className = "scale-label";
    rightLabel.textContent = q.spectrum.right;
    scale.appendChild(rightLabel);
    qDiv.appendChild(scale);
    container.appendChild(qDiv);
  }

  const closing = document.createElement("div");
  closing.className = "closing";
  closing.innerHTML = `
    <p>You're all done. Thanks for being honest — that isn't always easy to do.</p>
    <button id="submit-btn" class="btn-primary" onclick="handleSubmit()">View My Insights</button>
    <p id="submit-error" class="error-text" style="display:none;"></p>
  `;
  container.appendChild(closing);
  restoreProgress();
}

function handleBubbleClick(e) {
  const questionId = parseInt(e.target.dataset.questionId);
  const position = parseFloat(e.target.dataset.position);
  userAnswers[questionId] = position;
  const questionDiv = document.getElementById(`question-${questionId}`);
  questionDiv.querySelectorAll(".bubble").forEach(b => b.classList.remove("selected"));
  e.target.classList.add("selected");
  questionDiv.classList.remove("unanswered");
  localStorage.setItem("kuq_answers", JSON.stringify(userAnswers));
  updateProgress();
}

function updateProgress() {
  const answered = Object.keys(userAnswers).length;
  document.getElementById("progress-fill").style.width = `${(answered / totalQuestions) * 100}%`;
  document.getElementById("question-counter").textContent = `Question ${answered} of ${totalQuestions}`;
}

function restoreProgress() {
  const saved = localStorage.getItem("kuq_answers");
  if (saved) {
    try {
      userAnswers = JSON.parse(saved);
      for (const [qId, pos] of Object.entries(userAnswers)) {
        const questionDiv = document.getElementById(`question-${qId}`);
        if (questionDiv) {
          questionDiv.querySelectorAll(".bubble").forEach(b => {
            if (parseFloat(b.dataset.position) === pos) b.classList.add("selected");
          });
        }
      }
      updateProgress();
      const msg = document.getElementById("restore-message");
      if (msg) msg.style.display = "block";
    } catch (e) { userAnswers = {}; }
  }
}

function handleSubmit() {
  const questions = loadQuestions();
  const unanswered = [];
  for (const q of questions) {
    if (userAnswers[q.question_id] === undefined) {
      unanswered.push(q.question_id);
      const qDiv = document.getElementById(`question-${q.question_id}`);
      if (qDiv) qDiv.classList.add("unanswered");
    }
  }
  if (unanswered.length > 0) {
    const errorEl = document.getElementById("submit-error");
    errorEl.textContent = `Please answer all questions before continuing. (${unanswered.length} unanswered)`;
    errorEl.style.display = "block";
    const first = document.getElementById(`question-${unanswered[0]}`);
    if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const answersArray = Object.entries(userAnswers).map(([qId, pos]) => ({ question_id: parseInt(qId), position: pos }));
  const validation = validateAnswers(answersArray);
  if (!validation.valid) { alert("Something went wrong. Please try again."); return; }

  const scores = calculateScores(validation.cleaned_answers);
  const layerScores = getLayerScores(scores);
  const overall = generateOverall(layerScores);

  latestResults = { answers: userAnswers, scores, layerScores, overall };
  renderResults({ layerScores, overall });

  if (typeof triggerInvincibleFlash === "function") triggerInvincibleFlash();
  if (typeof triggerAespaGlitch === "function") setTimeout(triggerAespaGlitch, 300);

  localStorage.removeItem("kuq_answers");
  showPage("results");
}

function submitResponse(consent) {
  const msgEl = document.getElementById("consent-message");
  const buttonsEl = document.querySelector(".consent-buttons");
  if (!latestResults) { msgEl.textContent = "No results to submit."; msgEl.style.display = "block"; return; }

  const payload = {
    consent,
    answers: latestResults.answers,
    scores: latestResults.scores,
    profile_name: latestResults.overall.profile_name,
    layer_scores: {}
  };
  for (const [key, layer] of Object.entries(latestResults.layerScores)) {
    payload.layer_scores[key] = { name: layer.name, highest: layer.highest, highest_score: layer.highest_score, severity: layer.severity };
  }

  buttonsEl.style.display = "none";
  msgEl.textContent = "Saving...";
  msgEl.style.display = "block";

  fetch("/api/respond", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(() => {
      msgEl.textContent = consent === "yes" ? "Thank you! Your anonymous data helps us improve Kuq." : "No problem — your data has not been stored.";
    })
    .catch(() => { msgEl.textContent = "Could not save — but your insights are still shown above."; });
}

function startOver() {
  userAnswers = {};
  latestResults = null;
  localStorage.removeItem("kuq_answers");
  document.querySelectorAll(".bubble").forEach(b => b.classList.remove("selected"));
  document.querySelectorAll(".question").forEach(q => q.classList.remove("unanswered"));
  document.getElementById("progress-fill").style.width = "0%";
  document.getElementById("question-counter").textContent = `Question 0 of ${totalQuestions}`;
  const msg = document.getElementById("restore-message");
  if (msg) msg.style.display = "none";
  const err = document.getElementById("submit-error");
  if (err) err.style.display = "none";
  showPage("landing");
}

document.addEventListener("DOMContentLoaded", buildQuestionPage);
