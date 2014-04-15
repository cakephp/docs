FormHelper
##########

.. php:namespace:: Cake\View\Helper

.. php:class:: FormHelper(View $view, array $config = [])

Le Helper Form prend en charge la plupart des opérations lourdes
en création du formulaire. Le Helper Form se concentre sur la
possibilité de créé des formulaires rapidement, d'une manière qui
permettra de rationaliser la validation, la re-population et la mise
en page (layout). Le Helper Form est aussi flexible - Il va faire à
peu près tout pour vous en utilisant les conventions, ou vous
pouvez utiliser des méthodes spécifiques pour ne prendre
uniquement que ce dont vous avez besoin.

Création de Formulaire
======================

.. php:method:: create(mixed $model = null, array $options = [])

La première méthode que vous aurez besoin d'utiliser pour prendre pleinement
avantage du Helper Form (Helper Formulaire) est ``create()``. Cette méthode
affichera une balise d'ouverture de formulaire.

Tous les paramètres sont optionnels. Si create() est appelée sans paramètres,
CakePHP supposera que vous voulez créer un formulaire en rapport avec le
controller courant, via l'URL actuelle. La méthode par défaut pour les
formulaires est POST. Si vous appellez ``create()`` dans une vue pour
UsersController::add(), vous verrez la sortie suivante dans la vue:

.. code-block:: html

    <form method="post" action="/users/add">

L'argument ``$model`` est utilisé comme 'context' du formulaire. Il y a
plusieurs contextes de formulaires intégrés et vous pouvez ajouter les votres,
ce que nous allons voir dans la prochaine section. Ceux intégrés
correspondent aux valeurs suivantes de ``$model``:

* Une instance ``Entity`` ou un iterateur map vers ``EntityContext``, ce
  contexte permet au FormHelper de fonctionner avec les résultats à partir de
  ceux intégrés dans l'ORM.
* Un tableau contenant la clé ``schema``, maps vers ``ArrayContext`` ce qui vous
  permet de créer des structures simples de données pour construire des
  formulaires.
* ``null`` et ``false`` map vers ``NullContext``, cette classe de contexte
  satisfait simplement l'interface de FormHelper requise. Ce contexte est utile
  si vous voulez construire un formulaire court qui ne nécessite pas la
  persistance de l'ORM.

Toutes les classes de contexte ont aussi un accès aux données requêtées,
facilitant la construction des formulaires.

Une fois qu'un formulaire a été créé avec un contexte, tous les inputs que vous
créez vont utiliser le contexte actif. Dans le cas d'un formulaire backed ORM,
FormHelper peut accéder aux données associées, aux erreurs de validation et
aux metadata du schema facilitant la construction de formulaires simples. Vous
pouvez fermer le contexte actif en utilisant la méthode ``end()``, ou en
appelant ``create()`` à nouveau. Pour créer un formulaire pour une entity,
faîtes ce qui suit::

    // Si vous êtes sur /articles/add
    // $article devra être une entity vide Article.
    echo $this->Form->create($article);

Affichera:

.. code-block:: html

    <form method="post" action="/articles/add">

Celui-ci va POSTer les données de form à l'action ``add()`` de
ArticlesController. Cependant, vous pouvez utiliser la même logique pour créer
un formulaire edit. Le FormHelper utilise la propriété ``$this->request->data``
pour detecter automatiquement si il faut créer un form add ou un edit. Si
l'entity fournie n'est pas 'nouvelle', le form va être créé comme un form
edit. Par exemple, si nous naviguons vers http://example.org/articles/edit/5,
nous pourrions faire ce qui suit::

    // App/Controller/ArticlesController.php:
    public function edit($id = null) {
        if (empty($id)) {
            throw new NotFoundException;
        }
        $article = $this->Articles->get($id);
        // Save logic goes here
        $this->set('article', $article);
    }

    // View/Articles/edit.ctp:
    // Since $article->isNew() is false, we will get an edit form
    <?= $this->Form->create($article) ?>

Affichera:

.. code-block:: html

    <form method="post" action="/articles/edit/5">
    <input type="hidden" name="_method" value="PUT" />

.. note::

    Puisque c'est un form edit, un champ input caché est généré pour surcharger
    la méthode HTTP par défaut.

Le tableau ``$options`` est la où la configuration de form arrive. Ce tableau
spécial peut contenir un certain nombre de paires de clé-valeur différent qui
affectent la façon dont la balise form est générée.

Options pour  create()
-----------------------

Il y plusieurs options pour create():

* ``$options['type']`` Cette clé est utilisée pour spécifier le type de
  formulaire à créer. Les valeurs que peuvent prendre cette variable
  sont 'post', 'get', 'file', 'patch', 'put' et 'delete'.

  Choisir 'post' ou 'get' changera la méthode de soumission du formulaire
  en fonction de votre choix.::

      echo $this->Form->create($article, ['type' => 'get']);

    Affichera:

  .. code-block:: html

     <form method="get" action="/articles/edit/5">

  En spécifiant 'file' cela changera la méthode de soumission à 'post', et
  ajoutera un enctype "multipart/form-data" dans le tag du formulaire.
  Vous devez l'utiliser si vous avez des demandes de fichiers dans
  votre formulaire. L'absence de cet attribut enctype empêchera le
  fonctionnement de l'envoi de fichiers.::

      echo $this->Form->create($article, ['type' => 'file']);

  Affichera:

  .. code-block:: html

     <form enctype="multipart/form-data" method="post" action="/articles/add">

  Quand vous utilisez 'put' ou 'delete', votre formulaire aura un
  fonctionnement équivalent à un formulaire de type 'post',
  mais quand il sera envoyé, la méthode de requête HTTP
  sera respectivement réécrite avec 'PUT' ou 'DELETE'.
  Cela permettra à CakePHP de créer son propre support
  REST dans les navigateurs web.

