using SYDB.IDAO;
using SYDB.Infrastructure.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SYDB.Admin.Controllers
{
    public class AdminController : BaseAuthorizeController
    {
        private readonly IAdminDao AdminDao;
        private readonly IRoleDao RoleDao;
        public AdminController(IAdminDao adminDao,IRoleDao roleDao)
        {
            AdminDao = adminDao;
            RoleDao = roleDao;
        }
        [HttpGet]
        public JsonResult InitGrid(BaseQuery query)
        {
            var grid = AdminDao.InitGrid(query);
            return Json(grid, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult InitRole()
        {
            var role = RoleDao.FindBy(s => s.IsEnable);
            return Json(role.Select(s => new
            {
                id = s.Id,
                text = s.Name
            }), JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult InitForm(int keyValue)
        {
            var mang = AdminDao.FirstOrDefault(s=>s.Id==keyValue);
            return Json(mang, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SubmitForm(Infrastructure.Entity.Admin admin, int? keyValue)
        {
            return AdminDao.SubmitForm(admin, keyValue) ? Success("操作成功") : Error("操作失败");
        }
        [HttpPost]
        public JsonResult Remove(int keyValue)
        {
            return AdminDao.Delete(s => s.Id == keyValue) ? Success("删除成功") : Error("操作失败");
        }
    }
}