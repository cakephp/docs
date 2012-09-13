Associations : relier les modèles entre eux
###########################################

Une des caractéristiques les plus puissantes de CakePHP est sa capacité 
d'établir les liens nécessaires entre les modèles d'après les informations 
fournies. Dans CakePHP, les liens entre modèles sont gérés par des associations.

Definir les relations entre différents objets à l'intérieur de votre 
application devrait être une tâche naturelle. Par exemple : dans une base de 
données de recettes, une recette peut avoir plusieurs versions, chaque version 
n'a qu'un seul auteur et les auteurs peuvent avoir plusieurs recettes. Le 
fait de définir le fonctionnement de ces relations vous permet d'accéder à vos 
données de manière intuitive et puissante.

Le but de cette section est de vous montrer comment concevoir, définir et 
utiliser les associations entre les modèles au sein de CakePHP.

Bien que les données peuvent être issues d'une grande variété de sources, 
la forme de stockage la plus répandue dans les applications web est la base 
de données relationnelle. La plupart de ce qui est couvert par cette section 
le sera dans ce contexte.

Pour des informations sur les associations avec les modèles de Plugin, voyez 
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
classe qu'il référence. Toutefois, **les alias pour chaque modèle doivent être 
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

    class Groupe extends AppModel {
        public $name = 'Groupe';
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
    }

mais ce qui suit ne travaillera pas bien dans toute circonstance:::

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

    class Groupe extends AppModel {
        public $name = 'Groupe';
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
    }

parce que ici nous avons l'alias 'Member' se référant aux deux modèles 
User (dans Groupe) et Groupe (dans User) dans les associations 
HABTM. Choisir des noms non-uniques pour les alias de modèles à travers les 
modèles peut entraîner un comportement inattendu.

Cake va créer automatiquement des liens entre les objets modèle associés.
Ainsi par exemple dans votre modèle ``User``, vous pouvez accedez 
au modèle ``Recette`` comme ceci::

    <?php
    $this->Recette->uneFunctionQuelconque();

De même dans votre contrôleur, vous pouvez acceder à un modèle associé 
simplement en poursuivant les associations de votre modèle::

    <?php
    $this->User->Recette->uneFunctionQuelconque();

.. note::

    Rappelez vous que les associations sont définis dans 'un sens'. Si vous 
    définissez User hasMany Recette, cela n'a aucun effet sur le modèle 
    Recette. Vous avez besoin de définir Recette belongsTo User pour 
    pouvoir accéder au modèle User à partir du modèle Recette.

hasOne
------

Mettons en place un modèle User avec une relation de type hasOne vers 
un modèle Profil.

Tout d'abord, les tables de votre base de données doivent être saisies 
correctement. Pour qu'une relation de type hasOne fonctionne, une table 
doit contenir une clé étrangère qui pointe vers un enregistrement de l'autre. 
Dans notre cas la table profils contiendra un champ nommé user\_id. 
Le motif de base est :

**hasOne:**, *l'autre* modèle contient la clé étrangère.

========================== =========================
Relation                   Schéma            
========================== =========================
Pomme hasOne Banane        bananes.pomme\_id
-------------------------- -------------------------
User hasOne Profil  profiles.user\_id 
-------------------------- -------------------------
Docteur hasOne Maitre      maitres.docteur\_id
========================== =========================

.. note::

    Il n'est pas obligatoire de suivre les conventions de CakePHP, vous pouvez 
    facilement outrepasser l'utilisation de toute cléEtrangère dans les 
    définitions de vos associations. Néanmoins, coller aux conventions fera un
    code moins répétitif, plus facile à lire et à maintenir.

Le fichier modèle User sera sauvegardé dans /app/Model/User.php. 
Pour définir l'association ‘User hasOne Profil’, ajoutez la propriété 
$hasOne à la classe de modèle. Pensez à avoir un modèle Profil dans
/app/Model/Profil.php, ou l'association ne marchera pas::

    <?php
    class User extends AppModel {
        public $name = 'User';
        public $hasOne = 'Profil';
    }

Il y a deux façons de décrire cette relation dans vos fichiers de modèle.
La méthode la plus simple est de définir l'attribut $hasOne pour une chaîne 
de caractère contenant le className du modèle associé, comme nous l'avons 
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


