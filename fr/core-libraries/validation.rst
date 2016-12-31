Validation
##########

.. php:namespace:: Cake\Validation

Le package de validation dans CakePHP fournit des fonctionnalités pour
construire des validators qui peuvent valider des tableaux arbitraires de
données avec simplicité. Vous pouvez trouver une `liste des règles de validation
dans l'API
<https://api.cakephp.org/3.0/class-Cake.Validation.Validation.html>`__.

.. _creating-validators:

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
* ``update`` La présence du champ est requise lorsque vous validez une
  opération **update**.

Par défaut ``true`` est utilisée. La présence de la clé est vérifiée pour
l'utilisation de ``array_key_exists()`` donc les valeurs null vont être
comptabilisées comme étant présentes. Vous pouvez définir le mode en utilisant
le deuxième paramètre::

    $validator->requirePresence('author_id', 'create');

If you have multiple fields that are required, you can define them as a list::

    // Define multiple fields for create
    $validator->requirePresence(['author_id', 'title'], 'create');

    // Define multiple fields for mixed modes
    $validator->requirePresence([
        'author_id' => [
            'mode' => 'create',
            'message' => 'An author is required.',
        ],
        'published' => [
            'mode' => 'update',
            'message' => 'The published state is required.',
        ]
    ]);

.. versionadded:: 3.3.0
    ``requirePresence()`` accepts an array of fields as of 3.3.0

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
        ->notEmpty('body', 'Un body est nécessaire', 'create')
        ->allowEmpty('header_image', 'update');


Marquer les Règles comme étant les Dernières à être exécutées
-------------------------------------------------------------

Quand les champs ont plusieurs règles, chaque règle de validation sera exécutée
même si la précédente a échouée. Cela vous permet de recueillir autant d'erreurs
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

Méthodes de Validation Moins Verbeuses
--------------------------------------

Depuis la version 3.2, l'objet Validator accepte de nombreuses nouvelles
méthodes qui rendent la construction de validateurs moins verbeux. Par exemple,
ajouter des règles de validation à un champ username peut maintenant ressembler
à ceci::

    $validator = new Validator();
    $validator
        ->email('username')
        ->ascii('username')
        ->lengthBetween('username', [4, 8]);

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
``provider()`` pour ajouter un provider supplémentaire que votre application
a besoin d'utiliser::

    $validator = new Validator();

    // Utilise une instance de l'object.
    $validator->provider('custom', $myObject);

    // Utilise un nom de classe. Les méthodes doivent être static.
    $validator->provider('custom', 'App\Model\Validation');

Les providers de Validation peuvent être des objets, ou des noms de classe. Si
un nom de classe est utilisé, les méthodes doivent être static. Pour utiliser
un provider autre que 'default', assurez-vous de définir la clé ``provider()``
dans votre règle::

    // Utilise une règle à partir du provider de la table
    $validator->add('title', 'custom', [
        'rule' => 'customTableMethod',
        'provider' => 'table'
    ]);

Vous pouvez utiliser le `plugin Localized <https://github.com/cakephp/localized>`_ pour fournir des providers basés sur
les pays. Avec ce plugin, vous pourrez valider les champs de models selon un
pays, par exemple::

    namespace App\Model\Table;

    use Cake\ORM\Table;
    use Cake\Validation\Validator;

    class PostsTable extends Table
    {
        public function validationDefault(Validator $validator)
        {
            $validator = new Validator();
            // Ajoute le provider au validator
            $validator->provider('fr', 'Localized\Validation\FrValidation');
            // utilise le provider dans une règle de validation de champ
            $validator->add('phoneField', 'myCustomRuleNameForPhone', [
                'rule' => 'phone',
                'provider' => 'fr'
            ]);

            return $validator;
        }
    }

Le plugin localized utilise le code ISO à 2 lettres des pays pour la validation,
par exemple en, fr, de.

Il y a quelques méthodes qui sont communes à toutes les classes, définies par
`l'interface ValidationInterface <https://github.com/cakephp/localized/blob/master/src/Validation/ValidationInterface.php>`_::

    phone() pour vérifier un numéro de téléphone
    postal() pour vérifier un code postal
    personId() pour vérifier un ID d'une personne d'un pays

