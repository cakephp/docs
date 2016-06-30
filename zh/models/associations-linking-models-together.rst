关联：将模型连接在一起
######################

CakePHP 的最强大的特性之一就是由模型提供的连接关系的映射。在 CakePHP 中，模型间
的连接是通过关联(*association*)来处理的。

在应用程序的不同对象间定义关联应当是一个自然的过程。例如：在一个食谱数据库中，一
份食谱可能有多条评论，每条评论有一位作者，而每位作者又可能有多份食谱。定义这些关
系运作的方式，使得你能以一种直观且强大的方式访问你的数据。

本节的目的是展示如何在 CakePHP 中计划、定义以和使用模型之间的关系。

虽然数据可能有多种来源，但在 web 应用程序中最常见的存储方式是关系型数据库。本节
介绍的大部分内容将基于这种方式。

欲知与插件模型的关联，请参见 :ref:`plugin-models`。

关系类型
--------

CakePHP 的四种关联类型是：hasOne、hasMany、belongsTo 和 hasAndBelongsToMany 
(HABTM)。

============= ===================== =======================================
关系          关联类型              例子
============= ===================== =======================================
一对一        hasOne                一个用户只有一份个人资料。
------------- --------------------- ---------------------------------------
一对多        hasMany               一个用户可以有多份食谱。
------------- --------------------- ---------------------------------------
多对一        belongsTo             多份食谱属于同一个用户。
------------- --------------------- ---------------------------------------
多对多        hasAndBelongsToMany   多份食谱有且属于多种原料。
============= ===================== =======================================

要进一步阐明在模型中关联定义的方式：如果模型的表包含外键(other_model_id)，该模型
的关系类型 **总是** 模型 **belongsTo** 另一个模型的关系。


要定义关联，创建一个以要定义的关联命名的类变量。此变量有时候可以简单到只是一个字
符串，但也可以复杂到是一个多维数组，来定义关联细节。

::

    class User extends AppModel {
        public $hasOne = 'Profile';
        public $hasMany = array(
            'Recipe' => array(
                'className' => 'Recipe',
                'conditions' => array('Recipe.approved' => '1'),
                'order' => 'Recipe.created DESC'
            )
        );
    }

在上面的例子中，第一个 'Recipe' 是所谓的 '别名(*Alias*)'。它是关系的标识，可以是
任何东西。通常选择与它引用的类相同的名字。不过，**每个模型的别名在应用程序中必须
唯一**。例如，下面是正确的::

    class User extends AppModel {
        public $hasMany = array(
            'MyRecipe' => array(
                'className' => 'Recipe',
            )
        );
        public $hasAndBelongsToMany = array(
            'MemberOf' => array(
                'className' => 'Group',
            )
        );
    }

    class Group extends AppModel {
        public $hasMany = array(
            'MyRecipe' => array(
                'className' => 'Recipe',
            )
        );
        public $hasAndBelongsToMany = array(
            'Member' => array(
                'className' => 'User',
            )
        );
    }

但是下面的代码在任何情况下都不大行得通::

    class User extends AppModel {
        public $hasMany = array(
            'MyRecipe' => array(
                'className' => 'Recipe',
            )
        );
        public $hasAndBelongsToMany = array(
            'Member' => array(
                'className' => 'Group',
            )
        );
    }

    class Group extends AppModel {
        public $hasMany = array(
            'MyRecipe' => array(
                'className' => 'Recipe',
            )
        );
        public $hasAndBelongsToMany = array(
            'Member' => array(
                'className' => 'User',
            )
        );
    }

这是因为在上面的 HABTM 关联中，别名 'Member' 既指向了 User 模型(在 Group 模型中)，
又指向了 Group 模型(在 User 模型中)。在涉及多个模型时，为模型别名起不唯一的名字，
可能会引起预料不到的行为。

CakePHP 会自动在关联模型对象之间建立连接。所以，例如，在 ``User`` 模型中，可以用
如下方式访问 ``Recipe`` 模型::

    $this->Recipe->someFunction();

同样的，在控制器中，也可以简单地循着模型关系访问关联的模型::

    $this->User->Recipe->someFunction();

.. note::

    记住，关联定义是'单向的'。如果定义了 User hasMany Recipe(用户有很多菜谱)，这
    对 Recipe 模型没有任何影响。需要定义 Recipe belongsTo User(菜谱属于用户)才能
    从 Recipe 模型访问 User 模型。

hasOne
------

让我们设置 User 模型以 hasOne 关系关联到 Profile 模型。

