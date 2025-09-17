// modules.mjs
// Wires up the modules: imports, initialization, and event listeners only.

import byuiCourse from "./course.mjs";
import { setSectionSelection } from "./sections.mjs";
import { setTitle, renderSections } from "./output.mjs";

const msg = (text, ok = true) => {
  const el = document.querySelector("#message");
  if (!el) return;
  el.textContent = text;
  el.style.color = ok ? "var(--accent-2)" : "var(--danger)";
};

// Initialize UI
setTitle(byuiCourse);
setSectionSelection(byuiCourse.sections);
renderSections(byuiCourse.sections);

// Event listeners — include renderSections(...) as per “Check Your Understanding”
document.querySelector("#enrollStudent")?.addEventListener("click", () => {
  const sectionId = document.querySelector("#sectionNumber")?.value;
  const { ok, message } = byuiCourse.changeEnrollment(sectionId, true);
  msg(message, ok);
  renderSections(byuiCourse.sections);
  setSectionSelection(byuiCourse.sections); // keep the seats-left labels fresh
});

document.querySelector("#dropStudent")?.addEventListener("click", () => {
  const sectionId = document.querySelector("#sectionNumber")?.value;
  const { ok, message } = byuiCourse.changeEnrollment(sectionId, false);
  msg(message, ok);
  renderSections(byuiCourse.sections);
  setSectionSelection(byuiCourse.sections); // keep the seats-left labels fresh
});
