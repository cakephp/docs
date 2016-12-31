Forms
#####

Le Helper Form est un nouvel ajout à CakePHP. La plupart du gros oeuvre,
dans la création de formulaire s'effectue maintenant en utilisant cette
nouvelle classe, plutôt que par les méthodes (maintenant obsolètes) du
Helper HTML. Le Helper Form se concentre sur la création rapide de
formulaires, d'une manière qui permet de rationaliser la validation, le
repeuplement et la mise en page. Le Helper Form est également flexible :
il fera presque tout à votre place, "automagiquement", sinon vous pouvez
utiliser ses méthodes spécifiques, pour réaliser seulement ce dont vous
avez besoin.

Créer des formulaires
=====================

La première méthode dont vous aurez besoin d'utiliser pour prendre
pleinement avantage du *FormHelper* est ``create()``. Cette méthode
affichera un tag d'ouverture de formulaire.

``create(string $model = null, array $options = array())``

Tous les paramètres sont optionnels. Si ``create()`` est appelée sans
paramètres, CakePHP supposera que vous voulez créer un formulaire en
rapport avec le contrôleur courant, avec selon les cas l'action
``add()`` ou l'action ``edit()``. La méthode par défaut pour les
formulaires est *POST*. L'élément du formulaire est également renvoyée
avec un DOM ID. Cet identifiant est créé à partir du nom du modèle, et
du nom du contrôleur. Si j'apelle ``create()`` dans une vue de
MembresController, j'obtiendrai ce genre de rendu dans ma vue :

::

    <form id="MembreAddForm" method="post" action="/membres/add">

La méthode ``create()`` nous permet également de personnaliser plusieurs
paramètres. Premièrement, vous pouvez spécifier un nom de modèle. Ce
faisant, vous modifiez le contexte de ce formulaire. Tous les champs
seront supposés dépendre de ce modèle (sauf si spécifié), et tous les
modèles devront être liés à lui. Si vous ne spécifiez pas de modèle,
CakePHP supposera que vous utilisez le modèle par défaut pour le
contrôleur courant.

::

    <?php echo $form->create('Recette'); ?>
     
    // affichera :
    <form id="RecetteAddForm" method="post" action="/recettes/add">

Ce formulaire enverra les données à votre action ``add()`` de
*RecettesController*. Cependant, vous pouvez utiliser la même logique
pour créer et modifier des formulaires. Le helper *FormHelper* utiliser
la propriété ``$this->data`` pour détecter automatiquement s'il faut
créer un formulaire d'ajout ou de modification. Si ``$this->data``
contient un élément tabulaire après le nom du modèle, et que ce tableau
contient une valeur non nulle pour la clé primaire du modèle, alors le
*FormHelper* créera un formulaire de modification pour cet
enregistrement précis. Par exemple, si on va à l'adresse
http://site.com/recettes/edit/5, nous devrions obtenir ceci :

::

    // controllers/recettes_controller.php:
    <?php
    function edit($id = null) {
        if (empty($this->data)) {
            $this->data = $this->Recette->findById($id);
        } else {
            // Le code de sauvegarde vient ici
        }
    }
    ?>

    // views/recettes/edit.ctp:

    // Comme $this->data['Recipe']['id'] = 5, on doit obtenir un formulaire de modification
    <?php echo $form->create('Recipe'); ?>

    //affichera :
    <form id="RecetteEditForm" method="post" action="/recettes/edit/5">
    <input type="hidden" name="_method" value="PUT" />

Comme c'est un formulaire de modification, un champ caché (*hidden*) est
créé pour surcharger la méthode HTTP par défaut

Le tableau ``$options`` est l'endroit où la plupart des paramètres de
configurations est stockée. Ce tableau peut contenir un certain nombre
de paires clé-valeur qui peuvent affecter la manière dont le formulaire
sera créé.

$options['type']
----------------

Cette clé est utilisée pour spécifier le type de formulaire à créer. Les
valeurs que peuvent prendre cette variable sont 'post', 'get', 'file',
'put' et 'delete'.

Choisir 'post' ou 'get' changera la méthode de soumission du formulaire
en fonction de votre choix.

::

    <?php echo $form->create('Membre', array('type' => 'get')); ?>
     
    //Affichera :
    <form id="MembreAddForm" method="get" action="/membres/add">

Choisir 'file' changera la méthode de soumission à 'post', et ajoutera
la mention "multipart/form-data" dans le tag du formulaire. Vous devez
l'utiliser si vous avez des demandes de fichiers dans votre formulaire.
L'absence de cet attribut d'enctype empêchera l'envoi de fichiers à
partir de ce formulaire.

::

    <?php echo $form->create('Membre', array('type' => 'file')); ?>
     
    //Affichera :
    <form id="MembreAddForm" enctype="multipart/form-data" method="post" action="/membres/add">

Quand vous utilisez 'put' ou 'delete', votre formulaire sera équivalent
à un formulaire de type 'post', mais quand il sera envoyé, la méthode de
requête HTTP sera respectivement surchargée avec 'PUT' ou 'DELETE'. Ca
permettra à CakePHP de créer son propre support REST dans les
navigateurs web.

$options['action']
------------------

