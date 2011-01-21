7.7.1 currency
--------------

``currency(mixed $number, string $currency= 'USD', $options = array())``

This method is used to display a number in common currency formats
(EUR,GBP,USD). Usage in a view looks like:

::

    <?php echo $this->Number->currency($number,$currency); ?>


#. ``<?php echo $this->Number->currency($number,$currency); ?>``

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
The currency symbol to place after decimal numbers ie. 'c'. Set to
boolean false to use no decimal symbol. eg. 0.35 => $0.35.
zero
The text to use for zero values, can be a string or a number. ie.
0, 'Free!'
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
If a non-recognized $currency value is supplied, it is prepended to
a USD formatted number. For example:

::

    <?php echo $this->Number->currency('1234.56', 'FOO'); ?>
     
    //Outputs: 
    FOO 1,234.56


#. ``<?php echo $this->Number->currency('1234.56', 'FOO'); ?>``
#. ````
#. ``//Outputs:``
#. ``FOO 1,234.56``

7.7.1 currency
--------------

``currency(mixed $number, string $currency= 'USD', $options = array())``

This method is used to display a number in common currency formats
(EUR,GBP,USD). Usage in a view looks like:

::

    <?php echo $this->Number->currency($number,$currency); ?>


#. ``<?php echo $this->Number->currency($number,$currency); ?>``

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
The currency symbol to place after decimal numbers ie. 'c'. Set to
boolean false to use no decimal symbol. eg. 0.35 => $0.35.
zero
The text to use for zero values, can be a string or a number. ie.
0, 'Free!'
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
If a non-recognized $currency value is supplied, it is prepended to
a USD formatted number. For example:

::

    <?php echo $this->Number->currency('1234.56', 'FOO'); ?>
     
    //Outputs: 
    FOO 1,234.56


#. ``<?php echo $this->Number->currency('1234.56', 'FOO'); ?>``
#. ````
#. ``//Outputs:``
#. ``FOO 1,234.56``
