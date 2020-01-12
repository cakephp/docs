4.0 アップグレードガイド
########################

4.0 にアップグレードする前に、まず 3.8 にアップグレードしたことを確認してください。
次に、非推奨の警告を有効にします。 ::

    // config/app.php の中で
    'Error' => [
        'errorLevel' => E_ALL ^ E_USER_DEPRECATED,
    ]

次に、アプリケーションとそのプラグインが発行する非推奨の警告を段階的に修正します。

PHP 7.2 へのアップグレード
==========================

CakePHP 4.0 は **PHP 7.2** を必要とします。リスクを減らすために、 CakePHP を更新する前に
PHP をアップグレードすることを推奨します。

アップグレードツールの使用
==========================

CakePHP 4 は、 strict モードを採用し、多くのタイプヒントを使用するため、
メソッドシグネチャおよびファイル名の変更に関する後方互換性のない変更が多数あります。
これらの退屈な変更を迅速に修正するために、アップグレード CLI ツールがあります。

.. warning::
    アップグレードツールは、アプリケーションの依存関係を 4.0 に更新する **前**
    に実行することを目的としています。アプリケーションの依存関係がすでに 4.x または PHPUnit8
    に更新されている場合、 rector ベースのタスクは正しく実行されません。

.. code-block:: bash

    # アップグレードツールをインストール
    git clone git://github.com/cakephp/upgrade
    cd upgrade
    git checkout 4.x
    composer install --no-dev

アップグレードツールをインストールすると、アプリケーションまたはプラグインで実行できるようになります。

.. code-block:: bash

    # ロケールファイルの名前を変更する
    bin/cake upgrade file_rename locales <path/to/app>

    # テンプレートファイルの名前を変更する
    bin/cake upgrade file_rename templates <path/to/app>

テンプレートとロケールファイルの名前を変更したら、 ``App.paths.locales`` および ``App.paths.templates`` のパスが
正しいことを確認してください。

Rector によるリファクタリングを適用する
---------------------------------------

次に、 ``rector`` コマンドを使用して、非推奨となった多くの CakePHP および PHPUnit のメソッド呼び出しを
自動的に修正します。依存関係をアップグレードする **前** に、 rector を適用することが重要です。 ::

    bin/cake upgrade rector --rules phpunit80 <path/to/app/tests>
    bin/cake upgrade rector --rules cakephp40 <path/to/app/src>

CakePHP の依存関係をアップデートする
====================================

Refactor によるリファクタリングを適用した後、下記の composer コマンドを使用して CakePHP と PHPUnit をアップデートします。

.. code-block:: bash

    php composer.phar require --update-with-dependencies "phpunit/phpunit:^8.0"
    php composer.phar require --update-with-dependencies "cakephp/cakephp:4.0.*"
