---
title: CakePHP 5 Documentation - Build Better Web Applications Faster
description: Official CakePHP 5 documentation. Learn how to build modern PHP web applications with convention over configuration, powerful ORM, built-in security, and rapid development tools.
outline: 2
---
# Build Better Web Applications, Faster

**CakePHP 5** is a modern PHP framework running on PHP |phpversion| (min. PHP |minphpversion|) that helps you write clean, maintainable code without the complexity. Whether you're building a simple blog or a complex enterprise application, CakePHP gives you the tools to get it done right.

::: tip Perfect for
✅ Developers who value **convention over configuration**<br>
✅ Teams building **secure, scalable applications**<br>
✅ Projects that need to **ship quickly** without sacrificing quality<br>
✅ Applications requiring **modern PHP standards** (PSR-7, PSR-15, PSR-17)
:::

## Why CakePHP?

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 2rem 0;">

🚀 **Rapid Development**<br>
Scaffold applications in minutes with powerful code generation tools.

🔒 **Security First**<br>
Built-in protection against SQL injection, XSS, CSRF, and more.

📦 **Batteries Included**<br>
ORM, validation, caching, authentication — everything you need out of the box.

🎯 **Convention over Configuration**<br>
Sensible defaults mean less setup, more coding.

</div>


## Quick Start

Get a CakePHP application running in under 5 minutes:

::: code-group

```bash [Composer]
# Create new project
composer create-project --prefer-dist cakephp/app:~5.0 my_app

# Start development server
cd my_app
bin/cake server

# Open http://localhost:8765
```

```bash [DDEV]
# Setup with DDEV
mkdir my-cakephp-app && cd my-cakephp-app
ddev config --project-type=cakephp --docroot=webroot
ddev composer create --prefer-dist cakephp/app:~5.0
ddev launch
```

```bash [Docker]
# Using official PHP image
docker run -it --rm -v $(pwd):/app composer create-project \
  --prefer-dist cakephp/app:~5.0 my_app

cd my_app
docker run -it --rm -p 8765:8765 -v $(pwd):/app \
  -w /app php:8.2-cli php bin/cake server -H 0.0.0.0
```

:::

> [!TIP]
> You should see a welcome page with green checkmarks at **http://localhost:8765**

::: details System Requirements
Make sure your system meets these requirements before getting started:

| Component | Version |
|-----------|------|
| PHP | 8.2 - 8.5 |
| Database | MySQL 5.7+, PostgreSQL 9.6+, SQLite 3, SQL Server 2012+ |
| Extensions | `mbstring`, `intl`, `pdo`, `simplexml` |
| Composer | Latest |
:::

## Your First Application

Let's build a simple blog in 10 minutes! Follow along with this hands-on tutorial.

> [!NOTE]
> This tutorial assumes you already have a database created. Use your database management tool to create a database named `blog` before proceeding.

### Step 1: Configure Database Connection

Update your database credentials in **config/app_local.php**:

```php{7-11} [config/app_local.php]
<?php
declare(strict_types=1);

return [
    'Datasources' => [
        'default' => [
            'host' => 'localhost',
            'username' => 'my_user',
            'password' => 'secret',
            'database' => 'blog',
            'encoding' => 'utf8mb4',
        ],
    ],
];
```

::: tip Configuration Files
- **config/app.php** - Default configuration (committed to git)
- **config/app_local.php** - Local overrides (gitignored)
:::

### Step 2: Create Database Tables

Choose your preferred approach for creating the database schema:

> [!NOTE]
> **Migrations** are recommended for team projects and production - they're version-controlled and database-agnostic.
> **Raw SQL** is fine for quick prototyping or if you prefer direct database control.

#### Option A: Using Migrations

::: code-group

```bash [Commands]
# Step 1: Generate a migration file
bin/cake bake migration CreateArticles
# This creates: config/Migrations/YYYYMMDDHHMMSS_CreateArticles.php

# Step 2: Edit the generated file to define your table structure
# See the "Migration File" tab for the complete example
# Open: config/Migrations/YYYYMMDDHHMMSS_CreateArticles.php

# Step 3: Run the migration to create the table
bin/cake migrations migrate

# Step 4: (Optional) Generate and run seed data
bin/cake bake seed Articles
bin/cake migrations seed
```

```php [Migration File]
<?php
declare(strict_types=1);

// config/Migrations/20240124000000_CreateArticles.php
use Migrations\BaseMigration;

class CreateArticles extends BaseMigration
{
    public function change(): void
    {
        $table = $this->table('articles');
        $table->addColumn('title', 'string', ['limit' => 255])
            ->addColumn('slug', 'string', ['limit' => 191])
            ->addColumn('body', 'text', ['null' => true])
            ->addColumn('published', 'boolean', ['default' => false])
            ->addColumn('created', 'datetime')
            ->addColumn('modified', 'datetime')
            ->addIndex(['slug'], ['unique' => true])
            ->create();
    }
}
```

