简单的身份验证和授权应用
########################

接着我们的 :doc:`/tutorials-and-examples/blog/blog` 的例子，设想一下我们想要根据
登录的用户来保护某些网址。我们还有另外一个要求，允许我们的博客应用有多个作者，每
一位作者都可以创作他们自己的文章(*posts*)，随意编辑和删除它们，而不允许其他作者
对自己的文章做任何改动。

创建所有用户的相关代码
======================

首先，让我们在博客数据库中新建一个表来保存用户的数据::

    CREATE TABLE users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(255),
        role VARCHAR(20),
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

我们遵循CakePHP的约定来给表命名，同时我们也利用了另一个约定：在users表中使用
username和password列，CakePHP能够自动配置好实现用户登录的大部分工作。

下一步是创建 User 模型，负责查询、保存和验证任何用户数据::

    // app/Model/User.php
    App::uses('AppModel', 'Model');

    class User extends AppModel {
        public $validate = array(
            'username' => array(
                'required' => array(
                    'rule' => array('notBlank'),
                    'message' => 'A username is required'
                )
            ),
            'password' => array(
                'required' => array(
                    'rule' => array('notBlank'),
                    'message' => 'A password is required'
                )
            ),
            'role' => array(
                'valid' => array(
                    'rule' => array('inList', array('admin', 'author')),
                    'message' => 'Please enter a valid role',
                    'allowEmpty' => false
                )
            )
        );
    }

让我们也创建 UsersController 控制器，下面的代码是使用 CakePHP 捆绑的代码生成工具
生成的基本的 UsersController 类::

    // app/Controller/UsersController.php
    App::uses('AppController', 'Controller');

    class UsersController extends AppController {

        public function beforeFilter() {
            parent::beforeFilter();
            $this->Auth->allow('add');
        }

        public function index() {
            $this->User->recursive = 0;
            $this->set('users', $this->paginate());
        }

        public function view($id = null) {
            $this->User->id = $id;
            if (!$this->User->exists()) {
                throw new NotFoundException(__('Invalid user'));
            }
            $this->set('user', $this->User->findById($id));
        }

        public function add() {
            if ($this->request->is('post')) {
                $this->User->create();
                if ($this->User->save($this->request->data)) {
                    $this->Flash->success(__('The user has been saved'));
                    return $this->redirect(array('action' => 'index'));
                }
                $this->Flash->error(
                    __('The user could not be saved. Please, try again.')
                );
            }
        }

        public function edit($id = null) {
            $this->User->id = $id;
            if (!$this->User->exists()) {
                throw new NotFoundException(__('Invalid user'));
            }
            if ($this->request->is('post') || $this->request->is('put')) {
                if ($this->User->save($this->request->data)) {
                    $this->Flash->success(__('The user has been saved'));
                    return $this->redirect(array('action' => 'index'));
                }
                $this->Flash->error(
                    __('The user could not be saved. Please, try again.')
                );
            } else {
                $this->request->data = $this->User->findById($id);
                unset($this->request->data['User']['password']);
            }
        }

        public function delete($id = null) {
            // 在 2.5 版本之前，请使用
            // $this->request->onlyAllow('post');

            $this->request->allowMethod('post');

            $this->User->id = $id;
            if (!$this->User->exists()) {
                throw new NotFoundException(__('Invalid user'));
            }
            if ($this->User->delete()) {
                $this->Flash->success(__('User deleted'));
                return $this->redirect(array('action' => 'index'));
            }
            $this->Flash->error(__('User was not deleted'));
            return $this->redirect(array('action' => 'index'));
        }

    }

.. versionchanged:: 2.5
    自从 2.5 版本起，请使用 ``CakeRequest::allowMethod()`` 而不是
    ``CakeRequest::onlyAllow()`` (已作废)。

以我们创建博客文章的视图同样的方式，或者使用代码生成工具，我们来实现视图。出于
这个教程的目的，这里仅展示 add.ctp 视图：

.. code-block:: php

    <!-- app/View/Users/add.ctp -->
    <div class="users form">
    <?php echo $this->Form->create('User'); ?>
        <fieldset>
            <legend><?php echo __('Add User'); ?></legend>
            <?php echo $this->Form->input('username');
            echo $this->Form->input('password');
            echo $this->Form->input('role', array(
                'options' => array('admin' => 'Admin', 'author' => 'Author')
            ));
        ?>
        </fieldset>
    <?php echo $this->Form->end(__('Submit')); ?>
    </div>

身份验证 (登录和登出)
=====================