* ``$options['action']`` La clé action vous permet de définir vers quelle
  action de votre controller pointera le formulaire. Par exemple, si vous
  voulez que le formulaire appelle l'action login() de votre controller
  courant, vous créeriez le tableau $options comme ceci ::

    echo $this->Form->create($article, ['action' => 'login']);

  Affichera:

  .. code-block:: html

     <form id="UserLoginForm" method="post" action="/users/login">

* ``$options['url']`` Si l'action que vous désirez appeler avec le formulaire
  n'est pas dans le controller courant, vous pouvez spécifier une URL
  dans le formulaire en utilisant la clé 'url' de votre tableau $options.
  L'URL ainsi fournie peut être relative à votre application CakePHP ::

    echo $this->Form->create(null, [
        'url' => ['controller' => 'articles', 'action' => 'publish']
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

Creating context classes
------------------------

While the built-in context classes are intended to cover the basic cases you'll
encounter you may need to build a new context class if you are using a different
ORM. In these situations you need to implement the
`Cake\\View\\Form\\ContextInterface
<http://api.cakephp.org/3.0/class-Cake.View.Form.ContextInterface.html>`_ . Once
you have implemented this interface you can wire your new context into the
FormHelper. It is often best to do this in a ``View.beforeRender`` event
listener, or in an application view class::

    $this->Form->addContextProvider('myprovider', function($request, $data) {
        if ($data['entity'] instanceof MyOrmClass) {
            return new MyProvider($request, $data['entity']);
        }
    });

Context factory functions are where you can add logic for checking the form
options for the correct type of entity. If matching input data is found you can
return an object. If there is no match return null.

    .. versionchanged:: 2.5
        The ``$secureAttributes`` parameter was added in 2.5.

.. _automagic-form-elements:

Création d'éléments de Formulaire
=================================

.. php:method:: input(string $fieldName, array $options = [])

The ``input()`` method lets you easily generate complete form inputs. These
inputs will include a wrapping div, label, input widget, and validation error if
necessary. By using the metadata in the form context, this method will choose an
appropriate input type for each field. Internally ``input()`` uses the other
methods of FormHelper.

Le type d'input créés dépends de la colonne datatype:

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

The ``$options`` parameter allows you to choose a specific input type if
you need to::

    echo $this->Form->input('published', ['type' => 'checkbox']);

.. _html5-required:

The wrapping div will have a ``required`` class name appended if the
validation rules for the model's field indicate that it is required and not
allowed to be empty. You can disable automatic required flagging using the
required option::

    echo $this->Form->input('title', ['required' => false]);

To skip browser validation triggering for the whole form you can set option
``'formnovalidate' => true`` for the input button you generate using
:php:meth:`~Cake\\View\\Helper\\FormHelper::submit()` or set ``'novalidate' =>
true`` in options for :php:meth:`~Cake\\View\\Helper\\FormHelper::create()`.

For example, let's assume that your User model includes fields for a
username (varchar), password (varchar), approved (datetime) and
quote (text). You can use the input() method of the FormHelper to
create appropriate inputs for all of these form fields::

    echo $this->Form->create($user);

    echo $this->Form->input('username');   //text
    echo $this->Form->input('password');   //password
    echo $this->Form->input('approved');   //day, month, year, hour, minute, meridian
    echo $this->Form->input('quote');      //textarea

    echo $this->Form->button('Add');
    echo $this->Form->end();

Un exemple plus complet montrant quelques options pour le champ de date ::

    echo $this->Form->input('birth_dt', [
        'label' => 'Date of birth',
        'minYear' => date('Y') - 70,
        'maxYear' => date('Y') - 18,
    ]);

Outre les options spécifique pour ``input()`` vu ci-dessus, vous pouvez
spécifier n'importe quelle options pour le type d'input et n'importe quel
attribut HTML (actuellement dans le focus).
Pour plus d'information sur les ``$options`` et ``$htmlAttributes`` voir
:doc:`/core-libraries/helpers/html`.

Supposons un User hasAndBelongsToMany Group. Dans votre controller,
définissez une variable camelCase au pluriel (groupe -> groupes dans cette
exemple, ou ExtraFunkyModele -> extraFunkyModeles) avec les options de
sélections. Dans l'action du controller vous pouvez définir ::

    $this->set('groups', $this->Users->association('Groups')->find('list'));

Et dans la vue une sélection multiple peut être crée avec ce simple code::

    echo $this->Form->input('groups._ids', ['options' => $groups]);

Si vous voulez un champ de sélection utilisant une relation belongsTo
ou hasOne, vous pouvez ajouter ceci dans votre controller Users
(en supposant que l'User belongsTo Group)::

    $this->set('groups', $this->Users->association('Groups')->find('list'));

Ensuite, ajouter les lignes suivantes à votre template de vue de formulaire::

    echo $this->Form->input('group_id', ['options' => $groups]);

Si votre nom de model est composé de deux mots ou plus,
ex. "UserGroup", quand vous passez les données en utilisant set()
vous devrez nommer vos données dans un format CamelCase
(les Majuscules séparent les mots) et au pluriel comme ceci ::

    $this->set('userGroups', $this->UserGroups->find('list'));

.. note::

    Essayez d'éviter l'utilisation de `FormHelper::input()` pour générer
    les boutons submit. Utilisez plutôt :php:meth:`FormHelper::submit()`.

Conventions de nommage des champs
---------------------------------

When creating input widgets you should name your fields after the matching
attributes in the form's entity. For example, if you created a form for an
``$article``, you would create fields named after the properities. E.g
``title``, ``body`` and ``published``.

You can create inputs for associated models, or arbitrary models by passing in
``association.fieldname`` as the first parameter::

    echo $this->Form->input('association.fieldname');

Any dots in your field names will be converted into nested request data. For
example, if you created a field with a name ``0.comments.body`` you would get
a name attribute that looks like ``0[comments][body]``. This convention makes it
easy to save data with the ORM.

When creating datetime related inputs, FormHelper will append a field-suffix.
You may notice additional fields named ``year``, ``month``, ``day``, ``hour``,
``minute``, or ``meridian`` being added. These fields will be automatically
converted into ``DateTime`` objects when entities are marshalled.

Options
-------

``FormHelper::input()`` supporte un nombre important d'options. En plus de ses
propres options ``input()`` accepte des options pour les champs input générés,
comme les attributs html. Ce qui suit va couvrir les options spécifiques de
``FormHelper::input()``.

* ``$options['type']`` Vous pouvez forcer le type d'un input, remplaçant
  l'introspection du model, en spécifiant un type. En plus des types de
  champs vus dans :ref:`automagic-form-elements`, vous pouvez aussi créez
  des 'fichiers', 'password' et divers types supportés par HTML5::

    echo $this->Form->input('field', ['type' => 'file']);
    echo $this->Form->input('email', ['type' => 'email']);

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

* ``$options['label']`` Définissez cette clé à la chaîne que vous voudriez
  afficher dans le label qui accompagne le input::

    echo $this->Form->input('name', [
        'label' => 'The User Alias'
    ]);

  Output:

  .. code-block:: html

    <div class="input">
        <label for="name">The User Alias</label>
        <input name="name" type="text" value="" id="name" />
    </div>

  Alternatively, set this key to false to disable the output of the
  label::

    echo $this->Form->input('name', ['label' => false]);

  Output:

  .. code-block:: html

    <div class="input">
        <input name="name" type="text" value="" id="name" />
    </div>

  Set this to an array to provide additional options for the
  ``label`` element. If you do this, you can use a ``text`` key in
  the array to customize the label text::

    echo $this->Form->input('name', [
        'label' => [
            'class' => 'thingy',
            'text' => 'The User Alias'
        ]
    ]);

  Output:

  .. code-block:: html

    <div class="input">
        <label for="name" class="thingy">The User Alias</label>
        <input name="name" type="text" value="" id="name" />
    </div>

* ``$options['error']`` En utilisant cette clé vous permettra de transformer
  les messages de model par défaut et de les utiliser, par exemple, pour
  définir des messages i18n. (cf  internationalisation).
  comporte un nombre de sous-options qui contrôles l'enveloppe de l'élément
  (wrapping) . Le nom de classe de l'élément enveloppé, ainsi que
  les messages d'erreurs qui contiennent du HTML devront être échappés.

  Pour désactiver le rendu des messages d'erreurs définissez la clé error
  à false::

    echo $this->Form->input('name', ['error' => false]);

  Pour modifier le type d'enveloppe de l'élément et sa classe, utilisez
  le format suivant::

  Pour surcharger les messages d'erreurs du model utilisez un tableau
  avec les clés respectant les règles de validation::

    $this->Form->input('name', [
        'error' => ['tooShort' => __('This is not long enough')]
    ]);

  As seen above you can set the error message for each validation
  rule you have in your models. In addition you can provide i18n
  messages for your forms.

Générer des types de inputs spécifiques
=======================================

En plus de la méthode générique ``input()``, le ``FormHelper`` à des
méthodes spécifiques pour générer différents types d'inputs. Ceci peut
être utilisé pour générer juste un extrait de code input, et combiné avec
d'autres méthodes comme :php:meth:`~Cake\\View\\Helper\\FormHelper::label()` et
:php:meth:`~Cake\\View\\Helper\\FormHelper::error()` pour générer des layouts
(mise en page) complètements personnalisées.

.. _general-input-options:

Options Communes
----------------

Beaucoup des différentes méthodes d'input supportent un jeu d'options communes.
Toutes ses options sont aussi supportés par ``input()``. Pour réduire les
répétitions les options communes partagées par toutes les méthodes input sont :

* ``$options['class']`` Vous pouvez définir le nom de classe pour un input::

    echo $this->Form->input('title', ['class' => 'custom-class']);

* ``$options['id']`` Définir cette clé pour forcer la valeur du DOM id pour cet
    input. This will override the idPrefix that may be set.

* ``$options['default']`` Utilisé pour définir une valeur par défaut au champ
  input. La valeur est utilisée si les données passées au formulaire ne
  contiennent pas de valeur pour le champ (ou si aucune donnée n'est
  transmise)

  Exemple d'utilisation::

    echo $this->Form->text('ingredient', ['default' => 'Sugar']);

  Exemple avec un champ sélectionné (Taille "Moyen" sera sélectionné par défaut)::

    $sizes = ['s' => 'Small', 'm' => 'Medium', 'l' => 'Large'];
    echo $this->Form->select('size', $sizes, ['default' => 'm']);

  .. note::

    Vous ne pouvez pas utiliser ``default`` pour sélectionner une chekbox -
    vous devez plutôt définir cette valeur dans ``$this->request->data`` dans
    votre controller, ou définir l'option ``checked`` de input à true.

    La valeur par défaut des champs Date et datetime peut être définie en
    utilisant la clé 'selected'.

    Attention à l'utilisation de false pour assigner une valeur par défaut. Une
    valeur false est utilisé pour désactiver/exclure les options d'un champ,
    ainsi ``'default' => false`` ne définirait aucune valeur. A la place,
    utilisez ``'default' => 0``.

En plus des options ci-dessus, vous pouvez mixer n'importe quel attribut HTML
que vous souhaitez utiliser. Chacun des nom d'options non-special sera
traité comme un attribut HTML, et appliqué a l'élément HTML input généré.
NdT. celui qui capte cette phrase gagne un giroTermoOnduleur a double
convection.

Les options pour  select, checkbox et inputs radio
--------------------------------------------------

* ``$options['value']`` Utilisé en combinaison avec un input de type
  select (ex. Pour les types select, date, heure, datetime). Définissez
  'selected' pour définir l'élément que vous souhaiteriez définir par défaut
  au rendu de l'input::

    echo $this->Form->time('close_time', [
        'value' => '13:30:00'
    ]);

  .. note::

    La clé selected pour les inputs de type date et datetime peuvent aussi
    être des timestamps UNIX.

* ``$options['empty']`` Est défini à true, pour forcer l'input à rester vide.

  Quand passé à une list select (liste de selection), ceci créera une
  option vide avec une valeur vide dans la liste déroulante. Si vous
  voulez une valeur vide avec un texte affiché ou juste une option
  vide, passer une chaîne pour vider::

      echo $this->Form->select(
          'field',
          [1, 2, 3, 4, 5],
          ['empty' => '(choose one)']
      );

  Sortie:

  .. code-block:: html

      <div class="input select">
          <label for="field">Field</label>
          <select name="field" id="field">
              <option value="">(choose one)</option>
              <option value="0">1</option>
              <option value="1">2</option>
              <option value="2">3</option>
              <option value="3">4</option>
              <option value="4">5</option>
          </select>
      </div>

  .. note::

      Si vous avez besoin de définir la valeur par défaut d'un champ
      password à vide, utilisez 'value'=> '' (deux fois simple cote) à
      la place.

    Les Options peuvent aussi fournir une paire de clé-valeur.

* ``$options['hiddenField']`` Pour certain types d' input (checkboxes,
  radios) un input caché est créé ainsi la clé dans $this->request->data
  existera même sans valeur spécifiée:

  .. code-block:: html

    <input type="hidden" name="Post[Published]" id="PostPublished_" value="0" />
    <input type="checkbox" name="Post[Published]" value="1" id="PostPublished" />

  Ceci peut être désactivé en définissant l'option ``$options['hiddenField'] = false``::

    echo $this->Form->checkbox('published', ['hiddenField' => false]);

  Retournera:

  .. code-block:: html

    <input type="checkbox" name="published" value="1">

  Si vous voulez créer de multiples blocs d'entrés regroupés
  ensemble dans un formulaire, vous devriez utiliser ce paramètre
  sur tous les inputs excepté le premier. Si le input caché est en
  place à différents endroits c'est seulement le dernier groupe
  de valeur d'input qui sera sauvegardé.

  Dans cet exemple , seules les couleurs tertiaires seront passées,
  et les couleurs primaires seront réécrite:

  .. code-block:: html

    <h2>Primary Colors</h2>
    <input type="hidden" name="color" value="0" />
    <input type="checkbox" name="color[]" value="5" id="color-red" />
    <label for="color-red">Red</label>
    <input type="checkbox" name="color[]" value="5" id="color-blue" />
    <label for="color-blue">Blue</label>
    <input type="checkbox" name="color[]" value="5" id="color-yellow" />
    <label for="color-yellow">Yellow</label>

    <h2>Tertiary Colors</h2>
    <input type="hidden" name="color" value="0" />
    <input type="checkbox" name="color[]" value="5" id="color-green" />
    <label for="ColorsGreen">Green</label>
    <input type="checkbox" name="color[]" value="5" id="color-purple" />
    <label for="color-purple">Purple</label>
    <input type="checkbox" name="color[]" value="5" id="color-orange" />
    <label for="color-orange">Orange</label>

  En désactivant le champ caché ``'hiddenField'`` dans le second groupe
  d'input empêchera ce behavior.

  Vous pouvez définir une valeur différente pour le champ caché autre que 0
  comme 'N'::

      echo $this->Form->checkbox('published', ]
          'value' => 'Y',
          'hiddenField' => 'N',
      ]);

