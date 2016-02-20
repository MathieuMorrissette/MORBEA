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
        public List<int[]> Layers;

        public Chunk()
        {
            this.Layers = new List<int[]>();
        }

        public void AddLayer(int[] layer)
        {
            this.Layers.Add(layer);
        }            
    }
}
