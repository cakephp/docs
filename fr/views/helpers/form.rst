Form
####

.. php:namespace:: Cake\View\Helper

.. php:class:: FormHelper(View $view, array $config = [])

Le FormHelper prend en charge la plupart des opérations lourdes de la création
de formulaire. Le FormHelper se concentre sur la possibilité de créer des
formulaires rapidement, d'une manière qui permettra de rationaliser la
validation, la re-population et la mise en page (layout). Le FormHelper est
aussi flexible - il va faire à peu près tout pour vous en utilisant les
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
  `EntityContext <https://api.cakephp.org/4.x/class-Cake.View.Form.EntityContext.html>`_;
  ce contexte permet au FormHelper de fonctionner avec les retours de l'ORM
  intégré.

* Un tableau contenant la clé ``schema``, qui mappe vers
  `ArrayContext <https://api.cakephp.org/4.x/class-Cake.View.Form.ArrayContext.html>`_
  ce qui vous permet de créer des structures simples de données pour construire
  des formulaires.

* ``null`` et ``false`` mappe vers
  `NullContext <https://api.cakephp.org/4.x/class-Cake.View.Form.NullContext.html>`_;
  cette classe de contexte satisfait simplement l'interface requise par FormHelper.
  Ce contexte est utile si vous voulez construire un formulaire court qui ne nécessite
  pas de persistance via l'ORM.

Une fois qu'un formulaire a été créé avec un contexte, tous les inputs que vous
créez vont utiliser le contexte actif. Dans le cas d'un formulaire basé sur
l'ORM, FormHelper peut accéder aux données associées, aux erreurs de validation
et aux metadata du schema. Vous pouvez fermer le contexte actif en utilisant la
méthode ``end()``, ou en appelant ``create()`` à nouveau. Pour créer un
formulaire pour une entity, faites ce qui suit::

    // Si vous êtes sur /articles/add
    // $article devra être une entity Article vide.
    echo $this->Form->create($article);

Affichera:

.. code-block:: html

    <form method="post" action="/articles/add">

Celui-ci va POSTer les données de formulaire à l'action ``add()`` de
``ArticlesController``. Cependant, vous pouvez utiliser la même logique pour
créer un formulaire d'édition. Le FormHelper utilise l'objet ``Entity`` pour
détecter automatiquement s'il faut créer un formulaire d'ajout (*add*) ou un
d'édition (*edit*). Si l'entity fournie n'est pas 'nouvelle', le form va être
créé comme un formulaire d'édition.

Par exemple, si nous naviguons vers **http://example.org/articles/edit/5**,
nous pourrions faire ce qui suit::

    // src/Controller/ArticlesController.php:
    public function edit($id = null)
    {
        if (empty($id)) {
            throw new NotFoundException;
        }
        $article = $this->Articles->get($id);
        // La logique d'enregistrement ici
        $this->set('article', $article);
    }

    // View/Articles/edit.php:
    // Puisque $article->isNew() est false, nous aurons un formulaire d'édition
    <?= $this->Form->create($article) ?>

Affichera:

.. code-block:: html

    <form method="post" action="/articles/edit/5">
    <input type="hidden" name="_method" value="PUT" />

.. note::

    Puisque c'est un formulaire d'édition, un champ input caché est généré
    pour surcharger la méthode HTTP par défaut.

Dans certains cas, l'ID de l'entité est automatiquement ajoutée à la fin de
l'URL ``action`` du formulaire. Si vous voulez *éviter* qu'un ID soit ajouté à
l'URL, vous pouvez passer une chaîne dans ``$options['url']``, telle que
``'/my-account'`` ou
``\Cake\Routing\Router::url(['controller' => 'Users', 'action' => 'myAccount'])``.

Options pour la Création de Formulaire
--------------------------------------

Le tableau ``$options`` est l'endroit où se passe l'essentiel de la
configuration du formulaire. Ce tableau spécial peut contenir un
certain nombre de paires clé-valeur différentes qui affectent la façon dont
la balise form est générée. Voici les valeurs autorisées:

* ``'type'`` - Vous permet de choisir le type de formulaire à créer. Si vous ne
  fournissez pas de type, il sera automatiquement détecté en fonction du 'context'
  du formulaire. Cette option peut prendre une des valeurs suivantes:

  * ``'get'`` - Définira la ``method`` du formulaire à GET.
  * ``'file'`` - Définira la ``method`` du formulaire à POST et le ``'enctype'``
    à "multipart/form-data".
  * ``'post'`` - Définira la ``method`` à POST.
  * ``'put', 'delete', 'patch'`` - Écrasera la méthode HTTP avec PUT, DELETE ou
    PATCH, respectivement, quand le formulaire sera soumis.

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
  laquelle le formulaire devra se baser).

* ``'idPrefix'`` - Préfixe à utiliser pour les attributs ``id`` des éléments du
  formulaire.

* ``'templateVars'`` - Vous permet de définir des variables de template pour le
  template ``formStart``.

* ``autoSetCustomValidity`` - Défini à ``true`` pour utiliser des messages de
  validation personnalisés pour required et notBlank dans le message de validité
  HTML5 du contrôle. Par défaut ``true``.

.. tip::

    Vous pouvez, en plus des options définies ci-dessus, définir dans l'argument
    ``$options``, tous les attributs HTML que vous pourriez vouloir passer à
    l'élément ``form`` (des classes, des attributs ``data``, etc.).

.. _form-values-from-query-string:

Récupérer les valeurs du formulaire depuis d'autres sources
-----------------------------------------------------------

Les sources de valeurs du FormHelper définissent d'où les éléments du
formulaire reçoivent leurs valeurs.

Les sources supportées sont ``context``, ``data`` et ``query``. Vous pouvez
utiliser une ou plusieurs de ces sources en définissant l'option
``valueSources`` ou en appelant ``setValuesSource()``. Tous les éléments générés
par ``FormHelper`` vont collecter leurs valeurs à partir de ces sources, dans
l'ordre que vous aurez défini.

Par défaut, Formhelper récupère ses valeurs depuis les ``data`` ou le "context",
c'est-à-dire qu'il va récupérer les données avec ``$request->getData()`` ou, si
elles sont absentes, à partir des données du contexte actif, qui sont les
données de l'entity dans le cas de ``EntityContext``.

Cependant, si vous construisez un formulaire qui a besoin d'aller récupérer ses
valeurs dans la query string, vous pouvez utiliser ``valueSource()`` pour
définir où le ``FormHelper`` doit aller récupérer les valeurs de ses champs::

    // Donner la priorité à la query string plutôt qu'au contexte
    echo $this->Form->create($article, [
        'type' => 'get',
        'valueSources' => ['query', 'context']
    ]);

    // Même effet:
    echo $this->Form
        ->setValueSources(['query', 'context'])
        ->create($articles, ['type' => 'get']);

Lorsque les données reçues ont besoin d'être traitées par l'entity (c'est-à-dire
les convertir, traiter une table ou computer des entités) et affichées après
une ou plusieurs soumissions de formulaire pendant lesquelles les données de la
requête sont conservées, vous aurez besoin de placer ``context`` en premier::

    // Donner la priorité au contexte par rapport aux données de la requête:
    echo $this->Form->create($article,
        'valueSources' => ['context', 'data']
    ]);

Les sources définies seront réinitialisées à leur valeur par défaut
``['data', 'context']`` quand ``end()`` sera appelée.

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
Par exemple, si vous voulez diriger le formulaire vers une action ``publish()``
du controller courant, vous pouvez fournir le tableau ``$options`` comme suit::

    echo $this->Form->create($article, ['url' => ['action' => 'publish']]);

Affichera:

.. code-block:: html

    <form method="post" action="/articles/publish">

Si l'action que vous désirez appeler avec le formulaire n'est pas dans le
controller courant, vous pouvez spécifier une URL dans le formulaire. L'URL
fournie peut être relative à votre application CakePHP::

    echo $this->Form->create(null, [
        'url' => [
            'controller' => 'Articles',
            'action' => 'publish'
        ]
    ]);

Affichera:

.. code-block:: html

    <form method="post" action="/articles/publish">

ou pointer vers un domaine extérieur::

    echo $this->Form->create(null, [
        'url' => 'https://www.google.com/search',
        'type' => 'get'
    ]);

Affichera:

.. code-block:: html

    <form method="get" action="https://www.google.com/search">

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
pour les commentaires de l'utilisateur. FormHelper utilise les validateurs pour
générer les attributs HTML5 *required*, les attributs ARIA appropriés, et
définir les messages d'erreur avec la `browser validator API
<https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation#Customized_error_messages>`_
. Si vous voulez désactiver les messages de validation HTML5, utilisez::

    $this->Form->setConfig('autoSetCustomValidity', false);

Cela ne désactivera pas les attributs``required``/``aria-required``.

Créer des Classes de Contexte
-----------------------------

Alors que les classes de contexte intégrées essaient de couvrir les cas
habituels que vous pouvez rencontrer, vous pouvez avoir besoin de construire
une nouvelle classe de contexte si vous utilisez un ORM différent. Dans ces
situations, vous devrez implémenter `Cake\\View\\Form\\ContextInterface
<https://api.cakephp.org/4.x/interface-Cake.View.Form.ContextInterface.html>`_ . Une
fois que vous avez implémenté cette interface, vous pouvez connecter votre
nouveau contexte dans le FormHelper. Le mieux est souvent de le faire dans un
event listener ``View.beforeRender``, ou dans une classe de vue de
l'application::

    $this->Form->addContextProvider('myprovider', function ($request, $data) {
        if ($data['entity'] instanceof MyOrmClass) {
            return new MyProvider($data);
        }
    });

Les fonctions de fabrique de contexte sont l'endroit où vous pouvez ajouter la
logique pour vérifier les options du formulaire pour le type d'entity approprié.
Si une donnée d'entrée correspondante est trouvée, vous pouvez retourner un
objet. Si n'y a pas de correspondance, retournez null.

.. _automagic-form-elements:

Création d'éléments de Formulaire
=================================

.. php:method:: control(string $fieldName, array $options = [])

