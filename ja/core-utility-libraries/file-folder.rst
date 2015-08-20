Folder & File
#############

Folder と File ユーティリティは、ファイルの読み書きやフォルダ内のファイル名一覧の取得、
その他ディレクトリに関連するタスクにおいて便利なクラスです。


基本的な使い方
==============

:php:meth:`App::uses()` を使ってクラスをロードします。 ::

    App::uses('Folder', 'Utility');
    App::uses('File', 'Utility');

すると、新しいフォルダインスタンスをセットアップすることができるようになります。 ::

    $dir = new Folder('/path/to/folder');

インスタンスを作成したフォルダ内から *.ctp* の拡張子が付いたファイルを
正規表現検索する場合はこのようにします。 ::

    $files = $dir->find('.*\.ctp');

これでファイルの読み込みや、コンテンツの書き込み、ファイルの削除などが行えるようになります。 ::

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

.. php:staticmethod:: addPathElement(string $path, string $element)

    :rtype: string

    $path と $element の間に適切なスラッシュを加えて返します。 ::

        $path = Folder::addPathElement('/a/path/for', 'testing');
        // $path は /a/path/for/testing となります

    .. versionadded:: 2.5
        2.5 から $element パラメータは配列も使用できます。

.. php:method:: cd(string $path)

    :rtype: string

    カレントディレクトリを $path へ移動します。失敗時には false が返ります ::

        $folder = new Folder('/foo');
        echo $folder->path; // /foo が表示されます
        $folder->cd('/bar');
        echo $folder->path; // /bar が表示されます
        $false = $folder->cd('/non-existent-folder');


.. php:method:: chmod(string $path, integer $mode = false, boolean $recursive = true, array $exceptions = array())

    :rtype: boolean

    ディレクトリのモード（パーミッション）を再帰的に変更します。
    ファイルのモードも同様に変更します。 ::

        $dir = new Folder();
        $dir->chmod('/path/to/folder', 0755, true, array('skip_me.php'));


.. php:method:: copy(array|string $options = array())

    :rtype: boolean

    (デフォルトでは再帰的に) ディレクトリをコピーします。
    唯一のパラメータである $options にはコピー先のパスか、オプションの配列を指定します。 ::

        $folder1 = new Folder('/path/to/folder1');
        $folder1->copy('/path/to/folder2');
        // Will put folder1 and all its contents into folder2

        $folder = new Folder('/path/to/folder');
        $folder->copy(array(
            'to' => '/path/to/new/folder',
            'from' => '/path/to/copy/from', // will cause a cd() to occur
            'mode' => 0755,
            'skip' => array('skip-me.php', '.git'),
            'scheme' => Folder::SKIP, // Skip directories/files that already exist.
            'recursive' => true //set false to disable recursive copy
        ));

    以下の３つの動作 (*scheme*) に対応します:

    * ``Folder::SKIP`` コピー・移動先にファイルやディレクトリが既に存在している場合は、スキップします。
    * ``Folder::MERGE`` コピー元とコピー先のディレクトリをマージします。コピー元のディレクトリにある
      ファイルは、対象のディレクトリにあるファイルを置き換えます。ディレクトリの中身はマージされます。
    * ``Folder::OVERWRITE`` 対象のディレクトリに存在するファイルやディレクトリはコピー元の
      ディレクトリの内容で上書きされます。対象とコピー先の両方にサブディレクトリが含まれる場合、
      対象のディレクトリの内容は、コピー元の内容に削除や置き換えられます。

    .. versionchanged:: 2.3
        ``copy()`` にマージ、スキップ、上書きの動作 (*scheme*) が追加されました。

.. php:staticmethod:: correctSlashFor(string $path)

    :rtype: string

    $path に与えるべき適切なスラッシュを返します。
    （Windows 環境では '\\' で、その他の環境では '/'）

.. php:method:: create(string $pathname, integer $mode = false)

    :rtype: boolean

    ディレクトリを作成します。
    `/foo/bar/baz/shoe/horn` のような深い階層の作成も可能です。 ::

        $folder = new Folder();
        if ($folder->create('foo' . DS . 'bar' . DS . 'baz' . DS . 'shoe' . DS . 'horn')) {
            // フォルダ作成に成功した場合の処理
        }

.. php:method:: delete(string $path = null)

    :rtype: boolean

    システムが許可していた場合、再帰的にディレクトリを削除します。 ::

        $folder = new Folder('foo');
        if ($folder->delete()) {
            // フォルダの削除が成功した場合の処理
        }

.. php:method:: dirsize()

    :rtype: integer

    フォルダとその中身のサイズを返します。

