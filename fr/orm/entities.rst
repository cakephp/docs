Entities
########

.. php:namespace:: Cake\ORM

.. php:class:: Entity

Alors que les :doc:`objets Table</orm/table-objects>` représentent et
fournissent un accès à une collection d'objets, les entities représentent des
lignes individuelles ou des objets de domaine dans votre application. Les
entities contiennent des propriétés et des méthodes persistantes pour manipuler
et accéder aux données qu'ils contiennent.

Les entities sont créées pour vous par CakePHP à chaque fois que vous utilisez
``find()`` sur un objet table.

Créer des Classes Entity
========================

Vous n'avez pas besoin de créer des classes entity pour utiliser l'ORM dans
CakePHP. Cependant si vous souhaitez avoir de la logique personnalisée dans
vos entities, vous devrez créer des classes. Par convention, les classes
entity se trouvent dans **src/Model/Entity/**. Si notre application a une
table ``articles``, nous pourrions créer l'entity suivante::

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

Lorsque vous instanciez une entity, vous pouvez lui passer des propriétés avec
les données que vous voulez y stocker::

    use App\Model\Entity\Article;

    $article = new Article([
        'id' => 1,
        'title' => 'New Article',
        'created' => new DateTime('now')
    ]);

Une autre approche pour récupérer une nouvelle entity est d'utiliser la méthode
``newEntity()`` de l'objet ``Table``::

    use Cake\ORM\TableRegistry;

    $article = TableRegistry::get('Articles')->newEntity();
    $article = TableRegistry::get('Articles')->newEntity([
        'id' => 1,
        'title' => 'New Article',
        'created' => new DateTime('now')
    ]);

Accéder aux Données de l'Entity
===============================

Les entities fournissent quelques façons d'accéder aux données qu'elles
contiennent. La plupart du temps, vous accéderez aux données dans une entity
en utilisant la notation objet::

    use App\Model\Entity\Article;

    $article = new Article;
    $article->title = 'Ceci est mon premier post';
    echo $article->title;

Vous pouvez aussi utiliser les méthodes ``get()`` et ``set()``::

    $article->set('title', 'Ceci est mon premier post');
    echo $article->get('title');

Quand vous utilisez ``set()``, vous pouvez mettre à jour plusieurs propriétés
en une fois en utilisant un tableau::

    $article->set([
        'title' => 'Mon premier post',
        'body' => "C'est le meilleur de tous!"
    ]);

.. warning::

    Lors de la mise à jour des entities avec des données requêtées, vous
    devriez faire une liste des champs qui peuvent être définis par
    assignement de masse.

Accesseurs & Mutateurs
======================

En plus de l'interface simple get/set, les entities vous permettent de fournir
des méthodes accesseurs et mutateurs. Ces méthodes vous laissent personnaliser
la façon dont les propriétés sont lues ou définies.

Les accesseurs utilisent la convention ``_get`` suivi par la version en camel
case du nom du champ.

.. php:method:: get($field)

Ils reçoivent la valeur basique stockée dans le tableau ``_properties`` pour
seul argument.
Les accesseurs seront utilisés lors de la sauvegarde des entities. Faites donc
attention lorsque vous définissez des méthodes qui formatent les données car ce
sont ces données formatées qui seront sauvegardées. Par example::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected function _getTitle($title)
        {
            return ucwords($title);
        }
    }

Les accesseurs seront utilisés quand vous récupérerez la propriété via une de
ces deux manières::

    echo $user->title;
    echo $user->get('title');

Vous pouvez personnaliser la façon dont les propriétés sont récupérées/définies
en définissant un mutateur:

.. php:method:: set($field = null, $value = null)

Les méthodes mutateurs doivent toujours retourner la valeur qui doit être
stockée dans la propriété. Comme vous pouvez le voir au-dessus, vous pouvez
aussi utiliser les mutateurs pour définir d'autres propriétés calculées. En
faisant cela, attention à ne pas introduire de boucles, puisque CakePHP
n'empêchera pas les méthodes mutateur de faire des boucles infinies. Les
mutateurs vous permettent de convertir les propriétés lorsqu'elles sont définies
ou de créer des données calculées. Les mutateurs et accesseurs sont appliqués
quand les propriétés sont lues en utilisant la notation objet ou en utilisant
get() et set(). Par exemple::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use Cake\Utility\Text;

    class Article extends Entity
    {

        protected function _setTitle($title)
        {
            $this->set('slug', Text::slug($title));
            return $title;
        }

    }

Les mutateurs seront utilisés lorsque vous définirez une propriété via une de
ces deux manières::

    $user->title = 'foo' // slug sera aussi défini
    $user->set('title', 'foo'); // slug sera aussi défini

.. _entities-virtual-properties:

Créer des Propriétés Virtuelles
-------------------------------

En définissant des accesseurs, vous pouvez fournir un accès aux
champs/propriétés qui n'existent pas réellement. Par exemple si votre table
users a ``first_name`` et ``last_name``, vous pouvez créer une méthode pour le
nom complet::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {

        protected function _getFullName()
        {
            return $this->_properties['first_name'] . '  ' .
                $this->_properties['last_name'];
        }

    }

Vous pouvez accéder aux propriétés virtuelles puisqu'elles existent sur
l'entity. Le nom de la propriété sera la version en minuscule et en underscore
de la méthode::

    echo $user->full_name;

Souvenez-vous que les propriétés virtuelles ne peuvent pas être utilisées dans
les finds. Si vous voulez que les propriétés virtuelles fassent parties des
données affichées lorsque vous affichez les représentations JSON ou en tableau
de vos entités, reportez-vous à la section :ref:`exposing-virtual-properties`.

Vérifier si une Entity a été Modifiée
=====================================

.. php:method:: dirty($field = null, $dirty = null)

Vous pourriez vouloir écrire du code conditionnel basé sur si oui ou non
les propriétés ont été modifiées dans l'entity. Par exemple, vous pourriez
vouloir valider uniquement les champs lorsqu'ils ont été modifiés::

    // Vérifie si le champ title n'a pas été modifié.
    $article->dirty('title');

Vous pouvez également marquer un champ comme ayant été modifié. C'est pratique
lorsque vous ajoutez des données dans un tableau de propriétés::

    // Ajoute un commentaire et marque le champ comme modifié.
    $article->comments[] = $newComment;
    $article->dirty('comments', true);

De plus, vous pouvez également baser votre code conditionnel sur les valeurs
initiales des propriétés en utilisant la méthode ``getOriginal()``. Cette
méthode retournera soit la valeur initiale de la propriété si elle a été
modifiée soit la valeur actuelle.

Vous pouvez également vérifier si une des propriétés de l'entity a été
modifiée::

    // Vérifier si l'entity a changé
    $article->dirty();

Pour retirer le marquage dirty des champs d'une entity, vous pouvez utiliser
la méthode ``clean()``::

    $article->clean();

Lors de la création d'un nouvelle entity, vous pouvez empêcher les champs
d'être marqués dirty en passant une option supplémentaire::

    $article = new Article(['title' => 'New Article'], ['markClean' => true]);

Erreurs de Validation
=====================

.. php:method:: errors($field = null, $errors = null)

Après avoir :ref:`sauvegardé une entity <saving-entities>` toute erreur de
validation sera stockée sur l'entity elle-même. Vous pouvez accéder à toutes
les erreurs de validation en utilisant la méthode ``errors()``::

    // Récupère toutes les erreurs
    $errors = $user->errors();

    // Récupère les erreurs pour un champ unique.
    $errors = $user->errors('password');

La méthode ``errors()`` peut aussi être utilisée pour définir les erreurs sur
une entity, facilitant les tests du code qui fonctionne avec les messages
d'erreur::

    $user->errors('password', ['Password is required.']);

.. _entities-mass-assignment:

Assignement de Masse
====================

Alors que la définition des propriétés des entities en masse est simple et
pratique, elle peut créer des problèmes importants de sécurité.
Assigner en masse les données d'utilisateur à partir de la requête dans une
entity permet à l'utilisateur de modifier n'importe quelles (voir toutes) les
colonnes. Quand vous utilisez les classes entity anonymes, CakePHP ne protège
pas contre l'assignement en masse. Vous pouvez vous protéger de l'assignement de
masse en utilisant :doc:`la commande bake </bake>` pour générer vos entities.

La propriété ``_accessible`` vous permet de fournir une liste des champs et
si oui ou non ils peuvent être assignés en masse. Les valeurs ``true`` et
``false`` indiquent si un champ peut ou ne peut pas être assigné massivement::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity
    {
        protected $_accessible = [
            'title' => true,
            'body' => true,
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

Eviter la Protection Contre l'Assignement de Masse
--------------------------------------------------

lors de la création d'un nouvelle entity via le mot clé ``new`` vous pouvez
lui spécifier de ne pas se protéger contre l'assignement de masse::

    use App\Model\Entity\Article;

    $article = new Article(['id' => 1, 'title' => 'Foo'], ['guard' => false]);

Modifier les Champs Protégés à l'Exécution
------------------------------------------

Vous pouvez modifier la liste des champs protégés à la volée en utilisant la
méthode ``accessible``::

    // Rendre user_id accessible.
    $article->accessible('user_id', true);

    // Rendre title protégé.
    $article->accessible('title', false);

.. note::

    Modifier des champs accessibles agit seulement sur l'instance de la
    méthode sur laquelle il est appelé.

Lorsque vous utilisez les méthodes ``newEntity()`` et ``patchEntity()`` dans
les objets ``Table`` vous avez également le contrôle sur la protection de
masse. Référez vous à la section to the :ref:`changing-accessible-fields`
pour plus d'information.

Outrepasser la Protection de Champ
----------------------------------

Il arrive parfois que vous souhaitiez permettre un assignement en masse aux
champs protégés::

    $article->set($properties, ['guard' => false]);

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
utiliser ``isNew()`` en tant que setter::

    $article->isNew(false);

    $article->isNew(true);

.. _lazy-load-associations:

Lazy Loading des Associations
=============================

Alors que les associations chargées en eager loading sont généralement la
façon la plus efficace pour accéder à vos associations, il peut arriver que
vous ayez besoin d'utiliser le lazy loading des données associées. Avant de
voir comment utiliser le Lazy loading d'associations, nous devrions
discuter des différences entre le chargement des associations eager et lazy:

Eager loading
    Le Eager loading utilise les joins (si possible) pour récupérer les
    données de la base de données avec aussi *peu* de requêtes que possible.
    Quand une requête séparée est nécessaire comme dans le cas d'une
    association HasMany, une requête unique est émise pour récupérer *toutes*
    les données associées pour l'ensemble courant d'objets.
Lazy loading
    Le Lazy loading diffère le chargement des données de l'association jusqu'à
    ce que ce soit complètement nécessaire. Alors que ceci peut sauver du temps
    CPU car des données possiblement non utilisées ne sont pas hydratées dans
    les objets, cela peut résulter en plus de requêtes émises vers la base de
    données. Par exemple faire des boucles sur un ensemble d'articles et leurs
    commentaires va fréquemment émettre N requêtes où N est le nombre d'articles
    étant itérés.

Bien que le lazy loading n'est pas inclus dans l'ORM de CakePHP, vous pouvez
utiliser un des plugins de la communauté. Nous recommandons le `plugin LazyLoad
<https://github.com/jeremyharris/cakephp-lazyload>`__

Après avoir ajouté le plugin à votre entity, vous pourrez le faire avec ce qui
suit::

    $article = $this->Articles->findById($id);

    // La propriété comments a été chargé en lazy
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
fonctionnalités pour la table et les objets entity.

Par exemple si nous avons un plugin SoftDeletable, il pourrait fournir un trait.
Ce trait pourrait donner des méthodes pour rendre les entities comme
'supprimé', la méthode ``softDelete`` pourrait être fournie par un trait::

    // SoftDelete/Model/Entity/SoftDeleteTrait.php

    namespace SoftDelete\Model\Entity;

    trait SoftDeleteTrait
    {

        public function softDelete()
        {
            $this->set('deleted', true);
        }

    }

Vous pourriez ensuite utiliser ce trait dans votre classe entity en l'intégrant
et en l'incluant::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use SoftDelete\Model\Entity\SoftDeleteTrait;

    class Article extends Entity
    {
        use SoftDeleteTrait;
    }

Convertir en Tableaux/JSON
==========================

Lors de la construction d'APIs, vous avez peut-être besoin de convertir des
entities en tableaux ou en données JSON. CakePHP facilite cela::

    // Obtenir un tableau.
    // Les associations seront aussi converties avec toArray().
    $array = $user->toArray();

    // Convertir en JSON
    // Les associations seront aussi converties avec le hook jsonSerialize.
    $json = json_encode($user);

Lors de la conversion d'une entity en JSON, les listes de champ virtuel & caché
sont utilisées. Les entities sont converties aussi de façon récursive en JSON.
Cela signifie que si les entities et leurs associations sont chargées en eager
loading, CakePHP va correctement gérer la conversion des données associées dans
le bon format.

.. _exposing-virtual-properties:

Montrer les Propriétés Virtuelles
---------------------------------

Par défaut, les propriétés virtuelles ne sont pas exportées lors de la
conversion des entities en tableaux ou JSON. Afin de montrer les propriétés
virtuelles, vous devez les rendre visibles. Lors de la définition de votre
classe entity, vous pouvez fournir une liste de propriétés virtuelles qui
doivent être exposées::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {

        protected $_virtual = ['full_name'];

    }

Cette liste peut être modifiée à la volée en utilisant ``virtualProperties``::

    $user->virtualProperties(['full_name', 'is_admin']);

Cacher les Propriétés
---------------------

Il arrive souvent que vous ne souhaitiez pas exporter certains champs dans
des formats JSON ou tableau. Par exemple il n'est souvent pas sage de montrer
les hashs de mot de passe ou les questions pour retrouver son compte. Lors
de la définition d'une classe entity, définissez les propriétés qui doivent
être cachées::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity
    {

        protected $_hidden = ['password'];

    }

Cette liste peut être modifiée à la volée en utilisant ``hiddenProperties``::

    $user->hiddenProperties(['password', 'recovery_question']);

Stocker des Types Complexes
===========================

Les méthodes "accesseurs" et "mutateurs" n'ont pas pour objectif de contenir de
la logique pour sérialiser et desérialiser les données complexes venant de la
base de données. Consultez la section :ref:`saving-complex-types` pour
comprendre la façon dont votre application peut stocker des types de données
complexes comme les tableaux et les objets.
