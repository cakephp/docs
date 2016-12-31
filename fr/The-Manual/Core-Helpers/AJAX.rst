AJAX
####

L'assistant AJAX utilise les librairies populaires que sont Prototype et
script.aculo.us pour les requêtes AJAX et les effets de slide côté
client. Pour utiliser l'assistant AJAX, vous devez avoir la version
actuelle de la librairie Javascript
`www.prototypejs.org <http://www.prototypejs.org>`_ et
`http://script.aculo.us <http://script.aculo.us/>`_ placé dans
/app/webroot/js/.De plus, vous devrez inclure les librairies Javascript
Prototype et script.aculo.us dans chaque vues utilisant les
fonctionnalités de l'assistant AJAX.

Vous devez inclure les assistants AJAX et Javascript dans votre
contrôleur.

::

    class WidgetsController extends AppController {
        var $name = 'Widgets';
        var $helpers = array('Html','Ajax','Javascript');
    }

Une fois l'assistant Javascript inclus dans votre contrôleur, vous
pouvez utiliser la méthode link() de l'assistant Javascript pour inclure
Prototype et Scriptaculous:

::

    echo $javascript->link('prototype');
    echo $javascript->link('scriptaculous'); 

Vous pouvez désormais utiliser l'assistant AJAX dans votre vue:

::

    $ajax->whatever();

Si le `Composant RequestHandler </fr/view/174/request-handling>`_ est
inclus dans le contrôleur, cakePHP appliquera automatiquement la mise en
page AJAX quand une requête sera demandée.

::

    class WidgetsController extends AppController {
        var $name = 'Widgets';
        var $helpers = array('Html','Ajax','Javascript');
        var $components = array( 'RequestHandler' );
    }

Options de l'assistant AJAX
===========================

La plupart des méthodes de l'assistant AJAX vous autorisent à fournir un
tableau $options. Vous pouvez utiliser ce tableau pour configurer le
comportement de l'assistant AJAX. Avant que nous abordions les méthodes
spécifiques à l'assistant, jetons un œil aux différentes options
disponibles via ce tableau spécial. Vous vous référerez à cette section
quand vous commencerez à utiliser les méthodes de l'assistant AJAX.

Options générales
-----------------

``$option`` keys

Description

``$options['evalScripts']``

Détermine si les balises script dans le contenu retourné sont évaluées.
Défini à *true* par défaut.

``$options['frequency']``

Le nombre de seconde entre les vérifications à intervalle régulier.

``$options['indicator']``

L'id DOM d'un élément à montrer lorsqu'une requête est en chargement et
à cacher quand la requête est finie.

``$options['position']``

Pour insérer plutôt que remplacer, utilisez cette option pour préciser
la position d'insertion entre *top*, *bottom*, *after* ou *before*.

``$options['update']``

L'id de l'élement du DOM qui sera mis à jour avec le contenu retourné.

``$options['url']``

L'url au format contrôleur/action que vous souhaitez appeler.

``$options['type']``

Indique si la requête doit être 'synchronous' (synchrone) ou
'asynchronous' (asynchrone, valeur par défaut).

``$options['with']``

Une chaîne "URL-encodée" qui sera ajoutée à l'URL pour les méthodes get
ou dans le corps du post pour tout autre méthode. Exemple :
``x=1&toto=tata&y=2``. Les paramètres seront disponibles dans
``$this->params['form']`` ou dans ``$this->data``, en fonction du
format. Pour plus d'information, voyez la méthode `Serialize de
Prototype <http://www.prototypejs.org/api/form/serialize>`_.

Options Callback
----------------

Les options *Callbacks* vous permettent d'appeler des fonctions
JavaScript à des endroits spécifiques. Si vous cherchez un moyen
d'injecter un peu de logique, avant, après ou lors de vos opérations
utilisant l'assistant Ajax, utilisez ces *callbacks* pour mettre les
choses en place.

$options

Description

$options['condition']

Extrait de code JavaScript qui doit évaluer *true* avant que la demande
soit initialisée.

