Folder & File
#############

Folder と File ユーティリティは、ファイルの読み書きやフォルダ内のファイル名一覧の取得、\
その他ディレクトリに関連するタスクにおいて便利なクラスです。


基本的な使い方
================

:php:meth:`App::uses()` を使ってクラスをロードします。\ ::

    App::uses('Folder', 'Utility');
    App::uses('File', 'Utility');

すると、新しいフォルダインスタンスをセットアップすることができるようになります。\ ::

    $dir = new Folder('/path/to/folder');

インスタンスを作成したフォルダ内から *.ctp* の拡張子が付いたファイルを\
正規表現検索する場合はこのようにします。\ ::

    $files = $dir->find('.*\.ctp');

これでファイルの読み込みや、コンテンツの書き込み、ファイルの削除などが行えるようになります。\ ::

    foreach ($files as $file) {
        $file = new File($dir->pwd() . DS . $file);
        $contents = $file->read();
        // $file->write('このファイルの内容を上書きします');
        // $file->append('このファイルの最後に追記します。');
        // $file->delete(); // このファイルを削除します
        $file->close(); // 終了時にファイルをクローズしましょう
    }

Folder API
==========

.. php:class:: Folder(string $path = false, boolean $create = false, mixed $mode = false)

::

    // 0755 のパーミッションで新しいフォルダを作成します
    $dir = new Folder('/path/to/folder', true, 0755);

.. php:attr:: path

    フォルダの現在のパス。 :php:meth:`Folder::pwd()` でも同じ情報を返します。


.. php:attr:: sort

    ファイルリストを取得する際に、名前によるソートを実行するか否かの値。

.. php:attr:: mode

    フォルダ作成時のモード。デフォルトでは ``0755`` 。
    Windows マシンでは何も影響しません。

.. php:staticmethod:: addPathElement( $path, $element )

    :rtype: string

    $path と $element の間に適切なスラッシュを加えて返します。\ ::

        $path = Folder::addPathElement('/a/path/for', 'testing');
        // $path は /a/path/for/testing となります


.. php:method:: cd( $path )

    :rtype: string

    カレントディレクトリを $path へ移動します。失敗時には false が返ります\ ::

        $folder = new Folder('/foo');
        echo $folder->path; // /foo が表示されます
        $folder->cd('/bar');
        echo $folder->path; // /bar が表示されます
        $false = $folder->cd('/non-existent-folder');


.. php:method:: chmod( $path, $mode = false, $recursive = true, $exceptions = array ( ) )

    :rtype: boolean

    ディレクトリのモード（パーミッション）を再帰的に変更します。\
    ファイルのモードも同様に変更します。\ ::

        $dir = new Folder();
        $dir->chmod('/path/to/folder', 0755, true, array('skip_me.php'));


.. php:method:: copy( $options = array ( ) )

    :rtype: boolean

    ディレクトリを再帰的にコピーします。\
    唯一のパラメータである $options にはコピー先のパスか、オプションの配列を指定します。\ ::

        $folder1 = new Folder('/path/to/folder1');
        $folder1->copy('/path/to/folder2');
        // Will put folder1 and all its contents into folder2

        $folder = new Folder('/path/to/folder');
        $folder->copy(array(
            'to' => '/path/to/new/folder',
            'from' => '/path/to/copy/from', // will cause a cd() to occur
            'mode' => 0755,
            'skip' => array('skip-me.php', '.git')
        ));

        $folder1 = new Folder('/path/to/folder1');
        $folder1->copy('/path/to/folder2');
        // folder1 以下のファイルを folder2 へコピーします

        $folder = new Folder('/path/to/folder');
        $folder->copy(array(
            'to' => '/path/to/new/folder',
            'from' => '/path/to/copy/from', // cd() が実行されるでしょう
            'mode' => 0755,
            'skip' => array('skip-me.php', '.git')
        ));


.. php:staticmethod:: correctSlashFor( $path )

    :rtype: string

    $path に与えるべき適切なスラッシュを返します。
    （Windows 環境では \\ で、その他の環境では / ）

.. php:method:: create( $pathname, $mode = false )

    :rtype: boolean

    ディレクトリを作成します。
    `/foo/bar/baz/shoe/horn` のような深い階層の作成も可能です。\ ::

        $folder = new Folder();
        if ($folder->create('foo' . DS . 'bar' . DS . 'baz' . DS . 'shoe' . DS . 'horn')) {
            // フォルダ作成に成功した場合の処理
        }

.. php:method:: delete( $path = NULL )

    :rtype: boolean

    システムが許可していた場合、再帰的にディレクトリを削除します。\ ::

        $folder = new Folder('foo');
        if ($folder->delete()) {
            // フォルダの削除が成功した場合の処理
        }

.. php:method:: dirsize( )

    :rtype: integer

    フォルダとその中身のサイズを返します。

.. php:method:: errors( )

    :rtype: array

    最新のエラーを返します。

