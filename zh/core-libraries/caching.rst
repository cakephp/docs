缓存
#######

缓存经常用来缩短创建或读取其它资源的时间。缓存经常用来使读取昂贵的资源不那么昂贵。
你可以容易地把不经常变化的昂贵的查询、或者对远程网络服务的访问的结果，保存在缓存
中。一旦在缓存中，从缓存中重新读取保存的资源就比访问远程资源的代价要小多了。

CakePHP 中的缓存主要是由 :php:class:`Cache` 类来帮助（处理）的。该类有一组静态
方法，提供了统一的 API 来处理不同类型的缓存实现。CakePHP 带有几个内置的缓存引擎，
并提供了简单的系统来实现你自己的缓存系统。内置的缓存引擎为:

* ``FileCache`` 文件缓存是使用本地文件的简单缓存。这是最慢的缓存引擎，且没有为
  原子化操作提供那么多功能。不过，既然硬盘存储通常都相当便宜，使用文件存储大的
  对象、或者不经常写的元素，很管用。这是2.3+版本的默认缓存引擎。
* ``ApcCache`` APC 缓存使用 PHP 的 `APC <http://php.net/apc>`_ 扩展。这个扩展用
  网站服务器上的共享内存来保存对象。这使它非常快，而且能够提供原子化的读/写功能。
  默认情况下 CakePHP 2.0-2.2 会使用该缓存引擎，如果可用的话。
* ``Wincache`` Wincache 使用 `Wincache <http://php.net/wincache>`_ 扩展。
  Wincache 在功能和性能上类似于 APC，但针对 Windows 和 微软的IIS 做了优化。
* ``XcacheEngine`` `Xcache <http://xcache.lighttpd.net/>`_ 是一个 PHP 扩展，提供
  类似 APC 的功能。
* ``MemcacheEngine`` 使用 `Memcache <http://php.net/memcache>`_ 扩展。Memcache
  提供了非常快速的缓存系统，可以分布于很多台服务器，而且提供原子化操作。
* ``MemcachedEngine`` 使用 `Memcached <http://php.net/memcached>`_ 扩展。它也与
  memcache 接口，但提供更好的性能。
* ``RedisEngine`` 使用 `phpredis <https://github.com/nicolasff/phpredis>`_ 扩展。
  Redis 类似于 memcached，提供了快速和可持久化的缓存系统，也提供原子化操作。

.. versionchanged:: 2.3
    FileEngine 总是默认的缓存引擎。曾经有些人在 CLI + web 两种环境中都遇到困难而
    无法正确设置和部署 APC。使用文件（缓存），应当使得配置 CakePHP 对新的开发人员
    来说更简单了。

.. versionchanged:: 2.5
    增加了Memcached引擎，Memcache引擎作废了。

不论你选择使用哪种缓存引擎，你的应用程序都是以一致的方式与 :php:class:`Cache` 类
交互。这意味着你可以随着应用程序的增长而容易地替换缓存引擎。除了 
:php:class:`Cache` 类，:doc:`/core-libraries/helpers/cache` 允许缓存整个页面，这
也能极大地改善性能。

配置Cache类
=======================

配置Cache类可以在任何地方进行，但通常你应当在 ``app/Config/bootstrap.php`` 中配置
Cache类。你可以设置任意数量的缓存配置，使用任意缓存引擎的组合。CakePHP在内部使用
两个缓存配置，这两个配置在 ``app/Config/core.php`` 中设置。如果你使用APC或者
Memcache，你一定要为核心缓存设置唯一的键。这将防止多个应用程序互相覆盖缓存的数据。

使用多个缓存配置可以帮助减少你需要调用 :php:func:`Cache::set()` 的次数，同时集中
所有的缓存设置。使用多个配置也让你可以根据需要逐步渐进地改变存储。

.. note::

    你必须指定使用哪个引擎。**不** 会以文件（缓存）为默认值。

