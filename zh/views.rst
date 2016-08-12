视图
####

视图(*View*)是 MVC 中的 **V**。视图负责生成请求要求的特定输出。经常这是用 HTML、
XML 或者 JSON 的形式，但提供文件流和创建 PDF 供用户下载也是视图层的责任。

CakePHP 带有一些内置的视图类，可以处理大多数常见的渲染情况：

- 要创建 XML 或者 JSON 网络服务(*webservices*)，你可以使用
  :doc:`views/json-and-xml-views`。
- 要提供受保护的文件，或者动态生成文件，你可以使用 :ref:`cake-response-file`。
- 要创建多主题的视图，你可以使用 :doc:`views/themes`。

视图模板
========

CakePHP 的视图层是你和用户交流的方式。多数情况下，视图会显示 (X)HTML 文档给浏览器，
但你也可能会需要提供 AMF 数据给 Flash 对象，通过 SOAP 答复远程应用程序，或者输出
CSV 文件给用户。

缺省情况下 CakePHP 的视图文件是普通的 PHP 文件，并缺省以 .ctp (CakePHP Template)
为扩展名。这些文件包括所有的表现层逻辑，把它从控制器获得的数据，表现为你所服务的
受众需要的格式。如果你喜欢使用象 Twig 或 Smarty 这样的模板语言，视图的子类可以衔
接起你的模板语言和 CakePHP。

视图文件保存在 ``/app/View/`` 目录下，在一个以使用这些视图文件的控制器命名的目录
中，并以对应的动作为文件名。例如，Products 控制器的 "view()" 动作的视图文件，通常
应该会位于 ``/app/View/Products/view.ctp`` 。

CakePHP 的视图层可以由一些不同的部分组成。每部分有不同的用途，在本章中都会进行介
绍:

- **视图(view)** ：视图是网页中对于运行的动作唯一的部分。这构成了你的应用程序响应
  的主要内容。
- **元素(elements)** ：更小的、可重用的视图单元。元素通常在视图内渲染。
- **布局(layouts)** ：在应用程序中包含表现层代码、包裹很多界面的视图文件。大部分
  视图在一个布局中渲染。
- **助件(helper)** ：这些类封装了在视图层许多地方需要的视图逻辑。CakePHP 的助件可
  以帮助你创建表单，构建 AJAX 功能，对模型数据进行分页，或者提供 RSS 数据，以及其
  它功能。


.. _extending-views:

扩展视图
--------

.. versionadded:: 2.1

视图的扩展允许你在一个视图内包含另一个视图。把它与 :ref:`视图代码块 <view-blocks>`
结合，提供了一个强大的方式来保持你的视图 :term:`DRY`。例如，你的应用程序有一个
*侧边栏(sidebar)* ，根据渲染的特定视图而变化。通过扩展一个共用的视图文件，你可以
避免重复侧边栏的共用标记，而只定义不同的部分：

.. code-block:: php

    // app/View/Common/view.ctp
    <h1><?php echo $this->fetch('title'); ?></h1>
    <?php echo $this->fetch('content'); ?>

    <div class="actions">
        <h3>Related actions</h3>
        <ul>
        <?php echo $this->fetch('sidebar'); ?>
        </ul>
    </div>

上面的视图文件可以用作父视图。它需要扩展它的视图来定义 ``sidebar`` 和 ``title`` 
代码块。``content`` 代码块是个 CakePHP 创建的特殊代码块。它会包括所有子视图中未捕
获的内容。假设我们的视图文件有一个 ``$posts`` 变量，含有与我们的文章有关的数据。
我们的视图可以像这样:

.. code-block:: php

    <?php
    // app/View/Posts/view.ctp
    $this->extend('/Common/view');

    $this->assign('title', $post);

    $this->start('sidebar');
    ?>
    <li>
    <?php
    echo $this->Html->link('edit', array(
        'action' => 'edit',
        $post['Post']['id']
    )); ?>
    </li>
    <?php $this->end(); ?>

    // 其余的内容会作为父视图中的 'content' 代码块。
    <?php echo h($post['Post']['body']);

上面 *文章(post)* 的 view 视图说明如何扩展视图，以及填充一组代码块。任何不在一个
定义过的代码块内的内容，会被捕获并放入一个特殊的叫做 ``content`` 的代码块。当一个
视图含有对 ``extend()`` 的调用时，程序会继续执行到当前的视图文件结束。一旦执行完
成，扩展的视图就会被渲染。在一个视图文件中多次调用 ``extend()`` 会改变接下去要处
理的父视图::

    $this->extend('/Common/view');
    $this->extend('/Common/index');

