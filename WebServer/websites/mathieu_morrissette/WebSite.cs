using WebServer.managers;
using WebServer.websites.mathieu_morrissette.controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites.mathieu_morrissette
{
    public class WebSite : BaseWebsite
    {
        const string DEFAULT_ROUTE = "login";
        const string CONNECTION_STRING = @"Server=127.0.0.1;Database=test;Uid=root;Pwd=root;";
        public const string WEBSITE_ROOT_PATH = "../../websites/mathieu_morrissette/public/";

        public static DatabaseManager Database { get; private set; }

        private static Dictionary<string, Func<IController>> routes = new Dictionary<string, Func<IController>>
        {
            { "login", () => new Login()},
            { "register", () => new Register()},
            { "home", () =>  new Home()},
            { "images", () => new FileProvider()},
            { "javascript", () => new FileProvider()},
            { "css", () => new FileProvider()},
            { "font", () => new FileProvider()},
            { "user", () => new UserController()}
        };

        IController controller;

        public WebSite(Client client, HttpListenerContext context) : base(client, context)
        {
            WebSite.Database = new DatabaseManager(CONNECTION_STRING, new DatabaseMySql());

            //Create tables if they don't exists
            WebSite.Database.CreateDatabase();

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
                Error();
                return;
            }
        }

        private void Error()
        {
            this.Context.Response.StatusCode = 404;
            this.Context.Response.OutputStream.Close();
        }

        public override void HandleRequest()
        {
            if (controller == null)
            {
                this.Context.Response.OutputStream.Close();
                return;
            }

            string[] arguments = WebHelper.GetUrlArguments(this.Context.Request.Url.Segments);

            // Remove the first arguments since it is the controller name.
            arguments = arguments.Skip(1).ToArray();

            controller.HandleRequest(this.Client, this.Context, arguments);
        }
    }
}
