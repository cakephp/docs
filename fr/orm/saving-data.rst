Sauvegarder les Données
#######################

.. php:namespace:: Cake\ORM

.. php:class:: Table
    :noindex:

Après avoir :doc:`chargé vos données</orm/retrieving-data-and-resultsets>` vous
voudrez probablement mettre à jour et sauvegarder les changements.

Coup d'Oeil sur l'Enregistrement des Données
============================================

Les applications ont habituellement deux façons d'enregistrer les données.
La première est évidemment d'utiliser des formulaires web et l'autre consiste à
générer ou modifier directement les données dans le code pour l'envoyer à la
base de données.

Insérer des Données
-------------------

Le moyen le plus simple d'insérer des données dans une base de données est de
créer une nouvelle entity et de la passer à la méthode ``save()`` de la classe
``Table``::

    use Cake\ORM\Locator\LocatorAwareTrait;

    $articlesTable = $this->getTableLocator()->get('Articles');
    $article = $articlesTable->newEmptyEntity();

    $article->title = 'Un nouvel Article';
    $article->body = 'Ceci est le contenu de cet article';

    if ($articlesTable->save($article)) {
        // L'entity $article contient maintenant l'id
        $id = $article->id;
    }

Mettre à jour des Données
-------------------------

La méthode ``save()`` sert également à la mise à jour des données::

    use Cake\ORM\Locator\LocatorAwareTrait;

    $articlesTable = $this->getTableLocator()->get('Articles');
    $article = $articlesTable->get(12); // Retourne l'article avec l'id 12

    $article->title = 'Un nouveau titre pour cet article';
    $articlesTable->save($article);

CakePHP saura s'il doit faire une insertion ou une mise à jour d'après le
résultat de la méthode ``isNew()``. Les entities qui sont récupérées via
``get()`` ou  ``find()`` renverront toujours ``false`` lorsqu'on appelle leur
méthode ``isNew()``.

Enregistrer avec des Associations
---------------------------------

Par défaut, la méthode ``save()`` sauvegardera aussi un seul niveau
d'association::

    $articlesTable = $this->getTableLocator()->get('Articles');
    $author = $articlesTable->Authors->findByUserName('mark')->first();

    $article = $articlesTable->newEmptyEntity();
    $article->title = 'Un article par mark';
    $article->author = $author;

    if ($articlesTable->save($article)) {
        // La valeur de la clé étrangère a été ajoutée automatiquement.
        echo $article->author_id;
    }

La méthode ``save()`` est également capable de créer de nouveaux
enregistrements pour les associations::

    $firstComment = $articlesTable->Comments->newEmptyEntity();
    $firstComment->body = 'Un super article';

    $secondComment = $articlesTable->Comments->newEmptyEntity();
    $secondComment->body = 'J aime lire ceci!';

    $tag1 = $articlesTable->Tags->findByName('cakephp')->first();
    $tag2 = $articlesTable->Tags->newEmptyEntity();
    $tag2->name = 'Génial';

    $article = $articlesTable->get(12);
    $article->comments = [$firstComment, $secondComment];
    $article->tags = [$tag1, $tag2];

    $articlesTable->save($article);

Associer des Enregistrements Many to Many
-----------------------------------------

Dans le code ci-dessus il y a déjà un exemple de liaison d'un article vers
deux tags. Il y a un autre moyen de faire la même chose en utilisant la
méthode ``link()`` dans l'association::

    $tag1 = $articlesTable->Tags->findByName('cakephp')->first();
    $tag2 = $articlesTable->Tags->newEmptyEntity();
    $tag2->name = 'Génial';

    $articlesTable->Tags->link($article, [$tag1, $tag2]);

Dissocier des Enregistrements Many To Many
------------------------------------------

Pour dissocier des enregistrements many-to-many, utilisez la méthode
``unlink()``::

    $tags = $articlesTable
        ->Tags
        ->find()
        ->where(['name IN' => ['cakephp', 'awesome']])
        ->toList();

    $articlesTable->Tags->unlink($article, $tags);

Lorsque vous modifiez des enregistrements en définissant ou modifiant
directement leurs propriétés, il n'y aura pas de validation, ce qui est
problématique s'il s'agit d'accepter les données d'un formulaire. La section
suivante explique comment convertir efficacement les données de formulaire
en entities afin qu'elles puissent être validées et sauvegardées.

.. _converting-request-data:

Convertir les Données Requêtées en Entities
===========================================

Avant de modifier et de réenregistrer les données dans la base de données,
vous devrez convertir les données d'un format de tableau (figurant
dans la requête) en entities utilisées par l'ORM. La classe
Table peut convertir efficacement une ou plusieurs entities à partir des
données de la requête. Vous pouvez convertir une entity unique en utilisant::

    // Dans un controller.

    $articles = $this->getTableLocator()->get('Articles');

    // Valide et convertit en un objet Entity
    $entity = $articles->newEntity($this->request->getData());

.. note::

    Si vous utilisez newEntity() et qu'il manque tout ou partie des nouvelles
    données dans les entities créées, vérifiez que les colonnes que vous voulez
    modifier sont listées dans la propriété ``$_accessible`` de votre entity.
    Cf. :ref:`entities-mass-assignment`.

Les données de la requête doivent suivre la structure de vos entities. Par
exemple si vous avez un article, que celui-ci appartient à un utilisateur,
(*belongs to*), et a plusieurs commentaires (*has many*), les données de votre
requête devraient ressembler à::

    $data = [
        'title' => 'Mon titre',
        'body' => 'Le texte',
        'user_id' => 1,
        'user' => [
            'username' => 'mark'
        ],
        'comments' => [
            ['body' => 'Premier commentaire'],
            ['body' => 'Deuxième commentaire'],
        ]
    ];

Par défaut, la méthode ``newEntity()`` valide les données qui lui sont passées,
comme expliqué dans la section :ref:`validating-request-data`. Si vous voulez
empêcher la validation des données, passez l'option ``'validate' => false``::

    $entity = $articles->newEntity($data, ['validate' => false]);

