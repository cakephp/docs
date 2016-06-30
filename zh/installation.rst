安装
############

CakePHP 的安装快速、容易。最低要求是一个 web 服务器和一份 CakePHP 的拷贝，仅此而
已！尽管本手册主要关注于 Apache 服务器(因为它最为常用)，但是也可以配置 CakePHP
运行在不同的 web 服务器上，比如 lighttpd 或 Microsoft IIS。

要求
============

-  HTTP 服务器。例如: Apache。mod\_rewrite 模块为首选，但绝对不是必须的。
-  PHP 5.3.0 或更高版本（CakePHP 2.6和及其以下版本支持 PHP 5.2.8 或更高版本）。

从技术的角度来说，数据库不是必须的，但我们觉得大部分应用程序都会用到。CakePHP 支
持多种数据库引擎:

-  MySQL (4 或更高版本)
-  PostgreSQL
-  Microsoft SQL Server
-  SQLite

.. note::

    所有的内置驱动都需要 PDO。请确保已经安装了正确的 PDO 扩展。

许可协议
========

CakePHP 的许可是基于 MIT 许可协议的。这意味着在保持版权声明完整的前提下，你可以自
由地修改、分发和重新发布其源码。你也可以自由地在商业或闭源应用程序中包含 CakePHP。

下载 CakePHP
===================

有两个主要的方式可以获得 CakePHP 的最新拷贝。你可以从官网下载压缩文档(zip/tar.gz/
tar.bz2)，也可以从 git 库中获取代码。

要下载 CakePHP 最新的主版本，请访问官方网站
`http://cakephp.org <http://cakephp.org>`_ 并点击 "Download" 链接。

所有 CakePHP 的当前发行版本都托管在 `GitHub <http://github.com/cakephp/cakephp>`_
上。GitHub 同时托管了 CakePHP 自身和许多 CakePHP 的其它插件。CakePHP 的所有发行版
本可从 `GitHub tags <https://github.com/cakephp/cakephp/tags>`_ 获得。

另外，你也可以获取未发布的最新代码，包含全部错误修正和最新的增强功能。这可以通过
克隆 `GitHub`_ 库来获得::

    git clone -b 2.x git://github.com/cakephp/cakephp.git


访问权限
===========

CakePHP 的很多不同操作都要使用 ``app/tmp`` 目录，比如模型描述、缓存的视图和会话(
*session*)信息。

因此，要确保在 CakePHP 安装中 ``app/tmp`` 目录及其全部子目录可以被 web 服务器用户
写入。

一个常见的问题是，app/tmp 目录及其子目录必须同时能够被 web 服务器和命令行用户写入。
在 UNIX 系统中，如果 web 服务器用户不同于命令行用户，你可以在项目目录中只运行一次
下面的命令，从而保证设置了正确的访问权限::

   HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
   setfacl -R -m u:${HTTPDUSER}:rwx app/tmp
   setfacl -R -d -m u:${HTTPDUSER}:rwx app/tmp

设置
=====

设置 CakePHP 可以简单到把它直接放置在 web 服务器的文档根目录下，也可以像你希望的
那样复杂和灵活。本节介绍三种主要的 CakePHP 安装方式：开发安装方式、生产安装方式和
高级安装方式。

-  开发安装方式: 简单易行，应用程序的网址包含 CakePHP 的安装目录名，不是很安全。
-  生产安装方式: 要求能够配置 web 服务器文档根目录，简洁网址，非常安全。
-  高级安装方式: 通过一些配置，允许你把 CakePHP 的关键目录放在文件系统的不同位置，
   可以让多个 CakePHP 应用程序共享一个 CakePHP 核心库目录。

开发安装方式
============

开发安装方式是安装 CakePHP 最快的方法。本例将帮助你安装一个 CakePHP 应用程序并使
它的网址为 http://www.example.com/cake\_2\_0/。假定文档根目录设置在
``/var/www/html`` 目录。

