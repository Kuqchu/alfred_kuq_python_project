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
    // Duplicate check — keep most recent
    if (seen.has(ans.question_id)) {
      const idx = cleaned.findIndex(a => a.question_id === ans.question_id);
      if (idx !== -1) cleaned.splice(idx, 1);
      errors.push(`Q${ans.question_id}: duplicate — kept most recent answer.`);
    }
    seen.add(ans.question_id);

    // Type check
    let position = ans.position;
    if (typeof position !== "number" || isNaN(position)) {
      errors.push(`Q${ans.question_id}: non-numeric position converted to 0.5.`);
      position = 0.5;
    }

    // Range clamp
    if (position < 0) {
      errors.push(`Q${ans.question_id}: position clamped to 0.`);
      position = 0;
    }
    if (position > 1) {
      errors.push(`Q${ans.question_id}: position clamped to 1.`);
      position = 1;
    }

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
  for (const q of questions) {
    questionMap[q.question_id] = q;
  }

  // Accumulate raw scores and counts
  const rawScores = {};
  const counts = {};

  for (const ans of answers) {
    const q = questionMap[ans.question_id];
    if (!q) {
      console.warn(`Question ${ans.question_id} not found — skipped.`);
      continue;
    }

    const position = ans.position !== undefined ? ans.position : 0.5;

    for (const [value, weight] of Object.entries(q.value_weights)) {
      const contribution = position * weight;
      rawScores[value] = (rawScores[value] || 0) + contribution;
      counts[value] = (counts[value] || 0) + 1;
    }
  }

  // Normalize to 0-100
  const normalized = {};
  for (const value of Object.keys(VALUE_LAYERS)) {
    if (!counts[value] || counts[value] === 0) {
      normalized[value] = null;
      continue;
    }

    // Find max possible score for this value (sum of max weights across contributing questions)
    let maxPossible = 0;
    for (const ans of answers) {
      const q = questionMap[ans.question_id];
      if (q && q.value_weights[value] !== undefined) {
        maxPossible += Math.max(0, q.value_weights[value]); // only positive weights count toward max
      }
    }

    if (maxPossible === 0) {
      normalized[value] = null;
      continue;
    }

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

    const severity = highestScore === -1 ? "N/A" :
                     highestScore <= 33 ? "Low" :
                     highestScore <= 66 ? "Moderate" : "High";

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

  if (score === null || score === undefined) {
    return { label, description: "Insufficient data to assess this value.", severity: "N/A" };
  }

  const descriptions = RESULT_DESCRIPTIONS[valueName];
  if (!descriptions) {
    return { label, description: "Unable to determine.", severity: "N/A" };
  }

  const severity = score <= 33 ? "Low" : score <= 66 ? "Moderate" : "High";
  const description = descriptions[severity] || descriptions["Moderate"];

  return { label, description, severity };
}

// ----------------------------
// FUNCTION 6: generateOverall
// ----------------------------
function generateOverall(layerScores) {
  // Check for insufficient data
  const validLayers = Object.values(layerScores).filter(l => l.highest !== null);
  if (validLayers.length < 2) {
    return {
      profile_name: "Partial Profile",
      conclusion: "We didn't get enough data to give you a complete picture. Consider retaking the test and answering all questions.",
      feedback: "Understanding your conflict patterns requires enough data across all four dimensions. Try again when you're ready."
    };
  }

  // Get high-scoring values per layer
  const highValues = {};
  for (const [key, layer] of Object.entries(layerScores)) {
    if (layer.highest_score !== null && layer.highest_score > 50) {
      highValues[layer.highest] = true;
    }
  }

  // Check for contradiction: both anxiety and avoidance high
  if (highValues["attachment_anxiety"] && highValues["attachment_avoidance"]) {
    return CONTRADICTION_PROFILE;
  }

  // Try to match a named profile
  for (const profile of NAMED_PROFILES) {
    const required = profile.trigger.required_high;
    const allHigh = required.every(v => highValues[v]);
    if (allHigh) {
      return {
        profile_name: profile.name,
        conclusion: profile.conclusion,
        feedback: profile.feedback
      };
    }
  }

  // Fallback: balanced
  return BALANCED_PROFILE;
}

