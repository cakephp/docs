组件
####

组件(*Components*)是在控制器之间共享的封装了的逻辑。CakePHP 附带一套非常棒的核心
组件，可帮你完成各种常见任务。你也可以创建自己的组件。如果你发现自己要在控制器间
复制粘贴代码，就应当考虑创建自己的组件，封装这些功能。创建组件可以保持控制器代码
简洁，并且让你可以在不同的项目中重用代码。

每个核心组件都会在各自的章节中详细介绍，请参看
。本节将描述如何配置和使用组件，以及如何创
建你自己的组件。

.. toctree::
    :maxdepth: 1

    /controllers/components/authentication
    /controllers/components/cookie
    /controllers/components/csrf
    /controllers/components/flash
    /controllers/components/security
    /controllers/components/pagination
    /controllers/components/request-handling

.. note::
    The documentation is not currently supported in Chinese language for this
    page.

    Please feel free to send us a pull request on
    `Github <https://github.com/cakephp/docs>`_ or use the **Improve This Doc**
    button to directly propose your changes.

    You can refer to the English version in the select top menu to have
    information about this page's topic.

.. meta::
    :title lang=zh: Components
    :keywords lang=zh: array controller,core libraries,authentication request,array name,access control lists,public components,controller code,core components,cookiemonster,login cookie,configuration settings,functionality,logic,sessions,cakephp,doc
