博客教程——添加一个层
********************

创建文章(*Post*)模型
====================

模型类是 CakePHP 应用程序的基础。通过创建一个能够和数据库交互的 CakePHP 模型，我
们可以有足够的基础，便于以后进行查看、添加、编辑和删除的操作。

CakePHP 的模型类文件应该在 ``/app/Model`` 目录中，我们要创建的文件将保存为
``/app/Model/Post.php``。该文件的完整内容应为::

    class Post extends AppModel {
    }

在 CakePHP 中，命名约定很重要。通过命名我们的模型为 Post，CakePHP 能自动推断出，
该模型是在 PostsController 中使用的，并且将被连接到数据库中名为 "posts" 的表。

.. note::

    如果 CakePHP 不能在 /app/Model 目录中找到相应的文件，它将自动为你动态创建一个
    模型对象。这也就意味着，如果你碰巧没有正确命名你的文件(比如命名为 post.php 或
    posts.php 而不是 Post.php)，CakePHP 将无法识别你的任何错误命名的模型类对象，
    而使用自动创建的模型对象代替。


关于模型的更多信息，比如表的前缀、回调和验证，请查看手册中的 :doc:`/models` 一章。


创建文章(*Post*)控制器
======================

接下来，为我们的文章(*post*)创建一个控制器。这个控制器是所有文章的商业逻辑起作用
的地方。总之，这里是你操纵模型，并完成有关文章的事情的地方。我们将把这个新的控制
器保存在 ``/app/Controller`` 目录下的 ``PostsController.php`` 文件中。这是控制器
的基本内容::

    class PostsController extends AppController {
        public $helpers = array('Html', 'Form');
    }

现在，让我们为控制器添加一个动作。动作通常代表应用中单个函数或者接口。例如，当用
户请求 www.example.com/posts/index (等同于 www.example.com/posts/)，他们将会期望
看到一个文章列表。这个动作的代码会是这样::

    class PostsController extends AppController {
        public $helpers = array('Html', 'Form');

        public function index() {
            $this->set('posts', $this->Post->find('all'));
        }
    }

通过在 PostsController 中定义方法 ``index()``，用户现在可以通过请求
www.example.com/posts/index 来访问该方法中的商业逻辑。同样的，如果定义一个方法
``foobar()`` ，用户将可以通过请求 www.example.com/posts/foobar 来访问。

.. warning::

    你也许会忍不住以某种方式来命名控制器和动作去得到一个特定的网址。请抵制住这种
    诱惑。请遵循 CakePHP 的规范(首字母大写，复数名词，等等)，创建易读和易于理解的
    动作名称。你可以使用"路由(*routes*)"将网址与你的代码映射起来，这个后面会讲到。

在该动作中唯一的语句使用 ``set()`` 方法从控制器中把数据传递到视图(*view*)中(我们
会在下一步创建视图)。该行代码设置名为'posts'的视图变量为 Post 模型的
``find('all')`` 方法的返回值。我们的 Post 模型自动可以通过 ``$this->Post`` 来访问，
是因为我们遵循了 CakePHP 的命名规范。

想了解更多的关于 CakePHP 控制器的信息，请查看 :doc:`/controllers` 一章。

创建文章(*Post*)视图
====================

现在，我们的数据已经流向模型，应用程序的逻辑和流程也在控制器中定义了，让我们为之
前的 index 动作创建一个视图吧。

CakePHP 的视图仅仅是嵌入应用程序的布局中的展示层片段。对大多数应用程序而言，他们
是嵌入 PHP 的 HTML，但它们也可能是 XML，CSV，甚至是二进制数据。

布局是包裹视图的展示层代码。可以定义多个布局，并且可以在它们之间切换。不过，目前
就让我们使用缺省的布局吧。

