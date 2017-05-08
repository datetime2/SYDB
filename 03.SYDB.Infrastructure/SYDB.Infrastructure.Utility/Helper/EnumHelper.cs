using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web.Mvc;

namespace SYDB.Infrastructure.Utility.Helper
{
    public static class EnumHelper
    {
        public static string ToDescription(this Enum value)
        {
            var enumType = value.GetType();
            var name = Enum.GetName(enumType, value);
            return GetDescription(enumType, name);
        }
        public static Dictionary<string, int> ToDescriptionDictionary<TEnum>()
        {
            var enumType = typeof(TEnum);
            var values = Enum.GetValues(enumType);
            return values.Cast<Enum>().ToDictionary(enum2 => enum2.ToDescription(), Convert.ToInt32);
        }

        public static Dictionary<string, int> ToDictionary<TEnum>()
        {
            var enumType = typeof(TEnum);
            var values = Enum.GetValues(enumType);
            return values.Cast<Enum>().ToDictionary(enum2 => enum2.ToString(), Convert.ToInt32);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="TEnum">类型</typeparam>
        /// <param name="enumObj"></param>
        /// <param name="perfix"></param>
        /// <param name="onlyFlag"></param>
        /// <returns></returns>
        public static SelectList ToSelectList<TEnum>(this TEnum enumObj, bool perfix = true, bool onlyFlag = false)
        {
            var items = (from e in Enum.GetValues(typeof(TEnum)).Cast<TEnum>()
                         select new
                         {
                             Value = Convert.ToInt32(e),
                             Text = GetDescription(typeof(TEnum), e.ToString())
                         }).ToList();
            var item = new
            {
                Value = 0,
                Text = "请选择..."
            };
            if (perfix)
            {
                items.Insert(0, item);
            }
            return new SelectList(items, "Value", "Text", enumObj);
        }
        /// <summary>
        /// 枚举转 LIST
        /// </summary>
        /// <typeparam name="TEnum">枚举类型</typeparam>
        /// <returns></returns>
        public static List<SelectListItem> ToSelectListItem<TEnum>()
        {
            return (from int value in Enum.GetValues(typeof(TEnum))
                    select new SelectListItem
                    {
                        Text = ((Enum)Enum.ToObject(typeof(TEnum), value)).ToDescription(),
                        Value = value.ToString()
                    }).ToList();
        }
        /// <summary>
        /// 枚举转 LIST
        /// </summary>
        /// <typeparam name="TEnum">枚举类型</typeparam>
        /// <param name="selectVaule">默认选中值</param>
        /// <returns></returns>
        public static List<SelectListItem> ToSelectListItem<TEnum>(string selectVaule)
        {
            return (from int value in Enum.GetValues(typeof(TEnum))
                    select new SelectListItem
                    {
                        Text = ((Enum)Enum.ToObject(typeof(TEnum), value)).ToDescription(),
                        Value = value.ToString(),
                        Selected = value.ToString() == selectVaule ? true : false
                    }).ToList();
        }

        #region Private Method
        private static Hashtable _enumDesciption = GetDescriptionContainer();
        private static void AddToEnumDescription(Type enumType)
        {
            _enumDesciption.Add(enumType, GetEnumDic(enumType));
        }
        private static string GetDescription(Type enumType, string enumText)
        {
            if (string.IsNullOrEmpty(enumText))
            {
                return null;
            }
            if (!_enumDesciption.ContainsKey(enumType))
            {
                AddToEnumDescription(enumType);
            }
            var obj2 = _enumDesciption[enumType];
            if ((obj2 == null) || string.IsNullOrEmpty(enumText))
            {
                throw new ApplicationException("不存在枚举的描述");
            }
            var dictionary = (Dictionary<string, string>)obj2;
            return dictionary[enumText];
        }
        private static Hashtable GetDescriptionContainer()
        {
            _enumDesciption = new Hashtable();
            return _enumDesciption;
        }
        private static Dictionary<string, string> GetEnumDic(Type enumType)
        {
            var dictionary = new Dictionary<string, string>();
            var fields = enumType.GetFields();
            foreach (var info in fields)
            {
                if (!info.FieldType.IsEnum) continue;
                var customAttributes = info.GetCustomAttributes(typeof(DescriptionAttribute), false);
                dictionary.Add(info.Name, ((DescriptionAttribute)customAttributes[0]).Description);
            }
            return dictionary;
        }
        #endregion

    }
}
