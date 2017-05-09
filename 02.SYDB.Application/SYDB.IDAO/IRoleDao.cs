using SYDB.Infrastructure.Entity;
using SYDB.Infrastructure.Utility.ControlHelper;

namespace SYDB.IDAO
{
    public interface IRoleDao : IBaseDao<Role>
    {
        jqGridPager<Role> InitGrid(BaseQuery query);
        bool SubmitForm(Role role, int? keyValue);
    }
}
