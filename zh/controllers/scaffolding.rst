脚手架
######

.. deprecated:: 2.5
    动态脚手架将在 3.0 版本中去掉并被替换。

应用程序脚手架是这样一种技术，它允许开发者定义并且创建基本的应用程序，能够创建、
读取、更新和删除对象。CakePHP 的脚手架还允许开发者定义对象之间如何关联，以及如何
建立或断开这些连接。

创建脚手架只需要一个模型和它的控制器。一旦在控制器中设置了 $scaffold 变量，就可以
运行了。

CakePHP 的脚手架相当酷。它可以让你在几分种内就建立起一个基本的 CRUD 应用程序。它
甚至酷到你想在生产环境的应用程序中使用它。的确，我们也认为它很酷，但是请意识到脚
手架……毕竟……只是脚手架。脚手架是在项目的初期为了启动而快速搭建的一种松散结构。它
并不是要十分灵活，只是让你能够开始进行项目的一种临时方式。如果你发现你确实要定制
逻辑或视图，那就应当推翻脚手架，开始写自己的代码。下一节介绍的 CakePHP 的 Bake 
控制台是下一步的绝佳选择：它生成所有的代码，可以产生与大部分脚手架相同的结果。

脚手架是编写 web 应用程序初始部分的一个很好的方法。早期的数据库结构随时会变更，
这在设计过程的初期是完全正常的。其负面影响是：web 开发人员痛恨编写永远不会实际用
到的表单。为了减轻开发人员的这种愤愤不平，CakePHP 中加入了脚手架。脚手架分析数据
库表，并且建立带有添加、删除和编辑按钮的标准列表，编辑数据库中单条记录的标准表单，
查看数据库中单条记录的标准视图。

要将脚手架添加到应用程序中，只要在控制器中加入 ``$scaffold`` 变量::

    class CategoriesController extends AppController {
        public $scaffold;
    }

假设你已经建立了最基本的 Category 模型类文件(位于 /app/Model/Category.php 中)，那
么脚手架已经可以用了。要查看你的新脚手架，请访问 http://example.com/categories。

.. note::

    在使用脚手架的控制器中新建方法可能带来不想要的结果。例如，(如果你在脚手架控制
    器中建立了 index() 方法)，你的 index 方法将被渲染，而脚手架功能则不会被渲染。

脚手架知道模型的关联，所以，如果你的 Category 模型 ``belongsTo`` (属于) User 模型，
你将会在 Category 的列表中看到关联的 User ID。尽管脚手架“知道”模型间的关系，但是
直到你在模型中手动添加关联代码，你才能在脚手架视图中看到关联的记录。例如，如果 
Group ``hasMany`` User (组包含很多用户)，并且 User ``belongsTo`` Group (用户也属
于组)，你必须在 User 和 Group 模型中手动添加如下代码。在你添加这些代码之前，视图
将在 New User 表单中显示空的 Group 下拉列表框；在你加入这些代码之后，视图将在 New
User 表单中显示来自 Group 表的 ID 或者名字构成的下拉列表::

    // 在 Group.php 中
    // In Group.php
    public $hasMany = 'User';
    // 在 User.php 中
    // In User.php
    public $belongsTo = 'Group';

如果你想看到除了 ID 外更多的东西(例如用户的姓)，你可以在模型中设置 
``$displayField`` 变量。让我们在 User 类中设置 ``$displayField`` 变量，以便在脚手
架中显示关联到 category 的用户的姓，而不只是 ID。这个特点使脚手架在许多情况下可读
性更强::

    class User extends AppModel {
        public $displayField = 'first_name';
    }


使用脚手架建立一个简单的管理界面
================================

如果你已经在 ``app/Config/core.php`` 中用 
``Configure::write('Routing.prefixes', array('admin'));`` 设置了允许管理路由
(*admin routing*)，就可以使用脚手架生成一个管理界面。

一旦你允许了管理路由，只要将管理前缀赋给脚手架变量::

    public $scaffold = 'admin';

现在你就可以访问管理的脚手架动作::

    http://example.com/admin/controller/index
    http://example.com/admin/controller/view
    http://example.com/admin/controller/edit
    http://example.com/admin/controller/add
    http://example.com/admin/controller/delete

这种方法能够很快地建立一个简单的后台界面。切记，不能同时使用脚手架搭建的管理和非
管理两类方法。如同正常脚手架一样，你可以重载个别方法，用自己的方法代替::

    public function admin_view($id = null) {
      // custom code here
    }

一旦你替换了脚手架搭建的动作，你还需要为这个动作创建视图文件。

定制脚手架视图
==============

如果你想在你的脚手架视图中使用一些不一样的东西，可以创建模板。虽然我们仍然不推荐
把这种技术用于生产环境的应用程序，不过在原型迭代阶段这种定制也许还是有用的。

用于某个控制器的定制脚手架视图(这里以 PostsController 为例)应该位于::

    app/View/Posts/scaffold.index.ctp
    app/View/Posts/scaffold.form.ctp
    app/View/Posts/scaffold.view.ctp

用于所有控制器的定制脚手架视图应该位于::

    app/View/Scaffolds/index.ctp
    app/View/Scaffolds/form.ctp
    app/View/Scaffolds/view.ctp


.. meta::
    :title lang=zh: Scaffolding
    :keywords lang=zh: database schemas,loose structure,scaffolding,scaffold,php class,database tables,web developer,downside,web application,logic,developers,cakephp,running,current,delete,database application
