..
  Number

ナンバー
########

.. php:namespace:: Cake\I18n

.. php:class:: Number

..
  If you need :php:class:`NumberHelper` functionalities outside of a ``View``,
  use the ``Number`` class::
..
                // Notify users of quota
                $this->Flash->success(__('You are using {0} storage', Number::toReadableSize($storageUsed)));

あなたが ``View`` の外で :php:class:`NumberHelper` 機能が必要な場合、
``Number`` クラスを次のように使います::

    namespace App\Controller;

    use Cake\I18n\Number;

    class UsersController extends AppController
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Auth');
        }

        public function afterLogin()
        {
            $storageUsed = $this->Auth->user('storage_used');
            if ($storageUsed > 5000000) {
                //  割り当てられたusersに通知
                $this->Flash->success(__('あなたは {0} ストレージを使用しています', Number::toReadableSize($storageUsed)));
            }
        }
    }

.. start-cakenumber

..
  All of these functions return the formatted number; they do not
  automatically echo the output into the view.

これらの全ての機能は、整形された数値を返します。これらは自動的にビューに出力を表示しません。

..
  Formatting Currency Values

通貨フォーマット
================

.. php:method:: currency(mixed $value, string $currency = null, array $options = [])

..
  This method is used to display a number in common currency formats
  (EUR, GBP, USD). Usage in a view looks like::
..
    // Called as NumberHelper
    // Called as Number

このメソッドは、共通通貨フォーマット（ユーロ、英ポンド、米ドル）で数値を表示するために使用されます。
ビュー内で次のように使います::

    // NumberHelperとしてコール
    echo $this->Number->currency($value, $currency);

    // Numberとしてコール
    echo Number::currency($value, $currency);

..
  The first parameter, ``$value``, should be a floating point number
  that represents the amount of money you are expressing. The second
  parameter is a string used to choose a predefined currency formatting
  scheme:
..
  | $currency           | 1234.56, formatted by currency type                |

一番目のパラメータ、 ``$value`` は、合計金額をあらわす浮動小数点数でなければいけません。
二番目のパラメータは、事前定義された通貨フォーマット方式を選択するための文字列です:

+---------------------+----------------------------------------------------+
| $currency           | 通貨の種類によってフォーマットされた 1234.56       |
+=====================+====================================================+
| EUR                 | €1.234,56                                          |
+---------------------+----------------------------------------------------+
| GBP                 | £1,234.56                                          |
+---------------------+----------------------------------------------------+
| USD                 | $1,234.56                                          |
+---------------------+----------------------------------------------------+

..
  The third parameter is an array of options for further defining the
  output. The following options are available:

三番目のパラメータは、出力を定義するためのオプションの配列です。
次のオプションが用意されています:

..
  +---------------------+----------------------------------------------------+
  | Option              | Description                                        |
  +=====================+====================================================+
  | before              | Text to display before the rendered number.        |
  +---------------------+----------------------------------------------------+
  | after               | Text to display before the rendered number.        |
  +---------------------+----------------------------------------------------+
  | zero                | The text to use for zero values; can be a string   |
  |                     | or a number. ie. 0, 'Free!'.                       |
  +---------------------+----------------------------------------------------+
  | places              | Number of decimal places to use, ie. 2             |
  +---------------------+----------------------------------------------------+
  | precision           | Maximal number of decimal places to use, ie. 2     |
  +---------------------+----------------------------------------------------+
  | locale              | The locale name to use for formatting number,      |
  |                     | ie. "fr_FR".                                       |
  +---------------------+----------------------------------------------------+
  | fractionSymbol      | String to use for fraction numbers, ie. ' cents'.  |
  +---------------------+----------------------------------------------------+
  | fractionPosition    | Either 'before' or 'after' to place the fraction   |
  |                     | symbol.                                            |
  +---------------------+----------------------------------------------------+
  | pattern             | An ICU number pattern to use for formatting the    |
  |                     | number ie. #,###.00                                |
  +---------------------+----------------------------------------------------+
  | useIntlCode         | Set to ``true`` to replace the currency symbol     |
  |                     | with the international currency code.              |
  +---------------------+----------------------------------------------------+

