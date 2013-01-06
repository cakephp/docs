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

    // /app/plugins/pizza/models/pizza_order.php:
    class ExampleModel extends PizzaAppModel {
        var $name = 'ExampleModel';
            var $hasMany = array('Pizza.PizzaOrder');
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
    <h1>Order A Pizza</h1>
    <p>Nothing goes better with Cake than a good pizza!</p>
    <!-- An order form of some sort might go here....-->

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

プラグイン CSS と Javascript
============================

特定の JavaScript と CSS
ファイルを、プラグインに含めることができます。これらのアセットファイルは、それぞれ
``your_plugin/vendors/css`` と ``your_plugin/vendors/js`` respectively
に設置してください。これらのファイルは、コアヘルパーと同様にビューの中でリンクすることができます。

::

    <?php echo $html->css('/your_plugin/css/my_css'); ?>

    <?php echo $javascript->link('/your_plugin/js/do_cool_stuff');

上の例では、 JavaScript と CSS
ファイルをどのようにしてプラグインとしてリンクするかを示しています。

js と css のパスの前に **/plugin\_name/**
を付与することを忘れないでください。これは重要な点です。これにより、素晴らしいことが起こります。

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

