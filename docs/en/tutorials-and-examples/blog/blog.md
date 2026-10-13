# Blog Tutorial

Welcome to CakePHP. You're probably checking out this tutorial
because you want to learn more about how CakePHP works. It's our
aim to increase productivity and make coding more enjoyable: we
hope you'll see this as you dive into the code.

This tutorial will walk you through the creation of a simple blog
application. We'll be getting and installing CakePHP, creating and
configuring a database, and creating enough application logic to
list, add, edit, and delete blog posts.

Here's what you'll need:

1.  PHP 8.0 or greater and
    [Composer](https://getcomposer.org/).
2.  A web server. For this tutorial PHP's built-in web server, started
    through the CakePHP console, is enough. If you use Apache or another
    server instead, point its document root at the application's `webroot/`
    directory.
3.  A database server. We're going to be using MySQL server in this
    tutorial. You'll need to know enough about SQL in order to create a
    database: CakePHP will be taking the reins from there. Since we're using MySQL,
    also make sure that you have `pdo_mysql` enabled in PHP.
4.  Basic PHP knowledge. The more object-oriented programming you've
    done, the better: but fear not if you're a procedural fan.
5.  Finally, you'll need a basic knowledge of the MVC programming pattern.
    A quick overview can be found in
    [Understanding Model-View-Controller](/cakephp-overview/understanding-model-view-controller). Don't worry,
    it's only half a page or so.

Let's get started!

## Getting CakePHP

First, let's create a new application with Composer. The
[pieceofcake2/app](https://github.com/pieceofcake2/app) application skeleton
installs CakePHP for you:

``` bash
composer create-project pieceofcake2/app blog
cd blog
```

Once finished, your directory setup should look something like the following:

    /blog
        /bin
        /config
        /logs
        /plugins
        /resources
        /src
        /templates
        /tests
        /tmp
        /vendor
        /webroot
        composer.json

CakePHP itself is installed in `vendor/pieceofcake2/cakephp`. You'll write your
PHP classes in `src/`, your view templates in `templates/` and your
configuration in `config/`. Now might be a good time to learn a bit about how
CakePHP's directory structure works: check out the
[CakePHP Folder Structure](/getting-started/cakephp-folder-structure) section.

### Tmp directory permissions

Next we'll need to make the `tmp` and `logs` directories writable by the
webserver. When you use the built-in web server as in this tutorial, it runs
as your own user and there is nothing to do. For other web servers, find out
what user your webserver runs as and change the ownership of the
directories to that user. The final command you run (in \*nix) might look
something like this:

``` bash
$ chown -R www-data tmp logs
```

If for some reason CakePHP can't write to that directory, you'll see
warnings and uncaught exceptions that cache data cannot be written.

## Creating the Blog Database

Next, let's set up the underlying database for our blog. If you
haven't already done so, create an empty database for use in this
tutorial, with a name of your choice. Right now, we'll just create
a single table to store our posts. We'll also throw in a few posts
right now to use for testing purposes. Execute the following SQL
statements into your database:

``` text
/* First, create our posts table: */
CREATE TABLE posts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50),
    body TEXT,
    created DATETIME DEFAULT NULL,
    modified DATETIME DEFAULT NULL
);

/* Then insert some posts for testing: */
INSERT INTO posts (title, body, created)
    VALUES ('The title', 'This is the post body.', NOW());
INSERT INTO posts (title, body, created)
    VALUES ('A title once again', 'And the post body follows.', NOW());
INSERT INTO posts (title, body, created)
    VALUES ('Title strikes back', 'This is really exciting! Not.', NOW());
```

The choices on table and column names are not arbitrary. If you
follow CakePHP's database naming conventions, and CakePHP's class naming
conventions (both outlined in
[CakePHP Conventions](/getting-started/cakephp-conventions)), you'll be able to take
advantage of a lot of free functionality and avoid configuration.
CakePHP is flexible enough to accommodate even the worst legacy
database schema, but adhering to convention will save you time.

Check out [CakePHP Conventions](/getting-started/cakephp-conventions) for more
information, but suffice it to say that naming our table 'posts'
automatically hooks it to our Post model, and having fields called
'modified' and 'created' will be automagically managed by CakePHP.

## CakePHP Database Configuration

Onward and upward: let's tell CakePHP where our database is and how to
connect to it. For many, this is the first and last time you
configure anything.

A copy of CakePHP's database configuration file is found in
`config/database.php.default`. Make a copy of this file in
the same directory, but name it `database.php`:

``` bash
cp config/database.php.default config/database.php
```

The config file should be pretty straightforward: just replace the
values in the `$default` array with those that apply to your
setup. A sample completed configuration array might look something
like the following:

``` php
// config/database.php
public $default = [
    'datasource' => 'Database/Mysql',
    'persistent' => false,
    'host' => 'localhost',
    'login' => 'cakeBlog',
    'password' => 'c4k3-rUl3Z',
    'database' => 'cake_blog_tutorial',
    'prefix' => '',
    'encoding' => 'utf8mb4',
];
```

`utf8mb4` is MySQL's full UTF-8 character set and the default character set
of MySQL 8.0.

Once you've saved your new `database.php` file, start the development server
from the project root:

``` bash
bin/cake server -p 8765
```

Then open <http://localhost:8765/> in your browser and you should see the
CakePHP welcome page. It should also tell you that your database connection
file was found, and that CakePHP can successfully connect to the database.

> [!NOTE]
> Remember that you'll need to have PDO, and pdo_mysql enabled in
> your php.ini.

## Optional Configuration

There are a few other items that can be configured. One is defining a
custom string (or "salt") for use in security hashes. The second is defining a
custom number (or "seed") for use in encryption. The application skeleton
ships with well-known example values, and while debug mode is on CakePHP shows
a notice on every page until you change them.

The security salt is used for generating hashes. Change the default
`Security.salt` value in `config/core.php`. The replacement value
should be long, hard to guess and be as random as you can make it:

``` php
/**
 * A random string used in security hashing methods.
 */
Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');
```

The cipher seed is used for encrypt/decrypt strings. Change the default
`Security.cipherSeed` value by editing `config/core.php`. The
replacement value should be a large random integer:

``` php
/**
 * A random numeric string (digits only) used to encrypt/decrypt strings.
 */
Configure::write('Security.cipherSeed', '7485712659625147843639846751');
```

## Using Apache

The built-in web server is meant for development only. To run the application
with Apache, point the virtual host's `DocumentRoot` at the `webroot/`
directory and make sure `mod_rewrite` is enabled; `webroot/.htaccess`
contains the rewrite rules. If the CakePHP welcome page looks a little funny
(no images or CSS styles), it probably means mod_rewrite is not functioning on
your system. See [URL Rewriting](/installation/url-rewriting) for
details and for other web servers.

Now continue to [Blog Tutorial - Adding a layer](/tutorials-and-examples/blog/part-two) to start building your first CakePHP application.
