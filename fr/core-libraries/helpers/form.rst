FormHelper
##########

.. php:class:: FormHelper(View $view, array $settings = array())

Le Helper Form prend en charge la plupart des opérations lourdes en création du
formulaire. Le Helper Form se concentre sur la possibilité de créer des
formulaires rapidement, d'une manière qui permettra de rationaliser la
validation, la re-population et la mise en page (layout). Le Helper Form est
aussi flexible - Il va faire à peu près tout pour vous en utilisant les
conventions, ou vous pouvez utiliser des méthodes spécifiques pour ne prendre
uniquement que ce dont vous avez besoin.

Création de Formulaire
======================

La première méthode dont vous aurez besoin d'utiliser pour prendre pleinement
avantage du Helper Form (Helper Formulaire) est ``create()``. Cette méthode
affichera un tag d'ouverture de formulaire.

.. php:method:: create(string $model = null, array $options = array())

    Tous les paramètres sont optionnels. Si create() est appelée sans
    paramètres, CakePHP supposera que vous voulez créer un formulaire
    en rapport avec le controller courant, ou l'URL actuelle. La méthode
    par défaut pour les formulaires est POST. L'élément du formulaire est
    également renvoyé avec un DOM ID. Cet identifiant est créé à partir
    du nom du model, et du nom du controller en notation CamelCase
    (les majuscules délimitent les mots). Si j'appelle ``create()`` dans une
    vue de UsersController, j'obtiendrai ce genre de rendu dans ma vue :

    .. code-block:: html

         <form id="UserAddForm" method="post" action="/users/add">

    .. note::

        Vous pouvez aussi passer ``false`` pour ``$model``. Ceci placera
        vos donnée de formulaire dans le tableau: ``$this->request->data``
        (au lieu du sous tableau:``$this->request->data['Model']``).
        Cela peut être pratique pour des formulaires courts qui ne
        représenteraient rien dans votre base de données.

    La méthode ``create()`` nous permet également de personnaliser
    plusieurs paramètres. Premièrement, vous pouvez spécifier un nom
    de model. Ce faisant, vous modifiez le *contexte* de ce formulaire.
    Tous les champs seront supposés dépendre de ce model
    (sauf si spécifié), et tous les models devront être liés à lui.
    Si vous ne spécifiez pas de model, CakePHP supposera que vous
    utilisez le model par défaut pour le controller courant. ::

        // si vous êtes sur /recipes/add
        echo $this->Form->create('Recipe');

    Affichera:

    .. code-block:: html

        <form id="RecipeAddForm" method="post" action="/recipes/add">

    Ce formulaire enverra les données à votre action ``add()`` de
    RecipesController (RecettesController) . Cependant, vous pouvez
    utiliser la même logique pour créer et modifier des formulaires.
    Le helper Form utilise la propriété ``$this->request->data`` pour
    détecter automatiquement s'il faut créer un formulaire d'ajout ou de
    modification. Si ``$this->request->data`` contient un tableau nommé
    d'après le model du formulaire , et que ce tableau contient une valeur
    non nulle pour la clé primaire du model, alors le FormHelper créera
    un formulaire de modification pour cet enregistrement précis. Par
    exemple, si on va à l'adresse
    http://site.com/recipes/edit/5, nous pourrions avoir cela::

        // Controller/RecipesController.php:
        public function edit($id = null) {
            if (empty($this->request->data)) {
                $this->request->data = $this->Recipe->findById($id);
            } else {
                // La logique de sauvegarde se fera ici
            }
        }

        // View/Recipes/edit.ctp:
        // Puisque $this->request->data['Recipe']['id'] = 5,
        // nous aurons un formulaire d'édition
        <?php echo $this->Form->create('Recipe'); ?>

    Affichera:

    .. code-block:: html

        <form id="RecipeEditForm" method="post" action="/recipes/edit/5">
        <input type="hidden" name="_method" value="PUT" />

    .. note::

        Comme c'est un formulaire de modification, un champ
        caché (hidden) est créé pour réécrire la méthode HTTP par défaut

    A la création de formulaires pour les models dans des plugins. Nous
    devrons toujours utiliser la :term:`syntaxe de plugin` à la création
    d'un formulaire. Cela assurera que le formulaire est correctement généré::

        echo $this->Form->create('ContactManager.Contact');

    Le tableau ``$options`` est l'endroit où la plupart des paramètres
    de configurations sont stockés. Ce tableau spécial peut contenir
    un certain nombre de paires clé-valeur qui peuvent affecter la
    manière dont le formulaire sera créé.

    .. versionchanged:: 2.0

    L'Url par défaut pour tous les formulaires, est maintenant l'Url
    incluant passed, named, et les paramètres de requête (querystring). Vous
    pouvez redéfinir cette valeur par défaut en fournissant
    ``$options['url']`` en second paramètre de ``$this->Form->create()``.

Options pour  create()
----------------------

Il y plusieurs options pour create():

*   ``$options['type']`` Cette clé est utilisée pour spécifier le type de
    formulaire à créer. Les valeurs que peuvent prendre cette variable
    sont 'post', 'get', 'file', 'put' et 'delete'.

    Choisir 'post' ou 'get' changera la méthode de soumission du formulaire
    en fonction de votre choix. ::

        echo $this->Form->create('User', array('type' => 'get'));

    Affichera:

    .. code-block:: html

        <form id="UserAddForm" method="get" action="/users/add">

    En spécifiant 'file' cela changera la méthode de soumission à 'post', et
    ajoutera un enctype "multipart/form-data" dans le tag du formulaire.
    Vous devez l'utiliser si vous avez des demandes de fichiers dans
    votre formulaire. L'absence de cet attribut enctype empêchera le
    fonctionnement de l'envoi de fichiers. ::

        echo $this->Form->create('User', array('type' => 'file'));

    Affichera:

    .. code-block:: html

     <form id="UserAddForm" enctype="multipart/form-data"
        method="post" action="/users/add">

    Quand vous utilisez 'put' ou 'delete', votre formulaire aura un
    fonctionnement équivalent à un formulaire de type 'post',
    mais quand il sera envoyé, la méthode de requête HTTP
    sera respectivement réécrite avec 'PUT' ou 'DELETE'.
    Cela permettra à CakePHP de créer son propre support
    REST dans les navigateurs web.

*   ``$options['action']`` La clé action vous permet de définir vers quelle
    action de votre controller pointera le formulaire. Par exemple, si vous
    voulez que le formulaire appelle l'action login() de votre controller
    courant, vous créeriez le tableau $options comme ceci::

        echo $this->Form->create('User', array('action' => 'login'));

    Affichera:

    .. code-block:: html

        <form id="UserLoginForm" method="post" action="/users/login">
        </form>

  .. deprecated:: 2.8.0
     L'option ``$options['action']`` a été dépréciée depuis 2.8.0. Utilisez
     les options ``$options['url']`` et ``$options['id']`` à la place.

*   ``$options['url']`` Si l'action que vous désirez appeler avec le formulaire
    n'est pas dans le controller courant, vous pouvez spécifier une URL
    dans le formulaire en utilisant la clé 'url' de votre tableau $options.
    L'URL ainsi fournie peut être relative à votre application CakePHP::

        echo $this->Form->create(false, array(
            'url' => array('controller' => 'recipes', 'action' => 'add'),
            'id' => 'RecipesAdd'
        ));

    Affichera:

    .. code-block:: html

        <form method="post" action="/recipes/add">

    ou pointer vers un domaine extérieur::

        echo $this->Form->create(false, array(
            'url' => 'http://www.google.com/search',
            'type' => 'get'
        ));

    Affichera:

    .. code-block:: html

        <form method="get" action="http://www.google.com/search">

    Regardez aussi la méthode :php:meth:`HtmlHelper::url()` pour plus
    d'exemples sur les différents types d'URLs.

  .. versionchanged:: 2.8.0

     Utilisez ``'url' => false`` si vous ne voulez pas afficher une URL pour
     l'action du formulaire.

