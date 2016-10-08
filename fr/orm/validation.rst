Valider des Données
###################

Avant que vous :doc:`sauvegardiez des données</orm/saving-data>` vous voudrez
probablement vous assurer que les données sont correctes et cohérentes. Dans
CakePHP, nous avons deux étapes de validation:

1. Avant que les données de requête ne soit converties en entity, les règle de
   validation concernant le type de données et leur format peuvent être appliquées.
2. Avant que les données ne soient sauvegardées, les règles du domaine ou de
   l'application peuvent être appliquées. Ces règles aident à garantir que les
   données de votre application restent cohérentes.

.. _validating-request-data:

Valider les Données Avant de Construire les Entities
----------------------------------------------------

Durant la transformation des données en entities, vous pouvez valider les
données. La validation des données vous permet de vérifier le type, la forme et
la taille des données. Par défaut les données requêtées seront validées avant
qu'elles ne soient converties en entities.
Si aucune règle de validation n'échoue, l'entity retournée va contenir les
erreurs. Les champs avec des erreurs ne seront pas présents dans l'entity
retournée::

    $article = $articles->newEntity($this->request->data);
    if ($article->errors()) {
        // validation de l'entity a échouée.
    }

Quand vous construisez une entity avec la validation activée, les choses
suivantes vont se produire:

1. L'objet validator est créé.
2. Les providers de validation ``table`` et ``default`` sont attachés.
3. La méthode de validation nommée est appelée. Par exemple,
   ``validationDefault()``.
4. L'event ``Model.buildValidator`` va être déclenché.
5. Les données Requêtées vont être validées.
6. Les données Requêtées vont être castées en types qui correspondent
   aux types de colonne.
7. Les erreurs vont être définies dans l'entity.
8. Les données valides vont être définies dans l'entity, alors que les champs
   qui échouent la validation seront laissés de côté.

Si vous voulez désactiver la validation lors de la conversion des données
requêtées, définissez l'option ``validate`` à false::

    $article = $articles->newEntity(
        $this->request->data,
        ['validate' => false]
    );

La méthode ``patchEntity()`` fonctionne de façon identique::

    $article = $articles->patchEntity($article, $newData, [
        'validate' => false
    ]);

Créer un Ensemble de Validation par Défaut
==========================================

Les règles de validation sont définies dans la classe Table par commodité.
Cela aide à trouver les données qui doivent être validées en correspondance
avec l'endroit où elles seront sauvegardées.

Pour créer un objet validation dans votre table, créez la fonction
``validationDefault()``::

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class ArticlesTable extends Table
    {

        public function validationDefault(Validator $validator)
        {
            $validator
                ->requirePresence('title', 'create')
                ->notEmpty('title');

            $validator
                ->allowEmpty('link')
                ->add('link', 'valid-url', ['rule' => 'url']);

            ...

            return $validator;
        }
    }

les méthodes et règles de validation disponibles proviennent de la classe
``Validator`` et sont documentées dans la section :ref:`creating-validators`.

.. note::

    Les objets validation sont principalement conçus pour être utilisés pour la
    validation des données provenant d'utilisateurs, par exemple les formulaires
    ou n'importe quelles données postées.

Utiliser un Ensemble de Validation Différent
============================================
En plus de désactiver la validation, vous pouvez choisir l'ensemble de règles de
validation que vous souhaitez appliquer::

    $article = $articles->newEntity(
        $this->request->data,
        ['validate' => 'update']
    );

Ce qui est au-dessus va appeler la méthode ``validationUpdate()`` sur l'instance
table pour construire les règles requises. Par défaut la méthode
``validationDefault()`` sera utilisée. Un exemple de méthode de validator pour
notre Table articles serait::

    class ArticlesTable extends Table
    {
        public function validationUpdate($validator)
        {
            $validator
                ->add('title', 'notEmpty', [
                    'rule' => 'notEmpty',
                    'message' => __('Vous devez fournir un titre'),
                ])
                ->add('body', 'notEmpty', [
                    'rule' => 'notEmpty',
                    'message' => __('un corps est nécessaire')
                ]);
            return $validator;
        }
    }

Vous pouvez avoir autant d'ensembles de validation que vous le souhaitez.
Consultez le :doc:`chapitre sur la validation </core-libraries/validation>`
pour plus d'informations sur la construction des ensembles de règle de
validation.