还记得在上一节中，我们使用了 ``set()`` 方法把 'posts' 变量赋值给视图吗？这会把如
下所示的数据传递到视图中::

    // print_r($posts) output:

    Array
    (
        [0] => Array
            (
                [Post] => Array
                    (
                        [id] => 1
                        [title] => The title
                        [body] => This is the post body.
                        [created] => 2008-02-13 18:34:55
                        [modified] =>
                    )
            )
        [1] => Array
            (
                [Post] => Array
                    (
                        [id] => 2
                        [title] => A title once again
                        [body] => And the post body follows.
                        [created] => 2008-02-13 18:34:56
                        [modified] =>
                    )
            )
        [2] => Array
            (
                [Post] => Array
                    (
                        [id] => 3
                        [title] => Title strikes back
                        [body] => This is really exciting! Not.
                        [created] => 2008-02-13 18:34:57
                        [modified] =>
                    )
            )
    )

CakePHP 的视图保存在 ``/app/View`` 目录中，在一个与相应的控制器对应的目录中。(在
这里我们需要创建目录 'Posts'。)为了把文章(*post*)的数据显示在一个美观的表格中，我
们的视图代码会象下面这样。

.. code-block:: php

    <!-- File: /app/View/Posts/index.ctp -->

    <h1>Blog posts</h1>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Created</th>
        </tr>

        <!-- Here is where we loop through our $posts array, printing out post info -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php echo $this->Html->link($post['Post']['title'],
    array('controller' => 'posts', 'action' => 'view', $post['Post']['id'])); ?>
            </td>
            <td><?php echo $post['Post']['created']; ?></td>
        </tr>
        <?php endforeach; ?>
        <?php unset($post); ?>
    </table>

你也许已经注意到，我们使用了 ``$this->Html`` 这个对象。这是 CakePHP 的
:php:class:`HtmlHelper` 类的一个实例。CakePHP 提供了一组视图助件(*view helper*)，
从而使得链接、表单输出、JavaScript 和 AJAX 这些事情易如反掌。你可以在
:doc:`/views/helpers` 一章了解到如何使用它们，但在这里值得注意的是，``link()`` 方
法会产生一个带有标题(第一个参数)和网址(第二个参数)的 HTML 链接。

在 CakePHP 中指定网址时，推荐使用数组格式。在路由(*Routes*)一节中我们会详细解释这
些。使用数组格式来表示网址让你可以利用 CakePHP 的反向路由功能。你也可以定义相对于
应用程序根目录的路径，像 /controller/action/param1/param2 这样。

现在，你可以在浏览器中输入地址 http://www.example.com/posts/index。你应该可以看到
你的视图正确地显示，带有标题，以及表格中的文章列表。

如果你在点击了我们在这个视图中创建的链接(用文章标题指向网址 /posts/view/some\_id
的链接)，CakePHP 将会告诉你这个动作尚未定义。如果你没有看到这个错误，那就是什么地
方出错了，或者你实际上已经定义了，那你可够贼的。如果还没有，现在就让我们在
PostsController 中创建这个动作吧::

    // File: /app/Controller/PostsController.php
    class PostsController extends AppController {
        public $helpers = array('Html', 'Form');

        public function index() {
             $this->set('posts', $this->Post->find('all'));
        }

        public function view($id = null) {
            if (!$id) {
                throw new NotFoundException(__('Invalid post'));
            }

            $post = $this->Post->findById($id);
            if (!$post) {
                throw new NotFoundException(__('Invalid post'));
            }
            $this->set('post', $post);
        }
    }

你对 ``set()`` 方法应该已经很熟悉了。请注意我们使用 ``findById()`` 方法，而不是
``find('all')`` 方法，因为我们只想要一篇文章的数据。

注意到我们的视图动作接受一个参数，我们要查看的文章的 ID。这个参数是通过请求的网址
来传递给动作的。如果用户请求 ``/posts/view/3``，那么数据 '3' 就会作为 ``$id`` 传
入。

我们也做了些错误检查来确保用户确实是要访问一条记录。如果用户请求
``/posts/view`` ，我们就抛出一个 ``NotFoundException`` 异常，让 CakePHP 的
ErrorHandler 来处理。我们也作了同样的检查来确保用户访问的记录是存在的。

现在让我们创建我们的新动作 'view' 的视图，并保存为 ``/app/View/Posts/view.ctp``。

