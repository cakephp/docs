Conventions de CakePHP
######################

Nous sommes de grands fans des conventions plutôt que de la configuration.
Bien que cela réclame un peu de temps pour apprendre les conventions de
CakePHP, à terme vous gagnerez du temps. En suivant les conventions,
vous aurez des fonctionnalités automatiques et vous vous libérerez du
cauchemar de la maintenance du suivi des fichiers de configuration.
Les conventions créent un environnement de développement uniforme,
permettant à d'autres développeurs de s'investir dans le code plus
facilement.

Les Conventions des Controllers
===============================

Les noms des classes de controller sont au pluriel, en CamelCase et
se terminent par ``Controller``. ``PeopleController`` et
``LatestArticlesController`` sont des exemples respectant cette convention.

les méthodes publiques des controllers sont souvent exposées comme des 'actions'
accessibles via un navigateur web. Par exemple ``/articles/view`` correspond à
la méthode ``view()`` de ``ArticlesController`` sans rien modifier. Les méthodes
privées ou protégées ne peuvent pas être accédées avec le routing.

Considérations concernant les URLs et les Noms des Controllers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Comme vous venez de voir, un controller à mot unique renvoie facilement vers
un chemin URL en minuscules. Par exemple, ``ApplesController`` (qui serait
défini dans le nom de fichier 'ApplesController.php') est accessible à
l'adresse http://exemple.com/apples.

Les controllers avec plusieurs mots *peuvent* être de forme "inflecté" qui
correspondent au nom du controller:

*  /redApples
*  /RedApples
*  /Red_apples
*  /red_apples

Pointeront tous vers l'index du controller RedApples. Cependant,
la convention est que vos URLs soient en minuscules avec des tirets en utilisant
la classe ``DashedRoute``, donc ``/red-apples/go-pick`` est la bonne forme
pour accéder à l'action ``RedApplesController::goPick()``.

