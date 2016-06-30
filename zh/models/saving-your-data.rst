保存数据
########

CakePHP 使保存模型数据易如反掌。准备保存的数据应当以下面的基本格式传递给模型的 
``save()`` 方法::

    Array
    (
        [ModelName] => Array
        (
            [fieldname1] => 'value'
            [fieldname2] => 'value'
        )
    )

大多数时候你根本无需担心这种格式：CakePHP 的 :php:class:`FormHelper` 和模型的 
find 方法都会将数据包装成这种格式。如果使用 :php:class:`FormHelper`，数据也在 
``$this->request->data`` 方便地可供立即使用。

下面是控制器动作使用 CakePHP 模型向数据库表存入数据的简单示例::

    public function edit($id) {
        // 是否有表单数据被提交(*POSTed*)？
        if ($this->request->is('post')) {
            // 如果表单数据能够通过验证并保存成功……
            if ($this->Recipe->save($this->request->data)) {
                // 设置会话(*session*)闪现提示信息并跳转
                $this->Session->setFlash('Recipe Saved!');
                return $this->redirect('/recipes');
            }
        }

        // 如果没有表单数据，查找要编辑的菜单(*recipe*)并将其交给视图
        $this->set('recipe', $this->Recipe->findById($id));
    }

当调用 save 方法时，在第一个参数中传入的数据会使用 CakePHP 的验证机制进行验证(欲
知详情，请参见 :doc:`/models/data-validation` 一章)。如果因为某些原因，数据没有
保存，一定要检查是否是某些验证规则没有通过。这种情况下，可以通过输出 
:php:attr:`Model::$validationErrors` 来进行调试::

    if ($this->Recipe->save($this->request->data)) {
        // 处理成功的情况。
    }
    debug($this->Recipe->validationErrors);

模型中还有其它一些与保存相关的方法会对你有用：

:php:meth:`Model::set($one, $two = null)`
=========================================
 
``Model::set()`` 可以用于将一个或多个字段的数据设置到模型的 data 数组中。这可用
于把模型和模型提供的 ActiveRecord 特性一起使用::

    $this->Post->read(null, 1);
    $this->Post->set('title', 'New title for the article');
    $this->Post->save();

此例展示了如何以 ActiveRecord 的方式，使用 ``set()`` 方法更新单个列。也可以使用 
``set()`` 给多个字段赋予新值::

    $this->Post->read(null, 1);
    $this->Post->set(array(
        'title' => 'New title',
        'published' => false
    ));
    $this->Post->save();

上例会更新 title 和 published 字段，并把记录保存到数据库中。

:php:meth:`Model::clear()`
==========================

该方法可用于重置模型状态，并清除任何未保存数据及验证错误。

.. versionadded:: 2.4


:php:meth:`Model::save(array $data = null, boolean $validate = true, array $fieldList = array())`
=================================================================================================

如前所示，这个方法保存数组格式的数据。第二个参数让你可以跳过验证，第三个参数让你
可以提供要保存的模型字段列表。为了增强安全性，可以使用 ``$fieldList`` 限制要保存
的字段。

.. note::

    如果不提供 ``$fieldList``，恶意的用户能够向表单数据中添加额外的字段(在你没有
    使用 :php:class:`SecurityComponent` 的情况下)，从而改变原本不希望被改变的字
    段。

save 方法还有另外一种语法::

    save(array $data = null, array $params = array())

``$params`` 数组可以使用如下任意选项作为其键:

* ``validate`` 设置为 true/false 来开启/关闭验证。
* ``fieldList`` 允许保存的字段数组。
* ``callbacks`` 设置为 false 将禁止回调。使用 'before' 或 'after' 将仅开启指定的
  回调。
* ``counterCache`` (从 2.4 版本开始)控制计数器缓存(如果有的话)更新的布尔值
* ``atomic`` (从 2.6 版本开始) 指定要使用事务保存记录的布尔值。

欲知模型回调的更多信息，请参见 :doc:`这里 <callback-methods>`。

.. tip::

    如果你不希望保存某些数据时自动更新 ``modified`` 字段，在 $data 数组中添加 
    ``'modified' => false``。

