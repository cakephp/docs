Bookmarker Tutorial
###################

This tutorial will walk you through the creation of a simple bookmarking
application (bookmarker). To start with, we'll be installing CakePHP, creating
our database, and using the tools CakePHP provides to get our application up
fast.

Here's what you'll need:

#. A database server. We're going to be using MySQL server in this tutorial.
   You'll need to know enough about SQL in order to create a database: CakePHP
   will be taking the reins from there. Since we're using MySQL, also make sure
   that you have ``pdo_mysql`` enabled in PHP.
#. Basic PHP knowledge.

Before starting you should make sure that you have got an up to date PHP
version:

.. code-block:: bash

    php -v

You should at least have got installed PHP |minphpversion| (CLI) or higher.
Your webserver's PHP version must also be of |minphpversion| or higher, and should best be
the same version your command line interface (CLI) PHP version is of.
If you'd like to see the completed application, checkout `cakephp/bookmarker
<https://github.com/cakephp/bookmarker-tutorial>`__. Let's get started!

Getting CakePHP
===============

The easiest way to install CakePHP is to use Composer.  Composer is a simple way
of installing CakePHP from your terminal or command line prompt.  First, you'll
need to download and install Composer if you haven't done so already. If you
have cURL installed, it's as easy as running the following::

    curl -s https://getcomposer.org/installer | php

Or, you can download ``composer.phar`` from the
`Composer website <https://getcomposer.org/download/>`_.

Then simply type the following line in your terminal from your
installation directory to install the CakePHP application skeleton
in the **bookmarker** directory::

    php composer.phar create-project --prefer-dist cakephp/app bookmarker

If you downloaded and ran the `Composer Windows Installer
<https://getcomposer.org/Composer-Setup.exe>`_, then type the following line in
your terminal from your installation directory (ie.
C:\\wamp\\www\\dev\\cakephp3)::

    composer self-update && composer create-project --prefer-dist cakephp/app bookmarker

The advantage to using Composer is that it will automatically complete some
important set up tasks, such as setting the correct file permissions and
creating your **config/app.php** file for you.

There are other ways to install CakePHP. If you cannot or don't want to use
Composer, check out the :doc:`/installation` section.

Regardless of how you downloaded and installed CakePHP, once your set up is
completed, your directory setup should look something like the following::

    /bookmarker
        /bin
        /config
        /logs
        /plugins
        /src
        /tests
        /tmp
        /vendor
        /webroot
        .editorconfig
        .gitignore
        .htaccess
        .travis.yml
        composer.json
        index.php
        phpunit.xml.dist
        README.md

Now might be a good time to learn a bit about how CakePHP's directory structure
works: check out the :doc:`/intro/cakephp-folder-structure` section.

Checking our Installation
=========================

We can quickly check that our installation is correct, by checking the default
home page. Before you can do that, you'll need to start the development server::

    bin/cake server

.. note::

    For Windows, the command needs to be ``bin\cake server`` (note the backslash).

This will start PHP's built-in webserver on port 8765. Open up
**http://localhost:8765** in your web browser to see the welcome page. All the
bullet points should be checkmarks other than CakePHP being able to connect to
your database. If not, you may need to install additional PHP extensions, or set
directory permissions.

Creating the Database
=====================

Next, let's set up the database for our bookmarking application. If you
haven't already done so, create an empty database for use in this
tutorial, with a name of your choice, e.g. ``cake_bookmarks``. You can execute
the following SQL to create the necessary tables::

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created DATETIME,
        modified DATETIME
    );

    CREATE TABLE bookmarks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(50),
        description TEXT,
        url TEXT,
        created DATETIME,
        modified DATETIME,
        FOREIGN KEY user_key (user_id) REFERENCES users(id)
    );

    CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (title)
    );

    CREATE TABLE bookmarks_tags (
        bookmark_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (bookmark_id, tag_id),
        FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
        FOREIGN KEY bookmark_key(bookmark_id) REFERENCES bookmarks(id)
    );

