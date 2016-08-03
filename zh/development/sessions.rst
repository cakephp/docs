会话
####

CakePHP 在 PHP 的 ``session`` 扩展之上，提供了封装和一套工具。会话(*session*)让
你可以跨多个请求辨识用户，为特定用户保存持久数据。跟 Cookies 不同，会话不存在于
客户端。在 CakePHP 中通常应当避免使用 ``$_SESSION``，而最好使用 Session 类。


会话的配置
==========

会话的配置保存在 ``Configure`` 中，位于顶级的 ``Session`` 键之下，有一些选项可用：

* ``Session.cookie`` - 改变 session cookie 的名字。

* ``Session.timeout`` - *分钟* 数，之后 CakePHP 的会话处理器(*session handler*)
  会让会话过期。这会影响到 ``Session.autoRegenerate`` (见下)，是由 CakeSession
  类处理的。

* ``Session.cookieTimeout`` - *分钟* 数，之后 session cookie 会过期。如果没有定
  义，会使用和 ``Session.timeout`` 同样的值。这会影响到 session cookie，是由 PHP
  本身处理的。

* ``Session.checkAgent`` - 是否应当对每个请求检查用户代理。如果用户代理不匹配，
  会话就会被销毁。

* ``Session.autoRegenerate`` - 开启该设置，就会打开会话的自动延期，导致频繁变化
  的会话标识(id)。开启该值，会使用会话的 ``Config.countdown`` 值来跟踪请求(数量)。
  一旦倒计数达到 0，会话标识(id)就会重新生成。对于由于安全原因而需要频繁改变会话
  标识的应用程序，这是很好的选项。你可以通过改变
  :php:attr:`CakeSession::$requestCountdown` 来控制重新生成会话所需要的请求数。

* ``Session.defaults`` - 让你可以使用内置默认会话配置之一作为会话配置的基础。

* ``Session.handler`` - 让你定义定制会话处理器。核心的数据库和缓存会话处理器使用
  该选项。这个选项代替了旧版本的 ``Session.save``。后面有会话处理器的更多信息。

* ``Session.ini`` - 让你可以设置配置中的额外的会话 ini 设置。这和
  ``Session.handler`` 一起代替了旧版本的自定义会话处理功能。

* ``Session.cacheLimiter`` - 让你可以定义用于会话 cookie 的缓存控制表头。默认为
  ``must-revalidate``。该选项在 2.8.0 中加入。


当应用程序使用 SSL协议时，CakePHP 默认设置 ``session.cookie_secure`` 为 true。如
果应用程序同时使用 SSL 和非 SSL 协议，你也许会有会话丢失的问题。如果你要在  SSL
和非 SSL 域中访问会话，就应该关闭这个::

    Configure::write('Session', array(
        'defaults' => 'php',
        'ini' => array(
            'session.cookie_secure' => false
        )
    ));

在 2.0 版本中，Session cookie 路径默认是 ``/``，要改变它，可以设置
``session.cookie_path`` ini 标识为应用程序的目录路径::

    Configure::write('Session', array(
        'defaults' => 'php',
        'ini' => array(
            'session.cookie_path' => '/app/dir'
        )
    ));

如果你使用PHP的默认会话设置，注意session.gc_maxlifetime会覆盖你对超时的设置。
默认值为24分钟。在ini设置中改变该设置来获得较长时间的会话::

    Configure::write('Session', array(
        'defaults' => 'php',
        'timeout' => 2160, // 36 小时
        'ini' => array(
            'session.gc_maxlifetime' => 129600 // 36 小时
        )
    ));


内置会话处理器和配置
====================

CakePHP 自带几个内置的会话配置。你可以用这些作为配置的基础，也可以创建完全自定义
配置。要使用默认配置，只需把'defaults' 键设置为你要使用的默认配置的名称。然后你
就可以在 Session 配置中声明任何子设置来覆盖它::

    Configure::write('Session', array(
        'defaults' => 'php'
    ));

上面的代码使用内置的 'php' 会话配置。你象下面这样增强部分或全部配置::


    Configure::write('Session', array(
        'defaults' => 'php',
        'cookie' => 'my_app',
        'timeout' => 4320 //3 天
    ));