一旦保存完成，可以使用模型对象的 ``$id`` 属性获得对象的 ID —— 在创建新对象时可能
会非常方便。

::

    $this->Ingredient->save($newData);
    $newIngredientId = $this->Ingredient->id;

创建或更新是通过模型的 ``id`` 字段来控制的。如果设置了 ``$Model->id``，带有这个
主键的记录将被更新，否则将创建新记录::

    // 建新记录：id 没有设置或为 null
    $this->Recipe->create();
    $this->Recipe->save($this->request->data);

    // 更新记录： id 被设置为一个数值
    $this->Recipe->id = 2;
    $this->Recipe->save($this->request->data);

.. tip::

    在循环中调用 save 方法时，不要忘记调用 ``clear()``。


如果想更新一条记录，而不是创建一条新记录，请确保向数据数组传入了主键字段::

    $data = array('id' => 10, 'title' => 'My new title');
    // 会更新 id 为 10 的 Recipe 记录
    $this->Recipe->save($data);

:php:meth:`Model::create(array $data = array())`
================================================

这个方法为保存新数据重置模型的状态。实际上它并不在数据库中创建新记录，而是清除 
Model::$id，并按照数据库字段的默认值设置 Model::$data。如果没有定义数据库字段的
默认值，Model::$data 会被设置空数组。

如果传入了 ``$data`` 参数(使用上面描述的数组格式)，这会和数据库字段的默认值合并，
并准备好模型实例来保存这些数据(可由 ``$this->data`` 访问)。

如果传入 ``false`` 或 ``null`` 给 ``$data`` 参数，Model::$data 会被设置为空数组。

.. tip::

    如果要插入一新行而不是更新已存在的一行，应当总是先调用 create()。这样能够在
    回调函数或者其它地方避免与之前的 save 调用发生冲突。

:php:meth:`Model::saveField(string $fieldName, string $fieldValue, $validate = false)`
======================================================================================

用于保存单个字段的值。在将要调用 ``saveField()`` 之前要设置模型的 ID (
``$this->ModelName->id = $id``)。在使用该方法时，``$fieldName`` 应当只包含字段名，
而不是模型名和字段名。

例如，更新一篇博客文章(*blog post*)的标题(*title*)，在控制器中调用 ``saveField`` 
方法可以象下面这样::

    $this->Post->saveField('title', 'A New Title for a New Day');

.. warning::

    在使用这个方法时不能阻止更新 ``modified`` 字段，你需要使用 save() 方法才行。

saveField 方法也有另一种语法::

    saveField(string $fieldName, string $fieldValue, array $params = array())

``$params`` 数组可以用如下任意选项作为键：

* ``validate`` 设置为 true/false 来开启/关闭验证。
* ``callbacks`` 设置为 false 来关闭回调。使用 'before' 或 'after' 将仅开启指定的
  回调。
* ``counterCache`` (从 2.4 版本开始)控制计数器缓存(如果有的话)更新的布尔值

:php:meth:`Model::updateAll(array $fields, mixed $conditions)`
==============================================================

用一次调用更新一条或多条记录。要更新的字段和它们的值，由 ``$fields`` 数组确定。
要更新的记录由 ``$conditions`` 数组确定。如果 ``$conditions`` 参数未提供或设置为
``true``，全部记录都会被更新。

例如，批准所有成为会员超过一年的 bakers，更新调用可以象下面这样::

    $thisYear = date('Y-m-d H:i:s', strtotime('-1 year'));

    $this->Baker->updateAll(
        array('Baker.approved' => true),
        array('Baker.created <=' => $thisYear)
    );


``$fields`` 数组可接受 SQL 表达式。常量(*literal*)值应当使用
:php:meth:`DboSource::value()` 手动引用。例如，如果一个模型方法调用
``updateAll()``，应该这样::

    $db = $this->getDataSource();
    $value = $db->value($value, 'string');
    $this->updateAll(
        array('Baker.status' => $value),
        array('Baker.status' => 'old')
    );

.. note::

    即使更新的模型中有 modified 字段，它也不会被 ORM 自动更新。如果要更新它，只
    需手动将其加入数组中。

