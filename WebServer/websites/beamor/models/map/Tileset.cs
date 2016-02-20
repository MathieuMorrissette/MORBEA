using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites.beamor.models.map
{
    public class Tileset
    {
        public string ImageName { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }

        public Tileset(string imageName, int width, int height)
        {
            this.ImageName = imageName;
            this.Width = width;
            this.Height = height;
        }
    }
}
