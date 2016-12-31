Cache
#####

The Cache helper assists in caching entire layouts and views, saving
time repetitively retrieving data. View Caching in Cake temporarily
stores parsed layouts and views with the storage engine of choice. It
should be noted that the Cache helper works quite differently than other
helpers. It does not have methods that are directly called. Instead a
view is marked with cache tags indicating which blocks of content should
not be cached.

When a URL is requested, Cake checks to see if that request string has
already been cached. If it has, the rest of the url dispatching process
is skipped. Any nocache blocks are processed normally and the view is
served. This creates a big savings in processing time for each request
to a cached URL as minimal code is executed. If Cake doesn't find a
cached view, or the cache has expired for the requested URL it continues
to process the request normally.

General Caching
===============

Caching is intended to be a means of temporary storage to help reduce
load on the server. For example you could store the results of a
time-expensive database query so that it is not required to run on every
page load.

With this in mind caching is not permanent storage and should never be
used to permanently store anything. And only cache things that can be
regenerated when needed.

Cache Engines in Cake
=====================

New since 1.2 are several cache engines or cache backends. These
interface transparently with the cache helper, allowing you to store
view caches in a multitude of media without worrying about the specifics
of that media. The choice of cache engine is controlled through the
app/config/core.php config file. Most options for each caching engine
are listed in the core.php config file and more detailed information on
each caching engine can be found in the Caching Section.

File

The File Engine is the default caching engine used by cake. It writes
flat files to the filesystem and it has several optional parameters but
works well with the defaults.

APC

The APC engine implements the `Alternative PHP
Cache <https://secure.php.net/apc>`_ opcode Cacher. Like XCache, this engine
caches the compiled PHP opcode.

XCache

The XCache caching engine is functionally similar to APC other than it
implements the `XCache <http://xcache.lighttpd.net/>`_ opcode caching
engine. It requires the entry of a user and password to work properly.

Memcache

The Memcache engine works with a memcaching server allowing you to
create a cache object in system memory. More information on memcaching
can be found on `php.net <http://www.php.net/memcache>`_ and
`memcached <http://www.danga.com/memcached/>`_

Cache Helper Configuration
==========================

View Caching and the Cache Helper have several important configuration
elements. They are detailed below.

To use the cache helper in any view or controller, you must first
uncomment and set Configure::Cache.check to true in ``core.php`` of your
app/config folder. If this is not set to true, then the cache will not
be checked or created.

Caching in the Controller
=========================

Any controllers that utilize caching functionality need to include the
CacheHelper in their $helpers array.

::

    var $helpers = array('Cache');

You also need to indicate which actions need caching, and how long each
action will be cached. This is done through the $cacheAction variable in
your controllers. $cacheAction should be set to an array which contains
the actions you want cached, and the duration in seconds you want those
views cached. The time value can be expressed in a strtotime() format.
(ie. "1 hour", or "3 minutes").

Using the example of an ArticlesController, that receives a lot of
traffic that needs to be cached.

Cache frequently visited Articles for varying lengths of time

::

    var $cacheAction = array(
        'view/23' => 21600,
        'view/48' => 36000,
        'view/52'  => 48000
    );

Remember to use your routes in the $cacheAction if you have any.

Cache an entire action in this case a large listing of articles

::

    var $cacheAction = array(
        'archives/' => '60000'
    );

Cache every action in the controller using a strtotime() friendly time
to indicate Controller wide caching time.

::

    var $cacheAction = "1 hour";

You can also enable controller/component callbacks for cached views
created with ``CacheHelper``. To do so you must use the array format for
``$cacheAction`` and create an array like the following:

::

    var $cacheAction = array(
        'view' => array('callbacks' => true, 'duration' => 21600),
        'add' => array('callbacks' => true, 'duration' => 36000),
        'index'  => array('callbacks' => true, 'duration' => 48000)
    );

By setting ``callbacks => true`` you tell CacheHelper that you want the
generated files to create the components and models for the controller.
As well as, fire the component initialize, controller beforeFilter, and
component startup callbacks.

callbacks => true partly defeats the purpose of caching. This is also
the reason it is disabled by default.

Marking Non-Cached Content in Views
===================================

There will be times when you don't want an *entire* view cached. For
example, certain parts of the page may look different whether a user is
currently logged in or browsing your site as a guest.

To indicate blocks of content that are *not* to be cached, wrap them in
``<cake:nocache> </cake:nocache>`` like so:

::

    <cake:nocache>
    <?php if ($session->check('User.name')) : ?>
        Welcome, <?php echo $session->read('User.name')?>.
    <?php else: ?>
        <?php echo $html->link('Login', 'users/login')?>
    <?php endif; ?>
    </cake:nocache>

It should be noted that once an action is cached, the controller method
for the action will not be called - otherwise what would be the point of
caching the page. Therefore, it is not possible to wrap
``<cake:nocache> </cake:nocache>`` around variables which are set from
the controller as they will be *null*.

Clearing the Cache
==================

It is important to remember that the Cake will clear a cached view if a
model used in the cached view is modified. For example, if a cached view
uses data from the Post model, and there has been an INSERT, UPDATE, or
DELETE query made to a Post, the cache for that view is cleared, and new
content is generated on the next request.

If you need to manually clear the cache, you can do so by calling
Cache::clear(). This will clear **all** cached data, excluding cached
view files. If you need to clear the cached view files, use
``clearCache()``.
