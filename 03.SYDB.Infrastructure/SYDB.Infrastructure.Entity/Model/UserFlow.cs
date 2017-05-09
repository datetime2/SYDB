using System;

namespace SYDB.Infrastructure.Entity
{
    public class UserFlow
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public FlowType FlowType { get; set; }
        public decimal Amount { get; set; }
        public string Remark { get; set; }
        public DateTime CreateTime { get; set; }
    }
}