$options['before']

Exécuté avant que la demande soit faite. Une utilisation courante de ce
*callBack* est de permettre l'affichage d'un indicateur de progression.

$options['confirm']

Texte à afficher dans une alerte de confirmation JavaScript avant de
continuer.

$options['loading']

*Callback* exécuté lorsque des données sont récupérées à partir du
serveur.

$options['after']

JavaScript appelé après que la requête soit lancée et avant que le
*callback* $options['loading'] se lance.

$options['loaded']

*Callback* exécuté lorsque le document distant a été reçu par le client.

$options['interactive']

Appelée lorsque l'utilisateur peut interagir avec le document distant,
même si il n'a pas fini de se charger.

$options['complete']

*Callback* JavaScript à exécuter lorsque XMLHttpRequest est terminé.

Méthodes
========

link
----

``link(string $title, mixed $href, array $options, string $confirm, boolean $escapeTitle)``

Returns a link to a remote action defined by ``$options['url']`` or
``$href`` that's called in the background using XMLHttpRequest when the
link is clicked. The result of that request can then be inserted into a
DOM object whose id can be specified with ``$options['update']``.

If ``$options['url']`` is blank the href is used instead

Example:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'View Post', 
        array( 'controller' => 'posts', 'action' => 'view', 1 ), 
        array( 'update' => 'post' )
    ); 
    ?>

By default, these remote requests are processed asynchronously during
which various callbacks can be triggered

Example:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'View Post', 
        array( 'controller' => 'posts', 'action' => 'post', 1 ), 
        array( 'update' => 'post', 'complete' => 'alert( "Hello World" )'  )
    ); 
    ?>

To use synchronous processing specify
``$options['type'] = 'synchronous'``.

To automatically set the ajax layout include the *RequestHandler*
component in your controller

By default the contents of the target element are replaced. To change
this behaviour set the ``$options['position']``

Example:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'View Post', 
        array( 'controller' => 'posts', 'action' => 'view', 1), 
        array( 'update' => 'post', 'position' => 'top'  )
    ); 
    ?>

``$confirm`` can be used to call up a JavaScript confirm() message
before the request is run. Allowing the user to prevent execution.

Example:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'Delete Post', 
        array( 'controller' => 'posts', 'action' => 'delete', 1 ), 
        array( 'update' => 'post' ),
        'Do you want to delete this post?'
    ); 
    ?>

remoteFunction
--------------

``remoteFunction(array $options);``

Cette fonction crée le code JavaScript nécessaire pour effectuer un
appel distant. Elle est principalement utilisée en tant qu'assistant
pour link(). Ceci n'est pas utilisé très souvent, à moins que vous
n'ayez besoin de générer des scripts personnalisés.

Les ``$options`` pour cette fonction sont les mêmes que pour la méthode
``link``

Exemple :

::

    <div id="post">
    </div>
    <script type="text/javascript">
    <?php echo $ajax->remoteFunction( 
        array( 
            'url' => array( 'controller' => 'posts', 'action' => 'voir', 1 ), 
            'update' => 'post' 
        ) 
    ); ?>
    </script>

Il peut aussi être assigné à un attribut d'évènement HTML :

::

    <?php 
        $remoteFunction = $ajax->remoteFunction( 
            array( 
            'url' => array( 'controller' => 'posts', 'action' => 'voir', 1 ),
            'update' => 'post' ) 
        ); 
    ?>
    <div id="post" onmouseover="<?php echo $remoteFunction; ?>" >
    Bougez la souris ici
    </div>

Si ``$options['update']`` n'est pas transmis, le navigateur ignorera la
réponse du serveur.

remoteTimer
-----------

``remoteTimer(array $options)``

Appelle périodiquement l'action ``$options['url']``, toutes les
``$options['frequency']`` secondes. Généralement utilisé pour mettre à
jour un div spécifique (défini dans ``$options['update']``) avec le
résultat de l'appel distant. Les *Callbacks* peuvent être utilisés.

