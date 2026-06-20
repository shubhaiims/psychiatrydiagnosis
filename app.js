const FALLBACK_INTERVIEW = {
  id: "adult-diagnostic-template",
  title: "Adult Structured Diagnostic Interview",
  version: "0.1.0",
  status: "starter-template",
  description:
    "Original, non-proprietary starter content for a structured clinician interview.",
  sources: [
    {
      label: "WHO ICD-11 CDDR publication page",
      url: "https://www.who.int/publications/i/item/9789240077263"
    },
    {
      label: "Official SCID information, Columbia Psychiatry",
      url:
        "https://www.columbiapsychiatry.org/research/research-areas/services-policy-and-law/structured-clinical-interview-dsm-disorders-scid"
    }
  ],
  stages: [
    {
      id: "opening",
      title: "Opening",
      description: "Presenting problem, timeline, and impairment."
    },
    {
      id: "safety",
      title: "Safety",
      description: "Risk signals that require immediate clinician review."
    },
    {
      id: "mood_screen",
      title: "Mood Screen",
      description: "Depressive, manic, and mixed mood episode screen."
    },
    {
      id: "mood_detail",
      title: "Mood Detail",
      description: "Mood episode symptom clusters and exclusions."
    },
    {
      id: "psychosis",
      title: "Psychosis",
      description: "Psychotic symptoms, timing, and mood relationship."
    },
    {
      id: "anxiety_trauma",
      title: "Anxiety Trauma",
      description: "Anxiety, obsessive-compulsive, and trauma-related signals."
    },
    {
      id: "substance_medical",
      title: "Substance Medical",
      description: "Substance, medication, and medical contributors."
    },
    {
      id: "formulation",
      title: "Formulation",
      description: "Differential diagnosis and clinician synthesis."
    }
  ],
  questions: [
    {
      id: "chief_concern",
      stageId: "opening",
      type: "textarea",
      prompt: "What concern, change, or problem led to this assessment?",
      help: "Capture the patient's own words and the clinician's initial frame."
    },
    {
      id: "timeline",
      stageId: "opening",
      type: "textarea",
      prompt: "Describe the symptom timeline and major episode boundaries.",
      help: "Include onset, current episode, prior episodes, recovery periods, and treatment context."
    },
    {
      id: "global_impairment",
      stageId: "opening",
      type: "single",
      prompt: "How much have symptoms impaired work, study, relationships, self-care, or safety?",
      options: [
        { value: "none", label: "No clinically meaningful impairment" },
        { value: "mild", label: "Mild impairment" },
        { value: "moderate", label: "Moderate impairment", score: { impairment: 1 } },
        { value: "severe", label: "Severe impairment", score: { impairment: 2 } }
      ]
    },
    {
      id: "self_harm_thoughts",
      stageId: "safety",
      type: "single",
      prompt: "During the past month, has the patient had thoughts of self-harm or suicide?",
      options: [
        { value: "no", label: "No" },
        {
          value: "yes",
          label: "Yes",
          alerts: [
            {
              level: "high",
              text: "Self-harm or suicide thoughts reported. Complete local suicide risk protocol."
            }
          ],
          score: { safety: 1 }
        }
      ]
    },
    {
      id: "plan_intent",
      stageId: "safety",
      type: "single",
      prompt: "Is there current plan, intent, preparation, or inability to maintain safety?",
      visibleIf: { questionId: "self_harm_thoughts", answerEquals: "yes" },
      options: [
        { value: "no", label: "No current plan, intent, preparation, or safety failure" },
        {
          value: "yes",
          label: "Yes",
          alerts: [
            {
              level: "high",
              text: "Current plan, intent, preparation, or unsafe state requires urgent clinician action."
            }
          ],
          score: { safety: 3 }
        }
      ]
    },
    {
      id: "harm_others",
      stageId: "safety",
      type: "single",
      prompt: "Is there current violent ideation, threat, plan, or inability to avoid harming others?",
      options: [
        { value: "no", label: "No" },
        {
          value: "yes",
          label: "Yes",
          alerts: [
            {
              level: "high",
              text: "Potential violence risk reported. Follow local duty-to-protect and emergency protocols."
            }
          ],
          score: { safety: 3 }
        }
      ]
    },
    {
      id: "depressed_mood",
      stageId: "mood_screen",
      type: "single",
      prompt: "Has there been a distinct period of low, sad, empty, hopeless, or irritable mood most days?",
      options: [
        { value: "no", label: "No" },
        {
          value: "yes",
          label: "Yes",
          score: { depressiveCore: 1, depressiveTotal: 1 }
        }
      ]
    },
    {
      id: "anhedonia",
      stageId: "mood_screen",
      type: "single",
      prompt: "Has there been a distinct period of markedly reduced interest or pleasure?",
      options: [
        { value: "no", label: "No" },
        {
          value: "yes",
          label: "Yes",
          score: { depressiveCore: 1, depressiveTotal: 1 }
        }
      ]
    },
    {
      id: "depression_duration",
      stageId: "mood_screen",
      type: "single",
      prompt: "Did the depressive period last about two weeks or longer?",
      visibleIf: {
        any: [
          { questionId: "depressed_mood", answerEquals: "yes" },
          { questionId: "anhedonia", answerEquals: "yes" }
        ]
      },
      options: [
        { value: "no", label: "No" },
        { value: "yes", label: "Yes", score: { duration: 1 } }
      ]
    },
    {
      id: "elevated_irritable_mood",
      stageId: "mood_screen",
      type: "single",
      prompt: "Has there been a distinct period of unusually elevated, expansive, or persistently irritable mood?",
      options: [
        { value: "no", label: "No" },
        { value: "yes", label: "Yes", score: { maniaCore: 1 } }
      ]
    },
    {
      id: "increased_energy",
      stageId: "mood_screen",
      type: "single",
      prompt: "During that same period, was energy or activity clearly increased from baseline?",
      visibleIf: { questionId: "elevated_irritable_mood", answerEquals: "yes" },
      options: [
        { value: "no", label: "No" },
        { value: "yes", label: "Yes", score: { maniaCore: 1, maniaTotal: 1 } }
      ]
    },
    {
      id: "mood_episode_duration",
      stageId: "mood_screen",
      type: "single",
      prompt: "What was the longest duration of elevated or irritable mood with increased energy?",
      visibleIf: { questionId: "elevated_irritable_mood", answerEquals: "yes" },
      options: [
        { value: "less_4_days", label: "Less than four days" },
        { value: "four_plus_days", label: "Four days or longer", score: { hypomaniaDuration: 1 } },
        { value: "seven_plus_days", label: "One week or longer", score: { maniaDuration: 1 } },
        {
          value: "hospitalized",
          label: "Any duration with hospitalization or emergency level severity",
          score: { maniaDuration: 1, severeEpisode: 1 }
        }
      ]
    },
    {
      id: "depression_symptoms",
      stageId: "mood_detail",
      type: "multi",
      prompt: "Which symptoms accompanied the depressive period?",
      visibleIf: {
        any: [
          { questionId: "depressed_mood", answerEquals: "yes" },
          { questionId: "anhedonia", answerEquals: "yes" }
        ]
      },
      options: [
        { value: "sleep_change", label: "Clear sleep change", score: { depressiveTotal: 1 } },
        { value: "appetite_weight", label: "Appetite or weight change", score: { depressiveTotal: 1 } },
        { value: "slowed_agitated", label: "Observable slowing or agitation", score: { depressiveTotal: 1 } },
        { value: "fatigue", label: "Low energy or fatigue", score: { depressiveTotal: 1 } },
        { value: "worthlessness_guilt", label: "Worthlessness or excessive guilt", score: { depressiveTotal: 1 } },
        { value: "concentration", label: "Reduced concentration or indecision", score: { depressiveTotal: 1 } },
        {
          value: "death_thoughts",
          label: "Recurrent thoughts of death or self-harm",
          score: { depressiveTotal: 1, safety: 1 },
          alerts: [
            {
              level: "medium",
              text: "Death or self-harm content appears in depressive symptom review."
            }
          ]
        }
      ]
    },
    {
      id: "depression_exclusion",
      stageId: "mood_detail",
      type: "single",
      prompt: "Are depressive symptoms better explained by substances, medication, bereavement context, medical illness, or another condition?",
      visibleIf: {
        any: [
          { questionId: "depressed_mood", answerEquals: "yes" },
          { questionId: "anhedonia", answerEquals: "yes" }
        ]
      },
      options: [
        { value: "no", label: "No clear alternative explanation" },
        { value: "yes", label: "Yes, alternative explanation needs priority review", score: { differential: 1 } },
        { value: "unclear", label: "Unclear", score: { differential: 1 } }
      ]
    },
    {
      id: "mania_symptoms",
      stageId: "mood_detail",
      type: "multi",
      prompt: "Which symptoms accompanied elevated or irritable mood with increased energy?",
      visibleIf: { questionId: "elevated_irritable_mood", answerEquals: "yes" },
      options: [
        { value: "less_sleep", label: "Needed much less sleep", score: { maniaTotal: 1 } },
        { value: "talkative", label: "More talkative or pressured speech", score: { maniaTotal: 1 } },
        { value: "racing", label: "Racing thoughts or rapid shifts in ideas", score: { maniaTotal: 1 } },
        { value: "distractible", label: "Marked distractibility", score: { maniaTotal: 1 } },
        { value: "goal_activity", label: "Marked increase in goal-directed activity", score: { maniaTotal: 1 } },
        { value: "risky", label: "Risky or uncharacteristic activities", score: { maniaTotal: 1 } },
        { value: "grandiosity", label: "Inflated confidence or grandiose ideas", score: { maniaTotal: 1 } }
      ]
    },
    {
      id: "mania_impairment",
      stageId: "mood_detail",
      type: "single",
      prompt: "Did the elevated or irritable episode cause marked impairment, psychosis, emergency care, or hospitalization?",
      visibleIf: { questionId: "elevated_irritable_mood", answerEquals: "yes" },
      options: [
        { value: "no", label: "No" },
        { value: "yes", label: "Yes", score: { severeEpisode: 1, impairment: 2 } }
      ]
    },
    {
      id: "mania_exclusion",
      stageId: "mood_detail",
      type: "single",
      prompt: "Are elevated or irritable symptoms better explained by substances, medication, medical illness, or another condition?",
      visibleIf: { questionId: "elevated_irritable_mood", answerEquals: "yes" },
      options: [
        { value: "no", label: "No clear alternative explanation" },
        { value: "yes", label: "Yes, alternative explanation needs priority review", score: { differential: 1 } },
        { value: "unclear", label: "Unclear", score: { differential: 1 } }
      ]
    },
    {
      id: "hallucinations",
      stageId: "psychosis",
      type: "single",
      prompt: "Has the patient experienced hallucinations or perception-like experiences others did not share?",
      options: [
        { value: "no", label: "No" },
        { value: "yes", label: "Yes", score: { psychosis: 1 } }
      ]
    },
    {
      id: "delusions",
      stageId: "psychosis",
      type: "single",
      prompt: "Has the patient held fixed false beliefs or strongly unusual beliefs despite contrary evidence?",
      options: [
        { value: "no", label: "No" },
        { value: "yes", label: "Yes", score: { psychosis: 1 } }
      ]
    },
    {
      id: "disorganization",
      stageId: "psychosis",
      type: "single",
      prompt: "Has there been disorganized speech, behavior, or catatonia-level motor abnormality?",
      options: [
        { value: "no", label: "No" },
        { value: "yes", label: "Yes", score: { psychosis: 1 } }
      ]
    },
    {
      id: "psychosis_timing",
      stageId: "psychosis",
      type: "single",
      prompt: "When do psychotic symptoms occur in relation to mood episodes?",
      visibleIf: {
        any: [
          { questionId: "hallucinations", answerEquals: "yes" },
          { questionId: "delusions", answerEquals: "yes" },
          { questionId: "disorganization", answerEquals: "yes" }
        ]
      },
      options: [
        { value: "mood_only", label: "Only during mood episodes" },
        { value: "outside_mood", label: "Also outside mood episodes", score: { primaryPsychosis: 1 } },
        { value: "unclear", label: "Unclear", score: { differential: 1 } }
      ]
    },
    {
      id: "panic_attacks",
      stageId: "anxiety_trauma",
      type: "single",
      prompt: "Are there recurrent abrupt surges of intense fear or discomfort with physical symptoms?",
      options: [
        { value: "no", label: "No" },
        { value: "yes", label: "Yes", score: { anxiety: 1 } }
      ]
    },
    {
      id: "persistent_worry",
      stageId: "anxiety_trauma",
      type: "single",
      prompt: "Is there persistent excessive worry across multiple areas that is hard to control?",
      options: [
        { value: "no", label: "No" },
        { value: "yes", label: "Yes", score: { anxiety: 1 } }
      ]
    },
    {
      id: "obsessions_compulsions",
      stageId: "anxiety_trauma",
      type: "single",
      prompt: "Are there intrusive thoughts, urges, images, or repetitive behaviors performed to reduce distress?",
      options: [
        { value: "no", label: "No" },
        { value: "yes", label: "Yes", score: { ocd: 1 } }
      ]
    },
    {
      id: "trauma_reexperiencing",
      stageId: "anxiety_trauma",
      type: "single",
      prompt: "After a traumatic event, are there intrusive memories, nightmares, flashbacks, avoidance, or threat arousal?",
      options: [
        { value: "no", label: "No" },
        { value: "yes", label: "Yes", score: { trauma: 1 } }
      ]
    },
    {
      id: "substance_relation",
      stageId: "substance_medical",
      type: "single",
      prompt: "Did symptoms begin during, soon after, or in a pattern strongly linked to substance use, withdrawal, or medication exposure?",
      options: [
        { value: "no", label: "No clear substance or medication relationship" },
        { value: "yes", label: "Yes", score: { differential: 1, substance: 1 } },
        { value: "unclear", label: "Unclear", score: { differential: 1 } }
      ]
    },
    {
      id: "medical_relation",
      stageId: "substance_medical",
      type: "single",
      prompt: "Is there a medical, neurological, endocrine, sleep, pain, delirium, or cognitive condition that may explain symptoms?",
      options: [
        { value: "no", label: "No clear medical explanation" },
        { value: "yes", label: "Yes", score: { differential: 1, medical: 1 } },
        { value: "unclear", label: "Unclear", score: { differential: 1 } }
      ]
    },
    {
      id: "substance_detail",
      stageId: "substance_medical",
      type: "textarea",
      prompt: "Document substance use, medication exposure, medical findings, investigations, and temporal links.",
      visibleIf: {
        any: [
          { questionId: "substance_relation", answerNotEquals: "no" },
          { questionId: "medical_relation", answerNotEquals: "no" }
        ]
      }
    },
    {
      id: "differential_notes",
      stageId: "formulation",
      type: "textarea",
      prompt: "List leading differential diagnoses and what evidence supports or weakens each one.",
      help: "Include uncertainties, rule-outs, missing collateral, and cultural/contextual factors."
    },
    {
      id: "clinical_plan",
      stageId: "formulation",
      type: "textarea",
      prompt: "Record next steps, safety plan, collateral, rating scales, investigations, and follow-up."
    }
  ],
  rules: [
    {
      id: "urgent_safety",
      label: "Urgent safety review",
      category: "urgent",
      description:
        "Safety responses indicate need for immediate clinician review using local emergency protocols.",
      when: {
        any: [
          { questionId: "plan_intent", answerEquals: "yes" },
          { questionId: "harm_others", answerEquals: "yes" }
        ]
      }
    },
    {
      id: "depressive_episode_signal",
      label: "Depressive episode signal",
      category: "provisional",
      description:
        "Core depressive symptoms plus duration, symptom count, and impairment are present. Confirm exclusions and full licensed criteria.",
      when: {
        all: [
          { scoreAtLeast: { domain: "depressiveCore", value: 1 } },
          { scoreAtLeast: { domain: "depressiveTotal", value: 5 } },
          { questionId: "depression_duration", answerEquals: "yes" },
          { scoreAtLeast: { domain: "impairment", value: 1 } },
          { questionId: "depression_exclusion", answerEquals: "no" }
        ]
      }
    },
    {
      id: "mania_signal",
      label: "Manic episode signal",
      category: "provisional",
      description:
        "Elevated or irritable mood with increased energy, symptom burden, and manic-level duration or severity are present.",
      when: {
        all: [
          { scoreAtLeast: { domain: "maniaCore", value: 2 } },
          { scoreAtLeast: { domain: "maniaTotal", value: 3 } },
          {
            any: [
              { scoreAtLeast: { domain: "maniaDuration", value: 1 } },
              { scoreAtLeast: { domain: "severeEpisode", value: 1 } }
            ]
          },
          { questionId: "mania_exclusion", answerEquals: "no" }
        ]
      }
    },
    {
      id: "hypomania_signal",
      label: "Hypomanic episode signal",
      category: "provisional",
      description:
        "Mood elevation or irritability with increased energy, symptom burden, and shorter sustained duration are present without manic-level severity.",
      when: {
        all: [
          { scoreAtLeast: { domain: "maniaCore", value: 2 } },
          { scoreAtLeast: { domain: "maniaTotal", value: 3 } },
          { scoreAtLeast: { domain: "hypomaniaDuration", value: 1 } },
          { scoreBelow: { domain: "severeEpisode", value: 1 } },
          { questionId: "mania_exclusion", answerEquals: "no" }
        ]
      }
    },
    {
      id: "psychosis_signal",
      label: "Psychosis spectrum review",
      category: "review",
      description:
        "Psychotic symptom signals are present. Clarify mood timing, substance or medical causes, duration, and functional decline.",
      when: { scoreAtLeast: { domain: "psychosis", value: 1 } }
    },
    {
      id: "primary_psychosis_signal",
      label: "Primary psychosis consideration",
      category: "review",
      description:
        "Psychotic symptoms are reported outside mood episodes. Review primary psychotic disorders and longitudinal course.",
      when: { scoreAtLeast: { domain: "primaryPsychosis", value: 1 } }
    },
    {
      id: "anxiety_related_signal",
      label: "Anxiety, OCD, or trauma-related review",
      category: "review",
      description:
        "Anxiety, obsessive-compulsive, or trauma-related signals are present and need syndrome-level follow-up.",
      when: {
        any: [
          { scoreAtLeast: { domain: "anxiety", value: 1 } },
          { scoreAtLeast: { domain: "ocd", value: 1 } },
          { scoreAtLeast: { domain: "trauma", value: 1 } }
        ]
      }
    },
    {
      id: "substance_medical_signal",
      label: "Substance or medical contributor",
      category: "review",
      description:
        "Substance, medication, or medical contributors may explain or modify the presentation.",
      when: { scoreAtLeast: { domain: "differential", value: 1 } }
    }
  ]
};

