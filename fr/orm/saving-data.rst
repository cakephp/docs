Sauvegarder les Donnnées
########################

.. php:namespace:: Cake\ORM

.. php:class:: Table

Après avoir :doc:`chargé vos données</orm/retrieving-data-and-resultsets>` vous
voulez probablement mettre à jour & sauvegarder les changements.

.. _converting-request-data:

Convertir les Données de Request en Entities
============================================

Avant de modifier et sauvegarder les données à nouveau dans la base de données,
vous devrez convertir les données de request à partir du format de tableau
qui se trouve dans la request, et les entities que l'ORM utilise. La classe
Table est un moyen facile de convertir une ou plusieurs entities à partir de
données de request. Vous pouvez convertir une entity unique en utilisant::

    // Dans un controller.
    $articles = TableRegistry::get('Articles');
    $entity = $articles->newEntity($this->request->data());

Les données de request doivent suivre la structure de vos entities. Par exemple
si vous avez un article, qui appartient à un utilisateur, et avez plusieurs
commentaires, vos données de request devraient ressembler à ceci::

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

Si vous sauvegardez des associations belongsToMany, vous pouvez soit utiliser
une liste de données d'entity ou une liste d'ids. Quand vous utilisez une
liste de données d'entity, vos données de request devraient ressembler à ceci::

    $data = [
        'title' => 'My title',
        'body' => 'The text',
        'user_id' => 1,
        'tags' => [
            ['tag' => 'CakePHP'],
            ['tag' => 'Internet'],
        ]
    ];

Quand vous utilisez une liste d'ids, vos données de request devraient ressembler
à ceci::

    $data = [
        'title' => 'My title',
        'body' => 'The text',
        'user_id' => 1,
        'tags' => [
            '_ids' => [1, 2, 3, 4]
        ]
    ];

Le marshaller va gérer ces deux formulaires correctement, mais seulement pour
des associations belongsToMany.

Lors de la construction de formulaires qui sauvegardent des associations
imbriquées, vous devez définir quelles associations doivent être marshalled::

    // Dans un controller
    $articles = TableRegistry::get('Articles');
    $entity = $articles->newEntity($this->request->data(), [
        'associated' => [
            'Tags', 'Comments' => ['associated' => ['Users']]
        ]
    ]);

Ce qui est au-dessus indique que les 'Tags', 'Comments' et 'Users' pour les
Comments doivent être marshalled. D'une autre façon, vous pouvez utiliser
la notation par point pour être plus bref::

    // Dans un controller.
    $articles = TableRegistry::get('Articles');
    $entity = $articles->newEntity($this->request->data(), [
        'associated' => ['Tags', 'Comments.Users']
    ]);

Vous pouvez convertir plusieurs entities en utilisant::

    // Dans un controller.
    $articles = TableRegistry::get('Articles');
    $entities = $articles->newEntities($this->request->data());

Lors de la conversion de plusieurs entities, les données de request pour
plusieurs articles devrait ressembler à ceci::

    $data = [
        [
            'title' => 'First post',
            'published' => 1
        ],
        [
            'title' => 'Second post',
            'published' => 1
        ],
    ];

Il est également possible de permettre à ``newEntity()`` d'écrire dans des champs non accessibles.
Par exemple, ``id`` est générallement absent de la propriété ``_accessible``.
Dans ce cas, vous pouvez utiliser l'option ``accessibleFields``. Cela est particulièrement intéressant 
pour conserver les associations existantes entre certaines entités::

    // Dans un controller.
    $articles = TableRegistry::get('Articles');
    $entity = $articles->newEntity($this->request->data(), [
        'associated' => [
            'Tags', 'Comments' => [
                'associated' => [
                    'Users' => [
                        'accessibleFields' => ['id' => true]
                    ]
                ]
            ]
        ]
    ]);

Le code ci-dessus permet de conserver l'association entre Comments et Users pour l'entité concernée.

Une fois que vous avez converti des données de request dans des entities, vous
pouvez leur faire un ``save()`` ou un ``delete()``::

    // Dans un controller.
    foreach ($entities as $entity) {
        // Save entity
        $articles->save($entity);

        // Supprime l'entity
        $articles->delete($entity);
    }