*   ``$options['default']`` Si la variable 'default' est définie à false,
    l'action de soumission du formulaire est changée de telle manière que le
    bouton submit (de soumission) ne soumet plus le formulaire. Si le
    formulaire a été créé pour être soumis par AJAX, mettre la variable
    'default' à FALSE supprime le comportement par défaut du formulaire,
    ainsi vous pouvez collecter les données et les soumettre par AJAX à la
    place.

*   ``$options['inputDefaults']`` Vous pouvez déclarer un jeu d'options
    par défaut pour ``input()`` avec la clé ``inputDefaults`` pour
    personnaliser vos input par défaut::

        echo $this->Form->create('User', array(
            'inputDefaults' => array(
             'label' => false,
             'div' => false
            )
         ));

    Tous les input créés à partir de ce point hériteraient
    des options déclarées dans inputDefaults. Vous pouvez
    redéfinir le defaultOptions en déclarant l'option dans
    l'appel input()::

        // Pas de div, Pas de label
        echo $this->Form->input('password');
        // a un élément label
        echo $this->Form->input('username', array('label' => 'Username'));

Fermer le Formulaire
====================

.. php:method:: end($options = null, $secureAttributes = array())

    Le FormHelper inclut également une méthode ``end()`` qui
    complète le marquage du formulaire. Souvent, ``end()`` affiche juste
    la base fermante du formulaire, mais l'utilisation de ``end()`` permet
    également au FormHelper d'ajouter les champs cachées dont le component
    Security :php:class:`SecurityComponent` à besoin.:

    .. code-block:: php

        <?php echo $this->Form->create(); ?>

        <!-- Ici les éléments de Formulaire -->

        <?php echo $this->Form->end(); ?>

    Si une chaîne est fournie comme premier argument à end(), le FormHelper
    affichera un bouton submit nommé en conséquence en même temps
    que la balise de fermeture du formulaire. ::

        echo $this->Form->end('Termine');

    Affichera:

    .. code-block:: html

        <div class="submit">
            <input type="submit" value="Termine" />
        </div>
        </form>

    Vous pouvez spécifier des paramètres détaillés en passant un tableau à
    ``end()``::

        $options = array(
            'label' => 'Update',
            'div' => array(
                'class' => 'glass-pill',
            )
        );
        echo $this->Form->end($options);

    Affichera:

    .. code-block:: html

        <div class="glass-pill"><input type="submit" value="Update!" name="Update"></div>

    Voir `l'API du Helper Form
    <http://api.cakephp.org/2.4/class-FormHelper.html>`_ pour plus de détails.

    .. note::

        si vous utilisez le component sécurité  :php:class:`SecurityComponent`
        dans votre application vous devez toujours terminer vos formulaires
        avec  ``end()``.

    .. versionchanged:: 2.5
        Le paramètre ``$secureAttributes`` a été ajouté dans 2.5.

.. _automagic-form-elements:

Création d'éléments de Formulaire
=================================

Il y a plusieurs façons pour créer des Forms inputs (entrée de formulaire)
Commençons par regarder ``input()``. Cette méthode inspecte automatiquement
le champ du model qui lui est fourni afin de créer une entrée appropriée pour
ce champ. En interne ``input()`` délègue aux autre méthode du FormHelper.

