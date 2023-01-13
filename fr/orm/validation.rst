Valider des Données
###################

Avant que vous ne :doc:`sauvegardiez des données</orm/saving-data>` vous voudrez
probablement vous assurer que les données sont correctes et cohérentes. Dans
CakePHP, nous avons deux étapes de validation:

1. Avant que les données de requête ne soient converties en entities, il est
   possible d'appliquer des règles de validation concernant le type de données
   et leur format.
2. Avant que les données ne soient sauvegardées, il est possible d'appliquer des
   règles du domaine ou de l'application. Ces règles aident à garantir la
   cohérence des données de votre application.

.. _validating-request-data:

Valider les Données Avant de Construire les Entities
----------------------------------------------------

Vous pouvez valider les données lors de leur transformation en entities. Cette
validation vous permet de vérifier le type, la forme et la taille des données.
Par défaut, les données de la requête seront validées avant d'être converties en
entities.
Si une ou plusieurs règles de validation échouent, l'entity retournée contiendra
des erreurs. Les champs comportant des erreurs ne figureront pas dans l'entity
renvoyée::

    $article = $articles->newEntity($this->request->getData());
    if ($article->getErrors()) {
        // La validation de l'entity a échoué.
    }

Voici ce qui se passe quand vous construisez une entity et que la validation est
activée:

1. L'objet validator est créé.
2. Les fournisseurs de validation (*providers*) ``table`` et ``default`` sont
   attachés.
3. La méthode de validation désignée est appelée. Par exemple
   ``validationDefault()``.
4. L'événement ``Model.buildValidator`` est déclenché.
5. Les données de la requête sont validées.
6. Les données de la requête sont castées en types correspondant aux types des
   colonnes.
7. Les erreurs sont définies dans l'entity.
8. Les données valides sont définies dans l'entity, tandis que les champs qui
   ont échoué à la validation sont laissés de côté.

Si vous voulez désactiver la validation lors de la conversion des données de la
requête, définissez l'option ``validate`` à false::

    $article = $articles->newEntity(
        $this->request->getData(),
        ['validate' => false]
    );

La méthode ``patchEntity()`` fonctionne de façon identique::

    $article = $articles->patchEntity($article, $newData, [
        'validate' => false
    ]);

Créer un Ensemble de Validation par Défaut
==========================================

Les règles de validation sont définies dans la classe Table par commodité.
Cela définit quelles données doivent être validées en conjonction avec l'endroit
où elles seront sauvegardées.

Pour créer un objet de validation par défaut dans votre table, créez la fonction
``validationDefault()``::

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class ArticlesTable extends Table
    {
        public function validationDefault(Validator $validator): Validator
        {
            $validator
                ->requirePresence('title', 'create')
                ->notEmptyString('title');

            $validator
                ->allowEmptyString('link')
                ->add('link', 'valid-url', ['rule' => 'url']);

            ...

            return $validator;
        }
    }

Les méthodes et règles de validation disponibles proviennent de la classe
``Validator`` et sont documentées dans la section :ref:`creating-validators`.

.. note::

    Les objets de validation sont principalement destinés à valider les données
    provenant de l'utilisateur, par exemple les formulaires ou d'autres
    données postées dans la requête.

Utiliser un Ensemble de Validation Différent
============================================

Outre la possibilité de désactiver la validation, vous pouvez choisir quel
ensemble de règles de validation que vous souhaitez appliquer::

    $article = $articles->newEntity(
        $this->request->getData(),
        ['validate' => 'update']
    );

Ceci appellerait la méthode ``validationUpdate()`` sur l'instance de table pour
construire les règles requises. Par défaut, c'est la méthode
``validationDefault()`` qui sera utilisée. Voici un exemple de validator pour
notre table ``articles``::

    class ArticlesTable extends Table
    {
        public function validationUpdate($validator)
        {
            $validator
                ->notEmptyString('title', __('Vous devez indiquer un titre'))
                ->notEmptyString('body', __('Un contenu est nécessaire'));
            return $validator;
        }
    }

Vous pouvez avoir autant d'ensembles de validation que vous le souhaitez.
Consultez le :doc:`chapitre sur la validation </core-libraries/validation>`
pour plus d'informations sur la construction des ensembles de règles de
validation.

