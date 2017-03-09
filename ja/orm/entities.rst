エンティティ
##############

.. php:namespace:: Cake\ORM

.. php:class:: Entity

:doc:`/orm/table-objects` がオブジェクトのコレクションへのアクセスを表し、提供するのに対し、
エンティティは個々の行やドメインオブジェクトを表します。エンティティは保持するデータにアクセスして
操作するための永続的なプロパティとメソッドを保有しています。

CakePHP でテーブルオブジェクトの ``find()`` を使うたびにエンティティが作られます。

エンティティクラスの生成
==========================

CakePHP の ORM を使うためにエンティティクラスを生成する必要はありません。
しかし、使用するエンティティでロジックをカスタマイズしたいなら、クラスを作る必要があります。
慣例通りなら **src/Model/Entity/** にクラスが存在しています。
もし、 ``articles`` テーブルが存在するなら、以下のエンティティが作れます。 ::

    // src/Model/Entity/Article.php
    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
    }

今のところ、このエンティティは何も出来ません。とはいえ、データを article テーブルからロードすれば、
このクラスのインスタンスを得られます。

.. note::

    もし、エンティティクラスが定義されていないなら、CakePHP はデフォルトのエンティティクラスを使います。

エンティティ生成
==================

直接、エンティティのインスタンスを生成できます。 ::

    use App\Model\Entity\Article;

    $article = new Article();

エンティティからインスタンスを生成する時、インスタンスに必要なプロパティを渡すことができます。 ::

    use App\Model\Entity\Article;

    $article = new Article([
        'id' => 1,
        'title' => 'New Article',
        'created' => new DateTime('now')
    ]);

エンティティを生成するもう一つの方法は、 ``Table`` オブジェクトの ``newEntity()`` メソッドです。
::

    use Cake\ORM\TableRegistry;

    $article = TableRegistry::get('Articles')->newEntity();
    $article = TableRegistry::get('Articles')->newEntity([
        'id' => 1,
        'title' => 'New Article',
        'created' => new DateTime('now')
    ]);

エンティティのデータへのアクセス
==================================

エンティティは保有するデータにアクセスするいくつかの方法を提供します。
最も一般的なのは、オブジェクトの表記を使ってエンティティ内のデータにアクセスすることです。 ::

    use App\Model\Entity\Article;

    $article = new Article;
    $article->title = 'This is my first post';
    echo $article->title;

また、 ``get()`` と ``set()`` メソッドも使えます。 ::

    $article->set('title', 'This is my first post');
    echo $article->get('title');

``set()`` を使う時、一つの配列で複数のプロパティを一度に更新できます。 ::

    $article->set([
        'title' => 'My first post',
        'body' => 'It is the best ever!'
    ]);

.. warning::

    エンティティをリクエストデータでアップデートするときには、一度の代入でどのフィールドに
    セットできるかホワイトリストで制限するべきです。

アクセサーとミューテーター
==========================

シンプルな get/set インターフェイスに加えて、エンティティは
アクセサーメソッドとミューテーターメソッドを提供できるようになっています。
これらのメソッドは、プロパティがどうやってセットされたり、読まれたりするかを
カスタマイズするために使えます。

アクセサーは ``_get`` + フィールド名のキャメルケースという命名ルールを使います。

.. php:method:: get($field)

このメソッドは唯一の引数として ``_properties`` 配列内にある基本の値を受け取ります。
アクセサーはエンティティを保存する際に使われますので、データをフォーマットするメソッド
を定義する場合は注意が必要です。データはフォーマットされた状態で保存されることになります。
例えば、 ::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected function _getTitle($title)
        {
            return ucwords($title);
        }
    }

アクセサーは以下の２つの方法でプロパティを取得する際に実行されます。 ::

    echo $user->title;
    echo $user->get('title');

ミューテーターを定義することによって、プロパティの設定方法をカスタマイズできます。

.. php:method:: set($field = null, $value = null)

ミューテーターは常にプロパティに保存すべき値を返すようにしてください。
上の例のように、ミューテーターを使って他の計算されたプロパティを設定することもできます。
これをする際に、呼び出しがループしてしまわないように注意して下さい。CakePHP はミューテーターの
無限ループを防ぐことが出来ません。

ミューテーターによりセットされるプロパティを変換したり、
計算されたデータを作成したりすることができるようになります。ミューテーターとアクセサーは
オブジェクト表記や、 ``get()`` や ``set()`` を使ってプロパティが読まれた場合に適用されます。
例えば::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use Cake\Utility\Text;

    class Article extends Entity
    {

        protected function _setTitle($title)
        {
            $this->set('slug', Text::slug($title));
            return $title;
        }

    }

ミューテーターは、以下の２つの方法でプロパティを設定するときに実行されます。 ::

    $user->title = 'foo'; // 同時に slug が設定されます。
    $user->set('title', 'foo'); // 同時に slug が設定されます。

.. _entities-virtual-properties:

仮想プロパティの生成
-----------------------

アクセサーを定義することによって、現在存在しないフィールド・プロパティへのアクセスを提供できます。
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

仮想プロパティは、エンティティに存在するかのようにアクセスできます。
プロパティ名は小文字と ”_” を使ってメソッド名を表記します。 ::

    echo $user->full_name;

仮想プロパティは find で使えないということを覚えておいてください。
もし、仮想プロパティを、エンティティを表す JSON や配列の一部にしたい場合、
:ref:`exposing-virtual-properties` をご覧ください。


エンティティが変更されたかチェックする
========================================

.. php:method:: dirty($field = null, $dirty = null)

エンティティのプロパティが変更されたかどうかに応じるコードを
作りたいと思うことがあるかもしれません。例えば、フィールドが変更された時にだけ
バリデートしたい場合です。::

    // タイトルが変更された時に、.
    $article->dirty('title');

フィールドに変更されたという印をつける事もできます。これは配列のプロパティに追加した場合に便利です。 ::

    // コメントを追加して、フィールドが変更されたと印をつけます。
    $article->comments[] = $newComment;
    $article->dirty('comments', true);

加えて、 ``getOriginal()`` メソッドを使うことで元のプロパティ値に応じたコードを書くこともできます。
このメソッドは値が変更されているなら元の値を返し、そうでなければ実際の値を返します。

また、エンティティ内のプロパティのいずれかが変化したかをチェックすることもできます。 ::

    // エンティティが変更されたか確かめる
    $article->dirty();

``clean()`` メソッドで不必要な印をエンティティのフィールドから除去できます。 ::

    $article->clean();

オプションを追加で渡すことで、フィールドに印が付くのを避けることができます。 ::

    $article = new Article(['title' => 'New Article'], ['markClean' => true]);

``Entity`` の全ての変更されたプロパティの一覧を取得するには、次のように呼ぶことができます。 ::

    $dirtyFields = $entity->getDirty();

.. versionadded:: 3.4.3

    ``getDirty()`` が追加されました。

バリデーションエラー
====================

.. php:method:: errors($field = null, $errors = null)

:ref:`エンティティの保存 <saving-entities>` がされた後、どんなバリデーションエラーも
エンティティ自身に保存されます。バリデーションエラーには ``errors()`` メソッドを使って
アクセスできます。 ::

    // エラーの取得
    $errors = $user->errors();

    // １つのフィールドのエラーを取得
    $errors = $user->errors('password');

``errors()`` はまたエンティティにエラーをセットするために使うこともできます。
これにより、エラーメッセージで動くコードのテストが簡単になります。 ::

    $user->errors('password', ['Password is required.']);

.. _entities-mass-assignment:

一括代入 (*Mass Assignment*)
===========================================

一括でエンティティのプロパティを設定するのは単純で便利ですが、
これには重大なセキュリティ問題が伴います。
リクエストからユーザデータをエンティティへと一括代入してしまうと、
ユーザーはどの列でも変更できるようになってしまいます。
匿名のエンティティクラスを使ったり、 :doc:`/bake` でエンティティを生成すると、
CakePHP は一括代入から保護しません。

``_accessible`` プロパティにより、プロパティと一括代入できるかどうかのマップを提供できるようになります。
``true`` と ``false`` の値はそれぞれ、その列が一括代入できるか、できないかを示しています。 ::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected $_accessible = [
            'title' => true,
            'body' => true,
        ];
    }

具体的なフィールドに加え、名前が指定されなかった場合の受け皿となる ``*`` という特別なフィールドが
存在します。 ::

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

.. note:: ``*`` プロパティが定義されない場合、デフォルトは ``false`` になります。

一括代入に対する保護の回避
------------------------------------

新しいエンティティを ``new`` キーワードで作成する際、一括代入に対して保護しないように指示できます。 ::

    use App\Model\Entity\Article;

    $article = new Article(['id' => 1, 'title' => 'Foo'], ['guard' => false]);

保護されたフィールドを実行時に変更する
----------------------------------------

``accessible`` メソッドを使うことで保護されたフィールドのリストを実行時に変更できます。 ::

    // user_id にアクセスできるようにする
    $article->accessible('user_id', true);

    // title を保護する。
    $article->accessible('title', false);

.. note::

    フィールドがアクセス可能かの変更は、そのメソッドを呼んだインスタンスのみに影響します。

``Table`` オブジェクトの ``newEntity()`` と ``patchEntity()`` を使う際、
オプションを使って一括代入からの保護をカスタマイズできます。
:ref:`changing-accessible-fields` に詳細があります。

フィールドに対する保護を受け渡す
------------------------------------

保護されたフィールドに対して一括代入を許可したい状況もあるでしょう。 ::

    $article->set($properties, ['guard' => false]);

``guard`` オプションを ``false`` にすることで、今回の ``set()`` の呼び出しに限り、
アクセス可能なフィールドリストを無視することが出来ます。

エンティティが永続化されているかチェックする
-----------------------------------------------

エンティティが示す行がデータベース上に既に存在しているかを知らなければならないことは良くあることです。
こういった場合は ``isNew()`` メソッドを使って下さい。 ::

    if (!$article->isNew()) {
        echo '既に保存されました!';
    }

既にエンティティが永続化されているかどうかが解っているなら
``isNew()`` をセッターとして使えます。 ::

    $article->isNew(false);

    $article->isNew(true);

.. _lazy-load-associations:

アソシエーションの Lazy ローディング
====================================

アソシエーションの eager ローディングは大抵の場合において最も有効なアクセス法ではありますが、
アソシエーションデータを lazy ロードしたいときもあるかもしれません。
この方法を見ていく前に、 eager ローディングと lazy ローディングの違いを見てみましょう:

Eager ローディング
    できるだけ *少ない* クエリでDBから情報を取得できるようにJOINを（可能なときは）使います。
    HasMany アソシエーションを使うような分割したクエリが必要なときは、1つのクエリで、
    現在のオブジェクト一式に必要な *全て* の関連データを取ってこようとします。
Lazy ローディング
    絶対に必要になるまでアソシエーションのロードを遅延させます。
    これにより、不要なデータがオブジェクト化されないので CPU 時間を節約できますが、
    大量のクエリがDBに送られることになるかもしれません。
    例えば、 複数の記事 (articles) とそれに属するコメント (comments) を舐めるループでは、
    イテレートされた記事の数だけクエリが何度も送られることになります。

CakePHP の ORM には lazy ローディングは含まれませんが、実現するためにコミュニティプラグインの
１つを使うことができます。私たちは `LazyLoad プラグイン
<https://github.com/jeremyharris/cakephp-lazyload>`__ をお勧めします。

あなたのエンティティにプラグインを追加した後、以下のようにできます。 ::

    $article = $this->Articles->findById($id);

    // comments プロパティは lazy ロードされます。
    foreach ($article->comments as $comment) {
        echo $comment->body;
    }

トレイトを使った再利用可能なコードの生成
========================================

いくつかのエンティティクラスで同じロジックを使わなければならないことに気づくことがあるでしょう。
PHP のトレイトはこういった場合に威力を発揮します。 **src/Model/Entity** に自作のトレイトを
置くことができます。慣習的に CakePHP のトレイトは末尾に ``Trait`` が付いていますので、
クラスやインターフェイスでないことが判るようになっています。トレイトは振る舞いを補完するもので、
これを使うことで、テーブルオブジェクトやエンティティオブジェクトに機能を提供できるようになっています。

例えば、 SoftDeletable プラグインを使っていたとして、これがトレイトを提供します。
このトレイトは、エンティティに 'deleted' マークを付けるためのメソッドを提供します。
``softDelete`` メソッドがトレイトにより提供されるのです。 ::

    // SoftDelete/Model/Entity/SoftDeleteTrait.php

    namespace SoftDelete\Model\Entity;

    trait SoftDeleteTrait
    {

        public function softDelete()
        {
            $this->set('deleted', true);
        }

    }

そして、このトレイトをインポートし、インクルードすることで、独自のエンティティクラスで使えます。 ::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use SoftDelete\Model\Entity\SoftDeleteTrait;

    class Article extends Entity
    {
        use SoftDeleteTrait;
    }

配列や JSON への変換
====================

API を作る時、しばしば、エンティティを配列や JSON に変換する必要があるでしょう。
CakePHP では以下のように簡単にできます。 ::

    // 配列を取得します。
    // アソシエーションも toArray() で変換されます。
    $array = $user->toArray();

    // JSON に変換します。
    // アソシエーションも jsonSerialize フックで変換されます。
    $json = json_encode($user);

エンティティを JSON へと変換する際に、仮想 (virtual) フィールドや隠し (hidden) フィールドの
リストが適用されます。エンティティは再帰的に JSON へと変換されます。これは、エンティティと
アソシエーションを eager ロードする場合、CakePHP は関連データを正しいフォーマットへと
正しく変換できることを意味します。

.. _exposing-virtual-properties:

仮想プロパティが含まれるようにする
----------------------------------------

配列や JSON に変換した際、仮想フィールドはデフォルトでは含まれません。
仮想プロパティが含まれるようにするためには、そのように指定する必要があります。
エンティティクラスを定義する際に、含まれるべき仮想プロパティのリストを提供できます。 ::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {

        protected $_virtual = ['full_name'];

    }

実行時に ``virtualProperties`` を使うことでこのリストを変更できます。 ::

    $user->virtualProperties(['full_name', 'is_admin']);

プロパティを隠す
------------------

JSON/配列フォーマットで出力したくないフィールドがある場合があります。例えば、
パスワードや ”秘密の質問” などです。エンティティクラスを定義する際、
どのプロパティを隠すか設定できます。 ::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {

        protected $_hidden = ['password'];

    }

実行時に ``hiddenProperties`` を使うことでこのリストを変更できます。 ::

    $user->hiddenProperties(['password', 'recovery_question']);

複合型の保存
====================

DB の複合型のデータをシリアライズ/デシリアライズするためのロジックが
エンティティのアクセサーとミューテーターに含まれることは想定されていません。
配列型やオブジェクト型のような複合的なデータ型をどうやって保存するのかを理解するには
:ref:`saving-complex-types` を参照して下さい。

.. meta::
    :title lang=en: Entities
    :keywords lang=en: entity, entities, single row, individual record
    :title lang=ja: エンティティ
    :keywords lang=ja: エンティティ, 個別, レコード