首先，数据库表需要有正确的键。要使 hasOne 关系运作，一个表必须定义指向另一个表的
记录的外键。在本例中，profiles 表需要包含一个叫做 user\_id 的字段。其基本模式是：

**hasOne:** *另一个* 模型包含外键。

======================================== ==================
关系                                     数据结构
======================================== ==================
Apple hasOne Banana (苹果有一个香蕉)     bananas.apple\_id
---------------------------------------- ------------------
User hasOne Profile (用户有一份个人资料) profiles.user\_id
---------------------------------------- ------------------
Doctor hasOne Mentor (博士有一位导师)    mentors.doctor\_id
======================================== ==================

.. note::

    关于这一点，并没有强制要求遵循 CakePHP 的约定。你能够很容易地在关联定义中覆
    盖任何外键的使用。虽然如此，遵守规则仍将减少代码的重复，使其更易于阅读和维护。

User 模型文件会保存为 /app/Model/User.php。为了定义 'User hasOne Profile (用户有
一份个人资料)' 的关联，为模型类添加 $hasOne 属性。记得要在 
/app/Model/Profile.php 文件中定义 Profile 模型，否则关联将无法工作::

    class User extends AppModel {
        public $hasOne = 'Profile';
    }

有两种方法在模型文件中描述此关系。最简单的方法是设置 $hasOne 属性为一个包含关联
模型的类名的字符串，就像我们上面做的那样。

如果需要更多的控制，可以使用数组语法定义关联。例如，你可能想要限制关联只包含某些
记录。

::

    class User extends AppModel {
        public $hasOne = array(
            'Profile' => array(
                'className' => 'Profile',
                'conditions' => array('Profile.published' => '1'),
                'dependent' => true
            )
        );
    }

hasOne 关联数组可以包含的键有:


-  **className**: 与当前模型关联的模型的类名。如果你要定义 'User hasOne Profile
   (用户有一份个人资料)' 的关系，className 键应当是 'Profile'。
-  **foreignKey**: 另一模型中的外键名。如果需要定义多个 hasOne 关系，这个键非常
   有用。其默认值为当前模型的以下划线分隔的单数模型名称，并后缀以 '\_id'。在上面
   的例子中，就默认为 'user\_id'。
-  **conditions**: 兼容 find() 的条件数组或者是 SQL 字符串，例如
   array('Profile.approved' => true)。
-  **fields**: 在读取关联模型数据时，需要读取的字段的列表。默认返回所有的字段。
-  **order**: 兼容 find() 的排序子句或者 SQL 字符串，例如
   array('Profile.last_name' => 'ASC')。
-  **dependent**: 当 dependent 键被设置为 true，并且调用模型的 delete() 方法时参
   数 cascade 也被设置为 true，关联模型的记录也会一起被删除。在本例中，我们将其
   设置为 true 将导致删除一个 User 时也会删除她/他关联的 Profile。

一旦定义了关系，User 模型的 find 操作也会读取关联的 Profile 记录，如果存在的话::

    //调用 $this->User->find() 的结果示例。

    Array
    (
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Profile] => Array
            (
                [id] => 12
                [user_id] => 121
                [skill] => Baking Cakes
                [created] => 2007-05-01 10:31:01
            )
    )

belongsTo
---------

现在我们可以从 User 模型访问 Profile 的数据，让我们在 Profile 模型中定义 
belongsTo 关联以获取相关的 User 数据。belongsTo 关联是 hasOne 和 hasMany 
关联的自然补充：它让我们可以从另一个方向查看数据。

在为 belongsTo 关系定义数据库表的键时，请遵循如下约定：

**belongsTo:** *当前模型* 包含外键。

========================================= ==================
关系                                      数据结构
========================================= ==================
Banana belongsTo Apple (香蕉属于苹果)     bananas.apple\_id
----------------------------------------- ------------------
Profile belongsTo User (个人资料属于用户) profiles.user\_id
----------------------------------------- ------------------
Mentor belongsTo Doctor (导师属于博士)    mentors.doctor\_id
========================================= ==================

.. tip::

    如果一个模型(表)包含一个外键，它 belongsTo 另一个模型(表)。

在 /app/Model/Profile.php 文件中的 Profile 模型里，我们可以使用如下字符串语法来
定义 belongsTo 关联::

    class Profile extends AppModel {
        public $belongsTo = 'User';
    }

我们也可以使用数组语法定义更为特定的关系::

    class Profile extends AppModel {
        public $belongsTo = array(
            'User' => array(
                'className' => 'User',
                'foreignKey' => 'user_id'
            )
        );
    }

