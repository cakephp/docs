プラグイン
##########

CakePHP
では、コントローラ・モデル・ビューのコンビをセットアップし、パッケージしたアプリケーションプラグインとしてリリースできます。他の人はそのプラグインを自身の
CakePHP
アプリケーションで使用することができます。素敵なユーザ管理モジュールやシンプルなブログやアプリケーションの１つのウェブサービスモジュールはありませんか？それを
CakePHP
プラグインとしてパッケージすると、他のアプリケーションにそれを追加できます。

プラグインとそれをインストールするアプリケーション間の主な結びつきは、アプリケーションの設定（データベース接続など）です。しかし、プラグインはそれ自身の狭い環境で動作しますが、あたかもそれ自身がアプリケーションであるかのように振る舞います。

プラグインを作成する
====================

実際に動作するサンプルとして、ピザを注文する新しいプラグインを作成しましょう。始めるには、/app/plugins
フォルダ内にプラグインファイルを置く必要があります。すべてのプラグインファイルの親フォルダ名は重要で、多くのところで使用されるので、注意して選びます。このプラグインには、'**pizza**\ '
という名前を使用しましょう。結局次のようになります:

::

    /app
         /plugins
             /pizza
                 /controllers                <- ここにプラグインコントローラを置く
                 /models                     <- ここにプラグインモデルを置く
                 /views                      <- ここにプラグインビューを置く
                 /pizza_app_controller.php   <- プラグインの AppController
                 /pizza_app_model.php        <- プラグインの AppModel 

URL
を使用してプラグインにアクセスできるようにしたい場合は、プラグイン用の
AppController や AppModel
を定義することが必要です。これら２つの特別なクラスはプラグイン名を前につけます。また親アプリケーションの
AppController や AppModel を継承します。ピザの例は次のようになります:

::

    // /app/plugins/pizza/pizza_app_controller.php:
    <?php
    class PizzaAppController extends AppController {
         //...
    }
    ?>

::

    // /app/plugins/pizza/pizza_app_model.php:
    <?php
    class PizzaAppModel extends AppModel {
           //...
    }
    ?>

特別クラスを定義し忘れた場合、CakePHP は定義されるまでは "Missing
Controller" エラーを出します。

Cake
シェルを使えば、プラグインの作成手順がとても簡単になることに気づいてください。

プラグインを作成するには、以下のコマンドを使用します。

::

    user@host$ cake bake plugin pizza

これで、残りのアプリに対しても同じ規則にしたがって作成できます。例えば、コントローラを作成する場合：

::

    user@host$ cake bake plugin pizza controller ingredients

コマンドラインを使った際に何か問題がある場合は、\ `コード生成に関する章 </ja/view/1522/Code-Generation-with-Bake>`_
を参照してください。

プラグインコントローラ
======================

ピザプラグイン用のコントローラは /app/plugins/pizza/controllers/
に設置します。ピザの注文が主な目的ですので、このプラグインには
OrdersController が必要です。

特に必要性が無い限り、親アプリケーションとの名前空間の衝突を避けるために、プラグインコントローラの名前は比較的ユニークなものにすることをお勧めします。親アプリケーションに、UsersController,
OrdersController, ProductsController
があるだろうと深く考える必要はありません:
コントローラ名は創造的であるべきと思うかもしれませんが、クラス名の前にプラグイン名を付けます(この場合、
PizzaOrdersController)。

では /app/plugins/pizza/controllers に新しい PizzaOrdersController
を設置します。中身は次のようになります:

::

    // /app/plugins/pizza/controllers/pizza_orders_controller.php
    class PizzaOrdersController extends PizzaAppController {
        var $name = 'PizzaOrders';
        var $uses = array('Pizza.PizzaOrder');
        function index() {
            //...
        }
    }

このコントローラが、親アプリケーションの AppController
ではなくプラグインの AppController (PizzaAppController
と呼びます)をどのように継承しているかに注意してください。

モデル名がプラグイン名を前置詞にしていることにも注意してください。このコードは意図を明確にするために意識的に追加されていますが、この例においては本来必要ではありません。

このプラグインコントローラにアクセスしたい場合、 /pizza/pizzaOrders
にアクセスしてください。まだ PizzaOrder
モデルを定義していないので、“Missing Model” エラーが出るはずです。

プラグインモデル
================

プラグイン用のモデルは /app/plugins/pizza/models
に置かれます。このプラグイン用の PizzaOrdersController
を既に定義しているので、PizzaOrder
というコントローラ用のモデルを作成しましょう。PizzaOrder
は以前に定義したすべてのプラグインクラスの前に Pizza
というをもつスキーマ名で構成されます。

::

    // /app/plugins/pizza/models/pizza_order.php:
    class PizzaOrder extends PizzaAppModel {
        var $name = 'PizzaOrder';
    }
    ?>

/pizza/pizzaOrders (‘pizza\_orders’
というデータベースのテーブルがあるとします) を見てみると、“Missing View”
エラーが出ます。その次を作成しましょう。

プラグイン内のモデルを参照する必要がある場合、モデル名を持つプラグイン名を読み込む必要があります。それはドットで区切られています。

::

    // /app/plugins/pizza/models/example_model.php:
    class ExampleModel extends PizzaAppModel {
        var $name = 'ExampleModel';
            var $hasMany = array('Pizza.PizzaOrder');
    }
    ?>

