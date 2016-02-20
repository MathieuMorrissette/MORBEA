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

    function loop() {
        for (var i = 0; i < chunk.Layers.length; i++) {
            for (var j = 0; j < chunk.Layers[0].length; j++) {
                var position = GetPosition(j);
                drawTile(chunk.Layers[0][j], position.x, position.y);
            }
        }
    }

    setInterval(loop, 30);

