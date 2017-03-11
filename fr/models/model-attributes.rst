Attributs de Model
##################

Les attributs de Model vous permettent de configurer les propriétés qui
peuvent surcharger le behavior du model par défaut.

Pour une liste complète d'attributs du model et ses descriptions, allez voir
`l'API de CakePHP <https://api.cakephp.org/2.x/class-Model.html>`_.

useDbConfig
===========

La propriété ``useDbConfig`` est une chaîne de caractère qui spécifie le nom
de la connexion à la base de données à utiliser pour lier votre classe model
à la table de la base de données liée. Vous pouvez la configurer
pour n'importe quelles connexions de base de données définies dans votre
fichier de configuration database. Le fichier de configuration database
est placé dans /app/Config/database.php.

La propriété ``useDbConfig`` est par défaut la connexion à la base de
données 'default'.

Exemple d'utilisation::

    class Exemple extends AppModel {
        public $useDbConfig = 'alternate';
    }

useTable
========

La propriété ``useTable`` spécifie le nom de la table de la base de données.
Par défaut, le model utilise le nom de classe du model en minuscule, au
pluriel. Configurez cette attribut du nom d'une table alternative ou
définissez le à ``false`` si vous souhaitez que le model n'utilise aucune table
de la base de données.

Exemple d'utilisation::

    class Exemple extends AppModel {
        public $useTable = false; // Ce model n'utilise pas une table de la base de données
    }

Alternative::

    class Exemple extends AppModel {
        public $useTable = 'exmp'; // Ce model utilise une table 'exmp' de la base de données
    }

tablePrefix
===========

Le nom du préfixe de la table utilisé pour le model. Le préfixe de la table
est initialement configuré dans le fichier de connexion à la base de données
dans /app/Config/database.php. Par défaut il n'y a pas de prefix. Vous pouvez
écraser la valeur par défaut en configurant l'attribut ``tablePrefix`` dans le
model.

Exemple d'utilisation::

    class Example extends AppModel {
        public $tablePrefix = 'alternate_'; // va regarder 'alternate_examples'
    }

.. _model-primaryKey:

primaryKey
==========

Chaque table a normalement une clé primaire, ``id``. Vous pouvez changer
le nom du champ que le model utilise en clé primaire. Ceci est courant
quand on configure CakePHP pour utiliser une table d'une base de données
existante.

Exemple d'utilisation::

    class Example extends AppModel {
        public $primaryKey = 'example_id'; // example_id est le nom du champ dans la base de données
    }


.. _model-displayField:

displayField
============

L'attribut ``displayField`` spécifie le champ de la base de données qui doit
être utilisé comme label pour un enregistrement. Le label est utilisé
dans le scaffolding et dans les appels avec ``find('list')``. Le model va
utiliser ``name`` ou ``title``, par défaut.

Par exemple, pour utiliser le champ ``username``::

    class User extends AppModel {
        public $displayField = 'username';
    }

Les noms de champ multiple ne peuvent pas être combinés en un champ
unique d'affichage. Par exemple, vous ne pouvez pas spécifier
``array('first_name', 'last_name')`` en champ à afficher. A la place,
créez un champ virtuel avec l'attribut de Model virtualFields

recursive
=========

La propriété recursive définit la profondeur à laquelle CakePHP doit aller
attraper les models de données associés via les méthodes ``find()``,
``findAll()`` et ``read()``.

Imaginez que votre application dispose de Groups qui appartiennent à un
Domain et ont plusieurs (many) Users qui à leur tour ont plusieurs (many)
Articles. vous pouvez définir $recursive à différentes valeurs basées sur
la quantité de données que vous souhaitez retourner à partir d'un appel
$this->Group->find():

* -1 CakePHP récupère seulement les données de Group, pas de jointures.
* 0  CakePHP récupère les données de Group et leur Domain.
* 1  CakePHP récupère Group, son domaine et ses Users associés.
* 2  CakePHP récupère un Group, son domain, ses Users associés, et les
  Articles associés des Users.

Ne le définissez pas à plus que vous n'avez besoin. Faire que CakePHP
récupère des données dont vous n'aurez pas besoin va ralentir votre
application inutilement. Notez aussi que par défaut le niveau de recursive
est 1.

.. note::

    Si vous voulez combiner $recursive avec la fonctionnalité ``fields``,
    vous devrez ajouter les colonnes contenant les clés étrangères nécessaires
    au tableau ``fields`` manuellement. Dans l'exemple ci-dessus, ceci
    pourrait signifier d'ajouter ``domain_id``.

Le niveau de recursive recommandé pour votre application devrait être -1.
Cela évite de récupérer des données liées dans les cas où ce n'est pas
nécessaire ou même non souhaité. C'est le plus souvent le cas pour la
plupart de vos appels find().
Augmenter le seulement quand cela est souhaité ou utilisez le behavior
Containable.

