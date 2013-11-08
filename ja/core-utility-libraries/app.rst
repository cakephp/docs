.. App Class

App クラス
##########

.. php:class:: App

..
    The app class is responsible for path management, class location and class loading.
    Make sure you follow the :ref:`file-and-classname-conventions`.

App クラスはパスの管理、クラスのロケーション、そしてクラスのローディングの責務を担っています。
念のため :ref:`file-and-classname-conventions` に従っていることを確認して下さい。

.. Packages

パッケージ
==========

..
    CakePHP is organized around the idea of packages, each class belongs to a
    package or folder where other classes reside. You can configure each package
    location in your application using ``App::build('APackage/SubPackage', $paths)``
    to inform the framework where should each class be loaded. Almost every class in
    the CakePHP framework can be swapped with your own compatible implementation. If
    you wish to use you own class instead of the classes the framework provides,
    just add the class to your libs folder emulating the directory location of where
    CakePHP expects to find it.

CakePHP はパッケージの考え方を中心に編成され、それぞれのクラスは他のクラスが存在するパッケージやフォルダに属します。
それぞれのクラスをどの場所でロードするべきなのかをフレームワークに通知するため、 ``App::build('APackage/SubPackage', $paths)`` を使用して各パッケージの場所を設定することができます。
CakePHP のフレームワークのほぼすべてのクラスは、あなた独自の互換性のある実装と入れ替えることができます。
フレームワークが提供するクラスの代わりに独自のクラスを使用したい場合は、ただ単に、CakePHP の探索が期待できるディレクトリの配置を模倣した libs フォルダにクラスを追加するだけです。

.. For instance if you'd like to use your own HttpSocket class, put it under

例えば、あなた独自の HttpSocket クラスを用いたいなら以下のように配置します::

    app/Lib/Network/Http/HttpSocket.php

..
    Once you've done this App will load your override file instead of the file
    inside CakePHP.

一度このようにやりさえすれば、 App は CakePHP 内部のファイルの代わりにあなたが再定義したファイルをロードします。

.. Loading classes

クラスのローディング
====================

.. php:staticmethod:: uses(string $class, string $package)

    :rtype: void

    ..
        Classes are lazily loaded in CakePHP, however before the autoloader
        can find your classes you need to tell App, where it can find the files.
        By telling App which package a class can be found in, it can properly locate
        the file and load it the first time a class is used.

    CakePHPではクラスは遅延ロードされますが、オートローダがクラスを発見出来るためには、どこでファイルを見つけられるのかをまず App に伝えなくてはなりません。
    どのパッケージでクラスを発見できるのかを App に伝えることで、あるクラスを初めて使用するときに適切にファイルを見つけることができるのです。

    ..
        Some examples for common types of classes are:

    一般的なクラスの例をいくつか挙げます:

    Controller
        ``App::uses('PostsController', 'Controller');``
    Component
        ``App::uses('AuthComponent', 'Controller/Component');``
    Model
        ``App::uses('MyModel', 'Model');``
    Behaviors
        ``App::uses('TreeBehavior', 'Model/Behavior');``
    Views
        ``App::uses('ThemeView', 'View');``
    Helpers
        ``App::uses('HtmlHelper', 'View/Helper');``
    Libs
        ``App::uses('PaymentProcessor', 'Lib');``
    Vendors
        ``App::uses('Textile', 'Vendor');``
    Utility
        ``App::uses('String', 'Utility');``

    ..
        So basically the second param should simply match the folder path of the class file in core or app.

    つまり基本的に、第二パラメータは、コアまたはアプリ内のクラスファイルのフォルダパスと単純に一致させなくてはなりません。

.. note::

    ..
        Loading vendors usually means you are loading packages that do not follow
        conventions. For most vendor packages using ``App::import()`` is
        recommended.

    ベンダーのローディングは通常、規則に従わないパッケージのローディングを意味します。
    多くのベンダーのパッケージに対しては ``App::import()`` の使用が推奨されます。

.. Loading files from plugins

プラグイン内のファイルをロードする
----------------------------------

..
    Loading classes in plugins works much the same as loading app and
    core classes except you must specify the plugin you are loading
    from

