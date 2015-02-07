Inflector
#########

.. note::
    Esta página todavía no ha sido traducida y pertenece a la documentación de
    CakePHP 2.X. Si te animas puedes ayudarnos `traduciendo la documentación
    desde Github <https://github.com/cakephp/docs>`_.

.. php:namespace:: Cake\Utility

.. php:class:: Inflector

The Inflector class takes a string and can manipulate it to handle
word variations such as pluralizations or camelizing and is
normally accessed statically. Example:
``Inflector::pluralize('example')`` returns "examples".

You can try out the inflections online at `inflector.cakephp.org
<http://inflector.cakephp.org/>`_.

Creating Plural & Singular Forms
================================

.. php:staticmethod:: singularize($singular)
.. php:staticmethod:: pluralize($singular)

Both ``pluralize`` and ``singularize()`` work on most English nouns. If you need
to support other languages, you can use :ref:`inflection-configuration` to
customize the rules used::

    // Apples
    echo Inflector::pluralize('Apple');

    // Person
    echo Inflector::singularize('People');

Creating CamelCase and under_scored Forms
=========================================

.. php:staticmethod:: camelize($underscored)
.. php:staticmethod:: underscore($camelCase)

These methods are useful when creating class names, or property names::

    // ApplePie
    Inflector::camelize('Apple_pie')

    // apple_pie
    Inflector::undescore('ApplePie');

It should be noted that underscore will only convert camelCase
formatted words. Words that contains spaces will be lower-cased,
but will not contain an underscore.

Creating Human Readable Forms
=============================

.. php:staticmethod:: humanize($underscored)

This method is useful when converting underscored forms into "Title Case" forms
for human readable values::

    // Apple Pie
    Inflector::humanize('apple_pie');

Creating Table and Class Name Forms
===================================

.. php:staticmethod:: tableize($camelCase)
.. php:staticmethod:: classify($underscored)

When generating code, or using CakePHP's conventions you may need to inflect
table names or class names::

    // UserProfileSetting
    Inflector::classify('user_profile_settings');

    // user_profile_settings
    Inflector::tableize('UserProfileSetting');

Creating Variable Names
=======================

.. php:staticmethod:: variable($underscored)

Variable names are often useful when doing meta-programming tasks that involve
generating code or doing work based on conventions::

    // applePie
    Inflector::variable('apple_pie');

Creating URL Safe Strings
=========================

.. php:staticmethod:: slug($word, $replacement = '_')

Slug converts special characters into latin versions and converting
unmatched characters and spaces to underscores. The slug method
expects UTF-8 encoding::

    // apple\_puree
    Inflector::slug('apple purée');


.. _inflection-configuration:

Inflection Configuration
========================

CakePHP's naming conventions can be really nice - you can name your
database table ``big\_boxes``, your model ``BigBoxes``, your controller
``BigBoxesController``, and everything just works together
automatically. The way CakePHP knows how to tie things together is
by *inflecting* the words between their singular and plural forms.

There are occasions (especially for our non-English speaking
friends) where you may run into situations where CakePHP's
inflector (the class that pluralizes, singularizes, camelCases, and
under\_scores) might not work as you'd like. If CakePHP won't
recognize your Foci or Fish, you can tell CakePHP about your
special cases.

Loading Custom Inflections
--------------------------

.. php:staticmethod:: rules($type, $rules, $reset = false)

Define new inflection and transliteration rules for Inflector to use.  Often,
this method is used in your ``config/bootstrap.php``::

    Inflector::rules('singular', [
        'rules' => ['/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta'],
        'uninflected' => ['singulars'],
        'irregular' => ['spins' => 'spinor']
    ]);

or::

    Inflector::rules('plural', [
        'irregular' => ['phylum' => 'phyla']
    ]);

Will merge the supplied rules into the inflection sets defined in
``Cake/Utility/Inflector``, with the added rules taking precedence
over the core rules. You can use ``Inflector::reset()`` to clear rules and
restore the original Inflector state.

.. meta::
    :title lang=es: Inflector
    :keywords lang=es: apple orange,word variations,apple pie,person man,latin versions,profile settings,php class,initial state,puree,slug,apples,oranges,user profile,underscore
