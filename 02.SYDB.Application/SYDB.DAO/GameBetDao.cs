using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SYDB.Infrastructure.Entity;
using SYDB.IDAO;
using SYDB.Infrastructure.Utility.Helper;
using SYDB.Infrastructure.ORM;

namespace SYDB.DAO
{
    public class GameBetDao : BaseDao<GameBet>, IGameBetDao
    {
        public BetStatus UserGameBet(GameBet bet)
        {
            using (var db = GetInstance())
            {
                try
                {
                    var betUser = db.Queryable<User>().Single(s => s.Id.Equals(bet.UserId));
                    if (betUser == null || !betUser.IsEnable) return BetStatus.UserUndefine;
                    if (betUser.Amount < bet.BetAmount) return BetStatus.AmountNotEnough;
                    db.BeginTran();//开启事务
                    var userBet = db.Insert(bet);
                    if (userBet != null)
                    {
                        //修改余额
                        db.Update<User>(new { Amount = betUser.Amount - bet.BetAmount }, s => s.Id.Equals(betUser.Id));

                    }
                    db.CommitTran();//提交事务
                    return BetStatus.Success;
                }
                catch (Exception ex)
                {
                    Log.Error("投注失败", ex);
                    db.RollbackTran();//回滚事务
                    return BetStatus.Failure;
                }
            }
        }
    }
}
