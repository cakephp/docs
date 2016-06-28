2.4 Guide de Migration
######################

CakePHP 2.4 est une mise à jour complète à partir de l'API de 2.3. Cette page
souligne les changements et améliorations faits dans 2.4.

Console
=======

- Les messages de log de type notice seront maintenant en couleur dans les
  terminaux qui supportent les couleurs.
- ConsoleShell est maintenant dépréciée.

SchemaShell
-----------

- ``cake schema generate`` supporte maintenant le paramètre ``--exclude``.
- La constante ``CAKEPHP_SHELL`` est maintenant dépréciée et sera retirée dans
  CakePHP 3.0.

BakeShell
---------

- ``cake bake model`` permet maintenant la commande pour baker les
  ``$behaviors``. Si les champs `lft`, `rght` et `parent_id` se trouvent dans
  votre table, cela va ajouter le behavior Tree, par exemple. Vous pouvez
  aussi étendre le ModelTask pour permettre à vos propres behaviors d'être
  reconnus.
- ``cake bake`` pour les views, models, controllers, tests et fixtures
  supportent maintenant les paramètres ``-f`` ou ``--force`` pour forcer
  l'écrasement de fichiers.
- Les Tasks dans le coeur peuvent être maintenant aliasés de la même façon que
  vous le faites avec les Helpers, Components et Behaviors.

FixtureTask
-----------

- ``cake bake fixture`` supporte maintenant un paramètre ``--schema`` qui
  permet le baking de toutes les fixtures de façon noninteractive "all"
  tout en utilisant l'import du schema.

Core
====

Constantes
----------

- Les constantes ``IMAGES_URL``, ``JS_URL``, ``CSS_URL`` ont été dépréciées et
  remplacées par les variables de config respectivement ``App.imageBaseUrl``,
  ``App.jsBaseUrl``, ``App.cssBaseUrl``.

- Les Constantes ``IMAGES``, ``JS``, ``CSS`` ont été dépréciées.

Object
------

- :php:meth:`Object::log()` a un nouveau paramètre ``$scope``.


Components
==========

AuthComponent
-------------

- AuthComponent supporte maintenant le mode proper stateless lors de
  l'utilisation des authentifieurs 'Basic' ou 'Digest'. Partir de session
  peut être empêché en configurant :php:attr:`AuthComponent::$sessionKey`
  à false. Aussi maintenant lors de l'utilisation uniquement de 'Basic' ou
  'Digest', vous n'êtes plus redirigé vers la page de login. Pour plus d'infos,
  vérifiez la page :php:class:`AuthComponent`.
- La propriété :php:attr:`AuthComponent::$authError` peut être définie au
  boléen ``false`` pour supprimer l'affichage du message flash.

PasswordHasher
--------------

- Les objets d'Authentification utilisent maintenant les nouveaux objets
  password hasher pour la génération et la vérification des password hashés
  Regardez :ref:`hashing-passwords` pour plus d'info.

DbAcl
-----

- DbAcl utilise maintenant les jointures ``INNER`` au lieu des jointures
  ``LEFT``. Ceci améliore les performances pour certaines bases de données
  externes.

Model
=====

Models
------

- :php:meth:`Model::save()`, :php:meth:`Model::saveField()`, :php:meth:`Model::saveAll()`,
  :php:meth:`Model::saveAssociated()`, :php:meth:`Model::saveMany()`
  prennent une nouvelle option ``counterCache``. Vous pouvez la définir
  à false pour éviter de mettre à jour les valeurs du counter cache pour une
  opération de sauvegarde particulière.
- :php:meth:`Model::clear()` a été ajoutée.

Datasource
----------

- Mysql, Postgres, et Sqlserver supportent maintenant un tableau 'settings'
  dans la définition de connexion. Cette paire de clé => valeur émettra des
  commandes ``SET`` lorsque la connexion est créée.
- MySQL driver supporte maintenant les options SSL.

View
====

JsonView
--------

- Le support de JSONP a été ajouté à :php:class:`JsonView`.
- La clé ``_serialize`` supporte maintenant le renommage des variables
  sérialisées.
- Quand debug > 0, JSON va être bien imprimé.

XmlView
-------

- La clé ``_serialize`` supporte maintenant le renommage des variables
  sérialisées.