belongsTo 关联数组可以包含的键有:


-  **className**: 与当前模型关联的模型的类名。如果你要定义 'Profile belongsTo
   User (个人资料属于用户)' 的关系，className 键应当是 'User'。
-  **foreignKey**: 当前模型中的外键。如果需要定义多个 belongsTo 关系，这特别方便。
   其默认值为另一模型的以下划线分隔的单数模型名，后缀以 ``_id``。
-  **conditions**: 兼容 find() 的条件数组或者 SQL 字符串，例如
   ``array('User.active' => true)``。
-  **type**: SQL 查询使用的 join 类型。默认为 'LEFT'，这也许不能在所有情况下都符
   合你的需要。在你想要获取主模型和关联模型的所有记录、或者什么都不要时，'INNER' 
   (当和某些条件一起使用时)也许会有帮助。
-  **fields**: 在读取关联模型数据时，需要读取的字段的列表。默认返回所有的字段。
-  **order**: 兼容 find() 的排序子句或者 SQL 字符串，例如
   ``array('User.username' => 'ASC')``。
-  **counterCache**: 如果此键的值设置为 true，当你在做 ``save()`` 或者
   ``delete()`` 操作时，关联模型将自动递增或递减外键关联的表的 "[以下划线分隔的
   单数模型名称]\_count" 列的值。如果它是一个字符串，那这就是要使用的列名。计数
   器列的值表示关联记录的行数。也可以通过使用数组指定多个计数器缓存，详见 
   :ref:`multiple-counterCache`。
-  **counterScope**: 可选的用于更新计数器缓存字段的条件数组。

一旦定义了关联，Profile 模型的 find 操作将同时获取相关的 User 记录，如果存在的话::

    //调用 $this->Profile->find() 的结果示例。

    Array
    (
       [Profile] => Array
            (
                [id] => 12
                [user_id] => 121
                [skill] => Baking Cakes
                [created] => 2007-05-01 10:31:01
            )
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
    )

计数器缓存(*counterCache*) - 缓存 count()
=========================================

这个功能帮助你缓存相关数据的计数器。避免了手工调用 ``find('count')`` 方法计算记
录的数量，而是让模型自动追踪关联的 ``$hasMany`` 模型的任何添加/删除操作，并递增/
递减父模型表的专用整数字段。

这个字段的名称由单数模型名称后缀以下划线和单词 "count" 构成::

    my_model_count

比方说有一个叫 ``ImageComment`` 的模型和一个叫 ``Image`` 的模型，你就要在 
``images`` 表中添加一个新的整数字段，并命名为 ``image_comment_count``。

下面是更多的示例：

========== ======================= =========================================
模型       关联模型                例子
========== ======================= =========================================
User       Image                   users.image\_count
---------- ----------------------- -----------------------------------------
Image      ImageComment            images.image\_comment\_count
---------- ----------------------- -----------------------------------------
BlogEntry  BlogEntryComment        blog\_entries.blog\_entry\_comment\_count
========== ======================= =========================================

一旦添加了计数器字段，就可以使用它了。要启用计数器缓存，在关联中添加 
``counterCache`` 键并将其值设置为 ``true``::

    class ImageComment extends AppModel {
        public $belongsTo = array(
            'Image' => array(
                'counterCache' => true,
            )
        );
    }

自此，你每次添加或删除一个关联到 ``Image`` 的 ``ImageComment``，
``image_comment_count`` 字段的数字都会自动调整。

计数器范围(*counterScope*)
==========================

你还可以指定 ``counterScope``。这允许你指定一个简单的条件，告诉模型什么情况下更
新(或者什么情况下不更新，取决于你如何看)计数器的值。

在我们的 Image 模型示例中，我们可以象下面这样指定::

    class ImageComment extends AppModel {
        public $belongsTo = array(
            'Image' => array(
                'counterCache' => 'active_comment_count', //custom field name
                // 只有当 "ImageComment" 是 active = 1 时，才计数
                'counterScope' => array(
                  'ImageComment.active' => 1
                )
            )
        );
    }

.. _multiple-counterCache:

多个计数器缓存(*counterCache*)
==============================

CakePHP 从 2.0 版本起，支持在单个模型关系中有多个 ``counterCache``。也可以为每个
``counterCache`` 定义 ``counterScope``。假设有 ``User`` 模型和 ``Message`` 模型，
要统计每个用户的已读消息和未读消息的数量。

