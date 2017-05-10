using System.Web.Mvc;

namespace SYDB.Admin.Controllers
{
    public class GameController : BaseAuthorizeController
    {
        public ActionResult Bet()
        {
            return View();
        }
    }
}