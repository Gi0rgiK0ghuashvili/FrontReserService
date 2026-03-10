export function showNotification(elementId, notification, isSucceed){

    const notif = document.getElementById(elementId);
    if (!notif) {
        return;
    }
    if (!notification) {
        return;
    }
    if (isSucceed) {
        notif.textContent = notification;
        notif.style = "color: green"
    }
    else {
        notif.textContent = notification;
        notif.style = "color: red"
    }

}