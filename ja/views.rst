ビュー
######

ビュー (View) は MVC の **V** です。ビューはリクエストに対する出力を生成する役割を担います。
ここで言う出力とは、大抵の場合、HTML フォームや XML、JSON などを意味しますが
ファイルストリームの生成やユーザがダウンロード可能な PDF の生成もビューレイヤーの
役割となります。

CakePHP では下記の典型的な描画シナリオに対応するためのいくつかの組込みビュークラスを
用意しています。

- XML や JSON ウェブサービスを作成する場合、 :doc:`views/json-and-xml-views` を利用できます。
- 保護されたファイルや動的に生成されたファイルを提供する場合、
  :ref:`cake-response-file` を利用できます。
- 複数テーマのビューを作成する場合、 :doc:`views/themes` を利用できます。

ビューテンプレート
==================

CakePHP のビューレイヤーはユーザとの対話の手段です。ほとんどの場合、ビューは
(X)HTML ドキュメントをブラウザーに返します。
しかし、ときには Flash オブジェクトへ AMF データを提供したり、SOAP を介して
リモートアプリケーションに返答したり、CSV ファイルを出力する必要があるかもしれません。

デフォルトでは、CakePHP のビューファイルはプレーンな PHP で書かれ、その拡張子は
.ctp (CakePHP Template) です。ビューファイルにはコントローラーから受け取った
データの取得に必要なロジックが書かれています。もし Twig や Smarty のような
テンプレート言語を使たいのであれば、ビューのサブクラスがテンプレート言語と CakePHP の
橋渡しをしてくれるでしょう。

ビューファイルは、 ``/app/View/`` にあるコントローラ名のフォルダに、
関連するアクション名で保存されます。例えば、Products コントローラの "view()"
アクションのビューファイルは通常、 ``/app/View/Products/view.ctp`` となります。

CakePHP のビューレイヤーはいくつかの異なるパーツによって作り上げられています。
各パーツはそれぞれ役割を持っており、この章で説明していきます。

- **ビュー**: ビューは実行中のアクション固有のページの一部分です。
  アプリケーションの応答の中心となります。
- **エレメント**: 再利用可能なちょっとしたコードです。エレメントは通常、
  ビューの中で描画されます。
- **レイアウト**: アプリケーションの多くのインターフェイスをラップしている
  表示コードを含むビューファイルです。ほとんどのビューはレイアウトの中に描画されます。
- **ヘルパー**: これらのクラスはビューレイヤーの様々な場所で必要とされるロジックを
  カプセル化します。とりわけ、CakePHP のヘルパーはフォームの構築や AJAX 機能の構築、
  モデルデータのページ切替、RSS フィードの提供などの手助けをしてくれます。

.. _extending-views:

ビューの継承
------------

.. versionadded:: 2.1

ビューの継承によってあるビューを他のビューでラップすることができるようになります。
:ref:`ビューブロック <view-blocks>` と組み合わせることでビューを :term:`DRY` に保つための
強力な方法が得られます。例えば、あなたが作成しているアプリケーションの特定のビューで、
サイドバーの描画を変える必要があるとします。この場合、共通のビューファイルを継承することで
サイドバーのマークアップの繰り返しを避けられます。これは次のような変更を加えるだけで
実現できます。

.. code-block:: php

    // app/View/Common/view.ctp
    <h1><?php echo $this->fetch('title'); ?></h1>
    <?php echo $this->fetch('content'); ?>

    <div class="actions">
        <h3>Related actions</h3>
        <ul>
        <?php echo $this->fetch('sidebar'); ?>
        </ul>
    </div>

このビューファイルが親ビューとして使われたとします。すると、 ``sidebar`` と ``title``
ブロックが定義されているビューが継承されていることが期待されます。 ``content`` ブロックは
CakePHP が作る特別なブロックで、ビューの継承で捕捉されなかったすべてのコンテンツが含まれます。
ビューファイルに post データが格納されている ``$post`` という変数がある場合、
ビューは次のようになります。

