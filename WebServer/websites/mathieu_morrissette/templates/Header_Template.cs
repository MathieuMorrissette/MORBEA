﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites.mathieu_morrissette.templates
{
    public class Header_Template : ITemplate
    {
        public string Render()
        {
            string data = File.ReadAllText(WebSite.WEBSITE_ROOT_PATH + "html/header.html");
            return data;
        }
    }
}