========= ====================== ===========================================
模型      字段                   说明
========= ====================== ===========================================
User      users.messages\_read   对已读 ``Message`` 计数
--------- ---------------------- -------------------------------------------
User      users.messages\_unread 对未读 ``Message`` 计数
--------- ---------------------- -------------------------------------------
Message   messages.is\_read      判断一条 ``Message`` 是已读还是未读。
========= ====================== ===========================================

基于上面这样的设置，``belongsTo`` 应当像这样::

    class Message extends AppModel {
        public $belongsTo = array(
            'User' => array(
                'counterCache' => array(
                    'messages_read' => array('Message.is_read' => 1),
                    'messages_unread' => array('Message.is_read' => 0)
                )
            )
        );
    }

hasMany
-------

下一步：定义一个 "User hasMany Comment (用户有多条评论)" 的关联。hasMany 关联将
让我们可以在读取用户(*User*)记录的同时读取用户的评论。

在为 hasMany 关系定义数据库表的键时，请遵循如下约定:

**hasMany:** *其它* 模型包含外键

======================================== ==================
关系                                     数据构
======================================== ==================
User hasMany Comment (用户有多条评论)    Comment.user\_id
---------------------------------------- ------------------
Cake hasMany Virtue (蛋糕有多项优点)     Virtue.cake\_id
---------------------------------------- ------------------
Product hasMany Option (产品有多个选项)  Option.product\_id
======================================== ==================

在 /app/Model/User.php 文件的 User 模型中，我们可以使用如下字符串语法定义 hasMany
关联::

    class User extends AppModel {
        public $hasMany = 'Comment';
    }

我们也可以使用数组语法定义更特定的关系::

    class User extends AppModel {
        public $hasMany = array(
            'Comment' => array(
                'className' => 'Comment',
                'foreignKey' => 'user_id',
                'conditions' => array('Comment.status' => '1'),
                'order' => 'Comment.created DESC',
                'limit' => '5',
                'dependent' => true
            )
        );
    }

hasMany 关联数组可以包含的键有:


-  **className**: 与当前模型关联的模型的类名。如果你定义了 'User hasMany
   Comment (用户有多条评论)' 关系，className 键的值应当为 'Comment'。
-  **foreignKey**: 另一个模型中的外键名。如果需要定义多个 hasMany 关系，这特别方
   便。其默认值为当前模型以下划线分隔的单数模型名称后缀以 '\_id'。
-  **conditions**: 兼容 find() 的条件数组或者 SQL 字符串，例如
   array('Comment.visible' => true)。
-  **order**: 兼容 find() 的排序子句或者 SQL 字符串，例如
   array('Profile.last_name' => 'ASC')。
-  **limit**: 要返回的关联数据的最大行数。
-  **offset**: 在读取和关联之前，要跳过的关联数据行数(在当前查询条件和排序的情况
   下)。
-  **dependent**: 当 dependent 设置为 true，就可以进行模型的递归删除。在本例中，
   当关联的  User 记录被删除时，Comment 记录也将被删除。
-  **exclusive**: 当 exclusive 设置为 true，将调用 deleteAll() 进行模型的递归删
   除，而不是分别删除每条数据。这大大提高了性能，但可能并非在所有情况下都是最好
   的选择。
-  **finderQuery**: 可供 CakePHP 用于读取关联模型记录的完整 SQL 查询语句。这应当
   用于要求高度定制结果的场合。如果构建的查询语句要求使用关联模型 ID，可以在查询
   语句中使用特殊标记 ``{$__cakeID__$}``。例如，如果 Apple 模型 hasMany Orange，
   查询语句就应当象这样：
   ``SELECT Orange.* from oranges as Orange WHERE Orange.apple_id = {$__cakeID__$};`` 。


一旦关联被建立，User 模型的 find 操作也将读取相关的 Comment 数据，如果存在的话::

    //调用 $this->User->find() 的结果示例。

    Array
    (
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Comment] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [user_id] => 121
                        [title] => On Gwoo the Kungwoo
                        [body] => The Kungwooness is not so Gwooish
                        [created] => 2006-05-01 10:31:01
                    )
                [1] => Array
                    (
                        [id] => 124
                        [user_id] => 121
                        [title] => More on Gwoo
                        [body] => But what of the 'Nut?
                        [created] => 2006-05-01 10:41:01
                    )
            )
    )

