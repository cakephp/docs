配置
####

配置 CakePHP 应用程序简直是小菜一碟。在安装完 CakePHP 后，创建一个基本的 web
应用只需设置数据库配置。

当然，还有其它可选的配置步骤可以采用，来充分利用 CakePHP 的灵活架构。可以容易地
对继承自 CakePHP 核心的功能添加(新的功能)，配置额外的/不同的网址(*URL*)映射(路由
)，以及定义额外/不同的词形变化(*inflections*)。

.. index:: database.php, database.php.default
.. _database-configuration:

数据库配置
==========

CakePHP 期待的数据库配置信息位于 ``app/Config/database.php`` 文件中。示例数据库
配置文件在 ``app/Config/database.php.default`` 。一个完成的配置应该看起来像这样::

    class DATABASE_CONFIG {
        public $default = array(
            'datasource'  => 'Database/Mysql',
            'persistent'  => false,
            'host'        => 'localhost',
            'login'       => 'cakephpuser',
            'password'    => 'c4k3roxx!',
            'database'    => 'my_cakephp_project',
            'prefix'      => ''
        );
    }

(默认情况下)会使用 $default 连接数组，除非用模型的 ``$useDbConfig`` 属性指定了另
外一个连接。例如，如果应用程序除了默认的数据库还有一个额外的遗留数据库，可以创建
一个结构类似于 $default 数组的新的 $legacy 数据库连接数组，然后在适当的模型中设
置 ``public $useDbConfig = 'legacy';``，就可以使用遗留数据库了。

填写配置数组中的键/值对以尽可能满足需求。

datasource
    该配置数组的数据源名称。例如：Database/Mysql、Database/Sqlserver、
    Database/Postgres、Database/Sqlite。可以使用 :term:`plugin syntax` 指定要
    使用的插件数据源。
persistent
    是否使用连接数据库的持久化连接。当使用 SQLServer 时，应当不要启用持久化连接，
    因为这会造成诊断崩溃的困难。
host
    数据库服务器的主机名(或IP地址)。
login
    账号的用户名。
password
    账号的密码。
database
    该连接要使用的数据库名称。
prefix (*可选*)
    数据库中每个表名的前缀字符串。如果表没有前缀，设置为空字符串。
port (*可选*)
    用于连接服务器的 TCP 端口或 Unix 套接字(*socket*)。
encoding
    指定了发送 SQL 语句到服务器使用的字符集。对除了 DB2 数据库以外的所有数据库，
    默认使用数据库的默认编码。如果对 mysql/mysqli 连接想使用 UTF-8 编码，必须
    使用不带连字符的'utf8'。
schema
    用于 PostgreSQL 数据库设置，指定使用哪个 schema。
unix_socket
    用于支持通过 unix 套接字(*socket*)文件连接的驱动程序。如果使用 PostgreSQL
    数据库，并且想使用 unix 套接字，需要将 host 键留空。
ssl_key
    SSL 密钥(*SSL key*)文件的路径(仅为 MySQL 所支持，要求 PHP 5.3.7+)。
ssl_cert
    SSL 证书(*SSL certificate*)文件的路径(仅为 MySQL 所支持，要求 PHP 5.3.7+)。
ssl_ca
    SSL 证书颁发机构(SSL certificate authority)文件的路径(仅为 MySQL 所支持，
    要求 PHP 5.3.7+)。
settings
    一个包含键值对的数组，在建立连接时应当作为 ``SET`` 命令发送到数据库服务器。
    该选项当前只被 Mysql、Postgres 和 Sqlserver 所支持。

.. versionchanged:: 2.4
    参数 ``settings`` 、 ``ssl_key`` 、 ``ssl_cert`` 和 ``ssl_ca`` 是在 2.4 版本
    中新增的。

.. note::

    前缀设置作用于表，**而不是** 模型。举个例子，如果为 Apple 和 Flavor 模型创建
    了一个连接表，应当命名为 prefix\_apples\_flavors(**而不是**
    prefix\_apples\_prefix\_flavors)，前缀设置应设为 'prefix\_'。

