Internationalization & Localization
###################################

One of the best ways for an application to reach a larger audience is to cater
to multiple languages. This can often prove to be a daunting task, but the
internationalization and localization features in CakePHP make it much easier.

First, it's important to understand some terminology. *Internationalization*
refers to the ability of an application to be localized. The term *localization*
refers to the adaptation of an application to meet specific language (or
culture) requirements (i.e. a "locale"). Internationalization and localization
are often abbreviated as i18n and l10n respectively; 18 and 10 are the number
of characters between the first and last character.

Setting Up Translations
=======================

There are only a few steps to go from a single-language application to a
multi-lingual application, the first of which is to make use of the
:php:func:`__()` function in your code. Below is an example of some code for a
single-language application::

<<<<<<< HEAD
    <h2>Popular Articles</h2>
=======
    <h2>Posts</h2>

To internationalize your code, all you need to do is to wrap
strings in :php:func:`__()` like so::

    <h2><?php echo __('Posts'); ?></h2>

If you do nothing further, these two code examples are functionally
identical - they will both send the same content to the browser.
The :php:func:`__()` function will translate the passed string
if a translation is available, or return it unmodified. It works similar
to other `Gettext <https://en.wikipedia.org/wiki/Gettext>`_ implementations
(as do the other translate functions, such as
:php:func:`__d()` , :php:func:`__n()` etc)

With your code ready to be multilingual, the next step is to create
your `pot file <https://en.wikipedia.org/wiki/Gettext>`_, which is
the template for all translatable strings in your application. To
generate your pot file(s), all you need to do is run the
:doc:`i18n console task </console-and-shells/i18n-shell>`,
which will look for where you've used a translate function in your
code and generate your pot file(s) for you. You can and should
re-run this console task any time you change the translations in
your code.

The pot file(s) themselves are not used by CakePHP, they are the
templates used to create or update your
`po files <https://en.wikipedia.org/wiki/Gettext>`_, which contain
the translations. CakePHP will look for your po files in the following
location::

    /app/Locale/<locale>/LC_MESSAGES/<domain>.po

The default domain is 'default', therefore your locale folder would
look something like this::

    /app/Locale/eng/LC_MESSAGES/default.po (English)
    /app/Locale/fra/LC_MESSAGES/default.po (French)
    /app/Locale/por/LC_MESSAGES/default.po (Portuguese)

To create or edit your po files it's recommended that you do *not*
use your favorite editor. To create a po file for the first time it
is possible to copy the pot file to the correct location and change
the extension *however* unless you're familiar with their format,
it's quite easy to create an invalid po file or to save it as the
wrong charset (if you're editing manually, use UTF-8 to avoid
problems). There are free tools such as
`PoEdit <http://www.poedit.net>`_ which make editing and updating
your po files an easy task; especially for updating an existing po
file with a newly updated pot file.

The three-character locale codes conform to the
`ISO 639-2 <http://www.loc.gov/standards/iso639-2/php/code_list.php>`_
standard, although if you create regional locales (`en\_US`, `en\_GB`,
etc.) cake will use them if appropriate.

.. warning::

    In 2.3 and 2.4 some language codes have been corrected to meet the ISO standard.
    Please see the corresponding migration guides for details.

Remember that po files are useful for short messages, if you find
you want to translate long paragraphs, or even whole pages - you
should consider implementing a different solution. e.g. ::

    // App Controller Code.
    public function beforeFilter() {
        $locale = Configure::read('Config.language');
        if ($locale && file_exists(APP . 'View' . DS . $locale . DS . $this->viewPath . DS . $this->view . $this->ext)) {
            // e.g. use /app/View/fra/Pages/tos.ctp instead of /app/View/Pages/tos.ctp
            $this->viewPath = $locale . DS . $this->viewPath;
        }
    }
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

To internationalize your code, all you need to do is to wrap strings in
:php:func:`__()` like so::

    <h2><?= __('Popular Articles') ?></h2>

Doing nothing else, these two code examples are functionally identical - they
will both send the same content to the browser. The :php:func:`__()` function
will translate the passed string if a translation is available, or return it
unmodified.

Language Files
--------------