La variable action vous permet de définir à quelle action dans votre
contrôleur pointera le formulaire. Par exemple, si vous voulez que le
formulaire appelle l'action login() de votre contrôleur courant, vous
créeriez le tableau $options comme ceci :

::

    <?php echo $form->create('Membre', array('action' => 'login')); ?>
     
    //Affichera :
    <form id="MembreLoginForm" method="post" action="/membres/login">
    </form>

$options['url']
---------------

Si l'action que vous désirez appeler avec le formulaire n'est pas dans
le contrôleur courant, vous pouvez spécifier une URL précise dans le
formulaire en utilisant la clé 'url' de votre tableau $options. L'URL
ainsi donnée peut être relative à votre application CakePHP ou peut
pointer vers un domaine extérieur.

::

    <?php echo $form->create(null, array('url' => '/recettes/ajouter')); ?>
    // ou
    <?php echo $form->create(null, array('url' => array('controller' => 'recettes', 'action' => 'ajouter'))); ?>


    // Affichera :
    <form method="post" action="/recettes/ajouter">
     
    <?php echo $form->create(null, array(
        'url' => 'http://www.google.com/search',
        'type' => 'get'
    )); ?>
     
    // Affichera :
    <form method="get" action="http://www.google.com/search">

Regardez aussi la méthode `HtmlHelper::url </fr/view/842/url>`_ pour
plus d'exemples sur les différent types d'urls.

$options['default']
-------------------

Si la variable *'default'* (NdT : attention, il y a bien un L
contrairement au mot français !) a été affectée du booléen *false*,
l'action de soumission du formulaire a été changée de telle manière que
le bouton de soumission ne valide plus le formulaire. Si le formulaire a
été créé pour être validé par AJAX, mettre la variable 'default' à FALSE
supprime le comportement par défaut du formulaire, ainsi vous pouvez
collecter les données et les soumettre par AJAX à la place.

$options['inputDefaults']
-------------------------

You can declare a set of default options for ``input()`` with the
``inputDefaults`` key to customize your default input creation.

::

    echo $this->Form->create('User', array(
            'inputDefaults' => array(
                'label' => false,
                'div'   => false,
                # define error defaults for the form
                'error' => array(
                  'wrap'  => 'span', 
                  'class' => 'my-error-class'
                )
            )
        ));

All inputs created from that point forward would inherit the options
declared in inputDefaults. You can override the defaultOptions by
declaring the option in the input() call.

::

    echo $this->Form->input('password'); // No div, no label
    echo $this->Form->input('username', array('label' => 'Username')); // has a label element

Fermeture du Formulaire
=======================

Le FormHelper inclus également une méthode end() qui complète le
marquage du formulaire. Souvent, end() affiche juste la base fermante du
formulaire, mais le FormHelper permet aussi d'ajouter des champs cachées
en utilisant la méthode end() other methods may be depending on.

::

    <?php echo $form->create(); ?>
     
    <!-- Form elements go here -->
     
    <?php echo $form->end(); ?>

Si une chaine est fournie comme premier argument à end(), le FormHelper
affichera un bouton submit nommé en conséquence en même temps que la
balise de fermeture du formulaire.

::

    <?php echo $form->end('Finish'); ?>
     
    Sortie :
     
    <div class="submit">
        <input type="submit" value="Finish" />
    </div>
    </form>

Éléments de formulaire automagique
==================================

Tout d'abord, intéressons-nous à quelques unes des méthodes de création
automatique de formulaire de l'assistant Forms. La principale méthode
que nous allons étudier est input(). Cette méthode inspecte
automatiquement le champ du modèle qui lui est fourni afin de créer une
entrée appropriée pour ce champ.

input(string $fieldName, array $options = array())

+--------------------------------------------------+--------------------------------------------------------+
| Type de champ SQL                                | Champ du formulaire                                    |
+==================================================+========================================================+
| string (char, varchar, etc.)                     | text                                                   |
+--------------------------------------------------+--------------------------------------------------------+
| boolean, tinyint(1)                              | checkbox                                               |
+--------------------------------------------------+--------------------------------------------------------+
| text                                             | textarea                                               |
+--------------------------------------------------+--------------------------------------------------------+
| text, with name of password, passwd, or psword   | password                                               |
+--------------------------------------------------+--------------------------------------------------------+
| date                                             | day, month, and year selects                           |
+--------------------------------------------------+--------------------------------------------------------+
| datetime, timestamp                              | day, month, year, hour, minute, and meridian selects   |
+--------------------------------------------------+--------------------------------------------------------+
| time                                             | hour, minute, and meridian selects                     |
+--------------------------------------------------+--------------------------------------------------------+

Par exemple, supposons que mon modèle Utilisateur contient les champs
nom\_utilisateur (varchar), mot\_de\_passe (varchar), approuve
(datetime) et citation (text). Je peut utiliser la méthode input() de
l'assistant Forms pour créer une entrée appropriée pour tous les champs
du formulaire.

::

    <?php echo $form->create(); ?>
     
        <?php
            echo $form->input('nom_utilisateur');   //text
            echo $form->input('mot_de_passe');   //password
            echo $form->input('approuve');   //day, month, year, hour, minute, meridian
            echo $form->input('citation');      //textarea
        ?>
     
    <?php echo $form->end('Add'); ?>

