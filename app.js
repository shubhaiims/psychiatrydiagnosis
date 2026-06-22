const STORAGE_PREFIX = "diagnosisdash";
const FALLBACK_APP_NAME = "DIAGNOSIS DASH";

const els = {
  appName: document.getElementById("appName"),
  caseMeta: document.getElementById("caseMeta"),
  questionCounter: document.getElementById("questionCounter"),
  clueCounter: document.getElementById("clueCounter"),
  guessCounter: document.getElementById("guessCounter"),
  resultBadge: document.getElementById("resultBadge"),
  clueStack: document.getElementById("clueStack"),
  guessForm: document.getElementById("guessForm"),
  guessInput: document.getElementById("guessInput"),
  diagnosisOptions: document.getElementById("diagnosisOptions"),
  formMessage: document.getElementById("formMessage"),
  guessList: document.getElementById("guessList"),
  librarySearch: document.getElementById("librarySearch"),
  diagnosisLibrary: document.getElementById("diagnosisLibrary"),
  statsButton: document.getElementById("statsButton"),
  shareButton: document.getElementById("shareButton"),
  resetButton: document.getElementById("resetButton"),
  nextCaseButton: document.getElementById("nextCaseButton"),
  modeToggle: document.getElementById("modeToggle"),
  howToPlayList: document.getElementById("howToPlayList"),
  resultModal: document.getElementById("resultModal"),
  closeResult: document.getElementById("closeResult"),
  modalClose: document.getElementById("modalClose"),
  modalNextCase: document.getElementById("modalNextCase"),
  modalShare: document.getElementById("modalShare"),
  resultEyebrow: document.getElementById("resultEyebrow"),
  resultTitle: document.getElementById("resultTitle"),
  answerLine: document.getElementById("answerLine"),
  explanationBlock: document.getElementById("explanationBlock"),
  premiumPanel: document.getElementById("premiumPanel"),
  premiumStatus: document.getElementById("premiumStatus"),
  plusTokenInput: document.getElementById("plusTokenInput"),
  unlockPremium: document.getElementById("unlockPremium"),
  premiumContent: document.getElementById("premiumContent"),
  statsModal: document.getElementById("statsModal"),
  closeStats: document.getElementById("closeStats"),
  statsTitle: document.getElementById("statsTitle"),
  statsGrid: document.getElementById("statsGrid"),
  distribution: document.getElementById("distribution")
};

let appConfig = null;
let diagnoses = [];
let roundCases = [];
let activeCase = null;
let currentQuestionIndex = 0;
let appMode = "easy";
let apiMode = false;
let state = null;

bindEvents();
init();

async function init() {
  setLoading(true);
  try {
    await loadConfig();
    appMode = getStoredMode();
    await loadCaseForMode(appMode);
    state = loadState();
    renderDiagnosisOptions();
    renderModeButtons();
    renderHowToPlay();
    render();
    showMessage("Backend case engine connected.");
  } catch (error) {
    showFatalLoadError(error);
  } finally {
    setLoading(false);
  }
}

function bindEvents() {
  els.guessForm.addEventListener("submit", submitGuess);
  els.librarySearch.addEventListener("input", renderLibrary);
  els.statsButton.addEventListener("click", openStatsModal);
  els.shareButton.addEventListener("click", shareResult);
  els.resetButton.addEventListener("click", resetCase);
  els.nextCaseButton.addEventListener("click", goToNextCase);
  els.modalShare.addEventListener("click", shareResult);
  els.closeResult.addEventListener("click", () => els.resultModal.close());
  els.modalClose.addEventListener("click", () => els.resultModal.close());
  els.modalNextCase.addEventListener("click", goToNextCase);
  els.closeStats.addEventListener("click", () => els.statsModal.close());
  els.unlockPremium.addEventListener("click", unlockPremium);
  els.modeToggle.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mode]");
    if (button) switchMode(button.dataset.mode);
  });
}

