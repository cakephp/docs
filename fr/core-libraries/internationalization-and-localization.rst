Internationalisation & Localisation
###################################

L'une des meilleurs façons pour que votre application ait une audience plus
large est de gérer plusieurs langues. Cela peut souvent se révéler être une
tâche gigantesque, mais les fonctionnalités d'internationalisation et de
localisation dans CakePHP rendront cela plus facile.

D'abord il est important de comprendre quelques terminologies.
*Internationalisation* se réfère a la possibilité qu'a une application d'être
localisée. Le terme *localisation* se réfère à l'adaptation qu'a une
application de répondre aux besoins d'une langue (ou culture) spécifique
(par ex: un "locale"). L'internationalisation et la localisation sont souvent
abrégées en respectivement i18n et l10n; 18 et 10 sont le nombre de caractères
entre le premier et le dernier caractère.

Internationaliser Votre Application
===================================

Il n'y a que quelques étapes à franchir pour passer d'une application
mono-langue à une application multi-langue, la première est
d'utiliser la fonction :php:func:`__()` dans votre code.
Ci-dessous un exemple d'un code pour une application mono-langue::

    <h2>Popular Articles</h2>

Pour internationaliser votre code, la seule chose à faire est d'entourer
la chaîne avec :php:func:`__()` comme ceci::

    <h2><?= __('Popular Articles') ?></h2>

Si vous ne faîtes rien de plus, ces deux bouts de codes donneront un résultat
identique - ils renverront le même contenu au navigateur.
La fonction :php:func:`__()` traduira la chaîne passée si une
traduction est disponible, sinon elle la renverra non modifiée.

Fichiers de Langues
-------------------

Les traductions peuvent être mis à disposition en utilisant des fichiers 
de langue stockés dans votre application. Le format par défaut pour ces fichiers est
le format `Gettext <http://en.wikipedia.org/wiki/Gettext>`_. Ces fichiers doivent être
placés dans ``src/Locale/`` et dans ce répertoire, il devrait y avoir
un sous-dossier par langue que l'application doit prendre en charge::


    /src
        /Locale
            /en_US
                default.po
            /en_GB
                default.po
                validation.po
            /es
                default.po

Le domaine par défaut est 'default', votre dossier ``locale`` devrait donc 
contenir au minimum le fichier ``default.po`` (cf. ci-dessus). Un domaine se réfère à un regroupement
arbitraire de messages de traduction. Si aucun groupe n'est utilisé, le groupe par défaut
est sélectionné.

Les plugins peuvent également contenir des fichiers de traduction, la convention est d'utiliser la version 
``under_scored`` du nom du plugin comme domaine de la traduction des messages::

    MyPlugin
        /src
            /Locale
                /fr
                    my_plugin.po
                /de
                    my_plugin.po

Les dossiers de traduction peuvent être composées d'un code à deux lettres ISO de 
la langue ou du nom de la locale, par exemple ``fr_FR``, ``es_AR``, ``da_DK``, 
qui contient en même temps la langue et le pays où elle est parlée.

Un fichier de traduction pourrait ressembler à ceci :

.. code-block:: pot

     msgid "My name is {0}"
     msgstr "Je m'appelle {0}"

     msgid "I'm {0,number} years old"
     msgstr "J'ai {0,number} ans"

Définir la Locale par Défaut
----------------------------

La ``locale``par défaut se détermine dans le fichier ``config/bootstrap.php``
via::

    ini_set('intl.default_locale', 'fr_FR');

Cela permet de contrôler plusieurs aspects de votre application, incluant la langue 
de traduction par défaut, le format des dates, des nombres, et devises 
à chaque fois qu'un de ces éléments s'affiche, en utilisant les bibliothèques 
de localisation fournies par CakePHP.

Changing the Locale at Runtime
------------------------------

To change the language for translated strings you can call this method::

    use Cake\I18n\I18n;

    I18n::locale('de_DE');

