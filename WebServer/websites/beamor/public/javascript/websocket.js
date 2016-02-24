var websocket = new WebSocket("ws://localhost:8080/api/websocket");
websocket.onmessage = function (event)
{
    DataReceived(event);
};

websocket.onopen = function (event) {
    WebSocketOpened(event);
};

websocket.onclose = function (event)
{
    WebSocketClosed(event);
};

websocket.onerror = function (event)
{
    ErrorReceived(event);
};