Shell du Cache du Schéma
########################

SchemaCacheShell fournit un outil CLI simple pour gérer les caches de metadata de
votre application. Dans les situations de déploiement, il est utile de
reconstruire le cache des metadata déjà en place sans enlever les données du
cache existantes. Vous pouvez faire ceci en lançant::

    bin/cake schema_cache build --connection default

Ceci va reconstruire le cache de metadata pour toutes les tables sur la
connection ``default``. Si vous avez besoin seulement de reconstruire une table
unique, vous pouvez faire ceci en fournissant son nom::

    bin/cake schema_cache build --connection default articles

En plus de construire les données mises en cache, vous pouvez utiliser aussi
SchemaCacheShell pour retirer les metadata mis en cache::

    # Nettoyer toutes les metadata
    bin/cake schema_cache clear

    # Nettoyer une table unique
    bin/cake schema_cache clear articles

.. note::
    Avant 3.6, vous devez utiliser ``orm_cache`` à la place de ``schema_cache``.