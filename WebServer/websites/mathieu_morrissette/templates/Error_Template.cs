using WebServer.websites.mathieu_morrissette.model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites.mathieu_morrissette.templates
{
    public class Error_Template : ITemplate
    {
        Error error;

        public Error_Template(Error error)
        {
            this.error = error;
        }

        public string Render()
        {
            if (error == null)
            {
                return string.Empty;
            }

            string data = File.ReadAllText(WebSite.WEBSITE_ROOT_PATH + "html/error_alert.html");
            data = data.Replace("__ErrorMessage__", error.Message);
            return data;
        }
    }
}
