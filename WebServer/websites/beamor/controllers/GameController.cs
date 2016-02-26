using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using WebServer.websites.beamor.models;
using WebServer.websites.beamor.models.communication;

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

            return true;
        }
    }
}