Ce qui est au-dessus va lancer une transaction séparée pour chaque entity
sauvegardée. Si vous voulez traiter toutes les entities en transaction unique,
vous pouvez utiliser ``transactional()``::

    // Dans un controller.
    $articles->connection()->transactional(function () use ($articles, $entities) {
        foreach ($entities as $entity) {
            $articles->save($entity, ['atomic' => false]);
        }
    });

.. note::

    Si vous utilisez newEntity() et il manque quelques unes ou toutes les
    données des entities résultants, vérifiez deux fois que les colonnes que
    vous souhaitez définir sont listées dans la propriété ``$_accessible``
    de votre entity.

Fusionner les Données de Request dans des Entities
--------------------------------------------------

Afin de mettre à jour les entities, vous pouvez choisir d'appliquer des données
de request directement dans une entity existante. Ceci a l'avantage que seuls les
champs qui changent réellement seront sauvegardés, au lieu d'envoyer tous les champs
à la base de donnée, même ceux qui sont identiques. Vous pouvez fusionner
un tableau de données brutes dans une entity existante en utilisant la méthode
``patchEntity``::

    // Dans un controller.
    $articles = TableRegistry::get('Articles');
    $article = $articles->get(1);
    $articles->patchEntity($article, $this->request->data());
    $articles->save($article);

Comme expliqué dans la section précédente, les données de request doivent suivre
la structure de votre entity. La méthode ``patchEntity`` est également capable
de fusionner les associations, par défaut seul les premiers niveaux
d'associations sont fusionnés mais si vous voulez contrôler la liste des
associations à fusionner ou fusionner des niveaux de plus en plus profonds, vous
pouvez utiliser le troisième paramètre de la méthode::

    // Dans un controller.
    $article = $articles->get(1);
    $articles->patchEntity($article, $this->request->data(), [
        'associated' => ['Tags', 'Comments.Users']
    ]);
    $articles->save($article);

Les associations sont fusionnées en faisant correspondre le champ de clé
primaire dans la source entities avec les champs correspondants dans le tableau
de données. Pour des associations belongsTo et hasOne, les nouvelles entities
seront construites si aucune entity précédente n'est trouvé pour la propriété
cible.

Pa exemple, donnez des données de request comme ce qui suit::

    $data = [
        'title' => 'My title',
        'user' => [
            'username' => 'mark'
        ]
    ];

Essayer de faire un patch d'une entity sans entity dans la propriété user va
créer une nouvelle entity user::

    // Dans un controller.
    $entity = $articles->patchEntity(new Article, $data);
    echo $entity->user->username; // Echoes 'mark'

La même chose peut être dite pour les associations hasMany et belongsToMany,
mais une importante note doit être faîte.

.. note::

    Pour les associations hasMany et belongsToMany, s'il y avait des entities
    qui ne pouvaient pas correspondre avec leur clé primaire à aucun
    enregistrement dans le tableau de données, alors ces enregistrements
    seraient annulés de l'entity résultante.

    Rappelez-vous que l'utilisation soit de ``patchEntity()`` ou
    ``patchEntities()`` ne fait pas persister les données, il modifie juste
    (ou créé) les entities données. Afin de sauvegarder l'entity, vous devrez
    appeler la méthode ``save()``.

Par exemple, considérons le cas suivant::

    $data = [
        'title' => 'My title',
        'body' => 'The text',
        'comments' => [
            ['body' => 'First comment', 'id' => 1],
            ['body' => 'Second comment', 'id' => 2],
        ]
    ];
    $entity = $articles->newEntity($data);

    $newData = [
        'comments' => [
            ['body' => 'Changed comment', 'id' => 1],
            ['body' => 'A new comment'],
        ]
    ];
    $articles->patchEntity($entity, $newData);
    $articles->save($article);

A la fin, si l'entity est à nouveau convertie en tableau, vous obtiendrez le
résultat suivant::

    [
        'title' => 'My title',
        'body' => 'The text',
        'comments' => [
            ['body' => 'Changed comment', 'id' => 1],
            ['body' => 'A new comment'],
        ]
    ];

Comme vous l'avez vu, le commentaire avec l'id 2 n'est plus ici, puisqu'il ne
correspondait à rien dans le tableau ``$newData``. Ceci est fait ainsi pour
mieux capturer l'intention du post des données de request. Les données envoyées
reflètent le nouvel état que l'entity doit avoir.