.. php:method:: input(string $fieldName, array $options = array())

    Crée les éléments suivants en donnant un ``Model.field`` particulier:

    * div enveloppante (wrapping div).
    * label de l'élément (Label element)
    * input de(s) l'élément(s)  (Input element(s))
    * Erreur de l'élément avec un message si c'est applicable.

    Le type d'input créé dépends de la colonne datatype:

    Column Type
        Champ de formulaire résultant
    string (char, varchar, etc.)
        text
    boolean, tinyint(1)
        checkbox
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

    Le paramètre ``$options`` vous permet de personnaliser le
    fonctionnement de ``input()``, et contrôle finement ce qui est généré.

    Le div entourant aura un nom de classe ``required`` ajouté à la suite si
    les règles de validation pour le champ du Model ne spécifient pas
    ``allowEmpty => true``. Une limitation de ce comportement est que le champ
    du model doit avoir été chargé pendant la requête. Ou être directement
    associé au model fourni par :php:meth:`~FormHelper::create()`.

    .. versionadded:: 2.5
        Le type binaire mappe maintenant vers un input de fichier.

    .. versionadded:: 2.3

    .. _html5-required:

    Depuis 2.3, l'attribut HTML5 ``required`` va aussi être ajouté selon les
    règles de validation du champ. Vous pouvez explicitement définir
    la clé ``required`` dans le tableau d'options pour la surcharger pour un
    champ. Pour échapper la validation attrapée par le navigateur pour
    l'ensemble du formulaire, vous pouvez définir l'option
    ``'formnovalidate' => true`` pour l'input button que vous générez en
    utilisant :php:meth:`FormHelper::submit()` ou définir
    ``'novalidate' => true`` dans les options pour
    :php:meth:`FormHelper::create()`.

    Par exemple, supposons que votre model User contient les champs
    username (varchar), password (varchar), approved (datetime) et quote (text).
    Vous pouvez utiliser la méthode input() de l'Helper Formulaire (Formhelper)
    pour créer une entrée appropriée pour tous les champs du formulaire. ::

        echo $this->Form->create();

        echo $this->Form->input('username');   //text
        echo $this->Form->input('password');   //password
        echo $this->Form->input('approved');   //day, month, year, hour, minute,
                                               //meridian
        echo $this->Form->input('quote');      //textarea

        echo $this->Form->end('Add');

    Un exemple plus complet montrant quelques options pour le champ de date::

        echo $this->Form->input('birth_dt', array(
            'label' => 'Date de naissance',
            'dateFormat' => 'DMY',
            'minYear' => date('Y') - 70,
            'maxYear' => date('Y') - 18,
        ));

    Outre les options spécifique pour ``input()`` vu ci-dessus, vous pouvez
    spécifier n'importe quelle options pour le type d'input et n'importe quel
    attribut HTML (actuellement dans le focus).
    Pour plus d'information sur les ``$options`` et ``$htmlAttributes`` voir
    :doc:`/core-libraries/helpers/html`.

    Supposons un User hasAndBelongsToMany Group. Dans votre controller,
    définissez une variable camelCase au pluriel (groupe -> groupes dans cette
    exemple, ou ExtraFunkyModele -> extraFunkyModeles) avec les options de
    sélections. Dans l'action du controller vous pouvez définir::

        $this->set('groups', $this->User->Group->find('list'));

    Et dans la vue une sélection multiple peut être crée avec ce simple code::

        echo $this->Form->input('Group');

    Si vous voulez un champ de sélection utilisant une relation belongsTo
    ou hasOne, vous pouvez ajouter ceci dans votre controller Users
    (en supposant que l'User belongsTo Group)::

        $this->set('groups', $this->User->Group->find('list'));

    Ensuite, ajouter les lignes suivantes à votre vue de formulaire::

        echo $this->Form->input('group_id');

    Si votre nom de model est composé de deux mots ou plus,
    ex. "UserGroup", quand vous passez les données en utilisant set()
    vous devrez nommer vos données dans un format CamelCase
    (les Majuscules séparent les mots) et au pluriel comme ceci::

        $this->set('userGroups', $this->UserGroup->find('list'));
        // ou bien
        $this->set(
            'reallyInappropriateModelNames',
            $this->ReallyInappropriateModelName->find('list')
        );

    .. note::

        Essayez d'éviter l'utilisation de `FormHelper::input()` pour générer
        les boutons submit. Utilisez plutôt :php:meth:`FormHelper::submit()`.

.. php:method:: inputs(mixed $fields = null, array $blacklist = null, $options = array())

    Génère un ensemble d'inputs (entrées) pour ``$fields``. Si $fields est
    null, tous les champs, sauf ceux définis dans ``$blacklist``, du model
    courant seront utilisés.

    En plus de l'affichage des champs de controller, ``$fields`` peut
    être utilisé pour contrôler legend et fieldset (jeu de champs) rendus
    avec les clés ``fieldset`` et ``legend``.
    ``$form->inputs(array('legend' => 'Ma légende'));``
    Générera un jeu de champs input avec une légende personnalisée.
    Vous pouvez personnaliser des champs input individuels a travers
    ``$fields`` comme ceci. ::

        echo $form->inputs(array(
            'name' => array('label' => 'label perso')
        ));

    En plus des champs de contrôle (fields control), inputs() permet
    d'utiliser quelques options supplémentaires.

    - ``fieldset`` Mis à false pour désactiver le jeu de champs (fieldset). Si
      une chaîne est fournit, elle sera utilisée comme nom de classe
      (classname) pour l'élément fieldset.
    - ``legend`` Mis à false pour désactiver la légende (legend) pour le jeu
      de champs input (input set) généré. Ou fournit une chaîne pour
      personnaliser le texte de la légende (legend).

Conventions de nommage des champs
---------------------------------

Le Helper Form est assez évolué. Lorsque vous définissez un nom
de champ avec les méthodes du Helper Form, celui-ci génère
automatiquement une balise input basée sur le nom de model courant,
selon le format suivant :

.. code-block:: html

    <input type="text" id="ModelnameFieldname" name="data[Modelname][fieldname]">

Ceci permet d'omettre le nom du model lors de la génération des inputs du
model pour lequel le formulaire à été créé. Vous pouvez créez des inputs pour
des models associés , ou des models arbitraires en passant dans
Modelname.fieldname comme premier paramètre::

    echo $this->Form->input('Modelname.fieldname');

Si vous avez besoin de spécifier de multiples champs en utilisant
le même nom de champ, créant ainsi un tableau qui peut être
sauver en un coup avec saveAll(), utilisez les conventions suivantes::

    echo $this->Form->input('Modelname.0.fieldname');
    echo $this->Form->input('Modelname.1.fieldname');

Affichera:

.. code-block:: html

    <input type="text" id="Modelname0Fieldname"
        name="data[Modelname][0][fieldname]">
    <input type="text" id="Modelname1Fieldname"
        name="data[Modelname][1][fieldname]">


Le Helper Form utilise plusieurs suffixes de champ en interne pour la création
de champ input datetime.  Si vous utilisez des champs nommés ``year``,
``month``, ``day``, ``hour``, ``minute``, or ``meridian`` et rencontrez des
problèmes pour obtenir un input correct, vous pouvez définir le nom ``name`` de
l'attribut pour remplacer le behavior par défaut::

    echo $this->Form->input('Model.year', array(
        'type' => 'text',
        'name' => 'data[Model][year]'
    ));

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

      echo $this->Form->input('field', array('type' => 'file'));
      echo $this->Form->input('email', array('type' => 'email'));

  Affichera:

  .. code-block:: html

      <div class="input file">
          <label for="UserField">Field</label>
          <input type="file" name="data[User][field]" value="" id="UserField" />
      </div>
      <div class="input email">
          <label for="UserEmail">Email</label>
          <input type="email" name="data[User][email]" value="" id="UserEmail" />
      </div>

* ``$options['div']`` Utilisez cette option pour définir les attributs de la
  div contentant l'input. En utilisant une valeur chaîne configurera le nom
  de classe de la div. Un tableau clés/valeurs paramétrera les attributs de
  la div. Alternativement, vous pouvez définir cet clé à false pour
  désactiver le rendu de la div.

  Définir le nom de classe::

      echo $this->Form->input('User.name', array(
          'div' => 'class_name'
      ));

  Affichera:

  .. code-block:: html

      <div class="class_name">
          <label for="UserName">Name</label>
          <input name="data[User][name]" type="text" value="" id="UserName" />
      </div>

  Paramétrage de plusieurs attibuts::

      echo $this->Form->input('User.name', array(
          'div' => array(
            'id' => 'mainDiv',
           'title' => 'Div Title',
             'style' => 'display:block'
       )
      ));

  Affichera:

  .. code-block:: html

      <div class="input text" id="mainDiv" title="Div Title"
          style="display:block">
          <label for="UserName">Name</label>
          <input name="data[User][name]" type="text" value="" id="UserName" />
      </div>

  Désactiver le rendu de la div::

      echo $this->Form->input('User.name', array('div' => false)); ?>

  Affichera:

  .. code-block:: html

      <label for="UserName">Name</label>
      <input name="data[User][name]" type="text" value="" id="UserName" />

* ``$options['label']`` Définissez cette clé à la chaîne que vous voudriez
  afficher dans le label qui accompagne le input::

      echo $this->Form->input('User.name', array(
          'label' => "Alias de l'user"
      ));

  Affichera:

  .. code-block:: html

      <div class="input">
          <label for="UserName">Alias de l'user</label>
          <input name="data[User][name]" type="text" value="" id="UserName" />
      </div>

  Alternativement, définissez cette clé à false pour désactiver le rendu
  du label::

      echo $this->Form->input('User.name', array('label' => false));

  Affichera:

  .. code-block:: html

      <div class="input">
          <input name="data[User][name]" type="text" value="" id="UserName" />
      </div>

  Définissez ceci dans un tableau pour fournir des options supplémentaires
  pour l'élément ``label``. Si vous faites cela, vous pouvez utiliser une
  clé ``text`` dans le tableau pour personnaliser le texte du label::

      echo $this->Form->input('User.name', array(
          'label' => array(
              'class' => 'bidule',
              'text' => 'le traducteur est fou hihaaarrrr!!!'
          )
      ));

  Affichera:

  .. code-block:: html

      <div class="input">
          <label for="UserName" class="bidule">le traducteur est fou hihaaarrrr!!!</label>
          <input name="data[User][name]" type="text" value="" id="UserName" />
      </div>

* ``$options['error']`` En utilisant cette clé vous permettra de transformer
  les messages de model par défaut et de les utiliser, par exemple, pour
  définir des messages i18n. (cf  internationalisation).
  comporte un nombre de sous-options qui contrôles l'enveloppe de l'élément
  (wrapping) . Le nom de classe de l'élément enveloppé, ainsi que
  les messages d'erreurs qui contiennent du HTML devront être échappés.

  Pour désactiver le rendu des messages d'erreurs définissez la clé error
  à false::

      $this->Form->input('Model.field', array('error' => false));

  Pour modifier le type d'enveloppe de l'élément et sa classe, utilisez
  le format suivant::

      $this->Form->input('Model.field', array(
          'error' => array('attributes' => array('wrap' => 'span', 'class' => 'bzzz'))
      ));

  Pour éviter que le code HTML soit automatiquement échappé dans le rendu
  du message d'erreur, définissez la sous-option escape à false::

      $this->Form->input('Model.field', array(
          'error' => array(
            'attributes' => array('escape' => false)
            )
      ));

  Pour surcharger les messages d'erreurs du model utilisez un tableau
  avec les clés respectant les règles de validation::

      $this->Form->input('Model.field', array(
          'error' => array('tooShort' => __("Ceci n'est pas assez long"))
      ));

  Comme vu ci-dessus vous pouvez définir les messages d'erreurs
  pour chacune des règles de validation de vos models.
  Vous pouvez de plus fournir des messages i18n pour vos formulaires.

  .. versionadded:: 2.3
      Support pour l'option ``errorMessage`` a été ajouté dans 2.3

* ``$options['before']``, ``$options['between']``, ``$options['separator']``,
  et ``$options['after']``

  Utilisez ces clés si vous avez besoin d'injecter quelques balises à la
  sortie de la méthode input(). ::

    echo $this->Form->input('field', array(
        'before' => '--avant--',
        'after' => '--après--',
        'between' => '--entre---'
    ));

  Affichera:

  .. code-block:: html

     <div class="input">
     --avant--
     <label for="UserField">Field</label>
     --entre---
     <input name="data[User][field]" type="text" value="" id="UserField" />
     --après--
     </div>

  Pour les input de type radio l'attribut 'separator' peut être
  utilisé pour injecter des balise pour séparer input/label. ::

    echo $this->Form->input('field', array(
        'before' => '--avant--',
        'after' => '--après--',
        'between' => '--entre---',
        'separator' => '--séparateur--',
        'options' => array('1', '2'),
        'type' => 'radio'
    ));

  Affichera:

  .. code-block:: html

     <div class="input">
     --avant--
     <input name="data[User][field]" type="radio" value="1" id="UserField1" />
     <label for="UserField1">1</label>
     --séparateur--
     <input name="data[User][field]" type="radio" value="2" id="UserField2" />
     <label for="UserField2">2</label>
     --entre---
     --après--
     </div>

  Pour un élément de type  ``date`` et ``datetime`` l'attribut 'separator'
  peut être utilisé pour modifier la chaîne entre les select. Par défaut '-'.

* ``$options['format']`` L'ordre du code HTML généré par FormHelper est
  contrôlable comme vous le souhaitez. l'option 'format' supporte un tableau
  de chaîne  décrivant le model de page que vous voudriez que l'élément
  suive. Les clés de tableau supportées sont::

      array('before', 'input', 'between', 'label', 'after','error')

* ``$options['inputDefaults']`` S'il vous semble répéter la même option dans
  de multiples appels input(), vous pouvez utiliser ``inputDefaults`` pour
  garder un code propre. ::

      echo $this->Form->create('User', array(
          'inputDefaults' => array(
              'label' => false,
              'div' => false
          )
      ));

  Tous les inputs créés a partir de ce point hériterons
  des valeurs déclarées dans inputDefaults. Vous pouvez
  redéfinir defaultOptions en déclarant l'option dans l'appel
  de l'input()::

      // Pas de div, ni label
      echo $this->Form->input('password');

      // a un élément label
      echo $this->Form->input('username', array('label' => 'Username'));

  Si vous avez besoin de changer plus tard les valeurs par défaut, vous
  pourrez utiliser :php:meth:`FormHelper::inputDefaults()`.

* ``$options['maxlength']`` Définissez cette clé pour définir l'attribut
  ``maxlength`` du champ ``input`` avec une valeur spécifique. Quand cette clé
  n'est pas donnée et que le type d'input est ``text``, ``textarea``, ``email``,
  ``tel``, ``url`` ou ``search`` et que la définition de champ n'est pas
  ``decimal``, ``time`` ou ``datetime``, l'option length du champ de la base de
  données est utilisée.

GET Form Inputs
---------------

Quand vous utilisez ``FormHelper`` pour générer des inputs pour les formulaires
``GET``, les noms d'input seront automatiquement raccourcis pour que les noms
soient plus lisibles pour les humains. Par exemple::

    // Crée <input name="email" type="text" />
    echo $this->Form->input('User.email');

    // Crée <select name="Tags" multiple="multiple">
    echo $this->Form->input('Tags.Tags', array('multiple' => true));

Si vous voulez surcharger les attributs name générés, vous pouvez utiliser
l'option ``name``::

    // Crée le plus habituel <input name="data[User][email]" type="text" />
    echo $this->Form->input('User.email', array('name' => 'data[User][email]'));

Générer des types d'inputs spécifiques
======================================

En plus de la méthode générique ``input()``, le ``FormHelper`` à des
méthodes spécifiques pour générer différents types d'inputs. Ceci peut
être utilisé pour générer juste un extrait de code input, et combiné avec
d'autres méthodes comme :php:meth:`~FormHelper::label()` et
:php:meth:`~FormHelper::error()` pour générer des layouts (mise en page)
complètements personnalisées.

.. _general-input-options:

Options Communes
----------------

Beaucoup des différentes méthodes d'input supportent un jeu d'options communes.
Toutes ses options sont aussi supportés par ``input()``. Pour réduire les
répétitions les options communes partagées par toutes les méthodes input sont :

* ``$options['class']`` Vous pouvez définir le nom de classe pour un input::

    echo $this->Form->input('title', array('class' => 'class-perso'));

* ``$options['id']`` Définir cette clé pour forcer la valeur du DOM id pour cet input.

* ``$options['default']`` Utilisé pour définir une valeur par défaut au champ
  input. La valeur est utilisée si les données passées au formulaire ne
  contiennent pas de valeur pour le champ (ou si aucune donnée n'est
  transmise)

  Exemple d'utilisation::

    echo $this->Form->input('ingredient', array('default' => 'Sucre'));

  Exemple avec un champ sélectionné (Taille "Moyen" sera sélectionné par défaut)::

    $sizes = array('s' => 'Small', 'm' => 'Medium', 'l' => 'Large');
    echo $this->Form->input('size', array('options' => $sizes, 'default' => 'm'));

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
traité comme un attribut HTML, et appliqué a l'élément HTML généré.

Les options pour  select, checkbox et inputs radio
--------------------------------------------------

* ``$options['selected']`` Utilisé en combinaison avec un input de type
  select (ex. Pour les types select, date, heure, datetime) . Définissez
  'selected' pour définir l'élément que vous souhaiteriez définir par défaut
  au rendu de l'input::

    echo $this->Form->input('heure_fermeture', array(
        'type' => 'time',
        'selected' => '13:30:00'
    ));

  .. note::

    La clé selected pour les inputs de type date et datetime peuvent aussi
    être des timestamps UNIX.

* ``$options['empty']`` Est défini à true, pour forcer l'input à rester vide.

  Quand passé à une list select (liste de selection), ceci créera une
  option vide avec une valeur vide dans la liste déroulante. Si vous
  voulez une valeur vide avec un texte affiché ou juste une option
  vide, passer une chaîne pour vider::

      echo $this->Form->input('field', array(
          'options' => array(1, 2, 3, 4, 5),
          'empty' => '(choisissez)'
      ));

    Sortie:

    .. code-block:: html

      <div class="input">
          <label for="UserField">Field</label>
          <select name="data[User][field]" id="UserField">
              <option value="">(choisissez)</option>
              <option value="0">1</option>
              <option value="1">2</option>
              <option value="2">3</option>
              <option value="3">4</option>
              <option value="4">5</option>
          </select>
      </div>

  .. note::

    Si vous avez besoin de définir la valeur par défaut d'un champ password à
    vide, utilisez 'value'=> '' (deux fois simple cote) à la place.

  Une liste de paire de clé-valeur peut être fournie pour un champ de type
  date ou datetime::

    echo $this->Form->dateTime('Contact.date', 'DMY', '12',
        array(
            'empty' => array(
                'day' => 'DAY', 'month' => 'MONTH', 'year' => 'YEAR',
                'hour' => 'HOUR', 'minute' => 'MINUTE', 'meridian' => false
            )
        )
    );

  Affiche:

  .. code-block:: html

    <select name="data[Contact][date][day]" id="ContactDateDay">
        <option value="">DAY</option>
        <option value="01">1</option>
        // ...
        <option value="31">31</option>
    </select> - <select name="data[Contact][date][month]" id="ContactDateMonth">
        <option value="">MONTH</option>
        <option value="01">January</option>
        // ...
        <option value="12">December</option>
    </select> - <select name="data[Contact][date][year]" id="ContactDateYear">
        <option value="">YEAR</option>
        <option value="2036">2036</option>
        // ...
        <option value="1996">1996</option>
    </select> <select name="data[Contact][date][hour]" id="ContactDateHour">
        <option value="">HOUR</option>
        <option value="01">1</option>
        // ...
        <option value="12">12</option>
        </select>:<select name="data[Contact][date][min]" id="ContactDateMin">
        <option value="">MINUTE</option>
        <option value="00">00</option>
        // ...
        <option value="59">59</option>
    </select> <select name="data[Contact][date][meridian]" id="ContactDateMeridian">
        <option value="am">am</option>
        <option value="pm">pm</option>
    </select>

* ``$options['hiddenField']`` Pour certain types d' input (checkboxes,
  radios) un input caché est créé ainsi la clé dans $this->request->data
  existera même sans valeur spécifiée:

  .. code-block:: html

    <input type="hidden" name="data[Post][Published]" id="PostPublished_" value="0" />
    <input type="checkbox" name="data[Post][Published]" value="1" id="PostPublished" />

  Ceci peut être désactivé en définissant l'option ``$options['hiddenField'] = false``::

    echo $this->Form->checkbox('published', array('hiddenField' => false));

  Retournera:

  .. code-block:: html

    <input type="checkbox" name="data[Post][Published]" value="1" id="PostPublished" />

  Si vous voulez créer de multiples blocs d'entrés regroupés
  ensemble dans un formulaire, vous devriez utiliser ce paramètre
  sur tous les inputs excepté le premier. Si le input caché est en
  place à différents endroits c'est seulement le dernier groupe
  de valeur d'input qui sera sauvegardé.

  Dans cet exemple , seules les couleurs tertiaires seront passées,
  et les couleurs primaires seront réécrite:

  .. code-block:: html

    <h2>Couleurs Primaires</h2>
    <input type="hidden" name="data[Color][Color]" id="Couleurs_" value="0" />
    <input type="checkbox" name="data[Color][Color][]" value="5" id="CouleursRouges" />
    <label for="CouleursRouges">Rouge</label>
    <input type="checkbox" name="data[Color][Color][]" value="5" id="CouleursBleus" />
    <label for="CouleursBleus">Bleu</label>
    <input type="checkbox" name="data[Color][Color][]" value="5" id="CouleursJaunes" />
    <label for="CouleursJaunes">Jaune</label>

    <h2>Couleurs Tertiaires</h2>
    <input type="hidden" name="data[Color][Color]" id="Couleurs_" value="0" />
    <input type="checkbox" name="data[Color][Color][]" value="5" id="CouleursVertes" />
    <label for="CouleursVertes">Vert</label>
    <input type="checkbox" name="data[Color][Color][]" value="5" id="CouleursPourpres" />
    <label for="CouleursPourpres">Pourpre</label>
    <input type="checkbox" name="data[Addon][Addon][]" value="5" id="CouleursOranges" />
    <label for="CouleursOranges">Orange</label>

  En désactivant le champ caché ``'hiddenField'`` dans le second groupe
  d'input empêchera ce behavior.

  Vous pouvez définir une valeur différente pour le champ caché autre que 0
  comme 'N'::

      echo $this->Form->checkbox('published', array(
          'value' => 'Y',
          'hiddenField' => 'N',
      ));

