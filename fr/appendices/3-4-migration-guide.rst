3.4 Guide de Migration
######################

CakePHP 3.4 est une mise à jour de CakePHP 3.3 dont la compatibilité API est
complète. Cette page souligne les changements et améliorations faits dans 3.4.

Dépréciations
=============

La liste qui suit regroupe les méthodes, les propriétés et les comportements
dépréciés. Ces différents éléments continueront de fonctionner jusqu'à la
version 4.0.0, à partir de laquelle ils seront supprimés.

Dépréciations sur Request & Response
------------------------------------

La majorité des dépréciations de la version 3.4 se trouve sur les objets
``Request`` et ``Response``. Les méthodes existantes qui modifient directement
les objets sont maintenant dépréciées et remplacées par les méthodes qui
suivent le pattern des "objets immutables" décrit dans le standard PSR-7.

Plusieurs propriétés de ``Cake\Network\Request`` ont été dépréciées :

  * ``Request::$params`` est dépréciée. Utilisez ``Request::getParam()`` à la place.
  * ``Request::$data`` est dépréciée. Utilisez ``Request::getData()`` à la place.
  * ``Request::$query`` est dépréciée. Utilisez ``Request::getQuery()`` à la place.
  * ``Request::$cookies`` est dépréciée. Utilisez ``Request::getCookie()`` à la place.
  * ``Request::$base`` est dépréciée. Utilisez ``Request::getAttribute('base')`` à la place.
  * ``Request::$webroot`` est dépréciée. Utilisez ``Request::getAttribute('webroot')`` à la place.
  * ``Request::$here`` est dépréciée. Utilisez ``Request::here()`` à la place.
  * ``Request::$_session`` a été renommée ``Request::$session``.

Certaines méthodes de ``Cake\Network\Request`` ont été dépréciées :

* Les méthodes ``__get()`` & ``__isset()`` sont dépréciées. Utilisez
  ``getParam()`` à la place.
* ``method()`` est dépréciée. Utilisez plutôt ``getMethod()``.
* ``setInput()`` est dépréciée. Utilisez plutôt ``withBody()``.
* Les méthodes ``ArrayAccess`` ont toutes été dépréciées.
* ``Request::param()`` est dépréciée. Utilisez plutôt ``Request::getParam()`` .
* ``Request::data()`` est dépréciée. Utilisez plutôt ``Request::getData()``.
* ``Request::query()`` est dépréciée. Utilisez plutôt ``Request::getQuery()``.
* ``Request::cookie()`` est dépréciée. Utilisez plutôt ``Request::getCookie()``.

Plusieurs méthodes de ``Cake\Network\Response`` ont été dépréciées soit parce
qu'elles faisaient doublon avec les méthodes PSR-7, soit parce qu'elles ont été
rendues obsolètes du fait de l'introduction du stack PSR-7 :

* ``Response::header()`` est dépréciée. Utilisez plutôt ``getHeaderLine()``,
  ``hasHeader()`` ou ``Response::getHeader()``.
* ``Response::body()`` est dépréciée. Utilisez plutôt ``Response::withBody()``.
* ``Response::statusCode()`` est dépréciée. Utilisez plutôt ``Response::getStatusCode()``.
* ``Response::httpCodes()`` Cette méthode ne devrait plus être utilisée.
  CakePHP supporte maintenant tous les statuts standards recommandés.
* ``Response::protocol()`` est dépréciée. Utilisez plutôt ``Response::getProtocolVersion()``.
* ``send()``, ``sendHeaders()``, ``_sendHeader()``, ``_sendContent()``,
  ``_setCookies()``, ``_setContentType()``, et ``stop()`` sont dépréciées et
  rendues obsolètes par le stack HTTP PSR-7.

Du fait que les ``responses`` sont maintenant des objets immutables du fait des
recommandations du standard PSR-7, de nombreuses méthodes "helper" de l'objet
``Response`` ont été dépréciées. Leurs variantes immutables sont maintenant
recommandées :