Des avantages supplémentaires à cette approche sont qu'elle réduit le nombre
d'opérations à exécuter quand on fait persister l'entity à nouveau.

Notez bien que ceci ne signifie pas que le commentaire avec l'id 2 a été
supprimé de la base de données, si vous souhaitez retirer les commentaires pour
cet article qui ne sont pas présents dans l'entity, vous pouvez collecter
les clés primaires et exécuter une suppression batch pour celles qui ne sont
pas dans la liste::

    // Dans un controller.
    $comments = TableRegistry::get('Comments');
    $present = (new Collection($entity->comments))->extract('id');
    $comments->deleteAll([
        'article_id' => $article->id,
        'id NOT IN' => $present
    ]);

Comme vous pouvez le voir, ceci permet aussi de créer des solutions lorsqu'une
association a besoin d'être implémentée comme un ensemble unique.

Vous pouvez aussi faire un patch de plusieurs entities en une fois. Les
considérations faîtes pour les associations hasMany et belongsToMany
s'appliquent pour le patch de plusieurs entities: Les correspondances sont
faites avec la valeur du champ de la clé primaire et les correspondances
manquantes dans le tableau original des entities seront retirées et non
présentes dans les résultats::

    // Dans un controller.
    $articles = TableRegistry::get('Articles');
    $list = $articles->find('popular')->toArray();
    $patched = $articles->patchEntities($list, $this->request->data());
    foreach ($patched as $entity) {
        $articles->save($entity);
    }

De la même façon que pour l'utilisation de ``patchEntity()``, vous pouvez utiliser
le troisième argument pour controller les associations qui seront fusionnées
dans chacune des entities du tableau::

    // Dans un controller.
    $patched = $articles->patchEntities(
        $list,
        $this->request->data(),
        ['associated' => ['Tags', 'Comments.Users']]
    );

De la même façon que pour l'utilisation de ``newEntity()``, vous pouvez permettre à ``patchEntity()`` 
d'écrire dans des champs non accessibles comme ``id``, qui n'est généralement pas déclaré dans la propriété
``_accessible``::

    // Dans un controller.
    $patched = $articles->patchEntities(
        $list,
        $this->request->data(),
        ['associated' => [
                'Tags', 
                'Comments.Users' => [
                    'accessibleFields' => ['id' => true],
                ]
            ]
        ]
    );


.. _before-marshal:

Modifier les Données de Request Avant de Construire les Entities
----------------------------------------------------------------

Si vous devez modifier les données de request avant qu'elles ne soient
converties en entities, vous pouvez utiliser l'event ``Model.beforeMarshal``.
Cet event vous laisse manipuler les données de request juste avant que les
entities ne soient créées::

    // Dans une classe table ou behavior
    public function beforeMarshal(Event $event, ArrayObject $data, ArrayObject $options)
    {
        $data['username'] .= 'user';
    }

Le paramètre ``$data`` est une instance ``ArrayObject``, donc vous n'avez pas
à la retourner pour changer les données utilisées pour créer les entities.

.. _validating-request-data:

Valider les Données Avant de Construire les Entities
----------------------------------------------------

Durant la transformation des données en entities, vous pouvez valider les
données. La validation des données vous permet de vérifier le type, la forme et
la taille des données. Par défaut les données de request seront validées avant
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
   ``validationDefault``.
4. L'event ``Model.buildValidator`` va être déclenché.
5. Les données de Request vont être validées.
6. Les données de Request vont être castées en types qui correspondent
   aux types de colonne.
7. Les erreurs vont être définies dans l'entity.
8. Les données valides vont être définies dans l'entity, alors que les champs
   qui échouent la validation seront laissés de côté.

Si vous voulez désactiver la validation lors de la conversion des données de
request, définissez l'option ``validate`` à false::

    $article = $articles->newEntity(
        $this->request->data,
        ['validate' => false]
    );

En plus de désactiver la validation, vous pouvez choisir l'ensemble de règle de
validation que vous souhaitez appliquer::

    $articles->save($article, ['validate' => 'update']);

