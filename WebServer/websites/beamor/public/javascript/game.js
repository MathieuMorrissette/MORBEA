    var tile_size = 32; // Tile size in pixel
    var chunk_size = 16; // Number of tiles
    var c = document.getElementById("game");
    var canvas = c.getContext("2d");
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    var map_info = JSON.parse(Get("http://localhost:8080/api/GetMapInfo/"));
    var tilesetName = map_info.tilesets[0].ImageName;
    var tilesetWidth = map_info.tilesets[0].Width;
    var tileset = new Image;
    tileset.src = "http://localhost:8080/resources/tiles/" + tilesetName + ".png"
    var chunk = JSON.parse(Get("http://localhost:8080/api/GetChunk/"));
    var player_info = JSON.parse(Get("http://localhost:8080/api/GetPlayer/"));


    function drawTile(tile_value, posX, posY) {
        var col_count = tilesetWidth / 32;
        var x = tile_value % col_count;
        var y = Math.floor(tile_value / col_count);

        x = (x * tile_size) - 32;
        y = y * tile_size;

        canvas.drawImage(tileset, x, y, 32, 32, posX * 32, posY * 32, 32, 32);
    }

    function Get(yourUrl) {
        var Httpreq = new XMLHttpRequest(); // a new request
        Httpreq.open("GET", yourUrl, false);
        Httpreq.send(null);
        return Httpreq.responseText;
    }

    function GetPosition(indexOfArray) {
        var position = new Object();
        position.x = indexOfArray % chunk_size;
        position.y = Math.floor(indexOfArray / chunk_size);
        return position;
    }

    var lastUpdate = Date.now();

    function loop()
    {
        var now = Date.now();
        var dt = now - lastUpdate;
        lastUpdate = now;

        canvas.clearRect(0, 0, c.width, c.height);

        for (var i = 0; i < chunk.Layers.length; i++) {
            for (var j = 0; j < chunk.Layers[0].length; j++) {
                if (chunk.Layers[i][j] == 0)
                {
                    continue;
                }
                var position = GetPosition(j);
                drawTile(chunk.Layers[i][j], position.x, position.y);
            }
        }

        calculate_position(dt);
        draw_Player();
    }

    function calculate_position(delta_time)
    {
        var move_count =  delta_time / 10;

        if (map[68]) {
            player_info.PositionInfo.PosX += move_count ;
        }

        if (map[87]) {
            player_info.PositionInfo.PosY -= move_count ;
        }

        if (map[65]) {
            player_info.PositionInfo.PosX -= move_count;
        }

        if (map[83]) {
            player_info.PositionInfo.PosY += move_count;
        }
    }

    function draw_Player()
    {
        var image = GetPlayerImage(player_info);
        canvas.drawImage(image, player_info.PositionInfo.PosX, player_info.PositionInfo.PosY);
    }

    function GetPlayerImage(player)
    {
        var player_image = new Image;
        if (player.Type == 1)
        {
            player_image.src = "../resources/characters/archer.png";
        }

        return player_image;
    }

    var map = { 68: false, 87: false, 65: false, 83: false};

    document.onkeydown = function (e)
    {
        if (e.keyCode in map) {
            map[e.keyCode] = true;
        }
    };

    document.onkeyup = function (e) {
        if (e.keyCode in map)
        {
            map[e.keyCode] = false;
        }
    };

    setInterval(loop, 16);

