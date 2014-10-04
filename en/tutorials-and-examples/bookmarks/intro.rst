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
        password VARCHAR(255) NOT NULL
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
        updated DATETIME
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


