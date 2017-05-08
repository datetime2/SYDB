using SYDB.Infrastructure.Utility.Helper;
using System.Collections.Generic;
using System.Text;

namespace SYDB.Infrastructure.Utility.ControlHelper
{
    public class ModuleSelectModel<T> where T : class
    {
        public IEnumerable<T> rows { get; set; }
    }

    /// <summary>
    /// 折叠列表 模型
    /// </summary>
    public class TreeGrid : ModuleViewModel
    {
        public TreeGrid()
        {
            this.level = 0;
            this.isLeaf = false;
            this.parent = "0";
            this.expanded = false;
            this.loaded = true;
        }
        public int level { get; set; }
        public string parent { get; set; }
        public bool isLeaf { get; set; }
        public bool expanded { get; set; }
        public bool loaded { get; set; }
        public int AddNext_Btn { get; set; }

    }

    /// <summary>
    /// 下拉 模型
    /// </summary>
    public class TreeSellect
    {
        public TreeSellect()
        {
            parentId = 0;
        }
        public int id { get; set; }
        public string text { get; set; }
        public int parentId { get; set; }
        public object data { get; set; }
    }
    /// <summary>
    /// 折叠树 模型
    /// </summary>
    public class TreeView
    {
        public TreeView()
        {
            showcheck = true;
            isexpand = true;
            complete = true;
            hasChildren = true;
            this.ChildNodes = new List<TreeView>();
        }
        public string parentnodes { get; set; }
        public string id { get; set; }
        public string text { get; set; }
        public string value { get; set; }
        public int? checkstate { get; set; }
        public bool showcheck { get; set; }
        public bool complete { get; set; }
        public bool isexpand { get; set; }
        public bool hasChildren { get; set; }
        public string img { get; set; }
        public ICollection<TreeView> ChildNodes { get; set; }
    }

    public static class TreeSelectOperate
    {
        public static string TreeSelectJson(this List<TreeSellect> data)
        {
            var sb = new StringBuilder();
            sb.Append("[");
            sb.Append(TreeSelectJson(data, "0", ""));
            sb.Append("]");
            return sb.ToString();
        }
        private static string TreeSelectJson(List<TreeSellect> data, string parentId, string blank)
        {
            var sb = new StringBuilder();
            var childNodeList = data.FindAll(t => t.parentId == int.Parse(parentId));
            var tabline = "";
            if (parentId != "0")
                tabline = "　　";
            if (childNodeList.Count > 0)
                tabline = tabline + blank;
            foreach (var entity in childNodeList)
            {
                entity.text = tabline + entity.text;
                var strJson = entity.ToJson();
                sb.Append(strJson);
                sb.Append(TreeSelectJson(data, entity.id + "", tabline));
            }
            return sb.ToString().Replace("}{", "},{");
        }
    }
}