プラグイン
############

CakePHP では、コントローラー・モデル・ビューの組み合わせを設定し、
他の CakePHP アプリケーションで使用できるよう事前にパッケージ化された
アプリケーションプラグインとしてリリースできます。あなたのアプリケーションの１つに、
素敵なユーザー管理モジュールやシンプルなブログやウェブサービスモジュールを作成したら、
CakePHP プラグインとしてパッケージ化してみませんか？そうすれば、他のアプリケーションで
再利用したり、コミュニティーで共有したりすることができます！

CakePHP プラグインは、ホストアプリケーション自身とは基本的に分離されており、
一般的にきちんとパッケージ化され、他のアプリケーションではほとんど手間をかけずに
再利用できる明確な機能を提供します。アプリケーションとプラグインは、それぞれの空間で動作しますが、
アプリケーションの設定によって定義・共有される、アプリケーション固有のプロパティー
（データベース接続パラメーターなど）を共有します。

CakePHP 3.0 では、それぞれのプラグインごとに最上位の名前空間 (例えば ``DebugKit`` と
いったように) を定義します。規約により、プラグインはそのパッケージ名が名前空間の名前と
なります。
もし別の名前空間名を使いたいなら、プラグインをロードする時に設定することが可能です。

Composer を使ったプラグインインストール
=======================================

`Packagist <http://packagist.org>`_ には多くのプラグインがあり、 ``Composer`` を
使ってインストールが可能です。DebugKit をインストールには、下記のコマンドを実行します。 ::

    php composer.phar require cakephp/debug_kit

これによって最新の DebugKit をインストールして、あなたの **composer.json**, **composer.lock**
ファイルを更新し、 **vendor/cakephp-plugins.php** とオートローダーも更新します。

もしあなたがインストールしたいプラグインが packagist.org になければ、プラグインコードを
**plugins** ディレクトリーにコピーすることもできます。
例えば 'ContactManager' という名前のプラグインをインストールするなら、 ``plugins`` フォルダーの中に
'ContactManager' という名前のフォルダーを作り、この下にプラグインの src, tests といった
フォルダーを作ります。

.. index:: vendor/cakephp-plugins.php

プラグイン マップ ファイル
--------------------------

Composer 経由でインストールすると、 ``vendor/cakephp-plugins.php`` というファイルが
作られることに気付くかもしれません。この設定ファイルにはプラグイン名とファイルシステム上の
配置場所の情報が含まれています。これによって、プラグインを vendor ディレクトリーなど
プラグインディレクトリーの外に配置することが可能になります。 ``Plugin`` クラスは
``load()`` や ``loadAll()`` でプラグインをロードする時に、このファイルを使って
場所を特定します。通常あなたはこのファイルを手動で編集する必要はなく、 Composer や
``plugin-installer`` パッケージが管理してくれます。

プラグインの読み込み
=====================

プラグインをインストールして設定した後、プラグインの読み込みが必要になるかもしれません。
プラグインを１つずつまたは一括で読み込むメソッドがあります。 ::

    // config/bootstrap.php
    // または Application::bootstrap() に記述します。

    // 特定のプラグインを読み込みます。
    Plugin::load('ContactManager');

    // vendor の名前空間の特定のプラグインを読み込みます。
    Plugin::load('AcmeCorp/ContactManager');

    // 全てのプラグインを読み込みます。
    Plugin::loadAll();

``loadAll()`` は存在するプラグイン全てを読み込みます。 ``load()`` も同様に
動きますが、あなたが明示的に指定したプラグインだけを読み込みます。

.. note::

    ``Plugin::loadAll()`` は、 vendor の名前空間に配置されていて
    **vendor/cakephp-plugins.php** に定義されていないプラグインについては
    読み込みません。

また、プラグインを有効にする便利なシェルコマンドがあります。以下の行を実行してください。

.. code-block:: bash

    bin/cake plugin load ContactManager

これは、 ``Plugin::load('ContactManager');`` を bootstrap に書き込みます。

.. _autoloading-plugin-classes:

プラグインクラスの自動読み込み
------------------------------

``bake`` を使ってプラグインを作成したり、 Composer を使ってプラグインをインストール
するなら、基本的に CakePHP にプラグイン内のクラスを認識させるためにプログラムを
修正する必要はありません。

ですが、それ以外の場合は、あなたのアプリーケーションの composer.json に下記のように
追記する必要があります。 ::

    "psr-4": {
        (...)
        "MyPlugin\\": "./plugins/MyPlugin/src",
        "MyPlugin\\Test\\": "./plugins/MyPlugin/tests"
    }

