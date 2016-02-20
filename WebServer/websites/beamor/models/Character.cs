using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HttpServer.websites.beamor.models
{
    public class Character
    {
        public string Name { get; set; }

        public bool Godmode { get; set; }
        public int Health { get; set;  }
        public int Strengh { get; set; }
        public int Defence { get; set;  }

        public int PosX { get; set; }
        public int PosY { get; set;  }

        public override string ToString()
        {
            return base.ToString();
        }
    }
}
