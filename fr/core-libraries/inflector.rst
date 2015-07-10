Inflector
#########

.. php:namespace:: Cake\Utility

.. php:class:: Inflector

La classe Inflector prend une chaîne de caractères et peut la manipuler
pour gérer les variations de mot comme les mises au pluriel ou les mises
en Camel et est normalement accessible statiquement. Exemple:
``Inflector::pluralize('example')`` retourne "examples".

Vous pouvez essayer les inflections en ligne sur
`inflector.cakephp.org <http://inflector.cakephp.org/>`_.

Créer des Formes Pluriel et Singulier
=====================================

.. php:staticmethod:: singularize($singular)
.. php:staticmethod:: pluralize($singular)

``pluralize`` et ``singularize()`` fonctionnent pour la plupart des noms
Anglais. Si vous devez supporter d'autres langues, vous pouvez utiliser la
:ref:`inflection-configuration` pour personnaliser les règles utilisées::

    // Apples
    echo Inflector::pluralize('Apple');

.. note::

    ``pluralize()`` peut ne pas toujours convertir correctement un nom qui est déjà
    sous sa forme plurielle.

.. code-block:: php

    // Person
    echo Inflector::singularize('People');

.. note::

    ``singularize()`` peut ne pas toujours convertir correctement un nom qui est déjà
    sous sa forme singulière.

Créer des Formes en CamelCase et en Underscore
==============================================

.. php:staticmethod:: camelize($underscored)
.. php:staticmethod:: underscore($camelCase)

Ces méthodes sont utiles lors de la création de noms de classes ou de propriétés::

    // ApplePie
    Inflector::camelize('Apple_pie')

    // apple_pie
    Inflector::undescore('ApplePie');

Il doit être noté que les underscores vont seulement convertir les mots
formatés en camelCase. Les mots qui contiennent des espaces seront en
minuscules, mais ne contiendront pas d'underscore.

Créer des Formes Lisibles par l'Homme
=====================================

Cette méthod eest utile pour convertir des formes avec underscore en forme
"Title Case" pour être lisible par l'homme::

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
les caractères ne correspondant pas et les espaces en tirets. La
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
this method is used in your **config/bootstrap.php**::

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
