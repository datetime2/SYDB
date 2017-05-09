using SYDB.IDAO;
using SYDB.Infrastructure.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SYDB.Infrastructure.Utility.ControlHelper;
using SYDB.Infrastructure.ORM;
using SYDB.Infrastructure.Utility.Helper;

namespace SYDB.DAO
{
    public class RoleDao : BaseDao<Role>, IRoleDao
    {
        public jqGridPager<Role> InitGrid(BaseQuery query)
        {
            var grid = new jqGridPager<Role>()
            {
                page = query.page,
                size = query.rows
            };
            var where = PredicateBuilderUtility.True<Role>();
            if (!string.IsNullOrEmpty(query.keyword))
                where = where.And(s => s.Name.Contains(query.keyword));
            total = DbFunction((db) =>
            {
                return db.Queryable<Role>().Where(where).Count();
            });
            grid.records = total;
            if (total > 0)
            {
                grid.rows = DbFunction((db) =>
                {
                    return db.Queryable<Role>().Where(where).OrderBy(s => s.Id).ToPageList(query.page, query.rows);
                });
            }
            return grid;
        }

        public bool SubmitForm(Role role, int? keyValue)
        {
            return DbFunction((db) =>
            {
                if (keyValue.HasValue)
                {
                    role.Id = keyValue.Value;
                    role.ModifyTime = DateTime.Now;
                    return db.Update(role);
                }
                else
                {
                    role.CreateTime = DateTime.Now;
                    return db.Insert(role) != null;
                }
            });
        }
    }
}
