using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace WebServer
{
    public static class PasswordManager
    {
        private const int SALT_SIZE = 16;
        private const int HASH_SIZE = 20;

        public static string Hash(string password, int iteration)
        {
            byte[] salt = new byte[SALT_SIZE];
            new RNGCryptoServiceProvider().GetBytes(salt);

            Rfc2898DeriveBytes deriveBytes = new Rfc2898DeriveBytes(password, salt, iteration);
            byte[] hash = deriveBytes.GetBytes(HASH_SIZE);

            byte[] hashBytes = new byte[SALT_SIZE + HASH_SIZE];

            Array.Copy(salt, 0, hashBytes,0, SALT_SIZE);
            Array.Copy(hash, 0, hashBytes, SALT_SIZE, HASH_SIZE);

            return Convert.ToBase64String(hashBytes);
        }

        public static string Hash(string password)
        {
            return PasswordManager.Hash(password, 10000);
        }

        public static bool Verify(string password, string hashedPassword)
        {
            return PasswordManager.Verify(password, hashedPassword, 10000);
        }

        public static bool Verify(string password, string hashedPassword, int iterations)
        {
            string base64Hash = hashedPassword;
            byte[] hashBytes = Convert.FromBase64String(base64Hash);

            byte[] salt = new byte[SALT_SIZE];
            Array.Copy(hashBytes, 0, salt, 0, SALT_SIZE);

            var pbkdf2 = new Rfc2898DeriveBytes(password, salt, iterations);
            byte[] hash = pbkdf2.GetBytes(HASH_SIZE);
            
            for (var i = 0; i < HASH_SIZE; i++)
            {
                if (hashBytes[i + SALT_SIZE] != hash[i])
                {
                    return false;
                }
            }

            return true;
        }
    }
}