```php [Seed File]
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
                'title' => 'First Post',
                'slug' => 'first-post',
                'body' => 'This is my first blog post!',
                'published' => true,
                'created' => date('Y-m-d H:i:s'),
                'modified' => date('Y-m-d H:i:s'),
            ],
            [
                'title' => 'Second Post',
                'slug' => 'second-post',
                'body' => 'Another great article.',
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

#### Option B: Using Raw SQL

::: code-group

```sql [MySQL]
USE blog;

CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(191) UNIQUE,
    body TEXT,
    published BOOLEAN DEFAULT FALSE,
    created DATETIME,
    modified DATETIME
) ENGINE=InnoDB;

INSERT INTO articles (title, slug, body, published, created, modified)
VALUES ('First Post', 'first-post', 'This is my first blog post!', TRUE, NOW(), NOW());
```

```sql [PostgreSQL]
\c blog

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(191) UNIQUE,
    body TEXT,
    published BOOLEAN DEFAULT FALSE,
    created TIMESTAMP,
    modified TIMESTAMP
);

INSERT INTO articles (title, slug, body, published, created, modified)
VALUES ('First Post', 'first-post', 'This is my first blog post!', TRUE, NOW(), NOW());
```

```sql [SQLite]
CREATE TABLE articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(191) UNIQUE,
    body TEXT,
    published BOOLEAN DEFAULT 0,
    created DATETIME,
    modified DATETIME
);

INSERT INTO articles (title, slug, body, published, created, modified)
VALUES ('First Post', 'first-post', 'This is my first blog post!', 1, datetime('now'), datetime('now'));
```

:::

### Step 3: Generate Your First Model

Use CakePHP's code generation tool:

```bash
# Generate model classes
bin/cake bake model Articles

# Output:
# ✓ Created: src/Model/Table/ArticlesTable.php
# ✓ Created: src/Model/Entity/Article.php
# ✓ Created: tests/TestCase/Model/Table/ArticlesTableTest.php
```

This creates:

::: code-group

```php [ArticlesTable.php]
<?php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->setTable('articles');
        $this->setDisplayField('title');
        $this->setPrimaryKey('id');

        $this->addBehavior('Timestamp');
    }
}
```

```php [Article.php]
<?php
declare(strict_types=1);

namespace App\Model\Entity;

use Cake\ORM\Entity;

class Article extends Entity
{
    protected array $_accessible = [
        'title' => true,
        'slug' => true,
        'body' => true,
        'published' => true,
        'created' => true,
        'modified' => true,
    ];
}
```

:::

### Step 4: Create Your Controller

Generate a controller with views:

```bash
bin/cake bake controller Articles
```

```php [src/Controller/ArticlesController.php]
<?php
declare(strict_types=1);

namespace App\Controller;

class ArticlesController extends AppController
{
    public function index(): void
    {
        $articles = $this->Articles->find('all')
            ->where(['published' => true])
            ->orderBy(['created' => 'DESC']);

        $this->set(compact('articles'));
    }

    public function view(?string $slug = null): void
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->firstOrFail();

        $this->set(compact('article'));
    }

    public function add(): void
    {
        $article = $this->Articles->newEmptyEntity();

        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity(
                $article,
                $this->request->getData()
            );

            if ($this->Articles->save($article)) {
                $this->Flash->success('Article saved!');
                return $this->redirect(['action' => 'index']);
            }

            $this->Flash->error('Unable to save article.');
        }

        $this->set(compact('article'));
    }
}
```

### Step 5: Create Your Views

Create a simple list view in **templates/Articles/index.php**:

```php [templates/Articles/index.php]
<h1>Blog Articles</h1>

<?php foreach ($articles as $article): ?>
    <article>
        <h2>
            <?= $this->Html->link(
                h($article->title),
                ['action' => 'view', $article->slug]
            ) ?>
        </h2>
        <p>
            <small>Published: <?= $article->created->format('F d, Y') ?></small>
        </p>
        <p><?= h($article->body) ?></p>
    </article>
<?php endforeach; ?>

