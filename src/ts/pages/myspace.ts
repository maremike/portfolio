export function renderMyspacePage() {
    const section = document.createElement("section");
    section.className = "section";
    const heading = document.createElement("h1");
    heading.textContent = "myspace";

    section.appendChild(heading);

    return section;
}