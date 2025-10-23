import { navigateTo } from "../router";
import { getThemeSVG, loadSVG } from "../utility/svg";

export interface NavItem {
  text?: string;
  href: string;
  image?: string;
}

export function createHamburgerMenu(navItems: NavItem[]): HTMLButtonElement {
  // --- Fullscreen overlay ---
  const overlay: HTMLElement = document.createElement("nav");
  overlay.className = "hamburger-overlay";
  overlay.setAttribute("aria-label", "Primary navigation");

  // --- Nav items ---
  const buttons: HTMLButtonElement[] = [];

  navItems.forEach((item) => {
    const button: HTMLButtonElement = document.createElement("button");
    button.className = "hamburger-link";
    button.textContent = item.text ?? "";

    // --- Right arrow/diamond ---
    const arrow: HTMLSpanElement = document.createElement("span");
    arrow.className = "hamburger-arrow";
    loadSVG(arrow, getThemeSVG("https://cdn.michael.markov.uk/icons/bootstrap/ffffffff/chevron-right.svg", 
      "https://cdn.michael.markov.uk/icons/bootstrap/000000ff/chevron-right.svg"));
    button.appendChild(arrow);

    // Handle routing (replace this with your SPA router if needed)
    button.addEventListener("click", () => {
      navigateTo(item.href);
      closeMenu();
    });

    overlay.appendChild(button);
    buttons.push(button);
  });

  document.body.appendChild(overlay);

  // --- Close button (X) ---
  const closeBtn: HTMLButtonElement = document.createElement("button");
  closeBtn.className = "hamburger-close";
  loadSVG(closeBtn, getThemeSVG("https://cdn.michael.markov.uk/icons/bootstrap/ffffffff/x.svg", 
    "https://cdn.michael.markov.uk/icons/bootstrap/000000ff/x.svg"));
  document.body.appendChild(closeBtn);

  // --- Hamburger button ---
  const burger: HTMLButtonElement = document.createElement("button");
  burger.className = "burger";
  loadSVG(burger, getThemeSVG("https://cdn.michael.markov.uk/icons/bootstrap/ffffffff/list.svg", 
    "https://cdn.michael.markov.uk/icons/bootstrap/000000ff/list.svg"));
  document.body.appendChild(burger);

  // --- Toggle overlay ---
  let isOpen: boolean = false;

  function openMenu(): void {
    overlay.classList.add("open");
    closeBtn.classList.add("visible");

    buttons.forEach((btn, i) => {
      setTimeout(() => {
        btn.classList.add("visible");
      }, i * 50);
    });

    isOpen = true;
  }

  function closeMenu(): void {
    overlay.classList.remove("open");
    buttons.forEach((btn) => {
      btn.classList.remove("visible");
    });
    closeBtn.classList.remove("visible");
    isOpen = false;
  }

  burger.addEventListener("click", () => {
    isOpen ? closeMenu() : openMenu();
  });

  closeBtn.addEventListener("click", () => {
    closeMenu();
  });

  return burger;
}
