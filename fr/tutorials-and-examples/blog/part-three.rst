Tutoriel d'un Blog - Partie 3
#############################

Créer une Catégorie en Arbre (Tree)
===================================

Continuons notre application de blog et imaginons que nous souhaitions
catégoriser nos articles. Nous souhaitons que les catégories soit triées, et
pour cela, nous allons utiliser le :doc:`behavior Tree </orm/behaviors/tree>`
pour nous aider à organiser les catégories.

Mais d'abord, nous devons modifier nos tables.

Plugin Migrations
=================

Nous allons utiliser le
`plugin migrations <https://github.com/cakephp/migrations>`_ pour créer une
table dans notre base de données. Si vous avez déjà une table articles dans
votre base de données, supprimez-la.

Maintenant ouvrez le fichier **composer.json** de votre application. Normalement
vous devriez voir que le plugin migrations est déjà dans ``require``. Si ce
n'est pas le cas, ajoutez-le en utilisant::

    composer require cakephp/migrations:~1.0

Le plugin migrations va maintenant être dans le dossier **plugins** de votre
application. Ajoutez aussi ``Plugin::load('Migrations');`` à la méthode
``bootstrap`` de votre application.

Une fois que le plugin est chargé, lancez la commande suivante pour créer un
fichier de migration::

    bin/cake bake migration CreateArticles title:string body:text category_id:integer created modified

Un fichier de migration sera généré dans le dossier **config/Migrations** avec
ce qui suit::

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

Exécutez une autre commande pour créer une table ``categories``. Si vous voulez
spécifier une longueur de champ, vous pouvez le faire entre crochets dans le
type du champ, par exemple::

    bin/cake bake migration CreateCategories parent_id:integer lft:integer[10] rght:integer[10] name:string[100] description:string created modified

Ceci va générer le fichier suivant dans **config/Migrations**::

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

Maintenant que les fichiers de migration sont créés, vous pouvez les modifier
avant de créer vos tables. Nous devons changer ``'null' => false`` pour
le champ ``parent_id`` par ``'null' => true`` car une catégorie de premier
niveau a un ``parent_id`` null.

Exécutez la commande suivante pour créer vos tables::

    bin/cake migrations migrate

Modifier les Tables
===================

Avec nos tables définies, nous pouvons maintenant nous focaliser sur la
catégorisation de nos articles.

Nous supposons que vous avez déjà les fichiers (Tables, Controllers et
Templates des Articles) de la partie 2. Donc nous allons juste ajouter les
références aux catégories.

Nous devons associer ensemble les tables Articles et Categories. Ouvrez le
fichier **src/Model/Table/ArticlesTable.php** et ajoutez ce qui suit::

    // src/Model/Table/ArticlesTable.php

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {
        public function initialize(array $config): void
        {
            $this->addBehavior('Timestamp');
            // Ajoute juste la relation belongsTo avec CategoriesTable
            $this->belongsTo('Categories', [
                'foreignKey' => 'category_id',
            ]);
        }
    }

Générer les Squelettes de Code des Catégories
=============================================

Créez tous les fichiers en lançant les commandes **bake** suivantes::

    bin/cake bake model Categories
    bin/cake bake controller Categories
    bin/cake bake template Categories

Au choix, vous pouvez aussi tous les créer en une seule ligne::

    bin/cake bake all Categories

L'outil bake a créé tous les fichiers en un clin d'œil. Vous pouvez les
lire rapidement si vous voulez vous re-familiariser avec le fonctionnement de
CakePHP.

.. note::
    Si vous utilisez Windows, pensez à utiliser \\ à la place de /.

Vous devrez modifier ce qui suit dans **templates/Categories/add.php**
et **templates/Categories/edit.php**::

    echo $this->Form->control('parent_id', [
        'options' => $parentCategories,
        'empty' => 'Pas de catégorie parente'
    ]);

Attacher TreeBehavior à CategoriesTable
=======================================

Le :doc:`TreeBehavior </orm/behaviors/tree>` vous aide à gérer des structures
hiérarchiques en arbre dans une table de base de données. Il utilise la
`logique MPTT <https://www.sitepoint.com/hierarchical-data-database-2/>`_ pour
gérer les données. Les structures en arbre MPTT sont optimisées pour lire des
données, ce qui les rend souvent pratiques pour lire des applications lourdes
comme les blogs.

Si vous ouvrez le fichier **src/Model/Table/CategoriesTable.php**, vous verrez
que le TreeBehavior a été attaché à votre CategoriesTable dans la méthode
``initialize()``. Bake ajoute automatiquement ce behavior à toutes les Tables
qui contiennent les colonnes ``lft`` et ``rght``::

    $this->addBehavior('Tree');

Avec le TreeBehavior attaché, vous serez capable d'accéder à certaines
fonctionnalités comme la réorganisation de l'ordre des categories. Nous verrons
cela dans un moment.

Mais pour l'instant, vous devez retirer les lignes suivantes dans vos templates
**add** et **edit** des catégories::

    echo $this->Form->control('lft');
    echo $this->Form->control('rght');

De plus, vous devez désactiver ou retirer les requirePresence du validateur
pour les colonnes ``lft`` et ``rght`` dans votre model CategoriesTable::

    public function validationDefault(Validator $validator): Validator
    {
        $validator
            ->add('id', 'valid', ['rule' => 'numeric'])
            ->allowEmptyString('id', 'create');

        $validator
            ->add('lft', 'valid', ['rule' => 'numeric'])
        //    ->requirePresence('lft', 'create')
            ->notEmpty('lft');

        $validator
            ->add('rght', 'valid', ['rule' => 'numeric'])
        //    ->requirePresence('rght', 'create')
            ->notEmpty('rght');
    }