Les options de Datetime
-----------------------

* ``$options['timeFormat']``. Utilisé pour spécifier le format des inputs
  select (menu de sélection) pour un jeu d'input en relation avec le temps.
  Les valeurs valides sont ``12``, ``24``, et ``null``.

* ``$options['minYear'], $options['maxYear']`` Utilisé en combinaison avec un
  input date/datetime. Définit les valeurs minimales et/ou maximales de fin
  montrées dans le champ select years.

* ``$options['orderYear']`` Utilisé en combinaison avec un input
  date/datetime. Définit l'ordre dans lequel la valeur de l'année sera
  délivré. Les valeurs valides sont  'asc', 'desc'. La valeur par défaut
  est 'desc'.

* ``$options['interval']`` Cette option spécifie l'écart de minutes
  entre chaque option dans la select box minute::

    echo $this->Form->input('Model.time', [
        'type' => 'time',
        'interval' => 15
    ]);

  Créera 4 options dans la select box minute. Une toute les 15 minutes.

* ``$options['round']`` Peut être défini à `up` ou `down` pour forcer l'arrondi
  dans quelque soit la direction. Par défaut à null qui arrondit à la moitié
  supérieure selon `interval`.

* ``$options['monthNames']`` If false, 2 digit numbers will be used instead of text.
  If an array, the given array will be used.

