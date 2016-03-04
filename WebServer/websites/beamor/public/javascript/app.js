var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TILE_SIZE = 32;
var CHUNK_SIZE = 16; // Number of tiles
var CHUNK_COUNT = 3;
var GameClient = (function () {
    function GameClient() {
        this.websocket_url = "ws://localhost:8080/api/websocket";
        this.Chunks = new Array(CHUNK_COUNT); // Must not be even
        this.tile_buffer = new Array();
        this.tile_cache = new Array();
        this.CreateWebSocket();
        this.canvas = document.getElementById("game");
        this.ctx = this.canvas.getContext("2d");
        this.canvas_buffer = document.createElement("canvas");
        this.canvas_buffer.width = TILE_SIZE;
        this.canvas_buffer.height = TILE_SIZE;
        this.canvas_buffer_context = this.canvas_buffer.getContext("2d");
        this.InitialiseCanvas();
        //Create the 2d array
        for (var i = 0; i < CHUNK_COUNT; i++) {
            this.Chunks[i] = new Array(CHUNK_COUNT);
        }
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
    GameClient.prototype.GetChunkPositionInMapFromLocalPosition = function (localChunkPosition) {
        var playerChunkPosition = this.GetPlayerChunkLocation(this.player_info);
        var chunkMapLocation = new ChunkLocation();
        chunkMapLocation.X = (playerChunkPosition.X - Math.floor((CHUNK_COUNT / 2))) + localChunkPosition.X;
        chunkMapLocation.Y = (playerChunkPosition.Y - Math.floor((CHUNK_COUNT / 2))) + localChunkPosition.Y;
        return chunkMapLocation;
    };
    GameClient.prototype.GetChunkPositionInLocalArray = function (mapChunkPosition) {
        var playerChunkPosition = this.GetPlayerChunkLocation(this.player_info);
        var chunkLocalPosition = new ChunkLocation();
        chunkLocalPosition.X = mapChunkPosition.X - (playerChunkPosition.X - Math.floor((CHUNK_COUNT / 2)));
        chunkLocalPosition.Y = mapChunkPosition.Y - (playerChunkPosition.Y - Math.floor((CHUNK_COUNT / 2)));
        if (chunkLocalPosition.X < 0 || chunkLocalPosition.X >= CHUNK_COUNT) {
            return null;
        }
        if (chunkLocalPosition.Y < 0 || chunkLocalPosition.Y >= CHUNK_COUNT) {
            return null;
        }
        return chunkLocalPosition;
    };
    GameClient.prototype.GetPlayerChunkLocation = function (player) {
        var chunkLocation = new ChunkLocation();
        chunkLocation.X = Math.round(player.PositionInfo.PosX / (CHUNK_SIZE * TILE_SIZE));
        chunkLocation.Y = Math.round(player.PositionInfo.PosY / (CHUNK_SIZE * TILE_SIZE));
        return chunkLocation;
    };
    GameClient.prototype.ReceivedMapInfo = function () {
        var _this = this;
        this.map_info.Tilesets[0].GetImage(function (image) {
            _this.tileset_image = image;
            _this.GetPlayerInfo();
        });
    };
    GameClient.prototype.SocketMessageReceived = function (event) {
        var response = JSON.parse(event.data);
        if (response.Message == "map_info") {
            var receivedMapInfo = response.Data;
            this.map_info = MapInfo.GetMapInfo(receivedMapInfo);
            console.log("Received the map info! MapName " + this.map_info.MapName);
            this.ReceivedMapInfo();
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
            var chunkLocationInLocalArray = this.GetChunkPositionInLocalArray(chunk.Location);
            if (chunkLocationInLocalArray == null) {
                return;
            }
            this.Chunks[chunkLocationInLocalArray.X][chunkLocationInLocalArray.Y] = chunk;
            console.log("Chunk Received from server!");
        }
    };
    GameClient.prototype.GetPosition = function (indexOfArray) {
        var position = {};
        position.x = indexOfArray % CHUNK_SIZE;
        position.y = Math.floor(indexOfArray / CHUNK_SIZE);
        return position;
    };
    GameClient.prototype.DrawChunks = function () {
        for (var chunkX = 0; chunkX < CHUNK_COUNT; chunkX++) {
            for (var chunkY = 0; chunkY < CHUNK_COUNT; chunkY++) {
                var chunk = this.Chunks[chunkX][chunkY];
                if (chunk == null) {
                    continue;
                }
                //Draw the chunk with it's layers
                for (var i = 0; i < chunk.Layers.length; i++) {
                    for (var j = 0; j < chunk.Layers[0].length; j++) {
                        var tile_value = chunk.Layers[i][j];
                        if (tile_value == 0) {
                            continue;
                        }
                        var position = this.GetPosition(j);
                        this.DrawTile(tile_value, (chunkX * CHUNK_SIZE) + position.x, (chunkY * CHUNK_SIZE) + position.y);
                    }
                }
            }
        }
    };
    //Positions are in tile... not in pixel
    GameClient.prototype.DrawTile = function (tile_value, posX, posY) {
        var col_count = this.map_info.Tilesets[0].Width / 32;
        var x = tile_value % col_count;
        var y = Math.floor(tile_value / col_count);
        x = (x * TILE_SIZE) - 32;
        y = y * TILE_SIZE;
        if (this.tile_cache[tile_value] == null) {
            this.canvas_buffer_context.drawImage(this.tileset_image, x, y, 32, 32, posX * 32, posY * 32, 32, 32);
            this.tile_cache[tile_value] = this.canvas_buffer_context.getImageData(0, 0, TILE_SIZE, TILE_SIZE);
        }
        var tilePixelArray = this.tile_cache[tile_value].data;
        var drawX = 0;
        var drawY = 0;
        var posXPixel = posX * TILE_SIZE;
        var posYPixel = posY * TILE_SIZE;
        for (var tilePixelIndex = 0; tilePixelIndex < tilePixelArray.length; tilePixelIndex += 4) {
            drawX = Math.floor(tilePixelIndex % (TILE_SIZE * 4));
            drawY = Math.floor(tilePixelIndex / TILE_SIZE);
            var realIndex = (((posYPixel + drawY) * (this.canvas_data.width * 4)) + (posXPixel + drawX));
            this.canvas_data.data[realIndex] = tilePixelArray[tilePixelIndex];
            this.canvas_data.data[realIndex + 1] = tilePixelArray[tilePixelIndex + 1];
            this.canvas_data.data[realIndex + 2] = tilePixelArray[tilePixelIndex + 2];
            this.canvas_data.data[realIndex + 3] = tilePixelArray[tilePixelIndex + 3];
        }
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
        var playerChunkPosition = this.GetPlayerChunkLocation(this.player_info);
        var X = (playerChunkPosition.X - Math.floor((CHUNK_COUNT / 2)));
        var Y = (playerChunkPosition.Y - Math.floor((CHUNK_COUNT / 2)));
        for (var i = 0; i < CHUNK_COUNT; i++) {
            for (var j = 0; j < CHUNK_COUNT; j++) {
                var chunk_request = new Request();
                chunk_request.Message = "get_chunk|" + (i + X) + "|" + (j + Y);
                this.websocket.send(JSON.stringify(chunk_request));
            }
        }
    };
    GameClient.prototype.InitialiseCanvas = function () {
        this.ctx.msImageSmoothingEnabled = false;
    };
    GameClient.prototype.DrawPlayer = function () {
        var Image = this.player_info.GetPlayerImage();
        this.canvas_buffer_context.drawImage(Image, (this.canvas.width / 2) - (Image.width / 2), (this.canvas.height / 2) - (Image.height / 2));
    };
    GameClient.prototype.StartLoop = function () {
        var _this = this;
        this.GetChunks();
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
        this.CheckResize();
        this.canvas_data = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        //this.ClearCanvas();
        this.DrawChunks();
        //this.DrawPlayer();
        // Copy image from canvas buffer to the rendered canvas
        //this.ctx.drawImage(this.canvas_buffer, 0, 0);
        this.ctx.putImageData(this.canvas_data, 0, 0);
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
var ChunkLocation = (function () {
    function ChunkLocation() {
    }
    return ChunkLocation;
}());
var MapInfo = (function () {
    function MapInfo() {
    }
    MapInfo.GetMapInfo = function (mapInfo) {
        var buffer = new MapInfo();
        buffer.MapName = mapInfo.MapName;
        buffer.Tilesets = Tileset.GetTilesets(mapInfo.Tilesets);
        buffer.Width = mapInfo.Width;
        buffer.Height = mapInfo.Height;
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
    Tileset.prototype.GetImage = function (callback) {
        var image = new Image();
        image.onload = function () {
            console.log("Image has been loaded successfully!");
            callback(image);
        };
        image.src = "http://localhost:8080/resources/tiles/" + this.ImageName + ".png";
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