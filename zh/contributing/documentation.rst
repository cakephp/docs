文档
####

给文档做贡献是很简单的。这些文件都托管在 https://github.com/cakephp/docs。请自行
复制(*fork*)代码仓库，加入你的更改/改进/翻译，然后发出拉取请求来提交你的改动。你
甚至可以在 GitHub 上在线地编辑文档，而完全不用下载文件--在任何页面上的"Improve
this Doc"按键将会引导你进入该页面的 GitHub 在线编辑器。

CakePHP文档是
`持续集成 <https://en.wikipedia.org/wiki/Continuous_integration>`_ 的，所以你可以
在任何时候在Jenkins服务器上查看 `各种构建 <https://ci.cakephp.org>`_ 的状态。

翻译
====

发邮件给文档小组(docs at cakephp dot org)，或者通过 IRC(freenode上的#cakephp)，
来讨论任何你想参与的翻译工作。

新的翻译语言
------------------------

我们想要提供尽可能完整的翻译。然而，有时候某个翻译的文件没有更新。你应当总是认为
英文版本是最权威的版本。

如果你的语言没有出现在现有的语言中，请通过Github与我们联系，我们会考虑为该语言
创建一个目录骨架。下面的部分是你应当考虑首先翻译的，因为这些文件不经常变化：

- index.rst
- cakephp-overview.rst
- getting-started.rst
- installation.rst
- /installation folder
- /getting-started folder
- /tutorials-and-examples folder

对文档管理员的提醒
--------------------------------

所有语言的目录结构应当遵循英文的目录结构。如果英文版本的结构发生了变化，我们应当
在其它语言做相同的改变。

例如，如果创建了一个新的英文文件 **en/file.rst**，我们应当：

- 在所有其它语言中添加该文件：**fr/file.rst**，**zh/file.rst**，......
- 删除内容，但是保留 ``title``， ``meta`` 信息和最终的 ``toc-tree`` 元素。当文件
  没有人翻译时会添加下面的说明::

    File Title
    ##########

    .. note::
        The documentation is not currently supported in XX language for this
        page.

        Please feel free to send us a pull request on
        `Github <https://github.com/cakephp/docs>`_ or use the **Improve This Doc**
        button to directly propose your changes.

        You can refer to the English version in the select top menu to have
        information about this page's topic.

    // If toc-tree elements are in the English version
    .. toctree::
        :maxdepth: 1

        one-toc-file
        other-toc-file

    .. meta::
        :title lang=xx: File Title
        :keywords lang=xx: title, description,...


对译者的提示
---------------

- 用要翻译的语言来进行浏览、编辑 - 否则你将无法看到哪些已经翻译了。
- 如果你选择的语言在本书中已经存在，请自行加入。
- 请使用 `Informal Form <https://en.wikipedia.org/wiki/Register_(linguistics)>`_ 。
- 请将内容和标题一起翻译。
- 在提交一个更正之前，请先和英文版本的内容进行比较(如果你改正了一些东西，却没有
  整合“上游”(*upstream*)的改动，你提交的东西将不会被接受)。
- 如果你要写一个英文术语，请把它放在 ``<em>`` 标签之内。比如，
  "asdf asdf *Controller* asdf"或者"asdf asdf Kontroller (*Controller*) asfd"，
  请适为选用。
- 请不要提交不完整的翻译。
- 请不要编辑正在改动的部分。
- 对于标以重音符号的字符，请不要使用
  `html 字符实体 <https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references>`_
  (*html entities*) 来表示，本书使用UTF-8。
- 请不要显著改变标记(HTML)或增加新的内容。
- 如果原始的内容遗漏了某些信息，请先提交(对原始内容的)更正。

文档格式指南
============

这份新的 CakePHP 文档是以
`ReST formatted text <https://en.wikipedia.org/wiki/ReStructuredText>`_ 格式写的。
ReST (Re Structured Text)是与 markdown 或者 textile 类似的纯文本标记语法。为保持
一致性，建议在添加到CakePHP文档时，请遵循(下面)这些准则，来你格式化和组织你的文字。

每行的长度
----------

每行文字应在80列处折行。唯一的例外是长的网址(*URL*)和代码片断。

标题和小节
----------

小节的标题要在它的下一行用至少相同长度的标点符号来标识。

- ``#`` 用来标识网页标题。
- ``=`` 用于标识在一个页面中的小节。
- ``-`` 用于标识下一级的小节。
- ``~`` 用于标识再下一级的小节。
- ``^`` 用于标识更下一级的小节。

标题的嵌套深度不应超过5层。标题之前和之后都应留有一个空行。

段落
----

段落是简单的文本块，缩进在同一级别。段落之间应以一个以上的空行分隔。

内嵌(*inline*)标记
------------------

* 一个星号： *文字* 为强调(斜体)
  我们把它用于通常的标记／强调。

  * ``*text*``。

* 两个星号： **文字** 为高度强调(粗体)
  我们把它用于工作目录，列表的标题，表格名称，但不包括下面的单词“table”。
  We'll use it for working directories, bullet list subject, table names and
  excluding the following word "table".

  * ``**/config/Migrations**``，``**文章**``，等等。

* 反引号： ``文字`` 为代码样本
  我们把它用于方法选项的名称，表格列的名称，对象名称，但不包括下面的单词“object”和方法／函数名称－－包括“()”。
  We'll use it for names of method options, names of table columns, object
  names, excluding the following word "object" and for method/function
  names -- include "()".

  * ````cascadeCallbacks````，````true````，````id````，
    ````PagesController````，````config()````，等等。

如果星号或反引号出现在文字中，并易与内嵌标记分隔符混淆，则必须用一个反斜杠转义。

内嵌标记有一些限制:

*  **不可以** 嵌套。
* 内容不可以以空格开始或结束:  ``* 文本*`` 是错误的。
* 内容必须与周围的文字由非文字字符分隔，这可以使用反斜杠转义的空格来解决：
  ``一个长的\ *粗体*\ 词汇``。

列表
----

列表与 markdown 非常相似。无序列表以一个星号和一个空格开始。有序列表可以数字开始，
或以 ``#`` 进行自动编号::

    * 这是一点
    * 这也是。但这一点
      有两行。

    1. 第一行
    2. 第二行

    #. 自动编号
    #. 可以为你节省时间。

也可以创建缩进列表，只需缩进缩进列表那部分，并用一个空行分隔::

    * 第一行
    * 第二行

        * 缩进
        * 哇

    * 回到第一层。

定义列表(*Definition lists*)，可以通过以下方式创建::

    术语
        定义
    CakePHP
        一个基于 PHP 的 MVC 框架

术语不可超过一行，但定义可以有多行并且所有行应当有同样的缩进。

链接
----

有几种类型的链接，每个都有自己的用途。

外部链接
~~~~~~~~

链接到外部文件如下::

    `外部链接 <http://example.com>`_

这会产生一个指向http://example.com的链接。

链接到其他页面
~~~~~~~~~~~~~~

.. rst:role:: doc

    指向文档中其他网页的链接可以使用 ``:doc:`` 角色(*role*)。你可以使用绝对路径
    或者相对路径，来链接到指定的文件中。请省略 ``.rst`` 扩展名。例如，如果链接
    ``:doc:`form``` 出现在文档 ``core-helpers/html`` 中，则该链接指向
    ``core-helpers/form`` 。如果链接是 ``:doc:`/core-helpers``` ，那么不论它用在
    那里，总是会指向 ``/core-helpers`` 。

交叉引用链接
~~~~~~~~~~~~

.. rst:role:: ref

    你可以使用 ``:ref:`` 角色交叉引用在任何文件中的任何标题。链接标签指向的目标
    在整个文档必须是唯一的。当为类的方法创建标签时，最好使用 ``class-method`` 作
    为您的链接标签的格式。

    标签最常见的用途是在标题之前。例如::

        .. 标签名称:

        小节标题
        --------

        更多内容在这里。

    在其他地方你可以用 ``:ref:`标签名称``` 引用上面的小节。链接的文字可以是标签
    之后的标题。你也可以使用 ``:ref:`链接文字 <标签名称>``` 的方式来提供自定义的
    链接文字。

防止 Sphinx 输出警告
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

如果一个文件没有在某个 toc-tree 中引用，Sphinx 就会输出警告。这可以很好地保证所有
文件都有一个指向到它们的链接，但是，有时候，你并不需要插入对一个文件的链接，
例如，对我们的 `epub-contents` 和 `pdf-contents` 文件。在这样的情况下，可以在文
件开头增加 ``:orphan:``，就可以防止文件不在某个 toc-tree 中的警告。

描述类和它们的内容
------------------

CakePHP 文档使用
`phpdomain <http://pypi.python.org/pypi/sphinxcontrib-phpdomain>`_ 提供自定义指
令描述 PHP 对象和结构。我们必须使用这些指令和角色，才能保证正确的索引和交叉引用。

描述类及其组成
--------------

每个指令生成索引，或命名空间索引。

.. rst:directive:: .. php:global:: name

   这个指令声明一个新的PHP全局变量。

.. rst:directive:: .. php:function:: name(signature)

   定义一个新的处于类之外的函数。

.. rst:directive:: .. php:const:: name

   这个指令声明一个新的 PHP 常量，也可以在一个类的指令之内使用它来创建类的常量。

.. rst:directive:: .. php:exception:: name

   这个指令在当前命名空间内声明一个新的 PHP 异常。其签名可以包括构造函数的参数。

.. rst:directive:: .. php:class:: name

   描述了一个类。属于该类的方法、属性和常量应该处于这个指令之内::

        .. php:class:: MyClass

            类的说明

           .. php:method:: method($argument)

           方法的说明


   属性、方法和常量不需要嵌套。他们可以直接位于类的声明之后::

        .. php:class:: MyClass

            关于类的文字

        .. php:method:: methodName()

            关于方法的文字


   .. seealso:: :rst:dir:`php:method`, :rst:dir:`php:attr`, :rst:dir:`php:const`

.. rst:directive:: .. php:method:: name(signature)

   描述一个类的方法，其参数、返回值以及异常::

        .. php:method:: instanceMethod($one, $two)

            :param string $one: 第一个参数.
            :param string $two: 第二个参数.
            :returns: 一个数组。
            :throws: InvalidArgumentException

           这是一个实例方法。

.. rst:directive:: .. php:staticmethod:: ClassName::methodName(signature)

    描述了一个静态方法，其参数、返回值以及异常，选项可参看 :rst:dir:`php:method` 。

.. rst:directive:: .. php:attr:: name

   描述一个类的属性(*property/attribute*)。

防止 Sphinx 输出警告
Prevent Sphinx to Output Warnings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

如果一个函数在多个文件中引用，Sphinx 就会输出警告。这可以很好地保证不会多次加入
一个函数，但是，有时候，你实际上就是要在两个或者多个文件中写同一个函数，例如
`debug object` 在 `/development/debugging`，也在
`/core-libraries/global-constants-and-functions` 中引用。在这种情况下，可以在
debug 函数之下增加 ``:noindex:`` 来防止警告。保证有一个引用 **没有**
``:no-index:``，这样就还可以使该函数被引用::

    .. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)
        :noindex:

