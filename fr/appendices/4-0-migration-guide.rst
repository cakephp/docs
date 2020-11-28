Guide de migration vers la version 4.0
######################################

CakePHP 4.0 contient des changements non rétro-compatibles et n'est pas rétrocompatible avec 3.x
communiqués. Avant d'essayer de mettre à niveau vers la version 4.0, effectuez d'abord
la mise à niveau vers la version 3.8 et résolvez tous les avertissements d'obsolescence.

Référez-vous à :doc:`/appendices/4-0-upgrade-guide` afin de suivre pas à pas les instructions
concernant la façon de migrer vers la version 4.0.

Fonctionnalités obsolètes supprimées
=====================================

Toutes les méthodes, propriétés et fonctionnalités qui émettaient des avertissements
d'obsolescence à partir de 3.8 ont été supprimés.


La fonctionnalité d'authentification a été divisée en plugins autonomes
`Authentication <https://github.com/cakephp/authentication>`__ et
`Authorization <https://github.com/cakephp/authorization>`__. L'ancien
RssHelper -avec des fonctionnalités similaires- se trouve a présent
dans le plugin `Feed plugin <https://github.com/dereuromark/cakephp-feed>`__ .

Dépréciations
=============

Voici une liste des méthodes, propriétés et comportements obsolètes.
Ces fonctionnalités continueront de fonctionner dans 4.x et seront supprimées
dans la version 5.0.0.

Component
---------

* ``AuthComponent`` et les classes associées sont devenues obsolètes et seront supprimées
  dans 5.0.0. Vous devez utiliser les bibliothèques d'authentification et d'autorisation mentionnées
  ci-dessus à la place.
* ``SecurityComponent`` est déprécié. A sa place, utilisez le ``FormProtectionComponent``
  pour la protection contre la falsification de formulaire et le :ref:`https-enforcer-middleware`
  pour la fonctionnalité ``requireSecure``.

Filesystem
----------

* Ce package est obsolète et sera supprimé dans la version 5.0. Il pose un certain nombre de
  problèmes de conception et la maintenance de ce package rarement utilisé ne semble pas valoir
  l'effort alors qu'il existe une grande variété d'autres packages.

ORM
---

* L'utilisation ``Entity::isNew()`` comme mutateur est dépréciée. Utilisez ``setNew()`` à la place.
* ``Entity::unsetProperty()`` a été renommée en ``Entity::unset()`` pour être conforme avec les
  autres méthodes.
* ``TableSchemaInterface::primaryKey()`` a été renommée en ``TableSchemaInterface::getPrimaryKey()``.

View
----

* Les variables de la vue ``JsonView`` : ``_serialize``, ``_jsonOptions`` and ``_jsonp`` sont dépréciées.
  A la place, vous devez utiliser
  ``viewBuilder()->setOption($optionName, $optionValue)`` pour définir ces options.
* Les variables de la vue ``XmlView`` : ``_serialize``, ``_rootNode`` and ``_xmlOptions`` sont dépréciées.
  A la place, vous devez utiliser
  ``viewBuilder()->setOption($optionName, $optionValue)`` pour définir ces options.
* ``HtmlHelper::tableHeaders()`` préfère désormais que les cellules d'en-tête avec des attributs soient
  défini comme une liste imbriquée. Par exemple ``['Title', ['class' => 'special']]``.
* ``ContextInterface::primaryKey()`` a été renommée en ``ContextInterface::getPrimaryKey()``.

Mailer
------

* La classe ``Cake\Mailer\Email`` a été dépréciée. Utilisez ``Cake\Mailer\Mailer``
  à sa place.

App
---
* ``App::path()`` a été dépréciée pour les chemins de classes (class paths).
  Utilisez ``\Cake\Core\App::classPath()`` à sa place.

Changements non rétro-compatibles
==================================

En plus de la suppression des fonctionnalités obsolètes, des
changements non rétro-compatibles ont été effectués::

Cache
-----

