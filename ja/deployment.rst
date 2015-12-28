..
    Deployment

デプロイ
##########

..
    Once your application is complete, or even before that you'll want to deploy it.
    There are a few things you should do when deploying a CakePHP application.

アプリケーションが一度完成したら、または、完成する前でさえも、デプロイしたいと思うでしょう。
CakePHPアプリケーションをデプロイするにあたり、いくつかのことをしなければなりません。

..
  Update config/app.php

config/app.phpをアップデートする
================================

..
  Updating app.php, specifically the value of ``debug`` is extremely important.
  Turning debug = ``false`` disables a number of development features that should never be
  exposed to the Internet at large. Disabling debug changes the following types of
  things:

app.php、特に ``debug`` の値ををアップデートすることは非常に重要なことです。debugを ``false`` に変更することにより、開発に関連する部分で、決して広くインターネットに晒されるべきでない部分を無効にすることができます。デバッグを無効とすることにより、以下の種類のことが変更されます。

..
  * Debug messages, created with :php:func:`pr()` and :php:func:`debug()` are
    disabled.
  * Core CakePHP caches are by default flushed every year (about 365 days), instead of every
    10 seconds as in development.
  * Error views are less informative, and give generic error messages instead.
  * PHP Errors are not displayed.
  * Exception stack traces are disabled.

* :php:func:`pr()` 及び　:php:func:`debug()` により生成されたデバッグメッセージが、無効化されます。
* CakePHP コアのキャッシュが、開発時の 10 秒ごとの代わりに 毎年(約365日ごとに)破棄されるようになります。
* エラービューの情報量はもっと少なく、一般的なエラーメッセージしか表示されなくなります。
* PHPエラーはディスプレイされなくなります。
* 例外のスタックトレースは無効化されます。

..
  In addition to the above, many plugins and application extensions use ``debug``
  to modify their behavior.

上記に加え、多くのプラグインとアプリケーションの拡張機能は、自らの振る舞いを修正するために、 ``debug`` を使用します。

..
  You can check against an environment variable to set the debug level dynamically
  between environments. This will avoid deploying an application with debug ``true`` and
  also save yourself from having to change the debug level each time before deploying
  to a production environment.

環境間でデバッグレベルをダイナミックにセットするため、環境変数に対してチェックをかけることができます。このことにより、アプリケーションをデバッグ ``true`` の状態でデプロイすることを避けることができるだけでなく、毎回本番環境にデプロイする度にデバッグレベルを変更せずに済むこととなります。

..
  For example, you can set an environment variable in your Apache configuration::

例えば、Apacheの設定にて、環境変数をセットすることができます。

::

    SetEnv CAKEPHP_DEBUG 1

..

  And then you can set the debug level dynamically in **app.php** ::

それから、**app.php** にてデバッグレベルをダイナミックにセットすることができます。

::

    $debug = (bool)getenv('CAKEPHP_DEBUG');

    return [
        'debug' => $debug,
        .....
    ];

..
  Check Your Security

セキュリティをチェックする
==========================

..
  If you're throwing your application out into the wild, it's a good idea to make
  sure it doesn't have any obvious leaks:

  * Ensure you are using the :doc:`/controllers/components/csrf` component.
  * You may want to enable the :doc:`/controllers/components/security` component.
    It can help prevent several types of form tampering and reduce the possibility
    of mass-assignment issues.
  * Ensure your models have the correct :doc:`/core-libraries/validation` rules
    enabled.
  * Check that only your ``webroot`` directory is publicly visible, and that your
    secrets (such as your app salt, and any security keys) are private and unique
    as well.

もしあなたがウェブ上の荒野にアプリケーションを解き放とうとするなら、何か抜け穴がないかを確認しておくことをお勧めします。

* :doc:`/controllers/components/csrf` コンポーネントを使用していることを確認して下さい.
* :doc:`/controllers/components/security` コンポーネントを有効化しておいた方がいいかもしれません。フォームの改ざんやmass-assignment脆弱性に関する問題の発生可能性を削減することができます。
* 各モデルにおいて、正しい :doc:`/core-libraries/validation` ルールが有効化されているかどうかを確認して下さい。
* ``webroot`` ディレクトリのみが公開されており、その他の秘密の部分（ソルト値やセキュリティキー等）は非公開でかつユニークな状態となっていることを確認して下さい。

