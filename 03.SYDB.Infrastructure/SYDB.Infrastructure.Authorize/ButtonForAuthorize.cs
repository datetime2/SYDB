using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SYDB.Infrastructure.Authorize
{
    public class ButtonForAuthorize
    {
        public Guid MenuId { get; set; }
        public string ButtonName { get; set; }
        public string ButtonEvent { get; set; }
        public string Icon { get; set; }
        public int SortOrder { get; set; }
    }
}
