ヘルパー
########

ヘルパーはアプリケーションのプレゼンテーション層のためのコンポーネントのようなクラスです。
多くのビューやエレメント、レイアウトで共有される表示ロジックを含んでいます。
この章では、ヘルパーを設定する方法を紹介します。ヘルパーの読み込み方法、
それらのヘルパーの使い方、独自のヘルパーを作成するための簡単な手順を概説します。

CakePHP にはビューの作成に役立つ多くのヘルパーがあります。それらは、整形式のマークアップ
(フォーム含む)、テキスト、時間、数値の整形に役立ったり、 Ajax 機能 をスピードアップさせたりします。
CakePHP のヘルパーに関する詳細については、各ヘルパーの章をご覧ください。

.. toctree::
    :maxdepth: 1

    /views/helpers/breadcrumbs
    /views/helpers/flash
    /views/helpers/form
    /views/helpers/html
    /views/helpers/number
    /views/helpers/paginator
    /views/helpers/rss
    /views/helpers/session
    /views/helpers/text
    /views/helpers/time
    /views/helpers/url

.. _configuring-helpers:

ヘルパーの設定
==============

CakePHP でヘルパーを読み込むには、ビュークラスでヘルパーを宣言します。
``AppView`` クラスは、すべての CakePHP アプリケーションが付属し、
ヘルパーを読み込むための理想的な場所です。 ::

    class AppView extends View
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadHelper('Html');
            $this->loadHelper('Form');
            $this->loadHelper('Flash');
        }
    }

プラグインのヘルパーを読み込むには、CakePHP の他の場所でも使われている
:term:`プラグイン記法` を使います。 ::

    $this->loadHelper('Blog.Comment');

CakePHP やアプリケーションにあるヘルパーを明示的に読み込む必要はありません。
これらのヘルパーは、初回の使用時に遅延ロードされます。
例えば::

    // まだ読み込まれていなければ FormHelper を読み込みます。
    $this->Form->create($article);

プラグインのビュー内から、プラグインヘルパーを遅延ロードすることもできます。
例えば、'Blog' プラグインのビューテンプレートは、同じプラグインからヘルパーを
遅延ロードすることができます。

条件付きヘルパーの読み込み
--------------------------

現在のアクション名を使用して、条件付きでヘルパーを読み込むことができます。 ::

    class AppView extends View
    {
        public function initialize()
        {
            parent::initialize();
            if ($this->request->getParam('action') === 'index') {
                $this->loadHelper('ListPage');
            }
        }
    }

また、コントローラーの ``beforeRender`` メソッドを使用して、ヘルパーを読み込むことができます。 ::

    class ArticlesController extends AppController
    {
        public function beforeRender(Event $event)
        {
            parent::beforeRender($event);
            $this->viewBuilder()->helpers(['MyHelper']);
        }
    }

設定オプション
--------------

ヘルパーに設定オプションを渡すことができます。これらのオプションは、属性値を設定したり、
ヘルパーの振る舞いを変更するために使用することができます。 ::

    namespace App\View\Helper;

    use Cake\View\Helper;
    use Cake\View\View;

    class AwesomeHelper extends Helper
    {

        // initialize() フックは 3.2 以降で使用可能です。前のバージョンで
        // 必要な場合は、コンストラクターをオーバーライドしてください。
        public function initialize(array $config)
        {
            debug($config);
        }
    }

次に示すように、コントローラーのヘルパーを宣言するときにオプションを指定することができます。 ::

    namespace App\Controller;

    use App\Controller\AppController;

    class AwesomeController extends AppController
    {
        public $helpers = ['Awesome' => ['option1' => 'value1']];
    }

デフォルトでは、すべての設定オプションは、 ``$_defaultConfig`` プロパティーとマージされます。
このプロパティーは、ヘルパーが必要とする設定のデフォルト値を定義する必要があります。例えば::

    namespace App\View\Helper;

    use Cake\View\Helper;
    use Cake\View\StringTemplateTrait;

    class AwesomeHelper extends Helper
    {

        use StringTemplateTrait;

        protected $_defaultConfig = [
            'errorClass' => 'error',
            'templates' => [
                'label' => '<label for="{{for}}">{{content}}</label>',
            ],
        ];
    }

