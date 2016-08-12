异常
####

异常在应用程序中可以用作不同的用途。CakePHP 在内部使用异常来表示逻辑错误或用法
错误。所有 CakePHP 抛出的异常都扩展了 :php:exc:`CakeException`，类/任务相关的
异常扩展了这个基类。

CakePHP 也提供了一些异常类，可用于 HTTP 错误。欲知更多信息，可参看 
:ref:`built-in-exceptions` 一节。

异常的配置
==========

有一些键可用于配置异常::

    Configure::write('Exception', array(
        'handler' => 'ErrorHandler::handleException',
        'renderer' => 'ExceptionRenderer',
        'log' => true
    ));

* ``handler`` - callback - 处理异常的回调函数。可以设置它为任何回调类型，包括
  匿名函数。
* ``renderer`` - string - 负责渲染未捕获异常的类。如果选择自定义类，应当把这个类
  的文件放入 app/Lib/Error 目录中。这个类需要实现 ``render()`` 方法。
* ``log`` - boolean - 为 true 时，异常 + 它们的堆栈跟踪会被记录到 CakeLog 中。
* ``consoleHandler`` - callback - 在控制台的环境中，用来处理异常的回调函数。如果
  没有定义，就会使用 CakePHP 默认的处理器。

异常的渲染在默认情况下会显示一个 HTML 页面，你可以通过改变设置来自定义处理器或者
渲染器。改变处理器，让你可以完全控制异常的处理过程，而改变渲染器让你容易地改变
输出类型和内容，以及加进应用程序相关的异常处理。

.. versionadded:: 2.2
    在 2.2 版本中加入了 ``Exception.consoleHandler`` 选项。

Exception 类
============

CakePHP 中有一些异常类。每个异常取代了过去的一个 ``cakeError()`` 错误消息。异常
提供了更多的灵活性，因为它们可以扩展，也可以包含一些逻辑。内置的异常处理会捕获
任何未捕获的异常，渲染一个有所帮助的页面。没有特意使用 400 范围的代码的异常，会
被当作内部服务器错误(*Internal Server Error*)。

.. _built-in-exceptions:

CakePHP 的内置异常
==================

在 CakePHP 中，除了框架内部的异常，有一些内置的异常，有几个专门针对 HTTP 方法
(*method*)的异常

.. php:exception:: BadRequestException

    用于处理 400 错误的请求(*Bad Request*)错误。

.. php:exception:: UnauthorizedException

    用于处理 401 未授权(*Unauthorized*)错误。

.. php:exception:: ForbiddenException

    用于处理 403 禁止访问(*Forbidden*)错误。

.. php:exception:: NotFoundException

    用于处理 404 未找到(*Not found*)错误。

.. php:exception:: MethodNotAllowedException

    用于处理 405 方法不被允许(*Method Not Allowed*)错误。

.. php:exception:: InternalErrorException

    用于处理 500 内部服务器错误(*Internal Server Error*)。

.. php:exception:: NotImplementedException

    用于处理 501 未实现(*Not Implemented*)错误。

你可以从控制器抛出这些异常，表示错误状态或 HTTP 错误。使用 HTTP 异常的一个例子
可以是，对未找到的数据渲染 404 页面::

    public function view($id) {
        $post = $this->Post->findById($id);
        if (!$post) {
            throw new NotFoundException('Could not find that post');
        }
        $this->set('post', $post);
    }

通过对 HTTP 错误使用异常，你可以在保持代码整洁的同时，对客户端应用程序和用户提供
RESTful 响应。

另外，还有以下框架层的异常，会从 CakePHP 的一些核心组件抛出：

.. php:exception:: MissingViewException

    无法找到选中的视图(*view*)文件。

.. php:exception:: MissingLayoutException

    无法找到选中的布局(*layout*)。

.. php:exception:: MissingHelperException

    无法找到助件(*helper*)。

.. php:exception:: MissingBehaviorException

    无法找到配置的行为(*behavior*)。

.. php:exception:: MissingComponentException

    无法找到配置的组件(*component*)。

.. php:exception:: MissingTaskException

    无法找到配置的任务。

.. php:exception:: MissingShellException

    无法找到外壳类(*shelll class*)。

.. php:exception:: MissingShellMethodException

    选中的外壳类(*shelll class*)没有该命名的方法。

.. php:exception:: MissingDatabaseException

    无法找到配置的数据库。

.. php:exception:: MissingConnectionException

    模型的连接缺失。

.. php:exception:: MissingTableException

    模型的表无法在 CakePHP 的缓存或数据源中找到。在向数据源添加一个新表之后，
    模型缓存(默认在 tmp/cache/models 目录中)必须清除。


.. php:exception:: MissingActionException

    无法找到请求的控制器动作。

.. php:exception:: MissingControllerException

    无法找到请求的控制器。

.. php:exception:: PrivateActionException

    访问私有动作。或者是试图访问 private/protected/前缀为 _ 的动作，或者是试图
    不正确地访问前缀路由。

.. php:exception:: CakeException

    CakePHP 的异常基类。CakePHP 抛出的所有框架层基类都要扩展这个类。

