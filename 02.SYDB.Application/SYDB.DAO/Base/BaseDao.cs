using SYDB.IDAO;
using SYDB.Infrastructure.ORM;
using System;
using System.Linq.Expressions;
using SYDB.Infrastructure.Entity;
using System.Collections.Generic;

namespace SYDB.DAO
{
    public abstract class BaseDao<T> : DBContext<T>, IBaseDao<T> where T : class, new()
    {
        public int total = 0;
        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="predi">表达式</param>
        /// <returns></returns>
        public bool Delete(Expression<Func<T, bool>> predi)
        {
            return DbFunction((db) =>
            {
                return db.Delete(predi);
            });
        }
        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="model">模型</param>
        /// <returns></returns>
        public bool Delete(T model)
        {
            return DbFunction((db) =>
            {
                return db.Delete(model);
            });
        }
        /// <summary>
        /// 查询单条
        /// </summary>
        /// <param name="predi"></param>
        /// <returns></returns>
        public T FirstOrDefault(Expression<Func<T, bool>> predi)
        {
            return DbFunction((db) =>
            {
                return db.Queryable<T>().Single(predi);
            });
        }

        /// <summary>
        /// 新增
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public bool Insert(T model)
        {
            return DbFunction((db) =>
            {
                return db.Insert(model) != null;
            });
        }
        /// <summary>
        /// 分页
        /// </summary>
        /// <param name="predi"></param>
        /// <param name="query"></param>
        /// <returns></returns>
        public List<T> Paging(Expression<Func<T, bool>> predi, BaseQuery query)
        {
            return DbFunction((db) =>
            {
                return db.Queryable<T>().Where(predi).Skip(query.page).Take(query.rows).ToList();
            });
        }
        /// <summary>
        /// model 必须包含主键
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public bool Update(T model)
        {
            return DbFunction((db) =>
            {
                return db.Update(model);
            });
        }
        /// <summary>
        /// 更新
        /// </summary>
        /// <param name="filed">eg:new { name = "wqnmb" }</param>
        /// <param name="predi"></param>
        /// <returns></returns>
        public bool Update(object filed, Expression<Func<T, bool>> predi)
        {
            return DbFunction((db) =>
            {
                return db.Update(filed, predi);
            });
        }
    }
}
