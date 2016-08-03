HtmlHelper
###############

.. php:class:: HtmlHelper(View $view, array $settings = array())

HtmlHelper助件在CakePHP中的作用是使与HTML相关的工作更容易、更快，更能够适应变化。
使用这个助件会让你的应用程序本身更轻巧，在所处领域中相对于核心功能更灵活。

许多HtmlHelper助件的方法包括一个 ``$options`` 参数，这让你可以在
标签上添加任何额外的属性。下面是一些如何使用 $options 参数的例子:

.. code-block:: html

    需要的属性: <tag class="someClass" />
    数组参数: array('class' => 'someClass')

    需要的属性: <tag name="foo" value="bar" />
    数组参数: array('name' => 'foo', 'value' => 'bar')


.. note::

    默认情况下HtmlHelper助件在所有视图（view）中都可以使用。如果你遇到一个错误，
    告诉你它（HtmlHelper助件）不存在，通常这是因为它的名字在一个手工配置的
    $helpers控制器（controller）变量中被落掉了。

插入完好格式的（HTML）元素
=================================

HtmlHelper助件完成的最重要的任务是创建完好格式的（HTML）标记。别怕经常使用它——
你可以在CakePHP中缓存视图，从而在视图渲染和发送时节约一些CPU时间。这一节介绍
HtmlHelper助件的一些方法及如何使用它们。

.. php:method:: charset($charset=null)

    :param string $charset: 想要的字符集。如果是null，就会使用 ``App.encoding``
        的值。

    用来创建一个meta标签，指明页面的字符集。默认值为UTF-8。

    用法示例::

        echo $this->Html->charset();

    将会输出:

    .. code-block:: html

        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    或者， ::

        echo $this->Html->charset('ISO-8859-1');

    将会输出:

    .. code-block:: html

        <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />

.. php:method:: css(mixed $path, array $options = array())

    .. versionchanged:: 2.4

    :param mixed $path: 或者是一个字符串，指向要连接的CSS文件，或者是数组，包含
        多个文件。
    :param array $options: 一个选项或者 :term:`html attributes` 数组。

    创建CSS样式的链接。如果 ``$options`` 参数中的键'inline'设置为false，link标签
    就会被加到 ``css`` 代码块，你可以把这个代码块在页面的head标签内输出。

    你可以用 ``block`` 选项来控制把link元素加到哪个代码块中。默认情况下，这会加到
    ``css`` 代码块。

    如果 ``$options`` 数组中的键'rel'设置为'import'，样式表（stylesheet）就会被导入。

    这种引入CSS的方法，如果路径不以'/'起始，则假定给出的CSS文件位于
    /app/webroot/css目录内。 ::

        echo $this->Html->css('forms');

    将会输出:

    .. code-block:: html

        <link rel="stylesheet" type="text/css" href="/css/forms.css" />

    第一个参数可以是数组，从而引入多个文件。 ::

        echo $this->Html->css(array('forms', 'tables', 'menu'));

    将会输出: Will output:

    .. code-block:: html

        <link rel="stylesheet" type="text/css" href="/css/forms.css" />
        <link rel="stylesheet" type="text/css" href="/css/tables.css" />
        <link rel="stylesheet" type="text/css" href="/css/menu.css" />

    你可以用 :term:`plugin syntax` 来引入任何已经加载的插件中的CSS文件。要引入
    ``app/Plugin/DebugKit/webroot/css/toolbar.css``，你可以用下面的代码::

        echo $this->Html->css('DebugKit.toolbar.css');

    如果你要引入与一个加载的插件同名的CSS文件，你可以像下面这样做。例如，如果你有
    一个 ``Blog`` 插件，又要引入 ``app/webroot/css/Blog.common.css``，你可以:

    .. versionchanged:: 2.4

    .. code-block:: php

        echo $this->Html->css('Blog.common.css', array('plugin' => false));

    .. versionchanged:: 2.1
        增加了 ``block`` 选项。
        增加了对 :term:`plugin syntax` 的支持。

