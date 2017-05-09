using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SYDB.Infrastructure.Entity
{
  public class AdminRole
    {
        public int Id { get; set; }
        public string LoginName { get; set; }
        public string PassWord { get; set; }
        public string PassSalt { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public DateTime? LastLoginTime { get; set; }
        public string LastLoginIp { get; set; }
        public string LastLoginToken { get; set; }
        public bool IsEnable { get; set; }
        public DateTime CreateTime { get; set; }
        public DateTime? ModifyTime { get; set; }
        public string Remark { get; set; }
    }
}
