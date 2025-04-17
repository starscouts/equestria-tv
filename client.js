class EquestriaTV {
    address = null;
    port = null;
    socket = null;

    constructor(connectionData) {
        return new Promise((res, rej) => {

            if (typeof connectionData === "string") {
                if (connectionData.length === 13) {
                    let addressPart = connectionData.substring(0, 8);
                    let portPart = connectionData.substring(8, 13);

                    let addressPart1 = parseInt(addressPart.substring(0, 2), 16);
                    let addressPart2 = parseInt(addressPart.substring(2, 4), 16);
                    let addressPart3 = parseInt(addressPart.substring(4, 6), 16);
                    let addressPart4 = parseInt(addressPart.substring(6, 8), 16);
                    let address = addressPart1 + "." + addressPart2 + "." + addressPart3 + "." + addressPart4;

                    if (address.match(/^([0-2]|)([0-9]|)[0-9]\.([0-2]|)([0-9]|)[0-9]\.([0-2]|)([0-9]|)[0-9]\.([0-2]|)([0-9]|)[0-9]$/gm) === null) {
                        rej(new Error("Received address is invalid or missing"));
                    }

                    if (portPart.length !== 5 || isNaN(parseInt(portPart)) || parseInt(portPart) < 27423 || parseInt(connectionData["code"]) > 65535) {
                        rej(new Error("Received port is invalid or missing"));
                    }

                    this.address = address;
                    this.port = parseInt(portPart);
                } else {
                    rej(new Error("Entered code is not valid"));
                }
            } else if (typeof connectionData === "object") {
                if (connectionData["address"] && connectionData["address"].match(/^([0-2]|)([0-9]|)[0-9]\.([0-2]|)([0-9]|)[0-9]\.([0-2]|)([0-9]|)[0-9]\.([0-2]|)([0-9]|)[0-9]$/gm) !== null) {
                    this.address = connectionData["address"];
                } else {
                    rej(new Error("Received address is invalid or missing"));
                }

                if (connectionData["code"] && connectionData["code"].length === 5 && !isNaN(parseInt(connectionData["code"])) && parseInt(connectionData["code"]) >= 27423 && parseInt(connectionData["code"]) <= 65535) {
                    this.port = parseInt(connectionData["code"]);
                } else {
                    rej(new Error("Received port is invalid or missing"));
                }
            } else {
                rej(new Error("Expected connectionData to be object or string, got " + typeof connectionData));
            }

            this.socket = new WebSocket("ws://" + this.address + ":" + this.port);

            this.socket.onopen = () => {
                res(this);
            }

            this.socket.onclose = () => {
                location.reload();
            }
        })
    }

    playPause() {
        this.socket.send(JSON.stringify({
            method: "toggle",
            payload: {}
        }))
    }

    loadFromURL(url) {
        this.socket.send(JSON.stringify({
            method: "play",
            payload: {
                type: "http",
                url
            }
        }))
    }

    loadFromYouTube(url) {
        this.socket.send(JSON.stringify({
            method: "play",
            payload: {
                type: "youtube",
                url
            }
        }))
    }
}