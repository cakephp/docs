---
title: "CMS Tutorial - Creating the Database"
description: "Create the database for CakePHP CMS tutorial. Configure connections, build schema with migrations or SQL, add seed data, and set up relationships."
---

# CMS Tutorial - Creating the Database

Now that we have CakePHP installed, let's set up the database for our `CMS
(Content Management System)` application. If you haven't already done so, create
an empty database for use in this tutorial, with the name of your choice such as
`cake_cms`.

## Database Configuration

First, let's tell CakePHP where our database is and how to connect to it. Replace
the values in the `Datasources.default` array in your **config/app_local.php** file
with those that apply to your setup. A sample completed configuration array
might look something like the following:

```php {2}
<?php
declare(strict_types=1);

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
```

Once you've saved your **config/app_local.php** file, you should see that the 'CakePHP is
able to connect to the database' section has a green chef hat.

::: info Local Configuration
The file **config/app_local.php** is a local override of the file **config/app.php**
used to configure your development environment quickly.
:::

## Creating Database Tables

Choose your preferred approach for creating the database schema:

::: tip Which Approach Should I Use?
**Migrations** (recommended) are version-controlled, database-agnostic, and perfect for team collaboration.
**Raw SQL** is fine for quick prototyping or if you prefer direct database control.
:::

### Option A: Using Migrations (Recommended)

Migrations provide a platform-independent way to manage your database schema, so you don't need to worry about the subtle differences between MySQL, PostgreSQL, SQLite, etc.

::: code-group

```bash [Commands]
# Generate migration files
bin/cake bake migration CreateUsers email:string password:string created modified
bin/cake bake migration CreateArticles user_id:integer title:string slug:string[191]:unique body:text published:boolean created modified
bin/cake bake migration CreateTags title:string[191]:unique created modified
bin/cake bake migration CreateArticlesTags article_id:integer:primary tag_id:integer:primary created modified

# Run migrations to create tables
bin/cake migrations migrate
```

```php [Migration Example]
<?php
declare(strict_types=1);

// Example: config/Migrations/YYYYMMDDHHMMSS_CreateArticles.php
use Migrations\BaseMigration;

class CreateArticles extends BaseMigration
{
    public function change(): void
    {
        $table = $this->table('articles');
        $table->addColumn('user_id', 'integer')
            ->addColumn('title', 'string', ['limit' => 255])
            ->addColumn('slug', 'string', ['limit' => 191])
            ->addColumn('body', 'text', ['null' => true])
            ->addColumn('published', 'boolean', ['default' => false])
            ->addColumn('created', 'datetime')
            ->addColumn('modified', 'datetime')
            ->addIndex(['slug'], ['unique' => true])
            ->addForeignKey('user_id', 'users', 'id')
            ->create();
    }
}
```

:::

::: warning Composite Primary Key Adjustment
The `articles_tags` migration will need manual adjustment. The generated migration sets both columns to auto-increment:

```php
$table->addColumn('article_id', 'integer', [
    'autoIncrement' => true, // [!code --]
    'default' => null,
    'limit' => 11,
    'null' => false,
]);
$table->addColumn('tag_id', 'integer', [
    'autoIncrement' => true, // [!code --]
    'default' => null,
    'limit' => 11,
    'null' => false,
]);
```

Remove the `autoIncrement` lines before running the migration to prevent foreign key problems.
:::

#### Adding Seed Data

Create seed files to populate initial data:

```bash
# Generate seed files
bin/cake bake seed Users
bin/cake bake seed Articles
```

Edit the generated seed files:

::: code-group

```php [UsersSeed.php]
<?php
declare(strict_types=1);

// config/Seeds/UsersSeed.php
use Migrations\BaseSeed;

class UsersSeed extends BaseSeed
{
    public function run(): void
    {
        $data = [
            [
                'email' => 'cakephp@example.com',
                'password' => 'secret',
                'created' => date('Y-m-d H:i:s'),
                'modified' => date('Y-m-d H:i:s'),
            ],
        ];

        $table = $this->table('users');
        $table->insert($data)->save();
    }
}
```

```php [ArticlesSeed.php]
<?php
declare(strict_types=1);

// config/Seeds/ArticlesSeed.php
use Migrations\BaseSeed;

class ArticlesSeed extends BaseSeed
{
    public function run(): void
    {
        $data = [
            [
                'user_id' => 1,
                'title' => 'First Post',
                'slug' => 'first-post',
                'body' => 'This is the first post.',
                'published' => true,
                'created' => date('Y-m-d H:i:s'),
                'modified' => date('Y-m-d H:i:s'),
            ],
        ];

        $table = $this->table('articles');
        $table->insert($data)->save();
    }
}
```

:::

::: warning Password Security
The seed data above stores passwords in **plain text** for initial setup purposes only. This is a **security risk** and should **never be used in production**. We will properly implement password hashing when we add [authentication](../../tutorials-and-examples/cms/authentication) later in this tutorial.
:::

Run the seeders:

```bash
bin/cake migrations seed
```

### Option B: Using Raw SQL

If you prefer to use direct SQL statements, you can execute these in your database client:

::: code-group

```sql [MySQL/MariaDB]
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
```

```sql [PostgreSQL]
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
```

:::

## Understanding the Schema

You may have noticed that the `articles_tags` table uses a composite primary
key. CakePHP supports composite primary keys almost everywhere, allowing you to
have simpler schemas that don't require additional `id` columns.

The table and column names we used were not arbitrary. By using CakePHP's
[naming conventions](../../intro/conventions), we can leverage CakePHP more
effectively and avoid needing to configure the framework. While CakePHP is
flexible enough to accommodate almost any database schema, adhering to the
conventions will save you time as you can leverage the convention-based defaults
CakePHP provides.

::: tip Learn More
Read more about database migrations and seeding in the [Migrations documentation](https://book.cakephp.org/migrations/4/).
:::

With the database built, we can now build our [Models](../../tutorials-and-examples/cms/articles-model).
