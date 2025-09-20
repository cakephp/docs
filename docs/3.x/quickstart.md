# Quick Start Guide

The best way to experience and learn CakePHP is to sit down and build something.
To start off we'll build a simple Content Management application.

## Content Management Tutorial

This tutorial will walk you through the creation of a simple `CMS (Content
Management System)` application. To start with, we'll be installing CakePHP,
creating our database, and building simple article management.

Here's what you'll need:

1.  A database server. We're going to be using MySQL server in this tutorial.
    You'll need to know enough about SQL in order to create a database, and run
    SQL snippets from the tutorial. CakePHP will handle building all the queries
    your application needs. Since we're using MySQL, also make sure that you have
    `pdo_mysql` enabled in PHP.
2.  Basic PHP knowledge.

Before starting you should make sure that you have got an up to date PHP
version:

``` bash
php -v
```

You should at least have got installed PHP (CLI) or higher.
Your webserver's PHP version must also be of or higher, and
should be the same version your command line interface (CLI) PHP is.

### Getting CakePHP

The easiest way to install CakePHP is to use Composer. Composer is a simple way
of installing CakePHP from your terminal or command line prompt. First, you'll
need to download and install Composer if you haven't done so already. If you
have cURL installed, it's as easy as running the following:

``` bash
curl -s https://getcomposer.org/installer | php
```

