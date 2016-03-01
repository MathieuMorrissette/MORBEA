var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TILE_SIZE = 32;
var CHUNK_SIZE = 16; // Number of tiles
var GameClient = (function () {
    function GameClient() {
        this.websocket_url = "ws://localhost:8080/api/websocket";
        this.Chunks = new Array(5); // Must not be even
        this.CreateWebSocket();
        this.canvas = document.getElementById("game");
        this.ctx = this.canvas.getContext("2d");
        this.InitialiseCanvas();
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
        this.GetPlayerInfo();
        this.GetChunks();
    };
    GameClient.prototype.SocketClosed = function (event) {
        console.log("Socket Closed!");
    };
    GameClient.prototype.SocketError = function (event) {
        console.log("Error");
    };
    GameClient.prototype.SocketMessageReceived = function (event) {
        var response = JSON.parse(event.data);
        if (response.Message == "map_info") {
            var receivedMapInfo = response.Data;
            this.map_info = MapInfo.GetMapInfo(receivedMapInfo);
            console.log("Received the map info! MapName " + this.map_info.MapName);
        }
        if (response.Message == "player_info") {
            var object = response.Data;
            var receivedPlayerInfo = Player.GetPlayer(object);
            this.player_info = receivedPlayerInfo;
            console.log("Received the player info! PlayerName " + this.player_info.Name);
            this.StartLoop();
        }
        if (response.Message == "get_chunk") {
            var buffer = response.Data;
            var chunk = Chunk.GetChunk(buffer);
            this.ChunkTest = chunk;
            console.log("Chunk Received from server!");
        }
    };
    GameClient.prototype.GetPosition = function (indexOfArray) {
        var position = {};
        position.x = indexOfArray % CHUNK_SIZE;
        position.y = Math.floor(indexOfArray / CHUNK_SIZE);
        return position;
    };
    GameClient.prototype.DrawTestChunk = function () {
        for (var i = 0; i < this.ChunkTest.Layers.length; i++) {
            for (var j = 0; j < this.ChunkTest.Layers[0].length; j++) {
                if (this.ChunkTest.Layers[i][j] == 0) {
                    continue;
                }
                var position = this.GetPosition(j);
                this.DrawTile(this.ChunkTest.Layers[i][j], position.x, position.y);
            }
        }
    };
    GameClient.prototype.DrawTile = function (tile_value, posX, posY) {
        var col_count = this.map_info.Tilesets[0].Width;
        var x = tile_value % col_count;
        var y = Math.floor(tile_value / col_count);
        x = (x * TILE_SIZE) - 32;
        y = y * TILE_SIZE;
        this.ctx.drawImage(this.map_info.Tilesets[0].GetImage(), x, y, 32, 32, posX * 32, posY * 32, 32, 32);
    };
    GameClient.prototype.GetPlayerInfo = function () {
        if (!(this.websocket.readyState == 1)) {
            return false;
        }
        var request_player_info = new Request();
        request_player_info.Message = "player_info";
        this.websocket.send(JSON.stringify(request_player_info));
        return true;
    };
    GameClient.prototype.GetMapInfo = function () {
        if (!(this.websocket.readyState == 1)) {
            return false;
        }
        var request_mapinfo = new Request();
        request_mapinfo.Message = "map_info";
        this.websocket.send(JSON.stringify(request_mapinfo));
        return true;
    };
    GameClient.prototype.GetChunks = function () {
        for (var i = 0; i < 5; i++) {
            for (var j = 0; j < 5; j++) {
                var chunk_request = new Request();
                chunk_request.Message = "get_chunk|" + i + "|" + j;
                this.websocket.send(JSON.stringify(chunk_request));
            }
        }
    };
    GameClient.prototype.InitialiseCanvas = function () {
        this.ctx.msImageSmoothingEnabled = false;
    };
    GameClient.prototype.DrawPlayer = function () {
        var Image = this.player_info.GetPlayerImage();
        this.ctx.drawImage(Image, (this.canvas.width / 2) - (Image.width / 2), (this.canvas.height / 2) - (Image.height / 2));
    };
    GameClient.prototype.StartLoop = function () {
        var _this = this;
        setInterval(function () { _this.DrawLoop(); }, 16);
    };
    GameClient.prototype.CheckResize = function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };
    GameClient.prototype.ClearCanvas = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    GameClient.prototype.DrawLoop = function () {
        this.ClearCanvas();
        //this.CheckResize();
        this.DrawTestChunk();
        this.DrawPlayer();
    };
    return GameClient;
}());
var gameclient;
window.onload = function () {
    gameclient = new GameClient();
};
var Request = (function () {
    function Request() {
        this.Message = "";
    }
    Request.GetRequest = function (request) {
        var buffer = new Request();
        buffer.Message = request.Message;
        return buffer;
    };
    return Request;
}());
var Response = (function () {
    function Response() {
    }
    return Response;
}());
var Character = (function () {
    function Character() {
    }
    return Character;
}());
var Chunk = (function () {
    function Chunk() {
    }
    Chunk.GetChunk = function (chunk) {
        var buffer = new Chunk();
        buffer.Layers = chunk.Layers;
        buffer.Location = chunk.Location;
        return buffer;
    };
    return Chunk;
}());
var MapInfo = (function () {
    function MapInfo() {
    }
    MapInfo.GetMapInfo = function (mapInfo) {
        var buffer = new MapInfo();
        buffer.MapName = mapInfo.MapName;
        buffer.Tilesets = Tileset.GetTilesets(mapInfo.Tilesets);
        return buffer;
    };
    return MapInfo;
}());
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        _super.apply(this, arguments);
    }
    Player.prototype.GetPlayerImage = function () {
        var player_image = new Image();
        if (this.Type == PlayerType.Archer) {
            player_image.src = "../resources/characters/archer.png";
        }
        return player_image;
    };
    Player.GetPlayer = function (player) {
        var buffer = new Player();
        buffer.Type = player.Type;
        buffer.Name = player.Name;
        buffer.PositionInfo = player.PositionInfo;
        buffer.Health = player.Health;
        buffer.Strengh = player.Strengh;
        buffer.Defence = player.Defence;
        buffer.GodMode = player.GodMode;
        return buffer;
    };
    return Player;
}(Character));
var PositionInfo = (function () {
    function PositionInfo() {
    }
    return PositionInfo;
}());
var Tileset = (function () {
    function Tileset() {
    }
    Tileset.GetTilesets = function (tilesets) {
        var list = new Array();
        for (var i = 0; i < tilesets.length; i++) {
            var tileset = tilesets[i];
            var tilesetInstance = Tileset.GetTileset(tileset);
            list.push(tilesetInstance);
        }
        return list;
    };
    Tileset.prototype.GetImage = function () {
        var image = new Image();
        image.src = "http://localhost:8080/resources/tiles/" + this.ImageName + ".png";
        return image;
    };
    Tileset.GetTileset = function (tileset) {
        var buffer = new Tileset();
        buffer.ImageName = tileset.ImageName;
        buffer.Width = tileset.Width;
        buffer.Height = tileset.Height;
        return buffer;
    };
    return Tileset;
}());
var PlayerType;
(function (PlayerType) {
    PlayerType[PlayerType["Warrior"] = 0] = "Warrior";
    PlayerType[PlayerType["Archer"] = 1] = "Archer";
    PlayerType[PlayerType["Thief"] = 2] = "Thief";
    PlayerType[PlayerType["Magician"] = 3] = "Magician";
})(PlayerType || (PlayerType = {}));
var SerializationHelper = (function () {
    function SerializationHelper() {
    }
    SerializationHelper.toInstance = function (obj, json) {
        var jsonObj = JSON.parse(json);
        if (typeof obj["fromJSON"] === "function") {
            obj["fromJSON"](jsonObj);
        }
        else {
            for (var propName in jsonObj) {
                obj[propName] = jsonObj[propName];
            }
        }
        return obj;
    };
    return SerializationHelper;
}());
var IRequest = (function () {
    function IRequest() {
    }
    return IRequest;
}());
//# sourceMappingURL=app.js.map