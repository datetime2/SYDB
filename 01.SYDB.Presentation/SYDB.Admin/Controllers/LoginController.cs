using SYDB.Infrastructure.Authorize;
using SYDB.Infrastructure.Utility;
using SYDB.Infrastructure.Utility.Exceptions;
using SYDB.Infrastructure.Utility.Extensions;
using SYDB.Infrastructure.Utility.Helper;
using System;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace SYDB.Admin.Controllers
{
    public class LoginController : BaseController
    {
        IAuthorizeManager AuthorizeManager;
        public LoginController(IAuthorizeManager authorizeManager)
        {
            AuthorizeManager = authorizeManager;
        }
        [HttpGet]
        public FileContentResult AuthCode()
        {
            string code;
            var file = VerifyCode.GetVerifyCode(out code);
            Session["checkCode"] = code;
            return File(file, @"image/Gif");
        }
        [HttpPost]
        public ActionResult Singin(string LoginName, string PassWord, string Code, bool? rememberMe = true)
        {
            var response = new AjaxResult();
            try
            {
                AuthorizeManager.SignIn(LoginName, PassWord, rememberMe.Value);
                response.state = "success";
            }
            catch (Exception ex)
            {
                if (!(ex is DefinedException))
                {
                    Log.Error(ex.GetIndentedExceptionLog());
                }
                response.state = "error";
                response.message = ex.Message;
            }
            return Json(response);
        }
        public ActionResult SingOut()
        {
            AuthorizeManager.SignOut();
            AuthorizeManager.RedirectToLoginPage();
            return null;
        }
    }
}