例如，关闭所有属于某一客户的所有请求::

    $this->Ticket->updateAll(
        array('Ticket.status' => "'closed'"),
        array('Ticket.customer_id' => 453)
    );

默认情况下，updateAll() 对支持 join 的数据库会自动连接任何 belongsTo 关联。要阻
止这种连接，临时解除绑定(*unbind*)该关联。

:php:meth:`Model::saveMany(array $data = null, array $options = array())`
=========================================================================

此方法用于同时保存同一模型的多行。可以使用如下选项：

* ``validate``: 设置为 false 将关闭验证，设置为 true 将在保存每条记录前进行验证，
  设
  置为 'first' 将在保存任何记录前验证 *所有* 记录(默认值)
* ``atomic``: 如果为 true (默认值)，将试图用单个事务保存所有记录。如果数据库/表
  不支持事务，则应当设置为 false。
* ``fieldList``: 同 Model::save() 方法的 $fieldList 参数
* ``deep``: (从 2.1 版开始) 如果设置为 true，关联数据也被保存；也可参见 
  saveAssociated 方法。
* ``callbacks`` 设置为 false 将关闭回调。使用 'before' 或 'after' 将仅开启指定的
  回调。
* ``counterCache`` (从 2.4 版本开始)控制计数器缓存(如果有的话)更新的布尔值

为保存单个模型的多条记录，$data 必须是数字索引的记录数组，象这样::

    $data = array(
        array('title' => 'title 1'),
        array('title' => 'title 2'),
    );

.. note::

    注意，我们传递了数字索引、而非通常情况下 ``$data`` 包含的 Article 键。在保存
    同一模型的多条记录时，记录数组应当只使用数字索引，而不是模型的键。

也可以使用如下格式的数据::

    $data = array(
        array('Article' => array('title' => 'title 1')),
        array('Article' => array('title' => 'title 2')),
    );

如果要使用 ``$options['deep'] = true`` (从 2.1 版本开始)一起保存关联数据，上面的
两个例子将象下面这样::

    $data = array(
        array('title' => 'title 1', 'Assoc' => array('field' => 'value')),
        array('title' => 'title 2'),
    );
    $data = array(
        array(
            'Article' => array('title' => 'title 1'),
            'Assoc' => array('field' => 'value')
        ),
        array('Article' => array('title' => 'title 2')),
    );
    $Model->saveMany($data, array('deep' => true));

切记，如果只想更新记录而不是创建新记录，只需要在数据行中加入主键索引::

    $data = array(
        array(
            // 这会创建一个新行
            'Article' => array('title' => 'New article')),
        array(
            // 这会更新一个现有的行
            'Article' => array('id' => 2, 'title' => 'title 2')),
    );


.. _Model-saveAssociated:

:php:meth:`Model::saveAssociated(array $data = null, array $options = array())`
===============================================================================

此方法用于同时保存多个模型关联。可以使用如下选项：

* ``validate``: 设置为 false 将关闭验证，设置为 true 将在保存每条记录前进行验证，
  设置为 'first' 将在保存任何记录前验证 *全部* 记录(默认值)
* ``atomic``: 如果为 true (默认值)，将试图用单个事务保存所有记录。如果数据库/表
  不支持事务，则应当设置为 false。
* ``fieldList``: 同 Model::save() 方法的 $fieldList 参数
* ``deep``: (从 2.1 版开始) 如果设置为 true，不仅保存直接相关的关联数据，也会保
  存深度嵌套的关联数据。默认值为 false。
* ``counterCache`` (从 2.4 版本开始)控制计数器缓存(如果有的话)更新的布尔值

要同时保存一条记录及与其有着 hasOne 或者 belongsTo 关联的相关记录，data 数组应当
象下面这样::

    $data = array(
        'User' => array('username' => 'billy'),
        'Profile' => array('sex' => 'Male', 'occupation' => 'Programmer'),
    );

