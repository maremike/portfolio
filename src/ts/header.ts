import { switchToDarkMode, switchToLightMode } from "./utility/themes";
import { createHamburgerMenu, type NavItem } from "./components/hamburger";
import { navigateTo } from "./router"; // import your router's navigateTo function

type ColorScheme = "dark" | "light";

export function createHeader(initialColorScheme: ColorScheme): void {
  let colorScheme = initialColorScheme;
  let isSwitching = false;

  const navItems: NavItem[] = [
    { text: "Products", href: "/products" },
    { text: "Projects", href: "/projects" },
    { text: "Skills", href: "/skills" },
    { text: "Resume", href: "/resume" },
    { text: "Contact", href: "/contact" },
    { text: "Support", href: "/support" }
  ];

  // --- Header container ---
  const header = document.createElement("header");
  header.className = "header";

  header.innerHTML = `
    <div class="header-left">
      <a href="/" id="home-logo"></a>
    </div>

    <div class="header-center">
      <ul class="header-list">
        ${navItems.map(item => `<li><a href="${item.href}">${item.text ?? ""}</a></li>`).join("")}
      </ul>
    </div>

    <div class="header-right">
      <button id="theme-toggle" class="theme-toggle"></button>
    </div>
  `;

  document.body.appendChild(header);

  // --- References ---
  const homeLink = header.querySelector<HTMLAnchorElement>("#home-logo")!;
  const toggleBtn = header.querySelector<HTMLButtonElement>("#theme-toggle")!;
  const headerRight = header.querySelector<HTMLDivElement>(".header-right")!;
  const ul = header.querySelector<HTMLUListElement>(".header-list")!;

  // --- Load logo SVG ---
  async function loadSVG(container: HTMLElement, url: string, height: number = 25) {
    try {
      const res = await fetch(url);
      const svgText = await res.text();
      container.innerHTML = svgText;
      const svgEl = container.querySelector("svg");
      if (svgEl) {
        svgEl.setAttribute("height", `${height}`);
        svgEl.setAttribute("width", "auto");
      }
    } catch (err) {
      console.error("Failed to load SVG:", err);
    }
  }

  const homeLogo = {
    dark: "https://cdn.michael.markov.uk/logos/000000ff/0.svg",
    light: "https://cdn.michael.markov.uk/logos/ffffffff/0.svg"
  };
  loadSVG(homeLink, colorScheme === "dark" ? homeLogo.light : homeLogo.dark);

  // --- Theme toggle ---
  async function updateToggleIcon() {
    const iconUrl =
      colorScheme === "dark"
        ? "https://cdn.michael.markov.uk/icons/fontawesome/solid/ffffffff/cloud-moon.svg"
        : "https://cdn.michael.markov.uk/icons/fontawesome/solid/000000ff/sun.svg";
    await loadSVG(toggleBtn, iconUrl);
  }
  updateToggleIcon();

  toggleBtn.addEventListener("click", async () => {
    if (isSwitching) return;
    isSwitching = true;

    if (colorScheme === "dark") {
      colorScheme = "light";
      await switchToLightMode();
      await loadSVG(homeLink, homeLogo.dark);
    } else {
      colorScheme = "dark";
      await switchToDarkMode();
      await loadSVG(homeLink, homeLogo.light);
    }

    await updateToggleIcon();
    isSwitching = false;
  });

  // --- Hamburger menu ---
  const burger = createHamburgerMenu(navItems);
  burger.classList.add("burger");
  headerRight.appendChild(burger);

  // --- Global SPA click interception ---
  document.body.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a") as HTMLAnchorElement | null;
    if (!link) return;
    // Only intercept internal links
    if (!link.href.startsWith(window.location.origin)) return;

    e.preventDefault();
    const path = new URL(link.href).pathname;

    navigateTo(path); // Use SPA router
  });

  // --- Responsive logic ---
  function isCrowded(container: HTMLElement, target: HTMLElement, excludeElements: HTMLElement[] = [], gap: number = 0): boolean {
    const excludedWidth = excludeElements.reduce((total, el) => total + el.offsetWidth, 0);
    const availableWidth = container.offsetWidth - excludedWidth - gap;
    return target.scrollWidth > availableWidth;
  }

  function updateNavDisplay(): void {
    const rightItems = Array.from(headerRight.children).filter(el => el !== burger) as HTMLElement[];
    if (isCrowded(header, ul, rightItems, 225)) {
      ul.style.display = "none";
      burger.style.display = "block";
    } else {
      ul.style.display = "flex";
      burger.style.display = "none";
    }
  }

  updateNavDisplay();
  window.addEventListener("resize", updateNavDisplay);
}
