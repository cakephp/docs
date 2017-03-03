インストール
############

CakePHP は素早く簡単にインストールできます。
最小構成で必要なものは、ウェブサーバと CakePHP のコピー、それだけです!
このマニュアルでは主に(最も一般的である) Apache でのセットアップに主眼を置いていますが、
CakePHP を lighttpd や Microsoft IIS のような様々なウェブサーバで走らせるよう設定することもできます。


システム要件
============

-  HTTPサーバー。例: Apache。mod\_rewriteが推奨されますが、必須ではありません。
-  PHP 5.3.0 以上 (CakePHP バージョン 2.6 以下は、 PHP 5.2.8 以上をサポートします) 。
   CakePHP バージョン 2.8.0 以上は PHP 7 をサポートします。 PHP 7.1 以上を使用するためには、
   PECL 経由で mcrypt をインストールする必要があります。詳しくは、
   :doc:`/core-utility-libraries/security` をご覧ください。

技術的にはデータベースエンジンは必ずしも必要ではありませんが、ほとんどのアプリケーションはこれを活用することが想像できます。
CakePHPは種々のデータベース・ストレージのエンジンをサポートしています：

-  MySQL (4以上)
-  PostgreSQL
-  Microsoft SQL Server
-  SQLite

.. note::

    組み込みのドライバは全てPDOを必要とします。
    正しいPDO拡張モジュールがインストールされているか必ず確かめてください。

ライセンス
==========

CakePHPはMIT Licenseの元にライセンスされています。
これは著作権(*copyright*)の提示が全く改変されていない状態で残されているという条件の元で、ソースコードを自由に更新、配布、再公開できることを意味します。
また、自由にCakePHPを宣伝やクローズソースのアプリケーションに組み込むこともできます。

CakePHPのダウンロード
=====================

CakePHP の最新版を手に入れるには、主に二つの方法があります。
ウェブサイトからアーカイブ(zip/tar.gz/tar.bz2)としてダウンロードする、あるいは git リポジトリからコードをチェックアウトする方法のいずれかにより取得できます。

最新のアーカイブをダウンロードするには、 `https://cakephp.org <https://cakephp.org>`_ のウェブサイトに行き、
"Download" というリンクに従って進みます。

CakePHP の最新のリリースは `GitHub <https://github.com/cakephp/cakephp>`_ でホスティングされています。
GitHubにはCakePHP自身、また多くのCakePHPプラグインが含まれています。
CakePHPのリリースは `GitHub tags <https://github.com/cakephp/cakephp/tags>`_ で入手できます。

他の手段を用いて、バグ修正や日ごとに行われる細かな機能追加が含まれた、できたてホヤホヤのコードを手に入れることができます。
これらは `GitHub`_ からレポジトリを複製することでアクセスすることができます ::

    git clone -b 2.x git://github.com/cakephp/cakephp.git


パーミッション
==============

CakePHP は、幾つかの操作のために ``app/tmp`` ディレクトリを使用します。
モデルのdescriptionや、ビューのキャッシュ、セッション情報などです。

従って、 CakePHP のインストール時の ``app/tmp`` ディレクトリと、そのサブディレクトリ全てに、ウェブサーバーのユーザによる書き込み権限があることを確認してください。

一般的な課題として、app/tmp ディレクトリとサブディレクトリは、ウェブサーバとコマンドラインユーザの両方で書き込み権限が必要なことがあります。
UNIXシステム上で ウェブサーバユーザとコマンドラインユーザが異なる場合、パーミッションのプロパティ設定を確保するために、あなたのプロジェクト内で一度だけ以下のコマンドを実行してください。 ::

   HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
   setfacl -R -m u:${HTTPDUSER}:rwx app/tmp
   setfacl -R -d -m u:${HTTPDUSER}:rwx app/tmp

設定
====

CakePHP のインストールは、ウェブサーバのドキュメントルートに放り込むだけの簡単インストールから、好きなだけ複雑かつ柔軟に設定することまでもできます。
このセクションでは、CakePHPの３種類の主なインストール方法: 開発、運用、応用について説明します。

-  開発(*Development*): 簡単にはじめることができますが、アプリケーションのURLには、CakePHPをインストールしたディレクトリ名が入ります。
   他の設定と比べるとセキュリティ面はやや弱くなります。
-  運用(*Production*): ウェブサーバのドキュメントルートを設定できる必要がありますが、URLをクリーンにでき、セキュリティを固くできます。
-  応用(*Advanced*): 幾つかの設定により、CakePHPの重要な各ディレクトリをファイルシステムの異なる場所に配置することができるので、
   多くのCakePHPアプリケーションがひとつのCakePHPコアライブラリのフォルダを共有することなどが可能です。

開発(*Development*)
===================

