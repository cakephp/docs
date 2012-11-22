Sessions
########

.. php:class:: SessionComponent(ComponentCollection $collection, array $settings = array())

Le composant session de CakePHP fournit le moyen de faire persister 
les données client entre les pages requêtées. Il agit comme une 
interface pour $_SESSION et offre aussi des méthodes pratiques 
pour de nombreuses fonctions relatives à $_SESSION.

Les sessions peuvent être paramétrées de différentes façon dans CalePHP.
Pour plus d'information, vous devriez lire la documentation
:doc:`Session configuration </development/sessions>`

Interagir avec les données de Session
======================================

Le composant Session est utilisé pour interagir avec les 
informations de session. Il inclut les fonctions CRUD 
basiques, mais aussi des fonctionnalités pour créer des 
messages de feedback aux utilisateurs.

Il est important de noter que ces structures en tableaux peuvent 
être créées dans la session en utilisant la notation avec un point. 
Par exemple, Utilisateur.identifiant se référera au tableau suivant :: 

    array('User' => 
        array('username' => 'clark-kent@dailyplanet.com')
    );

Les points sont utilisés pour indiquer les tableaux imbriqués. 
Cette notation est utilisée pour toutes les méthodes du composant 
Session dans lesquelles un nom/clef est utilisé.

.. php:method:: write($name, $value)

    Écrit dans la Session, en mettant $value dans $name. 
    $name peut-être un tableau séparé par un point. Par exemple ::

        $this->Session->write('Personne.couleurYeux', 'Vert');

    Cela écrit la valeur 'Vert' dans la session sous Personne => couleurYeux.
    
.. php:method:: read($name)

    Retourne la valeur de $name dans la session. Si $name vaut 
    null, la session entière sera retournée. Par ex ::
    
        $vert = $this->Session->read('Personne.couleurYeux');

    Récupère la valeur "vert" dans la session. La lecture de donnée
    inexistante retournera null.

.. php:method:: check($name)

    Utilisé pour vérifier qu'une variable de Session a été créée. 
    Retourne vrai (true) si la variable existe et faux (false)
    dans le cas contraire.

.. php:method:: delete($name)

    Supprime les données de Session de $name. Par ex 

        $this->Session->delete('Personne.couleurYeux');

    Notre donnée de session n'a plus la valeur 'Vert' ni même l'index
    couleurYeux attribué. Cependant, le modèle Personne est toujours 
    dans la Session. Pour supprimer de la session toutes les 
    informations de Personne, utilisez ::

        $this->Session->delete('Personne');

.. php:method:: destroy()

    La méthode destroy supprimera le cookie de session et toutes 
    les données de session stockées dans le fichier temporaire 
    du système. Cela va détruire la session PHP et ainsi en créer
    une nouvelle.::
    
        $this->Session->destroy();

.. _creating-notification-messages:

Création de messages de notification
====================================

.. php:method:: setFlash(string $message, string $element = 'default', array $params = array(), string $key = 'flash')

    :rtype: void

    Souvent dans les applications web , vous aurez besoin d'afficher des 
    messages de notification instantanés à l'utilisateur après avoir 
    terminer un processus ou une réception de donnée.
    Dans CakePHP, ceci est appelé "messages flash". Vous pouvez définir des 
    messages flash avec le composant Session et les afficher avec
    le helper session :php:meth:`SessionHelper::flash()`. Pour définir un 
    message, utiliser ``setFlash``::

        // Dans le contrôleur.
        $this->Session->setFlash('Votre travail a été sauvegardé !');

    Ceci créera un message instantané qui peut être affiché à l'utilisateur,
    en utilisant le Helper Session SessionHelper::

        // Dans la vue.
        echo $this->Session->flash();

        // Ce qui générera en sortie.
        <div id="flashMessage" class="message">
            Votre travail a été sauvegardé !
        </div>

    Vous pouvez utiliser des paramètres additionnels de ``setFlash()`` pour
    créer différente sortes de messages flash. Par exemple, les erreurs
    et les notifications positives peuvent avoir des apparences différentes.
    CakePHP vous donnes un moyen de le faire.
    En utilisant le paramètre ``$key`` vous pouvez stocker différents messages,
    qui peuvent être séparément récupérer en sortie.::

        // définit le message que ca va mal
        $this->Session->setFlash('Ca va mal.', 'default', array(), 'mal');

        // définit le message que ca va bien
        $this->Session->setFlash('Ca va bien', 'default', array(), 'bien');

    Dans la vue, ces messages peuvent être ressortis et stylisés différemment::
       
        // dans la vue.
        echo $this->Session->flash('bien');
        echo $this->Session->flash('mal');

    Le paramètre ``$element`` vous permet de contrôler quel élément
    (localisé dans ``/app/View/Elements``) devra être utilisé pour
    rendre le message. Dans l'élément le message est disponible en 
    tant que ``$message``.
    D'abord nous paramétrons le flash dans notre contrôleur::

        $this->Session->setFlash('truc customisés', 'flash_custom');

    alors nous créons le fichier ``app/View/Elements/flash_custom.ctp`` et
    créons notre élément flash customisé::
    
        <div id="myCustomFlash"><?php echo $message; ?></div>

    ``$params`` vous permet de passer des variables de vue additionnelles
    au layout de rendu. Les paramètres peuvent être passés en affectant 
    la div de rendu, par exemple en ajoutant "class" dans le tableau
    $params ca appliquera une classe à la div de sortie en utilisant
    ``$this->Session->flash()`` dans votre layout ou vue.::

        $this->Session->setFlash('Message Exemple', 'default', array('class' => 'classe_exemple'));

    La sortie en utilisant ``$this->Session->flash()`` avec l'exemple ci
    dessus sera::
    
        <div id="flashMessage" class="classe_exemple">Message Exemple</div>

    Pour utiliser un élément depuis un plugin spécifiez le plugin
    dans le ``$params``::
    
        // Utilisera  /app/Plugin/Comment/View/Elements/flash_no_spam.ctp
        $this->Session->setFlash('Message!', 'flash_no_spam', array('plugin' => 'Comment'));


.. meta::
    :title lang=fr: Sessions
    :keywords lang=fr: php array,dailyplanet com,configuration documentation,dot notation,feedback messages,reading data,session data,page requests,clark kent,dots,existence,sessions,convenience,cakephp