プラグインからのクラスのローディングは、ロード元になるプラグインを指定する以外は、app や core のクラスのローディングとまったく同じように動作します::

    // app/Plugin/PluginName/Model/Comment.php にある Comment クラスをロードする
    App::uses('Comment', 'PluginName.Model');

    // app/Plugin/PluginName/Controller/Component/CommentComponent.php にある CommentComponent クラスをロードする
    App::uses('CommentComponent', 'PluginName.Controller/Component');


.. Finding paths to packages using App::path()

App::path() を用いたパッケージへのパスの探索
============================================

.. php:staticmethod:: path(string $package, string $plugin = null)

    :rtype: array

    ..
        Used to read information stored path

    保存されたパス情報を読み込むために用いる::

        // アプリケーション内のモデルのパスが返る
        App::path('Model');

    ..
        This can be done for all packages that are apart of your application. You
        can also fetch paths for a plugin

    アプリケーション内のすべてのパッケージに対してこれを実行できます。
    プラグインに対するパスを取得することもできます::

        // DebugKit 内のコンポーネントのパスが返る
        App::path('Component', 'DebugKit');

.. php:staticmethod:: paths( )

    :rtype: array

    ..
        Get all the currently loaded paths from App. Useful for inspecting or
        storing all paths App knows about. For a paths to a specific package
        use :php:meth:`App::path()`

    現在読み込まれているすべてのパスを App から取得します。
    App が把握している全てのパスを調べたり記憶したりするのに便利です。
    特定のパッケージのパスを扱う場合は :php:meth:`App::path()` を使用します。

.. php:staticmethod:: core(string $package)

    :rtype: array

    .. Used for finding the path to a package inside CakePHP::

    CakePHP 内部のパッケージのパスを見つけるために用いられます::

        // Cache エンジンへのパスを取得する
        App::core('Cache/Engine');

.. php:staticmethod:: location(string $className)

    :rtype: string

    .. Returns the package name where a class was defined to be located at.

    クラスが定義された場所のパッケージ名を返します。

.. Adding paths for App to find packages in

App がパッケージを探索できるようにパスを追加する
================================================

.. php:staticmethod:: build(array $paths = array(), mixed $mode = App::PREPEND)

    :rtype: void

    ..
        Sets up each package location on the file system. You can configure multiple
        search paths for each package, those will be used to look for files one
        folder at a time in the specified order. All paths must be terminated
        with a directory separator.

    ファイルシステム上の各パッケージの場所を設定します。
    パッケージごとに複数の探索パスを設定することができ、それらは、ファイルがあるフォルダを一度だけ探すために指定された順序で使用されます。
    すべてのパスはディレクトリセパレータで終了する必要があります。

    ..
        Adding additional controller paths for example would alter where CakePHP
        looks for controllers. This allows you to split your application up across
        the filesystem.

    例えばコントローラのパスを追加すると、CakePHPがコントローラを探すパスを置き換えることになるでしょう。
    この仕組みが、アプリケーションをファイルシステムから分離させてくれます。

    ..
        Usage::

    使い方::

        //Modelパッケージのための新しい探索パスがセットアップされます
        App::build(array('Model' => array('/a/full/path/to/models/')));

        //このパスはモデルを探索するための唯一正しいパスとしてセットアップされます
        App::build(array('Model' => array('/path/to/models/')), App::RESET);

        //ヘルパーの複数の探索パスがセットアップされます
        App::build(array('View/Helper' => array('/path/to/helpers/', '/another/path/')));


    ..
        If reset is set to true, all loaded plugins will be forgotten and they will
        be needed to be loaded again.

    reset が true に設定されている場合、ロードされたすべてのプラグインは忘れ去られ、それらは再びロードされる必要があります。

    ..
        Examples::

    例::

        App::build(array('controllers' => array('/full/path/to/controllers/')));
        //このようになりました
        App::build(array('Controller' => array('/full/path/to/Controller/')));

        App::build(array('helpers' => array('/full/path/to/views/helpers/')));
        //このようになりました
        App::build(array('View/Helper' => array('/full/path/to/View/Helper/')));

    .. versionchanged:: 2.0
        ``App::build()`` はもはや app のパスと core のパスをマージしません


      .. ``App::build()`` will not merge app paths with core paths anymore.


.. _app-build-register:

.. Add new packages to an application

アプリケーションに新しいパッケージを追加する
--------------------------------------------

..
    ``App::build()`` can be used to add new package locations.  This is useful
    when you want to add new top level packages or, sub-packages to your
    application

