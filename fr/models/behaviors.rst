Behaviors
#########

Les comportements (behaviors) de Modèle sont une manière d'organiser certaines 
des fonctionnalités définies dans les modèles CakePHP. Ils nous permettent de 
séparer la logique qui ne doit pas être directement reliée à un modèle, mais 
qui nécessite d'être là. En offrant une simple, mais puissante, manière 
d'étendre les modèles, les comportements nous permettent d'attacher des 
fonctionnalités aux modèles en définissant une simple variable de classe. 
C'est comme çà que les comportements permettent de débarrasser les modèles de 
tout le "sur-poids" qui ne devrait pas faire partie du contrat métier qu'ils 
modèlent ou de ce qui est aussi nécessité par différents modèles et qui peut 
alors être extrapolé.

Par exemple, considérez un modèle qui nous donne accès à une table qui stocke 
des informations sur la structure d'un arbre hiérarchique. Supprimer, ajouter 
ou déplacer les nœuds dans l'arbre n'est pas aussi simple que d'effacer, 
d'insérer ou d'éditer les lignes d'une table. De nombreux enregistrements 
peuvent nécessiter une mise à jour suite au déplacement des éléments. Plutôt 
que de créer ces méthodes de manipulation d'arbre une fois par modèle de base 
(pour chaque modèle nécessitant cette fonctionnalité), nous pourrions 
simplement dire à notre modèle d'utiliser le Comportement Tree (TreeBehavior) 
ou, en des termes plus formels, nous dirions à notre modèle de se comporter 
comme un Arbre. On appelle cela attacher un comportement à un modèle. Avec 
une seule ligne de code, notre modèle CakePHP disposera d'un nouvel ensemble 
complet de méthodes lui permettant d'interagir avec la structure sous-jacente.

CakePHP contient déjà des comportements pour les structures en arbre, les 
contenus traduits, les interactions par liste de contrôle d'accès, sans 
oublier les comportements des contributeurs de la communauté déjà disponibles 
dans la Boulangerie (Bakery) CakePHP 
(`http://bakery.cakephp.org <http://bakery.cakephp.org>`_). Dans cette 
section nous couvrirons le schéma d'usage classique pour ajouter des 
comportements aux modèles, l'utilisation des comportements intégrés à 
CakePHP et la manière de créer nos propres comportements. 

Au final, les Behaviors sont 
`Mixins <http://en.wikipedia.org/wiki/Mixin>`_ avec les callbacks.

Utiliser les Behaviors
======================

Les Behaviors sont attachés aux modèles grâce à la variable ``$actsAs`` 
des classes modèle::

    <?php
    class Category extends AppModel {
        public $name   = 'Category';
        public $actsAs = array('Tree');
    }

Cette exemple montre comme un modèle Catégory pourrait être gérer dans 
une structure en arbre en utilisant le comportement Tree. Une fois 
qu'un comportement a été spécifié, utilisez les méthodes qu'il ajoute 
comme si elles avaient toujours existé et fait partie du modèle original::

    <?php
    // Définir ID
    $this->Category->id = 42;

    // Utiliser la méthode children() du behavior:
    $kids = $this->Category->children();

Quelques behaviors peuvent nécessiter ou permettre des réglages quand 
ils sont attachés au modèle. Ici, nous indiquons à notre behavior 
Tree les noms des champs "left" et "right" de la table sous-jacente::

    <?php
    class Category extends AppModel {
        public $name   = 'Category';
        public $actsAs = array('Tree' => array(
            'left'  => 'left_node',
            'right' => 'right_node'
        ));
    }

Nous pouvons aussi attacher plusieurs behaviors à un modèle. Il n'y 
aucune raison pour que, par exemple, notre modèle Category se comporte 
seulement comme un arbre, il pourrait aussi supporter l'internationalisation::

    <?php
    class Category extends AppModel {
        public $name   = 'Category';
        public $actsAs = array(
            'Tree' => array(
              'left'  => 'left_node',
              'right' => 'right_node'
            ),
            'Translate'
        );
    }