* ``Response::location()`` devient ``Response::withLocation()``
* ``Response::disableCache()`` devient ``Response::withDisabledCache()``
* ``Response::type()`` devient ``Response::withType()``
* ``Response::charset()`` devient ``Response::withCharset()``
* ``Response::cache()`` devient ``Response::withCache()``
* ``Response::modified()`` devient ``Response::withModified()``
* ``Response::expires()`` devient ``Response::withExpires()``
* ``Response::sharable()`` devient ``Response::withSharable()``
* ``Response::maxAge()`` devient ``Response::withMaxAge()``
* ``Response::vary()`` devient ``Response::withVary()``
* ``Response::etag()`` devient ``Response::withEtag()``
* ``Response::compress()`` devient ``Response::withCompression()``
* ``Response::length()`` devient ``Response::withLength()``
* ``Response::mustRevalidate()`` devient ``Response::withMustRevalidate()``
* ``Response::notModified()`` devient ``Response::withNotModified()``
* ``Response::cookie()`` devient ``Response::withCookie()``
* ``Response::file()`` devient ``Response::withFile()``
* ``Response::download()`` devient ``Response::withDownload()``

Veuillez vous référez à la section :ref:`adopting-immutable-responses` pour
plus d'informations avant de mettre à jour votre code car utiliser les méthodes
immutables va demander plus de changements que le simple remplacement des
méthodes.

Autres dépréciations
--------------------

* Les propriétés _public_ de ``Cake\Event\Event`` sont dépréciées, de nouvelles
  méthodes ont été ajoutées pour lire et écrire ces propriétés.
* La valeur de ``Auth.redirect`` stockée en session n'est plus utilisée. Un
  paramètre d'URL est maintenant utilisé pour stocker l'URL de redirection.
* ``AuthComponent`` ne stocke plus les URLs de redirection quand l'URL non
  autorisée n'est pas une action ``GET``.
* L'option ``ajaxLogin`` du ``AuthComponent`` est dépréciée. Vous devez maintenant
  utiliser le code de statut HTTP ``403`` pour déclencher le bon comportement côté
  client.
* La méthode ``beforeRedirect`` du ``RequestHandlerComponent`` est dépréciée.
* Le code de statut HTTP ``306`` de ``Cake\Network\Response`` est dépréciée. Sa
  phrase de statut est maintenant 'Unused' car ce code de statut n'est pas
  standard.
* ``Cake\Database\Schema\Table`` a été renommée en
  ``Cake\Database\Schema\TableSchema``. Le nom précédent portait à confusion
  pour de nombreux utilisateurs.
* L'option ``fieldList`` pour ``Cake\ORM\Table::newEntity()`` et
  ``patchEntity()`` a été renommée en ``fields`` pour être plus cohérent avec
  les autres parties de l'ORM.

Dépréciation des getters / setters combinés
-------------------------------------------

Par le passé, CakePHP a exposé des méthodes combinées qui opéraient à la fois
comme getter et comme setter. Ces méthodes compliquaient l'auto-complétion de
certains IDE et auraient compliqué la mise en place de typage strictes sur les
retours des méthodes dans le futur. Pour ces raisons, les getters / setters
combinés sont maintenant séparés dans différentes méthodes.

La liste qui suit regroupe les méthodes qui sont dépréciées et remplacées par
des méthodes ``getX`` et ``setX`` :

Cake\Console\ConsoleOptionParse
    * ``command()``
    * ``description()``
    * ``epliog()``
Cake\Database\Connection
    * ``driver()``
    * ``schemaCollection()``
    * ``useSavePoints()`` (devenue ``enableSavePoints()`` / ``isSavePointsEnabled()``)
Cake\Database\Driver
    * ``autoQuoting`` (devenue ``enableAutoQuoting()`` / ``isAutoQuotingEnabled()``)
Cake\Database\Expression\FunctionExpression
    * ``name()``
Cake\Database\Expression\QueryExpression
    * ``tieWith()`` (devenue ``setConjunction()`` / ``getConjunction()``)
Cake\Database\Expression\ValuesExpression
    * ``columns()``
    * ``query()``
Cake\Database\Query
    * ``connection()``
    * ``selectTypeMap()``
    * ``bufferResults()`` (devenue ``enableBufferedResults()`` / ``isBufferedResultsEnabled()``)
Cake\Database\Schema\CachedCollection
    * ``cacheMetadata()``
Cake\Database\Schema\TableSchema
    * ``options()``
    * ``temporary()`` (devenue ``setTemporary()`` / ``isTemporary()``)
Cake\Database\TypeMap
    * ``defaults()``
    * ``types()``
