using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
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
        private static Map main_map;

        public API()
        {
            if (main_map == null)
            {
                main_map = new Map(File.ReadAllText(Beamor.WEBSITE_ROOT_PATH + "maps/main_map.json"));
            }

        }
        public bool HandleRequest(Client client, HttpListenerContext context, params string[] args)
        {
            if (args[0] == "GetMapInfo")
            {
                Dictionary<string, object> mapInfo = new Dictionary<string, object>();
                mapInfo.Add("map_name", main_map.MapName);
                mapInfo.Add("tilesets", main_map.Tilesets);

                context.Send(JsonConvert.SerializeObject(mapInfo));
            }

            if (args[0] == "GetChunk")
            {
                context.Send(JsonConvert.SerializeObject(main_map.Chunks[89]));
            }

            if (args[0] == "GetPlayer")
            {
                context.Send(JsonConvert.SerializeObject(new Player("Kevin") { Type = PlayerType.Archer }));
            }

            return true;
        }
    }
}
