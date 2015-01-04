Blog Tutorial - Part 3
######################

Create a Tree Category
======================

Let's continue our tutorial and imagine we want to put our Articles in
Categories. We want that the categories are ordered and for this, we will use
the Tree behavior that allow us to organize the categories.

But we need first to modify our tables.

Migrations Plugin
=================

We will use the `migrations plugin <https://github.com/cakephp/migrations>`_ to
create a table in our database. If you already have a table articles in your
database, erase it.

Now open your composer.json file and normally you should see that the
migrations plugin is already in require. If not do as follow::

    "require": {
        "cakephp/migrations": "dev-master"
    }

Then run `composer update`. The Migrations plugin should now be in the
`/plugins` folder. Also add ``Plugin::load('Migrations');`` in your
application's bootstrap.php file.

Do the following command to create a migration file::

    bin/cake migrations create Initial

A migration file has been generated in ``/config/Migrations`` folder. You can
now open your migration file and add the following::

    <?php

    use Phinx\Migration\AbstractMigration;

    class Initial extends AbstractMigration
    {
        public function change()
        {
            $articles = $this->table('articles');
            $articles->addColumn('title', 'string', ['limit' => 50])
                ->addColumn('body', 'text', ['null' => true, 'default' => null])
                ->addColumn('category_id', 'integer', ['null' => true, 'default' => null])
                ->addColumn('created', 'datetime')
                ->addColumn('modified', 'datetime', ['null' => true, 'default' => null])
                ->save();
            $categories = $this->table('categories');
            $categories->addColumn('parent_id', 'integer', ['null' => true, 'default' => null])
                ->addColumn('lft', 'integer', ['null' => true, 'default' => null])
                ->addColumn('rght', 'integer', ['null' => true, 'default' => null])
                ->addColumn('name', 'string', ['limit' => 255])
                ->addColumn('description', 'string', ['limit' => 255, 'null' => true, 'default' => null])
                ->addColumn('created', 'datetime')
                ->addColumn('modified', 'datetime', ['null' => true, 'default' => null])
                ->save();
        }
    }


And launch the following command to create your tables::

    bin/cake migrations migrate


Modifying the Tables
====================

Our tables are now set up, we can now focus on the categories.

We suppose you already have the files (Tables, Controllers and Templates of
Articles) from part 2. So we'll just add the references to categories.

We need to bind the Tables Articles and Categories together. So you can open
the ``/src/Model/Table/ArticlesTable.php`` and add the following::

    // src/Model/Table/ArticlesTable.php

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Timestamp');
            // Just add the belongsTo relation with CategoriesTable
            $this->belongsTo('Categories', [
                'foreignKey' => 'category_id',
            ]);
        }
    }


Generate all Files for Categories
=================================

Create all files by launching bake commands::

    bin/cake bake model Categories
    bin/cake bake controller Categories
    bin/cake bake view Categories

The bake tool has created all your files in a snap, so don't hesitate to look
at the new files.


TreeBehavior Attached to CategoriesTable
========================================

Here put some explanation about TreeBehavior. More info in
:doc:`Tree Behavior </orm/behaviors/tree>`.

If you open the CategoriesTable.php file baked, you'll see that the TreeBehavior
has been attached to your CategoriesTable in your initialize method::

    $this->addBehavior('Tree');

So now you'll be able to access some features like reordering the categories.
We'll see that in a moment.

But for now, you have to remove the following inputs in your Categories add and
edit files::

    echo $this->Form->input('lft');
    echo $this->Form->input('rght');

Indeed, these fields are automatically fullfilled by the Tree Behavior when
a category is saved.

Please go now in ``/yoursite/categories/add`` and add some new categories.


Reorder Categories with TreeBehavior
====================================

In your categories index file, you can list the categories and ordering them.

Let's modify the index method in your CategoriesController.php and add
move_up and move_down methods to be able to reorder the categories in the
tree::

    class CategoriesController extends AppController
    {
        public function index()
        {
            $categories = $this->Categories->find('threaded')
                ->order(['lft' => 'ASC']);
            $this->set(compact('categories'));
        }

        public function move_up($id = null)
        {
            $this->request->allowMethod(['post', 'put']);
            $category = $this->Categories->get($id);
            if ($this->Categories->moveUp($category)) {
                $this->Flash->success('The category has been moved Up.');
            } else {
                $this->Flash->error('The category could not be moved up. Please, try again.');
            }
            return $this->redirect(['action' => 'index']);
        }

        public function move_down($id = null)
        {
            $this->request->allowMethod(['post', 'put']);
            $category = $this->Categories->get($id);
            if ($this->Categories->moveDown($category)) {
                $this->Flash->success('The category has been moved down.');
            } else {
                $this->Flash->error('The category could not be moved down. Please, try again.');
            }
            return $this->redirect(['action' => 'index']);
        }
    }

And the index.ctp::

    <?php foreach ($categories as $category): ?>
        <?= $this->Number->format($category->id) ?>
        <?= $this->Number->format($category->parent_id) ?>
        <?= $this->Number->format($category->lft) ?>
        <?= $this->Number->format($category->rght) ?>
        <?= h($category->name) ?>
        <?= h($category->description) ?>
        <?= h($category->created) ?>
        <?= $this->Html->link(__('View'), ['action' => 'view', $category->id]) ?>
        <?= $this->Html->link(__('Edit'), ['action' => 'edit', $category->id]) ?>
        <?= $this->Form->postLink(__('Move down'), ['action' => 'delete', $category->id], ['confirm' => __('Are you sure you want to move down # {0}?', $category->id)]) ?>
        <?= $this->Form->postLink(__('Move up'), ['action' => 'delete', $category->id], ['confirm' => __('Are you sure you want to move up # {0}?', $category->id)]) ?>
        <?= $this->Form->postLink(__('Delete'), ['action' => 'delete', $category->id], ['confirm' => __('Are you sure you want to delete # {0}?', $category->id)]) ?>
        <br />
    <?php endforeach; ?>



Modifying the ArticlesController
================================

In our ArticlesController, we'll get the list of all the categories.
This will allow us to choose a category for an Article in the view::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    use Cake\Network\Exception\NotFoundException;

    class ArticlesController extends AppController
    {

        // ...

        public function add()
        {
            $article = $this->Articles->newEntity($this->request->data);
            if ($this->request->is('post')) {
                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Your article has been saved.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__('Unable to add your article.'));
            }
            $this->set('article', $article);

            // Just added the categories list to be able to choose
            // one category for an article
            $categories = $this->Articles->Categories->find('treeList');
            $this->set(compact('categories'));
        }
    }


Modifying the Articles Template
===============================

The article add file should look something like this:

.. code-block:: php

    <!-- File: src/Template/Articles/add.ctp -->

    <h1>Edit Article</h1>
    <?php
    echo $this->Form->create($article);
    // just added the categories input
    echo $this->Form->input('categories');
    echo $this->Form->input('title');
    echo $this->Form->input('body', ['rows' => '3']);
    echo $this->Form->button(__('Save Article'));
    echo $this->Form->end();


When you go to the address `/yoursite/articles/add` and you should see a list
of categories to choose.


.. meta::
    :title lang=en: Blog Tutorial Migrations and Tree
    :keywords lang=en: doc models,migrations,tree,controller actions,model article,php class,model class,model object,business logic,database table,naming convention,bread and butter,callbacks,prefixes,nutshell,interaction,array,cakephp,interface,applications,delete