Les options de Datetime
-----------------------

* ``$options['timeFormat']``. Utilisé pour spécifier le format des inputs
  select (menu de sélection) pour un jeu d'input en relation avec le temps.
  Les valeurs valides sont ``12``, ``24``, et ``null``.

* ``$options['dateFormat']`` Utilisé pour spécifier le format des inputs
  select (menu de sélection) pour un jeu d'input en relation avec le temps.
  Les valeurs valides comprennent  n'importe quelle combinaison de 'D',
  'M' et 'Y' or ``null``. Les input seront placés dans l'ordre définit par
  l'option dateFormat.

* ``$options['minYear'], $options['maxYear']`` Utilisé en combinaison avec un
  input date/datetime. Définit les valeurs minimales et/ou maximales de fin
  montrées dans le champ select years.

* ``$options['orderYear']`` Utilisé en combinaison avec un input
  date/datetime. Définit l'ordre dans lequel la valeur de l'année sera
  délivré. Les valeurs valides sont  'asc', 'desc'. La valeur par défaut
  est 'desc'.

* ``$options['interval']`` Cette option spécifie l'écart de minutes
  entre chaque option dans la select box minute::

    echo $this->Form->input('Model.time', array(
        'type' => 'time',
        'interval' => 15
    ));

  Créera 4 options dans la select box minute. Une toute les 15 minutes.

