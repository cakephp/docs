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

Pré-Requis
==========

Ce behavior nécessite que les colonnes suivantes soient présentes dans votre
table:

- ``parent_id`` (nullable) La colonne contenant l'ID de la ligne parente
- ``lft`` (integer) Utilisé pour maintenir la structure en arbre
- ``rght`` (integer) Utilisé pour maintenir la structure en arbre

Vous pouvez configurer le nom de ces champs.
Plus d'informations sur la signification des champs et comment ils sont utilisés
peuvent être trouvées dans cet article décrivant la
`MPTT logic <http://www.sitepoint.com/hierarchical-data-database-2/>`_

.. warning::
    TreeBehavior ne supporte pas les clés primaire composite pour le moment.

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

Obtenir une liste flat des descendants pour un noeud est également facile::

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

    // Dans un fichier de template CakePHP:
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

Une tâche habituelle est de trouver le chemin du tree à partir d'un noeud
particulier vers la racine du tree. Cela est utile par exemple pour ajouter
une liste breadcrumbs pour une structure de menu::

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

Configuration
=============

If the default column names that are used by this behavior don't match your own
schema, you can provide aliases for them::

    public function initialize(array $config) {
        $this->addBehavior('Tree', [
            'parent' => 'ancestor_id', // Use this instead of parent_id,
            'left' => 'tree_left', // Use this instead of lft
            'right' => 'tree_right' // Use this instead of rght
        ]);
    }

Scoping and Multi Trees
=======================

Sometimes you want to persist more than one tree structure inside the same
table, you can achieve that by using the 'scope' configuration. For example, in
a locations table you may want to create one tree per country::

    class LocationsTable extends Table {

        public function initialize(array $config) {
            $this->addBehavior('Tree', [
                'scope' => ['country_name' => 'Brazil']
            ]);
        }

    }

In the previous example, all tree operations will be scoped to only the rows
having the column ``country_name`` set to 'Brazil'. You can change the scoping
on the fly by using the 'config' function::

    $this->behaviors->Tree->config('scope', ['country_name' => 'France']);

Optionally, you can have a finer grain control of the scope by passing a closure
as the scope::

    $this->behaviors->Tree->config('scope', function($query) {
        $country = $this->getConfigureContry(); // A made-up function
        return $query->where(['country_name' => $country]);
    });

Saving Hierarchical Data
========================

When using the Three behavior, you usually don't need to worry about the
internal representation of the hierarchical structure. The positions where nodes
are placed in the tree are deduced from the 'parent_id' column in each of your
entities::

    $aCategory = $categoriesTable->get(10);
    $aCategory->parent_id = 5;
    $categoriesTable->save($aCategory);

Providing inexistent parent ids when saving or attempting to create a loop in
the tree (making a node child of itself) will throw an exception.

You can make a node a root in the tree by setting the 'parent_id' column to
null::

    $aCategory = $categoriesTable->get(10);
    $aCategory->parent_id = null;
    $categoriesTable->save($aCategory);

Children for the new root node will be preserved.

Deleting Nodes
==============

Deleting a node and all its sub-tree (any children it may have at any depth in
the tree) is trivial::

    $aCategory = $categoriesTable->get(10);
    $categoriesTable->delete($aCategory);

The TreeBehavior will take care of all internal deleting operations for you. It
is also possible to Only delete one node and re-assign all children to the
immediately superior parent node in the tree::

    $aCategory = $categoriesTable->get(10);
    $categoriesTable->removeFromTree($aCategory);
    $categoriesTable->delete($aCategory);

All children nodes will be kept and a new parent will be assigned to them.