.. php:method:: meta(string $type, string $url = null, array $options = array())

    :param string $type: 你需要的type meta 标签。
    :param mixed $url: meta 标签的网址（URL），可以是字符串，或者是
        :term:`routing array`。
    :param array $options: :term:`html attributes` 数组。

    要链接到象RSS/Atom推送（*feed*）和favicon这样的外部资源，该方法很方便。就象
    css()方法一样，可以指定是否要让这个标签以内嵌（*inline*）的方式输出，还是要
    通过设置$options参数中的'inline'键为false，即 ``array('inline' => false)``，
    来附加在 ``meta`` 代码块的最后。

    如果你使用$options参数来设置"type"属性，CakePHP提供了一些快捷方式:

    ======== ======================
     类型     转译得到的值
    ======== ======================
    html     text/html
    rss      application/rss+xml
    atom     application/atom+xml
    icon     image/x-icon
    ======== ======================


    .. code-block:: php

        <?php
        echo $this->Html->meta(
            'favicon.ico',
            '/favicon.ico',
            array('type' => 'icon')
        );
        ?>
        // 输出（增加了换行）
        <link
            href="http://example.com/favicon.ico"
            title="favicon.ico" type="image/x-icon"
            rel="alternate"
        />
        <?php
        echo $this->Html->meta(
            'Comments',
            '/comments/index.rss',
            array('type' => 'rss')
        );
        ?>
        // 输出（增加了换行）
        <link
            href="http://example.com/comments/index.rss"
            title="Comments"
            type="application/rss+xml"
            rel="alternate"
        />

    该方法也可以用来添加meta关键字和描述。例如:

    .. code-block:: php

        <?php
        echo $this->Html->meta(
            'keywords',
            '在这里输入任意meta关键字'
        );
        ?>
        // 输出
        <meta name="keywords" content="在这里输入任意meta关键字" />

        <?php
        echo $this->Html->meta(
            'description',
            '在这里输入任意meta描述'
        );
        ?>
        // 输出
        <meta name="description" content="在这里输入任意meta描述" />

    如果你要添加自定义的meta标签，那么第一个参数应当设置为数组。要输出robots
    noindex标签（译注：防止漫游器将网页编入索引，可参考 `noindex
    <http://baike.baidu.com/link?url=wZMV3V5BOO9BrKxVaSp2jEUO2ICTI-cFhFOkcOkQ5FzxcTa0_1s9yQFib06vigYuC1RHYETpkwLHPnVS4qqd5_>`_
    ），可以使用下面的代码::

        echo $this->Html->meta(array('name' => 'robots', 'content' => 'noindex'));

    .. versionchanged:: 2.1
        添加了 ``block`` 选项。

.. php:method:: docType(string $type = 'xhtml-strict')

    :param string $type: 生成的doctype的类型。

    返回(X)HTML doctype标签。可依据下表提供doctype。

    +--------------------------+----------------------------------+
    | 类型                     | 转换所得的值                     |
    +==========================+==================================+
    | html4-strict             | HTML4 Strict                     |
    +--------------------------+----------------------------------+
    | html4-trans              | HTML4 Transitional               |
    +--------------------------+----------------------------------+
    | html4-frame              | HTML4 Frameset                   |
    +--------------------------+----------------------------------+
    | html5                    | HTML5                            |
    +--------------------------+----------------------------------+
    | xhtml-strict             | XHTML1 Strict                    |
    +--------------------------+----------------------------------+
    | xhtml-trans              | XHTML1 Transitional              |
    +--------------------------+----------------------------------+
    | xhtml-frame              | XHTML1 Frameset                  |
    +--------------------------+----------------------------------+
    | xhtml11                  | XHTML1.1                         |
    +--------------------------+----------------------------------+

    ::

        echo $this->Html->docType();
        // 输出:
        // <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        //    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

        echo $this->Html->docType('html5');
        // 输出: <!DOCTYPE html>

        echo $this->Html->docType('html4-trans');
        // 输出:
        // <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        //    "http://www.w3.org/TR/html4/loose.dtd">

    .. versionchanged:: 2.1
        在2.1版本中默认的doctype是html5。

.. php:method:: style(array $data, boolean $oneline = true)

    :param array $data: 一组代表CSS属性的键 => 值对。
    :param boolean $oneline: 内容是否要在一行上。

    基于传入该方法的数组的键和值来构建CSS样式。如果你的CSS文件是动态的，这会特别
    方便。 ::

        echo $this->Html->style(array(
            'background' => '#633',
            'border-bottom' => '1px solid #000',
            'padding' => '10px'
        ));

    将会输出::

        background:#633; border-bottom:1px solid #000; padding:10px;

