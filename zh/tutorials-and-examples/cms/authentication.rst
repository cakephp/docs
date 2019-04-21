CMS 教案 - 认证
#############################

我们现在需要加入登陆以及权限控制等到我们的 CMS 中。


添加密码哈希 
-----------------------

现在用户的密码都是以纯文本形式保存在数据库中，我们需要修复这个安全漏洞。

在此，让我们仔细地讨论下 CakePHP 的模型层。在 CakePHP 中，我们将代表单个数据的抽象叫做 ``Entity`` 类，
将操作 ``Entity`` 集合的类叫做 ``Table``。

由于密码哈希是在单个数据上面的操作，因此我们将在 Entity 对象中实现。每一次秘密被加入时，我们都应该使用哈希，
因此我们将用到 setter。根据约定，CakePHP 将会调用相应的 setter 当一个属性被附属值时。加入以下代码给密码
属性加入 setter::


    <?php
    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher; // Add this line
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // Code from bake.

        // Add this method
        protected function _setPassword($value)
        {
            if (strlen($value)) {
                $hasher = new DefaultPasswordHasher();

                return $hasher->hash($value);
            }
        }
    }

现在打开 **http://localhost:8765/users** ，它将展示很多的 user。你可以在 :doc:`安装 <installation>`
时编辑默认用户。如果你编辑用户的密码，你应该看到在用户的密码栏看到一段哈希值。CakePHP 默认使用 `bcrypt
<http://codahale.com/how-to-safely-store-a-password/>` 哈希方法。如果有需要，你也可以使用 SHA-1 或者 MD5，
但是我们推荐 bcrypt。


添加登陆功能
============

在 CakePHP 中，认证是通过 :doc:`/controllers/components` 实现的。我们可以将组件想象成某功能或概念一段可重复使用
控制器代码。组件可勾入控制器事件的生命周期并由此和应用互动。首先我们将添加 :doc:`AuthComponent
</controllers/components/authentication>` 组件。添加，编辑和删除动作需要认证，在 AppController 中添加以下
代码::


    // In src/Controller/AppController.php
    namespace App\Controller;

    use Cake\Controller\Controller;

    class AppController extends Controller
    {
        public function initialize()
        {
            // Existing code

            $this->loadComponent('Auth', [
                'authenticate' => [
                    'Form' => [
                        'fields' => [
                            'username' => 'email',
                            'password' => 'password'
                        ]
                    ]
                ],
                'loginAction' => [
                    'controller' => 'Users',
                    'action' => 'login'
                ],
                 // If unauthorized, return them to page they were just on
                'unauthorizedRedirect' => $this->referer()
            ]);

            // Allow the display action so our PagesController
            // continues to work. Also enable the read only actions.
            $this->Auth->allow(['display', 'view', 'index']);
        }
    }


以上代码要求 CakePHP 加载了 ``Auth`` 组件。由于我们需要使用 ``email`` 作为用户名，所以简单定义了
 AuthComponent 的属性。现在如果我们浏览被保护的 URL，比如 ``/articles/add``， 页面将会跳转至
 **/users/login**，由于我们还没有完成此页面，因此它会报错。让我们添加登陆动作::


    // In src/Controller/UsersController.php
    public function login()
    {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                return $this->redirect($this->Auth->redirectUrl());
            }
            $this->Flash->error('Your username or password is incorrect.');
        }
    }

在 **src/Template/Users/login.ctp**  视图中加入以下::

    <h1>Login</h1>
    <?= $this->Form->create() ?>
    <?= $this->Form->control('email') ?>
    <?= $this->Form->control('password') ?>
    <?= $this->Form->button('Login') ?>
    <?= $this->Form->end() ?>

我们完成了一个简单的登陆页面，可以使用一个用户账号尝试登陆。

.. note::


    如果目前的数据库没有用户密码，你可以先注释掉 ``loadComponent('Auth')`` 和 ``$this->Auth->allow()``，
    这样你就可以使用编辑页面来给用户添加密码。当然请记得添加完以后取消注释！


让我们测试一下！首先打开 ``/articles/add`` 页面，由于这是受保护页面，你将被重定向至登陆页面。
成功登陆以后，CakePHP 将跳转至 ``/articles/add``。



添加注销功能
=============

现在用户虽然可以登录，但是没有办法注销，让我们添加此功能。在 ``UsersController`` 控制器中
加入以下代码::

    public function initialize()
    {
        parent::initialize();
        $this->Auth->allow(['logout']);
    }

    public function logout()
    {
        $this->Flash->success('You are now logged out.');
        return $this->redirect($this->Auth->logout());
    }

此段代码首先将 ``logout`` 加入到了 ``AuthComponent `` 组件的白名单中，因此我们可以无认证地访问。然后实现
了注销方法。现在我们便可以通过访问 ``/users/logout`` 来注销当前用户。注销以后，它将自动跳转至登陆页面。



