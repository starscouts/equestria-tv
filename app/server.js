// noinspection JSUnresolvedFunction

window.connected = false;

const WebSocket = require('ws');
const server = new WebSocket.Server({
    port: connectionCode
});

let currentSocket = null;

server.on('connection', function(socket, req) {
    window.connected = true;

    if (currentSocket !== null) {
        socket.close();
        return;
    }

    currentSocket = socket;
    console.log("Connected from " + req.connection.remoteAddress);
    document.getElementById("player").style.display = "none";
    document.getElementById("ready").style.display = "flex";

    socket.on('message', function(msg) {
        let data;
        try {
            data = JSON.parse(msg);
        } catch (e) {
            return;
        }

        console.log(data);

        if (data.method === "play")   _method_play  (data.payload ?? null);
        if (data.method === "toggle") _method_toggle(data.payload ?? null);
    });

    socket.on('close', function() {
        currentSocket = null;
        window.connected = false;
        console.log("Disconnected");
        document.getElementById("player").style.display = "none";
        document.getElementById("ready").style.display = "none";
        document.getElementById("player-video").pause();
        document.getElementById("player-audio").pause();
        document.getElementById("player-audio").src = "";
        document.getElementById("player-video").src = "";
    });
});