2.2 Guide de Migration
######################

CakePHP 2.2 est une mise à jour de l'API complètement compatible à partir
de 2.0/2.1. Cette page souligne les changements et améliorations faits dans
2.2.

.. _required-steps-to-upgrade-2-2:

Etapes requises pour mettre à jour
==================================

Quand on met à jour vers CakePHP 2.2, il est important d'ajouter quelques
nouvelles valeurs de configuration dans ``app/Config/bootstrap.php``.
Les ajoutez va assurer que le behavior soit cohérent avec 2.1.x::

    // Active les filtres du Dispatcher pour les assets du plugin, et
    // du CacheHelper.
    Configure::write('Dispatcher.filters', array(
        'AssetDispatcher',
        'CacheDispatcher'
    ));

    // Ajouter la configuration logging.
    CakeLog::config('debug', array(
        'engine' => 'FileLog',
        'types' => array('notice', 'info', 'debug'),
        'file' => 'debug',
    ));
    CakeLog::config('error', array(
        'engine' => 'FileLog',
        'types' => array('warning', 'error', 'critical', 'alert', 'emergency'),
        'file' => 'error',
    ));

Vous devrez aussi modifier ``app/Config/core.php``. Changez la valeur de
:php:const:`LOG_ERROR` en :php:const:`LOG_ERR`::

    define('LOG_ERROR', LOG_ERR);

Quand on utilise ``Model::validateAssociated()`` ou ``Model::saveAssociated()``
et les échecs de validation du model principal, les erreurs de validation des
models associés ne sont plus détruites. ``Model::$validationErrors`` va
maintenant toujours montrer toutes les erreurs.
Vous aurez peut-être besoin de mettre à jour vos cas de test pour prendre en
compte ce changement.

Console
=======

I18N extract shell
------------------

- Une option a été ajoutée pour écraser les fichiers POT existant par défaut::

    ./Console/cake i18n extract --overwrite


Models
======

- ``Model::_findCount()`` va maintenant appeler les méthodes find
  personnalisées avec ``$state = 'before'`` et
  ``$queryData['operation'] = 'count'``. Dans certains cas, les finds
  personnalisés retournent toujours le bon compte pour la pagination, mais
  la clé ``'operation'`` permet plus de flexibilité pour construire les autres
  requêtes, ou de supprimer les joins qui sont requis pour le finder
  personnnalisé lui-même. Puisque la pagination de méthodes find
  personnalisées ne fonctionne presque jamais, il y a besoin ce workarounds
  pour cela dans le niveau de model, qui ne sont plus necéssaires.

Datasources
===========

- Les sources de données Dbo supportent maintenant les transactions réelles
  imbriquées. Si vous avez besoin d'utiliser cette fonctionnalité dans votre
  application, activez la en utilisant
  ``ConnectionManager::getDataSource('default')->useNestedTransactions = true;``

Testing
=======

- Le webrunner inclut maintenant des liens pour re-lancer un test avec la
  sortie en debug.
- Les cas de test générés pour Controller sont maintenant des sous-classes de
  :php:class:`ControllerTestCase`.


Error Handling
==============

- Quand les exceptions se répétent, ou que les exceptions sont levées quand on
  rend les pages d'erreur, le nouveau layout ``error`` sera utilisé. Il est
  recommandé de ne pas utiliser de helpers supplémentaires dans ce layout
  puisque il est là pour les erreurs de niveau développeur seulement. Cela
  règle les problèmes des erreurs fatales dans le rendu des pages d'erreur dû
  à l'utilisation du helper dans le layout ``default``.
- Il est important de copier ``app/View/Layouts/error.ctp`` dans votre
  répertoire. Ne pas le faire ainsi mettra en échec le rendu des pages erreurs.
- Vous pouvez maintenant configurer la gestion d'erreur en console spécifique.
  En configurant ``Error.consoleHandler``, et ``Exception.consoleHandler`` vous
  pouvez définir le callback qui va gérer les errors/exceptions levées dans les
  applications en console.
- Le gestionnaire configuré dans ``Error.handler`` et ``Error.consoleHandler``
  va recevoir des codes d'erreur fatal (par ex:
  ``E_ERROR``, ``E_PARSE``, ``E_USER_ERROR``).

Exceptions
----------

- :php:class:`NotImplementedException` a été ajouté.


Core
====

Configure
---------

- :php:meth:`Configure::dump()` a été ajoutée. Elle est utilisée pour
  rendre les données de configuration persistentes dans des stockages
  durables comme des fichiers. Les deux :php:class:`PhpReader` et
  :php:class:`IniReader` fonctionnent avec elle.
