const util = require('util');

const execFile = util.promisify(require('child_process').execFile);

window.hasToSyncAudio = false;
window.audioSyncInterval = setInterval(() => {
    try {
        if (isNaN(document.getElementById("player-video").duration) || document.getElementById("player-video").currentTime >= document.getElementById("player-video").duration) {
            if (window.connected) {
                document.getElementById("player").style.display = "none";
                document.getElementById("ready").style.display = "flex";
            } else {
                document.getElementById("player").style.display = "none";
                document.getElementById("ready").style.display = "none";
            }
        } else {
            document.getElementById("player").style.display = "";
            document.getElementById("ready").style.display = "none";
        }
    } catch (e) {
        if (window.connected) {
            document.getElementById("player").style.display = "none";
            document.getElementById("ready").style.display = "flex";
        } else {
            document.getElementById("player").style.display = "none";
            document.getElementById("ready").style.display = "none";
        }
    }

    if (!hasToSyncAudio) return;

    if (Math.abs(document.getElementById("player-audio").currentTime - document.getElementById("player-video").currentTime) > 0.1) document.getElementById("player-audio").currentTime = document.getElementById("player-video").currentTime;
});

setInterval(() => {
    if (document.getElementById("player-video").paused) {
        Array.from(document.getElementsByClassName("hud-part")).forEach((i) => {
            i.classList.add("hud-show");
        });
    } else {
        Array.from(document.getElementsByClassName("hud-part")).forEach((i) => {
            i.classList.remove("hud-show");
        });
    }
}, 100);

async function _method_play(payload) {
    switch (payload.type) {
        case "http":
            document.getElementById("player-video").src = payload.url;
            document.getElementById("player-video").play();
            break;

        case "youtube":
            let data = JSON.parse((await execFile("./yt-dlp", ["-q", "-x", "--no-playlist", "--skip-download", "--dump-json", payload.url])).stdout.toString());

            let defaultVideo = data['formats'].filter((i) => { return i['video_ext'] === "mp4" && i['fps'] <= 40; }).sort((a, b) => { return b['width'] - a['width']; })[0];

            let defaultAudio;
            if (defaultVideo['asr'] === null) {
                defaultAudio = data['formats'].filter((i) => { return !isNaN(parseFloat(i['abr'])); }).sort((a, b) => { return b['abr'] - a['abr']; })[0];
                document.getElementById("player-audio").src = defaultAudio.url;
            }

            document.getElementById("player-video").src = defaultVideo.url;
            document.getElementById("player-video").play();
            document.getElementById("player-audio").play();
            window.hasToSyncAudio = true;
            break;
    }
}