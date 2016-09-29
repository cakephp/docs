3.4 Guide de Migration
######################

CakePHP 3.4 est une mise à jour de CakePHP 3.3 dont la compatibilité API est
complète. Cette page souligne les changements et améliorations faits dans 3.4.

Deprecations
============

La liste qui suit regroupe les méthodes, les propriétés et les comportements
dépréciés. Ces différents éléments continueront de fonctionner jusqu'à la
version 4.0.0 à partir de laquelle ils seront supprimés.

* Les propriétés _public_ de ``Cake\Event\Event`` sont dépréciés, de nouvelles
  méthodes ont été ajoutées pour lire et écrire ces propriétés.
* Plusieurs propriétés de ``Cake\Network\Request`` ont été dépréciées :

  * ``Request::$params`` est dépréciée. Utilisez ``Request::param()`` à la place.
  * ``Request::$data`` est dépréciée. Utilisez ``Request::data()`` à la place.
  * ``Request::$query`` est dépréciée. Utilisez ``Request::query()`` à la place.
  * ``Request::$cookies`` est dépréciée. Utilisez ``Request::cookie()`` à la place.
  * ``Request::$base`` est dépréciée. Utilisez ``Request::getAttribute('base')`` à la place.
  * ``Request::$webroot`` est dépréciée. Utilisez ``Request::getAttribute('webroot')`` à la place.
  * ``Request::$here`` est dépréciée. Utilisez ``Request::here()`` à la place.
  * ``Request::$_session`` a été renommée ``Request::$session``.

* Certaines méthodes de ``Cake\Network\Request`` ont été dépréciées :

  * Les méthodes ``query()``, ``data()`` et ``param()`` ne peuvent plus _setter_ les valeurs des propriétés
    correspondantes.
  * Les méthodes ``__get()`` & ``__isset()`` sont dépréciées. Utilisez ``param()`` à la place.
  * ``method()`` est dépréciée. Utilisez ``getMethod()`` plutôt.
  * ``setInput()`` est dépréciée. Utilisez ``withBody()`` plutôt.
  * Les méthodes ``ArrayAccess`` ont toutes été dépréciées.

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

FormHelper
==========

* Vous pouvez maintenant configurer les sources à partir desquelles FormHelper
  lit. Ceci simplifie la création des formulaires GET. Consultez :ref:`form-values-from-query-string` pour plus d'informations.
