import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GAME_CONFIG } from "./backend/game-config.mjs";

const MAX_CLUES = GAME_CONFIG.maxClues;
const BASE_DATE = GAME_CONFIG.baseDate;
const DEFAULT_MODE = GAME_CONFIG.defaultMode;
const MODE_CONFIG = Object.fromEntries(GAME_CONFIG.modes.map((mode) => [mode.id, mode]));
const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const ROOT_WITH_SEP = ROOT.endsWith(path.sep) ? ROOT : `${ROOT}${path.sep}`;

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"]
]);

const data = await loadData();

createServer(handleRequest).listen(PORT, HOST, () => {
  const displayHost = HOST === "0.0.0.0" ? "127.0.0.1" : HOST;
  console.log(`${GAME_CONFIG.appName} running at http://${displayHost}:${PORT}/`);
  console.log(`Loaded ${data.cases.length} backend cases and ${data.diagnoses.length} DSM-5-TR labels.`);
});

async function loadData() {
  const diagnosesPayload = await loadJson("data/diagnoses.json");
  const casesPayload = await loadJson("backend/private/cases.json");
  const premiumPayload = await loadJson("backend/private/premium-diagnoses.json");
  const diagnoses = diagnosesPayload.diagnoses || diagnosesPayload || [];
  const cases = casesPayload.cases || casesPayload || [];
  const premiumDiagnoses = premiumPayload.diagnoses || premiumPayload || {};

  return {
    diagnoses,
    cases,
    premiumDiagnoses,
    diagnosisById: new Map(diagnoses.map((diagnosis) => [diagnosis.id, diagnosis])),
    premiumById: new Map(Object.entries(premiumDiagnoses))
  };
}

async function loadJson(relativePath) {
  const filePath = path.join(ROOT, relativePath);
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function handleRequest(req, res) {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }
    await serveStatic(req, res, url);
  } catch (error) {
    sendJson(res, 500, { error: "Server error.", detail: error.message });
  }
}

async function handleApi(req, res, url) {
  const method = req.method || "GET";

  if (method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, { ok: true, appName: GAME_CONFIG.appName, cases: data.cases.length, diagnoses: data.diagnoses.length });
    return;
  }

  if (method === "GET" && url.pathname === "/api/config") {
    sendJson(res, 200, { config: publicConfig() });
    return;
  }

  if (method === "GET" && url.pathname === "/api/diagnoses") {
    sendJson(res, 200, { diagnoses: data.diagnoses.map(publicDiagnosis) });
    return;
  }

  if (method === "GET" && url.pathname === "/api/cases/today") {
    const mode = normalizeMode(url.searchParams.get("mode"));
    const date = url.searchParams.get("date") || localDate();
    const caseRecord = selectCaseForDate(data.cases, mode, date);
    sendJson(res, 200, { case: publicCase(caseRecord, startingCluesForMode(mode)) });
    return;
  }

  if (method === "POST" && url.pathname === "/api/guess") {
    const body = await readJsonBody(req);
    const caseRecord = findCase(body.caseId);
    const guessedDiagnosis = data.diagnosisById.get(String(body.diagnosisId || ""));
    if (!caseRecord || !guessedDiagnosis) {
      sendJson(res, 400, { error: "Case or diagnosis not found." });
      return;
    }

    const answer = data.diagnosisById.get(caseRecord.answerId);
    const mode = normalizeMode(body.mode);
    const maxGuesses = modeConfig(mode).maxGuesses;
    const guessedIds = Array.isArray(body.guessedDiagnosisIds) ? body.guessedDiagnosisIds : [body.diagnosisId];
    const guessCount = clamp(guessedIds.length, 1, maxGuesses);
    const revealedClues = clamp(Number(body.revealedClues || 1), 1, MAX_CLUES);
    const correct = guessedDiagnosis.id === answer.id;
    const near = !correct && guessedDiagnosis.category === answer.category;
    const completed = correct || guessCount >= maxGuesses;

    const payload = {
      correct,
      near,
      completed
    };

    if (completed) {
      Object.assign(payload, {
        answer: publicDiagnosis(answer)
      });
      if (!correct) {
        payload.allClues = caseRecord.clues.slice(0, MAX_CLUES);
      }
    } else {
      payload.nextClue = caseRecord.clues[revealedClues] || null;
    }

    sendJson(res, 200, payload);
    return;
  }

  const premiumMatch = url.pathname.match(/^\/api\/premium\/diagnosis\/([^/]+)$/);
  if (method === "GET" && premiumMatch) {
    const configuredToken = process.env.PLUS_ACCESS_TOKEN;
    if (!configuredToken) {
      sendJson(res, 402, { error: "Plus access is not configured on this server." });
      return;
    }

    const token = bearerToken(req);
    if (token !== configuredToken) {
      sendJson(res, 403, { error: "Plus required or invalid token." });
      return;
    }

    const diagnosisId = decodeURIComponent(premiumMatch[1]);
    const premium = data.premiumById.get(diagnosisId);
    if (!premium) {
      sendJson(res, 404, { error: "No Plus guide is available for this diagnosis yet." });
      return;
    }

    sendJson(res, 200, premium);
    return;
  }

  sendJson(res, 404, { error: "API route not found." });
}