Règles de Validation Personnalisées
-----------------------------------

En plus de l'utilisation des méthodes venant des providers, vous pouvez aussi
utiliser toute fonction appellable inclue de façon anonyme en règle de
validation::

    // Utilise une fonction globale
    $validator->add('title', 'custom', [
        'rule' => 'validate_title',
        'message' => 'The title is not valid'
    ]);

    // Utilise un tableau appelable qui n'est pas un provider
    $validator->add('title', 'custom', [
        'rule' => [$this, 'method'],
        'message' => 'The title is not valid'
    ]);

    // Utilise une closure
    $extra = 'Some additional value needed inside the closure';
    $validator->add('title', 'custom', [
        'rule' => function ($value, $context) use ($extra) {
            // Logique personnalisée qui retourne true/false
        },
        'message' => 'The title is not valid'
    ]);

    // Utilisez une règle à partir d'un provider personnalisé
    $validator->add('title', 'custom', [
        'rule' => 'customRule',
        'provider' => 'custom',
        'message' => 'The title is not unique enough'
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

Si vous devez passer des données supplémentaires à vos méthodes de validation
comme pour les ids des users, vous pouvez utiliser un provider dynamique
personnalisé dans votre controller::

    $this->Examples->validator('default')->provider('passed', [
        'count' => $countFromController,
        'userid' => $this->Auth->user('id')
    ]);

Ensuite assurez-vous que votre méthode de validation ait le deuxième paramètre
de contexte::

    public function customValidationMethod($check, array $context)
    {
        $userid = $context['providers']['passed']['userid'];
    }

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

Vous pouvez accéder aux autres données soumises depuis le formulaire via le
tableau ``$context['data']``.
L'exemple ci-dessus va rendre la règle pour 'picture' optionnelle selon si la
valeur pour ``show_profile_picture`` est vide. Vous pouvez également utiliser
la règle de validation ``uploadedFile`` pour créer des inputs optionnelles
d'upload de fichiers::

    $validator->add('picture', 'file', [
        'rule' => ['uploadedFile', ['optional' => true]],
    ]);

Les méthodes de validation ``allowEmpty()``, ``notEmpty()`` et
``requirePresence()`` prennent également une fonction appelable en dernier
argument, ce qui determine si oui ou non la règle doit être appliquée. Par
exemple on peut autoriser parfois à un champ à être vide::

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

De plus il est aussi possible de demander à ce qu'un champ soit présent sous
certaines conditions seulement::

    $validator->requirePresence('full_name', function ($context) {
        if (isset($context['data']['action'])) {
            return $context['data']['action'] === 'subscribe';
        }
        return false;
    });
    $validator->requirePresence('email');

Ceci demanderait à ce que le champ ``full_name`` soit présent seulement dans le
cas où l'utilisateur veut créer une inscription, alors que le champ ``email``
est toujours requis puisqu'il serait aussi demandée lors de l'annulation d'une
inscription.

.. versionadded:: 3.1.1
    La possibilité de faire un callable pour ``requirePresence()`` a été ajoutée
    dans 3.1.1.

Imbriquer des Validators
------------------------

.. versionadded:: 3.0.5

Lorsque vous validez des :doc:`/core-libraries/form` avec des données
imbriquées, ou lorsque vous travaillez avec des modèles qui contiennent des
données de type tableau, il est nécessaire de valider les données imbriquées
dont vous disposez. CakePHP permet d'ajouter des validators sur des attributs
spécifiques. Par exemple, imaginez que vous travailliez avec une base de données
non relationnelle et que vous ayez besoin d'enregistrer un article et ses
commentaires::

    $data = [
        'title' => 'Meilleur article',
        'comments' => [
            ['comment' => '']
        ]
    ];

Pour valider les commentaires, vous utiliseriez un validator imbriqué::

    $validator = new Validator();
    $validator->add('title', 'not-blank', ['rule' => 'notBlank']);

    $commentValidator = new Validator();
    $commentValidator->add('comment', 'not-blank', ['rule' => 'notBlank']);

    // Connecte les validators imbriqués.
    $validator->addNestedMany('comments', $commentValidator);

    // Récupère toutes erreurs y compris celles des validators imbriqués.
    $validator->errors($data);

Vous pouvez créer des 'relations' 1:1 avec ``addNested()`` et  des 'relations'
1:N avec ``addNestedMany()``. Avec ces deux méthodes, les erreurs des
validators contribuerons aux erreurs du validator parent et influeront sur le
résultat final.

.. _reusable-validators:

Créer des Validators Ré-utilisables
-----------------------------------

Bien que définir des validators inline, là où ils sont utilisés, permet de
donner un bon exemple de code, cela ne conduit pas à avoir des applications
facilement maintenable. A la place, vous devriez créer des sous-classes de
``Validator`` pour votre logique de validation réutilisable::

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

    $errors = $validator->errors($this->request->getData());
    if (empty($errors)) {
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

    $errors = $validator->errors($this->request->getData(), false);
    if (empty($errors)) {
        // Envoi d'un email.
    }

.. note::

    Si vous avez besoin de valider les entities, vous devez utiliser les
    méthodes comme
    :php:meth:`~Cake\\ORM\\Table::newEntity()`,
    :php:meth:`~Cake\\ORM\\Table::newEntities()`,
    :php:meth:`~Cake\\ORM\\Table::patchEntity()`,
    :php:meth:`~Cake\\ORM\\Table::patchEntities()` or
    :php:meth:`~Cake\\ORM\\Table::save()` puisqu'elles ont été créées pour cela.

Valider les Entities
====================

Alors que les entities sont validées quand elles sont sauvegardées, vous pouvez
aussi vouloir valider les entities avant d'essayer de faire toute sauvegarde.
La validation des entities avant la sauvegarde est faite automatiquement quand
on utilise ``newEntity()``, ``newEntities()``, ``patchEntity()`` ou
``patchEntities()``::

    // Dans la classe ArticlesController
    $article = $this->Articles->newEntity($this->request->getData());
    if ($article->errors()) {
        // Afficher les messages d'erreur ici.
    }

De la même manière, quand vous avez besoin de pré-valider plusieurs entities
en une fois, vous pouvez utiliser la méthode ``newEntities()``::

    // Dans la classe ArticlesController
    $entities = $this->Articles->newEntities($this->request->getData());
    foreach ($entities as $entity) {
        if (!$entity->errors()) {
                $this->Articles->save($entity);
        }
    }

Les méthodes ``newEntity()``, ``patchEntity()``, ``newEntities()`` et
``patchEntities()`` vous permettent de spécifier les associations à valider, et
les ensembles de validation à appliquer en utilisant le paramètre ``options``::

    $valid = $this->Articles->newEntity($article, [
      'associated' => [
        'Comments' => [
          'associated' => ['User'],
          'validate' => 'special',
        ]
      ]
    ]);

La validation est habituellement utilisée pour les formulaires ou les interfaces
utilisateur, et ainsi elle n'est pas limitée seulement à la validation des
colonnes dans le schéma de la table. Cependant maintenir l'intégrité des données
selon d'où elles viennent est important. Pour résoudre ce problème, CakePHP
dispose d'un deuxième niveau de validation qui est appelé "règles
d'application". Vous pouvez en savoir plus en consultant la section
:ref:`Appliquer les Règles d'Application <application-rules>`.

Règles de Validation du Cœur
============================

CakePHP fournit une suite basique de méthodes de validation dans la classe
``Validation``. La classe Validation contient un ensemble de méthodes static qui
fournissent des validators pour plusieurs situations de validation habituelles.

La `documentation de l'API
<https://api.cakephp.org/3.0/class-Cake.Validation.Validation.html>`_ pour la
classe ``Validation`` fournit une bonne liste de règles de validation qui sont
disponibles, et leur utilisation basique.

Certaines des méthodes de validation acceptent des paramètres supplémentaires
pour définir des conditions limites ou des options valides. Vous pouvez fournir
ces conditions limite et options comme suit::

    $validator = new Validator();
    $validator
        ->add('title', 'minLength', [
            'rule' => ['minLength', 10]
        ])
        ->add('rating', 'validValue', [
            'rule' => ['range', 1, 5]
        ]);

Les règles du Cœur qui prennent des paramètres supplémentaires doivent avoir un
tableau pour la clé ``rule`` qui contient la règle comme premier élément, et les
paramètres supplémentaires en paramètres restants.