Un exemple plus complet montrant quelques options pour le champ de date
:

::

            echo $form->input('date_naissance', array( 'label' => 'Date de naissance'
                                        , 'dateFormat' => 'DMY'
                                        , 'minYear' => date('Y') - 70
                                        , 'maxYear' => date('Y') - 18 ));

Et pour finir, voici un exemple pour la création d'une selection
hasAndBelongsToMany. Supposons que Utilisateur hasAndBelongsToMany
Groupe. Dans votre controlleur, définissez une variable camelCase au
pluriel (groupe -> groupes dans cette exemple, ou ExtraFunkyModele ->
extraFunkyModeles) avec les options de sélection. Dans le controlleur
vous pouver définir :

::

    $this->set('groupes', $this->Utilisateur->Groupe->find('list'));

Et dans la vue une sélection multiple sera créée avec cette simple ligne
de code :

::

    echo $form->input('Groupe');

Si vous voulez un champ de sélection utilisant une relation belongsTo ou
hasOne, vous pouvez ajouter ceci dans votre controlleur Utilisateurs
(supposant que Utilisateur belongsTo Groupe):

::

    $this->set('groupes', $this->Utilisateur->Groupe->find('list'));

Ensuite, ajoutez ceci à la vue du formulaire :

::

    echo $form->input('groupe_id');

Convention de nommage des champs
--------------------------------

Le Helper Form est assez évolué. Lorsque vous définissez un nom de champ
avec les méthodes du Helper Form, celui-ci génère automatiquement une
balise input basée sur le nom de modèle courant, selon le format suivant
:

::

    <input type="text" id="NommodeleNomchamp" name="data[Nommodele][nomchamp]">

Vous pouvez également préciser le nom du modèle manuellement, en passant
un premier paramètre de la forme Nommodele.nomchamp.

::

    echo $form->input('Nommodele.nomchamp');

Si vous avez besoin de définir plusieurs champs ayant le même nom, donc
de créer un tableau qui peut être enregistré en une seule fois avec
``saveAll()``, utilisez la convention suivante :

::

    <?php 
       echo $form->input('Nommodele.0.nomchamp');
       echo $form->input('Nommodele.1.nomchamp');
    ?>

    <input type="text" id="Nommodele0Nomchamp" name="data[Nommodele][0][nomchamp]">
    <input type="text" id="Nommodele1Nomchamp" name="data[Nommodele][1][nomchamp]">

$options[‘type’]
----------------

Vous pouvez forcer le type d'un input (et donc remplacer la logique
d'analyse du modèle) en définissant un type. En plus des types de champs
décrits dans le tableau ci-dessus, vous pouvez également créer des
inputs 'file' et 'password'.

::

    <?php echo $form->input('champ', array('type' => 'file')); ?>
     
    Affiche :
     
    <div class="input">
        <label for="UtilisateurChamp">Champ</label>
        <input type="file" name="data[Utilisateur][champ]" value="" id="UtilisateurChamp" />
    </div>

$options[‘before’], $options[‘between’], $options[‘separator’] and $options[‘after’]
------------------------------------------------------------------------------------

Utilisez ces clés si vous avez besoin d'injecter quelques balises à la
sortie de la méthode input().

::

    <?php echo $form->input('field', array(
        'before' => '--avant--',
        'after' => '--après--',
        'between' => '--au milieu---'
    ));?>
     
    Output:
     
    <div class="input">
    --avant--
    <label for="UserField">Champ</label>
    --au milieu---
    <input name="data[User][field]" type="text" value="" id="UserField" />
    --après--
    </div>

Pour un *input* de type radio l'attribut *'separator'* peut être utilisé
pour injecter des balise pour séparer input/label.

::

    <?php echo $form->input('field', array(
        'before' => '--avant--',
        'after' => '--après--',
        'between' => '--au milieu--',
        'separator' => '--séparateur--',
        'options' => array('1', '2') 
    ));?>
     
    Output:
     
    <div class="input">
    --avant--
    <input name="data[User][field]" type="radio" value="1" id="UserField1" />
    <label for="UserField1">1</label>
    --séparateur--
    <input name="data[User][field]" type="radio" value="2" id="UserField2" />
    <label for="UserField2">2</label>
    --au milieu---
    --après--
    </div>

Pour un élément de type ``date`` et ``datetime`` l'attribut
*'separator'* peut être utilisé pour modifier la chaine entre les
*select*. Par défaut '-'.

$options[‘options’]
-------------------

This key allows you to manually specify options for a select input, or
for a radio group. Unless the ‘type’ is specified as ‘radio’, the
FormHelper will assume that the target output is a select input.

::

    <?php echo $this->Form->input('field', array('options' => array(1,2,3,4,5))); ?>

Output:

::

    <div class="input">
        <label for="UserField">Field</label>
        <select name="data[User][field]" id="UserField">
            <option value="0">1</option>
            <option value="1">2</option>
            <option value="2">3</option>
            <option value="3">4</option>
            <option value="4">5</option>
        </select>
    </div>

Options can also be supplied as key-value pairs.

::

    <?php echo $this->Form->input('field', array('options' => array(
        'Value 1'=>'Label 1',
        'Value 2'=>'Label 2',
        'Value 3'=>'Label 3'
     ))); ?>

