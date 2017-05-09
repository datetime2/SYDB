using SYDB.IDAO;
using SYDB.Infrastructure.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SYDB.Admin.Controllers
{
    public class RoleController : BaseAuthorizeController
    {
        private readonly IRoleDao RoleDao;
        public RoleController(IRoleDao roleDao)
        {
            RoleDao = roleDao;
        }
        #region 角色---Role
        [HttpGet]
        public JsonResult RoleGrid(BaseQuery query)
        {
            var grid = RoleDao.InitGrid(query);
            return Json(grid, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult InitForm(int keyValue)
        {
            var role = RoleDao.FirstOrDefault(s => s.Id == keyValue);
            return Json(role, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SubmitForm(Role role, int? keyValue)
        {
            return RoleDao.SubmitForm(role, keyValue) ? Success("操作成功") : Error("操作失败");
        }
        [HttpPost]
        public JsonResult Remove(int? keyValue)
        {
            return RoleDao.Delete(s => s.Id == keyValue) ? Success("操作成功") : Error("操作失败");
        }
        #endregion
    }
}