- Un nouveau paramètre de config 'Config.timezone' est disponible que
  vous pouvez définir comme une chaîne de timezone d'utilisateur. Par ex,
  vous pouvez faire ``Configure::write('Config.timezone',
  'Europe/Paris')``. Si une méthode de la classe ``CakeTime`` est appelée avec
  le paramètre ``$timezone`` à null et 'Config.timezone' est défini, alors
  la valeur de 'Config.timezone' sera utilisée. Cette fonctionnalité vous
  permet de définir le timezone d'utilisateur juste une fois au lieu de
  le passer chaque fois dans les appels de fonction.

Controller
==========

AuthComponent
-------------

- Les options pour les adapters définies dans
  :php:attr:`AuthComponent::$authenticate` accèptent maintenant une option
  ``contain``. Ceci est utilisé pour définir des options de contenance pour
  le cas où les enregistrements de l'utilisateur sont chargés.

CookieComponent
---------------

- Vous pouvez maintenant crypter les valeurs de cookie avec le rijndael
  cipher. Ceci nécessite l'installation de l'extension
  `mcrypt <https://secure.php.net/mcrypt>`_. Utiliser rijndael donne aux valeurs
  du cookie le cryptage réel, et est recommandé à la place de XOR cipher
  disponible dans les versions précédentes. Le XOR cipher est toujours le
  schéma par défaut de cipher pour maintenir la compatibilité avec les
  versions précédentes. Vous pouvez en lire plus dans la documentation
  :php:meth:`Security::rijndael()`.

Pagination
==========

- Paginer les finders personnalisés va maintenant retourner des comptes
  corrects, vois les changements de Model pour plus d'informations.


Network
=======

CakeEmail
---------

- :php:meth:`CakeEmail::charset()` et :php:meth:`CakeEmail::headerCharset()`
  ont été ajoutés.
- Les encodages Japonnais légaux sont maintenant gérés correctement.
  ``ISO-2202-JP`` est utilisé lorsque l'encodage est ``ISO-2202-JP-MS``
  qui fonctionne autour d'un nombre de questions dans les mail clients
  quand il s'agit des encodages CP932 et Shift_JIS.
- :php:meth:`CakeEmail::theme()` a été ajoutée.
- :php:meth:`CakeEmail::domain()` a été ajoutée. Vous pouvez utiliser cette
  méthode pour définir le nom de domaine utilisé lors de l'envoi de mail à
  partir d'un script CLI ou si vous voulez contrôler le nom d'hôte utilisé
  pour envoyer l'email.
- Vous pouvez maintenant définir ``theme`` et ``helpers`` dans votre
  classe EmailConfig.

CakeRequest
-----------

- CakeRequest va maintenant automatiquement décoder les corps de requête
  ``application/x-www-form-urlencoded`` sur les requêtes ``PUT`` et ``DELETE``.
  Ces données seront disponibles dans ``$this->data`` exactement comme les
  données POST le sont.

Utility
=======

Set
---

- La classe :php:class:`Set` est maintenant dépréciée, et remplacée par la
  classe :php:class:`Hash`.
  Set ne sera pas retiré avant 3.0.
- :php:meth:`Set::expand()` a été ajoutée.

Hash
----

La classe :php:class:`Hash` a été ajoutée dans 2.2. Elle remplace Set en
fournissant une API plus cohérente, fiable et performante pour faire
plusieurs des tâches que fait Set. Regardez la page
:doc:`/core-utility-libraries/hash` pour plus de détails.

CakeTime
--------

- Le paramètre ``$userOffset`` a été remplacé par le paramètre ``$timezone``
  dans toutes les fonctions pertinentes. Donc au lieu de la sortie numérique,
  vous pouvez maintenant passer une chaîne timezone ou un objet DateTimeZone.
  Passer les sorties numériques pour le paramètre ``$timezone`` est toujours
  possible pour une compatibilité rétro-active.
- :php:meth:`CakeTime::timeAgoInWords()` a l'option ``accuracy`` ajoutée.
  Cette option vous permet de spécifier la précision que doivent avoir les
  times formatés.

- Nouvelles méthodes ajoutées:

  * :php:meth:`CakeTime::toServer()`
  * :php:meth:`CakeTime::timezone()`
  * :php:meth:`CakeTime::listTimezones()`

- Le paramètre ``$dateString`` dans toutes les méthodes accèptent maintenant
  un objet DateTime.


Helpers
=======

FormHelper
----------

- FormHelper gère maintenant mieux l'ajout des classes requises aux entrées.
  Il honore maintenant la clé ``on``.
- :php:meth:`FormHelper::radio()` supporte maintenant ``empty`` qui fonctionne
  de la même façon que l'option empty de ``select()``.