.. php:method:: errors()

    :rtype: array

    最新のエラーを返します。

.. php:method:: find(string $regexpPattern = '.*', boolean $sort = false)

    :rtype: array

    現在のディレクトリで指定のパターンにマッチしたファイルを配列で返します。 ::

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

.. php:method:: findRecursive(string $pattern = '.*', boolean $sort = false)

    :rtype: array

    パターンにマッチした全てのファイルをカレントディレクトリを付けて返します。 ::

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


.. php:method:: inCakePath(string $path = '')

    :rtype: boolean

    ファイルが CakePath の中に存在すれば true を返します。

.. php:method:: inPath(string $path = '', boolean $reverse = false)

    :rtype: boolean

    指定されたファイルが与えられたパスの中に存在すれば true を返します。 ::

       $Folder = new Folder(WWW_ROOT);
       $result = $Folder->inPath(APP);
       // $result = true, /var/www/example/app/ は /var/www/example/app/webroot/ に含まれる

       $result = $Folder->inPath(WWW_ROOT . 'img' . DS, true);
       // $result = true, /var/www/example/app/webroot/ は
       // /var/www/example/app/webroot/img/ に含まれる

.. php:staticmethod:: isAbsolute(string $path)

    :rtype: boolean

    引数の $path が絶対パスであれば true を返します。

.. php:staticmethod:: isSlashTerm(string $path)

    :rtype: boolean

    引数の $path がスラッシュで終了していれば true を返します。（つまり、 slash-terminated） ::

        $result = Folder::isSlashTerm('/my/test/path');
        // $result = false
        $result = Folder::isSlashTerm('/my/test/path/');
        // $result = true

.. php:staticmethod:: isWindowsPath(string $path)

    :rtype: boolean

    引数の $path が Windows のパスであれば true を返します。

.. php:method:: messages()

    :rtype: array

    直近で利用したメソッドのメッセージを取得します。

.. php:method:: move(array $options)

    :rtype: boolean

    (デフォルトで再帰的に) ディレクトリを移動します。 $options パラメータは ``copy()`` のものと同じです。

.. php:staticmethod:: normalizePath(string $path)

    :rtype: string

    引数の $path を適切なスラッシュに調整して返します。
    （Windows 環境では '\\' で、その他の環境では '/'）

.. php:method:: pwd()

    :rtype: string

    現在のパスを返します。


.. php:method:: read(boolean $sort = true, array|boolean $exceptions = false, boolean $fullPath = false)

    :rtype: mixed

    :param boolean $sort: true の場合に結果をソートします。
    :param mixed $exceptions: 無視するファイル名とフォルダ名の配列。
        true もしくは '.' が与えられた場合、隠しファイルもしくはドットファイルを無視します。
    :param boolean $fullPath: true の場合に絶対パスで結果を返します。

    現在のディレクトリのコンテンツを配列で返します。
    戻り値は2つの配列となります。1つはディレクトリ名の配列。もう1つはファイル名の配列です。 ::

        $dir = new Folder(WWW_ROOT);
        $files = $dir->read(true, array('files', 'index.php'));
        /*
        Array
        (
            [0] => Array // フォルダー
                (
                    [0] => css
                    [1] => img
                    [2] => js
                )
            [1] => Array // ファイル
                (
                    [0] => .htaccess
                    [1] => favicon.ico
                    [2] => test.php
                )
        )
        */


.. php:method:: realpath(string $path)

    :rtype: string

    引数のパス内にある ".." の名前を解決したパスを返します。

.. php:staticmethod:: slashTerm(string $path)

    :rtype: string

    引数の $path に終端のスラッシュを付けたパスを返します。
    (corrected for Windows or other OS)

.. php:method:: tree(null|string $path = null, array|boolean $exceptions = true, null|string $type = null)

    :rtype: mixed

    ディレクトリ一覧とその中のファイル一覧を返します。


File API
========

.. php:class:: File(string $path, boolean $create = false, integer $mode = 755)

::

    // 0644 のパーミッションで新しいファイルを作成します
    $file = new File('/path/to/file.php', true, 0644);

.. php:attr:: Folder

    ファイルが属するフォルダ・オブジェクト

.. php:attr:: name

    拡張子付きのファイル名。 似たような動作をする :php:meth:`File::name()` では、
    拡張子無しのファイル名を返します。

.. php:attr:: info

    ファイル情報の配列。このプロパティよりも :php:meth:`File::info()` を使ってください。

.. php:attr:: handle

    ファイルをオープンしている場合のファイルハンドラを保持します。

