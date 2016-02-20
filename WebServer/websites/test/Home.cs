using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites.test
{
    class Home : IController
    {
        public bool HandleRequest(Client client, HttpListenerContext context, params string[] args)
        {
            context.Send(File.ReadAllText(WebSite.WEBSITE_ROOT_PATH + "html/index.html"));

            return true;
        }
    }
}
