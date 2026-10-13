# エラーハンドリング

CakePHP のコアクラスは、エラーを例外として投げます。そのため、アプリケーションコードの中で
エラーをハンドルすることも、組み込みの例外ハンドリングに処理を任せることもできます。
PHP エラー（警告、notice、非推奨、致命的エラー）は、これとは別にエラーハンドラで処理されます。

Configure を使って、好きなメソッドをデフォルトのエラーハンドラや例外ハンドラとして
設定しておくことができます。

## エラーの設定

エラーの設定はアプリケーションの `config/core.php` の中で行います（レガシー構成では
`app/Config/core.php`。[CakePHP のフォルダ構造](/ja/getting-started/cakephp-folder-structure) を参照してください）。
アプリケーションが PHP エラーを発生させるたびに呼び出されるコールバックを定義することができます
（例外については [例外(Exception)](../development/exceptions) で別に説明します）。
コールバックは PHP が呼ぶことができるものなら無名関数であってもかまいません。
エラーをハンドルするデフォルトの設定は以下のようになっています。

``` php
// config/core.php
Configure::write('Error', [
    'handler' => 'ErrorHandler::handleError',
    'level' => E_ALL & ~E_DEPRECATED,
    'trace' => true,
]);
```

エラーのハンドラを設定する際に使えるオプションが５つあります。

- `handler` - コールバック - エラーをハンドルするコールバックです。無名関数を含め、
  どんな種類の関数でもセット可能です。
- `level` - int - 捉えたいエラーのレベルです。PHP エラーの組み込み定数やビットマスクを使って、
  必要とするエラーレベルを選択することができます。この値は `error_reporting()` にも渡されます。
- `trace` - boolean - ログファイルにスタックトレースを含めるかどうかです。スタックトレースは
  それぞれのエラーのあとに書かれることになります。これがあれば、どこで、いつエラーが発生したのか
  調べやすくなります。
- `consoleHandler` - コールバック - コンソールでの実行中に発生したエラーをハンドルする
  コールバックです。未指定なら CakePHP のデフォルトハンドラが使われます。
- `extraFatalErrorMemory` - int - シャットダウン時にメモリ上限を何メガバイト引き上げるかを
  指定します。これにより、メモリ不足のような致命的エラーでもログに記録できます。
  デフォルトは 4 で、0 を指定すると無効になります。

デフォルトでは、エラーハンドラは `debug` \> 0 の場合にエラーを表示し、`debug` = 0 の場合に
ログに出力します。どちらの場合も捉えられるエラーのタイプは `Error.level` で制御します。
ログ出力には `CakeLog` が使われます。`config/bootstrap.php` のデフォルトのログ設定では、
警告とエラーは `logs/error.log` に、notice と非推奨の通知は `logs/debug.log` に書き込まれます。
致命的なエラーのハンドラは、`debug` レベルや `Error.level` の設定に関係なく呼び出されますが、
その結果は `debug` レベルに基づいて変わります。

デフォルトのエラーハンドラは、現在の `error_reporting()` の値に含まれないレベルのエラーを無視します。
そのため、`@` 演算子で抑制したエラーは表示もログ出力もされません。

::: pieceofcake2
PHP 8 では `@` で抑制したエラーでも `error_reporting()` が
0 にならないため、`ErrorHandler::handleError()` は `error_reporting() & $code` で判定するように
なりました。独自のエラーハンドラでも同じ判定を行ってください。
:::

> [!NOTE]
> 独自のエラーハンドラを使う場合は、エラーをハンドルする関数内でトレースの設定を扱わない限り、
> この設定は何の効果もありません。

::: info Added in version 2.2
`Error.consoleHandler` オプションは 2.2 で追加されました。
:::

::: info Changed in version 2.2
`Error.handler` と `Error.consoleHandler` は fatal なエラーコードも受け取ることになります。デフォルトの振る舞いは、`debug` が無効なら internal server error のページを表示し、`debug` が有効ならエラーメッセージ、ファイル名、行番号を含むページを表示するというものです。
:::

### `Error` オブジェクトとして投げられるエラー

PHP 7 以降、未定義のメソッドの呼び出しや型の合わない引数の受け渡しなど、以前は致命的エラーだった
ものの多くは、PHP エラーとしてではなく `Error` オブジェクト（`TypeError` や `ArgumentCountError`
など）として投げられます。PHP 8 では、さらに多くの警告が投げられるエラーに変わりました。
これらは `Error.handler` には渡されません。キャッチされなかった場合は、ほかのキャッチされなかった
例外と同じように、設定された `Exception.handler` に渡され、internal server error として
レンダリングされます。詳しくは [例外(Exception)](../development/exceptions) を参照してください。

## 独自のエラーハンドラを作成する

エラーハンドラはどのような種類のコールバックを使ってでも作ることができます。たとえば、
`AppError` というクラスをエラーをハンドルするのに使うことができます。
その場合は次のようにすることになるでしょう。

``` php
// config/core.php
Configure::write('Error.handler', 'AppError::handleError');

// config/bootstrap.php
App::uses('AppError', 'Lib');

// src/Lib/AppError.php
class AppError
{
    public static function handleError(
        $code,
        $description,
        $file = null,
        $line = null,
        $context = null,
    ) {
        if (!(error_reporting() & $code)) {
            // @ で抑制されたか、Error.level の対象外のエラー
            return false;
        }
        echo 'エラー発生！';

        return true;
    }
}
```

このクラス／メソッドはエラーが発生するたびに「エラー発生！」と表示します。エラーハンドラは
`config/bootstrap.php` が読み込まれたあとに登録されるので、そこで `App::uses()` を使って
クラスを読み込んでおけば十分です。[pieceofcake2/app](https://github.com/pieceofcake2/app)
のように `composer.json` で `src/` をクラスマップでオートロードしている場合は、
`composer dump-autoload` を実行すれば Composer からもクラスが見つかるようになります。

PHP 8 ではエラーハンドラに 5 番目の引数 `$context` が渡されなくなったため、この引数は省略可能に
しておいてください。どのような種類のコールバックでも定義することができますので、
無名関数を使用することもできます。

``` php
Configure::write('Error.handler', function ($code, $description, $file = null, $line = null) {
    echo 'おっと、良くない事態発生';

    return true;
});
```

設定されたエラーハンドラにより捉えられるのは PHP エラーであることを覚えておいてください。
独自のエラーハンドリングが必要なら、[例外(Exception)](../development/exceptions) の
ハンドリングもあわせて設定することになるでしょう。

## 致命的 (fatal) エラーの振る舞いを変える

`Error.handler` は致命的 (fatal) なエラーコードも受け取ります。
もしも cake のエラーページを表示させたくないのなら、次のように処理を上書くことができます。

``` php
// config/core.php
Configure::write('Error.handler', 'AppError::handleError');

// config/bootstrap.php
App::uses('AppError', 'Lib');

// src/Lib/AppError.php
class AppError
{
    public static function handleError(
        $code,
        $description,
        $file = null,
        $line = null,
        $context = null,
    ) {
        [, $level] = ErrorHandler::mapErrorCode($code);
        if ($level === LOG_ERR) {
            // 致命的エラーを無視する。PHP エラーのメッセージのみとする。
            return false;
        }

        return ErrorHandler::handleError(
            $code,
            $description,
            $file,
            $line,
            $context,
        );
    }
}
```

致命的エラーのデフォルトの振る舞いを維持したいなら、独自のハンドラから
`ErrorHandler::handleFatalError()` を呼び出すことができます。
