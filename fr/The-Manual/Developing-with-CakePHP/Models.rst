Modèles
#######

Comprendre les modèles
======================

Un Modèle est à la fois votre modèle de données et, en programmation
orientée objet, un objet qui représente une "chose", comme une voiture,
une personne ou une maison. Un blog, par exemple, peut avoir plusieurs
posts et chaque post peut avoir plusieurs commentaires. Blog, Post et
Commentaire sont tous des exemples de modèles, chacun étant associé avec
un autre.

Voici un simple exemple de définition de modèle dans CakePHP :

::

    <?php

    class Ingredient extends AppModel {
        var $name = 'Ingredient';
    }

    ?>

Avec juste cette simple déclaration, le modèle Ingredient est doté de
toutes les fonctionnalités dont vous avez besoin pour créer des
requêtes, ainsi que sauvegarder et supprimer des données. Ces méthodes
magiques proviennent de la classe Model de CakePHP, grâce à la magie de
l'héritage. Le modèle Ingredient étend le modèle de l'application
AppModel, lequel étend la classe Model interne de CakePHP. C'est cette
classe Model du cœur qui fournit les fonctionnalités à l'intérieur de
votre modèle Ingredient.

La classe intermédiaire AppModel est vide et si vous n'avez pas créé la
vôtre, elle provient du répertoire /cake/. AppModel vous permet de
définir des fonctionnalités qui doivent être rendues disponibles pour
tous les modèles de votre application. Pour faire cela, vous avez besoin
de créer votre propre fichier app\_model.php qui se loge à la racine du
/app/. A la création d'un projet en utilisant
`Bake </fr/view/113/code-generation-with-bake>`_ ce fichier sera créer
automatiquement pour vous.

Créez vos fichiers PHP de modèle dans le dossier /app/models/ ou dans un
sous-répertoire de /app/models. CakePHP le trouvera quelque soit sa
place dans le dossier. Par convention le fichier doit avoir le même nom
que la classe; dans cet exemple ingredient.php.

CakePHP créera dynamiquement un objet modèle pour vous si il ne peut pas
trouver un fichier correspondant dans /app/models. Cela veut également
dire que si votre fichier de modèle n'est pas nommé correctement (ex :
Ingredient.php ou ingredients.php) CakePHP utilisera une instance de
AppModel, plutôt que votre fichier de modèle "franc-tireur" (d'un point
de vue CakePHP). Si vous essayez d'utiliser une méthode que vous avez
définie dans votre modèle ou dans un comportement attaché à votre modèle
et que vous obtenez des erreurs SQL qui indiquent le nom de la méthode
que vous appelez, c'est une indication certaine que CakePHP ne peut pas
trouver votre modèle et que vous devez, soit vérifier les noms de
fichier, soit nettoyer les fichiers temporaires ou les deux.

Voyez aussi les `Comportements </fr/view/88/behaviors>`_ (*Behaviors*),
pour plus d'informations sur la façon d'appliquer une logique similaire
à de multiples modèles.

La propriété ``$name`` est nécessaire en PHP4 mais optionnelle en PHP5.

Une fois votre modèle défini, il peut être accédé depuis vos
`Contrôleurs </fr/view/49/controllers>`_. CakePHP rend automatiquement
un modèle disponible en accès, dès lors que son nom valide celui du
contrôleur. Par exemple, un contrôleur nommé IngredientsController
initialisera automatiquement le modèle Ingredient et y accédera par
``$this->Ingredient``.

::

    <?php

    class IngredientsController extends AppController {
        function index() {
            // Récupère tous les ingrédients et les transmet à la vue :
            $ingredients = $this->Ingredient->find('all');
            $this->set('ingredients', $ingredients);
        }
    }

    ?>

Les modèles associés sont accessibles à travers le modèle principal.
Dans l'exemple suivant, Recette a une association avec le modèle
Ingredient.

::

    <?php
    class RecettesController extends AppController {
        function index() {
         $ingredients = $this->Recette->Ingredient->find('all');
         $this->set('ingredients', $ingredients);
        }
    }
    ?>

Si les modèles n'ont absolument AUCUNE association entre eux, vous
pouvez utilisez Controller::loadModel() pour récupérer le modèle.

::

    <?php
    class RecettesController extends AppController {
        function index() {
           $recettes = $this->Recette->find('all');
           
           $this->loadModel('Voiture');
           $voitures = $this->Voiture->find('all');
           $this->set(compact('recettes', 'voitures')); 
        }
    }
    ?>

Créer les tables de la base de données
======================================

Bien que CakePHP puisse avoir des sources de données qui ne sont pas
pilotées par une base de données, la plupart du temps, elles le sont.
CakePHP est designer pour être agnostique et il travaillera avec MySQL,
MSSQL, Oracle, PostgreSQL et d'autres. Vous pouvez créer vos tables de
base de données telles que vous l'auriez fait normalement. Quand vous
créez vos classes de Modèle, elles s'associeront automatiquement aux
tables que vous avez créées.

Table : les noms sont par convention en minuscules et au pluriel, les
noms de tables multi-mots séparés par des *underscores*. Par exemple, un
Modèle de nom "Ingredient" s'attend à un nom de table "ingredients". Un
Modèle de nom "InscriptionEvenement" s'attendrait à un nom de table
"incription\_evenements". CakePHP inspectera vos tables pour déterminer
le type de données de chaque champ et utilisera cette information pour
automatiser un certain nombre de fonctionnalité, tel que l'apparence des
champs de formulaire dans une vue.

Les noms des champs sont par convention en minuscules et séparés par des
*underscores*.

L'association du Modèle au nom de la table peut être contrôlée par
l'utilisation de l'attribut ``useTable``, expliqué plus loin dans ce
chapitre.

Dans le reste de cette section, vous verrez comment CakePHP associe les
types de champ de la base de données, à des types de donnée PHP et
comment CakePHP peut automatiser des tâches suivant la manière dont vos
champs ont été définis.

Association des types de données par Base de données
----------------------------------------------------

Chaque
`RDMS <https://en.wikipedia.org/wiki/Relational_database_management_system>`_
(*Relational Database Management System*, en français SGBD : Système de
gestion de bases de données relationnelles) définit les types de données
de manières un peu différentes. Avec une classe "datasource" pour chaque
système de base de données, CakePHP associe ces types à quelque chose
qu'il reconnaît et crée une interface unifiée, peu importe le système de
base de données sur lequel vous lancerez votre application.

Cette section décrit comment chacun d'eux est associé.

MySQL
~~~~~

+----------------+----------------------------+
| Type CakePHP   | Propriétés du champ        |
+================+============================+
| primary\_key   | NOT NULL auto\_increment   |
+----------------+----------------------------+
| string         | varchar(255)               |
+----------------+----------------------------+
| text           | text                       |
+----------------+----------------------------+
| integer        | int(11)                    |
+----------------+----------------------------+
| float          | float                      |
+----------------+----------------------------+
| datetime       | datetime                   |
+----------------+----------------------------+
| timestamp      | datetime                   |
+----------------+----------------------------+
| time           | time                       |
+----------------+----------------------------+
| date           | date                       |
+----------------+----------------------------+
| binary         | blob                       |
+----------------+----------------------------+
| boolean        | tinyint(1)                 |
+----------------+----------------------------+

Un champ *tinyint(1)* est considéré comme un booléen par CakePHP.

MySQLi
~~~~~~

+----------------+--------------------------------+
| Type CakePHP   | Propriétés du champ            |
+================+================================+
| primary\_key   | DEFAULT NULL auto\_increment   |
+----------------+--------------------------------+
| string         | varchar(255)                   |
+----------------+--------------------------------+
| text           | text                           |
+----------------+--------------------------------+
| integer        | int(11)                        |
+----------------+--------------------------------+
| float          | float                          |
+----------------+--------------------------------+
| datetime       | datetime                       |
+----------------+--------------------------------+
| timestamp      | datetime                       |
+----------------+--------------------------------+
| time           | time                           |
+----------------+--------------------------------+
| date           | date                           |
+----------------+--------------------------------+
| binary         | blob                           |
+----------------+--------------------------------+
| boolean        | tinyint(1)                     |
+----------------+--------------------------------+

ADOdb
~~~~~

+----------------+-----------------------+
| Type CakePHP   | Propriétés du champ   |
+================+=======================+
| primary\_key   | R(11)                 |
+----------------+-----------------------+
| string         | C(255)                |
+----------------+-----------------------+
| text           | X                     |
+----------------+-----------------------+
| integer        | I(11)                 |
+----------------+-----------------------+
| float          | N                     |
+----------------+-----------------------+
| datetime       | T (Y-m-d H:i:s)       |
+----------------+-----------------------+
| timestamp      | T (Y-m-d H:i:s)       |
+----------------+-----------------------+
| time           | T (H:i:s)             |
+----------------+-----------------------+
| date           | T (Y-m-d)             |
+----------------+-----------------------+
| binary         | B                     |
+----------------+-----------------------+
| boolean        | L(1)                  |
+----------------+-----------------------+

DB2
~~~

+----------------+----------------------------------------------------------------------------+
| Type CakePHP   | Propriétés du champ                                                        |
+================+============================================================================+
| primary\_key   | not null generated by default as identity (start with 1, increment by 1)   |
+----------------+----------------------------------------------------------------------------+
| string         | varchar(255)                                                               |
+----------------+----------------------------------------------------------------------------+
| text           | clob                                                                       |
+----------------+----------------------------------------------------------------------------+
| integer        | integer(10)                                                                |
+----------------+----------------------------------------------------------------------------+
| float          | double                                                                     |
+----------------+----------------------------------------------------------------------------+
| datetime       | timestamp (Y-m-d-H.i.s)                                                    |
+----------------+----------------------------------------------------------------------------+
| timestamp      | timestamp (Y-m-d-H.i.s)                                                    |
+----------------+----------------------------------------------------------------------------+
| time           | time (H.i.s)                                                               |
+----------------+----------------------------------------------------------------------------+
| date           | date (Y-m-d)                                                               |
+----------------+----------------------------------------------------------------------------+
| binary         | blob                                                                       |
+----------------+----------------------------------------------------------------------------+
| boolean        | smallint(1)                                                                |
+----------------+----------------------------------------------------------------------------+

Firebird/Interbase
~~~~~~~~~~~~~~~~~~

+----------------+--------------------------------------------------------+
| Type CakePHP   | Propriétés du champ                                    |
+================+========================================================+
| primary\_key   | IDENTITY (1, 1) NOT NULL                               |
+----------------+--------------------------------------------------------+
| string         | varchar(255)                                           |
+----------------+--------------------------------------------------------+
| text           | BLOB SUB\_TYPE 1 SEGMENT SIZE 100 CHARACTER SET NONE   |
+----------------+--------------------------------------------------------+
| integer        | integer                                                |
+----------------+--------------------------------------------------------+
| float          | float                                                  |
+----------------+--------------------------------------------------------+
| datetime       | timestamp (d.m.Y H:i:s)                                |
+----------------+--------------------------------------------------------+
| timestamp      | timestamp (d.m.Y H:i:s)                                |
+----------------+--------------------------------------------------------+
| time           | time (H:i:s)                                           |
+----------------+--------------------------------------------------------+
| date           | date (d.m.Y)                                           |
+----------------+--------------------------------------------------------+
| binary         | blob                                                   |
+----------------+--------------------------------------------------------+
| boolean        | smallint                                               |
+----------------+--------------------------------------------------------+

MS SQL
~~~~~~

+----------------+----------------------------+
| Type CakePHP   | Propriétés du champ        |
+================+============================+
| primary\_key   | IDENTITY (1, 1) NOT NULL   |
+----------------+----------------------------+
| string         | varchar(255)               |
+----------------+----------------------------+
| text           | text                       |
+----------------+----------------------------+
| integer        | int                        |
+----------------+----------------------------+
| float          | numeric                    |
+----------------+----------------------------+
| datetime       | datetime (Y-m-d H:i:s)     |
+----------------+----------------------------+
| timestamp      | timestamp (Y-m-d H:i:s)    |
+----------------+----------------------------+
| time           | datetime (H:i:s)           |
+----------------+----------------------------+
| date           | datetime (Y-m-d)           |
+----------------+----------------------------+
| binary         | image                      |
+----------------+----------------------------+
| boolean        | bit                        |
+----------------+----------------------------+

Oracle
~~~~~~

+----------------+-----------------------+
| Type CakePHP   | Propriétés du champ   |
+================+=======================+
| primary\_key   | number NOT NULL       |
+----------------+-----------------------+
| string         | varchar2(255)         |
+----------------+-----------------------+
| text           | varchar2              |
+----------------+-----------------------+
| integer        | numeric               |
+----------------+-----------------------+
| float          | float                 |
+----------------+-----------------------+
| datetime       | date (Y-m-d H:i:s)    |
+----------------+-----------------------+
| timestamp      | date (Y-m-d H:i:s)    |
+----------------+-----------------------+
| time           | date (H:i:s)          |
+----------------+-----------------------+
| date           | date (Y-m-d)          |
+----------------+-----------------------+
| binary         | bytea                 |
+----------------+-----------------------+
| boolean        | boolean               |
+----------------+-----------------------+
| number         | numeric               |
+----------------+-----------------------+
| inet           | inet                  |
+----------------+-----------------------+

PostgreSQL
~~~~~~~~~~

+----------------+---------------------------+
| Type CakePHP   | Propriétés du champ       |
+================+===========================+
| primary\_key   | serial NOT NULL           |
+----------------+---------------------------+
| string         | varchar(255)              |
+----------------+---------------------------+
| text           | text                      |
+----------------+---------------------------+
| integer        | integer                   |
+----------------+---------------------------+
| float          | float                     |
+----------------+---------------------------+
| datetime       | timestamp (Y-m-d H:i:s)   |
+----------------+---------------------------+
| timestamp      | timestamp (Y-m-d H:i:s)   |
+----------------+---------------------------+
| time           | time (H:i:s)              |
+----------------+---------------------------+
| date           | date (Y-m-d)              |
+----------------+---------------------------+
| binary         | bytea                     |
+----------------+---------------------------+
| boolean        | boolean                   |
+----------------+---------------------------+
| number         | numeric                   |
+----------------+---------------------------+
| inet           | inet                      |
+----------------+---------------------------+

SQLite
~~~~~~

+----------------+---------------------------+
| Type CakePHP   | Propriétés du champ       |
+================+===========================+
| primary\_key   | integer primary key       |
+----------------+---------------------------+
| string         | varchar(255)              |
+----------------+---------------------------+
| text           | text                      |
+----------------+---------------------------+
| integer        | integer                   |
+----------------+---------------------------+
| float          | float                     |
+----------------+---------------------------+
| datetime       | datetime (Y-m-d H:i:s)    |
+----------------+---------------------------+
| timestamp      | timestamp (Y-m-d H:i:s)   |
+----------------+---------------------------+
| time           | time (H:i:s)              |
+----------------+---------------------------+
| date           | date (Y-m-d)              |
+----------------+---------------------------+
| binary         | blob                      |
+----------------+---------------------------+
| boolean        | boolean                   |
+----------------+---------------------------+

Sybase
~~~~~~

+----------------+-------------------------------------+
| Type CakePHP   | Propriétés du champ                 |
+================+=====================================+
| primary\_key   | numeric(9,0) IDENTITY PRIMARY KEY   |
+----------------+-------------------------------------+
| string         | varchar(255)                        |
+----------------+-------------------------------------+
| text           | text                                |
+----------------+-------------------------------------+
| integer        | int(11)                             |
+----------------+-------------------------------------+
| float          | float                               |
+----------------+-------------------------------------+
| datetime       | datetime (Y-m-d H:i:s)              |
+----------------+-------------------------------------+
| timestamp      | timestamp (Y-m-d H:i:s)             |
+----------------+-------------------------------------+
| time           | datetime (H:i:s)                    |
+----------------+-------------------------------------+
| date           | datetime (Y-m-d)                    |
+----------------+-------------------------------------+
| binary         | image                               |
+----------------+-------------------------------------+
| boolean        | bit                                 |
+----------------+-------------------------------------+

Titres
------

Un objet, au sens physique du terme, a souvent un nom ou un titre par le
biais duquel on peut y faire référence. Une personne a un nom comme John
ou Michel ou Gaston. Un billet de blog a un titre. Une catégorie a un
nom.

En spécifiant un champ ``title`` ou ``name``, CakePHP utilisera
automatiquement cet intitulé dans plusieurs circonstances :

-  Maquettage rapide (Scaffolding) — titres de page, étiquettes des
   balises fieldset
-  Listes — normalement utilisé pour les menus déroulants ``<select>``
-  TreeBehavior — mise en ordre, vues arborescentes

Si vous avez un champ "title" *et* un champ "name" dans votre table, le
champ "title" sera utilisé.

Si vous voulez utiliser autre chose que la convention, définissez
``var $displayField = 'un_champ';``. Un seul champ peut être défini ici.

"created" et "modified" (ou "updated")
--------------------------------------

Ces deux champs sont automatiquement gérés lors des appels à la méthode
save() du modèle CakePHP. A la création d'une nouvelle ligne, son champ
``created`` sera automatiquement rempli et son champ ``modified`` est
mis à jour chaque fois que des changements sont faits. Notez qu'un champ
nommé ``updated`` aura le même comportement que le champ ``modified``.