Créer des Elements Input
========================

.. php:method:: text(string $name, array $options)

    Les autres méthodes disponibles dans l'Helper Form permettent
    la création d'éléments spécifiques de formulaire. La plupart de ces
    méthodes utilisent également un paramètre spécial $options.
    Toutefois, dans ce cas, $options est utilisé avant tout pour spécifier
    les attributs des balises HTML
    (comme la valeur ou l'id DOM d'un élément du formulaire).::

        echo $this->Form->text('username', ['class' => 'users']);

    Affichera:

    .. code-block:: html

        <input name="username" type="text" class="users">

.. php:method:: password(string $fieldName, array $options)

    Création d'un champ password.::

        echo $this->Form->password('password');

    Affichera:

    .. code-block:: html

        <input name="password" value="" type="password">

.. php:method:: hidden(string $fieldName, array $options)

    Créera un input caché de form. Exemple::

        echo $this->Form->hidden('id');

    Affichera:

    .. code-block:: html

        <input name="id" value="10" type="hidden" />

.. php:method:: textarea(string $fieldName, array $options)

    Crée un champ input textarea (zone de texte).::

        echo $this->Form->textarea('notes');

    Affichera:

    .. code-block:: html

        <textarea name="notes"></textarea>

    Si le form est édité (ainsi, le tableau ``$this->request->data`` va contenir
    les informations sauvegardées pour le model ``User``), la valeur
    correspondant au champs ``notes`` sera automatiquement ajoutée au HTML
    généré. Exemple:

    .. code-block:: html

        <textarea name="data[User][notes]" id="UserNotes">
        Ce Texte va être édité.
        </textarea>

    .. note::

        Le type d'input ``textarea`` permet à l'attribut ``$options`` d'échapper
        ``'escape'`` lequel détermine si oui ou non le contenu du textarea
        doit être échappé. Par défaut à ``true``.

    ::

        echo $this->Form->textarea('notes', ['escape' => false]);
        // OU....
        echo $this->Form->input('notes', ['type' => 'textarea', 'escape' => false]);

    **Options**

    En plus de :ref:`general-input-options`, textarea() supporte quelques
    options spécifiques:

    * ``$options['rows'], $options['cols']`` Ces deux clés spécifient le
      nombre de lignes et de colonnes::

        echo $this->Form->textarea('textarea', ['rows' => '5', 'cols' => '5']);

      Affichera:

    .. code-block:: html

        <textarea name="textarea" cols="5" rows="5">
        </textarea>

