Form
####

.. php:namespace:: Cake\View\Helper

.. php:class:: FormHelper(View $view, array $config = [])

Le Helper Form prend en charge la plupart des opérations lourdes de la création
de formulaire. Le Helper Form se concentre sur la possibilité de créer des
formulaires rapidement, d'une manière qui permettra de rationaliser la
validation, la re-population et la mise en page (layout). Le Helper Form est
aussi flexible - Il va faire à peu près tout pour vous en utilisant les
conventions, ou vous pouvez utiliser des méthodes spécifiques pour ne prendre
uniquement que ce dont vous avez besoin.

Création de Formulaire
======================

.. php:method:: create(mixed $model = null, array $options = [])

La première méthode que vous aurez besoin d'utiliser pour tirer pleinement
profit du Helper Form (Helper Formulaire) est ``create()``. Cette méthode
affichera une balise d'ouverture de formulaire.

Tous les paramètres sont optionnels. Si ``create()`` est appelée sans paramètre,
CakePHP supposera que vous voulez créer un formulaire en rapport avec le
controller courant, via l'URL actuelle. par défaut, la méthode de soumission par
des formulaires est POST. Si vous appelez ``create()`` dans une vue pour
UsersController::add(), vous verrez la sortie suivante dans la vue:

.. code-block:: html

    <form method="post" action="/users/add">

L'argument ``$model`` est utilisé comme 'context' du formulaire. Il y a
plusieurs contextes de formulaires intégrés et vous pouvez ajouter les vôtres,
ce que nous allons voir dans la prochaine section. Ceux intégrés correspondent
aux valeurs suivantes de ``$model``:

* Une instance ``Entity`` ou un iterateur qui mappe vers ``EntityContext``, ce
  contexte permet au FormHelper de fonctionner avec les résultats à partir de
  ceux intégrés dans l'ORM.
* Un tableau contenant la clé ``schema``, qui mappe vers ``ArrayContext`` ce
  qui vous permet de créer des structures simples de données pour construire
  des formulaires.
* ``null`` et ``false`` mappe vers ``NullContext``, cette classe de contexte
  satisfait simplement l'interface requise par FormHelper. Ce contexte est utile
  si vous voulez construire un formulaire court qui ne nécessite pas la
  persistance de l'ORM.

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
comme un formulaire d'édition. Par exemple, si nous naviguons vers
**http://example.org/articles/edit/5**, nous pourrions faire ce qui suit::

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

Le tableau ``$options`` est là où la configuration du formulaire se passe. Ce
tableau spécial peut contenir un certain nombre de paires de clé-valeur
différentes qui affectent la façon dont la balise form est générée.

.. _form-values-from-query-string:

Getting form values from the query string
-----------------------------------------

.. versionadded:: 3.4.0

A FormHelper's values sources define where its rendered elements, such as
input-tags, receive their values from.

By default FormHelper draws its values from the 'context'.  The default
contexts, such as ``EntityContext``, will fetch data from the current entity, or
from ``$request->data``.

If however, you are building a form that needs to read from the query string,
you can use ``valueSource()`` to change where ``FormHelper`` reads data input
data from::

    // Prioritize query string over context:
    echo $this->Form->create($article, [
        'valueSources' => ['query', 'context']
    ]);

    // Same effect:
    echo $this->Form
        ->setValueSources(['query', 'context'])
        ->create($articles);

    // Only read data from the query string
    echo $this->Form->create($article);
    $this->Form->setValueSources('query');

    // Same effect:
    echo $this->Form->create($article, ['valueSources' => 'query']);

The supported sources are ``context``, ``data`` and ``query``. You can use one
or more sources. Any widgets generated by FormHelper will pick gather their
values from the sources, in the order you setup.

The value sources will be reset to the default (``['context']``) when ``end()``
is called.

Changer la méthode HTTP pour un Formulaire
------------------------------------------

En utilisant l'option ``type``, vous pouvez changer la méthode HTTP qu'un
formulaire va utiliser::

      echo $this->Form->create($article, ['type' => 'get']);

Affichera:

.. code-block:: html

     <form method="get" action="/articles/edit/5">