* ``$options['round']`` Peut être défini à `up` ou `down` pour forcer l'arrondi
  dans quelque soit la direction. Par défaut à null qui arrondit à la moitié
  supérieure selon `interval`.

  .. versionadded:: 2.4

Éléments de Formulaire-Méthodes spécifiques
===========================================

Tous les elements sont créés dans un form pour le model ``User`` comme dans les
exemples ci-dessous. Pour cette raison, le code HTML généré contiendra des
attributs qui font référence au model User
Ex: name=data[User][username], id=UserUsername

.. php:method:: label(string $fieldName, string $text, array $options)

    Crée un élément label. ``$fieldName`` est utilisé pour générer le
    Dom id. Si ``$text`` n'est pas défini, ``$fieldName`` sera utilisé pour
    définir le texte du label::

        echo $this->Form->label('User.name');
        echo $this->Form->label('User.name', 'Your username');

    Affichera :

    .. code-block:: html

        <label for="UserName">Name</label>
        <label for="UserName">Your username</label>

    ``$options`` peut soit être un tableau d'attributs HTML, ou une chaîne qui
    sera utilisée comme nom de classe::

        echo $this->Form->label('User.name', null, array('id' => 'user-label'));
        echo $this->Form->label('User.name', 'Your username', 'highlight');

    Affichera:

    .. code-block:: html

        <label for="UserName" id="user-label">Name</label>
        <label for="UserName" class="highlight">Your username</label>

.. php:method:: text(string $name, array $options)

    Les autres méthodes disponibles dans l'Helper Form permettent
    la création d'éléments spécifiques de formulaire. La plupart de ces
    méthodes utilisent également un paramètre spécial $options.
    Toutefois, dans ce cas, $options est utilisé avant tout pour spécifier
    les attributs des balises HTML
    (comme la valeur ou l'id DOM d'un élément du formulaire). ::

        echo $this->Form->text('username', array('class' => 'users'));

    Affichera:

    .. code-block:: html

        <input name="data[User][username]" type="text" class="users" id="UserUsername" />

.. php:method:: password(string $fieldName, array $options)

    Création d'un champ password. ::

        echo $this->Form->password('password');

    Affichera:

    .. code-block:: html

        <input name="data[User][password]" value="" id="UserPassword" type="password">

