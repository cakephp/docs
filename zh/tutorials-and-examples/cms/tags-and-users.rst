CMS 教程 － Tags 和 Users
#############################

我们已经完成了管理 article 的基本功能，接下来我们将允许多位用户使用这个 CMS。在此之前我们都是手动创建的
所有模型，视图以及控制器。这一次我们将使用 :doc:`/bake` 来生成骨架代码。Bake 是一个很强大的 :abbr:`CLI (命令行)` 
代码生成工具，他利用 CakePHP 的约定有效地生成 :abbr:`CRUD (Create, Read, Update, Delete)` 应用。
在这一章节，我们将使用 ``bake`` 来为 users 创建代码：


.. code-block:: bash

    cd /path/to/our/app

    bin/cake bake model users
    bin/cake bake controller users
    bin/cake bake template users

以上3个命令将生成：


* Table, Entity, Fixture 文件.
* 控制器。
* CRUD 模版。
* 以上类的测试用例。

Bake 也会使用 CakePHP 约定来推断模型之间的关系以及模型的验证规则。


添加标签至 Articles
==========================

我们小巧的 :abbr:`CMS` 可允许多用户，如果可以给内容分类会是一个很棒的功能。我们将使用标签来让用户
创建任何的类以便标记他们的创作。我们将再一次地使用 ``bake`` 来快速的生成一些骨架代码：


.. code-block:: bash

    # Generate all the code at once.
    bin/cake bake all tags

以上脚手架代码创建以后，打开 **http://localhost:8765/tags/add** 添加一些简单的标签。

表单 tags 创建好了，我们可以建立 articles 和 tags 之间的关联。添加以下的代码至 ArticlesTable 
的 ``initialize`` 方法中::



    public function initialize(array $config)
    {
        $this->addBehavior('Timestamp');
        $this->belongsToMany('Tags'); // 加入此行
    }


之所以我们可以用一行代码来实现这种关联是因为我们遵守了 CakePHP 的约定来创建我们的表单。更多详情，
可见 :doc:`/orm/associations`。


启用标记功能
===================================

现在我们的应用有了标签，让我们给予用户 articles 标记功能。首先，更新 ``add`` 行为如下::

    // in src/Controller/ArticlesController.php

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {
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
            // Get a list of tags.
            $tags = $this->Articles->Tags->find('list');

            // Set tags to the view context
            $this->set('tags', $tags);

            $this->set('article', $article);
        }

        // Other actions
    }

添加的几行代码将标签列表作为关联数组 ``id => title`` 加载。这种格式能够让我们在模板中创建一个新的标签输入。
加入以下代码至 **src/Template/Articles/add.ctp** 来实现新的标签输入::

    echo $this->Form->control('tags._ids', ['options' => $tags]);

以下代码将会渲染一个多选的 select 选择器，并使用变量 ``$tags`` 来生成其选项。现在我们可以添加一些有标签的
articles，因为往下我们将加入使用标签搜索 articles 的功能。

你也需要更新 ``edit``，以便其可以添加和更新标签。更新后代码看起来如下::

    public function edit($slug)
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->contain('Tags') // load associated Tags
            ->firstOrFail();
        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData());
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been updated.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to update your article.'));
        }

        // Get a list of tags.
        $tags = $this->Articles->Tags->find('list');

        // Set tags to the view context
        $this->set('tags', $tags);

        $this->set('article', $article);
    }

记住参照 **add.ctp** 来添加多选的 select 选择器至  **src/Template/Articles/edit.ctp** 模版中。


使用标签搜寻 articles
========================

既然用户可以将内容分类了，他们肯定会需要使用标签来搜寻内容。我们将利用路由，控制器行为以及模型的 finder 方法
来实现这个功能。

