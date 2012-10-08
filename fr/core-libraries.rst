Librairies du Coeur
###################

CakePHP est fourni avec une pléthore de fonctions et de classes intégrées. Ces 
classes et fonctions tentent de couvrir certaines des fonctionnalités les plus 
communes requises dans les applications web.

Usage Général
=============

Des librairies à usage général sont disponibles et réutilisées dans plusieurs 
endroits de CakePHP.

.. toctree::
    :maxdepth: 2

    core-libraries/global-constants-and-functions
    core-libraries/events
    core-libraries/collections

.. _core-components:

Components (Composants)
=======================

CakePHP a une sélection de components pour aider à s'occuper de tâches basiques 
dans vos controllers. Regardez la section sur :doc:`/controllers/components` 
pour savoir comment configurer et utiliser les components.

.. toctree::
    :maxdepth: 2

    core-libraries/components/access-control-lists
    core-libraries/components/authentication
    core-libraries/components/cookie
    core-libraries/components/email
    core-libraries/components/request-handling
    core-libraries/components/pagination
    core-libraries/components/security-component
    core-libraries/components/sessions

.. _core-helpers:

Helpers (Assistants)
====================

CakePHP dispose d'un certain nombre de helpers qui aident à la création de 
vues. Ils aident à la création d'un balisage bien formé (y compris les 
formulaires), l'aide au formatage du texte, des temps et des nombres, et 
peut même intégrer des bibliothèques javascript populaires. Voici une résumé 
des helpers intégrés. 

Lire :doc:`/views/helpers` pour en apprendre plus sur les helpers, leur api, 
et comment vous pouvez créer et utiliser vos propres helpers.

.. toctree::
    :maxdepth: 2

    core-libraries/helpers/cache
    core-libraries/helpers/form
    core-libraries/helpers/html
    core-libraries/helpers/js
    core-libraries/helpers/number
    core-libraries/helpers/paginator
    core-libraries/helpers/rss
    core-libraries/helpers/session
    core-libraries/helpers/text
    core-libraries/helpers/time

.. _core-behaviors:

Behaviors
=========

Les behaviors ajoutent des fonctionnalités supplémentaires à vos models. 
CakePHP offre un nombre de behaviors integrés tels que 
:php:class:`TreeBehavior` et :php:class:`ContainableBehavior`.

Pour en apprendre sur la création et l'utilisation des behaviors, lire la 
section sur :doc:`/models/behaviors`.

.. toctree::
    :maxdepth: 2

    core-libraries/behaviors/acl
    core-libraries/behaviors/containable
    core-libraries/behaviors/translate
    core-libraries/behaviors/tree

Libraries du Coeur
==================

Au-delà des composants MVC de base, CakePHP comprend une grande sélection 
de classes d'utilitaires qui vous aident à tout faire, des demandes de service 
web, la mise en cache, la connexion, l'internationalisation et plus.

.. toctree::
    :maxdepth: 2

    core-utility-libraries/app
    core-libraries/caching
    core-utility-libraries/email
    core-utility-libraries/number
    core-utility-libraries/time
    core-utility-libraries/sanitize
    core-utility-libraries/file-folder
    core-utility-libraries/httpsocket
    core-utility-libraries/inflector
    core-libraries/internationalization-and-localization
    core-libraries/logging
    core-utility-libraries/router
    core-utility-libraries/security
    core-utility-libraries/set
    core-utility-libraries/string
    core-utility-libraries/xml


.. meta::
    :title lang=fr: Libraries du Coeur
    :keywords lang=fr: librairies du coeur,constantes globales,cookie,listes de contrôle d'accès,nombre,texte,temps,composant de sécurité,composants du coeur,sujet général,applications web,balise,authentification,api,cakephp,fonctionnalité,sessions,collections,evènements