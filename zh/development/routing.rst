路由
####

路由(*routing*)是把网址(*URL*)映射到控制器动作的功能。这个功能添加到 CakePHP 中，
是为了使友好网址更容易配置和更加灵活。使用路由不要求一定要用 Apache 的 
mod\_rewrite 模块，不过这会使地址栏看起来更加整洁。

CakePHP 的路由还包括反向路由的思想，即，参数数组可以逆转成字符串网址。使用反向路
由，你就可以轻松地重构应用程序的网址结构，而无需更新所有的代码。

.. index:: routes.php

.. _routes-configuration:

路由的配置
==========

应用程序中的路由是在 ``app/Config/routes.php`` 中配置的。当处理路由被 
:php:class:`Dispatcher` 引入，让你可以定义应用程序要使用的特定路由。在该文件中声
明的路由从上而下处理，直到收到的请求匹配。这意味着放置路由的顺序会影响路由的解析。
通常好的做法是，把最常访问的路由尽可能放在路由文件的最上面。这可以省去对每个请求
不得不检查若干个不能匹配的路由。

路由以它们连入的顺序来解析和匹配。如果你定义两个类似的路由，定义的第一个路由比后
定义的那个有更高的优先级。在连接路由之后，你可以使用 
:php:meth:`Router::promote()` 来操纵路由的顺序。

CakePHP 也带有一些默认的路由帮你开始。以后如果你肯定不需要它们了，可以把它们关闭。
欲知如何关闭默认的路由，请参见 :ref:`disabling-default-routes`。


默认的路由
==========

在了解如何配置自己的路由之前，你应当知道 CakePHP 带有一组默认的路由。CakePHP 的
默认路由适用于任何应用程序的很多情况。把一个动作的名称放入请求中，就可以直接从网
址访问该动作。也可以用网址传递参数到控制器动作。 ::

        URL pattern default routes:
        http://example.com/controller/action/param1/param2/param3

网址 /posts/view 映射到 PostsController 的 view() 动作，而网址 
/products/view\_clearance 映射到 ProductsController 的 view\_clearance() 动作。

默认的路由设置也让你可以用网址传递参数到动作。例如，对 /posts/view/25 的请求等于
调用 PostsController 的 view(25)。默认的路由也提供插件的路由、前缀路由，如果你选
择使用这些功能的话。

内置的路由位于 ``Cake/Config/routes.php``。你可以通过在应用程序的 
:term:`routes.php` 文件中去掉默认路由来关闭它们。

.. index:: :controller, :action, :plugin
.. _connecting-routes:

连接路由
========

定义你自己的路由让你可以定义应用程序如何对一个给定的网址作出反应。用 
:php:meth:`Router::connect()` 方法在 ``app/Config/routes.php`` 文件中定义定义自
己的路由。

``connect()`` 方法接受最多三个参数：希望匹配的网址、路由元素的默认值、和帮助路由
匹配网址中的元素的正则表达式规则。

路由定义的基本格式为::

    Router::connect(
        'URL',
        array('default' => 'defaultValue'),
        array('option' => 'matchingRegex')
    );

第一个参数用来告诉路由器你要控制哪种网址。网址是斜线分隔的普通字符串，但也可以包
含通配符(\*)或者 :ref:`route-elements`。使用通配符告诉路由器，你愿意接受任何提供
的额外参数。不含\*的路由只匹配提供的模板模式。

一旦指定了网址，用 ``connect()`` 的最后两个参数来告诉 CakePHP，一旦一个请求匹配
了，要如何处理它。第二个参数是一个关联数组。数组的键应当以网址中的路由元素来命名，
或者是默认元素： ``:controller`` 、 ``:action`` 和 ``:plugin``。数组中的值是这些
键的缺省值。让我们看一些基本的例子，再来看如何使用 connect() 的第三个参数::

    Router::connect(
        '/pages/*',
        array('controller' => 'pages', 'action' => 'display')
    );

以上这个路由在随 CakePHP 发布的 routes.php 文件中。该路由匹配任何以 ``/pages/`` 
开始的网址，并把它交给 ``PagesController();`` 的 ``display()`` 动作。请求 
/pages/products 会映射到 ``PagesController->display('products')``。

