Tutoriel d'un Blog - Partie 3
#############################

Créer une Catégorie en Arbre (Tree)
===================================

Continuons notre application de blog et imaginons que nous souhaitions
catégoriser nos articles. Nous souhaitons que les catégories soit triées, et
pour cela, nous allons utiliser le :doc:`behavior Tree </orm/behaviors/tree>`
pour nous aide à organiser les catégories.

Mais d'abord, nous devons modifier nos tables.

Plugin Migrations
=================

Nous voulons utiliser le
`plugin migrations <https://github.com/cakephp/migrations>`_ pour
créer une table dans notre base de données. Si vous avez déjà une table
articles dans votre base de données, supprimez-la.

Maintenant ouvrez le fichier ``composer.json`` de votre application.
Normalement vous devriez voir que le plugin migrations est déjà dans
``require``. Si ce n'est pas le cas, ajoutez-le en faisant comme ce qui suit::

    "require": {
        "cakephp/migrations": "dev-master"
    }

Ensuite lancez ``composer update``. Le plugin migrations va maintenant être dans
le dossier ``plugins`` de votre application. Ajoutez aussi
``Plugin::load('Migrations');`` dans le fichier bootstrap.php de votre
application.

Une fois que le plugin est chargé, lancez la commande suivante pour créer un
fichier de migration::

    bin/cake migrations create Initial

Un fichier de migration sera généré dans le dossier ``config/Migrations``. Vous
pouvez ouvrir votre nouveau fichier de migration et ajouter ce qui suit::

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

Maintenant lancez la commande suivante pour créer vos tables::

    bin/cake migrations migrate


Modifier les Tables
===================

Avec nos tables définies, nous pouvons maintenant nous focaliser sur la
catégorisation de nos articles.

Nous supposons que vous avez déjà les fichiers (Tables, Controllers et
Templates des Articles) de la partie 2. Donc nous allons juste ajouter les
références aux categories.

Nous devons associer ensemble les tables Articles et Categories. Ouvrez le
fichier ``src/Model/Table/ArticlesTable.php`` et ajoutez ce qui suit::

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

Générer les Squelettes de Code des Catégories
=============================================

Créez tous les fichiers en lançant les commandes de bake suivantes::

    bin/cake bake model Categories
    bin/cake bake controller Categories
    bin/cake bake template Categories

L'outil bake a créé tous les fichiers en un clin d'œil. Vous pouvez les
lire rapidement si vous voulez vous re-familiariser avec le fonctionnement de
CakePHP.

Attacher TreeBehavior à CategoriesTable
=======================================

Le :doc:`TreeBehavior </orm/behaviors/tree>` vous aide à gérer des structures
hiérarchiques en arbre dans une table de base de données. Il utilise
`MPTT logic <http://www.sitepoint.com/hierarchical-data-database-2/>`_ pour
gérer les données. Les structures en arbre MPTT sont optimisées pour lire des
données ce qui les rend souvent pratique pour lire des applications lourdes
comme les blogs.

Si vous ouvrez le fichier ``src/Model/Table/CategoriesTable.php``, vous verrez
que le TreeBehavior a été attaché à votre CategoriesTable dans la méthode
``initialize``::

    $this->addBehavior('Tree');

Avec le TreeBehavior attaché, vous serez capable d'accéder à quelques
fonctionnalités comme la réorganisation de l'ordre des categories. Nous verrons
cela dans un moment.

Mais pour l'instant, vous devez retirer les lignes suivantes dans vos fichiers
de template add et edit::

    echo $this->Form->input('lft');
    echo $this->Form->input('rght');

Ces champs sont automatiquement gérés par le TreeBehavior quand
une catégorie est sauvegardée.

En utilisant votre navigateur, ajoutez quelques nouvelles catégories en
utilisant l'action du controller ``/yoursite/categories/add``.

Réorganiser l'Ordre des Catégories avec le TreeBehavior
=======================================================

Dans votre fichier de template index des catégories, vous pouvez lister les
catégories et réorganiser leur ordre.

Modifiez la méthode index dans votre ``CategoriesController.php`` et ajoutez les
méthodes ``move_up`` et ``move_down`` pour pouvoir réorganiser l'ordre des
catégories dans l'arbre::

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

Et l'index.ctp::

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
                <?= $this->Html->link(__('Voir'), ['action' => 'view', $category->id]) ?>
                <?= $this->Html->link(__('Modifier'), ['action' => 'edit', $category->id]) ?>
                <?= $this->Form->postLink(__('Supprimer'), ['action' => 'delete', $category->id], ['confirm' => __('Etes vous sur de vouloir supprimer # {0}?', $category->id)]) ?>
                <?= $this->Form->postLink(__('Descendre'), ['action' => 'move_down', $category->id], ['confirm' => __('Etes vous sur de vouloir descendre # {0}?', $category->id)]) ?>
                <?= $this->Form->postLink(__('Monter'), ['action' => 'move_up', $category->id], ['confirm' => __('Etes vous sur de vouloir monter # {0}?', $category->id)]) ?>
            </td>
        </tr>
    <?php endforeach; ?>

Modifier ArticlesController
===========================

Dans notre ``ArticlesController``, nous allons récupérer la liste de toutes les
catégories. Ceci va nous permettre de choisir une catégorie pour un Article
lorsque l'on va le créer ou le modifier::

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


Modifier les Templates des Articles
===================================

Le fichier add des articles devrait ressembler à quelque chose comme:

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

Quand vous allez à l'adresse `/yoursite/articles/add`, vous devriez voir une
liste des catégories à choisir.

.. meta::
    :title lang=fr: Tutoriel d'un Blog, Migrations et Tree
    :keywords lang=fr: doc models,migrations,tree,controller actions,model article,php class,model class,model object,business logic,database table,naming convention,bread and butter,callbacks,prefixes,nutshell,interaction,array,cakephp,interface,applications,delete