.. php:method:: image(string $path, array $options = array())

    :param string $path: 图片的路径。
    :param array $options: :term:`html attributes` 数组。

    创建一个完整格式的image标签。提供的路径应当是相对于/app/webroot/img/的。 ::

        echo $this->Html->image('cake_logo.png', array('alt' => 'CakePHP'));

    将会输出:

    .. code-block:: html

        <img src="/img/cake_logo.png" alt="CakePHP" />

    要创建图像链接，用 ``$options`` 参数中的 ``url`` 选项指定链接目标。 ::

        echo $this->Html->image("recipes/6.jpg", array(
            "alt" => "Brownies",
            'url' => array('controller' => 'recipes', 'action' => 'view', 6)
        ));

    将会输出:

    .. code-block:: html

        <a href="/recipes/view/6">
            <img src="/img/recipes/6.jpg" alt="Brownies" />
        </a>

    如果你要创建电子邮件中的图像，或者想要图像的绝对路径，你可以使用 ``fullBase``
    选项::

        echo $this->Html->image("logo.png", array('fullBase' => true));

    将会输出:

    .. code-block:: html

        <img src="http://example.com/img/logo.jpg" alt="" />

    你可以使用 :term:`plugin syntax` 来引入任何加载的插件中的图像。要引入
    ``app/Plugin/DebugKit/webroot/img/icon.png``，你可以使用下面的代码::

        echo $this->Html->image('DebugKit.icon.png');

    如果你要引入与加载的插件重名的图像文件，你可以采用下面的做法。例如，你有一个
    ``Blog`` 插件，又要引入 ``app/webroot/img/Blog.icon.png``，你可以::

        echo $this->Html->image('Blog.icon.png', array('plugin' => false));

    .. versionchanged:: 2.1
        增加了 ``fullBase`` 选项。
        增加了对 :term:`plugin syntax` 的支持。

.. php:method:: link(string $title, mixed $url = null, array $options = array())

    :param string $title: 作为链接主体显示的文字。
    :param mixed $url: 或者是字符串表示的网址，或者是 :term:`routing array`。
    :param array $options: :term:`html attributes` 数组。

    创建HTML链接的通用方法。用 ``$options`` 来指定元素的属性，及是否要转义
    ``$title``。 ::

        echo $this->Html->link(
            'Enter',
            '/pages/home',
            array('class' => 'button', 'target' => '_blank')
        );

    将会输出:

    .. code-block:: html

        <a href="/pages/home" class="button" target="_blank">Enter</a>

    用 ``'full_base' => true`` 选项来指定使用绝对网址（*URL*）::

        echo $this->Html->link(
            'Dashboard',
            array(
                'controller' => 'dashboards',
                'action' => 'index',
                'full_base' => true
            )
        );

    将会输出:

    .. code-block:: html

        <a href="http://www.yourdomain.com/dashboards/index">Dashboard</a>


    用$options参数中的 ``confirm`` 键来显示 JavaScript ``confirm()`` 对话框::

        echo $this->Html->link(
            'Delete',
            array('controller' => 'recipes', 'action' => 'delete', 6),
            array('confirm' => 'Are you sure you wish to delete this recipe?')
        );

    将会输出:

    .. code-block:: html

        <a href="/recipes/delete/6"
            onclick="return confirm(
                'Are you sure you wish to delete this recipe?'
            );">
            Delete
        </a>

    用 ``link()`` 也可以添加查询字符串（Query string）。 ::

        echo $this->Html->link('View image', array(
            'controller' => 'images',
            'action' => 'view',
            1,
            '?' => array('height' => 400, 'width' => 500))
        );

    将会输出:

    .. code-block:: html

        <a href="/images/view/1?height=400&width=500">View image</a>

    当使用命名参数（*named parameters*）时，请使用数组语法，并在网址中包括 *所有*
    参数。对参数使用字符串语法（即"recipes/view/6/comments:false"）会导致冒号
    （:）被HTML转义，链接就无法正常工作了。 ::

        <?php
        echo $this->Html->link(
            $this->Html->image("recipes/6.jpg", array("alt" => "Brownies")),
            array(
                'controller' => 'recipes',
                'action' => 'view',
                'id' => 6,
                'comments' => false
            )
        );

    将会输出:

    .. code-block:: html

        <a href="/recipes/view/id:6/comments:false">
            <img src="/img/recipes/6.jpg" alt="Brownies" />
        </a>

    ``$title`` 中的HTML特殊字符会被转换成HTML字符实体（*HTML Entities*）。要禁用
    这种转换，在 ``$options`` 数组中设置escape选项为false。 ::

        <?php
        echo $this->Html->link(
            $this->Html->image("recipes/6.jpg", array("alt" => "Brownies")),
            "recipes/view/6",
            array('escape' => false)
        );

    将会输出:

    .. code-block:: html

        <a href="/recipes/view/6">
            <img src="/img/recipes/6.jpg" alt="Brownies" />
        </a>

    设置 ``escape`` 为false也会禁用链接的属性的转义。在2.4版本中，你可以使用
    ``escapeTitle`` 选项来只禁用标题的转义，而不是属性的转义。 ::

        <?php
        echo $this->Html->link(
            $this->Html->image('recipes/6.jpg', array('alt' => 'Brownies')),
            'recipes/view/6',
            array('escapeTitle' => false, 'title' => 'hi "howdy"')
        );

    将会输出:

    .. code-block:: html

        <a href="/recipes/view/6" title="hi &quot;howdy&quot;">
            <img src="/img/recipes/6.jpg" alt="Brownies" />
        </a>

    .. versionchanged:: 2.4
        增加了 ``escapeTitle`` 选项。

    .. versionchanged:: 2.6
        参数 ``$confirmMessage`` 已经作废。请使用 ``$options`` 参数中的
        ``confirm`` 键。

    不同类型网址（URL）的更多例子，也请查看 :php:meth:`HtmlHelper::url` 方法。

