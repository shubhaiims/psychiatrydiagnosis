const MAX_GUESSES = 6;
const MAX_CLUES = 6;
const STORAGE_PREFIX = "psychiatrydiagnosis";
const BASE_DATE = "2026-06-22";

const DIAGNOSES = [
  { id: "mdd", code: "F33.1", name: "Major Depressive Disorder", category: "Depressive Disorders", aliases: ["depression", "major depression", "mdd"] },
  { id: "persistent-depressive", code: "F34.1", name: "Persistent Depressive Disorder", category: "Depressive Disorders", aliases: ["dysthymia", "persistent depression"] },
  { id: "bipolar-i", code: "F31.1", name: "Bipolar I Disorder", category: "Bipolar and Related Disorders", aliases: ["bipolar 1", "bipolar disorder type i"] },
  { id: "bipolar-ii", code: "F31.81", name: "Bipolar II Disorder", category: "Bipolar and Related Disorders", aliases: ["bipolar 2", "bp ii"] },
  { id: "cyclothymic", code: "F34.0", name: "Cyclothymic Disorder", category: "Bipolar and Related Disorders", aliases: ["cyclothymia"] },
  { id: "gad", code: "F41.1", name: "Generalized Anxiety Disorder", category: "Anxiety Disorders", aliases: ["gad", "generalised anxiety disorder"] },
  { id: "panic", code: "F41.0", name: "Panic Disorder", category: "Anxiety Disorders", aliases: ["panic attacks"] },
  { id: "social-anxiety", code: "F40.10", name: "Social Anxiety Disorder", category: "Anxiety Disorders", aliases: ["social phobia"] },
  { id: "specific-phobia", code: "F40.2", name: "Specific Phobia", category: "Anxiety Disorders", aliases: ["phobia"] },
  { id: "agoraphobia", code: "F40.00", name: "Agoraphobia", category: "Anxiety Disorders", aliases: [] },
  { id: "ocd", code: "F42", name: "Obsessive-Compulsive Disorder", category: "Obsessive-Compulsive and Related Disorders", aliases: ["ocd"] },
  { id: "body-dysmorphic", code: "F45.22", name: "Body Dysmorphic Disorder", category: "Obsessive-Compulsive and Related Disorders", aliases: ["bdd", "body dysmorphia"] },
  { id: "hoarding", code: "F42", name: "Hoarding Disorder", category: "Obsessive-Compulsive and Related Disorders", aliases: [] },
  { id: "ptsd", code: "F43.10", name: "Posttraumatic Stress Disorder", category: "Trauma- and Stressor-Related Disorders", aliases: ["ptsd", "post-traumatic stress disorder"] },
  { id: "acute-stress", code: "F43.0", name: "Acute Stress Disorder", category: "Trauma- and Stressor-Related Disorders", aliases: [] },
  { id: "adjustment", code: "F43.20", name: "Adjustment Disorder", category: "Trauma- and Stressor-Related Disorders", aliases: [] },
  { id: "prolonged-grief", code: "F43.81", name: "Prolonged Grief Disorder", category: "Trauma- and Stressor-Related Disorders", aliases: ["complicated grief"] },
  { id: "schizophrenia", code: "F20.9", name: "Schizophrenia", category: "Schizophrenia Spectrum and Other Psychotic Disorders", aliases: [] },
  { id: "schizophreniform", code: "F20.81", name: "Schizophreniform Disorder", category: "Schizophrenia Spectrum and Other Psychotic Disorders", aliases: [] },
  { id: "brief-psychotic", code: "F23", name: "Brief Psychotic Disorder", category: "Schizophrenia Spectrum and Other Psychotic Disorders", aliases: ["brief psychosis"] },
  { id: "delusional", code: "F22", name: "Delusional Disorder", category: "Schizophrenia Spectrum and Other Psychotic Disorders", aliases: [] },
  { id: "schizoaffective", code: "F25.0", name: "Schizoaffective Disorder", category: "Schizophrenia Spectrum and Other Psychotic Disorders", aliases: [] },
  { id: "autism", code: "F84.0", name: "Autism Spectrum Disorder", category: "Neurodevelopmental Disorders", aliases: ["asd", "autism"] },
  { id: "adhd", code: "F90.2", name: "Attention-Deficit/Hyperactivity Disorder", category: "Neurodevelopmental Disorders", aliases: ["adhd", "add"] },
  { id: "tourette", code: "F95.2", name: "Tourette's Disorder", category: "Neurodevelopmental Disorders", aliases: ["tourette syndrome"] },
  { id: "anorexia", code: "F50.01", name: "Anorexia Nervosa", category: "Feeding and Eating Disorders", aliases: ["anorexia"] },
  { id: "bulimia", code: "F50.2", name: "Bulimia Nervosa", category: "Feeding and Eating Disorders", aliases: ["bulimia"] },
  { id: "binge-eating", code: "F50.81", name: "Binge-Eating Disorder", category: "Feeding and Eating Disorders", aliases: ["bed"] },
  { id: "arfid", code: "F50.82", name: "Avoidant/Restrictive Food Intake Disorder", category: "Feeding and Eating Disorders", aliases: ["arfid"] },
  { id: "somatic-symptom", code: "F45.1", name: "Somatic Symptom Disorder", category: "Somatic Symptom and Related Disorders", aliases: [] },
  { id: "illness-anxiety", code: "F45.21", name: "Illness Anxiety Disorder", category: "Somatic Symptom and Related Disorders", aliases: ["health anxiety"] },
  { id: "borderline-pd", code: "F60.3", name: "Borderline Personality Disorder", category: "Personality Disorders", aliases: ["bpd"] },
  { id: "antisocial-pd", code: "F60.2", name: "Antisocial Personality Disorder", category: "Personality Disorders", aliases: ["aspd"] },
  { id: "avoidant-pd", code: "F60.6", name: "Avoidant Personality Disorder", category: "Personality Disorders", aliases: ["avpd"] },
  { id: "narcissistic-pd", code: "F60.81", name: "Narcissistic Personality Disorder", category: "Personality Disorders", aliases: ["npd"] },
  { id: "alcohol-use", code: "F10.20", name: "Alcohol Use Disorder", category: "Substance-Related and Addictive Disorders", aliases: ["alcohol dependence", "alcoholism"] },
  { id: "opioid-use", code: "F11.20", name: "Opioid Use Disorder", category: "Substance-Related and Addictive Disorders", aliases: ["opioid addiction"] },
  { id: "cannabis-use", code: "F12.20", name: "Cannabis Use Disorder", category: "Substance-Related and Addictive Disorders", aliases: ["marijuana use disorder"] },
  { id: "stimulant-use", code: "F15.20", name: "Stimulant Use Disorder", category: "Substance-Related and Addictive Disorders", aliases: ["methamphetamine use disorder", "cocaine use disorder"] },
  { id: "insomnia", code: "G47.00", name: "Insomnia Disorder", category: "Sleep-Wake Disorders", aliases: [] },
  { id: "narcolepsy", code: "G47.419", name: "Narcolepsy", category: "Sleep-Wake Disorders", aliases: [] },
  { id: "gender-dysphoria", code: "F64.9", name: "Gender Dysphoria", category: "Gender Dysphoria", aliases: [] }
];