.. code-block:: php

    <?php
    // app/View/Posts/view.ctp
    $this->extend('/Common/view');

    $this->assign('title', $post);

    $this->start('sidebar');
    ?>
    <li>
    <?php
    echo $this->Html->link('edit', array(
        'action' => 'edit',
        $post['Post']['id']
    )); ?>
    </li>
    <?php $this->end(); ?>

    // 残りのコンテンツは親ビューの 'content' ブロックとして利用できます。
    <?php echo h($post['Post']['body']);

上記の例はどのようにビューを継承できるかを示しており、ブロック一式を生成しています。
いくつかの未定義ブロックは捕捉され、 ``content`` という特別な名前のブロックに配置されます。
ビューに ``extend()`` の呼び出しが含まれるとき、現在のビューファイルは最後まで実行されます。
一度実行が完了すると、継承されたビューが描画されます。一つのビューファイルで二回以上
``extend()`` が呼び出される場合、次に処理される親ビューを上書きします。 ::

    $this->extend('/Common/view');
    $this->extend('/Common/index');

この例では ``/Common/index.ctp`` を親ビューとした描画結果が得られます。

継承されたビューは好きなだけ入れ子にすることができます。極端な話、すべてのビューで他のビューを
継承することさえできます。その場合、各親ビューは一つ前のビューのコンテンツを ``content``
ブロックとして取得できます。

.. note::

    ``content`` をブロック名として使うことは避けるべきです。
    CakePHP は継承されたビューの中で捕捉されていないコンテンツとして扱ってしまいます。

.. _view-blocks:

ビューブロックを使う
====================

.. versionadded:: 2.1