async function loadCaseForMode(mode) {
  await loadFromBackend(mode);
  apiMode = true;
}

async function loadConfig() {
  const payload = await fetchJson("/api/config");
  appConfig = normalizeConfig(payload.config);
  applyBranding();
}

async function loadFromBackend(mode) {
  const date = getLocalDate();
  const [diagnosisPayload, casePayload] = await Promise.all([
    fetchJson("/api/diagnoses"),
    fetchJson(`/api/cases/today?mode=${encodeURIComponent(mode)}&date=${encodeURIComponent(date)}`)
  ]);
  diagnoses = diagnosisPayload.diagnoses || [];
  roundCases = normalizeRound(casePayload);
  currentQuestionIndex = getStoredQuestionIndex(mode, roundCases.length);
  activeCase = roundCases[currentQuestionIndex] || roundCases[0];
}

function normalizeRound(payload) {
  const cases = Array.isArray(payload?.cases) && payload.cases.length
    ? payload.cases
    : [payload?.case].filter(Boolean);
  if (!cases.length) {
    throw new Error("No round cases returned.");
  }
  return cases.slice(0, questionsPerRound()).map(normalizeCase);
}

function normalizeCase(caseRecord) {
  if (!caseRecord) {
    throw new Error("No case returned.");
  }

  const allClues = Array.isArray(caseRecord.clues) ? caseRecord.clues.slice(0, maxClues()) : [];

  return {
    id: caseRecord.id,
    caseNumber: caseRecord.caseNumber || caseRecord.id,
    title: caseRecord.title || `Case ${caseRecord.id}`,
    patient: caseRecord.patient || "Patient",
    difficulty: Number(caseRecord.difficulty || 3),
    totalClues: Number(caseRecord.totalClues || allClues.length || maxClues()),
    clues: allClues.length ? allClues : [],
    answerId: null
  };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    cache: "no-store",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed: ${response.status}`);
  }
  return payload;
}

async function switchMode(mode) {
  if (mode === appMode || !isKnownMode(mode)) return;
  appMode = mode;
  saveStoredMode(mode);
  setLoading(true);
  showMessage("Loading mode...");
  try {
    await loadCaseForMode(mode);
    state = loadState();
    renderDiagnosisOptions();
    render();
    showMessage(`${modeLabel(mode)} Mode loaded.`);
  } catch (error) {
    showMessage(`Could not switch modes: ${error.message}`);
  } finally {
    setLoading(false);
  }
}

function getStoredMode() {
  try {
    const storedMode = localStorage.getItem(`${STORAGE_PREFIX}:mode`);
    return isKnownMode(storedMode) ? storedMode : defaultMode();
  } catch {
    return defaultMode();
  }
}

function normalizeConfig(config) {
  const modes = Array.isArray(config?.modes) && config.modes.length
    ? config.modes
    : [{
        id: "easy",
        label: "Easy",
        description: "Backend mode configuration unavailable.",
        startingClues: 1,
        maxGuesses: 6
      }];

  return {
    appName: config?.appName || FALLBACK_APP_NAME,
    maxClues: Number(config?.maxClues || 6),
    questionsPerRound: Number(config?.questionsPerRound || 5),
    defaultMode: config?.defaultMode || modes[0].id,
    modes: modes.map((mode) => ({
      id: String(mode.id),
      label: mode.label || mode.id,
      description: mode.description || "",
      startingClues: Number(mode.startingClues || 1),
      maxGuesses: Number(mode.maxGuesses || 6)
    })),
    howToPlay: Array.isArray(config?.howToPlay) ? config.howToPlay : []
  };
}

function applyBranding() {
  const name = appName();
  document.title = `${name} | DSM-5-TR Guessing Game`;
  if (els.appName) els.appName.textContent = name;
  if (els.statsTitle) els.statsTitle.textContent = name;
}

function appName() {
  return appConfig?.appName || FALLBACK_APP_NAME;
}

function maxClues() {
  return Math.max(1, Number(appConfig?.maxClues || 6));
}

function questionsPerRound() {
  return Math.max(1, Number(appConfig?.questionsPerRound || 5));
}

function roundSize() {
  return Math.max(1, roundCases.length || questionsPerRound());
}

function defaultMode() {
  return appConfig?.defaultMode || appConfig?.modes?.[0]?.id || "easy";
}

function modeList() {
  return appConfig?.modes || [];
}

function isKnownMode(mode) {
  return modeList().some((item) => item.id === mode);
}

function modeConfig(mode) {
  return modeList().find((item) => item.id === mode) || modeList().find((item) => item.id === defaultMode()) || modeList()[0];
}

function modeLabel(mode) {
  return modeConfig(mode)?.label || "Easy";
}

function renderModeButtons() {
  els.modeToggle.innerHTML = modeList().map((mode) => `
    <button class="mode-button" type="button" data-mode="${escapeAttr(mode.id)}">
      <strong>${escapeHtml(mode.label)}</strong>
      <span>${escapeHtml(mode.description)}</span>
    </button>
  `).join("");
}

function renderHowToPlay() {
  const rules = appConfig?.howToPlay?.length
    ? appConfig.howToPlay
    : ["Backend configuration controls game rules."];
  els.howToPlayList.innerHTML = rules.map((rule) => `<li>${escapeHtml(rule)}</li>`).join("");
}

function saveStoredMode(mode) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}:mode`, mode);
  } catch {
    // Ignore private browsing storage failures.
  }
}

