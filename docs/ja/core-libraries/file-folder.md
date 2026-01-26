# Folder & File

Folder と File ユーティリティは、ファイルの読み書きやフォルダー内のファイル名一覧の取得、
その他ディレクトリーに関連するタスクにおいて便利なクラスです。

## 基本的な使用法

クラスがロードされていることを確認してください。 :

``` php
use Cake\Filesystem\Folder;
use Cake\Filesystem\File;
```

すると、新しいフォルダーインスタンスをセットアップすることができるようになります。 :

``` php
$dir = new Folder('/path/to/folder');
```

そして、そのフォルダー内から *.ctp* の拡張子が付いたファイルを
正規表現を使って検索できます。 :

``` php
$files = $dir->find('.*\.ctp');
```

これでファイルをループしたり、読み込み、内容の書き込み・追記、
ファイルの削除などが行えるようになります。 :

``` php
foreach ($files as $file) {
    $file = new File($dir->pwd() . DS . $file);
    $contents = $file->read();
    // $file->write('このファイルの内容を上書きします');
    // $file->append('このファイルの最後に追記します。');
    // $file->delete(); // このファイルを削除します
    $file->close(); // 終了時にファイルをクローズしましょう
}
```

## Folder API

`class` Cake\\Filesystem\\**Folder**(string $path = false, boolean $create = false, string|boolean $mode = false)

``` php
// 0755 のパーミッションで新しいフォルダーを作成します
$dir = new Folder('/path/to/folder', true, 0755);


フォルダーの現在のパス。
:php:meth:`Folder::pwd()` は同じ情報を返します。


リストを取得する際に、名前によるソートを実行するかどうか。


フォルダー作成時のモード。デフォルトは ``0755`` です。
Windows マシンでは何も影響しません。
```

`static` Cake\\Filesystem\\Folder::**addPathElement**(string $path, string $element)

\$path と \$element の間に適切なスラッシュを加えて返します。 :

``` php
$path = Folder::addPathElement('/a/path/for', 'testing');
// $path は /a/path/for/testing となります
```

\$element は、配列も指定できます。 :

``` php
$path = Folder::addPathElement('/a/path/for', ['testing', 'another']);
// $path は /a/path/for/testing/another となります
```

`method` Cake\\Filesystem\\Folder::**cd**( $path )

`method` Cake\\Filesystem\\Folder::**chmod**(string $path, integer $mode = false, boolean $recursive = true, array $exceptions = [])

`method` Cake\\Filesystem\\Folder::**copy**(array|string $options = [])

`static` Cake\\Filesystem\\Folder::**correctSlashFor**(string $path)

\$path に与えるべき適切なスラッシュを返します。
（Windows のパスは '\\ で、その他のパスは '/'）

`method` Cake\\Filesystem\\Folder::**create**(string $pathname, integer $mode = false)

`method` Cake\\Filesystem\\Folder::**delete**(string $path = null)

`method` Cake\\Filesystem\\Folder::**dirsize**()

`method` Cake\\Filesystem\\Folder::**errors**()

`method` Cake\\Filesystem\\Folder::**find**(string $regexpPattern = '.*', boolean $sort = false)

> [!NOTE]
> フォルダーの find メソッドと findRecursive メソッドは、ファイルのみを検索します。
> フォルダーとファイルを取得したい場合は、 `Folder::read()` もしくは
> `Folder::tree()` 参照してください。

`method` Cake\\Filesystem\\Folder::**findRecursive**(string $pattern = '.*', boolean $sort = false)

`method` Cake\\Filesystem\\Folder::**inCakePath**(string $path = '')

`method` Cake\\Filesystem\\Folder::**inPath**(string $path = '', boolean $reverse = false)

`static` Cake\\Filesystem\\Folder::**isAbsolute**(string $path)

与えられた \$path が絶対パスであれば `true` を返します。

`static` Cake\\Filesystem\\Folder::**isSlashTerm**(string $path)

与えられた \$path がスラッシュで終了していれば true を返します。（つまり、スラッシュ終端） :

``` php
$result = Folder::isSlashTerm('/my/test/path');
// $result = false
$result = Folder::isSlashTerm('/my/test/path/');
// $result = true
```

