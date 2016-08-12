高级安装
#####################

通过 PEAR 安装程序安装 CakePHP
======================================

CakePHP 发行 PEAR 的安装包，故可以通过 PEAR 安装程序安装。用 PEAR 安装，可以简化在
多个应用程序间共享 CakePHP 类库的工作。要通过 PEAR 安装 CakePHP，需要执行下面的命
令::

    pear channel-discover pear.cakephp.org
    pear install cakephp/CakePHP

.. note::

    在一些操作系统中用 PEAR 命令安装类库需要 ``sudo``。

使用 PEAR 安装 CakePHP 之后，如果 PEAR 配置正确，可以使用 ``cake`` 命令来创建新的
应用程序。由于 CakePHP 已经被包含在 PHP 的 ``include_path`` 中，就不需要再做任何
其它改动了。


通过 Composer 安装 CakePHP
================================

在开始之前你应当确保你的 PHP 版本是更新了的：

.. code-block:: bash

    php -v

你最低也应当安装了 PHP 5.3.0 (CLI) 或更高版本。你的 web 服务器的 PHP 版本必须也是
5.3.0 或更高版本，并且应当最好和命令行（CLI）的 PHP 版本相同。

安装 Composer
-------------------

Composer 是一个适用于 PHP 5.3+ 的依赖管理工具，解决了 PEAR 安装程序的很多问题，
并且简化了对类库的多个版本的管理。`Packagist <https://packagist.org/>`_ 是
Composer 安装包的主要仓库。由于 CakePHP 也发布版本到 Packagist，故而可以使用
`Composer <http://getcomposer.org>`_ 安装 CakePHP。

- 在 Linux 和 Mac OS X 上安装 Composer

  #. 按照 `official Composer documentation <https://getcomposer.org/download/>`_
     描述的那样运行安装脚本，并遵照指示安装 Composer。
  #. 运行下面的命令，把 composer.phar 文件移动到 path 环境变量中的一个目录中::

         mv composer.phar /usr/local/bin/composer

- 在 Windows 上安装 Composer

  对于 Windows 系统，你可以从 `这里
  <https://github.com/composer/windows-setup/releases/>`__ 下载 Composer 的
  Windows 安装程序。 Composer 的 Windows 安装程序更多的指示可以参阅 `这里
  <https://github.com/composer/windows-setup>`__ 的 README。

创建 CakePHP 项目
------------------------

在安装 CakePHP 之前需要建立 ``composer.json`` 文件。CakePHP 应用程序的
composer.json 可以象下面这样::

    {
        "name": "example-app",
        "require": {
            "cakephp/cakephp": "2.8.*"
        },
        "config": {
            "vendor-dir": "Vendor/"
        }
    }

把这段 JSON 保存在项目的 APP 目录中的 ``composer.json`` 文件中。接下来把
composer.phar 文件下载到项目中。在 ``composer.json`` 所在的目录下运行如下命令::

    $ php composer.phar install

一旦 Composer 运行结束，目录结构应当如下所示::

    example-app/
        composer.phar
        composer.json
        Vendor/
            bin/
            autoload.php
            composer/
            cakephp/

现在可以生成应用程序骨架的其余部分::

    $ Vendor/bin/cake bake project <path to project>

缺省情况下，``bake`` 把 :php:const:`CAKE_CORE_INCLUDE_PATH` 硬编码了。为了使应用
程序更具移植性，应当修改 ``webroot/index.php`` ，将 ``CAKE_CORE_INCLUDE_PATH``
改为相对路径::

    define(
        'CAKE_CORE_INCLUDE_PATH',
        ROOT . DS . APP_DIR . DS . 'Vendor' . DS . 'cakephp' . DS . 'cakephp' . DS . 'lib'
    );

.. note::

    如果你计划为应用程序创建单元测试，你也需要对 ``webroot/test.php`` 做上面的修
    改。

如果使用 Composer 安装其他任何类库，则需要设置自动加载（*autoloader*）并绕过
（*work around*）Composer 自动加载的一个问题。在 ``Config/bootstrap.php`` 文件中添
加如下代码::

    // 加载 Composer 的自动加载。
    require APP . 'Vendor/autoload.php';

    // 删除并重新优先添加 CakePHP 的自动加载，因为 Composer 认为这是最重要的。
    // 参看：http://goo.gl/kKVJO7
    spl_autoload_unregister(array('App', 'load'));
    spl_autoload_register(array('App', 'load'), true, true);

现在这个用 Composer 安装的 CakePHP 应用程序应该可以运行了。注意确保 composer.json
和 composer.lock 文件与其它源代码一起（添加到源码控制中）。

在多个应用程序间共享 CakePHP 类库
====================================================

在某些情况下，你会希望把 CakePHP 的目录放到文件系统的不同地方。这可能是因为共享主
机的限制，或者你只是想让一些应用程序共享相同的 CakePHP 类库。本节将说明怎样把
CakePHP 的目录分散到文件系统的的不同地方。

首先，明确 Cake 的应用程序有三个主要部分:

#. CakePHP 核心类库，位于 /lib/Cake 目录。
#. 应用程序的代码，位于 /app 目录。
#. 应用程序的 webroot，通常位于 /app/webroot 目录。

这里的每个目录，都可以放到文件系统的任何位置，除了 webroot，它必须位于 web 服务器
能够访问到的地方。甚至可以将 webroot 目录移动到 app 目录外面，只要你告诉 CakePHP
你把它放在了哪里。

配置 CakePHP 的安装时，需要对下面的文件做一些修改。


-  /app/webroot/index.php
-  /app/webroot/test.php (如果你使用
   :doc:`Testing </development/testing>` 的功能。)

有三个常量需要修改： ``ROOT`` 、 ``APP_DIR`` 和 ``CAKE_CORE_INCLUDE_PATH``。

-  ``ROOT`` 应当设置为包含你的 app 文件夹的目录路径。
-  ``APP_DIR`` 应当设置为 app 目录的目录名称(译注：即不包含前面的路径)。
-  ``CAKE_CORE_INCLUDE_PATH`` 应当设置为 CakePHP 类库目录的路径。

让我们通过下面的例子，让你明白高级安装实际上是怎样的。设想我要象下面这样设置
CakePHP：

-  CakePHP 的核心类库位于 /usr/lib/cake。
-  应用程序的 webroot 目录是 /var/www/mysite/。
-  应用程序的 app 目录是 /home/me/myapp。

鉴于这种类型的设置，我需要编辑 webroot/index.php 文件(在本例中为
/var/www/mysite/index.php)，(让它)像下面这样::

    // /app/webroot/index.php (部分代码，删除了注释)

    if (!defined('ROOT')) {
        define('ROOT', DS . 'home' . DS . 'me');
    }

    if (!defined('APP_DIR')) {
        define ('APP_DIR', 'myapp');
    }

    if (!defined('CAKE_CORE_INCLUDE_PATH')) {
        define('CAKE_CORE_INCLUDE_PATH', DS . 'usr' . DS . 'lib');
    }

推荐使用 ``DS`` 常量而不是斜杠(译注：即 ``/`` 或 ``\``)来分隔文件路径，这样可以避
免因为使用错误的分隔符而导致的文件无法找到的错误，并使代码更具移植性。

Apache 和 mod\_rewrite (以及 .htaccess)
=======================================

本节内容被移到 :doc:`网址重写 </installation/url-rewriting>`。


.. meta::
    :title lang=zh: Advanced Installation
    :keywords lang=zh: libraries folder,core libraries,application code,different places,filesystem,constants,webroot,restriction,apps,web server,lib,cakephp,directories,path
