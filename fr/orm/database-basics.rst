Notions de Base de Base de Données
##################################

La couche d'accès à la base de données de CakePHP fournit une abstraction et
une aide sur la plupart des aspects des traitements de bases de données
relationnelles telles que le maintien des connexions au serveur, la
construction de requêtes, la protection contre les injections SQL, l'inspection
et la modification des schémas, et avec le débogage et le profilage des requêtes
envoyées à la base de données.

Tour Rapide
===========

Les fonctions décrites dans ce chapitre illustrent les possibilités de l'API de
bas niveau d'accès à la base de données. Si vous souhaitez plutôt en
apprendre plus sur l'ORM complet, vous pouvez lire les sections portant sur le
:doc:`/orm/query-builder` et :doc:`/orm/table-objects`.

La manière la plus simple de créer une connexion à la base de données est
d'utiliser une chaine ``DSN``::

    use Cake\Datasource\ConnectionManager;

    $dsn = 'mysql://root:password@localhost/my_database';
    ConnectionManager::setConfig('default', ['url' => $dsn]);

Vous pouvez commencer à utiliser l'objet de connexion aussitôt après l'avoir
créé::

    $connection = ConnectionManager::get('default');

.. note::
    Pour en savoir plus sur les bases de données supportées, consultez le
    chapitre :doc:`installation notes </installation>`.

.. _running-select-statements:

Exécuter des Instructions Select
--------------------------------

Exécuter une instruction SQL pure est un jeu d'enfant::

    use Cake\Datasource\ConnectionManager;

    $connection = ConnectionManager::get('default');
    $results = $connection->execute('SELECT * FROM articles')->fetchAll('assoc');

Vous pouvez utiliser des requêtes préparées pour insérer des paramètres::

    $results = $connection
        ->execute('SELECT * FROM articles WHERE id = :id', ['id' => 1])
        ->fetchAll('assoc');

Il est également possible d'utiliser des types de données complexes en tant
qu'arguments::

    use Cake\Datasource\ConnectionManager;
    use DateTime;

    $connection = ConnectionManager::get('default');
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
        ->where(['created >' => new DateTime('1 day ago')], ['created' => 'datetime'])
        ->order(['title' => 'DESC'])
        ->execute()
        ->fetchAll('assoc');

Exécuter des Instructions Insert
--------------------------------

Insérer une ligne dans une base de données est habituellement l'affaire
de quelques lignes::

    use Cake\Datasource\ConnectionManager;
    use DateTime;

    $connection = ConnectionManager::get('default');
    $connection->insert('articles', [
        'title' => 'A New Article',
        'created' => new DateTime('now')
    ], ['created' => 'datetime']);

Exécuter des Instructions Update
--------------------------------

Mettre à jour une ligne de base de données est tout aussi intuitif. L'exemple suivant
procédera à la mise à jour de l'article comportant l'**id** 10::

    use Cake\Datasource\ConnectionManager;
    $connection = ConnectionManager::get('default');
    $connection->update('articles', ['title' => 'New title'], ['id' => 10]);

Exécuter des Instructions Delete
--------------------------------

De même, la méthode ``delete()`` est utilisée pour supprimer des lignes de la
base de données. L'exemple suivant procédera à suppression de l'article
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
La configuration de la connexion pourrait par exemple ressembler à ceci::

    'Datasources' => [
        'default' => [
            'className' => 'Cake\Database\Connection',
            'driver' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'localhost',
            'username' => 'my_app',
            'password' => 'secret',
            'database' => 'my_app',
            'encoding' => 'utf8mb4',
            'timezone' => 'UTC',
            'cacheMetadata' => true,
        ]
    ],

Le code ci-dessus va créer une connexion 'default', avec les paramètres
fournis. Vous pouvez définir autant de connexions que vous le souhaitez dans
votre fichier de configuration. Vous pouvez aussi définir des connexions
supplémentaires à la volée en utilisant
:php:meth:`Cake\\DataSource\\ConnectionManager::setConfig()`. Voici un exemple::

    use Cake\Datasource\ConnectionManager;

    ConnectionManager::setConfig('default', [
        'className' => 'Cake\Database\Connection',
        'driver' => 'Cake\Database\Driver\Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'username' => 'my_app',
        'password' => 'secret',
        'database' => 'my_app',
        'encoding' => 'utf8mb4',
        'timezone' => 'UTC',
        'cacheMetadata' => true,
    ]);

Les options de configuration peuvent également être fournies en tant que chaîne
:term:`DSN`. C'est utile lorsque vous travaillez avec des variables
d'environnement ou des fournisseurs :term:`PaaS`::

    ConnectionManager::setConfig('default', [
        'url' => 'mysql://my_app:secret@localhost/my_app?encoding=utf8&timezone=UTC&cacheMetadata=true',
    ]);

