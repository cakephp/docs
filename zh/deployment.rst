部署
####

一旦应用程序完成了，或者甚至在此之前，你就要部署它了。在部署 CakePHP 应用程序时有一些
你应当做的事情。

检查安全性
==========

如果你要把你的应用程序放在可以公开访问的环境，最好确保它没有任何漏洞。请查看 
:doc:`/core-libraries/components/security-component`，了解如何防备 CSRF 攻击、
表单字段篡改，等等。进行 :doc:`/models/data-validation` 及/或 
:doc:`/core-utility-libraries/sanitize` 也是保护数据库、防备 XSS 攻击很好的办法。
检查确保只有 ``webroot`` 目录可以公开访问，机密信息(比如应用程序的盐和安全密钥)是
秘密的，也是唯一的。

设置文档根目录
==============

在应用程序中正确地设置文档根目录，是保护代码不泄漏、保证应用程序更安全的重要步骤。
CakePHP 应用程序应当设置文档根目录为应用程序的 ``app/webroot`` 目录。这使得应用程序
和配置文件无法通过网址访问。设置文档根目录对不同的 web 服务器是不同的。关于 web 
服务器相关的信息，可以参看 :doc:`/installation/url-rewriting` 文档。

在所有情况下，你都应当设置虚拟主机/域(*virtual host/domain*)的文档为 
``app/webroot/``。这样就避免了 webroot 目录以外的文件被执行的可能性。

更新 core.php
=============

更新 core.php、尤其是 ``debug`` 的值是极其重要的。设置 debug = 0 禁用了一系列开发
功能，一般来说，是绝不应当暴露在互联网中的。禁用调试改变了下面这些事情:

* 禁止了由 :php:func:`pr()` 和 :php:func:`debug()` 产生的调试信息。
* 核心 CakePHP 缓存默认为每 999 天清理一次，而不是象在开发模式下每 10 秒清理一次。
* 错误视图(*view*)提供更少的信息，而且只给出笼统的错误消息。
* 不显示错误。
* 没有异常堆栈追踪。

除了上面这些，许多插件和应用程序扩展使用 ``debug`` 来改变它们的行为。

你可以检查环境变量，从而在不同环境中动态地设置调试级别。这样就避免了部署 debug > 0 
的应用程序，也省去了在每次部署到生产环境之前要改变调试级别。

例如，你可以在 Apache 配置中设置一个环境变量::

	SetEnv CAKEPHP_DEBUG 2

然后就可以在 ``core.php`` 中动态地设置调试级别::

	if (getenv('CAKEPHP_DEBUG')) {
		Configure::write('debug', 2);
	} else {
		Configure::write('debug', 0);
	}

改善应用程序的性能
==================

因为通过调度器(*Dispatcher*)处理静态资源，比如插件的图像、JavaScript 和 CSS 文件，
是令人难以置信的低效的，所以强烈建议在生产环境中符号链接(*symlink*)它们。比如象这样::

    ln -s app/Plugin/YourPlugin/webroot/css/yourplugin.css app/webroot/css/yourplugin.css


.. meta::
    :title lang=zh: Deployment
    :keywords lang=zh: stack traces,application extensions,set document,installation documentation,development features,generic error,document root,func,debug,caches,error messages,configuration files,webroot,deployment,cakephp,applications