以上代码会导致 ``/Common/index.ctp`` 作为当前视图的父视图来渲染。

如果必要的话，你可以嵌套扩展视图任意多层。如果有必要，每个视图都可以扩展另一个视
图。每个父视图都会获得前一个视图的内容作为 ``content`` 代码块。

.. note::

    你应当避免使用 ``content`` 作为应用程序中代码块的名字。CakePHP 把它用于扩展视
    图中未捕获的内容。


.. _view-blocks:

使用视图代码块
==============

.. versionadded:: 2.1

视图代码块代替了 ``$scripts_for_layout``，并提供了一种灵活的 API，允许你在视图/
布局中引用在其它地方定义的代码段或代码块。例如，代码块很适合于实现侧边栏这样的东
西，或者位于布局底部/顶部加载内容的区域。代码块可以用两种方式定义，或者作为捕获
代码块，或者直接赋值。``start()`` 、 ``append()`` 和 ``end()`` 方法可以用于捕获代
码块::

    // 创建侧边栏代码块。
    $this->start('sidebar');
    echo $this->element('sidebar/recent_topics');
    echo $this->element('sidebar/recent_comments');
    $this->end();


    // 之后添加内容到侧边栏的末尾。
    $this->append('sidebar');
    echo $this->element('sidebar/popular_topics');
    $this->end();

你也可以用 ``start()`` 来多次添加内容到代码块之内。``assign()`` 方法可以用来在任
何时候清除或者覆盖代码块::

    // 清除侧边栏代码块之前的内容。
    $this->assign('sidebar', '');


在 2.3 版本中，添加了一些新的用于代码块的方法。``prepend()`` 方法用于在一个现有代
码块的开头插入内容::

    // 在侧边栏的开头插入内容
    $this->prepend('sidebar', 'this content goes on top of sidebar');

``startIfEmpty()`` 方法可用于 **只有** 当一个代码块是空的或为未定义时才开始一个代
码块。如果该代码块已经存在，则当前捕获内容就会被抛弃。当你要有条件地定义一个代码
块当它尚未定义过时的缺省内容时，就有用了：

.. code-block:: php

    // 在一个视图文件中。
    // 创建一个导航栏代码块
    $this->startIfEmpty('navbar');
    echo $this->element('navbar');
    echo $this->element('notifications');
    $this->end();

.. code-block:: php

    // 在一个父视图/布局中
    <?php $this->startIfEmpty('navbar'); ?>
    <p>If the block is not defined by now - show this instead</p>
    <?php $this->end(); ?>

    // 在一个父视图/布局中更靠后的地方
    echo $this->fetch('navbar');

在上面的例子中， ``navbar`` 代码块只会包含第一部分中添加的内容。由于代码块在子视
图中定义，含有 ``<p>`` 标签的缺省内容就会被舍弃。

.. versionadded: 2.3
    ``startIfEmpty()`` 和 ``prepend()`` 是在 2.3 版本中增加。

.. note::

    你应当避免使用 ``content`` 作为代码块的名称。这被 CakePHP 内部用于扩展视图以
    及布局中的视图内容。


显示代码块
----------

.. versionadded:: 2.1

你可以用 ``fetch()`` 方法显示代码块。``fetch()`` 方法会安全地输出一个代码块，而在
代码块不存在时返回 ''::

    echo $this->fetch('sidebar');

你也可以用 ``fetch()`` 在只有当代码块存在时显示包围在它周围的内容。在布局或扩展视
图中，当你要根据条件来显示标题或者其它内容，这就会有用了:

.. code-block:: php

    // 在 app/View/Layouts/default.ctp 中
    <?php if ($this->fetch('menu')): ?>
    <div class="menu">
        <h3>Menu options</h3>
        <?php echo $this->fetch('menu'); ?>
    </div>
    <?php endif; ?>

在 2.3.0 版本中，你可以为代码块提供当它没有任何内容时的缺省值。这让你可以容易地添
加空状态时的占位内容。你可以用第二个参数提供缺省值:

.. code-block:: php

    <div class="shopping-cart">
        <h3>你的购物车</h3>
        <?php echo $this->fetch('cart', '你的购物车为空'); ?>
    </div>

.. versionchanged:: 2.3
    ``$default`` 参数在 2.3 版本中添加。

代码块用于脚本和 CSS 文件
-------------------------

.. versionadded:: 2.1

