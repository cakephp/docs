Associations - Lier les Tables Ensemble
#######################################

Définir les relations entre les différents objets dans votre application
sera un processus naturel. Par exemple, un article peut avoir plusieurs
commentaires, et appartenir à un auteur. Les Auteurs peuvent avoir plusieurs
articles et plusieurs commentaires. CakePHP facilite la gestion de ces
associations. Les quatre types d'association dans CakePHP sont:
hasOne, hasMany, belongsTo, et belongsToMany.

============= ===================== =======================================
Relation      Type d'Association    Exemple
============= ===================== =======================================
one to one    hasOne                Un user a un profile.
------------- --------------------- ---------------------------------------
one to many   hasMany               Un user peut avoir plusieurs articles.
------------- --------------------- ---------------------------------------
many to one   belongsTo             Plusieurs articles appartiennent à un user.
------------- --------------------- ---------------------------------------
many to many  belongsToMany         Les Tags appartiennent aux articles.
============= ===================== =======================================

Les Associations sont définies durant la méthode ``inititalize()`` de votre
objet table. Les méthodes ayant pour nom le type d'association vous permettent
de définir les associations dans votre application. Par exemple, si nous
souhaitions définir une association belongsTo dans notre ArticlesTable::

    namespace App\Model\Table;

    use Cake\ORM\Table;

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Authors');
        }

    }

La forme la plus simple de toute configuration d'association prend l'alias de
la table avec laquelle vous souhaitez l'associer. Par défaut, tous les détails
d'une association vont utiliser les conventions de CakePHP. Si vous souhaitez
personnaliser la façon dont sont gérées vos associations, vous pouvez le faire
avec le deuxième paramètre::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Authors', [
                'className' => 'Publishing.Authors',
                'foreignKey' => 'authorid',
                'propertyName' => 'person'
            ]);
        }

    }

La même table peut être utilisée plusieurs fois pour définir différents types
d'associations. Par exemple considérons le cas où vous voulez séparer les
commentaires approuvés et ceux qui n'ont pas encore été modérés::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->hasMany('Comments', [
                'className' => 'Comments',
                'conditions' => ['approved' => true]
            ]);

            $this->hasMany('UnapprovedComments', [
                'className' => 'Comments',
                'conditions' => ['approved' => false],
                'propertyName' => 'unapproved_comments'
            ]);
        }
    }

Comme vous pouvez le voir, en spécifiant la clé ``className``, il est possible
d'utiliser la même table avec des associations différentes pour la même table.
Vous pouvez même créer les tables associées avec elles-même pour créer des
relations parent-enfant::

    class CategoriesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->hasMany('SubCategories', [
                'className' => 'Categories',
            ]);

            $this->belongsTo('ParentCategories', [
                'className' => 'Categories',
            ]);
        }
    }

Vous pouvez aussi définir les associations en masse via un appel unique
à la méthode ``Table::addAssociations()`` qui accepte en paramètre un
tableau contenant les noms de tables indexés par association::

    class PostsTable extends Table
    {

      public function initialize(array $config)
      {
        $this->addAssociations([
          'belongsTo' => [
            'Users' => ['className' => 'App\Model\Table\UsersTable']
          ],
          'hasMany' => ['Comments'],
          'belongsToMany' => ['Tags']
        ]);
      }

    }

Chaque type d'association accepte plusieurs associations où les clés sont les
alias et les valeurs sont les données de configuration de l'association. Si
une clé numérique est utilisée, la valeur sera traitée en tant qu'alias.

Associations HasOne
===================

Mettons en place une Table Users avec une relation de type hasOne (a une seule)
Table Addresses.

Tout d'abord, les tables de votre base de données doivent être saisies
correctement. Pour qu'une relation de type hasOne fonctionne, une table doit
contenir une clé étrangère qui pointe vers un enregistrement de l'autre. Dans
notre cas, la table addresses contiendra un champ nommé ``user_id``. Le motif de
base est:

**hasOne:** l'*autre* model contient la clé étrangère.

====================== ==================
Relation               Schema
====================== ==================
Users hasOne Addresses addresses.user\_id
---------------------- ------------------
Doctors hasOne Mentors mentors.doctor\_id
====================== ==================

.. note::

    Il n'est pas obligatoire de suivre les conventions de CakePHP, vous pouvez
    outrepasser l'utilisation de toute clé étrangère dans les définitions de vos
    associations. Néanmoins, coller aux conventions donnera un code moins
    répétitif, plus facile à lire et à maintenir.

Si nous avions les classes ``UsersTable`` et ``AddressesTable``, nous
pourrions faire l'association avec le code suivant::

    class UsersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasOne('Addresses');
        }
    }

Si vous avez besoin de plus de contrôle, vous pouvez définir vos associations
en utilisant la syntaxe des tableaux. Par exemple, vous voudrez peut-être
limiter l'association pour inclure seulement certains enregistrements::

    class UsersTable extends Table
    {
        public function initialize(array $config)
        {
            $this->hasOne('Addresses', [
                'className' => 'Addresses',
                'conditions' => ['Addresses.primary' => '1'],
                'dependent' => true
            ]);
        }
    }

Les clés possibles pour une association hasOne sont:

- **className**: le nom de la classe de la table que l'on souhaite associer au
  model actuel. Si l'on souhaite définir la relation 'User a une Address', la
  valeur associée à la clé 'className' devra être 'Addresses'.
- **foreignKey**: le nom de la clé étrangère que l'on trouve dans l'autre table.
  Ceci sera particulièrement pratique si vous avez besoin de définir des
  relations hasOne multiples. La valeur par défaut de cette clé est le nom du
  model actuel (avec des underscores) suffixé avec '\_id'. Dans l'exemple
  ci-dessus la valeur par défaut aurait été 'user\_id'.
- **bindingKey**: le nom de la colonne dans la table courante, qui sera utilisée
  pour correspondre à la ``foreignKey``. S'il n'est pas spécifié, la clé
  primaire (par exemple la colonne id de la table ``Users``) sera utilisée.
- **conditions**: un tableau des conditions compatibles avec find() ou un
  fragment de code SQL tel que ``['Addresses.primary' => true]``.
- **joinType**: le type de join à utiliser dans la requête SQL, par défaut
  à LEFT. Vous voulez peut-être utiliser INNER si votre association hasOne est
  requis.
- **dependent**: Quand la clé dependent est définie à ``true``, et qu'une
  entity est supprimée, les enregistrements du model associé sont aussi
  supprimés. Dans ce cas, nous le définissons à ``true`` pour que la
  suppression d'un User supprime aussi son Address associée.
- **cascadeCallbacks**: Quand ceci et **dependent** sont à ``true``, les
  suppressions en cascade vont charger et supprimer les entities pour que les
  callbacks soient lancés correctement. Quand il est à ``false``.
  ``deleteAll()`` est utilisée pour retirer les données associées et que aucun
  callback ne soit lancé.
- **propertyName**: Le nom de la propriété qui doit être rempli avec les données
  d'une table associée dans les résultats d'une table source. Par défaut, c'est
  un nom en underscore et singulier de l'association, donc ``address`` dans
  notre exemple.
- **strategy**: Définit la stratégie de requête à utiliser. Par défaut à
  'join'. L'autre valeur valide est 'select', qui utilise une requête distincte
  à la place.
- **finder**: La méthode finder à utiliser lors du chargement des
  enregistrements associés.

Une fois que cette association a été définie, les opérations find sur la table
Users peuvent contenir l'enregistrement Address, s'il existe::

    // Dans un controller ou dans une méthode table.
    $query = $users->find('all')->contain(['Addresses']);
    foreach ($query as $user) {
        echo $user->address->street;
    }

