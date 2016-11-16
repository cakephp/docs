Associations : Lier les models
##############################

Une des caractéristiques les plus puissantes de CakePHP est sa capacité
d'établir les liens nécessaires entre les models d'après les informations
fournies. Dans CakePHP, les liens entre models sont gérés par des associations.

Définir les relations entre différents objets à l'intérieur de votre
application sera une tâche naturelle. Par exemple : dans une base de
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

Pour des informations sur les associations avec les models de Plugin, voyez les
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
un vers plusieurs          hasMany               Un user peut avoir plusieurs recipes.
-------------------------- --------------------- ------------------------------------------------------------
plusieurs vers un          belongsTo             Plusieurs recipes appartiennent à un user.
-------------------------- --------------------- ------------------------------------------------------------
plusieurs vers plusieurs   hasAndBelongsToMany   Les recipes ont, et appartiennent à plusieurs ingrédients.
========================== ===================== ============================================================

Pour clarifier davantage la définition des associations dans les modèles:
Si la table d'un model contient la clé étrangère (other_model_id), le type
de relation dans ce model est **toujours** un Model **belongsTo** OtherModel.

Les associations se définissent en créant une variable de classe nommée
comme l'association que vous souhaitez définir. La variable de classe peut
quelquefois se limiter à une chaîne de caractère, mais peut également être
aussi complète qu'un tableau multi-dimensionnel utilisé pour définir les
spécificités de l'association.

::

    class User extends AppModel {
        public $hasOne = 'Profile';
        public $hasMany = array(
            'Recipe' => array(
                'className' => 'Recipe',
                'conditions' => array('Recipe.approved' => '1'),
                'order' => 'Recipe.created DESC'
            )
        );
    }

Dans l'exemple ci-dessus, la première occurrence du mot 'Recipe' est ce que
l'on appelle un 'Alias'. C'est un identifiant pour la relation et cela peut
être ce que vous souhaitez. En règle générale, on choisit le même nom que la
classe qu'il référence. Toutefois, **les alias pour chaque model doivent être
uniques dans une app entière**. Par exemple, il est approprié d'avoir::

     class User extends AppModel {
        public $hasMany = array(
            'MyRecipe' => array(
                'className' => 'Recipe',
            )
        );
        public $hasAndBelongsToMany = array(
            'MemberOf' => array(
                'className' => 'Group',
            )
        );
    }

    class Group extends AppModel {
        public $hasMany = array(
            'MyRecipe' => array(
                'className' => 'Recipe',
            )
        );
        public $hasAndBelongsToMany = array(
            'Member' => array(
                'className' => 'User',
            )
        );
    }

mais ce qui suit ne fonctionnera pas bien en toute circonstance::

    class User extends AppModel {
        public $hasMany = array(
            'MyRecipe' => array(
                'className' => 'Recipe',
            )
        );
        public $hasAndBelongsToMany = array(
            'Member' => array(
                'className' => 'Group',
            )
        );
    }

    class Group extends AppModel {
        public $hasMany = array(
            'MyRecipe' => array(
                'className' => 'Recipe',
            )
        );
        public $hasAndBelongsToMany = array(
            'Member' => array(
                'className' => 'User',
            )
        );
    }

parce que ici nous avons l'alias 'Member' se référant aux deux models
User (dans Group) et Group (dans User) dans les associations
HABTM. Choisir des noms non-uniques pour les alias de models à travers les
models peut entraîner un comportement inattendu.

CakePHP va créer automatiquement des liens entre les objets model associés.
Ainsi par exemple dans votre model ``User``, vous pouvez accéder
au model ``Recipe`` comme ceci::

    $this->Recipe->someFunction();

De même dans votre controller, vous pouvez accéder à un model associé
simplement en poursuivant les associations de votre model::

    $this->User->Recipe->someFunction();

