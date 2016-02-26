﻿class GameClient {
    private websocket_url: string = "ws://localhost:8080/api/websocket";
    private websocket: WebSocket;

    constructor() {
        this.CreateWebSocket();
    }

    private CreateWebSocket() {
        this.websocket = new WebSocket(this.websocket_url);

        this.websocket.onopen = (event) => { this.SocketOpened(event); };

        this.websocket.onclose = (event) => { this.SocketClosed(event); };

        this.websocket.onerror = (event) => { this.SocketError(event); };

        this.websocket.onmessage = (event) => { this.SocketMessageReceived(event); };
    }

    private SocketOpened(event: Event) {
        this.GetMapInfo();
    }

    private SocketClosed(event: CloseEvent) {
        console.log("Socket Closed!");
    }

    private SocketError(event: Event) {
        console.log("Error");
    }

    private SocketMessageReceived(event: MessageEvent) {
        console.log(event.data);
    }

    private GetMapInfo(): Boolean {
        if (!(this.websocket.readyState == 1)) {
            return false;
        }

        var request_mapinfo = new Query("map_info");
        this.websocket.send(JSON.stringify(request_mapinfo));
    }

}

window.onload = function () {
    new GameClient();
}