请求与响应对象
##############

请求与响应对象是在 CakePHP 2.0 新增的。在之前的版本中，这两个对象由数组表示，相关
的方法是分散在 :php:class:`RequestHandlerComponent`、:php:class:`Router`、
:php:class:`Dispatcher` 和 :php:class:`Controller` 中。之前并没有专门的对象负责请
求的相关信息。在 2.0 版本中，:php:class:`CakeRequest` 和 
:php:class:`CakeResponse` 用于这个目的。

.. index:: $this->request
.. _cake-request:

CakeRequest
###########

:php:class:`CakeRequest` 是 CakePHP 中默认的请求对象。它集合许多功能，用来查询请
求数据以及与请求数据交互。对于每个请求，将创建一个 :php:class:`CakeRequest` 实例，
然后通过引用的方式，传递给应用程序中使用请求数据的各层。默认情况下，
:php:class:`CakeRequest` 赋值给 ``$this->request``，在控制器，视图和助件中都可以
使用。在组件中，也可以通过控制器引用来访问。:php:class:`CakeRequest` 履行的一些
职责包括:

* 处理 GET，POST 和 FILES 数组，并放入你所熟悉的数据结构中。
* 提供与请求相关的环境信息。比如，传送的头部信息，客户端 IP 地址，以及应用程序在
  服务器上运行的域/子域的信息。
* 提供数组索引和对象属性两种方式，来访问请求参数。

获取请求参数
============

:php:class:`CakeRequest` 提供了几种方式获取请求参数。第一种是对象属性，第二种是
数组索引，第三种是通过 ``$this->request->params``::

    $this->request->controller;
    $this->request['controller'];
    $this->request->params['controller'];

上面这些都可以得到相同的值。提供多种获取参数的方式是为了便于现有应用程序的移植。
所有的 :ref:`路由元素 <route-elements>` 都可以通过这些方式得到。

除了 :ref:`路由元素 <route-elements>`，也经常需要获取 
:ref:`传入参数 <passed-arguments>` 和 :ref:`命名参数 <named-parameters>`。这些也
可以通过请求对象获得::

    // 传入参数
    $this->request->pass;
    $this->request['pass'];
    $this->request->params['pass'];

    // 命名参数
    $this->request->named;
    $this->request['named'];
    $this->request->params['named'];

以上这些都可以得到传入参数和命名参数。还有一些在 CakePHP 内部使用重要/有用的参数，
也可以在请求参数中找到:

* ``plugin`` 处理请求的插件，没有插件时为 null。
* ``controller`` 处理当前请求的控制器。
* ``action`` 处理当前请求的动作。
* ``prefix`` 当前动作的前缀。欲知更多信息，请参见
  :ref:`前缀路由 <prefix-routing>`。
* ``bare`` 当请求来自于 :php:meth:`~Controller::requestAction()` ，并且包括 bare
  选项时就会出现。Bare 请求不会渲染布局(*layout*)。
* ``requested`` 当请求来自 :php:meth:`~Controller::requestAction()` 时出现，并被
  设置为 true。


获取查询字符串参数
==================

查询字符串(*Querystring*)参数可以用 :php:attr:`CakeRequest::$query` 读取::

    // 网址为 /posts/index?page=1&sort=title
    $this->request->query['page'];

    // 也可以通过数组方式获取
    // 注意：向后兼容访问器，在以后的版本中会被废弃
    $this->request['url']['page'];

可以直接访问 :php:attr:`~CakeRequest::$query` 属性，或者可以用 
:php:meth:`CakeRequest::query()` 以不会报错的方式读取网址查询数组。任何不存在的键
都会返回 ``null``::

    $foo = $this->request->query('value_that_does_not_exist');
    // $foo === null

获取 POST 数据
==============

所有的 POST 数据都可以用 :php:attr:`CakeRequest::$data` 得到。任何包含 ``data`` 
前缀的表单数据，都会把 data 前缀去掉。例如::

    // 一项 name 属性为 'data[MyModel][title]' 的表单数据，可用下面的方式获得
    $this->request->data['MyModel']['title'];