En spécifiant 'file' cela changera la méthode de soumission à 'post', et
ajoutera un enctype "multipart/form-data" dans le tag du formulaire.
Vous devez l'utiliser si vous avez des demandes de fichiers dans votre
formulaire. L'absence de cet attribut enctype empêchera le fonctionnement de
l'envoi de fichiers::

    echo $this->Form->create($article, ['type' => 'file']);

Affichera:

.. code-block:: html

    <form enctype="multipart/form-data" method="post" action="/articles/add">

Quand vous utilisez 'put', 'patch' ou 'delete', votre formulaire aura un
fonctionnement équivalent à un formulaire de type 'post', mais quand il sera
envoyé, la méthode de requête HTTP sera respectivement réécrite avec 'PUT',
PATCH' ou 'DELETE'. Cela permettra à CakePHP de créer son propre support REST
dans les navigateurs web.

Définir l'URL pour le Formulaire
-------------------------------------------------

Utiliser l'option ``url`` vous permet de diriger le formulaire vers une
action spécifique dans votre controller courant ou dans toute votre application.
Par exemple, si vous voulez diriger le formulaire vers une action login() du
controller courant, vous pouvez fournir le tableau $options comme ce qui suit::

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
<https://api.cakephp.org/3.0/class-Cake.View.Form.ContextInterface.html>`_ . Une
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

.. php:method:: input(string $fieldName, array $options = [])

La méthode ``input()`` vous laisse générer des inputs de formulaire. Ces inputs
incluent une div enveloppante, un label, un widget d'input, et une erreur de
validation si besoin. En utilisant les metadonnées dans le contexte du
formulaire, cette méthode va choisir un type d'input approprié pour chaque
champ. En interne, ``input()`` utilise les autres méthodes de FormHelper.

Le type d'input créé dépend de la colonne datatype:

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

    echo $this->Form->input('published', ['type' => 'checkbox']);

.. _html5-required:

Un nom de classe ``required`` sera ajouté à la div enveloppante si les règles de
validation pour le champ du model indiquent qu'il est requis et ne peut pas être
vide. Vous pouvez désactiver les require automatiques en utilisant l'option
required::

    echo $this->Form->input('title', ['required' => false]);

Pour empêcher la validation faite par le navigateur pour l'ensemble du
formulaire, vous pouvez définir l'option ``'formnovalidate' => true`` pour le
bouton input que vous générez en utilisant
:php:meth:`~Cake\\View\\Helper\\FormHelper::submit()` ou définir
``'novalidate' => true`` dans les options pour
:php:meth:`~Cake\\View\\Helper\\FormHelper::create()`.

Par exemple, supposons que votre model User intègre les champs pour un
username (varchar), password (varchar), approved (datetime) and
quote (text). Vous pouvez utiliser la méthode input() du FormHelper pour
créer les bons inputs pour tous ces champs de formulaire::

    echo $this->Form->create($user);
    // Text
    echo $this->Form->input('username');
    // Password
    echo $this->Form->input('password');
    // Jour, mois, année, heure, minute, méridien
    echo $this->Form->input('approved');
    // Textarea
    echo $this->Form->input('quote');

    echo $this->Form->button('Ajouter');
    echo $this->Form->end();

Un exemple plus complet montrant quelques options pour le champ de date::

    echo $this->Form->input('birth_dt', [
        'label' => 'Date de naissance',
        'minYear' => date('Y') - 70,
        'maxYear' => date('Y') - 18,
    ]);

Outre les options spécifiques pour ``input()`` vu ci-dessus, vous pouvez
spécifier n'importe quelle option pour le type d'input et n'importe quel
attribut HTML (par exemple ``onfocus``).