Or, you can download `composer.phar` from the
[Composer website](https://getcomposer.org/download/).

Then simply type the following line in your terminal from your
installation directory to install the CakePHP application skeleton
in the **cms** directory of the current working directory:

``` bash
php composer.phar create-project --prefer-dist cakephp/app:"^3.10" cms
```

If you downloaded and ran the [Composer Windows Installer](https://getcomposer.org/Composer-Setup.exe), then type the following line in
your terminal from your installation directory (ie.
C:\wamp\www\dev\cakephp3):

``` bash
composer self-update && composer create-project --prefer-dist cakephp/app:"^3.10" cms
```

The advantage to using Composer is that it will automatically complete some
important set up tasks, such as setting the correct file permissions and
creating your **config/app.php** file for you.

There are other ways to install CakePHP. If you cannot or don't want to use
Composer, check out the [Installation](installation) section.

Regardless of how you downloaded and installed CakePHP, once your set up is
completed, your directory setup should look something like the following:

    /cms
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

Now might be a good time to learn a bit about how CakePHP's directory structure
works: check out the [CakePHP Folder Structure](intro/cakephp-folder-structure) section.

If you get lost during this tutorial, you can see the finished result [on GitHub](https://github.com/cakephp/cms-tutorial).

### Checking our Installation

We can quickly check that our installation is correct, by checking the default
home page. Before you can do that, you'll need to start the development server:

``` bash
cd /path/to/our/app

bin/cake server
```

> [!NOTE]
> For Windows, the command needs to be `bin\cake server` (note the backslash).

This will start PHP's built-in webserver on port 8765. Open up
**http://localhost:8765** in your web browser to see the welcome page. All the
bullet points should be green chef hats other than CakePHP being able to connect to
your database. If not, you may need to install additional PHP extensions, or set
directory permissions.

Next, we will build our [Database and create our first model](tutorials-and-examples/cms/database).

## CMS Tutorial - Creating the Database

Now that we have CakePHP installed, let's set up the database for our `CMS
(Content Management System)` application. If you haven't already done so, create
an empty database for use in this tutorial, with a name of your choice, e.g.
`cake_cms`. You can execute the following SQL to create the necessary
tables:

``` text
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
(1, 'First Post', 'first-post', 'This is the first post.', 1, now(), now());
```

You may have noticed that the `articles_tags` table used a composite primary
key. CakePHP supports composite primary keys almost everywhere allowing you to
have simpler schemas that don't require additional `id` columns.

The table and column names we used were not arbitrary. By using CakePHP's
[naming conventions](intro/conventions), we can leverage CakePHP more
effectively and avoid needing to configure the framework. While CakePHP is
flexible enough to accommodate almost any database schema, adhering to the
conventions will save you time as you can leverage the convention based defaults
CakePHP provides.

### Database Configuration

Next, let's tell CakePHP where our database is and how to connect to it. Replace
the values in the `Datasources.default` array in your **config/app_local.php** file
with those that apply to your setup. A sample completed configuration array
might look something like the following:

``` php
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
```

Once you've saved your **config/app_local.php** file, you should see that 'CakePHP is
able to connect to the database' section have a green chef hat.

> [!NOTE]
> A copy of CakePHP's default configuration file is found in
> **config/app.default.php**.

### Creating our First Model

Models are the heart of a CakePHP applications. They enable us to read and
modify our data. They allow us to build relations between our data, validate
data, and apply application rules. Models build the foundations necessary to
build our controller actions and templates.

CakePHP's models are composed of `Table` and `Entity` objects. `Table`
objects provide access to the collection of entities stored in a specific table.
They are stored in **src/Model/Table**. The file we'll be creating will be saved
to **src/Model/Table/ArticlesTable.php**. The completed file should look like
this:

``` php
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
```

We've attached the [Timestamp](orm/behaviors/timestamp) behavior which will
automatically populate the `created` and `modified` columns of our table.
By naming our Table object `ArticlesTable`, CakePHP can use naming conventions
to know that our model uses the `articles` table. CakePHP also uses
conventions to know that the `id` column is our table's primary key.

> [!NOTE]
> CakePHP will dynamically create a model object for you if it
> cannot find a corresponding file in **src/Model/Table**. This also means
> that if you accidentally name your file wrong (i.e. articlestable.php or
> ArticleTable.php), CakePHP will not recognize any of your settings and will
> use the generated model instead.

We'll also create an Entity class for our Articles. Entities represent a single
record in the database, and provide row level behavior for our data. Our entity
will be saved to **src/Model/Entity/Article.php**. The completed file should
look like this:

``` php
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
```

Our entity is quite slim right now, and we've only setup the `_accessible`
property which controls how properties can be modified by
[Entities Mass Assignment](orm/entities#entities-mass-assignment).

We can't do much with our models right now, so next we'll create our first
[Controller and Template](tutorials-and-examples/cms/articles-controller) to allow us to interact
with our model.

## CMS Tutorial - Creating the Articles Controller

With our model created, we need a controller for our articles. Controllers in
CakePHP handle HTTP requests and execute business logic contained in model
methods, to prepare the response. We'll place this new controller in a file
called **ArticlesController.php** inside the **src/Controller** directory.
Here's what the basic controller should look like:

``` php
<?php
// src/Controller/ArticlesController.php

namespace App\Controller;

class ArticlesController extends AppController
{
}
```

Now, let's add an action to our controller. Actions are controller methods that
have routes connected to them. For example, when a user requests
**www.example.com/articles/index** (which is also the same as
**www.example.com/articles**), CakePHP will call the `index` method of your
`ArticlesController`. This method should query the model layer, and prepare
a response by rendering a Template in the View. The code for that action would
look like this:

``` php
<?php
// src/Controller/ArticlesController.php

namespace App\Controller;

class ArticlesController extends AppController
{
    public function index()
    {
        $this->loadComponent('Paginator');
        $articles = $this->Paginator->paginate($this->Articles->find());
        $this->set(compact('articles'));
    }
}
```

By defining function `index()` in our `ArticlesController`, users can now
access the logic there by requesting **www.example.com/articles/index**.
Similarly, if we were to define a function called `foobar()`, users would be
able to access that at **www.example.com/articles/foobar**. You may be tempted
to name your controllers and actions in a way that allows you to obtain specific
URLs. Resist that temptation. Instead, follow the [CakePHP Conventions](intro/conventions)
creating readable, meaningful action names. You can then use
[Routing](development/routing) to connect the URLs you want to the actions you've
created.

Our controller action is very simple. It fetches a paginated set of articles
from the database, using the Articles Model that is automatically loaded via naming
conventions. It then uses `set()` to pass the articles into the Template (which
we'll create soon). CakePHP will automatically render the template after our
controller action completes.

### Create the Article List Template

Now that we have our controller pulling data from the model, and preparing our
view context, let's create a view template for our index action.

CakePHP view templates are presentation-flavored PHP code that is inserted inside
the application's layout. While we'll be creating HTML here, Views can also
generate JSON, CSV or even binary files like PDFs.

A layout is presentation code that is wrapped around a view. Layout files
contain common site elements like headers, footers and navigation elements. Your
application can have multiple layouts, and you can switch between them, but for
now, let's just use the default layout.

CakePHP's template files are stored in **src/Template** inside a folder
named after the controller they correspond to. So we'll have to create
a folder named 'Articles' in this case. Add the following code to your
application:

``` php
<!-- File: src/Template/Articles/index.ctp -->

<h1>Articles</h1>
<table>
    <tr>
        <th>Title</th>
        <th>Created</th>
    </tr>

    <!-- Here is where we iterate through our $articles query object, printing out article info -->

    <?php foreach ($articles as $article): ?>
    <tr>
        <td>
            <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
        </td>
        <td>
            <?= $article->created->format(DATE_RFC850) ?>
        </td>
    </tr>
    <?php endforeach; ?>
</table>
```

In the last section we assigned the 'articles' variable to the view using
`set()`. Variables passed into the view are available in the view templates as
local variables which we used in the above code.

You might have noticed the use of an object called `$this->Html`. This is an
instance of the CakePHP [HtmlHelper](views/helpers/html). CakePHP comes
with a set of view helpers that make tasks like creating links, forms, and
pagination buttons easy. You can learn more about [Helpers](views/helpers) in their
chapter, but what's important to note here is that the `link()` method will
generate an HTML link with the given link text (the first parameter) and URL
(the second parameter).

When specifying URLs in CakePHP, it is recommended that you use arrays or
[named routes](development/routing#named-routes). These syntaxes allow you to
leverage the reverse routing features CakePHP offers.

At this point, you should be able to point your browser to
**http://localhost:8765/articles/index**. You should see your list view,
correctly formatted with the title and table listing of the articles.

### Create the View Action

If you were to click one of the 'view' links in our Articles list page, you'd
see an error page saying that action hasn't been implemented. Lets fix that now:

``` php
// Add to existing src/Controller/ArticlesController.php file

public function view($slug = null)
{
    $article = $this->Articles->findBySlug($slug)->firstOrFail();
    $this->set(compact('article'));
}
```

While this is a simple action, we've used some powerful CakePHP features. We
start our action off by using `findBySlug()` which is
a [Dynamic Finder](orm/retrieving-data-and-resultsets#dynamic-finders). This method allows us to create a basic query that
finds articles by a given slug. We then use `firstOrFail()` to either fetch
the first record, or throw a `NotFoundException`.

Our action takes a `$slug` parameter, but where does that parameter come from?
If a user requests `/articles/view/first-post`, then the value 'first-post' is
passed as `$slug` by CakePHP's routing and dispatching layers. If we
reload our browser with our new action saved, we'd see another CakePHP error
page telling us we're missing a view template; let's fix that.

### Create the View Template

Let's create the view for our new 'view' action and place it in
**src/Template/Articles/view.ctp**

``` php
<!-- File: src/Template/Articles/view.ctp -->

<h1><?= h($article->title) ?></h1>
<p><?= h($article->body) ?></p>
<p><small>Created: <?= $article->created->format(DATE_RFC850) ?></small></p>
<p><?= $this->Html->link('Edit', ['action' => 'edit', $article->slug]) ?></p>
```

You can verify that this is working by trying the links at `/articles/index` or
manually requesting an article by accessing URLs like
`/articles/view/first-post`.

### Adding Articles

With the basic read views created, we need to make it possible for new articles
to be created. Start by creating an `add()` action in the
`ArticlesController`. Our controller should now look like:

``` php
// src/Controller/ArticlesController.php

namespace App\Controller;

use App\Controller\AppController;

class ArticlesController extends AppController
{
    public function initialize()
    {
        parent::initialize();

        $this->loadComponent('Paginator');
        $this->loadComponent('Flash'); // Include the FlashComponent
    }

    public function index()
    {
        $articles = $this->Paginator->paginate($this->Articles->find());
        $this->set(compact('articles'));
    }

    public function view($slug)
    {
        $article = $this->Articles->findBySlug($slug)->firstOrFail();
        $this->set(compact('article'));
    }

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->getData());

            // Hardcoding the user_id is temporary, and will be removed later
            // when we build authentication out.
            $article->user_id = 1;

            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been saved.'));
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to add your article.'));
        }
        $this->set('article', $article);
    }
}
```

> [!NOTE]
> You need to include the [Flash](controllers/components/flash) component in
> any controller where you will use it. Often it makes sense to include it in
> your `AppController`.

Here's what the `add()` action does:

- If the HTTP method of the request was POST, try to save the data using the Articles model.
- If for some reason it doesn't save, just render the view. This gives us a
  chance to show the user validation errors or other warnings.

Every CakePHP request includes a request object which is accessible using
`$this->request`. The request object contains information regarding the
request that was just received. We use the
`Cake\Http\ServerRequest::is()` method to check that the request
is a HTTP POST request.

Our POST data is available in `$this->request->getData()`. You can use the
`pr()` or `debug()` functions to print it out if you want to
see what it looks like. To save our data, we first 'marshal' the POST data into
an Article Entity. The Entity is then persisted using the ArticlesTable we
created earlier.

After saving our new article we use FlashComponent's `success()` method to set
a message into the session. The `success` method is provided using PHP's
[magic method features](https://php.net/manual/en/language.oop5.overloading.php#object.call). Flash
messages will be displayed on the next page after redirecting. In our layout we have
`<?= $this->Flash->render() ?>` which displays flash messages and clears the
corresponding session variable. Finally, after saving is complete, we use
`Cake\Controller\Controller::redirect` to send the user back to the
articles list. The param `['action' => 'index']` translates to URL
`/articles` i.e the index action of the `ArticlesController`. You can refer
to `Cake\Routing\Router::url()` function on the [API](https://api.cakephp.org) to see the formats in which you can specify a URL
for various CakePHP functions.

### Create Add Template

Here's our add view template:

``` php
<!-- File: src/Template/Articles/add.ctp -->

