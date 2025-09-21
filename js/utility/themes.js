import { initSkyBackground, initCloudOverlay } from "../background/sky.js";
import { initSpaceOverlay } from "../background/space.js";

function getBackgroundElements() {
    return {
        light: document.getElementById("light"),
        dark: document.getElementById("dark"),
        sky: document.getElementById("sky"),
        clouds: document.getElementById("clouds"),
        space: document.getElementById("space"),
    };
}

const backgroundsInitialized = {
    sky: false,
    clouds: false,
    space: false
};

export function checkColorScheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
        return 'dark';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.remove('dark-mode');
        return 'light';
    }
}

export function setupColorSchemeListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        if (e.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark-mode');
            document.documentElement.classList.remove('light-mode');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.documentElement.classList.add('light-mode');
            document.documentElement.classList.remove('dark-mode');
        }
    });
}

export async function switchToLightMode() {
    const backgroundElements = getBackgroundElements();

    document.documentElement.setAttribute("data-theme", "light");

    if (backgroundElements.space) {
        backgroundElements.space.style.opacity = "0";
        if (backgroundElements.dark) backgroundElements.dark.style.opacity = "0";
    }

    setTimeout(() => {
        if (backgroundElements.space) backgroundElements.space.style.display = "none";
        if (backgroundElements.dark) backgroundElements.dark.style.display = "none";
        if (backgroundElements.light) backgroundElements.light.style.display = "block";
        if (backgroundElements.sky) backgroundElements.sky.style.display = "block";
        if (backgroundElements.clouds) backgroundElements.clouds.style.display = "block";

        setTimeout(() => {
            if (backgroundElements.light) backgroundElements.light.style.opacity = "1";
            if (backgroundElements.sky) backgroundElements.sky.style.opacity = "1";
            if (backgroundElements.clouds) backgroundElements.clouds.style.opacity = "1";
        }, 50);
    }, 150);

    if (!backgroundsInitialized.sky) {
        initSkyBackground();
        backgroundsInitialized.sky = true;
    }
    if (!backgroundsInitialized.clouds) {
        initCloudOverlay();
        backgroundsInitialized.clouds = true;
    }
}

export async function switchToDarkMode() {
    const backgroundElements = getBackgroundElements();

    document.documentElement.setAttribute("data-theme", "dark");

    if (backgroundElements.light) {
        backgroundElements.light.style.opacity = "0";
        if (backgroundElements.sky) backgroundElements.sky.style.opacity = "0";
        if (backgroundElements.clouds) backgroundElements.clouds.style.opacity = "0";
    }

    setTimeout(() => {
        if (backgroundElements.light) backgroundElements.light.style.display = "none";
        if (backgroundElements.sky) backgroundElements.sky.style.display = "none";
        if (backgroundElements.clouds) backgroundElements.clouds.style.display = "none";
        if (backgroundElements.dark) backgroundElements.dark.style.display = "block";
        if (backgroundElements.space) backgroundElements.space.style.display = "block";

        setTimeout(() => {
            if (backgroundElements.dark) backgroundElements.dark.style.opacity = "1";
            if (backgroundElements.space) backgroundElements.space.style.opacity = "1";
        }, 50);
    }, 150);

    if (!backgroundsInitialized.space) {
        initSpaceOverlay();
        backgroundsInitialized.space = true;
    }
}

export function initTheme() {
    const colorScheme = checkColorScheme();
    setupColorSchemeListener();
    if (colorScheme === "dark") {
        switchToDarkMode();
    } else {
        switchToLightMode();
    }
    return colorScheme;
}