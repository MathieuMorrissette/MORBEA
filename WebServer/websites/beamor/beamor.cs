using WebServer.websites.beamor.controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using WebServer;
using WebServer.websites;

namespace WebServer.websites.beamor
{
    public class Beamor : BaseWebsite
    {
        const string DEFAULT_ROUTE = "game";
        const string CONNECTION_STRING = @"Server=127.0.0.1;Database=test;Uid=root;Pwd=root;";
        public const string WEBSITE_ROOT_PATH = "../../websites/beamor/public/";

        private IController controller;
        private static Dictionary<string, Func<IController>> routes = new Dictionary<string, Func<IController>>
        {
            { "game", () => new Game() },
            { "api", () => new API() },
            { "resources", () => new FileProvider() },
            { "javascript", () => new FileProvider() }
        };

        public Beamor(Client client, HttpListenerContext context):base(client, context)
        {

            string[] parsedArgs = WebHelper.GetUrlArguments(this.Context.Request.Url.Segments);

            string controller = string.Empty;

            if (parsedArgs.Length == 0)
            {
                controller = DEFAULT_ROUTE;
            }
            else if (parsedArgs[0] == string.Empty)
            {
                controller = DEFAULT_ROUTE;
            }
            else
            {
                controller = parsedArgs[0];
            }

            if (routes.ContainsKey(controller))
            {
                this.controller = routes[controller]();
            }
            else
            {
                this.Context.Error();
                return;
            }
        }

        public override void HandleRequest()
        {
            if (this.controller == null)
            {
                this.Context.Error();
                return;
            }

            string[] arguments = WebHelper.GetUrlArguments(this.Context.Request.Url.Segments);

            // Remove the first arguments since it is the controller name.
            arguments = arguments.Skip(1).ToArray();

            this.controller.HandleRequest(this.Client, this.Context, arguments);
                
        }
    }
}
