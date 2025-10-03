export interface NavItem {
  text?: string;
  href: string;
  image?: string;
}

export function createHamburgerMenu(navItems: NavItem[]): HTMLButtonElement {
  // --- Fullscreen overlay ---
  const overlay: HTMLDivElement = document.createElement("div");
  overlay.className = "hamburger-overlay";

  // --- Nav items ---
  const links: HTMLAnchorElement[] = [];

  navItems.forEach((item) => {
    const link: HTMLAnchorElement = document.createElement("a");
    link.className = "hamburger-link";
    link.textContent = item.text ?? "";
    link.href = item.href; // SPA router intercepts <a> clicks automatically

    // --- Right arrow/diamond ---
    const arrow: HTMLSpanElement = document.createElement("span");
    arrow.className = "hamburger-arrow";
    arrow.textContent = "❯";
    link.appendChild(arrow);

    // Close menu when link is clicked
    link.addEventListener("click", () => {
      closeMenu();
    });

    overlay.appendChild(link);
    links.push(link);
  });

  document.body.appendChild(overlay);

  // --- Close button (X) ---
  const closeBtn: HTMLButtonElement = document.createElement("button");
  closeBtn.className = "hamburger-close";
  closeBtn.innerHTML = "✖";
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

    links.forEach((link, i) => {
      setTimeout(() => {
        link.classList.add("visible");
      }, i * 50);
    });

    isOpen = true;
  }

  function closeMenu(): void {
    overlay.classList.remove("open");
    links.forEach((link) => {
      link.classList.remove("visible");
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
