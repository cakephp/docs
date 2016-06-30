CakePHP 的约定
##############

我们坚信约定高于配置。虽然需要花一些时间来学习 CakePHP 的约定，但是从长期来看这会
节省时间：遵循约定，你就能利用现成的功能，并从跟踪维护配置文件的噩梦中解脱出来。
约定也有助于一致的系统开发，允许其他开发人员更容易地随时加入。

CakePHP 的约定汲取了多年的网络开发经验和最佳实践。尽管我们建议你在使用 CakePHP 进
行开发时遵循这些约定，不过我们也应当说明，约定中的许多规则很容易改变，这使得在旧
式(*legacy*)系统中的工作更为方便。

控制器的约定
============

控制器的名称必须用复数、驼峰法表示，并以 ``Controller`` 结尾。``PeopleController`` 
和 ``LatestArticlesController`` 都是符合约定的例子。

控制器的第一个方法可以是 ``index()`` 方法。当一个请求指定了控制器但没有指定方法时，
CakePHP 会默认执行那个控制器的 ``index()`` 方法。例如，对 
http://www.example.com/apples/ 的请求会被映射到对 ``ApplesController`` 控制器的 
``index()`` 方法的调用，而 http://www.example.com/apples/view/ 会被映射到对 
``ApplesController`` 的 ``view()`` 方法的调用。

也可以通过在 CakePHP 控制器的方法名称前加下划线来改变该方法的可见性。如果一个控制
器的方法名称前面带一个下划线(_)，该方法是无法直接通过 web 访问的，但是可以在内部
调用。例如::

    class NewsController extends AppController {

        public function latest() {
            $this->_findNewArticles();
        }

        protected function _findNewArticles() {
            // Logic to find latest news articles
        }
    }


用户正常地可以访问 http://www.example.com/news/latest/ 页面，而访问
http://www.example.com/news/\_findNewArticles/ 页面就会报错，因为该方法名称前面带
了下划线。你也可以使用 PHP 的访问修饰符来表明一个方法是否可以通过网址访问。非公共
方法无法访问。

控制器命名对网址的影响
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

正如你所看到的，单个单词的控制器很容易映射为简单的小写网址路径。例如 
``ApplesController`` (定义在文件 'ApplesController.php' 中)可通过 
http://example.com/apples 来访问。

多个单词的控制器，*可以* 变换为以下等价于同一控制器名称的多种形式(的网址)，所以：


-  /redApples
-  /RedApples
-  /Red\_apples
-  /red\_apples

都能解析为 RedApples 控制器的 index 方法。不过，按照约定，网址应当是小写字母，由
下划线分隔，因此 /red\_apples/go\_pick 是访问 ``RedApplesController::go_pick`` 动
作的正确网址。

有关 CakePHP 网址和参数处理的详情，请参见 :ref:`routes-configuration`。如果在 
``/webroot`` 内有和路由/控制器同名的文件/目录，就会被重定向到这个文件/目录，而不
是控制器。

.. _file-and-classname-conventions:

文件和类名的约定
================

通常，文件名和类名相同，使用驼峰命名法。所以，如果你有一个类 **MyNiftyClass** ，
那么在 CakePHP 中，其文件名应当是 **MyNiftyClass.php**。以下是在 CakePHP 应用程序
中通常会用到的各种类的文件名的例子：


-  控制器类 **KissesAndHugsController** 位于文件 **KissesAndHugsController.php**
-  组件类 **MyHandyComponent** 位于文件 **MyHandyComponent.php**
-  模型类 **OptionValue** 位于文件 **OptionValue.php**
-  行为类 **EspeciallyFunkableBehavior** 位于文件 **EspeciallyFunkableBehavior.php**
-  视图类 **SuperSimpleView** 位于文件 **SuperSimpleView.php**
-  助件类 **BestEverHelper** 位于文件 **BestEverHelper.php**

每个文件都会被放置于 app 目录下适当的子目录中。


模型和数据库命名约定
====================

模型类的名称是单数、驼峰形式。Person、BigPerson 和 ReallyBigPerson 都是符合约定的
模型名称。

CakePHP 模型对应的数据库表的名称应当是复数且以下划线分隔。上面提及的模型所对应的
数据库表就应当是 ``people`` 、 ``big_people`` 和 ``really_big_people``。

你可以使用工具库中的 :php:class:`Inflector` 类来检查单词的单复数。详情可参阅 
:doc:`/core-utility-libraries/inflector`。

由多个单词组成的字段名应当以下划线分隔，例如 first_name。

hasMany、belongsTo 或 hasOne 关系中的外键名称，默认为关联表的(单数)名称之后加上 
\_id。所以，如果 Baker 有多个 Cake，cakes 数据库表会通过 baker\_id 这个外键与 
bakers 数据库表关联。对于包含多个单词的数据库表名，比如 category_types，其外键应
该为 category\_type\_id。

连接表，在 hasAndBelongsToMany (HABTM) 关系中用于连接模型，应当根据它连接的两个模
型的表来命名，并且依照字母先后次序(即应当是 apples\_zebras，而不是 zebras\_apples)。

所有与 CakePHP 的模型有关的数据库表(除了连接表)，都必须有一个单列主键，来唯一识别
每一行。如果你要为一个还没有单列主键的数据库表建立模型，CakePHP 的约定就是为该表
增加单列主键。如果你要使用该表的模型，就必须为该表增加单列主键。

CakePHP 不支持复合主键。如果你要直接操作连接表的数据，请直接调用 
:ref:`query <model-query>`，或者，增加一个主键，作为正常的模型来使用。例如：

    CREATE TABLE posts_tags (
    id INT(10) NOT NULL AUTO_INCREMENT,
    post_id INT(10) NOT NULL,
    tag_id INT(10) NOT NULL,
    PRIMARY KEY(id));

除了用自增键作为主键外，也可以使用 char(36) 字段。这样，每当你使用 Model::save 方
法来保存一条新记录时，CakePHP 都会生成一个唯一的36位 UUID (String::uuid)。

视图的约定
==========

视图模版文件依照它们显示的控制器方法来命名，并以下划线分隔。例如：在 
PeopleController 中的 getReady() 方法将调用视图模版文件 
/app/View/People/get\_ready.ctp。

基本的模式是 /app/View/控制器/以下划线分隔的方法名.ctp。

通过使用 CakePHP 的约定来命名应用程序的各个部分，你得到现成的功能，而免除了麻烦以
及维护配置的束缚。下面是把各项约定联系在一起的最后一个例子。

-  数据库表："people"
-  模型类："Person" 位于 /app/Model/Person.php
-  控制器类："PeopleController" 位于 /app/Controller/PeopleController.php
-  视图模版位于 /app/View/People/index.ctp

使用这些约定，CakePHP 就知道对 http://example.com/people/ 的请求，映射到对 
PeopleController 控制器的 index() 方法的调用，并自动加载 Person 模型(并且自动与数
据库中的 'people' 表关联)，再渲染对应的视图文件。所有这些关系都没有通过任何方式进
行配置，只是创建你本来就要创建的类和文件。

现在你已经了解到了 CakePHP 的基础，你也许可以试试
:doc:`/tutorials-and-examples/blog/blog`，看各部分是如何在一起配合的。


.. meta::
    :title lang=zh: CakePHP Conventions
    :keywords lang=zh: web development experience,maintenance nightmare,index method,legacy systems,method names,php class,uniform system,config files,tenets,apples,conventions,conventional controller,best practices,maps,visibility,news articles,functionality,logic,cakephp,developers
