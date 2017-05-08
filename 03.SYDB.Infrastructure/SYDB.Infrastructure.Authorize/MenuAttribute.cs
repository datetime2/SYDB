using System;
namespace SYDB.Infrastructure.Authorize
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true, Inherited = false)]
    public class MenuAttribute : Attribute
    {
        public MenuAttribute(string code)
        {
            Code = code;
            SortOrder = 99;
            Depth = -1;
        }
        public MenuAttribute(string code, int sortOrder)
        {
            Code = code;
            SortOrder = sortOrder;
            Depth = -1;
        }

        public MenuAttribute(string code, int sortOrder, int depth)
        {
            Code = code;
            SortOrder = sortOrder;
            Depth = depth;
        }

        public string Code { get; private set; }

        public int SortOrder { get; private set; }

        public int Depth { get; private set; }
    }
}
