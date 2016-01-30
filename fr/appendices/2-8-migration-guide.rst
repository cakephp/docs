2.8 Guide de Migration
######################

CakePHP 2.8 est une mise à jour complète à partir de l'API de 2.7. Cette page
souligne les changements et améliorations faits dans 2.8.

Compatibilité avec PHP7
=======================

CakePHP 2.8 est compatible et testé pour PHP7.

Dépréciations
=============

* L'option ``action`` dans ``FormHelper::create()`` a été dépréciée. C'est
  un portage de la version 3.x.
  Notez que la clé ``action`` d'un tableau URL va tout de même toujours être
  générée comme ID du DOM. Si vous utilisez la clé dépréciée, vous devrez
  comparer l'ID généré pour le formulaire avant et après.

Gestion des Erreurs
===================

- Quand vous gérez des erreurs fatales, CakePHP ne va maintenant plus ajuster la
  mémoire limite à 4MB pour s'assurer que l'erreur peut être mis correctement
  en log. Vous pouvez désactiver ce comportement en configurant
  ``Error.extraFatalErrorMemory`` à ``0`` dans votre ``Config/core.php``.

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

Shell Helpers Ajoutés
=====================

Les applications de Console peuvent maintenant être des classes de helper qui encapsulent des blocks réutilisables de logique pour l'affichage. Consultez la section :doc:`/console-and-shells/helpers` pour plus d'informations.

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
- Les conditions du find peuvent maintenant utiliser les opérateurs ``IN`` et
  ``NOT IN``. Ceci permet aux expressions du find d'avoir une meilleur
  compatibilité avec la version 3.x.

Validation
==========

- ``Validation::uploadedFile()`` est un portage de la version 3.0.

View
====

FormHelper
----------

``'url' => false`` est maintenant supporté pour ``FormHelper::create()`` pour
pouvoir créer des balises de formulaire sans l'attribut HTML ``action``. Ceci
est un portage de la version 3.x.