在这个时候，你也许可以看下 :doc:`/getting-started/cakephp-conventions` 。对表(
以及某些字段)的正确命名让你自动获得一些功能，而且避免配置。例如，如果将表命名为
big\_boxes，模型命名为 BigBox，控制器命名为 BigBoxesController，那这一切就能够自动协作了。按照约定，数据库表名应当使用下划线
分隔的小写复数形式 — 例如：bakers、pastry\_stores 和 savory\_cakes。

.. todo::

    为不同数据库供应商的特定选项增加信息，比如 Microsoft SQL Server、PostgreSQL 和 MySQL。

额外的类路径
============

偶尔，在同一个系统上的应用程序之间共享 MVC 类库是很有用的。如果想要在两个应用
程序间使用同一个控制器，可以使用 CakePHP 的 bootstrap.php 把这些额外的类引入。

在 bootstrap.php 使用 :php:meth:`App::build()` 可以定义额外的路径，CakePHP 就会
在这些路径中搜寻类::

    App::build(array(
        'Model' => array(
            '/path/to/models',
            '/next/path/to/models'
        ),
        'Model/Behavior' => array(
            '/path/to/behaviors',
            '/next/path/to/behaviors'
        ),
        'Model/Datasource' => array(
            '/path/to/datasources',
            '/next/path/to/datasources'
        ),
        'Model/Datasource/Database' => array(
            '/path/to/databases',
            '/next/path/to/database'
        ),
        'Model/Datasource/Session' => array(
            '/path/to/sessions',
            '/next/path/to/sessions'
        ),
        'Controller' => array(
            '/path/to/controllers',
            '/next/path/to/controllers'
        ),
        'Controller/Component' => array(
            '/path/to/components',
            '/next/path/to/components'
        ),
        'Controller/Component/Auth' => array(
            '/path/to/auths',
            '/next/path/to/auths'
        ),
        'Controller/Component/Acl' => array(
            '/path/to/acls',
            '/next/path/to/acls'
        ),
        'View' => array(
            '/path/to/views',
            '/next/path/to/views'
        ),
        'View/Helper' => array(
            '/path/to/helpers',
            '/next/path/to/helpers'
        ),
        'Console' => array(
            '/path/to/consoles',
            '/next/path/to/consoles'
        ),
        'Console/Command' => array(
            '/path/to/commands',
            '/next/path/to/commands'
        ),
        'Console/Command/Task' => array(
            '/path/to/tasks',
            '/next/path/to/tasks'
        ),
        'Lib' => array(
            '/path/to/libs',
            '/next/path/to/libs'
        ),
        'Locale' => array(
            '/path/to/locales',
            '/next/path/to/locales'
        ),
        'Vendor' => array(
            '/path/to/vendors',
            '/next/path/to/vendors'
        ),
        'Plugin' => array(
            '/path/to/plugins',
            '/next/path/to/plugins'
        ),
    ));

.. note::

    所有额外路径的配置应该在程序的 bootstrap.php 最开始定义。这样会确保应用程序
    的其余部分可以使用这些路径。


.. index:: core.php, configuration

核心配置
========

每个 CakePHP 应用程序包含一个配置文件 ``app/Config/core.php`` ，决定 CakePHP 的
内部行为。这个文件是一个 Configure 类变量和常量定义的集合，决定应用程序的行为。
在我们深入这些特定的变量之前，你需要熟悉 :php:class:`Configure`，CakePHP的配置
注册表类。

CakePHP 核心配置
----------------

:php:class:`Configure` 类用来管理一系列 CakePHP 核心配置变量。这些变量可在
``app/Config/core.php`` 文件中找到。下面是每个变量的描述、以及如何影响到程序的。

debug
    改变 CakePHP 调试输出。

    * 0 = 生产模式。无输出。
    * 1 = 显示错误和警告。
    * 2 = 显示错误，警告和 SQL 语句。 [只有在视图或布局中添加
      $this->element('sql\_dump') 才会显示 SQL 日志。]

Error
    配置处理应用程序错误的错误处理器。默认使用
    :php:meth:`ErrorHandler::handleError()`。当 debug > 0 时，使用
    :php:class:`Debugger` 显示错误，而当 debug = 0 时，使用 :php:class:`CakeLog`
    将错误记录在日志中。

    子键:

    * ``handler`` - callback - 处理错误的回调方法。可设置为任何回调类型，包括
      匿名函数。
    * ``level`` - int - 要捕获的错误等级。
    * ``trace`` - boolean - 是否在日志文件中记录错误的堆栈跟踪(*stack trace*)
      信息。

