export function renderProductsPage() {
const section = document.createElement("section");
  section.className = "section";
  section.innerHTML = `
    <h1>Products</h1>
  `;
  return section;
}