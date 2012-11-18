Number
######

L'assistant Number contient des méthodes pratiques qui permettent
l'affichage des nombres dans des formats courants au sein de vos vues.
Ces méthodes incluent différentes manières de formater les monnaies, les
pourcentages, les tailles de données, de formater les nombres pour des
besoins spécifiques et aussi pour vous donner plus de flexibilité en
formatant les nombres.

Toutes ces fonctions renvoie le nombre formaté. Elles n'affichent pas
automatiquement le résultat dans les vues.

currency
========

``currency(mixed $number, string $currency= 'USD', $options = array())``

This method is used to display a number in common currency formats
(EUR,GBP,USD). Usage in a view looks like:

::

    <?php echo $this->Number->currency($number,$currency); ?>

The first parameter, $number, should be a floating point number that
represents the amount of money you are expressing. The second parameter
is used to choose a predefined currency formatting scheme:

+-------------+---------------------------------------+
| $currency   | 1234.56, formatted by currency type   |
+=============+=======================================+
| EUR         | € 1.236,33                            |
+-------------+---------------------------------------+
| GBP         | £ 1,236.33                            |
+-------------+---------------------------------------+
| USD         | $ 1,236.33                            |
+-------------+---------------------------------------+

The third parameter is an array of options for further defining the
output. The following options are available:

Option

Description

before

The currency symbol to place before whole numbers ie. '$'

after

The currency symbol to place after decimal numbers ie. 'c'. Set to
boolean false to use no decimal symbol. eg. 0.35 => $0.35.

zero

The text to use for zero values, can be a string or a number. ie. 0,
'Free!'

places

Number of decimal places to use. ie. 2

thousands

Thousands separator ie. ','

decimals

Decimal separator symbol ie. '.'

negative

Symbol for negative numbers. If equal to '()', the number will be
wrapped with ( and )

escape

Should the output be htmlentity escaped? Defaults to true

If a non-recognized $currency value is supplied, it is prepended to a
USD formatted number. For example:

::

    <?php echo $this->Number->currency('1234.56', 'FOO'); ?>
     
    //Outputs: 
    FOO 1,234.56

precision
=========

``precision (mixed $nombre, int $precision = 3)``

Cette méthode affiche un nombre avec le degré de précision spécifié
(nombre de décimales). Il sera arrondi pour conserver ce niveau de
précision.

::

    <?php echo $number->precision(456.91873645, 2 ); ?>
     
    // Affiche : 
    456.92

toPercentage
============

``toPercentage(mixed $nombre, int $precision = 2)``

Comme precision(), cette méthode formate un nombre en fonction de la
précision fournie (les nombres sont arrondis pour répondre à la
précision donnée). Cette méthode exprime également le nombre comme un
pourcentage et complète l'affichage avec le signe "pour cent".

::

    <?php echo $number->toPercentage(45.691873645); ?>
     
    // Affiche :
    45.69%

toReadableSize
==============

``toReadableSize(string $taille_donnee)``

Cette méthode formate des tailles de données sous une forme
compréhensible par les humains. Elle fournit un raccourci pour convertir
des octets en Ko, Mo, Go et To. La taille est affichée avec un niveau de
précision à deux chiffres, adapté à la taille des données fournies (par
exemple : les tailles les plus grandes sont exprimées avec les unités
les plus grandes) :

::

    echo $number->toReadableSize(0);  // 0 octet
    echo $number->toReadableSize(1024); // 1 Ko
    echo $number->toReadableSize(1321205.76); // 1.26 Mo
    echo $number->toReadableSize(5368709120); // 5.00 Go

format
======

``format (mixed $number, mixed $options=false)``

This method gives you much more control over the formatting of numbers
for use in your views (and is used as the main method by most of the
other NumberHelper methods). Using this method might looks like:

::

    $this->Number->format($number, $options);

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

    echo $this->Number->format('123456.7890', array(
        'places' => 2,
        'before' => '¥ ',
        'escape' => false,
        'decimals' => '.',
        'thousands' => ','
    ));
    // output '¥ 123,456.79'

