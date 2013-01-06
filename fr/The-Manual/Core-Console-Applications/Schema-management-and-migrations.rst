Gestion du schéma et migrations
###############################

Le shell *Schema* fournit une fonctionnalité pour créer des objets, des
dumps sql et pour créer et restaurer des vues instantanées de votre base
de données.

Générer et utiliser les fichiers Schema
=======================================

Un fichier de schéma généré vous permet de transporter facilement un
schéma agnostique de votre base de données. Vous pouvez générer un
fichier de schéma de votre base en utilisant la commande :

::

    $ cake schema generate

Cela va créer un fichier schema.php dans votre dossier
``app/config/sql`` .

Le shell *schema* n'utilise que les tables pour lesquelles des modèles
sont définis. Pour forcer le shell à considérer toutes les tables, vous
devez ajouter l'option ``-f`` à votre ligne de commande.

Pour reconstruire plus tard votre schéma de base de données à partir
d'un fichier schema.php précédemment réalisé, lancez :

::

    $ cake schema run create

Cela va supprimer et créer les tables en se basant sur le contenu de
schema.php.

Les fichiers de schéma peuvent aussi être utilisés pour générer des
dumps sql. Pour générer un fichier sql comprennant les définitions
``CREATE TABLE``, lancez:

::

    $ cake schema dump nomdufichier.sql

*nomdufichier.sql* est le nom souhaité pour le fichier contenant le dump
sql. Si vous omettez *nomdufichier.sql*, le dump sql sera affiché sur la
console, mais ne sera pas écrit dans un fichier.

Migrations avec le shell schema de CakePHP
==========================================

Les migrations permettent de "versionner" votre schéma de base de
données, de telle façon que lorsque vous développez des fonctionnalités,
vous avez une méthode facile et élégante pour relever les modifications
apportées à votre base. Les migrations sont réalisées soit grâce aux
fichiers de schémas, soit grâce aux vues instantanées. Versionner un
fichier de schéma avec le shell *schema* est assez facile. Si vous avez
déjà un fichier *schema* créé en utilisant :

::

    $ cake schema generate

Vous aurez alors les choix suivants :

::

    Generating Schema...
    Schema file exists.
     [O]verwrite
     [S]napshot
     [Q]uit
    Would you like to do? (o/s/q)

Choisir [s] (snapshot - vue instantanée) va créer un fichier schema.php
incrémenté. Ainsi, si vous avez schema.php, cela va créer schema\_2.php
et ainsi de suite. Vous pouvez ensuite restaurer chacun de ces schémas
en utilisant :

::

    $ cake schema run update -s 2

Où 2 est le numéro de la vue instantanée que vous voulez exécuter. Le
shell vous demandera de confirmer votre intention d'exécuter les
définitions ``ALTER`` qui représentent les différences entre la base
existante et le fichier de schéma exécuté à ce moment.

Vous pouvez effectuer un lancement d'essai ("dry run") en ajoutant
``-dry`` à votre commande.
