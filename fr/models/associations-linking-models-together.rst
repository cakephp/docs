Associations : relier les models entre eux
##########################################

Une des caractéristiques les plus puissantes de CakePHP est sa capacité 
d'établir les liens nécessaires entre les models d'après les informations 
fournies. Dans CakePHP, les liens entre models sont gérés par des associations.

Definir les relations entre différents objets à l'intérieur de votre 
application devrait être une tâche naturelle. Par exemple : dans une base de 
données de recettes, une recette peut avoir plusieurs versions, chaque version 
n'a qu'un seul auteur et les auteurs peuvent avoir plusieurs recettes. Le 
fait de définir le fonctionnement de ces relations vous permet d'accéder à vos 
données de manière intuitive et puissante.

Le but de cette section est de vous montrer comment concevoir, définir et 
utiliser les associations entre les models au sein de CakePHP.

Bien que les données peuvent être issues d'une grande variété de sources, 
la forme de stockage la plus répandue dans les applications web est la base 
de données relationnelle. La plupart de ce qui est couvert par cette section 
le sera dans ce contexte.

Pour des informations sur les associations avec les models de Plugin, voyez 
:ref:`plugin-models`.

Types de relations
------------------

Les quatre types d'associations dans CakePHP sont : hasOne (a un seul), 
hasMany (a plusieurs), belongsTo (appartient à), et hasAndBelongsToMany (HABTM) 
(appartient à et est composé de plusieurs).

========================== ===================== ============================================================
Relation                   Type d'Association    Exemple
========================== ===================== ============================================================
un vers un                 hasOne                Un user a un profile.
-------------------------- --------------------- ------------------------------------------------------------
un vers plusieurs          hasMany               Un user peut avoir plusieurs recettes.
-------------------------- --------------------- ------------------------------------------------------------
plusieurs vers un          belongsTo             Plusieurs recettes appartiennent à un user.
-------------------------- --------------------- ------------------------------------------------------------
plusieurs vers plusieurs   hasAndBelongsToMany   Les recettes ont, et appartiennent à plusieurs ingrédients.
========================== ===================== ============================================================

Les associations se définissent en créant une variable de classe nommée 
comme l'association que vous souhaitez définir. La variable de classe peut 
quelquefois se limiter à une chaîne de caractère, mais peut également être 
aussi complète qu'un tableau multi-dimensionnel utilisé pour définir les 
spécificité de l'association.

::

    <?php
    class User extends AppModel {
        public $name = 'User';
        public $hasOne = 'Profile';
        public $hasMany = array(
            'Recipe' => array(
                'className'  => 'Recette',
                'conditions' => array('Recette.approvee' => '1'),
                'order'      => 'Recette.created DESC'
            )
        );
    }

Dans l'exemple ci-dessus, la première instance du mot 'Recette' est ce que 
l'on appelle un 'Alias'. C'est un identifiant pour la relation et cela peut 
être ce que vous souhaitez. En règle générale, on choisit le même nom que la 
classe qu'il référence. Toutefois, **les alias pour chaque model doivent être 
uniques dans une app entière**. Par exemple, il est approprié d'avoir::

    <?php
    class User extends AppModel {
        public $name = 'User';
        public $hasMany = array(
            'MaRecette' => array(
                'className' => 'Recette',
            ),
        );
        public $hasAndBelongsToMany => array(
            'MembreDe' => array(
                'className' => 'Groupe',
            ),
        );
    }
     
    class Group extends AppModel {
        public $name = 'Group';
        public $hasMany = array(
            'MaRecette' => array(
                'className'  => 'Recette',
            ),
        );
        public $hasAndBelongsToMany => array(
            'Membre' => array(
                'className' => 'User',
            ),
        );
        public $hasAndBelongsToMany => array('MembreDe' => array('className' => 'Group'));
    }

mais ce qui suit ne travaillera pas bien dans toute circonstance::

    <?php
    class User extends AppModel {
        public $name = 'User';
        public $hasMany = array(
            'MaRecette' => 'Recette',
        );
        public $hasAndBelongsToMany => array(
            'Membere' => array(
                'className' => 'Groupe',
            ),
        );
    }
    
    class Group extends AppModel {
        public $name = 'Group';
        public $hasMany = array(
            'MaRecette' => array(
                'className'  => 'Recette',
            ),
        );
        public $hasAndBelongsToMany => array(
            'Membere' => array(
                'className' => 'User',
            ),
        );
        public $hasAndBelongsToMany => array('Membre' => 'Group');
    }

parce que ici nous avons l'alias 'Member' se référant aux deux models 
User (dans Group) et Group (dans User) dans les associations 
HABTM. Choisir des noms non-uniques pour les alias de models à travers les 
models peut entraîner un comportement inattendu.

Cake va créer automatiquement des liens entre les objets model associés.
Ainsi par exemple dans votre model ``User``, vous pouvez accedez 
au model ``Recette`` comme ceci::

    <?php
    $this->Recette->uneFunctionQuelconque();

De même dans votre controller, vous pouvez acceder à un model associé 
simplement en poursuivant les associations de votre model::

    <?php
    $this->User->Recette->uneFunctionQuelconque();

