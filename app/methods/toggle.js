async function _method_toggle(_payload) {
    if (document.getElementById("player-video").paused) {
        document.getElementById("player-video").play();
    } else {
        document.getElementById("player-video").pause();
    }

    if (window.hasToSyncAudio) {
        if (document.getElementById("player-audio").paused) {
            document.getElementById("player-audio").play();
        } else {
            document.getElementById("player-audio").pause();
        }
    }
}