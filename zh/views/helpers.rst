助件
####


助件(*Helper*)对于应用程序中表现层的作用，就像组件对于控制器的作用。助件包含的表
现层逻辑，在多个视图、元素或布局间共享。本章将展示如何创建你自己的助件，并概述 
CakePHP 的核心助件能帮助你实现的基本任务。

CakePHP 包含了一些有助于创建视图的助件。助件帮助创建完整格式的标记代码
(*markup*)(包括表单)，帮助格式化文本、时间和数字，甚至加速 AJAX 功能。欲知 
CakePHP 中助件的更多信息，请查看各个助件的章节：

.. include:: /core-libraries/toc-helpers.rst
    :start-line: 10

.. _configuring-helpers:

使用和配置助件
==============

在 CakePHP 中，你可以通过让控制器知道助件来启用助件。 每个控制器有一个 
:php:attr:`~Controller::$helpers` 属性，列出视图中可以使用的助件。要在视图中启用
一个助件，就把助件的名字添加到控制器的 ``$helpers`` 数组中::

    class BakeriesController extends AppController {
        public $helpers = array('Form', 'Html', 'Js', 'Time');
    }

要添加插件内的助件，可以像 CakePHP 其它地方那样使用 :term:`plugin syntax`::

    class BakeriesController extends AppController {
        public $helpers = array('Blog.Comment');
    }

你也可以在动作内添加助件，这样它们就只在这个动作中可用，但在控制器的其它动作中无
法使用。这会节省那些不需要助件的其它动作的处理能力，同时保持控制器的良好结构::

    class BakeriesController extends AppController {
        public function bake() {
            $this->helpers[] = 'Time';
        }
        public function mix() {
            // Time 助件没在这里加载，所以不可用
        }
    }

如果需要在所有的控制器中启用一个助件，把助件的名字加入 
``/app/Controller/AppController.php`` 文件(如果不存在就创建它)的 ``$helpers`` 
数组中。记住，要引入缺省的 Html 和 Form 助件::

    class AppController extends Controller {
        public $helpers = array('Form', 'Html', 'Js', 'Time');
    }

你可以给助件传递选项。这些选项可以用来设置助件的属性值或者改变助件的行为::

    class AwesomeHelper extends AppHelper {
        public function __construct(View $view, $settings = array()) {
            parent::__construct($view, $settings);
            debug($settings);
        }
    }

    class AwesomeController extends AppController {
        public $helpers = array('Awesome' => array('option1' => 'value1'));
    }

从 2.3 版本起，(传入的)选项会和 ``Helper::$settings`` 属性合并。

助件有一个通用的 ``className`` 选项，允许在视图中创建不同类名(译注：即别名，
*alias*)的助件。这个特性在你想要替换 ``$this->Html`` 或者其它常用助件为定制的实现
时很有用::

    // app/Controller/PostsController.php
    class PostsController extends AppController {
        public $helpers = array(
            'Html' => array(
                'className' => 'MyHtml'
            )
        );
    }

    // app/View/Helper/MyHtmlHelper.php
    App::uses('HtmlHelper', 'View/Helper');
    class MyHtmlHelper extends HtmlHelper {
        // 加入你的代码来覆盖核心的 HtmlHelper
    }

上面的代码将视图中的 ``$this->Html`` 的类名改为(*alias*) ``MyHtmlHelper``。

.. note::
    为助件定义别名(*alias*)，将在所有使用助件的地方替换该实例，包括在其它助件中。

使用助件的设置，让你可以声明式地配置助件，并使配置逻辑与控制器动作分离。如果你有
不能包含在类声明中的配置选项，你可以在控制器的 beforeRender 回调函数中设置它们::

    class PostsController extends AppController {
        public function beforeRender() {
            parent::beforeRender();
            $this->helpers['CustomStuff'] = $this->_getCustomStuffSettings();
        }
    }

使用助件
========

一旦你已经在控制器中配置好了你要使用哪些助件，每个助件就成为视图中的公有属性。例
如，如果你启用了助件 :php:class:`HtmlHelper` ，你就可以通过如下方式访问它::

    echo $this->Html->css('styles');

上面的代码调用了 HtmlHelper 的 ``css`` 方法。可以使用 ``$this->{$helperName}`` 访
问任何已加载的助件。有时你可能需要从视图中动态加载助件。你可以使用视图的 
:php:class:`HelperCollection` 来做到这一点::

    $mediaHelper = $this->Helpers->load('Media', $mediaSettings);

HelperCollection 是 :doc:`collection </core-libraries/collections>`，如同在 
CakePHP 的其它地方的用法一样支持集合 API。

回调方法
========

