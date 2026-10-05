import test from "node:test";
import assert from "node:assert/strict";
import { AUDIT_STEPS, NAV_SECTIONS, locate } from "../src/data/tools";

test("Tools: the top bar finds each page's section and name", () => {
  assert.deepEqual(locate("/dashboard"), { section: "Workspace", name: "Overview" });
  assert.deepEqual(locate("/compare/resume-job"), { section: "Compare", name: "Resume ↔ Job" });
  assert.equal(locate("/not-a-page"), null);
});

test("Tools: every tool in the library is once in it and reachable from the menu", () => {
  const library = AUDIT_STEPS.flatMap((step) => step.tools.map((tool) => tool.to));
  const menu = new Set(NAV_SECTIONS.flatMap((section) => section.items.map((item) => item.to)));
  assert.equal(new Set(library).size, library.length);
  for (const to of library) assert.ok(menu.has(to), `${to} is not in the menu`);
});
