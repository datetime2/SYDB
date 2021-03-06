﻿using MySql.Data.MySqlClient;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace SYDB.Infrastructure.ORM
{
    internal static class Extensions
    {
        public static MySqlParameter[] ToMySqlPars(this SqlParameter[] pars)
        {
            if (pars == null) {
                return null;
            }
            List<MySqlParameter> reval = new List<MySqlParameter>();
            foreach (var item in pars)
            {
                reval.Add(item.ToMySqlPars());
            }
            return reval.ToArray();
        }
        public static MySqlParameter ToMySqlPars(this SqlParameter par)
        {
            return new MySqlParameter() { ParameterName = par.ParameterName, Value = par.Value };
        }
    }
}