// ----------------------------
// FUNCTION 7: renderResults
// ----------------------------
function renderResults(results) {
  const container = document.getElementById("results-content");
  container.innerHTML = "";

  // Intro
  const intro = document.createElement("div");
  intro.className = "results-intro";
  intro.innerHTML = `
    <h1>Your Relationship Insights</h1>
    <p>Thank you for your honesty. Relationships are complicated, and conflicts rarely happen for the reasons we think they do. Based on your answers, here is a breakdown of the invisible patterns driving your arguments, and a clear path forward.</p>
  `;
  container.appendChild(intro);

  // Layer results
  for (let i = 1; i <= 4; i++) {
    const layer = results.layerScores[`layer_${i}`];
    const desc = getResultDescription(layer.highest, layer.highest_score);

    const section = document.createElement("div");
    section.className = "results-layer";

    if (layer.highest === null) {
      section.innerHTML = `
        <h2>${layer.heading}</h2>
        <p class="insufficient-data">Insufficient data for this section.</p>
      `;
    } else {
      section.innerHTML = `
        <h2>${layer.heading}</h2>
        <h3>Your Core Pattern: ${desc.label} (${desc.severity})</h3>
        <p>${desc.description}</p>
      `;
    }
    container.appendChild(section);
  }

  // Overall profile
  const overall = results.overall;
  const overallSection = document.createElement("div");
  overallSection.className = "results-overall";
  overallSection.innerHTML = `
    <h2>Bringing It All Together: ${overall.profile_name}</h2>
    <h3>The Big Picture</h3>
    <p>${overall.conclusion}</p>
    <h3>Your Next Step</h3>
    <p>${overall.feedback}</p>
  `;
  container.appendChild(overallSection);

  // Safety disclaimer
  const disclaimer = document.createElement("div");
  disclaimer.className = "results-disclaimer";
  disclaimer.innerHTML = `
    <p><strong>A quick note on safety:</strong> Kuq is a tool for understanding, not a substitute for professional help. If you ever feel physically or emotionally unsafe in your relationship, please reach out to the <a href="https://www.thehotline.org/" target="_blank">National Domestic Violence Hotline (1-800-799-7233)</a> or <a href="https://www.crisistextline.org/" target="_blank">Crisis Text Line (text HOME to 741741)</a>. You deserve to be safe.</p>
  `;
  container.appendChild(disclaimer);
}

// ============================================================
// UI CONTROLLER
// ============================================================

let userAnswers = {};
let totalQuestions = 0;

// ----------------------------
// PAGE NAVIGATION
// ----------------------------
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  window.scrollTo(0, 0);
}

