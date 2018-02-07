.. _cakephp-conventions:

CakePHP 约定
############

我们坚信，约定优于配置(convention over configuration)。虽然学习 CakePHP 的约定需要一些时间，但从长远来看，您可以节省时间。通过遵循约定，您可以获得免费的功能，并将您从维护跟踪配置文件的噩梦中解放出来。约定也会带来非常统一的开发体验，可以允许其他开发者参与进来并提供帮助。

.. _controller-conventions:

控制器约定
==========

控制器的类名是复数，首字母大写, 并且以 ``Controller`` 结尾。``UsersController`` 和 ``ArticleCategoriesController`` 都是约定的控制器类名的例子。

控制器中 public 的方法通常被暴露为可通过web浏览器访问的“操作”。例如 ``/users/view`` 映射到 ``UsersController`` 中的 ``view()`` 方法。protected 或者 private 的方法不能通过路由访问。

.. _url-considerations-for-controller-names:

控制器名称的URL注意事项
~~~~~~~~~~~~~~~~~~~~~~~

正如您刚刚所见，单个单词的控制器映射到一个简单的小写URL路径。例如 ``UsersController`` （将是定义在名称为 **UsersController.php** 的文件中）可以从 http://example.com/users 访问。

虽然你也可以以任何你喜欢的方式来定义多个单词的控制器的路由，但约定的URL路径是小写并且用 ``DashedRoute`` 类来分割。因此，``/article-categories/view-all`` 是访问 ``ArticleCategoriesController::viewAll()`` 方法的正确方式。

当你使用 ``$this->Html->link()`` 创建连接的时候，你可以使用以下约定的url数组::

    $this->Html->link('link-title', [
        'prefix' => 'MyPrefix' // 首字母大写
        'plugin' => 'MyPlugin', // 首字母大写
        'controller' => 'ControllerName', // 首字母大写
        'action' => 'actionName' // 驼峰式
    ]

有关 CakePHP URL 和参数处理的更多信息，见 :ref:`routes-configuration`。

.. _file-and-classname-conventions:

文件名和类名约定
================

通常地，文件名匹配类名，并遵循 PSR-4 标准以便进行自动加载。下面是类名和文件名的一些示例：

-  控制器类 ``LatestArticlesController`` 将对应文件名 **LatestArticlesController.php**
-  组件类 ``MyHandyComponent`` 将对应文件名 **MyHandyComponent.php**
-  Table 类 ``OptionValuesTable`` 将对应文件名 **OptionValuesTable.php**.
-  Entity 类 ``OptionValue`` 将对应文件名 **OptionValue.php**.
-  Behavior 类 ``EspeciallyFunkableBehavior`` 将对应文件名 **EspeciallyFunkableBehavior.php**
-  视图类 ``SuperSimpleView`` 将对应文件名 **SuperSimpleView.php**
-  Helper 类 ``BestEverHelper`` 将对应文件名 **BestEverHelper.php**

每个文件将放置于你的应用程序的适当的 folder/namespace 文件夹中。

.. _model-and-database-conventions:

数据库约定
==========

与 CakePHP 模型对应的表名是复数并用下划线分隔的。例如， ``users``, ``article_categories``, 和 ``user_favorite_pages`` 等。

带有两个单词的字段名使用下划线分隔： ``first_name``。

hasMany， belongsTo/hasOne 关系中的外键被自动识别为关联表的表名（单数形式）后面带上``_id``。因此，假设 Users hasMany Articles，那么 ``articles`` 表将使用 ``user_id`` 字段作为外键关联到 ``users`` 表。 像 ``article_categories`` 这种表名中包含多个单词的表，外键的格式是 ``article_category_id``。

当使用模型之间的 BelongsToMany 关系时，连接表应该以被连的表名作为表名（否则 bake 命令将无法运作），并且按字母顺序排序（使用 ``articles_tags`` 而非 ``tags_articles``）。如果你需要在连接表上添加额外的列，您应该为该表创建一个单独的 entity/table 类。

除了使用自增长的 integer 作为主键外，你还可以使用 UUID 字段。当你使用 ``Table::save()`` 方法保存新的记录的时候，CakePHP 会自动使用 (:php:meth:`Cake\\Utility\\Text::uuid()`) 生成 UUID 值。

.. _model-conventions:

模型约定
========

Table 类名是复数、首字母大写、以 ``Table`` 结尾的。``UsersTable``、``ArticleCategoriesTable``、``UserFavoritePagesTable`` 分别是对应 ``users``、``article_categories``、``user_favorite_pages`` 表的 table 类名。

Entity 类名是单数、首字母大写、无后缀的。``User``、``ArticleCategory``、``UserFavoritePage`` 分别是对应 ``users``、``article_categories``、``user_favorite_pages`` 表的 entity 类名。

.. _view-conventions:

视图约定
========

视图模板文件使用它对应的控制器方法的名字以下划线形式命名。``ArticlesController`` 类的 ``viewAll()`` 防范将会对应视图模板文件 **src/Template/Articles/view_all.ctp**。

基本模式就是：**src/Template/Controller/underscored_function_name.ctp**。

.. note::

    CakePHP 默认使用英语的词形变化。如果你的数据库表名或字段名使用别的语言，你需要新增词形变化规则（从单数到复数，反之亦然）。你可以使用 :php:class:`Cake\\Utility\\Inflector` 来定义你的自定义词形变化规则。更多信息见文档 :doc:`/core-libraries/inflector`。
    
.. _summarized:

概述
====

通过使用 CakePHP 约定来命名应用程序的各个部分，你无须烦恼于配置和维护的麻烦就可以轻松使用。下面是一个将约定整合在一起的例子：

-  数据库表："articles"
-  Table 类：``ArticlesTable``，在文件 **src/Model/Table/ArticlesTable.php** 中
-  Entity 类：``Article``，在文件 **src/Model/Entity/Article.php** 中
-  控制器类：``ArticlesController``，在文件 **src/Controller/ArticlesController.php** 中
-  视图模板，在文件 **src/Template/Articles/index.ctp** 中

使用这些约定，CakePHP 知道 http://example.com/articles/ 的请求映射到 ArticlesController（Articles 模型自动可用并被绑定到数据库的 articles 表）的 ``index()`` 方法，然后呈现给一个文件。除了通过创建无论如何需要创建的类和文件之外，这些关系都不是通过任何方式配置的。

现在您已经了解了 CakePHP 的基础知识，您可以尝试运行 :doc:`/tutorials-and-examples/cms/installation` 来看看这些东西是如何组合在一起的。

.. meta::
    :title lang=zh: CakePHP 约定
    :keywords lang=zh: web development experience,maintenance nightmare,index method,legacy systems,method names,php class,uniform system,config files,tenets,apples,conventions,conventional controller,best practices,maps,visibility,news articles,functionality,logic,cakephp,developers
