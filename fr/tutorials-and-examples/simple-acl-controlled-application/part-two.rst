Application Simple contrôlée par Acl - partie 2
###############################################

Un outil automatique pour la création des ACOs
==============================================

Comme mentionné avant, il n'y a pas de façon pré-construite d'insérer tous vos
controllers et actions dans Acl. Cependant, nous détestons tous faire des
choses répétitives comme faire ce qui pourrait être des centaines d'actions
dans une grande application.

Pour cela, il existe un plugin disponible très branché sur GitHub, appelé
`AclExtras <https://github.com/markstory/acl_extras/>`_ qui peut être
téléchargé sur
`La page de Téléchargements de Github <https://github.com/markstory/acl_extras/zipball/master>`_.
Nous allons décrire brièvement la façon dont on l'utilise pour générer
tous nos ACOs.

Premièrement prenez une copie du plugin et dézipper le ou dupliquer le en
utilisant git dans `app/Plugin/AclExtras`. Ensuite, activez le plugin dans
votre fichier `app/Config/boostrap.php` comme montré ci-dessus::

    //app/Config/boostrap.php
    // ...
    CakePlugin::load('AclExtras');

Enfin exécutez la commande suivante dans la console de CakePHP::


    ./Console/cake AclExtras.AclExtras aco_sync

Vous pouvez récupérer un guide complet pour toutes les commandes disponibles
comme ceci::

    ./Console/cake AclExtras.AclExtras -h
    ./Console/cake AclExtras.AclExtras aco_sync -h

Une fois remplie, votre table `acos` permet de créer les permissions de votre
application.

Configurer les permissions
==========================

Pour créer les permissions, à l'image de la création des ACOs, il n'y a pas de
solution magique et je n'en fournirai pas non plus. Pour autoriser des AROs à
accéder à des ACOs depuis l'interface en ligne de commande, utilisez
AclShell : Pour plus d'informations sur la façon de l'utiliser, consultez
l'aide de AclShell que l'on peut avoir en lançant::

    ./Console/cake acl --help

Note: \* a besoin d'être mis entre quotes ('\*')

Pour donner des autorisations avec ``AclComponent``, nous utiliserons la
syntaxe de code suivante dans une méthode personnalisée::

    $this->Acl->allow($aroAlias, $acoAlias);

Nous allons maintenant ajouter un peu d'autorisations/interdictions.
Ajoutez ce qui suit à une fonction temporaire dans votre
``UsersController`` et visitez l'adresse dans votre navigateur pour
les lancer (par ex: http://localhost/cake/app/users/initdb). Si vous
faîtes un ``SELECT * FROM aros_acos``, vous devriez voir une pile
entière de 1 et -1. Une fois que vous avez confirmé, vos permissions sont
configurées, retirez la fonction::


    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('initDB'); // Nous pouvons supprimer cette ligne après avoir fini
    }

    public function initDB() {
        $group = $this->User->Group;
        // Autorise l'accès à tout pour les admins
        $group->id = 1;
        $this->Acl->allow($group, 'controllers');

        // Autorise l'accès aux posts et widgets pour les managers
        $group->id = 2;
        $this->Acl->deny($group, 'controllers');
        $this->Acl->allow($group, 'controllers/Posts');
        $this->Acl->allow($group, 'controllers/Widgets');

        // Autorise l'accès aux actions add et edit des posts widgets pour les utilisateurs de ce groupe
        $group->id = 3;
        $this->Acl->deny($group, 'controllers');
        $this->Acl->allow($group, 'controllers/Posts/add');
        $this->Acl->allow($group, 'controllers/Posts/edit');
        $this->Acl->allow($group, 'controllers/Widgets/add');
        $this->Acl->allow($group, 'controllers/Widgets/edit');

        // Permet aux utilisateurs classiques de se déconnecter
        $this->Acl->allow($group, 'controllers/users/logout');

        // Nous ajoutons un exit pour éviter d'avoir un message d'erreur affreux "missing views" (manque une vue)
        echo "tout est ok";
        exit;
    }

Nous avons maintenant configurer quelques règles basiques. Nous avons autorisé
les administrateurs pour tout. Les Manageurs peuvent accéder à tout dans
posts et widgets. Alors que les users peuvent accéder aux add et
edit des posts & widgets.