const state = {
  interviews: [],
  interview: null,
  answers: {},
  currentIndex: 0,
  activeTab: "interview"
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  bindElements();
  attachGlobalEvents();
  loadInterviews();
});

function bindElements() {
  [
    "interviewSelect",
    "stageList",
    "progressText",
    "progressPercent",
    "progressFill",
    "interviewView",
    "findingsView",
    "dataView",
    "safetyFlags",
    "ruleSignals",
    "scoreDomains",
    "copyReport",
    "printReport",
    "resetInterview"
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function attachGlobalEvents() {
  els.interviewSelect.addEventListener("change", (event) => {
    selectInterview(event.target.value);
  });

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      render();
    });
  });

  els.copyReport.addEventListener("click", copyReport);
  els.printReport.addEventListener("click", () => {
    state.activeTab = "findings";
    render();
    window.print();
  });
  els.resetInterview.addEventListener("click", resetInterview);
}

async function loadInterviews() {
  try {
    const indexResponse = await fetch("data/interviews/index.json", {
      cache: "no-store"
    });
    if (!indexResponse.ok) {
      throw new Error("Interview index failed to load.");
    }
    const index = await indexResponse.json();
    const interviews = await Promise.all(
      index.interviews.map(async (entry) => {
        const response = await fetch(entry.file, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`${entry.file} failed to load.`);
        }
        return response.json();
      })
    );
    state.interviews = interviews;
  } catch (error) {
    console.warn(error);
    state.interviews = [FALLBACK_INTERVIEW];
  }

  const savedId = localStorage.getItem("psychiatrydiagnosis:lastInterview");
  const initial = state.interviews.find((item) => item.id === savedId) || state.interviews[0];
  selectInterview(initial.id);
}

