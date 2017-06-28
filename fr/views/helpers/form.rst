Form
####

.. php:namespace:: Cake\View\Helper

.. php:class:: FormHelper(View $view, array $config = [])

Le FormHelper prend en charge la plupart des opérations lourdes de la création
de formulaire. Le FormHelper se concentre sur la possibilité de créer des
formulaires rapidement, d'une manière qui permettra de rationaliser la
validation, la re-population et la mise en page (layout). Le FormHelper est
aussi flexible - Il va faire à peu près tout pour vous en utilisant les
conventions, ou vous pouvez utiliser des méthodes spécifiques pour ne prendre
uniquement que ce dont vous avez besoin.

Création de Formulaire
======================

.. php:method:: create(mixed $context = null, array $options = [])

* ``$context`` - Le contexte pour lequel le formulaire est créé. Cela peut être
  une Entity de l'ORM, un retour (ResultSet) de l'ORM, un tableau de meta-données
  ou ``false/null`` (dans le cas où vous créez un formulaire qui ne serait lié à
  aucun Model).
* ``$options`` - Un tableau d'options et / ou d'attributs HTML.

La première méthode que vous aurez besoin d'utiliser pour tirer pleinement
profit du FormHelper est ``create()``. Cette méthode affichera une balise
d'ouverture de formulaire.

Tous les paramètres sont optionnels. Si ``create()`` est appelée sans paramètre,
CakePHP supposera que vous voulez créer un formulaire en rapport avec le
controller courant, via l'URL actuelle. Par défaut, la méthode de soumission par
des formulaires est POST. Si vous appelez ``create()`` dans une vue pour
``UsersController::add()``, vous verrez la sortie suivante dans la vue:

.. code-block:: html

    <form method="post" action="/users/add">

L'argument ``$context`` est utilisé comme 'context' du formulaire. Il y a
plusieurs contextes de formulaires intégrés et vous pouvez ajouter les vôtres,
ce que nous allons voir dans la prochaine section. Ceux intégrés correspondent
aux valeurs suivantes de ``$context``:

* Une instance ``Entity`` ou un iterateur qui mappe vers
  `EntityContext <https://api.cakephp.org/3.x/class-Cake.View.Form.EntityContext.html>`_;
  ce contexte permet au FormHelper de fonctionner avec les retours de l'ORM.

* Un tableau contenant la clé ``schema``, qui mappe vers
  `ArrayContext <https://api.cakephp.org/3.x/class-Cake.View.Form.ArrayContext.html>`_
  ce qui vous permet de créer des structures simples de données pour construire
  des formulaires.

* ``null`` et ``false`` mappe vers
  `NullContext <https://api.cakephp.org/3.x/class-Cake.View.Form.NullContext.html>`_;
  cette classe de contexte satisfait simplement l'interface requise par FormHelper.
  Ce contexte est utile si vous voulez construire un formulaire court qui ne nécessite
  pas de persistance via l'ORM.

Toutes les classes de contexte ont aussi un accès aux données requêtées,
facilitant la construction des formulaires.

Une fois qu'un formulaire a été créé avec un contexte, tous les inputs que vous
créez vont utiliser le contexte actif. Dans le cas d'un formulaire basé sur
l'ORM, FormHelper peut accéder aux données associées, aux erreurs de validation
et aux metadata du schema rendant la construction de formulaires simples. Vous
pouvez fermer le contexte actif en utilisant la méthode ``end()``, ou en
appelant ``create()`` à nouveau. Pour créer un formulaire pour une entity,
faîtes ce qui suit::

    // Si vous êtes sur /articles/add
    // $article devra être une entity Article vide .
    echo $this->Form->create($article);

Affichera:

.. code-block:: html

    <form method="post" action="/articles/add">

Celui-ci va POSTer les données de formulaire à l'action ``add()`` de
``ArticlesController``. Cependant, vous pouvez utiliser la même logique pour
créer un formulaire d'édition. Le FormHelper utilise l'objet ``Entity`` pour
détecter automatiquement s'il faut créer un formulaire d'ajout (add) ou un
d'édition (edit). Si l'entity fournie n'est pas 'nouvelle', le form va être créé
comme un formulaire d'édition.

Par exemple, si nous naviguons vers **http://example.org/articles/edit/5**,
nous pourrions faire ce qui suit::

    // src/Controller/ArticlesController.php:
    public function edit($id = null)
    {
        if (empty($id)) {
            throw new NotFoundException;
        }
        $article = $this->Articles->get($id);
        // Logique d'enregistrement
        $this->set('article', $article);
    }

    // View/Articles/edit.ctp:
    // Si $article->isNew() est false, nous aurons un formulaire d'édition
    <?= $this->Form->create($article) ?>

Affichera:

.. code-block:: html

    <form method="post" action="/articles/edit/5">
    <input type="hidden" name="_method" value="PUT" />

.. note::

    Puisque c'est un formulaire d'édition, un champ input caché est généré
    pour surcharger la méthode HTTP par défaut.

Options for Form Creation
-------------------------

Le tableau ``$options`` est là où la configuration du formulaire se passe. Ce
tableau spécial peut contenir un certain nombre de paires de clé-valeur
différentes qui affectent la façon dont la balise form est générée. Voici les
valeurs autorisés :

* ``'type'`` - Vous permet de choisir le type de formulaire à créer. Si vous ne
  fournissez pas de type, il sera automatiquement détecté en fonction du 'context'
  du formulaire. Cette option peut prendre une des valeurs suivantes :

  * ``'get'`` - Définira la ``method`` du formulaire à GET.
  * ``'file'`` - Définira la ``method`` du formulaire à POST et le ``'enctype'``
    à "multipart/form-data".
  * ``'post'`` - Définira la ``method`` à POST.
  * ``'put', 'delete', 'patch'`` - Définira le verbe HTTP à, respectivement, PUT,
    DELETE ou PATCH quand le formulaire sera soumis.

* ``'method'`` - Vous permet de définir explicitement la ``method`` du formulaire.
  Les valeurs autorisés sont les même que pour le paramètre ci-dessus.

* ``'url'`` - Permet de spécifier l'URL à laquelle le formulaire postera les données.
  Peut être une chaîne ou un tableau de paramètre d'URL.

* ``'encoding'`` - Permet de définir l'attribut ``accept-charset`` du formulaire.
  Par défaut, la valeur de ``Configure::read('App.encoding')`` sera utilisée.

* ``'enctype'`` - Vous permet de définir l'encodage du formulaire de manière
  explicite.

* ``'templates'`` - Les templates pour les éléments à utiliser pour ce formulaire.
  Tous les templates fournis écraseront les templates déjà chargés. Ce paramètre
  peut soit être un nom de fichier (sans extension) du dossier ``/config`` ou un
  tableau de templates.

* ``'context'`` - Options supplémentaires qui seront fournies à la classe de
  'context' liée au formulaire. (Par exemple, le 'context' ``EntityContext``
  accepte une option ``table`` qui permet de définir la classe Table sur
  laquelle le formulaire devra se baser.

* ``'idPrefix'`` - Préfixe à utiliser pour les attributs ``id`` des éléments du
  formulaire.

* ``'templateVars'`` - Vous permet de définir des variables de template pour le
  template ``formStart``.

.. tip::

    Vous pouvez, en plus des options définies ci-dessus, définir dans l'argument
    ``$options``, tous les attributs HTML que vous pourriez vouloir passer à
    l'élément ``form`` (des classes, des attributs ``data``, etc.).

.. _form-values-from-query-string:

Récupérer les valeurs du formulaire depuis la query string
----------------------------------------------------------

.. versionadded:: 3.4.0

Les sources de valeurs du FormHelper définissent d'où les éléments du
formulaire reçoivent leurs valeurs.

Par défaut, Formhelper récupère ses valeurs depuis le "context". Les contextes
par défaut, comme le ``EntityContext``, récupèrera ses valeurs depuis l'entité
qui lui est attribuée ou dans ``$request->data``.

Cependant, si vous construisez un formulaire qui a besoin d'aller récupérer ses
valeurs dans la query string, vous pouvez utiliser ``valueSource()`` pour
définir où le ``FormHelper`` doit aller récupérer les valeurs de ses champs::

    // Donner la priorité à la query string plutôt qu'au contexte
    echo $this->Form->create($article, [
        'valueSources' => ['query', 'context']
    ]);

    // Même effet :
    echo $this->Form
        ->setValueSources(['query', 'context'])
        ->create($articles);

    // Lecture des valeurs seulement dans la query string
    echo $this->Form->create($article);
    $this->Form->setValueSources('query');

    // Même effet :
    echo $this->Form->create($article, ['valueSources' => 'query']);

Les sources supportées sont ``context``, ``data`` et ``query``. Vous pouvez
utiliser une ou plusieurs sources. Tous les widgets générés par le ``FormHelper``
iront récupérer leurs valeurs dans les sources spécifiées, dans l'ordre dans
lequel vous les avez définies.

Les sources définies seront réinitialisées à leur valeur par défaut
(``['context']``) quand ``end()`` sera appelée.

Changer la méthode HTTP pour un Formulaire
------------------------------------------

En utilisant l'option ``type``, vous pouvez changer la méthode HTTP qu'un
formulaire va utiliser::

      echo $this->Form->create($article, ['type' => 'get']);

Affichera:

.. code-block:: html

     <form method="get" action="/articles/edit/5">

En spécifiant ``file`` à l'option ``type``, cela changera la méthode de
soumission à 'post', et ajoutera un ``enctype`` "multipart/form-data" dans le tag
du formulaire. Vous devez l'utiliser si vous avez des demandes de fichiers dans
votre formulaire. L'absence de cet attribut ``enctype`` empêchera le fonctionnement de
l'envoi de fichiers::

    echo $this->Form->create($article, ['type' => 'file']);

Affichera:

.. code-block:: html

    <form enctype="multipart/form-data" method="post" action="/articles/add">

Quand vous utilisez ``put``, ``patch`` ou ``delete`` dans l'option ``type``,
votre formulaire aura un fonctionnement équivalent à un formulaire de type
'post', mais quand il sera envoyé, la méthode de requête HTTP sera respectivement
réécrite avec 'PUT', 'PATCH' ou 'DELETE'. Cela permet à CakePHP d'émuler un support
REST dans les navigateurs web.

Définir l'URL pour le Formulaire
--------------------------------

Utiliser l'option ``url`` vous permet de diriger le formulaire vers une
action spécifique dans votre controller courant ou dans toute votre application.
Par exemple, si vous voulez diriger le formulaire vers une action ``login()`` du
controller courant, vous pouvez fournir le tableau ``$options`` comme ce qui suit::

    echo $this->Form->create($article, ['url' => ['action' => 'login']]);

Affichera:

.. code-block:: html

    <form method="post" action="/users/login">

Si l'action que vous désirez appeler avec le formulaire n'est pas dans le
controller courant, vous pouvez spécifier une URL dans le formulaire. L'URL
fournie peut être relative à votre application CakePHP::

    echo $this->Form->create(null, [
        'url' => ['controller' => 'Articles', 'action' => 'publish']
    ]);

Affichera:

.. code-block:: html

    <form method="post" action="/articles/publish">

ou pointer vers un domaine extérieur::

    echo $this->Form->create(null, [
        'url' => 'http://www.google.com/search',
        'type' => 'get'
    ]);

Affichera:

.. code-block:: html

    <form method="get" action="http://www.google.com/search">

Utilisez ``'url' => false`` si vous ne souhaitez pas d'URL en tant qu'action de
formulaire.

Utiliser des Validateurs Personnalisés
--------------------------------------

Les models vont souvent avoir des ensembles de validation multiples et vous
voudrez que FormHelper marque les champs nécessaires basés sur les règles de
validation spécifiques que l'action de votre controller est en train
d'appliquer. Par exemple, votre table Users a des règles de validation
spécifiques qui s'appliquent uniquement quand un compte est enregistré::

    echo $this->Form->create($user, [
        'context' => ['validator' => 'register']
    ]);

L'exemple précédent va utiliser les règles de validation définies dans le
validateur ``register``, définies par ``UsersTable::validationRegister()``,
pour le ``$user`` et toutes les associations liées. Si vous créez un
formulaire pour les entities associées, vous pouvez définir les règles de
validation pour chaque association en utilisant un tableau::

    echo $this->Form->create($user, [
        'context' => [
            'validator' => [
                'Users' => 'register',
                'Comments' => 'default'
            ]
        ]
    ]);

Ce qui est au-dessus va utiliser ``register`` pour l'utilisateur, et ``default``
pour les commentaires de l'utilisateur.

Créer des Classes de Contexte
-----------------------------

Alors que les classes de contexte intégrées essaient de couvrir les cas
habituels que vous pouvez rencontrer, vous pouvez avoir besoin de construire
une nouvelle classe de contexte si vous utilisez un ORM différent. Dans ces
situations, vous devrez intégrer `Cake\\View\\Form\\ContextInterface
<https://api.cakephp.org/3.x/class-Cake.View.Form.ContextInterface.html>`_ . Une
fois que vous avez intégré cette interface, vous pouvez connecter votre nouveau
contexte dans le FormHelper. Il est souvent mieux de faire ceci dans un
event listener ``View.beforeRender``, ou dans une classe de vue de
l'application::

    $this->Form->addContextProvider('myprovider', function($request, $data) {
        if ($data['entity'] instanceof MyOrmClass) {
            return new MyProvider($request, $data);
        }
    });

Les fonctions de fabrique de contexte sont l'endroit où vous pouvez ajouter la
logique pour vérifier les options du formulaire pour le type d'entity approprié.
Si une donnée d'entrée correspondante est trouvée, vous pouvez retourner un
objet. Si n'y a pas de correspondance, retourne null.

.. _automagic-form-elements:

Création d'éléments de Formulaire
=================================

.. php:method:: control(string $fieldName, array $options = [])

* ``$fieldName`` - Nom du champ (attribut ``name``) de l'élément dans le
  formulaire (exemple : ``'Modelname.fieldname'``).
* ``$options`` - Un tableau d'option qui peut inclure à la fois des :ref:`control-specific-options`
  et des options d'autres méthodes (que la méthode ``control()`` utilise en interne
  pour générer les différents éléments HTML) ainsi que attribut HTML valide.