例如::

    Cache::config('short', array(
        'engine' => 'File',
        'duration' => '+1 hours',
        'path' => CACHE,
        'prefix' => 'cake_short_'
    ));

    // 长期
    Cache::config('long', array(
        'engine' => 'File',
        'duration' => '+1 week',
        'probability' => 100,
        'path' => CACHE . 'long' . DS,
    ));

把上面的代码放在 ``app/Config/bootstrap.php`` 中，你就多了两个缓存配置。这两个
配置的名称'short'或'long'会作为 :php:func:`Cache::write()` 和 
:php:func:`Cache::read()` 方法的 ``$config`` 参数。

.. note::

    当使用文件引擎时，你也许要使用 ``mask`` 选项，来保证缓存文件会有正确的权限。

.. versionadded:: 2.4

    在调试模式下，当使用文件引擎时，会自动创建不存在的目录，以避免不必要的错误。

为缓存创建存储引擎
===================================

你可以在 ``app/Lib`` 目录以及在插件中用 ``$plugin/Lib`` 目录中提供自定义的 
``Cache`` 适配器。App/插件的缓存引擎也可以重载核心的引擎。缓存适配器必须在cache
目录中。如果你有一个叫做 ``MyCustomCacheEngine`` 的缓存引擎，它就会被放在 
``app/Lib/Cache/Engine/MyCustomCacheEngine.php`` 作为 app/libs，或者在 
``$plugin/Lib/Cache/Engine/MyCustomCacheEngine.php`` 作为插件的一部分。插件的缓存
配置需要使用插件的点语法。::

    Cache::config('custom', array(
        'engine' => 'CachePack.MyCustomCache',
        // ...
    ));

.. note::

    App和插件的缓存引擎应当在 ``app/Config/bootstrap.php`` 文件中配置。如果你试图
    在core.php中配置，它们就不会正常工作。

自定义的缓存引擎必须扩展 :php:class:`CacheEngine` 类，该类定义了一些抽象的方法，
也提供了一些初始化方法。

CacheEngine必需的API为

.. php:class:: CacheEngine

    Cache类使用的所有缓存引擎的基类。

.. php:method:: write($key, $value, $config = 'default')

    :return: 成功与否的布尔值。

    将一个键的值写入缓存，可选的字符串参数$cofig指定要写入的（缓存）配置的名称。

.. php:method:: read($key, $config = 'default')

    :return: 缓存的值，或者在失败时为false。

    从缓存读取一个键，可选的字符串参数$cofig指定要读取的（缓存）配置的名称。
    返回false表明该项已经过期了或者不存在。

.. php:method:: delete($key, $config = 'default')

    :return: 成功时为布尔值true。

    从缓存中删除一个键，可选的字符串参数$cofig指定要删除的（缓存）配置的名称。
    返回false，表明该项不存在或者无法删除。

.. php:method:: clear($check)

    :return: 成功时为布尔值true。

    从缓存删除所有键。如果$check为true，你应当验证每个值实际上已经过期。

.. php:method:: clearGroup($group)

    :return: 成功时为布尔值true。

    从缓存删除所有属于同一组的键。

.. php:method:: decrement($key, $offset = 1)

    :return: 成功时为减一后的值，否则为布尔值false。

    把键对应的数减一，并返回减一后的值。

.. php:method:: increment($key, $offset = 1)

    :return: 成功时为增一后的值，否则为布尔值false。

    把键对应的数增一，并返回增一后的值。

.. php:method:: gc()

    不要求，但在资源过期时用来进行清理。文件引擎用它来删除包含过期内容的文件。

用缓存来存储常用的查询结果
=========================================

你可以把不经常变化的结果、或者被大量读取的结果放入缓存，从而极大地改善应用程序的
性能。一个绝佳的例子是从 :php:meth:`Model::find()` 返回的结果。一个用缓存保存结果
的方法可以象下面这样::

    class Post extends AppModel {

        public function newest() {
            $result = Cache::read('newest_posts', 'long');
            if (!$result) {
                $result = $this->find('all', array('order' => 'Post.updated DESC', 'limit' => 10));
                Cache::write('newest_posts', $result, 'long');
            }
            return $result;
        }
    }