.. note::

    Rappelez-vous que les associations sont définies dans 'un sens'. Si vous
    définissez User hasMany Recipe, cela n'a aucun effet sur le model
    Recipe. Vous avez besoin de définir Recipe belongsTo User pour
    pouvoir accéder au model User à partir du model Recipe.

hasOne
------

Mettons en place un model User avec une relation de type hasOne vers
un model Profile.

Tout d'abord, les tables de votre base de données doivent être saisies
correctement. Pour qu'une relation de type hasOne fonctionne, une table
doit contenir une clé étrangère qui pointe vers un enregistrement de l'autre.
Dans notre cas la table profiles contiendra un champ nommé user\_id.
Le motif de base est :

**hasOne:**, *l'autre* model contient la clé étrangère.

==================== ==================
Relation             Schema
==================== ==================
Apple hasOne Banana  bananas.apple\_id
-------------------- ------------------
User hasOne Profile  profiles.user\_id
-------------------- ------------------
Doctor hasOne Mentor mentors.doctor\_id
==================== ==================

.. note::

    Il n'est pas obligatoire de suivre les conventions de CakePHP, vous pouvez
    facilement outrepasser l'utilisation de toute clé étrangère dans les
    définitions de vos associations. Néanmoins, coller aux conventions donnera
    un code moins répétitif, plus facile à lire et à maintenir.

Le fichier model User sera sauvegardé dans /app/Model/User.php.
Pour définir l'association ‘User hasOne Profile’, ajoutez la propriété
$hasOne à la classe de model. Pensez à avoir un model Profile dans
/app/Model/Profile.php, ou bien l'association ne marchera pas::

    class User extends AppModel {
        public $hasOne = 'Profile';
    }

Il y a deux façons de décrire cette relation dans vos fichiers de model.
La méthode la plus simple est de définir l'attribut $hasOne pour une chaîne
de caractère contenant le className du model associé, comme nous l'avons
fait au-dessus.

Si vous avez besoin de plus de contrôle, vous pouvez définir vos associations
en utilisant la syntaxe des tableaux. Par exemple, vous voudrez peut-être
limiter l'association pour inclure seulement certains enregistrements.

::

    class User extends AppModel {
        public $hasOne = array(
            'Profile' => array(
                'className' => 'Profile',
                'conditions' => array('Profile.published' => '1'),
                'dependent' => true
            )
        );
    }

Les clés possibles pour les tableaux d'association incluent:

-  **className**: le nom de la classe du model que l\'on souhaite
   associer au model actuel. Si l\'on souhaite définir la relation
   ’User a un Profile’, la valeur associée à la clé 'className'
   devra être ‘Profile’.
