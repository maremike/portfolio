export function renderStartpagePage() {
  const section = document.createElement("section");
  section.className = "section";
  section.innerHTML = `
    <h1>Über mich</h1>
    <p>Hallo, ich bin Michael Markov. Willkommen auf meiner Seite!</p>
    <div style="border: 1px solid; padding: 10px; max-width: 100%; height: 1000px">
  `;
  return section;
}