要同时保存一条记录及与其有着 hasMany 关联的相关记录，data 数组应当象下面这样::

    $data = array(
        'Article' => array('title' => 'My first article'),
        'Comment' => array(
            array('body' => 'Comment 1', 'user_id' => 1),
            array('body' => 'Comment 2', 'user_id' => 12),
            array('body' => 'Comment 3', 'user_id' => 40),
        ),
    );

而要同时保存一条记录及与其有着超过两层深度的 hasMany 关联的相关记录，data 数组应
当象下面这样::

    $data = array(
        'User' => array('email' => 'john-doe@cakephp.org'),
        'Cart' => array(
            array(
                'payment_status_id' => 2,
                'total_cost' => 250,
                'CartItem' => array(
                    array(
                        'cart_product_id' => 3,
                        'quantity' => 1,
                        'cost' => 100,
                    ),
                    array(
                        'cart_product_id' => 5,
                        'quantity' => 1,
                        'cost' => 150,
                    )
                )
            )
        )
    );

.. note::

    如果保存成功，主模型的外键将被存储在相关模型的 id 字段中，即 
    ``$this->RelatedModel->id``。

.. warning::

    在检查 atomic 选项设置为 false 的 saveAssociated 方法的调用时，要小心。它返
    回的是一个数组，而不是布尔值。

.. versionchanged:: 2.1
    现在你可以设置 ``$options['deep'] = true;`` 来保存深层关联的数据。

为了同时保存一条记录及与其有 hasMany 关联的相关记录、以及深层关联的 Comment 
belongsTo User 数据，data 数组应当象这样::

    $data = array(
        'Article' => array('title' => 'My first article'),
        'Comment' => array(
            array('body' => 'Comment 1', 'user_id' => 1),
            array(
                'body' => 'Save a new user as well',
                'User' => array('first' => 'mad', 'last' => 'coder')
            ),
        ),
    );

并用如下语句保存该数据::

    $Article->saveAssociated($data, array('deep' => true));

.. versionchanged:: 2.1
    ``Model::saveAll()`` 和类似方法现在支持传入多个模型的 `fieldList` 选项。

传入多个模型的 ``fieldList`` 的例子::

    $this->SomeModel->saveAll($data, array(
        'fieldList' => array(
            'SomeModel' => array('field_1'),
            'AssociatedModel' => array('field_2', 'field_3')
        )
    ));

(这里的) fieldList 是一个以模型别名为键，以字段数组为值的数组。模型名不同于在要
保存的数据中那样，不能嵌套。

:php:meth:`Model::saveAll(array $data = null, array $options = array())`
========================================================================

``saveAll`` 函数只是 ``saveMany`` 方法和 ``saveAssociated`` 方法的包装。它会检查
数据并且决定应当执行哪种类型的保存。如果数据是数字索引数组的格式，就会调用 
``saveMany`` 方法，否则调用 ``saveAssociated`` 方法。

此方法接受与前面的两个方法相同的选项，基本上只是个向后兼容方法。建议(不要使用该
方法，而是)根据情况使用 ``saveMany`` 方法或 ``saveAssociated`` 方法。


保存相关模型的数据(hasOne, hasMany, belongsTo)
==============================================

在与关联模型一起使用时，重要的是要意识到，保存模型数据应当总是由相应的 CakePHP 
模型来完成。如果保存一条新的 Post 和它关联的 Comment，就要在保存操作的过程中使用 
Post 和 Comment 模型。

如果在系统中关联模型双方的记录都还不存在(例如，想要同时保存新的 User 及相关的 
Profile 记录)，就需要先保存主模型或者父模型。

为了了解这是如何进行的，想像一下在 UsersController 控制器中有一个动作，处理新 
User 和相关 Profile 的保存。下面的示例动作假设已经(使用 FormHelper)提交(POSTed)
了足够的数据，来创建单个 User 和单个 Profile::

    public function add() {
        if (!empty($this->request->data)) {
            // 我们可以保存 User 数据：
            // 它应当在 $this->request->data['User'] 中

            $user = $this->User->save($this->request->data);

            // 如果用户保存了，现在添加这条数据到 data 中并保存 Profile。

            if (!empty($user)) {
                // 新创建的 User ID 已经被赋值给 $this->User->id.
                $this->request->data['Profile']['user_id'] = $this->User->id;

                // 由于 User hasOne Profile 的关联，因此可以通过 User 模型访问
                // Profile 模型：
                $this->User->Profile->save($this->request->data);
            }
        }
    }

