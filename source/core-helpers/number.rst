NumberHelper
############

The NumberHelper contains convenience methods that enable display
numbers in common formats in your views. These methods include ways
to format currency, percentages, data sizes, format numbers to
specific precisions and also to give you more flexibility with
formatting numbers.

All of these functions return the formatted number; They do not
automatically echo the output into the view.

currency()
==========

``currency(mixed $number, string $currency= 'USD', $options = array())``

This method is used to display a number in common currency formats
(EUR,GBP,USD). Usage in a view looks like:

::

    <?php echo $this->Number->currency($number, $currency); ?>

The first parameter, $number, should be a floating point number
that represents the amount of money you are expressing. The second
parameter is used to choose a predefined currency formatting
scheme:

$currency
	1234.56, formatted by currency type
EUR
	€ 1.236,33
GBP
	£ 1,236.33
USD
	$ 1,236.33

The third parameter is an array of options for further defining the
output. The following options are available:

Option
	Description
before
	The currency symbol to place before whole numbers ie. '$'
after
	The currency symbol to place after decimal numbers ie. 'c'. Set to boolean false to use no decimal symbol. eg. 0.35 => $0.35.
zero
	The text to use for zero values, can be a string or a number. ie. 0, 'Free!'
places
	Number of decimal places to use. ie. 2
thousands
	Thousands separator ie. ','
decimals
	Decimal separator symbol ie. '.'
negative
	Symbol for negative numbers. If equal to '()', the number will be wrapped with ( and )
escape
	Should the output be htmlentity escaped? Defaults to true

If a non-recognized $currency value is supplied, it is prepended to
a USD formatted number. For example:

::

    <?php echo $this->Number->currency('1234.56', 'FOO'); ?>

    //Outputs:
    FOO 1,234.56

precision()
===========

``precision (mixed $number, int $precision = 3)``

This method displays a number with the specified amount of
precision (decimal places). It will round in order to maintain the
level of precision defined.

::

    <?php echo $this->Number->precision(456.91873645, 2 ); ?>

    //Outputs:
    456.92


toPercentage()
==============

``toPercentage(mixed $number, int $precision = 2)``

Like precision(), this method formats a number according to the
supplied precision (where numbers are rounded to meet the given
precision). This method also expresses the number as a percentage
and prepends the output with a percent sign.

::

    <?php echo $this->Number->toPercentage(45.691873645); ?>

    //Outputs:
    45.69%

toReadableSize()
================

``toReadableSize(string $data_size)``

This method formats data sizes in human readable forms. It provides
a shortcut way to convert bytes to KB, MB, GB, and TB. The size is
displayed with a two-digit precision level, according to the size
of data supplied (i.e. higher sizes are expressed in larger
terms):

::

    echo $this->Number->toReadableSize(0);  // 0 Bytes
    echo $this->Number->toReadableSize(1024); // 1 KB
    echo $this->Number->toReadableSize(1321205.76); // 1.26 MB
    echo $this->Number->toReadableSize(5368709120); // 5.00 GB


format()
========

``format (mixed $number, mixed $options=false)``

This method gives you much more control over the formatting of
numbers for use in your views (and is used as the main method by
most of the other NumberHelper methods). Using this method might
looks like:

::

    $this->Number->format($number, $options);

The $number parameter is the number that you are planning on
formatting for output. With no $options supplied, the number
1236.334 would output as 1,236. Note that the default precision is
zero decimal places.

The $options parameter is where the real magic for this method
resides.


-  If you pass an integer then this becomes the amount of precision
   or places for the function.
-  If you pass an associated array, you can use the following keys:
   
   -  places (integer): the amount of desired precision
   -  before (string): to be put before the outputted number
   -  escape (boolean): if you want the value in before to be escaped
   -  decimals (string): used to delimit the decimal places in a
      number
   -  thousands (string): used to mark off thousand, millions, …
      places


::

    echo $this->Number->format('123456.7890', array(
        'places' => 2,
        'before' => '¥ ',
        'escape' => false,
        'decimals' => '.',
        'thousands' => ','
    ));
    // output '¥ 123,456.79'