添加注册功能
======================

如果你在登陆前访问  **/users/add** 页面，它将跳转至登陆页面。我们需要添加注册功能，用户才能使用我们的应用。
在 ``UsersController`` 控制器中加入以下代码::


    public function initialize()
    {
        parent::initialize();
        // Add the 'add' action to the allowed actions list.
        $this->Auth->allow(['logout', 'add']);
    }

以上代码将 ``add()`` 行为列入了 ``AuthComponent`` 组件的白名单中，因此访问此行为将无需要认证或者授权。
你应该花点时间来清理下 **Users/add.ctp** 视图，比如删除没必要的衔接。此教程将不会加入编辑用户，查看用户以及用户列表
功能，但是你应该尝试自己将他们实现。



文章访问权限
==========================

用户登录以后，我们需要限制用户权限，每位用户应该仅能编辑自己创建的 articles 。我们可以通过使用 'authorization' 适配器
来实现。实现原理其实很简单，我们只需要使用 ``ArticlesController`` 控制器中的一个勾。在此之前，我们需要指导 ``AuthComponent`` 
如何去授权控制器动作。在 ``AppController`` 中加入以下代码::


    public function isAuthorized($user)
    {
        // By default deny access.
        return false;
    }


然后我们配置  ``AuthComponent`` 使用控制器的勾方法实现授权。更新后的 ``AppController::initialize()`` 方法
中的代码应该是这样::

        public function initialize()
        {
            // Existing code

            $this->loadComponent('Flash');
            $this->loadComponent('Auth', [
                // Added this line
                'authorize'=> 'Controller',
                'authenticate' => [
                    'Form' => [
                        'fields' => [
                            'username' => 'email',
                            'password' => 'password'
                        ]
                    ]
                ],
                'loginAction' => [
                    'controller' => 'Users',
                    'action' => 'login'
                ],
                 // If unauthorized, return them to page they were just on
                'unauthorizedRedirect' => $this->referer()
            ]);

            // Allow the display action so our pages controller
            // continues to work. Also enable the read only actions.
            $this->Auth->allow(['display', 'view', 'index']);
        }


我们的实现逻辑是：默认授予访问权限为拒绝，然后根据情况授予访问权限。我们首先为 articles 加入授权代码。在
``ArticlesController`` 加入以下代码::


    public function isAuthorized($user)
    {
        $action = $this->request->getParam('action');
        // The add and tags actions are always allowed to logged in users.
        if (in_array($action, ['add', 'tags'])) {
            return true;
        }

        // All other actions require a slug.
        $slug = $this->request->getParam('pass.0');
        if (!$slug) {
            return false;
        }

        // Check that the article belongs to the current user.
        $article = $this->Articles->findBySlug($slug)->first();

        return $article->user_id === $user['id'];
    }


现在尝试编辑或者删除一个不属于当前用户的 article，页面将会跳转到原始页面。如果你没有看到错误信息，在布局中加入
以下代码::

    // In src/Template/Layout/default.ctp
    <?= $this->Flash->render() ?>

接下来我们需要将 ``tags`` 行为让任何人访问，在 **src/Controller/ArticlesController.php** 的 ``initialize()`` 方法
中加入以下代码::


    $this->Auth->allow(['tags']);


以上这段相对简单的授权代码给我们以后创建复杂的授权逻辑提供了很好的基础。


修复 add 和 edit 行为
=============================

虽然我们已经给 edit 行为加入了认证，但是用户仍然可以在编辑 article 时修改它的 ``user_id`` 。我们将
马上修复这个问题。我们需要从 ``add`` 行为入手。

在添加 articles，我们可以使用当前当前用户的 ``user_id``::


    // in src/Controller/ArticlesController.php

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->getData());

            // Changed: Set the user_id from the session.
            $article->user_id = $this->Auth->user('id');

            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been saved.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to add your article.'));
        }
        $this->set('article', $article);
    }


接下来我们更新 ``edit`` 方法。用以下代码替换已有的 edit 方法::

    // in src/Controller/ArticlesController.php

    public function edit($slug)
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags') // load associated Tags
            ->firstOrFail();

        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData(), [
                // Added: Disable modification of user_id.
                'accessibleFields' => ['user_id' => false]
            ]);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been updated.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to update your article.'));
        }
        $this->set('article', $article);
    }

在这里我们我们使用了 ``patchEntity()`` 来成批修改属性。详情可参看 :ref:`changing-accessible-fields`。
在这里我们也删除了 ``user_id`` 输入控制，因为我们已经不需要。


结语
===========

我们成功了创建了一个简单的 CMS 应用。它的功能包括用户登录，发布，标示以及使用标签搜索文章。我们也通过 FormHelper
以及 ORM 提高了它的用户体验。

感谢您花时间来探索 CakePHP。接下来，你应该学习更多关于 :doc:`/orm` 的知识，或者细读 :doc:`/topics`。
