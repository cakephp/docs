モデル
######

モデルはアプリケーションのビジネスレイヤーを担当するクラスです。\
すなわち、業務ドメインにおけるデータやその妥当性、トランザクションや\
情報ワークフローの過程で発生する全てのことがらを管理する役割を負うということです。

モデルクラスは通常はデータを表すもので、\
CakePHP のアプリケーションではデータアクセスに使われます。\
具体的に言うと、モデルはデータベースのテーブルを表しますが、それに限らず\
ファイルや外部 web サービス、iCal のイベントや CSV ファイルの行など、\
データを扱うあらゆるものに使われます。

ひとつのモデルを他のモデルと関連づけることができます。\
例えば Recipe はそのレシビの Author と関連づけられたり、\
レシピの Ingredient と関連づけられたりします。

このセクションでは、モデルでどのような機能を自動化することができるか、\
それらをどうやってオーバーライドするか、\
そしてモデルがどのようなメソッドやプロパティを持っているかについて説明します。\
データを関連づける様々な方法も説明します。\
データの検索、保存、削除の仕方も説明します。\
最後にデータソースについて触れます。

モデルを理解する
====================

Model はデータモデルを表します。オブジェクト指向プログラミングにおいて、\
データモデルは自動車や人、家といった「もの」を表現するオブジェクトです。\
例えばブログには複数の記事があり、それぞれの記事には複数のコメントがあります。\
Blog、Post、Comment はすべてモデルの例で、それぞれが互いに関連づけられます。

以下は CakePHP におけるモデル定義の簡単な例です。\ ::

    class Ingredient extends AppModel {
        public $name = 'Ingredient';
    }

このシンプルな宣言をするだけで、Ingredient モデルにはデータの保存や削除に関する\
クエリを発行するのに必要な機能が備わります。\
これらの魔法のメソッドは CakePHP の Model クラスから継承されます。\
Ingredient モデルはアプリケーション用のモデルである AppModel を extend しており、\
AppModel は CakePHP 内部の Model クラスを extend しています。\
つまり Ingredient クラスに上記の機能を与えているのはコアの Model クラスです。

中間クラスの AppModel は独自に作成しない限りは空のクラスであり、\
CakePHP のコアフォルダから取り込まれます。\
AppModel をオーバーライドすることで、アプリケーション内の全てのモデルで利用可能な\
機能を定義することができます。この場合、独自の ``AppModel.php`` ファイルを\
他の全てのモデルと同様に Model フォルダに置きます。 :doc:`Bake <console-and-shells/code-generation-with-bake>`
を使用してプロジェクトを作成すると、自動的にこのファイルが生成されます。

複数のモデルに同様のロジックを適用する方法に関しては
:doc:`Behaviors <models/behaviors>` も参照してください。

Ingredient モデルの話に戻りましょう。これを動作させるには、\
``/app/Model/`` ディレクトリに PHP のファイルを作成します。\
クラス名と同じファイル名をつけることになっています。\
この例の場合は ``Ingredient.php`` です。

.. note::

    CakePHP は対応するファイルが /app/Model に見つからない場合、\
    動的にモデルオブジェクトを生成します。\
    モデルのファイルに正しい名前をつけなければ
    (つまり ingredient.php や Ingredients.php などとしたら)
    CakePHP にとって見当たらないそのファイルではなく、\
    AppModel のインスタンスが使われることになります。\
    モデル内に自身で定義したメソッドやモデルに追加したビヘイビアを使おうとして、\
    呼び出し中のメソッドの名前で SQL エラーが発生する場合は
    CakePHP がそのモデルを見つけられないというサインであり、\
    ファイル名かアプリケーションキャッシュ、またはその両方をチェックする必要があります。

.. note::

    モデル名には使えない名前があります。\
    例えば "File" という名前は使えません。\
    "File" は CakePHP のコアに既に存在するクラスだからです。

モデルを定義すると :doc:`Controller <controllers>` からアクセスできるようになります。\
モデル名がコントローラ名と対応する名前を持つ場合、
CakePHP はそのモデルを自動的に呼び出し可能にします。\
例えば IngredientsController という名前のコントローラは\
自動で Ingredient モデルを初期化して、\
コントローラの ``$this->Ingredient`` に割り当てます。\ ::

    class IngredientsController extends AppController {
        public function index() {
            //全ての ingredients を取得してビューに渡す
            $ingredients = $this->Ingredient->find('all');
            $this->set('ingredients', $ingredients);
        }
    }

関連モデルはメインのモデルを通じて利用できます。\
以下の例は、Recipe が Ingredient モデルと関連づけられている場合です。\ ::

    class Recipe extends AppModel {

        public function steakRecipes() {
            $ingredient = $this->Ingredient->findByName('Steak');
            return $this->findAllByMainIngredient($ingredient['Ingredient']['id']);
        }
    }

上記は関連するモデルを利用する方法を示しています。\
関連を定義する方法を確認するには
:doc:`Associations section <models/associations-linking-models-together>`
を参照してください。

More on models
==============

.. toctree::

    models/associations-linking-models-together
    models/retrieving-your-data
    models/saving-your-data
    models/deleting-data
    models/data-validation
    models/callback-methods
    models/behaviors
    models/datasources
    models/model-attributes
    models/additional-methods-and-properties
    models/virtual-fields
    models/transactions


.. meta::
    :title lang=en: Models
    :keywords lang=en: information workflow,csv file,object oriented programming,model class,model classes,model definition,internal model,core model,simple declaration,application model,php class,database table,data model,data access,external web,inheritance,different ways,validity,functionality,queries
