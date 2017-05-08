using SYDB.Infrastructure.Entity;

namespace SYDB.IDAO
{
    public interface IGameBetDao:IBaseDao<GameBet>
    {
        BetStatus UserGameBet(GameBet bet);
    }
}