Lors de la construction de formulaires qui sauvegardent des associations
imbriquées, vous devez définir quelles associations doivent être converties::

    // Dans un controller

    $articles = $this->getTableLocator()->get('Articles');

    // Nouvelle entity avec des associations imbriquées
    $entity = $articles->newEntity($this->request->getData(), [
        'associated' => [
            'Tags', 'Comments' => ['associated' => ['Users']]
        ]
    ]);

Ceci indique que les Tags, les commentaires et les utilisateurs associés aux
commentaires doivent être convertis. Au choix, vous pouvez aussi utiliser la
notation par points, qui est plus concise::

    // Dans un controller

    $articles = $this->getTableLocator()->get('Articles');

    // Nouvelle entity avec des associations imbriquées en utilisant
    // la notation par points
    $entity = $articles->newEntity($this->request->getData(), [
        'associated' => ['Tags', 'Comments.Users']
    ]);

Vous pouvez aussi désactiver la conversion d'associations imbriquées comme
ceci::

    $entity = $articles->newEntity($data, ['associated' => []]);
    // ou...
    $entity = $articles->patchEntity($entity, $data, ['associated' => []]);

Les données associées sont aussi validées par défaut, à moins de spécifier le
contraire. Vous pouvez également changer l'ensemble de validation utilisé pour
chaque association::

    // Dans un controller

    $articles = $this->getTableLocator()->get('Articles');

    // Ne fait pas de validation pour l'association Tags et
    // appelle l'ensemble de validation 'signup' pour Comments.Users
    $entity = $articles->newEntity($this->request->getData(), [
        'associated' => [
            'Tags' => ['validate' => false],
            'Comments.Users' => ['validate' => 'signup']
        ]
    ]);

Le chapitre :ref:`using-different-validators-per-association` contient davantage
d'informations sur la façon d'utiliser les différents validateurs pour la
sauvegarde d'associations.

Le diagramme suivant donne un aperçu de ce qui se passe dans la méthode
``newEntity()`` ou ``patchEntity()``:

.. figure:: /_static/img/validation-cycle.png
   :align: left
   :alt: Logigramme montrant le process de conversion/validation.

La méthode ``newEmptyEntity()`` vous renverra toujours une entity. Si la
validation échoue, votre entité contiendra des erreurs et les champs invalides
ne seront pas remplis dans l'entity créée.

Convertir des Données BelongsToMany
-----------------------------------

Si vous sauvegardez des associations belongsToMany, vous pouvez utiliser soit
une liste de données d'entity, soit une liste d'ids. Quand vous utilisez une
liste de données d'entity, les données de votre requête devraient ressembler à
ceci::

    $data = [
        'title' => 'Mon titre',
        'body' => 'Le texte',
        'user_id' => 1,
        'tags' => [
            ['name' => 'CakePHP'],
            ['name' => 'Internet'],
        ],
    ];

Ce code créera 2 nouveaux tags. Si vous voulez créer un lien entre un article et
des tags existants, vous pouvez utiliser une liste d'ids. Les données de votre
requête doivent ressembler à ceci::

    $data = [
        'title' => 'Mon titre',
        'body' => 'Le texte',
        'user_id' => 1,
        'tags' => [
            '_ids' => [1, 2, 3, 4],
        ],
    ];

Si vous souhaitez lier des entrées belongsToMany existantes et en créer de
nouvelles en même temps, vous pouvez utiliser la forme étendue::

    $data = [
        'title' => 'Mon titre',
        'body' => 'Le texte',
        'user_id' => 1,
        'tags' => [
            ['name' => 'Un nouveau tag'],
            ['name' => 'Un autre nouveau tag'],
            ['id' => 5],
            ['id' => 21],
        ],
    ];

Quand ces données seront converties en entities, il y aura 4 tags.
Les deux premiers seront de nouveaux objets, et les deux autres seront des
références à des tags existants.

Quand vous convertissez des données de belongsToMany, vous pouvez désactiver la
création d'une nouvelle entity en utilisant l'option ``onlyIds``::

    $result = $articles->patchEntity($entity, $data, [
        'associated' => ['Tags' => ['onlyIds' => true]],
    ]);

Quand elle est activée, cette option restreint la conversion des données de
belongsToMany pour utiliser uniquement la clé ``_ids``.

Convertir des Données HasMany
-----------------------------

Si vous souhaitez mettre à jour des associations hasMany existantes et mettre à
jour leurs propriétés, vous devez d'abord vous assurer que votre entity est
chargée avec les données hasMany associées. Vous pouvez ensuite utiliser une
requête avec des données structurées de la façon suivante::

    $data = [
        'title' => 'Mon titre',
        'body' => 'Le texte',
        'comments' => [
            ['id' => 1, 'comment' => 'Mettre à jour le premier commentaire'],
            ['id' => 2, 'comment' => 'Mettre à jour le deuxième commentaire'],
            ['comment' => 'Créer un nouveau commentaire'],
        ],
    ];

Si vous sauvegardez des associations hasMany et que voulez lier des
enregistrements existants à un nouveau parent, vous pouvez utiliser le format
``_ids``::

    $data = [
        'title' => 'Mon nouvel article',
        'body' => 'Le texte',
        'user_id' => 1,
        'comments' => [
            '_ids' => [1, 2, 3, 4],
        ],
    ];

Quand vous convertissez des données de hasMany, vous pouvez désactiver la
création d'une nouvelle entity en utilisant l'option ``onlyIds``. Quand elle
est activée, cette option restreint la conversion des données hasMany pour
utiliser uniquement la clé ``_ids`` et ignorer toutes les autres données.

Convertir des Enregistrements Multiples
---------------------------------------

Lorsque vous créez des formulaires de création/mise à jour de plusiseurs
enregistrements en une seule opération, vous pouvez utiliser ``newEntities()``::

    // Dans un controller.

    $articles = $this->getTableLocator()->get('Articles');
    $entities = $articles->newEntities($this->request->getData());

