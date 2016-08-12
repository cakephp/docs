简单的 Acl 控制的应用
###########################################

.. note::

    这不是初学者的教程。如果你刚刚开始学习 CakePHP，我们建议你还是先对整个框架的
    特点全面了解之后再开始本教程。


在这个教程中，你将会使用 :doc:`/core-libraries/components/authentication` 和
:doc:`/core-libraries/components/access-control-lists` 创建一个简单的应用。这个
教程假设你已经阅读过 :doc:`/tutorials-and-examples/blog/blog`，并且熟悉
:doc:`/console-and-shells/code-generation-with-bake`。你应该对 CakePHP 有了一些
经验, 并且熟悉 MVC 概念。这个教程是对 :php:class:`AuthComponent` 和
:php:class:`AclComponent` 的一个简单介绍。

你所需要的：


#. 一个可以运行的 web 服务器。我们将假定你使用的是 Apache，不过使用其他服务器的
   步骤也差不多。我们也许要稍微调整服务器的配置，但大多数人完全不需要任何配置就
   可以让 CakePHP 运行起来。
#. 一个数据库服务器。在本教程中我们将使用 MySQL 数据库。你将会需要对 SQL 有足够
   的了解以便创建一个数据库：接下来就是 CakePHP 的事情了。
#. PHP 的基础知识。你使用面向对象编程越多越好，但如果你只熟悉面向过程编程也不要
   害怕。

准备我们的应用
=========================

首先，让我们获取一份最新的 CakePHP 的代码。

要获得最新的代码，请访问在 GitHub 上的 CakePHP 项目：
https://github.com/cakephp/cakephp/tags，并下载稳定发行版。对于本教程，你需要
最新的 2.0 发行版本。


你也可以使用 `git <http://git-scm.com/>`_ 检出最新的代码::

    git clone git://github.com/cakephp/cakephp.git

一旦你获得了最新的 CakePHP 代码，改变分支到最新的 2.0 版本，设置配置文件
database.php，修改 app/Config/core.php 文件中的 Security.salt 的值。然后我们会
建立一个简单的数据库结构，作为应用程序的基础。在数据库中执行如下的 SQL 语句::

   CREATE TABLE users (
       id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(255) NOT NULL UNIQUE,
       password CHAR(40) NOT NULL,
       group_id INT(11) NOT NULL,
       created DATETIME,
       modified DATETIME
   );


   CREATE TABLE groups (
       id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       created DATETIME,
       modified DATETIME
   );


   CREATE TABLE posts (
       id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
       user_id INT(11) NOT NULL,
       title VARCHAR(255) NOT NULL,
       body TEXT,
       created DATETIME,
       modified DATETIME
   );

   CREATE TABLE widgets (
       id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       part_no VARCHAR(12),
       quantity INT(11)
   );

这些是我们构建应用程序的其余部分要用到的表。一旦数据库中有了表结构，我们就可以
开始了。使用 :doc:`/console-and-shells/code-generation-with-bake` 快速创建你的
模型、控制器和视图。

要使用 cake bake，调用 ``cake bake all``，这会列出你插入到 MySQL 中的4个表，选择
"1. Group" 并按照提示操作。对其他 3 个表也进行同样的操作，这会为你生成 4 个控制
器、模型和相应的视图。

在这里要避免使用脚手架(*Scaffold*)。如果生成带有脚手架功能的控制器，将会严重影响
ACO(*Access Control Object*)的生成。

当自动生成模型代码时，cake 会自动探测出模型之间的关联(即表之间的关系)。让 cake
提供正确的 hasMany 和 belongsTo 关系。如果提示你选择 hasOne 或者 hasMany 关系，
在本教程中通常(只)需要 hasMany 关系。

现在先不管 admin 路由，没有它们这个话题已经够复杂的了。另外，在用 bake 生成控制
器时，一定 **不要** 添加 Acl 或者 Auth 组件到任何控制器中。我们很快就会着手于此。
你现在应该已经有了 users、groups、posts 和 widgets 的模型、控制器以及生成的视图。

准备添加 Auth
=====================