-  **className**:  le nom de la classe du modèle que l'on souhaite 
   associer au modèle actuel. Si l'on souhaite définir la relation 
   'User a un Profil’, la valeur associée à la clé 'className' 
   devra être ‘Profil’.
-  **foreignKey**: le nom de la clé etrangère que l'on trouve dans 
   l'autre modèle. Ceci sera particulièrement pratique si vous avez 
   besoin de définir des relations hasOne multiples. La valeur par 
   défaut de cette clé est le nom du modèle actuel (avec des underscores) 
   suffixé avec ‘\_id’. Dans l'exemple ci-dessus la valeur par défaut aurait 
   été 'user\_id’.
-  **conditions**: un tableau des conditions compatibles de find() ou un 
   fragment de code SQL tel que array('Profil.approuve' => true)
-  **fields**: une liste des champs à récupérer lorsque les données du modèle 
   associé sont parcourues. Par défaut, cela retourne tous les champs.
-  **order**: Un tableau des clauses order compatible de la fonction find() 
   ou un fragment de code SQL tel que array('Profil.nom_de_famille' => 'ASC')
-  **dependent**: lorsque la valeur de la clé 'dependent' est true et que la 
   méthode delete() du modèle est appelée avec le paramètre 'cascade' valant 
   true également, les enregistrements des modèles associés sont supprimés. 
   Dans ce cas nous avons fixé la valeur à true de manière à ce que la 
   suppression d'un User supprime également le Profil associé.

Une fois que cette association aura été définie, les opérations de recherche 
sur le modèle User récupèreront également les enregistrements Profils 
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

Maintenant que nous avons accès aux données du Profil depuis le modèle 
User, définissons une association belongsTo (appartient a) dans 
le modèle Profil afin de pouvoir accéder aux données User liées. 
L'association belongsTo est un complément naturel aux associations hasOne et 
hasMany : elle permet de voir les données dans le sens inverse.

Lorsque vous définissez les clés de votre base de données pour une relation 
de type belongsTo, suivez cette convention :

**belongsTo:** le modèle *courant* contient la clé étrangère.

============================= ==================
Relation                      Schéma
============================= ==================
Banane belongsTo Pomme        bananes.pomme\_id
----------------------------- ------------------
Profil belongsTo User  profiles.user\_id
----------------------------- ------------------
Maitres belongsTo Docteur     maitres.docteur\_id
============================= ==================

.. tip::

    Si un modèle (table) contient une clé étrangère, elle appartient 
    à (belongsTo) l'autre modèle (table).

Nous pouvons définir l'association belongsTo dans notre modèle Profil dans
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
                'foreignKey'   => 'utiilisateur_id'
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

Next step: defining a “User hasMany Comment” association. A hasMany
association will allow us to fetch a user’s comments when we fetch
a User record.

When keying your database tables for a hasMany relationship, follow
this convention:

**hasMany:** the *other* model contains the foreign key.

======================= ==================
Relation                Schema
======================= ==================
User hasMany Comment    Comment.user\_id
----------------------- ------------------
Cake hasMany Virtue     Virtue.cake\_id
----------------------- ------------------
Product hasMany Option  Option.product\_id
======================= ==================

We can define the hasMany association in our User model at
/app/Model/User.php using the string syntax as follows::

    <?php
    class User extends AppModel {
        public $name = 'User';
        public $hasMany = 'Comment';
    }

We can also define a more specific relationship using array
syntax::

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

Possible keys for hasMany association arrays include:


-  **className**: the classname of the model being associated to
   the current model. If you’re defining a ‘User hasMany Comment’
   relationship, the className key should equal ‘Comment.’
-  **foreignKey**: the name of the foreign key found in the other
   model. This is especially handy if you need to define multiple
   hasMany relationships. The default value for this key is the
   underscored, singular name of the actual model, suffixed with
   ‘\_id’.
-  **conditions**: an array of find() compatible conditions or SQL
   strings such as array('Comment.visible' => true)
-  **order**:  an array of find() compatible order clauses or SQL
   strings such as array('Profile.last_name' => 'ASC')
