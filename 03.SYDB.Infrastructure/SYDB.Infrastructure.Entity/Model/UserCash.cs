namespace SYDB.Infrastructure.Entity
{
    public class UserCash : BaseEntity
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public decimal Amount { get; set; }
        public CashType CashType { get; set; }
        public string Remark { get; set; }
        public int State { get; set; }
        public long ModifyUser { get; set; }
    }
}
