using WebServer.websites.mathieu_morrissette.managers;
using WebServer.websites.mathieu_morrissette.templates;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites.mathieu_morrissette.controllers
{
    class Home : IController
    {
        public bool HandleRequest(Client client, HttpListenerContext context, params string[] args)
        {
            if (!UserManager.Connected(client))
            {
                context.Redirect("../login");
                return true;
            }

            User user = UserManager.GetUser(UserManager.GetUserID(client));

            Home_Template template = new Home_Template(user);
            context.Send(template.Render());

            return true;
        }
    }
}