.. php:method:: media(string|array $path, array $options)

    :param string|array $path: 媒体文件的路径，相对于
        `webroot/{$options['pathPrefix']}` 目录。或者是数组，数组的每项本身可以
        是路径字符串或包含键 `src` 和 `type` 的关联数组。
    :param array $options: HTML属性数组，以及特殊选项。

        选项:

        - `type` 要生成的媒体元素的类型，合法值为"audio"或"video"。如果没有提供类
          型，媒体类型将根据文件的mime类型来推测。
        - `text` 在audio/video标签内使用的文字
        - `pathPrefix` 相对路径所使用的路径前缀，默认为'files/'
        - `fullBase` 如果设置为true，生成的src属性就会是包括域名的完整网址。

    .. versionadded:: 2.1

    返回格式完整的 audio/video 标签:

    .. code-block:: php

        <?php echo $this->Html->media('audio.mp3'); ?>

        // 输出
        <audio src="/files/audio.mp3"></audio>

        <?php echo $this->Html->media('video.mp4', array(
            'fullBase' => true,
            'text' => 'Fallback text'
        )); ?>

        // 输出
        <video src="http://www.somehost.com/files/video.mp4">Fallback text</video>

       <?php echo $this->Html->media(
            array(
                'video.mp4',
                array(
                    'src' => 'video.ogg',
                    'type' => "video/ogg; codecs='theora, vorbis'"
                )
            ),
            array('autoplay')
        ); ?>

        // 输出
        <video autoplay="autoplay">
            <source src="/files/video.mp4" type="video/mp4"/>
            <source src="/files/video.ogg" type="video/ogg;
                codecs='theora, vorbis'"/>
        </video>

.. php:method:: tag(string $tag, string $text, array $options)

    :param string $tag: 生成的标签的名称。
    :param string $text: 标签的内容。
    :param array $options: :term:`html attributes` 数组。

    返回由指定标签包裹的文字。如果没有给出文字，则只返回开始标签。:

    .. code-block:: php

        <?php
        echo $this->Html->tag('span', 'Hello World.', array('class' => 'welcome'));
        ?>

        // 输出
        <span class="welcome">Hello World</span>

        // 未给出文字。
        <?php
        echo $this->Html->tag('span', null, array('class' => 'welcome'));
        ?>

        // 输出
        <span class="welcome">

    .. note::

        默认情况下文字没有转义，但你可以用 ``$options['escape'] = true`` 来
        转义文字。这代替了之前版本里的第四个参数 ``boolean $escape = false``。

