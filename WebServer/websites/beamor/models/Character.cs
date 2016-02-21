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

        //constructor
        public Character(string name)
        {
            this.Name = name;
        }

        //constructor
        public Character(string name, bool godmode)
        {
            Name = name;
            Godmode = godmode;
        }

        //construtor
        public Character(string name, int health, int strength, int defence)
        {
            Name = name;
            Health = health;
            Strengh = strength;
            Defence = defence;
        }

        public override string ToString()
        {
            return this.Name;
        }
    }
}