Ce qui est au-dessus génèrera une commande SQL similaire à::

    SELECT * FROM users INNER JOIN addresses ON addresses.user_id = users.id;

Associations BelongsTo
======================

Maintenant que nous avons un accès des données Address à partir de la table
User, définissons une association belongsTo dans la table Addresses afin
d'avoir un accès aux données liées de l'User. L'association belongsTo est un
complément naturel aux associations hasOne et hasMany, permettant de voir les
données associées dans l'autre sens.

Lorsque vous remplissez les clés des tables de votre base de données pour une
relation belongsTo, suivez cette convention:

**belongsTo:** le model *courant* contient la clé étrangère.

========================= ==================
Relation                  Schema
========================= ==================
Addresses belongsTo Users addresses.user\_id
------------------------- ------------------
Mentors belongsTo Doctors mentors.doctor\_id
========================= ==================

.. tip::

    Si une Table contient une clé étrangère, elle appartient à (belongsTo)
    l'autre Table.

Nous pouvons définir l'association belongsTo dans notre table Addresses comme
ce qui suit::

    class AddressesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Users');
        }
    }

Nous pouvons aussi définir une relation plus spécifique en utilisant une
syntaxe de tableau::

    class AddressesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsTo('Users', [
                'foreignKey' => 'user_id',
                'joinType' => 'INNER',
            ]);
        }
    }

Les clés possibles pour les tableaux d'association belongsTo sont:

- **className**: le nom de classe du model associé au model courant. Si vous
  définissez une relation 'Profile belongsTo User', la clé className
  devra être 'Users'.
- **foreignKey**: le nom de la clé étrangère trouvée dans la table courante.
  C'est particulièrement pratique si vous avez besoin de définir plusieurs
  relations belongsTo au même model. La valeur par défaut pour cette clé est le
  nom au singulier de l'autre model avec des underscores, suffixé avec ``_id``.
- **bindingKey**: le nom de la colonne dans l'autre table, qui sera utilisée
  pour correspondre à la ``foreignKey``. S'il n'est pas spécifié, la clé
  primaire (par exemple la colonne id de la table ``Users``) sera utilisée.
- **conditions**: un tableau de conditions compatibles find() ou de chaînes SQL
  comme ``['Users.active' => true]``
- **joinType**: le type de join à utiliser dans la requête SQL, par défaut LEFT
  ce qui peut ne pas correspondre à vos besoins dans toutes les situations,
  INNER peut être utile quand vous voulez tout de votre model principal ainsi
  que de vos models associés!
- **propertyName**: Le nom de la propriété qui devra être remplie avec les
  données de la table associée dans les résultats de la table source. Par défaut
  il s'agit du nom singulier avec des underscores de l'association donc
  ``user`` dans notre exemple.
- **strategy**: Définit la stratégie de requête à utiliser. Par défaut à
  'join'. L'autre valeur valide est 'select', qui utilise une requête distincte
  à la place.
- **finder**: La méthode finder à utiliser lors du chargement des
  enregistrements associés.

Une fois que cette association a été définie, les opérations find sur la table
Addresses peuvent contenir l'enregistrement User s'il existe::

    // Dans un controller ou dans une méthode table.
    $query = $addresses->find('all')->contain(['Users']);
    foreach ($query as $address) {
        echo $address->user->username;
    }

Ce qui est au-dessus génèrera une commande SQL similaire à::

    SELECT * FROM addresses LEFT JOIN users ON addresses.user_id = users.id;


Associations HasMany
====================

Un exemple d'association hasMany est "Article hasMany Comments" (Un Article a
plusieurs Commentaires). Définir cette association va nous permettre de
récupérer les commentaires d'un article quand l'article est chargé.

Lors de la création des tables de votre base de données pour une relation
hasMany, suivez cette convention:

**hasMany:** l'*autre* model contient la clé étrangère.

