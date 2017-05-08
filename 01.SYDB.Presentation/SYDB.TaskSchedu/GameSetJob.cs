using Quartz;
using SYDB.DAO;
using SYDB.Infrastructure.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SYDB.TaskSchedu
{
    /// <summary>
    /// 游戏结算任务
    /// </summary>
    public class GameSetJob : DBContext<Game>, IJob
    {
        public void Execute(IJobExecutionContext context)
        {
            throw new NotImplementedException();
        }
    }
}