ビューブロックは ``$scripts_for_layout`` に代わって、ビュー/レイアウトの中であれば
どこででもスロットやブロックを定義できる拡張可能なAPIを提供します。例えばサイドバーや、
レイアウトの末尾や先頭にアセット読込領域の実装などがブロックの典型的な使用例です。
ブロックを実装するには二つの方法があります。捕捉されるブロックとするか、直接割り当てるかです。
``start()``, ``append()``, ``end()`` メソッドは捕捉されるブロックと共に動作します。 ::

    // sidebar ブロックを作成する
    $this->start('sidebar');
    echo $this->element('sidebar/recent_topics');
    echo $this->element('sidebar/recent_comments');
    $this->end();


    // sidebar の末尾に追加する
    $this->append('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

``start()`` を複数回使ってブロックを追加できます。 ``assign()`` はクリアしたり
任意のタイミングでブロックを上書きするために使われます。 ::

    // sidebar ブロックから以前のコンテンツを消去する
    $this->assign('sidebar', '');

2.3 で、いくつかのメソッドがブロック機構に追加されました。
``prepend()`` は、既存のブロックの先頭に内容を追加します。 ::

    // sidebar の先頭に追加する
    $this->prepend('sidebar', 'this content goes on top of sidebar');

``startIfEmpty()`` はブロックが空もしくは未定義の場合 **だけ** ブロックを開始したいときに
使用します。ブロックがすでに存在する場合は捕捉されたコンテンツは廃棄されます。ブロックの内容が
存在しないときのためにデフォルトの内容を用意しておきたい、なんて場合に使うと便利です。

.. code-block:: php

    // ビューファイル
    // navbar ブロックを作成
    $this->startIfEmpty('navbar');
    echo $this->element('navbar');
    echo $this->element('notifications');
    $this->end();

.. code-block:: php

    // 親の view/layout
    <?php $this->startIfEmpty('navbar'); ?>
    <p>ブロックがこの時点で定義されていない場合、代わりにこの内容を表示する</p>
    <?php $this->end(); ?>

    // 親の view/layout 内のどこか別の場所
    echo $this->fetch('navbar');

上記の例では、 ``navbar`` ブロックには最初のセクションで追加された内容のみが格納されます。
このブロックは子ビューで定義されているので、デフォルトの内容は ``<p>`` タグとともに
破棄されます。

.. versionadded: 2.3
    ``startIfEmpty()`` と ``prepend()`` は 2.3 で追加されました。

.. note::

    ``content`` という名前のブロックの使用は避けるべきです。この名前は CakePHP
    内部でビューの継承、レイアウト内のビューコンテンツのために使わています。

ブロックの表示
--------------

.. versionadded:: 2.1

ブロックの表示には、 ``fetch()`` メソッドを使います。 ``fetch()`` はブロックが
存在しなかった場合、'' を返すのでブロックが安全に出力されます。 ::

    echo $this->fetch('sidebar');

fetch を使うとブロックが存在するかどうかによってブロックに囲まれたコンテンツの表示を
切り替えることができます。

.. code-block:: php

    // in app/View/Layouts/default.ctp
    <?php if ($this->fetch('menu')): ?>
    <div class="menu">
        <h3>Menu options</h3>
        <?php echo $this->fetch('menu'); ?>
    </div>
    <?php endif; ?>


2.3.0 から、ブロックのデフォルト値を指定することができるようになりました。
これによって、ブロックの内容が空のときはプレースホルダを表示するとったことが簡単にできます。
デフォルト値は第2引数で指定します。

.. code-block:: php

    <div class="shopping-cart">
        <h3>Your Cart</h3>
        <?php echo $this->fetch('cart', 'Your cart is empty'); ?>
    </div>

.. versionchanged:: 2.3
    ``$default`` 引数は 2.3 で追加されました。

スクリプトとCSSファイルのためにブロックを使う
---------------------------------------------

.. versionadded:: 2.1

ブロックは 非推奨のレイアウト変数 ``$scripts_for_layout`` を置き換えます。
この変数の代わりにブロックを使うべきです。 :php:class:`HtmlHelper` はビューブロックを
結びつけます。:php:meth:`~HtmlHelper::script()`, :php:meth:`~HtmlHelper::css()`,
:php:meth:`~HtmlHelper::meta()` の各メソッドは ``inline = false`` オプションが
渡されたとき、それぞれ同じ名前のブロックを更新します。

.. code-block:: php

    <?php
    // ビューファイルの中
    $this->Html->script('carousel', array('inline' => false));
    $this->Html->css('carousel', array('inline' => false));
    ?>

    // レイアウトファイルの中
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <title><?php echo $this->fetch('title'); ?></title>
        <?php echo $this->fetch('script'); ?>
        <?php echo $this->fetch('css'); ?>
        </head>
        // レイアウトが以下に続く

:php:meth:`HtmlHelper` はスクリプトと CSS がどのブロックに対応するかを制御します。 ::

    // ビューの中
    $this->Html->script('carousel', array('block' => 'scriptBottom'));

    // レイアウトの中
    echo $this->fetch('scriptBottom');

.. _view-layouts:

レイアウト
==========

レイアウトはビューをラップする表示用コードを含みます。すべてのビューから見えて欲しいものは
レイアウトに配置されるべきです。

レイアウトファイルは ``/app/View/Layouts`` に配置されるべきです。新しいデフォルトレイアウトを
``/app/View/Layouts/default.ctp`` に作成することで CakePHP のデフォルトレイアウトは
上書きされます。一旦新しいデフォルトレイアウトが作られると、ページが描画されるときに
コントローラによって描画されたビューコードが新しいデフォルトレイアウトの内部に配置されるように
なります。

レイアウトを作るとき、ビューのためのコードが何処に配置されるかを CakePHP に伝える必要があります。
そのためには、作成したレイアウトに ``$this->fetch('content')`` が含まれていることを
確認して下さい。それでは、デフォルトレイアウトがどのようなものか実際に見てみましょう。

.. code-block:: php

   <!DOCTYPE html>
   <html lang="ja">
   <head>
   <title><?php echo $this->fetch('title'); ?></title>
   <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
   <!-- 外部ファイルとスクリプトファイルがここに読み込まれます (詳しくは HTML ヘルパーを参照して下さい) -->
   <?php
   echo $this->fetch('meta');
   echo $this->fetch('css');
   echo $this->fetch('script');
   ?>
   </head>
   <body>

   <!-- もしすべてのビューでメニューを表示したい場合、
        ここで読み込んで下さい。-->
   <div id="header">
       <div id="menu">...</div>
   </div>

   <!-- ビューで表示したいものはここに配置します。 -->
   <?php echo $this->fetch('content'); ?>

   <!-- 各ページで表示したいフッターはここに追加して下さい。 -->
   <div id="footer">...</div>

   </body>
   </html>

.. note::

    2.1 より前のバージョンでは、fetch() メソッドは利用できませんでした。
    ``fetch('content')`` は ``$content_for_layout`` を置き換え、
    ``fetch('meta')``, ``fetch('css')``, ``fetch('script')`` の各行は
    バージョン 2.0 では、 ``$scripts_for_layout`` 変数に含まれています。

組み込みの HTML ヘルパーを使っているビューの場合、 ``script``, ``css``, ``meta``
ブロックには定義済みのいくつかのコンテンツが含まれます。ビューからの JavaScript と
CSS ファイルが含まれるのは便利です。

.. note::

    :php:meth:`HtmlHelper::css()` や :php:meth:`HtmlHelper::script()` を
    ビューファイルで使うとき、HTML ソースを同じ名前でブロックの中に配置するために
    'inline' オプションは 'false' にして下さい。(詳しい使い方は API を参照して下さい。)

``content`` ブロックは描画されたビューのコンテンツを含みます。

``$title_for_layout`` はページタイトルを含んでいます。この変数は自動的に生成されますが、
コントローラ/ビューで設定すれば上書きすることができます。

.. note::

    ``$title_for_layout`` は、2.5 から非推奨です。代わりに
    レイアウト中で ``$this->fetch('title')`` を、
    ビューで ``$this->assign('title', 'page title')`` を使用してください。

好きなだけレイアウトを作ることが出来ます。レイアウトは、 ``app/View/Layouts``
ディレクトリにファイルを作って、コントローラアクションの中かビューの
:php:attr:`~View::$layout` プロパティを切り替えるだけで作成できます。 ::

    // コントローラから
    public function admin_view() {
        // Stuff
        $this->layout = 'admin';
    }

    // ビューファイルから
    $this->layout = 'loggedin';

例えば、私のサイトに小さな広告バナー枠があるとします。その場合、私は小さな広告枠が含まれる
新しいレイアウトを作って、以下のように全コントローラのアクションで指定するかもしれません。 ::

   class UsersController extends AppController {
       public function view_active() {
           $this->set('title_for_layout', 'View Active Users');
           $this->layout = 'default_small_ad';
       }

       public function view_image() {
           $this->layout = 'image';
           //output user image
       }
   }

CakePHP では二つのコアレイアウト (CakePHP のデフォルトレイアウトの他に)、
'ajax' と 'flash' を提供しています。Ajax レイアウトは AJAX のレスポンスを組み立てるのに
便利で、空のレイアウトになっています。(AJAX 呼び出しは、インターフェイスを完全に
描画するというよりもちょっとしたマークアップが必要なものがほとんどです。)
flash レイアウトは :php:meth:`Controller::flash()` メソッドのメッセージ表示に使われます。

素早く簡単に text/html ではないコンテンツを提供するために、他に三つのコアレイアウト、
xml, js, rss があります。

プラグインからレイアウトを使う
------------------------------

.. versionadded:: 2.1

もし既存のプラグインでレイアウトを使いたい場合、 :term:`プラグイン記法` を使うことが出来ます。
コンタクトプラグインからコンタクトのレイアウトを使う場合は以下のようになります。 ::

    class UsersController extends AppController {
        public function view_active() {
            $this->layout = 'Contacts.contact';
        }
    }


.. _view-elements:

エレメント
==========

多くのアプリケーションには様々なページで、時には異なるレイアウトのページで、
繰り返し必要とされる表示用コードの小さなブロックがあります。CakePHP は再利用が必要な
ウェブサイトのパーツを繰り返し使う手助けをします。この再利用可能なパーツはエレメントと
呼ばれます。広告、ヘルプボックス、ナビゲーションコントロール、エクストラメニュー、
ログインフォーム、吹き出しは CakePHP においてエレメントとして実装されます。
エレメントは基本的に他のビュー、レイアウト、エレメントに含めることができる小さなビューです。
エレメントはビューの中で繰り返し描画される箇所の可読性を改善するために使えます。
アプリケーション内のコンテンツの一部を再利用する手助けとなります。

エレメントは ``/app/View/Elements/`` フォルダの中に .ctp の拡張子を持つ名前で配置されます。
次の例はビューのelementメソッドを使って出力しています。 ::

    echo $this->element('helpbox');

エレメントに変数を渡す
----------------------

element メソッドの第二引数を通してエレメントにデータを渡すことができます。 ::

    echo $this->element('helpbox', array(
        "helptext" => "Oh, this text is very helpful."
    ));

エレメントファイルの内部では、引数で渡されたすべての変数をパラメータ配列のメンバとして利用できます。
(ビューファイルにおけるコントローラの :php:meth:`Controller::set()` メソッドと同様の動作です。)
上記の例では ``/app/View/Elements/helpbox.ctp`` の中で ``$helptext`` 変数が使えます。 ::

    // app/View/Elements/helpbox.ctp の内部
    echo $helptext; //"Oh, this text is very helpful." と出力されます

:php:meth:`View::element()` メソッドは、エレメントのためのオプションをサポートしています。
サポートされるオプションは、'cache' と 'callbacks' です。例えば::

    echo $this->element('helpbox', array(
            "helptext" => "This is passed to the element as $helptext",
            "foobar" => "This is passed to the element as $foobar",
        ),
        array(
            // "long_view" のキャッシュ設定を使います
            "cache" => "long_view",
            // エレメントから before/afterRender が呼び出されるには true に設定して下さい
            "callbacks" => true
        )
    );

エレメントは :php:class:`Cache` クラスを通じてキャッシュされます。
設定済みのキャッシュのいづれかにエレメントが保存されるように設定できます。
その結果、何処にいつまでエレメントを保存しておくのかを非常に柔軟に制御することができます。
あるアプリケーションの中で同じエレメントの異なるバージョンをキャッシュするためには、
次の書式を使ってユニークなキャッシュキーを提供して下さい。 ::

    $this->element('helpbox', array(), array(
            "cache" => array('config' => 'short', 'key' => 'unique value')
        )
    );

``requestAction()`` を使うことでエレメントの利点を最大限引き出すことができます。
``requestAction()`` 関数はビュー変数をコントローラアクションから取ってきて配列として返します。
これによってエレメントを真の MVC スタイルに保つことが可能になります。エレメント用に
ビュー変数を準備したコントローラアクションを作成し、それから コントローラから
エレメントにビュー変数を与えるために、 ``element()`` メソッドの第二引数のなかで
``requestAction()`` を呼び出して下さい。

これを実際確認するため、Post の例のコントローラに以下のようなコードを追加して下さい。 ::

    class PostsController extends AppController {
        // ...
        public function index() {
            $posts = $this->paginate();
            if ($this->request->is('requested')) {
                return $posts;
            }
            $this->set('posts', $posts);
        }
    }

するとエレメントの中でページネイトされた posts モデルにアクセすることができます。
整列されたリストから最新の5件を取得するためには、次のようにすればよいです。

.. code-block:: php

    <h2>Latest Posts</h2>
    <?php
      $posts = $this->requestAction(
        'posts/index/sort:created/direction:asc/limit:5'
      );
    ?>
    <ol>
    <?php foreach ($posts as $post): ?>
          <li><?php echo $post['Post']['title']; ?></li>
    <?php endforeach; ?>
    </ol>

エレメントをキャッシュする
--------------------------

キャッシュパラメータを渡すだけで CakePHP のビューキャッシュの恩恵を得られます。
true を渡した場合、'default' のキャッシュ設定に基づいてエレメントがキャッシュされます。
false の場合、どのキャッシュ設定を使うかを設定することができます。
:php:class:`Cache` の設定についての詳細は :doc:`/core-libraries/caching` をみて下さい。
エレメントキャッシュの単純な例は以下のようになります。 ::

    echo $this->element('helpbox', array(), array('cache' => true));

あるビューの中で同じエレメントが二回以上描画される場合、毎回違う名前の 'key' パラメータを
設定することで確実にキャッシュすることができます。これによって、element() を以前呼び出し時に
生成されたキャッシュをそれに続く element() の呼び出しの結果で上書きすることが避けられます。 ::

    echo $this->element(
        'helpbox',
        array('var' => $var),
        array('cache' => array('key' => 'first_use', 'config' => 'view_long')
    );

    echo $this->element(
        'helpbox',
        array('var' => $differenVar),
        array('cache' => array('key' => 'second_use', 'config' => 'view_long')
    );

上の例では、2つの element() の結果が別々にキャッシュされていることが保証されています。
もしすべてのエレメントのキャッシュで同じ設定を使いたい場合、
:php:attr:`View::$elementCache` を設定することで繰り返しを避けられことがあります。
CakePHP は element() に何も設定されていない場合、この設定を使います。

プラグインからエレメントへの要求
--------------------------------

2.0
---

プラグインからエレメントを読み込むために、 `plugin` オプションを使って下さい。
(バージョン 1.x の `data` オプションから移動しました。) ::

    echo $this->element('helpbox', array(), array('plugin' => 'Contacts'));

2.1
---

もしプラグインを使っていてプラグインからエレメントを使いたいと思うなら慣れ親しんだ
:term:`プラグイン記法` を使うだけでよいです。ビューがコントローラ/アクションプラグインの
描画中のとき、他のプラグイン名が使われなければ、すべてのエレメントで使われているプラグイン名に
自動的に接頭辞がつけられます。もしエレメントがプラグインに存在しない場合、
メインアプリフォルダの中が検索されます。 ::

    echo $this->element('Contacts.helpbox');

もしビューがプラグインの一部であれば、プラグイン名を省略できます。
例えば、Contacts プラグインの ``ContactsController`` の中にいる場合::

    echo $this->element('helpbox');
    // and
    echo $this->element('Contacts.helpbox');

これらは同じエレメントの描画結果が得られます。

.. versionchanged:: 2.1
    ``$options[plugin]`` オプションは非推奨となり、代わりに
    ``Plugin.element`` が追加されました。


独自 View クラスの作成
======================

データビューの新しいタイプを追加にするには、カスタムビュークラスを作成するか、
アプリケーションにカスタムビューのレンダリングロジックを追加する必要があります。
CakePHP のビュークラスのほとんどのコンポーネントと同様に、いくつかの規則があります。:


* ビュークラスは ``App/View`` に配置してください。例) ``App/View/PdfView.php``
* ビュークラス名には ``View`` をつけてください。 例) ``PdfView``
* ビュークラス名を参照するときは、 ``View`` サフィックスを省略する必要があります。
  例) ``$this->viewClass = 'Pdf';``

