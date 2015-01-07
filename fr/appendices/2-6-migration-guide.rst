2.6 Guide de Migration
######################

CakePHP 2.6 est une mise à jour complète à partir de l'API de 2.5. Cette page
souligne les changements et améliorations faits dans 2.6.

Basics.php
==========

- ``stackTrace()`` has been added as a convenience wrapper function for ``Debugger::trace()``.
  It directly echos just as ``debug()`` does. But only if debug level is on.
- New i18n functions have been added. The new functions allow you to include
  message context which allows you disambiguate possibly confusing message
  strings. For example 'read' can mean multiple things in english depending on
  the context. The new ``__x``, ``__xn``, ``__dx``, ``__dxn``, ``__dxc``,
  ``__dxcn``, and ``__xc`` functions provide access to the new features.

Cache
=====

RedisEngine
-----------

- ``RedisEngine`` a maintenant ``Inflector::slug(APP_DIR)`` comme préfixe par
  défaut.

Console
=======

ConsoleOptionParser
-------------------

- ``ConsoleOptionParser::removeSubcommand()`` a été ajoutée.

Shell
-----

- ``overwrite()`` a été ajoutée pour permettre de générer des progress bars
  ou pour éviter de générer de nombreuses lignes en remplçant le texte qui a
  déjà été affiché à l'écran.

Controller
==========

AuthComponent
-------------

- L'option``userFields`` a été ajoutée à ``AuthComponent``.
- AuthComponent déclenche maintenant un event ``Auth.afterIdentify`` après qu'un
  utilisateur a été identifié et s'est connecté. L'event va contenir
  l'utilisateur connecté en données.

Behavior
========

AclBehavior
-----------

- ``Model::parentNode()`` prend maintenant le type (Aro, Aco) en premier
  argument: ``$model->parentNode($type)``.

Datasource
==========

Mysql
-----

- The ``RLIKE`` wildcard operator has been added to allow regular expression
  pattern lookups this way.
- Schema migrations with MySQL now support an ``after`` key when adding
  a column. This key allows you to specify which column the new one should be
  added after.


Model
=====

Model
-----

- ``Model::save()`` had the ``atomic`` option back-ported from 3.0.
- ``Model::afterFind()`` now always uses a consistent format for afterFind().
  When ``$primary`` is false, the results will always be located under
  ``$data[0]['ModelName']``. You can set the ``useConsistentAfterFind`` property
  to false on your models to restore the original behavior.

Network
=======

CakeRequest
-----------

- ``CakeRequest::param()`` peut maintenant lire des valeurs utilisant
  :ref:`hash-path-syntax` comme ``data()``.
- ``CakeRequest:setInput()`` a été ajoutée.

HttpSocket
----------

- ``HttpSocket::head()`` a été ajoutée.
- You can now use the ``protocol`` option to override the specific protocol to
  use when making a request.

I18n
====

- La valeur de configuration ``I18n.preferApp`` peut maintenant être utilisée
  pour controller l'ordre des traductions. Si défini à true, les traductions
  de l'application seront préférées à celles des plugins.

Utility
=======

CakeTime
--------

- ``CakeTime::timeAgoInWords()`` now supports ``strftime()`` compatible absolute
  date formats. This helps make localizing formatted times easier.

Hash
----

- ``Hash::get()`` now raises an exception when the path argument is invalid.
- ``Hash::nest()`` now raises an exception when the nesting operation results in
  no data.


Validation
----------

- ``Validation::between`` a été dépréciée, vous devez utiliser
  :php:meth:`Validation::lengthBetween` à la place.
- ``Validation::ssn`` a été dépréciée et peut être fourni en tant que plugin
  autonome.

View
====

HtmlHelper
----------

- :php:meth:`HtmlHelper::css()` had the ``once`` option added. It works the same
  as the ``once`` option for ``HtmlHelper::script()``. The default value is
  ``false`` to maintain backwards compatibility.
- The ``$confirmMessage`` argument of :php:meth:`HtmlHelper::link()` has been
  deprecated. You should instead use key ``confirm`` in ``$options`` to specify
  the message.

FormHelper
----------

- L'argument ``$confirmMessage`` de :php:meth:`FormHelper::postLink()` a été
  déprécié. Vous devez maintenant utiliser la clé ``confirm`` dans ``$options``
  pour spécifier le message.
- L'attribut ``maxlength`` va maintenant aussi être appliqué aux textareas,
  quand le champ de la base de données correspondant est de type varchar,
  selon les specs de HTML.

PaginatorHelper
---------------

- :php:meth:`PaginatorHelper::meta()` a été ajoutée pour afficher les
  meta-links (rel prev/next) pour un ensemble de résultats paginés.
