Champs virtuels
###############

Les champs virtuels vous permettent de créer des expressions SQL arbitraires et
de les assigner à des champs dans un Model. Ces champs ne peuvent pas être
sauvegardés, mais seront traités comme les autres champs du model pour les
opérations de lecture. Ils seront indexés sous la clé du model à travers les
autres champs du model.

Créer des champs virtuels
=========================

Créer des champs virtuels est facile. Dans chaque model, vous pouvez définir
une propriété ``$virtualFields`` qui contient un tableau de champ =>
expressions. Un exemple d'une définition de champ virtuel en utilisant MySQL
serait::

    public $virtualFields = array(
        'nom' => 'CONCAT(User.prenom, " ", User.nom_famille)'
    );

et avec PostgreSQL::

    public $virtualFields = array(
        'nom' => 'User.prenom || \' \' || User.nom_famille'
    );

Par conséquent, avec les opérations find, les résultats de l'User
contiendraient une clé ``nom`` avec le résultat de la concaténation. Il
n'est pas conseillé de créer des champs virtuels avec les mêmes noms que
les colonnes sur la base de données, car cela peut provoquer des erreurs SQL.

Il n'est pas toujours utile d'avoir **User.prenom** complètement
qualifié. Si vous ne suivez pas la convention (ex: vous avez des relations
multiples avec d'autres tables) cela entrainera une erreur. Dans ce cas,
il est parfois préférable de juste utiliser ``prenom || \'\' || nom`` sans
le nom du Model.

Utiliser les champs virtuels
============================

Créer des champs virtuels est simple et facile, interagir avec les
champs virtuels peut être fait à travers diverses méthodes.

Model::hasField()
-----------------

Model::hasField() retournera true si le model a un champ concret passé en
premier paramètre. En définissant le second paramètre de `hasField()` à true,
les champs virtuels seront aussi vérifiés quand on vérifiera si le model a
un champ.
En utilisant le champ exemple ci-dessus::

    $this->User->hasField('nom'); // Retournera false, puisqu'il n'y a pas de champ concret appelé nom.
    $this->User->hasField('nom', true); // Retournera true puisqu'il y a un champ virtuel appelé nom.

Model::isVirtualField()
-----------------------

Cette méthode peut être utilisée pour vérifier si un champ/colonne est un champ
virtuel ou un champ concret. Retournera true si la colonne est virtuelle::

    $this->User->isVirtualField('nom'); //true
    $this->User->isVirtualField('prenom'); //false

Model::getVirtualField()
------------------------

Cette méthode peut être utilisée pour accéder aux expressions SQL qui
contiennent un champ virtuel. Si aucun argument n'est fourni, il retournera
tout champ virtuel dans un Model::

    $this->User->getVirtualField('nom'); //retoune 'CONCAT(User.prenom, ' ', User.nom_famille)'

Model::find() et virtual fields
-------------------------------

Comme écrit précédemment, ``Model::find()`` traitera les champs virtuels un peu
comme tout autre champ dans un model. La valeur du champ virtuel sera placée
sous la clé du model dans l'ensemble de résultats::

    $results = $this->User->find('first');

    // les résultats contiennent le tableau suivant
    array(
        'User' => array(
            'prenom' => 'Mark',
            'nom_famille' => 'Story',
            'nom' => 'Mark Story',
            //plus de champs.
        )
    );

Pagination et champs virtuels
-----------------------------

Puisque que les champs virtuels se comportent un peu plus comme des champs
réguliers quand on fait des find, ``Controller::paginate()`` sera aussi
capable de trier selon les champs virtuels.

Champs virtuels et alias de models
==================================

Quand on utilise les champs virtuels et les models avec des alias qui ne sont
pas les mêmes que leur nom, on peut se retrouver avec des problèmes
comme des champs virtuels qui ne se mettent pas à jour pour refléter l'alias
lié. Si vous utilisez les champs virtuels dans les models qui ont plus d'un
alias, il est mieux de définir les champs virtuels dans le constructeur de
votre model::

    public function __construct($id = false, $table = null, $ds = null) {
        parent::__construct($id, $table, $ds);
        $this->virtualFields['nom'] = sprintf('CONCAT(%s.prenom, " ", %s.nom_famille)', $this->alias, $this->alias);
    }

Cela permet à vos champs virtuels de travailler pour n'importe quel alias que
vous donnez à un model.

Pagination et Champs Virtuels définis dans un controller avec des JOIN
======================================================================

L'exemple suivant vous permet d'avoir un compteur d'associations hasMany et vous
permet d'utiliser les champs virtuels. Par exemple, si vous avez le lien suivant
de 'sorting' dans votre template::

    // Crée un lien de 'sorting' pour un champ virtuel
    $this->Paginator->sort('ProductsItems.Total','Items Total');

Vous pourrez ensuite utiliser la configuration de pagination suivante dans votre
controller::

    $this->Products->recursive = -1;

    // Association Products hasMany ProductsItems
    $this->Products->ProductsItems->virtualFields['Total'] = 'count(ProductsItems.products_id)';

    // Conditions 'where' dans l'ORM
    $where = array(
        'fields' => array(
            'Products.*',
            'count(ProductsItems.products_id) AS ProductsItems__Total',
        ),
        'joins' => array(
            array(
                'table' => 'products_items',
                'alias' => 'ProductsItems',
                'type' => 'LEFT',
                'conditions' => array(
                    'ProductsItems.products_id = Products.id',
                )
            )
        ),
        'group' => 'ProductsItems.products_id'
    );

    // Définit les conditions dans le Paginator
    $this->paginate = $where;

    // Récupération des données
    $data = $this->Paginator->paginate();

Ce qui retournerait quelque chose comme::

   Array
   (
       [0] => Array
           (
               [Products] => Array
                   (
                       [id] => 1234,
                       [description] => 'Text bla bla...',
                   )
                [ProductsItems] => Array
                    (
                        [Total] => 25
                    )
           )
        [1] => Array
           (
               [Products] => Array
                   (
                       [id] => 4321,
                       [description] => 'Text 2 bla bla...',
                   )
                [ProductsItems] => Array
                    (
                        [Total] => 50
                    )
           )
    )

Champs virtuels dans les requêtes SQL
=====================================

Utiliser les fonctions dans les requêtes SQL directes assureront que les
données seront retournées dans le même tableau que les données du model.
Par exemple comme ceci::

    $this->Timelog->query("SELECT project_id, SUM(id) as TotalHours FROM timelogs AS Timelog GROUP BY project_id;");

retourne quelque chose comme ceci::
	
   Array
   (
       [0] => Array
           (
               [Timelog] => Array
                   (
                       [project_id] => 1234
                   )
                [0] => Array
                    (
                        [TotalHours] => 25.5
                    )
           )
    )

Si nous voulons grouper les TotalHours dans notre tableau de TimeLog, nous
devrons spécifier un champ virtuel pour notre colonne agrégée. Nous pouvons
ajouter ce nouveau champ virtuel à la volée plutôt que de le déclarer de façon
permanente dans le model. Nous fournirons une valeur par défaut à ``0`` au cas
où d'autres requêtes attendent d'utiliser ce champ virtuel.
Si cela arrive, ``0`` sera retourné dans la colonne TotalHours::

    $this->Timelog->virtualFields['TotalHours'] = 0;

En plus d'ajouter le champ virtuel, nous avons aussi besoin de faire un alias
de notre colonne en utilisant la forme ``MonModel__MonChamp`` comme ceci::

    $this->Timelog->query("SELECT project_id, SUM(id) as Timelog__TotalHours FROM timelogs AS Timelog GROUP BY project_id;");

Lancer la requête de nouveau après avoir spécifié le champ virtuel résultera
en un groupement plus propre des valeurs::

    Array
    (
        [0] => Array
            (
                [Timelog] => Array
                    (
                        [project_id] => 1234
                        [TotalHours] => 25.5
                    )
            )
    )
	
Limitations des champs virtuels
===============================

L'implémentation de ``virtualFields`` a quelques limitations. Premièrement,
vous ne pouvez pas utiliser ``virtualFields`` sur les models associés pour
les conditions, les order, ou les tableaux de champs. Faire ainsi résulte
généralement en une erreur SQL puisque les champs ne sont pas remplacés par
l'ORM. Cela est dû à la difficulté d'estimer la profondeur à laquelle un
model associé peut être trouvé.

Une solution pour contourner ce problème commun de mise en œuvre
consiste à copier ``virtualFields`` d'un model à l'autre lors de
l'exécution, lorsque vous avez besoin d'y accéder::

    $this->virtualFields['nom'] = $this->Author->virtualFields['nom'];

ou::

    $this->virtualFields += $this->Author->virtualFields;


.. meta::
    :title lang=fr: Champs virtuels
    :keywords lang=fr: expressions sql,tableau de nom,champs du model,erreurs sql,champ virtuel,concatenation,nom du model,prénom nom