<<<<<<< HEAD
Translations can be made available by using language files stored in the
application. The default format for CakePHP translation files is the
`Gettext <http://en.wikipedia.org/wiki/Gettext>`_ format. Files need to be
placed under **src/Locale/** and within this directory, there should be a
subfolder for each language the application needs to support::
=======
Just place LC_TIME file in its respective locale directory::
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    /src
        /Locale
            /en_US
                default.po
            /en_GB
                default.po
                validation.po
            /es
                default.po

The default domain is 'default', therefore the locale folder should at least
contain the **default.po** file as shown above. A domain refers to any arbitrary
grouping of translation messages. When no group is used, then the default group
is selected.

<<<<<<< HEAD
The core strings messages extracted from the CakePHP library can be stored
separately in a file named **cake.po** in **src/Locale/**.
The `CakePHP localized library <https://github.com/cakephp/localized>`_ houses
translations for the client-facing translated strings in the core (the cake
domain). To use these files, link or copy them into their expected location:
**src/Locale/<locale>/cake.po**. If your locale is incomplete or incorrect,
please submit a PR in this repository to fix it.
=======
Internationalizing CakePHP Plugins
==================================
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

Plugins can also contain translation files, the convention is to use the
``under_scored`` version of the plugin name as the domain for the translation
messages::

<<<<<<< HEAD
    MyPlugin
        /src
            /Locale
                /fr
                    my_plugin.po
                /de
                    my_plugin.po
=======
Instead of `__()` and `__n()` you will have to use `__d()` and `__dn()`. The D means
domain. So if you have a plugin called 'DebugKit' you would have to do this::
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

Translation folders can either be the two letter ISO code of the language or the
full locale name such as ``fr_FR``, ``es_AR``, ``da_DK`` which contains both the
language and the country where it is spoken.

An example translation file could look like this:

.. code-block:: pot

     msgid "My name is {0}"
     msgstr "Je m'appelle {0}"

     msgid "I'm {0,number} years old"
     msgstr "J'ai {0,number} ans"

Extract Pot Files with I18n Shell
---------------------------------

To create the pot files from `__()` and other internationalized types of
messages that can be found in the application code, you can use the i18n shell.
Please read the :doc:`following chapter </console-and-shells/i18n-shell>` to
learn more.

<<<<<<< HEAD
Setting the Default Locale
--------------------------

The default locale can be set in your **config/app.php** file by setting
``App.defaultLocale``::

    'App' => [
        ...
        'defaultLocale' => env('APP_DEFAULT_LOCALE', 'en_US'),
        ...
    ]

This will control several aspects of the application, including the default
translations language, the date format, number format and currency whenever any
of those is displayed using the localization libraries that CakePHP provides.

Changing the Locale at Runtime
------------------------------

To change the language for translated strings you can call this method::

    use Cake\I18n\I18n;

    // Prior to 3.5 use I18n::locale()
    I18n::setLocale('de_DE');

This will also change how numbers and dates are formatted when using one of the
localization tools.

Using Translation Functions
===========================

CakePHP provides several functions that will help you internationalize your
application. The most frequently used one is :php:func:`__()`. This function
is used to retrieve a single translation message or return the same string if no
translation was found::

    echo __('Popular Articles');

If you need to group your messages, for example, translations inside a plugin,
you can use the :php:func:`__d()` function to fetch messages from another
domain::

    echo __d('my_plugin', 'Trending right now');

.. note::

    If you want to translate your plugins and they're namespaced, you must name
    your domain string ``Namespace/PluginName``. But the related language file
    will become ``plugins/Namespace/PluginName/src/Locale/plugin_name.po``
    inside your plugin folder.

Sometimes translations strings can be ambiguous for people translating them.
This can happen if two strings are identical but refer to different things. For
example, 'letter' has multiple meanings in English. To solve that problem, you
can use the :php:func:`__x()` function::

    echo __x('written communication', 'He read the first letter');

    echo __x('alphabet learning', 'He read the first letter');

The first argument is the context of the message and the second is the message
to be translated.

.. code-block:: pot

     msgctxt "written communication"
     msgid "He read the first letter"
     msgstr "Er las den ersten Brief"

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

The ``'`` (single quote) character acts as an escape code in translation
messages. Any variables between single quotes will not be replaced and is
treated as literal text. For example::

    __("This variable '{0}' be replaced.", 'will not');

By using two adjacent quotes your variables will be replaced properly::

    __("This variable ''{0}'' be replaced.", 'will');

These functions take advantage of the
`ICU MessageFormatter <http://php.net/manual/en/messageformatter.format.php>`_
so you can translate messages and localize dates, numbers and currency at the
same time::

    echo __(
        'Hi {0}, your balance on the {1,date} is {2,number,currency}',
        ['Charles', new FrozenTime('2014-01-13 11:12:00'), 1354.37]
    );

    // Returns
    Hi Charles, your balance on the Jan 13, 2014, 11:12 AM is $ 1,354.37

Numbers in placeholders can be formatted as well with fine grain control of the
output::

    echo __(
        'You have traveled {0,number} kilometers in {1,number,integer} weeks',
        [5423.344, 5.1]
    );

    // Returns
    You have traveled 5,423.34 kilometers in 5 weeks

    echo __('There are {0,number,#,###} people on earth', 6.1 * pow(10, 8));

    // Returns
    There are 6,100,000,000 people on earth

This is the list of formatter specifiers you can put after the word ``number``:

* ``integer``: Removes the decimal part
* ``currency``: Puts the locale currency symbol and rounds decimals
* ``percent``: Formats the number as a percentage

Dates can also be formatted by using the word ``date`` after the placeholder
number. A list of extra options follows:

* ``short``
* ``medium``
* ``long``
* ``full``

The word ``time`` after the placeholder number is also accepted and it
understands the same options as ``date``.

.. note::

    Named placeholders are supported in PHP 5.5+ and are formatted as
    ``{name}``. When using named placeholders pass the variables in an array
    using key/value pairs, for example ``['name' => 'Sara', 'age' => 12]``.

    It is recommended to use PHP 5.5 or higher when making use of
    internationalization features in CakePHP. The ``php5-intl`` extension must
    be installed and the ICU version should be above 48.x.y (to check the ICU
    version ``Intl::getIcuVersion()``).

Plurals
-------

One crucial part of internationalizing your application is getting your messages
pluralized correctly depending on the language they are shown. CakePHP provides
a couple ways to correctly select plurals in your messages.

Using ICU Plural Selection
~~~~~~~~~~~~~~~~~~~~~~~~~~

The first one is taking advantage of the ``ICU`` message format that comes by
default in the translation functions. In the translations file you could have
the following strings

.. code-block:: pot

     msgid "{0,plural,=0{No records found} =1{Found 1 record} other{Found # records}}"
     msgstr "{0,plural,=0{Ningún resultado} =1{1 resultado} other{# resultados}}"

     msgid "{placeholder,plural,=0{No records found} =1{Found 1 record} other{Found {1} records}}"
     msgstr "{placeholder,plural,=0{Ningún resultado} =1{1 resultado} other{{1} resultados}}"

And in the application use the following code to output either of the
translations for such string::

    __('{0,plural,=0{No records found }=1{Found 1 record} other{Found # records}}', [0]);

    // Returns "Ningún resultado" as the argument {0} is 0

    __('{0,plural,=0{No records found} =1{Found 1 record} other{Found # records}}', [1]);

    // Returns "1 resultado" because the argument {0} is 1

    __('{placeholder,plural,=0{No records found} =1{Found 1 record} other{Found {1} records}}', [0, 'many', 'placeholder' => 2])

    // Returns "many resultados" because the argument {placeholder} is 2 and
    // argument {1} is 'many'

A closer look to the format we just used will make it evident how messages are
built::

    { [count placeholder],plural, case1{message} case2{message} case3{...} ... }

The ``[count placeholder]`` can be the array key number of any of the variables
you pass to the translation function. It will be used for selecting the correct
plural form.

Note that to reference ``[count placeholder]`` within ``{message}`` you have to
use ``#``.

You can of course use simpler message ids if you don't want to type the full
plural selection sequence in your code

.. code-block:: pot
=======
Controlling the Translation Order
=================================

The Configure value ``I18n.preferApp`` can be used to control the order of translations.
If set to true in bootstrap it will prefer the app translations over any plugins' ones::

    Configure::write('I18n.preferApp', true);

It defaults to ``false``.

.. versionadded:: 2.6

Localization in CakePHP
=======================
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

     msgid "search.results"
     msgstr "{0,plural,=0{Ningún resultado} =1{1 resultado} other{{1} resultados}}"

Then use the new string in your code::

<<<<<<< HEAD
    __('search.results', [2, 2]);
=======
This tells CakePHP which locale to use (if you use a regional locale, such as
`fr\_FR`, it will use the `ISO 639-2
<http://www.loc.gov/standards/iso639-2/php/code_list.php>`_ locale as a fallback
if it doesn't exist), you can change the language at any time during a request.
e.g. in your bootstrap if you're setting the application default language, in
your (app) controller beforeFilter if it's specific to the request or user, or
in fact anytime at all before you want a message in a different language. To
set the language for the current user, you can store the setting in the Session
object, like this::
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    // Returns: "2 resultados"

The latter version has the downside that there is a need to have a translation
messages file even for the default language, but has the advantage that it makes
the code more readable and leaves the complicated plural selection strings in
the translation files.

Sometimes using direct number matching in plurals is impractical. For example,
languages like Arabic require a different plural when you refer
to few things and other plural form for many things. In those cases you can
use the ICU matching aliases. Instead of writing::

    =0{No results} =1{...} other{...}

You can do::

    zero{No Results} one{One result} few{...} many{...} other{...}

Make sure you read the
`Language Plural Rules Guide <http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html>`_
to get a complete overview of the aliases you can use for each language.

Using Gettext Plural Selection
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The second plural selection format accepted is using the built-in capabilities
of Gettext. In this case, plurals will be stored in the ``.po``
file by creating a separate message translation line per plural form:

.. code-block:: pot

    # One message identifier for singular
    msgid "One file removed"
    # Another one for plural
    msgid_plural "{0} files removed"
    # Translation in singular
    msgstr[0] "Un fichero eliminado"
    # Translation in plural
    msgstr[1] "{0} ficheros eliminados"

When using this other format, you are required to use another translation
function::

    // Returns: "10 ficheros eliminados"
    $count = 10;
    __n('One file removed', '{0} files removed', $count, $count);

    // It is also possible to use it inside a domain
    __dn('my_plugin', 'One file removed', '{0} files removed', $count, $count);

The number inside ``msgstr[]`` is the number assigned by Gettext for the plural
form of the language. Some languages have more than two plural forms, for
example Croatian:

.. code-block:: pot

    msgid "One file removed"
    msgid_plural "{0} files removed"
    msgstr[0] "{0} datoteka je uklonjena"
    msgstr[1] "{0} datoteke su uklonjene"
    msgstr[2] "{0} datoteka je uklonjeno"

Please visit the `Launchpad languages page <https://translations.launchpad.net/+languages>`_
for a detailed explanation of the plural form numbers for each language.

Creating Your Own Translators
=============================

If you need to diverge from CakePHP conventions regarding where and how
translation messages are stored, you can create your own translation message
loader. The easiest way to create your own translator is by defining a loader
for a single domain and locale::

    use Aura\Intl\Package;

    I18n::setTranslator('animals', function () {
        $package = new Package(
            'default', // The formatting strategy (ICU)
            'default'  // The fallback domain
        );
        $package->setMessages([
            'Dog' => 'Chien',
            'Cat' => 'Chat',
            'Bird' => 'Oiseau'
            ...
        ]);

        return $package;
    }, 'fr_FR');

The above code can be added to your **config/bootstrap.php** so that
translations can be found before any translation function is used. The absolute
minimum that is required for creating a translator is that the loader function
should return a ``Aura\Intl\Package`` object. Once the code is in place you can
use the translation functions as usual::

    // Prior to 3.5 use I18n::locale()
    I18n::setLocale('fr_FR');
    __d('animals', 'Dog'); // Returns "Chien"

As you see, ``Package`` objects take translation messages as an array. You can
pass the ``setMessages()`` method however you like: with inline code, including
another file, calling another function, etc. CakePHP provides a few loader
functions you can reuse if you just need to change where messages are loaded.
For example, you can still use **.po** files, but loaded from another location::

    use Cake\I18n\MessagesFileLoader as Loader;

    // Load messages from src/Locale/folder/sub_folder/filename.po
    // Prior to 3.5 use translator()
    I18n::setTranslator(
        'animals',
        new Loader('filename', 'folder/sub_folder', 'po'),
        'fr_FR'
    );

Creating Message Parsers
------------------------

It is possible to continue using the same conventions CakePHP uses, but use
a message parser other than ``PoFileParser``. For example, if you wanted to load
translation messages using ``YAML``, you will first need to created the parser
class::

    namespace App\I18n\Parser;

    class YamlFileParser
    {

        public function parse($file)
        {
            return yaml_parse_file($file);
        }
    }

<<<<<<< HEAD
The file should be created in the **src/I18n/Parser** directory of your
application. Next, create the translations file under
**src/Locale/fr_FR/animals.yaml**

.. code-block:: yaml

    Dog: Chien
    Cat: Chat
    Bird: Oiseau

And finally, configure the translation loader for the domain and locale::
=======
Doing this will ensure that both :php:class:`I18n` and
:php:class:`TranslateBehavior` access the same language value.

It's a good idea to serve up public content available in multiple
languages from a unique URL - this makes it easy for users (and
search engines) to find what they're looking for in the language
they are expecting. There are several ways to do this, it can be by
using language specific subdomains (en.example.com,
fra.example.com, etc.), or using a prefix to the URL such as is
done with this application. You may also wish to glean the
information from the browser's user-agent, among other things.

As mentioned in the previous section, displaying localized content
is done using the :php:func:`__()` convenience function, or one of the other
translation functions all of which are globally available, but
probably be best utilized in your views. The first parameter of the
function is used as the msgid defined in the .po files.

CakePHP will automatically assume that all model validation error messages in
your ``$validate`` array are intended to be localized. When running the i18n
shell these strings will also be extracted.

There's one other aspect of localizing your application which is
not covered by the use of the translate functions, and that is
date/money formats. Don't forget that CakePHP is PHP :), therefore
to set the formats for these things you need to use
`setlocale <https://secure.php.net/setlocale>`_.

If you pass a locale that doesn't exist on your computer to
`setlocale <https://secure.php.net/setlocale>`_ it will have no
effect. You can find the list of available locales by running the
command ``locale -a`` in a terminal.

Translating model validation errors
===================================

CakePHP will automatically extract the validation error when you are using the
:doc:`i18n console task </console-and-shells/i18n-shell>`. By default, the default domain is used.
This can be overwritten by setting the ``$validationDomain`` property in your model::

    class User extends AppModel {

        public $validationDomain = 'validation_errors';
    }
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    use Cake\I18n\MessagesFileLoader as Loader;

    // Prior to 3.5 use translator()
    I18n::setTranslator(
        'animals',
        new Loader('animals', 'fr_FR', 'yaml'),
        'fr_FR'
    );

.. _creating-generic-translators:

Creating Generic Translators
----------------------------

Configuring translators by calling ``I18n::setTranslator()`` for each domain and
locale you need to support can be tedious, specially if you need to support more
than a few different locales. To avoid this problem, CakePHP lets you define
generic translator loaders for each domain.

Imagine that you wanted to load all translations for the default domain and for
any language from an external service::

    use Aura\Intl\Package;

    I18n::config('default', function ($domain, $locale) {
        $locale = Locale::parseLocale($locale);
        $language = $locale['language'];
        $messages = file_get_contents("http://example.com/translations/$lang.json");

        return new Package(
            'default', // Formatter
            null, // Fallback (none for default domain)
            json_decode($messages, true)
        )
    });

The above example calls an example external service to load a JSON file with the
translations and then just build a ``Package`` object for any locale that is
requested in the application.

If you'd like to change how packages are loaded for all packages, that don't
have specific loaders set you can replace the fallback package loader by using
the ``_fallback`` package::

    I18n::config('_fallback', function ($domain, $locale) {
        // Custom code that yields a package here.
    });

.. versionadded:: 3.4.0
    Replacing the ``_fallback`` loader was added in 3.4.0

Plurals and Context in Custom Translators
-----------------------------------------

The arrays used for ``setMessages()`` can be crafted to instruct the translator
to store messages under different domains or to trigger Gettext-style plural
selection. The following is an example of storing translations for the same key
in different contexts::

    [
        'He reads the letter {0}' => [
            'alphabet' => 'Él lee la letra {0}',
            'written communication' => 'Él lee la carta {0}'
        ]
    ]

Similarly, you can express Gettext-style plurals using the messages array by
having a nested array key per plural form::

    [
        'I have read one book' => 'He leído un libro',
        'I have read {0} books' => [
            'He leído un libro',
            'He leído {0} libros'
        ]
    ]

Using Different Formatters
--------------------------

In previous examples we have seen that Packages are built using ``default`` as
first argument, and it was indicated with a comment that it corresponded to the
formatter to be used. Formatters are classes responsible for interpolating
variables in translation messages and selecting the correct plural form.

If you're dealing with a legacy application, or you don't need the power offered
by the ICU message formatting, CakePHP also provides the ``sprintf`` formatter::

    return Package('sprintf', 'fallback_domain', $messages);

The messages to be translated will be passed to the ``sprintf()`` function for
interpolating the variables::

    __('Hello, my name is %s and I am %d years old', 'José', 29);

It is possible to set the default formatter for all translators created by
CakePHP before they are used for the first time. This does not include manually
created translators using the ``setTranslator()`` and ``config()`` methods::

    I18n::defaultFormatter('sprintf');

Localizing Dates and Numbers
============================

When outputting Dates and Numbers in your application, you will often need that
they are formatted according to the preferred format for the country or region
that you wish your page to be displayed.

In order to change how dates and numbers are displayed you just need to change
the current locale setting and use the right classes::

    use Cake\I18n\I18n;
    use Cake\I18n\Time;
    use Cake\I18n\Number;

    // Prior to 3.5 use I18n::locale()
    I18n::setLocale('fr-FR');

    $date = new Time('2015-04-05 23:00:00');

    echo $date; // Displays 05/04/2015 23:00

    echo Number::format(524.23); // Displays 524,23

Make sure you read the :doc:`/core-libraries/time` and :doc:`/core-libraries/number`
sections to learn more about formatting options.

By default dates returned for the ORM results use the ``Cake\I18n\Time`` class,
so displaying them directly in you application will be affected by changing the
current locale.

.. _parsing-localized-dates:

Parsing Localized Datetime Data
-------------------------------

When accepting localized data from the request, it is nice to accept datetime
information in a user's localized format. In a controller, or
:doc:`/development/dispatch-filters` you can configure the Date, Time, and
DateTime types to parse localized formats::

    use Cake\Database\Type;

    // Enable default locale format parsing.
    Type::build('datetime')->useLocaleParser();

    // Configure a custom datetime format parser format.
    Type::build('datetime')->useLocaleParser()->setLocaleFormat('dd-M-y');

    // You can also use IntlDateFormatter constants.
    Type::build('datetime')->useLocaleParser()
        ->setLocaleFormat([IntlDateFormatter::SHORT, -1]);

The default parsing format is the same as the default string format.

Automatically Choosing the Locale Based on Request Data
=======================================================

By using the ``LocaleSelectorFilter`` in your application, CakePHP will
automatically set the locale based on the current user::

    // in src/Application.php
    use Cake\I18n\Middleware\LocaleSelectorMiddleware;

    // Update the middleware function, adding the new middleware
    public function middleware($middleware)
    {
        // Add middleware and set the valid locales
        $middleware->add(new LocaleSelectorMiddleware(['en_US', 'fr_FR']));
    }

    // Prior to 3.3.0, use the DispatchFilter
    // in config/bootstrap.php
    DispatcherFactory::add('LocaleSelector');

    // Restrict the locales to only en_US, fr_FR
    DispatcherFactory::add('LocaleSelector', ['locales' => ['en_US', 'fr_FR']]);

The ``LocaleSelectorFilter`` will use the ``Accept-Language`` header to
automatically set the user's preferred locale. You can use the locale list
option to restrict which locales will automatically be used.


.. meta::
    :title lang=en: Internationalization & Localization
    :keywords lang=en: internationalization localization,internationalization and localization,language application,gettext,l10n,pot,i18n,translation,languages