function selectInterview(interviewId) {
  state.interview = state.interviews.find((item) => item.id === interviewId);
  state.answers = loadSavedAnswers(state.interview.id);
  state.currentIndex = 0;
  localStorage.setItem("psychiatrydiagnosis:lastInterview", state.interview.id);
  render();
}

function storageKey(interviewId) {
  return `psychiatrydiagnosis:answers:${interviewId}`;
}

function loadSavedAnswers(interviewId) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(interviewId)) || "{}");
  } catch {
    return {};
  }
}

function saveAnswers() {
  localStorage.setItem(storageKey(state.interview.id), JSON.stringify(state.answers));
}

function render() {
  if (!state.interview) {
    return;
  }

  renderInterviewSelect();
  renderTabs();
  renderStageList();
  renderProgress();
  renderInterviewView();
  renderFindingsView();
  renderDataView();
  renderClinicalState();
}

function renderInterviewSelect() {
  els.interviewSelect.innerHTML = state.interviews
    .map(
      (interview) =>
        `<option value="${escapeAttr(interview.id)}" ${
          interview.id === state.interview.id ? "selected" : ""
        }>${escapeHtml(interview.title)}</option>`
    )
    .join("");
}

function renderTabs() {
  document.querySelectorAll("[data-tab]").forEach((button) => {
    const selected = button.dataset.tab === state.activeTab;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
  });

  ["interview", "findings", "data"].forEach((tab) => {
    const panel = document.getElementById(`${tab}View`);
    panel.classList.toggle("is-active", state.activeTab === tab);
  });
}

