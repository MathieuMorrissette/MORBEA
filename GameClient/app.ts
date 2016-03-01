var TILE_SIZE = 32;
var CHUNK_SIZE = 16; // Number of tiles

class GameClient
{
    private websocket_url: string = "ws://localhost:8080/api/websocket";
    private websocket: WebSocket;
    private map_info: MapInfo;
    public player_info: Player;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private Chunks: Chunk[][] = new Array<Chunk[]>(5); // Must not be even
    private ChunkTest: Chunk;

    constructor()
    {
        this.CreateWebSocket();
        this.canvas = document.getElementById("game") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.InitialiseCanvas();
    }

    private CreateWebSocket()
    {
        this.websocket = new WebSocket(this.websocket_url);

        this.websocket.onopen = (event) => { this.SocketOpened(event); };

        this.websocket.onclose = (event) => { this.SocketClosed(event); };

        this.websocket.onerror = (event) => { this.SocketError(event); };

        this.websocket.onmessage = (event) => { this.SocketMessageReceived(event); };
    }

    private SocketOpened(event: Event)
    {
        this.GetMapInfo();
        this.GetPlayerInfo();
        this.GetChunks();
    }

    private SocketClosed(event: CloseEvent)
    {
        console.log("Socket Closed!");
    }

    private SocketError(event: Event)
    {
        console.log("Error");
    }

    private SocketMessageReceived(event: MessageEvent)
    {
        var response = JSON.parse(event.data) as IResponse;

        if (response.Message == "map_info")
        {
            var receivedMapInfo = response.Data as IMapInfo;

            this.map_info = MapInfo.GetMapInfo(receivedMapInfo);
            console.log("Received the map info! MapName " + this.map_info.MapName);
        }

        if (response.Message == "player_info")
        {
            var object = response.Data as IPlayer;
            var receivedPlayerInfo = Player.GetPlayer(object);

            this.player_info = receivedPlayerInfo;
            console.log("Received the player info! PlayerName " + this.player_info.Name);
            this.StartLoop();
        }

        if (response.Message == "get_chunk")
        {
            var buffer = response.Data as IChunk;
            var chunk = Chunk.GetChunk(buffer);
            this.ChunkTest = chunk;

            console.log("Chunk Received from server!");
        }
    }

    private GetPosition(indexOfArray)
    {
        var position: any = {};
        position.x = indexOfArray % CHUNK_SIZE;
        position.y = Math.floor(indexOfArray / CHUNK_SIZE);
        return position;
    }

    private DrawTestChunk()
    {
        for (var i = 0; i < this.ChunkTest.Layers.length; i++) {
            for (var j = 0; j < this.ChunkTest.Layers[0].length; j++) {
                if (this.ChunkTest.Layers[i][j] == 0) {
                    continue;
                }
                var position = this.GetPosition(j);
                this.DrawTile(this.ChunkTest.Layers[i][j], position.x, position.y);
            }
        }
    }

    private DrawTile(tile_value: number, posX: number, posY: number)
    {
        var col_count = this.map_info.Tilesets[0].Width / 32;
        var x = tile_value % col_count;
        var y = Math.floor(tile_value / col_count);

        x = (x * TILE_SIZE) - 32;
        y = y * TILE_SIZE;

        this.ctx.drawImage(this.map_info.Tilesets[0].GetImage(), x, y, 32, 32, posX * 32, posY * 32, 32, 32);
    }

    private GetPlayerInfo(): Boolean
    {
        if (!(this.websocket.readyState == 1))
        {
            return false;
        }

        var request_player_info = new Request();
        request_player_info.Message = "player_info";
        this.websocket.send(JSON.stringify(request_player_info));

        return true;
    }

    private GetMapInfo(): Boolean
    {
        if (!(this.websocket.readyState == 1))
        {
            return false;
        }

        var request_mapinfo = new Request();
        request_mapinfo.Message = "map_info";
        this.websocket.send(JSON.stringify(request_mapinfo));
        return true;
    }

    private GetChunks()
    {
        for (var i = 0; i < 1; i++)
        {
            for (var j = 0; j < 1; j++)
            {
                var chunk_request = new Request();
                chunk_request.Message = "get_chunk|" + i + "|" + j;

                this.websocket.send(JSON.stringify(chunk_request));
            }
        }
    }

    private InitialiseCanvas()
    {
        this.ctx.msImageSmoothingEnabled = false;
    }

    private DrawPlayer()
    {
        var Image = this.player_info.GetPlayerImage();
        this.ctx.drawImage(Image, (this.canvas.width / 2) - (Image.width / 2), (this.canvas.height / 2) - (Image.height / 2));
    }

    private StartLoop()
    {
        setInterval(() => { this.DrawLoop(); }, 16);
    }

    private CheckResize()
    {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    private ClearCanvas()
    {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    private DrawLoop()
    {
        this.ClearCanvas();
        //this.CheckResize();
        this.DrawTestChunk();
        this.DrawPlayer();
    }
}

var gameclient;

window.onload = function () {
    gameclient = new GameClient();
}