我们需要实现一个 URL **http://localhost:8765/articles/tagged/funny/cat/gifs**, 它将搜索并展示出
所有带 'funny', 'cat' 或者 'gifs' 标签的 articles。首先我们需要加入一个新的路由。更新后的  **config/routes.php**
文件应该如下::


    <?php
    use Cake\Core\Plugin;
    use Cake\Routing\Route\DashedRoute;
    use Cake\Routing\Router;

    Router::defaultRouteClass(DashedRoute::class);

    // New route we're adding for our tagged action.
    // The trailing `*` tells CakePHP that this action has
    // passed parameters.
    Router::scope(
        '/articles',
        ['controller' => 'Articles'],
        function ($routes) {
            $routes->connect('/tagged/*', ['action' => 'tags']);
        }
    );

    Router::scope('/', function ($routes) {
        // Connect the default home and /pages/* routes.
        $routes->connect('/', [
            'controller' => 'Pages',
            'action' => 'display', 'home'
        ]);
        $routes->connect('/pages/*', [
            'controller' => 'Pages',
            'action' => 'display'
        ]);

        // Connect the conventions based default routes.
        $routes->fallbacks();
    });

    Plugin::routes();

新添加的路由将路径  **/articles/tagged/** 与 ``ArticlesController::tags()`` 行为关联了起来。
通过定义路由，我们可以将 URLs 的展现形式和实现方法独立开。现在访问 **http://localhost:8765/articles/tagged** 的
话，CakePHP 将渲染一个自带的错误页面并提醒你控制器的某行为不存在。让我们现在就实现缺失的行为。在
**src/Controller/ArticlesController.php** 中加入以下代码::


    public function tags()
    {
        // The 'pass' key is provided by CakePHP and contains all
        // the passed URL path segments in the request.
        $tags = $this->request->getParam('pass');

        // Use the ArticlesTable to find tagged articles.
        $articles = $this->Articles->find('tagged', [
            'tags' => $tags
        ]);

        // Pass variables into the view template context.
        $this->set([
            'articles' => $articles,
            'tags' => $tags
        ]);
    }

获取请求中的其他数据，请参考  :ref:`cake-request` 章节。

由于参数是通过方法参数传入，我们也可以使用 PHP 的变长参数函数::

    public function tags(...$tags)
    {
        // Use the ArticlesTable to find tagged articles.
        $articles = $this->Articles->find('tagged', [
            'tags' => $tags
        ]);

        // Pass variables into the view template context.
        $this->set([
            'articles' => $articles,
            'tags' => $tags
        ]);
    }



创建 finder 方法
--------------------------

在 CakePHP 中，我们提倡胖模型，瘦控制器。现在访问 **/articles/tagged** 的话，你将看到
一条错误信息，提示 ``findTagged()`` 方法缺失。在 **src/Model/Table/ArticlesTable.php**  
加入以下代码::

    // add this use statement right below the namespace declaration to import
    // the Query class
    use Cake\ORM\Query;

    // The $query argument is a query builder instance.
    // The $options array will contain the 'tags' option we passed
    // to find('tagged') in our controller action.
    public function findTagged(Query $query, array $options)
    {
        $columns = [
            'Articles.id', 'Articles.user_id', 'Articles.title',
            'Articles.body', 'Articles.published', 'Articles.created',
            'Articles.slug',
        ];

        $query = $query
            ->select($columns)
            ->distinct($columns);

        if (empty($options['tags'])) {
            // If there are no tags provided, find articles that have no tags.
            $query->leftJoinWith('Tags')
                ->where(['Tags.title IS' => null]);
        } else {
            // Find articles that have one or more of the provided tags.
            $query->innerJoinWith('Tags')
                ->where(['Tags.title IN' => $options['tags']]);
        }

        return $query->group(['Articles.id']);
    }

以上我们运用到了 :ref:`自定义 finder 方法 <custom-find-methods>`。这是一个很强大的 CakePHP 功能,通过
它，你可以将可重复使用的查询语句打包。Finder 方法的第一个参数为 :doc:`/orm/query-builder` 对象，第二个
参数为一个选项数组。Finder 方法可以操作 query 并添加需要的条件或标准，最后它必须返回一个 query 对象。在我们以上的
自定义 finder 中， 我们使用了 ``distinct()`` and ``leftJoin()`` 方法来搜寻标有指定标签的不同的 article。


创建视图
-----------------

现在访问 **/articles/tagged**，你将会看到一个新的报错页面，提醒你还没有建立视图文件。让我们完成它。在
**src/Template/Articles/tags.ctp** 加入以下内容::


    <h1>
        Articles tagged with
        <?= $this->Text->toList(h($tags), 'or') ?>
    </h1>

    <section>
    <?php foreach ($articles as $article): ?>
        <article>
            <!-- Use the HtmlHelper to create a link -->
            <h4><?= $this->Html->link(
                $article->title,
                ['controller' => 'Articles', 'action' => 'view', $article->slug]
            ) ?></h4>
            <span><?= h($article->created) ?>
        </article>
    <?php endforeach; ?>
    </section>