function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function roundProgressKey(mode = appMode) {
  return `${STORAGE_PREFIX}:round:${getLocalDate()}:${mode}`;
}

function getStoredQuestionIndex(mode, size) {
  try {
    const stored = Number(localStorage.getItem(roundProgressKey(mode)) || 0);
    return clampIndex(stored, 0, Math.max(0, size - 1));
  } catch {
    return 0;
  }
}

function saveStoredQuestionIndex(index = currentQuestionIndex) {
  try {
    localStorage.setItem(roundProgressKey(), String(clampIndex(index, 0, roundSize() - 1)));
  } catch {
    // Ignore private browsing storage failures.
  }
}

function storageKeyForCase(caseRecord = activeCase) {
  return `${STORAGE_PREFIX}:case:${getLocalDate()}:${appMode}:${caseRecord?.id || "pending"}`;
}

function storageKey() {
  return storageKeyForCase(activeCase);
}

function statsKey() {
  return `${STORAGE_PREFIX}:stats`;
}

function plusTokenKey() {
  return `${STORAGE_PREFIX}:plus-token`;
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function findDiagnosis(input) {
  const target = normalize(input);
  if (!target) return null;
  return diagnoses.find((diagnosis) => {
    const names = [diagnosis.name, diagnosis.code, ...(diagnosis.aliases || [])];
    return names.some((name) => normalize(name) === target);
  }) || null;
}

function maxGuessesForMode() {
  return modeConfig(appMode)?.maxGuesses || 6;
}

function hasNextQuestion() {
  return currentQuestionIndex < roundSize() - 1;
}

function createInitialState() {
  const clues = activeCase?.clues?.length ? activeCase.clues.slice(0, maxClues()) : [];
  return {
    mode: appMode,
    caseId: activeCase?.id || null,
    date: getLocalDate(),
    questionIndex: currentQuestionIndex,
    roundSize: roundSize(),
    revealedClues: Math.max(1, clues.length),
    clues,
    guesses: [],
    completed: false,
    won: false,
    answer: null
  };
}

function loadState() {
  const base = createInitialState();
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey()));
    if (parsed?.caseId === activeCase.id && parsed?.date === getLocalDate() && parsed?.mode === appMode) {
      const storedClues = Array.isArray(parsed.clues) && parsed.clues.length
        ? parsed.clues.slice(0, maxClues())
        : base.clues;
      const clues = storedClues.length >= base.clues.length ? storedClues : base.clues;
      return {
        ...base,
        ...parsed,
        questionIndex: currentQuestionIndex,
        roundSize: roundSize(),
        revealedClues: Math.max(clues.length, Math.min(maxClues(), Number(parsed.revealedClues || clues.length || 1))),
        clues,
        guesses: Array.isArray(parsed.guesses) ? parsed.guesses : []
      };
    }
  } catch {
    // Ignore corrupt local state.
  }
  return base;
}