Output:

::

    <div class="input">
        <label for="UserField">Field</label>
        <select name="data[User][field]" id="UserField">
            <option value="Value 1">Label 1</option>
            <option value="Value 2">Label 2</option>
            <option value="Value 3">Label 3</option>
        </select>
    </div>

If you would like to generate a select with optgroups, just pass data in
hierarchical format. Works on multiple checkboxes and radio buttons too,
but instead of optgroups wraps elements in fieldsets.

::

    <?php echo $this->Form->input('field', array('options' => array(
        'Label1' => array(
           'Value 1'=>'Label 1',
           'Value 2'=>'Label 2'
        ),
        'Label2' => array(
           'Value 3'=>'Label 3'
        )
     ))); ?>

Output:

::

    <div class="input">
        <label for="UserField">Field</label>
        <select name="data[User][field]" id="UserField">
            <optgroup label="Label1">
                <option value="Value 1">Label 1</option>
                <option value="Value 2">Label 2</option>
            </optgroup>
            <optgroup label="Label2">
                <option value="Value 3">Label 3</option>
            </optgroup>
        </select>
    </div>

$options[‘multiple’]
--------------------

Si ‘multiple’ a été définit à vrai pour un champ qui génère un select,
le select autorisera les sélections multiples. Il est également possible
de définir la valeur de l'option ‘multiple’ à ‘checkbox’ pour générer
une liste de case à cocher.

::

    $form->input('Model.field', array( 'type' => 'select', 'multiple' => true ));
    $form->input('Model.field', array( 'type' => 'select', 'multiple' => 'checkbox' ));

$options[‘maxLength’]
---------------------

Cette option permet de définir le nombre maximum de caractères autorisés
dans un champ de texte.

$options[‘div’]
---------------

utiliser cette option pour mettre a jour les attributs contenus dans la
balise div. L'introduction d'une chaine de caractère mettra a jour

attributs correspondants au champs clé/valeur du tableau .
Alternativement ,

div .

Modification du nom de la class :

::

        echo $form->input('User.name', array('div' => 'class_name'));

Code produit :

::

    <div class="class_name">
        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Modification de plusieurs attributs :

::

        echo $form->input('User.name', array('div' => array('id' => 'mainDiv', 'title' => 'Div Title', 'style' => 'display:block')));

Code produit :

::

    <div class="input text" id="mainDiv" title="Div Title" style="display:block">
        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Annulation de l'affichage du div :

::

        <?php echo $form->input('User.name', array('div' => false));?>

Code produit :

::

        <label for="UserName">Name</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />

$options[‘label’]
-----------------

Mettez a jour cette option pour modifier la chaine de caractere qui va
etre affichée dans le libellé qui va accompagner le input

::

    <?php echo $form->input( 'User.name', array( 'label' => 'The User Alias' ) );?>

Code produit :

::

    <div class="input">
        <label for="UserName">The User Alias</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

Alternativement , mettez cette option a faux pour annuler l'affichage du
libellé .

::

    <?php echo $form->input( 'User.name', array( 'label' => false ) ); ?>

Code produit :

::

    <div class="input">
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

mettez cette option sous forme de tableau pour apporter des options
supplémentaires a l'élément ``label`` . Si vous faites cela , vous
pourrai utiliser la clé ``text`` dans le tableau pour modifier le texte
du libellé .

::

    <?php echo $form->input( 'User.name', array( 'label' => array('class' => 'thingy', 'text' => 'The User Alias') ) ); ?>

Code produit :

::

    <div class="input">
        <label for="UserName" class="thingy">The User Alias</label>
        <input name="data[User][name]" type="text" value="" id="UserName" />
    </div>

$options['legend']
------------------

Certaines balises *inputs*, comme les boutons radio, seront
automatiquement regroupées dans un *fieldset*, avec un titre de légende
provenant du nom des champs. Ce titre peut être surchargé avec cette
option. Définir cette option à *false* éliminera complètement le
*fieldset*.

$options[‘id’]
--------------

Définissez cette clé pour forcer la valeur de l'id DOM de l'*input*.

$options['error']
-----------------

Using this key allows you to override the default model error messages
and can be used, for example, to set i18n messages. It has a number of
suboptions which control the wrapping element, wrapping element class
name, and whether HTML in the error message will be escaped.

To disable error message output set the error key to false.

::

    $this->Form->input('Model.field', array('error' => false));

To modify the wrapping element type and its class, use the following
format:

::

    $this->Form->input('Model.field', array('error' => array('wrap' => 'span', 'class' => 'bzzz')));

To prevent HTML being automatically escaped in the error message output,
set the escape suboption to false:

::

    $this->Form->input('Model.field', array('error' => array('escape' => false)));

To override the model error messages use an associate array with the
keyname of the validation rule:

::

    $this->Form->input('Model.field', array('error' => array('tooShort' => __('This is not long enough', true) )));

As seen above you can set the error message for each validation rule you
have in your models. In addition you can provide i18n messages for your
forms.

$options['default']
-------------------

Used to set a default value for the input field. The value is used if
the data passed to the form does not contain a value for the field (or
if no data is passed at all).

Example usage:

::

    <?php 
        echo $this->Form->input('ingredient', array('default'=>'Sugar')); 
    ?>

