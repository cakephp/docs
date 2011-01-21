7.2.6 Clearing the Cache
------------------------

It is important to remember that the Cake will clear a cached view
if a model used in the cached view is modified. For example, if a
cached view uses data from the Post model, and there has been an
INSERT, UPDATE, or DELETE query made to a Post, the cache for that
view is cleared, and new content is generated on the next request.

If you need to manually clear the cache, you can do so by calling
Cache::clear(). This will clear **all** cached data, excluding
cached view files. If you need to clear the cached view files, use
``clearCache()``.

7.2.6 Clearing the Cache
------------------------

It is important to remember that the Cake will clear a cached view
if a model used in the cached view is modified. For example, if a
cached view uses data from the Post model, and there has been an
INSERT, UPDATE, or DELETE query made to a Post, the cache for that
view is cleared, and new content is generated on the next request.

If you need to manually clear the cache, you can do so by calling
Cache::clear(). This will clear **all** cached data, excluding
cached view files. If you need to clear the cached view files, use
``clearCache()``.
