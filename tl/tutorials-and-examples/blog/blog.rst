Blog Tutorial
*************

This tutorial will walk you through the creation of a simple blog application.
We'll be installing CakePHP, creating a database, and creating enough
application logic to list, add, edit, and delete blog articles.

Here's what you'll need:

#. A running web server. We're going to assume you're using Apache,
   though the instructions for using other servers should be very
   similar. We might have to play a little with the server
   configuration, but most folks can get CakePHP up and running without
   any configuration at all. Make sure you have PHP |minphpversion| or greater, and
   that the ``mbstring`` and ``intl`` extensions are enabled in PHP.
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
in the directory that you wish to use it with. For this example we will be using
"blog" but feel free to change it to something else.::

    php composer.phar create-project --prefer-dist cakephp/app blog

In case you've already got composer installed globally, you may instead type::

<<<<<<< HEAD
    composer self-update && composer create-project --prefer-dist cakephp/app blog
=======
You can also clone the repository using
`git <http://git-scm.com/>`_::

    git clone -b 2.x git://github.com/cakephp/cakephp.git
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

The advantage to using Composer is that it will automatically complete some
important set up tasks, such as setting the correct file permissions and
creating your config/app.php file for you.

There are other ways to install CakePHP. If you cannot or don't want to use
Composer, check out the :doc:`/installation` section.

Regardless of how you downloaded and installed CakePHP, once your set up is
completed, your directory setup should look something like the following::

    /cake_install
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

Now might be a good time to learn a bit about how CakePHP's directory
structure works: check out the
:doc:`/intro/cakephp-folder-structure` section.

Directory Permissions on tmp and logs
=====================================

The ``tmp`` and ``logs`` directories need to have proper permissions to be writable
by your webserver. If you used Composer for the install, this should have been done
for you and confirmed with a "Permissions set on <folder>" message. If you instead
got an error message or want to do it manually, the best way would be to find out
what user your webserver runs as (``<?= `whoami`; ?>``) and change the ownership of
these two directories to that user. The final command you run (in \*nix)
might look something like this::

    chown -R www-data tmp
    chown -R www-data logs

If for some reason CakePHP can't write to these directories, you'll be
informed by a warning while not in production mode.

While not recommended, if you are unable to set the permissions to the same as
your webserver, you can simply set write permissions on the folder by running a
command such as::

    chmod 777 -R tmp
    chmod 777 -R logs

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

<<<<<<< HEAD
    /* Then insert some articles for testing: */
    INSERT INTO articles (title,body,created)
        VALUES ('The title', 'This is the article body.', NOW());
    INSERT INTO articles (title,body,created)
        VALUES ('A title once again', 'And the article body follows.', NOW());
    INSERT INTO articles (title,body,created)
=======
    /* Then insert some posts for testing: */
    INSERT INTO posts (title, body, created)
        VALUES ('The title', 'This is the post body.', NOW());
    INSERT INTO posts (title, body, created)
        VALUES ('A title once again', 'And the post body follows.', NOW());
    INSERT INTO posts (title, body, created)
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
        VALUES ('Title strikes back', 'This is really exciting! Not.', NOW());

The choices on table and column names are not arbitrary. If you
follow CakePHP's database naming conventions, and CakePHP's class naming
conventions (both outlined in
:doc:`/intro/conventions`), you'll be able to take
advantage of a lot of free functionality and avoid configuration.
CakePHP is flexible enough to accommodate even inconsistent legacy
database schemas, but adhering to the conventions will save you time.

Check out :doc:`/intro/conventions` for more
information, but it's suffice to say that naming our table 'articles'
automatically hooks it to our Articles model, and having fields called
'modified' and 'created' will be automatically managed by CakePHP.

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
                'username' => 'cake_blog',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_blog',
                'encoding' => 'utf8',
                'timezone' => 'UTC'
            ],
        ],
        // More configuration below.
    ];

Once you've saved your **config/app.php** file, you should be able to open
your browser and see the CakePHP welcome page. It should also tell
you that your database connection file was found, and that CakePHP
can successfully connect to the database.

.. note::

    A copy of CakePHP's default configuration file is found in
    **config/app.default.php**.

Optional Configuration
======================

There are a few other items that can be configured. Most developers
complete these laundry-list items, but they're not required for
this tutorial. One is defining a custom string (or "salt") for use
in security hashes.

The security salt is used for generating hashes. If you used Composer this too is taken
care of for you during the install. Else you'd need to change the default salt value
by editing **config/app.php**. It doesn't matter much what the new value is, as long as
it's not guessable::

    'Security' => [
        'salt' => 'something long and containing lots of different values.',
    ],

A Note on mod\_rewrite
======================

Occasionally new users will run into mod\_rewrite issues. For example
if the CakePHP welcome page looks a little funny (no images or CSS styles).
This probably means mod\_rewrite is not functioning on your system. Please refer
to the :ref:`url-rewriting` section to help resolve any issues you are having.

Now continue to :doc:`/tutorials-and-examples/blog/part-two` to start building
your first CakePHP application.

.. meta::
    :title lang=en: Blog Tutorial
    :keywords lang=en: model view controller,object oriented programming,application logic,directory setup,basic knowledge,database server,server configuration,reins,documentroot,readme,repository,web server,productivity,lib,sql,aim,cakephp,servers,apache,downloads
