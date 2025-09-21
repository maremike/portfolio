export function renderStartpagePage() {
  const section = document.createElement("section");
  section.className = "section";

  const heading = document.createElement("h1");
  heading.textContent = "Über mich";

  const paragraph = document.createElement("p");
  paragraph.textContent = "Hallo, ich bin Michael Markov. Willkommen auf meiner Seite!";

  section.appendChild(heading);
  section.appendChild(paragraph);

  return section;
}