* ``Cake\Cache\CacheEngine::gc()`` et toutes les implémentations de cette méthode ont
  été supprimées. Cette méthode était interdite dans la plupart des pilotes de cache
  et n'était utilisée que pour la mise en cache de fichiers.

Controller
----------

* ``Cake\Controller\Controller::referer()`` met par défaut le paramètre ``local``
  à true, au lieu de false. Cela rend l'utilisation des referer dans les headers plus sûre car
  ils seront limités au domaine de votre application par défaut.
* La mise en correspondance du nom de la méthode du contrôleur lors de l'appel d'actions
  est désormais sensible à la casse.
  Par exemple, si votre méthode de contrôleur est ``ForgotPassword()``, utiliser la chaîne
  de caractères ``Forgotpassword`` dans l'URL ne correspondra pas au nom de l'action.

Console
-------

* ``ConsoleIo::styles()`` a été séparée en ``getStyle()`` et
  ``setStyle()``. Cela se reflète également dans ``ConsoleOutput``.

Component
---------

* ``Cake\Controller\Component\RequestHandlerComponent`` assigne à présent ``isAjax`` a un
  attribut de la requête à la place d'un paramètre de la requête. Par conséquent, vous devez
  maintenant utiliser ``$request->getAttribute('isAjax')`` à la place de
  ``$request->getParam('isAjax')``.
* Les fonctionnalités de parsing du corps de requête de ``RequestHandlerComponent`` ont été
  supprimées. Vous devez utiliser :ref:`body-parser-middleware` à la place.
* ``Cake\Controller\Component\PaginatorComponent`` définit maintenant les informations
  des paramètres de pagination comme attribut de la requête à la place d'un paramètre de la requête.
  Par conséquent, vous devez à présent utiliser
  ``$request->getAttribute('paging')`` à la place de ``$request->getParam('paging')``.

Database
--------

* Les classes permettant le mapping de type dans ``Cake\Database\TypeInterface`` n'héritent plus de
  ``Type``, et tirent à présent partie des fonctionnalités de ``BatchCastingInterface``.
* ``Cake\Database\Type::map()`` s'uitlise uniquement comme un setter maintenant. Vous devez utiliser
  ``Type::getMap()`` pour inspecter le type des instances.
* Les types de colonnes Date, Time, Timestamp, et Datetime retournent à présent des objets de temps immuables
  (immutable time) par défaut.
* ``BoolType`` ne transforme plus les valeurs de chaînes de caractères non vides à ``true`` et
  les valeurs des chaines vides à ``false``. Au lieu de cela, les valeurs de chaînes de caractères
  non booléennes sont converties à ``null``.
* ``DecimalType`` utilise désormais des chaînes de caractères pour représenter des valeurs décimales
  au lieu de flottants. L'utilisation de flottants entrainait une perte de précision..
* ``JsonType`` préserve desormais ``null`` dans le contexte de préparation des valeurs pour l'écriture
  en base de données. Dans la version 3.x il envoyait la chaîne ``'null'``.
* ``StringType`` transforme à présent les tableaux en ``null`` à la place d'une chaîne de caractère vide.
* ``Cake\Database\Connection::setLogger()`` n'accepte plus ``null`` pour
  désactiver la journalisation. Passez plutôt une instance de ``Psr\Log\NullLogger`` pour désactiver
  la journalisation.
* Les implémentations internes de ``Database\Log\LoggingStatement``, ``Database\QueryLogger``
  et ``Database\Log\LoggedQuery`` ont changé. Si vous étendez ces classes, vous
  devrez mettre à jour votre code.
* Les implémentations internes de ``Cake\Database\Log\LoggingStatement``, ``Cake\Database\QueryLogger``
  et ``Cake\Database\Log\LoggedQuery`` ont changé. Si vous étendez ces classes, vous
  devrez mettre à jour votre code.
