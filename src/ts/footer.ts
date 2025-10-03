export function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer"; // apply class instead of inline styles

  footer.innerHTML = `
    <div class="footer-top">
      <!-- Left -->
      <div class="footer-left">
        DEV
      </div>

      <!-- Center -->
      <div class="footer-center">
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

  document.body.appendChild(footer);
}