Folder & File
#############

.. php:namespace:: Cake\Filesystem

Folder と File ユーティリティは、ファイルの読み書きやフォルダー内のファイル名一覧の取得、
その他ディレクトリーに関連するタスクにおいて便利なクラスです。

基本的な使用法
==============

クラスがロードされていることを確認してください。 ::

    use Cake\Filesystem\Folder;
    use Cake\Filesystem\File;

すると、新しいフォルダーインスタンスをセットアップすることができるようになります。 ::

    $dir = new Folder('/path/to/folder');

そして、そのフォルダー内から *.ctp* の拡張子が付いたファイルを
正規表現を使って検索できます。 ::

    $files = $dir->find('.*\.ctp');

これでファイルをループしたり、読み込み、内容の書き込み・追記、
ファイルの削除などが行えるようになります。 ::

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

.. php:class:: Folder(string $path = false, boolean $create = false, string|boolean $mode = false)

::

    // 0755 のパーミッションで新しいフォルダーを作成します
    $dir = new Folder('/path/to/folder', true, 0755);

.. php:attr:: path

    フォルダーの現在のパス。
    :php:meth:`Folder::pwd()` は同じ情報を返します。

.. php:attr:: sort

    リストを取得する際に、名前によるソートを実行するかどうか。

.. php:attr:: mode

    フォルダー作成時のモード。デフォルトは ``0755`` です。
    Windows マシンでは何も影響しません。

.. php:staticmethod:: addPathElement(string $path, string $element)

    $path と $element の間に適切なスラッシュを加えて返します。 ::

        $path = Folder::addPathElement('/a/path/for', 'testing');
        // $path は /a/path/for/testing となります

    $element は、配列も指定できます。 ::

        $path = Folder::addPathElement('/a/path/for', ['testing', 'another']);
        // $path は /a/path/for/testing/another となります

.. php:method:: cd( $path )

    ディレクトリーを $path へ移動します。失敗時には ``false`` が返ります。 ::

        $folder = new Folder('/foo');
        echo $folder->path; // /foo を表示
        $folder->cd('/bar');
        echo $folder->path; // /bar を表示
        $false = $folder->cd('/non-existent-folder');

.. php:method:: chmod(string $path, integer $mode = false, boolean $recursive = true, array $exceptions = [])

    ディレクトリー構造のモードを再帰的に変更します。ファイルのモードも同様に変更します。 ::

        $dir = new Folder();
        $dir->chmod('/path/to/folder', 0755, true, ['skip_me.php']);

.. php:method:: copy(array|string $options = [])

    再帰的にディレクトリーをコピーします。
    唯一のパラメーターである $options にはコピー先のパスか、オプションの配列を指定します。 ::

        $folder1 = new Folder('/path/to/folder1');
        $folder1->copy('/path/to/folder2');
        // folder2 の中に folder1 とその全ての内容を配置します

        $folder = new Folder('/path/to/folder');
        $folder->copy([
            'to' => '/path/to/new/folder',
            'from' => '/path/to/copy/from', // Will cause a cd() to occur
            'mode' => 0755,
            'skip' => ['skip-me.php', '.git'],
            'scheme' => Folder::SKIP  // 既存のディレクトリーやファイルはスキップ。
        ]);

    以下の３つの動作 (*scheme*) に対応します。

    * ``Folder::SKIP`` コピー・移動先にファイルやディレクトリーが既に存在している場合は、スキップします。
    * ``Folder::MERGE`` コピー元とコピー先のディレクトリーをマージします。
      コピー元のディレクトリーにある ファイルは、対象のディレクトリーにあるファイルを置き換えます。
      ディレクトリーの中身はマージされます。
    * ``Folder::OVERWRITE`` 対象のディレクトリーに存在するファイルやディレクトリーはコピー元の
      ディレクトリーの内容で上書きされます。対象とコピー先の両方にサブディレクトリーが含まれる場合、
      対象のディレクトリーの内容は、コピー元の内容に削除や置き換えられます。

.. php:staticmethod:: correctSlashFor(string $path)

    $path に与えるべき適切なスラッシュを返します。
    （Windows のパスは '\\' で、その他のパスは '/'）

.. php:method:: create(string $pathname, integer $mode = false)

   再帰的にディレクトリー構造を作成します。
   `/foo/bar/baz/shoe/horn` のような深い階層の作成も可能です。 ::

        $folder = new Folder();
        if ($folder->create('foo' . DS . 'bar' . DS . 'baz' . DS . 'shoe' . DS . 'horn')) {
            // 入れ子になっているフォルダーの作成に成功
        }