async function serveStatic(req, res, url) {
  if (!["GET", "HEAD"].includes(req.method || "GET")) {
    sendText(res, 405, "Method not allowed");
    return;
  }

  const pathname = decodeURIComponent(url.pathname);
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const filePath = path.resolve(ROOT, relative);
  const relativeForPolicy = path.relative(ROOT, filePath).replace(/\\/g, "/");

  if (
    (!filePath.startsWith(ROOT_WITH_SEP) && filePath !== ROOT) ||
    relativeForPolicy.startsWith("backend/private/") ||
    relativeForPolicy.startsWith(".git/") ||
    relativeForPolicy === "data/static-cases.json"
  ) {
    sendText(res, 404, "Not found");
    return;
  }

  try {
    const file = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": contentTypes.get(path.extname(filePath).toLowerCase()) || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    res.end(file);
  } catch {
    sendText(res, 404, "Not found");
  }
}

function publicCase(caseRecord, clueCount) {
  return {
    id: caseRecord.id,
    caseNumber: caseRecord.caseNumber || caseRecord.id,
    title: caseRecord.title,
    patient: caseRecord.patient,
    difficulty: caseRecord.difficulty,
    totalClues: Math.min(MAX_CLUES, caseRecord.clues.length),
    clues: caseRecord.clues.slice(0, clueCount)
  };
}

function publicDiagnosis(diagnosis) {
  return {
    id: diagnosis.id,
    code: diagnosis.code,
    name: diagnosis.name,
    category: diagnosis.category,
    aliases: diagnosis.aliases || []
  };
}

function selectCaseForDate(cases, mode, date) {
  const difficulty = modeConfig(mode).difficulty;
  const pool = difficulty === "difficult"
    ? cases.filter((caseRecord) => Number(caseRecord.difficulty || 0) >= 4)
    : difficulty === "easy"
      ? cases.filter((caseRecord) => Number(caseRecord.difficulty || 0) <= 3)
    : cases;
  const usablePool = pool.length ? pool : cases;
  const offset = modeConfig(mode).offset;
  const index = (daysSinceBase(date) + offset) % usablePool.length;
  return usablePool[index];
}

function findCase(caseId) {
  return data.cases.find((caseRecord) => String(caseRecord.id) === String(caseId));
}

function normalizeMode(mode) {
  return MODE_CONFIG[mode] ? mode : DEFAULT_MODE;
}

function modeConfig(mode) {
  return MODE_CONFIG[mode] || MODE_CONFIG[DEFAULT_MODE] || GAME_CONFIG.modes[0];
}

function startingCluesForMode(mode) {
  return Math.min(MAX_CLUES, modeConfig(mode).startingClues);
}

function publicConfig() {
  return {
    appName: GAME_CONFIG.appName,
    maxClues: GAME_CONFIG.maxClues,
    defaultMode: GAME_CONFIG.defaultMode,
    modes: GAME_CONFIG.modes.map((mode) => ({
      id: mode.id,
      label: mode.label,
      description: mode.description,
      startingClues: mode.startingClues,
      maxGuesses: mode.maxGuesses
    })),
    howToPlay: GAME_CONFIG.howToPlay
  };
}

function localDate() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function daysSinceBase(dateString) {
  const start = new Date(`${BASE_DATE}T00:00:00Z`);
  const current = new Date(`${dateString}T00:00:00Z`);
  return Math.max(0, Math.floor((current - start) / 86400000));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
}

async function readJsonBody(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 1_000_000) {
      throw new Error("Request body too large.");
    }
  }
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}

function bearerToken(req) {
  const authorization = req.headers.authorization || "";
  if (authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.slice(7).trim();
  }
  return req.headers["x-plus-token"] || "";
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, status, text) {
  res.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(text);
}
