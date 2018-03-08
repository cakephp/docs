CMS 教案 - 创建 Articles 控制器
###############################################

在上一节，我们为 articles 数据表创建了模型，现在我们需要为它创建控制器。CakePHP 中的控制器
是用来处理 HTTP 请求以及执行封装在模型中的业务逻辑。让我们建立一个叫 **ArticlesController.php** 的
控制器文件，然后把它置于 **src/Controller** 目录中。一个基本的控制器代码如下::


    <?php
    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {
    }


然后让我们为控制器添加一个行为（action）。行为是控制器中的方法，并且他们都与路由相连。比如当用户访问
**www.example.com/articles/index** （与 **www.example.com/articles** 是一样的效果），CakePHP
会自动调用 ``ArticlesController`` 控制器中的 ``index`` 方法。我们需要建立的这个行为应该查询
模型层，接着用模版渲染一个视图作为响应。此行为的代码应该看起来如下::


    <?php
    // src/Controller/ArticlesController.php

    namespace App\Controller;

    class ArticlesController extends AppController
    {
        public function index()
        {
            $this->loadComponent('Paginator');
            $articles = $this->Paginator->paginate($this->Articles->find());
            $this->set(compact('articles'));
        }
    }


定义完 ``ArticlesController`` 控制器中的 ``index()`` 函数以后，用户便可以使用 **www.example.com/articles/index**
访问了。同理，如果我们定义一个 ``foobar()`` 的函数，用户便可以访问  **www.example.com/articles/foobar**。
不要为了实现某些特定的 URLs 来为你的控制器和行为取名。遵循 :doc:`/intro/conventions` 原则，
秉持易读易懂的概念来取名。然后再使用 :doc:`/development/routing` 连接行为和你想要的 URLs。

至此，我们的控制器行为是非常简单的。它利用 Articles 模型从数据库中读取一组分页后的 articles 数据，
然后使用 ``set()`` 函数将数据传入模版（将在下部分创建）。CakePHP 将会自动渲染模版。


创建 Article 列表模版
================================

我们的控制器拉取到了数据，为视图做好了准备，让我们为 index 行为创建一个视图模版。

CakePHP 的视图模版是插入应用布局中的演示型 PHP 代码。视图不仅可以实现 HTML，也可以实现 JSON 和 CSV，
甚至是二进制文件，比如说 PDF。

布局是用来包装视图的演示代码。布局文件包含常见的网站元素，比如 header, footer 以及其他导航元素。一个
应用可以拥有多个布局，使用于不同场景。但是现在让我创建一个默认的布局而已。

模版文件都储存在 **src/Template** 目录中的一个文件夹中，此文件夹以其对应的控制器命名。所以我们需要创建
一个叫做 'Articles' 的文件夹。其代码如下：


.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp -->

    <h1>Articles</h1>
    <table>
        <tr>
            <th>Title</th>
            <th>Created</th>
        </tr>

        <!-- Here is where we iterate through our $articles query object, printing out article info -->

        <?php foreach ($articles as $article): ?>
        <tr>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
        </tr>
        <?php endforeach; ?>
    </table>


在上一个章节中，我们使用 ``set()`` 方法将 'articles' 注入到了视图中。在以上的代码中，我们可以看到，被注入
的变量转化为了视图模版中的本地变量。