Example with select field (Size "Medium" will be selected as default):

::

    <?php 
        $sizes = array('s'=>'Small', 'm'=>'Medium', 'l'=>'Large');
        echo $this->Form->input('size', array('options'=>$sizes, 'default'=>'m')); 
    ?>

You cannot use ``default`` to check a checkbox - instead you might set
the value in ``$this->data`` in your controller, ``$this->Form->data``
in your view, or set the input option ``checked`` to true.

Date and datetime fields' default values can be set by using the
'selected' key.

$options[‘selected’]
--------------------

Utilisé en combinaison avec un *input* de type *select* (A savoir: pour
les types *select*, *date*, *time*, *datetime*). Défini la valeur
*'selected'* de l'élément que vous voulez sélectionner par défaut lors
de l'affichage de l'*input*.

::

    echo $form->input('close_time', array('type' => 'time', 'selected' => '13:30:00'));

La clé sélectionnée pour un *input* de type *date* et *datetime* peut
être un *timestamp* UNIX.

$options[‘rows’], $options[‘cols’]
----------------------------------

Ces deux clés définissent le nombre de lignes et de colonnes dans un
*input* de type *textarea*.

::

    echo $form->input('textarea', array('rows' => '5', 'cols' => '5'));

Affichera:

::

    <div class="input text">
        <label for="FormTextarea">Textarea</label>
        <textarea name="data[Form][textarea]" cols="5" rows="5" id="FormTextarea" >
        </textarea>
    </div>

$options[‘empty’]
-----------------

Si vrai, force l'*input* à rester vide.

Lorsqu'il est passé à une liste de sélection, il créé une option vide
avec une valeur vide dans votre liste déroulante. Si vous voulez avoir
une valeur vide avec un texte affiché au lieu d'une option vide, passer
lui une chaine.

::

    <?php echo $form->input('field', array('options' => array(1,2,3,4,5), 'empty' => '(choisissez un texte)')); ?>

Affichera:

::

    <div class="input">
        <label for="UserField">Field</label>
        <select name="data[User][field]" id="UserField">
            <option value="">(choisissez un text)</option>
            <option value="0">1</option>
            <option value="1">2</option>
            <option value="2">3</option>
            <option value="3">4</option>
            <option value="4">5</option>
        </select>
    </div>

Si vous avez besoin de définir une valeur par défaut dans un champ
*password* à vide, utiliser à la place 'value' => ''.

Les options peuvent être fournies sous forme de paire clés-valeurs.

$options[‘timeFormat’]
----------------------

Utilisé pour spécifier le format d'un *input* de type *select* pour un
champs lié au temps. Les valeurs valides sont '12 ', '24', et 'none'.

$options[‘dateFormat’]
----------------------

Utilisé pour spécifier le format d'un *input* de type *select* lié à une
date. Les valeurs valides sont 'DMY', 'MDY', 'YMD', et 'NONE'.

$options['minYear'], $options['maxYear']
----------------------------------------

Utilisé en combinaison avec un *input* de type *date/datetime*. Défini
la valeur minimal et maximal d'un champs de type *select* pour les
années.

$options['interval']
--------------------

Cette option spécifie le nombre de minutes entre chaque option dans la
boîte de sélection des minutes.

::

    <?php echo $form->input('Model.time', array('type' => 'time', 'interval' => 15)); ?>

Créera 4 options dans la boite de sélection des minutes. Une toute les
15 minutes.

$options['class']
-----------------

You can set the classname for an input field using ``$options['class']``

::

    echo $this->Form->input('title', array('class' => 'custom-class'));

$options['hiddenField']
-----------------------

For certain input types (checkboxes, radios) a hidden input is created
so that the key in $this->data will exist even without a value
specified.

::

    <input type="hidden" name="data[Post][Published]" id="PostPublished_" value="0" />
    <input type="checkbox" name="data[Post][Published]" value="1" id="PostPublished" />

This can be disabled by setting the ``$options['hiddenField'] = false``.

::

    echo $this->Form->checkbox('published', array('hiddenField' => false));

Which outputs:

::

    <input type="checkbox" name="data[Post][Published]" value="1" id="PostPublished" />

If you want to create multiple blocks of inputs on a form that are all
grouped together, you should use this parameter on all inputs except the
first. If the hidden input is on the page in multiple places, only the
last group of input's values will be saved

In this example, only the tertiary colors would be passed, and the
primary colors would be overridden

::

    <h2>Primary Colors</h2>
    <input type="hidden" name="data[Color][Color]" id="Colors_" value="0" />
    <input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsRed" />
    <label for="ColorsRed">Red</label>
    <input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsBlue" />
    <label for="ColorsBlue">Blue</label>
    <input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsYellow" />
    <label for="ColorsYellow">Yellow</label>

    <h2>Tertiary Colors</h2>
    <input type="hidden" name="data[Color][Color]" id="Colors_" value="0" />
    <input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsGreen" />
    <label for="ColorsGreen">Green</label>
    <input type="checkbox" name="data[Color][Color][]" value="5" id="ColorsPurple" />
    <label for="ColorsPurple">Purple</label>
    <input type="checkbox" name="data[Addon][Addon][]" value="5" id="ColorsOrange" />
    <label for="ColorsOrange">Orange</label>

