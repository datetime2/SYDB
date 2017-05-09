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
    public class MenuController : BaseAuthorizeController
    {
        private readonly IMenuDao MenuDao;
        public MenuController(IMenuDao menuDao)
        {
            MenuDao = menuDao;
        }
        #region 菜单---Menu
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
        public JsonResult InitForm(int keyValue)
        {
            var menu = MenuDao.FirstOrDefault(s => s.Id == keyValue);
            return Json(menu, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult SubmitForm(Menu module, int? keyValue)
        {
            return MenuDao.SubmitForm(module, keyValue) ? Success("操作成功") : Error("操作失败");
        }
        [HttpPost]
        public JsonResult Remove(int? keyValue)
        {
            return MenuDao.Delete(s => s.Id == keyValue) ? Success("操作成功") : Error("操作失败");
        }
        #endregion
    }
}