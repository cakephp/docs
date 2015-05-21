2.6 Guide de Migration
######################

CakePHP 2.6 est une mise à jour complète à partir de l'API de 2.5. Cette page
souligne les changements et améliorations faits dans 2.6.

Basics.php
==========

- ``stackTrace()`` a été ajoutée pour être une fonction de wrapper pratique pour
  ``Debugger::trace()``.
  Elle affiche directement un peu comme ``debug()`` le fait. Mais seulement
  si le niveau de debug est activé.
- Les nouvelles fonctions i18n ont été ajoutées. Les nouvelles fonctions vous
  permettent d'inclure un message de contexte ce qui vous permet d'enlever une
  éventuelle ambiguité dans des chaines de message.  Par exemple 'read' peut
  signifier plusieurs choses en anglais selon le contexte. Les nouvelles
  fonctions ``__x``, ``__xn``, ``__dx``, ``__dxn``, ``__dxc``, ``__dxcn``, et
  ``__xc`` fournissent un accès à ces nouvelles fonctionnalités.

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

- ``overwrite()`` a été ajoutée pour permettre de générer des barres de
  progression ou pour éviter de générer de nombreuses lignes en remplaçant le
  texte qui a déjà été affiché à l'écran.

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

- L'opérateur wildcard ``RLIKE`` a été ajouté pour permettre des correspondances
  avec les expressions régulières.
- Les migrations de Schema avec MySQL supportent maintenant une clé ``after``
  lorsque on ajoute une colonne. Cette clé vous permet de spécifier après quelle
  colonne la colonne à créer doit être ajoutée.


Model
=====

Model
-----

- ``Model::save()`` a l'option ``atomic`` importée de 3.0.
- ``Model::afterFind()`` utilise maintenant toujours un format cohérent pour
  afterFind().
  Quand ``$primary`` est à false, les résultats vont toujours être localisés
  dans ``$data[0]['ModelName']``. Vous pouvez définir la propriété
  ``useConsistentAfterFind`` à false sur vos models pour restaurer le
  comportement original.

Network
=======

CakeRequest
-----------

- ``CakeRequest::param()`` peut maintenant lire des valeurs en utilisant
  :ref:`hash-path-syntax` comme ``data()``.
- ``CakeRequest:setInput()`` a été ajoutée.

HttpSocket
----------

- ``HttpSocket::head()`` a été ajoutée.
- Vous pouvez maintenant utiliser l'option ``protocol`` pour surcharger le
  protocole spécifique à utiliser lorsque vous faîtes une requête.

I18n
====

- La valeur de configuration ``I18n.preferApp`` peut maintenant être utilisée
  pour controller l'ordre des traductions. Si défini à true, les traductions
  de l'application seront préférées à celles des plugins.

Utility
=======

CakeTime
--------

- ``CakeTime::timeAgoInWords()`` supporte maintenant les formats de date
  absolus compatibles avec ``strftime()``. Cela facilite la localisation des
  formats de date.

Hash
----

- ``Hash::get()`` lance maintenant une exception quand l'argument path est
  invalide.
- ``Hash::nest()`` lance maintenant une exception quand les résultats de
  l'opération d'imbrication ne retourne aucune donnée.


Validation
----------

- ``Validation::between`` a été dépréciée, vous devez utiliser
  :php:meth:`Validation::lengthBetween` à la place.
- ``Validation::ssn`` a été dépréciée et peut être fournie en tant que plugin
  autonome.

View
====

JsonView
--------

- ``JsonView`` supporte maintenant la variable de vue ``_jsonOptions``.
  Cela permet de configurer les options utilisées pour générer le JSON.

XmlView
-------

- ``XmlView`` supporte maintenant la variable de vue ``_xmlOptions``.
  Cela permet de configurer les options utilisées pour générer le XML.


Helper
======

HtmlHelper
----------

- :php:meth:`HtmlHelper::css()` a une nouvelle option ``once``. Elle fonctionne
  de la même manière que l'option ``once`` de ``HtmlHelper::script()``. La
  valeur par défaut est ``false`` pour maintenir une compatibilité rétroactive.
- L'argument ``$confirmMessage`` de :php:meth:`HtmlHelper::link()` a été
  déprécié. Vous devez utiliser la clé ``confirm`` à la place dans ``$options``
  pour spécifier le message.

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
