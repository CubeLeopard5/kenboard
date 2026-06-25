// Dark-mode toggle (ken task « Mode sombre »). The no-flash bootstrap in
// base.html's <head> sets ``document.documentElement.dataset.theme`` before
// the first paint (read from localStorage, falling back to the OS
// ``prefers-color-scheme``), so the dark palette applies with no white
// flash. This module owns the *runtime* behaviour: toggling on click,
// persisting the choice, and keeping the header button glyph in sync.
//
// The whole theme is a palette swap — every surface/text/border colour in
// style.css resolves through the :root custom properties, which the
// ``[data-theme="dark"]`` block redefines. So flipping the attribute is all
// that's needed; no per-component work.

const STORAGE_KEY = 'kb-theme';

/** Return the theme currently applied to the document (``'light'`` | ``'dark'``). */
export function currentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

// Reflect ``theme`` onto the <html> element and refresh the toggle button so
// its glyph/label/pressed-state advertise the action that the next click does.
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const btn = document.querySelector('.kb-theme-btn');
  if (!btn) return;
  const dark = theme === 'dark';
  btn.textContent = dark ? '☀' : '☾'; // ☀ when dark, ☾ when light
  btn.setAttribute('aria-pressed', String(dark));
  btn.title = dark ? 'Passer en mode clair' : 'Passer en mode sombre';
}

/** Flip the theme, persist the new value, and update the document + button. */
export function toggleTheme() {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Private mode / storage disabled: the toggle still works for this
    // page view, it just won't be remembered across reloads.
  }
  applyTheme(next);
}

/** Wire the header toggle button and sync its glyph with the booted theme. */
export function bindTheme() {
  const btn = document.querySelector('.kb-theme-btn');
  if (btn) btn.addEventListener('click', toggleTheme);
  applyTheme(currentTheme());
}
