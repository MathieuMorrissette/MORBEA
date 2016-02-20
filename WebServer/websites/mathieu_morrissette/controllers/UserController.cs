using WebServer.websites.mathieu_morrissette.managers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace WebServer.websites.mathieu_morrissette.controllers
{
    class UserController : IController
    {
        Dictionary<string, Action> methods = new Dictionary<string, Action>();
        private string[] args;
        private Client client;
        private HttpListenerContext context;

        public UserController()
        {
            methods.Add("logout", new Action(Logout));
        }

        public bool HandleRequest(Client client, HttpListenerContext context, params string[] args)
        {
            this.client = client;
            this.context = context;

            if (args.Length <= 0)
            {
                return false;
            }

            this.args = args;

            if (methods.ContainsKey(args[0]))
            {
                methods[args[0]].Invoke();
            }

            return false;
        }
        
        public void Logout()
        {
            if (UserManager.Logout(this.client))
            {
                this.context.Redirect("../login");
            }
        }
    }
}