Jusqu'à présent, nous avons ajouter les comportements aux modèles en utilisant 
une variable de classe. Cela signifie que nos comportements seront attachés 
à nos modèles de tout au long de leur durée vie. Pourtant, nous pourrions 
avoir besoin de "détacher" les comportements des modèles à l'exécution. 
Considérons que dans notre précédent modèle Catégorie, lequel agit comme un 
modèle Tree et Translate, nous ayons besoin pour quelque raison de le forcer 
à ne plus agir comme un modèle Translate:: 

    <?php
    // Détache un behavior de notre modèle :
    $this->Category->Behaviors->unload('Translate');

Cela fera que notre modèle Categorie arrêtera dorénavant de se comporter 
comme un modèle Translate. Nous pourrions avoir besoin, sinon, de désactiver 
simplement le comportement Translate pour qu'il n'agisse pas sur les 
opérations normales de notre modèle : nos finds, nos saves, etc. En fait, 
nous cherchons à désactiver le comportement qui agit sur nos callbacks de 
modèle CakePHP. Au lieu de détacher le comportement, nous allons dire à notre 
modèle d'arrêter d'informer ses callbacks du comportement Translate:: 

    <?php
    // Empêcher le behavior de manipuler nos callbacks de modèle
    $this->Category->Behaviors->disable('Translate');

Nous pourrions également avoir besoin de chercher si notre comportement 
manipule ces callbacks de modèle et si ce n'est pas le cas, alors de 
restaurer sa capacité à réagir avec eux::

    <?php
    // Si notre comportement ne manipule pas nos callbacks de modèle
    if (!$this->Category->Behaviors->enabled('Translate')) {
        // Disons lui de le faire maintenant !
        $this->Category->Behaviors->enable('Translate');
    }

De la même manière que nous pouvons détacher complètement un behavior 
d'un modèle à l'exécution, nous pouvons aussi attacher de nouveaux 
comportements. Disons que notre modèle familier Category nécessite de 
se comporter comme un modèle de Noël, mais seulement le jour de Noël::

    <?php
    // Si nous sommes le 25 déc
    if (date('m/d') == '12/25') {
        // Notre modèle nécessite de se comporter comme un modèle de Noël
        $this->Category->Behaviors->load('Christmas');
    }

Nous pouvons aussi utiliser la méthode attach pour réécrire les réglages 
du comportement::

    <?php
    // Nous changerons un réglage de notre comportement déjà attaché
    $this->Category->Behaviors->load('Tree', array('left' => 'new_left_node'));

Il y a aussi une méthode pour obtenir la liste des comportements qui sont 
attachés à un modèle. Si nous passons le nom d'un comportement à une méthode, 
elle nous dira si ce comportement est attaché au modèle, sinon elle nous 
donnera la liste des comportements attachés::

    <?php
    // Si le comportement Translate n'est pas attaché
    if (!$this->Category->Behaviors->attached('Translate')) {
        // Obtenir la liste de tous les comportements qui sont attachés au modèle
        $behaviors = $this->Category->Behaviors->attached();
    }

Créer des Behaviors
===================

Les behaviors qui sont attachés aux Modèles voient leurs callbacks appelés 
automatiquement. Ces callbacks sont similaires à ceux qu'on trouve dans les 
Modèles : ``beforeFind``, ``afterFind``, ``beforeSave``, ``afterSave``, 
``beforeDelete``, ``afterDelete`` et ``onError``. Voir 
:doc:`/models/callback-methods`.

Vos behaviors devront être placés dans ``app/Model/Behavior``. Ils sont 
nommés en CamelCase et suffixé par ``Behavior``, par ex. NomBehavior.php.
Il est utile d'utiliser un behavior du coeur comme template quand on crée 
son propre behavior. Vous les trouverez dans ``lib/Cake/Model/Behavior/``.

