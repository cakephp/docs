3.6 Migration Guide
###################

CakePHP 3.6 est une mise à jour de CakePHP 3.5 dont la compatibilité API est
complète. Cette page souligne les changements et améliorations faits dans 3.6.

Pour mettre à jour vers 3.6.x, lancez la commande suivante :

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:3.6.*"

Deprecations
============

La liste qui suit regroupe les méthodes, les propriétés et les comportements
dépréciés. Ces différents éléments continueront de fonctionner jusqu'à la
version 4.0.0, à partir de laquelle ils seront supprimés.

* ``bin/cake orm_cache`` est maintenant ``bin/cake schema_cache``.

Changement de Comportements
============================

Les changements suivants sont compatibles avec l'API, mais elles représentent
des écarts mineurs de comportement qui pourrait affecter votre application:

* ``Cake\Utility\Security::randomBytes()`` lancera maintenant une exception
  lorsqu'une source sécurisée d'entropie ne peut pas être trouvée en PHP5.
* Les tokens générés par ``SecurityComponent`` incluent maintenant l'id de
  session de l'utilisateur, pour éviter que le token soit réutilisé entre des
  utilisateurs/sessions. Cela change la valeur des tokens de sécurité et va
  faire que les formulaires créés dans les versions précédentes de CakePHP
  ne vont pas passer la validation dans la version 3.6.
* ``Cake\Database\Query::page()`` lance maintenant des exceptions quand les
  valeurs de la page sont < à 1.
* Pagination permet maintenant de trier selon plusieurs champs à travers toutes
  les pages. Avant, seule la première page pouvait être triée avec plus d'une
  colonne. De plus, les conditions de tri définies dans la query string sont
  maintenant *préfixées* aux paramètres de tri par défaut plutôt que remplaçant
  complètement le tri par défaut.
* Les classes de Shell vont maintenant lancer des exceptions quand les classes
  de task ne sont pas trouvées. Avant, les tasks non valides étaient ignorées
  en silence.
* Le code interne de CakePHP chaîne maintenant les exceptions quand c'est
  possible, ce qui permet d'afficher les premières causes d'erreur.

Core
====

- ``getTypeName()`` a été ajoutée pour vous aider à récupérer le nom de la
  classe ou le type de variable, ce qui vous permettra de construire des
  messages d'erreur plus explicites.

ORM
========

* ``EntityTrait::isEmpty()`` et ``EntityTrait::hasValue()`` ont été ajoutées.

Shell
=====

* La commande ``cake assets copy`` dispose maintenant d'une option
  ``--overwrite`` pour écraser les assets de plugin si ils existent déjà dans
  le webroot de l'application.

Validation
==========

* ``Validation::compareFields()`` a été ajoutée en tant que version plus
  flexible que la fonction  ``Validation::compareWith()``.
* ``Validator::notSameAs()`` a été ajoutée pour vérifier facilement si un
  champ n'est pas identique à un autre champ.
