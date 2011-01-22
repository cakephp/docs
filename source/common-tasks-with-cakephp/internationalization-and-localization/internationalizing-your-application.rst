4.8.1 Internationalizing Your Application
-----------------------------------------

There are only a few steps to go from a single-language application
to a multi-lingual application, the first of which is to make use
of the
```__()`` <http://api.cakephp.org/file/cake/basics.php#function-__>`_
function in your code. Below is an example of some code for a
single-language application:

::

    <h2>Posts</h2>

To internationalize your code, all you need to do is to wrap
strings in
`the translate function <http://api.cakephp.org/file/cake/basics.php#function-__>`_
like so:

::

    <h2><?php __('Posts') ?></h2>

If you do nothing further, these two code examples are functionally
identical - they will both send the same content to the browser.
The
```__()`` function <http://api.cakephp.org/file/cake/basics.php#function-__>`_
will translate the passed string if a translation is available, or
return it unmodified. It works similar to other
`Gettext <http://en.wikipedia.org/wiki/Gettext>`_ implementations
(as do the other translate functions, such as
```__d()`` <http://api.cakephp.org/file/cake/basics.php#function-__d>`_,
```__n()`` <http://api.cakephp.org/file/cake/basics.php#function-__n>`_
etc)

With your code ready to be multilingual, the next step is to create
your `pot file <http://en.wikipedia.org/wiki/Gettext>`_, which is
the template for all translatable strings in your application. To
generate your pot file(s), all you need to do is run the
`i18n console task <http://book.cakephp.org/view/1521/Core-Console-Applications>`_,
which will look for where you've used a translate function in your
code and generate your pot file(s) for you. You can and should
re-run this console task any time you change the translations in
your code.

The pot file(s) themselves are not used by CakePHP, they are the
templates used to create or update your
`po files <http://en.wikipedia.org/wiki/Gettext>`_, which contain
the translations. Cake will look for your po files in the following
location:

::

    /app/locale/<locale>/LC_MESSAGES/<domain>.po

The default domain is 'default', therefore your locale folder would
look something like this:

::

    /app/locale/eng/LC_MESSAGES/default.po (English)   
    /app/locale/fre/LC_MESSAGES/default.po (French)   
    /app/locale/por/LC_MESSAGES/default.po (Portuguese) 

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
standard, although if you create regional locales (en\_US, en\_GB,
etc.) cake will use them if appropriate.

there is a 1014-character limit for each msgstr value (source
needed).

Remember that po files are useful for short messages, if you find
you want to translate long paragraphs, or even whole pages - you
should consider implementing a different solution. e.g.:

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
