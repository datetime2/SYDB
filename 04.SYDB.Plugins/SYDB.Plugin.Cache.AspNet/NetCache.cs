using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Web;

namespace SYDB.Plugin.Cache.AspNet
{
    public class NetCache : ICache
    {
        private System.Web.Caching.Cache _cache
        {
            get
            {
                return HttpRuntime.Cache;
            }
        }
        public void ClearAll()
        {
            throw new NotImplementedException();
        }
        public T Get<T>(string key)
        {
            return _cache[key] != null ? (T)_cache[key] : default(T);
        }
        public bool IsSet(string key)
        {
            return (_cache[key] != null);
        }
        public void Remove(string key)
        {
            if (_cache[key] != null)
                _cache.Remove(key);
        }

        public void RemoveByPattern(string pattern)
        {
            var keys = new List<string>();
            var enumerator = _cache.GetEnumerator();
            while (enumerator.MoveNext())
            {
                var key = enumerator.Key.ToString();
                if (Regex.IsMatch(key, pattern, RegexOptions.IgnoreCase))
                    keys.Add(key);
            }
            foreach (var k in keys)
            {
                _cache.Remove(k);
            }
        }
        public void Set(string key, object value, int minutes)
        {
            _cache.Insert(key, value, null, System.Web.Caching.Cache.NoAbsoluteExpiration, TimeSpan.FromMinutes(minutes));
        }
        public void Set(string key, object value, int minutes, bool isAbsoluteExpiration, Action<string, object, string> onRemove)
        {
            SetCallBack(key, value, minutes, isAbsoluteExpiration, (k, v, reason) =>
            {
                onRemove.Invoke(k, v, reason.ToString());
            });
        }
        #region private method
        private void SetCallBack(string name, object value, int minutes, bool isAbsoluteExpiration, System.Web.Caching.CacheItemRemovedCallback onRemoveCallback)
        {
            if (isAbsoluteExpiration)
                _cache.Insert(name, value, null, DateTime.Now.AddMinutes(minutes), System.Web.Caching.Cache.NoSlidingExpiration, System.Web.Caching.CacheItemPriority.Normal, onRemoveCallback);
            else
                _cache.Insert(name, value, null, System.Web.Caching.Cache.NoAbsoluteExpiration, TimeSpan.FromMinutes(minutes), System.Web.Caching.CacheItemPriority.Normal, onRemoveCallback);
        }
        #endregion
    }
}
