キャッシュヘルパー
##################

.. php:class:: CacheHelper(View $view, array $settings = array())

キャッシュヘルパーはレイアウトやビューをキャッシュするのを助けてくれ、繰り返しデータを取得する際に
時間を節約できます。CakePHP のビューキャッシングは一時的に解析したレイアウトやビューをシンプルな
PHP + HTML ファイルとして保存します。キャッシュヘルパーは他のヘルパーとはかなり異なった動作を
することに注意してください。直接呼び出せるメソッドはありません。代わりにビューはキャッシュタグで
マーキングされ、コンテンツのブロックがキャッシュされていることを示します。
その後、ファイルのプロセスを呼び戻してキャッシュファイルを書き出します。

URL がリクエストされると、CakePHP はそのリクエストされた文字列がすでにキャッシュされているか
どうかを確認します。もしキャッシュされてれば、ディスパッチプロセスの URL の残りをスキップします。
キャッシュされていないブロックは通常通り処理され、ビューは動作します。
このおかげでキャッシュされた URL への各リクエストは最小限のコードだけが実行されるので実行時間を
大きく節約できます。CakePHP がキャッシュされたビューを見つけられない場合、あるいはキャッシュが
リクエストされた URL の期限を過ぎている場合、通常通りリクエストを処理し続けます。


使い方
======

キャッシュヘルパーを使用する前に2つのステップをこなさなければなりません。まず一つ目に
``APP/Config/core.php`` にある Configure write で ``Cache.check`` をコールしている部分の
コメントを外して下さい。
そうするとリクエストを取り扱うときビューキャッシュファイルを確認したり、生成したりするようになります。

``Cache.check`` のコメントを外したならば controller の ``$helpers`` 配列にヘルパーを
追加しなければなりません。 ::

    class PostsController extends AppController {
        public $helpers = array('Cache');
    }

また、 bootstrap に CacheDispacher をディスパッチャフィルタへ追加する必要があります。 ::

    Configure::write('Dispatcher.filters', array(
        'CacheDispatcher'
    ));

.. versionadded:: 2.3
  もし、複数ドメインまたは言語で設定するのであれば、プレフィックス付きのビューキャッシュファイルに
  保存するために `Configure::write('Cache.viewPrefix', 'YOURPREFIX');` を使用できます。

環境設定オプションを追加する
----------------------------

キャッシュヘルパーはいくつかの環境設定オプションを持っていて挙動の調整を行うことができます。
この調整は、コントローラ内の ``$cacheAction`` 変数で行います。 ``$cacheAction`` は
キャッシュして欲しいアクションを含んでいる時や、それらのビューキャッシュが数秒持続して欲しい時には
配列をセットするべきです。時間は ``strtotime()`` フォーマットで表現する事ができます (例: "1 hour" や
"3 minutes") 。

ArticlesController の例を使用して、キャッシュする必要のある多くのトラフィックを受け取ります。 ::

    public $cacheAction = array(
        'view' => 36000,
        'index' => 48000
    );

上のコードはビューアクションを10時間、そインデックスアクションは13時間キャッシュすることができるものです。
コントローラーのどのアクションにでもキャッシュできます。どのコントローラーでも ``$cacheAction`` の
``strtotime()`` の書き方を下記のように親しみやすい記述にすることができます。 ::

    public $cacheAction = "1 hour";

さらに、 ``CacheHelper`` を使って作成されたコントローラーやコンポーネントの callbacks を
キャッシュされたビューのために使用可能です。
ただし、追加するときは ``$cacheAction`` で配列を使って、以下のように記述してください。 ::

    public $cacheAction = array(
        'view' => array('callbacks' => true, 'duration' => 21600),
        'add' => array('callbacks' => true, 'duration' => 36000),
        'index' => array('callbacks' => true, 'duration' => 48000)
    );

``callbacks => true`` をセットすることによってキャッシュヘルパーにコントローラー用の
コンポーネントとモデルを作成するように伝えます。そして、そのコントローラが初期化され、
beforFilter が読まれ、最後にコンポーネントの callbacks が呼ばれます。

.. note::

    ``callbacks => true`` を設定すると、部分的にキャッシングの意図に反してしまいます。
    それがデフォルトで true にならない理由です。

ビューでキャッシュされない内容をマークする
==========================================

場合によっては、*完全に* ビューをキャッシュしたくないことがあります。
たとえば、ユーザがログインしていようがゲストとしてサイトを閲覧していようが、
ページの一部を確実に異なる表示にしたい場合です。

キャッシュ *されない* コンテンツのブロックを表示するためには、その部分を次のように
``<!--nocache--> <!--/nocache-->``  で囲みます:

.. code-block:: php

    <!--nocache-->
    <?php if ($this->Session->check('User.name')): ?>
        Welcome, <?php echo h($this->Session->read('User.name')); ?>.
    <?php else: ?>
        <?php echo $this->Html->link('Login', 'users/login'); ?>
    <?php endif; ?>
    <!--/nocache-->

.. note::

   エレメントの中で ``nocache`` タグを使うことができません。エレメントには
   callbacks がないのでキャッシュすることができないのです。

一度アクションがキャッシュされると、そのアクションのコントローラは呼び出されない、
ということに注意してください。キャッシュファイルが作られた時、オブジェクトが
リクエストされてビューの変数が PHP の ``serialize()`` でシリアライズされます。

.. warning::

   シリアライズできないコンテンツ (SimpleXML, リソースハンドル, あるいはクロージャ) が
   ビューの変数を含んでいる場合、ビューキャッシングを使用してはいけません。

キャッシュをクリアする
======================

キャッシュされたビューで使用されたモデルが変更されると、CakePHP はキャッシュされたビューを
クリアすることを覚えておくのは重要です。たとえば、キャッシュされたビューが Post モデルから
取得したデータを使用していて、Post で INSERT, UPDATE, DELETE クエリーが生成されると、
そのビューのキャッシュはクリアされ新しいコンテンツが次のリクエストの際に生成されます。

.. note::

    自動的なキャッシュクリア処理は URL の一部で コントローラー/モデル の名前を必要とします。
    もし URL のルーティングを変更していたら、この処理は働きません。

手動でキャッシュをクリアする必要がある場合、Cache::clear() を呼び出すことでできます。
これはビューでないデータを含むキャッシュされたデータ **すべて** をクリアします。
もしキャッシュされたビューをクリアするならば ``clearCache()`` を使用します。


.. meta::
    :title lang=ja: キャッシュヘルパー
    :description lang=ja: The Cache helper assists in caching entire layouts and views, saving time repetitively retrieving data.
    :keywords lang=ja: cache helper,view caching,cache action,cakephp cache,nocache,clear cache
