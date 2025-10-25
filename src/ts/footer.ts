import { type themedSVGRegistry, initThemedSVGs, registerThemedSVG } from "./utility/svg.ts";

const footerSVGRegistry: themedSVGRegistry = [];

export function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer"; // apply class instead of inline styles

  footer.innerHTML = `
    <div class="footer-top">
      <div class="footer-left">
        <p>Creating solutions tailored to client requirements.</p>
      </div>
      <div class="footer-center">
        <a href="/" id="footer-home-logo" class="footer-home-logo"></a>
        <p>MICHAEL MARKOV</p>
      </div>
      <div class="footer-right">
        <div class="footer-links">
          <a href="/contact">CONTACT ME</a><br>
          <span>·</span>
          <a href="/support">SUPPORT ME</a>
        </div>

        <div id="footer-socials">
          <div class="footer-social-item">
            <a href="https://www.linkedin.com/" id="linkedIn-link">
              <svg id="linkedin-icon"></svg>
              <span>LinkedIn</span>
              <span>Username</span>
            </a>
          </div>
          <div class="footer-social-item">
            <a href="https://www.instagram.com/" id="instagram-link">
              <svg id="instagram-icon"></svg>
              <span>Instagram</span>
              <span>Username</span>
            </a>
          </div>
          <div class="footer-social-item">
            <a href="https://www.youtube.com/" id="youtube-link">
              <svg id="youtube-icon"></svg>
              <span>YouTube</span>
              <span>Username</span>
            </a>
          </div>
          <div class="footer-social-item">
            <a href="https://open.spotify.com/" id="spotify-link">
              <svg id="spotify-icon"></svg>
              <span>Spotify</span>
              <span>Username</span>
            </a>
          </div>
          <div class="footer-social-item">
            <a href="https://www.deezer.com/" id="deezer-link">
              <svg id="deezer-icon"></svg>
              <span>Deezer</span>
              <span>Username</span>
            </a>
          </div>
          <div class="footer-social-item">
            <a href="https://github.com/" id="github-link">
              <svg id="github-icon"></svg>
              <span>Github</span>
              <span>Username</span>
            </a>
          </div>
          <div class="footer-social-item">
            <a href="https://about.gitlab.com/" id="gitlab-link">
              <svg id="gitlab-icon"></svg>
              <span>Gitlab</span>
              <span>Username</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 · ALL RIGHTS RESERVED</p>
      <div class="footer-links">
        <a href="/tos">TERMS</a>
        <span>·</span>
        <a href="/privacy">PRIVACY</a>
        <span>·</span>
        <a href="/legal">LEGAL NOTICE</a>
      </div>
    </div>
  `;

  const homeLogo = footer.querySelector<HTMLAnchorElement>("#footer-home-logo")!;
  registerThemedSVG(footerSVGRegistry, "footer-home-logo", homeLogo, 
    "https://cdn.michael.markov.uk/logos/ffffffff/0.svg",
    "https://cdn.michael.markov.uk/logos/000000ff/0.svg"
  );
  const linkedInIcon = footer.querySelector<HTMLAnchorElement>("#linkedin-icon")!;
  registerThemedSVG(footerSVGRegistry, "linkedin-icon", linkedInIcon, 
    "https://cdn.michael.markov.uk/icons/fontawesome/brands/ffffffff/linkedin.svg",
    "https://cdn.michael.markov.uk/icons/fontawesome/brands/000000ff/linkedin.svg");
  const instagramIcon = footer.querySelector<HTMLAnchorElement>("#instagram-icon")!;
  registerThemedSVG(footerSVGRegistry, "instagram-icon", instagramIcon, 
    "https://cdn.michael.markov.uk/icons/fontawesome/brands/ffffffff/instagram.svg",
    "https://cdn.michael.markov.uk/icons/fontawesome/brands/000000ff/instagram.svg");
  const youtubeIcon = footer.querySelector<HTMLAnchorElement>("#youtube-icon")!;
  registerThemedSVG(footerSVGRegistry, "youtube-icon", youtubeIcon, 
    "https://cdn.michael.markov.uk/icons/fontawesome/brands/ffffffff/youtube.svg",
    "https://cdn.michael.markov.uk/icons/fontawesome/brands/000000ff/youtube.svg");
  const spotifyIcon = footer.querySelector<HTMLAnchorElement>("#spotify-icon")!;
  registerThemedSVG(footerSVGRegistry, "spotify-icon", spotifyIcon, 
    "https://cdn.michael.markov.uk/icons/fontawesome/brands/ffffffff/spotify.svg",
    "https://cdn.michael.markov.uk/icons/fontawesome/brands/000000ff/spotify.svg");
  const deezerIcon = footer.querySelector<HTMLAnchorElement>("#deezer-icon")!;
  registerThemedSVG(footerSVGRegistry, "deezer-icon", deezerIcon, 
    "https://cdn.michael.markov.uk/icons/fontawesome/brands/ffffffff/deezer.svg",
    "https://cdn.michael.markov.uk/icons/fontawesome/brands/000000ff/deezer.svg");
  const githubIcon = footer.querySelector<HTMLAnchorElement>("#github-icon")!;
  registerThemedSVG(footerSVGRegistry, "github-icon", githubIcon, 
    "https://cdn.michael.markov.uk/icons/fontawesome/brands/ffffffff/github.svg",
    "https://cdn.michael.markov.uk/icons/fontawesome/brands/000000ff/github.svg");
  const gitlabIcon = footer.querySelector<HTMLAnchorElement>("#gitlab-icon")!;
  registerThemedSVG(footerSVGRegistry, "gitlab-icon", gitlabIcon, 
    "https://cdn.michael.markov.uk/icons/fontawesome/brands/ffffffff/gitlab.svg",
    "https://cdn.michael.markov.uk/icons/fontawesome/brands/000000ff/gitlab.svg");

  document.body.appendChild(footer);
  initThemedSVGs(footerSVGRegistry);
}