-  **limit**: The maximum number of associated rows you want
   returned.
-  **offset**: The number of associated rows to skip over (given
   the current conditions and order) before fetching and associating.
-  **dependent**: When dependent is set to true, recursive model
   deletion is possible. In this example, Comment records will be
   deleted when their associated User record has been deleted.
-  **exclusive**: When exclusive is set to true, recursive model
   deletion does the delete with a deleteAll() call, instead of
   deleting each entity separately. This greatly improves performance,
   but may not be ideal for all circumstances.
-  **finderQuery**: A complete SQL query CakePHP can use to fetch
   associated model records. This should be used in situations that
   require very custom results.
   If a query you're building requires a reference to the associated
   model ID, use the special ``{$__cakeID__$}`` marker in the query.
   For example, if your Apple model hasMany Orange, the query should
   look something like this:
   ``SELECT Orange.* from oranges as Orange WHERE Orange.apple_id = {$__cakeID__$};``


Once this association has been defined, find operations on the User
model will also fetch related Comment records if they exist::

    //Sample results from a $this->User->find() call.
    
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

One thing to remember is that you’ll need a complimentary Comment
belongsTo User association in order to get the data from both
directions. What we’ve outlined in this section empowers you to get
Comment data from the User. Adding the Comment belongsTo User
association in the Comment model empowers you to get User data from
the Comment model - completing the connection and allowing the flow
of information from either model’s perspective.

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

From now on, every time you add or remove a ``Image`` associated to
``ImageComment``, the number within ``image_comment_count`` is adjusted
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

Alright. At this point, you can already call yourself a CakePHP
model associations professional. You're already well versed in the
three associations that take up the bulk of object relations.

Let's tackle the final relationship type: hasAndBelongsToMany, or
HABTM. This association is used when you have two models that need
to be joined up, repeatedly, many times, in many different ways.

The main difference between hasMany and HABTM is that a link
between models in HABTM is not exclusive. For example, we're about
to join up our Recipe model with an Ingredient model using HABTM.
Using tomatoes as an Ingredient for my grandma's spaghetti recipe
doesn't "use up" the ingredient. I can also use it for a salad Recipe.

Links between hasMany associated objects are exclusive. If my User
hasMany Comments, a comment is only linked to a specific user. It's
no longer up for grabs.

Moving on. We'll need to set up an extra table in the database to
handle HABTM associations. This new join table's name needs to
include the names of both models involved, in alphabetical order,
and separated with an underscore ( \_ ). The contents of the table
should be two fields, each foreign keys (which should be integers)
pointing to both of the primary keys of the involved models. To
avoid any issues - don't define a combined primary key for these
two fields, if your application requires it you can define a unique
index. If you plan to add any extra information to this table, or use
a 'with' model, you should add an additional primary key field (by convention
'id').

**HABTM** requires a separate join table that includes both *model*
names.

========================= ================================================================
Relationship              HABTM Table Fields
========================= ================================================================
Recipe HABTM Ingredient   **ingredients_recipes**.id, **ingredients_recipes**.ingredient_id, **ingredients_recipes**.recipe_id
------------------------- ----------------------------------------------------------------
Cake HABTM Fan            **cakes_fans**.id, **cakes_fans**.cake_id, **cakes_fans**.fan_id
------------------------- ----------------------------------------------------------------
Foo HABTM Bar             **bars_foos**.id, **bars_foos**.foo_id, **bars_foos**.bar_id
========================= ================================================================


.. note::

    Table names are by convention in alphabetical order. It is
    possible to define a custom table name in association definition

Make sure primary keys in tables **cakes** and **recipes** have
"id" fields as assumed by convention. If they're different than
assumed, it has to be changed in model's :ref:`model-primaryKey`

Once this new table has been created, we can define the HABTM
association in the model files. We're gonna skip straight to the
array syntax this time::

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

Possible keys for HABTM association arrays include:

.. _ref-habtm-arrays:

-  **className**: the classname of the model being associated to
   the current model. If you're defining a ‘Recipe HABTM Ingredient'
   relationship, the className key should equal ‘Ingredient.'