规则是，当使用 hasOne、hasMany 和 belongsTo 关联时，重要的是如何设置键。基本思路
是从一个模型中获取键，并将其放入另一个模型的外键字段中。有时这可能需要在调用 
``save()`` 方法之后使用模型类的 ``$id`` 属性，不过其它情况下可能只需要从刚提交(
*POSTed*)给控制器动作的表单中的隐藏输入项(*hidden input*)获得 ID。

为了补充上面使用的基本方法，CakePHP 还提供了一个非常方便的方法 
``saveAssociated()``，这让你可以一次验证和保存多个模型的数据。而且，
``saveAssociated()`` 方法还提供了事务支持以确保数据库中的数据完整性(例如，如果一
个模型保存失败，其它模型也不会保存)。

.. note::

    要在 MySQL 中使事务正常工作，表必须使用 InnoDB 引擎。记住，MyISAM 表不支持事
    务。

来看看如何使用 ``saveAssociated()`` 方法同时保存 Company 和 Account 模型吧。

首先，需要为 Company 和 Account 模型一起创建表单(假设 Company hasMany Account)::

    echo $this->Form->create('Company', array('action' => 'add'));
    echo $this->Form->input('Company.name', array('label' => 'Company name'));
    echo $this->Form->input('Company.description');
    echo $this->Form->input('Company.location');

    echo $this->Form->input('Account.0.name', array('label' => 'Account name'));
    echo $this->Form->input('Account.0.username');
    echo $this->Form->input('Account.0.email');

    echo $this->Form->end('Add');

注意看一下命名 Acount 模型的表单字段的方式。如果 Company 是主模型，
``saveAssociated()`` 方法期望相关模型(Account)的数据以特定的格式提供，而 
``Account.0.fieldName`` 恰恰是我们需要的。

.. note::

    上面的字段命名对于 hasMany 关联是必须的。如果模型之间的关联是 hasOne，对关联
    模型就要使用 ModelName.fieldName 标记方法了。

现在，可以在 CompaniesController 中创建 ``add()`` 动作了::

    public function add() {
        if (!empty($this->request->data)) {
            // 用下面的方法来避免验证错误：
            unset($this->Company->Account->validate['company_id']);
            $this->Company->saveAssociated($this->request->data);
        }
    }

就是这些。现在 Company 和 Account 模型将同时被验证和保存。默认情况下，
``saveAssociated`` 方法会验证所有传入的值，然后尝试对每一个进行保存。

保存通过(连接模型)的 hasMany 数据
=================================

让我们来看看如何保存两个模型的连接(*join*)表中的数据。就像 
:ref:`hasMany-through` 一节展示的那样，连接表用 `hasMany` 类型的关系关联到各个模
型。在我们的例子中，Cake 学校的负责人要求我们写一个应用程序，让他可以记录一个学
生在某门课上的出勤天数和分数。查看下面的代码。 ::

   // Controller/CourseMembershipController.php
   class CourseMembershipsController extends AppController {
       public $uses = array('CourseMembership');

       public function index() {
           $this->set(
                'courseMembershipsList',
                $this->CourseMembership->find('all')
            );
       }

       public function add() {
           if ($this->request->is('post')) {
               if ($this->CourseMembership->saveAssociated($this->request->data)) {
                   return $this->redirect(array('action' => 'index'));
               }
           }
       }
   }

   // View/CourseMemberships/add.ctp

   <?php echo $this->Form->create('CourseMembership'); ?>
       <?php echo $this->Form->input('Student.first_name'); ?>
       <?php echo $this->Form->input('Student.last_name'); ?>
       <?php echo $this->Form->input('Course.name'); ?>
       <?php echo $this->Form->input('CourseMembership.days_attended'); ?>
       <?php echo $this->Form->input('CourseMembership.grade'); ?>
       <button type="submit">Save</button>
   <?php echo  $this->Form->end(); ?>