<h1>Add Article</h1>
<?php
    echo $this->Form->create($article);
    // Hard code the user for now.
    echo $this->Form->control('user_id', ['type' => 'hidden', 'value' => 1]);
    echo $this->Form->control('title');
    echo $this->Form->control('body', ['rows' => '3']);
    echo $this->Form->button(__('Save Article'));
    echo $this->Form->end();
?>
```

We use the FormHelper to generate the opening tag for an HTML
form. Here's the HTML that `$this->Form->create()` generates:

``` html
<form method="post" action="/articles/add">
```

Because we called `create()` without a URL option, `FormHelper` assumes we
want the form to submit back to the current action.

The `$this->Form->control()` method is used to create form elements
of the same name. The first parameter tells CakePHP which field
they correspond to, and the second parameter allows you to specify
a wide array of options - in this case, the number of rows for the
textarea. There's a bit of introspection and conventions used here. The
`control()` will output different form elements based on the model
field specified, and use inflection to generate the label text. You can
customize the label, the input or any other aspect of the form controls using
options. The `$this->Form->end()` call closes the form.

Now let's go back and update our **src/Template/Articles/index.ctp**
view to include a new "Add Article" link. Before the `<table>`, add
the following line:

``` php
<?= $this->Html->link('Add Article', ['action' => 'add']) ?>
```

### Adding Simple Slug Generation

If we were to save an Article right now, saving would fail as we are not
creating a slug attribute, and the column is `NOT NULL`. Slug values are
typically a URL-safe version of an article's title. We can use the
[beforeSave() callback](orm/table-objects#table-callbacks) of the ORM to populate our slug:

``` php
// in src/Model/Table/ArticlesTable.php
namespace App\Model\Table;

