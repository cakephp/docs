测试
####

CakePHP 内置带有全面的测试支持。CakePHP 自带有与 `PHPUnit <http://phpunit.de>`_
的集成。除了 PHPUnit 提供的特性，CakePHP 提供了一些额外的功能，使得测试更为容易。
本节将介绍 PHPUnit 的安装，开始进行单元测试，以及如何使用 CakePHP 提供的扩展。

安装 PHPUnit
============

CakePHP 使用 PHPUnit 作为其底层测试框架。PHPUnit 是 PHP 单元测试事实上的标准。
它提供了一套深刻而强大的功能，确保你的代码做了你认为它所要做的事情。

通过 Composer 安装
------------------

较新版本的 PHPUnit 当前不能与 CakePHP 集成::

    "phpunit/phpunit": "3.7.32"

通过 .phar 包来安装
-------------------

你也可以直接下载文件。只是要注意从 https://phar.phpunit.de/ 得到了正确的版本。
确保 /usr/local/bin 位于 php.ini 文件的 include_path 中::

    wget https://phar.phpunit.de/phpunit-3.7.38.phar -O phpunit.phar
    chmod +x phpunit.phar
    mv phpunit.phar /usr/local/bin/phpunit

.. note::

    PHPUnit 4 与 CakePHP 的单元测试不兼容。

    根据你系统的配置，你可能需要用 ``sudo`` 运行上面的命令。

.. note::
    在 CakePHP 2.5.7 及其后版本，可以把 phar 文件直接放在 vendors 或者
    App/Vendor 目录。

.. tip::

    当使用 PHPUnit 3.6+ 时，所有的输出都会被吞没。如果使用 CLI，可以添加
    ``--debug`` 修饰符；如果使用 web 运行器来显示输出，可以添加 ``&debug=1``
    到网址中。

测试数据库的设置
================

记得在运行任何测试之前，在 ``app/Config/core.php`` 文件中的调试(debug)级别至少是
1。当调试级别是 0 时，无法通过 web 运行器访问测试。在运行任何测试之前，应当确保
添加 ``$test`` 数据库配置。该配置被 CakePHP 用于测试夹具(*fixture*)的表和数据::

    public $test = array(
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host'       => 'dbhost',
        'login'      => 'dblogin',
        'password'   => 'dbpassword',
        'database'   => 'test_database'
    );

.. note::

    把测试数据库和实际的数据库分成不同的数据库比较好。这可以避免将来任何令人尴尬
    的错误。

检查测试数据库的设置
====================

安装完了 PHPUnit，设置好了 ``$test`` 数据库配置，可以运行核心测试中的一个，来
确保你可以编写和运行你自己的测试。测试有两个内置的运行器，我们从 web 运行器开始。
浏览 http://localhost/your_app/test.php 就可以访问测试，应当能看到核心测试列表了。
点击 'AllConfigure' 测试。你应当看到一个绿色的(进度)条，和运行的测试的更多信息，
以及通过的测试数量。

恭喜，你现在可以开始编写测试了！

测试用例约定
============

象 CakePHP 中的大部分东西，测试用例也有一些约定。涉及测试的：

#. 包含测试的 PHP 文件应当位于 ``app/Test/Case/[Type]`` 目录。
#. 这些文件的文件名应当以 ``Test.php`` 结尾，而不能仅仅是.php。
#. 含有测试的类应当扩展 ``CakeTestCase``，``ControllerTestCase`` 或
   ``PHPUnit_Framework_TestCase``。
#. 象其它类名，测试用例类名应当与文件名匹配。文件 ``RouterTest.php`` 应当包含
   ``class RouterTest extends CakeTestCase``。
#. 包含测试(即包含断言(*assertion*))的任何方法的名称应当以 ``test`` 开头，例如
   ``testPublished()``。也可以使用 ``@test`` 标注(*annotation*)来标记方法为测试
   方法。

在创建了测试用例之后，可以浏览 ``http://localhost/your_app/test.php`` (取决于你
的配置是怎样的)来运行。点击 App test cases，再点击测试文件的链接。也可以从命令行
使用测试外壳(*shell*)来运行测试::

    ./Console/cake test app Model/Post

例如，就会运行 Post 模型的测试。

创建你的第一个测试用例
======================