.. code-block:: php

    <!-- File: /app/View/Posts/view.ctp -->

    <h1><?php echo h($post['Post']['title']); ?></h1>

    <p><small>Created: <?php echo $post['Post']['created']; ?></small></p>

    <p><?php echo h($post['Post']['body']); ?></p>

为了验证这是正确的，请打开浏览器访问 ``/posts/index`` 页面中的链接，或者手工输入
查看一篇文章的请求 ``/posts/view/1``。

添加文章(*Post*)
================

从数据库中读出并显示文章是一个好的开始，不过让我们允许添加新的文章。

首先，从在 PostsController 中创建 ``add()`` 动作开始::

    class PostsController extends AppController {
        public $helpers = array('Html', 'Form', 'Flash');
        public $components = array('Flash');

        public function index() {
            $this->set('posts', $this->Post->find('all'));
        }

        public function view($id) {
            if (!$id) {
                throw new NotFoundException(__('Invalid post'));
            }

            $post = $this->Post->findById($id);
            if (!$post) {
                throw new NotFoundException(__('Invalid post'));
            }
            $this->set('post', $post);
        }

        public function add() {
            if ($this->request->is('post')) {
                $this->Post->create();
                if ($this->Post->save($this->request->data)) {
                    $this->Flash->success(__('Your post has been saved.'));
                    return $this->redirect(array('action' => 'index'));
                }
                $this->Flash->error(__('Unable to add your post.'));
            }
        }
    }

.. note::

    ``$this->request->is()`` 方法接受一个参数，可以是请求方法(``get`` 、
    ``put`` 、 ``post`` 、 ``delete``)或者请求标识(``ajax``)。这 **不** 是检查特定
    提交数据(*posted data*)的方法。比如，如果提交了书(*book*)的数据，
    ``$this->request->is('book')`` 不会返回 true。

.. note::

    在会用到 FlashComponent 以及 FlashHelper 的控制器中，你要引入它们。如果必
    要的话，在你的 AppController 中引入。

这是 ``add()`` 动作所做的：如果这个请求的 HTTP 方法是 POST，将试图使用 Post (文
章)模型保存数据。如果因为某些原因没有保存，就渲染视图。这让我们能够给用户显示验证
错误或者其他警告。

每个 CakePHP 请求包括一个 ``CakeRequest`` 对象，可以通过 ``$this->request`` 来访
问。该请求对象包含了刚收到的请求的有用信息，并且能够用来控制应用程序的流程。在这
里，我们使用 :php:meth:`CakeRequest::is()` 方法来检查这个请求是否是一个 HTTP POST
请求。

当用户在应用程序中使用一个表单提交(*POST*)数据时，该数据可以通过
``$this->request->data`` 访问。如果你想看到这些数据，你可以使用 :php:func:`pr()`
或 :php:func:`debug()` 函数显示出来。

我们使用 FlashComponent 的 :php:meth:`FlashComponent::setFlash()` 方法在一个
会话(*session*)变量中设置一条信息，在重定向后在页面中显示该信息。在布局中我们用
:php:func:`FlashHelper::render()` 方法来显示这条信息并清空相应的会话变量。控制器的
:php:meth:`Controller::redirect` 方法重定向页面到另一个网址。参数
``array('action' => 'index')`` 就是网址 /posts (即 posts 控制器的 index 动作)。你
可以参阅在 `API <https://api.cakephp.org>`_ 中的 :php:func:`Router::url()` 方法，
来了解可用来为 CakePHP 函数指定网址的各种格式。

调用 ``save()`` 方法将会检查错误验证，如果有任何错误即中断保存。我们将会在接下来
的小节里讨论如何处理这些错误。

我们首先调用 ``create()`` 方法，来重置模型的状态，以保存新的数据。这不会真的在数
据库中创建一条记录，而是清空 Model::$id 并根据数据库字段的缺省值来设置
Model::$data。

数据验证
========

CakePHP 经过长期的努力来摆脱验证表单输入的千篇一律。每个人都痛恨编写没完没了的表
单及其验证。CakePHP 使这些工作更容易、更快。

