插件
#######

CakePHP 让你可以建立一个控制器、模型和视图的组合，并且把它们作为打包的应用程序插
件来发布，供其他人在他们的 CakePHP 应用程序中使用。在你的一个应用程序中有一个用
户管理模块、简单的博客、或者网络服务(*web services*)模块？把它封装为一个 CakePHP
插件，这样就可以快速地把它放入其它应用程序中了。

一个插件与一个它安装所在的应用程序之间的主要纽带，是应用程序的配置(数据库连接等)。
否则，插件就在它自己的小空间内运行，表现地就象自己是一个应用程序一样。

.. toctree::
   :maxdepth: 1

   plugins/how-to-install-plugins
   plugins/how-to-use-plugins
   plugins/how-to-create-plugins


.. meta::
    :title lang=zh_CN: Plugins
    :keywords lang=zh_CN: plugin folder,plugins,controllers,models,views,package,application,database connection,little space
    
    在 CakePHP 3.0 每个插件都定义了自己的顶级命名空间，例如：DebugKit. 按照惯例，插件使用他们的包作为他们的命名空间。如果你喜欢使用一个不同的命名空间，当你载入插件时可以配置你的命名空间。

使用Composer安装插件
======================

在Packagist有很多可用的插件而且可以使用Composer进行安装。要安装DebugKit，你会做以下的事情：

::

   php composer.phar require cakephp/debug_kit


这将安装DebugKit最新的版和更新你的 ``composer.json``  ``composer.lock`` 文件，更新 ``vendor/cakephp-plugins.php`` 和你的 ``autoloader`` 。

如果你想要安装的插件在packagist.org没有。你可以克隆或者复制插件代码到你的插件文件夹中。假如你想安装一个插件名字叫 ``ContactManager`` ，在plugins中你需要一个文件夹名字叫做 ``ContactManager``，这个文件夹中有插件的源码，测试文件和其它的文件夹。

    
