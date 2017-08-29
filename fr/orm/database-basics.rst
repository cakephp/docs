Notions de Base de Base de Données
##################################

La couche d'accès à la base de données de CakePHP fournit une abstraction et
aide avec la plupart des aspects du traitement des bases de données
relationnelles telles que, le maintien des connexions au serveur, la
construction de requêtes, la protection contre les injections SQL, l'inspection
et la modification des schémas, et avec le débogage et le profilage les requêtes
envoyées à la base de données.

Tour Rapide
===========

Les fonctions décrites dans ce chapitre illustrent les possibilités de l'API
d'accès à la base de données de plus bas niveau. Si vous souhaitez plutôt en
apprendre plus sur l'ORM complet, vous pouvez lire les sections portant sur le
:doc:`/orm/query-builder` et :doc:`/orm/table-objects`.

La manière la plus simple de créer une connexion à la base de données est
d'utiliser une chaine ``DSN``::

    use Cake\Datasource\ConnectionManager;

    $dsn = 'mysql://root:password@localhost/my_database';
    ConnectionManager::config('default', ['url' => $dsn]);

Une fois créé, vous pouvez accéder à l'objet Connection pour commencer à
l'utiliser::

    $connection = ConnectionManager::get('default');

Bases de Données Supportées
---------------------------

CakePHP supporte les serveurs de base de données relationnelles suivants:

* MySQL 5.1+
* SQLite 3
* PostgreSQL 8+
* SQLServer 2008+
* Oracle (avec un plugin créé par la communauté)

Pour chacun des drivers de base de données ci-dessus, assurez-vous d'avoir
la bonne extension PDO installée. Les API procédurales ne sont pas supportées.

La base de données Oracle est supportée via le
`Driver pour les bases de données Oracle <https://github.com/CakeDC/cakephp-oracle-driver>`_ du plugin créé par la
communauté.

.. _running-select-statements:

Exécuter des Instructions Select
--------------------------------

Exécuter une instruction SQL pur est un jeu d'enfant::

    use Cake\Datasource\ConnectionManager;

    $connection = ConnectionManager::get('default');
    $results = $connection->execute('SELECT * FROM articles')->fetchAll('assoc');

Vous pouvez utiliser des instructions préparées pour insérer des paramètres::

    $results = $connection
        ->execute('SELECT * FROM articles WHERE id = :id', ['id' => 1])
        ->fetchAll('assoc');

il est également possible d'utiliser des types de données complexes en tant
qu'arguments::

    $results = $connection
        ->execute(
            'SELECT * FROM articles WHERE created >= :created',
            ['created' => new DateTime('1 day ago')],
            ['created' => 'datetime']
        )
        ->fetchAll('assoc');

Au lieu d'écrire du SQL manuellement, vous pouvez utiliser le générateur de
requêtes::

    $results = $connection
        ->newQuery()
        ->select('*')
        ->from('articles')
        ->where(['created >' => new DateTime('1 day ago'), ['created' => 'datetime']])
        ->order(['title' => 'DESC'])
        ->execute()
        ->fetchAll('assoc');

Exécuter des Instructions Insert
--------------------------------

Insérer une ligne dans une base de données est habituellement l'affaire
de quelques lignes::

    use Cake\Datasource\ConnectionManager;

    $connection = ConnectionManager::get('default');
    $connection->insert('articles', [
        'title' => 'A New Article',
        'created' => new DateTime('now')
    ], ['created' => 'datetime']);

Exécuter des Instructions Update
--------------------------------

Mettre à jour une ligne de base de données est aussi intuitif, l'exemple suivant
procédera à la mise à jour de l'article comportant l'**id** 10::

    use Cake\Datasource\ConnectionManager;
    $connection = ConnectionManager::get('default');
    $connection->update('articles', ['title' => 'New title'], ['id' => 10]);

Exécuter des Instructions Delete
--------------------------------

De même, la méthode ``delete()`` est utilisée pour supprimer des lignes de la
base de données, l'exemple suivant procédera à suppression de l'article
comportant l'**id** 10::

    use Cake\Datasource\ConnectionManager;
    $connection = ConnectionManager::get('default');
    $connection->delete('articles', ['id' => 10]);

.. _database-configuration:

Configuration
=============