.. php:attr:: lock

    ファイルの読み書き時のロックを有効にします。

.. php:attr:: path

    現在のファイルの絶対パス。

.. php:method:: append(string $data, boolean $force = false)

    :rtype: boolean

    引数の文字列をファイルへ追記します。

.. php:method:: close()

    :rtype: boolean

    ファイルがオープンされていた場合、そのファイルをクローズします

.. php:method:: copy(string $dest, boolean $overwrite = true)

    :rtype: boolean

    ファイルを $dest へコピーします。

.. php:method:: create()

    :rtype: boolean

    ファイルを作成します。

.. php:method:: delete()

    :rtype: boolean

    ファイルを削除します。

.. php:method:: executable()

    :rtype: boolean

    ファイルに実行権限が付いていた場合に true を返します。

.. php:method:: exists()

    :rtype: boolean

    ファイルが存在した場合に true を返します。

.. php:method:: ext()

    :rtype: string

    ファイルの拡張子を返します。

.. php:method:: Folder()

    :rtype: Folder

    現在のフォルダを返します。

.. php:method:: group()

    :rtype: integer

    ファイルのグループを返します。

.. php:method:: info()

    :rtype: string

    ファイル情報を返します。

    .. versionchanged:: 2.1
        ``File::info()`` ファイルサイズと MIME タイプの情報が含まれるようになりました。


.. php:method:: lastAccess()

    :rtype: integer

    最新のアクセス時間を返します。

.. php:method:: lastChange()

    :rtype: integer

    最新の更新時間を返します。

.. php:method:: md5(integer|boolean $maxsize = 5)

    :rtype: string

    ファイルサイズを事前にチェックした上で、ファイルの md5 チェックサムを返します。
    (訳注：$maxsize の単位は MB)

.. php:method:: name()

    :rtype: string

    拡張子を省いたファイル名を返します。

.. php:method:: offset(integer|boolean $offset = false, integer $seek = 0)

    :rtype: mixed

    現在オープンしているファイルのオフセット値を設定または取得します。

.. php:method:: open(string $mode = 'r', boolean $force = false)

    :rtype: boolean

    現在のファイルを引数の $mode でオープンします。

.. php:method:: owner()

    :rtype: integer

    ファイルのオーナーを返します。

.. php:method:: perms()

    :rtype: string

    Returns the "chmod" (permissions) of the file.
    ファイルのパーミッションを返します。

.. php:staticmethod:: prepare(string $data, boolean $forceWindows = false)

    :rtype: string

    ASCII 文字列をファイルへ書き出す事前処理を行います。
    現在の実行環境に合わせて改行文字を変換します。
    Windows なら "\\r\\n" を、その他の環境なら "\\n" が利用されます。

.. php:method:: pwd()

    :rtype: string

    ファイルのフルパスを返します。

.. php:method:: read(string $bytes = false, string $mode = 'rb', boolean $force = false)

    :rtype: mixed

    ファイルの内容を文字列で返します。失敗時は false を返します。

.. php:method:: readable()

    :rtype: boolean

    ファイルが読み出し可能な場合に true を返します。

.. php:method:: safe(string $name = null, string $ext = null)

    :rtype: string

    安全にセーブするために、ファイル名を変換します。
    (訳注：ホワイトスペース、ドット、ハイフンをアンダーバーへ変換)

.. php:method:: size()

    :rtype: integer

    ファイルサイズを返します。

.. php:method:: writable()

    :rtype: boolean

    ファイルが書き込み可能な場合に true を返します。

.. php:method:: write(string $data, string $mode = 'w', boolean$force = false)

    :rtype: boolean

    引数のデータをファイルへ書き込みます。

.. versionadded:: 2.1 ``File::mime()``

.. php:method:: mime()

    :rtype: mixed

    ファイルの MIME タイプを返します。失敗時には false を返します。

.. php:method:: replaceText( $search, $replace )

    :rtype: boolean

    ファイル内のテキストを置換します。失敗時に false を返し、成功時に true を返します。

    .. versionadded::
        2.5 ``File::replaceText()``

.. todo::

    双方のクラスの各メソッドの使い方について、より良い解説が必要です。

.. meta::
    :title lang=ja: Folder & File
    :description lang=ja: The Folder and File utilities are convenience classes to help you read, write, and append to files; list files within a folder and other common directory related tasks.
    :keywords lang=ja: file,folder,cakephp utility,read file,write file,append file,recursively copy,copy options,folder path,class folder,file php,php files,change directory,file utilities,new folder,directory structure,delete file
