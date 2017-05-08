using Autofac;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
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
            var executingAssembly = Assembly.GetExecutingAssembly();
            builder.RegisterApiControllers(executingAssembly).InstancePerRequest();//注册api容器的实现
            builder.RegisterControllers(executingAssembly).InstancePerRequest();//注册mvc容器的实现

            builder.RegisterModelBinderProvider();
            builder.RegisterModule(new AutofacWebTypesModule());
            builder.RegisterSource(new ViewRegistrationSource());
            builder.RegisterFilterProvider();
            builder.RegisterModule<IocMoudle>();
            Container = builder.Build();

            DependencyResolver.SetResolver(new AutofacDependencyResolver(Container));
            GlobalConfiguration.Configuration.DependencyResolver = new AutofacWebApiDependencyResolver(Container);
        }
    }
}