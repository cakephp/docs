4.8.2 Localization in CakePHP
-----------------------------

To change or set the language for your application, all you need to
do is the following:

::

    Configure::write('Config.language', 'fre');


#. ``Configure::write('Config.language', 'fre');``

This tells Cake which locale to use (if you use a regional locale,
such as fr\_FR, it will use the
`ISO 639-2 <http://www.loc.gov/standards/iso639-2/php/code_list.php>`_
locale as a fallback if it doesn't exist), you can change the
language at any time, e.g. in your bootstrap if you're setting the
application default language, in your (app) controller beforeFilter
if it's specific to the request or user, or in fact anytime at all
before you want a message in a different language.

To set the language for the current user, store the setting in the
Session object, like this:

::

    $this->Session->write('Config.language', 'fre');


#. ``$this->Session->write('Config.language', 'fre');``

It's a good idea to serve up public content available in multiple
languages from a unique url - this makes it easy for users (and
search engines) to find what they're looking for in the language
they are expecting. There are several ways to do this, it can be by
using language specific subdomains (en.example.com,
fra.example.com, etc.), or using a prefix to the url such as is
done with this application. You may also wish to glean the
information from the browser’s user-agent, among other things.

As mentioned in the previous section, displaying localized content
is done using the \_\_() convenience function, or one of the other
translation functions all of which are globally available, but
probably be best utilized in your views. The first parameter of the
function is used as the msgid defined in the .po files.

Remember to use the return parameter for the various ``__*``
methods if you don't want the string echo'ed directly. For
example:

::

    <?php
    echo $form->error(
        'Card.cardNumber',
        __("errorCardNumber", true),
        array('escape' => false)
    );
    ?>


#. ``<?php``
#. ``echo $form->error(``
#. ``'Card.cardNumber',``
#. ``__("errorCardNumber", true),``
#. ``array('escape' => false)``
#. ``);``
#. ``?>``

If you would like to have all of your validation error messages
translated by default, a simple solution would be to add the
following code in you app\_model.php:

::

    function invalidate($field, $value = true) {
        return parent::invalidate($field, __($value, true));
    }


#. ``function invalidate($field, $value = true) {``
#. ``return parent::invalidate($field, __($value, true));``
#. ``}``

The i18n console task will not be able to determine the message id
from the above example, which means you'll need to add the entries
to your pot file manually (or via your own script). To prevent the
need to edit your default.po(t) file every time you run the i18n
console task, you can use a different domain such as:

::

    function invalidate($field, $value = true) {
        return parent::invalidate($field, __d('validation_errors', $value, true));
    }


#. ``function invalidate($field, $value = true) {``
#. ``return parent::invalidate($field, __d('validation_errors', $value, true));``
#. ``}``

This will look for ``$value`` in the validation\_errors.po file.

There's one other aspect of localizing your application which is
not covered by the use of the translate functions, and that is
date/money formats. Don't forget that CakePHP is PHP :), therefore
to set the formats for these things you need to use
```setlocale`` <http://www.php.net/setlocale>`_.

If you pass a locale that doesn't exist on your computer to
```setlocale`` <http://www.php.net/setlocale>`_ it will have no
effect. You can find the list of available locales by running the
command $locale -a in a terminal.

4.8.2 Localization in CakePHP
-----------------------------

To change or set the language for your application, all you need to
do is the following:

::

    Configure::write('Config.language', 'fre');


#. ``Configure::write('Config.language', 'fre');``

This tells Cake which locale to use (if you use a regional locale,
such as fr\_FR, it will use the
`ISO 639-2 <http://www.loc.gov/standards/iso639-2/php/code_list.php>`_
locale as a fallback if it doesn't exist), you can change the
language at any time, e.g. in your bootstrap if you're setting the
application default language, in your (app) controller beforeFilter
if it's specific to the request or user, or in fact anytime at all
before you want a message in a different language.

To set the language for the current user, store the setting in the
Session object, like this:

::

    $this->Session->write('Config.language', 'fre');


#. ``$this->Session->write('Config.language', 'fre');``

It's a good idea to serve up public content available in multiple
languages from a unique url - this makes it easy for users (and
search engines) to find what they're looking for in the language
they are expecting. There are several ways to do this, it can be by
using language specific subdomains (en.example.com,
fra.example.com, etc.), or using a prefix to the url such as is
done with this application. You may also wish to glean the
information from the browser’s user-agent, among other things.

As mentioned in the previous section, displaying localized content
is done using the \_\_() convenience function, or one of the other
translation functions all of which are globally available, but
probably be best utilized in your views. The first parameter of the
function is used as the msgid defined in the .po files.

Remember to use the return parameter for the various ``__*``
methods if you don't want the string echo'ed directly. For
example:

::

    <?php
    echo $form->error(
        'Card.cardNumber',
        __("errorCardNumber", true),
        array('escape' => false)
    );
    ?>


#. ``<?php``
#. ``echo $form->error(``
#. ``'Card.cardNumber',``
#. ``__("errorCardNumber", true),``
#. ``array('escape' => false)``
#. ``);``
#. ``?>``

If you would like to have all of your validation error messages
translated by default, a simple solution would be to add the
following code in you app\_model.php:

::

    function invalidate($field, $value = true) {
        return parent::invalidate($field, __($value, true));
    }


#. ``function invalidate($field, $value = true) {``
#. ``return parent::invalidate($field, __($value, true));``
#. ``}``

The i18n console task will not be able to determine the message id
from the above example, which means you'll need to add the entries
to your pot file manually (or via your own script). To prevent the
need to edit your default.po(t) file every time you run the i18n
console task, you can use a different domain such as:

::

    function invalidate($field, $value = true) {
        return parent::invalidate($field, __d('validation_errors', $value, true));
    }


#. ``function invalidate($field, $value = true) {``
#. ``return parent::invalidate($field, __d('validation_errors', $value, true));``
#. ``}``

This will look for ``$value`` in the validation\_errors.po file.

There's one other aspect of localizing your application which is
not covered by the use of the translate functions, and that is
date/money formats. Don't forget that CakePHP is PHP :), therefore
to set the formats for these things you need to use
```setlocale`` <http://www.php.net/setlocale>`_.

If you pass a locale that doesn't exist on your computer to
```setlocale`` <http://www.php.net/setlocale>`_ it will have no
effect. You can find the list of available locales by running the
command $locale -a in a terminal.
