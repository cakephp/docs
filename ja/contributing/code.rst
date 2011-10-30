コード
######

パッチとプルリクエストはCakePHPにコードを寄贈する最善の方法です。
パッチは `lighthouse <http://cakephp.lighthouseapp.com>`_ でチケットに添付できます。
プルリクエストはgithubで作ることができ、コードに貢献するための一般的により良い方法です。

初期設定
========

CakePHPのパッチの作業に入る前に、環境を整えることをお勧めします。
以下のソフトウェアが必要となるでしょう:

* Git
* PHP 5.2.9 以上
* PHPUnit 3.5.10 - 3.5.17

名前・ハンドルネームとEメールアドレスのユーザー情報を設定してください::

    git config --global user.name 'Bob Barker'
    git config --global user.email 'bob.barker@example.com'

.. note::

    もしGitの初心者なら、優秀かつ無料である `ProGit <http://progit.org>`_ のbook(訳注: `日本語版のbook <http://progit.org/book/ja>`_)を読むことを強くお勧めします。

githuからCakePHPのソースコードのクローンを取得してください:

* `github <http://github.com>`_ のアカウントを持っていないなら、作成しましょう。
* `CakePHP repository <http://github.com/cakephp/cakephp>`_ を、 **Fork** ボタンをクリックして、Forkしてください。

forkがされた後に、ローカルマシーンにforkをクローンしてください::

    git clone git@github.com:YOURNAME/cakephp.git

オリジナルのCakePHPレポジトリをリモートレポジトリとして追加してください。
後にCakePHPレポジトリから変更を取ってくる為に使います。
これは、CakePHPを常に最新の状態に保つことができるようになるでしょう::

    cd cakephp
    git remote add upstream git://github.com/cakephp/cakephp.git

CakePHPのセットアップを済ませたなら、 ``$test``
:ref:`データベースコネクション <database-configuration>`
の定義をし、
:ref:`全体テスト <running-tests>` を実行することができるようになっているはずです。

パッチ化作業
============

バグ、機能または機能の拡張に取り組むたびに、トピックブランチを作成してください。

作成したブランチは修正・向上をする為のバージョンを元にする必要があります。
例えば、 ``2.0`` のバグを修正しているとすると、ブランチのベースとして ``2.0`` ブランチを使用するとよいでしょう。
これにより後にとても簡単に変更をマージすることができます::

    # 2.0のバグの修正をする
    git fetch upstream
    git checkout -b ticket-1234 upstream/2.0

.. tip::

    ブランチには説明的な名前を使用してください。
    チケットまたは機能名への参照は良い習慣となります。
    例えば、ticket-1234、feature-awesomeなどです。

上記はupstream(CakePHP)の2.0ブランチを基本としたローカルブランチを作成します。
修正作業をし、必要な数のコミットを作ってください。
ただし、以下のことを心がけてください:

* :doc:`/contributing/cakephp-coding-conventions` に従ってください。
* バグが修正されたこと、または新しい機能をの動作をを示すテストケースを追加してください。
* コミットを整然としたものにし、十分に明確かつ簡潔なコミットメッセージを書いてください。

プルリクエストの送信
====================

一旦変更が完了し、CakePHPへマージする準備ができているなら、ブランチの更新をしたほうがいいでしょう::

    git checkout 2.0
    git fetch upstream
    git merge upstream/2.0
    git checkout <branch_name>
    git rebase 2.0

これは作業の開始時からCakePHPに起こった全ての変更を取得＋マージします。
その後、リベースするか、現在のコード上に変更を再生します。
``rebase`` の最中に衝突(*conflict*)が起こるかもしれません。
リベースが早く終わった場合は、どのファイルが衝突したか・マージされてないかを ``git status`` で確認することができます。
各々の衝突を解決して、その後リベースを続けてください::

    git add <filename> # 全ての衝突したファイルにこれを行なってください。
    git rebase --continue

全てのテストが継続してパスしていることを確かめてください。
それから、フォークにブランチをプッシュしてください::

    git push origin <branch-name>

一旦githubにブランチが配置されたら、、
`cakephp-core <http://groups.google.com/group/cakephp-core>`_
メーリングリストで議論、またはgithubでプルリクエストを送ることができます。

.. note::

    CakePHPに寄贈される全てのコードはMITライセンスの元にライセンスされ、Cake Software Foundationが全ての寄贈されたコードの所有者になり、全ての寄贈されたコードは
    `貢献者ライセンス契約 <http://cakefoundation.org/pages/cla>`_
    (*Contributors license agreement*)
    の対象となることに注意してください。

保守ブランチへマージされたバグ修正は、コアチームによって定期的に今後のリリースにもマージされます。
