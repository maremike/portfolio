export function renderAboutPage() {
const section = document.createElement("section");
  section.className = "section";
  section.innerHTML = `
    <h1>About</h1>
    <p>Name: Michael Markov</p>
    <p>Address: Steinkamp 10i</p>
    <p>Zip Code: 28717</p>
    <p>City: Bremen</p>
    <p>Country: Germany</p>
    <p>Email: info@michael.markov.uk</p>
    <p>Phone: +49 1520 5943032</p>
    <h2>Disclaimer:</h2>
    <p>The content on this website was created with care. However, no guarantee is given for its accuracy, completeness, or timeliness. Despite careful control, I am not responsible for external links. The operators of linked pages are solely responsible for their content.</p>
  `;
  return section;
}