export function renderContactPage() {
const section = document.createElement("section");
  section.className = "section";
  section.innerHTML = `
    <h1>Contact</h1>
  `;
  return section;
}