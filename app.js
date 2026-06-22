const MAX_GUESSES = 6;
const TOUGH_GUESSES = 1;
const MAX_CLUES = 6;
const STORAGE_PREFIX = "psychiatrydiagnosis";
const BASE_DATE = "2026-06-22";

const els = {
  caseMeta: document.getElementById("caseMeta"),
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
  classicMode: document.getElementById("classicMode"),
  toughMode: document.getElementById("toughMode"),
  toughActions: document.getElementById("toughActions"),
  revealClueButton: document.getElementById("revealClueButton"),
  resultModal: document.getElementById("resultModal"),
  closeResult: document.getElementById("closeResult"),
  modalClose: document.getElementById("modalClose"),
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
  statsGrid: document.getElementById("statsGrid"),
  distribution: document.getElementById("distribution")
};

let diagnoses = [];
let activeCase = null;
let appMode = getStoredMode();
let apiMode = false;
let state = null;

bindEvents();
init();

async function init() {
  setLoading(true);
  try {
    await loadCaseForMode(appMode);
    state = loadState();
    renderDiagnosisOptions();
    render();
    showMessage(apiMode ? "Backend case engine connected." : "Static demo mode. Run the backend for protected answers and Plus.");
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
  els.modalShare.addEventListener("click", shareResult);
  els.closeResult.addEventListener("click", () => els.resultModal.close());
  els.modalClose.addEventListener("click", () => els.resultModal.close());
  els.closeStats.addEventListener("click", () => els.statsModal.close());
  els.revealClueButton.addEventListener("click", revealNextClue);
  els.unlockPremium.addEventListener("click", unlockPremium);
  els.classicMode.addEventListener("click", () => switchMode("classic"));
  els.toughMode.addEventListener("click", () => switchMode("tough"));
}

async function loadCaseForMode(mode) {
  try {
    await loadFromBackend(mode);
    apiMode = true;
  } catch {
    await loadFromStaticFiles(mode);
    apiMode = false;
  }
}

async function loadFromBackend(mode) {
  const date = getLocalDate();
  const [diagnosisPayload, casePayload] = await Promise.all([
    fetchJson("/api/diagnoses"),
    fetchJson(`/api/cases/today?mode=${encodeURIComponent(mode)}&date=${encodeURIComponent(date)}`)
  ]);
  diagnoses = diagnosisPayload.diagnoses || [];
  activeCase = normalizeCase(casePayload.case, false);
}

async function loadFromStaticFiles(mode) {
  const [diagnosisResponse, caseResponse] = await Promise.all([
    fetch("data/diagnoses.json", { cache: "no-store" }),
    fetch("data/static-cases.json", { cache: "no-store" })
  ]);
  if (!diagnosisResponse.ok || !caseResponse.ok) {
    throw new Error("Case data is not available.");
  }

  const diagnosisPayload = await diagnosisResponse.json();
  const casePayload = await caseResponse.json();
  diagnoses = diagnosisPayload.diagnoses || diagnosisPayload || [];
  const cases = casePayload.cases || casePayload || [];
  activeCase = normalizeCase(selectCaseForDate(cases, mode), true);
}

function normalizeCase(caseRecord, includeAnswer) {
  if (!caseRecord) {
    throw new Error("No case returned.");
  }

  const allClues = Array.isArray(caseRecord.clues) ? caseRecord.clues.slice(0, MAX_CLUES) : [];
  const firstClue = allClues[0] ? [allClues[0]] : [];

  return {
    id: caseRecord.id,
    caseNumber: caseRecord.caseNumber || caseRecord.id,
    title: caseRecord.title || `Case ${caseRecord.id}`,
    patient: caseRecord.patient || "Patient",
    difficulty: Number(caseRecord.difficulty || 3),
    totalClues: Number(caseRecord.totalClues || allClues.length || MAX_CLUES),
    clues: firstClue,
    allClues: includeAnswer ? allClues : null,
    answerId: includeAnswer ? caseRecord.answerId : null,
    explanation: includeAnswer ? caseRecord.explanation : "",
    differentials: includeAnswer ? caseRecord.differentials || [] : []
  };
}

function selectCaseForDate(cases, mode) {
  const pool = mode === "tough"
    ? cases.filter((caseRecord) => Number(caseRecord.difficulty || 0) >= 3)
    : cases;
  const usablePool = pool.length ? pool : cases;
  const days = daysSinceBase(getLocalDate());
  const offset = mode === "tough" ? 397 : 0;
  return usablePool[(days + offset) % usablePool.length];
}

function daysSinceBase(dateString) {
  const start = new Date(`${BASE_DATE}T00:00:00`);
  const current = new Date(`${dateString}T00:00:00`);
  return Math.max(0, Math.floor((current - start) / 86400000));
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
  if (mode === appMode || !["classic", "tough"].includes(mode)) return;
  appMode = mode;
  saveStoredMode(mode);
  setLoading(true);
  showMessage("Loading mode...");
  try {
    await loadCaseForMode(mode);
    state = loadState();
    renderDiagnosisOptions();
    render();
    showMessage(mode === "tough" ? "Tough Mode loaded. Reveal clues carefully." : "Classic Mode loaded.");
  } catch (error) {
    showMessage(`Could not switch modes: ${error.message}`);
  } finally {
    setLoading(false);
  }
}

function getStoredMode() {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}:mode`) || "classic";
  } catch {
    return "classic";
  }
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

function storageKey() {
  return `${STORAGE_PREFIX}:case:${getLocalDate()}:${appMode}:${activeCase?.id || "pending"}`;
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

function answerDiagnosisStatic() {
  if (!activeCase?.answerId) return null;
  return diagnoses.find((diagnosis) => diagnosis.id === activeCase.answerId) || null;
}

function maxGuessesForMode() {
  return appMode === "tough" ? TOUGH_GUESSES : MAX_GUESSES;
}

function createInitialState() {
  const clues = activeCase?.clues?.length ? activeCase.clues.slice(0, 1) : [];
  return {
    mode: appMode,
    caseId: activeCase?.id || null,
    date: getLocalDate(),
    revealedClues: Math.max(1, clues.length),
    clues,
    guesses: [],
    completed: false,
    won: false,
    answer: null,
    explanation: "",
    differentials: []
  };
}

function loadState() {
  const base = createInitialState();
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey()));
    if (parsed?.caseId === activeCase.id && parsed?.date === getLocalDate() && parsed?.mode === appMode) {
      const clues = Array.isArray(parsed.clues) && parsed.clues.length
        ? parsed.clues.slice(0, MAX_CLUES)
        : base.clues;
      return {
        ...base,
        ...parsed,
        revealedClues: Math.max(1, Math.min(MAX_CLUES, Number(parsed.revealedClues || clues.length || 1))),
        clues,
        guesses: Array.isArray(parsed.guesses) ? parsed.guesses : [],
        differentials: Array.isArray(parsed.differentials) ? parsed.differentials : []
      };
    }
  } catch {
    // Ignore corrupt local state.
  }
  return base;
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
    const result = apiMode
      ? await submitGuessToBackend(diagnosis)
      : resolveStaticGuess(diagnosis);

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
      state.answer = result.answer || answerDiagnosisStatic();
      state.explanation = result.explanation || activeCase.explanation || "";
      state.differentials = result.differentials || activeCase.differentials || [];
      if (!state.won && Array.isArray(result.allClues)) {
        state.clues = result.allClues.slice(0, MAX_CLUES);
        state.revealedClues = state.clues.length;
      }
      recordStats();
      showMessage(state.won ? "Correct. Nice clinical reasoning." : "Case complete. Review the explanation.");
      openResultModal();
    } else {
      showMessage(result.near ? "Same diagnostic family. Getting warmer." : "Not the best fit yet. New clue revealed.");
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

function resolveStaticGuess(diagnosis) {
  const answer = answerDiagnosisStatic();
  if (!answer) {
    throw new Error("Static answer data is unavailable.");
  }
  const correct = diagnosis.id === answer.id;
  const near = !correct && diagnosis.category === answer.category;
  const guessCount = state.guesses.length + 1;
  const completed = correct || appMode === "tough" || guessCount >= maxGuessesForMode();
  const nextClue = !completed && activeCase.allClues
    ? activeCase.allClues[state.clues.length]
    : null;

  return {
    correct,
    near,
    completed,
    nextClue,
    answer,
    explanation: completed ? activeCase.explanation : "",
    differentials: completed ? activeCase.differentials : [],
    allClues: completed ? activeCase.allClues : null
  };
}

async function revealNextClue() {
  if (!state || state.completed || appMode !== "tough") return;
  if (state.clues.length >= Math.min(MAX_CLUES, activeCase.totalClues)) {
    showMessage("All clues are already revealed.");
    return;
  }

  els.revealClueButton.disabled = true;
  try {
    const result = apiMode
      ? await fetchJson("/api/reveal", {
          method: "POST",
          body: JSON.stringify({ caseId: activeCase.id, revealedClues: state.clues.length })
        })
      : { clue: activeCase.allClues?.[state.clues.length] };

    if (result.clue) {
      addClue(result.clue);
      saveState();
      render();
      showMessage("New clue revealed. Your diagnosis is still final in Tough Mode.");
    } else {
      showMessage("No more clues available.");
    }
  } catch (error) {
    showMessage(error.message || "Could not reveal another clue.");
  } finally {
    els.revealClueButton.disabled = false;
  }
}

function addClue(clue) {
  if (!clue || state.clues.includes(clue)) return;
  state.clues = [...state.clues, clue].slice(0, MAX_CLUES);
  state.revealedClues = state.clues.length;
}

function showMessage(message) {
  els.formMessage.textContent = message || "";
}

function setLoading(isLoading) {
  els.guessInput.disabled = isLoading || Boolean(state?.completed);
  els.guessForm.querySelector("button").disabled = isLoading || Boolean(state?.completed);
  els.revealClueButton.disabled = isLoading;
}

function setFormBusy(isBusy) {
  els.guessInput.disabled = isBusy || Boolean(state?.completed);
  els.guessForm.querySelector("button").disabled = isBusy || Boolean(state?.completed);
}

function render() {
  if (!activeCase || !state) return;

  const sourceLabel = apiMode ? "backend protected" : "static demo";
  const modeLabel = appMode === "tough" ? "Tough Mode" : "Classic Mode";
  els.caseMeta.textContent = `${activeCase.title} / ${getLocalDate()} / ${activeCase.patient} / ${modeLabel} / ${sourceLabel}`;
  els.clueCounter.textContent = `${state.clues.length} / ${activeCase.totalClues || MAX_CLUES}`;
  els.guessCounter.textContent = `${state.guesses.length} / ${maxGuessesForMode()}`;
  els.resultBadge.textContent = state.completed ? (state.won ? "Solved" : "Missed") : "In progress";
  els.resultBadge.style.color = state.completed ? (state.won ? "var(--green)" : "var(--red)") : "var(--ink)";

  els.classicMode.classList.toggle("is-active", appMode === "classic");
  els.toughMode.classList.toggle("is-active", appMode === "tough");
  els.toughActions.hidden = appMode !== "tough" || state.completed;
  els.revealClueButton.disabled = state.completed || state.clues.length >= Math.min(MAX_CLUES, activeCase.totalClues);

  els.clueStack.innerHTML = state.clues
    .map((clue, index) => `
      <article class="clue-card">
        <div class="clue-head">
          <span class="clue-number">${index + 1}</span>
          <span class="clue-title">Clue ${index + 1}</span>
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
  const answer = state.answer || answerDiagnosisStatic();
  resetPremiumPanel();

  els.resultEyebrow.textContent = state.won ? "Solved" : "Answer";
  els.resultTitle.textContent = state.won
    ? `Solved in ${state.guesses.length} guess${state.guesses.length === 1 ? "" : "es"}`
    : "Better luck next case";
  els.answerLine.textContent = answer
    ? `${answer.name} (${answer.category})`
    : "Answer unavailable.";
  els.explanationBlock.innerHTML = `
    <div class="explanation-card">
      <p class="card-kicker">Why this fits</p>
      <p>${escapeHtml(state.explanation || "Explanation available after backend validation.")}</p>
    </div>
    <div class="explanation-card">
      <p class="card-kicker">Close differentials</p>
      <p>${escapeHtml(formatFreeDifferentials(state.differentials))}</p>
    </div>
  `;
  els.resultModal.showModal();
}