ヘルパーのコンストラクターに提供される任意の設定は、構築時にデフォルト値とマージされ、
マージされたデータは、 ``_config`` に設定されます。
実行時設定を読み取るために ``config()`` メソッドを使用することができます。 ::

    // errorClass 設定オプションを読み込み
    $class = $this->Awesome->config('errorClass');

ヘルパー設定を使用すると、宣言的にヘルパーを設定し、コントローラーロジックから設定ロジックを
削除することができます。クラス宣言の一部として組み込むことができない設定オプションがある場合は、
コントローラーの beforeRender コールバックで設定します。 ::

    class PostsController extends AppController
    {
        public function beforeRender(Event $event)
        {
            parent::beforeRender($event);
            $builder = $this->viewBuilder();
            $builder->helpers([
                'CustomStuff' => $this->_getCustomStuffConfig(),
            ]);
        }
    }

.. _aliasing-helpers:

ヘルパーの別名
--------------

共通設定の一つに ``className`` オプションがあります。
このオプションを使うとビュー内に別名のヘルパーを作成することができます。
この機能は ``$this->Html`` や他のヘルパーの参照を独自実装に置き換えたい時に便利です。 ::

    // src/View/AppView.php
    class AppView extends View
    {
        public function initialize()
        {
            $this->loadHelper('Html', [
                'className' => 'MyHtml'
            ]);
        }
    }

    // src/View/Helper/MyHtmlHelper.php
    namespace App\View\Helper;

    use Cake\View\Helper\HtmlHelper;

    class MyHtmlHelper extends HtmlHelper
    {
        // コア HtmlHelper を上書きするコードを追加
    }

上記の例ではビューにて ``MyHtmlHelper`` に ``$this->Html`` という *別名* をつけています。

.. note::

    別名をつけられたヘルパーは、ヘルパーが使われるあらゆる場所のインスタンスを置き換えます。
    これは、他のヘルパーの内部を含みます。

ヘルパーの使用
==============

コントローラーで使用するヘルパーを設定すると、各ヘルパーはビューのパブリックプロパティーとして公開されます。
例えば、 :php:class:`HtmlHelper` を使用していた場合、次を実行することによってアクセスすることが
できます。 ::

    echo $this->Html->css('styles');

上記は HtmlHelper の ``css()`` メソッドを呼び出します。
``$this->{$helperName}`` を使用して任意の読み込まれたヘルパーにアクセスすることができます。

ヘルパーの動的ロード
--------------------

ビュー内から動的にヘルパーを読み込む必要がある状況があるかもしれません。
これを行うには、 ビューの :php:class:`Cake\\View\\HelperRegistry` を使用することができます。 ::

    // どちらか１つが動作
    $mediaHelper = $this->loadHelper('Media', $mediaConfig);
    $mediaHelper = $this->helpers()->load('Media', $mediaConfig);

HelperRegistry は :doc:`レジストリー </core-libraries/registry-objects>` です。
そして、 CakePHP の他の場所で使用されるレジストリー API をサポートしています。

コールバックメソッド
====================

ヘルパーは、ビューレンダリングプロセスを強化するためのコールバックをいくつか備えています。
詳細は :ref:`helper-api` と :doc:`/core-libraries/events` ドキュメントをご覧ください。

ヘルパーの作成
==============

アプリケーションやプラグインで使用するための独自のヘルパークラスを作成することができます。
CakePHP のコンポーネントと同様に、ヘルパークラスは、いくつかの規約があります。

* ヘルパークラスファイルは、 **src/View/Helper** に置かれます。
  例: **src/View/Helper/LinkHelper.php**
* ヘルパークラスは、末尾に ``Helper`` を付ける必要があります。例: ``LinkHelper`` 。
* ヘルパークラス名を参照するときは、 末尾の ``Helper`` を省略しなければなりません。
  例: ``$this->loadHelper('Link');`` 。

また、正しく動作させるために ``Helper`` を継承します。 ::

    /* src/View/Helper/LinkHelper.php */
    namespace App\View\Helper;

    use Cake\View\Helper;

    class LinkHelper extends Helper
    {
        public function makeEdit($title, $url)
        {
            // 特別な形式のリンクを作成するロジックをここに...
        }
    }

他のヘルパーの読み込み
----------------------

