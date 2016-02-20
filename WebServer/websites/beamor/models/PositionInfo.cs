using WebServer.websites.beamor.models.map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites.beamor.models
{
    public class PositionInfo
    {
        public float PosX { get; set; }
        public float PosY { get; set; }

        public Map Map { get; set; }
        public Chunk Chunk { get; set; }
    }
}