``App::build()`` は新しいパッケージの場所を追加するために用いられます。
アプリケーションに新しいトップレベルのパッケージや、サブパッケージを追加したい場合に便利です::

    App::build(array(
        'Service' => array('%s' . 'Service' . DS)
    ), App::REGISTER);

..
    The ``%s`` in newly registered packages will be replaced with the
    :php:const:`APP` path.  You must include a trailing ``/`` in registered
    packages.  Once packages are registered, you can use ``App::build()`` to
    append/prepend/reset paths like any other package.

新しく登録されたパッケージの ``%s`` は、 :php:const:`APP` パスに置き換えられます。
登録されるパッケージの末尾には ``/`` を含める必要があります。
いったんパッケージを登録すれば、``App::build()`` を他のパッケージのように、パスの 後方追加/前方追加/リセット のために使用することができます。

.. versionchanged:: 2.1
    パッケージの登録は 2.1 で追加されました

    .. Registering packages was added in 2.1

.. Finding which objects CakePHP knows about

CakePHP が把握しているオブジェクトを探索する
============================================

.. php:staticmethod:: objects(string $type, mixed $path = null, boolean $cache = true)

    .. :rtype: mixed Returns an array of objects of the given type or false if incorrect.

    :rtype: mixed 与えられた型のオブジェクトの配列か、不正な場合は false を返します。

    ..
        You can find out which objects App knows about using
        ``App::objects('Controller')`` for example to find which application controllers
        App knows about.

    ``App::objects('Controller')`` を用いて、Appが把握しているオブジェクト、例えば App が把握しているアプリケーションのコントローラ、を見出せます。

    .. Example usage

    使用例::

        //returns array('DebugKit', 'Blog', 'User');
        App::objects('plugin');

        //returns array('PagesController', 'BlogController');
        App::objects('Controller');

    .. You can also search only within a plugin's objects by using the plugin dot syntax.

    プラグインドット記法を用いることで、そのプラグイン内においてのオブジェクトを探すこともできます::

        // returns array('MyPluginPost', 'MyPluginComment');
        App::objects('MyPlugin.Model');

    .. versionchanged:: 2.0

    1. 結果が空の場合や型が不正な場合に false の代わりに ``array()`` を返します
    2. ``App::objects('core')`` は、もはやコアオブジェクトを返さずに ``array()`` を返します
    3. 完全なクラス名を返します

    ..
        1. Returns ``array()`` instead of false for empty results or invalid types
        2. Does not return core objects anymore, ``App::objects('core')`` will
           return ``array()``.
        3. Returns the complete class name

.. Locating plugins

プラグインの配置
================

.. php:staticmethod:: pluginPath(string $plugin)

    :rtype: string

    ..
        Plugins can be located with App as well. Using ``App::pluginPath('DebugKit');``
        for example, will give you the full path to the DebugKit plugin

    プラグインも同じように App で配置できます。
    例えば ``App::pluginPath('DebugKit');`` を用いることで DebugKit プラグインへのフルパスをあなたに与えます::

        $path = App::pluginPath('DebugKit');

.. Locating themes

テーマの設置
============

.. php:staticmethod:: themePath(string $theme)

    :rtype: string

    ..
        Themes can be found ``App::themePath('purple');``, would give the full path to the
        `purple` theme.

    ``App::themePath('purple');`` のように呼ぶと、 `purple` テーマのフルパスを取得することができます。

.. _app-import:

.. Including files with App::import()

App::import() でファイルをインクルードする
==========================================

