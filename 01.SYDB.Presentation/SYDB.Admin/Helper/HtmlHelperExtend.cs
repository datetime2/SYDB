using SYDB.Infrastructure.Authorize.AuthObject;
using SYDB.Infrastructure.Entity;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Text;
namespace SYDB.Admin
{
    public static partial class HtmlHelperExtend
    {
        public static MvcHtmlString ButtonForUser(this HtmlHelper htmlHelper, List<ButtonForAuthorize> models, string btnClassName = "")
        {
            string btnClass = string.IsNullOrEmpty(btnClassName) ? "btn btn-default dropdown-text" : btnClassName;
            StringBuilder sb = new StringBuilder("<div class='btn-group'>");
            foreach (var btn in models)
            {
                sb.AppendFormat("<a id=\"{0}\" class=\"{1}\" onclick=\"{2}\"><i class=\"{3}\"></i>{4}</a>", btn.ButtonId, btnClass ?? btn.ButtonClass, btn.ButtonEvent, btn.ButtonIcon, btn.ButtonName);
            }
            sb.Append("</div>");
            MvcHtmlString result = new MvcHtmlString(sb.ToString());
            return result;
        }
    }
}