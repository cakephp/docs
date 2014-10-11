JSON 和 XML 视图
################

在 CakePHP 2.1 中有两个新的视图类。``XmlView`` 和 ``JsonView`` 让你可以容易地
创建 XML 和 JSON 响应，并且与 :php:class:`RequestHandlerComponent` 集成。

在应用程序中启用 ``RequestHandlerComponent`` 的同时启用对 ``xml`` 和/或 ``json``
扩展名的支持, 你就可以自动利用新的视图了。在本节的其余部分，数据视图即指 
``XmlView`` 和 ``JsonView`` 。

有两个方法来生成数据视图。第一种办法是使用 ``_serialize`` 键，而第二种办法是创建
正常的视图文件。

在你的应用中启用数据视图
========================

在使用数据视图类之前，需要进行一些设置：

#. 用 :php:meth:`Router::parseExtensions()` 方法启用 json 和/或 xml 扩展名。这让
   路由可以处理多种扩展名。
#. 把 :php:class:`RequestHandlerComponent` 添加到控制器的组件列表中。这会让视图类
   能够自动根据内容类型进行切换。你也可以使用 ``viewClassMap`` 来设置组件，把内容
   类型映射为自定义的类及/或其它数据类型。

.. versionadded:: 2.3
    增加了 :php:meth:`RequestHandlerComponent::viewClassMap()` 方法，用于映射类型
    到视图类。以前版本的 viewClassMap 设置将不起作用。

在添加 ``Router::parseExtensions('json');`` 到你的路由文件后, 当请求使用 
``.json`` 扩展名、或者 Accept 头是 ``application/json`` 时，CakePHP 将会自动切换
视图类。

通过 serialize 键使用数据视图
=============================

``_serialize`` 键是一个特殊的视图变量，它在使用数据视图的时候指示其它的视图变量
应当如何序列化。如果在把数据转化为 json/xml 之前不需要做任何定制的格式化，那么这
样做可以让你省去为控制器的动作定义视图文件。

如果你需要在生成响应之前对视图变量进行任何格式化或者操作，你就应该创建视图文件。
``_serialize``  的值可以是字符串或者一个需要进行序列化的视图变量的数组::

    class PostsController extends AppController {
        public $components = array('RequestHandler');

        public function index() {
            $this->set('posts', $this->paginate());
            $this->set('_serialize', array('posts'));
        }
    }

你也可以定义 ``_serialize`` 为合并多个视图变量的数组::

    class PostsController extends AppController {
        public $components = array('RequestHandler');

        public function index() {
            // 创建 $posts 和 $comments 的代码
            $this->set(compact('posts', 'comments'));
            $this->set('_serialize', array('posts', 'comments'));
        }
    }

定义 ``_serialize`` 为数组有额外的好处，即，在使用 :php:class:`XmlView` 时自动添
加一个顶层的 ``<response>`` 元素。如果你设置 ``_serialize`` 为字符串，又使用 
XmlView，确保你的视图变量有一个单独的顶层元素。如果没有，Xml 就无法生成。

通过视图文件使用数据视图
========================

如果你在创建最终的输出之前想要对你的视图内容进行操作的话，你就应当使用视图文件。
例如，如果我们有一些文章(*posts*)，其中一个字段含有生成的 HTML，我们可能想在 
JSON 响应中略去该字段。这种情况下就需要用到视图文件了::

    // 控制器代码
    class PostsController extends AppController {
        public function index() {
            $this->set(compact('posts', 'comments'));
        }
    }

    // 视图代码 - app/View/Posts/json/index.ctp
    foreach ($posts as &$post) {
        unset($post['Post']['generated_html']);
    }
    echo json_encode(compact('posts', 'comments'));

你可以做更复杂的操作，也可以使用助件(*helper*)来格式化数据。

.. note::

    数据视图类不支持布局。他们假定视图文件会输出序列化的内容。

.. php:class:: XmlView

    用来生成 Xml 视图数据的视图类。上文说明了如何在应用程序中使用 XmlView。

    缺省情况下，当使用 ``_serialize`` 时，XmlView 将会用一个 ``<response>`` 节点
    将你的序列化的视图变量包起来。你可以用 ``_rootNode`` 视图变量来定制个这个节点
    的名称。

    .. versionadded:: 2.3
        新增``_rootNode`` 功能。

.. php:class:: JsonView

    用来生成 Json 视图数据的视图类。上文描述了如何在应用程序中使用 JsonView。

JSONP 响应
==========

.. versionadded:: 2.4

当使用 JsonView 时，你可以使用一个特殊的视图变量 ``_jsonp`` 来返回 JSONP 响应。设
置它为 ``true`` 使得视图类会检查是否设置了查询字符串(*query string*)参数，如果是，
就把 json 响应包裹在一个给定名称的函数内。如果你想要使用定制的查询字符串参数，而
不是 "callback"，就设置 ``_jsonp`` 为需要的名称而不是 ``true``。