Dans cette situation, les données de la requête pour plusieurs articles doivent
ressembler à ceci::

    $data = [
        [
            'title' => 'Premier post',
            'published' => 1,
        ],
        [
            'title' => 'Second post',
            'published' => 1,
        ],
    ];

Une fois que vous avez converti les données de la requête en entities, vous
pouvez sauvegarder::

    // Dans un controller.
    foreach ($entities as $entity) {
        // Sauvegarder l'entity
        $articles->save($entity);
    }

Ce code va lancer séparément une transaction pour chaque entity
sauvegardée. Si vous voulez traiter toutes les entities en transaction unique,
vous pouvez utiliser ``saveMany()`` ou ``saveManyOrFail()``::

    // Renvoie un booléen pour indiquer si l'opération a réussi
    $articles->saveMany($entities);

    // Lève une PersistenceFailedException si l'un des enregistrements échoue
    $articles->saveManyOrFail($entities);

.. _changing-accessible-fields:

Changer les Champs Accessibles
------------------------------

Il est également possible d'autoriser ``newEntity()`` à écrire dans des
champs non accessibles. Par exemple, ``id`` est généralement absent de la
propriété ``_accessible``. Dans un tel cas, vous pouvez utiliser l'option
``accessibleFields``. Il pourrait être utile de conserver les ids des entities
associées::

    // Dans un controller.

    $articles = $this->getTableLocator()->get('Articles');
    $entity = $articles->newEntity($this->request->getData(), [
        'associated' => [
            'Tags', 'Comments' => [
                'associated' => [
                    'Users' => [
                        'accessibleFields' => ['id' => true],
                    ],
                ],
            ],
        ],
    ]);

Le code ci-dessus permet de conserver l'association entre Comments et Users pour
l'entity concernée.

.. note::

    Si vous utilisez newEntity() et qu'il manque dans l'entity tout ou partie
    des données transmises, vérifiez à deux fois que les colonnes
    que vous souhaitez définir sont listées dans la propriété ``$_accessible``
    de votre entity. Cf. :ref:`entities-mass-assignment`.

Fusionner les Données de la Requête dans les Entities
-----------------------------------------------------

Pour mettre à jour des entities, vous pouvez choisir d'appliquer les données de
la requête directement sur une entity existante. Cela a l'avantage que seuls les
champs réellement modifiés seront sauvegardés, au lieu d'envoyer tous les
champs à la base de données, même ceux qui sont inchangés. Vous pouvez
fusionner un tableau de données brutes dans une entity existante en utilisant la
méthode ``patchEntity()``::

    // Dans un controller.

    $articles = $this->getTableLocator()->get('Articles');
    $article = $articles->get(1);
    $articles->patchEntity($article, $this->request->getData());
    $articles->save($article);

Validation et patchEntity
~~~~~~~~~~~~~~~~~~~~~~~~~

De la même façon que ``newEntity()``, la méthode ``patchEntity`` validera les
données avant de les copier dans l'entity. Ce mécanisme est expliqué
dans la section :ref:`validating-request-data`. Si vous souhaitez désactiver la
validation lors du patch d'une entity, passez l'option ``validate`` comme ceci::

    // Dans un controller.

    $articles = $this->getTableLocator()->get('Articles');
    $article = $articles->get(1);
    $articles->patchEntity($article, $data, ['validate' => false]);

Vous pouvez également changer l'ensemble de validation utilisé pour l'entity
ou pour n'importe qu'elle association::

    $articles->patchEntity($article, $this->request->getData(), [
        'validate' => 'custom',
        'associated' => ['Tags', 'Comments.Users' => ['validate' => 'signup']]
    ]);

Patcher des HasMany et BelongsToMany
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Comme expliqué dans la section précédente, les données de la requête doivent suivre
la structure de votre entity. La méthode ``patchEntity()`` est également capable
de fusionner les associations. Par défaut seul les premiers niveaux
d'associations sont fusionnés mais si vous voulez contrôler la liste des
associations à fusionner, ou fusionner des niveaux de plus en plus profonds, vous
pouvez utiliser le troisième paramètre de la méthode::

    // Dans un controller.
    $associated = ['Tags', 'Comments.Users'];
    $article = $articles->get(1, ['contain' => $associated]);
    $articles->patchEntity($article, $this->request->getData(), [
        'associated' => $associated,
    ]);
    $articles->save($article);

Les associations sont fusionnées en faisant correspondre la clé primaire des
entities source avec les champs correspondants dans le tableau de données
fourni. Si aucune entity cible n'est trouvée, les associations construiront de
nouvelles entities.

Pa exemple, prenons une requête contenant les données suivantes::

    $data = [
        'title' => 'Mon titre',
        'user' => [
            'username' => 'mark',
        ],
    ];

Si vous essayez de patcher une entity ne contenant pas d'entity associée dans la
propriété user, une nouvelle entity sera créée pour `user`::

    // Dans un controller.
    $entity = $articles->patchEntity(new Article, $data);
    echo $entity->user->username; // Affiche 'mark'

Cela fonctionne de la même manière pour les associations hasMany et
belongsToMany, avec cependant un point d'attention important:

.. note::

    Pour les associations belongsToMany, vérifiez que les entities associées
    ont bien une propriété accessible pour l'entité associée.

Si Product belongsToMany Tag::

    // Dans l'entity Product
    protected array $_accessible = [
        // .. autres propriétés
       'tags' => true,
    ];

.. note::

    Pour les associations hasMany et belongsToMany, s'il y avait des entities
    dont la clé primaire ne correspondait à aucun enregistrement dans le tableau
    de données, alors ces enregistrements seraient écartés de l'entity
    résultante.

    Rappelez-vous que l'utilisation de ``patchEntity()`` ou de
    ``patchEntities()`` ne fait pas persister les données, elle ne fait que
    modifier (ou créer) les entities données. Pour sauvegarder l'entity, vous
    devrez appeler la méthode ``save()`` de la table.

