using SYDB.IDAO;
using SYDB.Infrastructure.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Linq.Expressions;
using SYDB.Infrastructure.Utility.Helper;
using SYDB.Infrastructure.Utility.Exceptions;
using SYDB.Infrastructure.ORM;

namespace SYDB.DAO
{
    public class AdminDao : BaseDao<Admin>, IAdminDao
    {
        public void ChangePassword(int id, string password)
        {
            throw new NotImplementedException();
        }

        public Admin FindByLoginToken(int id, string token)
        {
            return DbFunction((db) =>
            {
                var user = db.Queryable<Admin>().Single(x => x.Id == id);
                if (user == null)
                    throw new ArgumentException(id.ToString(), "id");
                user.LastLoginToken = user.LastLoginToken ?? string.Empty;
                if (!user.LastLoginToken.EqualsIgnoreCase(token))
                    throw new DataNotFoundException("用户不存在");
                return user;
            });
        }
        public Admin Login(string loginName, string password, bool updateLoginToken)
        {
            if (loginName.IsNullOrBlank())
                throw new ArgumentEmptyException("登录名不能为空");
            if (password.IsNullOrBlank())
                throw new ArgumentEmptyException("登录密码不能为空");
            var user = DbFunction((db) =>
            {
                return db.Queryable<Admin>().Single(x => x.LoginName.Equals(loginName));
            });
            if (user == null)
                throw new NotFoundException("账号不存在");
            if (!EncryptPassword(password, user.PassSalt, true).EqualsIgnoreCase(user.PassWord))
                throw new NotEqualException("登录密码错误");
            if (updateLoginToken)
            {
                var newToken = SecurityHelper.NetxtString(24).ToLower();
                UpdateLoginToken(user.Id, newToken, DateTime.Now);
                user.LastLoginToken = newToken;
            }
            if (user.LastLoginToken.IsNullOrBlank())
                throw new ArgumentEmptyException("token失效");
            return user;
        }

        public bool ValidateLoginToken(int id, string token)
        {
            if (token.IsNullOrBlank())
                throw new ArgumentException(token, "token");
            return DbFunction((db) =>
            {
                var user = db.Queryable<Admin>().Single(x => x.Id == id);
                if (user == null)
                    throw new ArgumentException(id.ToString(), "id");
                return token.EqualsIgnoreCase(user.LastLoginToken);
            });
        }
        public bool ValidatePassword(int id, string password)
        {
            throw new NotImplementedException();
        }
        public static string EncryptPassword(string password, string passsalt, bool? isMD5 = false)
        {
            if (!isMD5.Value)
                return SecurityHelper.Md5(SecurityHelper.Md5(password) + passsalt);
            else
                return SecurityHelper.Md5(password + passsalt);
        }
        private void UpdateLoginToken(int id, string loginToken, DateTime lastLoginTime)
        {
            DbAction((db) =>
            {
                var user = db.Queryable<Admin>().Single(x => x.Id.Equals(id));
                if (user == null)
                    throw new ArgumentException(id.ToString(), "id");
                user.LastLoginToken = loginToken;
                user.LastLoginTime = lastLoginTime;
                user.LastLoginIp = "127.0.0.1";
                db.Update(user);
            });
        }
    }
}