You may have noticed that the ``bookmarks_tags`` table used a composite primary
key. CakePHP supports composite primary keys almost everywhere, making it easier
to build multi-tenanted applications.

The table and column names we used were not arbitrary. By using CakePHP's
:doc:`naming conventions </intro/conventions>`, we can leverage CakePHP better
and avoid having to configure the framework. CakePHP is flexible enough to
accommodate even inconsistent legacy database schemas, but adhering to the
conventions will save you time.

Database Configuration
======================

Next, let's tell CakePHP where our database is and how to connect to it.
For many, this will be the first and last time you will need to configure
anything.

The configuration should be pretty straightforward: just replace the
values in the ``Datasources.default`` array in the **config/app.php** file
with those that apply to your setup. A sample completed configuration
array might look something like the following::

    return [
        // More configuration above.
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'username' => 'cakephp',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_bookmarks',
                'encoding' => 'utf8',
                'timezone' => 'UTC',
                'cacheMetadata' => true,
            ],
        ],
        // More configuration below.
    ];

Once you've saved your **config/app.php** file, you should see that 'CakePHP is
able to connect to the database' section have a checkmark.

.. note::

    A copy of CakePHP's default configuration file is found in
    **config/app.default.php**.

Generating Scaffold Code
========================

Because our database is following the CakePHP conventions, we can use the
:doc:`bake console </bake/usage>` application to quickly generate a basic
application. In your command line run the following commands::

    // On Windows you'll need to use bin\cake instead.
    bin/cake bake all users
    bin/cake bake all bookmarks
    bin/cake bake all tags

This will generate the controllers, models, views, their corresponding test
cases, and fixtures for our users, bookmarks and tags resources. If you've
stopped your server, restart it and go to **http://localhost:8765/bookmarks**.

You should see a basic but functional application providing data access to your
application's database tables. Once you're at the list of bookmarks, add a few
users, bookmarks, and tags.

.. note::

    If you see a Not Found (404) page, confirm that the Apache mod_rewrite
    module is loaded.

Adding Password Hashing
=======================