提交的数据数组如下。 ::

    Array
    (
        [Student] => Array
        (
            [first_name] => Joe
            [last_name] => Bloggs
        )

        [Course] => Array
        (
            [name] => Cake
        )

        [CourseMembership] => Array
        (
            [days_attended] => 5
            [grade] => A
        )

    )

在 CakePHP 中，使用这种数据结构调用 `saveAssociated` 方法，就能够很容易地同时保
存这么多数据，并将 Student 和 Course 的外键赋值到 CouseMembership 内。如果我们运
行 CourseMembershipsController 的 index 动作，从 find(‘all’) 中获取的数据结构就
会是::

    Array
    (
        [0] => Array
        (
            [CourseMembership] => Array
            (
                [id] => 1
                [student_id] => 1
                [course_id] => 1
                [days_attended] => 5
                [grade] => A
            )

            [Student] => Array
            (
                [id] => 1
                [first_name] => Joe
                [last_name] => Bloggs
            )

            [Course] => Array
            (
                [id] => 1
                [name] => Cake
            )
        )
    )

当然，还有很多使用连接模型的方式。上面的方式假定你想要一次保存所有数据。存在这样
的情况，你想单独地创建 Student 和 Course，稍后再把两者与 CourseMembership 关联起
来。这样你可能有一个表单，允许通过现有学生和课程的列表或者 ID 输入项进行选择，以
及 CourseMembership 的两个字段，例如::

        // View/CourseMemberships/add.ctp

        <?php echo $this->Form->create('CourseMembership'); ?>
            <?php
                echo $this->Form->input(
                    'Student.id',
                    array(
                        'type' => 'text',
                        'label' => 'Student ID',
                        'default' => 1
                    )
                );
            ?>
            <?php
                echo $this->Form->input(
                    'Course.id',
                    array(
                        'type' => 'text',
                        'label' => 'Course ID',
                        'default' => 1
                    )
                );
            ?>
            <?php echo $this->Form->input('CourseMembership.days_attended'); ?>
            <?php echo $this->Form->input('CourseMembership.grade'); ?>
            <button type="submit">Save</button>
        <?php echo $this->Form->end(); ?>

所得到的 POST 数据为::

    Array
    (
        [Student] => Array
        (
            [id] => 1
        )

        [Course] => Array
        (
            [id] => 1
        )

        [CourseMembership] => Array
        (
            [days_attended] => 10
            [grade] => 5
        )
    )

利用 `saveAssociated` 方法，CakePHP 仍然可以很容易地把 Student id 和 Course id 
放入 CourseMembership 中。

.. _saving-habtm:

保存相关模型数据 (HABTM)
------------------------

保存通过 hasOne、belongsTo 和 hasMany 关联的模型非常简单：只需要将关联模型的 ID 
填入外键字段。 一旦完成，只要调用模型的 ``save()`` 方法，所有数据就被正确地连接
起来了。下面的示例是传递给 Tag 模型的 ``save()`` 方法的数据数组的格式::

    Array
    (
        [Recipe] => Array
            (
                [id] => 42
            )
        [Tag] => Array
            (
                [name] => Italian
            )
    )

也可以使用这种格式调用 ``saveAll()`` 来保存多条记录和它们的 HABTM 关联(模型)，使
用下面这样的数组::

    Array
    (
        [0] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 42
                    )
                [Tag] => Array
                    (
                        [name] => Italian
                    )
            )
        [1] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 43
                    )
                [Tag] => Array
                    (
                        [name] => Pasta
                    )
            )
        [2] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 51
                    )
                [Tag] => Array
                    (
                        [name] => Mexican
                    )
            )
        [3] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 17
                    )
                [Tag] => Array
                    (
                        [name] => American (new)
                    )
            )
    )

将上面的数组传递给 ``saveAll()`` 方法将创建所包含的标签(*tag*)，各自与它们相应的
菜单(*recipe*)关联。

