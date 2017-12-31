编码规范
########

CakePHP 开发人员将使用下面的编码规范。

我们建议其他开发Cake组成部分的人员也应当遵循同样的规范。

你可以使用
`CakePHP Code Sniffer <https://github.com/cakephp/cakephp-codesniffer>`_ 来检查你
的代码是否遵循了必要的规范。

添加新特性
==========

添加新特性，必须伴随相应的测试用例，在提交到代码仓库前，测试用例必须通过。

缩进
====

缩进使用一个制表符。

所以，缩进应当看起来象这样::

    // 底层
        // 第1层
            // 第2层
        // 第1层
    // 底层

或者::

    $booleanVariable = true;
    $stringVariable = 'moose';
    if ($booleanVariable) {
        echo '布尔值为真';
        if ($stringVariable === '驼鹿') {
            echo '我们遇到了一只驼鹿';
        }
    }

行的长度
===========

为了使代码更好的可读性，建议每行保持在大约100个字符的长度。每行不得超过120个字符。

简而言之:

* 100个字符是建议性的上限。
* 120个字符是强制性的上限。

控制结构
========

控制结构是"``if``"、"``for``"、"``foreach``"、"``while``"、"``switch``"这些。下面
是使用"``if``"的一个例子::

    if ((expr_1) || (expr_2)) {
        // action_1;
    } elseif (!(expr_3) && (expr_4)) {
        // action_2;
    } else {
        // default_action;
    }

*  在控制结构中，在第一个括号之前应该有一个空格，在最后一个括号和开始的大括号之间
   也应该有一个空格。
*  在控制结构中总是使用大括号，即使他们是不必要的。这会提高代码的可读性，也导致较
   少的逻辑错误。
*  开始的大括号应与控制结构放在同一行上。结束的大括号应该新起一行，并且与控制结构
   应该有相同的缩进级别。包括在大括号中的语句应该新起一行，其代码也应该再缩进一层。
*  在控制结构中不应该使用内嵌赋值(*inline assignment*)。

::

    // 错误 = 没有大括号，语句的位置也不对
    if (expr) statement;

    // 错误 = 没有大括号
    if (expr)
        statement;

    // 正确
    if (expr) {
        statement;
    }

    // 错误 = 内嵌赋值
    if ($variable = Class::function()) {
        statement;
    }

    // 正确
    $variable = Class::function();
    if ($variable) {
        statement;
    }

三元运算符
----------

当整个三元运算可以放在一行之内时，三元运算符是允许的。更长的三元运算就应该分成
``if else`` 语句。三元运算符绝对不允许嵌套。括号虽然不必须，但是可以用在三元运算
的条件检查之外，使其更清晰::

    //很好，简单，易读
    $variable = isset($options['variable']) ? $options['variable'] : true;

    //嵌套的三元运算不好
    $variable = isset($options['variable']) ? isset($options['othervar']) ? true : false : false;

视图文件
--------

在视图文件(.ctp files)中，开发人员使用关键词控制结构。关键词控制结构在复杂的视图
文件中更容易阅读。控制结构可以放在一段大的 PHP 代码段落中，也可以放在单独的 PHP
标签中::

    <?php
    if ($isAdmin):
        echo '<p>You are the admin user.</p>';
    endif;
    ?>
    <p>下面也是可以接受的:</p>
    <?php if ($isAdmin): ?>
        <p>You are the admin user.</p>
    <?php endif; ?>

比较
==========

总是尽可能的严格。如果特意要使用一个不严格的比较，也许应当注释说明是这样，以免
混淆为错误。

要测试一个变量是否为空，建议使用严格检查::

    if ($value === null) {
          // ...
    }

要检查的值应该放在右边::

    // 不建议使用
    if (null === $this->foo()) {
        // ...
    }

    // 推荐使用
    if ($this->foo() === null) {
        // ...
    }

函数调用
========

在函数调用中，函数名和开始的括号之间不允许有空格，在每个参数之间应当有一个空格::

    $var = foo($bar, $bar2, $bar3);

