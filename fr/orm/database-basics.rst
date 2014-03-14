Database Basics
###############

.. php:namespace:: Cake\Database

L'ORM et l'accès à la base de données dans CakePHP a été totalement reconstruit
pour 3.0. Il amène une nouvelle API pour la construction des requêtes, améliore
le schéma reflection/génération, un type de système flexible et plus.

.. _database-configuration:

Configuration
=============

Par convention, les connections de la base de données sont configurées dans
``App/Config/app.php``. L'information de la connection définie dans ce fichier
se trouve dans :php:class:`Cake\\Database\\ConnectionManager` en créant la
configuration de la connection de votre application sera utilisée. L'information
de la connection d'Exemple peut être trouvé dans ``App/Config/app.default.php``.
Une configuration de connection d'exemple ressemblera à ceci::

    'Datasources' => [
        'default' => [
            'className' => 'Mysql',
            'database' => 'my_app',
            'login' => 'my_app',
            'password' => 'sekret',
            'host' => 'localhost',
            'encoding' => 'utf8',
            'timezone' => 'UTC'
        ]
    ],

Ce qui est au-dessus va créer une connection 'default', avec les paramètres
fournies. Vous pouvez définir autant de connections que vous le souhaitez dans
votre fichier de configuration. Vous pouvez aussi définir le connections
supplémentaires à la volée en utilisant
:php:meth:`Cake\\Database\\ConnectionManager::config()`. Un exemple de ceci
serait::

    use Cake\Database\ConnectionManager;

    ConnectionManager::config('default', [
        'className' => 'Mysql',
        'database' => 'my_app',
        'login' => 'my_app',
        'password' => 'sekret',
        'host' => 'localhost',
        'encoding' => 'utf8',
        'timezone' => 'UTC'
    ]);

Par défaut, tous les objets Table vont utiliser la connection ``default``. Pour
utiliser une connection non-default, regardez
:ref:`configuring-table-connections`.

Il y a un certain nombre de clés supportés dans la configuration de la base
de données. Une liste complète est comme suit:

className
    Le nom de la classe du driver utilisée pour faire fonctionner la connection.
    Ceci peut être soit un nom de classe court en utilisant
    :term:`plugin syntax`, un nom complet en namespace, soit être une instance
    de driver construite. Les exemples de noms de classe court sont Mysql,
    Sqlite, Postgres, et Sqlserver.
persistent
    S'il faut utiliser ou non une connection persistente à la base de données.
host
    Le nom d'hôte du serveur de base de données (ou une adresse IP).
login
    L'username pour votre compte.
password
    Le mot de passe pour le compte.
database
    Le nom de la base de données pour cette connection à utiliser.
port (*optional*)
    Le port TCP ou le socket Unix utilisé pour se connecter au serveur.
encoding
    Indique le character set à utiliser lors de l'envoi de statements SQL au
    serveur. Ceci est par défaut à l'encodage par défaut de la base de données
    pout toutes les bases de données autres que DB2. Si vous souhaitez utiliser
    l'encodage UTF-8 avec les connections mysql/mysqli, vous devez utiliser
    'utf8' sans trait d'union.
timezone
    La définition du timezone du Serveur.
schema
    Utilisé dans la base de données dans les configurations de la base de
    données PostgreSQL pour spécifier le schema à utiliser.
unix_socket
    Utilisé par les drivers qui le supportent pour se connecter via les fichiers
    socket Unix. Si vous utilisez Postgres et voulez utiliser les sockets Unix,
    laissez clé host vide.
ssl_key
    Le chemin du fichier vers la clé du fichier SSL. (supporté seulement par MySQL).
ssl_cert
    Le chemin du fichier vers le fichier du certificat SSL. (supporté seulement par MySQL).
ssl_ca
    Le chemin du fichier vers l'autorité de certification SSL. (supporté seulement par MySQL).
