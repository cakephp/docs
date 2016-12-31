Cache
#####

Der Cache-Helper ist hilfreich um ganze Layouts und Views zu cachen und
damit häufig abgefragte Daten schneller an den Benutzer zu senden. View
Caching in Cake legt geparste Layouts und Views temporär in der Cache
Engine der Wahl ab. Dabei ist zu beachten, dass der Cache-Helper ganz
anders arbeitet als andere Helper. Er hat keine Methoden, die direkt
aufgerufen werden können. Dafür wird ein View mit sogenannten Cache-Tags
markiert um anzugeben, welcher Teil des Inhalts gecached werden soll.

Wenn eine URL angefragt wird, überprüft Cake, ob dieser Request-String
bereits gecached worden ist. Wenn ja, wird der Rest des URL-Parsings
übersprungen. Alle nicht gecachten Blocks werden normal verarbeitet und
der View wird präsentiert. Damit wird eine große Einsparnis an
Verarbeitungszeit erreicht, da nur minimaler Code ausgeführt wird. Falls
der View nicht gecached ist, oder die Cachedauer abgelaufen ist, wird
die Anfrage normale bearbeitet.

Caching Allgemein
=================

Caching verfolgt das Ziel die Serverlast, durch das Ablegen so genannter
temporärer Dateien, zu reduzieren. Zum Beispiel wäre es sinnvoll, die
Ergebnisse zeitaufwändiger Datenbankabfragen zu speichern, so dass diese
nicht bei jedem Seitenaufruf erneut aufgerufen werden müssen.

In diesem Sinne ist Caching nicht zum permanenten Speichern gedacht und
sollte dementsprechend niemals dazu verwendet werden. Außerdem sollten
ausschließlich Dinge "gecached" werden, die später erneut generiert
werden können.

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
