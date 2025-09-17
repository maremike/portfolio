export function createFooter() {
    const footer = document.createElement("footer");
    footer.innerHTML = "<p>© 2025 Max Mustermann</p>";
    document.body.appendChild(footer);

    // Canvas elements
    const canvasDark = document.createElement("canvas");
    canvasDark.id = "dark";
    canvasDark.style.display = "none";

    const canvasLight = document.createElement("canvas");
    canvasLight.id = "light";
    canvasLight.style.display = "none";

    document.body.append(canvasDark, canvasLight);
}