* ``$fieldName`` - Nom du champ (attribut ``name``) de l'élément sous la forme
  ``'Modelname.fieldname'``.
* ``$options`` - Un tableau d'option qui peut inclure à la fois des :ref:`control-specific-options`
  et des options d'autres méthodes (que la méthode ``control()`` utilise en interne
  pour générer les différents éléments HTML) ainsi que attribut HTML valide.

La méthode ``control()`` vous permet de générer des inputs de formulaire
complets. Ces inputs inclueront une div enveloppante, un label, un widget
d'input, et une erreur de validation si besoin. En utilisant les metadonnées
dans le contexte du formulaire, cette méthode va choisir un type d'input
approprié pour chaque champ. En interne, ``control()`` utilise les autres
méthodes de FormHelper.

.. tip::

    Veuillez notez que, même si les éléments générés par la méthode ``control()``
    sont appelés des "inputs" sur cette page, techniquement parlant, la méthode
    ``control()`` peut générer non seulement n'importe quel type de balise
    ``input`` mais aussi tous les autres types d'éléments HTML de formulaire
    (``select``, ``button``, ``textarea``).

Par défaut, la méthode ``control()`` utilisera les templates de widget suivant::

    'inputContainer' => '<div class="input {{type}}{{required}}">{{content}}</div>'
    'input' => '<input type="{{type}}" name="{{name}}"{{attrs}}/>'

En cas d'erreurs de validation, elle utilisera également::

    'inputContainerError' => '<div class="input {{type}}{{required}} error">{{content}}{{error}}</div>'

Le type d'élément créé, dans le cas où aucune autre option n'est fournie pour
générer le type d'élément, est induit par l'introspection du Model et dépendra
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
    date
datetime, timestamp
    datetime-local
datetimefractional, timestampfractional
    datetime-local
time
    time
month
    month
year
    select avec des années
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
*username* (varchar), *password* (varchar), *approved* (datetime) et
*quote* (text). Vous pouvez utiliser la méthode ``control()`` du FormHelper pour
créer les bons inputs pour tous ces champs de formulaire::

    echo $this->Form->create($user);
    // Va générer un input type="text"
    echo $this->Form->control('username');
    // Va générer un input type="password"
    echo $this->Form->control('password');
    // En partant du principe que 'approved' est un "datetime" ou un "timestamp",
    // va générer un input de type "datetime-local"
    echo $this->Form->control('approved');
    // Va générer un textarea
    echo $this->Form->control('quote');

    echo $this->Form->button('Ajouter');
    echo $this->Form->end();

Un exemple plus complet montrant quelques options pour le champ de date::

    echo $this->Form->control('birth_date', [
        'label' => 'Date de naissance',
        'min' => date('Y') - 70,
        'max' => date('Y') - 18,
     ]);

Outre les :ref:`control-specific-options` vues ci-dessus, vous pouvez spécifier
n'importe quelle option acceptée par la méthode spécifique au widget choisi (ou
déduit par CakePHP) et n'importe quel attribut HTML (par exemple ``onfocus``).