也可以直接访问 :php:attr:`~CakeRequest::$data` 属性，或者使用 
:php:meth:`CakeRequest::data()` 以不会报错的方式来读取 data 数组。任何不存在的键
都会返回 ``null``::

    $foo = $this->request->data('Value.that.does.not.exist');
    // $foo == null

获取 PUT 或者 POST 数据
=======================

.. versionadded:: 2.2

当构建 REST 服务时，会经常接受以 ``PUT`` 和 ``DELETE`` 请求方式提交的数据。自从
2.2 版本开始，对 ``PUT`` 和 ``DELETE`` 请求，任何 
``application/x-www-form-urlencoded`` 请求体(*request body*)中的数据会被自动解析
并设置为 ``$this->data``。如果接受的是 JSON 或 XML 数据，下面会解释如何访问这些
请求体(*request body*)。

访问 XML 或 JSON 数据
=====================

采用 :doc:`/development/rest` 的应用程序经常以非网址编码(non-URL-encoded)的 
post 文件体(*body*)的方式交换数据。这时可以用 :php:meth:`CakeRequest::input()` 
读取任何格式的输入数据。通过提供一个解码函数，得到反序列化之后的内容::

    // 获得提交给 PUT/POST 动作以 JSON 编码的数据
    $data = $this->request->input('json_decode');

鉴于某些反序列化方法在调用的时候要求额外的参数，例如 ``json_decode`` 方法的 
'as array' 参数。如果要把 XML 转换成 DOMDocument 对象，
:php:meth:`CakeRequest::input()` 也支持传入额外的参数::

    // 获得提交给 PUT/POST 动作的 Xml 编码的数据
    $data = $this->request->input('Xml::build', array('return' => 'domdocument'));

获取路径信息
============

:php:class:`CakeRequest` 也提供与应用程序中路径相关的有用信息。
:php:attr:`CakeRequest::$base` 和 :php:attr:`CakeRequest::$webroot` 可用于生成网
址，以及判断你的应用程序是否在某个子目录中。

.. _check-the-request:

检测请求
======================

判断各种请求条件，过去需要用到 :php:class:`RequestHandlerComponent`。现在这些方
法被移到了 :php:class:`CakeRequest` 中，在保持向后兼容用法的同时，提供了新的接口
::

    $this->request->is('post');
    $this->request->isPost(); // 已废弃

两种方法调用都会返回相同的值。暂时这些方法仍然在 
:php:class:`RequestHandlerComponent` 中可以使用，但已经被废弃，并会在3.0.0版本中
被去掉。通过使用 :php:meth:`CakeRequest::addDetector()` 创建新的检测器
(*detectors*)，可以很容易地扩展现有的请求检测。可以创建四种不同种类的检测器:

* 环境值比较 —— 比较从 :php:func:`env()` 取得的值与给定值是否相等。
* 模式值比较 —— 模式值比较可以把从 :php:func:`env()` 取得的值和正则表达式进行
  比较。
* 基于选项的比较 —— 基于选项的比较使用一组选项来创建一个正则表达式。之后再添加
  已定义的选项检测器就会合并选项。
* 回调检测器 —— 回调检测器可以提供一个 'callback' 类型来进行检查。这个回调函数
  只接受请求对象作为唯一的参数。

下面是一些例子::

    // 添加一个环境检测器。
    $this->request->addDetector(
        'post',
        array('env' => 'REQUEST_METHOD', 'value' => 'POST')
    );

    // 添加一个模式值检测器。
    $this->request->addDetector(
        'iphone',
        array('env' => 'HTTP_USER_AGENT', 'pattern' => '/iPhone/i')
    );

    // 添加一个选项检测器。
    $this->request->addDetector('internalIp', array(
        'env' => 'CLIENT_IP',
        'options' => array('192.168.0.101', '192.168.0.100')
    ));

    // 添加一个回调检测器。可以是一个匿名函数，或者是一个常规的回调函数。
    $this->request->addDetector(
        'awesome',
        array('callback' => function ($request) {
            return isset($request->awesome);
        })
    );

