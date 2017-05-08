using SYDB.Infrastructure.Entity;
using System.Collections.Generic;

namespace SYDB.Infrastructure.Authorize.AuthObject
{
    public class MenuForAuthorize
    {
        public int MenuId { get; set; }
        public int ParentId { get; set; }
        public string MenuName { get; set; }
        public string MenuUrl { get; set; }
        public string MenuIcon { get; set; }
        public MenuType MenuType { get; set; }
        public int SortOrder { get; set; }
        public List<MenuForAuthorize> Childs { get; set; }
    }
}
