调试
####

调试在任何开发流程中都是不可避免和必要的组成部分。尽管 CakePHP 没有提供任何工具直接
连接到任何 IDE 或者编辑器，但还是提供了一些工具来协助调试和暴露在应用程序中运行的部分。

基本的调试
==========

.. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)
    :noindex:

    :param mixed $var: 要打印的内容，可以是数组或对象类型。
    :param boolean $showHTML: 设置为 true 来启用转义。在 2.0 版本中，在提供对 web
        请求的服务时，默认会启用转义。
    :param boolean $showFrom: 显示执行 debug() 的行号和文件。

debug() 函数是一个全局函数，工作方式和 PHP 的 print_r() 函数类似。debug() 函数让你
可以用不同的方式显示变量的内容。首先，如果要让数据以适用于 HTML 的方式输出，可以设置
第二个参数为 true。默认情况下会输出调用该函数的行号和文件。

只有(在配置文件中)把核心的 debug 变量设置为大于 0 的值，该函数的输出才会显示。

.. versionchanged:: 2.1
    ``debug()`` 的输出内容和 ``var_dump()`` 很相似，在内部使用 :php:class:`Debugger`
    类。

Debugger 类
===========

Debugger 类是随着 CakePHP 1.2 引入的，提供了更多获得调试信息的手段。其中包含了一些
静态调用的、提供输出内容、日志和错误处理的函数。

Debugger 类重载了 PHP 默认的错误处理，替换为更加实用的错误报告功能。在 CakePHP 中，
默认使用 Debugger 类的错误处理。对所有的调试函数来说，``Configure::debug`` 的值必须
设置为大于 0 的值才会生效。

当一个错误发生时，Debugger 既会在页面上输出信息，并且也会将信息写入 error.log 错误
日志中。生成的错误报告会包含堆栈追踪记录和发生错误之处的代码摘要。点击 "Error" 链接，
显示堆栈跟踪，点击 "Code" 链接显示引起错误的代码行。

使用 Debugger 调试类
====================

.. php:class:: Debugger

为了使用 Debugger，首先要确保 Configure::read('debug') 设置为大于 0 的值。

.. php:staticmethod:: Debugger::dump($var, $depth = 3)

    将变量的内容全部输出，包含所有的属性和方法(如果存在任何方法)::

        $foo = array(1,2,3);

        Debugger::dump($foo);

        // 输出
        array(
            1,
            2,
            3
        )

        // 简单的对象
        $car = new Car();

        Debugger::dump($car);

        // 输出
        Car
        Car::colour = 'red'
        Car::make = 'Toyota'
        Car::model = 'Camry'
        Car::mileage = '15000'
        Car::accelerate()
        Car::decelerate()
        Car::stop()

    .. versionchanged:: 2.1
        在 2.1 及以后版本中，为提高内容的可读性，输出进行了改变，详见
        :php:func:`Debugger::exportVar()`。

    .. versionchanged:: 2.5.0
        增加了 ``depth`` 参数。

.. php:staticmethod:: Debugger::log($var, $level = 7, $depth = 3)

    创建调用时的详细堆栈追踪记录的日志。log() 方法的输出内容和 Debugger::dump()
    方法相似，但是它不是写入输出缓冲，而是写入 debug.log 日志中。注意要使 web 服务器
    对 app/tmp 目录(及其内容)可以写入，log() 方法才能正确运作。

    .. versionchanged:: 2.5.0
        增加了 ``depth`` 参数。