你可以改进上述代码，把读取缓存的逻辑移到一个行为中，从缓存读取，或者运行关联模型
的方法。不过这可以作为你的一个练习。

在 2.5 版本中，你可以用 :php:meth:`Cache::remember()` 更简单地实现上面的代码。
假设你使用PHP 5.3或更高版本，使用 ``remember()`` 方法就象这样::

    class Post extends AppModel {

        public function newest() {
            $model = $this;
            return Cache::remember('newest_posts', function() use ($model){
                return $model->find('all', array(
                    'order' => 'Post.updated DESC',
                    'limit' => 10
                ));
            }, 'long');
        }
    }

使用缓存保存计数
=============================

各种东西的计数很容易在缓存中保存。例如，一项竞赛中剩余‘空位’的简单倒计数，就
可以保存在缓存中。Cache类提供了原子化的方式来轻易地增/减计数器的值。原子化操作对
这些值很重要，因为这减少了竞争的风险，即两个用户同时把值减一，导致不正确的值。

在设置一个整数值之后，你可以用 :php:meth:`Cache::increment()` 和 
:php:meth:`Cache::decrement()` 方法来对它进行操作::

    Cache::write('initial_count', 10);

    // 然后
    Cache::decrement('initial_count');

    // 或者
    Cache::increment('initial_count');

.. note::

    增一和减一无法用于文件引擎。你应当使用APC、Redis或者Memcache。


使用分组
============

.. versionadded:: 2.2

有时你想要把多个缓存项标记为属于某个组或者命名空间。这是一个常见的需求，每当同一
组内的所有项共享的某些信息发生变化时，就使这些键一起无效。这可以通过在缓存配置中
声明分组实现::

    Cache::config('site_home', array(
        'engine' => 'Redis',
        'duration' => '+999 days',
        'groups' => array('comment', 'post')
    ));

比方说，你要把为主页生成的HTML保存在缓存中，不过每次当一个评论或帖子添加到数据库
中时，又要自动使该缓存无效。增加了分组 ``comment`` 和 ``post`` 之后，在效果上我们
就把存入这个缓存配置的任意键标记上这两个组的名字。

例如，每添加一个新的帖子，我们可以让缓存引擎删除所有与 ``post`` 分组相联系的项::

    // Model/Post.php

    public function afterSave($created, $options = array()) {
        if ($created) {
            Cache::clearGroup('post', 'site_home');
        }
    }

.. versionadded:: 2.4

:php:func:`Cache::groupConfigs()` 可以用来读取分组和配置之间的映射，即，具有相同
的组::

    // Model/Post.php

    /**
     * 前一个例子的另一种写法，清除所有具有相同分组的缓存配置
     */
    public function afterSave($created, $options = array()) {
        if ($created) {
            $configs = Cache::groupConfigs('post');
            foreach ($configs['post'] as $config) {
                Cache::clearGroup('post', $config);
            }
        }
    }

分组是在使用相同引擎和相同前缀的所有缓存配置之间共享的。如果你使用分组，并想利用
分组的删除，就为你所有的（缓存）配置选择一个共用的前缀。

缓存API
=========

.. php:class:: Cache

    CakePHP中的Cache类为多个后端缓存系统提供了一个通用的前端。不同的缓存配置和
    引擎可以在app/Config/core.php中设置。

.. php:staticmethod:: config($name = null, $settings = array())

    ``Cache::config()`` 方法用来创建额外的缓存配置。这些额外的配置可以有不同于
    默认缓存配置的时间段、引擎、路径或前缀。

.. php:staticmethod:: read($key, $config = 'default')

    ``Cache::read()`` 方法用来从 ``$config`` 配置读取存储在 ``$key`` 键的缓存的值。
    如果$config为null，则会使用默认配置。如果是合法的缓存，``Cache::read()`` 方法
    会返回缓存的值，如果缓存已过期或不存在，就返回 ``false``。缓存的内容的值也许
    会为false，所以一定要使用严格的比较符 ``===`` 或者 ``!==``。

    例如::

        $cloud = Cache::read('cloud');

        if ($cloud !== false) {
            return $cloud;
        }

        // 生成数据 cloud
        // ...

        // 在缓存中保存数据
        Cache::write('cloud', $cloud);
        return $cloud;


