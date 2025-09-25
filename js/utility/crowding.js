/**
 * Checks if a target element fits inside a container without overlapping excluded elements.
 * @param {HTMLElement} container - The container element.
 * @param {HTMLElement} target - The element to check if it fits.
 * @param {HTMLElement[]} excludeElements - Array of elements inside container to exclude from available space calculation.
 * @param {number} gap - Optional extra spacing buffer (default 0).
 * @returns {boolean} - true if crowded, false if fits.
 */
export function isCrowded(container, target, excludeElements = [], gap = 0) {
    // Total width of excluded elements
    const excludedWidth = excludeElements.reduce(
        (total, el) => total + el.offsetWidth,
        0
    );

    const availableWidth = container.offsetWidth - excludedWidth - gap;
    const targetWidth = target.scrollWidth;

    return targetWidth > availableWidth;
}