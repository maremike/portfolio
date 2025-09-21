import { renderProjectsPage } from "./pages/projects.js";
import { renderContactPage } from "./pages/contact.js";
import { renderStartpagePage } from "./pages/startpage.js";
import { renderProductsPage } from "./pages/products.js";
import { render404Page } from "./pages/404.js";
import { renderMyspacePage } from "./pages/myspace.js";
import { renderAboutPage } from "./pages/about.js";
import { renderPrivacyPage } from "./pages/privacy.js";

const routes = {
  "/": renderStartpagePage,
  "/index.html": renderStartpagePage,
  "/products.html": renderProductsPage,
  "/projects.html": renderProjectsPage,
  "/contact.html": renderContactPage,
  "/myspace.html": renderMyspacePage,
  "/about.html": renderAboutPage,
  "/privacy.html": renderPrivacyPage,
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

  const contentFn = routes[path] || render404Page;
  const content = contentFn();

  if (typeof content === "string") {
    main.innerHTML = content;
  } else {
    main.appendChild(content);
  }
}