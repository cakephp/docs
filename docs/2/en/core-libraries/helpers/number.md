# NumberHelper

`class` **NumberHelper**(View $view, array $settings = array())

The NumberHelper contains convenient methods that enable display
numbers in common formats in your views. These methods include ways
to format currency, percentages, data sizes, format numbers to
specific precisions and also to give you more flexibility with
formatting numbers.

<div class="versionchanged">

2.1
`NumberHelper` have been refactored into `CakeNumber` class to
allow easier use outside of the `View` layer.
Within a view, these methods are accessible via the `NumberHelper`
class and you can call it as you would call a normal helper method:
`$this->Number->method($args);`.

</div>

All of these functions return the formatted number; They do not
automatically echo the output into the view.

> param float \$number  
> The value to covert.
>
> param string \$currency  
> The known currency format to use.
>
> param array \$options  
> Options, see below.
>
> This method is used to display a number in common currency formats
> (EUR,GBP,USD). Usage in a view looks like:
>
> ``` php
> // called as NumberHelper
> echo $this->Number->currency($number, $currency);
>
> // called as CakeNumber
> App::uses('CakeNumber', 'Utility');
> echo CakeNumber::currency($number, $currency);
> ```
>
> The first parameter, \$number, should be a floating point number
> that represents the amount of money you are expressing. The second
> parameter is used to choose a predefined currency formatting
> scheme:
>
> | \$currency | 1234.56, formatted by currency type |
> |------------|-------------------------------------|
> | EUR        | €1.234,56                           |
> | GBP        | £1,234.56                           |
> | USD        | \$1,234.56                          |
>
> The third parameter is an array of options for further defining the
> output. The following options are available:
>
> | Option           | Description                                         |
> |------------------|-----------------------------------------------------|
> | before           | The currency symbol to place before whole numbers   
>                     ie. '\$'                                             |
> | after            | The currency symbol to place after decimal numbers  
>                     ie. 'c'. Set to boolean false to use no decimal      
>                     symbol. eg. 0.35 =\> \$0.35.                         |
> | zero             | The text to use for zero values, can be a string or 
>                     a number. ie. 0, 'Free!'                             |
> | places           | Number of decimal places to use. ie. 2              |
> | thousands        | Thousands separator ie. ','                         |
> | decimals         | Decimal separator symbol ie. '.'                    |
> | negative         | Symbol for negative numbers. If equal to '()', the  
>                     number will be wrapped with ( and )                  |
> | escape           | Should the output be htmlentity escaped? Defaults   
>                     to true                                              |
> | wholeSymbol      | String to use for whole numbers ie. ' dollars'      |
> | wholePosition    | Either 'before' or 'after' to place the whole       
>                     symbol                                               |
> | fractionSymbol   | String to use for fraction numbers ie. ' cents'     |
> | fractionPosition | Either 'before' or 'after' to place the fraction    
>                     symbol                                               |
> | fractionExponent | Fraction exponent of this specific currency.        
>                     Defaults to 2.                                       |
>
> If a non-recognized \$currency value is supplied, it is prepended to
> a USD formatted number. For example:
>
> ``` php
> // called as NumberHelper
> echo $this->Number->currency('1234.56', 'FOO');
>
> // Outputs
> FOO 1,234.56
>
> // called as CakeNumber
> App::uses('CakeNumber', 'Utility');
> echo CakeNumber::currency('1234.56', 'FOO');
> ```
>
> <div class="versionchanged">
>
> 2.4
> The `fractionExponent` option was added.
>
> </div>

> param string \$currency  
> Set a known currency for `CakeNumber::currency()`.
>
> Setter/getter for default currency. This removes the need always passing the
> currency to `CakeNumber::currency()` and change all currency outputs by setting other default.
>
> <div class="versionadded">
>
> 2.3 This method was added in 2.3
>
> </div>

> param string \$formatName  
> The format name to be used in the future
>
> param array \$options  
> The array of options for this format. Uses the
> same `$options` keys as `CakeNumber::currency()`.
>
> Add a currency format to the Number helper. Makes reusing
> currency formats easier:
>
> ``` php
> // called as NumberHelper
> $this->Number->addFormat('BRL', array('before' => 'R$', 'thousands' => '.', 'decimals' => ','));
>
> // called as CakeNumber
> App::uses('CakeNumber', 'Utility');
> CakeNumber::addFormat('BRL', array('before' => 'R$', 'thousands' => '.', 'decimals' => ','));
> ```
>
> You can now use <span class="title-ref">BRL</span> as a short form when formatting currency amounts:
>
> ``` php
> // called as NumberHelper
> echo $this->Number->currency($value, 'BRL');
>
> // called as CakeNumber
> App::uses('CakeNumber', 'Utility');
> echo CakeNumber::currency($value, 'BRL');
> ```
>
> Added formats are merged with the following defaults:
>
>     array(
>         'wholeSymbol'      => '',
>         'wholePosition'    => 'before',
>         'fractionSymbol'   => false,
>         'fractionPosition' => 'after',
>         'zero'             => 0,
>         'places'           => 2,
>         'thousands'        => ',',
>         'decimals'         => '.',
>         'negative'         => '()',
>         'escape'           => true,
>         'fractionExponent' => 2
>     )

> param float \$number  
> The value to covert
>
> param integer \$precision  
> The number of decimal places to display
>
> This method displays a number with the specified amount of
> precision (decimal places). It will round in order to maintain the
> level of precision defined. :
>
> ``` php
> // called as NumberHelper
> echo $this->Number->precision(456.91873645, 2);
>
> // Outputs
> 456.92
>
> // called as CakeNumber
> App::uses('CakeNumber', 'Utility');
> echo CakeNumber::precision(456.91873645, 2);
> ```

