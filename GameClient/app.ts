class GameClient {
    private websocket_url: string = "ws://localhost:8080/api/websocket";
    private websocket: WebSocket;
    private map_info: MapInfo;
    public player_info: Player;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor()
    {
        this.CreateWebSocket();
        this.canvas = document.getElementById("game") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");        
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
        this.GetPlayerInfo();
    }

    private SocketClosed(event: CloseEvent) {
        console.log("Socket Closed!");
    }

    private SocketError(event: Event) {
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
        this.CheckResize();
        this.DrawPlayer();
    }
}

var gameclient;

window.onload = function () {
    gameclient = new GameClient();
}