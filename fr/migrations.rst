Migrations
##########

Migrations est un plugin supporté par la core team pour vous aider à gérer
les changements dans la base de données en écrivant des fichiers PHP qui
peuvent être suivis par votre système de gestion de version.

Il vous permet de faire évoluer vos tables au fil du temps.
Au lieu d'écrire vos modifications de schéma en SQL, ce plugin vous permet
d'utiliser un ensemble intuitif de méthodes qui facilite la mise en œuvre des
modifications au sein de la base de données.

Ce plugin est un wrapper pour la librairie de gestion des migrations de bases de
données `Phinx <https://phinx.org/>`_

Installation
============

Par défaut Migrations est installé avec le squelette d’application. Si vous le
retirez et voulez le réinstaller, vous pouvez le faire en lançant ce qui suit
à partir du répertoire ROOT de votre application (où le fichier composer.json
est localisé)::

        php composer.phar require cakephp/migrations "@stable"

Vous aurez besoin d'ajouter la ligne suivante dans le fichier bootstrap.php de
votre application::

        Plugin::load('Migrations');

De plus, vous devrez configurer la base de données par défaut dans le fichier
config/app.php comme expliqué dans la section sur la
:ref:`configuration des bases de données <database-configuration>`.

Vue d'ensemble
==============

Une migration est simplement un fichier PHP qui décrit une nouvelle 'version' de
la base de données. Un fichier de migration peut créer des tables, ajouter ou
supprimer des colonnes, créer des index et même insérer des données dans la base
de données.