<?= $this->Html->link('New Article', ['action' => 'add'], ['class' => 'button']) ?>
```

> [!TIP]
> Visit **http://localhost:8765/articles** to see your blog in action!

## Next Steps

Now that you've built your first CakePHP application, here are some great places to continue your journey:

**Learn the Fundamentals:**
- [CakePHP Conventions](intro/conventions) - Understanding the naming conventions that power CakePHP
- [MVC Pattern](intro) - How CakePHP structures applications
- [Configuration](development/configuration) - Customizing your application

**Build Real Applications:**
- [Tutorials & Examples](tutorials-and-examples) - Step-by-step guides
- [CMS Tutorial](tutorials-and-examples/cms/installation) - Build a complete content management system

**Master Core Features:**
- [Database & ORM](orm) - Advanced queries, associations, and data modeling
- [Controllers](controllers) - Request handling, components, and middleware
- [Views](views) - Templates, helpers, and rendering
- [Security](security) - Best practices for secure applications

## Get Help

Join our community and get the support you need:

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
  <a href="https://discord.com/invite/k4trEMPebj" target="_blank" style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: #5865F2; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0a12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055a20.03 20.03 0 0 0 5.993 2.98a.078.078 0 0 0 .084-.026a13.83 13.83 0 0 0 1.226-1.963a.074.074 0 0 0-.041-.104a13.201 13.201 0 0 1-1.872-.878a.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028a19.963 19.963 0 0 0 6.002-2.981a.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38c0-1.312.956-2.38 2.157-2.38c1.21 0 2.176 1.077 2.157 2.38c0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38c0-1.312.955-2.38 2.157-2.38c1.21 0 2.176 1.077 2.157 2.38c0 1.312-.946 2.38-2.157 2.38z"/></svg>
    Join Discord
  </a>
  <a href="https://cakephp.slack.com/" target="_blank" style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: #4A154B; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 15a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2h2v2zm1 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-5zm2-8a2 2 0 0 1-2-2a2 2 0 0 1 2-2a2 2 0 0 1 2 2v2H9zm0 1a2 2 0 0 1 2 2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5zm8 2a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2v-2zm-1 0a2 2 0 0 1-2 2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2a2 2 0 0 1 2 2v5zm-2 8a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2v-2h2zm0-1a2 2 0 0 1-2-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-5z"/></svg>
    Join Slack
  </a>
  <a href="https://discourse.cakephp.org/" target="_blank" style="display: flex; align-items: center; gap: 0.75rem; padding: 1rem; background: #00AEEF; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.103 0C18.666 0 24 5.485 24 11.997c0 6.51-5.33 11.99-11.9 11.99L0 24V11.79C0 5.28 5.532 0 12.103 0zm.116 4.563c-2.593-.003-4.996 1.352-6.337 3.57-1.33 2.208-1.387 4.957-.148 7.22L4.4 19.61l4.794-1.074c2.745 1.225 5.965.676 8.136-1.39 2.17-2.054 2.86-5.228 1.737-7.997-1.135-2.778-3.84-4.59-6.84-4.585h-.008z"/></svg>
    Discourse Forum
  </a>
</div>

**Additional Resources:**
- [API Documentation](https://api.cakephp.org/5.0/) - Complete API reference
- [Stack Overflow](https://stackoverflow.com/questions/tagged/cakephp) - Find answers to common questions

## How CakePHP Works

Understanding the request flow helps you build better applications. Here's what happens when a user visits your CakePHP application:

<div style="margin: 2rem 0;">
<img src="/typical-cake-request.png" alt="CakePHP request flow diagram" style="display: block; margin: 0 auto;" />
</div>

**A typical request follows these steps:**

1. 🌐 **Request arrives** → Webserver routes to `webroot/index.php`
2. ⚙️ **Application boots** → Your app is loaded and middleware initializes
3. 🛣️ **Routing** → Request is matched to a controller and action
4. 🎮 **Controller** → Action is called, interacts with Models
5. 📊 **Model Layer** → Fetches and processes data from the database
6. 🎨 **View Layer** → Renders the response (HTML, JSON, XML, etc.)
7. 📤 **Response sent** → Back through middleware to the client

::: tip Understanding MVC
The **Model** handles your data and business logic, the **Controller** coordinates the request, and the **View** presents the data. This separation keeps your code organized and testable.

[Learn more about MVC in CakePHP →](intro)
:::

## Everything You Need, Out of the Box

CakePHP comes with powerful features that save you time and help you build better applications:

::: details 🚀 Code Generation (Bake)
Generate complete CRUD applications in seconds:
```bash
bin/cake bake all Articles
# Creates: Model, Controller, Views, Tests
```
Bake can scaffold entire features, saving hours of repetitive coding. Perfect for prototyping or generating boilerplate.

[Learn more about Bake →](https://book.cakephp.org/bake/2/en/)
:::

::: details 💾 Caching Framework
Integrated caching with multiple backends:
```php
// Cache expensive operations
$results = Cache::remember('expensive_query', function () {
    return $this->Articles->find('complex')->toArray();
});
```
**Supported backends:** Redis, Memcached, APCu, File, Database

[Learn more about Caching →](core-libraries/caching)
:::

::: details 🧪 Built-in Testing
Write tests with confidence using the integrated testing framework:
```php
public function testAddArticle(): void
{
    $this->post('/articles/add', ['title' => 'Test']);
    $this->assertResponseOk();
    $this->assertFlashMessage('Article saved!');
}
```
Supports unit tests, integration tests, and browser tests out of the box.

[Learn more about Testing →](development/testing)
:::

::: details 🔐 Authentication & Authorization
Drop-in user management with flexible policies:
```bash
composer require cakephp/authentication cakephp/authorization
```
Handle login, permissions, and access control with minimal configuration.

[Authentication Guide →](https://book.cakephp.org/authentication/) • [Authorization Guide →](https://book.cakephp.org/authorization/)
:::

::: details 🌐 REST API Support
Build APIs with automatic content type negotiation:
```php
// Automatically serves JSON/XML based on Accept header
public function index()
{
    $articles = $this->Articles->find('all');
    $this->set('articles', $articles);
    $this->viewBuilder()->setOption('serialize', ['articles']);
}
```
Supports JSON, XML, and custom formats with minimal code.

[Learn more about REST →](development/rest)
:::

::: details 📦 Database Migrations
Version control your database schema:
```bash
bin/cake bake migration CreateArticles
bin/cake migrations migrate
```
Keep your database changes in sync across development, staging, and production.

[Learn more about Migrations →](https://book.cakephp.org/migrations/)
:::

## What Makes CakePHP Special?

::: code-group

```php [Convention Over Configuration]
<?php
declare(strict_types=1);

