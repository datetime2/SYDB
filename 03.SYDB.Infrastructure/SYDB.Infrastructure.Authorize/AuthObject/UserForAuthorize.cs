using System.Collections.Generic;

namespace SYDB.Infrastructure.Authorize.AuthObject
{
    public class UserForAuthorize
    {
        public int UserId { get; set; }
        public string LoginName { get; set; }
        //权限菜单
        public List<MenuForAuthorize> Menus { get; set; }
        public List<ButtonForAuthorize> Buttons { get; set; }
    }
}