========================== ===================
Relation                   Schema
========================== ===================
Article hasMany Comment    Comment.article\_id
-------------------------- -------------------
Product hasMany Option     Option.product\_id
-------------------------- -------------------
Doctor hasMany Patient     Patient.doctor\_id
========================== ===================

Nous pouvons définir l'association hasMany dans notre model Articles comme
suit::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->hasMany('Comments');
        }
    }

Nous pouvons également définir une relation plus spécifique en utilisant un
tableau::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->hasMany('Comments', [
                'foreignKey' => 'article_id',
                'dependent' => true,
            ]);
        }
    }

Parfois vous voudrez configurer les clés composites dans vos associations::

    // Dans l'appel ArticlesTable::initialize()
    $this->hasMany('Reviews', [
        'foreignKey' => [
            'article_id',
            'article_hash'
        ]
    ]);

En se référant à l'exemple du dessus, nous avons passé un tableau contenant les
clés composites dans ``foreignKey``. Par défaut ``bindingKey`` serait
automatiquement défini respectivement avec ``id`` et ``hash``, mais imaginons
que vous souhaitiez spécifier avec des champs de liaisons différents de ceux par
défault, vous pouvez les configurer manuellement dans votre tableau
``bindingKeys``::

    // Dans un appel de ArticlesTable::initialize()
    $this->hasMany('Reviews', [
        'foreignKey' => [
            'article_id',
            'article_hash'
        ],
        'bindingKey' => [
            'whatever_id',
            'whatever_hash'
        ]
    ]);

Il est important de noter que les valeurs de ``foreignKey`` font référence à la
table **reviews** et les valeurs de ``bindingKey`` font référence à la table
**articles**.

Les clés possibles pour les tableaux d'association hasMany sont:

