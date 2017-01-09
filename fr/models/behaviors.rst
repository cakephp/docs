Behaviors (Comportements)
#########################

Les behaviors (comportements) de Model sont une manière d'organiser certaines
des fonctionnalités définies dans les models CakePHP. Ils nous permettent de
séparer la logique qui ne doit pas être directement reliée à un model, mais
qui nécessite d'être là. En offrant une simple, mais puissante, manière
d'étendre les models, les behaviors nous permettent d'attacher des
fonctionnalités aux models en définissant une simple variable de classe.
C'est comme cela que les behaviors permettent de débarrasser les models de
tout le "sur-poids" qui ne devrait pas faire partie du contrat métier qu'ils
modèlent ou de ce qui est aussi nécessité par différents models et qui peut
alors être extrapolé.

Par exemple, considérez un model qui nous donne accès à une table qui stocke
des informations sur la structure d'un arbre hiérarchique. Supprimer, ajouter
ou déplacer les nœuds dans l'arbre n'est pas aussi simple que d'effacer,
d'insérer ou d'éditer les lignes d'une table. De nombreux enregistrements
peuvent nécessiter une mise à jour suite au déplacement des éléments. Plutôt
que de créer ces méthodes de manipulation d'arbre une fois par model de base
(pour chaque model nécessitant cette fonctionnalité), nous pourrions
simplement dire à notre model d'utiliser le behavior :php:class:`TreeBehavior`
ou, en des termes plus formels, nous dirions à notre model de se comporter
comme un Arbre. On appelle cela attacher un behavior à un model. Avec
une seule ligne de code, notre model CakePHP disposera d'un nouvel ensemble
complet de méthodes lui permettant d'interagir avec la structure sous-jacente.

CakePHP contient déjà des behaviors pour les structures en arbre, les
contenus traduits, les interactions par liste de contrôle d'accès, sans
oublier les behaviors des contributeurs de la communauté déjà disponibles
dans la Boulangerie (Bakery) CakePHP
(`https://bakery.cakephp.org <https://bakery.cakephp.org>`_). Dans cette
section nous couvrirons le schéma d'usage classique pour ajouter des
behaviors aux models, l'utilisation des behaviors intégrés à
CakePHP et la manière de créer nos propres behaviors.

Au final, les Behaviors sont
`Mixins <https://en.wikipedia.org/wiki/Mixin>`_ avec les callbacks.

Il y a un certain nombre de Behaviors inclus dans CakePHP. Pour en savoir
plus sur chacun, référencez-vous aux chapitres ci-dessous:

.. include:: /core-libraries/toc-behaviors.rst
    :start-line: 10

Utiliser les Behaviors
======================

Les Behaviors sont attachés aux models grâce à la variable ``$actsAs``
des classes model::

    class Category extends AppModel {
        public $actsAs = array('Tree');
    }

Cette exemple montre comme un model Category pourrait être gérer dans
une structure en arbre en utilisant le behavior Tree. Une fois
qu'un behavior a été spécifié, utilisez les méthodes qu'il ajoute
comme si elles avaient toujours existé et fait partie du model original::

    // Définir ID
    $this->Category->id = 42;

    // Utiliser la méthode children() du behavior:
    $kids = $this->Category->children();

Quelques behaviors peuvent nécessiter ou permettre des réglages quand
ils sont attachés au model. Ici, nous indiquons à notre behavior
Tree les noms des champs "left" et "right" de la table sous-jacente::

    class Category extends AppModel {
        public $actsAs = array('Tree' => array(
            'left'  => 'left_node',
            'right' => 'right_node'
        ));
    }

Nous pouvons aussi attacher plusieurs behaviors à un model. Il n'y
aucune raison pour que, par exemple, notre model Category se comporte
seulement comme un arbre, il pourrait aussi supporter l'internationalisation::

    class Category extends AppModel {
        public $actsAs = array(
            'Tree' => array(
              'left'  => 'left_node',
              'right' => 'right_node'
            ),
            'Translate'
        );
    }

Jusqu'à présent, nous avons ajouter les behaviors aux models en utilisant
une variable de classe. Cela signifie que nos behaviors seront attachés
à nos models tout au long de leur durée vie. Pourtant, nous pourrions
avoir besoin de "détacher" les behaviors des models à l'exécution.
Considérons que dans notre précédent model Category, lequel agit comme un
model Tree et Translate, nous ayons besoin pour quelque raison de le forcer
à ne plus agir comme un model Translate::

    // Détache un behavior de notre model :
    $this->Category->Behaviors->unload('Translate');