別のヘルパーに既に存在する機能を使用したい場合があります。
その場合、 ``$helpers`` 配列に使いたいヘルパーを明示することで実現出来ます。
フォーマットは、コントローラーで指定する場合と同じようにして下さい。 ::

    /* src/View/Helper/LinkHelper.php (他のヘルパーを使用) */

    namespace App\View\Helper;

    use Cake\View\Helper;

    class LinkHelper extends Helper
    {
        public $helpers = ['Html'];

        public function makeEdit($title, $url)
        {
            // 出力に HTML ヘルパーを使用
            // 整形されたデータ:

            $link = $this->Html->link($title, $url, ['class' => 'edit']);

            return '<div class="editOuter">' . $link . '</div>';
        }
    }

.. _using-helpers:

独自のヘルパーを使用
--------------------

ヘルパーを作成して **src/View/Helper/** に配置すると、ビューに読み込めます。 ::

    class AppView extends View
    {
        public function initialize()
        {
            parent::initialize();
            $this->loadHelper('Link');
        }
    }

ヘルパーが読み込まれたら、一致するビュープロパティーにアクセスしてビュー内で使用できます。 ::

    <!-- 新しいヘルパーを使用してリンクを作成 -->
    <?= $this->Link->makeEdit('レシピの変更', '/recipes/edit/5') ?>

.. note::

    ``HelperRegistry`` は、 ``コントローラー`` で明示されていないヘルパーを
    遅延ロードしようとします。

ヘルパー内部でビュー変数にアクセス
-------------------------------------------

ヘルパー内部でビュー変数にアクセスしたい場合は、次のように ``$this->_View->get()``
を使用することができます。 ::

    class AwesomeHelper extends Helper
    {

        public $helpers = ['Html'];

        public someMethod()
        {
            // meta description の設定
            echo $this->Html->meta(
                'description', $this->_View->get('metaDescription'), ['block' => 'meta']
            );
        }
    }

ヘルパー内部でビューエレメントの描画
------------------------------------

ヘルパー内部でエレメントを描画したい場合は、次のように ``$this->_View->element()``
を使用することができます。 ::

    class AwesomeHelper extends Helper
    {
        public someFunction()
        {
            // ヘルパー内で直接出力
            echo $this->_View->element(
                '/path/to/element',
                ['foo'=>'bar','bar'=>'foo']
            );

            // または、ビューに返す
            return $this->_View->element(
                '/path/to/element',
                ['foo'=>'bar','bar'=>'foo']
            );
        }
    }

.. _helper-api:

Helper クラス
=============

.. php:class:: Helper

コールバック
------------

ヘルパーにコールバックメソッドを実装することで、CakePHP は関連するイベントにヘルパーを自動的に
登録します。以前のバージョンの CakePHP とは異なり、ヘルパークラスはコールバックメソッドを
実装していないので、あなたのコールバックでは ``parent`` を *コールしてはいけません* 。

.. php:method:: beforeRenderFile(Event $event, $viewFile)

    各ビューファイルが描画される前に呼び出されます。
    これにはエレメント、ビュー、親ビュー、レイアウトを含みます。

.. php:method:: afterRenderFile(Event $event, $viewFile, $content)

    各ビューファイルが描画された後に呼び出されます。
    これにはエレメント、ビュー、親ビュー、レイアウトを含みます。
    コールバックは描画されたコンテンツがブラウザーにどのように描画されるかを変えるために
    ``$content`` を変更して返すことができます。

.. php:method:: beforeRender(Event $event, $viewFile)

    beforeRender メソッドはコントローラーの beforeRender メソッドの後に呼び出されます。
    しかし、コントローラーがビューとレイアウトを描画する前です。
    描画されるファイルを引数として受け取ります。

.. php:method:: afterRender(Event $event, $viewFile)

    ビューが描画された後に呼び出されます。しかし、レイアウトの描画開始前です。

.. php:method:: beforeLayout(Event $event, $layoutFile)

    レイアウトの描画開始前に呼び出されます。
    レイアウトファイル名を引数として受け取ります。

.. php:method:: afterLayout(Event $event, $layoutFile)

    レイアウトの描画が完了した時に呼び出されます。
    レイアウトファイル名を引数として受け取ります。

.. meta::
    :title lang=ja: ヘルパー
    :keywords lang=ja: php class,time function,presentation layer,processing power,ajax,markup,array,functionality,logic,syntax,elements,cakephp,plugins
