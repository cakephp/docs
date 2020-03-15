CMS Tutorial - Tags and Users
#############################

With the basic article creation functionality built, we need to enable multiple
authors to work in our CMS. Previously, we built all the models, views and
controllers by hand. This time around we're going to use
:doc:`/bake` to create our skeleton code. Bake is a powerful
code generation :abbr:`CLI (Command Line Interface)` tool that leverages the
conventions CakePHP uses to create skeleton :abbr:`CRUD (Create, Read, Update,
Delete)` applications very efficiently. We're going to use ``bake`` to build our
users code:

.. code-block:: bash

    cd /path/to/our/app

    bin/cake bake model users
    bin/cake bake controller users
    bin/cake bake template users

These 3 commands will generate:

* The Table, Entity, Fixture files.
* The Controller
* The CRUD templates.
* Test cases for each generated class.

Bake will also use the CakePHP conventions to infer the associations, and
validation your models have.

Adding Tagging to Articles
==========================

With multiple users able to access our small :abbr:`CMS` it would be nice to
have a way to categorize our content. We'll use tags and tagging to allow users
to create free-form categories and labels for their content. Again, we'll use
``bake`` to quickly generate some skeleton code for our application:

.. code-block:: bash

    # Generate all the code at once.
    bin/cake bake all tags

Once you have the scaffold code created, create a few sample tags by going to
**http://localhost:8765/tags/add**.

Now that we have a Tags table, we can create an association between Articles and
Tags. We can do so by adding the following to the ``initialize`` method on the
ArticlesTable::

    public function initialize(array $config)
    {
        $this->addBehavior('Timestamp');
        $this->belongsToMany('Tags'); // Add this line
    }

This association will work with this simple definition because we followed
CakePHP conventions when creating our tables. For more information, read
:doc:`/orm/associations`.

Updating Articles to Enable Tagging
===================================

Now that our application has tags, we need to enable users to tag their
articles. First, update the ``add`` action to look like::

    // in src/Controller/ArticlesController.php

    namespace App\Controller;

    use App\Controller\AppController;

    class ArticlesController extends AppController
    {
        public function add()
        {
            $article = $this->Articles->newEmptyEntity();
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

The added lines load a list of tags as an associative array of ``id => title``.
This format will let us create a new tag input in our template.
Add the following to the PHP block of controls in **templates/Articles/add.php**::

    echo $this->Form->control('tags._ids', ['options' => $tags]);

This will render a multiple select element that uses the ``$tags`` variable to
generate the select box options. You should now create a couple new articles
that have tags, as in the following section we'll be adding the ability to find
articles by tags.

You should also update the ``edit`` method to allow adding or editing tags. The
edit method should now look like::

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

Remember to add the new tags multiple select control we added to the **add.php**
template to the **templates/Articles/edit.php** template as well.

Finding Articles By Tags
========================

Once users have categorized their content, they will want to find that content
by the tags they used. For this feature we'll implement a route, controller
action, and finder method to search through articles by tag.

Ideally, we'd have a URL that looks like
**http://localhost:8765/articles/tagged/funny/cat/gifs**. This would let us
find all the articles that have the 'funny', 'cat' or 'gifs' tags. Before we
can implement this, we'll add a new route. Your **config/routes.php** should
look like::

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

The above defines a new 'route' which connects the **/articles/tagged/** path,
to ``ArticlesController::tags()``. By defining routes, you can isolate how your
URLs look, from how they are implemented. If we were to visit
**http://localhost:8765/articles/tagged**, we would see a helpful error page
from CakePHP informing you that the controller action does not exist. Let's
implement that missing method now. In **src/Controller/ArticlesController.php**
add the following::

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

To access other parts of the request data, consult the :ref:`cake-request`
section.

Since passed arguments are passed as method parameters, you could also write the
action using PHP's variadic argument::

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

Creating the Finder Method
--------------------------

In CakePHP we like to keep our controller actions slim, and put most of our
application's logic in the model layer. If you were to visit the
**/articles/tagged** URL now you would see an error that the ``findTagged()``
method has not been implemented yet, so let's do that. In
**src/Model/Table/ArticlesTable.php** add the following::

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

We just implemented a :ref:`custom finder method <custom-find-methods>`. This is
a very powerful concept in CakePHP that allows you to package up re-usable
queries. Finder methods always get a :doc:`/orm/query-builder` object and an
array of options as parameters. Finders can manipulate the query and add any
required conditions or criteria. When complete, finder methods must return
a modified query object. In our finder we've leveraged the ``distinct()`` and
``leftJoin()`` methods which allow us to find distinct articles that have
a 'matching' tag.

Creating the View
-----------------

Now if you visit the **/articles/tagged** URL again, CakePHP will show a new error
letting you know that you have not made a view file. Next, let's build the
view file for our ``tags()`` action. In **templates/Articles/tags.php**
put the following content::

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

In the above code we use the :doc:`/views/helpers/html` and
:doc:`/views/helpers/text` helpers to assist in generating our view output. We
also use the :php:func:`h` shortcut function to HTML encode output. You should
remember to always use ``h()`` when outputting data to prevent HTML injection
issues.

The **tags.php** file we just created follows the CakePHP conventions for view
template files. The convention is to have the template use the lower case and
underscored version of the controller action name.

You may notice that we were able to use the ``$tags`` and ``$articles``
variables in our view template. When we use the ``set()`` method in our
controller, we set specific variables to be sent to the view. The View will make
all passed variables available in the template scope as local variables.

You should now be able to visit the **/articles/tagged/funny** URL and see all
the articles tagged with 'funny'.

Improving the Tagging Experience
================================

Right now, adding new tags is a cumbersome process, as authors need to
pre-create all the tags they want to use. We can improve the tag selection UI by
using a comma separated text field. This will let us give a better experience to
our users, and use some more great features in the ORM.

Adding a Computed Field
-----------------------

Because we'll want a simple way to access the formatted tags for an entity, we
can add a virtual/computed field to the entity. In
**src/Model/Entity/Article.php** add the following::

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

This will let us access the ``$article->tag_string`` computed property. We'll
use this property in controls later on.

Updating the Views
------------------

With the entity updated we can add a new control for our tags. In
**templates/Articles/add.php** and **templates/Articles/edit.php**,
replace the existing ``tags._ids`` control with the following::

    echo $this->Form->control('tag_string', ['type' => 'text']);

Persisting the Tag String
-------------------------

Now that we can view existing tags as a string, we'll want to save that data as
well. Because we marked the ``tag_string`` as accessible, the ORM will copy that
data from the request into our entity. We can use a ``beforeSave()`` hook method
to parse the tag string and find/build the related entities. Add the following
to **src/Model/Table/ArticlesTable.php**::

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

If you now create or edit articles, you should be able to save tags as a comma
separated list of tags, and have the tags and linking records automatically
created.

While this code is a bit more complicated than what we've done so far, it helps
to showcase how powerful the ORM in CakePHP is. You can manipulate query
results using the :doc:`/core-libraries/collections` methods, and handle
scenarios where you are creating entities on the fly with ease.

Next we'll be adding :doc:`authentication </tutorials-and-examples/cms/authentication>`.
