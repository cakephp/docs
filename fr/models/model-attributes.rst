Attributs de Model
##################

Les attributs de Model vous permettent de configurer les propriétés qui 
peuvent surcharger le behavior du model par défaut.

Pour une liste complète d'attributs du model et ses descriptions, visitez 
l'API de CakePHP. Allez voir 
`http://api20.cakephp.org/class/model <http://api20.cakephp.org/class/model>`_.

useDbConfig
===========

La propriété ``useDbConfig`` est une chaîne de caractère qui spécifie le nom 
de la connection à la base de données à utiliser pour lier votre classe model 
à la table de la base de données liée. Vous pouvez la configurer 
pour n'importe quelles connexions de base de données définies dans votre 
fichier de configuration database. Le fichier de configuration database 
est placé dans /app/Config/database.php.

La propriété ``useDbConfig`` est par défaut à la connection à la base de 
données 'default'.

Exemple d'utilisation:

::

    class Exemple extends AppModel {
        public $useDbConfig = 'alternate';
    }

useTable
========

La propriété ``useTable`` spécifie le nom de la table de la base de données. 
Par défaut, le model utilise le nom de classe du model en minuscule, au 
pluriel. Configurer cette attribut du nom d'une table alternative ou 
définissez le à ``false`` si vous souhaitez que le model utilise aucune table 
de la base de données.

Exemple d'utilisation::

    class Exemple extends AppModel {
        public $useTable = false; // Ce model n'utilise pas une table de la base de données
    }

Alternatively::

    class Exemple extends AppModel {
        public $useTable = 'exmp'; // Ce model utilise une table 'exmp' de la base de données
    }

tablePrefix
===========

Le nom du préfixe de la table utilisé pour le model. Le préfixe de la table 
est initialement configuré dans le fichier de connection à la base de données 
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
le nom du champ que le model utlilise en clé primaire. Ceci est courant 
quand on configure CakePHP pour utiliser une table d'une base de données 
existante.

Exemple d'utilisation::

    class Example extends AppModel {
        public $primaryKey = 'example_id'; // example_id est le nom du champ dans la base de données
    }
    

.. _model-displayField:

displayField
============

L'attribut ``displayField`` spécifie quel champ de la base de données doit 
être utilisé comme lable pour un enregistrement. Le label est utilisé 
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
attraper les modèles de données associés via les méthodes ``find()``, 
``findAll()`` et ``read()``.

Imaginez que votre application dispose de Groups qui appartiennent à un 
domain et ont plusieurs (many) Users qui à leur tour ont plusieurs (many) 
Articles. vous pouvez définir $recursive à différentes valeurs basées sur 
la quantité de données que vous souhaitez retourner à partir d'un appel 
$this->Group->find():

* -1 Cake récupère seulement les données de Group, pas de joins.
* 0  Cake récupère les données de Group et leur domain
* 1  Cake récupère Group, son domaine et ses Users associés
* 2  Cake récupère un Group, son domain, ses utilisateurs associés, et les
  Articles associés des Users

Ne le définissez pas à plus que vous n'avez besoin. Faire que CakePHP 
récupère des données dont vous n'aurez pas besoin va ralentir votre 
application inutilement. Notez aussi que par défaut le niveau de recursive 
est 1.

.. note::

    Si vous voulez combiner $recursive avec la fonctionnalité ``fields``,
    vous devrez ajouter les colonnes contenant les clés étrangères nécéssaires 
    au tableau ``fields`` manuellement. Dans l'exemple ci-dessus, ceci 
    pourrait signifier d'ajouter ``domain_id``.

.. tip::

    Le niveau de recursive recommandé pour votre application devrait être -1.
    Cela évite de récupérer des données liés dans les cas où ce n'est pas 
    nécéssaire ou même non souhaités. C'est le plus souvent le cas pour la 
    plupart de vos appels find().
    Augmenter le seulement quand cela est souhaité ou utilisez le Containable 
    behavior.

    Vous pouvez réaliser cela en l'ajoutant à AppModel::

        public $recursive = -1;

order
=====

L'ordre par défaut des donénes pour toute opération de type find. Les valeurs 
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
-  type (integer, string, datetime, etc.)
-  null
-  default value
-  length

Exemple d'utilisation::

    public $_schema = array(
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

    Il n'est pas nécéssaire d'appeler validate() avant save() puisque save() 
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

Dans les opérations ultérieures de find, vos résultats de User contiendraient 
une clé ``name`` avec le résultat de la concaténation. Il n'est pas conseillé 
de créer des champs virtuels avec les mêmes noms comme colonnes dans la base de 
données, ceci peut causer des erreurs de SQL.

Pour plus d'informations sur la propriété ``virtualFields``, son usage propre, 
ainsi que des limitations, regardez :doc:`/models/virtual-fields`.

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

Si défini à true, les données récupérées par le model pendant une requête 
unique est mise en cache. Cette mise en cache est seulement en mémoire, et 
dure seulement le temps de la requête. Toute requête dupliquée pour les 
mêmes données va être gérée par le cache.


.. meta::
    :title lang=fr: Attributs de Model
    :keywords lang=fr: alternate table,default model,database configuration,model example,database table,default database,model class,model behavior,class model,plural form,database connections,database connection,attribute,attributes,complete list,config,cakephp,api,class example