Ces deux champs spéciaux doivent être de type DATETIME avec NULL comme
valeur par défaut.

Utiliser les UUIDs comme Clés primaires
---------------------------------------

Les clés primaires sont normalement définies par un champ INT. La base
de donnée autoincrémente le champ, en commençant par 1, pour chaque
nouvel enregistrement ajouté. De façon alternative, si vous spécifiez
votre clé primaire comme CHAR(36) ou BINARY(36), CakePHP génèrera
automatiquement des `UUIDs <https://en.wikipedia.org/wiki/UUID>`_ lorsque
de nouveaux enregistrements sont créés.

Un UUID est une chaine de 32 bytes séparés par quatre tirets, pour un
total de 36 caractères. Par exemple :

::

    550e8400-e29b-41d4-a716-446655440000

Les UUIDs sont conçus pour être uniques, pas seulement au sein d'une
même table, mais également entre les différentes tables et bases de
données. Si vous avez besoin d'un champ qui reste unique quelque soit le
système utilisé, alors les UUIDS sont une bonne approche.

Récupérer vos données
=====================

 
=

find
----

``find($type, $params)``

*Find* est, parmi toutes les fonctions de récupération de données des
modèles, une véritable bête de somme multi-fonctionnelle. ``$type`` peut
être ``'all'``, ``'first'``, ``'count'``, ``'list'``, ``'neighbors'`` ou
``'threaded'``. Le type par défaut est ``'first'``. Gardez à l'esprit
que ``$type`` est sensible à la casse. Utiliser un caractère majuscule
(par exemple ``'All'``) ne produira pas le résultat attendu.

``$params`` est utilisé pour passer tous les paramètres aux différentes
formes de *find* et il a les clés suivantes disponibles par défaut - qui
sont toutes optionnelles :

::

    array(
        'conditions' => array('Model.champ' => $cetteValeur), // tableau de conditions
        'recursive' => 1, // entier
        'fields' => array('Model.champ', 'Model.champ2'), // tableau de nom de champs
        'order' => 'Model.id', // chaîne ou tableau définissant le ORDER BY
        'group' => array('Model.champ'), // champs pour le GROUP BY
        'limit' => n, // entier
        'page' => n, // entier
            'offset'=> n, // entier
        'callbacks' => true //les autres valeurs possibles sont false, 'before', 'after'
    )

Il est possible également, d'ajouter et d'utiliser d'autres paramètres,
dont il est fait usage dans quelques types de find, dans des
comportements (*behaviors*) et, bien sûr, dans vos propres méthodes de
modèle.

find('first')
~~~~~~~~~~~~~

``find('first', $params)``

'first' est type de recherche par défault et retournera un résultat,
vous devriez utiliser ceci dans tous les cas où vous attendez un seul
résultat. Ci-dessous, une paire d'exemples simples (code du contôleur) :

::

    function une_fonction() {
       ...
       $this->Article->order = null; // redéfinition s'il l'est déjà
       $articleADemiAleatoire = $this->Article->find();
       $this->Article->order = 'Article.created DESC'; // simule le fait que le modèle ait un ordre de tri par défaut
       $dernierCree = $this->Article->find();
       $dernierCreeEgalement = $this->Article->find('first', array('order' => array('Article.created DESC')));
       $specifiquementCeluiCi = $this->Article->find('first', array('conditions' => array('Article.id' => 1)));
       ...
    }

Dans le premier exemple, aucun paramètre n'est passé au find ; par
conséquent aucune condition ou ordre de tri ne seront utilisés. Le
format retourné par un appel à ``find('first')`` est de la forme :

::

    Array
    (
        [NomModele] => Array
            (
                [id] => 83
                [champ1] => valeur1,
                [champ2] => valeur2.
                [champ3] => valeur3
            )

        [NomModeleAssocie] => Array
            (
                [id] => 1
                [champ1] => valeur1,
                [champ2] => valeur2.
                [champ3] => valeur3
            )
    )

Il n'y a aucun paramètre additionnel utilisé par ``find('first')``.

find('count')
~~~~~~~~~~~~~

``find('count', $params)``

``find('count', $params)`` retourne une valeur de type entier.
Ci-dessous, une paire d'exemples simples (code du contôleur) :

::

    function une_fonction() {
       ...
       $total = $this->Article->find('count');
       $en_attente = $this->Article->find('count', array('conditions' => array('Article.statut' => 'en attente')));
       $auteurs = $this->Article->Utilisateur->find('count');
       $auteursPublies = $this->Article->find('count', array(
          'fields' => 'DISTINCT Article.utilisateur_id',
          'conditions' => array('Article.statut !=' => 'en attente')
       ));
       ...
    }

Ne passez pas ``fields`` comme un tableau à ``find('count')``. Vous
devriez avoir besoin de spécifier seulement des champs pour un *count*
DISTINCT (parce que sinon, le décompte est toujours le même - il est
imposé par les conditions).

Il n'y a aucun paramètre additionnel utilisé par ``find('count')``.

find('all')
~~~~~~~~~~~

``find('all', $params)``

``find('all')`` retourne un tableau de résultats (potentiellement
multiples). C'est en fait le mécanisme utilisé par toutes les variantes
de ``find()``, ainsi que par ``paginate``. Ci-dessous, une paire
d'exemples simples (code du contôleur) :

::

    function une_fonction() {
       ...
       $tousLesArticles = $this->Article->find('all');
       $en_attente = $this->Article->find('all', array('conditions' => array('Article.statut' => 'en attente')));
       $tousLesAuteurs = $this->Article->Utilisateur->find('all');
       $tousLesAuteursPublies = $this->Article->User->find('all', array('conditions' => array('Article.statut !=' => 'en attente')));
       ...
    }

Dans l'exemple ci-dessus ``$tousLesAuteurs`` contiendra chaque
utilisateur de la table utilisateurs, il n'y aura pas de condition
appliquée à la recherche puisqu'aucune n'a été passée.

Les résultats d'un appel à ``find('all')`` seront de la forme suivante :

::

    Array
    (
        [0] Array
            (
                [NomModele] => Array
                    (
                        [id] => 83
                        [champ1] => valeur1
                        [champ2] => valeur2
                        [champ3] => valeur3
                    )

                [NomModeleAssocie] => Array
                    (
                        [id] => 1
                        [champ1] => valeur1
                        [champ2] => valeur2
                        [champ3] => valeur3
                    )

            )
    )

Il n'y a aucun paramètre additionnel utilisé par ``find('all')``.

find('list')
~~~~~~~~~~~~

``find('list', $params)``

``find('list', $params)`` retourne un tableau indexé, pratique pour tous
les cas où vous voudriez une liste telle que celles remplissant les
champs select. Ci-dessous, une paire d'exemples simples (code du
contôleur) :

::

    function une_fonction() {
       ...
       $tousLesArticles = $this->Article->find('list');
       $en_attente = $this->Article->find('list', array('conditions' => array('Article.statut' => 'en attente')));
       $tousLesAuteurs = $this->Article->Utilisateur->find('list');
       $tousLesAuteursPublies = $this->Article->User->find('list', array('conditions' => array('Article.statut !=' => 'en attente')));
       ...
    }

Dans l'exemple ci-dessus ``$tousLesAuteurs`` contiendra chaque
utilisateur de la table utilisateurs, il n'y aura pas de condition
appliquée à la recherche puisqu'aucune n'a été passée.

Les résultats d'un appel à ``find('list')`` seront de la forme suivante
:

::

    Array
    (
        //[id] => 'valeurAffichage',
        [1] => 'valeurAffichage1',
        [2] => 'valeurAffichage2',
        [4] => 'valeurAffichage4',
        [5] => 'valeurAffichage5',
        [6] => 'valeurAffichage6',
        [3] => 'valeurAffichage3',
    )

