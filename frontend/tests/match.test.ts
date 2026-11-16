import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeScore,
  aggregateGaps,
  jobMissesSkill,
  matchLabel,
  scoreBreakdown,
  skillPreview,
  matchSummary,
  biggestGaps,
  searchStage,
  missingFields,
} from "../src/lib/match.ts";

const s = (key: string, status: string, importance = "required") =>
  ({
    name: key,
    key,
    importance,
    status,
    weight: importance === "required" ? 1 : 0.5,
    credit: status === "matched" ? 1 : status === "partial" ? 0.5 : 0,
    via: null,
    job_term: key,
    resume_term: null,
  }) as any;
const quarter = [s("a", "partial"), s("b", "missing"), s("c", "missing"), s("d", "missing")];

test("matches backend formula", () => {
  assert.equal(computeScore([s("python", "matched"), s("docker", "missing"), s("tf", "partial", "preferred")]), 50);
});
test("rounds half up like the backend", () => assert.equal(computeScore(quarter), 13));
test("marking a partial skill gives full credit", () => assert.equal(computeScore(quarter, new Set(["a"])), 25));
test("marking a missing skill", () =>
  assert.equal(computeScore([s("python", "matched"), s("docker", "missing")], new Set(["docker"])), 100));
test("no skills is null", () => assert.equal(computeScore([]), null));

const jobs = [
  { match: { skills: [s("python", "matched"), s("docker", "missing")] } },
  { match: { skills: [s("docker", "missing"), s("graphql", "partial")] } },
  { match: { skills: [s("python", "matched")] } },
] as any[];
test("aggregates gaps across jobs", () => {
  assert.deepEqual(aggregateGaps(jobs), [
    { key: "docker", name: "docker", missingIn: 2, total: 3 },
    { key: "graphql", name: "graphql", missingIn: 1, total: 3 },
  ]);
  assert.equal(aggregateGaps(jobs, 1).length, 1);
});
test("jobMissesSkill", () => {
  assert.equal(jobMissesSkill(jobs[1], "graphql"), true);
  assert.equal(jobMissesSkill(jobs[0], "python"), false);
});

test("matchLabel bands", () => {
  assert.deepEqual([70, 69, 45, 44, 25, 24, 0].map((n) => matchLabel(n)?.label),
    ["Strong match", "Good match", "Good match", "Fair match", "Fair match", "Low match", "Low match"]);
  assert.deepEqual([80, 50, 30, 10].map((n) => matchLabel(n)?.tone), ["emerald", "teal", "amber", "rose"]);
  assert.equal(matchLabel(null), null);
});
const mix = [s("py", "matched"), s("docker", "missing"), s("tf", "partial"),
             s("gcp", "missing", "preferred"), s("dlib", "matched", "preferred")];
test("scoreBreakdown adds up to computeScore", () => {
  assert.deepEqual(scoreBreakdown(mix), { earned: 2, total: 4, score: 50,
    required: { matched: 1, partial: 1, total: 3 }, preferred: { matched: 1, partial: 0, total: 2 } });
  const marked = scoreBreakdown(mix, new Set(["docker", "tf"]));
  assert.deepEqual([marked.earned, marked.score, marked.required.matched, marked.required.partial], [3.5, 88, 3, 0]);
  assert.equal(marked.score, computeScore(mix, new Set(["docker", "tf"])));
  assert.deepEqual(scoreBreakdown([]), { earned: 0, total: 0, score: null,
    required: { matched: 0, partial: 0, total: 0 }, preferred: { matched: 0, partial: 0, total: 0 } });
});
test("skillPreview lists required first and skips partial", () => {
  const skills = [s("dlib", "matched", "preferred"), s("py", "matched"), s("sql", "matched"), s("aws", "matched"),
                  s("gcp", "missing", "preferred"), s("docker", "missing"), s("tf", "partial")];
  assert.deepEqual(skillPreview(skills), { matches: ["py", "sql", "aws"], missing: ["docker", "gcp"] });
  assert.deepEqual(skillPreview(skills, 1), { matches: ["py"], missing: ["docker"] });
});
test("matchSummary counts every skill and mentions close matches only when there are some", () => {
  assert.equal(matchSummary(scoreBreakdown(mix)), "You have 2 of 5 skills the job asks for, plus 1 close match.");
  assert.equal(matchSummary(scoreBreakdown(mix, new Set(["tf"]))), "You have 3 of 5 skills the job asks for.");
  assert.equal(matchSummary(scoreBreakdown(quarter)), "You have 0 of 4 skills the job asks for, plus 1 close match.");
  assert.equal(matchSummary(scoreBreakdown([s("a", "partial"), s("b", "partial")])),
    "You have 0 of 2 skills the job asks for, plus 2 close matches.");
});
test("biggestGaps lists missing skills required first, leaves out marked ones and counts the rest", () => {
  const skills = [s("gcp", "missing", "preferred"), s("docker", "missing"), s("k8s", "missing"),
                  s("sql", "missing"), s("tf", "partial"), s("py", "matched")];
  assert.deepEqual(biggestGaps(skills), { names: ["docker", "k8s", "sql"], more: 1 });
  assert.deepEqual(biggestGaps(skills, new Set(["docker"])), { names: ["k8s", "sql", "gcp"], more: 0 });
  assert.deepEqual(biggestGaps([s("py", "matched")]), { names: [], more: 0 });
});
test("searchStage by elapsed time", () => {
  assert.deepEqual([0, 7.9, 8, 19, 20, 120].map(searchStage), [
    "Searching LinkedIn / Indeed…", "Searching LinkedIn / Indeed…", "Reading job descriptions…",
    "Reading job descriptions…", "Scoring against your resume…", "Scoring against your resume…"]);
});

test("missingFields lists what's still needed, in step order", () => {
  const empty = { hasResume: false, searchTerm: "  ", country: "", city: "", jobType: "", sites: [] };
  assert.deepEqual(missingFields(empty), [
    "your resume", "a job title", "a country", "a city", "a job type", "at least one source"]);
  assert.deepEqual(missingFields({ hasResume: true, searchTerm: "ML Engineer", country: "India", city: "Bangalore",
    jobType: "fulltime", sites: ["indeed"] }), []);
});
