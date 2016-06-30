模型
####

模型(*Model*)是在应用程序中构成业务层的类。它们应当负责管理几乎所有涉及数据的事情，
譬如数据的合法性，数据间的交互，以及整个业务领域中数据在工作流程中的演化。

通常模型类用来表示数据，并且在 CakePHP 应用程序中用来访问数据。它们通常代表数据库
中的表，但也可用于访问任何操控数据的东西，比如文件，外部网络服务，iCal 日程。

一个模型可以与其他模型关联。例如，一份菜谱可以和菜谱的作者关联，也可以和菜谱的原
料相关联。

本章中我们将解释模型的哪些特性可以自动化，如何改变这些特性，以及模型有哪些方法和
属性。我们会解释关联数据的各种方式。我们还将描述如何查找，保存和删除数据。最后，
我们来看一下数据源(*Datasource*)。

理解模型
========

模型代表数据模型。在面向对象编程中数据模型是表示"事物"的对象，比如，汽车，人，或
者房子。例如，一个博客(*blog*)可以有多篇文章(*post*)，每篇文章又可以有多条评论
(*comment*)。博客(*Blog*)，文章(*Post*)和评论(*Comment*)就是彼此关联的模型的例子。

这里有一个 CakePHP 模型定义的简单例子::

    App::uses('AppModel', 'Model');
    class Ingredient extends AppModel {
        public $name = 'Ingredient';
    }

仅需这样简单的声明，Ingredient 模型就具备了所有用来生成查询以及保存和删除数据的
功能。这些魔术般的方法来自 CakePHP 的 Model 类，得益于继承的魔法。Ingredient 模型
扩展了应用程序的模型 AppModel，而 AppModel 又扩展了 CakePHP 内部的 Model 类。就是
这个核心的 Model 类赋予你的 Ingredient 模型这些功能的。
``App::uses('AppModel', 'Model')`` 保证模型在每次使用时都加载了。

这个中间的类 AppModel 是空的。如果你没有自己创建，则会从 CakePHP 内核文件夹中取得。
重载 AppModel，让你可以定义应用程序中所有的模型都具备的功能。为此，你需要在 Model 
文件夹中创建自己的 ``AppModel.php``，就象应用程序中所有其他的模型一样。使用 
:doc:`Bake <console-and-shells/code-generation-with-bake>` 创建项目，就会为你自动
生成这个文件。

欲知如何在多个模型中使用相似的逻辑的更多信息，也可参看 
:doc:`Behaviors <models/behaviors>`。

回到我们的 Ingredient 模型。为此，在 ``/app/Model/`` 目录中创建一个 PHP 文件。按
照约定，文件名应该和类名一样，在本例中就是 ``Ingredient.php`` 。

.. note::

    如果 CakePHP 在 /app/Model 目录中无法找到对应的文件，它就会为你动态创建一个模
    型对象。这也意味着，如果你的模型文件命名不正确(比如，把它命名为 
    ingredient.php 或者 Ingredients.php，而不是 Ingredient.php)，CakePHP 就会使用 
    AppModel 的实例，而不是你的模型文件(CakePHP 认为是缺失的)。如果你试图使用在你
    的模型中定义的方法，或者你的模型上附加的行为，然而你得到的却是关于你调用的方
    法的名称的 SQL 错误 —— 这明显是因为 CakePHP 无法找到你的模型，那么你要检查文
    件名、应用程序缓存，或者两者都要检查。

.. note::

    某些类名是无法作为模型名称的。例如，"File" 无法使用，因为 "File" 是 CakePHP 
    内核中已经存在的一个类了。


模型定义了之后，就可以在 :doc:`控制器 <controllers>` (*Controller*)中使用了。如果
模型名称与控制器名称匹配，CakePHP 就会自动使该模型可以访问。例如，一个名为 
IngredientsController 的控制器会自动初始化 Ingredient 模型，并把它附加在控制器上，
作为 ``$this->Ingredient``::

    class IngredientsController extends AppController {
        public function index() {
            //获得所有原料并把它传给视图:
            $ingredients = $this->Ingredient->find('all');
            $this->set('ingredients', $ingredients);
        }
    }

关联的模型可以从主模型访问。在下例中，Recipe 模型与 Ingredient 模型有关联::

    class Recipe extends AppModel {

        public function steakRecipes() {
            $ingredient = $this->Ingredient->findByName('Steak');
            return $this->findAllByMainIngredient($ingredient['Ingredient']['id']);
        }
    }

这里展示了如何使用已经关联在一起的模型。要明白关联是如何定义的，请看 
:doc:`模型的关联一节 <models/associations-linking-models-together>`。

关于模型的更多内容
==================

.. toctree::
    :maxdepth: 1

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
    :title lang=zh: Models
    :keywords lang=zh: information workflow,csv file,object oriented programming,model class,model classes,model definition,internal model,core model,simple declaration,application model,php class,database table,data model,data access,external web,inheritance,different ways,validity,functionality,queries