.. php:method:: checkbox(string $fieldName, array $options)

    Crée un élément de formulaire checkbox. Cette méthode génère également un
    input de formulaire caché pour forcer la soumission de données pour le champ
    spécifié.::

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

    Si vous ne voulez pas que le Helper Form génère un input caché::

        echo $this->Form->checkbox('done', ['hiddenField' => false]);

    Affichera:

    .. code-block:: html

        <input type="checkbox" name="done" value="1">


.. php:method:: radio(string $fieldName, array $options, array $attributes)

    Crée un jeu d'inputs radios.

    **Options**

    * ``$attributes['value']`` pour définir quelle valeur sera sélectionnée
      par défaut.

    * ``$attributes['disabled']`` défini a ``true`` ou ``'disabled'``
      désactivera tous les boutons radios générés.

    * ``$attributes['legend']`` Les éléments Radio sont enveloppés avec un
      label et un fieldset (jeu de champs) par défaut. Définir
      ``$attributes['legend']`` à false pour les retirer.::

        $options = ['M' => 'Male', 'F' => 'Female'];
        $attributes = ['legend' => false];
        echo $this->Form->radio('gender', $options, $attributes);

      Affichera:

      .. code-block:: html

        <input name="gender" value="" type="hidden">
        <input name="gender" id="gender-M" value="M" type="radio">
        <label for="gender-m">Male</label>
        <input name="gender" id="gender-F" value="F" type="radio">
        <label for="gender-F">Female</label>

    Si pour quelque raisons vous ne voulez pas du input caché, définissez
    ``$attributes['value']`` à une valeur sélectionnée ou le booléen false

.. php:method:: select(string $fieldName, array $options, array $attributes)

    Crée un menu de sélection, rempli des éléments compris dans ``$options``,
    avec l'option spécifiée par ``$attributes['value']`` sera montré comme
    sélectionné par défaut. Définir à false la clé 'empty' dans la variable
    ``$attributes`` pour empêcher l'option empty par défaut::

        $options = ['M' => 'Male', 'F' => 'Female'];
        echo $this->Form->select('gender', $options);

    Affichera:

    .. code-block:: html

        <select name="gender">
        <option value=""></option>
        <option value="M">Male</option>
        <option value="F">Female</option>
        </select>

    L'input de type ``select``  permet un attribut ``$option`` spécial
    appelée ``'escape'``  qui accepte un booléen et détermine
    si il faut que l'entité HTML encode le contenu des options
    sélectionnées. Par défaut à true::

        $options = ['M' => 'Male', 'F' => 'Female'];
        echo $this->Form->select('gender', $options, ['escape' => false]);

    * ``$attributes['options']`` Cette clé vous permets de spécifier
      manuellement des options pour un input select (menu de sélection),
      ou pour un groupe radio. A moins que le 'type' soit spécifié à 'radio',
      le Helper Form supposera que la cible est un input select (menu de
      sélection) ::

        echo $this->Form->select('field', [1,2,3,4,5]);

      Affichera:

      .. code-block:: html

        <select name="field">
            <option value="0">1</option>
            <option value="1">2</option>
            <option value="2">3</option>
            <option value="3">4</option>
            <option value="4">5</option>
        </select>

      Les options peuvent aussi être fournies comme des paires clé-valeur::

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

      Si vous souhaitez générer un select avec des groupes optionnels,
      passez les données dans un format hiérarchique. Ceci fonctionnera
      avec les checkboxes multiples et les boutons radios également,
      mais au lieu des groupes optionnels enveloppez les éléments
      dans des fieldsets::

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

    * ``$attributes['multiple']`` Si 'multiple' a été défini à true pour
      un input select, celui ci autorisera les sélections multiples::

        echo $this->Form->select('Model.field', $options, ['multiple' => true]);

      Vous pouvez également définir 'checkbox' à 'multiple' pour afficher une
      liste de check boxes reliés::

        $options = [
            'Value 1' => 'Label 1',
            'Value 2' => 'Label 2'
        ];
        echo $this->Form->select('Model.field', $options, [
            'multiple' => 'checkbox'
        ]);

      Affichera:

      .. code-block:: html

          <input name="field" value="" type="hidden">
          <div class="checkbox">
             <input name="field[]" value="Value 1" id="field-1" type="checkbox">
             <label for="field-1">Label 1</label>
          </div>
          <div class="checkbox">
             <input name="field[]" value="Value 2" id="field-2" type="checkbox">
             <label for="field-2">Label 2</label>
          </div>

    * ``$attributes['disabled']`` Lors de la création de checkboxes, cette
      option peut être définie pour désactiver tout ou quelques checkboxes.
      Pour désactiver toutes les checkboxes, définissez disabled à ``true``::

        $options = [
            'Value 1' => 'Label 1',
            'Value 2' => 'Label 2'
        ];
        echo $this->Form->select('Model.field', $options, [
            'multiple' => 'checkbox',
            'disabled' => ['Value 1']
        ]);

      Output:

      .. code-block:: html

           <input name="field" value="" type="hidden">
           <div class="checkbox">
              <input name="field[]" disabled="disabled" value="Value 1" type="checkbox">
              <label for="field-1">Label 1</label>
           </div>
           <div class="checkbox">
              <input name="field[]" value="Value 2" id="field-2" type="checkbox">
              <label for="field-2">Label 2</label>
           </div>

