export function getScaleFactor() {
    const BASE_WIDTH = 1920;
    const BASE_HEIGHT = 1080;
    const screenArea = window.innerWidth * window.innerHeight;
    const baseArea = BASE_WIDTH * BASE_HEIGHT;
    return Math.sqrt(screenArea / baseArea); // sqrt keeps scaling moderate
}