代码块取代了作废的 ``$scripts_for_layout`` 布局变量。你应当使用代码块。
:php:class:`HtmlHelper` 与视图代码块紧密结合，它的 
:php:meth:`~HtmlHelper::script()` 、 :php:meth:`~HtmlHelper::css()` 和 
:php:meth:`~HtmlHelper::meta()` 方法，当使用 ``inline = false`` 选项时，会更新各
自对应名称的代码块：

.. code-block:: php

    <?php
    // 在你的视图文件中
    $this->Html->script('carousel', array('inline' => false));
    $this->Html->css('carousel', array('inline' => false));
    ?>

    // 在你的布局文件中。
    <!DOCTYPE html>
    <html lang="en">
        <head>
        <title><?php echo $this->fetch('title'); ?></title>
        <?php echo $this->fetch('script'); ?>
        <?php echo $this->fetch('css'); ?>
        </head>
        // 后面是布局的其余部分

:php:meth:`HtmlHelper` 也让你控制脚本(*script*)和 CSS 会出现在哪个代码块中::

    // 在你的视图中
    $this->Html->script('carousel', array('block' => 'scriptBottom'));

    // 在你的布局中
    echo $this->fetch('scriptBottom');

.. _view-layouts:

布局
====

布局含有包裹视图的表现层代码。任何你想要在所有视图中出现的东西，应该放在布局中。

CakePHP 的缺省布局位于 ``/app/View/Layouts/default.ctp``。如果你想改变应用程序的
整体外观，那么正确的地方就应该从这里开始，因为当页面渲染时，控制器渲染的视图代码
就会放在缺省的布局里面。

其它的布局文件应当放在 ``/app/View/Layouts`` 目录内。当你创建一个布局时，你需要
告诉 CakePHP 视图的输出要放在哪里。为此，确保你的布局有一处包括 
``$this->fetch('content')`` 。一个缺省布局的例子可能是下面这样的：

.. code-block:: php

   <!DOCTYPE html>
   <html lang="en">
   <head>
   <title><?php echo $this->fetch('title'); ?></title>
   <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
   <!-- 在这里引入外部文件和脚本(欲知更多信息，请参见 HTML 助件) -->
   <?php
   echo $this->fetch('meta');
   echo $this->fetch('css');
   echo $this->fetch('script');
   ?>
   </head>
   <body>

   <!-- 如果你要某种菜单出现在你所有的视图中，在这里引入。 -->
   <div id="header">
       <div id="menu">...</div>
   </div>

   <!-- 这里显示我的视图 -->
   <?php echo $this->fetch('content'); ?>

   <!-- 为每个显示的页面添加底边栏。 -->
   <div id="footer">...</div>

   </body>
   </html>

.. note::

    在 2.1 版本之前，没有 fetch() 方法。 ``fetch('content')`` 代替了 
    ``$content_for_layout`` ， ``fetch('meta')`` 、``fetch('css')`` 和 
    ``fetch('script')`` (所生成的行)包含在 2.0 版本的 ``$scripts_for_layout`` 变
    量中。

``script`` 、 ``css`` 和 ``meta`` 代码块包含任何在视图中用内置的 HTML 助件定义的
内容。这可用于从视图中引入 javascript 和 CSS 文件。

.. note::

    在视图文件中使用 :php:meth:`HtmlHelper::css()` 和 
    :php:meth:`HtmlHelper::script()` 时，对 'inline' 选项指定 'false'，就可以把 
    html 源代码放入同名的代码块中了。(欲知用法的更多细节，请参看 API。)

``content`` 代码块含有渲染的视图的内容。

``$title_for_layout`` 含有页面的标题。这个变量是自动生成的，不过你可以通过在控制
器/视图中给它赋值来覆盖它。

.. note::

    ``$title_for_layout`` 在 2.5 版本中已经作废，请在布局中使用 
    ``$this->fetch('title')`` 以及 ``$this->assign('title', 'page title')`` 来代
    替。

设置布局的标题，最容易的方法是在控制器中设置 ``$title_for_layout`` 变量::

   class UsersController extends AppController {
       public function view_active() {
           $this->set('title_for_layout', 'View Active Users');
       }
   }

你也可以在视图文件中设置 title_for_layout 变量::

    $this->set('title_for_layout', $titleContent);

你可以想要多少布局，就创建多少：只需把它们放在 ``app/View/Layouts`` 目录中，并在
控制器动作中用控制器或者视图的 :php:attr:`~View::$layout` 属性来切换布局::

    // 从一个控制器
    public function admin_view() {
        // 代码
        $this->layout = 'admin';
    }

    // 从一个视图文件
    $this->layout = 'loggedin';

