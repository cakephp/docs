2.1 Guide de Migration
######################

CakePHP 2.1 est une mise à jour de l'API complètement compatible à partir de
2.0. Cette page souligne les changements et améliorations faits pour 2.1.

AppController, AppHelper, AppModel et AppShell
==============================================

Ces classes sont désormais tenues de faire partie du répertoire app,
puisqu'elles ont été retirées du coeur de CakePHP. Si vous n'avez toujours pas
ces classes, vous pouvez utiliser ce qui suit pour la mise à jour::

    // app/View/Helper/AppHelper.php
    App::uses('Helper', 'View');
    class AppHelper extends Helper {
    }

    // app/Model/AppModel.php
    App::uses('Model', 'Model');
    class AppModel extends Model {
    }

    // app/Controller/AppController.php
    App::uses('Controller', 'Controller');
    class AppController extends Controller {
    }

    // app/Console/Command/AppShell.php
    App::uses('Shell', 'Console');
    class AppShell extends Shell {
    }

Si votre application a ces fichiers/classes, vous n'avez rien besoin de faire.
De plus, si vous utilisiez le PagesController du coeur, vous aurez aussi besoin
de le copier dans votre répertoire app/Controller.

Fichiers .htaccess
==================

Les fichiers ``.htaccess`` par défaut ont changé, vous devrez vous rappeler de
les mettre à jour ou de mettre à jour les schémas URL de re-writing de vos
serveurs web pour correspondre aux changements faits dans ``.htaccess``

Models
======

- Le callback ``beforeDelete`` sera vidé avant les callbacks beforeDelete des
  behaviors. Cela donne plus de cohérence avec le reste des évènements
  déclenchés dans la couche Model.
- ``Model::find('threaded')`` accepte maintenant ``$options['parent']`` si vous
  utilisez un autre champ, alors ``parent_id``. Aussi, si le model a
  TreeBehavior attaché et configuré avec un autre champ parent, le find
  threaded l'utilisera par défaut.
- Les paramètres pour les requêtes utilisant les requêtes préparées vont
  maintenant faire partie de l'instruction SQL.
- Les tableaux de validation peuvent maintenant être plus précis quand un champ
  est obligatoire. La clé ``required`` accepte ``create`` et ``update``.  Ces
  valeurs rendront un champ obligatoire lors de la création ou la mise à jour.
- Model now has a ``schemaName`` property.  If your application switches
  datasources by modifying :php:attr:`Model::$useDbConfig` you should also
  modify ``schemaName`` or use :php:meth:`Model::setDataSource()` method which
  handles this for you.
  Le Model a maintenant une propriété ``schemaName``. Si votre application
  change de sources de données en modifiant :php:attr:`Model::$useDbConfig`,
  vous devriez aussi modifier ``schemaName`` ou utiliser la méthode
  :php:meth:`Model::setDataSource()` qui gère cela pour vous.

CakeSession
-----------

.. versionchanged:: 2.1.1
    CakeSession ne fixe plus l'en-tête P3P, puisque cela relève de la
    responsabilité de votre application.

Behaviors
=========

TranslateBehavior
-----------------

- :php:class:`I18nModel` a été déplacé vers un fichier séparé.

Exceptions
==========

L'exception par défaut de rendu inclut maintenant des traces de pile plus
détaillées y compris des extraits de fichiers et les décharges d'arguments pour
toutes les fonctions dans la pile.

Utilitaire
==========

Debugger
--------

- :php:func:`Debugger::getType()` a été ajoutée. Elle peut être utilisée pour
  récupérer le type de variables.
- :php:func:`Debugger::exportVar()` a été modifiée pour créer une sortie plus
  lisible et plus utile.

debug()
-------

`debug()` utilise maintenant :php:class:`Debugger` en interne. Cela la rend
plus cohérente avec avec Debugger, et profite des améliorations faîtes ici.

Set
---

- :php:func:`Set::nest()` a été ajoutée. Elle prend en argument un tableau plat
  et retourne un tableau imbriqué.

File
----

- :php:meth:`File::info()` inclut les informations de taille et de mimetype du
  fichier.
- :php:meth:`File::mime()` a été ajoutée.

Cache
-----

- :php:class:`CacheEngine` a été déplacée dans un fichier séparé.

Configuration
-------------

- :php:class:`ConfigReaderInterface` a été déplacée dans un fichier séparé.

App
---

