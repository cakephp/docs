2.8 Guide de Migration
######################

CakePHP 2.8 est une mise à jour complète à partir de l'API de 2.7. Cette page
souligne les changements et améliorations faits dans 2.8.

Cache
=====

- ``Cache::add()`` a été ajoutée. Cette méthode vous permet d'ajouter des
  données au cache si la clé n'existe pas déjà. Cette méthode fonctionnera de
  façon atomique avec Memcached, Memcache, APC et Redis. Les autres backends de
  cache feront des opérations non-atomiques.

CakeTime
========

- ``CakeTime::listTimezones()`` a été changée pour accepter un tableau en
  dernier argument. Les valeurs valides pour l'argument ``$options`` sont:
  ``group``, ``abbr``, ``before``, and ``after``.

I18nShell
=========

- Une nouvelle option ``no-locations`` a été ajoutée. Quand elle est activée,
  cette option va désactiver la génération des références de localisation dans
  vos fichiers POT.

Hash
====

- ``Hash::sort()`` supporte maintenant le tri sans sensibilité à la casse grâce
  à l'option ``ignoreCase``.

Model
=====

- Les finders magiques supportent maintenant des types de finder personnalisé.
  Par exemple si votre model implémente un finder ``find('published')``, vous
  pouvez maintenant utiliser les fonctions ``findPublishedBy`` et
  ``findPublishedByAuthorId`` avec l'interface de la méthode magique.

Validation
==========

- ``Validation::uploadedFile()`` est un portage de la version 3.0.
