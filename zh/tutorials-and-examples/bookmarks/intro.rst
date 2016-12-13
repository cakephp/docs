书签管理应用教程
###################

这篇教程将带领你创建一个简单的书签管理应用。首先，我们要安装CakePHP、
创建数据库，然后使用CakePHP提供的工具快速地把应用建立起来。

下面是你所需要的东西：

#. 一个数据库服务器。 我们将使用MySQL作为数据库服务器，为此你只需要知道如何使用SQL创建一个数据库，之后的工作将由CakePHP接手。
   由于我们使用MySQL，请确保PHP设置中的 ``pdo_mysql`` 已经启用。
#. 基础的PHP知识。

在开始前你应当确保你的PHP版本是足够新的：
.. code-block:: bash

                php -v

你应该至少安装PHP 5.5.9 (CLI)或更高的版本。
你的web服务器中的PHP版本也必须是5.5.9或更高，
最好与PHP命令行界面(CLI)版本一致。
如果你想查看本教程所讲书签应用的已完成版本，请戳这里 `cakephp/bookmarker<https://github.com/cakephp/bookmarker-tutorial>`__ 。下面开始咯！

安装CakePHP
===========

安装CakePHP最容易的方法是使用Composer。
Composer提供了一个从终端或命令行安装CakePHP的简单方法。
首先，如果还没安装Composer，你需要先下载安装它。
如果你已经安装了cURL，只需运行如下命令::

  curl -s https://getcomposer.org/installer | php

或者，你可以从官网下载 ``composer.phar`` ：
`Composer website <https://getcomposer.org/download/>`_

然后，我们要在 **bookmarker** 目录下安装CakePHP应用的骨架。从命令行进入你的安装目录，然后运行如下命令::
  
  php composer.phar create-project --prefer-dist cakephp/app bookmarker

如果你使用Windows系统下载并运行了 `Composer Windows Installer
<https://getcomposer.org/Composer-Setup.exe>`_ ，
那就从你安装目录(比如C:\\wamp\\www\\dev\\cakephp3)的命令行
运行如下命令::

  composer self-update && composer create-project --prefer-dist cakephp/app bookmarker

使用Composer安装的优点是它会为你自动完成一些重要的初始化工作，
比如设置正确的文件权限，创建 **config/app.php** 等等。

安装CakePHP也有其他方法。如果你不能或不想使用Composer，
请查看 :doc:`/installation` 章节。

不管你是如何下载安装的CakePHP，一旦安装完成，你的目录应是如下的样子::

  /bookmarker
  /bin
  /config
  /logs
  /plugins
  /src
  /tests
  /tmp
  /vendor
  /webroot
  .editorconfig
  .gitignore
  .htaccess
  .travis.yml
  composer.json
  index.php
  phpunit.xml.dist
  README.md

现在也许是一个好时机去学习一下CakePHP的目录结构了，如有需要请查看
 :doc:`/intro/cakephp-folder-structure` 章节。

检查安装
========

我们可以通过查看默认主页来检查我们的安装是否正确。
首先，你需要开启开发服务器::

  bin/cake server

.. note::

   Windows用户的命令是 ``bin\cake server`` （请注意反斜线的使用）。

这会在8765端口打开一个PHP內建的web服务器。
在浏览器中打开 **http://localhost:8765** 就会看到欢迎界面。
欢迎界面里除了CakePHP未能连接到数据库这一项，所有选项都应该是打钩的。
如果还有其他选项没有打钩，你可能需要安装额外的PHP扩展或着设置目录权限。

创建数据库
==========

下一步我们来创建书签应用的数据库。
如果你还没有建立数据库，就先建立一个用于本教程的空数据库，名字可以是
``cake_bookmarks`` 。然后执行下列SQL语句创建所需的表::

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created DATETIME,
        modified DATETIME
    );

    CREATE TABLE bookmarks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(50),
        description TEXT,
        url TEXT,
        created DATETIME,
        modified DATETIME,
        FOREIGN KEY user_key (user_id) REFERENCES users(id)
    );

    CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (title)
    );

    CREATE TABLE bookmarks_tags (
        bookmark_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (bookmark_id, tag_id),
        FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
        FOREIGN KEY bookmark_key(bookmark_id) REFERENCES bookmarks(id)
    );

你也许注意到了， ``bookmarks_tags`` 表使用了复合主键。CakePHP几乎
在任何地方都支持复合主键，这使得构建多租户应用（multi-tenanted application）更加简单。

数据库中的表名和列名不是随意命名的。通过遵循CakePHP的 :doc:`命名惯例 </intro/conventions>` ，我们可以更轻松地使用CakePHP，避免去进行
框架的各种配置工作。CakePHP是一个很灵活的框架，足够容纳不连续的遗留
数据库模式，但是严格遵循命名惯例会节省你不少时间。

