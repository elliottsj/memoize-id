const sentinel = Symbol(
  'Cache key for `memoize` corresponding to the cached value for a complete set of arguments'
);

/**
 * Get a value from the given cache Map, accessing an inner Map for each value in `keys`.
 * If a value does not exist, return undefined.
 * @param  {Map}        cache The base Map from which to get a value
 * @param  {Array<Any>} keys  An array of keys for which nested Maps will be accessed
 * @return {Any}        The value itself
 */
function get(cache, keys) {
  if (keys.length === 0) {
    return cache.get(sentinel);
  }
  const [key, ...restKeys] = keys;
  const nestedCache = cache.get(key);
  if (!nestedCache) {
    return undefined;
  }
  return get(nestedCache, restKeys);
}

/**
 * Set a value in the given cache Map, creating a new nested Map
 * (or using an existing Map) for each value in `keys`.
 * The innermost Map will have `map.get(sentinel) === value`.
 * @param {Map}        cache The base Map for which to set a value
 * @param {Array<Any>} keys  An array of keys for which new nested Maps will be created/used
 * @param {Any}        value The value to set in the cache
 */
function set(cache, keys, value) {
  if (keys.length === 0) {
    cache.set(sentinel, value);
  } else {
    const [key, ...restKeys] = keys;
    let nestedCache = cache.get(key);
    if (!nestedCache) {
      nestedCache = new Map();
      cache.set(key, nestedCache);
    }
    set(nestedCache, restKeys, value);
  }
  return value;
}

/**
 * Memoize the given function by the identity of its arguments. If an integer N is passed
 * as the first argument, return values will be cached based on the first N arguments.
 * @param  {Function} fn
 *   The function to memoize
 * @param  {Object}   [options]
 *   Options
 * @param  {Number}   [options.arity]
 *  The number of arguments to memoize by. Default: all
 * @return {Function}
 *  The memoized function
 */
export default function memoize(fn, { arity } = {}) {
  const cache = new Map();
  return function memoized(...args) {
    const cacheArgs = arity !== undefined ? args.slice(0, arity) : args;
    return get(cache, cacheArgs) || set(cache, cacheArgs, fn(...args));
  };
}
