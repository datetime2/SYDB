using System.Web.Mvc;
using System.Collections.Generic;
using SYDB.Infrastructure.Authorize.AuthObject;
namespace SYDB.Admin.Controllers
{
    public class HomeController : BaseAuthorizeController
    {
        public override ActionResult Index(int?menuId)
        {
            var menus = GetCurrentUser() == null ? new List<MenuForAuthorize>() : GetCurrentUser().Menus;
            return View(menus);
        }
        public ActionResult Main()
        {
            return View();
        }
    }
}