function resetPremiumPanel() {
  els.premiumContent.innerHTML = "";
  els.premiumStatus.textContent = apiMode
    ? "Paid version required. This section is requested from the backend only after Plus access is verified."
    : "Plus requires the backend server. Static demo mode cannot unlock protected clinical breakdowns.";
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

function formatFreeDifferentials(differentials) {
  if (!Array.isArray(differentials) || !differentials.length) {
    return "Differential guide available in Plus.";
  }
  return differentials.map((item) => typeof item === "string" ? item : item.name).filter(Boolean).join("; ");
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
  const modeLabel = appMode === "tough" ? "Tough" : "Classic";
  return `Psychiatry Diagnosis ${modeLabel} #${activeCase.caseNumber} ${line}\n${tiles || "_"}\n${location.origin}${location.pathname}`;
}

async function shareResult() {
  const text = buildShareText();
  try {
    if (navigator.share) {
      await navigator.share({ title: "Psychiatry Diagnosis", text });
      return;
    }
    await navigator.clipboard.writeText(text);
    showMessage("Copied share text to clipboard.");
  } catch {
    showMessage("Share cancelled.");
  }
}

function resetCase() {
  if (!activeCase || !confirm("Reset today's saved game on this device?")) return;
  localStorage.removeItem(storageKey());
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
