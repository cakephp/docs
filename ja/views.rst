ビュー
######
.. php:namespace:: Cake\View

.. php:class:: View

ビュー (View) は MVC の **V** です。ビューはリクエストに対する出力を生成する役割を担います。
大抵の場合、これは HTML フォームや XML、JSON などですが、ファイルのストリーミングや、
ユーザーがダウンロード可能な PDF の生成もビューレイヤーの役割となります。

CakePHP では下記の典型的な描画シナリオに対応するためのいくつかの組み込みのビュークラスを
用意しています。

- XML や JSON ウェブサービスを作成するには :doc:`views/json-and-xml-views` を利用できます。
- 保護されたファイルや動的に生成されたファイルを提供するには
  :ref:`cake-response-file` を利用できます。
- 複数テーマのビューを作成するには :doc:`views/themes` を利用できます。

.. _app-view:

App ビュー
==========

``AppView`` はアプリケーションの既定のビュークラスです。
``AppView`` は自身が CakePHP に含まれる ``Cake\View\View`` クラスを継承していて、
**src/View/AppView.php** の中で次のように定義されています。

.. code-block:: php

    <?php
    namespace App\View;

    use Cake\View\View;

    class AppView extends View
    {
    }

アプリケーション中で描画されるすべてのビューで使われるヘルパーを読み込むために
``AppView`` を使用することができます。こうした用途のために、CakePHP は View
のコンストラクターの最後で呼び出される ``initialize()`` メソッドを提供します。

.. code-block:: php

    <?php
    namespace App\View;

    use Cake\View\View;

    class AppView extends View
    {

        public function initialize()
        {
            // MyUtils ヘルパーをいつでも有効にする
            $this->loadHelper('MyUtils');
        }

    }

.. _view-templates:

ビューテンプレート
==================

CakePHP のビューレイヤーは、どのようにユーザーに伝えるかです。ほとんどの場合、ビューは
HTML/XHTML ドキュメントをブラウザーに返しますが、JSON を介して
リモートアプリケーションに返答したり、CSV ファイルを出力する必要もあるかもしれません。

CakePHP のテンプレートファイルは既定の拡張子を **.ctp** (CakePHP Template) としており、
制御構造や出力のために `PHP 別の構文
<http://php.net/manual/ja/control-structures.alternative-syntax.php>`_
を利用することができます。
これらのファイルにはコントローラーから受け取ったデータを、
閲覧者のために用意した表示形式に整形するのに必要なロジックを入れます。

別の echo
---------

テンプレート中の変数を echo または print します。 ::

  <?php echo $variable; ?>

短いタグにも対応しています。 ::

  <?= $variable ?>

別の制御構文
------------

``if`` 、 ``for`` 、 ``foreach`` 、 ``switch`` 、そして ``while``
のような制御構文は単純な形式で書くことができます。括弧は必要ないことに注意してください。
代わりに、 ``foreach`` の閉じ括弧は ``endforeach`` に置き換えられています。
上記の各制御構造は ``endif`` 、 ``endfor`` 、 ``endforeach`` 、 ``endwhile``
のような閉じ構文を持っています。各制御構造の後（最後の一つを除いて）に ``セミコロン (;)`` ではなく、
``コロン (:)`` があることにも注意してください。

以下は ``foreach`` の使用例です。

.. code-block:: php

  <ul>
  <?php foreach ($todo as $item): ?>
    <li><?= $item ?></li>
  <?php endforeach; ?>
  </ul>

別の例として、 if/elseif/else の用法です。コロンに注意してください。

.. code-block:: php

  <?php if ($username === 'sally'): ?>
     <h3>やあ、Sally</h3>
  <?php elseif ($username === 'joe'): ?>
     <h3>やあ、Joe</h3>
  <?php else: ?>
     <h3>やあ、知らない人</h3>
  <?php endif; ?>

もしも、 `Twig <http://twig.sensiolabs.org>`_ のようなテンプレート言語を使いたいのであれば、
ビューのサブクラスがテンプレート言語と CakePHP の橋渡しをしてくれるでしょう。