// ----------------------------
// BUILD QUESTION PAGE
// ----------------------------
function buildQuestionPage() {
  const questions = loadQuestions();
  totalQuestions = questions.length;
  const container = document.getElementById("questions-container");
  container.innerHTML = "";

  let currentLayer = 0;

  for (const q of questions) {
    // Layer header
    if (q.layer !== currentLayer) {
      currentLayer = q.layer;
      const layerInfo = LAYERS[q.layer];

      const header = document.createElement("div");
      header.className = "layer-header";
      header.innerHTML = `
        <h2>${layerInfo.heading}</h2>
        <p>${layerInfo.subtext}</p>
      `;
      container.appendChild(header);
    }

    // Question
    const qDiv = document.createElement("div");
    qDiv.className = "question";
    qDiv.id = `question-${q.question_id}`;
    qDiv.dataset.questionId = q.question_id;

    const label = document.createElement("p");
    label.className = "question-text";
    label.textContent = q.text;
    qDiv.appendChild(label);

    // 5-point scale
    const scale = document.createElement("div");
    scale.className = "scale";

    const leftLabel = document.createElement("span");
    leftLabel.className = "scale-label";
    leftLabel.textContent = q.spectrum.left;
    scale.appendChild(leftLabel);

    const positions = [0, 0.25, 0.5, 0.75, 1.0];
    for (const pos of positions) {
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

  // Closing text + submit
  const closing = document.createElement("div");
  closing.className = "closing";
  closing.innerHTML = `
    <p>You're all done. Thanks for being honest — that isn't always easy to do.</p>
    <button id="submit-btn" class="btn-primary" onclick="handleSubmit()">View My Insights</button>
    <p id="submit-error" class="error-text" style="display:none;"></p>
  `;
  container.appendChild(closing);

  // Restore from localStorage
  restoreProgress();
}

// ----------------------------
// BUBBLE CLICK HANDLER
// ----------------------------
function handleBubbleClick(e) {
  const questionId = parseInt(e.target.dataset.questionId);
  const position = parseFloat(e.target.dataset.position);

  // Update state
  userAnswers[questionId] = position;

  // Update UI — mark selected
  const questionDiv = document.getElementById(`question-${questionId}`);
  questionDiv.querySelectorAll(".bubble").forEach(b => b.classList.remove("selected"));
  e.target.classList.add("selected");

  // Remove unanswered highlight
  questionDiv.classList.remove("unanswered");

  // Save to localStorage
  localStorage.setItem("kuq_answers", JSON.stringify(userAnswers));

  // Update progress bar
  updateProgress();
}

// ----------------------------
// PROGRESS BAR
// ----------------------------
function updateProgress() {
  const answered = Object.keys(userAnswers).length;
  const percent = (answered / totalQuestions) * 100;
  document.getElementById("progress-fill").style.width = `${percent}%`;
  document.getElementById("question-counter").textContent = `Question ${answered} of ${totalQuestions}`;
}

// ----------------------------
// RESTORE FROM LOCALSTORAGE
// ----------------------------
function restoreProgress() {
  const saved = localStorage.getItem("kuq_answers");
  if (saved) {
    try {
      userAnswers = JSON.parse(saved);
      // Restore bubble selections
      for (const [qId, pos] of Object.entries(userAnswers)) {
        const questionDiv = document.getElementById(`question-${qId}`);
        if (questionDiv) {
          const bubbles = questionDiv.querySelectorAll(".bubble");
          bubbles.forEach(b => {
            if (parseFloat(b.dataset.position) === pos) {
              b.classList.add("selected");
            }
          });
        }
      }
      updateProgress();
      // Show welcome back message
      const msg = document.getElementById("restore-message");
      if (msg) msg.style.display = "block";
    } catch (e) {
      console.warn("Failed to restore progress:", e);
      userAnswers = {};
    }
  }
}

// ----------------------------
// SUBMIT HANDLER
// ----------------------------
function handleSubmit() {
  const questions = loadQuestions();
  const unanswered = [];

  // Check all questions answered
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
    // Scroll to first unanswered
    const first = document.getElementById(`question-${unanswered[0]}`);
    if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Build answers array
  const answersArray = Object.entries(userAnswers).map(([qId, pos]) => ({
    question_id: parseInt(qId),
    position: pos
  }));

  // Validate
  const validation = validateAnswers(answersArray);
  if (!validation.valid) {
    alert("Something went wrong with your answers. Please try again.");
    return;
  }

  // Score
  const scores = calculateScores(validation.cleaned_answers);
  const layerScores = getLayerScores(scores);
  const overall = generateOverall(layerScores);

  // Render
  renderResults({ layerScores, overall });

  // Clear localStorage
  localStorage.removeItem("kuq_answers");

  // Show results page
  showPage("results");
}

// ----------------------------
// START OVER
// ----------------------------
function startOver() {
  userAnswers = {};
  localStorage.removeItem("kuq_answers");
  showPage("landing");
}

// ----------------------------
// INIT
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  buildQuestionPage();
});