.. php:method:: div(string $class, string $text, array $options)

    :param string $class: div的(样式)类名。
    :param string $text: div中的内容。
    :param array $options: :term:`html attributes` 数组。

    用来创建div包裹的标记片段。第一个参数指定CSS类，第二个参数用来提供要被div
    标签包裹的文字。如果最后一个参数设置中的'escape'键被设置为true，$text将被
    HTML转义后再输出。

    如果没有给出文字，只返回开始div标签。:

    .. code-block:: php

        <?php
        echo $this->Html->div('error', 'Please enter your credit card number.');
        ?>

        // 输出
        <div class="error">Please enter your credit card number.</div>

.. php:method::  para(string $class, string $text, array $options)

    :param string $class: 段落（paragraph）的（样式）类名。
    :param string $text: 段落中的内容。
    :param array $options: :term:`html attributes` 数组。

    返回由带有CSS类的<p>标签包裹的文字。如果没有提供文字，则只返回开始<p>标签。:

    .. code-block:: php

        <?php
        echo $this->Html->para(null, 'Hello World.');
        ?>

        // 输出
        <p>Hello World.</p>

.. php:method:: script(mixed $url, mixed $options)

    :param mixed $url: 或者是指向单一Javascript文件的字符串，或者(指向)多个文
        件的字符串数组。
    :param array $options: :term:`html attributes` 数组。

    引入存在于本地或是远程地址的一个或多个脚本文件。

    默认情况下，script标签会以内嵌（*inline*）的方式添加到文档中。如果设置
    ``$options['inline']`` 为false，script标签就转而会被添加到 ``script`` 代码块，
    这样就可以把它输出到文档的其它地方。如果想要改变所使用的代码块名称，可以通过
    设置 ``$options['block']`` 来实现。

    ``$options['once']`` 控制你是否要在一次请求中只引入该脚本一次，或者多次。默认
    值为true。

    你可以用$options参数来为生成的script标签设置额外的属性。如果用的是多个脚本
    标签，属性就会应用于所有生成的script标签。

    这个引入JavaScript文件的方法假定给出的JavaScript文件位于 ``/app/webroot/js``
    目录内::

        echo $this->Html->script('scripts');

    将会输出:

    .. code-block:: html

        <script type="text/javascript" href="/js/scripts.js"></script>

    你也可以用绝对路径链接不在 ``app/webroot/js`` 目录之内的文件::

        echo $this->Html->script('/otherdir/script_file');

    你也可以链接到远程地址::

        echo $this->Html->script('http://code.jquery.com/jquery.min.js');

    将会输出:

    .. code-block:: html

        <script type="text/javascript" href="http://code.jquery.com/jquery.min.js">
            </script>

    第一个参数可以是数组，用来引入多个文件。 ::

        echo $this->Html->script(array('jquery', 'wysiwyg', 'scripts'));

    将会输出:

    .. code-block:: html

        <script type="text/javascript" href="/js/jquery.js"></script>
        <script type="text/javascript" href="/js/wysiwyg.js"></script>
        <script type="text/javascript" href="/js/scripts.js"></script>

    你可以用 ``block`` 选项将script标签添加到一个特定的代码块::

        echo $this->Html->script('wysiwyg', array('block' => 'scriptBottom'));

    在布局中你可以输出所有添加到'scriptBottom'代码块的script标签::

        echo $this->fetch('scriptBottom');

    你可以使用 :term:`plugin syntax` 引入任何加载的插件中的脚本文件。要引入
    ``app/Plugin/DebugKit/webroot/js/toolbar.js``，你可以使用下面的代码::

        echo $this->Html->script('DebugKit.toolbar.js');

    如果你要引入与加载的插件重名的脚本文件，你可以采用下面的做法。例如，如果你有
    一个 ``Blog`` 插件，而又想引入 ``app/webroot/js/Blog.plugins.js``，你可以::

        echo $this->Html->script('Blog.plugins.js', array('plugin' => false));

    .. versionchanged:: 2.1
        添加了 ``block`` 选项。
        添加了对 :term:`plugin syntax` 的支持。

