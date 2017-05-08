using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SYDB.Infrastructure.Authorize.AuthObject
{
    public class UserForAuthorize
    {
        public int UserId { get; set; }
        public string LoginName { get; set; }
        //权限菜单
        public List<MenuForAuthorize> Menus { get; set; }
    }
}
