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

Si vous avez défini ``Session.start`` à false dans votre
config/core.php, vous avez besoin d'appeler ``$session->activate();``
dans votre vue ou gabarit, avant de pouvoir utiliser toute autre méthode
de l'assistant Session. Exactement comme vous avez besoin d'appeler
``$this->Session->activate();`` dans votre contrôleur pour activer le
composant Session.

Méthodes
========

read($key)

Lire depuis la Session. Retourne une chaîne ou un tableau, en fonction
du contenu de la session.

id()

Retourne l'ID de session courant.

check($key)

Vérifie si une clé est dans la Session. Retourne un booléen basé sur
l'existence de la clé.

flash($key)

Ceci affichera le contenu de $\_SESSION.Message. C'est utilisé en
conjonction avec la méthode setFlash() du composant Session.

error()

Retourne la dernière erreur en session s'il en existe une.

flash
=====

La méthode flash utilise la clé par défaut définie par ``setFlash()``.
Vous pouvez aussi récupérer des clés spécifiques dans la session. Par
exemple, le composant Auth définit tous ses messages de Session sous la
clé 'auth'

::

    // Code du contrôleur
    $this->Session->setFlash('Mon Message');

    // Dans la vue
    $session->flash();
    // affiche "<div id='flashMessage' class='message'>Mon Message</div>"

    // affiche le message Session du Composant Auth, si défini.
    $session->flash('auth');

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

The flash\_success and flash\_failure parameter represents a layout file
to place in the root app/elements folder, e.g.
app/elements/flash\_success.ctp, app/elements/flash\_failure.ctp

Inside the flash\_success layout file would be something like this:

::

        echo "<div class=\"flash flash_success\">{$content_for_layout}</div>";

The final step is in your main view file where the result is to be
displayed to add simply

::

    <?php $session->flash(); ?>

And of course you can then add to your CSS a selector for div.flash,
div.flash\_success and div.flash\_failure
