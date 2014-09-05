Number
######

.. php:namespace:: Cake\I18n

.. php:class:: Number

If you need :php:class:`NumberHelper` functionalities outside of a ``View``,
use the ``Number`` class::

    namespace App\Controller;

    use Cake\I18n\Number;

    class UsersController extends AppController {

        public $components = array('Auth');

        public function afterLogin() {
            $storageUsed = $this->Auth->user('storage_used');
            if ($storageUsed > 5000000) {
                // Notify users of quota
                $this->Flash->success(__('You are using %s storage', Number::toReadableSize($storageUsed)));
            }
        }
    }

.. start-cakenumber

All of these functions return the formatted number; They do not
automatically echo the output into the view.

Formatting Currency Values
==========================

.. php:method:: currency(mixed $number, string $currency = 'USD', array $options = array())

This method is used to display a number in common currency formats
(EUR, GBP, USD). Usage in a view looks like::

    // Called as NumberHelper
    echo $this->Number->currency($number, $currency);

    // Called as Number
    echo Number::currency($number, $currency);

The first parameter, $number, should be a floating point number
that represents the amount of money you are expressing. The second
parameter is used to choose a predefined currency formatting
scheme:

+---------------------+----------------------------------------------------+
| $currency           | 1234.56, formatted by currency type                |
+=====================+====================================================+
| EUR                 | €1.234,56                                          |
+---------------------+----------------------------------------------------+
| GBP                 | £1,234.56                                          |
+---------------------+----------------------------------------------------+
| USD                 | $1,234.56                                          |
+---------------------+----------------------------------------------------+

The third parameter is an array of options for further defining the
output. The following options are available:

+---------------------+----------------------------------------------------+
| Option              | Description                                        |
+=====================+====================================================+
| before              | The currency symbol to place before whole numbers  |
|                     | ie. '$'                                            |
+---------------------+----------------------------------------------------+
| after               | The currency symbol to place after decimal numbers |
|                     | ie. 'c'. Set to boolean ``false`` to use no        |
|                     | decimal symbol. eg. 0.35 => $0.35.                 |
+---------------------+----------------------------------------------------+
| zero                | The text to use for zero values, can be a string or|
|                     | a number. ie. 0, 'Free!'.                          |
+---------------------+----------------------------------------------------+
| places              | Number of decimal places to use, ie. 2             |
+---------------------+----------------------------------------------------+
| thousands           | Thousands separator, ie. ','                       |
+---------------------+----------------------------------------------------+
| decimals            | Decimal separator symbol, ie. '.'                  |
+---------------------+----------------------------------------------------+
| negative            | Symbol for negative numbers. If equal to '()', the |
|                     | number will be wrapped with ( and ).               |
+---------------------+----------------------------------------------------+
| escape              | Should the output be htmlentity escaped? Defaults  |
|                     | to ``true``.                                       |
+---------------------+----------------------------------------------------+
| wholeSymbol         | String to use for whole numbers, ie. ' dollars'.   |
+---------------------+----------------------------------------------------+
| wholePosition       | Either 'before' or 'after' to place the whole      |
|                     | symbol.                                            |
+---------------------+----------------------------------------------------+
| fractionSymbol      | String to use for fraction numbers, ie. ' cents'.  |
+---------------------+----------------------------------------------------+
| fractionPosition    | Either 'before' or 'after' to place the fraction   |
|                     | symbol.                                            |
+---------------------+----------------------------------------------------+
| fractionExponent    | Fraction exponent of this specific currency.       |
|                     | Defaults to 2.                                     |
+---------------------+----------------------------------------------------+

If a non-recognized $currency value is supplied, it is prepended to
a USD formatted number. For example::

    // Called as NumberHelper
    echo $this->Number->currency('1234.56', 'FOO');

    // Outputs
    FOO 1,234.56

    // Called as Number
    echo Number::currency('1234.56', 'FOO');

Setting the Default Currency
============================

.. php:method:: defaultCurrency(string $currency)

Setter/getter for the default currency. This removes the need to always pass the
currency to :php:meth:`Cake\\I18n\\Number::currency()` and change all
currency outputs by setting other default.

Adding a New Currency
=====================

.. php:method:: addFormat(string $formatName, array $options)

Add a currency format to the Number helper. Makes reusing
currency formats easier::

    // Called as NumberHelper
    $this->Number->addFormat('BRL', array('before' => 'R$', 'thousands' => '.', 'decimals' => ','));

    // Called as Number
    Number::addFormat('BRL', array('before' => 'R$', 'thousands' => '.', 'decimals' => ','));

You can now use `BRL` as a short form when formatting currency amounts::

    // Called as NumberHelper
    echo $this->Number->currency($value, 'BRL');

    // Called as Number
    echo Number::currency($value, 'BRL');

Added formats are merged with the following defaults::

   array(
       'wholeSymbol'      => '',
       'wholePosition'    => 'before',
       'fractionSymbol'   => false,
       'fractionPosition' => 'after',
       'zero'             => 0,
       'places'           => 2,
       'thousands'        => ',',
       'decimals'         => '.',
       'negative'         => '()',
       'escape'           => true,
       'fractionExponent' => 2
   )

Formatting Floating Point Numbers
=================================