function getVisibleQuestions() {
  return state.interview.questions.filter((question) => isConditionMet(question.visibleIf));
}

function getCurrentQuestion() {
  return getVisibleQuestions()[state.currentIndex];
}

function renderStageList() {
  const visibleQuestions = getVisibleQuestions();
  const currentQuestion = getCurrentQuestion();

  els.stageList.innerHTML = state.interview.stages
    .map((stage) => {
      const stageQuestions = visibleQuestions.filter((question) => question.stageId === stage.id);
      const answered = stageQuestions.filter((question) => isAnswered(question.id)).length;
      const isActive = currentQuestion?.stageId === stage.id;
      return `
        <button class="stage-button ${isActive ? "is-active" : ""}" data-stage="${escapeAttr(
          stage.id
        )}">
          <span>
            <span class="stage-name">${escapeHtml(stage.title)}</span>
            <span class="stage-count">${answered} of ${stageQuestions.length}</span>
          </span>
          <span class="stage-chip">${stageQuestions.length}</span>
        </button>
      `;
    })
    .join("");

  els.stageList.querySelectorAll("[data-stage]").forEach((button) => {
    button.addEventListener("click", () => {
      const visible = getVisibleQuestions();
      const index = visible.findIndex((question) => question.stageId === button.dataset.stage);
      if (index >= 0) {
        state.currentIndex = index;
        state.activeTab = "interview";
        render();
      }
    });
  });
}

