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

        public List<TreeView> RoleMenu(int? roleId)
        {
            var tree = new List<TreeView>();
            var systemMenu = DbFunction((db) =>
            {
                return db.Queryable<Menu>().Where(s => s.IsEnable).ToList();
            }) as List<Menu>;
            if (roleId.HasValue)
            {
                var userMenu = DbFunction((db) =>
                {
                    return db.Queryable<RoleMenu>().Where(s => s.RoleId == roleId).ToList();
                }) as List<RoleMenu>;
                tree = systemMenu.Where(s => s.ParentId == 0).Select(s => new TreeView
                {
                    id = s.Id.ToString(),
                    value = s.Id.ToString(),
                    text = s.Name,
                    checkstate = userMenu.Any(ss => ss.MenuId.Equals(s.Id)) ? 1 : 0,
                    hasChildren = true,
                    img = s.Icon,
                    ChildNodes = systemMenu.Where(p => p.ParentId == s.Id).Select(ss => new TreeView
                    {
                        id = ss.Id.ToString(),
                        text = ss.Name,
                        checkstate = userMenu.Any(sss => sss.MenuId.Equals(ss.Id)) ? 1 : 0,
                        hasChildren = true,
                        img = ss.Icon,
                        value = ss.Id.ToString(),
                        ChildNodes = systemMenu.Where(p => p.ParentId == ss.Id).Select(sss => new TreeView
                        {
                            id = sss.Id.ToString(),
                            text = sss.Name,
                            checkstate = userMenu.Any(ssss => ssss.MenuId.Equals(sss.Id)) ? 1 : 0,
                            hasChildren = false,
                            img = sss.Icon,
                            value = sss.Id.ToString()
                        }).ToList()
                    }).ToList()
                }).ToList();
            }
            else
            {
                tree = systemMenu.Where(s => s.ParentId == 0).Select(s => new TreeView
                {
                    id = s.Id.ToString(),
                    value = s.Id.ToString(),
                    text = s.Name,
                    checkstate = 0,
                    hasChildren = true,
                    img = s.Icon,
                    ChildNodes = systemMenu.Where(p => p.ParentId == s.Id).Select(nodes => new TreeView
                    {
                        id = nodes.Id.ToString(),
                        text = nodes.Name,
                        checkstate = 0,
                        hasChildren = true,
                        img = nodes.Icon,
                        value = nodes.Id.ToString(),
                        ChildNodes = systemMenu.Where(p => p.ParentId == nodes.Id).Select(sss => new TreeView
                        {
                            id = sss.Id.ToString(),
                            text = sss.Name,
                            checkstate = 0,
                            hasChildren = false,
                            img = sss.Icon,
                            value = sss.Id.ToString()
                        }).ToList()
                    }).ToList()
                }).ToList();
            }
            return tree;
        }

        public bool SubmitForm(Role role, int? keyValue, string menuIds)
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
