import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_COUNT = 1200;
const SEED = 20260622;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_NOTE = "Original educational DSM-5-TR-aligned summary. This is not verbatim DSM text, not clinically validated, and not medical advice.";

const profiles = [
  {
    id: "mdd",
    code: "F33.1",
    name: "Major Depressive Disorder",
    category: "Depressive Disorders",
    aliases: ["depression", "major depression", "mdd"],
    baseDifficulty: 2,
    patients: ["29-year-old teacher", "41-year-old accountant", "17-year-old student", "63-year-old retired nurse"],
    openings: ["reports low energy and trouble keeping up with usual responsibilities", "is brought in after weeks of social withdrawal and missed obligations", "describes feeling slowed down and unable to enjoy previous routines"],
    course: ["Symptoms have clustered for more than two weeks rather than appearing as brief mood shifts.", "Sleep, appetite, concentration, and self-worth have changed in the same period.", "The presentation is episodic and represents a clear change from previous functioning."],
    context: ["There is no history of a manic or hypomanic episode.", "Alcohol, stimulants, bereavement alone, and thyroid disease do not better explain the syndrome.", "The person can identify a period before the episode when mood, interest, and energy were much better."],
    core: ["Most days include depressed mood or marked loss of interest, plus guilt, fatigue, and poor concentration.", "Family notes slowed speech, diminished pleasure, and difficulty making decisions.", "The person reports feeling worthless and has passive thoughts that life is not worth much, without psychotic symptoms."],
    differentiator: ["Symptoms are not limited to anxiety about one topic, traumatic reminders, or chronic personality traits.", "The episode is more time-limited and symptom-dense than a lifelong low mood pattern.", "The key clinical weight is an affective episode with neurovegetative and cognitive changes."],
    anchor: ["The best-fitting diagnosis centers on a major depressive episode with distress or impairment and no manic history.", "The final clue is a sustained depressive episode with impaired functioning and no substance or bipolar explanation.", "The syndrome is best understood as a unipolar depressive episode rather than a primary anxiety, trauma, or psychotic disorder."],
    explanation: "The case points to Major Depressive Disorder because it describes a sustained depressive episode with mood or interest change, neurovegetative and cognitive symptoms, impairment, and no better manic, substance, or medical explanation.",
    differentials: ["Persistent Depressive Disorder", "Bipolar II Disorder", "Adjustment Disorder"],
    criteriaGuide: [
      "Look for a distinct depressive episode lasting at least two weeks with depressed mood or loss of interest as a central feature.",
      "Supportive symptoms commonly include sleep or appetite change, low energy, guilt or worthlessness, slowed or agitated movement, poor concentration, and thoughts of death.",
      "The episode should cause clinically important distress or impairment.",
      "Substances, medical causes, bereavement alone, and other primary disorders should not better explain the presentation.",
      "A past manic or hypomanic episode moves the diagnosis toward a bipolar disorder."
    ],
    premiumDifferentials: [
      { name: "Persistent Depressive Disorder", distinguishingFeatures: "Chronic depressed mood is present for years, often with fewer episode-like peaks, while major depression is a discrete symptom-dense episode." },
      { name: "Bipolar II Disorder", distinguishingFeatures: "A history of hypomanic episodes changes the diagnosis even when the current presentation is depressive." },
      { name: "Adjustment Disorder", distinguishingFeatures: "Mood symptoms follow a stressor but do not meet the full syndrome, duration, or severity expected in a major depressive episode." }
    ],
    howToDifferentiate: [
      "Ask for any lifetime period of elevated or irritable mood with increased energy before calling it unipolar depression.",
      "Establish whether the low mood is episodic or a long-standing baseline pattern.",
      "Screen for substances, endocrine disease, grief-focused yearning, psychosis, and trauma-specific symptoms."
    ]
  },
  {
    id: "persistent-depressive",
    code: "F34.1",
    name: "Persistent Depressive Disorder",
    category: "Depressive Disorders",
    aliases: ["dysthymia", "persistent depression"],
    baseDifficulty: 3,
    patients: ["38-year-old librarian", "54-year-old store manager", "22-year-old graduate student", "67-year-old widower"],
    openings: ["says low mood has felt like the default setting for years", "presents with chronic pessimism, fatigue, and low self-confidence", "reports never feeling fully well between periods of worse depression"],
    course: ["The pattern has persisted for more than two years in adulthood.", "There have not been symptom-free stretches longer than a couple of months.", "Symptoms are less explosive than an acute episode but have become woven into daily life."],
    context: ["The person continues working but describes constant low energy, poor sleep, and hopelessness.", "Friends say the mood problem predates the latest stressor by years.", "There is no history of mania or hypomania."],
    core: ["The chronic mood state is accompanied by low appetite or overeating, poor sleep, fatigue, low self-esteem, and impaired concentration.", "The person describes being functional but persistently joyless and self-critical.", "The mood problem is long-term rather than confined to a recent two-week episode."],
    differentiator: ["Major depressive episodes may occur on top of the chronic pattern, but the long baseline course is the clue.", "Symptoms are not better explained by a personality disorder, substance use, or bipolar spectrum condition.", "The core issue is duration and persistence of depressed mood."],
    anchor: ["The best-fitting diagnosis is a chronic depressive disorder lasting years with ongoing impairment.", "The final clue is depressed mood most days across years, with low self-esteem, sleep problems, and hopelessness.", "The case favors a persistent depressive pattern rather than a single isolated depressive episode."],
    explanation: "The case points to Persistent Depressive Disorder because depressed mood and associated symptoms have persisted most of the time for years, with few or no sustained symptom-free intervals.",
    differentials: ["Major Depressive Disorder", "Bipolar II Disorder", "Avoidant Personality Disorder"],
    criteriaGuide: [
      "The central pattern is chronically depressed mood for years, with a shorter duration threshold in children and adolescents.",
      "Associated symptoms can include appetite or sleep disturbance, low energy, low self-esteem, poor concentration, and hopelessness.",
      "Symptoms should be present more days than not and not disappear for long symptom-free stretches.",
      "The pattern must cause distress or impairment and should not be due to substances, medical illness, or bipolar disorder.",
      "Major depressive episodes can coexist, but the persistent low mood course remains the organizing feature."
    ],
    premiumDifferentials: [
      { name: "Major Depressive Disorder", distinguishingFeatures: "Major depression is usually an episode; persistent depressive disorder is defined by chronicity over years." },
      { name: "Bipolar II Disorder", distinguishingFeatures: "Past hypomania rules against a purely unipolar chronic depressive diagnosis." },
      { name: "Avoidant Personality Disorder", distinguishingFeatures: "Avoidant personality centers on pervasive social inhibition and rejection sensitivity rather than chronic depressed mood itself." }
    ],
    howToDifferentiate: [
      "Map the timeline carefully: years of low mood support persistent depressive disorder.",
      "Ask whether there were two-month stretches of normal mood.",
      "Assess for superimposed major depressive episodes without losing sight of the chronic baseline."
    ]
  },
  {
    id: "bipolar-i",
    code: "F31.1",
    name: "Bipolar I Disorder",
    category: "Bipolar and Related Disorders",
    aliases: ["bipolar 1", "bipolar disorder type i", "mania"],
    baseDifficulty: 2,
    patients: ["31-year-old entrepreneur", "24-year-old musician", "46-year-old parent", "19-year-old college student"],
    openings: ["is brought in after several nights with almost no sleep and escalating plans", "arrives speaking rapidly about a new mission that cannot wait", "has become unusually energetic, irritable, and hard to interrupt"],
    course: ["The change has lasted long enough to disrupt work, family, and safety.", "Energy is increased rather than simply mood being happy.", "The episode is clearly different from the person's baseline."],
    context: ["Spending, sexual risk, driving, or business decisions have become reckless.", "Family reports pressured speech, grandiosity, distractibility, and reduced need for sleep.", "Psychotic intensity or hospitalization has become part of the episode."],
    core: ["The person feels unusually powerful and says sleep is unnecessary.", "Ideas shift quickly, speech is pressured, and judgment is markedly impaired.", "Irritability escalates when others challenge grand plans."],
    differentiator: ["The severity exceeds hypomania because impairment, danger, hospitalization, or psychosis is present.", "The symptoms are not better explained by stimulant intoxication or a primary psychotic disorder.", "A major depressive episode is common but is not required for the diagnosis."],
    anchor: ["The best-fitting diagnosis requires at least one manic episode.", "The final clue is mania with increased energy, decreased need for sleep, grandiosity, risk, and marked impairment.", "The episode crosses the threshold from hypomania into mania."],
    explanation: "The case points to Bipolar I Disorder because it describes a manic episode with increased energy, decreased need for sleep, grandiosity, pressured speech, risky behavior, and marked impairment or psychosis.",
    differentials: ["Bipolar II Disorder", "Schizoaffective Disorder", "Stimulant Use Disorder"],
    criteriaGuide: [
      "At least one manic episode is the key requirement.",
      "Mania involves elevated, expansive, or irritable mood plus increased energy or activity.",
      "Typical associated signs include decreased need for sleep, grandiosity, pressured speech, racing thoughts, distractibility, increased goal-directed activity, and risky behavior.",
      "The episode is severe enough to cause marked impairment, hospitalization, psychosis, or serious danger.",
      "Substances, medications, and medical causes should be evaluated before assigning the diagnosis."
    ],
    premiumDifferentials: [
      { name: "Bipolar II Disorder", distinguishingFeatures: "Bipolar II has hypomania, not full mania. Psychosis or hospitalization during elevated mood indicates mania." },
      { name: "Schizoaffective Disorder", distinguishingFeatures: "Schizoaffective disorder includes psychosis outside mood episodes and mood episodes across much of the illness." },
      { name: "Stimulant Use Disorder", distinguishingFeatures: "Stimulant intoxication can mimic mania, so timing with substance use and toxicology matter." }
    ],
    howToDifferentiate: [
      "Confirm decreased need for sleep rather than insomnia with fatigue.",
      "Ask collateral informants about baseline change, risk, spending, and hospitalization.",
      "Separate mood-congruent psychosis during mania from persistent psychosis outside mood episodes."
    ]
  },
  {
    id: "bipolar-ii",
    code: "F31.81",
    name: "Bipolar II Disorder",
    category: "Bipolar and Related Disorders",
    aliases: ["bipolar 2", "bp ii", "hypomania"],
    baseDifficulty: 4,
    patients: ["34-year-old designer", "27-year-old resident physician", "49-year-old sales lead", "21-year-old athlete"],
    openings: ["presents with a current depressive episode but mentions bursts of unusually high productivity", "reports recurrent depression and occasional weeks of feeling unusually driven", "describes depressive lows interrupted by briefer periods of increased confidence and energy"],
    course: ["The elevated periods last several days and are noticeable to others.", "During high-energy periods, sleep need drops and plans multiply.", "The elevated periods do not cause hospitalization or psychosis."],
    context: ["Friends describe the person as more talkative, social, impulsive, and distractible during these spells.", "The person remembers starting multiple projects and spending more than usual.", "The depressive episodes create the greater functional burden."],
    core: ["The hypomanic periods are clear departures from baseline but do not become full mania.", "There is a history of major depressive episodes.", "The person may initially experience the elevated periods as useful rather than distressing."],
    differentiator: ["A single past manic episode would change the answer to Bipolar I Disorder.", "Rapid mood shifts lasting hours point more toward personality dynamics than hypomanic episodes.", "Antidepressant activation should be distinguished from spontaneous hypomania."],
    anchor: ["The best-fitting diagnosis combines major depression with hypomanic episodes and no history of mania.", "The final clue is hypomania plus major depressive episodes, without psychosis or hospitalization during elevation.", "The case favors Bipolar II Disorder because the elevated mood never reaches full manic severity."],
    explanation: "The case points to Bipolar II Disorder because it combines major depressive episodes with hypomanic periods that are observable and episodic but not severe enough to qualify as mania.",
    differentials: ["Major Depressive Disorder", "Bipolar I Disorder", "Borderline Personality Disorder"],
    criteriaGuide: [
      "The pattern requires at least one hypomanic episode and at least one major depressive episode.",
      "Hypomania includes elevated or irritable mood with increased energy and observable behavioral change.",
      "Hypomanic symptoms last for several days and include features such as reduced sleep need, talkativeness, racing thoughts, distractibility, goal-directed activity, or risk-taking.",
      "Hypomania is not severe enough to cause marked impairment, hospitalization, or psychosis.",
      "A lifetime manic episode changes the diagnosis to Bipolar I Disorder."
    ],
    premiumDifferentials: [
      { name: "Major Depressive Disorder", distinguishingFeatures: "Major depression lacks spontaneous hypomanic episodes." },
      { name: "Bipolar I Disorder", distinguishingFeatures: "Any manic episode, including psychosis during elevation, supports Bipolar I rather than Bipolar II." },
      { name: "Borderline Personality Disorder", distinguishingFeatures: "Borderline mood shifts are often rapid and interpersonal; hypomania is episodic, sustained for days, and includes increased energy." }
    ],
    howToDifferentiate: [
      "Use timeline interviews to distinguish days-long hypomania from hour-to-hour reactivity.",
      "Ask about decreased need for sleep with preserved energy.",
      "Check whether elevated episodes caused psychosis, hospitalization, or dangerous impairment."
    ]
  },
  {
    id: "cyclothymic",
    code: "F34.0",
    name: "Cyclothymic Disorder",
    category: "Bipolar and Related Disorders",
    aliases: ["cyclothymia"],
    baseDifficulty: 5,
    patients: ["32-year-old freelancer", "28-year-old chef", "45-year-old consultant", "20-year-old student"],
    openings: ["describes years of alternating emotional highs and lows that never fully meet episode thresholds", "reports being seen as unpredictable, energetic for stretches, then low and withdrawn", "seeks help because mood instability has become a long-term pattern"],
    course: ["The pattern has lasted for years with many periods of hypomanic symptoms and depressive symptoms.", "Neither the high nor low periods clearly meet full criteria for hypomanic, manic, or major depressive episodes.", "Symptoms are present much of the time and create relationship and work problems."],
    context: ["There are no psychotic symptoms and no history of hospitalization for mood elevation.", "The person says the shifts are more chronic than episodic major depression.", "Substance use and medical causes do not explain the pattern."],
    core: ["At times the person sleeps less, talks more, and takes on projects; at other times motivation and self-esteem drop.", "The highs and lows are subthreshold but recurrent.", "Others notice cycles of activation and discouragement."],
    differentiator: ["A full manic episode would indicate Bipolar I Disorder.", "A full hypomanic episode plus major depression would indicate Bipolar II Disorder.", "The diagnosis depends on chronic subthreshold cycling."],
    anchor: ["The best-fitting diagnosis is a chronic bipolar-spectrum pattern below full mood episode thresholds.", "The final clue is years of alternating hypomanic and depressive symptoms without full manic, hypomanic, or major depressive episodes.", "The case is tougher because it sits below the threshold for Bipolar I or II."],
    explanation: "The case points to Cyclothymic Disorder because it describes a chronic pattern of fluctuating hypomanic and depressive symptoms that do not meet full episode criteria.",
    differentials: ["Bipolar II Disorder", "Borderline Personality Disorder", "Persistent Depressive Disorder"],
    criteriaGuide: [
      "The central pattern is long-term fluctuation between hypomanic symptoms and depressive symptoms.",
      "The symptoms are numerous and persistent but do not meet full criteria for manic, hypomanic, or major depressive episodes.",
      "The pattern should last years in adults, with a shorter threshold in children and adolescents.",
      "Symptoms cause distress or impairment and are not better explained by substances, medical conditions, or another disorder.",
      "If a full manic, hypomanic, or major depressive episode appears, reconsider the diagnosis."
    ],
    premiumDifferentials: [
      { name: "Bipolar II Disorder", distinguishingFeatures: "Bipolar II requires a clear hypomanic episode and a major depressive episode; cyclothymia remains subthreshold." },
      { name: "Borderline Personality Disorder", distinguishingFeatures: "Borderline symptoms are often interpersonal and identity-based, while cyclothymia is a chronic mood-cycling pattern." },
      { name: "Persistent Depressive Disorder", distinguishingFeatures: "Persistent depressive disorder does not include recurring hypomanic symptom periods." }
    ],
    howToDifferentiate: [
      "Build a multi-year mood chart rather than relying on a single visit.",
      "Check whether highs or lows ever met full episode thresholds.",
      "Separate trait-like interpersonal instability from rhythmic mood activation and low mood."
    ]
  },
  {
    id: "gad",
    code: "F41.1",
    name: "Generalized Anxiety Disorder",
    category: "Anxiety Disorders",
    aliases: ["gad", "generalised anxiety disorder", "generalized anxiety"],
    baseDifficulty: 2,
    patients: ["36-year-old engineer", "52-year-old school administrator", "18-year-old student", "44-year-old parent"],
    openings: ["reports constant worry that moves from one topic to another", "presents with muscle tension, poor sleep, and difficulty controlling worry", "says the mind rarely turns off even when problems are minor"],
    course: ["The worry has been present for months and spans health, money, work, family, and small decisions.", "Reassurance helps briefly but the worry quickly shifts to another topic.", "The person feels restless, fatigued, irritable, and unable to concentrate."],
    context: ["There are no recurrent unexpected panic attacks as the main problem.", "The anxiety is not limited to scrutiny, contamination, trauma reminders, or a single phobic object.", "Medical causes and stimulant use have been considered."],
    core: ["The person describes excessive worry that is hard to control.", "Somatic tension, sleep disturbance, and keyed-up feelings accompany the worry.", "Avoidance and reassurance-seeking are spreading across daily life."],
    differentiator: ["The breadth of worry distinguishes it from phobias and social anxiety.", "The time course distinguishes it from brief stress reactions.", "The main symptom is worry, not obsessions, panic surges, or traumatic re-experiencing."],
    anchor: ["The best-fitting diagnosis is chronic excessive worry across many domains with physical tension and impairment.", "The final clue is difficult-to-control worry more days than not, across multiple topics.", "The case favors a generalized anxiety pattern rather than a circumscribed fear disorder."],
    explanation: "The case points to Generalized Anxiety Disorder because worry is excessive, hard to control, broad in focus, persistent, and associated with tension, sleep disturbance, and impairment.",
    differentials: ["Panic Disorder", "Social Anxiety Disorder", "Obsessive-Compulsive Disorder"],
    criteriaGuide: [
      "The core feature is excessive anxiety and worry across several areas of life.",
      "The worry is difficult to control and persists over time.",
      "Common associated symptoms include restlessness, fatigue, poor concentration, irritability, muscle tension, and sleep disturbance.",
      "The worry causes distress or impairment.",
      "The anxiety is not better explained by panic attacks, social scrutiny, obsessions, trauma reminders, substances, or medical causes."
    ],
    premiumDifferentials: [
      { name: "Panic Disorder", distinguishingFeatures: "Panic disorder centers on recurrent unexpected panic attacks and worry about more attacks, not broad everyday worry." },
      { name: "Social Anxiety Disorder", distinguishingFeatures: "Social anxiety is mainly fear of scrutiny or negative evaluation." },
      { name: "Obsessive-Compulsive Disorder", distinguishingFeatures: "OCD includes intrusive obsessions and compulsions; GAD worry is usually about real-life concerns." }
    ],
    howToDifferentiate: [
      "Ask whether worry is broad or tied to one feared situation.",
      "Clarify whether thoughts feel like everyday concerns or intrusive obsessions.",
      "Assess duration, controllability, and physical tension."
    ]
  },
  {
    id: "panic",
    code: "F41.0",
    name: "Panic Disorder",
    category: "Anxiety Disorders",
    aliases: ["panic attacks", "panic disorder"],
    baseDifficulty: 3,
    patients: ["39-year-old teacher", "25-year-old software tester", "57-year-old driver", "33-year-old nurse"],
    openings: ["fears another sudden episode of intense physical terror", "reports repeated abrupt surges of fear that peak within minutes", "has started avoiding activities that might trigger racing heart sensations"],
    course: ["Episodes include palpitations, trembling, chest tightness, dizziness, and fear of dying or losing control.", "Some attacks occur unexpectedly rather than only in a specific feared situation.", "For weeks afterward the person worries about more attacks and changes behavior."],
    context: ["Cardiac and endocrine evaluations do not explain the episodes.", "Avoidance now includes exercise, caffeine, driving, or being alone.", "The fear is of the panic sensations and consequences, not one object or social judgment."],
    core: ["The attacks are abrupt, intense, and time-limited.", "Anticipatory anxiety about future attacks has become disabling.", "The person monitors the body closely for sensations that might mean another attack is starting."],
    differentiator: ["If attacks occur only with one phobic cue, a phobia may be primary.", "If avoidance is mainly about being unable to escape, agoraphobia may be comorbid or primary.", "The key is recurrent unexpected attacks plus persistent concern or maladaptive behavior."],
    anchor: ["The best-fitting diagnosis is recurrent unexpected panic attacks followed by worry or behavioral change.", "The final clue is panic surges peaking within minutes plus ongoing fear of recurrence.", "The case is not simply stress because the attacks are abrupt, recurrent, and followed by avoidance."],
    explanation: "The case points to Panic Disorder because recurrent unexpected panic attacks are followed by persistent concern about attacks and avoidance of internal cues or situations.",
    differentials: ["Agoraphobia", "Specific Phobia", "Illness Anxiety Disorder"],
    criteriaGuide: [
      "The central feature is recurrent unexpected panic attacks.",
      "Panic attacks are abrupt surges of intense fear or discomfort with prominent physical and cognitive symptoms.",
      "After attacks, the person has persistent concern about more attacks or changes behavior to avoid them.",
      "The symptoms should not be better explained by substances, medical illness, or another anxiety disorder.",
      "Situationally bound attacks can occur, but unexpected attacks are important for the diagnosis."
    ],
    premiumDifferentials: [
      { name: "Agoraphobia", distinguishingFeatures: "Agoraphobia centers on feared difficulty escaping or getting help in certain situations; panic disorder centers on unexpected panic attacks." },
      { name: "Specific Phobia", distinguishingFeatures: "Specific phobia attacks are tied to a specific object or situation." },
      { name: "Illness Anxiety Disorder", distinguishingFeatures: "Illness anxiety involves fear of having a disease, not primarily fear of recurrent panic surges." }
    ],
    howToDifferentiate: [
      "Ask whether attacks happen out of the blue.",
      "Identify what the patient fears after the attack: another panic attack, a disease, social humiliation, or inability to escape.",
      "Rule out arrhythmia, thyroid disease, substances, and medication effects."
    ]
  },
  {
    id: "social-anxiety",
    code: "F40.10",
    name: "Social Anxiety Disorder",
    category: "Anxiety Disorders",
    aliases: ["social phobia", "performance anxiety"],
    baseDifficulty: 3,
    patients: ["16-year-old student", "30-year-old attorney", "42-year-old chef", "23-year-old graduate trainee"],
    openings: ["avoids situations where others might notice embarrassment", "reports intense fear of being judged during conversations or performance", "has turned down opportunities because of scrutiny fears"],
    course: ["The fear has persisted for months and is out of proportion to the actual social threat.", "The person worries about blushing, shaking, sounding foolish, or being rejected.", "Avoidance has affected school, work, dating, or presentations."],
    context: ["Panic symptoms can occur, but they are tied to social evaluation.", "The fear is not limited to body image concerns, trauma reminders, or autism-related social communication differences.", "The person recognizes that the feared judgment is excessive but feels unable to control the anxiety."],
    core: ["Social or performance situations reliably trigger anxiety.", "Anticipatory worry starts days before events.", "The person uses safety behaviors such as rehearsing, avoiding eye contact, or speaking as little as possible."],
    differentiator: ["The main fear is negative evaluation rather than broad worry or panic itself.", "Avoidance is socially focused rather than based on escape difficulty.", "Symptoms are not simply introversion because they cause distress and impairment."],
    anchor: ["The best-fitting diagnosis is persistent fear of social evaluation with avoidance and impairment.", "The final clue is anxiety about scrutiny, embarrassment, and negative judgment across social situations.", "The case favors Social Anxiety Disorder because social evaluation is the organizing fear."],
    explanation: "The case points to Social Anxiety Disorder because anxiety and avoidance center on possible negative evaluation in social or performance situations, causing impairment.",
    differentials: ["Generalized Anxiety Disorder", "Panic Disorder", "Autism Spectrum Disorder"],
    criteriaGuide: [
      "The key fear is social scrutiny or negative evaluation.",
      "Social or performance situations reliably provoke anxiety and are avoided or endured with distress.",
      "The fear is persistent and out of proportion to the actual threat.",
      "Symptoms cause impairment in school, work, relationships, or other roles.",
      "Consider whether autism, body dysmorphic concerns, panic disorder, or medical conditions better explain the avoidance."
    ],
    premiumDifferentials: [
      { name: "Generalized Anxiety Disorder", distinguishingFeatures: "GAD worry is broad across many domains, while social anxiety is focused on evaluation." },
      { name: "Panic Disorder", distinguishingFeatures: "Panic disorder involves unexpected attacks; social anxiety attacks are cued by scrutiny." },
      { name: "Autism Spectrum Disorder", distinguishingFeatures: "Autism includes early social communication differences and restricted patterns, not only fear of judgment." }
    ],
    howToDifferentiate: [
      "Ask what would be catastrophic: embarrassment, panic symptoms, rejection, or inability to escape.",
      "Check whether social difficulty began as skill differences in early development.",
      "Look for avoidance patterns across conversations, eating in public, presentations, and dating."
    ]
  },
  {
    id: "ocd",
    code: "F42",
    name: "Obsessive-Compulsive Disorder",
    category: "Obsessive-Compulsive and Related Disorders",
    aliases: ["ocd", "obsessive compulsive disorder"],
    baseDifficulty: 3,
    patients: ["26-year-old medical student", "48-year-old pharmacist", "35-year-old parent", "19-year-old trainee"],
    openings: ["arrives late because rituals take hours each morning", "describes intrusive thoughts that feel unwanted and distressing", "reports repetitive checking, washing, or mental rituals"],
    course: ["The rituals temporarily reduce anxiety but the relief fades quickly.", "The thoughts are ego-dystonic or resisted rather than welcomed.", "The pattern consumes significant time and interferes with school, work, or relationships."],
    context: ["The concern is not limited to appearance, hoarding, illness anxiety, or ordinary worry.", "Insight may vary, but the person is distressed by the cycle.", "There is no substance or psychotic disorder that better explains the repetitive behavior."],
    core: ["Obsessions include contamination, harm, symmetry, taboo thoughts, or fear of mistakes.", "Compulsions include checking, washing, counting, ordering, reassurance-seeking, or mental reviewing.", "Avoidance grows around triggers that set off obsessions."],
    differentiator: ["Compulsions are performed to neutralize obsessional anxiety, not for pleasure.", "Delusions are fixed beliefs; OCD thoughts are intrusive and repetitive even when insight is poor.", "The time-consuming ritual cycle is the diagnostic center."],
    anchor: ["The best-fitting diagnosis is obsessions plus compulsions that are distressing, time-consuming, or impairing.", "The final clue is unwanted intrusive thoughts and repetitive rituals aimed at neutralizing anxiety.", "The case favors OCD rather than generalized worry because of the ritualized neutralizing behaviors."],
    explanation: "The case points to Obsessive-Compulsive Disorder because intrusive obsessions lead to repetitive compulsions or mental acts that are time-consuming and impairing.",
    differentials: ["Generalized Anxiety Disorder", "Body Dysmorphic Disorder", "Illness Anxiety Disorder"],
    criteriaGuide: [
      "Obsessions are intrusive, unwanted thoughts, urges, or images that cause anxiety or distress.",
      "Compulsions are repetitive behaviors or mental acts performed to reduce distress or prevent a feared outcome.",
      "The obsessions or compulsions are time-consuming or cause impairment.",
      "Symptoms should not be better explained by substances, medical illness, or another disorder with a narrower focus.",
      "Insight can range from good to absent, but the obsession-compulsion cycle remains central."
    ],
    premiumDifferentials: [
      { name: "Generalized Anxiety Disorder", distinguishingFeatures: "GAD worry is about real-life concerns and lacks ritualized compulsions." },
      { name: "Body Dysmorphic Disorder", distinguishingFeatures: "BDD focuses on perceived appearance defects with checking or camouflaging." },
      { name: "Illness Anxiety Disorder", distinguishingFeatures: "Illness anxiety centers on fear of disease rather than diverse obsessions and compulsions." }
    ],
    howToDifferentiate: [
      "Ask what happens if the ritual is prevented.",
      "Identify whether the repeated act is neutralizing an intrusive thought.",
      "Clarify the content focus: contamination, harm, symmetry, appearance, health, or hoarding."
    ]
  },
  {
    id: "body-dysmorphic",
    code: "F45.22",
    name: "Body Dysmorphic Disorder",
    category: "Obsessive-Compulsive and Related Disorders",
    aliases: ["bdd", "body dysmorphia"],
    baseDifficulty: 4,
    patients: ["24-year-old model", "37-year-old office worker", "19-year-old student", "51-year-old trainer"],
    openings: ["spends hours focused on a perceived flaw others barely notice", "avoids mirrors and photos because of distress about appearance", "seeks repeated reassurance and cosmetic opinions about one body area"],
    course: ["The concern is repetitive, intrusive, and hard to resist.", "Checking, grooming, comparing, camouflaging, or reassurance-seeking takes substantial time.", "Work, school, dating, or leaving home is impaired."],
    context: ["The concern is not primarily about body weight or fatness.", "Insight varies, but the person is preoccupied with perceived appearance defects.", "Medical examination does not match the intensity of the concern."],
    core: ["The person repeatedly checks mirrors, searches online procedures, or compares features with others.", "Social avoidance comes from fear that others will notice the perceived defect.", "The preoccupation is narrow and appearance-focused."],
    differentiator: ["Eating disorders center on weight or shape concerns with eating behavior disturbance.", "OCD can include appearance obsessions, but BDD is specifically about perceived defects.", "Delusional intensity can occur, but the diagnosis remains BDD when the theme is appearance."],
    anchor: ["The best-fitting diagnosis is an appearance preoccupation with repetitive behaviors and impairment.", "The final clue is distress over a perceived physical flaw with checking, comparing, and camouflaging.", "The case favors Body Dysmorphic Disorder rather than social anxiety because appearance preoccupation drives the avoidance."],
    explanation: "The case points to Body Dysmorphic Disorder because the person is preoccupied with perceived appearance defects and performs repetitive checking, comparing, or camouflaging behaviors.",
    differentials: ["Obsessive-Compulsive Disorder", "Social Anxiety Disorder", "Anorexia Nervosa"],
    criteriaGuide: [
      "The central feature is preoccupation with perceived appearance defects that are not observable or appear slight to others.",
      "Repetitive behaviors or mental acts occur, such as checking, comparing, grooming, camouflaging, or reassurance-seeking.",
      "The preoccupation causes distress or impairment.",
      "If concerns focus primarily on weight or body fat in the context of eating disturbance, consider an eating disorder.",
      "Insight can vary, including delusional-level conviction."
    ],
    premiumDifferentials: [
      { name: "Obsessive-Compulsive Disorder", distinguishingFeatures: "OCD has broader obsessional themes; BDD is organized around perceived appearance flaws." },
      { name: "Social Anxiety Disorder", distinguishingFeatures: "Social anxiety focuses on evaluation generally; BDD focuses on being seen as defective." },
      { name: "Anorexia Nervosa", distinguishingFeatures: "Anorexia centers on low weight, restriction, and fear of weight gain rather than one perceived defect." }
    ],
    howToDifferentiate: [
      "Ask whether the main concern is a specific perceived flaw or general negative evaluation.",
      "Screen for restriction, low weight, bingeing, purging, and fear of weight gain.",
      "Assess repetitive appearance behaviors and time spent checking or camouflaging."
    ]
  },
  {
    id: "hoarding",
    code: "F42",
    name: "Hoarding Disorder",
    category: "Obsessive-Compulsive and Related Disorders",
    aliases: ["hoarding"],
    baseDifficulty: 4,
    patients: ["61-year-old retiree", "43-year-old mechanic", "29-year-old collector", "55-year-old teacher"],
    openings: ["is referred after rooms became unusable because of saved items", "feels intense distress when family tries to discard possessions", "keeps newspapers, containers, clothing, and broken objects for possible future use"],
    course: ["The difficulty discarding has grown over years.", "Living areas are cluttered enough that normal activities are blocked.", "The person believes items may be needed, are sentimental, or must not be wasted."],
    context: ["The clutter is not better explained by low energy during depression or delusional infestation beliefs.", "Acquiring items may be excessive but the key problem is discarding.", "Fire safety, falls, or family conflict have become concerns."],
    core: ["Discarding even low-value objects causes marked distress.", "Rooms cannot be used for intended purposes.", "The person resists cleanup because each item feels potentially important."],
    differentiator: ["Collectors organize and display items; hoarding creates clutter and impairment.", "OCD rituals may involve saving, but hoarding disorder is defined by discarding difficulty.", "Neurocognitive disorders can cause clutter but usually involve decline and poor organization for different reasons."],
    anchor: ["The best-fitting diagnosis is persistent difficulty discarding possessions with clutter and impairment.", "The final clue is distress with discarding plus living areas blocked by saved items.", "The case favors Hoarding Disorder because clutter and saving are the central syndrome."],
    explanation: "The case points to Hoarding Disorder because persistent difficulty discarding possessions leads to cluttered living spaces, distress, and impairment.",
    differentials: ["Obsessive-Compulsive Disorder", "Major Depressive Disorder", "Neurocognitive Disorder"],
    criteriaGuide: [
      "The core feature is persistent difficulty discarding possessions, regardless of their actual value.",
      "The difficulty is driven by perceived need to save items and distress about discarding them.",
      "Accumulation clutters active living spaces and compromises their intended use.",
      "The pattern causes distress, impairment, or safety problems.",
      "Consider medical, neurocognitive, depressive, psychotic, and OCD explanations before assigning the diagnosis."
    ],
    premiumDifferentials: [
      { name: "Obsessive-Compulsive Disorder", distinguishingFeatures: "OCD saving is often driven by intrusive feared consequences; hoarding centers on saving value and distress discarding." },
      { name: "Major Depressive Disorder", distinguishingFeatures: "Depression may reduce cleaning but does not usually produce persistent saving beliefs and discarding distress." },
      { name: "Neurocognitive Disorder", distinguishingFeatures: "Cognitive decline may cause clutter with memory and executive deficits rather than long-standing saving attachment." }
    ],
    howToDifferentiate: [
      "Inspect whether living spaces can be used as intended.",
      "Ask what makes discarding distressing.",
      "Check for acquiring behavior, safety hazards, insight level, and cognitive decline."
    ]
  },
  {
    id: "ptsd",
    code: "F43.10",
    name: "Posttraumatic Stress Disorder",
    category: "Trauma- and Stressor-Related Disorders",
    aliases: ["ptsd", "posttraumatic stress disorder", "post-traumatic stress disorder"],
    baseDifficulty: 3,
    patients: ["44-year-old paramedic", "32-year-old assault survivor", "27-year-old veteran", "50-year-old train operator"],
    openings: ["reports sleep disturbance and irritability after a traumatic event", "avoids reminders of a life-threatening experience", "has intrusive memories that make the event feel present again"],
    course: ["Symptoms have lasted more than a month and are impairing work or relationships.", "Nightmares, flashbacks, or unwanted memories recur despite efforts to avoid them.", "The person avoids places, people, conversations, or sensations linked to the trauma."],
    context: ["Negative mood, guilt, detachment, or distorted blame has developed after the trauma.", "Hypervigilance, exaggerated startle, poor sleep, and anger outbursts are present.", "The event involved actual or threatened death, serious injury, or sexual violence."],
    core: ["Intrusion, avoidance, negative mood and cognition changes, and arousal symptoms occur together.", "The symptoms are trauma-linked rather than free-floating anxiety.", "Substances or medical causes do not better explain the reaction."],
    differentiator: ["Acute Stress Disorder is time-limited to the first month after trauma.", "Adjustment Disorder lacks the full trauma symptom clusters.", "Panic Disorder does not require trauma-linked intrusions and avoidance."],
    anchor: ["The best-fitting diagnosis is a trauma-related syndrome lasting more than a month with intrusion, avoidance, mood changes, and arousal.", "The final clue is trauma exposure plus re-experiencing, avoidance, negative mood, hyperarousal, and impairment.", "The case favors PTSD because the symptom pattern is anchored to traumatic exposure."],
    explanation: "The case points to Posttraumatic Stress Disorder because trauma exposure is followed by persistent intrusion, avoidance, negative cognition or mood changes, hyperarousal, and impairment beyond the first month.",
    differentials: ["Acute Stress Disorder", "Adjustment Disorder", "Panic Disorder"],
    criteriaGuide: [
      "A qualifying traumatic exposure is required.",
      "Intrusion symptoms may include unwanted memories, nightmares, flashbacks, or intense distress to reminders.",
      "Avoidance involves efforts to avoid trauma-related memories, feelings, people, places, or situations.",
      "Negative mood or cognition changes and arousal symptoms are part of the pattern.",
      "Duration extends beyond one month and the symptoms cause distress or impairment."
    ],
    premiumDifferentials: [
      { name: "Acute Stress Disorder", distinguishingFeatures: "Acute stress disorder occurs in the first month after trauma; PTSD persists beyond that window." },
      { name: "Adjustment Disorder", distinguishingFeatures: "Adjustment disorder follows a stressor but lacks the full PTSD trauma exposure and symptom cluster pattern." },
      { name: "Panic Disorder", distinguishingFeatures: "Panic disorder centers on unexpected panic attacks, not trauma-linked intrusions and avoidance." }
    ],
    howToDifferentiate: [
      "Confirm that the stressor meets trauma exposure requirements.",
      "Organize symptoms into intrusion, avoidance, negative mood/cognition, and arousal clusters.",
      "Date onset and duration carefully to separate acute stress disorder from PTSD."
    ]
  },
  {
    id: "prolonged-grief",
    code: "F43.81",
    name: "Prolonged Grief Disorder",
    category: "Trauma- and Stressor-Related Disorders",
    aliases: ["complicated grief", "prolonged grief"],
    baseDifficulty: 4,
    patients: ["58-year-old widow", "36-year-old parent", "72-year-old retiree", "47-year-old sibling"],
    openings: ["continues to feel life is frozen after the death of a loved one", "reports intense yearning and daily preoccupation with a person who died", "has been unable to re-engage with life long after a bereavement"],
    course: ["The loss occurred well beyond the expected acute mourning period.", "The person avoids reminders yet also searches for closeness to the deceased.", "Work, relationships, and future planning remain impaired."],
    context: ["The dominant emotion is yearning, longing, or preoccupation rather than generalized low mood alone.", "The person may feel identity disruption, disbelief, bitterness, or meaninglessness tied to the death.", "The symptoms are culturally disproportionate in duration or severity."],
    core: ["Daily routines are organized around the deceased.", "There is difficulty accepting the death and moving into future roles.", "The person denies a wish to die but says life feels empty without the deceased."],
    differentiator: ["Major depression is broader and not necessarily centered on separation distress.", "PTSD centers on threat re-experiencing rather than yearning for the deceased.", "Adjustment Disorder is less persistent and less grief-specific."],
    anchor: ["The best-fitting diagnosis is persistent, impairing grief with yearning and preoccupation long after the death.", "The final clue is prolonged separation distress, identity disruption, and functional impairment after bereavement.", "The case favors Prolonged Grief Disorder because grief-specific longing remains the central syndrome."],
    explanation: "The case points to Prolonged Grief Disorder because persistent yearning and preoccupation after bereavement remain intense, impairing, and grief-specific well beyond the acute mourning period.",
    differentials: ["Major Depressive Disorder", "Posttraumatic Stress Disorder", "Adjustment Disorder"],
    criteriaGuide: [
      "The central pattern is persistent grief after the death of someone close.",
      "Core symptoms include intense yearning or preoccupation with the deceased.",
      "Associated features can include identity disruption, disbelief, avoidance, emotional pain, difficulty moving on, numbness, or meaninglessness.",
      "The duration is longer than expected for acute grief and must be considered in cultural context.",
      "Symptoms cause impairment and are not better explained by major depression, PTSD, or another disorder."
    ],
    premiumDifferentials: [
      { name: "Major Depressive Disorder", distinguishingFeatures: "Major depression is organized around pervasive depressed mood or anhedonia; prolonged grief is organized around yearning and separation distress." },
      { name: "Posttraumatic Stress Disorder", distinguishingFeatures: "PTSD centers on threat-based intrusions and avoidance; prolonged grief centers on loss and longing." },
      { name: "Adjustment Disorder", distinguishingFeatures: "Adjustment disorder is less specific and usually less persistent than prolonged grief disorder." }
    ],
    howToDifferentiate: [
      "Ask whether the main pain is yearning for the deceased or generalized hopeless depression.",
      "Clarify cultural mourning expectations and duration.",
      "Separate trauma fear memories from grief-focused longing and identity disruption."
    ]
  },
  {
    id: "schizophrenia",
    code: "F20.9",
    name: "Schizophrenia",
    category: "Schizophrenia Spectrum and Other Psychotic Disorders",
    aliases: ["schizophrenia"],
    baseDifficulty: 3,
    patients: ["22-year-old college student", "34-year-old warehouse worker", "28-year-old artist", "41-year-old office assistant"],
    openings: ["has become socially withdrawn and increasingly suspicious", "is brought in after months of odd beliefs and functional decline", "reports hearing voices while self-care and work have deteriorated"],
    course: ["The disturbance has continued for many months rather than days or weeks.", "Negative symptoms such as reduced speech, low motivation, or flat affect are present.", "Functioning at school, work, or relationships is clearly below previous levels."],
    context: ["Hallucinations, delusions, disorganized speech, or disorganized behavior are prominent.", "Mood episodes are absent or occupy a minority of the illness.", "Substance use and medical causes do not explain the psychosis."],
    core: ["The person believes others are monitoring thoughts and hears voices commenting on actions.", "Family reports deterioration in hygiene, social engagement, and goal-directed behavior.", "The psychotic symptoms persist outside mood episodes."],
    differentiator: ["Schizophreniform Disorder has a shorter course.", "Schizoaffective Disorder requires a substantial mood component plus psychosis outside mood episodes.", "Delusional Disorder lacks the broader deterioration and hallucination/disorganization pattern."],
    anchor: ["The best-fitting diagnosis is chronic psychosis with functional decline and negative symptoms.", "The final clue is psychosis lasting months with deterioration and symptoms not restricted to mood episodes.", "The case favors Schizophrenia because duration, breadth, and decline exceed brief or mood-related psychosis."],
    explanation: "The case points to Schizophrenia because psychotic symptoms, negative symptoms, functional decline, and a prolonged course occur outside mood episodes and without a better substance or medical explanation.",
    differentials: ["Schizophreniform Disorder", "Schizoaffective Disorder", "Delusional Disorder"],
    criteriaGuide: [
      "Core symptoms include delusions, hallucinations, disorganized speech, disorganized or catatonic behavior, and negative symptoms.",
      "A sufficient number and type of active-phase symptoms must be present.",
      "The illness includes a prolonged course with functional decline or impairment.",
      "Mood episodes, if present, do not account for most of the active and residual illness.",
      "Rule out substances, medical causes, and developmental communication disorders."
    ],
    premiumDifferentials: [
      { name: "Schizophreniform Disorder", distinguishingFeatures: "Schizophreniform disorder has the same symptom style but lasts less than the schizophrenia duration threshold." },
      { name: "Schizoaffective Disorder", distinguishingFeatures: "Schizoaffective disorder has major mood episodes present for much of the illness plus psychosis outside mood episodes." },
      { name: "Delusional Disorder", distinguishingFeatures: "Delusional disorder has non-bizarre or bizarre delusions without broad disorganization, negative symptoms, or marked functional decline." }
    ],
    howToDifferentiate: [
      "Create a timeline of psychotic symptoms, mood episodes, and functional decline.",
      "Ask collateral sources about negative symptoms and baseline deterioration.",
      "Rule out substances, seizures, endocrine disease, and medication effects."
    ]
  },
  {
    id: "schizophreniform",
    code: "F20.81",
    name: "Schizophreniform Disorder",
    category: "Schizophrenia Spectrum and Other Psychotic Disorders",
    aliases: ["schizophreniform"],
    baseDifficulty: 5,
    patients: ["23-year-old student", "30-year-old lab technician", "39-year-old parent", "20-year-old musician"],
    openings: ["develops psychotic symptoms over several weeks with uncertain long-term course", "has hallucinations and delusions but the duration remains intermediate", "is evaluated after recent onset of disorganized speech and suspicious beliefs"],
    course: ["The disturbance has lasted more than a month but less than six months.", "Function may be impaired, but the course has not yet reached the chronic duration threshold.", "The symptom pattern resembles schizophrenia in active-phase features."],
    context: ["Mood episodes do not dominate the illness.", "There is no clear substance, medication, or medical cause.", "Family reports the onset was noticeable and relatively recent."],
    core: ["Delusions, hallucinations, disorganized speech, disorganized behavior, or negative symptoms are present.", "The person may be too early in the course to determine whether schizophrenia will develop.", "Symptoms persist beyond a brief psychotic episode."],
    differentiator: ["Brief Psychotic Disorder lasts less than one month.", "Schizophrenia requires a longer illness duration.", "Schizoaffective Disorder requires a specific mood-psychosis relationship."],
    anchor: ["The best-fitting diagnosis is schizophrenia-like psychosis in the one-to-six-month duration window.", "The final clue is active psychotic symptoms lasting more than a month but not yet six months.", "The case is a duration puzzle: schizophrenia-spectrum symptoms without schizophrenia duration."],
    explanation: "The case points to Schizophreniform Disorder because schizophrenia-like psychotic symptoms have lasted longer than brief psychosis but have not reached the longer schizophrenia duration threshold.",
    differentials: ["Brief Psychotic Disorder", "Schizophrenia", "Schizoaffective Disorder"],
    criteriaGuide: [
      "Symptoms resemble schizophrenia active-phase symptoms.",
      "The duration is more than one month but less than six months.",
      "Functional decline may occur but is not required in the same way as schizophrenia.",
      "Mood episodes should not better account for the psychosis.",
      "Substance and medical causes must be excluded."
    ],
    premiumDifferentials: [
      { name: "Brief Psychotic Disorder", distinguishingFeatures: "Brief psychotic disorder lasts less than one month with eventual return toward baseline." },
      { name: "Schizophrenia", distinguishingFeatures: "Schizophrenia requires longer total duration and typically includes functional decline." },
      { name: "Schizoaffective Disorder", distinguishingFeatures: "Schizoaffective disorder requires major mood episodes for much of the illness and psychosis outside mood episodes." }
    ],
    howToDifferentiate: [
      "Date first psychotic symptom and current duration precisely.",
      "Track whether mood syndromes are present for most of the illness.",
      "Monitor longitudinally because the diagnosis may change with duration."
    ]
  },
  {
    id: "schizoaffective",
    code: "F25.0",
    name: "Schizoaffective Disorder",
    category: "Schizophrenia Spectrum and Other Psychotic Disorders",
    aliases: ["schizoaffective"],
    baseDifficulty: 5,
    patients: ["36-year-old writer", "29-year-old graduate student", "47-year-old mechanic", "25-year-old artist"],
    openings: ["has a history of psychosis and major mood episodes that overlap in complicated ways", "reports voices and paranoia along with episodes of mania or depression", "is evaluated for psychotic symptoms that are not confined to mood episodes"],
    course: ["There has been a period of psychosis lasting at least two weeks without a major mood episode.", "Major mood episodes are also present for a large portion of the illness.", "The longitudinal pattern is more than mood disorder with psychotic features."],
    context: ["During mood episodes, psychosis intensifies, but it does not disappear completely between them.", "The person has had syndromal mania or depression plus schizophrenia-spectrum symptoms.", "Substance use does not explain the psychotic course."],
    core: ["Delusions or hallucinations persist outside mood episodes.", "Mood episodes are prominent across the overall illness.", "Functional decline and disorganization may appear during psychotic periods."],
    differentiator: ["Mood disorder with psychotic features has psychosis only during mood episodes.", "Schizophrenia has mood episodes absent or brief relative to psychosis.", "Bipolar I with psychotic features does not have extended psychosis outside mania or depression."],
    anchor: ["The best-fitting diagnosis is psychosis outside mood episodes plus mood episodes present for much of the illness.", "The final clue is the two-part relationship: independent psychosis and substantial mood syndromes.", "The case favors Schizoaffective Disorder because neither schizophrenia nor mood disorder alone accounts for the timeline."],
    explanation: "The case points to Schizoaffective Disorder because psychosis occurs for a period without mood episodes, while major mood episodes are also present for much of the illness.",
    differentials: ["Schizophrenia", "Bipolar I Disorder", "Major Depressive Disorder with Psychotic Features"],
    criteriaGuide: [
      "There are schizophrenia-spectrum symptoms along with a major mood episode during part of the illness.",
      "There is also a period of delusions or hallucinations without a major mood episode.",
      "Mood episodes are present for a substantial portion of the total illness.",
      "Symptoms are not due to substances or medical conditions.",
      "Specify bipolar type when mania is part of the presentation and depressive type when only major depression is present."
    ],
    premiumDifferentials: [
      { name: "Schizophrenia", distinguishingFeatures: "In schizophrenia, mood episodes are absent or present for a minority of the illness." },
      { name: "Bipolar I Disorder", distinguishingFeatures: "Psychosis in bipolar disorder occurs during mood episodes, not for extended periods outside them." },
      { name: "Major Depressive Disorder with Psychotic Features", distinguishingFeatures: "Psychosis appears only during depressive episodes." }
    ],
    howToDifferentiate: [
      "Draw a timeline with psychosis above the line and mood episodes below it.",
      "Look specifically for at least two weeks of hallucinations or delusions without syndromal mood symptoms.",
      "Estimate whether mood episodes occupy a substantial portion of the full illness."
    ]
  },
  {
    id: "delusional",
    code: "F22",
    name: "Delusional Disorder",
    category: "Schizophrenia Spectrum and Other Psychotic Disorders",
    aliases: ["delusional disorder"],
    baseDifficulty: 4,
    patients: ["52-year-old office worker", "43-year-old neighbor", "65-year-old retiree", "35-year-old technician"],
    openings: ["holds a fixed belief that is not shared by others but otherwise appears organized", "has a persistent persecutory, jealous, grandiose, somatic, or erotomanic belief", "seeks help because one fixed belief has dominated life for months"],
    course: ["The belief has persisted for at least a month.", "Functioning outside the delusional topic is relatively preserved.", "Hallucinations, if present, are not prominent and relate to the delusional theme."],
    context: ["There is no broad disorganized speech, negative symptoms, or marked deterioration.", "Mood episodes are absent or brief relative to the delusional period.", "Substances and medical causes do not explain the belief."],
    core: ["The person acts on the belief through complaints, investigations, or confrontations.", "The belief is fixed despite contrary evidence.", "The presentation is circumscribed compared with schizophrenia."],
    differentiator: ["Schizophrenia has broader psychosis and functional decline.", "OCD can have poor insight but thoughts are often intrusive and ritual-linked.", "Body Dysmorphic Disorder is used when the fixed belief is appearance-focused."],
    anchor: ["The best-fitting diagnosis is a persistent delusion with otherwise relatively preserved functioning.", "The final clue is fixed delusional belief without schizophrenia-like disorganization or negative symptoms.", "The case favors Delusional Disorder because the psychosis is circumscribed."],
    explanation: "The case points to Delusional Disorder because a fixed delusional belief persists while broader schizophrenia-spectrum features and marked functional decline are absent.",
    differentials: ["Schizophrenia", "Obsessive-Compulsive Disorder", "Body Dysmorphic Disorder"],
    criteriaGuide: [
      "The central feature is one or more delusions lasting at least a month.",
      "Criteria for schizophrenia are not met.",
      "Functioning is not markedly impaired apart from the impact of the delusion, and behavior is not obviously bizarre overall.",
      "Mood episodes, if present, are brief relative to the delusional periods.",
      "Substances, medical illness, OCD, and body dysmorphic disorder should be considered."
    ],
    premiumDifferentials: [
      { name: "Schizophrenia", distinguishingFeatures: "Schizophrenia includes broader symptoms such as hallucinations, disorganization, negative symptoms, and decline." },
      { name: "Obsessive-Compulsive Disorder", distinguishingFeatures: "OCD thoughts are intrusive and tied to rituals even when insight is poor." },
      { name: "Body Dysmorphic Disorder", distinguishingFeatures: "Appearance-focused delusional conviction is classified within BDD when the full BDD pattern is present." }
    ],
    howToDifferentiate: [
      "Assess breadth of psychotic symptoms beyond the single belief.",
      "Check functioning outside the delusional theme.",
      "Identify whether the belief is better understood as obsessional, appearance-focused, or mood-congruent psychosis."
    ]
  },
  {
    id: "autism",
    code: "F84.0",
    name: "Autism Spectrum Disorder",
    category: "Neurodevelopmental Disorders",
    aliases: ["asd", "autism", "autistic spectrum disorder"],
    baseDifficulty: 3,
    patients: ["10-year-old child", "7-year-old student", "17-year-old adolescent", "29-year-old software analyst"],
    openings: ["is evaluated for long-standing social communication differences", "has difficulty with reciprocal conversation and intense distress with routine changes", "reports lifelong difficulty reading social cues alongside unusually focused interests"],
    course: ["Features were present in early development, even if recognized later.", "Social reciprocity, nonverbal communication, and peer relationships are affected.", "Restricted or repetitive behaviors, sensory differences, routines, or highly focused interests are present."],
    context: ["The presentation is not explained only by social fear or attention problems.", "Language level may vary, but social communication differences are persistent.", "The person may mask symptoms but becomes exhausted by social demands."],
    core: ["Conversation is one-sided or literal, and nonverbal cues are hard to interpret.", "Changes in routine trigger disproportionate distress.", "Interests are intense, specific, and absorbing."],
    differentiator: ["Social Anxiety Disorder begins around fear of judgment rather than early social communication differences.", "ADHD causes impulsivity and inattention but does not fully explain restricted interests and reciprocity differences.", "Social Pragmatic Communication Disorder lacks restricted and repetitive behaviors."],
    anchor: ["The best-fitting diagnosis is early-emerging social communication differences plus restricted or repetitive patterns.", "The final clue is lifelong social reciprocity difficulty with routines, sensory features, and focused interests.", "The case favors Autism Spectrum Disorder because both social communication and restricted behavior domains are present."],
    explanation: "The case points to Autism Spectrum Disorder because persistent social communication differences and restricted or repetitive behaviors are present from early development and cause functional impact.",
    differentials: ["Social Anxiety Disorder", "Attention-Deficit/Hyperactivity Disorder", "Social Pragmatic Communication Disorder"],
    criteriaGuide: [
      "Persistent social communication and social interaction differences are required.",
      "Restricted, repetitive patterns of behavior, interests, activities, sensory responses, or routines are also required.",
      "Symptoms begin in early development, though they may become clearer when demands increase.",
      "Symptoms cause clinically important impairment.",
      "Intellectual disability, language disorder, ADHD, anxiety, and social pragmatic communication disorder should be considered."
    ],
    premiumDifferentials: [
      { name: "Social Anxiety Disorder", distinguishingFeatures: "Social anxiety is driven by fear of evaluation; autism involves early social communication differences and restricted patterns." },
      { name: "Attention-Deficit/Hyperactivity Disorder", distinguishingFeatures: "ADHD explains inattention and impulsivity but not the full reciprocity plus restricted-interest profile." },
      { name: "Social Pragmatic Communication Disorder", distinguishingFeatures: "This condition lacks the restricted or repetitive behavior domain required for autism." }
    ],
    howToDifferentiate: [
      "Take a developmental history from caregivers when possible.",
      "Ask about sensory sensitivities, routines, and focused interests.",
      "Separate fear-driven avoidance from skill and reciprocity differences."
    ]
  },
  {
    id: "adhd",
    code: "F90.2",
    name: "Attention-Deficit/Hyperactivity Disorder",
    category: "Neurodevelopmental Disorders",
    aliases: ["adhd", "add", "attention deficit hyperactivity disorder"],
    baseDifficulty: 2,
    patients: ["15-year-old student", "9-year-old child", "33-year-old resident physician", "42-year-old project manager"],
    openings: ["is referred for chronic disorganization, forgetfulness, and restlessness", "reports unfinished tasks, missed deadlines, and difficulty sustaining attention", "has a long history of impulsivity and trouble waiting turns"],
    course: ["Symptoms began in childhood and appear in more than one setting.", "Teachers, family, or coworkers describe a consistent pattern rather than a recent decline.", "The symptoms cause school, work, relationship, or safety impairment."],
    context: ["Inattention includes losing items, careless mistakes, distractibility, and difficulty finishing tasks.", "Hyperactivity or impulsivity includes fidgeting, interrupting, impatience, and feeling driven.", "Mood, anxiety, sleep, substance, and learning problems do not fully explain the pattern."],
    core: ["The person struggles with sustained effort even for important tasks.", "External structure helps but does not eliminate the symptoms.", "Problems are developmental rather than new-onset in adulthood."],
    differentiator: ["Anxiety can impair concentration but is driven by worry.", "Depression causes low motivation and slowed thinking during mood episodes.", "Autism includes social communication and restricted behavior patterns beyond attention symptoms."],
    anchor: ["The best-fitting diagnosis is a childhood-onset pattern of inattention and/or hyperactivity-impulsivity across settings.", "The final clue is developmentally persistent attention and impulse-control symptoms with impairment.", "The case favors ADHD because symptoms are chronic, cross-situational, and began early."],
    explanation: "The case points to ADHD because inattention and hyperactivity-impulsivity began in childhood, occur across settings, and impair functioning.",
    differentials: ["Generalized Anxiety Disorder", "Major Depressive Disorder", "Autism Spectrum Disorder"],
    criteriaGuide: [
      "The pattern includes persistent inattention and/or hyperactivity-impulsivity.",
      "Several symptoms should have been present before adulthood and occur in multiple settings.",
      "Symptoms interfere with academic, occupational, or social functioning.",
      "The symptoms are developmentally inappropriate, not just a reaction to one context.",
      "Anxiety, mood, sleep, substance, learning, and autism-related explanations should be evaluated."
    ],
    premiumDifferentials: [
      { name: "Generalized Anxiety Disorder", distinguishingFeatures: "Anxiety-related concentration problems track with worry and tension." },
      { name: "Major Depressive Disorder", distinguishingFeatures: "Depression-related concentration problems are episodic and tied to mood and neurovegetative changes." },
      { name: "Autism Spectrum Disorder", distinguishingFeatures: "Autism includes social reciprocity differences and restricted behaviors beyond attention regulation." }
    ],
    howToDifferentiate: [
      "Look for childhood onset using school reports or collateral history.",
      "Ask whether symptoms appear across home, school, work, and relationships.",
      "Screen for sleep deprivation, anxiety, depression, substances, and learning disorders."
    ]
  },
  {
    id: "anorexia",
    code: "F50.01",
    name: "Anorexia Nervosa",
    category: "Feeding and Eating Disorders",
    aliases: ["anorexia", "anorexia nervosa"],
    baseDifficulty: 3,
    patients: ["19-year-old college student", "27-year-old dancer", "16-year-old athlete", "34-year-old parent"],
    openings: ["is seen after marked weight loss and rigid food rules", "reports intense fear of weight gain despite being medically underweight", "continues restriction and exercise even when dizzy and cold"],
    course: ["Food intake is persistently restricted relative to needs.", "Body weight is significantly low for age, sex, development, and health context.", "The person evaluates self-worth heavily through shape, weight, or control."],
    context: ["The person may deny the seriousness of low weight.", "Binge-purge behavior may or may not be present.", "The problem is not simply low appetite from depression or fear of choking."],
    core: ["Calorie counting, avoidance of meals, and compensatory exercise dominate the day.", "Fear of gaining weight persists despite medical risk.", "Body image is distorted or weight's seriousness is minimized."],
    differentiator: ["ARFID lacks fear of weight gain or body image disturbance.", "Bulimia Nervosa usually has normal or higher weight and recurrent binge-purge cycles.", "Body Dysmorphic Disorder focuses on perceived flaws, not low weight with restriction."],
    anchor: ["The best-fitting diagnosis is restriction causing significantly low weight with fear of weight gain and body image disturbance.", "The final clue is low weight plus persistent weight-gain fear and disturbed body experience.", "The case favors Anorexia Nervosa because restriction and low weight are central."],
    explanation: "The case points to Anorexia Nervosa because restriction leads to significantly low weight, with fear of weight gain and disturbed body image or denial of seriousness.",
    differentials: ["Avoidant/Restrictive Food Intake Disorder", "Bulimia Nervosa", "Body Dysmorphic Disorder"],
    criteriaGuide: [
      "Restriction of intake leads to significantly low body weight in context.",
      "There is intense fear of gaining weight or persistent behavior that interferes with weight gain.",
      "Body image disturbance, undue influence of weight or shape, or lack of recognition of seriousness is present.",
      "Specify restricting type or binge-eating/purging type when clinically appropriate.",
      "Medical instability should be assessed urgently when low weight or purging is present."
    ],
    premiumDifferentials: [
      { name: "Avoidant/Restrictive Food Intake Disorder", distinguishingFeatures: "ARFID restriction is not driven by weight or shape concerns." },
      { name: "Bulimia Nervosa", distinguishingFeatures: "Bulimia has recurrent binge-purge cycles without significantly low body weight as the defining feature." },
      { name: "Body Dysmorphic Disorder", distinguishingFeatures: "BDD is about perceived appearance defects rather than restriction to maintain low weight." }
    ],
    howToDifferentiate: [
      "Measure medical risk and weight context rather than relying on appearance.",
      "Ask directly about fear of weight gain and body image valuation.",
      "Screen for bingeing, purging, exercise, laxatives, and medical instability."
    ]
  },
  {
    id: "bulimia",
    code: "F50.2",
    name: "Bulimia Nervosa",
    category: "Feeding and Eating Disorders",
    aliases: ["bulimia", "bulimia nervosa"],
    baseDifficulty: 3,
    patients: ["22-year-old student", "31-year-old attorney", "18-year-old gymnast", "45-year-old parent"],
    openings: ["reports secret episodes of eating far more than intended followed by compensatory behavior", "has dental enamel erosion, shame, and repeated attempts to stop purging", "describes cycles of bingeing and vomiting while weight remains not significantly low"],
    course: ["Binge episodes involve loss of control and unusually large intake.", "Compensatory behaviors include vomiting, laxatives, fasting, or excessive exercise.", "Self-evaluation is strongly influenced by weight and shape."],
    context: ["The pattern recurs over time and is not limited to episodes of anorexia nervosa.", "The person often feels guilt, secrecy, and fear of weight gain after binges.", "Medical complications such as electrolyte problems or parotid swelling may appear."],
    core: ["The key cycle is binge eating followed by behaviors meant to prevent weight gain.", "Weight may be normal, above, or fluctuating, but not significantly low as in anorexia.", "The person feels unable to control the binge-purge cycle."],
    differentiator: ["Binge-Eating Disorder lacks recurrent compensatory behaviors.", "Anorexia binge-purge type includes significantly low weight.", "Purging Disorder has purging without objectively large binges."],
    anchor: ["The best-fitting diagnosis is recurrent binge eating with compensatory behaviors and shape-weight overvaluation.", "The final clue is loss-of-control binges plus vomiting, laxatives, fasting, or excessive exercise.", "The case favors Bulimia Nervosa because the binge-compensation cycle is central."],
    explanation: "The case points to Bulimia Nervosa because recurrent binge eating with loss of control is followed by compensatory behaviors, with self-evaluation tied to weight or shape.",
    differentials: ["Binge-Eating Disorder", "Anorexia Nervosa", "Purging Disorder"],
    criteriaGuide: [
      "Recurrent binge eating involves unusually large intake with a sense of loss of control.",
      "Recurrent compensatory behavior is used to prevent weight gain.",
      "The pattern occurs repeatedly over time.",
      "Self-evaluation is unduly influenced by weight and shape.",
      "The disturbance is not exclusively during anorexia nervosa."
    ],
    premiumDifferentials: [
      { name: "Binge-Eating Disorder", distinguishingFeatures: "Binge-eating disorder lacks recurrent purging, fasting, or excessive exercise as compensation." },
      { name: "Anorexia Nervosa", distinguishingFeatures: "Anorexia involves significantly low weight and restriction as a defining feature." },
      { name: "Purging Disorder", distinguishingFeatures: "Purging disorder involves purging without objectively large binge episodes." }
    ],
    howToDifferentiate: [
      "Ask separately about binge size, loss of control, and compensatory behavior.",
      "Assess weight context and medical risk.",
      "Screen for electrolytes, dental complications, laxatives, and exercise patterns."
    ]
  },
  {
    id: "binge-eating",
    code: "F50.81",
    name: "Binge-Eating Disorder",
    category: "Feeding and Eating Disorders",
    aliases: ["bed", "binge eating disorder"],
    baseDifficulty: 3,
    patients: ["40-year-old office manager", "23-year-old student", "55-year-old chef", "36-year-old parent"],
    openings: ["reports episodes of eating large amounts with loss of control", "feels shame after secret eating episodes but does not purge", "has recurrent binge episodes associated with distress"],
    course: ["Binges occur with rapid eating, eating when not hungry, eating until uncomfortably full, or eating alone from embarrassment.", "The person feels disgusted, depressed, or guilty afterward.", "There are no regular compensatory behaviors such as vomiting, laxatives, or fasting."],
    context: ["Weight can vary and is not the diagnostic requirement.", "Dieting attempts may alternate with binge episodes.", "The person describes loss of control rather than ordinary overeating."],
    core: ["Distress about binge eating is clinically significant.", "The binge episodes are recurrent over time.", "The absence of compensatory behavior separates it from bulimia."],
    differentiator: ["Bulimia Nervosa includes recurrent compensatory behaviors.", "Anorexia Nervosa involves significantly low weight and restriction.", "Night Eating Syndrome has a circadian eating pattern rather than discrete loss-of-control binges."],
    anchor: ["The best-fitting diagnosis is recurrent distressing binge eating without compensatory behavior.", "The final clue is loss-of-control binges with shame and no regular purging or fasting.", "The case favors Binge-Eating Disorder because binge episodes, not compensation, organize the presentation."],
    explanation: "The case points to Binge-Eating Disorder because recurrent loss-of-control binge episodes cause distress without regular compensatory behaviors.",
    differentials: ["Bulimia Nervosa", "Anorexia Nervosa", "Night Eating Syndrome"],
    criteriaGuide: [
      "Recurrent binge episodes involve large intake with loss of control.",
      "Episodes are associated with features such as rapid eating, uncomfortable fullness, eating when not hungry, eating alone, or guilt afterward.",
      "Marked distress about binge eating is present.",
      "Regular compensatory behaviors are absent.",
      "The pattern is not exclusively during bulimia nervosa or anorexia nervosa."
    ],
    premiumDifferentials: [
      { name: "Bulimia Nervosa", distinguishingFeatures: "Bulimia includes recurrent compensatory behaviors." },
      { name: "Anorexia Nervosa", distinguishingFeatures: "Anorexia centers on significantly low weight, restriction, and weight-gain fear." },
      { name: "Night Eating Syndrome", distinguishingFeatures: "Night eating is organized around evening or nocturnal eating rather than discrete loss-of-control binge episodes." }
    ],
    howToDifferentiate: [
      "Assess objective binge size and loss of control.",
      "Ask directly about vomiting, laxatives, fasting, and exercise compensation.",
      "Evaluate shame, distress, frequency, and medical comorbidity."
    ]
  },
  {
    id: "arfid",
    code: "F50.82",
    name: "Avoidant/Restrictive Food Intake Disorder",
    category: "Feeding and Eating Disorders",
    aliases: ["arfid"],
    baseDifficulty: 4,
    patients: ["12-year-old child", "20-year-old college student", "8-year-old child", "35-year-old programmer"],
    openings: ["has restricted eating because of sensory aversion, low interest, or fear of consequences", "loses weight after narrowing food intake without body image concerns", "avoids many foods after choking, nausea, or sensory distress"],
    course: ["The restriction causes weight loss, nutritional deficiency, supplement dependence, or psychosocial impairment.", "There is no intense fear of weight gain or disturbance in body image.", "The pattern is more than ordinary picky eating."],
    context: ["The person may avoid textures, smells, swallowing sensations, or fear vomiting.", "Mealtimes create family stress and social avoidance.", "Medical conditions do not fully explain the restriction."],
    core: ["Food variety is very limited and health or functioning is affected.", "The avoidance is not motivated by pursuit of thinness.", "Restriction can be driven by sensory sensitivity, low appetite, or fear of aversive outcomes."],
    differentiator: ["Anorexia Nervosa has weight-gain fear or body image disturbance.", "Specific Phobia may involve choking fear but may not explain broad nutritional impact.", "Autism may coexist, but ARFID describes the feeding disturbance itself."],
    anchor: ["The best-fitting diagnosis is restrictive intake with nutritional or functional consequences and no body image driver.", "The final clue is food restriction from sensory or fear-based avoidance without weight-shape overvaluation.", "The case favors ARFID because eating restriction is clinically impairing but not anorexia."],
    explanation: "The case points to Avoidant/Restrictive Food Intake Disorder because restrictive intake causes nutritional or psychosocial impairment without weight or shape disturbance.",
    differentials: ["Anorexia Nervosa", "Specific Phobia", "Autism Spectrum Disorder"],
    criteriaGuide: [
      "There is an eating or feeding disturbance such as sensory avoidance, low interest in food, or fear of aversive consequences.",
      "The disturbance leads to weight loss, nutritional deficiency, supplement dependence, or psychosocial impairment.",
      "The restriction is not due to lack of food or a culturally sanctioned practice.",
      "There is no body image disturbance or fear of weight gain as the main driver.",
      "Medical conditions and other mental disorders should be assessed as contributors."
    ],
    premiumDifferentials: [
      { name: "Anorexia Nervosa", distinguishingFeatures: "Anorexia includes weight-gain fear or body image disturbance; ARFID does not." },
      { name: "Specific Phobia", distinguishingFeatures: "A choking or vomiting phobia may be narrower and not necessarily produce broad nutritional deficiency." },
      { name: "Autism Spectrum Disorder", distinguishingFeatures: "Autism may include food selectivity, but ARFID is diagnosed when feeding impairment exceeds what autism alone explains." }
    ],
    howToDifferentiate: [
      "Ask what drives restriction: sensory discomfort, low appetite, fear of choking, or weight concerns.",
      "Assess growth, labs, nutritional deficiencies, supplements, and social impairment.",
      "Consider autism, GI disease, anxiety, and trauma without assuming they fully explain intake."
    ]
  },
  {
    id: "somatic-symptom",
    code: "F45.1",
    name: "Somatic Symptom Disorder",
    category: "Somatic Symptom and Related Disorders",
    aliases: ["somatic symptom disorder"],
    baseDifficulty: 4,
    patients: ["47-year-old office worker", "31-year-old nurse", "60-year-old mechanic", "24-year-old student"],
    openings: ["has persistent physical symptoms with disproportionate health-related anxiety", "spends hours monitoring bodily sensations and seeking reassurance", "reports pain or fatigue that has taken over daily life"],
    course: ["Medical findings may be present or absent, but the response is excessive and impairing.", "The person repeatedly researches symptoms and seeks consultations.", "Time, energy, and emotion devoted to symptoms are high."],
    context: ["The focus is on distressing symptoms themselves rather than fear of having a hidden disease with few symptoms.", "The symptoms are not intentionally produced.", "Anxiety, depression, and medical illness may coexist."],
    core: ["The person interprets ordinary sensations as dangerous and reorganizes life around symptoms.", "Reassurance is short-lived.", "Functional impairment comes from health-related thoughts, feelings, and behaviors."],
    differentiator: ["Illness Anxiety Disorder has minimal or no somatic symptoms.", "Panic Disorder involves abrupt attacks rather than persistent symptom preoccupation.", "Factitious Disorder involves deception without obvious external rewards."],
    anchor: ["The best-fitting diagnosis is persistent somatic symptoms plus excessive thoughts, anxiety, or behaviors about them.", "The final clue is disproportionate health-related preoccupation around actual symptoms.", "The case favors Somatic Symptom Disorder because symptoms themselves are central and impairing."],
    explanation: "The case points to Somatic Symptom Disorder because distressing physical symptoms are accompanied by excessive health-related thoughts, anxiety, and behaviors.",
    differentials: ["Illness Anxiety Disorder", "Panic Disorder", "Factitious Disorder"],
    criteriaGuide: [
      "One or more somatic symptoms are distressing or disrupt daily life.",
      "Excessive thoughts, anxiety, or behaviors about the symptoms are present.",
      "The symptomatic state is persistent, even if individual symptoms shift.",
      "Symptoms are not intentionally produced.",
      "A medical condition can coexist; the diagnosis concerns disproportionate response and impairment."
    ],
    premiumDifferentials: [
      { name: "Illness Anxiety Disorder", distinguishingFeatures: "Illness anxiety has high disease fear with absent or mild symptoms." },
      { name: "Panic Disorder", distinguishingFeatures: "Panic disorder has discrete abrupt surges rather than persistent somatic preoccupation." },
      { name: "Factitious Disorder", distinguishingFeatures: "Factitious disorder involves falsification or induction of symptoms." }
    ],
    howToDifferentiate: [
      "Do not require symptoms to be medically unexplained; assess proportionality and impairment.",
      "Separate fear of disease from distress about symptoms.",
      "Look for reassurance cycles, checking, repeated visits, and life restriction."
    ]
  },
  {
    id: "illness-anxiety",
    code: "F45.21",
    name: "Illness Anxiety Disorder",
    category: "Somatic Symptom and Related Disorders",
    aliases: ["health anxiety", "hypochondriasis", "illness anxiety"],
    baseDifficulty: 4,
    patients: ["35-year-old parent", "52-year-old executive", "21-year-old student", "64-year-old retiree"],
    openings: ["fears having a serious illness despite minimal symptoms", "repeatedly checks the body and searches online for disease signs", "is preoccupied with cancer, neurologic disease, or heart disease despite reassurance"],
    course: ["The preoccupation has lasted months and reassurance fades quickly.", "Somatic symptoms are absent or mild.", "The person either seeks repeated care or avoids appointments from fear of bad news."],
    context: ["The fear is disease-focused, not a panic surge or broad everyday worry.", "Medical evaluation has not supported the feared illness.", "The concern is not better explained by delusional disorder or OCD."],
    core: ["Health-related checking, reassurance-seeking, or avoidance is prominent.", "The person overinterprets normal sensations as evidence of disease.", "Functional impairment comes from disease preoccupation."],
    differentiator: ["Somatic Symptom Disorder has prominent distressing symptoms.", "OCD has broader intrusive thoughts and rituals.", "Generalized Anxiety Disorder includes many worry domains rather than illness preoccupation."],
    anchor: ["The best-fitting diagnosis is persistent fear of having or acquiring serious illness with minimal symptoms.", "The final clue is disease preoccupation, checking, and reassurance cycles despite little somatic burden.", "The case favors Illness Anxiety Disorder because the feared illness is central."],
    explanation: "The case points to Illness Anxiety Disorder because the person is preoccupied with having or acquiring a serious illness despite minimal symptoms and reassurance.",
    differentials: ["Somatic Symptom Disorder", "Obsessive-Compulsive Disorder", "Generalized Anxiety Disorder"],
    criteriaGuide: [
      "The central feature is preoccupation with having or acquiring a serious illness.",
      "Somatic symptoms are absent or mild.",
      "Health anxiety is high and health-related behaviors or avoidance are present.",
      "The preoccupation persists over time despite reassurance or evaluation.",
      "Somatic symptom disorder, panic disorder, OCD, delusional disorder, and generalized anxiety should be considered."
    ],
    premiumDifferentials: [
      { name: "Somatic Symptom Disorder", distinguishingFeatures: "Somatic symptom disorder has prominent distressing symptoms; illness anxiety has minimal symptoms." },
      { name: "Obsessive-Compulsive Disorder", distinguishingFeatures: "OCD may include health obsessions but has ritual patterns and broader obsessional themes." },
      { name: "Generalized Anxiety Disorder", distinguishingFeatures: "GAD worry spans many areas rather than serious illness preoccupation." }
    ],
    howToDifferentiate: [
      "Ask whether distress is about sensations themselves or what disease they might signal.",
      "Assess checking, reassurance-seeking, avoidance, and internet searching.",
      "Watch for fixed delusional conviction or broader OCD rituals."
    ]
  },
  {
    id: "borderline-pd",
    code: "F60.3",
    name: "Borderline Personality Disorder",
    category: "Personality Disorders",
    aliases: ["bpd", "borderline personality"],
    baseDifficulty: 3,
    patients: ["28-year-old artist", "35-year-old server", "22-year-old student", "41-year-old parent"],
    openings: ["describes intense relationships that swing between closeness and rupture", "reports chronic emptiness, abandonment panic, and impulsive crises", "presents after self-injury during an interpersonal conflict"],
    course: ["The pattern is long-standing and appears across relationships and settings.", "Mood shifts are rapid and reactive, often lasting hours rather than discrete mood episodes.", "Identity, goals, and self-image feel unstable."],
    context: ["Impulsivity may involve spending, sex, substances, driving, or binge eating.", "Recurrent self-harm, suicidal gestures, or threats occur during crises.", "Brief stress-related paranoia or dissociation may occur."],
    core: ["Fear of abandonment drives frantic efforts to prevent separation.", "Relationships alternate between idealization and devaluation.", "Anger, emptiness, and identity disturbance are prominent."],
    differentiator: ["Bipolar II mood episodes last days and include increased energy, not only interpersonal reactivity.", "PTSD is trauma-anchored with intrusion and avoidance clusters.", "Histrionic Personality Disorder is attention-seeking but usually lacks self-harm and abandonment panic."],
    anchor: ["The best-fitting diagnosis is a pervasive pattern of instability in relationships, self-image, affect, and impulse control.", "The final clue is abandonment fear, unstable relationships, identity disturbance, impulsivity, and self-harm.", "The case favors Borderline Personality Disorder because the pattern is trait-like and interpersonal."],
    explanation: "The case points to Borderline Personality Disorder because it describes a pervasive pattern of unstable relationships, self-image, affect, and impulses with abandonment fears and self-harm.",
    differentials: ["Bipolar II Disorder", "Posttraumatic Stress Disorder", "Histrionic Personality Disorder"],
    criteriaGuide: [
      "The central pattern involves instability in relationships, self-image, and affect, with marked impulsivity.",
      "Features can include abandonment fears, intense unstable relationships, identity disturbance, impulsivity, self-harm, affective instability, emptiness, anger, and stress-related paranoia or dissociation.",
      "The pattern is pervasive and begins by early adulthood.",
      "Symptoms are not better explained by episodic mood disorder, substances, or another condition.",
      "Risk assessment is important when self-harm or suicidality is present."
    ],
    premiumDifferentials: [
      { name: "Bipolar II Disorder", distinguishingFeatures: "Bipolar II has discrete hypomanic episodes lasting days with increased energy; BPD shifts are often interpersonal and rapid." },
      { name: "Posttraumatic Stress Disorder", distinguishingFeatures: "PTSD is organized around trauma exposure, intrusions, avoidance, and hyperarousal." },
      { name: "Histrionic Personality Disorder", distinguishingFeatures: "Histrionic traits emphasize attention-seeking and emotional expression without the same abandonment, identity, and self-harm pattern." }
    ],
    howToDifferentiate: [
      "Map mood shifts to interpersonal triggers and duration.",
      "Assess identity disturbance, abandonment fear, self-harm, and chronic emptiness.",
      "Screen for trauma and bipolar episodes rather than assuming one explanation."
    ]
  },
  {
    id: "antisocial-pd",
    code: "F60.2",
    name: "Antisocial Personality Disorder",
    category: "Personality Disorders",
    aliases: ["aspd", "antisocial personality"],
    baseDifficulty: 4,
    patients: ["32-year-old man", "45-year-old business owner", "26-year-old detainee", "39-year-old contractor"],
    openings: ["has a long pattern of violating others' rights and disregarding consequences", "is evaluated after repeated deceit, aggression, and legal problems", "shows little remorse after exploiting or harming others"],
    course: ["The pattern began before adulthood with conduct problems.", "There is repeated lying, impulsivity, irritability, reckless disregard, irresponsibility, or lack of remorse.", "The person is at least an adult and the behavior is not limited to mania or psychosis."],
    context: ["Collateral history describes school fights, theft, truancy, cruelty, or arrests before age 15.", "Relationships are marked by manipulation or exploitation.", "Consequences rarely change behavior."],
    core: ["The person minimizes harm and blames victims.", "Work, family, and legal obligations are repeatedly disregarded.", "Risk-taking continues despite danger to self or others."],
    differentiator: ["Substance use may worsen behavior but does not fully explain the lifelong pattern.", "Narcissistic Personality Disorder may exploit others but does not require conduct-disorder history.", "Mania produces episodic recklessness rather than a stable pattern since youth."],
    anchor: ["The best-fitting diagnosis is adult antisocial behavior with evidence of conduct problems before age 15.", "The final clue is pervasive rights violation, deceit, impulsivity, irresponsibility, and lack of remorse.", "The case favors Antisocial Personality Disorder because the pattern is developmental and persistent."],
    explanation: "The case points to Antisocial Personality Disorder because there is a pervasive adult pattern of violating others' rights, with evidence of conduct problems before adulthood.",
    differentials: ["Substance Use Disorder", "Narcissistic Personality Disorder", "Bipolar I Disorder"],
    criteriaGuide: [
      "The adult pattern involves disregard for and violation of others' rights.",
      "Features include unlawful behavior, deceitfulness, impulsivity, aggression, reckless disregard, irresponsibility, and lack of remorse.",
      "Evidence of conduct disorder before age 15 is important.",
      "The person must be an adult for the diagnosis.",
      "The behavior should not occur exclusively during schizophrenia or bipolar disorder."
    ],
    premiumDifferentials: [
      { name: "Substance Use Disorder", distinguishingFeatures: "Substances can cause antisocial acts, but ASPD is a broader developmental pattern." },
      { name: "Narcissistic Personality Disorder", distinguishingFeatures: "Narcissistic personality centers on grandiosity and admiration needs, without required conduct-disorder history." },
      { name: "Bipolar I Disorder", distinguishingFeatures: "Manic recklessness is episodic with mood and energy change." }
    ],
    howToDifferentiate: [
      "Get collateral history of childhood conduct problems.",
      "Separate intoxication-related behavior from a lifelong interpersonal pattern.",
      "Assess remorse, responsibility, aggression, deceit, and legal history."
    ]
  },
  {
    id: "alcohol-use",
    code: "F10.20",
    name: "Alcohol Use Disorder",
    category: "Substance-Related and Addictive Disorders",
    aliases: ["alcohol dependence", "alcoholism", "aud"],
    baseDifficulty: 2,
    patients: ["52-year-old sales manager", "29-year-old bartender", "44-year-old surgeon", "67-year-old retiree"],
    openings: ["has tried to cut down drinking but repeatedly returns to heavy use", "misses obligations and hides bottles despite consequences", "continues drinking despite arguments, blackouts, and medical concerns"],
    course: ["Alcohol is taken in larger amounts or for longer than intended.", "Craving, time spent drinking or recovering, and role impairment are present.", "Tolerance or withdrawal symptoms may appear."],
    context: ["Important activities have been reduced or abandoned.", "Use continues despite interpersonal, occupational, or physical harm.", "Risky situations such as driving or operating equipment while intoxicated occur."],
    core: ["Morning tremor or sweating improves after alcohol.", "Attempts to stop are short-lived.", "The person minimizes use despite collateral concern."],
    differentiator: ["Depression or anxiety may coexist but does not explain the impaired control over alcohol.", "Sedative use disorder involves a different substance class.", "Social drinking lacks the persistent impairment and loss of control."],
    anchor: ["The best-fitting diagnosis is a problematic pattern of alcohol use with impaired control, impairment, risky use, or pharmacologic features.", "The final clue is continued alcohol use despite harm plus tolerance or withdrawal.", "The case favors Alcohol Use Disorder because alcohol-related control and consequences dominate."],
    explanation: "The case points to Alcohol Use Disorder because alcohol use shows impaired control, social impairment, risky use, continued use despite harm, and tolerance or withdrawal features.",
    differentials: ["Major Depressive Disorder", "Generalized Anxiety Disorder", "Sedative Use Disorder"],
    criteriaGuide: [
      "The diagnosis is based on a problematic alcohol use pattern with clinically important impairment or distress.",
      "Features include impaired control, craving, role failure, social problems, reduced activities, risky use, and continued use despite harm.",
      "Tolerance and withdrawal can support severity but are not the only possible features.",
      "Severity is commonly described by the number of criteria met.",
      "Co-occurring mood, anxiety, trauma, and medical problems should be assessed."
    ],
    premiumDifferentials: [
      { name: "Major Depressive Disorder", distinguishingFeatures: "Alcohol can cause or worsen depressive symptoms; determine whether mood symptoms persist during sobriety." },
      { name: "Generalized Anxiety Disorder", distinguishingFeatures: "Anxiety may drive drinking, but AUD is defined by impaired control and alcohol-related consequences." },
      { name: "Sedative Use Disorder", distinguishingFeatures: "Sedative-hypnotic use disorder involves benzodiazepines or related substances rather than alcohol." }
    ],
    howToDifferentiate: [
      "Quantify use, unsuccessful cut-down attempts, craving, role failures, and hazardous use.",
      "Ask about withdrawal symptoms and morning drinking.",
      "Use collateral and labs when underreporting is likely."
    ]
  },
  {
    id: "opioid-use",
    code: "F11.20",
    name: "Opioid Use Disorder",
    category: "Substance-Related and Addictive Disorders",
    aliases: ["oud", "opioid addiction", "opioid dependence"],
    baseDifficulty: 3,
    patients: ["37-year-old construction worker", "28-year-old graduate student", "51-year-old veteran", "43-year-old nurse"],
    openings: ["continues opioid use despite overdoses, cravings, and failed attempts to stop", "uses more pills or heroin than intended and spends the day obtaining or recovering", "reports withdrawal symptoms that improve after opioid use"],
    course: ["Use has escalated and control has diminished.", "Work, family, or legal obligations are impaired.", "Tolerance and withdrawal may be present outside appropriate supervised treatment contexts."],
    context: ["The person uses in risky settings or combines opioids with sedatives.", "Craving remains strong despite serious consequences.", "Pain may have started opioid exposure, but addiction features now dominate."],
    core: ["Withdrawal includes aches, diarrhea, rhinorrhea, insomnia, anxiety, and cravings.", "Attempts to taper fail because of craving and withdrawal.", "Important activities are reduced around use."],
    differentiator: ["Appropriate prescribed opioid use without impaired control is not the disorder.", "Sedative or alcohol use disorder may coexist and increases overdose risk.", "Pain disorder alone does not explain craving and compulsive use."],
    anchor: ["The best-fitting diagnosis is a problematic opioid use pattern with impaired control, harm, craving, and possible withdrawal.", "The final clue is opioid craving and continued use despite overdose risk and withdrawal.", "The case favors Opioid Use Disorder because opioid-related impairment and loss of control are central."],
    explanation: "The case points to Opioid Use Disorder because opioid use is marked by impaired control, craving, role impairment, risky use, continued use despite harm, and withdrawal or tolerance features.",
    differentials: ["Chronic Pain Condition", "Sedative Use Disorder", "Major Depressive Disorder"],
    criteriaGuide: [
      "The diagnosis is based on a problematic opioid use pattern with impairment or distress.",
      "Features include impaired control, craving, role failure, social impairment, reduced activities, risky use, and continued use despite harm.",
      "Tolerance and withdrawal count differently when opioids are taken only as prescribed under medical supervision.",
      "Overdose risk, infectious risk, and sedative co-use should be assessed.",
      "Severity is commonly based on the number of features present."
    ],
    premiumDifferentials: [
      { name: "Chronic Pain Condition", distinguishingFeatures: "Pain can require opioids, but OUD involves impaired control, craving, and continued use despite harm." },
      { name: "Sedative Use Disorder", distinguishingFeatures: "Sedative use disorder involves benzodiazepines or related drugs and has different withdrawal risks." },
      { name: "Major Depressive Disorder", distinguishingFeatures: "Depression may coexist or follow opioid use, but it does not explain opioid craving and compulsive use." }
    ],
    howToDifferentiate: [
      "Assess craving, unsuccessful cut-down attempts, risky use, and use despite harm.",
      "Clarify prescribed versus non-prescribed use and whether instructions are followed.",
      "Evaluate overdose history, naloxone access, infectious risks, and sedative co-use."
    ]
  },
  {
    id: "stimulant-use",
    code: "F15.20",
    name: "Stimulant Use Disorder",
    category: "Substance-Related and Addictive Disorders",
    aliases: ["methamphetamine use disorder", "cocaine use disorder", "stimulant addiction"],
    baseDifficulty: 3,
    patients: ["30-year-old delivery driver", "24-year-old student", "41-year-old club promoter", "55-year-old technician"],
    openings: ["uses cocaine or methamphetamine despite paranoia, insomnia, and missed obligations", "reports binges of stimulant use followed by crashes and failed attempts to stop", "continues stimulant use despite chest pain, job loss, and relationship conflict"],
    course: ["Craving and time spent obtaining or recovering from stimulants are prominent.", "Use occurs in larger amounts or longer runs than intended.", "Tolerance, risky use, and continued use despite harm may be present."],
    context: ["The person may have stimulant-induced paranoia, tactile sensations, or mood crashes.", "Sleep and appetite are disrupted.", "Financial, legal, occupational, or interpersonal consequences are mounting."],
    core: ["Binges lead to days without sleep and then exhaustion.", "Attempts to quit trigger dysphoria, fatigue, and craving.", "Use continues despite medical danger or psychotic symptoms."],
    differentiator: ["Bipolar mania can look similar but is not tied to stimulant intoxication and withdrawal cycles.", "ADHD treatment taken as prescribed is not stimulant use disorder.", "Primary psychotic disorder persists beyond substance effects."],
    anchor: ["The best-fitting diagnosis is a problematic stimulant use pattern with craving, impairment, risky use, and continued use despite harm.", "The final clue is stimulant binges with insomnia, crash, paranoia, and loss of control.", "The case favors Stimulant Use Disorder because the symptoms track stimulant use and consequences."],
    explanation: "The case points to Stimulant Use Disorder because stimulant use shows impaired control, craving, risky use, role impairment, and continued use despite physical or psychological harm.",
    differentials: ["Bipolar I Disorder", "Attention-Deficit/Hyperactivity Disorder", "Schizophrenia"],
    criteriaGuide: [
      "The diagnosis is based on problematic amphetamine-type, cocaine, or other stimulant use causing impairment or distress.",
      "Features include impaired control, craving, role failure, social problems, reduced activities, risky use, and continued use despite harm.",
      "Tolerance and withdrawal-like crashes may support the pattern.",
      "Stimulant intoxication can cause anxiety, insomnia, paranoia, and psychosis.",
      "Prescribed stimulant treatment should be distinguished from misuse or compulsive use."
    ],
    premiumDifferentials: [
      { name: "Bipolar I Disorder", distinguishingFeatures: "Mania persists as a mood episode independent of intoxication and withdrawal patterns." },
      { name: "Attention-Deficit/Hyperactivity Disorder", distinguishingFeatures: "ADHD is developmental and not defined by stimulant craving or consequences." },
      { name: "Schizophrenia", distinguishingFeatures: "Primary psychosis persists outside substance effects and includes a longitudinal syndrome." }
    ],
    howToDifferentiate: [
      "Build a timeline linking sleep loss, paranoia, mood, and stimulant use.",
      "Ask about binges, crashes, craving, and unsuccessful attempts to stop.",
      "Separate prescribed therapeutic use from misuse and compulsive patterns."
    ]
  },
  {
    id: "insomnia",
    code: "G47.00",
    name: "Insomnia Disorder",
    category: "Sleep-Wake Disorders",
    aliases: ["insomnia", "chronic insomnia"],
    baseDifficulty: 3,
    patients: ["49-year-old attorney", "28-year-old nurse", "63-year-old retiree", "35-year-old parent"],
    openings: ["reports persistent difficulty falling asleep, staying asleep, or waking too early", "has daytime fatigue and irritability despite adequate chance to sleep", "dreads bedtime because sleep has become unpredictable"],
    course: ["The sleep difficulty occurs repeatedly over months.", "Daytime consequences include fatigue, poor concentration, mood irritability, or work impairment.", "The problem persists despite adequate opportunity and circumstances for sleep."],
    context: ["Caffeine, shift work, substances, and untreated sleep apnea are assessed.", "Anxiety or depression may coexist but does not fully explain the sleep complaint.", "The person spends increasing time in bed trying to force sleep."],
    core: ["Sleep effort and clock-watching worsen arousal.", "The person may sleep better away from the usual bedroom.", "Poor sleep becomes a conditioned cycle."],
    differentiator: ["Circadian rhythm disorders involve misalignment of sleep timing.", "Sleep apnea includes breathing disturbance and nonrestorative sleep.", "Major depression has broader mood and neurovegetative symptoms."],
    anchor: ["The best-fitting diagnosis is persistent sleep initiation or maintenance difficulty with daytime impairment despite adequate sleep opportunity.", "The final clue is chronic insomnia symptoms with functional consequences and no better primary sleep-wake explanation.", "The case favors Insomnia Disorder because sleep difficulty itself is the central complaint."],
    explanation: "The case points to Insomnia Disorder because sleep initiation or maintenance difficulty persists despite adequate opportunity and causes daytime impairment.",
    differentials: ["Circadian Rhythm Sleep-Wake Disorder", "Obstructive Sleep Apnea", "Major Depressive Disorder"],
    criteriaGuide: [
      "Difficulty initiating sleep, maintaining sleep, or early-morning awakening is central.",
      "The sleep problem occurs despite adequate opportunity to sleep.",
      "Daytime distress or impairment is present.",
      "The pattern is persistent and recurrent.",
      "Other sleep-wake disorders, substances, medical conditions, and mental disorders should be assessed."
    ],
    premiumDifferentials: [
      { name: "Circadian Rhythm Sleep-Wake Disorder", distinguishingFeatures: "Circadian disorders involve sleep timing mismatch; insomnia disorder is difficulty sleeping at the desired time despite opportunity." },
      { name: "Obstructive Sleep Apnea", distinguishingFeatures: "Sleep apnea involves breathing disturbance, snoring, witnessed apneas, or oxygen desaturation." },
      { name: "Major Depressive Disorder", distinguishingFeatures: "Depression includes broader mood and cognitive symptoms; insomnia may be one feature." }
    ],
    howToDifferentiate: [
      "Ask about schedule, opportunity, naps, caffeine, substances, and sleep environment.",
      "Screen for snoring, apnea, restless legs, circadian mismatch, and mood disorders.",
      "Look for conditioned arousal and sleep effort around bedtime."
    ]
  }
];