.. _using-different-validators-per-association:

Utiliser un Ensemble de Validation Différent pour les Associations
------------------------------------------------------------------

Les ensembles de validation peuvent également être définis pour chaque association.
Lorsque vous utilisez les méthodes ``newEntity()`` ou ``patchEntity()``, vous
pouvez passer des options supplémentaires à chaque association qui doit être
convertie::

   $data = [
        'title' => 'Mon titre',
        'body' => 'Le texte',
        'user_id' => 1,
        'user' => [
            'username' => 'marc'
        ],
        'comments' => [
            ['body' => 'Premier commentaire'],
            ['body' => 'Second commentaire'],
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

Grâce à la manière dont les objets validator sont construits, vous pouvez
diviser leur process de construction en petites étapes réutilisables::

    // UsersTable.php

    public function validationDefault(Validator $validator): Validator
    {
        $validator->notEmptyString('username');
        $validator->notEmptyString('password');
        $validator->add('email', 'valid-email', ['rule' => 'email']);
        ...

        return $validator;
    }

    public function validationHardened(Validator $validator): Validator
    {
        $validator = $this->validationDefault($validator);

        $validator->add('password', 'length', ['rule' => ['lengthBetween', 8, 100]]);
        return $validator;
    }

Avec cette configuration, lors de l'utilisation de l'ensemble de validation
``hardened``, vous aurez aussi les règles de l'ensemble ``default``.

Validation Providers
====================

Les règles de validation peuvent utiliser des fonctions définies par n'importe
quel provider connu. Par défaut, CakePHP définit quelques providers:

1. Les méthodes sur la classe de table, ou ses behaviors, sont disponibles dans
   le provider ``table``.
2. La classe du cœur :php:class:`~Cake\\Validation\\Validation` est
   configurée en tant que provider ``default``.

En créant une règle de validation, vous pouvez désigner le provider de cette
règle. Par exemple, si votre table a une méthode ``isValidRole``, vous pouvez
l'utiliser comme une règle de validation::

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class UsersTable extends Table
    {
        public function validationDefault(Validator $validator): Validator
        {
            $validator
                ->add('role', 'validRole', [
                    'rule' => 'isValidRole',
                    'message' => __('Vous devez fournir un rôle valide'),
                    'provider' => 'table',
                ]);
            return $validator;
        }

        public function isValidRole($value, array $context): bool
        {
            return in_array($value, ['admin', 'editor', 'author'], true);
        }

    }

Vous pouvez également utiliser des closures en tant que règles de validation::

    $validator->add('name', 'myRule', [
        'rule' => function ($value, array $context) {
            if ($value > 1) {
                return true;
            }
            return 'Valeur incorrecte.';
        }
    ]);

Les méthodes de validation peuvent renvoyer des messages d'erreur lorsqu'elles échouent.
C'est un moyen simple de créer des messages d'erreur dynamiques basés en
fonction de la valeur fournie.

Récupérer des Validators depuis les Tables
==========================================

Une fois que vous avez créé quelques ensembles de validation dans votre classe
de table, vous pouvez récupérer l'objet résultant par son nom::

    $defaultValidator = $usersTable->getValidator('default');

    $hardenedValidator = $usersTable->getValidator('hardened');

Classe Validator par Défaut
============================

Comme mentionné ci-dessus, par défaut les méthodes de validation reçoivent
une instance de ``Cake\Validation\Validator``. Si vous souhaitez utiliser
une instance d'un validator personnalisé, vous pouvez utiliser l'attribut
``$_validatorClass`` de la table::

    // Dans votre classe de table
    public function initialize(array $config): void
    {
        $this->_validatorClass = \FullyNamespaced\Custom\Validator::class;
    }

.. _application-rules:

Appliquer des Règles d'Application
==================================

Au-delà de la validation basique des données qui est lancée quand
:ref:`les données de la requête sont converties en entities <validating-request-data>`,
de nombreuses applications ont des validations plus complexes qui doivent être
appliquées après la validation basique.

Là où la validation s'assure que la forme ou la syntaxe de vos données
sont correctes, les règles s'attellent à comparer les données avec l'état
existant de votre application et/ou du réseau.

Ces types de règles sont souvent appelées 'règles de domaine' ou
'règles d'application'. CakePHP utilise ce concept avec les 'RulesCheckers'
qui sont appliquées avant que les entities ne soient sauvegardées. Voici
quelques exemples de règles de domaine:

* S'assurer qu'un email est unique.
* Transition d'états ou étapes de flux de travail, par exemple pour mettre à
  jour le statut d'une facture.
* Eviter la modification d'articles ayant fait l'objet d'une suppression
  logique.
* Appliquer des limites d'usage, que ce soit en nombre d'appels total ou en nombre
  d'appels sur une période donnée.

Les règles de domaine sont vérifiées lors de l'appel aux méthodes ``save()`` et
``delete()`` de Table.

.. _creating-a-rules-checker:

Créer un Vérificateur de Règles
-------------------------------

Les classes de vérificateur de règles (*rules checkers*) sont généralement définies par la
méthode ``buildRules()`` dans votre classe de table. Les behaviors et les autres
souscripteurs d'events peuvent utiliser l'événement ``Model.buildRules`` pour
ajouter des règles au vérificateur pour une classe Table donnée::

    use Cake\ORM\RulesChecker;

    // Dans une classe de table
    public function buildRules(RulesChecker $rules): RulesChecker
    {
        // Ajoute une règle qui est appliquée pour les opérations de création et de mise à jour
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
d'options. Le tableau d'options contiendra ``errorField``, ``message`` et
``repository``. L'option ``repository`` contiendra la classe de table à
laquelle les règles sont attachées. Comme les règles acceptent n'importe quel
``callable``, vous pouvez aussi utiliser des fonctions d'instance::

    $rules->addCreate([$this, 'uniqueEmail'], 'uniqueEmail');

ou des classes callable::

    $rules->addCreate(new IsUnique(['email']), 'uniqueEmail');

Lors de l'ajout de règles, vous pouvez définir en options le champ correspondant
à la règle et le message d'erreur::

    $rules->add([$this, 'isValidState'], 'validState', [
        'errorField' => 'status',
        'message' => 'Cette facture ne peut pas être déplacée vers ce statut.'
    ]);

L'erreur sera visible lors de l'appel à la méthode ``getErrors()`` dans
l'entity::

    $entity->getErrors(); // Contient les messages d'erreur des règles de domaine

Créer des Règles d'Unicité de Champ
-----------------------------------

Les règles d'unicité étant couramment utilisées, CakePHP inclut une classe
simple qui vous permet de définir des ensembles de champs uniques::

    use Cake\ORM\Rule\IsUnique;

    // Un seul champ.
    $rules->add($rules->isUnique(['email']));

    // Une liste de champs
    $rules->add($rules->isUnique(
        ['username', 'account_id'],
        'Cette combinaison `username` & `account_id` est déjà utilisée.'
    ));

Quand vous définissez des règles sur des champs de clé étrangère, il est
important de se rappeler que seuls les champs listés sont utilisés dans la
règle. L'ensemble des règles d'unicité sera trouvé avec ``find('all')``. Cela
signifie que la règle ci-dessus ne sera pas déclenchée en définissant
``$user->account->id``.

De nombreux moteurs de bases de données autorisent plusieurs valeurs NULL dans
les index UNIQUE. Pour simuler ce comportement, définissez l'option
``allowMultipleNulls`` à ``true``::

    $rules->add($rules->isUnique(
        ['username', 'account_id'],
        ['allowMultipleNulls' => true]
    ));

.. versionadded:: 4.2.0
    L'option ``allowMultipleNulls`` a été ajoutée. Elle existait précédemment
    dans 3.x, mais était désactivée par défaut.

Règles de Clés Etrangères
-------------------------

Bien que vous puissiez vous reposer sur les erreurs de la base de données pour
imposer des contraintes, le fait d'utiliser des règles vous permet de fournir une
expérience utilisateur plus sympathique. C'est pour cela que CakePHP inclut
une classe de règle ``ExistsIn``::

    // Un champ unique.
    $rules->add($rules->existsIn('article_id', 'Articles'));

    // Plusieurs clés, utile pour des clés primaires composites.
    $rules->add($rules->existsIn(['site_id', 'article_id'], 'Articles'));

Les champs dont vous demandez à vérifier l'existence dans la table
correspondante doivent faire partie de la clé primaire.

Vous pouvez forcer ``existsIn`` à accepter qu'une partie de votre clé étrangère
composite soit null::

    // Exemple: NodesTable contient une clé primaire composite (parent_id, site_id).
    // Un "Node" peut faire référence à un Node parent mais ce n'est pas
    // obligatoire. Dans ce dernier cas, parent_id est null.
    // Nous autorisons la validation de cette règle même si les champs qui sont
    // nullables, comme parent_id, sont null:
    $rules->add($rules->existsIn(
        ['parent_id', 'site_id'], // Schema: parent_id NULL, site_id NOT NULL
        'ParentNodes',
        ['allowNullableNulls' => true]
    ));

    // Un Node doit cependant toujours avoir une référence à un Site.
    $rules->add($rules->existsIn(['site_id'], 'Sites'));

Dans la majorité des bases de données SQL, les index ``UNIQUE`` sur plusieurs
colonnes autorisent plusieurs valeurs null car ``NULL`` n'est
pas égal à lui même. Même si CakePHP autorise par défaut plusieurs valeurs null,
vous pouvez inclure les nulls dans vos
vérifications d'unicité en utilisant ``allowMultipleNulls``::

    // Une seule valeur null peut exister dans `parent_id` et `site_id`
    $rules->add($rules->existsIn(
        ['parent_id', 'site_id'],
        'ParentNodes',
        ['allowMultipleNulls' => false]
    ));

Règles sur le Nombre de Valeurs d'une Association
-------------------------------------------------

Si vous avez besoin de valider qu'une propriété ou une association contient un
certain nombre de valeurs, vous pouvez utiliser la règle ``validCount()``::

    // Dans le fichier ArticlesTable.php
    // Pas plus de 5 tags sur un article.
    $rules->add($rules->validCount('tags', 5, '<=', 'Vous ne pouvez avoir que 5 tags'));

Quand vous définissez des règles qui basées sur un nombre de valeurs, le troisième
paramètre vous permet de définir l'opérateur de comparaison à utiliser. Les
opérateurs acceptés sont ``==``, ``>=``, ``<=``, ``>``, ``<``, et ``!=``. Pour
vérifier que le décompte d'une propriété est entre certaines valeurs, utilisez
deux règles::

    // Dans le fichier ArticlesTable.php
    // Entre 3 et 5 tags
    $rules->add($rules->validCount('tags', 3, '>=', 'Vous devez avoir au moins 3 tags'));
    $rules->add($rules->validCount('tags', 5, '<=', 'Vous devez avoir au plus 5 tags'));

Notez que ``validCount`` retourne ``false`` si la propriété ne peut pas être comptée
ou n'existe pas::

    // La sauvegarde échouera si tags est null
    $rules->add($rules->validCount('tags', 0, '<=', 'Vous ne devez pas avoir de tags'));

Règles de Contraintes d'Association
-----------------------------------

La règle ``LinkConstraint`` vous permet d'émuler des contraintes SQL dans les
bases de données qui ne les supportent pas, ou quand vous voulez fournir des
messages d'erreur plus sympathiques quand la contrainte échoue. Cette règle vous
permet de vérifier si une association a ou non des enregistrements liés en
fonction du mode utilisé::

    // S'assure que chaque commentaire est lié à un Article lors de sa mise à jour.
    $rules->addUpdate($rules->isLinkedTo(
        'Articles',
        'article',
        'Spécifiez un article'
    ));

    // S'assure qu'un article n'a pas de commentaire au moment de sa suppression.
    $rules->addDelete($rules->isNotLinkedTo(
        'Comments',
        'comments',
        'Impossible de supprimer un article qui contient des commentaires.'
    ));

.. versionadded:: 4.0.0

Utiliser les Méthodes d'Entity en tant que Règles
-------------------------------------------------

Vous pouvez utiliser les méthodes d'une entity en tant que règles de domaine::

    $rules->add(function ($entity, $options) {
        return $entity->isOkLooking();
    }, 'ruleName');

Utiliser des Règles Conditionnelles
-----------------------------------

Vous pouvez appliquer des règles conditionnelles en fonction des données de
l'entity::

    $rules->add(function ($entity, $options) use($rules) {
        if ($entity->role == 'admin') {
            $rule = $rules->existsIn('user_id', 'Admins');

            return $rule($entity, $options);
        }
        if ($entity->role == 'user') {
            $rule = $rules->existsIn('user_id', 'Users');

            return $rule($entity, $options);
        }

        return false;
    }, 'userExists');

Messages d'Erreur Dynamiques/Conditionnels
------------------------------------------

Les règles, qu'elles soient :ref:`des callables personnalisés <creating-a-rules-checker>`
ou :ref:`des objets Rule <creating-custom-rule-objects>`, peuvent soit retourner
un booléen indiquant si elles ont réussi, soit retourner une chaîne qui
signifie que la règle a échoué et que la chaîne doit être utilisée comme message
d'erreur.

Les messages d'erreur possibles définis par l'option ``message`` seront écrasés
par ceux retournés par la règle::

    $rules->add(
        function ($entity, $options) {
            if (!$entity->length) {
                return false;
            }

            if ($entity->length < 10) {
                return "Message d'erreur quand la valeur est inférieure à 10";
            }

            if ($entity->length > 20) {
                return "Message d'erreur quand la valeur est supérieure à 20";
            }

            return true;
        },
        'ruleName',
        [
            'errorField' => 'length',
            'message' => "Message d'erreur générique utilisé quand la règle retourne `false`."
        ]
     );

.. note::

    Notez que pour que le message retourné puisse être utilisé, vous *devez*
    aussi définir l'option ``errorField``, sinon la règle va se contenter
    d'échouer silencieusement, c'est-à-dire sans insérer le message d'erreur
    dans l'entity !

Créer des Règles Personnalisées Réutilisables
---------------------------------------------

Vous pouvez vouloir réutiliser des règles de domaine personnalisées. Vous pouvez
le faire en créant votre propre règle invokable::

    use App\ORM\Rule\IsUniqueWithNulls;
    // ...
    public function buildRules(RulesChecker $rules): RulesChecker
    {
        $rules->add(new IsUniqueWithNulls(['parent_id', 'instance_id', 'name']), 'uniqueNamePerParent', [
            'errorField' => 'name',
            'message' => 'Doit être unique pour chaque parent.'
        ]);
        return $rules;
    }

Regardez les règles du cœur pour avoir des exemples sur la façon de créer de
telles règles.

.. _creating-custom-rule-objects:

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
            // Faire le boulot ici
            return false;
        }
    }

    // Ajouter la règle personnalisée
    use App\Model\Rule\CustomRule;

    $rules->add(new CustomRule(...), 'ruleName');

En ajoutant des classes de règles personnalisées, vous pouvez garder votre code
DRY et tester vos règles de domaine isolément.

Désactiver les Règles
---------------------

Quand vous sauvegardez une entity, vous pouvez désactiver les règles si c'est
nécessaire::

    $articles->save($article, ['checkRules' => false]);

Validation vs. Règles d'Application
===================================

L'ORM de CakePHP est unique dans le sens où il utilise une approche à deux
couches pour la validation.

La première couche est la validation. Les règles de validation ont pour objet
d'opérer sans état (*stateless*). Elles servent à s'assurer que la forme, les
types de données et le format des données sont corrects.

La seconde couche est celle des règles d'application. Les règles d'application
sont plus appropriés pour vérifier l'état des propriétés de vos entities. Par exemple,
les règles de validation peuvent permettre de s'assurer qu'une adresse email est
valide, tandis qu'une règle d'application permet de s'assurer que l'adresse
email est unique.

Comme vous avez pu le voir, la première couche est réalisée par l'objet
``Validator`` lors de l'appel à ``newEntity()`` ou ``patchEntity()``::

    $validatedEntity = $articlesTable->newEntity(
        $donneesDouteuses,
        ['validate' => 'maRegle']
    );
    $validatedEntity = $articlesTable->patchEntity(
        $entity,
        $donneesDouteuses,
        ['validate' => 'maRegle']
    );

Dans l'exemple ci-dessus, nous allons utiliser un validateur 'maRegle', qui est
défini en utilisant la méthode ``validationMaRegle()``::

    public function validationMaRegle($validator)
    {
        $validator->add(
            // ...
        );

        return $validator;
    }

La validation présuppose que les arguments passés sont des chaînes de caractères
ou des tableaux, puisque c'est ce qui est passé dans n'importe quelle requête::

    // Dans src/Model/Table/UsersTable.php
    public function validatePasswords($validator)
    {
        $validator->add('confirm_password', 'no-misspelling', [
            'rule' => ['compareWith', 'password'],
            'message' => 'Les mots de passe ne sont pas identiques',
        ]);

        // ...

        return $validator;
    }

La validation **n'est pas** déclenchée lorsque vous définissez directement une
propriété sur vos entities::

    $userEntity->email = 'pas un email!!';
    $usersTable->save($userEntity);

Dans l'exemple ci-dessus, l'entity sera sauvegardée car la validation n'est
déclenchée que par les méthodes ``newEntity()`` et ``patchEntity()``. Le second
niveau de validation est conçu pour gérer cette situation.

Les règles d'application, comme expliqué précédement, seront vérifiées à chaque
appel de ``save()`` ou ``delete()``::

    // Dans src/Model/Table/UsersTable.php
    public function buildRules(RulesChecker $rules): RulesChecker
    {
        $rules->add($rules->isUnique(['email']));

        return $rules;
    }

    // Autre part dans le code de votre application
    $userEntity->email = 'a@email.en.doublon';
    $usersTable->save($userEntity); // Retourne false

La validation est conçue pour les données provenant directement des
utilisateurs, tandis que les règles d'application sont conçues spécifiquement
pour les transitions de données générées à l'intérieur de l'application::

    // Dans src/Model/Table/CommandesTable.php
    public function buildRules(RulesChecker $rules): RulesChecker
    {
        $check = function($commande) {
            if ($commande->livraison !== 'gratuit') {
                return true;
            }

            return $commande->prix >= 100;
        };
        $rules->add($check, [
            'errorField' => 'livraison',
            'message' => 'Pas de frais de port gratuits pour une commande de moins de 100!'
        ]);
        return $rules;
    }

    // Autre part dans le code de l'application
    $commande->prix = 50;
    $commande->livraison = 'gratuit';
    $commandesTable->save($commande); // Retourne false

Utiliser la Validation en tant que Règle d'Application
------------------------------------------------------

Dans certaines situations, vous voudrez peut-être lancer les mêmes routines
à la fois pour des données générées par un utilisateur et pour l'intérieur de
votre application. Cela peut se produire lorsque vous exécutez un script CLI
qui définit des propriétés directement dans des entities::

    // Dans src/Model/Table/UsersTable.php
    public function validationDefault(Validator $validator): Validator
    {
        $validator->add('email', 'email_valide', [
            'rule' => 'email',
            'message' => 'Email invalide'
        ]);

        // ...

        return $validator;
    }

    public function buildRules(RulesChecker $rules): RulesChecker
    {
        // Ajoute des règles de validation
        $rules->add(function($entity) {
            $data = $entity->extract($this->getSchema()->columns(), true);
            if (!$entity->isNew() && !empty($data)) {
                $data += $entity->extract((array)$this->getPrimaryKey());
            }
            $validator = $this->getValidator('default');
            $errors = $validator->validate($data, $entity->isNew());
            $entity->setErrors($errors);

            return empty($errors);
        });

        // ...

        return $rules;
    }

Lors de l'exécution du code suivant, la sauvegarde échouera grâce à la nouvelle
règle d'application qui a été ajoutée::

    $userEntity->email = 'Pas un email!!!';
    $usersTable->save($userEntity);
    $userEntity->getErrors('email'); // Email invalide

Le même résultat est attendu lors de l'utilisation de ``newEntity()`` ou
``patchEntity()``::

    $userEntity = $usersTable->newEntity(['email' => 'Pas un email!!']);
    $userEntity->getErrors('email'); // Email invalide
