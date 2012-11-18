Sesión
######

Como contraparte natural al Componente Session, el Helper Session
refleja la mayoría de las funcionalidades de los componentes y las hace
disponible a las vistas. El Helper de Sesión se agrega automáticamente a
tu vista, no es necesario agregarlo en el arreglo ``$helpers`` en el
controlador.

La mayor diferencia entre el Helper y el Componente de Sesión es que el
Helper *no* puede escribir en la sesión.

Al igual que en el Componente de Sesión, los datos son escritos y leídos
usando estructuras de arreglos separadas por puntos.

::

        array('User' => 
                array('username' => 'super@ejemplo.com')
        );

Dada la estructura de arreglo previa, el nodo sería accesado por
``User.username``, con el punto indicando el arreglo enlazado. Esta
notación es usada por todos los métodos del Helper de Sesión siempre que
se utilice ``$key``.

Methods
=======

read($key)

Read from the Session. Returns a string or array depending on the
contents of the session.

id()

Returns the current session ID.

check($key)

Check to see if a key is in the Session. Returns a boolean on the key's
existence.

flash($key)

This will return the contents of the $\_SESSION.Message. It is used in
conjunction with the Session Component's setFlash() method.

error()

Returns the last error in the session if one exists.

flash
=====

The flash method uses the default key set by ``setFlash()``. You can
also retrieve specific keys in the session. For example, the Auth
component sets all of its Session messages under the 'auth' key

::

    // Controller code
    $this->Session->setFlash('My Message');

    // In view
    echo $this->Session->flash();
    // outputs "<div id='flashMessage' class='message'>My Message</div>"

    // output the AuthComponent Session message, if set.
    echo $this->Session->flash('auth');

Using Flash for Success and Failure
-----------------------------------

In some web sites, particularly administration backoffice web
applications it is often expected that the result of an operation
requested by the user has associated feedback as to whether the
operation succeeded or not. This is a classic usage for the flash
mechanism since we only want to show the user the result once and not
keep the message.

One way to achieve this is to use Session->flash() with the layout
parameter. With the layout parameter we can be in control of the
resultant html for the message.

In the controller you might typically have code:

::

    if ($user_was_deleted) {
        $this->Session->setFlash('The user was deleted successfully.', 'flash_success');
    } else {
        $this->Session->setFlash('The user could not be deleted.', 'flash_failure');
    }

The flash\_success and flash\_failure parameter represents an element
file to place in the root app/views/elements folder, e.g.
app/views/elements/flash\_success.ctp,
app/views/elements/flash\_failure.ctp

Inside the flash\_success element file would be something like this:

::

    <div class="flash flash_success">
        <?php echo $message ?>
    </div>

The final step is in your main view file where the result is to be
displayed to add simply

::

    <?php echo $this->Session->flash(); ?>

And of course you can then add to your CSS a selector for div.flash,
div.flash\_success and div.flash\_failure
