Validating Data
###############

Before you :doc:`save your data</orm/saving-data>` you
will probably want to ensure the data is correct and consistent. In CakePHP we
have two stages of validation:

1. Before request data is converted into entities validation rules around
   data types, and formatting can be applied.
2. Before data is saved, domain or application rules can be applied. These rules
   help ensure that your application's data remains consistent.


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
        // validation de l'entity a echoué.
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

Les règles de validation peuvent utiliser les fonctions définies sur tout
provider connu. Par défaut, CakePHP définit quelques providers:

1. Les méthodes sur la classe table, ou ses behaviors sont disponible sur
   le provider ``table``.
2. La classe de :php:class:`~Cake\\Validation\\Validation` du coeur est
   configurée avec le provider ``default``.

Quand une règle de validation est créée, vous pouvez nommer le provider de cette
règle. Par exemple, si votre entity a une méthode 'isValidRole', vous pouvez
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

.. _application-rules:

Appliquer des Règles pour l'Application
=======================================

Alors qu'une validation basique des données est faite quand :ref:`les données
requêtées sont converties en entities <validating-request-data>`, de
nombreuses applications ont aussi d'autres validations plus complexes qui
doivent être appliquées seulement après qu'une validation basique a été
terminée. Ces types de règles sont souvent appelées 'règles de domaine' ou
'règles de l'application'. CakePHP utilise ce concept avec les 'RulesCheckers'
qui sont appliquées avant que les entities ne soient sauvegardées. Voici
quelques exemples de règles de domaine:

* S'assurer qu'un email est unique.
* Etats de transition ou étapes de flux de travail, par exemple pour mettre à
  jour un statut de facture.
* Eviter la modification ou la suppression soft d'articles.
* Enforcing usage/rate limit caps.

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
        }, 'ruleName');

        // Ajoute une règle pour la mise à jour.
        $rules->addUpdate(function ($entity, $options) {
        }, 'ruleName');

        // Ajoute une règle pour la suppression.
        $rules->addDelete(function ($entity, $options) {
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

Créer des Règles de Champ Unique
--------------------------------

Comme les règles uniques sont couramment utilisées, CakePHP inclut une classe
de Règle simple qui vous permet de facilement définir des ensembles de champ
unique::

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
experience utilisateur plus sympathique. C'est pour cela que CakePHP inclut
une classe de règle ``ExistsIn``::

    // Un champ unique.
    $rules->add($rules->existsIn('article_id', 'articles'));

    // Plusieurs clés, utile pour des clés primaires composites.
    $rules->add($rules->existsIn(['site_id', 'article_id'], 'articles'));

Les champs dont il faut vérifier l'existence dans la table liée doivent faire
parti de la clé primaire.

Utiliser les Méthodes Entity en tant que Règles
-----------------------------------------------

Vous pouvez utiliser les méthodes entity en tant que règles de domaine::

    $rules->add(function ($entity, $options) {
        return $entity->isOkLooking();
    }, 'ruleName');

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

