using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SYDB.Infrastructure.Entity
{
    public class GameBet
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public long GameId { get; set; }
        public int BetNum { get; set; }
        public decimal BetAmount { get; set; }
        public decimal WinAmount { get; set; }
        public int Wells { get; set; }
        public decimal FeeAmount { get; set; }
        public bool IsSet { get; set; }
        public DateTime? SetTime { get; set; }
    }
}
