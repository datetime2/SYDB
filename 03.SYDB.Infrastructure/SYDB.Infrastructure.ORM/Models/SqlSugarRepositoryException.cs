using System;
namespace SYDB.Infrastructure.ORM
{
    /// <summary>
    /// ** 描述：SqlSugar自定义异常
    /// ** 创始时间：2015-7-13
    /// ** 修改时间：-
    /// ** 作者：www.phsoft.com
    /// ** 使用说明：
    /// </summary>
    public class SqlSugarRepositoryException : Exception
    {
        /// <summary>
        /// SqlSugar异常
        /// </summary>
        /// <param name="message">错误信息</param>
        public SqlSugarRepositoryException(string message)
            : base(message)
        {

        }
        /// <summary>
        /// SqlSugar异常
        /// </summary>
        /// <param name="message">错误信息</param>
        /// <param name="sql">ORM生成的SQL</param>
        public SqlSugarRepositoryException(string message, string sql)
            : base(GetMessage(message, sql))
        {

        }
        private static string GetMessage(string message, string sql)
        {
            var reval = GetLineMessage("错误信息         ", message) + GetLineMessage("ORM生成的Sql", sql);
            return reval;
        }

        private static string GetLineMessage(string key, string value)
        {
            return string.Format("{0} ： 【{1}】\r\n", key, value);
        }
    }
}