Ces champs sont gérés automatiquement par le TreeBehavior quand
une catégorie est sauvegardée.

En utilisant votre navigateur, ajoutez quelques nouvelles catégories en
utilisant l'action ``/yoursite/categories/add``.

Réorganiser l'Ordre des Catégories avec le TreeBehavior
=======================================================

Dans votre fichier de template **index** des catégories, vous pouvez lister les
catégories et les réordonner.

Modifions la méthode index dans votre **CategoriesController.php** et ajoutons
les méthodes ``moveUp()`` et ``moveDown()`` pour pouvoir réorganiser l'ordre des
catégories dans l'arbre::

    class CategoriesController extends AppController
    {
        public function index()
        {
            $categories = $this->Categories->find()
                ->order(['lft' => 'ASC'])
                ->all();
            $this->set(compact('categories'));
            $this->viewBuilder()->setOption('serialize', ['categories']);
        }

        public function moveUp($id = null)
        {
            $this->request->allowMethod(['post', 'put']);
            $category = $this->Categories->get($id);
            if ($this->Categories->moveUp($category)) {
                $this->Flash->success('La catégorie a été remontée.');
            } else {
                $this->Flash->error("La catégorie n'a pas pu être remontée. Veuillez réessayer.");
            }
            return $this->redirect($this->referer(['action' => 'index']));
        }

        public function moveDown($id = null)
        {
            $this->request->allowMethod(['post', 'put']);
            $category = $this->Categories->get($id);
            if ($this->Categories->moveDown($category)) {
                $this->Flash->success('La catégorie a été descendue.');
            } else {
                $this->Flash->error("La catégorie n'a pas pu être descendue. Veuillez réessayer.");
            }
            return $this->redirect($this->referer(['action' => 'index']));
        }
    }

Remplacez le contenu existant dans **templates/Categories/index.php** par
ceci::

    <div class="actions large-2 medium-3 columns">
        <h3><?= __('Actions') ?></h3>
        <ul class="side-nav">
            <li><?= $this->Html->link(__('Nouvelle Categorie'), ['action' => 'add']) ?></li>
        </ul>
    </div>
    <div class="categories index large-10 medium-9 columns">
        <table cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th>Id</th>
                <th>Id parent</th>
                <th>Gauche</th>
                <th>Droite</th>
                <th>Nom</th>
                <th>Description</th>
                <th>Créée le</th>
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
                    <?= $this->Html->link(__('Voir'), ['action' => 'view', $category->id]) ?>
                    <?= $this->Html->link(__('Editer'), ['action' => 'edit', $category->id]) ?>
                    <?= $this->Form->postLink(__('Supprimer'), ['action' => 'delete', $category->id], ['confirm' => __('Etes vous sur de vouloir supprimer # {0}?', $category->id)]) ?>
                    <?= $this->Form->postLink(__('Descendre'), ['action' => 'moveDown', $category->id], ['confirm' => __('Etes vous sur de vouloir descendre # {0}?', $category->id)]) ?>
                    <?= $this->Form->postLink(__('Monter'), ['action' => 'moveUp', $category->id], ['confirm' => __('Etes vous sur de vouloir monter # {0}?', $category->id)]) ?>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
        </table>
    </div>

Modifier ArticlesController
===========================

Dans notre ``ArticlesController``, nous allons récupérer la liste de toutes les
catégories. Ceci va nous permettre de choisir une catégorie pour un Article
lorsqu'on va le créer ou le modifier::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    use Cake\Http\Exception\NotFoundException;

    class ArticlesController extends AppController
    {

        // ...

        public function add()
        {
            $article = $this->Articles->newEmptyEntity();
            if ($this->request->is('post')) {
                $article = $this->Articles->patchEntity($article, $this->request->getData());
                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Votre article a été enregistré.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__("Impossible d\'ajouter votre article."));
            }
            $this->set('article', $article);

            // Ajout de la liste des catégories pour pouvoir choisir
            // une catégorie pour un article
            $categories = $this->Articles->Categories->find('treeList');
            $this->set(compact('categories'));
        }
    }

Modifier les Templates des Articles
===================================

Le fichier **add** des articles devrait ressembler à ceci:

.. code-block:: php

    <!-- Fichier: templates/Articles/add.php -->

    <h1>Ajouter un Article</h1>
    <?php
    echo $this->Form->create($article);
    // Ajout des input liés aux catégories (via la méthode "control")
    echo $this->Form->control('category_id');
    echo $this->Form->control('title');
    echo $this->Form->control('body', ['rows' => '3']);
    echo $this->Form->button(__("Enregistrer l'article"));
    echo $this->Form->end();

Quand vous allez à l'adresse ``/yoursite/categories/add``, vous devriez voir une
liste de choix des catégories.

.. meta::
    :title lang=fr: Tutoriel d'un Blog, Migrations et Tree
    :keywords lang=fr: doc models,migrations,tree,controller actions,model article,php class,model class,model object,business logic,database table,naming convention,bread and butter,callbacks,prefixes,nutshell,interaction,array,cakephp,interface,applications,delete
