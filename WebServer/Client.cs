// TODO : Separate client from the first website.

using System;
using System.Collections.Generic;
using System.IO;
using System.Net;

namespace WebServer
{
    public class Client
    {
        public Client(Guid ID)
        {
            this.ID = ID;
            this.Dictionary = new Dictionary<string, object>();
            this.DateCreated = DateTime.Now;
        }

        public Guid ID { get; private set; }
        public Dictionary<string, object> Dictionary { get; private set; }
        public DateTime DateCreated { get; private set; }
    }
}
