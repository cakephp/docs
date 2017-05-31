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

Adding Password Hashing
-----------------------

If you were to create/update a user at this point in time, you might notice that
the passwords are stored in plain text. This is really bad from a security point
of view, so lets fix that.

This is also a good time to talk about the model layer in CakePHP. In CakePHP,
we separate the methods that operate on a collection of objects, and a single
object into different classes. Methods that operate on the collection of
entities are put in the ``Table`` class, while features belonging to a single
record are put on the ``Entity`` class.

For example, password hashing is done on the individual record, so we'll
implement this behavior on the entity object. Because we want to hash the
password each time it is set, we'll use a mutator/setter method. CakePHP will
call convention based setter methods any time a property is set in one of your
entities. Let's add a setter for the password. In **src/Model/Entity/User.php**
add the following::

    <?php
    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher; // Add this line
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // Code from bake.

        protected function _setPassword($value)
        {
            if (strlen($value)) {
                $hasher = new DefaultPasswordHasher();

                return $hasher->hash($value);
            }
        }
    }

Now update one of the users you created earlier, if you change their password,
you should see a hashed password instead of the original value on the list or
view pages. CakePHP hashes passwords with `bcrypt
<http://codahale.com/how-to-safely-store-a-password/>`_ by default. You can also
use SHA-1 or MD5 if you're working with an existing database, but we recommend
bcrypt for all new applications.

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

    <?php
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
Add the following to **src/Template/Articles/add.ctp**::

    <?= $this->Form->control('tags._ids', ['options' => $tags]) ?>

This will render a multiple select element that uses the ``$tags`` variable to
generate the select box options. You should now create a couple new articles
that have tags, as in the following section we'll be adding the ability to find
articles by tags.

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
    use Cake\Routing\Route\DashedRoute;
    use Cake\Routing\Router;

    Router::defaultRouteClass(DashedRoute::class);

    // New route we're adding for our tagged action.
    // The trailing `*` tells CakePHP that this action has
    // passed parameters.
    Router::scope(
        '/bookmarks',
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

        // Use the ArticlesTable to find tagged bookmarks.
        $bookmarks = $this->Articles->find('tagged', [
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

Creating the Finder Method
--------------------------

In CakePHP we like to keep our controller actions slim, and put most of our
application's logic in the model layer. If you were to visit the
**/articles/tagged** URL now you would see an error that the ``findTagged()``
method has not been implemented yet, so let's do that. In
**src/Model/Table/ArticlesTable.php** add the following::

    // The $query argument is a query builder instance.
    // The $options array will contain the 'tags' option we passed
    // to find('tagged') in our controller action.
    public function findTagged(Query $query, array $options)
    {
        $query = $query
            ->select(['id', 'user_id', 'title', 'body', 'published', 'created'])
            ->distinct(['id', 'user_id', 'title', 'body', 'published', 'created']);

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
``leftJoin()`` methods which allow us to find distinct bookmarks that have
a 'matching' tag.

Creating the View
-----------------

Now if you visit the **/articles/tagged** URL again, CakePHP will show a new error
letting you know that you have not made a view file. Next, let's build the
view file for our ``tags()`` action. In **src/Template/Articles/tags.ctp**
put the following content::

    <h1>
        Articles tagged with
        <?= $this->Text->toList(h($tags)) ?>
    </h1>

    <section>
    <?php foreach ($articles as $article): ?>
        <article>
            <!-- Use the HtmlHelper to create a link -->
            <h4><?= $this->Html->link(
                $article->title,
                ['controller' => 'Articles', 'action' => 'view', $article->id]
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

The **tags.ctp** file we just created follows the CakePHP conventions for view
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

    use Cake\Collection\Collection;

    protected function _getTagString()
    {
        if (isset($this->_properties['tag_string'])) {
            return $this->_properties['tag_string'];
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
**src/Template/Articles/add.ctp** and **src/Template/Articles/edit.ctp**,
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

While this code is a bit more complicated than what we've done so far, it helps
to showcase how powerful the ORM in CakePHP is. You can manipulate query
results using the :doc:`/core-libraries/collections` methods, and handle
scenarios where you are creating entities on the fly with ease.

Next we'll be adding :doc:`authentication <authentication>`.