要记住的一点是，还需要互补的 Comment belongsTo User (评论属于用户)关联，才能从两
个方向获取数据。本节涵盖的内容让你能够从 User 模型获取 Comment 数据。在 Comment 
模型中添加 Comment belongsTo User 关联，使你能够从 Comment 模型中获取 User 数据，
这样才构成完整的连接，允许信息以任一模型的视角流动。

hasAndBelongsToMany (HABTM)
---------------------------

好了。现在你已经可以认为自己是 CakePHP 模型关联的专业人士了。你已经深谙对象关系
中占主要部分的三种关联。

现在我们来解决最后一种关系类型：hasAndBelongsToMany，或 HABTM。这种关联用于两个
模型需要以不同方式多次重复连接的场合。

hasMany 与 HABTM 主要不同点在于，HABTM 中对象间的连接不是排他的。例如，以 HABTM 
方式连接 Recipe 模型和 Ingredient 模型。用西红柿作为我奶奶的意大利面菜谱(Recipe)
的原料(Ingredient)，并不会"用光"这种原料。我也可以把它用于色拉菜谱(Recipe)。

hasMany 关联对象间的连接是排他的。如果 User hasMnay Comments，一条评论仅连接到一
个特定的用户，它不能再被用于(其它用户)。

继续。我们需要在数据库中设置一个额外的表，用来处理 HABTM 关联。这个新连接表的名
字需要包含涉及的两个模型的名字，按字母顺序并且用下划线( \_ )间隔。表的内容应当有
两个字段，为指向涉及的模型主键的外键(应当是整数类型)。为避免任何问题，不要为这个
两个字段定义复合主键。如果应用程序要求唯一索引，你可以定义一个。如果你计划在这个
表中加入任何额外的信息，或者使用 'with' 模型，你需要添加一个额外的主键字段(按照
约定为 'id')。

**HABTM** 要求一个单独的连接表，其表名包含两个 *模型* 的名字。

========================= ================================================================
关系                      HABTM 表的字段
========================= ================================================================
Recipe HABTM Ingredient   **ingredients_recipes**.id, **ingredients_recipes**.ingredient_id, **ingredients_recipes**.recipe_id
------------------------- ----------------------------------------------------------------
Cake HABTM Fan            **cakes_fans**.id, **cakes_fans**.cake_id, **cakes_fans**.fan_id
------------------------- ----------------------------------------------------------------
Foo HABTM Bar             **bars_foos**.id, **bars_foos**.foo_id, **bars_foos**.bar_id
========================= ================================================================


.. note::

    按照约定，(两个模型的)表名是按字母顺序的。也可以在关联定义中使用自定义表名。

按照约定，确保表 **cakes** 和 **recipes** 应当使用 "id" 字段作为主键。如果它们与
约定的不同，那就必须在模型的 :ref:`model-primaryKey` 中做(相应的)改变。

一旦建立了这个新表，我们就可以在模型文件中定义 HABTM 关联了。这次我们将直接跳到
数组语法::

    class Recipe extends AppModel {
        public $hasAndBelongsToMany = array(
            'Ingredient' =>
                array(
                    'className' => 'Ingredient',
                    'joinTable' => 'ingredients_recipes',
                    'foreignKey' => 'recipe_id',
                    'associationForeignKey' => 'ingredient_id',
                    'unique' => true,
                    'conditions' => '',
                    'fields' => '',
                    'order' => '',
                    'limit' => '',
                    'offset' => '',
                    'finderQuery' => '',
                    'with' => ''
                )
        );
    }

HABTM 关联数组可以包含的键有：

.. _ref-habtm-arrays:

-  **className**: 关联到当前模型的模型类名。如果你定义了 'Recipe HABTM
   Ingredient (菜谱有许多且属于原料)' 的关系，这个类名应当是 'Ingredient'。
-  **joinTable**: 在本关联中使用的连接表的名字(如果当前表没有遵循 HABTM 连接表的
   命名约定)。
-  **with**: 为连接表定义模型名。默认的情况下，CakePHP 将自动为你建立一个模型。
   上例中，它被称为 IngredientsRecipe。可以使用这个键来覆盖默认的名字。连接表模
   型能够象所有的“常规”模型那样用来直接访问连接表。通过创建带有这样名称和文件名
   的模型类，可以向连接表搜索中加入任何自定义行为，例如加入更多的信息/列。
-  **foreignKey**: 当前模型的外键名称。在需要定义多个 HABTM 关系时，这特别方便。
   该键的默认值为当前模型的以下划线分隔的单数模型名，后缀以 '\_id'。
