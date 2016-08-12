REST
####

许多更新的应用程序开发者意识到需要把他们的核心功能开放给更多的受众。提供对核心 
API 易用、不受限制的访问可以帮助你的平台被接受，允许与其它系统的混搭(*mashup*)和
集成。

尽管还有其它解决方法，REST 是一个很棒的方法，为你在应用程序中创建的逻辑提供容易
的访问方式。这是简单的、通常基于 XML 的(我们谈论是简单的 XML，完全不象 SOAP 信封
(*envelope*)那么复杂)，依赖于 HTTP 标头(*headers*)信息来提供指令。在 CakePHP 中
通过 REST 提供 API 很简单。

简单的设置
==========

开始使用 REST 最快捷的方法，只需在 app/Config 目录中的 routes.php 文件中添加
几行。Router 对象带有一个 ``mapResources()`` 方法，用来为控制器的 REST 访问设置
一些默认的路由。确保 ``mapResources()`` 方法出现在 
``require CAKE . 'Config' . DS . 'routes.php';`` 和其它会改变路由的路由。如果要
允许以 REST 方式访问菜单(*recipe*)数据库，就要象下面这样::

    //In app/Config/routes.php...

    Router::mapResources('recipes');
    Router::parseExtensions();

第一行为简单的 REST 访问建立一些默认路由，而 ``parseExtensions()`` 方法指定想要
的结果格式(例如 xml、json、rss)。这些路由能够辨识 HTTP 请求的方法(*Method*)。

=========== ===================== ==============================
HTTP format URL format            Controller action invoked
=========== ===================== ==============================
GET         /recipes.format       RecipesController::index()
----------- --------------------- ------------------------------
GET         /recipes/123.format   RecipesController::view(123)
----------- --------------------- ------------------------------
POST        /recipes.format       RecipesController::add()
----------- --------------------- ------------------------------
PUT         /recipes/123.format   RecipesController::edit(123)
----------- --------------------- ------------------------------
DELETE      /recipes/123.format   RecipesController::delete(123)
----------- --------------------- ------------------------------
POST        /recipes/123.format   RecipesController::edit(123)
=========== ===================== ==============================

CakePHP 的 Router 类使用一些不同的指标来检测使用的 HTTP 方法。下面按优先顺序排列：


#. The *\_method* POST variable
#. The X\_HTTP\_METHOD\_OVERRIDE
#. The REQUEST\_METHOD header

*\_method* POST 变量有助于使用浏览器(或者任何其它可以容易地 POST 的工具)作为 
REST 客户端。只需设置 \_method 为要模拟的 HTTP 请求方法的名称。

