Validation
##########

.. php:namespace:: Cake\Validation

Le package de validation dans CakePHP fournit des fonctionnalités pour
construire des validators qui peuvent valider des tableaux arbitraires de
données avec simplicité.

Créer les Validators
====================

.. php:class:: Validator

Les objets Validator définissent les valeurs qui s'appliquent à un ensemble de
champs. Les objets Validator contiennent un mapping entre les champs et les
ensembles de validation. A son tour l'ensemble de validation contient une
collection de règles qui s'appliquent au champ auquel elles sont attachées.
Créer un validator est simple::

    use Cake\Validation\Validator;

    $validator = new Validator();

Une fois créé, vous pouvez commencer à définir des ensembles de règle pour les
champs que vous souhaitez valider::

    $validator
        ->requirePresence('title')
        ->notEmpty('title', 'Please fill this field')
        ->add('title', [
            'length' => [
                'rule' => ['minLength', 10],
                'message' => 'Titles need to be at least 10 characters long',
            ]
        ])
        ->allowEmpty('published')
        ->add('published', 'boolean', [
            'rule' => 'boolean'
        ])
        ->requirePresence('body')
        ->add('body', 'length', [
            'rule' => ['minLength', 50],
            'message' => 'Articles must have a substantial body.'
        ]);

Comme vu dans l'exemple ci-dessus, les validators sont construits avec une
interface facile qui vous permet de définir les règles pour chaque champ que
vous souhaitez valider.

Il y a quelques méthodes appelées dans l'exemple ci-dessus, alors regardons
les différentes fonctionnalités. La méthode ``add()`` vous permet d'ajouter
les nouvelles règles au validator. Vous pouvez soit ajouter des règles
individuellement, soit dans en groupe comme vu ci-dessus.

Valider la Présence d'un champ
------------------------------

La méthode ``requirePresence()`` oblige le champ à être présent dans tout
tableau de validation. Si le champ est absent, la validation va échouer. La
méthode ``requirePresence()`` a 4 modes:

* ``true`` La présence du champ est toujours requise.
* ``false`` La présence du champ n'est pas requise.
* ``create`` La présence du champ est requise lorsque vous validez une
  opération **create**.
* ``update`` La présence du champ est requise lorque vous validez une
  opération **update**.

Par défaut ``true`` est utilisée. La présence de la clé est vérifiée pour
l'utilisation de ``array_key_exists()`` donc les valeurs null vont être
comptabilisées comme étant présentes. Vous pouvez définir le mode en utilisant
le deuxième paramètre::

    $validator->requirePresence('author_id', 'create');

Permettre aux Champs d'être Vides
---------------------------------

Les méthodes ``allowEmpty()`` et ``notEmpty()`` vous permettent de contrôler
les champs autorisés à être 'vide'. En utilisant la méthode ``notEmpty()``, le
champ donné sera noté comme invalide quand il est vide. Vous pouvez utiliser
``allowEmpty()`` pour permettre à un champ d'être vide. Les deux méthodes
``allowEmpty()`` et ``notEmpty()`` ont un paramètre mode qui vous permet
de contrôler quand un champ peut ou ne peut pas être vide:

* ``true`` Le champ peut être vide.
* ``false`` Le champ ne peut pas être vide.
* ``create`` Le champ est nécessaire lors de la validation d'une opération
  **create**.
* ``update`` Le champ est nécessaire lors de la validation d'une opération
  **update**.

Les valeurs ``''``, ``null`` et ``[]`` (tableau vide) vont entraîner des
erreurs de validation quand les champs n'ont pas l'autorisation d'être vide.
Quand les champs ont l'autorisation d'être vide, les valeurs ``''``, ``null``,
``false``, ``[]``, ``0``, ``'0'`` sont acceptées.

Un exemple de ces méthodes est le suivant::

    $validator->allowEmpty('published')
        ->notEmpty('title', 'Un titre est nécessaire')
        ->notEmpty('body', 'Un titre est nécessaire', 'create')
        ->allowEmpty('header_image', 'update');