// No configuration needed! CakePHP automatically knows:
// - ArticlesController uses ArticlesTable
// - ArticlesTable uses 'articles' database table
// - Primary key is 'id'
// - Foreign keys end in '_id'
// - Templates are in templates/Articles/

class ArticlesController extends AppController
{
    // That's it! Table is auto-loaded
    public function index(): void
    {
        $articles = $this->Articles->find('all');
        $this->set(compact('articles'));
    }
}
```

```php [Powerful ORM]
<?php
declare(strict_types=1);

// Elegant query building with relationships
$popularArticles = $this->Articles->find()
    ->contain(['Users', 'Comments'])
    ->matching('Tags', function ($q) {
        return $q->where(['Tags.name IN' => ['PHP', 'CakePHP']]);
    })
    ->where(['Articles.published' => true])
    ->orderBy(['Articles.view_count' => 'DESC'])
    ->limit(10);
```

```php [Built-in Security]
<?php
declare(strict_types=1);

// Automatic protection against common vulnerabilities:
// ✓ SQL Injection (parameterized queries)
// ✓ CSRF attacks (token validation)
// ✓ XSS (auto-escaping in templates)
// ✓ Mass assignment (protected fields)

$article = $this->Articles->newEntity($data);
// Only $_accessible fields can be set
```

```bash [Code Generation]
# Generate complete CRUD in seconds
bin/cake bake all Articles

# Creates:
# ✓ Model (Table + Entity)
# ✓ Controller (with all actions)
# ✓ Templates (index, view, add, edit)
# ✓ Tests (full coverage)
```

:::


<div style="text-align: center; margin: 1rem 0 2rem 0; padding: 2rem; background: linear-gradient(135deg, #D33C44 0%, #FF6B6B 100%); border-radius: 8px; color: white;">

<div style="margin-bottom: 2rem">
    <img src="https://cakephp.org/img/share_cake_bg_chiffon.svg" alt="Ready to Build Something Amazing" style="display: block; margin: 0 auto; width: 100%; max-width: 300px"/>
</div>

<p style="font-size: 1.5rem; font-weight: 600; margin: .5rem 0 2rem 0;">Ready to Build Something Amazing?</p>

**Start your CakePHP journey today and join thousands of developers building modern web applications.**

<p style="margin-top: 1.5rem;">
  <a href="quickstart" style="color: white; text-decoration: none; font-weight: 500; border-bottom: 1px solid rgba(255,255,255,0.5); padding-bottom: 2px;">Get Started →</a>
  <span style="margin: 0 0.5rem;">•</span>
  <a href="https://discourse.cakephp.org/" style="color: white; text-decoration: none; font-weight: 500; border-bottom: 1px solid rgba(255,255,255,0.5); padding-bottom: 2px;">Join Community</a>
  <span style="margin: 0 0.5rem;">•</span>
  <a href="tutorials-and-examples" style="color: white; text-decoration: none; font-weight: 500; border-bottom: 1px solid rgba(255,255,255,0.5); padding-bottom: 2px;">View Examples</a>
</p>

</div>