テンプレートファイルは **/src/Template/** の中の、ファイルを使用するコントローラーにちなんで
名付けられたフォルダーに置かれ、その対応するアクション名にちなんで名付けられます。
例えば、 ``Products`` コントローラーの ``view()`` アクションのビューファイルは通常、
**/src/Template/Products/view.ctp** となります。

CakePHP のビューレイヤーはいくつかの異なるパーツによって作り上げられています。
各パーツは異なる役割を持っており、この章で説明していきます。

- **テンプレート**: テンプレートは実行中のアクション固有のページの一部分です。
  アプリケーションの応答の中心となります。
- **エレメント**: 小さな、再利用可能なちょっとしたコードです。エレメントは通常、
  ビューの中で描画されます。
- **レイアウト**: アプリケーションの多くのインターフェイスをくるむ表示コードを入れる
  テンプレートファイルです。ほとんどのビューはレイアウトの中に描画されます。
- **ヘルパー**: これらのクラスはビューレイヤーの様々な場所で必要とされるロジックを
  カプセル化します。とりわけ、CakePHP のヘルパーはフォームの構築や AJAX 機能の構築、
  モデルデータのページ切替、RSS フィードの提供などの手助けをしてくれます。
- **cells**: これらのクラスは、自己完結型のUI部品を作成する
  小さなコントローラー風の機能を提供します。
  より詳しい情報は :doc:`/views/cells` を参照してください。

ビュー変数
----------

コントローラーの中で ``set()`` で設定した変数は、
アクションが描画するビューやレイアウトの双方で使用可能です。
加えて、設定した変数はエレメントの中でも使用可能です。
もしも、追加の変数をビューからレイアウトに渡す必要があれば、
ビューテンプレートの中から ``set()`` を呼ぶか、 :ref:`view-blocks` が利用できます。

CakePHP は自動では出力をエスケープしませんので、ユーザーデータを出力する前には
**いつも** エスケープしなければならないことを覚えておいてください。
``h()`` 関数でユーザーコンテンツをエスケープできます。 ::

    <?= h($user->bio); ?>

ビュー変数の設定
----------------

.. php:method:: set(string $var, mixed $value)

ビューにはコントローラーオブジェクトの ``set()`` と類似の ``set()`` メソッドがあります。
ビューファイルから set() を使うと後で描画されるレイアウトやエレメントに変数を追加できます。
``set()`` の使い方のより詳しい情報は :ref:`setting-view_variables` を参照してください。

ビューファイルでは、次のように記述できます。 ::

    $this->set('activeMenuButton', 'posts');

そしてレイアウトでは、 ``$activeMenuButton`` 変数が使用でき、'posts' という値を持ちます。

.. _extending-views:

ビューの継承
------------

ビューの継承によって、あるビューを他のビューでくるむことができるようになります。
:ref:`ビューブロック <view-blocks>` と組み合わせることでビューを :term:`DRY` に保つための
強力な方法が得られます。例えば、あなたが作成しているアプリケーションの特定のビューで、
サイドバーの描画を変える必要があるとします。共通のビューファイルを継承することで、
サイドバーのマークアップの繰り返しを避けられ、そしてただ変化する場所を定義するだけです。

.. code-block:: php

    <!-- src/Template/Common/view.ctp -->
    <h1><?= $this->fetch('title') ?></h1>
    <?= $this->fetch('content') ?>

    <div class="actions">
        <h3>関連アクション</h3>
        <ul>
        <?= $this->fetch('sidebar') ?>
        </ul>
    </div>

上記のビューファイルを親ビューとして使うことができます。これは ``sidebar`` と ``title``
ブロックを定義しているビューが継承することを期待しています。 ``content`` ブロックは CakePHP
が作る特別なブロックで、継承しているビューの捕捉されなかったすべての内容が入ります。
ビューファイルに投稿のデータが格納されている ``$post`` という変数があるとすれば、
ビューは次のようになります。