function goToNextCase() {
  if (!state?.completed || !hasNextQuestion()) return;
  currentQuestionIndex += 1;
  saveStoredQuestionIndex();
  activeCase = roundCases[currentQuestionIndex];
  state = loadState();
  if (els.resultModal.open) {
    els.resultModal.close();
  }
  showMessage(`Question ${currentQuestionIndex + 1} of ${roundSize()} loaded.`);
  render();
}

function saveState() {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(state));
  } catch {
    // Ignore storage quota or private mode failures.
  }
}

function loadStats() {
  try {
    const parsed = JSON.parse(localStorage.getItem(statsKey()));
    if (parsed && typeof parsed === "object") {
      return {
        played: Number(parsed.played || 0),
        wins: Number(parsed.wins || 0),
        streak: Number(parsed.streak || 0),
        maxStreak: Number(parsed.maxStreak || 0),
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, ...(parsed.distribution || {}) },
        lastPlayed: parsed.lastPlayed || null
      };
    }
  } catch {
    // Ignore corrupt stats.
  }
  return {
    played: 0,
    wins: 0,
    streak: 0,
    maxStreak: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    lastPlayed: null
  };
}

function saveStats(stats) {
  try {
    localStorage.setItem(statsKey(), JSON.stringify(stats));
  } catch {
    // Ignore storage failures.
  }
}

function recordStats() {
  const stats = loadStats();
  const playId = `${state.date}:${state.mode}:${state.caseId}`;
  if (stats.lastPlayed === playId) return;

  stats.played += 1;
  stats.lastPlayed = playId;
  if (state.won) {
    stats.wins += 1;
    stats.streak += 1;
    stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
    const guessNo = String(Math.max(1, state.guesses.length));
    stats.distribution[guessNo] = Number(stats.distribution[guessNo] || 0) + 1;
  } else {
    stats.streak = 0;
  }
  saveStats(stats);
}

async function submitGuess(event) {
  event.preventDefault();
  if (!activeCase || !state) return;
  if (state.completed) {
    showMessage("This case is already complete.");
    return;
  }

  const diagnosis = findDiagnosis(els.guessInput.value);
  if (!diagnosis) {
    showMessage("Choose a diagnosis from the DSM-5-TR list.");
    return;
  }
  if (state.guesses.some((guess) => guess.id === diagnosis.id)) {
    showMessage("Already guessed. Try a different diagnosis.");
    return;
  }
  if (state.guesses.length >= maxGuessesForMode()) {
    showMessage("No guesses remain for this mode.");
    return;
  }

  setFormBusy(true);
  try {
    const result = await submitGuessToBackend(diagnosis);

    state.guesses.push({
      id: diagnosis.id,
      name: diagnosis.name,
      category: diagnosis.category,
      correct: Boolean(result.correct),
      near: Boolean(result.near)
    });

    if (!result.completed && result.nextClue) {
      addClue(result.nextClue);
    }

    if (result.completed) {
      state.completed = true;
      state.won = Boolean(result.correct);
      state.answer = result.answer || null;
      if (!state.won && Array.isArray(result.allClues)) {
        state.clues = result.allClues.slice(0, maxClues());
        state.revealedClues = state.clues.length;
      }
      recordStats();
      showMessage(hasNextQuestion()
        ? "Question complete. Plus unlocks the clinical breakdown, or continue to the next question."
        : "Round complete. Plus unlocks the clinical breakdown.");
      openResultModal();
    } else {
      showMessage(result.near ? "Same diagnostic family. Getting warmer." : "Not the best fit yet. New cue revealed.");
    }

    els.guessInput.value = "";
    saveState();
    render();
  } catch (error) {
    showMessage(error.message || "Could not check that guess.");
  } finally {
    setFormBusy(false);
  }
}

