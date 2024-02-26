CMS Tutorial - Creating the Database
####################################

Now that we have CakePHP installed, let's set up the database for our :abbr:`CMS
(Content Management System)` application. If you haven't already done so, create
an empty database for use in this tutorial, with the name of your choice such as
``cake_cms``.
If you are using MySQL/MariaDB, you can execute the following SQL to create the
necessary tables:

.. code-block:: SQL

    CREATE DATABASE cake_cms;

    USE cake_cms;

    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created DATETIME,
        modified DATETIME
    );

    CREATE TABLE articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(191) NOT NULL,
        body TEXT,
        published BOOLEAN DEFAULT FALSE,
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (slug),
        FOREIGN KEY user_key (user_id) REFERENCES users(id)
    ) CHARSET=utf8mb4;

    CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(191),
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (title)
    ) CHARSET=utf8mb4;

    CREATE TABLE articles_tags (
        article_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
        FOREIGN KEY article_key(article_id) REFERENCES articles(id)
    );

    INSERT INTO users (email, password, created, modified)
    VALUES
    ('cakephp@example.com', 'secret', NOW(), NOW());

    INSERT INTO articles (user_id, title, slug, body, published, created, modified)
    VALUES
    (1, 'First Post', 'first-post', 'This is the first post.', 1, NOW(), NOW());

If you are using PostgreSQL, connect to the ``cake_cms`` database and execute the
following SQL instead:

.. code-block:: SQL

    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created TIMESTAMP,
        modified TIMESTAMP
    );

    CREATE TABLE articles (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(191) NOT NULL,
        body TEXT,
        published BOOLEAN DEFAULT FALSE,
        created TIMESTAMP,
        modified TIMESTAMP,
        UNIQUE (slug),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE tags (
        id SERIAL PRIMARY KEY,
        title VARCHAR(191),
        created TIMESTAMP,
        modified TIMESTAMP,
        UNIQUE (title)
    );

    CREATE TABLE articles_tags (
        article_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY (tag_id) REFERENCES tags(id),
        FOREIGN KEY (article_id) REFERENCES articles(id)
    );

    INSERT INTO users (email, password, created, modified)
    VALUES
    ('cakephp@example.com', 'secret', NOW(), NOW());

    INSERT INTO articles (user_id, title, slug, body, published, created, modified)
    VALUES
    (1, 'First Post', 'first-post', 'This is the first post.', TRUE, NOW(), NOW());


You may have noticed that the ``articles_tags`` table uses a composite primary
key. CakePHP supports composite primary keys almost everywhere, allowing you to
have simpler schemas that don't require additional ``id`` columns.

The table and column names we used were not arbitrary. By using CakePHP's
:doc:`naming conventions </intro/conventions>`, we can leverage CakePHP more
effectively and avoid needing to configure the framework. While CakePHP is
flexible enough to accommodate almost any database schema, adhering to the
conventions will save you time as you can leverage the convention-based defaults
CakePHP provides.

Database Configuration
======================

Next, let's tell CakePHP where our database is and how to connect to it. Replace
the values in the ``Datasources.default`` array in your **config/app_local.php** file
with those that apply to your setup. A sample completed configuration array
might look something like the following::

    <?php
    // config/app_local.php
    return [
        // More configuration above.
        'Datasources' => [
            'default' => [
                'host' => 'localhost',
                'username' => 'cakephp',
                'password' => 'AngelF00dC4k3~',
                'database' => 'cake_cms',
                'url' => env('DATABASE_URL', null),
            ],
        ],
        // More configuration below.
    ];

Once you've saved your **config/app_local.php** file, you should see that the 'CakePHP is
able to connect to the database' section has a green chef hat.

.. note::

    The file **config/app_local.php** is a local override of the file **config/app.php**
    used to configure your development environment quickly.

Migrations
==========

The SQL statements to create the tables for this tutorial can also be generated
using the Migrations Plugin. Migrations provide a platform-independent way to
run queries so the subtle differences between MySQL, PostgreSQL, SQLite, etc.
don't become obstacles.

.. code-block:: console

    bin/cake bake migration CreateUsers email:string password:string created modified
    bin/cake bake migration CreateArticles user_id:integer title:string slug:string[191]:unique body:text published:boolean created modified
    bin/cake bake migration CreateTags title:string[191]:unique created modified
    bin/cake bake migration CreateArticlesTags article_id:integer:primary tag_id:integer:primary created modified

.. note::
    You may need to edit the above bake commands using mac zsh shell the brackets in::

        slug:string[191] 
    possibly need to be escaped. Edit to::

        slug:string\[191\]

    Some adjustments to the generated code might be necessary. For example, the
    composite primary key on ``articles_tags`` will be set to auto-increment
    both columns::

        $table->addColumn('article_id', 'integer', [
            'autoIncrement' => true,
            'default' => null,
            'limit' => 11,
            'null' => false,
        ]);
        $table->addColumn('tag_id', 'integer', [
            'autoIncrement' => true,
            'default' => null,
            'limit' => 11,
            'null' => false,
        ]);

    Remove those lines to prevent foreign key problems. Once adjustments are
    done::

        bin/cake migrations migrate

Likewise, the starter data records can be done with seeds.

.. code-block:: console

    bin/cake bake seed Users
    bin/cake bake seed Articles

Fill the seed data above into the new ``UsersSeed`` and ``ArticlesSeed``
classes, then::

    bin/cake migrations seed

Read more about building migrations and data seeding: `Migrations
<https://book.cakephp.org/migrations/4/>`__

With the database built, we can now build :doc:`Models
</tutorials-and-examples/cms/articles-model>`.
