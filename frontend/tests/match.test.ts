import { test } from "node:test";
import assert from "node:assert/strict";
import { computeScore, aggregateGaps, jobMissesSkill } from "../src/lib/match.ts";

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
