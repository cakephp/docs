コード
##########

..
    Code

..
    Patches and pull requests are a great way to contribute code back to CakePHP.
    Pull requests can be created in GitHub, and are preferred over patch files in
    ticket comments.

パッチとプルリクエストはコードを CakePHP に送って貢献するための素晴らしい方法です。
プルリクエストは GitHub で作成することができるもので、パッチファイルをチケットのコメントで伝えるよりも推奨される方法です。

最初のセットアップ
=====================

..
    Initial Setup

..
    Before working on patches for CakePHP, it's a good idea to get your environment
    setup. You'll need the following software:

CakePHP 用のパッチを動かす前に自分の環境を作っておくのは良い考えです。
次のようなソフトウェアが必要になります:

* Git
* PHP 5.4.16 以上
* PHPUnit 3.7.0 以上

..
    Set up your user information with your name/handle and working email address::

ユーザ情報（自分の名前/ハンドル名とメールアドレス）をセットします::

    git config --global user.name 'Bob Barker'
    git config --global user.email 'bob.barker@example.com'

.. note::

    Git を使うのが初めてなら、無料で素敵なドキュメント `ProGit <https://git-scm.com/book/ja/>`_ をぜひお読みください。

..
    If you are new to Git, we highly recommend you to read the excellent and free
    `ProGit <http://git-scm.com/book/>`_ book.

..
    Get a clone of the CakePHP source code from GitHub:

CakePHP のソースコードの clone を GitHub から取得します。

* `GitHub <http://github.com>`_ アカウントを持っていないなら、作成してください。
* `CakePHP リポジトリ <http://github.com/cakephp/cakephp>`_ の **Fork** ボタンをクリックして Fork してください。

..
    * If you don't have a `GitHub <http://github.com>`_ account, create one.
    * Fork the `CakePHP repository <http://github.com/cakephp/cakephp>`_ by clicking
      the **Fork** button.


..
    After your fork is made, clone your fork to your local machine::

Fork できたら、Fork したものを自分のローカルマシンへと clone してください::

    git clone git@github.com:YOURNAME/cakephp.git

..
    Add the original CakePHP repository as a remote repository. You'll use this
    later to fetch changes from the CakePHP repository. This will let you stay up
    to date with CakePHP::

オリジナルの CakePHP リポジトリを remote リポジトリとして追加してください。
これは後で CakePHP リポジトリから変更分を fetch するのに使うことになり、
こうすることで CakePHP を最新の状態にしておくのです::

    cd cakephp
    git remote add upstream git://github.com/cakephp/cakephp.git

..
    Now that you have CakePHP setup you should be able to define a ``$test``
    :ref:`database connection <database-configuration>`, and
    :ref:`run all the tests <running-tests>`.

いまや CakePHP はセットアップされましたので
:ref:`データベース接続 <database-configuration>` で ``test`` を定義すれば、
:ref:`すべてのテストを走らせる <running-tests>` ことができるでしょう。


修正に取りかかる
====================

..
    Working on a Patch

..
    Each time you want to work on a bug, feature or enhancement create a topic
    branch.

バグ(bug)や新機能(feature)、改善(enhancement)に取り組むたびに毎回、 トピック・ブランチを作成してください。

..
    The branch you create should be based on the version that your fix/enhancement
    is for. For example if you are fixing a bug in ``2.3`` you would want to use
    the ``2.3`` branch as the base for your branch. If your change is a bug fix
    for the current stable release, you should use the ``master`` branch. This
    makes merging your changes in later much simpler::

ブランチは 修正(fix)/改善(enhancement)対象のバージョンをベースにして作成してください。
たとえば、 ``2.3`` のバグを修正するなら、ブランチのベースとして ``2.3`` ブランチを使うことになります。
もしも変更が現在の stable リリースのバグ修正なら、 ``master`` ブランチを使ってください。
こうすることで、あなたの変更を後でマージする際にとても簡単になります::

    # fixing a bug on 2.3
    git fetch upstream
    git checkout -b ticket-1234 upstream/2.3

.. tip::

    ブランチの名前は説明的につけてください。
    チケット(ticket)名や機能(feature)名を含めるのは良い慣習です。
    例) ticket-1234, feature-awesome

..
    Use a descriptive name for your branch, referencing the ticket or feature
    name is a good convention. e.g. ticket-1234, feature-awesome

..
    The above will create a local branch based on the upstream (CakePHP) 2.3 branch.
    Work on your fix, and make as many commits as you need; but keep in mind the
    following:

上記は upstream (CakePHP) 2.3 ブランチをベースにローカル・ブランチを作成します。
修正に取り組み、必要なだけ commit してください。
ただし、注意点があります:

* :doc:`/contributing/cakephp-coding-conventions` に従ってください。
* バグが修正されたこと、もしくは新機能が機能することが判るテストケースを追加してください。
* 理にかなったコミットを心がけ、コミット文は解りやすく簡潔に書いてください。

