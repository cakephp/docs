3.4.6 Inflections
-----------------

Cake's naming conventions can be really nice - you can name your
database table big\_boxes, your model BigBox, your controller
BigBoxesController, and everything just works together
automatically. The way CakePHP knows how to tie things together is
by *inflecting* the words between their singular and plural forms.

There are occasions (especially for our non-English speaking
friends) where you may run into situations where CakePHP's
inflector (the class that pluralizes, singularizes, camelCases, and
under\_scores) might not work as you'd like. If CakePHP won't
recognize your Foci or Fish, you can tell CakePHP about your
special cases.

**Loading custom inflections**

You can use ``Inflector::rules()`` in the file
app/config/bootstrap.php to load custom inflections.

::

    Inflector::rules('singular', array(
        'rules' => array('/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta'),
        'uninflected' => array('singulars'),
        'irregular' => array('spins' => 'spinor')
    ));

or
::

    Inflector::rules('plural', array('irregular' => array('phylum' => 'phyla')));

Will merge the supplied rules into the inflection sets defined in
cake/libs/inflector.php, with the added rules taking precedence
over the core rules.