Par exemple, considérons le cas suivant::

    $data = [
        'title' => 'Mon titre',
        'body' => 'Le text',
        'comments' => [
            ['body' => 'Premier commentaire', 'id' => 1],
            ['body' => 'Second commentaire', 'id' => 2],
        ],
    ];
    $entity = $articles->newEntity($data);
    $articles->save($entity);

    $newData = [
        'comments' => [
            ['body' => 'Commentaire modifié', 'id' => 1],
            ['body' => 'Un nouveau commentaire'],
        ],
    ];
    $articles->patchEntity($entity, $newData);
    $articles->save($entity);

Au final, si l'entity est à nouveau convertie en tableau, vous obtiendrez le
résultat suivant::

    [
        'title' => 'Mon titre',
        'body' => 'Le text',
        'comments' => [
            ['body' => 'Commentaire modifié', 'id' => 1],
            ['body' => 'Un nouveau commentaire'],
        ]
    ];

Comme vous pouvez le constater, le commentaire avec l'id 2 a disparu, puisqu'il
ne correspondait à aucun élément du tableau ``$newData``. Cela se passe ainsi
parce CakePHP calque les données de l'entity sur le nouvel état que décrit par
les données de la requête.

Un autre avantage à cette approche est qu'elle réduit le nombre d'opérations à
exécuter lorsque l'entity est à nouveau persistée.

Notez bien que cela ne veut pas dire que le commentaire avec l'id 2 a été
supprimé de la base de données. Si vous souhaitez supprimer les commentaires de
cet article qui ne sont pas présents dans l'entity, vous pouvez récupérer
les clés primaires et exécuter une suppression batch pour celles qui ne sont
pas dans la liste::

    // Dans un controller.
    use Cake\Collection\Collection;

    $comments = $this->getTableLocator()->get('Comments');
    $present = (new Collection($entity->comments))->extract('id')->filter()->toList();
    $comments->deleteAll([
        'article_id' => $article->id,
        'id NOT IN' => $present,
    ]);

Comme vous voyez, cela permet aussi de créer des solutions dans lesquelles une
association a besoin d'être implémentée comme un ensemble unique.

Vous pouvez aussi faire un patch de plusieurs entities à la fois. Ce que nous
avons vu pour les associations hasMany et belongsToMany s'applique aussi pour
patcher plusieurs entities: les correspondances se font d'après la valeur de la
clé primaire et celles qui sont absentes dans le tableau des entities d'origine
seront retirées et absentes des résultats::

    // Dans un controller.

    $articles = $this->getTableLocator()->get('Articles');
    $list = $articles->find('popular')->toList();
    $patched = $articles->patchEntities($list, $this->request->getData());
    foreach ($patched as $entity) {
        $articles->save($entity);
    }

De la même façon qu'avec ``patchEntity()``, vous pouvez utiliser le troisième
argument pour contrôler les associations qui seront fusionnées dans chacune des
entities du tableau::

    // Dans un controller.
    $patched = $articles->patchEntities(
        $list,
        $this->request->getData(),
        ['associated' => ['Tags', 'Comments.Users']]
    );

.. _before-marshal:

Modifier les Données de la Requête Avant de Construire les Entities
-------------------------------------------------------------------

Si vous devez modifier les données de la requête avant de les convertir en
entities, vous pouvez utiliser l'event ``Model.beforeMarshal``. Cet event vous
permet de manipuler les données de la requête juste avant la création des
entities::

    // Ajoutez les instructions use au début de votre fichier.
    use Cake\Event\EventInterface;
    use ArrayObject;

    // Dans une classe de table ou un behavior
    public function beforeMarshal(EventInterface $event, ArrayObject $data, ArrayObject $options)
    {
        if (isset($data['username'])) {
            $data['username'] = mb_strtolower($data['username']);
        }
    }

Le paramètre ``$data`` est une instance ``ArrayObject``, donc vous n'avez pas
besoin de la renvoyer pour changer les données qui seront utilisées pour créer
les entities.

Le but principal de ``beforeMarshal`` est d'aider les utilisateurs à passer
le process de validation lorsque des erreurs simples peuvent être résolues
automatiquement, ou lorsque les données doivent être restructurées pour être
placées dans les bons champs.

L'event ``Model.beforeMarshal`` est lancé juste au début du process de validation.
Une des raisons à cela est que ``beforeMarshal`` est autorisé à modifier les
règles de validation et les options d'enregistrement, telles que la liste
blanche des champs. La validation est lancée juste après la fin de l'exécution
de cet événement. Un exemple classique de modification des données avant leur
validation est la suppression des espaces superflus dans tous les champs avant
leur enregistrement::

    // Ajoutez les instructions use au début de votre fichier.
    use Cake\Event\EventInterface;
    use ArrayObject;

    // Dans une table ou un behavior
    public function beforeMarshal(EventInterface $event, ArrayObject $data, ArrayObject $options)
    {
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $data[$key] = trim($value);
            }
        }
    }

Du fait du mode de fonctionnement du marshalling, si un champ ne passe pas la
validation il sera automatiquement supprimé du tableau de données et ne sera pas
copié dans l'entity. Cela évite d'avoir des données incohérentes dans l'objet
entity.

De plus, les données fournies à la méthode ``beforeMarshal`` sont une copie des
données passées. La raison à cela est qu'il est important de préserver les
données saisies à l'origine par l'utilisateur, car elles sont susceptibles de
servir autre part.

Modifier les Entités Après leur Mise À Jour À Partir de la Requête
------------------------------------------------------------------

L'événement ``Model.afterMarshal`` vous permet de modifier les entités après
qu'elles auront été créées ou modifiées à partir des données de la requête. Cela
peut vous servir à appliquer une logique de validation supplémentaire qui ne
peut pas être exprimée de manière simple à travers les méthodes du Validator::

    // Ajoutez les instructions use au début de votre fichier.
    use Cake\Event\EventInterface;
    use Cake\ORM\EntityInterface;
    use ArrayObject;

    // Dans une classe de table ou de behavior
    public function afterMarshal(
        EventInterface $event,
        EntityInterface $entity,
        ArrayObject $data,
        ArrayObject $options
    ) {
        // Ne pas accepter les personnes dont le nom commence par J le 20 de
        // chaque mois.
        if (mb_substr($entity->name, 1) === 'J' && (int)date('d') === 20) {
            $entity->setError('name', 'Pas de noms en J aujourd\'hui. Désolé.');
        }
    }

