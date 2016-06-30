调度器过滤器
############

.. versionadded:: 2.2

要一段代码在任何控制器代码执行之前或者在响应即将被发送往客户端之前运行，有若干种原因，
例如响应的缓存、标头(*header*)的调整、特殊的用户验证，或者只是要在比完整请求调度周期
更短的时间内提供对关键任务 API 响应的访问。

CakePHP 为这些情况提供了清晰和可扩展的接口，在调度周期中附加过滤器，类似于为每个请求
提供可堆叠的服务或者例程的中间件层。我们把这些叫做 `调度器过滤器(Dispatcher Filters)`。

配置过滤器
==========

过滤器通常在 ``bootstrap.php`` 文件中配置，但你可以在请求被调度之前从任何其它配置
文件容易地加载它们。添加或去除过滤器通过 `Configure` 类进行，使用特殊的键 
``Dispatcher.filters``。默认情况下 CakePHP 自带的一些过滤器类已经对所有请求启用，让
我们看看它们是怎么添加的::

    Configure::write('Dispatcher.filters', array(
        'AssetDispatcher',
        'CacheDispatcher'
    ));

每个数组值是类名，类会被实例化，添加作为在调度器级别产生的事件的监听器(*listener*)。
第一个，``AssetDispatcher`` 类用来检查请求是否指向一个主题(*theme*)或插件(*plugin*)
的资源文件，比如保存在插件的 webroot 目录或者主题的相应目录中的 CSS、JavaScript 或
图像。如果文件存在，它会提供相应的文件，停止其余的调度周期。``CacheDispatcher`` 
过滤器，当 ``Cache.check`` 配置变量为启用时，会检查响应是否已经在文件系统中对类似的
请求进行了缓存，并立即提供缓存的代码。

如你所见，自带的两个过滤器都负责停止进一步代码的执行，立即发送响应到客户端。但过滤器
并不仅限于这样的角色，如我们在本节即将展示的。

你可以在过滤器列表中加入自己的类名，它们会以定义的顺序执行。也有另外一种方法来附加不
涉及特殊的 ``DispatcherFilter`` 类的过滤器::

    Configure::write('Dispatcher.filters', array(
        'my-filter' => array(
            'callable' => array($classInstance, 'methodName'),
            'on' => 'after'
        )
    ));

如上所述，你可以传入任何合法的 PHP `回调(*callback*) <http://php.net/callback>`_ 
类型，也许你还记得，`回调` 是任何 PHP 可以用 ``call_user_func`` 函数执行的东西。
我们做了一点例外，如果提供了字符串，这将被作为类名对待，而不是可能的函数名。这当然让 
PHP 5.3 的用户可以附加匿名函数作为过滤器::

    Configure::write('Dispatcher.filters', array(
       'my-filter' => array('callable' => function($event) {...}, 'on' => 'before'),
       //更多过滤器
    ));


``on`` 键只接受 ``before`` 和 ``after`` 为合法值，很明显，这意味着过滤器应当在
控制器代码执行之前或之后运行。除了用 ``callable`` 键定义过滤器，你也可以为过滤器定义
优先级，如果未指定，就使用默认值 ``10``。

既然所有过滤器都具有优先级 ``10``，如果你要某个过滤器在列表中的任何其它过滤器之前运行，
就可以根据需要选择较低的优先级数::

    Configure::write('Dispatcher.filters', array(
       'my-filter' => array(
            'callable' => function($event) {...},
            'on' => 'before',
            'priority' => 5
        ),
        'other-filter' => array(
            'callable' => array($class, 'method'),
            'on' => 'after',
            'priority' => 1
        ),
       //更多过滤器
    ));

显然，在定义优先级时，过滤器声明的顺序，除了对相同优先级的过滤器，没有关系。在以类名
定义过滤器时，无法同时定义优先级，我们很快就会谈及这点。最后，CakePHP 的插件语法可以
用于定义位于插件内的过滤器::

    Configure::write('Dispatcher.filters', array(
        'MyPlugin.MyFilter',
    ));

只管移除默认附加的过滤器，如果你选择使用更高级/快速的方法来提供主题和插件的资源，或者
你不愿使用内置的完整页面缓存，或者只是要实现你自己的过滤器。

如果你需要传递构造函数参数或设置给你的调度过滤器类，你可以通过提供设置数组来这么做::

    Configure::write('Dispatcher.filters', array(
        'MyAssetFilter' => array('service' => 'google.com')
    ));

当过滤器键是一个合法的类名时，值可以是传递给调度过滤器的参数数组。默认情况下，基类会
在把这些设置与类的默认值合并后，赋值给 ``$settings`` 属性。

.. versionchanged:: 2.5
    在 2.5 版本中，你可以为调度过滤器提供构造函数设置。

过滤器类
========

