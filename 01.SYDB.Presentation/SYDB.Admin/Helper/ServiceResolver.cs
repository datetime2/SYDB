using System;
using System.Web.Mvc;
namespace SYDB.Admin.Helper
{
    public class ServiceResolver : IServiceResolver
    {
        public T Resolve<T>()
        {
            return (T)DependencyResolver.Current.GetService(typeof(T));
        }

        public object Resolve(Type type)
        {
            var obj = DependencyResolver.Current.GetService(type);
            return obj;
        }
    }
}