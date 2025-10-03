export function getScaleFactor() {
    const BASE_WIDTH = 1920;
    const BASE_HEIGHT = 1080;

    // Get screen size in pixels, adjusted for device pixel ratio
    const width = window.innerWidth * window.devicePixelRatio;
    const height = window.innerHeight * window.devicePixelRatio;

    const screenArea = width * height;
    const baseArea = BASE_WIDTH * BASE_HEIGHT;

    return Math.sqrt(screenArea / baseArea); // moderate scaling
}
