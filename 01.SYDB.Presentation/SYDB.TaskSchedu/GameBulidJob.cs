using Quartz;
using SYDB.DAO;
using SYDB.Infrastructure.Entity;
using SYDB.Infrastructure.Utility.Helper;
using System;
using System.Collections.Generic;

namespace SYDB.TaskSchedu
{
    /// <summary>
    /// 游戏基础数据生成任务
    /// </summary>
    public class GameBulidJob : DBContext<Game>, IJob
    {
        public void Execute(IJobExecutionContext context)
        {
            BulidGame();
        }
        public void BulidGame()
        {
            Log.Info("开始生成十元夺宝游戏基础数据");
            var _prefix = DateTime.Today.AddDays(1).ToString("yyyyMMdd");
            List<Game> game = new List<Game>();
            DateTime _now = DateTime.Now;
            for (int hour = 0; hour < 24; hour++)
            {
                for (int minu = 0; minu < 60; minu++)
                {
                    game.Add(new Game
                    {
                        Id = string.Format("{0}{1}{2}", _prefix, hour.ToString().PadLeft(2, '0'), minu.ToString().PadLeft(2, '0')).ToInt64(),
                        CreateTime = _now
                    });
                }
            }
            DbAction((db) =>
            {
                db.InsertRange(game, false);
            });
            Log.Info("结束生成十元夺宝游戏基础数据");
        }
    }
}
