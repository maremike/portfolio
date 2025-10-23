import { checkColorScheme } from "./themes";

export async function loadSVG(container: HTMLElement, url: string) {
  try {
    const res = await fetch(url);
    const svgText = await res.text();
    container.innerHTML = svgText;
    const svgEl = container.querySelector("svg");
    if (svgEl) {
      svgEl.setAttribute("width", "auto");
    }
  } catch (err) {
    console.error("Failed to load SVG:", err);
  }
}

export function getThemeSVG(light: string, dark: string): string {
  const colorScheme = checkColorScheme(); // Determine mode automatically
  const currentSvg = colorScheme === "dark" ? light : dark; // invert if needed
  return currentSvg;
}

type SVGWatchItem = {
  element: HTMLElement;
  light: string;
  dark: string;
};

// The list of all SVGs being watched
const svgWatchers: SVGWatchItem[] = [];

// Flag to ensure system listener is registered only once
let systemListenerRegistered = false;

/**
 * Adds a new SVG element to the watcher list.
 * Automatically reloads the SVG for the current theme.
 */
export function addSVGToWatcher(element: HTMLElement, light: string, dark: string) {
  svgWatchers.push({ element, light, dark });
  
  // Load immediately
  const currentTheme = checkColorScheme();
  const url = currentTheme === "dark" ? dark : light;
  loadSVG(element, url);

  // Ensure system listener is registered once
  if (!systemListenerRegistered && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      reloadSVGs(e.matches ? 'dark' : 'light');
    });
    systemListenerRegistered = true;
  }
}

/**
 * Call this after switchToDarkMode / switchToLightMode to reload all SVGs
 */
export function notifyThemeChange() {
  const theme = checkColorScheme();
  reloadSVGs(theme);
}

/**
 * Reload all watched SVGs based on theme
 */
function reloadSVGs(theme: 'dark' | 'light') {
  for (const { element, light, dark } of svgWatchers) {
    const url = theme === 'dark' ? dark : light;
    loadSVG(element, url);
  }
}