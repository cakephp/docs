コード
#######

パッチと Pull Request はコードを CakePHP に送って貢献するための素晴らしい方法です。
Pull Request は GitHub で作成することができるもので、パッチファイルをチケットのコメントで
伝えるよりも推奨される方法です。

最初のセットアップ
===================

CakePHP の修正に取りかかる前に自分の環境を整えることをお勧めします。
以下のソフトウェアが必要になります。

* Git
* PHP 5.3.0 以上
* ext/mcrypt
* ext/mbstring
* PHPUnit 3.7.0 以上 (3.7.38 推奨)
* MySQL, SQLite, または Postgres

ユーザ情報（自分の名前/ハンドル名とメールアドレス）をセットしてください。 ::

    git config --global user.name 'Bob Barker'
    git config --global user.email 'bob.barker@example.com'

.. note::

    Git を使うのが初めてなら、無料で素敵なドキュメント
    `ProGit <https://git-scm.com/book/ja/>`_ をぜひお読みください。

CakePHP のソースコードの clone を GitHub から取得してください。

* `GitHub <https://github.com>`_ アカウントを持っていないなら、作成してください。
* `CakePHP リポジトリ <https://github.com/cakephp/cakephp>`_ の **Fork**
  ボタンをクリックして Fork してください。

Fork できたら、Fork したものを自分のローカルマシンへと clone してください。 ::

    git clone git@github.com:YOURNAME/cakephp.git

オリジナルの CakePHP リポジトリを remote リポジトリとして追加してください。
これは後で CakePHP リポジトリから変更分を fetch するのに使うことになり、
こうすることで CakePHP を最新の状態にしておくのです。 ::

    cd cakephp
    git remote add upstream git://github.com/cakephp/cakephp.git

いまや CakePHP はセットアップされましたので
:ref:`データベース接続 <database-configuration>` で ``$test`` を定義すれば、
:ref:`すべてのテストを実行する <running-tests>` ことができるでしょう。

修正に取りかかる
==================

バグや新機能、改善に取り組むたびに毎回、 トピック・ブランチを作成してください。

ブランチは 修正/改善対象のバージョンをベースにして作成してください。たとえば、
``2.3`` のバグを修正するなら、ブランチのベースとして ``2.3`` ブランチを使うことになります。
もしも変更が現在の安定版リリースのバグ修正なら、 ``master`` ブランチを使ってください。
こうすることで、あなたの変更を後でマージする際にとても簡単になります。 ::

    # 2.3 のバグを修正
    git fetch upstream
    git checkout -b ticket-1234 upstream/2.3

.. tip::

    ブランチの名前は説明的につけてください。
    チケット名や機能名を含めるのは良い慣習です。
    例) ticket-1234, feature-awesome

上記は upstream (CakePHP) 2.3 ブランチをベースにローカル・ブランチを作成します。
修正に取り組み、必要なだけ commit してください。
ただし、注意点があります:

* :doc:`/contributing/cakephp-coding-conventions` に従ってください。
* バグが修正されたこと、もしくは新機能が機能することが判るテストケースを追加してください。
* 理にかなったコミットを心がけ、コミット文は解りやすく簡潔に書いてください。

Pull Request を送信する
=========================

変更し終え、 CakePHP へとマージされる準備が整ったら、あなたのブランチを
更新したくなることでしょう。 ::

    git checkout 2.3
    git fetch upstream
    git merge upstream/2.3
    git checkout <branch_name>
    git rebase 2.3

これは作業開始以降に CakePHP で行われたすべての変更を fetch + merge します。
その後に rebase 、つまり現在のコードの先端にあなたの変更を適用します。
``rebase`` 中、コンフリクトに出会うかもしれません。もし rebase が早期終了したら、
``git status`` で、どのファイルがコンフリクト/マージ失敗したのかを見ることができます。
各コンフリクトを解決させてください。その後、 rebase を continue してください。 ::

    git add <filename> # コンフリクトしたファイルごとにこれを行ってください。
    git rebase --continue

あなたのテストがすべて通過し続けているか確認してください。
その後、あなたのブランチをあなたの Fork へと push します。 ::

    git push origin <branch-name>

あなたのブランチが GitHub に上がったら、GitHub で Pull Request を送ってください。

変更対象のマージ先を選ぶ
-------------------------

Pull Request を作る際には、ベースとなるブランチが正しく選ばれているか良く確認してください。
ひとたび Pull Request を作った後ではもう変更することはできません。

* あなたの変更が **バグ修正** であり、新機能を追加しておらず、
  現在のリリースに存在している既存の振る舞いを正すだけなら、
  マージ先として **2.x** を選んでください。
* あなたの変更が **新機能** もしくはフレームワークへの追加なら、
  ``2.next`` ブランチを選んでください。
* あなたの変更が既存の機能性を壊すものであるなら、あなたのパッチが 2.x にマージされる
  可能性は低いです。代わりに 4.0 を対象にしてください。

.. note::

    あなたが貢献したすべてのコードは MIT License に基づき CakePHP にライセンスされることを
    覚えておいてください。 `Cake Software Foundation <http://cakefoundation.org/pages/about>`_
    がすべての貢献されたコードの所有者になります。貢献する人は
    `CakePHP Community Guidelines <http://community.cakephp.org/guidelines>`_
    に従うようお願いします。

メンテナンス・ブランチへとマージされたすべてのバグ修正は、
コアチームにより定期的に次期リリースにもマージされます。

.. meta::
    :title lang=ja: コード
    :keywords lang=ja: cakephp source code,code patches,test ref,descriptive name,bob barker,initial setup,global user,database connection,clone,repository,user information,enhancement,back patches,checkout