const extraDiagnoses = [
  { id: "specific-phobia", code: "F40.2", name: "Specific Phobia", category: "Anxiety Disorders", aliases: ["phobia"] },
  { id: "agoraphobia", code: "F40.00", name: "Agoraphobia", category: "Anxiety Disorders", aliases: [] },
  { id: "acute-stress", code: "F43.0", name: "Acute Stress Disorder", category: "Trauma- and Stressor-Related Disorders", aliases: [] },
  { id: "adjustment", code: "F43.20", name: "Adjustment Disorder", category: "Trauma- and Stressor-Related Disorders", aliases: [] },
  { id: "brief-psychotic", code: "F23", name: "Brief Psychotic Disorder", category: "Schizophrenia Spectrum and Other Psychotic Disorders", aliases: ["brief psychosis"] },
  { id: "tourette", code: "F95.2", name: "Tourette's Disorder", category: "Neurodevelopmental Disorders", aliases: ["tourette syndrome"] },
  { id: "cannabis-use", code: "F12.20", name: "Cannabis Use Disorder", category: "Substance-Related and Addictive Disorders", aliases: ["marijuana use disorder"] },
  { id: "narcissistic-pd", code: "F60.81", name: "Narcissistic Personality Disorder", category: "Personality Disorders", aliases: ["npd"] },
  { id: "avoidant-pd", code: "F60.6", name: "Avoidant Personality Disorder", category: "Personality Disorders", aliases: ["avpd"] },
  { id: "narcolepsy", code: "G47.419", name: "Narcolepsy", category: "Sleep-Wake Disorders", aliases: [] },
  { id: "gender-dysphoria", code: "F64.9", name: "Gender Dysphoria", category: "Gender Dysphoria", aliases: [] }
];

