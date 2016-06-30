博客教程
********

欢迎使用 CakePHP。阅读这个教程多半是因为你想了解更多有关 CakePHP 是如何工作的。我
们的目的是提高生产力，并使编写代码更令人愉快，我们希望当你深入代码时会感受到这一
点。

这个教程将引导你创建一个简单的博客应用。我们将会获取和安装 CakePHP，建立并配置数
据库，创建足够的应用逻辑去列出博客文章清单，添加、编辑和删除博客文章。

这是你所需要的:

#. 一个运行中的 web 服务器。我们将假定你使用的是 Apache，虽然使用其它 web 服务器
   的步骤也差不多。我们可能需要对服务器的配置作一些调整，但大部分人不需要改动任何
   配置就可以让 CakePHP 跑起来。请确保你的 PHP 是5.2.8或更高版本。
#. 一个数据库服务器。在本教程中我们将使用 MySQL 数据库。你需要对 SQL 有足够的了解，
   以便创建一个数据库：CakePHP 将从这里接管数据库。既然我们使用 MySQL，请确保你在
   PHP 中开启了 ``pdo_mysql`` 模块。
#. 基础的 PHP 知识。你对面向对象编程的经验越多越好，不过如果你只懂面向过程编程，
   也不要害怕。
#. 最后, 你将需要对 MVC 编程模式有基本的了解。这里有一个简介 
   :doc:`/cakephp-overview/understanding-model-view-controller`。别怕，只是半页而
   已。

让我们开始吧！

获取 CakePHP
============

首先，让我们获取一份最新的 CakePHP 代码的拷贝。

要获得最新的代码，请访问在 GitHub 上的 CakePHP 项目：
`https://github.com/cakephp/cakephp/tags <https://github.com/cakephp/cakephp/tags>`_ ，
并下载2.0的最新发行版本。

你也可以用 `git <http://git-scm.com/>`_ 检出(*clone*)最新的代码。
``git clone git://github.com/cakephp/cakephp.git``

不管你是通过什么方式下载的，将下载后的代码放到你的文档根目录(*DocumentRoot*)里。
完成后，你的目录应当象这样::

    /path_to_document_root
        /app
        /lib
        /plugins
        /vendors
        .htaccess
        index.php
        README

现在也许是个适当的时机去了解一下 CakePHP 的目录结构是如何组织的，请参阅 
:doc:`/getting-started/cakephp-folder-structure` 一节 。

Tmp 目录的权限
--------------

下面我们要让目录 ``app/tmp`` 可以被 web 服务器写入。最好的方法是找出你的 web 服务
器使用哪个用户运行。你可以在 web 服务器可以执行的任何 PHP 文件中运行 
``<?php echo `whoami`; ?>``。你应当会看到一个用户名被输出。将目录 ``app/tmp`` 的
拥有者(*owner*)改为该用户。最终(在 \*nix系统中)运行的命令会象这样::

    $ chown -R www-data app/tmp

如果因为某些原因 CakePHP 不能写入到该目录, 你将看到警告和缓存数据无法写入的未捕
获异常。

创建博客数据库
==============

下一步，让我们建立博客的数据库。如果还没有做这些，就为本教程创建一个空的数据库，
名字随便起。现在我们要创建一个表来存储我们的文章，然后再添加几篇文章作测试用。在
数据库里面执行下面的 SQL 语句::

    /* 首先，创建我们的日志表: */
    CREATE TABLE posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

    /* 然后，插入一些测试用的文章记录: */
    INSERT INTO posts (title, body, created)
        VALUES ('The title', 'This is the post body.', NOW());
    INSERT INTO posts (title, body, created)
        VALUES ('A title once again', 'And the post body follows.', NOW());
    INSERT INTO posts (title, body, created)
        VALUES ('Title strikes back', 'This is really exciting! Not.', NOW());

表和列的名字并不是随意取的。如果你遵循 CakePHP 的数据库命名约定，以及类的命名约定
(二者都在 :doc:`/getting-started/cakephp-conventions` 做了介绍)，你将可以利用许多
现成的功能并免去配置的麻烦。CakePHP 足够灵活，可以适应即使最糟糕的旧式(*legacy*)
数据库结构，不过遵循约定可以节省时间。

请查看 :doc:`/getting-started/cakephp-conventions` 以获得更多的信息，但我只想说，
命名数据库表为'posts'，将会自动把它连接到模型 Post，并且 CakePHP 将自动管理表的
'modified'和'created'字段。

CakePHP 数据库配置
==================

接下来，让我们告诉 CakePHP 我们的数据库放在那里以及如何连接。对于许多人来说，这
将是第一次也是最后一次进行任何配置。

``/app/Config/database.php.default`` 是一份 CakePHP 配置文件的拷贝。在同一目录中
拷贝这个文件，但重命名为 ``database.php``。

该配置文件应该很简单：仅仅替换掉 ``$default`` 数组中相应的值为你的数据库设置。一
个完整的配置例子看起来应该是这样::

    public $default = array(
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'port' => '',
        'login' => 'cakeBlog',
        'password' => 'c4k3-rUl3Z',
        'database' => 'cake_blog_tutorial',
        'schema' => '',
        'prefix' => '',
        'encoding' => 'utf8'
    );

一旦你已经保存了新的 ``database.php`` 文件, 你应该能够打开你的浏览器并看到 
CakePHP 的欢迎页面。它应当告诉你，数据库连接文件已经找到，CakePHP 已经成功连接到
数据库了。

.. note::

    记住如果你需要使用 PDO，你需要在 php.ini 中启用 pdo_mysql 模块。
 
可选的配置
==========

这里还有一些其他的选项可以设置。大多数开发者都会完成这些设置，不过它们在本教程
中并不是必须的。一是定义一个定制字符串(或者叫"salt"，译者注：salt 是密码保护中用
于生成密码哈希的一个随机字符串)用于安全哈希，二是定义一个定制数(或者叫"seed")用于
加密。

安全字符串(*security salt*)用于生成哈希。在 ``/app/Config/core.php`` 中改变 
``Security.salt`` 的值。新的值应该足够长，难于猜测，并尽可能的随机::

    /**
     * 一个随机的字符串，用于安全哈希方法。
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');

密码种子(*cipher seed*)用来加密/解密字符串。在 ``/app/Config/core.php`` 中改变缺
省的 ``Security.cipherSeed`` 的值。新的值应当是一个随机大整数::

    /**
     * 一个随机数字字符串 (只含有数字) ，用于加密和解密字符串。
     */
    Configure::write('Security.cipherSeed', '7485712659625147843639846751');

关于 mod\_rewrite 的说明
========================

偶尔新用户会遇到 mod\_rewrite 的问题。例如，如果 CakePHP 的欢迎页面看起来有点儿奇
怪(不显示图片，或者没有 CSS 样式)，这也许是因为你系统中的 mod\_rewrite 没起作用。
请参阅下面与你的 web 服务器相应的关于 URL 重写的章节，来解决这些问题:

.. toctree::
    :maxdepth: 1

    /installation/url-rewriting


接下来进入 :doc:`/tutorials-and-examples/blog/part-two`，开始建立你的第一个 
CakePHP 应用程序.


.. meta::
    :title lang=zh: Blog Tutorial
    :keywords lang=zh: model view controller,object oriented programming,application logic,directory setup,basic knowledge,database server,server configuration,reins,documentroot,readme,repository,web server,productivity,lib,sql,aim,cakephp,servers,apache,downloads