- **className**: le nom de la classe du model que l'on souhaite associer au
  model actuel. Si l'on souhaite définir la relation 'User hasMany Comment'
  (l'User a plusieurs Commentaires), la valeur associée à la clef 'className'
  devra être 'Comments'.
- **foreignKey**: le nom de la clé étrangère que l'on trouve dans l'autre
  table. Ceci sera particulièrement pratique si vous avez besoin de définir
  plusieurs relations hasMany. La valeur par défaut de cette clé est le nom
  du model actuel (avec des underscores) suffixé avec '\_id'.
- **bindingKey**: le nom de la colonne dans la table courante, qui sera utilisée
  pour correspondre à la ``foreignKey``. S'il n'est pas spécifié, la clé
  primaire (par exemple la colonne id de la table ``Users``) sera utilisée.
- **conditions**: un tableau de conditions compatibles avec find() ou des
  chaînes SQL comme ``['Comments.visible' => true]``.
- **sort**: un tableau compatible avec les clauses order de find() ou les
  chaînes SQL comme ``['Comments.created' => 'ASC']``.
- **dependent**: Lorsque dependent vaut ``true``, une suppression récursive du
  model est possible. Dans cet exemple, les enregistrements Comment seront
  supprimés lorsque leur Article associé l'aura été.
- **cascadeCallbacks**: Quand ceci et **dependent** sont à ``true``, les
  suppressions en cascade chargeront les entities supprimés pour que les
  callbacks soient correctement lancés. Si à ``false``. ``deleteAll()`` est
  utilisée pour retirer les données associées et aucun callback ne sera lancé.
- **propertyName**: Le nom de la propriété qui doit être rempli avec les données
  des Table associées dans les résultats de la table source. Par défaut,
  celui-ci est le nom au pluriel et avec des underscores de l'association donc
  ``comments`` dans notre exemple.
- **strategy**: Définit la stratégie de requête à utiliser. Par défaut à
  'select'. L'autre valeur valide est 'subquery', qui remplace la liste ``IN``
  avec une sous-requête équivalente.
- **saveStrategy**: Soit 'append' ou bien 'replace'. Quand 'append' est choisi,
  les enregistrements existants sont ajoutés aux enregistrements de la base de
  données. Quand 'replace' est choisi, les enregistrements associés qui ne sont
  pas dans l'ensemble actuel seront retirés. Si la clé étrangère est une colonne
  qui peut être null ou si ``dependent`` est à true, les enregistrements seront
  orphelins.
- **finder**: La méthode finder à utiliser lors du chargement des
  enregistrements associés.

Une fois que cette association a été définie, les opérations de recherche sur
la table Articles récupèreront également les Comments liés s'ils existent::

    // Dans un controller ou dans une méthode de table.
    $query = $articles->find('all')->contain(['Comments']);
    foreach ($query as $article) {
        echo $article->comments[0]->text;
    }

Ce qui est au-dessus génèrera une commande SQL similaire à::

    SELECT * FROM articles;
    SELECT * FROM comments WHERE article_id IN (1, 2, 3, 4, 5);

Quand la stratégie de sous-requête est utilisée, une commande SQL similaire à
ce qui suit sera générée::

    SELECT * FROM articles;
    SELECT * FROM comments WHERE article_id IN (SELECT id FROM articles);

Vous voudrez peut-être mettre en cache les compteurs de vos associations
hasMany. C'est utile quand vous avez souvent besoin de montrer le nombre
d'enregistrements associés, mais que vous ne souhaitez pas charger tous les
articles juste pour les compter. Par exemple, le compteur de comment sur
n'importe quel article donné est souvent mis en cache pour rendre la génération
des lists d'article plus efficace. Vous pouvez utiliser
:doc:`CounterCacheBehavior </orm/behaviors/counter-cache>` pour
mettre en cache les compteurs des enregistrements associés.

Assurez-vous que vos tables de base de données ne contiennent pas de colonnes
du même nom que les attributs d'association. Si par exemple vous avez un champs
counter en collision avec une propriété d'association, vous devez soit renommer
l'association ou le nom de la colonne.

Associations BelongsToMany
==========================

Un exemple d'association BelongsToMany est "Article BelongsToMany Tags", où
les tags d'un article sont partagés avec d'autres articles. BelongsToMany fait
souvent référence au "has and belongs to many", et est une association classique
"many to many".

La principale différence entre hasMany et BelongsToMany est que le lien entre
les models dans une association BelongsToMany n'est pas exclusif. par exemple
nous joignons notre table Articles avec la table Tags. En utilisant 'funny'
comme un Tag pour mon Article, n'"utilise" pas le tag. Je peux aussi l'utiliser
pour le prochain article que j'écris.

Trois tables de la base de données sont nécessaires pour une association
BelongsToMany. Dans l'exemple du dessus, nous aurons besoin des tables pour
``articles``, ``tags`` et ``articles_tags``. La table ``articles_tags`` contient
les données qui font le lien entre les tags et les articles. La table de
jointure est nommée à partir des deux tables impliquées, séparée par un
underscore par convention. Dans sa forme la plus simple, cette table se résume
à ``article_id`` et ``tag_id``.

**belongsToMany** nécessite une table de jointure séparée qui inclut deux noms
de *model*.

============================ ================================================================
Relation                     Champs de la table de jointure
============================ ================================================================
Article belongsToMany Tag    articles_tags.id, articles_tags.tag_id, articles_tags.article_id
---------------------------- ----------------------------------------------------------------
Patient belongsToMany Doctor doctors_patients.id, doctors_patients.doctor_id,
                             doctors_patients.patient_id.
============================ ================================================================

Nous pouvons définir l'association belongsToMany dans nos deux models comme
suit::

    // Dans src/Model/Table/ArticlesTable.php
    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsToMany('Tags');
        }
    }

    // Dans src/Model/Table/TagsTable.php
    class TagsTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsToMany('Articles');
        }
    }

