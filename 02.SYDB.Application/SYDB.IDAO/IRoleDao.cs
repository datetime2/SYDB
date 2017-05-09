using SYDB.Infrastructure.Entity;
using SYDB.Infrastructure.Utility.ControlHelper;
using System.Collections.Generic;

namespace SYDB.IDAO
{
    public interface IRoleDao : IBaseDao<Role>
    {
        jqGridPager<Role> InitGrid(BaseQuery query);
        bool SubmitForm(Role role, int? keyValue,string menuIds);
        List<TreeView> RoleMenu(int? roleId);
    }
}