.. php:method::  scriptBlock($code, $options = array())

    :param string $code: 要放入script标签的代码。
    :param array $options: :term:`html attributes` 数组。

    生成包含 ``$code`` 的代码块。设置 ``$options['inline']`` 为false，使代码块
    出现在 ``script`` 视图代码块中。定义的其它选项会被作为script标签的属性。
    ``$this->Html->scriptBlock('stuff', array('defer' => true));`` 会创建带有
    ``defer="defer"`` 的script标签。

.. php:method:: scriptStart($options = array())

    :param array $options: 当调用scriptEnd时使用的 :term:`html attributes` 数组。

    开始一个缓冲代码块。该代码块会捕获所有在 ``scriptStart()`` 和 ``scriptEnd()``
    之间的输出，并创建script标签。选项和 ``scriptBlock()`` 方法一样。

.. php:method:: scriptEnd()

    结束缓冲脚本代码块，返回生成的script元素，或者如果脚本代码块用inline = false
    开始，则返回null。

    一个使用 ``scriptStart()`` 和 ``scriptEnd()`` 的例子会是这样::

        $this->Html->scriptStart(array('inline' => false));

        echo $this->Js->alert('I am in the javascript');

        $this->Html->scriptEnd();

.. php:method:: nestedList(array $list, array $options = array(), array $itemOptions = array(), string $tag = 'ul')

    :param array $list: 要列出来的一组元素。
    :param array $options: 列表（ol/ul）标签的额外HTML属性，或者如果是ul/ol，就用
        它作为标签。
    :param array $itemOptions: 列表项目（LI）标签的额外HTML属性。
    :param string $tag: 要使用的列表标签类型（ol/ul）。

    从关联数组构建嵌套列表（UL/OL）::

        $list = array(
            'Languages' => array(
                'English' => array(
                    'American',
                    'Canadian',
                    'British',
                ),
                'Spanish',
                'German',
            )
        );
        echo $this->Html->nestedList($list);

    输出:

    .. code-block:: html

        // 输出（除去空白字符）
        <ul>
            <li>Languages
                <ul>
                    <li>English
                        <ul>
                            <li>American</li>
                            <li>Canadian</li>
                            <li>British</li>
                        </ul>
                    </li>
                    <li>Spanish</li>
                    <li>German</li>
                </ul>
            </li>
        </ul>

.. php:method:: tableHeaders(array $names, array $trOptions = null, array $thOptions = null)

    :param array $names: 字符串数组，用来创建表格的表头。
    :param array $trOptions: <tr>的 :term:`html attributes` 数组
    :param array $thOptions: 所有<th>元素的 :term:`html attributes` 数组

    创建表格的一行表头格子，可放在<table>标签内。 ::

        echo $this->Html->tableHeaders(array('Date', 'Title', 'Active'));

    输出:

    .. code-block:: html

        <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Active</th>
        </tr>

    ::

        echo $this->Html->tableHeaders(
            array('Date','Title','Active'),
            array('class' => 'status'),
            array('class' => 'product_table')
        );

    输出:

    .. code-block:: html

        <tr class="status">
             <th class="product_table">Date</th>
             <th class="product_table">Title</th>
             <th class="product_table">Active</th>
        </tr>

    .. versionchanged:: 2.2
        ``tableHeaders()`` 现在接受各个格子的属性，见下。

    在2.2版本，你可以设置各列的属性，这些会代替 ``$thOptions`` 中提供的默认值::

        echo $this->Html->tableHeaders(array(
            'id',
            array('Name' => array('class' => 'highlight')),
            array('Date' => array('class' => 'sortable'))
        ));

    输出:

    .. code-block:: html

        <tr>
            <th>id</th>
            <th class="highlight">Name</th>
            <th class="sortable">Date</th>
        </tr>

