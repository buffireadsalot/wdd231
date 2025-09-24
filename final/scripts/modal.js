let lastFocus = null;


export function openModal(contentHtml, { title = 'Details' } = {}) {
    lastFocus = document.activeElement;


    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
<header>
<h3 id="modal-title">${title}</h3>
<button class="close" aria-label="Close">✕</button>
</header>
<div class="body">${contentHtml}</div>
</div>`;


    function trap(e) {
        if (e.key === 'Escape') close();
        if (e.key === 'Tab') {
            const f = backdrop.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    }


    function close() {
        backdrop.remove();
        document.removeEventListener('keydown', trap);
        if (lastFocus) lastFocus.focus();
    }


    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
    backdrop.querySelector('.close').addEventListener('click', close);
    document.addEventListener('keydown', trap);


    document.getElementById('modal-root').appendChild(backdrop);
    backdrop.querySelector('.close').focus();
}