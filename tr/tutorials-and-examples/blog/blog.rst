Blog Tutorial
#############

Welcome to CakePHP. You're probably checking out this tutorial
because you want to learn more about how CakePHP works. It's our
aim to increase productivity and make coding more enjoyable: we
hope you'll see this as you dive into the code.

This tutorial will walk you through the creation of a simple blog
application. We'll be getting and installing CakePHP, creating and
configuring a database, and creating enough application logic to
list, add, edit, and delete blog posts.

Here's what you'll need:

#. A running web server. We're going to assume you're using Apache,
   though the instructions for using other servers should be very
   similar. We might have to play a little with the server
   configuration, but most folks can get CakePHP up and running without
   any configuration at all. Make sure you have PHP 5.2.8 or greater.
#. A database server. We're going to be using MySQL server in this
   tutorial. You'll need to know enough about SQL in order to create a
   database: CakePHP will be taking the reins from there. Since we're using MySQL,
   also make sure that you have ``pdo_mysql`` enabled in PHP.
#. Basic PHP knowledge. The more object-oriented programming you've
   done, the better: but fear not if you're a procedural fan.
#. Finally, you'll need a basic knowledge of the MVC programming pattern.
   A quick overview can be found in
   :doc:`/cakephp-overview/understanding-model-view-controller`.  Don't worry,
   it's only half a page or so.

Let's get started!

Getting CakePHP
===============

First, let's get a copy of fresh CakePHP code.

To get a fresh download, visit the CakePHP project on GitHub:
`https://github.com/cakephp/cakephp/tags <https://github.com/cakephp/cakephp/tags>`_
and download the latest release of 2.0

You can also clone the repository using
`git <http://git-scm.com/>`_.
``git clone git://github.com/cakephp/cakephp.git``

Regardless of how you downloaded it, place the code inside of your
DocumentRoot. Once finished, your directory setup should look
something like the following::

    /path_to_document_root
        /app
        /lib
        /plugins
        /vendors
        .htaccess
        index.php
        README

Now might be a good time to learn a bit about how CakePHP's directory
structure works: check out the
:doc:`/getting-started/cakephp-folder-structure` section.

Tmp directory permissions
-------------------------

Next we'll need to make the ``app/tmp`` directory writable by the webserver.
The best way to do this is to find out what user your webserver
runs as. You can run ``<?php echo exec('whoami'); ?>`` inside any PHP file your
webserver can execute. You should see a username printed. Change the ownership of
the ``app/tmp`` directory to that user. The final command you run
(in \*nix) might look something like this::

    $ chown -R www-data app/tmp

If for some reason CakePHP can't write to that directory, you'll see
warnings and uncaught exceptions that cache data cannot be written.

Creating the Blog Database
==========================

Next, let's set up the underlying database for our blog. If you
haven't already done so, create an empty database for use in this
tutorial, with a name of your choice. Right now, we'll just create
a single table to store our posts. We'll also throw in a few posts
right now to use for testing purposes. Execute the following SQL
statements into your database::

    /* First, create our posts table: */
    CREATE TABLE posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

    /* Then insert some posts for testing: */
    INSERT INTO posts (title,body,created)
        VALUES ('The title', 'This is the post body.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('A title once again', 'And the post body follows.', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('Title strikes back', 'This is really exciting! Not.', NOW());

The choices on table and column names are not arbitrary. If you
follow CakePHP's database naming conventions, and CakePHP's class naming
conventions (both outlined in
:doc:`/getting-started/cakephp-conventions`), you'll be able to take
advantage of a lot of free functionality and avoid configuration.
CakePHP is flexible enough to accommodate even the worst legacy
database schema, but adhering to convention will save you time.

Check out :doc:`/getting-started/cakephp-conventions` for more
information, but suffice it to say that naming our table 'posts'
automatically hooks it to our Post model, and having fields called
'modified' and 'created' will be automagically managed by CakePHP.

CakePHP Database Configuration
==============================

Onward and upward: let's tell CakePHP where our database is and how to
connect to it. For many, this is the first and last time you
configure anything.

A copy of CakePHP's database configuration file is found in
``/app/Config/database.php.default``. Make a copy of this file in
the same directory, but name it ``database.php``.

The config file should be pretty straightforward: just replace the
values in the ``$default`` array with those that apply to your
setup. A sample completed configuration array might look something
like the following::

    public $default = array(
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'port' => '',
        'login' => 'cakeBlog',
        'password' => 'c4k3-rUl3Z',
        'database' => 'cake_blog_tutorial',
        'schema' => '',
        'prefix' => '',
        'encoding' => 'utf8'
    );

Once you've saved your new ``database.php`` file, you should be
able to open your browser and see the CakePHP welcome page. It should
also tell you that your database connection file was found, and
that CakePHP can successfully connect to the database.

.. note::

    Remember that you'll need to have PDO, and pdo_mysql enabled in
    your php.ini.

Optional Configuration
======================

There are a few other items that can be configured. Most developers
complete these laundry-list items, but they're not required for
this tutorial. One is defining a custom string (or "salt") for use
in security hashes. The second is defining a custom number (or
"seed") for use in encryption.

The security salt is used for generating hashes. Change the default
``Security.salt`` value in ``/app/Config/core.php``. The replacement value
should be long, hard to guess and be as random as you can make it::

    /**
     * A random string used in security hashing methods.
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');

The cipher seed is used for encrypt/decrypt strings. Change the default
``Security.cipherSeed`` value by editing ``/app/Config/core.php``. The
replacement value should be a large random integer::

    /**
     * A random numeric string (digits only) used to encrypt/decrypt strings.
     */
    Configure::write('Security.cipherSeed', '7485712659625147843639846751');

A Note on mod\_rewrite
======================

Occasionally new users will run into mod\_rewrite issues. For example
if the CakePHP welcome page looks a little funny (no images or CSS styles),
it probably means mod\_rewrite is not functioning on your system. Please refer
to one of the sections below about URL rewriting for your webserver to get
you up and running:

.. toctree::
    :maxdepth: 1

    /installation/url-rewriting


Now continue to :doc:`/tutorials-and-examples/blog/part-two` to start building your first CakePHP application.


.. meta::
    :title lang=en: Blog Tutorial
    :keywords lang=en: model view controller,object oriented programming,application logic,directory setup,basic knowledge,database server,server configuration,reins,documentroot,readme,repository,web server,productivity,lib,sql,aim,cakephp,servers,apache,downloads