这些异常类都扩展 :php:exc:`CakeException`。通过扩展 CakeException，你可以创建
自己的'框架'错误。CakePHP 会抛出的所有标准异常都扩展了 CakeException。

.. versionadded:: 2.3
    添加了 CakeBaseException。

.. php:exception:: CakeBaseException

    CakePHP 的异常基类。
    所有上面的 CakeExceptions 和 HttpException 扩展这个类。

.. php:method:: responseHeader($header = null, $value = null)

    参看 :php:func:`CakeResponse::header()`。

所有 Http 和 CakePHP 异常扩展 CakeBaseException 类，该类有一个方法添加头部信息到
响应。例如在抛出 405 MethodNotAllowedException 时，rfc2616 指出：
"响应必须包括一个 Allow 头部信息，包含一个对请求的资源的合法方法的列表。"

在控制器中使用 HTTP 异常
========================

你可以从控制器动作中抛出任何 HTTP 相关的异常来表示错误状态。例如::

    public function view($id) {
        $post = $this->Post->findById($id);
        if (!$post) {
            throw new NotFoundException();
        }
        $this->set(compact('post'));
    }

上述代码会使配置的 ``Exception.handler`` 捕获和处理 :php:exc:`NotFoundException`。
默认情况下，这会导致一个错误页面，并记录该异常。

.. _error-views:

异常的渲染器
============

.. php:class:: ExceptionRenderer(Exception $exception)

在 ``CakeErrorController`` 的协助下，ExceptionRenderer 类负责为所有应用程序抛出
的异常渲染错误页面。

错误页面的视图在 ``app/View/Errors/`` 目录中。对所有 4xx 和 5xx 错误，分别使用
视图文件 ``error400.ctp`` 和 ``error500.ctp``。你可以根据需要定制这些视图。默认
情况下，错误页面也使用布局 ``app/Layouts/default.ctp``。如果想要对错误页面使用
另一个布局，例如 ``app/Layouts/my_error.ctp``，那么只需编辑错误视图，添加语句 
``$this->layout = 'my_error';`` 到 ``error400.ctp`` 和 ``error500.ctp``。

每个框架层异常都有自己位于核心模板中的视图文件，但你真的不必定制它们，因为它们只
在开发过程中使用。在关闭调试后，所有框架层异常都会转变为 
``InternalErrorException``。

.. index:: application exceptions

创建你自己的应用程序的异常
==========================

你可以使用任何内置的 
`SPL exceptions <http://php.net/manual/en/spl.exceptions.php>`_ 、 ``Exception``
本身或 :php:exc:`CakeException` 来创建你自己的应用程序的异常。扩展 Exception 类
或者 SPL 异常的应用程序异常在生产模式下会被当作 500 错误对待。
:php:exc:`CakeException` 比较特别，所有 :php:exc:`CakeException`  对象会根据它们
使用的编码被强制转换为 500 或 404 错误。在开发模式下，:php:exc:`CakeException` 
对象只需新增一个匹配类名的新模板就能提供有用的信息。如果应用程序包含如下异常::

    class MissingWidgetException extends CakeException {};

你可以创建 ``app/View/Errors/missing_widget.ctp``，就能提供良好的开发错误提示。
在生产模式下，上述错误会被当作 500 错误。:php:exc:`CakeException` 的构造函数被
扩展了，让你可以传入数据数组。该数组会被嵌入 messageTemplate 模板、以及在开发
模式下表示错误的视图中。这让你可以通过为错误提供更多的上下文，来创建富含数据的
异常。你也可以提供消息模板，让原生的 ``__toString()`` 方法可以正常工作::



    class MissingWidgetException extends CakeException {
        protected $_messageTemplate = 'Seems that %s is missing.';
    }

    throw new MissingWidgetException(array('widget' => 'Pointy'));


当被内置的异常处理器捕获时，在错误视图模板中会得到一个 ``$widget`` 变量。而且，
如果把异常转换(*cast*)为字符串，或者调用它的 ``getMessage()`` 方法，就会得到 
``Seems that Pointy is missing.``。这让你可以轻松快速地创建你自己富含(信息)的
开发错误，就像 CakePHP 内部使用的一样。

创建自定义状态编码
------------------

在创建异常时改变编码，就能创建自定义的 HTTP 状态编码::

    throw new MissingWidgetHelperException('Its not here', 501);

就会创建一个 ``501`` 响应编码，你可以使用任何 HTTP 状态编码。在开发中，如果你的
异常没有一个特定的模板，而你使用了大于等于 ``500`` 的编码，你就会看到 
``error500`` 模板。对于任何其它错误编码，就会得到 ``error400`` 模板。如果你为
自定义异常定义了错误模板，在开发模式下就会使用该模板。如果你甚至在生产环境中也要
使用自己的异常处理逻辑，请看下一节。

扩展和实现你自己的异常处理器
============================

你有几种方式实现应用程序相关的异常处理。每种方式给你提供对异常处理过程的不同控制。

- 设置 ``Configure::write('Exception.handler', 'YourClass::yourMethod');``
- 创建 ``AppController::appError();``
- 设置 ``Configure::write('Exception.renderer', 'YourClass');``

