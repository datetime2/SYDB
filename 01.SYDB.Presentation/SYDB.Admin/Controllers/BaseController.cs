using System.Web.Mvc;
using SYDB.Infrastructure.Utility;

namespace SYDB.Admin.Controllers
{
    public abstract class BaseController : Controller
    {
        public BaseController()
        {
        }
        public virtual ActionResult Index(int? menuId)
        {
            ViewBag.MenuId = menuId.HasValue ? menuId : 0;
            return View();
        }
        public virtual ActionResult Form()
        {
            return View();
        }
        public virtual ActionResult Detail()
        {
            return View();
        }
        protected virtual JsonResult Success(string message)
        {
            return Json(new AjaxResult { state = ResultType.success.ToString(), message = message }, JsonRequestBehavior.AllowGet);
        }
        protected virtual JsonResult Success(string message, int showtimes)
        {
            return Json(new AjaxResult { state = ResultType.success.ToString(), message = message, showtimes = showtimes }, JsonRequestBehavior.AllowGet);
        }
        protected virtual JsonResult Success(string message, object data)
        {
            return Json(new AjaxResult { state = ResultType.success.ToString(), message = message, data = data }, JsonRequestBehavior.AllowGet);
        }
        protected virtual JsonResult Error(string message)
        {
            return Json(new AjaxResult { state = ResultType.error.ToString(), message = message }, JsonRequestBehavior.AllowGet);
        }

    }
}