Ci-dessous un exemple de migration::

        class CreateProductsTable extends AbstractMigration
        {
            /**
             * This method gets executed when applying the changes to
             * the database.
             *
             * Changes to the database can also be reverted without any
             * additional code for non-destructive operations.
             */
            public function change()
            {
                // create the table
                $table = $this->table('products');
                $table->addColumn('name', 'string')
                      ->addColumn('description', 'text')
                      ->addColumn('created', 'datetime')
                      ->create();
            }


Cette migration ajoute une table appelée ``products`` avec une colonne de type
chaîne appelée ``name``, une colonne texte ``description`` et une colonne
``created`` avec un type datetime. Une colonne de clé primaire appelé ``id``
sera également ajouté implicitement.

Notez que ce fichier décrit à quoi la base de données devrait ressembler après
l'application de la migration, à ce stade la table ``products`` n'existe pas,
mais nous avons créé un fichier qui est à la fois capable de créer la table avec
les bonnes colonnes mais aussi de supprimer la table en cas de retour en
arrière.

Une fois que le fichier a été créé dans le dossier **config/Migrations**, vous
serez capable d'exécuter la commande suivante pour créer la table dans votre
base de données::

        bin/cake migrations migrate

Création de Migrations
======================

Les fichiers de migrations sont stockés dans le répertoire **config/Migration**
de votre application. Le nom des fichiers de migration est précédés de la
date/heure du jour de création, dans le format
**YYYYMMDDHHMMSS_my_new_migration.php**.

La meilleure façon de créer un fichier de migration est d'utiliser la ligne de
commande. Imaginons que vous souhaitez ajouter une nouvelle table ``products``::

        bin/cake bake migration CreateProducts name:string description:text created modified

.. note::

        Vous pouvez aussi choisir d'utiliser la forme_en_underscore pour nommer
        le label de migration, par exemple::

            bin/cake bake migration create_products name:string description:text created modified

La ligne ci-dessus va créer un fichier de migration qui ressemble à ceci::

        class CreateProductsTable extends AbstractMigration
        {
            public function change()
            {
                $table = $this->table('products');
                $table->addColumn('name', 'string')
                      ->addColumn('description', 'text')
                      ->addColumn('created', 'datetime')
                      ->addColumn('modified', 'datetime')
                      ->create();
            }

Si le nom de la migration dans la ligne de commande est de la forme
"AddXXXToYYY" ou "RemoveXXXFromYYY" et est suivie d'une liste de noms de
colonnes et les types alors un fichier de migration contenant le code pour la
création ou le retrait des colonnes sera généré::

        bin/cake bake migration AddPriceToProducts price:decimal

L'exécution de la ligne de commande ci-dessus va générer::

        class AddPriceToProducts extends AbstractMigration
        {
            public function change()
            {
                $table = $this->table('products');
                $table->addColumn('price', 'decimal')
                      ->update();
            }

Il est également possible d'ajouter des indexes de colonnes::

        bin/cake bake migration AddNameIndexToProducts name:string:index

va générer::

        class AddNameIndexToProducts extends AbstractMigration
        {
            public function change()
            {
                $table = $this->table('products');
                $table->addColumn('name', 'string')
                      ->addIndex(['name'])
                      ->update();
            }


Lors de l'utilisation des champs dans la ligne de commande, il est utile de se
rappeler qu'ils sont décrits selon le schéma suivant::

        field:fieldType:indexType:indexName

Par exemple, les éléments suivants sont autant de façons de spécifier un champ
email:

* ``email:string:unique``
* ``email:string:unique:EMAIL_INDEX``

Les champs nommés ``created`` et ``modified`` seront automatiquement réglés sur
le type ``datetime``.

De la même façon, vous pouvez générer une migration permettant de supprimer une
colonne en utilisant la ligne de commande::

         bin/cake bake migration RemovePriceFromProducts price

crée le fichier::

        class RemovePriceFromProducts extends AbstractMigration
        {
            public function change()
            {
                $table = $this->table('products');
                $table->removeColumn('price');
            }

Les noms des migration peuvent suivre l'un des motifs suivants:

* Créer une table: (``/^(Create)(.*)/``) Crée la table spécifiée.
* Supprimer une table: (``/^(Drop)(.*)/``) Supprime la table spécifiée. Ignore les arguments de champ spécifié.
* Ajouter un champ: (``/^(Add).*(?:To)(.*)/``) Ajoute les champs à la table spécifiée.
* Supprimer un champ: (``/^(Remove).*(?:From)(.*)/``) Supprime les champs de la table spécifiée.
* Modifier une table:  (``/^(Alter)(.*)/``) Modifie la table spécifiée. Un alias pour CreateTable et AddField.

Les types de champs sont ceux mis à disposition par la bibliothèque `` Phinx``.
Cela peut être:

* string
* text
* integer
* biginteger
* float
* decimal
* datetime
* timestamp
* time
* date
* binary
* boolean
* uuid

De plus, vous pouvez créer un fichier migrations vide si vous voulez un contrôle
total sur ce qui doit être exécuté::

        bin/cake migrations create MyCustomMigration

Prenez soin de lire la documentation officielle Phinx
`<http://docs.phinx.org/en/latest/migrations.html>` _ afin de connaître la liste
complète des méthodes que vous pouvez utiliser pour écrire des fichiers de
migration.

Générer une Migration à partir d'une Base de Données Existante
--------------------------------------------------------------

Si vous avez affaire à une base de données pré-existante et que vous voulez
commencer à utiliser migrations, ou que vous souhaitez versionner le schéma
initial de votre base de données, vous pouvez exécuter la commande
``migration_snapshot``::

        bin/cake bake migration_snapshot Initial

Elle va générer un fichier de migration appelé **Initial** contenant toutes les
déclarations pour toutes les tables de votre base de données.

Créer des Clés Primaires Personnalisées
---------------------------------------

Pour personnaliser la création automatique de la clé primaire ``id`` lors
de l'ajout de nouvelles tables, vous pouvez utiliser le deuxième argument de la
méthode ``table()``::

        class CreateProductsTable extends AbstractMigration
        {
            public function change()
            {
                $table = $this->table('products', ['id' => false, 'primary_key' => ['id']]);
                $table
                      ->addColumn('id', 'uuid')
                      ->addColumn('name', 'string')
                      ->addColumn('description', 'text')
                      ->create();
            }

Le code ci-dessus va créer une colonne ``CHAR(36)`` ``id`` également utilisée
comme clé primaire.

Depuis Migrations 1.3, une nouvelle manière de gérer les clés primaires a été
introduite. Pour l'utiliser, votre classe de migration devra étendre la
nouvelle classe ``Migrations\AbstractMigration``.
Vous pouvez définir la propriété ``autoId`` à ``false`` dans la classe de
Migration, ce qui désactivera la création automatique de la colonne ``id``.
Vous aurez cependant besoin de manuellement créer la colonne qui servira de clé
primaire et devrez l'ajouter à la déclaration de la table::

        use Migrations\AbstractMigration;

        class CreateProductsTable extends AbstractMigration
        {

            public $autoId = false;

            public function up()
            {
                $table = $this->table('products');
                $table
                    ->addColumn('id', 'integer', [
                        'autoIncrement' => true,
                        'limit' => 11
                    ])
                    ->addPrimaryKey('id')
                    ->addColumn('name', 'string')
                    ->addColumn('description', 'text')
                    ->create();
            }

Comparée à la méthode précédente de gestion des clés primaires, cette méthode
vous donne un plus grand contrôle sur la définition de la colonne de la clé
primaire : signée ou non, limite, commentaire, etc.

Toutes les migrations et les snapshots créés avec ``bake`` utiliseront cette
nouvelle méthode si nécessaire.

.. warning::

    Gérer les clés primaires ne peut être fait que lors des opérations de
    créations de tables. Ceci est dû à des limitations pour certains serveurs
    de base de données supportés par le plugin.

Collations
----------

Si vous avez besoin de créer une table avec une ``collation`` différente
de celle par défaut de la base de données, vous pouvez la définir comme option
de la méthode ``table()``::

        class CreateCategoriesTable extends AbstractMigration
        {
            public function change()
            {
                $table = $this
                    ->table('categories', [
                        'collation' => 'latin1_german1_ci'
                    ])
                    ->addColumn('title', 'string', [
                        'default' => null,
                        'limit' => 255,
                        'null' => false,
                    ])
                    ->create();
            }

Notez cependant que ceci ne peut être fait qu'en cas de création de table :
il n'y a actuellement aucun moyen d'ajouter une colonne avec une ``collation``
différente de celle de la table ou de la base de données.
Seuls ``MySQL`` et ``SqlServer`` supportent cette option de configuration pour
le moment.

Appliquer les Migrations
========================

Une fois que vous avez généré ou écrit votre fichier de migration, vous devez
exécuter la commande suivante pour appliquer les modifications à votre base de
données::

        bin/cake migrations migrate

Pour migrer vers une version spécifique, utilisez le paramètre --target ou -t
(version courte)::

        bin/cake migrations migrate -t 20150103081132

Cela correspond à l'horodatage qui est ajouté au début du nom de fichier des
migrations.

Annuler une Migration
=====================

La commande de restauration est utilisée pour annuler les précédentes migrations
réalisées par ce plugin. C'est l'inverse de la commande ``migrate``.

Vous pouvez annuler la migration précédente en utilisant la commande
``rollback``::

        bin/cake migrations rollback

Vous pouvez également passer un numéro de version de migration pour revenir à
une version spécifique::

         bin/cake migrations rollback -t 20150103081132

Statuts de Migrations
=====================

La commande ``status`` affiche une liste de toutes les migrations, ainsi que
leur état actuel. Vous pouvez utiliser cette commande pour déterminer les
migrations qui ont été exécutées::

        bin/cake migrations status

Marqué une migration comme "migrée"
===================================

.. versionadded:: cakephp/migrations 1.1.0

Il peut parfois être utile de marquer une migration comme "migrée" sans avoir
à exécuter la migration.
Pour ce faire, vous pouvez utiliser la commande ``mark_migrated``. Cette commande
attend le numéro de version de la migration comme argument::

    bin/cake migrations mark_migrated 20150420082532

Notez que lorsque vous faites un snapshot avec la commande
``cake bake migration_snapshot``, la migration créée sera automatiquement marquée
comme "migrée".

.. versionadded:: cakephp/migrations 1.3.1

Une nouvelle valeur spéciale ``all`` a été ajoutée pour l'argument version de
la commande ``mark_migrated``. Si vous l'utilisez, toutes les migrations
trouvées seront marquées comme "migrées"::

    bin/cake migrations mark_migrated all

Utiliser Migrations dans les Plugins
====================================

Les plugins peuvent également contenir des fichiers de migration. Cela rend les
plugins destinés à la communauté beaucoup plus portable et plus facile à
installer. Toutes les commandes du plugin Migrations supportent l'option
``--plugin`` ou ``-p`` afin d'exécuter les commandes par rapport à ce plugin::

        bin/cake migrations status -p PluginName

        bin/cake migrations migrate -p PluginName

Effectuer des Migrations en dehors d'un environnement Console
=============================================================

.. versionadded:: cakephp/migrations 1.2.0

Depuis la sortie de la version 1.2 du plugin migrations, vous pouvez effectuer
des migrations en dehors d'un environnement Console, directement depuis une
application, en utilisant la nouvelle classe ``Migrations``.
Cela peut être pratique si vous développez un installeur de plugins pour un CMS
par exemple.
La classe ``Migrations`` vous permet de lancer les commandes de la console de
migrations suivantes :

* migrate
* rollback
* markMigrated
* status

Chacune de ces commandes possède une méthode définie dans la classe
``Migrations``.

Voici comment l'utiliser::

    use Migrations\Migrations;

    $migrations = new Migrations();

    // Va retourner un tableau des migrations et leur statut
    $status = $migrations->status();

    // Va retourner true en cas de succès. Si une erreur se produit, une exception est lancée
    $migrate = $migrations->migrate();

    // Va retourner true en cas de succès. Si une erreur se produit, une exception est lancée
    $rollback = $migrations->rollback();

    // Va retourner true en cas de succès. Si une erreur se produit, une exception est lancée
    $markMigrated = $migrations->markMigrated(20150804222900);

Ces méthodes acceptent un tableau de paramètres qui doivent correspondre aux
options de chacune des commandes::

    use Migrations\Migrations;

    $migrations = new Migrations();

    // Va retourner un tableau des migrations et leur statut
    $status = $migrations->status(['connection' => 'custom', 'source' => 'MyMigrationsFolder']);

Vous pouvez passer n'importe quelle option que la commande de la console
accepterait.
La seule exception étant la commande ``markMigrated`` qui attend le numéro de
version de la migration à marquer comme "migrée" comme premier argument.
Passez le tableau de paramètres en second argument pour cette méthode.

En option, vous pouvez passer ces paramètres au constructeur de la classe.
Ils seront utilisés comme paramètres par défaut et vous éviteront ainsi d'avoir
à les passer à chaque appel de méthode::

    use Migrations\Migrations;

    $migrations = new Migrations(['connection' => 'custom', 'source' => 'MyMigrationsFolder']);

    // Tous les appels suivant seront faits avec les paramètres passés au constructeur de la classe Migrations
    $status = $migrations->status();
    $migrate = $migrations->migrate();

Si vous avez besoin d'écraser un ou plusieurs paramètres pour un appel, vous
pouvez les passer à la méthode::

    use Migrations\Migrations;

    $migrations = new Migrations(['connection' => 'custom', 'source' => 'MyMigrationsFolder']);

    // Cet appel sera fait avec la connexion "custom"
    $status = $migrations->status();
    // Cet appel avec la connexion "default"
    $migrate = $migrations->migrate(['connection' => 'default']);
