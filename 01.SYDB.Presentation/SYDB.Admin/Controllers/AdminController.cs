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
        public AdminController(IAdminDao adminDao)
        {
            AdminDao = adminDao;
        }
        [HttpGet]
        public JsonResult InitGrid(BaseQuery query)
        {
            var grid = AdminDao.InitGrid(query);
            return Json(grid, JsonRequestBehavior.AllowGet);
        }
    }
}