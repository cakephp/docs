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
   any configuration at all. Make sure you have PHP 5.4.19 or greater, and
   that the ``mbstring``, ``intl`` and ``mcrypt`` extensions are enabled in PHP.
#. A database server. We're going to be using MySQL server in this
   tutorial. You'll need to know enough about SQL in order to create a
   database: CakePHP will be taking the reins from there. Since we're using MySQL,
   also make sure that you have ``pdo_mysql`` enabled in PHP.
#. Basic PHP knowledge.

Let's get started!

Getting CakePHP
===============

The easiest way to install CakePHP is to use Composer.
Composer is an simple way of installing CakePHP from your terminal or
command line prompt. Simply type the following two lines in your terminal from
your webroot directory::

    curl -s https://getcomposer.org/installer | php
    php composer.phar create-project --prefer-dist -s dev cakephp/app [app-name]

This will download Composer and install the CakePHP application skeleton in the
[app-name] directory.

The advantage to using Composer is that it will automatically complete some
important set up tasks, such as setting the correct file permissions and
creating your config/app.php file for you.

There are other ways to install CakePHP. If you cannot or don't want to use
Composer, check out the :doc:`/installation` section.

Regardless of how you downloaded and installed CakePHP, once your set up is
completed, your directory setup should look something like the following::

    /cake_install
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

Now might be a good time to learn a bit about how CakePHP's directory
structure works: check out the
:doc:`/getting-started/cakephp-folder-structure` section.

Directory Permissions on tmp and logs
=====================================

You'll need to set the proper permissions on the ``/tmp`` and ``/logs`` directories to make
them writable by your webserver. The best way to do this, is to find out what user
your webserver runs as (``<?= `whoami`; ?>``) and change the ownership of
these two directories to that user. The final command you run (in \*nix)
might look something like this::

    $ chown -R www-data tmp
    $ chown -R www-data logs

If for some reason CakePHP can't write to these directories, you'll be
informed by a warning while not in production mode.

While not recommended, if you are unable to set the permissions to the same as
your webserver, you can simply set write permissions on the folder by running a
command such as::

    $ chmod 777 -R tmp
    $ chmod 777 -R logs

Creating the Blog Database
==========================

Next, let's set up the underlying MySQL database for our blog. If you
haven't already done so, create an empty database for use in this
tutorial, with a name of your choice, e.g. ``cake_blog``. Right now,
we'll just create a single table to store our articles. We'll also throw
in a few articles to use for testing purposes. Execute the following
SQL statements into your database::

    /* First, create our articles table: */
    CREATE TABLE articles (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

    /* Then insert some articles for testing: */
    INSERT INTO articles (title,body,created)
        VALUES ('The title', 'This is the article body.', NOW());
    INSERT INTO articles (title,body,created)
        VALUES ('A title once again', 'And the article body follows.', NOW());
    INSERT INTO articles (title,body,created)
        VALUES ('Title strikes back', 'This is really exciting! Not.', NOW());

The choices on table and column names are not arbitrary. If you
follow CakePHP's database naming conventions, and CakePHP's class naming
conventions (both outlined in
:doc:`/getting-started/cakephp-conventions`), you'll be able to take
advantage of a lot of free functionality and avoid configuration.
CakePHP is flexible enough to accommodate even inconsistent legacy
database schemas, but adhering to the conventions will save you time.

Check out :doc:`/getting-started/cakephp-conventions` for more
information, but it's suffice to say that naming our table 'articles'
automatically hooks it to our Articles model, and having fields called
'modified' and 'created' will be automatically managed by CakePHP.

Database Configuration
======================

Next, let's tell CakePHP where our database is and how to connect to it.
For many, this is the first and last time you will need to configure anything.

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
                'login' => 'cake_blog',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_blog',
                'prefix' => false,
                'encoding' => 'utf8',
                'timezone' => 'UTC'
            ],
        ],
        // More configuration below.
    ];

Once you've saved your ``config/app.php`` file, you should be able to open
your browser and see the CakePHP welcome page. It should also tell
you that your database connection file was found, and that CakePHP
can successfully connect to the database.

.. note::

    A copy of CakePHP's default configuration file is found in ``config/app.default.php``.

Optional Configuration
======================

There are a few other items that can be configured. Most developers
complete these laundry-list items, but they're not required for
this tutorial. One is defining a custom string (or "salt") for use
in security hashes.

The security salt is used for generating hashes. Change the default
salt value by editing ``config/app.php``. It doesn't
much matter what the new value is, as long as it's not easily
guessed::

    'Security' => [
        'salt' => 'something long and containing lots of different values.',
    ],


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


#. For some reason or another, you might have obtained a copy of
   CakePHP without the needed .htaccess files. This sometimes happens
   because some operating systems treat files that start with '.' as
   hidden, and don't copy them. Make sure your copy of CakePHP is from
   the downloads section of the site or our GitHub repository.

#. Make sure Apache is loading up mod\_rewrite correctly! You
   should see something like::

       LoadModule rewrite_module libexec/httpd/mod_rewrite.so

   or (for Apache 1.3)::

       AddModule mod_rewrite.c

   in your httpd.conf.

If you don't want or can't get mod\_rewrite (or some other
compatible module) up and running on your server, you'll need to
use CakePHP's built in pretty URLs. In ``config/app.php``,
uncomment the line that looks like::

    'App' => [
        // ...
        // 'baseUrl' => env('SCRIPT_NAME'),
    ]

Also remove these .htaccess files::

    /.htaccess
    webroot/.htaccess

This will make your URLs look like
www.example.com/index.php/controllername/actionname/param rather
than www.example.com/controllername/actionname/param.

If you are installing CakePHP on a webserver besides Apache, you
can find instructions for getting URL rewriting working for other
servers under the :doc:`/installation/url-rewriting` section.

Now continue to :doc:`/tutorials-and-examples/blog/part-two` to start building
your first CakePHP application.


.. meta::
    :title lang=en: Blog Tutorial
    :keywords lang=en: model view controller,object oriented programming,application logic,directory setup,basic knowledge,database server,server configuration,reins,documentroot,readme,repository,web server,productivity,lib,sql,aim,cakephp,servers,apache,downloads