When you created your users (by visiting
**http://localhost:8765/users**), you probably noticed that the
passwords were stored in plain text. This is pretty bad from a security point of
view, so let's get that fixed.

This is also a good time to talk about the model layer in CakePHP. In CakePHP,
we separate the methods that operate on a collection of objects, and a single
object into different classes. Methods that operate on the collection of
entities are put in the ``Table`` class, while features belonging to a single
record are put on the ``Entity`` class.

For example, password hashing is done on the individual record, so we'll
implement this behavior on the entity object. Because, we want to hash the
password each time it is set, we'll use a mutator/setter method. CakePHP will
call convention based setter methods any time a property is set in one of your
entities. Let's add a setter for the password. In **src/Model/Entity/User.php**
add the following::

    namespace App\Model\Entity;

    use Cake\Auth\DefaultPasswordHasher; //include this line
    use Cake\ORM\Entity;

    class User extends Entity
    {

        // Code from bake.

        protected function _setPassword($value)
        {
            $hasher = new DefaultPasswordHasher();
            return $hasher->hash($value);
        }
    }

Now update one of the users you created earlier, if you change their password,
you should see a hashed password instead of the original value on the list or
view pages. CakePHP hashes passwords with `bcrypt
<http://codahale.com/how-to-safely-store-a-password/>`_ by default. You can also
use sha1 or md5 if you're working with an existing database.

.. note::

      If the password doesn't get hashed, make sure you followed the same case for the password member of the class while naming the setter function

Getting Bookmarks with a Specific Tag
=====================================

Now that we're storing passwords safely, we can build out some more interesting
features in our application. Once you've amassed a collection of bookmarks, it
is helpful to be able to search through them by tag. Next we'll implement
a route, controller action, and finder method to search through bookmarks by
tag.

Ideally, we'd have a URL that looks like
**http://localhost:8765/bookmarks/tagged/funny/cat/gifs**. This would let us
find all the bookmarks that have the 'funny', 'cat' or 'gifs' tags. Before we
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
        ['controller' => 'Bookmarks'],
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

The above defines a new 'route' which connects the **/bookmarks/tagged/** path,
to ``BookmarksController::tags()``. By defining routes, you can isolate how your
URLs look, from how they are implemented. If we were to visit
**http://localhost:8765/bookmarks/tagged**, we would see a helpful error page
from CakePHP informing you that the controller action does not exist. Let's
implement that missing method now. In **src/Controller/BookmarksController.php**
add the following::

    public function tags()
    {
        // The 'pass' key is provided by CakePHP and contains all
        // the passed URL path segments in the request.
        $tags = $this->request->getParam('pass');

        // Use the BookmarksTable to find tagged bookmarks.
        $bookmarks = $this->Bookmarks->find('tagged', [
            'tags' => $tags
        ]);

        // Pass variables into the view template context.
        $this->set([
            'bookmarks' => $bookmarks,
            'tags' => $tags
        ]);
    }

To access other parts of the request data, consult the :ref:`cake-request`
section.

Creating the Finder Method
--------------------------

In CakePHP we like to keep our controller actions slim, and put most of our
application's logic in the models. If you were to visit the
**/bookmarks/tagged** URL now you would see an error that the ``findTagged()``
method has not been implemented yet, so let's do that. In
**src/Model/Table/BookmarksTable.php** add the following::

    // The $query argument is a query builder instance.
    // The $options array will contain the 'tags' option we passed
    // to find('tagged') in our controller action.
    public function findTagged(Query $query, array $options)
    {
        $bookmarks = $this->find()
            ->select(['id', 'url', 'title', 'description']);

        if (empty($options['tags'])) {
            $bookmarks
                ->leftJoinWith('Tags')
                ->where(['Tags.title IS' => null]);
        } else {
            $bookmarks
                ->innerJoinWith('Tags')
                ->where(['Tags.title IN ' => $options['tags']]);
        }

        return $bookmarks->group(['Bookmarks.id']);
    }

We just implemented a :ref:`custom finder method <custom-find-methods>`. This is
a very powerful concept in CakePHP that allows you to package up re-usable
queries. Finder methods always get a :doc:`/orm/query-builder` object and an
array of options as parameters. Finders can manipulate the query and add any
required conditions or criteria. When complete, finder methods must return
a modified query object. In our finder we've leveraged the ``innerJoinWith()``,
``where()`` and ``group()`` methods which allow us to find distinct bookmarks
that have a matching tag.  When no tags are provided we use a
``leftJoinWith()`` and modify the 'where' condition, finding bookmarks without
tags.

Creating the View
-----------------

Now if you visit the **/bookmarks/tagged** URL, CakePHP will show an error
letting you know that you have not made a view file. Next, let's build the
view file for our ``tags()`` action. In **src/Template/Bookmarks/tags.ctp**
put the following content::

    <h1>
        Bookmarks tagged with
        <?= $this->Text->toList(h($tags)) ?>
    </h1>

    <section>
    <?php foreach ($bookmarks as $bookmark): ?>
        <article>
            <!-- Use the HtmlHelper to create a link -->
            <h4><?= $this->Html->link($bookmark->title, $bookmark->url) ?></h4>
            <small><?= h($bookmark->url) ?></small>

            <!-- Use the TextHelper to format text -->
            <?= $this->Text->autoParagraph(h($bookmark->description)) ?>
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

You may notice that we were able to use the ``$tags`` and ``$bookmarks``
variables in our view. When we use the ``set()`` method in our controller, we
set specific variables to be sent to the view. The view will make all passed
variables available in the templates as local variables.

You should now be able to visit the **/bookmarks/tagged/funny** URL and see all
the bookmarks tagged with 'funny'.

So far, we've created a basic application to manage bookmarks, tags and users.
However, everyone can see everyone else's tags. In the next chapter, we'll
implement authentication and restrict the visible bookmarks to only those that
belong to the current user.

Now continue to :doc:`/tutorials-and-examples/bookmarks/part-two` to
continue building your application or :doc:`dive into the documentation
</topics>` to learn more about what CakePHP can do for you.
