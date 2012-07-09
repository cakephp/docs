ブログチュートリアル
####################

Cakeをさっそく使ってみましょう。
このチュートリアルを読んでいるのは、Cakeの動作に関してさらに学びたいと思っているからだと思います。
私たちは、生産性を高め、コーディングがさらに楽しいものになることを目指しています。
コードを調べているうちに、きっとあなたもそのことに気が付くでしょう。

このチュートリアルでは、シンプルなブログアプリケーションを作成します。
Cakeを取得してインストールし、データベースの設定を行い、ブログの投稿記事の一覧表示(*list*)、追加(*add*)、編集(*edit*)、削除(*delete*)などのアプリケーションロジックを作成します。

必要なもの:

#. 動作しているWebサーバ。
   Apacheを使っているという前提で書いてありますが、他の種類のサーバを使用する場合でも、ほぼ同じにいけるはずです。
   サーバの設定を少し変える必要があるかもしれませんが、たいていの人は、そのままの設定でCakeを動作させることが可能です。
#. データベースサーバ。
   このチュートリアルでMySQLを使用します。
   データベースを作成できる程度のSQLの知識が必要です。
   その先はCakeが面倒をみてくれます。
#. PHPの基本的な知識。
   オブジェクト指向プログラミングに慣れていれば非常に有利ですが、手続き型に慣れているという人でも心配する必要はありません。
#. 最後に、MVCプログラミングに関する基本的な知識が必要です。
   概要については、 :doc:`/cakephp-overview/understanding-model-view-controller` を見てください。
   半ページぐらいの説明ですので、心配はご無用です。

それでは、はじめましょう！

Cakeのダウンロード
==================

まずは、最新のCakeのコードをダウンロードしてきましょう。

最新のCakeをダウンロードするには、githubにあるCakePHPプロジェクトを見てみましょう:
`http://github.com/cakephp/cakephp/downloads <http://github.com/cakephp/cakephp/downloads>`_
そして、2.0の最新リリースをダウンロードします。

または、
`git <http://git-scm.com/>`_
を使ってレポジトリをcloneすることもできます。
``git clone git://github.com/cakephp/cakephp.git``

どちらにしても、ダウンロードしたコードをDocumentRoot内に配置してください。
そうすると、ディレクトリは次のようになります:

::

    /path_to_document_root
        /app
        /lib
        /plugins
        /vendors
        .htaccess
        index.php
        README

Cakeのディレクトリ構造について少し学んでおきましょう:
:doc:`/getting-started/cakephp-folder-structure` のセクションをチェックしてください。

ブログデータベースの作成
========================

次に、ブログで使用する基礎的なデータベースをセットアップしましょう。
データベースをまだ作成していないのであれば、このチュートリアル用に好きな名前で空のデータベースを作成しておいてください。
このページでは、投稿記事を保存するためのテーブルをひとつ作成します。
次のSQLをデータベースで実行してください。

::

    /* まず、postsテーブルを作成します: */
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

テーブル名とフィールド名は適当に選んだわけではありません。
Cakeのデータベース命名規約とクラスの命名規約に従っておくと、（どちらも、 :doc:`/getting-started/cakephp-conventions` の中で説明されています）たくさんの機能を自由に使うことができ、設定作業をする必要がなくなります。
Cakeはフレキシブルなので、最悪な従来型のデータベーススキーマにも対応することができますが、規約に従えば、時間を節約することができます。

詳細は、 :doc:`/getting-started/cakephp-conventions` を参照してください。
簡単に言うと、'posts'というテーブル名にしておけば、自動的にPostモデルが呼び出され、'modified'と'created'というフィールドがあると、自動的にCakeが管理するようになります。

Cakeのデータベース設定
======================

どんどん進みましょう。
データベースがどこにあって、どうやって接続するかをCakeに教えます。
多くの人にとって、設定(*configure*)をする最初で最後の機会です。

CakePHPのデータベース設定ファイルの元は、
``/app/Config/database.php.default`` の中にあります。
同一ディレクトリ上にこのファイルのコピーを作り、 ``database.php`` という名前にしてください。

この設定ファイルの中身は一目瞭然です。
``$default`` 配列の値を自分のセットアップに合わせて変更するだけです。
完全な設定の配列の例は次のようなものになるでしょう:

::

    <?php
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
        'encoding' => 'utf8' //日本語ではencodingを指定しましょう。
    );

新しくできた ``database.php`` ファイルを保存したら、ブラウザをあけて、Cakeのwelcomeページを開いてください。
データベース接続のファイルがある、そしてデータベースに接続できる、というメッセージが表示されるはずです。