如上所示，在等号(=)的两边都应该有一个空格。

方法的定义
==========

方法定义的例子::

    function someFunction($arg1, $arg2 = '')
    {
        if (expr) {
            statement;
        }
        return $var;
    }

带缺省值的参数应该放在函数定义的最后。尽量让你的函数返回一些东西, 至少是
``true`` 或者 ``false`` ，这样就可以判断函数调用是否成功::

    public function connection($dns, $persistent = false)
    {
        if (is_array($dns)) {
            $dnsInfo = $dns;
        } else {
            $dnsInfo = BD::parseDNS($dns);
        }

        if (!($dnsInfo) || !($dnsInfo['phpType'])) {
            return $this->addError();
        }
        return true;
    }

等号两边都有空格。

类型约束
-----------

接受对象或者数组的参数可以使用类型约束::

    /**
     * 方法描述。
     *
     * @param Model $Model 使用的模型。
     * @param array $array 数组值。
     * @param bool $boolean 布尔值。
     */
    public function foo(Model $Model, array $array, $boolean)
    {
    }

这里 ``$Model`` 必须是 ``Model`` 的实例，``$array`` 必须是数组(``array``)。

注意，如果你要允许 ``$array`` 也可以是 ``ArrayObject`` 的实例，你就不能用类型约束，
因为 ``array`` 只接受基本类型::

    /**
     * 方法描述。
     *
     * @param array|ArrayObject $array 数组值。
     */
    public function foo($array)
    {
    }

方法链接(*Method Chaining*)
===========================

方法链接时, 多个方法应当在各自的行上, 并且缩进一个制表符::

    $email->from('foo@example.com')
        ->to('bar@example.com')
        ->subject('A great message')
        ->send();

代码的注释
==========

所有的注释都应该是英文, 并且应该清楚地描述被注释的代码段。

注释可以包括以下`phpDocumentor <http://phpdoc.org>`_标签:

*  `@author <http://phpdoc.org/docs/latest/references/phpdoc/tags/author.html>`_
*  `@copyright <http://phpdoc.org/docs/latest/references/phpdoc/tags/copyright.html>`_
*  `@deprecated <http://phpdoc.org/docs/latest/references/phpdoc/tags/deprecated.html>`_
   使用格式 ``@version <vector> <description>`` ，其中 ``version``和``description``
   是必须的。
*  `@example <http://phpdoc.org/docs/latest/references/phpdoc/tags/example.html>`_
*  `@ignore <http://phpdoc.org/docs/latest/references/phpdoc/tags/ignore.html>`_
*  `@internal <http://phpdoc.org/docs/latest/references/phpdoc/tags/internal.html>`_
*  `@link <http://phpdoc.org/docs/latest/references/phpdoc/tags/link.html>`_
*  `@see <http://phpdoc.org/docs/latest/references/phpdoc/tags/see.html>`_
*  `@since <http://phpdoc.org/docs/latest/references/phpdoc/tags/since.html>`_
*  `@version <http://phpdoc.org/docs/latest/references/phpdoc/tags/version.html>`_

PhpDoc 标签非常类似于 Java 中的 JavaDoc 标签。标签只有出现在文档块(*DocBlock*)行
的开头才会起作用, 例如::

    /**
     * Tag example.
     *
     * @author 这个标签会被处理, 但这个@version会被忽略
     * @version 1.0 这个标签也会被处理
     */

::

    /**
     * 内嵌 phpDoc 的例子。
     *
     * 这个函数致力于与 foo() 联手统治世界。
     *
     * @return void
     */
    function bar()
    {
    }

    /**
     * Foo 函数.
     *
     * @return void
     */
    function foo()
    {
    }

所有注释段, 除了一个文件中的第一段, 之前总是应当有一个空行。

变量类型
--------

文档块(*DocBlock*)中使用的变量类型:

类型
    描述
mixed
    有未定义(或多种)类型的变量。
int
    整数类型变量(整数)。
float
    浮点数类型(浮点数)。
bool
    逻辑类型(true或者false)。
string
    字符串类型(位于" "或' '中的任何值)。