Si vous voulez un ``select`` utilisant une relation *belongsTo* ou *hasOne*,
vous pouvez ajouter ceci dans votre controller Users (en supposant que
l'User *belongsTo* Group)::

    $this->set('groups', $this->Users->Groups->find('list')->all());

Après cela, ajoutez les lignes suivantes à votre template de vue du formulaire::

    echo $this->Form->control('group_id', ['options' => $groups]);

Pour créer un ``select`` pour l'association *belongsToMany* Groups, vous pouvez
ajouter ce qui suit dans votre UsersController::

    $this->set('groups', $this->Users->Groups->find('list')->all());

Ensuite, ajouter les lignes suivantes à votre template de vue::

    echo $this->Form->control('groups._ids', ['options' => $groups]);

Si votre nom de model est composé de deux mots ou plus (ex. "UserGroup"),
quand vous passez les données en utilisant ``set()`` vous devrez nommer vos
données dans un `format CamelCase <https://fr.wikipedia.org/wiki/Camel_case#Variations_et_synonymes>`_
(les Majuscules séparent les mots) et au pluriel comme ceci::

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

Vous pouvez créer des inputs pour les models associés, ou pour des models
arbitraires en le passant dans ``association.fieldname`` en premier paramètre::

    echo $this->Form->control('association.fieldname');

Tout point dans vos noms de champs sera converti en données de requête
imbriquées. Par exemple, si vous créez un champ avec un nom
``0.comments.body`` vous aurez un nom d'attribut qui sera
``0[comments][body]``. Cette convention coorespond à celle de l'ORM. Plus de
détails pour tous les types d'associations se trouvent
dans la section :ref:`associated-form-inputs`.

Lors de la création d'inputs de type datetime, FormHelper va ajouter un
suffixe au champ. Vous pouvez remarquer des champs supplémentaires nommés
``year``, ``month``, ``day``, ``hour``, ``minute``, ou ``meridian`` qui
ont été ajoutés. Ces champs seront automatiquement convertis en objets
``DateTime`` quand les entities seront traitées.

.. _control-specific-options:

Options pour la méthode control()
---------------------------------

``FormHelper::control()`` supporte un nombre important d'options via son
paramètre ``$options``. En plus de ses propres options, ``control()``
accepte des options pour les champs input générés (devinés ou choisis, comme les
``checkbox`` ou les ``textarea``), ou encore les attributs HTML. Ce qui suit va
couvrir les options spécifiques de ``FormHelper::control()``.

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

* ``$options['label']`` Soit une chaîne qui sera utilisée comme valeur pour
  l'élément HTML ``<label>``, soit un tableau :ref:`d'options pour le label<create-label>`.
  Vous pouvez placer sous cette clé le texte que vous voudriez voir affiché dans
  le label qui accompagne habituellement les éléments HTML ``input``. Le défaut
  est ``null``.

  Par exemple::

      echo $this->Form->control('name', [
          'label' => 'The User Alias'
      ]);

  Affiche:

  .. code-block:: html

      <div class="input">
          <label for="name">The User Alias</label>
          <input name="name" type="text" value="" id="name" />
      </div>

  Vous pouvez définir cette clé à ``false`` pour désactiver l'affichage de
  l'élément ``<label>``
  Par exemple::

      echo $this->Form->control('name', ['label' => false]);

  Affiche:

  .. code-block:: html

      <div class="input">
          <input name="name" type="text" value="" id="name" />
      </div>

  Si le label est désactivé et qu'un attribut ``placeholder`` est fourni,
  l'input généré aura un ``aria-label`` défini.

  Définissez l'option ``label`` comme un tableau pour fournir des options
  supplémentaires pour l'élément ``label``. Si vous faites ainsi, vous pouvez
  utiliser une clé ``text``
  dans le tableau pour personnaliser le texte du label::
  Par exemple::

      echo $this->Form->control('name', [
          'label' => [
              'class' => 'thingy',
              'text' => 'The User Alias'
          ]
      ]);

  Affiche:

  .. code-block:: html

      <div class="input">
          <label for="name" class="thingy">The User Alias</label>
          <input name="name" type="text" value="" id="name" />
      </div>

* ``$options['options']`` - Vous pouvez passer à cette option un tableau
  contenant les choix pour les éléments comme les ``radio`` et les ``select``,
  qui ont besoin d'un tableau d'items en argument. Reportez-vous à
  :ref:`create-radio-button` et :ref:`create-select-picker` pour plus de
  détails. Le défaut est ``null``.

* ``$options['error']`` Utiliser cette clé vous permettra de transformer
  les messages par défaut du model et de les utiliser, par exemple, pour
  définir des messages i18n. Pour désactiver le rendu des messages d'erreurs
  définissez la clé ``error`` à ``false``::

      echo $this->Form->control('name', ['error' => false]);

  Pour surcharger les messages d'erreurs du model utilisez un tableau
  avec les clés respectant les messages d'erreurs de validation originaux::

      $this->Form->control('name', [
          'error' => ['Not long enough' => __('This is not long enough')]
      ]);

  Comme vu précédemment, vous pouvez définir le message d'erreur pour chaque
  règle de validation présente dans vos models. De plus, vous pouvez fournir des
  messages i18n pour vos formulaires.

* ``$options['nestedInput']`` - À utiliser avec les inputs ``checkbox`` et
  ``radio``. Cette option permet de contrôler si les éléments ``input`` doivent
  être générés à l'intérieur ou à l'extérieur de l'élément ``label``. Quand
  ``control()`` génère une checkbox ou un bouton radio, vous pouvez définir
  l'option à ``false`` pour forcer la génération de l'élément ``input`` en
  dehors du ``label``.

  D'autre part, vous pouvez également la définir à ``true`` pour n'importe quel
  type d'élément pour forcer la génération de l'élément ``input`` dans le
  ``label``. Si vous changez l'option pour les boutons radio, vous aurez
  également besoin de modifier le template par défaut
  :ref:`'radioWrapper'<create-radio-button>`. Selon le ``type`` d'élément à
  générer, la valeur par défaut sera ``true`` ou ``false``.

* ``$options['templates']`` - Les templates à utiliser pour cet ``input``.
  N'importe quel template spécifié via cette option surchargera les templates
  déjà chargés. Cette option accepte soit un nom de fichier (sans extension)
  provenant de ``/config`` qui contient les templates à charger, soit un tableau
  définissant les templates à utiliser.

* ``$options['labelOptions']`` - Définissez l'option à ``false`` pour désactiver
  les ``label`` autour des ``nestedWidgets`` ou bien définissez un tableau
  d'attributs à appliquer à l'élément ``label``.

Générer des Types d'Inputs Spécifiques
======================================

En plus de la méthode générique ``control()``, le ``FormHelper`` a des
méthodes spécifiques pour générer différents types d'inputs. Ceci peut
être utilisé pour générer juste un extrait de code input, et combiné avec
d'autres méthodes comme :php:meth:`~Cake\\View\\Helper\\FormHelper::label()` et
:php:meth:`~Cake\\View\\Helper\\FormHelper::error()` pour générer des layouts
(mise en page) complètement personnalisés.

.. _general-control-options:

Options Communes à Tous les Inputs
----------------------------------

Parmi les différentes méthodes d'input, beaucoup supportent un jeu d'options
communes qui, selon la méthode de formulaire utilisée, doivent être insérées
soit sous la clé ``$options`` soit sous la clé ``$attributes`` du tableau en
argument. Toutes ces options sont aussi supportées par ``control()``.
Pour réduire les répétitions, les options communes partagées par toutes les
méthodes input sont:

* ``id`` Définir cette clé pour forcer la valeur du DOM id pour cet
  input. Cela remplacera l'``idPrefix`` qui pourrait être fixé.

* ``default`` Utilisé pour définir une valeur par défaut au champ
  input. La valeur est utilisée si les données passées au formulaire ne
  contiennent pas de valeur pour le champ (ou si aucune donnée n'est
  transmise). Si aucune valeur par défaut n'est définie, c'est la valeur par
  défaut de la colonne qui sera utilisée.

  Exemple d'utilisation::

      echo $this->Form->text('ingredient', ['default' => 'Sucre']);

  Exemple avec un champ ``select`` (la taille "Medium" sera sélectionnée par
  défaut)::

      $sizes = ['s' => 'Small', 'm' => 'Medium', 'l' => 'Large'];
      echo $this->Form->select('size', $sizes, ['default' => 'm']);


  .. note::

      Vous ne pouvez pas utiliser ``default`` pour sélectionner une checkbox -
      vous devez plutôt définir cette valeur dans ``$this->request->getData()`` dans
      votre controller, ou définir l'option ``checked`` de l'input à ``true``.

      Attention à l'utilisation de ``false`` pour assigner une valeur par défaut.
      Une valeur ``false`` est utilisée pour désactiver/exclure les options d'un
      champ, ainsi ``'default' => false`` ne définirait aucune valeur. À la place,
      utilisez ``'default' => 0``.

* ``value`` Utilisée pour définir une valeur spécifique pour le
  champ d'input. Ceci va surcharger toute valeur qui aurait pu être injectée à
  partir du contexte, comme Form, Entity or ``request->getData()`` etc.

  .. note::

      Si vous souhaitez définir un champ pour qu'il ne rende pas sa valeur
      récupérée à partir du contexte ou de valuesSource, vous devrez définir
      ``value`` à ``''`` (au lieu de le définir à ``null``).

En plus des options ci-dessus, vous pouvez y mélanger n'importe quel attribut
HTML que vous souhaitez utiliser. Tout nom d'option non spécifiquement prévu par
CakePHP sera traité comme un attribut HTML, et appliqué à l'élément HTML input
généré.

Créer des Éléments Input
========================

Les autres méthodes disponibles dans le FormHelper permettent la création
d'éléments spécifiques de formulaire. La plupart de ces méthodes utilisent
également un paramètre spécial ``$options`` ou ``$attributes``. Toutefois, dans
ce cas, ce paramètre est utilisé en priorité pour spécifier les attributs des
balises HTML (comme la valeur ou le DOM id d'un élément du formulaire).

Créer des Inputs Text
---------------------

.. php:method:: text(string $name, array $options)

* ``$name`` - Le nom du champ (attribut ``name``) sous la forme
  ``'Modelname.fieldname'``.
* ``$options`` - Un tableau optionnel pouvant contenir n'importe quelles
  :ref:`options générales<general-control-options>` ainsi que n'importe
  quels attributs HTML valides.

Va créer un ``input`` de type ``text``::

    echo $this->Form->text('username', ['class' => 'users']);

Affichera:

.. code-block:: html

    <input name="username" type="text" class="users">

Créer des Inputs Password
-------------------------

.. php:method:: password(string $fieldName, array $options)

* ``$name`` - Le nom du champ (attribut ``name``) sous la forme
  ``'Modelname.fieldname'``.
* ``$options`` - Un tableau optionnel pouvant contenir n'importe quelles
  :ref:`options générales<general-control-options>` ainsi que n'importe
  quels attributs HTML valides.

Création d'un input simple de type ``password``::

    echo $this->Form->password('password');

Affichera:

.. code-block:: html

    <input name="password" value="" type="password">

Créer des Inputs Cachés
-----------------------

.. php:method:: hidden(string $fieldName, array $options)

* ``$name`` - Le nom du champ (attribut ``name``) sous la forme
  ``'Modelname.fieldname'``.
* ``$options`` - Un tableau optionnel pouvant contenir n'importe quelles
  :ref:`options générales<general-control-options>` ainsi que n'importe
  quels attributs HTML valides.

Créera un input de type ``hidden``. Exemple::

    echo $this->Form->hidden('id');

Affichera:

.. code-block:: html

    <input name="id" type="hidden" />

Créer des Textareas
-------------------

.. php:method:: textarea(string $fieldName, array $options)

* ``$name`` - Le nom du champ (attribut ``name``) sous la forme
  ``'Modelname.fieldname'``.
* ``$options`` - Un tableau optionnel pouvant contenir n'importe quelles
  :ref:`options générales<general-control-options>`, des options spécifiques aux
  textareas (cf. ci-dessous) ou encore  n'importe quels attributs HTML valides.

Crée un champ ``textarea`` (zone de texte). Le template utilisé par défaut est::

    'textarea' => '<textarea name="{{name}}"{{attrs}}>{{value}}</textarea>'

Par exemple::

    echo $this->Form->textarea('notes');

Affichera:

.. code-block:: html

    <textarea name="notes"></textarea>

Si le formulaire est un formulaire d'édition (c'est-à-dire si le tableau
``$this->request->getData()`` contient des informations précédemment
sauvegardées pour l'entity ``User``), la valeur correspondant au champ ``notes``
sera automatiquement ajoutée au HTML généré. Exemple:

.. code-block:: html

    <textarea name="notes" id="notes">
        Ce Texte est fait pour être édité.
    </textarea>

**Options pour Textarea**

En plus des :ref:`options générales<general-control-options>`, ``textarea()``
supporte quelques autres options spécifiques:

* ``'escape'`` - Permet de définir si le contenu du ``textarea`` doit être
  échappé ou non. Le défaut est ``true``.

  Par exemple::

      echo $this->Form->textarea('notes', ['escape' => false]);
      // OU....
      echo $this->Form->control('notes', ['type' => 'textarea', 'escape' => false]);

* ``'rows', 'cols'`` - Ces deux clés permettent de définir les attributs HTML
  du même nom et qui désignent respectivement le nombre de lignes et de
  colonnes::;

      echo $this->Form->textarea('comment', ['rows' => '5', 'cols' => '5']);

  Affichera:

  .. code-block:: html

      <textarea name="textarea" cols="5" rows="5">
      </textarea>

Créer des Select, des Checkbox et des Boutons Radio
---------------------------------------------------

Ces éléments ont certains points communs et des options communes, c'est pourquoi
ils sont regroupés dans cette section.

.. _checkbox-radio-select-options:

Les Options pour Select, Checkbox et Boutons Radio
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Vous trouverez ci-dessous les options partagées par ``select()``,
``checkbox()`` et ``radio()`` (les options spécifiques à une seule méthode sont
décrites dans les sections dédiées à ces méthodes).

* ``value`` - Permet de définir ou sélectionner la valeur de l'élément ciblé:

  * Pour les checkboxes, cela définit l'attribut HTML ``value`` assigné à
    l'input à la valeur que vous définissez.

  * Pour les boutons radio ou les select, cela définit quel élément sera
    sélectionné quand le formulaire sera rendu (dans ce cas, ``'value'`` doit
    avoir une valeur valide, correspondant à un élément qui existe). Elle peut
    aussi être utilisée avec n'importe quel élément basé sur un select comme
    ``date()``, ``time()``, ``dateTime()``::

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
      echo $this->Form->select(
          'rooms',
          [1, 2, 3, 4, 5],
          [
              'multiple' => true,
              'value' => [1, 3]
          ]
      );

* ``empty`` - S'applique à ``radio()`` et ``select()``. Le défaut est ``false``.

  * Quand elle est passée à ``radio()`` et définie à ``true``, cela crée un
    élément ``input`` supplémentaire qui sera affiché avant le premier bouton
    radio, avec une valeur de ``''`` et un ``label`` qui vaudra ``'empty'``. Si
    vous voulez un autre texte pour le label définissez la chaîne que vous
    voulez plutôt que ``true``.

  * Quand elle est passée à la méthode ``select``, cela crée un élément
    ``option`` vide avec une valeur vide dans la liste des choix. Si à la place
    d'une valeur vide vous souhaitez afficher un texte, passez une chaîne dans
    l'option::

        echo $this->Form->select(
            'field',
            [1, 2, 3, 4, 5],
            ['empty' => '(choisissez)']
        );

    Affiche:

    .. code-block:: html

        <select name="field">
            <option value="">(choisissez)</option>
            <option value="0">1</option>
            <option value="1">2</option>
            <option value="2">3</option>
            <option value="3">4</option>
            <option value="4">5</option>
        </select>

* ``hiddenField`` Pour les checkboxes et les boutons radios, par défaut, un
  input caché est créé près de l'élément. Ainsi, la clé dans
  ``$this->request->getData()`` existera même sans valeur spécifiée. Pour les
  checkboxes, sa valeur vaudra ``0`` ; pour les boutons radio, elle sera ``''``.

  Exemple d'un rendu par défaut:

  .. code-block:: html

      <input type="hidden" name="published" value="0" />
      <input type="checkbox" name="published" value="1" />

  Ceci peut être désactivé en définissant l'option ``hiddenField`` à ``false``::

      echo $this->Form->checkbox('published', ['hiddenField' => false]);

  Retournera:

  .. code-block:: html

      <input type="checkbox" name="published" value="1">

  Si vous voulez créer de multiples blocs d'entrées regroupés
  ensemble dans un formulaire, vous devriez définir ce paramètre à ``false``
  sur tous les inputs, excepté le premier. Si l'input caché est à plusieurs
  endroits dans la page, c'est seulement le dernier groupe d'inputs qui sera
  sauvegardé.

  Dans cet exemple , seules les couleurs tertiaires seront passées,
  et les couleurs primaires seront écrasées:

  .. code-block:: html

      <h2>Couleurs primaires</h2>
      <input type="hidden" name="color" value="0" />
      <label for="color-red">
          <input type="checkbox" name="color[]" value="5" id="color-red" />
          Rouge
      </label>

      <label for="color-blue">
          <input type="checkbox" name="color[]" value="5" id="color-blue" />
          Bleu
      </label>

      <label for="color-yellow">
          <input type="checkbox" name="color[]" value="5" id="color-yellow" />
          Jaune
      </label>

      <h2>Couleurs tertiaires</h2>
      <input type="hidden" name="color" value="0" />
      <label for="color-green">
          <input type="checkbox" name="color[]" value="5" id="color-green" />
          Vert
      </label>
      <label for="color-purple">
          <input type="checkbox" name="color[]" value="5" id="color-purple" />
          Magenta
      </label>
      <label for="color-orange">
          <input type="checkbox" name="color[]" value="5" id="color-orange" />
          Orange
      </label>

  Désactiver l'option ``'hiddenField'`` dans le second groupe d'input empêcherait
  au contraire ce comportement.

  Vous pouvez définir une autre valeur pour le champ caché, autre que 0,
  comme 'N'::

      echo $this->Form->checkbox('published', [
          'value' => 'Y',
          'hiddenField' => 'N',
      ]);

Utiliser des Collections pour construire des options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Il est possible d'utiliser la classe Collection pour construire votre tableau
d'options. Cette approche est idéale si vous avez déjà une collection d'entities
et que vous voulez vous en servir pour construire un élément select.

Vous pouvez utiliser la méthode ``combine`` pour construire un tableau d'options
basique::

    $options = $examples->combine('id', 'name');

Il est aussi possible d'ajouter d'autres attributs en étendant le tableau. Ce
qui suit va créer un attribut data sur l'élément option, en utilisant la méthode
de collections ``map`` ::

    $options = $examples->map(function ($value, $key) {
        return [
            'value' => $value->id,
            'text' => $value->name,
            'data-created' => $value->created
        ];
    });

Créer des Checkboxes
~~~~~~~~~~~~~~~~~~~~

.. php:method:: checkbox(string $fieldName, array $options)

* ``$name`` - Le nom du champ (attribut ``name``) sous la forme
  ``'Modelname.fieldname'``.
* ``$options`` - Un tableau optionnel pouvant contenir n'importe quelles
  :ref:`des options générales<general-control-options>`, des options de la section
  :ref:`checkbox-radio-select-options`, des options spécifiques aux checkboxes
  (ci-dessous) ou encore n'importe quels attributs HTML valides.

Créer un élément ``checkbox``. Le template de widget utilisé est le suivant::

    'checkbox' => '<input type="checkbox" name="{{name}}" value="{{value}}"{{attrs}}>'

**Options spécifiques pour les Checkboxes**

* ``'checked'`` - Booléen utilisé pour indiquer si cette checkbox est cochée ou non.
  Par défaut à ``false``.

* ``'disabled'`` - Crée une checkbox désactivée (non éditable).

Cette méthode génère également un input de type ``hidden`` pour forcer l'existence
de la donnée dans le tableau de POST.

Exemple ::

    echo $this->Form->checkbox('done');

Affichera:

.. code-block:: html

    <input type="hidden" name="done" value="0">
    <input type="checkbox" name="done" value="1">

Il est possible de modifier la valeur du checkbox en utilisant le tableau
``$options``::

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

* ``$name`` - Le nom du champ (attribut ``name``) sous la forme
  ``'Modelname.fieldname'``.
* ``$options`` - Un tableau optionnel contenant au minimum les labels pour les
  boutons radio. Ce tableau peut également contenir les ``value`` et des attributs
  HTML. Si ce tableau n'est pas fourni, la méthode générera seulement l'input
  ``hidden`` (si ``'hiddenField'`` vaut ``true``) ou pas d'élément du tout
  (si ``'hiddenField'`` vaut ``false``).
* ``$attributes`` - Un tableau optionnel pouvant contenir n'importe quelles
  :ref:`des options générales<general-control-options>`, des options de la section
  :ref:`checkbox-radio-select-options`, des options spécifiques aux boutons
  radio (ci-dessous) ou encore n'importe quels attributs HTML valides.

Crée un jeu de boutons radios. Les templates de widget utilisés par défaut
seront::

    'radio' => '<input type="radio" name="{{name}}" value="{{value}}"{{attrs}}>'
    'radioWrapper' => '{{label}}'

**Attributs spécifiques aux boutons radio**

* ``label`` - booléen pour indiquer si oui ou non les labels pour les widgets
  doivent être affichés, ou un tableau d'attributs à appliquer aux labels. Dans
  le cas où un attribut ``class`` est défini, ``selected`` sera ajouté à
  l'attribut ``class`` du bouton sélectionné. Défaut à ``true``.

* ``hiddenField`` - booléen pour indiquer si vous voulez que les résultats de
  radio() incluent un input caché avec une valeur de ``''``. C'est utile pour
  créer des ensembles de boutons radio qui ne sont pas continus. Défaut à
  ``true``.

* ``disabled`` - Définir à ``true`` ou ``disabled`` pour désactiver tous les
  boutons radio. Défaut à ``false``.

Vous devez fournir le texte des label pour les boutons radio via l'argument
``$options``.

Par exemple::

    $this->Form->radio('genre', ['Masculin','Féminin','Neutre']);

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

Généralement, ``$options`` contient de simples paires clé => valeur. Cependant,
si vous avez besoin de mettre des attributs personnalisés sur vos boutons radio,
vous pouvez utiliser le format étendu.

Par exemple::

    echo $this->Form->radio(
        'favorite_color',
        [
            ['value' => 'r', 'text' => 'Red', 'style' => 'color:red;'],
            ['value' => 'u', 'text' => 'Blue', 'style' => 'color:blue;'],
            ['value' => 'g', 'text' => 'Green', 'style' => 'color:green;'],
        ]
    );

Affichera:

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

Vous pouvez tout aussi bien définir des attributs supplémentaires pour un label
particulier::

    echo $this->Form->radio(
        'couleur_preferee',
        [
            ['value' => 'r', 'text' => 'Rouge', 'label' => ['class' => 'rouge']],
            ['value' => 'u', 'text' => 'Bleu', 'label' => ['class' => 'bleu']],
        ]
    );

Afichera:

.. code-block:: html

    <input type="hidden" name="favorite_color" value="">
    <label for="couleur-preferee-r" class="rouge">
        <input type="radio" name="couleur_preferee" value="r" id="couleur-preferee-r">
        Rouge
    </label>
    <label for="couleur-preferee-u" class="bleu">
        <input type="radio" name="couleur_preferee" value="u" id="couleur-preferee-u">
        Bleu
    </label>

Si la clé ``label`` est utilisée sur une option, les attributs dans
``$attributes['label']`` seront ignorés.

.. _create-select-picker:

Créer des Select
~~~~~~~~~~~~~~~~

.. php:method:: select(string $fieldName, array $options, array $attributes)

* ``$name`` - Le nom du champ (attribut ``name``) sous la forme
  ``'Modelname.fieldname'``.
* ``$options`` - Un tableau optionnel contenant la liste des éléments pour le
  select. Si ce tableau n'est pas fourni, la méthode généra seulement un élément
  ``select`` vide, sans élément ``option``.
* ``$attributes`` - Un tableau optionnel pouvant contenir n'importe quelles
  :ref:`des options générales<general-control-options>`, des options de la section
  :ref:`checkbox-radio-select-options`, des options spécifiques aux select
  (ci-dessous) ou encore n'importe quels attributs HTML valides.

Crée un élément ``select``, rempli avec les éléments contenus dans ``$options``.
Si l'option ``$attributes['value']`` est fournie, alors les éléments ``option``
ayant cette(ces) valeur(s) seront affichés comme sélectionné(s) quand le select
sera rendu.

Par défaut, ``select`` utilise ces templates de widget::

    'select' => '<select name="{{name}}"{{attrs}}>{{content}}</select>'
    'option' => '<option value="{{value}}"{{attrs}}>{{text}}</option>'

Il pourra également utiliser les templates suivants::

    'optgroup' => '<optgroup label="{{label}}"{{attrs}}>{{content}}</optgroup>'
    'selectMultiple' => '<select name="{{name}}[]" multiple="multiple"{{attrs}}>{{content}}</select>'

**Attributs pour les Select**

* ``'multiple'`` - Si cette option est définie à ``true``, le select sera multiple
  (plusieurs valeurs pourront être sélectionnées). Si elle est définie à ``checkbox``,
  à la place d'un select multiple, vous aurez des checkbox. Défaut à ``null``.

* ``'escape'`` - Booleén. Si ``true``, le contenu des éléments ``option`` sera
  échappé (les caractères spéciaux seront convertis en entités HTML). Défaut à
  ``true``.

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

La tableau ``$options`` peut aussi être fourni sous forme de paires
clé => valeur.

Par exemple ::

    echo $this->Form->select('field', [
        'Value 1' => 'Label 1',
        'Value 2' => 'Label 2',
        'Value 3' => 'Label 3'
    ]);

Affichera:

.. code-block:: html

    <select name="field">
        <option value="Value 1">Label 1</option>
        <option value="Value 2">Label 2</option>
        <option value="Value 3">Label 3</option>
    </select>

Si vous souhaitez générer un ``select`` avec des ``optgroups``, passez les
données sous forme de tableau multidimensionnel. Cela marche également avec les
checkbox et les boutons radio, mais à la place d'éléments ``optgroup``, vos éléments
seront entourés d'un ``fieldset``.

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

Affichera:

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

**Contrôle des Select via Attributes**

En utilisant des options spéciales dans l'argument ``$attributes``, vous pouvez
contrôler certains comportement de la méthode ``select()``.

* ``'empty'`` - Définissez cette option à ``true`` pour ajouter une option vide
  en première position de la liste de vos ``option``. Défaut à ``false``.

  Par exemple::

      $options = ['M' => 'Masculin', 'F' => 'Féminin'];
      echo $this->Form->select('sexe', $options, ['empty' => true]);

  Affichera:

  .. code-block:: html

      <select name="sexe">
          <option value=""></option>
          <option value="M">Masculin</option>
          <option value="F">Féminin</option>
      </select>

* ``'escape'`` - La méthode ``select()`` examine cet attribut qui contient un
  booléen et détermine si le contenu des ``option`` sera échappé (les
  caractères spéciaux seront convertis en entités HTML).

  Par exemple ::

      // Ceci empêchera l'échappement du contenu de chaque élément option
      $options = ['M' => 'Masculin', 'F' => 'Féminin'];
      echo $this->Form->select('sexe', $options, ['escape' => false]);

* ``'multiple'`` - Si définie à ``true``, cette option autorisera les sélections
  multiples dans le``select``.

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
          'M' => 'Masculin',
          'F' => 'Féminin',
          'N' => 'Neutre'
      ];
      echo $this->Form->select('genre', $options, [
          'disabled' => ['M', 'N']
      ]);

  Affichera:

  .. code-block:: html

      <select name="genre">
          <option value="M" disabled="disabled">Masculin</option>
          <option value="F">Féminin</option>
          <option value="N" disabled="disabled">Neutre</option>
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

Créer des Inputs File
---------------------

.. php:method:: file(string $fieldName, array $options)

* ``$name`` - Le nom du champ (attribut ``name``) sous la forme
  ``'Modelname.fieldname'``.
* ``$options`` - Un tableau optionnel pouvant contenir n'importe quelles
  :ref:`options générales<general-control-options>` ainsi que n'importe
  quels attributs HTML valides.

Permet de créer un input de type ``file`` dans votre formulaire, pour faire de
l'upload de fichier.
Le template de widget utilisé sera::

    'file' => '<input type="file" name="{{name}}"{{attrs}}>'

Vous devez vous assurer que le ``enctype`` du formulaire est défini a
``multipart/form-data``.
Pour cela, commencez par appeler la méthode ``create`` de votre formulaire
via une des deux méthodes ci-dessous::

    echo $this->Form->create($document, ['enctype' => 'multipart/form-data']);
    // OU
    echo $this->Form->create($document, ['type' => 'file']);

Ensuite ajoutez l'une des deux lignes dans votre formulaire::

    echo $this->Form->control('submittedfile', [
        'type' => 'file'
    ]);

    // OU
    echo $this->Form->file('submittedfile');

.. note::

    En raison des limitations du code HTML lui même, il n'est pas possible
    de définir des valeurs par défaut dans les champs input de type 'file'.
    À chaque affichage du formulaire, la valeur sera vide.

Pour empêcher le ``submittedfile`` d'être écrasé par un contenu vide, enlevez-le
de ``$_accessible``. Au choix, vous pouvez aussi retirer sa clé depuis la
méthode ``beforeMarshal``::

    public function beforeMarshal(\Cake\Event\EventInterface $event, \ArrayObject $data, \ArrayObject $options)
    {
       if ($data['submittedfile'] === '') {
          unset($data['submittedfile']);
       }
    }

Lors de la soumission du formulaire, vous pouvez accéder aux inputs de type file
par le biais des objets ``UploadedFileInterface`` présents dans la requête. Pour
déplacer les fichiers uploadés vers un emplacement permanent, vous pouvez
utiliser::

    $fileobject = $this->request->getData('submittedfile');
    $destination = UPLOAD_DIRECTORY . $fileobject->getClientFilename();

    // S'il existe un fichier du même nom, il sera écrasé.
    $fileobject->moveTo($destination);

.. note::

    Quand vous utilisez ``$this->Form->file()``, pensez à bien définir le
    type d'envodage du formulaire en définissant l'option type à 'file' dans
    ``$this->Form->create()``.

-.. _create-datetime-controls:

Créer des éléments de formulaire pour les dates et heures
---------------------------------------------------------

.. php:method:: dateTime($fieldName, $options = [])

* ``$fieldName`` - Une chaîne qui sera utilisée comme préfixe pour l'attribut
  ``name`` des ``select``.
* ``$options`` - Un tableau optionnel pouvant contenir n'importe quelles
  :ref:`options générales<general-control-options>` ainsi que n'importe
  quels attributs HTML valides.

Générera une balise input de type "datetime-local".

Par exemple ::

    <?= $this->form->dateTime('inscription') ?>

Affichera:

.. code-block:: html

    <input type="datetime-local" name="inscription" />

Le valeur de l'input peut être n'importe quel datetime valide ou une instance
``DateTime``.

Par exemple ::

    <?= $this->form->dateTime('inscription', ['value' => new DateTime()]) ?>

Affichera:

.. code-block:: html

    <input type="datetime-local" name="inscription" value="2019-02-08T18:20:10" />

Créer des Éléments Date
~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: date($fieldName, $options = [])

* ``$fieldName`` - Une chaîne qui sera utilisée comme préfixe pour l'attribut
  ``name`` des ``select``.
* ``$options`` - Un tableau optionnel pouvant contenir n'importe quelles
  :ref:`options générales<general-control-options>` ainsi que n'importe
  quels attributs HTML valides.

Générera une balise input de type "date".

Par exemple ::

    <?= $this->form->date('inscription') ?>

Affichera:

.. code-block:: html

    <input type="date" name="inscription" />

Créer des Éléments Time
~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: time($fieldName, $options = [])

* ``$fieldName`` - Une chaîne qui sera utilisée comme préfixe pour l'attribut
  ``name`` des ``select``.
* ``$options`` - Un tableau optionnel pouvant contenir n'importe quelles
  :ref:`options générales<general-control-options>` ainsi que n'importe
  quels attributs HTML valides.

Générera une balise input de type "time".

Par exemple ::

    echo $this->Form->time('redemarrage');

Affichera:

.. code-block:: html

    <input type="time" name="redemarrage" />

Créer des Éléments Mois
~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: month(string $fieldName, array $attributes)

* ``$fieldName`` - Une chaîne qui sera utilisée comme préfixe pour l'attribut
  ``name`` des ``select``.
* ``$options`` - Un tableau optionnel pouvant contenir n'importe quelles
  :ref:`options générales<general-control-options>` ainsi que n'importe
  quels attributs HTML valides.

Générera une balise input de type "month".

Par exemple ::

    echo $this->Form->month('mob');

Affichera:

.. code-block:: html

    <input type="month" name="mob" />

Créer des Éléments Année
~~~~~~~~~~~~~~~~~~~~~~~~

.. php:method:: year(string $fieldName, array $options = [])

* ``$fieldName`` - Une chaîne qui sera utilisée comme préfixe pour l'attribut
  ``name`` des ``select``.
* ``$options`` - Un tableau optionnel pouvant contenir n'importe quelles
  :ref:`options générales<general-control-options>` ainsi que n'importe
  quels attributs HTML valides.
  Les autres options valides sont:

      * ``min``: La plus petite valeur pouvant être utilisée dans l'élément de
        saisie de l'année.
      * ``max``: La plus grande valeur pouvant être utilisée dans l'élément de
        saisie de l'année.
      * ``order``: L'ordre des années dans l'élément de saisie.
        Les valeurs possibles sont ``'asc'`` et ``'desc'``. Par défaut ``'desc'``.

Crée un élément ``select`` qui contiendra une option par année pour les années
situées entre ``min`` et ``max`` si ces options sont fournies, ou pour les
années entre -5 et +5 par rapport à l'année en cours. En complément, des
attributs HTML peuvent être passés dans ``$options``. Si ``$options['empty']``
est passé à ``false``, le ``select`` n'aura pas d'élément vide en début de
liste.

Par exemple pour créer un élément qui propose les années entre 2000 et
l'année en cours, vous utiliserez le code suivant::

    echo $this->Form->year('achat', [
        'min' => 2000,
        'max' => date('Y')
    ]);

Si nous sommes en 2009, nous obtiendrons:

.. code-block:: html

    <select name="achat">
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

.. _create-label:

Créer les Labels
================

.. php:method:: label(string $fieldName, string $text, array $options)

* ``$fieldName`` - Le nom du champ (attribut ``name``) sous la forme
  ``'Modelname.fieldname'``.
* ``$text`` - Chaîne optionnelle pour définir le texte du label.
* ``$options`` - Optionel. Tableau qui peut contenir n'importe quelles
  :ref:`des options générales<general-control-options>` ainsi que n'importe
  quels attributs HTML valides.

Crée un élément label. ``$fieldName`` est utilisé pour générer l'attribut ``for``.
Si ``$text`` n'est pas défini, ``$fieldName`` sera utilisé pour définir le texte
du label::

    echo $this->Form->label('name');
    echo $this->Form->label('name', 'Votre nom');

Affichera:

.. code-block:: html

    <label for="name">Name</label>
    <label for="name">Votre nom</label>

Avec le troisième paramètre, ``$options``, vous pouvez fixer le nom de la classe
ou d'autres attributs:

    echo $this->Form->label('name', null, ['id' => 'user-label']);
    echo $this->Form->label('name', 'Votre nom', ['class' => 'highlight']);

Affichera:

.. code-block:: html

    <label for="name" id="user-label">Name</label>
    <label for="name" class="highlight">Votre nom</label>

Afficher et vérifier les erreurs
================================

FormHelper dispose de quelques méthodes qui vous permettent de vérifier
facilement si vos champs contiennent des erreurs et d'afficher des messages
d'erreur personnalisés.

Afficher les Erreurs
--------------------

.. php:method:: error(string $fieldName, mixed $text, array $options)

* ``$fieldName`` - Le nom du champ (attribut ``name``) sous la forme
  ``'Modelname.fieldname'``.
* ``$text`` - Optionnel. Une chaîne ou un tableau fournissant le(s) message(s)
  d'erreur. Si c'est un tableau, cela devra être un tableau de paires
  clé / valeur où la clé est le nom du champ en erreur et la valeur le message
  associé. Défaut à ``null``.
* ``$options`` - Tableau optionnel qui ne peut contenir qu'une clé ``escape``
  qui attend un booléen et qui permet de définir si le contenu HTML du message
  d'erreur doit être échappé ou non. Défaut à ``true``.

Affiche un message d'erreur de validation, spécifié par ``$text``, pour
le champ donné, dans le cas où une erreur de validation s'est produite. Si
``$text`` n'est pas fourni alors le message de validation par défaut pour le type
de champ sera utilisé.

Cette méthode utilise les templates de widgets suivant::

    'error' => '<div class="error-message">{{content}}</div>'
    'errorList' => '<ul>{{content}}</ul>'
    'errorItem' => '<li>{{text}}</li>'

Les templates ``'errorList'`` et ``'errorItem'`` sont utilisés pour formater
plusieurs messages d'erreur pour un seul champ.

Exemple::

    // Si vous avez une règle de validation 'notEmptyString' dans TicketsTable:
    public function validationDefault(Validator $validator): Validator
    {
        $validator
            ->requirePresence('ticket', 'create')
            ->notEmptyString('ticket');
    }

    // Et dans templates/Tickets/add.php vous avez:
    echo $this->Form->text('ticket');

    if ($this->Form->isFieldError('ticket')) {
        echo $this->Form->error('ticket', 'Message d\'erreur 100% personnalisé !');
    }

Si vous soumettez le formulaire sans fournir de valeur pour le champ *Ticket*,
votre formulaire affichera:

.. code-block:: html

    <input name="ticket" class="form-error" required="required" value="" type="text">
    <div class="error-message">Message d'erreur 100% personnalisé !</div>

.. note::

    En utilisant :php:meth:`~Cake\\View\\Helper\\FormHelper::control()`, les erreurs
    sont rendues par défaut, donc vous n'aurez pas besoin d'utiliser ``isFieldError()``
    ou d'appeler ``error()`` manuellement.

Si vous utilisez un champ particulier du modèle pour générer des champs de
formulaire multiples *via* ``control()``, et si vous voulez que le même message
d'erreur soit utilisé pour chacun d'eux, il sera probablement préférable de
définir votre message d'erreur personnalisé dans les
:ref:`validator rules<creating-validators>`.

Vérifier la Présence d'Erreurs
------------------------------

.. php:method:: isFieldError(string $fieldName)

* ``$fieldName`` - Un nom de champ sous la forme ``'Modelname.fieldname'``.

Renvoie ``true`` si le champ ``$fieldName`` fourni a une erreur de validation en
cours. Sinon, retournera ``false``::

    if ($this->Form->isFieldError('gender')) {
        echo $this->Form->error('gender');
    }

.. _html5-validity-messages:

Afficher des messages dans le système de validation HTML5
---------------------------------------------------------

Si l'option ``autoSetCustomValidity`` du FormHelper est définie à ``true``, les
messages du navigateur HTML5 pour signifier qu'un champ est obligatoire seront
remplacés par les messages d'erreur des règles de validation *required* et
*notBlank* . L'activation de cette option ajoutera les attributs ``onvalid`` et
``oninvalid`` à vos champs, par exemple::

    <input type="text" name="field" required onvalid="this.setCustomValidity('')"
     oninvalid="this.setCustomValidity('Message personnalisé pour la règle notBlank')" />

Si vous voulez définir manuellement ces events avec votre propre JavaScript,
vous pouvez définir l'option ``autoSetCustomValidity`` à ``false`` et utiliser
à la place la variable de template spéciale ``customValidityMessage``. Cette
variable de template est ajoutée quand un champ est obligatoire::

    // template exemple
    [
        'input' => '<input type="{{type}}" name="{{name}}" data-error-message="{{customValidityMessage}}" {{attrs}}/>',
    ]

    // créerait un input ressemblant à cela
    <input type="text" name="field" required
     data-error-message="Message personnalisé pour la règle notBlank" />

Vous pourriez alors utiliser le JavaScript pour définir les events ``onvalid``
et ``oninvalid`` de la façon dont vous le souhaitez.

Création des boutons et des éléments submit
===========================================

Créer des éléments Submit
-------------------------

.. php:method:: submit(string $caption, array $options)

* ``$caption`` - Chaîne optionnelle qui permet de fournir le texte à afficher
  ou le chemin vers une image pour le bouton. Défaut à ``'Submit'``.
* ``$options`` - Optionel. Tableau qui peut contenir n'importe quelles
  :ref:`des options générales<general-control-options>`, ou des options
  spécifiques aux boutons submit (cf. ci-dessous), ainsi que n'importe quels
  attributs HTML valides.

Crée un input ``submit`` avec la valeur ``$caption``. Si la ``$caption``
fournie est l'URL d'une image (c'est-à-dire si la valeur fournie contient '://'
ou une des extensions '.jpg, .jpe, .jpeg, .gif'), une image cliquable sera
générée comme bouton sibmit (si l'image existe). Si le premier caractère est '/' alors
le chemin de l'image sera relatif à *webroot*, sinon, il sera relatif à *webroot/img*.

Par défaut, les templates de widgets utilisés sont::

    'inputSubmit' => '<input type="{{type}}"{{attrs}}/>'
    'submitContainer' => '<div class="submit">{{content}}</div>'

**Options pour les Submit**

* ``'type'`` - Définissez cette option à ``'reset'`` pour générer un bouton
  "reset" (de remise à zéro du formulaire). Défaut à ``'submit'``.
* ``'templateVars'`` - Utilisez ce tableau pour fournir des variables de
  template supplémentaires pour l'élément et ses conteneurs.
* Tout autre paramètre sera ajouté comme un attribut à l'élément HTML ``input``.

Le code suivant::

    echo $this->Form->submit('Cliquez ici');

Affichera:

.. code-block:: html

    <div class="submit"><input value="Cliquez ici" type="submit"></div>

Vous pouvez aussi passer une URL relative ou absolue vers une image
au paramètre caption au lieu d'un texte::

    echo $this->Form->submit('ok.png');

Affichera:

.. code-block:: html

    <div class="submit"><input type="image" src="/img/ok.png"></div>

Les inputs submit sont utiles quand vous avez seulement besoin de textes
basiques ou d'images. Si vous avez besoin d'un contenu de bouton plus
complexe, vous devrez plutôt utiliser ``button()``.

Créer des Éléments Button
-------------------------

.. php:method:: button(string $title, array $options = [])

* ``$title`` - Chaîne obligatoire qui correspond au texte du bouton.
* ``$options`` - Optionel. Tableau qui peut contenir n'importe quelles
  :ref:`des options générales<general-control-options>`, ou des options
  spécifiques aux boutons (cf. ci-dessous), ainsi que n'importe quels attributs
  HTML valides.

Crée un bouton HTML avec le titre spécifié et un type par défaut ``button``.

**Options pour les Button**

* ``'type'`` - Vous pouvez définir cette variable à l'une des trois valeurs
  suivantes:

  #. ``'submit'`` - Comme pour la méthode ``$this->Form->submit()``, cela créera
     un bouton de type ``submit``. Notez cependant que cela ne générera pas de
     ``div`` autour comme pour ``submit()``. C'est le type par défaut.
  #. ``'reset'`` - Crée un bouton "reset" (remise à zéro) pour le formulaire.
  #. ``'button'`` - Crée un bouton standard.

* ``'escapeTitle'`` - Booléen. Si cette option est définie à ``true``, le
  contenu HTML de la valeur fournie pour ``$title`` sera échappé. Défaut à
  ``true``.

* ``'escape'`` - Booléen. S'il est défini à ``true``, tous les attributs HTML
  générés pour le bouton seront échappés. Défaut à ``true``.

* ``'confirm'`` - Le message de confirmation à afficher lors du clic.
  Défaut à ``null``.

Par exemple::

    echo $this->Form->button('Un bouton');
    echo $this->Form->button('Un autre bouton', ['type' => 'button']);
    echo $this->Form->button('Réinitialiser le formulaire', ['type' => 'reset']);
    echo $this->Form->button('Valider', ['type' => 'submit']);

Affichera:

.. code-block:: html

    <button type="submit">Un bouton</button>
    <button type="button">Un autre bouton</button>
    <button type="reset">Réinitialiser le formulaire</button>
    <button type="submit">Valider</button>

Exemple en utilisant l'option ``escapeTitle``::

    // Rendra le code HTML sans échappement.
    echo $this->Form->button('<em>Valider</em>', [
        'type' => 'submit',
        'escapeTitle' => false,
    ]);

Fermer le Formulaire
====================

.. php:method:: end($secureAttributes = [])

* ``$secureAttributes`` - Optionnel. Vous permet de fournir des attributs qui
  seront utilisés comme attributs HTML aux inputs ``hidden`` générés par le
  ``SecurityComponent``.

La méthode ``end()`` ferme et complète le marquage du formulaire. Souvent,
``end()`` se contente d'afficher la balise fermante du formulaire, mais
l'utilisation de ``end()`` est une bonne pratique puisqu'elle permet également
au FormHelper d'ajouter les champs cachées dont le
:php:class:`Cake\\Controller\\Component\\SecurityComponent` a besoin:

.. code-block:: php

    <?= $this->Form->create(); ?>

    <!-- Éléments de formulaire ici -->

    <?= $this->Form->end(); ?>

Si vous avez besoin d'appliquer des attributs supplémentaires aux inputs
``hidden``, vous pouvez utiliser l'argument ``$secureAttributes``.

Ainsi::

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
    application, vous devrez obligatoirement terminer vos formulaires avec
    ``end()``.

Créer des Boutons Indépendants et des liens POST
================================================

Créer des Boutons POST
----------------------

.. php:method:: postButton(string $title, mixed $url, array $options = [])

* ``$title`` - Chaîne obligatoire qui sera utilisée comme texte du bouton. Notez
  que, par défaut, cette valeur ne sera pas échappée.
* ``$url`` - URL cible du formulaire, sous forme de chaîne ou de tableau.
* ``$options`` - Optionel. Tableau qui peut contenir n'importe quelles
  :ref:`des options générales<general-control-options>`, ou des options
  spécifiques (cf. ci-dessous), ainsi que n'importe quels attributs HTML
  valides.

Crée une balise ``<button>`` avec un ``<form>`` l'entourant qui soumet par
défaut une requête POST. De plus, par défaut, cela générera des inputs
``hidden`` pour le ``SecurityComponent``.

**Options for POST Button**

* ``'data'`` - Tableau clé / valeur à passer aux inputs ``hidden``.

* ``'method'`` - La méthode de requête à utiliser. Par exemple si vous voulez
  émettre une requête HTTP/1.1 DELETE, passez ``delete``.
  La valeur par défaut est ``post``.

* ``'form'`` - Tableau dans lequel vous pouvez passer n'importe quelle valeur
  supportée par ``FormHelper::create()``.

* De plus, la méthode ``postButton()`` acceptera n'importe quelle option également
  valide pour la méthode ``button()``.

Par exemple ::

    // Dans templates/Tickets/index.php
    <?= $this->Form->postButton('Supprimer', ['controller' => 'Tickets', 'action' => 'delete', 5]) ?>

Affichera un HTML similaire à:

.. code-block:: html

    <form method="post" accept-charset="utf-8" action="/Rtools/tickets/delete/5">
        <div style="display:none;">
            <input name="_method" value="POST" type="hidden">
        </div>
        <button type="submit">Supprimer</button>
        <div style="display:none;">
            <input name="_Token[fields]" value="186cfbfc6f519622e19d1e688633c4028229081f%3A" type="hidden">
            <input name="_Token[unlocked]" value="" type="hidden">
            <input name="_Token[debug]" value="%5B%22%5C%2FRtools%5C%2Ftickets%5C%2Fdelete%5C%2F1%22%2C%5B%5D%2C%5B%5D%5D" type="hidden">
        </div>
    </form>

Dans la mesure où cette méthode crée un élément ``<form>``, ne l'utilisez pas
à l'intérieur d'un formulaire ouvert. Utilisez plutôt
:php:meth:`Cake\\View\\Helper\\FormHelper::submit()` ou
:php:meth:`Cake\\View\\Helper\\FormHelper::button()`
pour créer des boutons à l'intérieur de formulaires ouvert.

Créer des liens POST
--------------------

.. php:method:: postLink(string $title, mixed $url = null, array $options = [])

* ``$title`` - Chaîne obligatoire qui sera utilisée comme texte du lien.
* ``$url`` - URL cible du formulaire, sous forme de chaîne ou de tableau. L'URL
  est soit relative à CakePHP, soit externe si elle commence par ``http://``.
* ``$options`` - Optionel. Tableau qui peut contenir n'importe quelles
  :ref:`des options générales<general-control-options>`, ou des options
  spécifiques (cf. ci-dessous), ainsi que n'importe quels attributs HTML
  valides.

Crée un lien HTML, mais accède à l'Url en utilisant la méthode spécifiée (par
défaut POST). Requiert que JavaScript soit activé dans le navigateur::

    // Dans votre template, à l'emplacement pour supprimer un article
    <?= $this->Form->postLink(
       'Supprimer',
       ['action' => 'delete', $article->id],
       ['confirm' => 'Êtes-vous sûr ?'])
    ?>

**Options pour les liens POST**

* ``'data'`` - Tableau clé / valeur à passer aux inputs ``hidden``.

* ``'method'`` - La méthode de requête à utiliser. Par exemple si vous voulez
  émettre une requête HTTP/1.1 DELETE, passez ``delete``.
  La valeur par défaut est ``post``.

* ``'confirm'`` - Le message de confirmation à afficher lors du clic sur le lien.
  Défaut à ``null``.

* ``'block'`` - Définissez cette option à ``true`` pour ajouter le lien au
  "view block" ``'postLink'`` ou pour fournir un nom de bloc personnalisé.
  Défaut à ``null``.

* De plus, la méthode ``postLink`` acceptera n'importe quelle option également
  valide pour la méthode ``link()``.

Cette méthode crée un élément ``<form>``. Si vous souhaitez utiliser cette
méthode à l'intérieur d'un formulaire existant, vous devez utiliser l'option
``block`` pour que le nouveau formulaire soit défini dans un :ref:`bloc de vue <view-blocks>`
qui peut être affiché en dehors du formulaire principal.

Si vous souhaitez seulement créer un bouton pour soumettre votre formulaire, alors vous
devriez plutôt utiliser :php:meth:`Cake\\View\\Helper\\FormHelper::button()`
ou :php:meth:`Cake\\View\\Helper\\FormHelper::submit()`.

.. note::

    Attention à ne pas mettre un postLink à l'intérieur d'un formulaire
    ouvert. À la place, utilisez l'option ``block`` pour mettre en mémoire
    tampon le formulaire dans un :ref:`view-blocks`.

.. _customizing-templates:

Personnaliser les Templates Utilisés par FormHelper
===================================================

Comme beaucoup de helpers dans CakePHP, FormHelper utilise les chaînes de
template pour mettre en forme le HTML qu'il crée. Bien que les templates par
défaut soient destinés à fournir un ensemble raisonnable de canevas pour les
usages courants, vous aurez peut-être besoin de personnaliser des templates qui
correspondront davantage à votre application.

Pour changer les templates au moment du chargement du helper, vous pouvez
définir l'option ``templates`` lors de l'inclusion du helper dans votre
controller::

    // Dans une classe de View
    $this->loadHelper('Form', [
        'templates' => 'app_form',
    ]);

Ceci chargera les balises contenues dans **config/app_form.php**. Ce fichier
devra contenir un tableau des templates *indexés par leur nom*::

    // dans config/app_form.php
    return [
        'inputContainer' => '<div class="form-control">{{content}}</div>',
    ];

Tous les templates que vous définirez vont remplacer ceux inclus par défaut dans
le helper. Les Templates qui ne sont pas remplacés vont continuer à être
utilisés avec les valeurs par défaut.

Vous pouvez aussi changer les templates à la volée en utilisant la méthode
``setTemplates()``::

    $myTemplates = [
        'inputContainer' => '<div class="form-control">{{content}}</div>',
    ];
    $this->Form->setTemplates($myTemplates);

.. warning::

    Les chaînes de template contenant un signe pourcentage (``%``) nécessitent
    une attention spéciale. Vous devriez préfixer ce caractère avec un autre
    pourcentage pour le faire ressembler à ``%%``. La raison est que les
    templates sont compilés en interne pour être utilisés avec ``sprintf()``.
    Exemple: ``<div style="width:{{size}}%%">{{content}}</div>``

Liste des Templates
-------------------

La liste des templates par défaut, leur format par défaut et les variables
qu'ils attendent se trouvent dans la `documentation API du FormHelper <https://api.cakephp.org/4.x/class-Cake.View.Helper.FormHelper.html#%24_defaultConfig>`_.

Utiliser des conteneurs personnalisés distincts pour les éléments
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

En plus de ces templates, la méthode ``control()`` va essayer d'utiliser des
templates différents pour chaque conteneur d'input. Par exemple, lors de la création
d'un input datetime, ``datetimeContainer`` va être utilisé s'il est présent.
Si le conteneur n'est pas présent, le template ``inputContainer`` sera utilisé.
Par exemple::

    // Ajoute du HTML personnalisé autour d'un input radio
    $this->Form->setTemplates([
        'radioContainer' => '<div class="form-radio">{{content}}</div>'
    ]);

    // Crée un ensemble d'inputs radio avec notre div personnalisé autour
    echo $this->Form->control('email_notifications', [
        'options' => ['y', 'n'],
        'type' => 'radio'
    ]);

Utiliser des groupes de formulaire personnalisés distincts
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

De la même manière qu'avec les conteneurs d'input, la méthode ``control()``
essayera d'utiliser différents templates pour chaque groupe de formulaire. Un
groupe de formulaire est un ensemble composé d'un label et d'un input.
Par exemple, lorsque vous créez des inputs de type radio, le template
``radioFormGroup`` sera utilisé s'il est présent. Si ce template est absent,
par défaut chaque ensemble ``label`` & ``input`` sera généré en utilisant le template
``formGroup``::

    // Ajoute un groupe de formulaire personnalisé pour les boutons radio
    $this->Form->setTemplates([
        'radioFormGroup' => '<div class="radio">{{label}}{{input}}</div>'
    ]);

Ajouter des Variables de Template Supplémentaires aux Templates
---------------------------------------------------------------

Vous pouvez aussi ajouter des espaces réservés supplémentaires dans des
templates personnalisés et les remplir lors de la génération des inputs.

Par exemple::

    // Ajoute un template avec un espace réservé pour un message d'aide
    $this->Form->setTemplates([
        'inputContainer' => '<div class="input {{type}}{{required}}">
            {{content}} <span class="help">{{help}}</span></div>'
    ]);

    // Génère un input et remplit la variable help
    echo $this->Form->control('password', [
        'templateVars' => ['help' => 'Au moins 8 caractères.']
    ]);

Affichera:

.. code-block:: html

    <div class="input password">
        <label for="password">
            Password
        </label>
        <input name="password" id="password" type="password">
        <span class="help">Au moins 8 caractères.</span>
    </div>

Déplacer les Checkboxes & Boutons Radios à l'Extérieur du Label
---------------------------------------------------------------

Par défaut, CakePHP incorpore les cases à cocher créées via ``control()`` et
les boutons radios créés par ``control()`` et ``radio()`` dans des éléments label.
Cela contribue à faciliter l'intégration des frameworks CSS populaires. Si vous
avez besoin de placer ces éléments à l'extérieur de la balise label, vous pouvez
le faire en modifiant les templates::

    $this->Form->setTemplates([
        'nestingLabel' => '{{hidden}}{{input}}<label{{attrs}}>{{text}}</label>',
        'formGroup' => '{{input}}{{label}}',
    ]);

Cela générera les checkbox et les boutons radio à l'extérieur de leurs labels.

Générer des Formulaires Entiers
===============================

Créer plusieurs éléments (controls)
-----------------------------------

.. php:method:: controls(array $fields = [], $options = [])

* ``$fields`` - Un tableau des champs à générer. Permet de définir des types
  personnalisés, des labels et toutes autres options pour chaque champ.
* ``$options`` - Optionnel. Un tableau d'options. Les clés supportées sont:

  #. ``'fieldset'`` - Définir à ``false`` pour désactiver l'ajout d'un ``fieldset``.
     Si vide, le ``fieldset`` sera ajouté. Peut aussi être un tableau de paramètres
     à appliquer comme attributs HTML au ``fieldset`` généré.
  #. ``legend`` - Chaîne utilisée pour personnaliser le texte de l'élément ``legend``.
     Définir à ``false`` pour désactiver l'ajout de l'élément ``legend``.

Génère un ensemble d'inputs pour un contexte donné, entouré d'un ``fieldset``.
Vous pouvez spécifier les champs générés en les incluant::

    echo $this->Form->controls([
        'name',
        'email'
    ]);

Vous pouvez personnaliser le texte de la légende en utilisant une option::

    echo $this->Form->controls($fields, ['legend' => 'Mettre à jour le post']);

Vous pouvez personnaliser les inputs générés en définissant des options
supplémentaires dans le paramètre ``$fields``::

    echo $this->Form->controls([
        'name' => ['label' => 'Label personnalisé']
    ]);

Quand vous personnalisez ``fields``, vous pouvez utiliser le paramètre
``$options`` pour contrôler les éléments ``legend`` et ``fieldset`` générés.

Par exemple::

    echo $this->Form->controls(
        [
            'name' => ['label' => 'Label personnalisé']
        ],
        ['legend' => 'Mettre à jour votre post']
    );

Si vous désactiver le ``fieldset``, la ``legend`` ne s'affichera pas.

Créer les éléments pour une Entity complète
-------------------------------------------

.. php:method:: allControls(array $fields, $options = [])

* ``$fields`` - Optionnel. Un tableau de paramétrages pour les champs qui seront
  générés. Permet de définir des types personnalisés, des labels et toutes autres
  options.
* ``$options`` - Optionnel. Un tableau d'options. Les clés supportées sont:

  #. ``'fieldset'`` - Définir à ``false`` pour désactiver l'ajout d'un ``fieldset``.
     Si vide, le ``fieldset`` sera ajouté. Peut aussi être un tableau de paramètres
     à appliquer comme attributs HTML au ``fieldset`` généré.
  #. ``legend`` - Chaîne utilisée pour personnaliser le texte de l'élément ``legend``.
     Définir à ``false`` pour désactiver l'ajout de l'élément ``legend``.

Cette méthode est étroitement liée à ``controls()``, cependant l'argument
``$fields`` est égal par défaut à *tous* les champs de l'entity de niveau
supérieur actuelle. Pour exclure certains champs de la liste d'inputs générée,
définissez-les à ``false`` dans le paramètre ``$fields``::

    echo $this->Form->allControls(['password' => false]);

.. _associated-form-inputs:

Créer des Inputs pour les Données Associées
===========================================

Créer des formulaires pour les données associées est assez simple et est
étroitement lié aux chemins des données de votre entity. Imaginons les
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

    // Inputs Tags (belongsToMany)
    // en tant qu'inputs séparés
    echo $this->Form->control('tags.0.id');
    echo $this->Form->control('tags.0.name');
    echo $this->Form->control('tags.1.id');
    echo $this->Form->control('tags.1.name');

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

Vous pouvez ajouter des widgets personnalisés dans CakePHP, et les utiliser
comme n'importe quel input. Tous les types d'input que contient
le cœur de cake sont implémentés comme des widgets. Ainsi vous pouvez remplacer
n'importe quel widget de base par votre propre implémentation.

Construire une Classe Widget
----------------------------

L'interface que les classes Widget doivent respecter est vraiment simple. Il
s'agit de :php:class:`Cake\\View\\Widget\\WidgetInterface`. Cette interface
nécessite d'implémenter les méthodes ``render(array $data)`` et
``secureFields(array $data)``. La méthode ``render()``
attend un tableau de données pour construire le widget et doit renvoyer une
chaine HTML pour le widget. La méthode ``secureFields()`` attend également un
tableau de données et doit retourner un tableau contenant la liste des champs à
sécuriser pour ce widget. Si CakePHP construit votre widget, vous pouvez
vous attendre à recevoir une instance de ``Cake\View\StringTemplate`` en premier
argument, suivi de toutes les dépendances que vous aurez définies. Si vous
vouliez construire un widget Autocomplete, vous pourriez le faire comme ceci::

    namespace App\View\Widget;

    use Cake\View\Form\ContextInterface;
    use Cake\View\StringTemplate;
    use Cake\View\Widget\WidgetInterface;

    class AutocompleteWidget implements WidgetInterface
    {

        /**
         * StringTemplate instance.
         *
         * @var \Cake\View\StringTemplate
         */
        protected $_templates;

        /**
         * Constructor.
         *
         * @param \Cake\View\StringTemplate $templates Liste des templates.
         */
        public function __construct(StringTemplate $templates)
        {
            $this->_templates = $templates;
        }

        /**
         * Méthode qui fait le rendu du widget.
         *
         * @param array $data Les données à utiliser pour construire l'input.
         * @param \Cake\View\Form\ContextInterface $context Le contexte courant du formulaire.
         *
         * @return string
         */
        public function render(array $data, ContextInterface $context): string
        {
            $data += [
                'name' => '',
            ];
            return $this->_templates->format('autocomplete', [
                'name' => $data['name'],
                'attrs' => $this->_templates->formatAttributes($data, ['name'])
            ]);
        }

        public function secureFields(array $data): array
        {
            return [$data['name']];
        }
    }

Évidemment, c'est un exemple très simple, mais il montre comment développer
un widget personnalisé. Ce widget ferait un rendu de la chaîne de template
"autocomplete", si définie comme ceci par exemple::

    $this->Form->setTemplates([
        'autocomplete' => '<input type="autocomplete" name="{{name}}" {{attrs}} />'
    ]);

Pour plus d'informations sur les templates, référez-vous à la section :ref:`customizing-templates`.

Utiliser les Widgets
--------------------

Vous pouvez charger des widgets personnalisés lors du chargement du FormHelper
ou en utilisant la méthode ``addWidget()``. Lors du chargement du FormHelper,
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

Dans l'exemple ci-dessus, le widget ``autocomplete`` dépendrait des widgets
``text`` et ``label``. Si votre widget doit accéder à la View, vous devrez
utiliser le 'widget' ``_view``. Lorsque le widget ``autocomplete`` est créé, les
objets widget liés aux noms ``text`` et ``label`` lui sont passés. Ajouter des
widgets en utilisant la méthode ``addWidget`` ressemblerait à ceci::

    // En utilisant un nom de classe.
    $this->Form->addWidget(
        'autocomplete',
        ['Autocomplete', 'text', 'label']
    );

    // En utilisant une instance - vous oblige à résoudre les dépendances.
    $autocomplete = new AutocompleteWidget(
        $this->Form->getTemplater(),
        $this->Form->widgetRegistry()->get('text'),
        $this->Form->widgetRegistry()->get('label'),
    );
    $this->Form->addWidget('autocomplete', $autocomplete);

Une fois ajoutés/remplacés, les widgets peuvent être utilisés en tant que
'type' de l'input::

    echo $this->Form->control('search', ['type' => 'autocomplete']);

Cela créera un widget personnalisé avec un ``label`` et une ``div`` enveloppante
tout comme le fait toujours ``control()``. Sinon vous pouvez juste créer un
widget en utilisant la méthode magique::

    echo $this->Form->autocomplete('search', $options);

Travailler avec SecurityComponent
=================================

:php:meth:`Cake\\Controller\\Component\\SecurityComponent` offre plusieurs
fonctionnalités qui rendent vos formulaires plus sûrs et
plus sécurisés. En incluant simplement le ``SecurityComponent`` dans votre
controller, vous bénéficierez automatiquement des fonctionnalités de prévention
contre la falsification de formulaires.

Comme mentionné précédemment, lorsque vous utilisez le SecurityComponent,
vous devez toujours fermer vos formulaires en utilisant
:php:meth:`~Cake\\View\\Helper\\FormHelper::end()`. Cela assurera que les
inputs spéciales ``_Token`` soient générées.

.. php:method:: unlockField($name)

* ``$name`` - Optionnel. Le nom du champ en notation avec point (sous la forme
  ``'Modelname.fieldname'``).

Déverrouille un champ en l’exemptant du hachage par ``SecurityComponent``.
Cela autorise également le client à manipuler le champ via JavaScript.
Le paramètre ``$name`` doit correspondre au nom de la propriété de l'entity
pour l'input::

    $this->Form->unlockField('id');

.. php:method:: secure(array $fields = [], array $secureAttributes = [])

* ``$fields`` - Optionnel. Un tableau contenant la liste des champs à utiliser
  lors de la génération du hash. S'il n'est pas fourni, alors ``$this->fields``
  sera utilisé.
* ``$secureAttributes`` - Optionnel. Un tableau d'attributs HTML à passer aux
  élément ``input`` de type ``hidden`` qui seront générés.

Génère un ``input`` de type ``hidden`` avec un hash de sécurité basé sur les
champs utilisés dans le formulaire, ou une chaîne vide si la sécurisation des
formulaires n'est pas utilisée.
Si l'option ``$secureAttributes`` est définie, ces attributs HTML seront
fusionnés avec ceux générés par le SecurityComponent. C'est particulièrement
utile pour définir des attributs HTML5 tels que ``'form'``.

.. meta::
    :title lang=fr: FormHelper
    :description lang=fr: Le FormHelper se concentre sur la création rapide de formulaires, de façon à rationaliser la validation, le remplissage et la disposition.
    :keywords lang=fr: form helper,cakephp form,form create,form input,form select,form file field,form label,form text,form password,form checkbox,form radio,form submit,form date time,form error,validate upload,unlock field,form security
