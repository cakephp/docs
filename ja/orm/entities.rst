エンティティー
##############

.. php:namespace:: Cake\ORM

.. php:class:: Entity

:doc:`/orm/table-objects` がオブジェクトのコレクションへのアクセスを表し、提供するのに対し、
エンティティーは個々の行やドメインオブジェクトを表します。エンティティーは保持するデータにアクセスして
操作するための永続的なプロパティーとメソッドを保有しています。

CakePHP でテーブルオブジェクトの ``find()`` を使うたびにエンティティーが作られます。

エンティティークラスの生成
==========================

CakePHP の ORM を使うためにエンティティークラスを生成する必要はありません。
しかし、使用するエンティティーでロジックをカスタマイズしたいなら、クラスを作る必要があります。
慣例通りなら **src/Model/Entity/** にクラスが存在しています。
もし、 ``articles`` テーブルが存在するなら、以下のエンティティーが作れます。 ::

    // src/Model/Entity/Article.php
    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
    }

今のところ、このエンティティーは何も出来ません。とはいえ、データを article テーブルからロードすれば、
このクラスのインスタンスを得られます。

.. note::

    もし、エンティティークラスが定義されていないなら、CakePHP はデフォルトのエンティティークラスを使います。

エンティティー生成
==================

直接、エンティティーのインスタンスを生成できます。 ::

    use App\Model\Entity\Article;

    $article = new Article();

エンティティーからインスタンスを生成する時、インスタンスに必要なプロパティーを渡すことができます。 ::

    use App\Model\Entity\Article;

    $article = new Article([
        'id' => 1,
        'title' => 'New Article',
        'created' => new DateTime('now')
    ]);

エンティティーを生成するもう一つの方法は、 ``Table`` オブジェクトの ``newEntity()`` メソッドです。
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

エンティティーは保有するデータにアクセスするいくつかの方法を提供します。
最も一般的なのは、オブジェクトの表記を使ってエンティティー内のデータにアクセスすることです。 ::

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

シンプルな get/set インターフェイスに加えて、エンティティーは
アクセサーメソッドとミューテーターメソッドを提供できるようになっています。
これらのメソッドは、プロパティーがどうやってセットされたり、読まれたりするかを
カスタマイズするために使えます。

アクセサーは ``_get`` + フィールド名のキャメルケースという命名ルールを使います。

.. php:method:: get($field)

このメソッドは唯一の引数として ``_properties`` 配列内にある基本の値を受け取ります。
アクセサーはエンティティーを保存する際に使われますので、データをフォーマットするメソッド
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

アクセサーは以下の２つの方法でプロパティーを取得する際に実行されます。 ::

    echo $user->title;
    echo $user->get('title');

ミューテーターを定義することによって、プロパティーの設定方法をカスタマイズできます。

.. php:method:: set($field = null, $value = null)

ミューテーターは常にプロパティーに保存すべき値を返すようにしてください。
上の例のように、ミューテーターを使って他の計算されたプロパティーを設定することもできます。
これをする際に、呼び出しがループしてしまわないように注意して下さい。CakePHP はミューテーターの
無限ループを防ぐことが出来ません。

ミューテーターによりセットされるプロパティーを変換したり、
計算されたデータを作成したりすることができるようになります。ミューテーターとアクセサーは
オブジェクト表記や、 ``get()`` や ``set()`` を使ってプロパティーが読まれた場合に適用されます。
例えば::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use Cake\Utility\Text;

    class Article extends Entity
    {

        protected function _setTitle($title)
        {
            return Text::slug($title);
        }

    }

ミューテーターは、以下の２つの方法でプロパティーを設定するときに実行されます。 ::

    $user->title = 'foo'; // 同時に slug が設定されます。
    $user->set('title', 'foo'); // 同時に slug が設定されます。

.. _entities-virtual-properties:

仮想プロパティーの生成
-----------------------

アクセサーを定義することによって、現在存在しないフィールド・プロパティーへのアクセスを提供できます。
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

仮想プロパティーは、エンティティーに存在するかのようにアクセスできます。
プロパティー名は小文字と ”_” を使ってメソッド名を表記します。 ::

    echo $user->full_name;

仮想プロパティーは find で使えないということを覚えておいてください。
もし、仮想プロパティーを、エンティティーを表す JSON や配列の一部にしたい場合、
:ref:`exposing-virtual-properties` をご覧ください。


エンティティーが変更されたかチェックする
========================================

.. php:method:: dirty($field = null, $dirty = null)

エンティティーのプロパティーが変更されたかどうかに応じるコードを
作りたいと思うことがあるかもしれません。例えば、フィールドが変更された時にだけ
バリデートしたい場合です。::

    // タイトルが変更された時に、.
    $article->dirty('title');

フィールドに変更されたという印をつける事もできます。これは配列のプロパティーに追加した場合に便利です。 ::

    // コメントを追加して、フィールドが変更されたと印をつけます。
    $article->comments[] = $newComment;
    $article->dirty('comments', true);

加えて、 ``getOriginal()`` メソッドを使うことで元のプロパティー値に応じたコードを書くこともできます。
このメソッドは値が変更されているなら元の値を返し、そうでなければ実際の値を返します。

また、エンティティー内のプロパティーのいずれかが変化したかをチェックすることもできます。 ::

    // エンティティーが変更されたか確かめる
    $article->dirty();

``clean()`` メソッドで不必要な印をエンティティーのフィールドから除去できます。 ::

    $article->clean();

オプションを追加で渡すことで、フィールドに印が付くのを避けることができます。 ::

    $article = new Article(['title' => 'New Article'], ['markClean' => true]);

``Entity`` の全ての変更されたプロパティーの一覧を取得するには、次のように呼ぶことができます。 ::

    $dirtyFields = $entity->getDirty();

.. versionadded:: 3.4.3

    ``getDirty()`` が追加されました。

バリデーションエラー
====================

.. php:method:: errors($field = null, $errors = null)

:ref:`エンティティーの保存 <saving-entities>` がされた後、どんなバリデーションエラーも
エンティティー自身に保存されます。バリデーションエラーには ``getErrors()`` や
``getError()`` メソッドを使ってアクセスできます。 ::

    // エラーの取得
    $errors = $user->getErrors();
    // 3.4.0 より前
    $errors = $user->errors();

    // １つのフィールドのエラーを取得
    $errors = $user->getError('password');
    // 3.4.0 より前
    $errors = $user->errors('password');

``setErrors()`` や ``setError()`` はまたエンティティーにエラーをセットするために使うこともできます。
これにより、エラーメッセージで動くコードのテストが簡単になります。 ::

    $user->setError('password', ['Password is required']);
    $user->setErrors(['password' => ['Password is required'], 'username' => ['Username is required']]);
    // 3.4.0 より前
    $user->errors('password', ['Password is required.']);

.. _entities-mass-assignment:

一括代入 (*Mass Assignment*)
===========================================

一括でエンティティーのプロパティーを設定するのは単純で便利ですが、
これには重大なセキュリティ問題が伴います。
リクエストからユーザーデータをエンティティーへと一括代入してしまうと、
ユーザーはどの列でも変更できるようになってしまいます。
匿名のエンティティークラスを使ったり、 :doc:`/bake` でエンティティーを生成すると、
CakePHP は一括代入から保護しません。

``_accessible`` プロパティーにより、プロパティーと一括代入できるかどうかのマップを提供できるようになります。
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

.. note:: ``*`` プロパティーが定義されない場合、デフォルトは ``false`` になります。

一括代入に対する保護の回避
------------------------------------

新しいエンティティーを ``new`` キーワードで作成する際、一括代入に対して保護しないように指示できます。 ::

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

エンティティーが永続化されているかチェックする
-----------------------------------------------

エンティティーが示す行がデータベース上に既に存在しているかを知らなければならないことは良くあることです。
こういった場合は ``isNew()`` メソッドを使って下さい。 ::

    if (!$article->isNew()) {
        echo '既に保存されました!';
    }

既にエンティティーが永続化されているかどうかが解っているなら
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
    できるだけ *少ない* クエリーでDBから情報を取得できるようにJOINを（可能なときは）使います。
    HasMany アソシエーションを使うような分割したクエリーが必要なときは、1つのクエリーで、
    現在のオブジェクト一式に必要な *全て* の関連データを取ってこようとします。
Lazy ローディング
    絶対に必要になるまでアソシエーションのロードを遅延させます。
    これにより、不要なデータがオブジェクト化されないので CPU 時間を節約できますが、
    大量のクエリーがDBに送られることになるかもしれません。
    例えば、 複数の記事 (articles) とそれに属するコメント (comments) を舐めるループでは、
    イテレートされた記事の数だけクエリーが何度も送られることになります。

CakePHP の ORM には lazy ローディングは含まれませんが、実現するためにコミュニティープラグインの
１つを使うことができます。私たちは `LazyLoad プラグイン
<https://github.com/jeremyharris/cakephp-lazyload>`__ をお勧めします。

あなたのエンティティーにプラグインを追加した後、以下のようにできます。 ::

    $article = $this->Articles->findById($id);

    // comments プロパティーは lazy ロードされます。
    foreach ($article->comments as $comment) {
        echo $comment->body;
    }

トレイトを使った再利用可能なコードの生成
========================================

いくつかのエンティティークラスで同じロジックを使わなければならないことに気づくことがあるでしょう。
PHP のトレイトはこういった場合に威力を発揮します。 **src/Model/Entity** に自作のトレイトを
置くことができます。慣習的に CakePHP のトレイトは末尾に ``Trait`` が付いていますので、
クラスやインターフェイスでないことが判るようになっています。トレイトは振る舞いを補完するもので、
これを使うことで、テーブルオブジェクトやエンティティーオブジェクトに機能を提供できるようになっています。

例えば、 SoftDeletable プラグインを使っていたとして、これがトレイトを提供します。
このトレイトは、エンティティーに 'deleted' マークを付けるためのメソッドを提供します。
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

そして、このトレイトをインポートし、インクルードすることで、独自のエンティティークラスで使えます。 ::

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

    // 配列を取得します。
    // アソシエーションも toArray() で変換されます。
    $array = $user->toArray();

    // JSON に変換します。
    // アソシエーションも jsonSerialize フックで変換されます。
    $json = json_encode($user);

エンティティーを JSON へと変換する際に、仮想 (virtual) フィールドや隠し (hidden) フィールドの
リストが適用されます。エンティティーは再帰的に JSON へと変換されます。これは、エンティティーと
アソシエーションを eager ロードする場合、CakePHP は関連データを正しいフォーマットへと
正しく変換できることを意味します。

.. _exposing-virtual-properties:

仮想プロパティーが含まれるようにする
----------------------------------------

配列や JSON に変換した際、仮想フィールドはデフォルトでは含まれません。
仮想プロパティーが含まれるようにするためには、そのように指定する必要があります。
エンティティークラスを定義する際に、含まれるべき仮想プロパティーのリストを提供できます。 ::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {

        protected $_virtual = ['full_name'];

    }

実行時に ``virtualProperties`` を使うことでこのリストを変更できます。 ::

    $user->virtualProperties(['full_name', 'is_admin']);

プロパティーを隠す
------------------

JSON/配列フォーマットで出力したくないフィールドがある場合があります。例えば、
パスワードや ”秘密の質問” などです。エンティティークラスを定義する際、
どのプロパティーを隠すか設定できます。 ::

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
エンティティーのアクセサーとミューテーターに含まれることは想定されていません。
配列型やオブジェクト型のような複合的なデータ型をどうやって保存するのかを理解するには
:ref:`saving-complex-types` を参照して下さい。

.. meta::
    :title lang=en: Entities
    :keywords lang=en: entity, entities, single row, individual record
    :title lang=ja: エンティティー
    :keywords lang=ja: エンティティー, 個別, レコード