開発用のインストールは CakePHP をセットアップする最も早い方法です。
この例では CakePHP をインストールし、 http://www.example.com/cake\_2\_0/ でアクセスできるようにする方法を説明します。
ドキュメントルートは ``/var/www/html`` であると仮定します。

CakePHP のアーカイブを ``/var/www/html`` に展開してください。
ドキュメントルートに、ダウンロードしたリリースの名前がついたフォルダ(例えば cake\_2.0.0)が取得できます。
このフォルダを cake\_2\_0 という名前にリネームしてください。
ファイルシステム上の開発用の設定は次のようになります ::

    /var/www/html/
        cake_2_0/
            app/
            lib/
            plugins/
            vendors/
            .htaccess
            index.php
            README

もしウェブサーバが適切に設定されていれば、 http://www.example.com/cake\_2\_0/ で CakePHP アプリケーションがアクセス可能になっているはずです。

複数のアプリケーションから一つのCakePHPを使用する
-------------------------------------------------

多数のアプリケーションを開発している場合、\
それらがCakePHPのコアファイルを共有するのは理にかなっているといえます。\
そのようにするには、いくつか方法があります。いちばん簡単なのが、PHPの ``include_path`` を使う方法です。\
そのためにまずは、CakePHPを適当なディレクトリに複製します。この例では
``/home/mark/projects`` ディレクトリにします。 ::

    git clone git://github.com/cakephp/cakephp.git /home/mark/projects/cakephp

このコマンドを実行すると、CakePHP のファイルが ``/home/mark/projects`` ディレクトリの中に複製されます。\
gitを使用したくない場合は、zip形式でのダウンロードも可能で、残りの手順も同じです。\
次は、 ``php.ini`` を探して編集する必要があります。\*nix系のシステムならたいていは
``/etc/php.ini`` にあります。もしくは ``php -i`` コマンドを実行して 'Loaded Configuration File' を確認してください。\
ini ファイルを見つけたら、 ``include_path`` の設定を変更して ``/home/mark/projects/cakephp/lib`` が含まれるようにしてください。\
例としては次のようになります。 ::

    include_path = .:/home/mark/projects/cakephp/lib:/usr/local/php/lib/php

ウェブサーバを再起動した後、 ``phpinfo()`` で変更が反映されているのを確認してください。

.. note::

    Windowsでは、インクルードパスの区切りは : ではなく ; になります。

``include_path`` の設定が完了したので、アプリケーションはCakePHPのファイルを見つけられるようになりました。

運用(*Production*)
==================

運用向けのインストールは CakePHP をセットアップするより柔軟な方法です。
この方法を使うと、ドメイン全体を単一の CakePHP アプリケーションのように振舞わせることができます。
この例では CakePHP を任意のファイルシステムの場所にインストールし、 http://www.example.com でアクセスできるようにする方法を説明します。
このインストールにおいては Apache ウェブサーバの ``DocumentRoot`` の設定を正しいものに変更する必要が出てくるかもしれないことに注意してください。

CakePHP のアーカイブを好きなディレクトリに展開してください。
この例において、CakePHP をインストールすると決めたディレクトリは /cake\_install であると仮定します。
ファイルシステム上の運用向けの設定は次のようになります ::

    /cake_install/
        app/
            webroot/ (このディレクトリを ``DocumentRoot`` ディレクティブとしてセットします)
        lib/
        plugins/
        vendors/
        .htaccess
        index.php
        README

Apache を使用する場合は、そのドメインの ``DocumentRoot`` ディレクティブを次のように設定してください ::

    DocumentRoot /cake_install/app/webroot

もしウェブサーバが適切に設定されていれば、 http://www.example.com で CakePHP アプリケーションがアクセス可能になっているはずです。

応用インストールと URL リライティング
=====================================

.. toctree::
    :maxdepth: 1

    installation/advanced-installation
    installation/url-rewriting

動作確認
========

それでは、実際に CakePHP を動作させてみましょう。
セットアップの種類にもよりますが、 http://example.com/ または http://example.com/cake\_2\_0/ をブラウザで開いてみましょう。
この時点では、CakePHP のデフォルトのホーム画面と、現在のデータベース接続の状態が表示されるはずです。

おめでとうございます!
:doc:`CakePHP の最初のアプリケーションを作る </getting-started>`
準備ができました。

動きませんか？
もし PHP のタイムゾーンに関連するエラーが出るなら、 ``app/Config/core.php`` の中のとある一行のコメントを外してください ::

   /**
    * Uncomment this line and correct your server timezone to fix
    * any date & time related errors.
    */
       date_default_timezone_set('UTC');


.. meta::
    :title lang=ja: インストール
    :keywords lang=ja: apache mod rewrite,microsoft sql server,tar bz2,tmp directory,database storage,archive copy,tar gz,source application,current releases,web servers,microsoft iis,copyright notices,database engine,bug fixes,lighttpd,repository,enhancements,source code,cakephp,incorporate