`static` Cake\\Filesystem\\Folder::**isWindowsPath**(string $path)

与えられた \$path が Windows のパスであれば `true` を返します。

`method` Cake\\Filesystem\\Folder::**messages**()

`method` Cake\\Filesystem\\Folder::**move**(array $options)

`static` Cake\\Filesystem\\Folder::**normalizePath**(string $path)

与えられた \$path を適切なスラッシュに調整して返します。
（Windows のパスは '\\ で、その他のパスは '/'）

`method` Cake\\Filesystem\\Folder::**pwd**()

`method` Cake\\Filesystem\\Folder::**read**(boolean $sort = true, array|boolean $exceptions = false, boolean $fullPath = false)

`method` Cake\\Filesystem\\Folder::**realpath**(string $path)

`static` Cake\\Filesystem\\Folder::**slashTerm**(string $path)

引数の \$path に (Windows や、その他の OS で正しい) 終端のスラッシュを付けたパスを返します。

`method` Cake\\Filesystem\\Folder::**tree**(null|string $path = null, array|boolean $exceptions = true, null|string $type = null)

## File API

`class` Cake\\Filesystem\\**File**(string $path, boolean $create = false, integer $mode = 755)

``` php
// 0644 のパーミッションで新しいファイルを作成します
$file = new File('/path/to/file.php', true, 0644);


ファイルが属するフォルダー・オブジェクト。


拡張子付きのファイル名。
拡張子なしのファイル名を返す :php:meth:`File::name()` とは異なります。


ファイル情報の配列。
代わりに :php:meth:`File::info()` を使用してください。


ファイルをオープンしている場合のファイルハンドラを保持します。


ファイルの読み書き時のロックを有効にします。


現在のファイルの絶対パス。
```

`method` Cake\\Filesystem\\File::**append**(string $data, boolean $force = false)

`method` Cake\\Filesystem\\File::**close**()

`method` Cake\\Filesystem\\File::**copy**(string $dest, boolean $overwrite = true)

`method` Cake\\Filesystem\\File::**create**()

`method` Cake\\Filesystem\\File::**delete**()

`method` Cake\\Filesystem\\File::**executable**()

`method` Cake\\Filesystem\\File::**exists**()

`method` Cake\\Filesystem\\File::**ext**()

`method` Cake\\Filesystem\\File::**Folder**()

`method` Cake\\Filesystem\\File::**group**()

`method` Cake\\Filesystem\\File::**info**()

`method` Cake\\Filesystem\\File::**lastAccess**( )

`method` Cake\\Filesystem\\File::**lastChange**()

`method` Cake\\Filesystem\\File::**md5**(integer|boolean $maxsize = 5)

`method` Cake\\Filesystem\\File::**name**()

`method` Cake\\Filesystem\\File::**offset**(integer|boolean $offset = false, integer $seek = 0)

`method` Cake\\Filesystem\\File::**open**(string $mode = 'r', boolean $force = false)

`method` Cake\\Filesystem\\File::**owner**()

`method` Cake\\Filesystem\\File::**perms**()

`static` Cake\\Filesystem\\File::**prepare**(string $data, boolean $forceWindows = false)

ASCII 文字列をファイルへ書き出す事前処理を行います。
現在の実行環境に合わせて改行文字を変換します。
Windows なら "\r\n" を、その他の環境なら "\n" が利用されます。

`method` Cake\\Filesystem\\File::**pwd**()

`method` Cake\\Filesystem\\File::**read**(string $bytes = false, string $mode = 'rb', boolean $force = false)

`method` Cake\\Filesystem\\File::**readable**()

`method` Cake\\Filesystem\\File::**safe**(string $name = null, string $ext = null)

`method` Cake\\Filesystem\\File::**size**()

`method` Cake\\Filesystem\\File::**writable**()

`method` Cake\\Filesystem\\File::**write**(string $data, string $mode = 'w', boolean$force = false)

`method` Cake\\Filesystem\\File::**mime**()

`method` Cake\\Filesystem\\File::**replaceText**( $search, $replace )

<div class="todo">

双方のクラスの各メソッドの使い方について、より良い解説が必要です。

</div>
