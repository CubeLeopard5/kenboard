// Dark-mode toggle: persistence, document attribute, and button sync.
//
// jsdom under Vitest runs on an opaque origin, where ``localStorage`` is not
// a usable Storage. We stub a tiny in-memory store so the persistence path
// is exercised deterministically without depending on the environment.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bindTheme, currentTheme, toggleTheme } from './theme.js';

function makeStorage() {
  let store = {};
  return {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => {
      store[k] = String(v);
    },
    removeItem: (k) => {
      delete store[k];
    },
    clear: () => {
      store = {};
    },
  };
}

beforeEach(() => {
  document.documentElement.removeAttribute('data-theme');
  document.body.innerHTML = '<button class="kb-theme-btn" aria-pressed="false">☾</button>';
  vi.stubGlobal('localStorage', makeStorage());
});

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  vi.unstubAllGlobals();
});

describe('currentTheme', () => {
  it('defaults to light when no attribute is set', () => {
    expect(currentTheme()).toBe('light');
  });

  it('reads the data-theme attribute', () => {
    document.documentElement.dataset.theme = 'dark';
    expect(currentTheme()).toBe('dark');
  });
});

describe('toggleTheme', () => {
  it('switches light → dark and persists the choice', () => {
    document.documentElement.dataset.theme = 'light';
    toggleTheme();
    expect(currentTheme()).toBe('dark');
    expect(localStorage.getItem('kb-theme')).toBe('dark');
  });

  it('switches dark → light', () => {
    document.documentElement.dataset.theme = 'dark';
    toggleTheme();
    expect(currentTheme()).toBe('light');
    expect(localStorage.getItem('kb-theme')).toBe('light');
  });

  it('updates the button glyph and aria-pressed', () => {
    document.documentElement.dataset.theme = 'light';
    toggleTheme();
    const btn = document.querySelector('.kb-theme-btn');
    expect(btn.textContent).toBe('☀');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });
});

describe('bindTheme', () => {
  it('toggles the theme when the button is clicked', () => {
    document.documentElement.dataset.theme = 'light';
    bindTheme();
    document.querySelector('.kb-theme-btn').click();
    expect(currentTheme()).toBe('dark');
  });

  it('syncs the button glyph to the booted theme on bind', () => {
    document.documentElement.dataset.theme = 'dark';
    bindTheme();
    expect(document.querySelector('.kb-theme-btn').textContent).toBe('☀');
  });
});
