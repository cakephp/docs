Bookmarking Tutorial
####################

This tutorial will walk you through the creation of a simple bookmarking
application. To start with, we'll be installing CakePHP, creating our database,
and using the tools CakePHP provides to get our application up fast.

Here's what you'll need:

#. A database server. We're going to be using MySQL server in this
   tutorial. You'll need to know enough about SQL in order to create a
   database: CakePHP will be taking the reins from there. Since we're using MySQL,
   also make sure that you have ``pdo_mysql`` enabled in PHP.
#. Basic PHP knowledge.

Let's get started!

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
in the [app_name] directory.::

    php composer.phar create-project --prefer-dist -s dev cakephp/app bookmarks

The advantage to using Composer is that it will automatically complete some
important set up tasks, such as setting the correct file permissions and
creating your ``config/app.php`` file for you.

There are other ways to install CakePHP. If you cannot or don't want to use
Composer, check out the :doc:`/installation` section.

Regardless of how you downloaded and installed CakePHP, once your set up is
completed, your directory setup should look something like the following::

    /bookmarks
        /config
        /logs
        /plugins
        /src
        /tests
        /tmp
        /vendor
        /webroot
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

This will start PHP's built-in webserver on port 8765. Open up
``http://localhost:8765`` in your web browser to see the welcome page. All the
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
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created DATETIME,
        updated DATETIME
    );

    CREATE TABLE bookmarks (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(50),
        description TEXT,
        url TEXT,
        created DATETIME,
        updated DATETIME,
        FOREIGN KEY user_key(user_id) REFERENCES users(id)
    );

    CREATE TABLE tags (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        created DATETIME,
        updated DATETIME,
        UNIQUE KEY title
    );

    CREATE TABLE bookmarks_tags (
        bookmark_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (bookmark_id, tag_id),
        INDEX tag_idx (tag_id, bookmark_id),
        FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
        FOREIGN KEY bookmark_key(bookmark_id) REFERENCES bookmarks(id)
    );

The table and column name choices are not arbitrary. By using CakePHP's
:doc:`naming conventions </intro/conventions>`, we can leverage CakePHP better
and avoid having to configure the framework.  CakePHP is flexible enough to
accommodate even inconsistent legacy database schemas, but adhering to the
conventions will save you time.

Database Configuration
======================

Next, let's tell CakePHP where our database is and how to connect to it.
For many, this will be the first and last time you will need to configure
anything.

The configuration should be pretty straightforward: just replace the
values in the ``Datasources.default`` array in the ``config/app.php`` file
with those that apply to your setup. A sample completed configuration
array might look something like the following::

    $config = [
        // More configuration above.
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Connection',
                'driver' => 'Cake\Database\Driver\Mysql',
                'persistent' => false,
                'host' => 'localhost',
                'login' => 'cakephp',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_bookmarks',
                'encoding' => 'utf8',
                'timezone' => 'UTC'
            ],
        ],
        // More configuration below.
    ];

Once you've saved your ``config/app.php`` file, you should the 'CakePHP is able
to connect to the database' section have a checkmark.

.. note::

    A copy of CakePHP's default configuration file is found in
    ``config/app.default.php``.

Generating Scaffold Code
========================

Because our database is following the CakePHP conventions, we can use the
:doc:`bake console </console-and-shells/code-generation-with-bake>` application to quickly generate a basic application. In your
command line run the following commands::

    bin/cake bake all users
    bin/cake bake all bookmarks
    bin/cake bake all tags

This will generate the controllers, models, views, their co-responding test
cases, and fixtures for our users, bookmarks and tags resources. If you've
stopped your server, restart it and go to ``http://localhost:8765/bookmarks``.

Once you're at the list of bookmarks, add a few users, bookmarks, and tags.

Adding Password Hashing
=======================

When you created your users, you probably noticed that the passwords were stored
in plain text. This is pretty bad from a security point of view, so lets get
that fixed.

This is also a good time to talk about the model layer in CakePHP. In CakePHP,
we separate the methods that operate on a collection of objects, and a single
object into different classes. Methods that operate on the collection of
entities are put in the *Table* class, while features belonging to a single
record are put on the *Entity* class.