Cake\Database\TypeMapTrait
    * ``typeMap()``
    * ``defaultTypes()``
Cake\ORM\EagerLoadable
    * ``config()``
    * setter part of ``canBeJoined()`` (devenue ``setCanBeJoined()``)
Cake\ORM\EagerLoader
    * ``matching()``
    * ``autoFields()`` (devenue ``enableAutoFields()`` / ``isAutoFieldsEnabled()``)
Cake\ORM\Locator\TableLocator
    * ``config()``
Cake\ORM\Query
    * ``eagerLoader()``
Cake\ORM\Table
    * ``table()``
    * ``alias()``
    * ``registryAlias()``
    * ``connection()``
    * ``schema()``
    * ``primaryKey()``
    * ``displayField()``
    * ``entityClass()``
Cake\Mailer\Email
    * ``from()``
    * ``sender()``
    * ``replyTo()``
    * ``readReceipt()``
    * ``returnPath()``
    * ``to()``
    * ``cc()``
    * ``bcc()``
    * ``charset()``
    * ``headerCharset()``
    * ``emailPattern()``
    * ``subject()``
    * ``template()`` (devenue ``setTemplate()`` / ``getTemplate()`` et ``setLayout()`` / ``getLayout()``)
    * ``viewRender()`` (devenue ``setViewRenderer()`` / ``getViewRenderer()``)
    * ``viewVars()``
    * ``theme()``
    * ``helpers()``
    * ``emailFormat()``
    * ``transport()``
    * ``messageId()``
    * ``domain()``
    * ``attachments()``
    * ``configTransport()``
    * ``profile()``
Cake\Validation\Validator
    * ``provider()``
Cake\View\StringTemplateTrait
    * ``templates()``
Cake\View\ViewBuilder
    * ``templatePath()``
    * ``layoutPath()``
    * ``plugin()``
    * ``helpers()``
    * ``theme()``
    * ``template()``
    * ``layout()``
    * ``options()``
    * ``name()``
    * ``className()``
    * ``autoLayout()`` (devenue ``enableAutoLayout()`` / ``isAutoLayoutEnabled()``)

.. _adopting-immutable-responses:

Adopter les Responses Immutable
===============================

Avant de migrer votre code pour qu'il utilise les nouvelles méthodes de l'objet
Response, sachez que les nouvelles méthodes sont bâties sur un concept
différent. Les objets immutables sont généralement indiquées par le préfixe
``with`` (par exemple : ``withLocation()``). Du fait que ces méthodes évoluent
dans un contexte immutable, elles retournent de nouvelles instances que vous
devez assigner à des variables ou des propriétés. Partons du principe que vous
aviez du code de Controller similaire à celui-ci::

    $response = $this->response;
    $response->location('/login')
    $response->header('X-something', 'a value');

Si vous faites un simple "rechercher / remplacer" pour changer le nom des
méthodes, cela ne fonctionnera pas. Vous devriez plutôt remplacer votre code
pour qu'il ressemble à ceci::

    $this->response = $this->response
        ->withLocation('/login')
        ->withHeader('X-something', 'a value');

Voici les points clés à comprendre :

#. Le résultat de vos changements doit être ré-assigné à ``$this->response``.
   C'est le point le plus important pour conserver le fonctionnement souhaité.
#. Les méthodes "setter" peuvent être chaînées. Cela vous permet d'éviter de
   stocker tous les états intermédiaires.

Astuces pour Migrer vos Components
----------------------------------

Dans les versions précédentes de CakePHP, les Components possédaient souvent
des références aux objets Request et Response pour pouvoir les modifier. Avant
d'utiliser les méthodes immutable, vous devriez utiliser les Response attachées
au Controller::

    // Dans une méthode de Component (or callback)
    $this->response->header('X-Rate-Limit', $this->remaining);

    // Deviendrait
    $controller = $this->getController();
    $controller->response = $controller->response->withHeader('X-Rate-Limit', $this->remaining);

Dans les callbacks des Components, vous pouvez utiliser l'objet Event pour
accéder à la Response / au Controller::

    public function beforeRender($event)
    {
        $controller = $event->getSubject();
        $controller->response = $controller->response->withHeader('X-Teapot', 1);
    }

.. tip::
    Plutôt que conserver une référence aux Responses, récupérez plutôt la Response
    actuelle stockée dans le Controller et modifiez la propriété ``response``
    quand vous avez terminé vos modifications.

