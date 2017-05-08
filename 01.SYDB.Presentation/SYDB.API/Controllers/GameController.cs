using SYDB.IDAO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SYDB.API.Controllers
{
    public class GameController : ApiController
    {
        private readonly IGameDao gameDao;
        public GameController(IGameDao _gameDao)
        {
            gameDao = _gameDao;
        }
        [HttpGet]
        public IHttpActionResult Current(int ? gid)
        {
            return Json(gameDao.FirstOrDefault(s => s.Id == gid));
        }
    }
}