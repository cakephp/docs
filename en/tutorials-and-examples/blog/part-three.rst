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

Now open your application's **composer.json** file. Normally you would see that
the migrations plugin is already under ``require``. If not, add it by executing::

    composer require cakephp/migrations:~1.0

The migrations plugin will now be in your application's **plugins** folder.
Also, add ``Plugin::load('Migrations');`` to your application's **bootstrap.php** file.

Once the plugin is loaded, run the following command to create a migration file::

    bin/cake bake migration CreateArticles title:string body:text category_id:integer created modified

A migration file will be generated in the **/config/Migrations** folder with the following::

    <?php

    use Migrations\AbstractMigration;

    class CreateArticles extends AbstractMigration
    {
        public function change()
        {
            $table = $this->table('articles');
            $table->addColumn('title', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => false,
            ]);
            $table->addColumn('body', 'text', [
                'default' => null,
                'null' => false,
            ]);
            $table->addColumn('category_id', 'integer', [
                'default' => null,
                'limit' => 11,
                'null' => false,
            ]);
            $table->addColumn('created', 'datetime', [
                'default' => null,
                'null' => false,
            ]);
            $table->addColumn('modified', 'datetime', [
                'default' => null,
                'null' => false,
            ]);
            $table->create();
        }
    }

Run another command to create a ``categories`` table. If you need to specify
a field length, you can do it within brackets in the field type, ie::

    bin/cake bake migration CreateCategories parent_id:integer lft:integer[10] rght:integer[10] name:string[100] description:string created modified

This will generate the following file in **config/Migrations**::

    <?php

    use Migrations\AbstractMigration;

    class CreateCategories extends AbstractMigration
    {
        public function change()
        {
            $table = $this->table('categories');
            $table->addColumn('parent_id', 'integer', [
                'default' => null,
                'limit' => 11,
                'null' => false,
            ]);
            $table->addColumn('lft', 'integer', [
                'default' => null,
                'limit' => 10,
                'null' => false,
            ]);
            $table->addColumn('rght', 'integer', [
                'default' => null,
                'limit' => 10,
                'null' => false,
            ]);
            $table->addColumn('name', 'string', [
                'default' => null,
                'limit' => 100,
                'null' => false,
            ]);
            $table->addColumn('description', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => false,
            ]);
            $table->addColumn('created', 'datetime', [
                'default' => null,
                'null' => false,
            ]);
            $table->addColumn('modified', 'datetime', [
                'default' => null,
                'null' => false,
            ]);
            $table->create();
        }
    }

Now that the migration files are created, you can edit them before creating
your tables. We need to change the ``'null' => false`` for the ``parent_id``
field with ``'null' => true`` because a top-level category has a null
``parent_id``.

Run the following command to create your tables::

    bin/cake migrations migrate

Modifying the Tables
====================

With our tables set up, we can now focus on categorizing our articles.

We suppose you already have the files (Tables, Controllers and Templates of
Articles) from part 2. So we'll just add the references to categories.

We need to associate the Articles and Categories tables together. Open
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

Alternatively, you can bake all with just one line::

    bin/cake bake all Categories

The bake tool has created all your files in a snap. You can give them a quick
read if you want re-familiarize yourself with how CakePHP works.

.. note::
    If you are on Windows remember to use \\ instead of /.

You'll need to edit the following in **src/Template/Categories/add.ctp**
and **src/Template/Categories/edit.ctp**::

    echo $this->Form->control('parent_id', [
        'options' => $parentCategories,
        'empty' => 'No parent category'
    ]);

Attach TreeBehavior to CategoriesTable
======================================

The :doc:`TreeBehavior </orm/behaviors/tree>` helps you manage hierarchical Tree
structures in database table. It uses the `MPTT logic
<http://www.sitepoint.com/hierarchical-data-database-2/>`_ to manage the data.
MPTT tree structures are optimized for reads, which often makes them a good fit
for read heavy applications like blogs.

