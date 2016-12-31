Installing CakePHP
####################

Introduction
============

So now you know everything there is to know about the structure and
purpose of all the CakePHP libraries, or you have skipped to this part
because you don't care about that stuff and just want to start playing.
Either way, you're ready to get your hands dirty.

This chapter will describe what must be installed on the server,
different ways to configure your server, downloading and installing
CakePHP, bringing up the default CakePHP page, and some troubleshooting
tips just in case everything does not go as planned.

Requirements
============

In order use CakePHP you must first have a server that has all the
required libraries and programs to run CakePHP:

Server Requirements
-------------------

Here are the requirements for setting up a server to run CakePHP:

#. An HTTP server (like Apache) with the following enabled: sessions,
   mod\_rewrite (not absolutely necessary but preferred)

#. PHP 4.3.2 or greater. Yes, CakePHP works great in either PHP 4 or 5.

#. A database engine (right now, there is support for MySQL 4+,
   PostgreSQL and a wrapper for ADODB).

Installing CakePHP
==================

Getting the most recent stable version
--------------------------------------

There are a few ways you can secure a copy of CakePHP: getting a stable
release from CakeForge, grabbing a nightly build, or getting a fresh
version of code from SVN.

To download a stable version of code, check out the files section of the
CakePHP project at CakeForge by going to
`http://cakeforge.org/projects/cakephp/ <http://cakeforge.org/projects/cakephp/>`_.

To grab a nightly, download one from
`https://cakephp.org/downloads/index/nightly <https://cakephp.org/downloads/index/nightly>`_.
These nightly releases are stable, and often include the bug fixes
between stable releases.

To grab a fresh copy from our SVN repository, use your favorite SVN
client and connect to
`https://svn.cakephp.org/repo/trunk/cake/ <https://svn.cakephp.org/repo/trunk/cake/>`_
and choose the version you're after.

Unpacking
---------

Now that you've downloaded the most recent release, place that
compressed package on your web server in the webroot. Now you need to
unpack the CakePHP package. There are two ways to do this, using a
development setup, which allows you to easily view many CakePHP
applications under a single domain, or using the production setup, which
allows for a single CakePHP application on the domain.

Setting Up CakePHP
------------------

The first way to setup CakePHP is generally only recommended for
development environments because it is less secure. The second way is
considered more secure and should be used in a production environment.

NOTE: **/app/tmp** must be writable by the user that your web server
runs as.

Development Setup
-----------------

For development we can place the whole Cake installation directory
inside the specified DocumentRoot like this::

        /wwwroot
        /cake
            /app
            /cake
            /vendors
            .htaccess
            index.php