* Les implémentations internes de ``Cake\Database\Schema\CacheCollection`` et ``Cake\Database\SchemaCache``
  ont changé. Si vous étendez ces classes, vous devrez mettre à jour votre code.
* ``Cake\Database\QueryCompiler`` ne place plus les clauses ``SELECT`` entre quotes que
  lorsque l'auto-quoting est activé. La mise entre quotes est conservée pour Postgres afin
  d'éviter que les identifiers ne soient castés automatiquement en minuscules.
* Le shéma de base de donnée fait à présent correspondre les colonnes de type ``CHAR`` au nouveau type ``char``
  à la place de du type ``string``.
* Dans SqlServer le type de colonne datetime correspond à présent au type 'datetime' plutôt qu'au type 'timestamp'.
* Les shémas pour les bases de données de type MySQL, PostgreSQL and SqlServer font correspondrent les colonnes
  supportant les secondes fractionnaires (fractional seconds) au nouveau type abstrait fractionnaire.

  * **MySQL**

    #. ``DATETIME(1-6)`` => ``datetimefractional``
    #. ``TIMESTAMP(1-6)`` => ``timestampfractional``

  * **PostgreSQL**

    #. ``TIMESTAMP`` => ``timestampfractional``
    #. ``TIMESTAMP(1-6)`` => ``timestampfractional``

  * **SqlServer**

    #. ``DATETIME2`` => ``datetimefractional``
    #. ``DATETIME2(1-7) => ``datetimefractional``

* Le schéma PostgreSQL mappe désormais les colonnes prenant en charge les fuseaux horaires avec le nouveau
  types abstrait de fuseaux horaires. Spécifier (0) comme précision ne modifie pas le mappage de type comme
  il le fait avec les types fractionnaires réguliers ci-dessus.

  * **PostgreSQL**

    #. ``TIMESTAMPTZ`` => ``timestamptimezone``
    #. ``TIMESTAMPTZ(0-6)`` => ``timestamptimezone``
    #. ``TIMESTAMP WITH TIME ZONE`` => ``timestamptimezone``
    #. ``TIMESTAMP(0-6) WITH TIME ZONE`` => ``timestamptimezone``

Datasources
-----------

* ``ModelAwareTrait::$modelClass`` est a présent protégé.

Error
-----

* Les implémentations internes des classes de gestionnaire d'erreurs  ``BaseErrorHandler``,
    ``ErrorHandler`` et ``ConsoleErrorHandler`` ont changées. Si vous avez étendu
    ces classes vous devez les mettre à jour en conséquence.
* ``ErrorHandlerMiddleware`` prend maintenant un nom de classe ou une instance de
  gestionnaire d'erreurs (error handler) comme argument de constructeur au lieu du nom ou
  de l'instance de la classe d'exception (exception render class) à rendre.

Event
-----

* Appeler ``getSubject()`` sur un évènement (event) qui ne possède pas d'attribut `subject``
  provoquera à présent une exception.

Http
----

* ``Cake\Controller\Controller::referer()`` met par défaut le paramètre ``local``
  à true, au lieu de false. Cela rend l'utilisation des referer dans les headers plus sûre car
  ils seront limités au domaine de votre application par défaut.
* La valeur par défaut de ``Cake\Http\ServerRequest::getParam()`` quand un paramètre est manquant
  est maintenant ``null`` et non ``false``.
* ``Cake\Http\Client\Request::body()`` a été supprimée. Utilisez ``getBody()`` ou
  ``withBody()`` à la place.
* ``Cake\Http\Client\Response::isOk()`` retourne à présent ``true`` pour les codes
  de response 2xx and 3xx.
* ``Cake\Http\Cookie\Cookie::getExpiresTimestamp()`` retourne à présent un entier.
  Cela fait correspondre le type à celui utilisé dans ``setcookie()``.
* ``Cake\Http\ServerRequest::referer()`` retourne à présent ``null`` quand la requête
  courante ne possède pas de referer. Auparavant, elle retournait ``/``.
