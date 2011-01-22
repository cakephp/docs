7.2.4 Caching in the Controller
-------------------------------

Any controllers that utilize caching functionality need to include
the CacheHelper in their $helpers array.

::

    var $helpers = array('Cache');

You also need to indicate which actions need caching, and how long
each action will be cached. This is done through the $cacheAction
variable in your controllers. $cacheAction should be set to an
array which contains the actions you want cached, and the duration
in seconds you want those views cached. The time value can be
expressed in a strtotime() format. (ie. "1 hour", or "3 minutes").

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

Cache every action in the controller using a strtotime() friendly
time to indicate Controller wide caching time.

::

    var $cacheAction = "1 hour";

You can also enable controller/component callbacks for cached views
created with ``CacheHelper``. To do so you must use the array
format for ``$cacheAction`` and create an array like the following:
::

    var $cacheAction = array(
        'view' => array('callbacks' => true, 'duration' => 21600),
        'add' => array('callbacks' => true, 'duration' => 36000),
        'index'  => array('callbacks' => true, 'duration' => 48000)
    );

By setting ``callbacks => true`` you tell CacheHelper that you want
the generated files to create the components and models for the
controller. As well as, fire the component initialize, controller
beforeFilter, and component startup callbacks.

p class="note"Setting ``callbacks => true`` partly defeats the
purpose of caching. This is also the reason it is disabled by
default.
