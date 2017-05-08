using SYDB.Infrastructure.Entity;
using SYDB.Infrastructure.Utility.ControlHelper;
using System.Collections.Generic;

namespace SYDB.IDAO
{
    public interface IMenuDao : IBaseDao<Menu>
    {
        List<Menu> GetUserMenus(int adminId);
        ModuleSelectModel<TreeGrid> InitGrid(BaseQuery query);
        List<TreeSellect> InitTree(BaseQuery query);
        bool SubmitForm(Menu menu, int? keyValue);
    }
}