要利用验证功能，你将需要在视图中使用 CakePHP 的 FormHelper 助件。缺省情况下，
:php:class:`FormHelper` 在所有视图中都可以通过 ``$this->Form`` 来访问。

这是我们的 add 视图：

.. code-block:: php

    <!-- File: /app/View/Posts/add.ctp -->

    <h1>Add Post</h1>
    <?php
    echo $this->Form->create('Post');
    echo $this->Form->input('title');
    echo $this->Form->input('body', array('rows' => '3'));
    echo $this->Form->end('Save Post');
    ?>

我们使用 FormHelper 来生成一个 HTML 表单的起始标签。下面是
``$this->Form->create()`` 生成的 HTML：

.. code-block:: html

    <form id="PostAddForm" method="post" action="/posts/add">

如果调用 ``create()`` 方法时不带参数，那么就认为你要创建一个表单，用 POST 方法来
提交到当前控制器的 ``add()`` 动作(或者当表单数据中包含 ``id`` 时，提交到
``edit()`` 动作)。

``$this->Form->input()`` 方法用于创建同名的(即 input)表单元素。第一个参数告诉
CakePHP 关联到哪个字段，第二个参数让你定义一系列选项——在这里，我们定义 textarea
的行数。在这里有一点自省和自动魔法(*introspection and automagic*)： ``input()`` 方法将会根据指定的模型字段输出不同的表单元素。

对 ``$this->Form->end()`` 方法的调用生成一个提交按钮并结束表单。如果 ``end()`` 方
法的第一个参数传入一个字符串，那么 FormHelper 输出的提交按钮将以该字符串为提交按钮
上的文字，并输出表单的结束标签。再次，关于助件(*helper*)的更多信息请参阅
:doc:`/views/helpers`。

现在让我们回去并更新我们的 ``/app/View/Posts/index.ctp`` 视图，添加 "Add Post" 链
接。在 ``<table>`` 之前添加如下代码::

    <?php echo $this->Html->link(
        'Add Post',
        array('controller' => 'posts', 'action' => 'add')
    ); ?>

你也许会问：怎么告诉 CakePHP 我的验证要求呢？验证规则是在模型中定义的。让我们回去
看一下 Post 模型，并做一些调整::

    class Post extends AppModel {
        public $validate = array(
            'title' => array(
                'rule' => 'notBlank'
            ),
            'body' => array(
                'rule' => 'notBlank'
            )
        );
    }

``$validate`` 数组告诉 CakePHP，当 ``save()`` 方法被调用时如何去验证你的数据。这
里，我定义了 body 和 title 字段都不能为空。CakePHP 的验证引擎很强大，有许多内置的
验证规则(信用卡、电子邮件，等等)，并且灵活，便于你增加自己的验证规则。更多信息请
查看 :doc:`/models/data-validation`。

现在你已经完成了验证规则，使用应用程序来尝试添加一篇文章，空着 title 或者 body，
看看验证规则如何起作用。因为我们已经使用了 FormHelper 的
:php:meth:`FormHelper::input()` 方法来创建我们的表单元素，我们的验证错误信息将会
自动显示出来。

编辑文章(*Post*)
================

让我们开始编辑文章吧。你现在已经是个 CakePHP 专家了，所以你现在应该已经习惯于这种
模式。建立动作，然后添加视图。控制器 PostsController 中的 ``edit()`` 动作会是这样
::

    public function edit($id = null) {
        if (!$id) {
            throw new NotFoundException(__('Invalid post'));
        }

        $post = $this->Post->findById($id);
        if (!$post) {
            throw new NotFoundException(__('Invalid post'));
        }

        if ($this->request->is(array('post', 'put'))) {
            $this->Post->id = $id;
            if ($this->Post->save($this->request->data)) {
                $this->Flash->success(__('Your post has been updated.'));
                return $this->redirect(array('action' => 'index'));
            }
            $this->Flash->error(__('Unable to update your post.'));
        }

        if (!$this->request->data) {
            $this->request->data = $post;
        }
    }

