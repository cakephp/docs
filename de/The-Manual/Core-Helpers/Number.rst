Number
######

Der NumberHelper enthält Komfortfunktionen, die es ermöglichen Zahlen in
allgemeinen Formaten in Views anzuzeigen. Die Funktionen bieten unter
anderem die Möglichkeit eine Zahl als Währung, Prozentzahl und
Dateigröße zu formatieren und ermöglichen so eine größere Flexibilität
beim formatieren von Zahlen.

Alle Funktionen geben die formatierte Zahl zurück. Sie geben den
Rückgabewert nicht automatisch in der View aus.

currency
========

``currency(mixed $number, string $currency= 'USD')``

Diese Methode wird verwendet, um Zahlen in herkömmlichen
Währungsformaten (EUR,GBP,USD) anzuzeigen. Die Benutzung in Views
erfolgt so:

::

    <?php echo $number->currency($number,$currency); ?>

Der erste Parameter, $number, sollte eine Floating point-Zahl sein, die
die Menge an Geld repräsentiert, die man darstellen möchte. Mit dem
zweiten Parameter kann aus dem vordefinierten
Währungsformatierungs-Schema ausgewählt werden:

+-------------+---------------------------------------+
| $currency   | 1234.56, formatted by currency type   |
+=============+=======================================+
| EUR         | € 1.236,33                            |
+-------------+---------------------------------------+
| GBP         | £ 1,236.33                            |
+-------------+---------------------------------------+
| USD         | $ 1,236.33                            |
+-------------+---------------------------------------+

HTML entities werden wenn benötigt als Währungssymbole ausgegeben.

Wenn ein $currency-Wert nicht erkannt werden kann, wird es als
USD-formatierte Zahl behandelt. Beispiel:

::

    <?php echo $number->currency('1234.56', 'FOO'); ?>
     
    //Outputs: 
    FOO 1,234.56

precision
=========

``precision (mixed $number, int $precision = 3)``

Diese Methode zeigt eine Zahl mit der angegebenen Genauigkeit
(Dezimalstellen). Die Zahl wird auf die angegebene Genauigkeit gerundet.

::

    <?php echo $number->precision(456.91873645, 2 ); ?>
     
    //Outputs: 
    456.92

toPercentage
============

``toPercentage(mixed $number, int $precision = 2)``

Like precision(), this method formats a number according to the supplied
precision (where numbers are rounded to meet the given precision). This
method also expresses the number as a percentage and prepends the output
with a percent sign.

::

    <?php echo $number->toPercentage(45.691873645); ?>
     
    //Outputs: 
    45.69%

toReadableSize
==============

``toReadableSize(string $data_size)``

This method formats data sizes in human readable forms. It provides a
shortcut way to convert bytes to KB, MB, GB, and TB. The size is
displayed with a two-digit precision level, according to the size of
data supplied (i.e. higher sizes are expressed in larger terms):

::

    echo $number->toReadableSize(0);  // 0 Bytes
    echo $number->toReadableSize(1024); // 1 KB
    echo $number->toReadableSize(1321205.76); // 1.26 MB
    echo $number->toReadableSize(5368709120); // 5.00 GB

format
======

``format (mixed $number, mixed $options=false)``

This method gives you much more control over the formatting of numbers
for use in your views (and is used as the main method by most of the
other NumberHelper methods). Using this method might looks like:

::

    $number->format($number, $options);

The $number parameter is the number that you are planning on formatting
for output. With no $options supplied, the number 1236.334 would output
as 1,236. Note that the default precision is zero decimal places.

The $options parameter is where the real magic for this method resides.

-  If you pass an integer then this becomes the amount of precision or
   places for the function.
-  If you pass an associated array, you can use the following keys:

   -  places (integer): the amount of desired precision
   -  before (string): to be put before the outputted number
   -  escape (boolean): if you want the value in before to be escaped
   -  decimals (string): used to delimit the decimal places in a number
   -  thousands (string): used to mark off thousand, millions, … places

::

    echo $number->format('123456.7890', array(
        'places' => 2,
        'before' => '¥ ',
        'escape' => false,
        'decimals' => '.',
        'thousands' => ','
    ));
    // output '¥ 123,456.79'

