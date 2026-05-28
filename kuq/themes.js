// ============================================================
// Kuq — Theme Manager
// ============================================================

const THEMES = {
  original: { name: "Original", icon: "○", dot: "#999" },
  invincible: { name: "Invincible", icon: "💥", dot: "#ff2222" },
  aespa: { name: "Aespa", icon: "✦", dot: "#ff6ec7" },
  chill: { name: "Chill", icon: "☁", dot: "#5b7a6b" }
};

const AUDIO_URLS = {
  invincible: "invincible-music.mp3",
  aespa: "https://assets.mixkit.co/music/140/140.mp3",
  chill: "https://assets.mixkit.co/music/443/443.mp3"
};

let currentTheme = "original";
let audioElement = null;
let audioPlaying = false;

// ----------------------------
// THEME SWITCHING
// ----------------------------
function setTheme(theme) {
  document.body.classList.remove("theme-invincible", "theme-aespa", "theme-chill");
  document.querySelectorAll(".glow-line, .flash-overlay, .float-element").forEach(el => el.remove());

  if (theme !== "original") {
    document.body.classList.add(`theme-${theme}`);
  }

  if (theme === "aespa") {
    const glowLine = document.createElement("div");
    glowLine.className = "glow-line";
    document.body.appendChild(glowLine);
  }

  if (theme === "chill") {
    ["☁", "♪", "✿", "☀"].forEach(sym => {
      const el = document.createElement("div");
      el.className = "float-element";
      el.textContent = sym;
      document.body.appendChild(el);
    });
  }

  document.querySelectorAll(".theme-option").forEach(opt => {
    opt.classList.toggle("active", opt.dataset.theme === theme);
  });

  // Audio
  const player = document.getElementById("audio-player");
  if (theme === "original") {
    if (player) player.classList.remove("visible");
    stopAudio();
  } else {
    if (player) player.classList.add("visible");
    if (audioPlaying) {
      playAudio(theme);
    }
  }

  currentTheme = theme;
  localStorage.setItem("kuq_theme", theme);
}

// ----------------------------
// AUDIO PLAYER (Mixkit free music)
// ----------------------------
function playAudio(theme) {
  const url = AUDIO_URLS[theme];
  if (!url) return;

  if (!audioElement) {
    audioElement = new Audio();
    audioElement.loop = true;
    audioElement.volume = 0.25;
  }

  // Only change source if theme changed
  if (audioElement.src !== url) {
    audioElement.src = url;
  }

  audioElement.play().catch(err => {
    console.warn("Audio play failed:", err);
    audioPlaying = false;
    updateAudioButton();
  });
}

function stopAudio() {
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  audioPlaying = false;
  updateAudioButton();
}

function toggleAudio() {
  if (audioPlaying) {
    stopAudio();
  } else {
    audioPlaying = true;
    playAudio(currentTheme);
  }
  updateAudioButton();
}

function updateAudioButton() {
  const btn = document.getElementById("audio-toggle-btn");
  const label = document.getElementById("audio-label");
  if (btn) btn.textContent = audioPlaying ? "⏸" : "▶";
  if (label) label.textContent = audioPlaying ? "Music on" : "Music off";
}

// ----------------------------
// THEME SELECTOR UI
// ----------------------------
function toggleThemeMenu() {
  document.getElementById("theme-options").classList.toggle("open");
}

function initThemeSelector() {
  const selector = document.createElement("div");
  selector.className = "theme-selector";
  selector.innerHTML = `
    <div id="theme-options" class="theme-options">
      ${Object.entries(THEMES).map(([key, t]) => `
        <button class="theme-option ${key === currentTheme ? 'active' : ''}" data-theme="${key}" onclick="setTheme('${key}')">
          <span class="theme-dot" style="background: ${t.dot}"></span>
          ${t.icon} ${t.name}
        </button>
      `).join("")}
    </div>
    <button class="theme-toggle" onclick="toggleThemeMenu()" title="Choose your vibe">🎨</button>
  `;
  document.body.appendChild(selector);

  document.addEventListener("click", (e) => {
    if (!selector.contains(e.target)) {
      document.getElementById("theme-options").classList.remove("open");
    }
  });
}

// ----------------------------
// INVINCIBLE FLASH EFFECT
// ----------------------------
function triggerInvincibleFlash() {
  if (currentTheme !== "invincible") return;
  const flash = document.createElement("div");
  flash.className = "flash-overlay";
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 700);
}

// ----------------------------
// AESPA GLITCH EFFECT
// ----------------------------
function triggerAespaGlitch() {
  if (currentTheme !== "aespa") return;
  document.querySelectorAll(".results-tab-panel h3, .results-overall h2").forEach(el => {
    el.classList.add("glitch");
    setTimeout(() => el.classList.remove("glitch"), 400);
  });
}

// ----------------------------
// INIT
// ----------------------------
function initTheme() {
  const saved = localStorage.getItem("kuq_theme");
  if (saved && THEMES[saved]) currentTheme = saved;

  initThemeSelector();

  const player = document.createElement("div");
  player.id = "audio-player";
  player.className = "audio-player";
  player.innerHTML = `
    <button id="audio-toggle-btn" class="audio-toggle" onclick="toggleAudio()">▶</button>
    <span id="audio-label">Music off</span>
  `;
  document.body.appendChild(player);

  setTheme(currentTheme);
}

document.addEventListener("DOMContentLoaded", initTheme);
