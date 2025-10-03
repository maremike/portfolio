export function render404Page() {
    const section = document.createElement("section");
    section.className = "section";
    const heading = document.createElement("h1");
    heading.textContent = "404";

    section.appendChild(heading);

    return section;
}