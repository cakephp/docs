3.4 Guide de Migration
######################

CakePHP 3.4 est une mise à jour de CakePHP 3.3 dont la compatibilité API est
complète. Cette page souligne les changements et améliorations faits dans 3.4.

Dépréciations
=============

La liste qui suit regroupe les méthodes, les propriétés et les comportements
dépréciés. Ces différents éléments continueront de fonctionner jusqu'à la
version 4.0.0 à partir de laquelle ils seront supprimés.

* Les propriétés _public_ de ``Cake\Event\Event`` sont dépréciés, de nouvelles
  méthodes ont été ajoutées pour lire et écrire ces propriétés.
* Plusieurs propriétés de ``Cake\Network\Request`` ont été dépréciées :

  * ``Request::$params`` est dépréciée. Utilisez ``Request::getParam()`` à la place.
  * ``Request::$data`` est dépréciée. Utilisez ``Request::getData()`` à la place.
  * ``Request::$query`` est dépréciée. Utilisez ``Request::getQuery()`` à la place.
  * ``Request::$cookies`` est dépréciée. Utilisez ``Request::getCookie()`` à la place.
  * ``Request::$base`` est dépréciée. Utilisez ``Request::getAttribute('base')`` à la place.
  * ``Request::$webroot`` est dépréciée. Utilisez ``Request::getAttribute('webroot')`` à la place.
  * ``Request::$here`` est dépréciée. Utilisez ``Request::here()`` à la place.
  * ``Request::$_session`` a été renommée ``Request::$session``.

* Certaines méthodes de ``Cake\Network\Request`` ont été dépréciées :

  * Les méthodes ``__get()`` & ``__isset()`` sont dépréciées. Utilisez
    ``getParam()`` à la place.
  * ``method()`` est dépréciée. Utilisez ``getMethod()`` plutôt.
  * ``setInput()`` est dépréciée. Utilisez ``withBody()`` plutôt.
  * Les méthodes ``ArrayAccess`` ont toutes été dépréciées.

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

Validation
==========

* ``Validation::falsey()`` et ``Validation::truthy()`` ont été ajoutées.
