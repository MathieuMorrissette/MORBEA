using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites.beamor.models.map
{
    public class Map
    {
        public string MapName { get; set; }
        public Chunk[,] Chunks = new Chunk[100, 100];
    }
}
