3.3 Guide de Migration
######################

CakePHP 3.2 est une mise à jour de CakePHP 3.2 dont la compatibilité API est
complète. Cette page souligne les changements et améliorations faits dans 3.3.

Routing
=======

- ``Router::parse()``, ``RouteCollection::parse()`` et ``Route::parse()`` ont
  un nouvel argument ``$method``. Il est par défaut à 'GET'. Ce nouveau
  paramètre réduit le recours à l'état global, et est nécessaire pour le travail
  d'intégration de la norme PSR7.

ORM
===

- ``Association::unique()`` a été ajoutée. Cette méthode est un proxy pour la
  méthode ``unique()`` de la table, mais permet de s'assurer que les conditions
  des associations soient appliquées.
- Les règles ``isUnique`` s'appliquent maintenant pour les conditions des
  associations.