Champs Uniques
--------------

La classe ``Table`` fournit une règle de validation pour s'assurer qu'un champ
donné est unique dans une table. Par exemple, si vous souhaitez vous assurer
que l'adresse email est unique, vous pouvez faire ce qui suit::

    $validator->add('email', [
        'unique' => ['rule' => 'validateUnique', 'provider' => 'table']
    ]);

Si vous souhaitez vous assurer de l'unicité d'un champ en se basant sur un autre
champ dans votre table, comme une clé étrangère sur une table associée, vous
pouvez la scoper avec ce qui suit::

    $validator->add('email', [
        'unique' => [
            'rule' => ['validateUnique', ['scope' => 'site_id']],
            'provider' => 'table'
        ]
    ]);

Cela va s'assurer que l'adresse email fournie est seulement unique pour les
autres enregistrements avec le même ``site_id``.

Remarquez que ces exemples prennent une clé ``provider``. L'ajout des providers
``Validator`` est expliqué plus loin dans les sections suivantes.

Marquer les Règles comme étant les Dernières à être exécutées
-------------------------------------------------------------

Quand les champs ont plusieurs règles, chaque règle de validation sera exécutée
même si la précédente a echoué. Cela vous permet de recueillir autant d'erreurs
de validation que vous le pouvez en un seul passage. Si toutefois, vous voulez
stopper l'exécution après qu'une règle spécifique a échoué, vous pouvez définir
l'option ``last`` à ``true``::

    $validator = new Validator();
    $validator
        ->add('body', [
            'minLength' => [
                'rule' => ['minLength', 10],
                'last' => true,
                'message' => 'Comments must have a substantial body.'
            ],
            'maxLength' => [
                'rule' => ['maxLength', 250],
                'message' => 'Comments cannot be too long.'
            ]
        ]);

Dans l'exemple ci-dessus, si la règle minLength (longueur minimale) échoue,
la règle maxLength ne sera pas exécutée.

Ajouter des Providers de Validation
-----------------------------------

Les classes ``Validator``, ``ValidationSet`` et ``ValidationRule`` ne
fournissent elles-mêmes aucune méthode de validation. Les règles de validation
viennent de 'providers'. Vous pouvez lier tout nombre de providers à un objet
Validator. Les instances de Validator sont automatiquement fournies avec une
configuration de provider à 'default'. Le provider par défaut est mappé à la
classe :php:class:`~Cake\\Validation\\Validation`. Cela facilite l'utilisation
des méthodes de cette classe en règles de validation. Lors de l'utilisation
conjointe de Validators et de l'ORM, des providers supplémentaires sont
configurés pour la table et les objets entity. Vous pouvez utiliser la méthode
``provider`` pour ajouter un provider supplémentaire que votre application
a besoin d'utiliser::

    $validator = new Validator();

    // Utilise une instance de l'object.
    $validator->provider('custom', $myObject);

    // Utilise un nom de classe. Les méthodes doivent être static.
    $validator->provider('custom', 'App\Model\Validation');

Les providers de Validation peuvnt être des objets, ou des noms de classe. Si
un nom de classe est utilisé, les méthodes doivent être static. Pour utiliser
un provider autre que 'default', assurez-vous de définir la clé ``provider``
dans votre règle::

    // Utilise une règle à partir du provider de la table
    $validator->add('title', 'unique', [
        'rule' => 'uniqueTitle',
        'provider' => 'table'
    ]);

Règles de Validation Personnalisées
-----------------------------------