.. versionadded:: 4.1.0

Valider les Données Avant de Construire les Entities
----------------------------------------------------

Le chapitre :doc:`/orm/validation` vous fournira plus d'informations sur les
fonctionnalités de validation de CakePHP pour garantir l'exactitude et la
cohérence de vos données.

Éviter les Attaques d'Assignement en Masse de Propriétés
--------------------------------------------------------

Lors de la création ou la fusion des entities à partir de données de la requête,
vous devez être attentif aux ajouts ou modifications que vous permettez à vos
utilisateurs dans les entities. Par exemple, en envoyant dans la requpete un
tableau contenant ``user_id``, un pirate pourrait changer le propriétaire d'un
article, ce qui entraînerait des effets indésirables::

    // Contient ['user_id' => 100, 'title' => 'Piraté !'];
    $data = $this->request->getData();
    $entity = $this->patchEntity($entity, $data);
    $this->save($entity);

Il y a deux façons de se protéger contre ce problème. La première est de
définir les colonnes par défaut qui peuvent être définies en toute sécurité à
partir d'une requête en utilisant la fonctionnalité
d':ref:`entities-mass-assignment` dans les entities.

La deuxième façon est d'utiliser l'option ``fields`` lors de la création ou
la fusion de données dans une entity::

    // Contient ['user_id' => 100, 'title' => 'Piraté !'];
    $data = $this->request->getData();

    // Permet seulement de changer le title
    $entity = $this->patchEntity($entity, $data, [
        'fields' => ['title']
    ]);
    $this->save($entity);

Vous pouvez aussi contrôler les propriétés qui peuvent être assignées pour les
associations::

    // Permet seulement de modifier le titre et les tags
    // et le nom du tag est la seule colonne qui puisse être définie
    $entity = $this->patchEntity($entity, $data, [
        'fields' => ['title', 'tags'],
        'associated' => ['Tags' => ['fields' => ['name']]]
    ]);
    $this->save($entity);

Cette fonctionnalité est pratique quand vos utilisateurs ont accès plusieurs
fonctions et que vous voulez leur permettre de modifier différentes données
en fonction de leurs privilèges.

.. _saving-entities:

Sauvegarder les Entities
========================

.. php:method:: save(Entity $entity, array $options = [])

Quand vous sauvegardez les données de la requête dans votre base de données,
vous devez d'abord hydrater une nouvelle entity en utilisant ``newEntity()``,
que vous pourrez ensuite passer à ``save()``. Par exemple::

    // Dans un controller

    $articles = $this->getTableLocator()->get('Articles');
    $article = $articles->newEntity($this->request->getData());
    if ($articles->save($article)) {
        // ...
    }

L'ORM utilise la méthode ``isNew()`` sur une entity pour déterminer s'il faut
réaliser une insertion ou une mise à jour. Si la méthode ``isNew()`` renvoie
``true`` et que l'entity a une clé primaire, l'ORM va d'abord lancer une requête
'exists'. Cette requête 'exists' peut être supprimée en passant
``'checkExisting' => false`` dans l'argument ``$options``::

    $articles->save($article, ['checkExisting' => false]);

Une fois que vous aurez chargé quelques entities, vous voudrez probablement les
modifier et mettre à jour la base de données. C'est une manipulation simple dans
CakePHP::

    $articles = $this->getTableLocator()->get('Articles');
    $article = $articles->find('all')->where(['id' => 2])->first();

    $article->title = 'Mon nouveau titre';
    $articles->save($article);

Lors de la sauvegarde, CakePHP va
:ref:`appliquer vos règles de validation <application-rules>`, et inclure
l'opération de sauvegarde dans une transaction de la base de données.
Cela mettra à jour uniquement les propriétés qui ont changé. L'appel à
``save()`` ci-dessus va générer un code SQL de ce type:

.. code-block:: sql

    UPDATE articles SET title = 'Mon nouveau titre' WHERE id = 2;

Si vous aviez une nouvelle entity, cela générerait le code SQL suivant:

.. code-block:: sql

    INSERT INTO articles (title) VALUES ('Mon nouveau titre');

Quand une entity est sauvegardée, voici ce qui se passe:

1. La vérification des règles commencera si elle n'est pas désactivée.
2. La vérification des règles va déclencher l'event
   ``Model.beforeRules``. Si l'event est stoppé, l'opération de
   sauvegarde échouera et retournera ``false``.
3. Les règles seront vérifiées. Si l'entity est en train d'être créée, les
   règles ``create`` seront utilisées. Si l'entity est en train d'être mise à
   jour, les règles ``update`` seront utilisées.
4. L'event ``Model.afterRules`` sera déclenché.
5. L'event ``Model.beforeSave`` est dispatché. S'il est stoppé, la
   sauvegarde sera annulée, et save() va retourner ``false``.
6. Les associations parentes sont sauvegardées. Par exemple, toute association
   belongsTo listée sera sauvegardée.
7. Les champs modifiés sur l'entity seront sauvegardés.
8. Les associations enfants sont sauvegardées. Par exemple, toute association
   hasMany, hasOne, ou belongsToMany listée sera sauvegardée.
9. L'event ``Model.afterSave`` sera dispatché.
10. L'event ``Model.afterSaveCommit`` sera dispatché.

Le diagramme suivant illustre ce procédé:

.. figure:: /_static/img/save-cycle.png
   :align: left
   :alt: Logigramme montrant le procédé de sauvegarde.

Consultez la section :ref:`application-rules` pour plus d'informations sur la
création et l'utilisation des règles.

.. warning::

    Si l'entity n'a subi aucun changement au moment de sa sauvegarde, les
    callbacks ne vont pas être déclenchés car aucune opération de sauvegarde
    n'est effectuée.

