using SYDB.Infrastructure.ORM;
using System;
using SYDB.Infrastructure.Utility.Helper;
using System.Collections.Generic;

namespace SYDB.DAO
{
    public class DBContext<T> where T : class, new()
    {
        public static string SqlConnString = "server=.;uid=sa;pwd=123;database=SYDB";
        public static string MySqlConnString = "server=localhost;Database=SqlSugarTest;Uid=root;Pwd=root";
        /// <summary>
        /// 有返回值
        /// </summary>
        /// <param name="function"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        public static bool DbFunction(Func<ISqlSugarClient, bool> function)
        {
            try
            {
                using (var db = GetInstance())
                {
                    return function(db);
                }
            }
            catch (Exception ex)
            {
                Log.Error("DBContext.DbFunction", ex);
                return false;
            }
        }
        public static int DbFunction(Func<ISqlSugarClient, int> function)
        {
            try
            {
                using (var db = GetInstance())
                {
                    return function(db);
                }
            }
            catch (Exception ex)
            {
                Log.Error("DBContext.DbFunction", ex);
                return 0;
            }
        }
        public static T DbFunction(Func<ISqlSugarClient, T> function)
        {
            try
            {
                using (var db = GetInstance())
                {
                    return function(db);
                }
            }
            catch (Exception ex)
            {
                Log.Error("DBContext.DbFunction", ex);
                return default(T);
            }
        }
        public static List<T> DbFunction(Func<ISqlSugarClient, List<T>> function)
        {
            try
            {
                using (var db = GetInstance())
                {
                    return function(db);
                }
            }
            catch (Exception ex)
            {
                Log.Error("DBContext.DbFunction", ex);
                return default(List<T>);
            }
        }
        protected dynamic DbFunction(Func<ISqlSugarClient, dynamic> func, dynamic def = null)
        {
            try
            {
                using (var context = GetInstance())
                {
                    var result = func(context);
                    return result;
                }
            }
            catch (Exception ex)
            {
                Log.Error("DBContext.DbFunction", ex);
                return def ?? default(dynamic);
            }
        }
        /// <summary>
        /// 无返回值
        /// </summary>
        /// <param name="action"></param>
        /// <param name="type"></param>
        public static void DbAction(Action<ISqlSugarClient> action)
        {
            using (var db = GetInstance())
            {
                action(db);
            }
        }
        public static ISqlSugarClient GetInstance(DbType type = DbType.SqlServer)
        {
            ISqlSugarClient db = null;
            switch (type)
            {
                case DbType.SqlServer:
                    db = DbRepository.GetInstance(type, SqlConnString);
                    break;
                case DbType.MySql:
                    db = DbRepository.GetInstance(type, MySqlConnString);
                    break;
                default:
                    db = DbRepository.GetInstance(type, SqlConnString);
                    break;
            }
//#if Debug
            db.IsEnableLogEvent = true;
//#endif
            db.LogEventStarting = (sql, pars) =>
            {
                PrintSql(sql, pars);
            };
            return db;
        }

        /// <summary>
        /// 打印Sql
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="pars"></param>
        private static void PrintSql(string sql, string pars)
        {
            Log.Debug("sql:" + sql);
            if (pars != null)
            {
                Log.Debug(" pars:" + pars);
            }
            Log.Debug("");
        }
    }
}
