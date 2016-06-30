简单的 Acl 控制的应用 - 第 2 部分
#################################

创建 ACO 的自动化工具
=====================

正如前面提到的，没有预建的方法把所有的控制器和动作都输入到 Acl 中。然而，我们都
痛恨重复的工作，比如键入一个大型应用程序中的上百个动作。

为此，在 Github 中有一个很方便的插件，叫做 
`AclExtras <https://github.com/markstory/acl_extras/>`_，可以在 
`Github 下载页面 <https://github.com/markstory/acl_extras/zipball/master>`_ 
下载。我们会简要介绍如何使用它来生成所有的 ACO。

首先，获取一份该插件的拷贝并解压，或者用 git 克隆，放入目录 
`app/Plugin/AclExtras`。然后在 `app/Config/boostrap.php` 文件中启用该插件，如下
所示::

    //app/Config/boostrap.php
    // ...
    CakePlugin::load('AclExtras');

最后，在 CakePHP 终端中执行如下命令::


    ./Console/cake AclExtras.AclExtras aco_sync

这样可以获得所有可用命令的完整说明::

    ./Console/cake AclExtras.AclExtras -h
    ./Console/cake AclExtras.AclExtras aco_sync -h

一旦填充完 `acos` 表之后，继续创建应用的权限。

设置权限
========

创建权限很像创建 ACO，没有什么神奇的办法，我也没什么好办法。要允许 ARO 访问 ACO，
从外壳(*shell*)接口使用 AclShell。欲知如何使用，可以运行下面的命令来查看 AclShell 
的帮助::

    ./Console/cake acl --help

注意 : \* 需要被引号包起来 ('\*')
 
为了用 ``AclComponent`` 给予(权限)，要在自定义的方法中使用如下的代码::

    $this->Acl->allow($aroAlias, $acoAlias);

现在要添加一些允许/拒绝的语句。在 ``UsersController`` 中添加下面的代码到一个临时
的函数中，然后从浏览器中访问该网址(例如 http://localhost/cake/app/users/initdb)来
运行。如果运行 ``SELECT * FROM aros_acos`` 应当看到很多 1 和 -1。一旦确认权限设置
好了，就可以删除这个函数::


    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('initDB'); // 用完之后就可以删除这一行
    }

    public function initDB() {
        $group = $this->User->Group;

        // 允许 admins 访问一切
        $group->id = 1;
        $this->Acl->allow($group, 'controllers');

        // 允许 managers 访问 posts 和 widgets
        $group->id = 2;
        $this->Acl->deny($group, 'controllers');
        $this->Acl->allow($group, 'controllers/Posts');
        $this->Acl->allow($group, 'controllers/Widgets');

        // 只允许 users 添加和编辑 posts 和 widgets
        $group->id = 3;
        $this->Acl->deny($group, 'controllers');
        $this->Acl->allow($group, 'controllers/Posts/add');
        $this->Acl->allow($group, 'controllers/Posts/edit');
        $this->Acl->allow($group, 'controllers/Widgets/add');
        $this->Acl->allow($group, 'controllers/Widgets/edit');
        
        // 允许基本用户登出
        $this->Acl->allow($group, 'controllers/users/logout');

        // 加上 exit，避免糟糕的 "missing views" 错误消息
        echo "all done";
        exit;
    }

现在我们建立了一些基本的访问规则。我们允许 administrators 访问所有的资源。
Managers 可以访问 posts 和 widgets 中的任何动作。而 users 只能访问 posts 和 
widgets 的 add 和 edit 动作。

我们需要获得 ``Group`` 模型的引用，并且修改它的 id，才能指定需要的 ARO，这是由于 
``AclBehavior`` 行为的工作方式。``AclBehavior`` 行为并不设置 ``aros`` 表中的 
alias 字段，所以我们必须使用对象引用或者数组，来指定我们需要的 ARO。

你可能已经注意到我故意在 Acl 的权限中省略了 index 和 view 动作。我们要让 
``PostsController`` 和 ``WidgetsController`` 控制器的 view 和 index 动作是公开
动作，这允许未经身份验证的用户来查看这些页面，那么这些页面就是公开页面了。然而，
你也可以随时从 ``AuthComponent::allowedActions`` 方法中删除这些动作，index 和 
view 动作的权限就会恢复到在 Acl 中的设置。

现在我们要拿掉 users 和 groups 控制器中 ``Auth->allowedActions`` 的引用。然后在 
posts 和 widgets 控制器中添加如下代码::

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('index', 'view');
    }

这些去掉了我们前面的在 users 和 groups 控制器中加入的 '关闭开关'，并允许对 posts 
和 widgets 控制器的 index 和 view 动作的公开访问。在 
``AppController::beforeFilter()`` 中添加::

     $this->Auth->allow('display');

这让 'display' 动作公开。让我们的 PagesController::display() 公开，这是重要的，
因为通常默认路由会将这一行动视为访问应用程序的主页。

登录
====

我们的应用现在有了访问控制，并且任何企图查看非公开页面的尝试都会重定向到登录页面。
不过，我们需要创建登录视图，这样用户才能够登录。如果你还没有这么做，请在 
``app/View/Users/login.ctp`` 中添加如下代码:

.. code-block:: php

    <h2>Login</h2>
    <?php
    echo $this->Form->create('User', array(
        'url' => array(
            'controller' => 'users', 
            'action' => 'login'
        )
    ));
    echo $this->Form->input('User.username');
    echo $this->Form->input('User.password');
    echo $this->Form->end('Login');

如果一个用户已经登录了，添加这个方法到 UsersController 来重定向::

    public function login() {
        if ($this->Session->read('Auth.User')) {
            $this->Session->setFlash('You are logged in!');
            return $this->redirect('/');
        }
    }

你应该已经能够登录了，一切都应该自动工作了。如果你添加了 
``echo $this->Session->flash('auth')`` ，当被拒绝访问的时候就会看到 Auth 组件的
消息。

登出
====

现在轮到登出了。之前我们让这个方法为空，现在是时候实现它了。在 
``UsersController::logout()`` 中添加如下代码::

    $this->Session->setFlash('Good-Bye');
    $this->redirect($this->Auth->logout());

这设置了会话闪现提示消息，并且使用 Auth 组件的 logout 方法登出用户。Auth 组件的 
logout 方法基本上是删除 Auth 的会话键(*Session Key*)，并且返回可用于重定向的网址。
如果有其它的会话数据也需要删除，也要在这里添加代码。

全部完成
========

现在你应该已经有一个使用 Auth 和 Acl 组件控制的应用程序了。用户的权限在组(*group*
)一级设置，但是也可以同时在用户(*user*)一级进行设置。你也可以按全局、按控制器和按
动作来设置权限。此外，你有一组可重用的代码块，可以随着你的应用程序的成长，容易地
扩展 ACO 表。


.. meta::
    :title lang=zh: Simple Acl controlled Application - part 2
    :keywords lang=zh: shell interface,magic solution,aco,unzipped,config,sync,syntax,cakephp,php,running,acl
