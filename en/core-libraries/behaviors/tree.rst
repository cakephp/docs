TreeBehavior
############

.. php:namespace:: Cake\Model\Behavior

.. php:class:: TreeBehavior

It's fairly common to want to store hierarchical data in a database
table. Examples of such data might be categories with unlimited
subcategories, data related to a multilevel menu system or a
literal representation of hierarchy such as a departments in company.

Relational databases are usually not well suited for storing and retrieving this
type of data, but there are a few known techniques that can make them effective
for working with multi-level information.

The TreeBehavior helps you maintain a hierarchical data structure in the
database that can be queried without much overhead and helps reconstruct the
tree data for finding and displaying processes.

Requirements
============

This behavior requires the following columns in your table:

- ``parent_id`` (nullable) The column holding the ID of the parent row
- ``lft`` (integer) Used to maintain the tree structure
- ``rght`` (integer) Used to maintain the tree structure

You can configure the name of those fields should you need to customize them.
More information on the meaning of the fields and how they are used can be found
in this article describing the `MPTT logic <http://www.sitepoint.com/hierarchical-data-database-2/>`_

.. warning::

    The TreeBehavior does not support composite primary keys at this point in
    time.

A Quick Tour
============

You enable the Tree behavior by adding it to the Table you want to store
hierarchical data in::

    class CategoriesTable extends Table {
        public function initialize(array $config) {
            $this->addBehavior('Tree');
        }
    }

Once added, you can let CakePHP build the internal structure if the table is
already holding some rows::

    $categories = TableRegistry::get('Categories');
    $categories->recover();

You can verify it works by getting any row from the table and asking for the
count of descendants it has::

    $node = $categories->get(1);
    echo $categories->childCount($node);

Getting a flat list of the descendants for a node is equally easy::

    $descendants = $categories->find('children', ['for' => 1]);

    foreach ($descendants as $category) {
        echo $category->name . "\n";
    }

If you instead need a threaded list, where children for each node are nested
in a hierarchy, you can stack the 'threaded' finder::

    $children = $categories
        ->find('children', ['for' => 1])
        ->find('threaded')
        ->toArray();

    foreach ($children as $child) {
        echo "{$child->name} has " . count($child->children) . " direct children";
    }

Traversing threaded results usually requires recursive functions in, but if you
only require a result set containing a single field from each level so you can
display a list, in an HTML select for example, it is better to use the
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

    // Move the node to the bottom
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

    $this->behaviors()->Tree->config('scope', ['country_name' => 'France']);

Optionally, you can have a finer grain control of the scope by passing a closure
as the scope::

    $this->behaviors()->Tree->config('scope', function($query) {
        $country = $this->getConfigureContry(); // A made-up function
        return $query->where(['country_name' => $country]);
    });

Saving Hierarchical Data
========================

When using the Tree behavior, you usually don't need to worry about the
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