我们使用了 :doc:`/views/helpers/html` 和 :doc:`/views/helpers/text` 来帮助生成视图内容。我们
还使用了 :php:func:`h` 来编码 HTML 内容。``h()`` 能够帮助我们防止 HTML 注入。 

以上创建的 **tags.ctp** 文件遵循 CakePHP 的视图约定。此约定要求视图文件名使用小写字母和下划线格式的控制器
行为名。

我们可以在视图模版中使用 ``$tags`` and ``$articles`` 变量，这是因为当我们在控制器中使用了 ``set()`` 方法
将变量传入视图中。视图将会把传入的变量变成局部变量。

现在访问 **/articles/tagged/funny** 将可以看到所有带 'funny' 标签的 articles。


改善标示功能
================================

目前添加标签有点麻烦，因为用户需要事先创建它们，然后才能使用。我们可以使用逗号分隔的文本输入元素来
取代原有的 select 元素。这样可以提高用户体验并且能让我们使用更多的 ORM 功能。


添加一个虚拟属性
-----------------------

我们可以通过模型的虚拟属性来操作格式化的 tags。加入以下代码至 **src/Model/Entity/Article.php**  中::


    // add this use statement right below the namespace declaration to import
    // the Collection class
    use Cake\Collection\Collection;

    protected function _getTagString()
    {
        if (isset($this->_fields['tag_string'])) {
            return $this->_fields['tag_string'];
        }
        if (empty($this->tags)) {
            return '';
        }
        $tags = new Collection($this->tags);
        $str = $tags->reduce(function ($string, $tag) {
            return $string . $tag->title . ', ';
        }, '');
        return trim($str, ', ');
    }


以上的定义让我可以通过 ``$article->tag_string`` 来获取这个虚拟属性。往下我们将使用到此属性。


更新对应的视图
------------------

在更新完我们的模型以后，我们可以加入一个新的输入元素至对应的视图中。在 
**src/Template/Articles/add.ctp** 和 **src/Template/Articles/edit.ctp** 中，用以下的代码
替换 ``tags._ids``::

    echo $this->Form->control('tag_string', ['type' => 'text']);


保存标签内容
-------------------------

虽然我们可以查看标签，却没有办法保存他们。让我们实现此功能。由于我们标记了 ``tag_string`` 为虚拟属性，ORM
会自动将它从请求中复制到模型中。我们可以使用 ``beforeSave()`` 钩子来解析标签的字符串并且找到或者建立相应的
模型。加入以下代码至 **src/Model/Table/ArticlesTable.php** 中::


    public function beforeSave($event, $entity, $options)
    {
        if ($entity->tag_string) {
            $entity->tags = $this->_buildTags($entity->tag_string);
        }

        // Other code
    }

    protected function _buildTags($tagString)
    {
        // Trim tags
        $newTags = array_map('trim', explode(',', $tagString));
        // Remove all empty tags
        $newTags = array_filter($newTags);
        // Reduce duplicated tags
        $newTags = array_unique($newTags);

        $out = [];
        $query = $this->Tags->find()
            ->where(['Tags.title IN' => $newTags]);

        // Remove existing tags from the list of new tags.
        foreach ($query->extract('title') as $existing) {
            $index = array_search($existing, $newTags);
            if ($index !== false) {
                unset($newTags[$index]);
            }
        }
        // Add existing tags.
        foreach ($query as $tag) {
            $out[] = $tag;
        }
        // Add new tags.
        foreach ($newTags as $tag) {
            $out[] = $this->Tags->newEntity(['title' => $tag]);
        }
        return $out;
    }

现在创建和编辑 articles 的话，我们应该可以使用逗号分隔的标签，标签字符串将会被保存，并且他们的关联会被自动的
建立。

以上有点复杂的代码展示了 CakePHP ORM 的强大。你可以使用 :doc:`/core-libraries/collections` 来操作查询的
结果，并使用它来动态地创建模型。

下一节，我们将添加 :doc:`认证 </tutorials-and-examples/cms/authentication>`。
