# NumberHelper

`class` **NumberHelper**(View $view, array $settings = array())

NumberHelper は、ビューの中で一般的な書式で数値を表示するための
便利なメソッドを持っています。これらのメソッドは、通貨、パーセンテージ、データサイズ、
指定した精度に整えられた数値へのフォーマットや、他にもより柔軟に数値のフォーマットを行います。

::: info Changed in version 2.1
`NumberHelper` は、 `View` レイヤーの外でも簡単に使えるように `CakeNumber`クラスにリファクタリングされました。ビューの中で、これらのメソッドは `NumberHelper` クラスを経由してアクセス可能です。通常のヘルパーメソッドを呼ぶように呼び出せます:`$this->Number->method($args);` 。
:::

以下の全ての関数は、整形された数値を返します。
これらは自動的にビューに出力を表示しません。

> param float \$number  
> 変換する値
>
> param string \$currency  
> 使用する通貨フォーマット
>
> param array \$options  
> オプション、以下を参照
>
> このメソッドは、共通通貨フォーマット（ユーロ、英ポンド、米ドル）で数値を表示するために使用されます。
> ビュー内で次のように使います。 :
>
> ``` php
> // NumberHelper として実行
> echo $this->Number->currency($number, $currency);
>
> // CakeNumber として実行
> App::uses('CakeNumber', 'Utility');
> echo CakeNumber::currency($number, $currency);
> ```
>
> １つ目のパラメータ、 \$number は、合計金額をあらわす浮動小数点数でなければいけません。
> ２つ目のパラメータは、あらかじめ定義された通貨フォーマット方式を選択するための文字列です。
>
> | \$currency | 通貨の種類によってフォーマットされた 1234.56 |
> |------------|----------------------------------------------|
> | EUR        | €1.234,56                                    |
> | GBP        | £1,234.56                                    |
> | USD        | \$1,234.56                                   |
>
> ３つ目のパラメータは、出力を定義するためのオプションの配列です。
> 次のオプションが用意されています
>
> | オプション       | 説明                                              |
> |------------------|---------------------------------------------------|
> | before           | 数値の前に表示される通貨記号。例: '\$'            |
> | after            | 少数値の後に表示する通貨記号。例: 'c'             
>                     記号を表示させないためには false をセットします。  
>                     例: 0.35 =\> \$0.35                                |
> | zero             | ゼロ値の場合に使用するテキストで、                
>                     文字列か数値で指定できます。例: 0, '無料!'         |
> | places           | 小数点以下の桁数を指定します。例: 2               |
> | thousands        | 千の区切り。例: ','                               |
> | decimals         | 小数点。例: '.'                                   |
> | negative         | 負の数の記号。もし '()' の場合、数値は ( と ) で  
>                     囲まれます。                                       |
> | escape           | htmlentity でエスケープされるかどうか。           
>                     デフォルトは、true                                 |
> | wholeSymbol      | 整数に使用する文字列。例: ' dollars'              |
> | wholePosition    | wholeSymbol の配置を 'before' または 'after' の   
>                     どちらにするか。                                   |
> | fractionSymbol   | 小数に使用する文字列。例: ' cents'                |
> | fractionPosition | fractionSymbol の配置を、'before' または 'after'  
>                     のどちらに配置するか。                             |
> | fractionExponent | 小数点以下の桁数。デフォルトは 2                  |
>
> 未定義の \$currency 値が指定された場合、 USD 形式の数値を返します。例:
>
> ``` php
> // NumberHelper として実行
> echo $this->Number->currency('1234.56', 'FOO');
>
> // 出力結果
> FOO 1,234.56
>
> // CakeNumber として実行
> App::uses('CakeNumber', 'Utility');
> echo CakeNumber::currency('1234.56', 'FOO');
> ```
>
> ::: info Changed in version 2.4
> `fractionExponent` オプションが追加されました。
> :::

> param string \$currency  
> `CakeNumber::currency()` のデフォルト通貨をセットします。
>
> デフォルトの通貨のゲッター・セッター。これで `CakeNumber::currency()` の通貨の指定を
> 省略できます。デフォルトを他の設定にすることで、すべての通貨の出力を変更します。
>
> ::: info Added in version 2.3
> このメソッドは 2.3 で追加されました。
> :::