use Cake\ORM\Table;
// the Text class
use Cake\Utility\Text;

// Add the following method.

public function beforeSave($event, $entity, $options)
{
    if ($entity->isNew() && !$entity->slug) {
        $sluggedTitle = Text::slug($entity->title);
        // trim slug to maximum length defined in schema
        $entity->slug = substr($sluggedTitle, 0, 191);
    }
}
```

This code is simple, and doesn't take into account duplicate slugs. But we'll
fix that later on.

### Add Edit Action

Our application can now save articles, but we can't edit them. Lets rectify that
now. Add the following action to your `ArticlesController`:

``` php
// in src/Controller/ArticlesController.php

// Add the following method.

public function edit($slug)
{
    $article = $this->Articles->findBySlug($slug)->firstOrFail();
    if ($this->request->is(['post', 'put'])) {
        $this->Articles->patchEntity($article, $this->request->getData());
        if ($this->Articles->save($article)) {
            $this->Flash->success(__('Your article has been updated.'));
            return $this->redirect(['action' => 'index']);
        }
        $this->Flash->error(__('Unable to update your article.'));
    }

    $this->set('article', $article);
}
```

This action first ensures that the user has tried to access an existing record.
If they haven't passed in an `$slug` parameter, or the article does not exist,
a `NotFoundException` will be thrown, and the CakePHP ErrorHandler will render
the appropriate error page.

Next the action checks whether the request is either a POST or a PUT request. If
it is, then we use the POST/PUT data to update our article entity by using the
`patchEntity()` method. Finally, we call `save()` set the appropriate flash
message and either redirect or display validation errors.

### Create Edit Template

The edit template should look like this:

``` php
<!-- File: src/Template/Articles/edit.ctp -->

<h1>Edit Article</h1>
<?php
    echo $this->Form->create($article);
    echo $this->Form->control('user_id', ['type' => 'hidden']);
    echo $this->Form->control('title');
    echo $this->Form->control('body', ['rows' => '3']);
    echo $this->Form->button(__('Save Article'));
    echo $this->Form->end();
?>
```

This template outputs the edit form (with the values populated), along
with any necessary validation error messages.

You can now update your index view with links to edit specific
articles:

``` php
<!-- File: src/Template/Articles/index.ctp  (edit links added) -->

