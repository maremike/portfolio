import { navigateTo } from "../router";

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
    arrow.textContent = "❯";
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
  closeBtn.innerHTML = "x";
  document.body.appendChild(closeBtn);

  // --- Hamburger button ---
  const burger: HTMLButtonElement = document.createElement("button");
  burger.className = "burger";
  burger.innerHTML = "☰";
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