.. code-block:: php

    <!-- src/Template/Posts/view.ctp -->
    <?php
    $this->extend('/Common/view');

    $this->assign('title', $post->title);

    $this->start('sidebar');
    ?>
    <li>
    <?php
    echo $this->Html->link('edit', [
        'action' => 'edit',
        $post->id
    ]);
    ?>
    </li>
    <?php $this->end(); ?>

    // 残りの内容は親ビューの 'content' ブロックとして使用可能です。
    <?= h($post->body) ?>

上記の例はどのようにビューを継承できるかを示しており、ブロック一式を生成しています。
定義されたブロックの中に入っていないあらゆるコンテンツは捕捉され、 ``content``
という特別な名前のブロックに配置されます。ビューに ``extend()`` の呼び出しがある場合、
現在のビューファイルは最後まで実行されます。実行完了後、継承されたビューが描画されます。
一つのビューファイルで二回以上 ``extend()`` が呼び出される場合、
次に処理される親ビューを上書きします。 ::

    $this->extend('/Common/view');
    $this->extend('/Common/index');

上記は ``/Common/index.ctp`` が現在のビューの親ビューとして描画される結果になります。

継承されたビューは好きなだけ入れ子にすることができます。必要に応じて
各ビューは他のビューを継承することができます。各親ビューは一つ前のビューの内容を
``content`` ブロックとして取得できます。

.. note::

    ``content`` をブロック名として使うことは避けるべきです。
    CakePHP は継承されたビューの中で捕捉されていないコンテンツとして扱ってしまいます。

``blocks()`` メソッドを使って、存在するブロックを列挙することができます。 ::

    $list = $this->blocks();

.. _view-blocks:

ビューブロックの使用
====================

