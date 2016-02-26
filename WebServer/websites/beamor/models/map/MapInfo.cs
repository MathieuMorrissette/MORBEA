using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites.beamor.models.map
{
    public class MapInfo
    {
        public string MapName { get; set; }
        public Tileset[] Tilesets { get; set; }
    }
}
