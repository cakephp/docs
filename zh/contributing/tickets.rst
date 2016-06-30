问题跟踪系统
############

在 CakePHP 的开发过程中，以问题跟踪系统的形式从社区获得反馈和帮助是极为重要的一部
分。所有 CakePHP 的问题跟踪都托管在
`GitHub <https://github.com/cakephp/cakephp/issues>`_ 上。

报告臭虫
========

写得好的问题报告都非常有用。下面的步骤可以帮助创建尽可能好的问题报告：

* **请**
  `搜索 <https://github.com/cakephp/cakephp/search?q=it+is+broken&ref=cmdform&type=Issues>`_
  类似的已有问题，并保证别人没有报告你的问题，或者在源代码仓库中还没有得到修复。
* **请** 包括 **如何重现问题** 的详细说明。这可以是测试用例或代码片段，来展示所报
  告的问题。如果没有办法重现问题，则意味着它不太容易被修复。
* **请** 尽可能详尽地提供关于你的(运行)环境的细节(操作系统，PHP 的版本，CakePHP 
  的版本)。
* **请不要** 使用问题跟踪系统来询问技术支持的问题。寻求技术支持，请使用
  `谷歌讨论组 <http://groups.google.com/group/cake-php>`_ 或 #cakephp 的 IRC 渠道
  或者 Stack Overflow <https://stackoverflow.com/questions/tagged/cakephp>。


报告安全问题
============

如果你发现了 CakePHP 的安全问题，请使用以下过程，而不要使用平常的错误报告系统，比
如问题跟踪系统、邮件列表或 IRC。请发送电子邮件至 **security [at] cakephp.org** 。
发送到这个邮箱的电子邮件会进入一个 CakePHP 核心团队所在的内部邮件列表中。

对于每一份报告，我们首先尝试确认该漏洞。一经确认，CakePHP 团队将采取以下措施：

* 向报告者确认我们已经收到了该问题报告，并正着手修复。我们请求报告者对该问题保密，
  直到我们对外宣布。
* 准备一个更正/补丁。
* 准备一份帖子，描述该漏洞以及可能的利用方式。
* 针对所有受影响的版本发布新版本。
* 在版本发布公告中明确地说明该问题。





.. meta::
    :title lang=zh: Tickets
    :keywords lang=zh: bug reporting system,code snippet,reporting security,private mailing,release announcement,google,ticket system,core team,security issue,bug tracker,irc channel,test cases,support questions,bug report,security issues,bug reports,exploits,vulnerability,repository