Exception
    配置异常处理程序用于未捕获的异常。默认情况下，会使用
    ErrorHandler::handleException()。对异常会显示一个 HTML 页面。当 debug > 0 时，
    像 Missing Controller 这样的框架错误会显示出来。而当 debug = 0 时，框架错误
    被强制转换为通常的 HTTP 错误。欲知更多异常处理的信息，请参见
    :doc:`exceptions` 一节。

.. _core-configuration-baseurl:

App.baseUrl
    如果你不想或者无法在你的服务器上运行 mod\_rewrite (或者一些其它兼容模块），
    你就要使用 CakePHP 的内置美观网址了。在 ``/app/ConfigScore.php`` 中，对下面
    这行去掉注释::

        Configure::write('App.baseUrl', env('SCRIPT_NAME'));

    也要删除这些 .htaccess 文件::

        /.htaccess
        /app/.htaccess
        /app/webroot/.htaccess


    这会让网址看起来象
    www.example.com/index.php/controllername/actionname/param rather
    而不是 www.example.com/controllername/actionname/param.

    如果你把 CakePHP 安装到不是 Apache 的 web 服务器上，你可以从
    :doc:`/installation/url-rewriting` 一节找到在其它服务器上使网址重写运行的
    说明。
App.encoding
    定义应用程序使用的编码。该编码用来生成布局(*layout*)中的字符集，和编码实体。
    这应当符合为数据库指定的编码值。
Routing.prefixes
    如果想要使用象 admin 这样的 CakePHP 前缀路由(*prefixed routes*)，去掉对该
    定义的注释。设置该变量为你想要使用的路由的前缀名称数组。对此后面有更多的描述。
Cache.disable
    当设置为 true 时，整个网站的持久化缓存会被禁用。这会导致所有的
    :php:class:`Cache` 读/写失败。
Cache.check
    如果设置为 true，启用视图缓存。仍然需要在控制器中启用，但是该变量开启了这些
    设置的检测。
Session
    包含设置数组，用于会话(*session*)配置。defaults 键用于定义会话的默认预设，
    这里声明的任何设置会覆盖默认配置的设置。

    子键

    * ``name`` - 要使用的，cookie 的名字。默认为'CAKEPHP'
    * ``timeout`` - 要会话存在的分钟数。这个超时是由 CakePHP 处理的。
    * ``cookieTimeout`` - 要会话 coookie 存在的分钟数。
    * ``checkAgent`` - 在启动会话时，要检查用户代理吗？在处理旧版 IE、Chrome
      Frame 或者某些网络浏览设备以及 AJAX 时，你或许想要设置该值为 false。
    * ``defaults`` - 会话作为基础使用的默认配置集。有四种内置(默认配置集): php、
      cake、cache、database。
    * ``handler`` - 可以用来启用自定义会话处理器。期待可用于
      `session_save_handler` 的回调数组。使用该选项会自动添加
      `session.save_handler` 到 ini 数组。
    * ``autoRegenerate`` - 启用该设置，就启用了会话的自动延续，以及频繁变化的
      sessionid。参看 :php:attr:`CakeSession::$requestCountdown`。
    * ``ini`` - 要设置的额外 ini 值的关联数组。

    内置默认值为：

    * 'php' - 使用在 php.ini 中定义的设置。
    * 'cake' - 在 CakePHP 的 /tmp 目录中保存会话文件。
    * 'database' - 使用 CakePHP 的数据库会话。
    * 'cache' - 使用 Cache 类保存会话。

    要定义自定义会话处理器，把它保存在
    ``app/ModelSDatasource/Session/<name>.php`` 中。确保这个类实现了
    :php:interface:`CakeSessionHandlerInterface`，并设置 Session.handler 为
    <name>。

    要使用数据库会话，用 cake 控制台命令运行 ``app/ConfigSSchema/sessions.php``
    数据结构： ``cake schema create Sessions``

Security.salt
    用于 安全哈希(*security hashing*)的一个随机字符串。
Security.cipherSeed
    随机数字字符串(只允许数字)，用来加密/解密字符串。
Asset.timestamp
    在使用正确的助件时，在资源文件网址(CSS、JavaScript、Image)末尾附加特定文件
    最后修改的时间戳。

    合法值：

    * (boolean) false - 什么也不做(默认)
    * (boolean) true - 当 debug > 0 时附加时间戳
    * (string) 'force' - 当 debug >= 0 时附加时间戳
Acl.classname, Acl.database
    用于 CakePHP 的访问控制列表(Access Control Access)功能的常数。欲知详情，参见
    访问控制列表一章。

.. note::
    在 core.php 中也有缓存配置 — 稍安勿躁，后面会讲到。

:php:class:`Configure` 类可以随时用来读写核心配置设置。这很方便，例如，在应用
程序中要对有限的一部分逻辑启用 debug 设置。

配置常量
--------

尽管大部分配置选项由 Configure 类处理，还是有一些 CakePHP 在运行时使用的常量。

.. php:const:: LOG_ERROR

    错误常量。用于区分错误的日志记录和调试。当前 PHP 支持 LOG\_DEBUG。

核心缓存配置
------------

CakePHP 在内部使用两个缓存配置，``_cake_model_`` 和 ``_cake_core_``。
``_cake_core_`` 用于保存文件路径和对象位置。``_cakeMmodel_`` 用于保存数据结构
描述和数据源的源列表。建议对这些配置使用象 APC 或 Memcached 这样的高速缓存存储，
因为它们会在每次请求时读取。默认情况下，当 debug 大于 0 时这两个配置都是每 10 秒
就会过期。

就象所有缓存在 :php:class:`Class` 中的缓存数据一样，可以使用
:php:meth:`Cache::clear()` 清除数据。

Configure 类
============

.. php:class:: Configure

尽管在 CakePHP 中很少需要配置，有时对应用程序有自己的配置规则还是有用的。过去你
也许在某些文件中定义变量或常量来定义自定义配置值。这么做迫使你在每次需要这些值时
必须引入那个配置文件。

CakePHP 的 Configure 类可以用来保存和读取应用程序或运行时相关的值。当心，这个类
允许在其中保存任何东西，然后在代码的任何部分使用它：明显诱使人打破作为 CakePHP
的设计目的的 MVC 模式。Configure 类的主要目标是保持变量集中在一起，可在许多对象
之间共享。记得尽量保持“约定重于配置”，你就不会打破我们设定好的 MVC 结构了。

这个类可以在应用程序的任何地方以静态方式调用::

    Configure::read('debug');

.. php:staticmethod:: write($key, $value)

    :param string $key: 要写入的键，可以是 :term:`dot notation` 值。
    :param mixed $value: 要存储的值。

    用 ``write()`` 在应用程序的配置中存储数据::

        Configure::write('Company.name','Pizza, Inc.');
        Configure::write('Company.slogan','Pizza for your body and soul');

    .. note::

        ``$key`` 参数中使用的 :term:`dot notation` 可以用来把配置设置组织成符合
        逻辑的分组。

    上面的例子也可以写成一个调用::

        Configure::write(
            'Company',
            array(
                'name' => 'Pizza, Inc.',
                'slogan' => 'Pizza for your body and soul'
            )
        );

    可以使用 ``Configure::write('debug', $int)`` 来动态切换调试和生产模式。这对
    与 AMF 或 SOAP 的交互尤其方便，因为调试信息回引起解析的问题。

.. php:staticmethod:: read($key = null)

    :param string $key: 读取的键名，可以是 :term:`dot notation` 值。

    用来从应用程序中读取配置数据。默认是 CakePHP 重要的 debug 值。如果提供键，则
    返回数据。使用上面的 write() 的例子，可以读取那个数据::

        Configure::read('Company.name');    //得到：'Pizza, Inc.'
        Configure::read('Company.slogan');  //得到：'Pizza for your body
                                            //and soul'

        Configure::read('Company');

        //得到：
        array('name' => 'Pizza, Inc.', 'slogan' => 'Pizza for your body and soul');

    如果$key为null，返回Configure中所有的值。如果对应制定的键$key的值不存在，则
    返回null。

.. php:staticmethod:: consume($key)

    :param string $key: 读取的键名，可以是 :term:`dot notation` 值。

    从Configure读取并删除键。当你想要合并读取和删除值为单一操作时，这比较有用。

.. php:staticmethod:: check($key)

    :param string $key: 要检测的键。

    检测键/路径是否存在，且值不是 null 。

    .. versionadded:: 2.3
        ``Configure::check()`` 是在 2.3 版本中新增的

.. php:staticmethod:: delete($key)

    :param string $key: 要删除的键，可以是 :term:`dot notation` 值。

    用来从应用程序中的配置中删除信息::

        Configure::delete('Company.name');

.. php:staticmethod:: version()

    返回当前应用程序的 CakePHP 版本。

.. php:staticmethod:: config($name, $reader)

    :param string $name: 附加的读取器(*reader*)的名称。
    :param ConfigReaderInterface $reader:  附加的读取器实例。

    在 Configure 类上附加一个配置读取器。然后附加的读取器就可以加载配置文件。
    欲知如何读取配置文件，请参见 :ref:`loading-configuration-files`。

.. php:staticmethod:: configured($name = null)

    :param string $name: 要检查的读取器的名称，如果为 null，则返回所有附加的
        读取器的列表。

    或者检查指定名称的读取器是否附加了，或者得到附加的读取器列表。

.. php:staticmethod:: drop($name)

    去掉一个连接的读取器对象。


读写配置文件
============

CakePHP 附带两种内置的配置文件读取器。:php:class:`PhpReader` 能够读取 PHP 配置
文件，与 Configure 类之前读取的格式相同。:php:class:`IniReader` 能够读取 ini
配置文件。欲知 ini 文件的更多细节，请参见
`PHP 文档 <http://php.net/parse_ini_file>`_。为了使用核心配置读取器，需要使用
:php:meth:`Configure::config()` 把它附加到 Configure 类上::

    App::uses('PhpReader', 'Configure');
    // 从 app/Config 读取配置文件
    Configure::config('default', new PhpReader());

    // 从其它路径读配置文件。
    Configure::config('default', new PhpReader('/path/to/your/config/files/'));

可以有多个附加到 Configure 类的读取器，每个读取不同的配置文件，或者从不同种类的
来源读取。可以用 Configure 类的一些其它方法与附加的读取器交互。要查看附加了哪些
读取器别名，可以使用 :php:meth:`Configure::configured()` 方法::

    // 得到附加的读取器的别名数组。
    Configure::configured();

    // 检查是否附加了某个特定的读取器
    Configure::configured('default');

也可以删除附加的读取器。``Configure::drop('default')`` 方法会删除默认的读取器
别名。以后任何使用该读取器加载配置文件的企图都会失败。


.. _loading-configuration-files:

加载配置文件
------------

.. php:staticmethod:: load($key, $config = 'default', $merge = true)

    :param string $key: 要加载的配置文件的标识符。
    :param string $config: 配置的读取器的别名。
    :param boolean $merge: 是否要合并读取的文件内容，或者覆盖现有的值。

一旦在 Configure 类上附加了配置读取器，就可以加载配置文件::

    // 使用 'default' 读取器对象加载 my_file.php
    Configure::load('my_file', 'default');

加载的配置文件把它们的数据与 Configure 类中的已有的运行时配置合并。这允许对现有
的运行时配置进行覆盖和增加新值。设置 ``$merge`` 为 true，值就不会覆盖已有的配置
了。

创建或者修改配置文件
--------------------

.. php:staticmethod:: dump($key, $config = 'default', $keys = array())

    :param string $key: 要创建的文件/保存的配置的名称。
    :param string $config: 要保存数据的读取器的名称。
    :param array $keys: 要保存的顶层键的列表。默认为所有键。

把 Configure 类中的所有或部分数据保存到配置读取器支持的文件或存储系统中。序列化
的格式由 $config 指定的附加配置读取器来决定。例如，如果 'default' 适配器为
:php:class:`PhpReader` 类，生成的文件将会是一个 PHP 配置文件，能够由
:php:class:`PhpReader` 类加载。

假定 'default' 读取器是一个 PhpReader 的实例。保存 Configure 类中的所有数据到
文件 `my_config.php` 中::

    Configure::dump('my_config.php', 'default');

仅保存错误处理配置::

    Configure::dump('error.php', 'default', array('Error', 'Exception'));

``Configure::dump()`` 方法可以用来修改或覆盖可以用 :php:meth:`Configure::load()`
方法读取的配置文件。

.. versionadded:: 2.2
    在 2.2 版本中增加了 ``Configure::dump()`` 方法。

存储运行时配置
--------------

.. php:staticmethod:: store($name, $cacheConfig = 'default', $data = null)

    :param string $name: 缓存文件的存储键。
    :param string $cacheConfig: 用来存储配置数据的缓存配置的名称。
    :param mixed $data: 或者为要保存的数据，或者为 null 来保存 Configure 类中的
        所有数据。

也可以保存运行时配置的值，在以后的请中使用。由于配置只记得当前请求的值，如果想要
在以后的请求中使用，需要保存任何修改过的配置信息::

    // 保存当前配置在 'default' 缓存的 'user_1234' 键中。
    Configure::store('user_1234', 'default');

保存的配置数据持久化在 :php:class:`Cache` 类中。这让你可以把配置信息保存在任何可
以与 :php:class:`Cache` 类交互的存储引擎中。

恢复运行时配置
--------------

.. php:staticmethod:: restore($name, $cacheConfig = 'default')

    :param string $name: 要加载的存储键。
    :param string $cacheConfig: 要加载数据的源的缓存配置。

一旦保存了运行时配置，很可能需要恢复它，从而可以再次访问。
``Configure::restore()`` 方法就是做这件事情的::

    // 从缓存恢复运行时配置。
    Configure::restore('user_1234', 'default');

在恢复配置信息时，重要的是要使用保存时使用的相同的键和缓存配置来恢复。恢复的信息
会合并到现有运行时配置上。

创建自己的配置读取器
====================

既然配置读取器是 CakePHP 可以扩展的部分，就可以在应用程序和插件中创建配置读取器。
配置读取器需要实现 :php:interface:`ConfigReaderInterface` 接口。该接口定义了
read 方法为唯一必需的方法。如果你真的喜欢 XML 文件，你可以为应用程序创建一个简单
的 Xml 配置读取器::

    // 在 app/Lib/Configure/MyXmlReader.php 中
    App::uses('Xml', 'Utility');
    class MyXmlReader implements ConfigReaderInterface {
        public function __construct($path = null) {
            if (!$path) {
                $path = APP . 'Config' . DS;
            }
            $this->_path = $path;
        }

        public function read($key) {
            $xml = Xml::build($this->_path . $key . '.xml');
            return Xml::toArray($xml);
        }

        // 在 2.3 版本中，还要求 dump() 方法
        public function dump($key, $data) {
            // 保存数据到文件的代码
        }
    }

在 ``app/Config/bootstrap.php`` 中可以附加这个读取器并使用它::

    App::uses('MyXmlReader', 'Configure');
    Configure::config('xml', new MyXmlReader());
    ...

    Configure::load('my_xml');

.. warning::

        把自定义配置类叫做 ``XmlReader``，可不是个好主意，因为这个类名已经是 PHP
        内部的一个类了：
        `XMLReader <http://php.net/manual/en/book.xmlreader.php>`_

配置读取器的 ``read()`` 方法必需返回一个名为 ``$key`` 的资源包含的配置信息数组。

.. php:interface:: ConfigReaderInterface

    定义读取配置数据和在 :php:class:`Configure` 类中保存配置数据的类使用的接口。

.. php:method:: read($key)

    :param string $key: 要加载的键名或者标识符。

    这个方法应当加载/解析由 ``$key`` 标识的配置数据，并返回文件中的数据数组。

.. php:method:: dump($key, $data)

    :param string $key: 要写入的标识符。
    :param array $data: 要保存的数据。

    这个方法把提供的配置数据保存到 ``$key`` 所指定的键中。

.. versionadded:: 2.3
    在 2.3 版本中增加了 ``ConfigReaderInterface::dump()`` 方法。

.. php:exception:: ConfigureException

    在加载/保存/恢复配置数据时，当发生错误时抛出。:php:interface:`ConfigReaderInterface` 接口的实现在遇到错误时应当抛出这个异常。

内置配置读取器
--------------

.. php:class:: PhpReader

    让你可以读取保存为普通 PHP 文件的配置文件。你可以从 ``app/Config`` 目录中
    读取，也可以用 :term:`plugin syntax` 从插件配置目录中读取。文件 **必须**
    包含 ``$config`` 变量。下面是一个配置文件示例::

        $config = array(
            'debug' => 0,
            'Security' => array(
                'salt' => 'its-secret'
            ),
            'Exception' => array(
                'handler' => 'ErrorHandler::handleException',
                'renderer' => 'ExceptionRenderer',
                'log' => true
            )
        );

    没有 ``$config`` 的文件将会导致 :php:exc:`ConfigureException`。

    在 app/Config/bootstrap.php 中插入如下代码来加载自定义配置文件::

        Configure::load('customConfig');

.. php:class:: IniReader

    让你可以读取保存为普通 .ini 文件的配置文件。ini 文件必须与 PHP 的
    ``parse_ini_file`` 函数兼容，并且从以下改进中获益

    * 点分隔的值会扩展为数组。
    * 象 'on' 和 'off' 这样的类似布尔类型的值会转化为布尔值。

    下面是一个 ini 文件示例::

        debug = 0

        Security.salt = its-secret

        [Exception]
        handler = ErrorHandler::handleException
        renderer = ExceptionRenderer
        log = true

    上述 ini 文件会得到与之前的 PHP 示例相同的最终配置数据。数组结构可以通过点
    分隔的值或者小节创建。小节可以包含点分隔的键来实现更深的嵌套。

.. _inflection-configuration:

词形变化配置
============

CakePHP 的命名约定真的很好 —— 你可以把数据库表命名为 big\_boxes，把模型命名为
BigBox，把控制器命名为 BigBoxesController，所有这一切就可以自动在一起运作。
CakePHP 知道如何把这些联结在一起，是通过单词的单数和复数形式之间的词形变化。

偶尔(特别是对我们操非英语的朋友们)，你会遇到 CakePHP 的 :php:class:`Inflector`
类(把单词变成复数形式、单数形式、驼峰命名形式和下划线分隔形式的类)不像你希望的
那样进行词形变化。如果 CakePHP 认不出你的 Foci 或者 Fish，你可以告诉 CakePHP
这些特殊情形。

加载自定义词形变化
------------------

你可以在 ``app/Config/bootstrap.php`` 文件中用 :php:meth:`Inflector::rules()`
方法加载自定义词形变化::

    Inflector::rules('singular', array(
        'rules' => array(
            '/^(bil)er$/i' => '\1',
            '/^(inflec|contribu)tors$/i' => '\1ta'
        ),
        'uninflected' => array('singulars'),
        'irregular' => array('spins' => 'spinor')
    ));

或者::

    Inflector::rules('plural', array('irregular' => array('phylum' => 'phyla')));

会把提供的规则合并到 lib/Cake/Utility/Inflector.php 中定义的词形变化集合中，新增
的规则具有比核心规则更高的优先级。

引导启动 CakePHP
================

如果有任何额外的配置需求，可以使用 CakePHP 位于 app/Config/bootstrap.php 的引导
文件。这个文件会在 CakePHP 的核心启动引导后执行。

此文件非常适合用于一些常见的启动任务：

- 定义方便的函数。
- 注册全局常量。
- 定义额外的模型、视图和控制器的路径。
- 创建缓存配置。
- 配置词形变化。
- 加载配置文件。

当向引导文件添加内容时请注意保持 MVC 的软件设计模式：也许会忍不住想把格式化函数
放在那里，从而可以在控制器中使用。

请克制住这种想法。以后你会庆幸你在程序其它的部分这么做的。

你也可以考虑把代码放到 :php:class:`AppController` 类中。这个类是应用程序中所有
控制器的父类。:php:class:`AppController` 是一个方便的地方，来使用控制器回调，
以及定义供所有控制器使用的方法。


.. meta::
    :title lang=zh: Configuration
    :keywords lang=zh: finished configuration,legacy database,database configuration,value pairs,default connection,optional configuration,example database,php class,configuration database,default database,configuration steps,index database,configuration details,class database,host localhost,inflections,key value,database connection,piece of cake,basic web