Par convention, les connexions à la base de données sont configurées dans
**config/app.php**. L'information de connexion définie dans ce fichier
est envoyée au :php:class:`Cake\\DataSource\\ConnectionManager` créant la
configuration de la connexion que votre application utilisera. Un exemple
d'information sur la connexion se trouve dans **config/app.default.php**.
Un exemple d'information sur la configuration ressemblera à ceci::

    'Datasources' => [
        'default' => [
            'className' => 'Cake\Database\Connection',
            'driver' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'localhost',
            'username' => 'my_app',
            'password' => 'sekret',
            'database' => 'my_app',
            'encoding' => 'utf8',
            'timezone' => 'UTC',
            'cacheMetadata' => true,
        ]
    ],

Ce qui est au-dessus va créer une connexion 'default', avec les paramètres
fournis. Vous pouvez définir autant de connexions que vous le souhaitez dans
votre fichier de configuration. Vous pouvez aussi définir des connexions
supplémentaires à la volée en utilisant
:php:meth:`Cake\\DataSource\\ConnectionManager::config()`. Un exemple de ceci
serait::

    use Cake\DataSource\ConnectionManager;

    ConnectionManager::config('default', [
        'className' => 'Cake\Database\Connection',
        'driver' => 'Cake\Database\Driver\Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'username' => 'my_app',
        'password' => 'sekret',
        'database' => 'my_app',
        'encoding' => 'utf8',
        'timezone' => 'UTC',
        'cacheMetadata' => true,
    ]);

Les options de configuration peuvent également être fournies en tant que chaine
:term:`DSN`. C'est utile lorsque vous travaillez avec des variables
d'environnement ou des fournisseurs :term:`PaaS`::

    ConnectionManager::config('default', [
        'url' => 'mysql://my_app:sekret@localhost/my_app?encoding=utf8&timezone=UTC&cacheMetadata=true',
    ]);

Lorsque vous utilisez une chaine DSN, vous pouvez définir des paramètres/options
supplémentaires en tant qu'arguments de query string.

Par défaut, tous les objets Table vont utiliser la connexion ``default``. Pour
utiliser une autre connexion, reportez-vous à
:ref:`la configuration des connexions<configuring-table-connections>`.

Il y a un certain nombre de clés supportées dans la configuration de la base
de données. Voici la liste complète:

className
    Nom de classe complète (incluant le *namespace*) de la classe qui
    représente une connexion au serveur de base de données.
    Cette classe a pour rôle de charger le driver de base de données, de
    fournir les mécanismes de transaction et de préparer les requêtes SQL
    (entres autres choses).
driver
    Le nom de la classe du driver utilisée pour implémenter les spécificités
    du moteur de base de données. Cela peut être soit un nom de classe court
    en utilisant la :term:`syntaxe de plugin`, un nom complet en namespace,
    soit être une instance de driver construite. Les exemples de noms de classe
    courts sont Mysql, Sqlite, Postgres, et Sqlserver.
persistent
    S'il faut utiliser ou non une connexion persistante à la base de données.
host
    Le nom d'hôte du serveur de base de données (ou une adresse IP).
username
    Le nom d'utilisateur pour votre compte.
password
    Le mot de passe pour le compte.
database
    Le nom de la base de données à utiliser pour cette connexion. Éviter
    d'utiliser ``.`` dans votre nom de base de données. Comme cela complique
    l'identifier quoting, CakePHP ne supporte pas ``.`` dans les noms de base de
    données. Les chemins vers vos bases de données SQLite doivent être absolus
    (par exemple ``ROOT . DS . 'my_app.db'``) pour éviter les erreurs de chemins
    incorrects à cause de chemins relatifs.
port (*optionnel*)
    Le port TCP ou le socket Unix utilisé pour se connecter au serveur.
encoding
    Indique le jeu de caractères à utiliser lors de l'envoi d'instructions SQL
    au serveur. L'encodage par défaut est celui de la base de données
    pour toutes les bases de données autres que DB2. Si vous souhaitez utiliser
    l'encodage UTF-8 avec les connexions MySQL, vous devez utiliser
    'utf8' sans trait d'union.
timezone
    La définition du timezone du serveur.
schema
    Utilisé pour spécifier le schema à utiliser pour les bases de données
    PostgreSQL.
unix_socket
    Utilisé par les drivers qui le supportent pour se connecter via les fichiers
    socket Unix. Si vous utilisez PostgreSQL et que vous voulez utiliser les
    sockets Unix, laissez la clé host vide.
ssl_key
    Le chemin du fichier vers la clé du fichier SSL. (supporté seulement par
    MySQL).
ssl_cert
    Le chemin du fichier vers le fichier du certificat SSL. (supporté seulement
    par MySQL).
ssl_ca
    Le chemin du fichier vers l'autorité de certification SSL. (supporté
    seulement par MySQL).