我们现在已经准备好添加我们的认证层了。在 CakePHP 中，这是由
:php:class:`AuthComponent` 组件处理的，这个类负责为某些动作要求用户登录，处理
用户登录和登出，并且授权登录的用户访问他们有权限到达的的动作。

要添加这个组件到应用程序中，打开 ``app/Controller/AppController.php`` 文件，添加
如下代码::

    // app/Controller/AppController.php
    class AppController extends Controller {
        //...

        public $components = array(
            'Flash',
            'Auth' => array(
                'loginRedirect' => array(
                    'controller' => 'posts',
                    'action' => 'index'
                ),
                'logoutRedirect' => array(
                    'controller' => 'pages',
                    'action' => 'display',
                    'home'
                ),
                'authenticate' => array(
                    'Form' => array(
                        'passwordHasher' => 'Blowfish'
                    )
                )
            )
        );

        public function beforeFilter() {
            $this->Auth->allow('index', 'view');
        }
        //...
    }

这里没有多少需要配置的，因为我们的 users 表遵循了命名约定。我们只设置了在登录和登出的动作完成之后要加载的网址，在我们的
例子中，分别是 ``/posts/`` 和 ``/`` 。

我们在 ``beforeFilter`` 回调函数中所做的是告诉 AuthComponent 组件，在每个控制器
中所有的 ``index`` 和 ``view`` 动作中都不需要登录。我们希望我们的访问者不需要在
网站中注册就能够读取并列出文章。

