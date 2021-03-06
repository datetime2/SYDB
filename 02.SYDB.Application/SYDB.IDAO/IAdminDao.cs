﻿using SYDB.Infrastructure.Entity;
using SYDB.Infrastructure.Utility.ControlHelper;
using System.Collections.Generic;

namespace SYDB.IDAO
{
    public interface IAdminDao:IBaseDao<Admin>
    {
        Admin Login(string loginName, string password, bool updateLoginToken);
        void ChangePassword(int id, string password);
        bool ValidateLoginToken(int id, string token);
        Admin FindByLoginToken(int id, string token);
        jqGridPager<AdminRole> InitGrid(BaseQuery query);
        bool SubmitForm(Admin admin, int? keyValue);
    }
}
