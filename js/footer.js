export function createFooter() {
    const footer = document.createElement("footer");
    footer.style.padding = "3rem 1rem";
    footer.style.backgroundColor = "#f0efe9";
    footer.style.fontFamily = "'Courier New', Courier, monospace";
    footer.style.fontSize = "12px";
    footer.style.color = "#333";
    footer.style.width = "100%";

    // Create table
    footer.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; text-align: center;">
            <tr>
                <td style="text-align: left; vertical-align: top;">
                    DEV
                </td>

                <td style="text-align: center; vertical-align: top;">
                    <p style="margin: 0;">MICHAEL MARKOV</p>
                </td>

                <td style="text-align: right; vertical-align: top;">
                    <a href="/contact" style="color: #999; text-decoration: none;">CONTACT</a>
                    <p style="margin: 0;">SUPPORT</p>
                </td>
            </tr>
            <tr>
                <td style="text-align: left; vertical-align: top;">
                    
                </td>

                <td style="text-align: center; vertical-align: top;">
                    <p style="margin: 0;">© 2025 · ALL RIGHTS RESERVED</p>
                    <p style="margin: 0;">
                        <a href="/tos" style="color: #999; text-decoration: none;">TERMS</a>
                         · 
                        <a href="/privacy" style="color: #999; text-decoration: none;">PRIVACY</a>
                         · 
                        <a href="/about" style="color: #999; text-decoration: none;">ABOUT</a>
                    </p>
                </td>

                <td style="text-align: right; vertical-align: top;">
                    
                </td>
            </tr>
        </table>
    `;

    document.body.appendChild(footer);
}