# Number

`class` Cake\\I18n\\**Number**

あなたが `View` の外で `NumberHelper` 機能が必要な場合、
`Number` クラスを次のように使います。 :

``` php
namespace App\Controller;

use Cake\I18n\Number;

class UsersController extends AppController
{
    public function initialize(): void
    {
        parent::initialize();
        $this->loadComponent('Auth');
    }

    public function afterLogin()
    {
        $storageUsed = $this->Auth->user('storage_used');
        if ($storageUsed > 5000000) {
            // 割り当てられた users に通知
            $this->Flash->success(__('あなたは {0} ストレージを使用しています', Number::toReadableSize($storageUsed)));
        }
    }
}
```

<!-- start-cakenumber -->

以下の全ての機能は、整形された数値を返します。これらは自動的にビューに出力を表示しません。

## 通貨フォーマット

`method` Cake\\I18n\\Number::**currency**(mixed $value, string $currency = null, array $options = [])

このメソッドは、共通通貨フォーマット（ユーロ、英ポンド、米ドル）で数値を表示するために使用されます。
ビュー内で次のように使います。 :

``` php
// NumberHelper としてコール
echo $this->Number->currency($value, $currency);

// Number としてコール
echo Number::currency($value, $currency);
```

1つ目のパラメーター `$value` は、合計金額をあらわす浮動小数点数でなければいけません。
2つ目のパラメーターは、あらかじめ定義された通貨フォーマット方式を選択するための文字列です。

| \$currency | 通貨の種類によってフォーマットされた 1234.56 |
|------------|----------------------------------------------|
| EUR        | €1.234,56                                    |
| GBP        | £1,234.56                                    |
| USD        | \$1,234.56                                   |

3つ目のパラメーターは、出力を定義するためのオプションの配列です。
次のオプションが用意されています。

| オプション | 説明 |
|----|----|
| before | レンダリングされた数値の前に表示されるテキスト。 |
| after | レンダリングされた数値の後に表示されるテキスト。 |
| zero | ゼロ値の場合に使用するテキストで、 文字列か数値で指定できます。例. 0, '無料!' |
| places | 小数点以下の桁数を指定します。例. 2 |
| precision | 小数点以下の最大桁数を指定します。例. 2 |
| locale | 数値フォーマットに使用するロケール名。 例. "fr_FR". |
| fractionSymbol | 小数に使用する文字列。例. ' cents' |
| fractionPosition | fractionSymbol で指定した文字列を、小数の 'before' または 'after' のどちらに配置するか。 |
| pattern | 数値のフォーマットに使用する ICU 数値パターン。 例. \#,###.00 |
| useIntlCode | 通貨記号を国際通貨コードに置き換えるために `true` を指定する。 |

\$currency の値が `null` の場合、デフォルト通貨は `Cake\I18n\Number::defaultCurrency()` によって設定されます。

## デフォルト通貨の設定

`method` Cake\\I18n\\Number::**defaultCurrency**($currency)

デフォルト通貨のための setter/getter です。これによって、常に `Cake\I18n\Number::currency()` に通貨を渡したり、
他のデフォルトを設定することによって全ての通貨の出力を変更したりする必要がなくなります。
`$currency` に `false` が設定された場合、現在格納されている値をクリアします。
デフォルトでは、設定されていれば `intl.default_locale` を取得し、そうでない場合は 'en_US' を設定します。

## 浮動小数点数フォーマット

`method` Cake\\I18n\\Number::**precision**(float $value, int $precision = 3, array $options = [])

このメソッドは指定された精度(小数点以下)で数値を表示します。
定義された精度のレベルを維持するために丸めます。 :

``` php
// NumberHelper としてコール
echo $this->Number->precision(456.91873645, 2);

// 出力
456.92

// Number としてコール
echo Number::precision(456.91873645, 2);
```

## パーセンテージフォーマット

`method` Cake\\I18n\\Number::**toPercentage**(mixed $value, int $precision = 2, array $options = [])

| オプション | 説明 |
|----|----|
| multiply | 値を 100 で乗算しなければならないかどうかを示す Boolean 値です。少数のパーセンテージに便利です。 |

このメソッドは `Cake\I18n\Number::precision()` のように、
与えられた精度に応じて(精度を満たすように丸めて)数値をフォーマットします。
このメソッドはパーセンテージとして数値を表現し、パーセント記号を追加して出力します。 :

``` php
// NumberHelper としてコール。 出力: 45.69%
echo $this->Number->toPercentage(45.691873645);

// Number としてコール。 出力: 45.69%
echo Number::toPercentage(45.691873645);

// multiply オプションとともにコール。 出力: 45.7%
echo Number::toPercentage(0.45691, 1, [
    'multiply' => true
]);
```

## 人が読める形式の値との相互作用

`method` Cake\\I18n\\Number::**toReadableSize**(string $size)

このメソッドはデータサイズを人が読める形式に整形します。
これは、バイト数を KB、MB、GB、および TB へ変換するための近道を提供します。
サイズは、データのサイズに応じて小数点以下二桁の精度で表示されます。(例 大きいサイズの表現):

