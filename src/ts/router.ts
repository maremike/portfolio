import { renderProjectsPage } from "./pages/projects";
import { renderContactPage } from "./pages/contact";
import { renderStartpagePage } from "./pages/startpage";
import { renderProductsPage } from "./pages/products";
import { render404Page } from "./pages/404";
import { renderMyspacePage } from "./pages/myspace";
import { renderAboutPage } from "./pages/about";
import { renderPrivacyPage } from "./pages/privacy";
import { renderSignaturePage } from "./pages/signature";
import { renderTosPage } from "./pages/tos";
import { renderSupportPage } from "./pages/support";
import { renderSkillsPage } from "./pages/skills";
import { renderResumePage } from "./pages/resume";

// Define type for page render function
type PageRenderFunction = () => string | HTMLElement;

const routes: Record<string, PageRenderFunction> = {
  "/": renderStartpagePage,
  "/index": renderStartpagePage,
  "/products": renderProductsPage,
  "/projects": renderProjectsPage,
  "/contact": renderContactPage,
  "/myspace": renderMyspacePage,
  "/about": renderAboutPage,
  "/privacy": renderPrivacyPage,
  "/signature": renderSignaturePage,
  "/tos": renderTosPage,
  "/404": render404Page,
  "/support": renderSupportPage,
  "/skills": renderSkillsPage,
  "/resume": renderResumePage
};

export function initRouter(): void {
  // Handle link clicks
  document.body.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "A" && target instanceof HTMLAnchorElement && target.href.startsWith(window.location.origin)) {
      e.preventDefault();
      const path = new URL(target.href).pathname;
      navigateTo(path);
    }
  });

  // Handle back/forward
  window.addEventListener("popstate", () => {
    render(window.location.pathname);
  });

  // Initial render
  render(window.location.pathname);
}

export function navigateTo(path: string): void {
  history.pushState({}, "", path);
  render(path);
}

function render(path: string): void {
  const main = document.querySelector("main");

  if (!main) {
    console.error("<main> element not found");
    return;
  }

  main.innerHTML = "";

  const contentFn = routes[path] || render404Page;

  // If showing 404, update the address bar
  if (contentFn === render404Page && window.location.pathname !== "/404") {
    history.replaceState({}, "", "/404");
  }

  const content = contentFn();

  if (typeof content === "string") {
    main.innerHTML = content;
  } else {
    main.appendChild(content);
  }
}