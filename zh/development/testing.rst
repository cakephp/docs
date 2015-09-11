测试
####

CakePHP 内置带有全�?�的测试支�?。CakePHP 自带有与 `PHPUnit <http://phpunit.de>`_ 
的集�?。除了 PHPUnit �??供的特性，CakePHP �??供了一些�?外的功能，使得测试更为容易。
本节将介�? PHPUnit 的安装，开始进行�?�元测试，以�?�如何使用 CakePHP �??供的扩展。

安装 PHPUnit
============

CakePHP 使用 PHPUnit 作为其底层测试框架。PHPUnit 是 PHP �?�元测试事实上的标准。
它�??供了一套深刻而强大的功能，确�?你的代�?�?�了你认为它所�?�?�的事情。

通过 Composer 安装
------------------

较新版本的 PHPUnit 当�?�?能与 CakePHP 集�?::

    "phpunit/phpunit": "3.7.38"

通过 .phar 包�?�安装
-------------------

你也�?�以直接下载文件。�?�是�?注�?从 https://phar.phpunit.de/ 得到了正确的版本。
确�? /usr/local/bin �?于 php.ini 文件的 include_path 中::

    wget https://phar.phpunit.de/phpunit-3.7.38.phar -O phpunit.phar
    chmod +x phpunit.phar
    mv phpunit.phar /usr/local/bin/phpunit

.. note::

    PHPUnit 4 与 CakePHP 的�?�元测试�?兼容。

    根�?�你系统的�?置，你�?�能需�?用 ``sudo`` �?行上�?�的命令。

一旦用 PEAR 安装程�?安装了 PHPUnit，应当确认 PHPUnit 库在 PHP 的 
``include_path`` 中。为此你�?�以检查 php.ini 文件，确�? PHPUnit 的文件在 
``include_path`` 的其中一个目录中。

.. tip::

    当使用 PHPUnit 3.6+ 时，所有的输出都会被�?�没。如果使用 CLI，�?�以添加 
    ``--debug`` 修饰符；如果使用 web �?行器�?�显示输出，�?�以添加 ``&debug=1`` 
    到网�?�中。

测试数�?�库的设置
================

记得在�?行任何测试之�?，在 ``app/Config/core.php`` 文件中的调试(debug)级别至少是 
1。当调试级别是 0 时，无法通过 web �?行器访问测试。在�?行任何测试之�?，应当确�?
添加 ``$test`` 数�?�库�?置。该�?置被 CakePHP 用于测试夹具(*fixture*)的表和数�?�::

    public $test = array(
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host'       => 'dbhost',
        'login'      => 'dblogin',
        'password'   => 'dbpassword',
        'database'   => 'test_database'
    );

.. note::

    把测试数�?�库和实际的数�?�库分�?�?�?�的数�?�库比较好。这�?�以�?��?将�?�任何令人尴尬
    的错误。

检查测试数�?�库的设置
====================

安装完了 PHPUnit，设置好了 ``$test`` 数�?�库�?置，�?�以�?行核心测试中的一个，�?�
确�?你�?�以编写和�?行你自己的测试。测试有两个内置的�?行器，我们从 web �?行器开始。
�?览 http://localhost/your_app/test.php 就�?�以访问测试，应当能看到核心测试列表了。
点击 'AllConfigure' 测试。你应当看到一个绿色的(进度)�?�，和�?行的测试的更多信�?�，
以�?�通过的测试数�?。

�?�喜，你现在�?�以开始编写测试了�?

测试用例约定
============

象 CakePHP 中的大部分东西，测试用例也有一些约定。涉�?�测试的：

#. 包�?�测试的 PHP 文件应当�?于 ``app/Test/Case/[Type]`` 目录。
#. 这些文件的文件�??应当以 ``Test.php`` 结尾，而�?能仅仅是.php。
#. �?�有测试的类应当扩展 ``CakeTestCase``，``ControllerTestCase`` 或 
   ``PHPUnit_Framework_TestCase``。
#. 象其它类�??，测试用例类�??应当与文件�??匹�?。文件 ``RouterTest.php`` 应当包�?�
   ``class RouterTest extends CakeTestCase``。
#. 包�?�测试(�?�包�?�断言(*assertion*))的任何方法的�??称应当以 ``test`` 开头，例如
   ``testPublished()``。也�?�以使用 ``@test`` 标注(*annotation*)�?�标记方法为测试
   方法。

在创建了测试用例之�?�，�?�以�?览 ``http://localhost/your_app/test.php`` (�?�决于你
的�?置是怎样的)�?��?行。点击 App test cases，�?点击测试文件的链接。也�?�以从命令行
使用测试外壳(*shell*)�?��?行测试::

    ./Console/cake test app Model/Post

例如，就会�?行 Post 模型的测试。

创建你的第一个测试用例
======================

