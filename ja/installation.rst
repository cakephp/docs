インストール
############

CakePHP は素早く簡単にインストールできます。
最小構成で必要なものは、ウェブサーバと Cake のコピー、それだけです!
このマニュアルでは主に(最も一般的である) Apache でのセットアップに主眼を置いていますが、 Cake を LightHTTPD や Microsoft IIS のような様々なウェブサーバで走らせるよう設定することもできます。


システム要件
============

-  HTTPサーバー。例: Apache。mod\_rewriteが推奨されますが、必要ではありません。
-  PHP 5.2.8以上。

技術的にはデータベースエンジンは必要ではありませんが、ほとんどのアプリケーションはこれを活用することが想像できます。
CakePHPは種々のデータベース・ストレージのエンジンをサポートしています：

-  MySQL (4以上)
-  PostgreSQL
-  Microsoft SQL Server
-  SQLite

.. note::

    組み込みのドライバは全てPDOを必要とします。
    正しいPDO拡張がインストールされているか必ず確かめてください。

ライセンス
==========

CakePHPはMITライセンスの元にライセンスされています。
これは著作権(*copyright*)の提示が全く改変されていない状態で残されているという条件の元で、ソースコードを自由に更新、配布、再公開できることを意味します。
また、自由にCakePHPを宣伝やクローズソースのアプリケーションに組み込むこともできます。

CakePHPのダウンロード
=====================

CakePHP の最新版を手に入れるには、主に二つの方法があります。
ウェブサイトからアーカイブ(zip/tar.gz/tar.bz2)としてダウンロードする、あるいは git リポジトリからコードをチェックアウトする方法のいずれかにより取得できます。

最新のアーカイブをダウンロードするには、 `http://www.cakephp.org <http://www.cakephp.org>`_ のウェブサイトに行き、"Download Now!" という大きなリンクに従って進みます。

CakePHP の最新のリリースは `Github <http://github.com/cakephp/cakephp>`_ でホスティングされています。
GithubにはCakePHP自身、また多くのCakePHPプラグインが含まれています。
CakePHPのリリースは `Github downloads <http://github.com/cakephp/cakephp/downloads>`_ で入手できます。

他の手段を用いて、バグ修正や日ごとに行われる細かな機能追加が含まれた、できたてホヤホヤのコードを手に入れることができます。
これらは `Github`_ からレポジトリを複製することでアクセスすることができます::

    git clone git://github.com/cakephp/cakephp.git


パーミッション
==============

CakePHP は、幾つかの操作のために ``app/tmp`` ディレクトリを使用します。
モデルのdescriptionや、ビューのキャッシュ、セッション情報などです。

従って、Cakeのインストール時の ``app/tmp`` ディレクトリと、そのサブディレクトリ全てに、WEBサーバーのユーザによる書き込み権限があることを確認してください。

設定
====

CakePHPのインストールは、Webサーバのドキュメントルートに放り込むだけの簡単インストールから、好きなだけ複雑かつ柔軟に設定することまでもできます。
このセクションでは、CakePHPの３種類の主なインストール方法: 開発、運用、応用について説明します。

-  開発(*Development*): 簡単にはじめることができますが、アプリケーションのURLには、CakePHPをインストールしたディレクトリ名が入ります。
   他の設定と比べるとセキュリティ面はやや弱くなります。
-  運用(*Production*): Webサーバのドキュメントルートを設定できる必要がありますが、URLをクリーンにでき、セキュリティを固くできます。
-  応用(*Advanced*): 幾つかの設定により、CakePHPの重要な各ディレクトリをファイルシステムの異なる場所に配置することができるので、
   多くのCakePHPアプリケーションがひとつのCakePHPコアライブラリのフォルダを共有することなどが可能です。

開発(*Development*)
===================

開発用のインストールは Cake をセットアップする最も早い方法です。
この例では CakePHP をインストールし、 http://www.example.com/cake\_2\_0/ でアクセスできるようにする方法を説明します。
ドキュメントルートは ``/var/www/html`` であると仮定します。

Cake のアーカイブを ``/var/www/html`` に展開してください。
ドキュメントルートに、ダウンロードしたリリースの名前がついたフォルダ(例えば cake\_2.0.0)が取得できます。
このフォルダを cake\_2\_0 という名前にリネームしてください。
ファイルシステム上の開発用の設定は次のようになります:


-  /var/www/html

  -  /cake\_2\_0

     -  /app
     -  /lib
     -  /vendors
     -  /plugins
     -  /.htaccess
     -  /index.php
     -  /README


もしウェブサーバが適切に設定されていれば、 http://www.example.com/cake\_2\_0/ で Cake アプリケーションがアクセス可能になっているはずです。

運用(*Production*)
==================

運用向けのインストールは Cake をセットアップするより柔軟な方法です。
この方法を使うと、ドメイン全体を単一の CakePHP アプリケーションのように振舞わせることができます。
この例では CakePHP を任意のファイルシステムの場所にインストールし、http://www.example.com でアクセスできるようにする方法を説明します。
このインストールにおいては Apache ウェブサーバの ``DocumentRoot`` の設定を正しいものに変更する必要が出てくるかもしれないことに注意してください。

Cake のアーカイブを好きなディレクトリに展開してください。
この例において、Cake をインストールすると決めたディレクトリは /cake\_install であると仮定します。
ファイルシステム上の運用向けの設定は次のようになります:


-  /cake\_install/
   
   -  /app
      
      -  /webroot (このディレクトリを ``DocumentRoot`` ディレクティブとしてセットします)

   -  /lib
   -  /vendors
   -  /.htaccess
   -  /index.php
   -  /README


Apache を使用する場合は、そのドメインの ``DocumentRoot`` ディレクティブを次のように設定してください::

    DocumentRoot /cake_install/app/webroot

もしウェブサーバが適切に設定されていれば、 http://www.example.com で Cake アプリケーションがアクセス可能になっているはずです。

応用インストールとサーバー固有の設定
====================================

.. toctree::

   installation/advanced-installation

動作確認
========

それでは、実際に CakePHP を動作させてみましょう。
セットアップの種類にもよりますが、http://example.com/ または http://example.com/cake\_install/ をブラウザで開いてみましょう。
この時点では、CakePHP のデフォルトのホーム画面と、現在のデータベース接続の状態が表示されるはずです。

おめでとうございます!
:doc:`CakePHP の最初のアプリケーションを作る </getting-started>`
準備ができました。

動きませんか？
もしPHPのタイムゾーンに関連するエラーが出るなら、 ``app/Config/core.php`` の中のとある一行のコメントを外してください::

   <?php
   /**
    * If you are on PHP 5.3 uncomment this line and correct your server timezone
    * to fix the date & time related errors.
    */
       date_default_timezone_set('UTC');