.. php:staticmethod:: write($key, $value, $config = 'default')

    ``Cache::write()`` 方法会把$value写入缓存。之后你可以通过 ``$key`` 来读取或
    删除它。你也可以指定一个可选的（缓存）配置来保存要缓存的值。如果 ``$config`` 
    没有指定，默认（配置）就会被使用。``Cache::write()`` 方法可以保存任意类型的
    对象，很适合保存模型 find 方法调用的结果::

        if (($posts = Cache::read('posts')) === false) {
            $posts = $this->Post->find('all');
            Cache::write('posts', $posts);
        }

    使用 ``Cache::write()`` 和 ``Cache::read()`` 方法，可以很容易地减少访问数据库
    读取文章的次数。

.. php:staticmethod:: delete($key, $config = 'default')

    ``Cache::delete()`` 方法让你从缓存的存储中完全删除一个缓存的对象。

.. php:staticmethod:: set($settings = array(), $value = null, $config = 'default')

    ``Cache::set()`` 方法让你暂时对一个操作（通常为读或写）改编缓存配置的设置。
    如果你用 ``Cache::set()`` 方法为写操作改变了设置，在读取该数据之前你也应当
    使用 ``Cache::set()`` 方法。如果你不这么做，读取该缓存键时，就会使用默认
    设置。::

        Cache::set(array('duration' => '+30 days'));
        Cache::write('results', $data);

        // 之后

        Cache::set(array('duration' => '+30 days'));
        $results = Cache::read('results');

    如果你发现自己不断地调用 ``Cache::set()`` 方法，那么也许你应当创建一个新的
    :php:func:`Cache::config()`。这就不用调用 ``Cache::set()`` 方法了。

.. php:staticmethod:: increment($key, $offset = 1, $config = 'default')

    原子化地增大存储在缓存引擎中的值。很适合用于修改计数器或者信号灯（semaphore）
    类型的值。

.. php:staticmethod:: decrement($key, $offset = 1, $config = 'default')

    原子化地减小存储在缓存引擎中的值。很适合用于修改计数器或者信号灯（semaphore）
    类型的值。

.. php:staticmethod:: clear($check, $config = 'default')

    将一个缓存配置所有缓存的值删除。对象Apc、Memcache和Wincache这样的引擎，用缓存
    配置的前缀来删除缓存项。请确保不同的引擎配置使用不同的前缀。

.. php:method:: clearGroup($group, $config = 'default')

    :return: 当成功时为布尔值true。

    从缓存删除属于同一分组的所有键。

.. php:staticmethod:: gc($config)

    垃圾回收缓存配置中的项。这主要被FileEngine使用。任何需要手动回收缓存数据的
    缓存引擎都应当实现该方法。


.. php:staticmethod:: groupConfigs($group = null)

    :return: 分组及其相关联的配置名称的数组。

    读取分组名称和（缓存）配置的映射。

.. php:staticmethod:: remember($key, $callable, $config = 'default')

    提供简单的方法来实现通读缓存。如果缓存的键存在，就会返回（相应的值）。如果键
    不存在，则回调（callable）会被调用，结果保存在缓存中提供的键上。

    例如，你经常要缓存查询结果。你可以使用 ``remember()`` 方法来简化这一过程。
    假设你使用PHP 5.3或更新的版本::

        class Articles extends AppModel {
            function all() {
                $model = $this;
                return Cache::remember('all_articles', function() use ($model){
                    return $model->find('all');
                });
            }
        }

    .. versionadded:: 2.5
        在2.5版本中增加了remember()方法。


.. meta::
    :title lang=zh: Caching
    :keywords lang=zh: uniform api,xcache,cache engine,cache system,atomic operations,php class,disk storage,static methods,php extension,consistent manner,similar features,apc,memcache,queries,cakephp,elements,servers,memory