``remoteTimer`` est identique à ``remoteFunction`` à l'exception du
paramètre supplémentaire ``$options['frequency']``

Exemple :

::

    <div id="post">
    </div>
    <?php
    echo $ajax->remoteTimer(
        array(
        'url' => array( 'controller' => 'posts', 'action' => 'voir', 1 ),
        'update' => 'post', 'complete' => 'alert( "requête terminée" )',
        'position' => 'bottom', 'frequency' => 5
        )
    );
    ?>

La valeur par défaut de ``$options['frequency']`` est 10 secondes

form
----

``form(string $action, string $type, array $options)``

Returns a form tag that submits to $action using XMLHttpRequest instead
of a normal HTTP request via $type ('post' or 'get'). Otherwise, form
submission will behave exactly like normal: data submitted is available
at $this->data inside your controllers. If $options['update'] is
specified, it will be updated with the resulting document. Callbacks can
be used.

The options array should include the model name e.g.

::

    $ajax->form('edit','post',array('model'=>'User','update'=>'UserInfoDiv'));

Alternatively, if you need to cross post to another controller from your
form:

::

    $ajax->form(array('type' => 'post',
        'options' => array(
            'model'=>'User',
            'update'=>'UserInfoDiv',
            'url' => array(
                'controller' => 'comments',
                'action' => 'edit'
            )
        )
    ));

You should not use the ``$ajax->form()`` and ``$ajax->submit()`` in the
same form. If you want the form validation to work properly use the
``$ajax->submit()`` method as shown below.

submit
------

``submit(string $titre, array $options)``

Retourne un bouton *submit* qui soumet le formulaire à
``$options['url']`` et met à jour le div spécifié dans
``$options['update']``

::

    <div id='testdiv'>
    <?php
    echo $form->create('Utilisateurs');
    echo $form->input('email');
    echo $form->input('nom');
    echo $ajax->submit('Soumettre', array('url'=> array('controller'=>'utilisateurs', 'action'=>'ajouter'), 'update' => 'testdiv'));
    echo $form->end();
    ?>
    </div>

Utilisez la méthode ``$ajax->submit()`` si vous voulez que la validation
du formulaire fonctionne bien. A savoir : vous voulez que les messages
indiqués dans vos règles de validation s'affiche correctement.

observeField
------------

``observeField(string $fieldId, array $options)``

Observes the field with the DOM id specified by $field\_id (every
$options['frequency'] seconds ) and makes an XMLHttpRequest when its
contents have changed.

::

    <?php echo $form->create( 'Post' ); ?>
    <?php $titles = array( 1 => 'Tom', 2 => 'Dick', 3 => 'Harry' ); ?>   
    <?php echo $form->input( 'title', array( 'options' => $titles ) ) ?>
    </form>

    <?php 
    echo $ajax->observeField( 'PostTitle', 
        array(
            'url' => array( 'action' => 'edit' ),
            'frequency' => 0.2,
        ) 
    ); 
    ?>

``observeField`` uses the same options as ``link``

The field to send up can be set using ``$options['with']``. This
defaults to ``Form.Element.serialize('$fieldId')``. Data submitted is
available at ``$this->data`` inside your controllers. Callbacks can be
used with this function.

To send up the entire form when the field changes use
``$options['with'] = Form.serialize( $('Form ID') )``

observeForm
-----------

``observeForm(string $form_id, array $options)``

Similaire à observeField(), mais fonctionne sur un formulaire complet,
identifié par son id DOM $form\_id. Les $options fournies sont les mêmes
que observeField(), à l'exception de la valeur par défaut de l'option
$options['with'], qui est évaluée à la valeur sérialisée (chaine de
requête) du formulaire.

autoComplete
------------

``autoComplete(string $fieldId, string $url,  array $options)``

Renders a text field with $fieldId with autocomplete. The remote action
at $url should return a suitable list of autocomplete terms. Often an
unordered list is used for this. First, you need to set up a controller
action that fetches and organizes the data you'll need for your list,
based on user input:

::

    function autoComplete() {
        //Partial strings will come from the autocomplete field as
        //$this->data['Post']['subject'] 
        $this->set('posts', $this->Post->find('all', array(
                    'conditions' => array(
                        'Post.subject LIKE' => $this->data['Post']['subject'].'%'
                    ),
                    'fields' => array('subject')
        )));
        $this->layout = 'ajax';
    }

Next, create ``app/views/posts/auto_complete.ctp`` that uses that data
and creates an unordered list in (X)HTML:

::

    <ul>
     <?php foreach($posts as $post): ?>
         <li><?php echo $post['Post']['subject']; ?></li>
     <?php endforeach; ?>
    </ul> 

Finally, utilize autoComplete() in a view to create your auto-completing
form field:

::

    <?php echo $form->create('User', array('url' => '/users/index')); ?>
        <?php echo $ajax->autoComplete('Post.subject', '/posts/autoComplete')?>
    <?php echo $form->end('View Post')?>

Once you've got the autoComplete() call working correctly, use CSS to
style the auto-complete suggestion box. You might end up using something
similar to the following:

::

    div.auto_complete    {
         position         :absolute;
         width            :250px;
         background-color :white;
         border           :1px solid #888;
         margin           :0px;
         padding          :0px;
    } 
    li.selected    { background-color: #ffb; }

isAjax
------

``isAjax()``

Vous permet de vérifier si la requête actuelle est une requête Ajax de
Prototype à l'intérieur d'une vue. Renvoie un booléen. Peut être utilisé
pour une logique de présentation, pour afficher/cacher des blocs de
contenu.

drag & drop
-----------

``drag(string $id, array $options)``

Makes a Draggable element out of the DOM element specified by $id. For
more information on the parameters accepted in $options see
`https://github.com/madrobby/scriptaculous/wikis/draggable <https://github.com/madrobby/scriptaculous/wikis/draggable>`_.

Common options might include:

+--------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options keys            | Description                                                                                                                                                                                                                                                                                           |
+==========================+=======================================================================================================================================================================================================================================================================================================+
| $options['handle']       | Sets whether the element should only be draggable by an embedded handle. The value must be an element reference or element id or a string referencing a CSS class value. The first child/grandchild/etc. element found within the element that has this CSS class value will be used as the handle.   |
+--------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['revert']       | If set to true, the element returns to its original position when the drags ends. Revert can also be an arbitrary function reference, called when the drag ends.                                                                                                                                      |
+--------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['constraint']   | Constrains the drag to either 'horizontal' or 'vertical', leave blank for no constraints.                                                                                                                                                                                                             |
+--------------------------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

``drop(string $id, array $options)``

Makes the DOM element specified by $id able to accept dropped elements.
Additional parameters can be specified with $options. For more
information see
`https://github.com/madrobby/scriptaculous/wikis/droppables <https://github.com/madrobby/scriptaculous/wikis/droppables>`_.

Common options might include:

+---------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options keys             | Description                                                                                                                                                                              |
+===========================+==========================================================================================================================================================================================+
| $options['accept']        | Set to a string or javascript array of strings describing CSS classes that the droppable element will accept. The drop element will only accept elements of the specified CSS classes.   |
+---------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['containment']   | The droppable element will only accept the dragged element if it is contained in the given elements (element ids). Can be a string or a javascript array of id references.               |
+---------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['overlap']       | If set to 'horizontal' or 'vertical', the droppable element will only react to a draggable element if it is overlapping the droparea by more than 50% in the given axis.                 |
+---------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| $options['onDrop']        | A javascript call back that is called when the dragged element is dropped on the droppable element.                                                                                      |
+---------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

``dropRemote(string $id, array $options)``

Makes a drop target that creates an XMLHttpRequest when a draggable
element is dropped on it. The $options array for this function are the
same as those specified for drop() and link().

slider
------

``slider(string $id, string $track_id, array  $options)``

Creates a directional slider control. For more information see
`http://wiki.github.com/madrobby/scriptaculous/slider <http://wiki.github.com/madrobby/scriptaculous/slider>`_.

Common options might include:

$options keys

Description

$options['axis']

Sets the direction the slider will move in. 'horizontal' or 'vertical'.
Defaults to horizontal

$options['handleImage']

The id of the image that represents the handle. This is used to swap out
the image src with disabled image src when the slider is enabled. Used
in conjunction with handleDisabled.

$options['increment']

Sets the relationship of pixels to values. Setting to 1 will make each
pixel adjust the slider value by one.

$options['handleDisabled']

The id of the image that represents the disabled handle. This is used to
change the image src when the slider is disabled. Used in conjunction
handleImage.

$options['change']
 $options['onChange']

JavaScript callback fired when the slider has finished moving, or has
its value changed. The callback function receives the slider's current
value as a parameter.

$options['slide']
 $options['onSlide']

JavaScript callback that is called whenever the slider is moved by
dragging. It receives the slider's current value as a parameter.

editor
------

``editor(string $id, string $url, array $options)``

Creates an in-place editor at DOM id. The supplied ``$url`` should be an
action that is responsible for saving element data. For more information
and demos see
`https://github.com/madrobby/scriptaculous/wikis/ajax-inplaceeditor <https://github.com/madrobby/scriptaculous/wikis/ajax-inplaceeditor>`_.

Common options might include:

$options keys

Description

``$options['collection']``

Activate the 'collection' mode of in-place editing.
$options['collection'] takes an array which is turned into options for
the select. To learn more about collection see
`https://github.com/madrobby/scriptaculous/wikis/ajax-inplacecollectioneditor <https://github.com/madrobby/scriptaculous/wikis/ajax-inplacecollectioneditor>`_.

``$options['callback']``

A function to execute before the request is sent to the server. This can
be used to format the information sent to the server. The signature is
``function(form, value)``

``$options['okText']``

Text of the submit button in edit mode

``$options['cancelText']``

The text of the link that cancels editing

``$options['savingText']``

The text shown while the text is sent to the server

``$options['formId']``

``$options['externalControl']``

``$options['rows']``

The row height of the input field

``$options['cols']``

The number of columns the text area should span

``$options['size']``

Synonym for ‘cols’ when using single-line

``$options['highlightcolor']``

The highlight color

``$options['highlightendcolor']``

The color which the highlight fades to

``$options['savingClassName']``

``$options['formClassName']``

``$options['loadingText']``

``$options['loadTextURL']``

Example

::

    <div id="in_place_editor_id">Text To Edit</div>
    <?php
    echo $ajax->editor( 
        "in_place_editor_id", 
        array( 
            'controller' => 'Posts', 
            'action' => 'update_title',
            $id
        ), 
        array()
    );
    ?>

sortable
--------

``sortable(string $id, array $options)``

Makes a list or group of floated objects contained by $id sortable. The
options array supports a number of parameters. To find out more about
sortable see
`http://wiki.github.com/madrobby/scriptaculous/sortable <http://wiki.github.com/madrobby/scriptaculous/sortable>`_.

Common options might include:

$options keys

Description

$options['tag']

Indicates what kind of child elements of the container will be made
sortable. Defaults to 'li'.

$options['only']

Allows for further filtering of child elements. Accepts a CSS class.

$options['overlap']

Either 'vertical' or 'horizontal'. Defaults to vertical.

$options['constraint']

Restrict the movement of the draggable elements. accepts 'horizontal' or
'vertical'. Defaults to vertical.

$options['handle']

Makes the created Draggables use handles, see the handle option on
Draggables.

$options['onUpdate']

Called when the drag ends and the Sortable's order is changed in any
way. When dragging from one Sortable to another, the callback is called
once on each Sortable.

$options['hoverclass']

Give the created droppable a hoverclass.

$options['ghosting']

If set to true, dragged elements of the sortable will be cloned and
appear as a ghost, instead of directly manipulating the original
element.