取得したデータの配列キーからプラグイン名の部分(プレフィックス)を省略したい場合、以下の構文を使ってください。

::

    // /app/plugins/pizza/models/example_model.php:
    class ExampleModel extends PizzaAppModel {
        var $name = 'ExampleModel';
            var $hasMany = array(
                    'PizzaOrder' => array(
                            'className' => 'Pizza.PizzaOrder'
                    )
            );
    }
    ?>

プラグインビュー
================

ビューは通常のアプリケーションとまったく同じように振る舞います。正しいフォルダである
/app/plugins/[plugin]/views/
に置くだけです。ピザ注文プラグインには、PizzaOrdersController::index()
アクション用のビューが必要なので、同様にそれを読み込みましょう:

::

    // /app/plugins/pizza/views/pizza_orders/index.ctp:
    <h1>ピザの注文</h1>
    <p>おいしいピザとケーキの相性は抜群！</p>
    <!-- An order form of some sort might go here....-->

プラグインからエレメントを利用する方法については、
`プラグインからエレメントを要求する </ja/view/1081/Elements>`_
を参照してください。

Overriding plugin views from inside your application
----------------------------------------------------

You can override any plugin views from inside your app using special
paths. If you have a plugin called 'Pizza' you can override the view
files of the plugin with more application specific view logic by
creating files using the following template
"app/views/plugins/$plugin/$controller/$view.ctp". For the pizza
controller you could make the following file:

::

    /app/views/plugins/pizza/pizza_orders/index.ctp

Creating this file, would allow you to override
"/app/plugins/pizza/views/pizza\_orders/index.ctp".

コンポーネントとヘルパーとビヘイビア
====================================

プラグインはコンポーネント・ヘルパー・ビヘイビアを通常の CakePHP
と同様にもつことができます。コンポーネント・ヘルパー・ビヘイビアだけからなるプラグインを作成することもできますし、再利用可能なコンポーネントを構築するよい方法になり、他のプロジェクトへ簡単に落としこむことができます。

コンポーネントを構築するのは、通常のアプリケーション内のコンポーネント構築とまったく同じで、特別な命名規約もありません。プラグイン内からコンポーネントを参照するのは、特別な参照も必要ありません。

::

    // コンポーネント
    class ExampleComponent extends Object {

    }

    // プラグインコントローラ内:
    var $components = array('Example'); 

プラグインの外からコンポーネントを参照するには、プラグイン名が必要です。

::

    var $components = array('PluginName.Example');
    var $components = array('Pizza.Example'); // Pizza プラグインの ExampleComponent を参照する

同じテクニックがヘルパーやビヘイビアにも当てはまります。

プラグイン アセット
===================

1.3 では、新にプラグインの webroot が改善・単純化されています。
以前のプラグインは、vendor ディレクトリに ``img``, ``js``, ``css``
がありました。これらのディレクトリの名前でファイルの種類を振り分けているだけでした。1.3
では、プラグインやテーマに ``webroot``
ディレクトリがあります。このディレクトリにはプラグインのためにどこからでもアクセスできるファイルを格納します。

::

    app/plugins/debug_kit/webroot/
                                    css/
                                    js/
                                    img/
                                    flash/
                                    pdf/

以前のように3つのディレクトリに限定されることはありません。好きなディレクトリに好きなファイルを格納できます。ただ1つ制限があり、
``MediaView`` がファイルの mime-type を判別できなければなりません。

**プラグイン内でファイルにリンクするには**

プラグインのファイルへの url
は、以前と同じままです。以前だと、\ ``app/plugins/debug_kit/vendors/js/my_file.js``
の url は ``/debug_kit/js/my_file.js`` でした。 1.3 の場合は、
``app/plugins/debug_kit/webroot/js/my_file.js`` になります。

重要な注意点としては、img, js, css のパスの 前に必ず ``/プラグイン名/``
を付けることだけです。

プラグインの Tips
=================

すべてを構築し終わったので、配布する準備をしましょう(readme や SQL
ファイルのような特別なものを配布することもできます)。

プラグインを /app/plugins
にインストールすると、/pluginname/controllername/action という URL
でアクセスすることができます。ピザ注文プラグインサンプルでは、/pizza/pizzaOrders
で PizzaOrdersController にアクセスします。

最後に自身の CakePHP アプリケーションでプラグインを動作させる tips
を記述します:

-  [Plugin]AppController や [Plugin]AppModel
   がない場合、プラグインコントローラにアクセスしようとしたときに
   missing Controller エラーがでます。
-  プラグイン名のデフォルトコントローラをもつことができます。そうすると、/[plugin]/action
   を通してそこにアクセスすることができます。たとえば、UsersController
   というコントローラをもつ 'users' プラグインは、[plugin]/controllers
   フォルダに AddController というコントローラがない場合、 /users/add
   でアクセスすることができます。
-  プラグイン用の独自のレイアウトを app/plugin/views/layouts
   で定義できます。定義されていない場合、プラグインはデフォルトで
   /app/views/layouts フォルダのレイアウトを使用します。
-  コントローラ内で $this->requestAction('/plugin/controller/action');
   を使用して、内部のプラグインと通信できます。
-  requestAction
   を使用する場合、コントローラとモデル名がユニークであることを、可能な限り確認してください。さもないと、PHP
   の "redefined class ..." エラーがでます。

