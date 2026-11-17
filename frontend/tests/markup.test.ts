import { test } from "node:test";
import assert from "node:assert/strict";
import { markSkills, plainJobText } from "../src/lib/markup.ts";

const s = (name: string, status = "missing", job_term = name, resume_term: string | null = null) =>
  ({
    name,
    key: name.toLowerCase(),
    importance: "required",
    status,
    weight: 1,
    credit: status === "matched" ? 1 : 0,
    via: null,
    job_term,
    resume_term,
  }) as any;

const marked = (text: string, skills: any[]) =>
  markSkills(text, skills)
    .filter((seg) => seg.skill)
    .map((seg) => `${seg.text}=${seg.skill!.name}`);

test("joins back to the original text", () => {
  const text = "Python, SQL and python3 with C++ or C#.";
  const skills = [s("Python"), s("SQL"), s("C++"), s("C#")];
  assert.equal(markSkills(text, skills).map((seg) => seg.text).join(""), text);
});

test("marks every occurrence, case-insensitive", () => {
  assert.deepEqual(marked("Python and python", [s("Python")]), ["Python=Python", "python=Python"]);
});

test("searches job_term, name and resume_term", () => {
  const ml = s("Machine Learning", "matched", "ML", "machine-learning");
  assert.deepEqual(marked("ML and machine learning, or machine-learning", [ml]), [
    "ML=Machine Learning",
    "machine learning=Machine Learning",
    "machine-learning=Machine Learning",
  ]);
});

test("respects word boundaries like the backend", () => {
  assert.deepEqual(marked("maintain", [s("AI")]), []);
  assert.deepEqual(marked("AI-driven", [s("AI")]), ["AI=AI"]);
  assert.deepEqual(marked("C++", [s("C")]), []);
  assert.deepEqual(marked("C++ and C#", [s("C++"), s("C#")]), ["C++=C++", "C#=C#"]);
  assert.deepEqual(marked("Google", [s("Go")]), []);
});

test("longest term wins, no overlaps", () => {
  assert.deepEqual(marked("deep learning", [s("Learning"), s("Deep Learning")]), ["deep learning=Deep Learning"]);
});

test("escapes regex characters", () => {
  assert.deepEqual(marked("Node.js and .NET", [s(".NET"), s("Node.js")]), ["Node.js=Node.js", ".NET=.NET"]);
  assert.deepEqual(marked("Nodexjs", [s("Node.js")]), []);
});

test("unknown terms leave text plain", () => {
  assert.deepEqual(markSkills("Kotlin only", [s("Rust")]), [{ text: "Kotlin only" }]);
  assert.deepEqual(markSkills("Kotlin only", []), [{ text: "Kotlin only" }]);
});

test("empty text", () => {
  assert.deepEqual(markSkills("", [s("Python")]), []);
});

test("plainJobText strips bold markers", () => {
  assert.equal(plainJobText("**About** the job"), "About the job");
});

test("ambiguous words are marked only as written and capitalised, never single letters", () => {
  const go = s("Go", "missing", "Go");
  const rest = s("REST API", "missing", "REST");
  assert.deepEqual(marked("the rest of the team and go above and beyond on go-to-market", [go, rest]), []);
  assert.deepEqual(marked("Build REST APIs in Go", [go, rest]), ["REST=REST API", "Go=Go"]);
  assert.deepEqual(marked("You excel at SQL", [s("Microsoft Excel", "missing", "excel")]), []);
  assert.deepEqual(marked("Series C funding, R&D and the C-suite", [s("C"), s("R")]), []);
});
