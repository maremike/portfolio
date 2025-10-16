import { initRouter } from "./router";
import { createHeader } from "./header";
import { createFooter } from "./footer";
import { initTheme } from "./utility/themes";
import { initLanguage } from "./language";

import "../css/accessibility.scss";
import "../css/background.scss";
import "../css/content.scss";
import "../css/footer.scss";
import "../css/general.scss";
import "../css/hamburger.scss";
import "../css/header.scss";
import "../css/utility.scss";

function setFavicon(href: string, media?: string) {
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/svg+xml";
  link.href = href;
  if (media) link.media = media;
  document.head.appendChild(link);
}

function createCanvases(ids: string[]) {
  ids.forEach((id) => {
    const canvas = document.createElement("canvas");
    canvas.id = id;
    canvas.style.display = "none";
    document.body.appendChild(canvas);
  });
}

function init() {
  // Set up meta tags dynamically (optional)
  if (!document.querySelector('meta[charset]')) {
    const metaCharset = document.createElement("meta");
    metaCharset.setAttribute("charset", "UTF-8");
    document.head.appendChild(metaCharset);
  }

  if (!document.querySelector('meta[name="viewport"]')) {
    const metaViewport = document.createElement("meta");
    metaViewport.name = "viewport";
    metaViewport.content = "width=device-width, initial-scale=1.0";
    document.head.appendChild(metaViewport);
  }

  // Set page title
  document.title = "Michael Markov";

  // Set favicons for light and dark themes
  setFavicon("https://cdn.michael.markov.uk/logos/000000ff/1.svg", "(prefers-color-scheme: light)");
  setFavicon("https://cdn.michael.markov.uk/logos/ffffffff/1.svg", "(prefers-color-scheme: dark)");

  // Create the app container div if it doesn't exist
  if (!document.getElementById("app")) {
    const appDiv = document.createElement("div");
    appDiv.id = "app";
    document.body.appendChild(appDiv);
  }

  // Create canvases dynamically
  createCanvases(["dark", "light", "sky", "space", "clouds"]);

  // Setup Background / Theme
  const colorScheme = initTheme();

  // Detect and initialize language, get the detected language string
  initLanguage();

  // Build page structure (optionally, you can pass language if needed)
  createHeader(colorScheme);

  // Create main element and append it
  const main = document.createElement("main");
  document.body.appendChild(main);

  // Add footer
  createFooter();

  // Initialize router (can potentially receive language if needed)
  initRouter();
}

document.addEventListener("DOMContentLoaded", init);