你也许注意到我们使用了一个叫做 ``$this->Html`` 的对象。它是 CakePHP 中 :doc:`HtmlHelper </views/helpers/html>`
的一个实例。CakePHP 自带一系列的视图助手 (view helper），它们简化了很多任务，比如创建衔接，表单以及分页。
你可以在 :doc:`/views/helpers` 章节学到更多关于它们的内容，但是在这里，我们需要注意到的是 ``link()`` 
方法会使用第一个参数作为文字和第二个参数作为 URL 来生产一个 HTML 衔接。

When specifying URLs in CakePHP, it is recommended that you use arrays or
:ref:`named routes <named-routes>`. These syntaxes allow you to
leverage the reverse routing features CakePHP offers.

在 CakePHP 中生成 URLs 时候，建议使用数组或者 :ref:`命名路由 <named-routes>`。使用这些语法，你将可以利用到
CakePHP 的反向路由功能。

至此，在你的浏览其中访问 **http://localhost:8765/articles/index**，你应该可以看到一个列表视图，主题使用着正确
的格式，使用着 table 来排列 articles。


创建 View 动作
======================

如果你点击其中的一个 'view' 衔接，你会看到一个报错页面，提示你 'action hasn't been implemented'. 让我们修复它::


    // Add to existing src/Controller/ArticlesController.php file

    public function view($slug = null)
    {
        $article = $this->Articles->findBySlug($slug)->firstOrFail();
        $this->set(compact('article'));
    }

虽然以上是一个很简单的 action，但是我们却可以看到一些 CakePHP 强大的功能。首先我们使用了 ``findBySlug()`` 方法，它属于
:ref:`动态 Finder <dynamic-finders>`。这个方法容许我们创建一个简单的使用 slug 查询 artciles 的 query。然后我们使用
``firstOrFail()`` 提取第一个记录，或者拋出异常 ``NotFoundException``。

我们的 action 的第一个参数是 ``$slug``，可这个参数的值是如何来的呢？如果一个用户访问 ``/articles/view/first-post``，那么
'first-post' 将会被 CakePHP 的路由以及调度层传入为 action 的参数。保存为文件以后，如果我们重新加载页面，我们将看到另一个新的
CakePHP 报错页面，提示我们 'missing a view template'。让我们修复它。


创建视图模版
========================

让我们为 'view' 创建一个视图文件 **src/Template/Articles/view.ctp**

.. code-block:: php

    <!-- File: src/Template/Articles/view.ctp -->

    <h1><?= h($article->title) ?></h1>
    <p><?= h($article->body) ?></p>
    <p><small>Created: <?= $article->created->format(DATE_RFC850) ?></small></p>
    <p><?= $this->Html->link('Edit', ['action' => 'edit', $article->slug]) ?></p>


你可以通过浏览 ``/articles/index`` 页面或者直接访问 ``/articles/view/first-post`` 查看一个 article 来检测视图是否成功。


添加 Artciles
===============

我们已经创建好基本的阅读视图，下一步我们需要实现创建新 articles 的功能。首先让我们在 ``ArticlesController`` 中创建一个 ``action()`` 的动作。
至此我们的控制器代码应该看起来如下::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {

        public function initialize()
        {
            parent::initialize();

            $this->loadComponent('Paginator');
            $this->loadComponent('Flash'); // Include the FlashComponent
        }

        public function index()
        {
            $articles = $this->Paginator->paginate($this->Articles->find());
            $this->set(compact('articles'));
        }

        public function view($slug)
        {
            $article = $this->Articles->findBySlug($slug)->firstOrFail();
            $this->set(compact('article'));
        }

        public function add()
        {
            $article = $this->Articles->newEntity();
            if ($this->request->is('post')) {
                $article = $this->Articles->patchEntity($article, $this->request->getData());

                // Hardcoding the user_id is temporary, and will be removed later
                // when we build authentication out.
                $article->user_id = 1;

                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Your article has been saved.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__('Unable to add your article.'));
            }
            $this->set('article', $article);
        }
    }

.. note::
    
    如果你需要在控制器中使用 :doc:`/controllers/components/flash` 的组件，你必须要先加载它。通常情况下
    我们可以在 ``AppController`` 中加载它，由于它是一个比较常用的组件。
    

以下是 ``add()`` 行为的功能：

* 如果 HTTP 请求是 POST,尝试使用 Articles 模型来保存数据。
* 如果由于任何原因数据没有被保存，直接渲染视图。这样子用户有机会看到验证错误或者其他的警告信息。

每一个 CakePHP 请求包含着一个 request 对象，我们可以通过 ``$this->request`` 获取到。这个 request 对象包含着
当前的请求的所有信息。我们使用 :php:meth:`Cake\\Http\\ServerRequest::is()` 方法检测此次请求是否是一个 HTTP POST请求。

POST 数据可以通过 ``$this->request->getData()`` 获取。如果需要检查它里面的数据内容，我们可以通过方法 :php:func:`pr()` 
或者 :php:func:`debug()`。在保存数据之前，我们首先 'marshal' 数据成一个 Article Entity。然后我们使用之前创建的 ArticlesTable
来存储。

保存完以后，我们使用 FlashComponent 的 ``success()`` 方法来把提示信息传入 session 中。``success`` 方法是通过 
PHP 的 `魔术方法 <http://php.net/manual/en/language.oop5.overloading.php#object.call>`_ 实现的.  
瞬间提示信息将会在页面跳转以后显示出来。在我们的布局中，我们使用了 ``<?= $this->Flash->render() ?>``，它会将瞬间提示信息显示出来，
然后删除其对应的 session 变量。保存完成以后，我们使用 :php:meth:`Cake\\Controller\\Controller::redirect` 将用户页面带回 artciles
列表。参数 ``['action' => 'index']`` 将被翻译为 ``/articles``，也就是 ``ArticlesController`` 的 index 行为。参照 `API
<https://api.cakephp.org>` 中的 :php:func:`Cake\\Routing\\Router::url()` 文档来查看 CakePHP 中生成 URL 各种方法的格式。


