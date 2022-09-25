Entities
########

.. php:namespace:: Cake\ORM

.. php:class:: Entity

Tandis que les :doc:`objets Table</orm/table-objects>` représentent et
fournissent un accès à une collection d'objets, les entities représentent des
lignes individuelles ou des objets de domaine dans votre application. Les
entities contiennent des méthodes pour manipuler et accéder aux données qu'elles
contiennent. Les champs sont aussi accessibles en tant que propriétés de
l'objet.

Les entities sont créées pour vous par CakePHP à chaque fois que vous faites une
itération sur l'objet query renvoyé par ``find()`` sur un objet table, ou quand
vous appelez les méthodes  ``all()`` ou ``first()`` sur l'objet query.

Créer des Classes Entity
========================

Vous n'avez pas besoin de créer des classes entity pour utiliser l'ORM dans
CakePHP. Cependant si vous souhaitez avoir de la logique personnalisée dans
vos entities, vous devrez créer des classes. Par convention, les classes
entity se trouvent dans **src/Model/Entity/**. Si notre application a une
table ``articles``, nous pouvons créer l'entity suivante::

    // src/Model/Entity/Article.php
    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
    }

Pour l'instant cette entity ne fait pas grand chose. Cependant quand nous
chargeons les données de notre table articles, nous obtenons des instances
de cette classe.

.. note::

    Si vous ne définissez pas de classe entity, CakePHP va utiliser la classe
    de base Entity.

Créer des Entities
==================

Les Entities peuvent être instanciées directement::

    use App\Model\Entity\Article;

    $article = new Article();

Lorsque vous instanciez une entity, vous pouvez lui passer des champs avec
les données que vous voulez y stocker::

    use App\Model\Entity\Article;

    $article = new Article([
        'id' => 1,
        'title' => 'Nouvel Article',
        'created' => new DateTime('now')
    ]);

Pour obtenir une entity vierge, le meilleur moyen est d'appeler
``newEmptyEntity()`` sur l'objet ``Table``::

    use Cake\ORM\Locator\LocatorAwareTrait;

    $article = $this->fetchTable('Articles')->newEmptyEntity();

    $article = $this->fetchTable('Articles')->newEntity([
        'id' => 1,
        'title' => 'New Article',
        'created' => new DateTime('now')
    ]);

``$article`` sera une instance de ``App\Model\Entity\Article``, ou une instance
de la classe par défaut ``Cake\ORM\Entity`` si vous n'avez pas créé la classe
``Article``.

.. note::

    Avant CakePHP 4.3, il fallait utiliser
    ``$this->getTableLocator->get('Articles')`` pour obtenir une instance de la
    table.

Accéder aux Données de l'Entity
===============================

Les entities fournissent plusieurs façons d'accéder aux données qu'elles
contiennent. La plupart du temps, vous accéderez aux données dans une entity
en utilisant la notation objet::

    use App\Model\Entity\Article;

    $article = new Article;
    $article->title = 'Ceci est mon premier post';
    echo $article->title;

Vous pouvez aussi utiliser les méthodes ``get()`` et ``set()``.

.. php:method:: set($field, $value = null, array $options = [])

.. php:method:: get($field)

Par exemple::

    $article->set('title', 'Ceci est mon premier post');
    echo $article->get('title');

Quand vous utilisez ``set()``, vous pouvez mettre à jour plusieurs champs
en une seule fois en utilisant un tableau::

    $article->set([
        'title' => 'Mon premier post',
        'body' => "C'est le meilleur de tous!"
    ]);

.. warning::

    Lors de la mise à jour des entities avec des données requêtées, vous
    devriez faire une liste des champs qui peuvent être définis par
    assignement de masse.

Vous pouvez vérifier si des champs sont définis dans vos entities avec
``has()``::

    $article = new Article([
        'title' => 'Premier post',
        'user_id' => null
    ]);
    $article->has('title'); // true
    $article->has('user_id'); // false
    $article->has('undefined'); // false.

La méthode ``has()`` va renvoyer ``true`` si un champ est défini est a une
valeur non null. Vous pouvez utiliser ``isEmpty()`` et ``hasValue()`` pour
vérifier si un champ contient une valeur 'non-empty'::

    $article = new Article([
        'title' => 'Premier post',
        'user_id' => null
        'text' => '',
        'links' => []
    ]);
    ]);
    $article->has('title'); // true
    $article->isEmpty('title');  // false
    $article->hasValue('title'); // true

    $article->has('user_id'); // false
    $article->isEmpty('user_id');  // true
    $article->hasValue('user_id'); // false
 
    $article->has('text'); // true
    $article->isEmpty('text');  // true
    $article->hasValue('text'); // false

    $article->has('links'); // true
    $article->isEmpty('links');  // true
    $article->hasValue('links'); // false

    $article->has('text'); // true
    $article->isEmpty('text');  // true
    $article->hasValue('text'); // false

    $article->has('links'); // true
    $article->isEmpty('links');  // true
    $article->hasValue('links'); // false

Accesseurs & Mutateurs
======================

En plus de l'interface simple get/set, les entities vous permettent de fournir
des méthodes accesseurs et mutateurs. Avec ces méthodes, vous pouvez
personnaliser la façon dont les champs sont lus ou définis.

Accesseurs
----------

Les accesseurs personnalisent la façon dont les champs seront lus. Ils suivent
la convention ``_get(NomDuChamp)`` où ``(NomDuChamp)`` est la version CamelCase
du nom du champ (les mots sont accollés avec une majuscule pour la première
lettre de chacun).

Ils reçoivent la valeur basique stockée dans le tableau ``_fields`` pour
seul argument. Par exemple::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected function _getTitle($title)
        {
            return strtoupper($title);
        }
    }

Cet exemple convertit en majuscules la valeur du champ ``title`` à chaque fois
qu'il est lu. Il sera exécuté quand vous récupérerez le champ *via* une de
ces deux manières::

    echo $article->title; // renvoie FOO au lieu de foo
    echo $article->get('title'); // renvoie FOO au lieu de foo

.. note::

    Le code dans vos accesseurs est exécuté à chaque fois que vous faites
    référence au champ. Vous pouvez utiliser une variable locale de la façon
    suivante pour le mettre en cache si vous réalisez une opération gourmande en
    ressources: `$maPropriete = $entity->ma_propriete`.

.. warning::

    Les accesseurs seront utilisés lors de la sauvegarde des entities. Faites
    donc attention lorsque vous définissez des méthodes qui formatent les
    données car ce sont ces données formatées qui seront sauvegardées.

Mutateurs
---------

Avec les mutateurs, vous pouvez personnaliser la façon dont les champs seront
écrits dans l'entity. Ils suivent la convention ``_set(NomDuChamp)`` où
``(NomDuChamp)`` est la version CamelCase du nom du champ.

Les méthodes mutateurs doivent toujours retourner la valeur qui doit être
stockée dans le champ. Vous pouvez aussi utiliser les mutateurs pour définir
simultanément d'autres champs. Quand vous faites
cela, soyez vigilant à ne pas introduire de boucles, car CakePHP n'empêchera pas
les méthodes mutateurs de faire des boucles infinies. Par exemple::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use Cake\Utility\Text;

    class Article extends Entity
    {
        protected function _setTitle($title)
        {
            $this->slug = Text::slug($title);

            return strtouppercase($title);
        }

    }

Cet exemple fait deux choses : il stocke une version modifiée de la valeur
spécifiée dans le champ ``slug`` et stocke une version en majuscules dans
le champ ``titre``. Il sera executé lorsque vous définirez le champ *via* une de
ces deux manières::

    $user->title = 'foo' // définit le champ slug et stocke FOO au lieu de foo
    $user->set('title', 'foo'); // définit le champ slug et stocke FOO au lieu de foo

.. warning::

  Les accesseurs sont également appelés avant que l'entity ne soit persistée
  dans la base. Si vous souhaitez transformer un champ mais ne pas persister la
  transformation, il est recommandé d'utiliser les propriétés virtuelles car
  ces dernières ne seront pas persistées.

.. _entities-virtual-fields:

Créer des Champs Virtuels
-------------------------

En définissant des accesseurs, vous pouvez fournir un accès à des champs qui
n'existent pas réellement. Par exemple si votre table users a des champs
``first_name`` et ``last_name``, vous pouvez créer une méthode pour le nom
complet::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {
        protected function _getFullName()
        {
            return $this->first_name . '  ' . $this->last_name;
        }
    }

Vous pouvez accéder aux champs virtuels comme s'ils existaient sur l'entity.
Le nom du champ sera le nom de la méthode en minuscules, avec des underscores
pour séparer les mots (``full_name``)::

    echo $user->full_name;
    echo $user->get('full_name');

Souvenez-vous que les champs virtuels ne peuvent pas être utilisés dans
les finds. Si vous voulez qu'ils fassent partie des données JSON ou dans des
représentations en tableau de vos entités, reportez-vous à la section
:ref:`exposing-virtual-fields`.

Vérifier si une Entity a été Modifiée
=====================================

.. php:method:: dirty($field = null, $dirty = null)

Vous pourriez vouloir écrire du code conditionnel basé sur l'existence ou non de
modifications dans l'entity. Par exemple, vous pourriez vouloir valider
uniquement les champs lorsqu'ils ont été modifiés::

    // Vérifie si le champ title n'a pas été modifié.
    $article->isDirty('title');

Vous pouvez également marquer un champ comme ayant été modifié. C'est pratique
lorsque vous ajoutez des données dans des champs contenant un tableau car sinon
cela ne marque pas automatiquement le champ comme ayant été modifié, seule la
redéfinition du tableau complet aurait cet effet::

    // Ajoute un commentaire et marque le champ comme modifié.
    $article->comments[] = $nouveauCommentaire;
    $article->setDirty('comments', true);

De plus, vous pouvez également baser votre code conditionnel sur les valeurs
initiales des champs en utilisant la méthode ``getOriginal()``. Cette
méthode retournera soit la valeur initiale de la propriété si elle a été
modifiée soit la valeur actuelle.

Vous pouvez également vérifier si l'un quelconque des champs de l'entity a été
modifié::

    // Vérifier si l'entity a changé
    $article->isDirty();

Pour retirer le marquage *dirty* (modifié) des champs d'une entity, vous pouvez
utiliser la méthode ``clean()``::

    $article->clean();

Lors de la création d'un nouvelle entity, vous pouvez empêcher les champs
d'être marqués *dirty* en passant une option supplémentaire::

    $article = new Article(['title' => 'Nouvel Article'], ['markClean' => true]);

Pour récupérer la liste des propriétés *dirty* d'une ``Entity``, vous pouvez
appeler::

    $dirtyFields = $entity->getDirty();

Erreurs de Validation
=====================

Après avoir :ref:`sauvegardé une entity <saving-entities>`, toute erreur de
validation sera stockée sur l'entity elle-même. Vous pouvez accéder à toutes
les erreurs de validation en utilisant les méthodes ``getErrors()``,
``getError()`` ou ``hasErrors()``::

    // Récupère toutes les erreurs
    $errors = $user->getErrors();

    // Récupère les erreurs pour un seul champ.
    $errors = $user->getError('password');

    // L'entity (ou une entity imbriquée) a-t-elle une erreur ?
    $user->hasErrors();

    // L'entity racine (uniquement) a-t-elle une erreur ?
    $user->hasErrors(false);

Les méthodes ``setErrors()`` et ``setError()`` peuvent aussi être utilisées
pour définir les erreurs sur une entity, ce qui facilite les tests du code qui
fonctionne avec des messages d'erreur::

    $user->setError('password', ['Le mot de passe est obligatoire.']);
    $user->setErrors([
        'password' => ['Le mot de passe est obligatoire'],
        'username' => ['Le nom d\'utilisateur est obligatoire']
    ]);

.. _entities-mass-assignment:

Assignement de Masse
====================

Bien que la définition en masse de champs des entities soit simple et pratique,
elle peut créer d'importants problèmes de sécurité.
Assigner en masse les données d'utilisateur à partir de la requête dans une
entity permet à l'utilisateur de modifier n'importe quelles colonnes (voire
toutes). Utiliser des classes entity anonymes ou créer des classes entity avec
la commande :doc:`/bake` de CakePHP ne protège pas contre l'assignement en
masse.

La propriété ``_accessible`` vous permet de fournir une liste des champs et
d'indiquer s'ils peuvent être assignés en masse ou non. Les valeurs ``true`` et
``false`` indiquent si un champ peut ou ne peut pas être assigné massivement::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected $_accessible = [
            'title' => true,
            'body' => true
        ];
    }

En plus des champs réels, il existe un champ spécial ``*`` qui définit le
comportement par défaut si un champ n'est pas nommé spécifiquement::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected $_accessible = [
            'title' => true,
            'body' => true,
            '*' => false,
        ];
    }

.. note:: Si la propriété ``*`` n'est pas définie, elle sera par défaut à ``false``.

Éviter la Protection Contre l'Assignement de Masse
--------------------------------------------------

Lors de la création d'un nouvelle entity en utilisant le mot clé ``new``, vous
pouvez lui spécifier de ne pas se protéger contre l'assignement de masse::

    use App\Model\Entity\Article;

    $article = new Article(['id' => 1, 'title' => 'Foo'], ['guard' => false]);

Modifier les Champs Protégés à la Volée
---------------------------------------

Vous pouvez modifier à la volée la liste des champs protégés en utilisant la
méthode ``setAccess()``::

    // Rendre user_id accessible.
    $article->setAccess('user_id', true);

    // Rendre title protégé.
    $article->setAccess('title', false);

.. note::

    Modifier des champs accessibles agit seulement sur l'instance sur laquelle
    la méthode est appelée.

Lorsque vous utilisez les méthodes ``newEntity()`` et ``patchEntity()`` dans
les objets ``Table`` vous pouvez également utiliser des options pour
personnaliser la protection de masse. Référez-vous à la section
:ref:`changing-accessible-fields` pour plus d'information.

Outrepasser la Protection de Champ
----------------------------------

Il arrive parfois que vous souhaitiez permettre un assignement en masse aux
champs protégés::

    $article->set($fields, ['guard' => false]);

En définissant l'option ``guard`` à ``false``. vous pouvez ignorer la liste des
champs accessibles pour un appel unique de ``set()``.

Vérifier si une Entity a été Sauvegardée
----------------------------------------

Il est souvent nécessaire de savoir si une entity représente une ligne qui
est déjà présente en base de données. Pour cela, utilisez la méthode
``isNew()``::

    if (!$article->isNew()) {
        echo 'Cette article a déjà été sauvegardé!';
    }

Si vous êtes certains qu'une entity a déjà été sauvegardée, vous pouvez
utiliser ``setNew()``::

    $article->setNew(false);

    $article->setNew(true);

.. _lazy-load-associations:

Lazy Loading des Associations
=============================

Bien que la façon la plus efficace pour accéder à vos associations soit
généralement de les charger en eager loading, il peut arriver que vous ayez
besoin d'utiliser le lazy loading des données associées. Avant de voir comment
utiliser le Lazy loading des associations, nous allons devoir parler des
différences entre le chargement eager et lazy:

Eager loading
    Le Eager loading utilise les joins (quand c'est possible) pour récupérer les
    données de la base de données avec aussi *peu* de requêtes que possible.
    Quand une requête séparée est nécessaire, comme dans le cas d'une
    association HasMany, une requête unique est émise pour récupérer *toutes*
    les données associées pour l'ensemble des objets à récupérer.
Lazy loading
    Le Lazy loading retarde le chargement des données de l'association jusqu'à
    ce que ce soit absolument nécessaire. Si cela peut certes économiser du temps
    CPU car des données possiblement non utilisées ne sont pas hydratées dans
    les objets, cela peut aussi résulter en beaucoup plus de requêtes émises
    vers la base de données. Par exemple faire des boucles sur un ensemble
    d'articles et leurs commentaires va fréquemment émettre N requêtes, où N est
    le nombre d'articles itérés.

Bien que le lazy loading ne soit pas inclus dans l'ORM de CakePHP, vous pouvez
tout simplement utiliser un des plugins de la communauté pour le faire. Nous
recommandons `le plugin LazyLoad <https://github.com/jeremyharris/cakephp-lazyload>`__

Après avoir ajouté le plugin à votre entity, vous pourrez faire ceci::

    $article = $this->Articles->findById($id);

    // La propriété commentaires a été chargée en lazy
    foreach ($article->comments as $comment) {
        echo $comment->body;
    }

Créer du Code Réutilisable avec les Traits
==========================================

Vous pouvez vous retrouver dans un cas où vous avez besoin de la même logique
dans plusieurs classes d'entity. Les traits de PHP sont parfaits pour cela.
Vous pouvez mettre les traits de votre application dans **src/Model/Entity**.
Par convention, les traits dans CakePHP sont suffixés avec ``Trait`` pour
qu'ils soient discernables des classes ou des interfaces. Les traits sont
souvent un bon allié des behaviors, vous permettant de fournir des
fonctionnalités pour les objets table et entity.

Par exemple si nous avions un plugin SoftDeletable, il pourrait fournir un trait.
Ce trait pourrait donner des méthodes pour marquer les entities comme
'supprimées', la méthode ``softDelete`` pouvant être fournie par un trait::

    // SoftDelete/Model/Entity/SoftDeleteTrait.php

    namespace SoftDelete\Model\Entity;

    trait SoftDeleteTrait
    {
        public function softDelete()
        {
            $this->set('deleted', true);
        }
    }

Vous pourriez ensuite utiliser ce trait dans votre classe d'entity par une
importation et une inclusion::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use SoftDelete\Model\Entity\SoftDeleteTrait;

    class Article extends Entity
    {
        use SoftDeleteTrait;
    }

Convertir en Tableaux/JSON
==========================

Lors de la construction d'APIs, il est probable que vous aurez fréquemment
besoin de convertir des entities en tableaux ou en données JSON. CakePHP rend
cela très simple::

    // Obtenir un tableau.
    // Les associations seront aussi converties par toArray().
    $array = $user->toArray();

    // Convertir en JSON
    // Les associations seront aussi converties avec le hook jsonSerialize.
    $json = json_encode($user);

Lors de la conversion d'une entity en JSON, les listes de champs virtuels & cachés
sont utilisées. Les entities sont aussi converties récursivement en JSON.
Cela signifie que si les entities et leurs associations sont chargées en eager
loading, CakePHP va gérer correctement la conversion des données associées dans
le bon format.

.. _exposing-virtual-fields:

Montrer les Champs Virtuels
---------------------------

Par défaut, les champs virtuels ne sont pas exportés lors de la conversion des
entities en tableaux ou en JSON. Pour exposer les champs virtuels, vous devez
les rendre visibles. Lors de la définition de votre
classe entity, vous pouvez fournir une liste de champs virtuels qui
doivent être exposés::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {
        protected $_virtual = ['full_name'];
    }

Cette liste peut être modifiée à la volée en utilisant la méthode
``setVirtual``::

    $user->setVirtual(['full_name', 'is_admin']);

Cacher les Champs
-----------------

Il arrive souvent que vous ne souhaitiez pas exporter certains champs dans
des formats JSON ou en tableau. Par exemple il est souvent mal avisé de montrer
les hashs de mot de passe ou les questions de récupération du compte. Lors de la
définition d'une classe entity, définissez quels champs doivent être cachés::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {
        protected $_hidden = ['password'];
    }

Cette liste peut être modifiée à la volée en utilisant la méthode
``setHidden``::

    $user->setHidden(['password', 'recovery_question']);

Stocker des Types Complexes
===========================

Les accesseurs et mutateurs n'ont pas pour objectif de contenir de
la logique pour sérialiser et desérialiser les données complexes venant de la
base de données. Consultez la section :ref:`saving-complex-types` pour
comprendre la façon dont votre application peut stocker des types de données
complexes comme les tableaux et les objets.

.. meta::
    :title lang=fr: Entities
    :keywords lang=en: entity, entities, single row, individual record
