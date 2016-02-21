using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites.beamor.models
{
    public class Player : Character
    {
        public PlayerType Type { get; set; } = PlayerType.Warrior;

        public Player(string name) : base(name)
        {
        }

        public Player(string name, int health, int strengh, int defence) 
            : base(name,health,strengh,defence)
        {
        }
    }
}
