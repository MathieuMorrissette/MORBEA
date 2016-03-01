using WebServer.websites.beamor.models.map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites.beamor.models
{
    public class Chunk
    {
        public Location Location { get; private set; }
        public List<int[]> Layers;

        public Chunk(Location location)
        {
            this.Location = location;
            this.Layers = new List<int[]>();
        }

        public void AddLayer(int[] layer)
        {
            this.Layers.Add(layer);
        }            
    }
}