init
    Une liste de requêtes qui doivent être envoyées au serveur de la base de
    données lorsque la connection est créée. Cette options est seulement
    supportée seuelemement par le Serveur MySQL, Postgres, et SQL cette fois-ci.
dsn
    Un nom de source de données compatible totalement avec PDO.
log
    Défini à true pour activer les logs des requêtes. Quand les requêtes sont
    activées, elles seront écrites à un niveau ``debug`` avec le scope
    ``queriesLog``.
quoteIdentifiers
    Défini à true si vous utilisez les mots réservés ou les caractères spéciaux
    avec les noms de votre table ou les noms de colonnes. Activer cette
    configuration va entraîner la construction des requêtes en utilisant
    :ref:`query-builder` avec les identifiers quotés lors de la création de SQL.
    Cela devrait être noté que ceci diminue la performance parce que chaque
    requête a besoin d'être traversée et manipulée avant d'être executée.
flags
    Un tableau associatif de constantes PDO qui doivent être passées
    à l'instance PDO soulignée. Regardez la documentation de PDO pour les flags
    supportés par le driver que vous utilisez.

A ce moment-là, vous pouvez aller voir
:doc:`/getting-started/cakephp-conventions`. Le nommage correct pour vos
tables (et l'ajout de quelques colonnes) peut vous faire gagner une
fonctionnalité gratuite et vous aider à éviter la configuration. Par
exemple, si vous nommez votre table de base de données big\_boxes, votre table
BigBoxesTable, et votre controller BigBoxesController, tout fonctionnera
ensemble automatiquement. Par convention, utiliser les underscores, les
minuscules et les formes pluriels pour vos noms de table de la base de données
) par exemple: bakers, pastry\_stores, et savory\_cakes.


Gérer les Connections
=====================

.. php:class:: ConnectionManager

La classe ``ConnectionManager`` agit comme un registry pour accéder aux
connections à base de données que votre application fait. Elle fournit un
endroit où les autres objets peuvent obtenir des références à des connections
existantes.

Accéder à des Connections
-------------------------

.. php:staticmethod:: get($name)

Une fois configurées, les connections peuvent être récupérées en utilisant
:php:meth:`Cake\\Database\\ConnectionManager::get()`. Cette méthode va
construire et charger une connection si elle n'a pas été déjà construite
avant, ou retourner la connextion connue existante::

    use Cake\Database\ConnectionManager;

    $conn = ConnectionManager::get('default');

La tentative de chargement de connections qui n'existent pas va lancer une
exception.

Créer des Connections à l'execution
-----------------------------------

.. php:staticmethod:: create($name, $config)

La méthode ``create`` vous permet de définir des nouvelles connections qui
ne sont pas définies dans vos fichiers de configuration à l'execution::

    $conn = ConnectionManager::create('my_connection', $config);

Regarder :ref:`database-configuration` pour plus d'informations sur la
configuration de données utilisée lors de la création de connections.


.. _database-data-types:

Types de Données
================

.. php:class:: Type

Puisque tout vendor de base de données n'inclut pas la même définition des types
de données, ou les mêmes noms pour des types de données similaires, CakePHP
fournit un ensemble de types de données abstraites à utiliser avec la
couche de la base de données. Les types que CakePHP supporte sont:

string
    Généralement backed by CHAR or VARCHAR columns. Utiliser l'option ``fixed``
    va forcer une colonne CHAR.
text
    Maps vers les types TEXT
uuid
    Maps vers le type UUID si une base de données en fournit un, sinon cela
    générera un champ CHAR(36).
integer
    Maps vers le type INTEGER fourni par la base de données.
biginteger
    Maps vers le type BIGINT fourni par la base de données.
float
    Maps soit vers DOUBLE, soit vers FLOAT selon la base de données.
    L'option ``precision`` peut être utilisée pour définir la précision utilisée.
decimal
    Maps vers le type DECIMAL. Supporte les options ``length`` et  ``precision``.
