using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace WebServer
{
    public static class WebHelper
    {
        public static string[] GetUrlArguments(string[] arguments)
        {
            return arguments.Select(arg => arg.Replace("/", "")).Where(arg => !string.IsNullOrEmpty(arg)).ToArray();
        }

        public static HttpMethod GetMethod(this HttpListenerContext context)
        {
            return WebHelper.GetHttpMethod(context);
        }

        public static HttpMethod GetHttpMethod(HttpListenerContext httpListenerContext)
        {
            if (httpListenerContext.Request.HttpMethod == "POST")
                return HttpMethod.POST;

            if (httpListenerContext.Request.HttpMethod == "GET")
                return HttpMethod.GET;

            return HttpMethod.NONE;
        }

        public static void Redirect(this HttpListenerContext context, string url)
        {
            context.Response.Redirect(url);
        }

        public static void Send(this HttpListenerContext context, string data)
        {
            StreamWriter streamwriter = new StreamWriter(context.Response.OutputStream);
            streamwriter.Write(data);
            streamwriter.Flush();
        }

        public static Dictionary<string, string> GetData(this HttpListenerContext context)
        {
            StreamReader streamReader = new StreamReader(context.Request.InputStream);
            string data = streamReader.ReadToEnd();

            Dictionary<string, string> dataDictionary = new Dictionary<string, string>();

            string[] KeyValues = data.Split('&');

            foreach (string keyValue in KeyValues)
            {
                string[] arrayKeyValue = keyValue.Split('=');
                dataDictionary.Add(arrayKeyValue[0], arrayKeyValue[1]);
            }

            return dataDictionary;
        }

        public static void Error(this HttpListenerContext context)
        {
            context.Response.StatusCode = 404;
            context.Response.OutputStream.Close();
        }
    }
}