This will also change how numbers and dates are formatted when using one of
the localization tools.

Using Translation Functions
===========================

CakePHP provides several functions that will help you internationalize your
application. The most frequently used one is :php:func:`__()`. This function
is used to retrieve a single translation message or return the same string if no
translation was found::

    echo __('Popular Articles');

If you need to group your messages, for example, translations inside a plugin,
you can use the :php:func:`__d()` function to fetch messages from another domain::

    echo __d('my_plugin', 'Trending right now');

Sometimes translations strings can be ambiguous for people translating them.
This can happen if two strings are identical but refer to different things. For
example, 'letter' has multiple meanings in english. To solve that problem, you
can use the :php:func:`__x()` function::

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
`ICU MessageFormatter <http://php.net/manual/en/messageformatter.format.php>`_
so you and translate messages and localize dates, numbers and
currency at the same time::

    echo __(
        'Hi {0,string}, your balance on the {1,date} is {2,number,currency}',
        ['Charles', '2014-01-13 11:12:00', 1354.37]
    );

    // Returns
    Hi Charles, your balance on the Jan 13, 2014, 11:12 AM is $ 1,354.37


Numbers in placeholders can be formatted as well with fine grain control of the
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

This is the list of formatter specifiers you can put after the word ``number``:

* ``integer``: Removes the decimal part
* ``decimal``: Formats the number as a float
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

    If you are using PHP 5.5+, you can use also named placeholders like {name}
    {age}, etc. And pass the variables in an array having the corresponding key
    names like ``['name' => 'Sara', 'age' => 12]``. This feature is not available
    in PHP 5.4.

Plurals
-------

One crucial part of internationalizing your application is getting your messages
pluralized correctly depending on the language they are shown. CakePHP provides
a couple ways to correctly select plurals in your messages.

Using ICU Plural Selection
~~~~~~~~~~~~~~~~~~~~~~~~~~

The first one is taking advantage of the ``ICU`` message format that comes
by default in the translation functions. In the translations file you could have
the following strings

.. code-block:: pot

     msgid "{0,plural,=0{No records found} =1{Found 1 record} other{Found {1} records}}"
     msgstr "{0,plural,=0{Ningún resultado} =1{1 resultado} other{{1} resultados}}"

And in your application use the following code to output either of the
translations for such string::

    __('{0,plural,=0{No records found }=1{Found 1 record} other{Found {1} records}}', [0]);

    // Returns "Ningún resultado" as the argument {0} is 0

    __('{0,plural,=0{No records found} =1{Found 1 record} other{Found {1} records}}', [1]);

    // Returns "1 resultado" because the argument {0} is 1

    __('{0,plural,=0{No records found} =1{Found 1 record} other{Found {1} records}}', [2, 2]);

    // Returns "2 resultados" because the argument {0} is 2

A closer look to the format we just used will make it evident how messages are
built::

    { [count placeholder],plural, case1{message} case2{message} case3{...} ... }

The ``[count placeholder]`` can be the array key number of any of the variables
you pass to the translation function. It will be used for selecting the correct
plural form.

You can of course use simpler message ids if you don't want to type the full
plural selection sequence in your code

.. code-block:: pot

     msgid "search.results"
     msgstr "{0,plural,=0{Ningún resultado} =1{1 resultado} other{{1} resultados}}"

Then use the new string in your code::

    __('search.results', [2, 2]);

    // Returns: "2 resultados"

The latter version has the downside that you will need to have a translation
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
file by creating a separate message translation line per plural form

.. code-block:: pot

    msgid "One file removed" # One message identifier for singular
    msgid_plural "{0} files removed" # Another one for plural
    msgstr[0] "Un fichero eliminado" # Translation in singular
    msgstr[1] "{0} ficheros eliminados" # Translation in plural

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
    msgstr[0] "jednom datotekom je uklonjen"
    msgstr[1] "{0} datoteke uklonjenih"
    msgstr[2] "{0} slika uklonjenih"

