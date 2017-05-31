CMS Tutorial - Creating the Database
####################################

Now that we have CakePHP installed, let's set up the database for our :abbr:`CMS
(Content Management System)` application. If you haven't already done so, create
an empty database for use in this tutorial, with a name of your choice, e.g.
``cake_cms``. You can execute the following SQL to create the necessary
tables::

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
        slug VARCHAR(255) NOT NULL,
        body TEXT,
        published BOOLEAN DEFAULT FALSE,
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (slug),
        FOREIGN KEY user_key (user_id) REFERENCES users(id)
    ) CHARSET=utf8mb4;

    CREATE TABLE tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        created DATETIME,
        modified DATETIME,
        UNIQUE KEY (title)
    ) CHARSET=utf8mb4;

    CREATE TABLE articles_tags (
        article_id INT NOT NULL,
        tag_id INT NOT NULL,
        PRIMARY KEY (article_id, tag_id),
        FOREIGN KEY tag_key(tag_id) REFERENCES tags(id),
        FOREIGN KEY bookmark_key(article_id) REFERENCES articles(id)
    );

    INSERT INTO users (email, password, created, modified)
    VALUES
    ('cakephp@example.com', 'sekret', NOW(), NOW());

    INSERT INTO articles (user_id, title, slug, body, published, created, modified)
    VALUES
    (1, 'First Post', 'first-post', 'This is the first post.', 1, now(), now());

You may have noticed that the ``articles_tags`` table used a composite primary
key. CakePHP supports composite primary keys almost everywhere, making it easier
to build multi-tenanted applications.

The table and column names we used were not arbitrary. By using CakePHP's
:doc:`naming conventions </intro/conventions>`, we can leverage CakePHP more
effectively and avoid needing to configure the framework. While CakePHP is
flexible enough to accommodate almost any database schema, adhering to the
conventions will save you time as you can leverage the convention based defaults
CakePHP provides.

Database Configuration
======================

Next, let's tell CakePHP where our database is and how to connect to it. Replace
the values in the ``Datasources.default`` array in your **config/app.php** file
with those that apply to your setup. A sample completed configuration array
might look something like the following::

    <?php
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
                'database' => 'cake_cms',
                'encoding' => 'utf8mb4',
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

Creating our First Model
========================

Models are the heart of a CakePHP applications. They enable us to read and
modify our data. They allow us to build relations between our data, validate
data, and apply application rules. Models build the foundations necessary to
build our controller actions and templates.

CakePHP's models are composed of ``Table`` and ``Entity`` objects.  ``Table``
objects provide access to the collection of entities stored in a specific table.
They are stored in **src/Model/Table**. The file we'll be creating will be saved
to **src/Model/Table/ArticlesTable.php**. The completed file should look like
this::

    <?php
    // src/Model/Table/ArticlesTable.php
    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
        }
    }

We've attached the :doc:`/orm/behaviors/timestamp` behavior which will
automatically populate the ``created`` and ``modified`` columns of our table.
By naming our Table object ``ArticlesTable``, CakePHP can use naming conventions
to know that our model uses the ``articles`` table. CakePHP also uses
conventions to know that the ``id`` column is our table's primary key.

.. note::

    CakePHP will dynamically create a model object for you if it
    cannot find a corresponding file in **src/Model/Table**. This also means
    that if you accidentally name your file wrong (i.e. articlestable.php or
    ArticleTable.php), CakePHP will not recognize any of your settings and will
    use the generated model instead.

We'll also create an Entity class for our Articles. Entities represent a single
record in the database, and provide row level behavior for our data. Our entity
will be saved to **src/Model/Entity/Article.php**. The completed file should
look like this::

    <?php
    // src/Model/Entity/Article.php
    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected $_accessible = [
            '*' => true,
            'id' => false,
            'slug' => false,
        ];
    }

Our entity is quite slim right now, and we've only setup the ``_accessible``
property which controls how properties can be modified by
:ref:`entities-mass-assignment`.

We can't do much with our models right now, so next we'll create our first
:doc:`Controller and Template <articles-controller>` to allow us to interact
with our model.
