import { getCurrentTheme, switchToDarkMode, switchToLightMode } from "./utility/themes";
import { createHamburgerMenu, type NavItem } from "./components/hamburger";
import { initThemedSVGs, registerThemedSVG, type themedSVGRegistry } from "./utility/svg";

const headerSVGRegistry: themedSVGRegistry = [];

export function createHeader(): void {
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

  registerThemedSVG(headerSVGRegistry, "home-logo", homeLink, 
    "https://cdn.michael.markov.uk/logos/ffffffff/0.svg",
    "https://cdn.michael.markov.uk/logos/000000ff/0.svg"
  );
  registerThemedSVG(headerSVGRegistry, "theme-toggle", toggleBtn, 
    "https://cdn.michael.markov.uk/icons/fontawesome/solid/ffffffff/cloud-moon.svg",
    "https://cdn.michael.markov.uk/icons/fontawesome/solid/000000ff/sun.svg"
  );

  toggleBtn.addEventListener("click", async () => {
    if (isSwitching) return;
    isSwitching = true;

    if (getCurrentTheme() === "dark") {
      await switchToLightMode();
    } else {
      await switchToDarkMode();
    }

    isSwitching = false;
  });


  // --- Hamburger menu ---
  const burger = createHamburgerMenu(navItems, headerSVGRegistry);
  burger.classList.add("burger");
  headerRight.appendChild(burger);

  initThemedSVGs(headerSVGRegistry);
}