:php:class:`CakeRequest` 还包含类似 :php:meth:`CakeRequest::domain()`、
:php:meth:`CakeRequest::subdomains()` 和 :php:meth:`CakeRequest::host()` 的方法，
可以让有子域的应用程序更容易处理。

以下是几个内置的检测器:

* ``is('get')`` 检查当前请求是否是 GET。
* ``is('put')`` 检查当前请求是否是 PUT。
* ``is('post')`` 检查当前请求是否是 POST。
* ``is('delete')`` 检查当前请求是否是 DELETE。
* ``is('head')`` 检查当前请求是否是 HEAD。
* ``is('options')`` 检查当前请求是否是 OPTIONS。
* ``is('ajax')`` 检查当前请求是否带有 X-Requested-with = XmlHttpRequest。
* ``is('ssl')`` 检查当前请求是否通过 SSL。
* ``is('flash')`` 检查当前请求是否带有 Flash 的用户代理(*User-Agent*)。
* ``is('mobile')`` 检查当前请求是否来自常见移动代理列表。


CakeRequest 和 RequestHandlerComponent
======================================

由于 :php:class:`CakeRequest` 提供的许多特性以前是 
:php:class:`RequestHandlerComponent` 的职责，需要重新思考才能明白它(后者)如何才
能继续融洽地存在于整个架构中。对 2.0 版本来说，
:php:class:`RequestHandlerComponent` 在 :php:class:`CakeRequest` 提供的工具之上
提供了一层语法糖，比如根据内容的类型来切换布局和视图。在这两个类中这种工具和语法
糖的划分，让你更容易地按照需要选择。

与请求的其他方面交互
====================

你可以用 :php:class:`CakeRequest` 查看(*introspect*)关于请求的各种信息。除了检测
器，还可以使用各种属性和方法查看其它信息。

* ``$this->request->webroot`` 包含 webroot 目录。
* ``$this->request->base`` 包含 base 路径。
* ``$this->request->here`` 包含当前请求的完整地址。
* ``$this->request->query`` 含有查询字符串(*query string*)参数。


CakeRequest API
===============

.. php:class:: CakeRequest

    CakeRequest 封装了请求参数的处理和查询(*introspection*)。

.. php:method:: domain($tldLength = 1)

    返回应用程序运行的域名。

.. php:method:: subdomains($tldLength = 1)

    以数组的形式返回应用程序运行的子域名。

.. php:method:: host()

    返回应用程序所在的主机名。

.. php:method:: method()

    返回请求所用的 HTTP 方法。

.. php:method:: onlyAllow($methods)

    设置允许的 HTTP 方法，如果不符合就会导致 MethodNotAllowedException。405 响应
    会包括必要的 ``Allow`` 头部信息(*header*)及传入的 HTTP 方法。

    .. versionadded:: 2.3

    .. deprecated:: 2.5
        不要再使用，而是使用 :php:meth:`CakeRequest::allowMethod()`。

.. php:method:: allowMethod($methods)

    设置允许的 HTTP 方法，如果不符合就会导致 MethodNotAllowedException。405 响应
    会包括必要的 ``Allow`` 头部信息(*header*)及传入的 HTTP 方法。

    .. versionadded:: 2.5

.. php:method:: referer($local = false)

    返回请求的引用网址(*referring address*)。

.. php:method:: clientIp($safe = true)

    返回当前访问者的 IP 地址。

.. php:method:: header($name)

    让你获得请求使用的任何 ``HTTP_*`` 头部信息(*header*)::

        $this->request->header('User-Agent');

    会返回当前请求使用的用户代理。

.. php:method:: input($callback, [$options])

    获取请求的输入数据，并可选择使其通过一个解码函数。可有助于与 XML 或 JSON 请
    求体(*request body*)内容交互。给解码函数的其它参数可以作为 input() 的参数传
    入::

        $this->request->input('json_decode');

.. php:method:: data($name)

    提供对象属性(*dot notation*)的表示方法来访问请求数据。可以用来读取和修改请求
    数据，方法调用也可以链接起来::

        // 修改一些请求数据，从而可以放到一些表单字段里面。
        $this->request->data('Post.title', 'New post')
            ->data('Comment.1.author', 'Mark');

        // 也可以读出数据。
        $value = $this->request->data('Post.title');

