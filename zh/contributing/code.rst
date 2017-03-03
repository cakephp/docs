代码
####

补丁和拉取请求是为 CakePHP 贡献代码的一种很棒的方式。拉取请求可以在 GitHub 中创建，
是比附在问题报告的评论（*ticket comments*）中的补丁更受青睐的方式。

初始设置
========

在开始为 CakePHP 制作补丁之前，最好先把你的环境设置好。你需要下列软件：

* Git
* PHP 5.2.8 或更高版本
* PHPUnit 3.5.10 或更高版本 （建议使用 3.7.38）

设置你的用户信息，包括你的名字/账号和电子邮件::

    git config --global user.name 'Bob Barker'
    git config --global user.email 'bob.barker@example.com'

.. note::

    如果你对 Git 完全陌生，我们强烈建议你阅读优秀且免费的
    `ProGit <http://git-scm.com/book/>`_ 这本书。

从 GitHub 获得一份 CakePHP 源程序的克隆（*clone*）。

* 如果你没有 `GitHub <https://github.com>`_ 的账号，创建一个。
* 点击**Fork**按键，复制（*fork*）一份
  `CakePHP repository <https://github.com/cakephp/cakephp>`_ 的源码。

你的复制完成后，从你的复制仓库（*repository*）克隆（*clone*）到你的本地机器::

    git clone git@github.com:你的账号/cakephp.git

把原始的 CakePHP 仓库添加为远程仓库（*remote repository*）。以后你会使用它来抓取
CakePHP 仓库的改动，保持与 CakePHP 仓库一致::

    cd cakephp
    git remote add upstream git://github.com/cakephp/cakephp.git

现在你已经搭建好了 CakePHP 的环境。你应该能够定义一个 ``$test``
:ref:`数据库连接 <database-configuration>`，并且
:ref:`运行所有的测试 <running-tests>` 。

制作补丁
========

每次当你要修复一个臭虫（*bug*）、增加一个特性或做一个改进时，创建一个主题分支
（*topic branch*）。

你创建的分支，应根据你的修复/改进所适用的版本。例如，如果你正在修复 ``2.3`` 版本
中的一个臭虫，那么你就应当以 ``2.3`` 的分支为基础来创建你的分支。如果你做的改动是
对当前的稳定版本的一个臭虫的修复，你就应当使用 ``master`` 分支。这样以后合并改动
时就会简单多了::

    # fixing a bug on 2.3
    git fetch upstream
    git checkout -b ticket-1234 upstream/2.3

.. tip::

    作为一个良好的习惯，为你的分支起一个描述性的名称，可以引用问题跟踪报告或特性
    名称。例如 ticket-1234，超棒的特性

上述命令将创建基于上游（CakePHP）2.3分支的一个本地分支。进行你的臭虫修复工作，根据
你的需要做任意多次的提交（*commit*）。不过你要牢记以下几点:

* 遵循 :doc:`/contributing/cakephp-coding-conventions` 。
* 添加一个测试用例来说明错误修复好了，或者新特性能够工作。
* 使你的提交保持逻辑性，提交信息应当清晰、简洁。


提交拉取请求
============

一旦你的改动完成了，并且可以合并到 CakePHP 中去了，你就应当更新你的分支::

    git checkout 2.3
    git fetch upstream
    git merge upstream/2.3
    git checkout <branch_name>
    git rebase 2.3

这将抓取+合并自从你开始之后 CakePHP 中的任何改动。然后，它将衍合（*rebase*）-- 或
者说，在当前代码的基础上重新应用你的改动。在 ``衍合`` 过程中你可能会遇到冲突。如
果衍合过早退出，你可以使用 ``git status`` 命令来查看哪些文件发生冲突/没有合并。解
决每个冲突，然后继续衍合::

    git add <filename> # 针对每一个发生冲突的文件。
    git rebase --continue

检查所有的测试仍然通过。然后把你的分支推送（*push*）到你的复制（*fork*）仓库上::

    git push origin <branch-name>

一旦你的分支在 GitHub 上，你就可以在 GitHub 上提交拉取请求（*pull request*）。

选择你的改动会被合并到哪里
--------------------------

当提交拉取请求时，你应该确保你选择了正确的分支作为基础，因为拉取请求一经创建就无
法更改。

* 如果你的改动是一个 **错误修正**，并不引入新功能，只是纠正当前版本中现有的行为，
  则请选择 **master** 为合并目标。
* 如果你的改动是一个 **新特性** 或者为框架新增的功能，那么你应选择下一个版本号对
  应的分支。例如，如果目前的稳定版本是 ``2.2.2``，则接受新特性的分支将是 ``2.3``。
* 如果你的改动打破（*break*）了现有的功能或 API，那么你就应当选择再下一个主要版本。
  例如，如果当前的版本是 ``2.2.2``，那么下一次现有的功能可以被打破（*broken*）就是
  在 ``3.0`` 版本了，所以你应该针对这一分支。


.. note::

    请记住，所有你贡献给 CakePHP 的代码将被置于 MIT 许可之下，
    `Cake Software Foundation <http://cakefoundation.org/>`_ 将会成为
    任何贡献出去的代码的所有者。代码贡献者应当遵循
    `CakePHP Community Guidelines <http://community.cakephp.org/guidelines>`_ 。

所有合并到维护分支中的臭虫修复，也将被核心团队定期地合并到即将发布的下一个版本。


.. meta::
    :title lang=zh: Code
    :keywords lang=zh: cakephp source code,code patches,test ref,descriptive name,bob barker,initial setup,global user,database connection,clone,repository,user information,enhancement,back patches,checkout
