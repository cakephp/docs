SessionHelper
#############

.. php:class:: SessionHelper(View $view, array $settings = array())

Équivalent du component Session, le helper Session offre la majorité des 
fonctionnalités du component et les rend disponible dans votre vue. 
Le Helper session est automatiquement ajouté à la vue, il n'est pas nécessaire 
de l'ajouter à la variable tableau ``$helpers`` dans votre controller.

La grande différence entre le Component Session et le Helper Session 
est que ce dernier *ne* peut pas écrire dans la session.

Comme pour le Component Session, les données sont écrites et lues en 
utilisant des structures de tableaux avec des :term:`dot notation`, 
comme ci-dessous::

    array('User' => 
        array('username' => 'super@example.com')
    );

Étant donné ce tableau, le nœud sera accessible par ``User.username``, 
le point indiquant le tableau imbriqué. Cette notation est utilisée pour 
toutes les méthodes de l'assistant Session où une variable ``$key`` est 
utilisée.

.. php:method:: read(string $key)

    :rtype: mixed

    Lire à partir de la Session. Retourne une chaîne de caractère ou un 
    tableau dépendant des contenus de la session.

.. php:method:: check(string $key)

    :rtype: boolean

    Vérifie si une clé est dans la Session. Retourne un boléen sur 
    l'existence d'un clé.

.. php:method:: error()

    :rtype: string

    Retourne la dernière erreur encourue dans une session.

.. php:method:: valid()

    :rtype: boolean

    Utilisé pour vérifier si une session est valide dans une vue.

Affichage de notifications ou de messages flash
===============================================

.. php:method:: flash(string $key = 'flash', array $params = array())

    :rtype: string

    Comme expliqué dans :ref:`creating-notification-messages` vous pouvez 
    créer des notifications uniques pour le le feedback. Après avoir 
    créé les messages avec :php:meth:`SessionComponent::setFlash()`, vous 
    voudrez les afficher. Une fois que le message est affiché, il sera 
    retiré et ne s'affichera plus::

        echo $this->Session->flash();

    Ce qui est au-dessus sortira un message simple, avec le html suivant:

    .. code-block:: html

        <div id="flashMessage" class="message">
            Vos trucs on été sauvegardés.
        </div>

    Comme pour la méthode du component, vous pouvez définir des propriétés 
    supplémentaires et personnaliser quel élément est utilisé. Dans le 
    controller, vous pouvez avoir du code comme::

        // dans un controller
        $this->Session->setFlash('Le user n'a pu être supprimé.');

    Quand le message sort, vous pouvez choisir l'élément utilisé pour afficher 
    ce message::

        // dans un layout.
        echo $this->Session->flash('flash', array('element' => 'failure'));

    Ceci utilise ``View/Elements/failure.ctp`` pour rendre le message. Le 
    message texte serait disponible dans ``$message`` dans l'élément.

    A l'intérieur du fichier élément d'echec, il y aurait quelque chose comme 
    ceci:

    .. code-block:: php

        <div class="flash flash-failure">
            <?php echo $message ?>
        </div>

    Vous pouvez aussi passer des paramètres supplémentaires dans la méthode 
    ``flash()``, ce qui vous permet de générer des messages personnalisés::

        // Dans le controller
        $this->Session->setFlash('Thanks for your payment %s');

        // Dans le layout.
        echo $this->Session->flash('flash', array(
            'params' => array('name' => $user['User']['name'])
            'element' => 'payment'
        ));
        
        // View/Elements/payment.ctp
        <div class="flash payment">
            <?php printf($message, h($name)); ?>
        </div>


.. meta::
    :title lang=fr: SessionHelper
    :description lang=fr: Équivalent du component Session, le helper Session offre la majorité des fonctionnalités du component et les rend disponible dans votre vue.
    :keywords lang=fr: session helper,flash messages,session flash,session read,session check
