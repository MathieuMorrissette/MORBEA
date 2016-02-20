using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebServer
{
    public interface IDatabase
    {
        IDbConnection CreateConnection(string connectionString);
        IDbDataParameter CreateParameter(string parameterName, object value);
        IDbCommand CreateCommand(string query);
    }
}
