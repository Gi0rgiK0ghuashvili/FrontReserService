function showNotification(message, elementId, isSucceed = false) {
    if (!message) {
        console.error(message);
        return;
    }

    const notification = document.getElementById(elementId);
    if (!notification) {
        console.error(notification);
        return;
    }

    notification.textContent = message;
    if (isSucceed) {
        notification.style.color = "green";
    } else {
        notification.style.color = "red";
    }

}