boolean
    Maps vers BOOLEAN à part pour MySQL, où TINYINT(1) est utilisé pour
    représenter les boléens.
binary
    Maps vers le type BLOB ou BYTEA fourni par la base de données.
date
    Maps vers un type de colonne DATE sans timezone.
datetime
    Maps vers un type de colonne DATETIME sans timezone. Dans postgres, ceci
    retourne un type TIMESTAMP.
timestamp
    Maps vers le type TIMESTAMP.
time
    Maps vers un type TIME dans toutes les bases de données.

Ces types sont utilisés pour les fonctionnalités de reflection de schema que
CakePHP fournit, et les fonctionnalités de génération de schema que CakePHP
utilise lors des fixtures de test.

Chaque type peut aussi fournir des fonctions de traduction entre les
représentations PHP et SQL. Ces méthodes sont invoquées selon le type hints
fourni lorsque les queries sont faites. Par exemple une colonne qui est marquée
en 'datetime' va automatiquement convertir les paramètres d'input d'instances
``DateTime`` en timestamp ou chaines de dates formatées. Egalement, les
colonnes 'binary' vont accepter un fichier qui gère, et génère le fichier lors
de la lecture des données.

Ajouter des types personnalisés
-------------------------------

.. php:staticmethod:: map($name, $class)

Si vous avez besoin d'utiliser des types de vendor spécifiques qui ne sont pas
construit dans CakePHP, vous pouvez ajouter des nouveaux types supplémentaires
au système de type de CakePHP. Ces classes de type s'attendent à implémenter
les méthodes suivantes:

* toPHP
* toDatabase
* toStatement

Une façon facile de remplir l'interface basique est d'étendre
:php:class:`Cake\Database\Type`. Par exemple, si vous souhaitez ajouter un type
JSON, nous pourrions faire la classe type suivante::

    namespace App\Database\Type;

    use Cake\Database\Driver;
    use Cake\Database\Type;

    class JsonType extends Type {

        public function toPHP($value, Driver $driver) {
            if ($value === null) {
                return null;
            }
            return json_decode($value, true);
        }

        public function toDatabase($value, Driver $driver) {
            return json_encode($value);
        }

    }

Par défaut, la méthode ``toStatement`` va traiter les valeurs en chaines qui
vont fonctionner pour notre nouveau type. Une fois que nous avons créé notre
nouveau type, nous avons besoin de l'ajouter dans le mapping de type. Pendant
le bootstrap de notre application, nous devrions faire ce qui suit::

    use Cake\Database\Type;

    Type::map('json', 'App\Database\Type\JsonType');

Nous pouvons ensuite surcharger les données de schema reflected pour utiliser
notre nouveau type, et la couche de base de données de CakePHP va
automatiquement convertir notre données JSON lors de la création de queries.

Les Classes de Connection
=========================

.. php:class:: Connection

Les classes de Connection fournissent une interface simple pour intéragir avec
les connections à la base de données d'une façon pratique. Elles ont pour
objectif d'être une interface plus abstraite à la couche de driver et de fournir
des fonctionnalités pour l'execution des queries, le logging des queries, et
de faire des opérations transactionnelles.

.. _database-queries:

L'execution de Queries
----------------------

.. php:method:: query($sql)

Une fois que vous avez un objet connection, vous voudrez probablement réaliser
quelques queries avec. La couche d'abstraction de CakePHP fournit des
fonctionnalités de wrapper au-dessus de PDO et des drivers natifs. Ces wrappers
fournissent une interface similaire à PDO. Il y a quelques différentes façons
de lancer les queries selon le type de query que vous souhaitez lancer et
selon le type de résultats que vous souhaitez en retour. La méthode la plus
basique est ``query()`` qui vous permet de lancer des queries SQL déjà complètes::

    $stmt = $conn->query('UPDATE posts SET published = 1 WHERE id = 2');

.. php:method:: execute($sql, $params, $types)

