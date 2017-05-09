using SYDB.IDAO;
using SYDB.Infrastructure.Entity;
using SYDB.Infrastructure.ORM;
using System;
using System.Collections.Generic;
using System.Linq;
using SYDB.Infrastructure.Utility.ControlHelper;
using SYDB.Infrastructure.Utility.Helper;

namespace SYDB.DAO
{
    public class MenuDao : BaseDao<Menu>, IMenuDao
    {
        public List<Menu> GetUserPermission(int adminId)
        {
            return DbFunction((db) =>
            {
                return db.Queryable<Menu>()
                 .JoinTable<RoleMenu>((t1, t2) => t1.Id == t2.MenuId, JoinType.Inner)
                 .JoinTable<RoleMenu, Admin>((t1, t2, t3) => t2.RoleId == t3.RoleId, JoinType.Inner)
                 .Where<Menu, RoleMenu, Admin>((T1, T2, t3) => t3.Id == adminId)
                 .Select("T1.*")
                 .ToList();
            });
        }
        public ModuleSelectModel<TreeGrid> InitGrid(BaseQuery query)
        {
            var select = new ModuleSelectModel<TreeGrid>();
            var predicate = PredicateBuilderUtility.True<Menu>();
            if (!string.IsNullOrWhiteSpace(query.keyword))
                predicate = predicate.And(s => s.Name.Contains(query.keyword));
            return DbFunction((db) =>
            {
                var grid = db.Queryable<Menu>().Where(predicate).OrderBy(s => s.SortOrder).ToList();
                var tree = new List<TreeGrid>();
                InitTree(0, grid, tree);
                select.rows = tree;
                return select;
            }, select);
        }
        public List<TreeSellect> InitTree(BaseQuery query)
        {
            var tree = new List<TreeSellect>();
            var predicate = PredicateBuilderUtility.True<Menu>();
            if (!string.IsNullOrWhiteSpace(query.keyword))
                predicate = predicate.And(s => s.Name.Contains(query.keyword));
            return DbFunction((db) =>
            {
                var grid = db.Queryable<Menu>().Where(predicate).OrderBy(s => s.SortOrder).ToList();
                foreach (var item in grid.Where(s => s.ParentId == 0))
                {
                    tree.Add(new TreeSellect
                    {
                        id = item.Id,
                        parentId = item.ParentId,
                        text = item.Name
                    });
                    tree.AddRange(grid.Where(s => s.ParentId == item.Id).Select(items => new TreeSellect
                    {
                        id = items.Id,
                        parentId = items.ParentId,
                        text = items.Name
                    }));
                }
                return tree;
            });
        }

        public bool SubmitForm(Menu menu, int? keyValue)
        {
            return DbFunction((db) =>
            {
                if (keyValue.HasValue)
                {
                    db.DisableUpdateColumns = new string[] { "CreateTime" };
                    menu.Id = keyValue.Value;
                    menu.ModifyTime = DateTime.Now;
                    return db.Update(menu);
                }
                else
                {
                    menu.CreateTime = DateTime.Now;
                    return db.Insert(menu) != null;
                }
            });
        }

        private void InitTree(int parentId, IEnumerable<Menu> data, ICollection<TreeGrid> tree)
        {
            var menuInfos = data as IList<Menu> ?? data.ToList();
            var root = menuInfos.Where(s => s.ParentId == parentId);
            foreach (var item in root)
            {
                tree.Add(new TreeGrid
                {
                    level = item.ParentId == 0 ? 0 : 1,
                    isLeaf = !data.Any(s => s.ParentId == item.Id),
                    parent = item.ParentId + "",
                    Id = item.Id,
                    ParentId = item.ParentId,
                    Url = item.Url,
                    Icon = item.Icon,
                    Name = item.Name,
                    IsEnable = item.IsEnable,
                    DocumentId = item.DocumentId,
                    MenuType = item.MenuType.ToDescription(),
                    SortOrder = item.SortOrder,
                    DocumentEvent = item.DocumentEvent
                });
                InitTree(item.Id, menuInfos, tree);
            }
        }
    }
}
