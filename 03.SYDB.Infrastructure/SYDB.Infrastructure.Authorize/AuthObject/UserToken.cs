using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SYDB.Infrastructure.Authorize.AuthObject
{
    public class UserToken
    {
        public int UserId { get; set; }

        public string LastLoginToken { get; set; }

        public string GetAuthToken()
        {
            return string.Format("{0}_{1}", this.UserId, this.LastLoginToken);
        }
    }
}