For example, password hashing is done on the individual record, so we'll
implement this behavior on the entity object. Because, we want to hash the
password each time it is set, we'll use a mutator/setter method. CakePHP will
call convention based setter methods any time a property is set in one of your
entities. Lets add a setter for the password. In ``src/Model/Entity/User.php``
add the following::

    namespace App\Model\Entity;

    use Cake\Entity\Entity;
    use Cake\Auth\DefaultPasswordHasher;

    class User extends Entity {

        // Code from bake.

        protected function _setPassword($value) {
            $hasher = new DefaultPasswordHasher();
            return $hasher->hash($value);
        }
    }

Now update one of the user's you set before, and you should see a hashed
password instead of the original value. CakePHP hashes passwords with `bcrypt
<http://codahale.com/how-to-safely-store-a-password/>`_ by default.

Getting Bookmarks with a Specific Tag
=====================================

Now that we're storing passwords safely, we can build out some more interesting
features in our application. Once you've amassed a collection of bookmarks, it
is helpful to be able to search through them by tag. Next we'll implement
a route, controller action, and finder method to search through bookmarks by
tag.

Ideally, we'd have a url that looks like
``http://localhost:8765/bookmarks/tagged/funny/cat/gifs`` This would let us find
all the bookmarks that have the 'funny', 'cat' and 'gifs' tags. Before we can
implement this, we'll add a new route. In ``config/routes.php``, add the
following::

    Router::scope(
        '/bookmarks',
        ['controller' => 'Bookmarks'],
        function ($routes) {
            $routes->connect('/tagged/*', ['action' => 'tags'])
        }
    );

The above defines a new 'route' which connects the ``/bookmarks/tagged/*`` path,
to ``BookmarksController::tags``. By defining routes, you can isolate how your
URLs look, from how they are implemented. If we were to visit
``http://localhost:8765/bookmarks/tagged``, we would see a helpful error page
from CakePHP. Lets implement that missing method now. In
``src/Controller/BookmarksController.php`` add the following::

    public function tags() {
        $bookmarks = $this->Bookmarks->find('tagged', [
            'tags' => $this->request->params['pass']
        ]);
        $this->set(compact('bookmarks'));
    }

Creating the Finder Method
--------------------------

In CakePHP we like to keep our controller actions slim, and put most of our
application's logic in the models. If you were to visit the
``/bookmarks/tagged`` URL now you would see an error that the ``findTagged``
method has not been implemented yet, so lets do that. In
``src/Model/Table/BookmarksTable.php`` add the following::

    public function findTagged(Query $query, array $options) {
        return $this->find()
            ->contain('Tags')
            ->matching('Tags', function($q) use ($options) {
                return $q->where(['Tags.title IN' => $options['tags']]);
            });
    }

We just implemented a :ref:`custom finder method <custom-find-methods>`. This is
a very powerful concept in CakePHP that allows you to package up re-usable
queries. In our finder we've leveraged the ``matching()`` method which allows us
to find bookmarks that have a 'matching' tag.

Creating the View
-----------------

Now if you visit, the ``/bookmarks/tagged`` URL, CakePHP will show an error
letting you know that you have not made a view file. Next, lets build the view
file for our ``tags`` action. In ``src/Template/Bookmarks/tags.ctp`` put the
following content::

    <h1>
        Bookmarks tagged with
        <?= $this->Text->toList($this->request->params['pass']) ?>
    </h1>

    <section>
    <?php foreach ($bookmarks as $bookmark): ?>
        <article>
            <h4><?= $this->Html->link($bookmark->title, $bookmark->url) ?></h4>
            <small><?= h($bookmark->url) ?></small>
            <?= $this->Text->autoParagraph($bookmark->description) ?>
            <p>
            <?php
            $tags = collection($bookmark->tags)->extract('title');
            echo $this->Text->toList($tags->toArray());
            ?>
            </p>
        </article>
    <?php endforeach; ?>
    </section>

In our view we've used a few of CakePHP's built-in :doc:`helpers
</views/helpers>`. Helpers are used to make re-usable logic for formatting data,
creating HTML or other view output.

You should now be able to visit the ``/bookmarks/tags/funny`` URL and see all
the bookmarks tagged with 'funny'.

So far, we've created a basic application to manage bookmarks, tags and users.
However, everyone can see everyone else's tags. In the next chapter, we'll
implement authentication and restrict the visible bookmarks to only those that
belong to the current user.

Now continue to :doc:`/tutorials-and-examples/bookmarks/authentication` to
continue building your application or :doc:`dive into the documentation
</topics>` to learn more about what CakePHP can do for you.