Ce qui est au-dessus va appeler la méthode ``validationUpdate`` sur l'instance
table pour construire les règles requises. Par défaut la méthode
``validationDefault`` sera utilisée. Un exemple de méthode de validator pour
notre Table articles serait::

    class ArticlesTable extends Table
    {
        public function validationUpdate($validator)
        {
            $validator
                ->add('title', 'notEmpty', [
                    'rule' => 'notEmpty',
                    'message' => __('You need to provide a title'),
                ])
                ->add('body', 'notEmpty', [
                    'rule' => 'notEmpty',
                    'message' => __('A body is required')
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
2. Les méthodes sur une classe entity, sont disponibles sur le provider
   ``entity``.
3. La classe de :php:class:`~Cake\\Validation\\Validation` du coeur est
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
                    'message' => __('You need to provide a valid role'),
                    'provider' => 'entity',
                ]);
            return $validator;
        }

    }

Eviter les Attaques d'Assignement en Masse de Propriété
-------------------------------------------------------

Lors de la création ou la fusion des entities à partir des données de request,
vous devez faire attention à ce que vous autorisez à changer ou à ajouter
dans les entities à vos utilisateurs. Par exemple, en envoyant un tableau
dans la request contenant ``user_id``, un pirate pourrait changer le
propriétaire d'un article, ce qui entraînerait des effets indésirables::

    // Contient ['user_id' => 100, 'title' => 'Hacked!'];
    $data = $this->request->data;
    $entity = $this->patchEntity($entity, $data);
    $this->save($entity);

Il y a deux façons de se protéger pour ce problème. La première est de définir
les colonnes par défaut qui peuvent être définies en toute sécurité à partir
d'une request en utilisant la fonctionnalité d':ref:`entities-mass-assignment`
dans les entities.

La deuxième façon est d'utiliser l'option ``fieldList`` lors de la création ou
la fusion de données dans une entity::

    // Contient ['user_id' => 100, 'title' => 'Hacked!'];
    $data = $this->request->data;

    // Permet seulement pour au title d'être changé
    $entity = $this->patchEntity($entity, $data, [
        'fieldList' => ['title']
    ]);
    $this->save($entity);

Vous pouvez aussi contrôler les propriétés qui peuvent être assignées pour les
associations::

    // Permet seulement le changement de title et de tags
    // et le nom du tag est la seule colonne qui peut être définie
    $entity = $this->patchEntity($entity, $data, [
        'fieldList' => ['title', 'tags'],
        'associated' => ['Tags' => ['fieldList' => ['name']]]
    ]);
    $this->save($entity);

Utiliser cette fonctionnalité est pratique quand vous avez différentes fonctions
auxquelles vos utilisateurs peuvent accéder et que vous voulez laisser vos
utilisateurs modifier différentes données basées sur leurs privilèges.

L'option ``fieldList`` est aussi acceptée par les méthodes ``newEntity()``,
``newEntities()`` et ``patchEntitites()``.

.. _saving-entities:

Sauvegarder les Entities
========================

.. php:method:: save(Entity $entity, array $options = [])

Quand vous sauvegardez les données de request dans votre base de données, vous
devez d'abord hydrater une nouvelle entity en utilisant ``newEntity()`` pour
passer dans ``save()``. Pare exemple::

  // Dans un controller
  $articles = TableRegistry::get('Articles');
  $article = $articles->newEntity($this->request->data);
  if ($articles->save($article)) {
      // ...
  }

L'ORM utilise la méthode ``isNew()`` sur une entity pour déterminer si oui ou
non une insertion ou une mise à jour doit être faite. Si la méthode
``isNew()`` retourne ``true`` et que l'entity a une valeur de clé primaire,
une requête 'exists' sera faîte. La requête 'exists' peut être supprimée en
passant ``'checkExisting' => false`` à l'argument ``$options`` ::

    $articles->save($article, ['checkExisting' => false]);

Une fois que vous avez chargé quelques entities, vous voudrez probablement les
modifier et les mettre à jour dans votre base de données. C'est un exercice
simple dans CakePHP::

    $articles = TableRegistry::get('Articles');
    $article = $articles->find('all')->where(['id' => 2])->first();

    $article->title = 'My new title';
    $articles->save($article);

Lors de la sauvegarde, CakePHP va
:ref:`appliquer vos règles de validation <application-rules>`, et
entourer l'opération de sauvegarde dans une transaction de base de données.
Cela va aussi seulement mettre à jour les propriétés qui ont changé. Le
``save()`` ci-dessus va générer le code SQL suivant::

    UPDATE articles SET title = 'My new title' WHERE id = 2;