一旦路由器设置好，映射 REST 请求到某些控制器动作(*controller action*)，我们就
可以继续创建控制器动作内的逻辑。基本的控制器可以象这样::

    // Controller/RecipesController.php
    class RecipesController extends AppController {

        public $components = array('RequestHandler');

        public function index() {
            $recipes = $this->Recipe->find('all');
            $this->set(array(
                'recipes' => $recipes,
                '_serialize' => array('recipes')
            ));
        }

        public function view($id) {
            $recipe = $this->Recipe->findById($id);
            $this->set(array(
                'recipe' => $recipe,
                '_serialize' => array('recipe')
            ));
        }
        
        public function add() {
            $this->Recipe->create();
            if ($this->Recipe->save($this->request->data)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set(array(
                'message' => $message,
                '_serialize' => array('message')
            ));
        }

        public function edit($id) {
            $this->Recipe->id = $id;
            if ($this->Recipe->save($this->request->data)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set(array(
                'message' => $message,
                '_serialize' => array('message')
            ));
        }

        public function delete($id) {
            if ($this->Recipe->delete($id)) {
                $message = 'Deleted';
            } else {
                $message = 'Error';
            }
            $this->set(array(
                'message' => $message,
                '_serialize' => array('message')
            ));
        }
    }

因为我们添加了对 :php:meth:`Router::parseExtensions()` 的调用，CakePHP 的路由器
已经配置好，可以根据请求的不同种类提供不同的视图。既然我们在处理 REST 请求，我们
也会创建 XML 视图。你也可以使用 CakePHP 内置的 :doc:`/views/json-and-xml-views` 
来轻松地创建 JSON 视图。使用内置的 :php:class:`XmlView` 我们可以定义一个 
``_serialize`` 视图变量。该特殊的视图变量用于指定 ``XmlView`` 应当把哪个视图变量
序列化到 XML 中。

如果要在数据转换为 XML 之前对其进行改动，就不要定义 ``_serialize`` 视图变量，而
是使用视图文件。把 RecipesController 控制器的 REST 视图放在 
``app/View/recipes/xml`` 目录中。也可以使用 :php:class:`Xml` 类，在这些视图中
进行快捷的 XML 输出。index 视图可以象下面这样::

    // app/View/Recipes/xml/index.ctp
    // 对 $recipes 数组进行格式化和处理。
    $xml = Xml::fromArray(array('response' => $recipes));
    echo $xml->asXML();

当使用 parseExtensions() 方法提供一个特定的内容类型时，CakePHP 会自动寻找匹配
类型的视图助件。因为使用 XML 为内容类型，没有内置的助件，不过如果你要创建一个，
就会在这些视图中自动加载以供使用。

最终渲染的 XML 会象这样::

    <recipes>
        <recipe id="234" created="2008-06-13" modified="2008-06-14">
            <author id="23423" first_name="Billy" last_name="Bob"></author>
            <comment id="245" body="Yummy yummmy"></comment>
        </recipe>
        <recipe id="3247" created="2008-06-15" modified="2008-06-15">
            <author id="625" first_name="Nate" last_name="Johnson"></author>
            <comment id="654" body="This is a comment for this tasty dish."></comment>
        </recipe>
    </recipes>

创建 edit 动作的逻辑有一点复杂，但也不算太复杂。既然是提供输出 XML 的 API，选择
接受 XML 就很自然。不用担心，:php:class:`RequestHandler` 和 :php:class:`Router` 
类使事情容易得多。如果 POST 或 PUT 请求有 XML 内容类型(content-type)，那么输入就
会经过 CakePHP 的 :php:class:`Xml` 类，数据的数组形式就会赋值给 
`$this->request->data`。因为这个特性，并行处理 XML 和 POST 数据是无缝的：无需
改动控制器或模型代码。所有需要的数据都会在 ``$this->request->data`` 中。

接受其它格式的输入
==================

通常 REST 应用程序不但以多种数据格式输出内容，而且也接受不同格式的数据。在 
CakePHP 中，:php:class:`RequestHandlerComponent` 有助于实现这一点。默认情况下，
它会解码任何接收到的任何 POST/PUT 请求的 JSON/XML 输入数据，在 
`$this->request->data` 中提供该数据的数组版本。如果需要，也可以用 
:php:meth:`RequestHandler::addInputType()` 连入其它格式的反序列化。

改变默认的 REST 路由
====================

.. versionadded:: 2.1

如果默认的 REST 路由对应用程序不适用，可以用 :php:meth:`Router::resourceMap()` 
方法改变。该方法让你可以设置 :php:meth:`Router::mapResources()` 方法设置的默认
路由。在使用该方法时需要设置 *所有* 要使用的默认值::

    Router::resourceMap(array(
        array('action' => 'index', 'method' => 'GET', 'id' => false),
        array('action' => 'view', 'method' => 'GET', 'id' => true),
        array('action' => 'add', 'method' => 'POST', 'id' => false),
        array('action' => 'edit', 'method' => 'PUT', 'id' => true),
        array('action' => 'delete', 'method' => 'DELETE', 'id' => true),
        array('action' => 'update', 'method' => 'POST', 'id' => true)
    ));

修改了默认的 resource map，以后对 ``mapResources()`` 的调用就会使用新值。

.. _custom-rest-routing:

自定义的 REST 路由
==================

如果 :php:meth:`Router::mapResources()` 创建的默认路由仍然不适用，可以用 
:php:meth:`Router::connect()` 方法定义一组自定义 REST 路由。``connect()`` 方法让
你可以为一个给定的网址定义一些不同的选项。欲知详情，请参考 
:ref:`route-conditions` 一节。

.. versionadded:: 2.5

你可以为 :php:meth:`Router::mapResources()` 方法在 ``$options`` 数组中指定 
``connectOptions`` 键，来提供 :php:meth:`Router::connect()` 方法使用的自定义设置::

    Router::mapResources('books', array(
        'connectOptions' => array(
            'routeClass' => 'ApiRoute',
        )
    ));


.. meta::
    :title lang=zh: REST
    :keywords lang=zh: application programmers,default routes,core functionality,result format,mashups,recipe database,request method,easy access,config,soap,recipes,logic,audience,cakephp,running,api