追加の設定
==========

設定できる項目があと三つあります。
たいていの開発者はこれらの詳細なリストも仕上げますが、このチュートリアルに必要不可欠、というわけではありません。
ひとつは、セキュリティハッシュ用のカスタム文字列(「salt」ともいう)です。
二つ目は、独自の番号(「seed」ともいう)を暗号化用に定義するということです。
三つ目は、CakePHPが、 ``tmp`` フォルダに書き込めるようにすることです。

セキュリティ用のsaltは、ハッシュの生成に用いられます。
``/app/Config/core.php`` の187行目を編集し、デフォルトのsalt値を変更してください。
すぐに推測できるような値でなければ、何であってもかまいません。

::

    <?php
    /**
     * A random string used in security hashing methods.
     */
    Configure::write('Security.salt', 'pl345e-P45s_7h3*S@l7!');

サイファシード(*cipher seed*)は暗号化・復号化のための文字列です。
シード値を ``/app/Config/core.php`` の192行目を編集してデフォルト値から変えてください。
すぐに推測できるような値でなければ、何であってもかまいません。

::

    <?php
    /**
     * A random numeric string (digits only) used to encrypt/decrypt strings.
     */
    Configure::write('Security.cipherSeed', '7485712659625147843639846751');

最後の作業は、 ``app/tmp`` ディレクトリをWebで書き込めるようにすることです。
いちばん良い方法は、Webサーバのユーザ名を調べて、(``<?php echo `whoami`; ?>``) ``app/tmp`` ディレクトリの所有権をそのユーザにすることです。
この最後の（\*nixでの）コマンドは次のようなものです::

    $ chown -R www-data app/tmp

何かの理由でCakePHPがそのディレクトリに書き込めない場合、警告が表示されます。
（運用モードでは表示されません。）
If for some reason CakePHP can't write to that directory, you'll be
informed by a warning while not in production mode.

mod\_rewriteについて
====================

新しいユーザはmod\_rewriteでつまずくことがよくあるので、少しだけ説明をしておきます。
もし、CakePHPのwelcomeページが少しおかしい（画像が表示されず、cssのスタイルが適用されていない）なら、おそらく、システム上のmod\_rewriteが機能していないということです。
動作させるための幾つかのヒントを掲載しておきます:


#. httpd.confの中で、.htaccessのoverrideが許可されているか、確かめてください。
   各ディレクトリごとの設定を定義できる部分があります。
   該当するディレクトリの ``AllowOverride`` が ``All`` になっていることを確認してください。
   セキュリティとパフォーマンスの理由から、 ``<Directory />`` で ``AllowOverride`` を ``All`` に *しないでください* 。
   代わりに、実際のWEBサイトディレクトリを参照している ``<Directory>`` ブロックを探してください。

#. user-やサイト固有のhttpd.confではなく、正しいhttpd.confを編集していることを確認しましょう。

#. 何かしらの理由で、.htaccessファイルが含まれていないCakePHPのファイルを入手した可能性もあります。
   これは、「.」(ドット)ではじまるファイルを隠し属性のものとして扱い、それらをコピーしないオペレーティングシステムがあるためです。
   必ずCakePHPを本家サイトのダウンロードセクションか、gitリポジトリからダウンロードしてください。

#. Apacheが、mod\_rewriteを正しく読み込んでいることを確認しましょう。
   httpd.confの中に、::

       LoadModule rewrite_module             libexec/httpd/mod_rewrite.so

   または(Apache 1.3で)::

       AddModule             mod_rewrite.c
   
   というような部分があるはずです。

サーバでmod\_rewrite（や、その他の互換モジュール）を使いたくない、または使えないという場合には、Cakeに組み込まれているURLを奇麗にする仕組みを使う必要があります。
``/app/Config/core.php`` の中の次の箇所のコメントを外してください::

    Configure::write('App.baseUrl', env('SCRIPT_NAME'));

また以下の .htaccess ファイルを削除してください::

    /.htaccess
    /app/.htaccess
    /app/webroot/.htaccess
            

そうすると、URLは、
www.example.com/controllername/actionname/param
ではなく、
www.example.com/index.php/controllername/actionname/param
という仕方でアクセスできるようになります。

Apache以外のWEBサーバーでCakePHPをインストールしたなら、
:doc:`/installation/advanced-installation`
セクション以下に他のサーバーでURL書き換えが動作するような案内を受けることができます。

はじめてのCakePHPアプリケーションを構築しはじめるには、続けて
:doc:`/tutorials-and-examples/blog/part-two`
を見てください。