Changement de comportements
===========================

Bien que ces changements garde la compatibilité API, ce sont tout de même des
variations mineures qui pourraient avoir un impact sur votre application :

* Les résultats de ``ORM\Query`` ne feront plus de typecast sur les alias de
  colonnes basé sur le type de colonne original. Par exemple, si vous faites
  un alias de ``created`` en ``created_time``, vous obtiendrez maintenant une
  instance de ``Time`` plutôt qu'une chaîne de caractères.
* Le ``AuthComponent`` utilise maintenant un paramètre URL pour stocker
  l'adresse de redirection quand un utilisateur non identifié est redirigé sur
  la page de connexion. Auparavant, l'URL de redirection était stockée en
  session. Utiliser un paramètre d'URL permet une meilleure compatibilité avec
  les différents navigateurs.
* Le système de *reflection* de base de données traite maintenant les types de
  colonnes inconnus comme ``string`` et non plus comme ``text``. L'impact de ce
  changement est notamment visible sur le ``FormHelper`` qui va générer des
  inputs à la place de textarea pour les types de colonnes inconnus.
* ``AuthComponent`` ne va plus stocker ses messages Flash via la clé 'auth'.
  Ils seront maintenant rendu avec le template 'error' et sous la clé flash
  'default'. Ceci a été fait dans le but de simplifier ``AuthComponent``.
* ``Mailer\Email`` va maintenant automatiquement détecter les types de contenus
  des pièces jointes en utilisant ``mime_content_type`` si le "content-type"
  n'est pas spécifié. Auparavant, les pièces jointes étaient considérées comme
  'application/octet-stream' par défaut.

Collection
==========

* ``CollectionInterface::chunkWithKeys()`` a été ajoutée. Les implémentations
  de ``CollectionInterface`` des utilisateurs devront maintenant implémenter
  cette méthode.
* ``Collection::chunkWithKeys()`` a été ajoutée.

Erreur
======

* ``Debugger::setOutputMask()`` et ``Debugger::outputMask()`` ont été ajoutées.
  Ces méthodes vous permettent de configurer des propriétés / clés de tableau
  qui devraient être masquées lors d'affichages générés par le ``Debugger``
  (lors d'un appel à ``debug()`` par exemple).

Event
=====

* ``Event::data()`` a été ajoutée.
* ``Event::setData()`` a été ajoutée.
* ``Event::result()`` a été ajoutée.
* ``Event::setResult()`` a été ajoutée.

I18n
====

* Vous pouvez maintenant personnaliser le comportement du loader de messages
  de fallback. Reportez-vous à :ref:`creating-generic-translators` pour plus
  d'information.

Routing
=======

* ``RouteBuilder::prefix()`` accepte maintenant un tableau de paramètres par
  défaut à ajouter à chaque route "connectée".

PaginatorHelper
===============

* ``PaginatorHelper::numbers()`` utilise maintenant une ellipse HTML au lieu de
  '...' dans les templates par défaut.
* ``PaginatorHelper::total()`` a été ajoutée et permet de lire le nombre total
  de pages pour le résultat de requête actuellement paginé.
* ``PaginatorHelper::generateUrlParams()`` a été ajoutée et est utilisée comme
  méthode de construction d'URL "bas niveau".
* ``PaginatorHelper::meta()`` peut maintenant créer des liens pour 'first' et
  'last'.

FormHelper
==========

* Vous pouvez maintenant configurer les sources à partir desquelles FormHelper
  lit. Ceci simplifie la création des formulaires GET. Consultez :ref:`form-values-from-query-string` pour plus d'informations.
* ``FormHelper::input()`` est dépréciée. Utilisez plutôt ``FormHelper::control()``.
* ``FormHelper::inputs()`` est dépréciée. Utilisez plutôt ``FormHelper::controls()``.
* ``FormHelper::allInputs()`` est dépréciée. Utilisez plutôt ``FormHelper::allControls()``.

Validation
==========

* ``Validation::falsey()`` et ``Validation::truthy()`` ont été ajoutées.

PluginShell
===========

* ``cake plugin load`` et ``cake plugin unload`` supportent maintenant une
  option ``--cli`` qui permet de mettre à jour ``bootstrap_cli.php`` à la place
  de ``bootstrap.php``.