-  **associationForeignKey**: 另一个模型中的外键名。在需要定义多个 HABTM 关系，
   这特别方便。该键的默认值为另一模型的以下划线分隔的单数模型名，后缀以 '\_id'。
-  **unique**: 布尔值或者字符串 ``keepExisting`` 。
    - 如果为 true (默认值)，CakePHP 将先删除外键表中存在的关系记录，再插入新记录。
      现有的关联在更新时需要再次传递。
    - 如果为 false，CakePHP 将插入指定的新关系记录，并且保留现有关系记录，这可能
      导致重复的关系记录。
    - 如果设置为 ``keepExisting``，其行为与 `true` 类似，但是有一项额外的检查，
      如果要添加的任何记录与现有的关系记录重复，现有关系记录不被删除，而重复记录
      则被忽略。这可用于，例如，当连接表中有其它数据需要保留时。
-  **conditions**: 兼容 find() 的条件数组或者 SQL 字符串。如果关联表有条件，应当
   使用 'with' 模型，并且在关联表定义必要的 belongsTo 关联。
-  **fields**: 在读取关联模型数据时要读取的字段的列表。默认返回所有的字段。
-  **order**: 兼容 find() 的排序子句或者 SQL 字符串。
-  **limit**: 要返回的关联行的最大行数。
-  **offset**: 在读取和关联前要跳过的关联行的行数(给定当前的条件和排序)
-  **finderQuery**: CakePHP 用来读取关联模型记录的完整 SQL 查询语句。这应当用在
   要求高度定制结果的场合。

一旦定义了关联，Recipe 模型的 find 操作也会读取相关的 Ingredient 记录，如果存在
的话::

    //调用 $this->Recipe->find() 的结果示例。

    Array
    (
        [Recipe] => Array
            (
                [id] => 2745
                [name] => Chocolate Frosted Sugar Bombs
                [created] => 2007-05-01 10:31:01
                [user_id] => 2346
            )
        [Ingredient] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [name] => Chocolate
                    )
               [1] => Array
                    (
                        [id] => 124
                        [name] => Sugar
                    )
               [2] => Array
                    (
                        [id] => 125
                        [name] => Bombs
                    )
            )
    )

如果要想在使用 Ingredient 模型时获取 Recipe 数据，记得在 Ingredient 模型中定义 
HABTM 关联。

.. note::

   HABTM 数据被视为完整的集合。每次添加新的数据关联，数据库中关联行的整个集合会
   被删除并重新创建，所以应当总是传入整个数据集来保存。欲知使用 HABTM 的其它方法，
   请参见 :ref:`hasMany-through`。

.. tip::

    欲知关于保存 HABTM 对象的更多信息，请参见 :ref:`saving-habtm`。


.. _hasMany-through:

通过(连接模型)的 hasMany
------------------------

有时候需要在多对多关联中保存附加数据。考虑以下情况

`Student hasAndBelongsToMany Course`

`Course hasAndBelongsToMany Student`

换句话说，一名学生(*Student*)可以选修多门课程(*Course*)，而一门课程(*Course*)也
可以被多名学生(*Student*)选修。 这个简单的多对多关联需要一个类似于如下结构的表::

    id | student_id | course_id

现在，如果我们要保存学生在这门课程中出勤的天数以及他们的最终分数呢？需要的这张表
将变成::

    id | student_id | course_id | days_attended | grade

问题是，hasAndBelongsToMany 不支持这类情况，因为 hasAndBelongsToMany 关联保存时，
先要删除这个关联。这些列中的额外数据会丢失，因为新插入的数据中没有这些数据。

    .. versionchanged:: 2.1

    你可以将 ``unique`` 设置为 ``keepExisting`` 来防止在保存操作中丢失额外的数据。
    请参阅 :ref:`HABTM association arrays <ref-habtm-arrays>`。

实现需求的方法是使用 **连接模型**，或者也称为 **hasMany through** 关联。即，关联
自身也是一个模型。现在我们建立一个新的模型 CourseMembership。请看下面的模型。 ::

            // Student.php
            class Student extends AppModel {
                public $hasMany = array(
                    'CourseMembership'
                );
            }

            // Course.php

            class Course extends AppModel {
                public $hasMany = array(
                    'CourseMembership'
                );
            }

            // CourseMembership.php

            class CourseMembership extends AppModel {
                public $belongsTo = array(
                    'Student', 'Course'
                );
            }

CourseMembership 连接模型除了保存额外的元信息(即关联信息)，还唯一地标识了一名给
定学生对一门课程的参与(即出勤天数及分数)。