La méthode ``save()`` va retourner l'entity modifiée en cas de succès, et
``false`` en cas d'échec. Vous pouvez désactiver les règles et/ou les
transactions en utilisant l'argument ``$options`` lors de la sauvegarde::

    // Dans un controller ou une méthode de table.
    $articles->save($article, ['checkRules' => false, 'atomic' => false]);

Sauvegarder les Associations
----------------------------

Quand vous sauvegardez une entity, vous pouvez aussi choisir de sauvegarder tout
ou partie des entities associées. Par défaut, toutes les entities de premier
niveau seront sauvegardées. Par exemple, sauvegarder un Article va aussi
mettre à jour automatiquement toute entity modifiée directement liée à la table
des articles.

Vous pouvez accéder à un réglage plus fin des associations qui sont sauvegardées
en utilisant l'option ``associated``::

    // Dans un controller.

    // Sauvegarde seulement l'association avec les commentaires
    $articles->save($entity, ['associated' => ['Comments']]);

Vous pouvez définir une sauvegarde d'associations imbriquées sur plusieurs
niveaux en utilisant la notation par point::

    // Sauvegarde la société, les employés et les adresses liées à chacun d'eux.
    $companies->save($entity, ['associated' => ['Employees.Addresses']]);

De plus, vous pouvez combiner la notation par point pour les associations avec
le tableau d'options::

    $companies->save($entity, [
      'associated' => [
        'Employees',
        'Employees.Addresses'
      ]
    ]);

Vos entities doivent être structurées de la même façon qu'elles l'étaient
quand elles ont été chargées à partir de la base de données.
Consultez la documentation du helper Form pour savoir comment
:ref:`associated-form-inputs`.

Si vous construisez ou modifiez des données associées après avoir construit
vos entities, vous devrez marquer la propriété d'association comme étant
modifiée en utilisant ``setDirty()``::

    $company->author->name = 'Master Chef';
    $company->setDirty('author', true);

Sauvegarder les Associations BelongsTo
--------------------------------------

Lors de la sauvegarde des associations belongsTo, l'ORM attend une entity
imbriquée unique avec le nom de l'association au singulier et
:ref:`des underscores <inflector-methods-summary>`.
Par exemple::

    // Dans un controller.
    $data = [
        'title' => 'Premier Post',
        'user' => [
            'id' => 1,
            'username' => 'mark'
        ]
    ];

    $articles = $this->getTableLocator()->get('Articles');
    $article = $articles->newEntity($data, [
        'associated' => ['Users']
    ]);

    $articles->save($article);

Sauvegarder les Associations HasOne
-----------------------------------

Lors de la sauvegarde d'associations hasOne, l'ORM attend une entity
imbriquée unique avec le nom de l'association au singulier et
:ref:`des underscores underscore <inflector-methods-summary>`.
Par exemple::

    // Dans un controller.
    $data = [
        'id' => 1,
        'username' => 'cakephp',
        'profile' => [
            'twitter' => '@cakephp'
        ]
    ];

    $users = $this->getTableLocator()->get('Users');
    $user = $users->newEntity($data, [
        'associated' => ['Profiles']
    ]);
    $users->save($user);

Sauvegarder les Associations HasMany
------------------------------------

Lors de la sauvegarde d'associations hasMany, l'ORM attend un tableau d'entities
avec le nom de l'association au pluriel et
:ref:`des underscores <inflector-methods-summary>`.
Par exemple::

    // Dans un controller.
    $data = [
        'title' => 'Premier Post',
        'comments' => [
            ['body' => 'Le meilleur post de ma vie'],
            ['body' => 'Celui-là, je l\'aime vraiment bien.']
        ]
    ];

    $articles = $this->getTableLocator()->get('Articles');
    $article = $articles->newEntity($data, [
        'associated' => ['Comments']
    ]);
    $articles->save($article);

Lors de la sauvegarde d'associations hasMany, les enregistrements associés
seront soit mis à jour, soit insérés. Dans les cas où l'enregistrement a déjà
des enregistrements associés dans la base de données, vous avez le choix entre
deux stratégies de sauvegarde:

append
    Les enregistrements associés sont mis à jour dans la base de données
    ou, s'ils ne correspondent à aucun enregistrement existant, sont insérés.
replace
    Tout enregistrement existant qui ne correspond pas aux enregistrements
    fournis sera supprimé de la base de données. Seuls les enregistrements
    fournis resteront (ou seront insérés).

Par défaut, l'ORM utilise la stratégie de sauvegarde ``append``.
Consultez :ref:`has-many-associations` pour plus de détails sur la définition
de ``saveStrategy``.

Quel que soit le moment où vous ajoutez de nouveaux enregistrements dans une
association existante, vous devez toujours marquer la propriété de l'association
comme 'dirty'. Cela fait savoir à l'ORM que la propriété de cette association
doit être persistée::

    $article->comments[] = $comment;
    $article->setDirty('comments', true);

Sans l'appel à ``setDirty()``, les commentaires mis à jour ne seront pas
sauvegardés.

Si vous créez une entité et voulez y attacher des enregistrements existants dans
une association hasMany ou belongsToMany, vous devez d'abord initialiser la
propriété de l'association::

    $article->comments = [];

Sans l'initialisation, l'appel à ``$article->comments[] = $comment;`` sera sans
effet.

Sauvegarder les Associations BelongsToMany
------------------------------------------

Lors de la sauvegarde d'associations hasMany, l'ORM attend un tableau d'entities
avec le nom de l'association au pluriel et
:ref:`des underscores <inflector-methods-summary>`.
Par exemple::

    // Dans un controller.
    $data = [
        'title' => 'Premier Post',
        'tags' => [
            ['tag' => 'CakePHP'],
            ['tag' => 'Framework']
        ]
    ];

    $articles = $this->getTableLocator()->get('Articles');
    $article = $articles->newEntity($data, [
        'associated' => ['Tags']
    ]);
    $articles->save($article);