在下面几节中，我们会详细描述每种方式不同的方法和好处。

用 `Exception.handler` 创建你自己的异常处理器
=============================================

创建你自己的异常处理器，给你提供了对异常处理过程的完全控制。你选择的类应当在 
``app/Config/bootstrap.php`` 文件中加载，这样它才能够用于处理任何异常。你可以把
处理器定义为任何回调类型。设置了 ``Exception.handler``，CakePHP 就会忽略所有其它
的异常设置。下面就是一个自定义异常处理设置的例子::

    // in app/Config/core.php
    Configure::write('Exception.handler', 'AppExceptionHandler::handle');

    // in app/Config/bootstrap.php
    App::uses('AppExceptionHandler', 'Lib');

    // in app/Lib/AppExceptionHandler.php
    class AppExceptionHandler {
        public static function handle($error) {
            echo 'Oh noes! ' . $error->getMessage();
            // ...
        }
        // ...
    }

你可以在 ``handleException`` 方法中运行任何你想要运行的代码。上面的代码会输出 
'Oh noes! ' 加上异常消息。你可以定义处理器为任何类型的回调，如果使用 PHP 5.3 
甚至可以是匿名函数::

    Configure::write('Exception.handler', function ($error) {
        echo 'Ruh roh ' . $error->getMessage();
    });

通过创建自定义异常处理器，你可以为应用程序的异常提供自定义错误处理。在提供作为
异常处理器的方法中，你可以这么做::

    // in app/Lib/AppErrorHandler.php
    class AppErrorHandler {
        public static function handleException($error) {
            if ($error instanceof MissingWidgetException) {
                return self::handleMissingWidget($error);
            }
            // 做其它事情。
        }
    }

.. index:: appError

使用 AppController::appError()
==============================

实现该方法是实现自定义异常处理器的另一种方法。这主要是为向后兼容而提供的，新的
应用程序不建议使用。会调用这个控制器方法，而不会调用默认的异常渲染过程。这只接受
抛出的异常作为其唯一的参数。应当在这个方法中实现错误处理::

    class AppController extends Controller {
        public function appError($error) {
            // 这里是自定义逻辑。
        }
    }

在 Exception.renderer 使用自定义渲染器来处理应用程序异常
========================================================

如果你不想控制异常处理，但要改变如何渲染异常，你可以用 ``Configure::write(
'Exception.renderer', 'AppExceptionRenderer');`` 选择一个类来渲染异常页面。默认
情况下会使用 :php:class`ExceptionRenderer`。你的自定义异常渲染类应当放在 
``app/Lib/Error`` 目录中，或者在一个启动加载的 Lib 路径内的 ``Error`` 目录内。
在自定义异常渲染类中，你可以为应用程序相关的错误提供特殊的处理::

    // in app/Lib/Error/AppExceptionRenderer.php
    App::uses('ExceptionRenderer', 'Error');

    class AppExceptionRenderer extends ExceptionRenderer {
        public function missingWidget($error) {
            echo 'Oops that widget is missing!';
        }
    }


上述代码会处理任何 ``MissingWidgetException`` 类型的异常，让你可以为这些应用程序
异常提供自定义的显示/处理逻辑。异常处理方法接受被处理的异常为它们的参数。

.. note::

    你的自定义渲染器在构造函数中期待一个异常，并要实现 render 方法。不这么做会引起额外的错误。

.. note::

    如果你使用自定义 ``Exception.handler``，该设置就会无效，除非在你的实现中引用它。

创建自定义控制器来处理异常
--------------------------

在你的 ExceptionRenderer 子类中，你可以用 ``_getController`` 方法来返回自定义
控制器来处理错误。默认情况下，CakePHP 使用 ``CakeErrorController``，这会省略一些
正常的回调，以帮助确保总能显示错误。不过，你可能在应用程序中需要一个更加定制化的
错误处理控制器。在你的 ``AppExceptionRenderer`` 类中实现 ``_getController`` 方法，
你就能使用任何你想用的控制器::

    class AppExceptionRenderer extends ExceptionRenderer {
        protected function _getController($exception) {
            App::uses('SuperCustomError', 'Controller');
            return new SuperCustomErrorController();
        }
    }

或者，你可以在 ``app/Controller`` 目录中引入核心的 CakeErrorController，来重载它。
如果你使用自定义控制器来进行错误处理，确保在构造函数或 render 方法中进行了所有
需要的设置，因为这些是内置的 ``ErrorHandler`` 类唯一直接调用的方法。


在日志中记录异常
------------------

用内置的异常处理，你只要在 core.php 文件中设置 ``Exception.log`` 为 true，就可以
在日志中记录所有由 ErrorHandler 处理的异常。启用之后，就会把每个异常记录到 
:php:class:`CakeLog` 和配置的日志中。

.. note::

    如果你使用自定义的 ``Exception.handler``，这个设置就不起作用，除非在你的实现
    中引用它。


.. meta::
    :title lang=zh: Exceptions
    :keywords lang=zh: uncaught exceptions,stack traces,logic errors,anonymous functions,renderer,html page,error messages,flexibility,lib,array,cakephp,php