连接模型是非常有用的功能，借助于内置的 hasMany 和 belongsTo 关联及 saveAll 特性，
CakePHP 让使用它非常容易。

.. _dynamic-associations:

动态创建和销毁关联
------------------

有时候必须在运行时动态建立和销毁模型关联。这也许是因为以下任何几种原因:


-  想减少获取的关联数据的数据量，但是所有的关联都是在关联的第一级。
-  想要改变定义关联的方式以便排序或者过滤关联数据。

这种关联的建立与取消由 CakePHP 模型的 bindModel() 和 unbindModel() 方法来完成。
(还有一个非常有用的行为叫 "Containable"。欲知更多信息，请参阅手册中内置行为一节。)
让我们来设置几个模型，看看 bindModel() 和 unbindModel() 方法如何工作。我们从两个
模型开始::

    class Leader extends AppModel {
        public $hasMany = array(
            'Follower' => array(
                'className' => 'Follower',
                'order' => 'Follower.rank'
            )
        );
    }

    class Follower extends AppModel {
        public $name = 'Follower';
    }

现在，在 LeaderController 控制器中，我们能够使用 Leader 模型的 find() 方法获取一
个 Leader 和与它关联的追随者(followers)。就像你上面看到的那样，Leader 模型的关联
数组定义了 "Leader hasMany Followers" 关系。出于演示的目的，让我们在控制器动作中
使用 unbindModel() 方法删除该关联::

    public function some_action() {
        // 这会获取 Leader 及其相关的 Followers
        $this->Leader->find('all');

        // 让我们删除 hasMany 关联……
        $this->Leader->unbindModel(
            array('hasMany' => array('Follower'))
        );

        // 现在使用 find 函数将只返回 Leaders，而没有 Followers
        $this->Leader->find('all');

        // 注：unbindModel 方法只影响紧随其后的 find 方法。再往后调用 find 方法
        // 时仍将使用配置的关联信息。

        // 我们已经在 unbindModel() 之后调用了 find('all')，所以这次又会获取 
        // Leaders 及相关的 Followers……
        $this->Leader->find('all');
    }

.. note::

    使用 bindModel() 和 unbindModel() 方法来添加和删除关联，仅在 *紧随其后* 的 
    find 操作中有效，除非第二个参数设置为 false。如果第二个参数被设置为 *false*，
    在请求的余下阶段仍将保持这种(动态绑定的)效果。

以下是 unbindModel() 的基本用法模式::

    $this->Model->unbindModel(
        array('关联类型' => array('关联模型类名'))
    );

现在我们成功地动态删除了一个关联。让我们来添加一个。我们至今尚没有 Principle 的
Leader 模型需要一些关联的 Principle。我们的 Principle 模型文件几乎是空的，只有 
public $name 声明语句。让我们动态给我们的 Leader 关联一些 Principle (但记得，这
仅在紧随其后的 find 操作中有效)。在 LeadersController 控制器中有如下函数::

    public function another_action() {
        // 在 leader.php 模型文件中没有 Leader hasMany Principles 关联，所以这里
        // 的 find 只读取了 Leaders。
        $this->Leader->find('all');

        // 让我们用 bindModel() 方法为 Leader 模型添加一个新的关联：
        $this->Leader->bindModel(
            array('hasMany' => array(
                    'Principle' => array(
                        'className' => 'Principle'
                    )
                )
            )
        );

        // 现在我们已经正确地设置了关联，我们可以调用一次 find 函数来获取 Leader
        // 及其相关的 principle：
        $this->Leader->find('all');
    }

就是这样。bindModel() 方法的基本用法是封装在数组中的常规关联数组，该数组的键为要
建立的关联的类型::

    $this->Model->bindModel(
        array('关联名称' => array(
                '关联模型类名' => array(
                    // 这里是常规的关联的键……
                )
            )
        )
    );

虽然新绑定的模型在它的模型文件中不需要定义任何关联，但是要使新的关联正常工作，仍
然需要为其设置正确的(数据库表的)键。

与同一模型的多个关系
--------------------

有些情况下，一个模型与另一个模型有多种关系。例如，消息(Message)模型与用户(User)
模型有两种关系：一种是与发送消息的用户的关系，第二种是与接收消息的用户的关系。
messages 表有一个 user\_id 字段，还有一个 recipient\_id 字段。这样的话消息
(Message)模型看起来就象这样::

    class Message extends AppModel {
        public $belongsTo = array(
            'Sender' => array(
                'className' => 'User',
                'foreignKey' => 'user_id'
            ),
            'Recipient' => array(
                'className' => 'User',
                'foreignKey' => 'recipient_id'
            )
        );
    }

