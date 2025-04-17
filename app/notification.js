window.notificationDisappearTimeout = -1;

function notification(message) {
    document.getElementById("notification").innerText = message;
    document.getElementById("notification").classList.remove("notification-hidden");

    clearTimeout(notificationDisappearTimeout);

    window.notificationDisappearTimeout = setTimeout(() => {
        document.getElementById("notification").classList.add("notification-hidden");
    }, 1000);
}