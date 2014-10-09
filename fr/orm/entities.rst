Entities
########

.. php:namespace:: Cake\ORM

.. php:class:: Entity

Alors que :doc:`/orm/table-objects` représentent et fournissent un accès à une
collection d'objets, les entities représentent des lignes individuelles ou
des objets de domaine dans votre application. Les entities contiennent des
propriétés persistentes et des méthodes pour manipuler et accéder aux données
qu'ils contiennent.

Les entities sont créés pour vous par CakePHP à chaque fois que vous utilisez
``find()`` sur un objet table.

Créer des Classes Entity
========================

Vous n'avez pas besoin de créer des classes entity pour utiliser l'ORM dans
CakePHP. Cependant si vous souhaitez avoir de la logique personnalisée dans
vos entities, vous devrez créer des classes. Par convention, les classes
entity se trouvent dans ``src/Model/Entity/``. Si notre application a une
table ``articles``, nous pourrions créer l'entity suivante::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity {
    }

Pour l'instant cette entity ne fait pas grand chose. Cependant quand nous
chargeons les données de notre table articles, nous obtiendrons des instances
de cette classe.

.. note::

    Si vous ne définissez pas de classe entity, CakePHP va utiliser la classe
    de base Entity.

Accéder aux Données de l'Entity
===============================

Les entities fournissent quelques façons d'accéder aux données qu'ils
contiennent. La plupart du temps, vous accéderez aux données dans une entity
en utilisant la notation objet::

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
    devriez faire une liste des champs qui peuvent être définis avec
    mass assignment.

Accesseurs & Mutateurs
======================

.. php:method:: set($field = null, $value = null)

En plus de l'interface simple get/set, les entities vous permettent de fournir
des méthodes accesseurs et mutateurs. Ces méthodes vous laissent personnaliser
la façon dont les propriétés sont lues ou définies. Par exemple::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity {
        protected function _getTitle($title) {
            return ucwords($title);
        }
    }

Les accesseurs utilisent la convention ``_get`` suivi par la version en camel
case du nom du champ. Ils reçoivent la valeur basique stockée dans le tableau
``_properties`` pour seul argument. Vous pouvez personnaliser la façon dont
les propriétés sont récupérées/définies en définissant un mutateur::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use Cake\Utility\Inflector;

    class Article extends Entity {

        protected function _setTitle($title) {
            $this->set('slug', Inflector::slug($title));
            return $title;
        }

    }

Les méthodes mutateur doivent toujours retourner la valeur qui doit être
stockée dans la propriété. Comme vous pouvez le voir au-dessus, vous pouvez
aussi utiliser les mutateurs pour définir d'autres propriétés calculées. En
faisant cela, attention à ne pas introduire de boucle, puisque CakePHP
n'empêchera pas les méthodes mutateur de faire des boucles infinies. Les
mutateurs vous permettent de facilement convertir les propriétés puisqu'elles
sont définies ou de créer des données calculées. Les mutateurs et accesseurs
sont appliqués quand les propriétés sont lus en utilisant la notation objet
ou en utilisant get() et set().

Créer des Propriétés Virtuelles
-------------------------------

En définissant des accesseurs, vous pouvez fournir un accès aux propriétés
qui n'existent pas réellement. Par exemple si votre table users a
``first_name`` et ``last_name``, vous pouvez créer une méthode pour le nom
complet::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity {

        protected function _getFullName() {
            return $this->_properties['first_name'] . '  ' .
                $this->_properties['last_name'];
        }

    }

Vous pouvez accéder aux propriétés virtuelles puisqu'elles existent sur
l'entity. Le nom de la propriété sera la version en minuscule et en underscore
de la méthode::

    echo $user->full_name;

Souvenez-vous que les propriétés virtuelles ne peuvent pas être utilisées dans
les finds.

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
une entity, facilitant le code de test qui fonctionne avec les messages
d'erreur::

    $user->errors('password', ['Password is required.']);

.. _entities-mass-assignment:

Mass Assignment
===============

Alors que la définition des propriétés en entites in bulk est simple et
pratique, il peut créer des problèmes importants de sécurité.
Assigner Bulk les données d'utilisateur à partir de la requête dans une
entity permet à l'utilisateur de modifier une et toutes les colonnes. Par
défaut CakePHP protecte contre l'assignement massif et vous fait faire une
liste des champs qui sont assignables massivement.

La propriété ``_accessible`` vous permet de fournir un map des propriétés et
si oui ou non ils peuvent être assigné en masse. Les valeurs ``true`` et
``false`` indiquent si un champ peut ou ne peut pas être assigné massivement::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity {
        protected $_accessible = [
            'title' => true,
            'body' => true,
        ];
    }

En plus des champs réels, il existe un champ spécial ``*`` qui définit le
bahavior fallback si un champ n'est pas nommé spécifiquement::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class Article extends Entity {
        protected $_accessible = [
            'title' => true,
            'body' => true,
            '*' => false,
        ];
    }

Si la propriété ``*`` n'est pas définie, elle sera par défaut à ``false``.

Modifier les Champs Gardés à l'Execution
----------------------------------------

Vous pouvez modifier la liste des champs gardés à la volée en utilisant la
méthode ``accessible``::

    // Rendre user_id accessible.
    $article->accessible('user_id', true);

    // Rendre title guarded.
    $article->accessible('title', false);

