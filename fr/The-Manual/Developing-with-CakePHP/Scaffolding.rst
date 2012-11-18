Scaffolding
###########

Une application *scaffolding* (échafaudage en Français) est une
technique permettant au développeur de définir et créer une application
qui peut construire, afficher, modifier et détruire facilement des
objets. Le *Scaffolding* dans CakePHP permet également aux développeurs
de définir comment les objets sont liés entre eux, et de créer ou casser
ces liens.

Pour créer un *scaffold*, vous n'avez besoin que d'un modèle et de son
contrôleur. Déclarez la variable ``$scaffold`` dans le contrôleur, et
l'application est déjà prête à tourner !

Le *scaffolding* par CakePHP est vraiment bien imaginé. Il vous permet
de mettre en place une application basique CRUD (Création, Vue, Edition
et Destruction) en quelques minutes. Il est si bien fait que vous aurez
envie de l'utiliser dans toutes vos applications. Attention ! Nous
pensons aussi que le *scaffolding* est utile, mais veuillez réaliser que
ce n'est... qu'un échaufaudage ! C'est une structure très simple à
mettre en oeuvre, et il vaut mieux ne l'utiliser qu'au début d'un
projet. Il n'a pas été conçu pour être flexible, mais uniquement pour
être un moyen temporaire de mettre en place votre application. A partir
du moment où vous voudrez adapter les fonctions et les vues associées,
il vous faudra désactiver le *scaffolding* et écrire votre propre code.
La console CakePHP bake, que vous pourrez apprendre à connaître dans la
prochaine section, est une bonne alternative : il va générer tout le
code équivalent à ce que ferait le *scaffolding*.

Le *Scaffolding* est à utiliser au tout début du développement d'une
application Internet. Le schéma de votre base de données est encore
susceptible de changer, ce qui est tout à faire normal à ce stade du
processus de création. Ca a un inconvénient : un développeur déteste
créer des formulaires dont il ne verra jamais l'utilisation réelle.
C'est pour réduire le stress du développeur que le *Scaffolding* a été
introduit dans CakePHP. Il analyse les tables de votre base et crée de
façon simple une liste des enregistrements, avec les boutons d'ajout, de
suppression et de modification, des formulaires pour l'édition et une
vue pour afficher un enregistrement en particulier.

Pour ajouter le *Scaffolding* dans votre application, ajoutez la
variable ``$scaffold`` dans votre contrôleur :

::

    <?php

    class CategoriesController extends AppController {
        var $scaffold;
    }

    ?>

En supposant que vous avez bien crée un modèle Category dans le bon
dossier (/app/models/category.php), vous pouvez aller sur
http://example.com/categories pour voir votre nouveau *scaffold*.

Créer des méthodes dans un contrôleur contenant la variable
``$scaffold`` peut donner des résultats inattendus. Par exemple, si vous
créez une méthode index() dans ce contrôleur, votre méthode remplacera
celle rendue normalement par la fonctionnalité de *scaffold*

Le *Scaffolding* prend bien en compte les relations contenues dans votre
modèle. Ainsi, si votre modèle Category a une relation BelongsTo avec le
modèle Utilisateur, vous verrez les identifiants des utilisateurs dans
l'affichage de vos catégories. Si vous préférez voir autre chose en plus
des identifiants (par exemple les prénoms des utilisateurs), vous pouvez
affecter la variable ``$displayField`` dans le modèle.

Voyons comme définir la variable ``$displayField`` dans la classe des
utilisateurs, afin que le prénom soit montré en lieu et place de
l'unique identifiant. Cette astuce permet de rendre le *scaffolding*
plus lisible dans de nombreux cas.

::

    <?php

    class Utilisateur extends AppModel {
        var $name = 'Utilisateur';
        var $displayField = 'prenom';
    }

    ?>

Créer une interface d'administration simple avec le scaffolding
===============================================================

Si vous avez activé le routage admin dans votre app/config/core.php,
avec ``Configure::write('Routing.prefixes', array('admin'));`` vous
pouvez utiliser le *scaffolding* (échafaudage) pour générer une
interface d'administration.

Une fois que vous avez activé le routage admin, assignez votre préfixe
d'administration à la variable de *scaffolding*.

::

    var $scaffold = 'admin';

Vous serez maintenant capable d'accéder aux actions *scaffoldées* :

::

    http://example.com/admin/controleur/index
    http://example.com/admin/controleur/view
    http://example.com/admin/controleur/edit
    http://example.com/admin/controleur/add
    http://example.com/admin/controleur/delete

C'est une méthode facile pour créer rapidement une interface
d'administration simple. Gardez à l'esprit que vous ne pouvez pas avoir
de méthodes de *scaffolding* à la fois dans la partie admin et dans la
partie non-admin en même temps. Comme avec le *scaffolding* normal, vous
pouvez surcharger les méthodes individuelles et les remplacer par vos
propres méthodes.

::

    function admin_view($id = null) {
      //code personnalisé ici
    }

Une fois que vous avez remplacé une action de *scaffolding*, vous devrez
créer une vue pour cette action.

Modifier les vues obtenues par le Scaffolding
=============================================

Si vous désirez un rendu un peu différent de vos vues obtenues par le
Scaffolding, vous pouvez créer des mises en pages personnalisées. Nous
continuons de vous recommander de ne pas utiliser cette technique pour
produire vos sites, mais pouvoir modifier les vues peut être utile pour
leur développement.

La personnalisation peut être obtenue en créant des *templates*.

::

    Les vues de scaffolding personnalisées pour un contrôleur spécifique (MessagesController dans cet exemple) doivent être agencées comme ceci :

    /app/views/messages/scaffold.index.ctp
    /app/views/messages/scaffold.show.ctp
    /app/views/messages/scaffold.edit.ctp
    /app/views/messages/scaffold.new.ctp

    Les vues de scaffolding personnalisées pour tous les contrôleurs doivent être agencées comme ceci :

    /app/views/scaffolds/index.ctp
    /app/views/scaffolds/show.ctp
    /app/views/scaffolds/edit.ctp
    /app/views/scaffolds/new.ctp
    /app/views/scaffolds/add.ctp