助件有若干回调方法，让你可以增强对视图渲染过程(的控制)。欲知更多信息，请参见 
:ref:`helper-api` 和 :doc:`/core-libraries/collections` 的文档。

创建助件
========

如果核心助件(或在 GitHub 或 Bakery 中展示的助件)不能满足你的要求，也可以容易地创
建(自己的)助件。

比方说我们想要创建一个助件，可用于在应用程序中许多不同地方输出你需要的一个具有特
定 CSS 样式的链接。为了使你的逻辑融入 CakePHP 已有的助件结构，你需要在 
``/app/View/Helper`` 目录中创建一个新的类。让我们把我们的助件叫做 LinkHelper 助件。
实际的 PHP 类文件将类似于::

    /* /app/View/Helper/LinkHelper.php */
    App::uses('AppHelper', 'View/Helper');

    class LinkHelper extends AppHelper {
        public function makeEdit($title, $url) {
            // 这里是创建特定样式链接的逻辑……
        }
    }

.. note::

    助件必须继承 ``AppHelper`` 或者 :php:class:`Helper`，或者实现 
    :ref:`helper-api` 中的全部回调。

引入其它助件
------------

你也许会希望使用其它助件中已经存在的功能。为此，你可以使用 ``$helpers`` 数组来指
定要使用的助件，格式如同在控制器中一样::

    /* /app/View/Helper/LinkHelper.php (使用其他助件) */
    App::uses('AppHelper', 'View/Helper');

    class LinkHelper extends AppHelper {
        public $helpers = array('Html');

        public function makeEdit($title, $url) {
            // 使用 HTML 助件来输出
            // 格式化数据:

            $link = $this->Html->link($title, $url, array('class' => 'edit'));

            return '<div class="editOuter">' . $link . '</div>';
        }
    }


.. _using-helpers:

使用你的助件
------------

一旦创建了助件，并放进了 ``/app/View/Helper/`` 目录，就可以在控制器中用特别的变量 
:php:attr:`~Controller::$helpers` 来引用它了::

    class PostsController extends AppController {
        public $helpers = array('Link');
    }

只要控制器知道了这个新的类，你就可以在视图中通过访问以这个助件命名的对象来使用它::

    <!-- 使用新的助件生成链接 -->
    <?php echo $this->Link->makeEdit('Change this Recipe', '/recipes/edit/5'); ?>


为所有助件创建功能
==================

所有的助件都继承自一个特殊类 AppHelper (就象所有的模型都继承自 AppModel，而所有的
控制器都继承自 AppController 一样)。要为所有的助件创建功能，创建 
``/app/View/Helper/AppHelper.php`` 这个文件::

    App::uses('Helper', 'View');

    class AppHelper extends Helper {
        public function customMethod() {
        }
    }


.. _helper-api:

助件 API
========

.. php:class:: Helper

    助件的基类。提供了一些实用方法和加载其他助件的功能。

.. php:method:: webroot($file)

    解析一个文件名到应用程序的 webroot 目录。如果启用了主题，并且该文件在当前主题
    的 webroot 目录中存在，那么将返回这个主题文件的路径。

.. php:method:: url($url, $full = false)

    创建一个 HTML 转义的网址(*URL*)，调用 :php:meth:`Router::url()` 方法。

.. php:method:: value($options = array(), $field = null, $key = 'value')

    获得指定名称的输入项(*input*)的值。

.. php:method:: domId($options = null, $id = 'id')

    为当前选中的字段生成一个驼峰命名的 id 值。在 AppHelper 中重载这个方法，让你可
    以改变 CakePHP 如何生成 ID 属性。

回调函数
---------

Callbacks
---------

.. php:method:: beforeRenderFile($viewFile)

    在每个视图文件被渲染前调用，这包括元素、视图、父视图和布局。

.. php:method:: afterRenderFile($viewFile, $content)

    在每个视图文件被渲染后调用，这包括元素、视图、父视图和布局。回调函数可以修改
    并返回 ``$content`` 参数，来改变在浏览器中如何显示渲染的内容。

.. php:method:: beforeRender($viewFile)

    beforeRender 方法在控制器的 beforeRender 方法之后、但在控制器渲染视图和布局之
    前被调用。接收被渲染的文件作为参数。

.. php:method:: afterRender($viewFile)

    在视图渲染之后、但在开始渲染布局之前调用。

.. php:method:: beforeLayout($layoutFile)

    在开始渲染布局之前调用。接收布局文件名作为参数。

.. php:method:: afterLayout($layoutFile)

    在完成渲染布局之后调用。接收布局文件名作为参数。

.. meta::
    :title lang=zh: Helpers
    :keywords lang=zh: php class,time function,presentation layer,processing power,ajax,markup,array,functionality,logic,syntax,elements,cakephp,plugins
