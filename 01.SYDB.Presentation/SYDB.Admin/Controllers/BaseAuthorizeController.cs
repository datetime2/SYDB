using SYDB.Admin.Helper;
using SYDB.Infrastructure.Authorize;
using SYDB.Infrastructure.Authorize.AuthObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SYDB.Admin.Controllers
{
    public class BaseAuthorizeController : BaseController
    {
        private ServiceResolver _serviceResolver;
        private UserForAuthorize _CurrentUser;
        public BaseAuthorizeController()
        {
            ViewBag.CurrentUser = GetCurrentUser();
            ViewBag.Buttons = GetCurrentUser().Buttons.Any() ? GetCurrentUser().Buttons : new List<ButtonForAuthorize>();
        }

        public ServiceResolver ServiceResolver
        {
            get
            {
                return _serviceResolver ?? (_serviceResolver = new ServiceResolver());
            }
        }
        private IAuthorizeManager AuthorizeManager
        {
            get
            {
                return ServiceResolver.Resolve<IAuthorizeManager>();
            }
        }
        protected UserForAuthorize GetCurrentUser()
        {
            try
            {
                _CurrentUser = AuthorizeManager.GetCurrentUserInfo();
            }
            catch (AuthorizeTokenNotFoundException)
            {
            }
            return _CurrentUser;
        }
        protected virtual void CheckLogin()
        {
            if (GetCurrentUser() == null)
                AuthorizeManager.RedirectToLoginPage();
        }
        protected override void OnAuthorization(AuthorizationContext filterContext)
        {
            base.OnAuthorization(filterContext);
            CheckLogin();
        }
    }
}