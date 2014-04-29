TreeBehavior
############

.. php:namespace:: Cake\Model\Behavior

.. php:class:: TreeBehavior

Il est courant de vouloir stocker des données hierarchisées dans une table de
base de données. Des exemples de ce type de données pourrait être des catégories
sans limite de sous-catégories, les données liées à un système de menu
multiniveau ou une représentation littérale de la hiérarchie comme un
département dans une entreprise.

Les bases de données relationnelles ne sont couramment pas utilisées pour le
stockage et la récupération de ce type de données, mais il y a quelques
techniques connues qui les rendent possible pour fonctionner avec une
information multi-niveau.

Le TreeBehavior vous aide à maintenir une structure de données hierarchisée
dans la base de données qui peut être requêtée facilement et aide à reconstruire
les données en arbre pour trouver et afficher les processus.

Requirements
============

Ce behavior nécessite que les colonnes suivantes soient présentes dans votre
table:

- ``parent_id`` (nullable) La colonne contenant l'ID de la ligne parente
- ``lft`` (integer) Utilisé pour maintenir la structure en arbre
- ``rght`` (integer) Utilisé pour maintenir la structure en arbre

Vous pouvez configurer le nom de ces champs.
Plus d'informations sur la signification des champs et comment ils sont utilisés
peuvent être trouvées dans cet article décrivant la
`MPTT logic <http://www.sitepoint.com/hierarchical-data-database-2/>`_

Un Aperçu Rapide
================

Vous activez le behavior Tree en l'ajoutant à la Table où vous voulez stocker
les données hierarchisées dans::

    class CategoriesTable extends Table {
        public function initialize(array $config) {
            $this->addBehavior('Tree');
        }
    }

Une fois ajoutées, vous pouvez laisser CakePHP construire la structure interne
si la table contient déjà quelques lignes::

    $categories = TableRegistry::get('Categories');
    $categories->recover();

Vous pouvez vérifier que cela fonctionne en récupérant toute ligne de la table
et en demandant le nombre de descendants qu'il a::

    $node = $categories->get(1);
    echo $categories->childCount($node);

Obtenir une liste flat list des descendants pour un noeud est également facile::

    $descendants = $categories->find('children', ['for' => 1]);

    foreach ($descendants as $category) {
        echo $category->name . "\n";
    }

Si à la place, vous avez besoin d'une liste threaded, où les enfants pour
chaque noeud sont imbriqués dans une hierarchie, vous pouvez stack le
finder 'threaded'::

    $children = $categories
        ->find('children', ['for' => 1])
        ->find('threaded')
        ->toArray();

    foreach ($children as $child) {
        echo "{$child->name} has " . count($child->children) . " direct children";
    }

Traversing threaded results usually requires recursive functions in, but if you
only require a result set containing a single field from each level so you can
display a list, in an HTML select for example, it is better to just use the
'treeList' finder::

    $list = $categories->find('treeList');

    // In a CakePHP template file:
    echo $this->Form->input('categories', ['options' => $list]);

    // Or you can output it in plain text, for example in a CLI script
    foreach ($list as $categoryName) {
        echo $categoryName . "\n";
    }

The output will be similar to::

    My Categories
    _Fun
    __Sport
    ___Surfing
    ___Skating
    _Trips
    __National
    __International

One very common task is to find the tree path from a particular node to the root
of the tree. This is useful, for example, for adding the breadcrumbs list for
a menu structure::

    $nodeId = 5;
    $crumbs = $categories->find('path', ['for' => $nodeId]);

    foreach ($crumbs as $crumb) {
        echo $crumb->name . ' > ';
    }

Trees constructed with the TreeBehavior cannot be sorted by any column other
than ``lft``, this is because the internal representation of the tree depends on
this sorting. Luckily, you can reorder the nodes inside the same level without
having to change their parent::

    $node = $categories->get(5);

    // Move the node so it shows up one position up when listing children
    $categories->moveUp($node);

    // Move the node to the top of the list inside the same level
    $categories->moveUp($node, true);

    //Move the node to the bottom
    $categories->moveDown($node, true);