例如，如果我的网站的一个地方包含一小块广告栏(ad banner)，我也许会建一个新的含有小
块广告位置的布局，并指定它为所有控制器动作的布局，象下面这样::

   class UsersController extends AppController {
       public function view_active() {
           $this->set('title_for_layout', 'View Active Users');
           $this->layout = 'default_small_ad';
       }

       public function view_image() {
           $this->layout = 'image';
           // 输出用户图像
       }
   }

CakePHP 有两个核心的布局(除了 CakePHP 的缺省布局)，供你在你自己的应用程序中使用：
'ajax' 和 'flash'。Ajax 布局对生成 AJAX 响应很方便——这是一个空的布局。(绝大部分 
AJAX 调用在返回值中只需要一点儿标记，而不是一个完整渲染的界面。) flash 布局用于 
:php:meth:`Controller::flash()` 方法显示的消息。

其它三个核心中的布局，xml、js 和 rss，以快速简便的方式提供非 text/html 的内容。

使用插件中的布局
----------------

.. versionadded:: 2.1

如果你要用存在于插件中的布局，你可以使用 :term:`plugin syntax` 。比如要用 
Contacts 插件中的 contact 布局::

    class UsersController extends AppController {
        public function view_active() {
            $this->layout = 'Contacts.contact';
        }
    }


.. _view-elements:

元素
====

许多应用程序有小段的表现层代码，要在不同页面重复使用，有时要在布局的不同地方重复
使用。CakePHP 能够帮助你重复使用网站中要重用的部分。这些可重用的部分叫元素
(*element*)。广告、帮助框、导航控件、额外的菜单、登录表单和 callout 在 CakePHP 
中经常用元素实现。元素基本上是一个微型视图，可以被引入到其它视图、布局甚至其它元
素中。元素的运用可使视图的可读性更好，把重复元素的渲染放入它们自己的文件中。它们
也可以帮助你重用应用程序中的内容片段。

元素存在于 ``/app/View/Elements/`` 目录中，并以 .ctp 为文件扩展名。它们用视图的 
element 方法来输出::

    echo $this->element('helpbox');

给元素传入参数
--------------

你可以通过 element 方法的第二个参数给元素传入数据::

    echo $this->element('helpbox', array(
        "helptext" => "Oh, this text is very helpful."
    ));

在元素文件中，所有传入的参数可用参数数组成员来获得(和控制器中使用 
:php:meth:`Controller::set()` 方法为视图文件设置参数的方式相同)。在上述例子中，
``/app/View/Elements/helpbox.ctp`` 文件可使用 ``$helptext`` 变量::

    // 在 app/View/Elements/helpbox.ctp 中
    echo $helptext; // 输出为 "Oh, this text is very helpful."

:php:meth:`View::element()` 方法也支持元素的配置选项。支持的选项为 'cache' 和 
'callbacks' 。例如::

    echo $this->element('helpbox', array(
            "helptext" => "This is passed to the element as $helptext",
            "foobar" => "This is passed to the element as $foobar",
        ),
        array(
            // 使用"long_view"缓存配置
            "cache" => "long_view",
            // 置为 true， 让元素的 before/afterRender 回调被调用
            "callbacks" => true
        )
    );

元素的缓存通过 :php:class:`Cache` 类来进行。你可以设置元素保存于任何你设置好的缓
存配置。这给予你极大的灵活性，来决定元素保存在哪里，以及保存多长时间。要在一个应
用程序中缓存同一元素的不同版本，请用下面的格式提供一个唯一的缓存键值::

    $this->element('helpbox', array(), array(
            "cache" => array('config' => 'short', 'key' => 'unique value')
        )
    );

你可以用 ``requestAction()`` 方法来充分利用元素。``requestAction()`` 方法从控制器
动作获取视图变量，再以数组返回。这让你的元素能够以真正的 MVC 方式运作。创建一个控
制器动作来为你的元素准备视图变量，然后在 ``element()`` 的第二个参数中调用 
``requestAction()`` ，就可以从控制器给元素提供视图变量。

为此，在文章(*Post*)的例子中，在你的控制器中添加下面这样的代码::

    class PostsController extends AppController {
        // ...
        public function index() {
            $posts = $this->paginate();
            if ($this->request->is('requested')) {
                return $posts;
            }
            $this->set('posts', $posts);
        }
    }