Disabling the ``'hiddenField'`` on the second input group would prevent
this behavior

Champs de fichiers
==================

Pour ajouter un champ d'*upload* de fichier dans un formulaire, vous
devez d'abord vous assurer que l'attribut enctype du formulaire est fixé
à "multipart/form-data", vous devez donc commencer par une fonction de
création définie comme ci-dessous.

::

    echo $this->Form->create('Document', array('enctype' => 'multipart/form-data') );

    // ou

    echo $this->Form->create('Document', array('type' => 'file'));

Ensuite, ajoutez une des deux lignes suivantes à votre fichier de vue
formulaire.

::

    echo $this->Form->input('Document.fichiersoumis', array('between'=>'<br />','type'=>'file'));

    // ou

    echo $this->Form->file('Document.fichiersoumis');

A cause des limitations liées à HTML, il n'est pas possible de définir
une valeur par défaut dans les champs inputs de type 'file'. Chaque fois
que le formulaire est affiché, le champ sera vide.

Dès la soumission, les champs de fichier fournissent un tableau étendu
de données au script qui reçoit les données du formulaire.

Dans l'exemple ci-dessus, les valeurs du tableau de données soumis
seraient organisées de la manière suivante, si CakePHP était installé
sur un serveur Windows. 'tmp\_name' aurait un chemin différent dans un
environnement Unix.

::


    $this->data['Document']['fichiersoumis'] = array(
        'name' => planning_conference.pdf
        'type' => application/pdf
        'tmp_name' => C:/WINDOWS/TEMP/php1EE.tmp
        'error' => 0
        'size' => 41737
    );

Ce tableau est généré par PHP lui-même, donc pour plus de détail sur la
façon dont PHP gère les données passées dans les champ de fichier, lisez
la `section sur l'upload de fichier du manuel
PHP <https://secure.php.net/features.file-upload>`_.

Valider un upload de fichier
----------------------------

Voici un exemple de méthode de validation que vous pourriez définir dans
votre modèle, afin de vérifier qu'un fichier a été uploadé avec succès.

::

    // Basé sur le commentaire 8 de : https://bakery.cakephp.org/articles/view/improved-advance-validation-with-parameters

    function isUploadedFile($params){
        $val = array_shift($params);
        if ((isset($val['error']) && $val['error'] == 0) ||
        (!empty($val['tmp_name']) && $val['tmp_name'] != 'none')) 
        {
            return is_uploaded_file($val['tmp_name']);
        } else {
            return false;
        }
    } 

Eléments du Formulaire - Méthodes Spécifiques
=============================================

Les autres méthodes disponibles dans l'Assistant Form permettent la
création d'éléments spécifiques de formulaire. La plupart de ces
méthodes utilisent également un paramètre spécial $options. Toutefois,
dans ce cas, $options est utilisé avant tout pour spécifier les
attributs des balises HTML (comme la valeur ou l'id DOM d'un élément du
formulaire).

::

    <?php echo $form->text('pseudo', array('class' => 'utilisateurs')); ?>
     
    Affichera :
     
    <input name="data[Utilisateur][pseudo]" type="text" class="utilisateurs" id="UtilisateurPseudo" />

checkbox
--------

``checkbox(string $fieldName, array $options)``

Cette méthode créer une checkbox. Elle génère également un champ input
de type hidden afin de forcer la soumission des données pour le champ
spécifié.

::

    <?php echo $this->Form->checkbox('fait'); ?>

Donnera:

::

    <input type="hidden" name="data[Utilisateur][fait]" value="0" id="UtilisateurFait_" />
    <input type="checkbox" name="data[Utilisateur][fait]" value="1" id="UtilisateurFait" />

button
------

``button(string $title, array $options = array())``

Crée un bouton HTML avec le titre spécifié et un type de *"button"* par
défaut. La configuration de ``$options['type']`` affichera l'un des 3
types de bouton possible:

#. button: Créer un bouton standard (celui par défaut).
#. reset: Créer un bouton de réinitialisation de formulaire.
#. submit: Similaire à la methode ``$form->submit``.

::

    <?php
    echo $form->button('Un bouton');
    echo $form->button('Un autre  bouton', array('type'=>'button'));
    echo $form->button('Réinitialiser le formulaire', array('type'=>'reset'));
    echo $form->button('Soumettre le formulaire', array('type'=>'submit'));
    ?>

Devrai afficher:

::

    <input type="button" value="Un bouton" />
    <input type="button" value="Un autre bouton" />
    <input type="reset" value="Réinitialiser le formulaire" />
    <input type="Submit" value="Soumettre le formulaire" />

year
----

``year(string $fieldName, int $minYear, int $maxYear, mixed $selected, array $attributes, boolean $showEmpty)``

Crée un menu de sélection composé des années de ``$minYear`` à
``$maxYear``, avec l'année $selected sélectionnée par défaut. Les
attributs HTML sont fournit dans $attributes. Si ``$showEmpty`` est
faux, le menu de sélection n'affichera pas de champs vide.

::

    <?php
    echo $form->year('purchased',2000,date('Y'));
    ?>

Affichera:

::

    <select name="data[User][purchased][year]" id="UserPurchasedYear">
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

