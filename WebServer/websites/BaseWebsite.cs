using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites
{
    public class BaseWebsite
    {
        public Client Client { get; private set; }
        public HttpListenerContext Context { get; set; }

        public BaseWebsite(Client client, HttpListenerContext context)
        {
            this.Client = client;
            this.Context = context;
        }

        public virtual void HandleRequest()
        {
        }
    }
}