上面的代码会覆盖 'php' 会话配置的 timeout 和 cookie 名称。内置的配置如下：

* ``php`` - 以 php.ini 文件中的标准设置保存会话。
* ``cake`` - 保存会话为 ``app/tmp/sessions`` 目录中的文件。当所在的主机不允许你
  写到你的用户目录之外时，这是很好的选项。
* ``database`` - 使用内置的数据库会话。欲知详情，请参看后面的部分。
* ``cache`` - 使用内置的缓存会话。欲知详情，请参看后面的部分。

会话处理器
----------

会话处理器也可以定义在会话配置数组中。定义之后，它们让你可以把各种
``session_save_handler`` 值映射到你要用来保存会话的类或对象。有两种方式使用'处理
器'。第一种是提供含有 5 个 callable 的数组。然后这些 callable 应用于
``session_set_save_handler``::

    Configure::write('Session', array(
        'userAgent' => false,
        'cookie' => 'my_cookie',
        'timeout' => 600,
        'handler' => array(
            array('Foo', 'open'),
            array('Foo', 'close'),
            array('Foo', 'read'),
            array('Foo', 'write'),
            array('Foo', 'destroy'),
            array('Foo', 'gc'),
        ),
        'ini' => array(
            'cookie_secure' => 1,
            'use_trans_sid' => 0
        )
    ));

第二种模式是定义一个 'engine' 键。该键应当是一个实现了
``CakeSessionHandlerInterface`` 接口的类的名称。实现该接口让 CakeSession 可以自
动为处理器映射方法。核心的缓存(*Cache*)和数据库(*Database*)会话的处理器都使用这
种方法来保存会话。处理器的额外设置应当放在处理器数组内。你可以在处理器内读出这些
值。

你也可以在插件内使用会话处理器。只需把引擎设置为类似
``MyPlugin.PluginSessionHandler`` 这样。这会加载和使用应用程序中 MyPlugin 插件内
的 ``PluginSessionHandler`` 类。


CakeSessionHandlerInterface 接口
--------------------------------

该接口用于 CakePHP 中所有的自定义会话处理器，而且可以用来创建自定义的用户会话处
理器。只需在类中实现该接口，并设置创建的类名为 ``Session.handler.engine``。
CakePHP 会尝试从 ``app/Model/Datasource/Session/$classname.php`` 内加载处理器。
所以如果类名为 ``AppSessionHandler``，文件就应当是
``app/Model/Datasource/Session/AppSessionHandler.php``。

数据库会话
----------

会话配置的变化改变了如何定义数据库会话。大多数情况下只需在配置中设置
``Session.handler.model``，以及选择数据库默认值::


    Configure::write('Session', array(
        'defaults' => 'database',
        'handler' => array(
            'model' => 'CustomSession'
        )
    ));

以上代码会告诉 CakeSession 使用内置的 'database' 默认值，并且指定叫做
``CustomSession`` 的模型负责保存会话信息到数据库中。

如果你不需要完全自定义的会话处理器，但是仍然要求以数据库为基础保存会话，可以简化
上述代码为::

    Configure::write('Session', array(
        'defaults' => 'database'
    ));

这样的配置会要求增加一个数据库表，含有至少这些字段::

    CREATE TABLE `cake_sessions` (
      `id` varchar(255) NOT NULL DEFAULT '',
      `data` text,
      `expires` int(11) DEFAULT NULL,
      PRIMARY KEY (`id`)
    );

你也可以使用 schema 命令行用默认应用程序骨架中提供的数据结构文件来创建该表::

    $ Console/cake schema create sessions

缓存会话
--------

Cache 类也可以用来保存会话。这让你可以把会话保存在象 APC、memcache 或者 Xcache
这样的缓存中。使用缓存会话有一些注意事项，如果用光了缓存的容量，随着记录被清理，
会话就会开始过期。

要使用基于缓存的会话，可以这样配置会话::

    Configure::write('Session', array(
        'defaults' => 'cache',
        'handler' => array(
            'config' => 'session'
        )
    ));