.. note::

    Rappelez vous que les associations sont définis dans 'un sens'. Si vous 
    définissez User hasMany Recette, cela n'a aucun effet sur le model 
    Recette. Vous avez besoin de définir Recette belongsTo User pour 
    pouvoir accéder au model User à partir du model Recette.

hasOne
------

Mettons en place un model User avec une relation de type hasOne vers 
un model Profil.

Tout d'abord, les tables de votre base de données doivent être saisies 
correctement. Pour qu'une relation de type hasOne fonctionne, une table 
doit contenir une clé étrangère qui pointe vers un enregistrement de l'autre. 
Dans notre cas la table profils contiendra un champ nommé user\_id. 
Le motif de base est :

**hasOne:**, *l'autre* model contient la clé étrangère.

========================== =========================
Relation                   Schéma            
========================== =========================
Pomme hasOne Banane        bananes.pomme\_id
-------------------------- -------------------------
User hasOne Profil         profiles.user\_id 
-------------------------- -------------------------
Docteur hasOne Maitre      maitres.docteur\_id
========================== =========================

.. note::

    Il n'est pas obligatoire de suivre les conventions de CakePHP, vous pouvez 
    facilement outrepasser l'utilisation de toute clé Etrangère dans les 
    définitions de vos associations. Néanmoins, coller aux conventions donnera 
    un code moins répétitif, plus facile à lire et à maintenir.

Le fichier model User sera sauvegardé dans /app/Model/User.php. 
Pour définir l'association ‘User hasOne Profil’, ajoutez la propriété 
$hasOne à la classe de model. Pensez à avoir un model Profil dans
/app/Model/Profil.php, ou l'association ne marchera pas::

    <?php
    class User extends AppModel {
        public $name = 'User';
        public $hasOne = 'Profil';
    }

Il y a deux façons de décrire cette relation dans vos fichiers de model.
La méthode la plus simple est de définir l'attribut $hasOne pour une chaîne 
de caractère contenant le className du model associé, comme nous l'avons 
fait au-dessus.

Si vous avez besoin de plus de contrôle, vous pouvez définir vos associations 
en utilisant la syntaxe des tableaux. Par exemple, vous voudrez peut-être 
limiter l'association pour inclure seulement certains enregistrements.

::

    <?php
    class User extends AppModel {
        public $name = 'User';
        public $hasOne = array(
            'Profil' => array(
                'className'    => 'Profil',
                'conditions'   => array('Profil.publiee' => '1'),
                'dependent'    => true
            )
        );
    }

Les clés possibles pour les tableaux d'association incluent:

-  **className**: le nom de la classe du model que l'on souhaite 
   associer au model actuel. Si l'on souhaite définir la relation 
   'User a un Profil’, la valeur associée à la clé 'className' 
   devra être ‘Profil’.
-  **foreignKey**: le nom de la clé etrangère que l'on trouve dans 
   l'autre model. Ceci sera particulièrement pratique si vous avez 
   besoin de définir des relations hasOne multiples. La valeur par 
   défaut de cette clé est le nom du model actuel (avec des underscores) 
   suffixé avec ‘\_id’. Dans l'exemple ci-dessus la valeur par défaut aurait 
   été 'user\_id’.
-  **conditions**: un tableau des conditions compatibles de find() ou un 
   fragment de code SQL tel que array('Profil.approuve' => true)
-  **fields**: une liste des champs à récupérer lorsque les données du model 
   associé sont parcourues. Par défaut, cela retourne tous les champs.
-  **order**: Un tableau des clauses order compatible de la fonction find() 
   ou un fragment de code SQL tel que array('Profil.nom_de_famille' => 'ASC')
-  **dependent**: lorsque la valeur de la clé 'dependent' est true et que la 
   méthode delete() du model est appelée avec le paramètre 'cascade' valant 
   true également, les enregistrements des models associés sont supprimés. 
   Dans ce cas nous avons fixé la valeur à true de manière à ce que la 
   suppression d'un User supprime également le Profil associé.

Une fois que cette association aura été définie, les opérations de recherche 
sur le model User récupèreront également les enregistrements Profils 
liés s'il en existe::

    //Exemple de résultats d'un appel à $this->User->find().
    
    Array
    (
        [User] => Array
            (
                [id] => 121
                [nom] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Profil] => Array
            (
                [id] => 12
                [user_id] => 121
                [competences] => Baking Cakes
                [created] => 2007-05-01 10:31:01
            )
    )

belongsTo
---------

Maintenant que nous avons accès aux données du Profil depuis le model 
User, définissons une association belongsTo (appartient a) dans 
le model Profil afin de pouvoir accéder aux données User liées. 
L'association belongsTo est un complément naturel aux associations hasOne et 
hasMany : elle permet de voir les données dans le sens inverse.

Lorsque vous définissez les clés de votre base de données pour une relation 
de type belongsTo, suivez cette convention :

**belongsTo:** le model *courant* contient la clé étrangère.