> param float \$number  
> The value to covert.
>
> param integer \$precision  
> The number of decimal places to display.
>
> param array \$options  
> Options, see below.
>
> | Option   | Description                                        |
> |----------|----------------------------------------------------|
> | multiply | Boolean to indicate whether the value has to be    
>             multiplied by 100. Useful for decimal percentages.  |
>
> Like precision(), this method formats a number according to the
> supplied precision (where numbers are rounded to meet the given
> precision). This method also expresses the number as a percentage
> and prepends the output with a percent sign. :
>
> ``` php
> // Called as NumberHelper. Output: 45.69%
> echo $this->Number->toPercentage(45.691873645);
>
> // Called as CakeNumber. Output: 45.69%
> App::uses('CakeNumber', 'Utility');
> echo CakeNumber::toPercentage(45.691873645);
>
> // Called with multiply. Output: 45.69%
> echo CakeNumber::toPercentage(0.45691, 2, array(
>     'multiply' => true
> ));
> ```
>
> <div class="versionadded">
>
> 2.4
> The `$options` argument with the `multiply` option was added.
>
> </div>

> param string \$size  
> The formatted human readable value.
>
> This method unformats a number from a human readable byte size
> to an integer number of bytes.
>
> <div class="versionadded">
>
> 2.3
> This method was added in 2.3
>
> </div>

> param string \$dataSize  
> The number of bytes to make readable.
>
> This method formats data sizes in human readable forms. It provides
> a shortcut way to convert bytes to KB, MB, GB, and TB. The size is
> displayed with a two-digit precision level, according to the size
> of data supplied (i.e. higher sizes are expressed in larger
> terms):
>
> ``` php
> // called as NumberHelper
> echo $this->Number->toReadableSize(0); // 0 Bytes
> echo $this->Number->toReadableSize(1024); // 1 KB
> echo $this->Number->toReadableSize(1321205.76); // 1.26 MB
> echo $this->Number->toReadableSize(5368709120); // 5.00 GB
>
> // called as CakeNumber
> App::uses('CakeNumber', 'Utility');
> echo CakeNumber::toReadableSize(0); // 0 Bytes
> echo CakeNumber::toReadableSize(1024); // 1 KB
> echo CakeNumber::toReadableSize(1321205.76); // 1.26 MB
> echo CakeNumber::toReadableSize(5368709120); // 5.00 GB
> ```

> This method gives you much more control over the formatting of
> numbers for use in your views (and is used as the main method by
> most of the other NumberHelper methods). Using this method might
> looks like:
>
> ``` php
> // called as NumberHelper
> $this->Number->format($number, $options);
>
> // called as CakeNumber
> CakeNumber::format($number, $options);
> ```
>
> The \$number parameter is the number that you are planning on
> formatting for output. With no \$options supplied, the number
> 1236.334 would output as 1,236. Note that the default precision is
> zero decimal places.
>
> The \$options parameter is where the real magic for this method
> resides.
>
> - If you pass an integer then this becomes the amount of precision
>   or places for the function.
> - If you pass an associated array, you can use the following keys:
>   - places (integer): the amount of desired precision
>   - before (string): to be put before the outputted number
>   - escape (boolean): if you want the value in before to be escaped
>   - decimals (string): used to delimit the decimal places in a
>     number
>   - thousands (string): used to mark off thousand, millions, …
>     places
>
> Example:
>
> ``` php
> // called as NumberHelper
> echo $this->Number->format('123456.7890', array(
>     'places' => 2,
>     'before' => '¥ ',
>     'escape' => false,
>     'decimals' => '.',
>     'thousands' => ','
> ));
> // output '¥ 123,456.79'
>
> // called as CakeNumber
> App::uses('CakeNumber', 'Utility');
> echo CakeNumber::format('123456.7890', array(
>     'places' => 2,
>     'before' => '¥ ',
>     'escape' => false,
>     'decimals' => '.',
>     'thousands' => ','
> ));
> // output '¥ 123,456.79'
> ```

> This method displays differences in value as a signed number:
>
> ``` php
> // called as NumberHelper
> $this->Number->formatDelta($number, $options);
>
> // called as CakeNumber
> CakeNumber::formatDelta($number, $options);
> ```
>
> The \$number parameter is the number that you are planning on
> formatting for output. With no \$options supplied, the number
> 1236.334 would output as 1,236. Note that the default precision is
> zero decimal places.
>
> The \$options parameter takes the same keys as `CakeNumber::format()` itself:
>
> - places (integer): the amount of desired precision
> - before (string): to be put before the outputted number
> - after (string): to be put after the outputted number
> - decimals (string): used to delimit the decimal places in a
>   number
> - thousands (string): used to mark off thousand, millions, …
>   places
>
> Example:
>
> ``` php
> // called as NumberHelper
> echo $this->Number->formatDelta('123456.7890', array(
>     'places' => 2,
>     'decimals' => '.',
>     'thousands' => ','
> ));
> // output '+123,456.79'
>
> // called as CakeNumber
> App::uses('CakeNumber', 'Utility');
> echo CakeNumber::formatDelta('123456.7890', array(
>     'places' => 2,
>     'decimals' => '.',
>     'thousands' => ','
> ));
> // output '+123,456.79'
> ```
>
> <div class="versionadded">
>
> 2.3
> This method was added in 2.3
>
> </div>

> [!WARNING]
> Since 2.4 the symbols are now UTF-8. Please see the migration guide for details if you run a
> non-UTF-8 app.
