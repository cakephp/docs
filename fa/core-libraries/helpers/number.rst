NumberHelper
############

.. php:class:: NumberHelper(View $view, array $settings = array())

The NumberHelper contains convenience methods that enable display
numbers in common formats in your views. These methods include ways
to format currency, percentages, data sizes, format numbers to
specific precisions and also to give you more flexibility with
formatting numbers.

All of these functions return the formatted number; They do not
automatically echo the output into the view.

.. php:method:: currency(mixed $number, string $currency= 'USD', $options = array())

    :param float $number: The value to covert.
    :param string $currency: The known currency format to use.
    :param array $options: Options, see below.

    This method is used to display a number in common currency formats
    (EUR,GBP,USD). Usage in a view looks like::

        <?php
        echo $this->Number->currency($number, $currency);

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
    a USD formatted number. For example::

        <?php
        echo $this->Number->currency('1234.56', 'FOO');

        // Outputs
        FOO 1,234.56

.. php:method:: addFormat($formatName, $options)
    
    :param string $formatName: The format name to be used in the future
    :param array $options: The array of options for this format.

    Add a currency format to the Number helper.  Makes reusing
    currency formats easier.::
    
        <?php
        $this->Number->addFormat('BRR', array('before' => 'R$ '));
    
    You can now use `BRR` as a shortform when formatting currency amounts.::
    
        <?php
        echo $this->Number->currency($value, 'BRR');
    
    Added formats are merged with the following defaults.::
    
       array(
           'before' => '$', 'after' => 'c', 'zero' => 0, 'places' => 2, 'thousands' => ',',
           'decimals' => '.', 'negative' => '()', 'escape' => true
       )

.. php:method:: precision(mixed $number, int $precision = 3)

    :param float $number: The value to covert
    :param integer $precision: The number of decimal places to display

    This method displays a number with the specified amount of
    precision (decimal places). It will round in order to maintain the
    level of precision defined.::

        <?php
        echo $this->Number->precision(456.91873645, 2 );

        // Outputs
        456.92


.. php:method:: toPercentage(mixed $number, int $precision = 2)

    :param float $number: The value to covert
    :param integer $precision: The number of decimal places to display

    Like precision(), this method formats a number according to the
    supplied precision (where numbers are rounded to meet the given
    precision). This method also expresses the number as a percentage
    and prepends the output with a percent sign.::

        <?php
        echo $this->Number->toPercentage(45.691873645);

        // Outputs
        45.69%

.. php:method:: toReadableSize(string $data_size)

    :param string $data_size: The number of bytes to make readable. 

    This method formats data sizes in human readable forms. It provides
    a shortcut way to convert bytes to KB, MB, GB, and TB. The size is
    displayed with a two-digit precision level, according to the size
    of data supplied (i.e. higher sizes are expressed in larger
    terms)::

        <?php
        echo $this->Number->toReadableSize(0); // 0 Bytes
        echo $this->Number->toReadableSize(1024); // 1 KB
        echo $this->Number->toReadableSize(1321205.76); // 1.26 MB
        echo $this->Number->toReadableSize(5368709120); // 5.00 GB


.. php:method:: format(mixed $number, mixed $options=false)

    This method gives you much more control over the formatting of
    numbers for use in your views (and is used as the main method by
    most of the other NumberHelper methods). Using this method might
    looks like::

        <?php
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

    Example::

        <?php
        echo $this->Number->format('123456.7890', array(
            'places' => 2,
            'before' => '¥ ',
            'escape' => false,
            'decimals' => '.',
            'thousands' => ','
        ));
        // output '¥ 123,456.79'


.. meta::
    :title lang=en: NumberHelper
    :description lang=en: The Number Helper contains convenience methods that enable display numbers in common formats in your views.
    :keywords lang=en: number helper,currency,number format,number precision,format file size,format numbers