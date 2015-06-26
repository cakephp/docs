Blog Tutorial - Part 3
######################

Create a Tree Category
======================

Let's continue our blog application and imagine we want to categorize our
articles. We want the categories to be ordered, and for this, we will use the
:doc:`Tree behavior </orm/behaviors/tree>` to help us organize the
categories.

But first, we need to modify our tables.

Migrations Plugin
=================

We will use the `migrations plugin <https://github.com/cakephp/migrations>`_ to
create a table in our database. If you already have an articles table in your
database, erase it.

Now open your application's ``composer.json`` file. Normally you would see that
the migrations plugin is already under ``require``. If not add it as follows::

    "require": {
        "cakephp/migrations": "~1.0"
    }

Then run ``composer update``. The migrations plugin will now be in your
application's ``plugins`` folder. Also add ``Plugin::load('Migrations');`` in
your application's bootstrap.php file.

Once the plugin is loaded, run the following command to create a migration file::

    bin/cake migrations create Initial

A migration file will be generated in the ``/config/Migrations`` folder. You can
open your new migration file and add the following::

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

Now run the following command to create your tables::

    bin/cake migrations migrate


Modifying the Tables
====================

With our tables set up, we can now focus on categorizing our articles.

We suppose you already have the files (Tables, Controllers and Templates of
Articles) from part 2. So we'll just add the references to categories.

We need to associated the Articles and Categories tables together. Open
the **src/Model/Table/ArticlesTable.php** file and add the following::

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

Generate Skeleton Code for Categories
=====================================

Create all files by launching bake commands::

    bin/cake bake model Categories
    bin/cake bake controller Categories
    bin/cake bake template Categories

The bake tool has created all your files in a snap. You can give them a quick
read if you want re-familiarize yourself with how CakePHP works.

Attach TreeBehavior to CategoriesTable
======================================

The :doc:`TreeBehavior </orm/behaviors/tree>` helps you manage hierarchical Tree
structures in database table. It uses the `MPTT logic
<http://www.sitepoint.com/hierarchical-data-database-2/>`_ to manage the data.
MPTT tree structures are optimized for reads, which often makes them a good fit
for read heavy applications like blogs.

If you open the **src/Model/Table/CategoriesTable.php** file, you'll see
that the TreeBehavior has been attached to your CategoriesTable in the
``initialize()`` method::

    $this->addBehavior('Tree');

With the TreeBehavior attached you'll be able to access some features like
reordering the categories.  We'll see that in a moment.

But for now, you have to remove the following inputs in your Categories add and
edit template files::

    echo $this->Form->input('lft');
    echo $this->Form->input('rght');

These fields are automatically managed by the TreeBehavior when
a category is saved.

Using your web browser, add some new categories using the
``/yoursite/categories/add`` controller action.

Reordering Categories with TreeBehavior
========================================

In your categories index template file, you can list the categories and re-order
them.

Let's modify the index method in your ``CategoriesController.php`` and add
``move_up()`` and ``move_down()`` methods to be able to reorder the categories in
the tree::

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
            return $this->redirect($this->referer(['action' => 'index']));
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
            return $this->redirect($this->referer(['action' => 'index']));
        }
    }

In **src/Template/Categories/index.ctp** replace the existing content with::

    <div class="actions columns large-2 medium-3">
        <h3><?= __('Actions') ?></h3>
        <ul class="side-nav">
            <li><?= $this->Html->link(__('New Category'), ['action' => 'add']) ?></li>
        </ul>
    </div>
    <div class="categories index large-10 medium-9 columns">
        <table cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th>id</th>
                <th>Parent Id</th>
                <th>Title</th>
                <th>Lft</th>
                <th>Rght</th>
                <th>Name</th>
                <th>Description</th>
                <th>Created</th>
                <th class="actions"><?= __('Actions') ?></th>
            </tr>
        </thead>
        <tbody>
        <?php foreach ($categories as $category): ?>
            <tr>
                <td><?= $this->Number->format($category->id) ?></td>
                <td><?= $this->Number->format($category->parent_id) ?></td>
                <td><?= $this->Number->format($category->lft) ?></td>
                <td><?= $this->Number->format($category->rght) ?></td>
                <td><?= h($category->name) ?></td>
                <td><?= h($category->description) ?></td>
                <td><?= h($category->created) ?></td>
                <td class="actions">
                    <?= $this->Html->link(__('View'), ['action' => 'view', $category->id]) ?>
                    <?= $this->Html->link(__('Edit'), ['action' => 'edit', $category->id]) ?>
                    <?= $this->Form->postLink(__('Delete'), ['action' => 'delete', $category->id], ['confirm' => __('Are you sure you want to delete # {0}?', $category->id)]) ?>
                    <?= $this->Form->postLink(__('Move down'), ['action' => 'move_down', $category->id], ['confirm' => __('Are you sure you want to move down # {0}?', $category->id)]) ?>
                    <?= $this->Form->postLink(__('Move up'), ['action' => 'move_up', $category->id], ['confirm' => __('Are you sure you want to move up # {0}?', $category->id)]) ?>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
        </table>
    </div>


Modifying the ArticlesController
================================

In our ``ArticlesController``, we'll get the list of all the categories.
This will allow us to choose a category for an Article when creating or editing
it::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    use Cake\Network\Exception\NotFoundException;

    class ArticlesController extends AppController
    {

        // ...

        public function add()
        {
            $article = $this->Articles->newEntity();
            if ($this->request->is('post')) {
                $article = $this->Articles->patchEntity($article, $this->request->data);
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


Modifying the Articles Templates
================================

The article add file should look something like this:

.. code-block:: php

    <!-- File: src/Template/Articles/add.ctp -->

    <h1>Add Article</h1>
    <?php
    echo $this->Form->create($article);
    // just added the categories input
    echo $this->Form->input('categories');
    echo $this->Form->input('title');
    echo $this->Form->input('body', ['rows' => '3']);
    echo $this->Form->button(__('Save Article'));
    echo $this->Form->end();

When you go to the address `/yoursite/articles/add` you should see a list
of categories to choose.

.. meta::
    :title lang=en: Blog Tutorial Migrations and Tree
    :keywords lang=en: doc models,migrations,tree,controller actions,model article,php class,model class,model object,business logic,database table,naming convention,bread and butter,callbacks,prefixes,nutshell,interaction,array,cakephp,interface,applications,delete