month
-----

``month(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

Crée un menu de sélection composé des noms des mois.

::

    <?php
    echo $form->month('mob');
    ?>

Affichera:

::

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

dateTime
--------

``dateTime(string $fieldName, string $dateFormat = ‘DMY’, $timeFormat = ‘12’, mixed $selected = null, array $attributes = array())``

Crée un menu de sélection pour la date et le temps. Les valeurs valides
de $dateformat sont ‘DMY’, ‘MDY’, ‘YMD’ ou ‘NONE’. Les valeurs valides
pour $timeFormat sont ‘12’, ‘24’, et ‘NONE’.

Vous pouvez préciser de ne pas afficher de valeur vide, en spécifiant
"array('empty' => false)" dans le paramètre 'attributes'.

mettant $selected = null et $attributes = array("empty" => false).

day
---

``day(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

Crée un menu de sélection composé des jours (numériques) du mois.

Pour créer une option vide avec un texte de votre choix (par exemple, la
première option est "Jour"), vous pouvez définir le texte comme
paramètre final:

::

    <?php
    echo $form->day('created');
    ?>

Devrai afficher:

::

    <select name="data[User][created][day]" id="UserCreatedDay">
    <option value=""></option>
    <option value="01">1</option>
    <option value="02">2</option>
    <option value="03">3</option>
    ...
    <option value="31">31</option>
    </select>

hour
----

``hour(string $fieldName, boolean $format24Hours, mixed $selected, array $attributes, boolean $showEmpty)``

Crée un menu de sélection composé de l'heure du jour.

minute
------

``minute(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

Crée un menu de sélection composé des minutes de l'heure.

meridian
--------

``meridian(string $fieldName, mixed $selected, array $attributes, boolean $showEmpty)``

Crée un menu de sélection composé de ‘am’ et ‘pm’.

error
-----

``error(string $fieldName, string $text, array $options)``

Affiche un message d'erreur de validation, spécifiée par $texte, pour le
champ donné, dans le cas où une erreur de validation a eu lieu.

Options:

-  'escape' bool Échapper ou non le contenu de l'erreur.
-  'wrap' mixed Enveloppe ou non le message d'erreur d'une div. Si c'est
   une chaine, elle sera utilisé comme tag HTML.
-  'class' string Le nom de la *class* du message d'erreur

file
----

``file(string $fieldName, array $options)``

Crée un *input* de type *file*.

::

    <?php
    echo $form->create('User',array('type'=>'file'));
    echo $form->file('avatar');
    ?>

Devrai afficher:

::

    <form enctype="multipart/form-data" method="post" action="/users/add">
    <input name="data[User][avatar]" value="" id="UserAvatar" type="file">

Lors de l'utilisation de ``$form->file()``, rappelez vous de bien
utilisé l'*encoding-type file*, en définissant le type en option à
'file' dans ``$form->create()``

hidden
------

``hidden(string $fieldName, array $options)``

Crée un champs invisible. Exemple:

::

    <?php
    echo $form->hidden('id');
    ?>

Devrai afficher:

::

    <input name="data[User][id]" value="10" id="UserId" type="hidden">

isFieldError
------------

``isFieldError(string $fieldName)``

Renvoie vrai si le champ $fieldName a une erreur de validation.

::

    <?php
    if ($form->isFieldError('genre')){
        echo $form->error('genre');
    }
    ?>

Lors de l'utilisation de ``$form->input()``, les erreurs sont affichées
par défaut.

label
-----

``label(string $fieldName, string $text, array $attributes)``

Crée une étiquette (*tag label*), contenant $text.

::

    <?php
    echo $form->label('status');
    ?>

Devrai afficher:

::

    <label for="UserStatus">Status</label>

password
--------

``password(string $fieldName, array $options)``

Crée un champs de mot de passe.

::

    <?php
    echo $form->password('password');
    ?>

Devrai afficher:

::

    <input name="data[User][password]" value="" id="UserPassword" type="password">

radio
-----

``radio(string $fieldName, array $options, array $attributes)``

Crée un bouton de type *radio*. Utilisez ``$attributes['value']`` pour
définir quelle valeur devra être sélectionnée par défaut.

Utilisez ``$attributes['separator']`` pour spécifier le HTML entre les
boutons *radio* (e.g. <br />).

Les boutons sont enveloppés par défaut d'un *label* et d'un *fieldset*.
Définissez ``$attributes['legend']`` à *false* pour les supprimer.

::

    <?php
    $options=array('M'=>'Male','F'=>'Female');
    $attributes=array('legend'=>false);
    echo $form->radio('gender',$options,$attributes);
    ?>

Devrait afficher:

::

    <input name="data[User][gender]" id="UserGender_" value="" type="hidden">
    <input name="data[User][gender]" id="UserGenderM" value="M" type="radio">
    <label for="UserGenderM">Male</label>
    <input name="data[User][gender]" id="UserGenderF" value="F" type="radio">
    <label for="UserGenderF">Female</label>

Si pour n'importe quelle raison vous ne voulez pas de l'*input* caché,
définissez ``$attributes['value']`` par une valeur à sélectionner ou un
booléen à *false*.

select
------

``select(string $fieldName, array $options, mixed $selected, array $attributes)``

Crée un menu de sélection, composé des éléments de ``$options``, avec
l'option spécifiée par ``$selected`` qui sera le champ sélectionné par
défaut. Pour afficher votre propre option par défaut, assignez la valeur
souhaitée à ``$attributes['empty']`` ou fixez sa valeur à *false* pour
désactiver l'option vide.

::

    <?php
    $options=array('M'=>'Homme','F'=>'Femme');
    echo $form->select('sexe',$options)
    ?>

Devrai afficher:

::

    <select name="data[User][sexe]" id="UserSexe">
    <option value=""></option>
    <option value="M">Homme</option>
    <option value="F">Femme</option>
    </select>

submit
------

``submit(string $caption, array $options)``

Crée un bouton de soumission de formulaire avec une légende
``$caption``. Si ``$caption`` est l'URL d'image (qui contient un ‘.’),
le bouton sera affiché en tant qu'image.

Il est enveloppé d'une ``div`` par défaut ; vous pouvez annuler cette
déclaration ``$options['div'] = false``.

::

    <?php
    echo $form->submit();
    ?>

Devrait afficher:

::

    <div class="submit"><input value="Submit" type="submit"></div>

Vous pouvez définir une url d'image relative ou absolue pour la légende
à la place d'un texte comme légende.

::

    <?php
    echo $form->submit('ok.png');
    ?>

Devrait afficher:

::

    <div class="submit"><input type="image" src="/img/ok.png"></div>

text
----

``text(string $fieldName, array $options)``

Crée un champ de texte.

::

    <?php
    echo $form->text('prenom');
    ?>

Devrai afficher:

::

    <input name="data[User][prenom]" value="" id="UserPrenom" type="text">

textarea
--------

``textarea(string $fieldName, array $options)``

Crée un champ de zone de texte.

::

    <?php
    echo $form->textarea('notes');
    ?>

Devrai afficher:

::

    <textarea name="data[User][notes]" id="UserNotes"></textarea>

1.3 improvements
================

The FormHelper is one of the most frequently used classes in CakePHP,
and has had several improvements made to it.

**Entity depth limitations**

In 1.2 there was a hard limit of 5 nested keys. This posed significant
limitations on form input creation in some contexts. In 1.3 you can now
create infinitely nested form element keys. Validation errors and value
reading for arbitrary depths has also been added.

**Model introspection**

Support for adding 'required' classes, and properties like ``maxlength``
to hasMany and other associations has been improved. In the past only 1
model and a limited set of associations would be introspected. In 1.3
models are introspected as needed, providing validation and additional
information such as maxlength.

**Default options for input()**

In the past if you needed to use ``'div' => false``, or
``'label' => false`` you would need to set those options on each and
every call to ``input()``. Instead in 1.3 you can declare a set of
default options for ``input()`` with the ``inputDefaults`` key.

::

    echo $this->Form->create('User', array(
            'inputDefaults' => array(
                'label' => false,
                'div' => false
            )
        ));

All inputs created from that point forward would inherit the options
declared in inputDefaults. You can override the defaultOptions by
declaring the option in the input() call.

::

    echo $this->Form->input('password'); // No div, no label
    echo $this->Form->input('username', array('label' => 'Username')); // has a label element

**Omit attributes**

You can now set any attribute key to null or false in an
options/attributes array to omit that attribute from a particular html
tag.

::

    echo $this->Form->input('username', array(
        'div' => array('class' => false)
    )); // Omits the 'class' attribute added by default to div tag

**Accept-charset**

Forms now get an accept-charset set automatically, it will match the
value of ``App.encoding``, it can be overridden or removed using the
'encoding' option when calling create().

::

    // To remove the accept-charset attribute.
    echo $this->Form->create('User', array('encoding' => null));

**Removed parameters**

Many methods such as ``select``, ``year``, ``month``, ``day``, ``hour``,
``minute``, ``meridian`` and ``datetime`` took a ``$showEmpty``
parameter, these have all been removed and rolled into the
``$attributes`` parameter using the ``'empty'`` key.

**Default url**

The default url for forms either was ``add`` or ``edit`` depending on
whether or not a primary key was detected in the data array. In 1.3 the
default url will be the current action, making the forms submit to the
action you are currently on.

**Disabling hidden inputs for radio and checkbox**

The automatically generated hidden inputs for radio and checkbox inputs
can be disabled by setting the ``'hiddenField'`` option to ``false``.

**button()**

button() now creates button elements, these elements by default do not
have html entity encoding enabled. You can enable html escaping using
the ``escape`` option. The former features of ``FormHelper::button``
have been moved to ``FormHelper::submit``.

**submit()**

Due to changes in ``button()``, ``submit()`` can now generate reset, and
other types of input buttons. Use the ``type`` option to change the
default type of button generated. In addition to creating all types of
buttons, ``submit()`` has ``before`` and ``after`` options that behave
exactly like their counterparts in ``input()``.

**$options['format']**

The HTML generated by the form helper is now more flexible than ever
before. The $options parameter to Form::input() now supports an array of
strings describing the template you would like said element to follow.
It's just been recently added to SCM, and has a few bugs for non PHP 5.3
users, but should be quite useful for all. The supported array keys are
``array('before', 'input', 'between', 'label', 'after', 'error')``.
