import { switchToDarkMode, switchToLightMode } from "./utility/themes";
import { createHamburgerMenu, type NavItem } from "./components/hamburger";
import { addSVGToWatcher, getThemeSVG, loadSVG, notifyThemeChange } from "./utility/svg";

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

  addSVGToWatcher(homeLink,
    "https://cdn.michael.markov.uk/logos/ffffffff/0.svg",
    "https://cdn.michael.markov.uk/logos/000000ff/0.svg"
  );
  addSVGToWatcher(toggleBtn,
      "https://cdn.michael.markov.uk/icons/fontawesome/solid/ffffffff/cloud-moon.svg",
      "https://cdn.michael.markov.uk/icons/fontawesome/solid/000000ff/sun.svg"
    );

  toggleBtn.addEventListener("click", async () => {
    if (isSwitching) return;
    isSwitching = true;

    if (colorScheme === "dark") {
      colorScheme = "light";
      await switchToLightMode();
    } else {
      colorScheme = "dark";
      await switchToDarkMode();
    }
    notifyThemeChange();
    isSwitching = false;
  });


  // --- Hamburger menu ---
  const burger = createHamburgerMenu(navItems);
  burger.classList.add("burger");
  headerRight.appendChild(burger);
}