Si vous avez une nouvelle entity, le code SQL suivant serait généré::

    INSERT INTO articles (title) VALUES ('My new title');

Quand une entity est sauvegardée, voici ce qui se passe:

1. La vérification des règles commencera si elle n'est pas désactivée.
2. La vérification des règles va déclencher l'événement
   ``Model.beforeRules``. Si l'événement est stoppé, l'opération de
   sauvegarde va connaitre un échec et retourner ``false``.
3. Les règles seront vérifiées. Si l'entity est en train d'être créée, les
   règles ``create`` seront utilisées. Si l'entity est en train d'être mise à
   jour, les règles ``update`` seront utilisées.
4. L'événement ``Model.afterRules`` sera déclenché.
5. L'événement ``Model.beforeSave`` est dispatché. S'il est stoppé, la
   sauvegarde sera annulée, et save() va retourner ``false``.
6. Les associations parentes sont sauvegardées. Par exemple, toute association
   belongsTo listée sera sauvegardée.
7. Les champs modifiés sur l'entity seront sauvegardés.
8. Les associations Enfant sont sauvegardées. Par exemple, toute association
   hasMany, hasOne, ou belongsToMany listée sera sauvegardée.
9. L'événement ``Model.afterSave`` sera dispatché.

Consultez la section :ref:`application-rules` pour plus d'informations sur la
création et l'utilisation des règles.

.. warning::

    Si aucun changement n'est fait à l'entity quand elle est sauvegardée, les
    callbacks ne vont pas être déclenchés car aucune sauvegarde n'est faîte.

La méthode ``save()`` va retourner l'entity modifiée en cas de succès, et
``false`` en cas d'échec. Vous pouvez désactiver les règles et/ou les
transactions en utilisant l'argument ``$options`` pendant la sauvegarde::

    // Dans un controller ou une méthode de table.
    $articles->save($article, ['validate' => false, 'atomic' => false]);

Sauvegarder les Associations
----------------------------

Quand vous sauvegardez une entity, vous pouvez aussi choisir d'avoir quelques
unes ou toutes les entities associées. Par défaut, toutes les entities de
premier niveau seront sauvegardées. Par exemple sauvegarder un Article, va
aussi automatiquement mettre à jour tout entity dirty qui n'est pas directement
liée à la table articles.