init
    Une liste de requêtes qui doivent être envoyées au serveur de la base de
    données lorsque la connexion est créée.
log
    Défini à ``true`` pour activer les logs des requêtes. Si activé,
    les requêtes seront écrites au niveau ``debug`` avec le scope
    ``queriesLog``.
quoteIdentifiers
    Défini à ``true`` si vous utilisez les mots réservés ou les caractères
    spéciaux avec les noms de tables ou de colonnes. Activer
    cette configuration va entraîner la construction des requêtes en utilisant
    le :doc:`/orm/query-builder` avec les identifiers quotés lors de la création
    de SQL. Notez que ceci diminue la performance parce que chaque requête a
    besoin d'être traversée et manipulée avant d'être exécutée.
flags
    Un tableau associatif de constantes PDO qui doivent être passées
    à l'instance PDO sous-jacente. Regardez la documentation de PDO pour les
    flags supportés par le driver que vous utilisez.
cacheMetadata
    Soit un booléen ``true``, soit une chaîne contenant la configuration du
    cache pour stocker les meta données. Désactiver la mise en cache des
    metadata n'est pas conseillé et peut entraîner de faibles performances.
    Consultez la section sur :ref:`database-metadata-cache` pour plus
    d'information.
mask
    Définit les droits sur le fichier de base de données généré (seulement supporté
    par SQLite)

Au point où nous sommes, vous pouvez aller voir
:doc:`/intro/conventions`. Le nommage correct pour vos
tables (et pour quelques colonnes) peut vous offrir des
fonctionnalités gratuites et vous aider à éviter la configuration. Par
exemple, si vous nommez votre table de base de données big\_boxes, votre table
BigBoxesTable, et votre controller BigBoxesController, tout fonctionnera
ensemble automatiquement. Par convention, utilisez les underscores, les
minuscules et les formes plurielles pour vos noms de table de la base de
données - par exemple: bakers, pastry\_stores, et savory\_cakes.

.. php:namespace:: Cake\Datasource

Gérer les Connexions
====================

.. php:class:: ConnectionManager

La classe ``ConnectionManager`` agit comme un registre pour accéder aux
connexions à la base de données que votre application. Elle fournit
un endroit où les autres objets peuvent obtenir des références aux connexions
existantes.

Accéder à des Connexions
------------------------

.. php:staticmethod:: get($name)

Une fois configurées, les connexions peuvent être récupérées en utilisant
:php:meth:`Cake\\Datasource\\ConnectionManager::get()`. Cette méthode va
construire et charger une connexion si elle n'a pas été déjà construite
avant, ou retourner la connexion connue existante::

    use Cake\Datasource\ConnectionManager;

    $conn = ConnectionManager::get('default');

La tentative de chargement de connexions qui n'existent pas va lancer une
exception.

Créer des Connexions à l'exécution
----------------------------------

En utilisant ``config()`` et ``get()`` vous pouvez créer à tout moment de
nouvelles connexions qui ne sont pas défines dans votre fichier de
configuration::

    ConnectionManager::config('my_connection', $config);
    $conn = ConnectionManager::get('my_connection');

Consultez le chapitre sur la :ref:`configuration <database-configuration>`
pour plus d'informations sur les données de configuration utilisées lors de
la création de connexions.

.. _database-data-types:

.. php:namespace:: Cake\Database

Types de Données
================

.. php:class:: Type

Puisque tous les fournisseurs de base de données n'intègrent pas la même
définition des types de données, ou les mêmes noms pour des types de données
similaires, CakePHP fournit un ensemble de types de données abstraites à
utiliser avec la couche de la base de données. Les types supportés par CakePHP
sont:

string
    Généralement construit en colonnes CHAR ou VARCHAR. Utiliser l'option
    ``fixed`` va forcer une colonne CHAR. Dans SQL Server, les types NCHAR et
    NVARCHAR sont utilisés.
text
    Correspond aux types TEXT.
uuid
    Correspond au type UUID si une base de données en fournit un, sinon cela
    générera un champ CHAR(36).
integer
    Correspond au type INTEGER fourni par la base de données. BIT n'est pour
    l'instant pas supporté.
smallinteger
    Correspond au type SMALLINT fourni par la base de données.
tinyinteger
    Correspond au type TINYINT (ou SMALLINT) fourni par la base de données. Sur MySQL
    ``TINYINT(1)`` sera traité comme un booléen.
biginteger
    Correspond au type BIGINT fourni par la base de données.
float
    Correspond soit à DOUBLE, soit à FLOAT selon la base de données.
    L'option ``precision`` peut être utilisée pour définir la précision
    utilisée.