除了贪婪的星号 ``/*``，还有 ``/**`` 后缀星号语法。使用后缀双星号，会捕获网址的其
余部分为一个传入参数。当你要使用含有 ``/`` 的参数时就有用了::

    Router::connect(
        '/pages/**',
        array('controller' => 'pages', 'action' => 'show')
    );

传入的网址 ``/pages/the-example-/-and-proof`` 会导致单个传入参数 
``the-example-/-and-proof``。

.. versionadded:: 2.1

    在 2.1 版本中增加了后缀双星号。

你可以使用 :php:meth:`Router::connect()` 的第二个参数来提供任何由路由的默认值组
成的路由参数::

    Router::connect(
        '/government',
        array('controller' => 'pages', 'action' => 'display', 5)
    );

这个例子说明如何使用 ``connect()`` 方法的第二个参数来定义默认参数。如果你构建一
个网站，有针对不同类别客户的产品，你也许会考虑创建一个路由。这让你可以链接 
``/government``，而不是 ``/pages/display/5``。

.. note::

    尽管你可以连接不同的路由，默认的路由还是会继续有效。在这样的设置下，可以从2个
    不同的网址访问相同的内容。欲知如何关闭默认路由，以及只提供你定义的网址，请参看 
    :ref:`disabling-default-routes`。

另一个路由器的常见用法是为控制器定义"别名"。比方说，我们不要访问通常的网址 
``/users/some_action/5``，希望能够通过 ``/cooks/some_action/5`` 来访问。下面的路
由轻易地实现了::

    Router::connect(
        '/cooks/:action/*', array('controller' => 'users')
    );

这就是告诉路由器，任何以 ``/cooks/`` 开始的网址应当交给用户控制器。调用的动作取
决于 ``:action`` 参数的值。使用 :ref:`route-elements`，就能够创造路由变量，接受
用户输入或者变量。上面的路由也使用了贪婪的星号。贪婪的星号告诉 
:php:class:`Router`，这个路由应当接受任何给定的额外位置参数。这些参数会被放入 
:ref:`passed-arguments` 数组供访问。

当生成网址时，也使用路由。如果上述路由最先匹配，使用 
``array('controller' => 'users', 'action' => 'some_action', 5)`` 作为网址，就会
输出 /cooks/some_action/5。

默认情况下，所有命名(*named*)和传入(*passed*)参数会从匹配贪婪模板的网址中提取。
不过，如果需要，可以使用 :php:meth:`Router::connectNamed()` 来配置哪个命名参数如
何解析。

.. _route-elements:

路由元素
--------

你可以指定自己的路由元素，这么做让你有能力能够定义控制器动作的参数在网址中应当占
据的位置。当发出一个请求时，这些路由元素的值就会在控制器的 
``$this->request->params`` 中。这不同于命名参数(*named parameters*)处理的方式，
所以请注意区别：命名参数(/controller/action/name:value)在 
``$this->request->params['named']`` 中，而自定义路由元素数据在 
``$this->request->params`` 中。当你定义自定义路由元素时，你可以指定可选的正则表
达式 — 这告诉 CakePHP 如何判断网址的格式是否正确。如果你选择不提供正则表达式，任
何非 ``/`` 字符就会被当做参数的一部分::

    Router::connect(
        '/:controller/:id',
        array('action' => 'view'),
        array('id' => '[0-9]+')
    );

这个简单的例子展示了如何通过构建一个看起来象 ``/controllername/:id`` 这样的网址，
来创造一个快捷的方式从任何控制器来查看模型。提供给 connect() 方法的网址指定了两
个路由元素： ``:controller`` 和 ``:id``。``:controller`` 元素是 CakePHP 的默认路
由元素，所以路由器知道如何匹配和辨认网址中的控制器名称。``:id`` 元素是自定义路由
元素，必须在 connect() 方法的第三个参数中用正则表达式进一步说明。

.. note::

    路由元素使用的模式必须不能含有任何捕获分组(*capturing group*)。如果含有捕获
    分组，路由器就无法正常工作。

一旦定义了路由，请求 ``/apples/5`` 就等同于请求 ``/apples/view/5``。二者都会调用 
ApplesController 控制器的 view() 方法。在 view() 方法内，需要用 
``$this->request->params['id']`` 来访问传入的 ID。

如果在应用程序中只有一个控制器，并且不想让控制器名称出现在网站中，你可以把所有网
址映射到控制器的动作。例如，要把所有网址映射到 ``home`` 控制器的动作，例如，使用
网址 ``/demo`` 而不是 ``/home/demo``，可以这样::

    Router::connect('/:action', array('controller' => 'home'));

如果想提供大小写无关的网址，可以使用正则表达式的内嵌修饰符(*inline modifier*)::

    Router::connect(
        '/:userShortcut',
        array('controller' => 'teachers', 'action' => 'profile', 1),
        array('userShortcut' => '(?i:principal)')
    );

再看一个例子，你就是路由专家了::

    Router::connect(
        '/:controller/:year/:month/:day',
        array('action' => 'index'),
        array(
            'year' => '[12][0-9]{3}',
            'month' => '0[1-9]|1[012]',
            'day' => '0[1-9]|[12][0-9]|3[01]'
        )
    );

这个有些复杂，但是说明了路由可以多么强大。提供的网址有四个路由元素。第一个我们很
熟悉：这是默认路由元素，告诉 CakePHP 这是控制器名称。

接着，我们指定一些缺省值。不管控制器是什么，我们都要调用 index() 动作。

最后，我们指定一些正则表达式，匹配数字形式的年、月和日。注意，在这个正则表达式中
是不支持括号(分组)的。你可以使用其它的，象上面那样，但是不能用括号分组。

一旦定义好，路由就可以匹配 ``/articles/2007/02/01`` 、 ``/posts/2004/11/16``，把
请求传递给相应控制器的 index() 动作，并把日期参数放入 ``$this->request->params`` 
中。

有几个路由元素在 CakePHP 中有特殊意义，不应当使用，除非你需要这种特殊意义。

* ``controller`` 用于命名路由的控制器。
* ``action`` 用于命名路由的控制器动作。
* ``plugin`` 用于命名控制器所在的插件(*plugin*)。
* ``prefix`` 用于 :ref:`prefix-routing`。
* ``ext`` 用于 :ref:`file-extensions` 路由。

传递参数给动作
--------------

当使用 :ref:`route-elements` 连接路由时，你也许想要路由的元素转而作为传入参数
(*passed arguments*)。使用 :php:meth:`Router::connect()` 方法的第三个参数，你可
以定义哪个路由元素应当也被作为传入参数::

    // SomeController.php
    public function view($articleId = null, $slug = null) {
        // 这里是一些代码...
    }

    // routes.php
    Router::connect(
        '/blog/:id-:slug', // 例如 /blog/3-CakePHP_Rocks
        array('controller' => 'blog', 'action' => 'view'),
        array(
            // 顺序有关，因为这会简单地把 ":id" 映射到动作中的 $articleId 参数
            'pass' => array('id', 'slug'),
            'id' => '[0-9]+'
        )
    );

那么现在，得益于反向路由的功能，你可以传入下面这样的网址，而 CakePHP 就能够知道
如何构成路由中定义的网址::

    // view.ctp
    // 这会返回链接 /blog/3-CakePHP_Rocks
    echo $this->Html->link('CakePHP Rocks', array(
        'controller' => 'blog',
        'action' => 'view',
        'id' => 3,
        'slug' => 'CakePHP_Rocks'
    ));

每个路由的命名参数
------------------

尽管你可以用 :php:meth:`Router::connectNamed()` 在全局范围控制命名参数
(*named parameter*)，你也可以用 ``Router::connect()`` 的第三个参数控制在路由级别
的命名参数::

    Router::connect(
        '/:controller/:action/*',
        array(),
        array(
            'named' => array(
                'wibble',
                'fish' => array('action' => 'index'),
                'fizz' => array('controller' => array('comments', 'other')),
                'buzz' => 'val-[\d]+'
            )
        )
    );

以上路由定义使用 ``named`` 键来定义应当如何 处理几个命名参数。让我们仔细看看每个
不同的规则：

* 'wibble' 没有额外信息。这意味着，如果在匹配该路由的网址中找到，总是会解析。
* 'fish' 有条件数组，包含 'action' 键。这意味着，仅当动作也是索引时，fish 才会被
  解析为命名参数。
* 'fizz' 也有条件数组。不过，它含有两个控制器，这意味着，仅当控制器匹配数组中的
  一个时，'fizz' 才会被解析。
* 'buzz' 有字符串条件。字符串条件被作为正则表达式片段。只有符合模式的 buzz 值才
  会被解析。

如果使用了命名参数，但它不符合提供的条件，就会被当作传入参数(*passed argument*)，
而非命名参数。

.. index:: admin routing, prefix routing
.. _prefix-routing:

前缀路由
--------

许多应用程序要求有一个管理区，特权用户可以进行改动。这经常是通过一个特殊的网址来
完成的，比如 ``/admin/users/edit/5``。在 CakePHP 中，前缀路由(*prefix routing*)
可以在核心配置文件中通过使用 Routing.prefixes 设置前缀来开启。注意，前缀虽然和路
由器有关，却是在 ``app/Config/core.php`` 中配置的::

    Configure::write('Routing.prefixes', array('admin'));

在控制器中，任何以 ``admin_`` 前缀开始的动作就可以被调用了。在用户的例子中，访问
网址 ``/admin/users/edit/5`` 就会调用 ``UsersController`` 控制器的方法 
``admin_edit``，传入 5 作为第一个参数。使用的视图文件为 
``app/View/Users/admin_edit.ctp``。

可以用下面的路由映射网址 /admin 到 pages 控制器的 ``admin_index`` 动作::

    Router::connect(
        '/admin',
        array('controller' => 'pages', 'action' => 'index', 'admin' => true)
    );

也可以通过添加更多的值到 ``Routing.prefixes`` 来配置路由器使用多个前缀。如果设置::

    Configure::write('Routing.prefixes', array('admin', 'manager'));

CakePHP 会自动生成 admin 和 manager 两个前缀的路由。每个配置的前缀会有如下生成的
路由::

    Router::connect(
        "/{$prefix}/:plugin/:controller",
        array('action' => 'index', 'prefix' => $prefix, $prefix => true)
    );
    Router::connect(
        "/{$prefix}/:plugin/:controller/:action/*",
        array('prefix' => $prefix, $prefix => true)
    );
    Router::connect(
        "/{$prefix}/:controller",
        array('action' => 'index', 'prefix' => $prefix, $prefix => true)
    );
    Router::connect(
        "/{$prefix}/:controller/:action/*",
        array('prefix' => $prefix, $prefix => true)
    );

和 admin 路由很类似，所有的前缀动作应当加上前缀名称。所以 ``/manager/posts/add`` 
就会映射到 ``PostsController::manager_add()``。

而且，当前前缀在控制器方法中可以通过 ``$this->request->prefix`` 得到。

当使用前缀路由时，重要的是要记住，使用 HTML 助件来构建链接会帮助维护前缀调用。下
面是如何使用 HTML 助件来构建链接::

    // 进入前缀路由。
    echo $this->Html->link(
        'Manage posts',
        array('manager' => true, 'controller' => 'posts', 'action' => 'add')
    );

    // 离开前缀
    echo $this->Html->link(
        'View Post',
        array('manager' => false, 'controller' => 'posts', 'action' => 'view', 5)
    );

.. index:: plugin routing

插件路由
--------

插件路由使用 **plugin** 键。你可以创建指向插件的链接，但需在网址数组中添加 
plugin 键::

    echo $this->Html->link(
        'New todo',
        array('plugin' => 'todo', 'controller' => 'todo_items', 'action' => 'create')
    );

相反如果当前有效请求是对插件的请求，而你又要创建不带插件的链接，你可以这么做::

    echo $this->Html->link(
        'New todo',
        array('plugin' => null, 'controller' => 'users', 'action' => 'profile')
    );

通过设置 ``plugin => null``，你告诉路由器你要创建的链接不是插件的一部分。

.. index:: file extensions
.. _file-extensions:

文件扩展名
----------

要让你的路由处理不同的文件扩展名，你需要在路由配置文件中多加一行::

    Router::parseExtensions('html', 'rss');

这会告诉路由器去掉任何匹配的文件扩展名，解析剩余的部分。

如果你要创建象 /page/title-of-page.html 这样的网址，你可以创建如下所示的路由::

    Router::connect(
        '/page/:title',
        array('controller' => 'pages', 'action' => 'view'),
        array(
            'pass' => array('title')
        )
    );

然后，要创建映射回上述路由的链接，简单地使用::

    $this->Html->link(
        'Link title',
        array(
            'controller' => 'pages',
            'action' => 'view',
            'title' => 'super-article',
            'ext' => 'html'
        )
    );

文件扩展名被 :php:class:`RequestHandlerComponent` 用来进行基于内容类型的自动视图
切换。欲知详情，请参看 RequestHandlerComponent。

.. _route-conditions:

使用额外条件匹配路由
--------------------

当创建路由时，你也许要基于特定的请求/环境设置来限制某些网址。一个很好的例子是 
:doc:`rest` 路由。你可以在 :php:meth:`Router::connect()` 的 ``$defaults`` 参数指
定额外的条件。默认情况下 CakePHP 提供3个环境条件，但是你可以用 
:ref:`custom-route-classes` 添加更多(的条件)。内置的选项为：

- ``[type]`` 只匹配特定内容类型的请求。
- ``[method]`` 只匹配有特定 HTTP 动词的请求。
- ``[server]`` 只有当 $_SERVER['SERVER_NAME'] 匹配给定值时才会匹配。

我们在这里提供一个简单的例子，说明如何使用 ``[method]`` 选项来创建自定义 RESTful 
路由::


    Router::connect(
        "/:controller/:id",
        array("action" => "edit", "[method]" => "PUT"),
        array("id" => "[0-9]+")
    );

以上路由只会匹配 ``PUT`` 请求。使用这些条件，你能够创建自定义 REST 路由，或者其
它依赖于请求数据的信息。

.. index:: passed arguments
.. _passed-arguments:

传入参数
========

传入参数(*passed argument*)是发起请求时使用的其它参数或路径片段。它们经常用来给
控制器方法传递参数。 ::

    http://localhost/calendars/view/recent/mark

在上面的例子中，``recent`` 和 ``mark`` 都是 ``CalendarsController::view()`` 的参
数。传入参数以三种方式提供给控制器。首先可以作为被调用动作方法的参数，其次可以在
``$this->request->params['pass']`` 中作为数字索引的数组访问。最后，可以在 
``$this->passedArgs`` 中通过和第二种同样的方式访问。在使用自定义路由时，你也可以
强制特定的参数作为传入参数。

如果你访问上面提到的网址，控制器动作如下::

    CalendarsController extends AppController {
        public function view($arg1, $arg2) {
            debug(func_get_args());
        }
    }

你就会得到如下输出::

    Array
    (
        [0] => recent
        [1] => mark
    )

同样的数据也可以在控制器、视图和助件中通过 ``$this->request->params['pass']`` 和
``$this->passedArgs`` 得到。在 pass 数组中的值以它们在调用的网址中出现的顺序作为
数字索引::

    debug($this->request->params['pass']);
    debug($this->passedArgs);

上面的任何一个都会输出::

    Array
    (
        [0] => recent
        [1] => mark
    )

.. note::

    $this->passedArgs 也可能会包含命名参数(*named parameter*)，因为命名数组和传
    入参数混杂在一起。

在生成网址时，使用 :term:`routing array`，你可以添加不带字符串索引的值作为传入参
数::

    array('controller' => 'posts', 'action' => 'view', 5)

因为 ``5`` 有数字键，所以它会被当作传入参数。

.. index:: named parameters

.. _named-parameters:

命名参数
========

你可以给参数命名并用网址传递它们的值。对 
``/posts/view/title:first/category:general`` 的请求会导致对 PostsController 控制
器的 view() 动作的调用。在这个动作中，你可以在 ``$this->params['named']`` 中得到
title 和 category 参数的值。它们也可以在 ``$this->passedArgs`` 中得到。在这两种
情况中，都可以用它们的名称作为索引来访问。如果省略了命名参数，它们就不会(在这两
个数组中)被设置。


.. note::

    什么会被解析为命名参数，是由 :php:meth:`Router::connectNamed()` 方法控制的。
    如果你的命名参数不支持反向路由，或不能正确解析，你就需要让 
    :php:class:`Router` 知道它们(的存在)。

一些默认路由的总结性例子也许有用::

    使用默认路由从网址到控制器动作的映射：

    网址： URL: /monkeys/jump
    映射： Mapping: MonkeysController->jump();

    网址： URL: /products
    映射： Mapping: ProductsController->index();

    网址： URL: /tasks/view/45
    映射： Mapping: TasksController->view(45);

    网址： URL: /donations/view/recent/2001
    映射： Mapping: DonationsController->view('recent', '2001');

    网址： URL: /contents/view/chapter:models/section:associations
    映射： Mapping: ContentsController->view();
    $this->passedArgs['chapter'] = 'models';
    $this->passedArgs['section'] = 'associations';
    $this->params['named']['chapter'] = 'models';
    $this->params['named']['section'] = 'associations';

当制定自定义路由时，一个常见错误是，使用命名参数会破坏你的自定义路由。为了解决这
个问题，你应当告诉路由器哪个参数要作为命名参数。不知道这个，路由器就无法决定命名
的参数实际上是要作为命名参数还是路由参数，而会默认认为你要它们作为路由参数。要在
路由器中使用命名参数，请使用 :php:meth:`Router::connectNamed()` 方法::

    Router::connectNamed(array('chapter', 'section'));

这会确保反向路由正确地处理你的 chapter 和 section 参数。

当生成网址时，使用 :term:`routing array` 就可以把和名称匹配的字符串键及其值添加
为命名参数::

    array('controller' => 'posts', 'action' => 'view', 'chapter' => 'association')

因为 'chapter' 不匹配任何定义的路由元素，它就会被认为是命名参数。

.. note::

    命名参数和路由元素共享相同的键空间。最好避免对路由元素和命名参数重用同一个键。

命名参数也支持使用数组来生成和解析网址。语法和 GET 参数的数组语法非常类似。当生
成网址时可以使用以下语法::

    $url = Router::url(array(
        'controller' => 'posts',
        'action' => 'index',
        'filter' => array(
            'published' => 1,
            'frontpage' => 1
        )
    ));

以上代码会生成网址 ``/posts/index/filter[published]:1/filter[frontpage]:1``。然
后参数会被解析，并作为数组存储在控制器的 passedArgs 变量中，就象你把它们发送给 
:php:meth:`Router::url` 一样::

    $this->passedArgs['filter'] = array(
        'published' => 1,
        'frontpage' => 1
    );

数组也可以深度嵌套，让你在传递参数时有更多的灵活性::

    $url = Router::url(array(
        'controller' => 'posts',
        'action' => 'search',
        'models' => array(
            'post' => array(
                'order' => 'asc',
                'filter' => array(
                    'published' => 1
                )
            ),
            'comment' => array(
                'order' => 'desc',
                'filter' => array(
                    'spam' => 0
                )
            ),
        ),
        'users' => array(1, 2, 3)
    ));

你就会得到象这样相当长的网址(折行是为了便于阅读)::

    posts/search
      /models[post][order]:asc/models[post][filter][published]:1
      /models[comment][order]:desc/models[comment][filter][spam]:0
      /users[]:1/users[]:2/users[]:3

得到的要传递给控制器的数组，和传递给路由器的是一致的::

    $this->passedArgs['models'] = array(
        'post' => array(
            'order' => 'asc',
            'filter' => array(
                'published' => 1
            )
        ),
        'comment' => array(
            'order' => 'desc',
            'filter' => array(
                'spam' => 0
            )
        ),
    );

.. _controlling-named-parameters:

控制命名参数
------------

你可以在路由级别或者在全局级别控制命名参数的配置。全局控制通过 
``Router::connectNamed()`` 进行。下面是一些例子，说明如何使用 connectNamed() 方
法来控制命名参数的解析。

不解析任何命名参数::

    Router::connectNamed(false);

只解析 CakePHP 用于分页的默认参数::

    Router::connectNamed(false, array('default' => true));

只有当 page 参数是数字时才只解析它::

    Router::connectNamed(
        array('page' => '[\d]+'),
        array('default' => false, 'greedy' => false)
    );

只解析 page 参数，不论它是什么::

    Router::connectNamed(
        array('page'),
        array('default' => false, 'greedy' => false)
    );

如果当前动作是 'index'，只解析 page 参数::

    Router::connectNamed(
        array('page' => array('action' => 'index')),
        array('default' => false, 'greedy' => false)
    );

如果当前动作是 'index' 而且控制器是 'pages'，只解析 page 参数::

    Router::connectNamed(
        array('page' => array('action' => 'index', 'controller' => 'pages')),
        array('default' => false, 'greedy' => false)
    );


connectNamed() 方法支持一些选项：

* ``greedy`` 设置为 true 会使路由器解析所有命名参数。设置为 false 则只会解析连接
  的命名参数。
* ``default`` 设置为 true 会合并入默认的一组命名参数。
* ``reset`` 设置为 true 来清除现有的规则，从头开始。
* ``separator`` 改变在命名参数中用来分隔键和值的字符串。默认为 `:`。

反向路由
========

反向路由是 CakePHP 中的特性，用来让你容易地改变网址结构，而不必改动所有代码。使
用 :term:`路由数组 <routing array>` 来定义网址，以后你就可以配置路由，而生成的网
址就会自动更新。

如果象下面这样用字符串创建网址::

    $this->Html->link('View', '/posts/view/' . $id);

而后来决定 ``/posts`` 实际上应该叫做 'articles'，你就不得不查看整个应用程序的代
码，替换网址。然而，如果象下面这样定义链接::

    $this->Html->link(
        'View',
        array('controller' => 'posts', 'action' => 'view', $id)
    );

那么当你决定改变网址时，你可以只定义一个路由就达到目的。这不但会改变接收网址的映
射，也改变了生成的网址。

在使用数组网址时，你可以使用特殊的键来定义查询字符串(*query string*)参数和文档片
段(*document fragment*)::

    Router::url(array(
        'controller' => 'posts',
        'action' => 'index',
        '?' => array('page' => 1),
        '#' => 'top'
    ));

    // 会生成类似这样的网址
    /posts/index?page=1#top

.. _redirect-routing:

重定向路由
==========

重定向路由让你可以对收到的路由发送 HTTP 状态 30x 重定向，把它们指向不同的网址。
这可以用于当你想要通知客户端应用程序，一个资源被移动了，而你又不想为同一内容分配
两个网址。

重定向路由不同于普通路由，因为如果遇到匹配的网址，实际上会执行文件头重定向。重定
向可以指向应用程序内的目标，也可以指向外部的地址::

    Router::redirect(
        '/home/*',
        array('controller' => 'posts', 'action' => 'view'),
        // 或者对视图动作等待 $id 作为参数的默认路由，使用
        // array('persist'=>array('id'))
        array('persist' => true)
    );

重定向 ``/home/*`` 到 ``/posts/view``，并传递参数到 ``/posts/view``。使用数组作
为重定向目标让你可以使用其它路由来定义字符串网址应该重定向到哪里。你可以使用字符
串网址作为目标重定向到外部地址::

    Router::redirect('/posts/*', 'http://google.com', array('status' => 302));

这会以 HTTP 状态 302 重定向 ``/posts/*`` 到 ``http://google.com``。

.. _disabling-default-routes:

关闭默认路由
============

如果你完全自定义了全部路由，并想要避免任何可能来自搜索引擎的重复内容惩罚，你可以
从应用程序的 routes.php 文件删除 CakePHP 提供的默认路由来去掉它们。

当用户试图访问通常由 CakePHP 提供但没有显式连接的网址，就会引起 CakePHP 报错。

.. _custom-route-classes:

自定义路由类
============

自定义路由类让你可以扩展并改变单个路由如何解析请求和处理反向路由。自定义路由应当
在 ``app/Routing/Route`` 目录中创建，而且应当扩展 :php:class:`CakeRoute` 并实现 
``match()`` 和 ``parse()`` 两个方法中的一个或全部。``parse()`` 方法用于解析请求，
而 ``match()`` 方法用于处理反向路由。

要使用自定义路由，你可以在指定路由时使用 ``routeClass`` 选项，并且在使用它之前加
载包含路由(类)的文件::

    App::uses('SlugRoute', 'Routing/Route');

    Router::connect(
         '/:slug',
         array('controller' => 'posts', 'action' => 'view'),
         array('routeClass' => 'SlugRoute')
    );

这个路由会创建一个 ``SlugRoute`` 类的实例，让你可以实现自定义参数处理。

路由 API
==========

.. php:class:: Router

    路由器管理发出网址的生成、解析接收的请求网址为 CakePHP 可以调配的参数集。

.. php:staticmethod:: connect($route, $defaults = array(), $options = array())

    :param string $route: 描述路由模板的字符串。
    :param array $defaults: 描述默认路由参数的数组。这些参数默认会被使用，可以被
        提供非动态的路由参数。
    :param array $options: 路由中命名元素和对应的元素应当匹配的正则表达式构成的
        数组。也包含额外的参数，比如哪个路由参数应当移入传入参数，提供路由参数的
        模式，以及提供自定义路由类的名称。

    路由是一种连接请求网址和应用程序中的对象的方法。在其核心，路由是用于匹配请求
    到目的地的一组正则表达式。

    例如::

        Router::connect('/:controller/:action/*');

    第一个参数被当作控制器名称，而第二个参数被当作当作名称。'/\*' 语法使该路由贪
    婪，这样它就会匹配象 `/posts/index` 以及象 ``/posts/edit/1/foo/bar`` 这样的
    请求。 ::

        Router::connect(
            '/home-page',
            array('controller' => 'pages', 'action' => 'display', 'home')
        );

    上面这个说明路由参数默认值的用法。而为静态路由提供路由参数。 ::

        Router::connect(
            '/:lang/:controller/:action/:id',
            array(),
            array('id' => '[0-9]+', 'lang' => '[a-z]{3}')
        );

    说明连接路由和自定义路由参数，以及为这些参数提供模式。路由参数的模式不需要捕
    获分组(*capturing group*)，因为每个路由参数都会(自动)添加一个(捕获分组)。

    $options 参数提供了三个'特殊的'键。``pass`` 、 ``persist`` 和 ``routeClass``
    在 $options 数组中有特殊的含义。

    * ``pass`` 用于定义那个路由参数应当移入 pass 数组。添加参数到 pass 数组会把
      它从正常的路由数组中删除。例如 ``'pass' => array('slug')``。

    * ``persist`` 用于定义在生成新网址时哪个路由参数应当自动包括在内。你可以覆盖
      持久参数，只需在网址中重新定义它们，或者通过设置该参数为 ``false``。例如 
      ``'persist' => array('lang')``。

    * ``routeClass`` 用于通过自定义路由类来扩展和改变单个路由如何解析请求及处理
      反向路由。例如 ``'routeClass' => 'SlugRoute'``。

    * ``named`` 用于在路由级别配置命名参数。该键使用与 
      :php:meth:`Router::connectNamed()` 相同的键。

.. php:staticmethod:: redirect($route, $url, $options = array())

    :param string $route: 路由模板，决定哪些网址要重定向。
    :param mixed $url: 重定向目的地，或者是 :term:`routing array` 或者是字符串网
        址。
    :param array $options: 重定向选项数组。

    连接路由器中新的重定向路由。欲知详情，请参见 :ref:`redirect-routing`。

.. php:staticmethod:: connectNamed($named, $options = array())

    :param array $named: 命名参数列表。接受键值对，值为要匹配的正则表达式字符串、
        或者数组。
    :param array $options: 可以控制所有设置：
        separator、greedy、reset、default。

    指定 CakePHP 应当从接收的网址中解析哪些命名参数。默认情况下，CakePHP 会从收
    到的网址中解析所有命名参数。欲知详情，请参见 
    :ref:`controlling-named-parameters`。

.. php:staticmethod:: promote($which = null)

    :param integer $which: 从零开始的数组索引，代表要移动的路由。例如，如果添加
        了 3 个路由，最后一个路由就是 2。

    把一个路由(默认情况下，是最后一个添加的)提前到列表的最开始。

.. php:staticmethod:: url($url = null, $full = false)

    :param mixed $url: CakePHP 的相对网址，比如 "/products/edit/92" 或者
        "/presidents/elect/4" 或者 :term:`routing array`
    :param mixed $full: 如果是 (boolean) true，完整的基准目录网址会加在结果前面。
        如果是数组，则接受如下的键

           * escape — 用于当生成嵌入 HTML 的网址时，转义查询字符串'&'
           * full — 如果为 true，完整的基准目录网址会加在前面。

    生成指定动作的网址。返回网址指向控制器和动作组合的网址。$url 可以是：

    * Empty — 该方法会寻找真正的控制器/动作的地址。
    * '/' — 该方法会寻找应用程序的基准网址。
    * 控制器/动作的组合 — 该方法会寻找其对应的网址。

    有一些'特殊'的参数会改变最终生成的网址字符串：

    * ``base`` — 设置为 false 来去掉生成的网址中的基准路径。如果你的应用程序不在
      根目录，这可以用来生成'CakePHP 的相对'网址。CakePHP 的相对网址在使用 
      requestAction 是必须的。
    * ``?`` — 接受查询字符串参数数组
    * ``#`` — 让你可以设置网址哈希片段(*hash fragment*)。
    * ``full_base`` — 如果是 true，:php:meth:`Router::fullBaseUrl()` 的值会附加
      在生成的网址的前面。

.. php:staticmethod:: mapResources($controller, $options = array())

    创建给定控制器的 REST 资源路由。欲知详情，请参见 :doc:`/development/rest` 一
    节。

.. php:staticmethod:: parseExtensions($types)

    用在 routes.php 文件中来声明应用程序支持哪个 :ref:`file-extensions`。不提供
    参数，则支持所有的文件扩展名。

.. php:staticmethod:: setExtensions($extensions, $merge = true)

    .. versionadded:: 2.2

    设置或添加合法的扩展名。要解析扩展名，你仍然必须调用 
    :php:meth:`Router::parseExtensions()` 方法。

.. php:staticmethod:: defaultRouteClass($classname)

    .. versionadded:: 2.1

    设置将来连接路由时使用的默认路由。

.. php:staticmethod:: fullBaseUrl($url = null)

    .. versionadded:: 2.4

    获得或设置生成网址时使用的基准网址(*baseURL*)。设置该值时，应当确保引入包括
    协议的完全合格域名(*fully qualified domain name*)。

    用该方法设置值，也会更新 :php:class:`Configure` 中的 ``App.fullBaseUrl``。

.. php:class:: CakeRoute

    自定义路由基于的基类。

.. php:method:: parse($url)

    :param string $url: 要解析的字符串网址。

    解析收到的网址，并生成请求参数数组，供调度器(*dispatcher*)处理。扩展这个方法
    让你可以定制如何把收到的网址转换成数组。从网址返回 ``false`` 来表示不匹配。

.. php:method:: match($url)

    :param array $url: 要转换成字符串网址的路由数组。

    试图匹配网址数组。如果网址匹配路由参数和设置，就返回生成的字符串网址。如果网
    址不匹配路由参数，返回 false。该方法处理网址数组的反向路由或转换为字符串网址。

.. php:method:: compile()

    强制路由编译它的正则表达式。


.. meta::
    :title lang=zh: Routing
    :keywords lang=zh: controller actions,default routes,mod rewrite,code index,string url,php class,incoming requests,dispatcher,url url,meth,maps,match,parameters,array,config,cakephp,apache,router
