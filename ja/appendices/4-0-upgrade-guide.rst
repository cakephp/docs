4.0 アップグレードガイド
########################

4.0 にアップグレードする前に、まず 最新の CakePHP 3.x へのアップグレードを済ませておいてください。

.. note::
    アップグレードツールは、最新のCakePHP3.xで実行されているアプリケーションでのみ機能します。CakePHP 4.0 にアップデートした後は、アップグレードツールを実行できません。

非推奨の警告を修正
========================

まず、非推奨警告の表示を有効にします。 ::

    // config/app.php
    'Error' => [
        'errorLevel' => E_ALL,
    ]

次に、アプリケーションとそのプラグインが発行する非推奨の警告を修正していきます。

PHP 7.2 へのアップグレード
==========================

CakePHP 4.0 は **PHP 7.2** を必要とします。PHPのバージョンが古い場合は、CakePHP を更新する前に PHP をアップグレードしてください。

.. note::
    CakePHP 4.0を動作させるには、 **PHP 7.2以上** が必要です。.

.. _upgrade-tool-use:

アップグレードツールの使用
==========================

CakePHP 4 は、 strict モードを採用し、多くのタイプヒントを使用するため、
メソッドシグネチャおよびファイル名の変更に関する後方互換性のない変更が多数あります。
この単調な書き換え作業を半自動的に修正するために、CLI によるアップグレードツールを
使用することができます。

.. warning::
    cakephp40およびphpunit80の `file_rename` コマンドとrectorのルールスクリプトは、
    アプリケーションの依存関係を4.0に更新する **前** に実行することを前提としています。
    アプリケーションの依存関係がすでに4.xまたはPHPUnit8に更新されている場合、
    `cakephp40` のrectorルールスクリプトは正しく実行されません。

.. code-block:: console

    # アップグレードツールをインストール
    git clone https://github.com/cakephp/upgrade
    cd upgrade
    git checkout 4.x
    composer install --no-dev

アップグレードツールをインストールすると、アプリケーションまたはプラグインで実行できるようになります。

.. code-block:: console

    # ロケールファイルの名前を変更する
    bin/cake upgrade file_rename locales <path/to/app>

    # テンプレートファイルの名前を変更する
    bin/cake upgrade file_rename templates <path/to/app>

テンプレートファイルとロケールファイルの名前を変更したら、 **/config/app.php** 内の
``App.paths.locales`` と ``App.paths.templates`` のパスを必ず更新してください。
必要に応じて、 `app config のスケルトン <https://github.com/cakephp/app/blob/4.x/config/app.php>`_
を参照してください。

Rector によるリファクタリングを適用する
---------------------------------------

次に、 ``rector`` コマンドを使用して、非推奨となった多くの CakePHP および PHPUnit のメソッドコールを
自動的に修正します。依存関係をアップグレードする **前** に、 rector を適用することが重要です。 ::

    bin/cake upgrade rector --rules phpunit80 <path/to/app/tests>
    bin/cake upgrade rector --rules cakephp40 <path/to/app/src>

アップグレードツールを使用して、CakePHPのマイナーバージョンごとに新しいrectorルールを
適用することもできます。::

    # Run the rector rules for the 4.0 -> 4.1 upgrade.
    bin/cake upgrade rector --rules cakephp41 <path/to/app/src>

CakePHP の依存関係をアップデートする
====================================

``rector`` によるリファクタリングを適用した後、下記の composer コマンドを使用して CakePHP と PHPUnit をアップデートします。

.. code-block:: console

    php composer.phar require --dev --update-with-dependencies "phpunit/phpunit:^8.0"
    php composer.phar require --update-with-dependencies "cakephp/cakephp:4.0.*"

Application.php
===============

次に、 ``src/Application.php`` が更新され、cakephp/appにあるものと同じ
メソッドシグネチャを持つようになっていることを確認します。
最新の `Application.php <https://github.com/cakephp/app/blob/4.x/src/Application.php>`__
はGitHubにあります。

ある種のRESTAPIを提供している場合は、 :ref:`body-parser-middleware` を含める必要があります。

最後に、 ``AuthComponent`` をまだ使用している場合は、
新しい `AuthenticationMiddleware </authentication/2/en/index.html>`__
および
`AuthorizationMiddleware </authorization/2/en/index.html>`__ へのアップグレードを
検討する必要があります。
