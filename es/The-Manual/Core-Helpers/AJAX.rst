AJAX
####

El AjaxHelper utilizas las populares librerías Prototype y
script.aculo.us para operaciones Ajax y efectos en el lado del cliente.
Para utilizar el AjaxHelper has de tener la versión actual de las
librerías de JavaScript de
`www.prototypejs.org <http://www.prototypejs.org>`_ y
`http://script.aculo.us <http://script.aculo.us/>`_ situadas en
``/app/webroot/js``. Además has de incluir las librerías Prototype y
script.aculo.us en los *layouts* o *vistas* que requieran las
funcionalidades de AjaxHelper.

Para poder cargar las librerías Prototype y script.aculo.us necesitarás
incluir los *helpers* Ajax y Javascript en tu controlador:

::

    class WidgetsController extends AppController {
        var $name = 'Widgets';
        var $helpers = array('Html','Ajax','Javascript');
    }

Una vez que hayas incluido el helper de javascript en tu controlador,
puedes utilizar el método ``link()`` de ``$javascript`` para incluir las
liberías Prototype y script.aculo.us en la vista:

::

    echo $javascript->link('prototype');
    echo $javascript->link('scriptaculous'); 

Ahora ya puedes puedes utilizar el helper Ajax en tu vista:

::

    $ajax->loquesea();

Si se incluye el `componente
RequestHandler </es/view/174/request-handling>`_ en el controlador,
CakePHP automáticamente aplicará el *layout* Ajax cuando se realize una
petición de una acción mediante AJAX.

::

    class WidgetsController extends AppController {
        var $name = 'Widgets';
        var $helpers = array('Html','Ajax','Javascript');
        var $components = array( 'RequestHandler' );
    }

AjaxHelper Options
==================

La mayoría de los métodos del AjaxHelper permiten suministrar un arreglo
de opciones ($options). Puedes usar este arreglo para configurar el
comportamiento del AjaxHelper. Antes de cubrir los métodos específicos
del helper, veamos las diferentes opciones disponibles a través de este
arreglo. Esta sección será de utilidad como referencia mientras inicias
el uso de los métodos del AjaxHelper.

General Options
---------------

$options['url']
    La url del controlador/acción que se quiere llamar.
$options['update']
    El id del elemento DOM a ser actualizado con el contenido que
    retorne.
$options['frequency']
    El número de segundos entre intervalos de observación.
$options['type']
    Indica si la petición se realiza de forma síncrona ó asíncrona (por
    omisión).

Opciones de retrollamadas (Callback Options)
--------------------------------------------

Las opciones de Callbacks te permiten llamar a las funciones de
JavaScript en puntos específicos en el proceso de solicitud (request).
Si estás buscando insertar un poco de lógica antes, después, o durante
tus operaciones de AjaxHelper, usa estas Callbacks para estableces las
cosas.

$options keys

Description

$options['condition']

El fragmento de código JavaScriptque necesita evaluar a *true* antes de
que la solicitud se inicie.

$options['before']

Se ejecuta antes de que una solicitud sea efectuada. Un uso común de
esta es permitir la visibilidad de un indicador de progreso.

$options['confirm']

Texto a mostrar en un cuadro de confirmación de JavaScript antes de
proceder.

$options['loading']

Código de la Callback que se ejecutará mientras que los datos se
recuperan desde el servidor.

$options['after']

JavaScript llamado inmediatamente después de que se ejecuta una
solicitud; se dispare antes de que se ejecute la callback
$options['loading'].

$options['loaded']

Código de la Callback a ser ejecutado cuando un documento remoto es
recivido por el cliente.

$options['interactive']

Llamada cuando un usuario puede interactuar con el documento remoto, a
pesar de que no ha terminado de cargar.

$options['complete']

Callback JavaScript a ser ejecutada cuando se completa un
XMLHttpRequest.

Métodos
=======

link
----

``link(string $title, string $href, array $options, string $confirm, boolean $escapeTitle)``

Devuelve un enlace a una acción remota definida por ``$options['url']``
o ``$href`` que se llama en background utilizando XMLHttpRequest cuando
se hace clic en el enlace. El resultado de esa petición puede ser
insertada en un objeto DOM cuya identificación se puede especificar con
``$options['update']``.

Si ``$options['url']`` esta en blanco href es utilizado en su lugar

Ejemplo:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'View Post', 
        array( 'controller' => 'posts', 'action' => 'view', 1 ), 
        array( 'update' => 'post' )
    ); 
    ?>

Por defecto, estas solicitudes son procesadas asincrónicamente mientras
se utilizan diferentes callbacks