async function submitGuessToBackend(diagnosis) {
  return fetchJson("/api/guess", {
    method: "POST",
    body: JSON.stringify({
      caseId: activeCase.id,
      mode: appMode,
      diagnosisId: diagnosis.id,
      revealedClues: state.clues.length,
      guessedDiagnosisIds: [...state.guesses.map((guess) => guess.id), diagnosis.id]
    })
  });
}

function addClue(clue) {
  if (!clue || state.clues.includes(clue)) return;
  state.clues = [...state.clues, clue].slice(0, maxClues());
  state.revealedClues = state.clues.length;
}

function showMessage(message) {
  els.formMessage.textContent = message || "";
}

function setLoading(isLoading) {
  els.guessInput.disabled = isLoading || Boolean(state?.completed);
  els.guessForm.querySelector("button").disabled = isLoading || Boolean(state?.completed);
}

function setFormBusy(isBusy) {
  els.guessInput.disabled = isBusy || Boolean(state?.completed);
  els.guessForm.querySelector("button").disabled = isBusy || Boolean(state?.completed);
}

function render() {
  if (!activeCase || !state) return;

  const sourceLabel = apiMode ? "backend protected" : "backend required";
  const currentModeLabel = `${modeLabel(appMode)} Mode`;
  const questionLabel = `Question ${currentQuestionIndex + 1} of ${roundSize()}`;
  els.caseMeta.textContent = `${questionLabel} / ${activeCase.title} / ${getLocalDate()} / ${activeCase.patient} / ${currentModeLabel} / ${sourceLabel}`;
  els.questionCounter.textContent = `${currentQuestionIndex + 1} / ${roundSize()}`;
  els.clueCounter.textContent = `${state.clues.length} / ${activeCase.totalClues || maxClues()}`;
  els.guessCounter.textContent = `${state.guesses.length} / ${maxGuessesForMode()}`;
  els.resultBadge.textContent = state.completed
    ? hasNextQuestion()
      ? (state.won ? "Solved" : "Missed")
      : "Round done"
    : "In progress";
  els.resultBadge.style.color = state.completed ? (state.won ? "var(--green)" : "var(--red)") : "var(--ink)";

  els.modeToggle.querySelectorAll("[data-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === appMode);
  });
  els.clueStack.innerHTML = state.clues
    .map((clue, index) => `
      <article class="clue-card">
        <div class="clue-head">
          <span class="clue-number">${index + 1}</span>
          <span class="clue-title">Cue ${index + 1}</span>
        </div>
        <p class="clue-text">${escapeHtml(clue)}</p>
      </article>
    `)
    .join("");

  els.guessList.innerHTML = state.guesses.length
    ? state.guesses.map((guess, index) => renderGuess(guess, index)).join("")
    : "";

  els.guessInput.disabled = state.completed;
  els.guessForm.querySelector("button").disabled = state.completed;
  els.nextCaseButton.hidden = !state.completed || !hasNextQuestion();
  els.nextCaseButton.textContent = `Next Question (${currentQuestionIndex + 2}/${roundSize()})`;
  renderLibrary();
}

function renderGuess(guess, index) {
  const status = guess.correct ? "correct" : guess.near ? "near" : "wrong";
  const mark = guess.correct ? "OK" : guess.near ? "~" : "x";
  const feedback = guess.correct
    ? "Correct diagnosis."
    : guess.near
      ? "Same DSM-5-TR diagnostic family as the answer."
      : "Not the best fit for this case.";

  return `
    <article class="guess-card ${status}">
      <span class="guess-mark">${mark}</span>
      <div>
        <div class="guess-name">${index + 1}. ${escapeHtml(guess.name)}</div>
        <p class="guess-feedback">${escapeHtml(feedback)}</p>
      </div>
      <div class="guess-category">${escapeHtml(guess.category)}</div>
    </article>
  `;
}