Recipient 是 User 模型的别名。现在来瞧瞧 User 模型是什么样的::

    class User extends AppModel {
        public $hasMany = array(
            'MessageSent' => array(
                'className' => 'Message',
                'foreignKey' => 'user_id'
            ),
            'MessageReceived' => array(
                'className' => 'Message',
                'foreignKey' => 'recipient_id'
            )
        );
    }

也可以建立自我关联，如下所示::

    class Post extends AppModel {

        public $belongsTo = array(
            'Parent' => array(
                'className' => 'Post',
                'foreignKey' => 'parent_id'
            )
        );

        public $hasMany = array(
            'Children' => array(
                'className' => 'Post',
                'foreignKey' => 'parent_id'
            )
        );
    }

**获取关联记录的嵌套数组:**

如果表里有 ``parent_id`` 字段，可以调用 :ref:`model-find-threaded` 使用单个查询
来获取记录的嵌套数组，而不用设置任何关联。

.. _joining-tables:

连接表
------

在 SQL 中，你可以使用 JOIN 语句连接相关的表。这让你可以运行涉及多个表的复杂查询(
例如，按给定的几个标签(*tag*)搜索文章(*post*))。

在 CakePHP 中某些关联(belongsTo 和 hasOne)会自动进行连接(*join*)来读取数据，所以
可以执行基于相关模型的数据的查询来读取模型数据。

但是这不适用于 hasMany 和 hasAndBelongsToMany 关联。这就需要强制进行连接(*join*)。
只需要定义必要的连接(*join*)，就可以把表联合在一起，并获得期望的查询结果。

.. note::

    谨记，你需要将递归(*recursion*)设置为 -1，才能正常工作：
    $this->Channel->recursive = -1;

在表间强制进行连接(*join*)时，需要使用 Model::find() 的"现代"语法，在 $options 
数组中添加 'joins' 键。例如::

    $options['joins'] = array(
        array('table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            'conditions' => array(
                'Channel.id = Item.channel_id',
            )
        )
    );

    $Item->find('all', $options);

.. note::

    注意 'joins' 数组没有键。

在上面的例子中，名为 Item 的模型左连接(*left-join*)到 channels 表。可以用模型名
作为表的别名，以使读取的数据符合 CakePHP 的数据结构。

定义连接(*join*)所用的键如下:


-  **table**: 要连接的表。
-  **alias**: 表的别名。与表关联的模型名是最好的选择。
-  **type**: 连接(*join*)的类型： inner、left 或者 right。
-  **conditions**: 执行连接(*join*)的条件。

使用 joins 选项，可以添加基于关联模型字段的条件::

    $options['joins'] = array(
        array('table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            'conditions' => array(
                'Channel.id = Item.channel_id',
            )
        )
    );

    $options['conditions'] = array(
        'Channel.private' => 1
    );

    $privateItems = $Item->find('all', $options);

可以根据需要在 hasAndBelongsToMany 关联中运行若干个连接(*join*)：

假设有 Book hasAndBelongsToMany Tag (书籍有且属于多个标签)的关联。该关系使用 
books\_tags 表作为连接表，所以需要把 books 表连接(*join*)到 books\_tags 表，再把
它与 tags 表连接(*join*)::

    $options['joins'] = array(
        array('table' => 'books_tags',
            'alias' => 'BooksTag',
            'type' => 'inner',
            'conditions' => array(
                'Book.id = BooksTag.book_id'
            )
        ),
        array('table' => 'tags',
            'alias' => 'Tag',
            'type' => 'inner',
            'conditions' => array(
                'BooksTag.tag_id = Tag.id'
            )
        )
    );

    $options['conditions'] = array(
        'Tag.tag' => 'Novel'
    );

    $books = $Book->find('all', $options);

使用连接(*join*)让你可以以最大的灵活性来控制 CakePHP 如何处理关联并获取数据。不
过，在大多数情况下，你可以使用其它方式达到同样的目的，比如正确地定义关联，动态绑
定模型，以及使用 Containable 行为。使用连接(*join*)这种特性应当很小心，因为如果
和任何之前描述的关联模型的技术一起使用，在一些情况下，它可能会导致错误的 SQL 查
询语句。


.. meta::
    :title lang=zh: Associations: Linking Models Together
    :keywords lang=zh: relationship types,relational mapping,recipe database,relational database,this section covers,web applications,recipes,models,cakephp,storage