.. php:method:: delete(string $path = null)

    システムが許可していた場合、再帰的にディレクトリーを削除します。 ::

        $folder = new Folder('foo');
        if ($folder->delete()) {
            // foo とその入れ子になっているフォルダーの削除に成功
        }

.. php:method:: dirsize()

    フォルダーとその内容のサイズをバイト数で返します。

.. php:method:: errors()

    直近で利用したメソッドのエラーを返します。

.. php:method:: find(string $regexpPattern = '.*', boolean $sort = false)

    現在のディレクトリーでマッチしたファイルを配列で返します。 ::

        // webroot/img/ フォルダー内の .png を検索し、ソートして返す
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

    フォルダーの find メソッドと findRecursive メソッドは、ファイルのみを検索します。
    フォルダーとファイルを取得したい場合は、 :php:meth:`Folder::read()` もしくは
    :php:meth:`Folder::tree()` 参照してください。

.. php:method:: findRecursive(string $pattern = '.*', boolean $sort = false)

    現在のディレクトリー内とそれ以下のすべての一致するファイルの配列を返します。 ::

        // test もしくは index で始まるファイルを再帰的に検索する
        $dir = new Folder(WWW_ROOT);
        $files = $dir->findRecursive('(test|index).*');
        /*
        Array
        (
            [0] => /var/www/cake/webroot/index.php
            [1] => /var/www/cake/webroot/test.php
            [2] => /var/www/cake/webroot/img/test-skip-icon.png
            [3] => /var/www/cake/webroot/img/test-fail-icon.png
            [4] => /var/www/cake/webroot/img/test-error-icon.png
            [5] => /var/www/cake/webroot/img/test-pass-icon.png
        )
        */

.. php:method:: inCakePath(string $path = '')

    ファイルが与えられた CakePath の中に存在すれば ``true`` を返します。

.. php:method:: inPath(string $path = '', boolean $reverse = false)

    ファイルが与えられたパスの中に存在すれば ``true`` を返します。 ::

        $Folder = new Folder(WWW_ROOT);
        $result = $Folder->inPath(APP);
        // $result = true, /var/www/example/ は /var/www/example/webroot/ の中です

        $result = $Folder->inPath(WWW_ROOT . 'img' . DS, true);
        // $result = true, /var/www/example/webroot/ は /var/www/example/webroot/img/ の中です

.. php:staticmethod:: isAbsolute(string $path)

    与えられた $path が絶対パスであれば ``true`` を返します。

.. php:staticmethod:: isSlashTerm(string $path)

    与えられた $path がスラッシュで終了していれば true を返します。（つまり、スラッシュ終端） ::

        $result = Folder::isSlashTerm('/my/test/path');
        // $result = false
        $result = Folder::isSlashTerm('/my/test/path/');
        // $result = true

.. php:staticmethod:: isWindowsPath(string $path)

    与えられた $path が Windows のパスであれば ``true`` を返します。

.. php:method:: messages()

    直近で利用したメソッドのメッセージを取得します。

.. php:method:: move(array $options)

    再帰的にディレクトリーを移動。

.. php:staticmethod:: normalizePath(string $path)

    与えられた $path を適切なスラッシュに調整して返します。
    （Windows のパスは '\\' で、その他のパスは '/'）

.. php:method:: pwd()

    現在のパスを返します。

.. php:method:: read(boolean $sort = true, array|boolean $exceptions = false, boolean $fullPath = false)

    現在のディレクトリーの内容を配列で返します。
    戻り値は2つの配列となります。1つはディレクトリー名の配列。もう1つはファイル名の配列です。 ::

        $dir = new Folder(WWW_ROOT);
        $files = $dir->read(true, ['files', 'index.php']);
        /*
        Array
        (
            [0] => Array // Folders
                (
                    [0] => css
                    [1] => img
                    [2] => js
                )
            [1] => Array // Files
                (
                    [0] => .htaccess
                    [1] => favicon.ico
                    [2] => test.php
                )
        )
        */

.. php:method:: realpath(string $path)

    本当のパスを取得します（".." などを考慮して）

.. php:staticmethod:: slashTerm(string $path)

    引数の $path に (Windows や、その他の OS で正しい) 終端のスラッシュを付けたパスを返します。

.. php:method:: tree(null|string $path = null, array|boolean $exceptions = true, null|string $type = null)

    入れ子になったディレクトリーと各ディレクトリー中のファイルの配列を返します。