const CASES = [
  {
    id: 1,
    answerId: "prolonged-grief",
    title: "Daily Case 1",
    patient: "58-year-old woman",
    clues: [
      "A 58-year-old woman presents with fatigue and poor concentration at work.",
      "Symptoms have persisted for 19 months and worsened after a major loss.",
      "Her daughter says she still sets the dinner table for two every night.",
      "She reports intense daily yearning for her late husband and says life feels empty without him.",
      "She carries one of his folded handkerchiefs and becomes tearful when asked about future plans.",
      "She denies wanting to die, but her grief remains pervasive long after the bereavement and is impairing work."
    ],
    explanation:
      "The best fit is Prolonged Grief Disorder because the case centers on persistent, impairing yearning and preoccupation after bereavement, with grief-specific behavior and meaninglessness long after the death.",
    differentials: ["Major Depressive Disorder", "Posttraumatic Stress Disorder", "Adjustment Disorder"]
  },
  {
    id: 2,
    answerId: "bipolar-i",
    title: "Daily Case 2",
    patient: "31-year-old man",
    clues: [
      "A 31-year-old man is brought by family because he has not slept much for several nights.",
      "He is unusually energetic, loud, and insists he has discovered a guaranteed investment method.",
      "He spent a large amount of money and tried to recruit strangers into his plan.",
      "Speech is pressured, ideas shift quickly, and he becomes irritable when interrupted.",
      "He believes a news anchor is sending him special encouragement through the television.",
      "The episode required emergency evaluation because judgment, sleep, spending, and psychotic intensity became unsafe."
    ],
    explanation:
      "The best fit is Bipolar I Disorder because the vignette describes a manic episode with decreased need for sleep, grandiosity, pressured speech, risky behavior, marked impairment, and psychotic features.",
    differentials: ["Schizoaffective Disorder", "Substance/Medication-Induced Bipolar Disorder", "Delusional Disorder"]
  },
  {
    id: 3,
    answerId: "ocd",
    title: "Daily Case 3",
    patient: "26-year-old medical student",
    clues: [
      "A 26-year-old student reports arriving late because morning routines take hours.",
      "The person fears contamination after touching door handles despite knowing the fear may be excessive.",
      "Repeated washing temporarily reduces anxiety, but the fear returns quickly.",
      "They also repeat mental phrases until they feel 'safe enough' to leave home.",
      "The routines consume more than two hours daily and are interfering with classes and relationships.",
      "There is no fixed delusional conviction; the patient is distressed by the thoughts and rituals."
    ],
    explanation:
      "The best fit is Obsessive-Compulsive Disorder because intrusive contamination fears and repetitive washing or mental rituals are time-consuming, distressing, and impairing.",
    differentials: ["Body Dysmorphic Disorder", "Illness Anxiety Disorder", "Generalized Anxiety Disorder"]
  },
  {
    id: 4,
    answerId: "schizophrenia",
    title: "Daily Case 4",
    patient: "22-year-old man",
    clues: [
      "A 22-year-old man has become socially withdrawn and stopped attending college.",
      "Family notices reduced speech, poor self-care, and odd behavior over several months.",
      "He reports hearing two unfamiliar voices commenting on his actions.",
      "He believes neighbors installed devices to monitor his thoughts.",
      "Symptoms have continued outside mood episodes and there is no clear substance trigger.",
      "The pattern includes hallucinations, delusional beliefs, negative symptoms, functional decline, and a prolonged course."
    ],
    explanation:
      "The best fit is Schizophrenia because the case combines persistent psychotic symptoms, negative symptoms, functional decline, and a course not limited to mood episodes.",
    differentials: ["Schizophreniform Disorder", "Schizoaffective Disorder", "Substance-Induced Psychotic Disorder"]
  },
  {
    id: 5,
    answerId: "panic",
    title: "Daily Case 5",
    patient: "39-year-old teacher",
    clues: [
      "A 39-year-old teacher fears another sudden episode will happen during class.",
      "Episodes peak within minutes and include palpitations, trembling, shortness of breath, and fear of dying.",
      "Several attacks have occurred unexpectedly rather than only in one specific situation.",
      "The person now avoids exercise, coffee, and driving alone because these sensations feel dangerous.",
      "Medical evaluation has not found a cardiac explanation.",
      "The main problem is recurrent unexpected panic attacks followed by persistent concern and behavioral avoidance."
    ],
    explanation:
      "The best fit is Panic Disorder because recurrent unexpected panic attacks are followed by ongoing worry and maladaptive avoidance related to future attacks.",
    differentials: ["Specific Phobia", "Agoraphobia", "Illness Anxiety Disorder"]
  },
  {
    id: 6,
    answerId: "anorexia",
    title: "Daily Case 6",
    patient: "19-year-old woman",
    clues: [
      "A 19-year-old college student is seen after roommates noticed fainting and marked weight loss.",
      "She tracks every calorie, skips meals, and runs despite dizziness.",
      "She says she feels 'too large' even though others are worried about how thin she is.",
      "Menstrual periods have become irregular and she is cold most of the time.",
      "She fears gaining weight and becomes distressed when asked to increase intake.",
      "The core pattern is restriction leading to significantly low weight, fear of weight gain, and disturbed body experience."
    ],
    explanation:
      "The best fit is Anorexia Nervosa because the vignette emphasizes restrictive intake, significantly low weight, intense fear of weight gain, and disturbed body image.",
    differentials: ["Avoidant/Restrictive Food Intake Disorder", "Body Dysmorphic Disorder", "Major Depressive Disorder"]
  },
  {
    id: 7,
    answerId: "ptsd",
    title: "Daily Case 7",
    patient: "44-year-old paramedic",
    clues: [
      "A 44-year-old paramedic reports poor sleep and irritability after a fatal highway rescue.",
      "The person has vivid nightmares and daytime episodes of feeling back at the scene.",
      "They avoid the route where the crash occurred and refuse trauma-related assignments.",
      "They remain constantly alert, sit near exits, and startle at sudden sounds.",
      "Symptoms have lasted more than a month and have strained work and family life.",
      "The presentation follows trauma exposure with intrusion, avoidance, negative mood changes, arousal, and impairment."
    ],
    explanation:
      "The best fit is Posttraumatic Stress Disorder because trauma exposure is followed by intrusive re-experiencing, avoidance, hyperarousal, negative changes, duration, and impairment.",
    differentials: ["Acute Stress Disorder", "Adjustment Disorder", "Panic Disorder"]
  },
  {
    id: 8,
    answerId: "borderline-pd",
    title: "Daily Case 8",
    patient: "28-year-old woman",
    clues: [
      "A 28-year-old woman describes intense relationships that shift rapidly from idealization to anger.",
      "She reports chronic emptiness and panic when she thinks someone may leave.",
      "There are impulsive spending episodes and recurrent self-injury during interpersonal crises.",
      "Mood changes are rapid and reactive, often lasting hours rather than sustained episodes.",
      "She says she is unsure who she really is and often feels unreal after arguments.",
      "The long-standing pattern involves instability in relationships, self-image, affect, and impulse control."
    ],
    explanation:
      "The best fit is Borderline Personality Disorder because the case describes a pervasive pattern of unstable relationships, abandonment fears, identity disturbance, affective instability, impulsivity, and self-injury.",
    differentials: ["Bipolar II Disorder", "Posttraumatic Stress Disorder", "Histrionic Personality Disorder"]
  },
  {
    id: 9,
    answerId: "adhd",
    title: "Daily Case 9",
    patient: "15-year-old student",
    clues: [
      "A 15-year-old student is referred for unfinished assignments and disruptive restlessness.",
      "Teachers describe careless mistakes, losing materials, and difficulty sustaining attention.",
      "Parents say the pattern began in primary school and occurs at home and school.",
      "The student interrupts, fidgets, leaves the seat, and struggles to wait turns.",
      "There is no evidence that symptoms began only during a mood, psychotic, or substance-related episode.",
      "The pattern is developmentally persistent inattention plus hyperactivity-impulsivity across settings with impairment."
    ],
    explanation:
      "The best fit is Attention-Deficit/Hyperactivity Disorder because symptoms of inattention and hyperactivity-impulsivity began in childhood, occur across settings, and impair functioning.",
    differentials: ["Specific Learning Disorder", "Generalized Anxiety Disorder", "Autism Spectrum Disorder"]
  },
  {
    id: 10,
    answerId: "somatic-symptom",
    title: "Daily Case 10",
    patient: "47-year-old man",
    clues: [
      "A 47-year-old man has repeated visits for abdominal discomfort and fatigue.",
      "Evaluations find a mild chronic condition, but his level of fear and checking is much greater than expected.",
      "He spends hours researching symptoms and seeks repeated reassurance.",
      "Work is affected because he monitors bodily sensations throughout the day.",
      "The distress focuses on symptoms themselves rather than fear of having no symptoms but a hidden disease.",
      "The key feature is disproportionate thoughts, anxiety, and behaviors related to persistent somatic symptoms."
    ],
    explanation:
      "The best fit is Somatic Symptom Disorder because persistent physical symptoms are accompanied by excessive health-related thoughts, anxiety, and behaviors that impair functioning.",
    differentials: ["Illness Anxiety Disorder", "Generalized Anxiety Disorder", "Panic Disorder"]
  },
  {
    id: 11,
    answerId: "alcohol-use",
    title: "Daily Case 11",
    patient: "52-year-old man",
    clues: [
      "A 52-year-old man presents after missing work repeatedly.",
      "He intended to cut down drinking but returns to heavy evening use after stressful days.",
      "He spends weekends recovering and has stopped hobbies he previously enjoyed.",
      "His spouse reports arguments, hiding bottles, and driving after drinking.",
      "He has tremor and sweating in the morning that improve after alcohol.",
      "The pattern includes impaired control, social impairment, risky use, tolerance or withdrawal, and continued use despite harm."
    ],
    explanation:
      "The best fit is Alcohol Use Disorder because alcohol use is associated with impaired control, role impairment, risky behavior, continued use despite harm, and withdrawal-like symptoms.",
    differentials: ["Major Depressive Disorder", "Generalized Anxiety Disorder", "Stimulant Use Disorder"]
  },
  {
    id: 12,
    answerId: "autism",
    title: "Daily Case 12",
    patient: "10-year-old child",
    clues: [
      "A 10-year-old child is evaluated for social difficulties and intense distress with schedule changes.",
      "Parents report limited back-and-forth conversation and difficulty understanding peers' facial expressions.",
      "The child prefers highly specific routines and becomes upset when a route or meal changes.",
      "Interests are unusually intense and focused, with long monologues about transit maps.",
      "Early developmental history included delayed pretend play and limited peer sharing.",
      "The pattern includes persistent social communication differences plus restricted, repetitive behaviors from early development."
    ],
    explanation:
      "The best fit is Autism Spectrum Disorder because the case includes early-emerging social communication differences and restricted, repetitive patterns of behavior, interests, and routines.",
    differentials: ["Social Anxiety Disorder", "Attention-Deficit/Hyperactivity Disorder", "Social Pragmatic Communication Disorder"]
  }
];

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
  resultModal: document.getElementById("resultModal"),
  closeResult: document.getElementById("closeResult"),
  modalClose: document.getElementById("modalClose"),
  modalShare: document.getElementById("modalShare"),
  resultEyebrow: document.getElementById("resultEyebrow"),
  resultTitle: document.getElementById("resultTitle"),
  answerLine: document.getElementById("answerLine"),
  explanationBlock: document.getElementById("explanationBlock"),
  statsModal: document.getElementById("statsModal"),
  closeStats: document.getElementById("closeStats"),
  statsGrid: document.getElementById("statsGrid"),
  distribution: document.getElementById("distribution")
};