あなたのプラグインが vendor の名前空間を使うなら、パスマッピングの名前空間は下記のように
なるでしょう。 ::

    "psr-4": {
        (...)
        "AcmeCorp\\Users\\": "./plugins/AcmeCorp/Users/src",
        "AcmeCorp\\Users\\Test\\": "./plugins/AcmeCorp/Users/tests"
    }

そして、 Composer の自動読み込みキャッシュを初期化する必要があります。 ::

    $ php composer.phar dumpautoload

もしあなたが何らかの理由で Composer を使う事ができないのなら、代替手段でプラグインの
自動読み込みをおこなう事ができます。 ::

    Plugin::load('ContactManager', ['autoload' => true]);

.. _plugin-configuration:

プラグイン設定
================

``load()`` と ``loadAll()`` メソッドは、プラグイン設定とルーティングを支援します。
特定のカスタムルートや特定プラグインの bootstrap ファイルは、
おそらく自動で読み込みたいでしょう。 ::

    // config/bootstrap.php の中、
    // または Application::bootstrap() の中で

    // loadAll() を使用
    Plugin::loadAll([
        'Blog' => ['routes' => true],
        'ContactManager' => ['bootstrap' => true],
        'WebmasterTools' => ['bootstrap' => true, 'routes' => true],
    ]);

また、プラグインを個別に読み込むことができます。 ::

    // blog を読み込み、routes をインクルード
    Plugin::load('Blog', ['routes' => true]);

    // 設定と初期化を行う bootstrap をインクルード
    Plugin::load('ContactManager', ['bootstrap' => true]);

この設定スタイルは、プラグインの設定やルートを手動で ``include()`` や
``require()`` する必要がなく、自動で正しい時間と正しい場所で読み込まれます。

特定の設定を持たない全てのプラグインを読み込むデフォルトの ``loadAll()`` を設定できます。

以下の例は、全てのプラグインの bootstarp を読み込み、それに加えて Blog プラグインの
routes を読み込みます。 ::

    Plugin::loadAll([
        ['bootstrap' => true],
        'Blog' => ['routes' => true]
    ]);

プラグインで設定された全てのファイルが実際に存在しないと、php が読み込めないファイルごとに
warning が出ます。これは特に、全てのプラグインのデフォルトとして覚えておく事が重要です。
あなたはこの潜在的な警告を、 ``ignoreMissing`` オプションを使用して避けることができます。 ::

    Plugin::loadAll([
        ['ignoreMissing' => true, 'bootstrap' => true],
        'Blog' => ['routes' => true]
    ]);

プラグインを読み込むとき、プラグイン名は名前空間名と一致すべきです。
例えば、最上位の名前空間が ``Users`` のプラグインがあるなら、このように読み込みます。 ::

    Plugin::load('User');

もしあなたが ``AcmeCorp/Users`` といったように、ベンダー名を最上位の名前空間名に
したいのなら、このようにプラグインを読み込みます。 ::

    Plugin::load('AcmeCorp/Users');

クラス名は :term:`プラグイン記法` を使うことで、適切に解決されるでしょう。

ほとんどのプラグインで、設定するための正確な手続きとデータベースのセットアップするための方法が、
ドキュメントに書かれています。他よりセットアップが必要なものもあります。

プラグインの利用
================

クラス名の前にプラグイン名を付けることで、プラグインのコントローラー、
モデル、コンポーネント、ビヘイビアーとヘルパーを参照できます。

例えば、あなたの画面で素敵なコンタクト情報を表示するために、 ContactManager プラグインの
ContactInfoHelper を使いたいとしましょう。この場合、あなたのコントローラーの
``$helpers`` 配列にこのように記述します。 ::

    public $helpers = ['ContactManager.ContactInfo'];

.. note::
    このドット区切りのクラス名は、 :term:`プラグイン記法` と呼ばれます。

すると、あなたが作った他のヘルパー同様に、 ``ContactInfoHelper`` に
アクセスできるようになります。 ::

    echo $this->ContactInfo->address($contact);

プラグイン作成
================

動作サンプルとして、上記を参考に ContactManager を作りましょう。
まず始めに、プラグインの基本ディレクトリー構成を準備します。
それはこのようになります。 ::

    /src
    /plugins
        /ContactManager
            /config
            /src
                /Controller
                    /Component
                /Model
                    /Table
                    /Entity
                    /Behavior
                /View
                    /Helper
                /Template
                    /Layout
            /tests
                /TestCase
                /Fixture
            /webroot