また、正しく動作するように、 ``View`` を継承しましょう。 ::

    // In App/View/PdfView.php

    App::uses('View', 'View');
    class PdfView extends View {
        public function render($view = null, $layout = null) {
            // Custom logic here.
        }
    }

render メソッドを置き換えると、コンテンツがレンダリングされる方法を完全に制御できます。

ビュー API
==========

.. php:class:: View

ビューメソッドはすべてのビュー、エレメント、レイアウトファイルからアクセス可能です。
``$this->method()`` の形式で呼び出して下さい。

.. php:method:: set(string $var, mixed $value)

    ビューにはコントローラオブジェクトで見られる ``set()`` と類似の ``set()``
    メソッドがあります。ビューファイルから set() を使うと後で描画されるレイアウトと
    エレメントへ変数を追加できます。set() の使い方についてさらに詳しく知りたい場合は、
    :ref:`controller-methods` を見て下さい。

    ビューファイルでは、次のように記述できます。 ::

        $this->set('activeMenuButton', 'posts');

    そしてレイアウトでは、 ``$activeMenuButton`` 変数が利用でき、
    'posts' という値になります。

.. php:method:: get(string $var, $default = null)

    ``$var`` という名前のビュー変数を取得できます。

    2.5 から、変数がセットされていなかった場合、デフォルト値を設定できます。

    .. versionchanged:: 2.5
        ``$default`` 引数は 2.5 から追加されました。

