コード
######

パッチとプルリクエストは CakePHP にコードを寄贈する最善の方法です。
プルリクエストは GitHub で作ることができ、パッチファイルとともに
チケットにコメントすることが好まれます。

初期設定
========

CakePHP のパッチの作業に入る前に、環境を整えることをお勧めします。
以下のソフトウェアが必要となるでしょう:

* Git
* PHP 5.2.8 以上
* PHPUnit 3.5.10 以上

名前・ハンドルネームとEメールアドレスのユーザー情報を設定してください::

    git config --global user.name 'Bob Barker'
    git config --global user.email 'bob.barker@example.com'

.. note::

    もし Git の初心者なら、優秀かつ無料である `ProGit <http://git-scm.com/book/>`_ の book
    (訳注: `日本語版のbook <http://git-scm.com/book/ja>`_) を読むことを強くお勧めします。

GitHub から CakePHP のソースコードのクローンを取得してください:

* `GitHub <http://github.com>`_ のアカウントを持っていないなら、作成しましょう。
* `CakePHP repository <http://github.com/cakephp/cakephp>`_ の
  **Fork** ボタンをクリックして、フォークしてください。

フォークされた後に、ローカルマシーンにフォークをクローンしてください::

    git clone git@github.com:YOURNAME/cakephp.git

オリジナルの CakePHP レポジトリをリモートレポジトリとして追加してください。
後に CakePHP レポジトリから変更を取ってくる為に使います。
これは、CakePHP を常に最新の状態に保つことができるようになるでしょう::

    cd cakephp
    git remote add upstream git://github.com/cakephp/cakephp.git

CakePHP のセットアップを済ませたなら、 ``$test``
:ref:`データベースコネクション <database-configuration>`
の定義をし、
:ref:`全体テスト <running-tests>` を実行することができるようになっているはずです。

パッチ化作業
============

バグ、機能または機能の拡張に取り組むたびに、トピックブランチを作成してください。

作成したブランチは修正・向上をする為のバージョンを元にする必要があります。
例えば、 ``2.3`` のバグを修正しているとすると、ブランチのベースとして ``2.3`` ブランチを使用するとよいでしょう。現在の安定版に対してバグ修正をする場合は ``master`` ブランチを使用しましょう。
これにより後にとても簡単に変更をマージすることができます::

    # 2.3のバグの修正をする
    git fetch upstream
    git checkout -b ticket-1234 upstream/2.3

.. tip::

    ブランチには説明的な名前を使用してください。
    チケットまたは機能名への参照は良い習慣となります。
    例えば、ticket-1234、feature-awesome などです。

上記は upstream (CakePHP) の 2.3 ブランチを基本としたローカルブランチを作成します。
修正作業をし、必要な数のコミットを作ってください。
ただし、以下のことを心がけてください:

* :doc:`/contributing/cakephp-coding-conventions` に従ってください。
* バグが修正されたこと、または新しい機能をの動作をを示すテストケースを追加してください。
* コミットを整然としたものにし、十分に明確かつ簡潔なコミットメッセージを書いてください。


プルリクエストの送信
====================

一旦変更が完了し、CakePHP へマージする準備ができているなら、ブランチの更新をしたほうがいいでしょう::

    git checkout 2.3
    git fetch upstream
    git merge upstream/2.3
    git checkout <branch_name>
    git rebase 2.3

これは作業の開始時から CakePHP に起こった全ての変更を取得＋マージします。
その後、リベースするか、現在のコード上に変更を再生します。
``rebase`` の最中に衝突 (*conflict*) が起こるかもしれません。
リベースが早く終わった場合は、どのファイルが衝突したか・マージされてないかを
``git status`` で確認することができます。
各々の衝突を解決して、その後リベースを続けてください::

    git add <filename> # 全ての衝突したファイルにこれを行なってください。
    git rebase --continue

全てのテストが継続してパスしていることを確かめてください。
それから、フォークにブランチをプッシュしてください::

    git push origin <branch-name>

一旦 GitHub にブランチが配置されたら、
`cakephp-core <http://groups.google.com/group/cakephp-core>`_
メーリングリストで議論、または GitHub でプルリクエストを送ることができます。

変更のマージ先を選択する
------------------------

プルリクエストを作成した後にベースブランチを変更することはできないので、
作成する前に正しいベースブランチを選択しているかを確認する必要があります。

* もし変更内容が **バグフィックス** で、現在のリリース版から新しい機能の追加や既存の動作の変更が行われていない場合、
  **master** をマージ対象にしてください。
* もし変更内容がフレームワークに **新機能** を追加するものだった場合、次期バージョンのブランチを選択してください。
  例えば、現在リリースされているバージョンが ``2.2.2`` だったら、新しい機能を受け入れるブランチは ``2.3`` となります。
* もし変更内容が既存の機能やAPIに変更を及ぼすものだった場合は、次期メジャーバージョンのブランチを選択するべきでしょう。
  例えば、現在リリースされているバージョンが ``2.2.2`` だったら、次期メジャーバージョンは ``3.0`` になります。
  既存の動作に影響を及ぼさずにすむので、そのブランチをベースブランチにしましょう。


.. note::

    CakePHP に寄贈される全てのコードは MIT ライセンスの元にライセンスされ、
    `Cake Software Foundation <http://cakefoundation.org/pages/about>`_ が
    全ての寄贈されたコードの所有者になることに注意してください。貢献者は、
    `CakePHP Community Guidelines <http://community.cakephp.org/guidelines>`_ に
    従ってください。

保守ブランチへマージされたバグ修正は、コアチームによって定期的に今後のリリースにもマージされます。


.. meta::
    :title lang=en: コード
    :keywords lang=en: cakephp source code,code patches,test ref,descriptive name,bob barker,initial setup,global user,database connection,clone,repository,user information,enhancement,back patches,checkout
