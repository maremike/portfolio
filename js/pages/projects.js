export function renderProjectsPage() {
const section = document.createElement("section");
  section.className = "section";
  section.innerHTML = `
    <h1>Projects</h1>
  `;
  return section;
}