namespace SYDB.Infrastructure.Utility.ControlHelper
{
    public class ModuleViewModel
    {
        public int Id { get; set; }
        public int ParentId { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Icon { get; set; }
        public bool IsEnable { get; set; }
        public string DocumentId { get; set; }
        public string MenuType { get; set; }
        public int SortOrder { get; set; }
    }
}