调度器过滤器，在配置中以类名定义时，应当扩展在 CakePHP 的 `Routing` 目录中提供的类 
``DispatcherFilter`` 。让我们来创建一个简单的过滤器，对特殊网址作出 'Hello World' 
文字的响应::

    App::uses('DispatcherFilter', 'Routing');
    class HelloWorldFilter extends DispatcherFilter {

        public $priority = 9;

        public function beforeDispatch(CakeEvent $event) {
            $request = $event->data['request'];
            $response = $event->data['response'];

            if ($request->url === 'hello-world') {
                $response->body('Hello World');
                $event->stopPropagation();
                return $response;
            }
        }
    }

该类应当保存于文件 ``app/Routing/Filter/HelloWorldFilter.php`` 中，并在启动引导
(*bootstrap*)文件中按照前一节中的说明进行配置。这里有很多需要解释，让我们先从 
``$priority`` 的值开始。

如前所述，在使用过滤器类时你只能用类的 ``$priority`` 属性定义过滤器运行的顺序，如果
声明了属性其默认值为 10，这意味着它会在 Router 类解析了请求_之后_执行。在前面的例子
中我们不希望这样，因为很有可能你没有设置任何控制器来应答那个网址，所以我们选择 9 作为
我们的优先级。

``DispatcherFilter`` 类提供了两个方法，可以在子类中重载，即 ``beforeDispatch`` 和 
``afterDispatch`` 方法，它们分别在任何控制器执行之前或之后执行。两个方法都接受一个 
:php:class:`CakeEvent` 对象，它含有 ``request`` 和 ``response`` 对象(
:php:class:`CakeRequest` 和 :php:class:`CakeResponse` 实例)，以及在 ``data`` 属性
中的 ``additionalParams`` 数组。后者包含的信息用于调用 ``requestAction`` 方法时的
内部调度。

在我们的例子中，我们有条件地返回 ``$response`` 对象作为结果，这会告诉调度器不要
实例化任何控制器，并把该对象作为响应立即返回给客户端。我们也添加了 
``$event->stopPropagation()`` 来防止在该过滤器之后运行其它过滤器。

现在让我们再创建一个过滤器，来改变任何公开页面的响应标头(*header*)，在我们的具体情况
下这就是任何从 ``PagesController`` 控制器响应的东西::

    App::uses('DispatcherFilter', 'Routing');
    class HttpCacheFilter extends DispatcherFilter {

        public function afterDispatch(CakeEvent $event) {
            $request = $event->data['request'];
            $response = $event->data['response'];

            if ($request->params['controller'] !== 'pages') {
                return;
            }
            if ($response->statusCode() === 200) {
                $response->sharable(true);
                $response->expires(strtotime('+1 day'));
            }
        }
    }

该过滤器会为 pages 控制器生成的所有相应发送一个将来 1 天的过期标头(*expiration 
header*)。你当然可以在控制器中这么做，这只是用过滤器能够做什么的一个例子。例如，除了
改变响应，你可以用 :php:class:`Cache` 类缓存响应，并在 ``beforeDispatch`` 回调中
提供该响应。

内嵌过滤器
==========

我们的最后一个例子会使用匿名函数(只适用于 PHP 5.3+)来提供 JSON 格式的文章列表，我们
鼓励你用控制器和 :php:class:`JsonView` 类来达成此目的，不过让我们假设你需要为这个
关键任务的 API 端点节省几毫秒::

    $postsList = function($event) {
        if ($event->data['request']->url !== 'posts/recent.json') {
            return;
        }
        App::uses('ClassRegistry', 'Utility');
        $postModel = ClassRegistry::init('Post');
        $event->data['response']->body(json_encode($postModel->find('recent')));
        $event->stopPropagation();
        return $event->data['response'];
    };

    Configure::write('Dispatcher.filters', array(
        'AssetDispatcher',
        'CacheDispatcher',
        'recent-posts' => array(
            'callable' => $postsList,
            'priority' => 9,
            'on'=> 'before'
        )
    ));

在这个例子中我们为过滤器选择了优先级 ``9``，这样就可以跳过任何在自定义过滤器或者象 
CakePHP 内部的路由系统这样的核心过滤器中的逻辑了。虽然并非必须，但是这说明了如果你要
针对某些请求尽可能去除多余的累赘，如何让重要代码抢先运行。

基于很明显的原因，这可能让你的应用程序很难维护。如果明智地运用，过滤器是极其强大的
工具，为应用程序中的每个网址添加响应处理并非是对它很好的运用。但是如果你有合理的原因
这么做，那么你就手握一个清晰的解决方案。请牢记，并非所有的东西都要是过滤器，
`Controllers` 和 `Components` 通常是为应用程序添加请求处理更恰当的选择。


.. meta::
    :title lang=zh: Dispatcher Filters
    :description lang=zh: Dispatcher filters are a middleware layer for CakePHP allowing to alter the request or response before it is sent
    :keywords lang=zh: middleware, filters, dispatcher, request, response, rack, application stack, events, beforeDispatch, afterDispatch, router