* ``Cake\Cookie\CookieCollection::get()`` lève maintenant une exception lors de l'accès
  à un cookie qui n'existe pas. Utilisez ``has()`` pour vérifier l'existence des cookies.
* La signature de ``Cake\Http\ResponseEmitter::emit()`` a changé, elle ne possède plus de
  2nd argument.
* La valeur par défaut de ``App.uploadedFilesAsObjects`` est à présent ``true``. Si votre
  application utilise l'upload de fichiers vous pouvez mettre ce flag à ``false`` afin de
  préserver la compatibilité avec le comportement de la version 3.x.
* Les clés retournées par ``Cake\Http\Response::getCookie()`` ont changé.
  ``expire`` est remplacé par ``expires`` et ``httpOnly`` par ``httponly``.

Http\Session
------------

* Le nom du cookie de session n'est plus défini comme ``CAKEPHP` par défaut. A la
  place, le nom de cookie par défaut est celui défini dans votre fichier ``php.ini``.
  Vous pouvez utiliser l'option de configuration ``Session.cookie`` pour définir
  le nom du cookie.
* Les cookies de session ont désormais l'attribut ``SameSite`` défini comme
  ``Lax`` par défaut.
  Jetez un oeil à :ref:`session-configuration` pour d'avantage d'informations.

I18n
----

* L'encodage JSON des objets ``Cake\I18n\Date`` et ``Cake\I18n\FrozenDate`` produit
  maintenant des chaînes de caractères qui possèdent uniquement la partie concernant la
  date au format ``yyyy-MM-dd`` au lieu du ``yyyy-MM-dd'T'HH:mm:ssxxx`` précédemment.

Mailer
------

* ``Email::set()`` a été supprimée. Utilisez ``Email::setViewVars()`` à la place.
* ``Email::createView()`` a été supprimée.
* ``Email::viewOptions()`` a été supprimée. Utilisez
  ``$email->getRenderer()->viewBuilder()->setOptions()`` à la place.

ORM
---

* ``Table::newEntity()`` nécessite maintenant un tableau en entrée et applique la
  validation pour empêcher des sauvegardes accidentelles sans que la validation ne soit
  déclenchée. Cela signifie que vous devez utiliser ``Table::newEmptyEntity()`` pour
  créer des entités vides.
* Utiliser des conditions semblables à ``['name' => null]`` pour ``Query::where()``
  va maintenant lever une exception.
  Dans 3.x, cela générerait une condition SQL ``name = NULL`` qui correspond toujours
  à 0 ligne, renvoyant ainsi des résultats incorrects. Pour comparer avec ``null``
  vous devez utiliser l'opérateur ``IS`` de la façon suivante ``['name IS' => null]``.
* Stopper l'évènement ``Model.beforeSave`` en renvoyant un résultat non nul ou qui n'est
  pas une entité (entity)va maintenant lever une exception. Ce changement garantit que
  ``Table::save()`` renverra toujours une entité ou false.
* Les objets Table lèveront désormais une exception lorsque les alias générés pour les noms
  et la colonne de la table seraient tronqués par la base de données. Cela avertit l'utilisateur
  avant que des erreurs cachées (hidden errors) ne se produisent lorsque CakePHP ne peut pas
  faire correspondre l'alias dans le résultat.
* ``TableLocator::get()`` et ``TableRegistry::get()`` s'attendent maintenant à ce
  que les alias des noms soient toujours **CamelCased** dans votre code. Passer des alias
  avec la mauvaise casse entraînera un chargement incorrect des classes de table et d'entité.

Router
------

* Les préfixes de routage créés via ``Router::prefix()`` et
  ``$routes->prefix()`` sont à présent CamelCased et non plus under_scored. A la place de
  ``my_admin``, vous devez utiliser ``MyAdmin``. Ce changement normalise les préfixes
  avec les autres paramètres de routage et supprime la surcharge causée par l'inflexion.
