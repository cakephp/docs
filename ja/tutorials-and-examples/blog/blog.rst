ブログチュートリアル
********************

CakePHP をさっそく使ってみましょう。このチュートリアルを読んでいるのは、
CakePHP の動作に関してさらに学びたいと思っているからだと思います。
私たちは、生産性を高め、コーディングがさらに楽しいものになることを目指しています。
コードを調べているうちに、きっとあなたもそのことに気が付くでしょう。

このチュートリアルでは、シンプルなブログアプリケーションを作成します。CakePHP を取得して
インストールし、データベースの設定を行い、ブログの投稿記事の一覧表示 (*list*)、追加 (*add*)、
編集 (*edit*)、削除 (*delete*) などのアプリケーションロジックを作成します。

必要なもの:

#. 動作しているウェブサーバ。Apache を使っているという前提で書いてありますが、
   他の種類のサーバを使用する場合でも、ほぼ同じにいけるはずです。サーバの設定を
   少し変える必要があるかもしれませんが、たいていの人は、そのままの設定で CakePHP を
   動作させることが可能です。PHP 5.3.0 以上が動作していることを確認してください。
#. データベースサーバ。このチュートリアルで MySQL を使用します。
   データベースを作成できる程度の SQL の知識が必要です。その先は CakePHP が面倒を
   みてくれます。MySQL を使用するので、PHP で ``pdo_mysql`` が有効になっていることを
   確認してください。
#. PHP の基本的な知識。オブジェクト指向プログラミングに慣れていれば非常に有利ですが、
   手続き型に慣れているという人でも心配する必要はありません。
#. 最後に、MVC プログラミングに関する基本的な知識が必要です。概要については、
   :doc:`/cakephp-overview/understanding-model-view-controller` を見てください。
   半ページぐらいの説明ですので、心配はご無用です。

それでは、はじめましょう！

CakePHP のダウンロード
======================

まずは、最新の CakePHP のコードをダウンロードしてきましょう。

最新の CakePHP をダウンロードするには、GitHub にある CakePHP プロジェクトを見てみましょう:
`https://github.com/cakephp/cakephp/tags <https://github.com/cakephp/cakephp/tags>`_
そして、2.0 の最新リリースをダウンロードします。

または、 `git <http://git-scm.com/>`_ を使ってレポジトリを clone することもできます。 ::

    git clone -b 2.x git://github.com/cakephp/cakephp.git

どちらにしても、ダウンロードしたコードを DocumentRoot 内に配置してください。
そうすると、ディレクトリは次のようになります::

    /path_to_document_root
        /app
        /lib
        /plugins
        /vendors
        .htaccess
        index.php
        README

CakePHP のディレクトリ構造について少し学んでおきましょう:
:doc:`/getting-started/cakephp-folder-structure` のセクションをチェックしてください。

Tmp ディレクトリのパーミッション
--------------------------------

次に、 ``app/tmp`` ディレクトリをウェブサーバから書き込めるように設定します。
これを行うためのいちばんいい方法は、ウェブサーバを動作させているユーザーを見つけることです。
次のコード ``<?php echo exec('whoami'); ?>`` を任意の PHP ファイルに記述して、
ウェブサーバで実行してみましょう。すると、ウェブサーバを実行しているユーザの名前が
表示されるはずです。そのユーザーに ``app/tmp`` ディレクトリの所有権を変更します。
実行するコマンドは (\*nixで) このようになります::

    $ chown -R www-data app/tmp

何らかの理由で CakePHP がそのディレクトリに書き込めない場合は、キャッシュデータが
書き込めないという警告や例外が表示されます。

ブログデータベースの作成
========================