Quand vous convertissez les données de la requête en entities, les méthodes
``newEntity()`` et ``newEntities()`` traiteront les deux tableaux de propriétés,
ainsi qu'une liste d'ids sous la clé ``_ids``. L'utilisation de la clé ``_ids``
permet de construire des contrôles de formulaire basés sur une liste déroulante
ou une liste de cases à cocher pour les associations belongsToMany. Consultez la
section :ref:`converting-request-data` pour plus d'informations.

Lors de la sauvegarde des associations belongsToMany, vous avez le choix entre
deux stratégies de sauvegarde:

append
    Seuls les nouveaux liens seront créés de chaque côté de cette association.
    Cette stratégie détruira pas les liens existants même s'ils sont absents du
    tableau d'entities à sauvegarder.
replace
    Lors de la sauvegarde, les liens existants seront supprimés et les nouveaux
    liens seront créés dans la table de jointure. S'il y a des liens existants
    dans la base de données vers certaines des entities que l'on souhaite
    sauvegarder, ces liens seront mis à jour, et non supprimés et
    re-sauvegardés.

Consultez :ref:`belongs-to-many-associations` pour plus de détails sur la façon
de définir ``saveStrategy``.

Par défaut, l'ORM utilise la stratégie ``replace``. Si vous ajoutez à quelque
moment que ce soit de nouveaux enregistrements dans une association existante,
vous devez toujours marquer la propriété de l'association comme 'dirty'. Cela
fait savoir à l'ORM que la propriété de l'association doit être persistée::

    $article->tags[] = $tag;
    $article->setDirty('tags', true);

Sans appel à ``setDirty()``, les tags modifiés ne seront pas sauvegardés.

Vous vous retrouverez souvent à vouloir créer une association entre deux
entities existantes, par exemple un utilisateur co-auteur d'un article. Pour
cela, utilisez la méthode ``link()``::

    $article = $this->Articles->get($articleId);
    $user = $this->Users->get($userId);

    $this->Articles->Users->link($article, [$user]);

Lors de la sauvegarde d'associations belongsToMany, il peut être pertinent de
sauvegarder des données supplémentaires dans la table de jointure. Dans
l'exemple précédent des tags, on pourrait imaginer le type de vote ``vote_type``
de la personne qui a voté sur cet article. Le ``vote_type`` peut être soit
``upvote``, soit ``downvote``, et il est représenté par une chaîne de
caractères. La relation est entre Users et Articles.

La sauvegarde de cette association et du ``vote_type`` est réalisée en ajoutant
tout d'abord des données à ``_joinData`` et en sauvegardant ensuite
l'association avec ``link()``, par exemple::

    $article = $this->Articles->get($articleId);
    $user = $this->Users->get($userId);

    $user->_joinData = new Entity(['vote_type' => $voteType], ['markNew' => true]);
    $this->Articles->Users->link($article, [$user]);

Sauvegarder des Données Supplémentaires dans la Table de Jointure
-----------------------------------------------------------------

Dans certaines situations, vous aurez des colonnes supplémentaires dans la table
de jointure de l'association BelongsToMany. Avec CakePHP, il est facile d'y
sauvegarder des propriétés. Chaque entity d'une association belongsToMany a une
propriété ``_joinData`` qui contient les colonnes supplémentaires de la
table de jointure. Ces données peuvent être soit un tableau, soit une instance
Entity. Par exemple, si les Students BelongsToMany Courses, nous pourrions avoir
une table de jointure qui ressemble à ceci::

    id | student_id | course_id | days_attended | grade

Lors de la sauvegarde de données, vous pouvez remplir les colonnes
supplémentaires de la table de jointure en définissant les données dans la
propriété ``_joinData``::

    $student->courses[0]->_joinData->grade = 80.12;
    $student->courses[0]->_joinData->days_attended = 30;

    $studentsTable->save($student);

La propriété ``_joinData`` peut être soit une entity, soit un tableau de données
si vous sauvegardez des entities construites à partir de données de la requête.
Lorsque vous sauvegardez des données de la table de jointure à partir de données
de la requête, vos données POST doivent ressembler à ceci::

    $data = [
        'first_name' => 'Sally',
        'last_name' => 'Parker',
        'courses' => [
            [
                'id' => 10,
                '_joinData' => [
                    'grade' => 80.12,
                    'days_attended' => 30
                ]
            ],
            // d'autres cours (courses).
        ]
    ];
    $student = $this->Students->newEntity($data, [
        'associated' => ['Courses._joinData']
    ]);

Consultez le chapitre sur les :ref:`inputs pour les données associées
<associated-form-inputs>` pour savoir comment construire correctement des inputs
avec le ``FormHelper``.

.. _saving-complex-types:

Sauvegarder les Types Complexes
-------------------------------

Les tables peuvent stocker des données représentées dans des types basiques,
comme des chaînes, integers, floats, booleans, etc... Mais elles peuvent
aussi être étendues pour accepter des types plus complexes comme des tableaux ou
des objets et sérialiser ces données en types plus simples qui peuvent être
sauvegardés dans la base de données.

Pour cela, vous devez utiliser le système de types personnalisés.
Consulter la section :ref:`adding-custom-database-types` pour savoir comment
construire des Types de colonnes personnalisés::

    use Cake\Database\TypeFactory;

    TypeFactory::map('json', 'Cake\Database\Type\JsonType');

    // Dans src/Model/Table/UsersTable.php

    class UsersTable extends Table
    {

        public function initialize(): void
        {
            $this->getSchema()->setColumnType('preferences', 'json');
        }

    }

Le code ci-dessus fait correspondre la colonne ``preferences`` au type
personnalisé ``json``. Cela signifie que lorsque vous récupérez des données de
cette colonne, les chaînes JSON de la base de données seront désérialisées et
insérées dans une entity sous forme de tableau.

De même, lors de la sauvegarde, le tableau sera à nouveau transformé au format
JSON::

    $user = new User([
        'preferences' => [
            'sports' => ['football', 'baseball'],
            'books' => ['Maîtriser le PHP', 'Hamlet']
        ]
    ]);
    $usersTable->save($user);