.. php:staticmethod:: Debugger::trace($options)

    返回当前的堆栈追踪记录，每行显示调用的方法，包含调用所在的文件及行号。 ::

        //在 PostsController::index() 中
        pr(Debugger::trace());

        //输出
        PostsController::index() - APP/Controller/DownloadsController.php, line 48
        Dispatcher::_invoke() - CORE/lib/Cake/Routing/Dispatcher.php, line 265
        Dispatcher::dispatch() - CORE/lib/Cake/Routing/Dispatcher.php, line 237
        [main] - APP/webroot/index.php, line 84

    上面的堆栈追踪记录是在控制器的动作中调用 Debugger::trace() 产生的。从下向上阅读
    堆栈追踪记录，就可以知道当前运行的函数的执行顺序。在上面的例子中，index.php 调用
    了 Dispatcher::dispatch()，它又依次调用了Dispatcher::\_invoke()，然后
    \_invoke() 方法又调用了 PostsController::index() 方法。这样的信息在处理递归操作
    或者深层堆栈的情况下很有用，因为这能够确定在调用 trace() 时有哪些函数正在运行。

.. php:staticmethod:: Debugger::excerpt($file, $line, $context)

    获得 $path (绝对路径)所指向的文件的摘要，并高亮凸显位于第 $line 行前后 $context
    行的内容。 ::

        pr(Debugger::excerpt(ROOT . DS . LIBS . 'debugger.php', 321, 2));

        //因为 $context 参数为 2，会输出 debugger.php 文件中第 319-323 行的内容
        Array
        (
            [0] => <code><span style="color: #000000"> * @access public</span></code>
            [1] => <code><span style="color: #000000"> */</span></code>
            [2] => <code><span style="color: #000000">    function excerpt($file, $line, $context = 2) {</span></code>

            [3] => <span class="code-highlight"><code><span style="color: #000000">        $data = $lines = array();</span></code></span>
            [4] => <code><span style="color: #000000">        $data = @explode("\n", file_get_contents($file));</span></code>
        )

    虽然该方法在内部使用，如果你要在特定情况下创建自己的错误消息或日志条目，也很方便。

.. php:staticmethod:: Debugger::exportVar($var, $recursion = 0)

    将任何类型的变量转换成字符串，用于调试输出。这个方法同样也主要被调试器用于内部的
    变量转换，也可以在你自己的调试器中使用。

    .. versionchanged:: 2.1
        该函数在 2.1 以上的版本中生成不同的输出。

.. php:staticmethod:: Debugger::invoke($debugger)

    用新的实例替换 CakePHP 的 Debugger。

.. php:staticmethod:: Debugger::getType($var)

    返回变量的类型，对象将返回他们的类名。

    .. versionadded:: 2.1

使用日志进行调试
================

日志消息是另一个调试应用程序的好方法，你可以使用 :php:class:`CakeLog` 在应用程序中
记录日志。所有扩展 :php:class:`Object` 的对象都有一个实例方法 `log()`，可以用来记录
日志消息::

    $this->log('Got here', 'debug');

上面的代码会把 ``Got here`` 写入 debug 日志中，你可以使用日志来帮助调试涉及重定向或
复杂循环的方法。也可以使用 :php:meth:`CakeLog::write()` 来写入日志信息。这个方法
可以在程序中任何加载了 CakeLog 类的地方以静态方式调用::

    // 在 app/Config/bootstrap.php 中
    App::uses('CakeLog', 'Log');

    // 应用程序的任何地方
    CakeLog::write('debug', 'Got here');

Debug Kit
=========

DebugKit 是一个插件，提供了一些很好的调试工具。它主要在渲染的 HTML 中提供了一个
工具栏，用来显示应用程序和当前请求的大量信息。你可以从 Github 下载
`DebugKit <https://github.com/cakephp/debug_kit>`_ 。

Xdebug
======

如果你的环境提供了 Xdebug PHP 扩展，严重错误(*fatal error*)就会显示额外的 Xdebug
堆栈追踪明细。关于 Xdebug 的详情可见 `Xdebug <http://xdebug.org>`_ 。


.. meta::
    :title lang=zh: Debugging
    :description lang=zh: Debugging CakePHP with the Debugger class, logging, basic debugging and using the DebugKit plugin.
    :keywords lang=zh: code excerpt,stack trace,default output,error link,default error,web requests,error report,debugger,arrays,different ways,excerpt from,cakephp,ide,options
