# CMS Tutorial - Creating our First Model

Models are the heart of CakePHP applications. They enable us to read and
modify our data. They allow us to build relations between our data, validate
data, and apply application rules. Models provide the foundation necessary to
create our controller actions and templates.

CakePHP's models are composed of `Table` and `Entity` objects. `Table`
objects provide access to the collection of entities stored in a specific table.
They are stored in **src/Model/Table**. The file we'll be creating will be saved
to **src/Model/Table/ArticlesTable.php**. The completed file should look like
this:

``` php
<?php
// src/Model/Table/ArticlesTable.php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Table;

class ArticlesTable extends Table
{
    public function initialize(array $config): void
    {
        parent::initialize($config);
        $this->addBehavior('Timestamp');
    }
}
```

We've attached the [Timestamp](../../orm/behaviors/timestamp) behavior, which will
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
record in the database and provide row-level behavior for our data. Our entity
will be saved to **src/Model/Entity/Article.php**. The completed file should
look like this:

``` php
<?php
// src/Model/Entity/Article.php
declare(strict_types=1);

namespace App\Model\Entity;

use Cake\ORM\Entity;

class Article extends Entity
{
    protected array $patchable = [
        'user_id' => true,
        'title' => true,
        'slug' => true,
        'body' => true,
        'published' => true,
        'created' => true,
        'modified' => true,
        'user' => true,
        'tags' => true,
    ];
}
```

Right now, our entity is quite slim; we've only set up the `patchable`
property, which controls how properties can be modified by
[Entities Mass Assignment](../../orm/entities#entities-mass-assignment).

> [!TIP]
> The `ArticlesTable` and `Article` Entity classes can be generated from a
> terminal:
>
> ``` bash
> bin/cake bake model articles
> ```

We can't do much with this model yet. Next, we'll create our first
[Controller and Template](../../tutorials-and-examples/cms/articles-controller)
to allow us to interact with our model.
