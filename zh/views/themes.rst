主题
##############

你可以利用主题(*Theme*)，快速简便地切换页面的观感。

要使用主题，在控制器中指定主题名称::

    class ExampleController extends AppController {
        public $theme = 'Example';
    }

.. versionchanged:: 2.1
   2.1 之前的版本需要设置 ``$this->viewClass = 'Theme'`` 。2.1 版本不再需要，因为 
   ``View`` 类支持主题。

你也可以在动作中或者在 ``beforeFilter`` 或 ``beforeRender`` 回调函数中设置或改变
主题名称::

    $this->theme = 'AnotherExample';

主题视图文件需要放在 ``/app/View/Themed/`` 目录中。在 Themed 目录内，使用主题名称
作为名字创建目录。例如，上面代码中的主题可以在目录
``/app/View/Themed/AnotherExample`` 中找到。

.. note::

    重要的是请记住，CakePHP 接受驼峰命名的主题名称。

除此之外，``/app/View/Themed/Example/`` 目录内的目录结构和 ``/app/View/`` 是完全
一样的。

例如，Posts 控制器的 edit 动作的视图文件是 
``/app/View/Themed/Example/Posts/edit.ctp`` ，布局文件则位于 
``/app/View/Themed/Example/Layouts/`` 目录内。

如果一个视图文件不能在主题中找到，CakePHP 会在目录 ``/app/View/`` 中寻找。这样，
你就可以创建主视图文件，然后简单地在主题目录中根据需要重写单个视图文件进行覆盖。

主题资源
--------

除了视图文件，主题也可以包含静态资源。主题可以在它的 webroot 目录中包含任何必要的
资源。这让主题的打包和分发更加容易。在开发时，对主题资源的请求是由 
:php:class:`Dispatcher` 来处理的。为了提高生产环境中的性能，推荐使用符号链接
(*symlink*)或者是复制主题资源到应用程序的 webroot 目录中。欲知详情，请往下看。

为了使用新主题的 webroot，在主题中创建下面这样的目录::

  app/View/Themed/<themeName>/webroot<path_to_file>

Dispatcher 将会负责在视图路径中寻找正确的主题资源。

所有 CakePHP 内置的助件能够识别主题并会自动创建正确的路径。如同视图文件，如果一个
文件不在主题目录中，它会默认为主 webroot 目录::

    //在名为 'purple_cupcake' 的主题中
    $this->Html->css('main.css');

    //创建一个路径类似
    /theme/purple_cupcake/css/main.css

    //并连接到
    app/View/Themed/PurpleCupcake/webroot/css/main.css

提升插件和主题资源的性能
------------------------

众所周知，通过 PHP 来提供资源肯定要慢于不用 PHP 来提供这些资源。尽管核心团队采取
了措施让提供插件和主题的速度尽可能快，但是可能有些情况下对性能有更高的要求。在这
种情况下，建议要么使用符号链接(*symlink*)，要么将插件/主题资源复制到 
``app/webroot`` 下与 CakePHP 使用的路径匹配的目录中。


-  ``app/Plugin/DebugKit/webroot/js/my_file.js`` 变为
   ``app/webroot/debug_kit/js/my_file.js``
-  ``app/View/Themed/Navy/webroot/css/navy.css`` 变为
   ``app/webroot/theme/Navy/css/navy.css``


.. meta::
    :title lang=zh: Themes
    :keywords lang=zh: production environments,theme folder,layout files,development requests,callback functions,folder structure,default view,dispatcher,symlink,case basis,layouts,assets,cakephp,themes,advantage
