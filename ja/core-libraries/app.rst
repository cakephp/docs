Appクラス
#########

.. php:namespace:: Cake\Core

.. php:class:: App

App クラスはリソースの位置とパスの管理を担当します。

クラスの検索
============

.. php:staticmethod:: classname($name, $type = '', $suffix = '')

この方法は CakePHP 全体でクラス名を解決するために使われます。
CakePHP が使用する短い形式の名前を解決し、完全解決されたクラス名を返します。 ::

    // 短いクラス名を名前空間とサフィックスで解決します。
    App::classname('Auth', 'Controller/Component', 'Component');
    // Cake\Controller\Component\AuthComponent を返します

    // プラグイン名を解決します。
    App::classname('DebugKit.Toolbar', 'Controller/Component', 'Component');
    // Returns DebugKit\Controller\Component\ToolbarComponent

    // \を含む名前はそのまま返されます。
    App::classname('App\Cache\ComboCache');
    // App\Cache\ComboCache を返します。

クラスを解決する時、 ``App`` 名前空間による解決が試みられ、
もしそのクラスが存在しなければ ``Cake`` 名前空間による解決が行われます。
もし両方のクラス名が存在しない場合、 ``false`` が返されます。

名前空間のパスの検索
====================

.. php:staticmethod:: path(string $package, string $plugin = null)

規約上のパスについて位置を得るために使われます。 ::

    // あなたのアプリケーション中の Controller/ までのパスを得ます
    App::path('Controller');

これはアプリケーションを構成するすべての名前空間に対して行うことができます。
プラグインに対しても取得できます。 ::

    // DebugKit 中のコンポーネントのパスを返します
    App::path('Component', 'DebugKit');

``App::path()`` は既定のパスのみを返し、
オートローダーに設定された追加のパスに関するいかなる情報も返しません。

.. php:staticmethod:: core(string $package)

CakePHP 内部のパッケージのパスを検索するために使われます。 ::

    // Cache エンジンのパスを得ます
    App::core('Cache/Engine');

プラグインの検出
================

.. php:staticmethod:: Plugin::path(string $plugin)

プラグインは Plugin によって検出されます。
たとえば ``Plugin::path('DebugKit');`` を使うと、DebugKit プラグインのフルパスが得られます。 ::

    $path = Plugin::path('DebugKit');

テーマの検出
============

テーマはプラグインなので、テーマのパスを取得するには上のメソッドを使うことができます。

ベンダーファイルの読込
======================

理想的にはベンダーファイルは ``Composer`` でオートロードされるべきで、
もし Composer でベンダーファイルをオートロードまたはインストールできない場合、
それらを読み込むために ``require`` を使う必要があるかもしれません。

もしライブラリーを Composer でインストールできないのであれば、Composer の規約に沿ったディレクトリーである
``vendor/$author/$package`` に各ライブラリーをインストールするのが最善です。
もし AcmeLib というライブラリーを持っていたなら、 ``vendor/Acme/AcmeLib`` にインストールするのです。
仮に PSR-0 互換のクラス名を使ってないとしたら、
あなたのアプリケーションの ``composer.json`` 中で次のようにオートロードできます。 ::

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

もしもあなたのベンダーライブラリーがクラスを使っておらず、
代わりに関数を提供する場合、 ``files`` オートロードの手法を使って
各リクエストの最初にそれらのファイルを読み込むように Composer を設定することができます。 ::

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

ベンダーライブラリーの設定をした後はあなたのアプリケーションのオートローダーを再生成する必要があります。 ::

    $ php composer.phar dump-autoload

もしもあなたのアプリケーションで Composer を使っていないとしたら、
自分ですべてのベンダーライブラリーを手動で読み込む必要があるでしょう。

.. meta::
    :title lang=ja: Appクラス
    :keywords lang=ja: compatible implementation,model behaviors,path management,loading files,php class,class loading,model behavior,class location,component model,management class,autoloader,classname,directory location,override,conventions,lib,textile,cakephp,php classes,loaded
