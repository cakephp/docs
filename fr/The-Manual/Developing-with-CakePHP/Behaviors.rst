Comportements
#############

Les comportements (*behaviors*) de Modèle sont une manière d'organiser
certaines des fonctionnalités définies dans les modèles CakePHP. Ils
nous permettent de séparer la logique qui ne doit pas être directement
reliée à un modèle, mais qui nécessite d'être là. En offrant une simple,
mais puissante, manière d'étendre les modèles, les comportements nous
permettent d'attacher des fonctionnalités aux modèles en définissant une
simple variable de classe. C'est comme çà que les comportements
permettent de débarrasser les modèles de tout le "sur-poids" qui ne
devrait pas faire partie du contrat métier qu'ils modèlent ou de ce qui
est aussi nécessité par différents modèles et qui peut alors être
extrapolé.

Par exemple, considérez un modèle qui nous donne accès à une table qui
stocke des informations sur la structure d'un arbre hiérarchique.
Supprimer, ajouter ou déplacer les nœuds dans l'arbre n'est pas aussi
simple que d'effacer, d'insérer ou d'éditer les lignes d'une table. De
nombreux enregistrements peuvent nécessiter une mise à jour suite au
déplacement des éléments. Plutôt que de créer ces méthodes de
manipulation d'arbre une fois par modèle de base (pour chaque modèle
nécessitant cette fonctionnalité), nous pourrions simplement dire à
notre modèle d'utiliser le Comportement Tree (*TreeBehavior*) ou, en des
termes plus formels, nous dirions à notre modèle de se comporter comme
un Arbre. On appelle cela attacher un comportement à un modèle. Avec une
seule ligne de code, notre modèle CakePHP disposera d'un nouvel ensemble
complet de méthodes lui permettant d'interagir avec la structure
sous-jacente.