.. php:method:: getVar(string $var)

    ``$var`` という名前のビュー変数を取得できます。

    .. deprecated:: 2.3
        代わりに :php:meth:`View::get()` を使用してください。

.. php:method:: getVars()

    現在の描画スコープの中で利用できるすべてのビュー変数の一覧を取得します。
    変数名の配列が返ります。

.. php:method:: element(string $elementPath, array $data, array $options = array())

    エレメントまたはビューの一部を描画します。さらに詳しく知りたい場合は、
    :ref:`view-elements` をご覧ください。

.. php:method:: uuid(string $object, mixed $url)

    オブジェクトのタイプや URL に基づいてユニークでランダムではない DOM ID を生成します。
    このメソッドはしばしば、 :php:class:`JsHelper` のようなエレメントのためにユニークな
    DOM ID の生成を必要としているヘルパーによって使われます。 ::

        $uuid = $this->uuid(
          'form',
          array('controller' => 'posts', 'action' => 'index')
        );
        // $uuid contains 'form0425fe3bad'

.. php:method:: addScript(string $name, string $content)

    内部のスクリプトバッファにコンテンツを追加します。このバッファはレイアウトの中で
    ``$scripts_for_layout`` として利用されます。このメソッドは JavaScript や
    css を直接レイアウトに追加する必要のあるヘルパーを作る時に役立ちます。
    レイアウトやレイアウトの中のエレメントから追加されたスクリプトは
    ``$scripts_for_layout`` には追加されないということを心に留めておいて下さい。
    このメソッドはほとんどの場合、:doc:`/core-libraries/helpers/js` と
    :doc:`/core-libraries/helpers/html` ヘルパーのようなヘルパーの中から使われます。

    .. deprecated:: 2.1
        代わりに :ref:`view-blocks` の機能を使って下さい。

