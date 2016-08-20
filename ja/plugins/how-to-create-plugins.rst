プラグインの作成
################

動作サンプルとして、 :doc:`/plugins/how-to-use-plugins` セクションを参考に ContactManager
プラグインを作りましょう。 先ず始めに、プラグインの基本ディレクトリ構成を準備します。
それはこのようになります。 ::

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

プラグインフォルダーの名前は、 ‘'**ContactManager**'‘ となります。 プラグインと同じ
名前のフォルダになることが重要です。

プラグインフォルダー内では、CakePHP アプリケーションのような構成が多くあるのに気づくと
思いますが、 それが基本的な構成です。 使わないフォルダには、何も入れる必要はありません。
コンポーネントとビヘイビアだけで定義されるプラグインもあれば、 'View' ディレクトリが
完全に省略されるプラグインもあります。

プラグインは、アプリケーションが持つ Config, Console, Lib, webroot 等といった
ディレクトリも設置できます。

.. note::

    URL でプラグインにアクセスできるようにしたい場合、AppController と AppModel への
    定義が必要です。 この２つの特別なクラスはプラグインの後に名前をつけて、
    アプリケーションの AppController と AppModel を継承します。
    ContacktManager の例ではこうなります。

::

    // /app/Plugin/ContactManager/Controller/ContactManagerAppController.php:
    class ContactManagerAppController extends AppController {
    }

::

    // /app/Plugin/ContactManager/Model/ContactManagerAppModel.php:
    class ContactManagerAppModel extends AppModel {
    }

もしこれらの特別なクラスの定義を忘れると、”Missing Controller” エラーがでます。

プラグインの作成は、cake シェルを使えば非常に簡単です。

プラグインを bake するのは以下のコマンドになります。 ::

    user@host$ cake bake plugin ContactManager

そうすると、いつも通りの bake ができます。 例えば controllers を bake するには::

    user@host$ cake bake controller Contacts --plugin ContactManager

もしコマンドラインで問題があれば、
:doc:`/console-and-shells/code-generation-with-bake`
のチャプターを参照してください

.. warning::

    プラグインは、コードの分離のための名前空間は機能しません。
    古いバージョンの PHP には名前空間が無いためです。
    プラグインの中で、同じクラスやファイル名を使用できません。
    ２つの異なるプラグインであってもです。
    プラグイン名をクラスやファイル名にプレフィックスをつけて
    ユニークなクラスやファイル名を使用してください。

プラグインコントローラ
======================

ContactManager プラグインのコントローラーは、
/app/Plugin/ContactManager/Controller/ に設置されます。 主にやりたい事は
contacts の管理ですので、このプラグインには ContactsController が必要です。

そこで ContactsController を /app/Plugin/ContactManager/Controller に設置し、
このように書きます。 ::

    // app/Plugin/ContactManager/Controller/ContactsController.php
    class ContactsController extends ContactManagerAppController {
        public $uses = array('ContactManager.Contact');

        public function index() {
            //...
        }
    }

.. note::

    このコントローラは、親アプリケーションの AppController ではなく、 （
    ContactManagerAppController という名前の）プラグインの
    AppController を継承します。

    モデルの名前の頭にプラグイン名がつくことにも注意してください。 これは、
    プラグイン内のモデルとメインのアプリケーション内のモデルの区別が必要だからです。

    今回の例では、ContactManager.Contact はこのコントローラのデフォルトの
    モデルなのですから、 $uses 配列に書く必要は無かったかもしれませんが、
    プラグイン名を正しく頭につける方法を示すためにここでは書いています。

これまで行ってきたものにアクセスしたい場合、 /contact_manager/contacts
にアクセスします。 Contact モデルをまだ定義してないので、 “Missing Model”
エラーがでるはずです。

.. _plugin-models:

プラグインモデル
================

プラグインのモデルは /app/Plugin/ContactManager/Model に設置されます。
プラグインの ContactsController は既に定義してあるので、そのモデルを作成します。 ::

    // /app/Plugin/ContactManager/Model/Contact.php:
    class Contact extends ContactManagerAppModel {
    }

/contact_manager/contacts に（contacts テーブルがある状態で）
今アクセスすると、“Missing View” エラーが発生します。 次にこれを作ります。

.. note::

    もしプラグイン内のモデルを参照したいなら、ドットで区切られた、
    モデル名といっしょのプラグイン名を含む必要があります。

例えば::

    // /app/Plugin/ContactManager/Model/Contact.php:
    class Contact extends ContactManagerAppModel {
        public $hasMany = array('ContactManager.AltName');
    }

プラグインの接頭語との連携の無い配列キーを参照したいなら、代わりのシンタックスを使います。 ::

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
ContactManager プラグインでは、ContactsController::index()
アクションのビューが必要になるので、 このような内容になります。 ::

    // /app/Plugin/ContactManager/View/Contacts/index.ctp:
    <h1>Contacts</h1>
    <p>Following is a sortable list of your contacts</p>
    <!-- A sortable list of contacts would go here....-->

.. note::

    プラグインからのエレメントの使い方に関する情報は、 :ref:`view-elements`
    を参照してください。

アプリケーション内でのプラグインビューのオーバーライド
------------------------------------------------------

プラグインのビューはあるパスを使ってオーバーライドできます。 ContactManager
という名のプラグインがあるなら、 “app/View/Plugin/[Plugin]/[Controller]/[view].ctp”
というテンプレートを作成することでオーバーライドできます。 Contacts コントローラーには
このファイルを作ります。 ::

    /app/View/Plugin/ContactManager/Contacts/index.ctp

