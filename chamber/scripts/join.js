// Set timestamp when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // 1) Timestamp
  const ts = document.getElementById('timestamp');
  if (ts) ts.value = new Date().toISOString();

  // 2) Modals: open/close using <dialog>
  document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-target');
      const dlg = document.getElementById(id);
      if (dlg && typeof dlg.showModal === 'function') dlg.showModal();
    });
  });
  document.querySelectorAll('dialog [data-close]').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('dialog')?.close());
  });
  document.querySelectorAll('dialog').forEach(dlg => {
    dlg.addEventListener('cancel', () => dlg.close()); // ESC
  });

  // 3) Selection sync: radio <-> card highlight
  const radios = document.querySelectorAll('input[name="level"]');
  const cards  = document.querySelectorAll('.benefit[data-level]');

  function highlight(level){
    cards.forEach(c => {
      const match = c.getAttribute('data-level') === level;
      c.classList.toggle('selected', match);
      c.setAttribute('aria-selected', match ? 'true' : 'false');
    });
  }

  function currentLevel(){
    const r = document.querySelector('input[name="level"]:checked');
    return r ? r.value : null;
  }

  // when a radio changes, highlight its card
  radios.forEach(r => {
    r.addEventListener('change', () => highlight(r.value));
  });

  // clicking a card selects the corresponding radio (but not when clicking Learn More)
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.open-modal')) return; // don't toggle on Learn More
      const level = card.getAttribute('data-level');
      const radio = document.querySelector(`input[name="level"][value="${level}"]`);
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });

  // initial highlight (if any preselected)
  const start = currentLevel();
  if (start) highlight(start);
});


  // Modal open/close handlers using <dialog>
  const openers = document.querySelectorAll('.open-modal');
  openers.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('data-target');
      const dlg = document.getElementById(id);
      if (dlg && typeof dlg.showModal === 'function') {
        dlg.showModal();
      }
    });
  });

  document.querySelectorAll('dialog [data-close]').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('dialog')?.close());
  });

  // Close on ESC
  document.querySelectorAll('dialog').forEach(dlg => {
    dlg.addEventListener('cancel', () => dlg.close());
  });
