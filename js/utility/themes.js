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

// Theme toggle button
const toggleBtn = document.createElement("button");
toggleBtn.id = "theme-toggle";
toggleBtn.style.marginLeft = "auto";
toggleBtn.style.cursor = "pointer";
toggleBtn.style.background = "none";
toggleBtn.style.border = "none";
toggleBtn.style.fontSize = "1.2rem";
toggleBtn.textContent = colorScheme === "dark" ? "🌙" : "☀️";

// Initialize backgrounds based on initial scheme
if (colorScheme === "light" && !backgroundsInitialized.sky) {
    initSkyBackground();
    initCloudOverlay();
    backgroundsInitialized.sky = true;
    backgroundsInitialized.clouds = true;
} else if (colorScheme === "dark" && !backgroundsInitialized.space) {
    initSpaceOverlay();
    backgroundsInitialized.space = true;
}

toggleBtn.addEventListener("click", async () => {
    if (isSwitching) return;
    isSwitching = true;

    if (colorScheme === "dark") {
        await switchToLightMode();
    } else {
        await switchToDarkMode();
    }

    isSwitching = false;
});

async function switchToLightMode() {
    colorScheme = "light";
    document.documentElement.setAttribute("data-theme", "light");
    toggleBtn.textContent = "☀️";

    // Smooth transitions
    if (backgroundElements.space) {
        backgroundElements.space.style.opacity = "0";
        backgroundElements.dark.style.opacity = "0";
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

    // Initialize backgrounds only once
    if (!backgroundsInitialized.sky) {
        initSkyBackground();
        backgroundsInitialized.sky = true;
    }
    if (!backgroundsInitialized.clouds) {
        initCloudOverlay();
        backgroundsInitialized.clouds = true;
    }
}

async function switchToDarkMode() {
    colorScheme = "dark";
    document.documentElement.setAttribute("data-theme", "dark");
    toggleBtn.textContent = "🌙";

    if (backgroundElements.light) {
        backgroundElements.light.style.opacity = "0";
        backgroundElements.sky.style.opacity = "0";
        backgroundElements.clouds.style.opacity = "0";
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