.. php:method:: find( $regexpPattern = '.*', $sort = false )

    :rtype: array

    現在のディレクトリで指定のパターンにマッチしたファイルを配列で返します。\ ::

        // app/webroot/img/ フォルダ内の .png を検索し、ソートして返す
        $dir = new Folder(WWW_ROOT . 'img');
        $files = $dir->find('.*\.png', true);
        /*
        Array
        (
            [0] => cake.icon.png
            [1] => test-error-icon.png
            [2] => test-fail-icon.png
            [3] => test-pass-icon.png
            [4] => test-skip-icon.png
        )
        */

.. note::

    find メソッドと findRecursive メソッドは、ファイルのみを検索します。
    フォルダとファイルを取得したい場合は、 :php:meth:`Folder::read()` もしくは
    :php:meth:`Folder::tree()` 参照してください。

.. php:method:: findRecursive( $pattern = '.*', $sort = false )

    :rtype: array

    パターンにマッチした全てのファイルをカレントディレクトリを付けて返します。\ ::

        // test もしくは index で始まるファイルを再帰的に検索する
        $dir = new Folder(WWW_ROOT);
        $files = $dir->findRecursive('(test|index).*');
        /*
        Array
        (
            [0] => /var/www/cake/app/webroot/index.php
            [1] => /var/www/cake/app/webroot/test.php
            [2] => /var/www/cake/app/webroot/img/test-skip-icon.png
            [3] => /var/www/cake/app/webroot/img/test-fail-icon.png
            [4] => /var/www/cake/app/webroot/img/test-error-icon.png
            [5] => /var/www/cake/app/webroot/img/test-pass-icon.png
        )
        */


.. php:method:: inCakePath( $path = '' )

    :rtype: boolean

    ファイルが CakePath の中に存在すれば true を返します。

.. php:method:: inPath( $path = '', $reverse = false )

    :rtype: boolean

     指定されたファイルが与えられたパスの中に存在すれば true を返します。\ ::

        $Folder = new Folder(WWW_ROOT);
        $result = $Folder->inPath(APP);
        // $result = true, /var/www/example/app/ は /var/www/example/app/webroot/ に含まれる

        $result = $Folder->inPath(WWW_ROOT . 'img' . DS, true);
        // $result = true, /var/www/example/app/webroot/ は /var/www/example/app/webroot/img/ に含まれる


.. php:staticmethod:: isAbsolute( $path )

    :rtype: boolean

    引数の $path が絶対パスであれば true を返します。


.. php:staticmethod:: isSlashTerm( $path )

    :rtype: boolean

    引数の $path がスラッシュで終了していれば true を返します。
    （つまり、 slash-terminated）\ ::

        $result = Folder::isSlashTerm('/my/test/path');
        // $result = false
        $result = Folder::isSlashTerm('/my/test/path/');
        // $result = true


.. php:staticmethod:: isWindowsPath( $path )

    :rtype: boolean

    引数の $path が Windows のパスであれば true を返します。

.. php:method:: messages( )

    :rtype: array

    直近で利用したメソッドのメッセージを取得します。

.. php:method:: move( $options )

    :rtype: boolean

    再帰的なディレクトリの移動。

.. php:staticmethod:: normalizePath( $path )

    :rtype: string

    引数の $path を適切なスラッシュに調整して返します。
    （Windows 環境では \\ で、その他の環境では / ）

.. php:method:: pwd( )

    :rtype: string

    現在のパスを返します。


.. php:method:: read( $sort = true, $exceptions = false, $fullPath = false )

    :rtype: mixed

    :param boolean $sort: true の場合に結果をソートします。
    :param mixed $exceptions: 無視するファイル名とフォルダ名の配列。
        true もしくは '.' が与えられた場合、隠しファイルもしくはドットファイルを無視します。
    :param boolean $fullPath: true の場合に絶対パスで結果を返します。

    現在のディレクトリのコンテンツを配列で返します。
    戻り値は2つの配列となります。1つはディレクトリ名の配列。もう1つはファイル名の配列です。\ ::

        $dir = new Folder(WWW_ROOT);
        $files = $dir->read(true, array('files', 'index.php'));
        /*
        Array
        (
            [0] => Array
                (
                    [0] => css
                    [1] => img
                    [2] => js
                )
            [1] => Array
                (
                    [0] => .htaccess
                    [1] => favicon.ico
                    [2] => test.php
                )
        )
        */


.. php:method:: realpath( $path )

    :rtype: string

    引数のパス内にある ".." の名前を解決したパスを返します。

.. php:staticmethod:: slashTerm( $path )

    :rtype: string

    引数の $path に終端のスラッシュを付けたパスを返します。
    （Windows 環境では \\ で、その他の環境では / ）

.. php:method:: tree( $path = NULL, $exceptions = true, $type = NULL )

    :rtype: mixed

    ディレクトリ一覧とその中のファイル一覧を返します。


