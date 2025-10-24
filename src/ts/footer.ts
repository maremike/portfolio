import { type themedSVGRegistry, initThemedSVGs, registerThemedSVG } from "./utility/svg.ts";

const footerSVGRegistry: themedSVGRegistry = [];

export function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer"; // apply class instead of inline styles

  footer.innerHTML = `
    <div class="footer-top">
      <!-- Left -->
      <div class="footer-left">
        <p>Full-stack web development</p>
        <p>Systems Engineering</p>
        <p>Project Management</p>
        <p>Lean Management Consulting</p>
      </div>

      <!-- Center -->
      <div class="footer-center">
        <a href="/" id="footer-home-logo" class="footer-home-logo"></a>
        <p>MICHAEL MARKOV</p>
      </div>

      <!-- Right -->
      <div class="footer-right">
        <a href="/contact">CONTACT</a><br>
        <a href="/support">SUPPORT</a>
        <p>Text</p>
      </div>
    </div>

    <p class="footer-bottom">© 2025 · ALL RIGHTS RESERVED</p>
    <p class="footer-bottom footer-links">
      <a href="/tos">TERMS</a> · 
      <a href="/privacy">PRIVACY</a> · 
      <a href="/about">ABOUT</a>
    </p>
  `;

  const homeLogo = footer.querySelector<HTMLAnchorElement>("#footer-home-logo")!;
  registerThemedSVG(footerSVGRegistry, "footer-home-logo", homeLogo, 
    "https://cdn.michael.markov.uk/logos/ffffffff/0.svg",
    "https://cdn.michael.markov.uk/logos/000000ff/0.svg"
  );

  document.body.appendChild(footer);
  initThemedSVGs(footerSVGRegistry);
}