* ``RouteBuilder::resources()`` infléchit maintenant les noms de ressources à une forme
  dasherized au lieu d'être souligné par défaut dans les URL. Vous pouvez conserver la
  forme soulignée en utilisant ``'inflect' => 'underscore'`` dans l'argument ``$options``.
* ``Router::plugin()`` et ``Router::prefix()`` utilisent à présent le nom dasherized du
  plugin/prefix par défaut dans l'URL. Vous pouvez conserver la forme soulignée (ou toute
  autre forme de chemin personnalisée) en utilisantla clé ``'path'`` dans l'argument
  ``$options``.
* ``Router`` maintient à présent la référence à une seule instance de requête à la place
  d'une pile des demandes. ``Router::pushRequest()``, ``Router::setRequestInfo()``
  et ``Router::setRequestContext()`` ont été supprimées, utilisez ``Router::setRequest()``
  à la place. ``Router::popRequest()`` a été supprimée. ``Router::getRequest()``
  ne possède plus d'argument ``$current``.

TestSuite
---------

* ``Cake\TestSuite\TestCase::$fixtures`` ne peut pas être une chaîne séparée par des virgules
  plus. Ce doit être un tableau..

Utility
-------

* ``Cake\Utility\Xml::fromArray()`` nécessite maintenant un tableau pour le paramètre
  ``$options``.
* ``Cake\Filesystem\Folder::copy($to, array $options = [])`` et
  ``Cake\Filesystem\Folder::move($to, array $options = [])`` ont maintenant le
  chemin cible extrait comme premier argument..
* L'option ``readFile`` de ``Xml::build()`` n'a plus la valeur true par défaut.
  Au lieu de cela, vous devez activer ``readFile`` pour lire les fichiers locaux.
* ``Hash::sort()`` accepte désormais les constantes ``SORT_ASC`` et ``SORT_DESC`` comme
  paramètre de direction.
* ``Inflector::pluralize()`` infléchit maintenant ``index`` à ``indexes`` au lieu de``indices``.
  Cela reflète l'utilisation technique de ce pluriel dans le noyau ainsi que dans l'écosystème.

View
----

* Les modèles (Templetes) ont été déplacés du dossier ``src/Template/`` vers le dossier
  ``templates/`` à la racine de l'application et des plugins.
  Avec cette modification, le dossier ``src`` ne contient plus que des fichiers
  avec des classes qui sont chargées automatiquement via l'autoloader de composer.
* Les dossiers de modèles spéciaux comme ``Cell``, ``Element``, ``Email``, ``Layout``
  et ``Plugin``  ont été renommés en minuscules ``cell``, ``element``, ``email``,
  ``layout`` and ``plugin`` respectivement. Cela permet une meilleure distinction
  visuelle entre les dossiers spéciaux et les dossiers correspondant aux noms de
  contrôleurs de votre application qui eux sont exprimés sous la forme ``CamelCase``.
* L'extension des fichiers de Template a été modifiée ``.ctp`` à ``.php``.
  L'extension spéciale n'a fourni aucun avantage réel et a plutôt nécessité que
  les éditeurs/IDE soient configurés pour reconnaître les fichiers avec l'extension
  ``.ctp`` en tant que fichiers PHP.
* Vous ne pouvez plus utiliser ``false`` comme argument pour ``ViewBuilder::setLayout()``
  ou ``View::setLayout()`` pour définir la propriété ``View::$layout`` à ``false``.
  Utilisez plutôt ``ViewBuilder::disableAutoLayout()`` et ``View::disableAutoLayout()``
  pour rendre un modèle de vue sans mise en page.
* ``Cake\View\View`` re-rendra les vues au lieu de retourner ``null``
  si ``render()`` est appelée plusieurs fois.
* Les constantes ``View::NAME_ELEMENT`` et ``View::NAME_LAYOUT`` ont été supprimées.
  Vous pouvez utiliser ``View::TYPE_ELEMENT`` et ``View::TYPE_LAYOUT``.

Helper
------

