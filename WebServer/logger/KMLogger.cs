using System;
using System.Diagnostics;

namespace logger
{
    public static class KMLogger
    {
        private static string user = Environment.UserName;
        private const string FILENAME = "Log.txt";

        /// <summary>
        /// Log information in the debug window
        /// </summary>
        /// <param name="_message"> The message to be written</param>
        /// <param name="type"> The type of message</param>
        public static void Log(Object _message, KMLInfo.MType _type)
        {
            KMLInfo Info = new KMLInfo(user, DateTime.Now, _type);

            Debug.WriteLine(Info.getInfoString() + " -- " + _message.ToString());
        }

        /// <summary>
        /// Log information in a log file
        /// </summary>
        /// <param name="_message"> Te message to be written</param>
        /// <param name="_type"> the type of message</param>
        public static void logFile(Object _message, KMLInfo.MType _type)
        {
            KMLInfo Info = new KMLInfo(user, DateTime.Now, _type);

            using (System.IO.StreamWriter file = new System.IO.StreamWriter(FILENAME, true))
            {
                file.WriteLine(Info.getInfoString() + " -- " + _message.ToString());
            }
        }

        
    }
}