function renderProgress() {
  const visibleQuestions = getVisibleQuestions();
  const completed = visibleQuestions.filter((question) => isAnswered(question.id)).length;
  const total = visibleQuestions.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  els.progressText.textContent = `${completed} of ${total}`;
  els.progressPercent.textContent = `${percent}%`;
  els.progressFill.style.width = `${percent}%`;
}

function renderInterviewView() {
  const question = getCurrentQuestion();
  const visibleQuestions = getVisibleQuestions();

  if (!question) {
    els.interviewView.innerHTML = `
      <div class="empty-state">
        No visible questions are available for this module.
      </div>
    `;
    return;
  }

  const stage = state.interview.stages.find((item) => item.id === question.stageId);
  const answer = state.answers[question.id];

  els.interviewView.innerHTML = `
    <div class="question-meta">
      <span class="pill">${escapeHtml(question.code || stage?.title || "Interview")}</span>
      <span class="pill">${escapeHtml(stage?.title || "Interview")}</span>
      <span class="pill">Question ${state.currentIndex + 1} of ${visibleQuestions.length}</span>
      ${question.source ? `<span class="pill">${escapeHtml(question.source)}</span>` : ""}
      ${question.visibleIf ? '<span class="pill warning">Branching</span>' : ""}
    </div>
    <div class="interview-grid">
      <div class="interview-main">
        <p class="module-label">${escapeHtml(stage?.description || "Semi-structured diagnostic review")}</p>
        <h2 class="question-title">${escapeHtml(question.prompt)}</h2>
        ${question.help ? `<p class="question-help">${escapeHtml(question.help)}</p>` : ""}
        ${renderQuestionProbes(question)}
        ${renderAnswerControl(question, answer)}
      </div>
      <aside class="coding-panel" aria-label="Coding guidance">
        ${renderDiagnosticTargets(question)}
        ${renderCodingAnchors(question)}
        ${
          question.clinicianNote
            ? `<div class="coding-note"><p class="card-kicker">Clinician note</p><p>${escapeHtml(
                question.clinicianNote
              )}</p></div>`
            : ""
        }
      </aside>
    </div>
    <div class="question-actions">
      <div class="question-actions-group">
        <button class="ghost-button" id="prevQuestion">Previous</button>
        <button class="primary-button" id="nextQuestion">Next</button>
      </div>
      <button class="link-button ghost-button" id="jumpFindings">View Findings</button>
    </div>
  `;

  attachQuestionEvents(question);
}

