using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebServer.websites.beamor.models;

namespace HttpServer.websites.beamor.models
{
    class Monster : Character
    {
        //constructor
        public Monster(string name) : base(name)
        {
        }

        //constructor
        public Monster(string name, bool godMode)
            : base(name, godMode)
        {
        }

        //constructor
        public Monster(string name, int health, int strengh, int defence) 
            : base(name,health,strengh,defence)
        {
        }
    }
}