.. php:method:: tableCells(array $data, array $oddTrOptions = null, array $evenTrOptions = null, $useCount = false, $continueOddEven = true)

    :param array $data: 含有各行数据的二维数组。
    :param array $oddTrOptions: 奇数行<tr>的 :term:`html attributes` 数组。
    :param array $evenTrOptions: 偶数行<tr>的 :term:`html attributes` 数组。
    :param boolean $useCount: 是否添加（样式）类"column-$i"。
    :param boolean $continueOddEven: 如果是false，就会使用非静态$count变量，从而
        对该格子调用的奇偶计数重置为零。

    创建多行表格格子，给奇数行和偶数行设置不同的<tr>属性。为实现特定的<td>属性
    （译注：指各格子有不同的属性，参看下面的第二个例子），可将该表格格子包裹在
    数组中。 ::

        echo $this->Html->tableCells(array(
            array('Jul 7th, 2007', 'Best Brownies', 'Yes'),
            array('Jun 21st, 2007', 'Smart Cookies', 'Yes'),
            array('Aug 1st, 2006', 'Anti-Java Cake', 'No'),
        ));

    输出:

    .. code-block:: html

        <tr><td>Jul 7th, 2007</td><td>Best Brownies</td><td>Yes</td></tr>
        <tr><td>Jun 21st, 2007</td><td>Smart Cookies</td><td>Yes</td></tr>
        <tr><td>Aug 1st, 2006</td><td>Anti-Java Cake</td><td>No</td></tr>

    ::

        echo $this->Html->tableCells(array(
            array(
                'Jul 7th, 2007',
                array(
                    'Best Brownies',
                    array('class' => 'highlight')
                ),
                'Yes'),
            array('Jun 21st, 2007', 'Smart Cookies', 'Yes'),
            array(
                'Aug 1st, 2006',
                'Anti-Java Cake',
                array('No', array('id' => 'special'))
            ),
        ));

    输出:

    .. code-block:: html

        <tr>
            <td>
                Jul 7th, 2007
            </td>
            <td class="highlight">
                Best Brownies
            </td>
            <td>
                Yes
            </td>
        </tr>
        <tr>
            <td>
                Jun 21st, 2007
            </td>
            <td>
                Smart Cookies
            </td>
            <td>
                Yes
            </td>
        </tr>
        <tr>
            <td>
                Aug 1st, 2006
            </td>
            <td>
                Anti-Java Cake
            </td>
            <td id="special">
                No
            </td>
        </tr>

    ::

        echo $this->Html->tableCells(
            array(
                array('Red', 'Apple'),
                array('Orange', 'Orange'),
                array('Yellow', 'Banana'),
            ),
            array('class' => 'darker')
        );

    输出:

    .. code-block:: html

        <tr class="darker"><td>Red</td><td>Apple</td></tr>
        <tr><td>Orange</td><td>Orange</td></tr>
        <tr class="darker"><td>Yellow</td><td>Banana</td></tr>

.. php:method:: url(mixed $url = NULL, boolean $full = false)

    :param mixed $url: :term:`routing array` 数组。
    :param mixed $full: 或者是布尔值，说明是否包含根路径，或者是
        :php:meth:`Router::url()` 的选项数组。

    返回控制器和动作组合形成的网址（*URL*）。如果$url参数为空，它会返回REQUEST\_URI，
    否则它生成所指定的控制器和动作组合而成的网址。如果参数full为true，结果就会前缀
    以完整的根路径::

        echo $this->Html->url(array(
            "controller" => "posts",
            "action" => "view",
            "bar"
        ));

        // 输出
        /posts/view/bar

    下面为更多的用法示例:

    带命名参数的网址::

        echo $this->Html->url(array(
            "controller" => "posts",
            "action" => "view",
            "foo" => "bar"
        ));

        // 输出
        /posts/view/foo:bar

    有扩展名的网址::

        echo $this->Html->url(array(
            "controller" => "posts",
            "action" => "list",
            "ext" => "rss"
        ));

        // 输出
        /posts/list.rss

    前缀以完整根路径的网址（以'/'开头）::

        echo $this->Html->url('/posts', true);

        // 输出
        http://somedomain.com/posts

    带GET参数和命名锚点的网址::

        echo $this->Html->url(array(
            "controller" => "posts",
            "action" => "search",
            "?" => array("foo" => "bar"),
            "#" => "first"
        ));

        // 输出
        /posts/search?foo=bar#first

    欲知详情，请查看API中的
    `Router::url <http://api.cakephp.org/2.8/class-Router.html#_url>`_。