function renderQuestionProbes(question) {
  if (!question.probes?.length) {
    return "";
  }
  return `
    <section class="probe-panel" aria-label="Suggested probes">
      <p class="card-kicker">Suggested probes</p>
      <ul>
        ${question.probes.map((probe) => `<li>${escapeHtml(probe)}</li>`).join("")}
      </ul>
    </section>
  `;
}

function renderDiagnosticTargets(question) {
  if (!question.diagnosticTargets?.length) {
    return "";
  }
  return `
    <div class="coding-note">
      <p class="card-kicker">ICD-11 review target</p>
      <ul>
        ${question.diagnosticTargets
          .map((target) => `<li>${escapeHtml(target)}</li>`)
          .join("")}
      </ul>
    </div>
  `;
}

function renderCodingAnchors(question) {
  if (!question.ratingAnchors?.length) {
    return "";
  }
  return `
    <div class="coding-note">
      <p class="card-kicker">Coding anchors</p>
      <dl class="anchor-list">
        ${question.ratingAnchors
          .map(
            (anchor) => `
              <div>
                <dt>${escapeHtml(anchor.code)}</dt>
                <dd>${escapeHtml(anchor.label)}</dd>
              </div>
            `
          )
          .join("")}
      </dl>
    </div>
  `;
}

function renderAnswerControl(question, answer) {
  if (question.type === "textarea") {
    return `
      <textarea class="free-answer" data-text-answer>${escapeHtml(answer?.value || "")}</textarea>
    `;
  }

  if (question.type === "text") {
    return `
      <input class="small-answer" type="text" data-text-answer value="${escapeAttr(
        answer?.value || ""
      )}">
    `;
  }

  if (question.type === "multi") {
    const selected = new Set(Array.isArray(answer?.value) ? answer.value : []);
    return `
      <div class="choice-list">
        ${question.options
          .map(
            (option) => `
              <label class="choice">
                <input
                  type="checkbox"
                  data-option-value="${escapeAttr(option.value)}"
                  ${selected.has(option.value) ? "checked" : ""}
                >
                <span>
                  ${escapeHtml(option.label)}
                  ${option.anchor ? `<small class="choice-anchor">${escapeHtml(option.anchor)}</small>` : ""}
                </span>
              </label>
            `
          )
          .join("")}
      </div>
    `;
  }

  return `
    <div class="choice-list">
      ${question.options
        .map(
          (option) => `
            <label class="choice">
              <input
                type="radio"
                name="${escapeAttr(question.id)}"
                data-option-value="${escapeAttr(option.value)}"
                ${answer?.value === option.value ? "checked" : ""}
              >
              <span>
                ${escapeHtml(option.label)}
                ${option.anchor ? `<small class="choice-anchor">${escapeHtml(option.anchor)}</small>` : ""}
              </span>
            </label>
          `
        )
        .join("")}
    </div>
  `;
}

function attachQuestionEvents(question) {
  const textAnswer = els.interviewView.querySelector("[data-text-answer]");
  if (textAnswer) {
    textAnswer.addEventListener("input", () => {
      state.answers[question.id] = {
        value: textAnswer.value,
        label: textAnswer.value
      };
      saveAnswers();
      renderProgress();
      renderClinicalState();
      renderFindingsView();
    });
  }

  els.interviewView.querySelectorAll("[data-option-value]").forEach((input) => {
    input.addEventListener("change", () => {
      storeChoiceAnswer(question);
      reconcileCurrentIndex(question.id);
      render();
    });
  });

  document.getElementById("prevQuestion").addEventListener("click", () => {
    state.currentIndex = Math.max(0, state.currentIndex - 1);
    render();
  });

  document.getElementById("nextQuestion").addEventListener("click", () => {
    state.currentIndex = Math.min(getVisibleQuestions().length - 1, state.currentIndex + 1);
    render();
  });

  document.getElementById("jumpFindings").addEventListener("click", () => {
    state.activeTab = "findings";
    render();
  });
}

function storeChoiceAnswer(question) {
  if (question.type === "multi") {
    const values = Array.from(
      els.interviewView.querySelectorAll("[data-option-value]:checked")
    ).map((input) => input.dataset.optionValue);
    const options = question.options.filter((option) => values.includes(option.value));
    state.answers[question.id] = buildAnswer(values, options);
  } else {
    const selected = els.interviewView.querySelector("[data-option-value]:checked");
    const option = question.options.find((item) => item.value === selected?.dataset.optionValue);
    if (option) {
      state.answers[question.id] = buildAnswer(option.value, [option]);
    }
  }
  saveAnswers();
}

function buildAnswer(value, options) {
  return {
    value,
    label: options.map((option) => option.label).join("; "),
    score: mergeScores(options.map((option) => option.score || {})),
    alerts: options.flatMap((option) => option.alerts || [])
  };
}

