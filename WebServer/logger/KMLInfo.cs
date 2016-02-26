using System;

namespace logger
{
    public class KMLInfo
    {
        public enum MType { Error, Iterator, Info };

        private string user;
        MType type;
        private DateTime time;
        
        //Constructor
        public KMLInfo(string _user, DateTime _time, MType _type)
        {
            user = _user;
            time = _time;
            type = _type;

        }

        //get
        public string getUser()
        {
            return user;
        }

        //get
        public string getType()
        {
            return type.ToString();
        }

        //get
        public string getTimeString()
        {
            return time.ToString();
        }

        //get
        public DateTime getTime()
        {
            return time;
        }

        //get
        public string getInfoString()
        {
            return getTimeString() + " -- " + user + " -- " + type.ToString();
        }
    }
}