> param string \$formatName  
> 将来使用するためのフォーマット名
>
> param array \$options  
> このフォーマットのオプション配列。 `CakeNumber::currency()`
> と同じ `$options` キーを使用してください。
>
> Number ヘルパーのための通貨フォーマットを追加します。通貨フォーマットをより簡単に
> 再利用できます。 :
>
> ``` php
> // NumberHelper として実行
> $this->Number->addFormat('BRL', array('before' => 'R$', 'thousands' => '.', 'decimals' => ','));
>
> // CakeNumber として実行
> App::uses('CakeNumber', 'Utility');
> CakeNumber::addFormat('BRL', array('before' => 'R$', 'thousands' => '.', 'decimals' => ','));
> ```
>
> これで、金額のフォーマット時に通貨のショート形式として <span class="title-ref">BRL</span> を使用できます。 :
>
> ``` php
> // NumberHelper として実行
> echo $this->Number->currency($value, 'BRL');
>
> // CakeNumber として実行
> App::uses('CakeNumber', 'Utility');
> echo CakeNumber::currency($value, 'BRL');
> ```
>
> 追加されたフォーマットは、以下のデフォルトとマージされます。 :
>
> ``` text
> array(
>     'wholeSymbol'      => '',
>     'wholePosition'    => 'before',
>     'fractionSymbol'   => false,
>     'fractionPosition' => 'after',
>     'zero'             => 0,
>     'places'           => 2,
>     'thousands'        => ',',
>     'decimals'         => '.',
>     'negative'         => '()',
>     'escape'           => true,
>     'fractionExponent' => 2
> )
> ```

> param float \$number  
> 変換する値
>
> param integer \$precision  
> 表示したい小数点以下の桁数
>
> このメソッドは指定された精度 (小数点以下) で数値を表示します。
> 定義された精度のレベルを維持するために丸めます。 :
>
> ``` php
> // NumberHelper として実行
> echo $this->Number->precision(456.91873645, 2);
>
> // 出力
> 456.92
>
> // CakeNumber として実行
> App::uses('CakeNumber', 'Utility');
> echo CakeNumber::precision(456.91873645, 2);
> ```

> param float \$number  
> 変換する値
>
> param integer \$precision  
> 表示したい小数点以下の桁数
>
> param array \$options  
> オプション、以下を参照
>
> | オプション | 説明                                             |
> |------------|--------------------------------------------------|
> | multiply   | 値を100で乗算しなければならないかどうかを示す    
>               Boolean 値です。少数のパーセンテージに便利です。  |
>
> このメソッドは precision() のように、与えられた精度に応じて
> (精度を満たすように丸めて) 数値をフォーマットします。このメソッドは
> パーセンテージとして数値を表現し、パーセント記号を追加して出力します。 :
>
> ``` php
> // NumberHelper として実行。出力結果: 45.69%
> echo $this->Number->toPercentage(45.691873645);
>
> // CakeNumber として実行。出力結果: 45.69%
> App::uses('CakeNumber', 'Utility');
> echo CakeNumber::toPercentage(45.691873645);
>
> // multiply を有効にして実行。 出力結果: 45.69%
> echo CakeNumber::toPercentage(0.45691, 2, array(
>     'multiply' => true
> ));
> ```
>
> ::: info Added in version 2.4
> `$options` 引数に `multiply` オプションが追加されました。
> :::

> param string \$size  
> 人が読める形式の値
>
> このメソッドは、人が読める形式のバイトサイズからバイトの整数値に変換します。
>
> ::: info Added in version 2.3
> このメソッドは 2.3 で追加されました。
> :::