.. php:method:: query($name)

    提供对象属性(*dot notation*)的表示方法来访问网址查询数据::

        // 网址是 /posts/index?page=1&sort=title
        $value = $this->request->query('page');

    .. versionadded:: 2.3

.. php:method:: is($type)

    检查请求是否符合某种条件。使用内置检测规则，以及任何用 
    :php:meth:`CakeRequest::addDetector()` 方法定义的其它规则。

.. php:method:: addDetector($name, $options)

    添加检测器，供 :php:meth:`CakeRequest::is()` 方法使用。欲知详情请见 
    :ref:`check-the-request`。

.. php:method:: accepts($type = null)

    找出客户端接受哪些种类的内容类型(*content type*)，或者检查客户端是否接受某种
    类型的内容。

    获得所有类型::

        $this->request->accepts();

    检查一种类型::

        $this->request->accepts('application/json');

.. php:staticmethod:: acceptLanguage($language = null)

    或者获取客户端接受的所有语言，或者检查是否接受某种语言。

    获得接受的语言列表::

        CakeRequest::acceptLanguage();

    检查是否接受某种语言::

        CakeRequest::acceptLanguage('es-es');

.. php:method:: param($name)

    安全地读取 ``$request->params`` 中的值。这免去了在使用参数值之前要调用 
    ``isset()`` 或 ``empty()`` 的麻烦。

    .. versionadded:: 2.4


.. php:attr:: data

    POST 数据的数组。你可以用 :php:meth:`CakeRequest::data()` 来读取该属性，而又
    抑制错误通知。

.. php:attr:: query

    查询字符串(*query string*)参数数组。

.. php:attr:: params

    包含路由元素和请求参数的数组。

.. php:attr:: here

    返回当前请求的网址。

.. php:attr:: base

    应用程序的 base 路径，通常是 ``/``，除非应用程序是在一个子目录内。

.. php:attr:: webroot

    当前的 webroot。

.. index:: $this->response

CakeResponse
############

:php:class:`CakeResponse` 是 CakePHP 的默认响应类。它封装了一系列特性和功能，来
为应用程序生成 HTTP 响应。它也可以有助于测试，鉴于它能被模拟/替换
(*mocked/stubbed*)，从而让你可以检查要发送的头部信息(*header*)。如同 
:php:class:`CakeRequest`，:php:class:`CakeResponse` 合并了一些之前在
:php:class:`Controller`、:php:class:`RequestHandlerComponent` 和 
:php:class:`Dispatcher` 中的方法。这些旧方法已经废弃，请使用 
:php:class:`CakeResponse`。

:php:class:`CakeResponse` 提供了一个接口，封装了与响应有关的常见任务，比如:

* 为跳转发送头部信息(*header*)。
* 发送内容类型头部信息。
* 发送任何头部信息。
* 发送响应体(*response body*)。

改变响应类
==========

CakePHP 默认使用 :php:class:`CakeResponse`。:php:class:`CakeResponse` 是灵活透明
的类。如果需要用应用程序中特定的类来重载它，可以在 ``app/webroot/index.php`` 替换 
:php:class:`CakeResponse`。这会使应用程序中的所有控制器都使用 ``CustomResponse``，
而不是 :php:class:`CakeResponse`。也可以在控制器中设置 ``$this->response`` 来替
换响应实例。在测试中替换响应对象是很方便的，因为这样可以禁止与 ``header()`` 交互
的方法。欲知详情，请参看 :ref:`cakeresponse-testing`。

处理内容类型
============

可以用 :php:meth:`CakeResponse::type()` 来控制应用程序响应的内容类型
(*Content-Type*)。如果应用程序需要处理不是 :php:class:`CakeResponse` 内置的内容
类型，也可以用 :php:meth:`CakeResponse::type()` 建立这些类型的映射::

    // 增加 vCard 类型
    $this->response->type(array('vcf' => 'text/v-card'));

    // 设置响应的内容类型(*Content-Type*)为 vcard。
    $this->response->type('vcf');