* Les arguments de ``Cake\View\Helper\PaginatorHelper::hasPage()`` ont été intervertis.
  Cela la rend cohérente avec les autres méthodes de pagination pour lesquelles le
  'modèle' est le deuxième argument.
* ``Cake\View\Helper\UrlHelper::build()`` n'accepte plus un booléen pour le
  deuxième paramètre. Vous devez utiliser ``['fullBase' => true]`` à la place.
* Vous devez maintenant utiliser uniquement ``null`` comme 1er argument de
  ``FormHelper::create()`` pour créer un formulaire sans contexte.
  Passer toute autre valeur pour laquelle le contexte ne peut pas être déduit
  entraînera la levée d'une exception.
* ``Cake\View\Helper\FormHelper`` et ``Cake\View\Helper\HtmlHelper`` utilisent
  à présent l'attribut de donnée HTML ``data-confirm-message`` afin de conserver
  le message de confirmation pour les méthodes qui ont l'option ``confirm``.
* ``Cake\View\Helper\FormHelper::button()`` encode à présent par défaut sous forme
  d'entités HTML le texte des boutons ainsi que les attrinuts HTML. Une nouvelle option
  ``escapeTitle`` a été ajouté pour permettre de contrôler l'échappement du titre
  séparément des autres attributs HTML.
* ``Cake\View\Helper\SecureFieldTokenTrait`` a été supprimé. Sa fonctionnalité permettant
  de construire des jetons de formulaires à partir des données est désormais incluse dans
  la classe interne ``FormProtector``.
* La méthode ``HtmlHelper::docType()`` a été supprimée. HTML4 et XHTML sont maintenant
  obsolètes et doctype pour HTML5 est assez court et facile à taper directement.
* L'option  ``safe`` pour ``HtmlHelper::scriptBlock()`` et ``HtmlHelper::scriptStart()``
  a été retiré. Lorsqu'il était activé, il générait des tags ``CDATA`` qui ne sont
  nécessaires que pour XHTML qui est maintenant obsolète..

Log
---

* Les méthodes relatives au Logging comme ``Cake\Log\LogTrait::log()``, ``Cake\Log\Log::write()`` etc.
  n'acceptent désormais plus que des chaînes de caractère comme argument ``$message``.
  Ce changement était nécessaire pour aligner l'API avec le standard
  `PSR-3 <https://www.php-fig.org/psr/psr-3/>`__.

Miscellaneous
-------------

* Le fichier ``config/bootstrap.php`` de votre application doit maintenant contenir
  un appel à ``Router::fullBaseUrl()``.
  Consultez le dernier squelette d'application ``bootstrap.php`` et mettez le votre à jour
  en conséquence.
* ``App::path()`` utilise mainetant ``$type`` et ``templates`` à la place de ``Template`` pour
  obtenir le chemin d'accès des templates. De même, ``locales`` est utilisé au lieu de ``Locale``
  pour obtenir le chemin diu dossier contenant les traductions.
* ``ObjectRegistry::get()`` lève maintenant une exception si l'objet avec le nom fourni n'est pas chargé.
  Vous devez utiliser ``ObjectRegistry::has()`` pour vous assurer que l'objet existe dans le registre.
  Le getter magique ``ObjectRegistry::__get()`` continuera à retourner ``null`` si l'objet
  correspondant au nom n'est pas chargé.
* Les fichiers de traduction (Locale) ont été déplacés de  ``src/Locale`` vers ``resources/locales``.
*
Le fichier  ``cacert.pem`` qui était fourni dans CakePHP a été remplacé par
  une dépendance vers `composer/ca-bundle <https://packagist.org/packages/composer/ca-bundle>`__.


Nouvelles fonctionnalités
=========================

Console
-------

* Les classes de commande peuvent implémenter la méthode ``defaultName()`` pour remplacer le
  nom CLI basé sur les conventions.

Core
----