decimal
    Correspond au type DECIMAL. Supporte les options ``length`` et
    ``precision``.
boolean
    Correspond au BOOLEAN sauf pour MySQL, où TINYINT(1) est utilisé pour
    représenter les booléens. BIT(1) n'est pour l'instant pas supporté.
binary
    Correspond au type BLOB ou BYTEA fourni par la base de données.
date
    Correspond au type de colonne DATE sans timezone. La valeur de retour de ce
    type de colonne est :php:class:`Cake\\I18n\\Date` qui étend la classe
    native ``DateTime``.
datetime
    Correspond au type de colonne DATETIME sans timezone. Dans PostgreSQL et
    SQL Server, ceci retourne un type TIMESTAMP. La valeur retournée par défaut
    de ce type de colonne est :php:class:`Cake\\I18n\\Time` qui étend
    les classes intégrées ``DateTime`` et
    `Chronos <https://github.com/cakephp/chronos>`_.
timestamp
    Correspond au type TIMESTAMP.
time
    Correspond au type TIME dans toutes les bases de données.
json
    Correspond au type JSON s'il est disponible, sinon il correspond à TEXT. Le
    type 'json' a été ajouté dans la version 3.3.0.

Ces types sont utilisés à la fois pour les fonctionnalités de reflection de
schema fournies par CakePHP, et pour les fonctionnalités de génération de schema
que CakePHP utilise lors des fixtures de test.

Chaque type peut aussi fournir des fonctions de traduction entre les
représentations PHP et SQL. Ces méthodes sont invoquées selon le type hints
fourni lorsque les requêtes sont faites. Par exemple une colonne qui est marquée
en 'datetime' va automatiquement convertir les paramètres d'input d'instances
``DateTime`` en timestamp ou chaines de dates formatées. Egalement, les
colonnes 'binary' vont accepter un fichier qui gère, et génère le fichier lors
de la lecture des données.

.. versionchanged:: 3.3.0
    Le type ``json`` a été ajouté.

.. versionchanged:: 3.5.0
    Les types ``smallinteger`` et ``tinyinteger`` ont été ajoutés.

.. _adding-custom-database-types:

Ajouter des Types Personnalisés
-------------------------------

.. php:staticmethod:: map($name, $class)

Si vous avez besoin d'utiliser des types spécifiques qui ne sont pas
fournis CakePHP, vous pouvez ajouter des nouveaux types supplémentaires
au système de type de CakePHP. Ces classes de type s'attendent à implémenter
les méthodes suivantes:

* toPHP
* toDatabase
* toStatement
* marshal

Une façon facile de remplir l'interface basique est d'étendre
:php:class:`Cake\\Database\\Type`. Par exemple, si vous souhaitez ajouter un
type JSON, nous pourrions faire la classe type suivante::

    // Dans src/Database/Type/JsonType.php

    namespace App\Database\Type;

    use Cake\Database\Driver;
    use Cake\Database\Type;
    use PDO;

    class JsonType extends Type
    {

        public function toPHP($value, Driver $driver)
        {
            if ($value === null) {
                return null;
            }
            return json_decode($value, true);
        }

        public function marshal($value)
        {
            if (is_array($value) || $value === null) {
                return $value;
            }
            return json_decode($value, true);
        }

        public function toDatabase($value, Driver $driver)
        {
            return json_encode($value);
        }

        public function toStatement($value, Driver $driver)
        {
            if ($value === null) {
                return PDO::PARAM_NULL;
            }
            return PDO::PARAM_STR;
        }

    }

Par défaut, la méthode ``toStatement`` va traiter les valeurs en chaines qui
vont fonctionner pour notre nouveau type. Une fois que nous avons créé notre
nouveau type, nous avons besoin de l'ajouter dans la correspondance de type.
Pendant le bootstrap de notre application, nous devrions faire ce qui suit::

    use Cake\Database\Type;

    Type::map('json', 'Cake\Database\Type\JsonType');

Nous pouvons ensuite surcharger les données de schema reflected pour utiliser
notre nouveau type, et la couche de base de données de CakePHP va
automatiquement convertir nos données JSON lors de la création de requêtes.
Vous pouvez utiliser les types personnalisés créés en faisant la correspondance
des types dans la :ref:`méthode _initializeSchema() <saving-complex-types>` de
votre Table::

    use Cake\Database\Schema\TableSchema;

    class WidgetsTable extends Table
    {

        protected function _initializeSchema(TableSchema $schema)
        {

            $schema->columnType('widget_prefs', 'json');
            return $schema;
        }

    }

