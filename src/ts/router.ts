import { renderProjectsPage } from "./pages/projects";
import { renderContactPage } from "./pages/contact";
import { renderStartpagePage } from "./pages/startpage";
import { renderProductsPage } from "./pages/products";
import { render404Page } from "./pages/404";
import { renderMyspacePage } from "./pages/myspace";
import { renderAboutPage } from "./pages/legal";
import { renderPrivacyPage } from "./pages/privacy";
import { renderSignaturePage } from "./pages/signature";
import { renderTosPage } from "./pages/tos";
import { renderSupportPage } from "./pages/support";
import { renderSkillsPage } from "./pages/skills";
import { renderResumePage } from "./pages/resume";
import { detectLanguage, extractLangAndPath } from "./language";

// Define type for page render function
type PageRenderFunction = () => string | HTMLElement;

const routes: Record<string, PageRenderFunction> = {
  "/": renderStartpagePage,
  "/index": renderStartpagePage,
  "/products": renderProductsPage,
  "/projects": renderProjectsPage,
  "/contact": renderContactPage,
  "/myspace": renderMyspacePage,
  "/legal": renderAboutPage,
  "/privacy": renderPrivacyPage,
  "/signature": renderSignaturePage,
  "/tos": renderTosPage,
  "/404": render404Page,
  "/support": renderSupportPage,
  "/skills": renderSkillsPage,
  "/resume": renderResumePage
};

export function initRouter(): void {
  document.body.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Find closest element with routing intent
    const routeEl = target.closest<HTMLElement>('a[href], [data-href]');

    if (!routeEl) return;

    // Extract href from either <a> tag or data-href attribute
    const href = routeEl instanceof HTMLAnchorElement
      ? routeEl.href
      : routeEl.getAttribute("data-href");

    if (!href || !href.startsWith(window.location.origin)) return;

    e.preventDefault();
    const path = new URL(href).pathname;
    navigateTo(path);
  });

  window.addEventListener("popstate", () => {
    render(window.location.pathname);
  });

  render(window.location.pathname);
}

export function navigateTo(path: string): void {
  // Extract current lang from current URL
  const { lang: currentLang } = extractLangAndPath(window.location.pathname);
  console.log("Current Path:", window.location.pathname);

  // Extract lang from the new path too (maybe it's absolute like /en/products)
  const { lang: newLang } = extractLangAndPath(path);
  console.log("New Path:", path);

  let finalPath = path;

  if (!newLang && currentLang) {
    // If the new path does NOT have lang, but current URL has lang, add it
    finalPath = "/" + currentLang + (path.startsWith("/") ? path : "/" + path);
  } else if (newLang) {
    // The new path already contains a language prefix, so keep as is
    finalPath = path;
  } else {
    // Neither current nor new has a lang prefix, leave path as is
    finalPath = "/" + detectLanguage() + (path.startsWith("/") ? path : "/" + path);
  }

  history.pushState({}, "", finalPath);
  render(finalPath);
}

function render(fullPath: string): void {
  const main = document.querySelector("main");

  if (!main) {
    console.error("<main> element not found");
    return;
  }

  // Extract the language and path from the URL
  const { lang, path } = extractLangAndPath(fullPath);

  // Ensure the /404 path handles language correctly
  const contentFn = routes[path] || render404Page;

  // If rendering 404 page, replace the URL with the correct language version of /404
  if (contentFn === render404Page && fullPath !== "/404") {
    const new404Path = `/${lang}/404`; // Make sure to include the language prefix
    history.replaceState({}, "", new404Path);
  }

  main.innerHTML = "";

  const content = contentFn();
  if (typeof content === "string") {
    main.innerHTML = content;
  } else {
    main.appendChild(content);
  }
}

