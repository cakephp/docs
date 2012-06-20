Gestion des Schema et migrations
################################

Le shell Schema fournit une fonctionnalité pour créer des objets, 
des dumps sql et pour créer et restaurer des vues instantanées de votre base de données.

Générer et utiliser les fichiers Schema
=======================================

Un fichier de génération de schema vous permet de facilement 
transporter un schema de base de données agnostique.
Vous pouvez générer un fichier de schema de votre base de données en utilisant::

    $ Console/cake schema generate

Cela générera un fichier schema.php dans votre dossier ``app/Config/Schema``.

.. note::

    Le shell de shema The schema shell will only process tables for which there are
    models defined. To force the schema shell to process all the
    tables, you must add the ``-f`` option in the command line.

To later rebuild the database schema from your previously made
schema.php file run::

    $ Console/cake schema create

Cela va supprimer et créer les tables en se basant sur le contenu de schema.php.

Les fichiers de schéma peuvent aussi être utilisés pour générer des dumps sql.
Pour générer un fichier sql comprennant les définitions ``CREATE TABLE``, lancez::

    $ Console/cake schema dump --write filename.sql

nomdufichier.sql est le nom souhaité pour le fichier contenant le dump sql. 
Si vous omettez nomdufichier.sql, le dump sql sera affiché sur la console,
mais ne sera pas écrit dans un fichier.

Migrations with CakePHP schema shell
====================================

Les migrations permettent de "versionner" votre schéma de base de données, 
de telle façon que lorsque vous développez des fonctionnalités, 
vous avez une méthode facile et élégante pour relever les modifications apportées à votre base. 
Les migrations sont réalisées soit grâce aux fichiers de schémas, soit grâce aux vues instantanées.
Versionner un fichier de schéma avec le shell schema est assez facile. 
Si vous avez déjà un fichier schema créé en utilisant ::

    $ Console/cake schema generate

Vous aurez alors les choix suivants ::

    Generating Schema... (Génération du Schema)
    Schema file exists. (Le fichier schema existe)
     [O]verwrite (Ecraser)
     [S]napshot  (Vue instantanée)
     [Q]uit      (Quitter)
    Would you like to do? (o/s/q) (Que voulez vous faire?)

Choisir [s] (snapshot - vue instantanée) va créer un fichier schema.php incrémenté. 
Ainsi, si vous avez schema.php, cela va créer schema\_2.php et ainsi de suite.
Vous pouvez ensuite restaurer chacun de ces schémas en utilisant ::

    $ cake schema update -s 2

Où 2 est le numéro de la vue instantanée que vous voulez exécuter.
Le shell vous demandera de confirmer votre intention d'exécuter les définitions ``ALTER`` 
qui représentent les différences entre la base existante et le fichier de schéma exécuté à ce moment.

Vous pouvez effectuer un lancement d'essai ("dry run") en ajoutant ``--dry`` à votre commande.

Exemple d'application
=====================

Créer un schema et commit
-------------------------

Sur un projet qui utilise le versioning, 
l'utilisation du schema cake suivrait les étapes suivantes:

1. Créer ou modifier les tables de votre base de données.
2. Exécuter cake schema pour exporter une description complète de votre base de données.
3. Commit et créer ou modifier le fichier schema.php::

    $ # Une fois que votre base de données a été mise à jour
    $ Console/cake schema generate
    $ git commit -a

.. note::

    Si le projet n'est pas versionné, la gestion des schemas se fera à travers des vues instantanées.
    (voir la section précédente pour gérer les vues instantanées)

Récupérer les derniers changements
----------------------------------

Quand vous récupérer les derniers changements de votre répertoire, 
et découvrer des changements dans la structure de la base de données
(par exemple vous avez un message d'erreur disant qu'il manque une table):
vous avez une table manquante

1. Exécuter cake schema pour mettre à jour votre base de données::

    $ git pull
    $ Console/cake schema create
    $ Console/cake schema update

Toutes ces opérations peuvent être faites en mode sans écriture.

Revenir en arrière
------------------

Si à un moment donné vous avez besoin de revenir en arrière et retourner à un état précédent
à votre dernière mise à jour, vous devez être informé que ce n'est pas pour l'instant
pas possible avec cake schema.

Plus précisemment, vous ne pouvez pas supprimer automatiquement vos tables
une fois qu'elles ont été créees.

L'utilisation de ``update`` supprimera, au contraire, n'importe quel champ
qui différera de votre fichier schema::

    $ git revert HEAD
    $ Console/cake schema update

Ceci vous proposera les choix suivants::

    The following statements will run.(Les requêtes suivantes vont être exécutées)
    ALTER TABLE `roles`
    DROP `position`;
    Are you sure you want to alter the tables? (y/n) (Etes vous sur de vouloir modifier les tables?)
    [n] >

.. meta::
    :title lang=fr: Gestion des Schema et migrations
    :keywords lang=fr: fichiers de schema,gestion des schema,Objets schema,base de données schema,requêtes sur table,changements de base de données,migrations,versioning,snapshots,sql,snapshot,shell,config,fonctionnalité,choix,modèles,fichiers php,fichier php,directory,lancement