============================= ==================
Relation                      Schéma
============================= ==================
Banane belongsTo Pomme        bananes.pomme\_id
----------------------------- ------------------
Profil belongsTo User         profiles.user\_id
----------------------------- ------------------
Maitres belongsTo Docteur     maitres.docteur\_id
============================= ==================

.. tip::

    Si un model (table) contient une clé étrangère, elle appartient 
    à (belongsTo) l'autre model (table).

Nous pouvons définir l'association belongsTo dans notre model Profil dans
/app/Model/Profil.php en utilisant la syntaxe de chaîne de caractère comme ce 
qui suit::

    <?php
    class Profil extends AppModel {
        public $name = 'Profil';
        public $belongsTo = 'User';
    }

Nous pouvons aussi définir une relation plus spécifique en utilisant une 
syntaxe de tableau::

    <?php
    class Profil extends AppModel {
        public $name = 'Profil';
        public $belongsTo = array(
            'User' => array(
                'className'    => 'User',
                'foreignKey'   => 'user_id'
            )
        );
    }

Les clés possibles pour les tableaux d'association belongsTo incluent:

-  **className**: the classname of the model being associated to
   the current model. If you’re defining a ‘Profile belongsTo User’
   relationship, the className key should equal ‘User.’
-  **foreignKey**: the name of the foreign key found in the current
   model. This is especially handy if you need to define multiple
   belongsTo relationships. The default value for this key is the
   underscored, singular name of the other model, suffixed with
   ``_id``.
-  **conditions**: an array of find() compatible conditions or SQL
   strings such as ``array('User.active' => true)``
-  **type**: the type of the join to use in the SQL query, default
   is LEFT which may not fit your needs in all situations, INNER may
   be helpful when you want everything from your main and associated
   models or nothing at all! (effective when used with some conditions
   of course).
   **(NB: type value is in lower case - i.e. left, inner)**
-  **fields**: A list of fields to be retrieved when the associated
   model data is fetched. Returns all fields by default.
-  **order**: an array of find() compatible order clauses or SQL
   strings such as ``array('User.username' => 'ASC')``
-  **counterCache**: If set to true the associated Model will
   automatically increase or decrease the
   “[singular\_model\_name]\_count” field in the foreign table
   whenever you do a ``save()`` or ``delete()``. If it's a string then it's the
   field name to use. The value in the counter field represents the
   number of related rows. You can also specify multiple counter caches
   by using an array where the key is field name and value is the
   conditions. E.g.::

       array(
           'recipes_count' => true,
           'recipes_published' => array('Recipe.published' => 1)
       )

-  **counterScope**: Optional conditions array to use for updating
   counter cache field.

Once this association has been defined, find operations on the
Profile model will also fetch a related User record if it exists::

    //Sample results from a $this->Profile->find() call.
    
    Array
    (
       [Profile] => Array
            (
                [id] => 12
                [user_id] => 121
                [skill] => Baking Cakes
                [created] => 2007-05-01 10:31:01
            )    
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
    )

hasMany
-------

Prochaine étape : définir une association “User hasMany Comment”. Une 
association hasMany nous permettra de récupérer les comments d'un user 
lors de la récupération d'un enregistrement User.

Lorsque vous définissez les clés de votre base de données pour une relation 
de type hasMany, suivez cette convention :

**hasMany:** l'*autre* model contient la clé étrangère.

======================= ==================
Relation                Schema
======================= ==================
User hasMany Comment    Comment.user\_id
----------------------- ------------------
Cake hasMany Virtue     Virtue.cake\_id
----------------------- ------------------
Product hasMany Option  Option.product\_id
======================= ==================

On peut définir l'association hasMany dans notre model User 
(/app/Model/User.php) en utilisant une chaîne de caractères de cette 
manière::

    <?php
    class User extends AppModel {
        public $name = 'User';
        public $hasMany = 'Comment';
    }

Nous pouvons également définir une relation plus spécifique en utilisant 
un tableau::

    <?php
    class User extends AppModel {
        public $name = 'User';
        public $hasMany = array(
            'Comment' => array(
                'className'     => 'Comment',
                'foreignKey'    => 'user_id',
                'conditions'    => array('Comment.status' => '1'),
                'order'         => 'Comment.created DESC',
                'limit'         => '5',
                'dependent'     => true
            )
        );  
    }

Les clés possibles pour les tableaux d'association hasMany sont :

