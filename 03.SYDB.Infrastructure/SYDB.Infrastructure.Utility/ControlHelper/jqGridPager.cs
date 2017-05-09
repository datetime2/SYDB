using System.Collections.Generic;

namespace SYDB.Infrastructure.Utility.ControlHelper
{
    public class jqGridPager<TOut>
            where TOut : class
    {
        public jqGridPager()
        {
            this.page = 1;
            this.records = 0;
        }
        /// <summary>
        /// 数据集合
        /// </summary>
        public IEnumerable<TOut> rows { get; set; }
        /// <summary>
        /// 页码
        /// </summary>
        public int? page { get; set; }
        /// <summary>
        /// 分页数
        /// </summary>
        public int? size { get; set; }
        /// <summary>
        /// 总条数
        /// </summary>
        public int? records { get; set; }
        /// <summary>
        /// 总页数
        /// </summary>
        public int? total
        {
            get
            {
                if (records > 0)
                {
                    return records % size == 0 ? records / size : records / size + 1;
                }
                else
                {
                    return 0;
                }
            }
        }
    }

    public class jqGridPager
    {
        public jqGridPager()
        {
            this.page = 1;
            this.records = 0;
        }
        /// <summary>
        /// 数据集合
        /// </summary>
        public dynamic rows { get; set; }
        /// <summary>
        /// 页码
        /// </summary>
        public int? page { get; set; }
        /// <summary>
        /// 分页数
        /// </summary>
        public int? size { get; set; }
        /// <summary>
        /// 总条数
        /// </summary>
        public int? records { get; set; }
        /// <summary>
        /// 总页数
        /// </summary>
        public int? total
        {
            get
            {
                if (records > 0)
                {
                    return records % size == 0 ? records / size : records / size + 1;
                }
                else
                {
                    return 0;
                }
            }
        }
    }
}