+---------------------+----------------------------------------------------+
| オプション          | 説明                                               |
+=====================+====================================================+
| before              | レンダリングされた数値の前に表示されるテキスト。   |
+---------------------+----------------------------------------------------+
| after               | レンダリングされた数値の後に表示されるテキスト。   |
+---------------------+----------------------------------------------------+
| zero                | ゼロ値の場合に使用するテキストで、                 |
|                     | 文字列か数値で指定できます。例. 0, '無料!'         |
+---------------------+----------------------------------------------------+
| places              | 小数点以下の桁数を指定します。例. 2                |
+---------------------+----------------------------------------------------+
| precision           | 小数点以下の最大桁数を指定します。例. 2            |
+---------------------+----------------------------------------------------+
| locale              | 数値フォーマットに使用するロケール名。             |
|                     | 例. "fr_FR".                                       |
+---------------------+----------------------------------------------------+
| fractionSymbol      | 小数に使用する文字列。例. ' cents'                 |
+---------------------+----------------------------------------------------+
| fractionPosition    | fractionSymbolで指定した文字列を、小数の           |
|                     | 'before' または 'after' のどちらに配置するか。     |
+---------------------+----------------------------------------------------+
| pattern             | 数値のフォーマットに使用するICU数値パターン。      |
|                     | 例. #,###.00                                       |
+---------------------+----------------------------------------------------+
| useIntlCode         | 通貨記号を国際通貨コードに置き換えるために         |
|                     | ``true`` を指定する。                              |
+---------------------+----------------------------------------------------+

..
  If $currency value is ``null``, the default currency will be retrieved from
  :php:meth:`Cake\\I18n\\Number::defaultCurrency()`

$currency の値が ``null`` の場合、デフォルト通貨は :php:meth:`Cake\\I18n\\Number::defaultCurrency()` によって設定されます。

..
  Setting the Default Currency

デフォルト通貨の設定
====================

.. php:method:: defaultCurrency($currency)

..
  Setter/getter for the default currency. This removes the need to always pass the
  currency to :php:meth:`Cake\\I18n\\Number::currency()` and change all
  currency outputs by setting other default. If ``$currency`` is set to ``false``,
  it will clear the currently stored value. By default, it will retrieve the
  ``intl.default_locale`` if set and 'en_US' if not.

デフォルト通貨のためのsetter/getterです。これは、常に :php:meth:`Cake\\I18n\\Number::currency()` に通貨を渡したり、
他のデフォルトを設定することによって全ての通貨の出力を変更したりする必要がなくなります。
``$currency`` に ``false`` が設定された場合、現在格納されている値をクリアします。
``$currency`` が設定されていない場合、デフォルトでは、 ``intl.default_locale`` の値、設定されていない場合 'en_US' を設定します。

..
  Formatting Floating Point Numbers

浮動小数点数フォーマット
========================

.. php:method:: precision(float $value, int $precision = 3, array $options = [])

..
  This method displays a number with the specified amount of
  precision (decimal places). It will round in order to maintain the
  level of precision defined. ::
..
    // Called as NumberHelper
    // Outputs
    // Called as Number

このメソッドは指定された精度(小数点以下)で数値を表示します。
定義された精度のレベルを維持するために丸めます。 ::

    // NumberHelperとしてコール
    echo $this->Number->precision(456.91873645, 2);

    // 出力
    456.92

    // Numberとしてコール
    echo Number::precision(456.91873645, 2);

..
  Formatting Percentages

パーセンテージフォーマット
==========================

.. php:method:: toPercentage(mixed $value, int $precision = 2, array $options = [])

..
  +---------------------+----------------------------------------------------+
  | Option              | Description                                        |
  +=====================+====================================================+
  | multiply            | Boolean to indicate whether the value has to be    |
  |                     | multiplied by 100. Useful for decimal percentages. |
  +---------------------+----------------------------------------------------+

+---------------------+----------------------------------------------------+
| オプション          | 説明                                               |
+=====================+====================================================+
| multiply            | 値を100で乗算しなければならないかどうかを示す      |
|                     | Boolean値です。少数のパーセンテージに便利です。    |
+---------------------+----------------------------------------------------+

..
  Like :php:meth:`Cake\\I18n\\Number::precision()`, this method formats a number
  according to the supplied precision (where numbers are rounded to meet the
  given precision). This method also expresses the number as a percentage
  and appends the output with a percent sign. ::
..
    // Called as NumberHelper. Output: 45.69%
    // Called as Number. Output: 45.69%
    // Called with multiply. Output: 45.7%

このメソッドは :php:meth:`Cake\\I18n\\Number::precision()` のように、
与えられた精度に応じて(精度を満たすように丸めて)数値をフォーマットします。
このメソッドはパーセンテージとして数値を表現し、パーセント記号を追加して出力します。 ::

    // NumberHelperとしてコール。 出力: 45.69%
    echo $this->Number->toPercentage(45.691873645);

    // Numberとしてコール。 出力: 45.69%
    echo Number::toPercentage(45.691873645);

    // multiplyオプションとともにコール。 出力: 45.7%
    echo Number::toPercentage(0.45691, 1, [
        'multiply' => true
    ]);

