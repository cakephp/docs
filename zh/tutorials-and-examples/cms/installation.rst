內容管理系統教程
###########################

此教程将讲述如何建立一个简单的 :abbr:`CMS (內容管理系統)`。 首先我们需要安装 CakePHP，然后创建数据库，最后编写一个简单的文章管理系统。

基本要求：

#. 一个数据库服务器。此教程采用的是 MySQL 作为数据库。
   你需要储备基本的 SQL 知识。懂得如何使用 SQL 建立数据库以及执行教程中的各种 SQL 片段。
   CakePHP 可自动构造你的应用所需的各种查询语句。 由于此教程使用的是 MySQL, 请确定 PHP 的
   ``pdo_mysql``  已经启用。
   
#. 基本的 PHP 知识。

在开始之前，请确保你的 PHP 已经更新。

.. code-block:: bash

    php -v

你至少需要安装 PHP （命令行界面）版本 |minphpversion| 以上。网路服务器的 PHP 需要和命令行界面版本一致，保证 |minphpversion| 以上。

安装 CakePHP
===============

使用 Composer 是安装 CakePHP 最简单的方法。Composer 是通过终端或者命令行提示符安装 CakePHP 的一种简易方式。
首先，你需要下载和安装 Composer。你可以通过 cURL，然后执行以下语句来安装：

.. code-block:: bash

    curl -s https://getcomposer.org/installer | php

或者你也可以从 `Composer 官网 <https://getcomposer.org/download/>`_ 直接下载  ``composer.phar``。

然后在同一个目录中，运行以下语句来安装 CakePHP 的应用骨架，此应用将会建立在一个  **cms** 的目录中：

.. code-block:: bash

    php composer.phar create-project --prefer-dist cakephp/app cms


如果你是下载使用的 `Composer Windows Installer
<https://getcomposer.org/Composer-Setup.exe>`_，在同一个目录中（比如 C:\\wamp\\www\\dev\\cakephp3）终端运行以下语句：

.. code-block:: bash

    composer self-update && composer create-project --prefer-dist cakephp/app cms

使用 Composer 的优势是它会自动完成一些重要的设置任务，比如建立合适的文件权限以及建立配置文件
 **config/app.php**。

当然 CakePHP 也提供其他的安装方式。如果你不能或者不想使用 Composer 的话，请查看 :doc:`/installation` 章节。

不管你是以何种方式下载和安装,你的目录应该都会是以下形式::

    /cms
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

事不宜迟，现在是学习 CakePHP 目录结构的合适时机： 请查看 :doc:`/intro/cakephp-folder-structure` 章节。

如果你没有跟上此教程的速度，你可以参考下此教程的 `成品代码
<https://github.com/cakephp/cms-tutorial>`_.


检查安装
=========================

你可以通过访问默认的主页的来检查安装是否成功。当然首先我们需要启动开发服务器：

.. code-block:: bash

    cd /path/to/our/app

    bin/cake server

.. note::

    Windows 用户，需使用 ``bin\cake server`` （使用反斜线）

PHP 自带的网络服务器将在 8765 端口启动。在浏览器中访问 **http://localhost:8765**，
你应该会看到欢迎页面。除了 ”CakePHP being able to connect to your database“ 没有绿色厨师帽以后，
其余的要点都应有。如果不是这样的话，你可能需要安装一些缺失的 PHP 扩展，或者是建立正确的目录权限。

接下来，我们将创立我们的 :doc:`数据库以及创建第一个模型 </tutorials-and-examples/cms/database>`.