Nous pouvons aussi définir une relation plus spécifique en utilisant un
tableau::

    // Dans src/Model/Table/ArticlesTable.php
    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsToMany('Tags', [
                'joinTable' => 'articles_tags',
            ]);
        }
    }

    // Dans src/Model/Table/TagsTable.php
    class TagsTable extends Table
    {

        public function initialize(array $config)
        {
            $this->belongsToMany('Articles', [
                'joinTable' => 'articles_tags',
            ]);
        }
    }

Les clés possibles pour un tableau définissant une association belongsToMany
sont:

- **className**: Le nom de la classe du model que l'on souhaite associer au
  model actuel. Si l'on souhaite définir la relation
  'Article belongsToMany Tag', la valeur associée à la clef 'className' devra
  être 'Tags'.
- **joinTable**: Le nom de la table de jointure utilisée dans cette association
  (si la table ne colle pas à la convention de nommage des tables de jointure
  belongsToMany). Par défaut, le nom de la table sera utilisé pour charger
  l'instance Table pour la table de jointure/pivot.
- **foreignKey**: le nom de la clé étrangère dans la table de jointure et qui
  fait référence au model actuel ou la liste en cas de clés étrangères
  composites. Ceci est particulièrement pratique si vous avez besoin de définir
  plusieurs relations belongsToMany. La valeur par défaut de cette clé est le
  nom du model actuel (avec des underscores) avec le suffixe '\_id'.
- **bindingKey**: le nom de la colonne dans l'autre table, qui sera utilisée
  pour correspondre à la ``foreignKey``. S'il n'est pas spécifié, la clé
  primaire (par exemple la colonne id de la table ``Users``) sera utilisée.
- **targetForeignKey**: le nom de la clé étrangère dans la table de jointure
  pour le model cible ou la liste en cas de clés étrangères composites. La
  valeur par défaut pour cette clé est le model cible, au singulier et en
  underscore, avec le suffixe '\_id'.
- **conditions**: un tableau de conditions compatibles avec ``find()``. Si vous
  avez des conditions sur une table associée, vous devriez utiliser un model
  'through' et lui définir les associations belongsTo nécessaires.
- **sort**: un tableau de clauses order compatible avec find().
- **dependent**: Quand la clé dependent est définie à ``false`` et qu'une entity
  est supprimée, les enregistrements de la table de jointure ne seront pas
  supprimés.
- **through**: Vous permet de fournir soit le nom de l'instance de la Table
  que vous voulez utiliser, soit l'instance elle-même. Cela rend possible la
  personnalisation des clés de la table de jointure, et vous permet de
  personnaliser le comportement de la table pivot.
- **cascadeCallbacks**: Quand définie à ``true``, les suppressions en cascade
  vont charger et supprimer les entities ainsi les callbacks sont correctement
  lancés sur les enregistrements de la table de jointure. Quand définie à
  ``false``. ``deleteAll()`` est utilisée pour retirer les données associées
  et aucun callback n'est lancé. Ceci est par défaut à ``false`` pour
  réduire la charge.
- **propertyName**: Le nom de la propriété qui doit être remplie avec les
  données de la table associée dans les résultats de la table source. Par défaut
  c'est le nom au pluriel, avec des underscores de l'association, donc ``tags``
  dans notre exemple.
- **strategy**: Définit la stratégie de requête à utiliser. Par défaut à
  'select'. L'autre valeur valide est 'subquery', qui remplace la liste ``IN``
  avec une sous-requête équivalente.
- **saveStrategy**: Soit 'append' ou bien 'replace'. Parr défaut à 'replace'.
  Indique le mode à utiliser pour sauvegarder les entities associées. Le
  premier va seulement créer des nouveaux liens entre les deux côtés de la
  relation et le deuxième va effacer et remplacer pour créer les liens entre
  les entities passées lors de la sauvegarde.
- **finder**: La méthode finder à utiliser lors du chargement des
  enregistrements associés.

