using Autofac;
using Autofac.Builder;
using Autofac.Configuration;
using Microsoft.Extensions.Configuration;
using System;

namespace SYDB.Plugin.Cache
{
    public class Cache
    {
        private static ICache _cache = null;
        private static readonly object _cacheLocker = new object();
        static Cache()
        {
            Load();
        }
        public static T Get<T>(string key)
        {
            return string.IsNullOrWhiteSpace(key) ? default(T) : _cache.Get<T>(key);
        }
        public static void Set(string key, object value, int minutes)
        {
            if (!string.IsNullOrWhiteSpace(key) && (value != null) && minutes>0)
            {
                lock (_cacheLocker)
                {
                    _cache.Set(key, value, minutes);
                }
            }
        }
        public static void Set(string key, object value, int minutes, bool isAbsoluteExpiration,
            Action<string, object, string> onRemove)
        {
            if (!string.IsNullOrWhiteSpace(key) && (value != null) && minutes > 0)
            {
                lock (_cacheLocker)
                {
                    _cache.Set(key, value, minutes,isAbsoluteExpiration,onRemove);
                }
            }
        }
        public static bool IsSet(string key)
        {
            return _cache.IsSet(key);
        }
        public static void Remove(string key)
        {
            if (!string.IsNullOrWhiteSpace(key))
            {
                lock (_cacheLocker)
                {
                    _cache.Remove(key);
                }
            }
        }
        public static void RemoveByPattern(string pattern)
        {
            if (!string.IsNullOrWhiteSpace(pattern))
            {
                lock (_cacheLocker)
                {
                    _cache.RemoveByPattern(pattern);
                }
            }
        }
        public static void ClearAll()
        {
            _cache.ClearAll();
        }
        private static void Load()
        {
            var builder = new ContainerBuilder();
            var config = new ConfigurationBuilder();
            config.AddJsonFile("Config/autofac.json");
            var module = new ConfigurationModule(config.Build());
            builder.RegisterModule(module);
            IContainer context = null;
            try
            {
                context = builder.Build(ContainerBuildOptions.None);
                _cache = context.Resolve<ICache>();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (context != null)
                {
                    context.Dispose();
                }
            }
        }
    }
}
