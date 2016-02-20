using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites.beamor.models.map
{
    public class Tile
    {
        public Stack<TileLayer> Layers = new Stack<TileLayer>();

        public bool Walkable { get; set; } = true;
    }
}
