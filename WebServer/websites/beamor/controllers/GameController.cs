using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using WebServer.websites.beamor.models;
using WebServer.websites.beamor.models.communication;
using WebServer.websites.beamor.models.map;

namespace WebServer.websites.beamor.controllers
{
    public static class GameController
    {
        public static bool ProcessQuery(Client client, Request request)
        {
            WebSocket socket = API.GetWebsocket(client);

            if (socket == null || request == null)
            {
                return false;
            }

            if (request.Message == "map_info")
            {
                Response response = new Response();
                response.Message = "map_info";
                response.Data = API.main_map.GetMapInfo();

                string data = JsonConvert.SerializeObject(response);

                API.SendData(socket, Encoding.UTF8.GetBytes(data), WebSocketMessageType.Text);
            }

            if (request.Message == "player_info")
            {
                Response response = new Response();
                response.Message = "player_info";
                response.Data = new Player("Kevin") { Type = PlayerType.Archer };

                string data = JsonConvert.SerializeObject(response);

                API.SendData(socket, Encoding.UTF8.GetBytes(data), WebSocketMessageType.Text);
            }

            if (request.Message.Contains("get_chunk"))
            {
                string[] args = request.Message.Split('|');

                Response response = new Response();
                response.Message = "get_chunk";
                response.Data = JsonConvert.SerializeObject(API.main_map.ChunkDictionnary[new Location(Convert.ToInt32(args[1]), Convert.ToInt32(args[2]))]);
                
                string data = JsonConvert.SerializeObject(response);
                API.SendData(socket, Encoding.UTF8.GetBytes(data), WebSocketMessageType.Text);
            }

            return true;
        }
    }
}