* ``InstanceConfigTrait::getConfigOrFail()`` et
  ``StaticConfigTrait::getConfigOrFail()`` ont été ajoutées. Comme les autres ``orFail``
   méthodes ces méthodes lèveront une exception lorsque la clé demandée n'existe pas
   ou possède la valeur ``null``.

Database
--------

* Si le fuseau horaire de votre base de données ne correspond pas au fuseau horaire PHP,
  vous pouvez utiliser ``DateTime::setDatabaseTimezone()``.
  Référez-vous à :ref:`datetime-type` pour plus de détails.
* ``DateTime::setKeepDatabaseTimezone()`` vous permet de conserver le fuseau horaire de
  la base de données dans les objets DateTime créés par des requêtes..
* ``Cake\Database\Log\LoggedQuery`` implémente à présent ``JsonSerializable``.
* ``Cake\Database\Connection`` permet désormais d'utiliser n'importe quel logger PSR-3.
  Par conséquent ceux qui utilisent le package de base de données autonome ne sont plus
  obligés d'utiliser le paquet ``cakephp/log`` pour la journalisation.
* ``Cake\Database\Connection``  permet désormais d'utiliser n'importe quel cache PSR-16.
  Par conséquent ceux qui utilisent le package de base de données autonome ne sont plus
  obligés d'utiliser le paquet ``cakephp/cache`` pour la mise en cache. Les nouvelles
  méthodes ``Cake\Database\Connection::setCacher()`` et ``Cake\Database\Connection::getCacher()``
  ont été ajoutées.
* ``Cake\Database\ConstraintsInterface`` a été extraite de
  ``Cake\Datasource\FixtureInterface``. Cette interface doit être implémentée
  par les les implémentations de fixture qui supportent les contraintes, ce qui d'après
  notre expérience est générallement le cas des bases de données relationelles.
* Le type abstrait ``char`` a été ajouté. Ce type gère les colonnes de types 'caractères de longueur fixe'.
* Les types abstraits  ``datetimefractional`` et ``timestampfractional`` ont été ajoutés.
  Ces types gèrent les colonnes de types 'secondes décimales'.
* Les schémas SqlServer prennent désormais en charge les valeurs par défaut avec des fonctions comme SYSDATETIME().
* Les types abstraits ``datetimetimezone`` et ``timestamptimezone`` ont été ajoutés.
  Ces types gèrent les colonnes de types supportant la gestion du fuseau horaire (time zone).

Error
-----

* Si une erreur est déclenchée par une action du contrôleur dans une route préfixée,
  ``ErrorController`` tentera d'utiliser un modèle d'erreur préfixé s'il y en a un
  disponible. Ce comportement n'est appliqué que lorsque ``debug`` est désactivé.

Http
----

* Vous pouvez utiliser ``cakephp/http`` sans inclure le framework complet.
* CakePHP supporte désormais la spécification `PSR-15: HTTP Server Request Handlers
  <https://www.php-fig.org/psr/psr-15/>`__. En conséquence, les middlewares
  implémentent désormais ``Psr\Http\Server\MiddlewareInterface``. Les middlewares
  invocables à double passe de CakePHP 3.x sont toujours pris en charge afin d'assurer
  la compatibilité ascendante.
* ``Cake\Http\Client`` suit à présent la spécification `PSR-18: HTTP Client <https://www.php-fig.org/psr/psr-18/>`__.
* ``Cake\Http\Client\Response::isSuccess()`` a été ajoutée. Cette méthode renvoie true
  si le code d'état de la réponse est 2xx
* ``CspMiddleware`` a été ajouté afin de simplifier la définition de la stratégie de sécurité des contenus
  dans les en-têtes (Content Security Policy headers).
* ``HttpsEnforcerMiddleware`` a été ajouté. Il remplace la fonction ``requireSecure``
  du composant ``SecurityComponent``.
* Les cookies prennent désormais en charge l'attribut ``SameSite``.

I18n
----

