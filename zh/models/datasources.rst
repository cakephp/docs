数据源
######

数据源是模型和模型所代表的数据来源之间的联系。在很多情况下，数据是从关系型数据库
中取得，比如 MySQL、PostgreSQL 或者 Microsoft SQL Server。CakePHP 的发布就带有若干针对数据库的
数据源(请参看 ``lib/Cake/Model/Datasource/Database`` 中的类文件)，为了便利，摘录
如下：


- Mysql
- Postgres
- Sqlite
- Sqlserver

.. note::

    你可以在 `GitHub 上的 CakePHP 数据源代码库 <https://github.com/cakephp/datasources/tree/2.0>`_
    中找到更多社区贡献的数据源。

当在 ``app/Config/database.php`` 中指定数据库连接配置时，CakePHP 会以透明地使用
相应的数据库数据源，用于所有的模型操作。所以，即使你并不知道数据源，你也已经一直
在使用它们了。

所有上述数据源继承于一个基类 ``DboSource``，它汇集了大多数关系型数据库通用的一些
逻辑。如果你决定编写一个 RDBMS 数据源，你最好从这些中的一个(例如 MySQL 或者
SQLite)开始。

当然，大多数人还是感兴趣于为外部数据来源编写数据源，比如远程 REST API，或者甚至
是 LDAP 服务器。所以，这就是我们下面要介绍的。

数据源的基本 API
================

数据源能够，而且 *应当* 实现至少下面中的一个方法：``create``、``read``、
``update`` 和/或 ``delete`` (方法的真正签名和实现细节在这里不重要，之后会述及)。
你不必实现上述方法中不必要的部分 — 如果你需要只读的数据源，就没有理由实现 
``create``、``update`` 和 ``delete``。

对所有 CRUD 方法都要实现的方法：

-  ``describe($model)``
-  ``listSources($data = null)``
-  ``calculate($model, $func, $params)``
-  至少下列之一：

   -  ``create(Model $model, $fields = null, $values = null)``
   -  ``read(Model $model, $queryData = array(), $recursive = null)``
   -  ``update(Model $model, $fields = null, $values = null, $conditions = null)``
   -  ``delete(Model $model, $id = null)``

也有可能(有时还挺有用)在数据源里定义 ``$_schema`` 类属性，而不是在模型中。

差不多就这些。把这个数据源和一个模型联系起来，你就可以象你通常那样使用 
``Model::find()/save()/delete()``，而调用这些方法的适当的数据以及/或者参数就会被
传递给数据源，在那里你可以决定要实现任何你需要的特性(例如 Model::find 选项，比如
对 ``'conditions'`` 的解析， ``'limit'`` 或者甚至你自己的定制参数)。

一个例子
========