..
    * Follow the :doc:`/contributing/cakephp-coding-conventions`.
    * Add a test case to show the bug is fixed, or that the new feature works.
    * Keep your commits logical, and write good clear and concise commit messages.


Pull Request を送信する
=============================

..
    Submitting a Pull Request

..
    Once your changes are done and you're ready for them to be merged into CakePHP,
    you'll want to update your branch::

変更し終え、 CakePHP へとマージされる準備が整ったら、あなたのブランチを update したくなることでしょう::

    git checkout 2.3
    git fetch upstream
    git merge upstream/2.3
    git checkout <branch_name>
    git rebase 2.3

..
    This will fetch + merge in any changes that have happened in CakePHP since you
    started. It will then rebase - or replay your changes on top of the current
    code. You might encounter a conflict during the ``rebase``. If the rebase
    quits early you can see which files are conflicted/un-merged with ``git status``.
    Resolve each conflict, and then continue the rebase::

これは作業開始以降に CakePHP で行われたすべての変更を fetch + merge します。
その後に rebase 、つまり、現行のコードの top 上にあなたの変更を再演します。
``rebase`` 中、コンフリクトに出会うかもしれません。
もし rebase が早期終了したら、 ``git status`` で、どのファイルがコンフリクト/マージ失敗したのかを見ることができます。
各コンフリクトを解決させてください。その後、 rebase を continue してください::

    git add <filename> # コンフリクトしたファイルごとにこれを行ってください。
    git rebase --continue

..
    Check that all your tests continue to pass. Then push your branch to your
    fork::

あなたのテストがすべて通過し続けているか確認してください。
その後、あなたのブランチをあなたの fork へと push します::

    git push origin <branch-name>

..
    Once your branch is on GitHub, you can discuss it on the
    `cakephp-core <http://groups.google.com/group/cakephp-core>`_ mailing list or
    submit a pull request on GitHub.

あなたのブランチが GitHub 上に行ったら、
`cakephp-core <http://groups.google.com/group/cakephp-core>`_ メーリングリストでそれを知らせるか、
GitHub で pull request を送ってください。

変更対象のマージ先を選ぶ
-----------------------------------------------

..
    Choosing Where Your Changes will be Merged Into

..
    When making pull requests you should make sure you select the correct base
    branch, as you cannot edit it once the pull request is created.

pull request を作る際には、ベースとなるブランチが正しく選ばれているか良く確認してください。
ひとたび pull request を作った後ではもう変更することはできません。

* あなたの変更が **bugfix(バグ修正)** であり、新機能を追加しておらず、
  current release に存在している既存の振る舞いを正すだけなら、
  マージ先として **master** を選んでください。
* あなたの変更が **new feature(新機能)** もしくはフレームワークへの追加なら、
  次のバージョン番号のブランチを選んでください。
  たとえば、現状の stable release が ``2.2.2`` なら、
  新機能を受け入れるブランチは ``2.3`` になります。
* あなたの変更が既存の機能性を壊すものであったり、API の仕様を変えるものであるなら、
  次の major release を選ばなければなりません。
  たとえば、現状の release が ``2.2.2`` なら、
  次に既存の振る舞いを変更できるのは ``3.0`` となりますので、そのブランチを選んでください。

..
    * If your change is a **bugfix** and doesn't introduce new functionality and only
      corrects existing behavior that is present in the current release. Then
      choose **master** as your merge target.
    * If your change is a **new feature** or an addition to the framework, then you
      should choose the branch with the next version number. For example if the
      current stable release is ``2.2.2``, the branch accepting new features will be
      ``2.3``
    * If your change is a breaks existing functionality, or API's then you'll have
      to choose then next major release. For example, if the current release is
      ``2.2.2`` then the next time existing behavior can be broken will be in
      ``3.0`` so you should target that branch.


.. note::

    あなたが貢献したすべてのコードは MIT License に基づき CakePHP にライセンスされることを覚えておいてください。
    `Cake Software Foundation <http://cakefoundation.org/pages/about>`_ がすべての貢献されたコードの所有者になります。
    貢献する人は `CakePHP Community Guidelines <http://community.cakephp.org/guidelines>`_ に従うようお願いします。

..
    Remember that all code you contribute to CakePHP will be licensed under the
    MIT License, and the `Cake Software Foundation <http://cakefoundation.org/pages/about>`_
    will become the owner of any contributed code. Contributors should follow the 
    `CakePHP Community Guidelines <http://community.cakephp.org/guidelines>`_.

..
    All bug fixes merged into a maintenance branch will also be merged into upcoming
    releases periodically by the core team.

メンテナンス・ブランチへとマージされたすべてのバグ修正は、
コアチームにより定期的に次期リリースにもマージされます。

.. meta::
    :title lang=en: Code
    :keywords lang=en: cakephp source code,code patches,test ref,descriptive name,bob barker,initial setup,global user,database connection,clone,repository,user information,enhancement,back patches,checkout