交叉引用
~~~~~~~~

以下角色指向 PHP 对象，如果有匹配的指令，就会生成链接：

.. rst:role:: php:func

   指向一个PHP函数。

.. rst:role:: php:global

   指向一个名称以 ``$`` 开始的全局变量。

.. rst:role:: php:const

   指向一个全局常量、或类的常量。类的常量应当以所属类为前缀。

        DateTime 有一个 :php:const:`DateTime::ATOM` 常量。

.. rst:role:: php:class

   指向一个以名称标识的类::

     :php:class:`ClassName`

.. rst:role:: php:meth

   指向一个类的方法，该角色支持两种方法::

     :php:meth:`DateTime::setDate`
     :php:meth:`类名::静态方法`

.. rst:role:: php:attr

   指向一个对象的属性::

      :php:attr:`ClassName::$propertyName`

.. rst:role:: php:exc

   指向一个异常。


源代码
------

一个段落以 ``::`` 结束，就可以创建代码块。该段落必须缩进，且象所有段落一样，须以
单个空行分隔::

    这是一个段落::

        while ($i--) {
            doStuff()
        }

    这又是正常的文字了。

代码的文字不会被改动或格式化，除非取消该级别的缩进。


注释和警告
----------

有很多时候，你会想告诉读者一个重要的提示、特别的说明或者可能的危险。sphinx 中的
告诫(*Admonition*)正是为了这个目的。有五种类型的告诫。

