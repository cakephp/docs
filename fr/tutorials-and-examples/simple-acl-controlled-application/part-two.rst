Application Simple contrôlé par Acl - partie 2
##############################################

Un outil automatique pour la création des ACOs
==============================================

Comme mentionné avant, il n'y a pas de façon pré-construite d'insérer tous vos 
contrôleurs et actions dans Acl. Cependant, nous détestons tous faire des 
choses répétitives comme faire ce qui pourrait être des centaines d'actions 
dans une grande application.

Pour cela, il existe un plugin disponible très branché sur github, appelé 
`AclExtras <https://github.com/markstory/acl_extras/tree/2.0>`_ qui peut être 
téléchargé sur 
`La page de Téléchargements de Github <https://github.com/markstory/acl_extras/zipball/2.0>`_.
Nous allons décrire brièvement la façon dont on l'utilise pour générer 
tous nos ACOs.

Premièrement prenez une copie du plugin et dézipper le ou dupliquer le en 
utilisant git dans `app/Plugin/AclExtras`. Ensuite, activez le plugin dans 
votre fichier `app/Config/boostrap.php` comme montré ci-dessus::

    <?php
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

    <?php
    $this->Acl->allow($aroAlias, $acoAlias);

Nous allons maintenant ajouter un peu d'autorisations/interdictions. 
Ajoutez ce qui suit à une fonction temporaire dans votre 
``UsersController`` et visitez l'adresse dans votre navigateur pour 
les lancer (par ex: http://localhost/cake/app/users/initdb). Si vous 
faîtes un ``SELECT * FROM aros_acos``, vous devriez voir une pile 
entière de 1 et -1. Une fois que vous avez confirmé, vos permissions sont 
configurées, retirez la fonction::

    <?php

    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('initDB'); // Nous pouvons supprimer cette ligne après avoir fini
    }

    public function initDB() {
        $group = $this->Utilisateur->Group;
        //Allow admins to everything
        $group->id = 1;
        $this->Acl->allow($group, 'controllers');

        //allow managers to posts and widgets
        $group->id = 2;
        $this->Acl->deny($group, 'controllers');
        $this->Acl->allow($group, 'controllers/Posts');
        $this->Acl->allow($group, 'controllers/Widgets');

        //allow users to only add and edit on posts and widgets
        $group->id = 3;
        $this->Acl->deny($group, 'controllers');
        $this->Acl->allow($group, 'controllers/Posts/add');
        $this->Acl->allow($group, 'controllers/Posts/edit');
        $this->Acl->allow($group, 'controllers/Widgets/add');
        $this->Acl->allow($group, 'controllers/Widgets/edit');
        //nous ajoutons un exit pour éviter d'avoir un message d'erreur affreux "missing views" (manque une vue)
        echo "tout est ok";
        exit;
    }

Nous avons maintenant configurer quelques règles basiques. Nous avons autorisé 
les administrateurs pour tout. Les Manageurs peuvent accéder à tout dans 
posts et widgets. Alors que les utilisateurs peuvent accéder aux add et 
edit des posts & widgets.

Nous devions avoir une référence d'un modèle de ``Group`` et modifier son id 
pour être capable de spécifier l'ARO que nous voulons, cela est dû à la façon 
dont fonctionne ``AclBehavior``. ``AclBehavior`` ne configure pas le champ 
alias dans la table ``aros`` donc nous devons utiliser une référence d'objet 
ou un tableau pour référencer l'ARO que l'on souhaite.

Vous avez peut-être remarqué que j'ai délibérement oublié index et view 
des permissions Acl. Nous allons faire des actions publiques index et view 
dans ``PostsController`` et ``WidgetsController``. Cela donne aux utilisateurs 
non-autorisés l'autorisation de voir ces pages, en rendant ces pages publiques.
Cependant, à tout moment, vous pouvez retirer ces actions des
``AuthComponent::allowedActions`` et les permissions pour view et 
edit seront les mêmes que celles dans Acl.

Maitenant, nous voulons enlever les références de ``Auth->allowedActions``
dans les contrôleurs de vos utilisateurs et groupes. Ensuite ajouter ce qui 
suit aux contrôleurs de vos posts et widgets::

    <?php
    public function beforeFilter() {
        parent::beforeFilter();
        $this->Auth->allow('index', 'view');
    }

Cela enlève le "basculement à off" que nous avions mis plus tôt dans les 
contrôleurs utilisateurs et groupes et cela rend public l'accès aux 
actions index et voir dans les contrôleurs Posts et Widgets. Dans 
``AppController::beforeFilter()`` ajoutez ce qui suit::

    <?php
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
ne l'avez pas déjà fait::

    <h2>Connexion</h2>
    <?php
    echo $this->Form->create('Utilisateur', array('url' => array('controller' => 'utilisateurs', 'action' => 'login')));
    echo $this->Form->input('Utilisateur.nom_utilisateur');
    echo $this->Form->input('Utilisateur.mot_de_passe');
    echo $this->Form->end('Connexion');
    ?>

Si l'utilisateur est déjà connecté, on le redirige en ajoutant ceci au 
contrôleur UtilisateursController::

    <?php
    public function login() {
        if ($this->Session->read('Auth.Utilisateur')) {
            $this->Session->setFlash('Vous êtes connecté!');
            $this->redirect('/', null, false);
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
``UsersController::logout()`` ajoutez ce qui suit ::

    <?php
    $this->Session->setFlash('Au-revoir');
    $this->redirect($this->Auth->logout());

Cela définit un message flash en Session et déconnecte l'Utilisateur en 
utilisant la méthode logout de Auth. La méthode logout de Auth supprime tout 
simplement la clé d'authentification en session et retourne une url qui peut 
être utilisée dans une redirection. Si il y a d'autres données en sessions 
qui doivent être également effacées, ajoutez le code ici.

C'est fini!
===========

Vous devriez maintenant avoir une application contrôlée par Auth et Acl. Les 
permissions Utilisateurs sont définies au niveau du groupe, mais on peut 
également les définir en même temps par utilisateur. Vous pouvez également 
définir les permissions sur une base globale ou par contrôleur et par action. 
De plus, vous avez un bloc de code réutilisable pour étendre facilement vos 
tables ACO lorsque votre application grandit.


.. meta::
    :title lang=fr: Application Simple contrôlé par Acl - partie 2
    :keywords lang=fr: interface en ligne de commande,solution magique,aco,dézippé,config,sync,syntaxe,cakephp,php,lancement,acl