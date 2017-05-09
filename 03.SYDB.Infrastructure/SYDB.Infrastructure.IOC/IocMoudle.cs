using Autofac;
using SYDB.DAO;
using SYDB.IDAO;
using SYDB.Infrastructure.Authorize;

namespace SYDB.Infrastructure.IOC
{
    public class IocMoudle : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<AuthorizeManager>().As<IAuthorizeManager>().InstancePerRequest();
            builder.RegisterType<AdminDao>().As<IAdminDao>();
            builder.RegisterType<MenuDao>().As<IMenuDao>();
            builder.RegisterType<RoleDao>().As<IRoleDao>();
        }
    }
}
