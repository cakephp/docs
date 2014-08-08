Internationalization & Localization
###################################

One of the best ways for your applications to reach a larger
audience is to cater for multiple languages. This can often prove
to be a daunting task, but the internationalization and
localization features in CakePHP make it much easier.

First, it's important to understand some terminology.
*Internationalization* refers to the ability of an application to
be localized. The term *localization* refers to the adaptation of
an application to meet specific language (or culture) requirements
(i.e., a "locale"). Internationalization and localization are often
abbreviated as i18n and l10n respectively; 18 and 10 are the number
of characters between the first and last character.

Setting Up Translations
=======================

There are only a few steps to go from a single-language application
to a multi-lingual application, the first of which is to make use
of the :php:func:`__()` function in your code. Below is an example of some code for a
single-language application::

    <h2>Popular Articles</h2>

To internationalize your code, all you need to do is to wrap
strings in :php:func:`__()` like so::

    <h2><?= __('Popular Articles') ?></h2>

If you do nothing further, these two code examples are functionally
identical - they will both send the same content to the browser.
The :php:func:`__()` function will translate the passed string
if a translation is available, or return it unmodified.

Language Files
--------------

Translations can be made available by using language files stored in your
application. The default format for CakePHP translation files is the
`Gettext <http://en.wikipedia.org/wiki/Gettext>`_ format. Files neeed to be
placed under `src/Locale/` and within this directory, there should be
a subfolder for each language the application needs to support::

    /src
        /Locale
            /en_US
                default.po
            /en_GB
                default.po
                validation.po
            /es
                default.po

The default domain is 'default', therefore your locale folder should at least
contain the ``default.po`` file as shown above. A domain refers to any arbitrary
grouping of translation messages. When no group is used, then the default group
is selected.

Plugin can also contain translation files, the convention is to use the
``underscored`` version of the plugin name as the domain for the translation
messages::

    MyPlugin
        /src
            /Locale
                /fr
                    my_plugin.po
                /de
                    my_plugin.po

Language folders can either be the two letter ISO code of the language or the
full locale name such as ``fr_FR``, ``es_AR``, ``da_DK`` which contains both the
language and the country where it is spoken.

An example translation file could look like this:

.. code-block:: pot

     msgid "My name is {0}"
     msgstr "Je m'appelle {0}"

     msgid "I'm {0,number} years old"
     msgstr "J'ai {0,number} ans"

Setting the Default Locale
--------------------------

The default locale can be set in your ``config/bootstrap.php`` folder by using
the following line::

    ini_set('inlt.default_locale', 'fr_FR');

This will control several aspects of your application, including the default
translations language, the date format, number format and currency whenever any
of those is displayed using the localization libraries that CakePHP provides.

Changing the Locale at Runtime
------------------------------

To change the language strings are displayed you can call this method::

    use Cake\I18n\I18n;

    I18n::defaultLocale('de_DE');

This will as well change how numbers and dates are formatted when using one of
the localization tools.

Using Translation Functions
===========================

CakePHP provides several functions that will help you internationalize your
application. The most used one is the :php:func:`__()` function which is used to
retrieve a single translation message or return the same string if no
translation was found::

    echo __('Popular Articles');

If you need to group your messages, for example, translations inside a plugin,
you can use the :php:func:`__d()` function to fetch messages form another domain::

    echo __d('my_plugin', 'Trending right now');

Sometimes translations strings can be ambiguous for people translating them,
specially if two strings are identical but refer to different things. To solve
that problem, you can use the :php:func:`__x()` function::

    echo __x('written communication', 'He read the first letter');

    echo __x('alphabet learning', 'He read the first letter');

The first argument is the context of the message and the second is the message
to be translated.

Using Variables in Translation Messages
---------------------------------------

Translation functions allow you to interpolate variables into the messages using
special markers defined in the message itself or in the translated string::

    echo __("Hello, my name is {0}, I'm {1} years old", ['Sara', 12]);

Markers are numeric, and correspond to the keys in the passed array. You can
also pass variables as independent arguments to the function::

    echo __("Small step for {0}, Big leap for {1}", 'Man', 'Humanity');

All translation functions support placeholder replacements::

    __d('validation', 'The field {0} cannot be left empty', 'Name');

    __x('alphabet', 'He read the letter {0}', 'Z');

These functions take advantage of the
`ICU MessageFormatter <http://dk1.php.net/manual/en/messageformatter.format.php>`_
so you can in a single code translate messages and localize dates, numbers and
currency::

    echo __(
        'Hi {0,string}, your balance on the {1,date} is {2,number,currency}',
        ['Charles', '2014-01-13 11:12:00', 1354.37]
    );

    // Returns
    Hi Charles, your balance on the Jan 13, 2014, 11:12 AM is $ 1,354.37


Numbers in placeholders can be formatter as well with fine grain control of the
output::

    echo __(
        'You have traveled {0,number,decimal} kilometers in {1,number,integer} weeks',
        [5423.344, 5.1]
    );

    // Returns
    You have traveled 5,423.34 kilometers in 5 weeks

    echo __('There are {0,number,#,###} people on earth', 6.1 * pow(10, 8));

    // Returns
    There are 6,100,000,000 people on earth

.. note::

    If you are using PHP 5.5+, then you can use named placeholders like {name}
    {age}, etc. And pass the variables in an array having the corresponding key
    names like ``['name' => 'Sara', 'age' => 12]``. This feature is no available
    in PHP 5.4.

Plurals
-------

One crucial part of internationalizing your application is getting your messages
pluralized correctly depending on the language they are shown. CakePHP provides
a couple ways to correctly select plurals in your messages.

The first one is taking advantage of the ``ICU`` message format that comes
by default in the translation functions. In the translations file you could have
the following strings

.. code-block:: pot

     msgid "{{0},plural,=0{No records found}=1{Found 1 record}other{Found {1} records}"
     msgstr "{{0},plural,=0{Ningún resultado}=1{1 resultado}other{{1} resultados}"

And in your application use the following code to output either of the
translations for such string::

    __('{{0},plural,=0{No records found}=1{Found 1 record}other{Found {1} records}', [0]);

    // Returns "Ningún resultado" as the argument {0} is 0

    __('{{0},plural,=0{No records found}=1{Found 1 record}other{Found {1} records}', [1]);

    // Returns "1 resultado" because the argument {0} is 1

    __('{{0},plural,=0{No records found}=1{Found 1 record}other{Found {1} records}', [2, 2]);

    // Returns "2 resultados" because the argument {0} is 2

You can of course use simpler message ids if you don't want to type the full
plural selection sequence in your code

.. code-block:: pot

     msgid "search.results"
     msgstr "{{0},plural,=0{Ningún resultado}=1{1 resultado}other{{1} resultados}"

Then use the new string in your code::

    __('search.results', [2, 2]);

    // Returns "2 resultados"

The latter version has the downside that you will need to have a translation
messages file even for the default language, but has the advantage that it makes
the code more readable and leaves the complicated plural selection strings to
the translation files.

The second way you can use plural selection is by using the built-in
capabilities for Gettext. In this case 

.. meta::
    :title lang=en: Internationalization & Localization
    :keywords lang=en: internationalization localization,internationalization and localization,language application,gettext,l10n,pot,i18n,translation,languages