Ejemplo:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'View Post', 
        array( 'controller' => 'posts', 'action' => 'post', 1 ), 
        array( 'update' => 'post', 'complete' => 'alert( "Hello World" )'  )
    ); 
    ?>

Para usa procesamiento sincrónico especificar
``$options['type'] = 'synchronous'``.

Para automatizar que el layout utilizado sea ajax incluir el componente
*RequestHandler* en el controlador

Por defecto el contenido del elemento es reemplazado. Para cambiar este
comportamiento especificar ``$options['position']``

Ejemplo:

::

    <div id="post">
    </div>
    <?php echo $ajax->link( 
        'View Post', 
        array( 'controller' => 'posts', 'action' => 'view', 1), 
        array( 'update' => 'post', 'position' => 'top'  )
    ); 
    ?>

``$confirm`` puede ser usado para llamar un JavaScript confirm() message
antes de que la petición se efectúe. Permite al usuario prever la
ejecución.

Ejemplo:

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

Esta funcion crea el codigo JavaScript necesario para hacer una llamada
remota. Es usado principalmente como un helper(ayudante) para los
enlaces(link). Esto no se utiliza muy a menudo a menos que usted
necesite generar algunos codigos personalizados.

The ``$options`` for this function are the same as for the ``link``
method

Example:

::

    <div id="post">
    </div>
    <script type="text/javascript">
    <?php echo $ajax->remoteFunction( 
        array( 
            'url' => array( 'controller' => 'posts', 'action' => 'view', 1 ), 
            'update' => 'post' 
        ) 
    ); ?>
    </script>

It can also be assigned to HTML Event Attributes:

::

    <?php 
        $remoteFunction = $ajax->remoteFunction( 
            array( 
            'url' => array( 'controller' => 'posts', 'action' => 'view', 1 ),
            'update' => 'post' ) 
        ); 
    ?>
    <div id="post" onmouseover="<?php echo $remoteFunction; ?>" >
    Mouse Over This
    </div>

If ``$options['update']`` is not passed, the browser will ignore the
server response.

remoteTimer
-----------

``remoteTimer(array $options)``

Periodically calls the action at ``$options['url']``, every
``$options['frequency']`` seconds. Usually used to update a specific div
(specified by ``$options['update']``) with the result of the remote
call. Callbacks can be used.

``remoteTimer`` is the same as the ``remoteFunction`` except for the
extra ``$options['frequency']``

Example:

::

    <div id="post">
    </div>
    <?php
    echo $ajax->remoteTimer(
        array(
        'url' => array( 'controller' => 'posts', 'action' => 'view', 1 ),
        'update' => 'post', 'complete' => 'alert( "request completed" )',
        'position' => 'bottom', 'frequency' => 5
        )
    );
    ?>

The default ``$options['frequency']`` is 10 seconds

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

``submit(string $title, array $options)``

Returns a submit button that submits the form to ``$options['url']`` and
updates the div specified in ``$options['update']``

::

    <div id='testdiv'>
    <?php
    echo $form->create('User');
    echo $form->input('email');
    echo $form->input('name');
    echo $ajax->submit('Submit', array('url'=> array('controller'=>'users', 'action'=>'add'), 'update' => 'testdiv'));
    echo $form->end();
    ?>
    </div>

Use the ``$ajax->submit()`` method if you want form validation to work
properly. i.e. You want the messages you specify in your validation
rules to show up correctly.

observeField
------------

``observeField(string $fieldId, array $options)``

Observa el campo con el id DOM especificado por $field\_id (cada
$options['frequency'] segundos ) y realiza un XMLHttpRequest si su
contenido ha cambiado.

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

``observeField`` utiliza las mismas opciones que ``link``

El campo a enviar puede ser asignado utilizando ``$options['with']``.
Por defecto este contiene ``Form.Element.serialize('$fieldId')``. Los
datos enviados están disponibles en ``$this->data`` de tu controlador.
Los Callbacks pueden ser utilizados con esta función.

Para enviar un formulario completo cuando el contenido cambie utilice
``$options['with'] = Form.serialize( $('Form ID') )``

observeForm
-----------

``observeForm(string $form_id, array $options)``

Similar to observeField(), but operates on an entire form identified by
the DOM id $form\_id. The supplied $options are the same as
observeField(), except the default value of the $options['with'] option
evaluates to the serialized (request string) value of the form.

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

Allows you to check if the current request is a Prototype Ajax request
inside a view. Returns a boolean. Can be used for presentational logic
to show/hide blocks of content.

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
