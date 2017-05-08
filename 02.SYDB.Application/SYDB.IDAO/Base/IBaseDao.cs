using System;
using System.Linq.Expressions;
using System.Collections.Generic;
using SYDB.Infrastructure.Entity;

namespace SYDB.IDAO
{
    public interface IBaseDao<T> where T : class, new()
    {
        bool Insert(T model);
        bool Update(object filed, Expression<Func<T, bool>> predi);
        bool Update(T model);
        bool Delete(T model);
        bool Delete(Expression<Func<T, bool>> predi);
        T FirstOrDefault(Expression<Func<T, bool>> predi);
        List<T> Paging(Expression<Func<T, bool>> predi, BaseQuery query);
    }
}
