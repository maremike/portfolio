export async function loadSVG(container: HTMLElement, url: string) {
  try {
    const res = await fetch(url);
    const svgText = await res.text();
    container.innerHTML = svgText;
    const svgEl = container.querySelector("svg");
    if (svgEl) {
      svgEl.setAttribute("width", "auto");
    }
  } catch (err) {
    console.error("Failed to load SVG:", err);
  }
}
