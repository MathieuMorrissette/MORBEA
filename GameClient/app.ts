var TILE_SIZE = 32;
var CHUNK_SIZE = 16; // Number of tiles
var CHUNK_COUNT = 3;

class GameClient
{
    private websocket_url: string = "ws://localhost:8080/api/websocket";
    private websocket: WebSocket;
    private map_info: MapInfo;
    public player_info: Player;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private Chunks: Chunk[][] = new Array<Chunk[]>(CHUNK_COUNT); // Must not be even
    private tile_buffer: HTMLImageElement[] = new Array<HTMLImageElement>();

    private canvas_buffer: HTMLCanvasElement;
    private canvas_buffer_context: CanvasRenderingContext2D;
    private tile_cache: ImageData[] = new Array<ImageData>();
    private canvas_data: ImageData;
    private tileset_image: HTMLImageElement;

    constructor()
    {
        this.CreateWebSocket();
        this.canvas = document.getElementById("game") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");

        this.canvas_buffer = document.createElement("canvas");
        this.canvas_buffer.width = TILE_SIZE;
        this.canvas_buffer.height = TILE_SIZE;
        this.canvas_buffer_context = this.canvas_buffer.getContext("2d");

        this.InitialiseCanvas();

        //Create the 2d array
        for (var i = 0; i < CHUNK_COUNT; i++)
        {
            this.Chunks[i] = new Array<Chunk>(CHUNK_COUNT);
        }
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
    }

    private SocketClosed(event: CloseEvent)
    {
        console.log("Socket Closed!");
    }

    private SocketError(event: Event)
    {
        console.log("Error");
    }

    private GetChunkPositionInMapFromLocalPosition(localChunkPosition: ChunkLocation)
    {
        var playerChunkPosition = this.GetPlayerChunkLocation(this.player_info);
        var chunkMapLocation = new ChunkLocation();

        chunkMapLocation.X = (playerChunkPosition.X - Math.floor((CHUNK_COUNT / 2))) + localChunkPosition.X;
        chunkMapLocation.Y = (playerChunkPosition.Y - Math.floor((CHUNK_COUNT / 2))) + localChunkPosition.Y;

        return chunkMapLocation;
    }

    private GetChunkPositionInLocalArray(mapChunkPosition: ChunkLocation)
    {
        var playerChunkPosition = this.GetPlayerChunkLocation(this.player_info);
        var chunkLocalPosition = new ChunkLocation();

        chunkLocalPosition.X = mapChunkPosition.X - (playerChunkPosition.X - Math.floor((CHUNK_COUNT / 2)));
        chunkLocalPosition.Y = mapChunkPosition.Y - (playerChunkPosition.Y - Math.floor((CHUNK_COUNT / 2)));

        if (chunkLocalPosition.X < 0 || chunkLocalPosition.X >= CHUNK_COUNT)
        {
            return null;
        }

        if (chunkLocalPosition.Y < 0 || chunkLocalPosition.Y >= CHUNK_COUNT) {
            return null;
        }

        return chunkLocalPosition;
    }
    
    private GetPlayerChunkLocation(player: Player) : ChunkLocation
    {
        var chunkLocation = new ChunkLocation();
        
        chunkLocation.X = Math.round(player.PositionInfo.PosX / (CHUNK_SIZE * TILE_SIZE));
        chunkLocation.Y = Math.round(player.PositionInfo.PosY / (CHUNK_SIZE * TILE_SIZE));

        return chunkLocation;
    }

    private ReceivedMapInfo()
    {
        this.map_info.Tilesets[0].GetImage((image) => {
            this.tileset_image = image;
            this.GetPlayerInfo();
        });
    }

