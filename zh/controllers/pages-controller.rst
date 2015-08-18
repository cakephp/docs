页面控制器
##########

CakePHP 自带 ``PagesController.php`` 作为默认的控制器。这是一个简单、可选用的控
制器，用来提供静态页面。安装后所看到的主页就是用这个控制器生成的。如果创建视图文
件 ``app/View/Pages/about_us.ctp``，就可以通过网址 
``http://example.com/pages/about_us`` 来访问。你可以根据需要自行修改页面控制器
(*Pages Controller*)。

当使用 CakePHP 的控制台工具来生成(*"bake"*)一个应用时，会在 ``app/Controller/`` 
目录下创建页面控制器。也可以从 
``lib/Cake/Console/Templates/skel/Controller/PagesController.php`` 拷贝该文件。

.. versionchanged:: 2.1
    CakePHP 2.0 版本中页面控制器是 ``lib/Cake`` 的一部分。从 2.1 版本起页面控
    制器不再是核心的一部分，而是在 app 目录中发放。

.. warning::

    不要直接修改 ``lib/Cake`` 下的任何文件，以防未来升级核心时发生问题。


.. meta::
    :title lang=zh: The Pages Controller
    :keywords lang=zh: pages controller,default controller,lib,cakephp,ships,php,file folder