Vous pouvez réaliser cela en l'ajoutant à AppModel::

    public $recursive = -1;

Si vous utilisez les events dans votre système, utiliser la valeur -1 pour
recursive va désactiver tous les events du model associé. Ceci se passe car
aucune relation n'est créée quand la valeur est définie à -1.

order
=====

L'ordre par défaut des données pour toute opération de type find. Les valeurs
possibles incluent::

    $order = "field"
    $order = "Model.field";
    $order = "Model.field asc";
    $order = "Model.field ASC";
    $order = "Model.field DESC";
    $order = array("Model.field" => "asc", "Model.field2" => "DESC");

data
====

Le contenu pour les données attrapées pour le model. Alors que les
données retournées d'une classe de model sont normalement utilisées
à partir d'un appel de find(), vous pourriez avoir besoin d'accéder
aux informations stockées dans $data à l'intérieur des callbacks du
model.

\_schema
========

Contient les metadata décrivant les champs de la table de la base de données
du model. Chaque champ est décrit par:

-  name
-  type

Les types supportés par CakePHP sont:

string
    Généralement construit en colonnes CHAR ou VARCHAR. Dans SQL Server, les
    types NCHAR et NVARCHAR sont utilisés.
text
    Correspond aux types TEXT et MONEY.
uuid
    Correspond au type UUID si une base de données en fournit un, sinon cela
    générera un champ CHAR(36).
integer
    Correspond aux types INTEGER et SMALLINT fournis par la base de données.
biginteger
    Correspond au type BIGINT fourni par la base de données.
decimal
    Correspond aux types DECIMAL et NUMERIC.
float
    Correspond aux types REAL et DOUBLE PRECISION.
boolean
    Correspond au BOOLEAN sauf pour MySQL, où TINYINT(1) est utilisé pour
    représenter les booléens.
binary
    Correspond aux types BLOB ou BYTEA fournis par la base de données.
date
    Correspond au type de colonne DATE sans timezone.
datetime
    Correspond au type de colonne DATETIME sans timezone. Dans PostgreSQL et SQL
    Server, ceci retourne un type TIMESTAMP ou TIMESTAMPTZ.
timestamp
    Correspond au type TIMESTAMP.
time
    Correspond au type TIME dans toutes les bases de données.

-  null
-  default value
-  length

Exemple d'utilisation::

    protected $_schema = array(
        'first_name' => array(
            'type' => 'string',
            'length' => 30
        ),
        'last_name' => array(
            'type' => 'string',
            'length' => 30
        ),
        'email' => array(
            'type' => 'string',
            'length' => 30
        ),
        'message' => array('type' => 'text')
    );

validate
========

Cet attribut maintient les règles qui permettent au model de
faire des décisions de validation de données avant la sauvegarde.
Les clés nommées selon les champs maintient les valeurs regex
autorisant le model à essayer de faire des correspondances.

.. note::

    Il n'est pas nécessaire d'appeler validate() avant save() puisque save()
    va automatiquement valider vos données avant d'effectivement les
    sauvegarder.

Pour plus d'informations sur la validation, regardez la section suivante
:doc:`/models/data-validation` du manuel.

virtualFields
=============

Tableau de champs virtuels que le model a. Les champs virtuels sont des alias
des expressions SQL. Les champs ajoutés à cette propriété vont être lus comme
d'autres champs dans un model mais ne seront pas sauvegardables.

Exemple d'utilisation pour MySQL::

    public $virtualFields = array(
        'name' => "CONCAT(User.first_name, ' ', User.last_name)"
    );

Dans les opérations ultérieures de find, vos résultats de User contiendront
une clé ``name`` avec le résultat de la concaténation. Il n'est pas conseillé
de créer des champs virtuels avec les mêmes noms comme colonnes dans la base de
données, ceci peut causer des erreurs SQL.

Pour plus d'informations sur la propriété ``virtualFields``, son usage propre,
ainsi que des limitations, regardez les :doc:`/models/virtual-fields`.

name
====

Nom du model. Si vous ne le spécifiez pas dans votre fichier model,
il sera défini automatiquement selon le nom de la classe par le
constructeur.

Exemple d'utilisation::

    class Exemple extends AppModel {
        public $name = 'Exemple';
    }

cacheQueries
============

Si définie à true, les données récupérées par le model pendant une requête
unique sont mises en cache. Cette mise en cache est seulement en mémoire, et
dure seulement le temps de la requête. Toute requête dupliquée pour les
mêmes données va être gérée par le cache.


.. meta::
    :title lang=fr: Attributs de Model
    :keywords lang=fr: alternate table,default model,database configuration,model example,database table,default database,model class,model behavior,class model,plural form,database connections,database connection,attribute,attributes,complete list,config,cakephp,api,class example
