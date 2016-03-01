using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using WebServer;
using WebServer.websites.beamor.models;
using WebServer.websites.beamor.models.map;

namespace WebServer.websites.beamor.controllers
{
    public class API : IController
    {
        public static Map main_map;
        private static Dictionary<Guid, WebSocket> websockets = new Dictionary<Guid, WebSocket>();

        public API()
        {
            if (main_map == null)
            {
                main_map = new Map(File.ReadAllText(Beamor.WEBSITE_ROOT_PATH + "maps/main_map.json"));
                main_map.MapName = "Map de test";
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
                context.Send(JsonConvert.SerializeObject(main_map.ChunkDictionnary[new Location(0, 0)]));
            }


            if (args[0] == "websocket")
            {
                Console.WriteLine("websocket");

                if (context.Request.IsWebSocketRequest)
                {
                    this.ProcessWebSocketRequest(client, context);
                }
            }

            return true;
        }

        private async void ProcessWebSocketRequest(Client client, HttpListenerContext listenerContext)
        {
            HttpListenerWebSocketContext websocketContext = null;

            try
            {
                websocketContext = await listenerContext.AcceptWebSocketAsync(null);
                string ipAddress = listenerContext.Request.RemoteEndPoint.Address.ToString();
                Console.WriteLine("Connected: IPAddress {0}", ipAddress);
            }
            catch (Exception ex)
            {
                listenerContext.Response.StatusCode = 500;
                listenerContext.Response.Close();
                Console.WriteLine("Exception {0}", ex);
            }

            if(API.websockets.ContainsKey(client.ID))
            {
                await API.websockets[client.ID].CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
                API.websockets.Remove(client.ID);
            }

            API.websockets.Add(client.ID, websocketContext.WebSocket);

            ReceiveData(websocketContext.WebSocket, client);
        }

        public static WebSocket GetWebsocket(Client client)
        {
            if (client == null)
            {
                return null;
            }

            if (API.websockets.ContainsKey(client.ID))
            {
                return API.websockets[client.ID];
            }
            else
            {
                return null;
            }
        }

        private async void ReceiveData(WebSocket websocket, Client client)
        {
            if (websocket == null)
            {
                return;
            }

            while (websocket.State == WebSocketState.Open)
            {
                byte[] receiveBuffer = new byte[2048];

                WebSocketReceiveResult result = await websocket.ReceiveAsync(new ArraySegment<byte>(receiveBuffer), CancellationToken.None);

                if (result.MessageType == WebSocketMessageType.Close)
                {
                    await websocket.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
                    return;
                }
                else
                {
                    DataReceived(receiveBuffer, result.Count, client, result.MessageType);
                }
            }
        }

        private void DataReceived(byte[] data, int length, Client client, WebSocketMessageType type)
        {
            Console.WriteLine("Data Received!");
            if (type == WebSocketMessageType.Text)
            {
                string encodedData = Encoding.UTF8.GetString(data, 0, length);

                Request query = JsonConvert.DeserializeObject<Request>(encodedData);

                if (query != null)
                {
                    GameController.ProcessQuery(client, query);
                }
            }
        }

        public static async void SendData(WebSocket websocket, byte[] data, WebSocketMessageType type)
        {
            if (websocket == null)
            {
                return;
            }

            if (websocket.State == WebSocketState.Open)
            {
                await websocket.SendAsync(new ArraySegment<byte>(data), type, true, CancellationToken.None);
                Console.WriteLine("Data sent!");
            }
        }

        private void SendToAllClients(byte[] data)
        {
            for (int i = 0; i < API.websockets.Count; i++)
            {
                WebSocket websocket = API.websockets.ElementAt(i).Value;
                SendData(websocket, data, WebSocketMessageType.Text);
            }
        }
    }
}