プラグインフォルダーの名前が '**ContactManager**' になっています。このフォルダーが
プラグインと同じ名前になる事が大切です。

プラグインフォルダーの中は CakePHP アプリケーションと同じような構成であることに気づく
思いますが、それが基本的な構成です。使わないフォルダーは作る必要はありません。
コンポーネントとビヘイビアーだけで定義されるプラグインもあれば、'Template' ディレクトリーが
完全に省略されるプラグインもあります。

プラグインは、アプリケーションが持つ Config, Console, webroot 等といったディレクトリーも
設置できます。

Bake を使ってプラグインを作成する
---------------------------------

プラグイン制作の過程は、Bake shell を使えば非常に簡単です。

プラグインを bake するのは以下のコマンドになります。

.. code-block:: bash

    bin/cake bake plugin ContactManager

ここからはもういつも通りの記法で  bake ができます。
例えばコントローラーを bake するには

.. code-block:: bash

    bin/cake bake controller --plugin ContactManager Contacts

もしコマンドラインで問題があれば、 :doc:`/bake/usage` を参照してください。
また、プラグインを作ったら必ずオートローダーを再作成してください。

.. code-block:: bash

    php composer.phar dumpautoload

プラグインコントローラー
========================

ContactManager プラグインのコントローラーは、
**plugins/ContactManager/src/Controller/** に設置されます。主にやりたい事は
contacts の管理ですので、このプラグインには ContactsController が必要です。

そこで ContactsController を **plugins/ContactManager/src/Controller** に設置し、
このように書きます。 ::

    // plugins/ContactManager/src/Controller/ContactsController.php
    namespace ContactManager\Controller;

    use ContactManager\Controller\AppController;

    class ContactsController extends AppController
    {

        public function index()
        {
            //...
        }
    }

まだ作っていないなら、 ``AppController`` も作りましょう。 ::

    // plugins/ContactManager/src/Controller/AppController.php
    namespace ContactManager\Controller;

    use App\Controller\AppController as BaseController;

    class AppController extends BaseController
    {
    }

プラグインの ``AppController`` は、プラグイン内の全コントローラー共通のロジックを
持ちますが、使わないようでしたら作らなくても構いません。

コントローラーにアクセスする前に、プラグインがロードされ、ルートがロードされる必要があります。
これは **config/bootstrap.php** に下記のように記述します。 ::

    Plugin::load('ContactManager', ['routes' => true]);

``Plugin::loadAll()`` を使用する場合、ルートがロードされる必要があります。 ::

    Plugin::loadAll(['routes' => true]);

続いて ContactManager プラグインのルート情報を作成します。
**plugins/ContactManager/config/routes.php** に下記のように追加してください。 ::

    <?php
    use Cake\Routing\Route\DashedRoute;
    use Cake\Routing\Router;

    Router::plugin(
        'ContactManager',
        ['path' => '/contact-manager'],
        function ($routes) {
            $routes->fallbacks(DashedRoute::class);
        }
    );

上記のようにすれば、プラグインのデフォルトルートに接続できるでしょう。
このファイルをカスタマイズすることで、後から個別のルートを設定することができます。

これまでのところでアクセスするなら、 ``/contact-manager/contacts`` にアクセスして
みてください。 "Missing Model" エラーが表示されるでしょうが、これはまだ
Contact モデルが定義されていないためです。

もしあなたのアプリケーションが、CakePHP の提供するデフォルトルーティングを含むなら、
あなたのプラグインコントローラーへは下記のような URL でアクセスできます。 ::

    // プラグインコントローラーの index にアクセスする
    /contact-manager/contacts

    // プラグインコントローラーのそれぞれのアクションにアクセスする
    /contact-manager/contacts/view/1

もしあなたのアプリケーションでルーティングプレフィックスを定義しているなら、
CakePHP のデフォルトルーティングは下記の書式でルーティングします。 ::

    /:prefix/:plugin/:controller
    /:prefix/:plugin/:controller/:action

特定ファイルにルーティングするようなプラグインロードの方法については、
:ref:`プラグインの設定 <plugin-configuration>` の項を参照してください。

bake で作っていないプラグインなら、クラスを自動的に読み込むために
**composer.json** ファイルを編集して、あなたのプラグインを追加する必要があります。
これについては :ref:`プラグインクラスの自動読み込み <autoloading-plugin-classes>`
の項を参照してください。

.. _plugin-models:

プラグインモデル
==================

プラグインのモデルは **plugins/ContactManager/src/Model** に設置されます。
既にこのプラグインの ContactsController は定義してありますから、このコントローラーの
ためのテーブルとエンティティーを作成しましょう。 ::

    // plugins/ContactManager/src/Model/Entity/Contact.php:
    namespace ContactManager\Model\Entity;

    use Cake\ORM\Entity;

    class Contact extends Entity
    {
    }

    // plugins/ContactManager/src/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table
    {
    }

エンティティークラスを作った時や関連付けを行いたい時など、あなたのプラグイン内のモデルを
参照したい場合には、プラグイン名とクラス名をドットで区切る必要があります。例えば::

    // plugins/ContactManager/src/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasMany('ContactManager.AltName');
        }
    }

もし関連付け配列のキーにプラグインの接頭語をつけたくないのなら、代わりにこのような
構文が使えます。 ::

    // plugins/ContactManager/src/Model/Table/ContactsTable.php:
    namespace ContactManager\Model\Table;

    use Cake\ORM\Table;

    class ContactsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasMany('AltName', [
                'className' => 'ContactManager.AltName',
            ]);
        }
    }

おなじみの :term:`プラグイン記法` を使う事で、プラグインのテーブルを
読み込むために ``TableRegistry`` を使用することができます。 ::

    use Cake\ORM\TableRegistry;

    $contacts = TableRegistry::get('ContactManager.Contacts');

あるいは、コントローラーの処理の中で以下のように使用できます。 ::

    $this->loadModel('ContactsMangager.Contacts');

プラグインビュー
=================

ビューは通常のアプリケーション内と同じように動作します。
``plugins/[PluginName]/src/Template/`` フォルダーの中の正しいフォルダー内に配置するだけです。
我々の ContactManager プラグインでは ``ContactsController::index()`` アクションに
ビューが必要ですから、このような内容になります。 ::

    // plugins/ContactManager/src/Template/Contacts/index.ctp:
    <h1>Contacts</h1>
    <p>Following is a sortable list of your contacts</p>
    <!-- A sortable list of contacts would go here....-->

プラグインは独自のレイアウトを提供することができます。
プラグインレイアウトを追加するためには、テンプレートファイルを
``plugins/[PluginName]/src/Template/Layout`` に配置します。
プラグインレイアウトをコントローラーで使用するには、下記のようにします。 ::

    public $layout = 'ContactManager.admin';

プラグイン接頭辞を省略した場合は、レイアウトやビューファイルは通常のものを使用します。

.. note::

    プラグインからのエレメントの使い方については、
    :ref:`view-elements` を参照してください。

アプリケーション内からプラグインテンプレートをオーバーライドする
----------------------------------------------------------------

プラグインのビューはあるパスを使ってオーバーライドできます。
仮にあなたが 'ContactManager' という名前のプラグインを持っているとして、
**src/Template/Plugin/[Plugin]/[Controller]/[view].ctp** というファイルを作って
そこにビューロジックを書いておけば、プラグインのテンプレートファイルをオーバーライド
することができます。
Contacts コントローラーなら、以下のようなファイルを作成します。 ::

    src/Template/Plugin/ContactManager/Contacts/index.ctp

このファイルを作成すると、 **plugins/ContactManager/src/Template/Contacts/index.ctp** を
オーバーライドします。

もし、あなたのプラグインが composer の依存関係の中にある場合 (例えば 'TheVendor/ThePlugin')、
Custom コントローラーの 'index' ビューへのパスは、以下の通りです。 ::

    src/Template/Plugin/TheVendor/ThePlugin/Custom/index.ctp

このファイルを作成すると、 **vendor/thevendor/theplugin/src/Template/Custom/index.ctp** を
オーバーライドします。

.. _plugin-assets:

プラグインアセット
====================

プラグインの Web アセット （PHP 以外のファイル）は、メインアプリケーションのアセットと
同様にプラグインの ``webroot`` ディレクトリーを介して配信されます。 ::

    /plugins/ContactManager/webroot/
                                   css/
                                   js/
                                   img/
                                   flash/
                                   pdf/

通常の webroot と同じようにどのディレクトリーにどんなファイルでも置くことができます。

.. warning::

    ディスパッチャーを介して静的アセット (画像や JavaScript や CSS ファイル) を取り扱うことは
    非常に非効率です。
    詳細は :ref:`アプリケーションのパフォーマンスの向上 <symlink-assets>` をご覧ください。


プラグイン内のアセットへのリンク
--------------------------------

:php:class:`~Cake\\View\\Helper\\HtmlHelper` の script, image, css メソッドを使って
プラグイン内のアセットへのリンクを作りたい場合、 :term:`プラグイン記法` が使えます。 ::

    // /contact_manager/css/styles.css への URL を生成します
    echo $this->Html->css('ContactManager.styles');

    // /contact_manager/js/widget.js への URL を生成します
    echo $this->Html->script('ContactManager.widget');

    // /contact_manager/img/logo.jpg への URL を生成します
    echo $this->Html->image('ContactManager.logo');

プラグインのアセットは、デフォルトで ``AssetFilter`` というディスパッチャーフィルターを
使用して提供されます。これは開発時のみ使用することが推奨されます。
公開環境ではパフォーマンスを向上させるために、
:ref:`プラグインのアセットをシンボリックリンク化 <symlink-assets>` すべきです。

もしあなたがヘルパーを使わないなら、プラグインのアセットを提供するためには URL の先頭に
プラグイン名を付加します。 '/contact_manager/js/some_file.js' へのリンクで、
**plugins/ContactManager/webroot/js/some_file.js** というアセットを提供します。

コンポーネント、ヘルパーとビヘイビアー
======================================

プラグインには通常の CakePHP アプリケーションと同じように、コンポーネント、ヘルパー、
ビヘイビアーを持つ事ができます。あなたはコンポーネント、ヘルパー、ビヘイビアーだけからなる
プラグインを作る事もできます。これはコンポーネントを他のプロジェクトに簡単に導入すれば
再利用可能となるような素晴らしい方法です。

このようなコンポーネントを作る事は、実際、通常のアプリケーションとして作る事と同じであり、
特別な命名規則もありません。

プラグインの内部や外部からコンポーネントを参照する方法は、コンポーネント名の前に
プラグイン名を付けるだけです。例えば::

    // 'ContactManager' プラグインのコンポーネントとして定義
    namespace ContactManager\Controller\Component;

    use Cake\Controller\Component;

    class ExampleComponent extends Component
    {
    }

    // あなたのコントローラーで下記のように呼び出す
    public function initialize()
    {
        parent::initialize();
        $this->loadComponent('ContactManager.Example');
    }

同じテクニックはヘルパーとビヘイビアーにも使えます。


プラグインの拡張
=================

この例は、プラグインを作るための一つの良い開始方法であって、他にも色んな方法があります。
一般的なルールとして、アプリケーションでできることは、プラグインでもできます。

まずは、'vendor' にサードパーティのライブラリーを設置し、 cake console に新しい shell
を追加します。さらに、利用者が自動で出来る、プラグインの機能をテストするためのテストケースを
作成する事を忘れないでください。

ContactManager の例だと、ContactsController 内に add/remove/edit/delete
アクションを作り、 Contact モデルに validation を作成し、contact 管理する時に必要な機能を
実装します。あなたのプラグインをどのように実装するかはあなた次第です。
ただ、誰もがあなたの素晴らしい、再利用可能なコンポーネントの恩恵を受けることが
できるように、コミュニティーであなたのコードを共有することを忘れないでください！


プラグインの公開
===================

あなたのプラグインを `plugins.cakephp.org <https://plugins.cakephp.org>`_ に追加できます。
こちらでは、他の人々は composer の依存関係として使用することができます。
`awesome-cakephp list <https://github.com/FriendsOfCake/awesome-cakephp>`_
に申し込みできます。

パッケージ名にセマンティックな意味のある名前を選んでください。これは、理想を言えば、
"cakephp" をフレームワークとして依存関係を設定するべきです。
ベンダー名は、通常あなたの GitHub ユーザー名になります。
CakePHP 名前空間 (cakephp) を **使用しない** でください。
これは、CakePHP 自身のプラグインのために予約されています。
小文字と区切り文字のダッシュを使用することが決まりです。

もし、あなたの GitHub アカウントが "FooBar" で "Logging" プラグインを作成する場合、
`foo-bar/cakephp-logging` と名付けるといいでしょう。
そして、CakePHP 自身の "Localized" プラグンは、 `cakephp/localized` で見つけられます。

.. meta::
    :title lang=ja: Plugins
    :keywords lang=ja: plugin folder,plugins,controllers,models,views,package,application,database connection,little space
