ブログチュートリアル - パート3
##############################

ツリーカテゴリーの作成
======================

ブログアプリケーションを進めましょう。投稿記事をカテゴライズすることを想像してください。
順に並べられたカテゴリーが必要で、カテゴリーの作成のために
:doc:`Tree behavior </orm/behaviors/tree>` を使いましょう。

しかしまずはじめに、テーブルを編集する必要があります。

Migrations プラグイン
=====================

データベース内にテーブルを作るのに `migrations プラグイン
<https://github.com/cakephp/migrations>`_ を利用します。
もし articles テーブルが既にデータベースに存在する場合、削除してください。

``composer.json`` ファイルを開いてください。通常の場合、
``require`` の下に既にマイグレーションプラグインが記述されているでしょう。
もし無かったら以下を実行して追加してください。 ::

    composer require cakephp/migrations:~1.0

マイグレーションプラグインはアプリケーションの ``plugins`` フォルダーに存在します。
そして、 アプリケーションの ``bootstrap.php`` ファイルに ``Plugin::load('Migrations');``
を追加してください。

プラグインを読み込んだら、次のコマンドを実行してマイグレーションファイルを作成しましょう。 ::

    bin/cake bake migration CreateArticles title:string body:text category_id:integer created modified

``/config/Migrations`` フォルダーにマイグレーションファイルが以下のように生成されます。 ::

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

``categories`` テーブルも同じようにコマンドを実行して作成してください。
もしフィールドに対して特定の長さを指定する場合、カッコを使って以下のように設定することができます。 ::

    bin/cake bake migration CreateCategories parent_id:integer lft:integer[10] rght:integer[10] name:string[100] description:string created modified

これによって、 ``config/Migrations`` 内に以下が作成されます。 ::

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

ではマイグレーションファイルが作成されたので、テーブルを作成する前にこれを編集しましょう。
``parent_id`` フィールドを ``'null' => false`` を ``'null' => true`` に変更してください。
トップレベルのカテゴリーでは ``parent_id`` は null になるからです。

テーブルを作る際は以下のコマンドを実行してください。 ::

    bin/cake migrations migrate

テーブルの編集
==============

テーブルの設定ができたので、投稿記事のカテゴライズに注力しましょう。

既にパート2でファイル (Articles の Table, Controller および Template) ができあがっているはずです。
カテゴリーへ参照を追記していきましょう。

Articles と Categories テーブルとを結びつける必要があります。
**src/Model/Table/ArticlesTable.php** ファイルを開き、以下のように追加してください。 ::

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

Categories のスケルトンコードを作成する
=======================================

bake コマンドを利用してすべてのファイルを作成しましょう。 ::

    bin/cake bake model Categories
    bin/cake bake controller Categories
    bin/cake bake template Categories

代わりに、1行で bake することもできます。 ::

    bin/cake bake all Categories

bake ツールによって、すぐにすべてのファイルが作成されました。もし CakePHP が
どのように動いているかを知りたかったら簡単に bake ツールを読んでおきましょう。

.. note::
    Windows を利用している場合は / の代わりに \\ を使用してください。

``src/Template/Categories/add.ctp`` および ``src/Template/Categories/edit.ctp``
を以下のように修正してください。 ::

    echo $this->Form->control('parent_id', [
        'options' => $parentCategories,
        'empty' => 'No parent category'
    ]);

TreeBehavior を Categories テーブルに追加
===============================================

データベーステーブルの階層的なツリー構造を管理するのに :doc:`TreeBehavior </orm/behaviors/tree>`
が役に立つでしょう。データ管理の際に `MPTT logic
<http://www.sitepoint.com/hierarchical-data-database-2/>`_ を利用しています。
MPTT ツリー構造は読み込みに最適化されているので、
ときにブログのような読み込みが重いアプリケーションに適しています。

``src/Model/Table/CategoriesTable.php`` ファイルの ``initialize()`` メソッド内で、
TreeBehavior が CategoriesTable と紐づけられていることがお分かりいただけるでしょう。

bake は ``lft`` 列と ``rght`` 列が存在するあらゆるテーブルにこのビヘイビアーを追加します。 ::

    $this->addBehavior('Tree');

紐づけられた TreeBehavior によって、カテゴリーの順を並べ直すような機能にアクセスすることが可能になります。
すぐにわかるでしょう。

しかし今は、カテゴリーの中にある add と edit のテンプレートファイル内の次の control を削除てください。 ::

    echo $this->Form->control('lft');
    echo $this->Form->control('rght');

さらに、Categories テーブルモデルの ``lft`` 列と ``rght`` 列のバリデーターの中の
requirePresense を無効にするか削除してください。 ::

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

カテゴリーが保存される際に、これらのフィールドは TreeBehavior によって自動的に管理されます。

ブラウザーを用いて、 ``/yoursite/categories/add`` コントローラーアクションから
いくつかの新しいカテゴリーを登録してください。

TreeBehavior でカテゴリーを並べ替える
=====================================

categories の index テンプレートファイルでは、categories を一覧したり並べ替えたりすることができます。

``CategoriesController.php`` の index メソッドを編集して、ツリーでカテゴリーを並べ替えるために
``moveUp()`` および ``moveDown()`` メソッドを追加してください。 ::

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

``src/Template/Categories/index.ctp`` を以下のように置き換えてください。 ::

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

Articles コントローラーを編集する
=================================

``ArticlesController`` ではすべてのカテゴリーを一覧できます。
投稿記事を作成あるいは編集するときに、カテゴリーを選ぶことができるようになります。 ::

    // src/Controller/ArticlesController.php

    namespace App\Controller;

    // Prior to 3.6 use Cake\Network\Exception\NotFoundException
    use Cake\Http\Exception\NotFoundException;

    class ArticlesController extends AppController
    {

        // ...

        public function add()
        {
            $article = $this->Articles->newEntity();
            if ($this->request->is('post')) {
                // 3.4.0 より前は $this->request->data() が使われました。
                $article = $this->Articles->patchEntity($article, $this->request->getData());
                if ($this->Articles->save($article)) {
                    $this->Flash->success(__('Your article has been saved.'));
                    return $this->redirect(['action' => 'index']);
                }
                $this->Flash->error(__('Unable to add your article.'));
            }
            $this->set('article', $article);

            // 記事のカテゴリーを１つ選択するためにカテゴリーの一覧を追加
            $categories = $this->Articles->Categories->find('treeList');
            $this->set(compact('categories'));
        }
    }

Articles テンプレートを編集する
===============================

投稿記事の add ファイルは以下のようになっているはずです。

.. code-block:: php

    <!-- File: src/Template/Articles/add.ctp -->

    <h1>Add Article</h1>
    <?php
    echo $this->Form->create($article);
    // ここにカテゴリーのコントロールを追加
    echo $this->Form->control('category_id');
    echo $this->Form->control('title');
    echo $this->Form->control('body', ['rows' => '3']);
    echo $this->Form->button(__('Save Article'));
    echo $this->Form->end();

`/yoursite/categories/add` のアドレスに行くと、カテゴリーを選ぶための一覧を見れるでしょう。

.. meta::
    :title lang=ja: Blog Tutorial Migrations and Tree
    :keywords lang=ja: doc models,migrations,tree,controller actions,model article,php class,model class,model object,business logic,database table,naming convention,bread and butter,callbacks,prefixes,nutshell,interaction,array,cakephp,interface,applications,delete
