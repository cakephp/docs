Inflector
#########

.. php:namespace:: Cake\Utility

.. php:class:: Inflector

The Inflector class takes a string and can manipulate it to handle word
variations such as pluralizations or camelizing and is normally accessed
statically. Example:
``Inflector::pluralize('example')`` returns "examples".

You can try out the inflections online at `inflector.cakephp.org
<http://inflector.cakephp.org/>`_.

.. _inflector-methods-summary:

Summary of Inflector Methods and Their Output
===================================================

Quick summary of the Inflector built-in methods and the results they output
when provided a multi-word argument:

+-------------------+---------------+---------------+
| Method            | Argument      | Output        |
+===================+===============+===============+
| ``pluralize()``   | BigApple      | BigApples     |
+                   +---------------+---------------+
|                   | big_apple     | big_apples    |
+-------------------+---------------+---------------+
| ``singularize()`` | BigApples     | BigApple      |
+                   +---------------+---------------+
|                   | big_apples    | big_apple     |
+-------------------+---------------+---------------+
| ``camelize()``    | big_apples    | BigApples     |
+                   +---------------+---------------+
|                   | big apple     | BigApple      |
+-------------------+---------------+---------------+
| ``underscore()``  | BigApples     | big_apples    |
+                   +---------------+---------------+
|                   | Big Apples    | big apples    |
+-------------------+---------------+---------------+
| ``humanize()``    | big_apples    | Big Apples    |
+                   +---------------+---------------+
|                   | bigApple      | BigApple      |
+-------------------+---------------+---------------+
| ``classify()``    | big_apples    | BigApple      | 
+                   +---------------+---------------+
|                   | big apple     | BigApple      |
+-------------------+---------------+---------------+
| ``dasherize()``   | BigApples     | big-apples    |
+                   +---------------+---------------+
|                   | big apple     | big apple     |
+-------------------+---------------+---------------+
| ``tableize()``    | BigApple      | big_apples    |
+                   +---------------+---------------+
|                   | Big Apple     | big apples    |
+-------------------+---------------+---------------+
| ``variable()``    | big_apple     | bigApple      |
+                   +---------------+---------------+
|                   | big apples    | bigApples     |
+-------------------+---------------+---------------+
| ``slug()``        | Big Apple     | big-apple     |
+                   +---------------+---------------+
|                   | BigApples     | BigApples     |
+-------------------+---------------+---------------+

Creating Plural & Singular Forms
================================

.. php:staticmethod:: singularize($singular)
.. php:staticmethod:: pluralize($singular)

Both ``pluralize`` and ``singularize()`` work on most English nouns. If you need
to support other languages, you can use :ref:`inflection-configuration` to
customize the rules used::

    // Apples
    echo Inflector::pluralize('Apple');

.. note::

    ``pluralize()`` may not always correctly convert a noun that is already in its plural form.

.. code-block:: php

    // Person
    echo Inflector::singularize('People');

.. note::

    ``singularize()`` may not always correctly convert a noun that is already in its singular form.

Creating CamelCase and under_scored Forms
=========================================

.. php:staticmethod:: camelize($underscored)
.. php:staticmethod:: underscore($camelCase)

These methods are useful when creating class names, or property names::

    // ApplePie
    Inflector::camelize('Apple_pie')

    // apple_pie
    Inflector::underscore('ApplePie');

It should be noted that underscore will only convert camelCase formatted words.
Words that contains spaces will be lower-cased, but will not contain an
underscore.

Creating Human Readable Forms
=============================

.. php:staticmethod:: humanize($underscored)

This method is useful when converting underscored forms into "Title Case" forms
for human readable values::

    // Apple Pie
    Inflector::humanize('apple_pie');

Creating Table and Class Name Forms
===================================

.. php:staticmethod:: classify($underscored)
.. php:staticmethod:: dasherize($dashed)
.. php:staticmethod:: tableize($camelCase)

When generating code, or using CakePHP's conventions you may need to inflect
table names or class names::

    // UserProfileSetting
    Inflector::classify('user_profile_settings');

    // user-profile-setting
    Inflector::dasherize('UserProfileSetting');

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

.. php:staticmethod:: slug($word, $replacement = '-')

Slug converts special characters into latin versions and converting unmatched
characters and spaces to dashes. The slug method expects UTF-8 encoding::

    // apple-puree
    Inflector::slug('apple purée');

.. note::
    ``Inflector::slug()`` has been deprecated since 3.2.7. Use ``Text::slug()``
    instead.

.. _inflection-configuration:

Inflection Configuration
========================

CakePHP's naming conventions can be really nice - you can name your database
table ``big_boxes``, your model ``BigBoxes``, your controller
``BigBoxesController``, and everything just works together automatically. The
way CakePHP knows how to tie things together is by *inflecting* the words
between their singular and plural forms.

There are occasions (especially for our non-English speaking friends) where you
may run into situations where CakePHP's inflector (the class that pluralizes,
singularizes, camelCases, and under\_scores) might not work as you'd like. If
CakePHP won't recognize your Foci or Fish, you can tell CakePHP about your
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
``Cake/Utility/Inflector``, with the added rules taking precedence over the core
rules. You can use ``Inflector::reset()`` to clear rules and restore the
original Inflector state.

.. meta::
    :title lang=en: Inflector
    :keywords lang=en: apple orange,word variations,apple pie,person man,latin versions,profile settings,php class,initial state,puree,slug,apples,oranges,user profile,underscore