.. _mapping-custom-datatypes-to-sql-expressions:

Faire correspondre des types de données personnalisés aux expressions SQL
-------------------------------------------------------------------------

.. versionadded:: 3.3.0
    Le support pour le mappage des types de données personnalisés aux expressions SQL a été ajouté dans la version 3.3.0.

L'exemple précédent fait correspondre un type de données personnalisé pour une 
colonne de type 'json' qui est facilement représenté sous la forme d'une chaîne 
dans une instruction SQL. Les types de données complexes ne peuvent pas être 
représentées sous la forme de chaînes/entiers dans des requêtes SQL. Quand vous 
travaillez avec ces types de données, votre class Type doit implémenter l'interface 
``Cake\Database\Type\ExpressionTypeInterface``. Cette interface permet de 
représenter une valeur de votre type de données personnalisé comme une expression SQL.
Comme exemple, nous allons construire une simple classe Type pour manipuler le type de
données ``POINT`` de MysQL. Premièrement, nous allons définir un objet 'value' que nous 
allons pouvoir utiliser pour représenter les données de ``POINT`` en PHP::

    // in src/Database/Point.php
    namespace App\Database;

    // Our value object is immutable.
    class Point
    {
        protected $_lat;
        protected $_long;

        // Factory method.
        public static function parse($value)
        {
            // Parse the data from MySQL.
            return new static($value[0], $value[1]);
        }

        public function __construct($lat, $long)
        {
            $this->_lat = $lat;
            $this->_long = $long;
        }

        public function lat()
        {
            return $this->_lat;
        }

        public function long()
        {
            return $this->_long;
        }
    }

Maintenant que notre objet 'value' créé, nous avons besoin d'une classe Type pour 
faire correspondre les données dans cet objet et les expressions SQL::

    namespace App\Database\Type;

    use App\Database\Point;
    use Cake\Database\Expression\FunctionExpression;
    use Cake\Database\Type as BaseType;
    use Cake\Database\Type\ExpressionTypeInterface;

    class PointType extends BaseType implements ExpressionTypeInterface
    {
        public function toPHP($value, Driver $d)
        {
            return Point::parse($value);
        }

        public function marshal($value)
        {
            if (is_string($value)) {
                $value = explode(',', $value);
            }
            if (is_array($value)) {
                return new Point($value[0], $value[1]);
            }
            return null;
        }

        public function toExpression($value)
        {
            if ($value instanceof Point) {
                return new FunctionExpression(
                    'POINT',
                    [
                        $value->lat(),
                        $value->long()
                    ]
                );
            }
            if (is_array($value)) {
                return new FunctionExpression('POINT', [$value[0], $value[1]]);
            }
            // Handle other cases.
        }
    }

La classe ci-dessus fait quelques éléments intéressants :

* La méthode ``toPHP`` se charge du parsing des résulats de la requête SQL dans un objet 'value'.
* La méthode ``marshal`` se charge de convertir, comme celles données dans la requête, dans notre objet 'value'.
  Nous allons accepter des chaînes comme ``'10.24,12.34`` ainsi que des tableaux.
* La méthode ``toExpression`` se charge de convertir notre objet 'value' dans des expressions SQL équivalentes. 
  Dans notre exemple, le SQL résultant devrait être quelque choise comme ``POINT(10.24, 12.34)``.

Une fois que nous avons construit notre type personnalisé, nous allons :ref:`connecter notre type à 
notre class de table <saving-complex-types>`.

.. _immutable-datetime-mapping:

Activer les Objets DateTime Immutables
--------------------------------------

.. versionadded:: 3.2
    les objets date/heure immutables ont été ajoutés en 3.2.

Puisque les objets Date/Time sont facilement mutables en place, CakePHP vous
permet d'activer les objets immutables. le meilleur endroit pour cela est le
fichier **config/bootstrap.php** ::

    Type::build('datetime')->useImmutable();
    Type::build('date')->useImmutable();
    Type::build('time')->useImmutable();
    Type::build('timestamp')->useImmutable();

.. note::
    Les nouvelles applications auront les objets immutables activés par défaut.

Les Classes de Connection
=========================

.. php:class:: Connection

Les classes de Connection fournissent une interface simple pour interagir avec
les connexions à la base de données d'une façon pratique. Elles ont pour
objectif d'être une interface plus abstraite à la couche de driver et de fournir
des fonctionnalités pour l'exécution des requêtes, le logging des requêtes, et
de faire des opérations transactionnelles.

.. _database-queries:

L'exécution des Requêtes
------------------------

.. php:method:: query($sql)

