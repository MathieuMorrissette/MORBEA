using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WebServer;
using WebServer.websites.beamor.models;
using WebServer.websites.beamor.models.map;

namespace WebServer.websites.beamor.controllers
{
    public class API : IController
    {
        Map map = new Map();
        Chunk chunk = new Chunk();
        Player player = new Player("KevinBeausejour");

        public API()
        {
            Tile tile = new Tile();
            tile.Layers.Push(new TileLayer() { ImageName = "green_grass.png" });

            chunk.FillChunk(tile);

            map.Chunks[0, 0] = chunk;

            player.PositionInfo.PosX = 0;
            player.PositionInfo.PosY = 0;
        }
        public bool HandleRequest(Client client, HttpListenerContext context, params string[] args)
        {
            if (args[0] == "GetChunk")
            {
                context.Send(JsonConvert.SerializeObject(chunk));
            }

            return true;
        }
    }
}