En plus de l'utilisation des méthodes venant des providers, vous pouvez aussi
utiliser toute fonction appellable inclue de façon anonyme en règle de
validation::

    // Utilise une fonction globale
    $validator->add('title', 'custom', [
        'rule' => 'validate_title'
    ]);

    // Utilise un tableau appelable qui n'est pas un provider
    $validator->add('title', 'custom', [
        'rule' => [$this, 'method']
    ]);

    // Utilise une closure
    $validator->add('title', 'custom', [
        'rule' => function ($value, $context) {
            // Custom logic that returns true/false
        }
    ]);

    // Utilisez une règle à partir d'un provider personnalisé
    $validator->add('title', 'unique', [
        'rule' => 'uniqueTitle',
        'provider' => 'table'
    ]);

Les Closures ou les méthodes appelables vont recevoir 2 arguments lors de leur
appel. Le premier va être la valeur pour le champ étant validé. Le second est
un tableau contextuel contenant des données liées au processus de validation:

- **data**: Les données originelles passées à la méthode de validation, utile
  si vous planifiez de créer les règles comparant les valeurs.
- **providers**: La liste complète de règle des objets provider, utile si vous
  avez besoin de créer des règles complexes en appelant plusieurs providers.
- **newRecord**: Selon si l'appel de la validation est pour un nouvel
  enregistrement ou pour un enregistrement existant.

Validation Conditionnelle
-------------------------

Lors de la définition des règles de validation, vous pouvez utiliser la clé
``on`` pour définir quand une règle de validation doit être appliquée. Si
elle est laissée non définie, la règle va toujours être appliquée. Les autres
valeurs valides sont ``create`` et ``update``. L'utilisation d'une de ces
valeurs va faire que la règle va s'appliquer seulement pour les opérations
create ou update.

En plus, vous pouvez fournir une fonction appelable qui va déterminer si oui
ou non, une règle particulière doit être appliquée::

    $validator->add('picture', 'file', [
        'rule' => ['mimeType', ['image/jpeg', 'image/png']],
        'on' => function ($context) {
            return !empty($context['data']['show_profile_picture']);
        }
    ]);

L'exemple ci-dessus va rendre la règle pour 'picture' optionnelle selon si la
valeur pour ``show_profile_picture`` est vide.

On peut faire la même chose pour les méthodes de validation ``allowEmpty()``
et ``notEmpty``.
Les deux prennent une fonction appelable en dernier argument, ce qui determine
si oui ou non la règle doit être appliquée. Par exemple on peut autoriser
parfois à un champ à être vide::

    $validator->allowEmpty('tax', function ($context) {
        return !$context['data']['is_taxable'];
    });

De la même façon, on peut vouloir qu'un champ soit peuplé quand certaines
conditions sont vérifiées::

    $validator->notEmpty('email_frequency', 'This field is required', function ($context) {
        return !empty($context['data']['wants_newsletter']);
    });

Dans l'exemple ci-dessus, le champ ``email_frequency`` ne peut être laissé vide
si l'utilisateur veut recevoir la newsletter.

.. _reusable-validators:

Créer des Validators Ré-utilisables
-----------------------------------

Bien que définir des validators inline, là où ils sont utilisés, permet de
donner un bon exemple de code, cela ne conduit pas à avoir des applications
facilement maintenable. A la place, vous devriez créer des sous-classes
de ``Validator`` pour votre logique de validation réutilisable::

    // Dans src/Model/Validation/ContactValidator.php
    namespace App\Model\Validation;

    use Cake\Validation\Validator;

    class ContactValidator extends Validator
    {
        public function __construct()
        {
            parent::__construct();
            // Add validation rules here.
        }
    }

Valider les Données
===================

Maintenant que vous avez créé un validator et que vous lui avez ajouté les
règles que vous souhaitiez, vous pouvez commencer à l'utiliser pour valider les
données. Les Validators sont capables de valider un tableau de données. Par
exemple, si vous voulez valider un formulaire de contact avant de créer et
d'envoyer un email, vous pouvez faire ce qui suit::

    use Cake\Validation\Validator;

    $validator = new Validator();
    $validator
        ->requirePresence('email')
        ->add('email', 'validFormat', [
            'rule' => 'email',
            'message' => 'E-mail must be valid'
        ])
        ->requirePresence('name')
        ->allowEmpty('name', false, 'We need your name.')
        ->requirePresence('comment')
        ->allowEmpty('comment', false, 'You need to give a comment.');

    $errors = $validator->errors($this->request->data());
    if (!empty($errors)) {
        // Envoi d'un email.
    }

