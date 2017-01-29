CacheHelper
###########

.. php:class:: CacheHelper(View $view, array $settings = array())

The Cache helper assists in caching entire layouts and views, saving time
repetitively retrieving data. View Caching in Cake temporarily stores parsed
layouts and views as simple PHP + HTML files It should be noted that the Cache
helper works quite differently than other helpers. It does not have methods that
are directly called. Instead a view is marked with cache tags indicating which
blocks of content should not be cached. The CacheHelper then uses helper
callbacks to process the file and output to generate the cache file.

When a URL is requested, CakePHP checks to see if that request string has already
been cached. If it has, the rest of the url dispatching process is skipped. Any
nocache blocks are processed normally and the view is served. This creates a big
savings in processing time for each request to a cached URL as minimal code is
executed. If Cake doesn't find a cached view, or the cache has expired for the
requested URL it continues to process the request normally.

Using the Helper
================

There are two steps you have to take before you can use the CacheHelper.  First
in your ``APP/Config/core.php`` uncomment the Configure write call for
``Cache.check``. This will tell CakePHP to check for, and generate view cache
files when handling requests.

Once you've uncommented the ``Cache.check`` line you will need to add the helper
to your controller's ``$helpers`` array::

    <?php
    class PostsController extends AppConrtroller {
        public $helpers = array('Cache');
    }

Additional configuration options
--------------------------------

CacheHelper has a few additional configuration options you can use to tune and
tweak its behavior. This is done through the ``$cacheAction``
variable in your controllers. ``$cacheAction`` should be set to an
array which contains the actions you want cached, and the duration
in seconds you want those views cached. The time value can be
expressed in a ``strtotime()`` format. (ie. "1 hour", or "3 minutes").

Using the example of an ArticlesController, that receives a lot of
traffic that needs to be cached::

    <?php
    public $cacheAction = array(
        'view' => 36000,
        'index'  => 48000
    );

This will cache the view action 10 hours, and the index action 13 hours.  By
making ``$cacheAction`` a ``strtotime()`` friendly value you can cache every action in the
controller::

    <?php
    public $cacheAction = "1 hour";

You can also enable controller/component callbacks for cached views
created with ``CacheHelper``. To do so you must use the array
format for ``$cacheAction`` and create an array like the following::

    <?php
    public $cacheAction = array(
        'view' => array('callbacks' => true, 'duration' => 21600),
        'add' => array('callbacks' => true, 'duration' => 36000),
        'index' => array('callbacks' => true, 'duration' => 48000)
    );

By setting ``callbacks => true`` you tell CacheHelper that you want
the generated files to create the components and models for the
controller. Additionally, fire the component initialize, controller
beforeFilter, and component startup callbacks.

.. note::

    Setting ``callbacks => true`` partly defeats the
    purpose of caching. This is also the reason it is disabled by
    default.

Marking Non-Cached Content in Views
===================================

There will be times when you don't want an *entire* view cached.
For example, certain parts of the page may look different whether a
user is currently logged in or browsing your site as a guest.

To indicate blocks of content that are *not* to be cached, wrap
them in ``<!--nocache--> <!--/nocache-->`` like so::

    <!--nocache-->
    <?php if ($this->Session->check('User.name')) : ?>
        Welcome, <?php echo h($this->Session->read('User.name')); ?>.
    <?php else: ?>
        <?php echo $html->link('Login', 'users/login')?>
    <?php endif; ?>
    <!--/nocache-->

.. note::

    You cannot use ``nocache`` tags in elements.  Since there are no callbacks
    around elements, they cannot be cached.

It should be noted that once an action is cached, the controller method for the
action will not be called.  When a cache file is created, the request object,
and view variables are serialized with PHP's ``serialize()``.

.. warning::

    If you have view variables that contain un-serializable content such as
    SimpleXML objects, resource handles, or closures you might not be able to
    use view caching.

Clearing the Cache
==================

It is important to remember that the CakePHP will clear a cached view
if a model used in the cached view is modified. For example, if a
cached view uses data from the Post model, and there has been an
INSERT, UPDATE, or DELETE query made to a Post, the cache for that
view is cleared, and new content is generated on the next request.

.. note::

    This automatic cache clearing requires the controller/model name to be part
    of the URL. If you've used routing to change your urls this feature will not
    work.

If you need to manually clear the cache, you can do so by calling
Cache::clear(). This will clear **all** cached data, excluding
cached view files. If you need to clear the cached view files, use
``clearCache()``.


.. meta::
    :title lang=en: CacheHelper
    :description lang=en: The Cache helper assists in caching entire layouts and views, saving time repetitively retrieving data.
    :keywords lang=en: cache helper,view caching,cache action,cakephp cache,nocache,clear cache