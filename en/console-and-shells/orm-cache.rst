ORM Cache Shell
###############

The OrmCacheShell provides a simple CLI tool for managing your application's
metadata caches. In deployment situations it is helpful to rebuild the metadata
cache in-place without clearing the existing cache data. You can do this by
running::

    bin/cake orm_cache build --connection default

This will rebuild the metadata cache for all tables on the ``default``
connection. If you only need to rebuild a single table you can do that by
providing its name::

    bin/cake orm_cache build --connection default articles

In addition to building cached data, you can use the OrmCacheShell to remove
cached metadata as well::

    # Clear all metadata
    bin/cake orm_cache clear

    # Clear a single table
    bin/cake orm_cache clear articles