次に、ブログで使用する基礎的なデータベースをセットアップしましょう。データベースを
まだ作成していないのであれば、このチュートリアル用に好きな名前で空のデータベースを
作成しておいてください。このページでは、投稿記事を保存するためのテーブルをひとつ作成します。
次の SQL をデータベースで実行してください。 ::

    /* まず、posts テーブルを作成します: */
    CREATE TABLE posts (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(50),
        body TEXT,
        created DATETIME DEFAULT NULL,
        modified DATETIME DEFAULT NULL
    );

    /* それから、テスト用に記事をいくつか入れておきます: */
    INSERT INTO posts (title,body,created)
        VALUES ('タイトル', 'これは、記事の本文です。', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('またタイトル', 'そこに本文が続きます。', NOW());
    INSERT INTO posts (title,body,created)
        VALUES ('タイトルの逆襲', 'こりゃ本当にわくわくする！うそ。', NOW());

テーブル名とフィールド名は適当に選んだわけではありません。CakePHP のデータベース命名規約と
クラスの命名規約に従っておくと、（どちらも、 
:doc:`/getting-started/cakephp-conventions` の中で説明されています）たくさんの機能を
自由に使うことができ、設定作業をする必要がなくなります。CakePHP はフレキシブルなので、
最悪な従来型のデータベーススキーマにも対応することができますが、規約に従えば、
時間を節約することができます。

詳細は、 :doc:`/getting-started/cakephp-conventions` を参照してください。簡単に言うと、
'posts' というテーブル名にしておけば、自動的に Post モデルが呼び出され、'modified' と
'created' というフィールドがあると、自動的にCakePHP が管理するようになります。

CakePHP のデータベース設定
==========================

どんどん進みましょう。データベースがどこにあって、どうやって接続するかを CakePHP に教えます。
多くの人にとって、設定 (*configure*) をする最初で最後の機会です。

CakePHP のデータベース設定ファイルの元は、 ``/app/Config/database.php.default`` の中に
あります。同一ディレクトリ上にこのファイルのコピーを作り、 ``database.php``
という名前にしてください。

この設定ファイルの中身は一目瞭然です。 ``$default`` 配列の値を自分のセットアップに合わせて
変更するだけです。完全な設定の配列の例は次のようなものになるでしょう::

    public $default = array(
        'datasource' => 'Database/Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'port' => '',
        'login' => 'cakeBlog',
        'password' => 'c4k3-rUl3Z',
        'database' => 'cake_blog_tutorial',
        'schema' => '',
        'prefix' => '',
        'encoding' => 'utf8'
    );

新しくできた ``database.php`` ファイルを保存したら、ブラウザを開いて、CakePHP の
welcome ページを見てください。データベース接続のファイルがあり、そしてデータベースに
接続できる、というメッセージが表示されるはずです。

.. note::

   PDO と pdo_mysql が php.ini で有効になっている必要があることを覚えておいてください。

追加の設定
==========

設定できる項目があといくつかあります。たいていの開発者はこれらの詳細なリストも仕上げますが、
このチュートリアルに必要不可欠、というわけではありません。ひとつは、セキュリティハッシュ用の
カスタム文字列(「salt」ともいう)です。二つ目は、カスタム番号 (「seed」ともいう) を暗号化用に
定義するということです。

セキュリティ用の salt は、ハッシュの生成に用いられます。 ``/app/Config/core.php`` を
編集し、デフォルトの ``Security.salt`` の値を変更してください。
この値は、ランダムで長い文字列にします。そうすることで推測がより困難になります。 ::

    /**
     * A random string used in security hashing methods.
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');

サイファシード(*cipher seed*) は暗号化・復号化のための文字列です。
``/app/Config/core.php`` を編集して ``Security.cipherSeed`` をデフォルト値から
変更してください。この値は、大きくてランダムな整数でなければなりません::

    /**
     * A random numeric string (digits only) used to encrypt/decrypt strings.
     */
    Configure::write('Security.cipherSeed', '7485712659625147843639846751');

mod\_rewrite について
=====================

新しいユーザは mod\_rewrite でつまずくことがよくあります。例えば CakePHP の
welcome ページが少しおかしくなったりします (画像が表示されない、CSS が効いていない)。
これはおそらく、システム上の mod\_rewrite が機能していないということです。
以下のいずれかの項目を参照して、URL リライティングが有効になるように設定してください。

.. toctree::
    :maxdepth: 1

    /installation/url-rewriting

はじめての CakePHP アプリケーションを構築しはじめるには、続けて
:doc:`/tutorials-and-examples/blog/part-two`
を見てください。


.. meta::
    :title lang=ja: Blog Tutorial
    :keywords lang=ja: model view controller,object oriented programming,application logic,directory setup,basic knowledge,database server,server configuration,reins,documentroot,readme,repository,web server,productivity,lib,sql,aim,cakephp,servers,apache,downloads