La méthode ``control()`` vous laisse générer des inputs de formulaire. Ces inputs
incluent une div enveloppante, un label, un widget d'input, et une erreur de
validation si besoin. En utilisant les metadonnées dans le contexte du
formulaire, cette méthode va choisir un type d'input approprié pour chaque
champ. En interne, ``control()`` utilise les autres méthodes de FormHelper.

.. tip::

    Veuillez notez que, même si les éléments générés par la méthode ``control()``
    sont appelés des "inputs" sur cette page, techniquement parlant, la méthode
    ``control()`` peut générer n'importe quel type de balise ``input`` ainsi
    que tous les autres types d'éléments HTML de formulaire (``select``,
    ``button``, ``textarea``)

Par défaut, la méthode ``control()`` utilisera les templates de widget suivant::

    'inputContainer' => '<div class="input {{type}}{{required}}">{{content}}</div>'
    'input' => '<input type="{{type}}" name="{{name}}"{{attrs}}/>'

En cas d'erreurs de validation, elle utilisera également::

    'inputContainerError' => '<div class="input {{type}}{{required}} error">{{content}}{{error}}</div>'

Le type d'élément créé, dans le cas où aucune autre option n'est fournie pour
générer le type d'élément est induit par l'introspection du Model et dépendra
du datatype de la colonne en question:

Column Type
    Champ de formulaire résultant
string, uuid (char, varchar, etc.)
    text
boolean, tinyint(1)
    checkbox
decimal
    number
float
    number
integer
    number
text
    textarea
text, avec le nom de password, passwd, ou psword
    password
text, avec le nom de email
    email
text, avec le nom de tel, telephone, ou phone
    tel
date
    day, month, et year selects
datetime, timestamp
    day, month, year, hour, minute, et meridian selects
time
    hour, minute, et meridian selects
binary
    file

Le paramètre ``$options`` vous permet de choisir un type d'input spécifique si
vous avez besoin::

    echo $this->Form->control('published', ['type' => 'checkbox']);

.. tip::

    Veuillez notez que, par défaut, générer un élément via la méthode ``control()``
    générera systématiquement un ``div`` autour de l'élément généré.
    Cependant, générer le même élément mais avec la méthode spécifique du ``FormHelper``
    (par exemple ``$this->Form->checkbox('published');``) ne générera pas, dans la
    majorité des cas, un ``div`` autour de l'élément. En fonction de votre cas d'usage,
    utilisez l'une ou l'autre méthode.

.. _html5-required:

Un nom de classe ``required`` sera ajouté à la ``div`` enveloppante si les règles de
validation pour le champ du model indiquent qu'il est requis et ne peut pas être
vide. Vous pouvez désactiver les ``required`` automatiques en utilisant l'option
``required``::

    echo $this->Form->control('title', ['required' => false]);

Pour empêcher la validation faite par le navigateur pour l'ensemble du
formulaire, vous pouvez définir l'option ``'formnovalidate' => true`` pour le
bouton input que vous générez en utilisant
:php:meth:`~Cake\\View\\Helper\\FormHelper::submit()` ou définir
``'novalidate' => true`` dans les options pour
:php:meth:`~Cake\\View\\Helper\\FormHelper::create()`.

Par exemple, supposons que votre model User intègre les champs pour un
*username* (varchar), *password* (varchar), *approved* (datetime) and
*quote* (text). Vous pouvez utiliser la méthode ``control()`` du FormHelper pour
créer les bons inputs pour tous ces champs de formulaire::

    echo $this->Form->create($user);
    // Va générer un input type="text"
    echo $this->Form->control('username');
    // Va générer un input type="password"
    echo $this->Form->control('password');
    // En partant du principe que 'approved' est un "datetime" ou un "timestamp"
    // va générer des champs Jour, mois, année, heure, minute
    echo $this->Form->control('approved');
    // Va générer un textarea
    echo $this->Form->control('quote');

    echo $this->Form->button('Ajouter');
    echo $this->Form->end();

Un exemple plus complet montrant quelques options pour le champ de date::

    echo $this->Form->control('birth_dt', [
        'label' => 'Date de naissance',
        'minYear' => date('Y') - 70,
        'maxYear' => date('Y') - 18,
    ]);

Outre les :ref:`control-specific-options` pour ``control()`` vu ci-dessus,
vous pouvez spécifier n'importe quelle option des méthodes spécifiques pour le
type d'input et n'importe quel attribut HTML (par exemple ``onfocus``).