另一个有用的例子是，当需要保存多个标签(*Tag*)到文章(*Post*)中。这需要用以下的 
HABTM 数组格式传入关联的 HABTM 数据。注意，只需要传入关联的 HABTM 模型的 id，不
论需要再怎样嵌套::

    Array
    (
        [0] => Array
            (
                [Post] => Array
                    (
                        [title] => 'Saving HABTM arrays'
                    )
                [Tag] => Array
                    (
                        [Tag] => Array(1, 2, 5, 9)
                    )
            )
        [1] => Array
            (
                [Post] => Array
                    (
                        [title] => 'Dr Who\'s Name is Revealed'
                    )
                [Tag] => Array
                    (
                        [Tag] => Array(7, 9, 15, 19)
                    )
            )
        [2] => Array
            (
                [Post] => Array
                    (
                        [title] => 'I Came, I Saw and I Conquered'
                    )
                [Tag] => Array
                    (
                        [Tag] => Array(11, 12, 15, 19)
                    )
            )
        [3] => Array
            (
                [Post] => Array
                    (
                        [title] => 'Simplicity is the Ultimate Sophistication'
                    )
                [Tag] => Array
                    (
                        [Tag] => Array(12, 22, 25, 29)
                    )
            )
    )

把上面的数组传入 ``saveAll($data, array('deep' => true))``，会在 posts_tags 连接
表中填入 Tag 和 Post 之间的关联。

作为示例，我们来创建一个表单，用来创建新的标签(*tag*)，动态生成正确的数据数组与
某个菜单(*recipe*)关联。

最简单的表单可以象这样(我们假定 ``$recipe_id`` 已经设置为某值了)::

    <?php echo $this->Form->create('Tag'); ?>
        <?php echo $this->Form->input(
            'Recipe.id',
            array('type' => 'hidden', 'value' => $recipe_id)
        ); ?>
        <?php echo $this->Form->input('Tag.name'); ?>
    <?php echo $this->Form->end('Add Tag'); ?>

在这个例子中，你可以看到 ``Recipe.id`` 隐藏字段的值被设置为 tag 要连接的 recipe 
的 ID。

当在控制器中调用 ``save()`` 方法时，它将自动将 HABTM 数据保存到数据库::

    public function add() {
        // Save the association
        if ($this->Tag->save($this->request->data)) {
            // do something on success
        }
    }

调用上面这段代码，将创建新的 Tag 并与 Recipe 相关联，其 ID 为 
``$this->request->data['Recipe']['id']``。

其它我们可能希望呈现关联数据的方式，可以包括下拉列表。数据可以使用 
``find('list')`` 方法从模型中取出，并且赋给用模型名命名的视图变量。同名的输入项(
*input*)会自动把该数据放入 ``<select>`` 元素中::

    // 在控制器中:
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // 在视图中:
    $this->Form->input('tags');

HABTM 关系更可能的情形会包含一个允许多选的 ``<select>`` 元素。例如，一个菜单(
*Recipe*)可以被贴上多个标签(*Tag*)。在这种情况下，数据以相同的方式从模型中取出，
但是表单的输入项(*input*)定义稍有不同。tag 名称使用 ``ModelName`` 约定来定义::

    // 在控制器中:
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // 在视图中:
    $this->Form->input('Tag');

使用上面这段代码，会创建多选的下拉列表(*drop down*)，允许多个选项自动被保存到数
据库中已添加或已保存的现有 Recipe 上。

自我 HABTM
~~~~~~~~~~

通常 HABTM 关联用于绑定2个模型，但是它也可以用于1个模型，不过这需要更加小心。

关键在于模型的设置 ``className``。简单地添加 ``Project`` HABTM ``Project`` 关联
会引起保存数据时的错误。设置 ``className`` 为模型名称，并用别名作为键，就避免了
这些问题。 ::

    class Project extends AppModel {
        public $hasAndBelongsToMany = array(
            'RelatedProject' => array(
                'className'              => 'Project',
                'foreignKey'             => 'projects_a_id',
                'associationForeignKey'  => 'projects_b_id',
            ),
        );
    }

创建表单元素，保存数据，都象以前一样，但是要使用别名。这样的代码::

    $this->set('projects', $this->Project->find('list'));
    $this->Form->input('Project');

