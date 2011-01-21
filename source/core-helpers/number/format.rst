7.7.5 format
------------

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

7.7.5 format
------------

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