现在，我们需要能够注册新用户，保存它们的用户名和密码，而且，更重要的是，哈希
(*hash*)他们的密码，这样在我们的数据库中就不是用普通文本形式保存用户的密码了。让
我们告诉 AuthComponent 组件让未验证的用户访问添加用户函数，并实现登录和登出动作::

    // app/Controller/UsersController.php

    public function beforeFilter() {
        parent::beforeFilter();
        // Allow users to register and logout.
        $this->Auth->allow('add', 'logout');
    }

    public function login() {
        if ($this->request->is('post')) {
            if ($this->Auth->login()) {
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Flash->error(__('Invalid username or password, try again'));
        }
    }

    public function logout() {
        return $this->redirect($this->Auth->logout());
    }

密码的哈希还没有做，打开 ``app/Model/User.php`` 模型文件，添加如下代码::

    // app/Model/User.php

    App::uses('AppModel', 'Model');
    App::uses('BlowfishPasswordHasher', 'Controller/Component/Auth');

    class User extends AppModel {

    // ...

    public function beforeSave($options = array()) {
        if (isset($this->data[$this->alias]['password'])) {
            $passwordHasher = new BlowfishPasswordHasher();
            $this->data[$this->alias]['password'] = $passwordHasher->hash(
                $this->data[$this->alias]['password']
            );
        }
        return true;
    }

    // ...

.. note::

    BlowfishPasswordHasher 类使用更强的哈希算法(bcrypt)，而不是
    SimplePasswordHasher (sha1)，提供用户级的 salt。SimplePasswordHasher 类会在
    CakePHP 3.0 版本中去掉。

所以，现在每次保存用户的时候，都会使用 BlowfishPasswordHasher 类进行哈希。我们还
缺 login 函数的模板视图文件。打开文件 ``app/View/Users/login.ctp``，添加如下这些
行：

.. code-block:: php

    //app/View/Users/login.ctp

    <div class="users form">
    <?php echo $this->Flash->render('auth'); ?>
    <?php echo $this->Form->create('User'); ?>
        <fieldset>
            <legend>
                <?php echo __('Please enter your username and password'); ?>
            </legend>
            <?php echo $this->Form->input('username');
            echo $this->Form->input('password');
        ?>
        </fieldset>
    <?php echo $this->Form->end(__('Login')); ?>
    </div>

现在你可以访问 ``/users/add`` 网址来注册新用户，并在 ``/users/login`` 网址使用新
创建的凭证登录。也可以试试访问任何其它没有明确允许访问的网址，比如
``/posts/add``，你会看到应用程序会自动转向到登录页面。

就是这样！简单到不可思议。让我们回过头来解释一下发生的事情。``beforeFilter``
回调函数告诉 AuthComponent 组件，除了在 AppController 的 ``beforeFilter`` 函数中
已经允许访问的 ``index`` 和 ``view`` 动作，对 ``add`` 动作也不要求登录。

``login`` 动作调用 AuthComponent 组件的 ``$this->Auth->login()`` 函数，这不需要任何更多的设置，因为，正如之前提到的，我们遵循了约定。即，User
模型有 username 和 password 列，使用表单提交用户的数据到控制器。这个函数返回登录
是否成功，如果成功，就重定向用户到在我们把 AuthComponent 组件添加到应用程序中时
所设置的跳转网址。

要登出，只需要访问网址 ``/users/logout``，就会重定向用户到先前描述的配置好了的
logoutUrl。这个网址就是 ``AuthComponent::logout()`` 函数成功时返回的结果。

权限(谁可以访问什么)
====================

前面已经说了，我们要把这个博客应用改成多用户的创作工具，为此，我们需要稍微修改
posts 表，添加对 User 模型的引用::

    ALTER TABLE posts ADD COLUMN user_id INT(11);

另外，必须对 PostsController 做一个小改动，在新增的文章中要把当前登录的用户作为
引用保存::

    // app/Controller/PostsController.php
    public function add() {
        if ($this->request->is('post')) {
            //Added this line
            $this->request->data['Post']['user_id'] = $this->Auth->user('id');
            if ($this->Post->save($this->request->data)) {
                $this->Flash->success(__('Your post has been saved.'));
                return $this->redirect(array('action' => 'index'));
            }
        }
    }

由组件提供的 ``user()`` 函数，返回当前登录用户的任何列。我们使用这个方法将数据
加入请求信息中，来保存。

让我们增强应用程序的安全性，避免一些作者编辑或删除其他作者的文章。应用的基本规则
是，管理用户可以访问任何网址，而普通用户(作者角色)只能访问允许的动作。再次打开
AppController 类，在 Auth 的配置中再添加一些选项::

    // app/Controller/AppController.php

    public $components = array(
        'Flash',
        'Auth' => array(
            'loginRedirect' => array('controller' => 'posts', 'action' => 'index'),
            'logoutRedirect' => array(
                'controller' => 'pages',
                'action' => 'display',
                'home'
            ),
            'authorize' => array('Controller') // Added this line
        )
    );

    public function isAuthorized($user) {
        // Admin 可以访问每个动作
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true;
        }

        // 默认不允许访问
        return false;
    }

我们只创建了一个非常简单的权限机制。在这个例子中，``admin`` 角色的用户在登录后
可以访问网站的任何网址，而其余的用户(即角色 ``author``)不能够做任何与未登录的
用户不同的事情。

这并不是我们所想要的，所以我们需要为 ``isAuthorized()`` 方法提供更多的规则。但
不是在 AppController 中设置，而是在每个控制器提供这些额外的规则。我们要在
PostsController 中增加的规则，应当允许作者创建文章，但在作者不匹配时要防止对其
文章的编辑。打开  ``PostsController.php`` 文件，添加如下内容::

    // app/Controller/PostsController.php

    public function isAuthorized($user) {
        // 所有注册的用户都能够添加文章
        if ($this->action === 'add') {
            return true;
        }

        // 文章的所有者能够编辑和删除它
        if (in_array($this->action, array('edit', 'delete'))) {
            $postId = (int) $this->request->params['pass'][0];
            if ($this->Post->isOwnedBy($postId, $user['id'])) {
                return true;
            }
        }

        return parent::isAuthorized($user);
    }

现在，如果在父类中已授权该用户，我们就重载 AppController 的 ``isAuthorized()`` 方法的调用和内部的检查。如果用户未被授权，则只允许他访问 add 动作，并有条件地
访问 edit 和 delete 动作。最后要实现的是判断用户是否有权限编辑文章，为此调用
Post 模型的 ``isOwnedBy()`` 方法。通常，最佳实践是尽量把逻辑挪到模型中。下面让
我们来实现这个函数::

    // app/Model/Post.php

    public function isOwnedBy($post, $user) {
        return $this->field('id', array('id' => $post, 'user_id' => $user)) !== false;
    }


简单的身份验证和授权教程到这里就结束了。要保护 UsersController 控制器，可以采用
我们在 PostsController 控制器中的做法。你也可以更有造作性，根据你自己的规则在
AppController 控制器中添加更普遍的规则。

如果你需要更多的控制，我们建议你阅读完整的 Auth 组件的指南
:doc:`/core-libraries/components/authentication`，你可以看到更多该组件的配置，
创建自定义的 Authorization 类，以及更多信息。

后续阅读的建议
--------------

1. :doc:`/console-and-shells/code-generation-with-bake` 生成基本的 CRUD 代码
2. :doc:`/core-libraries/components/authentication`: 用户注册和登录


.. meta::
    :title lang=zh: Simple Authentication and Authorization Application
    :keywords lang=zh: auto increment,authorization application,model user,array,conventions,authentication,urls,cakephp,delete,doc,columns
