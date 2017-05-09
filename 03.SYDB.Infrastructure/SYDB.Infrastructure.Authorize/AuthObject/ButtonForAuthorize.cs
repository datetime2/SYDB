using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SYDB.Infrastructure.Authorize.AuthObject
{
    public class ButtonForAuthorize
    {
        public int MenuId { get; set; }
        public string ButtonId { get; set; }
        public string ButtonName { get; set; }
        public int SortOrder { get; set; }
        public string ButtonEvent { get; set; }
        public string ButtonClass { get; set; }
        public string ButtonIcon { get; set; }
    }
}