File API
========

.. php:class:: File(string $path, boolean $create = false, integer $mode = 755)

::

    // 0644 のパーミッションで新しいファイルを作成します
    $file = new File('/path/to/file.php', true, 0644);

.. php:attr:: Folder

    ファイルが属するフォルダー・オブジェクト。

.. php:attr:: name

    拡張子付きのファイル名。
    拡張子なしのファイル名を返す :php:meth:`File::name()` とは異なります。

.. php:attr:: info

    ファイル情報の配列。
    代わりに :php:meth:`File::info()` を使用してください。

.. php:attr:: handle

    ファイルをオープンしている場合のファイルハンドラを保持します。

.. php:attr:: lock

    ファイルの読み書き時のロックを有効にします。

.. php:attr:: path

    現在のファイルの絶対パス。

.. php:method:: append(string $data, boolean $force = false)

    与えられたデータ文字列を現在のファイルに追記します。

.. php:method:: close()

    ファイルがオープンされていた場合、そのファイルをクローズします。

.. php:method:: copy(string $dest, boolean $overwrite = true)

    ファイルを $dest へコピーします。

.. php:method:: create()

    ファイルを作成します。

.. php:method:: delete()

    ファイルを削除します。

.. php:method:: executable()

    ファイルが実行可能な場合に ``true`` を返します。

.. php:method:: exists()

    ファイルが存在する場合に ``true`` を返します。

.. php:method:: ext()

    ファイルの拡張子を返します。

.. php:method:: Folder()

    現在のフォルダーを返します。

.. php:method:: group()

    ファイルのグループを返します。エラーの場合は ``false`` を返します。

.. php:method:: info()

    ファイル情報を返します。

.. php:method:: lastAccess( )

    最終アクセス時刻を返します。

.. php:method:: lastChange()

   最終更新時刻を返します。エラーの場合は ``false`` を返します。

.. php:method:: md5(integer|boolean $maxsize = 5)

    ファイルサイズを事前にチェックした上で、ファイルの md5 チェックサムを取得します。
    エラーの場合、 ``false`` を取得します。

.. php:method:: name()

    拡張子を省いたファイル名を返します。

.. php:method:: offset(integer|boolean $offset = false, integer $seek = 0)

    現在オープンしているファイルのオフセット値を設定または取得します。

.. php:method:: open(string $mode = 'r', boolean $force = false)

    現在のファイルを与えられた $mode でオープンします。

.. php:method:: owner()

    ファイルのオーナーを返します。

.. php:method:: perms()

    ファイルの "chmod" (パーミッション) を返します。

.. php:staticmethod:: prepare(string $data, boolean $forceWindows = false)

    ASCII 文字列をファイルへ書き出す事前処理を行います。
    現在の実行環境に合わせて改行文字を変換します。
    Windows なら "\\r\\n" を、その他の環境なら "\\n" が利用されます。

.. php:method:: pwd()

    ファイルのフルパスを返します。

.. php:method:: read(string $bytes = false, string $mode = 'rb', boolean $force = false)

    現在のファイルの内容を文字列で返します。失敗時は ``false`` を返します。

.. php:method:: readable()

    ファイルが読み出し可能な場合に ``true`` を返します。

.. php:method:: safe(string $name = null, string $ext = null)

    保存するファイル名を安全にします。

.. php:method:: size()

    ファイルサイズをバイト数で返します。

.. php:method:: writable()

    ファイルが書き込み可能な場合に ``true`` を返します。

.. php:method:: write(string $data, string $mode = 'w', boolean$force = false)

    与えられたデータを現在のファイルへ書き込みます。

.. php:method:: mime()

    ファイルの MIME タイプを取得します。失敗時は ``false`` を取得します。

.. php:method:: replaceText( $search, $replace )

    ファイル内のテキストを置換します。
    失敗時に ``false`` を返し、成功時に ``true`` を返します。

.. todo::

    双方のクラスの各メソッドの使い方について、より良い解説が必要です。

.. meta::
    :title lang=ja: Folder & File
    :description lang=ja: Folder と File ユーティリティは、ファイルの読み書きや追記、フォルダー内のファイル名一覧の取得、その他ディレクトリーに関連するタスクにおいて便利なクラスです。
    :keywords lang=ja: file,folder,cakephp utility,read file,write file,append file,recursively copy,copy options,folder path,class folder,file php,php files,change directory,file utilities,new folder,directory structure,delete file