..
  Set Document Root

ドキュメントルートの指定
========================

..
  Setting the document root correctly on your application is an important step to
  keeping your code secure and your application safer. CakePHP applications
  should have the document root set to the application's ``webroot``. This
  makes the application and configuration files inaccessible through a URL.
  Setting the document root is different for different webservers. See the
  :ref:`url-rewriting` documentation for webserver specific
  information.

  In all cases you will want to set the virtual host/domain's document to be
  ``webroot/``. This removes the possibility of files outside of the webroot
  directory being executed.

アプリケーションでドキュメントルートを正しく指定することはコードをセキュアに、 またアプリケーションを安全に保つために重要なステップの内の一つです。CakePHP のアプリケーションは、 アプリケーションの ``webroot`` にドキュメントルートを指定する必要があります。 これによってアプリケーション、設定のファイルが URL を通してアクセスすることができなくなります。 ドキュメントルートの指定の仕方はウェブサーバーごとに異なります。 WEBサーバー特有の情報については :ref:`url-rewriting` ドキュメントを見てください。

どの場合においても ``webroot/`` をバーチャルホスト（バーチャルドメイン）のドキュメントルートに 設定すべきでしょう。これは webroot ディレクトリの外側のファイルを実行される可能性を取り除きます。

.. _symlink-assets:

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 487a61651c169fb42bc5d592f5d7fff60b2e058a
..
  Improve Your Application's Performance

アプリケーションのパフォーマンスを改善させる
============================================

..
    Class loading can take a big share of your application's processing time.
    In order to avoid this problem, it is recommended that you run this command in
    your production server once the application is deployed::

クラスローディングは、アプリケーションのプロセス時間の大部分を占めることがあります。このような問題を避けるために、アプリケーションがデプロイされたら以下のコマンドをプロダクションサーバーにて走らせることを推奨します。

::

    php composer.phar dumpautoload -o

..
  Since handling static assets, such as images, JavaScript and CSS files of
  plugins, through the ``Dispatcher`` is incredibly inefficient, it is strongly
  recommended to symlink them for production. This can be done by using
  the ``plugin`` shell::

プラグインの画像や JavaScript、CSS ファイルなどの静的なアセットを扱う場合、 ディスパッチャを通すことはかなり非効率です。 本番環境においては、次のようにシンボリックリンクを張ることを強くお勧めします。これは、 ``plugin`` のシェルを利用することで実行できます。

::

    bin/cake plugin assets symlink

..
  The above command will symlink the ``webroot`` directory of all loaded plugins to
  appropriate path in the app's ``webroot`` directory.

上記コマンドは、アプリケーション内での ``webroot`` ディレクトリの適切なパスに対して、全てのロードされたプラグインの ``webroot``  ディレクトリのシンボリックリンクを貼ることとなります。

..
  If your filesystem doesn't allow creating symlinks the directories will be copied
  instead of being symlinked. You can also explicitly copy the directories using::

もしあなたのファイルシステムはシンボリックリンクを作成することを許可しないようであれば、ディレクトリーはシンボリックリンクが貼られる代わりにコピーされます。また、以下を使用しながら、特定のディレクトリーをコピーすることができます。

::

    bin/cake plugin assets copy
=======
Improve Your Application's Performance
======================================
>>>>>>> 80d29b995076f448170eff6cd238852092e8661d

.. meta::
    :title lang=en: Deployment
<<<<<<< HEAD
    :keywords lang=en: stack traces,application extensions,set document,installation documentation,development features,generic error,document root,func,debug,caches,error messages,configuration files,webroot,deployment,cakephp,applications
=======
    :keywords lang=en: stack traces,application extensions,set document,installation documentation,development features,generic error,document root,func,debug,caches,error messages,configuration files,webroot,deployment,cakephp,applications
>>>>>>> 487a61651c169fb42bc5d592f5d7fff60b2e058a
