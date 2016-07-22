Part 3 - Bake and Tags
######################

Creating the Tables in Database
===============================

We'll need to add two tables ``tags`` and ``articles_tags`` in our database::

    CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (title)
    );

    CREATE TABLE articles_tags (
        article_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
        FOREIGN KEY article_key(article_id) REFERENCES articles(id)
    );

Generating Scaffold Code
========================

Because our database is following the CakePHP conventions, we can use the
:doc:`bake console </bake/usage>` application to quickly generate a basic
application. In your command line run the following commands::

    // On Windows you'll need to use bin\cake instead.
        bin/cake bake all tags
        bin/cake bake all articles --force

This will generate the controllers, models, views, their corresponding test
cases, and fixtures for our users, articles and tags resources. If you've
stopped your server, restart it and go to **http://localhost:8765/articles**.
The param ``force`` will force bake to overwrite the files related to Articles
that you've created in part 2.

You should see a basic but functional application providing data access to your
application's database tables. Once you're at the list of articles, add a few
articles, and tags.

.. note::

    If you see a Not Found (404) page, confirm that the Apache mod_rewrite
    module is loaded.

Getting Articles with a Specific Tag
====================================

Now we can build out some more interesting features in our application. Once
you've amassed a collection of articles, it is helpful to be able to search
through them by tag. Next we'll implement a route, controller action, and finder
method to search through articles by tag.

Ideally, we'd have a URL that looks like
**http://localhost:8765/articles/tagged/funny/cat/gifs**. This would let us
find all the articles that have the 'funny', 'cat' or 'gifs' tags. Before we
can implement this, we'll add a new route. Your **config/routes.php** should
look like::

    <?php
    use Cake\Routing\Router;

    Router::defaultRouteClass('Route');

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
        $routes->fallbacks('InflectedRoute');
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
        $tags = $this->request->params['pass'];

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

Creating the Finder Method
--------------------------

In CakePHP we like to keep our controller actions slim, and put most of our
application's logic in the models. If you were to visit the
**/articles/tagged** URL now you would see an error that the ``findTagged()``
method has not been implemented yet, so let's do that. In
**src/Model/Table/ArticlesTable.php** add the following::

    // The $query argument is a query builder instance.
    // The $options array will contain the 'tags' option we passed
    // to find('tagged') in our controller action.
    public function findTagged(Query $query, array $options)
    {
        return $this->find()
            ->distinct(['Articles.id'])
            ->matching('Tags', function ($q) use ($options) {
                if (empty($options['tags'])) {
                    return $q->where(['Tags.title IS' => null]);
                }
                return $q->where(['Tags.title IN' => $options['tags']]);
            });
    }

We just implemented a :ref:`custom finder method <custom-find-methods>`. This is
a very powerful concept in CakePHP that allows you to package up re-usable
queries. Finder methods always get a :doc:`/orm/query-builder` object and an
array of options as parameters. Finders can manipulate the query and add any
required conditions or criteria. When complete, finder methods must return
a modified query object. In our finder we've leveraged the ``distinct()`` and
``matching()`` methods which allow us to find distinct articles that have
a 'matching' tag. The ``matching()`` method accepts an `anonymous function
<http://php.net/manual/en/functions.anonymous.php>`_ that receives a query
builder as its argument. Inside the callback we use the query builder to define
conditions that will filter articles that have specific tags.

Creating the View
-----------------

Now if you visit the **/articles/tagged** URL, CakePHP will show an error
letting you know that you have not made a view file. Next, let's build the
view file for our ``tags()`` action. In **src/Template/Articles/tags.ctp**
put the following content::

    <h1>
        Articles tagged with
        <?= $this->Text->toList($tags) ?>
    </h1>

    <section>
    <?php foreach ($articles as $article): ?>
        <article>
            <!-- Use the HtmlHelper to create a link -->
            <h4><?= $this->Html->link($article->title, $article->url) ?></h4>
            <small><?= h($article->url) ?></small>

            <!-- Use the TextHelper to format text -->
            <?= $this->Text->autoParagraph($article->description) ?>
        </article>
    <?php endforeach; ?>
    </section>

In the above code we use the :doc:`/views/helpers/html` and
:doc:`/views/helpers/text` helpers to assist in generating our view output. We
also use the :php:func:`h` shortcut function to HTML encode output. You should
remember to always use ``h()`` when outputting user data to prevent HTML
injection issues.

The **tags.ctp** file we just created follows the CakePHP conventions for view
template files. The convention is to have the template use the lower case and
underscored version of the controller action name.

You may notice that we were able to use the ``$tags`` and ``$articles``
variables in our view. When we use the ``set()`` method in our controller, we
set specific variables to be sent to the view. The view will make all passed
variables available in the templates as local variables.

You should now be able to visit the **/articles/tagged/funny** URL and see all
the articles tagged with 'funny'.

So far, we've created a basic application to manage articles and tags.
However, everyone can see everyone else's tags. In the next chapter, we'll
implement authentication and restrict the visible articles to only those that
belong to the current user.

Now continue to :doc:`/tutorials-and-examples/part4-authentication` to
continue building your application or :doc:`dive into the documentation
</topics>` to learn more about what CakePHP can do for you.


.. meta::
    :title lang=en: Blog Tutorial Part 3 - Bake and Tags
    :keywords lang=en: tuto, blog, bake, tags, part3