Chaque callback prend comme premier paramètre, une référence du modèle par 
lequel il est appelé.

En plus de l'implémentation des callbacks, vous pouvez ajouter des réglages 
par comportement et/ou par liaison d'un comportement au modèle. Des 
informations à propos des réglages spécifiques peuvent être trouvées dans 
les chapitres concernant les comportements du cœur et leur configuration.

Voici un exemple rapide qui illustre comment les réglages peuvent êtres passés 
du modèle au comportement::

    <?php
    class Post extends AppModel {
        public $name = 'Post'
        public $actsAs = array(
            'YourBehavior' => array(
                'option1_key' => 'option1_valeur'
            )
        );
    }

Puisque les behaviors sont partagés à travers toutes les instances de modèle 
qui l'utilisent, une bonne pratique pour stocker les paramètres par nom 
d'alias/modèle qui utilise le behavior. La création des behaviors entraînera 
l'appel de leur méthode ``setup()``::

    <?php
    public function setup(Model $Model, $settings = array()) {
        if (!isset($this->settings[$Model->alias])) {
            $this->settings[$Model->alias] = array(
                'option1_key' => 'option1_default_value',
                'option2_key' => 'option2_default_value',
                'option3_key' => 'option3_default_value',
            );
        }
        $this->settings[$Model->alias] = array_merge(
            $this->settings[$Model->alias], (array)$settings);
    }

Créer les méthodes du behavior
==============================

Les méthodes du Behavior sont automatiquement disponibles sur tout modèle 
qui 'act as' le behavior. Par exemple si vous avez::

    <?php
    class Duck extends AppModel {
        public $name = 'Duck';
        public $actsAs = array('Flying');
    }

Vous seriez capable d'appeler les méthodes de ``FlyingBehavior`` comme si 
elles étaient des méthodes du modèle Duck. Quand on créer des méthodes d'un 
behavior, vous obtenez automatiquement une référence du modèle appelé en 
premier paramètre. Tous les autres paramètres fournis sont shifté one 
place to the right. Par exemple::

    <?php
    $this->Duck->fly('toronto', 'montreal');

Bien que cette méthode prenne deux paramètres, la méthode signature 
ressemblerait à cela::

    <?php
    public function fly(Model $Model, $from, $to) {
        // Faire quelque chose à la volée.
    }

Gardez à l'esprit que les méthodes appelées dans un fashion ``$this->doIt()`` 
à partir de l'intérieur d'une méthode d'un behavior n'obtiendra pas le 
paramètre $model automatiquement annexé.

Méthodes mappées
----------------

En plus de fournir des méthodes 'mixin', les behaviors peuvent aussi fournir 
des méthodes d'appariemment de formes (pattern matching). Les Behaviors peuvent 
aussi définir des méthodes mappées. Les méthodes mappées utilisent les 
pattern matching for method invocation. Cela vous permet de créer des méthodes 
du type ``Model::findAllByXXX`` sur vos behaviors. Les méthodes mappées ont 
besoin d'être déclarées dans votre tableau ``$mapMethods`` de behaviors. La 
signature de la méthode pour une méthode mappée est légèrement différente de 
celle d'une méthode mixin normal d'un behavior::

    <?php
    class MyBehavior extends ModelBehavior {
        public $mapMethods = array('/do(\w+)/' => 'faireQuelqueChose');

        public function doSomething($model, $method, $arg1, $arg2) {
            debug(func_get_args());
            //do something
        }
    }

Ce qui est au-dessus mappera chaque méthode ``doXXX()`` appélé vers le 
behavior. Comme vous pouvez le voir, le modèle est toujours le premier 
paramètre, mais le nom de la méthode appelée sera le deuxième paramètre. 
Cela vous permet de munge le nom de la méthode pour des informations 
supplémentaires, un peu comme ``Model::findAllByXX``. Si le behavior 
du dessus est attaché à un modèle, ce qui suit arrivera::

    <?php
    $model->doReleaseTheHounds('homer', 'lenny');

    // sortira
    'ReleaseTheHounds', 'homer', 'lenny'