- :php:meth:`App::build()` a maintenant la possibilité d'enregistrer de
  nouveaux paquets` à l'aide de``App::REGISTER``.
  Voir :ref:`app-build-register` pour plus d'informations.
- Les classes qui ne peuvent pas être trouvées sur les chemins configurés vont
  être cherchées dans ``APP`` comme un chemin de secours. Cela facilite le
  chargement automatique des répertoires imbriqués dans ``app/Vendor``.

Console
=======

Shell de Test
-------------

Un nouveau TestShell a été ajouté. Il réduit le typage requis pour exécuter les
tests unitaires, et offre un chemin de fichier en fonction d'interface
utilisateur::

    # Execute les tests du model post
    Console/cake test app/Model/Post.php
    Console/cake test app/Controller/PostsController.php

Le vieux shell testsuite et sa syntaxe sont encore disponibles.

Général
-------

- Les fichiers générés ne contiennent plus les timestamps avec la génération
  des datetime.

Routing
=======

Router
------

- Les routes peuvent maintenant utiliser une syntaxe spéciale ``/**`` pour
  inclure tous les arguments de fin en un argument unique passé . Voir la
  section sur :ref:`connecting-routes` pour plus d'informations.
- :php:meth:`Router::resourceMap()` a été ajoutée.
- :php:meth:`Router::defaultRouteClass()` a été ajoutée. Cette méthode vous
  autorise à définir la classe route par défaut utilisée pour toutes les routes
  à venir qui sont connectés.


Réseau
======

CakeRequest
-----------

- Ajout de ``is('requested')`` et ``isRequested()`` pour la détection de
  requestAction.

CakeResponse
------------

- Ajout :php:meth:`CakeResponse::cookie()` pour la définition des cookies.
- Ajout d'un nombre de méthodes pour :ref:`cake-response-caching`

Controller
==========

Controller
----------

- :php:attr:`Controller::$uses` a été modifié, la valeur par défaut est
  maintenant ``true`` à la place de false. De plus, les différentes valeurs
  sont traitées de façon légèrement différente, mais se comportera comme cela
  dans la plupart des cas.

    - ``true`` va charger le model par défaut et fusionnser avec AppController.
    - Un tableau va charger ces models et fusionner avec AppController.
    - Un tableau vide ne va charger aucun model, sauf ceux déclarés dans la
      classe de base.
    - ``false`` ne va charger aucun model, et ne va pas non plus fusionner
      avec la classe de base.

Components (Composants)
=======================

AuthComponent
-------------

- :php:meth:`AuthComponent::allow()` n'accepte plus ``allow('*')`` en joker
  pour toutes les actions. Utilisez juste ``allow()``. Cela unifie l'API entre
  allow() et deny().
- L'option ``recursive`` a été ajoutée à toutes les cartes d'authentification.
  Vous permet de contrôler plus facilement les associations stockées dans la
  session.

AclComponent
------------

- :php:class:`AclComponent` ne met plus en minuscules et n'infléchit plus
  le nom de classe utilisé pour ``Acl.classname``. A la place, il utilise la
  valeur fournie comme telle.
- Les implémentations Backend Acl devraient maintenant être mis dans
  ``Controller/Component/Acl``.
- Les implémentations Acl doivent être déplacées dans le dossier Component/Acl
  à partir de Component. Par exemple si votre classe Acl a été appelée
  ``CustomAclComponent``, et était dans
  ``Controller/Component/CustomAclComponent.php``.
  Il doit être déplacé dans ``Controller/Component/Acl/CustomAcl.php``, et être
  nommé ``CustomAcl``.
- :php:class:`DbAcl` a été déplacée dans un fichier séparé.
- :php:class:`IniAcl` a été déplacée dans un fichier séparé.
- :php:class:`AclInterface` a été déplacée dans un fichier séparé.

Helpers
=======

TextHelper
----------

- :php:meth:`TextHelper::autoLink()`, :php:meth:`TextHelper::autoLinkUrls()`,
  :php:meth:`TextHelper::autoLinkEmails()` echappe les inputs HTMS par défaut.
  Vous pouvez contrôler l'option ``escape``.

HtmlHelper
----------

- :php:meth:`HtmlHelper::script()` avait une option ajoutée ``block``.
- :php:meth:`HtmlHelper::scriptBlock()` avait une option ajoutée ``block``.
- :php:meth:`HtmlHelper::css()` avait une option ajoutée ``block``.
- :php:meth:`HtmlHelper::meta()` avait une option ajoutée ``block``.
- Le paramètre ``$startText`` de :php:meth:`HtmlHelper::getCrumbs()` peut
  maintenant être un tableau. Cela donne plus de contrôle et de flexibilité
  sur le premier lien crumb.
- :php:meth:`HtmlHelper::docType()` est par défaut HTML5.
- :php:meth:`HtmlHelper::image()` a maintenant une option ``fullBase``.
- :php:meth:`HtmlHelper::media()` a été ajoutée. Vous pouvez utiliser cette
  méthode pour créer des éléments audio/vidéo HTML5.
- Le support du :term:`syntaxe de plugin` a été ajouté pour
  :php:meth:`HtmlHelper::script()`, :php:meth:`HtmlHelper::css()`,
  :php:meth:`HtmlHelper::image()`. Vous pouvez maintenant faciliter les liens
  vers les assets des plugins en utilisant ``Plugin.asset``.
- :php:meth:`HtmlHelper::getCrumbList()` a eu le paramètre ``$startText`` ajouté.


Vue
===

- :php:attr:`View::$output` est déprécié.
- ``$content_for_layout`` est déprécié. Utilisez ``$this->fetch('content');``
  à la place.
- ``$scripts_for_layout`` est déprécié. Utilisez ce qui suit à la place::

        echo $this->fetch('meta');
        echo $this->fetch('css');
        echo $this->fetch('script');

  ``$scripts_for_layout`` est toujours disponible, mais l'API
  :ref:`view blocks <view-blocks>` donne un remplacement plus extensible et
  flexible.
- La syntaxe ``Plugin.view`` est maintenant disponible partout. Vous pouvez
  utiliser cette syntaxe n'importe où, vous réferencez le nom de la vue, du
  layout ou de l'elément.
- L'option ``$options['plugin']`` pour :php:meth:`~View::element()` est
  déprécié. Vous devez utiliser ``Plugin.nom_element`` à la place.

Vues de type contenu
--------------------

Deux nouvelles classes de vues ont été ajoutées à CakePHP. Une nouvelle classe
:php:class:`JsonView` et :php:class:`XmlView` vous permettent de facilement
générer des vues XML et JSON. Vous en apprendrez plus sur ces classes dans
la section :doc:`/views/json-and-xml-views`.

Vues étendues
-------------

:php:class:`View` a une nouvelle méthode vous permettant d'enrouler
ou 'étendre' une vue/élément/layout avec un autre fichier.
Voir la section sur
:ref:`extending-views` pour plus d'informations sur cette fonctionnalité.

Thèmes
------

La classe ``ThemeView`` est dépreciée en faveur de la classe ``View``. En
mettant simplement ``$this->theme = 'MonTheme'`` activera le support theme
et toutes les classes de vue qui étendaient ``ThemeView`` devront étendre
``View``.

Blocks de Vue
-------------

Les blocks de Vue sont une façon flexible de créer des slots ou blocks dans vos
vues. Les blocks remplacent ``$scripts_for_layout`` avec une API robuste et
flexible. Voir la section sur :ref:`view-blocks` pour plus d'informations.


Helpers
=======

Nouveaux callbacks
------------------

Deux nouveaux callbacks ont été ajoutés aux Helpers.
:php:meth:`Helper::beforeRenderFile()` et :php:meth:`Helper::afterRenderFile()`.
Ces deux nouveaux callbacks sont déclenchés avant/après que chaque fragment de
vue soit rendu. Cela inclut les éléments, layouts et vues.

CacheHelper
-----------

- Les tags ``<!--nocache-->`` fonctionnent maintenant correctement à
  l'intérieur des éléments.

FormHelper
----------

- FormHelper omet désormais des champs désactivés à partir des champs hash
  sécurisés. Cela permet le fonctionnement avec :php:class:`SecurityComponent`
  et désactive les inputs plus facilement.
- L'option ``between`` quand elle est utilisée dans le cas d'inputs radio, se
  comporte maintenant différemment. La valeur ``between`` est maintenant placée
  entre le légende et les premiers éléments inputs.
- L'option ``hiddenField`` avec les inputs checkbox peuvent maintenant être mis
  à une valeur spécifique comme 'N' plutôt que seulement 0.
- L'attribut ``for`` pour les inputs date et time reflètent maintenant le
  premier input généré. Cela peut impliquer que l'attribut for peut changer les
  inputs datetime générés.
- L'attribut ``type`` pour :php:meth:`FormHelper::button()` peut maintenant
  être retiré. Il met toujours 'submit' par défaut.
- :php:meth:`FormHelper::radio()` vous permet maintenant de désactiver toutes
  les options. Vous pouvez le faire en mettant soit ``'disabled' => true`` soit
  ``'disabled' => 'disabled'`` dans le tableau ``$attributes``.

PaginatorHelper
---------------

- :php:meth:`PaginatorHelper::numbers()` a maintenant une option
  ``currentClass``.

Testing
=======

- Les Web test runner affichent maintenant le numéro de version de PHPUnit.
- Les Web test runner configurent par défaut l'affichage des test des app.
- Les Fixtures peuvent être créées pour différentes sources de données autre
  que $test.
- Les Models chargés utilisant la ClassRegistry et utilisant une autre source
  de données aura son nom de source donnée préfixé par ``test_`` (ex: source
  de données `master` essaiera d'utiliser `test_master` dans la testsuite)
- Les cas de Test sont générés avec des méthodes de configuration de la classe
  spécifique.

Evénements
==========

- Un nouveau système générique des évènements a été construit et a remplacé la
  façon dont les callbacks ont été dispatchés. Cela ne devrait représenter
  aucun changement dans votre code.
- Vous pouvez envoyer vos propres évènements et leur attacher des callbacks
  selon vos souhaits, utile pour la communication inter-plugin et facilite le
  découplage de vos classes.