Si vous voulez un champ de sélection utilisant une relation belongsTo
ou hasOne, vous pouvez ajouter ceci dans votre controller Users
(en supposant que l'User belongsTo Group)::

    $this->set('groups', $this->Users->Groups->find('list'));

Ensuite, ajouter les lignes suivantes à votre template de vue de formulaire::

    echo $this->Form->input('group_id', ['options' => $groups]);

Pour créer un select pour l'association belongsToMany Groups, vous pouvez
ajouter ce qui suit dans votre UsersController::

    $this->set('groups', $this->Users->Groups->find('list'));

Ensuite, ajouter les lignes suivantes à votre template de vue::

    echo $this->Form->input('groups._ids', ['options' => $groups]);

Si votre nom de model est composé de deux mots ou plus,
ex. "UserGroup", quand vous passez les données en utilisant set()
vous devrez nommer vos données dans un format CamelCase
(les Majuscules séparent les mots) et au pluriel comme ceci::

    $this->set('userGroups', $this->UserGroups->find('list'));

.. note::

    N'utilisez pas ``FormHelper::input()`` pour générer
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

    echo $this->Form->input('association.fieldname');

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

Options
-------

``FormHelper::input()`` supporte un nombre important d'options. En plus de ses
propres options, ``input()`` accepte des options pour les champs input générés,
comme les attributs html. Ce qui suit va couvrir les options spécifiques de
``FormHelper::input()``.

* ``$options['type']`` Vous pouvez forcer le type d'un input, remplaçant
  l'introspection du model, en spécifiant un type. En plus des types de
  champs vus dans :ref:`automagic-form-elements`, vous pouvez aussi créer
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

* ``$options['label']`` Définissez cette clé à la chaîne que vous voulez
  afficher dans le label qui accompagne l'input::

    echo $this->Form->input('name', [
        'label' => 'The User Alias'
    ]);

  Affiche:

  .. code-block:: html

    <div class="input">
        <label for="name">The User Alias</label>
        <input name="name" type="text" value="" id="name" />
    </div>

  D'une autre façon, définissez cette clé à ``false`` pour désactiver
  l'affichage de ce label::

    echo $this->Form->input('name', ['label' => false]);

  Affiche:

  .. code-block:: html

    <div class="input">
        <input name="name" type="text" value="" id="name" />
    </div>

  Définissez ceci dans un tableau pour fournir des options supplémentaires pour
  l'element ``label``. Si vous le faîtes, vous pouvez utiliser une clé ``text``
  dans le tableau pour personnaliser le texte du label::

    echo $this->Form->input('name', [
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

* ``$options['error']`` Utiliser cette clé vous permettra de transformer
  les messages de model par défaut et de les utiliser, par exemple, pour
  définir des messages i18n.

  Pour désactiver le rendu des messages d'erreurs définissez la clé error
  ``false``::

    echo $this->Form->input('name', ['error' => false]);

  Pour surcharger les messages d'erreurs du model utilisez un tableau
  avec les clés respectant les messages d'erreurs de validation originaux::

    $this->Form->input('name', [
        'error' => ['Not long enough' => __('This is not long enough')]
    ]);

  Comme vu précédemment, vous pouvez définir le message d'erreur pour chaque
  règle de validation dans vos models. De plus, vous pouvez fournir des
  messages i18n pour vos formulaires.

Générer des Types d'Inputs Spécifiques
======================================

En plus de la méthode générique ``input()``, le ``FormHelper`` à des
méthodes spécifiques pour générer différents types d'inputs. Ceci peut
être utilisé pour générer juste un extrait de code input, et combiné avec
d'autres méthodes comme :php:meth:`~Cake\\View\\Helper\\FormHelper::label()` et
:php:meth:`~Cake\\View\\Helper\\FormHelper::error()` pour générer des layouts
(mise en page) complètements personnalisés.

.. _general-input-options:

Options Communes
----------------

Beaucoup des différentes méthodes d'input supportent un jeu d'options communes.
Toutes ses options sont aussi supportées par ``input()``. Pour réduire les
répétitions, les options communes partagées par toutes les méthodes input sont :

* ``$options['id']`` Définir cette clé pour forcer la valeur du DOM id pour cet
  input. Cela remplacera l'idPrefix qui pourrait être fixé.

* ``$options['default']`` Utilisé pour définir une valeur par défaut au champ
  input. La valeur est utilisée si les données passées au formulaire ne
  contiennent pas de valeur pour le champ (ou si aucune donnée n'est
  transmise). Une valeur par défaut explicite va surcharger toute valeur définie
  par défaut dans le schéma.

  Exemple d'utilisation::

    echo $this->Form->text('ingredient', ['default' => 'Sugar']);

  Exemple avec un champ sélectionné (Taille "Moyen" sera sélectionné par
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

* ``$options['value']`` Utilisée pour définir une valeur spécifique pour le
  champ d'input. Ceci va surcharger toute valeur qui aurait pu être injectée à
  partir du contexte, comme Form, Entity or ``request->data`` etc.

  .. note::

    Si vous souhaitez définir un champ pour qu'il ne rende pas sa valeur
    récupérée à partir du contexte ou de la source de valeurs, vous devrez
    définir ``$options['value']`` en ``''`` (au lieu de le définir avec
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

Les Options pour Select, Checkbox et Inputs Radio
-------------------------------------------------

* ``$options['value']`` Peut aussi être utilisée en combinaison avec un input
  de type select (ex. Pour les types select, date, heure, datetime). Définissez
  'selected' pour définir l'élément que vous souhaiteriez définir par défaut au
  rendu de l'input::

    echo $this->Form->time('close_time', [
        'value' => '13:30:00'
    ]);

  .. note::

    La clé value pour les inputs de type date et datetime peut aussi
    être un timestamp UNIX ou un objet DateTime.

  Pour un input select où vous définissez l'attribut ``multiple`` à true,
  vous pouvez utiliser un tableau des valeurs que vous voulez sélectionner par
  défaut::

    echo $this->Form->select('rooms', [
        'multiple' => true,
        // options avec valeurs 1 et 3 seront sélectionnées par défaut
        'default' => [1, 3]
    ]);

* ``$options['empty']`` Est défini à ``true``, pour forcer l'input à rester vide.

  Quand passé à une list select (liste de sélection), ceci créera une
  option vide avec une valeur vide dans la liste déroulante. Si vous
  voulez une valeur vide avec un texte affiché ou juste une option
  vide, passer une chaîne pour vider::

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

  Les options peuvent aussi fournir une paire de clé-valeur.

* ``$options['hiddenField']`` Pour certain types d'input (checkboxes,
  radios) un input caché est créé. Ainsi, la clé dans $this->request->data
  existera même sans valeur spécifiée:

  .. code-block:: html

    <input type="hidden" name="published" value="0" />
    <input type="checkbox" name="published" value="1" />

  Ceci peut être désactivé en définissant l'option ``$options['hiddenField'] = false``::

    echo $this->Form->checkbox('published', ['hiddenField' => false]);

  Retournera:

  .. code-block:: html

    <input type="checkbox" name="published" value="1">

  Si vous voulez créer de multiples blocs d'entrées regroupés
  ensemble dans un formulaire, vous devriez utiliser ce paramètre
  sur tous les inputs excepté le premier. Si le input caché est en
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

  Désactiver le champ caché ``'hiddenField'`` dans le second groupe
  d'input empêchera ce comportement.

  Vous pouvez définir une valeur différente pour le champ caché autre que 0
  comme 'N'::

      echo $this->Form->checkbox('published', [
          'value' => 'Y',
          'hiddenField' => 'N',
      ]);

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

    echo $this->Form->input('time', [
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

Créer des Elements Input
========================

Créer des Inputs Text
---------------------

.. php:method:: text(string $name, array $options)

  Les autres méthodes disponibles dans l'Helper Form permettent
  la création d'éléments spécifiques de formulaire. La plupart de ces
  méthodes utilisent également un paramètre spécial $options.
  Toutefois, dans ce cas, $options est utilisé avant tout pour spécifier
  les attributs des balises HTML
  (comme la valeur ou l'id DOM d'un élément du formulaire)::

    echo $this->Form->text('username', ['class' => 'users']);

Affichera:

.. code-block:: html

    <input name="username" type="text" class="users">

Créer des Inputs Password
-------------------------

.. php:method:: password(string $fieldName, array $options)

Création d'un champ password::

    echo $this->Form->password('password');

Affichera:

.. code-block:: html

    <input name="password" value="" type="password">

Créer des Inputs Cachés
-----------------------

.. php:method:: hidden(string $fieldName, array $options)

Créera un input caché de form. Exemple::

    echo $this->Form->hidden('id');

Affichera:

.. code-block:: html

    <input name="id" value="10" type="hidden" />

Créer des Textareas
-------------------

.. php:method:: textarea(string $fieldName, array $options)

Crée un champ input textarea (zone de texte)::

    echo $this->Form->textarea('notes');

Affichera:

.. code-block:: html

    <textarea name="notes"></textarea>

Si le form est édité (ainsi, le tableau ``$this->request->getData()`` va contenir
les informations sauvegardées pour le model ``User``), la valeur
correspondant au champs ``notes`` sera automatiquement ajoutée au HTML
généré. Exemple:

.. code-block:: html

    <textarea name="data[User][notes]" id="UserNotes">
    Ce Texte va être édité.
    </textarea>

.. note::

    Le type d'input ``textarea`` permet à l'attribut ``$options`` la valeur
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

Créer des Checkboxes
--------------------

.. php:method:: checkbox(string $fieldName, array $options)

Crée un élément de formulaire checkbox. Cette méthode génère également un
input de formulaire caché pour forcer la soumission de données pour le champ
spécifié::

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

Créer des Boutons Radio
-----------------------

.. php:method:: radio(string $fieldName, array $options, array $attributes)

Crée un jeu d'inputs radios.

**Attributes**

* ``value`` - Indique la valeur quand ce bouton radio est coché.
* ``label`` - booléen pour indiquer si oui ou non les labels pour les widgets
  doivent être affichés.
* ``hiddenField`` - booléen pour indiquer si vous voulez que les résultats de
  radio() incluent un input caché avec une valeur de ''. C'est utile pour créer
  des ensembles de radio qui ne sont pas continus.
* ``disabled`` - Défini à ``true`` ou ``disabled`` pour désactiver tous les
  boutons radio.
* ``empty`` - Défini à ``true`` pour créer un input avec la valeur '' en
  première option. Quand à ``true``, le label radio sera 'vide'. Définissez
  cette option pour contrôler la valeur du label.

Généralement, ``$options`` est une simple paire clé => valeur. Cependant, si
vous avez besoin de mettre des attributs personnalisés sur vos boutons radio,
vous pouvez utiliser le format étendu::

    echo $this->Form->radio(
        'favorite_color',
        [
            ['value' => 'r', 'text' => 'Red', 'style' => 'color:red;'],
            ['value' => 'u', 'text' => 'Blue', 'style' => 'color:blue;'],
            ['value' => 'g', 'text' => 'Green', 'style' => 'color:green;'],
        ]
    );

    // Affichera
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

Créer des Pickers Select
------------------------

.. php:method:: select(string $fieldName, array $options, array $attributes)

Crée un menu de sélection, rempli des éléments compris dans ``$options``,
avec l'option spécifiée par ``$attributes['value']`` sera montré comme
sélectionné par défaut. Définir à ``true`` (la valeur par défaut est ``false``)
pour ajouter une option vide avec une valeur vide en haut de votre liste 
déroulante::

    $options = ['M' => 'Male', 'F' => 'Female'];
    echo $this->Form->select('gender', $options, ['empty' => true]);

Affichera:

.. code-block:: html

    <select name="gender">
    <option value=""></option>
    <option value="M">Male</option>
    <option value="F">Female</option>
    </select>

L'input de type ``select``  permet un attribut ``$option`` spécial
appelée ``'escape'``  qui accepte un booléen et détermine
s'il faut que l'entité HTML encode le contenu des options
sélectionnées. Par défaut à ``true``::

    $options = ['M' => 'Male', 'F' => 'Female'];
    echo $this->Form->select('gender', $options, ['escape' => false]);

* ``$attributes['options']`` Cette clé vous permet de spécifier
  manuellement des options pour un input select (menu de sélection),
  ou pour un groupe radio. A moins que le 'type' soit spécifié à 'radio',
  le Helper Form supposera que la cible est un input select (menu de
  sélection)::

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

Pour générer des attributs avec option dans une balise::

    $options = [
        [ 'text' => 'Description 1', 'value' => 'value 1', 'attr_name' => 'attr_value 1' ],
        [ 'text' => 'Description 2', 'value' => 'value 2', 'attr_name' => 'attr_value 2' ],
        [ 'text' => 'Description 3', 'value' => 'value 3', 'other_attr_name' => 'other_attr_value' ],
    ];
    echo $this->Form->select('field', $options);

Affiche:

.. code-block:: html

    <select name="field">
        <option value="value 1" attr_name="attr_value 1">Description 1</option>
        <option value="value 2" attr_name="attr_value 2">Description 2</option>
        <option value="value 3" other_attr_name="other_attr_value">Description 3</option>
    </select>

* ``$attributes['multiple']`` Si 'multiple' a été défini à ``true`` pour
  un input select, celui ci autorisera les sélections multiples::

    echo $this->Form->select('field', $options, ['multiple' => true]);

  Vous pouvez également définir 'checkbox' à 'multiple' pour afficher une
  liste de check boxes reliés::

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

* ``$attributes['disabled']`` Lors de la création de checkboxes, cette
  option peut être définie pour désactiver tout ou quelques checkboxes.
  Pour désactiver toutes les checkboxes, définissez disabled à ``true``::

    $options = [
        'Value 1' => 'Label 1',
        'Value 2' => 'Label 2'
    ];
    echo $this->Form->select('field', $options, [
        'multiple' => 'checkbox',
        'disabled' => ['Value 1']
    ]);

  Affiche:

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

Pour ajouter un champ upload à un formulaire, vous devez vous assurer que le
enctype du formulaire est définit a  "multipart/form-data", donc commençons
avec une fonction create comme ci-dessous::

    echo $this->Form->create($document, ['enctype' => 'multipart/form-data']);
    // OU
    echo $this->Form->create($document, ['type' => 'file']);

Ensuite ajoutez l'une des deux lignes dans votre formulaire::

    echo $this->Form->input('submittedfile', [
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

    echo $this->Form->datetime('released', [
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

    En utilisant :php:meth:`~Cake\\View\\Helper\\FormHelper::input()`, les
    erreurs sont retournées par défaut.

Création des boutons et des éléments submit
============================================

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
qu'ils attendent se trouvent dans la `documentation API du FormHelper <https://api.cakephp.org/3.2/class-Cake.View.Helper.FormHelper.html#%24_defaultConfig>`_.

En plus de ces templates, la méthode ``input()`` va essayer d'utiliser les
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
    echo $this->Form->input('password', [
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
    echo $this->Form->input('title');

    // Inputs auteur (belongsTo)
    echo $this->Form->input('author.id');
    echo $this->Form->input('author.first_name');
    echo $this->Form->input('author.last_name');

    // Profile de l'auteur (belongsTo + hasOne)
    echo $this->Form->input('author.profile.id');
    echo $this->Form->input('author.profile.username');

    // Tags inputs (belongsToMany)
    echo $this->Form->input('tags.0.id');
    echo $this->Form->input('tags.0.name');
    echo $this->Form->input('tags.1.id');
    echo $this->Form->input('tags.1.name');

    // Select multiple pour belongsToMany
    echo $this->Form->input('tags._ids', [
        'type' => 'select',
        'multiple' => true,
        'options' => $tagList,
    ]);

    // Inputs pour la table de jointure (articles_tags)
    echo $this->Form->input('tags.0._joinData.starred');
    echo $this->Form->input('tags.1._joinData.starred');

    // Inputs commentaires (hasMany)
    echo $this->Form->input('comments.0.id');
    echo $this->Form->input('comments.0.comment');
    echo $this->Form->input('comments.1.id');
    echo $this->Form->input('comments.1.comment');

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
un widget personnalisé.

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

    echo $this->Form->input('search', ['type' => 'autocomplete']);

Cela créera un widget personnalisé avec un label et une div enveloppante
tout comme ``input()`` le fait toujours. Sinon vous pouvez juste créer un widget
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
    :keywords lang=fr: html helper,cakephp html,form create,form input,form select,form file field,form label,form text,form password,form checkbox,form radio,form submit,form date time,form error,validate upload,unlock field,form security
