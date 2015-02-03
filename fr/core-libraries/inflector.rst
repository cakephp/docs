Inflector
#########

.. php:namespace:: Cake\Utility

.. php:class:: Inflector

La classe Inflector prend une chaîne de caractères et peut la manipuler
pour gérer les variations de mot comme les mises au pluriel ou les mises
en Camel et est normalement accessible statiquement. Exemple:
``Inflector::pluralize('example')`` retourne "examples".

Vous pouvez essayer les inflections enligne sur
`inflector.cakephp.org <http://inflector.cakephp.org/>`_.

Créer des Formes Pluriel et Singulier
=====================================

.. php:staticmethod:: singularize($singular)
.. php:staticmethod:: pluralize($singular)

Both ``pluralize`` and ``singularize()`` work on most English nouns. If you need
to support other languages, you can use :ref:`inflection-configuration` to
customize the rules used::

    // Apples
    echo Inflector::pluralize('Apple');

    // Person
    echo Inflector::singularize('People');

Créer des Formes en CamelCase et en Underscore
==============================================

.. php:staticmethod:: camelize($underscored)
.. php:staticmethod:: underscore($camelCase)

These methods are useful when creating class names, or property names::

    // ApplePie
    Inflector::camelize('Apple_pie')

    // apple_pie
    Inflector::undescore('ApplePie');

Il doit être noté que les underscores vont seulement convertir les mots
formatés en camelCase. Les mots qui contiennent des espaces seront en
minuscules, mais ne contiendront pas d'underscore.

Créer des Formes Lisibles par l'Homme
=====================================

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

Créer des Noms de Variable
==========================

.. php:staticmethod:: variable($underscored)

Variable names are often useful when doing meta-programming tasks that involve
generating code or doing work based on conventions::

    // applePie
    Inflector::variable('apple_pie');

Créer des Chaînes d'URL Safe
============================

.. php:staticmethod:: slug($word, $replacement = '-')

Slug convertit les caractères spéciaux en version latins et convertit
les caractères ne correspondant pas et les espaces en tirêts. La
méthode slug s'attend à un encodage UTF-8::

    // apple-puree
    Inflector::slug('apple purée');


.. _inflection-configuration:

Configuration d'Inflection
==========================

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

    Inflector::rules('singular', ['/^(bil)er$/i' => '\1', '/^(inflec|contribu)tors$/i' => '\1ta']);
    Inflector::rules('uninflected', ['singulars']);
    Inflector::rules('irregular', ['phylum' => 'phyla']); // The key is singular form, value is plural form

The supplied rules will be merged into the respective inflection sets defined in
``Cake/Utility/Inflector``, with the added rules taking precedence
over the core rules. You can use ``Inflector::reset()`` to clear rules and
restore the original Inflector state.

.. meta::
    :title lang=fr: Inflector
    :keywords lang=fr: apple orange,word variations,apple pie,person man,latin versions,profile settings,php class,initial state,puree,slug,apples,oranges,user profile,underscore