const settings = [
  "an outpatient visit",
  "a primary care consultation",
  "an emergency assessment",
  "a telehealth follow-up",
  "a family-requested evaluation",
  "a student health appointment"
];

const count = parseCount();
const rng = mulberry32(SEED);
const diagnoses = buildDiagnoses();
const cases = buildCases(count, rng);
const premiumDiagnoses = buildPremiumDiagnoses();
const generatedAt = new Date().toISOString();

await writeOutputs();

console.log(`Generated ${cases.length} fictional training cases.`);
console.log(`Wrote ${diagnoses.length} DSM-5-TR diagnosis labels.`);
console.log("Backend private data: backend/private/cases.json and backend/private/premium-diagnoses.json");

function parseCount() {
  const index = process.argv.indexOf("--count");
  if (index === -1) return DEFAULT_COUNT;
  const value = Number(process.argv[index + 1]);
  if (!Number.isInteger(value) || value < 1) {
    throw new Error("--count must be a positive integer.");
  }
  return value;
}

function buildDiagnoses() {
  const primary = profiles.map(({ id, code, name, category, aliases }) => ({ id, code, name, category, aliases }));
  return uniqueById([...primary, ...extraDiagnoses]).sort((a, b) => a.name.localeCompare(b.name));
}

function buildCases(total, random) {
  return Array.from({ length: total }, (_, index) => {
    const profile = profiles[(index + Math.floor(random() * profiles.length)) % profiles.length];
    return buildCase(index + 1, profile, random);
  });
}