Cela fera que notre model Category arrêtera dorénavant de se comporter
comme un model Translate. Nous pourrions avoir besoin, sinon, de désactiver
simplement le behavior Translate pour qu'il n'agisse pas sur les
opérations normales de notre model : nos finds, nos saves, etc. En fait,
nous cherchons à désactiver le behavior qui agit sur nos callbacks de
model CakePHP. Au lieu de détacher le behavior, nous allons dire à notre
model d'arrêter d'informer ses callbacks du behavior Translate::

    // Empêcher le behavior de manipuler nos callbacks de model
    $this->Category->Behaviors->disable('Translate');

Nous pourrions également avoir besoin de chercher si notre behavior
manipule ces callbacks de model et si ce n'est pas le cas, alors de
restaurer sa capacité à réagir avec eux::

    // Si notre behavior ne manipule pas nos callbacks de model
    if (!$this->Category->Behaviors->enabled('Translate')) {
        // Disons lui de le faire maintenant !
        $this->Category->Behaviors->enable('Translate');
    }

De la même manière que nous pouvons détacher complètement un behavior
d'un model à l'exécution, nous pouvons aussi attacher de nouveaux
behaviors. Disons que notre model familier Category nécessite de
se comporter comme un model Christmas, mais seulement le jour de Noël::

    // Si nous sommes le 25 déc
    if (date('m/d') === '12/25') {
        // Notre model nécessite de se comporter comme un model Christmas
        $this->Category->Behaviors->load('Christmas');
    }

Nous pouvons aussi utiliser la méthode attach pour surcharger les réglages
du behavior::

    // Nous changerons un réglage de notre behavior déjà attaché
    $this->Category->Behaviors->load('Tree', array('left' => 'new_left_node'));

Et en utilisant des alias, nous pouvons personnaliser l'alias avec lequel il
sera chargé, lui permettant aussi d'être chargé plusieurs fois avec différentes
configurations::

    // Le behavior sera disponible en tant que 'MyTree'
    $this->Category->Behaviors->load('MyTree', array('className' => 'Tree'));

Il y a aussi une méthode pour obtenir la liste des behaviors qui sont
attachés à un model. Si nous passons le nom d'un behavior à une méthode,
elle nous dira si ce behavior est attaché au model, sinon elle nous
donnera la liste des behaviors attachés::

    // Si le behavior Translate n'est pas attaché
    if (!$this->Category->Behaviors->attached('Translate')) {
        // Obtenir la liste de tous les behaviors qui sont attachés au model
        $behaviors = $this->Category->Behaviors->attached();
    }

Créer des Behaviors
===================

Les behaviors qui sont attachés aux Models voient leurs callbacks appelés
automatiquement. Ces callbacks sont similaires à ceux qu'on trouve dans les
Models : ``beforeFind``, ``afterFind``, ``beforeValidate``, ``afterValidate``,
``beforeSave``, ``afterSave``, ``beforeDelete``, ``afterDelete`` et
``onError``. Regardez :doc:`/models/callback-methods`.

Vos behaviors devront être placés dans ``app/Model/Behavior``. Ils sont
nommés en CamelCase et suffixés par ``Behavior``, par ex. NomBehavior.php.
Il est utile d'utiliser un behavior du coeur comme template quand on crée
son propre behavior. Vous les trouverez dans ``lib/Cake/Model/Behavior/``.

Chaque callback et behavior prend comme premier paramètre, une référence du
model par lequel il est appelé.

En plus de l'implémentation des callbacks, vous pouvez ajouter des réglages
par behavior et/ou par liaison d'un behavior au model. Des
informations à propos des réglages spécifiques peuvent être trouvées dans
les chapitres concernant les behaviors du cœur et leur configuration.

Voici un exemple rapide qui illustre comment les réglages peuvent êtres passés
du model au behavior::

    class Post extends AppModel {
        public $actsAs = array(
            'YourBehavior' => array(
                'option1_key' => 'option1_valeur'
            )
        );
    }

Puisque les behaviors sont partagés à travers toutes les instances de model
qui l'utilisent, une bonne pratique pour stocker les paramètres par nom
d'alias/model qui utilise le behavior. La création des behaviors entraînera
l'appel de leur méthode ``setup()``::

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

Les méthodes du Behavior sont automatiquement disponibles sur tout model
qui 'act as' le behavior. Par exemple si vous avez::

    class Duck extends AppModel {
        public $actsAs = array('Flying');
    }

Vous seriez capable d'appeler les méthodes de ``FlyingBehavior`` comme si
elles étaient des méthodes du model Duck. Quand vous créez des méthodes d'un
behavior, vous obtenez automatiquement une référence du model appelé en
premier paramètre. Tous les autres paramètres fournis sont décalés d'une place
vers la droite. Par exemple::

    $this->Duck->fly('toronto', 'montreal');