``` php
// NumberHelper としてコール
echo $this->Number->toReadableSize(0); // 0 Byte
echo $this->Number->toReadableSize(1024); // 1 KB
echo $this->Number->toReadableSize(1321205.76); // 1.26 MB
echo $this->Number->toReadableSize(5368709120); // 5 GB

// Number としてコール
echo Number::toReadableSize(0); // 0 Byte
echo Number::toReadableSize(1024); // 1 KB
echo Number::toReadableSize(1321205.76); // 1.26 MB
echo Number::toReadableSize(5368709120); // 5 GB
```

## 数字の整形

`method` Cake\\I18n\\Number::**format**(mixed $value, array $options = [])

このメソッドは、ビューで使うための数値の整形をより制御しやすくします。
(および、メインのメソッドとして、NumberHelper のその他のほとんどのメソッドから使用されます。)
このメソッドは以下のように使用します。 :

``` php
// NumberHelper としてコール
$this->Number->format($value, $options);

// Number としてコール
Number::format($value, $options);
```

`$value` パラメーターは、出力のために整形しようとしている数値です。
`$options` が未指定の場合、1236.334 という数値は 1,236 として出力されるでしょう。
デフォルトの制度は1の位であることに注意してください。

`$options` パラメーターはこのメソッドに存在している手品のタネの在りかです。

- もし整数を渡した場合、精度もしくは小数点以下の桁数になります。
- もし連想配列を渡した場合、以下のキーが使用できます。

| オプション | 説明                                                          |
|------------|---------------------------------------------------------------|
| places     | 小数点以下の桁数を指定します。例. 2                           |
| precision  | 小数点以下の最大桁数を指定します。例. 2                       |
| pattern    | 数値のフォーマットに使用する ICU 数値パターン。 例. \#,###.00 |
| locale     | 数値フォーマットに使用するロケール名。 例. "fr_FR".           |
| before     | レンダリングされた数値の前に表示されるテキスト。              |
| after      | レンダリングされた数値の後に表示されるテキスト。              |

例:

``` php
// NumberHelper としてコール
echo $this->Number->format('123456.7890', [
    'places' => 2,
    'before' => '¥ ',
    'after' => ' !'
]);
// 出力 '¥ 123,456.79 !'

echo $this->Number->format('123456.7890', [
    'locale' => 'fr_FR'
]);
// 出力 '123 456,79 !'

// Number としてコール
echo Number::format('123456.7890', [
    'places' => 2,
    'before' => '¥ ',
    'after' => ' !'
]);
// 出力 '¥ 123,456.79 !'

echo Number::format('123456.7890', [
    'locale' => 'fr_FR'
]);
// 出力 '123 456,79 !'
```

`method` Cake\\I18n\\Number::**ordinal**(mixed $value, array $options = [])

このメソッドは序数を出力します。

例:

``` php
echo Number::ordinal(1);
// 出力 '1st'

echo Number::ordinal(2);
// 出力 '2nd'

echo Number::ordinal(2, [
    'locale' => 'fr_FR'
]);
// 出力 '2e'

echo Number::ordinal(410);
// 出力 '410th'
```

## 差分フォーマット

`method` Cake\\I18n\\Number::**formatDelta**(mixed $value, array $options = [])

このメソッドは、符号付きの数として値の差分を表示します。 :

``` php
// NumberHelper としてコール
$this->Number->formatDelta($value, $options);

// Number としてコール
Number::formatDelta($value, $options);
```

`$value` パラメーターは、出力のために整形しようとしている数値です。
`$options` が未指定の場合、1236.334 という数値は 1,236 として出力されるでしょう。
デフォルトの制度は1の位であることに注意してください。

`$options` パラメーターは `Number::format()` と同じキーを取ります。

| オプション | 説明                                                |
|------------|-----------------------------------------------------|
| places     | 小数点以下の桁数を指定します。例. 2                 |
| precision  | 小数点以下の最大桁数を指定します。例. 2             |
| locale     | 数値フォーマットに使用するロケール名。 例. "fr_FR". |
| before     | レンダリングされた数値の前に表示されるテキスト。    |
| after      | レンダリングされた数値の後に表示されるテキスト。    |

例:

``` php
// NumberHelper としてコール
echo $this->Number->formatDelta('123456.7890', [
    'places' => 2,
    'before' => '[',
    'after' => ']'
]);
// 出力 '[+123,456.79]'

// Number としてコール
echo Number::formatDelta('123456.7890', [
    'places' => 2,
    'before' => '[',
    'after' => ']'
]);
// 出力 '[+123,456.79]'
```

<!-- end-cakenumber -->

## フォーマッター設定

`method` Cake\\I18n\\Number::**config**(string $locale, int $type = NumberFormatter::DECIMAL, array $options = [])

このメソッドを使用すると、様々なメソッドの呼び出し間で持続的なフォーマッターのデフォルトを設定することができます。

例:

``` php
Number::config('en_IN', \NumberFormatter::CURRENCY, [
    'pattern' => '#,##,##0'
]);
```