-  **className**: le nom de la classe du model que l'on souhaite associer au 
   model actuel. Si l'on souhaite définir la relation ‘User hasMany Comment’
   (l'User a plusieurs Comments), 
   la valeur associée à la clef 'className' devra être 
   ‘Comment’.
-  **foreignKey**: le nom de la clé etrangère que l'on trouve dans l'autre 
   model. Ceci sera particulièrement pratique si vous avez besoin de définir 
   des relations hasMany multiples. La valeur par défaut de cette clé est 
   le nom du model actuel (avec des underscores) suffixé avec ‘\_id’
-  **conditions**: un tableau de conditions compatibles dans find() ou 
   des chaînes SQL comme array('Comment.visible' => true)
-  **order**: un tableau de clauses order compatibles dans find() ou des 
   chaînes SQL comme array('Profile.last_name' => 'ASC')
-  **limit**: Le nombre maximum de lignes associées que vous voulez retourner.
-  **offset**: Le nombre de lignes associées à enlever (étant donné les 
   conditions et l'order courant) avant la récupération et l'association.
-  **dependent**: Lorsque dependent vaut true, une suppression récursive du 
   model est possible. Dans cet exemple, les enregistrements Comment seront 
   supprimés lorsque leur User associé l'aura été.
-  **exclusive**: Lorsque exclusive est fixé à true, la suppression récursive 
   de model effectue la suppression avec un deleteAll() au lieu du supprimer 
   chaque entité séparément. Cela améliore grandement la performance, mais 
   peut ne pas être idéal dans toutes les circonstances.
-  **finderQuery**: Une requête SQL complète que CakePHP peut utiliser pour 
   retrouver les enregistrements associés au model. Ceci ne devrait être 
   utilisé que dans les situations qui nécessitent des résultats très 
   personnalisés.
   Si une de vos requêtes a besoin d'une référence à l'ID du model associé, 
   utilisez le marqueur spécial ``{$__cakeID__$}`` dans la requête. Par 
   exemple, si votre model Pomme hasMany Orange, la requête devrait 
   ressembler à ça : 
   ``SELECT Orange.* from oranges as Orange WHERE Orange.pomme_id = {$__cakeID__$};``


Une fois que cette association a été définie, les opérations de recherche 
sur le model User récupèreront également les Comments reliés si 
ils existent::

    //Exemple de résultats d'un appel à $this->User->find().
    
    Array
    (  
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Comment] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [user_id] => 121
                        [title] => On Gwoo the Kungwoo
                        [body] => The Kungwooness is not so Gwooish
                        [created] => 2006-05-01 10:31:01
                    )
                [1] => Array
                    (
                        [id] => 124
                        [user_id] => 121
                        [title] => More on Gwoo
                        [body] => But what of the ‘Nut?
                        [created] => 2006-05-01 10:41:01
                    )
            )
    )

Une chose dont il faut se rappeler est que vous aurez besoin d'une 
association "Comment belongsTo User" en complément, afin de 
pouvoir récupérer les données dans les deux sens. Ce que nous avons défini 
dans cette section vous donne la possibilité d'obtenir les données de 
Comment depuis l'User. En ajoutant l'association "Comment 
belongsTo User" dans le model Comment, vous aurez la possibilité 
de connaître les données de l'User depuis le model Comment - 
cela complète la connexion entre eux et permet un flot d'informations depuis 
n'importe lequel des deux models.

counterCache - Cache your count()
---------------------------------

This function helps you cache the count of related data. Instead of
counting the records manually via ``find('count')``, the model
itself tracks any addition/deleting towards the associated
``$hasMany`` model and increases/decreases a dedicated integer
field within the parent model table.

The name of the field consists of the singular model name followed
by a underscore and the word "count"::

    my_model_count

Let's say you have a model called ``ImageComment`` and a model
called ``Image``, you would add a new INT-field to the ``images``
table and name it ``image_comment_count``.

Here are some more examples:

========== ======================= =========================================
Model      Associated Model        Example
========== ======================= =========================================
User       Image                   users.image\_count
---------- ----------------------- -----------------------------------------
Image      ImageComment            images.image\_comment\_count
---------- ----------------------- -----------------------------------------
BlogEntry  BlogEntryComment        blog\_entries.blog\_entry\_comment\_count
========== ======================= =========================================

Once you have added the counter field you are good to go. Activate
counter-cache in your association by adding a ``counterCache`` key
and set the value to ``true``::

    <?php
    class ImageComment extends AppModel {
        public $belongsTo = array(
            'Image' => array(
                'counterCache' => true,
            )
        );
    }

From now on, every time you add or remove a ``ImageComment`` associated to
``Image``, the number within ``image_comment_count`` is adjusted
automatically.

You can also specify ``counterScope``. It allows you to specify a
simple condition which tells the model when to update (or when not
to, depending on how you look at it) the counter value.

Using our Image model example, we can specify it like so::

    <?php
    class ImageComment extends AppModel {
        public $belongsTo = array(
            'Image' => array(
                'counterCache' => true,
                'counterScope' => array('Image.active' => 1) // only count if "Image" is active = 1
            )
        );
    }

hasAndBelongsToMany (HABTM)
---------------------------

Très bien. A ce niveau, vous pouvez déjà vous considérer comme un professionnel 
des associations de models CakePHP. Vous vous êtes déjà assez compétents 
dans les 3 types d'associations afin de pouvoir effectuer la plus grande 
partie des relations entre les objets.

Abordons maintenant le dernier type de relation : hasAndBelongsToMany (a 
et appartient à plusieurs), ou HABTM. Cette association est utilisée lorsque 
vous avez deux models qui ont besoin d'être reliés, de manière répétée, 
plusieurs fois, de plusieurs façons différentes.