.. php:method:: file(string $fieldName, array $options)

    Pour ajouter un champ upload à un formulaire, vous devez vous assurer que le
    enctype du formulaire est définit a  "multipart/form-data", donc commençons
    avec une fonction create comme ci-dessous::

        echo $this->Form->create($document, ['enctype' => 'multipart/form-data']);
        // OU
        echo $this->Form->create($document, ['type' => 'file']);

    Next add either of the two lines to your form view file::

        echo $this->Form->input('submittedfile', [
            'type' => 'file'
        ]);

        // OU
        echo $this->Form->file('submittedfile');

    En raisons des limitations du code HTML lui même, il n'est pas possible
    de placer des valeurs par défauts dans les champs inputs de type 'file'.
    A chacune des fois ou le formulaire sera affiché, la valeur sera vide.

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
            'error' => 0, // On windows this can be a string.
            'size' => 41737,
        ];

    Ce tableau est généré par PHP lui-même, pour plus de détails
    sur la façon dont PHP gère les données passées a travers
    les champs ``files``.
    `lire la section file uploads du manuel de PHP
    <http://php.net/features.file-upload>`_.

    .. note::

        When using ``$this->Form->file()``, remember to set the form
        encoding-type, by setting the type option to 'file' in
        ``$this->Form->create()``

Crée des inputs de date et d'heure (date and time inputs)
=========================================================

.. php:method:: dateTime($fieldName, $options = [])

    Creates a set of select inputs for date and time. This method accepts a number
    of options:

    * ``monthNames`` If false, 2 digit numbers will be used instead of text.
      If an array, the given array will be used.
    * ``minYear`` The lowest year to use in the year select
    * ``maxYear`` The maximum year to use in the year select
    * ``interval`` The interval for the minutes select. Defaults to 1
    * ``empty`` - If true, the empty select option is shown. If a string,
      that string is displayed as the empty element.
    * ``round`` - Set to ``up`` or ``down`` if you want to force rounding in either direction. Defaults to null.
    * ``default`` The default value to be used by the input. A value in ``$this->request->data``
      matching the field name will override this value. If no default is provided ``time()`` will be used.
    * ``timeFormat`` The time format to use, either 12 or 24.
    * ``second`` Set to true to enable seconds drop down.

    To control the order of inputs, and any elements/content between the inputs you
    can override the ``dateWidget`` template. By default the ``dateWidget`` template
    is::

        {{year}}{{month}}{{day}}{{hour}}{{minute}}{{second}}{{meridian}}

.. php:method:: year(string $fieldName, array $options = [])

    Creates a select element populated with the years from ``minYear``
    to ``maxYear``. Additionally, HTML attributes may be supplied in $options. If
    ``$options['empty']`` is false, the select will not include an
    empty option:

    * ``empty`` - If true, the empty select option is shown. If a string,
      that string is displayed as the empty element.
    * ``orderYear`` - Ordering of year values in select options.
      Possible values 'asc', 'desc'. Default 'desc'
    * ``value`` The selected value of the input.
    * ``maxYear`` The max year to appear in the select element.
    * ``minYear`` The min year to appear in the select element.

    For example, to create a year range range from 2000 to the current year you
    would do the following::

        echo $this->Form->year('purchased', [
            'minYear' => 2000,
            'maxYear' => date('Y')
        ]);

    If it was 2009, you would get the following:

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
    comme des nombres en passant false. (Note: les mois par défaut
    sont internationalisés et peuvent être traduits en utilisant la
    localisation)::

        echo $this->Form->month('mob', ['monthNames' => false]);

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

.. php:method:: hour(string $fieldName, array $attributes)

    Creates a select element populated with the hours of the day. You can
    create either 12 or 24 hour pickers using the format option::

        echo $this->Form->hour('created', [
            'format' => 12
        ]);
        echo $this->Form->hour('created', [
            'format' => 24
        ]);

.. php:method:: minute(string $fieldName, array $attributes)

    Creates a select element populated with the minutes of the hour. You
    can create a select that only contains specific values using the ``interval``
    option. For example, if you wanted 10 minute increments you would do the
    following::

        echo $this->Form->minute('created', [
            'interval' => 10
        ]);

.. php:method:: meridian(string $fieldName, array $attributes)

    Creates a select element populated with 'am' and 'pm'.

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

-  'escape' booléen si il faut ou non que le HTML échappe le contenu de
   l'erreur.
-  'wrap' valeur mixte définissant s'il faut ou pas que le message d'erreur
   soit envelopper d'une div. Si c'est une chaîne , sera utilisé comme le
   tag HTML à utiliser.
-  'class' string Le nom de classe du message d'erreur.


.. TODO:: Add examples.

.. php:method:: isFieldError(string $fieldName)

Retourne true si le champ $fieldName fourni a une erreur de validation en
cours::

    if ($this->Form->isFieldError('gender')) {
        echo $this->Form->error('gender');
    }