就变成这样::

    $this->set('relatedProjects', $this->Project->find('list'));
    $this->Form->input('RelatedProject');

当 HABTM 变得复杂时怎么办？
~~~~~~~~~~~~~~~~~~~~~~~~~~~

默认情况下，当保存 HasAndBelongsToMany 关系时，在保存新行之前 CakePHP 会先删除连
接表中的所有(相关)行。 例如，一个 Club 有10个相关的 Children，然后更新 Club 为只
有2个 children。这样，Club 将只有2个 Children，而不是12个。

也要注意，如果想要在连接中加入更多字段(何时创建或者其它数据)，这在使用 HABTM 连
接表时是可能的，不过重要的是要明白你有简单的解决办法。

两个模型间的 HasAndBelongsToMany 关联实际上是同时通过 hasMany 和 belongsTo 关联
的三个模型关系的简写。

考虑这个例子::

    Child hasAndBelongsToMany Club

另一种看待它的方法是添加一个 Membership 模型::

    Child hasMany Membership
    Membership belongsTo Child, Club
    Club hasMany Membership.

这两个例子几乎是完全相同的。它们在数据库中使用了相同数量的命名字段，相同数量的模
型。重要的区别是，"连接(*join*)" 模型命名不同，并且其行为更容易预知。

.. tip::

    当连接表包含两个外键以外的额外字段时，通过将数组的键 ``'unique'`` 设置为 
    ``'keepExisting'``，能够防止丢失额外字段的值。你可以认为这与设置 
    'unique' => true 类似，但在保存操作过程中不会丢失额外字段的数据。另外，如果
    你使用 bake 来创建模型，自动会设置成这样。参见 
    :ref:`HABTM 关联数组 <ref-habtm-arrays>`。

不过，在大多数情况下，象上面的例子那样为连接表建立模型，设置 hasMany、belongsTo 
关联，比使用 HABTM 关联更简单。

数据表
======

虽然 CakePHP 可以有非数据库驱动的数据源，但大多数时候是数据库驱动的。CakePHP 被
设计成与(数据库)无关，可以使用 MySQL、Microsoft SQL Server、PostgreSQL 和其它数据库。你可以象平
时那样创建数据库表。在创建模型类时，模型将自动映射到你创建的表上。按照约定，表名
为小写、复数，多个单词的表名用下划线分隔。例如，名为 Ingredient 的模型对应的表名
为 ingredients。名为 EventRegistration 的模型对应的表名为 event_registrations。
CakePHP 会检视表来决定每个字段的数据类型，并使用这些信息自动化各种特性，比如输出
视图中的表单字段。按照约定，字段名为小写并用下划线分隔。

使用 created 和 modified 列
---------------------------

如果在数据库表中定义 ``created`` 和/或 ``modified`` 字段为 datetime 字段(缺省值 
null)，CakePHP 能够识别这些字段，每当创建或保存一条记录到数据库时，自动填入这两
个字段(除非要保存的数据中已经包含了这两个字段的值)。

在最初添加记录时，``created`` 和 ``modified`` 字段会被设置为当前日期和时间。每当
保存现有记录时，modified 字段会被更新为当前日期和时间。

如果在调用 Model::save() 之前 ，$this->data 中包含了 ``created`` 或 ``modified`` 
字段的数据(例如来自 Model::read 或者 Model::set 方法)，那么这些值将从 
$this->data 中获取，而不会自动魔法更新。如果不希望那样，可以用 
``unset($this->data['Model']['modified'])`` 等。另一种方法，可以重载 
Model::save() 方法来帮你总是这么做::

    class AppModel extends Model {

        public function save($data = null, $validate = true, $fieldList = array()) {
            // 在每次调用 save 方法前清除 modified 字段值：
            $this->set($data);
            if (isset($this->data[$this->alias]['modified'])) {
                unset($this->data[$this->alias]['modified']);
            }
            return parent::save($this->data, $validate, $fieldList);
        }

    }

.. meta::
    :title lang=zh: Saving Your Data
    :keywords lang=zh: doc models,validation rules,data validation,flash message,null model,table php,request data,php class,model data,database table,array,recipes,success,reason,snap,data model

