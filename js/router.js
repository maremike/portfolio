import { renderProjectsPage } from "./pages/projects.js";
import { renderContactPage } from "./pages/contact.js";
import { renderStartpagePage } from "./pages/startpage.js";
import { renderProductsPage } from "./pages/products.js";
import { render404Page } from "./pages/404.js";
import { renderMyspacePage } from "./pages/myspace.js";
import { renderAboutPage } from "./pages/about.js";
import { renderPrivacyPage } from "./pages/privacy.js";
import { renderSignaturePage } from "./pages/signature.js";
import { renderTosPage } from "./pages/tos.js";

const routes = {
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
  "/404": render404Page
};

export function initRouter() {
  // Handle link clicks
  document.body.addEventListener("click", (e) => {
    if (e.target.tagName === "A" && e.target.href.startsWith(window.location.origin)) {
      e.preventDefault();
      const path = new URL(e.target.href).pathname;
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

export function navigateTo(path) {
  history.pushState({}, "", path);
  render(path);
}

function render(path) {
  const main = document.querySelector("main");
  main.innerHTML = "";

  // Try the exact path first, then fallback to 404
  let contentFn = routes[path] || render404Page;

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