function reconcileCurrentIndex(currentQuestionId) {
  const visible = getVisibleQuestions();
  const sameQuestionIndex = visible.findIndex((question) => question.id === currentQuestionId);
  if (sameQuestionIndex >= 0) {
    state.currentIndex = sameQuestionIndex;
  } else {
    state.currentIndex = Math.min(state.currentIndex, Math.max(visible.length - 1, 0));
  }
}

function renderFindingsView() {
  const report = buildReport();
  const answeredQuestions = getVisibleQuestions().filter((question) => isAnswered(question.id));

  els.findingsView.innerHTML = `
    <div class="findings-grid">
      <pre class="report-box">${escapeHtml(report)}</pre>
      <div>
        <h2>Answered Items</h2>
        <div class="answer-list">
          ${
            answeredQuestions.length
              ? answeredQuestions
                  .map((question) => {
                    const answer = state.answers[question.id];
                    return `
                      <div class="answer-card">
                        <p class="card-kicker">${escapeHtml(getStageTitle(question.stageId))}</p>
                        <div class="card-title">${escapeHtml(question.prompt)}</div>
                        <p class="card-body">${escapeHtml(formatAnswer(answer))}</p>
                      </div>
                    `;
                  })
                  .join("")
              : '<div class="empty-state">No answers recorded yet.</div>'
          }
        </div>
      </div>
    </div>
  `;
}

function renderDataView() {
  const schemaPreview = {
    id: "unique-interview-id",
    title: "Interview title",
    stages: [
      {
        id: "stage-id",
        title: "Stage title",
        description: "Stage purpose"
      }
    ],
    questions: [
      {
        id: "question-id",
        stageId: "stage-id",
        type: "single | multi | text | textarea",
        code: "A1",
        prompt: "Clinician-facing question",
        probes: ["Suggested follow-up probe"],
        diagnosticTargets: ["ICD-11 review target"],
        ratingAnchors: [{ code: "0", label: "Absent" }],
        visibleIf: {
          questionId: "other-question-id",
          answerEquals: "yes"
        },
        options: [
          {
            value: "yes",
            label: "Yes",
            score: { domainName: 1 },
            alerts: [{ level: "high", text: "Alert text" }]
          }
        ]
      }
    ],
    rules: [
      {
        id: "rule-id",
        label: "Signal label",
        category: "urgent | provisional | review",
        description: "Clinician summary",
        when: { scoreAtLeast: { domain: "domainName", value: 1 } }
      }
    ]
  };

  els.dataView.innerHTML = `
    <div class="data-layout">
      <pre class="code-box">${escapeHtml(JSON.stringify(state.interview, null, 2))}</pre>
      <div class="data-note">
        <h2>Data Format</h2>
        <p>
          Interview modules live in <strong>data/interviews</strong>. This module
          adapts ICD-11 CDDR concepts under CC BY-NC-SA 3.0 IGO and is not an
          official WHO, DSM, or SCID instrument.
        </p>
        ${renderSourceList()}
        <pre class="code-box">${escapeHtml(JSON.stringify(schemaPreview, null, 2))}</pre>
      </div>
    </div>
  `;
}

function renderSourceList() {
  if (!state.interview.sources?.length) {
    return "";
  }
  return `
    <div class="source-list">
      ${state.interview.sources
        .map(
          (source) => `
            <a href="${escapeAttr(source.url)}" target="_blank" rel="noreferrer">
              ${escapeHtml(source.label)}
            </a>
          `
        )
        .join("")}
    </div>
  `;
}

function renderClinicalState() {
  renderSafetyFlags();
  renderRuleSignals();
  renderScoreDomains();
}

function renderSafetyFlags() {
  const alerts = collectAlerts();
  els.safetyFlags.innerHTML = alerts.length
    ? alerts
        .map(
          (alert) => `
            <div class="alert-card ${escapeAttr(alert.level)}">
              <p class="card-kicker">${escapeHtml(alert.level)} priority</p>
              <div class="card-title">${escapeHtml(alert.stageTitle)}</div>
              <p class="card-body">${escapeHtml(alert.text)}</p>
            </div>
          `
        )
        .join("")
    : '<div class="empty-state">No safety flags recorded.</div>';
}

function renderRuleSignals() {
  const signals = evaluateRules();
  els.ruleSignals.innerHTML = signals.length
    ? signals
        .map(
          (signal) => `
            <div class="signal-card ${escapeAttr(signal.category)}">
              <p class="card-kicker">${escapeHtml(signal.category)}</p>
              <div class="card-title">${escapeHtml(signal.label)}</div>
              <p class="card-body">${escapeHtml(signal.description)}</p>
            </div>
          `
        )
        .join("")
    : '<div class="empty-state">No diagnostic signals yet.</div>';
}

function renderScoreDomains() {
  const scores = calculateScores();
  const entries = Object.entries(scores).sort(([a], [b]) => a.localeCompare(b));
  els.scoreDomains.innerHTML = entries.length
    ? entries
        .map(
          ([domain, score]) => `
            <div class="score-row">
              <span class="score-name">${escapeHtml(toTitle(domain))}</span>
              <span class="score-value">${score}</span>
            </div>
          `
        )
        .join("")
    : '<div class="empty-state">Scores appear as answers are added.</div>';
}