* ``.. tip::`` 提示用于说明或重申有趣或者重要的信息。应当使用完整的句子以及任何
  适当的标点符号。
* ``.. note::`` 注释是用来说明特别重要的信息。应当使用完整的句子以及任何适当的标
  点符号。
* ``.. warning::`` 警告用于描述潜在的障碍，或与安全有关的信息。应当使用完整的句
  子以及任何适当的标点符号。
* ``.. versionadded:: X.Y.Z`` “增加的版本”告诫用来显示在一特定版本中增加的新功能，
  ``X.Y.Z`` 就是新增提到的功能的版本。
* ``.. deprecated:: X.Y.Z`` 与“增加的版本”告诫相反，“作废”告诫用来告知作废的功能，
  ``X.Y.Z`` 就是提到的功能作废的版本。

所有告诫都是相同的::

    .. note::

        缩进，并且前后都应留有一个空行，就象普通段落一样。

    此文字不是注释的一部分。

示例
~~~~

.. tip::

    这是一条有用的信息，你可能忘记了。

.. note::

    你应当注意这里。

.. warning::

    它可能有危险。


.. meta::
    :title lang=zh: Documentation
    :keywords lang=zh: partial translations,translation efforts,html entities,text markup,asfd,asdf,structured text,english content,markdown,formatted text,dot org,repo,consistency,translator,freenode,textile,improvements,syntax,cakephp,submission