把 CakePHP 压缩包的内容解压到 ``/var/www/html`` 目录下。现在在文档根目录下已经有
了一个以你下载的版本号命名的子文件夹(例如 cake\_2.0.0)。将该文件夹更名为
cake\_2\_0。开发安装方式的目录结构将如下所示::

    /var/www/html/
        cake_2_0/
            app/
            lib/
            plugins/
            vendors/
            .htaccess
            index.php
            README

如果 web 服务器配置正确，就可以通过 http://www.example.com/cake\_2\_0/ 访问你的
CakePHP 应用程序。

多个应用程序使用同一份 CakePHP 拷贝
-----------------------------------

如果你正在开发多个应用程序，通常更合理的做法是让这些应用程序共享一份 CakePHP 核心。
达到这个目的有几个办法。通常最容易的做法是使用 PHP 的 ``include_path`` 。首先，克
隆(*clone*) CakePHP 到一个目录。本示例中，我们使用 ``/home/mark/projects`` 目录::

    git clone git://github.com/cakephp/cakephp.git /home/mark/projects/cakephp

这会克隆 CakePHP 到 ``/home/mark/projects`` 目录下。如果不想使用 git，你可以下载
一个 zip 包，以下的步骤是相同的。接下来，你必须找到并修改 ``php.ini`` 文件。在
\*nix 系统中，这通常位于 ``/etc/php.ini`` ，不过，使用 ``php -i`` 并寻找
'Loaded Configuration File'，你就可以找到(该文件)实际的位置。一旦找到正确的 ini
文件，修改 ``include_path`` 设置使其包含 ``/home/mark/projects/cakephp/lib`` 。例
如::

    include_path = .:/home/mark/projects/cakephp/lib:/usr/local/php/lib/php

然后重启 web 服务器，可以在 ``phpinfo()`` 中看到变化。

.. note::

    如果是在 Windows 系统中，用 ; 代替 : 分隔多个包含路径。

一旦设置好 ``include_path`` ，应用程序应当能够自动找到 CakePHP。

生产安装方式
============

生产安装方式是更加灵活的配置 CakePHP 的方式。使用这种方法可以使整个域看起来象一个
CakePHP 应用程序。本例将指导你在文件系统的任何位置安装 CakePHP，并可以通过
http://www.example.com 访问。注意这种安装方式可能需要你有能够改变 Apache 服务器的
``DocumentRoot`` 的权限。

将 CakePHP 压缩包的内容解压到你选择的任意目录。假定你选择将 CakePHP 安装在
/cake\_install 目录中。生产安装方式的文件系统看起来会象下面这样::

    /cake_install/
        app/
            webroot/ (this directory is set as the ``DocumentRoot``
             directive)
        lib/
        plugins/
        vendors/
        .htaccess
        index.php
        README

使用 Apache 的开发人员应当把域的 ``DocumentRoot`` 指令设置为::

    DocumentRoot /cake_install/app/webroot

如果 web 服务器配置正确，就可以通过 http://www.example.com/ 访问你的 CakePHP 应用
程序了。

高级安装方式和 URL 重写
=======================================

.. toctree::
    :maxdepth: 1

    installation/advanced-installation
    installation/url-rewriting

启动
==========

好了，让我们将 CakePHP 运行起来。取决于所采用的设置，你应当将浏览器指向
http://example.com/ 或者 http://example.com/cake\_2\_0/。此时，你将会看到
CakePHP 的默认主页，和当前数据库连接状态的消息。

恭喜！你已经可以 :doc:`创建你的第一个 CakePHP 应用程序 </getting-started>` 了。

不能正常运行？如果你得到关于时区(*timezone*)的 PHP 错误，将
``app/Config/core.php`` 中下面这行代码注释掉::

   /**
    * 注释本行，并且改正服务器时区，来修复任何与日期及时间相关的错误。
    */
       date_default_timezone_set('UTC');


.. meta::
    :title lang=zh: Installation
    :keywords lang=zh: apache mod rewrite,microsoft sql server,tar bz2,tmp directory,database storage,archive copy,tar gz,source application,current releases,web servers,microsoft iis,copyright notices,database engine,bug fixes,lighttpd,repository,enhancements,source code,cakephp,incorporate