function collectAlerts() {
  return Object.entries(state.answers).flatMap(([questionId, answer]) => {
    const question = state.interview.questions.find((item) => item.id === questionId);
    return (answer.alerts || []).map((alert) => ({
      ...alert,
      questionId,
      stageTitle: getStageTitle(question?.stageId)
    }));
  });
}

function evaluateRules() {
  return (state.interview.rules || []).filter((rule) => isConditionMet(rule.when));
}

function calculateScores() {
  return Object.values(state.answers).reduce((scores, answer) => {
    Object.entries(answer.score || {}).forEach(([domain, value]) => {
      scores[domain] = (scores[domain] || 0) + Number(value || 0);
    });
    return scores;
  }, {});
}

function isConditionMet(condition) {
  if (!condition) {
    return true;
  }
  if (condition.all) {
    return condition.all.every(isConditionMet);
  }
  if (condition.any) {
    return condition.any.some(isConditionMet);
  }
  if (condition.scoreAtLeast) {
    const scores = calculateScores();
    return (scores[condition.scoreAtLeast.domain] || 0) >= condition.scoreAtLeast.value;
  }
  if (condition.scoreBelow) {
    const scores = calculateScores();
    return (scores[condition.scoreBelow.domain] || 0) < condition.scoreBelow.value;
  }
  if (condition.questionId) {
    const answer = state.answers[condition.questionId];
    if (!answer) {
      return false;
    }
    if (Object.hasOwn(condition, "answerEquals")) {
      return answer.value === condition.answerEquals;
    }
    if (Object.hasOwn(condition, "answerNotEquals")) {
      return answer.value !== condition.answerNotEquals;
    }
    if (Object.hasOwn(condition, "answerIncludes")) {
      return Array.isArray(answer.value) && answer.value.includes(condition.answerIncludes);
    }
  }
  return false;
}

function isAnswered(questionId) {
  const answer = state.answers[questionId];
  if (!answer) {
    return false;
  }
  if (Array.isArray(answer.value)) {
    return answer.value.length > 0;
  }
  return String(answer.value || "").trim().length > 0;
}

function buildReport() {
  const signals = evaluateRules();
  const alerts = collectAlerts();
  const scores = calculateScores();
  const visibleQuestions = getVisibleQuestions();
  const lines = [];

  lines.push(state.interview.title);
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push(
    "Source note: ICD-11 CDDR-adapted clinical interview framework; not an official WHO, DSM, or SCID instrument."
  );
  lines.push("");
  lines.push("Clinical Safety");
  if (alerts.length) {
    alerts.forEach((alert) => lines.push(`- [${alert.level}] ${alert.text}`));
  } else {
    lines.push("- No safety flags recorded in this tool.");
  }

  lines.push("");
  lines.push("Diagnostic Signals");
  if (signals.length) {
    signals.forEach((signal) =>
      lines.push(`- ${signal.label}: ${signal.description}`)
    );
  } else {
    lines.push("- No rule-based diagnostic signals yet.");
  }

  lines.push("");
  lines.push("Score Domains");
  const scoreEntries = Object.entries(scores).sort(([a], [b]) => a.localeCompare(b));
  if (scoreEntries.length) {
    scoreEntries.forEach(([domain, value]) => lines.push(`- ${toTitle(domain)}: ${value}`));
  } else {
    lines.push("- No scored responses yet.");
  }

  lines.push("");
  lines.push("Interview Responses");
  state.interview.stages.forEach((stage) => {
    const stageQuestions = visibleQuestions.filter((question) => question.stageId === stage.id);
    const answered = stageQuestions.filter((question) => isAnswered(question.id));
    if (!answered.length) {
      return;
    }
    lines.push("");
    lines.push(stage.title);
    answered.forEach((question) => {
      lines.push(`- ${question.prompt}`);
      lines.push(`  ${formatAnswer(state.answers[question.id])}`);
    });
  });

  lines.push("");
  lines.push(
    "Note: This summary supports clinician assessment and requires confirmation against licensed diagnostic criteria and local clinical protocols."
  );

  return lines.join("\n");
}

async function copyReport() {
  const report = buildReport();
  try {
    await navigator.clipboard.writeText(report);
    els.copyReport.textContent = "Copied";
    setTimeout(() => {
      els.copyReport.textContent = "Copy";
    }, 1200);
  } catch {
    state.activeTab = "findings";
    render();
  }
}

function resetInterview() {
  const ok = window.confirm("Clear saved responses for this interview?");
  if (!ok) {
    return;
  }
  state.answers = {};
  state.currentIndex = 0;
  localStorage.removeItem(storageKey(state.interview.id));
  render();
}

function getStageTitle(stageId) {
  return state.interview.stages.find((stage) => stage.id === stageId)?.title || "Interview";
}

function formatAnswer(answer) {
  if (!answer) {
    return "";
  }
  if (Array.isArray(answer.value)) {
    return answer.label || answer.value.join("; ");
  }
  return answer.label || answer.value || "";
}

function mergeScores(scoreList) {
  return scoreList.reduce((merged, score) => {
    Object.entries(score).forEach(([domain, value]) => {
      merged[domain] = (merged[domain] || 0) + Number(value || 0);
    });
    return merged;
  }, {});
}

function toTitle(value) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
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