CakePHP contient déjà des comportements pour les structures en arbre,
les contenus traduits, les interactions par liste de contrôle d'accès,
sans oublier les comportements des contributeurs de la communauté déjà
disponibles dans la Boulangerie (*Bakery*) CakePHP
(https://bakery.cakephp.org). Dans cette section nous couvrirons le
schéma d'usage classique pour ajouter des comportements aux modèles,
l'utilisation des comportements intégrés à CakePHP et la manière de
créer nos propres comportements.

Utiliser les Comportements
==========================

Les Comportements sont attachés aux modèles grâce à la variable $actsAs
des classes modèle :

::

    <?php
    class Categorie extends AppModel {
        var $name   = 'Categorie';
        var $actsAs = array('Tree');
    }

    ?>

Cette exemple montre comme un modèle Catégorie pourrait être gérer dans
une structure en arbre en utilisant le comportement Tree. Une fois qu'un
comportement a été spécifié, utilisez les méthodes qu'il ajoute comme si
elles avaient toujours existé et fait partie du modèle original :

::

    // Définir ID
    $this->Categorie->id = 42;

    // Utiliser la méthode children() du comportement :
    $enfants = $this->Categorie->children();

Quelques comportements peuvent nécessiter ou permettre des réglages
quand ils sont attachés au modèle. Ici, nous indiquons à notre
comportement Tree les noms des champs "left" et "right" de la table
sous-jacente :

::

    <?php

    class Categorie extends AppModel {
        var $name   = 'Categorie';
        var $actsAs = array('Tree' => array(
            'left'  => 'noeud_gauche',
            'right' => 'noeud_droit'
        ));
    }

    ?>

Nous pouvons aussi attacher plusieurs comportements à un modèle. Il n'y
aucune raison pour que, par exemple, notre modèle Categorie se comporte
seulement comme un arbre, il pourrait aussi supporter
l'internationalisation :

::

    <?php

    class Categorie extends AppModel {
        var $name   = 'Categorie';
        var $actsAs = array(
            'Tree' => array(
              'left'  => 'noeud_gauche',
              'right' => 'noeud_droit'
            ),
            'Translate'
        );
    }

    ?>

Jusqu'à présent, nous avons ajouter les comportements aux modèles en
utilisant une variable de classe. Cela signifie que nos comportements
seront attachés à nos modèles de tout au long de leur durée vie.
Pourtant, nous pourrions avoir besoin de "détacher" les comportements
des modèles à l'exécution. Considérons que dans notre précédent modèle
Catégorie, lequel agit comme un modèle Tree et Translate, nous ayons
besoin pour quelque raison de le forcer à ne plus agir comme un modèle
Translate :

::

    // Détache un comportement de notre modèle :
    $this->Categorie->Behaviors->detach('Translate');

Cela fera que notre modèle Categorie arrêtera dorénavant de se comporter
comme un modèle Translate. Nous pourrions avoir besoin, sinon, de
désactiver simplement le comportement Translate pour qu'il n'agisse pas
sur les opérations normales de notre modèle : nos *finds*, nos *saves*,
etc. En fait, nous cherchons à désactiver le comportement qui agit sur
nos callbacks de modèle CakePHP. Au lieu de détacher le comportement,
nous allons dire à notre modèle d'arrêter d'informer ses callbacks du
comportement Translate :

::

    // Empêcher le comportement de manipuler nos callbacks de modèle
    $this->Categorie->Behaviors->disable('Translate');

Nous pourrions également avoir besoin de chercher si notre comportement
manipule ces callbacks de modèle et si ce n'est pas le cas, alors de
restaurer sa capacité à réagir avec eux :

::

    // Si notre comportement ne manipule pas nos callbacks de modèle
    if (!$this->Categorie->Behaviors->enabled('Translate')) {
        // Disons lui de le faire maintenant !
        $this->Category->Behaviors->enable('Translate');
    }

De la même manière que nous pouvons détacher complètement un
comportement d'un modèle à l'exécution, nous pouvons aussi attacher de
nouveaux comportements. Disons que notre modèle familier Categorie
nécessite de se comporter comme un modèle de Noël, mais seulement le
jour de Noël :

::

    // Si nous sommes le 25 déc
    if (date('m/d') == '12/25') {
        // Notre modèle nécessite de se comporter comme un modèle de Noël
        $this->Category->Behaviors->attach('Christmas');
    }

Nous pouvons aussi utiliser la méthode attach pour réécrire les réglages
du comportement :

::

    // Nous changerons un réglage de notre comportement déjà attaché
    $this->Categorie->Behaviors->attach('Tree', array('left' => 'nouveau_noeud_gauche'));

Il y a aussi une méthode pour obtenir la liste des comportements qui
sont attachés à un modèle. Si nous passons le nom d'un comportement à
une méthode, elle nous dira si ce comportement est attaché au modèle,
sinon elle nous donnera la liste des comportements attachés :

::

    // Si le comportement Translate n'est pas attaché
    if (!$this->Categorie->Behaviors->attached('Translate')) {
        // Obtenir la liste de tous les comportements qui sont attachés au modèle
        $comportements = $this->Categorie->Behaviors->attached();
    }

Créer des Comportements
=======================

Les Comportements qui sont attachés aux Modèles voient leurs *callbacks*
appelés automatiquement. Ces *callbacks* sont similaires à ceux qu'on
trouve dans les Modèles : beforeFind, afterFind, beforeSave, afterSave,
beforeDelete, afterDelete et onError. Voir `Méthodes de
Callback </fr/view/1048/Callback-Methods>`_.

C'est souvent pratique d'utiliser un comportement du cœur comme modèle
pour créer les vôtres. Vous les trouverez dans
``cake/libs/models/behaviors/``.

Chaque *callback* prend comme premier paramètre, une référence du modèle
par lequel il est appelé.

En plus de l'implémentation des *callbacks*, vous pouvez ajouter des
réglages par comportement et/ou par liaison d'un comportement au modèle.
Des informations à propos des réglages spécifiques peuvent être trouvées
dans les chapitres concernant les comportements du cœur et leur
configuration.

Voici un exemple rapide qui illustre comment les réglages peuvent êtres
passés du modèle au comportement :

::

    class Post extends AppModel {
        var $name = 'Post'
        var $actsAs = array(
            'VotreComportement' => array(
            'cle_option1' => 'valeur_option1'
            )
        );
    }

Depuis la version 1.2.8004, CakePHP ajoute ces réglages une seule fois
par modèle/alias. Pour que vos comportements restent évolutifs, vous
devriez respecter les alias (ou les modèles).

Une fonction de mise à jour facile, *setup*, devrait ressembler à
quelque chose comme ça :

::

    function setup(&$model, $settings) {
        if (!isset($this->settings[$model->alias])) {
        $this->settings[$model->alias] = array(
            'cle_option1' => 'valeur_defaut_option1',
            'cle_option2' => 'valeur_defaut_option2',
            'cle_option3' => 'valeur_defaut_option3',
        );
    }
    $this->settings[$Model->alias] = array_merge(
    $this->settings[$Model->alias], (array)$settings);
    }

Creating behavior methods
=========================

Behavior methods are automatically available on any model acting as the
behavior. For example if you had:

::

    class Duck extends AppModel {
        var $name = 'Duck';
        var $actsAs = array('Flying');
    }

You would be able to call FlyingBehavior methods as if they were methods
on your Duck model. When creating behavior methods you automatically get
passed a reference of the calling model as the first parameter. All
other supplied parameters are shifted one place to the right. For
example

::

    $this->Duck->fly('toronto', 'montreal');

Although this method takes two parameters, the method signature should
look like:

::

    function fly(&$Model, $from, $to) {
        // Do some flying.
    }

Keep in mind that methods called in a ``$this->doIt()`` fashion from
inside a behavior method will not get the $model parameter automatically
appended.

Behavior callbacks
==================

Model Behaviors can define a number of callbacks that are triggered
before/after the model callbacks of the same name. Behavior callbacks
allow your behaviors to capture events in attached models and augment
the parameters or splice in additional behavior.

The available callbacks are:

-  ``beforeValidate`` is fired before a model's beforeValidate
-  ``beforeFind`` is fired before a model's beforeFind
-  ``afterFind`` is fired before a model's afterFind
-  ``beforeSave`` is fired before a model's beforeSave
-  ``afterSave`` is fired before a model's afterSave
-  ``beforeDelete`` is fired after a model's beforeDelete
-  ``afterDelete`` is fired before a model's afterDelete

Creating a behavior callback
============================

Model behavior callbacks are defined as simple methods in your behavior
class. Much like regular behavior methods, they receive a ``$Model``
parameter as the first argument. This parameter is the model that the
behavior method was invoked on.

function beforeFind(&$model, $query)

If a behavior's beforeFind returns false it will abort the find().
Returning an array will augment the query parameters used for the find
operation.

afterFind(&$model, $results, $primary)

You can use the afterFind to augment the results of a find. The return
value will be passed on as the results to either the next behavior in
the chain or the model's afterFind.

beforeDelete(&$model, $cascade = true)

You can return false from a behavior's beforeDelete to abort the delete.
Return true to allow it continue.

afterDelete(&$model)

You can use afterDelete to perform clean up operations related to your
behavior.

beforeSave(&$model)

You can return false from a behavior's beforeSave to abort the save.
Return true to allow it continue.

afterSave(&$model, $created)

You can use afterSave to perform clean up operations related to your
behavior. $created will be true when a record is created, and false when
a record is updated.

beforeValidate(&$model)

You can use beforeValidate to modify a model's validate array or handle
any other pre-validation logic. Returning false from a beforeValidate
callback will abort the validation and cause it to fail.