.. php:staticmethod:: import(mixed $type = null, string $name = null, mixed $parent = true, array $search = array(), string $file = null, boolean $return = false)

    :rtype: boolean

    ..
        At first glance ``App::import`` seems complex, however in most use
        cases only 2 arguments are required.

    一見すると ``App::import`` は複雑に見えます。
    しかしながら、ほとんどのケースではただ二つの引数が要求されるのみです。

    .. note::

        ..
            This method is equivalent to ``require``'ing the file.
            It is important to realize that the class subsequently needs to be initialized.

        このメソッドはファイルを ``require`` することと同じです。
        その後、クラスの初期化が必要だと理解しておくことは重要です。


    ::

        // require('Controller/UsersController.php'); と同じ
        App::import('Controller', 'Users');

        // クラスのロードが必要
        $Users = new UsersController();

        // モデル連携やコンポーネントなどがロードされるようにしたい場合
        $Users->constructClasses();

    ..
        **All classes that were loaded in the past using App::import('Core', $class) will need to be
        loaded using App::uses() referring to the correct package. This change has provided large
        performance gains to the framework.**

    **かつて App::import('Core', $class) を用いてロードされたすべてのクラスは、 App::uses() を用いた、正しいパッケージを参照したロードが必要になりました。
    この変更は、フレームワークに大きなパフォーマンスの向上をもたらしました。**

    .. versionchanged:: 2.0

    ..
        * The method no longer looks for classes recursively, it strictly uses the values for the
          paths defined in :php:meth:`App::build()`
        * It will not be able to load ``App::import('Component', 'Component')`` use
          ``App::uses('Component', 'Controller');``.
        * Using ``App::import('Lib', 'CoreClass');`` to load core classes is no longer possible.
        * Importing a non-existent file, supplying a wrong type or package name, or
          null values for ``$name`` and ``$file`` parameters will result in a false return
          value.
        * ``App::import('Core', 'CoreClass')`` is no longer supported, use
          :php:meth:`App::uses()` instead and let the class autoloading do the rest.
        * Loading Vendor files does not look recursively in the vendors folder, it
          will also not convert the file to underscored anymore as it did in the
          past.

    * このメソッドはもはや再帰的にクラスを検索しなくなり、:php:meth:`App::build()` に定義されているパスの値を厳格に使用します
    * クラスをロードするための ``App::import('Component', 'Component')`` は使用不可になる予定。 ``App::uses('Component', 'Controller');`` を用いて下さい
    * コアクラスをロードするためには ``App::import('Lib', 'CoreClass');`` はもはや使用不可です
    * 存在しないファイルのインポート、あるいは ``$name`` および ``$file`` のパラメータとして誤った型やパッケージ名や NULL値を渡すと、戻り値は false になります。
    * ``App::import('Core', 'CoreClass')`` はもはやサポートされません。:php:meth:`App::uses()` を用い、残りの部分はクラスのオートローディングにやらせます。
    * ベンダーファイルのローディングはベンダーフォルダを再帰的に探索しません。かつてのようにファイル名をアンダースコアに変換することも、もうありません。

.. Overriding classes in CakePHP

CakePHP のクラスをオーバーライドする
====================================

..
    You can override almost every class in the framework, exceptions are the
    :php:class:`App` and :php:class:`Configure` classes. Whenever you like to
    perform such overriding, just add your class to your app/Lib folder mimicking
    the internal structure of the framework.  Some examples to follow

フレームワークのほぼすべてのクラスはオーバーライドすることができます。
例外は :php:class:`App` と :php:class:`Configure` クラスです。
そのようにオーバーライドを実行したいならばどんな場合であれ、フレームワークの内部構造を真似て ``app/Lib`` フォルダにクラスを追加する、ただそれだけです。
いくつかの例を挙げます:

..
    * To override the :php:class:`Dispatcher` class, create ``app/Lib/Routing/Dispatcher.php``
    * To override the :php:class:`CakeRoute` class, create ``app/Lib/Routing/Route/CakeRoute.php``
    * To override the :php:class:`Model` class, create ``app/Lib/Model/Model.php``

* :php:class:`Dispatcher` クラスをオーバーライドするためには ``app/Lib/Routing/Dispatcher.php`` を作成します
* :php:class:`CakeRoute` クラスをオーバーライドするためには ``app/Lib/Routing/Route/CakeRoute.php`` を作成します
* :php:class:`Model` クラスをオーバーライドするためには ``app/Lib/Model/Model.php`` を作成します

..
    When you load the replaced files, the app/Lib files will be loaded instead of
    the built-in core classes.

置き換えたファイルをロードすると、 ``app/Lib`` のファイルが組み込みのコアクラスの代わりにロードされます。

.. Loading Vendor Files

Vendor ファイルをローディングする
=================================

..
    You can use ``App::uses()`` to load classes in vendors directories. It follows
    the same conventions as loading other files

``App::uses()`` をベンダーのディレクトリ内のクラスをロードするのに使うことが出来ます。
これは他のファイルを読み込むのと同じ規則に従います::


    // app/Vendor/Geshi.php 内の Geshi クラスをロードする
    App::uses('Geshi', 'Vendor');