Une fois que vous avez un objet Connection, vous voudrez probablement réaliser
quelques requêtes avec. La couche d'abstraction de CakePHP fournit des
fonctionnalités au-dessus de PDO et des drivers natifs. Ces fonctionnalités
fournissent une interface similaire à PDO. Il y a quelques différentes façons
de lancer les requêtes selon le type de requête que vous souhaitez lancer et
selon le type de résultats que vous souhaitez en retour. La méthode la plus
basique est ``query()`` qui vous permet de lancer des requêtes SQL déjà
complètes::

    $stmt = $conn->query('UPDATE posts SET published = 1 WHERE id = 2');

.. php:method:: execute($sql, $params, $types)

La méthode ``query`` n'accepte pas de paramètres supplémentaires. Si vous
avez besoin de paramètres supplémentaires, vous devrez utiliser la méthode
``execute()``, ce qui permet aux placeholders d'être utilisés::

    $stmt = $conn->execute(
        'UPDATE posts SET published = ? WHERE id = ?',
        [1, 2]
    );

Sans aucun typage des informations, ``execute`` va supposer que tous les
placeholders sont des chaînes de valeur. Si vous avez besoin de lier des types
spécifiques de données, vous pouvez utiliser leur nom de type abstrait lors
de la création d'une requête::

    $stmt = $conn->execute(
        'UPDATE posts SET published_date = ? WHERE id = ?',
        [new DateTime('now'), 2],
        ['date', 'integer']
    );

.. php:method:: newQuery()

Cela vous permet d'utiliser des types de données riches dans vos applications
et de les convertir convenablement en instructions SQL. La dernière manière
la plus flexible de créer des requêtes est d'utiliser :doc:`/orm/query-builder`.
Cette approche vous permet de construire des requêtes expressives complexes sans
avoir à utiliser une plateforme SQL spécifique::

    $query = $conn->newQuery();
    $query->update('posts')
        ->set(['published' => true])
        ->where(['id' => 2]);
    $stmt = $query->execute();

Quand vous utilisez le query builder, aucun SQL ne sera envoyé au serveur
de base de données jusqu'à ce que la méthode ``execute()`` soit appelée, ou
que la requête soit itérée. Itérer une requête va d'abord l'exécuter et ensuite
démarrer l'itération sur l'ensemble des résultats::

    $query = $conn->newQuery();
    $query->select('*')
        ->from('posts')
        ->where(['published' => true]);

    foreach ($query as $row) {
        // Faire quelque chose avec la ligne.
    }

.. note::

    Quand vous avez une instance de :php:class:`Cake\\ORM\\Query`, vous pouvez
    utiliser ``all()`` pour récupérer l'ensemble de résultats pour les requêtes
    SELECT.

Utiliser les Transactions
-------------------------

Les objets de connexion vous fournissent quelques manières simples pour que
vous fassiez des transactions de base de données. La façon la plus basique de
faire des transactions est avec les méthodes ``begin``, ``commit`` et
``rollback``, qui correspondent à leurs équivalents SQL::

    $conn->begin();
    $conn->execute('UPDATE posts SET published = ? WHERE id = ?', [true, 2]);
    $conn->execute('UPDATE posts SET published = ? WHERE id = ?', [false, 4]);
    $conn->commit();

.. php:method:: transactional(callable $callback)

En plus de cette interface, les instances de connexion fournissent aussi la
méthode ``transactional`` ce qui simplifie la gestion des appels
begin/commit/rollback::

    $conn->transactional(function ($conn) {
        $conn->execute('UPDATE posts SET published = ? WHERE id = ?', [true, 2]);
        $conn->execute('UPDATE posts SET published = ? WHERE id = ?', [false, 4]);
    });

En plus des requêtes basiques, vous pouvez exécuter des requêtes plus complexes
en utilisant soit :doc:`/orm/query-builder`, soit :doc:`/orm/table-objects`. La
méthode transactionnelle fera ce qui suit:

- Appel de ``begin``.
- Appelle la fermeture fournie.
- Si la fermeture lance une exception, un rollback sera délivré. L'exception
  originelle sera relancée.
- Si la fermeture retourne ``false``, un rollback sera délivré.
- Si la fermeture s'exécute avec succès, la transaction sera réalisée.

Interagir avec les Requêtes
===========================

Lors de l'utilisation de l'API de plus bas niveau, vous rencontrerez souvent des
objets statement (requête). Ces objets vous permettent de manipuler les
requêtes préparées sous-jacentes du driver. Après avoir créé et exécuté un objet
query, ou en utilisant ``execute()``, vous devriez avoir une instance
``StatementDecorator``. Elle enveloppe l'objet statement (instruction) basique
sous-jacent et fournit quelques fonctionnalités supplémentaires.

