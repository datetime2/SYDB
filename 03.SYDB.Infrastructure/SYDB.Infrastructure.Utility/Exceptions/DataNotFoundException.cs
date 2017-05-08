﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SYDB.Infrastructure.Utility.Exceptions
{
    /// <summary>
    /// 数据不存在
    /// </summary>
    public class DataNotFoundException : DefinedException
    {
        public DataNotFoundException(string message)
            : base(message)
        {
            
        }
    }
}