En appelant ``find('list')``, les champs (``fields``) passés sont
utilisés pour déterminer ce qui devrait être utilisé comme clé, valeur
du tableau et, optionnellement, par quoi regrouper les résultats (group
by). Par défaut la clé primaire du modèle est utilisé comme clé et le
champ affiché (*display field* qui peut être configuré en utilisant
l'attribut `displayField </fr/view/438/displayField>`_ du modèle) est
utilisé pour la valeur. Quelques exemples complémentaires pour clarifier
les choses :

::

    function une_fonction() {
       ...
       $juste_les_pseudos = $this->Article->Utilisateur->find('list', array('fields' => array('Utilisateur.pseudo'));
       $correspondancePseudo = $this->Article->Utilisateur->find('list', array('fields' => array('Utilisateur.pseudo', 'Utilisateur.prenom'));
       $groupesPseudo = $this->Article->Utilisateur->find('list', array('fields' => array('Utilisateur.pseudo', 'Utilisateur.prenom', 'Utilisateur.groupe'));
       ...
    }

Avec l'exemple de code ci-dessus, les variables résultantes devraient
ressembler à quelque chose comme çà :

::


     $juste_les_pseudos = Array
    (
        //[id] => 'pseudo',
        [213] => 'AD7six',
        [25] => '_psychic_',
        [1] => 'PHPNut',
        [2] => 'gwoo',
        [400] => 'jperras',
    )

    $correspondancePseudo = Array
    (
        //[pseudo] => 'prenom',
        ['AD7six'] => 'Andy',
        ['_psychic_'] => 'John',
        ['PHPNut'] => 'Larry',
        ['gwoo'] => 'Gwoo',
        ['jperras'] => 'Joël',
    )

    $usernameGroups = Array
    (
        ['Utilisateur'] => Array
            (
            ['PHPNut'] => 'Larry',
            ['gwoo'] => 'Gwoo',
            )

        ['Admin'] => Array
            (
            ['_psychic_'] => 'John',
            ['AD7six'] => 'Andy',
            ['jperras'] => 'Joël',
            )

    )

find('threaded')
~~~~~~~~~~~~~~~~

``find('threaded', $params)``

``find('threaded', $params)`` retourne un tableau imbriqué et est
particulièrement approprié si vous voulez utiliser le champ
``parent_id`` des données de votre modèle, pour construire les résultats
associés. Ci-dessous, une paire d'exemples simples (code du contôleur) :

::

    function une_fonction() {
       ...
       $toutesLesCategories = $this->Categorie->find('threaded');
       $uneCategorie = $this->Categorie->find('first', array('conditions' => array('parent_id' => 42)); // pas la racine
       $quelquesCategories = $this->Categorie->find('threaded', array(
        'conditions' => array(
            'Article.lft >=' => $uneCategorie['Categorie']['lft'], 
            'Article.rght <=' => $uneCategorie['Categorie']['rght']
        )
       ));
       ...
    }

Il n'est pas nécessaire d'utiliser `le comportement
Tree </fr/view/91/Tree>`_ pour appliquer cette méthode - mais tous les
résultats souhaités doivent être trouvables en une seule requête.

Dans l'exemple ci-dessus, ``$toutesLesCategories`` contiendra un tableau
imbriqué représentant la structure entière de categorie. Le second
exemple fait usage de la structure de données utilisée par le
`comportement Tree </fr/view/91/Tree>`_, qui retourne un résultat
partiel, imbriqué pour ``$uneCategorie`` et tout ce qu'il y a sous elle.
Les résultats d'un appel à ``find('threaded')`` seront de la forme
suivante :

::

    Array
    (
        [0] => Array
            (
                [nomModele] => Array
                    (
                        [id] => 83
                        [parent_id] => null
                        [champ1] => valeur1
                        [champ2] => valeur2
                        [champ3] => valeur3
                    )

                [nomModeleAssocie] => Array
                    (
                        [id] => 1
                        [champ1] => valeur1
                        [champ2] => valeur2
                        [champ3] => valeur3
                    )
                [children] => Array
                    (
                [0] => Array
                (
                    [nomModele] => Array
                    (
                        [id] => 42
                                [parent_id] => 83
                        [champ1] => valeur1
                        [champ2] => valeur2
                        [champ3] => valeur3
                    )

                    [nomModeleAssocie] => Array
                    (
                        [id] => 2
                        [champ1] => valeur1
                        [champ2] => valeur2
                        [champ3] => valeur3
                    )
                        [children] => Array
                    (
                    )
                        )
                ...
                    )
            )
    )

L'ordre dans lequel les résultats apparaissent peut être modifié,
puisqu'il est influencé par l'ordre d'exécution. Par exemple, si
``'order' => 'nom ASC'`` est passé dans les paramètres de
``find('threaded')``, les résultats apparaîtront ordonnés par nom. De
même que tout ordre peut être utilisé, il n'y a pas de condition
intrinsèque à cette méthode pour que le meilleur résultat soit retourné
en premier.

Il n'y a aucun paramètre additionnel utilisé par ``find('threaded')``.

find('neighbors')
~~~~~~~~~~~~~~~~~

``find('neighbors', $params)``

'neighbors' exécutera un find similaire à 'first', mais retournera la
ligne précédant et suivant celle que vous requêtez. Ci-dessous, un
exemple simple (code du contôleur) :

::

    function une_fonction() {
       $voisins = $this->Article->find('neighbors', array('field' => 'id', 'value' => 3));
    }

Vous pouvez voir dans cet exemple, les deux éléments requis par le
tableau ``$params`` : field et value. Les autres éléments sont toujours
autorisés, comme dans tout autre find (ex : si votre modèle agit comme
un *containable*, alors vous pouvez spécifiez 'contain' dans
``$params``). Le format retourné par un appel à ``find('neighbors')``
est de la forme :

::

    Array
    (
        [prev] => Array
            (
                [NomModele] => Array
                    (
                        [id] => 2
                        [champ1] => valeur1
                        [champ2] => valeur2
                        ...
                    )
                [NomModeleAssocie] => Array
                    (
                        [id] => 151
                        [champ1] => valeur1
                        [champ2] => valeur2
                        ...
                    )
            )
        [next] => Array
            (
                [NomModele] => Array
                    (
                        [id] => 4
                        [champ1] => valeur1
                        [champ2] => valeur2
                        ...
                    )
                [NomModeleAssocie] => Array
                    (
                        [id] => 122
                        [champ1] => valeur1
                        [champ2] => valeur2
                        ...
                    )
            )
    )

Notez que le résultat contient toujours seulement deux éléments de
premier niveau : prev et next.

findAllBy
---------

``findAllBy<fieldName>(string $value)``

Ces fonctions magiques peuvent être utilisées comme un raccourci pour
rechercher dans vos tables sur un champ précis. Ajoutez simplement le
nom du champ (au format CamelCase) à la fin de ces fonctions et
fournissez le critère de recherche pour ce champ comme premier
paramètre.

+--------------------------------------------------------+--------------------------------------------+
| Exemple de findAllBy<x> en PHP5                        | Fragment SQL correspondant                 |
+========================================================+============================================+
| $this->Produit->findAllByEtatOrdre("3");               | Produit.etat\_ordre = 3                    |
+--------------------------------------------------------+--------------------------------------------+
| $this->Recette->findAllByType("Gâteau");               | Recette.type = "Gâteau"                    |
+--------------------------------------------------------+--------------------------------------------+
| $this->Utilisateur->findAllByNomFamille("Anderson");   | Utilisateur.nom\_famille = "Anderson"      |
+--------------------------------------------------------+--------------------------------------------+
| $this->Gateau->findById(7);                            | Cake.id = 7                                |
+--------------------------------------------------------+--------------------------------------------+
| $this->Utilisateur->findByNomUtilisateur("psychic");   | Utilisateur.nom\_utilisateur = "psychic"   |
+--------------------------------------------------------+--------------------------------------------+

Les utilisateurs de PHP4 doivent utiliser cette fonction un peu
différemment, à cause d'une insensibilité à la casse en PHP4 :

+----------------------------------------------------------+--------------------------------------------+
| Exemple de findAllBy<x> en PHP4                          | Fragment SQL correspondant                 |
+==========================================================+============================================+
| $this->Produit->findAllByEtat\_ordre("3");               | Produit.etat\_ordre = 3                    |
+----------------------------------------------------------+--------------------------------------------+
| $this->Recette->findAllByType("Gâteau");                 | Recette.type = "Gâteau"                    |
+----------------------------------------------------------+--------------------------------------------+
| $this->Utilisateur->findAllByNom\_famille("Anderson");   | Utilisateur.nom\_famille = "Anderson"      |
+----------------------------------------------------------+--------------------------------------------+
| $this->Gateau->findById(7);                              | Cake.id = 7                                |
+----------------------------------------------------------+--------------------------------------------+
| $this->Utilisateur->findByNom\_utilisateur("psychic");   | Utilisateur.nom\_utilisateur = "psychic"   |
+----------------------------------------------------------+--------------------------------------------+

Les fonctions findBy() fonctionnent comme find('first',...), tandis que
les fonctions findAllBy() fonctionnent comme find('all',...).

Dans chaque cas, le résultat retourné est un tableau formaté exactement
comme il le serait avec, respectivement, find() ou findAll().

findBy
------

``findBy<nomChamp>(string $value)``

Ces fonctions magiques peuvent être utilisées comme un raccourci pour
rechercher dans vos tables selon un champ précis. Ajoutez simplement le
nom du champ (au format CamelCase) à la fin de ces fonctions et
fournissez le critère de recherche pour ce champ comme premier
paramètre.

+------------------------------------------------+----------------------------------+
| Exemple findAllBy<x> en PHP5                   | Fragment SQL Correspondant       |
+================================================+==================================+
| $this->Produit->findAllByEtatCommande(‘3’);    | Produit.etat\_commande = 3       |
+------------------------------------------------+----------------------------------+
| $this->Recette->findAllByType(‘Gâteau’);       | Recette.type = ‘Gâteau’          |
+------------------------------------------------+----------------------------------+
| $this->Utilisateur->findAllByNom(‘Dupont’);    | Utilisateur.nom = ‘Dupont’       |
+------------------------------------------------+----------------------------------+
| $this->Gateau->findById(7);                    | Gateau.id = 7                    |
+------------------------------------------------+----------------------------------+
| $this->Utilisateur->findByPseudo(‘psychic’);   | Utilisateur.pseudo = ‘psychic’   |
+------------------------------------------------+----------------------------------+

Les utilisateurs de PHP4 doivent utiliser cette fonction un peu
différemment à cause de l'insensibilité à la casse en PHP4 :

+--------------------------------------------------------+---------------------------------------+
| Exemple findAllBy<x> en PHP4                           | Fragment SQL correspondant            |
+========================================================+=======================================+
| $this->Produit->findAllByEtat\_commande(‘3’);          | Produit.etat\_commande = 3            |
+--------------------------------------------------------+---------------------------------------+
| $this->Recette->findAllByType(‘Gâteau’);               | Recette.type = ‘Gâteau’               |
+--------------------------------------------------------+---------------------------------------+
| $this->Utilisateur->findAllByNom\_famille(‘Martin’);   | Utilisateur.nom\_famille = ‘Martin’   |
+--------------------------------------------------------+---------------------------------------+
| $this->Gateau->findById(7);                            | Gateau.id = 7                         |
+--------------------------------------------------------+---------------------------------------+
| $this->Utilisateur->findByNom\_usage(‘psychic’);       | Utilisateur.nom\_usage = ‘psychic’    |
+--------------------------------------------------------+---------------------------------------+

Les fonctions findBy() fonctionnent comme find('first',...), alors que
les fonctions findAllBy() fonctionnent comme find('all',...).

Dans les deux cas, le résultat retourné est un tableau formaté
exactement comme il l'aurait été depuis un find() ou un findAll().

query
-----

``query(string $query)``

Les appels SQL que vous ne pouvez pas ou ne voulez pas faire grâce aux
autres méthodes de modèle (attention, il y a très peu de circonstances
où cela se vérifie), peuvent être exécutés en utilisant la méthode
``query()``.

Si vous utilisez souvent cette méthode dans votre application,
assurez-vous de connaître la `librairie
Sanitize </fr/view/153/Data-Sanitization>`_ de CakePHP, qui vous aide à
nettoyer les données provenant des utilisateurs, des attaques par
injection et *cross-site scripting*.

``query()`` ne respecte pas $Model->cachequeries car cette
fonctionnalité est par nature déconnectée de tout ce qui concerne
l'appel du modèle. Pour éviter les appels au cache de requêtes,
fournissez un second argument *false*, par exemple :
``query($query, $cachequeries = false)``

``query()`` utilise le nom de la table déclaré dans la requête comme clé
du tableau de données retourné, plutôt que le nom du modèle. Par
exemple,

::

    $this->Photo->query("SELECT * FROM photos LIMIT 2;");

devrait retourner

::

    Array
    (
        [0] => Array
            (
                [photos] => Array
                    (
                        [id] => 1304
                        [user_id] => 759
                    )
            )

        [1] => Array
            (
                [photos] => Array
                    (
                        [id] => 1305
                        [user_id] => 759
                    )
            )
    )

Pour utiliser le nom du modèle comme clé du tableau et obtenir un
résultat cohérent avec ce qui est retournée par les méthodes *Find*, la
requête doit être réécrite :

::

    $this->Photo->query("SELECT * FROM photos AS Photo LIMIT 2;");

qui retourne

::

    Array
    (
        [0] => Array
            (
                [Photo] => Array
                    (
                        [id] => 1304
                        [user_id] => 759
                    )
            )

        [1] => Array
            (
                [Photo] => Array
                    (
                        [id] => 1305
                        [user_id] => 759
                    )
            )
    )

Cette syntaxe et la structure de tableau correspondante sont valides
pour MySQL seulement. Cake ne fournit aucune abstraction de données
lorsqu'on exécute des requêtes manuellement, donc les résultats exacts
pourront varier selon la base de données.

field
-----

``field(string $nom, array $conditions = null, string $ordre = null)``

Retourne la valeur d'un unique champ, spécifié par ``$nom``, du premier
enregistrement correspondant aux $conditions ordonnées par $ordre. Si
aucune condition n'est passée et que l'id du modèle est fixé, cela
retournera la valeur du champ pour le résultat de l'enregistrement
actuel. Si aucun enregistrement correspondant n'est trouvé cela
retournera ``false``.

::

    $modele->id = 22;
    echo $modele->field('nom'); // affiche le nom de l'entrée d'id 22

    echo $modele->field('nom', array('created <' => date('Y-m-d H:i:s')), 'created DESC'); // affiche le nom de l'instance la plus récemment créée

read()
------

``read($fields, $id)``

``read()`` est une méthode utilisée pour récupérer les données du modèle
courant (``Model::$data``) - comme lors des mises à jour - mais elle
peut aussi être utilisée dans d'autres circonstances, pour récupérer un
seul enregistrement depuis la base de données.

``$fields`` est utilisé pour passer un seul nom de champ sous forme de
chaîne ou un tableau de noms de champs ; si laissé vide, tous les champs
seront retournés.

``$id`` précise l'ID de l'enregistrement à lire. Par défaut,
l'enregistrement actuellement sélectionné, tel que spécifié par
``Model::$id``, est utilisé. Passer une valeur différente pour ``$id``
fera que l'enregistrement correspondant sera sélectionné.

``read()`` retourne toujours un tableau (même si seulement un nom de
champ unique est requis). Utilisez ``field`` pour retourner la valeur
d'un seul champ.

::

    function beforeDelete($cascade) {
       ...
       $classement = $this->read('classement'); // récupère le classement de l'enregistrement qui doit être supprimé.
       $nom = $this->read('name', $id2); // récupère le nom d'un second enregistrement.
       $classement = $this->read('classement'); // récupère le classement de ce second enregistrement.
       $this->id = $id3; //
       $this->Article->read(); // lit un troisième enregistrement.
       $enregistrement = $this->data // stocke le troisième enregistrement dans $enregistrement
       ...
    }

Notez que le troisième appel à ``read()`` retourne le classement du même
enregistrement que celui lu avant. Cela est du au fait que ``read()``
modifie ``Model::$id`` pour toute valeur passée comme ``$id``. Les
lignes 6-8 démontrent comment ``read()`` modifie les données du modèle
courant.

Conditions de recherche complexes
---------------------------------

La plupart des appels de recherche de modèles impliquent le passage d’un
jeu de conditions d’une manière ou d’une autre. Le plus simple est
d’utiliser un bout de clause WHERE SQL. Si vous vous avez besoin de plus
de contrôle, vous pouvez utiliser des tableaux.

L’utilisation de tableaux est plus claire et simple à lire, et rend
également la construction de requêtes très simple. Cette syntaxe sépare
également les éléments de votre requête (champs, valeurs, opérateurs
etc.) en parties manipulables et discrètes. Cela permet à CakePHP de
générer les requêtes les plus efficaces possibles, d’assurer une syntaxe
SQL correcte, et d’échapper convenablement chaque partie de la requête.

Dans sa forme la plus simple, une requête basée sur un tableau ressemble
à ceci :

::

    $conditions = array("Billet.titre" => "Ceci est un billet");

    //Exemple d’utilisation avec un modèle:
    $this->Billet->find('first', array('conditions' => $conditions);

La structure ici est assez significative : Tous les billets dont le
titre à pour valeur « Ceci est un billet » sont cherchés. Nous aurions
pu uniquement utiliser « titre » comme nom de champ, mais lorsque l’on
construit des requêtes, il vaut mieux toujours spécifier le nom du
modèle. Cela améliore la clarté du code, et évite des collisions
futures, dans le cas où vous devriez changer votre schéma.

Qu’en est-il des autres types de correspondances ? Elles sont aussi
simples. Disons que nous voulons trouver tous les billets dont le titre
n’est pas "Ceci est un billet" :

::

    array("Billet.titre" => "<> Ceci est un billet")

Notez le '<>' qui précède l’expression. CakePHP peut parser tout
opérateur de comparaison valide de SQL, même les expressions de
correspondance utilisant LIKE, BETWEEN, ou REGEX, tant que vous laissez
un espace entre l'opérateur et la valeur. La seule exception à ceci sont
les correspondance du genre IN(...). Admettons que vous vouliez trouver
les billets dont le titre appartient à un ensemble de valeur données :

::

    array(
        "Billet.titre" => array("Premier billet", "Second billet", "Troisième billet")
    )

Faire un NOT IN(...) correspond à trouver les billets dont le titre
n'est pas dans le jeu de données passé :

::

    array(
        "NOT" => array( "Billet.titre" => array("Premier billet", "Second billet", "Troisième billet") )
    )

Ajouter des filtres additionnels aux conditions est aussi simple que
d’ajouter des paires clé/valeur au tableau :

::

    array
    (
        "Billet.titre" => array("Premier billet", "Second billet", "Troisième billet"),
        "Billet.created >" => date('Y-m-d', strtotime("-2 weeks")
    )

Vous pouvez également créer des recherche qui comparent deux champs de
la base de données

::

    array("Billet.created = Billet.modified")

L'exemple ci-dessus retournera les billets où la date de création est
égale à la date de modification (ie les billets qui n'ont jamais été
modifiés sont retournés).

Souvenez-vous que si vous vous trouvez dans l'incapacité de formuler une
clause WHERE par cette méthode (ex. opérations booléennes),il vous est
toujours possible de la spécifier sous forme de chaîne comme :

::

    array(
        'Modele.champ & 8 = 1',
        // autres conditions habituellement utilisées
    )

Par défaut, CakePHP joint les conditions multiples avec l’opérateur
booléen AND, ce qui signifie que le bout de code ci-dessus correspondra
uniquement aux billets qui ont été créés durant les deux dernières
semaines, et qui ont un titre correspondant à ceux donnés. Cependant,
nous pouvons simplement trouver les billets qui correspondent à l’une ou
l’autre des conditions :

::

    array
    ("or" =>
        array
        (
            "Billet.titre" => array("Premier billet", "Second billet", "Troisième billet"),
            "Billet.created >" => date('Y-m-d', strtotime("-2 weeks")
        )
    )

Cake accepte toute opération booléenne SQL valide, telles que AND, OR,
NOT, XOR, etc., et elles peuvent être en majuscule comme en minuscule,
comme vous préférez. Ces conditions sont également infiniment
"NEST-ABLE". Admettons que vous ayez une relation hasMany/belongsTo
entre Billets et Auteurs, ce qui reviendrait à un LEFT JOIN. Admettons
aussi que vous vouliez trouver tous les billets qui contiennent un
certain mot-clé "magique" ou qui a été créé au cours des deux dernières
semaines, mais que vous voulez restreindre votre recherche aux billets
écrits par Bob :

::

    array (
        "Auteur.nom" => "Bob", 
        "or" => array
        (
            "Billet.titre LIKE" => "%magique%",
            "Billet.created >" => date('Y-m-d', strtotime("-2 weeks")
        )
    )

Cake peut aussi vérifier les champs ``null``. Dans cet exemple, la
requête retournera les enregistrements où le titre du billet n'est pas
``null`` :

::

    array ("not" => array (
            "Billet.titre" => null,
        )
    )

Pour gérer les requêtes BETWEEN, vous pouvez utiliser ceci :

::

    array('Billet.id BETWEEN ? AND ?' => array(1,10))

Note : CakePHP quotera les valeurs numériques selon le type du champ
dans votre base de données.

Qu'en est-il de GROUP BY ?

::

    array('fields'=>array('Produit.type','MIN(Produit.prix) as prix'), 'group' => 'Produit.type');

Les données retournées seront dans le format suivant:

::

    Array
    (
    [0] => Array
    (
    [Produit] => Array
    (
    [type] => Vetement
    )
    [0] => Array
    (
    [prix] => 32
    )
    )
    [1] => Array....

Un rapide exemple de réalisation d'une requête DISTINCT. Vous pouvez
utiliser d'autres opérateurs, tels que MIN(), MAX(), etc., de la même
manière

::

    array('fields'=>array('DISTINCT (Utilisateur.nom) AS nom_de_ma_colonne'), 'order'=>array('Utilisateur.id DESC'));

Vous pouvez créer des conditions très complexes, en regroupant des
tableaux de conditions multiples :

::

    array(
       'OR' => array(
          array('Entreprise.nom' => 'Futurs Gains'),
          array('Entreprise.nom' => 'Le truc qui marche bien')
       ),
       'AND' => array(
          array(
             'OR'=>array(
                array('Entreprise.status' => 'active'),
                'NOT'=>array(
                   array('Entreprise.status'=> array('inactive', 'suspendue'))
                )
             )
         )
       )
    );

Qui produira la requête SQL suivante :

::

    SELECT `Entreprise`.`id`, `Entreprise`.`nom`, 
    `Entreprise`.`description`, `Entreprise`.`location`, 
    `Entreprise`.`created`, `Entreprise`.`status`, `Entreprise`.`taille`

    FROM
       `entreprises` AS `Entreprise`
    WHERE
       ((`Entreprise`.`nom` = 'Futurs Gains')
       OR
       (`Entreprise`.`nom` = 'Le truc qui marche bien'))
    AND
       ((`Entreprise`.`status` = 'active')
       OR (NOT (`Entreprise`.`status` IN ('inactive', 'suspendue'))))
        

**Sous requêtes**

Par exemple, imaginons que nous avons une table "utilisateurs" avec
"id", "nom" et "statuts". Le statuts peut être "A", "B" ou "C". Et nous
voulons récupérer tous les utilisateurs qui ont un statuts différent de
"B" en utilisant une sous requête.

Pour pouvoir effectuer cela, nous allons appeler la source de données du
modèle et lui demander de construire la requête comme si nous appelions
une méthode "find", mais elle retournera uniquement la commande SQL.
Après cela, nous construisons une expression et l'ajoutons au tableau
des conditions.

::

    $conditionsSousRequete['"Utilisateur2"."status"'] = 'B';

    $dbo = $this->Utilisateur->getDataSource();
    $sousRequete = $dbo->buildStatement(
    array(
    'fields' => array('"Urilisateur2"."id"'),
    'table' => $dbo->fullTableName($this->Utilisateur),
    /> 'alias' => 'Utilisateur2',
    'limit' => null,
    'offset' => null,
    'joins' => array(),
    'conditions' =&gt; $conditionsSousRequete,
    'order' => null,
    'group' => null
    ),
    $this->Utilisateur
    );
    $sousRequete = ' "Utilisateur"."id" NOT IN (' . $sousRequete . ') ';
    $expressionSousRequete = $dbo->expression($sousRequete);

    $conditions[] = $expressionSousRequete;

    $this->Utilisateur->find('all', compact('conditions'));

Ceci devrait généré la commande SQL suivante :

::

    SELECT
    "Utilisateur"."id" AS "Utilisateur__id",
    "Utilisateur"."nom" AS "Utilisateur__nom",
    "Utilisateur"."status" AS Utilisateur__status"
    FROM
    "utilisateurs" AS "Utilisateur"
    WHERE
    "Utilisateur"."id" NOT IN (
    SELECT
    "Utilisateur2"."id"
    FROM
    "utilisateurs" AS "Utilisateur2"
    WHERE
    "Utilisateur2"."status" = 'B'
    )

Sauvegarder vos données
=======================

CakePHP rend la sauvegarde des données d’un modèle très rapide. Les
données prêtes à être sauvegardées doivent être passées à la méthode
``save()`` du modèle en utilisant le format basique suivant :

::

    Array
    (
        [NomDuModele] => Array
            (
                [nomduchamp1] => 'valeur'
                [nomduchamp2] => 'valeur'


            )
    )

La plupart du temps vous n’aurez même pas à vous préoccuper de ce format
: le ``HtmlHelper``, ``FormHelper`` et les méthodes de recherche de
CakePHP réunissent les données sous cette forme. Si vous utilisez un de
ces helpers, les données sont également disponibles dans ``$this->data``
pour un usage rapide et pratique.

Voici un exemple simple d’une action de contrôleur qui utilise un modèle
CakePHP pour sauvegarder les données dans une table de la base de
données :

::

    function modifier($id) {
        //Est-ce que des données de formulaires ont été POSTées ?

        if(!empty($this->data)) {
            //Si les données du formulaire peuvent être validées et sauvegardées ...

            if($this->Recette->save($this->data)) {
                //On définit une message flash en session et on redirige.

                $this->Session->setFlash("Recette sauvegardée !");
                $this->redirect('/recettes');
            }
        }

        //Si aucune données de formulaire, on récupère la recette à éditer        
        //et on la passe à la vue


        $this->set('recette', $this->Recette->findById($id));
    }

Note additionnelle : quand ``save()`` est appelée, la donnée qui lui est
passée en premier paramètre est validée en utilisant le mécanisme de
validation de CakePHP (voir le chapitre Validation des Données pour plus
d’informations). Si pour une raison quelconque vos données ne se
sauvegardent pas, pensez à regarder si des règles de validation ne sont
pas insatisfaites.

Il y a quelques autres méthodes du modèle liées à la sauvegarde que vous
trouverez utiles :

``save(array $donnees = null, boolean $valider = true, array $listeDesChamps = array())``

Model::set() peut être utilisée pour définir un ou plusieurs champs de
données dans le tableau des données d'un modèle. Ceci est utile quand on
utilise des modèles en conjonction avec ActiveRecord

::

    $this->Article->read(null, 1);
    $this-&gt;Article->set('title', 'Nouveau titre pour cet article');
    $this->Article->save();

Est un exemple de comment vous pouvez utiliser ``set()`` pour mettre à
jour et sauvegarder un champ simple, dans une approche "ActiveRecord".
Vous pouvez aussi utiliser ``set()`` pour assigner de nouvelles valeurs
à plusieurs champs.

::

    $this-&gt;Article->read(null, 1);
    $this->Article->set(array(
    /> 'title' => 'Nouveau titre',
    'publie' => false
    ));
    $this->Article->save();

Le code si dessus mettra à jour le titre et le champ "publié" et les
sauvegardera dans la base de données.

``save(array $donnees = null, boolean $valide = true, array $listeDeChamps = array())``

La méthode ci-dessus sauvegarde des données formatées sous forme
tabulaire. Le second paramètre vous permet de mettre de côté la
validation, et le troisième vous permet de fournir une liste des champs
du modèle devant être sauvegardés. Pour une sécurité accrue, vous pouvez
limiter les champs sauvegardés à ceux listés dans ``$listeDesChamps``.

Si ``$listeDeChamps`` n'est pas fourni, un utilisateur malicieux peut
ajouter des champs additionnels dans le formulaire de données, et ainsi
changer la valeur de champs qui n'étaient pas prévus à l'origine.

La méthode ``save()`` a également une syntaxe alternative :

``save(array $donnees = null, array $parametres = array())``

Le tableau ``$parametres`` peut avoir n'importe laquelle des options
suivante comme clés :

::

    array(
        'validate' => true,
        'fieldList' => array(),
        'callbacks' => true //o autres valeurs possibles : false, 'before', 'after'
    )

Une fois qu’une sauvegarde a été effectuée, l’ID de l’objet peut-être
trouvé dans l’attribut ``$id`` de l’objet modèle – ceci est
particulièrement pratique lorsque l’on crée de nouveaux objets.

::

    $this->Ingredient->save($nouvelleDonnees);
    $idDuNouvelIngredient = $this->Ingredient->id;

La création ou la mise à jour est contrôlée par le champ ``id`` du
modèle. Si ``$modele->id`` est défini, l'enregistrement avec cette clé
primaire est mis à jour. Sinon, un nouvel enregistrement est créé.

::

    //Création: id n'est pas défini ou est null
    $this->Recette->create();
    $this->Recette->save($this->data);

    //Mise à jour: id est défini à une valeur numérique
    $this->Recette->id = 2;
    $this->Recette->save($this->data);

Lors de l'appel à ``save()`` dans une boucle, n'oubliez pas d'appeler
``create()``.

``create(array $donnees = array())``

Cette méthode initialise la classe du modèle pour sauvegarder de
nouvelles informations.

Si vous renseignez le paramètre ``$data`` (en utilisant le format de
tableau mentionné plus haut), le nouveau modèle créé sera prêt à être
sauvegardé avec ces données (accessibles à ``$this->data``).

Si ``false`` est passé à la place d'un tableau, l'instance du modèle
n'initialisera pas les champs du schéma de modèle qui ne sont pas encore
définis, cela remettra à zéro les champs qui ont déjà été renseignés, et
laissera les autres vides. Utilisez ceci pour éviter de mettre à jour
des champs de la base données qui ont déjà été renseignés et doivent
être mis à jour.

``saveField(string $nomDuChamp, string $valeurDuChamp, $valider = false)``

Utilisé pour sauvegarder la valeur d’un seul champ. Fixez l’ID du modèle
(``$this->NomDuModele->id = $id``) juste avant d’appeler saveField().
Lors de l'utilisation de cette méthode, ``$fieldName`` ne doit contenir
que le nom du champ, pas le nom du modèle et du champ.

Par exemple, pour mettre à jour le titre d'un article de blog, l'appel
depuis un contrôleur à ``saveField`` ressemblerait à quelque chose comme
:

::

    $this->Post->saveField('title', 'Un nouveau titre pour une nouvelle journée');

``updateAll(array $champs, array $conditions)``

Met à jour plusieurs enregistrements en un seul appel. Les
enregistrements à mettre à jour sont identifiés par le tableau
``$conditions``, et les champs devant être mis à jour, ainsi que leurs
valeurs, sont identifiés par le tableau ``$champs``.

Par exemple, si je voulais approuver tous les utilisateurs qui sont
membres depuis plus d’un an, l’appel à update devrait ressembler à
quelque chose du style :

::

    $cette_annee = date('Y-m-d h:i:s', strtotime('-1 year'));

    $this->Utilisateur->updateAll(
        array('Utilisateur.created' => "<= $cette_annee"),
        array('Utilisateur.approuve' => true)


    );

Le tableau ``$champs`` accepte des expressions SQL. Les valeurs
litérales doivent être manuellement quotées.

Par exemple, pour fermer tous les tickets appartenant à un certain
client :

::

    $this->Ticket->updateAll(
        array('Ticket.statut' => "'fermé'"),
        array('Ticket.client_id' => 453)
    );

``saveAll(array $donnees = null, array $options = array())``

Utilisé pour pour sauvegarder (a) des enregistrements individuels
multiples pour un seul modèle ou (b) une entrée, et tous les
enregistrements associés

Les options suivantes peuvent être utilisées :

validate : mettre à ``false`` pour désactiver la validation, à ``true``
pour valider chaque enregistrement avant sauvegarde, "first" pour
valider \*tous\* les enregstrements avant que l'un d'entre eux soit
sauvegardé, ou "only" pour simplement valider les enregistrements sans
les sauvegarder.

atomic : si ``true`` (valeur par défaut), cela tentera de sauvegarder
tous les enregistrements dans une même transaction. Doit être fixé à
``false`` si la base de données/table ne supporte pas les transactions.
Si ``false``, on renvoie un tableau similaire au tableau $donnees passé,
mais les valeurs sont mises à true/false selon si chaque enregistrement
a été sauvegardé avec succès ou non.

fieldList: équivalent au paramètre $fieldList de ``Model::save()``

Pour sauvegarder des enregistrements multiples d'un même modèle,
$donnees doit être un tableau indexé numériquement comme ceci :

::

    Array
    (
        [0] => Array
            (
                [title] => titre 1
            )
        [1] => Array
            (
                [title] => titre 2
            )
    )

La commande pour sauvegarder le tableau $donnees ci-dessus serait :

::

    $this->Article->saveAll($donnees['Article']);

Pour sauvegarder un enregistrement et tous ces enregistrements liés par
une association hasOne ou belongsTo, le tableau de données doit
ressembler à :

::

    Array
    (
        [Utilisateur] => Array
            (
                [pseudo] => billy
            )
        [Profil] => Array
            (
                [sexe] => Homme
                [emploi] => Programmeur
            )
    )

La commande pour sauvegarder le tableau $donnees ci-dessus serait :

::

    $this->Article->saveAll($donnees);

Pour sauvegarder un enregistrement et tous ces enregistrements liés par
une association hasMany, le tableau de données doit ressembler à :

::

    Array
    (
        [Article] => Array
            (
                [title] => Mon premier article
            )
        [Commentaire] => Array
            (
                [0] => Array
                    (
                        [commentaire] => Commentaire 1
                [utilisateur_id] => 1
                    )
            [1] => Array
                    (
                        [commentaire] => Commentaire 2
                [utilisateur_id] => 2
                    )
            )
    )

La commande pour sauvegarder le tableau $donnees ci-dessus serait :

::

    $this->Article->saveAll($donnees);

Sauvegarder des données en relation à l'aide de ``saveAll()`` ne
marchera que pour les modèles qui ont effectivement une (ou plusieurs)
relation définie.

Sauvegarder les données des modèles liés (hasOne, hasMany, belongsTo)
---------------------------------------------------------------------

Quand on travaille avec des modèles associés, il est important de
réaliser que sauvegarder les données d'un modèle doit toujours se faire
depuis le modèle CakePHP correspondant. Si vous sauvegardez un nouveau
Post et ses Commentaires associés, vous devrez alors utiliser à la fois
les modèles Post et Commentaire durant l'opération de sauvegarde.

Si aucun enregistrement des modèles associés n'existe dans le système à
ce moment là (par exemple si vous souhaitez sauvegarder un nouvel
Utilisateur et ses enregistrements de Profil liés en même temps), vous
devrez d'abord sauvegarder le modèle primaire (ou parent).

Pour avoir une idée de comment cela fonctionne, imaginons que nous ayons
une action dans notre contrôleur UtilisateurController qui permette de
sauvegarder un nouvel Utilisateur et un Profil lié. L'exemple d'action
ci-dessous supposera que vous ayez POSTé suffisamment de données (en
utilisant le FormHelper) pour créer un Utilisateur et un Profil.

::

    <?php
    function add() {
        if (!empty($this->data)) {
        
        
            // On peut sauvegarder les données Utilisateur
            // elles devraient être dans $this->data['Utilisateur']

            $utilisateur = $this->Utilisateur->save($this->data);

            
            
            // Si l'utilisateur a été sauvegardé nous ajoutons cette information aux données à sauvegarder
            // et sauvegardons le Profil

            
            if (!empty($utilisateur)) {
                // L'ID de l'Utilisateur nouvellement créé a été stockée dans
                // $this->Utilisateur->id.
                $this->data['Profil']['utilisateur_id'] = $this->Utilisateur->id;

                // Car Utilisateur hasOne Profil, nous pouvons accéder
                // au modèle Profil à travers le modèle Utilisateur :
                $this->Utilisateur->Profil->save($this->data);
            }
        }
    }
    ?>

Une règle lorsque l'on travaille avec les associations hasOne, hasMany
et belongsTo : tout n'est que manipulation de clés. L'idée de base est
de prendre la clé d'un modèle et de la placer dans le champ de clé
étrangère de l'autre. Quelquefois, cela implique l'utilisation de
l'attribut ``$id`` de la classe de modèle après une sauvegarde
(``save()``), mais dans d'autres cas il s'agit simplement de la
récupération d'un ID depuis le champ caché du formulaire qui a été POSTé
vers une action de contrôleur.

En complément de l'approche basique utilisée ci-dessus, CakePHP offre
une méthode ``saveAll()`` très pratique, qui permet de valider et de
sauvegarder des modèles multiples en une seule fois. De plus,
``saveAll()`` fournit un support transactionnel pour assurer l'intégrité
des données dans votre base de données (càd que si votre modèle ne
parvient pas à se sauvegarder, les autres modèles ne seront pas
sauvegardés non plus).

Pour que les transactions fonctionnent correctement dans MySQL vos
tables doivent utiliser InnoDB. Rappelez-vous que le tables MyISAM ne
supportent pas les transactions.

Regardons comment nous pouvons utiliser ``saveAll()`` pour sauvegarder
les modèles Entreprise et Compte en même temps.

D'abord, vous devrez construire votre formulaire à la fois pour les
modèles Entreprise et Compte (nous supposerons qu'une Entreprise
*hasMany* Compte).

::

    echo $form->create('Entreprise', array('action'=>'ajouter'));
    echo $form->input('Entreprise.nom', array('label'=>'Nom de l\'entreprise'));
    echo $form->input('Entreprise.description');
    echo $form->input('Entreprise.localisation');

    echo $form->input('Compte.0.nom', array('label'=>'Nom du compte'));
    echo $form->input('Compte.0.login');
    echo $form->input('Compte.0.email');

    echo $form->end('Ajouter');

Jetons un œil à la manière dont nous avons nommé les champs du
formulaire pour le modèle Compte. Si Entreprise est notre modèle
principal, ``saveAll()`` s'attendra à ce que les données des modèles
liés (Compte) arrivent dans un format spécifique. Ainsi,
``Compte.0.nomDuChamp`` est exactement ce dont nous avons besoin.

Le nommage des champs ci-dessus est nécessaire pour une association
*hasMany*. Si l'association entre les modèles est de type *hasOne*, il
faudra utiliser la notation NomDuModele.nomChamp pour le modèle associé.

Maintenant, dans notre contrôleur entreprises\_controller nous pouvons
créer une action ``ajouter()`` :

::


    function ajouter() {
       if(!empty($this->data)) {
          $this->Entreprise->saveAll($this->data, array('validate'=>'first'));
       }
    }

C'est tout ce qu'il y a à faire. Désormais nos modèles Entreprise et
Compte seront tous deux validés et sauvegardés au même moment. Une chose
à noter, est l'utilisation ici de ``array('validate'=>'first')``, cette
option nous assure que les deux modèles seront validés.

counterCache - Mettez en cache vos count()
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Cette fonction vous aide à mettre en cache le décompte des données
associées. Plutôt que de compter les enregistrements manuellement, avec
find('count'), le modèle traque lui-même, tout ajout/suppression dans le
modèle associé par $hasMany et incrémente/décrémente un champ integer
dédié, dans la table du modèle parent.

Le nom de ce champ est constitué du nom du modèle au singulier suivi par
un tiret bas (*underscore*) et du mot ``count``.

::

    mon_modele_count

Imaginons que vous ayez un modèle appelé ``ImageCommentaire`` et un
modèle appelé ``Image``, vous ajouteriez un nouveau champ INT à la table
``image`` et le nommeriez ``image_commentaire_count``.

Voici d'autres exemples:

+---------------+--------------------------+----------------------------------------------------+
| Modèle        | Modèle associé           | Example                                            |
+===============+==========================+====================================================+
| Utilisateur   | Image                    | utilisateurs.image\_count                          |
+---------------+--------------------------+----------------------------------------------------+
| Image         | ImageCommentaire         | images.images\_commentaires\_count                 |
+---------------+--------------------------+----------------------------------------------------+
| BlogArticle   | BlogArticleCommentaire   | blog\_articles.blog\_article\_commentaire\_count   |
+---------------+--------------------------+----------------------------------------------------+

Dès que vous avez ajouter un champ compteur, tout est bon. Activer le
counter-cache dans votre association en ajoutant une clef
``counterCache`` et en paramétrant la valeur sur ``true``.

::

    class Image extends AppModel {
        var $belongsTo = array(
            'ImageAlbum' => array('counterCache' => true)
        );
    }

Maintenant, chaque fois que vous ajoutez ou retirez une nouvelle
``Image`` à ``ImageAlbum``, le nombre dans ``image_count`` sera ajusté
en conséquence.

Vous pouvez aussi spécifier un ``counterScope``. Il vous permet
essentiellement de spécifier une condition simple, qui indique au modèle
quand se mettre à jour (ou pas, cela dépend de votre façon de voir les
choses) la valeur du compteur.

En reprenant l'exemple de notre modèle Image, nous pouvons le spécifier
ainsi :

::

    class Image extends AppModel {
        var $belongsTo = array(
            'ImageAlbum' => array(
                'counterCache' => true,
                'counterScope' => array('Image.active' => 1) // Compte seulement si 'Image est actif = 1
        ));
    }

Sauvegarder les données des modèles liés (HABTM)
------------------------------------------------

Sauvegarder des modèles qui sont associés par un hasOne, belongsTo et
hasMany est relativement simple : vous n'avez qu'à renseigner la clé
étrangère avec l'ID du modèle associé. Une fois que ceci est fait, il
vous suffit d'appeler la méthode save() sur le modèle et tout se reliera
correctement.

Avec les relations HABTM, vous devez fixer l'ID du modèle associé dans
votre tableau de données. Nous allons construire un formulaire qui crée
un nouveau tag et l'associe à la volée à une recette.

Le formulaire le plus simpliste ressemblerait à quelque chose comme ceci
(nous supposerons que $recette\_id contient déjà une valeur) :

::

    <?php echo $form->create('Tag');?>
        <?php echo $form->input(
            'Recette.id', 
            array('type'=>'hidden', 'value' => $recette_id)); ?>
        <?php echo $form->input('Tag.nom'); ?>
        <?php echo $form->end('Ajouter le tag'); ?>

Dans cet exemple, vous pouvez remarquer le champ caché ``Recette.id``
dont la valeur est l'ID de la recette à laquelle nous voulons relier le
tag.

Quand la méthode ``save()`` est invoquée dans le contrôleur, elle
sauvera automatiquement les données HABTM dans la base de données.

::

    function add() {
        // Sauvegarde l'association
        if ($this->Tag->save($this->data)) {
            // Faire quelque chose en cas d'enregistrement réussi
        }
    }

Avec le code précédent, notre nouveau Tag est créé et associé avec une
Recette, dont l'ID était défini dans $this->data['Recette']['id'].

Pour d'autres raisons nous pourrions vouloir présenter les données
associées sous forme de liste déroulante. Les données peuvent être
récupérées depuis le modèle en utilisant la méthode ``find('list')`` et
assignées à une variable de vue au nom du modèle. Un champ input avec le
même nom sera automatiquement affiché comme un ``select`` contenant les
données.

::

    // dans le contrôleur
    $this->set('tags', $this->Recette->Tag->find('list'));

    // dans la vue
    $form->input('tags');

Un scénario plus probable avec une relation HABTM inclurait un ensemble
de ``select`` pour permettre des sélections multiples. Par exemple, une
Recette peut avoir de multiples Tags qui lui sont assignés. Dans ce cas,
les données sont tirées du modèle de la même manière, mais le champ de
formulaire est déclaré de manière un peu différente. Le nom du tag est
défini en utilisant la convention ``NomModele``.

::

    // dans le contrôleur
    $this->set('tags', $this->Recette->Tag->find('list'));

    // dans la vue
    $form->input('Tag');

En utilisant le code précédent, un menu déroulant de sélection multiple
est créé, permettant la sauvegarde automatique de choix multiples pour
la Recette existante, lors d'un ajout ou d'une sauvegarde dans la base
de données.

**Que faire quand la relation HABTM devient compliquée ?**

Par défaut, en sauvant une relation "HasAndBelongsToMany", Cake effacera
toutes les lignes de la table de jointure avant de sauvegarder les
nouvelles. Par exemple, si vous avez un "Club" qui a 10 "Affilié"
associés, et que vous mettez à jour le "Club" avec 2 nouveaux "Affilié",
le "Club" ne comptera que 2 "Affilié", et pas 12.

Notez également que, si vous voulez ajouter d'autres champs à la table
de jointure (quand il a été créé ou des métas informations), c'est
possible avec les tables de jointure HABTM, mais il est important de
comprendre que vous avez une option plus facile.

Une relation HABTM entre deux modèles est en réalité un raccourci pour
trois modèles associés deux à deux par des relations hasMany et
belongsTo.

Considérons cet exemple :

::

    Affilié hasAndBelongsToMany Club

Une autre façon de voir les choses est d'ajouter un modèle "Abonnement"

::

    Affilié hasMany Abonnement
    Abonnement belongsTo Affilié, Club
    Club hasMany Abonnement

Ces deux exemples sont quasiment identiques. Ils utilisent le même
nombre de champs dans la base de données et le même nombre de modèles.
Les différences importantes sont que le modèle de jointure est nommé
différemment et que son comportement est plus prévisible.

Quand votre table de jointure contient des champs en plus des clés
étrangères, la plupart du temps, il est plus facile de créer un modèle
pour la jointure et des relations "hasMany" et "belongsTo" comme dans
l'exemple ci-dessus, au lieu d'utiliser des relations HABTM.

Supprimer des données
=====================

Ces méthodes peuvent être utilisées pour supprimer des données.

delete
------

``delete(int $id = null, boolean $cascade = true);``

Supprime l'enregistrement identifié par $id. Par défaut, supprime
également les enregistrements dépendants de l'enregistrement mentionné
comme devant être supprimé.

Par exemple, lors de la suppression d'un enregistrement Utilisateur lié
à plusieurs enregistrements Recette :

-  si $cascade est fixé à *true*, les entrées Recette liées sont aussi
   supprimées si les valeurs "dependant" des modèles sont à *true*.
-  si $cascade est fixé à *false*, les entrées Recette resteront après
   que l'Utilisateur ait été supprimé.

deleteAll
---------

``deleteAll(mixed $conditions, $cascade = true, $callbacks = false)``

Identique à ``delete()`` et ``remove()``, sauf que ``deleteAll()``
supprime tous les enregistrements correspondant aux conditions fournies.
Le tableau ``$conditions`` doit être un fragment SQL ou un tableau.

Associations : relier les modèles entre eux
===========================================

Une des caractéristiques les plus puissantes de CakePHP est sa capacité
d'établir les liens nécessaires entre les modèles d'après les
informations fournies. Dans CakePHP, les liens entre modèles sont gérés
par des associations.

Definir les relations entre différents objets à l'intérieur de votre
application devrait être une tâche naturelle. Par exemple : dans une
base de données de recettes, une recette peut avoir plusieurs versions,
chaque version n'a qu'un seul auteur et les auteurs peuvent avoir
plusieurs recettes. Le fait de définir le fonctionnement de ces
relations vous permet d'accéder à vos données de manière intuitive et
puissante.

Le but de cette section est de vous montrer comment concevoir, définir
et utiliser les associations entre les modèles au sein de CakePHP.

Bien que les données peuvent être issues d'une grande variété de
sources, la forme de stockage la plus répandue dans les applications web
est la base de données relationnelle. La plupart de ce qui est couvert
par cette section le sera dans ce contexte.

Pour des informations sur les associations avec les modèles de Plugin,
voyez `Modèles de plugins </fr/view/117/Plugin-Models>`_.

Types de relations
------------------

Les quatre types d'associations dans CakePHP sont : hasOne (*a un
seul*), hasMany (*a plusieurs*), belongsTo (*appartient à*), et
hasAndBelongsToMany (HABTM) (*appartient à et est composé de
plusieurs*).

+----------------------------+-----------------------+--------------------------------------------------------+
| Relation                   | Type d'association    | Exemple                                                |
+============================+=======================+========================================================+
| un vers un                 | hasOne                | Un utilisateur a un profil.                            |
+----------------------------+-----------------------+--------------------------------------------------------+
| un vers plusieurs          | hasMany               | Un utilisateur peut avoir plusieurs recettes.          |
+----------------------------+-----------------------+--------------------------------------------------------+
| plusieurs vers un          | belongsTo             | Plusieurs recettes appartiennent à un utilisateur.     |
+----------------------------+-----------------------+--------------------------------------------------------+
| plusieurs vers plusieurs   | hasAndBelongsToMany   | Les recettes ont, et appartiennent à plusieurs tags.   |
+----------------------------+-----------------------+--------------------------------------------------------+

Les associations se définissent en créant une variable de classe nommée
comme l'association que vous souhaitez définir. La variable de classe
peut quelquefois se limiter à une chaîne de caractère, mais peut
également être aussi complète qu'un tableau multi-dimensionnel utilisé
pour définir les spécificité de l'association.

::

    <?php

    class Utilisateur extends AppModel {
        var $name = 'Utilisateur ';
        var $hasOne = 'Profil';
        var $hasMany = array(
            'Recette' => Array
                'className'  => 'Recette',
                'conditions' => array('Recette.acceptee' => '1'),
                'order'      => 'Recette.created DESC'
            )
        );
    }

    ?>

Dans l'exemple ci-dessus, la première instance du mot 'Recette' est ce
que l'on appelle un 'Alias'. C'est un identifiant pour la relation et
cela peut être ce que vous souhaitez. En règle générale, on choisit le
même nom que la classe qu'il référence. Toutefois, les alias doivent
être uniques à la fois dans un modèle et de part et d'autre d'une
relation belongsTo/hasMany ou belongsTo/hasOne. Choisir des noms
non-uniques pour des alias de modèle peut engendrer des comportements
non souhaités.

Cake créera automatiquement des liens entre les objets de modèles
associés. Par exemple dans notre modèle ``Utilisateur`` vous pourrez
accéder au modèle ``Recette`` par

::

    $this->Recette->uneFonction();

De la même manière dans votre contrôleur vous pouvez accéder à un modèle
associé en suivant simplement les associations de modèle et sans
l'ajouter dans le tableau ``$uses`` :

::

    $this->Utilisateur->Recette->uneFonction();

Rappelez-vous que les associations sont définies 'dans un seul sens'. Si
vous définissez Utilisateur *hasMany* Recette cela n'aura aucun effet
sur le modèle Recette. Vous devrez définir Recette *belongsTo*
Utilisateur pour pouvoir accéder au modèle Utilisateur depuis le modèle
Recette.

hasOne
------

Mettons en place un modèle Utilisateur avec une relation de type hasOne
vers un modèle Profil.

Tout d'abord, les tables de votre base de données doivent être saisies
correctement. Pour qu'une relation de type hasOne fonctionne, une table
doit contenir une clé étrangère qui pointe vers un enregistrement de
l'autre. Dans notre cas la table profils contiendra un champ nommé
utilisateur\_id. Le motif de base est :

+-----------------------------+---------------------------+
| Relation                    | Schéma                    |
+=============================+===========================+
| Pomme hasOne Banane         | bananes.pomme\_id         |
+-----------------------------+---------------------------+
| Utilisateur hasOne Profil   | profils.utilisateur\_id   |
+-----------------------------+---------------------------+
| Docteur hasOne Maitre       | maitres.docteur\_id       |
+-----------------------------+---------------------------+

Table: **hasOne:** l'*autre* modèle contient la clé étrangère.

Le fichier du modèle Utilisateur sera sauvegardé dans
/app/models/utilisateur.php. Pour définir l'association 'Utilisateur
hasOne Profil', ajoutez la propriété $hasOne à la classe du modèle.
Pensez à avoir un modèle Profil dans /app/models/profil.php, sans quoi
l'association ne fonctionnera pas.

::

    <?php

    class Utilisateur  extends AppModel {
        var $name = 'Utilisateur ';                
        var $hasOne = 'Profil';   
    }
    ?>

Il y a deux manières de décrire cette relation dans vos fichiers de
modèle. La méthode la plus simple est de fixer comme valeur à l'attribut
$hasOne une chaîne de caractères contenant le nom de la classe associée
au modèle, comme nous l'avons fait ci-dessus.

Si vous avez besoin de plus de contrôle, vous pouvez définir vos
associations en utilisant un tableau. Par exemple, vous pourriez vouloir
classer les colonnes par date décroissante, ou limiter l'association
afin qu'elle n'inclue que certains enregistrements.

::

    <?php

    class Utilisateur  extends AppModel {
        var $name = 'Utilisateur ';          
        var $hasOne = array(
            'Profile' => array(
                'className'    => 'Profil',
                'conditions'   => array('Profil.publie' => '1'),
                'dependent'    => true
            )
        );    
    }
    ?>

Les clés possibles pour un tableau décrivant une association $hasOne
sont :

-  **className** : le nom de la classe du modèle que l'on souhaite
   associer au modèle actuel. Si l'on souhaite définir la relation
   'Utilisateur a un Profil', la valeur associée à la clé 'className'
   devra être 'Profil'.
-  **foreignKey** : le nom de la clé etrangère que l'on trouve dans
   l'autre modèle. Ceci sera particulièrement pratique si vous avez
   besoin de définir des relations hasOne multiples. La valeur par
   défaut de cette clé est le nom du modèle actuel (avec des
   underscores) suffixé avec '\_id'. Dans l'exemple ci-dessus la valeur
   par défaut aurait été 'utilisateur\_id'.
-  **conditions** : un fragment de code SQL utilisé pour filtrer les
   enregistrements du modèle relié. C'est une bonne pratique que
   d'utiliser les noms des modèles dans ces portions de code :
   "Profil.approuve = 1" sera toujours mieux qu'un simple "approuve =
   1".
-  **fields** : une liste des champs à récupérer lorsque les données du
   modèle associé sont parcourues. Par défaut, cela retourne tous les
   champs.
-  **order** : un fragment SQL qui définit l'ordre pour les lignes de
   résultats retournées.
-  **dependent** : lorsque la valeur de la clé 'dependent' est true et
   que la méthode delete() du modèle est appelée avec le paramètre
   'cascade' valant true également, les enregistrements des modèles
   associés sont supprimés. Dans ce cas nous avons fixé la valeur à true
   de manière à ce que la suppression d'un Utilisateur supprime
   également le Profil associé.

Une fois que cette association aura été définie, les opérations de
recherche sur le modèle Utilisateur récupèreront également les
enregistrements Profils liés s'il en existe :

::

    //Exemple de résultats d'un appel à $this->Utilisateur->find().

    Array
    (
        [Utilisateur] => Array
            (
                [id] => 121
                [nom] => Gwoo le Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Profil] => Array
            (
                [id] => 12
                [utilisateur_id] => 121
                [competences] => Cuisiner des gâteaux
                [created] => 2007-05-01 10:31:01
            )
    )

belongsTo
---------

Maintenant que nous avons accès aux données du Profil depuis le modèle
Utilisateur, définissons une association belongsTo (appartient a) dans
le modèle Profil afin de pouvoir accéder aux données Utilisateur liées.
L'association belongsTo est un complément naturel aux associations
hasOne et hasMany : elle permet de voir les données dans le sens
inverse.

Lorsque vous définissez les clés de votre base de données pour une
relation de type belongsTo, suivez cette convention :

+--------------------------------+---------------------------+
| Relation                       | Schéma                    |
+================================+===========================+
| Banane belongsTo Pomme         | bananes.pomme\_id         |
+--------------------------------+---------------------------+
| Profil belongsTo Utilisateur   | profils.utilisateur\_id   |
+--------------------------------+---------------------------+
| Maitre belongsTo Docteur       | maitres.docteur\_id       |
+--------------------------------+---------------------------+

Table: **belongsTo:** le modèle *actuel* contient la clef étrangère.

Si un modèle (table) contient une clé étrangère, elle appartient à
(*belongsTo*) l'autre modèle (table).

On peut définir l'association belongsTo dans notre modèle Profil
(/app/models/profil.php) en utilisant une chaîne de caractère de cette
manière :

::

    <?php

    class Profil extends AppModel {
        var $name = 'Profil';                
        var $belongsTo = 'Utilisateur';   
    }
    ?>

Nous pouvons également définir une relation plus spécifique en utilisant
un tableau :

::

    <?php

    class Profil extends AppModel {
        var $name = 'Profil';                
        var $belongsTo = array(
            'Utilisateur' => array(
                'className'    => 'Utilisateur',
                'foreignKey'    => 'utilisateur_id'
            )
        );  
    }
    ?>

Les clés possibles pour le tableau d'association belongsTo sont :

-  **className** : le nom de la classe du modèle que l'on souhaite
   associer au modèle actuel. Si l'on souhaite définir la relation
   'Profil appartient à Utilisateur', la valeur associée à la clef
   'className' devra être 'Utilisateur'.
-  **foreignKey** : le nom de la clef étrangère que l'on trouve dans le
   modèle actuel. Ceci sera particulièrement pratique si vous avez
   besoin de définir des relations belongsTo multiples. La valeur par
   défaut de cette clef est le nom de l'autre modèle (avec des
   underscores) suffixé avec '\_id'.
-  **conditions** : un fragment de code SQL utilisé pour filtrer les
   enregistrements du modèle relié. C'est une bonne pratique que
   d'utiliser les noms des modèles dans ces portions de code :
   "Utilisateur.actif = 1" sera toujours mieux qu'un simple "actif = 1".
-  **fields** : une liste des champs à récupérer lorsque les données du
   modèle associé sont parcourues. Par défaut, cela retourne tous les
   champs.
-  **order** : un fragment SQL qui définit l'ordre des lignes de
   résultat retournées.
-  **counterCache** : si il vaut true le Modèle associé incrémentera ou
   décrémentera automatiquement le champ
   "[nom\_du\_modele\_au\_singulier]\_count" dans la table étrangère dès
   qu'un appel a save() ou delete() sera effectué. Si c'est une chaîne
   de caractère alors cela représente le nom du champ à utiliser. La
   valeur dans le champ du compteur représente le nombre
   d'enregistrements liés.
-  **counterScope** : tableau de conditions optionnelles à utiliser pour
   mettre à jour le champ du cache de compteur.

Une fois que cette association aura été définie, les opérations de
recherche sur le modèle Profil récupèreront également les
enregistrements Utilisateurs liés s'il en existe :

::

    //Exemple de résultats d'un appel à $this->Profil->find().

    Array
    (
       [Profil] => Array
            (
                [id] => 12
                [utilisateur_id] => 121
                [competences] => Cuisiner des gâteaux
                [created] => 2007-05-01 10:31:01
            )    
        [Utilisateur] => Array
            (
                [id] => 121
                [nom] => Gwoo le Kungwoo
                [created] => 2007-05-01 10:31:01
            )
    )

hasMany
-------

Prochaine étape : définir une association "Utilisateur hasMany
Commentaire". Une association hasMany nous permettra de récupérer les
commentaires d'un utilisateur lors de la récupération d'un
enregistrement Utilisateur.

Lorsque vous définissez les clés de votre base de données pour une
relation de type hasMany, suivez cette convention :

**hasMany:** l'*autre* modèle contient la clé étrangère.

Relation

Schéma

Utilisateur hasMany Commentaire

Commentaire.utilisateur\_id

Cake hasMany Vertue

Vertue.cake\_id

Produit hasMany Option

Option.produit\_id

On peut définir l'association hasMany dans notre modèle Utilisateur
(/app/models/utilisateur.php) en utilisant une chaîne de caractère de
cette manière :

::

    <?php

    class Utilisateur extends AppModel {
        var $name = 'Utilisateur ';                
        var $hasMany = 'Commentaire';   
    }
    ?>

Nous pouvons également définir une relation plus spécifique en utilisant
un tableau :

::

    <?php

    class Utilisateur extends AppModel {
        var $name = 'Utilisateur ';                
        var $hasMany = array(
            'Commentaire' => array(
                'className'     => 'Commentaire',
                'foreignKey'    => 'utilisateur_id',
                'conditions'    => array('Commentaire.statut' => '1'),
                'order'    => 'Commentaire.created DESC',
                'limit'        => '5',
                'dependent'=> true
            )
        );  
    }
    ?>

Les clés possibles pour les tableaux d'association hasMany sont :

-  **className**: le nom de la classe du modèle que l'on souhaite
   associer au modèle actuel. Si l'on souhaite définir la relation
   'Utilisateur a plusieurs Commentaire', la valeur associée à la clef
   'className' devra être 'Commentaire'.
-  **foreignKey**: le nom de la clé etrangère que l'on trouve dans
   l'autre modèle. Ceci sera particulièrement pratique si vous avez
   besoin de définir des relations hasMany multiples. La valeur par
   défaut de cette clef est le nom du modèle actuel (avec des
   underscores) suffixé avec '\_id'.
-  **conditions**: un fragment de code SQL utilisé pour filtrer les
   enregistrements du modèle relié. C'est une bonne pratique que
   d'utiliser les noms des modèles dans ces portions de code :
   "Commentaire.statut= 1" sera toujours mieux qu'un simple "statut =
   1".
-  **fields**: une liste des champs à récupérer lorsque les données du
   modèle associé sont parcourues. Par défaut, cela retourne tous les
   champs.
-  **order**: un fragment de code SQL qui définit l'ordre des entrées
   associées.
-  **limit**: le nombre maximum d'entrées associées qui seront
   retournées.
-  **offset**: le nombre d'entrées associées à sauter (les conditions et
   l'ordre de classement étant donnés) avant de récupérer de nouveaux
   enregistrements et de les associer.
-  **dependent**: lorsque dependent vaut true, une suppression récursive
   du modèle est possible. Dans cet exemple, les enregistrements
   Commentaires seront supprimés lorsque leur Utilisateur associé l'aura
   été.
-  **exclusive**: Lorsque exclusive est fixé à *true*, la suppression
   récursive de modèle effectue la suppression avec un deleteAll() au
   lieu du supprimer chaque entité séparément. Cela améliore grandement
   la performance, mais peut ne pas être idéal dans toutes les
   circonstances.
-  **finderQuery**: une requête SQL complète que CakePHP peut utiliser
   pour retrouver les enregistrements associés au modèle. Ceci ne
   devrait être utilisé que dans les situations qui nécessitent des
   résultats très personnalisés.
   Si une de vos requêtes a besoin d'une référence à l'ID du modèle
   associé, utilisez le marqueur spécial ``{$__cakeID__$}`` dans la
   requête. Par exemple, si votre modèle Pomme hasMany Orange, la
   requête devrait ressembler à ça :

   ::

       SELECT Orange.* from oranges as Orange WHERE Orange.pomme_id = {$__cakeID__$};

Une fois que cette association a été définie, les opérations de
recherche sur le modèle Utilisateur récupèreront également les
Commentaires reliés si ils existent :

::

    //Exemple de résultats d'un appel à $this->Utilisateur->find().

    Array
    (  
        [Utilisateur] => Array
            (
                [id] => 121
                [nom] => Gwoo le Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Commentaire] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [utilisateur_id] => 121
                        [titre] => Sur Gwoo le Kungwoo
                        [corps] => La Kungwooité est assez Gwooteuse
                        [created] => 2006-05-01 10:31:01
                    )
                [1] => Array
                    (
                        [id] => 123
                        [utilisateur_id] => 121
                        [titre] => Plus sur Gwoo
                        [corps] => Mais qu'en est-il ?
                        [created] => 2006-05-01 10:41:01
                    )
            )
    )

Une chose dont il faut se rappeler est que vous aurez besoin d'une
association "Commentaire belongsTo Utilisateur" en complément, afin de
pouvoir récupérer les données dans les deux sens. Ce que nous avons
défini dans cette section vous donne la possibilité d'obtenir les
données de Commentaire depuis l'Utilisateur. En ajoutant l'association
"Commentaire belongsTo Utilisateur" dans le modèle Commentaire, vous
aurez la possibilité de connaître les données de l'Utilisateur depuis le
modèle Commentaire - cela complète la connexion entre eux et permet un
flot d'informations depuis n'importe lequel des deux modèles.

hasAndBelongsToMany (HABTM)
---------------------------

Très bien. A ce niveau, vous pouvez déjà vous considérer comme un
professionnel des associations de modèles CakePHP. Vous vous êtes déjà
assez compétents dans les 3 types d'associations afin de pouvoir
effectuer la plus grande partie des relations entre les objets.

Abordons maintenant le dernier type de relation : hasAndBelongsToMany
*(a et appartient à plusieurs)*, ou HABTM. Cette association est
utilisée lorsque vous avez deux modèles qui ont besoin d'être reliés, de
manière répétée, plusieurs fois, de plusieurs façons différentes.

La principale différence entre les relations hasMany et HABTM est que le
lien entre les modèles n'est pas exclusif dans le cadre d'une relation
HABTM. Par exemple, relions notre modèle Recette avec un modèle Tag en
utilisant HABTM. Le fait d'attacher le tag "Italien" à la recette de
Gnocchi de ma grand-mère ne "consomme" pas le tag. Je peux aussi taguer
mes Spaghettis Caramélisées au miel comme "Italien" si je le souhaite.

Les liens entre des objets liés par une association hasMany sont
exclusif. Si mon Utilisateur "hasMany" Commentaires, un commentaire ne
sera lié qu'à un utilisateur spécifique. Il ne sera plus disponible pour
d'autres.

Continuons. Nous aurons besoin de mettre en place une table
supplémentaire dans la base de données qui contiendra les associations
HABTM. Le nom de cette nouvelle table de jointure doit inclure les noms
des deux modèles concernés, dans l'ordre alphabétique, et séparés par un
underscore (\_). La table doit contenir au minimum deux champs, chacune
des clés étrangères (qui devraient être des entiers) pointant sur les
deux clés primaires des modèles concernés. Pour éviter tous problèmes,
ne définissez pas une première clé composée de ces deux champs, si votre
application le nécessite vous pourrez définir un index unique. Si vous
prévoyez d'ajouter de quelconques informations supplémentaires à cette
table, c'est une bonne idée que d'ajouter un champ supplémentaire comme
clé primaire (par convention 'id') pour rendre les actions sur la table
aussi simple que pour tout autre modèle.

**HABTM** Nécessite une table de jointure séparée qui contient les deux
noms de *modèles*.

+---------------------+-------------------------------------------------------------------------------------+
| Relation            | Schéma (table HABTM en gras)                                                        |
+=====================+=====================================================================================+
| Recette HABTM Tag   | **recettes\_tags**.id, **recettes\_tags**.recette\_id, **recettes\_tags**.tag\_id   |
+---------------------+-------------------------------------------------------------------------------------+
| Cake HABTM Fan      | **cakes\_fans**.id, **cakes\_fans**.cake\_id, **cakes\_fans**.fan\_id               |
+---------------------+-------------------------------------------------------------------------------------+
| Foo HABTM Bar       | **bars\_foos**.id, **bars\_foos**.foo\_id, **bars\_foos**.bar\_id                   |
+---------------------+-------------------------------------------------------------------------------------+

Le nom des tables est par convention dans l'ordre alphabétique.

Une fois que cette nouvelle table a été créée, on peut définir
l'association HABTM dans les fichiers de modèle. Cette fois ci, nous
allons directement voir la syntaxe tabulaire :

::

    <?php

    class Recette extends AppModel {
        var $name = 'Recette';   
        var $hasAndBelongsToMany = array(
            'Tag' =>
                array(
                     'className'              => 'Tag',
                     'joinTable'              => 'recettes_tags',
                     'with'                   => '',
                    'foreignKey'             => 'recette_id',
                    'associationForeignKey'  => 'tag_id',
                    'unique'                 => true,
                    'conditions'             => '',
                    'fields'                 => '',
                    'order'                  => '',
                    'limit'                  => '',
                    'offset'                 => '',
                    'finderQuery'            => '',
                    'deleteQuery'            => '',
                    'insertQuery'            => ''
                )
        );
    }
    ?>

Les clés possibles pour un tableau définissant une association HABTM
sont :

-  **className**: le nom de la classe du modèle que l'on souhaite
   associer au modèle actuel. Si l'on souhaite définir la relation
   'Utilisateur HABTM Commentaire', la valeur associée à la clef
   'className' devra être 'Commentaire'.
-  **joinTable**: Le nom de la table de jointure utilisée dans cette
   association (si la table ne colle pas à la convention de nommage des
   tables de jointure HABTM).
-  **with**: Définit le nom du modèle pour la table de jointure. Par
   défaut CakePHP créera automatiquement un modèle pour vous. Dans
   l'exemple ci-dessus la valeur aurait été RecettesTag. En utilisant
   cette clé vous pouvez surcharger ce nom par défaut. Le modèle de la
   table de jointure peut être utilisé comme tout autre modèle
   "classique" pour accéder directement à la table de jointure.
-  **foreignKey**: le nom de la clef étrangère que l'on trouve dans le
   modèle actuel. Ceci sera particulièrement pratique si vous avez
   besoin de définir des relations HABTM multiples. La valeur par défaut
   de cette clé est le nom du modèle actuel (avec des underscores)
   suffixé avec '\_id'.
-  **associationForeignKey**: le nom de la clé etrangère que l'on trouve
   dans l'autre modèle. Ceci sera particulièrement pratique si vous avez
   besoin de définir des relations HABTM multiples. La valeur par défaut
   de cette clef est le nom de l'autre modèle (avec des underscores)
   suffixé avec '\_id'.
-  **unique**: Si *true* (valeur par défaut) Cake supprimera d'abord les
   enregistrement des relations existantesdans la table des clés
   étrangères avant d'en insérer de nouvelles, lors de la mise à jour
   d'un enregistrement. Ainsi les associations existantes devront être
   passées encore une fois lors d'une mise à jour.
-  **conditions**: un fragment de code SQL utilisé pour filtrer les
   enregistrements du modèle relié. C'est une bonne pratique que
   d'utiliser les noms des modèles dans ces portions de code :
   "Commentaire.statut= 1" sera toujours mieux qu'un simple "statut =
   1".
-  **fields**: une liste des champs à récupérer lorsque les données du
   modèle associé sont parcourues. Par défaut, cela retourne tous les
   champs.
-  **order**: un fragment de code SQL qui définit l'ordre des entrées
   associées.
-  **limit**: le nombre maximum d'entrées associées qui seront
   retournées.
-  **offset**: le nombre d'entrées associées à sauter (les conditions et
   l'ordre de classement étant donnés) avant de récupérer de nouveaux
   enregistrements et de les associer.
-  **finderQuery**: une requête SQL complète que CakePHP peut utiliser
   pour retrouver, supprimer ou créer de nouveaux enregistrements
   d'associations de modèles. Ceci ne devrait être utilisé que dans les
   situations qui nécessitent des résultats très personnalisés.

Une fois que cette association a été définie, les opérations de
recherche sur le modèle Recette récupèreront également les Tag reliés si
ils existent :

::

    //Exemple de résultats d'un appel a $this->Recette->find().

    Array
    (  
        [Recette] => Array
            (
                [id] => 2745
                [nom] => Bombes de sucres au chocolat glacé
                [created] => 2007-05-01 10:31:01
                [utilisateur_id] => 121
            )
        [Tag] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [nom] => Petit déjeuner
                    )
               [1] => Array
                    (
                        [id] => 124
                        [nom] => Dessert
                    )
               [2] => Array
                    (
                        [id] => 125
                        [nom] => Déprime sentimentale
                    )
            )
    )

N'oubliez pas de définir une association HABTM dans le modèle Tag si
vous souhaitez retrouver les données de Recette lorsque vous manipulez
le modèle Tag.

Il est également possible d'exécuter des requêtes de recherche
personnalisées basées sur des relations HABTM. Regardez les exemples
suivants :

En supposant que nous avons la même structure que dans les exemples
ci-dessus (Recette HABTM Tag), disons que nous voulions récupérer toutes
les Recettes avec le Tag "Dessert". Une solution rapide (mais
incorrecte) pour faire ceci serait d'utiliser une condition complexe sur
le modèle Recette :

::

    $this->Recette->bindModel(array(
        'hasAndBelongsToMany' => array(
            'Tag' => array('conditions'=>array('Tag.nom'=>'Dessert'))
    )));
    $this->Recette->find('all');

::

    // Données retournées
    Array
    (  
        0 => Array
            {
            [Recette] => Array
                (
                    [id] => 2745
                    [nom] => Bombes de sucres au chocolat glacé
                    [created] => 2007-05-01 10:31:01
                    [utilisateur_id] => 121
                )
            [Tag] => Array
                (
                   [0] => Array
                        (
                            [id] => 124
                            [nom] => Dessert
                        )
                )
        )
        1 => Array
            {
            [Recette] => Array
                (
                    [id] => 2745
                    [nom] => Gâteau au crabe
                    [created] => 2008-05-01 10:31:01
                    [utilisateur_id] => 121
                )
            [Tag] => Array
                (
                }
            }
    }

Notez que cet exemple retourne TOUTES les recettes, mais seulement les
tags "Dessert". Pour parvenir proprement à notre but, il y a de nombreux
moyens de faire. Une option est de faire une recherche sur le modèle Tag
(au lieu de Recette), ce qui nous donnera également toutes les Recettes
associées.

::

    $this->Recette->Tag->find('all', array('conditions'=>array('Tag.nom'=>'Dessert')));

Nous pouvons également utiliser le modèle de la table de jointure (que
cakePHP nous fournit), pour rechercher un ID donné.

::

    $this->Recette->bindModel(array('hasOne' => array('RecettesTag')));
    $this->Recette->find('all', array(
            'fields' => array('Recette.*'),
            'conditions'=>array('RecettesTag.tag_id'=>124) // id de Dessert
    ));

Il est également possible de créer une association exotique dans le but
de créer autant de jointures que nécessaires pour permettre le filtrage,
par exemple :

::

    $this->Recette->bindModel(array(
        'hasOne' => array(
            'RecettesTag',
            'FiltreTag' => array(
                'className' => 'Tag',
                'foreignKey' => false,
                'conditions' => array('FiltreTag.id = RecettesTag.id')
    ))));
    $this->Recette->find('all', array(
            'fields' => array('Recette.*'),
            'conditions'=>array('FiltreTag.nom'=>'Dessert')
    ));

Ces deux méthodes retourneront les données suivantes :

::

    // Données retournées
    Array
    (  
        0 => Array
            {
            [Recette] => Array
                (
                    [id] => 2745
                    [nom] => Bombes de sucres au chocolat glacé
                    [created] => 2007-05-01 10:31:01
                    [utilisateur_id] => 121
                )
        [Tag] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [nom] => Petit déjeuner
                    )
               [1] => Array
                    (
                        [id] => 124
                        [nom] => Dessert
                    )
               [2] => Array
                    (
                        [id] => 125
                        [nom] => Déprime sentimentale
                    )
            )
    }

La même astuce de lien peut être utilisée pour paginer facilement vos
modèles HABTM. Juste un mot d'avertissement : comme paginate nécessite
deux requêtes (une pour compter les enregistrements et une pour
récupérer les données effectives), soyez sûrs d'avoir fourni le
paramètre ``false`` à ``bindModel();`` car cela permet essentiellement
de dire à CakePHP de garder l'association de manière persistance sur les
requêtes multiples, au lieu de sur une seule comme dans le comportement
par défaut. Merci de vous référer à l'API pour plus de détails.

Pour plus d'informations sur l'association de modèles à la volée lisez
`Créer et détruire des associations à la
volée </fr/view/86/Créer-et-détruire-des-Associations-à-la-volée>`_

Mélangez et faites correspondre les techniques pour parvenir à votre but
!

hasMany through (The Join Model)
--------------------------------

It is sometimes desirable to store additional data with a many to many
association. Consider the following

Student hasAndBelongsToMany Course Course hasAndBelongsToMany Student

In other words, a Student can take many Courses and a Course can be
taken my many Students. This is a simple many to many association
demanding a table such as this

::

    id | student_id | course_id

Now what if we want to store the number of days that were attended by
the student on the course and their final grade? The table we'd want
would be

::

    id | student_id | course_id | days_attended | grade

The trouble is, hasAndBelongsToMany will not support this type of
scenario because when hasAndBelongsToMany associations are saved, the
association is deleted first. You would lose the extra data in the
columns as it is not replaced in the new insert.

The way to implement our requirement is to use a **join model**,
otherwise known (in Rails) as a **hasMany through** association. That
is, the association is a model itself. So, we can create a new model
CourseMembership. Take a look at the following models.

::

            student.php
            
            class Student extends AppModel
            {
                public $hasMany = array(
                    'CourseMembership'
                );

                public $validate = array(
                    'first_name' => array(
                        'rule' => 'notEmpty',
                        'message' => 'A first name is required'
                    ),
                    'last_name' => array(
                        'rule' => 'notEmpty',
                        'message' => 'A last name is required'
                    )
                );
            }      
            
            course.php
            
            class Course extends AppModel
            {
                public $hasMany = array(
                    'CourseMembership'
                );

                public $validate = array(
                    'name' => array(
                        'rule' => 'notEmpty',
                        'message' => 'A course name is required'
                    )
                );
            }
            
            course_membership.php

            class CourseMembership extends AppModel
            {
                public $belongsTo = array(
                    'Student', 'Course'
                );

                public $validate = array(
                    'days_attended' => array(
                        'rule' => 'numeric',
                        'message' => 'Enter the number of days the student attended'
                    ),
                    'grade' => array(
                        'rule' => 'notEmpty',
                        'message' => 'Select the grade the student received'
                    )
                );
            }   

The CourseMembership join model uniquely identifies a given Student's
participation on a Course in addition to extra meta-information.

Working with join model data
----------------------------

Now that the models have been defined, let's see how we can save all of
this. Let's say the Head of Cake School has asked us the developer to
write an application that allows him to log a student's attendance on a
course with days attended and grade. Take a look at the following code.

::

        controllers/course_membership_controller.php
        
        class CourseMembershipsController extends AppController
        {
            public $uses = array('CourseMembership');
            
            public function index() {
                $this->set('course_memberships_list', $this->CourseMembership->find('all'));
            }
            
            public function add() {
                
                if (! empty($this->data)) {
                    
                    if ($this->CourseMembership->saveAll(
                        $this->data, array('validate' => 'first'))) {

                        
                        $this->redirect(array('action' => 'index'));
                    }
                }
            }
        }
        
        views/course_memberships/add.ctp

        <?php echo $form->create('CourseMembership'); ?>
            <?php echo $form->input('Student.first_name'); ?>
            <?php echo $form->input('Student.last_name'); ?>
            <?php echo $form->input('Course.name'); ?>
            <?php echo $form->input('CourseMembership.days_attended'); ?>
            <?php echo $form->input('CourseMembership.grade'); ?>
            <button type="submit">Save</button>
        <?php echo $form->end(); ?>
        

You can see that the form uses the form helper's dot notation to build
up the data array for the controller's save which looks a bit like this
when submitted.

::

        Array
        (
            [Student] => Array
                (
                    [first_name] => Joe
                    [last_name] => Bloggs
                )

            [Course] => Array
                (
                    [name] => Cake
                )

            [CourseMembership] => Array
                (
                    [days_attended] => 5
                    [grade] => A
                )

        )

Cake will happily be able to save the lot together and assigning the
foreign keys of the Student and Course into CourseMembership with a
saveAll call with this data structure. If we run the index action of our
CourseMembershipsController the data structure received now from a
find('all') is:

::

        Array
        (
            [0] => Array
                (
                    [CourseMembership] => Array
                        (
                            [id] => 1
                            [student_id] => 1
                            [course_id] => 1
                            [days_attended] => 5
                            [grade] => A
                        )

                    [Student] => Array
                        (
                            [id] => 1
                            [first_name] => Joe
                            [last_name] => Bloggs
                        )

                    [Course] => Array
                        (
                            [id] => 1
                            [name] => Cake
                        )

                )

        )

There are of course many ways to work with a join model. The version
above assumes you want to save everything at-once. There will be cases
where you want to create the Student and Course independently and at a
later point associate the two together with a CourseMembership. So you
might have a form that allows selection of existing students and courses
from picklists or ID entry and then the two meta-fields for the
CourseMembership, e.g.

::

        
        views/course_memberships/add.ctp
        
        <?php echo $form->create('CourseMembership'); ?>
            <?php echo $form->input('Student.id', array('type' => 'text', 'label' => 'Student ID', 'default' => 1)); ?>
            <?php echo $form->input('Course.id', array('type' => 'text', 'label' => 'Course ID', 'default' => 1)); ?>
            <?php echo $form->input('CourseMembership.days_attended'); ?>
            <?php echo $form->input('CourseMembership.grade'); ?>
            <button type="submit">Save</button>
        <?php echo $form->end(); ?>

And the resultant POST

::

     
        Array
        (
            [Student] => Array
                (
                    [id] => 1
                )

            [Course] => Array
                (
                    [id] => 1
                )

            [CourseMembership] => Array
                (
                    [days_attended] => 10
                    [grade] => 5
                )

        )

Again Cake is good to us and pulls the Student id and Course id into the
CourseMembership with the saveAll.

Join models are pretty useful things to be able to use and Cake makes it
easy to do so with its built-in hasMany and belongsTo associations and
saveAll feature.

Créer et détruire des Associations à la volée
---------------------------------------------

Quelquefois il devient nécessaire de créer et détruire les associations
de modèles à la volée. Cela peut être le cas pour un certain nombre de
raisons :

-  Vous voulez réduire la quantité de données associées qui seront
   récupérées, mais toutes vos associations sont sur le premier niveau
   de récursion.
-  Vous voulez changer la manière dont une association est définie afin
   de classer ou filtrer les données associées.

La création et destruction se font en utilisant les méthodes de modèles
CakePHP bindModel() et unbindModel(). Mettons en place quelques modèles
pour pouvoir ensuite voir comment fonctionnent bindModel() et
unbindModel(). Nous commencerons avec deux modèles :

::

    <?php

    class Meneur extends AppModel {
        var $name = 'Meneur';

        var $hasMany = array(
            'Suiveur' => array(
                'className' => 'Suiveur',
                'order'     => 'Suiveur.rang'
            )
        );
    }

    ?>

    <?php

    class Suiveur extends AppModel {
        var $name = 'Suiveur';
    }

    ?>

Maintenant, dans le contrôleur MeneursController, nous pouvons utiliser
la méthode find() du modèle Meneur pour retrouver un Meneur et les
Suiveurs associés. Comme vous pouvez le voir ci-dessus, le tableau
d'association dans le modèle Meneur définit une relation "Meneur hasMany
(a plusieurs) Suiveurs". Dans un but démonstratif, utilisons
unbindModel() pour supprimer cette association dans une action du
contrôleur.

::

    function uneAction() {
        // Ceci récupère tous les Meneurs, ainsi que leurs Suiveurs
        $this->Meneur->findAll();

        // Supprimons la relation hasMany() ...
        $this->Meneur->unbindModel(
            array('hasMany' => array('Suiveur'))
        );

        // Désormais l'utilisation de la fonction find() retournera
        // des Meneurs, sans aucun Suiveurs
        $this->Meneur->findAll();

        // NOTE : unbindModel n'affecte que la prochaine fonction find.
        // Un autre appel à find() utilisera les informations d'association
        // telles que configurée.

        // Nous avons déjà utilisé findAll() après unbindModel(),
        // ainsi cette ligne récupèrera une fois encore les Meneurs 
        // avec leurs Suiveurs ...
        $this->Meneur->findAll();
    }

Encore un rappel. Enlever ou ajouter des associations en utilisant
bindModel() et unbindModel() ne fonctionne que pour la *prochaine*
opération sur le modèle, à moins que le second paramètre n'ait été fixé
à true. Si le second paramètre a été fixé à *true*, le lien reste en
place pour la suite de la requête.

Voici un exemple basique d'utilisation de unbindModel() :

::

    $this->Modele->unbindModel(
        array('associationType' => array('nomDeClasseModeleAssocie'))
    );

Maintenant que nous sommes arrivés à supprimer une association à la
volée, ajoutons-en une. Notre Meneur jusqu'à présent sans Principes a
besoin d'être associé à quelques Principes. Le fichier de modèle pour
notre modèle Principe est dépouillé, il n'y a que la ligne var $name.
Associons à la volée des Principes à notre Meneur (mais rappelons-le,
seulement pour la prochaine opération find). Cette fonction apparaît
dans le contrôleur MeneursController :

::

    function uneAutreAction() {
        // Il n'y a pas d'association Meneur hasMany Principe
        // dans le fichier de modèle meneur.php, ainsi un find
        // situé ici ne récupèrera que les Meneurs.
        $this->Meneur->findAll();

        // Utilisons bindModel() pour ajouter une nouvelle association
        // au modèle Meneur :
        $this->Meneur->bindModel(
            array('hasMany' => array(
                    'Principe' => array(
                        'className' => 'Principe'
                    )
                )
            )
        );

        // Maintenant que nous les avons associés correctement,
        // nous pouvons utiliser la fonction find une seule fois
        // pour récupérer les Meneurs avec leurs Principes associés :
        $this->Meneur->findAll();
    }

Ça y est, vous y êtes. L'utilisation basique de bindModel() est
l'encapsulation d'un tableau d'association classique, dans un tableau
dont la clé est le nom du type d'association que vous essayez de créer :

::

    $this->Modele->bindModel(
            array('nomAssociation' => array(
                    'nomDeClasseModeleAssocie' => array(
                        // les clés normales d'une association sont à mettre ici ...
                    )
                )
            )
        );

Bien que le modèle nouvellement associé n'ait besoin d'aucune définition
d'association dans son fichier de modèle, il devra tout de même contenir
les clés afin que la nouvelle association fonctionne bien.

Relations multiples avec le même modèle
---------------------------------------

Il y a des cas où un Modèle a plus d'une relation avec un autre Modèle.
Par exemple, vous pourriez avoir un modèle Message qui a deux relations
avec le modèle Utilisateur. Une relation avec l'utilisateur qui envoie
un message et une seconde avec l'utilisateur qui reçoit le message. La
table messages aura un champ utilisateur\_id, mais aussi un champ
receveur\_id. Maintenant, votre modèle Message peut ressembler à quelque
chose comme :

::

    <?php
    class Message extends AppModel {
        var $name = 'Message';
        var $belongsTo = array(
            'Expediteur' => array(
                'className' => 'Utilisateur',
                'foreignKey' => 'utilisateur_id'
            ),
            'Receveur' => array(
                'className' => 'Utilisateur',
                'foreignKey' => 'receveur_id'
            )
        );
    }
    ?>

Receveur est un alias pour le modèle Utilisateur. Maintenant, voyons à
quoi devrait ressembler le modèle Utilisateur.

::

    <?php
    class Utilisateur extends AppModel {
        var $name = 'Utilisateur';
        var $hasMany = array(
            'MessageEnvoye' => array(
                'className' => 'Message',
                'foreignKey' => 'utilisateur_id'
            ),
            'MessageRecu' => array(
                'className' => 'Message',
                'foreignKey' => 'receveur_id'
            )
        );
    }
    ?>

Tables jointes
--------------

En SQL, vous pouvez combiner des tables liées en utilisant la clause
JOIN. Ceci vous permet de réaliser des recherches complexes à travers
des tables multiples (par ex. : rechercher les posts selon plusieurs
tags donnés).

Dans CakePHP, certaines associations (belongsTo et hasOne) effectuent
des jointures automatiques pour récupérer les données, vous pouvez donc
lancer des requêtes pour récupérer les modèles basés sur les données de
celui qui est lié.

Mais ce n'est pas le cas avec les associations hasMany et
hasAndBelongsToMany. C'est là que les jointures forcées viennent à notre
secours. Vous devez seulement définir les jointures nécessaires pour
combiner les tables et obtenir les résultats désirés pour votre requête.

Pour forcer une jointure entre tables, vous avez besoin d'utiliser la
syntaxe "moderne" de Model::find(), en ajoutant une clé 'joins' au
tableau $options. Par exemple :

::

    $options['joins'] = array(
        array('table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            $conditions = array(
                'Channel.id = Item.channel_id',
            )
        )
    );

    $Item->find('all', $options);

Notez que les tableaux 'join' ne sont pas indexés.

Dans l'exemple ci-dessus, un modèle appelé Item est joint à gauche à la
table channels. Vous pouvez ajouter un alias à la table, avec le nom du
Modèle, ainsi les données retournées se conformeront à la structure de
données de CakePHP.

Les clés qui définissent la jointure sont les suivants :

-  **table** : la table pour la jointure.
-  **alias** : un alias vers la table. Le nom du modèle associé avec la
   table est le meilleur choix.
-  **type** : le type de jointure : inner, left ou right.
-  **conditions** : les conditions pour réaliser la jointure.

Avec joins, vous pourriez ajouter des conditions basées sur les champs
du modèle relié :

::

    $options['joins'] = array(
        array('table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            $conditions = array(
                'Channel.id = Item.channel_id',
            )
        )
    );

    $options['conditions'] => array(
        'Channel.prive' => 1
    )

    $itemsPrives = $Item->find('all', $options);

