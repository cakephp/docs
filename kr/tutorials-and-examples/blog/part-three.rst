블로그 튜토리얼 - 파트3
##############################

트리 카테고리 작성
======================

블로그 작성을 진행하고 여러 기사를 분류해서 카테고리 관리를 해보겠습니다.
순서대로 정렬한 카테고리가 필요하며 카테고리 만들기 위해
:doc:`Tree behavior </orm/behaviors/tree>` 를 사용합니다.

그럼 먼저 테이블을 수정해 보겠습니다.

Migrations 플러그인
=====================

데이터베이스에 테이블을 만드는데 `migrations 플러그인
<https://github.com/cakephp/migrations>`_ 을 이용합니다.
만약 articles 테이블이 데이터베이스에 이미 존재하는 경우 삭제하시기 바랍니다.

``composer.json`` 파일을 보겠습니다.
``require`` 아래에 이미 마이그레이션 플러그인을 확인 할 수 있습니다.
만약 없었다면 다음을 실행하여 추가하시기 바랍니다. ::

    composer require cakephp/migrations:~1.0

마이그레이션 플러그인은 응용 프로그램의 ``plugins`` 폴더에 존재합니다.
그리고 응용 프로그램의 ``bootstrap.php`` 파일에 ``Plugin::load('Migrations');``
를 추가합니다.

플러그인을 로드한 후 다음 명령을 실행해서 마이그레이션 파일을 작성합니다. ::

    bin/cake bake migration CreateArticles title:string body:text category_id:integer created modified

``/config/Migrations`` 폴더에 있는 마이그레이션 파일은 다음과 같습니다. ::

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

``categories`` 테이블도 같이 명령을 실행하여 작성합니다.
만약 필드에 특정 길이를 지정하려면 괄호를 사용하여 다음과 같이 설정 할 수 있습니다. ::

    bin/cake bake migration CreateCategories parent_id:integer lft:integer[10] rght:integer[10] name:string[100] description:string created modified

따라서 ``config/Migrations`` 에서 다음과 같이 작성할 수 있습니다. ::

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

그럼 마이그레이션 파일을 작성했기 때문에 테이블을 작성하기 전에 수정해보겠습니다.
``parent_id`` 필드를 ``'null' => false`` 을 ``'null' => true`` 로 변경합니다.
최상위 카테고리에서 ``parent_id`` 는 null 이되기 때문입니다. 테이블을 만들 때는 다음 명령을 실행하겠습니다. ::

테이블작성 명령어는 다음과 같습니다. ::

    bin/cake migrations migrate


테이블 수정
==============

테이블이 준비되면 기사를 분류할 수 있습니다.

이미 파트2에서 파일(Articles의 Table, Controller 및 Template)을 작성했다고 가정하겠습니다.
이제 카테고리에 참조를 추가해 보겠습니다.

Articles 와 Categories 테이블을 연결해야 합니다.
**src/Model/Table/ArticlesTable.php** 파일을 열고 다음과 같이 추가합니다. ::

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

Categories 스켈레톤 코드 작성
=======================================

bake 명령어를 이용해 모든 파일을 작성해 보겠습니다. ::

    bin/cake bake model Categories
    bin/cake bake controller Categories
    bin/cake bake template Categories

한 번에 실행하고 싶으시면 아래의 명령어를 입력합니다. ::

    bin/cake bake all Categories

bake로 모든 파일이 생성되었습니다.
만약 CakePHP가 어떻게 움직이고 있는지를 알고 싶으면 bake를 읽어보시기 바랍니다.

.. note::
Windows일 경우 / 대신에 \\ 를 사용합니다.

``src/Template/Categories/add.ctp`` 및 ``src/Template/Categories/edit.ctp``
을 아래와 같이 수정합니다. ::

    echo $this->Form->control('parent_id', [
        'options' => $parentCategories,
        'empty' => 'No parent category'
    ]);

TreeBehavior 를 Categories 테이블에 추가
===============================================

데이터베이스 테이블의 계층적인 트리 구조를 관리하는데 :doc:`TreeBehavior </orm/behaviors/tree>`
가 도움이 될 것입니다.
데이터 관리는 `MPTT logic
<http://www.sitepoint.com/hierarchical-data-database-2/>`_  를 이용하고 있습니다.
MPTT 트리 구조는 읽기에 최적화되어있어 블로그와 같이 '읽기'가 많은 응용 프로그램에 적합합니다.

``src/Model/Table/CategoriesTable.php`` 파일을 열면 ``initialize()`` 메소드안에 TreeBehavior가 CategoriesTable랑 연결되있는 것을 알 수 있습니다.
Bake는 ``lft`` 및 ``rght`` 열이 포함 된 테이블에 이 동작을 추가합니다. ::

    $this->addBehavior('Tree');

TreeBehavior를 선언하면 카테고리 순서를 바꾸는 기능이 있는데 지금은 삭제해 주시기 바랍니다. ::

    echo $this->Form->control('lft');
    echo $this->Form->control('rght');

그리고 CategoriesTable 모델 의 ``lft`` 및  ``rght`` 열에 validator에서 requirePresence를 비활성화하거나 제거해야합니다. ::

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

이러한 필드는 카테고리를  저장할 때 TreeBehavior에서 자동으로 관리합니다.
웹 브라우저를 사용하여 ``/yoursite/categories/add`` 컨트롤러 작업을 사용하여 몇 가지 새로운 카테고리를 추가합니다.

TreeBehavior 에서 카테고리 순서 바꾸기
=====================================

categories의 index 템플릿에서 categories일람표에서 순서를 바꿀 수 있습니다.

``CategoriesController.php`` index메서드를 수정하고 트리로 카테고리 순서를 바꾸기 위해 ``moveUp()`` 및 ``moveDown()`` 메서드를 추가 합니다. ::

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

``src/Template/Categories/index.ctp`` 를 다음과 같이 작성합니다. ::

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


Articles 컨트롤러 수정
=================================

``ArticlesController`` 에서 모든 카테고리 목록은 얻을 수 있습니다.
기사 작성 혹은 수정할 때 카테고리를 선택할 수 있게 됩니다. ::

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
                // 3.4.0 전에는 $this->request->data() 를 씀
                $article = $this->Articles->patchEntity($article, $this->request->getData());
                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Your article has been saved.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__('Unable to add your article.'));
            }
            $this->set('article', $article);

            // 기사 카테고리를 선택하기 위해 목록을 불러옴
            $categories = $this->Articles->Categories->find('treeList');
            $this->set(compact('categories'));
        }
    }


Articles 템플릿 수정
===============================

기사 추가 파일은 다음과 같이 보일 것입니다.

.. code-block:: php

    <!-- File: src/Template/Articles/add.ctp -->

    <h1>Add Article</h1>
    <?php
    echo $this->Form->create($article);
    // 이곳에 카테고리를 추가
    echo $this->Form->control('category_id');
    echo $this->Form->control('title');
    echo $this->Form->control('body', ['rows' => '3']);
    echo $this->Form->button(__('Save Article'));
    echo $this->Form->end();

`/yoursite/articles/add` 주소로 이동하면 선택할 카테고리 목록이 표시됩니다.

.. meta::
    :title lang=kr: Blog Tutorial Migrations and Tree
    :keywords lang=kr: doc models,migrations,tree,controller actions,model article,php class,model class,model object,business logic,database table,naming convention,bread and butter,callbacks,prefixes,nutshell,interaction,array,cakephp,interface,applications,delete
