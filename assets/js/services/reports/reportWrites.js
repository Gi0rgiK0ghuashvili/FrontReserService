
export function setStatsResult(elementId, value) {
    const ordersText = document.getElementById(elementId);

    if (!ordersText) {
        return;
    }
    ordersText.textContent = value;
    return;
}