function renderDiagnosisOptions() {
  els.diagnosisOptions.innerHTML = diagnoses.map((diagnosis) => `
    <option value="${escapeAttr(diagnosis.name)}">${escapeHtml(diagnosis.category)}</option>
  `).join("");
}

function renderLibrary() {
  const query = normalize(els.librarySearch.value);
  const filtered = diagnoses.filter((diagnosis) => {
    if (!query) return true;
    return [diagnosis.name, diagnosis.category, diagnosis.code, ...(diagnosis.aliases || [])]
      .some((value) => normalize(value).includes(query));
  }).slice(0, 90);

  els.diagnosisLibrary.innerHTML = filtered.map((diagnosis) => `
    <div class="library-item">
      <strong>${escapeHtml(diagnosis.name)}</strong>
      <span>${escapeHtml(diagnosis.category)} / ${escapeHtml(diagnosis.code || "DSM-5-TR")}</span>
    </div>
  `).join("");
}

function openResultModal() {
  const answer = state.answer;
  const nextAvailable = hasNextQuestion();
  resetPremiumPanel();

  els.resultEyebrow.textContent = `Question ${currentQuestionIndex + 1} of ${roundSize()} ${state.won ? "solved" : "answer"}`;
  els.resultTitle.textContent = state.won
    ? `Solved in ${state.guesses.length} guess${state.guesses.length === 1 ? "" : "es"}`
    : nextAvailable
      ? "Answer shown. Next question is ready."
      : "Round complete";
  els.answerLine.textContent = answer
    ? `${answer.name} (${answer.category})`
    : "Answer unavailable.";
  els.explanationBlock.innerHTML = `
    <div class="explanation-card locked-summary">
      <p class="card-kicker">Plus only</p>
      <p>Detailed DSM-5-TR-aligned criteria guidance, differential diagnoses, and how to distinguish them are available only in the paid version.</p>
    </div>
  `;
  els.modalNextCase.hidden = !nextAvailable;
  els.modalNextCase.textContent = `Next Question (${currentQuestionIndex + 2}/${roundSize()})`;
  els.modalClose.textContent = nextAvailable ? "Close" : "Finish";
  els.resultModal.showModal();
}

function resetPremiumPanel() {
  els.premiumContent.innerHTML = "";
  els.premiumStatus.textContent = apiMode
    ? "Paid version required. This section is requested from the backend only after Plus access is verified."
    : "Plus requires the backend server.";
  try {
    els.plusTokenInput.value = localStorage.getItem(plusTokenKey()) || "";
  } catch {
    els.plusTokenInput.value = "";
  }
}