Lorsque vous utilisez une chaîne DSN, vous pouvez définir des paramètres/options
supplémentaires en tant qu'arguments de query string.

Par défaut, tous les objets Table vont utiliser la connexion ``default``. Pour
utiliser une autre connexion, reportez-vous à
:ref:`la configuration des connexions<configuring-table-connections>`.

La configuration de la base de données supporte de nombreuses clés. Voici la
liste complète:

className
    Nom de classe complet (incluant le *namespace*) de la classe qui
    représente une connexion au serveur de base de données.
    Cette classe a pour rôle de charger le pilote de base de données, de
    fournir les mécanismes de transaction et de préparer les requêtes SQL
    (entres autres choses).
driver
    Le nom de la classe du pilote utilisé pour implémenter les spécificités
    d'un moteur de bases de données. Cela peut être soit un nom de classe court
    en utilisant la :term:`syntaxe de plugin`, soit un nom complet avec namespace,
    soit une instance du pilote déjà construite. Les exemples de noms de classe
    courts sont Mysql, Sqlite, Postgres, et Sqlserver.
persistent
    S'il faut utiliser ou non une connexion persistante à la base de données.
    Cette option n'est pas supportée par SqlServer. Une exception est lancée si
    vous essayez de définir ``persistent`` à ``true`` sur SqlServer.
host
    Le nom d'hôte du serveur de base de données (ou une adresse IP).
username
    Le nom d'utilisateur pour votre compte.
password
    Le mot de passe pour le compte.
database
    Le nom de la base de données à utiliser pour cette connexion. Éviter
    d'utiliser ``.`` dans votre nom de base de données. CakePHP ne supporte pas
    ``.`` dans les noms de base de données parce que cela complique
    l'échappement des identifiants.
    Les chemins vers vos bases de données SQLite doivent être absolus
    (par exemple ``ROOT . DS . 'my_app.db'``) pour éviter les erreurs de chemins
    incorrects à cause de chemins relatifs.
port (*optionnel*)
    Le port TCP ou le socket Unix utilisé pour se connecter au serveur.
encoding
    Indique le jeu de caractères à utiliser lors de l'envoi d'instructions SQL
    au serveur. L'encodage par défaut est celui de la base de données
    pour toutes les bases de données autres que DB2.
timezone
    Le timezone du serveur.
schema
    Utilisé pour spécifier le schema à utiliser pour les bases de données
    PostgreSQL.
unix_socket
    Utilisé par les drivers qui le supportent pour se connecter via les fichiers
    socket Unix. Si vous utilisez PostgreSQL et que vous voulez utiliser les
    sockets Unix, laissez la clé host vide.
ssl_key
    Le chemin vers le fichier de clé SSL (supporté seulement par MySQL).
ssl_cert
    Le chemin vers le fichier du certificat SSL (supporté seulement par MySQL).
ssl_ca
    Le chemin vers le fichier de l'autorité de certification SSL (supporté
    seulement par MySQL).
init
    Une liste de requêtes qui doivent être envoyées au serveur de la base de
    données lorsque la connexion est créée.
log
    Défini à ``true`` pour activer les logs des requêtes. Si activé,
    les requêtes seront écrites au niveau ``debug`` avec le scope
    ``queriesLog``.
quoteIdentifiers
    Défini à ``true`` si vous utilisez des mots réservés ou des caractères
    spéciaux dans les noms de tables ou de colonnes. Si cette option est
    activée, les identificateurs seront quotés lors de la génération du SQL dans
    les requêtes construites avec le :doc:`/orm/query-builder`.
    Notez que ceci diminue la performance parce que chaque requête a
    besoin d'être traversée et manipulée avant d'être exécutée.
flags
    Un tableau associatif de constantes PDO qui doivent être passées
    à l'instance PDO sous-jacente. Regardez la documentation de PDO pour les
    flags supportés par le pilote que vous utilisez.
cacheMetadata
    Soit un booléen ``true``, soit une chaîne contenant la configuration du
    cache pour stocker les métadonnées. Désactiver la mise en cache des
    métadonnées n'est pas conseillé et peut entraîner de faibles performances.
    Consultez la section sur :ref:`database-metadata-cache` pour plus
    d'information.
mask
    Définit les droits sur le fichier de base de données généré (seulement supporté
    par SQLite)
cache
    Le drapeau ``cache`` à envoyer à SQLite.
mode
    La valeur du drapeau ``mode`` à envoyer à SQLite.

Au point où nous en sommes, vous pouvez aller voir
:doc:`/intro/conventions`. Le nommage correct de vos tables (et de quelques
colonnes) peut vous offrir des fonctionnalités utiles sans
aucun effort et vous éviter d'avoir à faire de la configuration. Par
exemple, si vous nommez votre table de base de données big\_boxes, votre table
BigBoxesTable, et votre controller BigBoxesController, tout fonctionnera
ensemble automatiquement. Par convention, utilisez les underscores, les
minuscules et les formes plurielles pour vos noms de table de la base de
données - par exemple: bakers, pastry\_stores, et savory\_cakes.

