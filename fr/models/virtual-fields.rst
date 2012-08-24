Champs virtuels
###############

Les champs virtuels vous permettent de créer des expressions SQL arbitraires et 
de les assigner à des champs dans un Modèle. Ces champs ne peuvent pas être 
sauvegardés, mais seront traités comme les autres champs du modèle pour les
opérations de lecture. Ils seront indexés sous la clé du modèle à travers les 
autres champs du modèle.

Créer des champs virtuels
=========================

Créer des champs virtuels est facile. Dans chaque modèle, vous pouvez définir 
une propriété ``$virtualFields`` qui contient un tableau de champ =>
expressions. Un exemple d'une définition de champ virtuel en utilisant MySQL 
serait::

    <?php
    public $virtualFields = array(
        'nom' => 'CONCAT(Utilisateur.prenom, " ", Utilisateur.nom_famille)'
    );

et avec PostgreSQL::

    <?php
    public $virtualFields = array(
        'nom' => 'Utilisateur.prenom || \' \' || Utilisateur.nom_famille'
    );

Par conséquent, avec les opérations find, les résultats de l'Utilisateur 
contiendraient une clé ``nom`` avec le résultat de la concaténation. Il 
n'est pas conseillé de créer des champs virtuels avec les mêmes noms que 
les colonnes sur la base de données, ce qui peut provoquer des erreurs SQL.

Il n'est pas toujours utile d'avoir **Utilisateur.prenom** complètement 
qualifié. Si vous ne suivez pas la convention (ex: vous avez des relations 
multiples avec d'autres tables) cela entrainerait une erreur. Dans ce cas, 
il est parfois préferable de juste utiliser ``prenom || \' \' || nom_famille`` sans 
le nom du Modèle.

Utiliser les champs virtuels
============================

Créer des champs virtuels est simple et facile, interagir avec les 
champs virtuels peut être fait à travers quelques différentes méthodes.

Model::hasField()
-----------------

Model::hasField() retournera true si le modèle a un champ concret passé en 
premier paramètre. En définissant le second paramètre de `hasField()` à true, 
Les champs virtuels seront aussi vérifiés quand on vérifiera si le modèle a 
un champ.
En utilisant le champ exemple ci-dessus::

    <?php
    $this->User->hasField('nom'); // Retournera false, puisqu'il n'y a pas 
    de champ concret appelé nom.
    $this->User->hasField('nom', true); // Retournera true puisqu'il n'y a pas
    de champ virtuel appelé nom.

Model::isVirtualField()
-----------------------

Cette méthode peut être utilisée pour vérifier si un champ/colonne est un champ 
virtuel ou champ concret. Retournera true si la colonne est virtuelle::

    <?php
    $this->User->isVirtualField('nom'); //true
    $this->User->isVirtualField('prenom'); //false

Model::getVirtualField()
------------------------

Cette méthode peut être utilisée pour accéder aux expressions SQL qui 
contiennent un champ virtuel. Si aucun argument n'est fourni, il retournera 
tout champ virtuel dans un Modèle::

    <?php
    $this->User->getVirtualField('nom'); //retoune 'CONCAT(Utilisateur.prenom, ' ', Utilisateur.nom_famille)'

Model::find() and virtual fields
--------------------------------

Comme écrit précédemment, ``Model::find()`` traitera les champs virtuels un peu 
comme tout autre champ dans un modèle. La valeur du champ virtuel sera placé 
sous la clé du modèle dans l'ensemble de résultats::

    <?php
    $results = $this->Utilisateur->find('first');

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

Depuis que les champs virtuels se comportent un peu plus comme des champs 
réguliers quand on fait des find, ``Controller::paginate()`` sera aussi 
capable de trier selon les champs virtuels.

Champs virtuels et alias de modèles
===================================

Quand on utilise les champsVirtuels et les modèles avec des alias qui ne sont 
pas les mêmes que leur nom, on peut se retrouver avec des problèmes 
comme des champsVirtuels qui ne se mettent pas à jour pour refléter l'alias lié.
Si vous utilisez les champsVirtuels dans les modèles qui ont plus d'un alias,
il est mieux de définir les champsVirtuels dans le constructeur de votre 
modèle::

    <?php
    public function __construct($id = false, $table = null, $ds = null) {
        parent::__construct($id, $table, $ds);
        $this->virtualFields['nom'] = sprintf('CONCAT(%s.prenom, " ", %s.nom_famille)', $this->alias, $this->alias);
    }

Cel permet à vos champsVirtuels de travailler pour n'importe quel alias que 
vous donnez à un modèle.

Champs virtuels dans les requêtes SQL
=====================================

Utiliser les fonctions dans les requêtes SQL directes assureront que les 
données seront retournées dans le même tableau que les données du modèle.
Par exemple comme ceci::

    <?php
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

Si nous voulons grouper les HeuresTotales dans notre tableau de TimeLog, nous 
devrions spécifier un champ virtuel pour notre colonne aggregée. Nous pouvons 
ajouter ce nouveau champ virtuel au vol plutôt que de le déclarer de façon 
permanente dans le modèle. Nous fournirons une valeur par défaut à ``0`` au cas 
où d'autres requêtes attendent d'utiliser ce champ virtuel.
Si cela arrive, ``0`` serait retourné dans la colonne HeuresTotales::

    <?php
    $this->Timelog->virtualFields['HeuresTotales'] = 0;

En plus d'ajouter le champ virtuel, nous avons aussi besoin de faire un alias 
de notre colonne en utilisant la forme ``MonModel__MonChamp`` comme ceci::

    <?php
    $this->Timelog->query("SELECT project_id, SUM(id) as Timelog__HeuresTotales FROM timelogs AS Timelog GROUP BY project_id;");

Lancer la requête de nouveau après avoir specifié le champ virtuel résulterait en 
un groupement plus propre des valeurs::

    Array
    (
        [0] => Array
            (
                [Timelog] => Array
                    (
                        [project_id] => 1234
                        [HeuresTotales] => 25.5
                    )
            )
    )
	
Limitations des champs virtuels
===============================

L'implémentation de ``virtualFields`` a quelques limitations. Premièrement, 
vous ne pouvez pas utiliser ``virtualFields`` sur les modèles associés pour 
les conditions, les order, ou les tableaux de champs. Faire ainsi résulte 
généralement en une erreur SQL puisque les champs ne sont pas remplacés par
l'ORM. Cela est du à la difficulté d'estimer la profondeur à laquelle un
modèle associé peut être trouvé.

Une solution de contournement pour ce problème commun de mise en œuvre 
consiste à copier ``virtualFields`` d'un modèle à l'autre lors de 
l'exécution, lorsque vous avez besoin d'y accéder ::

    <?php
    $this->virtualFields['nom'] = $this->Author->virtualFields['nom'];

or::

    <?php
    $this->virtualFields += $this->Author->virtualFields;

.. meta::
    :title lang=fr: Champs virtuels
    :keywords lang=fr: expressions sql,tableau de nom,champs du modèle,erreurs sql,champ virtuel,concatenation,nom du modèle,prénom nom
