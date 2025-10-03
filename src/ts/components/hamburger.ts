export interface NavItem {
  text?: string;
  href: string;
  image?: string;
}

export function createHamburgerMenu(navItems: NavItem[]): HTMLButtonElement {
  // --- Fullscreen overlay ---
  const overlay: HTMLDivElement = document.createElement("div");
  overlay.className = "hamburger-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "#fff";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "flex-start";
  overlay.style.alignItems = "stretch";
  overlay.style.transform = "translateY(-100%)";
  overlay.style.transition = "transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)";
  overlay.style.zIndex = "10000";
  overlay.style.paddingTop = "4rem";

  // --- Nav items ---
  const links: HTMLButtonElement[] = [];

  navItems.forEach((item) => {
    const button: HTMLButtonElement = document.createElement("button");
    button.style.width = "100%";
    button.style.padding = "1rem 2rem";
    button.style.border = "none";
    button.style.background = "none";
    button.style.textAlign = "left";
    button.style.fontSize = "1.5rem";
    button.style.color = "#333";
    button.style.cursor = "pointer";
    button.style.display = "flex";
    button.style.justifyContent = "space-between";
    button.style.alignItems = "center";
    button.style.opacity = "0";
    button.style.transform = "translateY(-20px)";
    button.style.transition = "opacity 0.3s ease, transform 0.3s ease";

    // Ensure text is present for hamburger menu
    button.textContent = item.text ?? "";

    // --- Right arrow/diamond ---
    const arrow: HTMLSpanElement = document.createElement("span");
    arrow.textContent = "❯";
    arrow.style.opacity = "0";
    arrow.style.transform = "translateX(-5px)";
    arrow.style.transition = "opacity 0.2s ease, transform 0.2s ease";
    button.appendChild(arrow);

    // --- Hover animation ---
    button.addEventListener("mouseenter", () => {
      arrow.style.opacity = "1";
      arrow.style.transform = "translateX(0)";
    });
    button.addEventListener("mouseleave", () => {
      arrow.style.opacity = "0";
      arrow.style.transform = "translateX(5px)";
    });

    // Navigate when clicked
    button.addEventListener("click", () => {
      window.location.href = item.href;
    });

    overlay.appendChild(button);
    links.push(button);
  });

  document.body.appendChild(overlay);

  // --- Close button (X) ---
  const closeBtn: HTMLButtonElement = document.createElement("button");
  closeBtn.innerHTML = "✖";
  closeBtn.style.position = "fixed";
  closeBtn.style.top = "1rem";
  closeBtn.style.right = "1rem";
  closeBtn.style.fontSize = "2rem";
  closeBtn.style.background = "none";
  closeBtn.style.border = "none";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.zIndex = "10001";
  closeBtn.style.display = "none";
  document.body.appendChild(closeBtn);

  // --- Hamburger button ---
  const burger: HTMLButtonElement = document.createElement("button");
  burger.className = "burger";
  burger.innerHTML = "☰";
  burger.style.fontSize = "1.5rem";
  burger.style.background = "none";
  burger.style.border = "none";
  burger.style.cursor = "pointer";
  burger.style.zIndex = "10002";

  // --- Toggle overlay ---
  let isOpen: boolean = false;

  function openMenu(): void {
    overlay.style.transform = "translateY(0)";
    closeBtn.style.display = "block";

    links.forEach((link, i) => {
      setTimeout(() => {
        link.style.opacity = "1";
        link.style.transform = "translateY(0)";
      }, i * 50);
    });

    isOpen = true;
  }

  function closeMenu(): void {
    overlay.style.transform = "translateY(-100%)";
    links.forEach((link) => {
      link.style.opacity = "0";
      link.style.transform = "translateY(-20px)";
    });
    closeBtn.style.display = "none";
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