Préparer une Requête
--------------------

Vous pouvez créer un objet statement (requête) en utilisant ``execute()``, ou
``prepare()``. La méthode ``execute()`` retourne une requête avec les valeurs
fournies en les liant à lui. Alors que ``prepare()`` retourne une requête
incomplète::

    // Les requêtes à partir de execute auront des valeurs leur étant déjà liées.
    $stmt = $conn->execute(
        'SELECT * FROM articles WHERE published = ?',
        [true]
    );

    // Les Requêtes à partir de prepare seront des paramètres pour les placeholders.
    // Vous avez besoin de lier les paramètres avant d'essayer de l'exécuter.
    $stmt = $conn->prepare('SELECT * FROM articles WHERE published = ?');

Une fois que vous avez préparé une requête, vous pouvez lier les données
supplémentaires et l'exécuter.

.. _database-basics-binding-values:

Lier les Valeurs (Binding)
--------------------------

Une fois que vous avez créé une requête préparée, vous voudrez peut-être
lier des données supplémentaires. Vous pouvez lier plusieurs valeurs en une
fois en utilisant la méthode ``bind``, ou lier les éléments individuels
en utilisant ``bindValue``::

    $stmt = $conn->prepare(
        'SELECT * FROM articles WHERE published = ? AND created > ?'
    );

    // Lier plusieurs valeurs
    $stmt->bind(
        [true, new DateTime('2013-01-01')],
        ['boolean', 'date']
    );

    // Lier une valeur unique
    $stmt->bindValue(1, true, 'boolean');
    $stmt->bindValue(2, new DateTime('2013-01-01'), 'date');

Lors de la création de requêtes, vous pouvez aussi utiliser les clés nommées
de tableau plutôt que des clés de position::

    $stmt = $conn->prepare(
        'SELECT * FROM articles WHERE published = :published AND created > :created'
    );

    // Lier plusieurs valeurs
    $stmt->bind(
        ['published' => true, 'created' => new DateTime('2013-01-01')],
        ['published' => 'boolean', 'created' => 'date']
    );

    // Lier une valeur unique
    $stmt->bindValue('published', true, 'boolean');
    $stmt->bindValue('created', new DateTime('2013-01-01'), 'date');

.. warning::

    Vous ne pouvez pas mixer les clés de position et les clés nommées de tableau
    dans la même requête.

Executer & Récupérer les Colonnes
---------------------------------

Après la préparation d'une requête et après avoir lié les données à celle-ci,
vous pouvez l'exécuter et récupérer les lignes. Les requêtes devront être
exécutées en utilisant la méthode ``execute()``. Une fois exécutée, les
résultats peuvent être récupérés en utilisant ``fetch()``, ``fetchAll()`` ou
en faisant une itération de la requête::

    $stmt->execute();

    // Lire une ligne.
    $row = $stmt->fetch('assoc');

    // Lire toutes les lignes.
    $rows = $stmt->fetchAll('assoc');

    // Lire les lignes en faisant une itération.
    foreach ($stmt as $row) {
        // Faire quelque chose
    }

.. note::

    Lire les lignes avec une itération va récupérer les lignes dans les 'deux'
    modes. Cela signifie que vous aurez à la fois les résultats indexés
    numériquement et de manière associative.

Récupérer les Compteurs de Ligne
--------------------------------

Après avoir exécuté une requête, vous pouvez récupérer le nombre de lignes
affectées::

    $rowCount = count($stmt);
    $rowCount = $stmt->rowCount();


Vérifier les Codes d'Erreur
---------------------------

Si votre requête n'est pas réussie, vous pouvez obtenir des informations liées
à l'erreur en utilisant les méthodes ``errorCode()`` et ``errorInfo()``. Ces
méthodes fonctionnent de la même façon que celles fournies par PDO::

    $code = $stmt->errorCode();
    $info = $stmt->errorInfo();

.. _database-query-logging:

Faire des Logs de Requête
=========================

Le logs de Requête peuvent être activés lors de la configuration de votre
connexion en définissant l'option ``log`` à ``true``. Vous pouvez changer le
log de requête à la volée, en utilisant ``logQueries``::

    // Active les logs des requêtes.
    $conn->logQueries(true);

    // Stoppe les logs des requêtes
    $conn->logQueries(false);