在下面的例子中，我们会为一个很简单的助件(*helper*)方法创建一个测试用例。我们要
测试的助件会生成进度条 HTML。助件是这样的::

    class ProgressHelper extends AppHelper {
        public function bar($value) {
            $width = round($value / 100, 2) * 100;
            return sprintf(
                '<div class="progress-container">
                    <div class="progress-bar" style="width: %s%%"></div>
                </div>', $width);
        }
    }

这是个很简单的例子，不过可以展示如何创建简单的测试用例。创建并保存助件后，我们来
创建测试用例文件 ``app/Test/Case/View/Helper/ProgressHelperTest.php``。在该文件
中我们以如下代码开始::

    App::uses('Controller', 'Controller');
    App::uses('View', 'View');
    App::uses('ProgressHelper', 'View/Helper');

    class ProgressHelperTest extends CakeTestCase {
        public function setUp() {

        }

        public function testBar() {

        }
    }

我们很快就会填充这个骨架。我们一开始就添加了两个方法。第一个是 ``setUp()``。这个
方法会在测试用例类中的每个 *测试* 方法被调用之前调用。setUp 方法应当初始化测试
需要的对象，做任何需要的配置。在我们的 setUp 方法中，我们添加如下代码::

    public function setUp() {
        parent::setUp();
        $Controller = new Controller();
        $View = new View($Controller);
        $this->Progress = new ProgressHelper($View);
    }

在测试用例中调用父类方法很重要，因为 CakeTestCase::setUp() 方法会做一些事情，
比如备份 :php:class:`Configure` 类中的值，以及保存 :php:class:`App` 类中的路径。

接下来，我们要填写测试方法。我们会使用一些断言(*assertion*)来确保我们的代码生成
了我们希望的输出::

    public function testBar() {
        $result = $this->Progress->bar(90);
        $this->assertContains('width: 90%', $result);
        $this->assertContains('progress-bar', $result);

        $result = $this->Progress->bar(33.3333333);
        $this->assertContains('width: 33%', $result);
    }

上述测试很简单，但说明了使用测试用例的潜在好处。我们用 ``assertContains()`` 来
确保助件返回的字符串包含我们期望的内容。如果结果不包含期望的内容，测试就会失败，
我们就知道我们的代码不对了。

使用测试用例，就能容易地描述一组已知输入和它们期望的输出之间的关系。这可以帮助你
对正在编写的代码更有信心，因为你可以容易地检查你写的代码满足测试所做的期望和断言。
而且，因为测试是代码，无论何时你做了一处改动，它们都很容易再次运行。这可以帮助
防止新错误(*bug*)的出现。

.. _running-tests:

运行测试
========

一旦安装了 PHPUnit，写了一些测试用例，你就应当很频繁地运行测试用例。在提交任何
改动之前运行测试比较好，可以帮助确保你没有破坏任何东西。

从浏览器运行测试
----------------

CakePHP 提供了 web 界面来运行测试，这样，如果你觉得这样的环境更舒服，可以通过
浏览器运行测试。你可以通过浏览 ``http://localhost/your_app/test.php`` 来访问 web
运行器。test.php 的确切位置根据你的设置而变化，不过该文件和 ``index.php`` 在
同一级。

一旦加载了测试运行器，就可以在 App、Core 和 Plugin 测试套件之间切换。点击单个
测试用例就会运行该测试，并显示结果。

查看代码覆盖
~~~~~~~~~~~~

如果你安装了 `Xdebug <http://xdebug.org>`_，就可以查看代码覆盖的结果。代码覆盖
可以告诉你，你的测试没有触及代码的哪部分。覆盖率用于决定今后在哪里还应当添加测试，
并给你一个度量来监测你测试的进展。

.. |Code Coverage| image:: /_static/img/code-coverage.png

|Code Coverage|

内嵌的代码覆盖使用绿色行来表示运行过的行。如果把鼠标悬停在一个绿色的行上，会有
提示说明哪些测试覆盖了该行。红色的行没有运行，即没有被测试检验。灰色的行被
Xdebug 认为是无法运行的代码。

.. _run-tests-from-command-line:

从命令行运行测试
----------------

CakePHP 提供 ``test`` 外壳(*shell*)来运行测试。你可以用 test 外壳容易地运行 app、
core 和插件的测试。它也接受通常 PHPUnit 命令行期望的的所有参数。从 app 目录，
可以象下面这样来运行测试::

    # 运行 app 中的模型测试
    ./Console/cake test app Model/Article

    # 运行插件中的组件测试
    ./Console/cake test DebugKit Controller/Component/ToolbarComponent

    # 运行 CakePHP 中的 configure 类测试
    ./Console/cake test core Core/Configure

.. note::

    如果你运行与会话(*session*)交互的测试，通常最好使用 ``--stderr`` 选项。这
    可以修正由于 headers_sent 警告引起的测试失败的问题。

.. versionchanged:: 2.1
    在 2.1 版本中增加了 ``test`` 外壳。2.0 版本的 ``testsuite`` 外壳仍然可以使用，
    但建议使用新语法。

也可以在项目根目录下运行 ``test`` 外壳。这会显示你现有全部测试的列表。然后你可以
随意地选择要运行的一个或多个测试::

    # 在项目根目录中运行叫做 app 的应用程序目录的测试
    lib/Cake/Console/cake test app

    # 在项目根目录中运行位于 ./myapp 目录中的应用程序的测试
    lib/Cake/Console/cake test --app myapp app

过滤测试用例
~~~~~~~~~~~~

在有大量测试用例的情况下，当你试图修复单个失败的用例时，会经常要运行测试方法的
一个子集。使用 CLI 运行器，你可以使用一个选项来过滤测试方法::

    ./Console/cake test core Console/ConsoleOutput --filter testWriteArray

过滤参数作为大小写敏感的正则表达式，来过滤要运行的测试方法。

生成代码覆盖率
~~~~~~~~~~~~~~

你可以从命令行使用 PHPUnit 内置的代码覆盖工具来生成代码覆盖报告。PHPUnit 会生成
一组包含覆盖结果的静态 HTML 文件。你可以像下面这样来生成一个测试用例的覆盖报告::

    ./Console/cake test app Model/Article --coverage-html webroot/coverage

这会把覆盖结果放在应用程序的 webroot 目录中。你应当能够在
``http://localhost/your_app/coverage`` 看到结果。

运行使用会话的测试
~~~~~~~~~~~~~~~~~~

在命令行运行使用会话的测试时，需要加上 ``--stderr`` 标志。不这么做会导致会话无法
工作。PHPUnit 默认会输出测试进程到标准输出(*stdout*)，这会使 PHP 以为头部信息
已经发送，从而阻止会话启动。把 PHPUnit 输出切换到 stderr，就避免了这个问题。


测试用例生命周期回调
====================

测试用例有一些生命周期回调函数，可以在测试时使用：

* ``setUp`` 在每个测试方法之前调用。应当用来创建要测试的对象，为测试初始化任何
  数据。记得一定要调用 ``parent::setUp()``。
* ``tearDown`` 在每个测试方法之后调用。应当用来在测试完成之后进行清理。记得一定
  要调用  ``parent::tearDown()``。
* ``setupBeforeClass`` 在一个用例中的测试方法开始之前只调用一次。该方法必须是
  *静态的*。
* ``tearDownAfterClass`` 在一个用例中的测试方法完成之后只调用一次。该方法必须是
  *静态的*。

测试夹具
========

当测试代码依赖于模型和数据库时，可以使用 **测试夹具(fixture)** 来生成临时数据库
表，加载样例数据，用于测试。使用测试夹具的好处是，你的测试不会破坏在线的应用程序
数据。而且，在真的为应用程序开发实际内容之前，你就可以测试你的代码。

CakePHP 使用 ``app/Config/database.php`` 配置文件中的名为 ``$test`` 的(数据库)
连接。如果该连接无法使用，将引发一个异常，就无法使用数据库夹具了。

在一个基于夹具的测试用例的运行过程中，CakePHP 执行下面的操作：

#. 创建每个夹具需要的表。
#. 如果夹具中提供了数据，用数据填充表。
#. 运行测试方法。
#. 清空夹具的表。
#. 从数据库删除夹具的表。

创建夹具
--------

在创建夹具时，主要定义两件事情：如何创建表(表里有哪些字段)，哪些记录要首先填充到
表中。让我们来创建第一个夹具，用于测试 Article 模型。在 ``app/Test/Fixture``
目录中创建以下内容的文件 ``ArticleFixture.php``::

    class ArticleFixture extends CakeTestFixture {

          // 可选。
          // 设置该属性来加载夹具到不同的测试数据源
          public $useDbConfig = 'test';
          public $fields = array(
              'id' => array('type' => 'integer', 'key' => 'primary'),
              'title' => array(
                'type' => 'string',
                'length' => 255,
                'null' => false
              ),
              'body' => 'text',
              'published' => array(
                'type' => 'integer',
                'default' => '0',
                'null' => false
              ),
              'created' => 'datetime',
              'updated' => 'datetime'
          );
          public $records = array(
              array(
                'id' => 1,
                'title' => 'First Article',
                'body' => 'First Article Body',
                'published' => '1',
                'created' => '2007-03-18 10:39:23',
                'updated' => '2007-03-18 10:41:31'
              ),
              array(
                'id' => 2,
                'title' => 'Second Article',
                'body' => 'Second Article Body',
                'published' => '1',
                'created' => '2007-03-18 10:41:23',
                'updated' => '2007-03-18 10:43:31'
              ),
              array(
                'id' => 3,
                'title' => 'Third Article',
                'body' => 'Third Article Body',
                'published' => '1',
                'created' => '2007-03-18 10:43:23',
                'updated' => '2007-03-18 10:45:31'
              )
          );
     }

``$useDbConfig`` 属性定义夹具要使用的数据源。如果应用程序使用多个数据源，你应当
使夹具匹配模型的数据源，但是要加上 ``test_`` 前缀。例如，如果模型使用 ``mydb``
数据源，夹具就应当使用 ``test_mydb`` 数据源。如果 ``test_mydb`` 连接不存在，模型
就会使用默认的 ``test`` 数据源。夹具数据源必须前缀以 ``test`` 来降低运行测试时
意外清除应用程序的所有数据的可能性。

我们使用 ``$fields`` 来指定这个表有哪些字段，以及它们是如何定义的。用来定义这些
字段的格式和 :php:class:`CakeSchema` 类使用的相同。定义表可以使用的键为：

``type``
    CakePHP 内部的数据类型。当前支持：
        - ``string``: 映射为 ``VARCHAR``
        - ``text``: 映射为 ``TEXT``
        - ``biginteger``: 映射为 ``BIGINT``
        - ``integer``: 映射为 ``INT``
        - ``float``: 映射为 ``FLOAT``
        - ``decimal``: 映射为 ``DECIMAL``
        - ``datetime``: 映射为 ``DATETIME``
        - ``timestamp``: 映射为 ``TIMESTAMP``
        - ``time``: 映射为 ``TIME``
        - ``date``: 映射为 ``DATE``
        - ``binary``: 映射为 ``BLOB``
        - ``boolean``: 映射为 ``TINYINT``
``key``
    设置为 ``primary`` 来使该字段 AUTO\_INCREMENT，并作为表的主键。
``length``
    设置为字段需要的长度。
``null``
    设置为 ``true`` (允许 NULL) 或者 ``false`` (不允许 NULL)。
``default``
    字段的默认值。

我们可以定义一组记录，在夹具的表创建之后填充到表里。其格式是相当简单的，
``$records`` 为记录数组。``$records`` 中的每项为一行。在每行中，应当是该行的列和
值的关联数组。只是要记住 $records 数组中的每条记须有 ``$fields`` 数组中指定的
**每个** 字段都必须有一个键。如果某条记录的一个字段需要有 ``null`` 值，只需指定
该键的值为 ``null``。

动态数据和夹具
--------------

既然夹具的记录声明为类属性，就无法轻易使用函数或者其它动态数据来定义夹具。为了
解决这个问题，可以在夹具的 init() 方法中定义 ``$records``。例如，如果要所有
created 和 updated 时间标签反应今天的日期，可以这样做::

    class ArticleFixture extends CakeTestFixture {

        public $fields = array(
            'id' => array('type' => 'integer', 'key' => 'primary'),
            'title' => array('type' => 'string', 'length' => 255, 'null' => false),
            'body' => 'text',
            'published' => array('type' => 'integer', 'default' => '0', 'null' => false),
            'created' => 'datetime',
            'updated' => 'datetime'
        );

        public function init() {
            $this->records = array(
                array(
                    'id' => 1,
                    'title' => 'First Article',
                    'body' => 'First Article Body',
                    'published' => '1',
                    'created' => date('Y-m-d H:i:s'),
                    'updated' => date('Y-m-d H:i:s'),
                ),
            );
            parent::init();
        }
    }

当重载 ``init()`` 方法时，只需记得一定要调用 ``parent::init()``。

.. note::

    请记得在 2.x 版本中，夹具不会处理外键约束。

导入表信息和记录
----------------

应用程序可能已经有正常工作的模型及相关的真实数据，而你可能会决定要使用这些数据来
测试应用程序。这样再在夹具中定义表和/或记录就是重复的事情了。幸好，有办法从现有
的模型或表来定义(夹具的)表和/或记录。

让我们从一个例子开始。假定在应用程序中有一个叫做 Article 的模型(映射到名为
articles 的表)，修改前一节的夹具例子(``app/Test/Fixture/ArticleFixture.php``)为::

    class ArticleFixture extends CakeTestFixture {
        public $import = 'Article';
    }

这句话告诉测试套件从叫做 Article 的模型连接的表导入表的定义。你可以使用应用程序
中的任何可以使用的模型。这条语句只导入 Article 的数据结构(*schema*)，而不导入
记录。要导入记录，你可以这样做::

    class ArticleFixture extends CakeTestFixture {
        public $import = array('model' => 'Article', 'records' => true);
    }

另一方面，如果有一个创建好的表，而没有相应的模型，可以指定导入过程读取那个表的
信息。例如::

    class ArticleFixture extends CakeTestFixture {
        public $import = array('table' => 'articles');
    }

会使用名为 'default' 的 CakePHP 数据库连接从叫做 'articles' 的表导入表的定义。
如果要使用不同的连接，可以使用::

    class ArticleFixture extends CakeTestFixture {
        public $import = array('table' => 'articles', 'connection' => 'other');
    }

因为它使用 CakePHP 的数据库连接，如果声明了任何表前缀，读取表的信息时就会自动
使用该前缀。上述两段代码片段不会从表导入记录。要让夹具也导入记录，把导入改为::

    class ArticleFixture extends CakeTestFixture {
        public $import = array('table' => 'articles', 'records' => true);
    }

也可以很自然地从现有的模型/表导入表的定义，但是象前一节所示的那样直接在夹具中
定义记录。例如::

    class ArticleFixture extends CakeTestFixture {
        public $import = 'Article';
        public $records = array(
            array(
              'id' => 1,
              'title' => 'First Article',
              'body' => 'First Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:39:23',
              'updated' => '2007-03-18 10:41:31'
            ),
            array(
              'id' => 2,
              'title' => 'Second Article',
              'body' => 'Second Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:41:23',
              'updated' => '2007-03-18 10:43:31'
            ),
            array(
              'id' => 3,
              'title' => 'Third Article',
              'body' => 'Third Article Body',
              'published' => '1',
              'created' => '2007-03-18 10:43:23',
              'updated' => '2007-03-18 10:45:31'
            )
        );
    }

在测试用例中加载夹具
--------------------

夹具创建好之后，就要在测试用例中使用。在每个测试用例中应当加载需要的夹具。对每个
要运行查询语句的模型都应当加载夹具。要加载夹具，在模型中定义 ``$fixtures`` 属性::

    class ArticleTest extends CakeTestCase {
        public $fixtures = array('app.article', 'app.comment');
    }

上述代码会从应用程序的 Fixture 目录加载 Article 和 Comment 夹具。也可以从
CakePHP 核心或插件中加载夹具::

    class ArticleTest extends CakeTestCase {
        public $fixtures = array('plugin.debug_kit.article', 'core.comment');
    }

使用 ``core`` 前缀会从 CakePHP 加载夹具，使用插件名称作为前缀会从该命名的插件中
加载夹具。

你可以设置 :php:attr:`CakeTestCase::$autoFixtures` 为 ``false`` 来控制何时加载
夹具，之后再用 :php:meth:`CakeTestCase::loadFixtures()` 来加载::

    class ArticleTest extends CakeTestCase {
        public $fixtures = array('app.article', 'app.comment');
        public $autoFixtures = false;

        public function testMyFunction() {
            $this->loadFixtures('Article', 'Comment');
        }
    }

从 2.5.0 版本开始，可以加载在子目录中的夹具。如果你有一个大型的应用程序，使用
多个目录可以更容易地组织夹具。要加载子目录中的夹具，只需在夹具名称中包括子目录
名称::

    class ArticleTest extends CakeTestCase {
        public $fixtures = array('app.blog/article', 'app.blog/comment');
    }

在上述例子中，两个夹具都会从 ``App/Test/Fixture/blog/`` 目录中加载。

.. versionchanged:: 2.5
    从 2.5.0 版本开始，可以加载在子目录中的夹具。

测试模型
========

比如说我们已经有了在文件 ``app/Model/Article.php`` 中定义的 Article 模型，是这样
的::

    class Article extends AppModel {
        public function published($fields = null) {
            $params = array(
                'conditions' => array(
                    $this->name . '.published' => 1
                ),
                'fields' => $fields
            );

            return $this->find('all', $params);
        }
    }

现在要建立使用这个模型的测试，但是要通过夹具，来测试模型中的一些功能。CakePHP
测试套件只加载最少的一组文件(来保持测试独立)，这样我们必须由加载模型开始 — 在
这里就是我们已经定义了的 Article 模型。

现在在目录 ``app/Test/Case/Model`` 中来创建文件 ``ArticleTest.php``，包含如下
内容::

    App::uses('Article', 'Model');

    class ArticleTest extends CakeTestCase {
        public $fixtures = array('app.article');
    }

在测试用例的变量 ``$fixtures`` 中定义一组要使用的夹具。应当记得包含所有要运行
查询的夹具。

.. note::
    你可以通过指定 ``$useDbConfig`` 属性来覆盖测试模型数据库。确保相关的夹具使用
    相同的值，这样才会在正确的数据库中创建表。

创建测试方法
------------

现在让我们添加一个方法来测试 Article 模型中的函数 published()。编辑文件
``app/Test/Case/Model/ArticleTest.php``，让它象这样::

    App::uses('Article', 'Model');

    class ArticleTest extends CakeTestCase {
        public $fixtures = array('app.article');

        public function setUp() {
            parent::setUp();
            $this->Article = ClassRegistry::init('Article');
        }

        public function testPublished() {
            $result = $this->Article->published(array('id', 'title'));
            $expected = array(
                array('Article' => array('id' => 1, 'title' => 'First Article')),
                array('Article' => array('id' => 2, 'title' => 'Second Article')),
                array('Article' => array('id' => 3, 'title' => 'Third Article'))
            );

            $this->assertEquals($expected, $result);
        }
    }

你可以看到我们添加了方法 ``testPublished()``。我们开始先创建一个 ``Article``
模型的实例，然后运行 ``published()`` 方法。在变量 ``$expected`` 中设置我们期望的
正确结果(我们知道是因为我们定义了开始要填充到文章(*artilce*)表中的记录。)我们
使用 ``assertEquals`` 方法测试结果等于我们的期望。欲知如何运行测试用例，请参考
:ref:`running-tests` 一节。

.. note::

    在为测试设置模型时，一定要使用 ``ClassRegistry::init('YourModelName');``，
    因为它知道要使用测试数据库连接。

模拟模型方法
------------

有时在测试模型的方法时你要模拟这些方法。你应当使用 ``getMockForModel`` 方法来
创建模型的测试模拟。这避免了通常模拟对象有的反射属性的问题::

    public function testSendingEmails() {
        $model = $this->getMockForModel('EmailVerification', array('send'));
        $model->expects($this->once())
            ->method('send')
            ->will($this->returnValue(true));

        $model->verifyEmail('test@example.com');
    }

.. versionadded:: 2.3
    在 2.3 版本中增加了 CakeTestCase::getMockForModel()。

测试控制器
==========

虽然你可以用和助件(*Helper*)、模型(*Model*)和组件(*Component*)相同的方式测试
控制器类，CakePHP 提供了特别的 ``ControllerTestCase`` 类。用该类作为控制器测试
用例的基类，让你可以使用 ``testAction()`` 方法，使测试用例更简单。
``ControllerTestCase`` 让你容易地模拟组件和模型，以及象
:php:meth:`~Controller::redirect()` 这样可能更难测试的方法。

假设你有一个典型的 Articles 控制器和相应的模型。控制器代码是这样的::

    App::uses('AppController', 'Controller');

    class ArticlesController extends AppController {
        public $helpers = array('Form', 'Html');

        public function index($short = null) {
            if (!empty($this->request->data)) {
                $this->Article->save($this->request->data);
            }
            if (!empty($short)) {
                $result = $this->Article->find('all', array('id', 'title'));
            } else {
                $result = $this->Article->find('all');
            }

            if (isset($this->params['requested'])) {
                return $result;
            }

            $this->set('title', 'Articles');
            $this->set('articles', $result);
        }
    }

在 ``app/Test/Case/Controller`` 目录中创建一个名为
``ArticlesControllerTest.php`` 的文件，放入以下代码::

    class ArticlesControllerTest extends ControllerTestCase {
        public $fixtures = array('app.article');

        public function testIndex() {
            $result = $this->testAction('/articles/index');
            debug($result);
        }

        public function testIndexShort() {
            $result = $this->testAction('/articles/index/short');
            debug($result);
        }

        public function testIndexShortGetRenderedHtml() {
            $result = $this->testAction(
               '/articles/index/short',
                array('return' => 'contents')
            );
            debug($result);
        }

        public function testIndexShortGetViewVars() {
            $result = $this->testAction(
                '/articles/index/short',
                array('return' => 'vars')
            );
            debug($result);
        }

        public function testIndexPostData() {
            $data = array(
                'Article' => array(
                    'user_id' => 1,
                    'published' => 1,
                    'slug' => 'new-article',
                    'title' => 'New Article',
                    'body' => 'New Body'
                )
            );
            $result = $this->testAction(
                '/articles/index',
                array('data' => $data, 'method' => 'post')
            );
            debug($result);
        }
    }

这个例子展示了一些使用 testAction 方法测试控制器的方式。``testAction`` 方法的
第一个参数应当总是要测试的网址(*URL*)。CakePHP 会创建一个请求，调度(*dispatch*)
控制器和动作。

在测试包含 ``redirect()`` 方法和其它在重定向(*redirect*)之后的代码，通常更好的
做法是在重定向时返回。这是因为，``redirect()`` 方法在测试中是模拟的，并不像正常
状态是存在的。它不会使代码退出，而是继续运行重定向之后的代码。例如::

    App::uses('AppController', 'Controller');

    class ArticlesController extends AppController {
        public function add() {
            if ($this->request->is('post')) {
                if ($this->Article->save($this->request->data)) {
                    $this->redirect(array('action' => 'index'));
                }
            }
            // 更多代码
        }
    }

当测试上述代码时，就算遇到重定向，也还是会继续运行 ``// 更多代码``。所以，应当
这样写代码::

    App::uses('AppController', 'Controller');

    class ArticlesController extends AppController {
        public function add() {
            if ($this->request->is('post')) {
                if ($this->Article->save($this->request->data)) {
                    return $this->redirect(array('action' => 'index'));
                }
            }
            // 更多代码
        }
    }

这样，``// 更多代码`` 就不会执行，因为一到重定向那里就会返回了。

模拟 GET 请求
-------------

正如上面 ``testIndexPostData()`` 的例子中看到的，可以用 ``testAction()`` 方法来
测试 POST 动作，也可以测试 GET 动作。只要提供了 ``data`` 键，提交给控制器的请求
就会是 POST。默认情况下，所有的请求都是 POST 请求。可以设置 method 键来模拟 GET
请求::

    public function testAdding() {
        $data = array(
            'Post' => array(
                'title' => 'New post',
                'body' => 'Secret sauce'
            )
        );
        $this->testAction('/posts/add', array('data' => $data, 'method' => 'get'));
        // 一些断言(*assertion*)。
    }

在模拟 GET 请求时，data 键会作为查询字符串(*query string*)参数。

选择返回类型
------------

你可以从多种方法中选择如何检查控制器动作是否成功。每一种都提供了不同的方法来确保
代码执行了你的期望：

* ``vars`` 得到设置的视图(*view*)变量。
* ``view`` 得到渲染的不含布局(*layout*)的视图。
* ``contents`` 得到渲染的包含布局(*layout*)的视图。
* ``result`` 得到控制器动作的返回值。可用于测试 requestAction 方法。

默认值为 ``result``。只要返回类型不是 ``result``，也可以在测试用例中用属性访问
其它返回类型::

    public function testIndex() {
        $this->testAction('/posts/index');
        $this->assertInternalType('array', $this->vars['posts']);
    }


和 testAction 方法一起使用模拟对象
----------------------------------

有时你要用部分或完全模拟的对象来代替组件(*component*)或者模型(*model*)。为此可以
使用 :php:meth:`ControllerTestCase::generate()` 方法。``generate()`` 方法从
控制器接过生成模拟的困难工作。如果你决定要生成用于测试的控制器，你可以一起生成
模拟版本的模型和组件::

    $Posts = $this->generate('Posts', array(
        'methods' => array(
            'isAuthorized'
        ),
        'models' => array(
            'Post' => array('save')
        ),
        'components' => array(
            'RequestHandler' => array('isPut'),
            'Email' => array('send'),
            'Session'
        )
    ));

上面的代码会创建模拟的 ``PostsController`` 控制器，带有 ``isAuthorized`` 方法。
附带的 Post 模型会有 ``save()`` 方法，而附带的组件会有相应的方法。可以选择不传递
方法来模拟整个类，就像上面例子中的 Session。

生成的控制器自动作为测试控制器，用于测试。要启用自动生成，设置测试用例的
``autoMock`` 变量为 true。如果 ``autoMock`` 为 false，测试就会使用原来的控制器。

生成的控制器中的 response 对象总是被一个不发送头部信息的模拟对象所取代。在使用了
``generate()`` 或 ``testAction()`` 方法之后，可以用 ``$this->controller`` 来访问
控制器对象。

更复杂的例子
------------

作为最简单的形式，``testAction()`` 方法会在测试控制器(或者自动生成的控制器)包括
所有模拟的模型和组件之上运行 ``PostsController::index()``。测试的结果保存在
``vars`` 、 ``contents`` 、 ``view`` 和 ``return`` 属性中。还有 headers 属性供你
访问已经发送的 ``headers``，让你可以查看重定向::

    public function testAdd() {
        $Posts = $this->generate('Posts', array(
            'components' => array(
                'Session',
                'Email' => array('send')
            )
        ));
        $Posts->Session
            ->expects($this->once())
            ->method('setFlash');
        $Posts->Email
            ->expects($this->once())
            ->method('send')
            ->will($this->returnValue(true));

        $this->testAction('/posts/add', array(
            'data' => array(
                'Post' => array('title' => 'New Post')
            )
        ));
        $this->assertContains('/posts', $this->headers['Location']);
    }

    public function testAddGet() {
        $this->testAction('/posts/add', array(
            'method' => 'GET',
            'return' => 'contents'
        ));
        $this->assertRegExp('/<html/', $this->contents);
        $this->assertRegExp('/<form/', $this->view);
    }


这个例子展示 ``testAction()`` 和 ``generate()`` 方法稍微复杂一点儿的用法。首先，
生成测试控制器，模拟 :php:class:`SessionComponent` 组件。现在模拟了
SessionComponent 组件，我们就能够在它上面运行测试方法。假设
``PostsController::add()`` 方法重定向用户到 index，发送一封邮件，设置闪动提示
消息，测试就会通过。添加了第二个测试对获取 add 表单时进行基本的健全测试。我们
检查整个渲染的内容，看布局(*layout*)是否加载，并检查视图(*view*)是否有 form
标签。如你所见，这些改动极大地增加了你的自由，来测试控制器和容易地模拟控制器类。

在用使用静态方法的模拟对象来测试控制器时，你不得不用另外一种方法来表明对模拟对象
的期望。例如，如果想要模拟 :php:meth:`AuthComponent::user()`，就必须这样做::

    public function testAdd() {
        $Posts = $this->generate('Posts', array(
            'components' => array(
                'Session',
                'Auth' => array('user')
            )
        ));
        $Posts->Auth->staticExpects($this->any())
            ->method('user')
            ->with('id')
            ->will($this->returnValue(2));
    }

使用 ``staticExpects`` 方法，就可以模拟和操控组件和模型的静态方法。

测试返回 JSON 响应的控制器
--------------------------

在构建网络服务(*web service*)时，JSON 是非常友好和常用的格式。用 CakePHP 测试
网络服务的端点很简单。我们先看一个简单的返回 JSON 的控制器例子::

    class MarkersController extends AppController {
        public $autoRender = false;
        public function index() {
            $data = $this->Marker->find('first');
            $this->response->body(json_encode($data));
        }
    }

现在我们创建文件 ``app/Test/Case/Controller/MarkersControllerTest.php``，确保
网络服务返回正确的响应::

    class MarkersControllerTest extends ControllerTestCase {
        public function testIndex() {
            $result = $this->testAction('/markers/index.json');
            $result = json_decode($result, true);
            $expected = array(
                'Marker' => array('id' => 1, 'lng' => 66, 'lat' => 45),
            );
            $this->assertEquals($expected, $result);
        }
    }

测试视图
========

通常大部分应用程序不会直接测试它们的 HTML 代码。这么做经常会导致脆弱、难以维护的
测试套件，容易遭到破坏。在使用 :php:class:`ControllerTestCase` 编写功能性测试时，
可以设置 ``return`` 选项为 'view' 来检视渲染的视图内容。虽然有可能使用
ControllerTestCase 测试视图内容，更健壮、易于维护的集成/视图测试可以使用象
`Selenium webdriver <http://seleniumhq.org>`_ 这样的工具来实现。


测试组件
========

假设在应用程序中有一个名为 PagematronComponent 的组件。该组件帮我们设置使用它的
控制器的分页限制。下面是位于
``app/Controller/Component/PagematronComponent.php`` 的组件例子::

    class PagematronComponent extends Component {
        public $Controller = null;

        public function startup(Controller $controller) {
            parent::startup($controller);
            $this->Controller = $controller;
            // 确保控制器使用分页
            if (!isset($this->Controller->paginate)) {
                $this->Controller->paginate = array();
            }
        }

        public function adjust($length = 'short') {
            switch ($length) {
                case 'long':
                    $this->Controller->paginate['limit'] = 100;
                break;
                case 'medium':
                    $this->Controller->paginate['limit'] = 50;
                break;
                default:
                    $this->Controller->paginate['limit'] = 20;
                break;
            }
        }
    }

现在我们可以编写测试来确保分页 ``limit`` 参数被组件的 ``adjust`` 方法正确设置。
我们创建文件 ``app/Test/Case/Controller/Component/PagematronComponentTest.php``::

    App::uses('Controller', 'Controller');
    App::uses('CakeRequest', 'Network');
    App::uses('CakeResponse', 'Network');
    App::uses('ComponentCollection', 'Controller');
    App::uses('PagematronComponent', 'Controller/Component');

    // 用于测试的假的控制器
    class PagematronControllerTest extends Controller {
        public $paginate = null;
    }

    class PagematronComponentTest extends CakeTestCase {
        public $PagematronComponent = null;
        public $Controller = null;

        public function setUp() {
            parent::setUp();
            // 设置组件和假的测试控制器
            $Collection = new ComponentCollection();
            $this->PagematronComponent = new PagematronComponent($Collection);
            $CakeRequest = new CakeRequest();
            $CakeResponse = new CakeResponse();
            $this->Controller = new PagematronControllerTest($CakeRequest, $CakeResponse);
            $this->PagematronComponent->startup($this->Controller);
        }

        public function testAdjust() {
            // 用不同的测试测试 adjust 方法
            $this->PagematronComponent->adjust();
            $this->assertEquals(20, $this->Controller->paginate['limit']);

            $this->PagematronComponent->adjust('medium');
            $this->assertEquals(50, $this->Controller->paginate['limit']);

            $this->PagematronComponent->adjust('long');
            $this->assertEquals(100, $this->Controller->paginate['limit']);
        }

        public function tearDown() {
            parent::tearDown();
            // 完成后清理干净
            unset($this->PagematronComponent);
            unset($this->Controller);
        }
    }

测试助件
========

既然相当一部分逻辑存在于助件类中，确保这些类被测试覆盖就很重要。

我们先创建一个助件样例用于测试。``CurrencyRendererHelper`` 可以在视图中帮助显示
金额，为了简单，只有一个方法 ``usd()``。

::

    // app/View/Helper/CurrencyRendererHelper.php
    class CurrencyRendererHelper extends AppHelper {
        public function usd($amount) {
            return 'USD ' . number_format($amount, 2, '.', ',');
        }
    }

我们设置小数点为 2 位，小数点分隔符为点，千位分隔符为逗号，在格式化的数字前缀以
'USD' 字符串。

现在来创建测试::

    // app/Test/Case/View/Helper/CurrencyRendererHelperTest.php

    App::uses('Controller', 'Controller');
    App::uses('View', 'View');
    App::uses('CurrencyRendererHelper', 'View/Helper');

    class CurrencyRendererHelperTest extends CakeTestCase {
        public $CurrencyRenderer = null;

        // 我们在这里实例化助件
        public function setUp() {
            parent::setUp();
            $Controller = new Controller();
            $View = new View($Controller);
            $this->CurrencyRenderer = new CurrencyRendererHelper($View);
        }

        // 测试 usd() 函数
        public function testUsd() {
            $this->assertEquals('USD 5.30', $this->CurrencyRenderer->usd(5.30));

            // 应当总是有 2 位小数
            $this->assertEquals('USD 1.00', $this->CurrencyRenderer->usd(1));
            $this->assertEquals('USD 2.05', $this->CurrencyRenderer->usd(2.05));

            // 测试千位分隔符
            $this->assertEquals(
              'USD 12,000.70',
              $this->CurrencyRenderer->usd(12000.70)
            );
        }
    }

这里，我们用不同的参数调用 ``usd()`` 方法，让测试套件检查返回值是否等于所期望的。

保存并执行测试。你应当看见一个绿色进度条和消息，表示 1 个通过的测试和 4 句断言
(*assertion*)。

创建测试套件
============

如果你想要几个测试一起运行，可以创建测试套件。一个测试套件由多个测试用例组成。
``CakeTestSuite`` 提供了一些方法，来基于文件系统轻松地创建测试套件。如果我们要为
所有的模型测试创建测试套件，可以创建 ``app/Test/Case/AllModelTest.php``。放入
如下代码::

    class AllModelTest extends CakeTestSuite {
        public static function suite() {
            $suite = new CakeTestSuite('All model tests');
            $suite->addTestDirectory(TESTS . 'Case/Model');
            return $suite;
        }
    }

以上代码会把目录 ``/app/Test/Case/Model/`` 中所有的测试用例组织在一起。要添加
单个文件，使用 ``$suite->addTestFile($filename);`` 方法。可以用下面的办法递归
添加一个目录中的所有测试::

    $suite->addTestDirectoryRecursive(TESTS . 'Case/Model');

这就会递归添加 ``app/Test/Case/Model`` 目录中的所有测试用例。你可以用多个测试
套件构成一个套件，来运行应用程序的所有测试::

    class AllTestsTest extends CakeTestSuite {
        public static function suite() {
            $suite = new CakeTestSuite('All tests');
            $suite->addTestDirectoryRecursive(TESTS . 'Case');
            return $suite;
        }
    }

然后就可以用下面的命令从命令行运行这个测试::

    $ Console/cake test app AllTests

创建插件的测试
==============

插件的测试在插件目录中自己的目录中创建。 ::

    /app
        /Plugin
            /Blog
                /Test
                    /Case
                    /Fixture

插件的测试象普通的测试一样，但要记得在导入类时要使用插件的命名约定。这是本手册
插件一章中 ``BlogPost`` 模型的测试用例的例子。与其它测试的区别在第一行，导入了
'Blog.BlogPost' 模型。也需要对插件夹具(*fixture*)使用前缀
``plugin.blog.blog_post``::

    App::uses('BlogPost', 'Blog.Model');

    class BlogPostTest extends CakeTestCase {

        // 插件夹具位于 /app/Plugin/Blog/Test/Fixture/
        public $fixtures = array('plugin.blog.blog_post');
        public $BlogPost;

        public function testSomething() {
            // ClassRegistry 让模型使用测试数据库连接
            $this->BlogPost = ClassRegistry::init('Blog.BlogPost');

            // 这里进行一些有用的测试
            $this->assertTrue(is_object($this->BlogPost));
        }
    }

如果想要在 app 的测试中使用插件夹具，可以在 ``$fixtures`` 数组中使用
``plugin.pluginName.fixtureName`` 语法来引用它们。

与 Jenkins 集成
===============

`Jenkins <http://jenkins-ci.org>`_ 是持续集成服务器，可以帮你自动化运行测试用例。
这有助于确保所有测试保持通过，应用程序总是准备就绪的。

CakePHP 应用程序与 Jenkins 的集成是相当直截了当的。下面假设你已经在 \*nix 系统上
安装好了 Jenkins，并且可以管理它。你也知道如何创建作业(*job*)，运行构建。如果你
对这些有任何不确定，请参考 `Jenkins 文档 <http://jenkins-ci.org/>`_

创建作业
--------

开始先为应用程序创建作业，连接到你的代码仓库(*repository*)，这样 jenkins 才能
获得你的代码。

添加测试数据库配置
------------------

通常让 Jenkins 使用分开的数据库比较好，这样就可以防止连带的危害，避免一些基本的
问题。一旦在 jenkins 能够访问的数据库服务器(通常为 localhost)上创建了新的数据库，
在构建(*build*)中添加包含如下代码的 *外壳脚本步骤(shell script step)*::

    cat > app/Config/database.php <<'DATABASE_PHP'
    <?php
    class DATABASE_CONFIG {
        public $test = array(
            'datasource' => 'Database/Mysql',
            'host'       => 'localhost',
            'database'   => 'jenkins_test',
            'login'      => 'jenkins',
            'password'   => 'cakephp_jenkins',
            'encoding'   => 'utf8'
        );
    }
    DATABASE_PHP

这确保你总有 Jenkins 要求的正确数据库配置。对任何其它需要的配置文件做同样处理。
经常，更好的做法是，在每次构建之前也要删除再重新创建数据库。这样隔绝了串联的失败，
即一个失败的构建引起其它构建失败。在构建中加入另一个 *外壳脚本步骤(shell script
step)*，包含如下代码::

    mysql -u jenkins -pcakephp_jenkins -e 'DROP DATABASE IF EXISTS jenkins_test; CREATE DATABASE jenkins_test';

添加测试
--------

在构建中加入另一个 *外壳脚本步骤(shell script step)*。在这个步骤中运行应用程序的
测试。创建 JUnit 日志文件或者 clover 测试覆盖(*coverage*)，通常更好，因为这为
测试结果提供了一个不错的图形显示::

    app/Console/cake test app AllTests \
    --stderr \
    --log-junit junit.xml \
    --coverage-clover clover.xml

如果你使用 clover 测试覆盖(*coverage*) 或者 JUnit 结果，确保这些也在 Jenkins 中
配置好了。如果没有配置这些步骤，就不能看到结果。

运行构建
--------

现在你应当能够运行构建了。检查控制台输出，并作出必要的修改让构建通过。


.. meta::
    :title lang=zh: Testing
    :keywords lang=zh: web runner,phpunit,test database,database configuration,database setup,database test,public test,test framework,running one,test setup,de facto standard,pear,runners,array,databases,cakephp,php,integration