..
    To load classes in subdirectories, you'll need to add those paths
    with ``App::build()``

サブディレクトリ内のクラスをロードするには、それらのパスを ``App::build()`` で追加する必要があります::

    // app/Vendor/SomePackage/ClassInSomePackage.php 内の ClassInSomePackage クラスをロードする
    App::build(array('Vendor' => array(APP . 'Vendor' . DS . 'SomePackage')));
    App::uses('ClassInSomePackage', 'Vendor');

..
    Your vendor files may not follow conventions, have a class that differs from
    the file name or does not contain classes. You can load those files using
    ``App::import()``. The following examples illustrate how to load vendor
    files from a number of path structures. These vendor files could be located in
    any of the vendor folders.

ベンダーのファイルは、規則に従っていなかったり、ファイル名と異なるクラスを持っていたり、クラスを含んでないかもしれません。
それらのファイルは ``App::import()`` を使用して読み込むことができます。
次の例では、いくつかのパス構造からベンダーファイルをロードする方法を示しています。
これらのベンダーファイルは、ベンダーのフォルダのいずれかに配置することができます。

.. To load **app/Vendor/geshi.php**

**app/Vendor/geshi.php** をロードする::

    App::import('Vendor', 'geshi');

.. note::

    ..
        The geshi file must be a lower-case file name as Cake will not
        find it otherwise.

    Cake が他のファイルを見出してしまわないために、geshi のファイル名は、小文字でなくてはなりません。

.. To load **app/Vendor/flickr/flickr.php**

**app/Vendor/flickr/flickr.php** をロードする::

    App::import('Vendor', 'flickr/flickr');

.. To load **app/Vendor/some.name.php**

**app/Vendor/some.name.php** をロードする::

    App::import('Vendor', 'SomeName', array('file' => 'some.name.php'));

.. To load **app/Vendor/services/well.named.php**

**app/Vendor/services/well.named.php** をロードする::

    App::import('Vendor', 'WellNamed', array('file' => 'services' . DS . 'well.named.php'));

.. To load **app/Plugin/Awesome/Vendor/services/well.named.php**

**app/Plugin/Awesome/Vendor/services/well.named.php** をロードする::

    App::import('Vendor', 'Awesome.WellNamed', array('file' => 'services' . DS . 'well.named.php'));

..
    It wouldn't make a difference if your vendor files are inside your /vendors
    directory. Cake will automatically find it.

ベンダーファイルが /vendors ディレクトリ内にあるかどうかに違いはありません。
Cake は自動的にそれを見出します。

.. To load **vendors/vendorName/libFile.php**

**vendors/vendorName/libFile.php** をロードする::

    App::import('Vendor', 'aUniqueIdentifier', array('file' => 'vendorName' . DS . 'libFile.php'));

.. App Init/Load/Shutdown Methods

App init/load/shutdown メソッド
===============================

.. php:staticmethod:: init( )

    :rtype: void

    .. Initializes the cache for App, registers a shutdown function.

    App のキャッシュを初期化し、シャットダウン関数を登録します。

.. php:staticmethod:: load(string $className)

    :rtype: boolean

    ..
        Method to handle the automatic class loading. It will look for each class'
        package defined using :php:meth:`App::uses()` and with this information it
        will resolve the package name to a full path to load the class from. File
        name for each class should follow the class name. For instance, if a class
        is name ``MyCustomClass`` the file name should be ``MyCustomClass.php``

    自動的なクラスローディングを処理するメソッド。
    これは、:php:meth:`App::uses()` を使用して定義された各クラスのパッケージを探し出し、その情報を元に、クラスをロードするためのフルパスとしてパッケージ名を解決します。
    各クラスのファイル名はクラス名に従ってください。
    たとえばクラス名が ``MyCustomClass`` である場合、ファイル名は ``MyCustomClass.php`` でなければなりません。

.. php:staticmethod:: shutdown( )

    :rtype: void

    ..
        Object destructor. Writes cache file if changes have been made to the
        ``$_map``.

    オブジェクトのデストラクタ。
    ``$_map`` に変更が加えられている場合にキャッシュファイルに書き込みます。

.. meta::
    :title lang=en: App Class
    :keywords lang=en: compatible implementation,model behaviors,path management,loading files,php class,class loading,model behavior,class location,component model,management class,autoloader,classname,directory location,override,conventions,lib,textile,cakephp,php classes,loaded