Quand vous créez des liens en utilisant ``this->Html->link()``, vous pouvez
utiliser les conventions suivantes pour le tableau d'url::

    $this->Html->link('link-title', [
        'prefix' => 'MyPrefix // CamelCased
        'plugin' => 'MyPlugin, // CamelCased
        'controller' => 'ControllerName', // CamelCased
        'action' => 'actionName' // camelBacked
    ]

Pour plus d'informations sur les URLs de CakePHP et la gestion des paramètres,
allez voir :ref:`routes-configuration`.

.. _file-and-classname-conventions:

Conventions des Fichiers et des Noms de Classe
==============================================

En général, les noms de fichiers correspondent aux noms des classes et suivent
les standards PSR-0 et PSR-4 pour l'autoloading (chargement automatique). Voici
quelques exemples de noms de classes et de fichiers:

-  La classe controller **BisousEtCalinsController** devra se trouver dans un
   fichier nommé **BisousEtCalinsController.php**.
-  La classe Component (Composant) **MonSuperComponent** devra se trouver dans
   un fichier nommé **MonSuperComponent.php**.
-  La classe Table **ValeurOptionsTable** devra se trouver dans un fichier
   nommé **ValeurOptionsTable.php**.
-  La classe Entity **ValeurOptionEntity** devra se trouver dans un fichier
   nommé **ValeurOption.php**.
-  La classe Behavior (Comportement) **SpecialementFunkableBehavior** devra
   se trouver dans un fichier nommé **SpecialementFunkableBehavior.php**.
-  La classe View (Vue) **SuperSimpleView** devra se trouver dans un fichier
   nommé **SuperSimpleView.ctp**.
-  La classe Helper (Assistant) **LeMeilleurQuiSoitHelper** devra se trouver
   dans un fichier nommé **LeMeilleurQuiSoitHelper.php**.

Chaque fichier sera situé dans le répertoire/namespace approprié dans le
dossier de votre application.

Conventions pour les Models et les Bases de Données
===================================================

Les noms de classe de model sont au pluriel et en CamelCase. People, BigPeople,
et ReallyBigPeople en sont des exemples.

Les noms de tables correspondant aux models CakePHP sont au pluriel et
utilisent le caractère souligné (underscore). Les tables correspondantes
aux models mentionnés ci-dessus seront donc respectivement : ``people``,
``big_people`` et ``really_big_people``.

Note des traducteurs francophones : seul le dernier mot est au pluriel et
tous les pluriels français ne seront pas compris par CakePHP sans lui indiquer
précisément (par exemple cheval/chevaux). Voir pour cela le chapitre sur les
inflexions.

Pour vous assurer de la syntaxe des mots pluriels et singuliers, vous pouvez
utiliser la bibliothèque utilitaire :php:class:`Inflector`. Voir la
documentation sur :doc:`/core-libraries/inflector` pour plus
d'informations.

Les noms des champs avec deux mots ou plus doivent être avec des underscores
comme ici : first\_name.

Les clés étrangères des relations hasMany, belongsTo ou hasOne sont reconnues
par défaut grâce au nom (singulier) de la table associée, suivi de \_id. Donc,
si Cuisiniers hasMany Cakes, la table "cakes" se référera à la table
"cuisiniers"via une clé étrangère cuisinier\_id. Pour une table avec
un nom de plusieurs mots comme "type\_categories", la clé étrangère sera
type\_categorie\_id.

Les tables de jointure utilisées dans les relations BelongsToMany entre models
doivent être nommées d'après le nom des tables qu'elles unissent, dans l'ordre
alphabétique ("pommes\_zebres" plutôt que "zebres\_pommes").

A lieu d'utiliser des clés auto-incrémentées en tant que clés primaires, vous
voudrez peut-être utiliser char(36). CakePHP utilisera un UUID unique de 36
caractères (Text::uuid) à chaque fois que vous sauvegarderez un nouvel
enregistrement en utlisant la méthode ``Table::save()``.

Conventions des Views
=====================

Les fichiers de template de view sont nommés d'après les fonctions
du controller qu'elles affichent, sous une forme avec underscores.
La fonction soyezPret() de la classe PeopleController cherchera un gabarit
de view dans **src/Template/People/soyez_pret.ctp**.

Le schéma classique est
**src/Template/Controller/nom_de_fonction_avec_underscore.ctp**.

En utilisant les conventions CakePHP dans le nommage des différentes parties
de votre application, vous gagnerez des fonctionnalités sans les tracas et les
affres de la configuration. Voici un exemple récapitulant les conventions
abordées :

-  Nom de la table de la base de données: "people"
-  Classe Table: "PeopleTable" se trouvant dans
   **src/Model/Table/PeopleTable.php**
-  Classe Entity: "Person" se trouvant dans **src/Model/Entity/Person.php**
-  Classe Controller: "PeopleController" se trouvant dans
   **src/Controller/PeopleController.php**
-  Template de View se trouvant dans **src/Template/People/index.ctp**

En utilisant ces conventions, CakePHP sait qu'une requête de type
http://exemple.com/personnes/ sera liée à un appel à la fonction ``index()`` du
Controller PersonnesController, dans lequel le model Personne est
automatiquement disponible (et automatiquement lié à la table 'personnes'
dans la base) et rendue dans un fichier. Aucune de ces relations n'a été
configurée par rien d'autre que la création des classes et des fichiers dont
vous aviez besoin de toute façon.

Maintenant que vous avez été initié aux fondamentaux de CakePHP, vous devriez
essayer de dérouler
:doc:`le tutoriel du Blog CakePHP </tutorials-and-examples/bookmarks/intro>`
pour voir comment les choses s'articulent.


.. meta::
    :title lang=fr: Conventions de CakePHP
    :keywords lang=fr: expérience de développement web,maintenance cauchemard,méthode index,systèmes légaux,noms de méthode,classe php,système uniforme,fichiers de config,tenets,pommes,conventions,controller conventionel,bonnes pratiques,maps,visibilité,nouveaux articles,fonctionnalité,logique,cakephp,développeurs
