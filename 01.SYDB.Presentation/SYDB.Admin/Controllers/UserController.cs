using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SYDB.Admin.Controllers
{
    public class UserController : BaseAuthorizeController
    {
        public ActionResult Cash()
        {
            return View();
        }
        public ActionResult Rechange()
        {
            return View();
        }
    }
}