export function createFooter() {
    const footer = document.createElement("footer");
    footer.style.padding = "3rem 1rem";
    footer.style.backgroundColor = "#f0efe9";
    footer.style.fontFamily = "'Courier New', Courier, monospace";
    footer.style.fontSize = "12px";
    footer.style.color = "#333";
    footer.style.width = "100%";

    footer.innerHTML = `
        <div class="footer-top" style="
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            gap: 1rem;
            flex-wrap: wrap;
        ">
            <!-- Left -->
            <div class="footer-left" style="flex: 1; text-align: left;">
                DEV
            </div>

            <!-- Center -->
            <div class="footer-center" style="flex: 1; text-align: center;">
                <p style="margin: 0;">MICHAEL MARKOV</p>
            </div>

            <!-- Right -->
            <div class="footer-right" style="flex: 1; text-align: right;">
                <a href="/contact" style="color: #999; text-decoration: none;">CONTACT</a>
                <br>
                <a href="/support" style="color: #999; text-decoration: none;">SUPPORT</a>
                <p style="margin: 0;">Text</p>
            </div>
        </div>

        <p style="margin: 0; text-align: center">© 2025 · ALL RIGHTS RESERVED</p>
        <p style="margin: 0; text-align: center">
            <a href="/tos" style="color: #999; text-decoration: none;">TERMS</a>
                · 
            <a href="/privacy" style="color: #999; text-decoration: none;">PRIVACY</a>
                · 
            <a href="/about" style="color: #999; text-decoration: none;">ABOUT</a>
        </p>

        <style>
            @media (max-width: 768px) {
                .footer-top {
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                .footer-left,
                .footer-center,
                .footer-right {
                    flex: 1 1 100%;
                    text-align: center;
                }
            }
        </style>
    `;

    document.body.appendChild(footer);
}