If you open the **src/Model/Table/CategoriesTable.php** file, you'll see
that the TreeBehavior has been attached to your CategoriesTable in the
``initialize()`` method. Bake adds this behavior to any Tables that contain
``lft`` and ``rght`` columns::

    $this->addBehavior('Tree');

With the TreeBehavior attached you'll be able to access some features like
reordering the categories.  We'll see that in a moment.

But for now, you have to remove the following controls in your Categories add and
edit template files::

    echo $this->Form->control('lft');
    echo $this->Form->control('rght');

In addition you should disable or remove the requirePresence from the validator
for both the ``lft`` and ``rght`` columns in your CategoriesTable model::

    public function validationDefault(Validator $validator)
    {
        $validator
            ->add('id', 'valid', ['rule' => 'numeric'])
            ->allowEmpty('id', 'create');

        $validator
            ->add('lft', 'valid', ['rule' => 'numeric'])
        //    ->requirePresence('lft', 'create')
            ->notEmpty('lft');

        $validator
            ->add('rght', 'valid', ['rule' => 'numeric'])
        //    ->requirePresence('rght', 'create')
            ->notEmpty('rght');
    }

These fields are automatically managed by the TreeBehavior when
a category is saved.

Using your web browser, add some new categories using the
``/yoursite/categories/add`` controller action.

Reordering Categories with TreeBehavior
=======================================

In your categories index template file, you can list the categories and re-order
them.

Let's modify the index method in your **CategoriesController.php** and add
``moveUp()`` and ``moveDown()`` methods to be able to reorder the categories in
the tree::

    class CategoriesController extends AppController
    {
        public function index()
        {
            $categories = $this->Categories->find()
                ->order(['lft' => 'ASC']);
            $this->set(compact('categories'));
            $this->set('_serialize', ['categories']);
        }

        public function moveUp($id = null)
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

        public function moveDown($id = null)
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

    <div class="actions large-2 medium-3 columns">
        <h3><?= __('Actions') ?></h3>
        <ul class="side-nav">
            <li><?= $this->Html->link(__('New Category'), ['action' => 'add']) ?></li>
        </ul>
    </div>
    <div class="categories index large-10 medium-9 columns">
        <table cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th>Id</th>
                <th>Parent Id</th>
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
                <td><?= $category->id ?></td>
                <td><?= $category->parent_id ?></td>
                <td><?= $category->lft ?></td>
                <td><?= $category->rght ?></td>
                <td><?= h($category->name) ?></td>
                <td><?= h($category->description) ?></td>
                <td><?= h($category->created) ?></td>
                <td class="actions">
                    <?= $this->Html->link(__('View'), ['action' => 'view', $category->id]) ?>
                    <?= $this->Html->link(__('Edit'), ['action' => 'edit', $category->id]) ?>
                    <?= $this->Form->postLink(__('Delete'), ['action' => 'delete', $category->id], ['confirm' => __('Are you sure you want to delete # {0}?', $category->id)]) ?>
                    <?= $this->Form->postLink(__('Move down'), ['action' => 'moveDown', $category->id], ['confirm' => __('Are you sure you want to move down # {0}?', $category->id)]) ?>
                    <?= $this->Form->postLink(__('Move up'), ['action' => 'moveUp', $category->id], ['confirm' => __('Are you sure you want to move up # {0}?', $category->id)]) ?>
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
                // Prior to 3.4.0 $this->request->data() was used.
                $article = $this->Articles->patchEntity($article, $this->request->getData());
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
    // just added the categories control
    echo $this->Form->control('category_id');
    echo $this->Form->control('title');
    echo $this->Form->control('body', ['rows' => '3']);
    echo $this->Form->button(__('Save Article'));
    echo $this->Form->end();

When you go to the address `/yoursite/categories/add` you should see a list
of categories to choose.

.. meta::
    :title lang=en: Blog Tutorial Migrations and Tree
    :keywords lang=en: doc models,migrations,tree,controller actions,model article,php class,model class,model object,business logic,database table,naming convention,bread and butter,callbacks,prefixes,nutshell,interaction,array,cakephp,interface,applications,delete
