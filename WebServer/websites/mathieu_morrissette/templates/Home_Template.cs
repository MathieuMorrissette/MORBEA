using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites.mathieu_morrissette.templates
{
    class Home_Template : ITemplate
    {
        private User user;

        public Home_Template(User user)
        {
            this.user = user;
        }

        public string Render()
        {
            string content = File.ReadAllText(WebSite.WEBSITE_ROOT_PATH + "html/home.html");
            content = content.Replace("__Username__", this.user.Username);
            content = content.Replace("__ID__", this.user.ID.ToString());
            content = content.Replace("__PasswordHash__", this.user.Hash);

            return content;
        }
    }
}
