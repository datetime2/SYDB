using SYDB.IDAO;
using SYDB.Infrastructure.Entity;
using SYDB.Infrastructure.ORM;
using SYDB.Infrastructure.Utility.ControlHelper;
using SYDB.Infrastructure.Utility.Helper;
namespace SYDB.DAO
{
    public class GameDao : BaseDao<Game>, IGameDao
    {
        public jqGridPager<Game> InitGrid(GameQuery query)
        {
            var grid = new jqGridPager<Game>()
            {
                page = query.page,
                size = query.rows
            };
            var where = PredicateBuilderUtility.True<Game>();
            if (!string.IsNullOrEmpty(query.keyword))
                where = where.And(s => s.Id.Equals(query.keyword));
            total = DbFunction((db) =>
            {
                return db.Queryable<Game>().Where(where).Count();
            });
            grid.records = total;
            if (total > 0)
            {
                grid.rows = DbFunction((db) =>
                {
                    return db.Queryable<Game>().Where(where).OrderBy(s => s.Id).ToPageList(query.page, query.rows);
                });
            }
            return grid;
        }
    }
}