这个动作首先确保用户访问的是一条现存的记录。如果没有传入 ``$id`` 参数，或者该文章
(*post*)不存在，就抛出 ``NotFoundException`` 异常，让 CakePHP 的 ErrorHandler 来
处理。

接着，检查这个请求是否是 POST 请求或者 PUT 请求。如果是，我们就使用提交(*POST*)的
数据来更新文章(*Post*)记录，否则就退回并给用户显示验证错误。

如果 ``$this->request->data`` 中没有数据，我们就简单地把它设置为之前面读取的文章
(*post*)。

edit 视图会是这样:

.. code-block:: php

    <!-- File: /app/View/Posts/edit.ctp -->

    <h1>Edit Post</h1>
    <?php
    echo $this->Form->create('Post');
    echo $this->Form->input('title');
    echo $this->Form->input('body', array('rows' => '3'));
    echo $this->Form->input('id', array('type' => 'hidden'));
    echo $this->Form->end('Save Post');
    ?>

这个视图输出编辑表单(填入了一些值)，以及一些必要的验证错误信息。

在这里需要注意的是：如果数据数组中有 'id' 字段，CakePHP 将认为你在编辑一个模型。
如果其中没有 'id' 字段(可以回去看一下 add 视图)，当调用 ``save()`` 时，CakePHP 将
认为你正在插入一个新的模型。

现在可以更新你的 index 视图，并添加编辑文章(*post*)的链接了:

.. code-block:: php

    <!-- File: /app/View/Posts/index.ctp  (edit links added) -->

    <h1>Blog posts</h1>
    <p><?php echo $this->Html->link("Add Post", array('action' => 'add')); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Action</th>
            <th>Created</th>
        </tr>

    <!-- Here's where we loop through our $posts array, printing out post info -->

    <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php
                    echo $this->Html->link(
                        $post['Post']['title'],
                        array('action' => 'view', $post['Post']['id'])
                    );
                ?>
            </td>
            <td>
                <?php
                    echo $this->Html->link(
                        'Edit',
                        array('action' => 'edit', $post['Post']['id'])
                    );
                ?>
            </td>
            <td>
                <?php echo $post['Post']['created']; ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>

删除文章(*Post*)
================

接下来，让我们为用户增加删除文章(*post*)的功能。先在 PostsController 中添加
``delete()`` 动作::

    public function delete($id) {
        if ($this->request->is('get')) {
            throw new MethodNotAllowedException();
        }

        if ($this->Post->delete($id)) {
            $this->Flash->success(
                __('The post with id: %s has been deleted.', h($id))
            );
        } else {
            $this->Flash->error(
                __('The post with id: %s could not be deleted.', h($id))
            );
        }

        return $this->redirect(array('action' => 'index'));
    }

这个逻辑删除 `$id` 指定的文章(*post*)，然后使用 ``$this->Flash->success()``，
在重定向到 ``/posts`` 后，给用户显示确认信息。如果用户尝试通过 GET 请求删除文章
(*post*)，我们就抛出异常。未捕获的异常将被 CakePHP 的异常处理捕获，并显示漂亮的错
误页面。有许多内置的 :doc:`/development/exceptions`，可以用来表示应用程序需要生成
的各种 HTTP 错误。

因为我们仅仅是执行一些逻辑和重定向，所以这个动作没有视图。不过，你可能想要修改
index 视图，添加让用户删除文章(*post*)的链接:

.. code-block:: php

    <!-- File: /app/View/Posts/index.ctp -->

    <h1>Blog posts</h1>
    <p><?php echo $this->Html->link('Add Post', array('action' => 'add')); ?></p>
    <table>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Actions</th>
            <th>Created</th>
        </tr>

    <!-- Here's where we loop through our $posts array, printing out post info -->

        <?php foreach ($posts as $post): ?>
        <tr>
            <td><?php echo $post['Post']['id']; ?></td>
            <td>
                <?php
                    echo $this->Html->link(
                        $post['Post']['title'],
                        array('action' => 'view', $post['Post']['id'])
                    );
                ?>
            </td>
            <td>
                <?php
                    echo $this->Form->postLink(
                        'Delete',
                        array('action' => 'delete', $post['Post']['id']),
                        array('confirm' => 'Are you sure?')
                    );
                ?>
                <?php
                    echo $this->Html->link(
                        'Edit', array('action' => 'edit', $post['Post']['id'])
                    );
                ?>
            </td>
            <td>
                <?php echo $post['Post']['created']; ?>
            </td>
        </tr>
        <?php endforeach; ?>

    </table>

