モデル
######

..
  Models are the classes that sit as the business layer in your application.
  This means that they should be responsible for managing almost everything
  that happens regarding your data, its validity, interactions and evolution
  of the information workflow in your domain of work.

モデルはアプリケーションのビジネスレイヤーを担当するクラスです。\
すなわち、業務ドメインにおけるデータやその妥当性、トランザクションや\
情報ワークフローの過程で発生する全てのことがらを管理する役割を負うということです。

..
  Usually model classes represent data and are used in CakePHP applications
  for data access, more specifically they represent a database table but they are
  not limited to this, but can be used to access anything that manipulates data
  such as files, external web services, iCal events, or rows in a CSV file.

モデルクラスは通常はデータを表すもので、\
CakePHP のアプリケーションではデータアクセスに使われます。\
具体的に言うと、モデルはデータベースのテーブルを表しますが、それに限らず\
ファイルや外部 web サービス、iCal のイベントや CSV ファイルの行など、\
データを扱うあらゆるものに使われます。

..
  A model can be associated with other models. For example, a Recipe
  may be associated with the Author of the recipe as well as the
  Ingredient in the recipe.

ひとつのモデルを他のモデルと関連づけることができます。\
例えば Recipe はそのレシビの Author と関連づけられたり、\
レシピの Ingredient と関連づけられたりします。

..
  This section will explain what features of the model can be
  automated, how to override those features, and what methods and
  properties a model can have. It'll explain the different ways to
  associate your data. It'll describe how to find, save, and delete
  data. Finally, it'll look at Datasources.

このセクションでは、モデルでどのような機能を自動化することができるか、\
それらをどうやってオーバーライドするか、\
そしてモデルがどのようなメソッドやプロパティを持っているかについて説明します。\
データを関連づける様々な方法も説明します。\
データの検索、保存、削除の仕方も説明します。\
最後にデータソースについて触れます。

モデルを理解する
====================

..
  A Model represents your data model. In object-oriented programming
  a data model is an object that represents a "thing", like a car, a
  person, or a house. A blog, for example, may have many blog posts
  and each blog post may have many comments. The Blog, Post, and
  Comment are all examples of models, each associated with another.

Model はデータモデルを表します。オブジェクト指向プログラミングにおいて、\
データモデルは自動車や人、家といった「もの」を表現するオブジェクトです。\
例えばブログには複数の記事があり、それぞれの記事には複数のコメントがあります。\
Blog、Post、Comment はすべてモデルの例で、それぞれが互いに関連づけられます。

..
  Here is a simple example of a model definition in CakePHP::

以下は CakePHP におけるモデル定義の簡単な例です。\ ::

    <?php
    class Ingredient extends AppModel {
        public $name = 'Ingredient';
    }

..
  With just this simple declaration, the Ingredient model is bestowed
  with all the functionality you need to create queries along with
  saving and deleting data. These magic methods come from CakePHP's
  Model class by the magic of inheritance. The Ingredient model
  extends the application model, AppModel, which extends CakePHP's
  internal Model class. It is this core Model class that bestows the
  functionality onto your Ingredient model.

このシンプルな宣言をするだけで、Ingredient モデルにはデータの保存や削除に関する\
クエリを発行するのに必要な機能が備わります。\
これらの魔法のメソッドは CakePHP の Model クラスから継承されます。\
Ingredient モデルはアプリケーション用のモデルである AppModel を extend しており、\
AppModel は CakePHP 内部の Model クラスを extend しています。\
つまり Ingredient クラスに上記の機能を与えているのはコアの Model クラスです。

..
  This intermediate class, AppModel, is empty and if you haven't
  created your own, is taken from within the CakePHP core folder. Overriding
  the AppModel allows you to define functionality that should be made
  available to all models within your application. To do so, you need
  to create your own ``AppModel.php`` file that resides in the Model folder,
  as all other models in your application. Creating a project using
  :doc:`Bake <console-and-shells/code-generation-with-bake>` will automatically
  generate this file for you.

中間クラスの AppModel は独自に作成しない限りは空のクラスであり、\
CakePHP のコアフォルダから取り込まれます。\
AppModel をオーバーライドすることで、アプリケーション内の全てのモデルで利用可能な\
機能を定義することができます。この場合、独自の ``AppModel.php`` ファイルを\
他の全てのモデルと同様に Model フォルダに置きます。

..
  See also :doc:`Behaviors <models/behaviors>` for more information on
  how to apply similar logic to multiple models.

複数のモデルに同様のロジックを適用する方法に関しては
:doc:`Behaviors <models/behaviors>` も参照してください。

..
  Back to our Ingredient model, in order to work on it, create the PHP file in the
  ``/app/Model/`` directory. By convention it should have the same name as the class;
  for this example ``Ingredient.php``.

Ingredient モデルの話に戻りましょう。これを動作させるには、\
``/app/Model/`` ディレクトリに PHP のファイルを作成します。\
クラス名と同じファイル名をつけることになっています。\
この例の場合は ``Ingredient.php`` です。

..
    CakePHP will dynamically create a model object for you if it cannot
    find a corresponding file in /app/Model. This also means that if
    your model file isn't named correctly (i.e. ingredient.php or
    Ingredients.php) CakePHP will use an instance of AppModel rather
    than your missing (from CakePHP's perspective) model file. If
    you're trying to use a method you've defined in your model, or a
    behavior attached to your model and you're getting SQL errors that
    are the name of the method you're calling - it's a sure sign
    CakePHP can't find your model and you either need to check the file
    names, your application cache, or both.

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

..
    Some class names are not usable for model names. For instance
    "File" cannot be used as "File" is a class already existing in the
    CakePHP core.

.. note::

    モデル名には使えない名前があります。\
    例えば "File" という名前は使えません。\
    "File" は CakePHP のコアに既に存在するクラスだからです。

..
  With your model defined, it can be accessed from within your
  :doc:`Controller <controllers>`. CakePHP will automatically
  make the model available for access when its name matches that of
  the controller. For example, a controller named
  IngredientsController will automatically initialize the Ingredient
  model and attach it to the controller at ``$this->Ingredient``::

モデルを定義すると :doc:`Controller <controllers>` からアクセスできるようになります。\
モデル名がコントローラ名と対応する名前を持つ場合、
CakePHP はそのモデルを自動的に呼び出し可能にします。\
例えば IngredientsController という名前のコントローラは\
自動で Ingredient モデルを初期化して、\
コントローラの ``$this->Ingredient`` に割り当てます。\ ::

    <?php
    class IngredientsController extends AppController {
        public function index() {
            //全ての ingredients を取得してビューに渡す
            $ingredients = $this->Ingredient->find('all');
            $this->set('ingredients', $ingredients);
        }
    }

..
  Associated models are available through the main model. In the
  following example, Recipe has an association with the Ingredient
  model::

関連モデルはメインのモデルを通じて利用できます。\
以下の例は、Recipe が Ingredient モデルと関連づけられている場合です。\ ::

    <?php
    class Recipe extends AppModel {

        public function steakRecipes() {
            $ingredient = $this->Ingredient->findByName('Steak');
            return $this->findAllByMainIngredient($ingredient['Ingredient']['id']);
        }
    }

..
  This shows how to use models that are already linked. To understand how associations are
  defined take a look at the :doc:`Associations section <models/associations-linking-models-together>`

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