..
  Interacting with Human Readable Values

人が読める形式の値との相互作用
==============================

.. php:method:: toReadableSize(string $size)

..
  This method formats data sizes in human readable forms. It provides
  a shortcut way to convert bytes to KB, MB, GB, and TB. The size is
  displayed with a two-digit precision level, according to the size
  of data supplied (i.e. higher sizes are expressed in larger
  terms)::
..
    // Called as NumberHelper
    // Called as Number

このメソッドはデータサイズを人が読める形式にフォーマットします。
これは、バイト数をKB、MB、GB、およびTBへ変換するための近道を提供します。
サイズは、データのサイズに応じて小数点以下二桁の精度で表示されます。(例 大きいサイズの表現)::

    // NumberHelperとしてコール
    echo $this->Number->toReadableSize(0); // 0 Byte
    echo $this->Number->toReadableSize(1024); // 1 KB
    echo $this->Number->toReadableSize(1321205.76); // 1.26 MB
    echo $this->Number->toReadableSize(5368709120); // 5 GB

    // Numberとしてコール
    echo Number::toReadableSize(0); // 0 Byte
    echo Number::toReadableSize(1024); // 1 KB
    echo Number::toReadableSize(1321205.76); // 1.26 MB
    echo Number::toReadableSize(5368709120); // 5 GB

..
  Formatting Numbers

数字の整形
==========

.. php:method:: format(mixed $value, array $options = [])

..
  This method gives you much more control over the formatting of
  numbers for use in your views (and is used as the main method by
  most of the other NumberHelper methods). Using this method might
  looks like::
..
    // Called as NumberHelper
    // Called as Number

このメソッドは、ビューで使うための数値のフォーマットより、
もっと自由に制御できます。(およびその他のNumberHelperのほとんどのメソッドが使用できます。)
このメソッドは以下のように使用します::

    // NumberHelperとしてコール
    $this->Number->format($value, $options);

    // Numberとしてコール
    Number::format($value, $options);

..
  The ``$value`` parameter is the number that you are planning on
  formatting for output. With no ``$options`` supplied, the number
  1236.334 would output as 1,236. Note that the default precision is
  zero decimal places.

``$value`` パラメーターは、フォーマットして出力したい数値です。
``$options`` が与えられないと、1236.334という数値は1,236として出力されるでしょう。
デフォルトの制度は1の位であることに注意してください。

..
  The ``$options`` parameter is where the real magic for this method
  resides.

``$options`` パラメーターはこのメソッド

-  If you pass an integer then this becomes the amount of precision
   or places for the function.
-  If you pass an associated array, you can use the following keys:

..
  +---------------------+----------------------------------------------------+
  | Option              | Description                                        |
  +=====================+====================================================+
  | places              | Number of decimal places to use, ie. 2             |
  +---------------------+----------------------------------------------------+
  | precision           | Maximum number of decimal places to use, ie. 2     |
  +---------------------+----------------------------------------------------+
  | pattern             | An ICU number pattern to use for formatting the    |
  |                     | number ie. #,###.00                                |
  +---------------------+----------------------------------------------------+
  | locale              | The locale name to use for formatting number,      |
  |                     | ie. "fr_FR".                                       |
  +---------------------+----------------------------------------------------+
  | before              | Text to display before the rendered number.        |
  +---------------------+----------------------------------------------------+
  | after               | Text to display after the rendered number.         |
  +---------------------+----------------------------------------------------+

+---------------------+----------------------------------------------------+
| オプション          | 説明                                               |
+=====================+====================================================+
| places              | 小数点以下の桁数を指定します。例. 2                |
+---------------------+----------------------------------------------------+
| precision           | 小数点以下の最大桁数を指定します。例. 2            |
+---------------------+----------------------------------------------------+
| pattern             | 数値のフォーマットに使用するICU数値パターン。      |
|                     | 例. #,###.00                                       |
+---------------------+----------------------------------------------------+
| locale              | 数値フォーマットに使用するロケール名。             |
|                     | 例. "fr_FR".                                       |
+---------------------+----------------------------------------------------+
| before              | レンダリングされた数値の前に表示されるテキスト。   |
+---------------------+----------------------------------------------------+
| after               | レンダリングされた数値の後に表示されるテキスト。   |
+---------------------+----------------------------------------------------+

