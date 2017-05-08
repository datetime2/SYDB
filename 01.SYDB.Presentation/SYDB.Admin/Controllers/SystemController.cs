using SYDB.IDAO;
using SYDB.Infrastructure.Entity;
using SYDB.Infrastructure.Utility.ControlHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SYDB.Admin.Controllers
{
    public class SystemController : BaseAuthorizeController
    {
        private readonly IRoleDao RoleDao;
        private readonly IMenuDao MenuDao;
        public SystemController(IRoleDao roleDao, IMenuDao menuDao)
        {
            RoleDao = roleDao;
            MenuDao = menuDao;
        }

        #region 角色---Role
        public ActionResult Role()
        {
            return View();
        }
        [HttpGet]
        public JsonResult RoleGrid(BaseQuery query)
        {
            var grid = RoleDao.InitGrid(query);
            return Json(grid, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region 菜单---Menu
        public ActionResult Menu()
        {
            return View();
        }
        public ActionResult MenuForm()
        {
            return View();
        }
        [HttpGet]
        public JsonResult MenuGrid(BaseQuery query)
        {
            return Json(MenuDao.InitGrid(query), JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public ContentResult MenuTree(BaseQuery query)
        {
            return Content(MenuDao.InitTree(query).TreeSelectJson());
        }
        [HttpGet]
        public JsonResult MInitForm(int keyValue)
        {
            var menu = MenuDao.FirstOrDefault(s => s.Id == keyValue);
            return Json(menu, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult MSubmitForm(Menu module, int? keyValue)
        {
            return MenuDao.SubmitForm(module, keyValue) ? Success("操作成功") : Error("操作失败");
        }
        #endregion
    }
}