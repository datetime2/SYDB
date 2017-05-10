using SYDB.Infrastructure.Entity;
using SYDB.Infrastructure.Utility.ControlHelper;

namespace SYDB.IDAO
{
    public interface IGameDao : IBaseDao<Game>
    {
        jqGridPager<Game> InitGrid(GameQuery query);
    }
}