null
    空类型。通常与另一种类型一起使用。
array
    数组类型。
object
    对象类型。 如果可能应该使用更明确的类名。
resource
    资源类型(例如由mysql\_connect()返回的)。
    记住, 如果你指定了混合类型, 则需指明是未知, 或者可以是哪些类型。
callable
    可调用的函数。

你也可以用竖线(*pipe char*)组合多个类型::

    int|bool

对两种以上的类型，通常最好使用 ``mixed`` 。

当返回对象本身时，例如为了实现链式方法，应当使用 ``$this`` ::

    /**
     * Foo function.
     *
     * @return $this
     */
    public function foo()
    {
        return $this;

包括文件
========

``include`` 、 ``require`` 、 ``include_once`` 和 ``require_once`` 没有括号::

    // 错误 = 括号
    require_once('ClassFileName.php');
    require_once ($class);

    // 正确 = 没有括号
    require_once 'ClassFileName.php';
    require_once $class;

当包括类或者库的文件时, 总是只使用
`require\_once <http://php.net/require_once>`_ 函数。

PHP 标签
========

总是使用长标签(``<?php ?>``), 而不用短标签(``<? ?>``)。

命名规则
========

函数
----

所有函数名都应为 camelBack 形式::

    function longFunctionName()
    {
    }

类
--

类名应为驼峰命名法(*CamelCase*), 例如::

    class ExampleClass
    {
    }

变量
----

变量名应当尽可能具有描述性, 但同时越短越好。普通变量应当以小写字母开头，如果含
有多个词, 则应当为 camelBack 形式。引用对象变量的变量名应当以大写字母开头，并且
与对象所属的类应当以某种方式相关联。例如::

    $user = 'John';
    $users = array('John', 'Hans', 'Arne');

    $Dispatcher = new Dispatcher();

成员的可见范围
--------------

方法和变量应当使用 PHP5 的 private 和 protected 关键字。另外，protected 的方法和
变量应当以一个下划线开头(``_``)。例如::

    class A
    {
        protected $_iAmAProtectedVariable;

        protected function _iAmAProtectedMethod()
        {
           /*...*/
        }
    }

私有方法和变量应当以双下划线(``__``)开���。例如::

    class A
    {
        private $__iAmAPrivateVariable;

        private function __iAmAPrivateMethod()
        {
            /*...*/
        }
    }

不过，尽可能避免私有方法或者变量，而使用保护(protected)的(方法或者变量)。后者可以
被子类访问或者改变，而私有的(方法或者变量)阻止了扩展或重用。私有也使测试更加困难。

示例地址
--------

所有示例用的网址和电子邮箱地址应当使用"example.com"、"example.org"和"example.net"，
例如:

*  电子邮箱地址: someone@example.com
*  网址: `http://www.example.com <http://www.example.com>`_
*  FTP: `ftp://ftp.example.com <ftp://ftp.example.com>`_

"example.com" 域名已为此目的而保留(参见 :rfc:`2606` )，建议在文档中或者作为例子使
用。

文件
----

不包含类的文件，其文件名应当小写，并且以下划线分隔单词，例如::

    long_file_name.php

强制转换(Casting)
-----------------

做强制转换，我们使用:

类型
    描述
(bool)
        强制转换成布尔类型。
(int)
        强制转换成整数类型。
(float)
        强制转换成浮点类型。
(string)
        强制转换成字符串类型。
(array)
        强制转换成数组类型。
(object)
        强制转换成对象类型。

在适用时，请使用 ``(int)$var``，而不是 ``intval($var)``，使用 ``(float)$var``，而
不是 ``floatval($var)``。

常量
----

常量名称应当大写::

    define('CONSTANT', 1);

如果常量名称由多个单词组成的，则应当用下划线分隔，例如::

    define('LONG_NAMED_CONSTANT', 2);

.. meta::
    :title lang=zh: Coding Standards
    :keywords lang=zh: curly brackets,indentation level,logical errors,control structures,control structure,expr,coding standards,parenthesis,foreach,readability,moose,new features,repository,developers
