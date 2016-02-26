var GameClient = (function () {
    function GameClient() {
        this.websocket_url = "ws://localhost:8080/api/websocket";
        this.CreateWebSocket();
    }
    GameClient.prototype.CreateWebSocket = function () {
        var _this = this;
        this.websocket = new WebSocket(this.websocket_url);
        this.websocket.onopen = function (event) { _this.SocketOpened(event); };
        this.websocket.onclose = function (event) { _this.SocketClosed(event); };
        this.websocket.onerror = function (event) { _this.SocketError(event); };
        this.websocket.onmessage = function (event) { _this.SocketMessageReceived(event); };
    };
    GameClient.prototype.SocketOpened = function (event) {
        this.GetMapInfo();
    };
    GameClient.prototype.SocketClosed = function (event) {
        console.log("Socket Closed!");
    };
    GameClient.prototype.SocketError = function (event) {
        console.log("Error");
    };
    GameClient.prototype.SocketMessageReceived = function (event) {
        var response = JSON.parse(event.data);
        if (response == null) {
            return;
        }
        if (response.Message == "map_info") {
            var receivedMapInfo = response.Data;
            if (receivedMapInfo == null) {
                return;
            }
            this.map_info = receivedMapInfo;
            console.log("Received the map info! MapName " + this.map_info.MapName);
        }
    };
    GameClient.prototype.GetMapInfo = function () {
        if (!(this.websocket.readyState == 1)) {
            return false;
        }
        var request_mapinfo = new Request("map_info");
        this.websocket.send(JSON.stringify(request_mapinfo));
    };
    return GameClient;
}());
window.onload = function () {
    new GameClient();
};
var MapInfo = (function () {
    function MapInfo() {
    }
    return MapInfo;
}());
var Request = (function () {
    function Request(message) {
        this.Message = "";
        this.Message = message;
    }
    return Request;
}());
var Response = (function () {
    function Response() {
    }
    return Response;
}());
var Tileset = (function () {
    function Tileset() {
    }
    return Tileset;
}());
//# sourceMappingURL=app.js.map