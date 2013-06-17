プラグイン
##########

CakePHP では、コントローラ・モデル・ビューのコンビをセットアップし、
パッケージしたアプリケーションプラグインとしてリリースできます。
他の人はそのプラグインを自身の CakePHP アプリケーションで使用することができます。
素敵なユーザ管理モジュールやシンプルなブログやアプリケーションの１つのウェブサービスモジュールはありませんか？
それを CakePHP プラグインとしてパッケージすると、他のアプリケーションにそれを追加できます。

プラグインとそれをインストールするアプリケーション間の主な結びつきは、
アプリケーションの設定（データベース接続など）です。
しかし、プラグインはそれ自身の狭い環境で動作しますが、
あたかもそれ自身がアプリケーションであるかのように振る舞います。

プラグインインストール
======================

プラグインをインストールするためには、単に app/Plugin フォルダーに
プラグインフォルダを落とすところから始めます。
もし 'ContactManager' というプラグインをインストールするなら、 app/Plugin に 'ContactManager' というフォルダを作成し、
その下にプラグインの View, Model, Controller, webroot とその他のディレクトリを作成します。

CakePHP2.0 の変更点として、プラグインは app/Config/bootstrap.php から手動でロードが必要です。

シングルコールで、一つまたは全部をロードできます。

::

    CakePlugin::loadAll(); // 全て読み込み
    CakePlugin::load('ContactManager'); //一つだけ読み込み


設定で記述されたプラグインは、 loadAll ですべてのプラグインで利用できます。
``load()`` も同様の働きですが、明示的に指定したプラグインだけロードします。

プラグイン設定
==============

プラグイン設定とルーティングは、 load と loadAll メソッドで多くの方法が提供されています。
特定のカスタムルートや特定プラグインのbootstrapファイルは、おそらく自動で読み込みたいでしょう。

このようにすれば問題ありません。

::

    CakePlugin::loadAll(array(
        'Blog' => array('routes' => true),
        'ContactManager' => array('bootstrap' => true),
        'WebmasterTools' => array('bootstrap' => true, 'routes' => true),
    ));

この設定スタイルは、プラグインの設定やルートを手動で include() や require() する必要がなく、
自動で正しい時間と正しい場所で読み込まれます。
実際に同じパラメータで load() メソッドも利用でき、３つのプラグインだけが読み込まれ、その他は読み込まれません。

最後に、特定の設定の無いプラグインを全て読み込むデフォルトの loadAll を設定できます。
全てのプラグインのbootstarpと、ブログプラグインからルートを読み込みます。

::

    CakePlugin::loadAll(array(
        array('bootstrap' => true),
        'Blog' => array('routes' => true)
    ));

プラグインで設定された全てのファイルが実際に存在しないと、phpが読み込めないファイルごとにwarningが出ます。
これは特に、全てのプラグインのデフォルトとして覚えておく事が重要です。


さらに、プラグインはデータベースに一つまたはいくつかのテーブルが必要な場合があります。
この場合、cake shellでこのようにコールできるスキーマファイルが含まれます。

::

    user@host$ cake schema create --plugin ContactManager

ほとんどのプラグインで、設定するための正確な手続きとデータベースのセットアップするための方法が、ドキュメントに書かれています。
他よりセットアップが必要なものもあります。

Advanced bootstrapping
======================

もし、一つのプラグインに対して１つ以上のbootstrapを読み込ませたい場合、ブートストラップの設定キーを配列で指定できます。

::

    CakePlugin::loadAll(array(
        'Blog' => array(
            'bootstrap' => array(
                'config1',
                'config2'
            )
        )
    ));

読み込み済みプラグインが呼ばれるのに必要な関数を指定できます。

::

    function aCallableFunction($pluginName, $config) {
        
    }

    CakePlugin::loadAll(array(
        'Blog' => array(
            'bootstrap' => 'aCallableFunction'
        )
    ));

プラグインの利用
================

クラス名の前にプラグイン名を付けることで、プラグインのcontrollers,models,components,behaviors, そして helpersが参照できます。 

例えば、viewsの一つにカワイイコンタクト情報を出力しようと、
ContacktMangerプラグインのContactInfoHelperを使いたい場合、
コントローラ内で、このように$helplers配列をこのように用意します。

::

    public $helpers = array('ContactManager.ContactInfo');

すると、他のヘルパー同様に、ContactInfoHelperにアクセスできるようになります。

::

    echo $this->ContactInfo->address($contact);


プラグイン作成
=========================

動作サンプルとして、上記を参考にContactManagerを作りましょう。
先ず始めに、プラグインの基本ディレクトリ構成を準備します。
それはこのようになります。

::

    /app
        /Plugin
            /ContactManager
                /Controller
                    /Component
                /Model
                    /Behavior
                /View
                    /Helper
                    /Layouts
 

プラグインフォルダーの名前は、 '**ContactManager**' となります。
プラグインと同じ名前のフォルダになることが重要です。
                    
