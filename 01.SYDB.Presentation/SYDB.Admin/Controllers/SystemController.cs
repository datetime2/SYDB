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
    public class SystemController : BaseAuthorizeController
    {
        private readonly IRoleDao RoleDao;
        private readonly IMenuDao MenuDao;
        public SystemController(IRoleDao roleDao, IMenuDao menuDao)
        {
            RoleDao = roleDao;
            MenuDao = menuDao;
        }

        

        
    }
}