Quand les logs des requêtes sont activés, les requêtes sont enregistrées dans
:php:class:`Cake\\Log\\Log` en utilisant le niveau de 'debug', et le scope
de 'queriesLog'. Vous aurez besoin d'avoir un logger configuré pour capter
ce niveau & scope. Faire des logs vers ``stderr`` peut être utile lorsque vous
travaillez sur les tests unitaires, et les logs de fichiers/syslog peuvent être
utiles lorsque vous travaillez avec des requêtes web::

    use Cake\Log\Log;

    // Logs de la Console
    Log::config('queries', [
        'className' => 'Console',
        'stream' => 'php://stderr',
        'scopes' => ['queriesLog']
    ]);

    // Logs des Fichiers
    Log::config('queries', [
        'className' => 'File',
        'file' => 'queries.log',
        'scopes' => ['queriesLog']
    ]);

.. note::

    Les logs des requêtes sont seulement à utiliser pour le
    debuggage/development. Vous ne devriez jamais laisser les logs de requêtes
    activées en production puisque cela va avoir un impact négatif sur les
    performances de votre application.

.. _identifier-quoting:

Identifier Quoting
==================

Par défaut CakePHP **ne** quote **pas** les identifiers dans les requêtes SQL
générées. La raison pour ceci est que l'ajout de quote autour des identifiers
a quelques inconvénients:

* Par dessus tout la Performance - Ajouter des quotes est bien plus lent et
  complexe que de ne pas le faire.
* Pas nécessaire dans la plupart des cas - Dans des bases de données récentes
  qui suivent les conventions de CakePHP, il n'y a pas de raison de quoter les
  identifiers.

Si vous utilisez un schema datant un peu qui nécessite de quoter les
identifiers, vous pouvez l'activer en utilisant le paramètre
``quoteIdentifiers`` dans votre :ref:`database-configuration`. Vous pouvez
aussi activer cette fonctionnalité à la volée::

    $conn->driver()->autoQuoting(true);

Quand elle est activée, l'identifier quoting va entrainer des requêtes
supplémentaires traversales qui convertissent tous les identifiers en objets
``IdentifierExpression``.

.. note::

    Les portions de code SQL contenues dans les objets QueryExpression ne seront
    pas modifiées.

.. _database-metadata-cache:

La Mise en Cache de Metadata
============================

L'ORM de CakePHP utilise la reflection de base de données pour déterminer
le schema, les indices et les clés étrangères de votre application. Comme
cette metadata change peu fréquemment et peut être lourde à accéder, elle est
habituellement mise en cache. Par défaut, les metadata sont stockées dans la
configuration du cache ``_cake_model_``. Vous pouvez définir une configuration
de cache personnalisée en utilisant l'option ``cacheMetatdata`` dans la
configuration de la source de données::

    'Datasources' => [
        'default' => [
            // Autres clés ici.

            // Utilise la config de cache 'orm_metadata' pour les metadata.
            'cacheMetadata' => 'orm_metadata',
        ]
    ],

Vous pouvez aussi configurer les metadata mises en cache à l'exécution avec la
méthode ``cacheMetadata()``::

    // Désactive le cache
    $connection->cacheMetadata(false);

    // Active le cache
    $connection->cacheMetadata(true);

    // Utilise une config de cache personnalisée
    $connection->cacheMetadata('orm_metadata');

CakePHP intègre aussi un outil CLI pour gérer les mises en cache de metadata.
Consultez le chapitre :doc:`/console-and-shells/schema-cache` pour plus
d'information.

Créer des Bases de Données
==========================

Si vous voulez créer une connexion (Connection) sans sélectionner de base de
données, vous pouvez omettre le nom de la base de données::

    $dsn = 'mysql://root:password@localhost/';

Vous pouvez maintenant utiliser votre objet Connection pour exécuter des
requêtes qui créent/modifient les bases de données. Par exemple pour créer une
base de données::

    $connection->query("CREATE DATABASE IF NOT EXISTS my_database");

.. note::

    Lorsque vous créez une base de données, il est recommandé de définir le jeu
    de caractères ainsi que les paramètres de collation. Si ces valeurs sont
    manquantes, la base de données utilisera les valeurs par défaut du système
    quelles qu'elles soient.

.. meta::
    :title lang=fr: Notions de Base de Base de Données
    :keywords lang=fr: SQL,MySQL,MariaDB,PostGres,Postgres,postgres,PostgreSQL,PostGreSQL,postGreSql,select,insert,update,delete,statement,configuration,connection,base de données,data,types,custom,,executing,queries,transactions,prepared,statements,binding,fetching,row,count,error,codes,query,logging,identifier,quoting,metadata,cache