.. note::

    Si votre serveur MySQL est configuré avec
    ``skip-character-set-client-handshake`` alors vous DEVEZ utiliser la clé de
    configuration ``flags`` pour définir votre encodage de caractères. Par
    exemple::

        'flags' => [\PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8']

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

    $connection = ConnectionManager::get('default');

La tentative de chargement de connexions qui n'existent pas va lancer une
exception.

Créer des Connexions à l'Exécution
----------------------------------

En utilisant ``setConfig()`` et ``get()``, vous pouvez créer à tout moment de
nouvelles connexions qui ne sont pas défines dans votre fichier de
configuration::

    ConnectionManager::setConfig('ma_connexion', $config);
    $connection = ConnectionManager::get('ma_connexion');

Consultez le chapitre sur la :ref:`configuration <database-configuration>`
pour plus d'informations sur les données de configuration utilisées lors de
la création de connexions.

.. _database-data-types:

.. php:namespace:: Cake\Database

Types de Données
================

.. php:class:: TypeFactory

Puisque tous les fournisseurs de base de données n'intègrent pas la même
définition des types de données, ou pas les mêmes noms pour des types de données
similaires, CakePHP fournit un ensemble de types de données abstraits à
utiliser avec la couche de la base de données. Les types supportés par CakePHP
sont:

string
    Correspond au type ``VARCHAR``. Avec SQL Server, c'est le type ``NVARCHAR``
    qui est utilisé.
char
    Correspond au type ``CHAR``. Avec SQL Server, c'est le type ``NCHAR`` qui
    est utilisé.
text
    Correspond aux types ``TEXT``.
uuid
    Correspond au type UUID si une base de données en fournit un, sinon cela
    générera un champ ``CHAR(36)``.
binaryuuid
    Correspond au type UUID si la base de données en fournit un, sinon cela
    générera un champ ``BINARY(16)``.
integer
    Correspond au type ``INTEGER`` fourni par la base de données. BIT n'est pour
    l'instant pas supporté.
smallinteger
    Correspond au type ``SMALLINT`` fourni par la base de données.
tinyinteger
    Correspond au type ``TINYINT`` ou ``SMALLINT`` fourni par la base de
    données. Sur MySQL ``TINYINT(1)`` sera traité comme un booléen.
biginteger
    Correspond au type ``BIGINT`` fourni par la base de données.
float
    Correspond soit à ``DOUBLE``, soit à ``FLOAT`` selon la base de données.
    L'option ``precision`` peut être utilisée pour définir la précision
    utilisée.
decimal
    Correspond au type ``DECIMAL``. Supporte les options ``length`` et
    ``precision``. Les valeurs du type `decimal` sont représentées par des
    chaînes de texte (et non par des `float` comme on pourrait s'y attendre).
    Cela vient du fait que les types décimaux sont utilisés pour réprésenter des
    valeurs numériques exactes dans les bases de données, alors que
    l'utilisation de type flottants en PHP peut potentiellement entraîner des
    pertes de précision.

    Si vous voulez que les valeurs soient représentées par des `float` dans
    votre code PHP, envisagez plutôt d'utiliser des types de colonnes `FLOAT` ou
    `DOUBLE` dans votre base de données. Ensuite, selon l'utilisation que vous
    en ferez, vous pourrez faire correspondre explicitement vos colonnes
    décimales à un type `float` dans votre schéma de table.
boolean
    Correspond au ``BOOLEAN`` sauf pour MySQL, où ``TINYINT(1)`` est utilisé pour
    représenter les booléens. ``BIT(1)`` n'est pour l'instant pas supporté.
binary
    Correspond au type ``BLOB`` ou ``BYTEA`` fourni par la base de données.
date
    Correspond au type de colonne natif ``DATE``. La valeur de retour de ce
    type de colonne est :php:class:`Cake\\I18n\\Date` qui étend la classe
    native ``DateTime``.
datetime
    Consultez :ref:`datetime-type`.
datetimefractional
    Consultez :ref:`datetime-type`.
timestamp
    Correspond au type ``TIMESTAMP``.
timestampfractional
    Correspond au type ``TIMESTAMP(N)``.
time
    Correspond au type ``TIME`` dans toutes les bases de données.
json
    Correspond au type ``JSON`` s'il est disponible, sinon il correspond à ``TEXT``.

Ces types sont utilisés à la fois pour les fonctionnalités de reflection de
schema fournies par CakePHP, et pour les fonctionnalités de génération de schema
que CakePHP utilise lors des fixtures de test.

Chaque type peut aussi fournir des fonctions de traduction entre les
représentations PHP et SQL. Ces méthodes sont invoquées selon les spécifications
de type fournies lorsque les requêtes sont créées. Par exemple une colonne qui
est marquée en 'datetime' va automatiquement convertir les paramètres d'entrée
d'instances ``DateTime`` en timestamp ou en chaînes de dates formatées. De même,
les colonnes 'binary' vont accepter des transmissions de fichiers, et générer un
fichier lors de la lecture des données.

.. _datetime-type:

Type DateTime
-------------

.. php:class:: DateTimeType

Correspond à un type de colonne natif ``DATETIME``. Dans PostgreSQL et SQL Server,
il s'agit du type ``TIMESTAMP``. La valeur de retour par défaut de ce type de
colonne est :php:class:`Cake\\I18n\\FrozenTime` qui étend la classe intégrée
``DateTimeImmutable`` et `Chronos <https://github.com/cakephp/chronos>`_.

.. php:method:: setTimezone(string|\DateTimeZone|null $timezone)

Si le fuseau horaire de votre serveur de base de données ne correspond pas au fuseau
horaire PHP de votre application, vous pouvez utiliser cette méthode pour spécifier
le fuseau horaire de votre base de données. Ce fuseau horaire sera alors utilisé
lors de la conversion des objets PHP en chaîne de date de la base de données et
vice-versa.

.. php:class:: DateTimeFractionalType

Peut être utilisé pour mettre en correspondance des colonnes de date et heure qui
contiennent des microsecondes, telles que ``DATETIME(6)`` dans MySQL. Pour utiliser
ce type, vous devez l'ajouter en tant que type mappé::

    // dans config/bootstrap.php
    use Cake\Database\TypeFactory;
    use Cake\Database\Type\DateTimeFractionalType;

    // Remplacer le type de date par défaut par un type plus précis.
    TypeFactory::map('datetime', DateTimeFractionalType::class);

.. php:class:: DateTimeTimezoneType

Peut être utilisé pour mapper des colonnes date et heure qui contiennent des
fuseaux horaires comme ``TIMESTAMPTZ`` dans PostgreSQL. Pour utiliser ce type, vous
devez l'ajouter en tant que type mappé::

    // dans config/bootstrap.php
    use Cake\Database\TypeFactory;
    use Cake\Database\Type\DateTimeTimezoneType;

    // Remplacer le type de date par défaut par un type plus précis.
    TypeFactory::map('datetime', DateTimeTimezoneType::class);

.. _adding-custom-database-types:

Ajouter des Types Personnalisés
-------------------------------

.. php:class:: TypeFactory
.. php:staticmethod:: map($name, $class)

Si vous avez besoin d'utiliser des types spécifiques qui ne sont pas
fournis CakePHP, vous pouvez ajouter de nouveaux types
au système de types de CakePHP. Ces classes de type doivent implémenter
les méthodes suivantes:

* ``toPHP``: Convertit la valeur spécifiée depuis un type de base de données
  vers un type PHP équivalent.
* ``toDatabase``: Convertit la valeur spécifiée depuis un type PHP vers un type
  acceptable par la base de données.
* ``toStatement``: Convertit la valeur spécifiée vers son équivalent pour la
  Statement.
* ``marshal``: Transforme des données à plat en objets PHP.

Pour remplir l'interface basique, vous pouvez étendre
:php:class:`Cake\\Database\\Type`. Par exemple, si nous souhaitions ajouter un
type JSON, nous pourrions créer la classe de type suivante::

    // Dans src/Database/Type/JsonType.php

    namespace App\Database\Type;

    use Cake\Database\DriverInterface;
    use Cake\Database\Type\BaseType;
    use PDO;

    class JsonType extends BaseType
    {
        public function toPHP($value, DriverInterface $driver)
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

        public function toDatabase($value, DriverInterface $driver)
        {
            return json_encode($value);
        }

        public function toStatement($value, DriverInterface $driver)
        {
            if ($value === null) {
                return PDO::PARAM_NULL;
            }

            return PDO::PARAM_STR;
        }

    }

Par défaut, la méthode ``toStatement`` va traiter les valeurs en chaines qui
vont fonctionner pour notre nouveau type.

Connecter des Types Personnalisés à la Reflection et Génération de Schéma
-------------------------------------------------------------------------

Une fois que nous avons créé notre
nouveau type, nous avons besoin de l'ajouter dans la correspondance de type.
Pendant le bootstrap de notre application, nous devrions faire ce qui suit::

    use Cake\Database\TypeFactory;

    TypeFactory::map('json', 'App\Database\Type\JsonType');

Nous avons ensuite deux façons d'utiliser notre type dans nos modèles.

#. La première façon est d'écraser les données de schéma reflected pour utiliser
   notre nouveau type.
#. La deuxième est d'implémenter
   ``Cake\Database\Type\ColumnSchemaAwareInterface`` et de définir le type de
   colonne SQL et la logique de reflection.

Écraser le schéma reflected avec notre type personnalisé va activer dans la
couche de base de données de CakePHP la conversion automatique de nos données
JSON lors de la création de requêtes.
Dans votre :ref:`méthode getSchema() <saving-complex-types>` de
votre Table, ajoutez ceci::

    use Cake\Database\Schema\TableSchemaInterface;

    class WidgetsTable extends Table
    {
        public function getSchema(): TableSchemaInterface
        {
            $schema = parent::getSchema();
            $schema->setColumnType('widget_prefs', 'json');

            return $schema;
        }

    }

Le fait d'implémenter ``ColumnSchemaAwareInterface`` vous donne plus de contrôle
sur les types personnalisés Cela évite de réécrire les définitions de schéma si
votre type a une définition de colonne SQL ambiguë. Par exemple, notre type JSON
pourrait être utilisé pour chaque colonne ``TEXT`` ayant un commentaire
spécifique::

    // dans src/Database/Type/JsonType.php

    namespace App\Database\Type;

    use Cake\Database\DriverInterface;
    use Cake\Database\Type\BaseType;
    use Cake\Database\Type\ColumnSchemaAwareInterface;
    use Cake\Database\Schema\TableSchemaInterface;
    use PDO;

    class JsonType extends BaseType
        implements ColumnSchemaAwareInterface
    {
        // les autres méthodes d'avant

        /**
         * Convertit la définition de schéma abstrait en un code SQL spécifique
         * au pilote pouvant être utilisé dans une instruction CREATE TABLE.
         *
         * Returner null va faire retomber vers les types intégrés à CakePHP.
         */
        public function getColumnSql(
            TableSchemaInterface $schema,
            string $column,
            DriverInterface $driver
        ): ?string {
            $data = $schema->getColumn($column);
            $sql = $driver->quoteIdentifier($column);
            $sql .= ' JSON';
            if (isset($data['null']) && $data['null'] === false) {
                $sql .= ' NOT NULL';
            }

            return $sql;
        }

        /**
         * Convertit les données de la colonnes renvoyées par la reflection du
         * schéma en données abstraites de schéma.
         *
         * Returner null va faire retomber vers les types intégrés à CakePHP.
         */
        public function convertColumnDefinition(
            array $definition,
            DriverInterface $driver
        ): ?array {
            return [
                'type' => $this->_name,
                'length' => null,
            ];
        }

La donnée ``$definition`` passée à ``convertColumnDefinition()`` contiendra les
clés suivantes. Toutes les clés existeront mais seront susceptibles de contenir
``null`` si la clé n'a pas de valeur pour le pilote de base de données actuel:

- ``length`` La longueur d'une colonne, si disponible.
- ``precision`` La précision d'une colonne, si disponible.
- ``scale`` Peut être inclus pour les connexions SQLServer.

.. _mapping-custom-datatypes-to-sql-expressions:

Faire correspondre des types de données personnalisés aux expressions SQL
-------------------------------------------------------------------------

L'exemple précédent fait correspondre un type de données personnalisé pour une
colonne de type 'json' qui est facilement représenté sous la forme d'une chaîne de texte
dans une instruction SQL. Les types de données complexes ne peuvent pas être
représentées sous la forme de chaînes/entiers dans des requêtes SQL. Quand vous
travaillez avec ces types de données, votre class Type doit implémenter l'interface
``Cake\Database\Type\ExpressionTypeInterface``. Cette interface permet de
représenter une valeur de votre type de données personnalisé comme une expression SQL.
Comme exemple, nous allons construire une simple classe Type pour manipuler le type de
données ``POINT`` de MysQL. En premier lieu, nous allons définir un objet 'value' que nous
allons pouvoir utiliser pour représenter les données de ``POINT`` en PHP::

    // dans src/Database/Point.php
    namespace App\Database;

    // Notre objet de valeur est immuable.
    class Point
    {
        protected $_lat;
        protected $_long;

        // Méthode de fabrique.
        public static function parse($value)
        {
            // Analyse les données WKB de MySQL.
            $unpacked = unpack('x4/corder/Ltype/dlat/dlong', $value);

            return new static($unpacked['lat'], $unpacked['long']);
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
    use Cake\Database\DriverInterface;
    use Cake\Database\Expression\FunctionExpression;
    use Cake\Database\ExpressionInterface;
    use Cake\Database\Type\BaseType;
    use Cake\Database\Type\ExpressionTypeInterface;

    class PointType extends BaseType implements ExpressionTypeInterface
    {
        public function toPHP($value, DriverInterface $d)
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

        public function toExpression($value): ExpressionInterface
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
            // Manipulations d'autres cas.
        }

        public function toDatabase($value, DriverInterface $driver)
        {
            return $value;
        }
    }

La classe ci-dessus fait plusieurs choses intéressantes:

* La méthode ``toPHP`` se charge de convertir les résulats de la requête SQL en
  un objet 'value'.
* La méthode ``marshal`` se charge de convertir des données, comme celles de la
  requête, dans notre objet 'value'. Nous allons accepter des chaînes comme
  ``'10.24,12.34`` ainsi que des tableaux.
* La méthode ``toExpression`` se charge de convertir notre objet 'value' dans
  des expressions SQL équivalentes. Dans notre exemple, le SQL résultant devrait
  être quelque chose comme ``POINT(10.24, 12.34)``.

Une fois que nous avons construit notre type personnalisé, nous allons
:ref:`connecter notre type à notre classe de table <saving-complex-types>`.

.. _immutable-datetime-mapping:

Activer les Objets DateTime Immutables
--------------------------------------

Du fait que les objets Date/Time sont facilement mutables, CakePHP vous
permet d'activer des objets immutables. Le meilleur endroit pour cela est le
fichier **config/bootstrap.php** ::

    TypeFactory::build('datetime')->useImmutable();
    TypeFactory::build('date')->useImmutable();
    TypeFactory::build('time')->useImmutable();
    TypeFactory::build('timestamp')->useImmutable();

.. note::
    Dans les nouvelles applications, les objets immutables seront activés par
    défaut.

Classes de Connexion
====================

.. php:class:: Connection

Les classes de connexion fournissent une interface simple pour interagir avec
les connexions à la base de données de façon cohérente. Elles ont pour
objectif d'être une interface plus abstraite de la couche du pilote et de fournir
des fonctionnalités pour l'exécution des requêtes, le logging des requêtes, et
l'utilisation de transactions.

.. _database-queries:

Exécuter des Requêtes
---------------------

.. php:method:: query($sql)

Une fois que vous avez un objet de connexion, vous allez probablement vouloir réaliser
quelques requêtes avec. La couche d'abstraction de CakePHP fournit des
fonctionnalités par-dessus PDO et les pilotes natifs. Ces fonctionnalités
fournissent une interface similaire à PDO. Il y a plusieurs façons
de lancer les requêtes selon le type de requête que vous souhaitez et
selon le type de résultat que vous attendez en retour. La méthode la plus
basique est ``query()`` qui vous permet de lancer des requêtes SQL déjà
complètes::

    $statement = $connection->query('UPDATE articles SET published = 1 WHERE id = 2');

.. php:method:: execute($sql, $params, $types)

La méthode ``query`` n'accepte pas de paramètres supplémentaires. Si vous
avez besoin de paramètres supplémentaires, vous devrez utiliser la méthode
``execute()``, ce qui permet d'utiliser des placeholders::

    $statement = $connection->execute(
        'UPDATE articles SET published = ? WHERE id = ?',
        [1, 2]
    );

Sans aucun typage des informations, ``execute`` va supposer que tous les
placeholders sont des chaînes de texte. Si vous avez besoin de lier des types
de données spécifiques, vous pouvez utiliser leur nom de type abstrait lors
de la création d'une requête::

    $statement = $connection->execute(
        'UPDATE articles SET published_date = ? WHERE id = ?',
        [new DateTime('now'), 2],
        ['date', 'integer']
    );

.. php:method:: newQuery()

Cela vous permet d'utiliser des types de données riches dans vos applications
et de les convertir convenablement en instructions SQL. La dernière manière
de créer des requêtes, et la plus flexible, est d'utiliser le
:doc:`/orm/query-builder`.
Cette approche vous permet de construire des requêtes complexes et expressives
sans avoir à utiliser du SQL spécifique à la plateforme::

    $query = $connection->newQuery();
    $query->update('articles')
        ->set(['published' => true])
        ->where(['id' => 2]);
    $statement = $query->execute();

Quand vous utilisez le query builder, aucun SQL ne sera envoyé au serveur
de base de données jusqu'à ce que la méthode ``execute()`` soit appelée, ou
que la requête soit itérée. Itérer une requête va d'abord l'exécuter et ensuite
démarrer l'itération sur l'ensemble des résultats::

    $query = $connection->newQuery();
    $query->select('*')
        ->from('articles')
        ->where(['published' => true]);

    foreach ($query as $row) {
        // Faire quelque chose avec la ligne.
    }

.. note::

    Vous pouvez utiliser ``all()`` pour récupérer l'ensemble de résultats d'une
    requête SELECT à partir d'une instance de :php:class:`Cake\\ORM\\Query`.

Utiliser les Transactions
-------------------------

Les objets de connexion vous fournissent quelques moyens simples pour faire des
transactions sur la base de données. Le moyen le plus basique est d'utiliser les
méthodes ``begin``, ``commit`` et
``rollback``, qui correspondent à leurs équivalents SQL::

    $connection->begin();
    $connection->execute('UPDATE articles SET published = ? WHERE id = ?', [true, 2]);
    $connection->execute('UPDATE articles SET published = ? WHERE id = ?', [false, 4]);
    $connection->commit();

.. php:method:: transactional(callable $callback)

En plus de cette interface, les instances de connexion fournissent aussi la
méthode ``transactional()`` qui simplifie considérablement la gestion des appels
begin/commit/rollback::

    $connection->transactional(function ($connection) {
        $connection->execute('UPDATE articles SET published = ? WHERE id = ?', [true, 2]);
        $connection->execute('UPDATE articles SET published = ? WHERE id = ?', [false, 4]);
    });

En plus des requêtes basiques, vous pouvez exécuter des requêtes plus complexes
en utilisant soit le :doc:`/orm/query-builder`, soit :doc:`/orm/table-objects`. La
méthode transactionnelle fera les traitements suivants:

- Appel de ``begin``.
- Appelle la closure fournie.
- Si la closure lance une exception, un rollback sera délivré. L'exception
  originelle sera relancée.
- Si la closure retourne ``false``, un rollback sera délivré.
- Si la closure s'exécute avec succès, la transaction sera commitée.

Interagir avec les Requêtes
===========================

Lors de l'utilisation de l'API de plus bas niveau, vous rencontrerez souvent des
objets *statement*. Ces objets vous permettent de manipuler les
requêtes sous-jacentes préparées par le pilote. Après avoir créé et exécuté un objet
query, ou en utilisant ``execute()``, vous devriez avoir une instance
``StatementDecorator``. Elle enveloppe l'objet *statement* basique sous-jacent
et fournit quelques fonctionnalités supplémentaires.

Préparer une Statement
----------------------

Vous pouvez créer un objet *statement* en utilisant ``execute()``, ou
``prepare()``. La méthode ``execute()`` retourne une *statement* à laquelle sont
reliées les valeurs des paramètres. Tandis que ``prepare()`` retourne une *statement*
incomplète::

    // Les statements à partir de execute auront déjà des valeurs liées aux paramètres.
    $statement = $connection->execute(
        'SELECT * FROM articles WHERE published = ?',
        [true]
    );

    // Les statements à partir de prepare auront des placeholders pour les paramètres.
    // Vous avez besoin de lier les paramètres avant de tenter de les exécuter.
    $statement = $connection->prepare('SELECT * FROM articles WHERE published = ?');

Une fois que vous avez préparé une *statement*, vous pouvez lier les données
supplémentaires et l'exécuter.

.. _database-basics-binding-values:

Lier les Valeurs (Binding)
--------------------------

Une fois que vous avez créé une requête préparée, vous aurez probablement besoin de
lier des données supplémentaires. Vous pouvez lier plusieurs valeurs en une
fois en utilisant la méthode ``bind``, ou lier des éléments individuels
en utilisant ``bindValue``::

    $statement = $connection->prepare(
        'SELECT * FROM articles WHERE published = ? AND created > ?'
    );

    // Lier plusieurs valeurs
    $statement->bind(
        [true, new DateTime('2013-01-01')],
        ['boolean', 'date']
    );

    // Lier une valeur unique
    $statement->bindValue(1, true, 'boolean');
    $statement->bindValue(2, new DateTime('2013-01-01'), 'date');

Lors de la création de requêtes, vous pouvez aussi utiliser des tableaux
associatifs plutôt que des clés de position::

    $statement = $connection->prepare(
        'SELECT * FROM articles WHERE published = :published AND created > :created'
    );

    // Lier plusieurs valeurs
    $statement->bind(
        ['published' => true, 'created' => new DateTime('2013-01-01')],
        ['published' => 'boolean', 'created' => 'date']
    );

    // Lier une valeur unique
    $statement->bindValue('published', true, 'boolean');
    $statement->bindValue('created', new DateTime('2013-01-01'), 'date');

.. warning::

    Vous ne pouvez pas mixer les clés de position et les clés nommées dans la
    même requête.

Exécuter & Récupérer les Colonnes
---------------------------------

Après avoir préparé une requête et y avoir lié des données,
vous pouvez l'exécuter et récupérer les lignes. La requêtes devra être
exécutée en utilisant la méthode ``execute()``. Après l'avoir exécutée, vous
pouver récupérer les résultats en utilisant ``fetch()``, ``fetchAll()`` ou
en itérant sur la requête::

    $statement->execute();

    // Lire une ligne.
    $row = $statement->fetch('assoc');

    // Lire toutes les lignes.
    $rows = $statement->fetchAll('assoc');

    // Lire les lignes en faisant une itération.
    foreach ($statement as $row) {
        // Faire quelque chose
    }

.. note::

    Lire les lignes par itération va récupérer les lignes dans le mode
    'both'. Cela signifie que les résultats que vous aurez seront indexés à la fois
    numériquement et de manière associative.

Récupérer le Nombre de Lignes
-----------------------------

Après avoir exécuté une requête, vous pouvez récupérer le nombre de lignes
affectées::

    $rowCount = count($statement);
    $rowCount = $statement->rowCount();

Vérifier les Codes d'Erreur
---------------------------

Si votre requête a échoué, vous pouvez obtenir des informations sur l'erreur en
utilisant les méthodes ``errorCode()`` et ``errorInfo()``. Ces
méthodes fonctionnent de la même façon que celles fournies par PDO::

    $code = $statement->errorCode();
    $info = $statement->errorInfo();

.. _database-query-logging:

Générer des Logs de Requêtes
============================

Le logs de requêtes peuvent être activés lors de la configuration de votre
connexion en définissant l'option ``log`` à ``true``. Vous pouvez aussi changer le
log de requêtes à la volée, en utilisant ``enableQueryLogging``::

    // Active les logs des requêtes.
    $connection->enableQueryLogging(true);

    // Stoppe les logs des requêtes
    $connection->enableQueryLogging(false);

Quand les logs de requêtes sont activés, les requêtes sont loguées dans
:php:class:`Cake\\Log\\Log` en utilisant le niveau 'debug', et le scope
'queriesLog'. Vous aurez besoin d'avoir un logger configuré pour capter
ce niveau et ce scope. Faire des logs vers ``stderr`` peut être utile lorsque vous
travaillez sur les tests unitaires, et les logs de fichiers/syslog peuvent être
utiles lorsque vous travaillez avec des requêtes web::

    use Cake\Log\Log;

    // Logs vers la Console
    Log::setConfig('queries', [
        'className' => 'Console',
        'stream' => 'php://stderr',
        'scopes' => ['queriesLog']
    ]);

    // Logs vers des Fichiers
    Log::setConfig('queries', [
        'className' => 'File',
        'path' => LOGS,
        'file' => 'queries.log',
        'scopes' => ['queriesLog']
    ]);

.. note::

    Les logs des requêtes sont à utiliser seulement pour le
    débogage/développement. Vous ne devriez jamais laisser les logs de requêtes
    activés en production car cela va avoir un impact négatif sur les
    performances de votre application.

.. _identifier-quoting:

Échapper les Identificateurs
============================

Par défaut CakePHP **ne** quote **pas** les identificateurs dans les requêtes SQL
générées. La raison en est que l'ajout de quotes autour des identificateurs
a quelques inconvénients:

* Par-dessus tout la performance - Ajouter des quotes est bien plus lent et
  complexe que de ne pas le faire.
* Pas nécessaire dans la plupart des cas - Dans des bases de données récentes
  qui suivent les conventions de CakePHP, il n'y a pas de raison de quoter les
  identificateurs.

Si vous utilisez un schema datant un peu qui nécessite de quoter les
identificateurs, vous pouvez l'activer en utilisant le paramètre
``quoteIdentifiers`` dans votre :ref:`database-configuration`. Vous pouvez
aussi activer cette fonctionnalité à la volée::

    $connection->getDriver()->enableAutoQuoting();

Quand elle est activée, la fonctionnalité d'échappement va entraîner des
traversées supplémentaires de requêtes qui vont convertir tous les
identificateurs en objets ``IdentifierExpression``.

.. note::

    Les portions de code SQL contenues dans les objets QueryExpression ne seront
    pas modifiées.

.. _database-metadata-cache:

La Mise en Cache des Métadonnées
================================

L'ORM de CakePHP utilise la réflexivité des bases de données pour déterminer
le schéma, les index et les clés étrangères de votre application. Comme
ces méta-données changent peu fréquemment et qu'il peut être lourd d'y accéder,
elles sont habituellement mises en cache. Par défaut, les méta-données sont
stockées dans la configuration de cache ``_cake_model_``. Vous pouvez définir
une configuration de cache personnalisée en utilisant l'option
``cacheMetatdata`` dans la configuration de la source de données::

    'Datasources' => [
        'default' => [
            // Autres clés ici.

            // Utilise la config de cache 'orm_metadata' pour les méta-données.
            'cacheMetadata' => 'orm_metadata',
        ]
    ],

Vous pouvez aussi configurer le cache des méta-données à l'exécution avec la
méthode ``cacheMetadata()``::

    // Désactive le cache
    $connection->cacheMetadata(false);

    // Active le cache
    $connection->cacheMetadata(true);

    // Utilise une config de cache personnalisée
    $connection->cacheMetadata('orm_metadata');

CakePHP intègre aussi un outil CLI pour gérer les mises en cache de
méta-données.
Consultez le chapitre :doc:`/console-commands/schema-cache` pour plus
d'information.

Créer des Bases de Données
==========================

Si vous voulez créer une connexion sans sélectionner de base de
données, vous pouvez omettre le nom de la base de données::

    $dsn = 'mysql://root:password@localhost/';

Vous pouvez maintenant utiliser votre objet de connexion pour exécuter des
requêtes qui créent/modifient des bases de données. Par exemple pour créer une
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
