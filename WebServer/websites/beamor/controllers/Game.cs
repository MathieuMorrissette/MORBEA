using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WebServer;

namespace HttpServer.websites.beamor.controllers
{
    public class Game : IController
    {
        public bool HandleRequest(Client client, HttpListenerContext context, params string[] args)
        {
            context.Send("Hello Bob");
            return true;
        }
    }
}
