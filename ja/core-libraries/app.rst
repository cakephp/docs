App Class
#########

.. php:namespace:: Cake\Core

.. php:class:: App

Appクラスは、リソースの場所やパス管理を担当します。

クラスを見つける
================

.. php:staticmethod:: classname($name, $type = '', $suffix = '')

このメソッドは、 CakePHP全体のクラス名を解決するために使用されます。
以下は、CakePHPが使用する短い形式名を解決し、完全に解決されたクラス名を返します::

    // Resolve a short classname with the namespace + suffix.
    // 名前空間とサフィックスを与えて、クラス名を完全に解決します。
    App::classname('Auth', 'Controller/Component', 'Component');
    // Returns Cake\Controller\Component\AuthComponent

    // Resolve a plugin name.
    // プラグイン名を解決します。
    App::classname('DebugKit.Toolbar', 'Controller/Component', 'Component');
    // Returns DebugKit\Controller\Component\ToolbarComponent

    // Names with \ in them will be returned unaltered.
    // \と名前は、変更されずに返されます。
    App::classname('App\Cache\ComboCache');
    // Returns App\Cache\ComboCache

クラスを解決するとき、 最初に ``App`` 名前空間が試行され、
クラスが存在しないとき、 次に ``Cake`` 名前空間が試行されます。
どちらの名前空間にもクラスが存在しないとき、 ``false`` を返します。

名前空間からパスを見つけます
============================

.. php:staticmethod:: path(string $package, string $plugin = null)

規則に基づいて、パスの場所を取得するために使用されます::

    // Get the path to Controller/ in your application
    // Controller/へのパスを取得します。
    App::path('Controller');

これはあなたのアプリケーションの一部であるすべての名前空間のために行うことができます。
プラグインのパスも取得することができます::

    // Returns the component paths in DebugKit
    // DebugKit内のComponentへのパスを取得します。
    App::path('Component', 'DebugKit');

``App::path()`` はデフォルトのパスだけを返し、
オートローダがするように構成されている追加のパスに関する情報を提供することができません。

.. php:staticmethod:: core(string $package)

CakePHPの内部パッケージへのパスを見つけるために使用されます::

    // Get the path to Cache engines.
    // Cache engine へのパスを取得します。
    App::core('Cache/Engine');


プラグインの検索
================

.. php:staticmethod:: Plugin::path(string $plugin)

Pluginsは、Pluginと同じ場所に配置することができます。
例えば、 ``Plugin::path('DebugKit');`` を使用すると、
あなたのDebugKitプラグインへのフルパスを与えます::

    $path = Plugin::path('DebugKit');

テーマの検索
============

テーマはプラグインなので、上記の方法でテーマへのパスを取得することができます。

Vendorファイルの読み込み
====================

理想的にはvendorファイルは ``Composer`` を使用してオートロードすべきです。
Composerでのインストールもオートロードもできないvendorファイルは、
``require`` でロードする必要があります。

Composerでライブラリをインストールすることができない場合、
``vendor/$author/$package`` のComposerのconvention以下のディレクトリを
各々インストールするのが最善の方法です。
あなたがAcmeLibと呼ばれるライブラリを持っていた場合、
あなたは ``vendor/Acme/AcmeLib`` にそれをインストールすることができます。
PSR- 0互換のクラス名を使用していないと仮定すると
autoloadは、あなたのアプリケーションの ``composer.json`` の中に記述されている
``classmap`` を使用する可能性があります。

    "autoload": {
        "psr-4": {
            "App\\": "App",
            "App\\Test\\": "Test",
            "": "./Plugin"
        },
        "classmap": [
            "vendor/Acme/AcmeLib"
        ]
    }

あなたのvendorライブラリが、クラスを使用せず、ファンクションも提供しない場合、
各々のリクエスト開始時にファイルオートローディング機能を用いて
Composerを設定することができます。

    "autoload": {
        "psr-4": {
            "App\\": "App",
            "App\\Test\\": "Test",
            "": "./Plugin"
        },
        "files": [
            "vendor/Acme/AcmeLib/functions.php"
        ]
    }

vendorライブラリーを構成した後、あなたは以下のコマンドを使用して、
アプリケーションのautoloaderを再生成する必要があります。

    $ php composer.phar dump-autoload

Composerを使用せずに、あなたのアプリケーションで問題が発生したとき、
あなたは、手動ですべてのvendorライブラリを自分でロードする必要があります。

.. meta::
    :title lang=ja: App Class
    :keywords lang=ja: compatible implementation,model behaviors,path management,loading files,php class,class loading,model behavior,class location,component model,management class,autoloader,classname,directory location,override,conventions,lib,textile,cakephp,php classes,loaded
