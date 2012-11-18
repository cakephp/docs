Session
#######

Équivalent du composant Session, l'assistant Session offre la majorité
des fonctionnalités du composant et les rend disponible dans votre vue.
L'assistant session est automatiquement ajouté à la vue, il n'est pas
nécessaire de l'ajouter à la variable tableau ``$helpers`` dans le
contrôleur.

La grande différence entre le composant Session et l'assistant Session
est que ce dernier ne peut *pas* écrire dans la session.

Comme pour le composant Session, les données sont écrites et lues en
utilisant des tableaux, comme ci-dessous :

::

        array('Utilisateur' => 
                array('pseudo' => 'super@exemple.com')
        );

Étant donné ce tableau, le nœud sera accessible par Utilisateur.pseudo,
le point indiquant le tableau imbriqué. Cette notation est utilisée pour
toutes les méthodes de l'assistant Session où une variable $key est
utilisée.

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