创建 add 模版
===================

以下是 add 动作对应的视图模版:

.. code-block:: php

    <!-- File: src/Template/Articles/add.ctp -->

    <h1>Add Article</h1>
    <?php
        echo $this->Form->create($article);
        // Hard code the user for now.
        echo $this->Form->control('user_id', ['type' => 'hidden', 'value' => 1]);
        echo $this->Form->control('title');
        echo $this->Form->control('body', ['rows' => '3']);
        echo $this->Form->button(__('Save Article'));
        echo $this->Form->end();
    ?>

我们使用 FormHelper 来生成 HTML form 的开始标签。以下是 ``$this->Form->create()`` 生成的 HTML 代码:

.. code-block:: html

    <form method="post" action="/articles/add">

由于我们使用 ``create()`` 时没有使用 URL 选项，``FormHelper`` 假设我们需要提交此 form 回当前的动作。

当需要创建同名的表单元素时，我们可以使用 ``$this->Form->control()`` 方法。第一个参数告诉 CakePHP 其对应的领域，
第二个参数可以让我们指定各式各样的选项 － 在以上代码中，textarea 元素的 rows 的行数。这里有使用到一些内检功能和约定。
``control()`` 将会根据不同的模型领域生产不同的元素，以及使用 inflection 来生成标注文字。你也可以使用选项来定制标注,输入元素以及
任何其他 form 的属性。 最后 ``$this->Form->end()`` 方法关闭表单.

让我们更新一下  **src/Template/Articles/index.ctp** 视图，添加一个新的 "Add Article" 的衔接。在 ``<table>`` 之前，加入下行
代码::

    <?= $this->Html->link('Add Article', ['action' => 'add']) ?>
    

添加简单 slug 生成功能
=============================

如果我们现在保存一个 Article, 它将会失败，因为 slug 列应该为 ``NOT NULL``。通常 slug 的值应该是 title 的 URL 安全版本。
我们可以使用 ORM 的 :ref:`beforeSave() 回调 <table-callbacks>` 来生成 slug::

    // in src/Model/Table/ArticlesTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;
    // the Text class
    use Cake\Utility\Text;

    // Add the following method.

    public function beforeSave($event, $entity, $options)
    {
        if ($entity->isNew() && !$entity->slug) {
            $sluggedTitle = Text::slug($entity->title);
            // trim slug to maximum length defined in schema
            $entity->slug = substr($sluggedTitle, 0, 191);
        }
    }


以上的代码是很简陋的，没有考虑到 slug 的重复问题。往下我们会修复它。


添加 edit 动作
===============

现在我们可以保存 articles，但是无法编辑他们。让我们现在完善它。加入一下的动作至 ``ArticlesController`` 中::

    // in src/Controller/ArticlesController.php

    // Add the following method.

    public function edit($slug)
    {
        $article = $this->Articles->findBySlug($slug)->firstOrFail();
        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData());
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been updated.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to update your article.'));
        }

        $this->set('article', $article);
    }

在这个动作中，我们首先保证用户要求的 article 存在。如果 ``$slug`` 是空的，或者 article 并不存在，抛出 ``NotFoundException``
异常，然后 CakePHP 的 ErrorHandler 会渲染相对应的错误页面。

接着我们检测此请求是否为 POST 或者 PUT。如果是，我们将使用 ``patchEntity()`` 方法以及传入的数据来更新我们的 artcile 模型。
最后，我们使用 ``save()`` 保存数据，成功将跳转，失败将显示验证错误信息。


创建 edit 模版
====================

以下是 edit 模版代码：

.. code-block:: php

    <!-- File: src/Template/Articles/edit.ctp -->

    <h1>Edit Article</h1>
    <?php
        echo $this->Form->create($article);
        echo $this->Form->control('user_id', ['type' => 'hidden']);
        echo $this->Form->control('title');
        echo $this->Form->control('body', ['rows' => '3']);
        echo $this->Form->button(__('Save Article'));
        echo $this->Form->end();
    ?>


这个模版将展示一个编辑表单（以及表单元素值），以及必要时的错误验证信息。