> param string \$dataSize  
> 人が読める形式にしたいバイト数
>
> このメソッドはデータサイズを人が読める形式にフォーマットします。これは、バイト数を
> KB、MB、GB、および TB へ変換するための近道を提供します。サイズは、
> データのサイズに応じて小数点以下二桁の精度で表示されます。(例 大きいサイズの表現) :
>
> ``` php
> // NumberHelper として実行
> echo $this->Number->toReadableSize(0); // 0 Bytes
> echo $this->Number->toReadableSize(1024); // 1 KB
> echo $this->Number->toReadableSize(1321205.76); // 1.26 MB
> echo $this->Number->toReadableSize(5368709120); // 5.00 GB
>
> // CakeNumber として実行
> App::uses('CakeNumber', 'Utility');
> echo CakeNumber::toReadableSize(0); // 0 Bytes
> echo CakeNumber::toReadableSize(1024); // 1 KB
> echo CakeNumber::toReadableSize(1321205.76); // 1.26 MB
> echo CakeNumber::toReadableSize(5368709120); // 5.00 GB
> ```

> このメソッドは、あなたのビューの中で使用する数値の整形をより制御しやすくします。
> (そして、メインのメソッドとして他の NumberHelper メソッドによって使用されます。)
> 次のように、このメソッドを使用します。 :
>
> ``` php
> // NumberHelper として実行
> $this->Number->format($number, $options);
>
> // CakeNumber として実行
> CakeNumber::format($number, $options);
> ```
>
> \$number パラメータは、出力のために整形しようとしている数値です。
> \$options が未指定の場合、 1236.334 は、 1,236 と出力されます。
> デフォルトの精度は、小数点以下がゼロになることに注意してください。
>
> \$options パラメータは、このメソッドに存在している手品のタネの在りかです。
>
> - もし整数を渡した場合、この関数の精度もしくは小数点以下の桁数の値になります。
> - もし連想配列を渡した場合、以下のキーが使用できます。
>   - places (integer): 小数点以下の桁数
>   - before (string): 数値の前に表示する文字列
>   - escape (boolean): エスケープするかどうか
>   - decimals (string): 少数の区切りとして利用する文字列
>   - thousands (string): 千の位、100万の位、... の区切りとして利用する文字列
>
> 例:
>
> ``` php
> // NumberHelper として実行
> echo $this->Number->format('123456.7890', array(
>     'places' => 2,
>     'before' => '¥ ',
>     'escape' => false,
>     'decimals' => '.',
>     'thousands' => ','
> ));
> // 出力結果 '¥ 123,456.79'
>
> // CakeNumber として実行
> App::uses('CakeNumber', 'Utility');
> echo CakeNumber::format('123456.7890', array(
>     'places' => 2,
>     'before' => '¥ ',
>     'escape' => false,
>     'decimals' => '.',
>     'thousands' => ','
> ));
> // 出力結果 '¥ 123,456.79'
> ```

> このメソッドは、符号付きの数として値の差分を表示します。 :
>
> ``` php
> // NumberHelper として実行
> $this->Number->formatDelta($number, $options);
>
> // CakeNumber として実行
> CakeNumber::formatDelta($number, $options);
> ```
>
> \$number パラメータは、出力のために整形しようとしている数値です。
> \$options が未指定の場合、 1236.334 は、 1,236 と出力されます。
> デフォルトの精度は、小数点以下がゼロになることに注意してください。
>
> \$options パラメータは、 `CakeNumber::format()` と同じキーを持ちます。
>
> - places (integer): 小数点以下の桁数
> - before (string): 数値の前に表示する文字列
> - escape (boolean): エスケープするかどうか
> - decimals (string): 少数の区切りとして利用する文字列
> - thousands (string): 千、100万、... の区切りとして利用する文字列
>
> 例:
>
> ``` php
> // NumberHelper として実行
> echo $this->Number->formatDelta('123456.7890', array(
>     'places' => 2,
>     'decimals' => '.',
>     'thousands' => ','
> ));
> // 出力結果 '+123,456.79'
>
> // CakeNumber として実行
> App::uses('CakeNumber', 'Utility');
> echo CakeNumber::formatDelta('123456.7890', array(
>     'places' => 2,
>     'decimals' => '.',
>     'thousands' => ','
> ));
> // 出力結果 '+123,456.79'
> ```
>
> ::: info Added in version 2.3
> このメソッドは 2.3 で追加されました。
> :::

> [!WARNING]
> 2.4 から、シンボルは UTF-8 になりました。もし、非 UTF-8 アプリを実行する場合、
> 詳しくは移行ガイドをご覧ください。