    private SocketMessageReceived(event: MessageEvent)
    {
        var response = JSON.parse(event.data) as IResponse;

        if (response.Message == "map_info")
        {
            var receivedMapInfo = response.Data as IMapInfo;

            this.map_info = MapInfo.GetMapInfo(receivedMapInfo);
            console.log("Received the map info! MapName " + this.map_info.MapName);
            this.ReceivedMapInfo();
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

            var chunkLocationInLocalArray = this.GetChunkPositionInLocalArray(chunk.Location);

            if (chunkLocationInLocalArray == null)
            {
                return;
            }

            this.Chunks[chunkLocationInLocalArray.X][chunkLocationInLocalArray.Y] = chunk;

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

    private DrawChunks()
    {
        for (var chunkX = 0; chunkX < CHUNK_COUNT; chunkX++)
        {
            for (var chunkY = 0; chunkY < CHUNK_COUNT; chunkY++)
            {
                var chunk = this.Chunks[chunkX][chunkY];

                if (chunk == null)
                {
                    continue;
                }

                //Draw the chunk with it's layers
                for (var i = 0; i < chunk.Layers.length; i++)
                {
                    for (var j = 0; j < chunk.Layers[0].length; j++)
                    {
                        var tile_value = chunk.Layers[i][j];

                        if (tile_value == 0)
                        {
                            continue;
                        }

                        var position = this.GetPosition(j);
                        this.DrawTile(tile_value, (chunkX * CHUNK_SIZE) + position.x, (chunkY * CHUNK_SIZE) + position.y);
                        //console.log("Drawing tile at" + ((chunkX * CHUNK_SIZE) + position.x) + "," + ((chunkY * CHUNK_SIZE) + position.y));
                    }
                }
            }
        }
    }

    //Positions are in tile... not in pixel
    private DrawTile(tile_value: number, posX: number, posY: number)
    {
        var col_count = this.map_info.Tilesets[0].Width / 32;
        var x = tile_value % col_count;
        var y = Math.floor(tile_value / col_count);

        x = (x * TILE_SIZE) - 32;
        y = y * TILE_SIZE;

        if (this.tile_cache[tile_value] == null)
        {
            this.canvas_buffer_context.drawImage(this.tileset_image, x, y, 32, 32, posX * 32, posY * 32, 32, 32);
            this.tile_cache[tile_value] = this.canvas_buffer_context.getImageData(0, 0, TILE_SIZE, TILE_SIZE);
        }

        var tilePixelArray = this.tile_cache[tile_value].data;

        var drawX = 0;
        var drawY = 0;

        var posXPixel = posX * TILE_SIZE;
        var posYPixel = posY * TILE_SIZE;

        for (var tilePixelIndex = 0; tilePixelIndex < tilePixelArray.length; tilePixelIndex+=4)
        {
            drawX = Math.floor(tilePixelIndex % (TILE_SIZE * 4));
            drawY = Math.floor(tilePixelIndex/ TILE_SIZE);

            var realIndex = (((posYPixel + drawY) * (this.canvas_data.width * 4)) + (posXPixel + drawX));

            this.canvas_data.data[realIndex] = tilePixelArray[tilePixelIndex];
            this.canvas_data.data[realIndex + 1] = tilePixelArray[tilePixelIndex + 1];
            this.canvas_data.data[realIndex + 2] = tilePixelArray[tilePixelIndex + 2];
            this.canvas_data.data[realIndex + 3] = tilePixelArray[tilePixelIndex + 3];
        }
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
        var playerChunkPosition = this.GetPlayerChunkLocation(this.player_info);

        var X = (playerChunkPosition.X - Math.floor((CHUNK_COUNT / 2)));
        var Y = (playerChunkPosition.Y - Math.floor((CHUNK_COUNT / 2)));


        for (var i = 0; i < CHUNK_COUNT; i++)
        {
            for (var j = 0; j < CHUNK_COUNT; j++)
            {
                var chunk_request = new Request();
                chunk_request.Message = "get_chunk|" + (i + X) + "|" + (j + Y);

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
        this.canvas_buffer_context.drawImage(Image, (this.canvas.width / 2) - (Image.width / 2), (this.canvas.height / 2) - (Image.height / 2));
    }

    private StartLoop()
    {
        this.GetChunks();
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
        this.CheckResize();
        this.canvas_data = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        //this.ClearCanvas();

        this.DrawChunks();
        //this.DrawPlayer();


        // Copy image from canvas buffer to the rendered canvas
        //this.ctx.drawImage(this.canvas_buffer, 0, 0);

        this.ctx.putImageData(this.canvas_data, 0,0);
    }
}

var gameclient;

window.onload = function () {
    gameclient = new GameClient();
}