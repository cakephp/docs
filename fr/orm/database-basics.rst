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
            'className' => 'Cake\Database\Connection',
            'driver' => 'Cake\Database\Driver\Mysql',
            'persistent' => false,
            'host' => 'localhost',
            'login' => 'my_app',
            'password' => 'sekret',
            'database' => 'my_app',
            'prefix' => false,
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
        'className' => 'Cake\Database\Connection',
        'driver' => 'Cake\Database\Driver\Mysql',
        'persistent' => false,
        'host' => 'localhost',
        'login' => 'my_app',
        'password' => 'sekret',
        'database' => 'my_app',
        'prefix' => false,
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

Sans aucune typage des informations, ``execute`` va supposer que tous les
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
la plus flexible de créer des requêtes est d'utiliser :ref:`query-builder`.
Cette approche vous permet de construire des requêtes expressive complexes sans
avoir à utiliser une plateforme SQL spécifique::

    $query = $conn->newQuery();
    $query->update('posts')
        ->set(['publised' => true])
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

Les objets de connection vous fournissent quelques manières simples pour que
vous fassiez des transactions de base de données. La façon la plus basique de
faire des transactions est via les méthodes ``begin``, ``commit`` et
``rollback``, qui correspondent à leurs equivalents SQL::

    $conn->begin();
    $conn->execute('UPDATE posts SET published = ? WHERE id = ?', [true, 2]);
    $conn->execute('UPDATE posts SET published = ? WHERE id = ?', [false, 4]);
    $conn->commit();

.. php:method:: transactional(callable $callback)

En plus de cette interface, les instances de connection fournissent aussi la
méthode ``transactional`` ce qui simplifie la gestion des appels
begin/commit/rollback::

    $conn->transactional(function($conn) {
        $conn->execute('UPDATE posts SET published = ? WHERE id = ?', [true, 2]);
        $conn->execute('UPDATE posts SET published = ? WHERE id = ?', [false, 4]);
    });

En plus des requêtes basiques, vous pouvez executer des requêtes plus complexes
en utilisant soit :ref:`query-builder`, soit :ref:`table-objects`. La méthode
transactional fera ce qui suit:

- Appel de ``begin``.
- Appelle la fermeture fournie.
- Si la fermeture lance une exception, un rollback sera délivré. L'exception
  originelle sera relancée.
- Si la fermeture retourne ``false``, un rollback sera délivré.
- Si la fermeture s'exécute avec succès, la transaction sera réalisée.

Interagir avec les Requêtes
===========================

Lors de l'utilisation de bas niveau de l'API, vous rencontrerez souvent des
objets statement (requête). Ces objets vous permettent de manipuler les
requêtes préparées sous-jacentes du driver. Après avoir créé et executé un objet
query, ou en utilisant ``execute()``, vous devriez avoir une instance
``StatementDecorator``. Elle enveloppe l'objet statement basique sous-jacent
et fournit quelques fonctionnalités supplémentaires.

Préparer une Requête
--------------------

Vous pouvez créer un objet statement (requête) en utilisant ``execute()``, ou
``prepare()``. La méthode ``execute()`` retourne une requête avec les valeurs
fournies en les liant à lui. Alors que ``prepare()`` retourne une requête
incomplet::

    // Les requêtes à partir de execute auront des valeurs leur étant déjà liées.
    $stmt = $conn->execute(
        'SELECT * FROM articles WHERE published = ?',
        [true]
    );

    // Les Requêtes à partir de prepare seront des paramètres pour les placeholders.
    // Vous avez besoin de lier les paramètres avant d'essayer de l'executer.
    $stmt = $conn->prepare('SELECT * FROM articles WHERE published = ?');

Une fois que vous avez préparé une requête, vous pouvez lier les données
supplémentaires et l'executer.

Lier les Valeurs
----------------

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
    $stmt->bindValue(0, true, 'boolean');
    $stmt->bindValue(1, new DateTime('2013-01-01'), 'date');

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
vous pouvez l'executer et récupérer les lignes. Les requêtes devront être
executées en utilisant la méthode ``execute()``. Une fois executée, les
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

Après avoir executé une requête, vous pouvez récupérer le nombre de lignes
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

.. todo::
    Possibly document CallbackStatement and BufferedStatement

Logging de Query
================

Le logging de Query peut être activé lors de la configuration de votre
connection en définissant l'option ``log`` à true. Vous pouvez changer le
logging de query à la volée, en utlisant ``logQueries``::

    // Active le logging de query.
    $conn->logQueries(true);

    // Stoppe le logging de query
    $conn->logQueries(false);

Quand le logging de query est activé, les requêtes seront logged dans
:php:class:`Cake\\Log\\Log` en utilisant le niveau de 'debug', et le scope
de 'queriesLog'. Vous aurez besoin d'avoir un logger configuré pour capter
ces niveau & scope. Logging vers ``stderr`` peut être utile lorsque vous
travaillez sur les tests unitaires, et le logging de fichiers/syslog peut être
utile lorsque vous travaillez avec des requêtes web::

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

    Query logging est seulement à utiliser pour le debuggage/development. Vous
    ne devriez jamais laisser le query loggind activé en production puisque
    cela va avoir un impact négatif sur les performances de votre application.

.. _identifier-quoting:

Identifier Quoting
==================

Par défaut CakePHP **ne** quote pas les identifiers dans les requêtes SQL
générées. La raison pour ceci est que identifier quoting a quelques
inconvénients:

* Par dessus tout la Performance - Quoting identifiers est bien plus lent et
  complexe que de ne pas le faire.
* Pas nécessaire dans la plupart des cas - Dans des bases de données non-legacy
  qui suivent les conventions de CakePHP, il n'y a pas de raison de quoter les
  identifiers.

Si vous n'utilisez pas un schema legacy qui nécessite l'identifier quoting, vous
pouvez l'activer en utilisant le paramètre ``quoteIdentifiers`` dans votre
:ref:`database-configuration`. Vous pouvez aussi activer cette fonctionnalité
à la volée::

    $conn->quoteIdentifiers(true);

Quand elle est activée, l'identifier quoting va entrainer des requêtes
supplémentaires traversal qui convertissent tous les identifiers en objets
``IdentifierExpression``.

.. note::

    Les portions de code SQL contenues dans les objets QueryExpression ne seront
    pas modifiées.