然后在元素中我们就可以访问分页的 posts 模型了。要得到最近的五篇文章(*post*)的有序
队列，我们可以这样做:

.. code-block:: php

    <h2>Latest Posts</h2>
    <?php
      $posts = $this->requestAction(
        'posts/index/sort:created/direction:asc/limit:5'
      );
    ?>
    <ol>
    <?php foreach ($posts as $post): ?>
          <li><?php echo $post['Post']['title']; ?></li>
    <?php endforeach; ?>
    </ol>

对元素进行缓存
--------------

如果你提供一个 cache 参数，你就可以利用 CakePHP 的视图缓存。如果设为 true，元素就
会被缓存在 'default' 缓存配置中。否则，你可设置应该使用哪个缓存配置。欲知更多配置 
:php:class:`Cache` 的信息，请参看 :doc:`/core-libraries/caching`。下面是缓存元素
的一个简单例子::

    echo $this->element('helpbox', array(), array('cache' => true));

如果你在同一个视图中多次渲染同样的元素，并启用了缓存，记得每次把 'key' 参数设置为
不同名字。这样就可以防止每次后续的调用覆盖前一次元素调用的缓存结果。例如::

    echo $this->element(
        'helpbox',
        array('var' => $var),
        array('cache' => array('key' => 'first_use', 'config' => 'view_long')
    );

    echo $this->element(
        'helpbox',
        array('var' => $differenVar),
        array('cache' => array('key' => 'second_use', 'config' => 'view_long')
    );

这样就会确保两次元素调用的结果被分别缓存。如果你要所有的元素缓存使用相同的缓存配
置，你可以省去一些重复，只需把 :php:attr:`View::$elementCache` 设置为你要使用的缓
存配置。如果没有指定配置，CakePHP 就会使用这个配置。

请求插件中的元素
----------------

2.0
---

要加载插件中的元素，使用 `plugin` 选项(已从 1.x 版本中的 `data` 选项中移出)::

    echo $this->element('helpbox', array(), array('plugin' => 'Contacts'));

2.1
---

如果你使用插件，并且使用插件中的元素，只需使用熟悉的 :term:`plugin syntax`。如果
视图是为插件中的控制器/动作而渲染，使用的所有元素都会自动添加插件名称为其前缀，除
非已有了另一个插件名称。如果元素不在插件内，就会在主 APP 目录内查找。 ::

    echo $this->element('Contacts.helpbox');

如果你的视图是插件的一部分，你可以省略插件名称。例如，如果你在 Contacts 插件的 
``ContactsController`` 中，下面的::

    echo $this->element('helpbox');
    // 和
    echo $this->element('Contacts.helpbox');

是一样的，会导致同一个元素被渲染。

.. versionchanged:: 2.1
    ``$options[plugin]`` 选项被废弃，增加了对 ``Plugin.element`` 的支持。


创建你自己的视图类
==================

你也许会需要创建定制的视图类，以用于新的数据视图，或者为应用程序增加额外的定制视
图渲染逻辑。象 CakePHP 的大部分组成部件一样，视图类也有一些约定:

* 视图类应当放在 ``App/View`` 目录中。例如 ``App/View/PdfView.php``。
* 视图类应当以 ``View`` 为后缀。例如 ``PdfView``。
* 当引用视图类名称时，你应当省略 ``View`` 后缀。例如
  ``$this->viewClass = 'Pdf';``。

为使其正常工作，你应当扩展 ``View``::

    // 在 App/View/PdfView.php 中

    App::uses('View', 'View');
    class PdfView extends View {
        public function render($view = null, $layout = null) {
            // 这里为定制逻辑。
        }
    }

替换 render 方法让你能够完全控制内容是如何渲染的。

视图 API
========

.. php:class:: View

视图方法在所有视图、元素和布局文件中都可使用。要调用任何视图方法，使用 
``$this->method()``。

.. php:method:: set(string $var, mixed $value)

    视图也有 ``set()`` 方法，就像控制器对象的 ``set()`` 方法类似。在你的视图文件
    中使用 set() 方法，会添加变量到以后渲染的布局和元素中。欲知关于使用 set() 的
    更多信息，请看 :ref:`controller-methods`。

    在你的视图文件中你可以::

        $this->set('activeMenuButton', 'posts');

    然后在你的布局中，变量 ``$activeMenuButton`` 就可以使用，并含有值 'posts'。

.. php:method:: get(string $var, $default = null)

    获得以 ``$var`` 命名的视图变量的值。

    在 2.5 版本中，你可以提供一个缺省值，以备变量尚未设置之需。

    .. versionchanged:: 2.5
        ``$default`` 参数是在 2.5 版本中增加的。

.. php:method:: getVar(string $var)

    获得以 ``$var`` 命名的视图变量的值。

    .. deprecated:: 2.3
        请使用 :php:meth:`View::get()` 代替。

.. php:method:: getVars()

    获得当前渲染作用域范围内所有可以使用的视图变量的列表，返回变量名称的数组。

.. php:method:: element(string $elementPath, array $data, array $options = array())

    渲染一个元素或视图片段。欲知更多信息和例子，请参看 :ref:`view-elements` 一节。

.. php:method:: uuid(string $object, mixed $url)

    基于对象的类型和网址，为该对象生成一个唯一的、非随机的 DOM ID。这个方法经常被
    象 :php:class:`JsHelper` 这样需要为 HTML 元素生成唯一的 DOM ID 的助件所使用::

        $uuid = $this->uuid(
          'form',
          array('controller' => 'posts', 'action' => 'index')
        );
        // $uuid 含有 'form0425fe3bad'

.. php:method:: addScript(string $name, string $content)

    添加内容到内部的脚本缓冲区。这个缓冲区可在布局中用 ``$scripts_for_layout`` 来
    访问。这个方法在创建需要直接向布局添加 javascript 或者 css 的助件时，会有用。
    切记，从布局或布局中的元素添加的脚本，不会被加到 ``$scripts_for_layout`` 中。
    这个方法最常用在助件内，比如 :doc:`/core-libraries/helpers/js` 和 
    :doc:`/core-libraries/helpers/html` 助件。

    .. deprecated:: 2.1
        请不要再用，而是使用 :ref:`view-blocks`。

.. php:method:: blocks

    获得以一个数组表示的所有定义的代码块的名称。

.. php:method:: start($name)

    开始视图代码块的捕获块。例子参见 :ref:`view-blocks` 一节。

    .. versionadded:: 2.1

.. php:method:: end

    结束最近开始的捕获块。例子参见 :ref:`view-blocks` 一节。

    .. versionadded:: 2.1

.. php:method:: append($name, $content)

    附加在以 ``$name`` 命名的代码块末尾。例子参见 :ref:`view-blocks` 一节。

    .. versionadded:: 2.1

.. php:method:: prepend($name, $content)

    添加到以 ``$name`` 命名的代码块的开头。例子参见 :ref:`view-blocks` 一节。

    .. versionadded:: 2.3

.. php:method:: startIfEmpty($name)

    只有当一个代码块为空时，才开始这个代码块。若该代码块已经定义，则该代码块(在这
    里定义的)的全部内容会被捕获并舍弃。

    .. versionadded:: 2.3

.. php:method:: assign($name, $content)

    给一个代码块赋值。这会覆盖任何现存内容。例子参见 :ref:`view-blocks` 一节。

    .. versionadded:: 2.1

.. php:method:: fetch($name, $default = '')

    取得代码块的值。如果代码块为空或未定义，则会返回 ''。例子参见 
    :ref:`view-blocks` 一节。

    .. versionadded:: 2.1

.. php:method:: extend($name)

    用命名的视图/元素/布局扩展当前的视图/元素/布局。例子参见 
    :ref:`extending-views` 一节。

    .. versionadded:: 2.1

.. php:attr:: layout

    设置用来包含当前视图的布局。

.. php:attr:: elementCache

    用来缓存元素的缓存配置。设置该属性会改变用来缓存元素的缺省配置。缺省的(缓存配
    置)可以在 element 方法中用 'cache' 选项来改变。

.. php:attr:: request

    :php:class:`CakeRequest` 的一个实例。用这个实例来获取当前请求的信息。

.. php:attr:: output

    包含一个视图之前的渲染内容，这或者是视图文件，或者是布局内容。

    .. deprecated:: 2.1
        请不要再用，而是使用 ``$view->Blocks->get('content');``。

.. php:attr:: Blocks

    :php:class:`ViewBlock` 的实例。在视图渲染中用来提供视图代码块功能。

    .. versionadded:: 2.1

关于视图的更多内容
==================

.. toctree::
    :maxdepth: 1

    views/themes
    views/media-view
    views/json-and-xml-views
    views/helpers

.. meta::
    :title lang=zh: Views
    :keywords lang=zh: view logic,csv file,response elements,code elements,default extension,json,flash object,remote application,twig,subclass,ajax,reply,soap,functionality,cakephp,audience,xml,mvc
