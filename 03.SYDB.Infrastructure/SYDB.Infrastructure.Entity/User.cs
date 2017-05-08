using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SYDB.Infrastructure.Entity
{
    public class User : BaseEntity
    {
        public long Id { get; set; }
        public string LoginName { get; set; }
        public string NickName { get; set; }
        public string PassWord { get; set; }
        public string PassSalt { get; set; }
        public string Avatar { get; set; }
        public decimal Amount { get; set; }
        public string AgentPath { get; set; }
        public DateTime? LastLoginTime { get; set; }
        public string LastLoginIp { get; set; }
    }
}
