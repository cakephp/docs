Tutorial Blog - Parte 3
#######################

Crear categorias en Arbol
=========================

Vamos a continuar con nuestro blog e imaginar que queremos categorizar nuestros articulos. 
Queremos que las categorias estén ordenadas, y para esto, vamos a usar :doc:`Tree behavior </orm/behaviors/tree>` 
para ayudarnos a organizar las categorías.

Pero primero necesitamos modificar nuestras tablas.

Plugin de migración
===================

Vamos a usar el `migrations plugin <https://github.com/cakephp/migrations>`_ para crear una tabla en nuestra 
base de datos. Si tienes una tabla de articulos en tu base de datos, borrala.

Abre tu archivo ``composer.json``. Generalmente el plugin de migración ya esta incluido en ``require``. 
Si no es el caso, agrégalo::

    "require": {
        "cakephp/migrations": "~1.0"
    }

Luego corre el comando ``composer update``. El plugin de migración se alojara en tu carpeta de ``plugins``. 
Agrega también ``Plugin::load('Migrations');`` en el archivo bootstrap.php de tú aplicación.

Una vez que el plugin sea cargado, corre el siguiente comando para crear el archivo de migración::

    bin/cake migrations create Initial

Un archivo de migración será creado en la carpeta ``/config/Migrations``. Puedes abrir tu archivo y agregar las 
siguientes lineas::

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

Ahora corre el siguiente comando para crear tús tablas::

    bin/cake migrations migrate


Modificando las tablas
======================

Con nuestras tablas creadas, ahora podemos enfocarnos en categorizar los artículos.

Suponemos que ya tienes los archivos (Tables, Controllers y Templates de
Articles) de la parte 2 de esta serie de tutoriales, por lo que solamente vamos a agregar referencia a las categorías.

Necesitamos asociar las tablas de Articles y Categories. Abre el archivo **src/Model/Table/ArticlesTable.php** 
y agrega las siguientes lineas::

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

Generando el código base para las Categorías
============================================

Crea todos los archivos corriendo los siguientes comandos::

    bin/cake bake model Categories
    bin/cake bake controller Categories
    bin/cake bake template Categories

La herramienta bake ha creado todos los archivos en un instante. Puedes darles una rápida leida si necesitas re-familiarizarte con 
la forma en la que CakePHP funciona.

.. note::
    Si estás en Windows recordá usar \ en lugar de / .

Agregar el TreeBehavior a CategoriesTable
=========================================

:doc:`TreeBehavior </orm/behaviors/tree>` ayuda a manejar estructuras de árbol jerarquica en una tabla. Utiliza `MPTT logic
<http://www.sitepoint.com/hierarchical-data-database-2/>`_ para manejar los datos.
Las estructuras en árbol MPTT están optimizadas para lecturas, lo cual las hace ideal para aplicaciones con gran carga de 
lectura como los blogs.

Si abres el archivo **src/Model/Table/CategoriesTable.php** veras que el TreeBehavior fue agregado a CategoriesTable en el método 
``initialize()``. Bake agrega este behavior a cualquier tabla que contenga las columnas ``lft`` y ``rght``::

    $this->addBehavior('Tree');

Con el TreeBehavior agregado ahora podras acceder a algunas funcionalidades como reordenar las categorias. Veremos eso en un momento.

Pero por ahora tendrás que removar los siguientes inputs en tus archivos add y edit de Categories::

    echo $this->Form->input('lft');
    echo $this->Form->input('rght');

Esos campos son manejados automáticamento por el TreeBehavior cuando una categoría es guardada.

Con tú navegador, agrega alguna nueva categoría usando la acción ``/yoursite/categories/add``.

Reordenando categorías con TreeBehavior
=======================================

En el index de categorias, puedes listar y re-ordenar categorias.

Vamos a modificar el método index en tu ``CategoriesController.php``, agregando ``move_up()`` y ``move_down()`` 
para poder reordenar las categorías en ese árbol::

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

En **src/Template/Categories/index.ctp** reemplazá el contenido existente por el siguiente::

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


Modificando el ArticlesController
=================================

En tú ``ArticlesController``, vamos a obtener el listado de categorías.
Esto nos permitirá elegir una categoría para un Article al momento de crearlo o editarlo::

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


Modificando el template de Articles
===================================

El template add de Article debería verse similar a esto:: 

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

Ingresando a ``/yoursite/categories/add`` deberías ver una lista de categorías para elegir.

.. meta::
    :title lang=es: Tutorial Blog - Parte 3
    :keywords lang=en: doc models,migracion,arbol,controller actions,model article,php class,model class,model object,business logic,database table,naming convention,bread and butter,callbacks,prefixes,nutshell,interaction,array,cakephp,interface,applications,delete