このファイルを作れば、
”/app/Plugin/ContactManager/View/Contacts/index.ctp”
を上書きできます。

.. _plugin-assets:

プラグインアセット
==================

プラグインのウェブアセット（php ファイルではない）は、 プラグインの
’webroot’ ディレクトリを通して受け取られます。 ::

    app/Plugin/ContactManager/webroot/
                                        css/
                                        js/
                                        img/
                                        flash/
                                        pdf/

通常の webroot と同じようにどのディレクトリにどんなファイルでも置くことができます。 

ただ、プラグインの静的アセットや画像や JavaScript または CSS は、 ディスパチャーを
経由しますが、非常に効率が悪くなることを覚えておいてください。 ですので、本番環境では
それらにシンボリックリンクを張っておくことを強くおすすめします。
例えばこのようにします。 ::

    ln -s app/Plugin/YourPlugin/webroot/css/yourplugin.css app/webroot/css/yourplugin.css

プラグイン内のアセットへのリンク
--------------------------------

プラグイン内のアセットへのリクエストの始めは、単に /plugin_name/
を頭に付けるだけで、アプリケーションの webroot として動作します。

例えば、’/contact_manager/js/some_file.js’ へのリンクは、
‘app/Plugin/ContactManager/webroot/js/some_file.js’ で受け取れます。

.. note::

    アセットのパスの前に **/your_plugin/** に付けるのが重要です。
    魔法のようなことが起きます！

.. versionchanged:: 2.1

    アセットのリクエストには :term:`プラグイン記法` を使用してください。 View での利用方法::

        <?php echo $this->Html->css("ContactManager.style"); ?>

コンポーネント、ヘルパーとビヘイビア
=====================================

コンポーネント、ヘルパーやビヘイビアを持つプラグインは、通常の CakePHP アプリケーションの
ようなものです。 コンポーネントだけ、または、ヘルパーやビヘイビアだけを含むプラグインも
作る事が可能で、 他のプロジェクトで簡単に使えるような、再利用できるコンポーネントを作る
すばらしい方法にもなり得ます。

このようなコンポーネントを作る事は、実際、通常のアプリケーションとして作る事と同じであり、 
特別な命名規則もありません。

プラグインの内部や外部からコンポーネントを参照する方法は、
コンポーネント名の前にプラグイン名を付けるだけです。 例えば、 ::

    // 'ContactManager' プラグインのコンポーネントとして定義
    class ExampleComponent extends Component {
    }

    // あなたのコントローラで下記のように呼び出す
    public $components = array('ContactManager.Example');

同じテクニックはヘルパーとビヘイビアにも使えます。

.. note::

    AppHelper を探すヘルパーを作った場合、自動で利用は出来ません。
    Uses に定義する必要があります。::

        // Declare use of AppHelper for your Plugin's Helper
        App::uses('AppHelper', 'View/Helper');

プラグインの拡張
==================

この例は、プラグインを作るための一つの良い開始方法であって、他にも色んな方法があります。 
通常のルールでは、つまりアプリケーションでできることは、プラグインでもできます。

まずは、’Vendor’ にサードパーティのライブラリを設置し、 cake console に新しい shell
を追加します。 さらに、利用者が自動で出来る、プラグインの機能をテストするためのテストケースを
作成する事を忘れないでください。

ContactManager の例だと、ContactsController 内に add/remove/edit/delete
アクションを作り、 Contact モデルに validation を作成し、contact 管理機能を追加します。
プラグインの改良の仕方もあなた次第で決めれます。 コミュニティ内でコード共有を忘れないので
ください。 その誰もが、あなたの素晴らしい、再利用可能なコンポーネントの恩恵を受けることができます！

プラグイン Tips
================

一度、プラグインを /app/Plugin にインストールすると、
/plugin_name/controller_name/action というURLでアクセスできます。
ContactManager の例だと、ContactsController には
/contact_manager/contacts でアクセスできます。

CakePHP アプリケーションで動作するプラグインの最後の tips です。

-  [Plugin]AppController と [Plugin]AppModel が無ければ、 
   プラグインコントローラにアクセスしようとすると、 missing Controller エラーになります。
-  プラグインのレイアウトは定義可能で、app/Plugin/[Plugin]/View/Layouts に含まれます。
   一方でプラグインは、デフォルトは /app/View/Layouts フォルダからレイアウトを利用します。
-  コントローラ内で ``$this->requestAction('/plugin_name/controller_name/action');``
   と書くと 内部プラグインとコミュニケーションができます。
-  requestAction を使う際は、コントローラ名とモデル名がユニークであることを確認してください。
   そうしないと、”redefined class ...” エラーが発生します。
-  拡張子であなたのプラグインへのルーティングを追加するとき、アプリケーションのルーティングを
   上書きせずに、必ず ``Router::setExtensions()`` を使用してください。

プラグインの公開
===================

あなたのプラグインを `plugins.cakephp.org <http://plugins.cakephp.org>`_ に追加できますし、
`awesome-cakephp list <https://github.com/FriendsOfCake/awesome-cakephp>`_
に申し込みできます。

また、composer.json ファイルを作成し、あなたのプラグインを
`packagist.org <https://packagist.org/>`_ に公開してみたくありませんか。
これは Composer を通して簡単にあなたのプラグインが使用できる方法です。

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
    :title lang=ja: プラグインの作成
    :keywords lang=ja: プラグインフォルダ,configuration database,管理モジュール,小さな空間,webroot,contactmanager,array,config,cakephp,モデル,php,ディレクトリ,ブログ,プラグイン,アプリケーション