..
 Note the name of the plugin folder, '**ContactManager**'. It is important
 that this folder has the same name as the plugin.

プラグインフォルダー内では、CakePHPアプリケーションのような構成が多くあるのに気づくかと思いますが、
それが基本的な構成です。
使わないフォルダには、何も入れる必要はありません。
コンポーネントとビヘイビアだけで定義されるプラグインもあれば、Viewディレクトリが完全に省略されるプラグインもあります。

プラグインは、アプリケーションが持つ Config, Console, Lib, webroot, 等といったディレクトリも設置できます。


.. note::
        URLでプラグインにアクセスできるようにしたい場合、AppControllerとAppModelへの定義が必要です。
        この２つの特別なクラスはプラグインの後に名前をつけて、アプリケーションのAppControllerとAppModelを親として継承します。
        ContacktManagerの例ではこうなります。

::

    // /app/Plugin/ContactManager/Controller/ContactManagerAppController.php:
    class ContactManagerAppController extends AppController {
    }

::

    // /app/Plugin/ContactManager/Model/ContactManagerAppModel.php:
    class ContactManagerAppModel extends AppModel {
    }

もしこれらの特別なクラスの定義を忘れると、"Missing Controller"エラーがでます。

プラグイン制作の過程は、Cake shellを使えば非常に簡単です。

プラグインをbakeするのは以下のコマンドになります。

::

    user@host$ cake bake plugin ContactManager


そうすると、いつも通りのbakeができます。
例えばcontrollersをbakeするには

::

    user@host$ cake bake controller Contacts --plugin ContactManager

もしコマンドラインで問題があれば、ここのチャプターを参照してください
:doc:`/console-and-shells/code-generation-with-bake`


プラグインコントローラー
========================

ContactManagerプラグインのコントローラーは、/app/Plugin/ContactManager/Controller/に設置されます。
主にやりたい事はcontactsの管理ですので、このプラグインにはContactsControllerが必要です。

そこでContactsControllerを/app/Plugin/ContactManager/Controllerに設置し、このように書きます。

::

    // app/Plugin/ContactManager/Controller/ContactsController.php
    class ContactsController extends ContactManagerAppController {
        public $uses = array('ContactManager.Contact');

        public function index() {
            //...
        }
    }


.. note::
        このコントローラは、アプリケーションの AppController の親としてではなく、
        プラグインのAppControllerを継承します（ ContactManagerAppController という名前で）。

        また、モデルの名前の付け方は、プラグインの名前が接頭語としてつきます。
        これは、プラグイン内のモデルとメインのアプリケーション内のモデルの区別が必要だからです。

        この場合、 $uses 配列は、 ContactManager を必要としません。
        Contactはこのコントローラのデフォルトのモデルで、プラグイン名がどう正確にプリペンドされるかのサンプルになります。

これまで行ってきたものにアクセスしたい場合、 /contact_manager/contacts にアクセスします。
Contact model をまだ定義してないので、“Missing Model”エラーがでるはずです。

.. _plugin-models:

プラグインモデル
================

プラグインのモデルは /app/Plugin/ContactManager/Model に設置されます。
プラグインのContactsControllerは既に定義してあるので、そのモデルを作成します。

::

    // /app/Plugin/ContactManager/Model/Contact.php:
    class Contact extends ContactManagerAppModel {
    }

/contact_manager/contacts に（‘contacts’テーブルがある状態で）今アクセスすると、“Missing View”エラーが発生します。
次にこれを作ります。

.. note::
   もしプラグイン内のモデルを参照したいなら、ドットで区切られた、モデル名といっしょのプラグイン名を含む必要があります。 

例えば

::

    // /app/Plugin/ContactManager/Model/Contact.php:
    class Contact extends ContactManagerAppModel {
        public $hasMany = array('ContactManager.AltName');
    }

プラグインの接頭語との連携の無い配列キーを参照したいなら、代わりのシンタックスを使います。

::

    // /app/Plugin/ContactManager/Model/Contact.php:
    class Contact extends ContactManagerAppModel {
        public $hasMany = array(
            'AltName' => array(
                'className' => 'ContactManager.AltName'
            )
        );
    }

プラグインビュー
================

ビューは通常のアプリケーション内での動作として振る舞います。
/app/Plugin/[PluginName]/View/ フォルダー内に設置するだけです。
ContactManagerプラグインでは、ContactsController::index() actionのviewが必要になるので、
このような内容になります。

::

    // /app/Plugin/ContactManager/View/Contacts/index.ctp:
    <h1>Contacts</h1>
    <p>Following is a sortable list of your contacts</p>
    <!-- A sortable list of contacts would go here....-->

.. note::

        プラグインからのエレメントの使い方に関する情報は、ここを参照してください。
        :ref:`view-elements`

アプリケーション内でのプラグインビューのオーバーライド
------------------------------------------------------