- Ajout de :php:meth:`FormHelper::inputDefaults()` pour définir les propriétés
  habituelles pour chacune de ses entrées générées par le Helper.

TimeHelper
----------

- Depuis 2.1, TimeHelper utilise la classe CakeTime pour toutes ses méthodes
  pertinentes. Le paramètre ``$userOffset`` a été remplacé par le paramètre
  ``$timezone``.
- :php:meth:`TimeHelper::timeAgoInWords()` a l'option ``element`` ajoutée.
  Cela vous permet de spécifier un élément HTML pour entourer le time
  formaté.

HtmlHelper
----------

- :php:meth:`HtmlHelper::tableHeaders()` supporte maintenant la configuration
  des attributs par cellule de table.


Routing
=======

Dispatcher
----------

- Les écouteurs d'Event peuvent maintenant être attachés aux appels du
  dispatcher, ceux-ci vont avoir la capacité de changer l'information
  de requête ou la réponse avant qu'elle soit envoyée au client. Vérifiez
  la documentation complète pour ces nouvelles fonctionnalités dans
  :doc:`/development/dispatch-filters`
- Avec l'ajout de :doc:`/development/dispatch-filters` vous aurez besoin de
  mettre à jour ``app/Config/bootstrap.php``. Regardez
  :ref:`required-steps-to-upgrade-2-2`.

Router
------

- :php:meth:`Router::setExtensions()` a été ajoutée. Avec la nouvelle méthode,
  vous pouvez maintenant ajouter plus d'extensions à parser, par exemple dans
  un fichier de routes de plugin.

Cache
=====

Redis Engine
------------

Un nouveau moteur de cache a été ajouté en utilisant `phpredis extension
<https://github.com/nicolasff/phpredis>`_ il est configuré de la même
manière que le moteur Memcache.

Cache groups
------------

Il est maintenant possible de tagger ou de labeliser les clés de cache sous les
groupes. Cela facilite pour supprimer en masse les entrées associées mise
en cache avec le même label. Les groupes sont déclarés au moment de la
configuration quand on crée le moteur de cache::

    Cache::config(array(
        'engine' => 'Redis',
        ...
        'groups' => array('post', 'comment', 'user')
    ));

Vous pouvez avoir autant de groupes que vous le souhaitez, mais gardez à
l'esprit qu'ils ne peuvent pas être modifiés dynamiquement.

La méthode de la classe :php:meth:`Cache::clearGroup()` a été ajoutée. Elle
prende le nom du groupe et supprime toutes les entrées labelisées avec la
même chaîne.

Log
===

Les changements dans :php:class:`CakeLog` requièrent maintenant une
configuration supplémentaire dans votre ``app/Config/bootstrap.php``.
Regardez :ref:`required-steps-to-upgrade-2-2`,
et :doc:`/core-libraries/logging`.

- La classe :php:class:`CakeLog` accèpte maintenant les mêmes niveaux de log
  que défini dans
  `RFC 5424 <http://tools.ietf.org/html/rfc5424>`_.  Plusieurs méthodes
  pratiques ont été aussi ajoutées:

  * :php:meth:`CakeLog::emergency($message, $scope = array())`
  * :php:meth:`CakeLog::alert($message, $scope = array())`
  * :php:meth:`CakeLog::critical($message, $scope = array())`
  * :php:meth:`CakeLog::error($message, $scope = array())`
  * :php:meth:`CakeLog::warning($message, $scope = array())`
  * :php:meth:`CakeLog::notice($message, $scope = array())`
  * :php:meth:`CakeLog::info($message, $scope = array())`
  * :php:meth:`CakeLog::debug($message, $scope = array())`

- Un troisième argument ``$scope`` a été ajouté à :php:meth:`CakeLog::write`.
  Regardez :ref:`logging-scopes`.
- Un nouveau moteur de log: :php:class:`ConsoleLog` a été ajouté.

Validation de Model
===================

- Un nouvel objet ``ModelValidator`` a été ajouté pour déléguer le travail
  de validation des données du model, il est normalement transparent pour
  l'application et complètement rétro-compatible. Il fournit aussi une API
  riche pour ajouter, modifier et retirer les règles de validation. Vérifiez
  les docs pour cet objet dans :doc:`/models/data-validation`.

- Les fonctions de validation dans vos models devront avoir la visibilité
  "public" afin d'être accessibles par ``ModelValidator``.

- De nouvelles règles de validation ont été ajoutées:

  * :php:meth:`Validation::naturalNumber()`
  * :php:meth:`Validation::mimeType()`
  * :php:meth:`Validation::uploadError()`
