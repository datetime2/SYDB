using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SYDB.Infrastructure.Utility.Exceptions
{
    /// <summary>
    /// 数据已存在
    /// </summary>
    public class DataExistsException : DefinedException
    {
        public DataExistsException(string message)
            : base(message)
        {
            
        }
    }
}