Au besoin, vous pourriez réaliser plusieurs jointures dans une
hasAndBelongsToMany :

Supposez une association Livre hasAndBelongsToMany Tag. Cette relation
utilise une table livres\_tags comme table de jointure, donc vous avez
besoin de joindre la table livres à la table livres\_tags et celle-ci
avec la table tags :

::

    $options['joins'] = array(
        array('table' => 'livres_tags',
            'alias' => 'LivresTag',
            'type' => 'inner',
            'conditions' => array(
                'Livres.id = LivresTag.livres_id'
            )
        ),
        array('table' => 'tags',
            'alias' => 'Tag',
            'type' => 'inner',
            'conditions' => array(
                'LivresTag.tag_id = Tag.id'
            )
        )
    );

    $options['conditions'] = array(
        'Tag.tag' => 'Nouvelle'
    );

    $livres = $Livre->find('all', $options);

Utiliser joins avec le comportement Containable pourrait conduire à
quelques erreurs SQL (tables dupliquées), vous devez donc utiliser la
méthode joins comme une alternative à Containable, si l'objectif
principal est de réaliser des recherches basées sur les données liées.
Containable est plus approprié pour restreindre le volume de données
reliées rapportées par une instruction find .

Méthodes de Callbacks du Modèle
===============================

Si vous voulez glisser un bout de logique applicative juste avant ou
après une opération d’un modèle CakePHP, utilisez les callbacks de
modèle. Ces fonctions peuvent être définies dans les classes de modèle
(cela comprend également votre classe AppModel). Notez bien les valeurs
de retour attendues pour chacune de ces méthodes spéciales.