现在我们可以更新 index 视图，加入 edit 的衔接。

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp  (edit links added) -->

    <h1>Articles</h1>
    <p><?= $this->Html->link("Add Article", ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Title</th>
            <th>Created</th>
            <th>Action</th>
        </tr>

    <!-- Here's where we iterate through our $articles query object, printing out article info -->

    <?php foreach ($articles as $article): ?>
        <tr>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Html->link('Edit', ['action' => 'edit', $article->slug]) ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>


更新验证规则
====================================

到现在为止，我们都没有使用任何的输入验证。让我们使用 :ref:`验证器 <validating-request-data>` 来完善::


    // src/Model/Table/ArticlesTable.php

    // add this use statement right below the namespace declaration to import
    // the Validator class
    use Cake\Validation\Validator;

    // Add the following method.
    public function validationDefault(Validator $validator)
    {
        $validator
            ->notEmpty('title')
            ->minLength('title', 10)
            ->maxLength('title', 255)

            ->notEmpty('body')
            ->minLength('body', 10);

        return $validator;
    }

当 CakePHP 调用 ``save()`` 时，``validationDefault()`` 方法将指示如何验证数据。在以上代码中，
我们规定 title 和 body 不可以为空，而且必须要达到一定的长度。

CakePHP 的验证器很强大也很灵活。它提供了一些常用的规则，比如邮箱地址，IP 地址等等。此外，你也可以灵活
地加入自定的规则。参考 :doc:`/core-libraries/validation` 文档可了解如何自定义验证规则。

现在我们部署好了验证规则，你可以尝试着使用空 title 或者 body 来测试。由于我们使用了 FormHelper 的 
:php:meth:`Cake\\View\\Helper\\FormHelper::control()` 来创建表单元素，你会发现验证错误信息回自动的呈现出来。


添加 delete 行为
=================

接下来我们要实现一个功能可以让用户删除 artciles。首先添加一个 ``delete()`` 行为到 ``ArticlesController`` 中::


    // src/Controller/ArticlesController.php

    public function delete($slug)
    {
        $this->request->allowMethod(['post', 'delete']);

        $article = $this->Articles->findBySlug($slug)->firstOrFail();
        if ($this->Articles->delete($article)) {
            $this->Flash->success(__('The {0} article has been deleted.', $article->title));
            return $this->redirect(['action' => 'index']);
        }
    }

以上的代码逻辑将会使用规定的 ``$slug`` 来删除指定 article，跳转页面至 ``/articles``，然后使用 ``$this->Flash->success()`` 
呈现一条确认信息。如果用户尝试用 GET 请求，``allowMethod()`` 将会抛出异常。未捕获的异常将被 CakePHP 内核的异常处理器捕获，自带的
错误页面将被展示出来。CakePHP 自带很多 :doc:`异常 </development/errors>` ，我们可以使用它们来响应不同的 HTTP 错误。

.. warning::
    
    允许 GET 请求删除内容是 *很* 危险的，这种做法可能导致爬虫不小心删除所有的内容。这就是我们
    在控制器中使用 ``allowMethod()`` 的原因。
    

由于我们只是运行了一段逻辑然后跳转到另一个动作，此处不需要模版。让我们更新下 index 模版，加入 delete 的衔接:

.. code-block:: php

    <!-- File: src/Template/Articles/index.ctp  (delete links added) -->

    <h1>Articles</h1>
    <p><?= $this->Html->link("Add Article", ['action' => 'add']) ?></p>
    <table>
        <tr>
            <th>Title</th>
            <th>Created</th>
            <th>Action</th>
        </tr>

    <!-- Here's where we iterate through our $articles query object, printing out article info -->

    <?php foreach ($articles as $article): ?>
        <tr>
            <td>
                <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
            </td>
            <td>
                <?= $article->created->format(DATE_RFC850) ?>
            </td>
            <td>
                <?= $this->Html->link('Edit', ['action' => 'edit', $article->slug]) ?>
                <?= $this->Form->postLink(
                    'Delete',
                    ['action' => 'delete', $article->slug],
                    ['confirm' => 'Are you sure?'])
                ?>
            </td>
        </tr>
    <?php endforeach; ?>

    </table>


此处我们使用了 :php:meth:`~Cake\\View\\Helper\\FormHelper::postLink()` 来创建一个衔接，此衔接将会用
JavaScript 来建立一个 POST 的请求。

.. note::

    This view code also uses the ``FormHelper`` to prompt the user with a
    JavaScript confirmation dialog before they attempt to delete an
    article.

With a basic articles management setup, we'll create the  :doc:`basic actions
for our Tags and Users tables </tutorials-and-examples/cms/tags-and-users>`.

基于我们现在创立的 articles 管理系统，下一节我们的任务是 :doc:`操作 Tags 和 Users 表单 </tutorials-and-examples/cms/tags-and-users>`
