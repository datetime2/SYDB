using Autofac;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using SYDB.DAO;
using SYDB.IDAO;
using SYDB.Infrastructure.IOC;
using System.Reflection;
using System.Web.Http;
using System.Web.Mvc;

namespace SYDB.API
{
    public class AutofacConfig
    {
        public static IContainer Container { get; private set; }
        public static void initConfig()
        {
            var builder = new ContainerBuilder();
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            //builder.RegisterType<GameDao>().As<IGameDao>();
            builder.RegisterModule<IocMoudle>();
            Container = builder.Build();
            var resolver = new AutofacWebApiDependencyResolver(Container);
            GlobalConfiguration.Configuration.DependencyResolver = resolver;
        }
    }
}