using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites.beamor.models
{
    public class Character
    {
        public string Name { get; set; }

        public bool Godmode { get; set; }
        public int Health { get; set;  }
        public int Strengh { get; set; }
        public int Defence { get; set;  }

        public PositionInfo PositionInfo = new PositionInfo();

        public Character(string name)
        {
            this.Name = name;
        }

        public override string ToString()
        {
            return this.Name;
        }
    }
}