let activeCase = getTodaysCase();
let state = loadState();

function getTodaysCase() {
  const today = getLocalDate();
  const start = new Date(`${BASE_DATE}T00:00:00`);
  const current = new Date(`${today}T00:00:00`);
  const diff = Math.max(0, Math.floor((current - start) / 86400000));
  return CASES[diff % CASES.length];
}

function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function storageKey() {
  return `${STORAGE_PREFIX}:case:${getLocalDate()}:${activeCase.id}`;
}

function statsKey() {
  return `${STORAGE_PREFIX}:stats`;
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
  return DIAGNOSES.find((diagnosis) => {
    const names = [diagnosis.name, diagnosis.code, ...diagnosis.aliases];
    return names.some((name) => normalize(name) === target);
  }) || null;
}

function answerDiagnosis() {
  return DIAGNOSES.find((diagnosis) => diagnosis.id === activeCase.answerId);
}

function createInitialState() {
  return {
    caseId: activeCase.id,
    date: getLocalDate(),
    revealedClues: 1,
    guesses: [],
    completed: false,
    won: false
  };
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey()));
    if (parsed?.caseId === activeCase.id && parsed?.date === getLocalDate()) {
      return {
        ...createInitialState(),
        ...parsed,
        revealedClues: Math.max(1, Math.min(MAX_CLUES, parsed.revealedClues || 1)),
        guesses: Array.isArray(parsed.guesses) ? parsed.guesses : []
      };
    }
  } catch {
    // Ignore corrupt local state.
  }
  return createInitialState();
}