Bien que cette méthode prenne deux paramètres, la méthode signature
ressemblerait à cela::

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

    class MyBehavior extends ModelBehavior {
        public $mapMethods = array('/do(\w+)/' => 'doSomething');

        public function doSomething($model, $method, $arg1, $arg2) {
            debug(func_get_args());
            //faire quelque chose
        }
    }

Ce qui est au-dessus mappera chaque méthode ``doXXX()`` appélée vers le
behavior. Comme vous pouvez le voir, le model est toujours le premier
paramètre, mais le nom de la méthode appelée sera le deuxième paramètre.
Cela vous permet de munge le nom de la méthode pour des informations
supplémentaires, un peu comme ``Model::findAllByXX``. Si le behavior
du dessus est attaché à un model, ce qui suit arrivera::

    $model->doReleaseTheHounds('karl', 'lenny');

    // sortira
    'ReleaseTheHounds', 'karl', 'lenny'

Callbacks du Behavior
=====================

Les Behaviors d'un Model peuvent définir un nombre de callbacks qui sont
déclenchés avant les callbacks du model du même nom. Les callbacks
du Behavior vous permettent de capturer des évènements dans les models
attachés et d'augmenter les paramètres ou de les accoler dans un behavior
supplémentaire.

Tous les callbacks des behaviors sont lancés **avant** les callbacks du
model:

-  ``beforeFind``
-  ``afterFind``
-  ``beforeValidate``
-  ``afterValidate``
-  ``beforeSave``
-  ``afterSave``
-  ``beforeDelete``
-  ``afterDelete``

Créer un callback du behavior
-----------------------------

.. php:class:: ModelBehavior

Les callbacks d'un behavior d'un model sont définis comme de simples méthodes
dans votre classe de behavior. Un peu comme les méthodes classiques du
behavior, ils reçoivent un paramètre ``$Model`` en premier argument. Ce
paramètre est le model pour lequel la méthode du behavior a été invoquée.

.. php:method:: setup(Model $Model, array $settings = array())

    Appelée quand un behavior est attaché à un model. Les paramètres viennent
    de la propriété ``$actsAs`` du model attaché.

.. php:method:: cleanup(Model $Model)

    Appelée quand un behavior est détaché d'un model. La méthode de base retire
    les paramètres du model basées sur ``$model->alias``. Vous pouvez écraser
    cette méthode et fournir une fonctionnalité personnalisée nettoyée.

.. php:method:: beforeFind(Model $Model, array $query)

    Si le beforeFind du behavior retourne false, cela annulera le find().
    Retourner un tableau augmentera les paramètres de requête utilisés
    pour l'opération find.

.. php:method:: afterFind(Model $Model, mixed $results, boolean $primary = false)

    Vous pouvez utiliser le afterFind pour augmenter les résultats d'un find.
    La valeur retournée sera passée en résultats soit au behavior suivant dans
    la chaîne, soit au afterFind du model.

.. php:method:: beforeValidate(Model $Model, array $options = array())

    Vous pouvez utiliser beforeValidate pour modifier un tableau de validation
    de model ou gérer tout autrre logique de pré-validation. Retourner false
    d'un callback beforeValidate annulera la validation et entraînera son
    echec.

.. php:method:: afterValidate(Model $Model)

    Vous pouvez utiliser afterValidate pour lancer un nettoyage de données ou
    préparer des données si besoin.

.. php:method:: beforeSave(Model $Model, array $options = array())

    Vous pouvez retourner false d'un beforeSave d'un behavior pour annuler
    la sauvegarde. Retourner true pour permettre de continuer.

.. php:method:: afterSave(Model $Model, boolean $created, array $options = array())

    Vous pouvez utiliser afterSave pour effectuer des opérations de nettoyage
    liées au behavior. $created sera à true quand un enregistrement sera crée,
    et à false quand un enregistrement sera mis à jour.

.. php:method:: beforeDelete(Model $Model, boolean $cascade = true)

    Vous pouvez retourner false d'un beforeDelete d'un behavior pour annuler
    la suppression. Retourne true pour autoriser la suite.

.. php:method:: afterDelete(Model $Model)

    Vous pouvez utiliser afterDelete pour effectuer des opérations de nettoyage
    liées à votre behavior.


.. meta::
    :title lang=fr: Behaviors (Comportements)
    :keywords lang=fr: tree manipulation,manipulation methods,model behaviors,access control list,model class,tree structures,php class,business contract,class category,database table,bakery,inheritance,functionality,interaction,logic,cakephp,models,essence