La méthode ``errors()`` va retourner un tableau non-vide quand il y a des échecs
de validation. Le tableau retourné d'erreurs sera structuré comme ceci::

    $errors = [
        'email' => ['E-mail doit être valide']
    ];

Si vous avez plusieurs erreurs pour un seul champ, un tableau de messages
d'erreur va être retourné par champ. Par défaut la méthode ``errors()`` applique
les règles pour le mode 'create' mode. Si vous voulez appliquer les règles
'update' vous pouvez faire ce qui suit::

    $errors = $validator->errors($this->request->data(), false);
    if (!empty($errors)) {
        // Envoi d'un email.
    }

.. note::

    Si vous avez besoin de valider les entities, vous devez utiliser les
    méthodes comme :php:meth:`~Cake\\ORM\\Table::validate()` ou
    :php:meth:`~Cake\\ORM\\Table::save()` puisqu'elles sont destinées à cela.


Validating Entities
===================

While entities are validated as they are saved, you may also want to validate
entities before attempting to do any saving. Validating entities before
saving is often useful from the context of a controller, where you want to show
all the error messages for an entity and its related data::

    // In a controller
    $articles = TableRegistry::get('Articles');
    $article = $articles->newEntity($this->request->data());
    $valid = $articles->validate($article, [
        'associated' => ['Comments', 'Author']
    ]);
    if ($valid) {
        $articles->save($article, ['validate' => false]);
    } else {
        // Do work to show error messages.
    }

The ``validate`` method returns a boolean indicating whether or not the entity
& related entities are valid. If they are not valid, any validation errors will
be set on the entities that had validation errors. You can use the
:php:meth:`~Cake\\ORM\\Entity::errors()` to read any validation errors.

When you need to pre-validate multiple entities at a time, you can use the
``validateMany`` method::

    // In a controller
    $articles = TableRegistry::get('Articles');
    $entities = $articles->newEntities($this->request->data());
    if ($articles->validateMany($entities)) {
        foreach ($entities as $entity) {
            $articles->save($entity, ['validate' => false]);
        }
    } else {
        // Do work to show error messages.
    }

Much like the ``newEntity()`` method, ``validate()`` and ``validateMany()``
methods allow you to specify which associations are validated, and which
validation sets to apply using the ``options`` parameter::

    $valid = $articles->validate($article, [
      'associated' => [
        'Comments' => [
          'associated' => ['User'],
          'validate' => 'special',
        ]
      ]
    ]);


Règles de Validation du Cœur
=============================

CakePHP fournit une suite basique de méthodes de validation dans la classe
``Validation``. La classe Validation contient un ensemble de méthodes static
qui fournissent des validators pour plusieurs situations de validation
habituelles.

La `documentaition de l'API
<http://api.cakephp.org/3.0/class-Cake.Validation.Validation.html>`_ pour la
classe ``Validation`` fournit une bonne liste de règles de validation qui sont
disponibles, et leur utilisation basique.

Certaines des méthodes de validation acceptent des paramètres supplémentaires
pour définir des conditions limites ou des options valides. Vous pouvez fournir
ces conditions limite & options comme suit::

    $validator = new Validator();
    $validator
        ->add('title', 'minLength', [
            'rule' => ['minLength', 10]
        ])
        ->add('rating', 'validValue', [
            'rule' => ['range', 1, 5]
        ]);

Les règles du Cœur qui prennnent des paramètres supplémentaires doivent avoir
un tableau pour la clé ``rule`` qui contient la règle comme premier élément, et
les paramètres supplémentaires en paramètres restants.