.. php:method:: blocks

    定義されているすべてのブロックの名前を配列として取得します。

.. php:method:: start($name)

    ビューブロックのためにブロックの捕捉を開始します。
    :ref:`view-blocks` をご覧ください。

    .. versionadded:: 2.1

.. php:method:: end

    一番最後に開始されたブロックの捕捉を終了します。
    :ref:`view-blocks` をご覧ください。

    .. versionadded:: 2.1

.. php:method:: append($name, $content)

    ``$name`` のブロックに追加します。
    :ref:`view-blocks` をご覧ください。

    .. versionadded:: 2.1

.. php:method:: prepend($name, $content)

    ``$name`` のブロックの先頭に追加します。
    :ref:`view-blocks` をご覧ください。

    .. versionadded:: 2.3

.. php:method:: startIfEmpty($name)

    指定したブロックが空の場合、ブロックを開始します。ブロック内のすべてのコンテンツが
    キャプチャされ、もしブロックが既に定義されている場合は破棄されます。

    .. versionadded:: 2.3

.. php:method:: assign($name, $content)

    ブロックの値に代入します。既に存在していたコンテンツは上書きされます。
    :ref:`view-blocks` を参照して下さい。

    .. versionadded:: 2.1

.. php:method:: fetch($name, $default = '')

    ブロックの値を取ってきます。ブロックが空であったり未定義の場合、'' が返ります。
    :ref:`view-blocks` を参照して下さい。

    .. versionadded:: 2.1

