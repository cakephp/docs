行为
####

模型的行为是一种组织 CakePHP 的模型中定义的功能的方法。这允许我们分离并重用构成
一种行为的逻辑，并且这不需要继承，例如创建树形结构。行为提供了一种简单但强大的方
式来增强模型，允许我们通过定义一个简单的类变量为模型附加功能。这样，行为就允许模
型摆脱不属于它们建模所依据的商业逻辑的多余负担，或者是不同模型也需要并且可以推断
出来的(逻辑)。

作为一个例子，请考虑这样一个模型，它让我们存取数据库中保存树形结构信息的一个表。
删除，添加，和移动树的节点，并不象删除，插入和编辑表中的行那么简单。当把东西移来
移去的时候，很多记录要更新。与其为每个模型创建这些操作树的方法(为每个需要此功能
的模型)，我们可以简单地让我们的模型使用 :php:class:`TreeBehavior`，或者用更正规
的说法，我们让模型具有树的行为。这就是把行为附加在模型上。就这么一行代码，就可以
让 CakePHP 模型具有一整套新的方法，可以和底层的(数据)结构交互。

CakePHP 已有的行为包括树结构(*tree structure*)，翻译内容(*translated content*)，
权限控制列表(*access control list*)的交互，还有在 CakePHP Bakery (
`https://bakery.cakephp.org <https://bakery.cakephp.org>`_) 上社区贡献的行为。本节
将介绍为模型添加行为的基本使用模式，如何使用 CakePHP 自带的行为，以及如何创建你
自己的行为。

从本质上讲，行为是带有回调的 `Mixins <https://en.wikipedia.org/wiki/Mixin>`_。

CakePHP 自带了一些行为。欲知每个行为的更多信息，请参考下面各章：

.. include:: /core-libraries/toc-behaviors.rst
    :start-line: 8

使用行为
========

行为通过模型的类变量 ``$actsAs`` 附加到模型上::

    class Category extends AppModel {
        public $actsAs = array('Tree');
    }

这个例子说明一个 Category 模型可以使用 TreeBehavior 在一个树形结构中处理。一旦指
定了行为，行为新添加的方法就可以象原来的模型中一直存在的部分一样来使用::

    // 设置 ID
    $this->Category->id = 42;

    // 使用行为的方法 children():
    $kids = $this->Category->children();

在把行为附加到模型时，某些行为要求或者允许定义一些设置。这里，我们告诉 
TreeBehavior 底层数据库表中"左节点(*left*)"和"右节点(*right*)"字段的名称::

    class Category extends AppModel {
        public $actsAs = array('Tree' => array(
            'left'  => 'left_node',
            'right' => 'right_node'
        ));
    }

我们也可以为一个模型附加多个行为。例如，没有理由我们的 Category 模型只能有树结构
的行为，它可能也需要国际化支持::

    class Category extends AppModel {
        public $actsAs = array(
            'Tree' => array(
              'left'  => 'left_node',
              'right' => 'right_node'
            ),
            'Translate'
        );
    }

至此，我们始终使用模型的类变量来为模型添加行为。这意味着这些行为将在模型的整个生
命周期中一直附加在模型上。然而，我们也许需要在运行时将行为从模型上分离。比方说我
们之前的 Category 模型，具有 Tree 和 Translate 的行为，出于某种原因，我们要强制
让它停止 Translate 的行为::

    // 从模型分离行为:
    $this->Category->Behaviors->unload('Translate');

这将使我们的 Category 模型从此停止 Translate 的行为。另外，我们可能需要在模型的
通常操作时取消 Translate 行为: 查找，保存，等等。实际上，我们想要行为不要对 
CakePHP 模型的回调作出反应。与其让行为脱离模型，我们让模型停止将这些回调通知 
Translate 行为::

    // 停止让行为处理模型的回调
    $this->Category->Behaviors->disable('Translate');