.. php:method:: hidden(string $fieldName, array $options)

    Créera un form input caché. Exemple::

        echo $this->Form->hidden('id');

    Affichera:

    .. code-block:: html

        <input name="data[User][id]" id="UserId" type="hidden">

    Si le form est édité (qui est le tableau ``$this->request->data`` va
    contenir les informations sauvegardées pour le model ``User``), la valeur
    correspondant au champ ``id`` sera automatiquement ajoutée au HTML généré.
    Exemple pour data[User][id] = 10:

    .. code-block:: html

        <input name="data[User][id]" id="UserId" type="hidden" value="10" />

    .. versionchanged:: 2.0
        Les champs cachés n'enlèvent plus la classe attribute. Cela signifie
        que si il y a des erreurs de validation sur les champs cachés, le
        nom de classe error-field sera appliqué.

.. php:method:: textarea(string $fieldName, array $options)

    Crée un champ input textarea (zone de texte). ::

        echo $this->Form->textarea('notes');

    Affichera:

    .. code-block:: html

        <textarea name="data[User][notes]" id="UserNotes"></textarea>

    Si le form est édité (ainsi, le tableau ``$this->request->data`` va contenir
    les informations sauvegardées pour le model ``User``), la valeur
    correspondant au champs ``notes`` sera automatiquement ajoutée au HTML
    généré. Exemple:

    .. code-block:: html

        <textarea name="data[User][notes]" id="UserNotes">
        Ce texte va être édité.
        </textarea>

    .. note::

        Le type d'input ``textarea`` permet à l'attribut ``$options`` d'échapper
        ``'escape'`` lequel détermine si oui ou non le contenu du textarea
        doit être échappé. Par défaut à ``true``.

    ::

        echo $this->Form->textarea('notes', array('escape' => false);
        // OU....
        echo $this->Form->input('notes', array('type' => 'textarea', 'escape' => false);

    **Options**

    En plus de :ref:`general-input-options`, textarea() supporte quelques
    options spécifiques:

    * ``$options['rows'], $options['cols']`` Ces deux clés spécifient le
      nombre de lignes et de colonnes::

        echo $this->Form->textarea('textarea', array('rows' => '5', 'cols' => '5'));

      Affichera:

      .. code-block:: html

        <textarea name="data[Form][textarea]" cols="5" rows="5" id="FormTextarea">
        </textarea>

.. php:method:: checkbox(string $fieldName, array $options)

    Crée un élément de formulaire checkbox. Cette méthode génère également un
    input de formulaire caché pour forcer la soumission de données pour le champ
    spécifié. ::

        echo $this->Form->checkbox('done');

    Affichera:

    .. code-block:: html

        <input type="hidden" name="data[User][done]" value="0" id="UserDone_" />
        <input type="checkbox" name="data[User][done]" value="1" id="UserDone" />

    Il est possible de modifier la valeur du checkbox en utilisant le tableau $options::

        echo $this->Form->checkbox('done', array('value' => 555));

    Affichera:

    .. code-block:: html

        <input type="hidden" name="data[User][done]" value="0" id="UserDone_" />
        <input type="checkbox" name="data[User][done]" value="555" id="UserDone" />

    Si vous ne voulez pas que le Helper Form génère un input caché::

        echo $this->Form->checkbox('done', array('hiddenField' => false));

    Affichera:

    .. code-block:: html

        <input type="checkbox" name="data[User][done]" value="1" id="UserDone" />


.. php:method:: radio(string $fieldName, array $options, array $attributes)

    Crée un jeu d'inputs radios.

    **Options**

    * ``$attributes['value']`` pour définir quelle valeur sera sélectionnée
      par défaut.

    * ``$attributes['separator']`` pour spécifier du HTML entre les boutons
      (ex <br />).

    * ``$attributes['between']`` spécifie quelques contenus à insérer entre
      la légende et le premier argument.

    * ``$attributes['disabled']`` définit a ``true`` ou ``'disabled'``
      désactivera tous les boutons radios générés.

    * ``$attributes['legend']`` Les éléments Radio sont enveloppés avec un
      legend et un fieldset par défaut. Définir ``$attributes['legend']`` à
      false pour les retirer. ::

        $options = array('H' => 'Homme', 'F' => 'Femme');
        $attributes = array('legend' => false);
        echo $this->Form->radio('genre', $options, $attributes);

      Affichera:

      .. code-block:: html

        <input name="data[User][genre]" id="UserGenre_" value="" type="hidden">
        <input name="data[User][genre]" id="UserGenreH" value="H" type="radio">
        <label for="UserGenreH">Homme</label>
        <input name="data[User][genre]" id="UserGenreF" value="F" type="radio">
        <label for="UserGenreF">Femme</label>

    Si pour quelque raisons vous ne voulez pas du input caché, définissez
    ``$attributes['value']`` à une valeur sélectionnée ou le booléen false

    * ``$attributes['fieldset']`` Si l'attribut ``legend`` n'est pas défini à
      false, alors cet attribut peut être utilisé pour définir la classe de
      l'élément fieldset.

    .. versionchanged:: 2.1
        L'option d'attribut ``$attributes['disabled']`` a été ajoutée dans CakePHP 2.1.

    .. versionchanged:: 2.8.5
        L'option d'attribut ``$attributes['fieldset']`` a été ajoutée dans CakePHP  dans 2.8.5.

.. php:method:: select(string $fieldName, array $options, array $attributes)

    Crée un menu de sélection, rempli des éléments compris dans ``$options``,
    avec l'option spécifiée par ``$attributes['value']`` sera montré comme
    sélectionné par défaut. Définir à false la clé 'empty' dans la variable
    ``$attributes`` pour empêcher l'option empty par défaut::

        $options = array('H' => 'Homme', 'F' => 'Femme');
        echo $this->Form->select('genre', $options)

    Affichera:

    .. code-block:: html

        <select name="data[User][genre]" id="UserGenre">
        <option value=""></option>
        <option value="H">Homme</option>
        <option value="F">Femme</option>
        </select>

    L'input de type ``select``  permet un attribut ``$option`` spécial
    appelée ``'escape'``  qui accepte un booléen et détermine
    si il faut que l'entité HTML encode le contenu des options
    sélectionnées. Par défaut à true::

        $options = array('H' => 'Homme', 'F' => 'Femme');
        echo $this->Form->select('genre', $options, array('escape' => false));

    * ``$attributes['options']`` Cette clé vous permets de spécifier
      manuellement des options pour un input select (menu de sélection),
      ou pour un groupe radio. A moins que le 'type' soit spécifié à 'radio',
      le Helper Form supposera que la cible est un input select (menu de
      sélection)::

        echo $this->Form->select('field', array(1,2,3,4,5));

      Affichera:

      .. code-block:: html

        <select name="data[User][field]" id="UserField">
            <option value=""></option>
            <option value="0">1</option>
            <option value="1">2</option>
            <option value="2">3</option>
            <option value="3">4</option>
            <option value="4">5</option>
        </select>

      Les options peuvent aussi être fournies comme des paires clé-valeur::

        echo $this->Form->select('field', $options, array(
            'Value 1' => 'Label 1',
            'Value 2' => 'Label 2',
            'Value 3' => 'Label 3'
        ));

      Affichera:

      .. code-block:: html

        <select name="data[User][field]" id="UserField">
            <option value="Value 1">Label 1</option>
            <option value="Value 2">Label 2</option>
            <option value="Value 3">Label 3</option>
        </select>

      Si vous souhaitez générer un select avec des groupes optionnels,
      passez les données dans un format hiérarchique. Ceci fonctionnera
      avec les checkboxes multiples et les boutons radios également,
      mais au lieu des groupes optionnels enveloppez les éléments
      dans des fieldsets::

        $options = array(
           'Group 1' => array(
              'Value 1' => 'Label 1',
              'Value 2' => 'Label 2'
           ),
           'Group 2' => array(
              'Value 3' => 'Label 3'
           )
        );
        echo $this->Form->select('field', $options);

      Affichera:

      .. code-block:: html

        <select name="data[User][field]" id="UserField">
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

        echo $this->Form->select('Model.field', $options, array('multiple' => true));

      Vous pouvez également définir 'checkbox' à 'multiple' pour afficher une
      liste de check boxes reliés::

        $options =  array(
            'Value 1' => 'Label 1',
            'Value 2' => 'Label 2'
        );
        echo $this->Form->select('Model.field', $options, array(
            'multiple' => 'checkbox'
        ));

      Affichera:

      .. code-block:: html

        <div class="input select">
           <label for="ModelField">Field</label>
           <input name="data[Model][field]" value="" id="ModelField" type="hidden">
           <div class="checkbox">
              <input name="data[Model][field][]" value="Value 1" id="ModelField1" type="checkbox">
              <label for="ModelField1">Label 1</label>
           </div>
           <div class="checkbox">
              <input name="data[Model][field][]" value="Value 2" id="ModelField2" type="checkbox">
              <label for="ModelField2">Label 2</label>
           </div>
        </div>

    * ``$attributes['disabled']`` Lors de la création de checkboxes, cette
      option peut être défini pour désactiver tout ou quelques checkboxes.
      Pour désactiver toutes les checkboxes, définissez disabled à ``true``::

        $options = array(
            'Value 1' => 'Label 1',
            'Value 2' => 'Label 2'
        );
        echo $this->Form->select('Model.field', $options, array(
            'multiple' => 'checkbox',
            'disabled' => array('Value 1')
        ));

      Output:

      .. code-block:: html

        <div class="input select">
           <label for="ModelField">Field</label>
           <input name="data[Model][field]" value="" id="ModelField"
            type="hidden">
           <div class="checkbox">
              <input name="data[Model][field][]" disabled="disabled"
                value="Value 1" id="ModelField1" type="checkbox">
              <label for="ModelField1">Label 1</label>
           </div>
           <div class="checkbox">
              <input name="data[Model][field][]" value="Value 2"
                id="ModelField2" type="checkbox">
              <label for="ModelField2">Label 2</label>
           </div>
        </div>

    .. versionchanged:: 2.3
        Le support pour les tableaux dans ``$attributes['disabled']`` a été
        ajoutée dans 2.3.

.. php:method:: file(string $fieldName, array $options)

    Pour ajouter un champ upload à un formulaire, vous devez vous assurer que le
    enctype du formulaire est définit a  "multipart/form-data", donc commençons
    avec une fonction create comme ci-dessous::

        echo $this->Form->create('Document', array(
            'enctype' => 'multipart/form-data'
        ));
        // OU
        echo $this->Form->create('Document', array('type' => 'file'));

    Ensuite ajoutons l'une ou l'autre des deux lignes dans le fichier de
    vue de votre formulaire::

        echo $this->Form->input('Document.submittedfile', array(
            'between' => '<br />',
            'type' => 'file'
        ));

        // OU

        echo $this->Form->file('Document.submittedfile');

    En raisons des limitations du code HTML lui même, il n'est pas possible
    de placer des valeurs par défauts dans les champs inputs de type 'file'.
    A chacune des fois ou le formulaire sera affiché, la valeur sera vide.

    Lors de la soumission, le champ file fournit un tableau étendu de données
    au script recevant les données de formulaire.

    Pour l'exemple ci-dessus, les valeurs dans le tableau de données soumis
    devraient être organisées comme à la suite, si CakePHP à été installé sur
    un server Windows .'tmp\_name'  aura un chemin différent dans un
    environnement Unix::

        $this->request->data['Document']['submittedfile'] = array(
            'name' => conference_schedule.pdf,
            'type' => application/pdf,
            'tmp_name' => C:/WINDOWS/TEMP/php1EE.tmp,
            'error' => 0,
            'size' => 41737,
        );

    Ce tableau est généré par PHP lui-même, pour plus de détails
    sur la façon dont PHP gère les données passées a travers
    les champs ``files``.
    `lire la section file uploads du manuel de PHP
    <http://php.net/features.file-upload>`_.

Validation des Uploads
----------------------

Ci dessous l'exemple d'une méthode de validation définit dans
votre model pour valider si un fichier à été uploader avec succès::

    public function isUploadedFile($params) {
        $val = array_shift($params);
        if ((isset($val['error']) && $val['error'] == 0) ||
            (!empty( $val['tmp_name']) && $val['tmp_name'] != 'none')
        ) {
            return is_uploaded_file($val['tmp_name']);
        }
        return false;
    }

Crée un input file::

    echo $this->Form->create('User', array('type' => 'file'));
    echo $this->Form->file('avatar');

Affichera::

    <form enctype="multipart/form-data" method="post" action="/users/add">
    <input name="data[User][avatar]" value="" id="UserAvatar" type="file">

.. note::

    Quand vous utilisez ``$this->Form->file()``, rappelez-vous
    de définir le type d'encodage , en définissant l'option de type
    à 'file' dans ``$this->Form->create()``.

Création des boutons et des éléments submits
============================================

.. php:method:: submit(string $caption, array $options)

    Crée un bouton submit avec la légende ``$caption``. Si la ``$caption``
    fournie est l'URL d'une image (il contient un caractère '.'), le
    bouton submit sera rendu comme une image.

    Il est encapsulé entre des ``div`` par défaut; vous pouvez empêcher cela
    en déclarant ``$options['div'] = false``::

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

.. php:method:: button(string $title, array $options = array())

    Crée un boutton HTML avec le titre spécifié et un type par défaut "button".
    Définir ``$options['type']`` affichera l'un des trois types de boutons
    possibles:

    #. submit: Comme celui de la méthode ``$this->Form->submit``- (par défaut).
    #. reset: Crée un bouton reset.
    #. button: Crée un bouton standard.

    ::

        echo $this->Form->button('Un bouton');
        echo $this->Form->button('Un autre Bouton', array('type' => 'button'));
        echo $this->Form->button('Initialise le Formulaire', array('type' => 'reset'));
        echo $this->Form->button('Soumettre le Formulaire', array('type' => 'submit'));

    Affichera :

    .. code-block:: html

        <button type="submit">Un bouton</button>
        <button type="button">Un autre Bouton</button>
        <button type="reset">Initialise le Formulaire</button>
        <button type="submit">Soumettre le Formulaire</button>

    Le input de type ``button`` supporte l'option ``escape`` qui accepte un
    booléen et détermine si oui ou non l'entité HTML encode le $title du bouton.
    Par défaut à false::

        echo $this->Form->button('Submit Form', array('type' => 'submit', 'escape' => true));

.. php:method:: postButton(string $title, mixed $url, array $options = array ())

    Crée un tag``<button>`` avec un ``<form>`` l'entourant  qui soumets à
    travers POST.

    Cette méthode crée un élément ``<form>``. Donc n'utilisez pas
    pas cette méthode dans un formulaire ouvert. Utilisez plutôt
    :php:meth:`FormHelper::submit() ou :php:meth:`FormHelper::button()`
    pour créer des boutons a l'intérieur de formulaires ouvert.

.. php:method:: postLink(string $title, mixed $url = null, array $options = array ())

    Crée un lien HTML, mais accède à l'Url en utilisant la méthode POST.
    Requiert que JavaScript soit autorisé dans votre navigateur.

    Cette méthode crée un élément ``<form>``. Si vous souhaitez utiliser cette
    méthode dans un formulaire existant, vous devez utiliser les options
    ``inline`` ou ``block`` pour que le nouveau formulaire soit affiché à
    l'extérieur de son formulaire parent.

    Si vous cherchez un bouton pour soumettre votre formulaire, vous devrez
    plutôt utiliser :php:meth:`FormHelper::submit()` instead.

    .. versionchanged:: 2.3

    L'option ``method`` a été ajoutée.

    .. versionchanged:: 2.5
        Les options ``inline`` et ``block`` ont été ajoutées. Elles permettent
        de mettre en tampon la balise de form générée au lieu de la retourner
        avec le lien. Ceci permet d'éviter les balises de form imbriquées.
        Définir ``'inline' => false`` va ajouter la balise de form en block
        de contenu ``postLink``, si vous voulez utiliser un block personnalisé
        vous pouvez le spécifier en utilisant plutôt l'option ``block``.

    .. versionchanged:: 2.6
        L'argument ``$confirmMessage`` a été dépréciée. Utilisez la clé
        ``confirm`` dans ``$options`` à la place.

Crée des inputs de date et d'heure (date and time inputs)
=========================================================

.. php:method:: dateTime($fieldName, $dateFormat = 'DMY', $timeFormat = '12', $attributes = array())

    Crée un jeu d'inputs pour la date et l'heure. Les valeurs valides pour
    $dateformat sont 'DMY', 'MDY', 'YMD' ou 'NONE'. Les valeurs valides pour
    $timeFormat sont '12', '24', et null.

    Vous pouvez spécifier de ne pas afficher les valeurs vides en
    paramétrant "array('empty' => false)" dans les paramètres des attributs.
    il pré-sélectionnera également les champs a la date et heure courante.

.. php:method:: year(string $fieldName, int $minYear, int $maxYear, array $attributes)

    Crée un élément select`(menu de sélection)  rempli avec les années depuis
    ``$minYear`` jusqu'à ``$maxYear``. Les attributs HTML devrons être fournis
    dans $attributes. Si ``$attributes['empty']`` est false, le select
    n'inclura pas d'option empty::

        echo $this->Form->annee('purchased', 2000, date('Y'));

    Affichera:

    .. code-block:: html

        <select name="data[User][purchased][annee]" id="UserPurchasedYear">
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

        <select name="data[User][mob][month]" id="UserMobMonth">
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

        echo $this->Form->month('mob', array('monthNames' => false));

.. php:method:: day(string $fieldName, array $attributes)

    Crée un élément select (menu de sélection) rempli avec les jours
    (numériques) du mois.

    Pour créer une option empty avec l'affichage d'un texte de votre choix
    (ex. la première option est 'Jour'), vous pouvez fournir le texte comme
    paramètre final comme ceci::

        echo $this->Form->day('created');

    Affichera:

    .. code-block:: html

        <select name="data[User][created][day]" id="UserCreatedDay">
        <option value=""></option>
        <option value="01">1</option>
        <option value="02">2</option>
        <option value="03">3</option>
        ...
        <option value="31">31</option>
        </select>

.. php:method:: hour(string $fieldName, boolean $format24Hours, array $attributes)

    Crée un élément select (menu de sélection) rempli avec les heures de la
    journée.

.. php:method:: minute(string $fieldName, array $attributes)

    Crée un élément select (menu de sélection) rempli avec les minutes d'une
    heure.

.. php:method:: meridian(string $fieldName, array $attributes)

    Crée un élément select (menu de sélection) rempli avec 'am' et 'pm'.


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

.. php:method:: isFieldError(string $fieldName)

    Retourne true si le champ $fieldName fourni a une erreur de validation en
    cours::

        if ($this->Form->isFieldError('genre')) {
            echo $this->Form->error('genre');
        }

    .. note::

        En utilisant :php:meth:`FormHelper::input()`, les erreurs sont
        retournées par défaut.

.. php:method:: tagIsInvalid()

    Retourne false si le champ fourni décrit par l'entité courante ne contient
    pas d'erreur. Sinon retourne le message de validation.

Configuration par défaut pour tous les champs
=============================================

.. versionadded:: 2.2

Vous pouvez déclarer un ensemble d'options par défaut pour ``input()`` en
utilisant :php:meth:`FormHelper::inputDefaults()`. Changer les options par
défaut vous permet de consolider les options répétées dans un appel à une
unique méthode::

    $this->Form->inputDefaults(array(
            'label' => false,
            'div' => false,
            'class' => 'fancy'
        )
    );

Tous les champs créés à partir ce point de retour vont hériter des options
déclarées dans inputDefaults. Vous pouvez surcharger les options par défaut en
déclarant l'option dans l'appel input()::

    echo $this->Form->input('password'); // Pas de div, pas de label avec la classe 'fancy'
    echo $this->Form->input('username', array('label' => 'Username')); // a un élément label avec les mêmes valeurs par défaut

Travailler avec le Component Sécurity
=====================================

:php:meth:`SecurityComponent` offre plusieurs fonctionnalités qui rendent
vos formulaires plus sûres et plus sécurisés. En incluant simplement le
component sécurité ``SecurityComponent`` dans votre controller,
vous bénéficierez automatiquement de CSRF (Cross-site request forgery)
et des fonctionnalités pour éviter la falsification.

Quand vous utilisez le SecurityComponent (component de sécurité), vous devez
toujours fermer vos formulaires en utilisant :php:meth:`FormHelper::end()`.
Ceci assurera que les inputs  jeton spéciaux ``_Token`` seront générés.

.. php:method:: unlockField($name)

    Déverrouille un champ en le rendant exempt du hachage (hashing)
    du ``SecurityComponent``. Ceci permet également au champ d'être
    manipulé par Javascript. Le paramètre ``$name`` devra être le nom
    d'entité de l'input::

        $this->Form->unlockField('User.id');

.. php:method:: secure(array $fields = array())

    Génère un champ caché avec hachage sur le champ utilisé dans
    le formulaire.

.. _form-improvements-1-3:

Mises à jour 2.0
================

**$selected parameter removed**

Le paramètre ``$selected``a été retiré de plusieurs méthodes
du Helper Form (FormHelper). Toutes les méthodes supportent
désormais un clé  ``$attributes['value']`` qui devra être utilisée
en remplacement de ``$selected``. Ce changement simplifie
les méthodes du Helper Form, en réduisant le nombre d'arguments,
et réduit les duplications que ``$selected`` crée.
Les méthodes sont:

    * FormHelper::select()
    * FormHelper::dateTime()
    * FormHelper::year()
    * FormHelper::month()
    * FormHelper::day()
    * FormHelper::hour()
    * FormHelper::minute()
    * FormHelper::meridian()

**L'URL par défaut des formulaires est l'action courante**

L'URL par défaut pour tous les formulaires, est désormais
l'URL courante incluant passed, named, et les paramètres
de la requête (querystring parameters). Vous pouvez redéfinir
cette valeur par défaut en fournissant ``$options['url']`` dans
le second paramètre de ``$this->Form->create()``.

**FormHelper::hidden()**

Les champs cachés n'enlèvent plus les attributs de classe. Cela
signifie que si il y a des erreurs de validation sur les champs
cachés le nom de classe error-field sera appliqué.


.. meta::
    :title lang=fr: FormHelper
    :description lang=fr: The FormHelper focuses on creating forms quickly, in a way that will streamline validation, re-population and layout.
    :keywords lang=fr: html helper,cakephp html,form create,form input,form select,form file field,form label,form text,form password,form checkbox,form radio,form submit,form date time,form error,validate upload,unlock field,form security
