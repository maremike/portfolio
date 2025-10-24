import { getCurrentTheme } from "./themes";

export function getThemeSVG(light: string, dark: string): string {
  const colorScheme = getCurrentTheme(); // Determine mode automatically
  const currentSvg = colorScheme === "dark" ? light : dark; // invert if needed
  return currentSvg;
}

/**
 * Registry for all themed SVGs across the site.
 */
export type themedSVGRegistry = {
  alt: string;
  container: HTMLElement;
  light: string;
  dark: string;
}[];

/**
 * Dynamically load an SVG into a container.
 */
async function loadSVG(alt: string, container: HTMLElement, url: string) {
  try {
    const res = await fetch(url);
    const svgText = await res.text();

    container.innerHTML = svgText;

    const svgEl = container.querySelector("svg");

    if (svgEl) {
      svgEl.setAttribute("role", "img");
      svgEl.setAttribute("aria-label", alt);
    }
  } catch (err) {
    console.error("Failed to load SVG:", err);
  }
}

/**
 * Registers an SVG element with both its light and dark URLs.
 * When the theme changes, all registered SVGs are automatically updated.
 */
export function registerThemedSVG(
  themedSVGRegistry: themedSVGRegistry,
  alt: string,
  container: HTMLElement,
  lightURL: string,
  darkURL: string
) {
  themedSVGRegistry.push({ alt: alt, container, light: lightURL, dark: darkURL });

  // Load the correct version initially
  const currentScheme = getCurrentTheme();
  loadSVG(alt, container, currentScheme === "dark" ? lightURL : darkURL);
}

/**
 * Update all registered SVGs when the theme changes.
 */
function updateAllSVGs(themedSVGRegistry: themedSVGRegistry) {
  const currentScheme = getCurrentTheme();
  themedSVGRegistry.forEach(({ alt, container, light, dark }) => {
    loadSVG(alt, container, currentScheme === "dark" ? light : dark);
  });
}

/**
 * Set up listeners so that SVGs auto-update on theme change.
 * Should be called once, right after initTheme().
 */
export function initThemedSVGs(themedSVGRegistry: themedSVGRegistry) {
  // Handle system preference change
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => updateAllSVGs(themedSVGRegistry));

  // Optional: expose a manual trigger (for your toggle button)
  window.addEventListener("themechange", () => updateAllSVGs(themedSVGRegistry));
}
