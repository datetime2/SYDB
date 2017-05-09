using SYDB.IDAO;
using SYDB.Infrastructure.Authorize;
using SYDB.Infrastructure.Authorize.AuthObject;
using SYDB.Infrastructure.Entity;
using SYDB.Infrastructure.Utility.Helper;
using SYDB.Plugin.Cache;
using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Web;
using System.Web.Security;

namespace SYDB.DAO
{
    public class AuthorizeManager : IAuthorizeManager
    {
        private static ConcurrentDictionary<string, string> CacheKeys = new ConcurrentDictionary<string, string>();
        private IAdminDao AdminDao { get; set; }
        private IMenuDao MenuDao { get; set; }

        public AuthorizeManager(IAdminDao adminDao, IMenuDao menuDao)
        {
            AdminDao = adminDao;
            MenuDao = menuDao;
        }
        #region Private Methods
        private static string GetTokenKey(string token)
        {
            return string.Format("AUTH_TOKEN_{0}", token);
        }
        private void RegisterToken(string token, string user = "SYDB_ADMIN", bool rememberMe = false)
        {
            if (token.IsNullOrBlank())
                throw new ArgumentNullException("token", token);
            DateTime expiration = rememberMe ? DateTime.Now.AddDays(7) : DateTime.Now.Add(FormsAuthentication.Timeout);
            var ticket = new FormsAuthenticationTicket(1, user, DateTime.Now, expiration, true, token, FormsAuthentication.FormsCookiePath);
            string hashTicket = FormsAuthentication.Encrypt(ticket);
            var userCookie = new HttpCookie(FormsAuthentication.FormsCookieName, hashTicket) { Domain = FormsAuthentication.CookieDomain };
            if (rememberMe)
                userCookie.Expires = expiration;
            HttpContext.Current.Response.Cookies.Set(userCookie);
        }
        private void RemoveToken(string token)
        {
            Cache.Remove(GetTokenKey(token));
        }
        private void SetCacheAuthUser(string authToken, UserForAuthorize authUser)
        {
            var key = GetTokenKey(authToken);
            // 缓存起来
            Cache.Set(key, authUser, 12 * 60);
            CacheKeys.TryAdd(key, key);
        }
        private UserForAuthorize GetAuthorizeUserInfo(string token, bool validateLoginToken = true)
        {
            var authUser = Cache.Get<UserForAuthorize>(GetTokenKey(token));
            var datas = token.Split('_');
            var loginToken = string.Empty;
            if (datas.Length == 2)
            {
                var userId = datas[0].ToInt();
                loginToken = datas[1];
                if (authUser == null)
                {
                    // 尝试从数据库读取
                    var admin = AdminDao.FindByLoginToken(userId, loginToken);
                    if (admin != null)
                    {
                        authUser = GetAuthUserFromDb(admin);
                        // 写入到缓存
                        SetCacheAuthUser(token, authUser);
                    }
                }
            }
            if (validateLoginToken)
                if (authUser == null || !AdminDao.ValidateLoginToken(authUser.UserId, loginToken))
                    return null;
            return authUser;
        }

        private UserForAuthorize GetAuthUserFromDb(Admin user)
        {
            var authAdmin = new UserForAuthorize()
            {
                LoginName = user.LoginName,
                UserId = user.Id
            };
            var Permissions = MenuDao.GetUserPermission(user.Id);
            //菜单权限
            authAdmin.Menus = Permissions.Where(s => s.ParentId == 0 && s.MenuType == MenuType.Menu).Select(x => new MenuForAuthorize()
            {
                MenuId = x.Id,
                ParentId = x.ParentId,
                MenuName = x.Name,
                MenuUrl = x.Url,
                MenuIcon = x.Icon,
                MenuType = x.MenuType,
                Childs = Permissions.Where(ss => ss.ParentId.Equals(x.Id)).Select(xx => new MenuForAuthorize
                {
                    MenuId = xx.Id,
                    ParentId = xx.ParentId,
                    MenuName = xx.Name,
                    MenuUrl = xx.Url,
                    MenuIcon = xx.Icon,
                    MenuType = xx.MenuType
                }).ToList()
            }).OrderBy(x => x.SortOrder).ToList();
            //按钮权限
            authAdmin.Buttons = Permissions.Where(s => s.MenuType == MenuType.Button).Select(s => new ButtonForAuthorize
            {
                MenuId = s.ParentId,
                ButtonId=s.DocumentId,
                ButtonClass = s.DocumentClass,
                ButtonEvent = s.DocumentEvent,
                ButtonIcon = s.Icon,
                ButtonName = s.Name
            }).OrderBy(x => x.SortOrder).ToList();
            return authAdmin;
        }
        #endregion

        public string GetCurrentTokenFromCookies()
        {
            if (HttpContext.Current.User.Identity.IsAuthenticated)
            {
                var token = ((FormsIdentity)HttpContext.Current.User.Identity).Ticket.UserData;
                if (token.NotNullOrBlank())
                    return token;
                throw new AuthorizeTokenNotFoundException();
            }
            throw new AuthorizeTokenNotFoundException();
        }

        public UserForAuthorize GetCurrentUserInfo()
        {
            var token = this.GetCurrentTokenFromCookies();
            return GetAuthorizeUserInfo(token);
        }

        public UserForAuthorize GetAuthorizeUserInfo(UserToken user)
        {
            var token = user.GetAuthToken();
            return GetAuthorizeUserInfo(token, false);
        }

        public void ClearCache()
        {
            foreach (var cacheKey in CacheKeys)
            {
                Cache.Remove(cacheKey.Key);
            }
        }

        public void SignIn(string loginName, string password, bool rememberMe = false)
        {
            var user = AdminDao.Login(loginName, password, true);
            var authUser = GetAuthUserFromDb(user);
            var dataToken = new UserToken() { UserId = user.Id, LastLoginToken = user.LastLoginToken }.GetAuthToken();
            // Cache
            SetCacheAuthUser(dataToken, authUser);
            // Cookies
            RegisterToken(dataToken, authUser.LoginName, rememberMe);
        }

        public void SignOut()
        {
            try
            {
                var token = this.GetCurrentTokenFromCookies();
                RemoveToken(token);
                FormsAuthentication.SignOut();
            }
            catch (AuthorizeTokenNotFoundException)
            {
                return;
            }
        }

        public void RedirectToLoginPage()
        {
            FormsAuthentication.RedirectToLoginPage();
        }

        public bool ValidatePermission(string menuId, bool throwExceptionIfNotPass = true)
        {
            var user = GetCurrentUserInfo();
            if (user == null)
                throw new AuthorizeTokenInvalidException();
            var permission = user.Menus.FirstOrDefault(x => x.MenuId.Equals(menuId));
            if (permission == null && throwExceptionIfNotPass)
                throw new AuthorizeNoPermissionException();
            return permission != null;
        }
    }
}