- Quand debug > 0, XML va être bien imprimé.


HtmlHelper
----------

- L'API pour :php:meth:`HtmlHelper::css()` a été simplifiée. Vous pouvez
  maintenant fournir un tableau d'options en deuxième argument. Quand vous
  faîtes cela, l'attribut ``rel`` se met par défaut à 'stylesheet'.
- Une nouvelle option ``escapeTitle`` ajoutée à
  :php:meth:`HtmlHelper::link()` pour contrôler l'échappement seulement du
  titre du lien et pas des attributs.

TextHelper
----------

- :php:meth:`TextHelper::autoParagraph()` a été ajoutée. Elle permet de
  convertir automatiquement les paragraphes de test en HTML.

PaginatorHelper
---------------

- :php:meth:`PaginatorHelper::param()` a été ajoutée.
- La première page ne contient plus ``/page:1`` ou ``?page=1`` dans l'URL. Cela
  évite les problèmes de contenu dupliqué, où vous avez besoin d'utiliser
  canonical ou noindex de toute façon.

FormHelper
----------

- L'option ``round`` a été ajoutée à :php:meth:`FormHelper::dateTime()`. Peut
  être définie à ``up`` ou ``down`` pour forcer l'arrondi quelque soit la
  direction. Par défaut à null qui arrondit à la moitié supérieure selon
  ``interval``.

Network
=======

CakeRequest
-----------

- :php:meth:`CakeRequest::param()` a été ajoutée.
- :php:meth:`CakeRequest::is()` a été modifiée pour supporte un tableau
  de types et va retourner true si la requête correspond à tout type.
- :php:meth:`CakeRequest::isAll()` a été ajoutée pour vérifier qu'une requête
  correspond à tous les types donnés.

CakeResponse
------------

- :php:meth:`CakeResponse::location()` a été ajoutée pour récupérer ou définir
  l'en-tête de localisation du redirect.

CakeEmail
---------

- Les messages de log d'email ont maintenant l'option ``email`` par défaut. Si
  vous ne voyez pas de contenus d'email dans vos logs, assurez-vous d'ajouter
  l'option ``email`` à votre configuration de log.
- :php:meth:`CakeEmail::emailPattern()` a été ajoutée. Cette méthode peut être
  utilisée pour faciliter les règles de validation d'email. C'est utile
  quand vous gérez certains hôtes Japonais qui permettent aux adresses non
  conformes d'être utilisées.
- :php:meth:`CakeEmail::attachments()` vous permet de fournir les contenus de
  fichier directement en utilisant la clé ``data``.
- Les données de Configuration sont maintenant correctement fusionnées avec les
  classes de transport.

HttpSocket
----------

- :php:meth:`HttpSocket::patch()` a été ajoutée.


I18n
====

L10n
----

- ``ell`` est maintenant la locale par défaut pour le Grec comme spécifié par
  ISO 639-3 et ``gre`` son alias.
  Les dossiers de locale ont été ajustés en conséquence (de `/Locale/gre/` en
  `/Locale/ell/`).
- ``fas`` est maintenant la locale par défaut pour le Farsi comme spécifié par
  ISO 639-3 et ``per`` son alias.
  Les dossiers de locale ont été ajustés en conséquence (de `/Locale/per/` en
  `/Locale/fas/`).
- ``sme`` est maintenant la locale par défaut pour le Sami comme spécifié par
  ISO 639-3 et ``smi`` son alias. Les dossiers de locale ont été ajustés en
  conséquence (de `/Locale/smi/` en `/Locale/sme/`).
- ``mkd`` remplace ``mk`` comme locale par défaut pour le Macedonien comme
  spécifié par ISO 639-3. Les dossiers de locale ont aussi été ajustés.
- Le code de Catalog ``in`` a été supprimé et remplacé par ``id`` (Indonesian),
  ``e`` a été supprimé et remplacé par ``el`` (Greek),
  ``n`` a été supprimé et remplacé par  ``nl`` (Dutch),
  ``p`` a été supprimé et remplacé par  ``pl`` (Polish),
  ``sz`` a été supprimé et remplacé par  ``se`` (Sami).