function buildCase(caseNumber, profile, random) {
  const patient = pick(profile.patients, random);
  const difficulty = clamp(profile.baseDifficulty + pick([-1, 0, 0, 1], random), 1, 5);
  const clueMix = shuffle([
    pick(profile.course, random),
    pick(profile.context, random)
  ], random);

  const clues = [
    `A ${patient} ${pick(profile.openings, random)} during ${pick(settings, random)}.`,
    clueMix[0],
    clueMix[1],
    pick(profile.core, random),
    pick(profile.differentiator, random),
    pick(profile.anchor, random)
  ].map(cleanSentence);

  return {
    id: caseNumber,
    caseNumber,
    title: `Training Case ${caseNumber}`,
    patient,
    answerId: profile.id,
    difficulty,
    modeEligible: difficulty >= 3 ? ["classic", "tough"] : ["classic"],
    clues,
    explanation: profile.explanation,
    differentials: profile.differentials,
    generatedBy: "profile-generator-v1"
  };
}

function buildPremiumDiagnoses() {
  return Object.fromEntries(profiles.map((profile) => [
    profile.id,
    {
      diagnosisId: profile.id,
      code: profile.code,
      name: profile.name,
      category: profile.category,
      sourceNote: SOURCE_NOTE,
      criteriaGuide: profile.criteriaGuide,
      differentials: profile.premiumDifferentials,
      howToDifferentiate: profile.howToDifferentiate
    }
  ]));
}

async function writeOutputs() {
  await mkdir(path.join(ROOT, "data"), { recursive: true });
  await mkdir(path.join(ROOT, "backend", "private"), { recursive: true });

  await writeJson("data/diagnoses.json", {
    generatedAt,
    sourceNote: SOURCE_NOTE,
    diagnoses
  });
  await writeJson("data/static-cases.json", {
    generatedAt,
    warning: "Static demo data includes answer IDs for GitHub Pages fallback. Use server.mjs for protected gameplay.",
    cases
  });
  await writeJson("backend/private/cases.json", {
    generatedAt,
    sourceNote: SOURCE_NOTE,
    cases
  });
  await writeJson("backend/private/premium-diagnoses.json", {
    generatedAt,
    diagnoses: premiumDiagnoses
  });
}

async function writeJson(relativePath, value) {
  await writeFile(path.join(ROOT, relativePath), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function pick(values, random) {
  return values[Math.floor(random() * values.length)];
}

function shuffle(values, random) {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

function cleanSentence(value) {
  const trimmed = String(value).trim().replace(/\s+/g, " ");
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function uniqueById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mulberry32(seed) {
  return function nextRandom() {
    let t = seed += 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