Please visit the `Launchpad languages page <https://translations.launchpad.net/+languages>`_
for a detailed explanation of the plural form numbers for each language.

Creating Your Own Translators
=============================

If you need to diverge from CakePHP conventions regarding where and how
translation messages are stored, you can create your own translation message
loader. The easiest way to create your own translator is by defining a loader
for a single domain and locale::

    use Aura\Intl\Package;

    I18n::translator('animals', 'fr_FR', function () {
        $package = new Package(
            'default', // The formatting strategy (ICU)
            'default', // The fallback domain
        );
        $package->setMessages([
            'Dog' => 'Chien',
            'Cat' => 'Chat',
            'Bird' => 'Oiseau'
            ...
        ]);

        return $package;
    });

The above code can be added to your ``config/bootstrap.php`` so that
translations can be found before any translation function is used. The absolute
minimum that is required for creating a translator is that the loader function
should return a ``Aura\Intl\Package`` object. Once the code is in place you can
use the translation functions as usual::

    I18n::locale('fr_FR');
    __d('animals', 'Dog'); // Returns "Chien"

As you see, ``Package`` objects take translation messages as an array. You can
pass the ``setMessages()`` method however you like: with inline code, including
another file, calling another function, etc. CakePHP provides a few loader
functions you can reuse if you just need to change where messages are loaded.
For example, you can still use ``.po`` files, but loaded from another location::

    use Cake\I18n\MessagesFileLoader as Loader;

    // Load messages from src/Locale/folder/sub_folder/filename.po

    I18n::translator(
        'animals',
        'fr_FR',
        new Loader('filename', 'folder/sub_folder', 'po')
    );

Creating Message Parsers
------------------------

It is possible to continue using the same conventions CakePHP uses, but use
a message parser other than ``PoFileParser``. For example, if you wanted to load
translation messages using ``YAML``, you will first need to created the parser
class::

    namespace App\I18n\Parser;

    class YamlFileParser {

        public function parse($file) {
            return yaml_parse_file($file);
        }
    }

The file should be created in the ``src/I18n/Parser`` directory of your
application. Next, create the translations file under
``src/Locale/fr_FR/animals.yaml``

.. code-block:: yaml

    Dog: Chien
    Cat: Chat
    Bird: Oiseau

And finally, configure the translation loader for the domain and locale::

    use Cake\I18n\MessagesFileLoader as Loader;
    I18n::translator(
        'animals',
        'fr_FR',
        new Loader('animals', 'fr_FR', 'yaml')
    );

Creating Generic Translators
----------------------------

Configuring translators by calling ``I18n::translator()`` for each domain and
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

The above example calls an example external service to load a json file with the
translations and then just build a ``Package`` object for any locale that is
requested in the application.

Plurals and Context in Custom Translators
-----------------------------------------

The arrays used for ``setMessages()`` can be crafted to instruct the translator
to store messages under different domains or to trigger Gettext-style plural selection.
The following is an example of storing translations for the same key in
different contexts::

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
formatter to be used. Formatters are  classes responsible for interpolating variables
in translation messages and selecting the correct plural form.

If you're dealing with a legacy application, or you don't need the power offered
by the ICU message formatting, CakePHP also provides the ``sprintf`` formatter::

    return Package('sprintf', 'fallback_domain', $messages);

The messages to be translated will be passed to the ``sprintf`` function for
interpolating the variables::

    __('Hello, my name is %s and I am %d years old', 'José', 29);

It is possible to set the default formatter for all translators created by
CakePHP before they are used for the first time. This does not include manually
created translators using the ``translator()`` and ``config()`` methods::

    I18n::defaultFormatter('sprintf');


.. meta::
    :title lang=fr: Internationalization & Localization
    :keywords lang=fr: internationalization localization,internationalization et localization,localization features,language application,gettext,l10n,daunting task,adaptation,pot,i18n,audience,traduction,languages