Si vous voulez un ``select`` utilisant une relation *belongsTo* ou *hasOne*,
vous pouvez ajouter ceci dans votre controller Users (en supposant que
l'User *belongsTo* Group)::

    $this->set('groups', $this->Users->Groups->find('list'));

Ensuite, ajouter les lignes suivantes à votre template de vue de formulaire::

    echo $this->Form->control('group_id', ['options' => $groups]);

Pour créer un ``select`` pour l'association *belongsToMany* Groups, vous pouvez
ajouter ce qui suit dans votre UsersController::

    $this->set('groups', $this->Users->Groups->find('list'));

Ensuite, ajouter les lignes suivantes à votre template de vue::

    echo $this->Form->control('groups._ids', ['options' => $groups]);

Si votre nom de model est composé de deux mots ou plus (ex. "UserGroup"),
quand vous passez les données en utilisant ``set()`` vous devrez nommer vos
données dans un format CamelCase (les Majuscules séparent les mots) et au pluriel comme ceci::

    $this->set('userGroups', $this->UserGroups->find('list'));

.. note::

    N'utilisez pas ``FormHelper::control()`` pour générer
    les boutons submit. Utilisez plutôt
    :php:meth:`~Cake\\View\\Helper\\FormHelper::submit()`.

Conventions de Nommage des Champs
---------------------------------

Lors de la création de widgets, vous devez nommer vos champs d'après leur
attribut correspondant dans l'entity du formulaire. Par exemple, si vous
créez un formulaire pour un ``$article``, vous créez des champs nommés d'après
les propriétés. Par exemple
``title``, ``body`` et ``published``.

Vous pouvez créer des inputs pour les models associés, ou pour les models
arbitraires en le passant dans ``association.fieldname`` en premier paramètre::

    echo $this->Form->control('association.fieldname');

Tout point dans vos noms de champs sera converti dans des données de requête
imbriquées. Par exemple, si vous créez un champ avec un nom
``0.comments.body`` vous aurez un nom d'attribut qui sera
``0[comments][body]``. Cette convention facilite la sauvegarde des données
avec l'ORM. Plus de détails pour tous les types d'associations se trouvent
dans la section :ref:`associated-form-inputs`.

Lors de la création d'inputs de type datetime, FormHelper va ajouter un
suffixe au champ. Vous pouvez remarquer des champs supplémentaires nommés
``year``, ``month``, ``day``, ``hour``, ``minute``, ou ``meridian`` qui
ont été ajoutés. Ces champs seront automatiquement convertis en objets
``DateTime`` quand les entities sont triées.

Options pour la méthode control()
---------------------------------

``FormHelper::control()`` supporte un nombre important d'options via son
paramètre ``$options``. En plus de ses propres options, ``control()``
accepte des options pour les champs input générés (et les autres type d'éléments
comme les ``checkbox`` ou les ``textarea``), comme les attributs HTML. Ce qui
suit va couvrir les options spécifiques de ``FormHelper::control()``.

* ``$options['type']`` - Une chaîne qui précise le type de widget à générer.
  En plus des types de champs vus dans :ref:`automagic-form-elements`, vous
  pouvez aussi créer input de type ``file``, ``password`` et tous les types
  supportés par HTML5. En spécifiant vous-même le type de l'élément à générer,
  vous écraserez le type automatique deviné par l'introspection du Model. Le défaut
  est ``null``::

      echo $this->Form->control('field', ['type' => 'file']);
      echo $this->Form->control('email', ['type' => 'email']);

  Affichera:

  .. code-block:: html

      <div class="input file">
          <label for="field">Field</label>
          <input type="file" name="field" value="" id="field" />
      </div>
      <div class="input email">
          <label for="email">Email</label>
          <input type="email" name="email" value="" id="email" />
      </div>

* ``$options['label']`` Soit une chaîne qui sera utilisé comme valeur pour
  l'élément HTML ``<label>`` ou bien un tableau :ref:`d'options pour le label<create-label>`.
  Le défaut est ``null``.
  Par exemple::

      echo $this->Form->control('name', [
          'label' => 'The User Alias'
      ]);

  Affiche :

  .. code-block:: html

      <div class="input">
          <label for="name">The User Alias</label>
          <input name="name" type="text" value="" id="name" />
      </div>

  Vous pouvez définir cette clé à ``false`` pour désactiver l'affichage de
  l'élément ``<label>``
  Par exemple::

      echo $this->Form->control('name', ['label' => false]);

  Affiche :

  .. code-block:: html

      <div class="input">
          <input name="name" type="text" value="" id="name" />
      </div>

  Si vous passez un tableau, vous pourrez fournir des options supplémentaires pour
  l'element ``label``. Si vous le faîtes, vous pouvez utiliser une clé ``text``
  dans le tableau pour personnaliser le texte du label::
  Par exemple::

      echo $this->Form->control('name', [
          'label' => [
              'class' => 'thingy',
              'text' => 'The User Alias'
          ]
      ]);

  Affiche :

  .. code-block:: html

      <div class="input">
          <label for="name" class="thingy">The User Alias</label>
          <input name="name" type="text" value="" id="name" />
      </div>

* ``$options['options']`` - Vous pouvez passez à cette option un tableau contenant
  les choix pour les éléments comme les ``radio`` et les ``select``. Reportez vous
  à :ref:`create-radio-button` et :ref:`create-select-picker` pour plus de détails.
  Les défaut est ``null``.

* ``$options['error']`` Utiliser cette clé vous permettra de transformer
  les messages de model par défaut et de les utiliser, par exemple, pour
  définir des messages i18n. Pour désactiver le rendu des messages d'erreurs
  définissez la clé ``error`` à ``false``::

      echo $this->Form->control('name', ['error' => false]);

  Pour surcharger les messages d'erreurs du model utilisez un tableau
  avec les clés respectant les messages d'erreurs de validation originaux::

      $this->Form->control('name', [
          'error' => ['Not long enough' => __('This is not long enough')]
      ]);

  Comme vu précédemment, vous pouvez définir le message d'erreur pour chaque
  règle de validation dans vos models. De plus, vous pouvez fournir des
  messages i18n pour vos formulaires.

* ``$options['nestedInput']`` - Utilisez avec les inputs ``checkbox`` et ``radio``.
  Cette option permet de contrôler si les éléments ``input`` doivent être générés
  dans ou à l'extérieur de l'élément ``label``. Quand ``control()`` génère une
  checkbox ou un bouton radio, vous pouvez définir l'option à ``false`` pour
  forcer la génération de l'élément ``input`` en dehors du ``label``.

  Cependant, vous pouvez également la définir à ``true`` pour n'importe quel type
  d'élément pour forcer la génération de l'élément ``input`` dans le ``label``.
  Si vous changez l'option pour les boutons radio, vous aurez également besoin de
  modifier le template par défaut :ref:`'radioWrapper'<create-radio-button>`.
  En fonction du ``type`` d'élément à générer, la valeur par défaut sera ``true``
  ou ``false``.

* ``$options['templates']`` - Les templates à utiliser pour cet ``input``.
  N'importe quel template spécifié via cette option surchargera les templates
  déjà chargés. Cette option accepte soit un nom de fichier (sans extension)
  provenant de ``/config`` qui contient les templates à charger ou bien un
  tableau définissant les templates à utiliser.

* ``$options['labelOptions']`` - Définissez l'option à ``false`` pour désactiver
  les ``label`` autour des ``nestedWidgets`` ou bien définissez un tableau
  d'attributs à appliquer à l'élément ``label``.

Générer des Types d'Inputs Spécifiques
======================================

En plus de la méthode générique ``control()``, le ``FormHelper`` à des
méthodes spécifiques pour générer différents types d'inputs. Ceci peut
être utilisé pour générer juste un extrait de code input, et combiné avec
d'autres méthodes comme :php:meth:`~Cake\\View\\Helper\\FormHelper::label()` et
:php:meth:`~Cake\\View\\Helper\\FormHelper::error()` pour générer des layouts
(mise en page) complètements personnalisés.

.. _general-input-options:

Options Communes
----------------

Beaucoup des différentes méthodes d'input supportent un jeu d'options communes.
Toutes ses options sont aussi supportées par ``control()``. Pour réduire les
répétitions, les options communes partagées par toutes les méthodes input sont :

* ``id`` Définir cette clé pour forcer la valeur du DOM id pour cet
  input. Cela remplacera l'``idPrefix`` qui pourrait être fixé.

* ``default`` Utilisé pour définir une valeur par défaut au champ
  input. La valeur est utilisée si les données passées au formulaire ne
  contiennent pas de valeur pour le champ (ou si aucune donnée n'est
  transmise). Une valeur par défaut explicite va surcharger toute valeur définie
  par défaut dans le schéma.

  Exemple d'utilisation::

    echo $this->Form->text('ingredient', ['default' => 'Sugar']);

  Exemple avec un champ sélectionné (Taille "Medium" sera sélectionné par
  défaut)::

    $sizes = ['s' => 'Small', 'm' => 'Medium', 'l' => 'Large'];
    echo $this->Form->select('size', $sizes, ['default' => 'm']);

  .. note::

      Vous ne pouvez pas utiliser ``default`` pour sélectionner une chekbox -
      vous devez plutôt définir cette valeur dans ``$this->request->getData()`` dans
      votre controller, ou définir l'option ``checked`` de l'input à ``true``.

      Attention à l'utilisation de ``false`` pour assigner une valeur par défaut.
      Une valeur ``false`` est utilisée pour désactiver/exclure les options d'un
      champ, ainsi ``'default' => false`` ne définirait aucune valeur. A la place,
      utilisez ``'default' => 0``.

* ``value`` Utilisée pour définir une valeur spécifique pour le
  champ d'input. Ceci va surcharger toute valeur qui aurait pu être injectée à
  partir du contexte, comme Form, Entity or ``request->getData()`` etc.

  .. note::

      Si vous souhaitez définir un champ pour qu'il ne rende pas sa valeur
      récupérée à partir du contexte ou de la source de valeurs, vous devrez
      définir ``value`` en ``''`` (au lieu de le définir avec
      ``null``).

En plus des options ci-dessus, vous pouvez mixer n'importe quel attribut HTML
que vous souhaitez utiliser. Tout nom d'option non-special sera
traité comme un attribut HTML, et appliqué à l'élément HTML input généré.
NdT. celui qui capte cette phrase gagne un giroTermoOnduleur à double
convection.

.. versionchanged:: 3.3.0
    Depuis la version 3.3.0, FormHelper va automatiquement utiliser les valeurs
    par défaut définies dans le schéma de votre base de données. Vous pouvez
    désactiver ce comportement en définissant l'option ``schemaDefault`` à
    ``false``.

Créer des Elements Input
========================

Les autres méthodes disponibles dans le FormHelper permettent
la création d'éléments spécifiques de formulaire. La plupart de ces
méthodes utilisent également un paramètre spécial $options.
Toutefois, dans ce cas, $options est utilisé avant tout pour spécifier
les attributs des balises HTML (comme la valeur ou l'id DOM d'un élément
du formulaire).

Créer des Inputs Text
---------------------

.. php:method:: text(string $name, array $options)

* ``$name`` - Le ``name`` du champ sous la forme ``'Modelname.fieldname'``.
* ``$options`` - Un tableau optionnel d'options avec n'importe laquelle
  :ref:`des options générales<general-control-options>` ainsi que n'importe
  quel attributs HTML valide.

Va créer un ``input`` de type ``text``::

    echo $this->Form->text('username', ['class' => 'users']);

Affichera:

.. code-block:: html

    <input name="username" type="text" class="users">

Créer des Inputs Password
-------------------------

.. php:method:: password(string $fieldName, array $options)

* ``$name`` - Le ``name`` du champ sous la forme ``'Modelname.fieldname'``.
* ``$options`` - Un tableau optionnel d'options avec n'importe laquelle
  :ref:`des options générales<general-control-options>` ainsi que n'importe
  quel attributs HTML valide.

Création d'un input ``password``::

    echo $this->Form->password('password');

Affichera:

.. code-block:: html

    <input name="password" value="" type="password">

Créer des Inputs Cachés
-----------------------

.. php:method:: hidden(string $fieldName, array $options)

* ``$name`` - Le ``name`` du champ sous la forme ``'Modelname.fieldname'``.
* ``$options`` - Un tableau optionnel d'options avec n'importe laquelle
  :ref:`des options générales<general-control-options>` ainsi que n'importe
  quel attributs HTML valide.

Créera un input ``hidden`` de form. Exemple::

    echo $this->Form->hidden('id');

Affichera:

.. code-block:: html

    <input name="id" value="10" type="hidden" />

Créer des Textareas
-------------------

.. php:method:: textarea(string $fieldName, array $options)

* ``$name`` - Le ``name`` du champ sous la forme ``'Modelname.fieldname'``.
* ``$options`` - Un tableau optionnel d'options avec n'importe laquelle
  :ref:`des options générales<general-control-options>` ainsi que n'importe
  quel attributs HTML valide.

Crée un champ ``textarea`` (zone de texte). Le template utilisé par défaut est::

    'textarea' => '<textarea name="{{name}}"{{attrs}}>{{value}}</textarea>'

Par exemple::

    echo $this->Form->textarea('notes');

Affichera:

.. code-block:: html

    <textarea name="notes"></textarea>

Si le form est édité (ainsi, le tableau ``$this->request->getData()`` va contenir
les informations sauvegardées pour le model ``User``), la valeur
correspondant au champs ``notes`` sera automatiquement ajoutée au HTML
généré. Exemple:

.. code-block:: html

    <textarea name="notes" id="notes">
        Ce Texte va être édité.
    </textarea>

**Options for Textarea**

En plus :ref:`des options générales<general-control-options>`, ``textarea()``
supporte 2 autres options spécifiques :

* ``'escape'`` - Permet de définir si le contenu du ``textarea`` doit être
  échappé ou non. Le défaut est ``true``.

  Par exemple::

      echo $this->Form->textarea('notes', ['escape' => false]);
      // OU....
      echo $this->Form->control('notes', ['type' => 'textarea', 'escape' => false]);

* ``'rows', 'cols'`` - Ces deux clés permettent de définir les attributs HTML
  du même nom et qui sont, respectivement, le nombre de lignes et de colonnes::

      echo $this->Form->textarea('textarea', ['rows' => '5', 'cols' => '5']);

  Affichera:

.. code-block:: html

    <textarea name="textarea" cols="5" rows="5">
    </textarea>

Créer des Select, des Checkbox et des Boutons Radio
---------------------------------------------------

Ces éléments ont options et des points en communs, c'est pourquoi ils sont
regroupés dans section.

.. _checkbox-radio-select-options:

Les Options pour Select, Checkbox et Inputs Radio
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Vous trouverez ci-dessous les options partagées entre ``select()``,
``checkbox()`` et ``radio()`` (les options spécifiques à une seule méthode sont
décrites dans les sections dédiées à ces méthodes).

* ``value`` Permet de définir ou sélectionner la valeur de l'élément ciblé :

  * Pour les checkboxes, cela définit l'attribut HTML ``value`` assigné à
    l'input à la valeur que vous définissez.

  * Pour les boutons radio ou les select, cela définit la valeur qui sera
    définit quand le formulaire sera rendu (dans ces cas là, ``'value'`` doit
    avoir une valeur qui existe dans l'élément). Elle peut être utilisée avec
    n'importe quel élément basé sur un select comme ``date()``, ``time()``,
    ``dateTime()``::

        echo $this->Form->time('close_time', [
            'value' => '13:30:00'
        ]);

  .. note::

    La clé ``value`` pour les ``date()`` et ``dateTime()`` peut aussi
    être un timestamp UNIX ou un objet DateTime.

  Pour un input ``select`` où vous définissez l'attribut ``multiple`` à true,
  vous pouvez utiliser un tableau des valeurs que vous voulez sélectionner par
  défaut::

      // Les tags <options> avec valeurs 1 et 3 seront sélectionnés par défaut
      echo $this->Form->select('rooms', [
          'multiple' => true,
          'default' => [1, 3]
      ]);

* ``empty`` S'applique à ``radio()`` et ``select()``. Le défaut est ``false``.

  * Quand vous passe cette option ``radio()``, cela créera un élément ``input``
    supplémentaire qui sera affiché avant le premier bouton radio, avec une valeur
    de ``''`` et un ``label`` qui vaudra la chaîne passée dans l'option.

  * Si vous la passez à la méthode ``select``, cela créer un élément ``option``
    vide avec une valeur vide dans la liste de choix. Si à la place d'une valeur
    vide, vous souhaitez afficher un texte, passez une chaîne dans l'option::

        echo $this->Form->select(
            'field',
            [1, 2, 3, 4, 5],
            ['empty' => '(choisissez)']
        );

  Affiche:

  .. code-block:: html

      <select name="field">
          <option value="">(choose one)</option>
          <option value="0">1</option>
          <option value="1">2</option>
          <option value="2">3</option>
          <option value="3">4</option>
          <option value="4">5</option>
      </select>

* ``hiddenField`` Pour certain types d'input (checkboxes,
  radios) un input caché est créé. Ainsi, la clé dans ``$this->request->getData()``
  existera même sans valeur spécifiée. Pour les checkboxes, sa valeur vaudra ``0`` ;
  pour les boutons radio, elle sera ``''``.

  Exemple d'un rendu par défaut :

  .. code-block:: html

      <input type="hidden" name="published" value="0" />
      <input type="checkbox" name="published" value="1" />

  Ceci peut être désactivé en définissant l'option ``hiddenField`` à ``false``::

      echo $this->Form->checkbox('published', ['hiddenField' => false]);

  Retournera :

  .. code-block:: html

      <input type="checkbox" name="published" value="1">

  Si vous voulez créer de multiples blocs d'entrées regroupés
  ensemble dans un formulaire, vous devriez définir ce paramètre à ``false``
  sur tous les inputs, excepté le premier. Si l'input caché est en
  place à différents endroits c'est seulement le dernier groupe
  de valeur d'input qui sera sauvegardé.

  Dans cet exemple , seules les couleurs tertiaires seront passées,
  et les couleurs primaires seront réécrites:

  .. code-block:: html

      <h2>Primary Colors</h2>
      <input type="hidden" name="color" value="0" />
      <label for="color-red">
          <input type="checkbox" name="color[]" value="5" id="color-red" />
          Red
      </label>

      <label for="color-blue">
          <input type="checkbox" name="color[]" value="5" id="color-blue" />
          Blue
      </label>

      <label for="color-yellow">
          <input type="checkbox" name="color[]" value="5" id="color-yellow" />
          Green
      </label>

      <h2>Tertiary Colors</h2>
      <input type="hidden" name="color" value="0" />
      <label for="color-green">
          <input type="checkbox" name="color[]" value="5" id="color-green" />
          Yellow
      </label>
      <label for="color-purple">
          <input type="checkbox" name="color[]" value="5" id="color-purple" />
          Purple
      </label>
      <label for="color-orange">
          <input type="checkbox" name="color[]" value="5" id="color-orange" />
          Orange
      </label>

  Désactiver l'option ``'hiddenField'`` dans le second groupe d'input empêcherait
  ce comportement.

  Vous pouvez définir une valeur différente pour le champ caché autre que 0
  comme 'N'::

      echo $this->Form->checkbox('published', [
          'value' => 'Y',
          'hiddenField' => 'N',
      ]);

Créer des Checkboxes
~~~~~~~~~~~~~~~~~~~~

.. php:method:: checkbox(string $fieldName, array $options)

* ``$name`` - Le ``name`` du champ sous la forme ``'Modelname.fieldname'``.
* ``$options`` - Un tableau optionnel d'options avec n'importe laquelle
  :ref:`des options générales<general-control-options>`, des options de la section
  :ref:`checkbox-radio-select-options`, des options spécifiques aux checkbox (ci-dessous)
  ainsi que n'importe quel attributs HTML valide.

Créer un élément ``checkbox``. Le template de widget utilisé est le suivant::

    'checkbox' => '<input type="checkbox" name="{{name}}" value="{{value}}"{{attrs}}>'

**Options spécifiques pour les Checkboxes**

* ``'checked'`` - Booléen utilisé pour indiquer si cette checkbox est cochée ou non.
  Par défaut à ``false``.

* ``'disabled'`` - Booléen. Si passé à ``true``, la checkbox aura l'attribut ``disabled``.

Cette méthode génère également un input de type ``hidden`` pour forcer l'existence
de la donnée dans le tableau de POST.

E.g. ::

    echo $this->Form->checkbox('done');

Affichera:

.. code-block:: html

    <input type="hidden" name="done" value="0">
    <input type="checkbox" name="done" value="1">

Il est possible de modifier la valeur du checkbox en utilisant le tableau
$options::

    echo $this->Form->checkbox('done', ['value' => 555]);

Affichera:

.. code-block:: html

    <input type="hidden" name="done" value="0">
    <input type="checkbox" name="done" value="555">

Si vous ne voulez pas que le FormHelper génère un input ``hidden``, vous pouvez
passer l'option ``hiddenField`` à ``false``::

    echo $this->Form->checkbox('done', ['hiddenField' => false]);

Affichera:

.. code-block:: html

    <input type="checkbox" name="done" value="1">

.. _create-radio-button:

Créer des Boutons Radio
~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: radio(string $fieldName, array $options, array $attributes)

* ``$name`` - Le ``name`` du champ sous la forme ``'Modelname.fieldname'``.
* ``$options`` - Un tableau optionnel contenant au minimum les labels pour les
  boutons radio. Ce tableau peut également contenir les ``value`` et des attributs
  HTML. Si ce tableau n'est pas fourni, la méthode générera seulement le input
  ``hidden`` (si ``'hiddenField'`` vaut ``true``) ou pas d'élément du tout
  (si ``'hiddenField'`` vaut ``false``).
* ``$attributes`` - Un tableau optionnel d'options avec n'importe laquelle
  :ref:`des options générales<general-control-options>`, des options de la section
  :ref:`checkbox-radio-select-options`, des options spécifiques aux radios (ci-dessous)
  ainsi que n'importe quel attributs HTML valide.

Crée un jeu d'inputs radios. Les templates de widget utilisés par défaut seront::

    'radio' => '<input type="radio" name="{{name}}" value="{{value}}"{{attrs}}>'
    'radioWrapper' => '{{label}}'

**Attributs spécifiques aux boutons radio**

* ``label`` - booléen pour indiquer si oui ou non les labels pour les widgets
  doivent être affichés. Défaut à ``true``.

* ``hiddenField`` - booléen pour indiquer si vous voulez que les résultats de
  radio() incluent un input caché avec une valeur de ''. C'est utile pour créer
  des ensembles de radio qui ne sont pas continus. Défaut à ``true``.

* ``disabled`` - Définir à ``true`` ou ``disabled`` pour désactiver tous les
  boutons radio. Défaut à ``false``.

Vous devez fournir les label pour les boutons radio via l'argument ``$options``.

Par exemple::

    $this->Form->radio('gender', ['Masculine','Feminine','Neuter']);

Affichera:

.. code-block:: html

    <input name="gender" value="" type="hidden">
    <label for="gender-0">
        <input name="gender" value="0" id="gender-0" type="radio">
        Masculine
    </label>
    <label for="gender-1">
        <input name="gender" value="1" id="gender-1" type="radio">
        Feminine
    </label>
    <label for="gender-2">
        <input name="gender" value="2" id="gender-2" type="radio">
        Neuter
    </label>

Généralement, ``$options`` est une simple paire clé => valeur. Cependant, si
vous avez besoin de mettre des attributs personnalisés sur vos boutons radio,
vous pouvez utiliser le format étendu::

Par exemple ::

    echo $this->Form->radio(
        'favorite_color',
        [
            ['value' => 'r', 'text' => 'Red', 'style' => 'color:red;'],
            ['value' => 'u', 'text' => 'Blue', 'style' => 'color:blue;'],
            ['value' => 'g', 'text' => 'Green', 'style' => 'color:green;'],
        ]
    );

Affichera :

.. code-block:: html

    <input type="hidden" name="favorite_color" value="">
    <label for="favorite-color-r">
        <input type="radio" name="favorite_color" value="r" style="color:red;" id="favorite-color-r">
        Red
    </label>
    <label for="favorite-color-u">
        <input type="radio" name="favorite_color" value="u" style="color:blue;" id="favorite-color-u">
        Blue
    </label>
    <label for="favorite-color-g">
        <input type="radio" name="favorite_color" value="g" style="color:green;" id="favorite-color-g">
        Green
    </label>

.. _create-select-picker:

Créer des Select
~~~~~~~~~~~~~~~~

.. php:method:: select(string $fieldName, array $options, array $attributes)

* ``$name`` - Le ``name`` du champ sous la forme ``'Modelname.fieldname'``.
* ``$options`` - Un tableau optionnel contenant la liste des éléments pour le
  select. Si ce tableau n'est pas fourni, la méthode généra seulement un élément
  ``select`` vide, sans élément ``option``.
* ``$attributes`` - Un tableau optionnel d'options avec n'importe laquelle
  :ref:`des options générales<general-control-options>`, des options de la section
  :ref:`checkbox-radio-select-options`, des options spécifiques aux select (ci-dessous)
  ainsi que n'importe quel attributs HTML valide.

Crée un élément ``select``, rempli des éléments compris dans ``$options``.
Si l'option ``$attributes['value']`` est fournie, alors les éléments ``option``
ayant cette valeur seront affichés comme sélectionné(s) quand le select sera
rendu.

Par défaut, ``select`` utilise ces templates de widget::

    'select' => '<select name="{{name}}"{{attrs}}>{{content}}</select>'
    'option' => '<option value="{{value}}"{{attrs}}>{{text}}</option>'

Il pourra également utilisez les templates suivant::

    'optgroup' => '<optgroup label="{{label}}"{{attrs}}>{{content}}</optgroup>'
    'selectMultiple' => '<select name="{{name}}[]" multiple="multiple"{{attrs}}>{{content}}</select>'

**Attributs pour les Select**

* ``'multiple'`` - Si cette option est définie à ``true``, le select sera multiple
  (plusieurs valeurs pourront être sélectionnées). Si elle est définie à ``checkbox``,
  à la place d'un select multiple, vous aurez des checkbox.
  Défaut à ``null``.

* ``'escape'`` - Booleén. Si ``true``, le contenu des éléments ``option`` sera
  échappé (les entités HTML seront convertis). Défaut à ``true``.

* ``'val'`` - Permet de pré-sélectionner la valeur du select.

* ``'disabled'`` - Contrôle l'attribut ``disabled``. Si l'option est définie à
  ``true``, l'ensemble du select sera ``disabled``. Si définie sous forme de tableau,
  seuls les éléments ``option`` dont la valeur est dans le tableau seront désactivés.

L'argument ``$options`` vous permet de définir manuellement le contenu des éléments
``option`` du ``select``.

Par exemple ::

    echo $this->Form->select('field', [1, 2, 3, 4, 5]);

Affichera:

.. code-block:: html

    <select name="field">
        <option value="0">1</option>
        <option value="1">2</option>
        <option value="2">3</option>
        <option value="3">4</option>
        <option value="4">5</option>
    </select>

La tableau ``$options`` peut aussi être fourni sous forme de paires de clé => valeur.

Par exemple ::

    echo $this->Form->select('field', [
        'Value 1' => 'Label 1',
        'Value 2' => 'Label 2',
        'Value 3' => 'Label 3'
    ]);

Affichera :

.. code-block:: html

    <select name="field">
        <option value="Value 1">Label 1</option>
        <option value="Value 2">Label 2</option>
        <option value="Value 3">Label 3</option>
    </select>

Si vous souhaitez générer un ``select`` avec des ``optgroups``, passez les
données sous forme de tableau multidimensionnel. Cela marche également avec les
checkbox et les boutons radio, mais à la place d'éléments ``optgroup``, vos éléments
seront entourés d'un élément ``fieldset``.

Par exemple::

    $options = [
        'Group 1' => [
            'Value 1' => 'Label 1',
            'Value 2' => 'Label 2'
        ],
        'Group 2' => [
            'Value 3' => 'Label 3'
        ]
    ];
    echo $this->Form->select('field', $options);

Affichera :

.. code-block:: html

    <select name="field">
        <optgroup label="Group 1">
            <option value="Value 1">Label 1</option>
            <option value="Value 2">Label 2</option>
        </optgroup>
        <optgroup label="Group 2">
            <option value="Value 3">Label 3</option>
        </optgroup>
    </select>

Pour ajouter des attributs HTML aux éléments ``option``::

    $options = [
        ['text' => 'Description 1', 'value' => 'value 1', 'attr_name' => 'attr_value 1'],
        ['text' => 'Description 2', 'value' => 'value 2', 'attr_name' => 'attr_value 2'],
        ['text' => 'Description 3', 'value' => 'value 3', 'other_attr_name' => 'other_attr_value'],
    ];
    echo $this->Form->select('field', $options);

Affichera:

.. code-block:: html

    <select name="field">
        <option value="value 1" attr_name="attr_value 1">Description 1</option>
        <option value="value 2" attr_name="attr_value 2">Description 2</option>
        <option value="value 3" other_attr_name="other_attr_value">Description 3</option>
    </select>

**Contrôle des Select via Attributs**

En utilisant des options spéciales dans l'argument ``$attributes``, vous pouvez
contrôler certains comportement de la méthode ``select()``.

* ``'empty'`` - Définissez cette option à ``true`` pour ajouter une option vide
  en première position de la liste de vos ``option``. Défaut à ``false``.

  Par exemple::

      $options = ['M' => 'Male', 'F' => 'Female'];
      echo $this->Form->select('gender', $options, ['empty' => true]);

  Affichera:

  .. code-block:: html

      <select name="gender">
          <option value=""></option>
          <option value="M">Male</option>
          <option value="F">Female</option>
      </select>

* ``'escape'`` - Booleén. Si passée à ``true``, le contenu des ``option`` sera
  échappé (les entités HTML seront encodées).

  Par exemple ::

      // This will prevent HTML-encoding the contents of each option element
      $options = ['M' => 'Male', 'F' => 'Female'];
      echo $this->Form->select('gender', $options, ['escape' => false]);

* ``'multiple'`` - Si définie à ``true``, cette option rendra le ``select`` multiple.

  Par exemple ::

      echo $this->Form->select('field', $options, ['multiple' => true]);

  Vous pouvez également définir ``'multiple'`` à ``'checkbox'`` pour afficher une
  liste de checkbox à la place::

      $options = [
          'Value 1' => 'Label 1',
          'Value 2' => 'Label 2'
      ];
      echo $this->Form->select('field', $options, [
          'multiple' => 'checkbox'
      ]);

  Affichera:

  .. code-block:: html

      <input name="field" value="" type="hidden">
      <div class="checkbox">
          <label for="field-1">
              <input name="field[]" value="Value 1" id="field-1" type="checkbox">
              Label 1
          </label>
      </div>
      <div class="checkbox">
          <label for="field-2">
              <input name="field[]" value="Value 2" id="field-2" type="checkbox">
              Label 2
          </label>
      </div>

* ``'disabled'`` - Cette option sert à désactiver une partie ou tous les éléments
  ``option``. Pour désactiver tous les éléments, passez ``'disabled'`` à ``true``.
  Pour désactiver seulement certains éléments, définissez un tableau avec les clés
  des éléments que vous voulez désactiver.

  Par exemple ::

      $options = [
          'M' => 'Masculine',
          'F' => 'Feminine',
          'N' => 'Neuter'
      ];
      echo $this->Form->select('gender', $options, [
          'disabled' => ['M', 'N']
      ]);

  Affichera:

  .. code-block:: html

      <select name="gender">
          <option value="M" disabled="disabled">Masculine</option>
          <option value="F">Feminine</option>
          <option value="N" disabled="disabled">Neuter</option>
      </select>

  Cette option fonctionne également quand ``'multiple'`` est définie à ``'checkbox'``::

      $options = [
          'Value 1' => 'Label 1',
          'Value 2' => 'Label 2'
      ];
      echo $this->Form->select('field', $options, [
          'multiple' => 'checkbox',
          'disabled' => ['Value 1']
      ]);

  Affichera:

  .. code-block:: html

      <input name="field" value="" type="hidden">
      <div class="checkbox">
          <label for="field-1">
              <input name="field[]" disabled="disabled" value="Value 1" type="checkbox">
              Label 1
          </label>
      </div>
      <div class="checkbox">
          <label for="field-2">
              <input name="field[]" value="Value 2" id="field-2" type="checkbox">
              Label 2
          </label>
      </div>


Les Options de Datetime
-----------------------

* ``$options['timeFormat']``. Utilisé pour spécifier le format des inputs
  select (menu de sélection) pour un jeu d'input en relation avec le temps.
  Les valeurs valides sont ``12``, ``24``, et ``null``.

* ``$options['minYear'], $options['maxYear']`` Utilisé en combinaison avec un
  input date/datetime. Définit les valeurs minimales et/ou maximales de butée
  montrées dans le champ select des années.

* ``$options['orderYear']`` Utilisé en combinaison avec un input
  date/datetime. Définit l'ordre dans lequel la valeur de l'année sera
  délivré. Les valeurs valides sont  'asc', 'desc'. La valeur par défaut
  est 'desc'.

* ``$options['interval']`` Cette option spécifie l'écart de minutes
  entre chaque option dans la select box minute::

    echo $this->Form->control('time', [
        'type' => 'time',
        'interval' => 15
    ]);

  Créera 4 options dans la select box minute. Une toutes les 15 minutes.

* ``$options['round']`` Peut être défini à `up` ou `down` pour forcer l'arrondi
  dans une direction. Par défaut à null qui arrondit à la moitié
  supérieure selon `interval`.

* ``$options['monthNames']`` If ``false``, 2 digit numbers will be used instead
  of text. Si on lui passe un tableau du style
  ``['01' => 'Jan', '02' => 'Feb', ...]`` alors ce tableau sera utilisé.

Créer des Inputs File
---------------------

.. php:method:: file(string $fieldName, array $options)

Pour ajouter un champ upload à un formulaire, vous devez vous assurer que le
enctype du formulaire est définit a  "multipart/form-data", donc commençons
avec une fonction create comme ci-dessous::

    echo $this->Form->create($document, ['enctype' => 'multipart/form-data']);
    // OU
    echo $this->Form->create($document, ['type' => 'file']);

Ensuite ajoutez l'une des deux lignes dans votre formulaire::

    echo $this->Form->control('submittedfile', [
        'type' => 'file'
    ]);

    // OU
    echo $this->Form->file('submittedfile');

En raison des limitations du code HTML lui même, il n'est pas possible
de placer des valeurs par défauts dans les champs inputs de type 'file'.
A chaque fois que le formulaire sera affiché, la valeur sera vide.

Lors de la soumission, le champ file fournit un tableau étendu de données
au script recevant les données de formulaire.

Pour l'exemple ci-dessus, les valeurs dans le tableau de données soumis
devraient être organisées comme à la suite, si CakePHP à été installé sur
un server Windows .'tmp\_name'  aura un chemin différent dans un
environnement Unix::

    $this->request->data['submittedfile'] = [
        'name' => 'conference_schedule.pdf',
        'type' => 'application/pdf',
        'tmp_name' => 'C:/WINDOWS/TEMP/php1EE.tmp',
        'error' => 0, // Peut être une chaine sur Windows.
        'size' => 41737,
    ];

Ce tableau est généré par PHP lui-même, pour plus de détails
sur la façon dont PHP gère les données passées a travers
les champs ``files``,
`lire la section file uploads du manuel de PHP
<http://php.net/features.file-upload>`_.

.. note::

    Quand vous utilisez ``$this->Form->file()``, pensez à bien définir le
    type d'envodage du formulaire en définissant l'option type à 'file' dans
    ``$this->Form->create()``.

Crée des Inputs DateTime
------------------------

.. php:method:: dateTime($fieldName, $options = [])

Crée un ensemble d'inputs select pour les date et time. Cette méthode accepte
un certain nombre d'options:

* ``monthNames`` Si ``false``, un chiffre à 2 digits sera utilisé à la place
  d'un texte.
  Si c'est un tableau, le tableau passé sera utilisé.
* ``minYear`` L'année la plus ancienne à utiliser dans le select de l'année
* ``maxYear`` L'année la plus lointaine à utiliser dans le select de l'année
* ``interval`` L'intervale en minutes entre chaque valeur dans le slect des
  minutes. 1 par défaut.
* ``empty`` - Si ``true``, une option select vide est affichée. Si c'est une
  chaine, cette chaine est affichée comme élément vide.
* ``round`` - Mettre à ``up`` ou ``down`` pour forcer l'arrondi
  dans une direction. Par défaut à null.
* ``default`` Le valeur par défaut à utiliser par l'input. Une valeur dans
  ``$this->request->getData()`` correspondante au nom du l'input écrasera cette
  valeur. Si aucune valeur par défaut n'est définie, ``time()`` sera utilisé.
* ``timeFormat`` Le format d'heure à utiliser, soit 12 soit 24.
* ``second`` Mettre à ``true`` to activer l'affichage des secondes.

Pour controller l'ordre des inputs, et chaque élément/contenu entre les inputs,
vous pouvez remplacer le template ``dateWidget``. Par défaut le template
``dateWidget`` est::

    {{year}}{{month}}{{day}}{{hour}}{{minute}}{{second}}{{meridian}}

Pour créer un input datetime avec des classes/attributs personnalisés pour une
select box spécifique, vous pouvez utiliser les options dans chaque component::

    echo $this->Form->dateTime('released', [
        'year' => [
            'class' => 'year-classname',
        ],
        'month' => [
            'class' => 'month-class',
            'data-type' => 'month',
        ],
    ]);

Ce qui créerait les deux selects suivants:

.. code-block:: html

    <select name="released[year]" class="year-class">
        <option value="" selected="selected"></option>
        <option value="00">0</option>
        <option value="01">1</option>
        <!-- .. snipped for brevity .. -->
    </select>
    <select name="released[month]" class="month-class" data-type="month">
        <option value="" selected="selected"></option>
        <option value="01">January</option>
        <!-- .. snipped for brevity .. -->
    </select>

Créer des Inputs Time
---------------------

.. php:method:: time($fieldName, $options = [])

Crée deux éléments select remplis respectivement avec 24 hours et 60 minutes
pour ``hour`` et ``minute``.
De plus, les attributs HTML peuvent être fournis dans $options pour chaque
``type`` spécifique. Si ``$options['empty']`` est ``false``, le select
n'inclura pas une option vide:

* ``empty`` - Si ``true``, l'option select vide est montrée. Si c'est une
  chaîne, cette chaîne sera affichée en tant qu'élément vide.
* ``default`` | ``value`` La valeur par défaut à utiliser pour l'input. Une
  valeur dans ``$this->request->getData()`` qui correspond au nom du champ va écraser
  cette valeur.
  Si aucune valeur par défaut n'est fournie, ``time()`` sera utilisée.
* ``timeFormat`` Le format de time à utiliser, soit 12 soit 24. Par défaut à 24.
* ``second`` Défini à ``true`` pour activer les secondes déroulantes.
* ``interval`` L'intervalle pour le select minutes. Par défaut à 1.

Par exemple, pour créer un intervalle de temps avec des minutes selectionnables
toutes les 15 minutes, et pour l'appliquer aux selects, vous pourriez faire
ceci::

    echo $this->Form->time('released', [
        'interval' => 15,
        'hour' => [
            'class' => 'foo-class',
        ],
        'minute' => [
            'class' => 'bar-class',
        ],
    ]);

Ce qui créerait les deux selects suivants:

.. code-block:: html

    <select name="released[hour]" class="foo-class">
        <option value="" selected="selected"></option>
        <option value="00">0</option>
        <option value="01">1</option>
        <!-- .. snipped for brevity .. -->
        <option value="22">22</option>
        <option value="23">23</option>
    </select>
    <select name="released[minute]" class="bar-class">
        <option value="" selected="selected"></option>
        <option value="00">00</option>
        <option value="15">15</option>
        <option value="30">30</option>
        <option value="45">45</option>
    </select>

Créer des Inputs Year
---------------------

.. php:method:: year(string $fieldName, array $options = [])

Crée un input de type select rempli avec les années comprises entre ``minYear``
et ``maxYear``. En plus, des attributs HTML peuvent être fournis via $options.
Si ``$options['empty']`` est ``false``, le select n'aura pas de choix vide:

* ``empty`` - Si ``true``, une option select vide est affichée. Si c'est une
  chaine, cette chaine est affichée comme élément vide.
* ``orderYear`` - Ordre de tri des années dans les options du select.
  Les valeurs acceptées sont 'asc', 'desc'. 'desc' par défaut.
* ``value`` La valeur sélectionnée pour l'input.
* ``maxYear`` L'année la plus lointaine à utiliser dans le select.
* ``minYear`` L'année la plus ancienne à utiliser dans le select de l'année.

Par exemple, pour créer une sélection depuis 2000 jusqu'à l'année actuelle,
vous devez faire cela::

    echo $this->Form->year('purchased', [
        'minYear' => 2000,
        'maxYear' => date('Y')
    ]);

Si nous étions en 2009, vous auriez ceci:

.. code-block:: html

    <select name="purchased[year]">
    <option value=""></option>
    <option value="2009">2009</option>
    <option value="2008">2008</option>
    <option value="2007">2007</option>
    <option value="2006">2006</option>
    <option value="2005">2005</option>
    <option value="2004">2004</option>
    <option value="2003">2003</option>
    <option value="2002">2002</option>
    <option value="2001">2001</option>
    <option value="2000">2000</option>
    </select>

Créer des Inputs Month
----------------------

.. php:method:: month(string $fieldName, array $attributes)

Crée un élément select (menu de sélection) avec le nom des mois::

    echo $this->Form->month('mob');

Affichera:

.. code-block:: html

    <select name="mob[month]">
    <option value=""></option>
    <option value="01">January</option>
    <option value="02">February</option>
    <option value="03">March</option>
    <option value="04">April</option>
    <option value="05">May</option>
    <option value="06">June</option>
    <option value="07">July</option>
    <option value="08">August</option>
    <option value="09">September</option>
    <option value="10">October</option>
    <option value="11">November</option>
    <option value="12">December</option>
    </select>

Vous pouvez passer votre propre tableau des mois à utiliser en
paramétrant l'attribut 'monthNames', ou avoir les mois affichés
comme des nombres en passant ``false``. (Note: les mois par défaut
sont internationalisés et peuvent être traduits en utilisant la
:doc:`localisation </core-libraries/internationalization-and-localization>`.)::

    echo $this->Form->month('mob', ['monthNames' => false]);

Créer des Inputs Day
--------------------

.. php:method:: day(string $fieldName, array $attributes)

Crée un élément select (menu de sélection) rempli avec les jours
(numériques) du mois.

Pour créer une option empty avec l'affichage d'un texte de votre choix
(ex. la première option est 'Jour'), vous pouvez fournir le texte comme
paramètre final comme ceci::

    echo $this->Form->day('created');

Affichera:

.. code-block:: html

    <select name="created[day]">
    <option value=""></option>
    <option value="01">1</option>
    <option value="02">2</option>
    <option value="03">3</option>
    ...
    <option value="31">31</option>
    </select>

Créer des Inputs Hour
---------------------

.. php:method:: hour(string $fieldName, array $attributes)

Crée un élément select (menu de sélection) rempli avec les heures de la journée.
Vous pouvez créer un select en de 12 ou 24 heures en utilisant l'option format::

    echo $this->Form->hour('created', [
        'format' => 12
    ]);
    echo $this->Form->hour('created', [
        'format' => 24
    ]);

Créer des Inputs Minute
-----------------------

.. php:method:: minute(string $fieldName, array $attributes)

Crée un élément select (menu de sélection) rempli avec les minutes
d'une heure. Vous pouvez créer un select qui contient des valeurs spécifiques
en utilisant l'option ``interval``. Par exemple si vous souhaitez une
incrémentation toutes les 10 minutes, vous devez faire::

    echo $this->Form->minute('created', [
        'interval' => 10
    ]);

Créer des Inputs Meridian
-------------------------

.. php:method:: meridian(string $fieldName, array $attributes)

Crée un élément select (menu de sélection) rempli avec'am' et 'pm'.

Créer les Labels
================

.. php:method:: label(string $fieldName, string $text, array $options)

Crée un élément label. ``$fieldName`` est utilisé pour générer le
Dom id. Si ``$text`` n'est pas défini, ``$fieldName`` sera utilisé pour
définir le texte du label::

    echo $this->Form->label('User.name');
    echo $this->Form->label('User.name', 'Your username');

Affichera :

.. code-block:: html

    <label for="user-name">Name</label>
    <label for="user-name">Your username</label>

``$options`` peut soit être un tableau d'attributs HTML, ou une chaîne qui
sera utilisée comme nom de classe::

    echo $this->Form->label('User.name', null, ['id' => 'user-label']);
    echo $this->Form->label('User.name', 'Your username', 'highlight');

Affichera:

.. code-block:: html

    <label for="user-name" id="user-label">Name</label>
    <label for="user-name" class="highlight">Your username</label>

Afficher et vérifier les erreurs
================================

.. php:method:: error(string $fieldName, mixed $text, array $options)

Affiche un message d'erreur de validation, spécifiée par $texte, pour
le champ donné, dans le cas où une erreur de validation a eu lieu.

Options:

-  'escape' booléen s'il faut ou non que le HTML échappe le contenu de
   l'erreur.

.. php:method:: isFieldError(string $fieldName)

Retourne ``true`` si le champ $fieldName fourni a une erreur de validation en
cours::

    if ($this->Form->isFieldError('gender')) {
        echo $this->Form->error('gender');
    }

.. note::

    En utilisant :php:meth:`~Cake\\View\\Helper\\FormHelper::control()`, les
    erreurs sont retournées par défaut.

Création des boutons et des éléments submit
===========================================

.. php:method:: submit(string $caption, array $options)

Crée un input submit avec le texte ``$caption``. Si la ``$caption``
fournie est l'URL d'une image, un bouton submit de l'image sera généré.
Ce qui suit::

    echo $this->Form->submit();

Affichera:

.. code-block:: html

    <div class="submit"><input value="Submit" type="submit"></div>

Vous pouvez aussi passer une URL relative ou absolue vers une image
au paramètre caption au lieu d'un caption text::

    echo $this->Form->submit('ok.png');

Affichera:

.. code-block:: html

    <div class="submit"><input type="image" src="/img/ok.png"></div>

Les inputs submit sont utiles quand vous avez seulement besoin de textes
basiques ou d'images. Si vous avez besoin d'un contenu de bouton plus
complexe, vous devrez plutôt utiliser ``button()``.

Créer des Elements Button
-------------------------

.. php:method:: button(string $title, array $options = [])

Crée un bouton HTML avec le titre spécifié et un type par défaut "button".
Définir ``$options['type']`` affichera l'un des trois types de boutons
possibles:

#. submit: Comme celui de la méthode ``$this->Form->submit``- (par défaut).
#. reset: Crée un bouton reset.
#. button: Crée un bouton standard.

::

    echo $this->Form->button('A Button');
    echo $this->Form->button('Another Button', ['type' => 'button']);
    echo $this->Form->button('Reset the Form', ['type' => 'reset']);
    echo $this->Form->button('Submit Form', ['type' => 'submit']);

Affichera :

.. code-block:: html

    <button type="submit">A Button</button>
    <button type="button">Another Button</button>
    <button type="reset">Reset the Form</button>
    <button type="submit">Submit Form</button>

L'input de type ``button`` supporte l'option ``escape`` qui accepte un
booléen et détermine si oui ou non l'entité HTML encode le $title du bouton.
Par défaut à ``false``::

    // Va afficher le HTML echappé.
    echo $this->Form->button('<em>Submit Form</em>', [
        'type' => 'submit',
        'escape' => true
    ]);

Fermer le Formulaire
====================

.. php:method:: end($secureAttributes = [])

La méthode ``end()`` ferme et complète le marquage du formulaire. Souvent,
``end()`` affiche juste la base fermante du formulaire, mais l'utilisation de
``end()`` permet également au FormHelper d'ajouter les champs cachées dont le
component Security :php:class:`Cake\\Controller\\Component\\SecurityComponent`
a besoin:

.. code-block:: php

    <?= $this->Form->create(); ?>

    <!-- Elements de formulaire -->

    <?= $this->Form->end(); ?>

Le paramètre ``$secureAttributes`` vous permet de passer des attributs HTML
supplémentaires aux inputs cachés qui sont générés quand votre application
utilise ``SecurityComponent``. Si vous avez besoin d'ajouter des attributs
supplémentaires aux inputs cachés générés, vous pouvez utiliser l'argument
``$secureAttributes``::

    echo $this->Form->end(['data-type' => 'hidden']);

Affichera:

.. code-block:: html

    <div style="display:none;">
        <input type="hidden" name="_Token[fields]" data-type="hidden"
            value="2981c38990f3f6ba935e6561dc77277966fabd6d%3AAddresses.id">
        <input type="hidden" name="_Token[unlocked]" data-type="hidden"
            value="address%7Cfirst_name">
    </div>

.. note::

    Si vous utilisez
    :php:class:`Cake\\Controller\\Component\\SecurityComponent` dans votre
    application, vous devrez terminer vos formulaires avec ``end()``.

Créer des Boutons Indépendants et des liens POST
================================================

.. php:method:: postButton(string $title, mixed $url, array $options = [])

    Crée une balise ``<button>`` avec un ``<form>`` l'entourant  qui soumet à
    travers POST.

    Cette méthode crée un élément ``<form>``. Donc n'utilisez pas
    cette méthode dans un formulaire ouvert. Utilisez plutôt
    :php:meth:`Cake\\View\\Helper\\FormHelper::submit()` ou
    :php:meth:`Cake\\View\\Helper\\FormHelper::button()`
    pour créer des boutons à l'intérieur de formulaires ouvert.

.. php:method:: postLink(string $title, mixed $url = null, array $options = [])

    Crée un lien HTML, mais accède à l'Url en utilisant la méthode POST.
    Requiert que JavaScript soit autorisé dans votre navigateur.

    Cette méthode crée un élément ``<form>``. Si vous souhaitez utiliser cette
    méthode à l'intérieur d'un formulaire existant, vous devez utiliser l'option
    ``block`` pour que le nouveau formulaire soit défini en un :ref:`view block <view-blocks>` qui peut être affiché en dehors du formulaire principal.

    Si vous cherchez un bouton pour soumettre votre formulaire, alors vous
    devriez plutôt utiliser :php:meth:`Cake\\View\\Helper\\FormHelper::button()`
    ou :php:meth:`Cake\\View\\Helper\\FormHelper::submit()`.

    .. note::
        Attention à ne pas mettre un postLink à l'intérieur d'un formulaire
        ouvert. À la place, utilisez l'option ``block`` pour mettre en mémoire
        tampon le formulaire dans des :ref:`view-blocks`

.. _customizing-templates:

Personnaliser les Templates que FormHelper Utilise
==================================================

Comme beaucoup de helpers dans CakePHP, FormHelper utilise les string templates
pour mettre en forme le HTML qu'il crée. Alors que les templates par défaut
sont destinés à être un ensemble raisonnable de valeurs par défaut, vous aurez
peut-être besoin de personnaliser les templates pour correspondre à votre
application.

Pour changer les templates quand le helper est chargé, vous pouvez définir
l'option ``templates`` lors de l'inclusion du helper dans votre controller::

    // Dans une classe de View
    $this->loadHelper('Form', [
        'templates' => 'app_form',
    ]);

Ceci charge les balises dans **config/app_form.php**. Le fichier devra
contenir un tableau des templates indexés par leur nom::

    return [
        'inputContainer' => '<div class="form-control">{{content}}</div>',
    ];

Tous les templates que vous définissez vont remplacer ceux par défaut dans
le helper. Les Templates qui ne sont pas remplacés vont continuer à être
utilisés avec les valeurs par défaut. Vous pouvez aussi changer les templates
à la volée en utilisant la méthode ``setTemplates()``::

    $myTemplates = [
        'inputContainer' => '<div class="form-control">{{content}}</div>',
    ];
    $this->Form->setTemplates($myTemplates);
    // Avant 3.4
    $this->Form->templates($myTemplates);

.. warning::

    Les chaînes de template contenant un signe pourcentage (``%``) nécessitent
    une attention spéciale, vous devriez préfixer ce caractère avec un autre
    pourcentage pour qu'il ressemble à ``%%``. La raison est que les templates
    sont compilés en interne pour être utilisé avec ``sprintf()``.
    Exemple: '<div style="width:{{size}}%%">{{content}}</div>'

Liste des Templates
-------------------

La liste des templates par défaut, leur format par défaut et les variables
qu'ils attendent se trouvent dans la `documentation API du FormHelper <https://api.cakephp.org/3.x/class-Cake.View.Helper.FormHelper.html#%24_defaultConfig>`_.

En plus de ces templates, la méthode ``control()`` va essayer d'utiliser les
templates pour chaque conteneur d'input. Par exemple, lors de la création
d'un input datetime, ``datetimeContainer`` va être utilisé s'il est présent.
Si le conteneur n'est pas présent, le template ``inputContainer`` sera utilisé.
Par exemple::

    // Ajoute du HTML personnalisé autour d'un input radio
    $this->Form->setTemplates([
        'radioContainer' => '<div class="form-radio">{{content}}</div>'
    ]);

    // Crée un ensemble d'inputs radio avec notre div personnalisé autour
    echo $this->Form->radio('User.email_notifications', ['y', 'n']);

De la même manière qu'avec les conteneurs d'input, la méthode ``ìnput()``
essayera d'utiliser différents templates pour chaque groupe de formulaire
(formGroup). Un group de formulaire est un combo d'un label et d'une input.
Par exemple, lorsque vous créez des inputs de type radio, le template
``radioFormGroup`` sera utilisé s'il est présent. Si ce template est manquant,
par défaut chaque ensemble label & input sera généré en utilisant le template
``formGroup``::

    // Ajoute un groupe de formulaire pour radio personnalisé
    $this->Form->setTemplates([
        'radioFormGroup' => '<div class="radio">{{label}}{{input}}</div>'
    ]);

Ajouter des Variables de Template Supplémentaires aux Templates
---------------------------------------------------------------

Vous pouvez aussi ajouter des placeholders de template supplémentaires dans des
templates personnalisés et remplir ces placeholders lors de la génération des
inputs::

    // Ajoute un template avec le placeholder help.
    $this->Form->setTemplates([
        'inputContainer' => '<div class="input {{type}}{{required}}">
            {{content}} <span class="help">{{help}}</span></div>'
    ]);

    // Génère un input et remplit la variable help
    echo $this->Form->control('password', [
        'templateVars' => ['help' => 'Au moins 8 caractères.']
    ]);

.. versionadded:: 3.1
    L'option templateVars a été ajoutée dans 3.1.0

Déplacer les Checkboxes & Boutons Radios à l'Extérieur du Label
---------------------------------------------------------------

Par défaut, CakePHP incorpore les cases à cocher et des boutons radio dans des
éléments label. Cela contribue à faciliter l'intégration des framework CSS
populaires. Si vous avez besoin de placer ces inputs à l'extérieur de la balise
label, vous pouvez le faire en modifiant les templates::

    $this->Form->setTemplates([
        'nestingLabel' => '{{input}}<label{{attrs}}>{{text}}</label>',
        'formGroup' => '{{input}}{{label}}',
    ]);

Cela générera les checkbox et les boutons radio à l'extérieur de leurs labels.

Générer des Formulaires Entiers
===============================

.. php:method:: inputs(mixed $fields = [], $options = [])

Génère un ensemble d'inputs pour un contexte donné. Vous pouvez spécifier les
champs générés en les incluant::

    echo $this->Form->inputs([
        'name',
        'email'
    ]);

Vous pouvez personnaliser le texte de légende en utilisant une option::

    echo $this->Form->inputs($fields, ['legend' => 'Update news post']);

Vous pouvez personnaliser les inputs générés en définissant des options
additionnelles dans le paramètre ``$fields``::

    echo $this->Form->inputs([
        'name' => ['label' => 'custom label']
    ]);

Quand vous personnalisez ``fields``, vous pouvez utiliser le paramètre
``$options`` pour contrôler les legend/fields générés.

- ``fieldset`` Défini à ``false`` pour désactiver le fieldset. Vous pouvez
  également passer un tableau de paramètres qui seront rendus comme attributs
  HTML sur le tag du fieldset. Si vous passez un tableau vide, le fieldset sera
  simplement rendu sans attributs.
- ``legend`` Défini à ``false`` pour désactiver la legend pour l'ensemble
  d'input généré.
  Ou fournir une chaîne pour personnaliser le texte de legend.

Par exemple::

    echo $this->Form->inputs(
        [
            'name' => ['label' => 'custom label']
        ],
        null,
        ['legend' => 'Update your post']
    );

Si vous désactiver le fieldset, la legend ne s'affichera pas.

.. php:method:: allInputs(array $fields, $options = [])

Cette méthode est étroitement liée à ``inputs()``, cependant l'argument
``$fields`` est égal par défaut à *tous* les champs de l'entity de niveau
supérieur actuelle. Pour exclure des champs spécifiques de la liste d'inputs
générées, définissez les à ``false`` dans le paramètre fields::

    echo $this->Form->allInputs(['password' => false]);

.. _associated-form-inputs:

Créer des Inputs pour les Données Associées
===========================================

Créer des formulaires pour les données associées est assez simple et est
étroitement lié au chemins des données de votre entity. Imaginons les
relations suivantes:

* Authors HasOne Profiles
* Authors HasMany Articles
* Articles HasMany Comments
* Articles BelongsTo Authors
* Articles BelongsToMany Tags

Si nous éditions un article avec ces associations chargées, nous pourrions
créer les inputs suivantes::

    $this->Form->create($article);

    // Inputs article
    echo $this->Form->control('title');

    // Inputs auteur (belongsTo)
    echo $this->Form->control('author.id');
    echo $this->Form->control('author.first_name');
    echo $this->Form->control('author.last_name');

    // Profile de l'auteur (belongsTo + hasOne)
    echo $this->Form->control('author.profile.id');
    echo $this->Form->control('author.profile.username');

    // Tags inputs (belongsToMany)
    echo $this->Form->control('tags.0.id');
    echo $this->Form->control('tags.0.name');
    echo $this->Form->control('tags.1.id');
    echo $this->Form->control('tags.1.name');

    // Select multiple pour belongsToMany
    echo $this->Form->control('tags._ids', [
        'type' => 'select',
        'multiple' => true,
        'options' => $tagList,
    ]);

    // Inputs pour la table de jointure (articles_tags)
    echo $this->Form->control('tags.0._joinData.starred');
    echo $this->Form->control('tags.1._joinData.starred');

    // Inputs commentaires (hasMany)
    echo $this->Form->control('comments.0.id');
    echo $this->Form->control('comments.0.comment');
    echo $this->Form->control('comments.1.id');
    echo $this->Form->control('comments.1.comment');

Le code ci-dessus pourrait ensuite être converti en un graph d'entity en
utilisant le code suivant dans votre controller::

    $article = $this->Articles->patchEntity($article, $this->request->getData(), [
        'associated' => [
            'Authors',
            'Authors.Profiles',
            'Tags',
            'Comments'
        ]
    ]);

Ajouter des Widgets Personnalisés
=================================

CakePHP permet d'ajouter des widgets personnalisés dans votre application, afin
de les utiliser comme n'importe quel input. Tous les types d'input que contient
le cœur de cake sont implémentés comme des widgets. Ainsi vous pouvez remplacer
n'importe quel widget de base par votre propre implémentation.

Construire une Classe Widget
----------------------------

Les classes Widget ont une interface requise vraiment simple. Elles doivent
implémenter la :php:class:`Cake\\View\\Widget\\WidgetInterface`. Cette interface
nécessite que les méthodes ``render(array $data)`` et
``secureFields(array $data)`` soient implémentées. La méthode ``render()``
attend un tableau de données pour construire le widget et doit renvoyer une
chaine HTML pour le widget. La méthode ``secureFields()`` attend également un
tableau de données et doit retourner un tableau contenant la liste des champs à
sécuriser pour ce widget. Si CakePHP construit votre widget, vous pouvez
vous attendre à recevoir une instance de ``Cake\View\StringTemplate`` en premier
argument, suivi de toutes les dépendances que vous aurez définies. Si vous
voulez construire un widget Autocomplete, vous pouvez le faire comme ceci::

    namespace App\View\Widget;

    use Cake\View\Form\ContextInterface;
    use Cake\View\Widget\WidgetInterface;

    class AutocompleteWidget implements WidgetInterface
    {

        protected $_templates;

        public function __construct($templates)
        {
            $this->_templates = $templates;
        }

        public function render(array $data, ContextInterface $context)
        {
            $data += [
                'name' => '',
            ];
            return $this->_templates->format('autocomplete', [
                'name' => $data['name'],
                'attrs' => $this->_templates->formatAttributes($data, ['name'])
            ]);
        }

        public function secureFields(array $data)
        {
            return [$data['name']];
        }
    }


Évidemment, c'est un exemple très simple, mais il montre comment développer
un widget personnalisé. Ce widget ferait un rendu du template "autocomplete",
si défini comme ceci par exemple::

    $this->Form->setTemplates([
        'autocomplete' => '<input type="autocomplete" name="{{name}}" {{attrs}} />'
    ]);

Utiliser les Widgets
--------------------

Vous pouvez charger des widgets personnalisés lors du chargement du FormHelper
ou en utilisant la méthode ``addWidget()``. Lors du changement du FormHelper,
les widgets sont définis comme des paramètres::

    // Dans une classe de View
    $this->loadHelper('Form', [
        'widgets' => [
            'autocomplete' => ['Autocomplete']
        ]
    ]);

Si votre widget nécessite d'autres widgets, le FormHelper peut remplir ces
dépendances lorsqu'elles sont déclarées::

    $this->loadHelper('Form', [
        'widgets' => [
            'autocomplete' => [
                'App\View\Widget\AutocompleteWidget',
                'text',
                'label'
            ]
        ]
    ]);

Dans l'exemple ci-dessus, le widget autocomplete widget dépendrait des widgets
``text`` et ``label``.Si votre widget doit accéder à la View, vous devrez
utiliser le 'widget' ``_view``. Lorsque le widget autocomplete est créé, les
objets widget liés au noms ``text`` et ``label`` lui sont passés. Ajouter des
widgets en utilisant la méthode ``addWidget`` resemble à ceci::

    // Utilise une classname.
    $this->Form->addWidget(
        'autocomplete',
        ['Autocomplete', 'text', 'label']
    );

    // Utilise une instance - nécessite de résoudre les dépendances.
    $autocomplete = new AutocompleteWidget(
        $this->Form->getTemplater(),
        $this->Form->widgetRegistry()->get('text'),
        $this->Form->widgetRegistry()->get('label'),
    );
    $this->Form->addWidget('autocomplete', $autocomplete);

Une fois ajoutés/remplacés, les widgets peuvent être utilisés en tant que
'type' de l'input::

    echo $this->Form->control('search', ['type' => 'autocomplete']);

Cela créera un widget personnalisé avec un label et une div enveloppante
tout comme ``control()`` le fait toujours. Sinon vous pouvez juste créer un widget
input en utilisant la méthode magique::

    echo $this->Form->autocomplete('search', $options);

Travailler avec SecurityComponent
=================================

:php:meth:`Cake\\Controller\\Component\\SecurityComponent` offre plusieurs
fonctionnalités qui rendent vos formulaires plus sûrs et
plus sécurisés. En incluant simplement le ``SecurityComponent`` dans votre
controller, vous bénéficierez automatiquement des fonctionnalités de prévention
contre la falsification de formulaires.

Tel que mentionné précédemment, lorsque vous utilisez le SecurityComponent,
vous devez toujours fermer vos formulaires en utilisant
:php:meth:`~Cake\\View\\Helper\\FormHelper::end()`. Cela assurera que les
inputs spéciales ``_Token`` soient générées.

.. php:method:: unlockField($name)

    Déverrouille un champ en l’exemptant du hashage de ``SecurityComponent``.
    Cela autorise également à manipuler le champ via JavaScript.
    Le paramètre ``$name`` doit correspondre au nom de la propriété de l'entity
    pour l'input::

        $this->Form->unlockField('id');

.. php:method:: secure(array $fields = [])

    Génère un champ caché avec un hash de sécurité basé sur les champs utilisés
    dans le formulaire.

.. meta::
    :title lang=fr: FormHelper
    :description lang=fr: The FormHelper focuses on creating forms quickly, in a way that will streamline validation, re-population and layout.
    :keywords lang=fr: form helper,cakephp form,form create,form input,form select,form file field,form label,form text,form password,form checkbox,form radio,form submit,form date time,form error,validate upload,unlock field,form security
