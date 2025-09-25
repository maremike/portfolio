export function renderAboutPage() {
const section = document.createElement("section");
  section.className = "section";
  section.innerHTML = `
    <h1>About</h1>
  `;
  return section;
}