プラグインのビューはあるパスを使ってオーバーライドできます。
'ContactManager'という名のプラグインがあるなら、
"app/View/Plugin/[Plugin]/[Controller]/[view].ctp"というテンプレートを作成することでオーバーライドできます。
Contacts controllerにはこのファイルを作ります。

::

    /app/View/Plugin/ContactManager/Contacts/index.ctp

このファイルを作れば、オーバーライドできます。"/app/Plugin/ContactManager/View/Contacts/index.ctp"

.. _plugin-assets:


プラグインアセット
==================

プラグインのウェブアセット（phpファイルではない）は、 プラグインの'webroot' ディレクトリを通して受け取られます。

::

    app/Plugin/ContactManager/webroot/
                                        css/
                                        js/
                                        img/
                                        flash/
                                        pdf/

通常のwebrootと同じようにどのディレクトリにどんなファイルでも置くことができます。
ただ制限として、 ``MediaView`` はそのアセットのmime-typeを知っておく必要があります。

ただ、プラグインの静的アセットや画像やJavaScriptまたはCSSは、
ディスパチャーを経由しますが、非常に効率が悪くなることを覚えておいてください。
ですので、本番環境ではそれらにシンボリックリンクを張っておくことを強くおすすめします。
例えばこのようにします。::

    ln -s app/Plugin/YourPlugin/webroot/css/yourplugin.css app/webroot/css/yourplugin.css

プラグイン内のアセットへのリンク
--------------------------------

プラグイン内のアセットへのリクエストの始めは、単に /plugin_name/ を頭に付けるだけで、アプリケーションのwebrootとして動作します。

例えば、'/contact_manager/js/some_file.js'へのリンクは、
'app/Plugin/ContactManager/webroot/js/some_file.js' で受け取れます。

.. note::

        アセットのパスの前に **/your_plugin/** に付けるのが重要です。魔法のようなことが起きます！

.. versionchanged:: 2.1
    アセットのリクエストには :term:`plugin syntax` を使用してください。View での利用方法:
    <?php echo $this->Html->css("ContactManager.style"); ?>

コンポーネント、ヘルパーとビヘイビア
====================================

コンポーネント、ヘルパーやビヘイビアを持つプラグインは、通常のCakePHPアプリケーションのようなものです。
コンポーネントだけ、または、ヘルパーやビヘイビアだけを含むプラグインも作る事が可能で、
他のプロジェクトで簡単に使えるような、再利用できるコンポーネントを作るすばらしい方法にもなり得ます。

このようなコンポーネントを作る事は、実際、通常のアプリケーションとして作る事と同じであり、
特別な名前をつける必要はありません。

プラグインの内部や外部からコンポーネントを参照する方法は、コンポーネント名の前にプラグイン名を付けるだけです。
例えば、

::

    // Component defined in 'ContactManager' plugin
    class ExampleComponent extends Component {
    }
    
    // within your controllers:
    public $components = array('ContactManager.Example'); 

同じテクニックはヘルパーとビヘイビアにも使えます。

.. note::

        AppHelperを探すヘルパーを作った場合、自動で利用は出来ません。
        Usesに定義する必要があります。
        ::

                // Declare use of AppHelper for your Plugin's Helper
                App::uses('AppHelper', 'View/Helper');


プラグインの拡張
==================

この例は、プラグインを作るための一つの良い開始方法であって、他にも色んな方法があります。
通常のルールでは、つまりアプリケーションでできることは、プラグインでもできます。

まずは、'Vendor'にサードパーティのライブラリを設置し、 
cake console に新しい shell を追加します。
さらに、利用者が自動で出来る、プラグインの機能をテストするためのテストケースを作成する事を忘れないでください。

ContactManagerの例だと、ContactsController内にadd/remove/edit/delete アクションを作り、
Contact modelにvalidationを作成し、contact管理機能を追加します。
プラグインの改良の仕方もあなた次第で決めれます。
コミュニティ内でコード共有を忘れないのでください。
その誰もが、あなたの素晴らしい、再利用可能なコンポーネントの恩恵を受けることができます！

プラグインTips
==============

一度、プラグインを /app/Plugin にインストールすると、 /plugin_name/controller_name/action 
というURLでアクセスできます。ContactManagerの例だと、ContactsControllerには /contact_manager/contacts でアクセスできます。

CakePHPアプリケーションで動作するプラグインの最後のtipsです。

-  [Plugin]AppController and [Plugin]AppModel が無ければ、
   プラグインコントローラにアクセスしようとすると、 missing Controller エラーになります。
-  プラグインのレイアウトは定義可能で、app/Plugin/[Plugin]/View/Layoutsに含まれます。
   一方でプラグインは、デフォルトは/app/View/Layouts フォルダからレイアウトを利用します。
-  コントローラ内で ``$this->requestAction('/plugin_name/controller_name/action');`` と書くと
   内部プラグインとコミュニケーションができます。
-  requestActionを使う際は、コントローラ名とモデル名がユニークであることを確認してください。
   そうしないと、"redefined class ..."エラーが発生します。