数据库配置
==========

下一步我们需要告诉CakePHP数据库在哪以及如何连接到它。
对于很多人来说，这将是你第一次也是最后一次配置东西。

配置工作十分直接：就是把 **config/app.php** 文件中的
``Datasources.default`` 数组替换成与你系统匹配的值。
一个简单的已完成配置的数组例子如下所示::

    return [
        // More configuration above.
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'username' => 'cakephp',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_bookmarks',
                'encoding' => 'utf8',
                'timezone' => 'UTC',
                'cacheMetadata' => true,
            ],
        ],
        // More configuration below.
    ];

一旦配置完成并保存了 **config/app.php** 文件，欢迎页面上的 'CakePHP is able to connect to the database' 应当也打上了钩。

.. note::

   **config/app.default.php** 中可以找到一份CakePHP的默认配置文件。

生成骨架代码
============

由于我们的数据库遵循了CakePHP的命名惯例，我们就可以使用 :doc:`bake console </bake/usage>` 来快速生成基本的骨架代码。
在命令行中运行如下命令::

    // Windows平台要用 bin\cake 的写法。
    bin/cake bake all users
    bin/cake bake all bookmarks
    bin/cake bake all tags

以上命令将生成用户（users）、书签（bookmarks）、标签（tags）的controller、model、view、测试用例和相应的fixture。
如果你已经关闭了服务器，重启它然后打开 **http://localhost:8765/bookmarks** 。

你应当能够看到一个基本但可用的web应用了，它可以连接到你的数据库
并且提供数据。你可以在bookmarks列表下新建几个用户、书签和标签。

.. note::

   如果你得到了一个Not Found 404页面，请确认Apache mod_rewrite模块已经加载。

对密码进行哈希加密
==================

通过访问 **http://localhost:8765/users** 创建了user以后，你可能注意到了我们的密码还是以明文存储的。
从安全的角度讲这是一个糟糕的问题，下一步我们就来修复它。

现在是一个好的时机讲讲CakePHP的model层了。
CakePHP把操纵对象集合的方法和操纵单个对象的方法分别放在了不同的类里。
其中，操纵记录集合的方法放在了 ``Table`` 类里，而属于单条记录的特性则放在了 ``Entity`` 类里。

比如，对密码进行加密是在单条记录里做的事，所以我们把这一行为写入entity对象中。
由于希望在每次设置密码时都会对其加密，所以我们要使用mutator/setter方法。
CakePHP会在实体属性每次发生变化时都调用相应的基于命名惯例的setter方法对属性进行设置。

下面我们对密码添加setter方法。在 **src/Model/Entity/User.php** 中添加如下代码::

    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher; //添加这一行
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // Code from bake.

        protected function _setPassword($value)
        {
            $hasher = new DefaultPasswordHasher();
            return $hasher->hash($value);
        }
    }

现在修改一个之前添加的用户的密码。这时你应当可以在list页面或view页面看到加密的密码而不是密码明文了。CakePHP默认使用 `bcrypt
<http://codahale.com/how-to-safely-store-a-password/>`_
加密密码。如果使用了一个现有的数据库，你也可以用sha1或md5进行加密。

.. note::

   如果密码没有被加密，请确保在命名setter函数时使用了与类成员Password相同的大小写。

使用标签寻找书签
================

现在已经可以安全地存储密码了，接下来我们要给应用增添一些更有趣的特性。
在你积累了一定数量的书签之后，如果能通过标签（tag）来进行搜索将是很有用的。
下一步我们会通过实现route、controller的方法（action）和finder方法来实现通过标签查找书签。

理想情况下，我们想得到这样一个URL **http://localhost:8765/bookmarks/tagged/funny/cat/gifs** ，
它能使我们找到所有拥有'funny'、'cat' 或'gifs'标签的书签。
为了实现它，我们需要添加一个新route。你的 **config/routes.php** 文件应当写成如下的样子::

    <?php
    use Cake\Routing\Route\DashedRoute;
    use Cake\Routing\Router;

    Router::defaultRouteClass(DashedRoute::class);

    // New route we're adding for our tagged action.
    // The trailing `*` tells CakePHP that this action has
    // passed parameters.
    Router::scope(
        '/bookmarks',
        ['controller' => 'Bookmarks'],
        function ($routes) {
            $routes->connect('/tagged/*', ['action' => 'tags']);
        }
    );

    Router::scope('/', function ($routes) {
        // Connect the default home and /pages/* routes.
        $routes->connect('/', [
            'controller' => 'Pages',
            'action' => 'display', 'home'
        ]);
        $routes->connect('/pages/*', [
            'controller' => 'Pages',
            'action' => 'display'
        ]);

        // Connect the conventions based default routes.
        $routes->fallbacks();
    });

