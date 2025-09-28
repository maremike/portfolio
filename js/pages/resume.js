export function renderResumePage() {
    const section = document.createElement("section");
    section.className = "section";
    section.innerHTML = `
        <h1>Resume</h1>
    `;
    return section;
}