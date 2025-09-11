// timestamp for the form submission
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('timestamp').value = new Date().toISOString();

  // Optional: visually emphasize selected level
  const radios = document.querySelectorAll('input[name="level"]');
  radios.forEach(r => r.addEventListener('change', () => {
    document.querySelectorAll('.benefit').forEach(card => card.classList.remove('active'));
    const idx = Number(document.querySelector('input[name="level"]:checked').value) - 1;
    document.querySelectorAll('.benefit')[idx].classList.add('active');
  }));
});