function saveState() {
  localStorage.setItem(storageKey(), JSON.stringify(state));
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
  localStorage.setItem(statsKey(), JSON.stringify(stats));
}

function completeGame(won) {
  if (state.completed) return;
  state.completed = true;
  state.won = won;
  state.revealedClues = Math.min(MAX_CLUES, Math.max(state.revealedClues, state.guesses.length || 1));
  saveState();

  const stats = loadStats();
  if (stats.lastPlayed !== state.date) {
    stats.played += 1;
    stats.lastPlayed = state.date;
    if (won) {
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
}

function submitGuess(event) {
  event.preventDefault();
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

  const answer = answerDiagnosis();
  const correct = diagnosis.id === answer.id;
  const near = !correct && diagnosis.category === answer.category;
  state.guesses.push({
    id: diagnosis.id,
    name: diagnosis.name,
    category: diagnosis.category,
    correct,
    near
  });

  if (correct) {
    completeGame(true);
    showMessage("Correct. Nice clinical reasoning.");
    openResultModal();
  } else if (state.guesses.length >= MAX_GUESSES) {
    state.revealedClues = MAX_CLUES;
    completeGame(false);
    showMessage("No more guesses. Review the explanation.");
    openResultModal();
  } else {
    state.revealedClues = Math.min(MAX_CLUES, state.revealedClues + 1);
    saveState();
    showMessage(near ? "Same diagnostic category. Getting warmer." : "Not the best fit yet. New clue revealed.");
  }

  els.guessInput.value = "";
  render();
}

function showMessage(message) {
  els.formMessage.textContent = message;
}

function render() {
  const answer = answerDiagnosis();
  const today = getLocalDate();
  els.caseMeta.textContent = `${activeCase.title} / ${today} / ${activeCase.patient}`;
  els.clueCounter.textContent = `${state.revealedClues} / ${MAX_CLUES}`;
  els.guessCounter.textContent = `${state.guesses.length} / ${MAX_GUESSES}`;
  els.resultBadge.textContent = state.completed ? (state.won ? "Solved" : "Missed") : "In progress";
  els.resultBadge.style.color = state.completed ? (state.won ? "var(--green)" : "var(--red)") : "var(--ink)";

  els.clueStack.innerHTML = activeCase.clues
    .slice(0, state.revealedClues)
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
    ? state.guesses.map((guess, index) => renderGuess(guess, index, answer)).join("")
    : "";

  els.guessInput.disabled = state.completed;
  els.guessForm.querySelector("button").disabled = state.completed;
  renderLibrary();
}

function renderGuess(guess, index, answer) {
  const status = guess.correct ? "correct" : guess.near ? "near" : "wrong";
  const mark = guess.correct ? "OK" : guess.near ? "~" : "x";
  const feedback = guess.correct
    ? "Correct diagnosis."
    : guess.near
      ? "Same DSM-5-TR diagnostic category as the answer."
      : `Different category. Answer category is not ${guess.category}.`;

  return `
    <article class="guess-card ${status}">
      <span class="guess-mark">${mark}</span>
      <div>
        <div class="guess-name">${index + 1}. ${escapeHtml(guess.name)}</div>
        <p class="guess-feedback">${escapeHtml(feedback)}</p>
      </div>
      <div class="guess-category">${escapeHtml(guess.correct ? answer.category : guess.category)}</div>
    </article>
  `;
}

function renderDiagnosisOptions() {
  els.diagnosisOptions.innerHTML = DIAGNOSES.map((diagnosis) => `
    <option value="${escapeAttr(diagnosis.name)}">${escapeHtml(diagnosis.category)}</option>
  `).join("");
}

function renderLibrary() {
  const query = normalize(els.librarySearch.value);
  const filtered = DIAGNOSES.filter((diagnosis) => {
    if (!query) return true;
    return [diagnosis.name, diagnosis.category, diagnosis.code, ...diagnosis.aliases]
      .some((value) => normalize(value).includes(query));
  }).slice(0, 80);

  els.diagnosisLibrary.innerHTML = filtered.map((diagnosis) => `
    <div class="library-item">
      <strong>${escapeHtml(diagnosis.name)}</strong>
      <span>${escapeHtml(diagnosis.category)} / ${escapeHtml(diagnosis.code)}</span>
    </div>
  `).join("");
}

function openResultModal() {
  const answer = answerDiagnosis();
  els.resultEyebrow.textContent = state.won ? "Solved" : "Answer";
  els.resultTitle.textContent = state.won
    ? `Solved in ${state.guesses.length} guess${state.guesses.length === 1 ? "" : "es"}`
    : "Better luck next case";
  els.answerLine.textContent = `${answer.name} (${answer.category})`;
  els.explanationBlock.innerHTML = `
    <div class="explanation-card">
      <p class="card-kicker">Why this fits</p>
      <p>${escapeHtml(activeCase.explanation)}</p>
    </div>
    <div class="explanation-card">
      <p class="card-kicker">Close differentials</p>
      <p>${escapeHtml(activeCase.differentials.join("; "))}</p>
    </div>
  `;
  els.resultModal.showModal();
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
      ? `${state.guesses.length}/${MAX_GUESSES}`
      : `X/${MAX_GUESSES}`
    : `${state.guesses.length}/${MAX_GUESSES}`;
  return `Psychiatry Diagnosis #${activeCase.id} ${line}\n${tiles || "_"}\n${location.origin}${location.pathname}`;
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
  if (!confirm("Reset today's saved game on this device?")) return;
  localStorage.removeItem(storageKey());
  state = createInitialState();
  showMessage("");
  render();
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

els.guessForm.addEventListener("submit", submitGuess);
els.librarySearch.addEventListener("input", renderLibrary);
els.statsButton.addEventListener("click", openStatsModal);
els.shareButton.addEventListener("click", shareResult);
els.resetButton.addEventListener("click", resetCase);
els.modalShare.addEventListener("click", shareResult);
els.closeResult.addEventListener("click", () => els.resultModal.close());
els.modalClose.addEventListener("click", () => els.resultModal.close());
els.closeStats.addEventListener("click", () => els.statsModal.close());

renderDiagnosisOptions();
render();