以上代码定义了一个新'route'，它把 **/bookmarks/tagged/**
这一路径连接到了 ``BookmarksController::tags()`` 。
通过定义route，你可以把URL的外在形式和实现它的方法隔离开。
如果现在访问 **http://localhost:8765/bookmarks/tagged** ，
我们会看到一个有用的CakePHP错误界面，提醒你controller action尚不存在。
接下来我们就来实现这个缺失的方法。
在 **src/Controller/BookmarksController.php** 中添加如下代码::

    public function tags()
    {
        // The 'pass' key is provided by CakePHP and contains all
        // the passed URL path segments in the request.
        $tags = $this->request->params['pass'];

        // Use the BookmarksTable to find tagged bookmarks.
        $bookmarks = $this->Bookmarks->find('tagged', [
            'tags' => $tags
        ]);

        // Pass variables into the view template context.
        $this->set([
            'bookmarks' => $bookmarks,
            'tags' => $tags
        ]);
    }

如果要访问其他request数据，请参阅  :ref:`cake-request` 章节。

创建Finder方法
--------------

在CakePHP中我们倾向于保持controller的方法简单一些，而把大部分的
应用逻辑放在model中。如果现在访问 **/bookmarks/tagged** ，你会看到
``findTagged()`` method尚未实现的错误，现在我们把它实现。
在 **src/Model/Table/BookmarksTable.php** 中添加下列代码::

    // The $query argument is a query builder instance.
    // The $options array will contain the 'tags' option we passed
    // to find('tagged') in our controller action.
    public function findTagged(Query $query, array $options)
    {
        return $this->find()
            ->distinct(['Bookmarks.id'])
            ->matching('Tags', function ($q) use ($options) {
                if (empty($options['tags'])) {
                    return $q->where(['Tags.title IS' => null]);
                }
                return $q->where(['Tags.title IN' => $options['tags']]);
            });
    }

上述代码实现了一个 :ref:`custom finder method <custom-find-methods>` 。
这是CakePHP中一个非常强大的概念，允许你把可重用的查询代码打包使用。
Finder方法需要一个 :doc:`/orm/query-builder` 对象和一个选项数组作为参数。
查询完毕后，finder会返回一个修改后的query对象。
在我们实现的finder中我们使用了 ``distinct()`` 和 ``matching()``
方法，它们的作用是找到不重复的、匹配标签的书签。
``matching()`` 方法使用接受query builder作为参数的 `匿名函数
<http://php.net/manual/en/functions.anonymous.php>`_ 作为参数。
在回调函数中我们用query builder定义了通过标签过滤书签的查询条件。

创建View
--------

现在如果访问 **/bookmarks/tagged** ，CakePHP会出现提醒尚未创建view
文件的错误。下一步我们就来为 ``tags()`` 方法创建view文件。在
**src/Template/Bookmarks/tags.ctp** 中输入如下内容::

    <h1>
        Bookmarks tagged with
        <?= $this->Text->toList($tags) ?>
    </h1>

    <section>
    <?php foreach ($bookmarks as $bookmark): ?>
        <article>
            <!-- Use the HtmlHelper to create a link -->
            <h4><?= $this->Html->link($bookmark->title, $bookmark->url) ?></h4>
            <small><?= h($bookmark->url) ?></small>

            <!-- Use the TextHelper to format text -->
            <?= $this->Text->autoParagraph($bookmark->description) ?>
        </article>
    <?php endforeach; ?>
    </section>

上述代码使用了 :doc:`/views/helpers/html` 和 :doc:`/views/helpers/text` helper来帮助生成view输出。
我们还使用了 :php:func:`h` 这一快捷函数来编码HTML输出。
在使用时应当牢记总是使用 ``h()`` 来输出用户数据以防止HTML注入问题。

我们刚刚创建的 **tags.ctp** 文件遵循了CakePHP有关view模板文件的
命名惯例，即模板文件名使用对应controller方法的小写下划线写法。

你也许注意到了在view中我们能够使用 ``$tags`` 和 ``$bookmarks`` 变量。
这是因为在controller中我们已经使用 ``set()`` 方法把所有相关的变量传递到了view中，
而view会使所有传递来的变量成为能在模板中访问的局部变量。

现在你应当能访问  **/bookmarks/tagged/funny** 并且看到所有标记为
'funny'的书签了。

目前为止，我们创建了一个基础的可以管理书签、标签和用户的web应用。
然而，现在每个用户都可以看到其他用户的标签。
在下一章节，我们会实现用户认证功能，从而让当前用户只能看到属于自己的书签。

现在请阅读 :doc:`/tutorials-and-examples/bookmarks/part-two`
来继续完成我们的应用，
或者 :doc:`深入阅读文档</topics>` 来发现CakePHP更多功能。