In this setup the wwwroot folder acts as the web root so your URLs will
look something like this (if you're also using mod\_rewrite)::

    <a href="http://www.example.com/cake/controllerName/actionName/param1/param2" title="Linkification: http://www.example.com/cake/controllerName/actionName/param1/param2">www.example.com/cake/controllerName/actionName/param1/param2</a>

Production Setup
----------------

In order to utilize a production setup, you will need to have the rights
to change the DocumentRoot on your server. Doing so, makes the whole
domain act as a single CakePHP application.

The production setup uses the following layout::

    ../path_to_cake_install
        /app
            /config
            /controllers
            /models
            /plugins
            /tmp
            /vendors
            /views
            /webroot <-- This should be your new DocumentRoot
            .htaccess
            index.php
        /cake
        /vendors
        .htaccess
        index.php

Suggested Production httpd.conf
-------------------------------

::

    DocumentRoot /path_to_cake/app/webroot

In this setup the webroot directory is acting as the web root so your
URLs might look like this (if you're using mod\_rewrite):

::

    http://www.example.com/controllerName/actionName/param1/param2

Advanced Setup: Alternative Installation Options
------------------------------------------------

There are some cases where you may wish to place Cake's directories on
different places on disk. This may be due to a shared host restriction,
or maybe you just want a few of your apps to share the same Cake
libraries.

There are three main parts to a Cake application:

#. The core CakePHP libraries - Found in **/cake**

#. Your application code (e.g. controllers, models, layouts and views) -
   Found in **/app**

#. Your application webroot files (e.g. images, javascript and css) -
   Found in **/app/webroot**

Each of these directories can be located anywhere on your file system,
with the exception of the webroot, which needs to be accessible by your
web server. You can even move the **webroot** folder out of the **app**
folder as long as you tell Cake where you've put it.

To configure your Cake installation, you'll need to make some changes to
**/app/webroot/index.php** (as it is distributed in Cake). There are
three constants that you'll need to edit: ROOT, APP\_DIR, and
CAKE\_CORE\_INCLUDE\_PATH.

#. ROOT should be set to the path of the directory that contains your
   **app** folder.

#. APP\_DIR should be set to the path of your **app** folder.

#. CAKE\_CORE\_INCLUDE\_PATH should be set to the path of your Cake
   libraries folder.

/app/webroot/index.php (partial, comments removed)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

::

    if (!defined('ROOT'))
    {
        define('ROOT', dirname(dirname(dirname(__FILE__))));
    }

    if (!defined('APP_DIR'))
    {
        define ('APP_DIR', basename(dirname(dirname(__FILE__))));
    }

    if (!defined('CAKE_CORE_INCLUDE_PATH'))
    {
        define('CAKE_CORE_INCLUDE_PATH', ROOT);
    }

An example might help illustrate this better. Imagine that I wanted to
set up Cake to work with the following setup:

#. I want my Cake libraries shared with other applications, and placed
   in **/usr/lib/cake**.

#. My Cake webroot directory needs to be **/var/www/mysite/**.

#. My application files will be stored in **/home/me/mysite**.

::

    Here's what the file setup looks like:

    /home
        /me
            /mysite                  <-- Used to be /cake_install/app
                /config
                /controllers
                /models
                /plugins
                /tmp
                /vendors
                /views
                index.php
    /var
        /www
            /mysite                  <-- Used to be /cake_install/app/webroot
                /css
                /files
                /img
                /js
                .htaccess
                css.php
                favicon.ico
                index.php
    /usr
        /lib
            /cake                    <-- Used to be /cake_install/cake
                /cake
                    /config
                    /docs
                    /libs
                    /scripts
                    app_controller.php
                    app_model.php
                    basics.php
                    bootstrap.php
                    dispatcher.php
                /vendors 

Given this type of setup, I would need to edit my webroot index.php file
(which should be at /var/www/mysite/index.php, in this example) to look
like the following:

It is recommended to use the 'DS' constant rather than slashes to
delimit file paths. This prevents any 'missing file' errors you might
get as a result of using the wrong delimiter, and it makes your code
more portable::

    <?php
    if (!defined('ROOT'))
    {
        define('ROOT', DS.'home'.DS.'me');
    }

    if (!defined('APP_DIR'))
    {
        define ('APP_DIR', 'mysite');
    }

    if (!defined('CAKE_CORE_INCLUDE_PATH'))
    {
        define('CAKE_CORE_INCLUDE_PATH', DS.'usr'.DS.'lib'.DS.'cake');
    }

Configuring Apache and mod\_rewrite
-----------------------------------

While CakePHP is built to work with mod\_rewrite out of the box, we've
noticed that a few users struggle with getting everything to play nicely
on their systems. Here are a few things you might try to get it running
correctly:

#. Make sure that an .htaccess override is allowed: in your httpd.conf,
   you should have a section that defines a section for each Directory
   on your server. Make sure the **AllowOverride** is set to **All** for
   the correct Directory.

#. Make sure you are editing the system httpd.conf rather than a user-
   or site-specific httpd.conf.

#. For some reason or another, you might have obtained a copy of CakePHP
   without the needed .htaccess files. This sometimes happens because
   some operating systems treat files that start with '.' as hidden, and
   don't copy them. Make sure your copy of CakePHP is from the downloads
   section of the site or our SVN repository.

#. Make sure you are loading up mod\_rewrite correctly! You should see
   something like **LoadModule rewrite\_module
   libexec/httpd/mod\_rewrite.so** and **AddModule mod\_rewrite.c** in
   your httpd.conf.

#. If you are installing Cake into a user directory
   (`http://example.com/~myusername/ <http://example.com/%7Emyusername/>`_),
   you'll need to modify the .htaccess files in the base directory of
   your Cake installation, and in the app/webroot folder. Just add the
   line "RewriteBase /~myusername/".

#. If for some reason your URLS are suffixed with a long, annoying
   session ID
   (`http://example.com/posts/?CAKEPHP=4kgj577sgabvnmhjgkdiuy1956if6ska <http://example.com/posts/?CAKEPHP=4kgj577sgabvnmhjgkdiuy1956if6ska>`_),
   you might also add "php\_flag session.trans\_id off" to the .htaccess
   file at the root of your installation as well.

Make Sure It's Working
----------------------

Alright, lets see this baby in action. Depending on which setup you
used, you should point your browser to
`http://www.example.com <http://www.example.com>`_ or
`http://www.example.com/cake <http://www.example.com/cake>`_. At this
point, you'll be presented with CakePHP's default home, and a message
that tells you the status of your current database connection.

Congratulations! You are ready to create your first Cake-based
application.