.. note::

    En utilisant :php:meth:`~Cake\\View\\Helper\\FormHelper::input()`, les
    erreurs sont retournées par défaut.

Création des boutons et des éléments submits
============================================

.. php:method:: submit(string $caption, array $options)

    Crée un bouton submit avec la légende ``$caption``. Si la ``$caption``
    fournie est l'URL d'une image (il contient un caractère '.'), le
    bouton submit sera rendu comme une image.

        echo $this->Form->submit();

    Affichera:

    .. code-block:: html

        <div class="submit"><input value="Submit" type="submit"></div>

    Vous pouvez aussi passer une URL relative ou absolue vers une image
    pour le paramêtre caption au lieu d'un caption text::

        echo $this->Form->submit('ok.png');

    Affichera:

    .. code-block:: html

        <div class="submit"><input type="image" src="/img/ok.png"></div>

.. php:method:: button(string $title, array $options = [])

    Crée un boutton HTML avec le titre spécifié et un type par défaut "button".
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

    Le input de type ``button`` supporte l'option ``escape`` qui accepte un
    booléen et détermine si oui ou non l'entité HTML encode le $title du bouton.
    Par défaut à false::

        echo $this->Form->button('Submit Form', ['type' => 'submit', 'escape' => true]);

.. php:method:: postButton(string $title, mixed $url, array $options = [])

    Crée une balise ``<button>`` avec un ``<form>`` l'entourant  qui soumet à
    travers POST.

    Cette méthode créé un élément ``<form>``. Donc n'utilisez pas
    pas cette méthode dans un formulaire ouvert. Utilisez plutôt
    :php:meth:`Cake\\View\\Helper\\FormHelper::submit()` ou
    :php:meth:`Cake\\View\\Helper\\FormHelper::button()`
    pour créér des boutons a l'intérieur de formulaires ouvert.

.. php:method:: postLink(string $title, mixed $url = null, array $options = [], string $confirmMessage = false)

    Crée un lien HTML, mais accède à l'Url en utilisant la méthode POST.
    Requiert que JavaScript  soit autorisé dans votre navigateur.

    Cette méthode créée un élément ``<form>``. Donc n'utilisez pas cette
    méthode dans un formulaire existant. En remplacement vous devriez
    ajouter un bouton submit en utilisant
    :php:meth:`Cake\\View\\Helper\\FormHelper::submit()`.

Fermer le Formulaire
====================

.. php:method:: end($secureAttributes = [])

    Le FormHelper inclut également une méthode ``end()`` qui
    complète le marquage du formulaire. Souvent, ``end()`` affiche juste
    la base fermante du formulaire, mais l'utilisation de ``end()`` permet
    également au FormHelper d'ajouter les champs cachées dont le component
    Security :php:class:`Cake\\Controller\\Component\\SecurityComponent` a
    besoin.:

    .. code-block:: php

        <?= $this->Form->create(); ?>

        <!-- Form elements go here -->

        <?= $this->Form->end(); ?>

    The ``$secureAttributes`` parameter allows you to pass additional HTML
    attributes to the hidden inputs that are generated when your application is
    using ``SecurityComponent``. If you need to add additional attributes to the
    generated hidden inputs you can use the ``$secureAttributes`` argument::

        echo $this->Form->end(['data-type' => 'hidden']);

    Will output:

    .. code-block:: html

        <div style="display:none;">
            <input type="hidden" name="_Token[fields]" data-type="hidden"
                value="2981c38990f3f6ba935e6561dc77277966fabd6d%3AAddresses.id">
            <input type="hidden" name="_Token[unlocked]" data-type="hidden"
                value="address%7Cfirst_name">
        </div>

    .. note::

        If you are using
        :php:class:`Cake\\Controller\\Component\\SecurityComponent` in your
        application you should always end your forms with ``end()``.

Customizing the Templates FormHelper Uses
=========================================

Like many helpers in CakePHP, FormHelper uses string templates to format the
HTML it creates. While the default templates are intended to be a reasonable set
of defaults. You may need to customize the templates to suit your application.

To change the templates when the helper is loaded you can set the ``templates``
option when including the helper in your controller::

    public $helpers = [
        'Form' => [
            'templates' => 'app_form.php',
        ]
    ];

This would load the tags in ``App/Config/app_form.php``. This file should
contain an array of templates indexed by name::

    $config = [
        'groupContainer' => '<div class="form-control">{{content}}</div>',
    ];

Any templates you define will replace the default ones included in the helper.
Templates that are not replaced, will continue to use the default values.
You can also change the templates at runtime using the ``templates()`` method::

    $myTemplates = [
        'groupContainer' => '<div class="form-control">{{content}}</div>',
    ];
    $this->Form->templates($myTemplates);

List of Templates
-----------------

A list of the default templates and the variables they can expect are:

* ``button`` {{attrs}}, {{text}}
* ``checkbox`` {{name}}, {{value}}, {{attrs}}
* ``checkboxContainer`` {{input}}, {{label}}
* ``dateWidget`` {{year}}, {{month}}, {{day}}, {{hour}}, {{minute}}, {{second}}, {{meridian}}
* ``error`` {{content}}
* ``errorList`` {{content}}
* ``errorItem`` {{text}}
* ``file`` {{name}}, {{attrs}}
* ``formstart`` {{attrs}}
* ``formend`` No variables are provided.
* ``hiddenblock`` {{content}}
* ``input`` {{type}}, {{name}}, {{attrs}}
* ``inputsubmit`` {{type}}, {{attrs}}
* ``label`` {{attrs}}, {{text}}
* ``option`` {{value}}, {{attrs}}, {{text}}
* ``optgroup`` {{label}}, {{attrs}}, {{content}}
* ``select`` {{name}}, {{attrs}}, {{content}}
* ``selectMultiple`` {{name}}, {{attrs}}, {{content}}
* ``radio`` {{name}}, {{value}}, {{attrs}}
* ``radioContainer``  {{input}}, {{label}},
* ``textarea``  {{name}}, {{attrs}}, {{value}}
* ``formGroup`` {{label}}, {{input}},
* ``checkboxFormGroup`` {{input}}, {{label}},
* ``groupContainer`` {{type}}, {{required}}, {{content}}
* ``groupContainerError`` {{type}}, {{required}}, {{content}}, {{error}}
* ``submitContainer`` {{content}}