使用 :php:meth:`~FormHelper::postLink()`，会创建一个链接，该链接使用 Javascrip 来
提交一个删除文章(*post*)的 POST 请求。允许使用 GET 请求来删除内容是危险的，因为这
让网络爬虫有可能意外删除你网站的所有内容.

.. note::

    这个视图的代码也使用了 FormHelper，当用户试图删除一篇文章(*post*)时，显示一个
    JavaScript 确认对话框供用户确认。

路由(*Route*)
=============

对一些人来说，CakePHP 缺省的路由已经足够了。而对用户友好性和通用搜索引擎兼容性敏
感的开发者，会喜欢 CakePHP 把网址(*URL*)映射到特定动作(*action*)的方式。所以，让
我们在这个教程中对路由做一个小小的改动吧。

关于高级路由技术的更多信息，请参阅 :ref:`routes-configuration`。

缺省情况下，CakePHP 对于网站根目录的请求(例如 http://www.example.com)，使用
PagesController 来响应，并渲染 "home" 视图。这里，我们会增加一条路由规则，将其替
换为我们的 PostsController。

CakePHP 的路由设置在 ``/app/Config/routes.php`` 文件中。你应当注释掉或者删除掉缺
省的根目录路由。该代码如下:

.. code-block:: php

    Router::connect(
        '/',
        array('controller' => 'pages', 'action' => 'display', 'home')
    );

这一行连接网址 '/' 到 CakePHP 的缺省首页。我们想要把它连接到我们自己的控制器，所
以把该行代码替换为::

    Router::connect('/', array('controller' => 'posts', 'action' => 'index'));

这样就把用户对 '/' 的请求导向 PostsController 的 index() 动作。

.. note::

    CakePHP 也支持'反向路由'。基于上面定义的路由，如果你给一个接受数组的函数传入
    ``array('controller' => 'posts'，'action' => 'index')`` ，得到的网址就会是
    '/'。所以，最好总是使用数组来表示网址，这样就表示你的路由定义了网址指向哪里，
    而且也确保链接指向相同的地方。

结论
====

用这种方法来创建应用程序会为你赢得甚至超出你最疯狂的幻想的平静、荣誉、爱和金钱。
简单吧？记住，这个教程仅仅是基础。CakePHP 还提供了 *更多* 的功能，并且很灵活，碍
于篇幅无法在这里详述。本手册余下的部分，可以指导你创建更加功能丰富的应用程序。

既然你已经创建了一个基本的 CakePHP 应用程序，那么你已经可以开始真的做点儿东西了。
启动你自己的项目吧，别忘记阅读 :doc:`Cookbook </index>` 的其余部分，以及
`API <https://api.cakephp.org>`_ 。

如果需要，有很多方法可以获得你需要的帮助——请查看
:doc:`/cakephp-overview/where-to-get-help` 页面。欢迎加入 CakePHP！

延伸阅读的建议
--------------

这些是学习 CakePHP 的人们接下来通常想去学习的常见任务：

1. :ref:`view-layouts`：定制网站的布局
2. :ref:`view-elements`：导入和重用视图片段
3. :doc:`/controllers/scaffolding`：在着手写代码前，先创建原型。
4. :doc:`/console-and-shells/code-generation-with-bake`：生成 CRUD 代码
5. :doc:`/tutorials-and-examples/blog-auth-example/auth`：用户身份验证和授权的教程


.. meta::
    :title lang=zh: Blog Tutorial Adding a Layer
    :keywords lang=zh: doc models,validation check,controller actions,model post,php class,model class,model object,business logic,database table,naming convention,bread and butter,callbacks,prefixes,nutshell,interaction,array,cakephp,interface,applications,delete