ビューブロックはビュー/レイアウトの中のどこかで定義されるであろう、スロットやブロックを
定義できるようにする柔軟な API を提供します。例えばブロックは、サイドバーや、
レイアウトの末尾や先頭のアセット読込領域の実装に理想的です。
ブロックを実装するには二つの方法があります。捕捉するブロックとするか、直接割り当てるかです。
``start()`` 、 ``append()`` 、 ``prepend()`` 、 ``assign()`` 、 ``fetch()`` 、
そして ``end()`` メソッドは捕捉するブロックと共に動作します。 ::

    // sidebar ブロックを作成する。
    $this->start('sidebar');
    echo $this->element('sidebar/recent_topics');
    echo $this->element('sidebar/recent_comments');
    $this->end();

    // sidebar の末尾に追加する。
    $this->start('sidebar');
    echo $this->fetch('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

``append()`` を使ってブロックに追記することもできます。 ::

    $this->append('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

    // 上と同じです。
    $this->append('sidebar', $this->element('sidebar/popular_topics'));

もしあるブロックを消去または上書きする必要がある場合、二つほど選択肢があります。
``reset()`` メソッドはいつでもブロックを消去または上書きします。
空文字での ``assign()`` メソッドも特定のブロックを消去するために使えます。 ::

    // sidebar ブロックの以前の中身を消去します。
    $this->reset('sidebar');

    // 空文字を代入も sidebar ブロックを消去します。.
    $this->assign('sidebar', '');

.. versionadded:: 3.2
    3.2 で View::reset() が追加されました

ブロックのコンテンツへの代入は、ビュー変数をブロックに変換したい時にしばしば役に立ちます。
例えば、ページタイトルのためにブロックを使いたいかもしれませんし、
時にはコントローラーの中で、ビュー変数としてタイトルを代入するかもしれません。 ::

    // ビューやレイアウトの中で $this->fetch('title') に
    $this->assign('title', $title);

``prepend()`` メソッドは既存のブロックの先頭にコンテンツを追記することができます。 ::

    // sidebar に前置します
    $this->prepend('sidebar', 'このコンテンツはサイドバーの先頭に来ます');

ブロックの表示
--------------

ブロックの表示には ``fetch()`` メソッドを使います。``fetch()`` は
もしもブロックが存在しなかった場合に '' を返してブロックを出力します。 ::

    <?= $this->fetch('sidebar') ?>

fetch を使うとブロックが存在するかどうかによってブロックに囲まれたコンテンツの表示を
切り替えることができます。これはレイアウトや継承されたビューで
見出しや他のマークアップ表示を切り替えたい場合に役に立ちます。

.. code-block:: php

    // src/Template/Layout/default.ctp の中で
    <?php if ($this->fetch('menu')): ?>
    <div class="menu">
        <h3>Menu options</h3>
        <?= $this->fetch('menu') ?>
    </div>
    <?php endif; ?>

ブロックが存在しない場合の既定の値を指定することもできます。
これによって、ブロックが存在しない場合のプレースホルダーを追加することでききます。
既定値は第二引数で指定します。

.. code-block:: php

    <div class="shopping-cart">
        <h3>買い物かご</h3>
        <?= $this->fetch('cart', '買い物かごが空です') ?>
    </div>

スクリプトと CSS ファイルのためのブロック使用
---------------------------------------------

``HtmlHelper`` はビューブロックと結び付いており、その ``script()`` 、 ``css()`` 、そして
``meta()`` メソッドは ``block = true`` のオプションで使われると
同名のブロックをそれぞれ更新します。

.. code-block:: php

    <?php
    // ビューファイルの中で
    $this->Html->script('carousel', ['block' => true]);
    $this->Html->css('carousel', ['block' => true]);
    ?>

    // レイアウトファイルの中で
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <title><?= $this->fetch('title') ?></title>
        <?= $this->fetch('script') ?>
        <?= $this->fetch('css') ?>
        </head>
        // 残りのレイアウトが続きます

:php:meth:`Cake\\View\\Helper\\HtmlHelper` はスクリプトや CSS が入るブロックを
制御することもできます。 ::

    // ビューファイルの中で
    $this->Html->script('carousel', ['block' => 'scriptBottom']);

    // レイアウトの中で
    <?= $this->fetch('scriptBottom') ?>

.. _view-layouts:

レイアウト
==========

レイアウトにはビューをくるむ表示コードが入ります。すべてのビューから見えて欲しいものは
レイアウトに配置されるべきです。

CakePHP の既定のレイアウトは **src/Template/Layout/default.ctp** に置かれます。
もし、アプリケーションの見栄え全体を変更したい場合、これが手始めとなり、
なぜならページが描画される時には、コントローラーによって描画されるビューのコードは、
既定のレイアウトの中に置かれるからです。

他のレイアウトファイルは **src/Template/Layout** に配置されるべきです。
レイアウトを作るとき、ビューの出力がどこに配置されるかを CakePHP に伝える必要があります。
そのために、レイアウトには ``$this->fetch('content')`` を入れるようにしてください。
これは既定のレイアウトがどのようなものかの一例です。

.. code-block:: php

   <!DOCTYPE html>
   <html lang="en">
   <head>
   <title><?= h($this->fetch('title')) ?></title>
   <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
   <!-- 外部ファイルとスクリプトファイルがここに入れます (詳しくは HTML ヘルパーを参照。) -->
   <?php
   echo $this->fetch('meta');
   echo $this->fetch('css');
   echo $this->fetch('script');
   ?>
   </head>
   <body>

   <!-- もしすべてのビューでメニューを表示したい場合、ここに入れます -->
   <div id="header">
       <div id="menu">...</div>
   </div>

   <!-- ここがビューで表示されるようにしたい場所です -->
   <?= $this->fetch('content') ?>

   <!-- 表示される各ページにフッターを追加します -->
   <div id="footer">...</div>

   </body>
   </html>

``script`` 、 ``css`` 、 ``meta`` ブロックには、組み込みの HTML ヘルパーを使って
ビューで定義されたすべての内容が入ります。
ビューからの JavaScript と CSS ファイルを読み込むのに便利です。

.. note::

    :php:meth:`HtmlHelper::css()` や :php:meth:`HtmlHelper::script()` を
    テンプレートファイルで使うとき、HTML ソースを同じ名前でブロックの中に配置するには
    ``'block' => true`` を指定してください。 (詳しい使い方は API を参照してください)

``content`` ブロックは描画されたビューの内容が入ります。

``title`` ブロックの内容をビューファイルから設定することができます。 ::

    $this->assign('title', 'アクティブユーザー表示');

好きなだけレイアウトを作ることができます。 **src/Template/Layout** ディレクトリーに置いて、
コントローラーのアクションの中か、ビューの ``$layout`` プロパティーで切り替えるだけです。 ::

    // コントローラーから
    public function view()
    {
        // レイアウトの設定
        $this->viewBuilder()->setLayout('admin');

        // 3.4 以前
        $this->viewBuilder()->layout('admin');

        // 3.1 以前
        $this->layout = 'admin';
    }

    // ビューファイルから
    $this->layout = 'loggedin';

例えば、サイトに小さな広告バナー枠があるとすれば、小さな広告枠のある新しいレイアウトを作って、
以下のように全コントローラーのアクションで指定するかもしれません。 ::

    namespace App\Controller;

    class UsersController extends AppController
    {
        public function viewActive()
        {
            $this->set('title', 'アクティブユーザー表示');
            $this->viewBuilder()->setLayout('default_small_ad');

            // あるいは 3.4 以前では以下
            $this->viewBuilder()->layout('default_small_ad');

            // あるいは 3.1 以前では以下
            $this->layout = 'default_small_ad';
        }

        public function viewImage()
        {
            $this->viewBuilder()->setLayout('image');

            // ユーザー画像の出力
        }
    }

既定のレイアウトの他に CakePHP の公式スケルトン app は 'ajax' レイアウトも持っています。
Ajax レイアウトは AJAX のレスポンスを組み立てるのに便利で、これは空のレイアウトです。
(ほとんどの AJAX 呼び出しは、完全に描画されたインターフェイスというよりも、
返却にちょっとしたマークアップを必要とするだけです。)

スケルトン app は RSS を生成するのを手助けする既定のレイアウトも持っています。

プラグインのレイアウト使用
--------------------------

もしプラグインに存在するレイアウトを使いたい場合、 :term:`プラグイン記法`
を使うことが出来ます。例えば、 Contacts プラグインの contact レイアウトを使うには
次のようにします。 ::

    namespace App\Controller;

    class UsersController extends AppController
    {
        public function view_active()
        {
            $this->viewBuilder()->layout('Contacts.contact');
            // あるいは 3.1 以前では以下
            $this->layout = 'Contacts.contact';
        }
    }

.. _view-elements:

エレメント
==========

.. php:method:: element(string $elementPath, array $data, array $options = [])

多くのアプリケーションは、様々なページで、時には異なるレイアウトのページで、
繰り返し必要とされる表示コードの小さなブロックを持っています。CakePHP は再利用が必要な
ウェブサイトのパーツを繰り返し使う手助けをします。この再利用可能なパーツはエレメントと
呼ばれます。広告、ヘルプボックス、ナビゲーションコントロール、追加のメニュー、
ログインフォーム、吹き出しは CakePHP ではしばしばエレメントとして実装されます。
エレメントは基本的に他のビュー、レイアウト、そして他のエレメントにさえも入れることができる
小さなビューです。エレメントは、繰り返し使う要素の描画を個別のファイルに収めるので、
ビューの可読性を高めるのに使えます。
アプリケーション内のコンテンツの一部を再利用する手助けにもなります。

エレメントは  **src/Template/Element/** フォルダーの中に .ctp の拡張子を持つ名前で配置されます。
次の例はビューの element メソッドを使って出力しています。 ::

    echo $this->element('helpbox');

エレメントに変数を渡す
----------------------

element メソッドの第二引数を通してエレメントにデータを渡すことができます。 ::

    echo $this->element('helpbox', [
        "helptext" => "おお、このテキストはとても役に立つ。"
    ]);

エレメントファイルの内部では、引数で渡されたすべての変数を
パラメーター配列のメンバーとして利用できます。(テンプレートファイルにおけるコントローラーの
``Controller::set()`` メソッドと同様の動作です。)
上記の例では **src/Template/Element/helpbox.ctp** の中で ``$helptext`` 変数が使えます。 ::

    // src/Template/Element/helpbox.ctp の中で
    echo $helptext; // 出力 "おお、このテキストはとても役に立つ。"

``View::element()`` メソッドは、エレメントのためのオプションもサポートしています。
サポートされるオプションは、'cache' と 'callbacks' です。例えば::

    echo $this->element('helpbox', [
            "helptext" => "これはエレメントに $helptext として渡されます",
            "foobar" => "これはエレメントに $foobar として渡されます",
        ],
        [
            // "long_view" のキャッシュ設定を使います
            "cache" => "long_view",
            // エレメントから before/afterRender が呼び出されるには true に設定してください
            "callbacks" => true
        ]
    );

エレメントは ``Cache`` クラスを通じてキャッシュされます。
設定済みのキャッシュのいづれかにエレメントが保存されるように設定できます。
その結果、何処にいつまでエレメントを保存しておくのかを非常に柔軟に制御することができます。
あるアプリケーションの中で同じエレメントの異なるバージョンをキャッシュするためには、
次の書式を使って一意のキャッシュキーを提供してください。 ::

    $this->element('helpbox', [], [
            "cache" => ['config' => 'short', 'key' => 'unique value']
        ]
    );

もしもエレメント中で、データソースからの動的なデータのような、さらなるロジックが必要であれば、
エレメントの代わりにビューセルを使用することを検討してください。
詳細は :doc:`ビューセルについて </views/cells>` 参照してください。

エレメントのキャッシュ
----------------------

キャッシュパラメーターを渡すだけで CakePHP のビューキャッシュの恩恵を得られます。
``true`` を渡した場合、'default' のキャッシュ設定に基づいてエレメントがキャッシュされます。
あるいは、どのキャッシュ設定を使うかを設定することができます。
``Cache`` の設定についての詳細は :doc:`/core-libraries/caching` を参照してください。
エレメントキャッシュの単純な例は以下のようになります。 ::

    echo $this->element('helpbox', [], ['cache' => true]);

あるビューの中で同じエレメントを二回以上描画し、かつキャッシュが有効であれば、
毎回異なる名前の 'key' パラメーターを設定するようにしてください。
後続の呼び出しが、その前の element() の呼び出しでキャッシュされた結果を
上書してしまうのを避けることができるでしょう。例えば::

    echo $this->element(
        'helpbox',
        ['var' => $var],
        ['cache' => ['key' => 'first_use', 'config' => 'view_long']]
    );

    echo $this->element(
        'helpbox',
        ['var' => $differenVar],
        ['cache' => ['key' => 'second_use', 'config' => 'view_long']]
    );

上の例は、双方の element() の結果が別々にキャッシュされるようにします。
もしすべてのエレメントのキャッシュで同じ設定を使いたい場合、
``View::$elementCache`` を設定することで繰り返しを避けられます。
CakePHP は element() に何も渡されなかった場合、この設定を使います。

プラグインのエレメントの要求
----------------------------

もしプラグインを使っていて、そのプラグインのエレメントを使いたければ、慣れ親しんだ
:term:`プラグイン記法` を使うだけでよいです。もしもビューが
プラグインのコントローラー/アクションで描画される場合、他のプラグイン名が渡されなければ、
使用されるすべてのエレメントに対して自動的にそのプラグイン名が接頭されます。
もしエレメントがプラグインに存在しない場合、メインの APP フォルダーの中を探します。 ::

    echo $this->element('Contacts.helpbox');

もしビューがプラグインの一部であれば、プラグイン名を省略できます。
例えば、Contacts プラグインの ``ContactsController`` の中にいる場合、次の::

    echo $this->element('helpbox');
    // と
    echo $this->element('Contacts.helpbox');

は等価で、描画されるエレメントは同じになります。

プラグインのサブフォルダー中のエレメント
(例: **plugins/Contacts/Template/Element/sidebar/helpbox.ctp**) については、
以下を使ってください。 ::

    echo $this->element('Contacts.sidebar/helpbox');

App のエレメントの要求
----------------------

もしプラグインのテンプレートファイル内で、このプラグインや他のプラグインではなく、
メインのアプリケーションに存在するエレメントを描画したい場合、次のようにします。 ::

  echo $this->element('some_global_element', [], ['plugin' => false]);
  // または...
  echo $this->element('some_global_element', ['localVar' => $someData], ['plugin' => false]);

ルーティングプレフィックスとエレメント
--------------------------------------

.. versionadded:: 3.0.1

ルーティングプレフィックスを設定している場合、レイアウトやビューがそうであるように、
エレメントのパスの解決は、プレフィックスの場所に切り替わります。
"Admin" プレフィックスが設定されていて、次のように呼ぶとすれば::

    echo $this->element('my_element');

エレメントはまず **src/Template/Admin/Element/** から探されます。
もしもファイルが存在しなければ、既定の場所から探されます。

ビューの断片のキャッシュ
------------------------

.. php:method:: cache(callable $block, array $options = [])

時には、ビュー出力の断片を生成するのに時間がかかることがあります。
たとえば、 :doc:`/views/cells` の描画や、時間のかかるヘルパーの操作など。
アプリケーションの実行を速くする手助けのために、
CakePHP はビューの断片をキャッシュする方法を提供します。 ::

    // ローカル変数を想定しています
    echo $this->cache(function () use ($user, $article) {
        echo $this->cell('UserProfile', [$user]);
        echo $this->cell('ArticleFull', [$article]);
    }, ['key' => 'my_view_key']);

既定ではキャッシュされたビューの内容は ``View::$elementCache`` のキャッシュ設定になりますが、
これを変更するために ``config`` オプションを使用できます。

.. _view-events:

ビューイベント
==============

コントローラーと同様、ビューは、描画のライフサイクル回りのロジックを入れるために、
いくつかのイベント/コールバックを呼び出すことができます。

イベント一覧
------------

* ``View.beforeRender``
* ``View.beforeRenderFile``
* ``View.afterRenderFile``
* ``View.afterRender``
* ``View.beforeLayout``
* ``View.afterLayout``

アプリケーションの :doc:`イベントリスナー </core-libraries/events>` をこれらのイベントに
アタッチする、または :ref:`ヘルパーコールバック <helper-api>` を使うことができます。

独自のビュークラス作成
======================

データビューの新しいタイプを有効にしたり、
付加的なカスタムのビュー描画ロジックをアプリケーションに追加するために、
カスタムビュークラスを作成する必要があるかもしれません。
CakePHP のほとんどの構成要素と同様に、ビュークラスにはいくつかの規約があります。

* ビュークラスは **src/View**  に配置してください。例: **src/View/PdfView.php**
* ビュークラス名には ``View`` をサフィックスとしてつけてください。 例: ``PdfView``
* ビュークラス名を参照するときは ``View`` サフィックスを省略する必要があります。
  例: ``$this->viewBuilder()->className('Pdf');``.

また、正しく動作するように、 ``View`` を継承しましょう。 ::

    // src/View/PdfView.php の中で
    namespace App\View;

    use Cake\View\View;

    class PdfView extends View
    {
        public function render($view = null, $layout = null)
        {
            // カスタムロジックをここに。
        }
    }

render メソッドを置き換えると、コンテンツがレンダリングされる方法を完全に制御できます。

ビューのより詳細
================

.. toctree::
    :maxdepth: 1

    views/cells
    views/themes
    views/json-and-xml-views
    views/helpers

.. meta::
    :title lang=ja: ビュー
    :keywords lang=ja: view logic,csv file,response elements,code elements,default extension,json,flash object,remote application,twig,subclass,ajax,reply,soap,functionality,cakephp,audience,xml,mvc