.. _using-different-validators-per-association:

Utiliser un Ensemble de Validation Différent pour les Associations
------------------------------------------------------------------

Les ensembles de validation peuvent également être définis par association.
Lorsque vous utilisez les méthodes ``newEntity()`` ou ``patchEntity()``, vous
pouvez passer des options supplémentaires à chaque association qui doit être
convertie::

   $data = [
        'title' => 'My title',
        'body' => 'The text',
        'user_id' => 1,
        'user' => [
            'username' => 'mark'
        ],
        'comments' => [
            ['body' => 'First comment'],
            ['body' => 'Second comment'],
        ]
    ];

    $article = $articles->patchEntity($article, $data, [
        'validate' => 'update',
        'associated' => [
            'Users' => ['validate' => 'signup'],
            'Comments' => ['validate' => 'custom']
        ]
    ]);

Combiner les Validators
=======================

Grâce à la manière dont les objets validator sont construits, il est facile de
diviser leur process de construction en de petites étapes réutilisables::

    // UsersTable.php

    public function validationDefault(Validator $validator)
    {
        $validator->notEmpty('username');
        $validator->notEmpty('password');
        $validator->add('email', 'valid-email', ['rule' => 'email']);
        ...

        return $validator;
    }

    public function validationeHardened(Validator $validator)
    {
        $validator = $this->validationeDefault($validator);

        $validator->add('password', 'length', ['rule' => ['lengthBetween', 8, 100]]);
        return $validator;
    }

En prenant en compte la configuration ci-dessus, lors de l'utilisation de
l'ensemble de validation ``hardened``, il contiendra également les règles de
l'ensemble ``default``.

Validation Providers
====================

Les règles de validation peuvent utiliser les fonctions définies sur tout
provider connu. Par défaut, CakePHP définit quelques providers:

1. Les méthodes sur la classe table, ou ses behaviors sont disponible sur
   le provider ``table``.
2. La classe de :php:class:`~Cake\\Validation\\Validation` du coeur est
   configurée avec le provider ``default``.

Quand une règle de validation est créée, vous pouvez nommer le provider de cette
règle. Par exemple, si votre table a une méthode ``isValidRole``, vous pouvez
l'utiliser comme une règle de validation::

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class UsersTable extends Table
    {

        public function validationDefault(Validator $validator)
        {
            $validator
                ->add('role', 'validRole', [
                    'rule' => 'isValidRole',
                    'message' => __('Vous devez fournir un rôle valide'),
                    'provider' => 'table',
                ]);
            return $validator;
        }

        public function isValidRole($value, array $context)
        {
            return in_array($value, ['admin', 'editor', 'author'], true);
        }

    }

Vous pouvez également utiliser des closures en tant que règle de validation::

    $validator->add('name', 'myRule', [
        'rule' => function ($data, $provider) {
            if ($data > 1) {
                return true;
            }
            return 'Valeur incorrecte.';
        }
    ]);

Les méthodes de validation peuvent renvoyer des messages lorsqu'elles échouent.
C'est un moyen simple de créer des messages d'erreur dynamiques basés sur la
valeur fournie.

Récupérer des Validators depuis les Tables
==========================================

Une fois que vous avez créé quelques ensembles de validation dans votre classe
table, vous pouvez récupérer l'objet résultant via son nom::

    $defaultValidator = $usersTable->validator('default');

    $hardenedValidator = $usersTable->validator('hardened');

Classe Validator par Défault
============================

Comme mentionné ci-dessus, par défaut les méthodes de validation reçoivent
une instance de ``Cake\Validation\Validator``. Si vous souhaitez utiliser
une instance d'un validator personnalisé, vous pouvez utiliser l'attribut
``$_validatorClass`` de table::


    // Dans votre class Table
    public function initialize(array $config)
    {
        $this->_validatorClass = '\FullyNamespaced\Custom\Validator';
    }


.. _application-rules:

Appliquer des Règles pour l'Application
=======================================