.. php:method:: precision(mixed $number, int $precision = 3)

This method displays a number with the specified amount of
precision (decimal places). It will round in order to maintain the
level of precision defined.::

    // Called as NumberHelper
    echo $this->Number->precision(456.91873645, 2);

    // Outputs
    456.92

    // Called as Number
    echo Number::precision(456.91873645, 2);


Formatting Percentages
======================

.. php:method:: toPercentage(mixed $number, int $precision = 2, array $options = array())

+---------------------+----------------------------------------------------+
| Option              | Description                                        |
+=====================+====================================================+
| multiply            | Boolean to indicate whether the value has to be    |
|                     | multiplied by 100. Useful for decimal percentages. |
+---------------------+----------------------------------------------------+

Like ``precision()``, this method formats a number according to the
supplied precision (where numbers are rounded to meet the given
precision). This method also expresses the number as a percentage
and prepends the output with a percent sign.::

    // Called as NumberHelper. Output: 45.69%
    echo $this->Number->toPercentage(45.691873645);

    // Called as Number. Output: 45.69%
    echo Number::toPercentage(45.691873645);

    // Called with multiply. Output: 45.69%
    echo Number::toPercentage(0.45691, 2, array(
        'multiply' => true
    ));


Interacting with Human Readable Values
======================================

.. php:method:: fromReadableSize(string $size, $default)

This method unformats a number from a human readable byte size
to an integer number of bytes::

    $int = Number::fromReadableSize('2GB');

.. php:method:: toReadableSize(string $dataSize)

This method formats data sizes in human readable forms. It provides
a shortcut way to convert bytes to KB, MB, GB, and TB. The size is
displayed with a two-digit precision level, according to the size
of data supplied (i.e. higher sizes are expressed in larger
terms)::

    // Called as NumberHelper
    echo $this->Number->toReadableSize(0); // 0 Bytes
    echo $this->Number->toReadableSize(1024); // 1 KB
    echo $this->Number->toReadableSize(1321205.76); // 1.26 MB
    echo $this->Number->toReadableSize(5368709120); // 5.00 GB

    // Called as CakeNumber
    echo Number::toReadableSize(0); // 0 Bytes
    echo Number::toReadableSize(1024); // 1 KB
    echo Number::toReadableSize(1321205.76); // 1.26 MB
    echo Number::toReadableSize(5368709120); // 5.00 GB

Formatting Numbers
==================

.. php:method:: format(mixed $number, array $options = [])

This method gives you much more control over the formatting of
numbers for use in your views (and is used as the main method by
most of the other NumberHelper methods). Using this method might
looks like::

    // Called as NumberHelper
    $this->Number->format($number, $options);

    // Called as Number
    Number::format($number, $options);

The $number parameter is the number that you are planning on
formatting for output. With no $options supplied, the number
1236.334 would output as 1,236. Note that the default precision is
zero decimal places.

The ``$options`` parameter is where the real magic for this method
resides.

-  If you pass an integer then this becomes the amount of precision
   or places for the function.
-  If you pass an associated array, you can use the following keys:

   - places (integer): the amount of desired precision
   - before (string): to be put before the outputted number
   - escape (boolean): if you want the value in before to be escaped
   - decimals (string): used to delimit the decimal places in a
     number
   - thousands (string): used to mark off thousand, millions, …
     places

Example::

    // Called as NumberHelper
    echo $this->Number->format('123456.7890', array(
        'places' => 2,
        'before' => '¥ ',
        'escape' => false,
        'decimals' => '.',
        'thousands' => ','
    ));
    // Output '¥ 123,456.79'

    // Called as Number
    echo Number::format('123456.7890', array(
        'places' => 2,
        'before' => '¥ ',
        'escape' => false,
        'decimals' => '.',
        'thousands' => ','
    ));
    // Output '¥ 123,456.79'


Format Differences
==================

.. php:method:: formatDelta(mixed $number, mixed $options=array())

This method displays differences in value as a signed number::

    // Called as NumberHelper
    $this->Number->formatDelta($number, $options);

    // Called as CakeNumber
    Number::formatDelta($number, $options);

The $number parameter is the number that you are planning on
formatting for output. With no $options supplied, the number
1236.334 would output as 1,236. Note that the default precision is
zero decimal places.

The $options parameter takes the same keys as :php:meth:`Number::format()` itself:

- places (integer): the amount of desired precision
- before (string): to be put before the outputted number
- after (string): to be put after the outputted number
- decimals (string): used to delimit the decimal places in a
  number
- thousands (string): used to mark off thousand, millions, …
  places

Example::

    // Called as NumberHelper
    echo $this->Number->formatDelta('123456.7890', array(
        'places' => 2,
        'decimals' => '.',
        'thousands' => ','
    ));
    // output '+123,456.79'

    // Called as Number
    echo Number::formatDelta('123456.7890', array(
        'places' => 2,
        'decimals' => '.',
        'thousands' => ','
    ));
    // output '+123,456.79'

.. end-cakenumber

.. meta::
    :title lang=en: NumberHelper
    :description lang=en: The Number Helper contains convenience methods that enable display numbers in common formats in your views.
    :keywords lang=en: number helper,currency,number format,number precision,format file size,format numbers
