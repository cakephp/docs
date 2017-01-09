I18N shell
##########

The i18n features of CakePHP use `po files <https://en.wikipedia.org/wiki/GNU_gettext>`_
as their translation source. This makes them easily to integrate with tools
like `poedit <http://www.poedit.net/>`_ and other common translation tools.

The i18n shell provides a quick and easy way to generate po template files.
These templates files can then be given to translators so they can translate the
strings in your application. Once you have translations done, pot files can be
merged with existing translations to help update your translations.

Generating POT files
====================

POT files can be generated for an existing application using the ``extract``
command. This command will scan your entire application for ``__()`` style
function calls, and extract the message string. Each unique string in your
application will be combined into a single POT file::

    ./Console/cake i18n extract

The above will run the extraction shell. In addition to extracting strings in ``__()``
methods, validation messages in models will be extracted as well. The result of
this command will be the file ``app/Locale/default.pot``. You use the pot file
as a template for creating po files. If you are manually creating po files from
the pot file, be sure to correctly set the ``Plural-Forms`` header line.

Generating POT files for plugins
--------------------------------

You can generate a POT file for a specific plugin using::

    ./Console/cake i18n extract --plugin <Plugin>

This will generate the required POT files used in the plugins.

Model validation messages
-------------------------

You can set the domain to be used for extracted validation messages in your models.
If the model already has a ``$validationDomain`` property, the given validation
domain will be ignored::

    ./Console/cake i18n extract --validation-domain validation_errors

You can also prevent the shell from extracting validation messages::

    ./Console/cake i18n extract --ignore-model-validation


Excluding folders
-----------------

You can pass a comma separated list of folders that you wish to be excluded.
Any path containing a path segment with the provided values will be ignored::

    ./Console/cake i18n extract --exclude Test,Vendor

Skipping overwrite warnings for existing POT files
--------------------------------------------------
.. versionadded:: 2.2

By adding ``--overwrite``, the shell script will no longer warn you if a POT file
already exists and will overwrite by default::

    ./Console/cake i18n extract --overwrite

Extracting messages from the CakePHP core libraries
---------------------------------------------------
.. versionadded:: 2.2

By default, the extract shell script will ask you if you like to extract
the messages used in the CakePHP core libraries. Set ``--extract-core`` to ``yes`` or
``no`` to set the default behavior.

::

    ./Console/cake i18n extract --extract-core yes

    or

    ./Console/cake i18n extract --extract-core no




Create the tables used by TranslateBehavior
===========================================

The i18n shell can also be used to initialize the default tables used by the
:php:class:`TranslateBehavior`::

    ./Console/cake i18n initdb

This will create the ``i18n`` table used by translate behavior.


.. meta::
    :title lang=en: I18N shell
    :keywords lang=en: pot files,locale default,translation tools,message string,app locale,php class,validation,i18n,translations,shell,models