La principale différence entre les relations hasMany et HABTM est que le lien 
entre les models n'est pas exclusif dans le cadre d'une relation HABTM. Par 
exemple, relions notre model Recette avec un model Ingredient en utilisant 
HABTM. Le fait d'utiliser les tomates en Ingredient pour la recette de 
Spaghettis de ma grand-mère ne "consomme" pas l'Ingredient. Je peux aussi 
utiliser mes Spaghettis pour une Recette Salade.

Les liens entre des objets liés par une association hasMany sont exclusifs. Si 
mon User "hasMany" Comment, un commentaire ne sera lié qu'à un 
user spécifique. Il ne sera plus disponible pour d'autres.

Continuons. Nous aurons besoin de mettre en place une table supplémentaire dans 
la base de données qui contiendra les associations HABTM. Le nom de cette 
nouvelle table de jointure doit inclure les noms des deux models concernés, 
dans l'ordre alphabétique, et séparés par un underscore ( \_ ). La table doit 
contenir au minimum deux champs, chacune des clés étrangères (qui devraient 
être des entiers) pointant sur les deux clés primaires des models concernés. 
Pour éviter tous problèmes, ne définissez pas une première clé composée de ces 
deux champs, si votre application le nécessite vous pourrez définir un index 
unique. Si vous prévoyez d'ajouter de quelconques informations supplémentaires 
à cette table, c'est une bonne idée que d'ajouter un champ supplémentaire comme 
clé primaire (par convention 'id') pour rendre les actions sur la table aussi 
simple que pour tout autre model.

**HABTM** a besoin d'une table de jointure séparée qui contient les deux noms 
de *models*.

========================= ================================================================
Relations                 Champs de la table HABTM
========================= ================================================================
Recipe HABTM Ingredient   **ingredients_recipes**.id, **ingredients_recipes**.ingredient_id, **ingredients_recipes**.recipe_id
------------------------- ----------------------------------------------------------------
Cake HABTM Fan            **cakes_fans**.id, **cakes_fans**.cake_id, **cakes_fans**.fan_id
------------------------- ----------------------------------------------------------------
Foo HABTM Bar             **bars_foos**.id, **bars_foos**.foo_id, **bars_foos**.bar_id
========================= ================================================================


.. note::

    Le nom des tables est par convention dans l'ordre alphabétique. Il est 
    possible de définir un nom de table personnalisé dans la définition de 
    l'association.

Assurez vous que les clés primaires dans les tables **cakes** et **recipes** 
ont un champ "id" comme assumé par convention. Si ils sont différents que 
ceux anticipés, il faut le changer dans la :ref:`model-primaryKey` du 
model.