beforeFind
----------

``beforeFind(mixed $donneesRequete)``

Appelée avant toute opération liée à la recherche. Les
``$donneesRequete`` passées à cette méthode de callback contiennent des
informations sur la requête courante : conditions, champs, etc.

Si vous ne souhaitez pas que l'opération de recherche commence (par
rapport à une décision liée aux options de ``$donneesRequete``),
retournez *false*. Autrement, retournez la variable ``$donneesRequete``
éventuellement modifiée, ou tout ce que vous souhaitez voir passé à la
méthode find() ou ses équivalents.

Vous pouvez utiliser cette méthode de callback pour restreindre les
opérations de recherche en se basant sur le rôle de l'utilisateur, ou
prendre des décisions sur la politique de mise en cache en fonction de
la charge actuelle.

afterFind
---------

``afterFind(array $resultats, bool $primaire``

Utilisez cette méthode de callback pour modifier les résultats qui ont
été retournés par une opération de recherche, ou pour effectuer toute
logique post-recherche. Le paramètre $results passé à cette méthode
contient les résultats retournés par l'opération ``find()`` du modèle,
càd quelque chose come :

::

    resultats = array(
      0 => array(
        'NomModele' => array(
          'champ1' => 'valeur1',
          'champ2' => 'valeur2',
        ),
      ),
    );

La valeur de retour de ce callback doit être le résultat de l'opération
de recherche (potentiellement modifié) qui a déclenché ce callback.

Si $primaire est faux, le format de $resultats sera un peu différent de
ce que l'on peut attendre; à la place du résultat que vous auriez
habituellement reçu d'une opération de recherche, vous aurez ceci :

::

    resultats = array(
      'champ_1' => 'valeur',

      'champ_2' => 'valeur2'
    );

Un code nécessitant que ``$primaire`` soit vrai auront probablement
l'erreur fatale "Cannot use string offset as an array" de la part de PHP
si une recherche récursive est utilisée.

Ci-dessous un exemple de la manière dont afterfind peut être utilisé
pour formater des dates.

::

    function afterFind($resultats) {
        foreach ($resultats as $clef => $val) {
            if (isset($val['Evenement']['debut'])) {
                $results[$clef]['Evenement']['fin'] = $this->dateFormatAfterFind($val['Evenement']['debut']);
            }
        }
        return $resultats;
    }

    function dateFormatAfterFind($date) {
        return date('d-m-Y', strtotime($date));
    }

beforeValidate
--------------

``beforeValidate()``

Utilisez ce rappel pour modifier les données du modèle avant qu'elles ne
soient validées ou pour modifier les règles de validation si nécessaire.
Cette fonction doit aussi retourner *vrai*, sinon l'exécution du save()
courant sera annulée.

beforeSave
----------

``beforeSave()``

Placez toute logique de pré-enregistrement dans cette fonction. Cette
fonction s'exécute immediatement après que les données du modèle ont été
validées avec succès, mais juste avant que les données ne soient
sauvegardées. Cette fonction devrait toujours retourner vrai si voulez
que l'opération d'enregistrement se poursuive.

Ce *callback* est particulièrement pratique, pour toute logique de
manipulation des données qui nécessite de se produire avant que vos
données ne soient stockées. Si votre moteur de stockage nécessite un
format spécifique pour les dates, accédez-y par $this->data et
modifiez-les.

Ci-dessous un exemple montrant comment beforeSave peut-être utilisé pour
la conversion de date. Le code de l'exemple est utilisé pour une
application qui a une date de début, au format YYYY-MM-DD dans la base
de données et au format DD-MM-YYYY dans l'affichage de l'application.
Bien sûr, ceci peut être très facilement modifié. Utilisez le code
ci-dessous dans le modèle approprié.

::

    function beforeSave() {
        if(!empty($this->data['Evenement']['date_debut']) && !empty($this->data['Evenement']['date_fin'])) {
                $this->data['Evenement']['date_debut'] = $this->dateFormatBeforeSave($this->data['Evenement']['date_debut']);
                $this->data['Evenement']['date_fin'] = $this->dateFormatBeforeSave($this->data['Evenement']['date_fin']);
        }
        return true;
    }

    function dateFormatBeforeSave($dateString) {
        return date('Y-m-d', strtotime($dateString)); // Le sens d'affichage provient de là 
    }

Assurez-vous que beforeSave() retourne vrai ou bien votre sauvegarde
échouera.

afterSave
---------

``afterSave(boolean $created)``

Si vous avez besoin d'exécuter de la logique juste après chaque
opération de sauvegarde, placez-la dans cette méthode de rappel.

La valeur de ``$created`` sera vrai si un nouvel objet a été créé
(plutôt qu'un objet mis à jour).

beforeDelete
------------

``beforeDelete(boolean $cascade)``

Placez dans cette fonction, toute logique de pré-suppression. Cette
fonction doit retourner vrai si vous voulez que la suppression continue
et faux si vous voulez l'annuler.

La valeur de ``$cascade`` sera ``true``, pour que les enregistrements
qui dépendent de cet enregistrement soient aussi supprimés.

afterDelete
-----------

``afterDelete()``

Placez dans cette méthode de rappel, toute logique que vous souhaitez
exécuter après chaque suppression.

onError
-------

``onError()``

Appelée si quelque problème se produit.

Attributs des Modèles
=====================

Les attributs du Modèle vous permettent de définir des propriétés qui
peuvent modifier son comportement par défaut.

Pour une liste complète des attributs du modèle et leurs descriptions,
visitez l'API CakePHP :
`https://api.cakephp.org/class/model <https://api.cakephp.org/class/model>`_.

useDbConfig
-----------

La propriété ``useDbConfig`` spécifie quel paramètre du fichier de
configuration de la base de données vous voulez utiliser. Le fichier de
configuration de la base de données est stocké dans
/app/config/database.php.

Exemple d'utilisation:

::

    class Example extends AppModel {
       var $useDbConfig = 'alternative';
    }

La valeur par défaut de ``useDbConfig`` est 'default'.

useTable
--------

La propriété ``useTable`` spécifie le nom de la table de la base de
données. Par défaut, le modèle utilise le nom de la classe modèle au
pluriel et en minuscule. Donnez à cet attribut le nom d’une table
alternative, ou ``false``

Exemple d'utilisation :

::

    class Exemple extends AppModel {
       var $useTable = false; // Ce modèle n'utilise pas de table de la base de données
    }

Table alternative :

::

    class Exemple extends AppModel {
       var $useTable = 'exmp'; // Ce modèle utilise la table 'exmp'
    }

tablePrefix
-----------

Le nom du préfixe de la table utilisée par le modèle. Initialement, le
préfixe utilisé est celui renseigné avec la connexion à la base de
données dans /app/config/database.php. Par défaut il n'y a aucun
préfixe. Vous pouvez surcharger la valeur par défaut en configurant
l'attribut ``tablePrefix`` dans le modèle.

Exemple d'utilisation :

::

    class Exemple extends AppModel {
       var $tablePrefix = 'alt_'; // cherchera la table 'alt_exemples'
    }

primaryKey
----------

Chaque table a normalement une clé primaire, ``id``. Vous pouvez changer
le champ qui sera utilisé par le modèle comme sa clé primaire. Ceci est
fréquent lorsque l'on configure CakePHP pour utiliser une table existant
déjà dans la base de données.

Exemple d'utilisation :

::

    class Exemple extends AppModel {
        var $primaryKey = 'exemple_id'; // exemple_id est le nom du champ dans la base de données
    }

displayField
------------

L'attribut ``displayField`` spécifie quel champ de la base de données
doit être utilisé comme intitulé pour l'enregistrement. L'intitulé est
utilisé dans le maquettage rapide (scaffolding) ainsi que dans les
appels à ``find('list')``. Le modèle utilisera ``name`` ou ``title`` par
défaut.

Par exemple, pour utiliser le champ ``pseudo`` :

::

    class Utilisateur extends AppModel {
       var $displayField = 'pseudo';
    }

Les noms de champs multiples ne peuvent pas être combinés en un unique
champ à afficher. Par exemple, vous ne pouvez pas spécifier
``array('prenom', 'nom')`` comme le champ à afficher.

recursive
---------

La propriété recursive définit la profondeur jusqu'à laquelle CakePHP
doit récupérer les données des modèles associés, via les méthodes
``find()``, ``findAll()`` et ``read()``.

Imaginons que votre application représente des Groupes qui appartiennent
à un domaine et qui ont plusieurs Utilisateurs qui, à leur tour, ont
plusieurs Articles. Vous pouvez attribuer à $recursive des valeurs
différentes en fonction de la quantité de données que vous souhaitez
récupérer en appelant $this->Groupe->find() :

+--------------+----------------------------------------------------------------------------------------------------------------+
| Profondeur   | Description                                                                                                    |
+==============+================================================================================================================+
| -1           | Cake récupèrera seulement les données de Groupe, aucune jointure.                                              |
+--------------+----------------------------------------------------------------------------------------------------------------+
| 0            | Cake récupèrera les données de Groupe ainsi que son domaine                                                    |
+--------------+----------------------------------------------------------------------------------------------------------------+
| 1            | Cake récupèrera un Groupe, son domaine et les Utilisateurs associés                                            |
+--------------+----------------------------------------------------------------------------------------------------------------+
| 2            | Cake récupèrera un Groupe, son domaine, les Utilisateurs associés, et les Articles associés aux Utilisateurs   |
+--------------+----------------------------------------------------------------------------------------------------------------+

Ne le fixer pas trop haut par rapport à vos besoins. Demander à CakePHP
de récupérer des données dont vous n'avez pas besoin ralentit votre
application inutilement.

Si vous voulez combiner $recursive avec la fonctionnalité ``fields``,
vous devrez ajouter manuellement les colonnes contenant les clés
étrangères nécessaires dans le tableau ``fields``. Dans l'exemple
ci-dessus, cela pourrait être l'ajout de ``domaine_id``

order
-----

L’ordre par défaut des données lors de toute opération find. Les valeurs
possibles sont :

::

    var $order = "champ"
    var $order = "Modele.champ";
    var $order = "Modele.champ asc";
    var $order = "Modele.champ ASC";
    var $order = "Modele.champ DESC";
    var $order = array("Modele.champ" => "asc", "Modele.champ2" => "DESC");

data
----

Le conteneur pour les données récupérées par le modèle. Bien que les
données renvoyées depuis une classe de modèle sont en règle générale
renvoyées par un appel à find(), vous pourriez avoir besoin d’accéder
aux informations stockées dans $data à l’intérieur des callbacks du
modèle.

\_schema
--------

Contient des méta-données décrivant les champs de la table de la base de
données associée au modèle. Chaque champ est décrit par :

-  nom
-  type (integer, string, datetime, etc.)
-  null
-  valeur par défaut
-  longueur

Exemple d'utilisation :

::

        
    var $_schema = array(    
        'prenom' => array(    
            'type' => 'string',   
            'length' => 30
        ),   
        'nom' => array(
            'type' => 'string',   
            'length' => 30    
        ),   
        'email' => array(
            'type' => 'string',   
            'length' => 30    
        ),   
        'message' => array(
            'type' => 'text'
        )    
    );   

validate
--------

Cet attribut rassemble les règles permettant au modèle de décider de la
validité des données avant une sauvegarde. Les clés mentionnées après le
champ contiennent des expressions régulières permettant au modèle
d’essayer de faire des correspondances.

Il n'est pas nécessaire d'appeler la méthode validate() avant save() :
cette dernière validera automatiquement les données avant de sauvegarder
de façon définitive.

Pour plus d'informations concernant la validation, regardez le chapitre
`Validation des données </fr/view/125/validation-des-donn-es>`_ plus
loin dans ce manuel

virtualFields
-------------

Tableau de champs virtuels que le modèle possède. Les champs virtuels
sont des expressions SQL "aliasées". Les champs ajoutés à cette
propriété seront lus comme les autres champs d'un modèle, mais ne seront
pas enregistrables.

Exemple d'utilisation :

::

    var $virtualFields = array(
        'nom' => 'CONCAT(Utilisateur.prenom, ' ', Utilisateur.nom)'
    );

Dans les opérations de find ultérieures, vos résultats Utilisateur
contiendrait une clé ``nom`` avec le résultat de la concaténation. Il
n'est pas recommandé de créer des champs virtuels avec les mêmes noms
que les colonnes de la base de données, ceci peut causer des erreurs
SQL.

name
----

Comme vu plus tôt dans ce chapitre, l'attribut name est une
caractéristique pour la compatibilité avec PHP4, il est fixé à la même
valeur que le nom du modèle.

Exemple d'utilisation :

::

    class Exemple extends AppModel {
       var $name = 'Exemple';
    }

cacheQueries
------------

Si il est mis à true, les données récupérées par le modèle lors d’une
requête seule sont mises en cache. Cette mise en cache ne se fait qu’en
mémoire et ne dure que le temps d’une requête. Ainsi, toutes les
requêtes dupliquées pour les même données sont gérées par le cache.

Méthodes et Propriétés additionnelles
=====================================

Bien que les fonctions de modèle de CakePHP devraient vous emmener là où
vous souhaitez aller, n'oubliez pas que les classes de modèles ne sont
rien de plus que cela : des classes qui vous permettent d'écrire vos
propres méthodes ou de définir vos propres propriétés.

N'importe quelle opération qui prend en charge la sauvegarde ou la
restitution de données est mieux située dans vos classes de modèle. Ce
concept est souvent appelé *fat model* ("modèle gras").

::

    class Exemple extends AppModel {

        function getRecent() {
            $conditions = array(
                'created BETWEEN (curdate() - interval 7 day) and (curdate() - interval 0 day))'
            );
            return $this->find('all', compact('conditions'));
        }
    }

Cette méthode ``getRecent()`` peut maintenant être utilisée dans le
contrôleur.

::

    $recent = $this->Exemple->getRecent();

Using virtualFields
-------------------

Virtual fields are a new feature in the Model for CakePHP 1.3. Virtual
fields allow you to create arbitrary SQL expressions and assign them as
fields in a Model. These fields cannot be saved, but will be treated
like other model fields for read operations. They will be indexed under
the model's key alongside other model fields.

**How to create virtual fields**

Creating virtual fields is easy. In each model you can define a
$virtualFields property that contains an array of
``field => expressions``. An example of virtual field definitions would
be:

::

    var $virtualFields = array(
        'name' => 'CONCAT(User.first_name, " ", User.last_name)'
    );

In subsequent find operations, your User results would contain a
``name`` key with the result of the concatenation. It is not advisable
to create virtual fields with the same names as columns on the database,
this can cause SQL errors.

**Using virtual fields**

Creating virtual fields is straightforward and easy, interacting with
virtual fields can be done through a few different methods.

**``Model::hasField()``**

``Model::hasField()`` has been updated so that it returns true if the
model has a ``virtualField`` with the correct name. By setting the
second parameter of ``hasField`` to true, ``virtualFields`` will also be
checked when checking if a model has a field. Using the example field
above,

::

    $this->User->hasField('name'); // Will return false, as there is no concrete field called name
    $this->User->hasField('name', true); // Will return true as there is a virtual field called name

**``Model::isVirtualField()``**

This method can be used to check if a field/column is a virtual field or
a concrete field. Will return true if the column is virtual.

::

    $this->User->isVirtualField('name'); //true
    $this->User->isVirtualField('first_name'); //false

**``Model::getVirtualField()``**

This method can be used to access the SQL expression that comprises a
virtual field. If no argument is supplied it will return all virtual
fields in a Model.

::

    $this->User->getVirtualField('name'); //returns 'CONCAT(User.first_name, ' ', User.last_name)'

**``Model::find()`` and virtual fields**

As stated earlier ``Model::find()`` will treat virtual fields much like
any other field in a model. The value of a virtual field will be placed
under the model's key in the resultset. Unlike the behavior of
calculated fields in 1.2

::

    $results = $this->User->find('first');

    // results contains the following
    array(
        'User' => array(
            'first_name' => 'Mark',
            'last_name' => 'Story',
            'name' => 'Mark Story',
            //more fields.
        )
    );

**Pagination and virtual fields**

Since virtual fields behave much like regular fields when doing find's,
``Controller::paginate()`` has been updated to allows sorting by virtual
fields.

Virtual fields
==============

Virtual fields are a new feature in the Model for CakePHP 1.3. Virtual
fields allow you to create arbitrary SQL expressions and assign them as
fields in a Model. These fields cannot be saved, but will be treated
like other model fields for read operations. They will be indexed under
the model's key alongside other model fields.

Creating virtual fields
-----------------------

Creating virtual fields is easy. In each model you can define a
``$virtualFields`` property that contains an array of field =>
expressions. An example of a virtual field definition using MySQL would
be:

::

    var $virtualFields = array(
        'full_name' => 'CONCAT(User.first_name, " ", User.last_name)'
    );

And with PostgreSQL:

::

    var $virtualFields = array(
        'name' => 'User.first_name || \' \' || User.last_name'
    );

In subsequent find operations, your User results would contain a
``name`` key with the result of the concatenation. It is not advisable
to create virtual fields with the same names as columns on the database,
this can cause SQL errors.

It is not always useful to have **User.first\_name** fully qualified. If
you do not follow the convention (i.e. you have multiple relations to
other tables) this would result in an error. In this case it may be
better to just use **first\_name \|\| \\'\\' \|\| last\_name** without
the Model Name.

Using virtual fields
--------------------

Creating virtual fields is straightforward and easy, interacting with
virtual fields can be done through a few different methods.

Model::hasField()

Model::hasField() has been updated so that it can return true if the
model has a virtualField with the correct name. By setting the second
parameter of hasField to true, virtualFields will also be checked when
checking if a model has a field. Using the example field above,

::

    $this->User->hasField('name'); // Will return false, as there is no concrete field called name
    $this->User->hasField('name', true); // Will return true as there is a virtual field called name

Model::isVirtualField()

This method can be used to check if a field/column is a virtual field or
a concrete field. Will return true if the column is virtual.

::

    $this->User->isVirtualField('name'); //true
    $this->User->isVirtualField('first_name'); //false

Model::getVirtualField()

This method can be used to access the SQL expression that comprises a
virtual field. If no argument is supplied it will return all virtual
fields in a Model.

::

    $this->User->getVirtualField('name'); //returns 'CONCAT(User.first_name, ' ', User.last_name)'

Model::find() and virtual fields

As stated earlier ``Model::find()`` will treat virtual fields much like
any other field in a model. The value of a virtual field will be placed
under the model's key in the resultset. Unlike the behavior of
calculated fields in 1.2

::

    $results = $this->User->find('first');

    // results contains the following
    array(
        'User' => array(
            'first_name' => 'Mark',
            'last_name' => 'Story',
            'name' => 'Mark Story',
            //more fields.
        )
    );

**Pagination and virtual fields**

Since virtual fields behave much like regular fields when doing find's,
``Controller::paginate()`` has been updated to allow sorting by virtual
fields.

Virtual fields and model aliases
--------------------------------

When you are using virtualFields and models with aliases that are not
the same as their name, you can run into problems as virtualFields do
not update to reflect the bound alias. If you are using virtualFields in
models that have more than one alias it is best to define the
virtualFields in your model's constructor

::

    function __construct($id = false, $table = null, $ds = null) {
        parent::__construct($id, $table, $ds);
        $this->virtualFields['name'] = sprintf('CONCAT(%s.first_name, " ", %s.last_name)', $this->alias, $this->alias);
    }

This will allow your virtualFields to work for any alias you give a
model.

Limitations of virtualFields
----------------------------

The implementation of ``virtualFields`` in 1.3 has a few limitations.
First you cannot use ``virtualFields`` on associated models for
conditions, order, or fields arrays. Doing so will generally result in
an SQL error as the fields are not replaced by the ORM. This is because
it's difficult to estimate the depth at which an associated model might
be found.

A common workaround for this implementation issue is to copy
``virtualFields`` from one model to another at runtime when you need to
access them.

::

    $this->virtualFields['full_name'] = $this->Author->virtualFields['full_name'];

Alternatively, you can define ``$virtualFields`` in your model's
constructor, using ``$this->alias``, like so:

::

    public function __construct($id=false,$table=null,$ds=null){
      parent::__construct($id,$table,$ds);
      $this->virtualFields = array(
        'name'=>"CONCAT(`{$this->alias}`.`first_name`,' ',`{$this->alias}`.`last_name`)"
      );
    }

Transactions
============

To perform a transaction, a model's tables must be of a type that
supports transactions.

All transaction methods must be performed on a model's DataSource
object. To get a model's DataSource from within the model, use:

::

        $dataSource = $this->getDataSource();

You can then use the data source to start, commit, or roll back
transactions.

::

        $dataSource->begin($this);
        
        //Perform some tasks

        if(/*all's well*/) {
            $dataSource->commit($this);
        } else {
            $dataSource->rollback($this);
        }

Nested transactions are currently not supported. If a nested transaction
is started, a commit will return false on the parent transaction.
