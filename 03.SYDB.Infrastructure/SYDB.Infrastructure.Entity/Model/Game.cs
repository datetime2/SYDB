using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SYDB.Infrastructure.Entity
{
    public class Game : BaseEntity
    {
        public long Id { get; set; }
        public string Result { get; set; }
        public bool IsLottery { get; set; }
        public DateTime? LotteryTime { get; set; }
        public int BetCount { get; set; }
        public decimal BetAmount { get; set; }
    }
}