Nous devions avoir une référence d'un model de ``Group`` et modifier son id
pour être capable de spécifier l'ARO que nous voulons, cela est dû à la façon
dont fonctionne ``AclBehavior``. ``AclBehavior`` ne configure pas le champ
alias dans la table ``aros`` donc nous devons utiliser une référence d'objet
ou un tableau pour référencer l'ARO que l'on souhaite.

Vous avez peut-être remarqué que j'ai délibérement oublié index et view
des permissions Acl. Nous allons faire des actions publiques index et view
dans ``PostsController`` et ``WidgetsController``. Cela donne aux users
non-autorisés l'autorisation de voir ces pages, en rendant ces pages publiques.
Cependant, à tout moment, vous pouvez retirer ces actions des
``AuthComponent::allowedActions`` et les permissions pour view et
edit seront les mêmes que celles dans Acl.

Maitenant, nous voulons enlever les références de ``Auth->allowedActions``
dans les controllers de vos users et groups. Ensuite ajouter ce qui
suit aux controllers de vos posts et widgets::

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('index', 'view');
    }

Cela enlève le "basculement à off" que nous avions mis plus tôt dans les
controllers users et groups et cela rend public l'accès aux
actions index et voir dans les controllers Posts et Widgets. Dans
``AppController::beforeFilter()`` ajoutez ce qui suit::

     $this->Auth->allow('display');

Ce qui rend l'action 'display' publique. Cela rendra notre action
PagesController::display() publique. Ceci est important car le plus souvent
le routage par défaut désigne cette action comme page d'accueil de votre
application.

Connexion
=========

Notre application est désormais sous contrôle d'accès, et toute tentative
d'accès à des pages non publiques vous redirigera vers la page de connexion.
Cependant, vous devrez créer une vue login avant que quelqu'un puisse se
connecter. Ajoutez ce qui suit à ``app/View/Users/login.ctp`` si vous
ne l'avez pas déjà fait:

.. code-block:: php

    <h2>Connexion</h2>
    <?php
    echo $this->Form->create('User', array('url' => array('controller' => 'users', 'action' => 'login')));
    echo $this->Form->input('User.nom_user');
    echo $this->Form->input('User.mot_de_passe');
    echo $this->Form->end('Connexion');
    ?>

Si l'user est déjà connecté, on le redirige en ajoutant ceci au
controller UsersController::

    public function login() {
        if ($this->Session->read('Auth.User')) {
            $this->Session->setFlash('Vous êtes connecté!');
            return $this->redirect('/');
        }
    }

Vous devriez être maintenant capable de vous connecter et tout devrait
fonctionner auto-maigiquement. Quand l'accès est refusé, les messages
de Auth seront affichés si vous ajoutez le code
``echo $this->Session->flash('auth')``.

Déconnexion
===========

Abordons maintenant la déconnexion. Nous avions plus tôt laissé cette fonction
vide, il est maintenant temps de la remplir. Dans
``UsersController::logout()`` ajoutez ce qui suit::

    $this->Session->setFlash('Au-revoir');
    return $this->redirect($this->Auth->logout());

Cela définit un message flash en Session et déconnecte l'User en
utilisant la méthode logout de Auth. La méthode logout de Auth supprime tout
simplement la clé d'authentification en session et retourne une URL qui peut
être utilisée dans une redirection. Si il y a d'autres données en sessions
qui doivent être également effacées, ajoutez le code ici.

C'est fini!
===========

Vous devriez maintenant avoir une application contrôlée par Auth et Acl. Les
permissions Users sont définies au niveau du groupe, mais on peut
également les définir en même temps par user. Vous pouvez également
définir les permissions sur une base globale ou par controller et par action.
De plus, vous avez un bloc de code réutilisable pour étendre facilement vos
tables ACO lorsque votre application grandit.


.. meta::
    :title lang=fr: Application Simple contrôlée par Acl - partie 2
    :keywords lang=fr: interface en ligne de commande,solution magique,aco,dézippé,config,sync,syntaxe,cakephp,php,lancement,acl