我们也有可能要知道行为是否在处理这些模型回调，如果没有，我们就恢复它对回调作出反
应::

    // 如果行为没有处理模型的回调
    if (!$this->Category->Behaviors->enabled('Translate')) {
        // 告诉它开始处理
        $this->Category->Behaviors->enable('Translate');
    }

就象我们能在运行时把行为从模型上完全分离，我们也能附加新的行为。比如说，我们熟悉
的 Category 模型要有圣诞节的行为，不过，只是在圣诞节那天::

    // 如果今天是12月25日
    if (date('m/d') === '12/25') {
        // 我们的模型要有圣诞节的行为
        $this->Category->Behaviors->load('Christmas');
    }

我们也可以用 load 方法重置行为的设置::

    // 我们来改变已经附加的行为的一个设置
    $this->Category->Behaviors->load('Tree', array('left' => 'new_left_node'));

还有一个方法可以获得一个模型已附加的行为的列表。如果给该方法传入一个行为的名字，
它就会告诉我们那个行为是否已附加在模型上，否则它就会给我们一个已附加行为的列表::

    // 如果 Translate 行为尚未附加上
    if (!$this->Category->Behaviors->loaded('Translate')) {
        // 得到模型附加的所有行为的完整列表
        $behaviors = $this->Category->Behaviors->loaded();
    }

创建行为
========

附加在模型上的行为的回调函数会被自动调用。这些回调函数和模型的回调函数类似： 
``beforeFind`` 、 ``afterFind`` 、 ``beforeValidate`` 、 ``afterValidate`` 、 
``beforeSave`` 、 ``afterSave`` 、 ``beforeDelete`` 、 ``afterDelete`` 和 
``onError`` — 参见 :doc:`/models/callback-methods`。

你的行为应该放在 ``app/Model/Behavior`` 目录中。它们以驼峰命名法(*CamelCase*)来
命名，末尾缀以 ``Behavior``，比如 NameBehavior.php。当创建你自己的行为时，用一个
核心行为作为模板通常是很有帮助的。核心行为可以在 ``lib/Cake/Model/Behavior/`` 目
录中找到。

行为的每个回调和方法把调用起始的模型的引用作为第一个参数。

除了实现回调，也可以为每个行为以及/或者每个模型附加的行为添加设置。给定设置的方
法可以在核心行为及其配置的章节中找到。

下面这个简单的例子说明行为的设置如何从模型传入到行为::

    class Post extends AppModel {
        public $actsAs = array(
            'YourBehavior' => array(
                'option1_key' => 'option1_value'
            )
        );
    }

既然行为被所有使用它的模型实例共享，好的做法是基于使用行为的别名/模型名来保存设
置。当被创建的行为的 ``setup()`` 方法被调用时::

    public function setup(Model $Model, $settings = array()) {
        if (!isset($this->settings[$Model->alias])) {
            $this->settings[$Model->alias] = array(
                'option1_key' => 'option1_default_value',
                'option2_key' => 'option2_default_value',
                'option3_key' => 'option3_default_value',
            );
        }
        $this->settings[$Model->alias] = array_merge(
            $this->settings[$Model->alias], (array)$settings);
    }

创建行为方法
============

具有某个行为的任何模型自动获得该行为的方法。例如，如果你有::

    class Duck extends AppModel {
        public $actsAs = array('Flying');
    }

你可以调用 ``FlyingBehavior`` 的方法，就象它们是 Duck 模型的方法一样。当创建行为
方法时，你自动得到调用模型的引用作为第一个参数。提供的所有其余参数都被右移一个位
置。例如::

    $this->Duck->fly('toronto', 'montreal');

虽然这个方法接受两个参数，但方法的签名(*signature*)应该象这样::

    public function fly(Model $Model, $from, $to) {
        // 飞行。
    }

切记，在一个行为方法内部以 ``$this->doIt()`` 方式调用的方法无法得到自动附加的 
$model 参数。

映射方法
--------