你想要编写自己的数据源的一个常见原因是当你要使用通常的 
``Model::find()/save()/delete()`` 方法来访问第三方 API。让我们来编写一个数据源，
来访问一个假想的基于 JSON 的 远程 API。我们会把它叫做 ``FarAwaySource``，并把它
放在 ``app/Model/Datasource/FarAwaySource.php`` 里::

    App::uses('HttpSocket', 'Network/Http');

    class FarAwaySource extends DataSource {

    /**
     * 数据源的描述，可省略
     */
        public $description = 'A far away datasource';

    /**
     * 缺省配置选项。这些选项会在 ``app/Config/database.php`` 中定制化，并且会在
     * ``__construct()`` 中合并。
     */
        public $config = array(
            'apiKey' => '',
        );

    /**
     * 如果我们要 create() 或 update()，我们需要指定可用的字段。我们使用与在
     * CakeSchema 中一样的数组键，例如 fixtures 和 schema 升级。
     */
        protected $_schema = array(
            'id' => array(
                'type' => 'integer',
                'null' => false,
                'key' => 'primary',
                'length' => 11,
            ),
            'name' => array(
                'type' => 'string',
                'null' => true,
                'length' => 255,
            ),
            'message' => array(
                'type' => 'text',
                'null' => true,
            ),
        );

    /**
     * 创建 HttpSocket，处理任何配置调整。
     */
        public function __construct($config) {
            parent::__construct($config);
            $this->Http = new HttpSocket();
        }

    /**
     * 因为数据源通常连接到数据库，我们必须改变一些东西，才能使它适合没有数据库
     * 的情况。
     */

    /**
     * listSources() 用于缓存。在定制数据源中你可能会要用自己的方式实现缓存。
     * 所以只要 ``return null`` 就行了。
     */
        public function listSources($data = null) {
            return null;
        }

    /**
     * describe() 告诉模型你的 ``Model::save()`` 使用的 schema。
     *
     * 也许对你的每个模型都需要一个不同的 schema，但仍然使用一个数据源。如果是这
     * 样，那么在模型中设置一个 ``schema`` 属性，而从这里只返回
     * ``$model->schema``。
     */
        public function describe($model) {
            return $this->_schema;
        }

    /**
     * calculate() 用来决定如何对记录进行计数，要让 ``update()`` 和 ``delete()``
     * 正常工作这是必须的。
     *
     * 在这里我们不计数，而是返回一个字符串传给 ``read()``，让它(指 ``read()``)
     * 去做真正的计数。最容易的方法是只需返回字符串 'COUNT'，然后在 ``read()``
     * 里面检查 ``$data['fields'] === 'COUNT'``。
     */
        public function calculate(Model $model, $func, $params = array()) {
            return 'COUNT';
        }

    /**
     * 实现 CRUD 中的 R。调用 ``Model::find()`` 时，会到达这里。
     */
        public function read(Model $model, $queryData = array(),
            $recursive = null) {
            /**
             * 这里我们按照上面 calculate() 方法的指示进行真正的计数。我们可以检
             * 查远程数据源，也可以用其它方法，来获得记录数。这里我们只是返回 1，
             * 这样 ``update()`` 和 ``delete()`` 就会认为记录存在。
             */
            if ($queryData['fields'] === 'COUNT') {
                return array(array(array('count' => 1)));
            }
            /**
             * 现在我们来获得远程数据，再将其解码并返回。
             */
            $queryData['conditions']['apiKey'] = $this->config['apiKey'];
            $json = $this->Http->get(
                'http://example.com/api/list.json',
                $queryData['conditions']
            );
            $res = json_decode($json, true);
            if (is_null($res)) {
                $error = json_last_error();
                throw new CakeException($error);
            }
            return array($model->alias => $res);
        }

    /**
     * 实现 CRUD 中的 C。调用 ``Model::save()`` 时不设置 $model->id，会到达这里。
     */
        public function create(Model $model, $fields = null, $values = null) {
            $data = array_combine($fields, $values);
            $data['apiKey'] = $this->config['apiKey'];
            $json = $this->Http->post('http://example.com/api/set.json', $data);
            $res = json_decode($json, true);
            if (is_null($res)) {
                $error = json_last_error();
                throw new CakeException($error);
            }
            return true;
        }

    /**
     * 实现 CRUD 中的 U。调用 ``Model::save()`` 时设置了 $model->id，会到达这里。
     * 取决于远程数据源，你也许只需调用 ``$this->create()``。
     */
        public function update(Model $model, $fields = null, $values = null,
            $conditions = null) {
            return $this->create($model, $fields, $values);
        }

    /**
     * 实现 CRUD 中的 D。调用 ``Model::delete()`` 时，会到达这里。
     */
        public function delete(Model $model, $id = null) {
            $json = $this->Http->get('http://example.com/api/remove.json', array(
                'id' => $id[$model->alias . '.id'],
                'apiKey' => $this->config['apiKey'],
            ));
            $res = json_decode($json, true);
            if (is_null($res)) {
                $error = json_last_error();
                throw new CakeException($error);
            }
            return true;
        }

    }

接下去，我们就可以在 ``app/Config/database.php`` 文件中添加下面的代码来配置数据
源::

    public $faraway = array(
        'datasource' => 'FarAwaySource',
        'apiKey'     => '1234abcd',
    );

然后象这样在模型中使用数据库配置::

    class MyModel extends AppModel {
        public $useDbConfig = 'faraway';
    }

我们可以用熟悉的模型方法从远程数据源获取数据::

    // 从'某人(Some Person)'获得全部消息
    $messages = $this->MyModel->find('all', array(
        'conditions' => array('name' => 'Some Person'),
    ));

.. tip::

    如果 ``read`` 方法的结果不是一个数字下标的数组，使用除 ``'all'`` 以外的其它 
    find 类型会导致意想不到的结果。

同样我们可以保存一条新消息::

    $this->MyModel->save(array(
        'name' => 'Some Person',
        'message' => 'New Message',
    ));

更新上一条消息::

    $this->MyModel->id = 42;
    $this->MyModel->save(array(
        'message' => 'Updated message',
    ));

以及删除消息::

    $this->MyModel->delete(42);

插件的数据源
============

你也可以把数据源封装在插件之中。

你只需把你的数据源文件放在 
``Plugin/[YourPlugin]/Model/Datasource/[YourSource].php``，然后用插件的语法引用
它::

    public $faraway = array(
        'datasource' => 'MyPlugin.FarAwaySource',
        'apiKey'     => 'abcd1234',
    );

连接 SQL Server
===============

Sqlserver 数据源依赖于微软的名为 pdo_sqlsrv 的 PHP 扩展。该扩展未包含在 PHP 的基
本安装中，必须单独安装。

而且必须安装 SQL Server Native Client，该扩展才能工作。由于 Native Client 只适用
于 Windows，你无法在 Linux、Mac OS X 或者 FreeBSD 上安装。

所以，如果 Sqlserver 数据源报如下错误::

    Error: Database connection "Sqlserver" is missing, or could not be created.

请首先检查是否正确安装了 SQL Server PHP 扩展 pdo_sqlsrv 和 SQL Server Native
Client。

.. meta::
    :title lang=zh: DataSources
    :keywords lang=zh: array values,model fields,connection configuration,implementation details,relational databases,best bet,mysql postgresql,sqlite,external sources,ldap server,database connection,rdbms,sqlserver,postgres,relational database,microsoft sql server,aggregates,apis,repository,signatures