La méthode ``query`` ne permet pas des paramètres supplémentaires. Si vous
avez besoin de paramètres supplémentaires, vous devriez utiliser la méthode
``execute()``, ce qui permet aux placeholders d'être utilisés::

    $stmt = $conn->execute(
        'UPDATE posts SET published = ? WHERE id = ?',
        [1, 2]
    );

Without any type hinting information, ``execute`` will assume all placeholders
are string values. If you need to bind specific types of data, you can use their
abstract type names when creating a query::

    $stmt = $conn->execute(
        'UPDATE posts SET published_date = ? WHERE id = ?',
        [new DateTime('now'), 2],
        ['date', 'integer']
    );

.. php:method:: newQuery()

This allows you to use rich data types in your applications and properly convert
them into SQL statements. The last and most flexible way of creating queries is
to use the :ref:`query-builder`. This apporach allows you to build complex and
expressive queries without having to use platform specific SQL::

    $query = $conn->newQuery();
    $query->update('posts')
        ->set(['publised' => true])
        ->where(['id' => 2]);
    $stmt = $query->execute();

When using the query builder, no SQL will be sent to the database server until
the ``execute()`` method is called, or the query is iterated. Iterating a query
will first execute it and then start iterating over the result set::

    $query = $conn->newQuery();
    $query->select('*')
        ->from('posts')
        ->where(['published' => true]);

    foreach ($query as $row) {
        // Do something with the row.
    }

.. note::

    When you have an instance of :php:class:`Cake\\ORM\\Query` you can use
    ``all()`` to get the result set for SELECT queries.

Using Transactions
-------------------

The connection objects provide you a few simple ways you do database
transactions. The most basic way of doing transactions is through the ``begin``,
``commit`` and ``rollback`` methods, which map to their SQL equivalents::

    $conn->begin();
    $conn->execute('UPDATE posts SET published = ? WHERE id = ?', [true, 2]);
    $conn->execute('UPDATE posts SET published = ? WHERE id = ?', [false, 4]);
    $conn->commit();

.. php:method:: transactional(callable $callback)

In addition to this interface connection instances also provide the
``transactional`` method which makes handling the begin/commit/rollback calls
much simpler::

    $conn->transactional(function($conn) {
        $conn->execute('UPDATE posts SET published = ? WHERE id = ?', [true, 2]);
        $conn->execute('UPDATE posts SET published = ? WHERE id = ?', [false, 4]);
    });

In addition to basic queries, you can execute more complex queries using either
the :ref:`query-builder` or :ref:`table-objects`. The transactional method will
do the following:

- Call ``begin``.
- Call the provided closure.
- If the closure raises an exception, a rollback will be issued. The original
  exception will be re-thrown.
- If the closure returns ``false``, a rollback will be issued.
- If the closure executes successfully, the transaction will be committed.

Interacting with Statements
===========================

When using the lower level database API, you will often encounter statement
objects. These objects allow you to manipulate the underlying prepared statement
from the driver. After creating and executing a query object, or using
``execute()`` you will have a ``StatementDecorator`` instance. It wraps the
underlying basic statement object and provides a few additional features.

Preparing a Statement
---------------------

You can create a statement object using ``execute()``, or ``prepare()``. The
``execute()`` method returns a statement with the provided values bound to it. While
``prepare()`` returns an incomplete statement::

    // Statements from execute will have values bound to them already.
    $stmt = $conn->execute(
        'SELECT * FROM articles WHERE published = ?',
        [true]
    );

    // Statements from prepare will be parameters for placeholders.
    // You need to bind parameters before attempting to execute it.
    $stmt = $conn->prepare('SELECT * FROM articles WHERE published = ?');

Once you've prepared a statement you can bind additional data and execute it.

Binding Values
--------------

