using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SYDB.Infrastructure.Entity
{
    public class BaseEntity
    {
        public bool IsEnable { get; set; }
        public DateTime CreateTime { get; set; }
        public DateTime? ModifyTime { get; set; }
    }
}