File API
========

.. php:class:: File(string $path, boolean $create = false, integer $mode = 493)

::

    // 0644 のパーミッションで新しいファイルを作成します
    $file = new File('/path/to/file.php', true, 0644);

.. php:attr:: Folder

    ファイルが属するフォルダ・オブジェクト

.. php:attr:: name

    拡張子付きのファイル名。 似たような動作をする :php:meth:`File::name()` では、\
    拡張子無しのファイル名を返します。

.. php:attr:: info

    ファイル情報の配列。このプロパティよりも :php:meth:`File::info()` を使ってください。

.. php:attr:: handle

    ファイルをオープンしている場合のファイルハンドラを保持します。

.. php:attr:: lock

    ファイルの読み書き時のロックを有効にします。

.. php:attr:: path

    現在のファイルの絶対パス。

.. php:method:: append( $data, $force = false )

    :rtype: boolean

    引数の文字列をファイルへ追記します。

.. php:method:: close( )

    :rtype: boolean

    ファイルがオープンされていた場合、そのファイルをクローズします

.. php:method:: copy( $dest, $overwrite = true )

    :rtype: boolean

    ファイルを $dest へコピーします。

.. php:method:: create( )

    :rtype: boolean

    ファイルを作成します。

.. php:method:: delete( )

    :rtype: boolean

    ファイルを削除します。

.. php:method:: executable( )

    :rtype: boolean

    ファイルに実行権限が付いていた場合に true を返します。

.. php:method:: exists( )

    :rtype: boolean

    ファイルが存在した場合に true を返します。

.. php:method:: ext( )

    :rtype: string

    ファイルの拡張子を返します。

.. php:method:: Folder( )

    :rtype: Folder

    現在のフォルダを返します。

.. php:method:: group( )

    :rtype: integer

    ファイルのグループを返します。

.. php:method:: info( )

    :rtype: string

    ファイル情報を返します。

    .. versionchanged:: 2.1
        ``File::info()`` ファイルサイズと MIME タイプの情報が含まれるようになりました。


.. php:method:: lastAccess( )

    :rtype: integer

    最新のアクセス時間を返します。

.. php:method:: lastChange( )

    :rtype: integer

    最新の更新時間を返します。

.. php:method:: md5( $maxsize = 5 )

    :rtype: string

    ファイルサイズを事前にチェックした上で、ファイルの md5 チェックサムを返します。（訳注：$maxsizeの単位はMB）

.. php:method:: name( )

    :rtype: string

    拡張子を省いたファイル名を返します。

.. php:method:: offset( $offset = false, $seek = 0 )

    :rtype: mixed

    現在オープンしているファイルのオフセット値を設定または取得します。

.. php:method:: open( $mode = 'r', $force = false )

    :rtype: boolean

    現在のファイルを引数の $mode でオープンします。

.. php:method:: owner( )

    :rtype: integer

    ファイルのオーナーを返します。

.. php:method:: perms( )

    :rtype: string

    ファイルのパーミッションを返します。

.. php:staticmethod:: prepare( $data, $forceWindows = false )

    :rtype: string

    ASCII 文字列をファイルへ書き出す事前処理を行います。\
    現在の実行環境に合わせて改行文字を変換します。\
    Windows なら"\\r\\n"を、その他の環境なら"\\n"が利用されます。

.. php:method:: pwd( )

    :rtype: string

    ファイルのフルパスを返します。

.. php:method:: read( $bytes = false, $mode = 'rb', $force = false )

    :rtype: mixed

    ファイルの内容を文字列で返します。失敗時は false を返します。

.. php:method:: readable( )

    :rtype: boolean

    ファイルが読み出し可能な場合に true を返します。

.. php:method:: safe( $name = NULL, $ext = NULL )

    :rtype: string

    安全にセーブするために、ファイル名を変換します。（訳注：ホワイトスペース、ドット、ハイフンをアンダーバーへ変換）

.. php:method:: size( )

    :rtype: integer

    ファイルサイズを返します。

.. php:method:: writable( )

    :rtype: boolean

    ファイルが書き込み可能な場合に true を返します。

.. php:method:: write( $data, $mode = 'w', $force = false )

    :rtype: boolean

    引数のデータをファイルへ書き込みます。

.. versionadded:: 2.1 ``File::mime()``

.. php:method:: mime()

    :rtype: mixed

    ファイルのMIMEタイプを返します。失敗時には false を返します。

.. .. todo::

..     双方のクラスの各メソッドの使い方について、より良い解説が必要です。

.. meta::
    :title lang=en: Folder & File
    :description lang=en: The Folder and File utilities are convenience classes to help you read, write, and append to files; list files within a folder and other common directory related tasks.
    :keywords lang=en: file,folder,cakephp utility,read file,write file,append file,recursively copy,copy options,folder path,class folder,file php,php files,change directory,file utilities,new folder,directory structure,delete file
