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
    :title lang=zh: Plugins
    :keywords lang=zh: plugin folder,plugins,controllers,models,views,package,application,database connection,little space