* ``Date`` et ``FrozenDate`` respectent désormais le paramètre de fuseau horaire pour
  divers assistants comme ``today('Asia/Tokyo')``.

Mailer
------

* La responsabilité de la génération des e-mails a maintenant été transférée à
  ``Cake\Mailer\Renderer``.  Il s'agit principalement d'un changement architectural et n'a pas
  d'impact sur la façon dont la classe ``Email`` est utilisée. La seule différence est que
  vous avez maintenant besoin d'utiliser ``Email::setViewVars()`` au lieu de ``Email::set()``
  pour définir les variables de templates.

ORM
---

* La méthode ``Table::saveManyOrFail()`` qui a été ajoutée lèvera une exception
  ``PersistenceFailedException`` mentionnant en cas d'erreur l'entité dont l'enregistrement
  a échoué. Les entités sont enregistrées au sein d'une transaction.
* Les méthodes ``Table::deleteMany()`` et ``Table::deleteManyOrFail()`` ont été ajoutées pour
  permettre la suppression de plusieurs entités à la fois en incluant des callbacks.
  Les entités sont supprimées au sein d'une transaction.
* ``Table::newEmptyEntity()`` a été ajoutée pour créer une nouvelle entité vide.
  Cela ne déclenche aucune validation de champ. L'entité peut être
  persistée sans erreur de validation en tant qu'enregistrement vide.
* ``Cake\ORM\RulesChecker::isLinkedTo()`` et ``isNotLinkedTo()`` ont été ajoutées.
  Ces nouvelles règles d'application vous permettent de vous assurer qu'une association
  possède ou non des enregistrements connexes.
* Une nouvelle classe de type ``DateTimeFractionalType`` a été ajoutée pour les types datetime
  avec une précision de l'ordre de la microseconde. Vous pouvez choisir d'utiliser ce type
  en l'ajoutant au ``TypeFactory`` comme type par défaut pour le type ``datetime`` ou en
  re-mappant chaque type de colonne. Voir les notes de migration de base de données pour
  savoir comment ce type est automatiquement mappé aux types de base de données.
* Une nouvelle classe de type ``DateTimeTimezoneType`` a été ajoutée pour les types datetime
  supportant la prise en charge du fuseau horaire. Vous pouvez choisir d'utiliser ce type
  en l'ajoutant au ``TypeFactory`` comme type par défaut pour le type ``datetime`` ou en
  re-mappant chaque type de colonne. Voir les notes de migration de base de données pour
  savoir comment ce type est automatiquement mappé aux types de base de données.


Routing
-------

* ``Cake\Routing\Asset`` a été ajoutée. Cette classe expose la génération d'URL
  de ressources via une interface statique similaire à ``Router::url()``.
  Voir :ref:`asset-routing` pour plus d'information.

TestSuite
---------

* ``TestSuite\EmailTrait::assertMailContainsAttachment()`` a été ajouté.

Validation
----------

* ``Validation::dateTime()`` accepte désormais les valeurs en microsecondes.

View
----

* ``FormHelper`` génère désormais des messages de validation HTML5 pour les champs
  marqués comme "notEmpty" dans la classe Table correspondant à l'entité. Cette fonction
  peut être activée grâce à l'option de configuration ``autoSetCustomValidity`` de la classe.
* ``FormHelper`` génère désormais des balises d'entrée HTML5 natives pour les champs datetime.
  Consultez la page :ref:`Form Helper <create-datetime-controls>` pour plus de détails.
  Si vous devez conserver l'ancien balisage, un FormHelper calé peut être trouvé dans
  `Shim plugin <https://github.com/dereuromark/cakephp-shim>`__ avec l'ancien
  behavior/generation (4.x branch).
* ``FormHelper`` définit maintenant la taille de l'incrément par défaut en secondes
  pour les widgets ``datetime`` qui possèdent une composante de temps.
  La valeur par défaut est de millisecondes si le champ provient des nouveaux types
  de données ``datetimefractional`` ou ``timestampfractional``.
