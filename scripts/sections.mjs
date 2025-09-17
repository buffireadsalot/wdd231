// sections.mjs
// Populates the <select> control with available sections.

export function setSectionSelection(sections) {
  const select = document.querySelector("#sectionNumber");
  if (!select) return;

  // Clear then populate
  select.innerHTML = "";
  for (const s of sections) {
    const opt = document.createElement("option");
    opt.value = s.id;
    const seatsLeft = Math.max(0, s.capacity - s.enrolled);
    opt.textContent = `${s.id} — ${seatsLeft} seats left`;
    select.appendChild(opt);
  }
}