Quand vous utilisez des types complexes, il est important de vérifier que les
données que vous recevez de l'utilisateur final correspondent au bon type.
Sinon, en ne traitant pas correctement les données complexes, vous vous exposez
à ce que des utilisateurs malveillants puissent stocker des données qu'ils
n'auraient normalement pas le droit de stocker.

Strict Saving
=============

.. php:method:: saveOrFail($entity, $options = [])

L'appel à cette méthode lancera une
:php:exc:`Cake\\ORM\\Exception\\PersistenceFailedException` si:

* les règles de validation ont échoué
* l'entity contient des erreurs
* la sauvegarde a été annulée par un _callback_.

Cette méthode peut être utile pour effectuer des opérations complexes sur la
base de données sans surveillance humaine, comme lors de l'utilisation de
script via des _tasks_ Shell.

.. note::

    Si vous utilisez cette méthode dans un Controller, assurez-vous de
    capturer la ``PersistenceFailedException`` qui pourrait être levée.

Si vous voulez trouver l'entity qui n'a pas pu être sauvegardée, vous pouvez
utiliser la méthode :php:meth:`Cake\\ORM\Exception\\PersistenceFailedException::getEntity()`::

        try {
            $table->saveOrFail($entity);
        } catch (\Cake\ORM\Exception\PersistenceFailedException $e) {
            echo $e->getEntity();
        }

Dans la mesure où cette méthode utilise la méthode
:php:meth:`Cake\\ORM\\Table::save()`, tous les événements de ``save`` seront
déclenchés.

Trouver Ou Créer une Entity
===========================

.. php:method:: findOrCreate($search, $callback = null, $options = [])

Trouve un enregistrement d'après les critères de ``$search`` ou crée un nouvel
enregistrement en utilisant les propriétés de ``$search`` et en appelant la
méthode optionnelle ``$callback``. Cette méthode est idéale dans les scénarios
où vous avez besoin réduire les risque de doublons::

    $record = $table->findOrCreate(
        ['email' => 'bobbi@example.com'],
        function ($entity) use ($autresDonnees) {
            // Appelé seulement en cas de création d'un nouvel enregistrement
            $entity->name = $autresDonnees['name'];
        }
    );

Si vos conditions pour ``find`` nécessitent un tri, des associations ou des
conditions personnalisés, alors le paramètre ``$search`` peut être un _callable_
ou un objet ``Query``. Si vous utilisez un _callable_, il est censé prendre un
objet ``Query`` comme argument.

L'entité renvoyée aura été sauvegardée s'il s'agit d'un nouvel enregistrement.
Cette méthode supporte les options suivantes:

* ``atomic`` Si les opérations ``find`` et ``save`` sont censées être effectuées
  à l'intérieur d'une transaction.
* ``defaults`` Défini à ``false`` pour ne pas définir les propriétés ``$search``
  dans l'entity créée.

Créer Avec une Clé Primaire
===========================

Quand vous traitez des clés primaires UUID, vous avez souvent besoin de fournir
une valeur générée ailleurs, au lieu d'un identifiant autogénéré pour vous. Dans
ce cas, assurez-vous de ne pas passer la clé primaire au milieu des autres
données. Au lieu de cela, assignez la clé primaire puis patchez les autres
données dans l'entity::

    $record = $table->newEmptyEntity();
    $record->id = $existingUuid;
    $record = $table->patchEntity($record, $existingData);
    $table->saveOrFail($record);

Sauvegarder Plusieurs Entities
==============================

.. php:method:: saveMany($entities, $options = [])

Cette méthode vous permet de sauvegarder plusieurs entities de façon atomique.
``$entities`` peut être un tableau d'entities créées avec ``newEntities()`` /
``patchEntities()``. ``$options`` peut avoir les mêmes options que celles
acceptées par ``save()``::

    $data = [
        [
            'title' => 'Premier post',
            'published' => 1
        ],
        [
            'title' => 'Second post',
            'published' => 1
        ],
    ];

    $articles = $this->getTableLocator()->get('Articles');
    $entities = $articles->newEntities($data);
    $result = $articles->saveMany($entities);

La méthode renvoie les entities mises à jour en cas de succès, ou ``false`` en
cas d'échec.

Mises à Jour en Masse
=====================

.. php:method:: updateAll($fields, $conditions)

Il y a des cas où la mise à jour de lignes individuelles n'est pas efficace ni
nécessaire. Dans ce cas, il est préférable d'utiliser une mise à jour en masse
pour modifier plusieurs lignes en une fois, en assignant les nouvelles valeurs
des champs et les conditions de mise à jour::

    // Publie tous les articles non publiés.
    function publishAllUnpublished()
    {
        $this->updateAll(
            [  // champs
                'published' => true,
                'publish_date' => FrozenTime::now()
            ],
            [  // conditions
                'published' => false
            ]
        );
    }

Si vous devez faire des mises à jour en masse et utiliser des expressions SQL,
vous devrez utiliser un objet expression puisque ``updateAll()`` utilise des
requêtes préparées sous le capot::

    use Cake\Database\Expression\QueryExpression;

    ...

    function incrementCounters()
    {
        $expression = new QueryExpression('view_count = view_count + 1');
        $this->updateAll([$expression], ['published' => true]);
    }

Une mise à jour en masse sera considérée comme réussie si une ou plusieurs
lignes sont mises à jour.

.. warning::

    updateAll *ne* va *pas* déclencher d'events beforeSave/afterSave. Si vous
    avez besoin de ceux-ci, chargez d'abord une collection d'enregistrements et
    mettez les à jour.

``updateAll()`` est seulement une fonction de commodité. Vous pouvez également
utiliser cette interface plus flexible::

    // Publication de tous les articles non publiés.
    function publishAllUnpublished()
    {
        $this->query()
            ->update()
            ->set(['published' => true])
            ->where(['published' => false])
            ->execute();
    }

Reportez-vous à la section :ref:`query-builder-updating-data`.
