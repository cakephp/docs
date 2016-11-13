Tutorial - Criando um Blog - Parte 3
####################################

Criar uma arvore de Categoria
=============================

Vamos continuar o nosso aplicativo de blog e imaginar que queremos categorizar
os nossos artigos. Queremos que as categorias sejam ordenadas, e para isso,
vamos usar o comportamento de árvore para nos ajudar a organizar as categorias.

Mas primeiro, precisamos modificar nossas tabelas.

Migração de Plugin
==================

Nós vamos usar o plugin de migrações para criar uma tabela em nosso banco de
dados. Se você tem a tabela articles no seu banco de dados, apague.  Agora abra
o arquivo composer.json do seu aplicativo.  Normalmente, você veria que o plugin
de migração já está requisitando. Se não, addicione atráves da execução::

    composer require cakephp/migrations:~1.0

O plugin de migração agora está na pasta de sua aplicação. Também, adicionar
``Plugin::load('Migrations');`` para o arquivo bootstrap.php do seu aplicativo.

Uma vez que o plugin está carregado, execute o seguinte comando para criar um
arquivo de migração::

    bin/cake bake migration CreateArticles title:string body:text category_id:integer created modified

Um arquivo de migração será gerado na pasta /config/Migrations com o seguinte:

.. code-block:: php

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

Executar outro comando para criar uma tabela de categorias. Se você precisar
especificar um comprimento de campo, você pode fazê-lo dentro de colchetes no
tipo de campo, ou seja::

    bin/cake bake migration CreateCategories parent_id:integer lft:integer[10] rght:integer[10] name:string[100] description:string created modified

Isso irá gerar o seguinte arquivo no config/Migrations:

.. code-block:: php

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

Agora que os arquivos de migração estão criadas, você pode editá-los antes de
criar suas tabelas. Precisamos mudar o 'null' => false para o campo parent_id
com ``'null' => true`` porque uma categoria de nível superior tem null no parent_id

Execute o seguinte comando para criar suas tabelas::

    bin/cake migrations migrate

Modificando as Tabelas
======================

Com nossas tabelas configuradas, agora podemos nos concentrar em categorizar os
nossos artigos.

Supomos que você já tem os arquivos (Tabelas, controladores e modelos dos
artigos) da parte 2. Então vamos adicionar as referências a categorias.

Precisamos associar os artigos e categorias juntos nas tabelas. Abra o arquivo
src/Model/Table/ArticlesTable.php e adicione o seguinte:

.. code-block:: php

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

Gerar código esqueleto por categorias
=====================================

Crie todos os arquivos pelo comando bake::

    bin/cake bake model Categories
    bin/cake bake controller Categories
    bin/cake bake template Categories

A ferramenta bake criou todos os seus arquivos em um piscar de olhos. Você pode
fazer uma leitura rápida se quiser familiarizar como o CakePHP funciona.

.. note::
    Se você estiver no Windows lembre-se de usar \ em vez de /.

Você vai precisar editar o seguinte em **src/Template/Categories/add.ctp**
e **src/Template/Categories/edit.ctp**::

    echo $this->Form->input('parent_id', [
        'options' => $parentCategories,
        'empty' => 'No parent category'
    ]);

Anexar árvore de compartamento para CategoriesTable
===================================================

O :doc:`TreeBehavior </orm/behaviors/tree>` ajuda você a gerenciar as estruturas
de árvore hierárquica na tabela do banco de dados. Usa a lógica MPTT para
gerenciar os dados. Estruturas de árvore MPTT são otimizados para lê, o que
muitas vezes torna uma boa opção para aplicações pesadas, como ler blogs.

Se você abrir o arquivo src/Model/Table/CategoriesTable.php, você verá que
o TreeBehavior foi anexado a sua CategoriesTable no método initialize(). Bake
acrescenta esse comportamento para todas as tabelas que contêm lft e colunas
rght::

    $this->addBehavior('Tree');

Com o TreeBehavior anexado você vai ser capaz de acessar alguns recursos como
a reordenação das categorias. Vamos ver isso em um momento.

Mas, por agora, você tem que remover as seguintes entradas em seus Categorias de
adicionar e editar arquivos de modelo::

    echo $this->Form->input('lft');
    echo $this->Form->input('rght');

Além disso, você deve desabilitar ou remover o requirePresence do validador,
tanto para a ``lft`` e ``rght`` nas colunas em seu modelo CategoriesTable:

.. code-block:: php

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

Esses campos são automaticamente gerenciados pelo TreeBehavior quando uma
categoria é salvo.

Usando seu navegador, adicione algumas novas categorias usando os
``/yoursite/categories/add`` ação do controlador.

Reordenar categorias com TreeBahavior
=====================================

Em seu arquivo de modelo de índices de categorias, você pode listar as
categorias e reordená-los.

Vamos modificar o método de índice em sua CategoriesController.php e adicionar
moveUp() e moveDown() para ser capaz de reordenar as categorias na árvore:

.. code-block:: php

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

Em src/Template/Categories/index.ctp substituir o conteúdo existente com:

.. code-block:: php

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

Modificando o ArticlesController
================================

Em nossa ArticlesController, vamos obter a lista de todas as categorias. Isto
irá permitir-nos para escolher uma categoria para um artigo ao criar ou editar
ele:

.. code-block:: php

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

Modificando os artigos Templates
================================

O artigo adicionado deveria se parecer como isto:

.. code-block:: php

    <!-- File: src/Template/Articles/add.ctp -->

    <h1>Add Article</h1>
    <?php
    echo $this->Form->create($article);
    // just added the categories input
    echo $this->Form->input('category_id');
    echo $this->Form->input('title');
    echo $this->Form->input('body', ['rows' => '3']);
    echo $this->Form->button(__('Save Article'));
    echo $this->Form->end();


Quando você vai para o endereço ``/yoursite/articles/add`` você deve ver uma lista
de categorias para escolher.
