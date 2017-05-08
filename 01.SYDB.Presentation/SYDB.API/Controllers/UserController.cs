using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SYDB.API.Controllers
{
    public class UserController : ApiController
    {
        [HttpGet]
        public IHttpActionResult Register()
        {
            return Json(new { success = true });
        }
    }
}