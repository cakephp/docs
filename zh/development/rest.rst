REST
####
许多刚入门的开发者开始意识到他们需要把他们应用的核心功能展示（遍及）给更多的人。
通过对外提供你应用中简单，开放的核心接口，借此可以帮助你的平台（应用）为更多的人所接受，同时允许与其他系统进行混合搭配以及简单的融合。

REST可以帮你有效地向他人提供在你的应用中已创建的逻辑（方法）。
这非常方便，通常基于XML（这里所指的是简单的XML，并不是SOAP的那种复杂格式），同时依赖HTTP头来引导。
在Cakephp中公开你的REST接口是非常方便的一件事。

简单的设置
===========

最快捷的方法去创建并运行REST是通过在你的配置文件config/routes.php中添加少许几行代码来配置
:ref:`资源路由(resource routes) <resource-routes>`.

一旦用来映射REST请求到指定控制器方法的路由已经配置好后，下一步我们就可以在控制器的方法中添加业务逻辑。
最基本的控制器类似于以下代码：::

    // src/Controller/RecipesController.php
    class RecipesController extends AppController
    {
        //以下代码CakePHP的使用者应该都了解，再次不做赘述
        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('RequestHandler');
        }

        public function index()
        {
            $recipes = $this->Recipes->find('all');
            $this->set([
                'recipes' => $recipes,
                '_serialize' => ['recipes']
            ]);
        }

        public function view($id)
        {
            $recipe = $this->Recipes->get($id);
            $this->set([
                'recipe' => $recipe,
                '_serialize' => ['recipe']
            ]);
        }

        public function add()
        {
            $recipe = $this->Recipes->newEntity($this->request->data);
            if ($this->Recipes->save($recipe)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set([
                'message' => $message,
                'recipe' => $recipe,
                '_serialize' => ['message', 'recipe']
            ]);
        }

        public function edit($id)
        {
            $recipe = $this->Recipes->get($id);
            if ($this->request->is(['post', 'put'])) {
                $recipe = $this->Recipes->patchEntity($recipe, $this->request->data);
                if ($this->Recipes->save($recipe)) {
                    $message = 'Saved';
                } else {
                    $message = 'Error';
                }
            }
            $this->set([
                'message' => $message,
                '_serialize' => ['message']
            ]);
        }

        public function delete($id)
        {
            $recipe = $this->Recipes->get($id);
            $message = 'Deleted';
            if (!$this->Recipes->delete($recipe)) {
                $message = 'Error';
            }
            $this->set([
                'message' => $message,
                '_serialize' => ['message']
            ]);
        }
    }

具有REST特性的控制器通常使用一些转换过的扩展来生成基于不同请求的不同的格式（视图）。
既然我们现在在处理REST请求，我们将会生成一个XML的格式（视图）。
你也可以通过CakePHP的内置方法:doc:`/views/json-and-xml-views`已达到输出JSON格式（视图）的目的。
在这个内置的PHP类:php:class:`XmlView`，我们定义了一个叫做``_serialize``的视图变量。
这个特殊的格式（视图）变量是用来定义哪些视图变量``XmlView``应该被格式化成XML

如果我们想要在数据被转换成XML之前修改它们，我们不应该（不能）定义这个``_serialize``视图变量，而是应该使用模板文件。
我们把RecipesController的REST视图放在**src/Template/Recipes/xml**内。或者我们也可以使用:php:class:`Xml` 类来简单快速的在这些视图中输些XML。

index方法的REST视图的简单的代码::

    // src/Template/Recipes/xml/index.ctp
    // Do some formatting and manipulation on
    // the $recipes array.
    $xml = Xml::fromArray(['response' => $recipes]);
    echo $xml->asXML();

当使用:php:meth:`Cake\\Routing\\Router::extensions()` 来开放一个特殊的文档格式时，CakePHP会自动寻找匹配这个文档格式的视图helper方法。
由于我们的例子中使用的是XML所以没有任何内置的helper方法，但是如果你创建了自定义的helper方法，那么它会被自动加载并在那些视图中被利用。

返回的XML可能最终像下面的例子这样：::

    <recipes>
        <recipe>
            <id>234</id>
            <created>2008-06-13</created>
            <modified>2008-06-14</modified>
            <author>
                <id>23423</id>
                <first_name>Billy</first_name>
                <last_name>Bob</last_name>
            </author>
            <comment>
                <id>245</id>
                <body>Yummy yummmy</body>
            </comment>
        </recipe>
        ...
    </recipes>

创建edit方法的业务逻辑会有点懵逼，不过还好。
由于你提供的API输出的是XML，自然来说你的第一选择是接收XML格式的数据。
不需要担心的是，由于有了:php:class:`Cake\\Controller\\Component\\RequestHandler` 和
:php:class:`Cake\\Routing\\Router` 可以让事情更简单。
如果一个POST/PUT请求发送了XML格式的数据，那么数据会经过CakePHP的:php:class:`Xml` 类的处理，所有数据都会合并到``$this->request->data`` 中
因为这些特性，处理和发送XML数据是毫无阻碍的，你完全不必去修改控制器或者模型的任何代码。
所有你需要的都会合并到``$this->request->data`` 中。

接收其他格式的数据
==================

典型的REST应用不仅可以输出不同格式的数据，同时也可以接收不同格式的数据
在CakePHP中:php:class:`RequestHandlerComponent` 帮助我们实现了这个目标。
一般来说，它会解码通过POST/PUT请求所接收到的JSON/XML的任何数据并且在``$this->request->data`` 中告诉你数据的格式。
当然如果你需要的话，你也可以自定义其他的反序列化方法以此丰富你的数据接收/发送格式（通过:php:meth:`RequestHandler::addInputType()` 来添加）。

具有REST特性的路由
===================

CakePHP的路由使得实现REST变得简单。
查阅资源路由（resource-routes）:ref:`resource-routes` 以获取更多信息

.. meta::
    :title lang=zh: REST
    :keywords lang=zh: application programmers,default routes,core functionality,result format,mashups,recipe database,request method,easy access,config,soap,recipes,logic,audience,cakephp,running,api