Une fois que cette nouvelle table a été créée, on peut définir l'association 
HABTM dans les fichiers de model. Cette fois ci, nous allons directement voir 
la syntaxe en tableau::

    <?php
    class Recipe extends AppModel {
        public $name = 'Recipe';   
        public $hasAndBelongsToMany = array(
            'Ingredient' =>
                array(
                    'className'              => 'Ingredient',
                    'joinTable'              => 'ingredients_recipes',
                    'foreignKey'             => 'recipe_id',
                    'associationForeignKey'  => 'ingredient_id',
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

Les clés possibles pour un tableau définissant une association HABTM sont :

.. _ref-habtm-arrays:

-  **className**: Le nom de la classe du model que l'on souhaite associer 
   au model actuel. Si l'on souhaite définir la relation 'Recipe 
   HABTM Ingredient', la valeur associée à la clef 'className' devra être 
   'Ingredient'.
-  **joinTable**: Le nom de la table de jointure utilisée dans cette 
   association (si la table ne colle pas à la convention de nommage des 
   tables de jointure HABTM).
-  **with**: Définit le nom du model pour la table de jointure. Par 
   défaut CakePHP créera automatiquement un model pour vous. Dans 
   l'exemple ci-dessus la valeur aurait été RecettesTag. En utilisant 
   cette clé vous pouvez surcharger ce nom par défaut. Le model de la 
   table de jointure peut être utilisé comme tout autre model "classique" 
   pour accéder directement à la table de jointure. En créant une classe 
   model avec un tel nom et un nom de fichier, vous pouvez ajouter 
   tout behavior personnalisé pour les recherches de la table jointe, comme 
   ajouter plus d'informations/colonnes à celle-ci.
-  **foreignKey**: Le nom de la clé étrangère que l'on trouve dans le model 
   actuel. Ceci sera particulièrement pratique si vous avez besoin de définir 
   des relations HABTM multiples. La valeur par défaut de cette clé est le 
   nom du model actuel (avec des underscores) suffixé avec ‘\_id'.
-  **associationForeignKey**: Le nom de la clé etrangère que l'on trouve 
   dans l'autre model. Ceci sera particulièrement pratique si vous avez 
   besoin de définir des relations HABTM multiples. La valeur par défaut de 
   cette clé est le nom de l'autre model (avec des underscores) suffixé 
   avec ‘\_id'.
-  **unique**: Un boléen ou une chaîne de caractères ``keepExisting``.
    - Si true (valeur par défaut) Cake supprimera d'abord les enregistrements 
      des relations existantes dans la table des clés étrangères avant d'en 
      insérer de nouvelles, lors de la mise à jour d'un enregistrement. Ainsi 
      les associations existantes devront être passées encore une fois lors 
      d'une mise à jour.
    - Si false, Cake va insérer l'enregistrement lié, et aucun enregistrement 
      joint n'est supprimé pendant une opération de sauvegarde.
    - Si ``keepExisting`` est défini, le behavior est similaire à `true`,
      mais les associations existantes ne sont pas supprimées.
-  **conditions**: un tableau de conditions compatibles de find() ou des 
   chaînes SQL. Si vous avez des conditions sur la table associée, vous devez 
   utiliser un model 'avec', et définir les associations belongsTo nécéssaires 
   sur lui.
-  **fields**: Une liste des champs à récupérer lorsque les données du model 
   associé sont parcourues. Par défaut, cela retourne tous les champs.
-  **order**: un tableau de clauses order compatibles avec find() compatible 
   ou des chaînes SQL.
-  **limit**: Le nombre maximum de lignes associées que vous voulez retourner.
-  **offset**: Le nombre de lignes associées à enlever (étant donnés les 
   conditions et l'order courant) avant la récupération et l'association.
-  **finderQuery, deleteQuery, insertQuery**: Une requête SQL complète que 
   CakePHP peut utiliser pour récupérer, supprimer, ou créer des 
   enregistrements d'un model nouvellement associé. Ceci doit être utilisé 
   dans les situations qui nécéssitent des résultats très personnalisés.

Une fois que cette association a été définie, les opérations de recherche 
sur le model Recette récupèreront également les Ingredient reliés si ils existent::

    // Exemple de résultats d'un appel a $this->Recette->find().
    
    Array
    (  
        [Recipe] => Array
            (
                [id] => 2745
                [name] => Chocolate Frosted Sugar Bombs
                [created] => 2007-05-01 10:31:01
                [user_id] => 2346
            )
        [Ingredient] => Array
            (
                [0] => Array
                    (
                        [id] => 123
                        [name] => Chocolate
                    )
               [1] => Array
                    (
                        [id] => 124
                        [name] => Sugar
                    )
               [2] => Array
                    (
                        [id] => 125
                        [name] => Bombs
                    )
            )
    )

N'oubliez pas de définir une association HABTM dans le model Ingredient si 
vous souhaitez retrouver les données de Recette lorsque vous manipulez le 
model Ingredient.

.. note::

   Les données HABTM sont traitées comme un ensemble complet, chaque fois 
   qu'une nouvelle association de donnée est ajoutée, l'ensemble complet 
   de lignes associées dans la base de données est enlevé et recrée ainsi 
   vous devrez toujours passer l'ensemble des données définies pour 
   sauvegarder. Pour avoir une alternative à l'utilisation de HABTM, regardez 
   :ref:`hasMany-through`

.. tip::

    Pour plus d'informations sur la sauvegarde des objets HABTM regardez 
    :ref:`saving-habtm`


.. _hasMany-through:

hasMany through (Le Model Join)
-------------------------------

It is sometimes desirable to store additional data with a many to
many association. Consider the following

`Student hasAndBelongsToMany Course`

`Course hasAndBelongsToMany Student`

In other words, a Student can take many Courses and a Course can be
taken by many Students. This is a simple many to many association
demanding a table such as this::

    id | student_id | course_id

Now what if we want to store the number of days that were attended
by the student on the course and their final grade? The table we'd
want would be::

    id | student_id | course_id | days_attended | grade

The trouble is, hasAndBelongsToMany will not support this type of
scenario because when hasAndBelongsToMany associations are saved,
the association is deleted first. You would lose the extra data in
the columns as it is not replaced in the new insert.

    .. versionchanged:: 2.1

    You can set ``unique`` setting to ``keepExisting`` circumvent
    losing extra data during the save operation.  See ``unique``
    key in :ref:`HABTM association arrays <ref-habtm-arrays>`.

The way to implement our requirement is to use a **join model**,
otherwise known as a **hasMany through** association.
That is, the association is a model itself. So, we can create a new
model CourseMembership. Take a look at the following models.::

            <?php
            // Student.php
            class Student extends AppModel {
                public $hasMany = array(
                    'CourseMembership'
                );
            }      
            
            // Course.php
            
            class Course extends AppModel {
                public $hasMany = array(
                    'CourseMembership'
                );
            }
            
            // CourseMembership.php
    
            class CourseMembership extends AppModel {
                public $belongsTo = array(
                    'Student', 'Course'
                );
            }   

The CourseMembership join model uniquely identifies a given
Student's participation on a Course in addition to extra
meta-information.

Join models are pretty useful things to be able to use and Cake
makes it easy to do so with its built-in hasMany and belongsTo
associations and saveAll feature.

.. _dynamic-associations:

Creating and Destroying Associations on the Fly
-----------------------------------------------

Quelquefois il devient nécessaire de créer et détruire les associations 
de models à la volée. Cela peut être le cas pour un certain nombre de raisons :

-  Vous voulez réduire la quantité de données associées qui seront récupérées, 
   mais toutes vos associations sont sur le premier niveau de récursion.
-  Vous voulez changer la manière dont une association est définie afin de 
   classer ou filtrer les données associées.

La création et destruction de ces associations se font en utilisant les 
méthodes de models CakePHP bindModel() et unbindModel(). (Il existe aussi 
un behavior très aidant appelé "Containable", merci de vous référer à la 
section du manuel sur les behaviors intégrés pour plus d'informations). 
Mettons en place quelques models pour pouvoir ensuite voir comment 
fonctionnent bindModel() et unbindModel(). Nous commencerons avec 
deux models::

    <?php
    class Leader extends AppModel {
        public $name = 'Leader';
        
        public $hasMany = array(
            'Follower' => array(
                'className' => 'Follower',
                'order'     => 'Follower.rank'
            )
        );
    }
    
    class Follower extends AppModel {
        public $name = 'Follower';
    }

Maintenant, dans le controller MeneursController, nous pouvons utiliser 
la méthode find() du model Meneur pour retrouver un Meneur et les 
Suiveurs associés. Comme vous pouvez le voir ci-dessus, le tableau 
d'association dans le model Meneur définit une relation "Meneur 
hasMany (a plusieurs) Suiveurs". Dans un but démonstratif, utilisons 
unbindModel() pour supprimer cette association dans une action du 
controller::

    <?php
    public function some_action() {
        // Ceci récupère tous les Meneurs, ainsi que leurs Suiveurs
        $this->Leader->find('all');
      
        // Supprimons la relation hasMany() ...
        $this->Leader->unbindModel(
            array('hasMany' => array('Follower'))
        );
      
        // Désormais l'utilisation de la fonction find() retournera
        // des Meneurs, sans aucun Suiveurs
        $this->Leader->find('all');
      
        // NOTE : unbindModel n'affecte que la prochaine fonction find.
        // Un autre appel à find() utilisera les informations d'association
        // telles que configurée.
      
        // Nous avons déjà utilisé findAll('all') après unbindModel(),
        // ainsi cette ligne récupèrera une fois encore les Meneurs
        // avec leurs Suiveurs ...
        $this->Leader->find('all');
    }

.. note::

    Encore un rappel. Enlever ou ajouter des associations en utilisant 
    bindModel() et unbindModel() ne fonctionne que pour la *prochaine* 
    opération sur le model, à moins que le second paramètre n'ait été 
    fixé à false. Si le second paramètre a été fixé à *false*, le lien reste 
    en place pour la suite de la requête.

Voici un exemple basique d'utilisation de unbindModel()::

    <?php
    $this->Model->unbindModel(
        array('associationType' => array('associatedModelClassName'))
    );

Maintenant que nous sommes arrivés à supprimer une association à la volée, 
ajoutons-en une. Notre Meneur jusqu'à présent sans Principes a besoin d'être 
associé à quelques Principes. Le fichier de model pour notre model Principe 
est dépouillé, il n'y a que la ligne var $name. Associons à la volée des 
Principes à notre Meneur (mais rappelons-le, seulement pour la prochaine 
opération find). Cette fonction apparaît dans le controller MeneursController::

    <?php
    public function another_action() {
        // Il n'y a pas d'association Meneur hasMany Principe
        // dans le fichier de model meneur.php, ainsi un find
        // situé ici ne récupèrera que les Meneurs.
        $this->Leader->find('all');
     
        // Utilisons bindModel() pour ajouter une nouvelle association
        // au model Meneur :
        $this->Leader->bindModel(
            array('hasMany' => array(
                    'Principle' => array(
                        'className' => 'Principle'
                    )
                )
            )
        );
     
        // Maintenant que nous les avons associés correctement,
        // nous pouvons utiliser la fonction find une seule fois
        // pour récupérer les Meneurs avec leurs Principes associés :
        $this->Leader->find('all');
    }

Ça y est, vous y êtes. L'utilisation basique de bindModel() est 
l'encapsulation d'un tableau d'association classique, dans un tableau dont 
la clé est le nom du type d'association que vous essayez de créer::

    <?php
    $this->Model->bindModel(
        array('associationName' => array(
                'associatedModelClassName' => array(
                    // normal association keys go here...
                )
            )
        )
    );

Bien que le model nouvellement associé n'ait besoin d'aucune définition 
d'association dans son fichier de model, il devra tout de même contenir 
les clés afin que la nouvelle association fonctionne bien.

Relations multiples avec le même model
--------------------------------------

Il y a des cas où un Model a plus d'une relation avec un autre Model. Par 
exemple, vous pourriez avoir un model Message qui a deux relations avec le 
model User. Une relation avec l'user qui envoie un message et 
une seconde avec l'user qui reçoit le message. La table messages aura 
un champ user\_id, mais aussi un champ receveur\_id. Maintenant, votre 
model Message peut ressembler à quelque chose comme::

    <?php
    class Message extends AppModel {
        public $name = 'Message';
        public $belongsTo = array(
            'Sender' => array(
                'className' => 'User',
                'foreignKey' => 'user_id'
            ),
            'Recipient' => array(
                'className' => 'User',
                'foreignKey' => 'recipient_id'
            )
        );
    }

Receveur est un alias pour le model User. Maintenant, voyons à quoi 
devrait ressembler le model User::

    <?php
    class User extends AppModel {
        public $name = 'User';
        public $hasMany = array(
            'MessageSent' => array(
                'className' => 'Message',
                'foreignKey' => 'user_id'
            ),
            'MessageReceived' => array(
                'className' => 'Message',
                'foreignKey' => 'recipient_id'
            )
        );
    }

Il est aussi possible de créer des associations sur soi-même comme montré 
ci-dessous::

    <?php
    class Post extends AppModel {
        public $name = 'Post';
        
        public $belongsTo = array(
            'Parent' => array(
                'className' => 'Post',
                'foreignKey' => 'parent_id'
            )
        );
    
        public $hasMany = array(
            'Children' => array(
                'className' => 'Post',
                'foreignKey' => 'parent_id'
            )
        );
    }

**Fetching a nested array of associated records:**

Si votre table a un champ ``parent_id``, vous pouvez aussi utiliser 
:ref:`model-find-threaded` pour récupérer un tableau imbriqué d'enregistrements 
en utilisant une seule requête sans définir aucune association.

Tables jointes
--------------

En SQL, vous pouvez combiner des tables liées en utilisant la clause JOIN. 
Ceci vous permet de réaliser des recherches complexes à travers des tables 
multiples (par ex. : rechercher les posts selon plusieurs tags donnés).

Dans CakePHP, certaines associations (belongsTo et hasOne) effectuent des 
jointures automatiques pour récupérer les données, vous pouvez donc lancer des 
requêtes pour récupérer les models basés sur les données de celui qui est lié.

Mais ce n'est pas le cas avec les associations hasMany et hasAndBelongsToMany. 
C'est là que les jointures forcées viennent à notre secours. Vous devez 
seulement définir les jointures nécessaires pour combiner les tables et obtenir 
les résultats désirés pour votre requête.

.. note::

    Souvenez vous que vous avez besoin de définir la récursivité à -1 pour 
    ce travail. Par exemple:
    $this->Channel->recursive = -1;

Pour forcer une jointure entre tables, vous avez besoin d'utiliser la syntaxe 
"moderne" de Model::find(), en ajoutant une clé 'joins' au tableau $options. 
Par exemple::

    <?php
    $options['joins'] = array(
        array('table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            'conditions' => array(
                'Channel.id = Item.channel_id',
            )
        )
    );
    
    $Item->find('all', $options);

.. note::

    Notez que les tableaux 'join' ne sont pas indexés.

Dans l'exemple ci-dessus, un model appelé Item est joint à gauche à la table 
channels. Vous pouvez ajouter un alias à la table, avec le nom du Model, 
ainsi les données retournées se conformeront à la structure de données de 
CakePHP.

-  **table**: La table pour la jointure.
-  **alias**: un alias vers la table. Le nom du model associé avec la table 
   est le meilleur choix.
-  **type**: Le type de jointure : inner, left ou right.
-  **conditions**: Les conditions pour réaliser la jointure.

Avec joins, vous pourriez ajouter des conditions basées sur les champs du 
model relié::

    <?php
    $options['joins'] = array(
        array('table' => 'channels',
            'alias' => 'Channel',
            'type' => 'LEFT',
            'conditions' => array(
                'Channel.id = Item.channel_id',
            )
        )
    );
    
    $options['conditions'] = array(
        'Channel.private' => 1
    );
    
    $privateItems = $Item->find('all', $options);

Au besoin, vous pourriez réaliser plusieurs jointures dans une 
hasAndBelongsToMany :

Supposez une association Livre hasAndBelongsToMany Tag. Cette relation utilise 
une table livres\_tags comme table de jointure, donc vous avez besoin de 
joindre la table livres à la table livres\_tags et celle-ci avec la table tags::

    <?php
    $options['joins'] = array(
        array('table' => 'books_tags',
            'alias' => 'BooksTag',
            'type' => 'inner',
            'conditions' => array(
                'Books.id = BooksTag.books_id'
            )
        ),
        array('table' => 'tags',
            'alias' => 'Tag',
            'type' => 'inner',
            'conditions' => array(
                'BooksTag.tag_id = Tag.id'
            )
        )
    );
    
    $options['conditions'] = array(
        'Tag.tag' => 'Novel'
    );
    
    $books = $Book->find('all', $options);

Utiliser joins avec le behaviorment Containable pourrait conduire à quelques 
erreurs SQL (tables dupliquées), vous devez donc utiliser la méthode joins 
comme une alternative à Containable, si l'objectif principal est de réaliser 
des recherches basées sur les données liées. Containable est plus approprié 
pour restreindre le volume de données reliées rapportées par une instruction 
find .


.. meta::
    :title lang=fr: Associations : relier les models entre eux
    :keywords lang=fr: relationship types,relational mapping,recipe database,relational database,this section covers,web applications,recipes,models,cakephp,storage