.. php:method:: extend($name)

    現在のビュー/エレメント/レイアウトを指定の名前で継承します。
    :ref:`extending-views` をご覧ください。

    .. versionadded:: 2.1

.. php:attr:: layout

    現在のビューがラップされるレイアウトを設定します。

.. php:attr:: elementCache

    エレメントをキャッシュするために使われているキャッシュ設定です。このプロパティを
    設定するこでエレメントをキャッシュするために使われているデフォルト設定が変更されます。
    このデフォルトは element メソッドの 'cache' オプションが使われると上書きされます。

.. php:attr:: request

    :php:class:`CakeRequest` のインスタンスです。現在のリクエストについての情報へ
    アクセスするためにこのインスタンスを使います。

.. php:attr:: output

    ビューファイルかレイアウトコンテンツのどちらかのビューから最後に描画されたコンテンツが
    含まれます。

    .. deprecated:: 2.1
        代わりに ``$view->Blocks->get('content');`` を使って下さい。

.. php:attr:: Blocks

    :php:class:`ViewBlock` のインスタンスです。ビューの描画中にビューブロック機能を
    提供するために使われています。

    .. versionadded:: 2.1

More about Views
================

.. toctree::
    :maxdepth: 1

    views/themes
    views/media-view
    views/json-and-xml-views
    views/helpers


.. meta::
    :title lang=ja: ビュー
    :keywords lang=ja: view logic,csv file,response elements,code elements,default extension,json,flash object,remote application,twig,subclass,ajax,reply,soap,functionality,cakephp,audience,xml,mvc
