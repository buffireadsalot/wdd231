// output.mjs
// Renders the course title and sections table.

export function setTitle(course) {
  const h1 = document.querySelector("#courseTitle");
  if (h1) h1.textContent = course.title ?? "Course";
}

export function renderSections(sections) {
  const tbody = document.querySelector("#sectionsBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  for (const s of sections) {
    const tr = document.createElement("tr");
    const seatsLeft = Math.max(0, s.capacity - s.enrolled);
    if (seatsLeft === 0) tr.classList.add("full");

    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.enrolled}</td>
      <td>${s.capacity}</td>
      <td>${seatsLeft}</td>
      <td>${s.schedule}</td>
    `;
    tbody.appendChild(tr);
  }
}
