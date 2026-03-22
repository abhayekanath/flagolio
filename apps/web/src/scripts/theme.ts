const STORAGE_KEY = "flags-theme";

export type ThemeChoice = "light" | "dark" | "system";

function getStored(): ThemeChoice | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* ignore */
  }
  return null;
}

function currentTheme(): ThemeChoice {
  const t = document.documentElement.dataset.theme;
  if (t === "light" || t === "dark" || t === "system") return t;
  return "system";
}

function updateThemeButtons() {
  const active = currentTheme();
  document.querySelectorAll<HTMLButtonElement>(".theme-switch__btn").forEach(
    (btn) => {
      const choice = btn.dataset.themeChoice as ThemeChoice | undefined;
      if (!choice) return;
      const pressed = choice === active;
      btn.setAttribute("aria-pressed", pressed ? "true" : "false");
    },
  );
}

export function applyTheme(theme: ThemeChoice) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
  updateThemeButtons();
}

export function initThemeUi() {
  const stored = getStored();
  if (stored) {
    applyTheme(stored);
  } else {
    updateThemeButtons();
  }

  document.querySelectorAll<HTMLButtonElement>(".theme-switch__btn").forEach(
    (btn) => {
      btn.addEventListener("click", () => {
        const choice = btn.dataset.themeChoice as ThemeChoice | undefined;
        if (choice === "light" || choice === "dark" || choice === "system") {
          applyTheme(choice);
        }
      });
    },
  );

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", () => {
    if (currentTheme() === "system") {
      /* CSS handles appearance; re-sync pressed state if needed */
      updateThemeButtons();
    }
  });
}