这会配置 CakeSession 使用 ``CacheSession`` 类负责保存会话。可以用 'config' 指定
使用哪个缓存配置。默认的缓存配置为 ``'default'``。

设置 ini 指令
=============

内置的默认值试图为会话配置提供共同的基础。你也许还需要调整特定的 ini 设置。
CakePHP 提供了为默认配置和自定义配置自定义 ini 设置的功能。会话设置中的 ``ini``
键让你可以指定单个配置的值。例如你可以用它来控制象 ``session.gc_divisor`` 这样的
设置::

    Configure::write('Session', array(
        'defaults' => 'php',
        'ini' => array(
            'session.gc_divisor' => 1000,
            'session.cookie_httponly' => true
        )
    ));


创建自定义会话处理器
====================

在 CakePHP 中创建自定义会话处理器(*session handler*)是直截了当的。在下面的例子中，
我们会创建一个会话处理器，把会话保存在缓存(apc)和数据库中。这给我们 apc 的高速
IO 的好处，而不必担心缓存满了时会话会逐渐丢失。

首先我们需要创建自定义类，把它放在
``app/Model/Datasource/Session/ComboSession.php``。该类应该象这样::

    App::uses('DatabaseSession', 'Model/Datasource/Session');

    class ComboSession extends DatabaseSession implements CakeSessionHandlerInterface {
        public $cacheKey;

        public function __construct() {
            $this->cacheKey = Configure::read('Session.handler.cache');
            parent::__construct();
        }

        // 从会话读取数据。
        public function read($id) {
            $result = Cache::read($id, $this->cacheKey);
            if ($result) {
                return $result;
            }
            return parent::read($id);
        }

        // 向会话写入数据。
        public function write($id, $data) {
            Cache::write($id, $data, $this->cacheKey);
            return parent::write($id, $data);
        }

        // 销毁一个会话。
        public function destroy($id) {
            Cache::delete($id, $this->cacheKey);
            return parent::destroy($id);
        }

        // 清除过期的会话。
        public function gc($expires = null) {
            Cache::gc($this->cacheKey);
            return parent::gc($expires);
        }
    }

我们的类扩展了内置的 ``DatabaseSession`` 类，所以我们不需要重复它全部的逻辑和行
为。我们用 :php:class:`Cache` 操作包裹每个操作。这让我们从高速的缓存读取会话，而
不必担心填充缓存时会怎样。使用这个会话处理器也容易。在 ``core.php`` 文件中象下面
这样修改会话设置块::

    Configure::write('Session', array(
        'defaults' => 'database',
        'handler' => array(
            'engine' => 'ComboSession',
            'model' => 'Session',
            'cache' => 'apc'
        )
    ));

    // 确保添加 apc 缓存配置
    Cache::config('apc', array('engine' => 'Apc'));

现在应用程序会开始使用自定义会话处理器来读写会话数据了。


.. php:class:: CakeSession

读写会话数据
============

取决于所处的上下文，应用程序有不同的类提供对会话的访问。在控制器中，可以使用
:php:class:`SessionComponent`。在视图中，可以使用 :php:class:`SessionHelper`。在
应用程序的任何部分，也可以使用 ``CakeSession`` 来访问会话。就像会话的其它接口，
``CakeSession`` 提供简单的 CRUD 接口。

.. php:staticmethod:: read($key)

可以使用与 :php:meth:`Set::classicExtract()` 兼容的语法从会话读取值::

    CakeSession::read('Config.language');

.. php:staticmethod:: write($key, $value)

``$key`` 应当是希望写入 ``$value`` 的以点分隔的路径::

    CakeSession::write('Config.language', 'eng');

.. php:staticmethod:: delete($key)

当需要从会话删除数据时，可以使用 delete 方法::

    CakeSession::delete('Config.language');

你还应当阅读 :doc:`/core-libraries/components/sessions` 和
:doc:`/core-libraries/helpers/session`，来了解如何在控制器和视图中访问会话数据。


.. meta::
    :title lang=zh: Sessions
    :keywords lang=zh: session defaults,session classes,utility features,session timeout,session ids,persistent data,session key,session cookie,session data,last session,core database,security level,useragent,security reasons,session id,attr,countdown,regeneration,sessions,config
