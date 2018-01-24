CakePHP 的文件夹结构
########################

CakePHP 应用程序框架提供以下几个默认顶层文件夹：

- *bin* 文件夹包含控制台可执行文件。
- *config* 文件夹包含少许 :doc:`/development/configuration` 内核使用的文件。比如数据库
  连接信息文件，引导文件，内核配置以及其他。
- *plugins* 文件夹包含了你的应用程序所使用的 :doc:`/plugins`。
- *logs* 文件夹一般包含了根据你的配置而定的日子文件。
- *src* 文件夹将是你的应用程序的源代码的所属之地。
- *tests* 文件夹将是你的应用程序的测试用例的所属之地。
- *tmp* 文件夹包含 CakePHP 的零时数据。具体的数据内容取决于你的配置。但是这个文件夹一般都储存
  翻译信息，模型描述以及 session 信息。
- *vendor* 文件夹包含使用 `Composer <http://getcomposer.org>`_ 安装的应用程序所依赖的扩展包。
  由于 Composer 会在更新时覆盖任何人为的修改，所以不建议改动此文件夹内的内容。
- *webroot* 是你的应用程序的公共文档根目录。它包含了外界可以直接接触的所有文件。
  
  确保 *tmp* 和 *logs* 都存在而且可被写。不然你的应用程序的性能将被严重受影响。在 debug 模式下，
  CakePHP 会发出警告，如果这些目录不可被写。

src 文件夹
==============


CakePHP 的 *src* 文件夹是在你开发时接触得最平常的地方。让我们近看下 *src* 里面的结构。

Controller
    包含你的应用程序的控制器以及他们的组件。
Locale
    储存国际化字符串文件。
Model
    包含你的应用程序的数据表，实体以及行为。
Shell
    包含应用程序的终端命令以及终端任务。
    详情可见 :doc:`/console-and-shells`。
View
    展示类都在此，他们包括视图，元件以及助手.
Template
    展示文件都在此，他们包括： 元素，错误页面，布局以及视图模版文件。
    

.. meta::
    :title lang=zh: CakePHP 的文件夹结构
    :keywords lang=en: internal libraries,core configuration,model descriptions,external vendors,connection details,folder structure,party libraries,personal commitment,database connection,internationalization,configuration files,folders,application development,readme,lib,configured,logs,config,third party,cakephp