在下�?�的例�?中，我们会为一个很简�?�的助件(*helper*)方法创建一个测试用例。我们�?
测试的助件会生�?进度�?� HTML。助件是这样的::

    class ProgressHelper extends AppHelper {
        public function bar($value) {
            $width = round($value / 100, 2) * 100;
            return sprintf(
                '<div class="progress-container">
                    <div class="progress-bar" style="width: %s%%"></div>
                </div>', $width);
        }
    }

这是个很简�?�的例�?，�?过�?�以展示如何创建简�?�的测试用例。创建并�?存助件�?�，我们�?�
创建测试用例文件 ``app/Test/Case/View/Helper/ProgressHelperTest.php``。在该文件
中我们以如下代�?开始::

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
方法会在测试用例类中的�?个 *测试* 方法被调用之�?调用。setUp 方法应当�?始化测试
需�?的对象，�?�任何需�?的�?置。在我们的 setUp 方法中，我们添加如下代�?::

    public function setUp() {
        parent::setUp();
        $Controller = new Controller();
        $View = new View($Controller);
        $this->Progress = new ProgressHelper($View);
    }

在测试用例中调用父类方法很�?�?，因为 CakeTestCase::setUp() 方法会�?�一些事情，
比如备份 :php:class:`Configure` 类中的值，以�?��?存 :php:class:`App` 类中的路径。

接下�?�，我们�?填写测试方法。我们会使用一些断言(*assertion*)�?�确�?我们的代�?生�?
了我们希望的输出::

    public function testBar() {
        $result = $this->Progress->bar(90);
        $this->assertContains('width: 90%', $result);
        $this->assertContains('progress-bar', $result);

        $result = $this->Progress->bar(33.3333333);
        $this->assertContains('width: 33%', $result);
    }

上述测试很简�?�，但说明了使用测试用例的潜在好处。我们用 ``assertContains()`` �?�
确�?助件返回的字符串包�?�我们期望的内容。如果结果�?包�?�期望的内容，测试就会失败，
我们就知�?�我们的代�?�?对了。

使用测试用例，就能容易地�??述一组已知输入和它们期望的输出之间的关系。这�?�以帮助你
对正在编写的代�?更有信心，因为你�?�以容易地检查你写的代�?满足测试所�?�的期望和断言。
而且，因为测试是代�?，无论何时你�?�了一处改动，它们都很容易�?次�?行。这�?�以帮助
防止新错误(*bug*)的出现。

.. _running-tests:

�?行测试
========

一旦安装了 PHPUnit，写了一些测试用例，你就应当很频�?地�?行测试用例。在�??交任何
改动之�?�?行测试比较好，�?�以帮助确�?你没有破�??任何东西。

从�?览器�?行测试
----------------

CakePHP �??供了 web 界�?��?��?行测试，这样，如果你觉得这样的环境更舒�?，�?�以通过
�?览器�?行测试。你�?�以通过�?览 ``http://localhost/your_app/test.php`` �?�访问 web
�?行器。test.php 的确切�?置根�?�你的设置而�?�化，�?过该文件和 ``index.php`` 在
�?�一级。

一旦加载了测试�?行器，就�?�以在 App�?Core 和 Plugin 测试套件之间切�?�。点击�?�个
测试用例就会�?行该测试，并显示结果。

查看代�?覆盖
~~~~~~~~~~~~

如果你安装了 `Xdebug <http://xdebug.org>`_，就�?�以查看代�?覆盖的结果。代�?覆盖
�?�以告诉你，你的测试没有触�?�代�?的哪部分。覆盖率用于决定今�?�在哪里还应当添加测试，
并给你一个度�?�?�监测你测试的进展。

.. |Code Coverage| image:: /_static/img/code-coverage.png

|Code Coverage|

内嵌的代�?覆盖使用绿色行�?�表示�?行过的行。如果把鼠标悬�?�在一个绿色的行上，会有
�??示说明哪些测试覆盖了该行。红色的行没有�?行，�?�没有被测试检验。�?�色的行被 
Xdebug 认为是无法�?行的代�?。

.. _run-tests-from-command-line:

从命令行�?行测试
----------------

CakePHP �??供 ``test`` 外壳(*shell*)�?��?行测试。你�?�以用 test 外壳容易地�?行 app�?
core 和�?�件的测试。它也接�?�通常 PHPUnit 命令行期望的的所有�?�数。从 app 目录，
�?�以象下�?�这样�?��?行测试::

    # �?行 app 中的模型测试
    ./Console/cake test app Model/Article

    # �?行�?�件中的组件测试
    ./Console/cake test DebugKit Controller/Component/ToolbarComponent

    # �?行 CakePHP 中的 configure 类测试
    ./Console/cake test core Core/Configure

.. note::

    如果你�?行与会�?(*session*)交互的测试，通常最好使用 ``--stderr`` 选项。这
    �?�以修正由于 headers_sent 警告引起的测试失败的问题。

.. versionchanged:: 2.1
    在 2.1 版本中增加了 ``test`` 外壳。2.0 版本的 ``testsuite`` 外壳�?然�?�以使用，
    但建议使用新语法。

也�?�以在项目根目录下�?行 ``test`` 外壳。这会显示你现有全部测试的列表。然�?�你�?�以
�?�?地选择�?�?行的一个或多个测试::

    # 在项目根目录中�?行�?��?� app 的应用程�?目录的测试
    lib/Cake/Console/cake test app

    # 在项目根目录中�?行�?于 ./myapp 目录中的应用程�?的测试
    lib/Cake/Console/cake test --app myapp app

过滤测试用例
~~~~~~~~~~~~

在有大�?测试用例的情况下，当你试图修�?�?�个失败的用例时，会�?常�?�?行测试方法的
一个�?集。使用 CLI �?行器，你�?�以使用一个选项�?�过滤测试方法::

    ./Console/cake test core Console/ConsoleOutput --filter testWriteArray

过滤�?�数作为大�?写�?感的正则表达�?，�?�过滤�?�?行的测试方法。

生�?代�?覆盖率
~~~~~~~~~~~~~~

你�?�以从命令行使用 PHPUnit 内置的代�?覆盖工具�?�生�?代�?覆盖报告。PHPUnit 会生�?
一组包�?�覆盖结果的�?��? HTML 文件。你�?�以�?下�?�这样�?�生�?一个测试用例的覆盖报告::

    ./Console/cake test app Model/Article --coverage-html webroot/coverage

这会把覆盖结果放在应用程�?的 webroot 目录中。你应当能够在 
``http://localhost/your_app/coverage`` 看到结果。

�?行使用会�?的测试
~~~~~~~~~~~~~~~~~~

在命令行�?行使用会�?的测试时，需�?加上 ``--stderr`` 标志。�?这么�?�会导致会�?无法
工作。PHPUnit 默认会输出测试进程到标准输出(*stdout*)，这会使 PHP 以为头部信�?�
已�?�?��?，从而阻止会�?�?�动。把 PHPUnit 输出切�?�到 stderr，就�?��?了这个问题。


测试用例生命周期回调
====================

测试用例有一些生命周期回调函数，�?�以在测试时使用：

* ``setUp`` 在�?个测试方法之�?调用。应当用�?�创建�?测试的对象，为测试�?始化任何
  数�?�。记得一定�?调用 ``parent::setUp()``。
* ``tearDown`` 在�?个测试方法之�?�调用。应当用�?�在测试完�?之�?�进行清�?�。记得一定
  �?调用  ``parent::tearDown()``。
* ``setupBeforeClass`` 在一个用例中的测试方法开始之�?�?�调用一次。该方法必须是
  *�?��?的*。
* ``tearDownAfterClass`` 在一个用例中的测试方法完�?之�?��?�调用一次。该方法必须是
  *�?��?的*。

测试夹具
========

当测试代�?�?赖于模型和数�?�库时，�?�以使用 **测试夹具(fixture)** �?�生�?临时数�?�库
表，加载样例数�?�，用于测试。使用测试夹具的好处是，你的测试�?会破�??在线的应用程�?
数�?�。而且，在真的为应用程�?开�?�实际内容之�?，你就�?�以测试你的代�?。

CakePHP 使用 ``app/Config/database.php`` �?置文件中的�??为 ``$test`` 的(数�?�库)
连接。如果该连接无法使用，将引�?�一个异常，就无法使用数�?�库夹具了。

在一个基于夹具的测试用例的�?行过程中，CakePHP 执行下�?�的�?作：

#. 创建�?个夹具需�?的表。
#. 如果夹具中�??供了数�?�，用数�?�填充表。
#. �?行测试方法。
#. 清空夹具的表。
#. 从数�?�库删除夹具的表。

创建夹具
--------

在创建夹具时，主�?定义两件事情：如何创建表(表里有哪些字段)，哪些记录�?首先填充到
表中。让我们�?�创建第一个夹具，用于测试 Article 模型。在 ``app/Test/Fixture`` 
目录中创建以下内容的文件 ``ArticleFixture.php``::

    class ArticleFixture extends CakeTestFixture {

          // �?�选。
          // 设置该属性�?�加载夹具到�?�?�的测试数�?��?
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

``$useDbConfig`` 属性定义夹具�?使用的数�?��?。如果应用程�?使用多个数�?��?，你应当
使夹具匹�?模型的数�?��?，但是�?加上 ``test_`` �?缀。例如，如果模型使用 ``mydb`` 
数�?��?，夹具就应当使用 ``test_mydb`` 数�?��?。如果 ``test_mydb`` 连接�?存在，模型
就会使用默认的 ``test`` 数�?��?。夹具数�?��?必须�?缀以 ``test`` �?��?低�?行测试时
�?外清除应用程�?的所有数�?�的�?�能性。

我们使用 ``$fields`` �?�指定这个表有哪些字段，以�?�它们是如何定义的。用�?�定义这些
字段的格�?和 :php:class:`CakeSchema` 类使用的相�?�。定义表�?�以使用的键为：

``type``
    CakePHP 内部的数�?�类型。当�?支�?：
        - ``string``: 映射为 ``VARCHAR``
        - ``text``: 映射为 ``TEXT``
        - ``integer``: 映射为 ``INT``
        - ``float``: 映射为 ``FLOAT``
        - ``datetime``: 映射为 ``DATETIME``
        - ``timestamp``: 映射为 ``TIMESTAMP``
        - ``time``: 映射为 ``TIME``
        - ``date``: 映射为 ``DATE``
        - ``binary``: 映射为 ``BLOB``
``key``
    设置为 ``primary`` �?�使该字段 AUTO\_INCREMENT，并作为表的主键。
``length``
    设置为字段需�?的长度。
``null``
    设置为 ``true`` (�?许 NULL) 或者 ``false`` (�?�?许 NULL)。
``default``
    字段的默认值。

我们�?�以定义一组记录，在夹具的表创建之�?�填充到表里。其格�?是相当简�?�的，
``$records`` 为记录数组。``$records`` 中的�?项为一行。在�?行中，应当是该行的列和
值的关�?�数组。�?�是�?记�? $records 数组中的�?�?�记须有 ``$fields`` 数组中指定的 
**�?个** 字段都必须有一个键。如果�?�?�记录的一个字段需�?有 ``null`` 值，�?�需指定
该键的值为 ``null``。

动�?数�?�和夹具
--------------

既然夹具的记录声明为类属性，就无法轻易使用函数或者其它动�?数�?��?�定义夹具。为了
解决这个问题，�?�以在夹具的 init() 方法中定义 ``$records``。例如，如果�?所有 
created 和 updated 时间标签�??应今天的日期，�?�以这样�?�::

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

当�?载 ``init()`` 方法时，�?�需记得一定�?调用 ``parent::init()``。


导入表信�?�和记录
----------------

应用程�?�?�能已�?有正常工作的模型�?�相关的真实数�?�，而你�?�能会决定�?使用这些数�?��?�
测试应用程�?。这样�?在夹具中定义表和/或记录就是�?�?的事情了。幸好，有办法从现有
的模型或表�?�定义(夹具的)表和/或记录。

让我们从一个例�?开始。�?�定在应用程�?中有一个�?��?� Article 的模型(映射到�??为 
articles 的表)，修改�?一节的夹具例�?(``app/Test/Fixture/ArticleFixture.php``)为::

    class ArticleFixture extends CakeTestFixture {
        public $import = 'Article';
    }

这�?��?告诉测试套件从�?��?� Article 的模型连接的表导入表的定义。你�?�以使用应用程�?
中的任何�?�以使用的模型。这�?�语�?��?�导入 Article 的数�?�结构(*schema*)，而�?导入
记录。�?导入记录，你�?�以这样�?�::

    class ArticleFixture extends CakeTestFixture {
        public $import = array('model' => 'Article', 'records' => true);
    }

�?�一方�?�，如果有一个创建好的表，而没有相应的模型，�?�以指定导入过程读�?�那个表的
信�?�。例如::

    class ArticleFixture extends CakeTestFixture {
        public $import = array('table' => 'articles');
    }

会使用�??为 'default' 的 CakePHP 数�?�库连接从�?��?� 'articles' 的表导入表的定义。
如果�?使用�?�?�的连接，�?�以使用::

    class ArticleFixture extends CakeTestFixture {
        public $import = array('table' => 'articles', 'connection' => 'other');
    }

因为它使用 CakePHP 的数�?�库连接，如果声明了任何表�?缀，读�?�表的信�?�时就会自动
使用该�?缀。上述两段代�?片段�?会从表导入记录。�?让夹具也导入记录，把导入改为::

    class ArticleFixture extends CakeTestFixture {
        public $import = array('table' => 'articles', 'records' => true);
    }

也�?�以很自然地从现有的模型/表导入表的定义，但是象�?一节所示的那样直接在夹具中
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

夹具创建好之�?�，就�?在测试用例中使用。在�?个测试用例中应当加载需�?的夹具。对�?个
�?�?行查询语�?�的模型都应当加载夹具。�?加载夹具，在模型中定义 ``$fixtures`` 属性::

    class ArticleTest extends CakeTestCase {
        public $fixtures = array('app.article', 'app.comment');
    }

上述代�?会从应用程�?的 Fixture 目录加载 Article 和 Comment 夹具。也�?�以从
CakePHP 核心或�?�件中加载夹具::

    class ArticleTest extends CakeTestCase {
        public $fixtures = array('plugin.debug_kit.article', 'core.comment');
    }

使用 ``core`` �?缀会从 CakePHP 加载夹具，使用�?�件�??称作为�?缀会从该命�??的�?�件中
加载夹具。

你�?�以设置 :php:attr:`CakeTestCase::$autoFixtures` 为 ``false`` �?�控制何时加载
夹具，之�?��?用 :php:meth:`CakeTestCase::loadFixtures()` �?�加载::

    class ArticleTest extends CakeTestCase {
        public $fixtures = array('app.article', 'app.comment');
        public $autoFixtures = false;

        public function testMyFunction() {
            $this->loadFixtures('Article', 'Comment');
        }
    }

从 2.5.0 版本开始，�?�以加载在�?目录中的夹具。如果你有一个大型的应用程�?，使用
多个目录�?�以更容易地组织夹具。�?加载�?目录中的夹具，�?�需在夹具�??称中包括�?目录
�??称::

    class ArticleTest extends CakeTestCase {
        public $fixtures = array('app.blog/article', 'app.blog/comment');
    }

在上述例�?中，两个夹具都会从 ``App/Test/Fixture/blog/`` 目录中加载。

.. versionchanged:: 2.5
    从 2.5.0 版本开始，�?�以加载在�?目录中的夹具。

测试模型
========

比如说我们已�?有了在文件 ``app/Model/Article.php`` 中定义的 Article 模型，是这样
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

现在�?建立使用这个模型的测试，但是�?通过夹具，�?�测试模型中的一些功能。CakePHP 
测试套件�?�加载最少的一组文件(�?��?�?测试独立)，这样我们必须由加载模型开始 — 在
这里就是我们已�?定义了的 Article 模型。

现在在目录 ``app/Test/Case/Model`` 中�?�创建文件 ``ArticleTest.php``，包�?�如下
内容::

    App::uses('Article', 'Model');

    class ArticleTest extends CakeTestCase {
        public $fixtures = array('app.article');
    }

在测试用例的�?��? ``$fixtures`` 中定义一组�?使用的夹具。应当记得包�?�所有�?�?行
查询的夹具。

.. note::
    你�?�以通过指定 ``$useDbConfig`` 属性�?�覆盖测试模型数�?�库。确�?相关的夹具使用
    相�?�的值，这样�?会在正确的数�?�库中创建表。

创建测试方法
------------

现在让我们添加一个方法�?�测试 Article 模型中的函数 published()。编辑文件 
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

你�?�以看到我们添加了方法 ``testPublished()``。我们开始先创建一个 ``Article`` 
模型的实例，然�?��?行 ``published()`` 方法。在�?��? ``$expected`` 中设置我们期望的
正确结果(我们知�?�是因为我们定义了开始�?填充到文章(*artilce*)表中的记录。)我们
使用 ``assertEquals`` 方法测试结果等于我们的期望。欲知如何�?行测试用例，请�?�考 
:ref:`running-tests` 一节。

.. note::

    在为测试设置模型时，一定�?使用 ``ClassRegistry::init('YourModelName');``，
    因为它知�?��?使用测试数�?�库连接。

模拟模型方法
------------

有时在测试模型的方法时你�?模拟这些方法。你应当使用 ``getMockForModel`` 方法�?�
创建模型的测试模拟。这�?��?了通常模拟对象有的�??射属性的问题::

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

虽然你�?�以用和助件(*Helper*)�?模型(*Model*)和组件(*Component*)相�?�的方�?测试
控制器类，CakePHP �??供了特别的 ``ControllerTestCase`` 类。用该类作为控制器测试
用例的基类，让你�?�以使用 ``testAction()`` 方法，使测试用例更简�?�。
``ControllerTestCase`` 让你容易地模拟组件和模型，以�?�象 
:php:meth:`~Controller::redirect()` 这样�?�能更难测试的方法。

�?�设你有一个典型的 Articles 控制器和相应的模型。控制器代�?是这样的::

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

在 ``app/Test/Case/Controller`` 目录中创建一个�??为 
``ArticlesControllerTest.php`` 的文件，放入以下代�?::

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

这个例�?展示了一些使用 testAction 方法测试控制器的方�?。``testAction`` 方法的
第一个�?�数应当总是�?测试的网�?�(*URL*)。CakePHP 会创建一个请求，调度(*dispatch*)
控制器和动作。

在测试包�?� ``redirect()`` 方法和其它在�?定�?�(*redirect*)之�?�的代�?，通常更好的
�?�法是在�?定�?�时返回。这是因为，``redirect()`` 方法在测试中是模拟的，并�?�?正常
状�?是存在的。它�?会使代�?退出，而是继续�?行�?定�?�之�?�的代�?。例如::

    App::uses('AppController', 'Controller');
    
    class ArticlesController extends AppController {
        public function add() {
            if ($this->request->is('post')) {
                if ($this->Article->save($this->request->data)) {
                    $this->redirect(array('action' => 'index'));
                }
            }
            // 更多代�?
        }
    }

当测试上述代�?时，就算�?�到�?定�?�，也还是会继续�?行 ``// 更多代�?``。所以，应当
这样写代�?::

    App::uses('AppController', 'Controller');
    
    class ArticlesController extends AppController {
        public function add() {
            if ($this->request->is('post')) {
                if ($this->Article->save($this->request->data)) {
                    return $this->redirect(array('action' => 'index'));
                }
            }
            // 更多代�?
        }
    }

这样，``// 更多代�?`` 就�?会执行，因为一到�?定�?�那里就会返回了。

模拟 GET 请求
-------------

正如上�?� ``testIndexPostData()`` 的例�?中看到的，�?�以用 ``testAction()`` 方法�?�
测试 POST 动作，也�?�以测试 GET 动作。�?��?�??供了 ``data`` 键，�??交给控制器的请求
就会是 POST。默认情况下，所有的请求都是 POST 请求。�?�以设置 method 键�?�模拟 GET 
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

在模拟 GET 请求时，data 键会作为查询字符串(*query string*)�?�数。

选择返回类型
------------

你�?�以从多�?方法中选择如何检查控制器动作是�?��?功。�?一�?都�??供了�?�?�的方法�?�确�?
代�?执行了你的期望：

* ``vars`` 得到设置的视图(*view*)�?��?。
* ``view`` 得到渲染的�?�?�布局(*layout*)的视图。
* ``contents`` 得到渲染的包�?�布局(*layout*)的视图。
* ``result`` 得到控制器动作的返回值。�?�用于测试 requestAction 方法。

默认值为 ``result``。�?��?返回类型�?是 ``result``，也�?�以在测试用例中用属性访问
其它返回类型::

    public function testIndex() {
        $this->testAction('/posts/index');
        $this->assertInternalType('array', $this->vars['posts']);
    }


和 testAction 方法一起使用模拟对象
----------------------------------

有时你�?用部分或完全模拟的对象�?�代替组件(*component*)或者模型(*model*)。为此�?�以
使用 :php:meth:`ControllerTestCase::generate()` 方法。``generate()`` 方法从
控制器接过生�?模拟的困难工作。如果你决定�?生�?用于测试的控制器，你�?�以一起生�?
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

上�?�的代�?会创建模拟的 ``PostsController`` 控制器，带有 ``isAuthorized`` 方法。
附带的 Post 模型会有 ``save()`` 方法，而附带的组件会有相应的方法。�?�以选择�?传递
方法�?�模拟整个类，就�?上�?�例�?中的 Session。

生�?的控制器自动作为测试控制器，用于测试。�?�?�用自动生�?，设置测试用例的 
``autoMock`` �?��?为 true。如果 ``autoMock`` 为 false，测试就会使用原�?�的控制器。

生�?的控制器中的 response 对象总是被一个�?�?��?头部信�?�的模拟对象所�?�代。在使用了 
``generate()`` 或 ``testAction()`` 方法之�?�，�?�以用 ``$this->controller`` �?�访问
控制器对象。

更�?�?�的例�?
------------

作为最简�?�的形�?，``testAction()`` 方法会在测试控制器(或者自动生�?的控制器)包括
所有模拟的模型和组件之上�?行 ``PostsController::index()``。测试的结果�?存在 
``vars`` �? ``contents`` �? ``view`` 和 ``return`` 属性中。还有 headers 属性供你
访问已�?�?��?的 ``headers``，让你�?�以查看�?定�?�::

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


这个例�?展示 ``testAction()`` 和 ``generate()`` 方法�?微�?�?�一点儿的用法。首先，
生�?测试控制器，模拟 :php:class:`SessionComponent` 组件。现在模拟了 
SessionComponent 组件，我们就能够在它上�?��?行测试方法。�?�设 
``PostsController::add()`` 方法�?定�?�用户到 index，�?��?一�?邮件，设置闪动�??示
消�?�，测试就会通过。添加了第二个测试对获�?� add 表�?�时进行基本的�?�全测试。我们
检查整个渲染的内容，看布局(*layout*)是�?�加载，并检查视图(*view*)是�?�有 form 
标签。如你所�?，这些改动�?大地增加了你的自由，�?�测试控制器和容易地模拟控制器类。

在用使用�?��?方法的模拟对象�?�测试控制器时，你�?得�?用�?�外一�?方法�?�表明对模拟对象
的期望。例如，如果想�?模拟 :php:meth:`AuthComponent::user()`，就必须这样�?�::

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

使用 ``staticExpects`` 方法，就�?�以模拟和�?控组件和模型的�?��?方法。

测试返回 JSON �?应的控制器
--------------------------

在构建网络�?务(*web service*)时，JSON 是�?�常�?�好和常用的格�?。用 CakePHP 测试
网络�?务的端点很简�?�。我们先看一个简�?�的返回 JSON 的控制器例�?::

    class MarkersController extends AppController {
        public $autoRender = false;
        public function index() {
            $data = $this->Marker->find('first');
            $this->response->body(json_encode($data));
        }
    }

现在我们创建文件 ``app/Test/Case/Controller/MarkersControllerTest.php``，确�?
网络�?务返回正确的�?应::

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

通常大部分应用程�?�?会直接测试它们的 HTML 代�?。这么�?��?常会导致脆弱�?难以维护的
测试套件，容易�?�到破�??。在使用 :php:class:`ControllerTestCase` 编写功能性测试时，
�?�以设置 ``return`` 选项为 'view' �?�检视渲染的视图内容。虽然有�?�能使用 
ControllerTestCase 测试视图内容，更�?�壮�?易于维护的集�?/视图测试�?�以使用象 
`Selenium webdriver <http://seleniumhq.org>`_ 这样的工具�?�实现。


测试组件
========

�?�设在应用程�?中有一个�??为 PagematronComponent 的组件。该组件帮我们设置使用它的
控制器的分页�?制。下�?�是�?于 
``app/Controller/Component/PagematronComponent.php`` 的组件例�?::

    class PagematronComponent extends Component {
        public $Controller = null;

        public function startup(Controller $controller) {
            parent::startup($controller);
            $this->Controller = $controller;
            // 确�?控制器使用分页
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

现在我们�?�以编写测试�?�确�?分页 ``limit`` �?�数被组件的 ``adjust`` 方法正确设置。
我们创建文件 ``app/Test/Case/Controller/Component/PagematronComponentTest.php``::

    App::uses('Controller', 'Controller');
    App::uses('CakeRequest', 'Network');
    App::uses('CakeResponse', 'Network');
    App::uses('ComponentCollection', 'Controller');
    App::uses('PagematronComponent', 'Controller/Component');

    // 用于测试的�?�的控制器
    class PagematronControllerTest extends Controller {
        public $paginate = null;
    }

    class PagematronComponentTest extends CakeTestCase {
        public $PagematronComponent = null;
        public $Controller = null;

        public function setUp() {
            parent::setUp();
            // 设置组件和�?�的测试控制器
            $Collection = new ComponentCollection();
            $this->PagematronComponent = new PagematronComponent($Collection);
            $CakeRequest = new CakeRequest();
            $CakeResponse = new CakeResponse();
            $this->Controller = new PagematronControllerTest($CakeRequest, $CakeResponse);
            $this->PagematronComponent->startup($this->Controller);
        }

        public function testAdjust() {
            // 用�?�?�的测试测试 adjust 方法
            $this->PagematronComponent->adjust();
            $this->assertEquals(20, $this->Controller->paginate['limit']);

            $this->PagematronComponent->adjust('medium');
            $this->assertEquals(50, $this->Controller->paginate['limit']);

            $this->PagematronComponent->adjust('long');
            $this->assertEquals(100, $this->Controller->paginate['limit']);
        }

        public function tearDown() {
            parent::tearDown();
            // 完�?�?�清�?�干净
            unset($this->PagematronComponent);
            unset($this->Controller);
        }
    }

测试助件
========

既然相当一部分逻辑存在于助件类中，确�?这些类被测试覆盖就很�?�?。

我们先创建一个助件样例用于测试。``CurrencyRendererHelper`` �?�以在视图中帮助显示
金�?，为了简�?�，�?�有一个方法 ``usd()``。

::

    // app/View/Helper/CurrencyRendererHelper.php
    class CurrencyRendererHelper extends AppHelper {
        public function usd($amount) {
            return 'USD ' . number_format($amount, 2, '.', ',');
        }
    }

我们设置�?数点为 2 �?，�?数点分隔符为点，�?��?分隔符为逗�?�，在格�?化的数字�?缀以 
'USD' 字符串。

现在�?�创建测试::

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

            // 应当总是有 2 �?�?数
            $this->assertEquals('USD 1.00', $this->CurrencyRenderer->usd(1));
            $this->assertEquals('USD 2.05', $this->CurrencyRenderer->usd(2.05));

            // 测试�?��?分隔符
            $this->assertEquals(
              'USD 12,000.70',
              $this->CurrencyRenderer->usd(12000.70)
            );
        }
    }

这里，我们用�?�?�的�?�数调用 ``usd()`` 方法，让测试套件检查返回值是�?�等于所期望的。

�?存并执行测试。你应当看�?一个绿色进度�?�和消�?�，表示 1 个通过的测试和 4 �?�断言
(*assertion*)。

创建测试套件
============

如果你想�?几个测试一起�?行，�?�以创建测试套件。一个测试套件由多个测试用例组�?。
``CakeTestSuite`` �??供了一些方法，�?�基于文件系统轻�?�地创建测试套件。如果我们�?为
所有的模型测试创建测试套件，�?�以创建 ``app/Test/Case/AllModelTest.php``。放入
如下代�?::

    class AllModelTest extends CakeTestSuite {
        public static function suite() {
            $suite = new CakeTestSuite('All model tests');
            $suite->addTestDirectory(TESTS . 'Case/Model');
            return $suite;
        }
    }

以上代�?会把目录 ``/app/Test/Case/Model/`` 中所有的测试用例组织在一起。�?添加
�?�个文件，使用 ``$suite->addTestFile($filename);`` 方法。�?�以用下�?�的办法递归
添加一个目录中的所有测试::

    $suite->addTestDirectoryRecursive(TESTS . 'Case/Model');

这就会递归添加 ``app/Test/Case/Model`` 目录中的所有测试用例。你�?�以用多个测试
套件构�?一个套件，�?��?行应用程�?的所有测试::

    class AllTestsTest extends CakeTestSuite {
        public static function suite() {
            $suite = new CakeTestSuite('All tests');
            $suite->addTestDirectoryRecursive(TESTS . 'Case');
            return $suite;
        }
    }

然�?�就�?�以用下�?�的命令从命令行�?行这个测试::

    $ Console/cake test app AllTests

创建�?�件的测试
==============

�?�件的测试在�?�件目录中自己的目录中创建。 ::

    /app
        /Plugin
            /Blog
                /Test
                    /Case
                    /Fixture

�?�件的测试象普通的测试一样，但�?记得在导入类时�?使用�?�件的命�??约定。这是本手册
�?�件一章中 ``BlogPost`` 模型的测试用例的例�?。与其它测试的区别在第一行，导入了 
'Blog.BlogPost' 模型。也需�?对�?�件夹具(*fixture*)使用�?缀 
``plugin.blog.blog_post``::

    App::uses('BlogPost', 'Blog.Model');

    class BlogPostTest extends CakeTestCase {

        // �?�件夹具�?于 /app/Plugin/Blog/Test/Fixture/
        public $fixtures = array('plugin.blog.blog_post');
        public $BlogPost;

        public function testSomething() {
            // ClassRegistry 让模型使用测试数�?�库连接
            $this->BlogPost = ClassRegistry::init('Blog.BlogPost');

            // 这里进行一些有用的测试
            $this->assertTrue(is_object($this->BlogPost));
        }
    }

如果想�?在 app 的测试中使用�?�件夹具，�?�以在 ``$fixtures`` 数组中使用 
``plugin.pluginName.fixtureName`` 语法�?�引用它们。

与 Jenkins 集�?
===============

`Jenkins <http://jenkins-ci.org>`_ 是�?续集�?�?务器，�?�以帮你自动化�?行测试用例。
这有助于确�?所有测试�?�?通过，应用程�?总是准备就绪的。

CakePHP 应用程�?与 Jenkins 的集�?是相当直截了当的。下�?��?�设你已�?在 \*nix 系统上
安装好了 Jenkins，并且�?�以管�?�它。你也知�?�如何创建作业(*job*)，�?行构建。如果你
对这些有任何�?确定，请�?�考 `Jenkins 文档 <http://jenkins-ci.org/>`_ 

创建作业
--------

开始先为应用程�?创建作业，连接到你的代�?仓库(*repository*)，这样 jenkins �?能
获得你的代�?。

添加测试数�?�库�?置
------------------

通常让 Jenkins 使用分开的数�?�库比较好，这样就�?�以防止连带的�?�害，�?��?一些基本的
问题。一旦在 jenkins 能够访问的数�?�库�?务器(通常为 localhost)上创建了新的数�?�库，
在构建(*build*)中添加包�?�如下代�?的 *外壳脚本步骤(shell script step)*::

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

这确�?你总有 Jenkins �?求的正确数�?�库�?置。对任何其它需�?的�?置文件�?��?�样处�?�。
�?常，更好的�?�法是，在�?次构建之�?也�?删除�?�?新创建数�?�库。这样隔�?了串�?�的失败，
�?�一个失败的构建引起其它构建失败。在构建中加入�?�一个 *外壳脚本步骤(shell script 
step)*，包�?�如下代�?::

    mysql -u jenkins -pcakephp_jenkins -e 'DROP DATABASE IF EXISTS jenkins_test; CREATE DATABASE jenkins_test';

添加测试
--------

在构建中加入�?�一个 *外壳脚本步骤(shell script step)*。在这个步骤中�?行应用程�?的
测试。创建 JUnit 日志文件或者 clover 测试覆盖(*coverage*)，通常更好，因为这为
测试结果�??供了一个�?错的图形显示::

    app/Console/cake test app AllTests \
    --stderr \
    --log-junit junit.xml \
    --coverage-clover clover.xml

如果你使用 clover 测试覆盖(*coverage*) 或者 JUnit 结果，确�?这些也在 Jenkins 中
�?置好了。如果没有�?置这些步骤，就�?能看到结果。

�?行构建
--------

现在你应当能够�?行构建了。检查控制�?�输出，并作出必�?的修改让构建通过。


.. meta::
    :title lang=zh_CN: Testing
    :keywords lang=zh_CN: web runner,phpunit,test database,database configuration,database setup,database test,public test,test framework,running one,test setup,de facto standard,pear,runners,array,databases,cakephp,php,integration