-  **joinTable**: The name of the join table used in this
   association (if the current table doesn't adhere to the naming
   convention for HABTM join tables).
-  **with**: Defines the name of the model for the join table. By
   default CakePHP will auto-create a model for you. Using the example
   above it would be called IngredientsRecipe. By using this key you can
   override this default name. The join table model can be used just
   like any "regular" model to access the join table directly. By creating
   a model class with such name and filename you can add any custom behavior
   to the join table searches, such as adding more information/columns to it
-  **foreignKey**: the name of the foreign key found in the current
   model. This is especially handy if you need to define multiple
   HABTM relationships. The default value for this key is the
   underscored, singular name of the current model, suffixed with
   ‘\_id'.
-  **associationForeignKey**: the name of the foreign key found in
   the other model. This is especially handy if you need to define
   multiple HABTM relationships. The default value for this key is the
   underscored, singular name of the other model, suffixed with
   ‘\_id'.
-  **unique**: boolean or string ``keepExisting``.
    - If true (default value) cake will first delete existing relationship
      records in the foreign keys table before inserting new ones.
      Existing associations need to be passed again when updating.
    - When false, cake will insert the relationship record, and that
      no join records are deleted during a save operation.
    - When set to ``keepExisting``, the behavior is similar to `true`,
      but existing associations are not deleted.
-  **conditions**: an array of find() compatible conditions or SQL
   string.  If you have conditions on an associated table, you should use a
   'with' model, and define the necessary belongsTo associations on it.
-  **fields**: A list of fields to be retrieved when the associated
   model data is fetched. Returns all fields by default.
-  **order**: an array of find() compatible order clauses or SQL
   strings
-  **limit**: The maximum number of associated rows you want
   returned.
-  **offset**: The number of associated rows to skip over (given
   the current conditions and order) before fetching and associating.
-  **finderQuery, deleteQuery, insertQuery**: A complete SQL query
   CakePHP can use to fetch, delete, or create new associated model
   records. This should be used in situations that require very custom
   results.

Once this association has been defined, find operations on the
Recipe model will also fetch related Tag records if they exist::

    // Sample results from a $this->Recipe->find() call.
    
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

Remember to define a HABTM association in the Ingredient model if you'd
like to fetch Recipe data when using the Ingredient model.

.. note::

   HABTM data is treated like a complete set, each time a new data association is added
   the complete set of associated rows in database is dropped and created again so you
   will always need to pass the whole data set for saving. For an alternative to using
   HABTM see :ref:`hasMany-through`

.. tip::

    For more information on saving HABTM objects see :ref:`saving-habtm`


.. _hasMany-through:

hasMany through (The Join Model)
--------------------------------

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

Sometimes it becomes necessary to create and destroy model
associations on the fly. This may be for any number of reasons:


-  You want to reduce the amount of associated data fetched, but
   all your associations are on the first level of recursion.
-  You want to change the way an association is defined in order to
   sort or filter associated data.

This association creation and destruction is done using the CakePHP
model bindModel() and unbindModel() methods. (There is also a very
helpful behavior called "Containable", please refer to manual
section about Built-in behaviors for more information). Let's set
up a few models so we can see how bindModel() and unbindModel()
work. We'll start with two models::

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

Now, in the LeadersController, we can use the find() method in the
Leader model to fetch a Leader and its associated followers. As you
can see above, the association array in the Leader model defines a
"Leader hasMany Followers" relationship. For demonstration
purposes, let's use unbindModel() to remove that association in a
controller action::

    <?php
    public function some_action() {
        // This fetches Leaders, and their associated Followers
        $this->Leader->find('all');
      
        // Let's remove the hasMany...
        $this->Leader->unbindModel(
            array('hasMany' => array('Follower'))
        );
      
        // Now using a find function will return 
        // Leaders, with no Followers
        $this->Leader->find('all');
      
        // NOTE: unbindModel only affects the very next 
        // find function. An additional find call will use 
        // the configured association information.
      
        // We've already used find('all') after unbindModel(), 
        // so this will fetch Leaders with associated 
        // Followers once again...
        $this->Leader->find('all');
    }

