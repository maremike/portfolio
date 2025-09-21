export function createFooter() {
    // --- Footer element ---
    const footer = document.createElement("footer");

    // --- Copyright paragraph ---
    const pCopyright = document.createElement("p");
    pCopyright.textContent = "© 2025 Michael Markov";
    footer.appendChild(pCopyright);

    // --- Links paragraph ---
    const pLinks = document.createElement("p");

    const links = [
        { text: "About", href: "/about" },
        { text: "Privacy", href: "/privacy" }
    ];

    links.forEach((link, index) => {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.text;
        a.style.margin = "0 0.5rem";
        a.style.color = "inherit";
        a.style.textDecoration = "none";

        pLinks.appendChild(a);

        // Add separator if not the last link
        if (index < links.length - 1) {
            const separator = document.createTextNode(" | ");
            pLinks.appendChild(separator);
        }
    });

    footer.appendChild(pLinks);

    document.body.appendChild(footer);

    // --- Canvas elements for extra effects ---
    const canvasIds = ["dark", "light"];
    canvasIds.forEach(id => {
        const canvas = document.createElement("canvas");
        canvas.id = id;
        canvas.style.display = "none";
        document.body.appendChild(canvas);
    });
}