通常你会在控制器的 :php:meth:`~Controller::beforeFilter()` 回调中映射更多的内容
类型，这样，如果使用 :php:class:`RequestHandlerComponent` 的话，就可以利用它的自
动切换视图的特性。

.. _cake-response-file:

发送文件
========

有时候需要发送文件作为对请求的响应。在 2.3 版本之前，可以用 
:php:class:`MediaView` 来实现。在 2.3 版本中，:php:class:`MediaView` 已被废弃，
不过可以用 :php:meth:`CakeResponse::file()` 来发送文件作为响应::

    public function sendFile($id) {
        $file = $this->Attachment->getFile($id);
        $this->response->file($file['path']);
        // 返回响应对象，阻止控制器渲染视图
        return $this->response;
    }

如上面的例子所示，必须为该方法提供文件路径。如果是 
:php:attr:`CakeResponse::$_mimeTypes` 中列出的已知文件类型，CakePHP 就会发送正确
的内容类型头部信息。可以在调用 :php:meth:`CakeResponse::file()` 之前用
:php:meth:`CakeResponse::type()` 方法添加新类型。

如果需要，也可以通过指定下面的选项来强制文件下载，而不是显示在浏览器中::

    $this->response->file(
        $file['path'],
        array('download' => true, 'name' => 'foo')
    );

把字符串作为文件发送
====================

可以发送不在硬盘上的文件作为响应，比如从字符串动态生成的 PDF 文件或者 ICS 日程::

    public function sendIcs() {
        $icsString = $this->Calendar->generateIcs();
        $this->response->body($icsString);
        $this->response->type('ics');

        //可选择强制文件下载
        $this->response->download('filename_for_download.ics');

        // 返回相应对象，防止控制器试图渲染视图
        return $this->response;
    }

设置头部信息
============

设置头部信息可以使用 :php:meth:`CakeResponse::header()` 方法。它可以用几种不同的
参数配置来调用::

    // 设置单一头部信息
    $this->response->header('Location', 'http://example.com');

    // 设置多个头部信息
    $this->response->header(array(
        'Location' => 'http://example.com',
        'X-Extra' => 'My header'
    ));

    $this->response->header(array(
        'WWW-Authenticate: Negotiate',
        'Content-type: application/pdf'
    ));

多次设置相同的 :php:meth:`~CakeResponse::header()`，会导致覆盖之前的值，就像通常
的 header 函数调用一样。当调用 :php:meth:`CakeResponse::header()` 时，头部信息不
会被发送；它们只是被缓存起来，直到真正地发送响应。

.. versionadded:: 2.4

现在可以用便捷方法 :php:meth:`CakeResponse::location()` 来直接设置或读取重定向位
置头部信息。

与浏览器缓存交互
================

有时候需要使浏览器不要缓存控制器动作的执行结果。
:php:meth:`CakeResponse::disableCache()` 方法就是为此目的::

    public function index() {
        // 做一些事情
        $this->response->disableCache();
    }

.. warning::

    从 SSL 域下载时使用 disableCache()，并试图向 Internet Explorer 发送文件，会
    导致错误。

也可以使用 :php:meth:`CakeResponse::cache()` 方法，告诉客户端要缓存响应::

    public function index() {
        //做一些事情
        $this->response->cache('-1 minute', '+5 days');
    }

上述代码会告诉客户端把响应结果缓存5天，希望能够加快的访问者的体验。
:php:meth:`CakeResponse::cache()` 方法把 ``Last-Modified`` 的值设为传入的第一个
参数。``Expires`` 头部信息和 ``max-age`` 指令会基于第二个参数进行设置。
Cache-Control 的 ``public`` 指令也会被设置。


.. _cake-response-caching:

微调 HTTP 缓存
==============

最好也是最容易的一种加速应用程序的方法是使用 HTTP 缓存。在这种缓存模式下，只需要
设置若干头部信息，比如，修改时间、响应实体标签(*response entity tag*)，等等，来
帮助客户端决定它们是否应当使用响应的缓存拷贝。

