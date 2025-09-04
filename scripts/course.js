// Course data (you can flip completed: true on the ones you've finished)
const courses = [
  { subject:'CSE', number:110, title:'Introduction to Programming', credits:2, certificate:'Web and Computer Programming', technology:['Python'], completed:false },
  { subject:'WDD', number:130, title:'Web Fundamentals', credits:2, certificate:'Web and Computer Programming', technology:['HTML','CSS'], completed:false },
  { subject:'CSE', number:111, title:'Programming with Functions', credits:2, certificate:'Web and Computer Programming', technology:['Python'], completed:false },
  { subject:'CSE', number:210, title:'Programming with Classes', credits:2, certificate:'Web and Computer Programming', technology:['C#'], completed:false },
  { subject:'WDD', number:131, title:'Dynamic Web Fundamentals', credits:2, certificate:'Web and Computer Programming', technology:['HTML','CSS','JavaScript'], completed:false },
  { subject:'WDD', number:231, title:'Frontend Web Development I', credits:2, certificate:'Web and Computer Programming', technology:['HTML','CSS','JavaScript'], completed:false }
];

// DOM targets
const listEl = document.getElementById('courseList');
const totalEl = document.getElementById('creditTotal');

// Render function
function renderCourses(items){
  if (!listEl || !totalEl) return;
  listEl.innerHTML = '';
  items.forEach(c => {
    const card = document.createElement('div');
    card.className = `course-card ${c.completed ? 'completed' : ''}`;
    card.innerHTML = `
      <strong>${c.subject} ${c.number}</strong>
      <span class="title">${c.title}</span>
      <span>${c.credits} cr</span>
    `;
    listEl.appendChild(card);
  });
  const credits = items.reduce((s,c)=>s + c.credits, 0);
  totalEl.textContent = credits;
}

// Filtering (event delegation for .chip buttons)
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('.chip');
  if (!btn) return;
  const f = btn.dataset.filter;
  const data = f === 'ALL' ? courses : courses.filter(c => c.subject === f);
  renderCourses(data);
});

// Initial render (All)
renderCourses(courses);