<h1>Articles</h1>
<p><?= $this->Html->link("Add Article", ['action' => 'add']) ?></p>
<table>
    <tr>
        <th>Title</th>
        <th>Created</th>
        <th>Action</th>
    </tr>

<!-- Here's where we iterate through our $articles query object, printing out article info -->

<?php foreach ($articles as $article): ?>
    <tr>
        <td>
            <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
        </td>
        <td>
            <?= $article->created->format(DATE_RFC850) ?>
        </td>
        <td>
            <?= $this->Html->link('Edit', ['action' => 'edit', $article->slug]) ?>
        </td>
    </tr>
<?php endforeach; ?>

</table>
```

### Update Validation Rules for Articles

Up until this point our Articles had no input validation done. Lets fix that by
using [a validator](orm/validation#validating-request-data):

``` php
// src/Model/Table/ArticlesTable.php

// add this use statement right below the namespace declaration to import
// the Validator class
use Cake\Validation\Validator;

// Add the following method.
public function validationDefault(Validator $validator)
{
    $validator
        ->allowEmptyString('title', 'Title cannot be empty', false)
        ->minLength('title', 10)
        ->maxLength('title', 255);

    $validator
        ->allowEmptyString('body', 'Body cannot be empty', false)
        ->minLength('body', 10);

    return $validator;
}
```

The `validationDefault()` method tells CakePHP how to validate your data when
the `save()` method is called. Here, we've specified that both the title, and
body fields must not be empty, and have certain length constraints.

CakePHP's validation engine is powerful and flexible. It provides a suite of
frequently used rules for tasks like email addresses, IP addresses etc. and the
flexibility for adding your own validation rules. For more information on that
setup, check the [Validation](core-libraries/validation) documentation.

Now that your validation rules are in place, use the app to try to add
an article with an empty title or body to see how it works. Since we've used the
`Cake\View\Helper\FormHelper::control()` method of the FormHelper to
create our form elements, our validation error messages will be shown
automatically.

### Add Delete Action

Next, let's make a way for users to delete articles. Start with a
`delete()` action in the `ArticlesController`:

``` php
// src/Controller/ArticlesController.php

public function delete($slug)
{
    $this->request->allowMethod(['post', 'delete']);

    $article = $this->Articles->findBySlug($slug)->firstOrFail();
    if ($this->Articles->delete($article)) {
        $this->Flash->success(__('The {0} article has been deleted.', $article->title));
        return $this->redirect(['action' => 'index']);
    }
}
```

This logic deletes the article specified by `$slug`, and uses
`$this->Flash->success()` to show the user a confirmation
message after redirecting them to `/articles`. If the user attempts to
delete an article using a GET request, `allowMethod()` will throw an exception.
Uncaught exceptions are captured by CakePHP's exception handler, and a nice
error page is displayed. There are many built-in
[Exceptions](development/errors) that can be used to indicate the various
HTTP errors your application might need to generate.

> [!WARNING]
> Allowing content to be deleted using GET requests is *very* dangerous, as web
> crawlers could accidentally delete all your content. That is why we used
> `allowMethod()` in our controller.

Because we're only executing logic and redirecting to another action, this
action has no template. You might want to update your index template with links
that allow users to delete articles:

``` php
<!-- File: src/Template/Articles/index.ctp  (delete links added) -->

<h1>Articles</h1>
<p><?= $this->Html->link("Add Article", ['action' => 'add']) ?></p>
<table>
    <tr>
        <th>Title</th>
        <th>Created</th>
        <th>Action</th>
    </tr>

<!-- Here's where we iterate through our $articles query object, printing out article info -->

<?php foreach ($articles as $article): ?>
    <tr>
        <td>
            <?= $this->Html->link($article->title, ['action' => 'view', $article->slug]) ?>
        </td>
        <td>
            <?= $article->created->format(DATE_RFC850) ?>
        </td>
        <td>
            <?= $this->Html->link('Edit', ['action' => 'edit', $article->slug]) ?>
            <?= $this->Form->postLink(
                'Delete',
                ['action' => 'delete', $article->slug],
                ['confirm' => 'Are you sure?'])
            ?>
        </td>
    </tr>
<?php endforeach; ?>

</table>
```

Using `Cake\View\Helper\FormHelper::postLink()` will create a link
that uses JavaScript to do a POST request deleting our article.

> [!NOTE]
> This view code also uses the `FormHelper` to prompt the user with a
> JavaScript confirmation dialog before they attempt to delete an
> article.

With a basic articles management setup, we'll create the [basic actions
for our Tags and Users tables](tutorials-and-examples/cms/tags-and-users).