- Kazakh a été ajouté ``kaz`` comme locale et ``kk`` comme code de catalog.
- Kalaallisut a été ajouté avec ``kal`` comme locale et ``kl`` comme code de
  catalog.
- la constante ``DEFAULT_LANGUAGE`` a été dépréciée en faveur de la valeur de
  Configuration ``Config.language``.

Logging
=======

- Les moteurs de Log n'ont plus besoin du suffixe ``Log`` dans leur
  configuration. Donc pour le moteur de FileLog; il suffit maintenant de
  définir ``'engine' => 'File'``. Cela unifie la façon dont les moteurs sont
  nommés dans la configuration (regardez les moteurs de Cache par exemple).
  Note: Si vous avez un moteur de Log de type ``DatabaseLogger`` qui ne
  suit pas les conventions, utilisez un suffix ``Log`` pour votre nom de
  classe, vous devez ajuster votre nom de classe en ``DatabaseLog``.
  Vous devez aussi éviter les noms de classe comme ``SomeLogLog`` ce qui inclut
  le suffixe deux fois à la fin.

FileLog
-------

- Deux nouvelles options de config ``size`` et ``rotate`` ont été ajoutées pour
  le moteur :ref:`FileLog <file-log>`.
- En mode debug, les répertoires manquants vont être maintenant automatiquement
  créés pour éviter le lancement des erreurs non nécessaires.

SyslogLog
---------

- Le nouveau moteur de log :ref:`SyslogLog <syslog-log>` a été ajouté pour
  streamer les messages au syslog.

Cache
=====

FileEngine
----------

- En mode debug, les répertoires manquants vont être automatiquement créés pour
  éviter le lancement d'erreurs non nécessaires.

Utility
=======

General
-------

- :php:func:`pr()` ne sort plus le HTML lors du lancement en mode CLI.

Sanitize
--------

- La classe ``Sanitize`` a été dépréciée.


Validation
----------

- :php:meth:`Validation::date()` supporte maintenant les formats ``y`` et
  ``ym``.
- Le code de pays de :php:meth:`Validation::phone()` pour le Canada a été
  changé de ``can`` en ``ca`` pour unifier les codes de pays pour les méthodes
  de validation selon ISO 3166 (codes à deux lettre).

CakeNumber
----------

- Les monnaies ``AUD``, ``CAD`` et ``JPY`` ont été ajoutées.
- Les symboles pour ``GBP`` et ``EUR`` sont maintenant UTF-8. Si vous mettez
  à jour une application non-UTF-8, assurez-vous que vous mettez à jour
  l'attribut statique ``$_currencies`` avec les symboles d'entité HTML
  appropriés (``&#163;`` et ``&#8364;``) avant d'utiliser ces monnaies.
- L'option ``fractionExponent`` a été ajoutée à
  :php:meth:`CakeNumber::currency()`.

CakeTime
--------

- :php:meth:`CakeTime::isPast()` et :php:meth:`CakeTime::isFuture()` ont été
  ajoutées.
- :php:meth:`CakeTime::timeAgoInWords()` a deux nouvelles options pour
  personnaliser les chaînes de sortie:
  ``relativeString`` (par défaut à ``%s ago``) et ``absoluteString`` (par
  défaut à ``on %s``).
- :php:meth:`CakeTime::timeAgoInWords()` utilise les termes fuzzy quand time
  est inférieur à des seuils.

Xml
---

- La nouvelle option ``pretty`` a été ajoutée à :php:meth:`Xml::fromArray()`
  pour retourner un Xml joliment formaté.


Error
=====

ErrorHandler
------------

- La nouvelle option de configuration ``skipLog`` a été ajoutée, qui permet
  d'échapper certains types d'Exception du Log.
  ``Configure::write('Exception.skipLog', array('NotFoundException', 'ForbiddenException'));``
  vont éviter ces exceptions et celles qui les étendent d'être dans les logs
  quand la config ``'Exception.log'`` est à ``true``

Routing
=======

Router
------

- :php:meth:`Router::fullBaseUrl()` a été ajoutée en même temps que la
  valeur de Configure ``App.fullBaseUrl``. Elles remplacent
  :php:const:`FULL_BASE_URL` qui est maintenant dépréciée.
- :php:meth:`Router::parse()` parse maintenant les arguments de chaîne de
  requête.