async function unlockPremium() {
  if (!state?.completed || !state.answer) {
    els.premiumStatus.textContent = "Finish the case before requesting the Plus breakdown.";
    return;
  }
  if (!apiMode) {
    els.premiumStatus.textContent = "Run the backend server to verify Plus access.";
    return;
  }

  const token = els.plusTokenInput.value.trim();
  if (!token) {
    els.premiumStatus.textContent = "Enter a Plus access token.";
    return;
  }

  els.unlockPremium.disabled = true;
  els.premiumStatus.textContent = "Verifying Plus access...";
  try {
    const premium = await fetchJson(`/api/premium/diagnosis/${encodeURIComponent(state.answer.id)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    try {
      localStorage.setItem(plusTokenKey(), token);
    } catch {
      // Ignore storage failures.
    }
    renderPremiumContent(premium);
    els.premiumStatus.textContent = premium.sourceNote || "Unlocked. Educational summary, not verbatim DSM text.";
  } catch (error) {
    els.premiumStatus.textContent = error.message || "Plus access could not be verified.";
    els.premiumContent.innerHTML = `<div class="locked">Plus content remains locked.</div>`;
  } finally {
    els.unlockPremium.disabled = false;
  }
}

function renderPremiumContent(premium) {
  const criteria = Array.isArray(premium.criteriaGuide) ? premium.criteriaGuide : [];
  const differentials = Array.isArray(premium.differentials) ? premium.differentials : [];
  const howToDifferentiate = Array.isArray(premium.howToDifferentiate) ? premium.howToDifferentiate : [];

  els.premiumContent.innerHTML = `
    <section>
      <p class="card-kicker">Criteria guide</p>
      <ul class="criteria-list">
        ${criteria.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
    <section>
      <p class="card-kicker">Differentials</p>
      <div class="differential-list">
        ${differentials.map((item) => `
          <article>
            <strong>${escapeHtml(item.name)}</strong>
            <p>${escapeHtml(item.distinguishingFeatures || item.distinguish || "")}</p>
          </article>
        `).join("")}
      </div>
    </section>
    <section>
      <p class="card-kicker">How to differentiate</p>
      <ul class="criteria-list">
        ${howToDifferentiate.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
  `;
}

function openStatsModal() {
  const stats = loadStats();
  const winPct = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;
  els.statsGrid.innerHTML = [
    ["Played", stats.played],
    ["Win %", winPct],
    ["Streak", stats.streak],
    ["Best", stats.maxStreak]
  ].map(([label, value]) => `
    <div class="stat-card">
      <span class="stat-value">${value}</span>
      <span class="stat-label">${label}</span>
    </div>
  `).join("");

  const max = Math.max(1, ...Object.values(stats.distribution).map(Number));
  els.distribution.innerHTML = [1, 2, 3, 4, 5, 6].map((guessNo) => {
    const count = Number(stats.distribution[guessNo] || 0);
    const width = Math.max(4, Math.round((count / max) * 100));
    return `
      <div class="dist-row">
        <strong>${guessNo}</strong>
        <div class="dist-track"><div class="dist-fill" style="width:${width}%"></div></div>
        <span>${count}</span>
      </div>
    `;
  }).join("");
  els.statsModal.showModal();
}

function buildShareText() {
  const tiles = state.guesses.map((guess) => guess.correct ? "G" : guess.near ? "Y" : "B").join("");
  const line = state.completed
    ? state.won
      ? `${state.guesses.length}/${maxGuessesForMode()}`
      : `X/${maxGuessesForMode()}`
    : `${state.guesses.length}/${maxGuessesForMode()}`;
  return `${appName()} ${modeLabel(appMode)} Q${currentQuestionIndex + 1}/${roundSize()} #${activeCase.caseNumber} ${line}\n${tiles || "_"}\n${location.origin}${location.pathname}`;
}

async function shareResult() {
  const text = buildShareText();
  try {
    if (navigator.share) {
      await navigator.share({ title: appName(), text });
      return;
    }
    await navigator.clipboard.writeText(text);
    showMessage("Copied share text to clipboard.");
  } catch {
    showMessage("Share cancelled.");
  }
}

function resetCase() {
  if (!activeCase || !confirm("Reset today's saved 5-question round on this device?")) return;
  for (const caseRecord of roundCases) {
    localStorage.removeItem(storageKeyForCase(caseRecord));
  }
  localStorage.removeItem(roundProgressKey());
  currentQuestionIndex = 0;
  activeCase = roundCases[0];
  state = createInitialState();
  showMessage("");
  render();
}

function showFatalLoadError(error) {
  els.caseMeta.textContent = "Case engine could not load.";
  els.clueStack.innerHTML = `
    <article class="clue-card">
      <div class="clue-head">
        <span class="clue-number">!</span>
        <span class="clue-title">Setup needed</span>
      </div>
      <p class="clue-text">${escapeHtml(error.message || "Run npm run train:cases and npm start.")}</p>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function clampIndex(value, min, max) {
  const numeric = Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : min;
  return Math.max(min, Math.min(max, numeric));
}