-  **foreignKey**: le nom de la clé étrangère que l'on trouve dans
   l'autre model. Ceci sera particulièrement pratique si vous avez
   besoin de définir des relations hasOne multiples. La valeur par
   défaut de cette clé est le nom du model actuel (avec des underscores)
   suffixé avec ‘\_id’. Dans l'exemple ci-dessus la valeur par défaut aurait
   été 'user\_id’. Si l'autre model utilise un autre nom que 'id' pour la clé
   primaire, pensez à le préciser en utilisant la propriété ``$primaryKey`` de
   la classe de Model (dans l'exemple ci-dessus, dans la classe 'Profile').
   Sinon, les suppressions en cascade ne fonctionneront pas.
-  **conditions**: un tableau des conditions compatibles avec find() ou un
   fragment de code SQL tel que array('Profile.approved' => true).
-  **fields**: une liste des champs à récupérer lorsque les données du model
   associé sont parcourues. Par défaut, cela retourne tous les champs.
-  **order**: Un tableau des clauses order compatible avec la fonction find()
   ou un fragment de code SQL tel que array('Profile.last_name' => 'ASC').
-  **dependent**: lorsque la valeur de la clé 'dependent' est true et que la
   méthode delete() du model est appelée avec le paramètre 'cascade' valant
   true également, les enregistrements des models associés sont supprimés.
   Dans ce cas nous avons fixé la valeur à true de manière à ce que la
   suppression d'un User supprime également le Profile associé.

Une fois que cette association a été définie, les opérations de recherche
sur le model User récupèrent également les enregistrements Profile
liés s'il en existe::

    //Exemple de résultats d'un appel à $this->User->find().

    Array
    (
        [User] => Array
            (
                [id] => 121
                [name] => Gwoo the Kungwoo
                [created] => 2007-05-01 10:31:01
            )
        [Profile] => Array
            (
                [id] => 12
                [user_id] => 121
                [skill] => Baking Cakes
                [created] => 2007-05-01 10:31:01
            )
    )

belongsTo
---------

Maintenant que nous avons accès aux données du Profile depuis le model
User, définissons une association belongsTo (appartient a) dans
le model Profile afin de pouvoir accéder aux données User liées.
L'association belongsTo est un complément naturel aux associations hasOne et
hasMany : elle permet de voir les données dans le sens inverse.

Lorsque vous définissez les clés de votre base de données pour une relation
de type belongsTo, suivez cette convention :

**belongsTo:** le model *courant* contient la clé étrangère.

======================= ==================
Relation                Schema
======================= ==================
Banana belongsTo Apple  bananas.apple\_id
----------------------- ------------------
Profile belongsTo User  profiles.user\_id
----------------------- ------------------
Mentor belongsTo Doctor mentors.doctor\_id
======================= ==================

.. tip::

    Si un model (table) contient une clé étrangère, elle appartient
    à (belongsTo) l'autre model (table).

Nous pouvons définir l'association belongsTo dans notre model Profile dans
/app/Model/Profile.php en utilisant la syntaxe de chaîne de caractère comme ce
qui suit::

    class Profile extends AppModel {
        public $belongsTo = 'User';
    }

Nous pouvons aussi définir une relation plus spécifique en utilisant une
syntaxe de tableau::

    class Profile extends AppModel {
        public $belongsTo = array(
            'User' => array(
                'className' => 'User',
                'foreignKey' => 'user_id'
            )
        );
    }

Les clés possibles pour les tableaux d'association belongsTo incluent:

-  **className**: le nom de classe du model associé au model courant.
   Si vous définissez une relation ‘Profile belongsTo User’, la clé du
   nom de classe devra être ‘User.’
-  **foreignKey**: le nom de la clé étrangère trouvée dans le model courant.
   C'est particulièrement pratique si vous avez besoin de définir de multiples
   relations belongsTo. La valeur par défaut pour cette clé est le nom au
   singulier de l'autre model avec des underscores, suffixé avec
   ``_id``.
-  **conditions**: un tableau de conditions compatibles find() ou de chaînes
   SQL comme ``array('User.active' => true)``.
-  **type**: le type de join à utiliser dans la requête SQL, par défaut
   LEFT ce qui peut ne pas correspondre à vos besoins dans toutes les
   situations, INNER peut être utile quand vous voulez tout de votre model
   principal ainsi que de vos models associés! (Utile quand utilisé
   avec certaines conditions bien sur).
   **(NB: la valeur de type est en lettre minuscule - ex. left, inner)**
-  **fields**: Une liste des champs à retourner quand les données du model
   associé sont récupérées. Retourne tous les champs par défaut.
-  **order**: un tableau de clauses order qui sont compatibles avec find()
   ou des chaînes SQL comme ``array('User.username' => 'ASC')``
-  **counterCache**: Si défini à true, le Model associé va automatiquement
   augmenter ou diminuer le champ "[singular\_model\_name]\_count" dans la
   table étrangère quand vous faites un ``save()`` ou un ``delete()``. Si
   c'est une chaîne alors il s'agit du nom du champ à utiliser. La valeur
   dans le champ counter représente le nombre de lignes liées. Vous pouvez
   aussi spécifier de multiples caches counter en définissant un tableau,
   regardez :ref:`multiple-counterCache`.
-  **counterScope**: Un tableau de conditions optionnelles à utiliser pour
   la mise à jour du champ du cache counter.

Une fois que cette association a été définie, les opérations de find sur le
model Profile vont aussi récupérer un enregistrement lié de User si il existe::

    //Exemples de résultats d'un appel de $this->Profile->find().

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

counterCache - Cache your count()
---------------------------------

Cette fonction vous aide à mettre en cache le count des données liées.
Au lieu de compter les enregistrements manuellement via ``find('count')``,
le model suit lui-même tout ajout/suppression à travers le model ``$hasMany``
associé et augmente/diminue un champ numérique dédié dans la table du model
parent.

Le nom du champ est le nom du model particulier suivi par un underscore
et le mot "count"::

    my_model_count

Disons que vous avez un model appelé ``ImageComment`` et un model
appelé ``Image``, vous ajouteriez un nouveau champ numérique (INT) à la
table ``images`` et l'appelleriez ``image_comment_count``.

Ici vous trouverez quelques exemples supplémentaires:

========== ======================= =========================================
Model      Associated Model        Example
========== ======================= =========================================
User       Image                   users.image\_count
---------- ----------------------- -----------------------------------------
Image      ImageComment            images.image\_comment\_count
---------- ----------------------- -----------------------------------------
BlogEntry  BlogEntryComment        blog\_entries.blog\_entry\_comment\_count
========== ======================= =========================================

Une fois que vous avez ajouté le champ counter, c'est tout bon. Activez
counter-cache dans votre association en ajoutant une clé ``counterCache`` et
configurez la valeur à ``true``::

    class ImageComment extends AppModel {
        public $belongsTo = array(
            'Image' => array(
                'counterCache' => true,
            )
        );
    }

A partir de maintenant, chaque fois que vous ajoutez ou retirez un
``ImageComment`` associé à ``Image``, le nombre dans ``image_comment_count``
est ajusté automatiquement.

counterScope
============

Vous pouvez aussi spécifier ``counterScope``. Cela vous permet de spécifier une
condition simple qui dit au model quand mettre à jour (ou quand ne pas
le faire, selon la façon dont on le conçoit) la valeur counter.

En utilisant notre exemple de model Image, nous pouvons le spécifier comme
cela::

    class ImageComment extends AppModel {
        public $belongsTo = array(
            'Image' => array(
                'counterCache' => true,
                // compte seulement si "ImageComment" est active = 1
                'counterScope' => array(
                    'ImageComment.active' => 1
                )
            )
        );
    }

.. _multiple-counterCache:

Multiple counterCache
=====================

Depuis la 2.0, CakePHP supporte les multiples ``counterCache`` dans une seule
relation de model. Il est aussi possible de définir un ``counterScope`` pour
chaque ``counterCache``. En assumant que vous avez un model ``User`` et un
model ``Message`` et que vous souhaitez être capable de compter le montant
de messages lus et non lus pour chaque utilisateur.

========= ====================== ===========================================
Model     Field                  Description
========= ====================== ===========================================
User      users.messages\_read   Compte les ``Message`` lus
--------- ---------------------- -------------------------------------------
User      users.messages\_unread Compte les ``Message`` non lus
--------- ---------------------- -------------------------------------------
Message   messages.is\_read      Détermines si un ``Message`` est lu ou non.
========= ====================== ===========================================

Avec la configuration de votre ``belongsTo`` qui ressemblerait à cela::

    class Message extends AppModel {
        public $belongsTo = array(
            'User' => array(
                'counterCache' => array(
                    'messages_read' => array('Message.is_read' => 1),
                    'messages_unread' => array('Message.is_read' => 0)
                )
            )
        );
    }

hasMany
-------

Prochaine étape : définir une association "User hasMany Comment". Une
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

    class User extends AppModel {
        public $hasMany = 'Comment';
    }

Nous pouvons également définir une relation plus spécifique en utilisant
un tableau::

    class User extends AppModel {
        public $hasMany = array(
            'Comment' => array(
                'className' => 'Comment',
                'foreignKey' => 'user_id',
                'conditions' => array('Comment.status' => '1'),
                'order' => 'Comment.created DESC',
                'limit' => '5',
                'dependent' => true
            )
        );
    }

Les clés possibles pour les tableaux d'association hasMany sont :

-  **className**: le nom de la classe du model que l'on souhaite associer au
   model actuel. Si l'on souhaite définir la relation ‘User hasMany Comment’
   (l'User a plusieurs Comments),
   la valeur associée à la clef 'className' devra être ‘Comment’.
-  **foreignKey**: le nom de la clé étrangère que l'on trouve dans l'autre
   model. Ceci sera particulièrement pratique si vous avez besoin de définir
   des relations hasMany multiples. La valeur par défaut de cette clé est
   le nom du model actuel (avec des underscores) suffixé avec ‘\_id’
-  **conditions**: un tableau de conditions compatibles avec find() ou
   des chaînes SQL comme array('Comment.visible' => true).
-  **order**: un tableau de clauses order compatibles avec find() ou des
   chaînes SQL comme array('Profile.last_name' => 'ASC').
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
sur le model User récupèreront également les Comments liés si
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

hasAndBelongsToMany (HABTM)
---------------------------

Très bien. A ce niveau, vous pouvez déjà vous considérer comme un professionnel
des associations de models CakePHP. Vous êtes déjà assez compétent
dans les 3 types d'associations afin de pouvoir effectuer la plus grande
partie des relations entre les objets.

Abordons maintenant le dernier type de relation : hasAndBelongsToMany (a
et appartient à plusieurs), ou HABTM. Cette association est utilisée lorsque
vous avez deux models qui ont besoin d'être reliés, de manière répétée,
plusieurs fois, de plusieurs façons différentes.

La principale différence entre les relations hasMany et HABTM est que le lien
entre les models n'est pas exclusif dans le cadre d'une relation HABTM. Par
exemple, relions notre model Recipe avec un model Ingredient en utilisant
HABTM. Le fait d'utiliser les tomates en Ingredient pour la recipe de
Spaghettis de ma grand-mère ne "consomme" pas l'Ingredient. Je peux aussi
utiliser mes tomates pour une Recipe Salade.

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

Assurez-vous que les clés primaires dans les tables **cakes** et **recipes**
ont un champ "id" comme assumé par convention. Si ils sont différents de
ceux anticipés, il faut le changer dans la :ref:`model-primaryKey` du
model.

Une fois que cette nouvelle table a été créée, on peut définir l'association
HABTM dans les fichiers de model. Cette fois-ci, nous allons directement voir
la syntaxe en tableau::

    class Recipe extends AppModel {
        public $hasAndBelongsToMany = array(
            'Ingredient' =>
                array(
                    'className' => 'Ingredient',
                    'joinTable' => 'ingredients_recipes',
                    'foreignKey' => 'recipe_id',
                    'associationForeignKey' => 'ingredient_id',
                    'unique' => true,
                    'conditions' => '',
                    'fields' => '',
                    'order' => '',
                    'limit' => '',
                    'offset' => '',
                    'finderQuery' => '',
                    'with' => ''
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
   l'exemple ci-dessus la valeur aurait été RecipesTag. En utilisant
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
-  **associationForeignKey**: Le nom de la clé étrangère que l'on trouve
   dans l'autre model. Ceci sera particulièrement pratique si vous avez
   besoin de définir des relations HABTM multiples. La valeur par défaut de
   cette clé est le nom de l'autre model (avec des underscores) suffixé
   avec ‘\_id'.
-  **unique**: Un boléen ou une chaîne de caractères ``keepExisting``.
    - Si true (valeur par défaut) CakePHP supprimera d'abord les enregistrements
      des relations existantes dans la table des clés étrangères avant d'en
      insérer de nouvelles. Les associations existantes devront être passées
      encore une fois lors d'une mise à jour.
    - Si à false, CakePHP va insérer les nouveaux enregistrements de liaison
      spécifiés et ne laissait aucun enregistrement de liaison existant,
      provenant par exemple d'enregistrements dupliqués de liaison.
    - Si ``keepExisting`` est définie, le behavior est similaire à `true`,
      mais avec une vérification supplémentaire afin que si un enregistrement
      à ajouter est en doublon d'un enregistrement de liaison existant,
      l'enregistrement de liaison existant n'est pas supprimé et le doublon
      est ignoré. Ceci peut être utile par exemple, la table de jointure a
      des données supplémentaires en lui qui doivent être gardées.
-  **conditions**: un tableau de conditions compatibles avec find() ou des
   chaînes SQL. Si vous avez des conditions sur la table associée, vous devez
   utiliser un model 'with', et définir les associations belongsTo nécessaires
   sur lui.
-  **fields**: Une liste des champs à récupérer lorsque les données du model
   associé sont parcourues. Par défaut, cela retourne tous les champs.
-  **order**: un tableau de clauses order compatibles avec find() ou avec
   des chaînes SQL.
-  **limit**: Le nombre maximum de lignes associées que vous voulez retourner.
-  **offset**: Le nombre de lignes associées à enlever (étant donnés les
   conditions et l'order courant) avant la récupération et l'association.
-  **finderQuery**: Une requête SQL complète que
   CakePHP peut utiliser pour récupérer les enregistrements du model associé.
   Ceci doit être utilisé dans les situations qui nécessitent des résultats
   très personnalisés.

Une fois que cette association a été définie, les opérations de recherche
sur le model Recipe récupèreront également les Ingredients liés si ils
existent::

    // Exemple de résultats d'un appel a $this->Recipe->find().

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
vous souhaitez retrouver les données de Recipe lorsque vous manipulez le
model Ingredient.

.. note::

   Les données HABTM sont traitées comme un ensemble complet, chaque fois
   qu'une nouvelle association de données est ajoutée, l'ensemble complet
   de lignes associées dans la base de données est enlevé et recrée, ainsi
   vous devrez toujours passer l'ensemble des données définies pour
   sauvegarder. Pour avoir une alternative à l'utilisation de HABTM, regardez
   :ref:`hasMany-through`

.. tip::

    Pour plus d'informations sur la sauvegarde des objets HABTM regardez
    :ref:`saving-habtm`


.. _hasMany-through:

hasMany through (Le Model Join)
-------------------------------

Il est parfois nécessaire de stocker des données supplémentaires avec une
association many to many. Considérons ce qui suit

`Student hasAndBelongsToMany Course`

`Course hasAndBelongsToMany Student`

En d'autres termes, un Student peut avoir plusieurs (many) Courses et un
Course peut être pris par plusieurs (many) Students. C'est une association
simple de many to many nécessitant une table comme ceci::

    id | student_id | course_id

Maintenant si nous souhaitions stocker le nombre de jours que les students
doivent faire pour leur course et leur grade final? La table que nous
souhaiterions serait comme ceci::

    id | student_id | course_id | days_attended | grade

Le problème est que hasAndBelongsToMany ne va pas supporter ce type de
scénario parce que quand les associations hasAndBelongsToMany sont sauvegardées,
l'association est d'abord supprimée. Vous perdriez les données supplémentaires
dans les colonnes qui ne seraient pas remplacées dans le nouvel ajout.

.. versionchanged:: 2.1

    Vous pouvez définir la configuration de ``unique`` à ``keepExisting``,
    contournant la perte de données supplémentaires pendant l'opération de
    sauvegarde. Regardez la clé ``unique`` dans
    :ref:`HABTM association arrays <ref-habtm-arrays>`.

La façon d'implémenter nos exigences est d'utiliser un **join model**,
autrement connu comme une association **hasMany through**.
Cela étant fait, l'association est elle-même un model. Ainsi, vous pouvez
créer un nouveau model CourseMembership. Regardez les models suivants. ::

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

Le model join CourseMembership identifie de façon unique une participation
d'un Student à un Course en plus d'ajouter des meta-informations.

Les models Join sont des choses particulièrement pratiques à utiliser
et CakePHP facilite cela avec les associations intégrées hasMany et belongsTo
et la fonctionnalité de saveAll.

.. _dynamic-associations:

Créer et Détruire des Associations à la Volée
---------------------------------------------

Quelquefois il devient nécessaire de créer et détruire les associations
de models à la volée. Cela peut être le cas pour un certain nombre de raisons :

-  Vous voulez réduire la quantité de données associées qui seront récupérées,
   mais toutes vos associations sont sur le premier niveau de récursion.
-  Vous voulez changer la manière dont une association est définie afin de
   classer ou filtrer les données associées.

La création et destruction de ces associations se font en utilisant les
méthodes de models CakePHP bindModel() et unbindModel(). (Il existe aussi
un behavior très utile appelé "Containable", merci de vous référer à la
section du manuel sur les behaviors intégrés pour plus d'informations).
Mettons en place quelques models pour pouvoir ensuite voir comment
fonctionnent bindModel() et unbindModel(). Nous commencerons avec
deux models::

    class Leader extends AppModel {
        public $hasMany = array(
            'Follower' => array(
                'className' => 'Follower',
                'order' => 'Follower.rank'
            )
        );
    }

    class Follower extends AppModel {
        public $name = 'Follower';
    }

Maintenant, dans le controller LeadersController, nous pouvons utiliser
la méthode find() du model Leader pour retrouver un Leader et les
Followers associés. Comme vous pouvez le voir ci-dessus, le tableau
d'association dans le model Leader définit une relation "Leader
hasMany (a plusieurs) Followers". Dans un but démonstratif, utilisons
unbindModel() pour supprimer cette association dans une action du
controller::

    public function some_action() {
        // Ceci récupère tous les Leaders, ainsi que leurs Followers
        $this->Leader->find('all');

        // Supprimons la relation hasMany() ...
        $this->Leader->unbindModel(
            array('hasMany' => array('Follower'))
        );

        // Désormais l'utilisation de la fonction find() retournera
        // des Leaders, sans aucun Followers
        $this->Leader->find('all');

        // NOTE : unbindModel n'affecte que la prochaine fonction find.
        // Un autre appel à find() utilisera les informations d'association
        // telles que configurée.

        // Nous avons déjà utilisé findAll('all') après unbindModel(),
        // ainsi cette ligne récupèrera une fois encore les Leaders
        // avec leurs Followers ...
        $this->Leader->find('all');
    }

.. note::

    Enlever ou ajouter des associations en utilisant
    bindModel() et unbindModel() ne fonctionne que pour la *prochaine*
    opération sur le model, à moins que le second paramètre n'ait été
    fixé à false. Si le second paramètre a été fixé à *false*, le lien reste
    en place pour la suite de la requête.

Voici un exemple basique d'utilisation de unbindModel()::

    $this->Model->unbindModel(
        array('associationType' => array('associatedModelClassName'))
    );

Maintenant que nous sommes arrivés à supprimer une association à la volée,
ajoutons-en une. Notre Leader jusqu'à présent sans Principles a besoin d'être
associé à quelques Principles. Le fichier de model pour notre model Principle
est dépouillé, il n'y a que la ligne var $name. Associons à la volée des
Principles à notre Leader (mais rappelons-le, seulement pour la prochaine
opération find). Cette fonction apparaît dans le controller LeadersController::

    public function another_action() {
        // Il n'y a pas d'association Leader hasMany Principle
        // dans le fichier de model Leader.php, ainsi un find
        // situé ici ne récupèrera que les Leaders.
        $this->Leader->find('all');

        // Utilisons bindModel() pour ajouter une nouvelle association
        // au model Leader :
        $this->Leader->bindModel(
            array('hasMany' => array(
                    'Principle' => array(
                        'className' => 'Principle'
                    )
                )
            )
        );

        // Si nous devons garder cette association après la réinitialisation du
        // model, nous allons passer booléen en deuxième paramètre, comme ceci:
        $this->Leader->bindModel(
            array('hasMany' => array(
                    'Principle' => array(
                        'className' => 'Principle'
                    )
                )
            ),
            false
        );

        // Maintenant que nous les avons associés correctement,
        // nous pouvons utiliser la fonction find une seule fois
        // pour récupérer les Leaders avec leurs Principles associés :
        $this->Leader->find('all');
    }

Ça y est, vous y êtes. L'utilisation basique de bindModel() est
l'encapsulation d'un tableau d'association classique, dans un tableau dont
la clé est le nom du type d'association que vous essayez de créer::

    $this->Model->bindModel(
        array('associationName' => array(
                'associatedModelClassName' => array(
                    // les clés d'association normale vont ici...
                )
            )
        )
    );

Bien que le model nouvellement associé n'ait besoin d'aucune définition
d'association dans son fichier de model, il devra tout de même contenir
les clés afin que la nouvelle association fonctionne bien.

Plusieurs relations avec le même model
--------------------------------------

Il y a des cas où un Model a plus d'une relation avec un autre Model. Par
exemple, vous pourriez avoir un model Message qui a deux relations avec le
model User. Une relation avec l'user qui envoie un message et
une seconde avec l'user qui reçoit le message. La table messages aura
un champ user\_id, mais aussi un champ receveur\_id. Maintenant, votre
model Message peut ressembler à quelque chose comme::

    class Message extends AppModel {
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

Recipient est un alias pour le model User. Maintenant, voyons à quoi
devrait ressembler le model User::

    class User extends AppModel {
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

**Récupérer un tableau imbriqué d'enregistrements associés:**

Si votre table a un champ ``parent_id``, vous pouvez aussi utiliser
:ref:`model-find-threaded` pour récupérer un tableau imbriqué d'enregistrements
en utilisant une seule requête sans définir aucune association.

.. _joining-tables:

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

    Souvenez-vous que vous avez besoin de définir la récursivité à -1 pour
    que cela fonctionne. Par exemple:
    $this->Channel->recursive = -1;

Pour forcer une jointure entre tables, vous avez besoin d'utiliser la syntaxe
"moderne" de Model::find(), en ajoutant une clé 'joins' au tableau $options.
Par exemple::

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

    Notez que les tableaux 'joins' ne sont pas indexés.

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
model lié::

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

Supposez une association Book hasAndBelongsToMany Tag. Cette relation utilise
une table books\_tags comme table de jointure, donc vous avez besoin de
joindre la table books à la table books\_tags et celle-ci avec la table
tags::

    $options['joins'] = array(
        array('table' => 'books_tags',
            'alias' => 'BooksTag',
            'type' => 'inner',
            'conditions' => array(
                'Book.id = BooksTag.book_id'
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

Utiliser joins vous permet d'avoir un maximum de flexibilité dans la façon dont
CakePHP gère les associations et récupère les données, cependant dans la
plupart des cas, vous pouvez utiliser d'autres outils pour arriver aux mêmes
résultats comme de définir correctement les associations, lier les models
à la volée et utiliser le behavior Containable. Cette fonctionnalité doit être
utilisée avec attention car elle peut conduire, dans certains cas, à quelques
erreurs SQL lorsqu'elle est combinée à d'autres techniques décrites
précédemment pour les models associés.


.. meta::
    :title lang=fr: Associations : relier les models entre eux
    :keywords lang=fr: relationship types,relational mapping,recipe database,base de données relationnelle,relational database,this section covers,web applications,recipes,models,cakephp,storage,stockage