Callbacks du Behavior
=====================

Les Behaviors d'un Modèle peuvent définir un nombre de callbacks qui sont 
déclenchés before/after les callbacks du modèle du même nom. Les callbacks 
du Behavior vous permettent de capturer des évènements dans les modèles 
attachés et d'augmenter les paramètres ou accoler dans un beahvior 
supplémentaire.

Les callbacks disponibles sont:

-  ``beforeValidate`` est lancé avant beforeValidate du modèle
-  ``beforeFind`` est lancé avant beforeFind du modèle
-  ``afterFind`` est lancé avant afterFind du modèle
-  ``beforeSave`` est lancé avant beforeSave du modèle
-  ``afterSave`` est lancé avant afterSave du modèle
-  ``beforeDelete`` est lancé après beforeDelete du modèle
-  ``afterDelete`` est lancé avant afterDelete du modèle

Créer un callback du behavior
-----------------------------

.. php:class:: ModelBehavior

Les callbacks d'un behavior d'un modèle sont définis comme de simples méthodes 
dans votre classe de behavior. Un peu comme les méthodes classiques du 
behavior, ils reçoivent un paramètre ``$Model`` en premier argument. Ce 
paramètre est le modèle pour lequel la méthode du behavior a été invoquée.

.. php:method:: setup(Model $Model, array $settings = array())

    Appelé quand un behavior est attaché à un modèle. Les paramètres viennent 
    de la propriété ``$actsAs`` du modèle attaché.

.. php:method:: cleanup(Model $Model)

    Appelé quand un behavior est détaché d'un modèle. La méthode de base retire 
    les paramètres du modèle basées sur ``$model->alias``. Vous pouvez écraser 
    cette méthode et fournir une fonctionnalité personnalisée nettoyée.

.. php:method:: beforeFind(Model $Model, array $query)

    If a behavior's beforeFind return's false it will abort the find().
    Returning an array will augment the query parameters used for the
    find operation.

.. php:method:: afterFind(Model $Model, mixed $results, boolean $primary)

    Vous pouvez utiliser le afterFind pour augmenter les résultats d'un find. 
    La valeur retournée sera passée en résultats soit au behavior suivant dans 
    la chaîne, soit au afterFind du modèle.

.. php:method:: beforeDelete(Model $Model, boolean $cascade = true)

    Vous pouvez retourner false d'un beforeDelete d'un behavior pour annuler 
    la suppression. Retourne true pour autoriser la suite.

.. php:method:: afterDelete(Model $Model)

    Vous pouvez utiliser afterDelete pour effectuer des opérations de nettoyage 
    liées à votre behavior.

.. php:method:: beforeSave(Model $Model)

    Vous pouvez retourner false d'un beforeSave d'un behavior pour annuler 
    la sauvegarde. Retourner true pour permettre de continuer.

.. php:method:: afterSave(Model $Model, boolean $created)

    Vous pouvez utiliser afterSave pour effectuer des opérations de nettoyage 
    liées au behavior. $created sera à true quand un enregistrement sera crée, 
    et à false quand un enregistrement sera mis à jour.

.. php:method:: beforeValidate(Model $Model)

    Vous pouvez utiliser beforeValidate pour modifier un tableau de validation 
    de modèle ou gérer tout autrre logique de pré-validation. Retourner false 
    d'un callback beforeValidate annulera la validation et entraînera son echec.



.. meta::
    :title lang=fr: Behaviors (Comportements)
    :keywords lang=fr: tree manipulation,manipulation methods,model behaviors,access control list,model class,tree structures,php class,business contract,class category,database table,bakery,inheritance,functionality,interaction,logic,cakephp,models,essence
