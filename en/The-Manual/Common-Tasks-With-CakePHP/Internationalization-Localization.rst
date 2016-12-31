Internationalization & Localization
###################################

One of the best ways for your applications to reach a larger audience is
to cater for multiple languages. This can often prove to be a daunting
task, but the internationalization and localization features in CakePHP
make it much easier.

First, it’s important to understand some terminology.
*Internationalization* refers to the ability of an application to be
localized. The term *localization* refers to the adaptation of an
application to meet specific language (or culture) requirements (i.e., a
"locale"). Internationalization and localization are often abbreviated
as i18n and l10n respectively; 18 and 10 are the number of characters
between the first and last character.

Internationalizing Your Application
===================================

There are only a few steps to go from a single-language application to a
multi-lingual application, the first of which is to make use of the
```__()`` <https://api.cakephp.org/file/cake/basics.php#function-__>`_
function in your code. Below is an example of some code for a
single-language application:

::

    <h2>Posts</h2>

To internationalize your code, all you need to do is to wrap strings in
`the translate
function <https://api.cakephp.org/file/cake/basics.php#function-__>`_
like so:

::

    <h2><?php __('Posts') ?></h2>

If you do nothing further, these two code examples are functionally
identical - they will both send the same content to the browser. The
```__()``
function <https://api.cakephp.org/file/cake/basics.php#function-__>`_
will translate the passed string if a translation is available, or
return it unmodified. It works similar to other
`Gettext <https://en.wikipedia.org/wiki/Gettext>`_ implementations (as do
the other translate functions, such as
```__d()`` <https://api.cakephp.org/file/cake/basics.php#function-__d>`_,
```__n()`` <https://api.cakephp.org/file/cake/basics.php#function-__n>`_
etc)

With your code ready to be multilingual, the next step is to create your
`pot file <https://en.wikipedia.org/wiki/Gettext>`_, which is the
template for all translatable strings in your application. To generate
your pot file(s), all you need to do is run the `i18n console
task <https://book.cakephp.org/view/620/Core-Console-Applications>`_,
which will look for where you've used a translate function in your code
and generate your pot file(s) for you. You can and should re-run this
console task any time you change the translations in your code.

The pot file(s) themselves are not used by CakePHP, they are the
templates used to create or update your `po
files <https://en.wikipedia.org/wiki/Gettext>`_, which contain the
translations. Cake will look for your po files in the following
location:

::

    /app/locale/<locale>/LC_MESSAGES/<domain>.po

The default domain is 'default', therefore your locale folder would look
something like this:

::

    /app/locale/eng/LC_MESSAGES/default.po (English)   
    /app/locale/fre/LC_MESSAGES/default.po (French)   
    /app/locale/por/LC_MESSAGES/default.po (Portuguese) 

To create or edit your po files it's recommended that you do *not* use
your favorite editor. To create a po file for the first time it is
possible to copy the pot file to the correct location and change the
extension *however* unless you're familiar with their format, it's quite
easy to create an invalid po file or to save it as the wrong charset (if
you're editing manually, use UTF-8 to avoid problems). There are free
tools such as `PoEdit <http://www.poedit.net>`_ which make editing and
updating your po files an easy task; especially for updating an existing
po file with a newly updated pot file.

The three-character locale codes conform to the `ISO
639-2 <http://www.loc.gov/standards/iso639-2/php/code_list.php>`_
standard, although if you create regional locales (en\_US, en\_GB, etc.)
cake will use them if appropriate.

there is a 1014-character limit for each msgstr value (source needed).

Remember that po files are useful for short messages, if you find you
want to translate long paragraphs, or even whole pages - you should
consider implementing a different solution. e.g.:

::

    // App Controller Code.
    function beforeFilter() {
        $locale = Configure::read('Config.language');
        if ($locale && file_exists(VIEWS . $locale . DS . $this->viewPath)) {
            // e.g. use /app/views/fre/pages/tos.ctp instead of /app/views/pages/tos.ctp
            $this->viewPath = $locale . DS . $this->viewPath;
        }
    }

or

::

    // View code
    echo $this->element(Configure::read('Config.language') . '/tos')

Localization in CakePHP
=======================

To change or set the language for your application, all you need to do
is the following:

::

    Configure::write('Config.language', 'fre');

This tells Cake which locale to use (if you use a regional locale, such
as fr\_FR, it will use the `ISO
639-2 <http://www.loc.gov/standards/iso639-2/php/code_list.php>`_ locale
as a fallback if it doesn't exist), you can change the language at any
time, e.g. in your bootstrap if you're setting the application default
language, in your (app) controller beforeFilter if it's specific to the
request or user, or in fact anytime at all before you want a message in
a different language.

It's a good idea to serve up public content available in multiple
languages from a unique url - this makes it easy for users (and search
engines) to find what they're looking for in the language they are
expecting. There are several ways to do this, it can be by using
language specific subdomains (en.example.com, fra.example.com, etc.), or
using a prefix to the url such as is done with this application. You may
also wish to glean the information from the browser’s user-agent, among
other things.

As mentioned in the previous section, displaying localized content is
done using the \_\_() convenience function, or one of the other
translation functions all of which are globally available, but probably
be best utilized in your views. The first parameter of the function is
used as the msgid defined in the .po files.

Remember to use the return parameter for the various ``__*`` methods if
you don't want the string echo'ed directly. For example:

::

    <?php
    echo $form->error(
        'Card.cardNumber',
        __("errorCardNumber", true),
        array('escape' => false)
    );
    ?>

If you would like to have all of your validation error messages
translated by default, a simple solution would be to add the following
code in you app\_model.php:

::

    function invalidate($field, $value = true) {
        return parent::invalidate($field, __($value, true));
    }

The i18n console task will not be able to determine the message id from
the above example, which means you'll need to add the entries to your
pot file manually (or via your own script). To prevent the need to edit
your default.po(t) file every time you run the i18n console task, you
can use a different domain such as:

::

    function invalidate($field, $value = true) {
        return parent::invalidate($field, __d('validation_errors', $value, true));
    }

This will look for ``$value`` in the validation\_errors.po file.

There's one other aspect of localizing your application which is not
covered by the use of the translate functions, and that is date/money
formats. Don't forget that CakePHP is PHP :), therefore to set the
formats for these things you need to use
```setlocale`` <http://www.php.net/setlocale>`_.

If you pass a locale that doesn't exist on your computer to
```setlocale`` <http://www.php.net/setlocale>`_ it will have no effect.
You can find the list of available locales by running the command
$locale -a in a terminal.
