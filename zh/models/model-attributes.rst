模型属性
########

模型属性让你可以改变默认的模型行为。

欲知完整的模型属性列表及描述请，请访问
`CakePHP API <http://api.cakephp.org/2.8/class-Model.html>`_。

useDbConfig
===========

``useDbConfig`` 属性为指定数据库连接的名称的字符串，用来绑定模型类和关联的数据库
表。可以设置为任意在数据库配置文件中定义的数据库连接。数据库配置文件位于
/app/Config/database.php。

``useDbConfig`` 属性的默认值是 'default'。

用法示例:

::

    class Example extends AppModel {
        public $useDbConfig = 'alternate';
    }

useTable
========

``useTable`` 属性指定数据库表的名称。默认情况下，模型会使用模型类名的小写复数形
式。可以设定为其他表，如果希望模型不使用数据库表，也可以设置为``false``。

用法示例::

    class Example extends AppModel {
        public $useTable = false; // 此模型不使用数据库表
    }

或者::

    class Example extends AppModel {
        public $useTable = 'exmp'; // 此模型使用数据库表 'exmp'
    }

tablePrefix
===========

模型使用的表的前缀。表的前缀最初设置在数据库连接文件 /app/Config/database.php 中。
默认不使用前缀。可以在模型中设置 ``tablePrefix`` 属性覆盖默认值。

用法示例::

    class Example extends AppModel {
        public $tablePrefix = 'alternate_'; // 将寻找表 'alternate_examples'
    }

.. _model-primaryKey:

primaryKey
==========

每个表通常会有一个主键，``id``。可以改变模型用作主键的字段名称。当设置 CakePHP
来使用在一个已经存在的数据库表时，这很常见。

用法示例::

    class Example extends AppModel {
        // example_id是数据库中的字段名
        public $primaryKey = 'example_id';
    }


.. _model-displayField:

displayField
============

``displayField`` 属性指定应当使用哪个数据库字段作为记录的标签。标签在脚手架和调
用 ``find('list')`` 函数时使用。默认情况下，模型会使用 ``name`` 或 ``title`` 。

例如，要使用 ``username`` 字段::

    class User extends AppModel {
        public $displayField = 'username';
    }

多个字段名不能结合成一个显示字段(*display field*)。比如，你不能指定
``array('first_name', 'last_name')`` 作为显示字段。但是，可以利用模型的
virtualField 属性生成一个虚拟字段。

recursive
=========

recursive 属性决定 CakePHP 用 ``find()`` 和 ``read()`` 方法读取关联数据时的深度。

设想应用程序中有组，组属于域(*domain*)，组中有很多用户，每个用户又有很多文章。可
以根据调用 $this->Group->find() 要返回的数据量来设置 $recursive 为不同的值：

* -1 CakePHP 只读取 Group 数据，没有 join。
* 0  CakePHP 读取 Group 数据，它的域(*domain*)
* 1  CakePHP 读取 Group 数据，它的域(*domain*)，及其关联的用户(*User*)
* 2  CakePHP 读取 Group 数据，它的域(*domain*)，关联的用户(*User*)，以及用户关联
  的文章

不要设置比所需要的更大的值。让 CakePHP 读取不会使用的数据会不必要地减慢应用程序。
也要注意默认的 recursive 默认级别是 1。

.. note::

    如果想把 $recursive 与 ``fields`` 功能结合，必须手动把包含必要外键字段的列加
    入到 ``fields`` 数组中。在上面的例子中，这意味着需要加入 ``domain_id``。

.. tip::

    建议的 recursive 级别应当为 -1。这可以防止读取不必要的、甚至不需要的关联数据。
    这最有可能发生在大部分 find() 方法调用中。只在需要时候提高该级别，要么使用
    Containable 行为 。

    可以把它添加到 AppModel 中来实现::

        public $recursive = -1;

order
=====

任何 find 操作的数据的默认排序。可能的值包括::

    $order = "field"
    $order = "Model.field";
    $order = "Model.field asc";
    $order = "Model.field ASC";
    $order = "Model.field DESC";
    $order = array("Model.field" => "asc", "Model.field2" => "DESC");

data
====

模型读取数据的容器。尽管模型类返回的数据通常作为调用 find() 方法的返回值，你也可
以在模型的回调(*callback*)中访问保存在 $data 中的信息。

\_schema
========

包含描述数据库表的字段的元数据。每个字段被描述为：

-  name
-  type

The types CakePHP supports are:

string
    Generally backed by CHAR or VARCHAR columns. In SQL Server, NCHAR and
    NVARCHAR types are used.
text
    Maps to TEXT, MONEY types.
uuid
    Maps to the UUID type if a database provides one, otherwise this will
    generate a CHAR(36) field.
integer
    Maps to the INTEGER, SMALLINT types provided by the database.
biginteger
    Maps to the BIGINT type provided by the database.
decimal
    Maps to the DECIMAL, NUMERIC types.
float
    Maps to the REAL, DOUBLE PRECISION types.
boolean
    Maps to BOOLEAN except in MySQL, where TINYINT(1) is used to represent
    booleans.
binary
    Maps to the BLOB or BYTEA type provided by the database.
date
    Maps to a timezone naive DATE column type.
datetime
    Maps to a timezone naive DATETIME column type. In PostgreSQL, and SQL
    Server this turns into a TIMESTAMP or TIMESTAMPTZ type.
timestamp
    Maps to the TIMESTAMP type.
time
    Maps to a TIME type in all databases.

-  null
-  default value
-  length

用法示例::

    protected $_schema = array(
        'first_name' => array(
            'type' => 'string',
            'length' => 30
        ),
        'last_name' => array(
            'type' => 'string',
            'length' => 30
        ),
        'email' => array(
            'type' => 'string',
            'length' => 30
        ),
        'message' => array('type' => 'text')
    );

validate
========

该属性保存的规则，让模型可以在保存数据前验证数据。以字段名为键保存的正则表达式让
模型可以尝试去匹配。

.. note::

    没必要在调用 save() 前调用 validate()，因为 save() 会在真的保存数据前自动验
    证数据。

欲知验证的更多信息，请参见本手册后面的  :doc:`/models/data-validation`。

virtualFields
=============

这个模型的虚字段数组。虚字段是具有别名的 SQL 表达式。加入该属性的虚字段会和模型
的其它字段一样读取，但不能保存。

MySQL 的用法示例::

    public $virtualFields = array(
        'name' => "CONCAT(User.first_name, ' ', User.last_name)"
    );

在之后的 find 操作，User 结果会包含一个 ``name`` 键，对应为拼接的结果。创建一个与数据库中已经存在的字段同名的虚字段是不明智的，这
会导致 SQL 错误。

欲知有关 ``virtualFields`` 属性、它的正确用法、以及限制，请参见
:doc:`/models/virtual-fields`。

name
====

模型的名称。如果不在模型文件中指定，这会被构造函数设为类名。

用法示例::

    class Example extends AppModel {
        public $name = 'Example';
    }

cacheQueries
============

若设为 true，单个请求中模型读取的数据会被缓存。该缓存仅保存在内存中，且仅保持(当
前)请求所持续的时间段。任何对相同数据的重复请求会由该缓存处理。


.. meta::
    :title lang=zh: Model Attributes
    :keywords lang=zh: alternate table,default model,database configuration,model example,database table,default database,model class,model behavior,class model,plural form,database connections,database connection,attribute,attributes,complete list,config,cakephp,api,class example
