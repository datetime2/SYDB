using System;

namespace SYDB.Infrastructure.Authorize
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = true, Inherited = false)]
    public class PermissionAttribute : Attribute
    {
        public PermissionAttribute(string code)
        {
            Code = code;
        }
        public string Code { get; private set; }
    }
}