.. php:method:: useTag(string $tag)

    返回完整格式的现有 ``$tag`` 片段::

        $this->Html->useTag(
            'form',
            'http://example.com',
            array('method' => 'post', 'class' => 'myform')
        );

    输出:

    .. code-block:: html

        <form action="http://example.com" method="post" class="myform">

改变HtmlHelper助件输出的标签
======================================

.. php:method:: loadConfig(mixed $configFile, string $path = null)

    :php:class:`HtmlHelper` 内置的标签集是兼容于XHTML的，不过，如果你要生成HTML5
    的HTML，你需要创建并加载新的标签配置文件，该文件应当包含你要使用的标签。要
    改变使用的标签，创建文件 ``app/Config/html5_tags.php``，包含（如下内容）::

        $config = array('tags' => array(
            'css' => '<link rel="%s" href="%s" %s>',
            'style' => '<style%s>%s</style>',
            'charset' => '<meta charset="%s">',
            'javascriptblock' => '<script%s>%s</script>',
            'javascriptstart' => '<script>',
            'javascriptlink' => '<script src="%s"%s></script>',
            // ...
        ));

    然后你就可以通过调用 ``$this->Html->loadConfig('html5_tags');`` 来加载这个
    标签集。

用HtmlHelper助件来创建breadcrumb路径
==========================================

.. php:method:: getCrumbs(string $separator = '&raquo;', string|array|bool $startText = false)

    CakePHP内置的功能可以在应用程序中自动创建breadcrumb路径。要为此做设置，首先在
    布局模板中加入象下面这样的代码::

        echo $this->Html->getCrumbs(' > ', 'Home');

    ``$startText`` 参数也可以接受一个数组。这为生成的第一个链接提供了更多的控制::

        echo $this->Html->getCrumbs(' > ', array(
            'text' => $this->Html->image('home.png'),
            'url' => array('controller' => 'pages', 'action' => 'display', 'home'),
            'escape' => false
        ));

    任何不是 ``text`` 或者 ``url`` 的键，会被作为 ``$options`` 参数传递给
    :php:meth:`~HtmlHelper::link()` 方法。

    .. versionchanged:: 2.1
        现在 ``$startText`` 参数能够接受数组了。

.. php:method:: addCrumb(string $name, string $link = null, mixed $options = null)

    现在，在视图中你可以添加下面的代码，来在每个页面开始breadcrumb路径::

        $this->Html->addCrumb('Users', '/users');
        $this->Html->addCrumb('Add User', array('controller' => 'users', 'action' => 'add'));

    这会在调用getCrumbs所在的布局中添加“**Home > Users > Add User**”的输出。

.. php:method:: getCrumbList(array $options = array(), mixed $startText)

    :param array $options: 包裹的 ``<ul>`` 元素的 :term:`html attributes` 数组。
        也可以包含'separator'、'firstClass'、'lastClass'和'escape'选项。
    :param string|array $startText: 在ul之前的文字或元素。

    返回(x)html列表形式的breadcrumbs。

    该方法使用 :php:meth:`HtmlHelper::tag()` 方法来生成列表及其元素。与
    :php:meth:`~HtmlHelper::getCrumbs()` 方法的工作方式类似，所以它使用添加每个
    crumb时所用的选项。你可以用 ``$startText`` 参数来提供第一个breadcrumb的链接/
    文字。这可以用于当你总是要包括一个根链接时。这个选项和
    :php:meth:`~HtmlHelper::getCrumbs()` 方法中的 ``$startText`` 选项是一样的。

    .. versionchanged:: 2.1
        添加了 ``$startText`` 参数。

    .. versionchanged:: 2.3
        添加了'separator'、'firstClass'和'lastClass'选项。

    .. versionchanged:: 2.5
        添加了'escape'选项。


.. meta::
    :title lang=zh: HtmlHelper
    :description lang=zh: The role of the HtmlHelper in CakePHP is to make HTML-related options easier, faster, and more resilient to change.
    :keywords lang=zh: html helper,cakephp css,cakephp script,content type,html image,html link,html tag,script block,script start,html url,cakephp style,cakephp crumbs