Alors qu'une validation basique des données est faite quand :ref:`les données
requêtées sont converties en entities <validating-request-data>`, de
nombreuses applications ont aussi d'autres validations plus complexes qui
doivent être appliquées seulement après qu'une validation basique a été
terminée.

Alors que la validation s'assure que le formulaire ou la syntaxe de vos données
sont corrects, les règles s'attellent à comparer les données avec un état
existant de votre application et/ou de votre réseau.

Ces types de règles sont souvent appelées 'règles de domaine' ou
'règles de l'application'. CakePHP utilise ce concept avec les 'RulesCheckers'
qui sont appliquées avant que les entities ne soient sauvegardées. Voici
quelques exemples de règles de domaine:

* S'assurer qu'un email est unique.
* Etats de transition ou étapes de flux de travail, par exemple pour mettre à
  jour un statut de facture.
* Eviter la modification ou la suppression soft d'articles.
* Enforcing usage/rate limit caps.

Les règles de domaine sont vérifiées lors de l'appel au méthodes ``save()`` et
``delete()`` de la Table.

Créer un Vérificateur de Règles
-------------------------------

Les classes de vérificateur de Règles sont généralement définies par la
méthode ``buildRules()`` dans votre classe de table. Les behaviors et les autres
souscripteurs d'event peuvent utiliser l'event ``Model.buildRules`` pour
ajouter des règles au vérificateur pour une classe de Table donnée::

    use Cake\ORM\RulesChecker;

    // Dans une classe de table
    public function buildRules(RulesChecker $rules)
    {
        // Ajoute une règle qui est appliquée pour la création et la mise à jour d'opérations
        $rules->add(function ($entity, $options) {
            // Retourne un booléen pour indiquer si succès/échec
        }, 'ruleName');

        // Ajoute une règle pour la création.
        $rules->addCreate(function ($entity, $options) {
            // Retourne un booléen pour indiquer si succès/échec
        }, 'ruleName');

        // Ajoute une règle pour la mise à jour.
        $rules->addUpdate(function ($entity, $options) {
            // Retourne un booléen pour indiquer si succès/échec
        }, 'ruleName');

        // Ajoute une règle pour la suppression.
        $rules->addDelete(function ($entity, $options) {
            // Retourne un booléen pour indiquer si succès/échec
        }, 'ruleName');

        return $rules;
    }

Vos fonctions de règles ont pour paramètres l'Entity à vérifier et un tableau
d'options. Le tableau d'options va contenir ``errorField``, ``message`` et
``repository``. L'option ``repository`` va contenir la classe de table sur
laquelle les règles sont attachées. Comme les règles acceptent tout
``callable``, vous pouvez aussi utiliser des fonctions d'instance::

    $rules->addCreate([$this, 'uniqueEmail'], 'uniqueEmail');

ou des classes callable::

    $rules->addCreate(new IsUnique(['email']), 'uniqueEmail');

Lors de l'ajout de règles, vous pouvez définir le champ pour lequel la règle
est faite, et le message d'erreur en options::

    $rules->add([$this, 'isValidState'], 'validState', [
        'errorField' => 'status',
        'message' => 'Cette facture ne peut pas être déplacée pour ce statut.'
    ]);

L'erreur sera visible lors de l'appel à la méthode ``errors()`` dans l'entity::

    $entity->errors(); // Contient les messages d'erreur des règles du domaine

Créer des Règles de Champ Unique
--------------------------------

Comme les règles uniques sont couramment utilisées, CakePHP inclut une classe
de Règle simple qui vous permet de définir des ensembles de champ unique::

    use Cake\ORM\Rule\IsUnique;

    // Un champ unique.
    $rules->add($rules->isUnique(['email']));

    // Une liste de champs
    $rules->add($rules->isUnique(['username', 'account_id']));

Quand vous définissez des règles sur des champs de clé étrangère, il est
important de se rappeler que seuls les champs listés sont utilisés dans la
règle. Cela signifie que définir ``$user->account->id`` ne va pas déclencher
la règle ci-dessus.

Règles des Clés Etrangères
--------------------------

Alors que vous pourriez compter sur les erreurs de la base de données pour
imposer des contraintes, utiliser des règles peut vous aider à fournir une
expérience utilisateur plus sympathique. C'est pour cela que CakePHP inclut
une classe de règle ``ExistsIn``::

    // Un champ unique.
    $rules->add($rules->existsIn('article_id', 'articles'));

    // Plusieurs clés, utile pour des clés primaires composites.
    $rules->add($rules->existsIn(['site_id', 'article_id'], 'articles'));

Les champs dont il faut vérifier l'existence dans la table liée doivent faire
parti de la clé primaire.

Vous pouvez forcer ``existsIn`` à passer quand des parties qui peuvent être
nulles de votre clé étrangère composite sont nulles::

    // Example: A composite primary key within NodesTable is (id, site_id).
    // A Node may reference a parent Node but does not need to. In latter case, parent_id is null.
    // Allow this rule to pass, even if fields that are nullable, like parent_id, are null:
    $rules->add($rules->existsIn(
        ['parent_id', 'site_id'], // Schema: parent_id NULL, site_id NOT NULL
        'ParentNodes',
        ['allowNullableNulls' => true]
    );

    // A Node however must in addition also always reference a Site.
    $rules->add($rules->existsIn(['site_id'], 'Sites'));

.. versionadded:: 3.3.0
    L'option ``allowNullableNulls`` a été ajoutée.

Règles sur le Nombre de Valeurs d'une Association
-------------------------------------------------

Si vous devez valider qu'une propriété ou une association contient un bon nombre
de valeurs, vous pouvez utiliser la règle ``validCount()``::

    // Pas plus de 5 tags sur un article.
    $rules->add($rules->validCount('tags', 5, '<=', 'Vous pouvez avoir seulement 5 tags'));

Quand vous définissez des règles qui concernent le nombre, le troisième
paramètre vous permet de définir l'opérateur de comparaison à utiliser. ``==``,
``>=``, ``<=``, ``>``, ``<``, and ``!=`` sont les opérateurs acceptés. Pour vous
assurer qu'un nombre d'une propriété est entre certaines valeurs, utilisez deux
règles::

    // Entre 3 et 5 tags
    $rules->add($rules->validCount('tags', 3, '>=', 'Vous devez avoir au moins 3 tags'));
    $rules->add($rules->validCount('tags', 5, '<=', 'Vous devez avoir au moins 5 tags'));

.. versionadded:: 3.3.0
    La méthode ``validCount()`` a été ajoutée dans la version 3.3.0.

Utiliser les Méthodes Entity en tant que Règles
-----------------------------------------------

Vous pouvez utiliser les méthodes entity en tant que règles de domaine::

    $rules->add(function ($entity, $options) {
        return $entity->isOkLooking();
    }, 'ruleName');

Créer des Règles Personnalisées Réutilisables
---------------------------------------------

Vous pouvez vouloir réutiliser des règles de domaine personnalisées. Vous pouvez
le faire en créant votre propre règle invokable::

    use App\ORM\Rule\IsUniqueWithNulls;
    // ...
    public function buildRules(RulesChecker $rules)
    {
        $rules->add(new IsUniqueWithNulls(['parent_id', 'instance_id', 'name']), 'uniqueNamePerParent', [
            'errorField' => 'name',
            'message' => 'Name must be unique per parent.'
        ]);
        return $rules;
    }

Regardez les règles du coeur pour plus d'informations sur la façon de créer de
telles règles.

Créer des Objets de Règles Personnalisées
-----------------------------------------

Si votre application a des règles qui sont souvent réutilisées, il peut être
utile de packager ces règles dans des classes réutilisables::

    // Dans src/Model/Rule/CustomRule.php
    namespace App\Model\Rule;

    use Cake\Datasource\EntityInterface;

    class CustomRule
    {
        public function __invoke(EntityInterface $entity, array $options)
        {
            // Do work
            return false;
        }
    }

    // Ajoute la règle personnalisée
    use App\Model\Rule\CustomRule;

    $rules->add(new CustomRule(...), 'ruleName');

En ajoutant des classes de règle personnalisée, vous pouvez garder votre code
DRY et faciliter le test des règles de votre domaine.

Désactiver les Règles
---------------------

Quand vous sauvegardez une entity, vous pouvez désactiver les règles si cela
est nécessaire::

    $articles->save($article, ['checkRules' => false]);

Validation vs. Application Rules
================================

L'ORM de CakePHP est unique dans le sens où il utilise une approche à deux
couches pour la validation.

La première couche est la validation. Les règles de validation ont pour objectif
d'opérer d'une façon stateless. Elles permettent de s'assurer que la forme, les
types de données et le format des données sont corrects.

La seconde couche sont les règles d'application. Les règles d'application
permettent de vérifier les propriétés stateful de vos entities. Par exemple,
les règles de validation peuvent permettre de s'assurer qu'une adresse email est
valide, alors qu'une règle d'application permet de s'assurer que l'adresse
email est unique.

Comme vous avez pu le voir, la première couche est réalisée via l'objet
``Validator`` lors de l'appel à ``newEntity()`` ou ``patchEntity()``::

    $validatedEntity = $articlesTable->newEntity(
        $unsafeData,
        ['validate' => 'customName']
    );
    $validatedEntity = $articlesTable->patchEntity(
        $entity,
        $unsafeData,
        ['validate' => 'customName']
    );

Dans l'exemple ci-dessus, nous allons utiliser un validateur 'custom', qui est
défini en utilisant la méthode ``validationCustomName()``::

    public function validationCustom($validator)
    {
        $validator->add(...);
        return $validator;
    }

La validation fait l'hypothèse que les chaînes de caractères et les tableaux
sont passés puisque c'est ce qui est reçu par n'importe quelle requête::

    // Dans src/Model/Table/UsersTable.php
    public function validatePasswords($validator)
    {
        $validator->add('confirm_password', 'no-misspelling', [
            'rule' => ['compareWith', 'password'],
            'message' => 'Les mot de passe ne sont pas égaux',
        ]);

        ...
        return $validator;
    }

La validation **n'est pas** déclenchée lorsqu'une propriété est définie
directement dans vos entities::

    $userEntity->email = 'pas un email!!';
    $usersTable->save($userEntity);

Dans l'exemple ci-dessus, l'entity sera sauvegardée car la validation n'est
déclenchée que par les méthodes ``newEntity()`` et ``patchEntity()``. Le second
niveau de validation est conçu pour gérer cette situation.

Les règles d'application, comme expliqué précédement, seront vérifiées à chaque
fois que ``save()`` ou ``delete()`` sont appelées::

    // Dans src/Model/Table/UsersTable.php
    public function buildRules(RulesChecker $rules)
    {
        $rules->add($rules->isUnique('email'));
        return $rules;
    }

    // Autre part dans le code de votre application
    $userEntity->email = 'a@duplicated.email';
    $usersTable->save($userEntity); // Retourne false

Alors que la validation est conçue pour les données provenant directement
d'utilisateurs, les règles d'application sont spécifiques aux transitions de
données générées à l'intérieur de l'application::

    // Dans src/Model/Table/OrdersTable.php
    public function buildRules(RulesChecker $rules)
    {
        $check = function ($order) {
            return $order->price < 100 && $order->shipping_mode === 'free';
        };
        $rules->add($check, [
            'errorField' => 'shipping_mode',
            'message' => 'Pas de frais de port gratuit pour une commande de moins de 100!'
        ]);
        return $rules;
    }

    // Autre part dans le code de l'application
    $order->price = 50;
    $order->shipping_mode = 'free';
    $ordersTable->save($order); // Retourne false

Utiliser la Validation en tant que Règle d'Application
------------------------------------------------------

Dans certaines situations, vous voudrez peut-être lancer les mêmes routines
pour des données générées à la fois par un utilisateur et à l'intérieur de
votre application. Cela peut se produire lorsque vous exécutez un script CLI
qui définit des propriétés directement dans des entities::

    // Dans src/Model/Table/UsersTable.php
    public function validationDefault(Validator $validator)
    {
        $validator->add('email', 'valid', [
            'rule' => 'email',
            'message' => 'Email invalide'
        ]);
        ...
        return $validator;
    }

    public function buildRules(RulesChecker $rules)
    {
        // Ajoute des règles de  validation
        $rules->add(function ($entity) {
            $data = $entity->extract($this->schema()->columns(), true);
            $validator = $this->validator('default');
            $errors = $validator->errors($data, $entity->isNew());
            $entity->errors($errors);

            return empty($errors);
        });

        ...

        return $rules;
    }

Lors de l'exécution du code suivant, la sauvegarde échouera grâce à la nouvelle
règle d'application qui a été ajoutée::

    $userEntity->email = 'Pas un email!!!';
    $usersTable->save($userEntity);
    $userEntity->errors('email'); // Email invalide

le même résultat est attendu lors de l'utilisation de ``newEntity()`` ou
``patchEntity()``::

    $userEntity = $usersTable->newEntity(['email' => 'Pas un email!!']);
    $userEntity->errors('email'); // Email invalide
