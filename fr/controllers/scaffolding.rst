Scaffolding
###########

.. deprecated:: 2.5
    Le scaffolding dynamique sera retiré et remplacé dans 3.0

Une application scaffolding (échafaudage en Français) est une technique
permettant au développeur de définir et créer une application qui peut
construire, afficher, modifier et détruire facilement des objets.
Le Scaffolding dans CakePHP permet également aux développeurs de définir
comment les objets sont liés entre eux, et de créer ou casser ces liens.

Pour créer un scaffold, vous n'avez besoin que d'un model et de son
controller. Déclarez la variable $scaffold dans le controller, et l'application
est déjà prête à tourner !

Le scaffolding par CakePHP est vraiment bien imaginé.
Il vous permet de mettre en place une application basique CRUD
(Création, Vue, Edition et Destruction) en quelques minutes.
Il est si bien fait que vous aurez envie de l'utiliser dans toutes
vos applications.
Attention ! Nous pensons aussi que le scaffolding est utile,
mais veuillez réaliser que ce n'est... qu'un échafaudage !
C'est une structure très simple à mettre en oeuvre, et il vaut mieux
ne l'utiliser qu'au début d'un projet. Il n'a pas été conçu pour être
flexible, mais uniquement pour être un moyen temporaire de mettre en place
votre application. A partir du moment où vous voudrez adapter les fonctions
et les vues associées, il vous faudra désactiver le scaffolding et écrire
votre propre code. :doc:`bake console </console-and-shells>` de CakePHP, que
vous pourrez apprendre à connaître dans la prochaine section, est une bonne
alternative : il va générer tout le code équivalent à ce que ferait le
scaffolding.

Le Scaffolding est à utiliser au tout début du développement
d'une application Internet. Le schéma de votre base de données
est encore susceptible de changer, ce qui est tout à faire normal à ce
stade du processus de création. Ceci a un inconvénient : un développeur déteste
créer des formulaires dont il ne verra jamais l'utilisation réelle. C'est pour
réduire le stress du développeur que le Scaffolding a été introduit dans
CakePHP. Il analyse les tables de votre base et crée de façon simple une liste
des enregistrements, avec les boutons d'ajout, de suppression et de
modification, des formulaires pour l'édition et une vue pour afficher un
enregistrement en particulier.

Pour ajouter le Scaffolding dans votre application, ajoutez la variable
``$scaffold`` dans votre controller::

    class CategoriesController extends AppController {
        public $scaffold;
    }

En supposant que vous avez bien crée un model Category dans le bon
dossier (``app/Model/Category.php``), vous pouvez aller sur
http://exemple.com/categories pour voir votre nouveau scaffold.

.. note::

    Créer des méthodes dans un controller contenant la variable
    $scaffold peut donner des résultats inattendus. Par exemple,
    si vous créez une méthode ``index()`` dans ce controller, votre
    méthode remplacera celle rendue normalement par la fonctionnalité
    de scaffold

Le Scaffolding prend bien en compte les relations contenues dans votre
model. Ainsi, si votre model Category a une relation ``belongsTo`` avec
le model User, vous verrez les identifiants des users dans
l'affichage de vos catégories. Puisque scaffolding connaît les associations
entre models, vous ne verrez pas d'enregistrements liés dans les vues via
scaffold jusqu'à ce que vous ajoutiez manuellement un code d'association
au model. Par exemple, si le model Group ``hasMany`` User et que
User ``belongsTo`` Group, vous devrez ajouter manuellement le code suivant
dans vos models User et Group. Avant de faire cela, la vue affiche un select
vide pour le Group dans le Nouveau formulaire User; after – populated avec les
IDs ou noms à partir de la table du Group dans le Nouveau formulaire User::

    // Dans Group.php
    public $hasMany = 'User';
    // Dans User.php
    public $belongsTo = 'Group';

Si vous préférez voir autre chose en plus des identifiants
(par exemple les prénoms des users), vous pouvez
affecter la variable ``$displayField`` dans le model.
Voyons comment définir la variable ``$displayField`` dans la classe des users,
afin que le prénom soit montré en lieu et place de l'unique identifiant.
Cette astuce permet de rendre le scaffolding plus lisible dans de nombreux cas::

    class User extends AppModel {
        public $displayField = 'first_name';
    }


Créer une interface admin simplifiée avec scaffolding
=====================================================

Si vous avez activé le routage admin dans votre ``app/Config/core.php``,
avec ``Configure::write('Routing.prefixes', array('admin'));``, vous pouvez
utiliser le scaffolding (échafaudage) pour générer une interface
d'administration.

Une fois que vous avez activé le routage admin, assignez votre préfixe
d'administration à la variable de scaffolding::

    public $scaffold = 'admin';

Vous serez maintenant capable d'accéder aux actions scaffoldées::

    http://example.com/admin/controller/index
    http://example.com/admin/controller/view
    http://example.com/admin/controller/edit
    http://example.com/admin/controller/add
    http://example.com/admin/controller/delete

C'est une méthode facile pour créer rapidement une interface
d'administration simple. Gardez à l'esprit que vous ne pouvez pas
avoir de méthodes de scaffolding à la fois dans la partie admin et
dans la partie non-admin en même temps. Comme avec le scaffolding normal,
vous pouvez surcharger les méthodes individuelles et les remplacer par
vos propres méthodes::

    public function admin_view($id = null) {
      // du code ici
    }

Une fois que vous avez remplacé une action de scaffolding,
vous devrez créer une vue pour cette action.

Personnaliser les vues obtenues par le Scaffolding
==================================================

Si vous désirez un rendu un peu différent de vos vues obtenues
par le Scaffolding, vous pouvez créer des mises en pages personnalisées.
Nous continuons de vous recommander de ne pas utiliser cette technique pour
produire vos sites, mais pouvoir modifier les vues peut être utile pour
leur développement.

La personnalisation des vues scaffoldées pour un controller spécifique
(PostsController dans notre exemple) doit être placée comme ceci::

    app/View/Posts/scaffold.index.ctp
    app/View/Posts/scaffold.form.ctp
    app/View/Posts/scaffold.view.ctp

Les vues scaffoldées personnalisées pour tous les controllers doivent être
placées comme ceci::

    app/View/Scaffolds/index.ctp
    app/View/Scaffolds/form.ctp
    app/View/Scaffolds/view.ctp


.. meta::
    :title lang=fr: Scaffolding
    :keywords lang=fr: schémas base de données,perte de structure,scaffolding,scaffold,classe php,base de données tables,développeur web,downside,application web,logique,developpeurs,cakephp,running,current,suppression,base de données application