Generating Entire Forms
=======================

.. php:method:: inputs(mixed $fields = null, array $blacklist = null, $options = [])

Generates a set of inputs for the given context. By default, all fields for the
current top level entity are generated. By setting ``$fields`` to a string you
can provide custom legend element content::

    echo $this->Form->inputs('Update news post');

You can configure the generated inputs by defining additional options in the
``$fields`` parameter::

    echo $this->Form->inputs([
        'name' => ['label' => 'custom label']
    ]);

To exclude specific fields from the generated inputs, use the ``$blacklist``
parameter::

    echo $this->Form->inputs([], ['password']);

When customizing, ``fields`` or using the ``blacklist`` parameter, you can use
the ``$options`` parameter to control the generated legend/fieldset.

- ``fieldset`` Set to false to disable the fieldset. If a string is supplied
  it will be used as the class name for the fieldset element.
- ``legend`` Set to false to disable the legend for the generated input set.
  Or supply a string to customize the legend text.

For example::

    echo $this->Form->inputs(
        [
            'name' => ['label' => 'custom label']
        ],
        null,
        ['legend' => 'Update your post']
    );

If you disable the fieldset, the legend will not print.

Adding Custom Widgets
=====================

CakePHP makes it easy to add custom input widgets in your application, and use
them like any other input type. All of the core input types are implemented as
wigets, which means you can easily override any core widget with your own
implemenation as well.

Building a Widget Class
-----------------------

Widget classes have a very simple required interface. They must implement the
:php:class:`Cake\\View\\Widget\\WidgetInterface`. This interface requires
a the ``render(array $data)`` method to be implemented. The render method
expects an array of data to build the widget and is expected to return an string
of HTML for the widget. If CakePHP is constructing your widget you can expect to
get a ``Cake\View\StringTemplate`` instance as the first argument, followed by
any dependencies you define. If we wanted to build an Autocomplete widget you
could do the following::

    namespace App\View\Widget;

    use Cake\View\Widget\WidgetInterface;

    class Autocomplete implements WidgetInterface {

        protected $_templates;

        public function __construct($templates) {
            $this->_templates = $templates;
        }

        public function render(array $data) {
            $data += [
                'name' => '',
            ];
            return $this->_templates->format('autocomplete', [
                'name' => $data['name'],
                'attrs' => $this->_templates->formatAttributes($data, ['name'])
            ]);
        }

    }

Obviously, this is a very simple example, but it demonstrates how a custom
widget could be built.

Using Widgets
-------------

You can load custom widgets either in the ``$helpers`` array or using the
``addWidget()`` method. In your helpers array, widgets are defined as
a setting::

    public $helpers = [
        'Form' => [
            'widgets' => [
                'autocomplete' => ['App\View\Widget\Autocomplete']
            ]
        ]
    ];

If your widget requires other widgets, you can have FormHelper populate those
dependencies by declaring them::

    public $helpers = [
        'Form' => [
            'widgets' => [
                'autocomplete' => [
                    'App\View\Widget\Autocomplete',
                    'text',
                    'label'
                ]
            ]
        ]
    ];

In the above example, the autocomplete widget would depend on the ``text`` and
``label`` widgets. When the autocomplete widget is created, it will be passed
the widget objects that are related to the ``text`` and ``label`` names. To add
widgets using the ``addWidget()`` method would look like::

    // Using a classname.
    $this->Form->addWidget(
        'autocomplete',
        ['App\View\Widget\Autocomplete', 'text' 'label']
    );

    // Using an instance - requires you to resolve dependencies.
    $autocomplete = new Autocomplete(
        $this->Form->getTemplater(),
        $this->Form->widgetRegistry()->get('text'),
        $this->Form->widgetRegistry()->get('label'),
    );
    $this->Form->addWidget('autocomplete', $autocomplete);

Once added/replaced, widgets can be used as the input 'type'::

    echo $this->Form->input('search', ['type' => 'autocomplete']);

This will create the custom widget with a label and wrapping div just like
``input()`` always does. Alternatively, you can create just the input widget
using the magic method::

    echo $this->Form->autocomplete('search', $options);

Working with SecurityComponent
==============================

:php:meth:`Cake\\Controller\\Component\\SecurityComponent` offers several
features that make your forms safer and more secure. By simply including the
``SecurityComponent`` in your controller, you'll automatically benefit from CSRF
and form tampering features.

As mentioned previously when using SecurityComponent, you should always close
your forms using :php:meth:`~Cake\\View\\Helper\\FormHelper::end()`. This will
ensure that the special ``_Token`` inputs are generated.

.. php:method:: unlockField($name)

    Unlocks a field making it exempt from the ``SecurityComponent`` field
    hashing. This also allows the fields to be manipulated by JavaScript.
    The ``$name`` parameter should be the entity name for the input::

        $this->Form->unlockField('User.id');

.. php:method:: secure(array $fields = [])

    Generates a hidden field with a security hash based on the fields used
    in the form.


.. meta::
    :title lang=fr: FormHelper
    :description lang=fr: The FormHelper focuses on creating forms quickly, in a way that will streamline validation, re-population and layout.
    :keywords lang=fr: html helper,cakephp html,form create,form input,form select,form file field,form label,form text,form password,form checkbox,form radio,form submit,form date time,form error,validate upload,unlock field,form security