.. note::

    Removing or adding associations using bind- and unbindModel() only
    works for the *next* find operation only unless the second
    parameter has been set to false. If the second parameter has been
    set to *false*, the bind remains in place for the remainder of the
    request.

Here’s the basic usage pattern for unbindModel()::

    <?php
    $this->Model->unbindModel(
        array('associationType' => array('associatedModelClassName'))
    );

Now that we've successfully removed an association on the fly,
let's add one. Our as-of-yet unprincipled Leader needs some
associated Principles. The model file for our Principle model is
bare, except for the public $name statement. Let's associate some
Principles to our Leader on the fly (but remember–only for just the
following find operation). This function appears in the
LeadersController::

    <?php
    public function another_action() {
        // There is no Leader hasMany Principles in 
        // the leader.php model file, so a find here, 
        // only fetches Leaders.
        $this->Leader->find('all');
     
        // Let's use bindModel() to add a new association 
        // to the Leader model:
        $this->Leader->bindModel(
            array('hasMany' => array(
                    'Principle' => array(
                        'className' => 'Principle'
                    )
                )
            )
        );
     
        // Now that we're associated correctly, 
        // we can use a single find function to fetch 
        // Leaders with their associated principles:
        $this->Leader->find('all');
    }

There you have it. The basic usage for bindModel() is the
encapsulation of a normal association array inside an array whose
key is named after the type of association you are trying to
create::

    <?php
    $this->Model->bindModel(
        array('associationName' => array(
                'associatedModelClassName' => array(
                    // normal association keys go here...
                )
            )
        )
    );

Even though the newly bound model doesn't need any sort of
association definition in its model file, it will still need to be
correctly keyed in order for the new association to work properly.

Multiple relations to the same model
------------------------------------

There are cases where a Model has more than one relation to another
Model. For example you might have a Message model that has two
relations to the User model. One relation to the user that sends a
message, and a second to the user that receives the message. The
messages table will have a field user\_id, but also a field
recipient\_id. Now your Message model can look something like::

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

Recipient is an alias for the User model. Now let's see what the
User model would look like::

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

It is also possible to create self associations as shown below::

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

If your table has ``parent_id`` field you can also use :ref:`model-find-threaded`
to fetch nested array of records using a single query without
setting up any associations.

Joining tables
--------------

In SQL you can combine related tables using the JOIN statement.
This allows you to perform complex searches across multiples tables
(i.e: search posts given several tags).

In CakePHP some associations (belongsTo and hasOne) performs
automatic joins to retrieve data, so you can issue queries to
retrieve models based on data in the related one.

But this is not the case with hasMany and hasAndBelongsToMany
associations. Here is where forcing joins comes to the rescue. You
only have to define the necessary joins to combine tables and get
the desired results for your query.

.. note::

    Remember you need to set the recursion to -1 for this to work. I.e:
    $this->Channel->recursive = -1;

To force a join between tables you need to use the "modern" syntax
for Model::find(), adding a 'joins' key to the $options array. For
example::

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

    Note that the 'join' arrays are not keyed.

In the above example, a model called Item is left joined to the
channels table. You can alias the table with the Model name, so the
retrieved data complies with the CakePHP data structure.

The keys that define the join are the following:


-  **table**: The table for the join.
-  **alias**: An alias to the table. The name of the model
   associated with the table is the best bet.
-  **type**: The type of join: inner, left or right.
-  **conditions**: The conditions to perform the join.

With joins, you could add conditions based on Related model
fields::

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

You could perform several joins as needed in hasAndBelongsToMany:

Suppose a Book hasAndBelongsToMany Tag association. This relation
uses a books\_tags table as join table, so you need to join the
books table to the books\_tags table, and this with the tags
table::

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

Using joins allows you to have a maximum flexibility in how CakePHP handles associations
and fetch the data, however in most cases you can use other tools to achieve the same results
such as correctly defining associations, binding models on the fly and using the Containable
behavior. This feature should be used with care because it could lead, in a few cases, into bad formed
SQL queries if combined with any of the former techniques described for associating models.


.. meta::
    :title lang=fr: Associations : relier les modèles entre eux
    :keywords lang=fr: relationship types,relational mapping,recipe database,relational database,this section covers,web applications,recipes,models,cakephp,storage