你不必编写缓存的逻辑，以及一旦数据更改就使之无效(从而刷新)它。HTTP 使用两种模式，
过期和有效性验证，通常使用起来要更加简单。

除了使用 :php:meth:`CakeResponse::cache()`，也可以使用许多其它方法，来微调 HTTP 
缓存头部信息，从而利用浏览器或反向代理的缓存。

缓存控制(*Cache Control*)头部信息
---------------------------------

.. versionadded:: 2.1

应用于过期模式下，该头部信息包括多个指示，可以改变浏览器或代理使用缓存内容的方式。
一条 ``Cache-Control`` 头部信息可以象这样::

    Cache-Control: private, max-age=3600, must-revalidate

:php:class:`CakeResponse` 类有一些工具方法来帮助你设置这个头部信息，并最终生成一
条合法的 ``Cache-Control`` 头部信息。它们中的第一个是 
:php:meth:`CakeResponse::sharable()` 方法，指示一个响应是否被不同的用户或客户端
共享。这个方法实际控制这个头部信息公有(``public``)或者私有(``private``)的部分。
设置响应为私有，表示它的全部或者部分只适用于单一用户。要利用共享缓存，就必须设置
控制指令为公有。

此方法的第二个参数用于指定缓存的 ``max-age`` (最大年龄)，以秒为单位，这段时间过
后缓存就不认为是最新的了::

    public function view() {
        ...
        // 设置 Cache-Control 为公有、3600秒
        $this->response->sharable(true, 3600);
    }

    public function my_data() {
        ...
        // 设置 Cache-Control 为私有、3600秒
        $this->response->sharable(false, 3600);
    }

:php:class:`CakeResponse` 提供了单独的方法来设置 ``Cache-Control`` 头部信息中的
每一部分。

过期头部信息
---------------------

.. versionadded:: 2.1

可以设置 ``Expires`` 头部信息为一个日期及时间，在这之后响应就被认为不是最新的了。
这个头部信息可以用 :php:meth:`CakeResponse::expires()` 方法来设置::

    public function view() {
        $this->response->expires('+5 days');
    }

这个方法也接受 :php:class:`DateTime` 实例或者任何可以被 :php:class:`DateTime` 解
析的字符串。

Etag 头部信息
---------------

.. versionadded:: 2.1

在 HTTP 中，当内容总是变化时，缓存验证是经常使用的，并要求应用程序只有当缓存不是
最新的时候才生成响应内容。在这个模式下，客户端继续在缓存中保存网页，但并不直接使
用，而是每次询问应用程序资源是否改变。这通常用于静态资源，比如图像和其它资源。

:php:meth:`~CakeResponse::etag()` 方法(叫做实体标签(*entity tag*))是一个字符串，
用来唯一标识被请求的资源，就象文件校验码的作用，从而知道是否与缓存的资源匹配。

要利用这条头部信息，你必须或者手动调用 
:php:meth:`CakeResponse::checkNotModified()` 方法，或者在控制器中引入 
:php:class:`RequestHandlerComponent`::

    public function index() {
        $articles = $this->Article->find('all');
        $this->response->etag($this->Article->generateHash($articles));
        if ($this->response->checkNotModified($this->request)) {
            return $this->response;
        }
        ...
    }

Last Modified 头部信息
------------------------

.. versionadded:: 2.1

在 HTTP 缓存有效性验证模式下，也可以设置 ``Last-Modified`` 头部信息，说明资源最
后改变的日期和时间。设置这个头部信息可以帮助 CakePHP 回答缓存客户端，基于客户端
的缓存，响应是否有变化。

要利用这条头部信息，你必须或者手动调用 
:php:meth:`CakeResponse::checkNotModified()` 方法，或者在控制器中引入 
:php:class:`RequestHandlerComponent`::

    public function view() {
        $article = $this->Article->find('first');
        $this->response->modified($article['Article']['modified']);
        if ($this->response->checkNotModified($this->request)) {
            return $this->response;
        }
        ...
    }

Vary 头部信息
---------------

