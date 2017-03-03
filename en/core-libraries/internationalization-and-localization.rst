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

Internationalizing Your Application
===================================

There are only a few steps to go from a single-language application
to a multi-lingual application, the first of which is to make use
of the :php:func:`__()` function in your code. Below is an example of some code for a
single-language application::

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

or::

    // View code
    echo $this->element(Configure::read('Config.language') . '/tos');

.. _lc-time:

For translation of strings of LC_TIME category CakePHP uses POSIX compliant LC_TIME
files. The i18n functions of :php:class:`CakeTime` utility class and helper :php:class:`TimeHelper`
use these LC_TIME files.

Just place LC_TIME file in its respective locale directory::

    /app/Locale/fra/LC_TIME (French)
    /app/Locale/por/LC_TIME (Portuguese)

You can find these files for few popular languages from the official `Localized <https://github.com/cakephp/localized>`_
repo.

Internationalizing CakePHP Plugins
==================================

If you want to include translation files within your application you'll need to
follow a few conventions.

Instead of `__()` and `__n()` you will have to use `__d()` and `__dn()`. The D means
domain. So if you have a plugin called 'DebugKit' you would have to do this::

    __d('debug_kit', 'My example text');

Using the underscored syntax is important, if you don't use it CakePHP won't
find your translation file.

Your translation file for this example should go into::

    /app/Plugin/DebugKit/Locale/<locale>/LC_MESSAGES/<domain>.po

And for other languages than the default::

    /app/Plugin/DebugKit/Locale/eng/LC_MESSAGES/debug_kit.po (English)
    /app/Plugin/DebugKit/Locale/fra/LC_MESSAGES/debug_kit.po (French)
    /app/Plugin/DebugKit/Locale/por/LC_MESSAGES/debug_kit.po (Portuguese)

The reason for that is that CakePHP will use the lower cased and underscored
plugin name to compare it to the translation domain and is going to look into
the plugin if there is a match for the given translation file.

Controlling the Translation Order
=================================

The Configure value ``I18n.preferApp`` can be used to control the order of translations.
If set to true in bootstrap it will prefer the app translations over any plugins' ones::

    Configure::write('I18n.preferApp', true);

It defaults to ``false``.

.. versionadded:: 2.6

Localization in CakePHP
=======================

To change or set the language for your application, all you need to
do is the following::

    Configure::write('Config.language', 'fra');

This tells CakePHP which locale to use (if you use a regional locale, such as
`fr\_FR`, it will use the `ISO 639-2
<http://www.loc.gov/standards/iso639-2/php/code_list.php>`_ locale as a fallback
if it doesn't exist), you can change the language at any time during a request.
e.g. in your bootstrap if you're setting the application default language, in
your (app) controller beforeFilter if it's specific to the request or user, or
in fact anytime at all before you want a message in a different language. To
set the language for the current user, you can store the setting in the Session
object, like this::

    $this->Session->write('Config.language', 'fra');

At the beginning of each request in your controller's ``beforeFilter`` you
should configure ``Configure`` as well::

    class AppController extends Controller {
        public function beforeFilter() {
            if ($this->Session->check('Config.language')) {
                Configure::write('Config.language', $this->Session->read('Config.language'));
            }
        }
    }

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

Additional parameters defined in the validation rule are passed to the translation
function. This allows you to create dynamic validation messages::

    class User extends AppModel {

        public $validationDomain = 'validation';

        public $validate = array(
            'username' => array(
                    'length' => array(
                    'rule' => array('between', 2, 10),
                    'message' => 'Username should be between %d and %d characters'
                )
            )
        )
    }

Which will do the following internal call::

    __d('validation', 'Username should be between %d and %d characters', array(2, 10));


.. meta::
    :title lang=en: Internationalization & Localization
    :keywords lang=en: internationalization localization,internationalization and localization,localization features,language application,gettext,l10n,daunting task,adaptation,pot,i18n,audience,translation,languages
