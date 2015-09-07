エンティティー
##############

.. php:namespace:: Cake\ORM

.. php:class:: Entity

:doc:`/orm/table-objects` がオブジェクトのコレクションへのアクセスを表し提供する時に、
エンティティーがアプリの各行やドメインオブジェクトを表します。
エンティティーはそれらのデータにアクセスして操作するための継続的なプロパティーとメソッドを含みます。

エンティティーは CakePHP によって ``find()`` を使った時に毎回テーブルオブジェクトに作られます。

エンティティークラスの生成
==========================

CakePHP の ORM を使うためにエンティティークラスを生成する必要はありません。
でも、使用するエンティティでロジックをカスタマイズしたいなら、クラスを作る必要があります。
規約に従うと **src/Model/Entity/** にクラスが存在するはずです。
もし、 ``articles`` テーブルが存在するなら、以下のエンティティーが作れます。 ::

    // src/Model/Entity/Article.php
    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
    }

いま、このエンティティーは何も出来ません。でも、データを article テーブルからロードして、
このクラスのインスタンスを作れます。

.. note::

    もし、エンティティクラスを定義したくないなら、CakePHP はデフォルトのエンティティークラスを使います。

エンティティー生成
==================

エンティティーは直接インスタンスを生成できます。 ::

    use App\Model\Entity\Article;

    $article = new Article();

エンティティーからインスタンスを生成する時、インスタンスに必要なプロパティーを渡すことができます。 ::

    use App\Model\Entity\Article;

    $article = new Article([
        'id' => 1,
        'title' => 'New Article',
        'created' => new DateTime('now')
    ]);

エンティティーを生成する別の方法は、 ``Table`` オブジェクトの ``newEntity()`` メソッドです。
::

    use Cake\ORM\TableRegistry;

    $article = TableRegistry::get('Articles')->newEntity();
    $article = TableRegistry::get('Articles')->newEntity([
        'id' => 1,
        'title' => 'New Article',
        'created' => new DateTime('now')
    ]);

エンティティーのデータへのアクセス
==================================

エンティティーはいくつかのそれらに含まれるデータに接続するための提供します。
最も一般的なのは、オブジェクトの表記法を使ってエンティティー内のデータにアクセスすることです。 ::

    use App\Model\Entity\Article;

    $article = new Article;
    $article->title = 'This is my first post';
    echo $article->title;

また、 ``get()`` と ``set()`` メソッドも使えます。 ::

    $article->set('title', 'This is my first post');
    echo $article->get('title');

``set()`` を使う時、一つの配列で複数のプロパティーを一度に更新できます。 ::

    $article->set([
        'title' => 'My first post',
        'body' => 'It is the best ever!'
    ]);

.. warning::

    エンティティーをリクエストデータでアップデートするときには、一度の代入でどのフィールドに
    セットできるかホワイトリストで制限するべきです。

アクセサーとミューテーター
==========================

.. php:method:: set($field = null, $value = null)

加えて、シンプルな get/set インターフェイスのためには、エンティティーは
アクセサーとミューテーターメソッドを提供することを許可します。
これらのメソッドは、プロパティーがどうやってセットされたり、読まれたりするかを
カスタマイズするために使えます。例えば、 ::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected function _getTitle($title)
        {
            return ucwords($title);
        }
    }

アクセサーは ``_get`` の命名規則のに従います。フィールド名のキャメルケースバージョンです。
それらは ``_properties`` にある基本的な値を引数としてのみ受け取ります。
アクセサーはエンティティーを保存する時に使われます。なので、データをフォーマットするメソッド
を定義する時には気をつけましょう。プロパティーがどのように定義したミューテーターがセットした
情報を取得するかカスタマイズできます。 ::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use Cake\Utility\Inflector;

    class Article extends Entity
    {

        protected function _setTitle($title)
        {
            $this->set('slug', Inflector::slug($title));
            return $title;
        }

    }

ミューテーターは常にプロパティーに保存された変数を返すようにすべきです。
また、上で見たように、ミューテーターを他のプロパティーを設定するために使えます。
これをする時に、一切のループに突入しないように注意して下さい。CakePHP はミューテーターの
無限ループを検出して防ぐことが出来ません。ミューテーターは簡単にプロパティーを
計算されたデータによって変換することを許可します。ミューテーターとアクセサーは
プロパティーが、使用中のオブジェクト表記や get() と set() を使って読まれた時に適用されます。


.. _entities-virtual-properties:

仮想プロパティーの生成
-----------------------

アクセサーを定義することによって、現在存在しないプロパティへのアクセスを提供できます。
例えば、users テーブルが ``first_name`` と ``last_name`` 列を持っていたとして、
フルネームのためのメソッドを作れるということです。 ::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {

        protected function _getFullName()
        {
            return $this->_properties['first_name'] . '  ' .
                $this->_properties['last_name'];
        }

    }

エンティティーに存在するように仮想プロパティーにアクセスできます。
プロパティー名は小文字と ”_”　を使ってメソッド名を置き換えて表記します。 ::

    echo $user->full_name;

仮想プロパティーは一見 find 内で使えないように思われます。


エンティティーが変更されたかチェックする
========================================

.. php:method:: dirty($field = null, $dirty = null)

エンティティー内でプロパティーが変更されてもされなくても、
コードを規約に沿ったものに保ちたいでしょう。例えば、フィールドが変更された時にだけ
バリデートしたい時に、 ::

    // タイトルが変更された時に、.
    $article->dirty('title');

フィールドに変更されたという印をつける事ができます。これはプロパティー配列に追加された時に便利です。 ::

    // コメントを追加して、変更されたフィールドに印をつけます。
    $article->comments[] = $newComment;
    $article->dirty('comments', true);

加えて、 ``getOriginal()`` を使ったオリジナルプロパティーの変数を元にした整ったコードを書けます。
このメソッドは実際の値をいじっても、常にオリジナルの値を返してくれます。

このエンティティーで全てのプロパティーの変化をチェックできます。 ::

    // エンティティーが変更されたか確かめる
    $article->dirty();

``clean()`` メソッドで不必要な印をエンティティーのフィールドから除去できます。 ::

    $article->clean();

新しいエンティティーを作る時、他のオプションを渡すことによって、汚くマークされたフィールドを避ける事が出来ます。 ::

    $article = new Article(['title' => 'New Article'], ['markClean' => true]);

バリデーションエラー
====================

.. php:method:: errors($field = null, $errors = null)

:ref:`エンティティーの保存 <saving-entities>` がされた後、全てのバリデーションエラーは
エンティティーそのものに保存されます。全てのバリデーションエラーに ``errors()`` メソッドを使って
アクセスできます。 ::

    // エラーの取得
    $errors = $user->errors();

    // １つのフィールドのエラーを取得
    $errors = $user->errors('password');

``errors()`` はまたエンティティーにエラーをセットするために使われます。
それは、エラーメッセージで動くコードをテストする時に使います。 ::

    $user->errors('password', ['Password is required.']);

.. _entities-mass-assignment:

マスアサインメント (*Mass Assignment*)
=======================================

一度に沢山のプロパティーーを設定するのは簡単で便利です。
そして、これは重大なセキュリティー問題が伴います。
リクエストから沢山のユーザーデータをエンティティーに代入することは、
ユーザーが全ての列を操作できるように許可することです。
anonymous エンティティークラスを使ったり、 :doc:`/bake` でエンティティーを生成すると
CakePHP はマスアサインメントからの影響を保護しません。

``_accessible`` プロパティーはマスアサインメントかどうかにかかわらずプロパティーのマップを提供することを許可します。
``true`` と ``false`` でマスアサインメントできるかどうかを示します。 ::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected $_accessible = [
            'title' => true,
            'body' => true,
        ];
    }

加えて、フィールドを具体化するために ``*`` という命名されていないフォールバックビヘイビアを定義する
特殊フィールド があります。 ::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected $_accessible = [
            'title' => true,
            'body' => true,
            '*' => false,
        ];
    }

``*`` プロパティーが定義されていない場合、 ``false`` と設定されます。

マスアサインメントに対する保護の回避
------------------------------------

新しいエンティティーを ``new`` する時、マスアサインメントに対して保護しないように設定できます。 ::

    use App\Model\Entity\Article;

    $article = new Article(['id' => 1, 'title' => 'Foo'], ['guard' => false]);

動的に保護されたフィールドを編集する
------------------------------------

``accessible`` メソッドで保護されたフィールドのリストを編集できます。 ::

    // user_id にアクセスできるようにする
    $article->accessible('user_id', true);

    // title を保護する。
    $article->accessible('title', false);

.. note::

    アクセス可能なフィールドへの編集はメソッドが呼んでいるインスタンスのみに影響する。

``newEntity()`` と ``patchEntity()`` を ``Table`` オブジェクトで使う時、 マスアサインメントからの保護を
カスタマイズして使えます。 :ref:`changing-accessible-fields` に詳細があります。

フィールドに対する保護をバイパスする
------------------------------------

マスアサインメントが保護されたフィールドへのアクセスすることを許可する必要に迫られる時があるでしょう::

    $article->set($properties, ['guard' => false]);

``guard`` オプションを ``false`` にすることで、 ``set()`` を呼ぶためのアクセス可能なフィールドリストを無視することが出来ます。 

エンティティーが存続しているかチェックする
------------------------------------------

データベスに既に存在する行をエンティティーが表しているのか知る必要がある時があります。
``isNew()`` でそれが分かります。 ::

    if (!$article->isNew()) {
        echo '既に保存されました!';
    }

既にエンティティーが存続していることが分かっているときは
``isNew()`` をセッターとして使えます。 ::

    $article->isNew(false);

    $article->isNew(true);

.. _lazy-load-associations:

アソシエーションの Lazy ローディング
====================================

アソシエーションの eager ローディングは一般的に大雑把に関連データを読み込む時に
最も有効なアソシエーションへのアクセス法です。
この方法を知る前に、 eager ローディングと lazy ローディングの違いを見てみましょう。:

Eager ローディング
    できるだけ *少ない* クエリでDBから情報を取得できるようにJOINを（可能なときは）使います。 
    HasMany アソシエーションを使うような分割したクエリが必要なときは、1つのクエリで *全部* の
    現在のオブジェクトのセットとの関連データが取ってこられるようにします。
Lazy ローディング
    ロードを必要な時まで遅延させます。
    不必要なデータがオブジェクトに吸い上げられるのを防ぐことで処理を減らします。でも、沢山のクエリがDBに送られる可能性がありま
    例えば、 複数の articles と それに属する複数の comments　でループしている時に
    article の数のクエリが打たれます。

CakePHP の ORM に lazy ローディングが含まれていない時、必要な時にこれを操作することは難しくないです。
アクセサメソッドを使っている時には、関連データを lazily ローディング出来ます。 ::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use Cake\ORM\TableRegistry;

    class Article extends Entity
    {

        protected function _getComments()
        {
            $comments = TableRegistry::get('Comments');
            return $comments->find('all')
                ->where(['article_id' => $this->id])
                ->toArray();
        }

    }

上記のメソッドを使うことで、以下のことができるようになります。 ::

    $article = $this->Articles->findById($id);
    foreach ($article->comments as $comment) {
        echo $comment->body;
    }

トレイトを使った再利用可能なコードの生成
========================================

いくつかのエンティティークラスで同じロジックを使っていることがあります。
PHP のトレイトはこの時に威力を発揮します。 **src/Model/Entity** にトレイトを置けます。
命名規則に沿ったトレイトは ``Trait`` によってサフィックス（を個別の名前に加える）されます。
インターフェイスやクラスから、簡単に呼ぶことが出来ます。
トレイトはビヘイビアにテーブルとエンティティーオブジェクトを機能的に上手に提供することが出来ます。

例えば、 SoftDeletable プラグインを使っていたとして、それはトレイトを生成できます。
このトレイトは.  'deleted' とエンティティーをマークするための、トレイトによって生成された
``softDelete`` メソッドを提供できます。 ::

    // SoftDelete/Model/Entity/SoftDeleteTrait.php

    namespace SoftDelete\Model\Entity;

    trait SoftDeleteTrait {

        public function softDelete()
        {
            $this->set('deleted', true);
        }

    }

エンティティークラスにインポートするかインクルードしたトレイトを使えます。 ::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use SoftDelete\Model\Entity\SoftDeleteTrait;

    class Article extends Entity
    {
        use SoftDeleteTrait;
    }

配列や JSON への変換
====================

API を作る時、しばしば、エンティティーを配列や JSON に変換する必要があるでしょう。
CakePHP では以下のように簡単にできます。 ::

    // Get an array.
    $array = $user->toArray();

    // Convert to JSON
    $json = json_encode($user);

配列や JSON に変換する時に、仮想または、 hidden フィールドリストに適用されます。

エンティティは一気に変換されます。この意味は、 eager ローディングされたエンティティーとアソシエーションは
CakePHP が正しくフォーマットに関連付けられたデータをして変換してくれるということです。

仮想プロパティーの出力
-----------------------

デフォルトの仮想プロパティーでは配列や JSON に変換した時にエクスポートされません。
仮想プロパティーを出力するためには見える形にしなきゃいけません。
エンティティークラスを定義する時に、出力されるべき仮想プロパティーのリストを提供できます。 ::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {

        protected $_virtual = ['full_name'];

    }

このリストは、実行時に ``virtualProperties`` で編集できます。 ::

    $user->virtualProperties(['full_name', 'is_admin']);

プロパティーを隠す
------------------

JSON/配列フォーマットで出力したくないフィールドがある場合があります。例えば、
パスワードとか”秘密の質問”とかです。エンティティークラスを定義する時、どのプロパティーを隠すか設定できます。 ::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {

        protected $_hidden = ['password'];

    }

このリストは、実行時に ``hiddenProperties`` で編集できます。 ::

    $user->hiddenProperties(['password', 'recovery_question']);

複数のタイプをソート
====================

エンティティーのアクセサーとミューテーターはデータベースから来た複雑なデータをシリアライズ
またはデシリアライズするロジックを含むように想定されていません。 :ref:`saving-complex-types` を
複雑なデータタイプをどうやって配列やオブジェクトのように保存するのかを理解するために参照して下さい。

.. meta::
    :title lang=ja: エンティティー
    :keywords lang=ja: エンティティー, 個別, レコード
