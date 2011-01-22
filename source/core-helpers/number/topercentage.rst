7.7.3 toPercentage
------------------

``toPercentage(mixed $number, int $precision = 2)``

Like precision(), this method formats a number according to the
supplied precision (where numbers are rounded to meet the given
precision). This method also expresses the number as a percentage
and prepends the output with a percent sign.

::

    <?php echo $this->Number->toPercentage(45.691873645); ?>
     
    //Outputs: 
    45.69%
