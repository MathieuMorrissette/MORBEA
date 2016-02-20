using WebServer.websites.mathieu_morrissette.managers;
using WebServer.websites.mathieu_morrissette.model;
using WebServer.websites.mathieu_morrissette.templates;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;

namespace WebServer.websites.mathieu_morrissette.controllers
{
    public class Login : IController
    {
        private HttpListenerContext context;

        public bool HandleRequest(Client client, HttpListenerContext context, params string[] args)
        {
            this.context = context;

            if (client.Connected())
            {
                context.Redirect("../home");
                return true;
            }   

            if (context.GetMethod() == HttpMethod.GET)
            {
                this.ShowLogin(client);
            }
            else if(context.GetMethod() == HttpMethod.POST)
            {
                Dictionary<string, string> requestData = context.GetData();

                if (requestData.ContainsKey("username") && requestData.ContainsKey("password"))
                {
                    string username = requestData["username"];
                    string password = requestData["password"];

                    if (UserManager.Login(username, password, client))
                    {
                        context.Redirect("../home");
                    }
                    else
                    {
                        this.ShowLogin(client, new Error("Invalid username or password"));
                    }
                }
                else
                {
                    this.ShowLogin(client, new Error("Error"));
                }
            }

            return true;
        }

        private void ShowLogin(Client client, Error error = null)
        {
            if (client == null)
            {
                return;
            }

            Login_Template login_template = new Login_Template();
            login_template.Errors = new Error[] { error };
            this.context.Send(login_template.Render());
        }
    }
}
