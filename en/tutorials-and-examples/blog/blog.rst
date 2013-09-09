Blog Tutorial
*************

Welcome to CakePHP. You're probably checking out this tutorial
because you want to learn more about how CakePHP works. It's our
aim to increase productivity and make coding more enjoyable: we
hope you'll see this as you dive into the code.

This tutorial will walk you through the creation of a simple blog
application. We'll be getting and installing Cake, creating and
configuring a database, and creating enough application logic to
list, add, edit, and delete blog posts.

Here's what you'll need:

#. A running web server. We're going to assume you're using Apache,
   though the instructions for using other servers should be very
   similar. We might have to play a little with the server
   configuration, but most folks can get Cake up and running without
   any configuration at all. Make sure you have PHP 5.2.8 or greater.
#. A database server. We're going to be using MySQL server in this
   tutorial. You'll need to know enough about SQL in order to create a
   database: Cake will be taking the reins from there.  Since we're using MySQL,
   also make sure that you have ``pdo_mysql`` enabled in PHP.
#. Basic PHP knowledge. The more object-oriented programming you've
   done, the better: but fear not if you're a procedural fan.
#. Finally, you'll need a basic knowledge of the MVC programming
   pattern. A quick overview can be found in :doc:`/cakephp-overview/understanding-model-view-controller`.
   Don't worry, it's only a half a page or so.

Let's get started!

Getting Cake
============

To get a fresh download, visit the CakePHP project on GitHub:
`http://github.com/cakephp/cakephp/releases <http://github.com/cakephp/cakephp/releases>`_
and download the latest release of 3.0

You can also install CakePHP using ``composer``::

    curl -s https://getcomposer.org/installer | php
    php composer.phar create-project cakephp/app

This will download composer and install the CakePHP application skeleton. For
this tutorial we're just going to download the zip file as its the simplest
option.

Regardless of how you downloaded it, place the code inside of your DocumentRoot.
Once finished, your directory setup should look something like the following::

    /path_to_document_root
        /App
        /Plugin
        /tmp
        /webroot
        /vendor
        .htaccess
        index.php
        README.md

Now might be a good time to learn a bit about how Cake's directory
structure works: check out the
:doc:`/getting-started/cakephp-folder-structure` section.

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
follow Cake's database naming conventions, and Cake's class naming
conventions (both outlined in
:doc:`/getting-started/cakephp-conventions`), you'll be able to take
advantage of a lot of free functionality and avoid configuration.
Cake is flexible enough to accommodate even the worst legacy
database schema, but adhering to convention will save you time.

Check out :doc:`/getting-started/cakephp-conventions` for more
information, but suffice it to say that naming our table 'posts'
automatically hooks it to our Post model, and having fields called
'modified' and 'created' will be automagically managed by Cake.

Database Configuration
======================

Onward and upward: let's tell Cake where our database is and how to
connect to it. For many, this is the first and last time you
configure anything.

A copy of CakePHP's configuration file is found in
``App/Config/app.php.default``. Make a copy of this file in
the same directory, but name it ``app.php``.

The config file should be pretty straightforward: just replace the
values in the ``Datatsources.default`` array with those that apply to your
setup. A sample completed configuration array might look something
like the following::

    $config = [
        // More configuration above.
        'Datasources' => [
            'default' => [
                'className' => 'Cake\Database\Driver\Mysql',
                'persistent' => 'false,',
                'host' => 'localhost',
                'login' => 'cake_blog',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_blog',
                'prefix' => false,
                'encoding' => 'utf8',
            ]
        ],
        // More configuration below.
    ];

Once you've saved your new ``app.php`` file, you should be
able to open your browser and see the Cake welcome page. It should
also tell you that your database connection file was found, and
that Cake can successfully connect to the database.

.. note::

    Remember that you'll need to have PDO, and pdo_mysql enabled in
    your php.ini.

Directory permissions on tmp
============================

You'll also need to set the proper permissions on the ``/tmp`` directory to make
it writable by your webserver. The best way to do this is to find out what user
your webserver runs as (``<?php echo `whoami`; ?>``) and change the ownership of
the ``App/tmp`` directory to that user. The final command you run (in \*nix)
might look something like this::

    $ chown -R www-data App/tmp

If for some reason CakePHP can't write to that directory, you'll be
informed by a warning while not in production mode.

Optional Configuration
======================

There are a few other items that can be configured. Most developers
complete these laundry-list items, but they're not required for
this tutorial. One is defining a custom string (or "salt") for use
in security hashes.

The security salt is used for generating hashes. Change the default
salt value by editing ``/App/Config/app.php``. It doesn't
much matter what the new value is, as long as it's not easily
guessed::

    'Security' => [
        'salt' => 'something long and containing lots of different values.',
    ],


A Note on mod\_rewrite
======================

Occasionally a new user will run into mod\_rewrite issues. For example
if the CakePHP welcome page looks a little funny (no images or css styles),
it probably means mod\_rewrite isn't functioning on your system. Please refer
to one of the sections below about url rewriting for your webserver to get
you up and running:

.. toctree::

    /installation/url-rewriting


#. For some reason or another, you might have obtained a copy of
   CakePHP without the needed .htaccess files. This sometimes happens
   because some operating systems treat files that start with '.' as
   hidden, and don't copy them. Make sure your copy of CakePHP is from
   the downloads section of the site or our git repository.

#. Make sure Apache is loading up mod\_rewrite correctly! You
   should see something like::

       LoadModule rewrite_module             libexec/httpd/mod_rewrite.so

   or (for Apache 1.3)::

       AddModule             mod_rewrite.c
   
   in your httpd.conf.


If you don't want or can't get mod\_rewrite (or some other
compatible module) up and running on your server, you'll need to
use Cake's built in pretty URLs. In ``/App/Config/app.php``,
uncomment the line that looks like::

    'App' => [
        // ...
        // 'baseUrl' => env('SCRIPT_NAME'),
    ]

Also remove these .htaccess files::

    /.htaccess
    /App/.htaccess
    /App/webroot/.htaccess


This will make your URLs look like
www.example.com/index.php/controllername/actionname/param rather
than www.example.com/controllername/actionname/param.

If you are installing CakePHP on a webserver besides Apache, you
can find instructions for getting URL rewriting working for other
servers under the :doc:`/installation/advanced-installation` section.

Now continue to :doc:`/tutorials-and-examples/blog/part-two` to start building
your first CakePHP application.


.. meta::
    :title lang=en: Blog Tutorial
    :keywords lang=en: model view controller,object oriented programming,application logic,directory setup,basic knowledge,database server,server configuration,reins,documentroot,readme,repository,web server,productivity,lib,sql,aim,cakephp,servers,apache,downloads