.. note::

    Modifier des champs accessibles agissent seulement sur l'instance de la
    méthode sur laquelle il est appelé.


Outrepasser le Champ Gardé
--------------------------

Il arrive des fois où vous voulez permettre un mass-assignment aux champs
gardés::

    $article->set($properties, ['guard' => false]);

En définissant l'option ``guard`` à false, vous pouvez ignorer la liste des
champs accessible pour un appel unique de ``set()``.


.. _lazy-load-associations:

Associations Lazy Loading
=========================

Alors que les associations chargées eager sont généralement la façon la plus
efficace pour accéder à vos associations, il peut arriver des fois où vous
avez besoin de charger lazily les données associées. Avant de voir comment
faire avec des associations chargé en lazy, nous devrions discuter des
différences entre le chargement des associations eager et lazy:

Eager loading
    Le chargement Eager utilise les joins (si possible) pour récupérer les
    données de la base de données avec aussi *peu* de requêtes que possible.
    Quand une requête séparée est nécessaire comme dans le cas d'une
    association HasMany, une requête unique est émise pour récupérer *toutes*
    les données associées pour l'ensemble courant d'objets.
Lazy loading
    Le chargement Lazy defers le chargement des données de l'association jusqu'à
    ce que ce soit complètement nécessaire. Alors que ceci peut sauver du temps
    CPU car des données possiblement non utilisées ne sont pas hydratées dans
    les objets, cela peut résulter en plus de requêtes émises vers la base de
    données. Par exemple faire des boucles sur un ensemble d'articles et leurs
    commentaires va fréquemment émettre N requêtes où N est le nombre d'articles
    étant itérés.

Alors que le chargement lazy n'est pas inclu par l'ORM de CakePHP, il n'est
pas difficile de l'intégrer vous-même quand et où vous le souhaitez. Lors
de l'implémentation d'une méthode accesseur, vous pouvez charger lazily les
données associées::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use Cake\ORM\TableRegistry;

    class Article extends Entity {

        protected function _getComments() {
            $comments = TableRegistry::get('Comments');
            return $comments->find('all')
                ->where(['article_id' => $this->id])
                ->all();
        }

    }

Intégrer la méthode ci-dessus va vous permettre de faire ce qui suit::

    $article = $this->Articles->findById($id);
    foreach ($article->comments as $comment) {
        echo $comment->body;
    }

Créer du Code Re-utilisable avec les Traits
===========================================

Vous pouvez vous retrouver dans un cas où vous avez besoin de la même logique
dans plusieurs classes d'entity. Les traits de PHP sont parfaits pour cela.
Vous pouvez mettre les traits de votre application dans ``src/Model/Entity``.
Par convention, les traits dans CakePHP sont suffixés avec ``Trait`` pour
qu'ils sont facilement discernables des classes ou des interfaces. Les traits
sont souvent un bon allié des behaviors, vous permettant de fournir des
fonctionnalités pour la table et les objets entity.

Par exemple si vous avez un plugin SoftDeletable, il pourrait fournir un trait.
Ce trait pourrait donner des méthodes pour rendre les entities comme
'supprimé', la méthode ``softDelete`` pourrait être fournie par un trait::

    // SoftDelete/Model/Entity/SoftDeleteTrait.php

    namespace SoftDelete\Model\Entity;

    trait SoftDeleteTrait {

        public function softDelete() {
            $this->set('deleted', true);
        }

    }

Vous pourriez ensuite utiliser ce trait dans votre classe entity en l'intégrant
et en l'incluant::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;
    use SoftDelete\Model\Entity\SoftDeleteTrait;

    class Article extends Entity {
        use SoftDeleteTrait;
    }

Convertir en Tableaux/JSON
==========================

Lors de la construction d'APIs, vous avez peut-être besoin de convertir des
entities en tableaux ou en données JSON. CakePHP facilite cela::

    // Obtenir un tableau.
    $array = $user->toArray();

    // Convertir en JSON
    $json = json_encode($user);

Lors de la conversion d'une entity en tableau/JSON, les listes de champ
virtuel & caché sont utilisés. Les entities sont convertis aussi de façon
récursive. Cela signifie que si vous chargez eager les entities avec leurs
associations, CakePHP va correctement gérer la conversion des données associées
dans le bon format.

Montrer les Propriétés Virtuelles
---------------------------------

Par défaut, les propriétés virtuelles ne sont pas exportées lors de la
conversion des entities en tableaux ou JSON. Afin d'exposer les propriétés
virtuelles, vous devez les rendre visibles. Lors de la définition de votre
classe entity, vous pouvez fournir une liste de champs virtuels qui doivent
être exposés::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity {

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
être cachés::

    namespace App\Model\Entity;

    use Cake\ORM\Entity;

    class User extends Entity {

        protected $_hidden = ['password'];

    }

Cette liste peut être modifiée à la volée en utilisant ``hiddenProperties``::

    $user->hiddenProperties(['password', 'recovery_question']);

Stocker des Types Complexes
===========================

Les entities n'ont pas pour objectif de contenir de la logique pour sérialiser
et desérialiser les données complexes venant de la base de données. Réferez-vous
à la section :ref:`saving-complex-types` pour comprendre la façon dont votre
application peut stocker des types de données complexe comme les tableaux et les
objets.