Vous pouvez régler finement les associations qui sont sauvegardées en
utilisant l'option ``associated``::

    // Dans un controller.

    // Sauvegarde seulement l'association avec les commentaires
    $articles->save($entity, ['associated' => ['Comments']);

Vous pouvez définir une sauvegarde distante ou des associations imbriquées
profondément en utilisant la notation par point::

    // Sauvegarde la company, les employees et les addresses liées pour chacun d'eux.
    $companies->save($entity, ['associated' => ['Employees.Addresses']]);

Si vous avez besoin de lancer un ensemble de règle de validation différente pour
une association, vous pouvez le spécifier dans un tableau d'options pour
l'association::

    // Dans un controller.

    // Sauvegarde la company, les employees et les addresses liées pour chacun d'eux.
    // Pour les employees, utilisez le groupe de validation 'special'
    $companies->save($entity, [
      'associated' => [
        'Employees' => [
          'associated' => ['Addresses'],
          'validate' => 'special',
        ]
      ]
    ]);

En plus, vous pouvez combiner la notation par point pour les associations avec
le tableau d'options::

    $companies->save($entity, [
      'associated' => [
        'Employees',
        'Employees.Addresses' => ['validate' => 'special']
      ]
    ]);

Vos entities doivent être structurées de la même façon qu'elles l'étaient
quand elles ont été chargées à partir de la base de données.
Consultez la documentation du helper Form pour savoir comment
:ref:`associated-form-inputs`.

Sauvegarder les Associations BelongsTo
--------------------------------------

Lors de la sauvegarde des associations belongsTo, l'ORM s'attend à une entity
imbriquée unique avec le nom de l'association au singulier, en camel case.
Par exemple::

    // Dans un controller.
    $data = [
        'title' => 'First Post',
        'user' => [
            'id' => 1,
            'username' => 'mark'
        ]
    ];
    $articles = TableRegistry::get('Articles');
    $article = $articles->newEntity($data, [
        'associated' => ['Users']
    ]);

    $articles->save($article);

Sauvegarder les Associations HasOne
-----------------------------------

Lors de la sauvegarde d'associations hasOne, l'ORM s'attend à une entity
imbriquée unique avec le nom de l'association au singulier et en camel case.
Par exemple::

    // Dans un controller.
    $data = [
        'id' => 1,
        'username' => 'cakephp',
        'profile' => [
            'twitter' => '@cakephp'
        ]
    ];
    $users = TableRegistry::get('Users');
    $user = $users->newEntity($data, [
        'associated' => ['Profiles']
    ]);
    $users->save($user);

Sauvegarder les Associations HasMany
------------------------------------

Lors de la sauvegarde d'associations hasMany, l'ORM s'attend à une entity
imbriquée unique avec le nom de l'association au pluriel et en camel case.
Par exemple::

    // Dans un controller.
    $data = [
        'title' => 'First Post',
        'comments' => [
            ['body' => 'Best post ever'],
            ['body' => 'I really like this.']
        ]
    ];
    $articles = TableRegistry::get('Articles');
    $article = $articles->newEntity($data, [
        'associated' => ['Comments']
    ]);
    $articles->save($article);

Lors de la sauvegarde d'associations hasMany, les enregistrements associés
seront soit mis à jour, soit insérés. L'ORM ne va pas retirer ou 'sync' une
association hasMany. Peu importe quand vous ajoutez de nouveaux
enregistrements dans une association existante, vous devez toujours marquer la
propriété de l'association comme 'dirty'. Ceci dit à l'ORM que la propriété de
l'association doit persister::

    $article->comments[] = $comment;
    $article->dirty('comments', true);

Sans l'appel à ``dirty()``, les commentaires mis à jour ne seront pas
sauvegardés.

Sauvegarder les Associations BelongsToMany
------------------------------------------

Lors de la sauvegarde d'associations hasMany, l'ORM s'attend à une entity
imbriquée unique avec le nom de l'association au pluriel et en camel case.
Par exemple::

    // Dans un controller.
    $data = [
        'title' => 'First Post',
        'tags' => [
            ['tag' => 'CakePHP'],
            ['tag' => 'Framework']
        ]
    ];
    $articles = TableRegistry::get('Articles');
    $article = $articles->newEntity($data, [
        'associated' => ['Tags']
    ]);
    $articles->save($article);

Quand vous convertissez les données de request en entities, les méthodes
``newEntity`` et ``newEntities`` vont gérer les deux tableau de propriétés,
ainsi qu'une liste d'ids avec la clé ``_ids``. Utiliser la clé ``_ids``
facilite lac construction d'un box select ou d'un checkbox basé sur les
contrôles pour les associations belongs to many. Consultez la section
:ref:`converting-request-data` pour plus d'informations.

Lors de la sauvegarde des associations belongsToMany, vous avez le choix entre
2 stratégies de sauvegarde:

append
    Seuls les nouveaux liens seront créés entre chaque côté de cette
    association. Cette stratégie ne va pas détruire les liens existants même
    s'ils ne sont pas présents dans le tableau d'entities à sauvegarder.
replace
    Lors de la sauvegarde, les liens existants seront retirés et les nouveaux
    liens seront créés dans la table de jointure. S'il y a des liens existants
    dans la base de données vers certaines entities que l'on souhaite
    sauvegarder, ces liens seront mis à jour, non supprimés et re-sauvegardés.

Par défaut la stratégie ``replace`` est utilisée. Quand vous avez de nouveaux
enregistrements dans une association existante, vous devez toujours marquer
la propriété de l'association en 'dirty'. Ceci dit à l'ORM que la propriété
de l'association doit persister::

    $article->tags[] = $tag;
    $article->dirty('tags', true);

Sans appel à ``dirty()``, les tags mis à jour ne seront pas sauvegardés.

Sauvegarder des Données Supplémentaires à la Table de Jointure
--------------------------------------------------------------

Dans certaines situations, la table de jointure de l'association BelongsToMany,
aura des colonnes supplémentaires. CakePHP facilite la sauvegarde des
propriétés dans ces colonnes. Chaque entity dans une association belongsToMany
a une propriété ``_joinData`` qui contient les colonnes supplémentaires sur la
table de jointure. Ces données peuvent être soit un tableau, soit une instance
Entity. Par exemple si les Students BelongsToMany Courses, nous pourrions
avoir une table de jointure qui ressemble à ceci::

    id | student_id | course_id | days_attended | grade

Lors de la sauvegarde de données, vous pouvez remplir les colonnes
supplémentaires sur la table de jointure en définissant les données dans la
propriété ``_joinData``::

    $student->courses[0]->_joinData->grade = 80.12;
    $student->courses[0]->_joinData->days_attended = 30;

    $studentsTable->save($student);

La propriété ``_joinData`` peut être soit une entity, soit un tableau de données
si vous sauvegardez les entities construites à partir de données de
request. Lorsque vous sauvegardez des données de tables jointes depuis les données
de requête, vos données POST doivent ressembler à ceci::

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

Regardez le chapitre sur les :ref:`inputs pour les données associées
<associated-form-inputs>` pour savoir comment construire des inputs avec
le ``FormHelper`` correctement.

.. _saving-complex-types:

Sauvegarder les Types Complexes
-------------------------------

Les tables peuvent stocker des données représentées dans des types basiques,
comme les chaînes, les integers, floats, booleans, etc... Mais elles peuvent
aussi être étendues pour accepter plus de types complexes comme les tableaux
ou les objets et sérialiser ces données en types plus simples qui peuvent
être sauvegardés dans la base de données.

Cette fonctionnalité se fait en utilisant le système personnalisé de types.
Consulter la section :ref:`adding-custom-database-types` pour trouver comment
construire les Types de colonne personnalisés::

    // Dans config/bootstrap.php
    use Cake\Database\Type;
    Type::map('json', 'App\Database\Type\JsonType');

    // Dans src/Model/Table/UsersTable.php
    use Cake\Database\Schema\Table as Schema;

    class UsersTable extends Table
    {

        protected function _initializeSchema(Schema $schema)
        {
            $schema->columnType('preferences', 'json');
            return $schema;
        }

    }

Le code ci-dessus correspond à la colonne ``preferences`` pour le type
personnalisé ``json``.
Cela signifie que quand on récupère des données pour cette colonne, elles seront
désérialisées à partir d'une chaîne JSON dans la base de données et mises
dans une entity en tant que tableau.

Comme ceci, lors de la sauvegarde, le tableau sera transformé à nouveau en sa
représentation JSON::

    $user = new User([
        'preferences' => [
            'sports' => ['football', 'baseball'],
            'books' => ['Mastering PHP', 'Hamlet']
        ]
    ]);
    $usersTable->save($user);

Lors de l'utilisation de types complexes, il est important de vérifier que les
données que vous recevez de l'utilisateur final sont valides. Ne pas
gérer correctement les données complexes va permettre à des
utilisateurs mal intentionnés d'être capable de stocker des données qu'ils ne
pourraient pas stocker normalement.

.. _application-rules:

Appliquer des Règles pour l'Application
=======================================

Alors qu'une validation basique des données est faite quand :ref:`les données
de requêtes sont converties en entities <validating-request-data>`, de
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
méthode ``buildRules`` dans votre classe de table. Les behaviors et les autres
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

Mises à Jour en Masse
=====================

.. php:method:: updateAll($fields, $conditions)

Il peut arriver que la mise à jour de lignes individuellement n'est pas
efficace ou pas nécessaire. Dans ces cas, il est plus efficace d'utiliser une
mise à jour en masse pour modifier plusieurs lignes en une fois::

    // Publie tous les articles non publiés.
    function publishAllUnpublished()
    {
        $this->updateAll(['published' => true], ['published' => false]);
    }

Si vous devez faire des mises à jour en masse et utiliser des expressions SQL,
vous devrez utiliser un objet expression puisque ``updateAll()`` utilise
des requêtes préparées sous le capot::

    function incrementCounters()
    {
        $expression = new QueryExpression('view_count = view_count + 1');
        $this->updateAll([$expression], ['published' => true]);
    }

Une mise à jour en masse sera considérée comme un succès si 1 ou plusieurs
lignes sont mises à jour.

.. warning::

    updateAll *ne* va *pas* déclencher d'événements beforeSave/afterSave. Si
    vous avez besoin de ceux-ci, chargez d'abord une collection
    d'enregistrements et mettez les à jour.