Une fois que cette association a été définie, les opérations find sur la table
Articles peuvent contenir les enregistrements de Tag s'ils existent::

    // Dans un controller ou dans une méthode table.
    $query = $articles->find('all')->contain(['Tags']);
    foreach ($query as $article) {
        echo $article->tags[0]->text;
    }

Ce qui est au-dessus génèrera une requête SQL similaire à::

    SELECT * FROM articles;
    SELECT * FROM tags
    INNER JOIN articles_tags ON (
      tags.id = article_tags.tag_id
      AND article_id IN (1, 2, 3, 4, 5)
    );

Quand la stratégie de sous-requête est utilisée, un SQL similaire à ce qui
suit sera générée::

    SELECT * FROM articles;
    SELECT * FROM tags
    INNER JOIN articles_tags ON (
      tags.id = article_tags.tag_id
      AND article_id IN (SELECT id FROM articles)
    );

.. _using-the-through-option:

Utiliser l'Option 'through'
---------------------------

Si vous souhaitez ajouter des informations supplémentaires à la table
join/pivot, ou si vous avez besoin d'utiliser les colonnes jointes en dehors
des conventions, vous devrez définir l'option ``through``. L'option ``through``
vous fournit un contrôle total sur la façon dont l'association belongsToMany
sera créée.

Il est parfois souhaitable de stocker des données supplémentaires avec une
association many to many. Considérez ce qui suit::

    Student BelongsToMany Course
    Course BelongsToMany Student

Un Etudiant (Student) peut prendre plusieurs Cours (many Courses) et un Cours
(Course) peut être pris par plusieurs Etudiants (many Students). C'est une
simple association many to many. La table suivante suffira::

    id | student_id | course_id

Maintenant si nous souhaitons stocker le nombre de jours qui sont attendus par
l'étudiant sur le cours et leur note finale? La table que nous souhaiterions
serait::

    id | student_id | course_id | days_attended | grade

La façon d'intégrer notre besoin est d'utiliser un **model join**, autrement
connu comme une association **hasMany through**. Ceci étant, l'association est
un model lui-même. Donc, nous pouvons créer un nouveau model CoursesMemberships.
Regardez les models suivants::

    class StudentsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsToMany('Courses', [
                'through' => 'CourseMemberships',
            ]);
        }
    }

    class CoursesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsToMany('Students', [
                'through' => 'CourseMemberships',
            ]);
        }
    }

    class CoursesMembershipsTable extends Table
    {
        public function initialize(array $config)
        {
            $this->belongsTo('Students');
            $this->belongsTo('Courses');
        }
    }

La table de jointure CoursesMemberships identifie de façon unique une
participation donnée d'un Etudiant à un Cours en plus des meta-informations
supplémentaires.

Conditions d'Association par Défaut
-----------------------------------

L'option ``finder`` vous permet d'utiliser un
:ref:`finder personnalisé <custom-find-methods>` pour charger les données
associées. Ceci permet de mieux encapsuler vos requêtes et de garder votre code
plus DRY. Il y a quelques limitations lors de l'utilisation de finders pour
charger les données dans les associations qui sont chargées en utilisant les
jointures (belongsTo/hasOne). Les seuls aspects de la requête qui seront
appliqués à la requête racine sont les suivants:

- WHERE conditions.
- Additional joins.
- Contained associations.

Les autres aspects de la requête, comme les colonnes sélectionnées, l'order, le
group by, having et les autres sous-instructions, ne seront pas appliqués à la
requête racine. Les associations qui *ne* sont *pas* chargées avec les jointures
(hasMany/belongsToMany), n'ont pas les restrictions ci-dessus et peuvent aussi
utiliser les formateurs de résultats ou les fonctions map/reduce.

Charger les Associations
------------------------

Une fois que vous avez défini vos associations, vous pouvez :ref:`charger en
eager les associations <eager-loading-associations>` quand vous récupérez les
résultats.
