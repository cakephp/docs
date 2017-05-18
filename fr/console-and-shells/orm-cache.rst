Shell du Cache de l'ORM
#######################

OrmCacheShell fournit un outil CLI simple pour gérer les caches de metadata de
votre application. Dans les situations de déploiement, il est utile de
reconstruire le cache des metadata déjà en place sans enlever les données du
cache existantes. Vous pouvez faire ceci en lançant::

    bin/cake orm_cache build --connection default

Ceci va reconstruire le cache de metadata pour toutes les tables sur la
connection ``default``. Si vous avez besoin seulement de reconstruire une table
unique, vous pouvez faire ceci en fournissant son nom::

    bin/cake orm_cache build --connection default articles

En plus de construire les données mises en cache, vous pouvez utiliser aussi
OrmCacheShell pour retirer les metadata mis en cache::

    # Nettoyer toutes les metadata
    bin/cake orm_cache clear

    # Nettoyer une table unique
    bin/cake orm_cache clear articles