Example::

    // Called as NumberHelper
    echo $this->Number->format('123456.7890', [
        'places' => 2,
        'before' => '¥ ',
        'after' => ' !'
    ]);
    // Output '¥ 123,456.79 !'

    echo $this->Number->format('123456.7890', [
        'locale' => 'fr_FR'
    ]);
    // Output '123 456,79 !'

    // Called as Number
    echo Number::format('123456.7890', [
        'places' => 2,
        'before' => '¥ ',
        'after' => ' !'
    ]);
    // Output '¥ 123,456.79 !'

    echo Number::format('123456.7890', [
        'locale' => 'fr_FR'
    ]);
    // Output '123 456,79 !'

.. php:method:: ordinal(mixed $value, array $options = [])

This method will output an ordinal number.

Examples::

    echo Number::ordinal(1);
    // Output '1st'

    echo Number::ordinal(2);
    // Output '2nd'

    echo Number::ordinal(2, [
        'locale' => 'fr_FR'
    ]);
    // Output '2e'

    echo Number::ordinal(410);
    // Output '410th'

..
  Format Differences

フォーマットの差
================

.. php:method:: formatDelta(mixed $value, array $options = [])

..
  This method displays differences in value as a signed number::
..
    // Called as NumberHelper
    // Called as Number

このメソッドは、符号付き整数としての値の差を表示します。::

    // NumberHelperとしてコール
    $this->Number->formatDelta($value, $options);

    // Numberとしてコール
    Number::formatDelta($value, $options);

..
  The ``$value`` parameter is the number that you are planning on
  formatting for output. With no ``$options`` supplied, the number
  1236.334 would output as 1,236. Note that the default precision is
  zero decimal places.

``$value`` パラメーターは、フォーマットして出力したい数値です。
``$options`` が与えられないと、1236.334という数値は1,236として出力されるでしょう。
デフォルトの制度は1の位であることに注意してください。

..
  The ``$options`` parameter takes the same keys as :php:meth:`Number::format()` itself:

``$options`` パラメーターは :php:meth:`Number::format()` と同じキーを取ります。:

..
  +---------------------+----------------------------------------------------+
  | Option              | Description                                        |
  +=====================+====================================================+
  | places              | Number of decimal places to use, ie. 2             |
  +---------------------+----------------------------------------------------+
  | precision           | Maximum number of decimal places to use, ie. 2     |
  +---------------------+----------------------------------------------------+
  | locale              | The locale name to use for formatting number,      |
  |                     | ie. "fr_FR".                                       |
  +---------------------+----------------------------------------------------+
  | before              | Text to display before the rendered number.        |
  +---------------------+----------------------------------------------------+
  | after               | Text to display after the rendered number.         |
  +---------------------+----------------------------------------------------+

+---------------------+----------------------------------------------------+
| オプション          | 説明                                               |
+=====================+====================================================+
| places              | 小数点以下の桁数を指定します。例. 2                |
+---------------------+----------------------------------------------------+
| precision           | 小数点以下の最大桁数を指定します。例. 2            |
+---------------------+----------------------------------------------------+
| locale              | 数値フォーマットに使用するロケール名。             |
|                     | 例. "fr_FR".                                       |
+---------------------+----------------------------------------------------+
| before              | レンダリングされた数値の前に表示されるテキスト。   |
+---------------------+----------------------------------------------------+
| after               | レンダリングされた数値の後に表示されるテキスト。   |
+---------------------+----------------------------------------------------+

..
  Example::
..
    // Called as NumberHelper
    // Output '[+123,456.79]'
    // Called as Number
    // Output '[+123,456.79]'

例::

    // NumberHelperとしてコール
    echo $this->Number->formatDelta('123456.7890', [
        'places' => 2,
        'before' => '[',
        'after' => ']'
    ]);
    // 出力 '[+123,456.79]'

    // Numberとしてコール
    echo Number::formatDelta('123456.7890', [
        'places' => 2,
        'before' => '[',
        'after' => ']'
    ]);
    // 出力 '[+123,456.79]'

.. end-cakenumber

..
  Configure formatters

フォーマッタ設定
================

.. php:method:: config(string $locale, int $type = NumberFormatter::DECIMAL, array $options = [])

..
  This method allows you to configure formatter defaults which persist across calls
  to various methods.

このメソッドを使用すると、様々なメソッドの呼び出し間で持続的なフォーマッタのデフォルトを設定することができます。

..
  Example::

例::

    Number::config('en_IN', \NumberFormatter::CURRENCY, [
        'pattern' => '#,##,##0'
    ]);

.. meta::
:title lang=en: NumberHelper
    :description lang=en: The Number Helper contains convenience methods that enable display numbers in common formats in your views.
        :keywords lang=en: number helper,currency,number format,number precision,format file size,format numbers