除了提供 'mixin' 方法，行为还可以提供模式匹配方法。行为也可以定义映射方法。 映射
方法使用模式匹配来调用方法。这允许你在行为中创建类似 ``Model::findAllByXXX`` 的
方法。映射方法需要在行为的 ``$mapMethods`` 数组中声明。映射方法的签名与行为正常
的 mixin 方法略有不同::

    class MyBehavior extends ModelBehavior {
        public $mapMethods = array('/do(\w+)/' => 'doSomething');

        public function doSomething(Model $model, $method, $arg1, $arg2) {
            debug(func_get_args());
            //做些事情
        }
    }

上面的代码会把每一个 ``doXXX()`` 方法的调用映射到此行为。正如你所看到的，模型仍
然是第一个参数，但被调用的方法名称会是第二个参数。这允许你混杂额外的信息在方法的
名称中，很象 ``Model::findAllByXX``。如果上面的行为附加到一个模型上，就会象下面
这样::

    $model->doReleaseTheHounds('homer', 'lenny');

    // 会输出
    'ReleaseTheHounds', 'homer', 'lenny'

行为的回调
==========

模型的行为可以定义一些回调函数，在模型同名的回调之前触发。行为的回调让行为可以捕
获所附加的模型的事件，并且增强参数，或者加入额外的处理。

所有行为的回调都在模型的回调 **之前** 触发:

-  ``beforeFind``
-  ``afterFind``
-  ``beforeValidate``
-  ``afterValidate``
-  ``beforeSave``
-  ``afterSave``
-  ``beforeDelete``
-  ``afterDelete``


创建行为的回调
--------------

.. php:class:: ModelBehavior

模型行为的回调定义为行为类中的简单方法。与通常的行为方法十分类似，它们接受 
``$Model`` 作为第一个参数。这个参数就是调用行为方法的模型。

.. php:method:: setup(Model $Model, array $settings = array())

    当一个行为附加到模型时调用。 settings 参数来自所附加模型的 ``$actsAs`` 属性。

.. php:method:: cleanup(Model $Model)

    当一个行为从模型分离时调用。基类方法根据 ``$model->alias`` 来删除模型设置。
    你可以重载这个方法，提供定制的清理功能。

.. php:method:: beforeFind(Model $Model, array $query)

    如果行为的 beforeFind 回调返回 false，find() 就会中止。返回数组来增强 find 
    操作的查询参数。

.. php:method:: afterFind(Model $Model, mixed $results, boolean $primary = false)

    可以用 afterFind 回调来增强 find 操作的结果。返回值会作为结果，交给链条中的
    下一个行为或者模型的 afterFind 回调方法。

.. php:method:: beforeValidate(Model $Model, array $options = array())

    可以用 beforeValidate 回调来改变模型的 validate 数组或者处理任何其它在验证之
    前的逻辑。从 beforeValidate 回调方法返回 false 会中止验证并使验证失败。

.. php:method:: afterValidate(Model $Model)

    如果需要，使用 afterValidate 回调来进行任何数据的清理或准备。

.. php:method:: beforeSave(Model $Model, array $options = array())

    可以从行为的 beforeSave 回调返回 false，来中止保存操作。返回 true 就允许它继
    续。

.. php:method:: afterSave(Model $Model, boolean $created, array $options = array())

    可以用 afterSave 回调来执行与行为相关的清理操作。 当创建一条记录时 $created 
    参数为 true，当更新一条记录时则为 false。

.. php:method:: beforeDelete(Model $Model, boolean $cascade = true)

    可以从行为的 beforeDelete 回调返回 false，来中止删除操作。返回 true 就允许它
    继续。

.. php:method:: afterDelete(Model $Model)

    可以用 afterDelete 回调来执行与行为相关的清理操作。



.. meta::
    :title lang=zh: Behaviors
    :keywords lang=zh: tree manipulation,manipulation methods,model behaviors,access control list,model class,tree structures,php class,business contract,class category,database table,bakery,inheritance,functionality,interaction,logic,cakephp,models,essence