Once you've created a prepared statement, you may need to bind additional data.
You can bind multiple values at once using the ``bind`` method, or bind
individual elements using ``bindValue``::

    $stmt = $conn->prepare(
        'SELECT * FROM articles WHERE published = ? AND created > ?'
    );

    // Bind multiple values
    $stmt->bind(
        [true, new DateTime('2013-01-01')],
        ['boolean', 'date']
    );

    // Bind a single value
    $stmt->bindValue(0, true, 'boolean');
    $stmt->bindValue(1, new DateTime('2013-01-01'), 'date');

When creating statements you can also use named array keys instead of
positional ones::

    $stmt = $conn->prepare(
        'SELECT * FROM articles WHERE published = :published AND created > :created'
    );

    // Bind multiple values
    $stmt->bind(
        ['published' => true, 'created' => new DateTime('2013-01-01')],
        ['published' => 'boolean', 'created' => 'date']
    );

    // Bind a single value
    $stmt->bindValue('published', true, 'boolean');
    $stmt->bindValue('created', new DateTime('2013-01-01'), 'date');

.. warning::

    You cannot mix positional and named array keys in the same statement.

Executing & Fetching Rows
-------------------------

After preparing a statement and binding data to it, you can execute it and fetch
rows. Statements should be executed using the ``execute()`` method. Once
executed, results can be fetched using ``fetch()``, ``fetchAll()`` or iterating
the statement::

    $stmt->execute();

    // Read one row.
    $row = $stmt->fetch('assoc');

    // Read all rows.
    $rows = $stmt->fetchAll('assoc');

    // Read rows through iteration.
    foreach ($stmt as $row) {
        // Do work
    }

.. note::

    Reading rows through iteration will fetch rows in 'both' mode. This means
    you will get both the numerically indexed and associatively indexed results.


Getting Row Counts
------------------

After executing a statement, you can fetch the number of affected rows::

    $rowCount = count($stmt);
    $rowCount = $stmt->rowCount();


Checking Error Codes
--------------------

If your query was not successful, you can get related error information
using the ``errorCode()`` and ``errorInfo()`` methods. These methods work the
same way as the ones provided by PDO::

    $code = $stmt->errorCode();
    $info = $stmt->errorInfo();

.. todo::
    Possibly document CallbackStatement and BufferedStatement

Query Logging
=============

Query logging can be enabled when configuring your connection by setting the
``log`` option to true. You can also toggle query logging at runtime, using
``logQueries``::

    // Turn query logging on.
    $conn->logQueries(true);

    // Turn query logging off
    $conn->logQueries(false);

When query logging is enabled, queries will be logged to
:php:class:`Cake\\Log\\Log` using the 'debug' level, and the 'queriesLog' scope.
You will need to have a logger configured to capture this level & scope. Logging
to ``stderr`` can be useful when working on unit tests, and logging to
files/syslog can be useful when working with web requests::

    use Cake\Log\Log;

    // Console logging
    Log::config('queries', [
        'className' => 'Console',
        'stream' => 'php://stderr',
        'scopes' => ['queriesLog']
    ]);

    // File logging
    Log::config('queries', [
        'className' => 'File',
        'file' => 'queries.log',
        'scopes' => ['queriesLog']
    ]);

.. note::

    Query logging is only intended for debugging/development uses. You should
    never leave query logging on in production as it will negatively impact the
    performance of your application.

.. _identifier-quoting:

Identifier Quoting
==================

By default CakePHP does **not** quote identifiers in generated SQL queries. The
reason for this is identifier quoting has a few drawbacks:

* Performance overhead - Quoting identifiers is much slower and complex than not doing it.
* Not necessary in most cases - In non-legacy databases that follow CakePHP's
  conventions there is no reason to quote identifiers.

If you are using a legacy schema that requires identifier quoting you can enable
it using the ``quoteIdentifiers`` setting in your
:ref:`database-configuration`. You can also enable this feature at runtime::

    $conn->quoteIdentifiers(true);

When enabled, identifier quoting will cause additional query traversal that
converts all identifiers into ``IdentifierExpression`` objects.

.. note::

    SQL snippets contained in QueryExpression objects will not be modified.

