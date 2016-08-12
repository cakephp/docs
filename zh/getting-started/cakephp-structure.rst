CakePHP 的结构
##############

CakePHP 包括控制器(*Controller*)，模型(*Model*)及视图(View)，还包括其它一些类和对
象，能让使用 MVC 的开发更快、更有趣。组件(*Component*)、行为(*Behavior*)及助件
(*Helper*)就是这样的类，它们提供扩展和重用，让你能在应用程序中为基本的 MVC 类快速
添加功能。现在(在这里)我们只在一个较高的层次上(研究它们)，所以以后(在后续章节里)
再研究如何使用这些工具的细节吧。

.. _application-extensions:

应用程序扩展
============

控制器(*Controller*)、助件(*Helper*)、模型(*Model*)都有各自的父类，可以用来定义应
用程序范围的变化。AppController (位于 ``/app/Controller/AppController.php``)、
AppHelper (位于 ``/app/View/Helper/AppHelper.php``)和 AppModel (位于
``/app/Model/AppModel.php``) 是放置你要在所有控制器之间、所有助件之间和所有模型之
间共享的方法的最佳地方。

尽管路由(*route*)不是类或者文件，但是它们仍然在 CakePHP 的请求中充当重要角色。路
由定义告诉 CakePHP 如何将网址映射到控制器动作。缺省的路由行为将网址 
``/controller/action/var1/var2`` 映射到 Controller::action($var1, $var2)，但是你
可以使用路由来定制网址、以及应用程序如何解析这些网址。

应用程序中的一些功能值得作为一个整体打包在一起。插件(*Plugin*)就是一个包含了模型、
控制器和视图的程序包，实现了特定的功能，并可以用于多个应用程序。用户管理系统或者
简单的博客就可能适于作为 CakePHP 插件。


控制器扩展("组件")
==================

组件(*Component*)是一个辅助控制器逻辑的类。如果你有一些想要在控制器(或应用程序)之
间共享的逻辑，那么组件通常是很适合的。比如，框架核心提供的 EmailComponent 组件使
得创建及发送电子邮件轻而易举。与其在一个控制器内编写一个方法实现这样的逻辑，不如
把这样的逻辑包装起来以便于共享。

控制器也配有回调函数(*callback*)。当你需要在 CakePHP 核心操作之间插入一些逻辑时，
可利用这些回调函数。可利用的回调函数包括：

-  :php:meth:`~Controller::afterFilter()`, 在所有的控制器动作逻辑，包括视图渲染
   之后执行。
-  :php:meth:`~Controller::beforeFilter()`, 在任何控制器动作逻辑之前执行。
-  :php:meth:`~Controller::beforeRender()`, 在控制器动作逻辑之后、但在视图渲染
   之前执行。

模型扩展("行为")
================

同样的，行为(*Behavior*)用来加入在模型之间共用的功能。举例来说，如果你将用户资料
储存在树形结构中，你可以指定让 User 模型具有树(*tree*)的行为，并获得在树形结构中
删除、新增和移动节点的功能。

模型(*Model*)也得到另外一种叫做数据源(*DataSource*)的类的支持。数据源是一个让模型
以一致的方式操作不同类别数据的抽象层。尽管在 CakePHP 应用程序中主要的数据源通常是
数据库，但是你也可以编写其它数据源，让模型可以表示 RSS 推送、CSV 文件、LDAP 目录
数据或 iCal 事件。数据源让你可以把不同来源的数据联系在一起，不只限于使用 SQL join
语句，数据源让你也可以把 LDAP 模型跟许多 iCal 事件关联在一起。

和控制器一样，模型也支持回调函数：

-  beforeFind()
-  afterFind()
-  beforeValidate()
-  afterValidate()
-  beforeSave()
-  afterSave()
-  beforeDelete()
-  afterDelete()

这些回调函数的名称，足以说明它们的作用。你可以在模型一章找到更详细的说明。

视图扩展("助件")
================

助件(*Helper*)是用来辅助视图逻辑的类。如同在控制器之间使用的组件，助件让显示层逻
辑可在多个视图之间使用及共享。核心助件之一，JsHelper，使得在视图中使用 AJAX 请求
更容易，并且本身就支持 jQuery(默认)、Prototype 和 Mootools。

大多数的应用程序都会有许多重复使用的视图代码片段。CakePHP 的布局(*layout*)和元素
(*element*)有助于视图代码的重用。缺省情况下，每个控制器渲染的视图都出现在一个布局
内。当多个视图需要反复重用小段内容时，就可以使用元素(*element*)进行封装。


.. meta::
    :title lang=zh: CakePHP Structure
    :keywords lang=zh: user management system,controller actions,application extensions,default behavior,maps,logic,snap,definitions,aids,models,route map,blog,plugins,fit
