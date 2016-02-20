using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WebServer;

namespace WebServer.websites.beamor.controllers
{
    public class Game : IController
    {
        public bool HandleRequest(Client client, HttpListenerContext context, params string[] args)
        {
            context.Send(File.ReadAllText(Beamor.WEBSITE_ROOT_PATH + "html/game.html" ));
            return true;
        }
    }
}
