CakePHP 目录结构
################

在你下载并且解压 CakePHP 之后，应当会看到下面这些文件和目录：

-  app
-  lib
-  vendors
-  plugins
-  .htaccess
-  index.php
-  README

你会注意到三个主要的目录：

-  *app* 目录是你施放魔法的地方，在这里放置应用程序的文件。
-  *lib* 目录是我们制作的魔法的所在地。请保证 **不** 要修改这个目录里的文件。如果
   你修改了核心库，我们就帮不了你了。如果要修改，请考虑修改 
   :ref:`application-extensions`。
-  最后，*vendors* 目录可以放置应用程序使用的第三方 PHP 类库。

App 目录
==============

大部分应用程序的开发都在 CakePHP 的 *app* 目录中进行。让我们来进一步看看 *app* 目
录里面的目录。

Config
    包含 CakePHP 使用的(为数不多的)一些配置文件。数据库连接的详细信息，引导
    (*bootstrapping*)，核心配置文件以及其他配置文件，都应该放在这里。
Console
    包含应用程序的控制台命令和控制台任务。此目录还可以包含一个 ``Templates`` 目录，
    来定制 bake 的输出。欲了解更多信息，请参阅 :doc:`/console-and-shells` 。
Controller
    包含应用程序的控制器和它们的组件。
Lib
    包含并非来自于第三方或外部供应商的库(译注：即来自己的组织)。这可以把你组织内
    部的库和供应商的库分开。
Locale
    保存国际化使用的字符串文件。
Model
    包含应用程序的模型、行为和数据源。
Plugin
    包含插件包。
Test
    此目录包含应用程序所有的测试用例和测试固件(*test fixture*)。``Test/Case`` 目
    录应当和你的应用程序一一对应，应用程序的每个类有一个或多个测试用例。欲了解测
    试用例和测试固件的更多信息，请参阅 :doc:`/development/testing` 文档。
tmp
    这是 CakePHP 用来保存临时数据的地方。保存的实际数据取决于你对 CakePHP 的配置，
    不过这个目录通常用来保存对模型的描述、日志(*log*)，有时候也保存会话(*session*)
    信息。

    请确保此目录存在并且可以写入，否则应用程序的性能将受到严重影响。在调试
    (*debug*)模式下，如果此目录不存在或者无法写入，你会受到 CakePHP 的警告。

Vendor
    所有的第三方类或库都应该放在这里。这样，通过 App::import('vendor', 'name') 方
    法，就可以容易地引入。敏锐的用户会注意这似乎是多余的，因为在我们目录结构的最
    高一层也有一个 *vendors* 目录(译注：即与 app 目录平级的 *vendors* 目录)。当我
    们讨论到管理多个应用程序和较为复杂的系统配置时，就会说明两者之间的差异。
View
    展示层的文件被放置在此处：元素(*element*)、错误页面、助件(*helper*)、布局
    (*layout*)和视图(*view*)文件。
webroot
    在生产环境的设置中，此目录应当作为应用程序的文档根目录(*document root*)。里面
    的目录也用于包含 CSS 样式、图片和 JavaScript 文件。


.. meta::
    :title lang=zh: CakePHP Folder Structure
    :keywords lang=zh: internal libraries,core configuration,model descriptions,external vendors,connection details,folder structure,party libraries,personal commitment,database connection,internationalization,configuration files,folders,application development,readme,lib,configured,logs,config,third party,cakephp