我们现在已经有一个运行正常的 CRUD 应用了。Bake 应该已经建立了我们所需要的关系，
如果没有，现在就加上。在添加 Auth 和 Acl 组件之前，我们还需要添加一些东西。首先，
添加 login 和 logout 动作到 ``UsersController`` 控制器::

    public function login() {
        if ($this->request->is('post')) {
            if ($this->Auth->login()) {
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Session->setFlash(__('Your username or password was incorrect.'));
        }
    }

    public function logout() {
        //现在先空着。
    }

然后，为 login 动作创建如下所示的视图文件 ``app/View/Users/login.ctp``::

    <?php
    echo $this->Form->create('User', array('action' => 'login'));
    echo $this->Form->inputs(array(
        'legend' => __('Login'),
        'username',
        'password'
    ));
    echo $this->Form->end('Login');
    ?>

接下来，我们需要更新我们的 User 模型，在保存到数据库之前先将密码散列化。存储普通
文本格式的密码是极其危险的，并且 AuthComponent 组件会期望你的密码是经过散列化过
的。在 ``app/Model/User.php`` 文件中添加如下代码::

    App::uses('AuthComponent', 'Controller/Component');
    class User extends AppModel {
        // 其它代码。

        public function beforeSave($options = array()) {
            $this->data['User']['password'] = AuthComponent::password(
              $this->data['User']['password']
            );
            return true;
        }
    }

接下来要改动一下 ``AppController``。如果还没有
``/app/Controller/AppController.php``，就创建该文件。因为我们要使用 Auth 和 Acl
组件控制整个网站，所以我们会在 ``AppController`` 中把它们设置好::

    class AppController extends Controller {
        public $components = array(
            'Acl',
            'Auth' => array(
                'authorize' => array(
                    'Actions' => array('actionPath' => 'controllers')
                )
            ),
            'Session'
        );
        public $helpers = array('Html', 'Form', 'Session');

        public function beforeFilter() {
            //配置 AuthComponent 组件
            $this->Auth->loginAction = array(
              'controller' => 'users',
              'action' => 'login'
            );
            $this->Auth->logoutRedirect = array(
              'controller' => 'users',
              'action' => 'login'
            );
            $this->Auth->loginRedirect = array(
              'controller' => 'posts',
              'action' => 'add'
            );
        }
    }

在设置 ACL 组件之前，需要添加一些用户和组。因为启用了 :php:class:`AuthComponent`
组件，我们无法访问任何动作，因为还没有登录。现在我们添加一些特例，这样
:php:class:`AuthComponent` 组件就会允许我们创建一些组和用户。在
``GroupsController`` 控制器和 ``UsersController`` 控制器中 **都** 添加::

    public function beforeFilter() {
        parent::beforeFilter();

        // 对 CakePHP 2.0
        $this->Auth->allow('*');

        // 对 CakePHP 2.1 及以上版本
        $this->Auth->allow();
    }

这些语句告诉 AuthComponent 组件，允许公开访问所有动作。这只是临时的，一旦我们在
数据库中有了一些用户和组之后就会去掉。只是现在还不要添加任何用户或组。

初始化 Db Acl 表
============================

在我们创建任何用户或者组之前，我们要把它们连接到 Acl 组件。不过，我们现在还没有
任何 Acl 组件的表，如果你现在试图访问任何页面，你可能会得到表不存在的错误（
"Error: Database table acos for model Aco was not found."）。要消除这些错误，我们
需要运行一个数据结构（*schema*）文件。在命令行执行下面的命令::

    ./Console/cake schema create DbAcl

这个脚本会提示你删除并新建表。对删除和创建表的请求回答 yes。

如果你没有访问外壳(*shell*)的权限，或者无法使用终端，你可以执行 sql 文件
/path/to/app/Config/Schema/db\_acl.sql。

为数据输入设置了控制器，也初始化了 Acl 组件的表，这就行了吗？还不够，还需要在
用户(*user*)和组(*group*)模型中稍做改动，也就是说，让他们自动地附加上 Acl 组件。

作为请求者
===================

为了让 Auth 组件和 Acl 组件正常工作，我们需要将用户(*users*)表和组(*groups*)表同
Acl 组件的表中的记录进行关联。为此需要用到 ``AclBehavior`` 行为。``AclBehavior``
允许将模型自动连接到 Acl 组件的表。使用它需要在模型中实现 ``parentNode()`` 方法。
在 ``User`` 模型中添加如下代码::

    class User extends AppModel {
        public $belongsTo = array('Group');
        public $actsAs = array('Acl' => array('type' => 'requester'));

        public function parentNode() {
            if (!$this->id && empty($this->data)) {
                return null;
            }
            if (isset($this->data['User']['group_id'])) {
                $groupId = $this->data['User']['group_id'];
            } else {
                $groupId = $this->field('group_id');
            }
            if (!$groupId) {
                return null;
            }
            return array('Group' => array('id' => $groupId));
        }
    }

然后在 ``Group`` 模型中添加如下代码::

    class Group extends AppModel {
        public $actsAs = array('Acl' => array('type' => 'requester'));

        public function parentNode() {
            return null;
        }
    }

我们所做的，就是将 ``Group`` 和 ``User`` 模型与 Acl 组件联系起来，并告诉 CakePHP
每次你创建一个用户(*User*)或组(*Group*)的同时也要在 ``aros`` 表中创建一条记录。
这使得 Acl 的管理轻而易举，因为 ARO 透明地与 ``users`` 和 ``groups`` 表绑定在
一起了。所以，每次创建或者删除一个用户/组的同时，Aro 表也会更新。

我们的控制器和模型已经可以添加一些初始数据了，而且我们的 ``Group`` 和 ``User``
模型已经绑定到 Acl 组件的表了。所以可以浏览 http://example.com/groups/add 和
http://example.com/users/add，使用自动生成的表单添加一些组和用户。我添加了这些组：

-  administrators
-  managers
-  users

我同时也在每个组中创建了一个用户，这样每个不同访问权限组都有一个用户，用于之后的
测试。(把这些组和用户)全部记录下来，或者选用简单的密码，以免忘记。如果在 MySQL
提示符后运行 ``SELECT * FROM aros;``，应该可以看到象下面这样的记录::

    +----+-----------+-------+-------------+-------+------+------+
    | id | parent_id | model | foreign_key | alias | lft  | rght |
    +----+-----------+-------+-------------+-------+------+------+
    |  1 |      NULL | Group |           1 | NULL  |    1 |    4 |
    |  2 |      NULL | Group |           2 | NULL  |    5 |    8 |
    |  3 |      NULL | Group |           3 | NULL  |    9 |   12 |
    |  4 |         1 | User  |           1 | NULL  |    2 |    3 |
    |  5 |         2 | User  |           2 | NULL  |    6 |    7 |
    |  6 |         3 | User  |           3 | NULL  |   10 |   11 |
    +----+-----------+-------+-------------+-------+------+------+
    6 rows in set (0.00 sec)

这告诉我们已经有了 3 个组和 3 个用户。用户嵌套在组中，这样我们就可以按组或者按
用户设置权限。

只按组的 ACL
--------------

如果我们要简单一些，只按组设置的权限，需要在 ``User`` 模型中实现 ``bindNode()``
方法::

    public function bindNode($user) {
        return array('model' => 'Group', 'foreign_key' => $user['User']['group_id']);
    }

然后修改 ``User`` 模型的 ``actsAs`` 变量，禁用 requester 指令::

    public $actsAs = array('Acl' => array('type' => 'requester', 'enabled' => false));

这两处改动会告诉 ACL 忽略检查 ``User`` Aro，而只检查 ``Group`` Aro's。这样也避免
了对 afterSave 回调的调用。

注意：每个用户都需要设置 ``group_id`` 才行。

现在 ``aros`` 表会是这样::

    +----+-----------+-------+-------------+-------+------+------+
    | id | parent_id | model | foreign_key | alias | lft  | rght |
    +----+-----------+-------+-------------+-------+------+------+
    |  1 |      NULL | Group |           1 | NULL  |    1 |    2 |
    |  2 |      NULL | Group |           2 | NULL  |    3 |    4 |
    |  3 |      NULL | Group |           3 | NULL  |    5 |    6 |
    +----+-----------+-------+-------------+-------+------+------+
    3 rows in set (0.00 sec)

注意：如果你到这里一直跟随此教程，你需要删除你的表，包括 ``aros``，``groups`` 和
``users``，然后从头重新创建组和用户，才能得到上面的 ``aros`` 表。

创建 ACO (Access Control Objects)
======================================

现在我们已经有了用户和组(aro)，我们可以开始把现有的控制器输入到 Acl 中，并对组和
用户设置权限，并启用登录/登出。

我们的 ARO 会在新建户和组的时候自动创建。有没有什么办法从控制器和动作来自动创建
ACO？可惜 CakePHP 的核心没有这样的魔法。不过核心类提供了一些方法来手动创建 ACO。
你可以通过 Acl 外壳程序或者 ``AclComponent`` 组件创建 ACO。从外壳程序创建 Aco::

    ./Console/cake acl create aco root controllers

而使用 AclComponent 组件就是::

    $this->Acl->Aco->create(array('parent_id' => null, 'alias' => 'controllers'));
    $this->Acl->Aco->save();

上面两个例子都会创建 'root' 或者顶层 ACO，会叫做 'controllers' 。这个根(*root*)
节点的目的，是为了在整个应用程序的范围内更容易地允许/拒绝访问，并且允许把 Acl
组件用于和控制器/动作无关的目的，比如检查模型记录的访问权限。既然我们要使用全局
的根(*root*) ACO，我们要略微修改 ``AuthComponent`` 组件的配置。``AuthComponent``
组件需要知道这个根节点的存在，这样当进行 ACL 检查的时候，它可以在查找控制器/动作
时使用正确的节点路径。在 ``AppController`` 中确保 ``$components`` 数组中包含先前
定义的 ``actionPath``::

    class AppController extends Controller {
        public $components = array(
            'Acl',
            'Auth' => array(
                'authorize' => array(
                    'Actions' => array('actionPath' => 'controllers')
                )
            ),
            'Session'
        );

本教程在 :doc:`part-two` 中继续。


.. meta::
    :title lang=zh: Simple Acl controlled Application
    :keywords lang=zh: core libraries,auto increment,object oriented programming,database schema,sql statements,php class,stable release,code generation,database server,server configuration,reins,access control,shells,mvc,authentication,web server,cakephp,servers,checkout,apache