有些情况下，也许会用同一网址提供不同的内容。这种情况通常是有一个多语言网页，或者
是根据浏览器提供不同的 HTML。在这些情况下，可以使用 ``Vary`` 头部信息::

    $this->response->vary('User-Agent');
    $this->response->vary('Accept-Encoding', 'User-Agent');
    $this->response->vary('Accept-Language');

.. _cakeresponse-testing:

CakeResponse 和测试
===================

也许 :php:class:`CakeResponse` 最大的好处在于，它使得测试控制器和组件更容易了。
与其把方法散布于多个对象之中，现在控制器和组件只调用(*delegate*) 
:php:class:`CakeResponse`，只需要模拟一个对象就可以了。这让你更加接近于单元测试，
也使得测试控制器更容易了::

    public function testSomething() {
        $this->controller->response = $this->getMock('CakeResponse');
        $this->controller->response->expects($this->once())->method('header');
        // ...
    }

另外，可以更容易地从命令行运行测试，因为可以用模拟(*mock*)来避免在命令行界面设置
头部信息时引起的“头部信息已发送(*headers sent*)”的错误。


CakeResponse API
================

.. php:class:: CakeResponse

    CakeResponse 提供了一些有用的方法，来与要发送给客户端的响应交互。

.. php:method:: header($header = null, $value = null)

    可以直接设置一个或多个头部信息，与响应一起发送。

.. php:method:: location($url = null)

    可以直接设置重定向位置头部信息，与响应一起发送::

        // 设置重定向位置
        $this->response->location('http://example.com');

        // 读取当前重定向位置头部信息
        $location = $this->response->location();

    .. versionadded:: 2.4

.. php:method:: charset($charset = null)

    设置响应使用的字符集。

.. php:method:: type($contentType = null)

    设置响应的内容类型(*content type*)。可以使用一个已知内容类型别名，或完整的内
    容类型名称。

.. php:method:: cache($since, $time = '+1 day')

    可以在响应中设置缓存头部信息。

.. php:method:: disableCache()

    设置响应头部信息，禁用客户端缓存。

.. php:method:: sharable($public = null, $time = null)

    设置 ``Cache-Control`` 头部信息为公有(``public``)或私有(``private``)，并可选
    择设置资源的 ``max-age`` 指令。

    .. versionadded:: 2.1

.. php:method:: expires($time = null)

    可以设置过期(``Expires``)头部信息为特定日期。

    .. versionadded:: 2.1

.. php:method:: etag($tag = null, $weak = false)

    设置 ``Etag`` 头部信息，唯一地标识响应资源。

    .. versionadded:: 2.1

.. php:method:: modified($time = null)

    以正确的格式设置 ``Last-Modified`` 头部信息为特定的日期和时间。

    .. versionadded:: 2.1

.. php:method:: checkNotModified(CakeRequest $request)

    比较请求对象的缓存头部信息和响应的缓存头部信息，决定响应是否还是最新的。如果
    是，删除响应内容，发送 `304 Not Modified` 头部信息。

    .. versionadded:: 2.1

.. php:method:: compress()

    为请求开启 gzip 压缩。

.. php:method:: download($filename)

    可以把响应作为附件发送，并设置文件名。

.. php:method:: statusCode($code = null)

    可以设置响应的状态编码。

.. php:method:: body($content = null)

    设置响应的内容体(*body*)。

.. php:method:: send()

    一旦完成了响应的创建，调用 :php:meth:`~CakeResponse::send()` 会发送所有设置
    的头部信息和文件体(*body*)。这是在每次请求的最后由 :php:class:`Dispatcher` 
    自动执行的。

.. php:method:: file($path, $options = array())

    允许设置文件的 ``Content-Disposition`` 头部信息信息，用于显示或下载。

    .. versionadded:: 2.3

.. meta::
    :title lang=zh: Request and Response objects
    :keywords lang=zh: request controller,request parameters,array indexes,purpose index,response objects,domain information,request object,request data,interrogating,params,previous versions,introspection,dispatcher,rout,data structures,arrays,ip address,migration,indexes,cakephp
